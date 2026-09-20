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
var o = require("./GameConfigManager"),
  a = {
    enable: true,
    urlAnalytic: ""
  };
i.getPasscodeConfig = function() {
  var t = o.default.getInstance().getConfig("passCodeConfig");
  return n({}, a, t);
};
void 0;
