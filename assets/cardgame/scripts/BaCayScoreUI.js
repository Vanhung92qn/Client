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
var GameZOrder = require("./GameZOrder"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  BaCayScoreUI = function(_super) {
    function BaCayScoreUI() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.lbScore = null;
      _this.atlasScore = null;
      _this.animScrore = null;
      _this.animJQKHeart = null;
      _this.animSameScrore = null;
      _this.myScore = 0;
      _this.isSameScore = false;
      _this.fadeOutCallback = function(scoreUI) {};
      return _this;
    }
    __extends(BaCayScoreUI, _super);
    BaCayScoreUI.prototype.start = function() {
      this.node.zIndex = GameZOrder.default.SCORE_UI;
    };
    BaCayScoreUI.prototype.onDestroy = function() {};
    BaCayScoreUI.prototype.setScore = function(score, isSameScore) {
      if (void 0 === isSameScore) {
        isSameScore = false;
      }
      this.myScore = score;
      this.node.opacity = 0;
      this.animJQKHeart.node.active = false;
      this.animScrore.node.active = false;
      this.isSameScore = isSameScore;
      if (null != this.animSameScrore) {
        this.animSameScrore.node.active = false;
      }
    };
    BaCayScoreUI.prototype.fade = function(delay, duration, isMine, isSameScore, hasJqkHeart) {
      var self = this;
      if (void 0 === isMine) {
        isMine = false;
      }
      if (null != this.animSameScrore) {
        this.animSameScrore.node.active = false;
      }
      this.node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function() {
        if (hasJqkHeart) {
          self.animJQKHeart.node.active = true;
          self.animJQKHeart.setAnimation(0, "animation", false);
        } else {
          self.animScrore.node.active = true;
          self.animScrore.setAnimation(0, self.getNameAnimScore(self.myScore, isMine), false);
        }
      }), cc.delayTime(.15), cc.callFunc(function() {
        self.animSameScrore.node.active = isSameScore;
      }), cc.delayTime(duration + .15), cc.callFunc(this.onFadeOutEnd.bind(this))));
    };
    BaCayScoreUI.prototype.hide = function() {
      this.node.runAction(cc.sequence(cc.fadeOut(.4), cc.callFunc(function() {
        this.node.active = false;
        this.node.opacity = 255;
      }.bind(this))));
    };
    BaCayScoreUI.prototype.setFadeOutCallback = function(callback) {
      this.fadeOutCallback = callback;
    };
    BaCayScoreUI.prototype.onFadeOutEnd = function() {
      this.node.active = false;
      this.node.opacity = 255;
      if (null != this.fadeOutCallback) {
        this.fadeOutCallback(this);
      }
    };
    BaCayScoreUI.prototype.getNameAnimScore = function(score, isMine) {
      if (void 0 === isMine) {
        isMine = false;
      }
      return 0 == score ? "bu" : score > 0 && score <= 9 ? score + " diem" : 999 == score && 0 == isMine ? "3tay2" : 999 == score && isMine ? "3tay3" : void 0;
    };
    __decorate([property(cc.Label)], BaCayScoreUI.prototype, "lbScore", void 0);
    __decorate([property(cc.SpriteAtlas)], BaCayScoreUI.prototype, "atlasScore", void 0);
    __decorate([property(sp.Skeleton)], BaCayScoreUI.prototype, "animScrore", void 0);
    __decorate([property(sp.Skeleton)], BaCayScoreUI.prototype, "animJQKHeart", void 0);
    __decorate([property(sp.Skeleton)], BaCayScoreUI.prototype, "animSameScrore", void 0);
    return BaCayScoreUI = __decorate([ccclass], BaCayScoreUI);
  }(cc.Component);
moduleExports.default = BaCayScoreUI;
void 0;
