var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
var n = this && this.__decorate || function(t, e, i, n) {
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
var WSCardGameHandle = require("./WSCardGameHandle"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  GamePlayManager = require("./GamePlayManager"),
  XiToMessage = require("./XiToMessage"),
  c = cc._decorator,
  l = c.ccclass,
  h = (c.property, function() {
    function t() {}
    var e;
    e = t;
    t.getInstance = function() {
      if (!(null !== this.Instance && void 0 !== this.Instance)) {
        this.Instance = new e();
        this.Instance.init();
      }
      return this.Instance;
    };
    t.prototype.init = function() {};
    t.prototype.getZoneName = function() {
      return "Simms";
    };
    t.prototype.sendData = function(t) {
      if (WSCardGameHandle.default.getInstance().isSocketOpen) {
        WSCardGameHandle.default.getInstance().ws.sendData(t);
      }
    };
    t.prototype.GetListRoom = function() {
      var t = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: MessageCardGameHandler.Global_Message.GET_TABLES,
        aid: "1",
        gid: MessageCardGameHandler.GAME.XITO
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendReady = function(t) {
      var e = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), t, {
        cmd: MessageCardGameHandler.Global_Message.INGAME_USER_READY
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendReadyToDealCard = function(t) {
      var e = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), t, {
        cmd: XiToMessage.default.START_BETTING
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendWithdrawMoney = function(t) {
      var e = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.WITHDRA_MONEY,
        m: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendWithdrawMoneyCommom = function(t) {
      var e = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.BUY_IN,
        m: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendStandUp = function() {
      var t = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.STAND_UP
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendRaise = function(t) {
      var e = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.RAISE,
        b: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendCall = function() {
      var t = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.CALL
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendFold = function() {
      var t = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.FOLD
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendCheck = function() {
      var t = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.CHECK
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendStart = function() {
      var t = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.START
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendChonLaBaiTay = function(t) {
      var e = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.SEND_LAT_BAI_TAY,
        cs: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.Instance = null;
    return t = e = n([l], t);
  }());
i.default = h;
void 0;
