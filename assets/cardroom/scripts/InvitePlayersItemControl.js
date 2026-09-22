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
  InvitePlayersItemControl = function(_super) {
    function InvitePlayersItemControl() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.lblName = null;
      _this.lblMoney = null;
      _this.iconCheck = null;
      _this.playerId = "";
      _this.selected = true;
      _this.parent = null;
      return _this;
    }
    __extends(InvitePlayersItemControl, _super);
    InvitePlayersItemControl.prototype.init = function(popupControl) {
      this.parent = popupControl;
    };
    InvitePlayersItemControl.prototype.btnCheckClick = function() {
      this.iconCheck.active = !this.iconCheck.active;
      this.selected = this.iconCheck.active;
    };
    __decorate([property(cc.Label)], InvitePlayersItemControl.prototype, "lblName", void 0);
    __decorate([property(cc.Label)], InvitePlayersItemControl.prototype, "lblMoney", void 0);
    __decorate([property(cc.Node)], InvitePlayersItemControl.prototype, "iconCheck", void 0);
    return InvitePlayersItemControl = __decorate([ccclass], InvitePlayersItemControl);
  }(cc.Component);
moduleExports.default = InvitePlayersItemControl;
void 0;
