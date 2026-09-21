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
var ChatItem = require("./ChatItem"),
  CardGameCommonRequest = require("./CardGameCommonRequest"),
  StringUtil = require("./StringUtil"),
  MusicPlayer = require("./MusicPlayer"),
  GameConfigManager = require("./GameConfigManager"),
  GamePlayManager = require("./GamePlayManager"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  TabIdolLiveController = require("./TabIdolLiveController"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  colorChatSystem = (new cc.Color(61, 253, 255, 255), new cc.Color(235, 118, 0, 255), new cc.Color(255, 45, 45, 255)),
  ChatInGamePopup = function(_super) {
    function ChatInGamePopup() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.chatItemPrefab = null;
      _this.contentNode = null;
      _this.contentEmoNode = null;
      _this.contentChatNode = null;
      _this.listItemChat = [];
      _this.editBoxCustomChat = null;
      _this.btnChatEmo = null;
      _this.btnChatText = null;
      _this.tabIdolLiveController = null;
      _this.bonusWebMobileSafari = -40;
      _this.activeBlur = false;
      _this.gameController = null;
      _this.onCloseCallback = function() {};
      return _this;
    }
    __extends(ChatInGamePopup, _super);
    ChatInGamePopup.prototype.loadData = function(defaultChatList, oldChatList) {
      if (void 0 === oldChatList) {
        oldChatList = [];
      }
      for (var index = this.listItemChat.length; index < defaultChatList.length + oldChatList.length; ++index) {
        var itemNode = cc.instantiate(this.chatItemPrefab);
        itemNode.parent = this.contentNode;
        (chatItem = itemNode.getComponent(ChatItem.default)).init(this);
        this.listItemChat.push(chatItem);
      }
      for (index = 0; index < oldChatList.length; ++index) {
        if (!(chatItem = this.listItemChat[index]).node.active) {
          chatItem.node.active = true;
        }
        chatItem.setText(oldChatList[index]);
        chatItem.setIsOldChat(true);
      }
      for (index = oldChatList.length; index < oldChatList.length + defaultChatList.length; ++index) {
        if (!(chatItem = this.listItemChat[index]).node.active) {
          chatItem.node.active = true;
        }
        chatItem.setText(defaultChatList[index - oldChatList.length]);
        chatItem.setIsOldChat(false);
      }
      for (index = oldChatList.length + defaultChatList.length; index < this.listItemChat.length; ++index) {
        var chatItem;
        (chatItem = this.listItemChat[index]).node.active = false;
      }
    };
    ChatInGamePopup.prototype.show = function(allowFocus) {
      var self = this;
      if (void 0 === allowFocus && (allowFocus = true), !(this.node.getNumberOfRunningActions() > 0)) {
        var posY = 0;
        if (GamePlayManager.default.getInstance().isWebMobileSafari()) {
          posY = this.bonusWebMobileSafari;
        }
        this.node.position = new cc.Vec2(this.node.parent.width / 2 + this.node.width / 2, posY);
        this.node.runAction(cc.sequence(cc.moveTo(.5, new cc.Vec2(this.node.parent.width / 2 - this.node.width / 2, this.node.position.y))
          .easing(cc.easeExponentialOut()), cc.callFunc(function() {
            if (cc.sys.platform === cc.sys.DESKTOP_BROWSER && allowFocus) {
              self.editBoxCustomChat.focus();
            }
          })));
        if (GamePlayManager.default.getInstance().isEmoChat && false === this.contentEmoNode.active || false === GamePlayManager.default.getInstance().isEmoChat &&
          true === this.contentEmoNode.active) {
          this.onCLickOpenEmo();
        }
      }
    };
    ChatInGamePopup.prototype.blurEdibox = function() {
      this.activeBlur = true;
      this.editBoxCustomChat.blur();
    };
    ChatInGamePopup.prototype.hide = function() {
      this.onCloseCallback();
      this.node.position = new cc.Vec2(this.node.parent.width / 2 + this.node.width / 2, this.node.position.y);
      this.node.active = false;
      this.activeBlur = false;
    };
    ChatInGamePopup.prototype.onEditText = function() {
      this.editBoxCustomChat.focus();
    };
    ChatInGamePopup.prototype.onClickHide = function() {
      var self = this;
      MusicPlayer.default.getInstance().playbtnClick(.5);
      if (!(this.node.getNumberOfRunningActions() > 0)) {
        this.onCloseCallback();
        this.node.runAction(cc.sequence(cc.moveTo(.5, new cc.Vec2(this.node.parent.width / 2 + this.node.width / 2, this.node.position.y))
          .easing(cc.easeExponentialOut()), cc.callFunc(function() {
            self.node.active = false;
          })));
      }
    };
    ChatInGamePopup.prototype.onClickShowInputField = function() {
      MusicPlayer.default.getInstance().playbtnClick(.6);
      var chatText = this.editBoxCustomChat.string;
      if (!StringUtil.default.isNullOrEmpty(chatText)) {
        this.sendChat(chatText);
        GameConfigManager.default.getInstance().setOldChat(chatText);
        this.editBoxCustomChat.string = "";
      }
    };
    ChatInGamePopup.prototype.sendChat = function(text) {
      if (GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.BAU_CUA && GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.XOCDIA) {
        this.onClickHide();
      } else if (cc.sys.platform === cc.sys.DESKTOP_BROWSER && this.scheduleOnce(function() {
          if (null !== this.node && void 0 !== this.node && 0 === this.node.getNumberOfRunningActions() && null !== this
            .editBoxCustomChat && void 0 !== this.editBoxCustomChat) {
            this.editBoxCustomChat.focus();
          }
        }, .2), null !== this.gameController && void 0 !== this.gameController) {
        var spamWarning = this.gameController.checkSpamChat(text);
        if (!StringUtil.default.isNullOrEmpty(spamWarning)) {
          return void(null != this.gameController.cardGameTableController && this.gameController.cardGameTableController.loadChat(spamWarning, "",
            true, -1, colorChatSystem, colorChatSystem));
        }
      }
      CardGameCommonRequest.default.getInstance().sendChat(text);
      GamePlayManager.default.getInstance().lastChatTime = new Date().getTime();
      GamePlayManager.default.getInstance().numChatInGame++;
      var elapsedMs = GamePlayManager.default.getInstance().lastChatTime - GamePlayManager.default.getInstance().lastChatTime1Minute;
      if (elapsedMs >= 6e4) {
        GamePlayManager.default.getInstance().numChatInGame = 0;
        GamePlayManager.default.getInstance().lastChatTime1Minute = GamePlayManager.default.getInstance().lastChatTime;
      } else {
        if (GamePlayManager.default.getInstance().numChatInGame >= 8) {
          GamePlayManager.default.getInstance().lockChatInTime = GamePlayManager.default.getInstance().lastChatTime + 6e4 - elapsedMs;
          GamePlayManager.default.getInstance().numChatInGame = 0;
          GamePlayManager.default.getInstance().lastChatTime1Minute = GamePlayManager.default.getInstance().lastChatTime;
        }
      }
      GamePlayManager.default.getInstance().countMatchNotInteract = 0;
    };
    ChatInGamePopup.prototype.onEditBoxReturn = function() {
      if (this.activeBlur) {
        this.activeBlur = false;
      } else {
        this.onClickShowInputField();
      }
    };
    ChatInGamePopup.prototype.onClickEditChat = function() {
      MusicPlayer.default.getInstance().playbtnClick();
    };
    ChatInGamePopup.prototype.ontextChanged = function(text, editbox, customEventData) {};
    ChatInGamePopup.prototype.onCLickOpenEmo = function() {
      if (this.contentEmoNode.active) {
        this.contentEmoNode.active = false;
        this.contentNode.active = true;
        this.btnChatEmo.active = true;
        this.btnChatText.active = false;
        if (this.contentChatNode) {
          this.contentChatNode.active = true;
        }
        GamePlayManager.default.getInstance().isEmoChat = false;
      } else {
        this.contentEmoNode.active = true;
        this.contentNode.active = false;
        this.btnChatEmo.active = false;
        this.btnChatText.active = true;
        if (this.contentChatNode) {
          this.contentChatNode.active = false;
        }
        GamePlayManager.default.getInstance().isEmoChat = true;
      }
    };
    ChatInGamePopup.prototype.setTrackingGameID = function(gameID) {
      if (this.tabIdolLiveController) {
        this.tabIdolLiveController.setTrackingGameID(gameID);
      }
    };
    __decorate([property(cc.Prefab)], ChatInGamePopup.prototype, "chatItemPrefab", void 0);
    __decorate([property(cc.Node)], ChatInGamePopup.prototype, "contentNode", void 0);
    __decorate([property(cc.Node)], ChatInGamePopup.prototype, "contentEmoNode", void 0);
    __decorate([property(cc.Node)], ChatInGamePopup.prototype, "contentChatNode", void 0);
    __decorate([property(cc.EditBox)], ChatInGamePopup.prototype, "editBoxCustomChat", void 0);
    __decorate([property(cc.Node)], ChatInGamePopup.prototype, "btnChatEmo", void 0);
    __decorate([property(cc.Node)], ChatInGamePopup.prototype, "btnChatText", void 0);
    __decorate([property(TabIdolLiveController.default)], ChatInGamePopup.prototype, "tabIdolLiveController", void 0);
    __decorate([property], ChatInGamePopup.prototype, "bonusWebMobileSafari", void 0);
    return ChatInGamePopup = __decorate([ccclass], ChatInGamePopup);
  }(cc.Component);
moduleExports.default = ChatInGamePopup;
void 0;
