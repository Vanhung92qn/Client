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
var MessageCardGameHandler = require("./MessageCardGameHandler"),
  NetworkConfig = require("./NetworkConfig"),
  GamePlayManager = require("./GamePlayManager"),
  MessageHandlerBase = require("./MessageHandlerBase"),
  GameConfigManager = require("./GameConfigManager"),
  h = cc._decorator,
  u = h.ccclass,
  d = (h.property, function(t) {
    function e() {
      var e = t.call(this) || this;
      e.onReceiveBuyIn = function(t) {};
      e.onReceiveJoinRoom = function(t) {};
      e.onReceiveBookRoom = function(t) {};
      e.onReceiveTableInfos = function(t) {};
      e.onReceiveUpdateUser = function(t) {};
      e.onReceiveListRoom = function(t, e) {};
      e.onReceiveCreateRoomRespone = function(t) {};
      e.onReceiveQuickPlay = function(t) {};
      return e;
    }
    var i;
    n(e, t);
    i = e;
    e.getInstance = function() {
      if (!(null !== this.instance && void 0 !== this.instance)) {
        this.instance = new i();
        this.instance.init();
      }
      return this.instance;
    };
    e.prototype.genMessage = function(t, e) {
      var i = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, NetworkConfig.getZoneName(), t, e];
      return JSON.stringify(i);
    };
    e.prototype.requestListRoom = function(t) {
      this.printLog("requestListRoom gameID: " + t);
      var e = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, NetworkConfig.getZoneName(), "channelPlugin", {
        cmd: MessageCardGameHandler.RoomCommand.GET_TABLES,
        aid: 1,
        gid: t
      }];
      this.sendData(JSON.stringify(e));
      GamePlayManager.default.getInstance().gameID = t;
    };
    e.prototype.requestBuyIn = function(t) {
      var e = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, NetworkConfig.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: MessageCardGameHandler.RoomCommand.BUY_IN,
        m: t
      }];
      this.sendData(JSON.stringify(e));
    };
    e.prototype.requestBookRoom = function(t, e, i) {
      GamePlayManager.default.getInstance().roomID = t;
      var n = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, "Simms", "channelPlugin", {
        cmd: MessageCardGameHandler.Global_Message.BOOK_ROOM,
        rid: t
      }];
      this.sendData(JSON.stringify(n));
    };
    e.prototype.sendAutoReadyPref = function(t) {
      if (GameConfigManager.default.getInstance().misc && GameConfigManager.default.getInstance().misc.sendAutoReadyPref) {
        var e = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, "Simms", "channelPlugin", {
          cmd: MessageCardGameHandler.Global_Message.SET_AUTO_READY,
          aRd: t + ""
        }];
        this.sendData(JSON.stringify(e));
      }
    };
    e.prototype.requestJoinRoom = function(t, e, i, n, o) {
      if (void 0 === n) {
        n = "";
      }
      if (void 0 === o) {
        o = "";
      }
      GamePlayManager.default.getInstance().roomID = t;
      var s = [MessageCardGameHandler.Message.MessageType.JoinRoom_Type, "Simms", t, i];
      this.sendData(JSON.stringify(s));
    };
    e.prototype.receiveMessage = function(t, e, i) {
      switch (t) {
        case MessageCardGameHandler.RoomCommand.BUY_IN:
          this.printLog("receiveMessage RoomCommand.BUY_IN");
          null != this.onReceiveBuyIn && this.onReceiveBuyIn(i);
          break;
        case MessageCardGameHandler.RoomCommand.INGAME_JOIN_TABLE_INFOS:
          this.printLog("receiveMessage RoomCommand.JOIN_TABLE_INFOS");
          null != this.onReceiveTableInfos && this.onReceiveTableInfos(e, i);
          break;
        case MessageCardGameHandler.RoomCommand.INGAME_USER_LEAVE_AND_JOIN_TABLE:
          this.printLog("receiveMessage RoomCommand.USER_LEAVE_AND_JOIN_TABLE");
          null != this.onReceiveUpdateUser && this.onReceiveUpdateUser(e, i);
          break;
        case MessageCardGameHandler.RoomCommand.GET_TABLES:
          this.printLog("receiveMessage RoomCommand.GET_TABLES");
          null != this.onReceiveListRoom && this.onReceiveListRoom(e, i);
          break;
        case MessageCardGameHandler.Global_Message.BOOK_ROOM:
          this.onReceiveBookRoom(e, i);
          break;
        case MessageCardGameHandler.Global_Message.CREATE_TABLE_RESPONSE:
          this.onReceiveCreateRoomRespone(e, i);
          break;
        case MessageCardGameHandler.Global_Message.QUICK_PLAY:
        case MessageCardGameHandler.Global_Message.QUICK_PLAY_WITH_BET:
        case MessageCardGameHandler.Global_Message.CREATE_TABLE:
          this.onReceiveQuickPlay(e, i);
      }
    };
    e.instance = null;
    return e = i = o([u], e);
  }(MessageHandlerBase.default));
i.default = d;
void 0;
