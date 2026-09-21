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
var GameUtils = require("./GameUtils"),
  a = cc._decorator,
  s = a.ccclass;
a.property;
(function(t) {
  t[t.Undefined = -1] = "Undefined";
  t[t.Portrait = 0] = "Portrait";
  t[t.Landscape = 1] = "Landscape";
  t[t.UpsideDown = 2] = "UpsideDown";
  t[t.LandscapeLeft = 3] = "LandscapeLeft";
  t[t.Auto = 4] = "Auto";
})(i.Orientation || (i.Orientation = {}));
var r = function() {
  function t() {}
  t.changeOrientation = function(t) {
    if (cc.sys.isNative) {
      if (cc.sys.os === cc.sys.OS_IOS) {
        if (jsb) {
          try {
            var e = GameUtils.NativeInterop.Instance.getFunctionName("rotateScreen");
            jsb.reflection.callStaticMethod("AppController", e + ":", t);
          } catch (t) {}
        }
      } else if (cc.sys.os === cc.sys.OS_ANDROID && jsb) {
        try {
          e = GameUtils.NativeInterop.Instance.getFunctionName("setOrientation");
          if (jsb) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", e, "(I)V", t);
          }
        } catch (t) {}
      }
    }
    if (0 == t || 2 == t) {
      cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
    } else {
      if (1 == t || 3 == t) {
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
      } else {
        cc.view.setOrientation(cc.macro.ORIENTATION_AUTO);
      }
    }
  };
  t.prototype.start = function() {};
  return t = n([s], t);
}();
i.default = r;
void 0;
