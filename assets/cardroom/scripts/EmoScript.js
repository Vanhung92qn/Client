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
  EmoScript = function(_super) {
    function EmoScript() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.skeleton = null;
      return _this;
    }
    __extends(EmoScript, _super);
    EmoScript.prototype.setAnim = function(animName) {
      var _this = this;
      this.node.active = true;
      this.skeleton.setAnimation(0, animName, true);
      this.node.stopAllActions();
      this.node.runAction(cc.sequence(cc.delayTime(5.3333333334), cc.callFunc(function() {
        _this.node.active = false;
      })));
    };
    EmoScript.prototype.hide = function() {
      this.node.stopAllActions();
      this.node.active = false;
    };
    __decorate([property(sp.Skeleton)], EmoScript.prototype, "skeleton", void 0);
    return EmoScript = __decorate([ccclass], EmoScript);
  }(cc.Component);
moduleExports.default = EmoScript;
void 0;
