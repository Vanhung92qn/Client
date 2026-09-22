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
var a = require("TableCell"),
  s = require("GamePlayManager"),
  r = require("MessageCardGameHandler"),
  c = require("CommonPrefabsManager"),
  l = require("StringUtil"),
  h = require("MusicPlayer"),
  u = require("GameConfigManager"),
  d = require("AnalyticService"),
  p = require("AnalyticDefine"),
  f = cc._decorator,
  g = f.ccclass,
  m = f.property,
  y = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.spriteBanRieng = null;
      e.spriteBanChung = null;
      e.lbMucCuoc = null;
      e.lbSoNguoi = null;
      e.lbRoomId = null;
      e.lbMaxUser = null;
      e.isHpwd = false;
      return e;
    }
    n(e, t);
    e.prototype.initValue = function(e, i) {
      t.prototype.initValue.call(this, e, i);
      this.lbMucCuoc.string = l.default.formatMoneyNumber(e.b);
      if (e.hpwd) {
        this.lbSoNguoi.node.active = false;
        this.lbRoomId.node.active = true;
        this.lbRoomId.string = e.rid;
        this.lbMaxUser.string = "RI\xcaNG " + e.Mu;
        this.lbMaxUser.node.color = new cc.Color(45, 150, 180, 255);
        this.node.getComponent(cc.Sprite).spriteFrame = this.spriteBanRieng;
      } else {
        this.lbSoNguoi.node.active = true;
        this.lbRoomId.node.active = false;
        this.lbSoNguoi.string = Math.max(0, e.uC).toString();
        this.lbSoNguoi.node.x = -50;
        this.lbMucCuoc.node.active = true;
        this.lbMaxUser.node.active = true;
        this.lbSoNguoi.node.x = -50;
        this.node.getComponent(cc.Sprite).spriteFrame = this.spriteBanChung;
        if (2 === e.Mu) {
          this.lbMaxUser.string = "SOLO";
          this.lbMaxUser.node.color = new cc.Color(255, 255, 255, 255);
        } else {
          this.lbMaxUser.string = e.Mu + " NG\u01af\u1edcI";
          this.lbMaxUser.node.color = new cc.Color(255, 255, 255, 255);
        }
      }
      this.isHpwd = e.hpwd;
    };
    e.prototype.onClickChoseRoom = function() {
      var t = this;
      if (s.default.getInstance().gameID === r.GAME.POKER || s.default.getInstance().gameID === r.GAME.LIENG || s.default.getInstance()
        .gameID === r.GAME.XITO) {
        ;
      } else if (s.default.getInstance().gold < this.data.mM && this.data.Mu < 1e3) {
        c.default.getInstance().showPopupMessageUtil("B\u1ea1n kh\xf4ng \u0111\u1ee7 ti\u1ec1n v\xe0o ph\xf2ng!");
        return void(u.default.getInstance().isShowPopupDone = false);
      }
      d.default.instance.trackCustomQ(p.AnaltyciEventType.CLICK, "join_cg_" + s.default.getInstance().gameID);
      s.default.getInstance().checkMinMoney(this.data.b, s.default.getInstance().gameID, true, function() {
        s.default.getInstance().roomID = t.data.rid;
        if (-1 === t.data.rid) {
          c.default.getInstance().showLoading();
          s.default.getInstance().requestcreateRoom(s.default.getInstance().gameID, t.data.b, t.data.Mu);
        } else {
          if (s.default.getInstance().gameID === r.GAME.POKER || s.default.getInstance().gameID === r.GAME.LIENG || s.default
            .getInstance().gameID === r.GAME.XITO) {
            s.default.getInstance().bookRoom(t.data.rid, 0, "");
            c.default.getInstance().showLoading();
          } else {
            if (t.isHpwd) {
              c.default.getInstance().showPopupPasswordTable();
            } else {
              c.default.getInstance().showLoading();
              s.default.getInstance().joinRoom(t.data.rid, 0, "");
            }
          }
        }
      });
      h.default.getInstance().playbtnClick();
    };
    o([m(cc.SpriteFrame)], e.prototype, "spriteBanRieng", void 0);
    o([m(cc.SpriteFrame)], e.prototype, "spriteBanChung", void 0);
    o([m(cc.Label)], e.prototype, "lbMucCuoc", void 0);
    o([m(cc.Label)], e.prototype, "lbSoNguoi", void 0);
    o([m(cc.Label)], e.prototype, "lbRoomId", void 0);
    o([m(cc.Label)], e.prototype, "lbMaxUser", void 0);
    return e = o([g], e);
  }(a.default);
i.default = y;
void 0;
