var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
var __extends = this && this.__extends || function() {
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
  __decorate = this && this.__decorate || function(t, e, i, n) {
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
Object.defineProperty(moduleExports, "__esModule", {
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
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  PopupInveteJoinRoom = function(_super) {
    function PopupInveteJoinRoom() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.lbNameGame = null;
      _this.lbMucCuoc = null;
      _this.btnNext = null;
      _this.btnPre = null;
      _this.lbPage = null;
      _this.roomPassword = "";
      _this.roomID = 0;
      _this.serverID = 0;
      _this.gameID = 0;
      _this.bet = 0;
      _this.arrRoomDict = [];
      _this.currentIndex = 0;
      return _this;
    }
    __extends(PopupInveteJoinRoom, _super);
    PopupInveteJoinRoom.prototype.showInvite = function(fromUser, roomInfo) {
      this.arrRoomDict.push(roomInfo);
      if (1 == this.arrRoomDict.length) {
        this.currentIndex = 0;
        this.show();
      }
      this.displayUI(this.currentIndex);
    };
    PopupInveteJoinRoom.prototype.displayUI = function(index) {
      if ("2k" != GameConfigManager.default.getInstance().enviromentName) {
        var roomInfo = this.arrRoomDict[index];
        this.gameID = parseInt(roomInfo.gid);
        this.roomID = roomInfo.rid;
        this.bet = roomInfo.b;
        this.serverID = roomInfo.sid;
        var bet = roomInfo.b;
        if (null !== roomInfo.MMBI && void 0 !== roomInfo.MMBI) {
          roomInfo.MMBI;
        }
        this.roomPassword = "";
        if (null !== roomInfo.pwd && void 0 !== roomInfo.pwd) {
          this.roomPassword = roomInfo.pwd;
        }
        this.lbMucCuoc.string = StringUtil.default.formatMoneyNumber(bet);
        var gameName = "";
        switch (this.gameID) {
          case MessageCardGameHandler.GAME.TIENLEN:
            gameName = "Ti\u1ebfn L\xean \u0110\u1ebfm L\xe1";
            break;
          case MessageCardGameHandler.GAME.TLMN:
            gameName = "Ti\u1ebfn L\xean MN";
            break;
          case MessageCardGameHandler.GAME.SAM:
            gameName = "S\xe2m L\u1ed1c";
            break;
          case MessageCardGameHandler.GAME.BACAY:
            gameName = "C\xe0o R\xf9a";
            break;
          case MessageCardGameHandler.GAME.BINH:
            gameName = "M\u1eadu Binh";
            break;
          case MessageCardGameHandler.GAME.CATTE:
            gameName = "Catte";
            break;
          case MessageCardGameHandler.GAME.LIENG:
            gameName = "Li\xeang";
            break;
          case MessageCardGameHandler.GAME.POKER:
            gameName = "Poker";
            break;
          case MessageCardGameHandler.GAME.XITO:
            gameName = "X\xec T\u1ed1";
            break;
          case MessageCardGameHandler.GAME.PHOM:
            gameName = "Ph\u1ecfm";
            break;
          case MessageCardGameHandler.GAME.XOCDIA:
            gameName = "X\xf3c \u0110\u0129a";
            break;
          case MessageCardGameHandler.GAME.BAU_CUA:
            gameName = "B\u1ea7u Cua";
            this.lbMucCuoc.string = StringUtil.default.formatMoneyNumber(100);
            break;
          case MessageCardGameHandler.GAME.CHAN_GTS:
            gameName = "Ch\u1eafn";
            break;
          case MessageCardGameHandler.GAME.XIDACH:
            gameName = "X\xec D\xe1ch";
            break;
          default:
            gameName = "Kh\xf4ng Bi\u1ebft";
        }
        this.lbNameGame.string = gameName;
        if (null != MiniGameNode.default.instance && null !== MiniGameNode.default.instance.taiXiuLiveController && void 0 !== MiniGameNode.default.instance
          .taiXiuLiveController) {
          MiniGameNode.default.instance.taiXiuLiveController.setSizeTVZero();
        }
        cc.systemEvent.emit(GameDefine.GameEventMessage.ShowInvitePopup);
        this.lbPage.string = this.currentIndex + 1 + "/" + this.arrRoomDict.length;
        this.setArrowStatus();
      }
    };
    PopupInveteJoinRoom.prototype.onClickClose = function() {
      this.hide(function() {
        CommonPrefabsManager.default.getInstance().popupInveteJoinRoom = null;
        if (null != MiniGameNode.default.instance && null !== MiniGameNode.default.instance.taiXiuLiveController && void 0 !== MiniGameNode.default.instance
          .taiXiuLiveController) {
          MiniGameNode.default.instance.taiXiuLiveController.setSizeTVOriginal();
        }
      });
    };
    PopupInveteJoinRoom.prototype.onClickBg = function() {};
    PopupInveteJoinRoom.prototype.onClickTuCHoiHet = function() {
      GameConfigManager.default.getInstance().IsReceiveInvite = false;
      GamePlayManager.default.getInstance().updateChapNhanInvite(false);
      this.onClickClose();
    };
    PopupInveteJoinRoom.prototype.onClickOK = function() {
      var _this = this;
      GamePlayManager.default.getInstance().checkMinMoney(this.bet, this.gameID, false, function() {
        _this.onClickChapNhan();
      });
    };
    PopupInveteJoinRoom.prototype.onClickChapNhan = function() {
      if (GameConfigManager.default.getInstance().roomPassword = this.roomPassword, GamePlayManager.default.getInstance().roomID = this.roomID, CommonPrefabsManager.default.getInstance()
        .showLoading(), GamePlayManager.default.getInstance().inviteData = {
          roomID: this.roomID,
          roomPassword: this.roomPassword
        }, this.onClickClose(), GamePlayManager.default.getInstance().timeInvite = Date.now(), null !== BaseScene.default.currentScene && void 0 !== BaseScene.default
        .currentScene && null !== BaseScene.default.currentScene.node && void 0 !== BaseScene.default.currentScene.node) {
        var gameIDString = GameUtils.convertToStringGameID(this.gameID);
        switch (FavoriteGameController.default.gI() && FavoriteGameController.default.gI().DoSendTrackingGame(gameIDString), this.gameID) {
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
    PopupInveteJoinRoom.prototype.onDestroy = function() {
      CommonPrefabsManager.default.getInstance().popupInveteJoinRoom = null;
    };
    PopupInveteJoinRoom.prototype.onNextClick = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      if (!(this.currentIndex >= this.arrRoomDict.length - 1)) {
        this.currentIndex += 1;
        this.displayUI(this.currentIndex);
      }
    };
    PopupInveteJoinRoom.prototype.onPreClick = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      if (!(this.currentIndex <= 0)) {
        this.currentIndex -= 1;
        this.displayUI(this.currentIndex);
      }
    };
    PopupInveteJoinRoom.prototype.setArrowStatus = function() {
      this.btnNext.active = this.currentIndex < this.arrRoomDict.length - 1;
      this.btnPre.active = this.currentIndex > 0;
    };
    __decorate([property(cc.Label)], PopupInveteJoinRoom.prototype, "lbNameGame", void 0);
    __decorate([property(cc.Label)], PopupInveteJoinRoom.prototype, "lbMucCuoc", void 0);
    __decorate([property(cc.Node)], PopupInveteJoinRoom.prototype, "btnNext", void 0);
    __decorate([property(cc.Node)], PopupInveteJoinRoom.prototype, "btnPre", void 0);
    __decorate([property(cc.Label)], PopupInveteJoinRoom.prototype, "lbPage", void 0);
    return PopupInveteJoinRoom = __decorate([ccclass], PopupInveteJoinRoom);
  }(CardPopupBase.default);
moduleExports.default = PopupInveteJoinRoom;
void 0;
