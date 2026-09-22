var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
var __decorate = this && this.__decorate || function(t, e, i, n) {
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
var WSCardGameHandle = require("WSCardGameHandle"),
  MessageCardGameHandler = require("MessageCardGameHandler"),
  GamePlayManager = require("GamePlayManager"),
  XiToMessage = require("XiToMessage"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  XiToRequestHandler = (ccDecorator.property, function() {
    function XiToRequestHandler() {}
    var XiToRequestHandler_1;
    XiToRequestHandler_1 = XiToRequestHandler;
    XiToRequestHandler.getInstance = function() {
      if (!(null !== this.Instance && void 0 !== this.Instance)) {
        this.Instance = new XiToRequestHandler_1();
        this.Instance.init();
      }
      return this.Instance;
    };
    XiToRequestHandler.prototype.init = function() {};
    XiToRequestHandler.prototype.getZoneName = function() {
      return "Simms";
    };
    XiToRequestHandler.prototype.sendData = function(jsonMessage) {
      if (WSCardGameHandle.default.getInstance().isSocketOpen) {
        WSCardGameHandle.default.getInstance().ws.sendData(jsonMessage);
      }
    };
    XiToRequestHandler.prototype.GetListRoom = function() {
      var message = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: MessageCardGameHandler.Global_Message.GET_TABLES,
        aid: "1",
        gid: MessageCardGameHandler.GAME.XITO
      }];
      this.sendData(JSON.stringify(message));
    };
    XiToRequestHandler.prototype.sendReady = function(roomID) {
      var message = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), roomID, {
        cmd: MessageCardGameHandler.Global_Message.INGAME_USER_READY
      }];
      this.sendData(JSON.stringify(message));
    };
    XiToRequestHandler.prototype.sendReadyToDealCard = function(roomID) {
      var message = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), roomID, {
        cmd: XiToMessage.default.START_BETTING
      }];
      this.sendData(JSON.stringify(message));
    };
    XiToRequestHandler.prototype.sendWithdrawMoney = function(amount) {
      var message = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.WITHDRA_MONEY,
        m: amount
      }];
      this.sendData(JSON.stringify(message));
    };
    XiToRequestHandler.prototype.sendWithdrawMoneyCommom = function(amount) {
      var message = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.BUY_IN,
        m: amount
      }];
      this.sendData(JSON.stringify(message));
    };
    XiToRequestHandler.prototype.sendStandUp = function() {
      var message = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.STAND_UP
      }];
      this.sendData(JSON.stringify(message));
    };
    XiToRequestHandler.prototype.sendRaise = function(betAmount) {
      var message = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.RAISE,
        b: betAmount
      }];
      this.sendData(JSON.stringify(message));
    };
    XiToRequestHandler.prototype.sendCall = function() {
      var message = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.CALL
      }];
      this.sendData(JSON.stringify(message));
    };
    XiToRequestHandler.prototype.sendFold = function() {
      var message = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.FOLD
      }];
      this.sendData(JSON.stringify(message));
    };
    XiToRequestHandler.prototype.sendCheck = function() {
      var message = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.CHECK
      }];
      this.sendData(JSON.stringify(message));
    };
    XiToRequestHandler.prototype.sendStart = function() {
      var message = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.START
      }];
      this.sendData(JSON.stringify(message));
    };
    XiToRequestHandler.prototype.sendChonLaBaiTay = function(cardServerCode) {
      var message = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: XiToMessage.default.SEND_LAT_BAI_TAY,
        cs: cardServerCode
      }];
      this.sendData(JSON.stringify(message));
    };
    XiToRequestHandler.Instance = null;
    return XiToRequestHandler = XiToRequestHandler_1 = __decorate([ccclass], XiToRequestHandler);
  }());
moduleExports.default = XiToRequestHandler;
void 0;
