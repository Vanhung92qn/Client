var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
var n = this && this.__extends || function() {
    var t = function(e, i) {
      return (t = Object.setPrototypeOf || {
          __proto__: []
        }
        instanceof Array && function(t, e) {
          t.__proto__ = e;
        } || function(t, e) {
          for (var i in e) {
            if (e.hasOwnProperty(i)) {
              t[i] = e[i];
            }
          }
        })(e, i);
    };
    return function(e, i) {
      function n() {
        this.constructor = e;
      }
      t(e, i);
      e.prototype = null === i ? Object.create(i) : (n.prototype = i.prototype, new n());
    };
  }(),
  o = this && this.__decorate || function(t, e, i, n) {
    var o,
      a = arguments.length,
      s = a < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, i) : n;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) {
      s = Reflect.decorate(t, e, i, n);
    } else {
      for (var r = t.length - 1; r >= 0; r--) {
        if (o = t[r]) {
          s = (a < 3 ? o(s) : a > 3 ? o(e, i, s) : o(e, i)) || s;
        }
      }
    }
    if (a > 3 && s) {
      Object.defineProperty(e, i, s);
    }
    return s;
  };
Object.defineProperty(i, "__esModule", {
  value: true
});
var a = require("./GameDefine"),
  s = require("./VersionController"),
  r = require("./EmoScript"),
  c = require("./GameZOrder"),
  l = require("./GameCardSpriteType"),
  h = require("./GameConfigManager"),
  u = require("./GameController"),
  d = require("./GamePlayManager"),
  p = require("./MusicPlayer"),
  f = require("./MoneyUI"),
  g = require("./StringUtil"),
  m = require("./CommonPrefabsManager"),
  y = require("./MessageCardGameHandler"),
  S = require("./CatteMessage"),
  _ = require("./CatteRequest"),
  v = cc._decorator,
  b = v.ccclass,
  C = v.property,
  T = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.TAG_DELAY_NEXT_TURN = 1e3;
      e.btnDanhBai = null;
      e.btnDanhBaiNodeActive = null;
      e.btnThiepBai = null;
      e.btnThiepBaiNodeActive = null;
      e.btnTrungBai = null;
      e.nodeTrungBaiDisable = null;
      e.btnCupBai = null;
      e.lbVongDanh = null;
      e.nodeVongDanh = null;
      e.listPlayerCardPos = [];
      e.listPlayerCardPosEnd = [];
      e.nodeEffectVongTrungBai = null;
      e.listEffectVongTrungBai = [];
      e.listEffectVongTrungBaiName = ["TrungBich", "TrungChuan", "TrungRo", "TrungCo"];
      e.listEffectVongSoBaiName = ["XoBich", "XoChuon", "XoRo", "XoCo"];
      e.listEffectTuQuy = [];
      e.listEffectDongChat = [];
      e.listEffectBaiBeHon6 = [];
      e.IsKhongChoiVanNay = true;
      e.timeForTurn = 20;
      e.listServerCodeCurrentTurn = [];
      e.listChangeTurnPending = [];
      e.prefabMoneyUI = null;
      e.velocity = 1300;
      e.delayTime = .2;
      e.listINGAME_USER_READYPending = [];
      e.timeFinishTrungBai = 0;
      e.lt = -1;
      e.winplayerUid = null;
      e.listUserCoTurn6 = [];
      e.cardSoCuaUserStart = null;
      e.indexStartSoCHi = 0;
      e.isKhongShowAnim = false;
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {
      t.prototype.onLoad.call(this);
      this.POS2 = [0, 3];
      this.POS3 = [0, 2, 4];
      this.POS4 = [0, 1, 3, 5];
      this.POS5 = [0, 1, 2, 4, 5];
      this.POS6 = [0, 1, 2, 3, 4, 5];
      this.nodeEffectVongTrungBai.zIndex = c.default.MIDDLE_TOP_2 + 30;
      this.scalePlayerOther = .65;
    };
    e.prototype.initDefaultData = function() {
      t.prototype.initDefaultData.call(this);
      if (h.default.getInstance().isAnDanh) {
        this.isGameAnDanh = true;
        this.isGameAnDanhCheck = true;
      }
      this.hideALLForStart();
    };
    e.prototype.onReceiveMessage = function(e, i, n) {
      if (e === y.Global_Message.INGAME_USER_READY && this._dangKetThuc) {
        this.listINGAME_USER_READYPending.push(n);
      } else {
        switch (t.prototype.onReceiveMessage.call(this, e, i, n), e) {
          case S.CatteMessage.DEAL_CARD:
            var o = n.cs,
              a = n.lpi;
            this.IsKhongChoiVanNay = true;
            for (var s = 0; s < a.length; ++s) {
              var r = a[s];
              if (null !== r && void 0 !== r && 0 === d.default.getInstance().userID.localeCompare(r)) {
                this.IsKhongChoiVanNay = false;
              }
            }
            this.startGame(o, a, n);
            break;
          case S.CatteMessage.CHANGE_TURN:
            this.changeTurn(n);
            break;
          case S.CatteMessage.END_GAME:
            this.finishGame(n);
            break;
          case y.Global_Message.INGAME_USER_READY:
            n.uid == this._thisPlayerView.userID ? (this.cardGameTableController.readyBtn.active = false, 0 == this._thisPlayerView
              .isHost && (this._thisPlayerView.iconnReady.active = true)) : this._thisPlayerView.isHost && (this.cardGameTableController
              .startBtn.active = true);
        }
      }
    };
    e.prototype.startGameUI = function(t) {
      this.locPlayingPlayer(t);
      for (var e = 0; e < this.players.length; ++e) {
        this.players[e].iconnReady.active = false;
      }
      s.default.getInstance().CheckForceUpdateByGameScene(a.GameConfigs.SceneName.Catte);
    };
    e.prototype.startGame = function(t, e, i) {
      var n = this;
      p.default.getInstance().playEffect("Sounds/chiabai");
      if (this._dangKetThuc) {
        this.handlePendingPlayers();
      }
      this.hideALLForStart();
      this._dangPhatBai = true;
      this.cardGameTableController.startGameUI();
      this.startGameUI(e);
      this.state = y.GameState.PLAYING;
      if (null !== this._thisPlayerView && void 0 !== this._thisPlayerView && t.length > 0) {
        this._thisPlayerView.setArrayCard(t);
      }
      for (var o = .2, a = 0; a < this.playersPlaying.length; a++) {
        var s = this.playersPlaying[a],
          r = s.isMine();
        if (true !== r || 0 !== t.length) {
          for (var h = 0; h < s.cards.length; ++h) {
            var u = s.cards[h];
            u.node.active = true;
            var d = .6;
            if (r) {
              var f = this.getCardPosTrenTayOfMine(h),
                g = f.mag();
              u.setType(l.default.TypeBIG);
              u.node.zIndex = c.default.MIDDLE_TOP_2 + h + 1;
              d = g / this.velocity;
              u.node.opacity = 0;
              u.isAllowClick = false;
              var m = cc.sequence(cc.delayTime(this.delayTime + .08 * h), cc.callFunc(this.phatBaiFX, this, u), cc.moveTo(d, f).easing(cc
                .easeExponentialOut()));
              u.node.runAction(m);
              if (5 === h) {
                o = d;
              }
            } else {
              u.setType(l.default.TypeHIDE);
              m = cc.sequence(cc.delayTime(this.delayTime + .08 * h), cc.moveTo(d, this.listPlayerCardPos[s.indexPos].position).easing(cc
                .easeExponentialOut()));
              u.node.runAction(m);
            }
            u.node.eulerAngles = new cc.Vec3(-23, 0, 0);
            u.Rotationby(this.delayTime + .08 * h, d, 23, false);
          }
        }
      }
      this.listChangeTurnPending = [];
      this.node.runAction(cc.sequence(cc.delayTime(this.delayTime + .4 + o), cc.callFunc(function() {
        n.finishPhatBai();
      })));
      this.showuserAnDanh();
    };
    e.prototype.changeTurn = function(t) {
      if (!this.isGameAnDanhCheck) {
        if (this._dangPhatBai) {
          this.listChangeTurnPending.push(t);
        } else {
          if (this.cardGameTableController.readyBtn.active = false, this.cardGameTableController.startBtn.active = false, this
            .handleCurrentTurnData(t), this.hideAllBtn(), null === t.fP || void 0 === t.fP) {
            this.nextTurnToPlayer(this, t);
          } else {
            var e = .5,
              i = false;
            if (!(null !== t.tP && void 0 !== t.tP && t.fP.r !== t.tP.r)) {
              e = 2;
              i = 5 === t.fP.r;
            }
            if (false === i) {
              this.node.stopActionByTag(this.TAG_DELAY_NEXT_TURN);
              this.node.runAction(cc.sequence(cc.delayTime(e), cc.callFunc(this.nextTurnToPlayer.bind(this), this, t))).setTag(this
                .TAG_DELAY_NEXT_TURN);
            }
          }
          if (null !== t.iDTA && void 0 !== t.iDTA) {
            for (var n = 0; n < t.iDTA.length; ++n) {
              var o = this.getPlayer(t.iDTA[n]);
              if (null !== o && void 0 !== o) {
                this.playEffectVongTrungBai(o, "VangTung");
                if (o.isMine()) {
                  o.blockAllCardTouch();
                }
              }
            }
          }
        }
      }
    };
    e.prototype.handleCurrentTurnData = function(t) {
      if (null === t.fP || void 0 === t.fP) {
        this.listServerCodeCurrentTurn = [];
      } else {
        var e = this.getPlayer(t.fP.uid);
        e.stopCountDown();
        var i = Math.min(t.fP.r - 1, 4),
          n = t.fP.c;
        if (e.isMine() && -1 === n) {
          n = t.fP.iGC;
        }
        var o = e.isMine() ? e.getCardOfMine(n, null) : e.cards[5 - i];
        e.cardsDaDanhRa.push(o);
        o.setClickEnabled(false, false, null);
        var a = "";
        if (t.fP.c >= 0 ? (o.setTextureWithCode(n, y.GAME.CATTE), this.setBlackCard(i, o), a = 0 === this.listServerCodeCurrentTurn
            .length ? "\u0110\xe1nh " + o.getCardNameCatte() : "B\u1eaft " + o.getCardNameCatte(), this.listServerCodeCurrentTurn.push(o),
            p.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_btn_danhbai")) : (o.setTypeHIDENoScale(), o.setBlackFace(true), a =
            "Thi\u1ec7p", p.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_fold")), i < 4) {
          if (e.isMine()) {
            this.sapLaiCardTrenTayOfMine(t.fP.r);
          }
          this.moveCardToEnd(o, e.indexPos, i);
          this.sapLaiCardTrenBan(e);
        } else if (4 === i) {
          var s = this.listEffectVongTrungBaiName[o.S - 1],
            r = false;
          if (1 === this.listServerCodeCurrentTurn.length) {
            a = "Tr\u01b0ng " + o.getCardNameCatte();
            r = true;
          } else {
            if (o.isBlackFace) {
              a = "Kh\xf4ng c\xfap";
            } else {
              s = "CUP";
              a = "C\xfap " + o.getCardNameCatte();
            }
          }
          this.playEffectVongTrungBai(e, s, r, 0);
          this.moveCardToTrungPos(o, e);
        }
        if (!g.default.isNullOrEmpty(a)) {
          this.playPlayerShowBubbleFx(e, a);
        }
        if (!(null !== t.tP && void 0 !== t.tP && t.fP.r !== t.tP.r)) {
          this.listServerCodeCurrentTurn = [];
        }
      }
    };
    e.prototype.nextTurnToPlayer = function(t, e) {
      if (null !== e.tP && void 0 !== e.tP) {
        if (0 === this.listServerCodeCurrentTurn.length) {
          this.newTurnRound();
        }
        var i = e.tP.r;
        this.lbVongDanh.string = (i + 1).toString();
        this.nodeVongDanh.active = true;
        var n = this.getPlayer(e.tP.uid);
        this.showBtnChoUserNextTurn(n);
        n.startCountDown(this.timeForTurn - 2);
      }
    };
    e.prototype.newTurnRound = function() {
      for (var t = 0; t < this.players.length; ++t) {
        var e = this.players[t];
        if (1 !== e.state) {
          e.removeBubbleFx(true);
        }
      }
    };
    e.prototype.playEffectVongTrungBai = function(t, e, i, n) {
      if (void 0 === i && (i = true), void 0 === n && (n = 6), !this.isGameAnDanhCheck) {
        var o = this.listEffectVongTrungBai[t.indexPos];
        o.node.active = true;
        o.setAnimation(0, e, i);
        for (var a = 0; a < t.cards.length && a < n; ++a) {
          t.cards[a].setBlackFace(true);
        }
        var s = this.listPlayerCardPosEnd[0].scale,
          r = this.listPlayerCardPosEnd[t.indexPos].scale;
        o.node.scale = r / s * .9;
      }
    };
    e.prototype.setBlackCard = function(t, e) {
      if (t < 4) {
        for (var i = 0; i < this.listServerCodeCurrentTurn.length; ++i) {
          this.listServerCodeCurrentTurn[i].setBlackFace(true);
          if (false === this.listServerCodeCurrentTurn[i].isCardBack) {
            this.listServerCodeCurrentTurn[i].runActionFlipToHide(.2);
          }
        }
      } else if (4 === t) {
        for (i = 0; i < this.listServerCodeCurrentTurn.length; ++i) {
          var n = this.listServerCodeCurrentTurn[i];
          if (!n.isBlackFace && e.S === n.S && e.N > n.N) {
            return void n.setBlackFace(true);
          }
        }
        if (this.listServerCodeCurrentTurn.length > 0) {
          e.setBlackFace(true);
        }
      }
    };
    e.prototype.finishGame = function(t, e) {
      if (void 0 === e) {
        e = false;
      }
      this.cardGameTableController.startGameUI();
      this._dangKetThuc = true;
      this.winplayerUid = null;
      this.lt = -1;
      var i = 0,
        n = 0;
      if (this.isEndGameDoToiTrang(t) > 0) {
        n = this.timeToFinish;
        i = this.finishGameDoToiTrang(t);
        i = Math.max(9.5 - n, i);
      } else {
        this.listUserCoTurn6 = [];
        if (void 0 != t.fP) {
          this.checkuserHaveTurn(t.fP);
        }
        for (var o = 0; o < t.ps.length; o++) {
          var a = t.ps[o];
          this.checkuserHaveTurn(a);
        }
        n = this.listUserCoTurn6.length <= 1 ? this.timeToFinish : this.timeFinishTrungBai;
        i = this.finishGameDanhBinhThuong(t, e);
      }
      var s = n + i;
      if (e && void 0 !== t.rmT) {
        s = t.rmT / 1e3 + n;
      }
      var r = cc.sequence(cc.delayTime(s), cc.callFunc(this.handlePendingPlayers, this));
      this.node.runAction(r);
    };
    e.prototype.finishGameDoToiTrang = function(t) {
      for (var e = this, i = .2, n = [], o = 0; o < t.ps.length; o++) {
        var a = t.ps[o];
        if (null === a.pi || void 0 === a.pi || false !== a.pi) {
          var s = this.getPlayer(a.uid);
          s.setArrayCard(a.cs);
          for (var r = s.isMine(), h = 0; h < s.cards.length; ++h) {
            var u = s.cards[h];
            u.node.active = true;
            var d = r ? this.getCardPosTrenTayOfMine(h) : this.getCardPosToiTrangOfOther(s.indexPos, h);
            u.node.zIndex = c.default.MIDDLE_TOP_2 + h + 1;
            var p = .6;
            if (u.node.opacity = 0, r) {
              var f = d.mag();
              u.setType(l.default.TypeBIG);
              p = f / this.velocity;
              if (5 === h) {
                i = p;
              }
            }
            var g = cc.sequence(cc.delayTime(this.delayTime + .08 * h), cc.callFunc(this.phatBaiFX, this, u), cc.moveTo(p, d).easing(cc
              .easeExponentialOut()));
            u.node.runAction(g);
            u.node.eulerAngles = new cc.Vec3(-23, 0, 0);
            u.Rotationby(this.delayTime + .08 * h, p, 23, false);
          }
          n.push(a.uid);
        }
      }
      this.node.runAction(cc.sequence(cc.delayTime(this.delayTime + .4 + i + .5), cc.callFunc(function() {
        e.showToiTrangAnim(t);
      }), cc.delayTime(3), cc.callFunc(function() {
        e.dienHoatAnimChungTienAndShowKQ(t);
      })));
      this.startGameUI(n);
      this.showuserAnDanh();
      this._soVanKhongThaoTac--;
      return this.delayTime + .4 + i + .5 + 3;
    };
    e.prototype.showToiTrangAnim = function(t) {
      for (var e = true, i = 0; i < t.ps.length; i++) {
        var n = t.ps[i],
          o = this.getPlayer(n.uid);
        if (null !== n.wcr && void 0 !== n.wcr && n.wcr > 0) {
          this.playEffectToiTrang(o, n.wcr);
        }
        if (null !== n.lt && void 0 !== n.lt && 1 === n.lt) {
          this.playEffectCong(o);
          if (o.isMine()) {
            e = false;
          }
        }
      }
      this.playMusicAnTrang(e);
    };
    e.prototype.checkuserHaveTurn = function(t) {
      if (!(null !== t.pi && void 0 !== t.pi && false === t.pi)) {
        if (void 0 === t.lt || 0 === t.lt) {
          this.listUserCoTurn6.push(t);
        } else {
          if (void 0 != t.lt && 2 === t.lt) {
            this.lt = 2;
          }
        }
        if (t.mX > 0) {
          this.winplayerUid = t.uid;
        }
      }
    };
    e.prototype.finishGameDanhBinhThuong = function(t, e) {
      var i = this,
        n = 2;
      if (e && (n = .01), this.listUserCoTurn6.length <= 1) {
        this.node.runAction(cc.sequence(cc.delayTime(n), cc.callFunc(function() {
          i.showAnimGietTung();
          i.newTurnRound();
          i.playMusicAnTrang(0 === d.default.getInstance().userID.localeCompare(i.winplayerUid));
        }), cc.delayTime(1.9), cc.callFunc(function() {
          i.dienHoatAnimChungTienAndShowKQ(t);
        })));
        return 4;
      }
      for (var o = -1, a = [], s = 0; s < this.listUserCoTurn6.length; ++s) {
        var r = this.listUserCoTurn6[s],
          c = this.getPlayer(r.uid);
        a.push(c.sit);
        r.sit = c.sit;
        if (0 === s) {
          o = c.sit;
        }
      }
      this.listUserCoTurn6.sort(function(t, e) {
        return t.sit === o ? -1 : o === e.sit ? 1 : t.sit > o && e.sit < o ? -1 : t.sit < o && e.sit > o ? 1 : t.sit > e.sit ? 1 : t
          .sit < e.sit ? -1 : 0;
      });
      this.node.runAction(cc.sequence(cc.delayTime(n), cc.callFunc(function() {
        i.lbVongDanh.string = "6";
        i.newTurnRound();
        i.hideEffectTrungBaiCuaUserThua(t, e);
      }), cc.delayTime(2 * this.listUserCoTurn6.length + 2), cc.callFunc(function() {
        i.showAnimGietTung();
        i.dienHoatAnimChungTienAndShowKQ(t);
        i.playMusicAnBinhThuong(0 === d.default.getInstance().userID.localeCompare(i.winplayerUid));
      })));
      return 2 * this.listUserCoTurn6.length;
    };
    e.prototype.showAnimGietTung = function() {
      if (!g.default.isNullOrEmpty(this.winplayerUid) && 2 === this.lt) {
        var t = this.getPlayer(this.winplayerUid);
        this.playEffectVongTrungBai(t, "GietTung", true, 0);
        for (var e = 0; e < t.cardsDaDanhRa.length; ++e) {
          t.cardsDaDanhRa[e].setBlackFace(true);
        }
      }
    };
    e.prototype.hideEffectTrungBaiCuaUserThua = function(t, e) {
      if (void 0 != t.fP) {
        for (var i = 0; i < this.playersPlaying.length; ++i) {
          var n = this.playersPlaying[i];
          if (this.listEffectVongTrungBai[n.indexPos].node.active) {
            if (0 !== t.fP.uid.localeCompare(n.userID)) {
              this.listEffectVongTrungBai[n.indexPos].node.active = false;
            } else {
              n.cardsDaDanhRa[4].setHighLight(true);
            }
          }
        }
      }
      if (this.isGameAnDanhCheck) {
        this.showTurn6(true);
      } else {
        this.showTurn6(e);
      }
    };
    e.prototype.showTurn6 = function(t) {
      this.cardSoCuaUserStart = null;
      this.indexStartSoCHi = 0;
      this.isKhongShowAnim = t;
      for (var e = 0; e < this.listUserCoTurn6.length; e++) {
        if (t) {
          this.finishTur6ForPlayer();
        } else {
          this.node.runAction(cc.sequence(cc.delayTime(2 * (1 + e)), cc.callFunc(this.finishTur6ForPlayer.bind(this))));
        }
      }
    };
    e.prototype.finishTur6ForPlayer = function() {
      if (!(this.indexStartSoCHi >= this.listUserCoTurn6.length)) {
        var t = this.listUserCoTurn6[this.indexStartSoCHi],
          e = 0 === this.indexStartSoCHi,
          i = this.getPlayer(t.uid);
        this.indexStartSoCHi++;
        i.stopCountDown();
        i.removeBubbleFx();
        var n = null,
          o = null;
        if (i.isMine() ? (n = i.cardsDaDanhRa[5], o = i.cardsDaDanhRa[4]) : (n = i.cards[0], o = i.cards[1], n.node.scale = o.node.scale,
            this.isGameAnDanhCheck ? n.setTypeHIDENoScale() : void 0 !== t.c && t.c >= 0 && n.setTextureWithCode(t.c, y.GAME.CATTE)), n
          .node.zIndex = o.node.zIndex - 1, n.node.runAction(cc.moveTo(.2, n.node.x - 40 * n.node.scale, n.node.y)), o.node.runAction(cc
            .moveTo(.2, o.node.x + 40 * n.node.scale, o.node.y)), false === this.isKhongShowAnim) {
          var a = true;
          if (e) {
            this.playPlayerShowBubbleFx(i, "X\u1ed5 " + n.getCardNameCatte());
            this.cardSoCuaUserStart = n;
          } else {
            if (null !== this.cardSoCuaUserStart && this.cardSoCuaUserStart.S === n.S && n.N > this.cardSoCuaUserStart.N) {
              this.cardSoCuaUserStart = n;
              this.playPlayerShowBubbleFx(i, "B\u1eaft " + n.getCardNameCatte());
            } else {
              a = false;
              this.playPlayerShowBubbleFx(i, "Th\u1ea5t B\u1ea1i");
            }
          }
          if (n.S - 1 < this.listEffectVongSoBaiName.length && a) {
            this.playEffectVongTrungBai(i, this.listEffectVongSoBaiName[n.S - 1], true, 0);
          }
        }
      }
    };
    e.prototype.dienHoatAnimChungTienAndShowKQ = function(t) {
      if (void 0 != t.fP) {
        var e = this.getPlayer(t.fP.uid);
        this.finishGameForPlayer(e, t.fP);
      }
      for (var i = 0; i < t.ps.length; i++) {
        var n = t.ps[i];
        if (!n.hasOwnProperty("pS") || 0 != n.pS) {
          var o = this.getPlayer(n.uid);
          this.finishGameForPlayer(o, n);
        }
      }
    };
    e.prototype.finishGameForPlayer = function(t, e) {
      if (t.stopCountDown(), t.removeBubbleFx(), void 0 != e.m && t.setMoney(e.m), !t.isAnDanh) {
        var i = e.mX;
        if (i > 0) {
          t.runWinAction(this.timeToFinish);
          this.winplayerUid = e.uid;
        }
        var n = cc.instantiate(this.prefabMoneyUI).getComponent(f.default);
        n.node.parent = this.node;
        n.node.zIndex = c.default.MIDDLE_TOP_2 + 25;
        n.node.position = t.node.position;
        n.setMoney(i);
        n.show(y.GAME.TIENLEN, this.timeToFinish, true);
        if (void 0 != e.lt && 2 === e.lt) {
          this.playEffectVongTrungBai(t, "VangTung");
          this.lt = e.lt;
        }
      }
    };
    e.prototype.isEndGameDoToiTrang = function(t) {
      for (var e = 0; e < t.ps.length; e++) {
        if (null !== t.ps[e].wcr && void 0 !== t.ps[e].wcr && t.ps[e].wcr > 0) {
          return t.ps[e].wcr;
        }
      }
      return 0;
    };
    e.prototype.getListChatDefaultText = function() {
      return ["Nhanh n\xe0o, nh\xe0 bao vi\u1ec7c.", "Suy ngh\u0129 l\xe2u th\u1ebf.", "Thi\u1ec7p \u0111i, A \u0111\xe2y.",
        "B\xe0i ch\xfaa r\u1ed3i.", "B\xe0i b\xe9 vl.", "M\xe9o c\xf3 b\xe0i ch\u1eb7n.", "Thi\u1ec7p h\u1ebft \u0111i m\u1ea5y b\xe9.",
        "K l\xe0 to \xe0? A \u0111\xe2y kk", "X\xe9t b\xe0i.", "\u0110\xe1nh con to nh\u1ea5t \u0111i.", "\u0102n h\u1ebft.",
        "Xin 1 v\xe1n \u0103n tr\u1eafng."
      ];
    };
    e.prototype.onGetInGameTableInfo = function(e) {
      if (null !== e && void 0 !== e && 2 === e.Mu) {
        this.isGameAnDanh = false;
        this.isGameAnDanhCheck = false;
      }
      t.prototype.onGetInGameTableInfo.call(this, e);
      var i = e.b,
        n = e.gS,
        o = e.rmT;
      o /= 1e3;
      var a = e.aid,
        s = e.Mu,
        r = false;
      if (null !== e.hpwd && void 0 !== e.hpwd) {
        r = e.hpwd;
      }
      var c = e.tfeg;
      c /= 1e3;
      this.timeToFinish = c;
      this.timeFinishTrungBai = void 0 != e.tfegTb ? e.tfegTb / 1e3 : c;
      this.state = y.GameState.WAITING;
      if (!(4 !== n && 3 !== n && 5 !== n)) {
        this.state = y.GameState.VIEWING;
      }
      this.setGameConfig(i, n, o, a, s, r);
      var l = e.ps;
      this.createListPlayerWhenGetTableInfo(l);
      var h = false;
      if (null !== e.re && void 0 !== e.re && e.re && (h = true), this.updateViewPostions(true, false, h), this.hideALLForStart(), this
        .state === y.GameState.VIEWING) {
        if (null !== e.re && void 0 !== e.re && e.re) {
          this.reconnectLastGame(e);
          this.updateViewingPlayerPositions();
          this.IsKhongChoiVanNay = false;
        } else {
          this._thisPlayerView.runViewAction();
          for (var u = 0; u < this.players.length; u++) {
            this.players[u].runViewAction();
          }
          this.showViewTableMessage();
          this.IsKhongChoiVanNay = true;
          if (5 === e.gS) {
            this.finishGame(e, true);
          }
        }
        if (null !== e.re && void 0 !== e.re && e.re) {
          this.showuserAnDanh();
        }
      } else {
        this.autoSendReady();
      }
    };
    e.prototype.showHideInviteBtn = function() {
      var t = this;
      this.inviteBtns.forEach(function(e) {
        e.active = 6 === t.maxUser;
      });
      if (2 === this.maxUser) {
        this.POS2.forEach(function(e) {
          t.inviteBtns[e].active = true;
        });
      }
    };
    e.prototype.getViewPositionOfPlayer = function(t, e) {
      var i = -1,
        n = this.players.length,
        o = this.POS6;
      if (2 === n) {
        o = this.POS2;
      } else {
        if (3 === n) {
          o = this.POS3;
        } else {
          if (4 === n) {
            o = this.POS4;
          } else {
            if (5 === n) {
              o = this.POS5;
            }
          }
        }
      }
      if (null !== this._thisPlayerView && void 0 !== this._thisPlayerView) {
        i = this._thisPlayerView.index;
      }
      var a = o.length;
      if (i >= 0) {
        e = (e + a - i) % a;
      }
      t.indexPos = o[e];
      return this.inviteBtns[t.indexPos].position;
    };
    e.prototype.getBaiDangDuocChon = function() {
      if (null !== this._thisPlayerView && void 0 !== this._thisPlayerView) {
        for (var t = this.listPlayerCardPos[0].position, e = this.listPlayerCardPosEnd[0].position, i = 0; i < this._thisPlayerView.cards
          .length; ++i) {
          var n = this._thisPlayerView.cards[i];
          if (n.isAllowClick && n.node.y >= t.y + 38 && n.node.y < e.y - 2) {
            return n;
          }
        }
      }
      return null;
    };
    e.prototype.setDanhBaiInteractable = function(t) {
      this.btnDanhBai.interactable = t;
      this.btnDanhBaiNodeActive.active = !t;
    };
    e.prototype.setThiepBaiInteractable = function(t) {
      this.btnThiepBai.interactable = t;
      this.btnThiepBaiNodeActive.active = !t;
    };
    e.prototype.setTrungBaiInteractable = function(t) {
      this.btnTrungBai.interactable = t;
      this.nodeTrungBaiDisable.active = !t;
    };
    e.prototype.showBtnChoUserNextTurn = function(t) {
      if (t.cardsDaDanhRa.length < 4) {
        if (this.btnDanhBai.node.active = t.isMine(), this.btnDanhBai.node.active) {
          this.btnThiepBai.node.active = this.listServerCodeCurrentTurn.length > 0;
          this.setThiepBaiInteractable(false);
          this.setDanhBaiInteractable(false);
          var e = this.getBaiDangDuocChon();
          this.checkAndShowBtnDanhBaithiepBai(e);
        }
      } else if (4 === t.cardsDaDanhRa.length) {
        this.btnTrungBai.node.active = t.isMine();
        this.setTrungBaiInteractable(false);
        if (e = this.getBaiDangDuocChon()) {
          this.checkAndShowBtnTrungBai(e);
        }
        this.checkAndShowBtnCup(e);
      }
    };
    e.prototype.checkAndShowBtnTrungBai = function(t) {
      if (4 == this._thisPlayerView.cardsDaDanhRa.length) {
        this.setTrungBaiInteractable(true);
      }
    };
    e.prototype.checkAndShowBtnDanhBaithiepBai = function(t) {
      if (null !== t && this.btnDanhBai.node.active) {
        if (this.listServerCodeCurrentTurn.length > 0) {
          this.setThiepBaiInteractable(true);
        }
        for (var e = true, i = 0; i < this.listServerCodeCurrentTurn.length; ++i) {
          var n = this.listServerCodeCurrentTurn[i];
          if (n.S !== t.S || n.N > t.N) {
            e = false;
            break;
          }
        }
        this.setDanhBaiInteractable(e);
      }
    };
    e.prototype.checkAndShowBtnCup = function(t) {
      if (null !== t && this.btnTrungBai.node.active && this.listServerCodeCurrentTurn.length > 0) {
        var e = this.listServerCodeCurrentTurn[0];
        if (this.btnCupBai.node.active = false, t.S !== e.S || t.N < e.N) {
          return;
        }
        for (var i = 1; i < this.listServerCodeCurrentTurn.length; ++i) {
          var n = this.listServerCodeCurrentTurn[i];
          if (n.S === t.S && n.N > t.N) {
            return;
          }
        }
        this.btnCupBai.node.active = true;
      }
    };
    e.prototype.onclickDanhBai = function() {
      var t = this.getBaiDangDuocChon();
      if (null === t) {
        m.default.getInstance().showPopupMessageUtil("Vui l\xf2ng ch\u1ecdn b\xe0i \u0111\u1ec3 \u0111\xe1nh!");
      } else {
        _.default.getInstance().sendDanhBai(t.serverCode);
      }
      this._khongThaoTac = false;
    };
    e.prototype.onClickThiepBai = function() {
      var t = this.getBaiDangDuocChon();
      if (null === t) {
        m.default.getInstance().showPopupMessageUtil("Vui l\xf2ng ch\u1ecdn b\xe0i \u0111\u1ec3 thi\u1ec7p!");
      } else {
        _.default.getInstance().sendThiepBai(t.serverCode);
      }
      this._khongThaoTac = false;
    };
    e.prototype.onclickTrungBai = function() {
      var t = this.getBaiDangDuocChon();
      if (null === t) {
        var e = this.btnCupBai.node.active ? "Vui l\xf2ng ch\u1ecdn b\xe0i \u0111\u1ec3 c\xfap!" :
          "Vui l\xf2ng ch\u1ecdn b\xe0i \u0111\u1ec3 tr\u01b0ng!";
        m.default.getInstance().showPopupMessageUtil(e);
      } else {
        _.default.getInstance().sendDanhBai(t.serverCode);
      }
      this._khongThaoTac = false;
    };
    e.prototype.hideALLForStart = function() {
      var t = this;
      this._dangKetThuc = false;
      this.listINGAME_USER_READYPending = [];
      this.node.stopAllActions();
      this.players.forEach(function(e) {
        e.hideAllCard(false);
        e.stopViewAction();
        e.removeBubbleFx();
        e.cardsDaDanhRa = [];
        for (var i = e.isMine(), n = 0; n < e.cards.length; ++n) {
          e.cards[n].resetCattle();
          e.cards[n].stopSparkling();
          if (i) {
            e.cards[n].setClickEnabled(true, false, t.userClickCardCuaMinh.bind(t));
          }
        }
      });
      this.listChangeTurnPending = [];
      this.hideAllBtn();
      this.nodeVongDanh.active = false;
      for (var e = 0; e < this.listEffectVongTrungBai.length; ++e) {
        this.listEffectVongTrungBai[e].node.active = false;
      }
      for (e = 0; e < this.listEffectTuQuy.length; ++e) {
        this.listEffectTuQuy[e].node.active = false;
      }
      for (e = 0; e < this.listEffectDongChat.length; ++e) {
        this.listEffectDongChat[e].node.active = false;
      }
      for (e = 0; e < this.listEffectBaiBeHon6.length; ++e) {
        this.listEffectBaiBeHon6[e].node.active = false;
      }
    };
    e.prototype.hideAllBtn = function() {
      this.btnDanhBai.node.active = false;
      this.btnThiepBai.node.active = false;
      this.btnTrungBai.node.active = false;
      this.btnCupBai.node.active = false;
    };
    e.prototype.addPlayer = function(e, i, n, o, a, s, r, c, l, h, u, d, p) {
      var f = t.prototype.addPlayer.call(this, e, i, n, o, a, s, r, c, l, h, u, d, p);
      if (f.initCatteCard(this.prefabsGameCard), f.isMine()) {
        for (var g = 0; g < f.cards.length; ++g) {
          f.cards[g].setClickEnabled(true, false, this.userClickCardCuaMinh.bind(this));
        }
      }
      f.bubbleFxPos.y += 25;
      return f;
    };
    e.prototype.sapLaiCardTrenTayOfMine = function(t) {
      for (var e = this.listPlayerCardPos[0].position, i = e.x + 45 * t, n = 0, o = 0; o < this._thisPlayerView.cards.length; ++o) {
        var a = this._thisPlayerView.cards[o];
        if (a.isAllowClick) {
          a.node.runAction(cc.moveTo(.2, i + 90 * n, e.y));
          n++;
        }
      }
    };
    e.prototype.sapLaiCardTrenBan = function(t, e) {
      if (void 0 === e && (e = true), 1 !== t.indexPos && 2 !== t.indexPos || !e) {
        var i = this.listPlayerCardPosEnd[t.indexPos],
          n = i.position,
          o = Math.round(i.width * i.scale * .67),
          a = n.x,
          s = Math.min(t.cardsDaDanhRa.length, 4);
        if (n.x > 200) {
          a = n.x - (s - 1) * o;
        } else {
          if (n.x > -200) {
            a = n.x - .5 * (s - 1) * o;
          }
        }
        for (var r = 0; r < t.cardsDaDanhRa.length && r < 4; ++r) {
          var c = t.cardsDaDanhRa[r];
          if (e) {
            c.node.runAction(cc.moveTo(.2, a + r * o, n.y));
          } else {
            c.node.x = a + r * o;
            c.node.y = n.y;
          }
        }
      }
    };
    e.prototype.moveCardToEnd = function(t, e, i) {
      t.node.stopAllActions();
      var n = this.listPlayerCardPosEnd[e];
      if (n.scale !== t.node.scale) {
        t.node.runAction(cc.scaleTo(.2, n.scale));
      }
      t.node.zIndex = c.default.MIDDLE_TOP_2 + i + 10;
      var o = n.position;
      if (!(o.x > -200)) {
        var a = Math.round(n.width * n.scale * .67),
          s = 1;
        if (o.x > 0) {
          s = -1;
        }
        var r = o.x;
        if (0 === e) {
          r = o.x + (1.5 - .5 * i) * a;
        }
        t.node.runAction(cc.moveTo(.2, r + s * i * a, o.y));
      }
    };
    e.prototype.animCardToTrungPos = function(t, e, i) {
      if (void 0 === i) {
        i = true;
      }
      var n = this.listPlayerCardPos[e.indexPos].position;
      if (i) {
        t.node.runAction(cc.moveTo(.2, n.x + 225, n.y));
      } else {
        t.node.x = n.x + 225;
        t.node.y = n.y;
      }
    };
    e.prototype.moveCardToTrungPos = function(t, e, i) {
      if (void 0 === i && (i = true), e.isMine()) {
        for (var n = 0; n < e.cards.length; ++n) {
          (o = e.cards[n]).node.stopAllActions();
          if (o.isAllowClick) {
            this.animCardToTrungPos(o, e, i);
            o.setClickEnabled(false, false, null);
            e.cardsDaDanhRa.push(o);
          }
        }
        this.animCardToTrungPos(t, e, i);
      } else {
        t.node.stopAllActions();
        if (i) {
          t.node.runAction(cc.scaleTo(.2, e.node.scale - .05));
        } else {
          t.node.scale = e.node.scale - .05;
        }
      }
      t.node.zIndex = c.default.MIDDLE_TOP_2 + 19;
      for (n = 0; n < e.cardsDaDanhRa.length && n < 4; ++n) {
        var o;
        (o = e.cardsDaDanhRa[n]).setBlackFace(true);
      }
    };
    e.prototype.phatBaiFX = function(t, e) {
      e.node.active = true;
      e.node.opacity = 255;
    };
    e.prototype.getNameGame = function() {
      return "CATTE";
    };
    e.prototype.processCardMoveDown = function() {
      for (var t = this.listPlayerCardPos[0].position, e = function(e) {
          var n = i._thisPlayerView.cards[e];
          return -1 != i._thisPlayerView.cardsDaDanhRa.findIndex(function(t) {
            return t.serverCode == n.serverCode;
          }) ? "continue" : n.node.y > t.y + 35 ? {
            value: void 0
          } : void 0;
        }, i = this, n = 0; n < this._thisPlayerView.cards.length; ++n) {
        var o = e(n);
        if ("object" == typeof o) {
          return o.value;
        }
      }
      if (this.btnDanhBai.node.active) {
        this.setDanhBaiInteractable(false);
      }
      if (this.btnThiepBai.node.active) {
        this.setThiepBaiInteractable(false);
      }
      if (this.btnTrungBai.node.active) {
        this.setTrungBaiInteractable(false);
      }
      if (this.btnCupBai.node.active) {
        this.btnCupBai.node.active = false;
      }
    };
    e.prototype.userClickCardCuaMinh = function(t) {
      if (this._thisPlayerView) {
        var e = this.listPlayerCardPos[0].position;
        if (0 === t.node.getNumberOfRunningActions() && t.node.y > e.y + 35) {
          t.node.runAction(cc.sequence(cc.moveTo(.12, t.node.x, e.y), cc.callFunc(this.processCardMoveDown.bind(this))));
          return void p.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_select_card_on_hand");
        }
        for (var i = 0; i < this._thisPlayerView.cards.length; ++i) {
          var n = this._thisPlayerView.cards[i];
          if (n.isAllowClick) {
            n.node.stopAllActions();
            if (n.serverCode === t.serverCode) {
              n.node.runAction(cc.sequence(cc.moveTo(.12, n.node.x, e.y + 40), cc.callFunc(this.CardMoveDoneToClick.bind(this))));
              this.checkAndShowBtnDanhBaithiepBai(n);
              this.checkAndShowBtnCup(n);
              this.checkAndShowBtnTrungBai(n);
              p.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_select_card_on_hand");
            } else {
              if (Math.abs(n.node.y - e.y) > 1) {
                n.node.runAction(cc.moveTo(.12, n.node.x, e.y));
              }
            }
          }
        }
      }
    };
    e.prototype.CardMoveDoneToClick = function() {
      var t = this.getBaiDangDuocChon();
      this.checkAndShowBtnDanhBaithiepBai(t);
      this.checkAndShowBtnCup(t);
    };
    e.prototype.getCmdStart = function() {
      return y.Global_Message.INGAME_USER_READY;
    };
    e.prototype.showViewTableMessage = function() {
      this.node.runAction(cc.sequence(cc.delayTime(.7), cc.callFunc(function() {
        m.default.getInstance().showPopupMessageUtil("B\xe0n \u0111ang ch\u01a1i, xin vui l\xf2ng ch\u1edd!");
      })));
    };
    e.prototype.highlightCardReconnect = function(t) {
      for (var e = 0; e < t.ps.length; e++) {
        var i = t.ps[e];
        if (i.hasOwnProperty("r5W")) {
          if (i.r5W && i.dCs && i.dCs.length > 5) {
            for (var n = this.getPlayer(i.uid), o = 0; o < n.cardsDaDanhRa.length; o++) {
              if (n.cardsDaDanhRa[o].serverCode == i.dCs[4]) {
                n.cardsDaDanhRa[o].setHighLight(true);
              }
            }
          }
        }
      }
    };
    e.prototype.reconnectLastGame = function(t) {
      this.hideALLForStart();
      this.state = y.GameState.PLAYING;
      this._playedOnce = true;
      this.playersPlaying = [];
      for (var e = 0, i = 0; i < t.ps.length; i++) {
        var n = t.ps[i],
          o = this.getPlayer(n.uid);
        n.cardsDaDanhRa = [];
        if (void 0 != n.pi && 1 == n.pi) {
          this.taoLaiBaiCuaPlayerKhiReconect(n, o);
          if (o.isMine()) {
            this.taoLaiBaiCuaUserKhiReconect(n, o);
          }
          if (null !== n.iTn && void 0 !== n.iTn && true === n.iTn) {
            e = o.cardsDaDanhRa.length;
          }
          this.playersPlaying.push(o);
        }
      }
      this.listServerCodeCurrentTurn = [];
      for (i = 0; i < this.playersPlaying.length; i++) {
        if ((n = this.playersPlaying[i]).cardsDaDanhRa.length > e) {
          var a = n.cardsDaDanhRa[n.cardsDaDanhRa.length - 1];
          if (a.serverCode >= 0) {
            this.listServerCodeCurrentTurn.push(a);
          }
        }
      }
      if (5 === t.gS) {
        this.finishGame(t, true);
        this.highlightCardReconnect(t);
      } else {
        for (i = 0; i < t.ps.length; i++) {
          if (null !== (n = t.ps[i]).iTn && void 0 !== n.iTn && true === n.iTn) {
            o = this.getPlayer(n.uid);
            var s = t.rmT / 1e3;
            o.startCountDown(s, 1 - s / this.timeForTurn);
            this.lbVongDanh.string = (o.cardsDaDanhRa.length + 1).toString();
            this.nodeVongDanh.active = true;
            this.showBtnChoUserNextTurn(o);
          }
        }
      }
      this.showuserAnDanh();
    };
    e.prototype.taoLaiBaiCuaPlayerKhiReconect = function(t, e) {
      for (var i = 0; i < e.cards.length; ++i) {
        (o = e.cards[i]).node.active = true;
        o.node.position = this.listPlayerCardPos[e.indexPos].position;
      }
      if (null !== t.dCs && void 0 !== t.dCs) {
        var n = this.listPlayerCardPosEnd[e.indexPos];
        for (i = 0; i < t.dCs.length; i++) {
          var o,
            a = t.dCs[i];
          (o = e.cards[5 - i]).setTextureWithCodeHaveCheck(a, d.default.getInstance().gameID);
          o.node.scale = i < 4 ? n.scale : o.getScaleWithType(l.default.TypeBIG);
          if (!e.isMine()) {
            o.node.scale = n.scale;
          }
          o.node.zIndex = c.default.MIDDLE_TOP_2 + i + 10;
          e.cardsDaDanhRa.push(o);
          o.setClickEnabled(false, false, null);
        }
        this.sapLaiCardTrenBan(e, false);
        var s = e.cardsDaDanhRa[4];
        if (s) {
          var r = e.cardsDaDanhRa.length;
          if (5 == r && this.moveCardToTrungPos(s, e, false), r >= 5) {
            var h,
              u = this.listEffectVongTrungBaiName[s.S - 1];
            h = "Tr\u01b0ng " + s.getCardNameCatte();
            true;
            if (!g.default.isNullOrEmpty(h)) {
              this.playPlayerShowBubbleFx(e, h);
            }
            this.playEffectVongTrungBai(e, u, true, 0);
          }
        }
      }
    };
    e.prototype.taoLaiBaiCuaUserKhiReconect = function(t, e) {
      for (var i = 0; i < t.cs.length; i++) {
        var n = t.cs[5 - i - e.cardsDaDanhRa.length];
        (s = e.cards[i]).setTextureWithCodeHaveCheck(n, d.default.getInstance().gameID);
        s.setType(l.default.TypeBIG);
      }
      this.sortBaiCuaMinh(e);
      for (var o = 0, a = 0; a < e.cards.length; ++a) {
        var s;
        if ((s = e.cards[a]).isAllowClick) {
          s.node.position = this.getCardPosTrenTayOfMine(o, Math.min(e.cardsDaDanhRa.length, 4));
          s.node.zIndex = c.default.MIDDLE_TOP_2 + o + 1;
          o++;
        }
      }
    };
    e.prototype.sortBaiCuaMinh = function(t) {
      t.cards.sort(function(t, e) {
        return t.N > e.N ? 1 : t.N < e.N ? -1 : t.S > e.S ? 1 : t.S < e.S ? -1 : 0;
      });
    };
    e.prototype.finishPhatBai = function() {
      var t = this;
      if (this._thisPlayerView.checkInThisArray(this.playersPlaying)) {
        this.state = y.GameState.PLAYING;
        this.sortBaiCuaMinh(this._thisPlayerView);
        for (var e = function() {
            var t = i._thisPlayerView.cards[n];
            t.node.active = true;
            var e = i.getCardPosTrenTayOfMine(n);
            t.node.runAction(cc.sequence(cc.moveTo(.3, e), cc.callFunc(function() {
              t.isAllowClick = true;
            })));
            t.node.zIndex = c.default.MIDDLE_TOP_2 + n + 1;
          }, i = this, n = 0; n < this._thisPlayerView.cards.length; ++n) {
          e();
        }
        this.node.runAction(cc.sequence(cc.delayTime(0), cc.callFunc(function() {
          t.finishSortBai();
        })));
      } else {
        this.state = y.GameState.VIEWING;
        this._thisPlayerView.runViewAction();
        this.finishSortBai();
        for (var o = 0; o < this.players.length; o++) {
          this.players[o].runViewAction();
        }
      }
    };
    e.prototype.finishSortBai = function() {
      this._dangPhatBai = false;
      for (var t = 0; t < this.listChangeTurnPending.length; ++t) {
        this.changeTurn(this.listChangeTurnPending[t]);
      }
      this.listChangeTurnPending = [];
    };
    e.prototype.handlePendingPlayers = function() {
      if (t.prototype.handlePendingPlayers.call(this), true !== this.checkAndQuitRoom()) {
        this._khongThaoTac = true;
        this.updateMoneys();
        this._dangKetThuc = false;
        this.updateReadyStatus();
        this.state = y.GameState.WAITING;
        this.removePendingPlayers();
        for (var e = 0; e < this.listINGAME_USER_READYPending.length; ++e) {
          var i = this.listINGAME_USER_READYPending[e];
          this.onReceiveMessage(y.Global_Message.INGAME_USER_READY, null, i);
        }
        this.autoSendReady();
        this.showHideuserAnDanh4(false);
        this.hideALLForStart();
      }
    };
    e.prototype.autoSendReady = function() {
      if (!(this.isHost || this.state == y.GameState.VIEWING)) {
        if (this._daNgoi) {
          if (this.tuDongGuiSanSang || h.default.getInstance().autoReady) {
            this.sendReady();
          } else {
            if (null != this.cardGameTableController) {
              this.cardGameTableController.readyBtn.active = true;
            }
          }
        }
      }
    };
    e.prototype.getCardPosTrenTayOfMine = function(t, e) {
      if (void 0 === e) {
        e = 0;
      }
      var i = this.listPlayerCardPos[0].position;
      return new cc.Vec2(i.x + 45 * e + 90 * t, i.y);
    };
    e.prototype.getCardPosToiTrangOfOther = function(t, e) {
      var i = this.listPlayerCardPosEnd[t],
        n = i.position,
        o = Math.round(i.width * i.scale * .67),
        a = n.x;
      if (n.x > 100) {
        a = n.x - 5 * o;
      } else {
        if (n.x > -100) {
          a = n.x - 2.5 * o;
        }
      }
      return new cc.Vec2(a + e * o, n.y);
    };
    e.prototype.getEffectToiTrang = function(t) {
      if (this.isGameAnDanhCheck) {
        return null;
      }
      if (1 === t && this.listEffectBaiBeHon6.length > 0) {
        for (var e = 0; e < this.listEffectBaiBeHon6.length; ++e) {
          if (!this.listEffectBaiBeHon6[e].node.active) {
            return this.listEffectBaiBeHon6[e];
          }
        }
        var i = cc.instantiate(this.listEffectBaiBeHon6[0].node).getComponent(r.default);
        this.listEffectBaiBeHon6.push(i);
        return i;
      }
      if (2 === t && this.listEffectDongChat.length > 0) {
        for (e = 0; e < this.listEffectDongChat.length; ++e) {
          if (!this.listEffectDongChat[e].node.active) {
            return this.listEffectDongChat[e];
          }
        }
        i = cc.instantiate(this.listEffectDongChat[0].node).getComponent(r.default);
        this.listEffectDongChat.push(i);
        return i;
      }
      if (3 === t && this.listEffectTuQuy.length > 0) {
        for (e = 0; e < this.listEffectTuQuy.length; ++e) {
          if (!this.listEffectTuQuy[e].node.active) {
            return this.listEffectTuQuy[e];
          }
        }
        i = cc.instantiate(this.listEffectTuQuy[0].node).getComponent(r.default);
        this.listEffectTuQuy.push(i);
        return i;
      }
      return null;
    };
    e.prototype.playEffectToiTrang = function(t, e) {
      if (!this.isGameAnDanhCheck) {
        var i = t.cards[0],
          n = this.getEffectToiTrang(e);
        if (null !== n) {
          n.node.active = true;
          var o = "animation";
          if (2 === e) {
            if (i.S >= 1 && i.S <= 4) {
              o = ["DongChatBich", "DongChatChuan", "DongChatRo", "DongChatCo"][i.S - 1];
            }
          }
          n.skeleton.setAnimation(0, o, false);
          var a = t.isMine() ? this.getCardPosTrenTayOfMine(2.5) : this.getCardPosToiTrangOfOther(t.indexPos, 2.5);
          n.node.x = a.x;
          n.node.scale = t.isMine() ? 1 : .8;
          n.node.y = a.y + i.node.scale * i.node.height / 2 + n.node.scale * n.node.height / 2 + 1 * n.node.scale;
        }
      }
    };
    e.prototype.playEffectCong = function(t) {
      if (!this.isGameAnDanhCheck) {
        var e = t.skeletonEffect;
        p.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_lose");
        e.node.position = new cc.Vec2(4, -19.487);
        e.node.scale = 1;
        e.node.active = true;
        e.node.zIndex = c.default.TL_EFFECT;
        e.setAnimation(0, "animation", true);
        e.setCompleteListener(function() {
          this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(function() {
            e.node.active = false;
          }.bind(this))));
        }.bind(this));
      }
    };
    e.prototype.playPlayerShowBubbleFx = function(t, e) {
      if (!this.isGameAnDanhCheck) {
        var i = false;
        if (t.node.position.x > 200) {
          i = true;
        }
        t.showBubbleFx(e, 0, true, i);
        t.scheduleOnce(function() {
          t.bubbleFx.popIn();
        }, 3);
      }
    };
    e.prototype.playMusicAnTrang = function(t) {
      if (t) {
        p.default.getInstance().playEffect("Sounds/sfx_jackpot");
      } else {
        p.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_lose");
      }
    };
    e.prototype.playMusicAnBinhThuong = function(t) {
      if (t) {
        p.default.getInstance().playEffect("Sounds/sfx_win");
      } else {
        p.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_lose");
      }
    };
    e.prototype.checkGameIsDOneAndWaitingToStart = function() {
      return !this._dangPhatBai && !this._dangKetThuc;
    };
    o([C(cc.Button)], e.prototype, "btnDanhBai", void 0);
    o([C(cc.Node)], e.prototype, "btnDanhBaiNodeActive", void 0);
    o([C(cc.Button)], e.prototype, "btnThiepBai", void 0);
    o([C(cc.Node)], e.prototype, "btnThiepBaiNodeActive", void 0);
    o([C(cc.Button)], e.prototype, "btnTrungBai", void 0);
    o([C(cc.Node)], e.prototype, "nodeTrungBaiDisable", void 0);
    o([C(cc.Button)], e.prototype, "btnCupBai", void 0);
    o([C(cc.Label)], e.prototype, "lbVongDanh", void 0);
    o([C(cc.Node)], e.prototype, "nodeVongDanh", void 0);
    o([C([cc.Node])], e.prototype, "listPlayerCardPos", void 0);
    o([C([cc.Node])], e.prototype, "listPlayerCardPosEnd", void 0);
    o([C(cc.Node)], e.prototype, "nodeEffectVongTrungBai", void 0);
    o([C([sp.Skeleton])], e.prototype, "listEffectVongTrungBai", void 0);
    o([C([r.default])], e.prototype, "listEffectTuQuy", void 0);
    o([C([r.default])], e.prototype, "listEffectDongChat", void 0);
    o([C([r.default])], e.prototype, "listEffectBaiBeHon6", void 0);
    o([C(cc.Prefab)], e.prototype, "prefabMoneyUI", void 0);
    return e = o([b], e);
  }(u.default);
i.default = T;
void 0;
