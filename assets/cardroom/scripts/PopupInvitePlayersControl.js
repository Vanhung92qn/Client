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
var InvitePlayersItemControl = require("InvitePlayersItemControl"),
  StringUtil = require("StringUtil"),
  CardGameCommonRequest = require("CardGameCommonRequest"),
  MusicPlayer = require("MusicPlayer"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  PopupInvitePlayersControl = function(_super) {
    function PopupInvitePlayersControl() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.prefabInvitePlayerItem = null;
      _this.contentNode = null;
      _this.listItem = [];
      return _this;
    }
    __extends(PopupInvitePlayersControl, _super);
    PopupInvitePlayersControl.prototype.loadData = function(playerList) {
      this.listItem = [];
      this.contentNode.removeAllChildren();
      for (var index = 0; index < playerList.length; index++) {
        var playerInfo = playerList[index],
          itemNode = cc.instantiate(this.prefabInvitePlayerItem);
        itemNode.parent = this.contentNode;
        var itemControl = itemNode.getComponent(InvitePlayersItemControl.default);
        itemControl.playerId = playerInfo.u;
        itemControl.lblName.getComponent(cc.Label).string = playerInfo.dn;
        itemControl.lblMoney.getComponent(cc.Label).string = StringUtil.default.formatMoneyNumber(playerInfo.m);
        itemControl.init(this);
        this.listItem.push(itemControl);
      }
    };
    PopupInvitePlayersControl.prototype.show = function() {
      this.node.position = new cc.Vec2(780 + this.node.width / 2, this.node.position.y);
      this.node.runAction(cc.moveTo(.5, new cc.Vec2(780 - this.node.width / 2, this.node.position.y)).easing(cc.easeExponentialOut()));
    };
    PopupInvitePlayersControl.prototype.onClickSendInvite = function() {
      if (!(this.node.getNumberOfRunningActions() > 0)) {
        this.onClickHide();
        for (var selectedPlayerIds = [], index = 0; index < this.listItem.length; index++) {
          var itemControl = this.listItem[index];
          if (itemControl.selected) {
            selectedPlayerIds.push(itemControl.playerId);
          }
        }
        CardGameCommonRequest.default.getInstance().sendInvitePlayers(selectedPlayerIds);
      }
    };
    PopupInvitePlayersControl.prototype.onClickHide = function() {
      var _this = this;
      MusicPlayer.default.getInstance().playbtnClick();
      if (!(this.node.getNumberOfRunningActions() > 0)) {
        this.node.runAction(cc.sequence(cc.moveTo(.5, new cc.Vec2(this.node.parent.width / 2 + this.node.width / 2, this.node.position.y))
          .easing(cc.easeExponentialOut()), cc.callFunc(function() {
            _this.node.active = false;
          })));
      }
    };
    __decorate([property(cc.Prefab)], PopupInvitePlayersControl.prototype, "prefabInvitePlayerItem", void 0);
    __decorate([property(cc.Node)], PopupInvitePlayersControl.prototype, "contentNode", void 0);
    return PopupInvitePlayersControl = __decorate([ccclass], PopupInvitePlayersControl);
  }(cc.Component);
moduleExports.default = PopupInvitePlayersControl;
void 0;
