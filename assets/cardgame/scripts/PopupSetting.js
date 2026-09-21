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
var UIToggleSlider = require("./UIToggleSlider"),
  GameConfigManager = require("./GameConfigManager"),
  CardPopupBase = require("./CardPopupBase"),
  MusicPlayer = require("./MusicPlayer"),
  GamePlayManager = require("./GamePlayManager"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  GameHTTPManager = require("./GameHTTPManager"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  GameDefine = require("./GameDefine"),
  CardGameCommonRequest = require("./CardGameCommonRequest"),
  DownloadScene = require("./DownloadScene"),
  StringUtil = require("./StringUtil"),
  RMCPasscodeConfig2 = require("./RMCPasscodeConfig2"),
  GbMathUtils = require("./GbMathUtils"),
  RMCBlockLoginWebConfig = require("./RMCBlockLoginWebConfig"),
  MiniGameNode = require("./MiniGameNode"),
  GameZOrder = require("./GameZOrder"),
  GameLiveUtils = require("./GameLiveUtils"),
  GameUtils = require("./GameUtils"),
  decorator = cc._decorator,
  ccclass = decorator.ccclass,
  property = decorator.property,
  PUBLIC_CHAT_GAME_IDS = [MessageCardGameHandler.GAME.XOCDIA, MessageCardGameHandler.GAME.BAU_CUA];
moduleExports.SETTING_KEY_PASSCODE = "passcode";
moduleExports.SETTING_KEY_AUTO_READY = "autoReady";
moduleExports.SETTING_KEY_TRUST_DEVICE = "trustDevice";
moduleExports.SETTING_KEY_BLOCK_PUBLIC_CHAT = "blockPublicChat";
moduleExports.SETTING_KEY_NEW_SORT_MAU_BINH = "newSortMauBinh";
moduleExports.SETTING_KEY_BLOCK_LOGIN_WEB = "blockLoginWeb";
var SCENES_WITHOUT_ROOM_SETTINGS = [GameDefine.GameConfigs.SceneName.Lode, GameDefine.GameConfigs.SceneName.LodeST, GameDefine.GameConfigs.SceneName.Volta, GameDefine.GameConfigs.SceneName.SicboLive, GameDefine
    .GameConfigs.SceneName.DaGaLive, GameDefine.GameConfigs.SceneName.BaccaratLive, GameDefine.GameConfigs.SceneName.BauCuaLive, GameDefine.GameConfigs.SceneName
    .TXSTLive, GameDefine.GameConfigs.SceneName.XocDiaLiveV2, GameDefine.GameConfigs.SceneName.DragonTigerLive, GameDefine.GameConfigs.SceneName.BauCuaBonus
  ],
  PopupSetting = function(_super) {
    function PopupSetting() {
      var self = null !== _super && _super.apply(this, arguments) || this;
      self.toggleAutoReady = null;
      self.toggleTrustDevice = null;
      self.toggleBgMuSic = null;
      self.toggleSoundEffect = null;
      self.toggleShowChatBanChung = null;
      self.togglePasscode = null;
      self.toggleBlockLoginWeb = null;
      self.toggleXepBaiMoiMauBinh = null;
      self.lbVersion = null;
      self.nodeTuDongSanSang = null;
      self.nodeTrustDevice = null;
      self.nodeMain = null;
      self.nodeChanShowChatBanChung = null;
      self.nodeXepBaiMoiMauBinh = null;
      self.nodePasscode = null;
      self.nodeBlockLoginWeb = null;
      self.nodeLayout = null;
      self.nodeHighlight = null;
      self.minHeight = 500;
      self.maxHeight = 500;
      self.oneRowBonusHeight = 500;
      self.callbackClose = null;
      self.countDebug1 = 0;
      self.countDebug2 = 0;
      return self;
    }
    __extends(PopupSetting, _super);
    PopupSetting.prototype.onLoad = function() {
      this.toggleSoundEffect.initStart(GameConfigManager.default.getInstance().enableSound);
      this.toggleSoundEffect.onValueChange = this.onChangeSoundEffect.bind(this);
      this.toggleBgMuSic.initStart(GameConfigManager.default.getInstance().enableBackgroundMusic);
      this.toggleBgMuSic.onValueChange = this.onChangeSettingBgMusic.bind(this);
      this.toggleAutoReady.initStart(GameConfigManager.default.getInstance().autoReady);
      this.toggleAutoReady.onValueChange = this.onChangeTuDongSanSang.bind(this);
      if (this.toggleBlockLoginWeb) {
        this.toggleBlockLoginWeb.initStart(GamePlayManager.default.getInstance().IsBlockLoginWeb);
        this.toggleBlockLoginWeb.onValueChange = this.onChangeBlockLoginWeb.bind(this);
      }
      if (this.toggleXepBaiMoiMauBinh) {
        this.toggleXepBaiMoiMauBinh.initStart(GamePlayManager.default.getInstance().IsMauBinhUsingNewXepBai);
        this.toggleXepBaiMoiMauBinh.onValueChange = this.onChangeXepBaiMoiMauBinh.bind(this);
      }
      if (null !== this.toggleShowChatBanChung && void 0 !== this.toggleShowChatBanChung) {
        this.toggleShowChatBanChung.initStart(GameConfigManager.default.getInstance().showChatBanChung);
        this.toggleShowChatBanChung.onValueChange = this.onChangeShowChatBanChung.bind(this);
      }
      if (GameConfigManager.default.getInstance().listcommingSoonGames.indexOf("onedevice") >= 0) {
        this.nodeTrustDevice.active = false;
      } else {
        this.nodeTrustDevice.active = true;
        this.toggleTrustDevice.isMove = false;
        this.toggleTrustDevice.initStart(GameConfigManager.default.getInstance().trustDevice);
        this.toggleTrustDevice.onValueChange = this.onChangeTrustDevice.bind(this);
      }
      var currentVersion = cc.sys.localStorage.getItem("currversion");
      if (null == currentVersion && (currentVersion = "1.0"), cc.sys.isNative) {
        var savedPasscode = cc.sys.localStorage.getItem(DownloadScene.KEY_ACTIVE_PASSCODE);
        if (this.togglePasscode) {
          this.togglePasscode.initStart(!StringUtil.default.isNullOrEmpty(savedPasscode));
        }
      }
      this.setBGSize();
      if (null != this.lbVersion) {
        this.lbVersion.string = "version: " + currentVersion;
      }
    };
    PopupSetting.prototype.setSettingKey = function(settingKey) {
      return __awaiter(this, void 0, void 0, function() {
        var targetNode, worldPosition, localPosition;
        return __generator(this, function(generatorState) {
          switch (generatorState.label) {
            case 0:
              return [4, GameUtils.delay(50)];
            case 1:
              switch (generatorState.sent(), targetNode = null, settingKey) {
                case moduleExports.SETTING_KEY_PASSCODE:
                  targetNode = this.nodePasscode;
                  break;
                case moduleExports.SETTING_KEY_AUTO_READY:
                  targetNode = this.nodeTuDongSanSang;
                  break;
                case moduleExports.SETTING_KEY_TRUST_DEVICE:
                  targetNode = this.nodeTrustDevice;
                  break;
                case moduleExports.SETTING_KEY_BLOCK_PUBLIC_CHAT:
                  targetNode = this.nodeChanShowChatBanChung;
                  break;
                case moduleExports.SETTING_KEY_NEW_SORT_MAU_BINH:
                  targetNode = this.nodeXepBaiMoiMauBinh;
                  break;
                case moduleExports.SETTING_KEY_BLOCK_LOGIN_WEB:
                  targetNode = this.nodeBlockLoginWeb;
              }
              return targetNode && targetNode.active ? (this.nodeHighlight.active = true, worldPosition = GameLiveUtils.default.changeToWorldPos(targetNode), localPosition = this.nodeHighlight
                .parent.convertToNodeSpaceAR(worldPosition), this.nodeHighlight.position = localPosition, [2]) : (this.nodeHighlight.active = false, [
                2]);
          }
        });
      });
    };
    PopupSetting.prototype.onChangeSettingBgMusic = function(isEnabled) {
      GameConfigManager.default.getInstance().setEnableBgMusic(isEnabled);
      MusicPlayer.default.getInstance().playbtnClick();
      cc.director.emit("KEY_UPDATE_SETTING");
    };
    PopupSetting.prototype.onChangeSoundEffect = function(isEnabled) {
      GameConfigManager.default.getInstance().setEnableSound(isEnabled);
      MusicPlayer.default.getInstance().playbtnClick();
      cc.director.emit("KEY_UPDATE_SETTING");
    };
    PopupSetting.prototype.onChangeTuDongSanSang = function(isEnabled) {
      GameConfigManager.default.getInstance().setEnableAutoReady(isEnabled);
      MusicPlayer.default.getInstance().playbtnClick();
    };
    PopupSetting.prototype.onChangeTrustDevice = function(isEnabled) {
      if (MusicPlayer.default.getInstance().playbtnClick(), GameConfigManager.default.getInstance().listcommingSoonGames.indexOf("onedevice") >= 0) {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft!");
      } else {
        this.toggleTrustDevice.isMove = false;
        CommonPrefabsManager.default.getInstance().showLoading();
        var requestData = {
          action: isEnabled ? "ON" : "OFF",
          fg_id: GamePlayManager.default.getInstance().fingerprint
        };
        GameHTTPManager.default.getInstance().sendPostHttpRequest(GameConfigManager.default.getInstance().checkDeviceURL, JSON.stringify(requestData), function(response) {
          if (200 == response.code) {
            GameConfigManager.default.getInstance().setEnableTrustDevice(isEnabled);
            this.toggleTrustDevice.isMove = true;
            this.toggleTrustDevice.isOnChange(isEnabled, false);
            this.toggleTrustDevice.isMove = false;
          } else {
            if (void 0 != response.message) {
              CommonPrefabsManager.default.getInstance().showPopupMessageUtil(response.message);
            }
          }
          CommonPrefabsManager.default.getInstance().hideLoading();
        }.bind(this), function(errorMessage) {
          CommonPrefabsManager.default.getInstance().hideLoading();
          CommonPrefabsManager.default.getInstance().showPopupMessageUtil(errorMessage);
        }.bind(this));
      }
    };
    PopupSetting.prototype.onChangeShowChatBanChung = function(isEnabled) {
      GameConfigManager.default.getInstance().setEnableShowChatBanChung(isEnabled);
      MusicPlayer.default.getInstance().playbtnClick();
    };
    PopupSetting.prototype.onClickClose = function() {
      this.hide(this.callbackClose);
    };
    PopupSetting.prototype.checkTrustDevice = function() {
      var requestData = {
        action: "CKC",
        fg_id: GamePlayManager.default.getInstance().fingerprint
      };
      GameHTTPManager.default.getInstance().sendPostHttpRequest(GameConfigManager.default.getInstance().checkDeviceURL, JSON.stringify(requestData), function(response) {
        if ("OK" == response.status) {
          GameConfigManager.default.getInstance().setEnableTrustDevice(1 == response.code);
          this.toggleTrustDevice.isMove = true;
          this.toggleTrustDevice.isOnChange(1 == response.code, false);
        }
      }.bind(this), function(errorMessage) {}.bind(this));
    };
    PopupSetting.prototype.show = function(callback, duration, scale) {
      if (void 0 === callback && (callback = null), void 0 === duration && (duration = .4), void 0 === scale && (scale = 1), !(null == this.popup || GameConfigManager.default.getInstance()
          .isShowPopupDone && this.isShowDone)) {
        _super.prototype.show.call(this, callback, duration, scale);
        if (this.nodeXepBaiMoiMauBinh) {
          this.nodeXepBaiMoiMauBinh.active = false;
        }
        if (this.nodePasscode) {
          this.nodePasscode.active = false;
        }
        if (this.nodeBlockLoginWeb) {
          this.nodeBlockLoginWeb.active = false;
        }
        var isPublicChatGame = PUBLIC_CHAT_GAME_IDS.indexOf(GamePlayManager.default.getInstance().gameID) >= 0,
          isSceneWithoutRoomSettings = SCENES_WITHOUT_ROOM_SETTINGS.indexOf(GamePlayManager.default.getInstance().currentScene) >= 0;
        if (isPublicChatGame) {
          if (this.nodeTuDongSanSang) {
            this.nodeTuDongSanSang.active = false;
          }
          if (this.nodeChanShowChatBanChung) {
            this.nodeChanShowChatBanChung.active = true;
          }
        } else if (isSceneWithoutRoomSettings) {
          if (this.nodeTuDongSanSang) {
            this.nodeTuDongSanSang.active = false;
          }
          if (this.nodeChanShowChatBanChung) {
            this.nodeChanShowChatBanChung.active = false;
          }
        } else if (GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.BINH && GameConfigManager.default.getInstance().isNewXepBaiMauBinh) {
          if (this.nodeXepBaiMoiMauBinh) {
            this.nodeXepBaiMoiMauBinh.active = true;
          }
          if (null !== this.nodeChanShowChatBanChung && void 0 !== this.nodeChanShowChatBanChung) {
            this.nodeChanShowChatBanChung.active = false;
          }
        } else if (GamePlayManager.default.getInstance().currentScene === GameDefine.GameConfigs.SceneName.Lobby && cc.sys.isNative) {
          var passcodeConfig = RMCPasscodeConfig2.getPasscodeConfig();
          if (this.nodePasscode && passcodeConfig.enable) {
            this.nodePasscode.active = true;
          }
          var blockLoginWebConfig = RMCBlockLoginWebConfig.getBlockLoginWebConfig();
          if (this.nodeBlockLoginWeb && !StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().token) && blockLoginWebConfig.enable) {
            this.nodeBlockLoginWeb.active = true;
          }
        }
        this.setBGSize();
      }
    };
    PopupSetting.prototype.onChangeXepBaiMoiMauBinh = function(isEnabled) {
      GamePlayManager.default.getInstance().IsMauBinhUsingNewXepBai = isEnabled;
      MusicPlayer.default.getInstance().playbtnClick();
      CardGameCommonRequest.default.getInstance().sendSettingRoom(isEnabled, false, GamePlayManager.default.getInstance().IsMauBinhFistTimeShowQuickGuide);
    };
    PopupSetting.prototype.onClickedChangePasscodeBtn = function() {
      var self = this;
      MusicPlayer.default.getInstance().playbtnClick();
      CommonPrefabsManager.default.getInstance().showPopupPasscode(function() {
        var savedPasscode = cc.sys.localStorage.getItem(DownloadScene.KEY_ACTIVE_PASSCODE);
        self.togglePasscode.initStart(!StringUtil.default.isNullOrEmpty(savedPasscode));
      });
    };
    PopupSetting.prototype.onClickedFAQPasscodeBtn = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      CommonPrefabsManager.default.getInstance().showPopupFAQRemote("passcode");
    };
    PopupSetting.prototype.onChangeBlockLoginWeb = function(isEnabled) {
      var self = this;
      MusicPlayer.default.getInstance().playbtnClick();
      this.toggleBlockLoginWeb.setPreventClick(true);
      GamePlayManager.default.getInstance().updateBlockLoginWeb(isEnabled, function() {
        self.toggleBlockLoginWeb.setPreventClick(false);
        if (GamePlayManager.default.getInstance().IsBlockLoginWeb != isEnabled) {
          self.toggleBlockLoginWeb.initStart(GamePlayManager.default.getInstance().IsBlockLoginWeb);
        }
      });
    };
    PopupSetting.prototype.onClickButtonDebug1 = function() {
      this.countDebug1++;
    };
    PopupSetting.prototype.onClickButtonDebug2 = function() {
      this.countDebug2++;
      if (this.countDebug1 >= 2 && this.countDebug2 >= 6) {
        this.hide();
        this.countDebug1 = 0;
        this.countDebug2 = 0;
        cc.loader.loadRes("Test/PopupTestForceUpdate", function(error, prefab) {
          if (null != prefab) {
            var popupTestForceUpdate = cc.instantiate(prefab);
            popupTestForceUpdate.parent = MiniGameNode.default.instance.popupNode;
            popupTestForceUpdate.x = 0;
            popupTestForceUpdate.y = 0;
            popupTestForceUpdate.zIndex = GameZOrder.default.TOP;
            CommonPrefabsManager.default.getInstance().hideLoading();
          }
        }.bind(this));
      }
    };
    PopupSetting.prototype.setBGSize = function() {
      if (null != this.nodeLayout) {
        for (var rows = this.nodeLayout.children, activeRowCount = 0, index = 0; index < rows.length; index++) {
          if (rows[index].active) {
            activeRowCount++;
          }
        }
        var extraRowCount = activeRowCount - 2,
          targetHeight = this.minHeight + extraRowCount * this.oneRowBonusHeight;
        this.popup.height = GbMathUtils.clamp(targetHeight, this.minHeight, this.maxHeight);
      }
    };
    __decorate([property(UIToggleSlider.default)], PopupSetting.prototype, "toggleAutoReady", void 0);
    __decorate([property(UIToggleSlider.default)], PopupSetting.prototype, "toggleTrustDevice", void 0);
    __decorate([property(UIToggleSlider.default)], PopupSetting.prototype, "toggleBgMuSic", void 0);
    __decorate([property(UIToggleSlider.default)], PopupSetting.prototype, "toggleSoundEffect", void 0);
    __decorate([property(UIToggleSlider.default)], PopupSetting.prototype, "toggleShowChatBanChung", void 0);
    __decorate([property(UIToggleSlider.default)], PopupSetting.prototype, "togglePasscode", void 0);
    __decorate([property(UIToggleSlider.default)], PopupSetting.prototype, "toggleBlockLoginWeb", void 0);
    __decorate([property(UIToggleSlider.default)], PopupSetting.prototype, "toggleXepBaiMoiMauBinh", void 0);
    __decorate([property(cc.Label)], PopupSetting.prototype, "lbVersion", void 0);
    __decorate([property(cc.Node)], PopupSetting.prototype, "nodeTuDongSanSang", void 0);
    __decorate([property(cc.Node)], PopupSetting.prototype, "nodeTrustDevice", void 0);
    __decorate([property(cc.Node)], PopupSetting.prototype, "nodeMain", void 0);
    __decorate([property(cc.Node)], PopupSetting.prototype, "nodeChanShowChatBanChung", void 0);
    __decorate([property(cc.Node)], PopupSetting.prototype, "nodeXepBaiMoiMauBinh", void 0);
    __decorate([property(cc.Node)], PopupSetting.prototype, "nodePasscode", void 0);
    __decorate([property(cc.Node)], PopupSetting.prototype, "nodeBlockLoginWeb", void 0);
    __decorate([property(cc.Node)], PopupSetting.prototype, "nodeLayout", void 0);
    __decorate([property(cc.Node)], PopupSetting.prototype, "nodeHighlight", void 0);
    __decorate([property], PopupSetting.prototype, "minHeight", void 0);
    __decorate([property], PopupSetting.prototype, "maxHeight", void 0);
    __decorate([property], PopupSetting.prototype, "oneRowBonusHeight", void 0);
    return PopupSetting = __decorate([ccclass], PopupSetting);
  }(CardPopupBase.default);
moduleExports.default = PopupSetting;
void 0;
