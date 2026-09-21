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
var _decorator = cc._decorator,
  ccclass = _decorator.ccclass,
  property = _decorator.property,
  PopBubbleUtil = function(_super) {
    function PopBubbleUtil() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this._removeAfterClosing = true;
      _this._popOutScale = 1;
      _this._popInScale = 0;
      _this._tabletScale = 1;
      _this._popOutScaleX = -1;
      _this._popInScaleX = -1;
      _this._popOutScaleY = -1;
      _this._popInScaleY = -1;
      _this._isPopping = false;
      _this._startPoppingScaleX = 0;
      _this._startPoppingScaleY = 0;
      _this.leftPos = cc.Vec2.ZERO;
      _this.rightPos = cc.Vec2.ZERO;
      _this.finishPoppingOutCallBack = void 0;
      _this._onFinishPoppingInCallback = function(bubble) {};
      _this._onFinishPoppingOutCallback = function(bubble) {
        if (void 0 != this.finishPoppingOutCallBack) {
          this.finishPoppingOutCallBack();
        }
      };
      _this.bg = null;
      _this.label = null;
      _this.chatICon = null;
      return _this;
    }
    __extends(PopBubbleUtil, _super);
    PopBubbleUtil.prototype.popOut = function() {
      var _this = this;
      if (!this._isPopping) {
        var targetScaleX, targetScaleY;
        this._startPoppingScaleX = this.node.scaleX;
        this._startPoppingScaleY = this.node.scaleY;
        targetScaleX = -1 === this._popOutScaleX ? this._popOutScale : this._popOutScaleX;
        targetScaleY = -1 == this._popOutScaleY ? this._popOutScale : this._popOutScaleY;
        targetScaleX *= this._tabletScale;
        targetScaleY *= this._tabletScale;
        var dipScaleX = 0,
          dipScaleY = 0;
        if (this._startPoppingScaleX !== targetScaleX) {
          dipScaleX = .1 * targetScaleX;
        }
        if (this._startPoppingScaleY !== targetScaleY) {
          dipScaleY = .1 * targetScaleY;
        }
        if (this._startPoppingScaleX == this._startPoppingScaleY) {
          dipScaleX = .1 * targetScaleX;
          dipScaleY = .1 * targetScaleY;
        }
        this._isPopping = true;
        var popOutAction = cc.sequence(cc.scaleTo(.2, targetScaleX, targetScaleY), cc.scaleTo(.1, targetScaleX - dipScaleX, targetScaleY - dipScaleY), cc.scaleTo(.1, targetScaleX, targetScaleY), cc.callFunc(function() {
          _this._isPopping = false;
          _this._onFinishPoppingOutCallback(_this);
        }));
        this.node.runAction(popOutAction);
      }
    };
    PopBubbleUtil.prototype.popIn = function(isAnimated) {
      var _this = this;
      if (void 0 === isAnimated && (isAnimated = true), !this._isPopping) {
        if (-1 === this._popInScaleX) {
          this._popInScaleX = this._startPoppingScaleX;
        }
        if (-1 === this._popInScaleY) {
          this._popInScaleY = this._startPoppingScaleY;
        }
        if (0 != this._popInScale) {
          this._popInScaleX = this._popInScale;
          this._popInScaleY = this._popInScale;
        }
        var targetScaleX = this._popInScaleX,
          targetScaleY = this._popInScaleY;
        if (targetScaleX *= this._tabletScale, targetScaleY *= this._tabletScale, !isAnimated) {
          this.node.scaleX = targetScaleX;
          this.node.scaleY = targetScaleY;
          this._onFinishPoppingInCallback(this);
          this._removeAfterClosing;
          return void(this._isPopping = false);
        }
        this.setCascadeOpacityForAllNodesIn(this.node);
        var originalOpacity = this.node.opacity;
        this._isPopping = true;
        var popInAction = cc.sequence(cc.scaleTo(.2, targetScaleX, targetScaleY), cc.callFunc(function() {
          _this._isPopping = false;
          _this._onFinishPoppingInCallback(_this);
          _this._removeAfterClosing;
          _this.node.active = false;
        }));
        this.node.runAction(popInAction);
        this.node.runAction(cc.sequence(cc.fadeOut(.21), cc.callFunc(function() {
          _this.node.opacity = originalOpacity;
        })));
      }
    };
    PopBubbleUtil.prototype.setCascadeOpacityForAllNodesIn = function(rootNode) {};
    PopBubbleUtil.prototype.stopAllActions = function() {
      this.node.stopAllActions();
      this._isPopping = false;
    };
    PopBubbleUtil.prototype.showBubbleReverse = function(isReverse) {
      if (isReverse) {
        this.label.node.parent.setAnchorPoint(new cc.Vec2(1, .5));
        this.node.position = this.leftPos;
        this.chatICon.scaleX = -1;
        this.chatICon.position = new cc.Vec2(-15, this.chatICon.position.y);
      } else {
        this.label.node.parent.setAnchorPoint(new cc.Vec2(0, .5));
        this.node.position = this.rightPos;
        this.label.node.parent.anchorX = 0;
        this.chatICon.scaleX = 1;
        this.chatICon.position = new cc.Vec2(15, this.chatICon.position.y);
      }
    };
    PopBubbleUtil.prototype.initPos = function(rightPos, leftPos) {
      this.rightPos = rightPos;
      this.leftPos = leftPos;
    };
    __decorate([property(cc.Node)], PopBubbleUtil.prototype, "bg", void 0);
    __decorate([property(cc.Label)], PopBubbleUtil.prototype, "label", void 0);
    __decorate([property(cc.Node)], PopBubbleUtil.prototype, "chatICon", void 0);
    return PopBubbleUtil = __decorate([ccclass], PopBubbleUtil);
  }(cc.Component);
moduleExports.default = PopBubbleUtil;
void 0;
