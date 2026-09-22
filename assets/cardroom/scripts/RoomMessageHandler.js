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
var MessageCardGameHandler = require("MessageCardGameHandler"),
  NetworkConfig = require("NetworkConfig"),
  GamePlayManager = require("GamePlayManager"),
  MessageHandlerBase = require("MessageHandlerBase"),
  GameConfigManager = require("GameConfigManager"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  RoomMessageHandler = (ccDecorator.property, function(_super) {
    function RoomMessageHandler() {
      var _this = _super.call(this) || this;
      _this.onReceiveBuyIn = function(data) {};
      _this.onReceiveJoinRoom = function(t) {};
      _this.onReceiveBookRoom = function(raw) {};
      _this.onReceiveTableInfos = function(raw) {};
      _this.onReceiveUpdateUser = function(raw) {};
      _this.onReceiveListRoom = function(raw, data) {};
      _this.onReceiveCreateRoomRespone = function(raw) {};
      _this.onReceiveQuickPlay = function(raw) {};
      return _this;
    }
    var RoomMessageHandler_1;
    __extends(RoomMessageHandler, _super);
    RoomMessageHandler_1 = RoomMessageHandler;
    RoomMessageHandler.getInstance = function() {
      if (!(null !== this.instance && void 0 !== this.instance)) {
        this.instance = new RoomMessageHandler_1();
        this.instance.init();
      }
      return this.instance;
    };
    RoomMessageHandler.prototype.genMessage = function(target, data) {
      var frame = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, NetworkConfig.getZoneName(), target, data];
      return JSON.stringify(frame);
    };
    RoomMessageHandler.prototype.requestListRoom = function(gameID) {
      this.printLog("requestListRoom gameID: " + gameID);
      var frame = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, NetworkConfig.getZoneName(), "channelPlugin", {
        cmd: MessageCardGameHandler.RoomCommand.GET_TABLES,
        aid: 1,
        gid: gameID
      }];
      this.sendData(JSON.stringify(frame));
      GamePlayManager.default.getInstance().gameID = gameID;
    };
    RoomMessageHandler.prototype.requestBuyIn = function(buyInAmount) {
      var frame = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, NetworkConfig.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: MessageCardGameHandler.RoomCommand.BUY_IN,
        m: buyInAmount
      }];
      this.sendData(JSON.stringify(frame));
    };
    RoomMessageHandler.prototype.requestBookRoom = function(roomID, e, i) {
      GamePlayManager.default.getInstance().roomID = roomID;
      var frame = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, "Simms", "channelPlugin", {
        cmd: MessageCardGameHandler.Global_Message.BOOK_ROOM,
        rid: roomID
      }];
      this.sendData(JSON.stringify(frame));
    };
    RoomMessageHandler.prototype.sendAutoReadyPref = function(isAutoReady) {
      if (GameConfigManager.default.getInstance().misc && GameConfigManager.default.getInstance().misc.sendAutoReadyPref) {
        var frame = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, "Simms", "channelPlugin", {
          cmd: MessageCardGameHandler.Global_Message.SET_AUTO_READY,
          aRd: isAutoReady + ""
        }];
        this.sendData(JSON.stringify(frame));
      }
    };
    RoomMessageHandler.prototype.requestJoinRoom = function(roomID, e, password, n, o) {
      if (void 0 === n) {
        n = "";
      }
      if (void 0 === o) {
        o = "";
      }
      GamePlayManager.default.getInstance().roomID = roomID;
      var frame = [MessageCardGameHandler.Message.MessageType.JoinRoom_Type, "Simms", roomID, password];
      this.sendData(JSON.stringify(frame));
    };
    RoomMessageHandler.prototype.receiveMessage = function(cmd, raw, data) {
      switch (cmd) {
        case MessageCardGameHandler.RoomCommand.BUY_IN:
          this.printLog("receiveMessage RoomCommand.BUY_IN");
          null != this.onReceiveBuyIn && this.onReceiveBuyIn(data);
          break;
        case MessageCardGameHandler.RoomCommand.INGAME_JOIN_TABLE_INFOS:
          this.printLog("receiveMessage RoomCommand.JOIN_TABLE_INFOS");
          null != this.onReceiveTableInfos && this.onReceiveTableInfos(raw, data);
          break;
        case MessageCardGameHandler.RoomCommand.INGAME_USER_LEAVE_AND_JOIN_TABLE:
          this.printLog("receiveMessage RoomCommand.USER_LEAVE_AND_JOIN_TABLE");
          null != this.onReceiveUpdateUser && this.onReceiveUpdateUser(raw, data);
          break;
        case MessageCardGameHandler.RoomCommand.GET_TABLES:
          this.printLog("receiveMessage RoomCommand.GET_TABLES");
          null != this.onReceiveListRoom && this.onReceiveListRoom(raw, data);
          break;
        case MessageCardGameHandler.Global_Message.BOOK_ROOM:
          this.onReceiveBookRoom(raw, data);
          break;
        case MessageCardGameHandler.Global_Message.CREATE_TABLE_RESPONSE:
          this.onReceiveCreateRoomRespone(raw, data);
          break;
        case MessageCardGameHandler.Global_Message.QUICK_PLAY:
        case MessageCardGameHandler.Global_Message.QUICK_PLAY_WITH_BET:
        case MessageCardGameHandler.Global_Message.CREATE_TABLE:
          this.onReceiveQuickPlay(raw, data);
      }
    };
    RoomMessageHandler.instance = null;
    return RoomMessageHandler = RoomMessageHandler_1 = __decorate([ccclass], RoomMessageHandler);
  }(MessageHandlerBase.default));
moduleExports.default = RoomMessageHandler;
void 0;
