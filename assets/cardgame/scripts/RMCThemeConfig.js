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
var ThemeType,
  GameConfigManager = require("GameConfigManager");
(function(ThemeType) {
  ThemeType[ThemeType.DEFAULT = 0] = "DEFAULT";
  ThemeType[ThemeType.EURO = 1] = "EURO";
  ThemeType[ThemeType.HAPPY_NEW_YEAR = 2] = "HAPPY_NEW_YEAR";
  ThemeType[ThemeType.NOEL = 3] = "NOEL";
  ThemeType[ThemeType.WORLD_CUP = 4] = "WORLD_CUP";
  ThemeType[ThemeType.VN_304 = 5] = "VN_304";
  ThemeType[ThemeType.MID_AUTUMN_FESTIVAL = 6] = "MID_AUTUMN_FESTIVAL";
  ThemeType[ThemeType.HALLOWEEN = 7] = "HALLOWEEN";
})(ThemeType = moduleExports.ThemeType || (moduleExports.ThemeType = {}));
var defaultThemeConfig = {
  themeType: ThemeType.DEFAULT
};

function getThemeConfig() {
  var themeConfig = GameConfigManager.default.getInstance().getConfig("themeConfig");
  return __assign({}, defaultThemeConfig, themeConfig);
}
moduleExports.getThemeConfig = getThemeConfig;
moduleExports.getCurrentTheme = function() {
  return getThemeConfig().themeType;
};
void 0;
