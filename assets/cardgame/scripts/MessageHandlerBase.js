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
var ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  MessageHandlerBase = (ccDecorator.property, function() {
    function MessageHandlerBase() {
      this.socket = null;
      this.active = true;
    }
    var MessageHandlerBase_1;
    MessageHandlerBase_1 = MessageHandlerBase;
    MessageHandlerBase.setStaticSocket = function(socket) {
      MessageHandlerBase_1.staticSocket = socket;
    };
    MessageHandlerBase.prototype.setSocket = function(socket) {
      this.socket = socket;
    };
    MessageHandlerBase.prototype.printLog = function(message, shouldLog) {
      if (void 0 === shouldLog) {
        shouldLog = true;
      }
    };
    MessageHandlerBase.prototype.getTag = function() {
      return "";
    };
    MessageHandlerBase.prototype.sendData = function(data) {
      if (null != this.socket && void 0 != this.socket) {
        this.socket.sendData(data);
        this.printLog("sendData: " + data);
      } else {
        this.printLog("sendData: socket null or undefined");
      }
    };
    MessageHandlerBase.prototype.init = function() {
      this.socket = MessageHandlerBase_1.staticSocket;
    };
    MessageHandlerBase.prototype.receiveMessage = function(cmd, raw, data) {};
    MessageHandlerBase.staticSocket = null;
    return MessageHandlerBase = MessageHandlerBase_1 = __decorate([ccclass], MessageHandlerBase);
  }());
moduleExports.default = MessageHandlerBase;
void 0;
