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
var a = cc._decorator,
  s = a.ccclass,
  r = a.property,
  c = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.lblName = null;
      e.lblMoney = null;
      e.iconCheck = null;
      e.playerId = "";
      e.selected = true;
      e.parent = null;
      return e;
    }
    n(e, t);
    e.prototype.init = function(t) {
      this.parent = t;
    };
    e.prototype.btnCheckClick = function() {
      this.iconCheck.active = !this.iconCheck.active;
      this.selected = this.iconCheck.active;
    };
    o([r(cc.Label)], e.prototype, "lblName", void 0);
    o([r(cc.Label)], e.prototype, "lblMoney", void 0);
    o([r(cc.Node)], e.prototype, "iconCheck", void 0);
    return e = o([s], e);
  }(cc.Component);
i.default = c;
void 0;
