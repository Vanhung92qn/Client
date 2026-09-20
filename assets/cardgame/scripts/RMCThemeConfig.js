var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
var n = this && this.__assign || function() {
  return (n = Object.assign || function(t) {
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
Object.defineProperty(i, "__esModule", {
  value: true
});
var o,
  a = require("./GameConfigManager");
(function(t) {
  t[t.DEFAULT = 0] = "DEFAULT";
  t[t.EURO = 1] = "EURO";
  t[t.HAPPY_NEW_YEAR = 2] = "HAPPY_NEW_YEAR";
  t[t.NOEL = 3] = "NOEL";
  t[t.WORLD_CUP = 4] = "WORLD_CUP";
  t[t.VN_304 = 5] = "VN_304";
  t[t.MID_AUTUMN_FESTIVAL = 6] = "MID_AUTUMN_FESTIVAL";
  t[t.HALLOWEEN = 7] = "HALLOWEEN";
})(o = i.ThemeType || (i.ThemeType = {}));
var s = {
  themeType: o.DEFAULT
};

function r() {
  var t = a.default.getInstance().getConfig("themeConfig");
  return n({}, s, t);
}
i.getThemeConfig = r;
i.getCurrentTheme = function() {
  return r().themeType;
};
void 0;
