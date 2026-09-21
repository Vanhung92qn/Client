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
// ── BẢNG TRA BÍ DANH (máy sinh — ghi-bang-tra-bi-danh.js) ──────
// Mã dịch ngược đặt bí danh một chữ cho mỗi module. Bảng này để khỏi phải cuộn ngược.
// KHÔNG đổi tên chúng bằng tìm-kiếm-thay-thế: đoạn mở đầu __decorate khai lại đúng
// những chữ này làm biến cục bộ, đổi là hỏng im lặng.
//   a = StringUtil   s = GameUtils
// ────────────────────────────────────────────────────────────────
var a = require("./StringUtil"),
  s = require("./GameUtils"),
  r = cc._decorator,
  c = r.ccclass,
  l = r.property,
  h = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.label = null;
      e.chipIconPos = null;
      e.money = 0;
      return e;
    }
    n(e, t);
    e.prototype.setNumber = function(t, e) {
      if (void 0 === e) {
        e = true;
      }
      if (e) {
        s.runAnimationMoney(this.label, this.money, t);
        this.money = t;
      }
      this.label.string = a.default.formatMoneyNumber(t);
      if (0 === t) {
        this.node.active = false;
        this.label.string = "";
      }
    };
    e.prototype.setNumberWithPrefix = function(t, e, i) {
      if (void 0 === e) {
        e = true;
      }
      if (void 0 === i) {
        i = "";
      }
      if (e) {
        s.runAnimationMoney(this.label, this.money, t);
        this.money = t;
      }
      this.label.string = i + a.default.formatMoneyNumber(t);
      if (0 === t) {
        this.node.active = false;
        this.label.string = "";
      }
    };
    e.prototype.setText = function(t) {
      this.label.string = t;
    };
    o([l(cc.Label)], e.prototype, "label", void 0);
    o([l(cc.Node)], e.prototype, "chipIconPos", void 0);
    return e = o([c], e);
  }(cc.Component);
i.default = h;
void 0;
