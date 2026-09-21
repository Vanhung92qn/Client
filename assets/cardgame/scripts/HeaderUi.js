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
var GamePlayManager = require("./GamePlayManager"),
  StringUtil = require("./StringUtil"),
  GameDefine = require("./GameDefine"),
  GameConfigManager = require("./GameConfigManager"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  RemoteSprite = require("./RemoteSprite"),
  MusicPlayer = require("./MusicPlayer"),
  CardGameCommonRequest = require("./CardGameCommonRequest"),
  BroadCast = require("./BroadCast"),
  MiniGameNode = require("./MiniGameNode"),
  GameHTTPManager = require("./GameHTTPManager"),
  ErrorLogHandler = require("./ErrorLogHandler"),
  GameUtils = require("./GameUtils"),
  MessageBus = require("./MessageBus"),
  MessageType = require("./MessageType"),
  SessionData = require("./SessionData"),
  AnalyticService = require("./AnalyticService"),
  AnalyticDefine = require("./AnalyticDefine"),
  RMCThemeConfig = require("./RMCThemeConfig"),
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
      MessageBus.MessageBus.instance.addEventListener(MessageType.MessageType.DepositDocumentStatusUpdate, this.onMessageReceived, this);
      MessageBus.MessageBus.instance.addEventListener(MessageType.MessageType.DepositDocumentHideTip, this.onMessageHideTip, this);
      MessageBus.MessageBus.instance.addEventListener(MessageType.MessageType.DepositComplainStatusUpdate, this.onMessageReceived, this);
      MessageBus.MessageBus.instance.addEventListener(MessageType.MessageType.DepositComplainHideTip, this.onMessageHideTip, this);
      cc.director.on(GameDefine.GameEventMessage.ACTIVE_PHONE_SUCCESS, this.onActivePhoneSuccess, this);
    };
    e.prototype.hideBackButtonOnWebccIfNeeded = function() {
      if (GameConfigManager.default.getInstance().isLoginWebccNoWallet && 0 != StringUtil.default.isNullOrEmpty(GameConfigManager.default.getInstance().webccHomePage) && this
        .btnBack) {
        this.btnBack.active = false;
      }
    };
    e.prototype.start = function() {
      if ("FootterRoomUi" == this.node.name && (i.instance = this), null !== GamePlayManager.default.getInstance().displayName && void 0 !== GamePlayManager.default
        .getInstance().displayName && (null != this.nameUserLb && void 0 != this.nameUserLb && (this.nameUserLb.string = GamePlayManager.default
          .getInstance().displayName, this.processUIName()), null != this.moneyUserLb && void 0 != this.moneyUserLb && (this.moneyUserLb
          .string = StringUtil.default.formatMoneyNumberWithColom(GamePlayManager.default.getInstance().gold)), this.tempGold = GamePlayManager.default.getInstance().gold),
        this.updateAvarta(), null !== this.iconVip && (this.iconVip.active = false), SessionData.SessionData.isShowingUpdateDocumentTooltip || this
        .tryShowNodeKichHoat(), null != this.textKichHoat && void 0 != this.textKichHoat && (this.textKichHoat.string = GameConfigManager.default
          .getInstance().activePhoneNumberData.textKichHoat), 0 == StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().token) ? (null != this
          .normalLobby && (this.normalLobby.active = true), null != this.publicLobby && (this.publicLobby.active = false)) : (null != this
          .normalLobby && (this.normalLobby.active = false), null != this.publicLobby && (this.publicLobby.active = true)), null != this
        .logoWebcc && (this.nodeWebcc.active = false), (GameConfigManager.default.getInstance().isLoginWebcc || GameConfigManager.default.getInstance()
          .isLoginWebccNoWallet) && this.hideNodeKichHoat(), GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        if (null == GameConfigManager.default.getInstance().webccBrand || 0 == GameConfigManager.default.getInstance().webccBrand.length) {
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
          var t = GameUtils.getWccBrandUrl(GameConfigManager.default.getInstance().webccBrand, GameUtils.WccBrandImageType.Header280);
          if (0 == StringUtil.default.isNullOrEmpty(t)) {
            GameUtils.downloadAndShowImage(this.logoWebcc, t);
          }
        }
      }
      if (GameConfigManager.default.getInstance().isLoginWebcc && (null != this.logoHeader && (this.logoHeader.active = false), null != this.logoWebcc)) {
        this.nodeWebcc.active = true;
        this.logoWebcc.node.active = true;
        t = GameUtils.getWccBrandUrl(GameConfigManager.default.getInstance().webccBrand, GameUtils.WccBrandImageType.Header280);
        if (0 == StringUtil.default.isNullOrEmpty(t)) {
          GameUtils.downloadAndShowImage(this.logoWebcc, t);
        }
      }
      switch (GameConfigManager.default.getInstance().enviromentName.includes("caorua") ? null != this.nodeDomain && (this.nodeDomain.active = true) :
        null != this.nodeDomain && (this.nodeDomain.active = false), RMCThemeConfig.getCurrentTheme()) {
        case RMCThemeConfig.ThemeType.HAPPY_NEW_YEAR:
          if (this.lsNodeNewYearDecoration.length > 0) {
            for (var e = 0; e < this.lsNodeNewYearDecoration.length; e++) {
              this.lsNodeNewYearDecoration[e].active = true;
            }
          }
          break;
        case RMCThemeConfig.ThemeType.MID_AUTUMN_FESTIVAL:
          if (this.lsNodeMoonFestivalDecoration.length > 0) {
            for (e = 0; e < this.lsNodeMoonFestivalDecoration.length; e++) {
              this.lsNodeMoonFestivalDecoration[e].active = true;
            }
          }
          break;
        case RMCThemeConfig.ThemeType.NOEL:
          if (this.lsNodeNoelDecoration.length > 0) {
            for (e = 0; e < this.lsNodeNoelDecoration.length; e++) {
              this.lsNodeNoelDecoration[e].active = true;
            }
          }
          break;
        case RMCThemeConfig.ThemeType.VN_304:
          if (this.lsNode304Decoration.length > 0) {
            for (e = 0; e < this.lsNode304Decoration.length; e++) {
              this.lsNode304Decoration[e].active = true;
            }
          }
          break;
        case RMCThemeConfig.ThemeType.WORLD_CUP:
          if (this.lsNodeWorldcupDecoration.length > 0) {
            for (e = 0; e < this.lsNodeWorldcupDecoration.length; e++) {
              this.lsNodeWorldcupDecoration[e].active = true;
            }
          }
        case RMCThemeConfig.ThemeType.HALLOWEEN:
          if (this.lsNodeHalloweenDecoration.length > 0) {
            for (e = 0; e < this.lsNodeHalloweenDecoration.length; e++) {
              this.lsNodeHalloweenDecoration[e].active = true;
            }
          }
      }
    };
    e.prototype.tryShowNodeKichHoat = function() {
      if (this.nodeKickHoat && StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().phoneNumber) && 0 == StringUtil.default.isNullOrEmpty(GamePlayManager.default
          .getInstance().token) && GamePlayManager.default.getInstance().numShowThongBao > 0 && GamePlayManager.default.getInstance().gold < 2001) {
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
      cc.sys.openURL(GameConfigManager.default.getInstance().homeUrl);
    };
    e.prototype.updateUI = function() {
      if (null != this.moneyUserLb && void 0 != this.moneyUserLb) {
        this.moneyUserLb.string = StringUtil.default.formatMoneyNumberWithColom(GamePlayManager.default.getInstance().gold);
      }
      this.tempGold = GamePlayManager.default.getInstance().gold;
      if (GamePlayManager.default.getInstance().gold > 2e3 && null !== this.nodeKickHoat && void 0 !== this.nodeKickHoat && this.nodeKickHoat.active) {
        this.nodeKickHoat.active = false;
      }
    };
    e.prototype.onDestroy = function() {
      MessageBus.MessageBus.instance.removeEventListener(MessageType.MessageType.DepositDocumentStatusUpdate, this);
      MessageBus.MessageBus.instance.removeEventListener(MessageType.MessageType.DepositDocumentHideTip, this);
      MessageBus.MessageBus.instance.removeEventListener(MessageType.MessageType.DepositComplainStatusUpdate, this);
      MessageBus.MessageBus.instance.removeEventListener(MessageType.MessageType.DepositComplainHideTip, this);
      cc.director.off(GameDefine.GameEventMessage.ACTIVE_PHONE_SUCCESS, this.onActivePhoneSuccess, this);
    };
    e.prototype.onMessageHideTip = function(t, e) {
      if (!(SessionData.SessionData.isShowingUpdateDocumentTooltip || SessionData.SessionData.isShowingComplainDocumentTooltip)) {
        this.tryShowNodeKichHoat();
      }
    };
    e.prototype.onMessageReceived = function(t, e) {
      if (this && this.isValid) {
        if (SessionData.SessionData.isShowingUpdateDocumentTooltip || SessionData.SessionData.isShowingComplainDocumentTooltip) {
          this.hideNodeKichHoat();
        } else {
          this.tryShowNodeKichHoat();
        }
      }
    };
    e.prototype.updateUIName = function() {
      this.nameUserLb.string = GamePlayManager.default.getInstance().displayName;
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
              return e ? [3, 6] : 0 != this.nameUserLb.node.getContentSize().width ? [3, 3] : [4, GameUtils.delay(20)];
            case 2:
              return i.sent(), [3, 1];
            case 3:
              return t ? (t = false, [4, GameUtils.delay(20)]) : [3, 5];
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
      this.moneyUserLb.string = StringUtil.default.formatMoneyNumberWithColom(this.tempGold + t);
    };
    e.prototype.updateAvarta = function() {
      if (null !== this.avatar && void 0 !== this.avatar) {
        this.avatar.loadUserAvarta();
        if (null != this.avatar.spriteFrame) {
          GamePlayManager.default.getInstance().spriteFrameAvatar = this.avatar.spriteFrame;
        }
      }
    };
    e.prototype.onclickBack = function() {
      if (!GameConfigManager.default.getInstance().isShowPopupDone) {
        AnalyticService.default.instance.trackCustomQ(AnalyticDefine.AnaltyciEventType.CLICK, "exit_cg_" + GamePlayManager.default.getInstance().gameID);
        if (GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
          window.location.href = GameConfigManager.default.getInstance().webccHomePage;
        } else {
          if (this.isKTEK) {
            if (!StringUtil.default.isNullOrEmpty(GameConfigManager.default.getInstance().tokenFB)) {
              GameConfigManager.default.getInstance().tokenFB = "";
              GamePlayManager.default.getInstance().fb_id = "";
              cc.sys.isNative;
            }
            CardGameCommonRequest.default.getInstance().sendLogout();
            cc.sys.localStorage.setItem("isAutoLogin", false);
            cc.sys.localStorage.setItem("token", "");
            cc.sys.localStorage.setItem("defaultLogin", 1);
          } else {
            GameConfigManager.default.getInstance().isShowPopupDone = true;
            MusicPlayer.default.getInstance().playbtnClick();
            CommonPrefabsManager.default.getInstance().showLoading();
            cc.director.preloadScene(GameDefine.GameConfigs.SceneName.Lobby, function() {
              CommonPrefabsManager.default.getInstance().hideLoading();
              cc.director.loadScene(GameDefine.GameConfigs.SceneName.Lobby);
            });
          }
        }
      }
    };
    e.prototype.onclickHomePage = function() {
      if (GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        window.location.href = GameConfigManager.default.getInstance().webccHomePage;
      } else {
        MusicPlayer.default.getInstance().playbtnClick();
        cc.sys.openURL(GameConfigManager.default.getInstance().homeUrl);
      }
    };
    e.prototype.onClickSetting = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      CommonPrefabsManager.default.getInstance().showPopupSetting();
      this.closeMenu();
    };
    e.prototype.onClickMail = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      if (StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().token)) {
        CommonPrefabsManager.default.getInstance().showPopupDangNhap(this.loginWithToken.bind(this));
      } else {
        if (GameConfigManager.default.getInstance().listcommingSoonGames.indexOf("inbox") > -1) {
          CommonPrefabsManager.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
        } else {
          CommonPrefabsManager.default.getInstance().showPopupMail();
        }
      }
    };
    e.prototype.onClickTinTuc = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      if (GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
      } else {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
        this.closeMenu();
      }
    };
    e.prototype.onClickBXH = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      if (GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
      } else {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
        this.closeMenu();
      }
    };
    e.prototype.onClickEditName = function() {
      if (!GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        MusicPlayer.default.getInstance().playbtnClick();
        CommonPrefabsManager.default.getInstance().showPopupChangeUserDisplayName(this);
      }
    };
    e.prototype.onClickAddGold = function() {
      if (!GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        MusicPlayer.default.getInstance().playbtnShopClick();
        if (!(GameConfigManager.default.getInstance().isShowPopupDone || GameConfigManager.default.getInstance().isLoginWebcc)) {
          CommonPrefabsManager.default.getInstance().showPopupNap();
        }
      }
    };
    e.prototype.onClickAvatar = function() {
      if (!GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        MusicPlayer.default.getInstance().playbtnClick();
        CommonPrefabsManager.default.getInstance().showPopupUserInfo();
      }
    };
    e.prototype.onClickKickHoat = function() {
      if (!GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        MusicPlayer.default.getInstance().playbtnClick();
        CommonPrefabsManager.default.getInstance().showPopupActivePhoneNumber(this.nodeKickHoat);
      }
    };
    e.prototype.onClickMenu = function() {
      if (!GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        MusicPlayer.default.getInstance().playbtnClick();
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
              return this.btnBack && (t = this.btnBack.getComponent(cc.Button)) ? (t.interactable = false, [4, GameUtils.delay(1e3)]) : [
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
        if (null != BroadCast.default.instance) {
          BroadCast.default.instance.show(null);
        }
        if (null != BroadCast.default.instanceBigWin) {
          BroadCast.default.instanceBigWin.show(null);
        }
      }
    };
    e.prototype.onDisable = function() {
      i.isActive = false;
      i.nodeBroadcast = null;
      i.nodeBroadcastBigWin = null;
      if (null != BroadCast.default.instance) {
        BroadCast.default.instance.hide(true);
        BroadCast.default.instance.node.parent = MiniGameNode.default.instance.topUI;
      }
      if (null != BroadCast.default.instanceBigWin) {
        BroadCast.default.instanceBigWin.hide(true);
        BroadCast.default.instanceBigWin.node.parent = MiniGameNode.default.instance.topUI;
      }
    };
    e.prototype.onClickDangNhap = function() {
      if (!GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        CommonPrefabsManager.default.getInstance().showPopupDangNhap(this.loginWithToken.bind(this));
      }
    };
    e.prototype.onClickDangKy = function() {
      if (!GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        if (GameConfigManager.default.getInstance().allowRegister) {
          CommonPrefabsManager.default.getInstance().showPopupDangKy(this.loginWithToken.bind(this));
        } else {
          GameUtils.showPopupNewBrandInfo();
        }
      }
    };
    e.prototype.onClickFB = function() {
      if (MusicPlayer.default.getInstance().playbtnClick(), GameConfigManager.default.getInstance().enviromentName.includes("hit")) {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng \u0111ang ph\xe1t tri\u1ec3n");
      } else if (cc.sys.isNative) {
        if (GameConfigManager.default.getInstance().isforcebrand) {
          if (cc.sys.platform == cc.sys.ANDROID) {
            e = "";
            e = "&state=" + (StringUtil.default.isNullOrEmpty(GameConfigManager.default.getInstance().aff_id) ? JSON.stringify({
              app_id: GameConfigManager.default.getInstance().app_id,
              fg: GamePlayManager.default.getInstance().fingerprint
            }) : JSON.stringify({
              aff_id: GameConfigManager.default.getInstance().aff_id,
              app_id: GameConfigManager.default.getInstance().app_id,
              fg: GamePlayManager.default.getInstance().fingerprint
            }));
            i = "https://www.facebook.com/v4.0/dialog/oauth?client_id=" + GameConfigManager.default.getInstance().Appid_FaceBook +
              "&response_type=token" + e + "&redirect_uri=" + GameConfigManager.default.getInstance().urlFBCallback;
            cc.sys.openURL(i);
          } else {
            var t = GameConfigManager.default.getInstance().homeUrl;
            cc.sys.openURL(t + "?isforcebrand=true");
          }
        } else {
          if (sdkbox) {
            cc.sys.localStorage.setItem("isAutoLogin", false);
            GameConfigManager.default.getInstance().tokenFB = "";
            if (sdkbox.PluginFacebook.isLoggedIn()) {
              GameConfigManager.default.getInstance().tokenFB = sdkbox.PluginFacebook.getAccessToken();
              this.loginWithToken();
            } else {
              sdkbox.PluginFacebook.login();
              this.isLoginFB = true;
            }
          }
        }
      } else {
        var e = "";
        if (!StringUtil.default.isNullOrEmpty(StringUtil.default.getQueryStringValue("aff_id"))) {
          GameConfigManager.default.getInstance().aff_id = StringUtil.default.getQueryStringValue("aff_id");
        }
        e = "&state=" + (StringUtil.default.isNullOrEmpty(GameConfigManager.default.getInstance().aff_id) ? JSON.stringify({
          app_id: GameConfigManager.default.getInstance().app_id,
          fg: GamePlayManager.default.getInstance().fingerprint
        }) : JSON.stringify({
          aff_id: GameConfigManager.default.getInstance().aff_id,
          app_id: GameConfigManager.default.getInstance().app_id,
          fg: GamePlayManager.default.getInstance().fingerprint
        }));
        var i = "https://www.facebook.com/v4.0/dialog/oauth?client_id=" + GameConfigManager.default.getInstance().Appid_FaceBook +
          "&response_type=token" + e + "&redirect_uri=" + GameConfigManager.default.getInstance().urlFBCallback;
        window.location.href = i;
      }
    };
    e.prototype.loginWithFB = function() {
      var t = this,
        e = "";
      if (!StringUtil.default.isNullOrEmpty(GameConfigManager.default.getInstance().aff_id)) {
        e = "&aff_id=" + GameConfigManager.default.getInstance().aff_id;
      }
      GameHTTPManager.default.getInstance().sendGetHttpRequest(GameConfigManager.default.getInstance().urlLoginFB + GameConfigManager.default.getInstance().tokenFB + e + "&app_id=" + GameConfigManager
        .default.getInstance().app_id,
        function(e) {
          var i = e.data[0].token;
          t.loginWithToken(i, e.data[0].session_id);
          GamePlayManager.default.getInstance().username = e.data[0].username;
          GamePlayManager.default.getInstance().displayName = e.data[0].fullname;
          if (null !== e.data[0].avatar && void 0 !== e.data[0].avatar) {
            GamePlayManager.default.getInstance().avaURL = e.data[0].avatar;
          }
          if (null !== e.data[0].fb_id && void 0 !== e.data[0].fb_id && 0 !== e.data[0].fb_id.toString().localeCompare("undefined")) {
            GamePlayManager.default.getInstance().fb_id = e.data[0].fb_id;
          }
          if (void 0 !== e.data[0].aff_id && null !== e.data[0].aff_id) {
            GameConfigManager.default.getInstance().aff_id = e.data[0].aff_id;
          }
        },
        function(t) {
          CommonPrefabsManager.default.getInstance().showPopupMessageUtil(t);
          ErrorLogHandler.default.getInstance().sendLogginError(t);
        });
    };
    e.prototype.loginWithToken = function(t, e) {
      if (void 0 === t) {
        t = "";
      }
      if (void 0 === e) {
        e = "";
      }
      GamePlayManager.default.getInstance().forceLogin = true;
      GamePlayManager.default.getInstance().tokenTemp = t;
      GamePlayManager.default.getInstance().session_idTemp = e;
      cc.director.loadScene(GameDefine.GameConfigs.SceneName.Login);
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
    // 🔴 `cc.Boolean`, KHÔNG phải `Boolean` của JS. Bản dịch ngược sinh ra kiểu JS thuần (mã
    // TypeScript gốc viết `boolean`), Cocos 2.4 không nhận nên cảnh báo mỗi lần nạp project:
    //     The type of "HeaderUi.isKTEK" must be cc.Boolean, not Boolean.
    // và ô đó không lưu/đọc được từ prefab. Ở đây vô hại vì KHÔNG prefab nào lưu hai ô này (đã
    // soát: chúng luôn lấy mặc định isKTEK=false, allowEnable=true) — nhưng để nguyên thì mỗi
    // lần mở project lại thêm hai dòng cảnh báo, riết rồi không ai đọc cảnh báo nữa.
    o([M(cc.Boolean)], e.prototype, "isKTEK", void 0);
    o([M(cc.Boolean)], e.prototype, "allowEnable", void 0);
    o([M(cc.Label)], e.prototype, "nameUserLb", void 0);
    o([M(cc.Label)], e.prototype, "moneyUserLb", void 0);
    o([M(RemoteSprite.default)], e.prototype, "avatar", void 0);
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
