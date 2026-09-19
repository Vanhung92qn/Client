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
var a,
  s = cc._decorator,
  r = s.ccclass,
  c = s.property;
(function(t) {
  t[t.HEART = 0] = "HEART";
  t[t.DIAMOND = 1] = "DIAMOND";
  t[t.CLUB = 2] = "CLUB";
  t[t.SPADE = 3] = "SPADE";
})(a = i.TypeParticleCard || (i.TypeParticleCard = {}));
var l = function(t) {
  function e() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.particleCardPrefab = null;
    e.parentParticle = null;
    e.listSpriteFrameParticle = [];
    return e;
  }
  n(e, t);
  e.prototype.start = function() {};
  e.prototype.PlayParticle = function(t) {
    var e = cc.instantiate(this.particleCardPrefab).getComponent(cc.ParticleSystem);
    switch (t) {
      case a.HEART:
        e.spriteFrame = this.listSpriteFrameParticle[0];
        e.startColor = cc.color(255, 48, 48, 183);
        e.endColor = cc.color(255, 48, 48, 156);
        break;
      case a.DIAMOND:
        e.spriteFrame = this.listSpriteFrameParticle[1];
        e.startColor = cc.color(255, 48, 48, 183);
        e.endColor = cc.color(255, 48, 48, 156);
        break;
      case a.CLUB:
        e.spriteFrame = this.listSpriteFrameParticle[2];
        e.startColor = cc.color(0, 0, 0, 183);
        e.endColor = cc.color(0, 0, 0, 156);
        break;
      case a.SPADE:
        e.spriteFrame = this.listSpriteFrameParticle[3];
        e.startColor = cc.color(0, 0, 0, 183);
        e.endColor = cc.color(0, 0, 0, 156);
        break;
      default:
        e.spriteFrame = this.listSpriteFrameParticle[0];
    }
    e.node.parent = this.parentParticle;
  };
  o([c(cc.Prefab)], e.prototype, "particleCardPrefab", void 0);
  o([c(cc.Node)], e.prototype, "parentParticle", void 0);
  o([c(cc.SpriteFrame)], e.prototype, "listSpriteFrameParticle", void 0);
  return e = o([r], e);
}(cc.Component);
i.default = l;
void 0;
