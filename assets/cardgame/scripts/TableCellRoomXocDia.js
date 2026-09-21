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
  g = cc._decorator,
  m = g.ccclass,
  y = g.property,
  S = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.lbMucCuoc = null;
      e.lbSoNguoi = null;
      e.isHpwd = false;
      e.lbMucTienCuocMin = null;
      e.iconLock = null;
      e.processBar = null;
      e.iconBanXOcDia = null;
      e.iconBanVip = null;
      e.bgSprite = null;
      e.bgSpine = null;
      e.spriteBanChung = null;
      e.listspriteBanChungXocDia = [];
      e.listAnim = ["ANIMBANHO", "ANIMBANSU", "ANIMBANPHUNG"];
      e.listAnimBanThuong = ["ANIMBANLONG"];
      e.indextempe = 0;
      e.oldTienCuocToiThieu = 0;
      return e;
    }
    n(e, t);
    e.prototype.initValue = function(e, i) {
      if (t.prototype.initValue.call(this, e, i), this.isHpwd = e.hpwd, this.lbMucCuoc.string = StringUtil.default.formatMoneyNumber(e.b), this
        .lbSoNguoi.string = Math.max(0, e.uC) + "/" + e.Mu, null !== e.jpa && void 0 !== e.jpa || (this.lbMucTienCuocMin.string = StringUtil
          .default.formatMoneyNumber(e.mM)), this.iconLock.active = e.hpwd, this.processBar.progress = e.uC / e.Mu, this.lbMucTienCuocMin
        .node.x = 22, e.Mu >= 1e3 && GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.XOCDIA) {
        this.lbMucCuoc.node.active = false;
        this.lbSoNguoi.string = Math.max(0, e.uC).toString();
        this.processBar.progress = 0;
        if (null !== e.jpa && void 0 !== e.jpa) {
          GameUtils.runAnimationMoneyWithColom(this.lbMucTienCuocMin, this.oldTienCuocToiThieu, e.jpa, 4.5);
          this.oldTienCuocToiThieu = e.jpa;
          this.lbMucTienCuocMin.node.x = 27;
        } else {
          this.lbMucTienCuocMin.string = StringUtil.default.formatMoneyNumberWithColom(this.oldTienCuocToiThieu);
        }
        if (null !== this.iconBanXOcDia && void 0 !== this.iconBanXOcDia) {
          this.iconBanXOcDia.active = true;
          this.iconBanXOcDia.width = 186 * (.3 + Math.min(.5, e.uC / 600));
        }
        var n = false;
        this.indextempe = 0;
        if (this.index < GameConfigManager.default.getInstance().listImageXDBanChung.length) {
          this.indextempe = GameConfigManager.default.getInstance().listImageXDBanChung[this.index];
          n = this.indextempe < 0;
          this.indextempe = Math.abs(this.indextempe) - 1;
          if (n) {
            this.bgSprite.node.active = false;
            if (false === this.bgSpine.node.active) {
              this.bgSpine.node.active = true;
            }
            if (this.indextempe < this.listAnim.length) {
              this.setRoomAnim(this.listAnim[this.indextempe]);
              GamePlayManager.default.getInstance().setXocDiaIconBG(this.listAnim[this.indextempe], e.rid);
            }
          } else {
            if (this.indextempe < this.listAnimBanThuong.length) {
              this.setRoomAnim(this.listAnimBanThuong[this.indextempe]);
              GamePlayManager.default.getInstance().setXocDiaIconBG(this.listAnimBanThuong[this.indextempe], e.rid);
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
        if (e.b > GameConfigManager.default.getInstance().banVipMinBet) {
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
    e.prototype.setRoomAnim = function(t) {
      this.bgSprite.node.active = false;
      if (false === this.bgSpine.node.active) {
        this.bgSpine.node.active = true;
      }
      if (!StringUtil.default.isNullOrEmpty(t)) {
        this.bgSpine.setAnimation(0, t, true);
      }
    };
    e.prototype.onClickChoseRoom = function() {
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
    o([y(cc.Label)], e.prototype, "lbMucCuoc", void 0);
    o([y(cc.Label)], e.prototype, "lbSoNguoi", void 0);
    o([y(cc.Label)], e.prototype, "lbMucTienCuocMin", void 0);
    o([y(cc.Node)], e.prototype, "iconLock", void 0);
    o([y(cc.ProgressBar)], e.prototype, "processBar", void 0);
    o([y(cc.Node)], e.prototype, "iconBanXOcDia", void 0);
    o([y(cc.Node)], e.prototype, "iconBanVip", void 0);
    o([y(cc.Sprite)], e.prototype, "bgSprite", void 0);
    o([y(sp.Skeleton)], e.prototype, "bgSpine", void 0);
    o([y(cc.SpriteFrame)], e.prototype, "spriteBanChung", void 0);
    o([y([cc.SpriteFrame])], e.prototype, "listspriteBanChungXocDia", void 0);
    return e = o([m], e);
  }(TableCell.default);
i.default = S;
void 0;
