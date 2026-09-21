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
  I = cc._decorator,
  A = I.ccclass,
  P = I.property,
  M = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.baCayScene = null;
      e.listPlayerCardPos = [];
      e.listCardPositionExtratime = [];
      e.listCardReview = [];
      e.listCardMine = [];
      e.listCardExtratime = [];
      e.acps = [];
      e.playerCardPosWhenDone = null;
      e.prefabBaCayScoreUI = null;
      e.prefabBaCayAnimExtratime = null;
      e.nodeNanBai = null;
      e.blackLayer = null;
      e.processTimeCountdown = null;
      e.chipController = null;
      e.particleCaoRua = null;
      e.btnFlipAllCard = null;
      e.toggleAutoFlipAllCard = null;
      e.poolLiengScoreUIName = "poolliengscoreui";
      e.poolScoreUI = null;
      e.listCardBacks = [];
      e.totalCardFliped = 0;
      e.isDidFlipAllCard = false;
      e.cardSmallScale = .7;
      e.currentCountDownTime = 0;
      e.isPlaying = false;
      e.daBaoBinh = false;
      e.listEffect = [];
      e.listEffectSoChi = [];
      e.timeAutoSendDataDefault = 1.9;
      e.timeAutoSendData = 1.9;
      e.animMatchExtratime = null;
      e.isAutoFlipCard = false;
      e.isAutoFlipCardTarget = false;
      e.betOfTable = 100;
      e.isSameSuit = -1;
      e.configCaoRua = null;
      e.enableKickUserIfNotInteract = true;
      e.amountMatchShowPopNotInteract = 5;
      e.amountMatchKickUserAffterNotInteract = 3;
      e.bonusJQKHeartMultiply = 3;
      e.countMatch = 0;
      return e;
    }
    n(e, t);
    e.prototype.initDefaultData = function() {
      t.prototype.initDefaultData.call(this);
      if (GameConfigManager.default.getInstance().isAnDanh) {
        this.isGameAnDanh = false;
        this.isGameAnDanhCheck = false;
      }
      this.node.stopAllActions();
      this.removeEffect();
      this.listEffect.forEach(function(t) {
        t.destroy();
      });
      this.listEffect = [];
      this.daBaoBinh = false;
      this.isPlaying = false;
    };
    e.prototype.onLoad = function() {
      t.prototype.onLoad.call(this);
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
      var e = cc.instantiate(this.prefabsGameCard),
        i = e.getComponent(GameCardSprite.default);
      i.init(GameCardSpriteType.default.TypeBIG);
      this.cardSizeBig = new cc.Vec2(e.getContentSize().width * e.scale, e.getContentSize().height * e.scale);
      i.init(GameCardSpriteType.default.TypeHIDE);
      this.cardSizeHiden = new cc.Vec2(e.getContentSize().width * e.scale, e.getContentSize().height * e.scale);
      i.init(GameCardSpriteType.default.TypeMEDIUM);
      this.cardSizeMedium = new cc.Vec2(e.getContentSize().width * e.scale, e.getContentSize().height * e.scale);
      e.destroy();
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
    e.prototype.onDestroy = function() {
      if (null != this.poolScoreUI) {
        this.poolScoreUI.clear();
      }
    };
    e.prototype.getTag = function() {
      return "caorua";
    };
    e.prototype.resetNanBai = function() {
      this.nodeNanBai.active = false;
      this.blackLayer.active = true;
      this.blackLayer.opacity = 179;
    };
    e.prototype.resetProcessCountdown = function() {
      0;
    };
    e.prototype.startProcessCountdown = function(t) {
      this.btnFlipAllCard.angle = 0;
      this.btnFlipAllCard.opacity = 0;
      this.btnFlipAllCard.stopAllActions();
      this.btnFlipAllCard.runAction(cc.sequence(cc.delayTime(3), cc.fadeIn(.3)));
      this.btnFlipAllCard.runAction(cc.sequence(cc.delayTime(t - 1.5), cc.rotateTo(.2, 15).easing(cc.easeBackInOut()), cc.rotateTo(.2, 0)
        .easing(cc.easeBounceOut())));
    };
    e.prototype.stopProcessCountdown = function() {
      0;
    };
    e.prototype.onReceiveMessage = function(e, i, n) {
      switch (t.prototype.onReceiveMessage.call(this, e, i, n), e) {
        case BaCayMessage.default.DEAL_CARDS:
        case BaCayMessage.default.UPDATE_ARRANGE_CARDS_STATE:
        case BaCayMessage.default.FINISH_GAME:
        case BaCayMessage.default.START_BETTING:
        case BaCayMessage.default.REARRANGE_CARDS:
        case BaCayMessage.default.INFORM_ROYALTIES:
        case BaCayMessage.default.UPDATE_CURRENT_CARDS_STATE:
        case BaCayMessage.default.ARRANGED:
          this.onBaCayEventReciveHandle(i, n);
      }
    };
    e.prototype.onBaCayEventReciveHandle = function(t, e) {
      if (null !== e && void 0 !== e) {
        switch (e.cmd) {
          case BaCayMessage.default.DEAL_CARDS:
            this.isAutoFlipCard = this.isAutoFlipCardTarget;
            var i = e.cs,
              n = e.lpi;
            this.startGame(i, n);
            this.startProcessCountdown(e.T / 1e3);
            break;
          case BaCayMessage.default.START_BETTING:
            var o = e.T;
            o /= 1e3;
            this.hideALLForStart();
            this.startBetting(o);
            this.chipController.ClearAllChipInTable();
            this.resetNanBai();
            this.checkAndClearCardOfMine();
            break;
          case BaCayMessage.default.UPDATE_ARRANGE_CARDS_STATE:
            e.uid;
            e.iar;
            null !== e.r && void 0 !== e.r && parseInt(e.r);
            break;
          case BaCayMessage.default.FINISH_GAME:
            this.finishThisGame(e);
            break;
          case BaCayMessage.default.ARRANGED:
            this.Arranged(e);
        }
      }
    };
    e.prototype.checkAndClearCardOfMine = function() {
      for (var t = 0; t < this.listCardMine.length; t++) {
        this.listCardMine[t].node.active = false;
      }
      this.playersPlaying.forEach(function(t) {
        if (null != t && void 0 != t) {
          t.hideAllCard(false);
        }
      });
    };
    e.prototype.onSwitchButtonAutoFlipAllCard = function(t, e) {
      this.isAutoFlipCardTarget = t.isChecked;
      if (this.isAutoFlipCardTarget) {
        AnalyticsManager.default.getInstance().logEvent("UserUseAutoFlipAllCard");
      } else {
        AnalyticsManager.default.getInstance().logEvent("UserNotUseAutoFlipAllCard");
      }
    };
    e.prototype.onGetInGameTableInfo = function(e) {
      this.isAutoFlipCardTarget = false;
      this.toggleAutoFlipAllCard.isChecked = false;
      this.isAutoFlipCard = false;
      this.resetCardReview();
      this.reset();
      this.chipController.ClearAllChipInTable();
      this.hideAllCard();
      this.resetNanBai();
      this.resetProcessCountdown();
      t.prototype.onGetInGameTableInfo.call(this, e);
      var i = e.b,
        n = e.gS,
        o = e.rmT;
      o /= 1e3;
      var a = e.aid;
      this.maxUserInRoom = e.Mu;
      var c = false;
      if (null !== e.hpwd && void 0 !== e.hpwd) {
        c = e.hpwd;
      }
      this.state = MessageCardGameHandler.GameState.WAITING;
      if (!(4 !== n && 5 !== n)) {
        this.state = MessageCardGameHandler.GameState.VIEWING;
      }
      this.setGameConfig(i, n, o, a, this.maxUserInRoom, c);
      var l = e.ps;
      if (this.createListPlayerWhenGetTableInfo(l), this.updateViewPostions(true), this.state === MessageCardGameHandler.GameState.VIEWING) {
        if (null !== e.re && void 0 !== e.re && e.re) {
          for (var h, u = l.length, d = 0; d < u; d++) {
            var p = l[d];
            if (0 === p.uid.localeCompare(GamePlayManager.default.getInstance().userID)) {
              h = p.cs;
              if (null !== p.rr && void 0 !== p.rr) {
                u = p.rr;
              }
              break;
            }
          }
          this.reconnectLastGame(h, u);
          this.updateViewingPlayerPositions();
        } else {
          this.chipController.ClearAllChipInTable();
          this.chipController.BetForUserReconect(this.players.length, this.betOfTable);
          this.showViewTableMessage();
        }
        if (this.initPlayerCardsViewing(), null !== e.re && void 0 !== e.re && e.re && this.showuserAnDanh(), null !== e.fi && void 0 !==
          e.fi) {
          var f = e.fi;
          if (f.ps.length > 0) {
            this.finishThisGame(f, true);
          }
        }
      } else {
        this.startBetting(o);
      }
      this.updateReadyStatus();
      this.countMatch = 0;
    };
    e.prototype.removeInviteBtnsInList = function(t) {
      this.inviteBtns.splice(t, 1);
    };
    e.prototype.getRmcDefaul = function() {
      return 3;
    };
    e.prototype.checkReconnect = function(t) {
      return t.uid.localeCompare(GamePlayManager.default.getInstance().userID) && null !== t.re && void 0 !== t.re && false === t.re;
    };
    e.prototype.reset = function() {
      this.acps = [];
      for (var t = this.poolScoreUI.listObjectUsing, e = 0; e < t.length; e++) {
        t[e].hide();
      }
      if (null != this.poolScoreUI) {
        this.poolScoreUI.clear();
      }
      this.resetCardReview();
      if (null != this.animMatchExtratime) {
        this.animMatchExtratime.node.removeFromParent(true);
      }
      for (e = 0; e < this.listCardExtratime.length; e++) {
        this.listCardExtratime[e].node.removeFromParent(true);
      }
    };
    e.prototype.resetCardReview = function() {
      if (this.listCardReview.length > 0) {
        for (var t = 0; t < this.listCardReview.length; t++) {
          this.listCardReview[t].node.active = false;
          this.listCardReview[t].reset();
        }
      }
    };
    e.prototype.flipCloseCardReview = function() {
      if (this.listCardReview.length > 0) {
        for (var t = 0; t < this.listCardReview.length; t++) {
          this.listCardReview[t].runActionFlipCloseCard2();
        }
      }
    };
    e.prototype.flipCloseCardOfMine = function(t) {
      for (var e = 0; e < t.cards.length; e++) {
        t.cards[e].runActionFlipCloseCard2();
      }
    };
    e.prototype.reconnectLastGame = function(t, e) {
      this.chipController.ClearAllChipInTable();
      this.chipController.BetForUserReconect(e, this.betOfTable);
      this.showuserAnDanh();
      this.state = MessageCardGameHandler.GameState.PLAYING;
      this._playedOnce = true;
      this.daBaoBinh = false;
      var i = this._thisPlayerView;
      i.node.stopAllActions();
      i.node.position = this.listBtnInvitePos[0].position;
      for (var n = 0; n < t.length; n++) {
        var o = t[n];
        (a = i.cards[t.length - n - 1]).setType(GameCardSpriteType.default.TypeMEDIUM);
        a.setTextureWithCode(o, GamePlayManager.default.getInstance().gameID);
        a.node.active = true;
      }
      for (n = 0; n < 3; ++n) {
        var a;
        (a = i.cards[n]).index = n;
        a.node.position = this.getPlayerCardPositionMineBig(0, n);
        a.setType(GameCardSpriteType.default.TypeBIG);
        a.node.zIndex = GameZOrder.default.MIDDLE_TOP_2 + (3 - n) + 1;
      }
    };
    e.prototype.getViewPositionOfPlayer = function(t, e) {
      if (t.isMine()) {
        t.indexPos = 0;
        return this.inviteBtns[t.indexPos].position;
      }
      if (t.indexPos > 0) {
        return this.inviteBtns[t.indexPos].position;
      }
      for (var i = 1; i < this.POS9.length; ++i) {
        if (this.inviteBtns[this.POS9[i]].active) {
          t.indexPos = this.POS9[i];
          this.inviteBtns[this.POS9[i]].active = false;
          return this.inviteBtns[t.indexPos].position;
        }
      }
    };
    e.prototype.addPlayer = function(e, i, n, o, a, s, r, c, l, h, u, d, p) {
      var f = t.prototype.addPlayer.call(this, e, i, n, o, a, s, r, c, l, h, u, d, p);
      f.iniBaCayCard(this.prefabsGameCard);
      return f;
    };
    e.prototype.hideALLForStart = function() {
      this.node.stopAllActions();
      this.players.forEach(function(t) {
        t.hideAllCard(false);
        t.removeBubbleFx();
      });
    };
    e.prototype.startGame = function(t, e) {
      var i = this;
      MusicPlayer.default.getInstance().playEffect("Sounds/chiabai");
      this.hideALLForStart();
      try {
        if (null != this.popupHasPlayerNotReady) {
          this.popupHasPlayerNotReady.hide();
        }
      } catch (t) {}
      if (this._dangKetThuc && this.handlePendingPlayers(), this._dangPhatBai = true, this.listCardMine = [], this.totalCardFliped = 0,
        this.isDidFlipAllCard = false, this.cardGameTableController.startGameUI(), this.locPlayingPlayer(e), this.state = MessageCardGameHandler.GameState
        .PLAYING, null !== this._thisPlayerView && void 0 !== this._thisPlayerView && t.length > 0) {
        this._thisPlayerView.setArrayCard(t, false);
        for (var n = [], o = 0; o < this._thisPlayerView.cards.length; ++o) {
          var a = this._thisPlayerView.cards[o];
          a.decodeCard(t[t.length - 1 - o], GamePlayManager.default.getInstance().gameID);
          a.index = o;
          if (this._thisPlayerView.isMine()) {
            n.push(a.getSuit());
          }
        }
        for (var c = 1; c < n.length; c++) {
          if (n[0] != n[c]) {
            this.isSameSuit = -1;
            break;
          }
          this.isSameSuit = n[0];
        }
      }
      this.chipController.BetForAllUser(this.playersPlaying, this.betOfTable);
      this.node.runAction(cc.sequence(cc.delayTime(1.1), cc.callFunc(function() {
        i.dealCardForPlayer(t);
      })));
    };
    e.prototype.dealCardForPlayer = function(t) {
      for (var e = this, i = 0; i < this.players.length; ++i) {
        var n = this.players[i];
        n.iconnReady.active = false;
        n.isHost;
      }
      for (i = 0; i < this.playersPlaying.length; i++) {
        var o = this.playersPlaying[i],
          a = o.isMine();
        if (true !== a || 0 !== t.length) {
          for (var s = 0, r = 0; r < o.cards.length; ++r) {
            var c = o.cards[r];
            c.node.active = true;
            var l = .6,
              h = 1 - (.2 + .1 * r),
              u = null;
            if (a) {
              this.listCardMine.push(c);
              var f = this.getPlayerCardPositionMineBig(o.indexPos, r),
                g = f.mag();
              c.setType(GameCardSpriteType.default.TypeBIG);
              c.node.zIndex = GameZOrder.default.MIDDLE_TOP_2 + (3 - r) + 1;
              l = g / 1300;
              if (this.isAutoFlipCard) {
                u = cc.sequence(cc.delayTime(h), cc.callFunc(this.phatBaiFX, this, c), cc.moveTo(l, f));
                c.runActionFlip2(h + l + s + .2);
                s += .05;
              } else {
                u = cc.sequence(cc.delayTime(h), cc.callFunc(this.phatBaiFX, this, c), cc.moveTo(l, f), cc.fadeOut(0));
                this.createCardReview(c.serverCode, r, f, c.node.scale, h + l);
              }
              c.node.runAction(u);
            } else {
              c.setType(GameCardSpriteType.default.TypeMEDIUM);
              u = cc.sequence(cc.delayTime(h), cc.moveTo(l, this.getPlayerCardPosition(o.indexPos, r, this.distanceCard)).easing(cc
                .easeBackOut()));
              c.node.runAction(u);
            }
            c.node.eulerAngles = new cc.Vec3(-23, 0, 0);
            c.Rotationby(h, l, 23, false);
          }
        }
      }
      this.node.runAction(cc.sequence(cc.delayTime(1.16 + .2), cc.callFunc(function() {
        e.finishPhatBai();
      }), cc.delayTime(.2), cc.callFunc(function() {
        if (e.isAutoFlipCard) {
          for (var i = 0; i < e.playersPlaying.length; i++) {
            if (e.playersPlaying[i].isMine() && e.isAutoFlipCard && t.length > 0) {
              e.sendArayArranged(t);
            }
          }
        }
      })));
      this.showuserAnDanh();
    };
    e.prototype.dealCardForExtraTime = function(t, e) {
      var i = this;
      if (0 != e.length) {
        for (var n = function(t) {
            var n = e[t],
              a = o.getPlayer(n.uid),
              r = null;
            (r = cc.instantiate(o.prefabsGameCard).getComponent(GameCardSprite.default)).node.parent = o.node;
            if (a.isMine()) {
              r.init(GameCardSpriteType.default.TypeBIG);
              r.node.zIndex = GameZOrder.default.TOP + 10;
            } else {
              r.init(GameCardSpriteType.default.TypeMEDIUM);
              r.node.zIndex = GameZOrder.default.MIDDLE_TOP_2 + 10;
            }
            r.setServerCode(n.cs);
            o.listCardExtratime.push(r);
            var c = cc.moveTo(.3, o.getPlayerCardExtratimePosition(a.indexPos, 0, new cc.Vec2(0, 0))),
              l = cc.sequence(c, cc.delayTime(.1), cc.callFunc(function() {
                if (i.state === MessageCardGameHandler.GameState.PLAYING) {
                  r.runActionFlip2();
                }
              }), cc.delayTime(.3), cc.callFunc(function() {
                if (i.state === MessageCardGameHandler.GameState.PLAYING) {
                  i.addScoreUIForExtratime(a, i.getScoreOfCard(r));
                }
              }), cc.delayTime(2.5), cc.callFunc(function() {
                r.node.runAction(cc.removeSelf(true));
              }));
            r.node.runAction(l);
          }, o = this, a = 0; a < e.length; a++) {
          n(a);
        }
      }
    };
    e.prototype.openCard = function(t, e) {
      if (null != e && void 0 != e) {
        e.runActionFlip2();
      }
    };
    e.prototype.finishMathExtratime = function(t, e) {
      e.node.runAction(cc.removeSelf(true));
    };
    e.prototype.createCardReview = function(t, e, i, n, o) {
      var a = e,
        s = null;
      if (3 != this.listCardReview.length) {
        s = cc.instantiate(this.prefabsGameCard);
        this.listCardReview.push(s.getComponent(GameCardSprite.default));
      } else {
        s = this.listCardReview[a].node;
      }
      var c = cc.instantiate(this.prefabsGameCard);
      c.getComponent(GameCardSprite.default).setServerCode(t);
      c.getComponent(GameCardSprite.default).enableTouch(this.callBackCardFlip.bind(this), true);
      c.getComponent(GameCardSprite.default).isFading = false;
      c.active = true;
      c.opacity = 255;
      c.position = cc.Vec2.ZERO;
      c.parent = s;
      this.listCardBacks.push(c);
      s.parent = this.node;
      s.opacity = 0;
      s.setPosition(i.x, i.y);
      s.active = true;
      s.zIndex = GameZOrder.default.TOP_MOST + (3 - e) + 1;
      var l = s.getComponent(GameCardSprite.default);
      l.node.width;
      l.setType(GameCardSpriteType.default.TypeBIG);
      l.setTextureWithCode(t, GamePlayManager.default.getInstance().gameID);
      s.scale;
      var f = 1.5 * l.cardSprite.node.width;
      c.runAction(cc.sequence(cc.delayTime(o), cc.callFunc(function() {
        s.opacity = 255;
      })));
      s.setScale(n);
      s.runAction(cc.sequence(cc.delayTime(o), cc.callFunc(function() {
        MusicPlayer.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_preflop_card_distribution");
      }), cc.delayTime(.6), cc.callFunc(function() {
        if (0 == this.blackLayer.opacity) {
          this.blackLayer.opacity = 1;
          this.blackLayer.stopAllActions();
          this.blackLayer.runAction(cc.fadeTo(.2, 179));
        }
        this.nodeNanBai.active = true;
        this.nodeNanBai.zIndex = GameZOrder.default.TOP_MOST;
        var t = cc.moveTo(.25, new cc.Vec2((2 - a) * (f + 30) - 30 - f, 0));
        t.easing(cc.easeBackOut());
        var e = cc.scaleTo(.25, 1.5);
        e.easing(cc.easeBackOut());
        s.runAction(t);
        s.runAction(e);
      }.bind(this))));
    };
    e.prototype.playParticleCard = function() {
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
    e.prototype.callBackCardFlip = function(t) {
      this.totalCardFliped++;
      if (this.totalCardFliped >= 3) {
        this.flipAllCard();
        AnalyticsManager.default.getInstance().logEvent("ShowAllCardCaoRua", JSON.parse('{"ShowCard":"ViewCardLittleByLittle"}'));
      }
      this.sendArranged(t.serverCode);
      GamePlayManager.default.getInstance().countMatchNotInteract = 0;
    };
    e.prototype.buttonFlipAllCardClick = function() {
      this.flipAllCard();
      for (var t = [], e = 0; e < this.playersPlaying.length; ++e) {
        var i = this.playersPlaying[e];
        if (i.isMine() && this.state === MessageCardGameHandler.GameState.PLAYING) {
          for (var n = 0; n < i.cards.length; n++) {
            t.push(i.cards[n].serverCode);
          }
          break;
        }
      }
      this.sendArayArranged(t);
      GamePlayManager.default.getInstance().countMatchNotInteract = 0;
      AnalyticsManager.default.getInstance().logEvent("ShowAllCardCaoRua", JSON.parse('{"ShowCard":"ClickButtonShowAll"}'));
    };
    e.prototype.flipAllCard = function(t) {
      if (void 0 === t) {
        t = true;
      }
      this.nodeNanBai.active = false;
      this.showAnim3TayOfMe();
      for (var e = 0; e < this.listCardReview.length; e++) {
        if (this.listCardReview[e].node.scale > this.cardSmallScale) {
          this.isDidFlipAllCard = false;
          break;
        }
      }
      if (!this.isDidFlipAllCard && null != this._thisPlayerView) {
        MusicPlayer.default.getInstance().playbtnClick();
        this.isDidFlipAllCard = true;
        for (var i = 0; i < this.listCardBacks.length; i++) {
          this.listCardBacks[i].destroy();
        }
        this.listCardBacks = [];
        this.endFlipCard(t);
        for (var n = 0; n < this.playersPlaying.length; ++n) {
          if (this.playersPlaying[n].isMine() && this.state === MessageCardGameHandler.GameState.PLAYING) {
            this._khongThaoTac = false;
            break;
          }
        }
      }
    };
    e.prototype.endFlipCard = function(t) {
      if (void 0 === t) {
        t = true;
      }
      this.blackLayer.runAction(cc.fadeOut(.2));
      this.nodeNanBai.active = false;
      this.listBtnInvitePos[0].position;
      for (var e = 0, i = this.listCardReview.length - 1; i >= 0; i--) {
        var n = this.listCardReview[i];
        n.node.zIndex = GameZOrder.default.TOP;
        if (null != this.listCardMine[i]) {
          n.node.runAction(cc.sequence(cc.delayTime(e), cc.moveTo(.35, this.listCardMine[i].node.position).easing(cc.easeBackOut())));
          n.node.runAction(cc.sequence(cc.delayTime(e), cc.scaleTo(.35, this.listCardMine[i].node.scale).easing(cc.easeBackOut())));
          e += .075;
        }
      }
    };
    e.prototype.phatBaiFX = function(t, e) {
      e.node.active = true;
      e.node.opacity = 255;
    };
    e.prototype.onClickXepLai = function() {
      BaCayRequest.default.getInstance().sendRearrangeCards();
    };
    e.prototype.finishPhatBai = function() {
      this._dangPhatBai = false;
      if (!this._thisPlayerView.checkInThisArray(this.playersPlaying)) {
        this.state = MessageCardGameHandler.GameState.VIEWING;
      }
      this.players.forEach(function(t) {
        t.isMine();
      });
    };
    e.prototype.Arranged = function(t) {
      var e = this.getPlayer(t.uid);
      if (!e.isMine() && null !== e && void 0 !== e) {
        for (var i = [], n = this.getListCardOpenOfPlayer(e), o = 0; o < t.cs.length; o++) {
          for (var a = false, s = 0; s < n.length; s++) {
            if (t.cs[o] == n[s]) {
              a = true;
              break;
            }
          }
          if (0 == a) {
            i.push(t.cs[o]);
          }
        }
        var r = 0;
        for (s = 0; s < t.cs.length; s++) {
          for (o = 0; o < e.cards.length; o++) {
            var c = e.cards[o];
            if (c.isCardBack) {
              c.setServerCode(i[s]);
              c.runActionFlip2(r);
              r += .05;
              break;
            }
          }
        }
        if (this.checkListCardJqkHeart(this.getListCardOpenOfPlayer(e))) {
          e.showBonusMoneyFxForPlayer(this.bet * this.bonusJQKHeartMultiply, 2, .5);
        }
      }
    };
    e.prototype.getListCardOpenOfPlayer = function(t) {
      for (var e = [], i = 0; i < t.cards.length; i++) {
        if (0 == t.cards[i].isCardBack) {
          e.push(t.cards[i].serverCode);
        } else {
          e.push(-1);
        }
      }
      return e;
    };
    e.prototype.finishThisGame = function(t, e) {
      var i = this;
      if (void 0 === e) {
        e = false;
      }
      this._dangKetThuc = true;
      for (var n = 0; n < this.players.length; n++) {
        for (var o = (l = this.players[n]).isMine(), a = 0; a < l.cards.length; a++) {
          var s = l.cards[a];
          if (o) {
            s.node.zIndex = GameZOrder.default.MIDDLE_TOP_2 + (3 - a) + 1;
          }
        }
      }
      t.hb;
      t.hsc;
      t.hsh;
      t.hsl;
      var r = t.ps;
      this.acps = t.acps;
      var c;
      for (n = 0; n < r.length; n++) {
        var l,
          h = r[n],
          u = h.uid;
        if (null !== (l = this.getPlayer(u)) && void 0 !== l) {
          l.isReady = false;
          l.mauBinhSoBai = false;
          var f = this.sortCardArray(l, h.cs);
          if (l.isMine()) {
            if (0 == this.isAutoFlipCard) {
              for (a = 0; a < f.length && a < l.cards.length; a++) {
                g = f[a];
                (s = l.cards[f.length - a - 1]).index = f.length - a - 1;
                s.setServerCode(g);
                s.setType(GameCardSpriteType.default.TypeBIG);
              }
            }
          } else {
            for (var a = 0; a < f.length && a < l.cards.length; a++) {
              var g = f[a],
                s = l.cards[a];
              if (false === this.isGameAnDanhCheck) {
                s.setType(GameCardSpriteType.default.TypeMEDIUM);
                s.setServerCode(g);
              }
            }
          }
          2;
          var m = h.mX;
          if (l.isShowAnimBonusMoney) {
            m += this.bet * this.bonusJQKHeartMultiply;
          }
          l._winnings = m;
          m;
          var y = h.m;
          if (l.isShowAnimBonusMoney) {
            y += this.bet * this.bonusJQKHeartMultiply;
          }
          l._money = y;
          var S = h.tp;
          l.totalPoint = S;
        }
      }
      c = this.acps.length > 0 ? cc.sequence(cc.callFunc(this.showResult, this, 1), cc.delayTime(4), cc.callFunc(function() {
        for (var t = [], e = 0; e < i.acps.length; e++) {
          var n = cc.callFunc(i.showResultExtraTime, i),
            o = cc.delayTime(1),
            a = cc.callFunc(i.dealCardForExtraTime, i, i.acps[e]),
            s = cc.delayTime(4);
          t.push(n, o, a, s);
        }
        var r = cc.sequence(t);
        i.node.runAction(r);
      }), cc.delayTime(5 * this.acps.length), cc.callFunc(this.showResultTable, this), cc.delayTime(1), cc.callFunc(this
        .handlePendingPlayers, this)) : cc.sequence(cc.callFunc(this.showResult, this, 1), cc.delayTime(4), cc.callFunc(this
        .showResultTable, this), cc.delayTime(1), cc.callFunc(this.handlePendingPlayers, this));
      this.node.runAction(c);
      this.onEndGame();
    };
    e.prototype.hideAllCard = function() {
      for (var t = 0; t < this.players.length; t++) {
        var e = this.players[t];
        if (!e.binhLung && !e.mauBinh) {
          for (var i = 0; i < e.cards.length; i++) {
            var n = e.cards[i];
            n.node.active = false;
            n.setColor(cc.Color.WHITE);
            n.node.stopAllActions();
          }
        }
      }
    };
    e.prototype.sortCardArray = function(t, e) {
      for (var i = [], n = 0; n < t.cards.length; n++) {
        if (0 == t.cards[n].isCardBack) {
          i.push(t.cards[n].serverCode);
        }
      }
      for (n = 0; n < t.cards.length; n++) {
        for (var o = false, a = 0; a < i.length; a++) {
          if (e[n] == i[a]) {
            o = true;
            break;
          }
        }
        if (0 == o) {
          i.push(e[n]);
        }
      }
      i.length;
      return i;
    };
    e.prototype.showThis = function(t, e) {
      e.active = true;
    };
    e.prototype.setGrayColorThisCard = function(t, e) {
      e.setColor(cc.Color.GRAY);
      e.node.active = true;
      e.node.opacity = 255;
    };
    e.prototype.setHidenThisCard = function(t, e) {
      e.setColor(cc.Color.WHITE);
      e.setType(GameCardSpriteType.default.TypeHIDE);
      e.node.active = true;
      e.node.opacity = 255;
    };
    e.prototype.removeEffect = function() {
      this.listEffectSoChi.forEach(function(t) {
        t.destroy();
      });
      this.listEffectSoChi = [];
    };
    e.prototype.showResult = function(t, e) {
      if (0 == this.isDidFlipAllCard) {
        this.flipAllCard();
      }
      for (var i = [], n = null, o = this.getMaxScoreOfAllPlayer(), a = 0; a < this.playersPlaying.length; ++a) {
        var r = this.playersPlaying[a];
        if (!(r.isMine() && this.state === MessageCardGameHandler.GameState.VIEWING)) {
          if (this.state === MessageCardGameHandler.GameState.PLAYING) {
            if (r.isMine()) {
              n = r;
            } else {
              i.push(r);
            }
          }
        }
      }
      if (this.state === MessageCardGameHandler.GameState.PLAYING) {
        var c = 0,
          l = 3 / this.playersPlaying.length,
          h = false,
          u = this.getTotalScore(n);
        if (o == u && 999 != u && this.acps.length > 0) {
          h = true;
        }
        this.addScoreUI(n, false, c, h, false);
        for (a = 0; a < i.length; ++a) {
          if (this.checkCardJqkHeart(i[a])) {
            i[a].showBonusMoneyFxForPlayer(this.bet * this.bonusJQKHeartMultiply, 2, c + .5);
          }
          var d = this.getTotalScore(i[a]);
          h = false;
          if (o == d && 999 != d && this.acps.length > 0) {
            h = true;
          }
          this.addScoreUI(i[a], true, c, h, false);
          c += l;
        }
      }
    };
    e.prototype.shuffleArray = function(t) {
      var e, i, n;
      for (n = t.length - 1; n > 0; n--) {
        e = Math.floor(Math.random() * (n + 1));
        i = t[n];
        t[n] = t[e];
        t[e] = i;
      }
      return t;
    };
    e.prototype.addScoreUIForExtratime = function(t, e) {
      var i = cc.instantiate(this.prefabBaCayScoreUI).getComponent(BaCayScoreUI.default);
      i.setScore(e, true);
      i.node.parent = this.node;
      var n = this.listCardPositionExtratime[t.indexPos].position;
      if (t.isMine()) {
        i.node.setPosition(cc.v2(n.x, n.y - 80));
      } else {
        i.node.setPosition(cc.v2(n.x, n.y - 70));
      }
      i.node.zIndex = GameZOrder.default.MIDDLE_TOP_2 + 94;
      i.node.opacity = 255;
      i.fade(0, 2.2, t.isMine(), false, false);
      i.setFadeOutCallback(function(t) {
        this.poolScoreUI.addObject(t);
      }.bind(this));
      this.poolScoreUI.addObjectUsing(i);
    };
    e.prototype.addScoreUI = function(t, e, i, n, o) {
      if (void 0 === e) {
        e = false;
      }
      if (void 0 === i) {
        i = -1;
      }
      var a = this.getTotalScore(t);
      if (!t.isMine() || 999 != a || 0 != e) {
        var s = cc.instantiate(this.prefabBaCayScoreUI).getComponent(BaCayScoreUI.default);
        s.setScore(a, true);
        s.node.parent = this.node;
        var r = this.listPlayerCardPos[t.indexPos].position;
        if (t.isMine()) {
          s.node.setPosition(cc.v2(r.x, r.y - 90));
        } else {
          s.node.setPosition(cc.v2(r.x - 40, r.y - 140));
        }
        s.node.y += 60;
        s.node.zIndex = GameZOrder.default.TOP_MOST;
        s.node.opacity = 255;
        var c = i;
        if (1 == e) {
          c = this.getDelayTime(a);
          c += 1;
        }
        var h = 0;
        if (t.isMine() && 999 == a && e) {
          c = 0;
          h = 1;
          s.node.x -= 100;
          s.node.y += 280;
        }
        if (!(t.isMine() && this.isCardPlayerBack(t))) {
          this.flipCardOfPlayer(t, c);
        }
        if (o) {
          t.showBonusMoneyFxForPlayer(this.bet * this.bonusJQKHeartMultiply, 2, 2.5);
        }
        c += .2;
        s.fade(c, 2 + h, t.isMine(), n, o);
        s.setFadeOutCallback(function(t) {
          this.poolScoreUI.addObject(t);
        }.bind(this));
        this.poolScoreUI.addObjectUsing(s);
      }
    };
    e.prototype.showScoreOfMe = function() {
      for (var t = 0; t < this.playersPlaying.length; ++t) {
        var e = this.playersPlaying[t];
        if (e.isMine()) {
          return void this.addScoreUI(e, false, 0, false, false);
        }
      }
    };
    e.prototype.showAnim3TayOfMe = function() {
      for (var t = 0, e = 0; e < this.playersPlaying.length; ++e) {
        var i = this.playersPlaying[e];
        t = this.getTotalScore(i);
        var n = this.checkCardJqkHeart(i);
        if (999 == t && i.isMine()) {
          return void this.addScoreUI(i, true, 0, false, n);
        }
      }
    };
    e.prototype.getUserIDOfMine = function() {
      for (var t = 0; t < this.players.length; t++) {
        var e = this.players[t];
        if (e.isMine()) {
          return e.userID;
        }
      }
      return "0";
    };
    e.prototype.sendArranged = function(t) {
      if (void 0 === t) {
        t = -1;
      }
      CardGameCommonRequest.default.getInstance().sendArranged(BaCayMessage.default.ARRANGED, this.getUserIDOfMine(), t);
    };
    e.prototype.sendArayArranged = function(t) {
      if (void 0 === t) {
        t = [];
      }
      CardGameCommonRequest.default.getInstance().sendArrayArranged(BaCayMessage.default.ARRANGED, this.getUserIDOfMine(), t);
    };
    e.prototype.getDelayTime = function(t) {
      var e = this.getTotalTypeScore(),
        i = e.indexOf(t);
      if (i < 0) {
        i = 0;
      } else {
        if (i > 9) {
          i = 10;
        }
      }
      return i * (2.5 / e.length);
    };
    e.prototype.getTotalTypeScore = function() {
      for (var t = [], e = 0; e < this.playersPlaying.length; ++e) {
        var i = this.playersPlaying[e];
        if (0 == i.isMine()) {
          t.push(this.getTotalScore(i));
        }
      }
      var n = [];
      for (e = 0; e < t.length; e++) {
        if (n.indexOf(t[e]) < 0) {
          n.push(t[e]);
        }
      }
      return n.sort(function(t, e) {
        return t - e;
      });
    };
    e.prototype.flipCardOfPlayer = function(t, e) {
      this.node.runAction(cc.sequence(cc.delayTime(e), cc.callFunc(function() {
        for (var e = 0, i = 0; i < t.cards.length; ++i) {
          t.cards[i].runActionFlip2(e);
          e += .05;
        }
      })));
    };
    e.prototype.flipCloseCardOfPlayer = function(t, e) {
      this.node.runAction(cc.sequence(cc.delayTime(e), cc.callFunc(function() {
        for (var e = 0, i = 0; i < t.cards.length; ++i) {
          t.cards[i].runActionFlipCloseCard2(e);
          e += .05;
        }
      })));
    };
    e.prototype.isCardPlayerBack = function(t) {
      for (var e = 0; e < t.cards.length; ++e) {
        if (t.cards[e].isCardBack) {
          return true;
        }
      }
      return false;
    };
    e.prototype.checkCardJqkHeart = function(t) {
      for (var e = 0, i = 0; i < t.cards.length; ++i) {
        var n = t.cards[i].serverCode;
        if (!(43 != n && 47 != n && 51 != n)) {
          e++;
        }
      }
      return 3 == e;
    };
    e.prototype.checkListCardJqkHeart = function(t) {
      for (var e = 0, i = 0; i < t.length; ++i) {
        if (!(43 != t[i] && 47 != t[i] && 51 != t[i])) {
          e++;
        }
      }
      return 3 == e;
    };
    e.prototype.getTotalScore = function(t) {
      for (var e = 0, i = 0, n = 0; n < t.cards.length; ++n) {
        var o = t.cards[n];
        if (14 == o.N) {
          e++;
        } else {
          if (o.N < 10) {
            e += o.N;
          } else {
            if (o.N > 10 && o.N <= 13) {
              i++;
            }
          }
        }
      }
      e %= 10;
      if (3 == i) {
        e = 999;
      }
      return e;
    };
    e.prototype.getScoreOfCard = function(t) {
      var e = 0;
      if (14 == t.N) {
        e++;
      } else {
        if (t.N < 10) {
          e += t.N;
        }
      }
      if (e > 10) {
        e %= 10;
      }
      return e;
    };
    e.prototype.showResultExtraTime = function() {
      var t = cc.instantiate(this.prefabBaCayAnimExtratime).getComponent(BaCayAnimExtratime.default);
      t.node.parent = this.particleCaoRua.node;
      t.node.zIndex = GameZOrder.default.TOP_MOST;
      t.showAnimDealCardExtratime();
      this.animMatchExtratime = t;
      for (var e = this.getMaxScoreOfAllPlayer(), i = 0; i < this.players.length; ++i) {
        var n = this.players[i],
          o = this.getTotalScore(n);
        if (o < e) {
          if (n.isMine()) {
            this.resetCardReview();
          } else {
            n.hideAllCard(false);
          }
        } else {
          if (o == e && this.state === MessageCardGameHandler.GameState.PLAYING) {
            if (n.isMine()) {
              if (this.isAutoFlipCard) {
                this.flipCloseCardOfMine(n);
              } else {
                this.flipCloseCardReview();
              }
            } else {
              if (0 == this.isCardPlayerBack(n)) {
                this.flipCloseCardOfPlayer(n, 0);
              }
            }
          }
        }
      }
    };
    e.prototype.getMaxScoreOfAllPlayer = function() {
      for (var t = -1, e = 0; e < this.players.length; ++e) {
        var i = this.players[e],
          n = this.getTotalScore(i);
        if (t < n) {
          t = n;
        }
      }
      return t;
    };
    e.prototype.showResultTable = function() {
      this.removeEffect();
      MusicPlayer.default.getInstance().playEffect("Sounds/finished");
      this.updateReadyStatus();
      for (var t = [], e = 0; e < this.players.length; ++e) {
        var i = this.players[e];
        if (i.removeBubbleFx(), this.state === MessageCardGameHandler.GameState.VIEWING && i.isMine()) {
          i.mauBinhSoBai = false;
        } else {
          i.setMoney(i._money);
          if (false === this.isGameAnDanhCheck) {
            i.showMoneyFxForPlayer(i._winnings, 3.5);
            if (i._winnings > 0) {
              i.runWinAction(3.5);
              t.push(i.node.position);
            }
          }
          i._winnings = 0;
        }
      }
      if (this.chipController.setListPositionOfUser(t), this.chipController.GetChipForUser(), this.countMatch++, this
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
    e.prototype.onUserClickExit = function() {
      t.prototype.onUserClickExit.call(this);
      if (this.state != MessageCardGameHandler.GameState.PLAYING) {
        AnalyticsManager.default.getInstance().logEvent("UserLeaveRoomCaoRua", JSON.parse('{"AmountMatch":"' + this.countMatch + '"}'));
      }
    };
    e.prototype.handleKickOutUser = function() {
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
    e.prototype.handlePendingPlayers = function() {
      if (t.prototype.handlePendingPlayers.call(this), this._forcedQuit) {
        this.onLogOut();
      } else if (this._forcedToLeaveRoom) {
        this.handleLeaveRoomResponse();
      } else {
        if (GamePlayManager.default.getInstance().checkBaoTriGame()) {
          this.state = MessageCardGameHandler.GameState.WAITING;
          return void this.sendLeaveRoom();
        }
        if (this.players.forEach(function(t) {
            t.resetDefaultValueForMauBinh();
          }), this.removeEffect(), this.listEffect.forEach(function(t) {
            t.destroy();
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
        for (var e = 0; e < this.players.length; e++) {
          var i = this.players[e];
          i._latBai = false;
          i.isShowAnimBonusMoney = false;
          i.cards.forEach(function(t) {
            t.node.active = false;
            t.setColor(cc.Color.WHITE);
            t.stopSparkling();
          });
        }
      }
    };
    e.prototype.initPlayerCardsViewing = function() {
      for (var t = 0 === this.playersPlaying.length, e = 0; e < this.players.length; ++e) {
        var i = this.players[e];
        if (i.isMine() || 2 !== i.state && 3 !== i.state) {
          if (t && i.isMine() && (2 === i.state || 3 === i.state)) {
            this.playersPlaying.push(i);
          }
          i.state;
        } else {
          for (var n = 0; n < i.cards.length; ++n) {
            var o = i.cards[n];
            o.setType(GameCardSpriteType.default.TypeMEDIUM);
            o.node.active = true;
            o.node.position = this.getPlayerCardPosition(i.indexPos, n, this.distanceCard);
          }
          i.state;
          if (t) {
            this.playersPlaying.push(i);
          }
        }
      }
    };
    e.prototype.showViewTableMessage = function() {
      this.node.runAction(cc.sequence(cc.delayTime(.7), cc.callFunc(function() {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("B\xe0n \u0111ang ch\u01a1i, xin vui l\xf2ng ch\u1edd!");
      })));
    };
    e.prototype.getPlayerCardPositionMineBig = function(t, e) {
      var i = this.listPlayerCardPos[t].position,
        n = i.x - (e - 1) * this.cardSizeBig.x * .4,
        o = i.y + 50;
      return new cc.Vec2(n + 0, o);
    };
    e.prototype.getPlayerCardExtratimePosition = function(t, e, i) {
      var n = this.listCardPositionExtratime[t].position,
        o = n.x - e * i.x,
        a = n.y + Math.floor(e / 5) * i.y;
      return new cc.Vec2(o + 0, a);
    };
    e.prototype.getPlayerCardPosition = function(t, e, i) {
      var n = this.listPlayerCardPos[t].position,
        o = n.x - e * i.x,
        a = n.y + Math.floor(e / 5) * i.y;
      return new cc.Vec2(o + 0, a);
    };
    e.prototype.getNameGame = function() {
      return "C\xe0o R\xf9a";
    };
    e.prototype.getListChatDefaultText = function() {
      return ["9 n\xfat n\xe8 b\xe0 con", "\u0110en qu\xe1 \xf4ng gi\xe1o \u1ea1", "Ti\u1ebfp n\xe0o",
        "Th\u1ea7n r\xf9a nh\u1eadp r\u1ed3i!", "L\u1ea1i thua r\u1ed3i", "Ba con t\xe2y n\xe8", "Xui qu\xe1 anh em \u01a1i",
        "B\xe0i \u0111\u1eb9p gh\xea", "M\xe0y h\u1ea3 b\u01b0\u1edfi", "May qu\xe1 m\u1ea5y b\u1ea1n"
      ];
    };
    e.prototype.setGameConfig = function(e, i, n, o, a, s) {
      t.prototype.setGameConfig.call(this, e, i, n, o, a, s);
      this.showHideInviteBtn();
      this.betOfTable = e;
    };
    e.prototype.onFocus = function(e) {
      t.prototype.onFocus.call(this, e);
      this.timeAutoSendData = this.timeAutoSendDataDefault;
    };
    e.prototype.onLostFocus = function() {
      t.prototype.onLostFocus.call(this);
      this.timeAutoSendData = 1.5 * this.timeAutoSendDataDefault;
    };
    e.prototype.setMiniGameNode = function() {};
    e.prototype.updateViewingPlayerPositions = function() {
      this.pendingJoinPlayers.sort(function(t, e) {
        return t.sit > e.sit ? 1 : t.sit < e.sit ? -1 : 0;
      });
      for (var t = 0; t < this.pendingJoinPlayers.length; ++t) {
        var e = this.pendingJoinPlayers[t];
        this.showPlayerViewBauCua(e, true);
        e.iconnReady.active = false;
        e.kickButton.active = false;
        if (StringUtil.default.checkVec2Equal(e.node.position, cc.Vec2.ZERO) || this.state === MessageCardGameHandler.GameState.WAITING) {
          e.pos = this.getViewPositionOfPlayer(e, t);
          if (this.state !== MessageCardGameHandler.GameState.VIEWING || e.isMine() || this._joinedTable) {
            e.runToPos(this.size);
          } else {
            e.node.position = e.pos;
          }
        }
      }
    };
    o([P([cc.Node])], e.prototype, "listPlayerCardPos", void 0);
    o([P([cc.Node])], e.prototype, "listCardPositionExtratime", void 0);
    o([P(cc.Node)], e.prototype, "playerCardPosWhenDone", void 0);
    o([P(cc.Prefab)], e.prototype, "prefabBaCayScoreUI", void 0);
    o([P(cc.Prefab)], e.prototype, "prefabBaCayAnimExtratime", void 0);
    o([P(cc.Node)], e.prototype, "nodeNanBai", void 0);
    o([P(cc.Node)], e.prototype, "blackLayer", void 0);
    o([P(ProcessCountdown.default)], e.prototype, "processTimeCountdown", void 0);
    o([P(ChipCaoRuaController.default)], e.prototype, "chipController", void 0);
    o([P(ParticleCaoRua.default)], e.prototype, "particleCaoRua", void 0);
    o([P(cc.Node)], e.prototype, "btnFlipAllCard", void 0);
    o([P(cc.Toggle)], e.prototype, "toggleAutoFlipAllCard", void 0);
    return e = o([A], e);
  }(GameController.default);
i.default = M;
void 0;
