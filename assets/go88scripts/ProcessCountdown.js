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
      e.progressBar = null;
      e.lbCountdown = null;
      e.isRuning = false;
      e.countTime = 0;
      e.actionTIme = 0;
      e.percentTo = 0;
      e.percentStart = 0;
      e.percentCount = 0;
      return e;
    }
    n(e, t);
    e.prototype.setProgress = function(t) {
      if (null != this.progressBar) {
        this.progressBar.progress = t;
      }
    };
    e.prototype.SetProgressTo = function(t, e) {
      this.countTime = 0;
      this.actionTIme = t;
      this.percentTo = e;
      this.percentStart = this.progressBar.progress;
      this.percentCount = e - this.percentStart;
      this.lbCountdown.string = Math.round(this.actionTIme).toString();
      this.isRuning = true;
    };
    e.prototype.update = function(t) {
      if (this.isRuning) {
        this.countTime += t;
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
    e.prototype.StopProcess = function() {
      var t = this;
      this.isRuning = false;
      this.node.stopAllActions();
      this.node.runAction(cc.sequence(cc.scaleTo(.25, 0).easing(cc.easeBackIn()), cc.callFunc(function() {
        t.node.scale = 0;
        t.node.active = false;
      })));
    };
    o([r(cc.ProgressBar)], e.prototype, "progressBar", void 0);
    o([r(cc.Label)], e.prototype, "lbCountdown", void 0);
    return e = o([s], e);
  }(cc.Component);
i.default = c;
void 0;
