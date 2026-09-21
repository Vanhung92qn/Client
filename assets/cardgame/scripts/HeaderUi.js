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
  },
  __awaiter = this && this.__awaiter || function(t, e, i, n) {
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
  __generator = this && this.__generator || function(t, e) {
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
Object.defineProperty(moduleExports, "__esModule", {
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
  _decorator = cc._decorator,
  ccclass = _decorator.ccclass,
  property = _decorator.property,
  HeaderUi = function(_super) {
    function HeaderUi() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.isKTEK = false;
      _this.allowEnable = true;
      _this.nameUserLb = null;
      _this.moneyUserLb = null;
      _this.avatar = null;
      _this.tempGold = 0;
      _this.btnBack = null;
      _this.nodeRightUI = null;
      _this.nodeKickHoat = null;
      _this.nodeKickHoatBg = null;
      _this.nodeMenuList = null;
      _this.nodeMenuListPublic = null;
      _this.nodeBroadCast = null;
      _this.nodeBroadCastBigWin = null;
      _this.normalLobby = null;
      _this.publicLobby = null;
      _this.logoWebcc = null;
      _this.nodeWebcc = null;
      _this.logoHeader = null;
      _this.nodeDomain = null;
      _this.textKichHoat = null;
      _this.iconVip = null;
      _this.lsNodeNoelDecoration = [];
      _this.lsNodeNewYearDecoration = [];
      _this.lsNodeMoonFestivalDecoration = [];
      _this.lsNode304Decoration = [];
      _this.lsNodeWorldcupDecoration = [];
      _this.lsNodeHalloweenDecoration = [];
      _this.isLoginFB = false;
      return _this;
    }
    var HeaderUi_1;
    __extends(HeaderUi, _super);
    HeaderUi_1 = HeaderUi;
    HeaderUi.prototype.onLoad = function() {
      MessageBus.MessageBus.instance.addEventListener(MessageType.MessageType.DepositDocumentStatusUpdate, this.onMessageReceived, this);
      MessageBus.MessageBus.instance.addEventListener(MessageType.MessageType.DepositDocumentHideTip, this.onMessageHideTip, this);
      MessageBus.MessageBus.instance.addEventListener(MessageType.MessageType.DepositComplainStatusUpdate, this.onMessageReceived, this);
      MessageBus.MessageBus.instance.addEventListener(MessageType.MessageType.DepositComplainHideTip, this.onMessageHideTip, this);
      cc.director.on(GameDefine.GameEventMessage.ACTIVE_PHONE_SUCCESS, this.onActivePhoneSuccess, this);
    };
    HeaderUi.prototype.hideBackButtonOnWebccIfNeeded = function() {
      if (GameConfigManager.default.getInstance().isLoginWebccNoWallet && 0 != StringUtil.default.isNullOrEmpty(GameConfigManager.default.getInstance().webccHomePage) && this
        .btnBack) {
        this.btnBack.active = false;
      }
    };
    HeaderUi.prototype.start = function() {
      if ("FootterRoomUi" == this.node.name && (HeaderUi_1.instance = this), null !== GamePlayManager.default.getInstance().displayName && void 0 !== GamePlayManager.default
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
          var webccLogoUrl = GameUtils.getWccBrandUrl(GameConfigManager.default.getInstance().webccBrand, GameUtils.WccBrandImageType.Header280);
          if (0 == StringUtil.default.isNullOrEmpty(webccLogoUrl)) {
            GameUtils.downloadAndShowImage(this.logoWebcc, webccLogoUrl);
          }
        }
      }
      if (GameConfigManager.default.getInstance().isLoginWebcc && (null != this.logoHeader && (this.logoHeader.active = false), null != this.logoWebcc)) {
        this.nodeWebcc.active = true;
        this.logoWebcc.node.active = true;
        webccLogoUrl = GameUtils.getWccBrandUrl(GameConfigManager.default.getInstance().webccBrand, GameUtils.WccBrandImageType.Header280);
        if (0 == StringUtil.default.isNullOrEmpty(webccLogoUrl)) {
          GameUtils.downloadAndShowImage(this.logoWebcc, webccLogoUrl);
        }
      }
      switch (GameConfigManager.default.getInstance().enviromentName.includes("caorua") ? null != this.nodeDomain && (this.nodeDomain.active = true) :
        null != this.nodeDomain && (this.nodeDomain.active = false), RMCThemeConfig.getCurrentTheme()) {
        case RMCThemeConfig.ThemeType.HAPPY_NEW_YEAR:
          if (this.lsNodeNewYearDecoration.length > 0) {
            for (var decorationIndex = 0; decorationIndex < this.lsNodeNewYearDecoration.length; decorationIndex++) {
              this.lsNodeNewYearDecoration[decorationIndex].active = true;
            }
          }
          break;
        case RMCThemeConfig.ThemeType.MID_AUTUMN_FESTIVAL:
          if (this.lsNodeMoonFestivalDecoration.length > 0) {
            for (decorationIndex = 0; decorationIndex < this.lsNodeMoonFestivalDecoration.length; decorationIndex++) {
              this.lsNodeMoonFestivalDecoration[decorationIndex].active = true;
            }
          }
          break;
        case RMCThemeConfig.ThemeType.NOEL:
          if (this.lsNodeNoelDecoration.length > 0) {
            for (decorationIndex = 0; decorationIndex < this.lsNodeNoelDecoration.length; decorationIndex++) {
              this.lsNodeNoelDecoration[decorationIndex].active = true;
            }
          }
          break;
        case RMCThemeConfig.ThemeType.VN_304:
          if (this.lsNode304Decoration.length > 0) {
            for (decorationIndex = 0; decorationIndex < this.lsNode304Decoration.length; decorationIndex++) {
              this.lsNode304Decoration[decorationIndex].active = true;
            }
          }
          break;
        case RMCThemeConfig.ThemeType.WORLD_CUP:
          if (this.lsNodeWorldcupDecoration.length > 0) {
            for (decorationIndex = 0; decorationIndex < this.lsNodeWorldcupDecoration.length; decorationIndex++) {
              this.lsNodeWorldcupDecoration[decorationIndex].active = true;
            }
          }
        case RMCThemeConfig.ThemeType.HALLOWEEN:
          if (this.lsNodeHalloweenDecoration.length > 0) {
            for (decorationIndex = 0; decorationIndex < this.lsNodeHalloweenDecoration.length; decorationIndex++) {
              this.lsNodeHalloweenDecoration[decorationIndex].active = true;
            }
          }
      }
    };
    HeaderUi.prototype.tryShowNodeKichHoat = function() {
      if (this.nodeKickHoat && StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().phoneNumber) && 0 == StringUtil.default.isNullOrEmpty(GamePlayManager.default
          .getInstance().token) && GamePlayManager.default.getInstance().numShowThongBao > 0 && GamePlayManager.default.getInstance().gold < 2001) {
        this.nodeKickHoat.active = true;
        this.nodeKickHoatBg.stopAllActions();
        this.nodeKickHoatBg.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.2, 1.1), cc.scaleTo(.2, 1))));
      }
    };
    HeaderUi.prototype.hideNodeKichHoat = function() {
      if (this.nodeKickHoat) {
        this.nodeKickHoatBg.stopAllActions();
        this.nodeKickHoat.active = false;
      }
    };
    HeaderUi.prototype.onClickTrangChu = function() {
      cc.sys.openURL(GameConfigManager.default.getInstance().homeUrl);
    };
    HeaderUi.prototype.updateUI = function() {
      if (null != this.moneyUserLb && void 0 != this.moneyUserLb) {
        this.moneyUserLb.string = StringUtil.default.formatMoneyNumberWithColom(GamePlayManager.default.getInstance().gold);
      }
      this.tempGold = GamePlayManager.default.getInstance().gold;
      if (GamePlayManager.default.getInstance().gold > 2e3 && null !== this.nodeKickHoat && void 0 !== this.nodeKickHoat && this.nodeKickHoat.active) {
        this.nodeKickHoat.active = false;
      }
    };
    HeaderUi.prototype.onDestroy = function() {
      MessageBus.MessageBus.instance.removeEventListener(MessageType.MessageType.DepositDocumentStatusUpdate, this);
      MessageBus.MessageBus.instance.removeEventListener(MessageType.MessageType.DepositDocumentHideTip, this);
      MessageBus.MessageBus.instance.removeEventListener(MessageType.MessageType.DepositComplainStatusUpdate, this);
      MessageBus.MessageBus.instance.removeEventListener(MessageType.MessageType.DepositComplainHideTip, this);
      cc.director.off(GameDefine.GameEventMessage.ACTIVE_PHONE_SUCCESS, this.onActivePhoneSuccess, this);
    };
    HeaderUi.prototype.onMessageHideTip = function(event, data) {
      if (!(SessionData.SessionData.isShowingUpdateDocumentTooltip || SessionData.SessionData.isShowingComplainDocumentTooltip)) {
        this.tryShowNodeKichHoat();
      }
    };
    HeaderUi.prototype.onMessageReceived = function(event, data) {
      if (this && this.isValid) {
        if (SessionData.SessionData.isShowingUpdateDocumentTooltip || SessionData.SessionData.isShowingComplainDocumentTooltip) {
          this.hideNodeKichHoat();
        } else {
          this.tryShowNodeKichHoat();
        }
      }
    };
    HeaderUi.prototype.updateUIName = function() {
      this.nameUserLb.string = GamePlayManager.default.getInstance().displayName;
      this.processUIName(true);
    };
    HeaderUi.prototype.processUIName = function(needExtraDelay) {
      if (void 0 === needExtraDelay) {
        needExtraDelay = false;
      }
      return __awaiter(this, void 0, Promise, function() {
        var isDone;
        return __generator(this, function(generatorState) {
          switch (generatorState.label) {
            case 0:
              isDone = false;
              generatorState.label = 1;
            case 1:
              return isDone ? [3, 6] : 0 != this.nameUserLb.node.getContentSize().width ? [3, 3] : [4, GameUtils.delay(20)];
            case 2:
              return generatorState.sent(), [3, 1];
            case 3:
              return needExtraDelay ? (needExtraDelay = false, [4, GameUtils.delay(20)]) : [3, 5];
            case 4:
              generatorState.sent();
              generatorState.label = 5;
            case 5:
              return this.nameUserLb.node.getContentSize().width > 240 && (this.nameUserLb.string = this.nameUserLb.string
                .substring(0, 9) + ".."), isDone = true, [3, 1];
            case 6:
              return [2];
          }
        });
      });
    };
    HeaderUi.prototype.showTempMeny = function(deltaGold) {
      this.moneyUserLb.string = StringUtil.default.formatMoneyNumberWithColom(this.tempGold + deltaGold);
    };
    HeaderUi.prototype.updateAvarta = function() {
      if (null !== this.avatar && void 0 !== this.avatar) {
        this.avatar.loadUserAvarta();
        if (null != this.avatar.spriteFrame) {
          GamePlayManager.default.getInstance().spriteFrameAvatar = this.avatar.spriteFrame;
        }
      }
    };
    HeaderUi.prototype.onclickBack = function() {
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
    HeaderUi.prototype.onclickHomePage = function() {
      if (GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        window.location.href = GameConfigManager.default.getInstance().webccHomePage;
      } else {
        MusicPlayer.default.getInstance().playbtnClick();
        cc.sys.openURL(GameConfigManager.default.getInstance().homeUrl);
      }
    };
    HeaderUi.prototype.onClickSetting = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      CommonPrefabsManager.default.getInstance().showPopupSetting();
      this.closeMenu();
    };
    HeaderUi.prototype.onClickMail = function() {
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
    HeaderUi.prototype.onClickTinTuc = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      if (GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
      } else {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
        this.closeMenu();
      }
    };
    HeaderUi.prototype.onClickBXH = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      if (GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
      } else {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
        this.closeMenu();
      }
    };
    HeaderUi.prototype.onClickEditName = function() {
      if (!GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        MusicPlayer.default.getInstance().playbtnClick();
        CommonPrefabsManager.default.getInstance().showPopupChangeUserDisplayName(this);
      }
    };
    HeaderUi.prototype.onClickAddGold = function() {
      if (!GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        MusicPlayer.default.getInstance().playbtnShopClick();
        if (!(GameConfigManager.default.getInstance().isShowPopupDone || GameConfigManager.default.getInstance().isLoginWebcc)) {
          CommonPrefabsManager.default.getInstance().showPopupNap();
        }
      }
    };
    HeaderUi.prototype.onClickAvatar = function() {
      if (!GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        MusicPlayer.default.getInstance().playbtnClick();
        CommonPrefabsManager.default.getInstance().showPopupUserInfo();
      }
    };
    HeaderUi.prototype.onClickKickHoat = function() {
      if (!GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        MusicPlayer.default.getInstance().playbtnClick();
        CommonPrefabsManager.default.getInstance().showPopupActivePhoneNumber(this.nodeKickHoat);
      }
    };
    HeaderUi.prototype.onClickMenu = function() {
      if (!GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        MusicPlayer.default.getInstance().playbtnClick();
        if (null !== this.nodeMenuList && void 0 !== this.nodeMenuList) {
          this.nodeMenuList.active = !this.nodeMenuList.active;
        }
        if (null != HeaderUi_1.onMenuOpenCallback) {
          HeaderUi_1.onMenuOpenCallback();
        }
      }
    };
    HeaderUi.prototype.closeMenu = function() {
      if (null !== this.nodeMenuList && void 0 !== this.nodeMenuList) {
        this.nodeMenuList.active = false;
      }
    };
    HeaderUi.prototype.setHeaderLobby = function() {
      if (!this.isKTEK) {
        this.btnBack.active = false;
      }
    };
    HeaderUi.prototype.delayActiveButtonBack = function() {
      return __awaiter(this, void 0, Promise, function() {
        var backButton;
        return __generator(this, function(generatorState) {
          switch (generatorState.label) {
            case 0:
              return this.btnBack && (backButton = this.btnBack.getComponent(cc.Button)) ? (backButton.interactable = false, [4, GameUtils.delay(1e3)]) : [
                2];
            case 1:
              return generatorState.sent(), backButton.interactable = true, [2];
          }
        });
      });
    };
    HeaderUi.prototype.onEnable = function() {
      if (this.allowEnable) {
        HeaderUi_1.isActive = true;
        this.delayActiveButtonBack();
        if (null != this.nodeBroadCast) {
          HeaderUi_1.nodeBroadcast = this.nodeBroadCast;
        }
        if (null != this.nodeBroadCastBigWin) {
          HeaderUi_1.nodeBroadcastBigWin = this.nodeBroadCastBigWin;
        }
        if (null != BroadCast.default.instance) {
          BroadCast.default.instance.show(null);
        }
        if (null != BroadCast.default.instanceBigWin) {
          BroadCast.default.instanceBigWin.show(null);
        }
      }
    };
    HeaderUi.prototype.onDisable = function() {
      HeaderUi_1.isActive = false;
      HeaderUi_1.nodeBroadcast = null;
      HeaderUi_1.nodeBroadcastBigWin = null;
      if (null != BroadCast.default.instance) {
        BroadCast.default.instance.hide(true);
        BroadCast.default.instance.node.parent = MiniGameNode.default.instance.topUI;
      }
      if (null != BroadCast.default.instanceBigWin) {
        BroadCast.default.instanceBigWin.hide(true);
        BroadCast.default.instanceBigWin.node.parent = MiniGameNode.default.instance.topUI;
      }
    };
    HeaderUi.prototype.onClickDangNhap = function() {
      if (!GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        CommonPrefabsManager.default.getInstance().showPopupDangNhap(this.loginWithToken.bind(this));
      }
    };
    HeaderUi.prototype.onClickDangKy = function() {
      if (!GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        if (GameConfigManager.default.getInstance().allowRegister) {
          CommonPrefabsManager.default.getInstance().showPopupDangKy(this.loginWithToken.bind(this));
        } else {
          GameUtils.showPopupNewBrandInfo();
        }
      }
    };
    HeaderUi.prototype.onClickFB = function() {
      if (MusicPlayer.default.getInstance().playbtnClick(), GameConfigManager.default.getInstance().enviromentName.includes("hit")) {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng \u0111ang ph\xe1t tri\u1ec3n");
      } else if (cc.sys.isNative) {
        if (GameConfigManager.default.getInstance().isforcebrand) {
          if (cc.sys.platform == cc.sys.ANDROID) {
            stateParam = "";
            stateParam = "&state=" + (StringUtil.default.isNullOrEmpty(GameConfigManager.default.getInstance().aff_id) ? JSON.stringify({
              app_id: GameConfigManager.default.getInstance().app_id,
              fg: GamePlayManager.default.getInstance().fingerprint
            }) : JSON.stringify({
              aff_id: GameConfigManager.default.getInstance().aff_id,
              app_id: GameConfigManager.default.getInstance().app_id,
              fg: GamePlayManager.default.getInstance().fingerprint
            }));
            facebookOAuthUrl = "https://www.facebook.com/v4.0/dialog/oauth?client_id=" + GameConfigManager.default.getInstance().Appid_FaceBook +
              "&response_type=token" + stateParam + "&redirect_uri=" + GameConfigManager.default.getInstance().urlFBCallback;
            cc.sys.openURL(facebookOAuthUrl);
          } else {
            var homeUrl = GameConfigManager.default.getInstance().homeUrl;
            cc.sys.openURL(homeUrl + "?isforcebrand=true");
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
        var stateParam = "";
        if (!StringUtil.default.isNullOrEmpty(StringUtil.default.getQueryStringValue("aff_id"))) {
          GameConfigManager.default.getInstance().aff_id = StringUtil.default.getQueryStringValue("aff_id");
        }
        stateParam = "&state=" + (StringUtil.default.isNullOrEmpty(GameConfigManager.default.getInstance().aff_id) ? JSON.stringify({
          app_id: GameConfigManager.default.getInstance().app_id,
          fg: GamePlayManager.default.getInstance().fingerprint
        }) : JSON.stringify({
          aff_id: GameConfigManager.default.getInstance().aff_id,
          app_id: GameConfigManager.default.getInstance().app_id,
          fg: GamePlayManager.default.getInstance().fingerprint
        }));
        var facebookOAuthUrl = "https://www.facebook.com/v4.0/dialog/oauth?client_id=" + GameConfigManager.default.getInstance().Appid_FaceBook +
          "&response_type=token" + stateParam + "&redirect_uri=" + GameConfigManager.default.getInstance().urlFBCallback;
        window.location.href = facebookOAuthUrl;
      }
    };
    HeaderUi.prototype.loginWithFB = function() {
      var _this = this,
        affIdParam = "";
      if (!StringUtil.default.isNullOrEmpty(GameConfigManager.default.getInstance().aff_id)) {
        affIdParam = "&aff_id=" + GameConfigManager.default.getInstance().aff_id;
      }
      GameHTTPManager.default.getInstance().sendGetHttpRequest(GameConfigManager.default.getInstance().urlLoginFB + GameConfigManager.default.getInstance().tokenFB + affIdParam + "&app_id=" + GameConfigManager
        .default.getInstance().app_id,
        function(response) {
          var token = response.data[0].token;
          _this.loginWithToken(token, response.data[0].session_id);
          GamePlayManager.default.getInstance().username = response.data[0].username;
          GamePlayManager.default.getInstance().displayName = response.data[0].fullname;
          if (null !== response.data[0].avatar && void 0 !== response.data[0].avatar) {
            GamePlayManager.default.getInstance().avaURL = response.data[0].avatar;
          }
          if (null !== response.data[0].fb_id && void 0 !== response.data[0].fb_id && 0 !== response.data[0].fb_id.toString().localeCompare("undefined")) {
            GamePlayManager.default.getInstance().fb_id = response.data[0].fb_id;
          }
          if (void 0 !== response.data[0].aff_id && null !== response.data[0].aff_id) {
            GameConfigManager.default.getInstance().aff_id = response.data[0].aff_id;
          }
        },
        function(errorMessage) {
          CommonPrefabsManager.default.getInstance().showPopupMessageUtil(errorMessage);
          ErrorLogHandler.default.getInstance().sendLogginError(errorMessage);
        });
    };
    HeaderUi.prototype.loginWithToken = function(token, sessionId) {
      if (void 0 === token) {
        token = "";
      }
      if (void 0 === sessionId) {
        sessionId = "";
      }
      GamePlayManager.default.getInstance().forceLogin = true;
      GamePlayManager.default.getInstance().tokenTemp = token;
      GamePlayManager.default.getInstance().session_idTemp = sessionId;
      cc.director.loadScene(GameDefine.GameConfigs.SceneName.Login);
    };
    HeaderUi.prototype.onActivePhoneSuccess = function() {
      if (this.nodeKickHoat) {
        this.nodeKickHoat.active = false;
      }
    };
    HeaderUi.instance = null;
    HeaderUi.onMenuOpenCallback = null;
    HeaderUi.isActive = false;
    HeaderUi.nodeBroadcast = null;
    HeaderUi.nodeBroadcastBigWin = null;
    // 🔴 `cc.Boolean`, KHÔNG phải `Boolean` của JS. Bản dịch ngược sinh ra kiểu JS thuần (mã
    // TypeScript gốc viết `boolean`), Cocos 2.4 không nhận nên cảnh báo mỗi lần nạp project:
    //     The type of "HeaderUi.isKTEK" must be cc.Boolean, not Boolean.
    // và ô đó không lưu/đọc được từ prefab. Ở đây vô hại vì KHÔNG prefab nào lưu hai ô này (đã
    // soát: chúng luôn lấy mặc định isKTEK=false, allowEnable=true) — nhưng để nguyên thì mỗi
    // lần mở project lại thêm hai dòng cảnh báo, riết rồi không ai đọc cảnh báo nữa.
    __decorate([property(cc.Boolean)], HeaderUi.prototype, "isKTEK", void 0);
    __decorate([property(cc.Boolean)], HeaderUi.prototype, "allowEnable", void 0);
    __decorate([property(cc.Label)], HeaderUi.prototype, "nameUserLb", void 0);
    __decorate([property(cc.Label)], HeaderUi.prototype, "moneyUserLb", void 0);
    __decorate([property(RemoteSprite.default)], HeaderUi.prototype, "avatar", void 0);
    __decorate([property(cc.Node)], HeaderUi.prototype, "btnBack", void 0);
    __decorate([property(cc.Node)], HeaderUi.prototype, "nodeRightUI", void 0);
    __decorate([property(cc.Node)], HeaderUi.prototype, "nodeKickHoat", void 0);
    __decorate([property(cc.Node)], HeaderUi.prototype, "nodeKickHoatBg", void 0);
    __decorate([property(cc.Node)], HeaderUi.prototype, "nodeMenuList", void 0);
    __decorate([property(cc.Node)], HeaderUi.prototype, "nodeMenuListPublic", void 0);
    __decorate([property(cc.Node)], HeaderUi.prototype, "nodeBroadCast", void 0);
    __decorate([property(cc.Node)], HeaderUi.prototype, "nodeBroadCastBigWin", void 0);
    __decorate([property(cc.Node)], HeaderUi.prototype, "normalLobby", void 0);
    __decorate([property(cc.Node)], HeaderUi.prototype, "publicLobby", void 0);
    __decorate([property(cc.Sprite)], HeaderUi.prototype, "logoWebcc", void 0);
    __decorate([property(cc.Node)], HeaderUi.prototype, "nodeWebcc", void 0);
    __decorate([property(cc.Node)], HeaderUi.prototype, "logoHeader", void 0);
    __decorate([property(cc.Node)], HeaderUi.prototype, "nodeDomain", void 0);
    __decorate([property(cc.Label)], HeaderUi.prototype, "textKichHoat", void 0);
    __decorate([property(cc.Node)], HeaderUi.prototype, "iconVip", void 0);
    __decorate([property([cc.Node])], HeaderUi.prototype, "lsNodeNoelDecoration", void 0);
    __decorate([property([cc.Node])], HeaderUi.prototype, "lsNodeNewYearDecoration", void 0);
    __decorate([property([cc.Node])], HeaderUi.prototype, "lsNodeMoonFestivalDecoration", void 0);
    __decorate([property([cc.Node])], HeaderUi.prototype, "lsNode304Decoration", void 0);
    __decorate([property([cc.Node])], HeaderUi.prototype, "lsNodeWorldcupDecoration", void 0);
    __decorate([property([cc.Node])], HeaderUi.prototype, "lsNodeHalloweenDecoration", void 0);
    return HeaderUi = HeaderUi_1 = __decorate([ccclass], HeaderUi);
  }(cc.Component);
moduleExports.default = HeaderUi;
void 0;
