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
// ── BẢNG TRA BÍ DANH (máy sinh — ghi-bang-tra-bi-danh.js) ──────
// Mã dịch ngược đặt bí danh một chữ cho mỗi module. Bảng này để khỏi phải cuộn ngược.
// KHÔNG đổi tên chúng bằng tìm-kiếm-thay-thế: đoạn mở đầu __decorate khai lại đúng
// những chữ này làm biến cục bộ, đổi là hỏng im lặng.
//   r = UIToggleSlider   c = GameConfigManager   l = CardPopupBase
//   h = MusicPlayer   u = GamePlayManager   d = MessageCardGameHandler
//   p = GameHTTPManager   f = CommonPrefabsManager   g = GameDefine
//   m = CardGameCommonRequest   y = DownloadScene   S = StringUtil
//   _ = RMCPasscodeConfig2   v = GbMathUtils   b = RMCBlockLoginWebConfig
//   C = MiniGameNode   T = GameZOrder   E = GameLiveUtils
//   I = GameUtils
// ────────────────────────────────────────────────────────────────
var r = require("./UIToggleSlider"),
  c = require("./GameConfigManager"),
  l = require("./CardPopupBase"),
  h = require("./MusicPlayer"),
  u = require("./GamePlayManager"),
  d = require("./MessageCardGameHandler"),
  p = require("./GameHTTPManager"),
  f = require("./CommonPrefabsManager"),
  g = require("./GameDefine"),
  m = require("./CardGameCommonRequest"),
  y = require("./DownloadScene"),
  S = require("./StringUtil"),
  _ = require("./RMCPasscodeConfig2"),
  v = require("./GbMathUtils"),
  b = require("./RMCBlockLoginWebConfig"),
  C = require("./MiniGameNode"),
  T = require("./GameZOrder"),
  E = require("./GameLiveUtils"),
  I = require("./GameUtils"),
  A = cc._decorator,
  P = A.ccclass,
  M = A.property,
  O = [d.GAME.XOCDIA, d.GAME.BAU_CUA];
