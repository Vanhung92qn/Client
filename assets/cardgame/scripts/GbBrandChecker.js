var t = require,
  i = exports;
"use strict";
var n;
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
(function(t) {
  t.BC102 = "bc114102";
  t.BC103 = "bc114103";
  t.BC4121 = "bc114121";
  t.BC2120 = "bc112120";
  t.BC9070 = "bc119070";
  t.BC4118 = "bc114118";
  t.BC8116 = "bc118116";
  t.BC4114 = "bc114114";
  t.BC222 = "bc116222";
  t.BC6111 = "bc116111";
  t.BC6112 = "bc116112";
  t.BC6223 = "bc116223";
  t.BC6224 = "bc116224";
  t.BC6225 = "bc116225";
  t.BC6226 = "bc116226";
  t.BC6227 = "bc116227";
  t.BC098 = "bc114098";
})(n = i.BRAND_CODE || (i.BRAND_CODE = {}));
var o = new Set([n.BC102, n.BC103, n.BC4121, n.BC2120, n.BC9070, n.BC4118, n.BC8116, n.BC4114]),
  a = new Set([n.BC222, n.BC6111, n.BC6112, n.BC6223, n.BC6224, n.BC6225, n.BC6226, n.BC6227]),
  s = new Set([n.BC098]),
  r = function() {
    function t(t) {
      this.brandCode = t;
    }
    t.prototype.is = function(t) {
      return this.brandCode === t;
    };
    t.prototype.isG0 = function() {
      return o.has(this.brandCode);
    };
    t.prototype.isGTh = function() {
      return a.has(this.brandCode);
    };
    t.prototype.isG2 = function() {
      return s.has(this.brandCode);
    };
    return t;
  }();
i.BrandChecker = r;
void 0;
