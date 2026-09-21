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
  HeaderUi = require("./HeaderUi"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  GameConfigManager = require("./GameConfigManager"),
  MusicPlayer = require("./MusicPlayer"),
  CardGameCommonRequest = require("./CardGameCommonRequest"),
  TableListRoomChongQuayNew = require("./TableListRoomChongQuayNew"),
  RMCThemeConfig = require("./RMCThemeConfig"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  RoomController = function(_super) {
    function RoomController() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.mainGameViewModel = null;
      _this.tableViewNode = null;
      _this.prefabListRoomUI = null;
      _this.prefabHeaderUI = null;
      _this.nodeListRoomUI = null;
      _this.headerUI = null;
      _this.gameID = null;
      _this.iconGameName = null;
      _this.iconSpriteAtlas = null;
      _this.btnQuickPlay = null;
      _this.btnJoinRoom = null;
      _this.btnSetting = null;
      _this.nodeNoelDecoration = [];
      _this.tableListRoomChongQuay = null;
      _this.isFade = true;
      _this.timeReLoadTablleCountDown = -1;
      _this.headerWidget = null;
      _this.listRoomCWidget = null;
      _this.isChongQuay = false;
      return _this;
    }
    __extends(RoomController, _super);
    RoomController.prototype.onLoad = function() {
      this.nodeListRoomUI = cc.instantiate(this.prefabListRoomUI);
      this.tableListRoomChongQuay = this.nodeListRoomUI.getComponent(TableListRoomChongQuayNew.default);
      this.listRoomCWidget = this.nodeListRoomUI.getComponent(cc.Widget);
      this.nodeListRoomUI.parent = this.tableViewNode;
      var headerNode = cc.instantiate(this.prefabHeaderUI);
      headerNode.parent = this.node;
      headerNode.getComponent(HeaderUi.default);
      this.headerWidget = headerNode.getComponent(cc.Widget);
      this.gameID = GamePlayManager.default.getInstance().gameID;
      var iconScale = 1;
      switch (this.gameID) {
        case MessageCardGameHandler.GAME.XOCDIA:
          GamePlayManager.default.getInstance().gameIDIcon = "xoc-dia@2x";
          this.tableListRoomChongQuay.avtiveTab(false, false, false, false, false, false, false);
          iconScale = .74;
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
        var iconSpriteFrame = this.iconSpriteAtlas.getSpriteFrame(GamePlayManager.default.getInstance().gameIDIcon);
        if (null !== iconSpriteFrame && void 0 !== iconSpriteFrame) {
          this.iconGameName.spriteFrame = iconSpriteFrame;
          this.iconGameName.node.scale = iconScale;
        }
      }
      this.applyRoomConfig();
      var currentTheme = RMCThemeConfig.getCurrentTheme();
      if (this.nodeNoelDecoration.length > 0) {
        for (var decorationIndex = 0; decorationIndex < this.nodeNoelDecoration.length; decorationIndex++) {
          this.nodeNoelDecoration[decorationIndex].active = currentTheme == RMCThemeConfig.ThemeType.NOEL;
        }
      }
      if (GamePlayManager.default.getInstance().gameID == MessageCardGameHandler.GAME.BINH && (CardGameCommonRequest.default.getInstance().fetchSettingRoom(), this.btnSetting)) {
        this.btnSetting.active = GameConfigManager.default.getInstance().isNewXepBaiMauBinh;
        var settingLayout = this.btnSetting.parent.getComponent(cc.Layout);
        if (settingLayout && this.btnSetting.active) {
          settingLayout.paddingTop = 92;
        }
      }
    };
    RoomController.prototype.applyRoomConfig = function() {
      var gameID = GamePlayManager.default.getInstance().gameID;
      if (GameConfigManager.default.getInstance().roomChongQuaySettings.has(gameID)) {
        var roomSetting = GameConfigManager.default.getInstance().roomChongQuaySettings.get(gameID);
        this.btnJoinRoom.active = roomSetting.useButtonJoinRoom;
        this.btnQuickPlay.active = !roomSetting.useButtonJoinRoom;
      }
    };
    RoomController.prototype.onEnable = function() {
      GameConfigManager.default.getInstance().isLobbyMusicBg = true;
      CommonPrefabsManager.default.getInstance().closePopup(true);
    };
    RoomController.prototype.walkUp = function(mainGameViewModel) {
      this.mainGameViewModel = mainGameViewModel;
      this.node.active = true;
      this.mainGameViewModel.headerUi = this.headerUI;
    };
    RoomController.prototype.onClickChoiNhanh = function() {
      var _this = this;
      if (!GameConfigManager.default.getInstance().isShowPopupDone) {
        GameConfigManager.default.getInstance().isShowPopupDone = true;
        CommonPrefabsManager.default.getInstance().showLoading();
        this.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
          if (_this.gameID === MessageCardGameHandler.GAME.LIENG || _this.gameID === MessageCardGameHandler.GAME.XITO || _this.gameID === MessageCardGameHandler.GAME.POKER) {
            GamePlayManager.default.getInstance().requestquickPlayBet(GamePlayManager.default.getInstance().gameID, GameConfigManager.default.getInstance().bet);
          } else if (_this.gameID === MessageCardGameHandler.GAME.XOCDIA && GamePlayManager.default.getInstance().gold < 100) {
            var roomID = 0;
            if (null !== _this.tableListRoomChongQuay && void 0 !== _this.tableListRoomChongQuay && null !== _this.tableListRoomChongQuay
              .listRoom && void 0 !== _this.tableListRoomChongQuay.listRoom && _this.tableListRoomChongQuay.listRoom.length > 0) {
              roomID = _this.tableListRoomChongQuay.listRoom[0].rid;
            }
            if (roomID > 0) {
              GamePlayManager.default.getInstance().joinRoom(roomID, 0, "");
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
    RoomController.prototype.onClickTaoBan = function() {
      if (!GameConfigManager.default.getInstance().isShowPopupDone) {
        GameConfigManager.default.getInstance().isShowPopupDone = true;
        CommonPrefabsManager.default.getInstance().showLoading();
        this.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
          GamePlayManager.default.getInstance().requestcreateRoomResponse(GamePlayManager.default.getInstance().gameID);
        })));
        MusicPlayer.default.getInstance().playbtnClick();
      }
    };
    RoomController.prototype.updateRoom = function(data) {
      if (null !== this.tableListRoomChongQuay && void 0 !== this.tableListRoomChongQuay) {
        if (this.isFade) {
          this.isFade = false;
          this.tableListRoomChongQuay.animShow();
          this.tableListRoomChongQuay.updateListFull(data.rs, data.pR, data.srs, true);
        } else {
          this.tableListRoomChongQuay.scrollView.node.opacity = 255;
          this.tableListRoomChongQuay.updateListFull(data.rs, data.pR, data.srs, false);
        }
      }
      if (this.isChongQuay) {
        this.timeReLoadTablleCountDown = GameConfigManager.default.getInstance().timeRefreshListRoomChongQuay;
      } else {
        this.timeReLoadTablleCountDown = GameConfigManager.default.getInstance().timeRefreshListRoom;
      }
    };
    RoomController.prototype.showNode = function() {
      this.node.active = true;
    };
    RoomController.prototype.hideNode = function() {
      this.node.active = false;
    };
    RoomController.prototype.update = function(dt) {
      if (this.timeReLoadTablleCountDown > 0) {
        this.timeReLoadTablleCountDown -= dt;
        if (this.timeReLoadTablleCountDown <= 0) {
          CardGameCommonRequest.default.getInstance().GetListRoom();
          this.isFade = false;
        }
      }
    };
    RoomController.prototype.onClickHelp = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      CommonPrefabsManager.default.getInstance().showPopupHelpImage(GamePlayManager.default.getInstance().gameID);
    };
    RoomController.prototype.onClickTinTuc = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      CommonPrefabsManager.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng s\u1eafp ra m\u1eaft !");
    };
    RoomController.prototype.onClickXepHang = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      CommonPrefabsManager.default.getInstance().showPopupXepHangGame(GamePlayManager.default.getInstance().gameID);
    };
    RoomController.prototype.onClickSetting = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      CommonPrefabsManager.default.getInstance().showPopupSetting();
    };
    RoomController.prototype.onClickJoinRoom = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      CommonPrefabsManager.default.getInstance().showPopupJoinRoom();
    };
    __decorate([property(cc.Node)], RoomController.prototype, "tableViewNode", void 0);
    __decorate([property(cc.Prefab)], RoomController.prototype, "prefabListRoomUI", void 0);
    __decorate([property(cc.Prefab)], RoomController.prototype, "prefabHeaderUI", void 0);
    __decorate([property(HeaderUi.default)], RoomController.prototype, "headerUI", void 0);
    __decorate([property(cc.Sprite)], RoomController.prototype, "iconGameName", void 0);
    __decorate([property(cc.SpriteAtlas)], RoomController.prototype, "iconSpriteAtlas", void 0);
    __decorate([property(cc.Node)], RoomController.prototype, "btnQuickPlay", void 0);
    __decorate([property(cc.Node)], RoomController.prototype, "btnJoinRoom", void 0);
    __decorate([property(cc.Node)], RoomController.prototype, "btnSetting", void 0);
    __decorate([property([cc.Node])], RoomController.prototype, "nodeNoelDecoration", void 0);
    return RoomController = __decorate([ccclass], RoomController);
  }(cc.Component);
moduleExports.default = RoomController;
void 0;
