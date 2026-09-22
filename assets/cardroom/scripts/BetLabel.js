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
var StringUtil = require("StringUtil"),
  GameUtils = require("GameUtils"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  BetLabel = function(_super) {
    function BetLabel() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.label = null;
      _this.chipIconPos = null;
      _this.money = 0;
      return _this;
    }
    __extends(BetLabel, _super);
    BetLabel.prototype.setNumber = function(amount, animate) {
      if (void 0 === animate) {
        animate = true;
      }
      if (animate) {
        GameUtils.runAnimationMoney(this.label, this.money, amount);
        this.money = amount;
      }
      this.label.string = StringUtil.default.formatMoneyNumber(amount);
      if (0 === amount) {
        this.node.active = false;
        this.label.string = "";
      }
    };
    BetLabel.prototype.setNumberWithPrefix = function(amount, animate, prefix) {
      if (void 0 === animate) {
        animate = true;
      }
      if (void 0 === prefix) {
        prefix = "";
      }
      if (animate) {
        GameUtils.runAnimationMoney(this.label, this.money, amount);
        this.money = amount;
      }
      this.label.string = prefix + StringUtil.default.formatMoneyNumber(amount);
      if (0 === amount) {
        this.node.active = false;
        this.label.string = "";
      }
    };
    BetLabel.prototype.setText = function(text) {
      this.label.string = text;
    };
    __decorate([property(cc.Label)], BetLabel.prototype, "label", void 0);
    __decorate([property(cc.Node)], BetLabel.prototype, "chipIconPos", void 0);
    return BetLabel = __decorate([ccclass], BetLabel);
  }(cc.Component);
moduleExports.default = BetLabel;
void 0;
