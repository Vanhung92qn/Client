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
var a = require("./StringUtil"),
  s = cc._decorator,
  r = s.ccclass,
  c = s.property,
  l = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.label = null;
      e.chipIconPos = null;
      e.money = 0;
      e.coins = [];
      return e;
    }
    n(e, t);
    e.prototype.setNumber = function(t) {
      this.label.node.active = true;
      this.label.string = 0 === t ? "" : a.default.formatMoneyNumber(t);
      this.money = t;
    };
    o([c(cc.Label)], e.prototype, "label", void 0);
    o([c(cc.Node)], e.prototype, "chipIconPos", void 0);
    return e = o([r], e);
  }(cc.Component);
i.default = l;
void 0;
