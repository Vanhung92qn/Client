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
  ActionProgressTo = function(_super) {
    function ActionProgressTo() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.progressBar = null;
      _this.isRuning = false;
      _this.countTime = 0;
      _this.actionTIme = 0;
      _this.percentTo = 0;
      _this.percentStart = 0;
      _this.percentCount = 0;
      _this.nodeEffect = null;
      return _this;
    }
    __extends(ActionProgressTo, _super);
    ActionProgressTo.prototype.setProgress = function(progress) {
      if (null != this.progressBar) {
        this.progressBar.progress = progress;
      }
    };
    ActionProgressTo.prototype.RunActionProgress = function(duration, targetProgress) {
      this.countTime = 0;
      this.actionTIme = duration;
      this.percentTo = targetProgress;
      this.percentStart = this.progressBar.progress;
      this.percentCount = targetProgress - this.percentStart;
      this.isRuning = true;
    };
    ActionProgressTo.prototype.update = function(dt) {
      if (this.isRuning) {
        this.countTime += dt;
        if (this.countTime > this.actionTIme) {
          this.countTime = this.actionTIme;
          this.isRuning = false;
          if (null !== this.nodeEffect && void 0 !== this.nodeEffect) {
            this.nodeEffect.active = false;
          }
        }
        if (null != this.progressBar) {
          this.progressBar.progress = this.percentStart + this.countTime / this.actionTIme * this.percentCount;
        }
      }
    };
    ActionProgressTo.prototype.stopAllActions = function() {
      this.isRuning = false;
    };
    __decorate([property(cc.ProgressBar)], ActionProgressTo.prototype, "progressBar", void 0);
    __decorate([property(cc.Node)], ActionProgressTo.prototype, "nodeEffect", void 0);
    return ActionProgressTo = __decorate([ccclass], ActionProgressTo);
  }(cc.Component);
moduleExports.default = ActionProgressTo;
void 0;
