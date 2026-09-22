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
var GameConfigManager = require("GameConfigManager"),
  defaultConfig = {
    enable: true
  };
moduleExports.getBlockLoginWebConfig = function() {
  var config = GameConfigManager.default.getInstance().getConfig("blockLoginWebConfig");
  return __assign({}, defaultConfig, config);
};
void 0;
