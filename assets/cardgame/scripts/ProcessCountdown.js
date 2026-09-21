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
var ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  ProcessCountdown = function(_super) {
    function ProcessCountdown() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.progressBar = null;
      _this.lbCountdown = null;
      _this.isRuning = false;
      _this.countTime = 0;
      _this.actionTIme = 0;
      _this.percentTo = 0;
      _this.percentStart = 0;
      _this.percentCount = 0;
      return _this;
    }
    __extends(ProcessCountdown, _super);
    ProcessCountdown.prototype.setProgress = function(progress) {
      if (null != this.progressBar) {
        this.progressBar.progress = progress;
      }
    };
    ProcessCountdown.prototype.SetProgressTo = function(duration, targetPercent) {
      this.countTime = 0;
      this.actionTIme = duration;
      this.percentTo = targetPercent;
      this.percentStart = this.progressBar.progress;
      this.percentCount = targetPercent - this.percentStart;
      this.lbCountdown.string = Math.round(this.actionTIme).toString();
      this.isRuning = true;
    };
    ProcessCountdown.prototype.update = function(deltaTime) {
      if (this.isRuning) {
        this.countTime += deltaTime;
        if (this.countTime > this.actionTIme) {
          this.countTime = this.actionTIme;
          this.isRuning = false;
          this.StopProcess();
        }
        if (null != this.progressBar) {
          this.progressBar.progress = this.percentStart + this.countTime / this.actionTIme * this.percentCount;
          this.lbCountdown.string = Math.round(this.actionTIme - this.countTime).toString();
        }
      }
    };
    ProcessCountdown.prototype.StopProcess = function() {
      var self = this;
      this.isRuning = false;
      this.node.stopAllActions();
      this.node.runAction(cc.sequence(cc.scaleTo(.25, 0).easing(cc.easeBackIn()), cc.callFunc(function() {
        self.node.scale = 0;
        self.node.active = false;
      })));
    };
    __decorate([property(cc.ProgressBar)], ProcessCountdown.prototype, "progressBar", void 0);
    __decorate([property(cc.Label)], ProcessCountdown.prototype, "lbCountdown", void 0);
    return ProcessCountdown = __decorate([ccclass], ProcessCountdown);
  }(cc.Component);
moduleExports.default = ProcessCountdown;
void 0;
