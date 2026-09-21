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
var GameConfigManager = require("./GameConfigManager"),
  StringUtil = require("./StringUtil"),
  r = cc._decorator,
  c = r.ccclass,
  l = r.property,
  h = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.targets = [];
      e.includeThisNode = true;
      e.activeStatusToApplyOnMatch = false;
      e.runOnLoad = true;
      e.runOnStart = false;
      e.runOnEnable = true;
      e.paramName = "ru";
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {
      if (cc.sys.isBrowser) {
        this.refreshTargets();
        if (this.runOnLoad) {
          this.applyStatus();
        }
      } else {
        this.enabled = false;
      }
    };
    e.prototype.start = function() {
      if (cc.sys.isBrowser) {
        if (this.runOnStart) {
          this.applyStatus();
        }
      } else {
        this.enabled = false;
      }
    };
    e.prototype.onEnable = function() {
      if (cc.sys.isBrowser) {
        if (this.runOnEnable) {
          this.applyStatus();
        }
      } else {
        this.enabled = false;
      }
    };
    e.prototype.refreshTargets = function() {
      if (!this.targets) {
        this.targets = [];
      }
      if (this.includeThisNode && 0 == this.targets.includes(this.node)) {
        this.targets.push(this.node);
      }
    };
    e.prototype._isQueryMatched = function() {
      try {
        var t = StringUtil.default.getQueryStringValue(this.paramName);
        return !StringUtil.default.isNullOrEmpty(t);
      } catch (t) {
        console.log("Can't get query matched:" + t);
        return false;
      }
    };
    e.prototype.applyStatus = function() {
      if (cc.sys.isBrowser && GameConfigManager.default.getInstance().isWebCC()) {
        if (this.targets && this.targets.length && !this._isQueryMatched()) {
          for (var t = 0; t < this.targets.length; t++) {
            if (this.targets[t] && this.targets[t].isValid) {
              cc.warn("Setting node " + this.targets[t].name + " to " + this.activeStatusToApplyOnMatch);
              this.targets[t].active = this.activeStatusToApplyOnMatch;
            }
          }
        }
      } else {
        this.enabled = false;
      }
    };
    o([l([cc.Node])], e.prototype, "targets", void 0);
    o([l], e.prototype, "includeThisNode", void 0);
    o([l], e.prototype, "activeStatusToApplyOnMatch", void 0);
    o([l], e.prototype, "runOnLoad", void 0);
    o([l], e.prototype, "runOnStart", void 0);
    o([l], e.prototype, "runOnEnable", void 0);
    return e = o([c], e);
  }(cc.Component);
i.default = h;
void 0;
