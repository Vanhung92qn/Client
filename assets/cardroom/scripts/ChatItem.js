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
var ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  ChatItem = function(_super) {
    function ChatItem() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.uiKitSpriteAtlas = null;
      _this.label = null;
      _this.chatInGamePopup = null;
      _this.bgImage = null;
      _this.currentText = "";
      return _this;
    }
    __extends(ChatItem, _super);
    ChatItem.prototype.init = function(chatInGamePopup) {
      this.chatInGamePopup = chatInGamePopup;
    };
    ChatItem.prototype.setText = function(text) {
      if (this.currentText = text, text.length > 23) {
        var truncatedText = text.substr(0, 23);
        if (0 === text.substr(22, 1).localeCompare(" ")) {
          truncatedText = text.substr(0, 22);
        }
        this.label.string = truncatedText + "...";
      } else {
        this.label.string = text;
      }
    };
    ChatItem.prototype.onClickThis = function() {
      this.chatInGamePopup.sendChat(this.currentText);
    };
    ChatItem.prototype.setIsOldChat = function(isOldChat) {
      if (void 0 !== this.uiKitSpriteAtlas && null !== this.uiKitSpriteAtlas) {
        this.bgImage.spriteFrame = isOldChat ? this.uiKitSpriteAtlas.getSpriteFrame("popupChat2") : this.uiKitSpriteAtlas.getSpriteFrame(
          "popupChat");
      }
    };
    __decorate([property(cc.SpriteAtlas)], ChatItem.prototype, "uiKitSpriteAtlas", void 0);
    __decorate([property(cc.Label)], ChatItem.prototype, "label", void 0);
    __decorate([property(cc.Sprite)], ChatItem.prototype, "bgImage", void 0);
    return ChatItem = __decorate([ccclass], ChatItem);
  }(cc.Component);
moduleExports.default = ChatItem;
void 0;
