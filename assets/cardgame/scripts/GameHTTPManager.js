var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});
var LocalizeManager = require("LocalizeManager"),
  StringUtil = require("StringUtil"),
  FgIDConfigManager = require("FgIDConfigManager"),
  GamePlayManager = require("GamePlayManager"),
  defaultErrorMsg = "Kh\xf4ng th\u1ec3 k\u1ebft n\u1ed1i \u0111\u1ebfn m\xe1y ch\u1ee7, xin h\xe3y th\u1eed l\u1ea1i.",
  msgTimeoutError = "K\u1ebft n\u1ed1i \u0111\u1ebfn m\xe1y ch\u1ee7 th\u1ea5t b\u1ea1i!",
  GameHTTPManager = function() {
    function GameHTTPManager() {}
    GameHTTPManager.getInstance = function() {
      if (!(null !== this.Instance && void 0 !== this.Instance)) {
        this.Instance = new GameHTTPManager();
      }
      return this.Instance;
    };
    GameHTTPManager.prototype.sendGetHttpRequest = function(url, onSuccess, onErrorMessage, useToken) {
      if (void 0 === useToken) {
        useToken = false;
      }
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (4 == xhr.readyState) {
          if (xhr.status >= 200 && xhr.status < 400) {
            var responseText = xhr.responseText,
              responseData = null;
            try {
              responseData = JSON.parse(responseText);
            } catch (parseError) {}
            onSuccess(responseData);
          } else {
            onErrorMessage(defaultErrorMsg);
          }
        }
      };
      xhr.onerror = function() {
        var message = defaultErrorMsg;
        if (!StringUtil.default.isNullOrEmpty(xhr.responseText)) {
          var errorData = null;
          try {
            errorData = JSON.parse(xhr.responseText);
          } catch (parseError) {}
          if (!(null === errorData || void 0 === errorData || StringUtil.default.isNullOrEmpty(errorData.msg))) {
            message = errorData.msg;
          }
        }
        onErrorMessage(message);
      };
      xhr.ontimeout = function() {
        onErrorMessage(msgTimeoutError);
      };
      xhr.timeout = 3e4;
      xhr.open("GET", url, true);
      if (useToken) {
        if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().session_id)) {
          xhr.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
          xhr.setRequestHeader("Content-Type", "application/json");
        }
      }
      FgIDConfigManager.FgIDConfigManager.checkAddFgIDToHeader(xhr, url);
      xhr.send();
    };
    GameHTTPManager.prototype.sendGetHttpRequestWithMap = function(url, onSuccess, onErrorMessage, headerMap, useToken) {
      if (void 0 === useToken) {
        useToken = false;
      }
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (4 == xhr.readyState) {
          if (xhr.status >= 200 && xhr.status < 400) {
            var responseText = xhr.responseText,
              responseData = null;
            try {
              responseData = JSON.parse(responseText);
            } catch (parseError) {}
            onSuccess(responseData);
          } else {
            onErrorMessage(defaultErrorMsg);
          }
        }
      };
      xhr.onerror = function() {
        var message = defaultErrorMsg;
        if (!StringUtil.default.isNullOrEmpty(xhr.responseText)) {
          var errorData = null;
          try {
            errorData = JSON.parse(xhr.responseText);
          } catch (parseError) {}
          if (!(null === errorData || void 0 === errorData || StringUtil.default.isNullOrEmpty(errorData.msg))) {
            message = errorData.msg;
          }
        }
        onErrorMessage(message);
      };
      xhr.ontimeout = function() {
        onErrorMessage(msgTimeoutError);
      };
      xhr.timeout = 3e4;
      xhr.open("GET", url, true);
      if (useToken) {
        if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().session_id)) {
          xhr.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
          xhr.setRequestHeader("Content-Type", "application/json");
        }
      }
      if (headerMap) {
        headerMap.forEach(function(headerValue, headerName) {
          xhr.setRequestHeader(headerName, headerValue);
        });
      }
      FgIDConfigManager.FgIDConfigManager.checkAddFgIDToHeader(xhr, url);
      xhr.send();
    };
    GameHTTPManager.prototype.sendGetHttpRequestNoJson = function(url, onSuccess, onErrorMessage) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (4 == xhr.readyState) {
          if (xhr.status >= 200 && xhr.status < 400) {
            var responseText = xhr.responseText;
            onSuccess(responseText);
          } else {
            onErrorMessage(defaultErrorMsg);
          }
        }
      };
      xhr.onerror = function() {
        var message = defaultErrorMsg;
        if (!StringUtil.default.isNullOrEmpty(xhr.responseText)) {
          var errorData = null;
          try {
            errorData = JSON.parse(xhr.responseText);
          } catch (parseError) {}
          if (!(null === errorData || void 0 === errorData || StringUtil.default.isNullOrEmpty(errorData.msg))) {
            message = errorData.msg;
          }
        }
        onErrorMessage(message);
      };
      xhr.ontimeout = function() {
        onErrorMessage(msgTimeoutError);
      };
      xhr.timeout = 3e4;
      xhr.open("GET", url, true);
      FgIDConfigManager.FgIDConfigManager.checkAddFgIDToHeader(xhr, url);
      xhr.send();
    };
    GameHTTPManager.prototype.sendGetHttpRequestWithToken = function(url, onSuccess, onErrorMessage) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (4 == xhr.readyState) {
          if (xhr.status >= 200 && xhr.status < 400) {
            var responseText = xhr.responseText;
            onSuccess(JSON.parse(responseText));
          } else {
            onErrorMessage(defaultErrorMsg);
          }
        }
      };
      xhr.onerror = function() {
        var message = defaultErrorMsg;
        if (!StringUtil.default.isNullOrEmpty(xhr.responseText)) {
          var errorData = null;
          try {
            errorData = JSON.parse(xhr.responseText);
          } catch (parseError) {}
          if (!(null === errorData || void 0 === errorData || StringUtil.default.isNullOrEmpty(errorData.msg))) {
            message = errorData.msg;
          }
        }
        onErrorMessage(message);
      };
      xhr.ontimeout = function() {
        onErrorMessage(msgTimeoutError);
      };
      xhr.timeout = 3e4;
      xhr.open("GET", url, true);
      xhr.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
      FgIDConfigManager.FgIDConfigManager.checkAddFgIDToHeader(xhr, url);
      xhr.send();
      return xhr;
    };
    GameHTTPManager.prototype.sendPostHttpRequest = function(url, body, onSuccess, onErrorMessage, useToken, useRawTextOn400, timeoutMs) {
      if (void 0 === useToken) {
        useToken = true;
      }
      if (void 0 === useRawTextOn400) {
        useRawTextOn400 = false;
      }
      if (void 0 === timeoutMs) {
        timeoutMs = 0;
      }
      GameHTTPManager.getInstance().sendPostHttpRequestBase(cc.loader.getXMLHttpRequest(), url, body, onSuccess, onErrorMessage, useToken, useRawTextOn400, timeoutMs);
    };
    GameHTTPManager.prototype.sendPostHttpRequestUseFb = function(url, body, onSuccess, onErrorMessage, useToken, useRawTextOn400, timeoutMs) {
      if (void 0 === useToken) {
        useToken = true;
      }
      if (void 0 === useRawTextOn400) {
        useRawTextOn400 = false;
      }
      if (void 0 === timeoutMs) {
        timeoutMs = 0;
      }
      GameHTTPManager.getInstance().sendPostHttpRequestBase(fb2.getXMLHttpRequest(), url, body, onSuccess, onErrorMessage, useToken, useRawTextOn400, timeoutMs);
    };
    GameHTTPManager.prototype.sendPostHttpRequestBase = function(xhr, url, body, onSuccess, onErrorMessage, useToken, useRawTextOn400, timeoutMs) {
      if (void 0 === useToken) {
        useToken = true;
      }
      if (void 0 === useRawTextOn400) {
        useRawTextOn400 = false;
      }
      if (void 0 === timeoutMs) {
        timeoutMs = 0;
      }
      xhr.onreadystatechange = function() {
        if (4 == xhr.readyState) {
          if (xhr.status >= 200 && xhr.status < 400) {
            var responseText = xhr.responseText,
              responseData = null;
            try {
              responseData = JSON.parse(responseText);
            } catch (parseError) {}
            if (responseData) {
              onSuccess(responseData);
            }
          } else {
            var message = defaultErrorMsg;
            if (!StringUtil.default.isNullOrEmpty(xhr.responseText)) {
              try {
                var errorData = JSON.parse(xhr.responseText);
                if (null === errorData || void 0 === errorData || StringUtil.default.isNullOrEmpty(errorData.msg)) {
                  if (!(null === errorData || void 0 === errorData || StringUtil.default.isNullOrEmpty(errorData.message))) {
                    message = errorData.message;
                  }
                } else {
                  message = errorData.msg;
                }
              } catch (parseError) {
                if (true === useRawTextOn400 && 400 === xhr.status) {
                  message = xhr.responseText;
                }
              }
            }
            onErrorMessage(message);
          }
        }
      };
      xhr.onerror = function() {
        var message = defaultErrorMsg;
        if (!StringUtil.default.isNullOrEmpty(xhr.responseText)) {
          var errorData = null;
          try {
            errorData = JSON.parse(xhr.responseText);
          } catch (parseError) {}
          if (!(null === errorData || void 0 === errorData || StringUtil.default.isNullOrEmpty(errorData.msg))) {
            message = errorData.msg;
          }
        }
        onErrorMessage(message);
      };
      xhr.ontimeout = function() {
        onErrorMessage(msgTimeoutError);
      };
      xhr.timeout = timeoutMs > 0 ? timeoutMs : 3e4;
      xhr.open("POST", url, true);
      if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().session_id)) {
        if (true === useToken) {
          xhr.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
        }
        xhr.setRequestHeader("Content-Type", "application/json");
      }
      FgIDConfigManager.FgIDConfigManager.checkAddFgIDToHeader(xhr, url);
      xhr.send(body);
    };
    GameHTTPManager.prototype.sendPostHttpRequestWithMap = function(url, body, onSuccess, onErrorMessage, headerMap, useToken, useRawTextOn400, timeoutMs) {
      if (void 0 === useToken) {
        useToken = true;
      }
      if (void 0 === useRawTextOn400) {
        useRawTextOn400 = false;
      }
      if (void 0 === timeoutMs) {
        timeoutMs = 0;
      }
      var xhr = cc.loader.getXMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (4 == xhr.readyState) {
          if (xhr.status >= 200 && xhr.status < 400) {
            var responseText = xhr.responseText,
              responseData = null;
            try {
              responseData = JSON.parse(responseText);
            } catch (parseError) {}
            if (responseData) {
              onSuccess(responseData);
            }
          } else {
            var message = defaultErrorMsg;
            if (!StringUtil.default.isNullOrEmpty(xhr.responseText)) {
              try {
                var errorData = JSON.parse(xhr.responseText);
                if (null === errorData || void 0 === errorData || StringUtil.default.isNullOrEmpty(errorData.msg)) {
                  if (!(null === errorData || void 0 === errorData || StringUtil.default.isNullOrEmpty(errorData.message))) {
                    message = errorData.message;
                  }
                } else {
                  message = errorData.msg;
                }
              } catch (parseError) {
                if (true === useRawTextOn400 && 400 === xhr.status) {
                  message = xhr.responseText;
                }
              }
            }
            onErrorMessage(message);
          }
        }
      };
      xhr.onerror = function() {
        var message = defaultErrorMsg;
        if (!StringUtil.default.isNullOrEmpty(xhr.responseText)) {
          var errorData = null;
          try {
            errorData = JSON.parse(xhr.responseText);
          } catch (parseError) {}
          if (!(null === errorData || void 0 === errorData || StringUtil.default.isNullOrEmpty(errorData.msg))) {
            message = errorData.msg;
          }
        }
        onErrorMessage(message);
      };
      xhr.ontimeout = function() {
        onErrorMessage(msgTimeoutError);
      };
      xhr.timeout = timeoutMs > 0 ? timeoutMs : 3e4;
      xhr.open("POST", url, true);
      if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().session_id)) {
        if (true === useToken) {
          xhr.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
        }
        xhr.setRequestHeader("Content-Type", "application/json");
      }
      if (headerMap) {
        headerMap.forEach(function(headerValue, headerName) {
          xhr.setRequestHeader(headerName, headerValue);
        });
      }
      xhr.send(body);
    };
    GameHTTPManager.prototype.onXHRBinaryReady = function(xhr, onSuccess, onError) {
      if (4 == xhr.readyState && xhr.status >= 200 && xhr.status < 400) {
        var binaryData = xhr.response;
        if (onSuccess) {
          onSuccess(binaryData);
        }
      }
    };
    GameHTTPManager.prototype.onXHRReady = function(xhr, onSuccess, onError) {
      if (4 == xhr.readyState) {
        if (xhr.status >= 200 && xhr.status < 400) {
          var responseText = xhr.responseText,
            responseData = null;
          try {
            responseData = JSON.parse(responseText);
          } catch (parseError) {
            return void(onError && onError({
              code: xhr.status,
              msg: xhr.responseText
            }));
          }
          if (onSuccess) {
            onSuccess(responseData);
          }
        } else {
          try {
            if (StringUtil.default.isNullOrEmpty(xhr.responseText)) {
              if (onError) {
                onError({
                  code: xhr.status,
                  msg: defaultErrorMsg
                });
              }
            } else {
              responseData = null;
              responseData = JSON.parse(xhr.responseText);
              if (onError) {
                onError(responseData);
              }
            }
          } catch (parseError) {
            if (onError) {
              onError({
                code: xhr.status,
                msg: parseError
              });
            }
          }
        }
      }
    };
    GameHTTPManager.prototype.onXHRError = function(xhr, onSuccess, onError) {
      try {
        StringUtil.default.isNullOrEmpty(xhr.responseText);
      } catch (readError) {
        return void(onError && onError({
          code: xhr.status,
          msg: readError
        }));
      }
      var errorData = null;
      try {
        errorData = JSON.parse(xhr.responseText);
      } catch (parseError) {
        return void(onError && onError({
          code: xhr.status,
          msg: defaultErrorMsg
        }));
      }
      onError(errorData);
    };
    GameHTTPManager.prototype.getHTTPBinary = function(url, onSuccess, onError, useToken) {
      if (void 0 === useToken) {
        useToken = false;
      }
      var xhr = new XMLHttpRequest(),
        _this = this;
      xhr.responseType = "arraybuffer";
      xhr.onreadystatechange = function() {
        _this.onXHRBinaryReady(xhr, onSuccess, onError);
      };
      xhr.onerror = function(errorEvent) {
        _this.onXHRError(xhr, onSuccess, onError);
      };
      xhr.ontimeout = function() {
        if (onError) {
          onError({
            code: xhr.status,
            msg: msgTimeoutError
          });
        }
      };
      xhr.timeout = 3e4;
      xhr.open("GET", url, true);
      if (useToken) {
        if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().session_id)) {
          xhr.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
        }
      }
      xhr.send();
    };
    GameHTTPManager.prototype.getHTTP = function(url, onSuccess, onError, useToken) {
      if (void 0 === useToken) {
        useToken = false;
      }
      var xhr = new XMLHttpRequest(),
        _this = this;
      xhr.onreadystatechange = function() {
        _this.onXHRReady(xhr, onSuccess, onError);
      };
      xhr.onerror = function() {
        _this.onXHRError(xhr, onSuccess, onError);
      };
      xhr.ontimeout = function() {
        if (onError) {
          onError({
            code: xhr.status,
            msg: msgTimeoutError
          });
        }
      };
      xhr.open("GET", url, true);
      if (useToken) {
        if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().session_id)) {
          xhr.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
          xhr.setRequestHeader("Content-Type", "application/json");
        }
      }
      FgIDConfigManager.FgIDConfigManager.checkAddFgIDToHeader(xhr, url);
      xhr.send();
    };
    GameHTTPManager.prototype.postHTTP = function(url, body, onSuccess, onError, useToken) {
      if (void 0 === useToken) {
        useToken = true;
      }
      var _this = this,
        xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        _this.onXHRReady(xhr, onSuccess, onError);
      };
      xhr.onerror = function() {
        _this.onXHRError(xhr, onSuccess, onError);
      };
      xhr.ontimeout = function() {
        if (onError) {
          onError({
            code: xhr.status,
            msg: msgTimeoutError
          });
        }
      };
      xhr.timeout = 3e4;
      xhr.open("POST", url, true);
      if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().session_id)) {
        if (true === useToken) {
          xhr.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
        }
        xhr.setRequestHeader("Content-Type", "application/json");
      }
      FgIDConfigManager.FgIDConfigManager.checkAddFgIDToHeader(xhr, url);
      xhr.send(body);
    };
    GameHTTPManager.prototype.getRawHTTP = function(url, onSuccess, onError, useToken) {
      if (void 0 === useToken) {
        useToken = false;
      }
      var xhr = new XMLHttpRequest(),
        _this = this;
      xhr.onreadystatechange = function() {
        _this.onRawXHRReady(xhr, onSuccess, onError);
      };
      xhr.onerror = function() {
        _this.onXHRError(xhr, onSuccess, onError);
      };
      xhr.ontimeout = function() {
        onError({
          code: xhr.status,
          msg: LocalizeManager.default.getInstance().GetString("ConnectToServerFail")
        });
      };
      xhr.open("GET", url, true);
      if (useToken) {
        if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().session_id)) {
          xhr.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
          xhr.setRequestHeader("Content-Type", "application/json");
        }
      }
      xhr.send();
    };
    GameHTTPManager.prototype.onRawXHRReady = function(xhr, onSuccess, onError) {
      if (4 == xhr.readyState) {
        if (200 == xhr.status) {
          onSuccess(xhr.responseText);
        } else {
          try {
            if (StringUtil.default.isNullOrEmpty(xhr.responseText)) {
              onError({
                code: xhr.status,
                msg: LocalizeManager.default.getInstance().GetString("NetworkUnstablePleaseTryAgain")
              });
            } else {
              onError({
                code: xhr.status,
                msg: xhr.responseText
              });
            }
          } catch (error) {
            onError({
              code: xhr.status,
              msg: error
            });
          }
        }
      }
    };
    GameHTTPManager.Instance = null;
    return GameHTTPManager;
  }();
moduleExports.default = GameHTTPManager;
void 0;
