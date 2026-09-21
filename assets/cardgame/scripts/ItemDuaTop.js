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
  StringUtil = require("./StringUtil"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  ItemDuaTop = function(_super) {
    function ItemDuaTop() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.txtRank = null;
      _this.icoRank = null;
      _this.icoPassTotalBet = null;
      _this.icoFailTotalBet = null;
      _this.lineBreak = null;
      _this.iconGold = null;
      _this.listIconMedal = [];
      _this.animRank = null;
      _this.txtTenHienThi = null;
      _this.txtTongPoint = null;
      _this.txtTargetTotalBet = null;
      _this.txtReward = null;
      _this.spriteLineOn = null;
      _this.selected = null;
      _this.animTop = null;
      _this.nodeContent = null;
      return _this;
    }
    __extends(ItemDuaTop, _super);
    ItemDuaTop.prototype.loadUI = function(rank, fullName, winLost, userId, userName, targetTotalBet, rewardMoney, isRewardHighlighted, isPassTotalBet) {
      if (void 0 === rewardMoney && (rewardMoney = 0), rewardMoney > 0 && (this.txtReward.string = StringUtil.default.formatMoneyNumberWithDot(rewardMoney), this.txtReward.node.active =
          true, this.iconGold.node.active = true, this.iconGold.spriteFrame = this.listIconMedal[rank - 1]), 5 == rank && null != this
        .lineBreak && (this.lineBreak.active = true), this.icoPassTotalBet.active = isPassTotalBet, this.icoFailTotalBet.active = !isPassTotalBet, isRewardHighlighted ? (this
          .txtReward.node.opacity = 255, this.iconGold.node.opacity = 255) : (this.txtReward.node.opacity = 80, this.iconGold.node
          .opacity = 80), this.txtTargetTotalBet.node.active = true, this.txtTargetTotalBet.string = StringUtil.default
        .formatMoneyNumberWithVietnameseUnit(targetTotalBet), !StringUtil.default.isNullOrEmpty(userId) && GamePlayManager.default.getInstance().userID.indexOf(userId) >= 0 ? this
        .selected.active = true : this.selected.active = false, void 0 != rank && null != rank) {
        if (this.spriteLineOn.active = rank % 2 != 0, rank <= 3) {
          switch (this.txtRank.node.active = false, rank) {
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
          this.txtRank.string = rank.toString();
        }
      }
      if (StringUtil.default.isNullOrEmpty(fullName)) {
        if (StringUtil.default.isNullOrEmpty(userName)) {
          this.txtTenHienThi.string = "";
        } else {
          this.txtTenHienThi.string = userName.toString();
        }
      } else {
        this.txtTenHienThi.string = fullName.toString();
      }
      this.txtTongPoint.string = void 0 != winLost && null != winLost ? StringUtil.default.formatMoneyNumberWithColom(winLost) : "0";
    };
    __decorate([property(cc.Label)], ItemDuaTop.prototype, "txtRank", void 0);
    __decorate([property(cc.Sprite)], ItemDuaTop.prototype, "icoRank", void 0);
    __decorate([property(cc.Node)], ItemDuaTop.prototype, "icoPassTotalBet", void 0);
    __decorate([property(cc.Node)], ItemDuaTop.prototype, "icoFailTotalBet", void 0);
    __decorate([property(cc.Node)], ItemDuaTop.prototype, "lineBreak", void 0);
    __decorate([property(cc.Sprite)], ItemDuaTop.prototype, "iconGold", void 0);
    __decorate([property(cc.SpriteFrame)], ItemDuaTop.prototype, "listIconMedal", void 0);
    __decorate([property(sp.Skeleton)], ItemDuaTop.prototype, "animRank", void 0);
    __decorate([property(cc.Label)], ItemDuaTop.prototype, "txtTenHienThi", void 0);
    __decorate([property(cc.Label)], ItemDuaTop.prototype, "txtTongPoint", void 0);
    __decorate([property(cc.Label)], ItemDuaTop.prototype, "txtTargetTotalBet", void 0);
    __decorate([property(cc.Label)], ItemDuaTop.prototype, "txtReward", void 0);
    __decorate([property(cc.Node)], ItemDuaTop.prototype, "spriteLineOn", void 0);
    __decorate([property(cc.Node)], ItemDuaTop.prototype, "selected", void 0);
    __decorate([property(sp.SkeletonData)], ItemDuaTop.prototype, "animTop", void 0);
    __decorate([property(cc.Node)], ItemDuaTop.prototype, "nodeContent", void 0);
    return ItemDuaTop = __decorate([ccclass], ItemDuaTop);
  }(cc.Component);
moduleExports.default = ItemDuaTop;
void 0;
