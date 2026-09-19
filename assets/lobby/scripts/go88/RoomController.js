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
var a = t("./GamePlayManager"),
  s = t("./HeaderUi"),
  r = t("./CommonPrefabsManager"),
  c = t("./MessageCardGameHandler"),
  l = t("./GameConfigManager"),
  h = t("./MusicPlayer"),
  u = t("./CardGameCommonRequest"),
  d = t("./TableListRoomChongQuayNew"),
  p = t("./RMCThemeConfig"),
  f = cc._decorator,
  g = f.ccclass,
  m = f.property,
  y = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.mainGameViewModel = null;
      e.tableViewNode = null;
      e.prefabListRoomUI = null;
      e.prefabHeaderUI = null;
      e.nodeListRoomUI = null;
      e.headerUI = null;
      e.gameID = null;
      e.iconGameName = null;
      e.iconSpriteAtlas = null;
      e.btnQuickPlay = null;
      e.btnJoinRoom = null;
      e.btnSetting = null;
      e.nodeNoelDecoration = [];
      e.tableListRoomChongQuay = null;
      e.isFade = true;
      e.timeReLoadTablleCountDown = -1;
      e.headerWidget = null;
      e.listRoomCWidget = null;
      e.isChongQuay = false;
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {
      this.nodeListRoomUI = cc.instantiate(this.prefabListRoomUI);
      this.tableListRoomChongQuay = this.nodeListRoomUI.getComponent(d.default);
      this.listRoomCWidget = this.nodeListRoomUI.getComponent(cc.Widget);
      this.nodeListRoomUI.parent = this.tableViewNode;
      var t = cc.instantiate(this.prefabHeaderUI);
      t.parent = this.node;
      t.getComponent(s.default);
      this.headerWidget = t.getComponent(cc.Widget);
      this.gameID = a.default.getInstance().gameID;
      var e = 1;
      switch (this.gameID) {
        case c.GAME.XOCDIA:
          a.default.getInstance().gameIDIcon = "xoc-dia@2x";
          this.tableListRoomChongQuay.avtiveTab(false, false, false, false, false, false, false);
          e = .74;
          break;
        case c.GAME.BINH:
          a.default.getInstance().gameIDIcon = "mau-binh@2x";
          this.tableListRoomChongQuay.avtiveTab(false, false, true, false, false, false, false);
          this.isChongQuay = true;
          break;
        case c.GAME.POKER:
          a.default.getInstance().gameIDIcon = "poker@2x";
          this.tableListRoomChongQuay.avtiveTab(false, false, false, false, false, false, false);
          break;
        case c.GAME.XITO:
          a.default.getInstance().gameIDIcon = "xi-to@2x";
          this.tableListRoomChongQuay.avtiveTab(false, false, false, false, false, false, false);
          break;
        case c.GAME.PHOM:
          a.default.getInstance().gameIDIcon = "phom@2x";
          this.tableListRoomChongQuay.avtiveTab(false, false, true, false, false, false, false);
          this.isChongQuay = true;
          break;
        case c.GAME.TLMN:
          a.default.getInstance().gameIDIcon = "tielenmiennam@2x";
          this.tableListRoomChongQuay.avtiveTab(true, false, true, false, false, false, false);
          this.isChongQuay = true;
          break;
        case c.GAME.TIENLEN:
          a.default.getInstance().gameIDIcon = "tien-len-dem-la@2x";
          this.tableListRoomChongQuay.avtiveTab(true, false, true, false, false, false, false);
          this.isChongQuay = true;
          break;
        case c.GAME.SAM:
          a.default.getInstance().gameIDIcon = "sam@2x";
          this.tableListRoomChongQuay.avtiveTab(true, false, false, true, false, false, false);
          this.isChongQuay = true;
          break;
        case c.GAME.LIENG:
          a.default.getInstance().gameIDIcon = "lieng@2x";
          this.tableListRoomChongQuay.avtiveTab(false, false, false, false, false, false, false);
          break;
        case c.GAME.BACAY:
          a.default.getInstance().gameIDIcon = "37";
          this.tableListRoomChongQuay.avtiveTab(false, false, false, false, false, false, false);
          break;
        case c.GAME.CATTE:
          a.default.getInstance().gameIDIcon = "catte@2x";
          this.tableListRoomChongQuay.avtiveTab(true, false, false, false, false, false, true);
          this.isChongQuay = true;
          break;
        case c.GAME.BAU_CUA:
          a.default.getInstance().gameIDIcon = "bau-cua@2x";
          this.tableListRoomChongQuay.avtiveTab(false, false, false, false, true, true, false);
          break;
        case c.GAME.SICBO:
          a.default.getInstance().gameIDIcon = "Banner3";
          this.tableListRoomChongQuay.avtiveTab(false, false, false, false, false, false, false);
          this.tableListRoomChongQuay.tabButtonSkeleton[0].node.active = false;
          this.tableListRoomChongQuay.tabButtonSkeleton[1].node.active = false;
      }
      if (null !== this.iconSpriteAtlas && void 0 !== this.iconSpriteAtlas && null !== a.default.getInstance().gameIDIcon && void 0 !== a
        .default.getInstance().gameIDIcon) {
        var i = this.iconSpriteAtlas.getSpriteFrame(a.default.getInstance().gameIDIcon);
        if (null !== i && void 0 !== i) {
          this.iconGameName.spriteFrame = i;
          this.iconGameName.node.scale = e;
        }
      }
      this.applyRoomConfig();
      var n = p.getCurrentTheme();
      if (this.nodeNoelDecoration.length > 0) {
        for (var o = 0; o < this.nodeNoelDecoration.length; o++) {
          this.nodeNoelDecoration[o].active = n == p.ThemeType.NOEL;
        }
      }
      if (a.default.getInstance().gameID == c.GAME.BINH && (u.default.getInstance().fetchSettingRoom(), this.btnSetting)) {
        this.btnSetting.active = l.default.getInstance().isNewXepBaiMauBinh;
        var r = this.btnSetting.parent.getComponent(cc.Layout);
        if (r && this.btnSetting.active) {
          r.paddingTop = 92;
        }
      }
    };
    e.prototype.applyRoomConfig = function() {
      var t = a.default.getInstance().gameID;
      if (l.default.getInstance().roomChongQuaySettings.has(t)) {
        var e = l.default.getInstance().roomChongQuaySettings.get(t);
        this.btnJoinRoom.active = e.useButtonJoinRoom;
        this.btnQuickPlay.active = !e.useButtonJoinRoom;
      }
    };
    e.prototype.onEnable = function() {
      l.default.getInstance().isLobbyMusicBg = true;
      r.default.getInstance().closePopup(true);
    };
    e.prototype.walkUp = function(t) {
      this.mainGameViewModel = t;
      this.node.active = true;
      this.mainGameViewModel.headerUi = this.headerUI;
    };
    e.prototype.onClickChoiNhanh = function() {
      var t = this;
      if (!l.default.getInstance().isShowPopupDone) {
        l.default.getInstance().isShowPopupDone = true;
        r.default.getInstance().showLoading();
        this.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
          if (t.gameID === c.GAME.LIENG || t.gameID === c.GAME.XITO || t.gameID === c.GAME.POKER) {
            a.default.getInstance().requestquickPlayBet(a.default.getInstance().gameID, l.default.getInstance().bet);
          } else if (t.gameID === c.GAME.XOCDIA && a.default.getInstance().gold < 100) {
            var e = 0;
            if (null !== t.tableListRoomChongQuay && void 0 !== t.tableListRoomChongQuay && null !== t.tableListRoomChongQuay
              .listRoom && void 0 !== t.tableListRoomChongQuay.listRoom && t.tableListRoomChongQuay.listRoom.length > 0) {
              e = t.tableListRoomChongQuay.listRoom[0].rid;
            }
            if (e > 0) {
              a.default.getInstance().joinRoom(e, 0, "");
            } else {
              a.default.getInstance().requestquickPlay(a.default.getInstance().gameID);
            }
          } else {
            a.default.getInstance().requestquickPlay(a.default.getInstance().gameID);
          }
        })));
        h.default.getInstance().playbtnClick();
      }
    };
    e.prototype.onClickTaoBan = function() {
      if (!l.default.getInstance().isShowPopupDone) {
        l.default.getInstance().isShowPopupDone = true;
        r.default.getInstance().showLoading();
        this.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
          a.default.getInstance().requestcreateRoomResponse(a.default.getInstance().gameID);
        })));
        h.default.getInstance().playbtnClick();
      }
    };
    e.prototype.updateRoom = function(t) {
      if (null !== this.tableListRoomChongQuay && void 0 !== this.tableListRoomChongQuay) {
        if (this.isFade) {
          this.isFade = false;
          this.tableListRoomChongQuay.animShow();
          this.tableListRoomChongQuay.updateListFull(t.rs, t.pR, t.srs, true);
        } else {
          this.tableListRoomChongQuay.scrollView.node.opacity = 255;
          this.tableListRoomChongQuay.updateListFull(t.rs, t.pR, t.srs, false);
        }
      }
      if (this.isChongQuay) {
        this.timeReLoadTablleCountDown = l.default.getInstance().timeRefreshListRoomChongQuay;
      } else {
        this.timeReLoadTablleCountDown = l.default.getInstance().timeRefreshListRoom;
      }
    };
    e.prototype.showNode = function() {
      this.node.active = true;
    };
    e.prototype.hideNode = function() {
      this.node.active = false;
    };
    e.prototype.update = function(t) {
      if (this.timeReLoadTablleCountDown > 0) {
        this.timeReLoadTablleCountDown -= t;
        if (this.timeReLoadTablleCountDown <= 0) {
          u.default.getInstance().GetListRoom();
          this.isFade = false;
        }
      }
    };
    e.prototype.onClickHelp = function() {
      h.default.getInstance().playbtnClick();
      r.default.getInstance().showPopupHelpImage(a.default.getInstance().gameID);
    };
    e.prototype.onClickTinTuc = function() {
      h.default.getInstance().playbtnClick();
      r.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
    };
    e.prototype.onClickXepHang = function() {
      h.default.getInstance().playbtnClick();
      r.default.getInstance().showPopupXepHangGame(a.default.getInstance().gameID);
    };
    e.prototype.onClickSetting = function() {
      h.default.getInstance().playbtnClick();
      r.default.getInstance().showPopupSetting();
    };
    e.prototype.onClickJoinRoom = function() {
      h.default.getInstance().playbtnClick();
      r.default.getInstance().showPopupJoinRoom();
    };
    o([m(cc.Node)], e.prototype, "tableViewNode", void 0);
    o([m(cc.Prefab)], e.prototype, "prefabListRoomUI", void 0);
    o([m(cc.Prefab)], e.prototype, "prefabHeaderUI", void 0);
    o([m(s.default)], e.prototype, "headerUI", void 0);
    o([m(cc.Sprite)], e.prototype, "iconGameName", void 0);
    o([m(cc.SpriteAtlas)], e.prototype, "iconSpriteAtlas", void 0);
    o([m(cc.Node)], e.prototype, "btnQuickPlay", void 0);
    o([m(cc.Node)], e.prototype, "btnJoinRoom", void 0);
    o([m(cc.Node)], e.prototype, "btnSetting", void 0);
    o([m([cc.Node])], e.prototype, "nodeNoelDecoration", void 0);
    return e = o([g], e);
  }(cc.Component);
i.default = y;
void 0;
