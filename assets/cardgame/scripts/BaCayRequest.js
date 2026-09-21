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
  BaCayMessage = require("./BaCayMessage"),
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
    t.prototype.sendImformRoyalties = function(t) {
      var e = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: BaCayMessage.default.INFORM_ROYALTIES,
        cs: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendUpdateArrangeCardsState = function(t) {
      var e = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: BaCayMessage.default.UPDATE_ARRANGE_CARDS_STATE,
        cs: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendUpdateCurrentCardsState = function(t) {
      var e = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: BaCayMessage.default.UPDATE_CURRENT_CARDS_STATE,
        cs: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendRearrangeCards = function() {
      var t = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: BaCayMessage.default.REARRANGE_CARDS
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendStart = function() {
      var t = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: BaCayMessage.default.START
      }];
      this.sendData(JSON.stringify(t));
    };
    t.Instance = null;
    return t = e = n([l], t);
  }());
i.default = h;
void 0;
