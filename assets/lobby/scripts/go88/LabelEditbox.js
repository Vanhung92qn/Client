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
var a = t("./GameConfigManager"),
  s = t("./EditBoxCustom"),
  r = cc._decorator,
  c = r.ccclass,
  l = r.property,
  h = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.isAllowRotate = false;
      e.fontOnRotate = 20;
      e.offsetXOnRotate = 25;
      e.offsetYOnRotate = 0;
      e.originalFontSize = 0;
      e.isForceNoScrollStart = false;
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {
      this.originalFontSize = this.editBox.fontSize;
      this.init();
      if (!(a.default.getInstance().misc.isForceNoAdjustEditBox || false) && this.checkWebMobile()) {
        this.isForceNoScrollStart = this.isForceNoScroll = true;
      }
      this.setScreenType();
      this.setActiveOffsetEdb(this.getScreenType());
      this.maxLength = this.editBox.maxLength;
    };
    e.prototype.setActiveOffsetEdb = function(t) {
      if (this.isAllowRotate && this.isForceNoScroll && this.editBox && this.checkWebMobile()) {
        var e = this.editBox._impl;
        if (e) {
          if (t == s.ScreenType.Portrait) {
            e.offsetXXX = this.offsetXOnRotate;
            e.offsetYYY = this.offsetYOnRotate;
            e.xxforceUpdate = true;
            e._elem.style.fontSize = this.fontOnRotate + "px";
          } else {
            e.offsetXXX = 0;
            e.offsetYYY = 0;
            e.xxforceUpdate = true;
            e._elem.style.fontSize = this.originalFontSize + "px";
          }
        }
      }
    };
    e.prototype.onChangeText = function() {
      t.prototype.onChangeText.call(this);
      if (cc.sys.isNative) {
        this.Newlabel.string = "";
        this.needShow = false;
        this.countTime = 0;
      }
    };
    e.prototype.onAddChar = function() {
      t.prototype.onAddChar.call(this);
      if (cc.sys.isNative) {
        this.Newlabel.string = "";
        this.needShow = false;
        this.countTime = 0;
      }
    };
    e.prototype.onEndText = function() {
      t.prototype.onEndText.call(this);
      if (cc.sys.isNative) {
        this.Newlabel.string = "";
        this.needShow = false;
        this.countTime = 0;
      }
    };
    e.prototype.setScreenType = function() {
      this.screenType = this.getScreenType();
      if (this.screenType == s.ScreenType.Landscape) {
        this.isForceNoScroll = this.isForceNoScrollStart;
      } else {
        this.isForceNoScroll = false;
      }
      this.setBlur();
      if (!this.isForceNoScroll) {
        cc.view.resizeWithBrowserSize(true);
      }
    };
    o([l], e.prototype, "isAllowRotate", void 0);
    o([l], e.prototype, "fontOnRotate", void 0);
    o([l], e.prototype, "offsetXOnRotate", void 0);
    o([l], e.prototype, "offsetYOnRotate", void 0);
    return e = o([c], e);
  }(s.default);
i.default = h;
void 0;
