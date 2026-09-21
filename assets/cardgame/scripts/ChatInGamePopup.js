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
var ChatItem = require("./ChatItem"),
  CardGameCommonRequest = require("./CardGameCommonRequest"),
  StringUtil = require("./StringUtil"),
  MusicPlayer = require("./MusicPlayer"),
  GameConfigManager = require("./GameConfigManager"),
  GamePlayManager = require("./GamePlayManager"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  TabIdolLiveController = require("./TabIdolLiveController"),
  p = cc._decorator,
  f = p.ccclass,
  g = p.property,
  m = (new cc.Color(61, 253, 255, 255), new cc.Color(235, 118, 0, 255), new cc.Color(255, 45, 45, 255)),
  y = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.chatItemPrefab = null;
      e.contentNode = null;
      e.contentEmoNode = null;
      e.contentChatNode = null;
      e.listItemChat = [];
      e.editBoxCustomChat = null;
      e.btnChatEmo = null;
      e.btnChatText = null;
      e.tabIdolLiveController = null;
      e.bonusWebMobileSafari = -40;
      e.activeBlur = false;
      e.gameController = null;
      e.onCloseCallback = function() {};
      return e;
    }
    n(e, t);
    e.prototype.loadData = function(t, e) {
      if (void 0 === e) {
        e = [];
      }
      for (var i = this.listItemChat.length; i < t.length + e.length; ++i) {
        var n = cc.instantiate(this.chatItemPrefab);
        n.parent = this.contentNode;
        (o = n.getComponent(ChatItem.default)).init(this);
        this.listItemChat.push(o);
      }
      for (i = 0; i < e.length; ++i) {
        if (!(o = this.listItemChat[i]).node.active) {
          o.node.active = true;
        }
        o.setText(e[i]);
        o.setIsOldChat(true);
      }
      for (i = e.length; i < e.length + t.length; ++i) {
        if (!(o = this.listItemChat[i]).node.active) {
          o.node.active = true;
        }
        o.setText(t[i - e.length]);
        o.setIsOldChat(false);
      }
      for (i = e.length + t.length; i < this.listItemChat.length; ++i) {
        var o;
        (o = this.listItemChat[i]).node.active = false;
      }
    };
    e.prototype.show = function(t) {
      var e = this;
      if (void 0 === t && (t = true), !(this.node.getNumberOfRunningActions() > 0)) {
        var i = 0;
        if (GamePlayManager.default.getInstance().isWebMobileSafari()) {
          i = this.bonusWebMobileSafari;
        }
        this.node.position = new cc.Vec2(this.node.parent.width / 2 + this.node.width / 2, i);
        this.node.runAction(cc.sequence(cc.moveTo(.5, new cc.Vec2(this.node.parent.width / 2 - this.node.width / 2, this.node.position.y))
          .easing(cc.easeExponentialOut()), cc.callFunc(function() {
            if (cc.sys.platform === cc.sys.DESKTOP_BROWSER && t) {
              e.editBoxCustomChat.focus();
            }
          })));
        if (GamePlayManager.default.getInstance().isEmoChat && false === this.contentEmoNode.active || false === GamePlayManager.default.getInstance().isEmoChat &&
          true === this.contentEmoNode.active) {
          this.onCLickOpenEmo();
        }
      }
    };
    e.prototype.blurEdibox = function() {
      this.activeBlur = true;
      this.editBoxCustomChat.blur();
    };
    e.prototype.hide = function() {
      this.onCloseCallback();
      this.node.position = new cc.Vec2(this.node.parent.width / 2 + this.node.width / 2, this.node.position.y);
      this.node.active = false;
      this.activeBlur = false;
    };
    e.prototype.onEditText = function() {
      this.editBoxCustomChat.focus();
    };
    e.prototype.onClickHide = function() {
      var t = this;
      MusicPlayer.default.getInstance().playbtnClick(.5);
      if (!(this.node.getNumberOfRunningActions() > 0)) {
        this.onCloseCallback();
        this.node.runAction(cc.sequence(cc.moveTo(.5, new cc.Vec2(this.node.parent.width / 2 + this.node.width / 2, this.node.position.y))
          .easing(cc.easeExponentialOut()), cc.callFunc(function() {
            t.node.active = false;
          })));
      }
    };
    e.prototype.onClickShowInputField = function() {
      MusicPlayer.default.getInstance().playbtnClick(.6);
      var t = this.editBoxCustomChat.string;
      if (!StringUtil.default.isNullOrEmpty(t)) {
        this.sendChat(t);
        GameConfigManager.default.getInstance().setOldChat(t);
        this.editBoxCustomChat.string = "";
      }
    };
    e.prototype.sendChat = function(t) {
      if (GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.BAU_CUA && GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.XOCDIA) {
        this.onClickHide();
      } else if (cc.sys.platform === cc.sys.DESKTOP_BROWSER && this.scheduleOnce(function() {
          if (null !== this.node && void 0 !== this.node && 0 === this.node.getNumberOfRunningActions() && null !== this
            .editBoxCustomChat && void 0 !== this.editBoxCustomChat) {
            this.editBoxCustomChat.focus();
          }
        }, .2), null !== this.gameController && void 0 !== this.gameController) {
        var e = this.gameController.checkSpamChat(t);
        if (!StringUtil.default.isNullOrEmpty(e)) {
          return void(null != this.gameController.cardGameTableController && this.gameController.cardGameTableController.loadChat(e, "",
            true, -1, m, m));
        }
      }
      CardGameCommonRequest.default.getInstance().sendChat(t);
      GamePlayManager.default.getInstance().lastChatTime = new Date().getTime();
      GamePlayManager.default.getInstance().numChatInGame++;
      var i = GamePlayManager.default.getInstance().lastChatTime - GamePlayManager.default.getInstance().lastChatTime1Minute;
      if (i >= 6e4) {
        GamePlayManager.default.getInstance().numChatInGame = 0;
        GamePlayManager.default.getInstance().lastChatTime1Minute = GamePlayManager.default.getInstance().lastChatTime;
      } else {
        if (GamePlayManager.default.getInstance().numChatInGame >= 8) {
          GamePlayManager.default.getInstance().lockChatInTime = GamePlayManager.default.getInstance().lastChatTime + 6e4 - i;
          GamePlayManager.default.getInstance().numChatInGame = 0;
          GamePlayManager.default.getInstance().lastChatTime1Minute = GamePlayManager.default.getInstance().lastChatTime;
        }
      }
      GamePlayManager.default.getInstance().countMatchNotInteract = 0;
    };
    e.prototype.onEditBoxReturn = function() {
      if (this.activeBlur) {
        this.activeBlur = false;
      } else {
        this.onClickShowInputField();
      }
    };
    e.prototype.onClickEditChat = function() {
      MusicPlayer.default.getInstance().playbtnClick();
    };
    e.prototype.ontextChanged = function(t, e, i) {};
    e.prototype.onCLickOpenEmo = function() {
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
    e.prototype.setTrackingGameID = function(t) {
      if (this.tabIdolLiveController) {
        this.tabIdolLiveController.setTrackingGameID(t);
      }
    };
    o([g(cc.Prefab)], e.prototype, "chatItemPrefab", void 0);
    o([g(cc.Node)], e.prototype, "contentNode", void 0);
    o([g(cc.Node)], e.prototype, "contentEmoNode", void 0);
    o([g(cc.Node)], e.prototype, "contentChatNode", void 0);
    o([g(cc.EditBox)], e.prototype, "editBoxCustomChat", void 0);
    o([g(cc.Node)], e.prototype, "btnChatEmo", void 0);
    o([g(cc.Node)], e.prototype, "btnChatText", void 0);
    o([g(TabIdolLiveController.default)], e.prototype, "tabIdolLiveController", void 0);
    o([g], e.prototype, "bonusWebMobileSafari", void 0);
    return e = o([f], e);
  }(cc.Component);
i.default = y;
void 0;
