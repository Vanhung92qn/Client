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
var GamePlayManager = require("./GamePlayManager"),
  MusicPlayer = require("./MusicPlayer"),
  CardGameCommonRequest = require("./CardGameCommonRequest"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  BtnInviteTable = (ccDecorator.property, function(_super) {
    function BtnInviteTable() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.oldClickTime = 0;
      return _this;
    }
    __extends(BtnInviteTable, _super);
    BtnInviteTable.prototype.onClickInvite = function() {
      var now = new Date();
      if (!((now.getTime() - this.oldClickTime) / 1e3 < 2)) {
        this.oldClickTime = now.getTime();
        MusicPlayer.default.getInstance().playbtnClick();
        if (GamePlayManager.default.getInstance().roomPassword) {
          CommonPrefabsManager.default.getInstance().showPopupMessageUtil(
            "Kh\xf4ng th\u1ec3 m\u1eddi ng\u01b0\u1eddi ch\u01a1i kh\xe1c do b\xe0n ch\u01a1i c\xf3 m\u1eadt kh\u1ea9u!");
        } else {
          CardGameCommonRequest.default.getInstance().sendGetInviteList();
        }
      }
    };
    return BtnInviteTable = __decorate([ccclass], BtnInviteTable);
  }(cc.Component));
moduleExports.default = BtnInviteTable;
void 0;
