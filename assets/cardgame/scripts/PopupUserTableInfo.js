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
var CardPopupBase = require("./CardPopupBase"),
  StringUtil = require("./StringUtil"),
  RemoteSprite = require("./RemoteSprite"),
  GameConfigManager = require("./GameConfigManager"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  GameHTTPManager = require("./GameHTTPManager"),
  GamePlayManager = require("./GamePlayManager"),
  GameDefine = require("./GameDefine"),
  PlinkoController = require("./PlinkoController"),
  PaymentDefine = require("./PaymentDefine"),
  g = cc._decorator,
  m = g.ccclass,
  y = g.property,
  S = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.sprAvatar = null;
      e.lbName = null;
      e.lbMoney = null;
      e.lbMoneyKetSat = null;
      e.lbRutKetNode = null;
      e.rightUI = null;
      e.btnRutKet = null;
      e.maxLengthName = 8;
      e.money = 0;
      e.callbackClose = null;
      e.lsGameIDAllowShowBtnNapPopupUserInfo = [221, 9, 14];
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {
      if (GameConfigManager.default.getInstance().lsGameIDAllowShowBtnNapPopupUserInfo) {
        this.lsGameIDAllowShowBtnNapPopupUserInfo = GameConfigManager.default.getInstance().lsGameIDAllowShowBtnNapPopupUserInfo;
      }
    };
    e.prototype.onClickClose = function() {
      this.hide(this.callbackClose);
    };
    e.prototype.loadUI = function(t, e, i, n) {
      if (void 0 === n) {
        n = false;
      }
      if (t.length > this.maxLengthName) {
        this.lbName.string = t.slice(0, this.maxLengthName) + "...";
      } else {
        this.lbName.string = t;
      }
      var o = e;
      if (PlinkoController.default.getInstance() && PlinkoController.default.getInstance().isInGamePlinko && (o -= PlinkoController.default.getInstance().TotalMoneyWin) < 0) {
        o = 0;
      }
      this.lbMoney.string = StringUtil.default.formatMoneyNumberWithColom(o);
      this.sprAvatar.loadImage(i);
      this.rightUI.active = false;
      this.money = o;
      if ((this.lsGameIDAllowShowBtnNapPopupUserInfo.indexOf(GamePlayManager.default.getInstance().gameID) >= 0 || GamePlayManager.default.getInstance()
          .currentScene == GameDefine.GameConfigs.SceneName.LiveStream || GamePlayManager.default.getInstance().currentScene == GameDefine.GameConfigs.SceneName
          .XocDiaLiveV2 || GamePlayManager.default.getInstance().currentScene == GameDefine.GameConfigs.SceneName.Volta || GamePlayManager.default.getInstance()
          .currentScene == GameDefine.GameConfigs.SceneName.DaGaLive || GamePlayManager.default.getInstance().currentScene == GameDefine.GameConfigs.SceneName
          .BauCuaLive || GamePlayManager.default.getInstance().currentScene == GameDefine.GameConfigs.SceneName.BauCuaBonus) && n) {
        this.rightUI.active = true;
        this.money = o;
        this.lbMoneyKetSat.string = StringUtil.default.formatMoneyNumberWithColom(GamePlayManager.default.getInstance().extraMoney);
        this.updateButtonRutKetStatus();
        if (GamePlayManager.default.getInstance().isUpdateKetSat) {
          this.onGetMoneyUser_API(this.money);
        }
      }
    };
    e.prototype.onClickRutKet = function() {
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
    e.prototype.onClickNap = function() {
      if (null != this.callbackClose) {
        CommonPrefabsManager.default.getInstance().showPopupNap(PaymentDefine.TAB_LAST_SELECTED_OR_DEFAULT, this.callbackClose.bind(this));
      } else {
        CommonPrefabsManager.default.getInstance().showPopupNap(PaymentDefine.TAB_LAST_SELECTED_OR_DEFAULT);
      }
      this.hide();
    };
    e.prototype.onGetMoneyUser_API = function(t) {
      var e = this;
      if (void 0 === t) {
        t = 0;
      }
      if (!(GameConfigManager.default.getInstance().listcommingSoonGames.indexOf("ketsat") > -1 || GameConfigManager.default.getInstance().isLoginWebcc || GameConfigManager.default
          .getInstance().isLoginWebccNoWallet)) {
        CommonPrefabsManager.default.getInstance().showLoading();
        GameHTTPManager.default.getInstance().sendPostHttpRequest(GameConfigManager.default.getInstance().paymentURLs.postSafeLoad, "", function(i) {
          if (0 === i.status.localeCompare("OK") && null !== i.data[0] && void 0 !== i.data[0]) {
            var n = i.data[0].main_balance;
            if (PlinkoController.default.getInstance() && PlinkoController.default.getInstance().isInGamePlinko && (n -= PlinkoController.default.getInstance().TotalMoneyWin) <
              0) {
              n = 0;
            }
            e.lbMoney.string = StringUtil.default.formatMoneyNumberWithColom(n);
            e.lbMoneyKetSat.string = StringUtil.default.formatMoneyNumberWithColom(i.data[0].extra_balance);
            if (t > 0) {
              e.lbMoney.string = StringUtil.default.formatMoneyNumberWithColom(t);
            }
            GamePlayManager.default.getInstance().extraMoney = i.data[0].extra_balance;
            GamePlayManager.default.getInstance().isUpdateKetSat = false;
            e.updateButtonRutKetStatus();
          } else {
            e.showMessageUlti("Kh\xf4ng th\u1ec3 c\u1eadp nh\u1eadt ti\u1ec1n k\xe9t s\u1eaft. Vui l\xf2ng th\u1eed l\u1ea1i !");
          }
          CommonPrefabsManager.default.getInstance().hideLoading();
        }, function(t) {
          e.showMessageUlti("Kh\xf4ng th\u1ec3 c\u1eadp nh\u1eadt ti\u1ec1n k\xe9t s\u1eaft. Vui l\xf2ng th\u1eed l\u1ea1i !");
        });
      }
    };
    e.prototype.showMessageUlti = function(t) {
      if (GamePlayManager.default.getInstance().currentScene === GameDefine.GameConfigs.SceneName.XocDiaLive || GamePlayManager.default.getInstance().currentScene === GameDefine
        .GameConfigs.SceneName.Volta) {
        CommonPrefabsManager.default.getInstance().showPopupMessageWithPositionUtil(t);
      } else {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil(t);
      }
    };
    e.prototype.updateButtonRutKetStatus = function() {
      this.btnRutKet.interactable = !(GamePlayManager.default.getInstance().extraMoney <= 0);
      this.btnRutKet.enableAutoGrayEffect = GamePlayManager.default.getInstance().extraMoney <= 0;
      this.lbRutKetNode.color = GamePlayManager.default.getInstance().extraMoney <= 0 ? new cc.Color(85, 85, 85, 255) : cc.Color.WHITE;
    };
    o([y(RemoteSprite.default)], e.prototype, "sprAvatar", void 0);
    o([y(cc.Label)], e.prototype, "lbName", void 0);
    o([y(cc.Label)], e.prototype, "lbMoney", void 0);
    o([y(cc.Label)], e.prototype, "lbMoneyKetSat", void 0);
    o([y(cc.Node)], e.prototype, "lbRutKetNode", void 0);
    o([y(cc.Node)], e.prototype, "rightUI", void 0);
    o([y(cc.Button)], e.prototype, "btnRutKet", void 0);
    o([y], e.prototype, "maxLengthName", void 0);
    return e = o([m], e);
  }(CardPopupBase.default);
i.default = S;
void 0;
