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
  },
  a = this && this.__awaiter || function(t, e, i, n) {
    return new(i || (i = Promise))(function(o, a) {
      function s(t) {
        try {
          c(n.next(t));
        } catch (t) {
          a(t);
        }
      }

      function r(t) {
        try {
          c(n.throw(t));
        } catch (t) {
          a(t);
        }
      }

      function c(t) {
        if (t.done) {
          o(t.value);
        } else {
          new i(function(e) {
            e(t.value);
          }).then(s, r);
        }
      }
      c((n = n.apply(t, e || [])).next());
    });
  },
  s = this && this.__generator || function(t, e) {
    var i,
      n,
      o,
      a,
      s = {
        label: 0,
        sent: function() {
          if (1 & o[0]) {
            throw o[1];
          }
          return o[1];
        },
        trys: [],
        ops: []
      };
    a = {
      next: r(0),
      throw: r(1),
      return: r(2)
    };
    if ("function" == typeof Symbol) {
      a[Symbol.iterator] = function() {
        return this;
      };
    }
    return a;

    function r(t) {
      return function(e) {
        return c([t, e]);
      };
    }

    function c(a) {
      if (i) {
        throw new TypeError("Generator is already executing.");
      }
      for (; s;) {
        try {
          if (i = 1, n && (o = 2 & a[0] ? n.return : a[0] ? n.throw || ((o = n.return) && o.call(n), 0) : n.next) && !(o = o.call(n, a[1]))
            .done) {
            return o;
          }
          switch (n = 0, o && (a = [2 & a[0], o.value]), a[0]) {
            case 0:
            case 1:
              o = a;
              break;
            case 4:
              return s.label++, {
                value: a[1],
                done: false
              };
            case 5:
              s.label++;
              n = a[1];
              a = [0];
              continue;
            case 7:
              a = s.ops.pop();
              s.trys.pop();
              continue;
            default:
              if (!(o = (o = s.trys).length > 0 && o[o.length - 1]) && (6 === a[0] || 2 === a[0])) {
                s = 0;
                continue;
              }
              if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
                s.label = a[1];
                break;
              }
              if (6 === a[0] && s.label < o[1]) {
                s.label = o[1];
                o = a;
                break;
              }
              if (o && s.label < o[2]) {
                s.label = o[2];
                s.ops.push(a);
                break;
              }
              o[2] && s.ops.pop();
              s.trys.pop();
              continue;
          }
          a = e.call(t, s);
        } catch (t) {
          a = [6, t];
          n = 0;
        } finally {
          i = o = 0;
        }
      }
      if (5 & a[0]) {
        throw a[1];
      }
      return {
        value: a[0] ? a[1] : void 0,
        done: true
      };
    }
  };