i.SETTING_KEY_PASSCODE = "passcode";
i.SETTING_KEY_AUTO_READY = "autoReady";
i.SETTING_KEY_TRUST_DEVICE = "trustDevice";
i.SETTING_KEY_BLOCK_PUBLIC_CHAT = "blockPublicChat";
i.SETTING_KEY_NEW_SORT_MAU_BINH = "newSortMauBinh";
i.SETTING_KEY_BLOCK_LOGIN_WEB = "blockLoginWeb";
var N = [g.GameConfigs.SceneName.Lode, g.GameConfigs.SceneName.LodeST, g.GameConfigs.SceneName.Volta, g.GameConfigs.SceneName.SicboLive, g
    .GameConfigs.SceneName.DaGaLive, g.GameConfigs.SceneName.BaccaratLive, g.GameConfigs.SceneName.BauCuaLive, g.GameConfigs.SceneName
    .TXSTLive, g.GameConfigs.SceneName.XocDiaLiveV2, g.GameConfigs.SceneName.DragonTigerLive, g.GameConfigs.SceneName.BauCuaBonus
  ],
  B = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.toggleAutoReady = null;
      e.toggleTrustDevice = null;
      e.toggleBgMuSic = null;
      e.toggleSoundEffect = null;
      e.toggleShowChatBanChung = null;
      e.togglePasscode = null;
      e.toggleBlockLoginWeb = null;
      e.toggleXepBaiMoiMauBinh = null;
      e.lbVersion = null;
      e.nodeTuDongSanSang = null;
      e.nodeTrustDevice = null;
      e.nodeMain = null;
      e.nodeChanShowChatBanChung = null;
      e.nodeXepBaiMoiMauBinh = null;
      e.nodePasscode = null;
      e.nodeBlockLoginWeb = null;
      e.nodeLayout = null;
      e.nodeHighlight = null;
      e.minHeight = 500;
      e.maxHeight = 500;
      e.oneRowBonusHeight = 500;
      e.callbackClose = null;
      e.countDebug1 = 0;
      e.countDebug2 = 0;
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {
      this.toggleSoundEffect.initStart(c.default.getInstance().enableSound);
      this.toggleSoundEffect.onValueChange = this.onChangeSoundEffect.bind(this);
      this.toggleBgMuSic.initStart(c.default.getInstance().enableBackgroundMusic);
      this.toggleBgMuSic.onValueChange = this.onChangeSettingBgMusic.bind(this);
      this.toggleAutoReady.initStart(c.default.getInstance().autoReady);
      this.toggleAutoReady.onValueChange = this.onChangeTuDongSanSang.bind(this);
      if (this.toggleBlockLoginWeb) {
        this.toggleBlockLoginWeb.initStart(u.default.getInstance().IsBlockLoginWeb);
        this.toggleBlockLoginWeb.onValueChange = this.onChangeBlockLoginWeb.bind(this);
      }
      if (this.toggleXepBaiMoiMauBinh) {
        this.toggleXepBaiMoiMauBinh.initStart(u.default.getInstance().IsMauBinhUsingNewXepBai);
        this.toggleXepBaiMoiMauBinh.onValueChange = this.onChangeXepBaiMoiMauBinh.bind(this);
      }
      if (null !== this.toggleShowChatBanChung && void 0 !== this.toggleShowChatBanChung) {
        this.toggleShowChatBanChung.initStart(c.default.getInstance().showChatBanChung);
        this.toggleShowChatBanChung.onValueChange = this.onChangeShowChatBanChung.bind(this);
      }
      if (c.default.getInstance().listcommingSoonGames.indexOf("onedevice") >= 0) {
        this.nodeTrustDevice.active = false;
      } else {
        this.nodeTrustDevice.active = true;
        this.toggleTrustDevice.isMove = false;
        this.toggleTrustDevice.initStart(c.default.getInstance().trustDevice);
        this.toggleTrustDevice.onValueChange = this.onChangeTrustDevice.bind(this);
      }
      var t = cc.sys.localStorage.getItem("currversion");
      if (null == t && (t = "1.0"), cc.sys.isNative) {
        var e = cc.sys.localStorage.getItem(y.KEY_ACTIVE_PASSCODE);
        if (this.togglePasscode) {
          this.togglePasscode.initStart(!S.default.isNullOrEmpty(e));
        }
      }
      this.setBGSize();
      if (null != this.lbVersion) {
        this.lbVersion.string = "version: " + t;
      }
    };
    e.prototype.setSettingKey = function(t) {
      return a(this, void 0, void 0, function() {
        var e, n, o;
        return s(this, function(a) {
          switch (a.label) {
            case 0:
              return [4, I.delay(50)];
            case 1:
              switch (a.sent(), e = null, t) {
                case i.SETTING_KEY_PASSCODE:
                  e = this.nodePasscode;
                  break;
                case i.SETTING_KEY_AUTO_READY:
                  e = this.nodeTuDongSanSang;
                  break;
                case i.SETTING_KEY_TRUST_DEVICE:
                  e = this.nodeTrustDevice;
                  break;
                case i.SETTING_KEY_BLOCK_PUBLIC_CHAT:
                  e = this.nodeChanShowChatBanChung;
                  break;
                case i.SETTING_KEY_NEW_SORT_MAU_BINH:
                  e = this.nodeXepBaiMoiMauBinh;
                  break;
                case i.SETTING_KEY_BLOCK_LOGIN_WEB:
                  e = this.nodeBlockLoginWeb;
              }
              return e && e.active ? (this.nodeHighlight.active = true, n = E.default.changeToWorldPos(e), o = this.nodeHighlight
                .parent.convertToNodeSpaceAR(n), this.nodeHighlight.position = o, [2]) : (this.nodeHighlight.active = false, [
                2]);
          }
        });
      });
    };
    e.prototype.onChangeSettingBgMusic = function(t) {
      c.default.getInstance().setEnableBgMusic(t);
      h.default.getInstance().playbtnClick();
      cc.director.emit("KEY_UPDATE_SETTING");
    };
    e.prototype.onChangeSoundEffect = function(t) {
      c.default.getInstance().setEnableSound(t);
      h.default.getInstance().playbtnClick();
      cc.director.emit("KEY_UPDATE_SETTING");
    };
    e.prototype.onChangeTuDongSanSang = function(t) {
      c.default.getInstance().setEnableAutoReady(t);
      h.default.getInstance().playbtnClick();
    };
    e.prototype.onChangeTrustDevice = function(t) {
      if (h.default.getInstance().playbtnClick(), c.default.getInstance().listcommingSoonGames.indexOf("onedevice") >= 0) {
        f.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft!");
      } else {
        this.toggleTrustDevice.isMove = false;
        f.default.getInstance().showLoading();
        var e = {
          action: t ? "ON" : "OFF",
          fg_id: u.default.getInstance().fingerprint
        };
        p.default.getInstance().sendPostHttpRequest(c.default.getInstance().checkDeviceURL, JSON.stringify(e), function(e) {
          if (200 == e.code) {
            c.default.getInstance().setEnableTrustDevice(t);
            this.toggleTrustDevice.isMove = true;
            this.toggleTrustDevice.isOnChange(t, false);
            this.toggleTrustDevice.isMove = false;
          } else {
            if (void 0 != e.message) {
              f.default.getInstance().showPopupMessageUtil(e.message);
            }
          }
          f.default.getInstance().hideLoading();
        }.bind(this), function(t) {
          f.default.getInstance().hideLoading();
          f.default.getInstance().showPopupMessageUtil(t);
        }.bind(this));
      }
    };
    e.prototype.onChangeShowChatBanChung = function(t) {
      c.default.getInstance().setEnableShowChatBanChung(t);
      h.default.getInstance().playbtnClick();
    };
    e.prototype.onClickClose = function() {
      this.hide(this.callbackClose);
    };
    e.prototype.checkTrustDevice = function() {
      var t = {
        action: "CKC",
        fg_id: u.default.getInstance().fingerprint
      };
      p.default.getInstance().sendPostHttpRequest(c.default.getInstance().checkDeviceURL, JSON.stringify(t), function(t) {
        if ("OK" == t.status) {
          c.default.getInstance().setEnableTrustDevice(1 == t.code);
          this.toggleTrustDevice.isMove = true;
          this.toggleTrustDevice.isOnChange(1 == t.code, false);
        }
      }.bind(this), function(t) {}.bind(this));
    };
    e.prototype.show = function(e, i, n) {
      if (void 0 === e && (e = null), void 0 === i && (i = .4), void 0 === n && (n = 1), !(null == this.popup || c.default.getInstance()
          .isShowPopupDone && this.isShowDone)) {
        t.prototype.show.call(this, e, i, n);
        if (this.nodeXepBaiMoiMauBinh) {
          this.nodeXepBaiMoiMauBinh.active = false;
        }
        if (this.nodePasscode) {
          this.nodePasscode.active = false;
        }
        if (this.nodeBlockLoginWeb) {
          this.nodeBlockLoginWeb.active = false;
        }
        var o = O.indexOf(u.default.getInstance().gameID) >= 0,
          a = N.indexOf(u.default.getInstance().currentScene) >= 0;
        if (o) {
          if (this.nodeTuDongSanSang) {
            this.nodeTuDongSanSang.active = false;
          }
          if (this.nodeChanShowChatBanChung) {
            this.nodeChanShowChatBanChung.active = true;
          }
        } else if (a) {
          if (this.nodeTuDongSanSang) {
            this.nodeTuDongSanSang.active = false;
          }
          if (this.nodeChanShowChatBanChung) {
            this.nodeChanShowChatBanChung.active = false;
          }
        } else if (u.default.getInstance().gameID === d.GAME.BINH && c.default.getInstance().isNewXepBaiMauBinh) {
          if (this.nodeXepBaiMoiMauBinh) {
            this.nodeXepBaiMoiMauBinh.active = true;
          }
          if (null !== this.nodeChanShowChatBanChung && void 0 !== this.nodeChanShowChatBanChung) {
            this.nodeChanShowChatBanChung.active = false;
          }
        } else if (u.default.getInstance().currentScene === g.GameConfigs.SceneName.Lobby && cc.sys.isNative) {
          var s = _.getPasscodeConfig();
          if (this.nodePasscode && s.enable) {
            this.nodePasscode.active = true;
          }
          var r = b.getBlockLoginWebConfig();
          if (this.nodeBlockLoginWeb && !S.default.isNullOrEmpty(u.default.getInstance().token) && r.enable) {
            this.nodeBlockLoginWeb.active = true;
          }
        }
        this.setBGSize();
      }
    };
    e.prototype.onChangeXepBaiMoiMauBinh = function(t) {
      u.default.getInstance().IsMauBinhUsingNewXepBai = t;
      h.default.getInstance().playbtnClick();
      m.default.getInstance().sendSettingRoom(t, false, u.default.getInstance().IsMauBinhFistTimeShowQuickGuide);
    };
    e.prototype.onClickedChangePasscodeBtn = function() {
      var t = this;
      h.default.getInstance().playbtnClick();
      f.default.getInstance().showPopupPasscode(function() {
        var e = cc.sys.localStorage.getItem(y.KEY_ACTIVE_PASSCODE);
        t.togglePasscode.initStart(!S.default.isNullOrEmpty(e));
      });
    };
    e.prototype.onClickedFAQPasscodeBtn = function() {
      h.default.getInstance().playbtnClick();
      f.default.getInstance().showPopupFAQRemote("passcode");
    };
    e.prototype.onChangeBlockLoginWeb = function(t) {
      var e = this;
      h.default.getInstance().playbtnClick();
      this.toggleBlockLoginWeb.setPreventClick(true);
      u.default.getInstance().updateBlockLoginWeb(t, function() {
        e.toggleBlockLoginWeb.setPreventClick(false);
        if (u.default.getInstance().IsBlockLoginWeb != t) {
          e.toggleBlockLoginWeb.initStart(u.default.getInstance().IsBlockLoginWeb);
        }
      });
    };
    e.prototype.onClickButtonDebug1 = function() {
      this.countDebug1++;
    };
    e.prototype.onClickButtonDebug2 = function() {
      this.countDebug2++;
      if (this.countDebug1 >= 2 && this.countDebug2 >= 6) {
        this.hide();
        this.countDebug1 = 0;
        this.countDebug2 = 0;
        cc.loader.loadRes("Test/PopupTestForceUpdate", function(t, e) {
          if (null != e) {
            var i = cc.instantiate(e);
            i.parent = C.default.instance.popupNode;
            i.x = 0;
            i.y = 0;
            i.zIndex = T.default.TOP;
            f.default.getInstance().hideLoading();
          }
        }.bind(this));
      }
    };
    e.prototype.setBGSize = function() {
      if (null != this.nodeLayout) {
        for (var t = this.nodeLayout.children, e = 0, i = 0; i < t.length; i++) {
          if (t[i].active) {
            e++;
          }
        }
        var n = e - 2,
          o = this.minHeight + n * this.oneRowBonusHeight;
        this.popup.height = v.clamp(o, this.minHeight, this.maxHeight);
      }
    };
    o([M(r.default)], e.prototype, "toggleAutoReady", void 0);
    o([M(r.default)], e.prototype, "toggleTrustDevice", void 0);
    o([M(r.default)], e.prototype, "toggleBgMuSic", void 0);
    o([M(r.default)], e.prototype, "toggleSoundEffect", void 0);
    o([M(r.default)], e.prototype, "toggleShowChatBanChung", void 0);
    o([M(r.default)], e.prototype, "togglePasscode", void 0);
    o([M(r.default)], e.prototype, "toggleBlockLoginWeb", void 0);
    o([M(r.default)], e.prototype, "toggleXepBaiMoiMauBinh", void 0);
    o([M(cc.Label)], e.prototype, "lbVersion", void 0);
    o([M(cc.Node)], e.prototype, "nodeTuDongSanSang", void 0);
    o([M(cc.Node)], e.prototype, "nodeTrustDevice", void 0);
    o([M(cc.Node)], e.prototype, "nodeMain", void 0);
    o([M(cc.Node)], e.prototype, "nodeChanShowChatBanChung", void 0);
    o([M(cc.Node)], e.prototype, "nodeXepBaiMoiMauBinh", void 0);
    o([M(cc.Node)], e.prototype, "nodePasscode", void 0);
    o([M(cc.Node)], e.prototype, "nodeBlockLoginWeb", void 0);
    o([M(cc.Node)], e.prototype, "nodeLayout", void 0);
    o([M(cc.Node)], e.prototype, "nodeHighlight", void 0);
    o([M], e.prototype, "minHeight", void 0);
    o([M], e.prototype, "maxHeight", void 0);
    o([M], e.prototype, "oneRowBonusHeight", void 0);
    return e = o([P], e);
  }(l.default);
i.default = B;
void 0;
