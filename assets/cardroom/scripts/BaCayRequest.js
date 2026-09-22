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
  BaCayMessage = require("BaCayMessage"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  BaCayRequest = (ccDecorator.property, function() {
    function BaCayRequest() {}
    var BaCayRequest_1;
    BaCayRequest_1 = BaCayRequest;
    BaCayRequest.getInstance = function() {
      if (!(null !== this.Instance && void 0 !== this.Instance)) {
        this.Instance = new BaCayRequest_1();
        this.Instance.init();
      }
      return this.Instance;
    };
    BaCayRequest.prototype.init = function() {};
    BaCayRequest.prototype.getZoneName = function() {
      return "Simms";
    };
    BaCayRequest.prototype.sendData = function(data) {
      if (WSCardGameHandle.default.getInstance().isSocketOpen) {
        WSCardGameHandle.default.getInstance().ws.sendData(data);
      }
    };
    BaCayRequest.prototype.sendImformRoyalties = function(cardCodes) {
      var message = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: BaCayMessage.default.INFORM_ROYALTIES,
        cs: cardCodes
      }];
      this.sendData(JSON.stringify(message));
    };
    BaCayRequest.prototype.sendUpdateArrangeCardsState = function(cardCodes) {
      var message = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: BaCayMessage.default.UPDATE_ARRANGE_CARDS_STATE,
        cs: cardCodes
      }];
      this.sendData(JSON.stringify(message));
    };
    BaCayRequest.prototype.sendUpdateCurrentCardsState = function(cardCodes) {
      var message = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: BaCayMessage.default.UPDATE_CURRENT_CARDS_STATE,
        cs: cardCodes
      }];
      this.sendData(JSON.stringify(message));
    };
    BaCayRequest.prototype.sendRearrangeCards = function() {
      var message = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: BaCayMessage.default.REARRANGE_CARDS
      }];
      this.sendData(JSON.stringify(message));
    };
    BaCayRequest.prototype.sendStart = function() {
      var message = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: BaCayMessage.default.START
      }];
      this.sendData(JSON.stringify(message));
    };
    BaCayRequest.Instance = null;
    return BaCayRequest = BaCayRequest_1 = __decorate([ccclass], BaCayRequest);
  }());
moduleExports.default = BaCayRequest;
void 0;
