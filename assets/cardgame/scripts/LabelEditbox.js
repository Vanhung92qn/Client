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
var GameConfigManager = require("GameConfigManager"),
  EditBoxCustom = require("EditBoxCustom"),
  _decorator = cc._decorator,
  ccclass = _decorator.ccclass,
  property = _decorator.property,
  LabelEditbox = function(_super) {
    function LabelEditbox() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.isAllowRotate = false;
      _this.fontOnRotate = 20;
      _this.offsetXOnRotate = 25;
      _this.offsetYOnRotate = 0;
      _this.originalFontSize = 0;
      _this.isForceNoScrollStart = false;
      return _this;
    }
    __extends(LabelEditbox, _super);
    LabelEditbox.prototype.onLoad = function() {
      this.originalFontSize = this.editBox.fontSize;
      this.init();
      if (!(GameConfigManager.default.getInstance().misc.isForceNoAdjustEditBox || false) && this.checkWebMobile()) {
        this.isForceNoScrollStart = this.isForceNoScroll = true;
      }
      this.setScreenType();
      this.setActiveOffsetEdb(this.getScreenType());
      this.maxLength = this.editBox.maxLength;
    };
    LabelEditbox.prototype.setActiveOffsetEdb = function(screenType) {
      if (this.isAllowRotate && this.isForceNoScroll && this.editBox && this.checkWebMobile()) {
        var editBoxImpl = this.editBox._impl;
        if (editBoxImpl) {
          if (screenType == EditBoxCustom.ScreenType.Portrait) {
            editBoxImpl.offsetXXX = this.offsetXOnRotate;
            editBoxImpl.offsetYYY = this.offsetYOnRotate;
            editBoxImpl.xxforceUpdate = true;
            editBoxImpl._elem.style.fontSize = this.fontOnRotate + "px";
          } else {
            editBoxImpl.offsetXXX = 0;
            editBoxImpl.offsetYYY = 0;
            editBoxImpl.xxforceUpdate = true;
            editBoxImpl._elem.style.fontSize = this.originalFontSize + "px";
          }
        }
      }
    };
    LabelEditbox.prototype.onChangeText = function() {
      _super.prototype.onChangeText.call(this);
      if (cc.sys.isNative) {
        this.Newlabel.string = "";
        this.needShow = false;
        this.countTime = 0;
      }
    };
    LabelEditbox.prototype.onAddChar = function() {
      _super.prototype.onAddChar.call(this);
      if (cc.sys.isNative) {
        this.Newlabel.string = "";
        this.needShow = false;
        this.countTime = 0;
      }
    };
    LabelEditbox.prototype.onEndText = function() {
      _super.prototype.onEndText.call(this);
      if (cc.sys.isNative) {
        this.Newlabel.string = "";
        this.needShow = false;
        this.countTime = 0;
      }
    };
    LabelEditbox.prototype.setScreenType = function() {
      this.screenType = this.getScreenType();
      if (this.screenType == EditBoxCustom.ScreenType.Landscape) {
        this.isForceNoScroll = this.isForceNoScrollStart;
      } else {
        this.isForceNoScroll = false;
      }
      this.setBlur();
      if (!this.isForceNoScroll) {
        cc.view.resizeWithBrowserSize(true);
      }
    };
    __decorate([property], LabelEditbox.prototype, "isAllowRotate", void 0);
    __decorate([property], LabelEditbox.prototype, "fontOnRotate", void 0);
    __decorate([property], LabelEditbox.prototype, "offsetXOnRotate", void 0);
    __decorate([property], LabelEditbox.prototype, "offsetYOnRotate", void 0);
    return LabelEditbox = __decorate([ccclass], LabelEditbox);
  }(EditBoxCustom.default);
moduleExports.default = LabelEditbox;
void 0;
