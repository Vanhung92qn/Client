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
var a = require("MainGameViewModel"),
  s = require("GamePlayManager"),
  r = require("MessageCardGameHandler"),
  c = require("PokerController"),
  l = cc._decorator,
  h = l.ccclass,
  u = l.property,
  d = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.pokerController = null;
      e.prefabPokerController = null;
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {
      s.default.getInstance().gameID = r.GAME.POKER;
      var e = cc.instantiate(this.prefabPokerController);
      e.parent = this.mainUiNode;
      this.pokerController = e.getComponent(c.default);
      this.pokerController.mainGamePokerViewModel = this;
      this.mainGameController = this.pokerController;
      e.active = false;
      t.prototype.onLoad.call(this);
    };
    o([u(cc.Prefab)], e.prototype, "prefabPokerController", void 0);
    return e = o([h], e);
  }(a.default);
i.default = d;
void 0;
