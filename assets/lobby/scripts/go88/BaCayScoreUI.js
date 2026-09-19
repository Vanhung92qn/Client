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
var a = t("./GameZOrder"),
  s = cc._decorator,
  r = s.ccclass,
  c = s.property,
  l = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.lbScore = null;
      e.atlasScore = null;
      e.animScrore = null;
      e.animJQKHeart = null;
      e.animSameScrore = null;
      e.myScore = 0;
      e.isSameScore = false;
      e.fadeOutCallback = function(t) {};
      return e;
    }
    n(e, t);
    e.prototype.start = function() {
      this.node.zIndex = a.default.SCORE_UI;
    };
    e.prototype.onDestroy = function() {};
    e.prototype.setScore = function(t, e) {
      if (void 0 === e) {
        e = false;
      }
      this.myScore = t;
      this.node.opacity = 0;
      this.animJQKHeart.node.active = false;
      this.animScrore.node.active = false;
      this.isSameScore = e;
      if (null != this.animSameScrore) {
        this.animSameScrore.node.active = false;
      }
    };
    e.prototype.fade = function(t, e, i, n, o) {
      var a = this;
      if (void 0 === i) {
        i = false;
      }
      if (null != this.animSameScrore) {
        this.animSameScrore.node.active = false;
      }
      this.node.runAction(cc.sequence(cc.delayTime(t), cc.callFunc(function() {
        if (o) {
          a.animJQKHeart.node.active = true;
          a.animJQKHeart.setAnimation(0, "animation", false);
        } else {
          a.animScrore.node.active = true;
          a.animScrore.setAnimation(0, a.getNameAnimScore(a.myScore, i), false);
        }
      }), cc.delayTime(.15), cc.callFunc(function() {
        a.animSameScrore.node.active = n;
      }), cc.delayTime(e + .15), cc.callFunc(this.onFadeOutEnd.bind(this))));
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
    e.prototype.getNameAnimScore = function(t, e) {
      if (void 0 === e) {
        e = false;
      }
      return 0 == t ? "bu" : t > 0 && t <= 9 ? t + " diem" : 999 == t && 0 == e ? "3tay2" : 999 == t && e ? "3tay3" : void 0;
    };
    o([c(cc.Label)], e.prototype, "lbScore", void 0);
    o([c(cc.SpriteAtlas)], e.prototype, "atlasScore", void 0);
    o([c(sp.Skeleton)], e.prototype, "animScrore", void 0);
    o([c(sp.Skeleton)], e.prototype, "animJQKHeart", void 0);
    o([c(sp.Skeleton)], e.prototype, "animSameScrore", void 0);
    return e = o([r], e);
  }(cc.Component);
i.default = l;
void 0;
