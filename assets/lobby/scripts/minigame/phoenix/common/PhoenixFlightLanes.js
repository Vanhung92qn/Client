// PhoenixFlightLanes - HE LAN ne/trung + MAY TRANG THAI ANIMATION day du (client).
// Nhan bien dao server (flyingEvent cL/aL/bId/aId). Dung HET anim phuong:
//   cat canh: jump -> fly | ne: fly_up/fly_down -> fly | trung: die -> revive_loop (trung) |
//   ve dau sau chet: revive_to_idle -> idle1 | ve dau khi con song: fly_retune -> idle1.
// Component DUY NHAT dieu khien vi tri + anim phuong (client khong co SpaceShip san).
// World-space: phuong & lane khac parent van dung.

cc.Class({
    extends: cc.Component,

    properties: {
        phoenixNode: cc.Node,            // node phuong (aircraft)
        meteorNode: cc.Node,             // node thien thach (attackcraft)
        laneAnchors: { default: [], type: [cc.Node], tooltip: '3 node vi tri lan (cL 1..3) - luc BAY' },
        // KHONG con perchAnchor: vi tri DAU = CHINH vi tri ban dat phuong trong editor (chup luc onLoad).
        phoenixSpine: sp.Skeleton,       // spine phuong (choi anim)
        shakeTargets: { default: [], type: [cc.Node], tooltip: 'node rung khi trung' },
        changeLineTime: 0.5,             // ne nhanh (de thien thach ro rang truot)
        meteorDuration: 1.1,
        meteorFrom: { default: new cc.Vec2(760, 360), tooltip: 'diem xuat phat thien thach = goc phai-tren' },
        perchMoveTime: 0.6,
        // revive_to_idle (trung no ra phuong dung) co TU THE khac idle1 -> dung lech dinh nui.
        // USER DO THUC TE: idle1/idle2 dung o X210 Y-100; revive_to_idle phai X120 Y-100 => lech (-90, 0).
        // Luc revive bay ve perch + offset nay; anim xong -> _snapToPerch() ve dung perch cho idle1.
        reviveOffset: { default: new cc.Vec2(-90, 0), tooltip: 'bu lech tu the revive_to_idle so voi idle1 (do thuc te)' },
        takeOffDelay: 0.8,               // phuong nhun chan (jump) TAI CHO tren dinh nui - khop nui delay 0.8s
        takeOffDur: 1.2,                 // roi bay len lane (cung luc nui truot xuong)
        // ==== ten animation (khop spine sun-phung) ====
        animIdle: 'idle1',
        animJump: 'jump',
        animFly: 'fly',
        animFlyUp: 'fly_up',
        animFlyDown: 'fly_down',
        animFlyReturn: 'fly_retune',     // sic - ten sai chinh ta trong asset goc
        animDie: 'die',
        animReviveLoop: 'revive_loop',   // trung -> giu trang thai trung
        animReviveToIdle: 'revive_to_idle', // trung -> hoa lai phuong dung
        // LUU Y: feather_loop/end/freeze KHONG choi tren than phuong - do vat the LONG VU DANG ROI
        // (prefab PhoenixFallingFeather dung chinh spine phoenix) choi. Xem PhoenixInfoView.spawnFallingFeather.
        // ==== DUOI LUA (particle) ====
        // Gan prefab la du - code tu instantiate lam CON cua phuong / thien thach roi bat-tat theo pha.
        // Particle de positionType=FREE nen hat KHONG di theo emitter -> tu thanh vet duoi khi node di chuyen.
        trailPrefab: { default: null, type: cc.Prefab, tooltip: 'PhoenixTrail - duoi lua bam theo phuong' },
        meteorTrailPrefab: { default: null, type: cc.Prefab, tooltip: 'PhoenixMeteorTrail - duoi lua thien thach' },
    },

    onLoad: function () {
        this.controller = (typeof cc.PhoenixController !== 'undefined') ? cc.PhoenixController.getInstance() : null;
        if (this.controller) this.controller.setFlightLanes(this);
        this._curLane = 2;               // FlightChoreographer.StartLane
        this._lastState = null;
        this._isDead = false;
        this._flying = false; this._perched = false;   // co trang thai (tranh re-trigger perch/fly)
        this._shaking = false; this._shakeT = 0; this._shakeDur = 0; this._shakeInt = 0; this._origPos = null;
        // ==== VO HIEU cruft Aviator: PhoenixInfoView.initPositions FORCE nodeAirCraft(cha cua phuong) ve (-509,-143)
        // = keo phuong sang trai + lech. Ep cha ve (0,0) va CHUP vi tri DAU cua phuong = perch (WYSIWYG).
        // aircraft.getPosition() KHONG bi doi khi cha bi move -> chup dang tin cay bat ke thu tu onLoad.
        this._na = this.phoenixNode ? this.phoenixNode.parent : null;
        if (this._na) this._na.setPosition(0, 0);
        this._perchPos = this.phoenixNode ? cc.v2(this.phoenixNode.x, this.phoenixNode.y) : cc.v2(0, 0);
        // revive_to_idle chay xong -> SNAP ve DUNG perch (bo reviveOffset) => idle1 dung dinh nui.
        if (this.phoenixSpine) {
            var self = this;
            this.phoenixSpine.setCompleteListener(function (track) {
                var n = (track && track.animation) ? track.animation.name : '';
                if (n === self.animReviveToIdle) self._snapToPerch();
            });
            this._setupMix();   // CROSS-FADE giua cac anim -> het GIAT khi chuyen (bang mix cua sunwin)
        }
        if (this.meteorNode) this.meteorNode.active = false;
        this._buildTrails();
    },

    // Dung duoi lua: instantiate prefab lam CON cua phuong / thien thach. Chi can gan prefab o Inspector.
    _buildTrails: function () {
        if (this.trailPrefab && this.phoenixNode) {
            this._trail = cc.instantiate(this.trailPrefab);
            this.phoenixNode.addChild(this._trail);
            this._trail.setPosition(0, 0);
            this._trail.zIndex = -1;                 // duoi lua nam SAU than phuong
            this._setTrail(false);                   // dang dau tren nui -> chua co duoi lua
        }
        if (this.meteorTrailPrefab && this.meteorNode) {
            var mt = cc.instantiate(this.meteorTrailPrefab);
            this.meteorNode.addChild(mt);
            mt.setPosition(0, 0);
            mt.zIndex = -1;
        }
    },

    // Goi am thanh qua controller -> PhoenixSettingView. Boc guard vi settingView co the chua san sang
    // (component nam tren node khac, thu tu onLoad khong bao dam).
    _playAudio: function (fn) {
        try {
            var a = this.controller && this.controller.playAudio ? this.controller.playAudio() : null;
            if (a && a[fn]) a[fn]();
        } catch (e) { }
    },

    // Am thanh sun-phung qua pool (co hang rao 3 kenh). Ten clip lay tu cc.AudioTypes.
    _sfx: function (type) {
        try { if (this.controller && this.controller.playPhx) this.controller.playPhx(type); } catch (e) { }
    },

    // Bat/tat duoi lua.
    // LUU Y API: Cocos 2.x KHONG co ParticleSystem.clear() (do la ban 3.x) -> goi vao la
    // "clear is not a function". Chi dung resetSystem()/stopSystem(). De xoa ngay dam hat dang bay
    // thi TAT NODE CHA - vua tuc thi vua khong phu thuoc API rieng cua tung ban engine.
    _setTrail: function (on) {
        if (!this._trail || !this._trail.isValid) return;
        var list = this._trail.getComponentsInChildren(cc.ParticleSystem);
        for (var i = 0; i < list.length; i++) {
            var ps = list[i];
            if (!ps) continue;
            if (on) { if (ps.resetSystem) ps.resetSystem(); }
            else { if (ps.stopSystem) ps.stopSystem(); }
        }
        this._trail.active = !!on;
    },

    // ==== server bien dao (GOP MOT HE nhu sunwin): cL=lan phuong toi, aL=lan vat the, fc=so long vu sau beat
    // bId theo enum sunwin AviatorEventType:
    //   0 = bat dau pha bay (cat canh)
    //   1 = STAR              -> long vu roi o lan aL, phuong LAO TOI nhat (cL == aL)
    //   2 = METEORITE         -> thien thach roi vao lan phuong VUA ROI, phuong ne di lan khac (cL != aL)
    //   3 = SPACE_SHIP_CRASH  -> thien thach dam trung -> chet
    //   5 = TRY_TO_COLLECT_STAR -> dang lao di nhat long vu thi bi thien thach dam chet; long vu bay luot qua
    onFlyingEvent: function (cL, aL, bId, aId, fc) {
        if (bId === 0) { this._curLane = cL; this._enterFlying(true); return; }   // dau pha bay: cat canh (jump)
        if (bId === 3) { this._crash(); return; }
        if (bId === 5) { this._spawnFeather(aL, 0); this._crash(); return; }      // chet hut: long vu roi ma khong nhat duoc

        this._flying = true; this._perched = false;
        this.setLine(cL);                               // moi beat deu doi lan — nhung gio LUON co ly do
        if (bId === 1) this._spawnFeather(aL, fc);      // long vu: phuong lao toi lan aL de nhat
        else this._spawnMeteor(aL);                     // thien thach: phuong vua roi lan aL de ne
    },

    // LONG VU roi tu troi xuong lan aL (khop sunwin AviatorStar: startMoveHitSpaceShip -> moveToSunSlot).
    // fc > 0 = nhat duoc: cham phuong xong bay tiep vao khe hu roi moi sang khe (InfoView lo chang 2).
    // fc == 0 = khong nhat duoc (chet hut): chi roi luot qua rồi tan.
    _spawnFeather: function (aL, fc) {
        var info = this.controller && this.controller.AviatorInfoView;
        if (!info || !info.spawnFallingFeather) return;
        var anchor = this._laneNode(aL);
        info.spawnFallingFeather(anchor, fc);
    },

    // Vao pha BAY (cat canh HOAC re-entry giua chung): SNAP phuong len lan hien tai + fly.
    // -> vao game giua luc bay khong con dung im/sai cho o trai man.
    _enterFlying: function (withJump) {
        this._flying = true; this._perched = false; this._isDead = false;
        // Duoi lua bat dung luc ROI KHOI NUI (sau nhun chan), khong bat luc con dang dau.
        var self = this;
        // Duoi lua VA tieng cat canh deu doi den luc phuong ROI KHOI NUI (sau cu nhun chan),
        // khong phat ngay luc doi trang thai — truoc day tieng di truoc hinh 0.8s.
        if (withJump) this.scheduleOnce(function () {
            self._setTrail(true);
            self._playAudio('playStartFlyingAudio');
            self._sfx(cc.AudioTypes.PHX_SFX_TAKE_OFF);
            self._sfx(cc.AudioTypes.PHX_SFX_FLYING);      // canh dap (loop) - pool tu chan restart
        }, this.takeOffDelay);
        else {
            this._setTrail(true);
            this._playAudio('playStartFlyingAudio');
            this._sfx(cc.AudioTypes.PHX_SFX_FLYING);
        }
        var anchor = this._laneNode(this._curLane || 2);
        if (!anchor || !this.phoenixNode) {
            this._playSpine(withJump ? this.animJump : this.animFly, !withJump, withJump ? this.animFly : null);
            return;
        }
        var t = this._toParent(this.phoenixNode, anchor);
        cc.Tween.stopAllByTarget(this.phoenixNode);
        if (withJump) {
            // CAT CANH khop sunwin: jump TAI CHO tren dinh nui (delay 0.8s = luc nui bat dau truot),
            // ROI moi bay len lane -> phuong va nui dong bo, khong con "nui bien mat truoc khi phuong kip nhun".
            this._playSpine(this.animJump, false, this.animFly);
            cc.tween(this.phoenixNode)
                .delay(this.takeOffDelay)
                .to(this.takeOffDur, { position: cc.v3(t.x, t.y, 0) }, { easing: 'sineOut' })
                .start();
        } else {
            this.phoenixNode.setPosition(t.x, t.y);   // re-entry giua chung: snap thang len lane
            this._playSpine(this.animFly, true, null);
        }
    },

    // Ne: phuong tween sang lan cL + anim fly_up/fly_down -> fly.
    setLine: function (cL) {
        var anchor = this._laneNode(cL);
        if (!anchor || !this.phoenixNode) return;
        var up = cL < this._curLane;     // index nho hon = cao tren man -> fly_up
        this._curLane = cL;
        this._playSpine(up ? this.animFlyUp : this.animFlyDown, false, this.animFly);
        var t = this._toParent(this.phoenixNode, anchor);
        cc.Tween.stopAllByTarget(this.phoenixNode);
        cc.tween(this.phoenixNode)
            .to(this.changeLineTime, { position: cc.v3(t.x, t.y, 0) }, { easing: 'cubicInOut' })
            .start();
    },

    // Thien thach bay toi lan aL (phuong da roi) roi vut qua = TRUOT.
    _spawnMeteor: function (aL) {
        if (!this.meteorNode) return;
        this._sfx(cc.AudioTypes.PHX_SFX_METEOR_BYPASS);   // thien thach LUOT QUA (ne duoc)
        var anchor = this._laneNode(aL);
        if (!anchor) return;
        var self = this;
        var t = this._toParent(this.meteorNode, anchor);
        this.meteorNode.active = true;
        this.meteorNode.setPosition(this.meteorFrom.x, this.meteorFrom.y);
        cc.Tween.stopAllByTarget(this.meteorNode);
        cc.tween(this.meteorNode)
            .to(this.meteorDuration * 0.72, { position: cc.v3(t.x, t.y, 0) }, { easing: 'sineIn' })   // toi lan aL (phuong da ne xong)
            .to(this.meteorDuration * 0.5, { position: cc.v3(t.x - 520, t.y - 340, 0) })              // vut qua
            .call(function () { if (self.meteorNode && self.meteorNode.isValid) self.meteorNode.active = false; })
            .start();
    },

    // No: thien thach bay THANG toi phuong; die chi choi KHI thien thach CHAM (khong som).
    _crash: function () {
        var self = this;
        this._isDead = true;
        if (this.meteorNode && this.phoenixNode) {
            var p = this._toParent(this.meteorNode, this.phoenixNode);
            this.meteorNode.active = true;
            this.meteorNode.setPosition(this.meteorFrom.x, this.meteorFrom.y);
            cc.Tween.stopAllByTarget(this.meteorNode);
            cc.tween(this.meteorNode)
                .to(0.5, { position: cc.v3(p.x, p.y, 0) }, { easing: 'sineIn' })   // toi phuong
                .call(function () {                                                // CHAM -> die + rung
                    if (self.meteorNode && self.meteorNode.isValid) self.meteorNode.active = false;
                    self._playSpine(self.animDie, false, self.animReviveLoop);      // die -> giu trung
                    self._startShake(0.5, 20);
                    self._setTrail(false);                                         // chet -> tat duoi lua
                    self._playAudio('playBumAudio');                               // tieng no DUNG luc cham
                    self._sfx(cc.AudioTypes.PHX_SFX_DIE);
                    // Tieng 'hoa trung' 400ms sau khi chet (khop sunwin AviatorSpaceShip.die).
                    self.scheduleOnce(function () { self._sfx(cc.AudioTypes.PHX_SFX_EGG); }, 0.4);
                })
                .start();
        } else {
            this._playSpine(this.animDie, false, this.animReviveLoop);
        }
    },

    // Ve dau (WAITING/BETTING). fromFlight=true (vua bay/chet ve): return anim (fly_retune / revive_to_idle) + tween muot.
    // fromFlight=false (moi vao game luc cho): SNAP + idle (DUNG IM ngay, KHONG chay fly_retune).
    _enterPerch: function (fromFlight) {
        this._flying = false; this._perched = true; this._curLane = 2;
        this._setTrail(false);   // dau tren nui -> khong co duoi lua
        this._sfx(cc.AudioTypes.PHX_SFX_IDLE);   // pool chan lap: goi lai khi dang phat thi bo qua
        if (this.phoenixNode && this._perchPos) {
            var t = this._perchPos;   // vi tri DAU (editor) = perch, KHONG convert -> KHONG lech
            cc.Tween.stopAllByTarget(this.phoenixNode);
            if (fromFlight) {
                var dead = this._isDead;
                this._playSpine(dead ? this.animReviveToIdle : this.animFlyReturn, false, this.animIdle);
                // Hoi sinh: bay ve perch + reviveOffset (bu lech tu the revive_to_idle).
                // Anim xong -> setCompleteListener goi _snapToPerch() ve DUNG perch cho idle1.
                var ro = (dead && this.reviveOffset) ? this.reviveOffset : cc.v2(0, 0);
                cc.tween(this.phoenixNode)
                    .to(this.perchMoveTime, { position: cc.v3(t.x + ro.x, t.y + ro.y, 0) })
                    .start();
            } else {
                this.phoenixNode.setPosition(t.x, t.y);   // SNAP
                this._playSpine(this.animIdle, true, null);   // idle dung im
            }
        }
        this._isDead = false;
    },

    // Bang CROSS-FADE (mix) giua cac anim - lay dung tu AviatorSpaceShip.onLoad cua sunwin.
    // Khong co mix -> chuyen anim BI GIAT (dang vo canh cai nhay phat sang jump). Co mix -> muot.
    _setupMix: function () {
        var s = this.phoenixSpine;
        if (!s || typeof s.setMix !== 'function') return;
        var mix = [
            [this.animIdle, this.animJump, 0.5],
            ['idle2', this.animJump, 0.2],
            [this.animFlyReturn, this.animJump, 0.5],
            [this.animJump, this.animFly, 0.2],          // cat canh -> bay: muot
            [this.animFly, this.animFlyDown, 0.2],
            [this.animFly, this.animFlyUp, 0.2],
            [this.animFlyUp, this.animFly, 0.2],
            [this.animFlyDown, this.animFly, 0.2],
            [this.animFlyUp, this.animFlyDown, 0.2],
            [this.animFlyDown, this.animFlyUp, 0.2],
            [this.animFly, this.animDie, 0.15],
            [this.animReviveToIdle, this.animIdle, 0.3],
        ];
        for (var i = 0; i < mix.length; i++) {
            var m = mix[i];
            if (!m[0] || !m[1]) continue;
            try { s.setMix(m[0], m[1], m[2]); } catch (e) { }
        }
    },

    // Ve DUNG perch (bo phan bu tru reviveOffset) - goi khi anim revive_to_idle chay xong => dung dinh nui.
    _snapToPerch: function () {
        if (this.phoenixNode && this._perchPos) {
            cc.Tween.stopAllByTarget(this.phoenixNode);
            this.phoenixNode.setPosition(this._perchPos.x, this._perchPos.y);
        }
    },

    _laneNode: function (cL) {
        var i = cL - 1;
        if (i < 0 || i >= this.laneAnchors.length) return null;
        var n = this.laneAnchors[i];
        return (n && n.isValid) ? n : null;
    },

    // Vi tri (goc AR) cua `anchor` trong khong gian local cua parent(movingNode) - khac parent van dung.
    _toParent: function (movingNode, anchor) {
        var w = anchor.convertToWorldSpaceAR(cc.v2(0, 0));
        return movingNode.parent.convertToNodeSpaceAR(w);
    },

    _playSpine: function (name, loop, addNext) {
        if (!this.phoenixSpine || !name) return;
        try {
            this.phoenixSpine.setAnimation(0, name, loop);
            if (addNext) this.phoenixSpine.addAnimation(0, addNext, true);
        } catch (e) { }
    },

    _startShake: function (dur, intensity) {
        if (!this.shakeTargets || !this.shakeTargets.length) return;
        this._origPos = this.shakeTargets.map(function (n) { return (n && n.isValid) ? cc.v2(n.x, n.y) : null; });
        this._shakeDur = dur; this._shakeInt = intensity; this._shakeT = 0; this._shaking = true;
    },

    update: function (dt) {
        // Giu nodeAirCraft(cha phuong) ve (0,0) - cruft Aviator (initPositions) co the set -509,-143 o onLoad tre.
        if (this._na && (this._na.x !== 0 || this._na.y !== 0)) this._na.setPosition(0, 0);
        // may trang thai theo pha (fallback khi khong co flyingEvent - vd re-entry giua ván):
        //   FLYING chua bay -> _enterFlying (snap lan + fly); WAITING/BETTING chua perch -> _enterPerch (1 lan).
        if (this.controller) {
            var s = this.controller.getCurrentState();
            if (s != null && s !== this._lastState) {
                var prev = this._lastState;
                this._lastState = s;
                if (s === cc.PhoenixState.FLYING) {
                    if (!this._flying) this._enterFlying(prev === cc.PhoenixState.BETTING);
                } else if (s === cc.PhoenixState.WAITING || s === cc.PhoenixState.BETTING) {
                    if (!this._perched) this._enterPerch(prev === cc.PhoenixState.FLYING || prev === cc.PhoenixState.CRASHED);
                }
            }
        }
        // rung (quadratic (1-t)^2)
        if (this._shaking) {
            this._shakeT += dt;
            var r = this._shakeT / this._shakeDur;
            if (r < 1) {
                var damp = (1 - r) * (1 - r);
                for (var i = 0; i < this.shakeTargets.length; i++) {
                    var n = this.shakeTargets[i], o = this._origPos[i];
                    if (n && n.isValid && o) n.setPosition(o.x + (Math.random() * 2 - 1) * this._shakeInt * damp, o.y + (Math.random() * 2 - 1) * this._shakeInt * damp);
                }
            } else {
                for (var j = 0; j < this.shakeTargets.length; j++) {
                    var nn = this.shakeTargets[j], oo = this._origPos[j];
                    if (nn && nn.isValid && oo) nn.setPosition(oo.x, oo.y);
                }
                this._shaking = false;
            }
        }
    },
});
