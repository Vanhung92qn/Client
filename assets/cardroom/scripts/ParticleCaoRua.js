var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
var __extends = this && this.__extends || function() {
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
  __decorate = this && this.__decorate || function(t, e, i, n) {
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
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});
var TypeParticleCard,
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property;
(function(TypeParticleCard) {
  TypeParticleCard[TypeParticleCard.HEART = 0] = "HEART";
  TypeParticleCard[TypeParticleCard.DIAMOND = 1] = "DIAMOND";
  TypeParticleCard[TypeParticleCard.CLUB = 2] = "CLUB";
  TypeParticleCard[TypeParticleCard.SPADE = 3] = "SPADE";
})(TypeParticleCard = moduleExports.TypeParticleCard || (moduleExports.TypeParticleCard = {}));
var ParticleCaoRua = function(_super) {
  function ParticleCaoRua() {
    var _this = null !== _super && _super.apply(this, arguments) || this;
    _this.particleCardPrefab = null;
    _this.parentParticle = null;
    _this.listSpriteFrameParticle = [];
    return _this;
  }
  __extends(ParticleCaoRua, _super);
  ParticleCaoRua.prototype.start = function() {};
  ParticleCaoRua.prototype.PlayParticle = function(cardSuit) {
    var particleSystem = cc.instantiate(this.particleCardPrefab).getComponent(cc.ParticleSystem);
    switch (cardSuit) {
      case TypeParticleCard.HEART:
        particleSystem.spriteFrame = this.listSpriteFrameParticle[0];
        particleSystem.startColor = cc.color(255, 48, 48, 183);
        particleSystem.endColor = cc.color(255, 48, 48, 156);
        break;
      case TypeParticleCard.DIAMOND:
        particleSystem.spriteFrame = this.listSpriteFrameParticle[1];
        particleSystem.startColor = cc.color(255, 48, 48, 183);
        particleSystem.endColor = cc.color(255, 48, 48, 156);
        break;
      case TypeParticleCard.CLUB:
        particleSystem.spriteFrame = this.listSpriteFrameParticle[2];
        particleSystem.startColor = cc.color(0, 0, 0, 183);
        particleSystem.endColor = cc.color(0, 0, 0, 156);
        break;
      case TypeParticleCard.SPADE:
        particleSystem.spriteFrame = this.listSpriteFrameParticle[3];
        particleSystem.startColor = cc.color(0, 0, 0, 183);
        particleSystem.endColor = cc.color(0, 0, 0, 156);
        break;
      default:
        particleSystem.spriteFrame = this.listSpriteFrameParticle[0];
    }
    particleSystem.node.parent = this.parentParticle;
  };
  __decorate([property(cc.Prefab)], ParticleCaoRua.prototype, "particleCardPrefab", void 0);
  __decorate([property(cc.Node)], ParticleCaoRua.prototype, "parentParticle", void 0);
  __decorate([property(cc.SpriteFrame)], ParticleCaoRua.prototype, "listSpriteFrameParticle", void 0);
  return ParticleCaoRua = __decorate([ccclass], ParticleCaoRua);
}(cc.Component);
moduleExports.default = ParticleCaoRua;
void 0;
