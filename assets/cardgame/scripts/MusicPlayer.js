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
var GameUtils = require("./GameUtils"),
  StringUtil = require("./StringUtil"),
  GameConfigManager = require("./GameConfigManager"),
  RMCThemeConfig = require("./RMCThemeConfig"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  MusicPlayer = (ccDecorator.property, function(_super) {
    function MusicPlayer() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.onPlayMusic = false;
      _this.isLostFocus = false;
      _this.countTimeCheckMusic = 0;
      _this.allowPlayBtnClick = true;
      _this.loppEffectId = -1;
      _this.currEffectId = -1;
      return _this;
    }
    var MusicPlayer_1;
    __extends(MusicPlayer, _super);
    MusicPlayer_1 = MusicPlayer;
    MusicPlayer.getInstance = function() {
      if (!(null === this.Instance)) {
        this.Instance;
      }
      return this.Instance;
    };
    MusicPlayer.prototype.onLoad = function() {
      MusicPlayer_1.Instance = this;
    };
    MusicPlayer.prototype.lateUpdate = function() {
      if (false !== GameConfigManager.default.getInstance().enableBackgroundMusic && this.onPlayMusic && (this.countTimeCheckMusic += 1, !(this
          .countTimeCheckMusic < 5) && (this.countTimeCheckMusic = 0, cc.audioEngine.isMusicPlaying() && !cc.sys.isNative))) {
        var audioContext = cc.sys.__audioSupport.context;
        if ("suspended" === audioContext.state) {
          audioContext.resume();
        }
      }
    };
    MusicPlayer.prototype.init = function() {};
    MusicPlayer.prototype.stopMusic = function() {
      cc.audioEngine.stopMusic();
      GameConfigManager.default.getInstance().currentBgMusic = "";
      GameConfigManager.default.getInstance().isPlayingLobbyMusicBg = false;
    };
    MusicPlayer.prototype.PauseMusic = function() {
      cc.audioEngine.pauseMusic();
      this.onPlayMusic = false;
    };
    MusicPlayer.prototype.ResumeMusic = function() {
      if (false !== GameConfigManager.default.getInstance().enableBackgroundMusic) {
        cc.audioEngine.resumeMusic();
        this.onPlayMusic = true;
      }
    };
    MusicPlayer.prototype.playBackgroundMusic = function(musicResPath, volume) {
      if (void 0 === volume) {
        volume = 1;
      }
      if (!this.isLostFocus) {
        if (false !== GameConfigManager.default.getInstance().enableBackgroundMusic && (StringUtil.default.isNullOrEmpty(musicResPath) || StringUtil.default.isNullOrEmpty(GameConfigManager.default
            .getInstance().currentBgMusic) || 0 !== GameConfigManager.default.getInstance().currentBgMusic.localeCompare(musicResPath))) {
          cc.audioEngine.setMusicVolume(volume);
          GameConfigManager.default.getInstance().currentBgMusic = musicResPath;
          cc.loader.loadRes(musicResPath, cc.AudioClip, this.playBgMusicWhenLoadDone.bind(this));
        }
      }
    };
    MusicPlayer.prototype.playBgMusicWhenLoadDone = function(loadError, audioClip) {
      if (null === loadError || void 0 === loadError) {
        if (false === GameConfigManager.default.getInstance().enableBackgroundMusic) {
          GameConfigManager.default.getInstance().currentBgMusic = "";
          return void(GameConfigManager.default.getInstance().isPlayingLobbyMusicBg = false);
        }
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(audioClip, true);
      }
    };
    MusicPlayer.prototype.playRandomIngameBgMusic = function() {
      GameConfigManager.default.getInstance().isPlayingLobbyMusicBg = false;
      this.playRandomBackgroundMusic(["Sounds/ig/ig_music_1", "Sounds/ig/ig_music_2", "Sounds/ig/ig_music_3"]);
    };
    MusicPlayer.prototype.playRandomLobbyMusic = function() {
      if (true !== GameConfigManager.default.getInstance().isPlayingLobbyMusicBg) {
        if (true === GameConfigManager.default.getInstance().enableBackgroundMusic) {
          GameConfigManager.default.getInstance().isPlayingLobbyMusicBg = true;
        }
        if (cc.audioEngine.getMusicVolume() < 1) {
          cc.audioEngine.setMusicVolume(1);
        }
        this.playRandomLobbyBgMusic();
      }
    };
    MusicPlayer.prototype.playRandomBgMusicFromRemoteConfig = function() {
      var lobbyMusicList = GameConfigManager.default.getInstance().listLobbyBgMusic;
      if (lobbyMusicList && lobbyMusicList.length > 0) {
        var randomIndex = StringUtil.default.getRandomInt(lobbyMusicList.length);
        this.playBackgroundMusic(lobbyMusicList[randomIndex]);
      } else {
        this.playBackgroundMusic("Sounds/lobby/BGM_lobby_default");
      }
    };
    MusicPlayer.prototype.playRandomBackgroundMusic = function(musicResPaths) {
      if (0 !== musicResPaths.length) {
        var randomIndex = StringUtil.default.getRandomInt(musicResPaths.length);
        this.playBackgroundMusic(musicResPaths[randomIndex]);
      }
    };
    MusicPlayer.prototype.playLoginBgMusic = function() {
      this.playRandomLobbyBgMusic();
    };
    MusicPlayer.prototype.playRandomLobbyBgMusic = function() {
      switch (RMCThemeConfig.getCurrentTheme()) {
        case RMCThemeConfig.ThemeType.HAPPY_NEW_YEAR:
          this.playBackgroundMusic("Sounds/lobby/BGM-Newyear");
          break;
        case RMCThemeConfig.ThemeType.NOEL:
          this.playBackgroundMusic("Sounds/lobby/BGM_Noel_Hitclub");
          break;
        case RMCThemeConfig.ThemeType.WORLD_CUP:
          this.playBackgroundMusic("Sounds/lobby/BGM_Worldcup");
          break;
        case RMCThemeConfig.ThemeType.VN_304:
          this.playBackgroundMusic("Sounds/lobby/BGM_304");
          break;
        case RMCThemeConfig.ThemeType.MID_AUTUMN_FESTIVAL:
          this.playBackgroundMusic("Sounds/lobby/BGM-MoonFestival");
          break;
        case RMCThemeConfig.ThemeType.HALLOWEEN:
          this.playBackgroundMusic("Sounds/lobby/BGM-Halloween");
          break;
        case RMCThemeConfig.ThemeType.DEFAULT:
        default:
          this.playRandomBgMusicFromRemoteConfig();
      }
    };
    MusicPlayer.prototype.stopEffect = function(effectId) {
      cc.audioEngine.stopEffect(effectId);
    };
    MusicPlayer.prototype.stopAllEffect = function() {
      cc.audioEngine.stopAllEffects();
    };
    MusicPlayer.prototype.playEffect = function(effectResPath, shouldKeepEffectId, unusedCallback) {
      if (void 0 === shouldKeepEffectId) {
        shouldKeepEffectId = false;
      }
      if (void 0 === unusedCallback) {
        unusedCallback = null;
      }
      if (!this.isLostFocus) {
        if (false !== GameConfigManager.default.getInstance().enableSound) {
          if (0 == shouldKeepEffectId) {
            cc.loader.loadRes(effectResPath, cc.AudioClip, this.playEffectWhenLoadDone.bind(this));
          } else {
            cc.loader.loadRes(effectResPath, cc.AudioClip, this.playEffectWhenLoadDoneWithId.bind(this));
          }
        }
      }
    };
    MusicPlayer.prototype.playEffectWithCallBack = function(effectResPath, onPlayed) {
      if (void 0 === onPlayed) {
        onPlayed = null;
      }
      if (!this.isLostFocus) {
        if (false !== GameConfigManager.default.getInstance().enableSound) {
          cc.loader.loadRes(effectResPath, cc.AudioClip, function(loadError, audioClip) {
            if ((null === loadError || void 0 === loadError) && null != audioClip && void 0 != audioClip) {
              var effectId = cc.audioEngine.playEffect(audioClip, false);
              if (onPlayed) {
                onPlayed(effectId);
              }
            }
          });
        }
      }
    };
    MusicPlayer.prototype.playEffectWithClip = function(audioClip) {
      if (!this.isLostFocus) {
        if (false !== GameConfigManager.default.getInstance().enableSound && null != audioClip && void 0 != audioClip) {
          cc.audioEngine.playEffect(audioClip, false);
        }
      }
    };
    MusicPlayer.prototype.preloadEffect = function(effectResPath, onPreloaded) {
      cc.audioEngine.preload(effectResPath, onPreloaded);
    };
    MusicPlayer.prototype.playEffectWhenLoadDone = function(loadError, audioClip) {
      if (!(null !== loadError && void 0 !== loadError)) {
        if (null != audioClip && void 0 != audioClip) {
          cc.audioEngine.playEffect(audioClip, false);
        }
      }
    };
    MusicPlayer.prototype.playEffectWhenLoadDoneWithId = function(loadError, audioClip) {
      if (!(null !== loadError && void 0 !== loadError)) {
        if (null != audioClip && void 0 != audioClip) {
          this.currEffectId = cc.audioEngine.playEffect(audioClip, false);
        }
      }
    };
    MusicPlayer.prototype.playEffectLoop = function(effectResPath) {
      if (!this.isLostFocus) {
        if (false !== GameConfigManager.default.getInstance().enableSound) {
          cc.loader.loadRes(effectResPath, cc.AudioClip, this.playEffectWhenLoadDoneLoop.bind(this));
        }
      }
    };
    MusicPlayer.prototype.playEffectWhenLoadDoneLoop = function(loadError, audioClip) {
      if (!(null !== loadError && void 0 !== loadError)) {
        this.loppEffectId = cc.audioEngine.playEffect(audioClip, true);
      }
    };
    MusicPlayer.prototype.stopEffectLoop = function() {
      if (-1 !== this.loppEffectId) {
        cc.audioEngine.stopEffect(this.loppEffectId);
        this.loppEffectId = -1;
      }
    };
    MusicPlayer.prototype.stopCurrEffect = function() {
      if (-1 !== this.currEffectId) {
        cc.audioEngine.stopEffect(this.currEffectId);
        this.currEffectId = -1;
      }
    };
    MusicPlayer.prototype.playbtnClick = function(lockSeconds) {
      if (void 0 === lockSeconds) {
        lockSeconds = 0;
      }
      if (this.allowPlayBtnClick) {
        this.playEffect("Sounds/sfx_normal_btn");
        if (0 != lockSeconds) {
          this.delayPlayBtnClick(lockSeconds);
        }
      }
    };
    MusicPlayer.prototype.playbtnShopClick = function() {
      this.playEffect("Sounds/sfx_btn_shop");
    };
    MusicPlayer.prototype.delayPlayBtnClick = function(lockSeconds) {
      return __awaiter(this, void 0, Promise, function() {
        return __generator(this, function(e) {
          switch (e.label) {
            case 0:
              return this.allowPlayBtnClick = false, [4, GameUtils.delay(1e3 * lockSeconds)];
            case 1:
              return e.sent(), this.allowPlayBtnClick = true, [2];
          }
        });
      });
    };
    MusicPlayer.Instance = null;
    return MusicPlayer = MusicPlayer_1 = __decorate([ccclass], MusicPlayer);
  }(cc.Component));
moduleExports.default = MusicPlayer;
void 0;
