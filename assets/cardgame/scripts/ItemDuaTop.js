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
var GamePlayManager = require("./GamePlayManager"),
  StringUtil = require("./StringUtil"),
  r = cc._decorator,
  c = r.ccclass,
  l = r.property,
  h = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.txtRank = null;
      e.icoRank = null;
      e.icoPassTotalBet = null;
      e.icoFailTotalBet = null;
      e.lineBreak = null;
      e.iconGold = null;
      e.listIconMedal = [];
      e.animRank = null;
      e.txtTenHienThi = null;
      e.txtTongPoint = null;
      e.txtTargetTotalBet = null;
      e.txtReward = null;
      e.spriteLineOn = null;
      e.selected = null;
      e.animTop = null;
      e.nodeContent = null;
      return e;
    }
    n(e, t);
    e.prototype.loadUI = function(t, e, i, n, o, r, c, l, h) {
      if (void 0 === c && (c = 0), c > 0 && (this.txtReward.string = StringUtil.default.formatMoneyNumberWithDot(c), this.txtReward.node.active =
          true, this.iconGold.node.active = true, this.iconGold.spriteFrame = this.listIconMedal[t - 1]), 5 == t && null != this
        .lineBreak && (this.lineBreak.active = true), this.icoPassTotalBet.active = h, this.icoFailTotalBet.active = !h, l ? (this
          .txtReward.node.opacity = 255, this.iconGold.node.opacity = 255) : (this.txtReward.node.opacity = 80, this.iconGold.node
          .opacity = 80), this.txtTargetTotalBet.node.active = true, this.txtTargetTotalBet.string = StringUtil.default
        .formatMoneyNumberWithVietnameseUnit(r), !StringUtil.default.isNullOrEmpty(n) && GamePlayManager.default.getInstance().userID.indexOf(n) >= 0 ? this
        .selected.active = true : this.selected.active = false, void 0 != t && null != t) {
        if (this.spriteLineOn.active = t % 2 != 0, t <= 3) {
          switch (this.txtRank.node.active = false, t) {
            case 1:
              this.icoRank.node.active = false;
              this.animRank.node.active = true;
              this.animRank.skeletonData = this.animTop;
              this.animRank.setAnimation(0, "Rank1", true);
              this.animRank.node.scale = .6;
              break;
            case 2:
              this.icoRank.node.active = false;
              this.animRank.node.active = true;
              this.animRank.skeletonData = this.animTop;
              this.animRank.setAnimation(0, "Rank2", true);
              this.animRank.node.scale = .54;
              break;
            case 3:
              this.animRank.node.active = false;
              this.icoRank.node.active = true;
          }
        } else {
          this.txtRank.node.active = true;
          this.icoRank.node.active = false;
          this.animRank.node.active = false;
          this.txtRank.string = t.toString();
        }
      }
      if (StringUtil.default.isNullOrEmpty(e)) {
        if (StringUtil.default.isNullOrEmpty(o)) {
          this.txtTenHienThi.string = "";
        } else {
          this.txtTenHienThi.string = o.toString();
        }
      } else {
        this.txtTenHienThi.string = e.toString();
      }
      this.txtTongPoint.string = void 0 != i && null != i ? StringUtil.default.formatMoneyNumberWithColom(i) : "0";
    };
    o([l(cc.Label)], e.prototype, "txtRank", void 0);
    o([l(cc.Sprite)], e.prototype, "icoRank", void 0);
    o([l(cc.Node)], e.prototype, "icoPassTotalBet", void 0);
    o([l(cc.Node)], e.prototype, "icoFailTotalBet", void 0);
    o([l(cc.Node)], e.prototype, "lineBreak", void 0);
    o([l(cc.Sprite)], e.prototype, "iconGold", void 0);
    o([l(cc.SpriteFrame)], e.prototype, "listIconMedal", void 0);
    o([l(sp.Skeleton)], e.prototype, "animRank", void 0);
    o([l(cc.Label)], e.prototype, "txtTenHienThi", void 0);
    o([l(cc.Label)], e.prototype, "txtTongPoint", void 0);
    o([l(cc.Label)], e.prototype, "txtTargetTotalBet", void 0);
    o([l(cc.Label)], e.prototype, "txtReward", void 0);
    o([l(cc.Node)], e.prototype, "spriteLineOn", void 0);
    o([l(cc.Node)], e.prototype, "selected", void 0);
    o([l(sp.SkeletonData)], e.prototype, "animTop", void 0);
    o([l(cc.Node)], e.prototype, "nodeContent", void 0);
    return e = o([c], e);
  }(cc.Component);
i.default = h;
void 0;
