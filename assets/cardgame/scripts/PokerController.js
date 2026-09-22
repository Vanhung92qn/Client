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
var a = require("./MessageCardGameHandler"),
  s = require("./GameCardSprite"),
  r = require("./GameCardSpriteType"),
  c = require("./GameController"),
  l = require("./GamePlayManager"),
  h = require("./PokerRequestHandler"),
  u = require("./GameConfigManager"),
  d = require("./PokerMessage"),
  p = require("./BetLabel"),
  f = require("./PkPot"),
  g = require("./BetListView"),
  m = require("./StringUtil"),
  y = require("./GameZOrder"),
  S = require("./MusicPlayer"),
  _ = require("./CommonPrefabsManager"),
  v = require("./MauBinhCheckCard"),
  b = require("./ErrorLogHandler"),
  C = require("./GameDefine"),
  T = require("./VersionController"),
  E = cc._decorator,
  I = E.ccclass,
  A = E.property,
  P = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.mainGamePokerViewModel = null;
      e.cardRotation = 8;
      e.betLabelPrefabs = null;
      e.listBetLabelPos = [];
      e.listBetLabel = [];
      e._communityCards = [];
      e.iConTheoTat = null;
      e.iConXemUp = null;
      e.btnToTheoUp = null;
      e.btntheoTatUpXem = null;
      e.theoBtn = null;
      e.xemBtn = null;
      e.toBtn = null;
      e.prefabBetListViewItem = null;
      e.betListView = null;
      e.listSmallChipPrefabs = [];
      e.listPkPots = [];
      e.pkSpriteAtlas = null;
      e.listCard_Hi = [];
      e.isDisTo = false;
      e.C57 = [];
      e.tempN = [];
      e.C56 = [];
      e.tempN1 = [];
      return e;
    }
    n(e, t);
    e.prototype.initDefaultData = function() {
      for (var e = 0; e < this.listBetLabel.length; e++) {
        this.listBetLabel[e].setNumber(0);
      }
      t.prototype.initDefaultData.call(this);
      this.autoReady = true;
      this.theoTat = false;
      this.xemUp = false;
      this.currentMaxBet = -1;
      this.currentBetMoneyOnSlider = 0;
      this.gameRutTien = true;
      for (var i = 0; i < this._communityCards.length; ++i) {
        var n = this._communityCards[i];
        if (null !== n && void 0 !== n && null !== n.node && void 0 !== n.node) {
          n.node.removeFromParent(true);
        }
      }
      this._communityCards = [];
      for (i = 0; i < this.listPkPots.length; i++) {
        for (var o = this.listPkPots[i], a = 0; a < o.coins.length; ++a) {
          if (null !== o.coins[a] && void 0 !== o.coins[a]) {
            o.coins[a].stopAllActions();
            o.coins[a].removeFromParent(true);
          }
        }
        o.coins = [];
        o.node.active = false;
      }
      this.moneys = [];
    };
    e.prototype.onLoad = function() {
      var e = this;
      t.prototype.onLoad.call(this);
      this.listBetLabelPos.forEach(function(t) {
        var i = cc.instantiate(e.betLabelPrefabs);
        i.parent = e.node;
        i.active = false;
        i.position = t.position;
        var n = i.getComponent(p.default);
        e.listBetLabel.push(n);
      });
      var i = cc.instantiate(this.prefabBetListViewItem);
      i.parent = this.node;
      i.active = false;
      i.zIndex = y.default.CHAT_BUBLES + 2;
      this.betListView = i.getComponent(g.default);
      this.betListView.onValueChange = this.OnBetListViewValueChange.bind(this);
      var n = cc.instantiate(this.prefabsGameCard),
        o = n.getComponent(s.default);
      o.init(r.default.TypeBIG);
      this.cardSizeBig = new cc.Vec2(n.getContentSize().width * n.scale, n.getContentSize().height * n.scale);
      o.init(r.default.TypeHIDE);
      this.cardSizeHiden = new cc.Vec2(n.getContentSize().width * n.scale, n.getContentSize().height * n.scale);
      n.destroy();
      this.get5CardData7();
      this.get5CardData6();
      this.btnToTheoUp.zIndex = y.default.MIDDLE;
      this.btntheoTatUpXem.zIndex = y.default.MIDDLE;
    };
    e.prototype.walkUp = function(t) {
      this.walkUpBase(t);
      this.mainGamePokerViewModel = t;
    };
    e.prototype.getTag = function() {
      return "poker";
    };
    e.prototype.handleErrorMessage = function(t) {
      if (void 0 != t && null != t && 0 != t.length) {
        _.default.getInstance().showPopupMessageUtil(t);
      }
    };
    e.prototype.onReceiveMessage = function(e, i, n) {
      switch (t.prototype.onReceiveMessage.call(this, e, i, n), e) {
        case a.Global_Message.ERROR_MESSAGE:
          this.handleErrorMessage(n.mgs);
          break;
        case d.default.DEAL_CARDS:
        case d.default.FLIP_CARDS:
        case d.default.CHANGE_TURN:
        case d.default.FINISH_GAME:
        case d.default.NEW_ROUND:
        case d.default.START_BETTING:
        case d.default.RAISE:
        case d.default.CALL:
        case d.default.FOLD:
        case d.default.CHECK:
        case d.default.WITHDRA_MONEY:
        case d.default.STAND_UP:
        case d.default.START:
          this.onPokerEventReciveHandle(i, n);
      }
    };
    e.prototype.onGetInGameTableInfo = function(e) {
      t.prototype.onGetInGameTableInfo.call(this, e);
      var i = e.b,
        n = e.gS,
        o = e.rmT;
      o /= 1e3;
      var s = e.aid,
        r = e.Mu,
        c = false;
      if (null !== e.hpwd && void 0 !== e.hpwd) {
        c = e.hpwd;
      }
      this.state = a.GameState.WAITING;
      if (4 === n) {
        this.state = a.GameState.VIEWING;
      }
      this.setGameConfig(i, n, o, s, r, c);
      var h = e.tfeg;
      h /= 1e3;
      this.timeToFinish = h;
      var u = e.MMBI,
        d = e.mMBI;
      this.setMoneyBuyInThreshold(d, u);
      var p = e.ps;
      if (this.createListPlayerWhenGetTableInfo(p), this.updateViewPostions(true), this.state === a.GameState.VIEWING) {
        this.initViewingCards(p);
        var f = e.cmc;
        this.newTurnRound("", f, false);
        this.setCurrentBetStateForPlayers(e.re);
        var g = e.bb,
          m = e.sb,
          y = e.D;
        if (this.setBlind(g, 1), this.setBlind(m, 2), this.setDealer(y), null !== e.pots && void 0 !== e.pots) {
          var S = e.pots;
          this.setPots(S);
        }
        if (null !== e.re && void 0 !== e.re && e.re) {
          var _,
            v = e.mb;
          this.currentMaxBet = v;
          for (var b = 0; b < p.length; b++) {
            var C = p[b],
              T = C.uid;
            if (_ = C.cs, 0 === T.localeCompare(l.default.getInstance().userID)) {
              _ = C.cs;
              break;
            }
          }
          this.reconnectLastGame(_, T);
        } else {
          this.showViewTableMessage();
        }
      } else {
        this.startBetting(o);
      }
      this.updateReadyStatus();
    };
    e.prototype.reconnectLastGame = function(t, e) {
      var i = this.getPlayer(e);
      if (i) {
        if (i.iconnReady.active = false, i.kickButton.active = false, i.isMine) {
          this.state = a.GameState.PLAYING;
          this.rutTienBtn.active = false;
          i.node.stopAllActions();
          this.updateViewPostions(true, false, true);
          this._daNgoi = true;
          for (var n = i.pos, o = n.x + this.cardSizeHiden.x, s = n.y + 5, c = 0; c < t.length; c++) {
            var h = t[c],
              u = i.cards[c];
            u.setTextureWithCode(h, l.default.getInstance().gameID);
            u.node.active = true;
            u.node.position = new cc.Vec2(o, s);
            u.setType(r.default.TypeSMALL);
            u.node.eulerAngles = new cc.Vec3(0, 0, 0);
            var d = this.cardRotation;
            if (1 == c) {
              d = -d;
            }
            u.node.runAction(cc.rotateTo(0, d));
            o += .4 * this.cardSizeBig.x;
          }
          if (6 === i.state) {
            this.nextTurn(i.userID);
            this.btnToTheoUp.active = true;
            if (this.remainingTime <= 20 && this.remainingTime > 0) {
              i.startCountDown(this.remainingTime, .05 * (20 - this.remainingTime));
            }
          } else {
            if (1 !== i.state && i._money > 0) {
              this.btntheoTatUpXem.active = true;
            }
          }
        } else {
          ;
        }
      }
    };
    e.prototype.initViewingCards = function(t) {
      if (this.state === a.GameState.VIEWING) {
        for (var e = 0; e < t.length; e++) {
          var i = t[e],
            n = i.uid,
            o = this.getPlayer(n),
            s = o.pos,
            c = s.x + this.cardSizeHiden.x,
            h = s.y + 5;
          if (!o.isMine() && i.pi) {
            for (var u = 0; u < 2; u++) {
              var d = o.cards[u];
              d.node.active = true;
              d.node.position = new cc.Vec2(c, h);
              d.setType(r.default.TypeSMALL);
              d.node.eulerAngles = new cc.Vec3(0, 0, 0);
              var p = this.cardRotation;
              if (1 == u && (p = -p), d.node.runAction(cc.rotateTo(0, p)), c += .4 * this.cardSizeBig.x, 1 === o.state) {
                o.cards[u].cardSprite.node.color = cc.Color.GRAY;
              }
            }
          } else if (o.isMine() && i.pi) {
            for (u = 0; u < i.cs.length; u++) {
              o.cards[u].setTextureWithCode(i.cs[u], l.default.getInstance().gameID);
            }
          }
        }
      }
      var f = [];
      for (e = 0; e < t.length; e++) {
        if (t[e].pi) {
          f.push(t[e].uid);
        }
      }
      this.locPlayingPlayer(f);
    };
    e.prototype.onPokerEventReciveHandle = function(t, e) {
      if (null !== e && void 0 !== e) {
        switch (e.cmd) {
          case d.default.START_BETTING:
            var i = e.T;
            i /= 1e3;
            this.startBetting(i);
            this.isHost && this.checkShowButtonStartGameWhenUserReady();
            T.default.getInstance().CheckForceUpdateByGameScene(C.GameConfigs.SceneName.Poker);
            break;
          case d.default.DEAL_CARDS:
            var n = e.cs,
              o = (g = e.tP).uid,
              a = e.bb,
              s = e.sb,
              r = a.uid,
              c = s.uid,
              l = e.D;
            this.setBlind(r, 1);
            this.setBlind(c, 2);
            this.setDealer(l);
            var h = e.lpi;
            this.startGame(n, h, o);
            var u = _.default.getInstance().popupBuyIn;
            u && u.isValid && u.node && u.onClickClose();
            break;
          case d.default.CHANGE_TURN:
            var p = e.mb;
            this.currentMaxBet = p;
            var f = e.fP,
              g = e.tP,
              m = f.pS,
              y = f.cb,
              S = f.m,
              v = f.uid,
              b = g.uid;
            this.setBetStateForPlayer(v, m, y, S);
            this.nextTurn(b);
            break;
          case d.default.NEW_ROUND:
            p = e.mb;
            this.currentMaxBet = p;
            f = e.fP;
            g = e.tP;
            var E = f.pS,
              I = f.cb,
              A = f.m;
            v = f.uid;
            b = g.uid;
            this.setBetStateForPlayer(v, E, I, A);
            var P = e.cmc;
            if (this.newTurnRound(b, P), null !== e.pots && void 0 !== e.pots) {
              var M = e.pots;
              this.updatePots(M);
            }
            break;
          case d.default.FINISH_GAME:
            var O = [],
              N = (v = (f = e.fP).uid, f.pS),
              B = f.cb,
              D = f.m;
            this.setBetStateForPlayer(v, N, B, D);
            for (var R = e.ps, L = 0; L < R.length; L++) {
              var w = R[L];
              O.push(w);
            }
            O.push(f);
            P = e.cmc;
            if (this.newTurnRound("", P), null !== e.pots && void 0 !== e.pots) {
              M = e.pots;
              this.updatePots(M, true);
            }
            this.finishThisGame(O);
        }
      }
    };
    e.prototype.onTheoTatClick = function() {
      S.default.getInstance().playbtnClick();
      if (this.theoTat) {
        this.theoTat = false;
      } else {
        this.theoTat = true;
        if (this.xemUp) {
          this.onXemUpClick();
        }
      }
      this.iConTheoTat.active = this.theoTat;
      this._khongThaoTac = false;
    };
    e.prototype.onXemUpClick = function() {
      S.default.getInstance().playbtnClick();
      if (this.xemUp) {
        this.xemUp = false;
      } else {
        this.xemUp = true;
        if (this.theoTat) {
          this.onTheoTatClick();
        }
      }
      this.iConXemUp.active = this.xemUp;
      this._khongThaoTac = false;
    };
    e.prototype.onToClick = function() {
      var t = new Date();
      if (!((t.getTime() - this.oldClickTime) / 1e3 < .3)) {
        if (this.oldClickTime = t.getTime(), false === this.betListView.node.active && !this.isClick) {
          this.setBetsListView();
          return void S.default.getInstance().playbtnClick();
        }
        if (0 !== this.currentBetMoneyOnSlider) {
          if (this.isClick) {
            return;
          }
          this.isClick = true;
          h.default.getInstance().sendRaise(this.currentBetMoneyOnSlider);
          this.betListView.node.active = false;
          this._khongThaoTac = false;
        }
      }
    };
    e.prototype.onTheoClick = function() {
      if (!this.isClick) {
        this.isClick = true;
        S.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_call");
        h.default.getInstance().sendCall();
        this._khongThaoTac = false;
      }
    };
    e.prototype.onUpClick = function() {
      if (!this.isClick) {
        this.isClick = true;
        h.default.getInstance().sendFold();
        this._khongThaoTac = false;
      }
    };
    e.prototype.onRutTienClick = function() {
      S.default.getInstance().playbtnClick();
      this._autoWithDrawMoney = false;
      this.withdrawMoney();
      this._khongThaoTac = false;
    };
    e.prototype.onXemClick = function() {
      if (!this.isClick) {
        this.isClick = true;
        h.default.getInstance().sendCheck();
        this._khongThaoTac = false;
      }
    };
    e.prototype.setBetsListView = function(t) {
      if (void 0 === t) {
        t = false;
      }
      this.currentBetMoneyOnSlider = 0;
      for (var e = this._thisPlayerView._money - this.currentMaxBet + this._thisPlayerView._currentBet, i = [], n = 0; n < this.players
        .length; ++n) {
        var o = this.players[n];
        if (1 != o.state) {
          i.push(o._money - this.currentMaxBet + o._currentBet);
        }
      }
      i.sort(function(t, e) {
        return t > e ? 1 : t < e ? -1 : 0;
      });
      if (this._thisPlayerView._money - this.currentMaxBet + this._thisPlayerView._currentBet == i[i.length - 1]) {
        e = i[i.length - 2];
      }
      var a = this.bet,
        s = [];
      if (e <= a) {
        s.push(e);
      } else {
        for (; a < e;) {
          if (s.push(a), e <= (a += this.bet)) {
            s.push(e);
            break;
          }
        }
      }
      if (t) {
        if (0 == s.length || s[s.length - 1] <= 0) {
          this.isDisTo = true;
        } else {
          this.isDisTo = false;
        }
      } else {
        this.betListView.loadData(s);
      }
    };
    e.prototype.setBetStateForPlayer = function(t, e, i, n, o, a, s) {
      if (void 0 === o) {
        o = true;
      }
      if (void 0 === a) {
        a = false;
      }
      if (void 0 === s) {
        s = false;
      }
      var r = this.getPlayer(t);
      if (null !== r && void 0 !== r) {
        r.stopCountDown();
        var c = i;
        if (r._money > n && 0 === i && (c = r._money + r._currentBet - n), i > r._currentBet || r._money > n) {
          var l;
          this.getViewPositionOfPlayer(r, r.index);
          l = r.indexPos;
          r.currentBetLb = this.listBetLabel[l];
          r.currentBetLb.node.opacity = 255;
          r.currentBetLb.node.active = true;
          r.currentBetLb.setNumber(c);
          var h = m.default.getRandomInt(2) + 1;
          if (i === this.bet) {
            h = 1;
          }
          for (var u = 0; u < h; u++) {
            var d = m.default.getRandomInt(this.listSmallChipPrefabs.length),
              p = cc.instantiate(this.listSmallChipPrefabs[d]);
            if (p.parent = this.node, p.scale = .9, p.position = r.node.position, p.active = true, o) {
              S.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_raise");
              var f = cc.sequence(cc.delayTime(.1 * u), cc.moveTo(.9, new cc.Vec2(r.currentBetLb.node.position.x + r.currentBetLb
                .chipIconPos.position.x, r.currentBetLb.node.position.y + r.currentBetLb.chipIconPos.position.y + 4 * r.coins.length
                )).easing(cc.easeExponentialOut()));
              p.runAction(f);
            } else {
              p.position = new cc.Vec2(r.currentBetLb.node.position.x + r.currentBetLb.chipIconPos.position.x, r.currentBetLb.node
                .position.y + r.currentBetLb.chipIconPos.position.y + 4 * u);
            }
            r.coins.push(p);
          }
          if (h > 1) {
            this.node.runAction(cc.sequence(cc.delayTime(.1), cc.callFunc(function() {
              S.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_raise");
            })));
          }
        }
        r._money = n;
        r._currentBet = i;
        var g,
          y = "";
        switch (e) {
          case 1:
            y = "\xdap";
            g = 1;
            for (var _ = 0; _ < r.cards.length; ++_) {
              r.cards[_].node.color = cc.Color.GRAY;
              r.cards[_].setBlackFace(true);
            }
            break;
          case 2:
            y = "Theo";
            g = 2;
            break;
          case 3:
            y = "Xem";
            g = 2;
            break;
          case 4:
            y = "T\u1ed1";
            g = 3;
            break;
          case 5:
            y = "T\u1ea5t Tay";
            g = 3;
        }
        if (r._money <= 0 && (r._money = 0), r.setMoney(r._money), r.state = e, e > 0 && e < 6) {
          var v = false;
          if (0 === r.indexPos || r.node.position.x > 50) {
            v = true;
          }
          if (a || s) {
            this.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
              r.showBubbleFx(y, g, o, v);
            })));
          } else {
            r.showBubbleFx(y, g, o, v);
          }
          if (o) {
            if (1 === e) {
              S.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_fold");
              r.showUpBaiFxForPlayer(3);
            } else {
              if (3 === e) {
                S.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_check");
              }
            }
          }
        }
        this.cardGameTableController.stopProgressStartGame();
      }
    };
    e.prototype.setCurrentBetStateForPlayers = function(t) {
      if (void 0 === t) {
        t = false;
      }
      for (var e = 0; e < this.players.length; ++e) {
        var i = this.players[e],
          n = i._currentBet;
        i._currentBet = 0;
        this.setBetStateForPlayer(i.userID, i.state, n, i._money, false, t, true);
        if (6 === i.state && this.remainingTime <= 20 && this.remainingTime > 0) {
          i.startCountDown(this.remainingTime, .05 * (20 - this.remainingTime));
        }
      }
    };
    e.prototype.newTurnRound = function(t, e, i) {
      var n = this;
      if (void 0 === i) {
        i = true;
      }
      if (this.xemUp) {
        this.onXemUpClick();
      }
      if (this.theoTat) {
        this.onTheoTatClick();
      }
      this.currentMaxBet = 0;
      for (var o = 0; o < this.players.length; ++o) {
        var c = this.players[o];
        if (i) {
          c._currentBet = 0;
        }
        if (1 !== c.state) {
          c.removeBubbleFx();
        }
      }
      this.btnToTheoUp.active = false;
      this.betListView.node.active = false;
      this.btntheoTatUpXem.active = false;
      this.isClick = false;
      var h = .95 * this.cardSizeBig.x,
        u = 2.2 * -h;
      if (this._communityCards.length > 0) {
        u = (_ = this._communityCards[this._communityCards.length - 1]).node.position.x + 1.1 * h;
      }
      var d = [];
      for (o = this._communityCards.length; o < e.length; o++) {
        var p = cc.instantiate(this.prefabsGameCard),
          f = p.getComponent(s.default);
        f.init(r.default.TypeBIG);
        f.setTextureWithCode(e[o], l.default.getInstance().gameID);
        d.push(f);
        p.parent = this.node;
        p.zIndex = y.default.MIDDLE;
        p.position = new cc.Vec2(u, 0);
        p.active = false;
        u += 1.1 * h;
      }
      var g = .05;
      for (o = 0; o < d.length; o++) {
        var _,
          b = (_ = d[o]).node.position;
        if (_.node.active = true, i) {
          _.node.position = new cc.Vec2(0, .2 * this.size.height);
          var C = cc.sequence(cc.delayTime(g - .01 * o), cc.callFunc(function() {
            S.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_card_distribution");
          }), cc.moveTo(.2, b));
          _.node.runAction(C);
          _.node.eulerAngles = new cc.Vec3(0, -180, 0);
          _.Rotationby(g + .03 * o + .1, .34, -180);
          if (o == d.length - 1 && t.length > 0) {
            _.node.runAction(cc.sequence(cc.delayTime(g + .03 * o + .1 + .34), cc.callFunc(function() {
              n.nextTurn(t);
            })));
          }
          g += .05;
        }
        this._communityCards.push(_);
      }
      if (null !== this._thisPlayerView && void 0 !== this._thisPlayerView && this._thisPlayerView.checkInThisArray(this
        .playersPlaying)) {
        var T = [];
        this._thisPlayerView.cards.forEach(function(t) {
          T.push(t);
        });
        this._communityCards.forEach(function(t) {
          T.push(t);
        });
        var E = -1;
        if (T.length > 5) {
          var I = [];
          if (6 === T.length) {
            I = this.C56;
          } else {
            if (7 === T.length) {
              I = this.C57;
            }
          }
          for (var A = [], P = 0; P < I.length; P++) {
            for (var M = [], O = 0; O < I[P].length; O++) {
              M.push(T[I[P][O] - 1]);
            }
            A.push(M);
          }
          this.listCard_Hi = [];
          for (var N = 0; N < A.length; N++) {
            if (E < v.default.getInstance().getMark(A[N])) {
              E = v.default.getInstance().getMark(A[N]);
              this.listCard_Hi = A[N];
            }
          }
        } else {
          E = v.default.getInstance().getMark(T);
          this.listCard_Hi = T;
        }
        v.default.getInstance().SapXepBaiTheoChi(this.listCard_Hi);
        var B = "";
        if (E > 544) {
          B = "thungphasanh_lose";
        } else {
          if (E > 476) {
            B = "tuquy_lose";
          } else {
            if (E > 408) {
              B = "culu_lose";
            } else {
              if (E > 340) {
                B = "thung_lose";
              } else {
                if (E > 272) {
                  B = "sanh_lose";
                } else {
                  if (E > 204) {
                    B = "samco_lose";
                  } else {
                    if (E > 136) {
                      B = "thu_lose";
                    } else {
                      if (E > 68) {
                        B = "doi_lose";
                      } else {
                        if (0 == E) {
                          B = "mauthau_lose";
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (!(m.default.isNullOrEmpty(B) || this.state != a.GameState.PLAYING)) {
          this._thisPlayerView.showTextFxResultForPlayer(this.pkSpriteAtlas.getSpriteFrame(B), 5, -60);
        }
      }
    };
    e.prototype.setBlind = function(t, e) {
      var i = this.getPlayer(t);
      if (null !== i && void 0 !== i) {
        if (1 === e) {
          i._currentBet = 2 * this.bet;
          i.BigBlindIcon.active = true;
        } else {
          if (2 === e) {
            i._currentBet = this.bet;
            i.smallBlindIcon.active = true;
          }
        }
      }
    };
    e.prototype.setDealer = function(t) {
      var e = this.getPlayer(t);
      if (null !== e && void 0 !== e) {
        e.deadlerIcon.active = true;
      }
    };
    e.prototype.startGame = function(t, e, i) {
      this.node.stopAllActions();
      for (var n = 0; n < this.players.length; ++n) {
        (h = this.players[n]).removeBubbleFx(true);
        h.hideAllCard(false);
      }
      if (this._dangKetThuc) {
        this.handlePendingPlayers();
      }
      this.isClick = false;
      this._dangPhatBai = true;
      this.cardGameTableController.startGameUI();
      this.currentMaxBet = 2 * this.bet;
      this.rutTienBtn.active = false;
      this.locPlayingPlayer(e);
      var o = this.getMinePlayer();
      if (null !== o && void 0 !== o) {
        o.setArrayCard(t);
      }
      for (n = 0; n < this.players.length; ++n) {
        (a = this.players[n]).iconnReady.active = false;
        a.isHost;
      }
      for (n = 0; n < this.playersPlaying.length; ++n) {
        var a = this.playersPlaying[n];
        this.setBetStateForPlayer(a.userID, 0, a._currentBet, a._money - a._currentBet);
      }
      var s = [];
      for (n = this.playersPlaying.length - 1; n >= 0; --n) {
        s.push(this.playersPlaying[n]);
      }
      var c = [],
        l = 0;
      for (n = 0; n < s.length; n++) {
        if ((h = s[n]).smallBlindIcon.active) {
          l = n;
          break;
        }
      }
      for (n = l; n < s.length; n++) {
        var h = s[n];
        c.push(h);
      }
      for (n = 0; n < l; n++) {
        h = s[n];
        c.push(h);
      }
      for (n = 0; n < c.length; n++) {
        for (var u = (h = c[n]).pos, d = u.x + this.cardSizeHiden.x, p = u.y + 5, f = h.isMine(), g = 0; g < h.cards.length; ++g) {
          var m = h.cards[g];
          m.setType(r.default.TypeHIDE);
          m.node.active = true;
          m.node.eulerAngles = new cc.Vec3(0, 0, 0);
          m.node.angle = 0;
          var y = this.cardRotation;
          if (1 == g) {
            y = -y;
          }
          m.node.runAction(cc.sequence(cc.delayTime(.6 + .18 * (n + c.length * g)), cc.callFunc(function() {
            S.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_preflop_card_distribution");
          }), cc.moveTo(.6, new cc.Vec2(d, p)).easing(cc.easeExponentialOut()), cc.callFunc(this.flipCardFx, this, f ? m : null)));
          var _ = 1 + .18 * (n + c.length * g),
            v = .1;
          if (f) {
            _ = .6 + .18 * (n + c.length * g);
            v = .6;
            d += .1 * this.cardSizeBig.x;
            if (g === h.cards.length - 1) {
              m.node.runAction(cc.sequence(cc.delayTime(.8 + .18 * (n + c.length * g)), cc.callFunc(function() {}), cc.callFunc(this
                .finishPhatBai, this, i)));
            }
          }
          m.node.runAction(cc.sequence(cc.delayTime(_), cc.rotateTo(v, y).easing(cc.easeExponentialOut())));
          d += .4 * this.cardSizeBig.x;
        }
      }
      if (!this._thisPlayerView.checkInThisArray(this.playersPlaying)) {
        this.node.runAction(cc.sequence(cc.delayTime(.8 + .18 * (c.length - 1 + 1 * c.length)), cc.callFunc(function() {
          S.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_card_distribution");
        }), cc.callFunc(this.finishPhatBai, this, i)));
      }
    };
    e.prototype.phatBaiFX = function(t, e) {
      e.node.active = true;
      e.setType(r.default.TypeMEDIUM);
      e.setTextureWithCode(e.serverCode, l.default.getInstance().gameID);
    };
    e.prototype.flipCardFx = function(t, e) {
      if (null !== e && void 0 !== e) {
        e.runActionFlip();
      }
    };
    e.prototype.finishPhatBai = function(t, e) {
      this._dangPhatBai = false;
      this.state = a.GameState.PLAYING;
      if (this.playersPlaying.indexOf(this._thisPlayerView) < 0) {
        this.state = a.GameState.VIEWING;
      }
      this.nextTurn(e);
    };
    e.prototype.nextTurn = function(t) {
      this.currentBetMoneyOnSlider = 0;
      var e = this.getPlayer(t);
      if (null !== e && void 0 !== e) {
        for (var i = 0; i < this.players.length; ++i) {
          this.players[i].stopCountDown();
        }
        if (e.startCountDown(20), e.isMine()) {
          if (this.theoTat) {
            return void(this.currentMaxBet === this._thisPlayerView._currentBet ? this.onXemClick() : this.onTheoClick());
          }
          if (this.xemUp) {
            if (this.currentMaxBet !== this._thisPlayerView._currentBet) {
              this.onUpClick();
              return void this.onXemUpClick();
            }
            this.onXemClick();
          }
          this.btntheoTatUpXem.active = false;
          this.btnToTheoUp.active = true;
          this.theoBtn.active = true;
          this.xemBtn.active = false;
          this.isClick = false;
          this.toBtn.node.active = true;
          this.betListView.node.active = false;
          this.setBetsListView(true);
          if (this.isDisTo) {
            this.toBtn.node.active = false;
          } else {
            this.toBtn.node.active = true;
          }
          var n = this.currentMaxBet - this._thisPlayerView._currentBet;
          if (n >= this._thisPlayerView._money && 0 != n) {
            this.toBtn.node.active = false;
            this.betListView.node.active = false;
          }
          if (this.currentMaxBet == this._thisPlayerView._currentBet) {
            this.xemBtn.active = true;
            this.theoBtn.active = false;
          }
          if (!(0 != this._thisPlayerView._realMoney && 0 != this._thisPlayerView._money)) {
            this.toBtn.node.active = false;
          }
        } else {
          this.btnToTheoUp.active = false;
          this.betListView.node.active = false;
          this.isClick = false;
          if (null !== this._thisPlayerView && this.state != a.GameState.VIEWING && this.state != a.GameState.WAITING && 1 != this
            ._thisPlayerView.state && this._thisPlayerView._money > 0) {
            this.btntheoTatUpXem.active = true;
          } else {
            this.btntheoTatUpXem.active = false;
          }
        }
      }
    };
    e.prototype.latBai = function(t, e) {
      for (var i = 0; i < this.players.length; i++) {
        var n = this.players[i];
        if (0 === n.userID.localeCompare(t) && !n._latBai) {
          n._latBai = true;
          var o = n.node.position.x - .25 * this.cardSizeBig.x,
            a = n.node.position.y + 30,
            s = n.isMine();
          for (i = 0; i < e.length; i++) {
            var r = n.cards[i];
            if (!s) {
              r.setTextureWithCode(e[i], l.default.getInstance().gameID);
            }
            r.node.runAction(cc.moveTo(.2, new cc.Vec2(o, a)));
            o += .5 * this.cardSizeBig.x;
          }
          return;
        }
      }
    };
    e.prototype.setPots = function(t) {
      for (var e = 0; e < t.length; e++) {
        var i = t[e],
          n = i.id - 1,
          o = i.m;
        if (!(n >= this.listPkPots.length)) {
          var a = this.listPkPots[n];
          a.setNumber(o);
          a.node.active = true;
          var s = this.players.length - e,
            r = o / this.bet;
          if ((r = Math.ceil(r)) < s) {
            s = r;
          }
          for (var c = 0; c < s; c++) {
            var l = m.default.getRandomInt(this.listSmallChipPrefabs.length),
              h = cc.instantiate(this.listSmallChipPrefabs[l]);
            h.parent = this.node;
            h.scale = .9;
            h.active = true;
            a.coins.push(h);
          }
          for (c = 0; c < a.coins.length; c++) {
            var u = a.coins[c];
            u.zIndex = c + 1;
            u.position = new cc.Vec2(a.node.position.x + a.chipIconPos.position.x, a.node.position.y + a.chipIconPos.position.y + 4 * c);
          }
        }
      }
    };
    e.prototype.updatePots = function(t, e) {
      var i = this;
      if (void 0 === e) {
        e = false;
      }
      var n = 0,
        o = 0,
        a = [];
      this.players.forEach(function(t) {
        o += t.coins.length;
        t.coins.forEach(function(t) {
          a.push(t);
        });
        t.coins = [];
      });
      for (var s = 0; s < t.length; s++) {
        n += u = (l = t[s]).m;
      }
      var r = [],
        c = 0;
      for (s = 0; s < t.length; s++) {
        var l,
          h = (l = t[s]).id - 1,
          u = l.m;
        if (!(h >= this.listPkPots.length)) {
          var d = this.listPkPots[h];
          d.node.active = true;
          d.node.runAction(cc.sequence(cc.fadeIn(1), cc.callFunc(function() {})));
          var p = (u -= d.money) / n * o,
            f = Math.ceil(p);
          if (0 == f && 0 != u) {
            f = 1;
          }
          r.push(f);
          c += f;
        }
      }
      if (c > o) {
        for (s = 0; s < c - o; s++) {
          if (s <= r.length && r[s] > 1) {
            r[s]--;
          }
        }
      }
      var g = 0,
        m = function(e) {
          var i = t[e],
            n = i.id - 1,
            s = i.m;
          if (n >= y.listPkPots.length) {
            return "continue";
          }
          var c = y.listPkPots[n],
            l = c.coins.length;
          if (c.money !== s) {
            c.money = s;
            var h = r[e] + g;
            if (e === t.length - 1) {
              h = o;
              r[e] = o - g;
            }
            for (var u = g; u < h; ++u) {
              var d = a[u];
              if (void 0 === d || null === d) {
                var p = "%0A<b>---------------</b>";
                p += "%0A<b>totalCoins: </b>" + o;
                p += "%0A<b>numberOfCoinsPerPot[" + e + "]: </b>" + r[e];
                p += "%0A<b>numCoin: </b>" + h;
                p += "%0A<b>startPos: </b>" + u;
                p += "%0A<b>listCoinAll.length: </b>" + a.length;
                p += "%0A<b>zIndex: </b>" + (u - g + l + 1);
                p += "%0A<b>pkPot.coins.length: </b>" + c.coins.length;
                b.default.getInstance().sendGameToError(p);
              }
              c.coins.push(d);
              d.zIndex = u - g + l + 1;
              var f = cc.sequence(cc.delayTime(1.1), cc.callFunc(function() {
                S.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_chip_moving");
              }), cc.moveTo(1, new cc.Vec2(c.node.position.x + c.chipIconPos.position.x, c.node.position.y + c.chipIconPos.position
                .y)).easing(cc.easeExponentialOut()), cc.callFunc(function() {
                S.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_chip_win");
              }), cc.moveTo(.3, new cc.Vec2(c.node.position.x + c.chipIconPos.position.x, c.node.position.y + c.chipIconPos.position
                .y + 4 * (u - g + l))));
              d.runAction(f);
              var m = cc.sequence(cc.delayTime(1.1), cc.fadeOut(1), cc.fadeTo(.3, 255));
              d.runAction(m);
            }
            if ((g += r[e]) <= 0) {
              g = 0;
            }
            c.node.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(function() {
              c.setNumber(s);
            })));
          }
        },
        y = this;
      for (s = 0; s < t.length; s++) {
        m(s);
      }
      if (this.node.runAction(cc.sequence(cc.delayTime(1.1), cc.callFunc(function() {
          i.players.forEach(function(t) {
            if (null !== t.currentBetLb && void 0 !== t.currentBetLb) {
              t.currentBetLb.node.runAction(cc.sequence(cc.fadeOut(.2), cc.callFunc(function() {
                t.currentBetLb.money = 0;
                t.currentBetLb.node.active = false;
              })));
            }
          });
        }))), e) {
        var _ = function(e) {
            var i = t[e],
              n = i.id - 1;
            i.m;
            if (n >= v.listPkPots.length) {
              return "continue";
            }
            for (var o = v.listPkPots[n], a = i.wns, s = 0; s < a.length; ++s) {
              var r = a[s],
                c = v.getPlayer(r);
              if (null !== c && void 0 !== c) {
                var l = o.coins.length / a.length,
                  h = s * (l = Math.round(l)),
                  u = (s + 1) * l;
                if (s === a.length - 1) {
                  u = o.coins.length;
                }
                if (u > o.coins.length) {
                  u = o.coins.length;
                }
                for (var d = h; d < u; d++) {
                  var p = o.coins[d],
                    f = cc.sequence(cc.delayTime(3 + .07 * (u - 1 - d)), cc.callFunc(function() {
                      S.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_chip_win");
                    }), cc.moveTo(2.5, c.node.position).easing(cc.easeExponentialOut()), cc.callFunc(v.removeNodeFromParent, v, p));
                  if (null !== p && void 0 !== p) {
                    p.runAction(f);
                    var g = cc.sequence(cc.delayTime(3 + .07 * (u - 1 - d)), cc.fadeOut(1));
                    p.runAction(g);
                  }
                }
              }
            }
            var m = cc.sequence(cc.delayTime(3.5 + .07 * o.coins.length), cc.fadeOut(.2), cc.callFunc(function() {
              o.node.active = false;
              o.node.opacity = 255;
              o.setNumber(0);
            }));
            o.node.runAction(m);
            o.coins = [];
          },
          v = this;
        for (s = 0; s < t.length; s++) {
          _(s);
        }
      }
    };
    e.prototype.finishThisGame = function(t) {
      this.cardGameTableController.stopProgressStartGame();
      this.currentBetMoneyOnSlider = 0;
      this._dangKetThuc = true;
      this.isClick = false;
      this.betListView.node.active = false;
      this.btntheoTatUpXem.active = false;
      this.btnToTheoUp.active = false;
      this._autoWithDrawMoney = u.default.getInstance().autoBuyIn;
      if (this.theoTat) {
        this.onTheoTatClick();
      }
      if (this.xemUp) {
        this.onXemUpClick();
      }
      for (var e = 0; e < t.length; e++) {
        var i = t[e],
          n = i.uid,
          o = this.getPlayer(n);
        if (null !== o && void 0 !== o) {
          o.isReady = false;
          o.stopCountDown();
          var a = o.getBubbleFx();
          if (null !== a) {
            a.runAction(cc.sequence(cc.delayTime(this.timeToFinish), cc.callFunc(function() {
              o.removeBubbleFx(true);
            })));
          }
          o._currentBet = 0;
          o.smallBlindIcon.active = false;
          o.BigBlindIcon.active = false;
          o.deadlerIcon.active = false;
          var s = i.mX;
          s;
          if (o.isMine()) {
            if (i.iw) {
              S.default.getInstance().playEffect("Sounds/sfx_add_money");
              S.default.getInstance().playEffect("Sounds/sfx_win");
            } else {
              S.default.getInstance().playEffect("Sounds/sfx_lose");
            }
          }
          var r = i.m;
          o._money = r;
          o._realMoney = i.rM;
          o.setMoney(o._money);
          var c = this.timeToFinish;
          if (o.showMoneyFxForPlayer(s, c), s > 0 && o.runWinAction(c), null !== i.cs && void 0 !== i.cs) {
            var l = i.cs;
            this.latBai(n, l);
          }
          if (s > 0) {
            if (null !== i.ph && void 0 !== i.ph) {
              for (var h = i.ph, d = [], p = 0; p < h.length; p++) {
                for (var f = 0; f < this._communityCards.length; f++) {
                  if ((g = this._communityCards[f]).serverCode === h[p]) {
                    d.push(g);
                    break;
                  }
                }
                for (f = 0; f < o.cards.length; f++) {
                  if ((g = o.cards[f]).serverCode === h[p]) {
                    d.push(g);
                    break;
                  }
                }
              }
              for (f = 0; f < this._communityCards.length; f++) {
                if ((g = this._communityCards[f]).node.getNumberOfRunningActions() > 0) {
                  true;
                  break;
                }
              }
              for (f = 0; f < this._communityCards.length; f++) {
                if ((g = this._communityCards[f]).isInArray(d)) {
                  g.cardSprite.node.color = cc.Color.WHITE;
                  g.sparkles();
                } else {
                  g.cardSprite.node.color = cc.Color.GRAY;
                }
              }
              for (f = 0; f < o.cards.length; f++) {
                if ((g = o.cards[f]).isInArray(d)) {
                  g.sparkles();
                } else {
                  g.cardSprite.node.color = cc.Color.GRAY;
                }
              }
            }
          } else if (null !== i.cs && void 0 !== i.cs) {
            for (f = 0; f < o.cards.length; f++) {
              var g;
              (g = o.cards[f]).cardSprite.node.color = cc.Color.GRAY;
            }
          }
          var m,
            y,
            _ = "";
          if (s > 0 || 2, null !== i.rh && void 0 !== i.rh) {
            var v = i.rh;
            if (0 == v) {
              _ = "M\u1eadu th\u1ea7u";
              m = "mauthau_lose";
              y = "mauthau";
            } else {
              if (1 == v) {
                _ = "\u0110\xf4i";
                m = "doi_lose";
                y = "doi";
              } else {
                if (2 == v) {
                  _ = "Th\xfa";
                  m = "thu_lose";
                  y = "thu";
                } else {
                  if (3 == v) {
                    _ = "X\xe1m";
                    m = "samco_lose";
                    y = "samco";
                  } else {
                    if (4 == v) {
                      _ = "S\u1ea3nh";
                      m = "sanh_lose";
                      y = "sanh";
                    } else {
                      if (5 == v) {
                        _ = "Th\xf9ng";
                        m = "thung_lose";
                        y = "thung";
                      } else {
                        if (6 == v) {
                          _ = "C\xf9 l\u0169";
                          m = "culu_lose";
                          y = "culu";
                        } else {
                          if (7 == v) {
                            _ = "T\u1ee9 Qu\xfd";
                            m = "tuquy_lose";
                            y = "tuquy";
                          } else {
                            if (8 == v) {
                              _ = "Th\xf9ng Ph\xe1 S\u1ea3nh";
                              m = "thungphasanh_lose";
                              y = "thungphasanh";
                            } else {
                              if (9 == v) {
                                _ = "TPS Th\u01b0\u1ee3ng";
                                m = "thungphasanh_lose";
                                y = "thungphasanh";
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          if (_.length > 0) {
            o.showTextFxResultForPlayer(s > 0 ? this.pkSpriteAtlas.getSpriteFrame(y) : this.pkSpriteAtlas.getSpriteFrame(m), c, -60);
          }
          o.removeBubbleFx(true);
          o.state = 0;
        }
      }
      this.updateReadyStatus();
      var b = cc.sequence(cc.delayTime(this.timeToFinish), cc.callFunc(this.handlePendingPlayers, this));
      this.node.runAction(b);
      this.onEndGame();
    };
    e.prototype.handlePendingPlayers = function() {
      if (t.prototype.handlePendingPlayers.call(this), this._forcedQuit) {
        this.onLogOut();
      } else if (this._forcedToLeaveRoom) {
        this.handleLeaveRoomResponse();
      } else {
        if (this._subscribedToGetOut) {
          this.state = a.GameState.WAITING;
          return void this.sendLeaveRoom();
        }
        if (l.default.getInstance().checkBaoTriGame()) {
          this.state = a.GameState.WAITING;
          return void this.sendLeaveRoom();
        }
        if (this._khongThaoTac && this._daNgoi) {
          if (this._soVanKhongThaoTac++, 3 == this._soVanKhongThaoTac) {
            return void this.sendLeaveRoom();
          }
        } else {
          this._soVanKhongThaoTac = 0;
        }
        if (this._thisPlayerView._realMoney < this.bet) {
          _.default.getInstance().showPopupMessageUtil("B\u1ea1n kh\xf4ng \u0111\u1ee7 ti\u1ec1n tham gia b\xe0n ch\u01a1i!");
          return void this.sendLeaveRoom();
        }
        this._khongThaoTac = true;
        this.updateMoneys();
        this._dangKetThuc = false;
        if (this._daNgoi) {
          this.rutTienBtn.active = true;
        }
        for (var e = 0; e < this._communityCards.length; e++) {
          this._communityCards[e].node.removeFromParent(true);
        }
        this._communityCards = [];
        this.removePendingPlayers();
        this.state = a.GameState.WAITING;
        this.updateReadyStatus();
        for (var i = 0; i < this.players.length; i++) {
          var n = this.players[i];
          n.stopViewAction();
          n._latBai = false;
          n.cards.forEach(function(t) {
            t.node.active = false;
            t.cardSprite.node.color = cc.Color.WHITE;
            t.stopSparkling();
          });
          for (var o = 0; o < n.coins.length; o++) {
            n.coins[o].removeFromParent(true);
          }
        }
        if (!(this.players.indexOf(this._thisPlayerView) <= -1 && this.players.length < this.maxUser) && (this._thisPlayerView
            .checkInThisArray(this.players) && this._thisPlayerView._money < 2 * this.bet && this.withdrawMoney(), this.isHost)) {
          for (var s = 0; s < this.players.length; s++) {
            var r = this.players[s];
            if (false === r.isMine()) {
              r.isReady;
            }
          }
        }
      }
    };
    e.prototype.leave = function() {};
    e.prototype.getCombination = function(t, e, i, n) {};
    e.prototype.combinationUtil = function(t, e, i, n, o, a, s) {};
    e.prototype.sortVectorPlayers = function() {
      this.players.sort(function(t, e) {
        return t.sit > e.sit ? -1 : t.sit < e.sit ? 1 : 0;
      });
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
    e.prototype.buyIn = function() {
      this._autoWithDrawMoney = u.default.getInstance().autoBuyIn;
      this._moneyToAutoWithdraw = u.default.getInstance().moneyBuyIn;
      h.default.getInstance().sendWithdrawMoneyCommom(this._moneyToAutoWithdraw);
    };
    e.prototype.OnBetListViewValueChange = function(t) {
      this.currentBetMoneyOnSlider = t;
    };
    e.prototype.addPlayer = function(e, i, n, o, a, s, r, c, l, h, u, d, p) {
      var f = t.prototype.addPlayer.call(this, e, i, n, o, a, s, r, c, l, h, u, d, p);
      f.initPokerCard(this.prefabsGameCard);
      return f;
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
    e.prototype.withdrawMoney = function() {
      var t = this;
      if (this._thisPlayerView._realMoney < this.minMoneyBuyIn) {
        _.default.getInstance().showPopupMessageUtil("B\u1ea1n kh\xf4ng \u0111\u1ee7 ti\u1ec1n \u0111\u1ec3 buy-in");
      } else {
        if (this._autoWithDrawMoney) {
          this.buyIn();
        } else {
          _.default.getInstance().showPopupBuyIn(l.default.getInstance().maxBuyIn, l.default.getInstance().minBuyIn, l.default
            .getInstance().bet);
          _.default.getInstance().popupBuyIn.onHandleBuyIn = function() {
            t.buyIn();
            _.default.getInstance().popupBuyIn.hide();
          };
        }
      }
    };
    e.prototype.getListChatDefaultText = function() {
      return ["Ngh\u0129 g\xec l\xe2u th\u1ebf cha ??", "Ch\u1ed1ng tao ch\u1ec9 c\xf3 ch\u1ebfttt :)))))",
        "Thua ho\xe0i, ch\u1eafc tao ch\u1ebfttt", "Ch\u01a1i vui kh\xf4ng qu\u1ea1u nha!",
        "T\u1ea5t tay m\u1ea5t ngay t\u1ea1 th\xf3c", "V\xe1n n\xe0y ra \u0111\u1ea3o r\u1ed3i",
        "Tu\u1ed5i g\xec s\xe1nh v\u1edbi tao v\xe1n n\xe0y", "Tao nh\xecn m\xe0 tao t\u1ee9cccc",
        "T\u1edbi lu\xf4n b\xe1c t\xe0i \u01a1iiiiiiiii", "\xdap b\xe0i \u0111i m\u1ea5y ch\xfa", "C\xe2u \u0111\xfang ao c\xe1. :))",
        "M\xe9o tin \u0111\u01b0\u1ee3c", "Th\xedch th\xec nh\xedch", "B\xe0i x\u1ea5u qu\xe1",
        "B\xe0i n\xe0y t\u1ed1 th\xec c\xf3 b\xe1n nh\xe0!", "\u0110\u1ecf th\xf4i \u0111en qu\xean \u0111i",
        "C\u01b0ng th\xedch a kh\xf4 m\xe1u v\u1edbi c\u01b0ng", "Nh\u1eb9 tay th\xf4i ae!"
      ];
    };
    e.prototype.showHideInviteBtn = function() {
      var t = this;
      this.inviteBtns.forEach(function(e) {
        e.active = 9 === t.maxUser;
      });
      if (5 === this.maxUser) {
        this.POS5.forEach(function(e) {
          t.inviteBtns[e].active = true;
        });
      }
    };
    e.prototype.setGameConfig = function(e, i, n, o, a, s) {
      t.prototype.setGameConfig.call(this, e, i, n, o, a, s);
      this.showHideInviteBtn();
    };
    e.prototype.getSpriteFrameName = function() {
      return this.pkSpriteAtlas.getSpriteFrame("Sgame_Poker");
    };
    e.prototype.get5CardData7 = function() {
      for (var t = [], e = 0; e < 7; e++) {
        t.push(true);
      }
      this.C57 = [];
      this.chinhHop57(7, 5, [1, 2, 3, 4, 5], 0, t);
      for (e = 0; e < this.C57.length - 1; e++) {
        for (var i = e + 1; i < this.C57.length; i++) {
          if (this.compare(this.C57[i], this.C57[e])) {
            this.C57.splice(i, 1);
            i--;
          }
        }
      }
    };
    e.prototype.chinhHop57 = function(t, e, i, n, o) {
      for (var a = 0; a < t; a++) {
        if (o[a]) {
          if (i[n] = a + 1, o[a] = false, n === e - 1) {
            var s = 0;
            for (this.tempN = [], s = 0; s < e; s++) {
              this.tempN.push(i[s]);
            }
            this.tempN.sort(function(t, e) {
              return t - e;
            });
            this.C57.push(this.tempN);
          } else {
            this.chinhHop57(t, e, i, n + 1, o);
          }
          o[a] = true;
        }
      }
    };
    e.prototype.get5CardData6 = function() {
      for (var t = [], e = 0; e < 6; e++) {
        t.push(true);
      }
      this.C56 = [];
      this.chinhHop56(6, 5, [1, 2, 3, 4, 5], 0, t);
      for (e = 0; e < this.C56.length - 1; e++) {
        for (var i = e + 1; i < this.C56.length; i++) {
          if (this.compare(this.C56[i], this.C56[e])) {
            this.C56.splice(i, 1);
            i--;
          }
        }
      }
    };
    e.prototype.chinhHop56 = function(t, e, i, n, o) {
      for (var a = 0; a < t; a++) {
        if (o[a]) {
          if (i[n] = a + 1, o[a] = false, n === e - 1) {
            var s = 0;
            for (this.tempN1 = [], s = 0; s < e; s++) {
              this.tempN1.push(i[s]);
            }
            this.tempN1.sort(function(t, e) {
              return t - e;
            });
            this.C56.push(this.tempN1);
          } else {
            this.chinhHop56(t, e, i, n + 1, o);
          }
          o[a] = true;
        }
      }
    };
    e.prototype.compare = function(t, e) {
      for (var i = true, n = 0; n < t.length; n++) {
        if (t[n] !== e[n]) {
          i = false;
          break;
        }
      }
      return i;
    };
    e.prototype.noContain12 = function(t) {
      for (var e = true, i = 0; i < t.length; i++) {
        if (t.indexOf(1) > -1 && t.indexOf(2) > -1) {
          e = false;
          break;
        }
      }
      return e;
    };
    e.prototype.onDisable = function() {
      this.btntheoTatUpXem.active = false;
      this.btnToTheoUp.active = false;
    };
    o([A(cc.Prefab)], e.prototype, "betLabelPrefabs", void 0);
    o([A([cc.Node])], e.prototype, "listBetLabelPos", void 0);
    o([A(cc.Node)], e.prototype, "iConTheoTat", void 0);
    o([A(cc.Node)], e.prototype, "iConXemUp", void 0);
    o([A(cc.Node)], e.prototype, "btnToTheoUp", void 0);
    o([A(cc.Node)], e.prototype, "btntheoTatUpXem", void 0);
    o([A(cc.Node)], e.prototype, "theoBtn", void 0);
    o([A(cc.Node)], e.prototype, "xemBtn", void 0);
    o([A(cc.Button)], e.prototype, "toBtn", void 0);
    o([A(cc.Prefab)], e.prototype, "prefabBetListViewItem", void 0);
    o([A([cc.Node])], e.prototype, "listSmallChipPrefabs", void 0);
    o([A([f.default])], e.prototype, "listPkPots", void 0);
    o([A(cc.SpriteAtlas)], e.prototype, "pkSpriteAtlas", void 0);
    return e = o([I], e);
  }(c.default);
i.default = P;
void 0;
