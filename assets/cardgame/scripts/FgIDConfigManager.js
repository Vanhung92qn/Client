var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
var __assign = this && this.__assign || function() {
  return (__assign = Object.assign || function(t) {
    for (var e, i = 1, n = arguments.length; i < n; i++) {
      for (var o in e = arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(e, o)) {
          t[o] = e[o];
        }
      }
    }
    return t;
  }).apply(this, arguments);
};
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});
var GameConfigManager = require("./GameConfigManager"),
  GamePlayManager = require("./GamePlayManager"),
  FgIDConfig = function() {
    return function() {
      this.pathInternals = [];
      this.pathInternals = [];
    };
  }();
moduleExports.FgIDConfig = FgIDConfig;
var FgIDConfigManager = function() {
  function FgIDConfigManager() {}
  Object.defineProperty(FgIDConfigManager, "config", {
    get: function() {
      if (null == this._config || this._config && 0 === this._config.pathInternals.length) {
        var serverConfig = GameConfigManager.default.getInstance().getConfig("fgIDConfig"),
          defaultConfig = new FgIDConfig();
        this._config = __assign({}, defaultConfig, serverConfig);
        GamePlayManager.default.getInstance().getFingerPrint();
      }
      return this._config;
    },
    enumerable: true,
    configurable: true
  });
  FgIDConfigManager.checkAddFgIDToHeader = function(xhr, url) {
    var isMatched = false;
    this.config.pathInternals.forEach(function(pathInternal) {
      if (url.includes(pathInternal)) {
        isMatched = true;
      }
    });
    if (isMatched) {
      xhr.setRequestHeader("X-FG-ID", GamePlayManager.default.getInstance().fingerprint);
    }
  };
  FgIDConfigManager._config = null;
  return FgIDConfigManager;
}();
moduleExports.FgIDConfigManager = FgIDConfigManager;
void 0;
