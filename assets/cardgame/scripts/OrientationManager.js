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
var GameUtils = require("GameUtils"),
  _decorator = cc._decorator,
  ccclass = _decorator.ccclass;
_decorator.property;
(function(Orientation) {
  Orientation[Orientation.Undefined = -1] = "Undefined";
  Orientation[Orientation.Portrait = 0] = "Portrait";
  Orientation[Orientation.Landscape = 1] = "Landscape";
  Orientation[Orientation.UpsideDown = 2] = "UpsideDown";
  Orientation[Orientation.LandscapeLeft = 3] = "LandscapeLeft";
  Orientation[Orientation.Auto = 4] = "Auto";
})(moduleExports.Orientation || (moduleExports.Orientation = {}));
var OrientationManager = function() {
  function OrientationManager() {}
  OrientationManager.changeOrientation = function(orientation) {
    if (cc.sys.isNative) {
      if (cc.sys.os === cc.sys.OS_IOS) {
        if (jsb) {
          try {
            var nativeMethodName = GameUtils.NativeInterop.Instance.getFunctionName("rotateScreen");
            jsb.reflection.callStaticMethod("AppController", nativeMethodName + ":", orientation);
          } catch (error) {}
        }
      } else if (cc.sys.os === cc.sys.OS_ANDROID && jsb) {
        try {
          nativeMethodName = GameUtils.NativeInterop.Instance.getFunctionName("setOrientation");
          if (jsb) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", nativeMethodName, "(I)V", orientation);
          }
        } catch (error) {}
      }
    }
    if (0 == orientation || 2 == orientation) {
      cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
    } else {
      if (1 == orientation || 3 == orientation) {
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
      } else {
        cc.view.setOrientation(cc.macro.ORIENTATION_AUTO);
      }
    }
  };
  OrientationManager.prototype.start = function() {};
  return OrientationManager = __decorate([ccclass], OrientationManager);
}();
moduleExports.default = OrientationManager;
void 0;
