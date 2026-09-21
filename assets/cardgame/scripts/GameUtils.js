var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
var n = this && this.__decorate || function(t, e, i, n) {
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
Object.defineProperty(i, "__esModule", {
  value: true
});
var StringUtil = require("./StringUtil"),
  GameConfigManager = require("./GameConfigManager"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  GamePlayManager = require("./GamePlayManager"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  GbBrandChecker = require("./GbBrandChecker"),
  RMCAppInfoConfig = require("./RMCAppInfoConfig"),
  u = cc._decorator,
  d = u.ccclass,
  p = (u.property, .07),
  f = ["game-icon.png", "header.png", "logo.png", "image.png", "icon-mini.png"];
(function(t) {
  t[t.Logo512 = 0] = "Logo512";
  t[t.Header280 = 1] = "Header280";
  t[t.Header724 = 2] = "Header724";
  t[t.Splash1700 = 3] = "Splash1700";
  t[t.Logo144 = 4] = "Logo144";
})(i.WccBrandImageType || (i.WccBrandImageType = {}));
i.getWccBrandUrl = function(t, e) {
  try {
    var i = window.location.origin + "/splash/brands/" + t + "/" + f[e] + "?kt=" + Date.now();
    console.warn("getWccBrandUrl", i);
    return i;
  } catch (t) {
    return "";
  }
};
i.downloadAndShowImage = function(t, e, i) {
  if (null != t && t.isValid && null != e && e.length > 0) {
    if (e.indexOf("http") >= 0) {
      cc.loader.load(e, function(n, o) {
        if (null === n || void 0 === n) {
          try {
            if (null != t && t.isValid && null != o) {
              var a = new cc.SpriteFrame(o);
              t.spriteFrame = a;
              if (i) {
                i(a);
              }
            }
          } catch (t) {
            cc.warn("Can't load image from URL " + e, t);
            if (i) {
              i();
            }
          }
        } else {
          cc.warn("Can't download from " + e);
        }
      });
    } else {
      cc.loader.loadRes(e, function(n, o) {
        if (null === n || void 0 === n) {
          try {
            if (null != t && t.isValid && null != o) {
              var a = new cc.SpriteFrame(o);
              t.spriteFrame = a;
              if (i) {
                i(a);
              }
            }
          } catch (t) {
            cc.warn("Can't load image from URL " + e, t);
            if (i) {
              i();
            }
          }
        }
      });
    }
  }
};
var g = function() {
  function t() {
    this.map = {};
  }
  t.prototype.getLength = function() {
    return Object.keys(this.map).length;
  };
  t.prototype.set = function(t, e) {
    this.map[t] = e;
  };
  t.prototype.get = function(t) {
    return this.map[t];
  };
  t.prototype.forEach = function(t) {
    var e = Object.keys(this.map);
    if (null != e && void 0 != e) {
      for (var i = 0; i < e.length; i++) {
        if (!(null == e[i] && void 0 == e[i])) {
          t(e[i], this.map[e[i]]);
        }
      }
    }
  };
  t.prototype.getListKeys = function() {
    return Object.keys(this.map);
  };
  t.prototype.isContainKey = function(t) {
    return void 0 != this.map[t];
  };
  t.prototype.removeKey = function(t) {
    delete this.map[t];
  };
  t.prototype.clear = function() {
    for (var t = Object.keys(this.map), e = 0; e < t.length; e++) {
      this.removeKey(t[e]);
    }
  };
  return t = n([d], t);
}();
i.MapString = g;
var m = function() {
  function t() {
    this.section = "default";
    this.mapping = {};
    this.refreshSectionName();
  }
  Object.defineProperty(t, "Instance", {
    get: function() {
      if (!t._instance) {
        t._instance = new t();
      }
      return t._instance;
    },
    enumerable: true,
    configurable: true
  });
  t.prototype.getFunctionName = function(t) {
    return this.mapping && t && this.mapping[this.section] && this.mapping[this.section][t] || t;
  };
  t.prototype.init = function() {};
  t.prototype.setMapping = function(t) {
    if (t) {
      this.mapping = t;
    } else {
      console.error("SKIPPED Trying to set empty mapping");
    }
  };
  t.prototype.refreshSectionName = function() {
    this.section = this.getSectionName();
  };
  t.prototype.getSectionName = function() {
    var t = "default";
    if (cc.sys.isNative) {
      if (t = "default", cc.sys.os === cc.sys.OS_ANDROID) {
        try {
          if (void 0 != jsb) {
            t = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getAppName", "()Ljava/lang/String;");
          }
        } catch (e) {
          console.error("ERROR getting bundle id " + e);
          t = "default";
        }
      } else if (cc.sys.os === cc.sys.OS_IOS) {
        try {
          if (void 0 != jsb) {
            t = jsb.reflection.callStaticMethod("AppController", "getAppName");
          }
        } catch (e) {
          console.error("ERROR getting bundle id " + e);
          t = "default";
        }
      }
    }
    return t;
  };
  t._instance = null;
  return t;
}();
i.NativeInterop = m;
var y = function() {
  function t() {
    this.map = {};
  }
  t.prototype.getLength = function() {
    return Object.keys(this.map).length;
  };
  t.prototype.set = function(t, e) {
    this.map[t] = e;
  };
  t.prototype.get = function(t) {
    return this.map[t];
  };
  t.prototype.forEach = function(t) {
    for (var e = Object.keys(this.map), i = 0; i < e.length; i++) {
      t(e[i], this.map[e[i]]);
    }
  };
  t.prototype.isContainKey = function(t) {
    return void 0 != this.map[t];
  };
  t.prototype.removeKey = function(t) {
    delete this.map[t];
  };
  t.prototype.clear = function() {
    for (var t = Object.keys(this.map), e = 0; e < t.length; e++) {
      this.removeKey(parseInt(t[e]));
    }
  };
  return t = n([d], t);
}();
i.MapInt = y;
i.changeParentNode = function(t, e, i) {
  if (void 0 === i && (i = 1), t.parent != e) {
    var n = function(t) {
        var e = t,
          i = e.angle;
        do {
          i += (e = e.parent).angle;
        } while (null != e.parent);
        return i %= 360;
      },
      o = n(t) - n(e),
      a = t.convertToWorldSpaceAR(cc.v2(0, 0)),
      s = e.convertToNodeSpaceAR(a);
    t.parent = e;
    t.position = s;
    t.angle = o;
    t.scale = i;
  }
};
var S = 60;

function _(t, e) {
  if (void 0 === e) {
    e = false;
  }
  try {
    return !(e && !b(t)) && (JSON.stringify(t), true);
  } catch (t) {
    return false;
  }
}

function v(t, e) {
  for (var i in e) {
    if (e.hasOwnProperty(i)) {
      if (b(e[i]) && b(t[i])) {
        t[i] = v(t[i], e[i]);
      } else {
        t[i] = e[i];
      }
    }
  }
  return t;
}

function b(t) {
  return t && "object" == typeof t && !Array.isArray(t);
}

function C(t, e, i, n) {
  if (void 0 === n) {
    n = .6;
  }
  var a = (i - e) / n;
  if (t.unscheduleAllCallbacks(), 0 != a) {
    var s = function(n) {
      e += a * n;
      if (Math.abs(e - i) < Math.abs(a * n * 2)) {
        e = i;
        t.string = StringUtil.default.formatMoneyNumberWithColom(e);
        t.unschedule(s);
      } else {
        t.string = StringUtil.default.formatMoneyNumberWithColom(e);
      }
    };
    t.schedule(s, p);
  } else {
    t.string = StringUtil.default.formatMoneyNumberWithColom(i);
  }
}
i.setFpsNormal = function() {};
i.setFpsLow = function() {};
i.isFpsLow = function() {
  return S < 59;
};
i.setFPS = function(t) {};
i.setFpsCurrent = function() {};
i.setFpsKeepUpdate = function() {};
i.parseBool = function(t) {
  if ("string" == typeof t) {
    if ("true" === (t = t.trim().toLowerCase())) {
      return true;
    }
    if ("false" === t) {
      return false;
    }
    if ("1" === t) {
      return true;
    }
    if ("0" === t) {
      return false;
    }
  }
  return ("number" != typeof t || !isNaN(t)) && Boolean(t);
};
i.convertUint8ArrayToBinaryString = function(t) {
  var e,
    i = t.length,
    n = "";
  for (e = 0; e < i; e++) {
    n += String.fromCharCode(t[e]);
  }
  return n;
};
i.getNodeByPath = function(t, e) {
  for (var i = e.split("/"), n = null, o = 0; o < i.length; o++) {
    var a = i[o];
    if (null === (n = t.getChildByName(a)) || void 0 === n) {
      return null;
    }
    t = n;
  }
  return n;
};
i.versionCompareHandle = function(t, e) {
  for (var i = t.split("."), n = e.split("."), o = 0; o < i.length; ++o) {
    var a = parseInt(i[o]),
      s = parseInt(n[o] || 0);
    if (a !== s) {
      return a - s;
    }
  }
  return n.length > i.length ? -1 : 0;
};
i.mergeJSON = function(t, e) {
  if (!_(t) || !_(e)) {
    throw new Error("Invalid JSON input");
  }
  return v(t, e);
};
i.isValidJSON = _;
i.mergeObjects = v;
i.isObject = b;
i.versionCompareHandleNew = function(t, e) {
  for (var i = t.split("."), n = e.split("."), o = 0; o < i.length; ++o) {
    if (parseInt(i[o]) !== parseInt(n[o] || 0)) {
      return -1;
    }
  }
  return n.length > i.length ? -1 : 0;
};
i.runAnimationMoneyDotFormat = function(t, e, i, n) {
  if (void 0 === n) {
    n = .6;
  }
  var a = (i - e) / n;
  if (0 != a) {
    t.unscheduleAllCallbacks();
    var s = function(n) {
      e += a * n;
      if (Math.abs(e - i) < Math.abs(a * n * 2)) {
        e = i;
        t.string = StringUtil.default.formatMoneyNumberWithDot(e);
        t.unschedule(s);
      } else {
        t.string = StringUtil.default.formatMoneyNumberWithDot(e);
      }
    };
    t.schedule(s, p);
  } else {
    t.string = StringUtil.default.formatMoneyNumberWithDot(i);
  }
};
i.runAnimationMoney = function(t, e, i, n) {
  if (void 0 === n) {
    n = .6;
  }
  var a = (i - e) / n;
  if (0 != a) {
    t.unscheduleAllCallbacks();
    var s = function(n) {
      e += a * n;
      if (Math.abs(e - i) < Math.abs(a * n * 2)) {
        e = i;
        t.string = StringUtil.default.formatMoneyNumber(e);
        t.unschedule(s);
      } else {
        t.string = StringUtil.default.formatMoneyNumber(e);
      }
    };
    t.schedule(s, p);
  } else {
    t.string = StringUtil.default.formatMoneyNumber(i);
  }
};
i.runAnimationMoneyWithColom = C;
i.runAnimationMoneyWithDot = function(t, e, i, n) {
  if (void 0 === n) {
    n = .6;
  }
  var a = (i - e) / n;
  if (t.unscheduleAllCallbacks(), 0 != a) {
    var s = function(n) {
      e += a * n;
      if (Math.abs(e - i) < Math.abs(a * n * 2)) {
        e = i;
        t.string = StringUtil.default.formatMoneyNumberWithDot(e);
        t.unschedule(s);
      } else {
        t.string = StringUtil.default.formatMoneyNumberWithDot(e);
      }
    };
    t.schedule(s, p);
  } else {
    t.string = StringUtil.default.formatMoneyNumberWithDot(i);
  }
};
var T = function() {
  return function(t) {
    this.ID = t;
    this.Number = I(t);
    this.Type = E(t);
  };
}();

function E(t) {
  return t % 4 + 1;
}

function I(t) {
  return Math.floor(t / 4) + 1;
}

function A(t) {
  return new T(t);
}

function P(t) {
  for (var e, i = 0; i < t.length; i++) {
    for (var n = i + 1; n < t.length; n++) {
      if (I(t[i]) > I(t[n])) {
        e = [t[n], t[i]];
        t[i] = e[0];
        t[n] = e[1];
      }
    }
  }
  for (i = 0; i < t.length; i++) {
    I(t[i]) + " ";
  }
  return t;
}

function M() {
  var t = localStorage.getItem("KEY_STORE_FINGER_PRINT");
  if (StringUtil.default.isNullOrEmpty(t)) {
    t = cc.sys.isNative ? cc.sys.os === cc.sys.OS_ANDROID ? B() : cc.sys.os === cc.sys.OS_IOS ? O() : N() : N();
  }
  localStorage.setItem("KEY_STORE_FINGER_PRINT", t);
  return t;
}

function O() {
  var t = "0123456789ABCDEF";

  function e(e) {
    for (var i = "", n = 0; n < e; n++) {
      i += t[Math.floor(16 * Math.random())];
    }
    return i;
  }
  for (var i = Date.now().toString(16).toUpperCase(), n = i.slice(0, 8), o = 8 - n.length, a = 0; a < o; a++) {
    n += t[Math.floor(16 * Math.random())];
  }
  var s = i.slice(8, 12);
  o = 4 - s.length;
  for (a = 0; a < o; a++) {
    s += t[Math.floor(16 * Math.random())];
  }
  var r = i.slice(12, 16);
  o = 4 - r.length;
  for (a = 0; a < o; a++) {
    r += t[Math.floor(16 * Math.random())];
  }
  return n + "-" + s + "-" + r + "-" + e(4) + "-" + e(12);
}

function N() {
  for (var t = Date.now().toString(16), e = "", i = 0; i < 32 - t.length; i++) {
    e += "0123456789abcdef" [Math.floor(16 * Math.random())];
  }
  return t + e;
}

function B() {
  for (var t = Date.now().toString(16), e = "", i = 0; i < 16 - t.length; i++) {
    e += "0123456789abcdef" [Math.floor(16 * Math.random())];
  }
  return t + e;
}

function D() {
  var t = "hit.web";
  if (cc.sys.isNative) {
    if (t = "hit.app", cc.sys.os === cc.sys.OS_ANDROID) {
      var e = m.Instance.getFunctionName("getBundleid");
      try {
        if (void 0 != jsb) {
          t = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", e, "()Ljava/lang/String;");
        }
      } catch (t) {
        console.error("ERROR getting bundle id " + t);
      }
    } else if (cc.sys.os === cc.sys.OS_IOS) {
      try {
        if (void 0 != jsb) {
          e = m.Instance.getFunctionName("getBundleid");
          t = jsb.reflection.callStaticMethod("AppController", e);
        }
      } catch (t) {
        console.error("ERROR getting bundle id " + t);
      }
    }
  }
  if (!(void 0 != t && null != t && "" != t)) {
    t = i.bundleId_default;
  }
  return t;
}

function R(t) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function L(t) {
  try {
    var e = document.createElement("a");
    e.href = t;
    e.target = "_blank";
    e.rel = "noopener";
    e.style.position = "fixed";
    e.style.top = "-1000px";
    document.body.appendChild(e);
    e.click();
    document.body.removeChild(e);
  } catch (e) {
    cc.sys.openURL(t);
  }
}
i.CardData = T;
i.getCardType = E;
i.getCardNumber = I;
i.getCardData = A;
i.getPhomSanh = function(t, e) {
  if (void 0 === e) {
    e = true;
  }
  var i = [
    []
  ];
  P(t);
  for (var n = [], o = -1, a = 0; a < t.length - 2; a++) {
    if (E(t[a]) != E(t[a + 1]) || I(t[a + 1]) - I(t[a]) != 1) {
      if (n.length >= 3) {
        i.push(n);
        if (e) {
          t.splice(o, n.length);
          a = 0;
        }
      }
      o = -1;
      n = [];
    } else {
      if (-1 == o) {
        o = a;
      }
      n.push(t[a], t[a + 1]);
    }
  }
  return i;
};
i.getSameCard = function(t, e) {
  if (void 0 === e) {
    e = true;
  }
  var i = [
    []
  ];
  P(t);
  for (var n = [], o = 0; o < t.length - 3; o++) {
    if (I(t[o]) == I(t[o + 1]) && I(t[o + 1]) == I(t[o + 2])) {
      n.push(t[o], t[o + 1], t[o + 2]);
      if (o + 4 < t.length && I(o) == I(o + 4)) {
        n.push(t[o + 4]);
      }
      if (e) {
        t.splice(o, n.length);
        o = 0;
      }
      i.push(n);
      n = [];
    }
  }
  return i;
};
i.getPairSorted = function(t, e) {
  if (void 0 === e) {
    e = true;
  }
  var i = [];
  P(t);
  for (var n = 0; n < t.length - 1; n++) {
    if (I(t[n]) == I(t[n + 1])) {
      i.push(t[n], t[n + 1]);
      if (e) {
        t.splice(n, 2);
        n = 0;
      }
    }
  }
  return i;
};
i.sortListCards = P;
i.getListCardData = function(t) {
  for (var e = [], i = 0; i < t.length; i++) {
    e.push(A(t[i]));
  }
  return e;
};
i.isRunningStandalone = function() {
  return navigator.standalone || window.matchMedia("(display-mode: standalone)").matches;
};
i.isActivePublicLobby = function() {
  if (cc.sys.isNative) {
    var t = GameConfigManager.default.getInstance().publicLobbyConfig;
    if (t) {
      var e;
      if (void 0 != t.activeAndroid && 0 == t.activeAndroid && cc.sys.os == cc.sys.OS_ANDROID && (e = D()) && GameConfigManager.default.getInstance()
        .isDisablePublicLobby(e)) {
        return false;
      }
      if (void 0 != t.activeiOS && 0 == t.activeiOS && cc.sys.os == cc.sys.OS_IOS && (e = D()) && GameConfigManager.default.getInstance()
        .isDisablePublicLobby(e)) {
        return false;
      }
    }
  }
  return 1 == cc.sys.isNative && "true" == GameConfigManager.default.getInstance().isActivePublicLobbyApp || 0 == cc.sys.isNative && "true" == GameConfigManager.default
    .getInstance().isActivePublicLobbyWeb;
};
i.getBrand = function() {
  var t = GameConfigManager.default.getInstance().enviromentName;
  return (t = (t = (t = t.replace("test", "")).replace("pre", "")).replace("prepro", "")).toUpperCase();
};
i.isTablet = function() {
  if (cc.sys.platform === cc.sys.IPAD) {
    return true;
  }
  if (cc.sys.isNative) {
    var t = jsb.device.getDPI(),
      e = cc.view.getFrameSize(),
      i = e.width / t,
      n = e.height / t,
      o = Math.sqrt(Math.pow(i, 2) + Math.pow(n, 2));
    return (o = Math.round(100 * o) / 100) >= 7;
  }
  if (cc.sys.platform === cc.sys.MOBILE_BROWSER) {
    var a = navigator.userAgent.toLowerCase();
    return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(a);
  }
  return false;
};
i.convertToHMS = function(t) {
  return {
    hours: Math.floor(t / 3600),
    minutes: Math.floor(t % 3600 / 60),
    seconds: t % 60
  };
};
i.setOrientation = function(t) {
  if (void 0 === t && (t = 0), cc.sys.isNative) {
    if (cc.sys.os === cc.sys.OS_IOS) {
      if (jsb) {
        try {
          var e = m.Instance.getFunctionName("rotateScreen");
          jsb.reflection.callStaticMethod("AppController", e + ":", t);
        } catch (t) {}
      }
    } else if (cc.sys.os === cc.sys.OS_ANDROID && jsb) {
      try {
        e = m.Instance.getFunctionName("setOrientation");
        if (jsb) {
          jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", e, "(I)V");
        }
      } catch (t) {}
    }
  }
};
i.changeOrientation = function(t) {
  var e = false;
  if (cc.sys.isNative) {
    if (cc.sys.os === cc.sys.OS_IOS) {
      if (jsb) {
        try {
          e = true;
          var i = m.Instance.getFunctionName("rotateScreen");
          jsb.reflection.callStaticMethod("AppController", i + ":", t);
        } catch (t) {}
      }
    } else if (cc.sys.os === cc.sys.OS_ANDROID && jsb) {
      try {
        i = m.Instance.getFunctionName("setOrientation");
        if (jsb) {
          e = true;
          jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", i, "(I)V", t);
        }
      } catch (t) {}
    }
  }
  if (e) {
    if (0 == t || 2 == t) {
      cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
    } else {
      if (1 == t || 3 == t) {
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
      } else {
        cc.view.setOrientation(cc.macro.ORIENTATION_AUTO);
      }
    }
  }
};
i.getFakeFingerPrint = M;
i.bundleId_default = "hit.comp.app";
i.getBundleId = D;
i.setKeepScreenOn = function(t) {
  try {
    if (cc.sys.isNative) {
      if (cc.sys.os === cc.sys.OS_ANDROID) {
        var e = m.Instance.getFunctionName("setKeepScreenOn");
        if (jsb) {
          jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", e, "(Z)V", t);
        }
      } else {
        if (cc.sys.os === cc.sys.OS_IOS && jsb) {
          e = m.Instance.getFunctionName("setKeepScreenOn");
          jsb.reflection.callStaticMethod("AppController", e + ":", t);
        }
      }
    }
  } catch (t) {
    console.log(t);
  }
};
i.saveBase64Image = function(t) {
  try {
    if (cc.sys.isNative) {
      if (cc.sys.os === cc.sys.OS_ANDROID) {
        var e = m.Instance.getFunctionName("saveImageToPhotoLibrary");
        if (jsb) {
          jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", e, "(Ljava/lang/String;)V", t);
        }
      } else {
        if (cc.sys.os === cc.sys.OS_IOS && jsb) {
          e = m.Instance.getFunctionName("saveImageToPhotoLibrary");
          jsb.reflection.callStaticMethod("AppController", e + ":", t);
        }
      }
    }
  } catch (t) {
    console.log(t);
  }
};
i.isSupportSendSMS = function() {
  try {
    if (cc.sys.isNative) {
      if (cc.sys.os === cc.sys.OS_ANDROID) {
        var t = m.Instance.getFunctionName("isSupportSendSMS");
        if (jsb) {
          return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", t, "()Z");
        }
      } else if (cc.sys.os === cc.sys.OS_IOS && jsb) {
        t = m.Instance.getFunctionName("isSupportSendSMS");
        return jsb.reflection.callStaticMethod("AppController", t);
      }
    }
  } catch (t) {
    console.log(t);
  }
  return false;
};
i.sendSMS = function(t, e) {
  try {
    if (cc.sys.isNative) {
      if (cc.sys.os === cc.sys.OS_ANDROID) {
        var i = m.Instance.getFunctionName("sendSMS");
        if (jsb) {
          jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", i, "(Ljava/lang/String;Ljava/lang/String;)V", t, e);
        }
      } else {
        if (cc.sys.os === cc.sys.OS_IOS && jsb) {
          i = m.Instance.getFunctionName("sendSMS");
          jsb.reflection.callStaticMethod("AppController", i + ":withContent:", t, e);
        }
      }
    }
  } catch (t) {
    console.log(t);
  }
};
i.getIdentifier = function() {
  var t = "none";
  if (cc.sys.isNative) {
    if (cc.sys.os === cc.sys.OS_ANDROID) {
      var e = m.Instance.getFunctionName("getIdentifier");
      try {
        if (void 0 != jsb) {
          t = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", e, "()Ljava/lang/String;");
        }
      } catch (t) {
        console.error("ERROR getting bundle id " + t);
      }
    } else if (cc.sys.os === cc.sys.OS_IOS) {
      try {
        if (void 0 != jsb) {
          e = m.Instance.getFunctionName("getIdentifier");
          t = jsb.reflection.callStaticMethod("AppController", e);
        }
      } catch (t) {
        console.error("ERROR getting bundle id " + t);
      }
    }
  }
  if (!(void 0 != t && null != t && "" != t)) {
    t = M();
  }
  return t;
};
i.getDeviceName = function() {
  var t = "none";
  if (cc.sys.isNative) {
    if (cc.sys.os === cc.sys.OS_ANDROID) {
      var e = m.Instance.getFunctionName("getDeviceName");
      try {
        if (void 0 != jsb) {
          t = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", e, "()Ljava/lang/String;");
        }
      } catch (t) {
        console.log("ERROR getting bundle id " + t);
      }
    } else if (cc.sys.os === cc.sys.OS_IOS) {
      try {
        if (void 0 != jsb) {
          e = m.Instance.getFunctionName("getDeviceName");
          t = jsb.reflection.callStaticMethod("AppController", e);
        }
      } catch (t) {
        console.log("ERROR getting bundle id " + t);
      }
    }
  } else {
    try {
      t = window.navigator.userAgent;
    } catch (t) {
      console.log("ERROR getting bundle id " + t);
    }
  }
  return t;
};
i.writeTextToClipboard = function(t) {
  try {
    if (cc.sys.platform === cc.sys.MOBILE_BROWSER || cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
      try {
        window.navigator.clipboard.writeText(t).then(function() {}, function(t) {});
      } catch (t) {}
    } else if (cc.sys.isNative && void 0 != jsb) {
      if (cc.sys.os === cc.sys.OS_ANDROID) {
        var e = m.Instance.getFunctionName("setClipboardContent");
        if (jsb) {
          jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", e, "(Ljava/lang/String;)V", t);
        }
      } else {
        if (cc.sys.os === cc.sys.OS_IOS) {
          e = m.Instance.getFunctionName("setClipboardContent");
          jsb.reflection.callStaticMethod("AppController", e + ":", t);
        }
      }
    }
  } catch (t) {
    console.log(t);
  }
};
i.readTextFromClipboard = function() {
  try {
    if (cc.sys.isNative && void 0 != jsb) {
      if (cc.sys.os === cc.sys.OS_ANDROID) {
        var t = m.Instance.getFunctionName("getClipboardContent");
        if (jsb) {
          return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", t, "()Ljava/lang/String;");
        }
      } else if (cc.sys.os === cc.sys.OS_IOS && jsb) {
        t = m.Instance.getFunctionName("getClipboardContent");
        return jsb.reflection.callStaticMethod("AppController", t);
      }
    }
  } catch (t) {
    console.log(t);
  }
  return "";
};
i.isOldAppIOS = function() {
  return false;
};
i.downloadBinary = function(t, e) {
  var i = cc.loader.getXMLHttpRequest(),
    n = "Load binary data failed: " + t;
  i.open("GET", t, true);
  i.responseType = "arraybuffer";
  i.onload = function() {
    var t = i.response;
    if (t) {
      var o = new Uint8Array(t);
      e(null, o);
    } else {
      e({
        status: i.status,
        errorMessage: n + "(no response)"
      });
    }
  };
  i.onerror = function() {
    e({
      status: i.status,
      errorMessage: n + "(error)"
    });
  };
  i.ontimeout = function() {
    e({
      status: i.status,
      errorMessage: n + "(time out)"
    });
  };
  i.send(null);
};
i.capitalizeFirstLetter = R;
i.formatUrl = function(t) {
  return t = (t = (t = (t = (t = (t = t.replace(/https:/g, "https_")).replace(/{/g, "%7B")).replace(/}/g, "%7D")).replace(/"/g, "%22"))
    .replace(/:/g, "%3A")).replace(/https_/g, "https:");
};
i.showPopupNewBrandInfo = function() {
  if (0 == GameConfigManager.default.getInstance().isforcebrand) {
    return false;
  }
  var t = GameConfigManager.default.getInstance().newHomeUrl;
  if (t.includes("play")) {
    t = t.split("play.")[1];
  }
  var e = CommonPrefabsManager.default.getInstance().showPopup1Button();
  e.btnBackground.interactable = false;
  e.nodeButton.width = 250;
  e.nodeButton.height = 75;
  e.lbOk.string = "T\u1ea3i " + GameConfigManager.default.getInstance().newBrandName;
  e.lbContent.string = "T\u1eeb ng\xe0y " + GameConfigManager.default.getInstance().newBrandTime + ", " + GameConfigManager.default.getInstance().homeUrl.split("play.")[
      1] + " chuy\u1ec3n sang c\u1ed5ng game " + GameConfigManager.default.getInstance().newBrandName +
    ", m\u1eddi b\u1ea1n \u0111\u0103ng k\xfd t\u1ea1i " + t;
  e.onOKCallback = function() {
    cc.sys.openURL("https://" + GameConfigManager.default.getInstance().newHomeUrl);
  }.bind(this);
  return true;
};
i.delay = function(t) {
  return new Promise(function(e) {
    return setTimeout(e, t);
  });
};
i.transformAvatarString = function(t) {
  return t.split("-").map(function(t, e) {
    return 0 === e ? R(t) : t.replace(/^0+/, "");
  }).join("");
};
i.updateLiveChatInhouseUrl = function() {
  if (GameConfigManager.default.getInstance().isUseLiveChatInhouse) {
    var t = GameConfigManager.default.getInstance().liveChatOriginalUrl;
    t = "" != GamePlayManager.default.getInstance().session_id ? t.replace("{xtoken}", GamePlayManager.default.getInstance().session_id) : t.replace(
      "?xtoken={xtoken}", "");
    GameConfigManager.default.getInstance().liveChatUrl = t;
    cc.sys.localStorage.setItem("KEY_URL_SUPPORT_LIVE_CHAT", t);
  }
};
i.convertTimeToString = function(t, e) {
  if (void 0 === e) {
    e = "\n";
  }
  var i = new Date(t),
    n = i.getFullYear(),
    o = ("0" + (i.getMonth() + 1)).slice(-2);
  return ("0" + i.getDate()).slice(-2) + "-" + o + "-" + n + e + ("0" + i.getHours()).slice(-2) + ":" + ("0" + i.getMinutes()).slice(-2) +
    ":" + ("0" + i.getSeconds()).slice(-2);
};
i.convertDateFormat = function(t) {
  var e = t.split(" "),
    i = e[0],
    n = e[1],
    o = i.split("-"),
    a = o[0],
    s = o[1];
  return o[2] + "-" + s + "-" + a + " " + n;
};
i.convertToStringGameID = function(t) {
  var e = "";
  switch (t) {
    case MessageCardGameHandler.GAME.XITO:
      e = MessageCardGameHandler.GAMEID.XITO;
      break;
    case MessageCardGameHandler.GAME.BINH:
      e = MessageCardGameHandler.GAMEID.BINH;
      break;
    case MessageCardGameHandler.GAME.TIENLEN:
      e = MessageCardGameHandler.GAMEID.TIENLEN;
      break;
    case MessageCardGameHandler.GAME.POKER:
      e = MessageCardGameHandler.GAMEID.POKER;
      break;
    case MessageCardGameHandler.GAME.BACAY:
      e = MessageCardGameHandler.GAMEID.BACAY;
      break;
    case MessageCardGameHandler.GAME.LIENG:
      e = MessageCardGameHandler.GAMEID.LIENG;
      break;
    case MessageCardGameHandler.GAME.SAM:
      e = MessageCardGameHandler.GAMEID.SAM;
      break;
    case MessageCardGameHandler.GAME.PHOM:
      e = MessageCardGameHandler.GAMEID.PHOM;
      break;
    case MessageCardGameHandler.GAME.TLMN:
      e = MessageCardGameHandler.GAMEID.TLMN;
      break;
    case MessageCardGameHandler.GAME.CATTE:
      e = MessageCardGameHandler.GAMEID.CATTE;
      break;
    case MessageCardGameHandler.GAME.XOCDIA:
      e = MessageCardGameHandler.GAMEID.XOCDIA;
      break;
    case MessageCardGameHandler.GAME.BAU_CUA:
      e = MessageCardGameHandler.GAMEID.BAU_CUA;
      break;
    case MessageCardGameHandler.GAME.XIDACH:
      e = MessageCardGameHandler.GAMEID.XIDACH;
  }
  return e;
};
i.runAnimationMoneyDecimal = function(t, e, i, n) {
  if (void 0 === n && (n = .6), Number.isInteger(e) && Number.isInteger(i)) {
    C(t, e, i, n);
  } else {
    var a = (i - e) / n;
    if (t.unscheduleAllCallbacks(), 0 != a) {
      var s = function(n) {
        e += a * n;
        if (Math.abs(e - i) < Math.abs(a * n * 2)) {
          e = i;
          t.string = StringUtil.default.formatMoneyNumberDecimal(e);
          t.unschedule(s);
        } else {
          t.string = StringUtil.default.formatMoneyNumberDecimal(e);
        }
      };
      t.schedule(s, p);
    } else {
      t.string = StringUtil.default.formatMoneyNumberDecimal(i);
    }
  }
};
i.countUppercase = function(t) {
  for (var e = 0, i = 0, n = t; i < n.length; i++) {
    var o = n[i];
    if (o >= "A" && o <= "Z") {
      e++;
    }
  }
  return e;
};
i.getPopupPositionCenter = function() {
  var t = RMCAppInfoConfig.getBrandCodeConfig(),
    e = new GbBrandChecker.BrandChecker(t);
  return e.isG0() ? cc.Vec2.ZERO : (e.isGTh, new cc.Vec2(cc.winSize.width / 2, cc.winSize.height / 2));
};
i.setPopupPosition = function(t) {
  var e = RMCAppInfoConfig.getBrandCodeConfig(),
    i = new GbBrandChecker.BrandChecker(e);
  if (i.isG0()) {
    t.x = 0;
    t.y = 0;
  } else {
    i.isGTh();
    t.x = cc.winSize.width / 2;
    t.y = cc.winSize.height / 2;
  }
};
i.callOpenUrl = function(t, e) {
  if (void 0 === e) {
    e = false;
  }
  var i = function() {
    if (cc.sys.isBrowser) {
      L(t);
    } else {
      cc.sys.openURL(t);
    }
  };
  if (e) {
    setTimeout(function() {
      i();
    }, 100);
  } else {
    i();
  }
};
i.openUrlWithDom = L;
void 0;
