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
var a = require("./CardPopupBase"),
  s = require("./CommonPrefabsManager"),
  r = require("./MiniGameNode"),
  c = require("./GameDefine"),
  l = cc._decorator,
  h = l.ccclass,
  u = l.property,
  d = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.lbContent = null;
      e.lbOk = null;
      e.lbTitle = null;
      e.nodeButton = null;
      e.btnBackground = null;
      e.onOKCallback = null;
      e.isCanClickClose = true;
      return e;
    }
    n(e, t);
    e.prototype.start = function() {};
    e.prototype.setTitle = function(t) {
      this.lbTitle.string = t;
    };
    e.prototype.setContent = function(t) {
      this.lbContent.string = t;
    };
    e.prototype.hideTemporary = function() {
      this.btnBackground.node.active = false;
      this.node.active = false;
      this.popup.active = false;
      s.default.getInstance().oldCOntentThongBao = "";
    };
    e.prototype.onOKClicked = function(t) {
      this.hide();
      if (null != this.onOKCallback) {
        this.onOKCallback();
      }
      s.default.getInstance().oldCOntentThongBao = "";
    };
    e.prototype.onCloseClicked = function(t) {
      if (this.isCanClickClose) {
        this.hide();
        s.default.getInstance().oldCOntentThongBao = "";
      }
    };
    e.prototype.getID = function() {
      return a.EPopupID.POPUP_1_BUTTON;
    };
    e.prototype.onDestroy = function() {
      s.default.getInstance().oldCOntentThongBao = "";
    };
    e.prototype.show = function(e, i, n) {
      if (void 0 === e) {
        e = null;
      }
      if (void 0 === i) {
        i = .4;
      }
      if (void 0 === n) {
        n = 1;
      }
      t.prototype.show.call(this, e, i, n);
      if (null != r.default.instance) {
        r.default.instance.setSizeAllTVZero(false);
      }
      cc.systemEvent.emit(c.SbLiveState.LiveHide);
    };
    e.prototype.hide = function(e, i, n, o) {
      var a = this;
      if (void 0 === e) {
        e = null;
      }
      if (void 0 === i) {
        i = .4;
      }
      if (void 0 === n) {
        n = true;
      }
      if (void 0 === o) {
        o = true;
      }
      t.prototype.hide.call(this, function() {
        if (null != r.default.instance) {
          r.default.instance.setSizeAllTVOriginal();
        }
        if (null != a.hideCallBack && null === e) {
          a.hideCallBack(a);
        }
        cc.systemEvent.emit(c.SbLiveState.LiveShow);
      }, i, n, o);
    };
    o([u(cc.Label)], e.prototype, "lbContent", void 0);
    o([u(cc.Label)], e.prototype, "lbOk", void 0);
    o([u(cc.Label)], e.prototype, "lbTitle", void 0);
    o([u(cc.Node)], e.prototype, "nodeButton", void 0);
    o([u(cc.Button)], e.prototype, "btnBackground", void 0);
    return e = o([h], e);
  }(a.default);
i.default = d;
void 0;
