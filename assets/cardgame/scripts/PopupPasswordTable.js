var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
var n = this && this.__extends || function() {
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
  o = this && this.__decorate || function(t, e, i, n) {
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
var CardPopupBase = require("./CardPopupBase"),
  GamePlayManager = require("./GamePlayManager"),
  StringUtil = require("./StringUtil"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  l = cc._decorator,
  h = l.ccclass,
  u = l.property,
  d = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.password = null;
      e.btnOK = null;
      e.serverID = 0;
      return e;
    }
    n(e, t);
    e.prototype.btnOKPress = function() {
      if (StringUtil.default.isNullOrEmpty(this.password.string)) {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("B\u1ea1n ch\u01b0a nh\u1eadp m\u1eadt kh\u1ea9u !");
      } else {
        this.btnOK.interactable = false;
        var t = this.password.string;
        GamePlayManager.default.getInstance().joinRoom(GamePlayManager.default.getInstance().roomID, this.serverID, t);
        this.onClickClose();
      }
    };
    e.prototype.onClickClose = function() {
      this.hide();
    };
    e.prototype.ontextChanged = function(t, e, i) {
      e.string = StringUtil.default.removeSpecialCharacter(t);
    };
    o([u(cc.EditBox)], e.prototype, "password", void 0);
    o([u(cc.Button)], e.prototype, "btnOK", void 0);
    return e = o([h], e);
  }(CardPopupBase.default);
i.default = d;
void 0;
