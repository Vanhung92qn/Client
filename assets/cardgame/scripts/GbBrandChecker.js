var requireRef = require,
  moduleExports = exports;
"use strict";
var BRAND_CODE;
void 0;
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});
(function(brandCodeEnum) {
  brandCodeEnum.BC102 = "bc114102";
  brandCodeEnum.BC103 = "bc114103";
  brandCodeEnum.BC4121 = "bc114121";
  brandCodeEnum.BC2120 = "bc112120";
  brandCodeEnum.BC9070 = "bc119070";
  brandCodeEnum.BC4118 = "bc114118";
  brandCodeEnum.BC8116 = "bc118116";
  brandCodeEnum.BC4114 = "bc114114";
  brandCodeEnum.BC222 = "bc116222";
  brandCodeEnum.BC6111 = "bc116111";
  brandCodeEnum.BC6112 = "bc116112";
  brandCodeEnum.BC6223 = "bc116223";
  brandCodeEnum.BC6224 = "bc116224";
  brandCodeEnum.BC6225 = "bc116225";
  brandCodeEnum.BC6226 = "bc116226";
  brandCodeEnum.BC6227 = "bc116227";
  brandCodeEnum.BC098 = "bc114098";
})(BRAND_CODE = moduleExports.BRAND_CODE || (moduleExports.BRAND_CODE = {}));
var g0BrandCodes = new Set([BRAND_CODE.BC102, BRAND_CODE.BC103, BRAND_CODE.BC4121, BRAND_CODE.BC2120, BRAND_CODE.BC9070, BRAND_CODE.BC4118, BRAND_CODE.BC8116, BRAND_CODE.BC4114]),
  gThBrandCodes = new Set([BRAND_CODE.BC222, BRAND_CODE.BC6111, BRAND_CODE.BC6112, BRAND_CODE.BC6223, BRAND_CODE.BC6224, BRAND_CODE.BC6225, BRAND_CODE.BC6226, BRAND_CODE.BC6227]),
  g2BrandCodes = new Set([BRAND_CODE.BC098]),
  BrandChecker = function() {
    function BrandChecker(brandCode) {
      this.brandCode = brandCode;
    }
    BrandChecker.prototype.is = function(brandCode) {
      return this.brandCode === brandCode;
    };
    BrandChecker.prototype.isG0 = function() {
      return g0BrandCodes.has(this.brandCode);
    };
    BrandChecker.prototype.isGTh = function() {
      return gThBrandCodes.has(this.brandCode);
    };
    BrandChecker.prototype.isG2 = function() {
      return g2BrandCodes.has(this.brandCode);
    };
    return BrandChecker;
  }();
moduleExports.BrandChecker = BrandChecker;
void 0;
