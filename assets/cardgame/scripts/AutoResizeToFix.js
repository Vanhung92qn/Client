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
var ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  AutoResizeToFix = (ccDecorator.property, function(_super) {
    function AutoResizeToFix() {
      return null !== _super && _super.apply(this, arguments) || this;
    }
    __extends(AutoResizeToFix, _super);
    AutoResizeToFix.prototype.onLoad = function() {
      this.node.width = cc.winSize.width;
      this.node.height = cc.winSize.height;
      var widget = this.getComponent(cc.Widget);
      if (!(null != widget && void 0 != widget)) {
        widget = new cc.Widget();
      }
      widget.target = cc.director.getScene();
    };
    return AutoResizeToFix = __decorate([ccclass], AutoResizeToFix);
  }(cc.Component));
moduleExports.default = AutoResizeToFix;
void 0;
