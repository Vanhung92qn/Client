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
var a = require("./GameZOrder"),
  s = require("./GamePlayManager"),
  r = require("./CardGameCommonRequest"),
  c = cc._decorator,
  l = c.ccclass,
  h = c.property,
  u = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.lsStepsAppSPF = [];
      e.lsStepsWebPCSPF = [];
      e.stepSprite = null;
      e.handAnimation = null;
      e.currentStep = 0;
      e.isHiding = false;
      e.mauBinhController = null;
      e.isShowed = false;
      return e;
    }
    n(e, t);
    Object.defineProperty(e.prototype, "isWebDesktop", {
      get: function() {
        return cc.sys.platform == cc.sys.DESKTOP_BROWSER;
      },
      enumerable: true,
      configurable: true
    });
    e.prototype.showNextStep = function(t, e) {
      if (this.isWebDesktop) {
        this.handAnimation.setAnimation(0, t, true);
      } else {
        this.handAnimation.setAnimation(0, e, true);
      }
      r.default.getInstance().sendSettingRoom(s.default.getInstance().IsMauBinhUsingNewXepBai, false, false);
      s.default.getInstance().IsMauBinhFistTimeShowQuickGuide = false;
      if (this.currentStep >= this.lsStepsAppSPF.length) {
        this.hide();
      } else {
        this.stepSprite.spriteFrame = this.isWebDesktop ? this.lsStepsWebPCSPF[this.currentStep] : this.lsStepsAppSPF[this.currentStep];
        this.currentStep++;
      }
    };
    e.prototype.show = function(t) {
      if (void 0 === t) {
        t = null;
      }
      if (!this.isShowed) {
        this.isShowed = true;
        this.mauBinhController = t;
        this.node.active = true;
        this.node.opacity = 0;
        this.node.stopAllActions();
        this.node.runAction(cc.fadeTo(.15, 255));
        this.showNextStep("mouse_click", "hand_slide");
        this.handAnimation.node.setPosition(325, this.isWebDesktop ? -196 : -182);
        this.handAnimation.node.setParent(this.node.parent);
        this.handAnimation.node.zIndex = a.default.TOP_MOST;
      }
    };
    e.prototype.onClickSortBottomStep = function() {
      if (1 == this.currentStep) {
        this.showNextStep("mouse_click", "hand_doubletap");
        this.handAnimation.node.setPosition(this.getLastCardX(), -280);
      }
    };
    e.prototype.onClickCardStep = function() {
      if (2 == this.currentStep) {
        this.showNextStep("mouse hold and drag", "hand _hold_and_drag");
        this.handAnimation.node.setPosition(this.getLastCardX(), -280);
      }
    };
    e.prototype.onDragCardStep = function() {
      if (3 == this.currentStep) {
        this.showNextStep("mouse hold and drag", "hand_hold_and_drag");
        this.handAnimation.node.setPosition(this.getLastCardX(), -280);
      }
    };
    e.prototype.hide = function() {
      var t = this;
      if (!this.isHiding) {
        this.isHiding = true;
        this.node.stopAllActions();
        this.handAnimation.node.parent = this.node;
        this.node.runAction(cc.sequence(cc.fadeTo(.15, 0), cc.callFunc(function() {
          t.node.active = false;
        })));
      }
    };
    e.prototype.getLastCardX = function() {
      return this.mauBinhController._thisPlayerView.cards.filter(function(t) {
        return t.isInBottomMauBinh;
      }).reduce(function(t, e) {
        return e.node.position.x > t.node.position.x ? e : t;
      }).node.position.x + 30;
    };
    o([h([cc.SpriteFrame])], e.prototype, "lsStepsAppSPF", void 0);
    o([h([cc.SpriteFrame])], e.prototype, "lsStepsWebPCSPF", void 0);
    o([h(cc.Sprite)], e.prototype, "stepSprite", void 0);
    o([h(sp.Skeleton)], e.prototype, "handAnimation", void 0);
    return e = o([l], e);
  }(cc.Component);
i.default = u;
void 0;
