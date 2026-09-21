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
var CardPopupBase = require("./CardPopupBase"),
  GamePlayManager = require("./GamePlayManager"),
  StringUtil = require("./StringUtil"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  PopupPasswordTable = function(_super) {
    function PopupPasswordTable() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.password = null;
      _this.btnOK = null;
      _this.serverID = 0;
      return _this;
    }
    __extends(PopupPasswordTable, _super);
    PopupPasswordTable.prototype.btnOKPress = function() {
      if (StringUtil.default.isNullOrEmpty(this.password.string)) {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("B\u1ea1n ch\u01b0a nh\u1eadp m\u1eadt kh\u1ea9u !");
      } else {
        this.btnOK.interactable = false;
        var passwordText = this.password.string;
        GamePlayManager.default.getInstance().joinRoom(GamePlayManager.default.getInstance().roomID, this.serverID, passwordText);
        this.onClickClose();
      }
    };
    PopupPasswordTable.prototype.onClickClose = function() {
      this.hide();
    };
    PopupPasswordTable.prototype.ontextChanged = function(text, editBox, customEventData) {
      editBox.string = StringUtil.default.removeSpecialCharacter(text);
    };
    __decorate([property(cc.EditBox)], PopupPasswordTable.prototype, "password", void 0);
    __decorate([property(cc.Button)], PopupPasswordTable.prototype, "btnOK", void 0);
    return PopupPasswordTable = __decorate([ccclass], PopupPasswordTable);
  }(CardPopupBase.default);
moduleExports.default = PopupPasswordTable;
void 0;
