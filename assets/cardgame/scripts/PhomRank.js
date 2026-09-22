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
var a = require("./GameDefine"),
  s = cc._decorator,
  r = s.ccclass,
  c = s.property,
  l = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.listEffect = [];
      e.spine = null;
      return e;
    }
    n(e, t);
    e.prototype.start = function() {};
    e.prototype.setRank = function(t) {
      if (t == a.EPhomRank.NONE) {
        this.hide();
      }
      var e = t - 2;
      if (e < 0 || e > this.listEffect.length - 1) {
        this.hide();
      } else {
        var i = Object.create(this.listEffect[e]);
        this.spine.skeletonData = i;
        if (null != this.spine.skeletonData) {
          if (t == a.EPhomRank.DEN_LANG) {
            this.spine.setAnimation(0, "animation_Start", false);
            this.spine.setCompleteListener(function() {
              this.spine.setAnimation(0, "animation_Loop", true);
              this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(function() {
                this.spine.setAnimation(0, "animation_End", false);
              }.bind(this))));
            }.bind(this));
          } else {
            this.spine.setAnimation(0, "animation", false);
          }
        }
        this.show();
      }
    };
    e.prototype.show = function() {
      this.node.active = true;
    };
    e.prototype.hide = function() {
      this.node.active = false;
    };
    o([c(sp.SkeletonData)], e.prototype, "listEffect", void 0);
    o([c(sp.Skeleton)], e.prototype, "spine", void 0);
    return e = o([r], e);
  }(cc.Component);
i.default = l;
void 0;
