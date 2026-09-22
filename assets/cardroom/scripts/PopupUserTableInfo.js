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
var CardPopupBase = require("CardPopupBase"),
  StringUtil = require("StringUtil"),
  RemoteSprite = require("RemoteSprite"),
  GameConfigManager = require("GameConfigManager"),
  CommonPrefabsManager = require("CommonPrefabsManager"),
  GameHTTPManager = require("GameHTTPManager"),
  GamePlayManager = require("GamePlayManager"),
  GameDefine = require("GameDefine"),
  PlinkoController = require("PlinkoController"),
  PaymentDefine = require("PaymentDefine"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  PopupUserTableInfo = function(_super) {
    function PopupUserTableInfo() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.sprAvatar = null;
      _this.lbName = null;
      _this.lbMoney = null;
      _this.lbMoneyKetSat = null;
      _this.lbRutKetNode = null;
      _this.rightUI = null;
      _this.btnRutKet = null;
      _this.maxLengthName = 8;
      _this.money = 0;
      _this.callbackClose = null;
      _this.lsGameIDAllowShowBtnNapPopupUserInfo = [221, 9, 14];
      return _this;
    }
    __extends(PopupUserTableInfo, _super);
    PopupUserTableInfo.prototype.onLoad = function() {
      if (GameConfigManager.default.getInstance().lsGameIDAllowShowBtnNapPopupUserInfo) {
        this.lsGameIDAllowShowBtnNapPopupUserInfo = GameConfigManager.default.getInstance().lsGameIDAllowShowBtnNapPopupUserInfo;
      }
    };
    PopupUserTableInfo.prototype.onClickClose = function() {
      this.hide(this.callbackClose);
    };
    PopupUserTableInfo.prototype.loadUI = function(name, money, avatarUrl, isMine) {
      if (void 0 === isMine) {
        isMine = false;
      }
      if (name.length > this.maxLengthName) {
        this.lbName.string = name.slice(0, this.maxLengthName) + "...";
      } else {
        this.lbName.string = name;
      }
      var displayMoney = money;
      if (PlinkoController.default.getInstance() && PlinkoController.default.getInstance().isInGamePlinko && (displayMoney -= PlinkoController.default.getInstance().TotalMoneyWin) < 0) {
        displayMoney = 0;
      }
      this.lbMoney.string = StringUtil.default.formatMoneyNumberWithColom(displayMoney);
      this.sprAvatar.loadImage(avatarUrl);
      this.rightUI.active = false;
      this.money = displayMoney;
      if ((this.lsGameIDAllowShowBtnNapPopupUserInfo.indexOf(GamePlayManager.default.getInstance().gameID) >= 0 || GamePlayManager.default.getInstance()
          .currentScene == GameDefine.GameConfigs.SceneName.LiveStream || GamePlayManager.default.getInstance().currentScene == GameDefine.GameConfigs.SceneName
          .XocDiaLiveV2 || GamePlayManager.default.getInstance().currentScene == GameDefine.GameConfigs.SceneName.Volta || GamePlayManager.default.getInstance()
          .currentScene == GameDefine.GameConfigs.SceneName.DaGaLive || GamePlayManager.default.getInstance().currentScene == GameDefine.GameConfigs.SceneName
          .BauCuaLive || GamePlayManager.default.getInstance().currentScene == GameDefine.GameConfigs.SceneName.BauCuaBonus) && isMine) {
        this.rightUI.active = true;
        this.money = displayMoney;
        this.lbMoneyKetSat.string = StringUtil.default.formatMoneyNumberWithColom(GamePlayManager.default.getInstance().extraMoney);
        this.updateButtonRutKetStatus();
        if (GamePlayManager.default.getInstance().isUpdateKetSat) {
          this.onGetMoneyUser_API(this.money);
        }
      }
    };
    PopupUserTableInfo.prototype.onClickRutKet = function() {
      if (GamePlayManager.default.getInstance().extraMoney <= 0) {
        this.showMessageUlti("Kh\xf4ng c\xf3 ti\u1ec1n trong k\xe9t s\u1eaft !");
      } else {
        if (null != this.callbackClose) {
          CommonPrefabsManager.default.getInstance().showPopupKetSat(true, this.money, this.callbackClose.bind(this));
        } else {
          CommonPrefabsManager.default.getInstance().showPopupKetSat(true, this.money);
        }
        this.hideWithoutAnimation();
      }
    };
    PopupUserTableInfo.prototype.onClickNap = function() {
      if (null != this.callbackClose) {
        CommonPrefabsManager.default.getInstance().showPopupNap(PaymentDefine.TAB_LAST_SELECTED_OR_DEFAULT, this.callbackClose.bind(this));
      } else {
        CommonPrefabsManager.default.getInstance().showPopupNap(PaymentDefine.TAB_LAST_SELECTED_OR_DEFAULT);
      }
      this.hide();
    };
    PopupUserTableInfo.prototype.onGetMoneyUser_API = function(money) {
      var self = this;
      if (void 0 === money) {
        money = 0;
      }
      if (!(GameConfigManager.default.getInstance().listcommingSoonGames.indexOf("ketsat") > -1 || GameConfigManager.default.getInstance().isLoginWebcc || GameConfigManager.default
          .getInstance().isLoginWebccNoWallet)) {
        CommonPrefabsManager.default.getInstance().showLoading();
        GameHTTPManager.default.getInstance().sendPostHttpRequest(GameConfigManager.default.getInstance().paymentURLs.postSafeLoad, "", function(response) {
          if (0 === response.status.localeCompare("OK") && null !== response.data[0] && void 0 !== response.data[0]) {
            var displayMoney = response.data[0].main_balance;
            if (PlinkoController.default.getInstance() && PlinkoController.default.getInstance().isInGamePlinko && (displayMoney -= PlinkoController.default.getInstance().TotalMoneyWin) <
              0) {
              displayMoney = 0;
            }
            self.lbMoney.string = StringUtil.default.formatMoneyNumberWithColom(displayMoney);
            self.lbMoneyKetSat.string = StringUtil.default.formatMoneyNumberWithColom(response.data[0].extra_balance);
            if (money > 0) {
              self.lbMoney.string = StringUtil.default.formatMoneyNumberWithColom(money);
            }
            GamePlayManager.default.getInstance().extraMoney = response.data[0].extra_balance;
            GamePlayManager.default.getInstance().isUpdateKetSat = false;
            self.updateButtonRutKetStatus();
          } else {
            self.showMessageUlti("Kh\xf4ng th\u1ec3 c\u1eadp nh\u1eadt ti\u1ec1n k\xe9t s\u1eaft. Vui l\xf2ng th\u1eed l\u1ea1i !");
          }
          CommonPrefabsManager.default.getInstance().hideLoading();
        }, function(errorMessage) {
          self.showMessageUlti("Kh\xf4ng th\u1ec3 c\u1eadp nh\u1eadt ti\u1ec1n k\xe9t s\u1eaft. Vui l\xf2ng th\u1eed l\u1ea1i !");
        });
      }
    };
    PopupUserTableInfo.prototype.showMessageUlti = function(message) {
      if (GamePlayManager.default.getInstance().currentScene === GameDefine.GameConfigs.SceneName.XocDiaLive || GamePlayManager.default.getInstance().currentScene === GameDefine
        .GameConfigs.SceneName.Volta) {
        CommonPrefabsManager.default.getInstance().showPopupMessageWithPositionUtil(message);
      } else {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil(message);
      }
    };
    PopupUserTableInfo.prototype.updateButtonRutKetStatus = function() {
      this.btnRutKet.interactable = !(GamePlayManager.default.getInstance().extraMoney <= 0);
      this.btnRutKet.enableAutoGrayEffect = GamePlayManager.default.getInstance().extraMoney <= 0;
      this.lbRutKetNode.color = GamePlayManager.default.getInstance().extraMoney <= 0 ? new cc.Color(85, 85, 85, 255) : cc.Color.WHITE;
    };
    __decorate([property(RemoteSprite.default)], PopupUserTableInfo.prototype, "sprAvatar", void 0);
    __decorate([property(cc.Label)], PopupUserTableInfo.prototype, "lbName", void 0);
    __decorate([property(cc.Label)], PopupUserTableInfo.prototype, "lbMoney", void 0);
    __decorate([property(cc.Label)], PopupUserTableInfo.prototype, "lbMoneyKetSat", void 0);
    __decorate([property(cc.Node)], PopupUserTableInfo.prototype, "lbRutKetNode", void 0);
    __decorate([property(cc.Node)], PopupUserTableInfo.prototype, "rightUI", void 0);
    __decorate([property(cc.Button)], PopupUserTableInfo.prototype, "btnRutKet", void 0);
    __decorate([property], PopupUserTableInfo.prototype, "maxLengthName", void 0);
    return PopupUserTableInfo = __decorate([ccclass], PopupUserTableInfo);
  }(CardPopupBase.default);
moduleExports.default = PopupUserTableInfo;
void 0;
