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
var a = require("GameZOrder"),
  s = cc._decorator,
  r = s.ccclass,
  c = s.property,
  l = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.label = null;
      e.nodeRutBai = null;
      e.totalCard = 0;
      return e;
    }
    n(e, t);
    e.prototype.start = function() {
      this.nodeRutBai.zIndex = a.default.PHOM_CARD_PACK;
    };
    e.prototype.setCardCount = function(t, e) {
      if (void 0 === e) {
        e = false;
      }
      this.label.string = t;
      this.totalCard = t;
      if (0 == this.totalCard) {
        this.node.active = false;
      }
      if (true === e) {
        this.label.string = "";
      }
    };
    e.prototype.PopCard = function(t) {
      if (void 0 === t) {
        t = false;
      }
      this.setCardCount(this.totalCard - 1, t);
    };
    e.prototype.setTextRutBaiVisible = function(t, e) {
      if (void 0 === e) {
        e = true;
      }
      this.nodeRutBai.active = t;
      this.nodeRutBai.setPosition(0, 73);
      if (t && e) {
        this.nodeRutBai.runAction(cc.repeatForever(cc.sequence(cc.moveBy(.3, 0, -10), cc.moveBy(.3, 0, 10))));
      } else {
        if (0 == t) {
          this.nodeRutBai.stopAllActions();
        }
      }
    };
    o([c(cc.Label)], e.prototype, "label", void 0);
    o([c(cc.Node)], e.prototype, "nodeRutBai", void 0);
    return e = o([r], e);
  }(cc.Component);
i.default = l;
void 0;
