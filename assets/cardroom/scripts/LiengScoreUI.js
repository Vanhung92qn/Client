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
      e.label = null;
      e.sprite = null;
      e.atlasScore = null;
      e.fadeOutCallback = function(t) {};
      return e;
    }
    n(e, t);
    e.prototype.start = function() {};
    e.prototype.onDestroy = function() {};
    e.prototype.setScore = function(t, e) {
      if (void 0 === e) {
        e = false;
      }
      this.label.node.active = false;
      var i = e ? "_win" : "_lose",
        n = "";
      if (t < 10) {
        this.label.node.active = true;
        this.label.string = t.toString();
        n = "Box_diem";
      } else {
        if (10 == t) {
          n = "Anh";
        } else {
          if (11 == t) {
            n = "Lieng";
          } else {
            if (12 == t) {
              n = "Sap";
            }
          }
        }
      }
      this.sprite.spriteFrame = this.atlasScore.getSpriteFrame(n + i);
    };
    e.prototype.fade = function(t) {
      if (void 0 === t) {
        t = 4;
      }
      this.node.runAction(cc.sequence(cc.delayTime(t), cc.fadeOut(.3), cc.callFunc(this.onFadeOutEnd.bind(this))));
    };
    e.prototype.hide = function() {
      this.node.runAction(cc.sequence(cc.fadeOut(.4), cc.callFunc(function() {
        this.node.active = false;
        this.node.opacity = 255;
      }.bind(this))));
    };
    e.prototype.setFadeOutCallback = function(t) {
      this.fadeOutCallback = t;
    };
    e.prototype.onFadeOutEnd = function() {
      this.node.active = false;
      this.node.opacity = 255;
      if (null != this.fadeOutCallback) {
        this.fadeOutCallback(this);
      }
    };
    o([r(cc.Label)], e.prototype, "label", void 0);
    o([r(cc.Sprite)], e.prototype, "sprite", void 0);
    o([r(cc.SpriteAtlas)], e.prototype, "atlasScore", void 0);
    return e = o([s], e);
  }(cc.Component);
i.default = c;
void 0;
