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
var a,
  s = require("./GameConfigManager"),
  r = cc._decorator,
  c = r.ccclass,
  l = r.property;
(function(t) {
  t[t.Landscape = 0] = "Landscape";
  t[t.Portrait = 1] = "Portrait";
})(a = i.ScreenType || (i.ScreenType = {}));
var h = function(t) {
  function e() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.isWebMobile = false;
    e.isPassWord = false;
    e.Newlabel = null;
    e.Oldlabel = null;
    e.editBox = null;
    e.placeHolder = null;
    e.placeHolderOpacity = 120;
    e.isForceNoScroll = false;
    e.countTime = 0;
    e.needShow = false;
    e.currentText = "";
    e.preText = "";
    e.isPlaying = false;
    e.screenType = a.Landscape;
    e.maxLength = 10;
    return e;
  }
  n(e, t);
  e.prototype.onLoad = function() {
    this.init();
    if (!(s.default.getInstance().misc.isForceNoAdjustEditBox || false) && this.checkWebMobile()) {
      this.isForceNoScroll = true;
    }
    this.setBlur();
    this.setActiveOffsetEdb(this.getScreenType());
    this.maxLength = this.editBox.maxLength;
  };
  e.prototype.init = function() {
    if (null == this.Oldlabel) {
      var t = this.editBox.node.getChildByName("TEXT_LABEL");
      if (!t) {
        var e = this.editBox.getComponentsInChildren(cc.Label);
        if (e.length > 0 && (t = e[0].node).name.includes("PLACE") && e.length > 1) {
          t = e[1].node;
        }
      }
      this.Oldlabel = t.getComponent(cc.Label);
    }
    if (null == this.placeHolder) {
      var i = this.editBox.node.getChildByName("PLACE");
      if (!i) {
        this.placeHolder = i;
      }
    }
  };
  e.prototype.start = function() {
    this.preText = this.editBox.string;
    this.currentText = this.getStringEdit();
    this.onAddChar();
    if (this.checkWebMobile()) {
      this.setOpacity(this.isForceNoScroll ? 255 : 0);
    }
  };
  e.prototype.setString = function() {
    this.currentText = this.getStringEdit();
    this.onAddChar();
  };
  e.prototype.resetString = function() {
    this.editBox.string = this.currentText = this.preText = this.Newlabel.string = "";
  };
  e.prototype.onChange = function() {
    this.onChangeText();
  };
  e.prototype.onChangeText = function() {
    this.preText = this.editBox.string;
    this.countTime = 0;
    this.currentText = this.getStringEdit();
    this.onAddChar();
    this.moveUp(false);
  };
  e.prototype.onAddChar = function() {
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
  e.prototype.onBegan = function() {
    this.onBeginText();
  };
  e.prototype.onBeginText = function() {
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
  e.prototype.onEnd = function() {
    this.onEndText();
  };
  e.prototype.onEndText = function() {
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
  e.prototype.update = function(t) {
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
        this.countTime += t;
        if (this.countTime > .4) {
          this.countTime -= .4;
          this.onAddChar();
          this.needShow = !this.needShow;
        }
      }
    }
  };
  e.prototype.resetValueEditBox = function() {
    if (this.isForceNoScroll && this.checkWebMobile()) {
      this.editBox.maxLength = this.maxLength;
      this.editBox.string = this.preText;
    }
  };
  e.prototype.setValueEditBox = function() {
    if (this.isForceNoScroll && this.checkWebMobile()) {
      this.editBox.maxLength = this.maxLength + 3;
      this.editBox.string = this.currentText;
    }
  };
  e.prototype.checkWebMobile = function() {
    return cc.sys.isBrowser && cc.sys.isMobile;
  };
  e.prototype.getScreenType = function() {
    return 90 === window.orientation || -90 === window.orientation ? 0 : 1;
  };
  e.prototype.moveUp = function(t) {
    if (!this.isForceNoScroll && this.editBox && this.checkWebMobile() && this.getScreenType() != a.Portrait) {
      var e = this.editBox.node.y;
      if (0 === e) {
        e = this.editBox.node.parent.y;
      }
      var i = window.innerHeight,
        n = i - (cc.view.getDesignResolutionSize().height / 2 + this.editBox.node.height / 2 + e + 50) * i / cc.view
        .getDesignResolutionSize().height;
      if (n < 0) {
        n = 0;
      }
      if (t) {
        window.scrollTo(0, n);
      } else {
        window.moveTo(0, n);
      }
    }
  };
  e.prototype.moveDown = function() {
    if (this.checkWebMobile()) {
      window.scrollTo(0, 0);
    }
  };
  e.prototype.setOpacity = function(t) {
    if (this.Oldlabel) {
      var e = this.Oldlabel.node;
      if (e.opacity !== t) {
        e.opacity = t;
      }
    }
    if (this.checkWebMobile()) {
      if (this.Newlabel) {
        var i = this.Newlabel,
          n = 255 - t;
        if (i.node.opacity !== n) {
          i.node.opacity = n;
        }
      }
      if (!cc.sys.isNative) {
        var o = this.editBox._impl;
        if (o && o._elem.style.opacity !== t) {
          o._elem.style.opacity = t;
        }
      }
    }
  };
  e.prototype.setScreenType = function() {
    this.screenType = this.getScreenType();
    this.setBlur();
    if (!this.isForceNoScroll) {
      cc.view.resizeWithBrowserSize(true);
    }
  };
  e.prototype.setBlur = function() {
    if (this.checkWebMobile()) {
      if (!(this.isForceNoScroll && this.checkWebMobile())) {
        this.editBox.blur();
      }
    }
  };
  e.prototype.getStringEdit = function() {
    var t = this.editBox.string;
    if (this.isPassWord) {
      t = "";
      for (var e = 0; e < this.editBox.string.length; e++) {
        t += "*";
      }
    }
    return t;
  };
  e.prototype.setActiveOffsetEdb = function(t) {};
  o([l(cc.Boolean)], e.prototype, "isWebMobile", void 0);
  o([l(cc.Boolean)], e.prototype, "isPassWord", void 0);
  o([l(cc.Label)], e.prototype, "Newlabel", void 0);
  o([l(cc.Label)], e.prototype, "Oldlabel", void 0);
  o([l(cc.EditBox)], e.prototype, "editBox", void 0);
  o([l(cc.Node)], e.prototype, "placeHolder", void 0);
  o([l()], e.prototype, "placeHolderOpacity", void 0);
  return e = o([c], e);
}(cc.Component);
i.default = h;
void 0;
