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
var ScreenType,
  GameConfigManager = require("./GameConfigManager"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property;
(function(ScreenType) {
  ScreenType[ScreenType.Landscape = 0] = "Landscape";
  ScreenType[ScreenType.Portrait = 1] = "Portrait";
})(ScreenType = moduleExports.ScreenType || (moduleExports.ScreenType = {}));
var EditBoxCustom = function(_super) {
  function EditBoxCustom() {
    var _this = null !== _super && _super.apply(this, arguments) || this;
    _this.isWebMobile = false;
    _this.isPassWord = false;
    _this.Newlabel = null;
    _this.Oldlabel = null;
    _this.editBox = null;
    _this.placeHolder = null;
    _this.placeHolderOpacity = 120;
    _this.isForceNoScroll = false;
    _this.countTime = 0;
    _this.needShow = false;
    _this.currentText = "";
    _this.preText = "";
    _this.isPlaying = false;
    _this.screenType = ScreenType.Landscape;
    _this.maxLength = 10;
    return _this;
  }
  __extends(EditBoxCustom, _super);
  EditBoxCustom.prototype.onLoad = function() {
    this.init();
    if (!(GameConfigManager.default.getInstance().misc.isForceNoAdjustEditBox || false) && this.checkWebMobile()) {
      this.isForceNoScroll = true;
    }
    this.setBlur();
    this.setActiveOffsetEdb(this.getScreenType());
    this.maxLength = this.editBox.maxLength;
  };
  EditBoxCustom.prototype.init = function() {
    if (null == this.Oldlabel) {
      var textLabelNode = this.editBox.node.getChildByName("TEXT_LABEL");
      if (!textLabelNode) {
        var labels = this.editBox.getComponentsInChildren(cc.Label);
        if (labels.length > 0 && (textLabelNode = labels[0].node).name.includes("PLACE") && labels.length > 1) {
          textLabelNode = labels[1].node;
        }
      }
      this.Oldlabel = textLabelNode.getComponent(cc.Label);
    }
    if (null == this.placeHolder) {
      var placeHolderNode = this.editBox.node.getChildByName("PLACE");
      if (!placeHolderNode) {
        this.placeHolder = placeHolderNode;
      }
    }
  };
  EditBoxCustom.prototype.start = function() {
    this.preText = this.editBox.string;
    this.currentText = this.getStringEdit();
    this.onAddChar();
    if (this.checkWebMobile()) {
      this.setOpacity(this.isForceNoScroll ? 255 : 0);
    }
  };
  EditBoxCustom.prototype.setString = function() {
    this.currentText = this.getStringEdit();
    this.onAddChar();
  };
  EditBoxCustom.prototype.resetString = function() {
    this.editBox.string = this.currentText = this.preText = this.Newlabel.string = "";
  };
  EditBoxCustom.prototype.onChange = function() {
    this.onChangeText();
  };
  EditBoxCustom.prototype.onChangeText = function() {
    this.preText = this.editBox.string;
    this.countTime = 0;
    this.currentText = this.getStringEdit();
    this.onAddChar();
    this.moveUp(false);
  };
  EditBoxCustom.prototype.onAddChar = function() {
    if (this.checkWebMobile() || cc.sys.isNative) {
      if (this.needShow) {
        if (this.Newlabel) {
          this.Newlabel.string = this.currentText + "|";
        }
      } else {
        if (this.Newlabel) {
          this.Newlabel.string = this.currentText;
        }
      }
    }
  };
  EditBoxCustom.prototype.onBegan = function() {
    this.onBeginText();
  };
  EditBoxCustom.prototype.onBeginText = function() {
    if (this.checkWebMobile()) {
      this.setOpacity(this.isForceNoScroll ? 255 : 0);
    }
    this.isPlaying = true;
    this.needShow = true;
    this.preText = this.editBox.string;
    this.onAddChar();
    if (cc.sys.isNative && this.placeHolder) {
      this.placeHolder.opacity = 0;
    }
    this.moveUp(true);
    this.setActiveOffsetEdb(this.getScreenType());
  };
  EditBoxCustom.prototype.onEnd = function() {
    this.onEndText();
  };
  EditBoxCustom.prototype.onEndText = function() {
    this.preText = this.editBox.string;
    if (this.checkWebMobile()) {
      this.setOpacity(0);
    }
    this.needShow = false;
    this.isPlaying = false;
    if (cc.sys.isNative && this.placeHolder) {
      this.placeHolder.opacity = this.placeHolderOpacity;
    }
    this.onAddChar();
    this.moveDown();
  };
  EditBoxCustom.prototype.update = function(dt) {
    if (this.checkWebMobile() && this.screenType != this.getScreenType()) {
      this.setScreenType();
    }
    if (this.preText != this.editBox.string) {
      this.onChange();
    }
    if (!(!this.isForceNoScroll && this.checkWebMobile())) {
      this.setOpacity(255);
    }
    if (this.isPlaying) {
      if (!(this.isForceNoScroll && !cc.sys.isNative)) {
        this.countTime += dt;
        if (this.countTime > .4) {
          this.countTime -= .4;
          this.onAddChar();
          this.needShow = !this.needShow;
        }
      }
    }
  };
  EditBoxCustom.prototype.resetValueEditBox = function() {
    if (this.isForceNoScroll && this.checkWebMobile()) {
      this.editBox.maxLength = this.maxLength;
      this.editBox.string = this.preText;
    }
  };
  EditBoxCustom.prototype.setValueEditBox = function() {
    if (this.isForceNoScroll && this.checkWebMobile()) {
      this.editBox.maxLength = this.maxLength + 3;
      this.editBox.string = this.currentText;
    }
  };
  EditBoxCustom.prototype.checkWebMobile = function() {
    return cc.sys.isBrowser && cc.sys.isMobile;
  };
  EditBoxCustom.prototype.getScreenType = function() {
    return 90 === window.orientation || -90 === window.orientation ? 0 : 1;
  };
  EditBoxCustom.prototype.moveUp = function(useScrollTo) {
    if (!this.isForceNoScroll && this.editBox && this.checkWebMobile() && this.getScreenType() != ScreenType.Portrait) {
      var editBoxY = this.editBox.node.y;
      if (0 === editBoxY) {
        editBoxY = this.editBox.node.parent.y;
      }
      var windowHeight = window.innerHeight,
        scrollY = windowHeight - (cc.view.getDesignResolutionSize().height / 2 + this.editBox.node.height / 2 + editBoxY + 50) * windowHeight / cc.view
        .getDesignResolutionSize().height;
      if (scrollY < 0) {
        scrollY = 0;
      }
      if (useScrollTo) {
        window.scrollTo(0, scrollY);
      } else {
        window.moveTo(0, scrollY);
      }
    }
  };
  EditBoxCustom.prototype.moveDown = function() {
    if (this.checkWebMobile()) {
      window.scrollTo(0, 0);
    }
  };
  EditBoxCustom.prototype.setOpacity = function(opacity) {
    if (this.Oldlabel) {
      var oldLabelNode = this.Oldlabel.node;
      if (oldLabelNode.opacity !== opacity) {
        oldLabelNode.opacity = opacity;
      }
    }
    if (this.checkWebMobile()) {
      if (this.Newlabel) {
        var newLabel = this.Newlabel,
          invertedOpacity = 255 - opacity;
        if (newLabel.node.opacity !== invertedOpacity) {
          newLabel.node.opacity = invertedOpacity;
        }
      }
      if (!cc.sys.isNative) {
        var editBoxImpl = this.editBox._impl;
        if (editBoxImpl && editBoxImpl._elem.style.opacity !== opacity) {
          editBoxImpl._elem.style.opacity = opacity;
        }
      }
    }
  };
  EditBoxCustom.prototype.setScreenType = function() {
    this.screenType = this.getScreenType();
    this.setBlur();
    if (!this.isForceNoScroll) {
      cc.view.resizeWithBrowserSize(true);
    }
  };
  EditBoxCustom.prototype.setBlur = function() {
    if (this.checkWebMobile()) {
      if (!(this.isForceNoScroll && this.checkWebMobile())) {
        this.editBox.blur();
      }
    }
  };
  EditBoxCustom.prototype.getStringEdit = function() {
    var text = this.editBox.string;
    if (this.isPassWord) {
      text = "";
      for (var index = 0; index < this.editBox.string.length; index++) {
        text += "*";
      }
    }
    return text;
  };
  EditBoxCustom.prototype.setActiveOffsetEdb = function(screenType) {};
  __decorate([property(cc.Boolean)], EditBoxCustom.prototype, "isWebMobile", void 0);
  __decorate([property(cc.Boolean)], EditBoxCustom.prototype, "isPassWord", void 0);
  __decorate([property(cc.Label)], EditBoxCustom.prototype, "Newlabel", void 0);
  __decorate([property(cc.Label)], EditBoxCustom.prototype, "Oldlabel", void 0);
  __decorate([property(cc.EditBox)], EditBoxCustom.prototype, "editBox", void 0);
  __decorate([property(cc.Node)], EditBoxCustom.prototype, "placeHolder", void 0);
  __decorate([property()], EditBoxCustom.prototype, "placeHolderOpacity", void 0);
  return EditBoxCustom = __decorate([ccclass], EditBoxCustom);
}(cc.Component);
moduleExports.default = EditBoxCustom;
void 0;
