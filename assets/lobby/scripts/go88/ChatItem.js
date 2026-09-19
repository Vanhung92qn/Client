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
      e.uiKitSpriteAtlas = null;
      e.label = null;
      e.chatInGamePopup = null;
      e.bgImage = null;
      e.currentText = "";
      return e;
    }
    n(e, t);
    e.prototype.init = function(t) {
      this.chatInGamePopup = t;
    };
    e.prototype.setText = function(t) {
      if (this.currentText = t, t.length > 23) {
        var e = t.substr(0, 23);
        if (0 === t.substr(22, 1).localeCompare(" ")) {
          e = t.substr(0, 22);
        }
        this.label.string = e + "...";
      } else {
        this.label.string = t;
      }
    };
    e.prototype.onClickThis = function() {
      this.chatInGamePopup.sendChat(this.currentText);
    };
    e.prototype.setIsOldChat = function(t) {
      if (void 0 !== this.uiKitSpriteAtlas && null !== this.uiKitSpriteAtlas) {
        this.bgImage.spriteFrame = t ? this.uiKitSpriteAtlas.getSpriteFrame("popupChat2") : this.uiKitSpriteAtlas.getSpriteFrame(
          "popupChat");
      }
    };
    o([r(cc.SpriteAtlas)], e.prototype, "uiKitSpriteAtlas", void 0);
    o([r(cc.Label)], e.prototype, "label", void 0);
    o([r(cc.Sprite)], e.prototype, "bgImage", void 0);
    return e = o([s], e);
  }(cc.Component);
i.default = c;
void 0;
