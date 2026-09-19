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
var a = require("./GamePlayManager"),
  s = require("./MusicPlayer"),
  r = require("./CardGameCommonRequest"),
  c = require("./CommonPrefabsManager"),
  l = cc._decorator,
  h = l.ccclass,
  u = (l.property, function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.oldClickTime = 0;
      return e;
    }
    n(e, t);
    e.prototype.onClickInvite = function() {
      var t = new Date();
      if (!((t.getTime() - this.oldClickTime) / 1e3 < 2)) {
        this.oldClickTime = t.getTime();
        s.default.getInstance().playbtnClick();
        if (a.default.getInstance().roomPassword) {
          c.default.getInstance().showPopupMessageUtil(
            "Kh\xf4ng th\u1ec3 m\u1eddi ng\u01b0\u1eddi ch\u01a1i kh\xe1c do b\xe0n ch\u01a1i c\xf3 m\u1eadt kh\u1ea9u!");
        } else {
          r.default.getInstance().sendGetInviteList();
        }
      }
    };
    return e = o([h], e);
  }(cc.Component));
i.default = u;
void 0;
