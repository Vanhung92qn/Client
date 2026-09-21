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
var StringUtil = require("./StringUtil"),
  MiniGameNode = require("./MiniGameNode"),
  RichTextCustom = require("./RichTextCustom"),
  HeaderUi = require("./HeaderUi"),
  GameConfigManager = require("./GameConfigManager"),
  h = cc._decorator,
  u = h.ccclass,
  d = h.property,
  p = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.content = null;
      e.mainNode = null;
      e.timeChange = 5;
      e.speed = 2.5;
      e.moveLength = 0;
      e.isUpdatePosition = false;
      e.isFirstMessage = true;
      e.listMessages = [];
      e.listMessageDefault = [];
      e.timeCheckBroadCast = 0;
      e.timeCount = 0;
      e.lastMessageDefaultIndex = -1;
      e.isSequence = false;
      e.listBroadCast = [];
      e.currIndex = 0;
      return e;
    }
    var i;
    n(e, t);
    i = e;
    e.getInstance = function() {
      return this.instance;
    };
    e.prototype.onLoad = function() {
      i.instance = this;
      this.mainNode.active = false;
      this.registryBroadCast();
      if (i.messageDefault.length > 0) {
        this.listMessageDefault = i.messageDefault;
      }
      var t = GameConfigManager.default.getInstance().broadCastConfig;
      if (null !== t && void 0 !== t) {
        if (t.hasOwnProperty("config")) {
          var e = t.config;
          if (e.hasOwnProperty("isSequence")) {
            this.isSequence = e.isSequence;
          }
        }
        if (t.hasOwnProperty("listBroadCast")) {
          this.listBroadCast = t.listBroadCast;
        }
      }
    };
    e.prototype.reset = function() {
      this.isUpdatePosition = false;
      this.timeCheckBroadCast = 0;
      this.timeCount = 0;
      this.lastMessageDefaultIndex = -1;
      this.listMessages = [];
    };
    e.prototype.start = function() {};
    e.prototype.disable = function() {};
    e.prototype.registryBroadCast = function() {};
    e.prototype.update = function(t) {
      if ("mu9" == GameConfigManager.default.getInstance().webccBrand) {
        if (null != i.instance) {
          i.instance.hide(false);
        }
        if (null != i.instanceBigWin) {
          i.instanceBigWin.hide(false);
        }
      }
      this.timeCheckBroadCast += t;
      if (this.timeCheckBroadCast >= 1) {
        this.timeCheckBroadCast = 0;
        this.checkBroadCast();
      }
      if (this.isUpdatePosition) {
        this.timeCount += t;
        if (this.timeCount >= this.timeChange) {
          this.timeCount = 0;
          this.finishShow();
        }
      }
    };
    e.prototype.checkBroadCast = function() {
      if (null != this.content && 0 == this.isUpdatePosition) {
        this.showBroadCastDefault();
      }
    };
    e.prototype.showRandom = function() {
      var t = StringUtil.default.getRandomInt(i.listBroadCastMessage.length);
      this.show(i.listBroadCastMessage[t]);
    };
    e.prototype.onReceiveBroadCast = function(t) {
      var e = t.mgs,
        i = t.params;
      if (e) {
        if (e = e.replace(/\t/gi, "      "), void 0 != i && i.length > 0) {
          for (var n = 0; n < i.length; n++) {
            var o = i[n];
            e = n % 2 == 0 ? e.replace(/%c/i, "<color=#ff6600> " + o + "</c>") : e.replace(/%y/i, "<color=#f71e1e> " + o + "</c>");
          }
        }
        this.listMessages.push(e);
        this.show(null);
      }
    };
    e.prototype.setString = function(t) {
      this.content.setString(t);
      if (this.isSequence) {
        this.timeChange = this.listBroadCast[this.currIndex].time;
        this.currIndex++;
        if (this.currIndex >= this.listBroadCast.length) {
          this.currIndex = 0;
        }
      }
    };
    e.prototype.show = function(t) {
      if (void 0 === t) {
        t = null;
      }
      if (null != MiniGameNode.default.instance) {
        MiniGameNode.default.instance.updateBroadCastPosition();
      }
      if (0 != HeaderUi.default.isActive) {
        this.mainNode.active = true;
        if (this.timeCount > 0 && this.timeCount < this.timeChange) {
          this.isUpdatePosition = true;
        } else {
          if (null == t || 0 != t.length) {
            if (null != t) {
              if (this.mainNode.active && this.isUpdatePosition) {
                this.listMessages.push(t);
              } else {
                this.setString(t);
                this.mainNode.active = true;
                this.moveLength = this.content.node.getContentSize().width + this.node.getContentSize().width;
                this.isUpdatePosition = true;
              }
            } else {
              if (0 == this.isUpdatePosition) {
                this.show(this.popMessage());
              }
            }
          } else {
            this.showBroadCastDefault();
          }
        }
      } else {
        this.mainNode.active = false;
      }
    };
    e.prototype.showBroadCastDefault = function() {
      if (0 != this.listBroadCast.length) {
        if (this.listMessages.length > 0) {
          if (0 == this.isUpdatePosition) {
            this.show(this.popMessage());
          }
        } else {
          var t,
            e = 0;
          if (this.isSequence) {
            e = this.currIndex;
          } else {
            if (e = StringUtil.default.getRandomInt(this.listBroadCast.length), this.listBroadCast.length > 1) {
              for (; e == this.lastMessageDefaultIndex;) {
                e = StringUtil.default.getRandomInt(this.listBroadCast.length);
              }
            }
            this.lastMessageDefaultIndex = e;
          }
          t = this.listBroadCast[e].text;
          this.show(t);
        }
      }
    };
    e.prototype.popMessage = function() {
      return this.listMessages.length > 0 ? this.listMessages.shift() : (this.showBroadCastDefault(), "");
    };
    e.prototype.finishShow = function() {
      this.isUpdatePosition = false;
      this.show(this.popMessage());
    };
    e.prototype.hide = function(t) {
      if (void 0 === t) {
        t = false;
      }
      this.mainNode.active = false;
      this.isUpdatePosition = false;
      if (t) {
        this.node.stopAllActions();
        this.content.node.stopAllActions();
        this.content.resetOpacityListLabel();
      }
    };
    e.listBroadCastMessage = [];
    e.messageDefault = [];
    e.instance = null;
    e.instanceBigWin = null;
    o([d(RichTextCustom.default)], e.prototype, "content", void 0);
    o([d(cc.Node)], e.prototype, "mainNode", void 0);
    o([d], e.prototype, "speed", void 0);
    return e = i = o([u], e);
  }(cc.Component);
i.default = p;
void 0;
