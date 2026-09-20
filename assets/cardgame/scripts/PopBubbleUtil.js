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
      e._removeAfterClosing = true;
      e._popOutScale = 1;
      e._popInScale = 0;
      e._tabletScale = 1;
      e._popOutScaleX = -1;
      e._popInScaleX = -1;
      e._popOutScaleY = -1;
      e._popInScaleY = -1;
      e._isPopping = false;
      e._startPoppingScaleX = 0;
      e._startPoppingScaleY = 0;
      e.leftPos = cc.Vec2.ZERO;
      e.rightPos = cc.Vec2.ZERO;
      e.finishPoppingOutCallBack = void 0;
      e._onFinishPoppingInCallback = function(t) {};
      e._onFinishPoppingOutCallback = function(t) {
        if (void 0 != this.finishPoppingOutCallBack) {
          this.finishPoppingOutCallBack();
        }
      };
      e.bg = null;
      e.label = null;
      e.chatICon = null;
      return e;
    }
    n(e, t);
    e.prototype.popOut = function() {
      var t = this;
      if (!this._isPopping) {
        var e, i;
        this._startPoppingScaleX = this.node.scaleX;
        this._startPoppingScaleY = this.node.scaleY;
        e = -1 === this._popOutScaleX ? this._popOutScale : this._popOutScaleX;
        i = -1 == this._popOutScaleY ? this._popOutScale : this._popOutScaleY;
        e *= this._tabletScale;
        i *= this._tabletScale;
        var n = 0,
          o = 0;
        if (this._startPoppingScaleX !== e) {
          n = .1 * e;
        }
        if (this._startPoppingScaleY !== i) {
          o = .1 * i;
        }
        if (this._startPoppingScaleX == this._startPoppingScaleY) {
          n = .1 * e;
          o = .1 * i;
        }
        this._isPopping = true;
        var a = cc.sequence(cc.scaleTo(.2, e, i), cc.scaleTo(.1, e - n, i - o), cc.scaleTo(.1, e, i), cc.callFunc(function() {
          t._isPopping = false;
          t._onFinishPoppingOutCallback(t);
        }));
        this.node.runAction(a);
      }
    };
    e.prototype.popIn = function(t) {
      var e = this;
      if (void 0 === t && (t = true), !this._isPopping) {
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
        var i = this._popInScaleX,
          n = this._popInScaleY;
        if (i *= this._tabletScale, n *= this._tabletScale, !t) {
          this.node.scaleX = i;
          this.node.scaleY = n;
          this._onFinishPoppingInCallback(this);
          this._removeAfterClosing;
          return void(this._isPopping = false);
        }
        this.setCascadeOpacityForAllNodesIn(this.node);
        var o = this.node.opacity;
        this._isPopping = true;
        var a = cc.sequence(cc.scaleTo(.2, i, n), cc.callFunc(function() {
          e._isPopping = false;
          e._onFinishPoppingInCallback(e);
          e._removeAfterClosing;
          e.node.active = false;
        }));
        this.node.runAction(a);
        this.node.runAction(cc.sequence(cc.fadeOut(.21), cc.callFunc(function() {
          e.node.opacity = o;
        })));
      }
    };
    e.prototype.setCascadeOpacityForAllNodesIn = function(t) {};
    e.prototype.stopAllActions = function() {
      this.node.stopAllActions();
      this._isPopping = false;
    };
    e.prototype.showBubbleReverse = function(t) {
      if (t) {
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
    e.prototype.initPos = function(t, e) {
      this.rightPos = t;
      this.leftPos = e;
    };
    o([r(cc.Node)], e.prototype, "bg", void 0);
    o([r(cc.Label)], e.prototype, "label", void 0);
    o([r(cc.Node)], e.prototype, "chatICon", void 0);
    return e = o([s], e);
  }(cc.Component);
i.default = c;
void 0;
