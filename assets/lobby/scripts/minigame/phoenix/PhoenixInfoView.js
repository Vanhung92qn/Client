(function () {
  cc.PhoenixInfoView = cc.Class({
    extends: cc.Component,
    properties: {
      lbSessionId: cc.Label,
      lbJackpot: cc.LabelIncrement,
      lbMultiplier: cc.Label,
      lbTimer: cc.Label,
      lbTotalBet: cc.LabelIncrement,
      lbTotalUser: cc.LabelIncrement,
      popupStart: cc.Node,
      nodeAirCraft: cc.Node,
      aircraft: sp.Skeleton,
      attackcraft: sp.Skeleton,
      lazeFire: sp.Skeleton,
      chartMask: cc.Node,
      chartSpr: cc.Node,
      parachute: cc.Prefab,
      parachute1: cc.Prefab,
      // HOA PHUNG: lông vũ. 2 cách — (a) tự nhân bản từ featherPrefab vào featherParent (KHUYẾN NGHỊ, code lo hết);
      // (b) gán tay 5 node vào featherSlots. Ưu tiên (a): chỉ cần gán featherPrefab + featherParent trong Cocos.
      featherPrefab: cc.Prefab,     // prefab PhoenixFeather (1 lông vũ spine) — user gán
      featherParent: cc.Node,       // node chứa 5 lông vũ (đặt gần icon hũ) — user gán, node LUÔN ACTIVE
      featherSlots: [cc.Node],      // (b) hoặc gán tay 5 node
      jackpotNode: cc.Node,         // HOA PHUNG: node hũ jackpot_sunphung (góc) — ĐÍCH của lông vũ sau khi nhặt
      // Lông vũ ĐANG RƠI dùng spine PHOENIX (anim feather_loop/end/freeze) — KHÁC spine feather của 5 khe tích.
      fallingFeatherPrefab: cc.Prefab,   // prefab PhoenixFallingFeather — user gán
      // "Co nguoi vua rut tien" (sunwin TakeProfitInfo). De trong van chay - se dung nhan chu tran.
      takeProfitPrefab: cc.Prefab,
      // Do troi khi bay: sunwin dung 300..550 (AM ca 2 truc = ro xuong duoi-trai).
      // Chinh o day neu thay bay ra ngoai man hoac troi qua ngan.
      takeProfitDriftMin: 170,
      takeProfitDriftMax: 300,
      // Lông vũ rơi từ TRỜI xuống làn (chặng 1) rồi bay vào khe hũ (chặng 2) — khớp sunwin AviatorStar.
      // Offset = điểm xuất phát so với làn: dương X = từ phải, dương Y = từ trên -> rơi chéo từ góc màn hình.
      featherFallOffsetX: 620,
      featherFallOffsetY: 460,
      featherFallDur: 1.1,          // chặng 1: trời -> làn (phượng lao tới đón)
      featherToSlotDur: 0.75,       // chặng 2: phượng -> khe hũ
      // 5 khe lông vũ xếp VÒNG CUNG ĐỀU quanh icon hũ (0° = phải, 90° = trên). Chỉnh trực tiếp ở Inspector.
      featherRadius: 120,        // bán kính vòng cung (px) tính từ featherParent
      featherAngleStart: 150,    // góc lông vũ ĐẦU (trên-trái)
      featherAngleEnd: 60,       // góc lông vũ CUỐI (trên-phải)
      featherRotOffset: -90,     // xoay thêm mỗi lông vũ (tiếp tuyến vòng cung)
      // NỔ HŨ (tên anim đã verify trực tiếp từ file .skel):
      // jackpotSpine CÙNG node với jackpotNode -> chỉ cần kéo 1 trong 2, code tự suy ra cái còn lại.
      jackpotSpine: sp.Skeleton,       // jackpot_sunphung: idle / in / jackpot
      jackpotBirdSpine: sp.Skeleton,   // jackpot_bird: idle_to_win_birds (5 lông vũ hoá 5 chim bay ra, tự ẩn)
    },

    // Spine của hũ: ưu tiên ô jackpotSpine, không có thì lấy Spine ngay trên jackpotNode.
    _jackpotSk: function () {
      if (this.jackpotSpine) return this.jackpotSpine;
      if (this.jackpotNode) return this.jackpotNode.getComponent(sp.Skeleton);
      return null;
    },

    // Node hũ (điểm xuất phát lông vũ rơi): ưu tiên jackpotNode, không có thì lấy node của jackpotSpine.
    _jackpotOriginNode: function () {
      if (this.jackpotNode) return this.jackpotNode;
      if (this.jackpotSpine) return this.jackpotSpine.node;
      return null;
    },

    onLoad: function () {
      this.controller = cc.PhoenixController.getInstance();
      this.controller.setInfoView(this);
      this.buildFeathers();   // HOA PHUNG: dựng 5 lông vũ từ prefab (nếu featherPrefab+featherParent đã gán)
      this.initPositions();
      this.flying = false;
      this.crashed = false;
      if (this.lazeFire) this.lazeFire.node.active = false;
      this.aircraftSpeed = false;
      this.incrementMultiplier = null;

      const self = this;
      this.aircraft.setCompleteListener((trackEntry) => {
        if (self._lanesActive()) return;   // PhoenixFlightLanes dieu khien anim phuong
        const animationName = trackEntry.animation
          ? trackEntry.animation.name
          : "";

        if (animationName == "fly_down") {
          self.aircraft.setAnimation(0, "fly", true);
          if (self.lazeFire) self.lazeFire.node.active = false;
        }
      });

      // NỔ HŨ: đàn chim thắng chạy 1 lần rồi TỰ ẨN (khớp onLoad của AviatorJackpotObject sunwin).
      if (this.jackpotBirdSpine) {
        this.jackpotBirdSpine.node.active = false;
        this.jackpotBirdSpine.setCompleteListener(function (track) {
          var n = (track && track.animation) ? track.animation.name : "";
          if (n === "idle_to_win_birds" && self.jackpotBirdSpine) self.jackpotBirdSpine.node.active = false;
        });
      }
    },

    // NỔ HŨ (khớp sunwin `playJackpotAnim`): 5 khe lông vũ chớp `jackpot`; hũ `in`→`jackpot`(loop); đàn chim bay ra.
    // Gọi từ 2 đường: (1) đủ 5 lông vũ giữa lúc bay — đây mới là lúc hũ nổ theo luật game; (2) gói jackpotWinner
    // lúc chốt sổ cuối ván (mang số tiền). Chạy 1 lần/ván, cờ reset khi updateInfo thấy đổi SessionID.
    playJackpotAnim: function () {
      if (this._jpPlayed) return;
      this._jpPlayed = true;
      this._sfx(cc.AudioTypes.PHX_SFX_JACKPOT);
      if (this.featherSlots) {
        for (var i = 0; i < this.featherSlots.length; i++) {
          var nd = this.featherSlots[i];
          if (!nd) continue;
          var sk = nd.getComponent(sp.Skeleton);
          if (sk) { try { sk.setAnimation(0, "jackpot", false); } catch (e) { } }
        }
      }
      var jsk = this._jackpotSk();
      if (jsk) {
        try { jsk.setAnimation(0, "in", false); jsk.addAnimation(0, "jackpot", true); } catch (e) { }
      }
      if (this.jackpotBirdSpine) {
        this.jackpotBirdSpine.node.active = true;
        try { this.jackpotBirdSpine.setAnimation(0, "idle_to_win_birds", false); } catch (e) { }
      }
    },

    // Đầu ván mới: hũ về `idle`, ẩn đàn chim. (5 khe lông vũ do updateFeather lo.)
    resetJackpotAnim: function () {
      this._jpPlayed = false;   // mở khoá cho ván mới (updateInfo cũng mở khi đổi SessionID)
      var jsk = this._jackpotSk();
      if (jsk) { try { jsk.setAnimation(0, "idle", true); } catch (e) { } }
      if (this.jackpotBirdSpine) this.jackpotBirdSpine.node.active = false;
    },

    // HOA PHUNG: neu PhoenixFlightLanes dang hoat dong (he lan ne/trung) -> InfoView NGUNG dieu khien
    // vi tri/anim phuong + thien thach cu (tranh 2 he thong danh nhau -> "giat"). Giu nguyen info/he so/UI.
    _lanesActive: function () {
      return !!(this.controller && this.controller.PhoenixFlightLanes);
    },

    // ĐÃ BỎ setupRandomLazer(): no phat fire.mp3 theo mot chu ky co dinh (Math.random() tinh DUNG 1 LAN
    // roi REPEAT_FOREVER) suot pha bay, trong khi fireLazer() ben duoi return ngay o ca 2 guard
    // (_lanesActive() luon true vi he lan dang chay, va lazeFire = null vi node laze da xoa).
    // Ket qua: TIENG KEU MA KHONG CO HINH, lai khong gan voi bat ky su kien nao cua server.
    // Sunwin phat tieng nay (SPX_METEORITE_BYPASS) DUNG LUC sinh thien thach ne duoc -> se cam vao
    // PhoenixFlightLanes._spawnMeteor khi lam lop am thanh.

    fireLazer: function () {
      if (this._lanesActive()) return;   // FlightLanes dieu khien thien thach
      if (!this.lazeFire) return;        // node laze da xoa (aviator cu) -> bo qua
      if (this.crashed) {
        return;
      }
      this.lazeFire.node.active = true;
      this.lazeFire.setAnimation(0, "meteorite", false);   // thiên thạch lao vào (thay laser máy bay)
      this.aircraft.setAnimation(0, "fly_down", false);    // phượng cúi né (thay "ne")
      // this.scheduleOnce(() => {
      //     if (this.lazeFire) this.lazeFire.node.active = false;
      //     if (!this.crashed) {
      //         this.aircraft.setAnimation(0, 'speed', true);
      //     }
      // }, 0.5);
    },

    onEnable: function () {
      //this.resetAircraft();
    },

    onDestroy: function () {
      this.controller.setInfoView(null);
    },

    initPositions: function () {
      if (this.nodeAirCraft && !this._lanesActive()) this.nodeAirCraft.position = cc.v2(-509, -143);   // FlightLanes ep nodeAirCraft ve (0,0)
      this.chartMaskWidth = 567;
      if (this.chartMask) { this.chartMask.width = 0; this.chartMask.height = 230; this.chartMask.active = false; }
      if (this.chartSpr) this.chartSpr.height = 230;
    },

    resetAircraft: function () {
      if (this.aircraft) cc.Tween.stopAllByTarget(this.aircraft.node);
      if (this.nodeAirCraft) cc.Tween.stopAllByTarget(this.nodeAirCraft);
      if (this.chartMask) cc.Tween.stopAllByTarget(this.chartMask);
      if (this.chartSpr) cc.Tween.stopAllByTarget(this.chartSpr);

      if (!this._lanesActive()) {   // FlightLanes so huu vi tri phuong + thien thach -> khong dat lai
        if (this.nodeAirCraft) this.nodeAirCraft.position = cc.v2(-509, -143);
        if (this.lazeFire) this.lazeFire.node.position = cc.v2(-254, 110);
        if (this.attackcraft) this.attackcraft.node.position = cc.v2(483, 226);
      }
      if (this.chartMask) { this.chartMask.width = 0; this.chartMask.height = 230; this.chartMask.active = false; }
      if (this.chartSpr) this.chartSpr.height = 230;
      this.flying = false;
      this.crashed = false;
    },

    flyAlongChart: function () {
      if (this._lanesActive()) { this.flying = true; return; }   // FlightLanes dieu khien duong bay
      this.resetAircraft();
      this.flying = true;
      this.chartMask.width = 0;
      this.chartMask.active = true;
      cc.tween(this.nodeAirCraft)
        .bezierTo(2.5, cc.v2(-509, -143), cc.v2(-310, -115), cc.v2(-280, -90))
        .bezierTo(2.5, cc.v2(-170, -50), cc.v2(-60, 20), cc.v2(20, 83))
        .call(() => {
          this.upDownEffect();
        })
        .start();
      cc.tween(this.chartMask).to(5, { width: this.chartMaskWidth }).start();
    },

    // Vào GIỮA phiên đang bay: đặt máy bay đúng độ cao theo elapsed, KHÔNG kéo về gốc bay lại từ 1.00x.
    flySeekMidFlight: function (sessionInfo) {
      if (this._lanesActive()) { this.flying = true; return; }   // FlightLanes dieu khien vi tri phuong
      var elapsed = 0;
      if (sessionInfo.FlyStartMs > 0 && sessionInfo.ServerNowMs > 0) {
        elapsed = Math.max(0, (sessionInfo.ServerNowMs - sessionInfo.FlyStartMs) / 1000);
      }
      var climbDuration = 5; // khớp tween leo 2.5 + 2.5
      if (elapsed < climbDuration) {
        this.flyAlongChart(); // còn trong giai đoạn leo -> chạy bình thường (sai lệch nhỏ)
        return;
      }
      // đã qua giai đoạn leo -> đặt thẳng ở đỉnh cruise
      this.resetAircraft();
      this.flying = true;
      this.chartMask.active = true;
      this.nodeAirCraft.position = cc.v2(20, 83);
      this.chartMask.width = this.chartMaskWidth;
      this.chartMask.height = this.nodeAirCraft.position.y + 150;
      this.chartSpr.height = this.chartMask.height;
      this.upDownEffect();
    },

    upDownEffect: function () {
      if (this._lanesActive()) return;   // FlightLanes dieu khien do cao phuong (khong nhap nho ao)
      cc.tween(this.nodeAirCraft)
        .repeatForever(
          cc
            .tween()
            .by(1, { position: cc.v2(0, 30) })
            .by(1, { position: cc.v2(0, -30) })
        )
        .start();
      cc.tween(this.chartMask)
        .repeatForever(
          cc
            .tween()
            .call(() => {
              this.chartMask.height = this.nodeAirCraft.position.y + 150;
            })
            .delay(0.1)
        )
        .start();

      cc.tween(this.chartSpr)
        .repeatForever(
          cc
            .tween()
            .call(() => {
              this.chartSpr.height = this.nodeAirCraft.position.y + 150;
            })
            .delay(0.1)
        )
        .start();
    },

    updateInfo: function (sessionInfo) {
      //console.log('updateInfo', sessionInfo);
      var time = sessionInfo.Elapsed;
      // Nhac nen doi theo pha. Goi moi goi tin cung duoc: pool bo qua neu dang phat dung bai do.
      this._bgm(sessionInfo.Phrase === cc.PhoenixState.FLYING, sessionInfo.SessionID);
      switch (sessionInfo.Phrase) {
        case cc.PhoenixState.WAITING:
        //   if (cc.PhoenixController.getInstance().getIsLogout()) {
        //     cc.LobbyController.getInstance().destroyDynamicView(null);

        //     return;
        //   }
          this.lbMultiplier.node.active = false;
          if (this.lazeFire) this.lazeFire.node.active = false;
          if (this.chartMask) this.chartMask.active = false;
          this.resetAircraft();
          this.resetJackpotAnim();   // hũ về idle, ẩn đàn chim thắng
          this.controller.resetBetList();
          this.aircraftFlying = false;
          this.aircraftIdle = false;
          this.sawBetting = false;
          break;
        case cc.PhoenixState.BETTING:
          this.sawBetting = true;
          if (this.popupStart) this.popupStart.active = true;
          this.lbTimer.string = time;
          this.lbTotalBet.tweenValueto(sessionInfo.TotalBet);
          this.lbTotalUser.tweenValueto(sessionInfo.TotalPlayer);
          if (this.lazeFire) this.lazeFire.node.active = false;
          if (this.chartMask) this.chartMask.active = false;
          if (this.nodeAirCraft) this.nodeAirCraft.active = true;
          if (!this.aircraftIdle) {
            if (!this._lanesActive()) this.aircraft.setAnimation(0, "idle1", true);   // phượng đậu chờ cược (FlightLanes lo neu active)
            this.aircraftIdle = true;
          }
          this.aircraftFlying = false;
          break;
        case cc.PhoenixState.FLYING:
          if (this.popupStart) this.popupStart.active = false;
          this.lbMultiplier.node.active = true;
          if (this.nodeAirCraft) this.nodeAirCraft.active = true;

          if (!this.aircraftSpeed) {
            if (!this._lanesActive()) this.aircraft.setAnimation(0, "fly", true);   // phượng bay (FlightLanes lo neu active)
            this.aircraftSpeed = true;
            // Khi he lan dang chay, phuong con NHUN CHAN tren nui takeOffDelay (0.8s) roi moi roi nui
            // -> phat o day la tieng cat canh di TRUOC hinh 0.8s. Giao cho FlightLanes phat dung luc roi nui.
            if (!this._lanesActive()) this.controller.playAudio().playStartFlyingAudio();
          }
          if (this.chartMask) this.chartMask.active = true;
          if (!this.flying) {
            if (this.sawBetting) {
              this.flyAlongChart();
            } else {
              this.flySeekMidFlight(sessionInfo);   // vào giữa phiên -> đặt máy bay đúng độ cao, không kéo về gốc
            }
          }
          this.updateMultiplier(sessionInfo.Multiplier);
          break;
        case cc.PhoenixState.CRASHED:
          if (!this.crashed) {
            this.handleCrash();
            this.stopMultiplier();
          }
          this.aircraftFlying = false;
          this.aircraftIdle = false;
          break;
      }

      this.lastTime = time;
      this.currentState = sessionInfo.Phrase;
      this.lbSessionId.string = "#" + sessionInfo.SessionID;
      this.lbJackpot.tweenValueto(sessionInfo.Jackpot);
      // HOA PHUNG: FeatherCount trong snapshot là uy quyền server -> đồng bộ (chữa lệch reconnect / mất gói featherDrop).
      // Sang VÁN MỚI mới được phép tụt lông vũ về 0; trong ván thì updateFeather chỉ cho tăng (chống tắt ngược).
      if (this._featherSid !== sessionInfo.SessionID) {
        this._featherSid = sessionInfo.SessionID;
        this.featherCount = 0;
        this._featherInit = false;   // ép vẽ lại 5 khe về default_idle cho ván mới
        this._jpPlayed = false;      // cho phép hoạt cảnh nổ hũ chạy lại ở ván mới
      }
      this.updateFeather(sessionInfo.FeatherCount || 0);
    },

    // HOA PHUNG: dựng 5 lông vũ từ prefab, xếp vòng cung quanh featherParent. Chỉ chạy nếu đã gán prefab+parent.
    buildFeathers: function () {
      if (!this.featherPrefab || !this.featherParent) return;   // chưa gán -> bỏ qua (dùng featherSlots gán tay nếu có)
      // 5 lông vũ xếp VÒNG CUNG ĐỀU NHAU quanh icon hũ (thay bảng toạ độ hardcode lộn xộn cũ).
      // Góc chuẩn toán học: 0° = phải, 90° = trên. Mỗi lông xoay theo phương tiếp tuyến (+ featherRotOffset).
      var n = 5;
      var r = this.featherRadius || 120;
      var a0 = this.featherAngleStart, a1 = this.featherAngleEnd;
      this.featherSlots = [];
      for (var i = 0; i < n; i++) {
        var deg = (n === 1) ? a0 : (a0 + (a1 - a0) * i / (n - 1));   // chia ĐỀU giữa 2 góc
        var rad = deg * Math.PI / 180;
        var node = cc.instantiate(this.featherPrefab);
        node.setPosition(Math.cos(rad) * r, Math.sin(rad) * r);
        node.angle = deg + (this.featherRotOffset || 0);
        this.featherParent.addChild(node);
        this.featherSlots.push(node);
      }
    },

    // Hiện lông vũ theo count (0..5). featherDrop bắn realtime; updateInfo đồng bộ (reconnect/mất gói).
    // Lông vũ i < count -> "active_idle" (sáng); còn lại -> "default_idle" (chưa sáng). Guard chưa dựng.
    updateFeather: function (count) {
      var prev = this.featherCount || 0;
      // CHỈ TĂNG trong 1 ván. Relay bọc mỗi message redis vào ThreadPool riêng nên gói featherDrop có thể tới
      // sai thứ tự, và snapshot cũ có thể tới sau gói mới -> nếu cho tụt thì khe đã sáng bị tắt ngược, nhấp nháy.
      // Reset đầu ván do updateInfo lo (đổi SessionID), nên chặn ở đây không kẹt lông vũ sang ván sau.
      if (count < prev) return;
      this.featherCount = count;
      // KHÔNG spawn lông vũ ở đây nữa. Lông vũ giờ do beat STAR của biên đạo bay thả xuống
      // (PhoenixFlightLanes -> spawnFallingFeather), và chính nó gọi ngược updateFeather khi lông vũ
      // BAY TỚI KHE — nên khe sáng đúng lúc lông vũ tới. Spawn ở đây sẽ thành đệ quy + vẽ 2 lần.
      if (!this.featherSlots || !this.featherSlots.length) return;
      // Khe tích (spine feather): default_idle = chưa sáng; khe VỪA sáng chơi transfer(1 lần) -> active_idle(loop).
      // Chỉ set khi ĐỔI trạng thái -> tránh restart anim mỗi snapshot (giật).
      for (var i = 0; i < this.featherSlots.length; i++) {
        var node = this.featherSlots[i];
        if (!node) continue;
        var sk = node.getComponent(sp.Skeleton);
        if (!sk) { node.active = (i < count); continue; }   // fallback nếu node không phải spine
        var lit = (i < count), wasLit = (i < prev);
        if (this._featherInit && lit === wasLit) continue;
        if (!lit) sk.setAnimation(0, "default_idle", true);
        else if (wasLit) sk.setAnimation(0, "active_idle", true);
        else { sk.setAnimation(0, "transfer", false); sk.addAnimation(0, "active_idle", true); }
      }
      this._featherInit = true;

      // ĐỦ 5 LÔNG VŨ = NỔ HŨ ngay tại đây, giữa lúc bay (đúng luật game). playJackpotAnim tự chống chạy 2 lần
      // nên gói jackpotWinner tới sau lúc chốt sổ chỉ còn việc hiện số tiền + popup người trúng.
      if (count >= 5) this.playJackpotAnim();
    },

    // HOA PHUNG — LÔNG VŨ RƠI, khớp sunwin AviatorStar (startMoveHitSpaceShip -> moveToSunSlot):
    //   chặng 1: rơi từ TRỜI xuống làn `anchor`, phượng lao tới đón   (anim feather_loop)
    //   chặng 2: chạm phượng -> bay tiếp vào KHE HŨ                    (feather_end -> feather_freeze)
    //   tới khe: mới sáng khe (updateFeather) — khe sáng ĐÚNG lúc lông vũ tới, không sáng trước.
    // fc = 0 -> chết hụt: chỉ rơi lướt qua rồi tan, KHÔNG vào khe, KHÔNG sáng khe.
    // Prefab dùng spine PHOENIX (feather_loop/end/freeze), khác spine feather của 5 khe tích.
    spawnFallingFeather: function (anchor, fc) {
      if (!this.fallingFeatherPrefab) return;
      var self = this;
      var f = cc.instantiate(this.fallingFeatherPrefab);
      f.zIndex = 999;

      // Điểm rơi: phía trên làn, lệch sang phải cho giống rơi chéo từ góc màn hình.
      var target = null;
      if (anchor) {
        var wa = anchor.convertToWorldSpaceAR(cc.v2(0, 0));
        target = this.node.convertToNodeSpaceAR(wa);
      } else if (this.aircraft) {
        var wp0 = this.aircraft.node.convertToWorldSpaceAR(cc.v2(0, 0));
        target = this.node.convertToNodeSpaceAR(wp0);
      } else { f.destroy(); return; }

      f.setPosition(target.x + this.featherFallOffsetX, target.y + this.featherFallOffsetY);
      this.node.addChild(f);
      var sk = f.getComponent(sp.Skeleton);
      if (sk) { try { sk.setAnimation(0, "feather_loop", true); } catch (e) { } }

      var t = cc.tween(f).to(this.featherFallDur, { position: cc.v3(target.x, target.y, 0) }, { easing: "sineIn" });

      if (fc > 0) {
        // NHẶT ĐƯỢC -> chặng 2: từ phượng bay vào khe hũ, tới nơi mới sáng khe.
        t.call(function () {
          if (sk) { try { sk.setAnimation(0, "feather_end", false); sk.addAnimation(0, "feather_freeze", true); } catch (e) { } }
        });
        var slot = this._jackpotOriginNode();
        if (slot) {
          var wsl = slot.convertToWorldSpaceAR(cc.v2(0, 0));
          var lsl = this.node.convertToNodeSpaceAR(wsl);
          t.to(this.featherToSlotDur, { position: cc.v3(lsl.x, lsl.y, 0), scale: 0.5 }, { easing: "quintOut" });
        }
        t.call(function () {
          self.updateFeather(fc);            // khe sáng ĐÚNG lúc lông vũ tới nơi
          self._sfx(cc.AudioTypes.PHX_SFX_HIT_STAR);   // tieng nhat duoc long vu
          if (f.isValid) f.destroy();
        });
      } else {
        // CHẾT HỤT -> lướt qua rồi tan, không vào khe.
        t.to(this.featherFallDur * 0.6, { position: cc.v3(target.x - 420, target.y - 300, 0), opacity: 0 })
          .call(function () { if (f.isValid) f.destroy(); });
      }
      t.start();
    },

    handleCrash: function () {
      this.crashed = true;
      this.flying = false;
      if (this.chartMask) this.chartMask.active = false;
      // Khi he lan dang chay, thien thach con bay 0.5s roi moi CHAM phuong -> phat o day la tieng no
      // di TRUOC hinh nua giay. Giao cho FlightLanes phat dung luc cham.
      if (!this._lanesActive()) this.controller.playAudio().playBumAudio();
      if (this._lanesActive()) return;   // FlightLanes dieu khien thien thach trung + die
      this.fireLazer();
      const aircraftPosition = this.nodeAirCraft.position;
      if (this.lazeFire) this.lazeFire.node.position = cc.v2(-254, aircraftPosition.y);
      if (this.attackcraft) this.attackcraft.node.position = cc.v2(483, aircraftPosition.y + 110);
      this.aircraft.setAnimation(0, "die", false);   // phượng trúng thiên thạch chết
    },

    // Am thanh sun-phung qua pool dung chung (cc.AudioController -> cc.AudioPoolPhoenix).
    _sfx: function (type) {
      try { if (this.controller && this.controller.playPhx) this.controller.playPhx(type); } catch (e) { }
    },

    // Nhac nen theo pha: cho/dat cuoc = aviator_bgm_1; bay = 1 trong 6 bai chon theo SessionID % 6
    // -> CA PHONG nghe cung bai ma KHONG can server gui truong 'mz' nhu sunwin.
    _bgm: function (isFlying, sessionId) {
      try {
        var p = this.controller && this.controller.phxAudio ? this.controller.phxAudio() : null;
        if (!p) return;
        if (isFlying) { if (p.playFlyingBgm) p.playFlyingBgm(sessionId || 0); }
        else { if (p.playBettingBgm) p.playBettingBgm(); }
      } catch (e) { }
    },

    // "Co nguoi vua rut tien" bay len — khop sunwin TakeProfitInfo:
    // the nho background_take_profit + icon_feather_2 + nhan tien (prefab PhoenixTakeProfit).
    // Neu chua gan prefab thi tu dung nhan chu tran (muon font tu lbJackpot) de KHONG bao gio im lang.
    _spawnTakeProfitLabel: function (amount, isMe) {
      var host = this.node;
      if (!host || !host.isValid) return;

      var money = (cc.Tool && cc.Tool.getInstance ? cc.Tool.getInstance().nFormatter(amount) : String(amount));
      var n;
      if (this.takeProfitPrefab) {
        n = cc.instantiate(this.takeProfitPrefab);
        var vn = n.getChildByName('value');
        var vl = vn ? vn.getComponent(cc.Label) : null;
        if (vl) vl.string = money;
        n.scale = isMe ? 1.15 : 0.9;
      } else {
        n = new cc.Node('takeProfit');
        var lb = n.addComponent(cc.Label);
        lb.string = money;
        lb.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        lb.verticalAlign = cc.Label.VerticalAlign.CENTER;
        try {
          var src = this.lbJackpot && this.lbJackpot.node ? this.lbJackpot.node.getComponent(cc.Label) : null;
          if (src && src.font) { lb.font = src.font; lb.fontSize = isMe ? 34 : 26; lb.lineHeight = lb.fontSize; }
          else { lb.fontSize = isMe ? 30 : 24; }
        } catch (e) { lb.fontSize = isMe ? 30 : 24; }
        n.color = isMe ? cc.color(255, 214, 92) : cc.color(255, 255, 255);
      }
      n.opacity = 0;
      n.zIndex = 900;

      // xuat phat quanh con phuong; nguoi khac thi tan ra hai ben cho khoi de len nhau
      var base = cc.v2(0, 0);
      if (this.aircraft && this.aircraft.node && this.aircraft.node.isValid) {
        var w = this.aircraft.node.convertToWorldSpaceAR(cc.v2(0, 0));
        base = host.convertToNodeSpaceAR(w);
      }
      var dx = isMe ? 0 : (Math.random() * 260 - 130);
      n.setPosition(base.x + dx, base.y + (isMe ? 40 : Math.random() * 60 - 30));
      host.addChild(n);

      // HUONG BAY: sunwin cho RO XUONG DUOI-TRAI, khong bay len.
      // AviatorTakeProfitInfo.js:48 -> worldPosition + (randomRange(-300,-550), randomRange(-300,-550))
      // tuc lech AM ca hai truc, trong 2..2.5s, dong thoi fade opacity ve 0.
      var s0 = n.scale;
      var driftX = -(this.takeProfitDriftMin + Math.random() * (this.takeProfitDriftMax - this.takeProfitDriftMin));
      var driftY = -(this.takeProfitDriftMin + Math.random() * (this.takeProfitDriftMax - this.takeProfitDriftMin));
      var dur = 2 + Math.random() * 0.5;
      cc.tween(n)
        .to(0.18, { opacity: 255, scale: s0 * 1.12 })
        .to(0.12, { scale: s0 })
        .to(dur, { position: cc.v3(n.x + driftX, n.y + driftY, 0), opacity: 0 }, { easing: 'sineOut' })
        .call(function () { if (n.isValid) n.destroy(); })
        .start();
    },

    // HOA PHUNG: co NGUOI RUT TIEN -> nhan tien bay len roi mo dan (khop sunwin AviatorTakeProfitInfo).
    // TRUOC DAY ham nay CHET HAN: guard doi nodeAirCraft ma o do dang NULL trong prefab -> return ngay
    // dong dau => game khong he bao hieu gi khi co nguoi rut, ca phong im lang. Du parachute cua Aviator
    // cu cung chua bao gio chay vi cung ly do.
    updateCashout: function (accountId, amount) {
      var isMe = accountId === cc.LoginController.getInstance().getUserId();
      this._spawnTakeProfitLabel(amount, isMe);
      // Duong cu (du parachute): chi chay neu ai do gan lai nodeAirCraft + prefab. Mac dinh bo qua.
      if (!this.nodeAirCraft || (!this.parachute && !this.parachute1)) return;
      const isCurPlayer =
        accountId === cc.LoginController.getInstance().getUserId();
      let newParachute;
      if (!isCurPlayer) {
        newParachute = cc.instantiate(this.parachute);
      } else {
        newParachute = cc.instantiate(this.parachute1);
      }
      this.nodeAirCraft.addChild(newParachute);
      let valueLabel = newParachute
        .getChildByName("value")
        .getComponent(cc.Label);
      if (valueLabel) {
        valueLabel.string = cc.Tool.getInstance().nFormatter(amount);
      }

      const x = Math.random() * -500 - 250;
      const y = -350;
      const time = Math.random() * 1 + 2;

      cc.tween(newParachute)
        .set({ scale: 0, opacity: 255 }) 
        .parallel(
          cc.tween().to(time, { position: cc.v2(x, y) }),
          cc.tween().to(0.3, { scale: 1 }) 
        )
        .call(() => {
          if (Math.abs(newParachute.position.x - x) < 10 && Math.abs(newParachute.position.y - y) < 10) {
           
            cc.tween(newParachute)
                .to(0.5, { opacity: 0 })
                .call(() => {
                    newParachute.destroy();
                })
                .start();
        } else {
            newParachute.destroy();
        }
        })
        .start();
    },

    updateMultiplier: function (multiplier) {
      const incrementValue = 0.01;
      const incrementsPerSecond = 10;
      this.lbMultiplier.string = multiplier.toFixed(2) + "x";

      // this.incrementMultiplier = cc
      //   .tween(this.lbMultiplier)
      //   .repeatForever(
      //     cc
      //       .tween()
      //       .call(() => {
      //         let currentMultiplier = parseFloat(
      //           this.lbMultiplier.string.replace("x", "")
      //         );
      //         this.lbMultiplier.string =
      //           (currentMultiplier + incrementValue).toFixed(2) + "x";
      //       })
      //       .delay(1 / incrementsPerSecond)
      //   )
      //   .start();
    },

    stopMultiplier: function () {
      if (this.incrementMultiplier) {
        this.incrementMultiplier.stop();
        this.incrementMultiplier = null;
      }
    },
  });
}).call(this);
