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
var GameConfigManager = require("./GameConfigManager"),
  StringUtil = require("./StringUtil"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  ActiveByRUQuery = function(_super) {
    function ActiveByRUQuery() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.targets = [];
      _this.includeThisNode = true;
      _this.activeStatusToApplyOnMatch = false;
      _this.runOnLoad = true;
      _this.runOnStart = false;
      _this.runOnEnable = true;
      _this.paramName = "ru";
      return _this;
    }
    __extends(ActiveByRUQuery, _super);
    ActiveByRUQuery.prototype.onLoad = function() {
      if (cc.sys.isBrowser) {
        this.refreshTargets();
        if (this.runOnLoad) {
          this.applyStatus();
        }
      } else {
        this.enabled = false;
      }
    };
    ActiveByRUQuery.prototype.start = function() {
      if (cc.sys.isBrowser) {
        if (this.runOnStart) {
          this.applyStatus();
        }
      } else {
        this.enabled = false;
      }
    };
    ActiveByRUQuery.prototype.onEnable = function() {
      if (cc.sys.isBrowser) {
        if (this.runOnEnable) {
          this.applyStatus();
        }
      } else {
        this.enabled = false;
      }
    };
    ActiveByRUQuery.prototype.refreshTargets = function() {
      if (!this.targets) {
        this.targets = [];
      }
      if (this.includeThisNode && 0 == this.targets.includes(this.node)) {
        this.targets.push(this.node);
      }
    };
    ActiveByRUQuery.prototype._isQueryMatched = function() {
      try {
        var queryValue = StringUtil.default.getQueryStringValue(this.paramName);
        return !StringUtil.default.isNullOrEmpty(queryValue);
      } catch (error) {
        console.log("Can't get query matched:" + error);
        return false;
      }
    };
    ActiveByRUQuery.prototype.applyStatus = function() {
      if (cc.sys.isBrowser && GameConfigManager.default.getInstance().isWebCC()) {
        if (this.targets && this.targets.length && !this._isQueryMatched()) {
          for (var index = 0; index < this.targets.length; index++) {
            if (this.targets[index] && this.targets[index].isValid) {
              cc.warn("Setting node " + this.targets[index].name + " to " + this.activeStatusToApplyOnMatch);
              this.targets[index].active = this.activeStatusToApplyOnMatch;
            }
          }
        }
      } else {
        this.enabled = false;
      }
    };
    __decorate([property([cc.Node])], ActiveByRUQuery.prototype, "targets", void 0);
    __decorate([property], ActiveByRUQuery.prototype, "includeThisNode", void 0);
    __decorate([property], ActiveByRUQuery.prototype, "activeStatusToApplyOnMatch", void 0);
    __decorate([property], ActiveByRUQuery.prototype, "runOnLoad", void 0);
    __decorate([property], ActiveByRUQuery.prototype, "runOnStart", void 0);
    __decorate([property], ActiveByRUQuery.prototype, "runOnEnable", void 0);
    return ActiveByRUQuery = __decorate([ccclass], ActiveByRUQuery);
  }(cc.Component);
moduleExports.default = ActiveByRUQuery;
void 0;
