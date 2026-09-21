var t = require,
  e = module,
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
var MessageCardGameHandler = require("./MessageCardGameHandler"),
  PlayerView = require("./PlayerView"),
  GamePlayManager = require("./GamePlayManager"),
  MessageCardGame = require("./MessageCardGameHandler"),
  StringUtil = require("./StringUtil"),
  GameZOrder = require("./GameZOrder"),
  CardGameCommonRequest = require("./CardGameCommonRequest"),
  GameConfigManager = require("./GameConfigManager"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  CardGameTableController = require("./CardGameTableController"),
  ErrorLogHandler = require("./ErrorLogHandler"),
  BetLabel = require("./BetLabel"),
  ListChatIconConfig = require("./ListChatIconConfig"),
  EmoScript = require("./EmoScript"),
  BaseScene = require("./BaseScene"),
  GameDefine = require("./GameDefine"),
  RoomMessageHandler = require("./RoomMessageHandler"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  colorChatMine = new cc.Color(61, 253, 255, 255),
  colorChatOther = new cc.Color(235, 118, 0, 255),
  colorChatSystem = new cc.Color(255, 45, 45, 255);
moduleExports.posOutScreen = new cc.Vec3(5e3, 5e3, 5e3);
var GameController = function(_super) {
  function GameController() {
    var _this = null !== _super && _super.apply(this, arguments) || this;
    _this.mainGameViewModel = null;
    _this.playerAvartaPrefabs = null;
    _this.btnInvitePrefabs = null;
    _this.prefabsGameCard = null;
    _this.listBtnInvitePos = [];
    _this.POS2 = [];
    _this.POS3 = [];
    _this.POS4 = [];
    _this.POS5 = [];
    _this.POS6 = [];
    _this.POS7 = [];
    _this.POS8 = [];
    _this.POS9 = [];
    _this.POS2_2 = [];
    _this.POS5_2 = [];
    _this.state = 0;
    _this.gameState = 1;
    _this.bet = 0;
    _this.isHost = false;
    _this.AllPlayers = {};
    _this.players = [];
    _this.playersPlaying = [];
    _this._outOfSightPlayers = [];
    _this.pendingJoinPlayers = [];
    _this.pendingRemovePlayers = [];
    _this._dangKetThuc = false;
    _this._dangXocDia = true;
    _this._ngungNhanCuoc = true;
    _this.tuDongGuiSanSang = false;
    _this.gameRutTien = false;
    _this.autoReady = false;
    _this._playedOnce = false;
    _this._joinedTable = false;
    _this._dangPhatBai = false;
    _this._subscribedToGetOut = false;
    _this._autoWithDrawMoney = false;
    _this._moneyToAutoWithdraw = 0;
    _this._daNgoi = true;
    _this._forcedQuit = false;
    _this._forcedToLeaveRoom = false;
    _this.loaded = false;
    _this._khongThaoTac = true;
    _this._soVanKhongThaoTac = 0;
    _this.isClickExit = false;
    _this.isDelayLeave = false;
    _this._incognito = false;
    _this.inviteBtns = [];
    _this.rutTienBtn = null;
    _this.scalePlayerViewMine = .9;
    _this.scalePlayerOther = .7;
    _this.moneys = [];
    _this.isClick = false;
    _this.prefabsCardGameTableController = null;
    _this.cardGameTableController = null;
    _this.tuChoiGame = false;
    _this.isInBgMode = false;
    _this.oldClickTime = 0;
    _this.isGameAnDanh = false;
    _this.isGameAnDanhCheck = false;
    _this.winEffectPrefab = null;
    _this.winEffectList = [];
    _this.winTextEffectPrefab = null;
    _this.winTextEffectList = [];
    _this.nodepoolingPlayerView = null;
    _this.listChatIconConfig = null;
    _this.emoSlotIndexPos = [];
    _this.playerViewpos4AnDanh = null;
    _this.maxUserInRoom = -1;
    _this.totalCoinInGame = 0;
    _this.coPass = false;
    _this.popupHasPlayerNotReady = null;
    _this.listChatHistory = [];
    return _this;
  }
  __extends(GameController, _super);
  GameController.prototype.initDefaultData = function() {
    for (var userId in this.size = this.node.getContentSize(), this.state = MessageCardGameHandler.GameState.WAITING, this._playedOnce = false, this
        ._joinedTable = false, this._dangPhatBai = false, null !== this.rutTienBtn && (this.rutTienBtn.active = false), this
        ._subscribedToGetOut = false, this._autoWithDrawMoney = false, this._moneyToAutoWithdraw = 0, this._dangKetThuc = false, this
        .tuDongGuiSanSang = GameConfigManager.default.getInstance().autoReady, this._forcedQuit = false, this._forcedToLeaveRoom = false, this.loaded =
        false, this._khongThaoTac = true, this._soVanKhongThaoTac = 0, this.bet = 0, this.maxMoneyBuyIn = 0, this.minMoneyBuyIn = 0,
        this.isHost = false, this._thisPlayerView = null, this._incognito = false, this.LeaveRoomMessage = null, this.AllPlayers) {
      var player = this.AllPlayers[userId];
      if (null !== player && void 0 !== player) {
        for (var coinIndex = 0; coinIndex < player.coins.length; coinIndex++) {
          player.coins[coinIndex].removeFromParent(true);
        }
        player.destroyMe();
      }
    }
    this.players = [];
    this.playersPlaying = [];
    this.AllPlayers = {};
    this.pendingJoinPlayers = [];
    this.pendingRemovePlayers = [];
    if (null != this.cardGameTableController) {
      this.cardGameTableController.initDefaultData();
    }
    this.moneys = [];
  };
  GameController.prototype.hide = function() {
    this.node.active = false;
    this.isClickExit = false;
  };
  GameController.prototype.setMiniGameNode = function() {};
  GameController.prototype.walkUpBase = function(mainGameViewModel) {
    this.mainGameViewModel = mainGameViewModel;
    this.node.active = true;
    this.node.opacity = 0;
    this.node.scale = 0;
    this.initDefaultData();
    this.setMiniGameNode();
  };
  GameController.prototype.onLoad = function() {
    var _this = this;
    if (this.nodepoolingPlayerView = new cc.NodePool(), null != this.prefabsCardGameTableController) {
      var tableControllerNode = cc.instantiate(this.prefabsCardGameTableController);
      tableControllerNode.parent = this.node;
      tableControllerNode.zIndex = -2;
      this.cardGameTableController = tableControllerNode.getComponent(CardGameTableController.default);
      this.cardGameTableController.init(this.getNameGame(), this.getSpriteFrameName(), this.getListChatDefaultText(), this
      .getCmdStart(), this.onUserClickExit.bind(this), this);
      this.cardGameTableController.sendStart = function() {
        this.hostSendStartGame();
      }.bind(this);
    }
    this.initDefaultData();
    this.POS9 = [];
    this.POS3 = [];
    this.POS5 = [];
    this.POS7 = [];
    this.listBtnInvitePos.forEach(function(posNode) {
      var inviteBtnNode = cc.instantiate(_this.btnInvitePrefabs);
      if (inviteBtnNode.parent = _this.node, inviteBtnNode.zIndex = -1, inviteBtnNode.position = posNode.position, _this.inviteBtns.push(inviteBtnNode), null !== _this.winEffectPrefab && void 0 !==
        _this.winEffectPrefab) {
        var winEffectNode = cc.instantiate(_this.winEffectPrefab);
        winEffectNode.parent = _this.node;
        winEffectNode.position = posNode.position;
        winEffectNode.zIndex = -1;
        _this.winEffectList.push(winEffectNode);
        winEffectNode.active = false;
      }
      if (null !== _this.winTextEffectPrefab && void 0 !== _this.winTextEffectPrefab) {
        var winTextEffectNode = cc.instantiate(_this.winTextEffectPrefab);
        winTextEffectNode.parent = _this.node;
        winTextEffectNode.position = posNode.position;
        winTextEffectNode.zIndex = GameZOrder.default.TOP;
        _this.winTextEffectList.push(winTextEffectNode.getComponent(BetLabel.default));
        winTextEffectNode.active = false;
      }
    });
    this.POS3.push(0);
    this.POS3.push(5);
    this.POS3.push(4);
    this.POS5.push(0);
    this.POS5.push(7);
    this.POS5.push(5);
    this.POS5.push(4);
    this.POS5.push(2);
    this.POS7.push(0);
    this.POS7.push(7);
    this.POS7.push(6);
    this.POS7.push(5);
    this.POS7.push(4);
    this.POS7.push(3);
    this.POS7.push(2);
    this.POS9 = [];
    this.POS9.push(this.POS7[0]);
    this.POS9.push(8);
    this.POS9.push(this.POS5[1]);
    this.POS9.push(this.POS7[2]);
    this.POS9.push(5);
    this.POS9.push(this.POS3[2]);
    this.POS9.push(this.POS7[5]);
    this.POS9.push(this.POS5[4]);
    this.POS9.push(1);
    cc.loader.loadRes("TX/ListChatIconConfig", function(error, chatIconConfigPrefab) {
      if (CommonPrefabsManager.default.getInstance().hideLoading(), null === chatIconConfigPrefab) {
        ;
      } else {
        (spawnedNode = cc.instantiate(chatIconConfigPrefab)).parent = this.node;
        this.listChatIconConfig = spawnedNode.getComponent(ListChatIconConfig.default);
        for (var slotIndex = 0; slotIndex < this.inviteBtns.length; ++slotIndex) {
          var spawnedNode;
          (spawnedNode = cc.instantiate(this.listChatIconConfig.iconProfap)).parent = this.node;
          spawnedNode.position = this.inviteBtns[slotIndex].position;
          spawnedNode.active = false;
          spawnedNode.zIndex = 1;
          var emoScript = spawnedNode.getComponent(EmoScript.default);
          this.emoSlotIndexPos.push(emoScript);
        }
      }
    }.bind(this));
  };
  GameController.prototype.processIngameUserChat = function(chatData, isFromBatch) {
    if (void 0 === isFromBatch) {
      isFromBatch = false;
    }
    var userId = chatData.uid,
      message = chatData.mgs,
      displayName = chatData.dn,
      chatType = chatData.c;
    this.showChat(chatData, userId, message, isFromBatch, displayName, chatType);
  };
  GameController.prototype.onReceiveMessage = function(cmd, raw, data, applyGameConfig) {
    switch (void 0 === applyGameConfig && (applyGameConfig = true), cmd != MessageCardGame.Global_Message.GET_TABLES && GameConfigManager.default.getInstance().enviromentName.includes("pre") && BaseScene
      .default.currentSceneName != GameDefine.GameConfigs.SceneName.BauCua && ErrorLogHandler.default.getInstance().addLog(JSON.stringify(data)), cmd) {
      case MessageCardGame.Global_Message.INGAME_JOIN_TABLE_INFOS:
        this.onGetInGameTableInfo(data);
        break;
      case MessageCardGame.Global_Message.SET_AUTO_READY:
        cc.error(data);
        break;
      case MessageCardGame.Global_Message.INGAME_USER_LEAVE_AND_JOIN_TABLE:
        var joinLeaveType = data.t,
          playerData = data.p;
        1 === joinLeaveType ? this.onUserJoinTable(playerData) : 2 === joinLeaveType && this.onUserLeaveTable(playerData);
        break;
      case MessageCardGame.Global_Message.UPDATE_BATCH_PLAYER_IN_ROOM:
        if (null !== data.ps && void 0 !== data.ps) {
          for (var playerIndex = 0; playerIndex < data.ps.length; ++playerIndex) {
            joinLeaveType = data.ps[playerIndex].t;
            var batchPlayerData = data.ps[playerIndex].p;
            if (1 === joinLeaveType) {
              this.onUserJoinTable(batchPlayerData);
            } else {
              if (2 === joinLeaveType) {
                this.onUserLeaveTable(batchPlayerData);
              }
            }
          }
        }
        null !== data.tTU && void 0 !== data.tTU && this.setTextUserbanCHung(data.tTU);
        break;
      case MessageCardGame.Global_Message.INGAME_USER_CHAT:
        this.processIngameUserChat(data);
        break;
      case MessageCardGame.Global_Message.BATCH_INGAME_USER_CHAT:
        var batchChatMessages = data.bmgs;
        if (batchChatMessages) {
          for (var chatIndex = 0; chatIndex < batchChatMessages.length; chatIndex++) {
            if (0 !== batchChatMessages[chatIndex].uid.localeCompare(GamePlayManager.default.getInstance().userID)) {
              this.processIngameUserChat(batchChatMessages[chatIndex], true);
            }
          }
        }
        break;
      case MessageCardGame.Global_Message.INGAME_SEND_READY_TO_COUNT_DOWN:
        this.autoSendReady();
        break;
      case MessageCardGame.Global_Message.INGAME_USER_READY:
        var userId = data.uid;
        this.setReadyForPlayer(userId);
        break;
      case MessageCardGame.Global_Message.INGAME_UPDATE_MONEY:
        var moneyList = data.ps;
        this.updateMoneysMsg(moneyList);
        break;
      case MessageCardGame.Global_Message.REFRESH_MONEY:
        var assets = data.As,
          vip = assets.vip,
          gold = assets.gold,
          chip = assets.chip,
          goldSafe = assets.safe;
        GamePlayManager.default.getInstance().vip = vip;
        GamePlayManager.default.getInstance().gold = gold;
        GamePlayManager.default.getInstance().chip = chip;
        GamePlayManager.default.getInstance().goldSafe = goldSafe;
        this.refreshMoney(assets);
        break;
      case MessageCardGame.Global_Message.BUY_IN:
        userId = data.uid;
        var money = data.m;
        this.moneyWithdrawalResponse(userId, money);
        break;
      case MessageCardGame.Global_Message.INGAME_CHANGE_HOST:
        userId = data.uid;
        this.setHostPlayer(userId);
        break;
      case MessageCardGame.Global_Message.FIND_PLAYERS_TO_INVITE:
        for (var foundUsers = data.us, inviteUserIds = [], userIndex = 0; userIndex < foundUsers.length; userIndex++) {
          var foundUser = foundUsers[userIndex];
          inviteUserIds.push(foundUser.u);
        }
        CardGameCommonRequest.default.getInstance().sendInvitePlayers(inviteUserIds);
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil(
          "H\u1ec7 th\u1ed1ng \u0111\xe3 g\u1eedi l\u1eddi m\u1eddi \u0111\u1ebfn ng\u01b0\u1eddi ch\u01a1i kh\xe1c!");
        break;
      case MessageCardGame.Global_Message.JOIN_TABLE_INVITATION:
        if (false === this.node.active && false === GamePlayManager.default.getInstance().iskteckgame) {
          var fromUser = data.fu,
            roomInfo = data.ri;
          CommonPrefabsManager.default.getInstance().showPopupInviRoom(fromUser, roomInfo);
        }
        break;
      case MessageCardGame.Global_Message.BAO_QUAY:
        StringUtil.default.isNullOrEmpty(data.mgs) ? CommonPrefabsManager.default.getInstance().showPopupMessageUtil(
            "Ch\xfang t\xf4i s\u1ebd s\u1eed l\xfd v\xe0 th\xf4ng b\xe1o qua h\u1ed9p th\u01b0.") : CommonPrefabsManager.default.getInstance()
          .showPopupMessageUtil(data.mgs);
    }
  };
  GameController.prototype.sendAutoReadyPreference = function() {
    RoomMessageHandler.default.getInstance().sendAutoReadyPref(GameConfigManager.default.getInstance().autoReady);
  };
  GameController.prototype.autoSendReady = function() {
    if (this._daNgoi) {
      if (this.isHost) {
        this.sendReady();
      } else {
        if (this.tuDongGuiSanSang || GameConfigManager.default.getInstance().autoReady) {
          this.sendReady();
        } else {
          if (null != this.cardGameTableController) {
            this.cardGameTableController.readyBtn.active = true;
          }
        }
      }
    }
  };
  GameController.prototype.setTextUserbanCHung = function(t) {};
  GameController.prototype.onGetInGameTableInfo = function(tableInfo) {
    CommonPrefabsManager.default.getInstance().hideLoading();
    this.sendAutoReadyPreference();
    this.node.opacity = 255;
    this.node.scale = 1;
    if (null !== this.mainGameViewModel.roomController && void 0 !== this.mainGameViewModel.roomController) {
      this.mainGameViewModel.roomController.node.active = false;
    }
    if (GameConfigManager.default.getInstance().enviromentName.indexOf("pre") >= 0) {
      ErrorLogHandler.default.getInstance().clearLogString();
      ErrorLogHandler.default.getInstance().addLog(JSON.stringify(tableInfo));
    }
    if (null !== tableInfo.hpwd && void 0 !== tableInfo.hpwd && tableInfo.hpwd) {
      this.isGameAnDanh = false;
      this.isGameAnDanhCheck = false;
    }
    if (this.cardGameTableController) {
      if (tableInfo.cH) {
        this.listChatHistory = tableInfo.cH;
      } else {
        this.listChatHistory = [];
      }
      this.cardGameTableController.loadChatHistory();
    }
  };
  GameController.prototype.onUserJoinTable = function(playerData) {
    var isGameInProgress = false;
    if (this.state !== MessageCardGameHandler.GameState.WAITING) {
      isGameInProgress = true;
    }
    this.addPlayerWithDict(playerData);
    if (isGameInProgress) {
      this.updateViewingPlayerPositions();
    } else {
      this.updateReadyStatus();
      this.updateViewPostions(false, true);
    }
  };
  GameController.prototype.onUserLeaveTable = function(playerData) {
    var userId = playerData.uid;
    this.removePlayer(userId);
  };
  GameController.prototype.setGameConfig = function(bet, gameState, remainingTime, assetId, maxUser, hasPassword) {
    if (this.bet = bet, this.gameState = gameState, this.remainingTime = remainingTime, this.assetID = assetId, this.maxUser = maxUser, this.coPass = hasPassword, null != this
      .cardGameTableController) {
      var isAnonymous = this.isGameAnDanh;
      if (hasPassword) {
        isAnonymous = false;
      }
      this.cardGameTableController.setGameConfig(bet, isAnonymous, hasPassword);
    }
  };
  GameController.prototype.setMoneyBuyInThreshold = function(minMoneyBuyIn, maxMoneyBuyIn) {
    this.minMoneyBuyIn = minMoneyBuyIn;
    this.maxMoneyBuyIn = maxMoneyBuyIn;
    GamePlayManager.default.getInstance().minBuyIn = this.minMoneyBuyIn;
    GamePlayManager.default.getInstance().maxBuyIn = this.maxMoneyBuyIn;
    GamePlayManager.default.getInstance().bet = this.bet;
  };
  GameController.prototype.getPlayer = function(userId) {
    return this.AllPlayers[userId];
  };
  GameController.prototype.getRmcDefaul = function() {
    return 3;
  };
  GameController.prototype.checkReconnect = function(playerData) {
    return false;
  };
  GameController.prototype.addPlayerWithDict = function(playerData) {
    var userId = playerData.uid,
      isHost = playerData.C;
    if (0 === userId.localeCompare(GamePlayManager.default.getInstance().userID)) {
      this.isHost = isHost;
    }
    var money = playerData.m,
      playerState = playerData.pS,
      remainingCards = this.getRmcDefaul(),
      seatIndex = playerData.sit,
      displayName = playerData.dn,
      isReady = playerData.r,
      pid = playerData.pid,
      isAtTable = playerData.pi;
    if (this.state === MessageCardGameHandler.GameState.WAITING || this.checkReconnect(playerData)) {
      isAtTable = true;
    }
    if (this._dangPhatBai) {
      if (!(GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.XITO && GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.POKER)) {
        isAtTable = false;
      }
    }
    var assets = playerData.As,
      avatar = playerData.a,
      accountId = 0;
    if (null !== playerData.id && void 0 !== playerData.id && (accountId = playerData.id), null !== playerData.rM && void 0 !== playerData.rM) {
      var realMoney = playerData.rM;
      assets.rM = realMoney;
    }
    var player = this.addPlayer(displayName, userId, isHost, money, playerState, remainingCards, seatIndex, isReady, pid, isAtTable, assets, avatar, accountId);
    if (player.isPlaying = playerData.pi, this.state === MessageCardGameHandler.GameState.VIEWING) {
      var currentBet = playerData.cb;
      player._currentBet = currentBet;
    }
  };
  GameController.prototype.createListPlayerWhenGetTableInfo = function(playerDataList) {
    for (var playerIndex = 0; playerIndex < playerDataList.length; ++playerIndex) {
      var playerData = playerDataList[playerIndex];
      this.addPlayerWithDict(playerData);
    }
  };
  GameController.prototype.addPlayer = function(displayName, userId, isHost, money, playerState, remainingCards, seatIndex, isReady, pid, isAtTable, assets, avatar, accountId) {
    var player = this.getPlayer(userId);
    if (null !== player && void 0 !== player) {
      this.removePendingPlayerWith(userId);
      return player;
    }
    var playerNode = this.getPlayerView();
    playerNode.parent = this.node;
    playerNode.zIndex = GameZOrder.default.BOTTOM;
    playerNode.setPosition(moduleExports.posOutScreen);
    (player = playerNode.getComponent(PlayerView.default)).addInfo(displayName, userId, isHost, money, playerState, remainingCards, seatIndex, isReady, pid, accountId, assets, avatar, this.isGameAnDanh);
    if (player.isMine()) {
      this._thisPlayerView = player;
    }
    this.AllPlayers[player.userID] = player;
    if (isAtTable || player.isMine()) {
      this.players.push(player);
    } else {
      this.pendingJoinPlayers.push(player);
    }
    if (player.isMine()) {
      player.node.scale = this.scalePlayerViewMine;
    } else {
      player.node.scale = this.scalePlayerOther;
    }
    return player;
  };
  GameController.prototype.sortVectorPlayers = function() {
    this.players.sort(function(playerA, playerB) {
      return playerA.sit > playerB.sit ? 1 : playerA.sit < playerB.sit ? -1 : 0;
    });
  };
  GameController.prototype.showHideInviteBtn = function() {
    if (-1 == this.maxUserInRoom) {
      for (var btnIndex = 0; btnIndex < this.inviteBtns.length; ++btnIndex) {
        this.inviteBtns[btnIndex].active = true;
      }
    } else {
      var isVisible = true;
      for (btnIndex = 0; btnIndex < this.inviteBtns.length; ++btnIndex) {
        if (btnIndex >= this.maxUserInRoom) {
          isVisible = false;
        }
        this.inviteBtns[this.POS9[btnIndex]].active = isVisible;
      }
    }
  };
  GameController.prototype.updateViewPostions = function(instant, skipMine, applyInstantToMine) {
    if (void 0 === instant) {
      instant = false;
    }
    if (void 0 === skipMine) {
      skipMine = false;
    }
    if (void 0 === applyInstantToMine) {
      applyInstantToMine = false;
    }
    this.showHideInviteBtn();
    this.sortVectorPlayers();
    for (var playerIndex = 0; playerIndex < this.players.length; ++playerIndex) {
      (player = this.players[playerIndex]).index = playerIndex;
    }
    for (playerIndex = 0; playerIndex < this.players.length; ++playerIndex) {
      var player = this.players[playerIndex];
      this.showPlayerViewBauCua(player, true);
      player.stopViewAction();
      player.pos = this.getViewPositionOfPlayer(player, playerIndex);
      if (player.indexPos < this.inviteBtns.length && player.node.active) {
        this.inviteBtns[player.indexPos].active = false;
      }
      if (!skipMine || skipMine && !player.isMine()) {
        if (player.isMine() && player.isMine() && !applyInstantToMine) {
          player.runToPos(this.size);
        } else {
          player.runToPos(this.size, instant);
        }
      }
    }
    this.updateViewingPlayerPositions();
    this._joinedTable = true;
  };
  GameController.prototype.getViewPositionOfPlayer = function(player, playerIndex) {
    var myIndex = -1;
    if (null !== this._thisPlayerView && void 0 !== this._thisPlayerView) {
      myIndex = this._thisPlayerView.index;
    }
    var slotCount = this.inviteBtns.length;
    if (myIndex >= 0) {
      playerIndex = (playerIndex + slotCount - myIndex) % slotCount;
    }
    player.indexPos = playerIndex;
    return this.inviteBtns[playerIndex].position;
  };
  GameController.prototype.buyIn = function() {};
  GameController.prototype.updateReadyStatus = function() {
    if (this.state !== MessageCardGameHandler.GameState.VIEWING && this.state !== MessageCardGameHandler.GameState.PLAYING) {
      for (playerIndex = 0; playerIndex < this.players.length; ++playerIndex) {
        if ((player = this.players[playerIndex]).isHost) {
          player.node.color = cc.Color.WHITE;
        } else {
          if (player.isReady) {
            player.node.color = cc.Color.WHITE;
            player.iconnReady.active = true;
          } else {
            player.isReady = false;
            player.iconnReady.active = false;
          }
          if (this.isHost && false === player.isMine()) {
            player.kickButton.active = false;
          }
        }
      }
    } else {
      for (var playerIndex = 0; playerIndex < this.players.length; ++playerIndex) {
        var player;
        (player = this.players[playerIndex]).node.color = cc.Color.WHITE;
        player.isReady = false;
        player.iconnReady.active = false;
      }
    }
  };
  GameController.prototype.moneyWithdrawalResponse = function(userId, money) {
    for (var playerIndex = 0; playerIndex < this.players.length; ++playerIndex) {
      if (0 === (player = this.players[playerIndex]).userID.localeCompare(userId)) {
        player._money = money;
        return void player.setMoney(money);
      }
    }
    for (playerIndex = 0; playerIndex < this.pendingJoinPlayers.length; ++playerIndex) {
      var player;
      if (0 === (player = this.pendingJoinPlayers[playerIndex]).userID.localeCompare(userId)) {
        player._money = money;
        return void player.setMoney(money);
      }
    }
  };
  GameController.prototype.setReadyForPlayer = function(userId) {
    if (this.state !== MessageCardGameHandler.GameState.WAITING) {
      ;
    } else {
      var player = this.getPlayer(userId);
      if (null === player || void 0 === player) {
        return;
      }
      if (player.isReady) {
        return;
      }
      if (player.isMine() && null != this.cardGameTableController) {
        this.cardGameTableController.readyBtn.active = false;
      }
      player.isReady = true;
      if (!player.isHost) {
        player.iconnReady.active = true;
      }
      if (this.isHost) {
        this.hostCheckAllPlayerReadyForShowButtonStartGameWhenUserReady();
      }
    }
  };
  GameController.prototype.hostCheckAllPlayerReadyForShowButtonStartWhenRemovePlayer = function() {
    this.checkAllPlayerReadyForShowButtonStartWhenRemovePlayer();
  };
  GameController.prototype.checkAllPlayerReadyForShowButtonStartWhenRemovePlayer = function() {
    for (var readyCount = 0, playerIndex = 0; playerIndex < this.players.length; ++playerIndex) {
      var player = this.players[playerIndex];
      if (!player.isMine() && player.isReady) {
        readyCount++;
      }
    }
    if (!(readyCount !== this.players.length - 1 || 0 == readyCount || this._dangPhatBai)) {
      if (null != this.cardGameTableController && this.players.length >= 2) {
        this.cardGameTableController.startBtn.active = true;
      }
    }
    if (readyCount > 0 && !this._dangPhatBai && null != this.cardGameTableController && this.players.length >= 2) {
      this.cardGameTableController.startBtn.active = true;
    }
  };
  GameController.prototype.checkShowButtonStartWhenRemovePlayer = function() {
    if (!this._dangPhatBai && this.players.length >= 2 && null != this.cardGameTableController) {
      this.cardGameTableController.startBtn.active = true;
    }
  };
  GameController.prototype.hostCheckAllPlayerReadyForShowButtonStartGameWhenUserReady = function() {
    this.checkAllPlayerReadyForShowButtonStartGameWhenUserReady();
  };
  GameController.prototype.checkAllPlayerReadyForShowButtonStartGameWhenUserReady = function() {
    for (var readyCount = 0, playerIndex = 0; playerIndex < this.players.length; ++playerIndex) {
      var player = this.players[playerIndex];
      if (false === player.isMine() && player.isReady) {
        readyCount++;
      }
    }
    if (readyCount === this.players.length - 1 && 0 != readyCount && this.players.length >= 2 && null != this.cardGameTableController) {
      this.cardGameTableController.startBtn.active = true;
      if (this.isHost && this.tuChoiGame) {
        this.cardGameTableController.sendStart();
      }
    }
    if (readyCount > 0 && !this._dangPhatBai && this.players.length >= 2 && null != this.cardGameTableController) {
      this.cardGameTableController.startBtn.active = true;
    }
  };
  GameController.prototype.checkShowButtonStartGameWhenUserReady = function() {
    if (!this._dangPhatBai && this.players.length >= 2 && null != this.cardGameTableController) {
      this.cardGameTableController.startBtn.active = true;
    }
  };
  GameController.prototype.hostCheckAllPlayerReadyForShowButtonStartGameWhenChangeHost = function() {
    this.checkAllPlayerReadyForShowButtonStartGameWhenChangeHost();
  };
  GameController.prototype.checkAllPlayerReadyForShowButtonStartGameWhenChangeHost = function() {
    if (this.isHost) {
      if (null != this.cardGameTableController) {
        this.cardGameTableController.readyBtn.active = false;
      }
      for (var readyCount = 0, playerIndex = 0; playerIndex < this.players.length; ++playerIndex) {
        var player = this.players[playerIndex];
        if (!player.isMine() && player.isReady) {
          readyCount++;
        }
      }
      if (readyCount > 0 && this.checkGameIsDOneAndWaitingToStart() && null != this.cardGameTableController && this.players.length >= 2) {
        this.cardGameTableController.startBtn.active = true;
      }
    }
  };
  GameController.prototype.checkShowButtonStartGameWhenChangeHost = function() {
    if (this.isHost) {
      if (null != this.cardGameTableController) {
        this.cardGameTableController.readyBtn.active = false;
      }
      if (this.checkGameIsDOneAndWaitingToStart() && this.players.length >= 2 && null != this.cardGameTableController && this.players
        .length >= 2) {
        this.cardGameTableController.startBtn.active = true;
      }
    }
  };
  GameController.prototype.sendReady = function() {
    CardGameCommonRequest.default.getInstance().sendReady();
  };
  GameController.prototype.sendStart = function() {
    this.cardGameTableController.sendStartCmd();
  };
  GameController.prototype.hostSendStartGame = function() {
    for (var _this = this, readyCount = 0, playerIndex = 0; playerIndex < this.players.length; ++playerIndex) {
      var player = this.players[playerIndex];
      if (false === player.isMine() && player.isReady) {
        readyCount++;
      }
    }
    if (0 != readyCount && readyCount === this.players.length - 1) {
      this.sendStart();
    } else if (GamePlayManager.default.getInstance().isHostSentStartWarningOtherNotReady) {
      this.sendStart();
    } else {
      var confirmPopup = CommonPrefabsManager.default.getInstance().showPopup2Button();
      confirmPopup.onOKClicked = function() {
        confirmPopup.hide();
        _this.sendStart();
      };
      confirmPopup.onCancelClicked = function() {
        confirmPopup.hide();
      };
      confirmPopup.setContent("C\xf3 ng\u01b0\u1eddi ch\u01a1i ch\u01b0a s\u1eb5n s\xe0ng, b\u1ea1n c\xf3 mu\u1ed1n b\u1eaft \u0111\u1ea7u?");
      GamePlayManager.default.getInstance().isHostSentStartWarningOtherNotReady = true;
      this.popupHasPlayerNotReady = confirmPopup;
    }
  };
  GameController.prototype.getViewPositionOfViewingPlayer = function(player, playerIndex) {
    if (player.isMine()) {
      for (var isFirstSlotTaken = false, firstSlotPosition = this.inviteBtns[0].position, index = 0; index < this.players.length; ++index) {
        player = this.players[index];
        if (StringUtil.default.checkVec2Equal(player.pos, firstSlotPosition)) {
          isFirstSlotTaken = true;
          break;
        }
      }
      if (!isFirstSlotTaken) {
        player.indexPos = 0;
        return firstSlotPosition;
      }
    }
    for (index = 0; index < this.inviteBtns.length; ++index) {
      var slotNode = this.inviteBtns[index];
      if (slotNode.active) {
        player.indexPos = index;
        slotNode.active = false;
        return slotNode.position;
      }
    }
    return new cc.Vec2(moduleExports.posOutScreen.x, moduleExports.posOutScreen.y);
  };
  GameController.prototype.updateViewingPlayerPositions = function() {
    this.pendingJoinPlayers.sort(function(playerA, playerB) {
      return playerA.sit > playerB.sit ? 1 : playerA.sit < playerB.sit ? -1 : 0;
    });
    for (var playerIndex = 0; playerIndex < this.pendingJoinPlayers.length; ++playerIndex) {
      var player = this.pendingJoinPlayers[playerIndex];
      this.showPlayerViewBauCua(player, true);
      player.iconnReady.active = false;
      player.kickButton.active = false;
      player.runViewAction();
      if (StringUtil.default.checkVec2Equal(player.node.position, cc.Vec2.ZERO) || this.state === MessageCardGameHandler.GameState.WAITING) {
        player.pos = this.getViewPositionOfViewingPlayer(player, playerIndex);
        if (this.state !== MessageCardGameHandler.GameState.VIEWING || player.isMine() || this._joinedTable) {
          player.runToPos(this.size);
        } else {
          player.node.position = player.pos;
        }
      }
    }
  };
  GameController.prototype.removePlayer = function(userId) {
    if (this.state !== MessageCardGameHandler.GameState.WAITING) {
      for (var playerIndex = 0; playerIndex < this.pendingJoinPlayers.length; ++playerIndex) {
        var viewingPlayer = this.pendingJoinPlayers[playerIndex];
        if (0 === viewingPlayer.userID.localeCompare(userId)) {
          if (void 0 != this.inviteBtns[viewingPlayer.indexPos] && null != this.inviteBtns[viewingPlayer.indexPos]) {
            this.inviteBtns[viewingPlayer.indexPos].active = true;
            this.emoSlotIndexPos[viewingPlayer.indexPos].hide();
          }
          this.pendingJoinPlayers.splice(playerIndex, 1);
          delete this.AllPlayers[userId];
          this.updateViewingPlayerPositions();
          if (this.autoReady && GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.BINH) {
            if (viewingPlayer.isMine()) {
              this.isHost = false;
            } else {
              this._daNgoi;
            }
          }
          return void viewingPlayer.destroyMe();
        }
      }
      var player = this.getPlayer(userId);
      if (null !== player && void 0 !== player) {
        player.removeChat();
        if (this.autoReady && GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.BINH && player.isMine()) {
          if (player.checkInThisArray(this.playersPlaying)) {
            this.pendingRemovePlayers.push(player);
            player.iconQuit.active = true;
          } else {
            this.players.splice(player.index, 1);
            this.updateViewPostions(false, true);
            player.node.removeFromParent(true);
            delete this.AllPlayers[userId];
          }
        } else {
          this.pendingRemovePlayers.push(player);
          player.iconQuit.active = true;
        }
      }
    } else {
      for (playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
        var seatedPlayer = this.players[playerIndex];
        if (0 === seatedPlayer.userID.localeCompare(userId)) {
          this.emoSlotIndexPos[seatedPlayer.indexPos].hide();
          seatedPlayer.removeChat();
          seatedPlayer.cards.forEach(function(card) {
            card.node.removeFromParent(true);
          });
          if (this.players.length <= 1 && null != this.cardGameTableController) {
            this.cardGameTableController.stopProgressStartGame();
            this.cardGameTableController.hideReadyBtn();
          }
          seatedPlayer.node.removeFromParent(true);
          this.players.splice(playerIndex, 1);
          delete this.AllPlayers[userId];
          break;
        }
      }
      this.updateViewPostions(false, true);
      if (this.isHost) {
        if (1 === this.players.length) {
          if (null != this.cardGameTableController) {
            this.cardGameTableController.stopProgressStartGame();
            this.cardGameTableController.hideReadyBtn();
          }
        } else {
          this.hostCheckAllPlayerReadyForShowButtonStartWhenRemovePlayer();
        }
      }
    }
  };
  GameController.prototype.onLogOut = function() {};
  GameController.prototype.hideAllEmoticon = function() {
    for (var slotIndex = 0; slotIndex < this.emoSlotIndexPos.length; slotIndex++) {
      this.emoSlotIndexPos[slotIndex].hide();
    }
  };
  GameController.prototype.handleLeaveRoomResponse = function() {
    var _this = this;
    if (this.isClickExit = false, this.cardGameTableController.handleLeaveRoom(), !GamePlayManager.default.getInstance().onLogOutKickUser()) {
      if (this.hideAllEmoticon(), GamePlayManager.default.getInstance().gameID == MessageCardGameHandler.GAME.BACAY) {
        for (var playerIndex = 0; playerIndex < this.playersPlaying.length; playerIndex++) {
          this.playersPlaying[playerIndex].getComponent(PlayerView.default).reset();
        }
      }
      if (this.isDelayLeave) {
        this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function() {
          _this.mainGameViewModel.showGameList(_this.LeaveRoomMessage);
        })));
        this.isDelayLeave = false;
      } else {
        this.mainGameViewModel.showGameList(this.LeaveRoomMessage);
      }
    }
  };
  GameController.prototype.sendLeaveRoom = function() {
    CardGameCommonRequest.default.getInstance().sendLeaveRoom();
    if ("1" == cc.sys.localStorage.getItem("isPlayBauCua")) {
      cc.sys.localStorage.setItem("isPlayBauCua", "0");
    }
    if ("1" == cc.sys.localStorage.getItem("isPlayXocDia")) {
      cc.sys.localStorage.setItem("isPlayXocDia", "0");
    }
    this.isClickExit = true;
  };
  GameController.prototype.getMinePlayer = function() {
    for (var playerIndex = 0; playerIndex < this.players.length; ++playerIndex) {
      var player = this.players[playerIndex];
      if (player.isMine()) {
        return player;
      }
    }
    return null;
  };
  GameController.prototype.showChat = function(chatData, userId, message, isFromBatch, displayName, chatType) {
    if (void 0 === isFromBatch && (isFromBatch = false), void 0 === displayName && (displayName = ""), void 0 === chatType && (chatType = 0), 0 !== message.length && " " !== message && !this
      .isGameAnDanhCheck) {
      if (0 === chatType) {
        var player = this.getPlayer(userId);
        this.showChatForVisibliePlayer(player, message, isFromBatch);
      }
      if (this.cardGameTableController) {
        if (0 === chatType) {
          var nameColor = colorChatMine;
          if (0 !== userId.localeCompare(GamePlayManager.default.getInstance().userID)) {
            nameColor = colorChatOther;
          }
          this.cardGameTableController.loadChat(chatData, message, displayName, false, -1, nameColor, nameColor);
        } else {
          this.cardGameTableController.loadChat(chatData, message, "", true, -1, colorChatSystem, colorChatSystem);
        }
      }
    }
  };
  GameController.prototype.getListChatDefaultText = function() {
    return ["\u0110\xe1nh l\u1eb9 \u0111i pa", "Heo \u0111\xe2u, heo \u0111\xe2u", "Gi\u1ebft c\xf3ng m\u1ea5y ch\xfa", "Xui vl",
      "Th\xfai heo n\xe8", "Nu\xf4i heo h\u1ea3 c\u01b0ng", "M\xecnh anh ch\u1ea5p h\u1ebft", "T\u1edbi Tr\u1eafng n\xe8",
      "Th\u1eafng r\u1ed3i yeah yeah"
    ];
  };
  GameController.prototype.locPlayingPlayer = function(playingUserIds) {
    var playingPlayers = [];
    this.players = [];
    for (var playerIndex = 0; playerIndex < playingUserIds.length; ++playerIndex) {
      var player = this.AllPlayers[playingUserIds[playerIndex]];
      if (null !== player && void 0 !== player) {
        playingPlayers.push(player);
        this.players.push(player);
      }
    }
    for (var userId in this.pendingJoinPlayers = [], this.AllPlayers) {
      var otherPlayer = this.AllPlayers[userId];
      if (!(null === otherPlayer || void 0 === otherPlayer || otherPlayer.checkInThisArray(playingPlayers))) {
        if (otherPlayer.isMine()) {
          this.players.push(otherPlayer);
        } else {
          this.pendingJoinPlayers.push(otherPlayer);
        }
      }
    }
    this.playersPlaying = [];
    this.playersPlaying = playingPlayers;
    this.updateViewPostions(false, true);
  };
  GameController.prototype.startBetting = function(remainingTime) {
    if (!(remainingTime <= 0)) {
      if (this.players.length <= 1) {
        if (null != this.cardGameTableController) {
          this.cardGameTableController.stopProgressStartGame();
        }
      } else {
        if (null != this.cardGameTableController) {
          this.cardGameTableController.startBetting(remainingTime, 7);
        }
      }
    }
  };
  GameController.prototype.updateMoneys = function() {};
  GameController.prototype.updateMoneysMsg = function(moneyList) {
    this.moneys = moneyList;
    for (var moneyIndex = 0; moneyIndex < this.moneys.length; moneyIndex++) {
      var userId = this.moneys[moneyIndex].uid;
      if (!StringUtil.default.isNullOrEmpty(userId) && 0 === userId.localeCompare(GamePlayManager.default.getInstance().userID)) {
        var money = this.moneys[moneyIndex].m;
        GamePlayManager.default.getInstance().gold = money;
        if (null !== this.mainGameViewModel && void 0 !== this.mainGameViewModel && null !== this.mainGameViewModel.headerUi &&
          void 0 !== this.mainGameViewModel.headerUi) {
          this.mainGameViewModel.headerUi.updateUI();
        }
      }
    }
  };
  GameController.prototype.refreshMoney = function(assets) {
    var vip = assets.vip,
      gold = assets.gold,
      chip = assets.chip,
      goldSafe = assets.safe;
    GamePlayManager.default.getInstance().vip = vip;
    GamePlayManager.default.getInstance().gold = gold;
    GamePlayManager.default.getInstance().chip = chip;
    GamePlayManager.default.getInstance().goldSafe = goldSafe;
    if (this.gameRutTien && null !== this._thisPlayerView && void 0 !== this._thisPlayerView) {
      this._thisPlayerView._realMoney = gold;
    }
  };
  GameController.prototype.removeNodeFromParent = function(t, node) {
    node.removeFromParent(true);
  };
  GameController.prototype.checkGameIsDOneAndWaitingToStart = function() {
    return !this._dangPhatBai;
  };
  GameController.prototype.setHostPlayer = function(userId) {
    this.isHost = 0 === userId.localeCompare(GamePlayManager.default.getInstance().userID);
    var isHostFound = false;
    if (this.players.forEach(function(player) {
        if (0 === player.userID.localeCompare(userId)) {
          player.isHost = true;
          player.iconnReady.active = false;
          player.iconHost.active = true;
          isHostFound = true;
        } else {
          player.isHost = false;
          player.iconHost.active = false;
        }
      }), !isHostFound) {
      var player = this.getPlayer(userId);
      if (null !== player && void 0 !== player) {
        player.isHost = true;
        player.iconHost.active = true;
      }
    }
    if (this.isHost) {
      this.hostCheckAllPlayerReadyForShowButtonStartGameWhenChangeHost();
      if (this._daNgoi && this.isHost && this.state === MessageCardGameHandler.GameState.WAITING) {
        this.sendReady();
      }
    }
  };
  GameController.prototype.handlePendingPlayers = function() {
    this.tuDongGuiSanSang = GameConfigManager.default.getInstance().autoReady;
  };
  GameController.prototype.checkAndQuitRoom = function() {
    if (this._forcedQuit) {
      this.onLogOut();
      return true;
    }
    if (this._forcedToLeaveRoom) {
      this.handleLeaveRoomResponse();
      return true;
    }
    if (GamePlayManager.default.getInstance().checkBaoTriGame()) {
      this.state = MessageCardGameHandler.GameState.WAITING;
      this.sendLeaveRoom();
      return true;
    }
    if (this._subscribedToGetOut) {
      this.state = MessageCardGameHandler.GameState.WAITING;
      this.sendLeaveRoom();
      return true;
    }
    if (this._khongThaoTac && this._daNgoi) {
      if (this._soVanKhongThaoTac++, 3 == this._soVanKhongThaoTac) {
        this.sendLeaveRoom();
        return true;
      }
    } else {
      this._soVanKhongThaoTac = 0;
    }
    return false;
  };
  GameController.prototype.onUserClickExit = function() {
    if (this._dangPhatBai || this.state === MessageCardGameHandler.GameState.PLAYING) {
      return this._subscribedToGetOut ? (this._subscribedToGetOut = false, CommonPrefabsManager.default.getInstance().showPopupMessageUtil(
          "B\u1ea1n s\u1ebd \u1edf l\u1ea1i ch\u01a1i ti\u1ebfp."), this.cardGameTableController.inGameBackPopup.btnExit.spriteFrame =
        this.cardGameTableController.inGameBackPopup.iconOutRoom, void(this._thisPlayerView.iconQuit.active = false)) : (this
        ._subscribedToGetOut = true, CommonPrefabsManager.default.getInstance().showPopupMessageUtil(
          "B\u1ea1n s\u1ebd r\u1eddi ph\xf2ng khi k\u1ebft th\xfac v\xe1n."), this.cardGameTableController.inGameBackPopup.btnExit
        .spriteFrame = this.cardGameTableController.inGameBackPopup.iconHuyOutRoom, void(this._thisPlayerView.iconQuit.active = true));
    }
    if (this.isClickExit) {
      CommonPrefabsManager.default.getInstance().showPopupMessageUtil("B\u1ea1n s\u1ebd r\u1eddi ph\xf2ng khi k\u1ebft th\xfac v\xe1n.");
    }
    if (null !== this._thisPlayerView && void 0 !== this._thisPlayerView) {
      this._thisPlayerView.iconQuit.active = true;
    }
    this.sendLeaveRoom();
  };
  GameController.prototype.setDelayLeaveRoom = function() {
    if (this.isClickExit) {
      this.isDelayLeave = true;
    } else {
      this.isDelayLeave = false;
    }
  };
  GameController.prototype.getCmdStart = function() {
    return MessageCardGame.Global_Message.START_GAME_CARD;
  };
  GameController.prototype.getNameGame = function() {
    return "";
  };
  GameController.prototype.getTag = function() {
    return "";
  };
  GameController.prototype.getSpriteFrameName = function() {
    return null;
  };
  GameController.prototype.removePendingPlayers = function() {
    for (var pendingIndex = 0; pendingIndex < this.pendingRemovePlayers.length; pendingIndex++) {
      for (var pendingPlayer = this.pendingRemovePlayers[pendingIndex], playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
        var player = this.players[playerIndex];
        if (0 === player.userID.localeCompare(pendingPlayer.userID)) {
          delete this.AllPlayers[pendingPlayer.userID];
          true;
          this.players.splice(playerIndex, 1);
          this.reAddPlayerViewToPooling(player);
          break;
        }
      }
    }
    for (pendingIndex = 0; pendingIndex < this.pendingJoinPlayers.length; pendingIndex++) {
      (pendingPlayer = this.pendingJoinPlayers[pendingIndex]).index = this.players.length;
      this.players.push(pendingPlayer);
      pendingPlayer.pos = this.getViewPositionOfPlayer(pendingPlayer, pendingPlayer.index);
    }
    this.pendingJoinPlayers = [];
    this.pendingRemovePlayers = [];
    this.updateViewPostions(false, true);
  };
  GameController.prototype.onEndGame = function() {
    if (GameConfigManager.default.getInstance().enviromentName.indexOf("pre") >= 0) {
      ErrorLogHandler.default.getInstance().sendLog([this.getTag(), this._thisPlayerView.userID, "vanchoi"], true);
    }
  };
  GameController.prototype.onFocus = function(t) {
    this.isInBgMode = false;
  };
  GameController.prototype.onLostFocus = function() {
    this.isInBgMode = true;
  };
  GameController.prototype.checkNeedRemoveAnnDanh = function() {
    for (var playerIndex = 0; playerIndex < this.playersPlaying.length; ++playerIndex) {
      if (this.playersPlaying[playerIndex].isMine()) {
        return true;
      }
    }
    return false;
  };
  GameController.prototype.showuserAnDanh = function() {
    if (false !== this.checkNeedRemoveAnnDanh()) {
      for (var playerIndex = 0; playerIndex < this.playersPlaying.length; ++playerIndex) {
        this.playersPlaying[playerIndex].showAnDanhWhenDone();
      }
      if (null != this.cardGameTableController) {
        this.cardGameTableController.setGameId(this.coPass);
      }
      this.isGameAnDanhCheck = false;
    }
  };
  GameController.prototype.runWinAction = function(duration, slotIndex) {
    var winEffectNode = this.winEffectList[slotIndex];
    winEffectNode.stopAllActions();
    winEffectNode.active = true;
    winEffectNode.runAction(cc.sequence(cc.delayTime(duration), cc.callFunc(function() {
      winEffectNode.active = false;
    })));
  };
  GameController.prototype.showMoneyFxForPlayerWin = function(money, duration, slotIndex, scale, posX, posY, offsetY) {
    if (void 0 === offsetY && (offsetY = 25), !(money <= 0)) {
      var winTextNode = this.winTextEffectList[slotIndex].node;
      winTextNode.stopAllActions();
      winTextNode.active = true;
      winTextNode.position = new cc.Vec2(posX, posY - offsetY * scale);
      this.winTextEffectList[slotIndex].setNumber(money, false);
      winTextNode.scaleX = .2 * scale;
      winTextNode.opacity = 255;
      winTextNode.runAction(cc.sequence(cc.scaleTo(.2, scale), cc.moveBy(.3, new cc.Vec2(0, offsetY * scale * 2)), cc.delayTime(duration - 1), cc.fadeOut(.5), cc
        .callFunc(function() {
          winTextNode.active = false;
        })));
    }
  };
  GameController.prototype.getPlayerView = function() {
    return cc.instantiate(this.playerAvartaPrefabs);
  };
  GameController.prototype.reAddPlayerViewToPooling = function(player) {
    player.destroyMe();
  };
  GameController.prototype.getEmoIndex = function(chatMessage) {
    if (null !== this.listChatIconConfig && void 0 !== this.listChatIconConfig) {
      var emoIndex = this.listChatIconConfig.dataMaping[chatMessage];
      if (null !== emoIndex && void 0 !== emoIndex) {
        return emoIndex;
      }
    }
    return -1;
  };
  GameController.prototype.checkAndShowEmo = function(player, chatMessage) {
    if (null !== this.listChatIconConfig && void 0 !== this.listChatIconConfig) {
      var emoIndex = this.listChatIconConfig.dataMaping[chatMessage];
      if (null !== emoIndex && void 0 !== emoIndex) {
        return !(player.indexPos < this.emoSlotIndexPos.length) || (this.emoSlotIndexPos[player.indexPos].setAnim(emoIndex), this.emoSlotIndexPos[player
            .indexPos].node.zIndex = player.node.zIndex + 1, this.emoSlotIndexPos[player.indexPos].node.scale = player.node.scale, this
          .emoSlotIndexPos[player.indexPos].node.position = player.node.position, true);
      }
    }
    return false;
  };
  GameController.prototype.showChatForVisibliePlayer = function(player, message, isFromBatch) {
    if (void 0 === isFromBatch) {
      isFromBatch = false;
    }
    if (null !== player && void 0 !== player) {
      if (!this.checkAndShowEmo(player, message)) {
        player.showChat(message);
      }
    }
  };
  GameController.prototype.showPlayerViewBauCua = function(player, isVisible) {
    if (player.node.active !== isVisible) {
      player.node.active = isVisible;
    }
  };
  GameController.prototype.checkSpamChat = function() {
    return "";
  };
  GameController.prototype.getPosanDanh4 = function() {
    return 1;
  };
  GameController.prototype.initUserAnDanh4 = function(isViewing) {
    if (void 0 === isViewing) {
      isViewing = false;
    }
    var playerNode = this.getPlayerView();
    playerNode.parent = this.node;
    playerNode.zIndex = GameZOrder.default.BOTTOM;
    playerNode.position = this.inviteBtns[this.getPosanDanh4()].position;
    playerNode.scale = this.scalePlayerOther;
    playerNode.active = false;
    this.playerViewpos4AnDanh = playerNode.getComponent(PlayerView.default);
    this.playerViewpos4AnDanh.userID = "ddasdsadsadaszzzz12a091";
    this.playerViewpos4AnDanh.isAnDanh = true;
    if (isViewing) {
      this.playerViewpos4AnDanh.runViewAction();
    }
  };
  GameController.prototype.showHideuserAnDanh4 = function(isVisible) {
    if (null !== this.playerViewpos4AnDanh && void 0 !== this.playerViewpos4AnDanh) {
      this.playerViewpos4AnDanh.node.active = isVisible;
      for (var cardIndex = 0; cardIndex < this.playerViewpos4AnDanh.cards.length; ++cardIndex) {
        this.playerViewpos4AnDanh.cards[cardIndex].node.active = isVisible;
      }
    }
  };
  GameController.prototype.showViewTableMessage = function() {
    this.scheduleOnce(function() {
      CommonPrefabsManager.default.getInstance().showPopupMessageUtil("B\xe0n \u0111ang ch\u01a1i, xin vui l\xf2ng ch\u1edd!");
    }, .5);
  };
  GameController.prototype.processCheckToOffAnDanh4 = function() {
    for (var nonAnonymousPlayerCount = 0, playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
      if (!this.players[playerIndex].isAnDanh) {
        nonAnonymousPlayerCount++;
      }
    }
    if (nonAnonymousPlayerCount >= 4) {
      this.playerViewpos4AnDanh.node.active = false;
    }
  };
  GameController.prototype.removePendingPlayerWith = function(userId) {
    for (var pendingIndex = 0; pendingIndex < this.pendingRemovePlayers.length; ++pendingIndex) {
      if (0 === this.pendingRemovePlayers[pendingIndex].userID.localeCompare(userId)) {
        this.pendingRemovePlayers.splice(pendingIndex, 1);
        break;
      }
    }
  };
  GameController.prototype.getChatHistory = function() {
    return this.listChatHistory;
  };
  GameController.prototype.onWsCardClose = function() {};
  __decorate([property(cc.Prefab)], GameController.prototype, "playerAvartaPrefabs", void 0);
  __decorate([property(cc.Prefab)], GameController.prototype, "btnInvitePrefabs", void 0);
  __decorate([property(cc.Prefab)], GameController.prototype, "prefabsGameCard", void 0);
  __decorate([property([cc.Node])], GameController.prototype, "listBtnInvitePos", void 0);
  __decorate([property(cc.Node)], GameController.prototype, "rutTienBtn", void 0);
  __decorate([property(cc.Prefab)], GameController.prototype, "prefabsCardGameTableController", void 0);
  __decorate([property(cc.Prefab)], GameController.prototype, "winEffectPrefab", void 0);
  __decorate([property(cc.Prefab)], GameController.prototype, "winTextEffectPrefab", void 0);
  return GameController = __decorate([ccclass], GameController);
}(cc.Component);
moduleExports.default = GameController;
void 0;
