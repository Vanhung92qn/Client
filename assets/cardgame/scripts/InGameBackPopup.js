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
var GamePlayManager = require("GamePlayManager"),
  GameConfigManager = require("GameConfigManager"),
  CommonPrefabsManager = require("CommonPrefabsManager"),
  MusicPlayer = require("MusicPlayer"),
  CardGameCommonRequest = require("CardGameCommonRequest"),
  RoomMessageHandler = require("RoomMessageHandler"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  InGameBackPopup = function(_super) {
    function InGameBackPopup() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.btnAutoReady = null;
      _this.btnExit = null;
      _this.iconOutRoom = null;
      _this.iconHuyOutRoom = null;
      _this.btnBaoQuay = null;
      _this.bet = 100;
      _this.onCloseCallback = function() {};
      _this.onExitCallback = function() {};
      return _this;
    }
    __extends(InGameBackPopup, _super);
    InGameBackPopup.prototype.show = function(canBaoQuay, betAmount) {
      if (void 0 === canBaoQuay) {
        canBaoQuay = true;
      }
      if (void 0 === betAmount) {
        betAmount = 100;
      }
      if (null !== this.btnAutoReady && void 0 !== this.btnAutoReady) {
        this.btnAutoReady.isChecked = GameConfigManager.default.getInstance().autoReady;
      }
      this.node.active = true;
      this.node.position = new cc.Vec2(-this.node.parent.width / 2 - this.node.width / 2, this.node.position.y);
      this.node.runAction(cc.moveTo(.5, new cc.Vec2(-this.node.parent.width / 2 + this.node.width / 2 + 60, this.node.position.y)).easing(
        cc.easeExponentialOut()));
      if (null !== this.btnBaoQuay && void 0 !== this.btnBaoQuay) {
        this.btnBaoQuay.active = true;
        if (false === canBaoQuay) {
          this.btnBaoQuay.active = false;
        }
      }
      this.bet = betAmount;
    };
    InGameBackPopup.prototype.onClickHide = function() {
      var _this = this;
      MusicPlayer.default.getInstance().playbtnClick();
      this.node.stopAllActions();
      this.onCloseCallback();
      this.node.runAction(cc.sequence(cc.moveTo(.5, new cc.Vec2(-this.node.parent.width / 2 - this.node.width / 2, this.node.position.y))
        .easing(cc.easeExponentialOut()), cc.callFunc(function() {
          _this.node.active = false;
        })));
    };
    InGameBackPopup.prototype.onClickExit = function() {
      this.onClickHide();
      this.onExitCallback();
    };
    InGameBackPopup.prototype.onClickSetting = function() {
      this.onClickHide();
      CommonPrefabsManager.default.getInstance().showPopupSetting();
    };
    InGameBackPopup.prototype.onClickAutoReady = function() {
      GameConfigManager.default.getInstance().setEnableAutoReady(this.btnAutoReady.isChecked);
      RoomMessageHandler.default.getInstance().sendAutoReadyPref(this.btnAutoReady.isChecked);
      MusicPlayer.default.getInstance().playbtnClick();
    };
    InGameBackPopup.prototype.onClickHelp = function() {
      CommonPrefabsManager.default.getInstance().showPopupHelpImage(GamePlayManager.default.getInstance().gameID);
      this.onClickHide();
    };
    InGameBackPopup.prototype.onClickBaoQuay = function() {
      var popup = CommonPrefabsManager.default.getInstance().showPopup2Button();
      popup.setContent(GameConfigManager.default.getInstance().textBaoQuay);
      popup.setTextOk("B\xc1O");
      popup.onOKClicked = function() {
        popup.hide();
        CardGameCommonRequest.default.getInstance().sendBaoQuay();
      }.bind(this);
      this.onClickHide();
    };
    InGameBackPopup.prototype.onClickBXH = function() {
      CommonPrefabsManager.default.getInstance().showPopupXepHangGame(GamePlayManager.default.getInstance().gameID);
      this.onClickHide();
    };
    __decorate([property(cc.Toggle)], InGameBackPopup.prototype, "btnAutoReady", void 0);
    __decorate([property(cc.Sprite)], InGameBackPopup.prototype, "btnExit", void 0);
    __decorate([property(cc.SpriteFrame)], InGameBackPopup.prototype, "iconOutRoom", void 0);
    __decorate([property(cc.SpriteFrame)], InGameBackPopup.prototype, "iconHuyOutRoom", void 0);
    __decorate([property(cc.Node)], InGameBackPopup.prototype, "btnBaoQuay", void 0);
    return InGameBackPopup = __decorate([ccclass], InGameBackPopup);
  }(cc.Component);
moduleExports.default = InGameBackPopup;
void 0;
