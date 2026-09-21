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
  y = cc._decorator,
  S = y.ccclass,
  _ = y.property,
  v = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.roomController = null;
      e.prefabRoomScene = null;
      e.mainUiNode = null;
      e.mainGameController = null;
      e.timeTurnRemain = 0;
      e.isMyTurn = false;
      e.isPlaying = false;
      return e;
    }
    n(e, t);
    e.prototype.playBackgroundMusic = function() {
      MusicPlayer.default.getInstance().playRandomLobbyMusic();
    };
    e.prototype.onLoad = function() {
      if (t.prototype.onLoad.call(this), this.node.width = cc.winSize.width, this.node.height = cc.winSize.height, null !== this
        .prefabRoomScene && void 0 !== this.prefabRoomScene) {
        var e = cc.instantiate(this.prefabRoomScene);
        if (e.parent = this.mainUiNode, this.roomController = e.getComponent(RoomController.default), e.active = false, this.roomController.walkUp(
            this), this.roomController.isFade = true, cc.sys.platform === cc.sys.MOBILE_BROWSER) {
          var i = e.getComponent(cc.Widget);
          if (null !== i && void 0 !== i) {
            i.target = this.node;
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
    e.prototype.getlistRoomData = function() {
      CardGameCommonRequest.default.getInstance().GetListRoom();
    };
    e.prototype.onFocus = function(e) {
      this.timeLostFocus = e;
      if (null != this.mainGameController && null != this.mainGameController._thisPlayerView && e >= 5) {
        t.prototype.onFocus.call(this, e);
      }
      if (null !== this.mainGameController && void 0 !== this.mainGameController) {
        this.mainGameController.onFocus(e);
      }
    };
    e.prototype.onLostFocus = function() {
      if (t.prototype.onLostFocus.call(this), null !== this.mainGameController && void 0 !== this.mainGameController && this
        .mainGameController.onLostFocus(), this.isMyTurn = false, this.isPlaying = false, null != this.mainGameController) {
        var e = this.mainGameController._thisPlayerView;
        if (void 0 != e && null != e && e.isPlaying) {
          this.isPlaying = true;
          if (e.countDownProgressTo.isRuning) {
            this.isMyTurn = true;
            this.timeTurnRemain = e.countDownProgressTo.actionTIme - e.countDownProgressTo.countTime;
          }
        }
      }
    };
    e.prototype.onTokenExpired = function() {
      t.prototype.onTokenExpired.call(this);
    };
    e.prototype.onReceiveMessage = function(e, i, n, o) {
      if (void 0 === o) {
        o = true;
      }
      t.prototype.onReceiveMessage.call(this, e, i, n, o);
      if (null != this.mainGameController && this.mainGameController.node.active) {
        this.mainGameController.onReceiveMessage(e, i, n, o);
      }
    };
    e.prototype.showListRoomScene = function() {
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
    e.prototype.checkAndShowListRoom = function(t) {
      if (!(void 0 !== t.lr && null !== t.lr)) {
        this.showListRoomScene();
      }
    };
    e.prototype.onUserInfoRespone = function(e, i) {
      if (void 0 === i) {
        i = true;
      }
      t.prototype.onUserInfoRespone.call(this, e, i);
      this.resetTimeLostFocus();
      this.checkAndShowListRoom(e);
    };
    e.prototype.onWSCardLeaveRoom = function(t) {
      if (null !== t && void 0 !== t && t[1] && null !== this.mainGameController && void 0 !== this.mainGameController && this
        .mainGameController.node.active) {
        var e = t[4];
        this.mainGameController.LeaveRoomMessage = t;
        if (3 === e) {
          this.mainGameController._forcedToLeaveRoom = true;
        } else {
          this.mainGameController.handleLeaveRoomResponse();
        }
      }
    };
    e.prototype.onGetListTableSuccess = function(t, e) {
      var i = this;
      if (null !== e.rs || void 0 !== e.rs || 0 === e.rs.length !== null || !this.isPlaying || null !== e.rs && void 0 !== e.rs && 0 !== e
        .rs.length && !this.isPlaying) {
        for (var n = 0; n < e.rs.length; ++n) {
          for (var o = n + 1; o < e.rs.length; ++o) {
            var a = e.rs[n],
              s = e.rs[o];
            if (a.b > s.b) {
              var r = a;
              e.rs[n] = s;
              e.rs[o] = r;
            }
          }
        }
        if (null !== e.pR && void 0 !== e.pR) {
          for (n = 0; n < e.pR.length; ++n) {
            for (o = n + 1; o < e.pR.length; ++o) {
              a = e.pR[n];
              s = e.pR[o];
              if (a.b > s.b) {
                r = a;
                e.pR[n] = s;
                e.pR[o] = r;
              }
            }
          }
        }
        if (null !== e.srs && void 0 !== e.srs) {
          for (n = 0; n < e.srs.length; ++n) {
            for (o = n + 1; o < e.srs.length; ++o) {
              a = e.srs[n];
              s = e.srs[o];
              if (a.b > s.b) {
                r = a;
                e.srs[n] = s;
                e.srs[o] = r;
              }
            }
          }
        }
        var c = 0;
        if (this.roomController.isFade) {
          c = .3;
        }
        this.node.runAction(cc.sequence(cc.delayTime(c), cc.callFunc(function() {
          if (i.roomController.isFade) {
            CommonPrefabsManager.default.getInstance().hideLoading();
          }
          i.roomController.updateRoom(e);
        })));
      }
    };
    e.prototype.onErrorMessage = function(t, e) {
      if (null !== e && void 0 !== e) {
        var i = "";
        if (null !== e.mgs && void 0 !== e.mgs) {
          i = e.mgs;
        }
        if (0 != i.length) {
          CommonPrefabsManager.default.getInstance().showPopupMessageUtil(i);
          CommonPrefabsManager.default.getInstance().hideLoading();
          GameConfigManager.default.getInstance().isShowPopupDone = false;
        }
      }
    };
    e.prototype.showGameList = function(t) {
      AnalyticService.default.instance.trackCustomQ(AnalyticDefine.AnaltyciEventType.CLICK, "leave_cg_" + GamePlayManager.default.getInstance().gameID);
      var e = "";
      if (2 === t[2]) {
        e = t[5];
      }
      this.mainGameController.node.stopAllActions();
      this.mainGameController.hide();
      this.roomController.node.active = true;
      this.playBackgroundMusic();
      if (e.length > 0) {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil(e);
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
    e.prototype.onWSCardJoinRoom = function(t) {
      var e = t[1];
      CommonPrefabsManager.default.getInstance().showLoading(true);
      GameConfigManager.default.getInstance().isShowPopupDone = false;
      if (e) {
        cc.systemEvent.emit(GameDefine.GameEventMessage.JoinRoom);
        GamePlayManager.default.getInstance().roomID = t[3];
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
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil(t[4]);
      }
    };
    e.prototype.checkAndShowtestData = function(t) {};
    o([_(cc.Prefab)], e.prototype, "prefabRoomScene", void 0);
    o([_(cc.Node)], e.prototype, "mainUiNode", void 0);
    return e = o([S], e);
  }(BaseScene.default);
i.default = v;
void 0;
