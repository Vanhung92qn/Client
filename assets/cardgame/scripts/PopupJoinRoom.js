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
var a = t("./CardPopupBase"),
  s = t("./GamePlayManager"),
  r = t("./MusicPlayer"),
  c = t("./CommonPrefabsManager"),
  l = t("./StringUtil"),
  h = t("./GameDefine"),
  u = cc._decorator,
  d = u.ccclass,
  p = u.property,
  f = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.edbRoomID = null;
      e.edbPassword = null;
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {
      cc.systemEvent.on(h.GameEventMessage.JoinRoom, this.onJoinRoom, this);
    };
    e.prototype.onDestroy = function() {
      cc.systemEvent.off(h.GameEventMessage.JoinRoom, this.onJoinRoom, this);
    };
    e.prototype.onJoinRoom = function() {
      this.hide(null, .4, true, false);
    };
    e.prototype.btnOKPress = function() {
      if (r.default.getInstance().playbtnClick(), this.edbRoomID.string.length <= 0) {
        c.default.getInstance().showPopupMessageUtil("Vui l\xf2ng nh\u1eadp \u0111\xfang s\u1ed1 b\xe0n");
      } else {
        var t = parseInt(this.edbRoomID.string);
        if (Number.isNaN(t)) {
          c.default.getInstance().showPopupMessageUtil("Vui l\xf2ng nh\u1eadp \u0111\xfang s\u1ed1 b\xe0n");
        } else if (l.default.isNullOrEmpty(this.edbPassword.string)) {
          c.default.getInstance().showPopupMessageUtil("Vui l\xf2ng nh\u1eadp m\u1eadt kh\u1ea9u");
        } else {
          var e = s.default.getInstance().gameID;
          s.default.getInstance().joinRoomWithGameID(t, this.edbPassword.string, e);
        }
      }
    };
    e.prototype.onClickClose = function() {
      this.hide();
    };
    o([p(cc.EditBox)], e.prototype, "edbRoomID", void 0);
    o([p(cc.EditBox)], e.prototype, "edbPassword", void 0);
    return e = o([d], e);
  }(a.default);
i.default = f;
void 0;
