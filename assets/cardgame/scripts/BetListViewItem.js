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
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  BetListViewItem = function(_super) {
    function BetListViewItem() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.label = null;
      _this.icon = null;
      _this.isCheck = false;
      return _this;
    }
    __extends(BetListViewItem, _super);
    BetListViewItem.prototype.setText = function(betValue) {
      if (false === this.node.active) {
        this.node.active = true;
      }
      if (-1 != betValue) {
        this.label.node.active = true;
        if (null != this.icon) {
          this.icon.active = true;
        }
        this.label.string = StringUtil.default.formatMoneyNumber(betValue);
        if (this.isCheck) {
          if (this.label.string.length < 6) {
            this.label.fontSize = 30;
          } else {
            this.label.fontSize = 25;
          }
        }
      } else {
        this.label.node.active = false;
        this.icon.active = false;
      }
      this.value = betValue;
    };
    __decorate([property(cc.Label)], BetListViewItem.prototype, "label", void 0);
    __decorate([property(cc.Node)], BetListViewItem.prototype, "icon", void 0);
    __decorate([property(cc.Boolean)], BetListViewItem.prototype, "isCheck", void 0);
    return BetListViewItem = __decorate([ccclass], BetListViewItem);
  }(cc.Component);
moduleExports.default = BetListViewItem;
void 0;
