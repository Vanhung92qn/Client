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
  a = require("./GamePlayManager"),
  s = function() {
    return function() {
      this.pathInternals = [];
      this.pathInternals = [];
    };
  }();
i.FgIDConfig = s;
var r = function() {
  function t() {}
  Object.defineProperty(t, "config", {
    get: function() {
      if (null == this._config || this._config && 0 === this._config.pathInternals.length) {
        var t = o.default.getInstance().getConfig("fgIDConfig"),
          e = new s();
        this._config = n({}, e, t);
        a.default.getInstance().getFingerPrint();
      }
      return this._config;
    },
    enumerable: true,
    configurable: true
  });
  t.checkAddFgIDToHeader = function(t, e) {
    var i = false;
    this.config.pathInternals.forEach(function(t) {
      if (e.includes(t)) {
        i = true;
      }
    });
    if (i) {
      t.setRequestHeader("X-FG-ID", a.default.getInstance().fingerprint);
    }
  };
  t._config = null;
  return t;
}();
i.FgIDConfigManager = r;
void 0;
