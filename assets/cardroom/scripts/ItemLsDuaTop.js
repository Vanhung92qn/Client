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
var GamePlayManager = require("GamePlayManager"),
  StringUtil = require("StringUtil"),
  _decorator = cc._decorator,
  ccclass = _decorator.ccclass,
  property = _decorator.property,
  ItemLsDuaTop = function(_super) {
    function ItemLsDuaTop() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.txtRank = null;
      _this.icoRank = null;
      _this.iconGold = null;
      _this.animRank = null;
      _this.txtTenHienThi = null;
      _this.txtTongPoint = null;
      _this.txtTongThang = null;
      _this.spriteLineOn = null;
      _this.selected = null;
      _this.animTop = null;
      _this.nodeContent = null;
      _this.listIconMedal = [];
      return _this;
    }
    __extends(ItemLsDuaTop, _super);
    ItemLsDuaTop.prototype.loadUI = function(rank, rowIndex, displayName, userId, fallbackName, rewardMoney, totalWin) {
      if (void 0 === rewardMoney && (rewardMoney = 0), void 0 === totalWin && (totalWin = 0), this.iconGold.spriteFrame = this.listIconMedal[rank - 1], !StringUtil.default
        .isNullOrEmpty(userId) && GamePlayManager.default.getInstance().userID.indexOf(userId) >= 0 ? this.selected.active = true : this.selected.active = false,
        void 0 != rank && null != rank) {
        if (this.spriteLineOn.active = rowIndex % 2 != 0, rank <= 3) {
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
      if (StringUtil.default.isNullOrEmpty(displayName)) {
        if (StringUtil.default.isNullOrEmpty(fallbackName)) {
          this.txtTenHienThi.string = "";
        } else {
          this.txtTenHienThi.string = fallbackName.toString();
        }
      } else {
        this.txtTenHienThi.string = displayName.toString();
      }
      this.txtTongPoint.string = void 0 != rewardMoney && null != rewardMoney ? StringUtil.default.formatMoneyNumberWithColom(rewardMoney) : "0";
      this.txtTongThang.string = void 0 != totalWin && null != totalWin && totalWin >= 0 ? StringUtil.default.formatMoneyNumberWithColom(totalWin) : "0";
    };
    __decorate([property(cc.Label)], ItemLsDuaTop.prototype, "txtRank", void 0);
    __decorate([property(cc.Sprite)], ItemLsDuaTop.prototype, "icoRank", void 0);
    __decorate([property(cc.Sprite)], ItemLsDuaTop.prototype, "iconGold", void 0);
    __decorate([property(sp.Skeleton)], ItemLsDuaTop.prototype, "animRank", void 0);
    __decorate([property(cc.Label)], ItemLsDuaTop.prototype, "txtTenHienThi", void 0);
    __decorate([property(cc.Label)], ItemLsDuaTop.prototype, "txtTongPoint", void 0);
    __decorate([property(cc.Label)], ItemLsDuaTop.prototype, "txtTongThang", void 0);
    __decorate([property(cc.Node)], ItemLsDuaTop.prototype, "spriteLineOn", void 0);
    __decorate([property(cc.Node)], ItemLsDuaTop.prototype, "selected", void 0);
    __decorate([property(sp.SkeletonData)], ItemLsDuaTop.prototype, "animTop", void 0);
    __decorate([property(cc.Node)], ItemLsDuaTop.prototype, "nodeContent", void 0);
    __decorate([property(cc.SpriteFrame)], ItemLsDuaTop.prototype, "listIconMedal", void 0);
    return ItemLsDuaTop = __decorate([ccclass], ItemLsDuaTop);
  }(cc.Component);
moduleExports.default = ItemLsDuaTop;
void 0;
