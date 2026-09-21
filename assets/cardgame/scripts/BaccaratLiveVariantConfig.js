var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
var GameConfigManager = require("./GameConfigManager"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  a = function() {
    function t() {}
    Object.defineProperty(t, "config", {
      get: function() {
        var t = GameConfigManager.default.getInstance().getConfig("baccaratLiveReplaceConfig");
        return t && true === t.enable ? t : null;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(t, "gameID", {
      get: function() {
        var t = this.config;
        return t && t.gameID ? t.gameID : MessageCardGameHandler.GAMEID.BACCARAT_LIVE;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(t, "gameIDNumber", {
      get: function() {
        var t = parseInt(this.gameID.replace("vgmn_", ""), 10);
        return isNaN(t) ? MessageCardGameHandler.GAME.BACCARAT_LIVE : t;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(t, "pluginName", {
      get: function() {
        var t = this.config;
        return t && t.pluginName ? t.pluginName : "baccarat_live_gateway_plugin";
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(t, "cmdBase", {
      get: function() {
        var t = this.config;
        return t && t.cmdBase ? t.cmdBase : 19e3;
      },
      enumerable: true,
      configurable: true
    });
    t.toWireCmd = function(t) {
      var e = this.cmdBase;
      return 19e3 !== e && t >= 19e3 && t < 2e4 ? e + (t - 19e3) : t;
    };
    t.fromWireCmd = function(t) {
      var e = this.cmdBase;
      return 19e3 !== e && t >= e && t < e + 1e3 ? t - e + 19e3 : t;
    };
    t.isBaccaratLiveID = function(t) {
      return t === MessageCardGameHandler.GAMEID.BACCARAT_LIVE || t === this.gameID;
    };
    return t;
  }();
i.BaccaratLiveVariant = a;
void 0;
