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
var CardPopupBase = require("./CardPopupBase"),
  StringUtil = require("./StringUtil"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  GamePlayManager = require("./GamePlayManager"),
  GameConfigManager = require("./GameConfigManager"),
  GameDefine = require("./GameDefine"),
  BaseScene = require("./BaseScene"),
  KtekEventHandler = require("./KtekEventHandler"),
  MiniGameNode = require("./MiniGameNode"),
  GameUtils = require("./GameUtils"),
  FavoriteGameController = require("./FavoriteGameController"),
  MusicPlayer = require("./MusicPlayer"),
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
      if ("2k" != GameConfigManager.default.getInstance().enviromentName) {
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
        this.lbMucCuoc.string = StringUtil.default.formatMoneyNumber(i);
        var n = "";
        switch (this.gameID) {
          case MessageCardGameHandler.GAME.TIENLEN:
            n = "Ti\u1ebfn L\xean \u0110\u1ebfm L\xe1";
            break;
          case MessageCardGameHandler.GAME.TLMN:
            n = "Ti\u1ebfn L\xean MN";
            break;
          case MessageCardGameHandler.GAME.SAM:
            n = "S\xe2m L\u1ed1c";
            break;
          case MessageCardGameHandler.GAME.BACAY:
            n = "C\xe0o R\xf9a";
            break;
          case MessageCardGameHandler.GAME.BINH:
            n = "M\u1eadu Binh";
            break;
          case MessageCardGameHandler.GAME.CATTE:
            n = "Catte";
            break;
          case MessageCardGameHandler.GAME.LIENG:
            n = "Li\xeang";
            break;
          case MessageCardGameHandler.GAME.POKER:
            n = "Poker";
            break;
          case MessageCardGameHandler.GAME.XITO:
            n = "X\xec T\u1ed1";
            break;
          case MessageCardGameHandler.GAME.PHOM:
            n = "Ph\u1ecfm";
            break;
          case MessageCardGameHandler.GAME.XOCDIA:
            n = "X\xf3c \u0110\u0129a";
            break;
          case MessageCardGameHandler.GAME.BAU_CUA:
            n = "B\u1ea7u Cua";
            this.lbMucCuoc.string = StringUtil.default.formatMoneyNumber(100);
            break;
          case MessageCardGameHandler.GAME.CHAN_GTS:
            n = "Ch\u1eafn";
            break;
          case MessageCardGameHandler.GAME.XIDACH:
            n = "X\xec D\xe1ch";
            break;
          default:
            n = "Kh\xf4ng Bi\u1ebft";
        }
        this.lbNameGame.string = n;
        if (null != MiniGameNode.default.instance && null !== MiniGameNode.default.instance.taiXiuLiveController && void 0 !== MiniGameNode.default.instance
          .taiXiuLiveController) {
          MiniGameNode.default.instance.taiXiuLiveController.setSizeTVZero();
        }
        cc.systemEvent.emit(GameDefine.GameEventMessage.ShowInvitePopup);
        this.lbPage.string = this.currentIndex + 1 + "/" + this.arrRoomDict.length;
        this.setArrowStatus();
      }
    };
    e.prototype.onClickClose = function() {
      this.hide(function() {
        CommonPrefabsManager.default.getInstance().popupInveteJoinRoom = null;
        if (null != MiniGameNode.default.instance && null !== MiniGameNode.default.instance.taiXiuLiveController && void 0 !== MiniGameNode.default.instance
          .taiXiuLiveController) {
          MiniGameNode.default.instance.taiXiuLiveController.setSizeTVOriginal();
        }
      });
    };
    e.prototype.onClickBg = function() {};
    e.prototype.onClickTuCHoiHet = function() {
      GameConfigManager.default.getInstance().IsReceiveInvite = false;
      GamePlayManager.default.getInstance().updateChapNhanInvite(false);
      this.onClickClose();
    };
    e.prototype.onClickOK = function() {
      var t = this;
      GamePlayManager.default.getInstance().checkMinMoney(this.bet, this.gameID, false, function() {
        t.onClickChapNhan();
      });
    };
    e.prototype.onClickChapNhan = function() {
      if (GameConfigManager.default.getInstance().roomPassword = this.roomPassword, GamePlayManager.default.getInstance().roomID = this.roomID, CommonPrefabsManager.default.getInstance()
        .showLoading(), GamePlayManager.default.getInstance().inviteData = {
          roomID: this.roomID,
          roomPassword: this.roomPassword
        }, this.onClickClose(), GamePlayManager.default.getInstance().timeInvite = Date.now(), null !== BaseScene.default.currentScene && void 0 !== BaseScene.default
        .currentScene && null !== BaseScene.default.currentScene.node && void 0 !== BaseScene.default.currentScene.node) {
        var t = GameUtils.convertToStringGameID(this.gameID);
        switch (FavoriteGameController.default.gI() && FavoriteGameController.default.gI().DoSendTrackingGame(t), this.gameID) {
          case MessageCardGameHandler.GAME.LIENG:
            BaseScene.default.currentScene.openSceneGame(GameDefine.GameConfigs.SceneName.Lieng);
            break;
          case MessageCardGameHandler.GAME.PHOM:
            BaseScene.default.currentScene.openSceneGame(GameDefine.GameConfigs.SceneName.Phom);
            break;
          case MessageCardGameHandler.GAME.TIENLEN:
            BaseScene.default.currentScene.openSceneGame(GameDefine.GameConfigs.SceneName.TLDL);
            break;
          case MessageCardGameHandler.GAME.BINH:
            BaseScene.default.currentScene.openSceneGame(GameDefine.GameConfigs.SceneName.MauBinh);
            break;
          case MessageCardGameHandler.GAME.POKER:
            BaseScene.default.currentScene.openSceneGame(GameDefine.GameConfigs.SceneName.Poker);
            break;
          case MessageCardGameHandler.GAME.XITO:
            BaseScene.default.currentScene.openSceneGame(GameDefine.GameConfigs.SceneName.XiTo);
            break;
          case MessageCardGameHandler.GAME.SAM:
            BaseScene.default.currentScene.openSceneGame(GameDefine.GameConfigs.SceneName.SamLoc);
            break;
          case MessageCardGameHandler.GAME.TLMN:
            BaseScene.default.currentScene.openSceneGame(GameDefine.GameConfigs.SceneName.TLMN);
            break;
          case MessageCardGameHandler.GAME.XOCDIA:
            BaseScene.default.currentScene.openSceneGame(GameDefine.GameConfigs.SceneName.XocDia);
            break;
          case MessageCardGameHandler.GAME.BAU_CUA:
            BaseScene.default.currentScene.openSceneGame(GameDefine.GameConfigs.SceneName.BauCua);
            break;
          case MessageCardGameHandler.GAME.BACAY:
            BaseScene.default.currentScene.openSceneGame(GameDefine.GameConfigs.SceneName.BaCay);
            break;
          case MessageCardGameHandler.GAME.CATTE:
            BaseScene.default.currentScene.openSceneGame(GameDefine.GameConfigs.SceneName.Catte);
            break;
          case MessageCardGameHandler.GAME.XIDACH:
            GamePlayManager.default.getInstance().inviteData = null;
            KtekEventHandler.default.instance.setJoinRoomData(this.roomID, this.gameID, this.bet);
            BaseScene.default.currentScene.openSceneGame(GameDefine.GameConfigs.SceneName.XiDealerL);
        }
      }
    };
    e.prototype.onDestroy = function() {
      CommonPrefabsManager.default.getInstance().popupInveteJoinRoom = null;
    };
    e.prototype.onNextClick = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      if (!(this.currentIndex >= this.arrRoomDict.length - 1)) {
        this.currentIndex += 1;
        this.displayUI(this.currentIndex);
      }
    };
    e.prototype.onPreClick = function() {
      MusicPlayer.default.getInstance().playbtnClick();
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
  }(CardPopupBase.default);
i.default = b;
void 0;
