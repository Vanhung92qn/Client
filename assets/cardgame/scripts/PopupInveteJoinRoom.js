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
// ── BẢNG TRA BÍ DANH (máy sinh — ghi-bang-tra-bi-danh.js) ──────
// Mã dịch ngược đặt bí danh một chữ cho mỗi module. Bảng này để khỏi phải cuộn ngược.
// KHÔNG đổi tên chúng bằng tìm-kiếm-thay-thế: đoạn mở đầu __decorate khai lại đúng
// những chữ này làm biến cục bộ, đổi là hỏng im lặng.
//   a = CardPopupBase   s = StringUtil   r = MessageCardGameHandler
//   c = CommonPrefabsManager   l = GamePlayManager   h = GameConfigManager
//   u = GameDefine   d = BaseScene   p = KtekEventHandler
//   f = MiniGameNode   g = GameUtils   m = FavoriteGameController
//   y = MusicPlayer
// ────────────────────────────────────────────────────────────────
var a = require("./CardPopupBase"),
  s = require("./StringUtil"),
  r = require("./MessageCardGameHandler"),
  c = require("./CommonPrefabsManager"),
  l = require("./GamePlayManager"),
  h = require("./GameConfigManager"),
  u = require("./GameDefine"),
  d = require("./BaseScene"),
  p = require("./KtekEventHandler"),
  f = require("./MiniGameNode"),
  g = require("./GameUtils"),
  m = require("./FavoriteGameController"),
  y = require("./MusicPlayer"),
  S = cc._decorator,
  _ = S.ccclass,
  v = S.property,
  b = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.lbNameGame = null;
      e.lbMucCuoc = null;
      e.btnNext = null;
      e.btnPre = null;
      e.lbPage = null;
      e.roomPassword = "";
      e.roomID = 0;
      e.serverID = 0;
      e.gameID = 0;
      e.bet = 0;
      e.arrRoomDict = [];
      e.currentIndex = 0;
      return e;
    }
    n(e, t);
    e.prototype.showInvite = function(t, e) {
      this.arrRoomDict.push(e);
      if (1 == this.arrRoomDict.length) {
        this.currentIndex = 0;
        this.show();
      }
      this.displayUI(this.currentIndex);
    };
    e.prototype.displayUI = function(t) {
      if ("2k" != h.default.getInstance().enviromentName) {
        var e = this.arrRoomDict[t];
        this.gameID = parseInt(e.gid);
        this.roomID = e.rid;
        this.bet = e.b;
        this.serverID = e.sid;
        var i = e.b;
        if (null !== e.MMBI && void 0 !== e.MMBI) {
          e.MMBI;
        }
        this.roomPassword = "";
        if (null !== e.pwd && void 0 !== e.pwd) {
          this.roomPassword = e.pwd;
        }
        this.lbMucCuoc.string = s.default.formatMoneyNumber(i);
        var n = "";
        switch (this.gameID) {
          case r.GAME.TIENLEN:
            n = "Ti\u1ebfn L\xean \u0110\u1ebfm L\xe1";
            break;
          case r.GAME.TLMN:
            n = "Ti\u1ebfn L\xean MN";
            break;
          case r.GAME.SAM:
            n = "S\xe2m L\u1ed1c";
            break;
          case r.GAME.BACAY:
            n = "C\xe0o R\xf9a";
            break;
          case r.GAME.BINH:
            n = "M\u1eadu Binh";
            break;
          case r.GAME.CATTE:
            n = "Catte";
            break;
          case r.GAME.LIENG:
            n = "Li\xeang";
            break;
          case r.GAME.POKER:
            n = "Poker";
            break;
          case r.GAME.XITO:
            n = "X\xec T\u1ed1";
            break;
          case r.GAME.PHOM:
            n = "Ph\u1ecfm";
            break;
          case r.GAME.XOCDIA:
            n = "X\xf3c \u0110\u0129a";
            break;
          case r.GAME.BAU_CUA:
            n = "B\u1ea7u Cua";
            this.lbMucCuoc.string = s.default.formatMoneyNumber(100);
            break;
          case r.GAME.CHAN_GTS:
            n = "Ch\u1eafn";
            break;
          case r.GAME.XIDACH:
            n = "X\xec D\xe1ch";
            break;
          default:
            n = "Kh\xf4ng Bi\u1ebft";
        }
        this.lbNameGame.string = n;
        if (null != f.default.instance && null !== f.default.instance.taiXiuLiveController && void 0 !== f.default.instance
          .taiXiuLiveController) {
          f.default.instance.taiXiuLiveController.setSizeTVZero();
        }
        cc.systemEvent.emit(u.GameEventMessage.ShowInvitePopup);
        this.lbPage.string = this.currentIndex + 1 + "/" + this.arrRoomDict.length;
        this.setArrowStatus();
      }
    };
    e.prototype.onClickClose = function() {
      this.hide(function() {
        c.default.getInstance().popupInveteJoinRoom = null;
        if (null != f.default.instance && null !== f.default.instance.taiXiuLiveController && void 0 !== f.default.instance
          .taiXiuLiveController) {
          f.default.instance.taiXiuLiveController.setSizeTVOriginal();
        }
      });
    };
    e.prototype.onClickBg = function() {};
    e.prototype.onClickTuCHoiHet = function() {
      h.default.getInstance().IsReceiveInvite = false;
      l.default.getInstance().updateChapNhanInvite(false);
      this.onClickClose();
    };
    e.prototype.onClickOK = function() {
      var t = this;
      l.default.getInstance().checkMinMoney(this.bet, this.gameID, false, function() {
        t.onClickChapNhan();
      });
    };
    e.prototype.onClickChapNhan = function() {
      if (h.default.getInstance().roomPassword = this.roomPassword, l.default.getInstance().roomID = this.roomID, c.default.getInstance()
        .showLoading(), l.default.getInstance().inviteData = {
          roomID: this.roomID,
          roomPassword: this.roomPassword
        }, this.onClickClose(), l.default.getInstance().timeInvite = Date.now(), null !== d.default.currentScene && void 0 !== d.default
        .currentScene && null !== d.default.currentScene.node && void 0 !== d.default.currentScene.node) {
        var t = g.convertToStringGameID(this.gameID);
        switch (m.default.gI() && m.default.gI().DoSendTrackingGame(t), this.gameID) {
          case r.GAME.LIENG:
            d.default.currentScene.openSceneGame(u.GameConfigs.SceneName.Lieng);
            break;
          case r.GAME.PHOM:
            d.default.currentScene.openSceneGame(u.GameConfigs.SceneName.Phom);
            break;
          case r.GAME.TIENLEN:
            d.default.currentScene.openSceneGame(u.GameConfigs.SceneName.TLDL);
            break;
          case r.GAME.BINH:
            d.default.currentScene.openSceneGame(u.GameConfigs.SceneName.MauBinh);
            break;
          case r.GAME.POKER:
            d.default.currentScene.openSceneGame(u.GameConfigs.SceneName.Poker);
            break;
          case r.GAME.XITO:
            d.default.currentScene.openSceneGame(u.GameConfigs.SceneName.XiTo);
            break;
          case r.GAME.SAM:
            d.default.currentScene.openSceneGame(u.GameConfigs.SceneName.SamLoc);
            break;
          case r.GAME.TLMN:
            d.default.currentScene.openSceneGame(u.GameConfigs.SceneName.TLMN);
            break;
          case r.GAME.XOCDIA:
            d.default.currentScene.openSceneGame(u.GameConfigs.SceneName.XocDia);
            break;
          case r.GAME.BAU_CUA:
            d.default.currentScene.openSceneGame(u.GameConfigs.SceneName.BauCua);
            break;
          case r.GAME.BACAY:
            d.default.currentScene.openSceneGame(u.GameConfigs.SceneName.BaCay);
            break;
          case r.GAME.CATTE:
            d.default.currentScene.openSceneGame(u.GameConfigs.SceneName.Catte);
            break;
          case r.GAME.XIDACH:
            l.default.getInstance().inviteData = null;
            p.default.instance.setJoinRoomData(this.roomID, this.gameID, this.bet);
            d.default.currentScene.openSceneGame(u.GameConfigs.SceneName.XiDealerL);
        }
      }
    };
    e.prototype.onDestroy = function() {
      c.default.getInstance().popupInveteJoinRoom = null;
    };
    e.prototype.onNextClick = function() {
      y.default.getInstance().playbtnClick();
      if (!(this.currentIndex >= this.arrRoomDict.length - 1)) {
        this.currentIndex += 1;
        this.displayUI(this.currentIndex);
      }
    };
    e.prototype.onPreClick = function() {
      y.default.getInstance().playbtnClick();
      if (!(this.currentIndex <= 0)) {
        this.currentIndex -= 1;
        this.displayUI(this.currentIndex);
      }
    };
    e.prototype.setArrowStatus = function() {
      this.btnNext.active = this.currentIndex < this.arrRoomDict.length - 1;
      this.btnPre.active = this.currentIndex > 0;
    };
    o([v(cc.Label)], e.prototype, "lbNameGame", void 0);
    o([v(cc.Label)], e.prototype, "lbMucCuoc", void 0);
    o([v(cc.Node)], e.prototype, "btnNext", void 0);
    o([v(cc.Node)], e.prototype, "btnPre", void 0);
    o([v(cc.Label)], e.prototype, "lbPage", void 0);
    return e = o([_], e);
  }(a.default);
i.default = b;
void 0;
