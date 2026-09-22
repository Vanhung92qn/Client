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
var a = require("MainGameViewModel"),
  s = require("GamePlayManager"),
  r = require("MessageCardGameHandler"),
  c = require("MauBinhController"),
  l = require("GameConfigManager"),
  h = require("CommonPrefabsManager"),
  u = require("MiniGameNode"),
  d = require("CardPopupBase");
i.KEY_MAU_BINH_SORT_NEW_CARD_INTRODUCE = "KEY_MAU_BINH_SORT_NEW_CARD_INTRODUCE";
var p = cc._decorator,
  f = p.ccclass,
  g = p.property,
  m = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.mauBinhController = null;
      e.prefabMauBinhController = null;
      e.isNeedShowIntroduceNewSortWhenBackToRoom = false;
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {
      s.default.getInstance().gameID = r.GAME.BINH;
      var e = cc.instantiate(this.prefabMauBinhController);
      e.parent = this.mainUiNode;
      this.mauBinhController = e.getComponent(c.default);
      this.mainGameController = this.mauBinhController;
      e.active = false;
      t.prototype.onLoad.call(this);
    };
    e.prototype.loadIntroduceNewXepBai = function(t) {
      if (void 0 === t && (t = false), l.default.getInstance().isNewXepBaiMauBinh) {
        if ((Date.now() - s.default.getInstance().timeInvite) / 1e3 < 5 && !t) {
          return void(this.isNeedShowIntroduceNewSortWhenBackToRoom = true);
        }
        this.isNeedShowIntroduceNewSortWhenBackToRoom = false;
        h.default.getInstance().showLoading();
        cc.loader.loadRes("Popup/PopupIntroduceXepBaiMauBinh", function(t, e) {
          if (null === e) {
            h.default.getInstance().hideLoading();
          } else {
            var n = cc.instantiate(e);
            n.parent = u.default.instance.popupNode;
            n.x = 0;
            n.y = 0;
            n.getComponent(d.default).show();
            h.default.getInstance().hideLoading();
            cc.sys.localStorage.setItem(i.KEY_MAU_BINH_SORT_NEW_CARD_INTRODUCE, "true");
          }
        });
      }
    };
    e.prototype.fetchSettingLobbyRoom = function(t) {
      if (t.hasOwnProperty("nArr")) {
        s.default.getInstance().IsMauBinhUsingNewXepBai = t.nArr;
      }
      if (t.hasOwnProperty("fPNArr")) {
        s.default.getInstance().IsMauBinhFistTimeShowQuickGuide = t.fINArr;
      }
      if (t.hasOwnProperty("fINArr") && 1 == t.fINArr) {
        this.loadIntroduceNewXepBai();
      }
    };
    e.prototype.showGameList = function(e) {
      if (this.isNeedShowIntroduceNewSortWhenBackToRoom) {
        this.loadIntroduceNewXepBai(true);
      }
      t.prototype.showGameList.call(this, e);
    };
    o([g(cc.Prefab)], e.prototype, "prefabMauBinhController", void 0);
    return e = o([f], e);
  }(a.default);
i.default = m;
void 0;
