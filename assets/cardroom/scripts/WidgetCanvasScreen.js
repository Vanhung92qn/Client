var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
var __extends = this && this.__extends || function() {
    var t = function(e, i) {
      return (t = Object.setPrototypeOf || {
          __proto__: []
        }
        instanceof Array && function(t, e) {
          t.__proto__ = e;
        } || function(t, e) {
          for (var i in e) {
            if (e.hasOwnProperty(i)) {
              t[i] = e[i];
            }
          }
        })(e, i);
    };
    return function(e, i) {
      function n() {
        this.constructor = e;
      }
      t(e, i);
      e.prototype = null === i ? Object.create(i) : (n.prototype = i.prototype, new n());
    };
  }(),
  __decorate = this && this.__decorate || function(t, e, i, n) {
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
var _decorator = cc._decorator,
  ccclass = _decorator.ccclass,
  property = _decorator.property,
  WidgetCanvasScreen = function(_super) {
    function WidgetCanvasScreen() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.widget = null;
      return _this;
    }
    __extends(WidgetCanvasScreen, _super);
    WidgetCanvasScreen.prototype.onLoad = function() {
      if (null !== this.widget) {
        this.widget.target = cc.director.getScene();
      }
    };
    __decorate([property(cc.Widget)], WidgetCanvasScreen.prototype, "widget", void 0);
    return WidgetCanvasScreen = __decorate([ccclass], WidgetCanvasScreen);
  }(cc.Component);
moduleExports.default = WidgetCanvasScreen;
void 0;
