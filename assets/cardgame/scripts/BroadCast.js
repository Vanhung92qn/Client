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
var StringUtil = require("StringUtil"),
  MiniGameNode = require("MiniGameNode"),
  RichTextCustom = require("RichTextCustom"),
  HeaderUi = require("HeaderUi"),
  GameConfigManager = require("GameConfigManager"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  BroadCast = function(_super) {
    function BroadCast() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.content = null;
      _this.mainNode = null;
      _this.timeChange = 5;
      _this.speed = 2.5;
      _this.moveLength = 0;
      _this.isUpdatePosition = false;
      _this.isFirstMessage = true;
      _this.listMessages = [];
      _this.listMessageDefault = [];
      _this.timeCheckBroadCast = 0;
      _this.timeCount = 0;
      _this.lastMessageDefaultIndex = -1;
      _this.isSequence = false;
      _this.listBroadCast = [];
      _this.currIndex = 0;
      return _this;
    }
    var BroadCast_1;
    __extends(BroadCast, _super);
    BroadCast_1 = BroadCast;
    BroadCast.getInstance = function() {
      return this.instance;
    };
    BroadCast.prototype.onLoad = function() {
      BroadCast_1.instance = this;
      this.mainNode.active = false;
      this.registryBroadCast();
      if (BroadCast_1.messageDefault.length > 0) {
        this.listMessageDefault = BroadCast_1.messageDefault;
      }
      var broadCastConfig = GameConfigManager.default.getInstance().broadCastConfig;
      if (null !== broadCastConfig && void 0 !== broadCastConfig) {
        if (broadCastConfig.hasOwnProperty("config")) {
          var config = broadCastConfig.config;
          if (config.hasOwnProperty("isSequence")) {
            this.isSequence = config.isSequence;
          }
        }
        if (broadCastConfig.hasOwnProperty("listBroadCast")) {
          this.listBroadCast = broadCastConfig.listBroadCast;
        }
      }
    };
    BroadCast.prototype.reset = function() {
      this.isUpdatePosition = false;
      this.timeCheckBroadCast = 0;
      this.timeCount = 0;
      this.lastMessageDefaultIndex = -1;
      this.listMessages = [];
    };
    BroadCast.prototype.start = function() {};
    BroadCast.prototype.disable = function() {};
    BroadCast.prototype.registryBroadCast = function() {};
    BroadCast.prototype.update = function(dt) {
      if ("mu9" == GameConfigManager.default.getInstance().webccBrand) {
        if (null != BroadCast_1.instance) {
          BroadCast_1.instance.hide(false);
        }
        if (null != BroadCast_1.instanceBigWin) {
          BroadCast_1.instanceBigWin.hide(false);
        }
      }
      this.timeCheckBroadCast += dt;
      if (this.timeCheckBroadCast >= 1) {
        this.timeCheckBroadCast = 0;
        this.checkBroadCast();
      }
      if (this.isUpdatePosition) {
        this.timeCount += dt;
        if (this.timeCount >= this.timeChange) {
          this.timeCount = 0;
          this.finishShow();
        }
      }
    };
    BroadCast.prototype.checkBroadCast = function() {
      if (null != this.content && 0 == this.isUpdatePosition) {
        this.showBroadCastDefault();
      }
    };
    BroadCast.prototype.showRandom = function() {
      var randomIndex = StringUtil.default.getRandomInt(BroadCast_1.listBroadCastMessage.length);
      this.show(BroadCast_1.listBroadCastMessage[randomIndex]);
    };
    BroadCast.prototype.onReceiveBroadCast = function(broadCastData) {
      var message = broadCastData.mgs,
        params = broadCastData.params;
      if (message) {
        if (message = message.replace(/\t/gi, "      "), void 0 != params && params.length > 0) {
          for (var paramIndex = 0; paramIndex < params.length; paramIndex++) {
            var param = params[paramIndex];
            message = paramIndex % 2 == 0 ? message.replace(/%c/i, "<color=#ff6600> " + param + "</c>") : message.replace(/%y/i, "<color=#f71e1e> " + param + "</c>");
          }
        }
        this.listMessages.push(message);
        this.show(null);
      }
    };
    BroadCast.prototype.setString = function(text) {
      this.content.setString(text);
      if (this.isSequence) {
        this.timeChange = this.listBroadCast[this.currIndex].time;
        this.currIndex++;
        if (this.currIndex >= this.listBroadCast.length) {
          this.currIndex = 0;
        }
      }
    };
    BroadCast.prototype.show = function(message) {
      if (void 0 === message) {
        message = null;
      }
      if (null != MiniGameNode.default.instance) {
        MiniGameNode.default.instance.updateBroadCastPosition();
      }
      if (0 != HeaderUi.default.isActive) {
        this.mainNode.active = true;
        if (this.timeCount > 0 && this.timeCount < this.timeChange) {
          this.isUpdatePosition = true;
        } else {
          if (null == message || 0 != message.length) {
            if (null != message) {
              if (this.mainNode.active && this.isUpdatePosition) {
                this.listMessages.push(message);
              } else {
                this.setString(message);
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
    BroadCast.prototype.showBroadCastDefault = function() {
      if (0 != this.listBroadCast.length) {
        if (this.listMessages.length > 0) {
          if (0 == this.isUpdatePosition) {
            this.show(this.popMessage());
          }
        } else {
          var text,
            messageIndex = 0;
          if (this.isSequence) {
            messageIndex = this.currIndex;
          } else {
            if (messageIndex = StringUtil.default.getRandomInt(this.listBroadCast.length), this.listBroadCast.length > 1) {
              for (; messageIndex == this.lastMessageDefaultIndex;) {
                messageIndex = StringUtil.default.getRandomInt(this.listBroadCast.length);
              }
            }
            this.lastMessageDefaultIndex = messageIndex;
          }
          text = this.listBroadCast[messageIndex].text;
          this.show(text);
        }
      }
    };
    BroadCast.prototype.popMessage = function() {
      return this.listMessages.length > 0 ? this.listMessages.shift() : (this.showBroadCastDefault(), "");
    };
    BroadCast.prototype.finishShow = function() {
      this.isUpdatePosition = false;
      this.show(this.popMessage());
    };
    BroadCast.prototype.hide = function(stopActions) {
      if (void 0 === stopActions) {
        stopActions = false;
      }
      this.mainNode.active = false;
      this.isUpdatePosition = false;
      if (stopActions) {
        this.node.stopAllActions();
        this.content.node.stopAllActions();
        this.content.resetOpacityListLabel();
      }
    };
    BroadCast.listBroadCastMessage = [];
    BroadCast.messageDefault = [];
    BroadCast.instance = null;
    BroadCast.instanceBigWin = null;
    __decorate([property(RichTextCustom.default)], BroadCast.prototype, "content", void 0);
    __decorate([property(cc.Node)], BroadCast.prototype, "mainNode", void 0);
    __decorate([property], BroadCast.prototype, "speed", void 0);
    return BroadCast = BroadCast_1 = __decorate([ccclass], BroadCast);
  }(cc.Component);
moduleExports.default = BroadCast;
void 0;
