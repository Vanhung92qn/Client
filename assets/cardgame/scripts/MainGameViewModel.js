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
var RoomController = require("./RoomController"),
  MusicPlayer = require("./MusicPlayer"),
  CardGameCommonRequest = require("./CardGameCommonRequest"),
  BaseScene = require("./BaseScene"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  GamePlayManager = require("./GamePlayManager"),
  GameConfigManager = require("./GameConfigManager"),
  MiniGameNode = require("./MiniGameNode"),
  GameDefine = require("./GameDefine"),
  AnalyticService = require("./AnalyticService"),
  AnalyticDefine = require("./AnalyticDefine"),
  VersionController = require("./VersionController"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  MainGameViewModel = function(_super) {
    function MainGameViewModel() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.roomController = null;
      _this.prefabRoomScene = null;
      _this.mainUiNode = null;
      _this.mainGameController = null;
      _this.timeTurnRemain = 0;
      _this.isMyTurn = false;
      _this.isPlaying = false;
      return _this;
    }
    __extends(MainGameViewModel, _super);
    MainGameViewModel.prototype.playBackgroundMusic = function() {
      MusicPlayer.default.getInstance().playRandomLobbyMusic();
    };
    MainGameViewModel.prototype.onLoad = function() {
      if (_super.prototype.onLoad.call(this), this.node.width = cc.winSize.width, this.node.height = cc.winSize.height, null !== this
        .prefabRoomScene && void 0 !== this.prefabRoomScene) {
        var roomSceneNode = cc.instantiate(this.prefabRoomScene);
        if (roomSceneNode.parent = this.mainUiNode, this.roomController = roomSceneNode.getComponent(RoomController.default), roomSceneNode.active = false, this.roomController.walkUp(
            this), this.roomController.isFade = true, cc.sys.platform === cc.sys.MOBILE_BROWSER) {
          var widget = roomSceneNode.getComponent(cc.Widget);
          if (null !== widget && void 0 !== widget) {
            widget.target = this.node;
          }
        }
        GamePlayManager.default.getInstance().isListRoomScene = true;
        GamePlayManager.default.getInstance().isInCardGame = false;
        if (null != MiniGameNode.default.instance) {
          MiniGameNode.default.instance.updatePositionByState();
        }
      }
      this.getlistRoomData();
      CommonPrefabsManager.default.getInstance().showLoading(true);
    };
    MainGameViewModel.prototype.getlistRoomData = function() {
      CardGameCommonRequest.default.getInstance().GetListRoom();
    };
    MainGameViewModel.prototype.onFocus = function(secondsAway) {
      this.timeLostFocus = secondsAway;
      if (null != this.mainGameController && null != this.mainGameController._thisPlayerView && secondsAway >= 5) {
        _super.prototype.onFocus.call(this, secondsAway);
      }
      if (null !== this.mainGameController && void 0 !== this.mainGameController) {
        this.mainGameController.onFocus(secondsAway);
      }
    };
    MainGameViewModel.prototype.onLostFocus = function() {
      if (_super.prototype.onLostFocus.call(this), null !== this.mainGameController && void 0 !== this.mainGameController && this
        .mainGameController.onLostFocus(), this.isMyTurn = false, this.isPlaying = false, null != this.mainGameController) {
        var thisPlayerView = this.mainGameController._thisPlayerView;
        if (void 0 != thisPlayerView && null != thisPlayerView && thisPlayerView.isPlaying) {
          this.isPlaying = true;
          if (thisPlayerView.countDownProgressTo.isRuning) {
            this.isMyTurn = true;
            this.timeTurnRemain = thisPlayerView.countDownProgressTo.actionTIme - thisPlayerView.countDownProgressTo.countTime;
          }
        }
      }
    };
    MainGameViewModel.prototype.onTokenExpired = function() {
      _super.prototype.onTokenExpired.call(this);
    };
    MainGameViewModel.prototype.onReceiveMessage = function(cmd, raw, data, applyGameConfig) {
      if (void 0 === applyGameConfig) {
        applyGameConfig = true;
      }
      _super.prototype.onReceiveMessage.call(this, cmd, raw, data, applyGameConfig);
      if (null != this.mainGameController && this.mainGameController.node.active) {
        this.mainGameController.onReceiveMessage(cmd, raw, data, applyGameConfig);
      }
    };
    MainGameViewModel.prototype.showListRoomScene = function() {
      if (this.mainGameController.node.active) {
        this.mainGameController.node.stopAllActions();
        this.mainGameController.hide();
        this.roomController.node.active = true;
        this.playBackgroundMusic();
      }
      this.roomController.isFade = false;
      CardGameCommonRequest.default.getInstance().GetListRoom();
      VersionController.default.getInstance().CheckForceUpdateByCurrentScene();
    };
    MainGameViewModel.prototype.checkAndShowListRoom = function(userInfo) {
      if (!(void 0 !== userInfo.lr && null !== userInfo.lr)) {
        this.showListRoomScene();
      }
    };
    MainGameViewModel.prototype.onUserInfoRespone = function(data, applyGameConfig) {
      if (void 0 === applyGameConfig) {
        applyGameConfig = true;
      }
      _super.prototype.onUserInfoRespone.call(this, data, applyGameConfig);
      this.resetTimeLostFocus();
      this.checkAndShowListRoom(data);
    };
    MainGameViewModel.prototype.onWSCardLeaveRoom = function(message) {
      if (null !== message && void 0 !== message && message[1] && null !== this.mainGameController && void 0 !== this.mainGameController && this
        .mainGameController.node.active) {
        var leaveReason = message[4];
        this.mainGameController.LeaveRoomMessage = message;
        if (3 === leaveReason) {
          this.mainGameController._forcedToLeaveRoom = true;
        } else {
          this.mainGameController.handleLeaveRoomResponse();
        }
      }
    };
    MainGameViewModel.prototype.onGetListTableSuccess = function(raw, data) {
      var _this = this;
      if (null !== data.rs || void 0 !== data.rs || 0 === data.rs.length !== null || !this.isPlaying || null !== data.rs && void 0 !== data.rs && 0 !== data
        .rs.length && !this.isPlaying) {
        for (var roomIndex = 0; roomIndex < data.rs.length; ++roomIndex) {
          for (var compareIndex = roomIndex + 1; compareIndex < data.rs.length; ++compareIndex) {
            var roomA = data.rs[roomIndex],
              roomB = data.rs[compareIndex];
            if (roomA.b > roomB.b) {
              var swapTemp = roomA;
              data.rs[roomIndex] = roomB;
              data.rs[compareIndex] = swapTemp;
            }
          }
        }
        if (null !== data.pR && void 0 !== data.pR) {
          for (roomIndex = 0; roomIndex < data.pR.length; ++roomIndex) {
            for (compareIndex = roomIndex + 1; compareIndex < data.pR.length; ++compareIndex) {
              roomA = data.pR[roomIndex];
              roomB = data.pR[compareIndex];
              if (roomA.b > roomB.b) {
                swapTemp = roomA;
                data.pR[roomIndex] = roomB;
                data.pR[compareIndex] = swapTemp;
              }
            }
          }
        }
        if (null !== data.srs && void 0 !== data.srs) {
          for (roomIndex = 0; roomIndex < data.srs.length; ++roomIndex) {
            for (compareIndex = roomIndex + 1; compareIndex < data.srs.length; ++compareIndex) {
              roomA = data.srs[roomIndex];
              roomB = data.srs[compareIndex];
              if (roomA.b > roomB.b) {
                swapTemp = roomA;
                data.srs[roomIndex] = roomB;
                data.srs[compareIndex] = swapTemp;
              }
            }
          }
        }
        var delaySeconds = 0;
        if (this.roomController.isFade) {
          delaySeconds = .3;
        }
        this.node.runAction(cc.sequence(cc.delayTime(delaySeconds), cc.callFunc(function() {
          if (_this.roomController.isFade) {
            CommonPrefabsManager.default.getInstance().hideLoading();
          }
          _this.roomController.updateRoom(data);
        })));
      }
    };
    MainGameViewModel.prototype.onErrorMessage = function(raw, data) {
      if (null !== data && void 0 !== data) {
        var errorMessage = "";
        if (null !== data.mgs && void 0 !== data.mgs) {
          errorMessage = data.mgs;
        }
        if (0 != errorMessage.length) {
          CommonPrefabsManager.default.getInstance().showPopupMessageUtil(errorMessage);
          CommonPrefabsManager.default.getInstance().hideLoading();
          GameConfigManager.default.getInstance().isShowPopupDone = false;
        }
      }
    };
    MainGameViewModel.prototype.showGameList = function(message) {
      AnalyticService.default.instance.trackCustomQ(AnalyticDefine.AnaltyciEventType.CLICK, "leave_cg_" + GamePlayManager.default.getInstance().gameID);
      var messageText = "";
      if (2 === message[2]) {
        messageText = message[5];
      }
      this.mainGameController.node.stopAllActions();
      this.mainGameController.hide();
      this.roomController.node.active = true;
      this.playBackgroundMusic();
      if (messageText.length > 0) {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil(messageText);
      }
      this.roomController.isFade = false;
      CardGameCommonRequest.default.getInstance().GetListRoom();
      GamePlayManager.default.getInstance().isListRoomScene = true;
      GamePlayManager.default.getInstance().isInCardGame = false;
      if (null != MiniGameNode.default.instance) {
        MiniGameNode.default.instance.updatePositionByState();
      }
      GamePlayManager.default.getInstance().spinAutoXocDia = false;
      VersionController.default.getInstance().CheckForceUpdateByCurrentScene();
    };
    MainGameViewModel.prototype.onWSCardJoinRoom = function(message) {
      var isSuccess = message[1];
      CommonPrefabsManager.default.getInstance().showLoading(true);
      GameConfigManager.default.getInstance().isShowPopupDone = false;
      if (isSuccess) {
        cc.systemEvent.emit(GameDefine.GameEventMessage.JoinRoom);
        GamePlayManager.default.getInstance().roomID = message[3];
        this.mainGameController.walkUpBase(this);
        MusicPlayer.default.getInstance().playRandomIngameBgMusic();
        GameConfigManager.default.getInstance().isLobbyMusicBg = false;
        GamePlayManager.default.getInstance().isListRoomScene = false;
        GamePlayManager.default.getInstance().isInCardGame = true;
        if (null != MiniGameNode.default.instance) {
          MiniGameNode.default.instance.updatePositionByState();
        }
      } else {
        CommonPrefabsManager.default.getInstance().hideLoading();
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil(message[4]);
      }
    };
    MainGameViewModel.prototype.checkAndShowtestData = function(t) {};
    __decorate([property(cc.Prefab)], MainGameViewModel.prototype, "prefabRoomScene", void 0);
    __decorate([property(cc.Node)], MainGameViewModel.prototype, "mainUiNode", void 0);
    return MainGameViewModel = __decorate([ccclass], MainGameViewModel);
  }(BaseScene.default);
moduleExports.default = MainGameViewModel;
void 0;
