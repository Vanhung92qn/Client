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
var ChatInGamePopup = require("./ChatInGamePopup"),
  GamePlayManager = require("./GamePlayManager"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  ChatEmoItem = function(_super) {
    function ChatEmoItem() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.chatInGamePopup = null;
      return _this;
    }
    __extends(ChatEmoItem, _super);
    ChatEmoItem.prototype.onClickThis = function(event, emoText) {
      this.chatInGamePopup.sendChat(emoText);
      GamePlayManager.default.getInstance().countMatchNotInteract = 0;
    };
    __decorate([property(ChatInGamePopup.default)], ChatEmoItem.prototype, "chatInGamePopup", void 0);
    return ChatEmoItem = __decorate([ccclass], ChatEmoItem);
  }(cc.Component);
moduleExports.default = ChatEmoItem;
void 0;
