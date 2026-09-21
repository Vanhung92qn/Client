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
var AnalyticDefine = require("./AnalyticDefine"),
  AnalyticService = require("./AnalyticService"),
  GameUtils = require("./GameUtils"),
  GameConfigManager = require("./GameConfigManager"),
  GamePlayManager = require("./GamePlayManager"),
  MusicPlayer = require("./MusicPlayer"),
  StringUtil = require("./StringUtil"),
  TableCell = require("./TableCell"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  TableCellRoomXocDia = function(_super) {
    function TableCellRoomXocDia() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.lbMucCuoc = null;
      _this.lbSoNguoi = null;
      _this.isHpwd = false;
      _this.lbMucTienCuocMin = null;
      _this.iconLock = null;
      _this.processBar = null;
      _this.iconBanXOcDia = null;
      _this.iconBanVip = null;
      _this.bgSprite = null;
      _this.bgSpine = null;
      _this.spriteBanChung = null;
      _this.listspriteBanChungXocDia = [];
      _this.listAnim = ["ANIMBANHO", "ANIMBANSU", "ANIMBANPHUNG"];
      _this.listAnimBanThuong = ["ANIMBANLONG"];
      _this.indextempe = 0;
      _this.oldTienCuocToiThieu = 0;
      return _this;
    }
    __extends(TableCellRoomXocDia, _super);
    TableCellRoomXocDia.prototype.initValue = function(roomData, tableViewUtils) {
      if (_super.prototype.initValue.call(this, roomData, tableViewUtils), this.isHpwd = roomData.hpwd, this.lbMucCuoc.string = StringUtil.default.formatMoneyNumber(roomData.b), this
        .lbSoNguoi.string = Math.max(0, roomData.uC) + "/" + roomData.Mu, null !== roomData.jpa && void 0 !== roomData.jpa || (this.lbMucTienCuocMin.string = StringUtil
          .default.formatMoneyNumber(roomData.mM)), this.iconLock.active = roomData.hpwd, this.processBar.progress = roomData.uC / roomData.Mu, this.lbMucTienCuocMin
        .node.x = 22, roomData.Mu >= 1e3 && GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.XOCDIA) {
        this.lbMucCuoc.node.active = false;
        this.lbSoNguoi.string = Math.max(0, roomData.uC).toString();
        this.processBar.progress = 0;
        if (null !== roomData.jpa && void 0 !== roomData.jpa) {
          GameUtils.runAnimationMoneyWithColom(this.lbMucTienCuocMin, this.oldTienCuocToiThieu, roomData.jpa, 4.5);
          this.oldTienCuocToiThieu = roomData.jpa;
          this.lbMucTienCuocMin.node.x = 27;
        } else {
          this.lbMucTienCuocMin.string = StringUtil.default.formatMoneyNumberWithColom(this.oldTienCuocToiThieu);
        }
        if (null !== this.iconBanXOcDia && void 0 !== this.iconBanXOcDia) {
          this.iconBanXOcDia.active = true;
          this.iconBanXOcDia.width = 186 * (.3 + Math.min(.5, roomData.uC / 600));
        }
        var useSpecialAnim = false;
        this.indextempe = 0;
        if (this.index < GameConfigManager.default.getInstance().listImageXDBanChung.length) {
          this.indextempe = GameConfigManager.default.getInstance().listImageXDBanChung[this.index];
          useSpecialAnim = this.indextempe < 0;
          this.indextempe = Math.abs(this.indextempe) - 1;
          if (useSpecialAnim) {
            this.bgSprite.node.active = false;
            if (false === this.bgSpine.node.active) {
              this.bgSpine.node.active = true;
            }
            if (this.indextempe < this.listAnim.length) {
              this.setRoomAnim(this.listAnim[this.indextempe]);
              GamePlayManager.default.getInstance().setXocDiaIconBG(this.listAnim[this.indextempe], roomData.rid);
            }
          } else {
            if (this.indextempe < this.listAnimBanThuong.length) {
              this.setRoomAnim(this.listAnimBanThuong[this.indextempe]);
              GamePlayManager.default.getInstance().setXocDiaIconBG(this.listAnimBanThuong[this.indextempe], roomData.rid);
            } else {
              if (false === this.bgSprite.node.active) {
                this.bgSprite.node.active = true;
              }
              this.bgSprite.spriteFrame = this.listspriteBanChungXocDia[this.indextempe];
              this.bgSpine.node.active = false;
            }
          }
        } else {
          if (false === this.bgSprite.node.active) {
            this.bgSprite.node.active = true;
          }
          this.bgSprite.spriteFrame = this.spriteBanChung;
          this.bgSpine.node.active = false;
        }
        if (roomData.b > GameConfigManager.default.getInstance().banVipMinBet) {
          if (!this.iconBanVip.active) {
            this.iconBanVip.active = true;
          }
        } else {
          this.iconBanVip.active = false;
        }
      } else {
        this.lbMucCuoc.node.active = true;
        if (false === this.bgSprite.node.active) {
          this.bgSprite.node.active = true;
        }
        this.bgSprite.spriteFrame = this.spriteBanChung;
        this.bgSpine.node.active = false;
        this.iconBanVip.active = false;
      }
      if (GameConfigManager.default.getInstance().isLoginWebcc || GameConfigManager.default.getInstance().isLoginWebccNoWallet) {
        this.iconBanVip.active = false;
      }
    };
    TableCellRoomXocDia.prototype.setRoomAnim = function(animName) {
      this.bgSprite.node.active = false;
      if (false === this.bgSpine.node.active) {
        this.bgSpine.node.active = true;
      }
      if (!StringUtil.default.isNullOrEmpty(animName)) {
        this.bgSpine.setAnimation(0, animName, true);
      }
    };
    TableCellRoomXocDia.prototype.onClickChoseRoom = function() {
      if (GamePlayManager.default.getInstance().roomID = this.data.rid, AnalyticService.default.instance.trackCustomQ(AnalyticDefine.AnaltyciEventType.CLICK, "join_cg_" + GamePlayManager
          .default.getInstance().gameID), -1 === this.data.rid) {
        CommonPrefabsManager.default.getInstance().showLoading();
        GamePlayManager.default.getInstance().requestcreateRoom(GamePlayManager.default.getInstance().gameID, this.data.b, this.data.Mu);
      } else if (GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.POKER || GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.LIENG || GamePlayManager.default
        .getInstance().gameID === MessageCardGameHandler.GAME.XITO) {
        GamePlayManager.default.getInstance().bookRoom(this.data.rid, 0, "");
        CommonPrefabsManager.default.getInstance().showLoading();
      } else {
        if (GamePlayManager.default.getInstance().gold < this.data.mM && this.data.Mu < 1e3) {
          CommonPrefabsManager.default.getInstance().showPopupMessageUtil("B\u1ea1n kh\xf4ng \u0111\u1ee7 ti\u1ec1n v\xe0o ph\xf2ng!");
          return void(GameConfigManager.default.getInstance().isShowPopupDone = false);
        }
        if (this.isHpwd) {
          CommonPrefabsManager.default.getInstance().showPopupPasswordTable();
        } else {
          CommonPrefabsManager.default.getInstance().showLoading();
          GamePlayManager.default.getInstance().joinRoom(this.data.rid, 0, "");
        }
      }
      MusicPlayer.default.getInstance().playbtnClick();
      GamePlayManager.default.getInstance().idTamBanMd5 = this.indextempe;
    };
    __decorate([property(cc.Label)], TableCellRoomXocDia.prototype, "lbMucCuoc", void 0);
    __decorate([property(cc.Label)], TableCellRoomXocDia.prototype, "lbSoNguoi", void 0);
    __decorate([property(cc.Label)], TableCellRoomXocDia.prototype, "lbMucTienCuocMin", void 0);
    __decorate([property(cc.Node)], TableCellRoomXocDia.prototype, "iconLock", void 0);
    __decorate([property(cc.ProgressBar)], TableCellRoomXocDia.prototype, "processBar", void 0);
    __decorate([property(cc.Node)], TableCellRoomXocDia.prototype, "iconBanXOcDia", void 0);
    __decorate([property(cc.Node)], TableCellRoomXocDia.prototype, "iconBanVip", void 0);
    __decorate([property(cc.Sprite)], TableCellRoomXocDia.prototype, "bgSprite", void 0);
    __decorate([property(sp.Skeleton)], TableCellRoomXocDia.prototype, "bgSpine", void 0);
    __decorate([property(cc.SpriteFrame)], TableCellRoomXocDia.prototype, "spriteBanChung", void 0);
    __decorate([property([cc.SpriteFrame])], TableCellRoomXocDia.prototype, "listspriteBanChungXocDia", void 0);
    return TableCellRoomXocDia = __decorate([ccclass], TableCellRoomXocDia);
  }(TableCell.default);
moduleExports.default = TableCellRoomXocDia;
void 0;
