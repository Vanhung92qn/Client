var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});
var GameConfigManager = require("./GameConfigManager"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  BaccaratLiveVariant = function() {
    function BaccaratLiveVariant() {}
    Object.defineProperty(BaccaratLiveVariant, "config", {
      get: function() {
        var config = GameConfigManager.default.getInstance().getConfig("baccaratLiveReplaceConfig");
        return config && true === config.enable ? config : null;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(BaccaratLiveVariant, "gameID", {
      get: function() {
        var config = this.config;
        return config && config.gameID ? config.gameID : MessageCardGameHandler.GAMEID.BACCARAT_LIVE;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(BaccaratLiveVariant, "gameIDNumber", {
      get: function() {
        var gameIdNumber = parseInt(this.gameID.replace("vgmn_", ""), 10);
        return isNaN(gameIdNumber) ? MessageCardGameHandler.GAME.BACCARAT_LIVE : gameIdNumber;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(BaccaratLiveVariant, "pluginName", {
      get: function() {
        var config = this.config;
        return config && config.pluginName ? config.pluginName : "baccarat_live_gateway_plugin";
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(BaccaratLiveVariant, "cmdBase", {
      get: function() {
        var config = this.config;
        return config && config.cmdBase ? config.cmdBase : 19e3;
      },
      enumerable: true,
      configurable: true
    });
    BaccaratLiveVariant.toWireCmd = function(cmd) {
      var cmdBase = this.cmdBase;
      return 19e3 !== cmdBase && cmd >= 19e3 && cmd < 2e4 ? cmdBase + (cmd - 19e3) : cmd;
    };
    BaccaratLiveVariant.fromWireCmd = function(wireCmd) {
      var cmdBase = this.cmdBase;
      return 19e3 !== cmdBase && wireCmd >= cmdBase && wireCmd < cmdBase + 1e3 ? wireCmd - cmdBase + 19e3 : wireCmd;
    };
    BaccaratLiveVariant.isBaccaratLiveID = function(gameId) {
      return gameId === MessageCardGameHandler.GAMEID.BACCARAT_LIVE || gameId === this.gameID;
    };
    return BaccaratLiveVariant;
  }();
moduleExports.BaccaratLiveVariant = BaccaratLiveVariant;
void 0;
