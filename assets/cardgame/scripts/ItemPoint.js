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
//   a = GamePlayManager   s = StringUtil
// ────────────────────────────────────────────────────────────────
var a = require("./GamePlayManager"),
  s = require("./StringUtil"),
  r = cc._decorator,
  c = r.ccclass,
  l = r.property,
  h = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.txtRank = null;
      e.icoRank = null;
      e.animRank = null;
      e.txtTenHienThi = null;
      e.txtTongPoint = null;
      e.spriteLineOn = null;
      e.selected = null;
      e.animTop = null;
      e.nodeContent = null;
      return e;
    }
    n(e, t);
    e.prototype.loadUI = function(t, e, i, n, o) {
      if (s.default.isNullOrEmpty(n) || n != a.default.getInstance().userID ? this.selected.active = false : this.selected.active = true,
        void 0 != t && null != t) {
        if (this.spriteLineOn.active = t % 2 != 0, t <= 3) {
          switch (this.txtRank.node.active = false, t) {
            case 1:
              this.icoRank.node.active = false;
              this.animRank.node.active = true;
              this.animRank.skeletonData = this.animTop;
              this.animRank.setAnimation(0, "Rank1", true);
              this.animRank.node.scale = .6;
              break;
            case 2:
              this.icoRank.node.active = false;
              this.animRank.node.active = true;
              this.animRank.skeletonData = this.animTop;
              this.animRank.setAnimation(0, "Rank2", true);
              this.animRank.node.scale = .54;
              break;
            case 3:
              this.animRank.node.active = false;
              this.icoRank.node.active = true;
          }
        } else {
          this.txtRank.node.active = true;
          this.icoRank.node.active = false;
          this.animRank.node.active = false;
          this.txtRank.string = t.toString();
        }
      }
      if (s.default.isNullOrEmpty(e)) {
        if (s.default.isNullOrEmpty(o)) {
          this.txtTenHienThi.string = "";
        } else {
          this.txtTenHienThi.string = o.toString();
        }
      } else {
        this.txtTenHienThi.string = e.toString();
      }
      this.txtTongPoint.string = void 0 != i && null != i ? s.default.formatMoneyNumberWithColom(i) : "0";
    };
    o([l(cc.Label)], e.prototype, "txtRank", void 0);
    o([l(cc.Sprite)], e.prototype, "icoRank", void 0);
    o([l(sp.Skeleton)], e.prototype, "animRank", void 0);
    o([l(cc.Label)], e.prototype, "txtTenHienThi", void 0);
    o([l(cc.Label)], e.prototype, "txtTongPoint", void 0);
    o([l(cc.Node)], e.prototype, "spriteLineOn", void 0);
    o([l(cc.Node)], e.prototype, "selected", void 0);
    o([l(sp.SkeletonData)], e.prototype, "animTop", void 0);
    o([l(cc.Node)], e.prototype, "nodeContent", void 0);
    return e = o([c], e);
  }(cc.Component);
i.default = h;
void 0;
