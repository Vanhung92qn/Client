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
var a = require("./GamePlayManager"),
  s = require("./GameConfigManager"),
  r = require("./CommonPrefabsManager"),
  c = require("./MusicPlayer"),
  l = require("./CardGameCommonRequest"),
  h = require("./RoomMessageHandler"),
  u = cc._decorator,
  d = u.ccclass,
  p = u.property,
  f = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.btnAutoReady = null;
      e.btnExit = null;
      e.iconOutRoom = null;
      e.iconHuyOutRoom = null;
      e.btnBaoQuay = null;
      e.bet = 100;
      e.onCloseCallback = function() {};
      e.onExitCallback = function() {};
      return e;
    }
    n(e, t);
    e.prototype.show = function(t, e) {
      if (void 0 === t) {
        t = true;
      }
      if (void 0 === e) {
        e = 100;
      }
      if (null !== this.btnAutoReady && void 0 !== this.btnAutoReady) {
        this.btnAutoReady.isChecked = s.default.getInstance().autoReady;
      }
      this.node.active = true;
      this.node.position = new cc.Vec2(-this.node.parent.width / 2 - this.node.width / 2, this.node.position.y);
      this.node.runAction(cc.moveTo(.5, new cc.Vec2(-this.node.parent.width / 2 + this.node.width / 2 + 60, this.node.position.y)).easing(
        cc.easeExponentialOut()));
      if (null !== this.btnBaoQuay && void 0 !== this.btnBaoQuay) {
        this.btnBaoQuay.active = true;
        if (false === t) {
          this.btnBaoQuay.active = false;
        }
      }
      this.bet = e;
    };
    e.prototype.onClickHide = function() {
      var t = this;
      c.default.getInstance().playbtnClick();
      this.node.stopAllActions();
      this.onCloseCallback();
      this.node.runAction(cc.sequence(cc.moveTo(.5, new cc.Vec2(-this.node.parent.width / 2 - this.node.width / 2, this.node.position.y))
        .easing(cc.easeExponentialOut()), cc.callFunc(function() {
          t.node.active = false;
        })));
    };
    e.prototype.onClickExit = function() {
      this.onClickHide();
      this.onExitCallback();
    };
    e.prototype.onClickSetting = function() {
      this.onClickHide();
      r.default.getInstance().showPopupSetting();
    };
    e.prototype.onClickAutoReady = function() {
      s.default.getInstance().setEnableAutoReady(this.btnAutoReady.isChecked);
      h.default.getInstance().sendAutoReadyPref(this.btnAutoReady.isChecked);
      c.default.getInstance().playbtnClick();
    };
    e.prototype.onClickHelp = function() {
      r.default.getInstance().showPopupHelpImage(a.default.getInstance().gameID);
      this.onClickHide();
    };
    e.prototype.onClickBaoQuay = function() {
      var t = r.default.getInstance().showPopup2Button();
      t.setContent(s.default.getInstance().textBaoQuay);
      t.setTextOk("B\xc1O");
      t.onOKClicked = function() {
        t.hide();
        l.default.getInstance().sendBaoQuay();
      }.bind(this);
      this.onClickHide();
    };
    e.prototype.onClickBXH = function() {
      r.default.getInstance().showPopupXepHangGame(a.default.getInstance().gameID);
      this.onClickHide();
    };
    o([p(cc.Toggle)], e.prototype, "btnAutoReady", void 0);
    o([p(cc.Sprite)], e.prototype, "btnExit", void 0);
    o([p(cc.SpriteFrame)], e.prototype, "iconOutRoom", void 0);
    o([p(cc.SpriteFrame)], e.prototype, "iconHuyOutRoom", void 0);
    o([p(cc.Node)], e.prototype, "btnBaoQuay", void 0);
    return e = o([d], e);
  }(cc.Component);
i.default = f;
void 0;
