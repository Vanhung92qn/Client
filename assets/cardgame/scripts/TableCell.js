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
//   a = OrientationManager   s = StringUtil
// ────────────────────────────────────────────────────────────────
var a = require("./OrientationManager"),
  s = require("./StringUtil"),
  r = cc._decorator,
  c = r.ccclass,
  l = (r.property, function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.tableViewUtils = null;
      e.index = 0;
      return e;
    }
    n(e, t);
    e.prototype.initValue = function(t, e, i) {
      if (void 0 === i) {
        i = a.Orientation.Landscape;
      }
      this.tableViewUtils = e;
      this.data = t;
    };
    e.prototype.setIndex = function(t) {
      this.index = t;
    };
    e.prototype.getNewValueGYB = function(t) {
      if (s.default.isNullOrEmpty(t)) {
        return "";
      }
      try {
        var e = JSON.parse(t);
        if (e && !s.default.isNullOrEmpty(e.sm)) {
          return e.sm;
        }
      } catch (t) {}
      return t;
    };
    return e = o([c], e);
  }(cc.Component));
i.default = l;
void 0;
