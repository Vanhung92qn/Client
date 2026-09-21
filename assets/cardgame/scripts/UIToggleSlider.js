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
  property = ccDecorator.property,
  UIToggleSlider = function(_super) {
    function UIToggleSlider() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.iconChose = null;
      _this.offset = 0;
      _this.moveX = 0;
      _this.isOnSelect = false;
      _this.isMove = true;
      _this.isPreventClick = false;
      _this.onValueChange = function(isOn) {};
      return _this;
    }
    __extends(UIToggleSlider, _super);
    UIToggleSlider.prototype.isOnChange = function(isOn, fireCallback) {
      if (void 0 === fireCallback) {
        fireCallback = true;
      }
      if (!(this.isPreventClick || this.isOnSelect === isOn || this.iconChose.getNumberOfRunningActions() > 0)) {
        if (this.isMove) {
          this.isOnSelect = isOn;
          this.iconChose.runAction(cc.moveTo(.1, new cc.Vec2(this.isOnSelect ? this.moveX : -this.moveX, this.iconChose.position.y)));
        }
        if (fireCallback) {
          this.onValueChange(isOn);
        }
      }
    };
    UIToggleSlider.prototype.initStart = function(isOn) {
      this.moveX = this.node.width / 2 - this.iconChose.width / 2 - this.offset;
      this.isOnSelect = isOn;
      this.iconChose.position = new cc.Vec2(this.isOnSelect ? this.moveX : -1 * this.moveX, this.iconChose.position.y);
    };
    UIToggleSlider.prototype.setPreventClick = function(preventClick) {
      this.isPreventClick = preventClick;
    };
    UIToggleSlider.prototype.onClick = function() {
      this.isOnChange(!this.isOnSelect);
    };
    __decorate([property(cc.Node)], UIToggleSlider.prototype, "iconChose", void 0);
    __decorate([property], UIToggleSlider.prototype, "offset", void 0);
    return UIToggleSlider = __decorate([ccclass], UIToggleSlider);
  }(cc.Component);
moduleExports.default = UIToggleSlider;
void 0;
