var requireRef = require,
  moduleExports = exports;
"use strict";
void 0;
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});
var GameConfigManager = require("GameConfigManager");

function getAppInfoConfig() {
  return GameConfigManager.default.getInstance().getConfig("app_info");
}
moduleExports.getAppInfoConfig = getAppInfoConfig;
moduleExports.getBrandCodeConfig = function() {
  return getAppInfoConfig().brandCode;
};
moduleExports.getEnvironmentConfig = function() {
  return getAppInfoConfig().env || "";
};
moduleExports.getbrandEnvironmentKey = function() {
  var appInfo = getAppInfoConfig();
  return (appInfo && appInfo.brandCode || "") + (appInfo && appInfo.env || "");
};
moduleExports.getAppIDConfig = function() {
  return getAppInfoConfig().app_id;
};
moduleExports.getDownloadURLConfig = function() {
  return getAppInfoConfig().download_url;
};
moduleExports.getHostURLConfig = function() {
  return getAppInfoConfig().host_url;
};
void 0;
