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
var AnalyticDefine = require("AnalyticDefine"),
  AnalyticService = require("AnalyticService"),
  _decorator = cc._decorator,
  ccclass = _decorator.ccclass,
  property = _decorator.property,
  AnalyticButtonHelper = function(_super) {
    function AnalyticButtonHelper() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.buttonTarget = null;
      _this.isAutoGetLocalButton = true;
      _this.isAutoAddTrackEventOnClick = true;
      _this._isInit = false;
      _this.cid = null;
      return _this;
    }
    __extends(AnalyticButtonHelper, _super);
    AnalyticButtonHelper.prototype.onLoad = function() {
      this._init();
    };
    AnalyticButtonHelper.prototype.onEnable = function() {
      this._init();
    };
    AnalyticButtonHelper.prototype.onTargetButtonClicked = function(event, customEventData) {
      AnalyticService.default.instance.trackCustomQ(AnalyticDefine.AnaltyciEventType.CLICK, this.cid);
    };
    AnalyticButtonHelper.prototype._getButton = function() {
      if (null == this.buttonTarget) {
        this.buttonTarget = this.node.getComponent(cc.Button);
      }
    };
    AnalyticButtonHelper.prototype._setClickEvent = function() {
      if (null != this.buttonTarget) {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "AnalyticButtonHelper";
        clickEventHandler.handler = "onTargetButtonClicked";
        clickEventHandler.customEventData = "";
        this.buttonTarget.clickEvents.push(clickEventHandler);
      }
    };
    AnalyticButtonHelper.prototype._init = function(forceReinit) {
      if (void 0 === forceReinit) {
        forceReinit = false;
      }
      if (forceReinit) {
        this._isInit = false;
      }
      if (!this._isInit) {
        if (this.isAutoGetLocalButton) {
          this._getButton();
        }
        if (this.isAutoAddTrackEventOnClick) {
          this._setClickEvent();
        }
        this._isInit = true;
      }
    };
    __decorate([property(cc.Button)], AnalyticButtonHelper.prototype, "buttonTarget", void 0);
    __decorate([property], AnalyticButtonHelper.prototype, "isAutoGetLocalButton", void 0);
    __decorate([property], AnalyticButtonHelper.prototype, "isAutoAddTrackEventOnClick", void 0);
    __decorate([property], AnalyticButtonHelper.prototype, "cid", void 0);
    return AnalyticButtonHelper = __decorate([ccclass], AnalyticButtonHelper);
  }(cc.Component);
moduleExports.default = AnalyticButtonHelper;
void 0;
