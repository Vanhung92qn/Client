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
  HeaderUi = require("./HeaderUi"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  GameConfigManager = require("./GameConfigManager"),
  MusicPlayer = require("./MusicPlayer"),
  CardGameCommonRequest = require("./CardGameCommonRequest"),
  TableListRoomChongQuayNew = require("./TableListRoomChongQuayNew"),
  RMCThemeConfig = require("./RMCThemeConfig"),
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
      this.tableListRoomChongQuay = this.nodeListRoomUI.getComponent(TableListRoomChongQuayNew.default);
      this.listRoomCWidget = this.nodeListRoomUI.getComponent(cc.Widget);
      this.nodeListRoomUI.parent = this.tableViewNode;
      var t = cc.instantiate(this.prefabHeaderUI);
      t.parent = this.node;
      t.getComponent(HeaderUi.default);
      this.headerWidget = t.getComponent(cc.Widget);
      this.gameID = GamePlayManager.default.getInstance().gameID;
      var e = 1;
      switch (this.gameID) {
        case MessageCardGameHandler.GAME.XOCDIA:
          GamePlayManager.default.getInstance().gameIDIcon = "xoc-dia@2x";
          this.tableListRoomChongQuay.avtiveTab(false, false, false, false, false, false, false);
          e = .74;
          break;
        case MessageCardGameHandler.GAME.BINH:
          GamePlayManager.default.getInstance().gameIDIcon = "mau-binh@2x";
          this.tableListRoomChongQuay.avtiveTab(false, false, true, false, false, false, false);
          this.isChongQuay = true;
          break;
        case MessageCardGameHandler.GAME.POKER:
          GamePlayManager.default.getInstance().gameIDIcon = "poker@2x";
          this.tableListRoomChongQuay.avtiveTab(false, false, false, false, false, false, false);
          break;
        case MessageCardGameHandler.GAME.XITO:
          GamePlayManager.default.getInstance().gameIDIcon = "xi-to@2x";
          this.tableListRoomChongQuay.avtiveTab(false, false, false, false, false, false, false);
          break;
        case MessageCardGameHandler.GAME.PHOM:
          GamePlayManager.default.getInstance().gameIDIcon = "phom@2x";
          this.tableListRoomChongQuay.avtiveTab(false, false, true, false, false, false, false);
          this.isChongQuay = true;
          break;
        case MessageCardGameHandler.GAME.TLMN:
          GamePlayManager.default.getInstance().gameIDIcon = "tielenmiennam@2x";
          this.tableListRoomChongQuay.avtiveTab(true, false, true, false, false, false, false);
          this.isChongQuay = true;
          break;
        case MessageCardGameHandler.GAME.TIENLEN:
          GamePlayManager.default.getInstance().gameIDIcon = "tien-len-dem-la@2x";
          this.tableListRoomChongQuay.avtiveTab(true, false, true, false, false, false, false);
          this.isChongQuay = true;
          break;
        case MessageCardGameHandler.GAME.SAM:
          GamePlayManager.default.getInstance().gameIDIcon = "sam@2x";
          this.tableListRoomChongQuay.avtiveTab(true, false, false, true, false, false, false);
          this.isChongQuay = true;
          break;
        case MessageCardGameHandler.GAME.LIENG:
          GamePlayManager.default.getInstance().gameIDIcon = "lieng@2x";
          this.tableListRoomChongQuay.avtiveTab(false, false, false, false, false, false, false);
          break;
        case MessageCardGameHandler.GAME.BACAY:
          GamePlayManager.default.getInstance().gameIDIcon = "37";
          this.tableListRoomChongQuay.avtiveTab(false, false, false, false, false, false, false);
          break;
        case MessageCardGameHandler.GAME.CATTE:
          GamePlayManager.default.getInstance().gameIDIcon = "catte@2x";
          this.tableListRoomChongQuay.avtiveTab(true, false, false, false, false, false, true);
          this.isChongQuay = true;
          break;
        case MessageCardGameHandler.GAME.BAU_CUA:
          GamePlayManager.default.getInstance().gameIDIcon = "bau-cua@2x";
          this.tableListRoomChongQuay.avtiveTab(false, false, false, false, true, true, false);
          break;
        case MessageCardGameHandler.GAME.SICBO:
          GamePlayManager.default.getInstance().gameIDIcon = "Banner3";
          this.tableListRoomChongQuay.avtiveTab(false, false, false, false, false, false, false);
          this.tableListRoomChongQuay.tabButtonSkeleton[0].node.active = false;
          this.tableListRoomChongQuay.tabButtonSkeleton[1].node.active = false;
      }
      if (null !== this.iconSpriteAtlas && void 0 !== this.iconSpriteAtlas && null !== GamePlayManager.default.getInstance().gameIDIcon && void 0 !== GamePlayManager
        .default.getInstance().gameIDIcon) {
        var i = this.iconSpriteAtlas.getSpriteFrame(GamePlayManager.default.getInstance().gameIDIcon);
        if (null !== i && void 0 !== i) {
          this.iconGameName.spriteFrame = i;
          this.iconGameName.node.scale = e;
        }
      }
      this.applyRoomConfig();
      var n = RMCThemeConfig.getCurrentTheme();
      if (this.nodeNoelDecoration.length > 0) {
        for (var o = 0; o < this.nodeNoelDecoration.length; o++) {
          this.nodeNoelDecoration[o].active = n == RMCThemeConfig.ThemeType.NOEL;
        }
      }
      if (GamePlayManager.default.getInstance().gameID == MessageCardGameHandler.GAME.BINH && (CardGameCommonRequest.default.getInstance().fetchSettingRoom(), this.btnSetting)) {
        this.btnSetting.active = GameConfigManager.default.getInstance().isNewXepBaiMauBinh;
        var r = this.btnSetting.parent.getComponent(cc.Layout);
        if (r && this.btnSetting.active) {
          r.paddingTop = 92;
        }
      }
    };
    e.prototype.applyRoomConfig = function() {
      var t = GamePlayManager.default.getInstance().gameID;
      if (GameConfigManager.default.getInstance().roomChongQuaySettings.has(t)) {
        var e = GameConfigManager.default.getInstance().roomChongQuaySettings.get(t);
        this.btnJoinRoom.active = e.useButtonJoinRoom;
        this.btnQuickPlay.active = !e.useButtonJoinRoom;
      }
    };
    e.prototype.onEnable = function() {
      GameConfigManager.default.getInstance().isLobbyMusicBg = true;
      CommonPrefabsManager.default.getInstance().closePopup(true);
    };
    e.prototype.walkUp = function(t) {
      this.mainGameViewModel = t;
      this.node.active = true;
      this.mainGameViewModel.headerUi = this.headerUI;
    };
    e.prototype.onClickChoiNhanh = function() {
      var t = this;
      if (!GameConfigManager.default.getInstance().isShowPopupDone) {
        GameConfigManager.default.getInstance().isShowPopupDone = true;
        CommonPrefabsManager.default.getInstance().showLoading();
        this.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
          if (t.gameID === MessageCardGameHandler.GAME.LIENG || t.gameID === MessageCardGameHandler.GAME.XITO || t.gameID === MessageCardGameHandler.GAME.POKER) {
            GamePlayManager.default.getInstance().requestquickPlayBet(GamePlayManager.default.getInstance().gameID, GameConfigManager.default.getInstance().bet);
          } else if (t.gameID === MessageCardGameHandler.GAME.XOCDIA && GamePlayManager.default.getInstance().gold < 100) {
            var e = 0;
            if (null !== t.tableListRoomChongQuay && void 0 !== t.tableListRoomChongQuay && null !== t.tableListRoomChongQuay
              .listRoom && void 0 !== t.tableListRoomChongQuay.listRoom && t.tableListRoomChongQuay.listRoom.length > 0) {
              e = t.tableListRoomChongQuay.listRoom[0].rid;
            }
            if (e > 0) {
              GamePlayManager.default.getInstance().joinRoom(e, 0, "");
            } else {
              GamePlayManager.default.getInstance().requestquickPlay(GamePlayManager.default.getInstance().gameID);
            }
          } else {
            GamePlayManager.default.getInstance().requestquickPlay(GamePlayManager.default.getInstance().gameID);
          }
        })));
        MusicPlayer.default.getInstance().playbtnClick();
      }
    };
    e.prototype.onClickTaoBan = function() {
      if (!GameConfigManager.default.getInstance().isShowPopupDone) {
        GameConfigManager.default.getInstance().isShowPopupDone = true;
        CommonPrefabsManager.default.getInstance().showLoading();
        this.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
          GamePlayManager.default.getInstance().requestcreateRoomResponse(GamePlayManager.default.getInstance().gameID);
        })));
        MusicPlayer.default.getInstance().playbtnClick();
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
        this.timeReLoadTablleCountDown = GameConfigManager.default.getInstance().timeRefreshListRoomChongQuay;
      } else {
        this.timeReLoadTablleCountDown = GameConfigManager.default.getInstance().timeRefreshListRoom;
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
          CardGameCommonRequest.default.getInstance().GetListRoom();
          this.isFade = false;
        }
      }
    };
    e.prototype.onClickHelp = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      CommonPrefabsManager.default.getInstance().showPopupHelpImage(GamePlayManager.default.getInstance().gameID);
    };
    e.prototype.onClickTinTuc = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      CommonPrefabsManager.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
    };
    e.prototype.onClickXepHang = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      CommonPrefabsManager.default.getInstance().showPopupXepHangGame(GamePlayManager.default.getInstance().gameID);
    };
    e.prototype.onClickSetting = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      CommonPrefabsManager.default.getInstance().showPopupSetting();
    };
    e.prototype.onClickJoinRoom = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      CommonPrefabsManager.default.getInstance().showPopupJoinRoom();
    };
    o([m(cc.Node)], e.prototype, "tableViewNode", void 0);
    o([m(cc.Prefab)], e.prototype, "prefabListRoomUI", void 0);
    o([m(cc.Prefab)], e.prototype, "prefabHeaderUI", void 0);
    o([m(HeaderUi.default)], e.prototype, "headerUI", void 0);
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
