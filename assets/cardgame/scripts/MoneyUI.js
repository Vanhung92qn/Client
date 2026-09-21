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
  s = require("./MessageCardGameHandler"),
  r = cc._decorator,
  c = r.ccclass,
  l = r.property,
  h = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.label = null;
      e.borderWin = null;
      e.borderLose = null;
      e.icon = null;
      e.background = null;
      e.fromPosition = null;
      return e;
    }
    n(e, t);
    e.prototype.start = function() {};
    e.prototype.setMoney = function(t) {
      this.label.string = a.default.formatMoneyNumber(t);
      if (t > 0) {
        this.icon.active = true;
        this.background.spriteFrame = this.borderWin;
      } else {
        this.icon.active = true;
        this.background.spriteFrame = this.borderLose;
      }
    };
    e.prototype.hide = function() {
      this.node.runAction(cc.sequence(cc.fadeOut(.4), cc.callFunc(function() {
        this.node.active = false;
        this.node.opacity = 255;
      }.bind(this))));
    };
    e.prototype.show = function(t, e, i) {
      switch (void 0 === e && (e = -1), void 0 === i && (i = false), this.node.active = true, t) {
        case s.GAME.LIENG:
        case s.GAME.PHOM:
        case s.GAME.TIENLEN:
          this.node.opacity = 0;
          this.node.runAction(cc.fadeIn(.3));
          this.node.runAction(cc.moveTo(.3, this.node.x, this.node.y));
      }
      if (e > 0) {
        this.node.runAction(cc.sequence(cc.delayTime(e), cc.callFunc(function() {
          if (i) {
            this.node.destroy();
          } else {
            this.hide();
          }
        }.bind(this))));
      }
    };
    e.prototype.setWinLose = function(t) {};
    e.prototype.onDisable = function() {
      this.node.destroy();
    };
    o([l(cc.Label)], e.prototype, "label", void 0);
    o([l(cc.SpriteFrame)], e.prototype, "borderWin", void 0);
    o([l(cc.SpriteFrame)], e.prototype, "borderLose", void 0);
    o([l(cc.Node)], e.prototype, "icon", void 0);
    o([l(cc.Sprite)], e.prototype, "background", void 0);
    return e = o([c], e);
  }(cc.Component);
i.default = h;
void 0;
