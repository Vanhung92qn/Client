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
var a = require("GameCardSprite"),
  s = require("GameBaseController"),
  r = require("TableBetUI"),
  c = require("GameUtils"),
  l = require("BetListView"),
  h = require("PoolManager"),
  u = require("MessageCardGameHandler"),
  d = require("GamePlayManager"),
  p = require("LiengMessageHandler"),
  f = require("CardSet"),
  g = require("TableMessageHandler"),
  m = require("GameDefine"),
  y = require("GameCardSpriteType"),
  S = require("LiengScoreUI"),
  _ = require("MoneyUI"),
  v = require("CommonPrefabsManager"),
  b = require("GameConfigManager"),
  C = require("GameZOrder"),
  T = require("MusicPlayer"),
  E = require("VersionController"),
  I = cc._decorator,
  A = I.ccclass,
  P = I.property,
  M = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.graphics = null;
      e.prefabMoneyUI = null;
      e.prefabCardSet = null;
      e.prefabTableBetUI = null;
      e.prefabBetListView = null;
      e.prefabLiengScoreUI = null;
      e.startGameNode = null;
      e.blackLayer = null;
      e.listBtnMain = null;
      e.listBtnTool = null;
      e.btnUpXem = null;
      e.btnTheo = null;
      e.btnTo = null;
      e.btnXem = null;
      e.btnAllIn = null;
      e.betListViewNode = null;
      e.popupFlipCard = null;
      e.btnFlipCard = null;
      e.btnBuyIn = null;
      e.listPlayerBetUI = [];
      e.listCardFlip = [];
      e.background = null;
      e.listCardBacks = [];
      e.listCardNumbers = [];
      e.listCardScripts = [];
      e.listPots = [];
      e.listTableBetUI = [];
      e.mapCardSet = null;
      e.mapTableBetUI = null;
      e.currentFlipCard = null;
      e.betListView = null;
      e.minBuyIn = 0;
      e.maxBuyIn = 0;
      e.totalScore = 0;
      e.currentBet = 0;
      e.playerBetBefore = 0;
      e.cardSpaceX = 40;
      e.flipCardIndex = -1;
      e.flipCardTimeRemain = 0;
      e.totalCardFliped = 0;
      e.cardSmallScale = .7;
      e.totalCardShow = 0;
      e.maxBet = 0;
      e.isCheckCall = false;
      e.isCheckUpXem = false;
      e.isDidFlipAllCard = false;
      e.isDisChangeTurn = false;
      e.isUpBai = false;
      e.poolLiengScoreUIName = "poolliengscoreui";
      e.poolScoreUI = null;
      e.poolGameCardName = "poolgamecard";
      e.poolGameCard = null;
      e.poolCardSetName = "poolcardset";
      e.poolCardSet = null;
      e.poolTableBetUIName = "pooltablebetui";
      e.poolTalbeBetUI = null;
      e.poolMoneyUIName = "poolmoneyuiname";
      e.poolMoneyUI = null;
      e.isWaitingDealCard = false;
      e.isFinishDealCard = true;
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {
      this.gameRutTien = true;
      var e = cc.instantiate(this.prefabBetListView);
      e.parent = this.node;
      e.zIndex = C.default.CHAT_BUBLES + 3;
      this.betListView = e.getComponent(l.default);
      this.betListView.node.active = false;
      t.prototype.onLoad.call(this);
      this.mapCardSet = new c.MapString();
      this.mapTableBetUI = new c.MapString();
      var i = cc.winSize;
      this.graphics = this.blackLayer.getComponent(cc.Graphics);
      this.graphics.lineWidth = 0;
      this.graphics.clear();
      this.graphics.fillColor = cc.color(0, 0, 0, 210);
      this.graphics.fillRect(-i.width / 2, -i.height / 2, this.node.width, this.node.height);
      this.poolCardSet = h.PoolManager.getInstance().addPool(this.poolCardSetName, new h.PoolComponent());
      this.poolMoneyUI = h.PoolManager.getInstance().addPool(this.poolMoneyUIName, new h.PoolComponent());
      this.poolGameCard = h.PoolManager.getInstance().addPool(this.poolGameCardName, new h.PoolComponent());
      this.poolScoreUI = h.PoolManager.getInstance().addPool(this.poolLiengScoreUIName, new h.PoolComponent());
      this.poolTalbeBetUI = h.PoolManager.getInstance().addPool(this.poolTableBetUIName, new h.PoolComponent());
      this.listBtnMain.y = -cc.winSize.height / 2;
      this.listBtnTool.y = -cc.winSize.height / 2;
    };
    e.prototype.start = function() {
      this.node.stopAllActions();
      t.prototype.start.call(this);
      this.blackLayer.zIndex = C.default.TOP_MOST - 1;
      this.blackLayer.active = false;
      this.startGameNode.zIndex = C.default.TOP_MOST;
    };
    e.prototype.onLostFocus = function() {
      t.prototype.onLostFocus.call(this);
      if (this._dangKetThuc) {
        this.btnFlipCard.active = false;
      }
      if (!(this.startGameNode.active || this._dangKetThuc || this.isWaitingDealCard || !this.isFinishDealCard)) {
        this.flipAllCard(false);
      }
    };
    e.prototype.onFocus = function(e) {
      t.prototype.onFocus.call(this, e);
    };
    e.prototype.onGetInGameTableInfo = function(e) {
      t.prototype.onGetInGameTableInfo.call(this, e);
      var i = e.rmT;
      if ((i /= 1e3) > 0) {
        this.cardGameTableController.readyBtn.active = false;
        this.cardGameTableController.startBtn.active = false;
      }
    };
    e.prototype.setGameConfig = function(e, i, n, o, a, s) {
      if (t.prototype.setGameConfig.call(this, e, i, n, o, a, s), this.listTableBetUI.length > 0) {
        for (var c = 0; c < this.listTableBetUI.length; c++) {
          this.listTableBetUI[c].node.destroy();
        }
        this.listTableBetUI = [];
      }
      for (c = 0; c < this.listPlayerBetUI.length; c++) {
        var l = cc.instantiate(this.prefabTableBetUI).getComponent(r.default);
        l.node.parent = this.node;
        l.node.position = this.listPlayerBetUI[c].position;
        l.node.active = false;
        this.listTableBetUI.push(l);
      }
      this.btnBuyIn.parent = this.listBtnInvitePos[0];
      this.btnBuyIn.x = 80;
      this.btnBuyIn.y = -35;
      this.btnFlipCard.parent = this.listBtnInvitePos[0];
      this.btnFlipCard.x = -130;
      this.btnFlipCard.y = 0;
    };
    e.prototype.getTag = function() {
      return "lieng";
    };
    e.prototype.getNameGame = function() {
      return "LI\xcaNG";
    };
    e.prototype.getSpriteFrameName = function() {
      return this.background;
    };
    e.prototype.getListChatDefaultText = function() {
      return ["Nhanh \u0111i, nhanh \u0111i", "\xdap b\xe0i l\xe0 th\xf4ng minh \u0111\xf3", "Th\xf4i r\u1ed3i \xf4ng Gi\xe1o \u1ea1",
        "N\xf3 l\u1ed9n x\xe0o \u0111\xf3 ae", "\u0110\u1ec7ch! B\xe0i t\u1ed1t v\u1eady pa", "\u0110en nh\u01b0 m\xf5m ch\xf3",
        "C\u01b0\u01a1ng kh\xf4ng l\u1ea1i anh \u0111\xe2u, \xfap b\xe0i \u0111i", "\u0110M 9 n\xfat g\u1eb7p Li\xeang",
        "C\u1ea3m \u01a1n m\u1ea5y ch\xfa \u0111\xe3 theo NH\u1eb8 :))", "\xdap b\xe0i \u0111i m\u1ea5y ch\xfa",
        "\u1ea4m r\u1ed3i, \u1ea5m r\u1ed3i", "1-2 \u0111i\u1ec3m b\u01b0\u1edbc \u0111\u1ec1u",
        "Ch\u01a1i t\u1edbi lu\xf4n \u0111\xea", "M\xe9o l\xean \u0111\u01b0\u1ee3c Li\xeang", "Th\xf4i xong",
        "Ngon th\xec b\u01a1i v\xe0o \u0111\xe2y", "H\xean \u0111\xf3 con t\xf3", "C\xe2u hay \u0111\xf3 \xf4ng b\u1ea1n"
      ];
    };
    e.prototype.getCmdStart = function() {
      return u.Global_Message.START_GAME_CARD;
    };
    e.prototype.init = function(e) {
      if (void 0 === e) {
        e = null;
      }
      t.prototype.init.call(this, e);
    };
    e.prototype.onDestroy = function() {
      if (null != this.mapCardSet) {
        this.mapCardSet.forEach(function(t, e) {
          if (null != e.node) {
            e.node.destroy();
          }
        }.bind(this));
        this.mapCardSet.clear();
      }
      if (null == this.mapTableBetUI) {
        this.mapTableBetUI.forEach(function(t, e) {
          if (null != e.node) {
            e.node.destroy();
          }
        }.bind(this));
        this.mapTableBetUI.clear();
      }
      if (null != this.listCardScripts) {
        this.listCardScripts.forEach(function(t) {
          if (null != t && null != t.node) {
            t.node.destroy();
          }
        }.bind(this));
      }
      if (null != this.poolCardSet) {
        this.poolCardSet.clear();
      }
      if (null != this.poolScoreUI) {
        this.poolScoreUI.clear();
      }
      if (null != this.poolGameCard) {
        this.poolGameCard.clear();
      }
    };
    e.prototype.handleErrorMessage = function(t) {
      if (void 0 != t && null != t && 0 != t.length) {
        v.default.getInstance().showPopupMessageUtil(t);
      }
    };
    e.prototype.onReceiveMessage = function(e, i, n) {
      switch (t.prototype.onReceiveMessage.call(this, e, i, n), e) {
        case u.Global_Message.ERROR_MESSAGE:
          this.handleErrorMessage(n.mgs);
          break;
        case p.LiengCommand.CALL:
        case p.LiengCommand.FOLD:
        case p.LiengCommand.RAISE:
        case p.LiengCommand.CHECK:
          break;
        case p.LiengCommand.CHANGE_TURN:
          this.changeTurn(e, n);
          break;
        case p.LiengCommand.DEAL_CARDS:
          this.isWaitingDealCard = false;
          this.dealCards(e, n);
          break;
        case p.LiengCommand.FINISH_GAME:
          this.isWaitingDealCard = false;
          this.finishGame(e, n);
          break;
        case p.LiengCommand.READY_DEAL_CARD:
          this.isWaitingDealCard = true;
          this.startBetting(n.T / 1e3);
          this.isHost && this.checkShowButtonStartGameWhenUserReady();
          E.default.getInstance().CheckForceUpdateByGameScene(m.GameConfigs.SceneName.Lieng);
          break;
        case p.LiengCommand.FLIP_CARDS:
          this.onReceiveFlipCards(n);
      }
    };
    e.prototype.hostCheckAllPlayerReadyForShowButtonStartWhenRemovePlayer = function() {
      if (this.cardGameTableController.countDownActionProgressTo.node.active) {
        this.checkShowButtonStartWhenRemovePlayer();
      }
    };
    e.prototype.hostCheckAllPlayerReadyForShowButtonStartGameWhenUserReady = function() {};
    e.prototype.hostCheckAllPlayerReadyForShowButtonStartGameWhenChangeHost = function() {
      if (this.cardGameTableController.countDownActionProgressTo.node.active) {
        this.checkShowButtonStartGameWhenChangeHost();
      }
    };
    e.prototype.updateReady = function(t) {
      if (this.isHost && this.state != u.GameState.PLAYING) {
        g.default.getInstance().requestReady();
      }
    };
    e.prototype.buyIn = function() {
      this._autoWithDrawMoney = b.default.getInstance().autoBuyIn;
      this._moneyToAutoWithdraw = b.default.getInstance().moneyBuyIn;
      p.default.getInstance().requestBuyIn(this._moneyToAutoWithdraw);
    };
    e.prototype.withdrawMoney = function() {
      var t = this;
      if (this._thisPlayerView._realMoney < this.minMoneyBuyIn) {
        v.default.getInstance().showPopupMessageUtil("B\u1ea1n kh\xf4ng \u0111\u1ee7 ti\u1ec1n \u0111\u1ec3 buy-in");
      } else {
        if (this._autoWithDrawMoney) {
          this.buyIn();
        } else {
          v.default.getInstance().showPopupBuyIn(d.default.getInstance().maxBuyIn, d.default.getInstance().minBuyIn, d.default
            .getInstance().bet);
          v.default.getInstance().popupBuyIn.onHandleBuyIn = function() {
            t.buyIn();
            v.default.getInstance().popupBuyIn.hide();
          };
        }
      }
    };
    e.prototype.show = function() {
      t.prototype.show.call(this);
    };
    e.prototype.hide = function() {
      t.prototype.hide.call(this);
    };
    e.prototype.getCardSet = function() {
      var t = this.poolCardSet.getObject();
      if (null == t) {
        t = cc.instantiate(this.prefabCardSet).getComponent(f.default);
        this.poolCardSet.addObjectUsing(t);
      }
      t.reset();
      t.node.opacity = 255;
      t.node.active = true;
      return t;
    };
    e.prototype.getGameCardSprite = function() {
      var t = this.poolGameCard.getObject();
      if (null == t) {
        t = cc.instantiate(this.prefabsGameCard).getComponent(a.default);
        this.poolGameCard.addObjectUsing(t);
      }
      t.reset();
      t.node.active = true;
      t.node.opacity = 255;
      return t;
    };
    e.prototype.reset = function() {
      this.maxBet = 0;
      this.isUpBai = false;
      this.totalCardShow = 0;
      this.isDidFlipAllCard = false;
      this.isDisChangeTurn = false;
      this.listBtnTool.active = false;
      this.listBtnMain.active = false;
      this.betListView.node.active = false;
      this.startGameNode.active = false;
      this.popupFlipCard.active = false;
      this.blackLayer.active = false;
      this.isCheckCall = false;
      this.isCheckUpXem = false;
      this._dangPhatBai = false;
      this.updateButtonTool();
      for (var t = 0; t < this.listCardBacks.length; t++) {
        this.listCardBacks[t].destroy();
      }
      this.listCardBacks = [];
      if (null != this.mapCardSet) {
        this.mapCardSet.forEach(function(t, e) {
          var i = e.getListCardsForCache();
          e.node.removeFromParent();
          for (var n = 0; n < i.length; n++) {
            this.poolGameCard.addObject(i[n]);
          }
        }.bind(this));
        this.mapCardSet.clear();
      }
      for (t = 0; t < this.listCardScripts.length; t++) {
        this.listCardScripts[t].node.active = false;
        this.listCardScripts[t].reset();
      }
      var e = this.poolCardSet.listObjectUsing;
      for (t = 0; t < e.length; t++) {
        e[t].reset();
      }
      if (null != this.poolScoreUI) {
        this.poolScoreUI.resetAllObjectUsing();
      }
      if (null != this.poolCardSet) {
        this.poolCardSet.resetAllObjectUsing();
      }
      if (null != this.poolMoneyUI) {
        this.poolMoneyUI.resetAllObjectUsing();
      }
      if (null != this.poolGameCard) {
        this.poolGameCard.resetAllObjectUsing();
      }
      if (null != this.poolTalbeBetUI) {
        this.poolTalbeBetUI.resetAllObjectUsing();
      }
      for (t = 0; t < this.poolTalbeBetUI.listObjectFree.length; t++) {
        var i = this.poolTalbeBetUI.listObjectFree[t];
        i.reset();
        i.node.active = false;
      }
      for (t = 0; t < this.listTableBetUI.length; t++) {
        if (null != this.listTableBetUI[t]) {
          this.listTableBetUI[t].node.active = false;
        }
      }
      this.playersPlaying = [];
    };
    e.prototype.onReconnect = function(t) {
      this.onJoinRoomPlaying(t.cmd, t);
    };
    e.prototype.onJoinRoomPlaying = function(e, i) {
      t.prototype.onJoinRoomPlaying.call(this, e, i);
      this.reset();
      if (this.isReconnect) {
        this.isDidFlipAllCard = true;
      }
      this.btnFlipCard.active = false;
      this.rutTienBtn.active = false;
      var n = this.listBtnInvitePos[0].position,
        o = n.y + 5;
      n.x += 60;
      n.y -= 25;
      for (var s = [], r = i.rmT, c = i.ps, l = 0, h = function(t) {
          var e = c[t],
            i = d.getPlayer(e.uid);
          switch (i.isPlaying = e.pi, d.isReconnect && 0 == e.pS && l++, e.pS) {
            case m.ELiengPlayState.TURN:
              i.startCountDown(r / 1e3);
              for (var n = e.cb, o = 0; o < c.length; o++) {
                if (c[o].cb > n) {
                  d.btnXem.active = false;
                  d.btnTheo.active = true;
                  break;
                }
              }
              break;
            case m.ELiengPlayState.FOLD:
              var a = d.getPlayer(e.uid);
              d.scheduleOnce(function() {
                a.setLiengStatus(e.pS);
              }, .3);
              a.stopCountDown();
          }
          if (0 === d._thisPlayerView.userID.localeCompare(e.uid)) {
            if (d.isReconnect) {
              switch (d.state = u.GameState.PLAYING, d.btnFlipCard.active = true, d._daNgoi = true, d._thisPlayerView.state) {
                case m.ELiengPlayState.TURN:
                  d.listBtnMain.active = true;
                  d.listBtnTool.active = false;
                  break;
                case m.ELiengPlayState.FOLD:
                  d.isUpBai = true;
                  d.btnFlipCard.active = false;
                  break;
                default:
                  d.listBtnMain.active = false;
                  d.listBtnTool.active = true;
              }
            }
            for (o = 0; o < e.cs.length; o++) {
              d._thisPlayerView.listCards.push(e.cs[o]);
            }
          }
          if (i.isPlaying) {
            s.push(i.userID);
            d.playersPlaying.push(i);
          }
        }, d = this, p = 0; p < c.length; p++) {
        h(p);
      }
      if (l && l == c.length) {
        this.listBtnMain.active = false;
        this.listBtnTool.active = false;
        for (p = 0; p < c.length; p++) {
          var f = c[p];
          this.getPlayer(f.uid).startCountDown(r / 1e3);
        }
      }
      if (this.listCardScripts.length > 0) {
        for (p = 0; p < this.listCardScripts.length; p++) {
          this.listCardScripts[p].node.destroy();
        }
        this.listCardScripts = [];
      }
      if (5 != i.gS) {
        for (p = 0; p < this._thisPlayerView.listCards.length; p++) {
          var g = this._thisPlayerView.listCards[p],
            y = cc.instantiate(this.prefabsGameCard).getComponent(a.default);
          y.setTextureWithCode(g, m.GameID.LIENG);
          y.node.scale = this.cardSmallScale;
          y.node.setPosition(new cc.Vec2(n.x + p * this.cardSpaceX, o));
          y.node.parent = this.node;
          y.node.zIndex = C.default.TOP;
          this.listCardScripts.push(y);
          this.listCardNumbers.push(g);
        }
        this.setOtherPlayerCards(i, false);
      }
      for (p = 0; p < c.length; p++) {
        if (void 0 != (f = c[p]).fc && null != f.fc && 0 != f.fc.length) {
          for (var S = f.uid, _ = 0; _ < f.fc.length; _++) {
            var v = f.fc[_];
            if (0 == this._thisPlayerView.userID.localeCompare(S)) {
              if (void 0 == f.cs || null == f.cs || 0 == f.cs.length) {
                continue;
              }
              var b = f.cs.indexOf(v);
              if (-1 == b) {
                continue;
              }
              var T = this.listCardFlip[b];
              T.node.runAction(cc.moveBy(.15, new cc.Vec2(0, 40)));
              T.getComponent(cc.Button).interactable = false;
              T.getComponent(a.default).setBlackFace(true);
              this.listCardScripts[b].setCardSelected(true);
              this.totalCardShow++;
              this.btnFlipCard.active = this.totalCardShow < 2;
            } else {
              var E = this.mapCardSet.get(S);
              if (void 0 != E) {
                E.flipCard(v);
              }
            }
          }
        }
      }
      if (5 == this.gameState) {
        this.cardGameTableController.readyBtn.active = false;
      }
    };
    e.prototype.dealCards = function(e, i) {
      var n = this;
      this.reset();
      this.isFinishDealCard = false;
      v.default.getInstance().closePopup();
      this.cardGameTableController.allowFocusChatBox = false;
      if (this.cardGameTableController.chatInGamePopup) {
        this.cardGameTableController.chatInGamePopup.blurEdibox();
      }
      this.cardGameTableController.readyBtn.active = false;
      this.cardGameTableController.startBtn.active = false;
      this.cardGameTableController.stopProgressStartGame();
      this.playersPlaying = [];
      this._dangPhatBai = true;
      this.btnFlipCard.active = false;
      this.listBtnMain.active = false;
      this.listBtnTool.active = false;
      this.betListView.node.active = false;
      this.btnTo.active = true;
      this.btnBuyIn.active = false;
      this.isDidFlipAllCard = false;
      this.listCardNumbers = [];
      this.totalCardFliped = 0;
      this.flipCardIndex = -1;
      this.currentBet = this.bet;
      var o = i.cs,
        s = (i.lpi, 0),
        r = cc.Vec2.ZERO,
        c = this._thisPlayerView.node.position;
      this._thisPlayerView.isPlaying = o.length > 0;
      this._thisPlayerView.listCards = [];
      this.cardGameTableController.startGameUI();
      for (var l = 0; l < i.lpi.length; l++) {
        this.playersPlaying.push(this.getPlayer(i.lpi[l]));
      }
      if (this._dangKetThuc) {
        this.handlePendingPlayers();
      }
      this.locPlayingPlayer(i.lpi);
      for (l = 0; l < this.listCardFlip.length; l++) {
        this.listCardFlip[l].setBlackFace(false);
        this.listCardFlip[l].setClickEnabled(true);
        this.listCardFlip[l].getComponent(cc.Button).interactable = true;
      }
      if (this._thisPlayerView.isPlaying) {
        var h = this.listTableBetUI[this._thisPlayerView.indexPos];
        h.node.active = true;
        this._thisPlayerView.setTableBetUI(h);
        this._thisPlayerView.startCountDown(10);
        this.playersPlaying.push(this._thisPlayerView);
      }
      var u = function(t) {
          var e = o[t];
          d.listCardNumbers.push(e);
          d._thisPlayerView.listCards.push(e);
          var i = null;
          if (3 != d.listCardScripts.length) {
            i = cc.instantiate(d.prefabsGameCard);
            d.listCardScripts.push(i.getComponent(a.default));
          } else {
            (i = d.listCardScripts[t].node).active = true;
          }
          var n = cc.instantiate(d.prefabsGameCard);
          n.getComponent(a.default).enableTouch(d.callBackCardFlip.bind(d));
          n.getComponent(a.default).isFading = false;
          n.active = true;
          n.opacity = 255;
          n.position = cc.Vec2.ZERO;
          n.parent = i;
          d.listCardBacks.push(n);
          i.parent = d.node;
          i.setPosition(0, 50);
          i.active = true;
          i.zIndex = C.default.TOP_MOST + t + 1;
          var l = i.getComponent(a.default),
            h = l.node.width;
          l.setType(y.default.TypeSMALL);
          l.setTextureWithCode(e, m.GameID.LIENG);
          h *= i.scale;
          s = 1.5 * l.cardSprite.node.width;
          r.x = c.x + t * (h + 30) - 30 - h;
          r.y = c.y;
          var u = d,
            p = cc.moveTo(.15, r).easing(cc.easeSineOut());
          i.runAction(cc.sequence(cc.delayTime(.05 * t), p, cc.callFunc(function() {
            T.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_preflop_card_distribution");
          }), cc.delayTime(.4), cc.callFunc(function() {
            u.blackLayer.active = true;
            u.startGameNode.active = true;
            u.isFinishDealCard = true;
            u.startGameNode.zIndex;
            var e = cc.moveTo(.15, new cc.Vec2(t * (s + 30) - 30 - s, 0));
            e.easing(cc.easeSineOut());
            var n = cc.scaleTo(.15, 1.5);
            n.easing(cc.easeSineOut());
            i.runAction(e);
            i.runAction(n);
          }.bind(d))));
        },
        d = this;
      for (l = 0; l < o.length; l++) {
        u(l);
      }
      this.scheduleOnce(function() {
        n.cardGameTableController.allowFocusChatBox = true;
      }, 1);
      t.prototype.dealCards.call(this, e, i);
      this.setOtherPlayerCards(i);
    };
    e.prototype.setOtherPlayerCards = function(t, e) {
      if (void 0 === e) {
        e = true;
      }
      for (var i = [], n = 0; n < t.ps.length; n++) {
        if (t.ps[n].pi) {
          i.push(t.ps[n].uid);
        }
      }
      for (n = 0; n < this.listTableBetUI.length; n++) {
        this.listTableBetUI[n].node.active = false;
      }
      if (5 != this.gameState) {
        for (n = 0; n < t.ps.length; n++) {
          var o = t.ps[n];
          if (0 != o.pi) {
            var a = o.uid,
              s = this.getPlayer(a),
              r = this.listTableBetUI[s.indexPos];
            s.isPlaying = true;
            s.setTableBetUI(r);
            s.tableBetUI.show();
            if (void 0 == o.cb) {
              r.setMoney(this.bet);
              s.setMoney(s._money - this.bet);
            } else {
              s.setMoney(s._money);
              r.setMoney(o.cb);
            }
            if (e) {
              s.startCountDown(10);
            }
            var c = this.listBtnInvitePos[s.indexPos],
              l = c.parent.convertToWorldSpaceAR(c.position);
            if (r.setFromPosition(r.node.convertToNodeSpaceAR(l)), 0 !== this._thisPlayerView.userID.localeCompare(a)) {
              var h = [],
                u = this.getCardSet();
              if (u.node.parent = s.node, u.node.zIndex = C.default.WIN_MONEY_UI, u.setSpaceX(-30), u.setScaleDefault(this.cardSmallScale,
                  true), this.mapCardSet.set(a, u), e) {
                for (var d = 0; d < 3; d++) {
                  var p = this.getGameCardSprite();
                  p.node.parent = this.node;
                  p.node.x = 0;
                  p.node.y = 50;
                  h.push(p);
                }
              } else {
                h = [-1, -1, -1];
              }
              if (s.indexPos <= 4) {
                u.node.x = 90;
                u.node.y = -15;
              } else {
                u.node.x = -90;
                u.node.y = -15;
              }
              if (e) {
                this.updateCardSetForPosition(s, u);
                u.setListGameCard(h, true);
              } else {
                this.updateCardSetForPosition(s, u);
                u.setSpaceX(-30);
                u.setListCards(h, true);
                u.setCardScale(this.cardSmallScale);
              }
            }
            if (o.pS == m.ELiengPlayState.FOLD) {
              this.disableCardFoldByUID(a);
            }
          }
        }
        this._dangPhatBai = false;
      } else {
        this.gameState = 0;
      }
    };
    e.prototype.updateCardSetForPosition = function(t, e) {
      if (2 == t.indexPos || 3 == t.indexPos || 6 == t.indexPos || 7 == t.indexPos) {
        e.setVerticalLayout();
        e.layout.spacingY = -40;
      } else {
        e.setHorizontalLayout();
      }
      e.layout.updateLayout();
    };
    e.prototype.callBackCardFlip = function(t) {
      this.totalCardFliped++;
      if (this.totalCardFliped >= 3) {
        this.flipAllCard();
      }
    };
    e.prototype.flipAllCard = function(t) {
      var e;
      if (void 0 === t) {
        t = true;
      }
      this.blackLayer.active = false;
      this.startGameNode.active = false;
      for (var i = 0; i < this.listCardScripts.length; i++) {
        if (this.listCardScripts[i].node.scale > this.cardSmallScale) {
          this.isDidFlipAllCard = false;
          break;
        }
      }
      if (!this.isDidFlipAllCard && null != this._thisPlayerView) {
        T.default.getInstance().playbtnClick();
        this.isDidFlipAllCard = true;
        this.totalScore = 0;
        for (i = 0; i < this.listCardBacks.length; i++) {
          this.listCardBacks[i].destroy();
        }
        if (this.listCardBacks = [], this._thisPlayerView.isPlaying) {
          this.btnFlipCard.active = true;
          var n = [];
          for (i = 0; i < this.listCardScripts.length; i++) {
            var o = this.listCardScripts[i];
            o.setTextureWithCode(this.listCardNumbers[i], m.GameID.LIENG);
            n.push(o.N);
            if (o.N < 10) {
              this.totalScore += o.N;
            }
          }
          if (this.totalScore = this.totalScore % 10, 3 == n.length) {
            if (n[0] == n[1] && n[0] == n[2]) {
              this.totalScore = 12;
            } else if (n[0] !== n[1] && n[0] !== n[2] && n[1] !== n[2]) {
              for (i = 0; i < n.length; i++) {
                for (var a = i + 1; a < n.length; a++) {
                  if (n[i] > n[a]) {
                    e = [n[a], n[i]];
                    n[i] = e[0];
                    n[a] = e[1];
                  }
                }
              }
              // 🔴 VÁ ROY88 — Q-K-A LÀ LIÊNG.
              //
              // Bản Go88 chỉ nhận chuỗi liên tiếp trên mặt thô, mà ở Liêng quân Át giữ N = 1
              // (GameCardSprite.decodeCard cố ý không nâng lên 14 riêng cho game này). Nên
              // Q-K-A ra [1,12,13] và KHÔNG được tính là Liêng — trong khi chính ảnh luật của
              // Go88 lại ghi thứ tự A > K > Q > J > 10 > … Go88 tự mâu thuẫn với chính mình.
              //
              // Chủ dự án đã chốt theo luật Liêng phổ thông: A đứng được CẢ HAI ĐẦU —
              // A-2-3 là Liêng nhỏ nhất, Q-K-A là Liêng to nhất.
              //
              // ⚠️ BẮT BUỘC VÁ Ở ĐÂY, không chỉ ở server. Khối này chạy khi NGƯỜI CHƠI LẬT BÀI
              // CỦA CHÍNH MÌNH, và kết quả hiện ngay lên hộp điểm (endFlipCard → setScore),
              // dùng chung bộ vẽ với nhãn server gửi lúc chốt ván. Không vá thì người cầm Q-K-A
              // thấy "1 điểm" lúc lật rồi đổi thành "Liêng" lúc chốt — bài mình bị chấm lại
              // ngay trước mắt.
              //
              // Đối chiếu máy móc cả 22.100 bộ ba lá: server và client chỉ lệch đúng 64 bộ, tất
              // cả đều là Q-K-A. Sau bản vá này thì không lệch bộ nào.
              // Xem CardGame/docs/GO88-LIENG-HOP-DONG.md §10.8.
              if (n[2] - n[1] == 1 && n[1] - n[0] == 1) {
                this.totalScore = 11;
              } else if (n[0] == 1 && n[1] == 12 && n[2] == 13) {
                this.totalScore = 11;
              }
            } else {
              if (n[0] > 10 && n[1] > 10 && n[2] > 10) {
                this.totalScore = 10;
              }
            }
          }
          this.endFlipCard(t);
        }
      }
    };
    e.prototype.endFlipCard = function(t) {
      if (void 0 === t) {
        t = true;
      }
      this.blackLayer.active = false;
      this.startGameNode.active = false;
      cc.Vec2.ZERO;
      for (var e = this.cardSpaceX, i = this.listBtnInvitePos[0].position, n = i.y + 5, o = 0; o < this.listCardScripts.length; o++) {
        var a = this.listCardScripts[o];
        a.node.zIndex = C.default.TOP;
        a.node.stopAllActions();
        if (t) {
          a.node.runAction(cc.moveTo(.16, new cc.Vec2(i.x + 60 + o * e, n)).easing(cc.easeOut(2)));
          a.node.runAction(cc.scaleTo(.16, this.cardSmallScale).easing(cc.easeOut(2)));
        } else {
          a.node.x = i.x + 60 + o * e;
          a.node.y = n;
          a.node.scale = this.cardSmallScale;
        }
      }
      var s = this.poolScoreUI.getObject();
      if (null == s) {
        s = cc.instantiate(this.prefabLiengScoreUI).getComponent(S.default);
      }
      s.setScore(this.totalScore, true);
      s.node.parent = this.node;
      s.node.active = true;
      s.node.setPosition(this._thisPlayerView.node.position);
      s.node.y += 60;
      s.node.zIndex = C.default.TOP_MOST;
      s.fade();
      s.setFadeOutCallback(function(t) {
        this.poolScoreUI.addObject(t);
      }.bind(this));
      this.poolScoreUI.addObjectUsing(s);
    };
    e.prototype.disableCardFoldByUID = function(t) {
      var e = null;
      if (0 == this._thisPlayerView.userID.localeCompare(t)) {
        e = this.listCardScripts;
      } else {
        e = this.mapCardSet.get(t).listCardNodes;
      }
      if (e) {
        for (var i = 0; i < e.length; ++i) {
          e[i].setBlackFace(true);
        }
      }
    };
    e.prototype.changeTurn = function(e, i, n) {
      if (void 0 === n) {
        n = false;
      }
      t.prototype.changeTurn.call(this, e, i);
      this.isDisChangeTurn = true;
      this.betListView.node.active = false;
      this.oldClickTime = 0;
      var o = "";
      if (void 0 != i.tP) {
        o = i.tP.uid;
        if (0 == n) {
          this.getPlayer(o).startCountDown(20);
        }
      }
      if (void 0 != i.fP) {
        var a = i.fP,
          s = a.uid,
          r = a.cb,
          c = a.m,
          l = a.pS;
        if (this._thisPlayerView.isPlaying && this._thisPlayerView.userID == s && l == m.ELiengPlayState.FOLD) {
          this.isUpBai = true;
          this.btnFlipCard.active = false;
        }
        var h = this.getPlayer(s);
        h.setLiengStatus(l);
        h.stopCountDown();
        if (l == m.ELiengPlayState.FOLD) {
          this.disableCardFoldByUID(s);
        }
        if (1 !== l) {
          this.currentBet = r;
          this.playerBetBefore = h.tableBetUI.money;
        }
        if (0 == n) {
          h.setMoney(c);
        }
        for (var u = 0, d = 0; d < this.players.length; d++) {
          if (!this.players[d].isMine()) {
            if (0 == this.players[d]._money) {
              u++;
            }
          }
        }
        if (null != h.tableBetUI) {
          if (this.currentBet - this.playerBetBefore >= this._thisPlayerView._money) {
            this.btnTo.active = false;
            this.btnTheo.active = true;
            this.btnXem.active = false;
          } else {
            this.btnTo.active = true;
          }
          if (u == this.players.length - 1) {
            this.btnTo.active = false;
            this.btnTheo.active = true;
            this.btnXem.active = false;
          }
        }
        if (l == m.ELiengPlayState.RAISE || l == m.ELiengPlayState.ALL_IN || l == m.ELiengPlayState.CALL || l == m.ELiengPlayState
          .CHECK) {
          if (l != m.ELiengPlayState.CHECK && r > this.maxBet && (this.maxBet = r), l == m.ELiengPlayState.CALL && this.bet == r) {
            h.setLiengStatus(m.ELiengPlayState.CHECK);
          } else if ((l != m.ELiengPlayState.CHECK || 0 == n) && null != h.tableBetUI) {
            var f = (r - h.tableBetUI.money) / (1.3 * this.bet);
            if (f > 0) {
              f = r / (1.3 * this.bet);
              h.tableBetUI.setMoney(r, true, true, 0 == f ? 1 : f);
            }
          }
        }
        if (0 == this._thisPlayerView.userID.localeCompare(o) && 0 == n) {
          switch (this.maxBet > this._thisPlayerView.tableBetUI.money ? (this.btnXem.active = false, this.btnTheo.active = true, this
              .isCheckCall ? p.default.getInstance().requestCall() : this.isCheckUpXem && p.default.getInstance().requestFold()) : (this
              .btnXem.active = true, this.btnTheo.active = false, this.isCheckUpXem && p.default.getInstance().requestCheck()), l) {
            case m.ELiengPlayState.ALL_IN:
            case m.ELiengPlayState.RAISE:
              this.isCheckCall ? p.default.getInstance().requestCall() : this.isCheckUpXem && p.default.getInstance().requestFold();
              this.btnXem.active = false;
              this.btnTheo.active = true;
              break;
            case m.ELiengPlayState.CHECK:
              this.isCheckUpXem && p.default.getInstance().requestCheck();
          }
        }
      } else {
        if (0 == this.isDidFlipAllCard) {
          this.flipAllCard();
        }
      }
      if (0 == n) {
        if (this._thisPlayerView.isPlaying) {
          if (0 == this._thisPlayerView.userID.localeCompare(o)) {
            this.listBtnMain.active = true;
            this.listBtnTool.active = false;
            if (void 0 == i.fP) {
              this.btnXem.active = true;
              this.btnTheo.active = false;
            }
          } else {
            this.listBtnMain.active = false;
            if (0 == this.isUpBai) {
              this.listBtnTool.active = true;
            }
          }
        } else {
          this.listBtnMain.active = false;
          this.listBtnTool.active = false;
        }
      }
    };
    e.prototype.onBuyIn = function(e) {
      t.prototype.onBuyIn.call(this, e);
    };
    e.prototype.showCardPlayer = function(t, e) {
      if (null != e && void 0 != e) {
        var i = this.mapCardSet.get(t.userID);
        if (null != i) {
          i.setHorizontalLayout();
          i.layout.updateLayout();
          i.node.runAction(cc.moveTo(.15, cc.Vec2.ZERO));
          if (null != i && void 0 != i) {
            i.setListCardNumber(e);
          }
        }
      }
    };
    e.prototype.finishGame = function(e, i) {
      t.prototype.finishGame.call(this, e, i);
      this._dangKetThuc = true;
      this._dangPhatBai = false;
      this.btnFlipCard.active = false;
      this.listBtnMain.active = false;
      this.listBtnTool.active = false;
      this.betListView.node.active = false;
      this.isDidFlipAllCard = false;
      this.popupFlipCard.active = false;
      this.blackLayer.active = false;
      i.fP.uid;
      i.fP.iw;
      i.fP.m;
      i.fP.rM;
      i.mX;
      var n = i.fP.pS;
      i.fP.dn;
      i.fP.cb;
      if (n != m.ELiengPlayState.CALL) {
        m.ELiengPlayState.CHECK;
      }
      this.changeTurn(e, i, true);
      this.runFinishAnimation(e, i);
    };
    e.prototype.runFinishAnimation = function(t, e) {
      var i = e.pots;
      this.updatePotFinishGame(i);
      for (var n = e.ps, o = 0; o < n.length; o++) {
        var a = n[o];
        this.updateUserFinishGame(a);
      }
      var s = this._thisPlayerView.node.position;
      for (o = 0; o < this.listCardScripts.length; o++) {
        this.listCardScripts[o].node.runAction(cc.moveTo(.2, new cc.Vec2(s.x + (o - 1) * this.cardSpaceX, s.y + 15)));
      }
      this.updateUserFinishGame(e.fP);
      this.node.runAction(cc.sequence(cc.delayTime(5.5), cc.callFunc(function() {
        for (var t = this.poolMoneyUI.listObjectUsing, e = 0; e < t.length; e++) {
          t[e].hide();
        }
        var i = this.poolScoreUI.listObjectUsing;
        for (e = 0; e < i.length; e++) {
          i[e].hide();
        }
      }.bind(this))));
      this.node.runAction(cc.sequence(cc.delayTime(6), cc.callFunc(function() {
        this.endGame(null, null);
      }.bind(this))));
    };
    e.prototype.updatePotFinishGame = function(t) {
      if (void 0 != t) {
        this.listPots = [];
        for (var e = function(e) {
            var n = t[e],
              o = n.m,
              a = n.uid,
              s = (n.dn, n.id, i.poolTalbeBetUI.getObject());
            if (null == s) {
              s = cc.instantiate(i.prefabTableBetUI).getComponent(r.default);
              i.poolTalbeBetUI.addObjectUsing(s);
            }
            s.node.setPosition(170 * (e - t.length / 2), 0);
            s.node.parent = i.node;
            s.node.zIndex = C.default.TOP;
            s.node.opacity = 255;
            s.node.active = true;
            s.container.active = false;
            s.chip.active = false;
            s.ignoreFirstChip = true;
            i.listPots.push(s);
            var c = i.getPlayer(a);
            if (null != c.tableBetUI) {
              c.tableBetUI.moveChips(s, false, .5);
            }
            var l = c.node.parent.convertToWorldSpaceAR(c.node.position);
            s.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function() {
              s.setMoney(o, false);
              s.stackChips(function() {
                s.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
                  s.moveChipToPlayer(l);
                }.bind(this))));
              }.bind(this));
            }.bind(i))));
          }, i = this, n = 0; n < t.length; n++) {
          e(n);
        }
        for (n = 0; n < this.playersPlaying.length; n++) {
          for (var o = this.playersPlaying[n], a = 0; a < this.listPots.length; a++) {
            var s = this.listPots[a];
            if (o.isPlaying && null != o.tableBetUI) {
              o.tableBetUI.moveChips(s, false, 1 / this.listPots.length);
            }
          }
        }
      }
    };
    e.prototype.updateUserFinishGame = function(t) {
      var e = t.uid,
        i = (t.u, t.iw),
        n = t.m,
        o = t.mX,
        a = t.rM,
        s = t.rh,
        r = this.getPlayer(e);
      if (e != this._thisPlayerView.userID) {
        this.showCardPlayer(r, t.cs);
      }
      if (r.isMine()) {
        if (i) {
          T.default.getInstance().playEffect("Sounds/sfx_add_money");
          T.default.getInstance().playEffect("Sounds/sfx_win");
        } else {
          T.default.getInstance().playEffect("Sounds/sfx_lose");
        }
      }
      r._realMoney = a;
      r.playerStatusUI.node.active = false;
      var c = this.poolScoreUI.getObject();
      if (null == c) {
        c = cc.instantiate(this.prefabLiengScoreUI).getComponent(S.default);
        this.poolScoreUI.addObjectUsing(c);
      }
      var l = r.node.parent.convertToWorldSpaceAR(r.node.position),
        h = this.node.convertToNodeSpaceAR(l);
      if (c.node.parent = this.node, c.node.active = true, c.node.opacity = 255, c.node.x = h.x, c.node.y = h.y - 50, c.node.zIndex = C
        .default.SCORE_UI, c.setScore(s, i), i) {
        this.node.runAction(cc.sequence(cc.delayTime(3.7), cc.callFunc(function() {
          r.setMoney(n);
        }.bind(this))));
        r.runWinAction(5);
        var u = this.poolMoneyUI.getObject();
        if (null == u) {
          u = cc.instantiate(this.prefabMoneyUI).getComponent(_.default);
          this.poolMoneyUI.addObjectUsing(u);
        }
        var d = r.node.parent.convertToWorldSpaceAR(r.node.position);
        d = this.node.convertToNodeSpaceAR(d);
        u.setMoney(o);
        u.node.setParent(this.node);
        u.node.position = new cc.Vec2(d.x, d.y - 10);
        u.node.zIndex = C.default.WIN_MONEY_UI;
        u.show(m.GameID.LIENG);
      } else {
        r.setMoney(n);
      }
    };
    e.prototype.endGame = function(e, i) {
      t.prototype.endGame.call(this, e, i);
      this.handlePendingPlayers();
      this.updateReadyStatus();
      this._autoWithDrawMoney = b.default.getInstance().autoBuyIn;
      this.isCheckCall = false;
      this.isCheckUpXem = false;
      this.btnBuyIn.active = true;
      this.listBtnMain.active = false;
      this.listBtnTool.active = false;
      c.getNodeByPath(this.btnAllIn, "Check").active = false;
      c.getNodeByPath(this.btnUpXem, "Check").active = false;
      this.node.stopAllActions();
      this.reset();
    };
    e.prototype.onReceiveFlipCards = function(t) {
      var e = t.uid,
        i = t.cs;
      if (0 != i.length) {
        if (0 == this._thisPlayerView.userID.localeCompare(e)) {
          if (0 == this.listCardScripts[this.flipCardIndex].isSelected) {
            this.totalCardShow++;
            this.listCardScripts[this.flipCardIndex].setCardSelected(true);
            this.currentFlipCard.getComponent(cc.Button).interactable = false;
            this.currentFlipCard.getComponent(a.default).setBlackFace(true);
            this.flipCardIndex = -1;
            this.btnFlipCard.active = this.totalCardShow < 2;
          }
        } else {
          var n = this.mapCardSet.get(e);
          if (void 0 != n) {
            n.flipCard(i[0]);
          }
        }
      }
    };
    e.prototype.onReceiveBuyInMoney = function(t) {
      t.uid;
      t.m;
    };
    e.prototype.onReceiveStartBetting = function(t) {
      var e = t.T / 1e3;
      this.cardGameTableController.startBetting(e, e);
    };
    e.prototype.onBtnUpClicked = function(t, e) {
      var i = new Date();
      if (!((i.getTime() - this.oldClickTime) / 1e3 < 2)) {
        this.oldClickTime = i.getTime();
        T.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_fold");
        p.default.getInstance().requestFold();
        this._khongThaoTac = false;
      }
    };
    e.prototype.onBtnTheoClicked = function(t, e) {
      var i = new Date();
      if (!((i.getTime() - this.oldClickTime) / 1e3 < 2)) {
        this.oldClickTime = i.getTime();
        T.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_call");
        p.default.getInstance().requestCall();
        this._thisPlayerView.stopCountDown();
        this._khongThaoTac = false;
      }
    };
    e.prototype.onBtnXemClicked = function(t, e) {
      var i = new Date();
      if (!((i.getTime() - this.oldClickTime) / 1e3 < 2)) {
        this.oldClickTime = i.getTime();
        T.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_check");
        p.default.getInstance().requestCheck();
        this._thisPlayerView.stopCountDown();
        this._khongThaoTac = false;
      }
    };
    e.prototype.onBtnToClicked = function(t, e) {
      var i = new Date();
      if (!((i.getTime() - this.oldClickTime) / 1e3 < .3)) {
        this.oldClickTime = i.getTime();
        this._khongThaoTac = false;
        for (var n = this.currentBet - this._thisPlayerView.tableBetUI.money, o = this._thisPlayerView._money - n, a = 0, s = 0; s < this
          .playersPlaying.length; s++) {
          var r = this.playersPlaying[s];
          if (0 != this._thisPlayerView.userID.localeCompare(r.userID)) {
            if (r._money > a) {
              a = r._money;
            }
            if (r._money > a) {
              a = r._money;
            }
          }
        }
        if (o > a && (o = a), 0 == this.betListView.node.active) {
          T.default.getInstance().playbtnClick();
          var c = Math.floor((o - this.bet) / this.bet),
            l = [];
          if (c <= 0 ? c = 1 : c += 1, l.push(o), c > 0) {
            for (s = c - 1; s >= 0; s--) {
              var h = this.bet + s * this.bet;
              if (h < o) {
                l.push(h);
              }
            }
            l.sort(function(t, e) {
              return t > e ? 1 : t < e ? -1 : 0;
            });
            this.betListView.loadData(l);
          }
        } else {
          if (0 !== this.betListView.currentValue) {
            this.betListView.node.active = false;
            T.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_raise");
            p.default.getInstance().requestRaise(this.betListView.currentValue);
            this.betListView.reset();
          }
        }
      }
    };
    e.prototype.updateButtonTool = function() {
      var t = c.getNodeByPath(this.btnUpXem, "Check");
      if (null != t) {
        t.active = this.isCheckUpXem;
      }
      var e = c.getNodeByPath(this.btnAllIn, "Check");
      if (null != e) {
        e.active = this.isCheckCall;
      }
    };
    e.prototype.onBtnUpXemClicked = function(t, e) {
      T.default.getInstance().playbtnClick();
      this.isCheckUpXem = !this.isCheckUpXem;
      c.getNodeByPath(t.target, "Check").active = this.isCheckUpXem;
      this.isCheckCall = false;
      c.getNodeByPath(this.btnAllIn, "Check").active = false;
      this._khongThaoTac = false;
    };
    e.prototype.onBtnAllInClicked = function(t, e) {
      T.default.getInstance().playbtnClick();
      this.isCheckCall = !this.isCheckCall;
      c.getNodeByPath(t.target, "Check").active = this.isCheckCall;
      this.isCheckUpXem = false;
      c.getNodeByPath(this.btnUpXem, "Check").active = false;
      this._khongThaoTac = false;
    };
    e.prototype.onBtnShowPopupFlipCardClicked = function(t) {
      T.default.getInstance().playbtnClick();
      for (var e = 0; e < this.listCardScripts.length; e++) {
        var i = this.listCardFlip[e],
          n = i.node.getContentSize();
        i.setTextureWithCode(this.listCardScripts[e].serverCode, u.GAME.LIENG);
        i.setContentSize(n);
        i.node.y = 0;
      }
      this.blackLayer.active = true;
      this.popupFlipCard.active = true;
      this.blackLayer.zIndex = C.default.TOP_MOST;
      this.popupFlipCard.zIndex = C.default.TOP_MOST + 1;
    };
    e.prototype.onBtnFlipCardClicked = function(t) {
      T.default.getInstance().playbtnClick();
      this.blackLayer.active = false;
      this.popupFlipCard.active = false;
      if (-1 != this.flipCardIndex && this.totalCardShow <= 2) {
        p.default.getInstance().requestFlipCard(this.listCardScripts[this.flipCardIndex].serverCode);
      }
    };
    e.prototype.onBtnSelectCardFlip = function(t, e) {
      if (T.default.getInstance().playbtnClick(), !(this.totalCardShow >= 2)) {
        if (-1 != this.flipCardIndex) {
          this.listCardFlip[this.flipCardIndex].node.runAction(cc.moveTo(.15, cc.Vec2.ZERO));
        }
        if (this.flipCardIndex != e) {
          this.listCardFlip[e].node.runAction(cc.moveBy(.15, new cc.Vec2(0, 40)));
          this.flipCardIndex = e;
          this.currentFlipCard = t.target;
        } else {
          this.flipCardIndex = -1;
        }
      }
    };
    e.prototype.onBtnBuyInClicked = function(t) {
      T.default.getInstance().playbtnClick();
      this._autoWithDrawMoney = false;
      this.withdrawMoney();
    };
    e.prototype.getViewPositionOfPlayer = function(t, e) {
      var i = -1,
        n = this.players.length,
        o = this.POS3;
      if (n > 7) {
        o = this.POS9;
      } else {
        if (n > 5) {
          o = this.POS7;
        } else {
          if (n > 3) {
            o = this.POS5;
          }
        }
      }
      if (null !== this._thisPlayerView && void 0 !== this._thisPlayerView) {
        i = this._thisPlayerView.index;
      }
      var a = o.length;
      if (i >= 0) {
        e = (e + a - i) % a;
      }
      t.indexPos = o[e];
      return this.inviteBtns[t.indexPos].position;
    };
    e.prototype.handlePendingPlayers = function() {
      if (t.prototype.handlePendingPlayers.call(this), this._forcedQuit) {
        this.onLogOut();
      } else if (this._forcedToLeaveRoom) {
        this.handleLeaveRoomResponse();
      } else {
        if (this._subscribedToGetOut) {
          this.state = u.GameState.WAITING;
          return void this.sendLeaveRoom();
        }
        if (d.default.getInstance().checkBaoTriGame()) {
          this.state = u.GameState.WAITING;
          return void this.sendLeaveRoom();
        }
        if (this._thisPlayerView._realMoney < this.bet) {
          v.default.getInstance().showPopupMessageUtil("B\u1ea1n kh\xf4ng \u0111\u1ee7 ti\u1ec1n tham gia b\xe0n ch\u01a1i!");
          return void this.sendLeaveRoom();
        }
        if (this._khongThaoTac && this._daNgoi) {
          if (this._soVanKhongThaoTac++, 3 == this._soVanKhongThaoTac) {
            return void this.sendLeaveRoom();
          }
        } else {
          this._soVanKhongThaoTac = 0;
        }
        this._khongThaoTac = true;
        this.updateMoneys();
        this._dangKetThuc = false;
        if (this._daNgoi) {
          this.rutTienBtn.active = true;
        }
        this.removePendingPlayers();
        this.state = u.GameState.WAITING;
        this.updateReadyStatus();
        for (var e = 0; e < this.players.length; e++) {
          (i = this.players[e]).stopViewAction();
          i._latBai = false;
          i.cards.forEach(function(t) {
            t.node.active = false;
            t.cardSprite.node.color = cc.Color.WHITE;
            t.stopSparkling();
          });
        }
        if (!(this.players.indexOf(this._thisPlayerView) <= -1 && this.players.length < this.maxUser) && (this._thisPlayerView
            .checkInThisArray(this.players) && this._thisPlayerView._money < this.bet && this.withdrawMoney(), this.isHost)) {
          for (e = 0; e < this.players.length; e++) {
            var i;
            if (false === (i = this.players[e]).isMine()) {
              i.isReady;
            }
          }
        }
      }
    };
    e.prototype.onClickBlackLayer = function() {
      if (this.popupFlipCard.active) {
        T.default.getInstance().playbtnClick();
        this.blackLayer.active = false;
        this.popupFlipCard.active = false;
      }
    };
    e.prototype.autoSendReady = function() {
      t.prototype.autoSendReady.call(this);
      this.updatePlayerOnFinish();
    };
    o([P(cc.Prefab)], e.prototype, "prefabMoneyUI", void 0);
    o([P(cc.Prefab)], e.prototype, "prefabCardSet", void 0);
    o([P(cc.Prefab)], e.prototype, "prefabTableBetUI", void 0);
    o([P(cc.Prefab)], e.prototype, "prefabBetListView", void 0);
    o([P(cc.Prefab)], e.prototype, "prefabLiengScoreUI", void 0);
    o([P(cc.Node)], e.prototype, "startGameNode", void 0);
    o([P(cc.Node)], e.prototype, "blackLayer", void 0);
    o([P(cc.Node)], e.prototype, "listBtnMain", void 0);
    o([P(cc.Node)], e.prototype, "listBtnTool", void 0);
    o([P(cc.Node)], e.prototype, "btnUpXem", void 0);
    o([P(cc.Node)], e.prototype, "btnTheo", void 0);
    o([P(cc.Node)], e.prototype, "btnTo", void 0);
    o([P(cc.Node)], e.prototype, "btnXem", void 0);
    o([P(cc.Node)], e.prototype, "btnAllIn", void 0);
    o([P(cc.Node)], e.prototype, "betListViewNode", void 0);
    o([P(cc.Node)], e.prototype, "popupFlipCard", void 0);
    o([P(cc.Node)], e.prototype, "btnFlipCard", void 0);
    o([P(cc.Node)], e.prototype, "btnBuyIn", void 0);
    o([P(cc.Node)], e.prototype, "listPlayerBetUI", void 0);
    o([P(a.default)], e.prototype, "listCardFlip", void 0);
    o([P(cc.SpriteFrame)], e.prototype, "background", void 0);
    return e = o([A], e);
  }(s.default);
i.default = M;
void 0;