Object.defineProperty(i, "__esModule", {
  value: true
});
var r = require("./GamePlayManager"),
  c = require("./StringUtil"),
  l = require("./GameDefine"),
  h = require("./GameConfigManager"),
  u = require("./CommonPrefabsManager"),
  d = require("./RemoteSprite"),
  p = require("./MusicPlayer"),
  f = require("./CardGameCommonRequest"),
  g = require("./BroadCast"),
  m = require("./MiniGameNode"),
  y = require("./GameHTTPManager"),
  S = require("./ErrorLogHandler"),
  _ = require("./GameUtils"),
  v = require("./MessageBus"),
  b = require("./MessageType"),
  C = require("./SessionData"),
  T = require("./AnalyticService"),
  E = require("./AnalyticDefine"),
  I = require("./RMCThemeConfig"),
  A = cc._decorator,
  P = A.ccclass,
  M = A.property,
  O = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.isKTEK = false;
      e.allowEnable = true;
      e.nameUserLb = null;
      e.moneyUserLb = null;
      e.avatar = null;
      e.tempGold = 0;
      e.btnBack = null;
      e.nodeRightUI = null;
      e.nodeKickHoat = null;
      e.nodeKickHoatBg = null;
      e.nodeMenuList = null;
      e.nodeMenuListPublic = null;
      e.nodeBroadCast = null;
      e.nodeBroadCastBigWin = null;
      e.normalLobby = null;
      e.publicLobby = null;
      e.logoWebcc = null;
      e.nodeWebcc = null;
      e.logoHeader = null;
      e.nodeDomain = null;
      e.textKichHoat = null;
      e.iconVip = null;
      e.lsNodeNoelDecoration = [];
      e.lsNodeNewYearDecoration = [];
      e.lsNodeMoonFestivalDecoration = [];
      e.lsNode304Decoration = [];
      e.lsNodeWorldcupDecoration = [];
      e.lsNodeHalloweenDecoration = [];
      e.isLoginFB = false;
      return e;
    }
    var i;
    n(e, t);
    i = e;
    e.prototype.onLoad = function() {
      v.MessageBus.instance.addEventListener(b.MessageType.DepositDocumentStatusUpdate, this.onMessageReceived, this);
      v.MessageBus.instance.addEventListener(b.MessageType.DepositDocumentHideTip, this.onMessageHideTip, this);
      v.MessageBus.instance.addEventListener(b.MessageType.DepositComplainStatusUpdate, this.onMessageReceived, this);
      v.MessageBus.instance.addEventListener(b.MessageType.DepositComplainHideTip, this.onMessageHideTip, this);
      cc.director.on(l.GameEventMessage.ACTIVE_PHONE_SUCCESS, this.onActivePhoneSuccess, this);
    };
    e.prototype.hideBackButtonOnWebccIfNeeded = function() {
      if (h.default.getInstance().isLoginWebccNoWallet && 0 != c.default.isNullOrEmpty(h.default.getInstance().webccHomePage) && this
        .btnBack) {
        this.btnBack.active = false;
      }
    };
    e.prototype.start = function() {
      if ("FootterRoomUi" == this.node.name && (i.instance = this), null !== r.default.getInstance().displayName && void 0 !== r.default
        .getInstance().displayName && (null != this.nameUserLb && void 0 != this.nameUserLb && (this.nameUserLb.string = r.default
          .getInstance().displayName, this.processUIName()), null != this.moneyUserLb && void 0 != this.moneyUserLb && (this.moneyUserLb
          .string = c.default.formatMoneyNumberWithColom(r.default.getInstance().gold)), this.tempGold = r.default.getInstance().gold),
        this.updateAvarta(), null !== this.iconVip && (this.iconVip.active = false), C.SessionData.isShowingUpdateDocumentTooltip || this
        .tryShowNodeKichHoat(), null != this.textKichHoat && void 0 != this.textKichHoat && (this.textKichHoat.string = h.default
          .getInstance().activePhoneNumberData.textKichHoat), 0 == c.default.isNullOrEmpty(r.default.getInstance().token) ? (null != this
          .normalLobby && (this.normalLobby.active = true), null != this.publicLobby && (this.publicLobby.active = false)) : (null != this
          .normalLobby && (this.normalLobby.active = false), null != this.publicLobby && (this.publicLobby.active = true)), null != this
        .logoWebcc && (this.nodeWebcc.active = false), (h.default.getInstance().isLoginWebcc || h.default.getInstance()
          .isLoginWebccNoWallet) && this.hideNodeKichHoat(), h.default.getInstance().isLoginWebccNoWallet) {
        if (null == h.default.getInstance().webccBrand || 0 == h.default.getInstance().webccBrand.length) {
          if (null != this.logoHeader) {
            this.logoHeader.active = false;
          }
          if (null != this.logoWebcc) {
            this.logoWebcc.node.active = false;
            this.nodeWebcc.active = false;
          }
        } else if (null != this.logoHeader && (this.logoHeader.active = false), null != this.logoWebcc) {
          this.nodeWebcc.active = true;
          this.logoWebcc.node.active = true;
          var t = _.getWccBrandUrl(h.default.getInstance().webccBrand, _.WccBrandImageType.Header280);
          if (0 == c.default.isNullOrEmpty(t)) {
            _.downloadAndShowImage(this.logoWebcc, t);
          }
        }
      }
      if (h.default.getInstance().isLoginWebcc && (null != this.logoHeader && (this.logoHeader.active = false), null != this.logoWebcc)) {
        this.nodeWebcc.active = true;
        this.logoWebcc.node.active = true;
        t = _.getWccBrandUrl(h.default.getInstance().webccBrand, _.WccBrandImageType.Header280);
        if (0 == c.default.isNullOrEmpty(t)) {
          _.downloadAndShowImage(this.logoWebcc, t);
        }
      }
      switch (h.default.getInstance().enviromentName.includes("go88") ? null != this.nodeDomain && (this.nodeDomain.active = true) :
        null != this.nodeDomain && (this.nodeDomain.active = false), I.getCurrentTheme()) {
        case I.ThemeType.HAPPY_NEW_YEAR:
          if (this.lsNodeNewYearDecoration.length > 0) {
            for (var e = 0; e < this.lsNodeNewYearDecoration.length; e++) {
              this.lsNodeNewYearDecoration[e].active = true;
            }
          }
          break;
        case I.ThemeType.MID_AUTUMN_FESTIVAL:
          if (this.lsNodeMoonFestivalDecoration.length > 0) {
            for (e = 0; e < this.lsNodeMoonFestivalDecoration.length; e++) {
              this.lsNodeMoonFestivalDecoration[e].active = true;
            }
          }
          break;
        case I.ThemeType.NOEL:
          if (this.lsNodeNoelDecoration.length > 0) {
            for (e = 0; e < this.lsNodeNoelDecoration.length; e++) {
              this.lsNodeNoelDecoration[e].active = true;
            }
          }
          break;
        case I.ThemeType.VN_304:
          if (this.lsNode304Decoration.length > 0) {
            for (e = 0; e < this.lsNode304Decoration.length; e++) {
              this.lsNode304Decoration[e].active = true;
            }
          }
          break;
        case I.ThemeType.WORLD_CUP:
          if (this.lsNodeWorldcupDecoration.length > 0) {
            for (e = 0; e < this.lsNodeWorldcupDecoration.length; e++) {
              this.lsNodeWorldcupDecoration[e].active = true;
            }
          }
        case I.ThemeType.HALLOWEEN:
          if (this.lsNodeHalloweenDecoration.length > 0) {
            for (e = 0; e < this.lsNodeHalloweenDecoration.length; e++) {
              this.lsNodeHalloweenDecoration[e].active = true;
            }
          }
      }
    };
    e.prototype.tryShowNodeKichHoat = function() {
      if (this.nodeKickHoat && c.default.isNullOrEmpty(r.default.getInstance().phoneNumber) && 0 == c.default.isNullOrEmpty(r.default
          .getInstance().token) && r.default.getInstance().numShowThongBao > 0 && r.default.getInstance().gold < 2001) {
        this.nodeKickHoat.active = true;
        this.nodeKickHoatBg.stopAllActions();
        this.nodeKickHoatBg.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.2, 1.1), cc.scaleTo(.2, 1))));
      }
    };
    e.prototype.hideNodeKichHoat = function() {
      if (this.nodeKickHoat) {
        this.nodeKickHoatBg.stopAllActions();
        this.nodeKickHoat.active = false;
      }
    };
    e.prototype.onClickTrangChu = function() {
      cc.sys.openURL(h.default.getInstance().homeUrl);
    };
    e.prototype.updateUI = function() {
      if (null != this.moneyUserLb && void 0 != this.moneyUserLb) {
        this.moneyUserLb.string = c.default.formatMoneyNumberWithColom(r.default.getInstance().gold);
      }
      this.tempGold = r.default.getInstance().gold;
      if (r.default.getInstance().gold > 2e3 && null !== this.nodeKickHoat && void 0 !== this.nodeKickHoat && this.nodeKickHoat.active) {
        this.nodeKickHoat.active = false;
      }
    };
    e.prototype.onDestroy = function() {
      v.MessageBus.instance.removeEventListener(b.MessageType.DepositDocumentStatusUpdate, this);
      v.MessageBus.instance.removeEventListener(b.MessageType.DepositDocumentHideTip, this);
      v.MessageBus.instance.removeEventListener(b.MessageType.DepositComplainStatusUpdate, this);
      v.MessageBus.instance.removeEventListener(b.MessageType.DepositComplainHideTip, this);
      cc.director.off(l.GameEventMessage.ACTIVE_PHONE_SUCCESS, this.onActivePhoneSuccess, this);
    };
    e.prototype.onMessageHideTip = function(t, e) {
      if (!(C.SessionData.isShowingUpdateDocumentTooltip || C.SessionData.isShowingComplainDocumentTooltip)) {
        this.tryShowNodeKichHoat();
      }
    };
    e.prototype.onMessageReceived = function(t, e) {
      if (this && this.isValid) {
        if (C.SessionData.isShowingUpdateDocumentTooltip || C.SessionData.isShowingComplainDocumentTooltip) {
          this.hideNodeKichHoat();
        } else {
          this.tryShowNodeKichHoat();
        }
      }
    };
    e.prototype.updateUIName = function() {
      this.nameUserLb.string = r.default.getInstance().displayName;
      this.processUIName(true);
    };
    e.prototype.processUIName = function(t) {
      if (void 0 === t) {
        t = false;
      }
      return a(this, void 0, Promise, function() {
        var e;
        return s(this, function(i) {
          switch (i.label) {
            case 0:
              e = false;
              i.label = 1;
            case 1:
              return e ? [3, 6] : 0 != this.nameUserLb.node.getContentSize().width ? [3, 3] : [4, _.delay(20)];
            case 2:
              return i.sent(), [3, 1];
            case 3:
              return t ? (t = false, [4, _.delay(20)]) : [3, 5];
            case 4:
              i.sent();
              i.label = 5;
            case 5:
              return this.nameUserLb.node.getContentSize().width > 240 && (this.nameUserLb.string = this.nameUserLb.string
                .substring(0, 9) + ".."), e = true, [3, 1];
            case 6:
              return [2];
          }
        });
      });
    };
    e.prototype.showTempMeny = function(t) {
      this.moneyUserLb.string = c.default.formatMoneyNumberWithColom(this.tempGold + t);
    };
    e.prototype.updateAvarta = function() {
      if (null !== this.avatar && void 0 !== this.avatar) {
        this.avatar.loadUserAvarta();
        if (null != this.avatar.spriteFrame) {
          r.default.getInstance().spriteFrameAvatar = this.avatar.spriteFrame;
        }
      }
    };
    e.prototype.onclickBack = function() {
      if (!h.default.getInstance().isShowPopupDone) {
        T.default.instance.trackCustomQ(E.AnaltyciEventType.CLICK, "exit_cg_" + r.default.getInstance().gameID);
        if (h.default.getInstance().isLoginWebccNoWallet) {
          window.location.href = h.default.getInstance().webccHomePage;
        } else {
          if (this.isKTEK) {
            if (!c.default.isNullOrEmpty(h.default.getInstance().tokenFB)) {
              h.default.getInstance().tokenFB = "";
              r.default.getInstance().fb_id = "";
              cc.sys.isNative;
            }
            f.default.getInstance().sendLogout();
            cc.sys.localStorage.setItem("isAutoLogin", false);
            cc.sys.localStorage.setItem("token", "");
            cc.sys.localStorage.setItem("defaultLogin", 1);
          } else {
            h.default.getInstance().isShowPopupDone = true;
            p.default.getInstance().playbtnClick();
            u.default.getInstance().showLoading();
            cc.director.preloadScene(l.GameConfigs.SceneName.Lobby, function() {
              u.default.getInstance().hideLoading();
              cc.director.loadScene(l.GameConfigs.SceneName.Lobby);
            });
          }
        }
      }
    };
    e.prototype.onclickHomePage = function() {
      if (h.default.getInstance().isLoginWebccNoWallet) {
        window.location.href = h.default.getInstance().webccHomePage;
      } else {
        p.default.getInstance().playbtnClick();
        cc.sys.openURL(h.default.getInstance().homeUrl);
      }
    };
    e.prototype.onClickSetting = function() {
      p.default.getInstance().playbtnClick();
      u.default.getInstance().showPopupSetting();
      this.closeMenu();
    };
    e.prototype.onClickMail = function() {
      p.default.getInstance().playbtnClick();
      if (c.default.isNullOrEmpty(r.default.getInstance().token)) {
        u.default.getInstance().showPopupDangNhap(this.loginWithToken.bind(this));
      } else {
        if (h.default.getInstance().listcommingSoonGames.indexOf("inbox") > -1) {
          u.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
        } else {
          u.default.getInstance().showPopupMail();
        }
      }
    };
    e.prototype.onClickTinTuc = function() {
      p.default.getInstance().playbtnClick();
      if (h.default.getInstance().isLoginWebccNoWallet) {
        u.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
      } else {
        u.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
        this.closeMenu();
      }
    };
    e.prototype.onClickBXH = function() {
      p.default.getInstance().playbtnClick();
      if (h.default.getInstance().isLoginWebccNoWallet) {
        u.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
      } else {
        u.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
        this.closeMenu();
      }
    };
    e.prototype.onClickEditName = function() {
      if (!h.default.getInstance().isLoginWebccNoWallet) {
        p.default.getInstance().playbtnClick();
        u.default.getInstance().showPopupChangeUserDisplayName(this);
      }
    };
    e.prototype.onClickAddGold = function() {
      if (!h.default.getInstance().isLoginWebccNoWallet) {
        p.default.getInstance().playbtnShopClick();
        if (!(h.default.getInstance().isShowPopupDone || h.default.getInstance().isLoginWebcc)) {
          u.default.getInstance().showPopupNap();
        }
      }
    };
    e.prototype.onClickAvatar = function() {
      if (!h.default.getInstance().isLoginWebccNoWallet) {
        p.default.getInstance().playbtnClick();
        u.default.getInstance().showPopupUserInfo();
      }
    };
    e.prototype.onClickKickHoat = function() {
      if (!h.default.getInstance().isLoginWebccNoWallet) {
        p.default.getInstance().playbtnClick();
        u.default.getInstance().showPopupActivePhoneNumber(this.nodeKickHoat);
      }
    };
    e.prototype.onClickMenu = function() {
      if (!h.default.getInstance().isLoginWebccNoWallet) {
        p.default.getInstance().playbtnClick();
        if (null !== this.nodeMenuList && void 0 !== this.nodeMenuList) {
          this.nodeMenuList.active = !this.nodeMenuList.active;
        }
        if (null != i.onMenuOpenCallback) {
          i.onMenuOpenCallback();
        }
      }
    };
    e.prototype.closeMenu = function() {
      if (null !== this.nodeMenuList && void 0 !== this.nodeMenuList) {
        this.nodeMenuList.active = false;
      }
    };
    e.prototype.setHeaderLobby = function() {
      if (!this.isKTEK) {
        this.btnBack.active = false;
      }
    };
    e.prototype.delayActiveButtonBack = function() {
      return a(this, void 0, Promise, function() {
        var t;
        return s(this, function(e) {
          switch (e.label) {
            case 0:
              return this.btnBack && (t = this.btnBack.getComponent(cc.Button)) ? (t.interactable = false, [4, _.delay(1e3)]) : [
                2];
            case 1:
              return e.sent(), t.interactable = true, [2];
          }
        });
      });
    };
    e.prototype.onEnable = function() {
      if (this.allowEnable) {
        i.isActive = true;
        this.delayActiveButtonBack();
        if (null != this.nodeBroadCast) {
          i.nodeBroadcast = this.nodeBroadCast;
        }
        if (null != this.nodeBroadCastBigWin) {
          i.nodeBroadcastBigWin = this.nodeBroadCastBigWin;
        }
        if (null != g.default.instance) {
          g.default.instance.show(null);
        }
        if (null != g.default.instanceBigWin) {
          g.default.instanceBigWin.show(null);
        }
      }
    };
    e.prototype.onDisable = function() {
      i.isActive = false;
      i.nodeBroadcast = null;
      i.nodeBroadcastBigWin = null;
      if (null != g.default.instance) {
        g.default.instance.hide(true);
        g.default.instance.node.parent = m.default.instance.topUI;
      }
      if (null != g.default.instanceBigWin) {
        g.default.instanceBigWin.hide(true);
        g.default.instanceBigWin.node.parent = m.default.instance.topUI;
      }
    };
    e.prototype.onClickDangNhap = function() {
      if (!h.default.getInstance().isLoginWebccNoWallet) {
        u.default.getInstance().showPopupDangNhap(this.loginWithToken.bind(this));
      }
    };
    e.prototype.onClickDangKy = function() {
      if (!h.default.getInstance().isLoginWebccNoWallet) {
        if (h.default.getInstance().allowRegister) {
          u.default.getInstance().showPopupDangKy(this.loginWithToken.bind(this));
        } else {
          _.showPopupNewBrandInfo();
        }
      }
    };
    e.prototype.onClickFB = function() {
      if (p.default.getInstance().playbtnClick(), h.default.getInstance().enviromentName.includes("hit")) {
        u.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng \u0111ang ph\xe1t tri\u1ec3n");
      } else if (cc.sys.isNative) {
        if (h.default.getInstance().isforcebrand) {
          if (cc.sys.platform == cc.sys.ANDROID) {
            e = "";
            e = "&state=" + (c.default.isNullOrEmpty(h.default.getInstance().aff_id) ? JSON.stringify({
              app_id: h.default.getInstance().app_id,
              fg: r.default.getInstance().fingerprint
            }) : JSON.stringify({
              aff_id: h.default.getInstance().aff_id,
              app_id: h.default.getInstance().app_id,
              fg: r.default.getInstance().fingerprint
            }));
            i = "https://www.facebook.com/v4.0/dialog/oauth?client_id=" + h.default.getInstance().Appid_FaceBook +
              "&response_type=token" + e + "&redirect_uri=" + h.default.getInstance().urlFBCallback;
            cc.sys.openURL(i);
          } else {
            var t = h.default.getInstance().homeUrl;
            cc.sys.openURL(t + "?isforcebrand=true");
          }
        } else {
          if (sdkbox) {
            cc.sys.localStorage.setItem("isAutoLogin", false);
            h.default.getInstance().tokenFB = "";
            if (sdkbox.PluginFacebook.isLoggedIn()) {
              h.default.getInstance().tokenFB = sdkbox.PluginFacebook.getAccessToken();
              this.loginWithToken();
            } else {
              sdkbox.PluginFacebook.login();
              this.isLoginFB = true;
            }
          }
        }
      } else {
        var e = "";
        if (!c.default.isNullOrEmpty(c.default.getQueryStringValue("aff_id"))) {
          h.default.getInstance().aff_id = c.default.getQueryStringValue("aff_id");
        }
        e = "&state=" + (c.default.isNullOrEmpty(h.default.getInstance().aff_id) ? JSON.stringify({
          app_id: h.default.getInstance().app_id,
          fg: r.default.getInstance().fingerprint
        }) : JSON.stringify({
          aff_id: h.default.getInstance().aff_id,
          app_id: h.default.getInstance().app_id,
          fg: r.default.getInstance().fingerprint
        }));
        var i = "https://www.facebook.com/v4.0/dialog/oauth?client_id=" + h.default.getInstance().Appid_FaceBook +
          "&response_type=token" + e + "&redirect_uri=" + h.default.getInstance().urlFBCallback;
        window.location.href = i;
      }
    };
    e.prototype.loginWithFB = function() {
      var t = this,
        e = "";
      if (!c.default.isNullOrEmpty(h.default.getInstance().aff_id)) {
        e = "&aff_id=" + h.default.getInstance().aff_id;
      }
      y.default.getInstance().sendGetHttpRequest(h.default.getInstance().urlLoginFB + h.default.getInstance().tokenFB + e + "&app_id=" + h
        .default.getInstance().app_id,
        function(e) {
          var i = e.data[0].token;
          t.loginWithToken(i, e.data[0].session_id);
          r.default.getInstance().username = e.data[0].username;
          r.default.getInstance().displayName = e.data[0].fullname;
          if (null !== e.data[0].avatar && void 0 !== e.data[0].avatar) {
            r.default.getInstance().avaURL = e.data[0].avatar;
          }
          if (null !== e.data[0].fb_id && void 0 !== e.data[0].fb_id && 0 !== e.data[0].fb_id.toString().localeCompare("undefined")) {
            r.default.getInstance().fb_id = e.data[0].fb_id;
          }
          if (void 0 !== e.data[0].aff_id && null !== e.data[0].aff_id) {
            h.default.getInstance().aff_id = e.data[0].aff_id;
          }
        },
        function(t) {
          u.default.getInstance().showPopupMessageUtil(t);
          S.default.getInstance().sendLogginError(t);
        });
    };
    e.prototype.loginWithToken = function(t, e) {
      if (void 0 === t) {
        t = "";
      }
      if (void 0 === e) {
        e = "";
      }
      r.default.getInstance().forceLogin = true;
      r.default.getInstance().tokenTemp = t;
      r.default.getInstance().session_idTemp = e;
      cc.director.loadScene(l.GameConfigs.SceneName.Login);
    };
    e.prototype.onActivePhoneSuccess = function() {
      if (this.nodeKickHoat) {
        this.nodeKickHoat.active = false;
      }
    };
    e.instance = null;
    e.onMenuOpenCallback = null;
    e.isActive = false;
    e.nodeBroadcast = null;
    e.nodeBroadcastBigWin = null;
    o([M(Boolean)], e.prototype, "isKTEK", void 0);
    o([M(Boolean)], e.prototype, "allowEnable", void 0);
    o([M(cc.Label)], e.prototype, "nameUserLb", void 0);
    o([M(cc.Label)], e.prototype, "moneyUserLb", void 0);
    o([M(d.default)], e.prototype, "avatar", void 0);
    o([M(cc.Node)], e.prototype, "btnBack", void 0);
    o([M(cc.Node)], e.prototype, "nodeRightUI", void 0);
    o([M(cc.Node)], e.prototype, "nodeKickHoat", void 0);
    o([M(cc.Node)], e.prototype, "nodeKickHoatBg", void 0);
    o([M(cc.Node)], e.prototype, "nodeMenuList", void 0);
    o([M(cc.Node)], e.prototype, "nodeMenuListPublic", void 0);
    o([M(cc.Node)], e.prototype, "nodeBroadCast", void 0);
    o([M(cc.Node)], e.prototype, "nodeBroadCastBigWin", void 0);
    o([M(cc.Node)], e.prototype, "normalLobby", void 0);
    o([M(cc.Node)], e.prototype, "publicLobby", void 0);
    o([M(cc.Sprite)], e.prototype, "logoWebcc", void 0);
    o([M(cc.Node)], e.prototype, "nodeWebcc", void 0);
    o([M(cc.Node)], e.prototype, "logoHeader", void 0);
    o([M(cc.Node)], e.prototype, "nodeDomain", void 0);
    o([M(cc.Label)], e.prototype, "textKichHoat", void 0);
    o([M(cc.Node)], e.prototype, "iconVip", void 0);
    o([M([cc.Node])], e.prototype, "lsNodeNoelDecoration", void 0);
    o([M([cc.Node])], e.prototype, "lsNodeNewYearDecoration", void 0);
    o([M([cc.Node])], e.prototype, "lsNodeMoonFestivalDecoration", void 0);
    o([M([cc.Node])], e.prototype, "lsNode304Decoration", void 0);
    o([M([cc.Node])], e.prototype, "lsNodeWorldcupDecoration", void 0);
    o([M([cc.Node])], e.prototype, "lsNodeHalloweenDecoration", void 0);
    return e = i = o([P], e);
  }(cc.Component);
i.default = O;
void 0;
