var t = require,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
var n = t("./GameConfigManager");

function o() {
  return n.default.getInstance().getConfig("app_info");
}
i.getAppInfoConfig = o;
i.getBrandCodeConfig = function() {
  return o().brandCode;
};
i.getEnvironmentConfig = function() {
  return o().env || "";
};
i.getbrandEnvironmentKey = function() {
  var t = o();
  return (t && t.brandCode || "") + (t && t.env || "");
};
i.getAppIDConfig = function() {
  return o().app_id;
};
i.getDownloadURLConfig = function() {
  return o().download_url;
};
i.getHostURLConfig = function() {
  return o().host_url;
};
void 0;
