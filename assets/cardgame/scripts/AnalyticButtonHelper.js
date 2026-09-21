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
var AnalyticDefine = require("./AnalyticDefine"),
  AnalyticService = require("./AnalyticService"),
  r = cc._decorator,
  c = r.ccclass,
  l = r.property,
  h = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.buttonTarget = null;
      e.isAutoGetLocalButton = true;
      e.isAutoAddTrackEventOnClick = true;
      e._isInit = false;
      e.cid = null;
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {
      this._init();
    };
    e.prototype.onEnable = function() {
      this._init();
    };
    e.prototype.onTargetButtonClicked = function(t, e) {
      AnalyticService.default.instance.trackCustomQ(AnalyticDefine.AnaltyciEventType.CLICK, this.cid);
    };
    e.prototype._getButton = function() {
      if (null == this.buttonTarget) {
        this.buttonTarget = this.node.getComponent(cc.Button);
      }
    };
    e.prototype._setClickEvent = function() {
      if (null != this.buttonTarget) {
        var t = new cc.Component.EventHandler();
        t.target = this.node;
        t.component = "AnalyticButtonHelper";
        t.handler = "onTargetButtonClicked";
        t.customEventData = "";
        this.buttonTarget.clickEvents.push(t);
      }
    };
    e.prototype._init = function(t) {
      if (void 0 === t) {
        t = false;
      }
      if (t) {
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
    o([l(cc.Button)], e.prototype, "buttonTarget", void 0);
    o([l], e.prototype, "isAutoGetLocalButton", void 0);
    o([l], e.prototype, "isAutoAddTrackEventOnClick", void 0);
    o([l], e.prototype, "cid", void 0);
    return e = o([c], e);
  }(cc.Component);
i.default = h;
void 0;
