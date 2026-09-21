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
var GameController = require("./GameController"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  GamePlayManager = require("./GamePlayManager"),
  BaCayMessage = require("./BaCayMessage"),
  BaCayScoreUI = require("./BaCayScoreUI"),
  MusicPlayer = require("./MusicPlayer"),
  GameCardSprite = require("./GameCardSprite"),
  GameCardSpriteType = require("./GameCardSpriteType"),
  GameZOrder = require("./GameZOrder"),
  BaCayRequest = require("./BaCayRequest"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  GameConfigManager = require("./GameConfigManager"),
  PoolManager = require("./PoolManager"),
  ChipCaoRuaController = require("./ChipCaoRuaController"),
  StringUtil = require("./StringUtil"),
  ParticleCaoRua = require("./ParticleCaoRua"),
  ProcessCountdown = require("./ProcessCountdown"),
  BaCayAnimExtratime = require("./BaCayAnimExtratime"),
  CardGameCommonRequest = require("./CardGameCommonRequest"),
  AnalyticsManager = require("./AnalyticsManager"),
  _decorator = cc._decorator,
  ccclass = _decorator.ccclass,
  property = _decorator.property,
  BaCayController = function(_super) {
    function BaCayController() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.baCayScene = null;
      _this.listPlayerCardPos = [];
      _this.listCardPositionExtratime = [];
      _this.listCardReview = [];
      _this.listCardMine = [];
      _this.listCardExtratime = [];
      _this.acps = [];
      _this.playerCardPosWhenDone = null;
      _this.prefabBaCayScoreUI = null;
      _this.prefabBaCayAnimExtratime = null;
      _this.nodeNanBai = null;
      _this.blackLayer = null;
      _this.processTimeCountdown = null;
      _this.chipController = null;
      _this.particleCaoRua = null;
      _this.btnFlipAllCard = null;
      _this.toggleAutoFlipAllCard = null;
      _this.poolLiengScoreUIName = "poolliengscoreui";
      _this.poolScoreUI = null;
      _this.listCardBacks = [];
      _this.totalCardFliped = 0;
      _this.isDidFlipAllCard = false;
      _this.cardSmallScale = .7;
      _this.currentCountDownTime = 0;
      _this.isPlaying = false;
      _this.daBaoBinh = false;
      _this.listEffect = [];
      _this.listEffectSoChi = [];
      _this.timeAutoSendDataDefault = 1.9;
      _this.timeAutoSendData = 1.9;
      _this.animMatchExtratime = null;
      _this.isAutoFlipCard = false;
      _this.isAutoFlipCardTarget = false;
      _this.betOfTable = 100;
      _this.isSameSuit = -1;
      _this.configCaoRua = null;
      _this.enableKickUserIfNotInteract = true;
      _this.amountMatchShowPopNotInteract = 5;
      _this.amountMatchKickUserAffterNotInteract = 3;
      _this.bonusJQKHeartMultiply = 3;
      _this.countMatch = 0;
      return _this;
    }
    __extends(BaCayController, _super);
    BaCayController.prototype.initDefaultData = function() {
      _super.prototype.initDefaultData.call(this);
      if (GameConfigManager.default.getInstance().isAnDanh) {
        this.isGameAnDanh = false;
        this.isGameAnDanhCheck = false;
      }
      this.node.stopAllActions();
      this.removeEffect();
      this.listEffect.forEach(function(effect) {
        effect.destroy();
      });
      this.listEffect = [];
      this.daBaoBinh = false;
      this.isPlaying = false;
    };
    BaCayController.prototype.onLoad = function() {
      _super.prototype.onLoad.call(this);
      this.POS2 = [];
      this.POS2.push(0);
      this.POS2.push(3);
      this.POS3 = [];
      this.POS3.push(0);
      this.POS3.push(3);
      this.POS3.push(6);
      this.POS4 = [];
      this.POS4.push(0);
      this.POS4.push(3);
      this.POS4.push(6);
      this.POS4.push(4);
      this.POS5 = [];
      this.POS5.push(0);
      this.POS5.push(3);
      this.POS5.push(6);
      this.POS5.push(4);
      this.POS5.push(5);
      this.POS6 = [];
      this.POS6.push(0);
      this.POS6.push(3);
      this.POS6.push(6);
      this.POS6.push(4);
      this.POS6.push(5);
      this.POS6.push(2);
      this.POS7 = [];
      this.POS7.push(0);
      this.POS7.push(3);
      this.POS7.push(6);
      this.POS7.push(4);
      this.POS7.push(5);
      this.POS7.push(2);
      this.POS7.push(7);
      this.POS8 = [];
      this.POS8.push(0);
      this.POS8.push(3);
      this.POS8.push(6);
      this.POS8.push(4);
      this.POS8.push(5);
      this.POS8.push(2);
      this.POS8.push(7);
      this.POS8.push(1);
      this.POS9 = [];
      this.POS9.push(0);
      this.POS9.push(5);
      this.POS9.push(4);
      this.POS9.push(7);
      this.POS9.push(2);
      this.POS9.push(6);
      this.POS9.push(3);
      this.POS9.push(8);
      this.POS9.push(1);
      var cardNode = cc.instantiate(this.prefabsGameCard),
        cardSprite = cardNode.getComponent(GameCardSprite.default);
      cardSprite.init(GameCardSpriteType.default.TypeBIG);
      this.cardSizeBig = new cc.Vec2(cardNode.getContentSize().width * cardNode.scale, cardNode.getContentSize().height * cardNode.scale);
      cardSprite.init(GameCardSpriteType.default.TypeHIDE);
      this.cardSizeHiden = new cc.Vec2(cardNode.getContentSize().width * cardNode.scale, cardNode.getContentSize().height * cardNode.scale);
      cardSprite.init(GameCardSpriteType.default.TypeMEDIUM);
      this.cardSizeMedium = new cc.Vec2(cardNode.getContentSize().width * cardNode.scale, cardNode.getContentSize().height * cardNode.scale);
      cardNode.destroy();
      this.distanceCard = new cc.Vec2(.4 * this.cardSizeMedium.x, .5 * this.cardSizeMedium.y);
      this.poolScoreUI = PoolManager.PoolManager.getInstance().addPool(this.poolLiengScoreUIName, new PoolManager.PoolComponent());
      this.toggleAutoFlipAllCard.node.position = new cc.Vec2(-cc.winSize.width / 2 + 100, -cc.winSize.height / 2 + 60);
      if (null == this.configCaoRua && null != GameConfigManager.default.getInstance().remoteConfig && GameConfigManager.default.getInstance().remoteConfig
        .hasOwnProperty("configCaoRua")) {
        this.configCaoRua = GameConfigManager.default.getInstance().remoteConfig.configCaoRua;
        if (this.configCaoRua.hasOwnProperty("amountMatchShowPopNotInteract")) {
          this.amountMatchShowPopNotInteract = this.configCaoRua.amountMatchShowPopNotInteract;
        }
        if (this.configCaoRua.hasOwnProperty("amountMatchKickUserAffterNotInteract")) {
          this.amountMatchKickUserAffterNotInteract = this.configCaoRua.amountMatchKickUserAffterNotInteract;
        }
        if (this.configCaoRua.hasOwnProperty("enableKickUserIfNotInteract")) {
          this.enableKickUserIfNotInteract = this.configCaoRua.enableKickUserIfNotInteract;
        }
      }
    };
    BaCayController.prototype.onDestroy = function() {
      if (null != this.poolScoreUI) {
        this.poolScoreUI.clear();
      }
    };
    BaCayController.prototype.getTag = function() {
      return "caorua";
    };
    BaCayController.prototype.resetNanBai = function() {
      this.nodeNanBai.active = false;
      this.blackLayer.active = true;
      this.blackLayer.opacity = 179;
    };
    BaCayController.prototype.resetProcessCountdown = function() {
      0;
    };
    BaCayController.prototype.startProcessCountdown = function(durationSeconds) {
      this.btnFlipAllCard.angle = 0;
      this.btnFlipAllCard.opacity = 0;
      this.btnFlipAllCard.stopAllActions();
      this.btnFlipAllCard.runAction(cc.sequence(cc.delayTime(3), cc.fadeIn(.3)));
      this.btnFlipAllCard.runAction(cc.sequence(cc.delayTime(durationSeconds - 1.5), cc.rotateTo(.2, 15).easing(cc.easeBackInOut()), cc.rotateTo(.2, 0)
        .easing(cc.easeBounceOut())));
    };
    BaCayController.prototype.stopProcessCountdown = function() {
      0;
    };
    BaCayController.prototype.onReceiveMessage = function(cmd, messageArray, messageData) {
      switch (_super.prototype.onReceiveMessage.call(this, cmd, messageArray, messageData), cmd) {
        case BaCayMessage.default.DEAL_CARDS:
        case BaCayMessage.default.UPDATE_ARRANGE_CARDS_STATE:
        case BaCayMessage.default.FINISH_GAME:
        case BaCayMessage.default.START_BETTING:
        case BaCayMessage.default.REARRANGE_CARDS:
        case BaCayMessage.default.INFORM_ROYALTIES:
        case BaCayMessage.default.UPDATE_CURRENT_CARDS_STATE:
        case BaCayMessage.default.ARRANGED:
          this.onBaCayEventReciveHandle(messageArray, messageData);
      }
    };
    BaCayController.prototype.onBaCayEventReciveHandle = function(messageArray, messageData) {
      if (null !== messageData && void 0 !== messageData) {
        switch (messageData.cmd) {
          case BaCayMessage.default.DEAL_CARDS:
            this.isAutoFlipCard = this.isAutoFlipCardTarget;
            var myCardCodes = messageData.cs,
              playingUserIds = messageData.lpi;
            this.startGame(myCardCodes, playingUserIds);
            this.startProcessCountdown(messageData.T / 1e3);
            break;
          case BaCayMessage.default.START_BETTING:
            var bettingSeconds = messageData.T;
            bettingSeconds /= 1e3;
            this.hideALLForStart();
            this.startBetting(bettingSeconds);
            this.chipController.ClearAllChipInTable();
            this.resetNanBai();
            this.checkAndClearCardOfMine();
            break;
          case BaCayMessage.default.UPDATE_ARRANGE_CARDS_STATE:
            messageData.uid;
            messageData.iar;
            null !== messageData.r && void 0 !== messageData.r && parseInt(messageData.r);
            break;
          case BaCayMessage.default.FINISH_GAME:
            this.finishThisGame(messageData);
            break;
          case BaCayMessage.default.ARRANGED:
            this.Arranged(messageData);
        }
      }
    };
    BaCayController.prototype.checkAndClearCardOfMine = function() {
      for (var cardIndex = 0; cardIndex < this.listCardMine.length; cardIndex++) {
        this.listCardMine[cardIndex].node.active = false;
      }
      this.playersPlaying.forEach(function(player) {
        if (null != player && void 0 != player) {
          player.hideAllCard(false);
        }
      });
    };
    BaCayController.prototype.onSwitchButtonAutoFlipAllCard = function(toggle, customEventData) {
      this.isAutoFlipCardTarget = toggle.isChecked;
      if (this.isAutoFlipCardTarget) {
        AnalyticsManager.default.getInstance().logEvent("UserUseAutoFlipAllCard");
      } else {
        AnalyticsManager.default.getInstance().logEvent("UserNotUseAutoFlipAllCard");
      }
    };
    BaCayController.prototype.onGetInGameTableInfo = function(tableInfo) {
      this.isAutoFlipCardTarget = false;
      this.toggleAutoFlipAllCard.isChecked = false;
      this.isAutoFlipCard = false;
      this.resetCardReview();
      this.reset();
      this.chipController.ClearAllChipInTable();
      this.hideAllCard();
      this.resetNanBai();
      this.resetProcessCountdown();
      _super.prototype.onGetInGameTableInfo.call(this, tableInfo);
      var bet = tableInfo.b,
        gameState = tableInfo.gS,
        remainTimeSeconds = tableInfo.rmT;
      remainTimeSeconds /= 1e3;
      var assetId = tableInfo.aid;
      this.maxUserInRoom = tableInfo.Mu;
      var hasPassword = false;
      if (null !== tableInfo.hpwd && void 0 !== tableInfo.hpwd) {
        hasPassword = tableInfo.hpwd;
      }
      this.state = MessageCardGameHandler.GameState.WAITING;
      if (!(4 !== gameState && 5 !== gameState)) {
        this.state = MessageCardGameHandler.GameState.VIEWING;
      }
      this.setGameConfig(bet, gameState, remainTimeSeconds, assetId, this.maxUserInRoom, hasPassword);
      var playerInfos = tableInfo.ps;
      if (this.createListPlayerWhenGetTableInfo(playerInfos), this.updateViewPostions(true), this.state === MessageCardGameHandler.GameState.VIEWING) {
        if (null !== tableInfo.re && void 0 !== tableInfo.re && tableInfo.re) {
          // `betUserCount` gánh HAI vai, và điều đó chỉ an toàn nhờ cái `break` bên dưới:
          //   · khởi đầu = playerInfos.length — vừa làm CẬN VÒNG LẶP, vừa làm giá trị MẶC ĐỊNH
          //     cho số người vẽ chip (dùng khi không tìm thấy mình trong danh sách);
          //   · tìm thấy mình thì bị gán đè bằng `playerInfo.rr` — tức GÁN ĐÈ ĐÚNG CẬN CỦA VÒNG
          //     LẶP ĐANG CHẠY. Không nổ, chỉ vì ngay sau đó là `break`.
          // Đã cân nhắc tách làm hai biến rồi quyết KHÔNG: người đọc vẫn phải nhìn thấy cái
          // `break` mới yên tâm, nên tách chỉ thêm một biến chứ không thêm bảo đảm nào.
          // 🔴 Ai bỏ `break` đi thì PHẢI tách biến trước.
          for (var myCardCodes, betUserCount = playerInfos.length, playerIndex = 0; playerIndex < betUserCount; playerIndex++) {
            var playerInfo = playerInfos[playerIndex];
            if (0 === playerInfo.uid.localeCompare(GamePlayManager.default.getInstance().userID)) {
              myCardCodes = playerInfo.cs;
              if (null !== playerInfo.rr && void 0 !== playerInfo.rr) {
                betUserCount = playerInfo.rr;
              }
              break;
            }
          }
          this.reconnectLastGame(myCardCodes, betUserCount);
          this.updateViewingPlayerPositions();
        } else {
          this.chipController.ClearAllChipInTable();
          this.chipController.BetForUserReconect(this.players.length, this.betOfTable);
          this.showViewTableMessage();
        }
        if (this.initPlayerCardsViewing(), null !== tableInfo.re && void 0 !== tableInfo.re && tableInfo.re && this.showuserAnDanh(), null !== tableInfo.fi && void 0 !==
          tableInfo.fi) {
          var finishInfo = tableInfo.fi;
          if (finishInfo.ps.length > 0) {
            this.finishThisGame(finishInfo, true);
          }
        }
      } else {
        this.startBetting(remainTimeSeconds);
      }
      this.updateReadyStatus();
      this.countMatch = 0;
    };
    BaCayController.prototype.removeInviteBtnsInList = function(index) {
      this.inviteBtns.splice(index, 1);
    };
    BaCayController.prototype.getRmcDefaul = function() {
      return 3;
    };
    BaCayController.prototype.checkReconnect = function(playerInfo) {
      return playerInfo.uid.localeCompare(GamePlayManager.default.getInstance().userID) && null !== playerInfo.re && void 0 !== playerInfo.re && false === playerInfo.re;
    };
    BaCayController.prototype.reset = function() {
      this.acps = [];
      for (var scoreUIsInUse = this.poolScoreUI.listObjectUsing, index = 0; index < scoreUIsInUse.length; index++) {
        scoreUIsInUse[index].hide();
      }
      if (null != this.poolScoreUI) {
        this.poolScoreUI.clear();
      }
      this.resetCardReview();
      if (null != this.animMatchExtratime) {
        this.animMatchExtratime.node.removeFromParent(true);
      }
      for (index = 0; index < this.listCardExtratime.length; index++) {
        this.listCardExtratime[index].node.removeFromParent(true);
      }
    };
    BaCayController.prototype.resetCardReview = function() {
      if (this.listCardReview.length > 0) {
        for (var index = 0; index < this.listCardReview.length; index++) {
          this.listCardReview[index].node.active = false;
          this.listCardReview[index].reset();
        }
      }
    };
    BaCayController.prototype.flipCloseCardReview = function() {
      if (this.listCardReview.length > 0) {
        for (var index = 0; index < this.listCardReview.length; index++) {
          this.listCardReview[index].runActionFlipCloseCard2();
        }
      }
    };
    BaCayController.prototype.flipCloseCardOfMine = function(player) {
      for (var cardIndex = 0; cardIndex < player.cards.length; cardIndex++) {
        player.cards[cardIndex].runActionFlipCloseCard2();
      }
    };
    BaCayController.prototype.reconnectLastGame = function(cardCodes, betUserCount) {
      this.chipController.ClearAllChipInTable();
      this.chipController.BetForUserReconect(betUserCount, this.betOfTable);
      this.showuserAnDanh();
      this.state = MessageCardGameHandler.GameState.PLAYING;
      this._playedOnce = true;
      this.daBaoBinh = false;
      var myPlayer = this._thisPlayerView;
      myPlayer.node.stopAllActions();
      myPlayer.node.position = this.listBtnInvitePos[0].position;
      for (var cardIndex = 0; cardIndex < cardCodes.length; cardIndex++) {
        var cardCode = cardCodes[cardIndex];
        (card = myPlayer.cards[cardCodes.length - cardIndex - 1]).setType(GameCardSpriteType.default.TypeMEDIUM);
        card.setTextureWithCode(cardCode, GamePlayManager.default.getInstance().gameID);
        card.node.active = true;
      }
      for (cardIndex = 0; cardIndex < 3; ++cardIndex) {
        var card;
        (card = myPlayer.cards[cardIndex]).index = cardIndex;
        card.node.position = this.getPlayerCardPositionMineBig(0, cardIndex);
        card.setType(GameCardSpriteType.default.TypeBIG);
        card.node.zIndex = GameZOrder.default.MIDDLE_TOP_2 + (3 - cardIndex) + 1;
      }
    };
    BaCayController.prototype.getViewPositionOfPlayer = function(player, index) {
      if (player.isMine()) {
        player.indexPos = 0;
        return this.inviteBtns[player.indexPos].position;
      }
      if (player.indexPos > 0) {
        return this.inviteBtns[player.indexPos].position;
      }
      for (var posIndex = 1; posIndex < this.POS9.length; ++posIndex) {
        if (this.inviteBtns[this.POS9[posIndex]].active) {
          player.indexPos = this.POS9[posIndex];
          this.inviteBtns[this.POS9[posIndex]].active = false;
          return this.inviteBtns[player.indexPos].position;
        }
      }
    };
    BaCayController.prototype.addPlayer = function(displayName, userID, isHost, money, playerState, remainingCards, sit, isReady, pid, isAtTable, assets, avatar, accountId) {
      var player = _super.prototype.addPlayer.call(this, displayName, userID, isHost, money, playerState, remainingCards, sit, isReady, pid, isAtTable, assets, avatar, accountId);
      player.iniBaCayCard(this.prefabsGameCard);
      return player;
    };
    BaCayController.prototype.hideALLForStart = function() {
      this.node.stopAllActions();
      this.players.forEach(function(player) {
        player.hideAllCard(false);
        player.removeBubbleFx();
      });
    };
    BaCayController.prototype.startGame = function(myCardCodes, playingUserIds) {
      var _this = this;
      MusicPlayer.default.getInstance().playEffect("Sounds/chiabai");
      this.hideALLForStart();
      try {
        if (null != this.popupHasPlayerNotReady) {
          this.popupHasPlayerNotReady.hide();
        }
      } catch (err) {}
      if (this._dangKetThuc && this.handlePendingPlayers(), this._dangPhatBai = true, this.listCardMine = [], this.totalCardFliped = 0,
        this.isDidFlipAllCard = false, this.cardGameTableController.startGameUI(), this.locPlayingPlayer(playingUserIds), this.state = MessageCardGameHandler.GameState
        .PLAYING, null !== this._thisPlayerView && void 0 !== this._thisPlayerView && myCardCodes.length > 0) {
        this._thisPlayerView.setArrayCard(myCardCodes, false);
        for (var suits = [], cardIndex = 0; cardIndex < this._thisPlayerView.cards.length; ++cardIndex) {
          var card = this._thisPlayerView.cards[cardIndex];
          card.decodeCard(myCardCodes[myCardCodes.length - 1 - cardIndex], GamePlayManager.default.getInstance().gameID);
          card.index = cardIndex;
          if (this._thisPlayerView.isMine()) {
            suits.push(card.getSuit());
          }
        }
        for (var suitIndex = 1; suitIndex < suits.length; suitIndex++) {
          if (suits[0] != suits[suitIndex]) {
            this.isSameSuit = -1;
            break;
          }
          this.isSameSuit = suits[0];
        }
      }
      this.chipController.BetForAllUser(this.playersPlaying, this.betOfTable);
      this.node.runAction(cc.sequence(cc.delayTime(1.1), cc.callFunc(function() {
        _this.dealCardForPlayer(myCardCodes);
      })));
    };
    BaCayController.prototype.dealCardForPlayer = function(myCardCodes) {
      for (var _this = this, playerIndex = 0; playerIndex < this.players.length; ++playerIndex) {
        var player = this.players[playerIndex];
        player.iconnReady.active = false;
        player.isHost;
      }
      for (playerIndex = 0; playerIndex < this.playersPlaying.length; playerIndex++) {
        var playingPlayer = this.playersPlaying[playerIndex],
          isMine = playingPlayer.isMine();
        if (true !== isMine || 0 !== myCardCodes.length) {
          for (var extraFlipDelay = 0, cardIndex = 0; cardIndex < playingPlayer.cards.length; ++cardIndex) {
            var card = playingPlayer.cards[cardIndex];
            card.node.active = true;
            var moveDuration = .6,
              dealDelay = 1 - (.2 + .1 * cardIndex),
              dealAction = null;
            if (isMine) {
              this.listCardMine.push(card);
              var targetPos = this.getPlayerCardPositionMineBig(playingPlayer.indexPos, cardIndex),
                distance = targetPos.mag();
              card.setType(GameCardSpriteType.default.TypeBIG);
              card.node.zIndex = GameZOrder.default.MIDDLE_TOP_2 + (3 - cardIndex) + 1;
              moveDuration = distance / 1300;
              if (this.isAutoFlipCard) {
                dealAction = cc.sequence(cc.delayTime(dealDelay), cc.callFunc(this.phatBaiFX, this, card), cc.moveTo(moveDuration, targetPos));
                card.runActionFlip2(dealDelay + moveDuration + extraFlipDelay + .2);
                extraFlipDelay += .05;
              } else {
                dealAction = cc.sequence(cc.delayTime(dealDelay), cc.callFunc(this.phatBaiFX, this, card), cc.moveTo(moveDuration, targetPos), cc.fadeOut(0));
                this.createCardReview(card.serverCode, cardIndex, targetPos, card.node.scale, dealDelay + moveDuration);
              }
              card.node.runAction(dealAction);
            } else {
              card.setType(GameCardSpriteType.default.TypeMEDIUM);
              dealAction = cc.sequence(cc.delayTime(dealDelay), cc.moveTo(moveDuration, this.getPlayerCardPosition(playingPlayer.indexPos, cardIndex, this.distanceCard)).easing(cc
                .easeBackOut()));
              card.node.runAction(dealAction);
            }
            card.node.eulerAngles = new cc.Vec3(-23, 0, 0);
            card.Rotationby(dealDelay, moveDuration, 23, false);
          }
        }
      }
      this.node.runAction(cc.sequence(cc.delayTime(1.16 + .2), cc.callFunc(function() {
        _this.finishPhatBai();
      }), cc.delayTime(.2), cc.callFunc(function() {
        if (_this.isAutoFlipCard) {
          for (var playerIndex = 0; playerIndex < _this.playersPlaying.length; playerIndex++) {
            if (_this.playersPlaying[playerIndex].isMine() && _this.isAutoFlipCard && myCardCodes.length > 0) {
              _this.sendArayArranged(myCardCodes);
            }
          }
        }
      })));
      this.showuserAnDanh();
    };
    BaCayController.prototype.dealCardForExtraTime = function(node, extraCardInfos) {
      var _this = this;
      if (0 != extraCardInfos.length) {
        for (var dealOneExtraCard = function(infoIndex) {
            var cardInfo = extraCardInfos[infoIndex],
              player = _this.getPlayer(cardInfo.uid),
              card = null;
            (card = cc.instantiate(_this.prefabsGameCard).getComponent(GameCardSprite.default)).node.parent = _this.node;
            if (player.isMine()) {
              card.init(GameCardSpriteType.default.TypeBIG);
              card.node.zIndex = GameZOrder.default.TOP + 10;
            } else {
              card.init(GameCardSpriteType.default.TypeMEDIUM);
              card.node.zIndex = GameZOrder.default.MIDDLE_TOP_2 + 10;
            }
            card.setServerCode(cardInfo.cs);
            _this.listCardExtratime.push(card);
            var moveAction = cc.moveTo(.3, _this.getPlayerCardExtratimePosition(player.indexPos, 0, new cc.Vec2(0, 0))),
              cardAction = cc.sequence(moveAction, cc.delayTime(.1), cc.callFunc(function() {
                if (_this.state === MessageCardGameHandler.GameState.PLAYING) {
                  card.runActionFlip2();
                }
              }), cc.delayTime(.3), cc.callFunc(function() {
                if (_this.state === MessageCardGameHandler.GameState.PLAYING) {
                  _this.addScoreUIForExtratime(player, _this.getScoreOfCard(card));
                }
              }), cc.delayTime(2.5), cc.callFunc(function() {
                card.node.runAction(cc.removeSelf(true));
              }));
            card.node.runAction(cardAction);
          }, index = 0; index < extraCardInfos.length; index++) {
          dealOneExtraCard(index);
        }
      }
    };
    BaCayController.prototype.openCard = function(node, card) {
      if (null != card && void 0 != card) {
        card.runActionFlip2();
      }
    };
    BaCayController.prototype.finishMathExtratime = function(node, card) {
      card.node.runAction(cc.removeSelf(true));
    };
    BaCayController.prototype.createCardReview = function(cardCode, cardIndex, targetPos, scale, delay) {
      var slotIndex = cardIndex,
        reviewNode = null;
      if (3 != this.listCardReview.length) {
        reviewNode = cc.instantiate(this.prefabsGameCard);
        this.listCardReview.push(reviewNode.getComponent(GameCardSprite.default));
      } else {
        reviewNode = this.listCardReview[slotIndex].node;
      }
      var backNode = cc.instantiate(this.prefabsGameCard);
      backNode.getComponent(GameCardSprite.default).setServerCode(cardCode);
      backNode.getComponent(GameCardSprite.default).enableTouch(this.callBackCardFlip.bind(this), true);
      backNode.getComponent(GameCardSprite.default).isFading = false;
      backNode.active = true;
      backNode.opacity = 255;
      backNode.position = cc.Vec2.ZERO;
      backNode.parent = reviewNode;
      this.listCardBacks.push(backNode);
      reviewNode.parent = this.node;
      reviewNode.opacity = 0;
      reviewNode.setPosition(targetPos.x, targetPos.y);
      reviewNode.active = true;
      reviewNode.zIndex = GameZOrder.default.TOP_MOST + (3 - cardIndex) + 1;
      var reviewCard = reviewNode.getComponent(GameCardSprite.default);
      reviewCard.node.width;
      reviewCard.setType(GameCardSpriteType.default.TypeBIG);
      reviewCard.setTextureWithCode(cardCode, GamePlayManager.default.getInstance().gameID);
      reviewNode.scale;
      var scaledCardWidth = 1.5 * reviewCard.cardSprite.node.width;
      backNode.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function() {
        reviewNode.opacity = 255;
      })));
      reviewNode.setScale(scale);
      reviewNode.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function() {
        MusicPlayer.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_preflop_card_distribution");
      }), cc.delayTime(.6), cc.callFunc(function() {
        if (0 == this.blackLayer.opacity) {
          this.blackLayer.opacity = 1;
          this.blackLayer.stopAllActions();
          this.blackLayer.runAction(cc.fadeTo(.2, 179));
        }
        this.nodeNanBai.active = true;
        this.nodeNanBai.zIndex = GameZOrder.default.TOP_MOST;
        var moveAction = cc.moveTo(.25, new cc.Vec2((2 - slotIndex) * (scaledCardWidth + 30) - 30 - scaledCardWidth, 0));
        moveAction.easing(cc.easeBackOut());
        var scaleAction = cc.scaleTo(.25, 1.5);
        scaleAction.easing(cc.easeBackOut());
        reviewNode.runAction(moveAction);
        reviewNode.runAction(scaleAction);
      }.bind(this))));
    };
    BaCayController.prototype.playParticleCard = function() {
      if (-1 != this.isSameSuit) {
        if (1 == this.isSameSuit) {
          this.particleCaoRua.PlayParticle(ParticleCaoRua.TypeParticleCard.SPADE);
        } else {
          if (2 == this.isSameSuit) {
            this.particleCaoRua.PlayParticle(ParticleCaoRua.TypeParticleCard.CLUB);
          } else {
            if (3 == this.isSameSuit) {
              this.particleCaoRua.PlayParticle(ParticleCaoRua.TypeParticleCard.DIAMOND);
            } else {
              if (4 == this.isSameSuit) {
                this.particleCaoRua.PlayParticle(ParticleCaoRua.TypeParticleCard.HEART);
              }
            }
          }
        }
      }
    };
    BaCayController.prototype.callBackCardFlip = function(card) {
      this.totalCardFliped++;
      if (this.totalCardFliped >= 3) {
        this.flipAllCard();
        AnalyticsManager.default.getInstance().logEvent("ShowAllCardCaoRua", JSON.parse('{"ShowCard":"ViewCardLittleByLittle"}'));
      }
      this.sendArranged(card.serverCode);
      GamePlayManager.default.getInstance().countMatchNotInteract = 0;
    };
    BaCayController.prototype.buttonFlipAllCardClick = function() {
      this.flipAllCard();
      for (var cardCodes = [], playerIndex = 0; playerIndex < this.playersPlaying.length; ++playerIndex) {
        var player = this.playersPlaying[playerIndex];
        if (player.isMine() && this.state === MessageCardGameHandler.GameState.PLAYING) {
          for (var cardIndex = 0; cardIndex < player.cards.length; cardIndex++) {
            cardCodes.push(player.cards[cardIndex].serverCode);
          }
          break;
        }
      }
      this.sendArayArranged(cardCodes);
      GamePlayManager.default.getInstance().countMatchNotInteract = 0;
      AnalyticsManager.default.getInstance().logEvent("ShowAllCardCaoRua", JSON.parse('{"ShowCard":"ClickButtonShowAll"}'));
    };
    BaCayController.prototype.flipAllCard = function(withAnimation) {
      if (void 0 === withAnimation) {
        withAnimation = true;
      }
      this.nodeNanBai.active = false;
      this.showAnim3TayOfMe();
      for (var reviewIndex = 0; reviewIndex < this.listCardReview.length; reviewIndex++) {
        if (this.listCardReview[reviewIndex].node.scale > this.cardSmallScale) {
          this.isDidFlipAllCard = false;
          break;
        }
      }
      if (!this.isDidFlipAllCard && null != this._thisPlayerView) {
        MusicPlayer.default.getInstance().playbtnClick();
        this.isDidFlipAllCard = true;
        for (var backIndex = 0; backIndex < this.listCardBacks.length; backIndex++) {
          this.listCardBacks[backIndex].destroy();
        }
        this.listCardBacks = [];
        this.endFlipCard(withAnimation);
        for (var playerIndex = 0; playerIndex < this.playersPlaying.length; ++playerIndex) {
          if (this.playersPlaying[playerIndex].isMine() && this.state === MessageCardGameHandler.GameState.PLAYING) {
            this._khongThaoTac = false;
            break;
          }
        }
      }
    };
    BaCayController.prototype.endFlipCard = function(withAnimation) {
      if (void 0 === withAnimation) {
        withAnimation = true;
      }
      this.blackLayer.runAction(cc.fadeOut(.2));
      this.nodeNanBai.active = false;
      this.listBtnInvitePos[0].position;
      for (var delay = 0, reviewIndex = this.listCardReview.length - 1; reviewIndex >= 0; reviewIndex--) {
        var reviewCard = this.listCardReview[reviewIndex];
        reviewCard.node.zIndex = GameZOrder.default.TOP;
        if (null != this.listCardMine[reviewIndex]) {
          reviewCard.node.runAction(cc.sequence(cc.delayTime(delay), cc.moveTo(.35, this.listCardMine[reviewIndex].node.position).easing(cc.easeBackOut())));
          reviewCard.node.runAction(cc.sequence(cc.delayTime(delay), cc.scaleTo(.35, this.listCardMine[reviewIndex].node.scale).easing(cc.easeBackOut())));
          delay += .075;
        }
      }
    };
    BaCayController.prototype.phatBaiFX = function(node, card) {
      card.node.active = true;
      card.node.opacity = 255;
    };
    BaCayController.prototype.onClickXepLai = function() {
      BaCayRequest.default.getInstance().sendRearrangeCards();
    };
    BaCayController.prototype.finishPhatBai = function() {
      this._dangPhatBai = false;
      if (!this._thisPlayerView.checkInThisArray(this.playersPlaying)) {
        this.state = MessageCardGameHandler.GameState.VIEWING;
      }
      this.players.forEach(function(player) {
        player.isMine();
      });
    };
    BaCayController.prototype.Arranged = function(messageData) {
      var player = this.getPlayer(messageData.uid);
      if (!player.isMine() && null !== player && void 0 !== player) {
        for (var newCardCodes = [], openCardCodes = this.getListCardOpenOfPlayer(player), cardIndex = 0; cardIndex < messageData.cs.length; cardIndex++) {
          for (var isAlreadyOpen = false, codeIndex = 0; codeIndex < openCardCodes.length; codeIndex++) {
            if (messageData.cs[cardIndex] == openCardCodes[codeIndex]) {
              isAlreadyOpen = true;
              break;
            }
          }
          if (0 == isAlreadyOpen) {
            newCardCodes.push(messageData.cs[cardIndex]);
          }
        }
        var flipDelay = 0;
        for (codeIndex = 0; codeIndex < messageData.cs.length; codeIndex++) {
          for (cardIndex = 0; cardIndex < player.cards.length; cardIndex++) {
            var card = player.cards[cardIndex];
            if (card.isCardBack) {
              card.setServerCode(newCardCodes[codeIndex]);
              card.runActionFlip2(flipDelay);
              flipDelay += .05;
              break;
            }
          }
        }
        if (this.checkListCardJqkHeart(this.getListCardOpenOfPlayer(player))) {
          player.showBonusMoneyFxForPlayer(this.bet * this.bonusJQKHeartMultiply, 2, .5);
        }
      }
    };
    BaCayController.prototype.getListCardOpenOfPlayer = function(player) {
      for (var codes = [], cardIndex = 0; cardIndex < player.cards.length; cardIndex++) {
        if (0 == player.cards[cardIndex].isCardBack) {
          codes.push(player.cards[cardIndex].serverCode);
        } else {
          codes.push(-1);
        }
      }
      return codes;
    };
    BaCayController.prototype.finishThisGame = function(messageData, isReconnect) {
      var _this = this;
      if (void 0 === isReconnect) {
        isReconnect = false;
      }
      this._dangKetThuc = true;
      for (var playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
        for (var isMine = (player = this.players[playerIndex]).isMine(), cardIndex = 0; cardIndex < player.cards.length; cardIndex++) {
          var card = player.cards[cardIndex];
          if (isMine) {
            card.node.zIndex = GameZOrder.default.MIDDLE_TOP_2 + (3 - cardIndex) + 1;
          }
        }
      }
      messageData.hb;
      messageData.hsc;
      messageData.hsh;
      messageData.hsl;
      var playerResults = messageData.ps;
      this.acps = messageData.acps;
      var finishSequence;
      for (playerIndex = 0; playerIndex < playerResults.length; playerIndex++) {
        var player,
          playerResult = playerResults[playerIndex],
          userID = playerResult.uid;
        if (null !== (player = this.getPlayer(userID)) && void 0 !== player) {
          player.isReady = false;
          player.mauBinhSoBai = false;
          var sortedCodes = this.sortCardArray(player, playerResult.cs);
          if (player.isMine()) {
            if (0 == this.isAutoFlipCard) {
              for (cardIndex = 0; cardIndex < sortedCodes.length && cardIndex < player.cards.length; cardIndex++) {
                cardCode = sortedCodes[cardIndex];
                (card = player.cards[sortedCodes.length - cardIndex - 1]).index = sortedCodes.length - cardIndex - 1;
                card.setServerCode(cardCode);
                card.setType(GameCardSpriteType.default.TypeBIG);
              }
            }
          } else {
            for (var cardIndex = 0; cardIndex < sortedCodes.length && cardIndex < player.cards.length; cardIndex++) {
              var cardCode = sortedCodes[cardIndex],
                card = player.cards[cardIndex];
              if (false === this.isGameAnDanhCheck) {
                card.setType(GameCardSpriteType.default.TypeMEDIUM);
                card.setServerCode(cardCode);
              }
            }
          }
          2;
          var winnings = playerResult.mX;
          if (player.isShowAnimBonusMoney) {
            winnings += this.bet * this.bonusJQKHeartMultiply;
          }
          player._winnings = winnings;
          winnings;
          var money = playerResult.m;
          if (player.isShowAnimBonusMoney) {
            money += this.bet * this.bonusJQKHeartMultiply;
          }
          player._money = money;
          var totalPoint = playerResult.tp;
          player.totalPoint = totalPoint;
        }
      }
      finishSequence = this.acps.length > 0 ? cc.sequence(cc.callFunc(this.showResult, this, 1), cc.delayTime(4), cc.callFunc(function() {
        for (var actions = [], index = 0; index < _this.acps.length; index++) {
          var showExtraTimeAction = cc.callFunc(_this.showResultExtraTime, _this),
            delayBeforeDeal = cc.delayTime(1),
            dealAction = cc.callFunc(_this.dealCardForExtraTime, _this, _this.acps[index]),
            delayAfterDeal = cc.delayTime(4);
          actions.push(showExtraTimeAction, delayBeforeDeal, dealAction, delayAfterDeal);
        }
        var extraTimeSequence = cc.sequence(actions);
        _this.node.runAction(extraTimeSequence);
      }), cc.delayTime(5 * this.acps.length), cc.callFunc(this.showResultTable, this), cc.delayTime(1), cc.callFunc(this
        .handlePendingPlayers, this)) : cc.sequence(cc.callFunc(this.showResult, this, 1), cc.delayTime(4), cc.callFunc(this
        .showResultTable, this), cc.delayTime(1), cc.callFunc(this.handlePendingPlayers, this));
      this.node.runAction(finishSequence);
      this.onEndGame();
    };
    BaCayController.prototype.hideAllCard = function() {
      for (var playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
        var player = this.players[playerIndex];
        if (!player.binhLung && !player.mauBinh) {
          for (var cardIndex = 0; cardIndex < player.cards.length; cardIndex++) {
            var card = player.cards[cardIndex];
            card.node.active = false;
            card.setColor(cc.Color.WHITE);
            card.node.stopAllActions();
          }
        }
      }
    };
    BaCayController.prototype.sortCardArray = function(player, serverCodes) {
      for (var sortedCodes = [], cardIndex = 0; cardIndex < player.cards.length; cardIndex++) {
        if (0 == player.cards[cardIndex].isCardBack) {
          sortedCodes.push(player.cards[cardIndex].serverCode);
        }
      }
      for (cardIndex = 0; cardIndex < player.cards.length; cardIndex++) {
        for (var isAlreadyAdded = false, sortedIndex = 0; sortedIndex < sortedCodes.length; sortedIndex++) {
          if (serverCodes[cardIndex] == sortedCodes[sortedIndex]) {
            isAlreadyAdded = true;
            break;
          }
        }
        if (0 == isAlreadyAdded) {
          sortedCodes.push(serverCodes[cardIndex]);
        }
      }
      sortedCodes.length;
      return sortedCodes;
    };
    BaCayController.prototype.showThis = function(node, nodeToShow) {
      nodeToShow.active = true;
    };
    BaCayController.prototype.setGrayColorThisCard = function(node, card) {
      card.setColor(cc.Color.GRAY);
      card.node.active = true;
      card.node.opacity = 255;
    };
    BaCayController.prototype.setHidenThisCard = function(node, card) {
      card.setColor(cc.Color.WHITE);
      card.setType(GameCardSpriteType.default.TypeHIDE);
      card.node.active = true;
      card.node.opacity = 255;
    };
    BaCayController.prototype.removeEffect = function() {
      this.listEffectSoChi.forEach(function(effect) {
        effect.destroy();
      });
      this.listEffectSoChi = [];
    };
    BaCayController.prototype.showResult = function(node, callFuncData) {
      if (0 == this.isDidFlipAllCard) {
        this.flipAllCard();
      }
      for (var otherPlayers = [], myPlayer = null, maxScore = this.getMaxScoreOfAllPlayer(), playerIndex = 0; playerIndex < this.playersPlaying.length; ++playerIndex) {
        var player = this.playersPlaying[playerIndex];
        if (!(player.isMine() && this.state === MessageCardGameHandler.GameState.VIEWING)) {
          if (this.state === MessageCardGameHandler.GameState.PLAYING) {
            if (player.isMine()) {
              myPlayer = player;
            } else {
              otherPlayers.push(player);
            }
          }
        }
      }
      if (this.state === MessageCardGameHandler.GameState.PLAYING) {
        var delay = 0,
          delayStep = 3 / this.playersPlaying.length,
          isSameScore = false,
          myScore = this.getTotalScore(myPlayer);
        if (maxScore == myScore && 999 != myScore && this.acps.length > 0) {
          isSameScore = true;
        }
        this.addScoreUI(myPlayer, false, delay, isSameScore, false);
        for (playerIndex = 0; playerIndex < otherPlayers.length; ++playerIndex) {
          if (this.checkCardJqkHeart(otherPlayers[playerIndex])) {
            otherPlayers[playerIndex].showBonusMoneyFxForPlayer(this.bet * this.bonusJQKHeartMultiply, 2, delay + .5);
          }
          var score = this.getTotalScore(otherPlayers[playerIndex]);
          isSameScore = false;
          if (maxScore == score && 999 != score && this.acps.length > 0) {
            isSameScore = true;
          }
          this.addScoreUI(otherPlayers[playerIndex], true, delay, isSameScore, false);
          delay += delayStep;
        }
      }
    };
    BaCayController.prototype.shuffleArray = function(array) {
      var randomIndex, temp, index;
      for (index = array.length - 1; index > 0; index--) {
        randomIndex = Math.floor(Math.random() * (index + 1));
        temp = array[index];
        array[index] = array[randomIndex];
        array[randomIndex] = temp;
      }
      return array;
    };
    BaCayController.prototype.addScoreUIForExtratime = function(player, score) {
      var scoreUI = cc.instantiate(this.prefabBaCayScoreUI).getComponent(BaCayScoreUI.default);
      scoreUI.setScore(score, true);
      scoreUI.node.parent = this.node;
      var cardPos = this.listCardPositionExtratime[player.indexPos].position;
      if (player.isMine()) {
        scoreUI.node.setPosition(cc.v2(cardPos.x, cardPos.y - 80));
      } else {
        scoreUI.node.setPosition(cc.v2(cardPos.x, cardPos.y - 70));
      }
      scoreUI.node.zIndex = GameZOrder.default.MIDDLE_TOP_2 + 94;
      scoreUI.node.opacity = 255;
      scoreUI.fade(0, 2.2, player.isMine(), false, false);
      scoreUI.setFadeOutCallback(function(pooledScoreUI) {
        this.poolScoreUI.addObject(pooledScoreUI);
      }.bind(this));
      this.poolScoreUI.addObjectUsing(scoreUI);
    };
    BaCayController.prototype.addScoreUI = function(player, revealByRank, delay, isSameScore, hasJqkHeart) {
      if (void 0 === revealByRank) {
        revealByRank = false;
      }
      if (void 0 === delay) {
        delay = -1;
      }
      var score = this.getTotalScore(player);
      if (!player.isMine() || 999 != score || 0 != revealByRank) {
        var scoreUI = cc.instantiate(this.prefabBaCayScoreUI).getComponent(BaCayScoreUI.default);
        scoreUI.setScore(score, true);
        scoreUI.node.parent = this.node;
        var cardPos = this.listPlayerCardPos[player.indexPos].position;
        if (player.isMine()) {
          scoreUI.node.setPosition(cc.v2(cardPos.x, cardPos.y - 90));
        } else {
          scoreUI.node.setPosition(cc.v2(cardPos.x - 40, cardPos.y - 140));
        }
        scoreUI.node.y += 60;
        scoreUI.node.zIndex = GameZOrder.default.TOP_MOST;
        scoreUI.node.opacity = 255;
        var fadeDelay = delay;
        if (1 == revealByRank) {
          fadeDelay = this.getDelayTime(score);
          fadeDelay += 1;
        }
        var extraDuration = 0;
        if (player.isMine() && 999 == score && revealByRank) {
          fadeDelay = 0;
          extraDuration = 1;
          scoreUI.node.x -= 100;
          scoreUI.node.y += 280;
        }
        if (!(player.isMine() && this.isCardPlayerBack(player))) {
          this.flipCardOfPlayer(player, fadeDelay);
        }
        if (hasJqkHeart) {
          player.showBonusMoneyFxForPlayer(this.bet * this.bonusJQKHeartMultiply, 2, 2.5);
        }
        fadeDelay += .2;
        scoreUI.fade(fadeDelay, 2 + extraDuration, player.isMine(), isSameScore, hasJqkHeart);
        scoreUI.setFadeOutCallback(function(pooledScoreUI) {
          this.poolScoreUI.addObject(pooledScoreUI);
        }.bind(this));
        this.poolScoreUI.addObjectUsing(scoreUI);
      }
    };
    BaCayController.prototype.showScoreOfMe = function() {
      for (var playerIndex = 0; playerIndex < this.playersPlaying.length; ++playerIndex) {
        var player = this.playersPlaying[playerIndex];
        if (player.isMine()) {
          return void this.addScoreUI(player, false, 0, false, false);
        }
      }
    };
    BaCayController.prototype.showAnim3TayOfMe = function() {
      for (var score = 0, playerIndex = 0; playerIndex < this.playersPlaying.length; ++playerIndex) {
        var player = this.playersPlaying[playerIndex];
        score = this.getTotalScore(player);
        var hasJqkHeart = this.checkCardJqkHeart(player);
        if (999 == score && player.isMine()) {
          return void this.addScoreUI(player, true, 0, false, hasJqkHeart);
        }
      }
    };
    BaCayController.prototype.getUserIDOfMine = function() {
      for (var playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
        var player = this.players[playerIndex];
        if (player.isMine()) {
          return player.userID;
        }
      }
      return "0";
    };
    BaCayController.prototype.sendArranged = function(cardCode) {
      if (void 0 === cardCode) {
        cardCode = -1;
      }
      CardGameCommonRequest.default.getInstance().sendArranged(BaCayMessage.default.ARRANGED, this.getUserIDOfMine(), cardCode);
    };
    BaCayController.prototype.sendArayArranged = function(cardCodes) {
      if (void 0 === cardCodes) {
        cardCodes = [];
      }
      CardGameCommonRequest.default.getInstance().sendArrayArranged(BaCayMessage.default.ARRANGED, this.getUserIDOfMine(), cardCodes);
    };
    BaCayController.prototype.getDelayTime = function(score) {
      var sortedScores = this.getTotalTypeScore(),
        rank = sortedScores.indexOf(score);
      if (rank < 0) {
        rank = 0;
      } else {
        if (rank > 9) {
          rank = 10;
        }
      }
      return rank * (2.5 / sortedScores.length);
    };
    BaCayController.prototype.getTotalTypeScore = function() {
      for (var scores = [], index = 0; index < this.playersPlaying.length; ++index) {
        var player = this.playersPlaying[index];
        if (0 == player.isMine()) {
          scores.push(this.getTotalScore(player));
        }
      }
      var uniqueScores = [];
      for (index = 0; index < scores.length; index++) {
        if (uniqueScores.indexOf(scores[index]) < 0) {
          uniqueScores.push(scores[index]);
        }
      }
      return uniqueScores.sort(function(scoreA, scoreB) {
        return scoreA - scoreB;
      });
    };
    BaCayController.prototype.flipCardOfPlayer = function(player, delay) {
      this.node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function() {
        for (var flipDelay = 0, cardIndex = 0; cardIndex < player.cards.length; ++cardIndex) {
          player.cards[cardIndex].runActionFlip2(flipDelay);
          flipDelay += .05;
        }
      })));
    };
    BaCayController.prototype.flipCloseCardOfPlayer = function(player, delay) {
      this.node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function() {
        for (var flipDelay = 0, cardIndex = 0; cardIndex < player.cards.length; ++cardIndex) {
          player.cards[cardIndex].runActionFlipCloseCard2(flipDelay);
          flipDelay += .05;
        }
      })));
    };
    BaCayController.prototype.isCardPlayerBack = function(player) {
      for (var cardIndex = 0; cardIndex < player.cards.length; ++cardIndex) {
        if (player.cards[cardIndex].isCardBack) {
          return true;
        }
      }
      return false;
    };
    BaCayController.prototype.checkCardJqkHeart = function(player) {
      for (var count = 0, cardIndex = 0; cardIndex < player.cards.length; ++cardIndex) {
        var cardCode = player.cards[cardIndex].serverCode;
        if (!(43 != cardCode && 47 != cardCode && 51 != cardCode)) {
          count++;
        }
      }
      return 3 == count;
    };
    BaCayController.prototype.checkListCardJqkHeart = function(cardCodes) {
      for (var count = 0, cardIndex = 0; cardIndex < cardCodes.length; ++cardIndex) {
        if (!(43 != cardCodes[cardIndex] && 47 != cardCodes[cardIndex] && 51 != cardCodes[cardIndex])) {
          count++;
        }
      }
      return 3 == count;
    };
    BaCayController.prototype.getTotalScore = function(player) {
      for (var score = 0, faceCount = 0, cardIndex = 0; cardIndex < player.cards.length; ++cardIndex) {
        var card = player.cards[cardIndex];
        if (14 == card.N) {
          score++;
        } else {
          if (card.N < 10) {
            score += card.N;
          } else {
            if (card.N > 10 && card.N <= 13) {
              faceCount++;
            }
          }
        }
      }
      score %= 10;
      if (3 == faceCount) {
        score = 999;
      }
      return score;
    };
    BaCayController.prototype.getScoreOfCard = function(card) {
      var score = 0;
      if (14 == card.N) {
        score++;
      } else {
        if (card.N < 10) {
          score += card.N;
        }
      }
      if (score > 10) {
        score %= 10;
      }
      return score;
    };
    BaCayController.prototype.showResultExtraTime = function() {
      var animExtratime = cc.instantiate(this.prefabBaCayAnimExtratime).getComponent(BaCayAnimExtratime.default);
      animExtratime.node.parent = this.particleCaoRua.node;
      animExtratime.node.zIndex = GameZOrder.default.TOP_MOST;
      animExtratime.showAnimDealCardExtratime();
      this.animMatchExtratime = animExtratime;
      for (var maxScore = this.getMaxScoreOfAllPlayer(), playerIndex = 0; playerIndex < this.players.length; ++playerIndex) {
        var player = this.players[playerIndex],
          score = this.getTotalScore(player);
        if (score < maxScore) {
          if (player.isMine()) {
            this.resetCardReview();
          } else {
            player.hideAllCard(false);
          }
        } else {
          if (score == maxScore && this.state === MessageCardGameHandler.GameState.PLAYING) {
            if (player.isMine()) {
              if (this.isAutoFlipCard) {
                this.flipCloseCardOfMine(player);
              } else {
                this.flipCloseCardReview();
              }
            } else {
              if (0 == this.isCardPlayerBack(player)) {
                this.flipCloseCardOfPlayer(player, 0);
              }
            }
          }
        }
      }
    };
    BaCayController.prototype.getMaxScoreOfAllPlayer = function() {
      for (var maxScore = -1, playerIndex = 0; playerIndex < this.players.length; ++playerIndex) {
        var player = this.players[playerIndex],
          score = this.getTotalScore(player);
        if (maxScore < score) {
          maxScore = score;
        }
      }
      return maxScore;
    };
    BaCayController.prototype.showResultTable = function() {
      this.removeEffect();
      MusicPlayer.default.getInstance().playEffect("Sounds/finished");
      this.updateReadyStatus();
      for (var winnerPositions = [], playerIndex = 0; playerIndex < this.players.length; ++playerIndex) {
        var player = this.players[playerIndex];
        if (player.removeBubbleFx(), this.state === MessageCardGameHandler.GameState.VIEWING && player.isMine()) {
          player.mauBinhSoBai = false;
        } else {
          player.setMoney(player._money);
          if (false === this.isGameAnDanhCheck) {
            player.showMoneyFxForPlayer(player._winnings, 3.5);
            if (player._winnings > 0) {
              player.runWinAction(3.5);
              winnerPositions.push(player.node.position);
            }
          }
          player._winnings = 0;
        }
      }
      if (this.chipController.setListPositionOfUser(winnerPositions), this.chipController.GetChipForUser(), this.countMatch++, this
        .enableKickUserIfNotInteract) {
        if (0 == this.isAutoFlipCard && GamePlayManager.default.getInstance().countMatchNotInteract++, GamePlayManager.default.getInstance().countMatchNotInteract ==
          this.amountMatchShowPopNotInteract) {
          CommonPrefabsManager.default.getInstance().showPopupOneMessage("TH\xd4NG B\xc1O", "Sau " + this.amountMatchKickUserAffterNotInteract +
            " v\xe1n \u0111\u1ea5u n\u1eefa b\u1ea1n s\u1ebd \u0111\u01b0\u1ee3c m\u1eddi ra kh\u1ecfi ph\xf2ng n\u1ebfu kh\xf4ng c\xf3 t\u01b0\u01a1ng t\xe1c!",
            null).setHideCallback(function() {
            GamePlayManager.default.getInstance().countMatchNotInteract = 0;
          });
        }
        if (GamePlayManager.default.getInstance().countMatchNotInteract == this.amountMatchShowPopNotInteract + this
          .amountMatchKickUserAffterNotInteract) {
          this.handleKickOutUser();
        }
      }
    };
    BaCayController.prototype.onUserClickExit = function() {
      _super.prototype.onUserClickExit.call(this);
      if (this.state != MessageCardGameHandler.GameState.PLAYING) {
        AnalyticsManager.default.getInstance().logEvent("UserLeaveRoomCaoRua", JSON.parse('{"AmountMatch":"' + this.countMatch + '"}'));
      }
    };
    BaCayController.prototype.handleKickOutUser = function() {
      if ((this._dangPhatBai || this.state === MessageCardGameHandler.GameState.PLAYING) && !this._subscribedToGetOut) {
        this._subscribedToGetOut = true;
        return void(null !== this._thisPlayerView && void 0 !== this._thisPlayerView && (this._thisPlayerView.iconQuit.active = true));
      }
      if (null !== this._thisPlayerView && void 0 !== this._thisPlayerView) {
        this._thisPlayerView.iconQuit.active = true;
      }
      GamePlayManager.default.getInstance().countMatchNotInteract = 0;
      this.sendLeaveRoom();
    };
    BaCayController.prototype.handlePendingPlayers = function() {
      if (_super.prototype.handlePendingPlayers.call(this), this._forcedQuit) {
        this.onLogOut();
      } else if (this._forcedToLeaveRoom) {
        this.handleLeaveRoomResponse();
      } else {
        if (GamePlayManager.default.getInstance().checkBaoTriGame()) {
          this.state = MessageCardGameHandler.GameState.WAITING;
          return void this.sendLeaveRoom();
        }
        if (this.players.forEach(function(playerToReset) {
            playerToReset.resetDefaultValueForMauBinh();
          }), this.removeEffect(), this.listEffect.forEach(function(effect) {
            effect.destroy();
          }), this.listEffect = [], this.reset(), this._subscribedToGetOut) {
          this.state = MessageCardGameHandler.GameState.WAITING;
          GamePlayManager.default.getInstance().countMatchNotInteract = 0;
          this.sendLeaveRoom();
          return void AnalyticsManager.default.getInstance().logEvent("UserLeaveRoomCaoRua", JSON.parse('{"AmountMatch":"' + this.countMatch + '"}'));
        }
        if (this._khongThaoTac && this._daNgoi) {
          if (this._soVanKhongThaoTac++, 3 == this._soVanKhongThaoTac) {
            GamePlayManager.default.getInstance().countMatchNotInteract = 0;
            this.sendLeaveRoom();
            return void AnalyticsManager.default.getInstance().logEvent("UserLeaveRoomCaoRua", JSON.parse('{"AmountMatch":"' + this.countMatch + '"}'));
          }
        } else {
          this._soVanKhongThaoTac = 0;
        }
        this._khongThaoTac = true;
        this.updateMoneys();
        this._dangKetThuc = false;
        this.removePendingPlayers();
        this.state = MessageCardGameHandler.GameState.WAITING;
        this.updateReadyStatus();
        for (var playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
          var player = this.players[playerIndex];
          player._latBai = false;
          player.isShowAnimBonusMoney = false;
          player.cards.forEach(function(card) {
            card.node.active = false;
            card.setColor(cc.Color.WHITE);
            card.stopSparkling();
          });
        }
      }
    };
    BaCayController.prototype.initPlayerCardsViewing = function() {
      for (var noPlayingPlayer = 0 === this.playersPlaying.length, playerIndex = 0; playerIndex < this.players.length; ++playerIndex) {
        var player = this.players[playerIndex];
        if (player.isMine() || 2 !== player.state && 3 !== player.state) {
          if (noPlayingPlayer && player.isMine() && (2 === player.state || 3 === player.state)) {
            this.playersPlaying.push(player);
          }
          player.state;
        } else {
          for (var cardIndex = 0; cardIndex < player.cards.length; ++cardIndex) {
            var card = player.cards[cardIndex];
            card.setType(GameCardSpriteType.default.TypeMEDIUM);
            card.node.active = true;
            card.node.position = this.getPlayerCardPosition(player.indexPos, cardIndex, this.distanceCard);
          }
          player.state;
          if (noPlayingPlayer) {
            this.playersPlaying.push(player);
          }
        }
      }
    };
    BaCayController.prototype.showViewTableMessage = function() {
      this.node.runAction(cc.sequence(cc.delayTime(.7), cc.callFunc(function() {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("B\xe0n \u0111ang ch\u01a1i, xin vui l\xf2ng ch\u1edd!");
      })));
    };
    BaCayController.prototype.getPlayerCardPositionMineBig = function(seatIndex, cardIndex) {
      var basePos = this.listPlayerCardPos[seatIndex].position,
        x = basePos.x - (cardIndex - 1) * this.cardSizeBig.x * .4,
        y = basePos.y + 50;
      return new cc.Vec2(x + 0, y);
    };
    BaCayController.prototype.getPlayerCardExtratimePosition = function(seatIndex, cardIndex, distance) {
      var basePos = this.listCardPositionExtratime[seatIndex].position,
        x = basePos.x - cardIndex * distance.x,
        y = basePos.y + Math.floor(cardIndex / 5) * distance.y;
      return new cc.Vec2(x + 0, y);
    };
    BaCayController.prototype.getPlayerCardPosition = function(seatIndex, cardIndex, distance) {
      var basePos = this.listPlayerCardPos[seatIndex].position,
        x = basePos.x - cardIndex * distance.x,
        y = basePos.y + Math.floor(cardIndex / 5) * distance.y;
      return new cc.Vec2(x + 0, y);
    };
    BaCayController.prototype.getNameGame = function() {
      return "C\xe0o R\xf9a";
    };
    BaCayController.prototype.getListChatDefaultText = function() {
      return ["9 n\xfat n\xe8 b\xe0 con", "\u0110en qu\xe1 \xf4ng gi\xe1o \u1ea1", "Ti\u1ebfp n\xe0o",
        "Th\u1ea7n r\xf9a nh\u1eadp r\u1ed3i!", "L\u1ea1i thua r\u1ed3i", "Ba con t\xe2y n\xe8", "Xui qu\xe1 anh em \u01a1i",
        "B\xe0i \u0111\u1eb9p gh\xea", "M\xe0y h\u1ea3 b\u01b0\u1edfi", "May qu\xe1 m\u1ea5y b\u1ea1n"
      ];
    };
    BaCayController.prototype.setGameConfig = function(bet, gameState, remainTimeSeconds, assetId, maxUser, hasPassword) {
      _super.prototype.setGameConfig.call(this, bet, gameState, remainTimeSeconds, assetId, maxUser, hasPassword);
      this.showHideInviteBtn();
      this.betOfTable = bet;
    };
    BaCayController.prototype.onFocus = function(secondsAway) {
      _super.prototype.onFocus.call(this, secondsAway);
      this.timeAutoSendData = this.timeAutoSendDataDefault;
    };
    BaCayController.prototype.onLostFocus = function() {
      _super.prototype.onLostFocus.call(this);
      this.timeAutoSendData = 1.5 * this.timeAutoSendDataDefault;
    };
    BaCayController.prototype.setMiniGameNode = function() {};
    BaCayController.prototype.updateViewingPlayerPositions = function() {
      this.pendingJoinPlayers.sort(function(playerA, playerB) {
        return playerA.sit > playerB.sit ? 1 : playerA.sit < playerB.sit ? -1 : 0;
      });
      for (var index = 0; index < this.pendingJoinPlayers.length; ++index) {
        var player = this.pendingJoinPlayers[index];
        this.showPlayerViewBauCua(player, true);
        player.iconnReady.active = false;
        player.kickButton.active = false;
        if (StringUtil.default.checkVec2Equal(player.node.position, cc.Vec2.ZERO) || this.state === MessageCardGameHandler.GameState.WAITING) {
          player.pos = this.getViewPositionOfPlayer(player, index);
          if (this.state !== MessageCardGameHandler.GameState.VIEWING || player.isMine() || this._joinedTable) {
            player.runToPos(this.size);
          } else {
            player.node.position = player.pos;
          }
        }
      }
    };
    __decorate([property([cc.Node])], BaCayController.prototype, "listPlayerCardPos", void 0);
    __decorate([property([cc.Node])], BaCayController.prototype, "listCardPositionExtratime", void 0);
    __decorate([property(cc.Node)], BaCayController.prototype, "playerCardPosWhenDone", void 0);
    __decorate([property(cc.Prefab)], BaCayController.prototype, "prefabBaCayScoreUI", void 0);
    __decorate([property(cc.Prefab)], BaCayController.prototype, "prefabBaCayAnimExtratime", void 0);
    __decorate([property(cc.Node)], BaCayController.prototype, "nodeNanBai", void 0);
    __decorate([property(cc.Node)], BaCayController.prototype, "blackLayer", void 0);
    __decorate([property(ProcessCountdown.default)], BaCayController.prototype, "processTimeCountdown", void 0);
    __decorate([property(ChipCaoRuaController.default)], BaCayController.prototype, "chipController", void 0);
    __decorate([property(ParticleCaoRua.default)], BaCayController.prototype, "particleCaoRua", void 0);
    __decorate([property(cc.Node)], BaCayController.prototype, "btnFlipAllCard", void 0);
    __decorate([property(cc.Toggle)], BaCayController.prototype, "toggleAutoFlipAllCard", void 0);
    return BaCayController = __decorate([ccclass], BaCayController);
  }(GameController.default);
moduleExports.default = BaCayController;
void 0;
