var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
var __decorate = this && this.__decorate || function(t, e, i, n) {
  var o,
    a = arguments.length,
    s = a < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, i) : n;
  if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) {
    s = Reflect.decorate(t, e, i, n);
  } else {
    for (var r = t.length - 1; r >= 0; r--) {
      if (o = t[r]) {
        s = (a < 3 ? o(s) : a > 3 ? o(e, i, s) : o(e, i)) || s;
      }
    }
  }
  if (a > 3 && s) {
    Object.defineProperty(e, i, s);
  }
  return s;
};
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});
var StringUtil = require("./StringUtil"),
  GameConfigManager = require("./GameConfigManager"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  GamePlayManager = require("./GamePlayManager"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  GbBrandChecker = require("./GbBrandChecker"),
  RMCAppInfoConfig = require("./RMCAppInfoConfig"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  moneyTickInterval = (ccDecorator.property, .07),
  brandImageFileNames = ["game-icon.png", "header.png", "logo.png", "image.png", "icon-mini.png"];
(function(WccBrandImageType) {
  WccBrandImageType[WccBrandImageType.Logo512 = 0] = "Logo512";
  WccBrandImageType[WccBrandImageType.Header280 = 1] = "Header280";
  WccBrandImageType[WccBrandImageType.Header724 = 2] = "Header724";
  WccBrandImageType[WccBrandImageType.Splash1700 = 3] = "Splash1700";
  WccBrandImageType[WccBrandImageType.Logo144 = 4] = "Logo144";
})(moduleExports.WccBrandImageType || (moduleExports.WccBrandImageType = {}));
moduleExports.getWccBrandUrl = function(webccBrand, imageType) {
  try {
    var url = window.location.origin + "/splash/brands/" + webccBrand + "/" + brandImageFileNames[imageType] + "?kt=" + Date.now();
    console.warn("getWccBrandUrl", url);
    return url;
  } catch (error) {
    return "";
  }
};
moduleExports.downloadAndShowImage = function(sprite, urlOrResPath, onLoaded) {
  if (null != sprite && sprite.isValid && null != urlOrResPath && urlOrResPath.length > 0) {
    if (urlOrResPath.indexOf("http") >= 0) {
      cc.loader.load(urlOrResPath, function(loadError, texture) {
        if (null === loadError || void 0 === loadError) {
          try {
            if (null != sprite && sprite.isValid && null != texture) {
              var spriteFrame = new cc.SpriteFrame(texture);
              sprite.spriteFrame = spriteFrame;
              if (onLoaded) {
                onLoaded(spriteFrame);
              }
            }
          } catch (error) {
            cc.warn("Can't load image from URL " + urlOrResPath, error);
            if (onLoaded) {
              onLoaded();
            }
          }
        } else {
          cc.warn("Can't download from " + urlOrResPath);
        }
      });
    } else {
      cc.loader.loadRes(urlOrResPath, function(loadError, texture) {
        if (null === loadError || void 0 === loadError) {
          try {
            if (null != sprite && sprite.isValid && null != texture) {
              var spriteFrame = new cc.SpriteFrame(texture);
              sprite.spriteFrame = spriteFrame;
              if (onLoaded) {
                onLoaded(spriteFrame);
              }
            }
          } catch (error) {
            cc.warn("Can't load image from URL " + urlOrResPath, error);
            if (onLoaded) {
              onLoaded();
            }
          }
        }
      });
    }
  }
};
var MapString = function() {
  function MapString() {
    this.map = {};
  }
  MapString.prototype.getLength = function() {
    return Object.keys(this.map).length;
  };
  MapString.prototype.set = function(key, value) {
    this.map[key] = value;
  };
  MapString.prototype.get = function(key) {
    return this.map[key];
  };
  MapString.prototype.forEach = function(callback) {
    var keys = Object.keys(this.map);
    if (null != keys && void 0 != keys) {
      for (var index = 0; index < keys.length; index++) {
        if (!(null == keys[index] && void 0 == keys[index])) {
          callback(keys[index], this.map[keys[index]]);
        }
      }
    }
  };
  MapString.prototype.getListKeys = function() {
    return Object.keys(this.map);
  };
  MapString.prototype.isContainKey = function(key) {
    return void 0 != this.map[key];
  };
  MapString.prototype.removeKey = function(key) {
    delete this.map[key];
  };
  MapString.prototype.clear = function() {
    for (var keys = Object.keys(this.map), index = 0; index < keys.length; index++) {
      this.removeKey(keys[index]);
    }
  };
  return MapString = __decorate([ccclass], MapString);
}();
moduleExports.MapString = MapString;
var NativeInterop = function() {
  function NativeInterop() {
    this.section = "default";
    this.mapping = {};
    this.refreshSectionName();
  }
  Object.defineProperty(NativeInterop, "Instance", {
    get: function() {
      if (!NativeInterop._instance) {
        NativeInterop._instance = new NativeInterop();
      }
      return NativeInterop._instance;
    },
    enumerable: true,
    configurable: true
  });
  NativeInterop.prototype.getFunctionName = function(defaultFunctionName) {
    return this.mapping && defaultFunctionName && this.mapping[this.section] && this.mapping[this.section][defaultFunctionName] || defaultFunctionName;
  };
  NativeInterop.prototype.init = function() {};
  NativeInterop.prototype.setMapping = function(mapping) {
    if (mapping) {
      this.mapping = mapping;
    } else {
      console.error("SKIPPED Trying to set empty mapping");
    }
  };
  NativeInterop.prototype.refreshSectionName = function() {
    this.section = this.getSectionName();
  };
  NativeInterop.prototype.getSectionName = function() {
    var sectionName = "default";
    if (cc.sys.isNative) {
      if (sectionName = "default", cc.sys.os === cc.sys.OS_ANDROID) {
        try {
          if (void 0 != jsb) {
            sectionName = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getAppName", "()Ljava/lang/String;");
          }
        } catch (error) {
          console.error("ERROR getting bundle id " + error);
          sectionName = "default";
        }
      } else if (cc.sys.os === cc.sys.OS_IOS) {
        try {
          if (void 0 != jsb) {
            sectionName = jsb.reflection.callStaticMethod("AppController", "getAppName");
          }
        } catch (error) {
          console.error("ERROR getting bundle id " + error);
          sectionName = "default";
        }
      }
    }
    return sectionName;
  };
  NativeInterop._instance = null;
  return NativeInterop;
}();
moduleExports.NativeInterop = NativeInterop;
var MapInt = function() {
  function MapInt() {
    this.map = {};
  }
  MapInt.prototype.getLength = function() {
    return Object.keys(this.map).length;
  };
  MapInt.prototype.set = function(key, value) {
    this.map[key] = value;
  };
  MapInt.prototype.get = function(key) {
    return this.map[key];
  };
  MapInt.prototype.forEach = function(callback) {
    for (var keys = Object.keys(this.map), index = 0; index < keys.length; index++) {
      callback(keys[index], this.map[keys[index]]);
    }
  };
  MapInt.prototype.isContainKey = function(key) {
    return void 0 != this.map[key];
  };
  MapInt.prototype.removeKey = function(key) {
    delete this.map[key];
  };
  MapInt.prototype.clear = function() {
    for (var keys = Object.keys(this.map), index = 0; index < keys.length; index++) {
      this.removeKey(parseInt(keys[index]));
    }
  };
  return MapInt = __decorate([ccclass], MapInt);
}();
moduleExports.MapInt = MapInt;
moduleExports.changeParentNode = function(node, newParent, scale) {
  if (void 0 === scale && (scale = 1), node.parent != newParent) {
    var getWorldAngle = function(fromNode) {
        var currentNode = fromNode,
          totalAngle = currentNode.angle;
        do {
          totalAngle += (currentNode = currentNode.parent).angle;
        } while (null != currentNode.parent);
        return totalAngle %= 360;
      },
      angle = getWorldAngle(node) - getWorldAngle(newParent),
      worldPos = node.convertToWorldSpaceAR(cc.v2(0, 0)),
      localPos = newParent.convertToNodeSpaceAR(worldPos);
    node.parent = newParent;
    node.position = localPos;
    node.angle = angle;
    node.scale = scale;
  }
};
var DEFAULT_FPS = 60;

function isValidJSON(value, requireObject) {
  if (void 0 === requireObject) {
    requireObject = false;
  }
  try {
    return !(requireObject && !isObject(value)) && (JSON.stringify(value), true);
  } catch (error) {
    return false;
  }
}

function mergeObjects(target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      if (isObject(source[key]) && isObject(target[key])) {
        target[key] = mergeObjects(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

function isObject(value) {
  return value && "object" == typeof value && !Array.isArray(value);
}

function runAnimationMoneyWithColom(label, currentValue, targetValue, duration) {
  if (void 0 === duration) {
    duration = .6;
  }
  var speed = (targetValue - currentValue) / duration;
  if (label.unscheduleAllCallbacks(), 0 != speed) {
    var tick = function(deltaTime) {
      currentValue += speed * deltaTime;
      if (Math.abs(currentValue - targetValue) < Math.abs(speed * deltaTime * 2)) {
        currentValue = targetValue;
        label.string = StringUtil.default.formatMoneyNumberWithColom(currentValue);
        label.unschedule(tick);
      } else {
        label.string = StringUtil.default.formatMoneyNumberWithColom(currentValue);
      }
    };
    label.schedule(tick, moneyTickInterval);
  } else {
    label.string = StringUtil.default.formatMoneyNumberWithColom(targetValue);
  }
}
moduleExports.setFpsNormal = function() {};
moduleExports.setFpsLow = function() {};
moduleExports.isFpsLow = function() {
  return DEFAULT_FPS < 59;
};
moduleExports.setFPS = function(fps) {};
moduleExports.setFpsCurrent = function() {};
moduleExports.setFpsKeepUpdate = function() {};
moduleExports.parseBool = function(value) {
  if ("string" == typeof value) {
    if ("true" === (value = value.trim().toLowerCase())) {
      return true;
    }
    if ("false" === value) {
      return false;
    }
    if ("1" === value) {
      return true;
    }
    if ("0" === value) {
      return false;
    }
  }
  return ("number" != typeof value || !isNaN(value)) && Boolean(value);
};
moduleExports.convertUint8ArrayToBinaryString = function(bytes) {
  var index,
    length = bytes.length,
    binaryString = "";
  for (index = 0; index < length; index++) {
    binaryString += String.fromCharCode(bytes[index]);
  }
  return binaryString;
};
moduleExports.getNodeByPath = function(node, path) {
  for (var pathParts = path.split("/"), child = null, index = 0; index < pathParts.length; index++) {
    var childName = pathParts[index];
    if (null === (child = node.getChildByName(childName)) || void 0 === child) {
      return null;
    }
    node = child;
  }
  return child;
};
moduleExports.versionCompareHandle = function(versionA, versionB) {
  for (var partsA = versionA.split("."), partsB = versionB.split("."), index = 0; index < partsA.length; ++index) {
    var numberA = parseInt(partsA[index]),
      numberB = parseInt(partsB[index] || 0);
    if (numberA !== numberB) {
      return numberA - numberB;
    }
  }
  return partsB.length > partsA.length ? -1 : 0;
};
moduleExports.mergeJSON = function(target, source) {
  if (!isValidJSON(target) || !isValidJSON(source)) {
    throw new Error("Invalid JSON input");
  }
  return mergeObjects(target, source);
};
moduleExports.isValidJSON = isValidJSON;
moduleExports.mergeObjects = mergeObjects;
moduleExports.isObject = isObject;
moduleExports.versionCompareHandleNew = function(versionA, versionB) {
  for (var partsA = versionA.split("."), partsB = versionB.split("."), index = 0; index < partsA.length; ++index) {
    if (parseInt(partsA[index]) !== parseInt(partsB[index] || 0)) {
      return -1;
    }
  }
  return partsB.length > partsA.length ? -1 : 0;
};
moduleExports.runAnimationMoneyDotFormat = function(label, currentValue, targetValue, duration) {
  if (void 0 === duration) {
    duration = .6;
  }
  var speed = (targetValue - currentValue) / duration;
  if (0 != speed) {
    label.unscheduleAllCallbacks();
    var tick = function(deltaTime) {
      currentValue += speed * deltaTime;
      if (Math.abs(currentValue - targetValue) < Math.abs(speed * deltaTime * 2)) {
        currentValue = targetValue;
        label.string = StringUtil.default.formatMoneyNumberWithDot(currentValue);
        label.unschedule(tick);
      } else {
        label.string = StringUtil.default.formatMoneyNumberWithDot(currentValue);
      }
    };
    label.schedule(tick, moneyTickInterval);
  } else {
    label.string = StringUtil.default.formatMoneyNumberWithDot(targetValue);
  }
};
moduleExports.runAnimationMoney = function(label, currentValue, targetValue, duration) {
  if (void 0 === duration) {
    duration = .6;
  }
  var speed = (targetValue - currentValue) / duration;
  if (0 != speed) {
    label.unscheduleAllCallbacks();
    var tick = function(deltaTime) {
      currentValue += speed * deltaTime;
      if (Math.abs(currentValue - targetValue) < Math.abs(speed * deltaTime * 2)) {
        currentValue = targetValue;
        label.string = StringUtil.default.formatMoneyNumber(currentValue);
        label.unschedule(tick);
      } else {
        label.string = StringUtil.default.formatMoneyNumber(currentValue);
      }
    };
    label.schedule(tick, moneyTickInterval);
  } else {
    label.string = StringUtil.default.formatMoneyNumber(targetValue);
  }
};
moduleExports.runAnimationMoneyWithColom = runAnimationMoneyWithColom;
moduleExports.runAnimationMoneyWithDot = function(label, currentValue, targetValue, duration) {
  if (void 0 === duration) {
    duration = .6;
  }
  var speed = (targetValue - currentValue) / duration;
  if (label.unscheduleAllCallbacks(), 0 != speed) {
    var tick = function(deltaTime) {
      currentValue += speed * deltaTime;
      if (Math.abs(currentValue - targetValue) < Math.abs(speed * deltaTime * 2)) {
        currentValue = targetValue;
        label.string = StringUtil.default.formatMoneyNumberWithDot(currentValue);
        label.unschedule(tick);
      } else {
        label.string = StringUtil.default.formatMoneyNumberWithDot(currentValue);
      }
    };
    label.schedule(tick, moneyTickInterval);
  } else {
    label.string = StringUtil.default.formatMoneyNumberWithDot(targetValue);
  }
};
var CardData = function() {
  return function(cardId) {
    this.ID = cardId;
    this.Number = getCardNumber(cardId);
    this.Type = getCardType(cardId);
  };
}();

function getCardType(cardId) {
  return cardId % 4 + 1;
}

function getCardNumber(cardId) {
  return Math.floor(cardId / 4) + 1;
}

function getCardData(cardId) {
  return new CardData(cardId);
}

function sortListCards(cardIds) {
  for (var swapPair, indexA = 0; indexA < cardIds.length; indexA++) {
    for (var indexB = indexA + 1; indexB < cardIds.length; indexB++) {
      if (getCardNumber(cardIds[indexA]) > getCardNumber(cardIds[indexB])) {
        swapPair = [cardIds[indexB], cardIds[indexA]];
        cardIds[indexA] = swapPair[0];
        cardIds[indexB] = swapPair[1];
      }
    }
  }
  for (indexA = 0; indexA < cardIds.length; indexA++) {
    getCardNumber(cardIds[indexA]) + " ";
  }
  return cardIds;
}

function getFakeFingerPrint() {
  var fingerPrint = localStorage.getItem("KEY_STORE_FINGER_PRINT");
  if (StringUtil.default.isNullOrEmpty(fingerPrint)) {
    fingerPrint = cc.sys.isNative ? cc.sys.os === cc.sys.OS_ANDROID ? generateFingerPrintAndroid() : cc.sys.os === cc.sys.OS_IOS ? generateFingerPrintIOS() : generateFingerPrintDefault() : generateFingerPrintDefault();
  }
  localStorage.setItem("KEY_STORE_FINGER_PRINT", fingerPrint);
  return fingerPrint;
}

function generateFingerPrintIOS() {
  var hexChars = "0123456789ABCDEF";

  function randomHex(length) {
    for (var result = "", index = 0; index < length; index++) {
      result += hexChars[Math.floor(16 * Math.random())];
    }
    return result;
  }
  for (var nowHex = Date.now().toString(16).toUpperCase(), part1 = nowHex.slice(0, 8), padCount = 8 - part1.length, padIndex = 0; padIndex < padCount; padIndex++) {
    part1 += hexChars[Math.floor(16 * Math.random())];
  }
  var part2 = nowHex.slice(8, 12);
  padCount = 4 - part2.length;
  for (padIndex = 0; padIndex < padCount; padIndex++) {
    part2 += hexChars[Math.floor(16 * Math.random())];
  }
  var part3 = nowHex.slice(12, 16);
  padCount = 4 - part3.length;
  for (padIndex = 0; padIndex < padCount; padIndex++) {
    part3 += hexChars[Math.floor(16 * Math.random())];
  }
  return part1 + "-" + part2 + "-" + part3 + "-" + randomHex(4) + "-" + randomHex(12);
}

function generateFingerPrintDefault() {
  for (var nowHex = Date.now().toString(16), randomPart = "", index = 0; index < 32 - nowHex.length; index++) {
    randomPart += "0123456789abcdef" [Math.floor(16 * Math.random())];
  }
  return nowHex + randomPart;
}

function generateFingerPrintAndroid() {
  for (var nowHex = Date.now().toString(16), randomPart = "", index = 0; index < 16 - nowHex.length; index++) {
    randomPart += "0123456789abcdef" [Math.floor(16 * Math.random())];
  }
  return nowHex + randomPart;
}

function getBundleId() {
  var bundleId = "hit.web";
  if (cc.sys.isNative) {
    if (bundleId = "hit.app", cc.sys.os === cc.sys.OS_ANDROID) {
      var methodName = NativeInterop.Instance.getFunctionName("getBundleid");
      try {
        if (void 0 != jsb) {
          bundleId = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", methodName, "()Ljava/lang/String;");
        }
      } catch (error) {
        console.error("ERROR getting bundle id " + error);
      }
    } else if (cc.sys.os === cc.sys.OS_IOS) {
      try {
        if (void 0 != jsb) {
          methodName = NativeInterop.Instance.getFunctionName("getBundleid");
          bundleId = jsb.reflection.callStaticMethod("AppController", methodName);
        }
      } catch (error) {
        console.error("ERROR getting bundle id " + error);
      }
    }
  }
  if (!(void 0 != bundleId && null != bundleId && "" != bundleId)) {
    bundleId = moduleExports.bundleId_default;
  }
  return bundleId;
}

function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function openUrlWithDom(url) {
  try {
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener";
    anchor.style.position = "fixed";
    anchor.style.top = "-1000px";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } catch (error) {
    cc.sys.openURL(url);
  }
}
moduleExports.CardData = CardData;
moduleExports.getCardType = getCardType;
moduleExports.getCardNumber = getCardNumber;
moduleExports.getCardData = getCardData;
moduleExports.getPhomSanh = function(cardIds, removeFound) {
  if (void 0 === removeFound) {
    removeFound = true;
  }
  var straights = [
    []
  ];
  sortListCards(cardIds);
  for (var currentStraightPairs = [], startIndex = -1, index = 0; index < cardIds.length - 2; index++) {
    if (getCardType(cardIds[index]) != getCardType(cardIds[index + 1]) || getCardNumber(cardIds[index + 1]) - getCardNumber(cardIds[index]) != 1) {
      if (currentStraightPairs.length >= 3) {
        straights.push(currentStraightPairs);
        if (removeFound) {
          cardIds.splice(startIndex, currentStraightPairs.length);
          index = 0;
        }
      }
      startIndex = -1;
      currentStraightPairs = [];
    } else {
      if (-1 == startIndex) {
        startIndex = index;
      }
      currentStraightPairs.push(cardIds[index], cardIds[index + 1]);
    }
  }
  return straights;
};
moduleExports.getSameCard = function(cardIds, removeFound) {
  if (void 0 === removeFound) {
    removeFound = true;
  }
  var sets = [
    []
  ];
  sortListCards(cardIds);
  for (var currentSet = [], index = 0; index < cardIds.length - 3; index++) {
    if (getCardNumber(cardIds[index]) == getCardNumber(cardIds[index + 1]) && getCardNumber(cardIds[index + 1]) == getCardNumber(cardIds[index + 2])) {
      currentSet.push(cardIds[index], cardIds[index + 1], cardIds[index + 2]);
      if (index + 4 < cardIds.length && getCardNumber(index) == getCardNumber(index + 4)) {
        currentSet.push(cardIds[index + 4]);
      }
      if (removeFound) {
        cardIds.splice(index, currentSet.length);
        index = 0;
      }
      sets.push(currentSet);
      currentSet = [];
    }
  }
  return sets;
};
moduleExports.getPairSorted = function(cardIds, removeFound) {
  if (void 0 === removeFound) {
    removeFound = true;
  }
  var pairedCards = [];
  sortListCards(cardIds);
  for (var index = 0; index < cardIds.length - 1; index++) {
    if (getCardNumber(cardIds[index]) == getCardNumber(cardIds[index + 1])) {
      pairedCards.push(cardIds[index], cardIds[index + 1]);
      if (removeFound) {
        cardIds.splice(index, 2);
        index = 0;
      }
    }
  }
  return pairedCards;
};
moduleExports.sortListCards = sortListCards;
moduleExports.getListCardData = function(cardIds) {
  for (var cardDataList = [], index = 0; index < cardIds.length; index++) {
    cardDataList.push(getCardData(cardIds[index]));
  }
  return cardDataList;
};
moduleExports.isRunningStandalone = function() {
  return navigator.standalone || window.matchMedia("(display-mode: standalone)").matches;
};
moduleExports.isActivePublicLobby = function() {
  if (cc.sys.isNative) {
    var publicLobbyConfig = GameConfigManager.default.getInstance().publicLobbyConfig;
    if (publicLobbyConfig) {
      var bundleId;
      if (void 0 != publicLobbyConfig.activeAndroid && 0 == publicLobbyConfig.activeAndroid && cc.sys.os == cc.sys.OS_ANDROID && (bundleId = getBundleId()) && GameConfigManager.default.getInstance()
        .isDisablePublicLobby(bundleId)) {
        return false;
      }
      if (void 0 != publicLobbyConfig.activeiOS && 0 == publicLobbyConfig.activeiOS && cc.sys.os == cc.sys.OS_IOS && (bundleId = getBundleId()) && GameConfigManager.default.getInstance()
        .isDisablePublicLobby(bundleId)) {
        return false;
      }
    }
  }
  return 1 == cc.sys.isNative && "true" == GameConfigManager.default.getInstance().isActivePublicLobbyApp || 0 == cc.sys.isNative && "true" == GameConfigManager.default
    .getInstance().isActivePublicLobbyWeb;
};
moduleExports.getBrand = function() {
  var brandName = GameConfigManager.default.getInstance().enviromentName;
  return (brandName = (brandName = (brandName = brandName.replace("test", "")).replace("pre", "")).replace("prepro", "")).toUpperCase();
};
moduleExports.isTablet = function() {
  if (cc.sys.platform === cc.sys.IPAD) {
    return true;
  }
  if (cc.sys.isNative) {
    var dpi = jsb.device.getDPI(),
      frameSize = cc.view.getFrameSize(),
      widthInch = frameSize.width / dpi,
      heightInch = frameSize.height / dpi,
      diagonalInch = Math.sqrt(Math.pow(widthInch, 2) + Math.pow(heightInch, 2));
    return (diagonalInch = Math.round(100 * diagonalInch) / 100) >= 7;
  }
  if (cc.sys.platform === cc.sys.MOBILE_BROWSER) {
    var userAgent = navigator.userAgent.toLowerCase();
    return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
  }
  return false;
};
moduleExports.convertToHMS = function(totalSeconds) {
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor(totalSeconds % 3600 / 60),
    seconds: totalSeconds % 60
  };
};
moduleExports.setOrientation = function(orientation) {
  if (void 0 === orientation && (orientation = 0), cc.sys.isNative) {
    if (cc.sys.os === cc.sys.OS_IOS) {
      if (jsb) {
        try {
          var methodName = NativeInterop.Instance.getFunctionName("rotateScreen");
          jsb.reflection.callStaticMethod("AppController", methodName + ":", orientation);
        } catch (error) {}
      }
    } else if (cc.sys.os === cc.sys.OS_ANDROID && jsb) {
      try {
        methodName = NativeInterop.Instance.getFunctionName("setOrientation");
        if (jsb) {
          jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", methodName, "(I)V");
        }
      } catch (error) {}
    }
  }
};
moduleExports.changeOrientation = function(orientation) {
  var calledNative = false;
  if (cc.sys.isNative) {
    if (cc.sys.os === cc.sys.OS_IOS) {
      if (jsb) {
        try {
          calledNative = true;
          var methodName = NativeInterop.Instance.getFunctionName("rotateScreen");
          jsb.reflection.callStaticMethod("AppController", methodName + ":", orientation);
        } catch (error) {}
      }
    } else if (cc.sys.os === cc.sys.OS_ANDROID && jsb) {
      try {
        methodName = NativeInterop.Instance.getFunctionName("setOrientation");
        if (jsb) {
          calledNative = true;
          jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", methodName, "(I)V", orientation);
        }
      } catch (error) {}
    }
  }
  if (calledNative) {
    if (0 == orientation || 2 == orientation) {
      cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
    } else {
      if (1 == orientation || 3 == orientation) {
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
      } else {
        cc.view.setOrientation(cc.macro.ORIENTATION_AUTO);
      }
    }
  }
};
moduleExports.getFakeFingerPrint = getFakeFingerPrint;
moduleExports.bundleId_default = "hit.comp.app";
moduleExports.getBundleId = getBundleId;
moduleExports.setKeepScreenOn = function(keepOn) {
  try {
    if (cc.sys.isNative) {
      if (cc.sys.os === cc.sys.OS_ANDROID) {
        var methodName = NativeInterop.Instance.getFunctionName("setKeepScreenOn");
        if (jsb) {
          jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", methodName, "(Z)V", keepOn);
        }
      } else {
        if (cc.sys.os === cc.sys.OS_IOS && jsb) {
          methodName = NativeInterop.Instance.getFunctionName("setKeepScreenOn");
          jsb.reflection.callStaticMethod("AppController", methodName + ":", keepOn);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
moduleExports.saveBase64Image = function(base64Image) {
  try {
    if (cc.sys.isNative) {
      if (cc.sys.os === cc.sys.OS_ANDROID) {
        var methodName = NativeInterop.Instance.getFunctionName("saveImageToPhotoLibrary");
        if (jsb) {
          jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", methodName, "(Ljava/lang/String;)V", base64Image);
        }
      } else {
        if (cc.sys.os === cc.sys.OS_IOS && jsb) {
          methodName = NativeInterop.Instance.getFunctionName("saveImageToPhotoLibrary");
          jsb.reflection.callStaticMethod("AppController", methodName + ":", base64Image);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
moduleExports.isSupportSendSMS = function() {
  try {
    if (cc.sys.isNative) {
      if (cc.sys.os === cc.sys.OS_ANDROID) {
        var methodName = NativeInterop.Instance.getFunctionName("isSupportSendSMS");
        if (jsb) {
          return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", methodName, "()Z");
        }
      } else if (cc.sys.os === cc.sys.OS_IOS && jsb) {
        methodName = NativeInterop.Instance.getFunctionName("isSupportSendSMS");
        return jsb.reflection.callStaticMethod("AppController", methodName);
      }
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};
moduleExports.sendSMS = function(phoneNumber, content) {
  try {
    if (cc.sys.isNative) {
      if (cc.sys.os === cc.sys.OS_ANDROID) {
        var methodName = NativeInterop.Instance.getFunctionName("sendSMS");
        if (jsb) {
          jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", methodName, "(Ljava/lang/String;Ljava/lang/String;)V", phoneNumber, content);
        }
      } else {
        if (cc.sys.os === cc.sys.OS_IOS && jsb) {
          methodName = NativeInterop.Instance.getFunctionName("sendSMS");
          jsb.reflection.callStaticMethod("AppController", methodName + ":withContent:", phoneNumber, content);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
moduleExports.getIdentifier = function() {
  var identifier = "none";
  if (cc.sys.isNative) {
    if (cc.sys.os === cc.sys.OS_ANDROID) {
      var methodName = NativeInterop.Instance.getFunctionName("getIdentifier");
      try {
        if (void 0 != jsb) {
          identifier = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", methodName, "()Ljava/lang/String;");
        }
      } catch (error) {
        console.error("ERROR getting bundle id " + error);
      }
    } else if (cc.sys.os === cc.sys.OS_IOS) {
      try {
        if (void 0 != jsb) {
          methodName = NativeInterop.Instance.getFunctionName("getIdentifier");
          identifier = jsb.reflection.callStaticMethod("AppController", methodName);
        }
      } catch (error) {
        console.error("ERROR getting bundle id " + error);
      }
    }
  }
  if (!(void 0 != identifier && null != identifier && "" != identifier)) {
    identifier = getFakeFingerPrint();
  }
  return identifier;
};
moduleExports.getDeviceName = function() {
  var deviceName = "none";
  if (cc.sys.isNative) {
    if (cc.sys.os === cc.sys.OS_ANDROID) {
      var methodName = NativeInterop.Instance.getFunctionName("getDeviceName");
      try {
        if (void 0 != jsb) {
          deviceName = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", methodName, "()Ljava/lang/String;");
        }
      } catch (error) {
        console.log("ERROR getting bundle id " + error);
      }
    } else if (cc.sys.os === cc.sys.OS_IOS) {
      try {
        if (void 0 != jsb) {
          methodName = NativeInterop.Instance.getFunctionName("getDeviceName");
          deviceName = jsb.reflection.callStaticMethod("AppController", methodName);
        }
      } catch (error) {
        console.log("ERROR getting bundle id " + error);
      }
    }
  } else {
    try {
      deviceName = window.navigator.userAgent;
    } catch (error) {
      console.log("ERROR getting bundle id " + error);
    }
  }
  return deviceName;
};
moduleExports.writeTextToClipboard = function(text) {
  try {
    if (cc.sys.platform === cc.sys.MOBILE_BROWSER || cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
      try {
        window.navigator.clipboard.writeText(text).then(function() {}, function(error) {});
      } catch (error) {}
    } else if (cc.sys.isNative && void 0 != jsb) {
      if (cc.sys.os === cc.sys.OS_ANDROID) {
        var methodName = NativeInterop.Instance.getFunctionName("setClipboardContent");
        if (jsb) {
          jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", methodName, "(Ljava/lang/String;)V", text);
        }
      } else {
        if (cc.sys.os === cc.sys.OS_IOS) {
          methodName = NativeInterop.Instance.getFunctionName("setClipboardContent");
          jsb.reflection.callStaticMethod("AppController", methodName + ":", text);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
moduleExports.readTextFromClipboard = function() {
  try {
    if (cc.sys.isNative && void 0 != jsb) {
      if (cc.sys.os === cc.sys.OS_ANDROID) {
        var methodName = NativeInterop.Instance.getFunctionName("getClipboardContent");
        if (jsb) {
          return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", methodName, "()Ljava/lang/String;");
        }
      } else if (cc.sys.os === cc.sys.OS_IOS && jsb) {
        methodName = NativeInterop.Instance.getFunctionName("getClipboardContent");
        return jsb.reflection.callStaticMethod("AppController", methodName);
      }
    }
  } catch (error) {
    console.log(error);
  }
  return "";
};
moduleExports.isOldAppIOS = function() {
  return false;
};
moduleExports.downloadBinary = function(url, onDone) {
  var xhr = cc.loader.getXMLHttpRequest(),
    errorPrefix = "Load binary data failed: " + url;
  xhr.open("GET", url, true);
  xhr.responseType = "arraybuffer";
  xhr.onload = function() {
    var buffer = xhr.response;
    if (buffer) {
      var bytes = new Uint8Array(buffer);
      onDone(null, bytes);
    } else {
      onDone({
        status: xhr.status,
        errorMessage: errorPrefix + "(no response)"
      });
    }
  };
  xhr.onerror = function() {
    onDone({
      status: xhr.status,
      errorMessage: errorPrefix + "(error)"
    });
  };
  xhr.ontimeout = function() {
    onDone({
      status: xhr.status,
      errorMessage: errorPrefix + "(time out)"
    });
  };
  xhr.send(null);
};
moduleExports.capitalizeFirstLetter = capitalizeFirstLetter;
moduleExports.formatUrl = function(url) {
  return url = (url = (url = (url = (url = (url = url.replace(/https:/g, "https_")).replace(/{/g, "%7B")).replace(/}/g, "%7D")).replace(/"/g, "%22"))
    .replace(/:/g, "%3A")).replace(/https_/g, "https:");
};
moduleExports.showPopupNewBrandInfo = function() {
  if (0 == GameConfigManager.default.getInstance().isforcebrand) {
    return false;
  }
  var newHomeUrl = GameConfigManager.default.getInstance().newHomeUrl;
  if (newHomeUrl.includes("play")) {
    newHomeUrl = newHomeUrl.split("play.")[1];
  }
  var popup = CommonPrefabsManager.default.getInstance().showPopup1Button();
  popup.btnBackground.interactable = false;
  popup.nodeButton.width = 250;
  popup.nodeButton.height = 75;
  popup.lbOk.string = "T\u1ea3i " + GameConfigManager.default.getInstance().newBrandName;
  popup.lbContent.string = "T\u1eeb ng\xe0y " + GameConfigManager.default.getInstance().newBrandTime + ", " + GameConfigManager.default.getInstance().homeUrl.split("play.")[
      1] + " chuy\u1ec3n sang c\u1ed5ng game " + GameConfigManager.default.getInstance().newBrandName +
    ", m\u1eddi b\u1ea1n \u0111\u0103ng k\xfd t\u1ea1i " + newHomeUrl;
  popup.onOKCallback = function() {
    cc.sys.openURL("https://" + GameConfigManager.default.getInstance().newHomeUrl);
  }.bind(this);
  return true;
};
moduleExports.delay = function(delayMs) {
  return new Promise(function(resolve) {
    return setTimeout(resolve, delayMs);
  });
};
moduleExports.transformAvatarString = function(avatarString) {
  return avatarString.split("-").map(function(part, index) {
    return 0 === index ? capitalizeFirstLetter(part) : part.replace(/^0+/, "");
  }).join("");
};
moduleExports.updateLiveChatInhouseUrl = function() {
  if (GameConfigManager.default.getInstance().isUseLiveChatInhouse) {
    var liveChatUrl = GameConfigManager.default.getInstance().liveChatOriginalUrl;
    liveChatUrl = "" != GamePlayManager.default.getInstance().session_id ? liveChatUrl.replace("{xtoken}", GamePlayManager.default.getInstance().session_id) : liveChatUrl.replace(
      "?xtoken={xtoken}", "");
    GameConfigManager.default.getInstance().liveChatUrl = liveChatUrl;
    cc.sys.localStorage.setItem("KEY_URL_SUPPORT_LIVE_CHAT", liveChatUrl);
  }
};
moduleExports.convertTimeToString = function(timestamp, separator) {
  if (void 0 === separator) {
    separator = "\n";
  }
  var date = new Date(timestamp),
    year = date.getFullYear(),
    month = ("0" + (date.getMonth() + 1)).slice(-2);
  return ("0" + date.getDate()).slice(-2) + "-" + month + "-" + year + separator + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) +
    ":" + ("0" + date.getSeconds()).slice(-2);
};
moduleExports.convertDateFormat = function(dateTime) {
  var parts = dateTime.split(" "),
    datePart = parts[0],
    timePart = parts[1],
    dateFields = datePart.split("-"),
    year = dateFields[0],
    month = dateFields[1];
  return dateFields[2] + "-" + month + "-" + year + " " + timePart;
};
moduleExports.convertToStringGameID = function(gameType) {
  var gameId = "";
  switch (gameType) {
    case MessageCardGameHandler.GAME.XITO:
      gameId = MessageCardGameHandler.GAMEID.XITO;
      break;
    case MessageCardGameHandler.GAME.BINH:
      gameId = MessageCardGameHandler.GAMEID.BINH;
      break;
    case MessageCardGameHandler.GAME.TIENLEN:
      gameId = MessageCardGameHandler.GAMEID.TIENLEN;
      break;
    case MessageCardGameHandler.GAME.POKER:
      gameId = MessageCardGameHandler.GAMEID.POKER;
      break;
    case MessageCardGameHandler.GAME.BACAY:
      gameId = MessageCardGameHandler.GAMEID.BACAY;
      break;
    case MessageCardGameHandler.GAME.LIENG:
      gameId = MessageCardGameHandler.GAMEID.LIENG;
      break;
    case MessageCardGameHandler.GAME.SAM:
      gameId = MessageCardGameHandler.GAMEID.SAM;
      break;
    case MessageCardGameHandler.GAME.PHOM:
      gameId = MessageCardGameHandler.GAMEID.PHOM;
      break;
    case MessageCardGameHandler.GAME.TLMN:
      gameId = MessageCardGameHandler.GAMEID.TLMN;
      break;
    case MessageCardGameHandler.GAME.CATTE:
      gameId = MessageCardGameHandler.GAMEID.CATTE;
      break;
    case MessageCardGameHandler.GAME.XOCDIA:
      gameId = MessageCardGameHandler.GAMEID.XOCDIA;
      break;
    case MessageCardGameHandler.GAME.BAU_CUA:
      gameId = MessageCardGameHandler.GAMEID.BAU_CUA;
      break;
    case MessageCardGameHandler.GAME.XIDACH:
      gameId = MessageCardGameHandler.GAMEID.XIDACH;
  }
  return gameId;
};
moduleExports.runAnimationMoneyDecimal = function(label, currentValue, targetValue, duration) {
  if (void 0 === duration && (duration = .6), Number.isInteger(currentValue) && Number.isInteger(targetValue)) {
    runAnimationMoneyWithColom(label, currentValue, targetValue, duration);
  } else {
    var speed = (targetValue - currentValue) / duration;
    if (label.unscheduleAllCallbacks(), 0 != speed) {
      var tick = function(deltaTime) {
        currentValue += speed * deltaTime;
        if (Math.abs(currentValue - targetValue) < Math.abs(speed * deltaTime * 2)) {
          currentValue = targetValue;
          label.string = StringUtil.default.formatMoneyNumberDecimal(currentValue);
          label.unschedule(tick);
        } else {
          label.string = StringUtil.default.formatMoneyNumberDecimal(currentValue);
        }
      };
      label.schedule(tick, moneyTickInterval);
    } else {
      label.string = StringUtil.default.formatMoneyNumberDecimal(targetValue);
    }
  }
};
moduleExports.countUppercase = function(text) {
  for (var count = 0, index = 0, chars = text; index < chars.length; index++) {
    var character = chars[index];
    if (character >= "A" && character <= "Z") {
      count++;
    }
  }
  return count;
};
moduleExports.getPopupPositionCenter = function() {
  var brandCode = RMCAppInfoConfig.getBrandCodeConfig(),
    brandChecker = new GbBrandChecker.BrandChecker(brandCode);
  return brandChecker.isG0() ? cc.Vec2.ZERO : (brandChecker.isGTh, new cc.Vec2(cc.winSize.width / 2, cc.winSize.height / 2));
};
moduleExports.setPopupPosition = function(node) {
  var brandCode = RMCAppInfoConfig.getBrandCodeConfig(),
    brandChecker = new GbBrandChecker.BrandChecker(brandCode);
  if (brandChecker.isG0()) {
    node.x = 0;
    node.y = 0;
  } else {
    brandChecker.isGTh();
    node.x = cc.winSize.width / 2;
    node.y = cc.winSize.height / 2;
  }
};
moduleExports.callOpenUrl = function(url, useDelay) {
  if (void 0 === useDelay) {
    useDelay = false;
  }
  var openUrl = function() {
    if (cc.sys.isBrowser) {
      openUrlWithDom(url);
    } else {
      cc.sys.openURL(url);
    }
  };
  if (useDelay) {
    setTimeout(function() {
      openUrl();
    }, 100);
  } else {
    openUrl();
  }
};
moduleExports.openUrlWithDom = openUrlWithDom;
void 0;
