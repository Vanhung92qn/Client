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
//   r = GameUtils   c = StringUtil   l = GameConfigManager
//   h = RMCThemeConfig
// ────────────────────────────────────────────────────────────────
var r = require("./GameUtils"),
  c = require("./StringUtil"),
  l = require("./GameConfigManager"),
  h = require("./RMCThemeConfig"),
  u = cc._decorator,
  d = u.ccclass,
  p = (u.property, function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.onPlayMusic = false;
      e.isLostFocus = false;
      e.countTimeCheckMusic = 0;
      e.allowPlayBtnClick = true;
      e.loppEffectId = -1;
      e.currEffectId = -1;
      return e;
    }
    var i;
    n(e, t);
    i = e;
    e.getInstance = function() {
      if (!(null === this.Instance)) {
        this.Instance;
      }
      return this.Instance;
    };
    e.prototype.onLoad = function() {
      i.Instance = this;
    };
    e.prototype.lateUpdate = function() {
      if (false !== l.default.getInstance().enableBackgroundMusic && this.onPlayMusic && (this.countTimeCheckMusic += 1, !(this
          .countTimeCheckMusic < 5) && (this.countTimeCheckMusic = 0, cc.audioEngine.isMusicPlaying() && !cc.sys.isNative))) {
        var t = cc.sys.__audioSupport.context;
        if ("suspended" === t.state) {
          t.resume();
        }
      }
    };
    e.prototype.init = function() {};
    e.prototype.stopMusic = function() {
      cc.audioEngine.stopMusic();
      l.default.getInstance().currentBgMusic = "";
      l.default.getInstance().isPlayingLobbyMusicBg = false;
    };
    e.prototype.PauseMusic = function() {
      cc.audioEngine.pauseMusic();
      this.onPlayMusic = false;
    };
    e.prototype.ResumeMusic = function() {
      if (false !== l.default.getInstance().enableBackgroundMusic) {
        cc.audioEngine.resumeMusic();
        this.onPlayMusic = true;
      }
    };
    e.prototype.playBackgroundMusic = function(t, e) {
      if (void 0 === e) {
        e = 1;
      }
      if (!this.isLostFocus) {
        if (false !== l.default.getInstance().enableBackgroundMusic && (c.default.isNullOrEmpty(t) || c.default.isNullOrEmpty(l.default
            .getInstance().currentBgMusic) || 0 !== l.default.getInstance().currentBgMusic.localeCompare(t))) {
          cc.audioEngine.setMusicVolume(e);
          l.default.getInstance().currentBgMusic = t;
          cc.loader.loadRes(t, cc.AudioClip, this.playBgMusicWhenLoadDone.bind(this));
        }
      }
    };
    e.prototype.playBgMusicWhenLoadDone = function(t, e) {
      if (null === t || void 0 === t) {
        if (false === l.default.getInstance().enableBackgroundMusic) {
          l.default.getInstance().currentBgMusic = "";
          return void(l.default.getInstance().isPlayingLobbyMusicBg = false);
        }
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(e, true);
      }
    };
    e.prototype.playRandomIngameBgMusic = function() {
      l.default.getInstance().isPlayingLobbyMusicBg = false;
      this.playRandomBackgroundMusic(["Sounds/ig/ig_music_1", "Sounds/ig/ig_music_2", "Sounds/ig/ig_music_3"]);
    };
    e.prototype.playRandomLobbyMusic = function() {
      if (true !== l.default.getInstance().isPlayingLobbyMusicBg) {
        if (true === l.default.getInstance().enableBackgroundMusic) {
          l.default.getInstance().isPlayingLobbyMusicBg = true;
        }
        if (cc.audioEngine.getMusicVolume() < 1) {
          cc.audioEngine.setMusicVolume(1);
        }
        this.playRandomLobbyBgMusic();
      }
    };
    e.prototype.playRandomBgMusicFromRemoteConfig = function() {
      var t = l.default.getInstance().listLobbyBgMusic;
      if (t && t.length > 0) {
        var e = c.default.getRandomInt(t.length);
        this.playBackgroundMusic(t[e]);
      } else {
        this.playBackgroundMusic("Sounds/lobby/BGM_lobby_default");
      }
    };
    e.prototype.playRandomBackgroundMusic = function(t) {
      if (0 !== t.length) {
        var e = c.default.getRandomInt(t.length);
        this.playBackgroundMusic(t[e]);
      }
    };
    e.prototype.playLoginBgMusic = function() {
      this.playRandomLobbyBgMusic();
    };
    e.prototype.playRandomLobbyBgMusic = function() {
      switch (h.getCurrentTheme()) {
        case h.ThemeType.HAPPY_NEW_YEAR:
          this.playBackgroundMusic("Sounds/lobby/BGM-Newyear");
          break;
        case h.ThemeType.NOEL:
          this.playBackgroundMusic("Sounds/lobby/BGM_Noel_Hitclub");
          break;
        case h.ThemeType.WORLD_CUP:
          this.playBackgroundMusic("Sounds/lobby/BGM_Worldcup");
          break;
        case h.ThemeType.VN_304:
          this.playBackgroundMusic("Sounds/lobby/BGM_304");
          break;
        case h.ThemeType.MID_AUTUMN_FESTIVAL:
          this.playBackgroundMusic("Sounds/lobby/BGM-MoonFestival");
          break;
        case h.ThemeType.HALLOWEEN:
          this.playBackgroundMusic("Sounds/lobby/BGM-Halloween");
          break;
        case h.ThemeType.DEFAULT:
        default:
          this.playRandomBgMusicFromRemoteConfig();
      }
    };
    e.prototype.stopEffect = function(t) {
      cc.audioEngine.stopEffect(t);
    };
    e.prototype.stopAllEffect = function() {
      cc.audioEngine.stopAllEffects();
    };
    e.prototype.playEffect = function(t, e, i) {
      if (void 0 === e) {
        e = false;
      }
      if (void 0 === i) {
        i = null;
      }
      if (!this.isLostFocus) {
        if (false !== l.default.getInstance().enableSound) {
          if (0 == e) {
            cc.loader.loadRes(t, cc.AudioClip, this.playEffectWhenLoadDone.bind(this));
          } else {
            cc.loader.loadRes(t, cc.AudioClip, this.playEffectWhenLoadDoneWithId.bind(this));
          }
        }
      }
    };
    e.prototype.playEffectWithCallBack = function(t, e) {
      if (void 0 === e) {
        e = null;
      }
      if (!this.isLostFocus) {
        if (false !== l.default.getInstance().enableSound) {
          cc.loader.loadRes(t, cc.AudioClip, function(t, i) {
            if ((null === t || void 0 === t) && null != i && void 0 != i) {
              var n = cc.audioEngine.playEffect(i, false);
              if (e) {
                e(n);
              }
            }
          });
        }
      }
    };
    e.prototype.playEffectWithClip = function(t) {
      if (!this.isLostFocus) {
        if (false !== l.default.getInstance().enableSound && null != t && void 0 != t) {
          cc.audioEngine.playEffect(t, false);
        }
      }
    };
    e.prototype.preloadEffect = function(t, e) {
      cc.audioEngine.preload(t, e);
    };
    e.prototype.playEffectWhenLoadDone = function(t, e) {
      if (!(null !== t && void 0 !== t)) {
        if (null != e && void 0 != e) {
          cc.audioEngine.playEffect(e, false);
        }
      }
    };
    e.prototype.playEffectWhenLoadDoneWithId = function(t, e) {
      if (!(null !== t && void 0 !== t)) {
        if (null != e && void 0 != e) {
          this.currEffectId = cc.audioEngine.playEffect(e, false);
        }
      }
    };
    e.prototype.playEffectLoop = function(t) {
      if (!this.isLostFocus) {
        if (false !== l.default.getInstance().enableSound) {
          cc.loader.loadRes(t, cc.AudioClip, this.playEffectWhenLoadDoneLoop.bind(this));
        }
      }
    };
    e.prototype.playEffectWhenLoadDoneLoop = function(t, e) {
      if (!(null !== t && void 0 !== t)) {
        this.loppEffectId = cc.audioEngine.playEffect(e, true);
      }
    };
    e.prototype.stopEffectLoop = function() {
      if (-1 !== this.loppEffectId) {
        cc.audioEngine.stopEffect(this.loppEffectId);
        this.loppEffectId = -1;
      }
    };
    e.prototype.stopCurrEffect = function() {
      if (-1 !== this.currEffectId) {
        cc.audioEngine.stopEffect(this.currEffectId);
        this.currEffectId = -1;
      }
    };
    e.prototype.playbtnClick = function(t) {
      if (void 0 === t) {
        t = 0;
      }
      if (this.allowPlayBtnClick) {
        this.playEffect("Sounds/sfx_normal_btn");
        if (0 != t) {
          this.delayPlayBtnClick(t);
        }
      }
    };
    e.prototype.playbtnShopClick = function() {
      this.playEffect("Sounds/sfx_btn_shop");
    };
    e.prototype.delayPlayBtnClick = function(t) {
      return a(this, void 0, Promise, function() {
        return s(this, function(e) {
          switch (e.label) {
            case 0:
              return this.allowPlayBtnClick = false, [4, r.delay(1e3 * t)];
            case 1:
              return e.sent(), this.allowPlayBtnClick = true, [2];
          }
        });
      });
    };
    e.Instance = null;
    return e = i = o([d], e);
  }(cc.Component));
i.default = p;
void 0;
