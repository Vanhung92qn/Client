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
var a = require("CardPopupBase"),
  s = require("GamePlayManager"),
  r = require("MusicPlayer"),
  c = require("CommonPrefabsManager"),
  l = require("CardGameCommonRequest"),
  h = cc._decorator,
  u = h.ccclass,
  d = (h.property, function(t) {
    function e() {
      return null !== t && t.apply(this, arguments) || this;
    }
    n(e, t);
    e.prototype.onClickedGiuNguyenBtn = function() {
      r.default.getInstance().playbtnClick();
      this.hide();
      s.default.getInstance().IsMauBinhUsingNewXepBai = false;
      l.default.getInstance().sendSettingRoom(false, false, s.default.getInstance().IsMauBinhFistTimeShowQuickGuide);
    };
    e.prototype.onClickedCachXepMoiBtn = function() {
      r.default.getInstance().playbtnClick();
      s.default.getInstance().IsMauBinhUsingNewXepBai = true;
      c.default.getInstance().showPopupMessageUtil("\u0110\xe3 chuy\u1ec3n sang c\xe1ch x\u1ebfp b\xe0i m\u1edbi");
      l.default.getInstance().sendSettingRoom(true, false, s.default.getInstance().IsMauBinhFistTimeShowQuickGuide);
      this.hide();
    };
    e.prototype.onClickedDownBtn = function() {
      r.default.getInstance().playbtnClick();
    };
    e.prototype.onClickedUpBtn = function() {
      r.default.getInstance().playbtnClick();
    };
    return e = o([u], e);
  }(a.default));
i.default = d;
void 0;
