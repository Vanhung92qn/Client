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
var CardPopupBase = require("CardPopupBase"),
  MusicPlayer = require("MusicPlayer"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  PopupHelpImage = function(_super) {
    function PopupHelpImage() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.listNodeImage = [];
      _this.nodeIntro = null;
      _this.listLbPageCurrent = [];
      _this.spriteButtonPre = [];
      _this.spriteButtonNex = [];
      _this.spriteFrameArrowEnable = null;
      _this.spriteFrameArrowDisable = null;
      _this.currentImage = 0;
      _this.callbackClose = null;
      _this.isActiveClose = false;
      return _this;
    }
    __extends(PopupHelpImage, _super);
    PopupHelpImage.prototype.start = function() {
      var _this = this;
      this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function() {
        _this.isActiveClose = true;
      })));
    };
    PopupHelpImage.prototype.onCloseClicked = function() {
      if (this.isActiveClose) {
        this.hide(this.callbackClose);
      }
    };
    PopupHelpImage.prototype.onClickBg = function() {};
    PopupHelpImage.prototype.onClickHideIntro = function() {
      this.hideIntro();
    };
    PopupHelpImage.prototype.setCustomData = function(customDataJson) {
      var customData = JSON.parse(customDataJson);
      if (customData.hasOwnProperty("hideIntroTxMd5") && this.hideIntro(), customData.hasOwnProperty("showTab")) {
        var tabIndex = Number(customData.showTab);
        this.currentImage = tabIndex;
        this.setPage();
      }
    };
    PopupHelpImage.prototype.hideIntro = function() {
      this.nodeIntro.active = false;
      this.listNodeImage[0].active = true;
    };
    PopupHelpImage.prototype.onClickNext = function() {
      if (null != MusicPlayer.default.getInstance()) {
        MusicPlayer.default.getInstance().playbtnClick();
      }
      if (!(this.popup.getNumberOfRunningActions() > 0)) {
        if (null !== this.listNodeImage && void 0 !== this.listNodeImage && this.listNodeImage.length > 1) {
          this.currentImage++;
          this.setPage();
        }
      }
    };
    PopupHelpImage.prototype.onClickPre = function() {
      if (null != MusicPlayer.default.getInstance()) {
        MusicPlayer.default.getInstance().playbtnClick();
      }
      if (!(this.popup.getNumberOfRunningActions() > 0)) {
        if (null !== this.listNodeImage && void 0 !== this.listNodeImage && this.listNodeImage.length > 1) {
          this.currentImage--;
          this.setPage();
        }
      }
    };
    PopupHelpImage.prototype.onClicComeTo0 = function() {
      if (null != MusicPlayer.default.getInstance()) {
        MusicPlayer.default.getInstance().playbtnClick();
      }
      if (!(this.popup.getNumberOfRunningActions() > 0)) {
        if (null !== this.listNodeImage && void 0 !== this.listNodeImage && this.listNodeImage.length > 1) {
          this.currentImage = 0;
          this.setPage();
        }
      }
    };
    PopupHelpImage.prototype.setPageCurrent = function(pageNumber) {
      this.currentImage = pageNumber - 1;
      this.setPage();
    };
    PopupHelpImage.prototype.setPage = function() {
      if (this.currentImage + 1 >= this.listNodeImage.length) {
        this.currentImage = this.listNodeImage.length - 1;
      }
      if (this.currentImage < 0) {
        this.currentImage = 0;
      }
      if (this.currentImage + 1 == 1) {
        this.setEnabledButtonPre(false);
        this.setEnabledButtonNext(true);
      } else {
        if (this.currentImage == this.listNodeImage.length - 1) {
          this.setEnabledButtonPre(true);
          this.setEnabledButtonNext(false);
        }
      }
      for (var labelIndex = 0; labelIndex < this.listLbPageCurrent.length; labelIndex++) {
        if (null != this.listLbPageCurrent[labelIndex]) {
          this.listLbPageCurrent[labelIndex].string = (this.currentImage + 1).toString();
        }
      }
      for (var imageIndex = 0; imageIndex < this.listNodeImage.length; ++imageIndex) {
        this.listNodeImage[imageIndex].active = this.currentImage === imageIndex;
        if (this.currentImage === imageIndex) {
          this.popup = this.listNodeImage[imageIndex];
        }
      }
    };
    PopupHelpImage.prototype.setEnabledButtonNext = function(enabled) {
      for (var spriteIndex = 0; spriteIndex < this.spriteButtonNex.length; spriteIndex++) {
        this.spriteButtonNex[spriteIndex].spriteFrame = enabled ? this.spriteFrameArrowEnable : this.spriteFrameArrowDisable;
      }
    };
    PopupHelpImage.prototype.setEnabledButtonPre = function(enabled) {
      for (var spriteIndex = 0; spriteIndex < this.spriteButtonPre.length; spriteIndex++) {
        this.spriteButtonPre[spriteIndex].spriteFrame = enabled ? this.spriteFrameArrowEnable : this.spriteFrameArrowDisable;
      }
    };
    PopupHelpImage.prototype.openURL = function(clickEvent, url) {
      cc.sys.openURL(url);
    };
    PopupHelpImage.prototype.onChangeTab1 = function() {
      if (null !== this.listNodeImage && void 0 !== this.listNodeImage && this.listNodeImage.length > 1) {
        this.listNodeImage[0].active = false;
        this.listNodeImage[1].active = true;
        this.popup = this.listNodeImage[1];
      }
    };
    PopupHelpImage.prototype.onChangeTab2 = function() {
      if (null !== this.listNodeImage && void 0 !== this.listNodeImage && this.listNodeImage.length > 1) {
        this.listNodeImage[0].active = true;
        this.listNodeImage[1].active = false;
        this.popup = this.listNodeImage[0];
      }
    };
    __decorate([property([cc.Node])], PopupHelpImage.prototype, "listNodeImage", void 0);
    __decorate([property(cc.Node)], PopupHelpImage.prototype, "nodeIntro", void 0);
    __decorate([property([cc.Label])], PopupHelpImage.prototype, "listLbPageCurrent", void 0);
    __decorate([property(cc.Sprite)], PopupHelpImage.prototype, "spriteButtonPre", void 0);
    __decorate([property(cc.Sprite)], PopupHelpImage.prototype, "spriteButtonNex", void 0);
    __decorate([property(cc.SpriteFrame)], PopupHelpImage.prototype, "spriteFrameArrowEnable", void 0);
    __decorate([property(cc.SpriteFrame)], PopupHelpImage.prototype, "spriteFrameArrowDisable", void 0);
    return PopupHelpImage = __decorate([ccclass], PopupHelpImage);
  }(CardPopupBase.default);
moduleExports.default = PopupHelpImage;
void 0;
