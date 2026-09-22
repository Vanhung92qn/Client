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
var a = require("./StringUtil"),
  s = require("./GamePlayManager"),
  r = require("./MessageCardGameHandler"),
  c = require("./GameConfigManager"),
  l = require("./CommonPrefabsManager"),
  h = require("./MusicPlayer"),
  u = require("./TableCell"),
  d = require("./TextToImage"),
  p = require("./AnalyticDefine"),
  f = require("./AnalyticService"),
  g = cc._decorator,
  m = g.ccclass,
  y = g.property,
  S = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.processBar = null;
      e.nodeMucCuoc = null;
      e.nodeMinMax = null;
      e.nodeSoNguoi = null;
      e.iconLock = null;
      e.isHpwd = false;
      return e;
    }
    n(e, t);
    e.prototype.initValue = function(e, i) {
      t.prototype.initValue.call(this, e, i);
      var n = a.default.formatMoneyNumber(e.b);
      this.nodeMucCuoc.getComponent(d.default).loadImage(n);
      this.processBar.progress = e.uC / e.Mu;
      var o = a.default.formatMoneyNumber(e.mMBI) + "/" + a.default.formatMoneyNumber(e.MMBI);
      this.nodeMinMax.getComponent(d.default).loadImage(o);
      var c = Math.max(0, e.uC) + "/" + e.Mu;
      this.nodeSoNguoi.getComponent(d.default).loadImage(c);
      this.iconLock.active = e.hpwd;
      this.isHpwd = e.hpwd;
      if (!(s.default.getInstance().gameID === r.GAME.LIENG || s.default.getInstance().gameID === r.GAME.POKER)) {
        s.default.getInstance().gameID;
        r.GAME.XITO;
      }
    };
    e.prototype.onClickChoseRoom = function() {
      var t = this;
      if (s.default.getInstance().gameID === r.GAME.POKER || s.default.getInstance().gameID === r.GAME.LIENG || s.default.getInstance()
        .gameID === r.GAME.XITO) {
        ;
      } else if (s.default.getInstance().gold < this.data.mM && this.data.Mu < 1e3) {
        l.default.getInstance().showPopupMessageUtil("B\u1ea1n kh\xf4ng \u0111\u1ee7 ti\u1ec1n v\xe0o ph\xf2ng!");
        return void(c.default.getInstance().isShowPopupDone = false);
      }
      f.default.instance.trackCustomQ(p.AnaltyciEventType.CLICK, "join_cg_" + s.default.getInstance().gameID);
      s.default.getInstance().checkMinMoney(this.data.b, s.default.getInstance().gameID, true, function() {
        s.default.getInstance().roomID = t.data.rid;
        if (-1 === t.data.rid) {
          l.default.getInstance().showLoading();
          s.default.getInstance().requestcreateRoom(s.default.getInstance().gameID, t.data.b, t.data.Mu);
        } else {
          if (s.default.getInstance().gameID === r.GAME.POKER || s.default.getInstance().gameID === r.GAME.LIENG || s.default
            .getInstance().gameID === r.GAME.XITO) {
            s.default.getInstance().bookRoom(t.data.rid, 0, "");
            l.default.getInstance().showLoading();
          } else {
            if (t.isHpwd) {
              l.default.getInstance().showPopupPasswordTable();
            } else {
              l.default.getInstance().showLoading();
              s.default.getInstance().joinRoom(t.data.rid, 0, "");
            }
          }
        }
      });
      h.default.getInstance().playbtnClick();
    };
    o([y(cc.ProgressBar)], e.prototype, "processBar", void 0);
    o([y(cc.Node)], e.prototype, "nodeMucCuoc", void 0);
    o([y(cc.Node)], e.prototype, "nodeMinMax", void 0);
    o([y(cc.Node)], e.prototype, "nodeSoNguoi", void 0);
    o([y(cc.Node)], e.prototype, "iconLock", void 0);
    return e = o([m], e);
  }(u.default);
i.default = S;
void 0;
