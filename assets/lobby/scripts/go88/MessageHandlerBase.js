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
var o = cc._decorator,
  a = o.ccclass,
  s = (o.property, function() {
    function t() {
      this.socket = null;
      this.active = true;
    }
    var e;
    e = t;
    t.setStaticSocket = function(t) {
      e.staticSocket = t;
    };
    t.prototype.setSocket = function(t) {
      this.socket = t;
    };
    t.prototype.printLog = function(t, e) {
      if (void 0 === e) {
        e = true;
      }
    };
    t.prototype.getTag = function() {
      return "";
    };
    t.prototype.sendData = function(t) {
      if (null != this.socket && void 0 != this.socket) {
        this.socket.sendData(t);
        this.printLog("sendData: " + t);
      } else {
        this.printLog("sendData: socket null or undefined");
      }
    };
    t.prototype.init = function() {
      this.socket = e.staticSocket;
    };
    t.prototype.receiveMessage = function(t, e, i) {};
    t.staticSocket = null;
    return t = e = n([a], t);
  }());
i.default = s;
void 0;
