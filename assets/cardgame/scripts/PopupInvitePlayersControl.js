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
var a = require("./InvitePlayersItemControl"),
  s = require("./StringUtil"),
  r = require("./CardGameCommonRequest"),
  c = require("./MusicPlayer"),
  l = cc._decorator,
  h = l.ccclass,
  u = l.property,
  d = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.prefabInvitePlayerItem = null;
      e.contentNode = null;
      e.listItem = [];
      return e;
    }
    n(e, t);
    e.prototype.loadData = function(t) {
      this.listItem = [];
      this.contentNode.removeAllChildren();
      for (var e = 0; e < t.length; e++) {
        var i = t[e],
          n = cc.instantiate(this.prefabInvitePlayerItem);
        n.parent = this.contentNode;
        var o = n.getComponent(a.default);
        o.playerId = i.u;
        o.lblName.getComponent(cc.Label).string = i.dn;
        o.lblMoney.getComponent(cc.Label).string = s.default.formatMoneyNumber(i.m);
        o.init(this);
        this.listItem.push(o);
      }
    };
    e.prototype.show = function() {
      this.node.position = new cc.Vec2(780 + this.node.width / 2, this.node.position.y);
      this.node.runAction(cc.moveTo(.5, new cc.Vec2(780 - this.node.width / 2, this.node.position.y)).easing(cc.easeExponentialOut()));
    };
    e.prototype.onClickSendInvite = function() {
      if (!(this.node.getNumberOfRunningActions() > 0)) {
        this.onClickHide();
        for (var t = [], e = 0; e < this.listItem.length; e++) {
          var i = this.listItem[e];
          if (i.selected) {
            t.push(i.playerId);
          }
        }
        r.default.getInstance().sendInvitePlayers(t);
      }
    };
    e.prototype.onClickHide = function() {
      var t = this;
      c.default.getInstance().playbtnClick();
      if (!(this.node.getNumberOfRunningActions() > 0)) {
        this.node.runAction(cc.sequence(cc.moveTo(.5, new cc.Vec2(this.node.parent.width / 2 + this.node.width / 2, this.node.position.y))
          .easing(cc.easeExponentialOut()), cc.callFunc(function() {
            t.node.active = false;
          })));
      }
    };
    o([u(cc.Prefab)], e.prototype, "prefabInvitePlayerItem", void 0);
    o([u(cc.Node)], e.prototype, "contentNode", void 0);
    return e = o([h], e);
  }(cc.Component);
i.default = d;
void 0;
