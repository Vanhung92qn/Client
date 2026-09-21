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
// ── BẢNG TRA BÍ DANH (máy sinh — ghi-bang-tra-bi-danh.js) ──────
// Mã dịch ngược đặt bí danh một chữ cho mỗi module. Bảng này để khỏi phải cuộn ngược.
// KHÔNG đổi tên chúng bằng tìm-kiếm-thay-thế: đoạn mở đầu __decorate khai lại đúng
// những chữ này làm biến cục bộ, đổi là hỏng im lặng.
//   a = CardPopupBase   s = StringUtil   r = RemoteSprite
//   c = GameConfigManager   l = CommonPrefabsManager   h = GameHTTPManager
//   u = GamePlayManager   d = GameDefine   p = PlinkoController
//   f = PaymentDefine
// ────────────────────────────────────────────────────────────────
var a = require("./CardPopupBase"),
  s = require("./StringUtil"),
  r = require("./RemoteSprite"),
  c = require("./GameConfigManager"),
  l = require("./CommonPrefabsManager"),
  h = require("./GameHTTPManager"),
  u = require("./GamePlayManager"),
  d = require("./GameDefine"),
  p = require("./PlinkoController"),
  f = require("./PaymentDefine"),
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
      if (c.default.getInstance().lsGameIDAllowShowBtnNapPopupUserInfo) {
        this.lsGameIDAllowShowBtnNapPopupUserInfo = c.default.getInstance().lsGameIDAllowShowBtnNapPopupUserInfo;
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
      if (p.default.getInstance() && p.default.getInstance().isInGamePlinko && (o -= p.default.getInstance().TotalMoneyWin) < 0) {
        o = 0;
      }
      this.lbMoney.string = s.default.formatMoneyNumberWithColom(o);
      this.sprAvatar.loadImage(i);
      this.rightUI.active = false;
      this.money = o;
      if ((this.lsGameIDAllowShowBtnNapPopupUserInfo.indexOf(u.default.getInstance().gameID) >= 0 || u.default.getInstance()
          .currentScene == d.GameConfigs.SceneName.LiveStream || u.default.getInstance().currentScene == d.GameConfigs.SceneName
          .XocDiaLiveV2 || u.default.getInstance().currentScene == d.GameConfigs.SceneName.Volta || u.default.getInstance()
          .currentScene == d.GameConfigs.SceneName.DaGaLive || u.default.getInstance().currentScene == d.GameConfigs.SceneName
          .BauCuaLive || u.default.getInstance().currentScene == d.GameConfigs.SceneName.BauCuaBonus) && n) {
        this.rightUI.active = true;
        this.money = o;
        this.lbMoneyKetSat.string = s.default.formatMoneyNumberWithColom(u.default.getInstance().extraMoney);
        this.updateButtonRutKetStatus();
        if (u.default.getInstance().isUpdateKetSat) {
          this.onGetMoneyUser_API(this.money);
        }
      }
    };
    e.prototype.onClickRutKet = function() {
      if (u.default.getInstance().extraMoney <= 0) {
        this.showMessageUlti("Kh\xf4ng c\xf3 ti\u1ec1n trong k\xe9t s\u1eaft !");
      } else {
        if (null != this.callbackClose) {
          l.default.getInstance().showPopupKetSat(true, this.money, this.callbackClose.bind(this));
        } else {
          l.default.getInstance().showPopupKetSat(true, this.money);
        }
        this.hideWithoutAnimation();
      }
    };
    e.prototype.onClickNap = function() {
      if (null != this.callbackClose) {
        l.default.getInstance().showPopupNap(f.TAB_LAST_SELECTED_OR_DEFAULT, this.callbackClose.bind(this));
      } else {
        l.default.getInstance().showPopupNap(f.TAB_LAST_SELECTED_OR_DEFAULT);
      }
      this.hide();
    };
    e.prototype.onGetMoneyUser_API = function(t) {
      var e = this;
      if (void 0 === t) {
        t = 0;
      }
      if (!(c.default.getInstance().listcommingSoonGames.indexOf("ketsat") > -1 || c.default.getInstance().isLoginWebcc || c.default
          .getInstance().isLoginWebccNoWallet)) {
        l.default.getInstance().showLoading();
        h.default.getInstance().sendPostHttpRequest(c.default.getInstance().paymentURLs.postSafeLoad, "", function(i) {
          if (0 === i.status.localeCompare("OK") && null !== i.data[0] && void 0 !== i.data[0]) {
            var n = i.data[0].main_balance;
            if (p.default.getInstance() && p.default.getInstance().isInGamePlinko && (n -= p.default.getInstance().TotalMoneyWin) <
              0) {
              n = 0;
            }
            e.lbMoney.string = s.default.formatMoneyNumberWithColom(n);
            e.lbMoneyKetSat.string = s.default.formatMoneyNumberWithColom(i.data[0].extra_balance);
            if (t > 0) {
              e.lbMoney.string = s.default.formatMoneyNumberWithColom(t);
            }
            u.default.getInstance().extraMoney = i.data[0].extra_balance;
            u.default.getInstance().isUpdateKetSat = false;
            e.updateButtonRutKetStatus();
          } else {
            e.showMessageUlti("Kh\xf4ng th\u1ec3 c\u1eadp nh\u1eadt ti\u1ec1n k\xe9t s\u1eaft. Vui l\xf2ng th\u1eed l\u1ea1i !");
          }
          l.default.getInstance().hideLoading();
        }, function(t) {
          e.showMessageUlti("Kh\xf4ng th\u1ec3 c\u1eadp nh\u1eadt ti\u1ec1n k\xe9t s\u1eaft. Vui l\xf2ng th\u1eed l\u1ea1i !");
        });
      }
    };
    e.prototype.showMessageUlti = function(t) {
      if (u.default.getInstance().currentScene === d.GameConfigs.SceneName.XocDiaLive || u.default.getInstance().currentScene === d
        .GameConfigs.SceneName.Volta) {
        l.default.getInstance().showPopupMessageWithPositionUtil(t);
      } else {
        l.default.getInstance().showPopupMessageUtil(t);
      }
    };
    e.prototype.updateButtonRutKetStatus = function() {
      this.btnRutKet.interactable = !(u.default.getInstance().extraMoney <= 0);
      this.btnRutKet.enableAutoGrayEffect = u.default.getInstance().extraMoney <= 0;
      this.lbRutKetNode.color = u.default.getInstance().extraMoney <= 0 ? new cc.Color(85, 85, 85, 255) : cc.Color.WHITE;
    };
    o([y(r.default)], e.prototype, "sprAvatar", void 0);
    o([y(cc.Label)], e.prototype, "lbName", void 0);
    o([y(cc.Label)], e.prototype, "lbMoney", void 0);
    o([y(cc.Label)], e.prototype, "lbMoneyKetSat", void 0);
    o([y(cc.Node)], e.prototype, "lbRutKetNode", void 0);
    o([y(cc.Node)], e.prototype, "rightUI", void 0);
    o([y(cc.Button)], e.prototype, "btnRutKet", void 0);
    o([y], e.prototype, "maxLengthName", void 0);
    return e = o([m], e);
  }(a.default);
i.default = S;
void 0;
