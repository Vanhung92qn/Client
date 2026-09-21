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
//   a = CardPopupBase   s = GamePlayManager   r = StringUtil
//   c = CommonPrefabsManager
// ────────────────────────────────────────────────────────────────
var a = require("./CardPopupBase"),
  s = require("./GamePlayManager"),
  r = require("./StringUtil"),
  c = require("./CommonPrefabsManager"),
  l = cc._decorator,
  h = l.ccclass,
  u = l.property,
  d = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.password = null;
      e.btnOK = null;
      e.serverID = 0;
      return e;
    }
    n(e, t);
    e.prototype.btnOKPress = function() {
      if (r.default.isNullOrEmpty(this.password.string)) {
        c.default.getInstance().showPopupMessageUtil("B\u1ea1n ch\u01b0a nh\u1eadp m\u1eadt kh\u1ea9u !");
      } else {
        this.btnOK.interactable = false;
        var t = this.password.string;
        s.default.getInstance().joinRoom(s.default.getInstance().roomID, this.serverID, t);
        this.onClickClose();
      }
    };
    e.prototype.onClickClose = function() {
      this.hide();
    };
    e.prototype.ontextChanged = function(t, e, i) {
      e.string = r.default.removeSpecialCharacter(t);
    };
    o([u(cc.EditBox)], e.prototype, "password", void 0);
    o([u(cc.Button)], e.prototype, "btnOK", void 0);
    return e = o([h], e);
  }(a.default);
i.default = d;
void 0;
