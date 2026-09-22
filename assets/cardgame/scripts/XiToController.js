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
  h = require("./GameConfigManager"),
  u = require("./XiToMessage"),
  d = require("./BetLabel"),
  p = require("./PkPot"),
  f = require("./BetListView"),
  g = require("./StringUtil"),
  m = require("./GameZOrder"),
  y = require("./XiToRequestHandler"),
  S = require("./RevealCardPopupController"),
  _ = require("./MusicPlayer"),
  v = require("./CommonPrefabsManager"),
  b = require("./MauBinhCheckCard"),
  C = require("./ErrorLogHandler"),
  T = require("./VersionController"),
  E = require("./GameDefine"),
  I = cc._decorator,
  A = I.ccclass,
  P = I.property,
  M = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.mainGameXiToViewModel = null;
      e.cardRotation = 8;
      e.betLabelPrefabs = null;
      e.listBetLabelPos = [];
      e.listBetLabel = [];
      e.iConTheoTat = null;
      e.iConXemUp = null;
      e._soVongDaTo = 0;
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
      e.revealCardPopup = null;
      e.revealCardPopupController = null;
      e.isDisTo = false;
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
      for (var i = 0; i < this.listPkPots.length; i++) {
        for (var n = this.listPkPots[i], o = 0; o < n.coins.length; ++o) {
          if (null !== n.coins[o] && void 0 !== n.coins[o]) {
            n.coins[o].stopAllActions();
            n.coins[o].removeFromParent(true);
          }
        }
        n.coins = [];
        n.node.active = false;
      }
    };
    e.prototype.onLoad = function() {
      var e = this;
      t.prototype.onLoad.call(this);
      var i = cc.instantiate(this.revealCardPopup);
      i.parent = this.node;
      i.zIndex = m.default.CHAT_BUBLES + 3;
      this.revealCardPopupController = i.getComponent(S.default);
      i.active = false;
      this.POS9 = [];
      this.POS3 = [];
      this.POS5 = [];
      this.POS7 = [];
      this.listBtnInvitePos.forEach(function(t) {
        var i = cc.instantiate(e.btnInvitePrefabs);
        i.parent = e.node;
        i.position = t.position;
        e.inviteBtns.push(i);
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
      this.POS9.push(this.POS2[1]);
      this.POS9.push(this.POS3[2]);
      this.POS9.push(this.POS7[5]);
      this.POS9.push(this.POS5[4]);
      this.POS9.push(1);
      this.listBetLabelPos.forEach(function(t) {
        var i = cc.instantiate(e.betLabelPrefabs);
        i.parent = e.node;
        i.active = false;
        i.position = t.position;
        var n = i.getComponent(d.default);
        e.listBetLabel.push(n);
      });
      var n = cc.instantiate(this.prefabBetListViewItem);
      n.parent = this.node;
      n.active = false;
      n.zIndex = m.default.CHAT_BUBLES + 2;
      this.betListView = n.getComponent(f.default);
      this.betListView.onValueChange = this.OnBetListViewValueChange.bind(this);
      var o = cc.instantiate(this.prefabsGameCard),
        a = o.getComponent(s.default);
      a.init(r.default.TypeSMALL);
      this.cardSizeBig = new cc.Vec2(o.getContentSize().width * o.scale, o.getContentSize().height * o.scale);
      a.init(r.default.TypeHIDE);
      this.cardSizeHiden = new cc.Vec2(o.getContentSize().width * o.scale - 6, o.getContentSize().height * o.scale);
      o.destroy();
      this.btnToTheoUp.zIndex = m.default.MIDDLE;
      this.btntheoTatUpXem.zIndex = m.default.MIDDLE;
    };
    e.prototype.handleErrorMessage = function(t) {
      if (void 0 != t && null != t && 0 != t.length) {
        v.default.getInstance().showPopupMessageUtil(t);
      }
    };
    e.prototype.onReceiveMessage = function(e, i, n) {
      switch (t.prototype.onReceiveMessage.call(this, e, i, n), e) {
        case a.Global_Message.ERROR_MESSAGE:
          this.handleErrorMessage(n.mgs);
          break;
        case u.default.DEAL_CARDS:
        case u.default.SEND_LAT_BAI_TAY:
        case u.default.LAT_BAI_TAY:
        case u.default.CHANGE_TURN:
        case u.default.FINISH_GAME:
        case u.default.START_BETTING:
        case u.default.RAISE:
        case u.default.CALL:
        case u.default.FOLD:
        case u.default.CHECK:
        case u.default.WITHDRA_MONEY:
        case u.default.STAND_UP:
        case u.default.START:
          this.onXiToEventReciveHandle(i, n);
      }
    };
    e.prototype.walkUp = function(t) {
      this.walkUpBase(t);
      this.mainGameXiToViewModel = t;
      this.node.active = true;
    };
    e.prototype.getTag = function() {
      return "xito";
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
      for (var p = e.ps, f = 0; f < p.length; ++f) {
        var g = p[f],
          m = g.uid,
          y = g.C;
        if (0 === m.localeCompare(l.default.getInstance().userID)) {
          this.isHost = y;
        }
        var S = g.m,
          _ = g.pS,
          v = g.sit,
          b = g.dn,
          C = g.r,
          T = g.pi,
          E = g.pid;
        if (this.state !== a.GameState.VIEWING) {
          T = true;
        }
        var I = g.As,
          A = g.a,
          P = 0;
        if (null !== g.id && void 0 !== g.id) {
          P = g.id;
        }
        var M = g.rM;
        I.rM = M;
        var O = this.addPlayer(b, m, y, S, _, 3, v, C, E, T, I, A, P);
        if (this.state === a.GameState.VIEWING) {
          var N = g.cb;
          O._currentBet = N;
        }
      }
      if (this.updateViewPostions(true), this.state === a.GameState.VIEWING) {
        var B = e.mb;
        if (this.currentMaxBet = B, this.setCurrentBetStateForPlayers(e.re), null !== e.pots && void 0 !== e.pots) {
          var D = e.pots;
          this.setPots(D);
        }
        for (f = 0; f < p.length; f++) {
          var R = p[f],
            L = R.cs,
            w = (m = R.uid, -1);
          if (!(null === R.fc && void 0 === R.dc)) {
            w = R.fc;
          }
          this.setCardsForPlayer(m, L, w);
        }
        if (!(null === e.re || void 0 === e.re || e.re)) {
          this.showViewTableMessage();
        }
      } else {
        this.startBetting(o);
      }
      this.updateReadyStatus();
    };
    e.prototype.onXiToEventReciveHandle = function(t, e) {
      if (null !== e && void 0 !== e) {
        switch (e.cmd) {
          case u.default.START_BETTING:
            var i = e.T;
            i /= 1e3;
            this.startBetting(i);
            this.isHost && this.checkShowButtonStartGameWhenUserReady();
            T.default.getInstance().CheckForceUpdateByGameScene(E.GameConfigs.SceneName.XiTo);
            break;
          case u.default.DEAL_CARDS:
            var n = e.cs,
              o = e.lpi;
            this.startGame(n, o);
            break;
          case u.default.CHANGE_TURN:
            var a = e.mb;
            this.currentMaxBet = a;
            var s = e.fP,
              r = e.tP,
              c = s.pS,
              l = s.cb,
              h = s.m,
              d = s.uid,
              p = r.uid;
            if (this.setBetStateForPlayer(d, c, l, h), null !== e.ps && void 0 !== e.ps) {
              var f = e.ps;
              this.newTurnRound(p, f);
            } else {
              this.node.runAction(cc.callFunc(this.nextTurn, this, p));
            }
            if (null !== e.pots && void 0 !== e.pots) {
              var g = e.pots;
              this.updatePots(g);
            }
            break;
          case u.default.LAT_BAI_TAY:
            for (var m = e.ps, y = 0; y < m.length; y++) {
              var S = m[y],
                _ = S.uid,
                v = S.cs;
              this.revealCard(_, v);
            }
            if (null !== e.tP && void 0 !== e.tP) {
              var b = e.tP;
              _ = b.uid;
              v = b.cs;
              this.revealCard(_, v);
              this.node.runAction(cc.callFunc(this.nextTurn, this, _));
            }
            break;
          case u.default.FINISH_GAME:
            var C = [],
              I = (d = (s = e.fP).uid, s.pS),
              A = s.cb,
              P = s.m;
            this.setBetStateForPlayer(d, I, A, P);
            for (var M = e.ps, O = 0; O < M.length; O++) {
              var N = M[O];
              C.push(N);
            }
            if (C.push(s), null !== e.pots && void 0 !== e.pots) {
              var B = e.pots;
              this.updatePots(B, true);
            }
            this.finishThisGame(C);
        }
      }
    };
    e.prototype.onTheoTatClick = function() {
      _.default.getInstance().playbtnClick();
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
      _.default.getInstance().playbtnClick();
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
          return void _.default.getInstance().playbtnClick();
        }
        if (0 !== this.currentBetMoneyOnSlider) {
          if (this.isClick) {
            return;
          }
          this.isClick = true;
          y.default.getInstance().sendRaise(this.currentBetMoneyOnSlider);
          this.betListView.node.active = false;
          this._khongThaoTac = false;
        }
      }
    };
    e.prototype.onTheoClick = function() {
      if (!this.isClick) {
        this.isClick = true;
        _.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_call");
        y.default.getInstance().sendCall();
        this._khongThaoTac = false;
      }
    };
    e.prototype.onUpClick = function() {
      if (!this.isClick) {
        this.isClick = true;
        y.default.getInstance().sendFold();
        this._khongThaoTac = false;
      }
    };
    e.prototype.onRutTienClick = function() {
      _.default.getInstance().playbtnClick();
      this._autoWithDrawMoney = false;
      this.withdrawMoney();
      this._khongThaoTac = false;
    };
    e.prototype.onXemClick = function() {
      if (!this.isClick) {
        this.isClick = true;
        y.default.getInstance().sendCheck();
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
          var h = g.default.getRandomInt(2) + 1;
          if (i === this.bet) {
            h = 1;
          }
          for (var u = 0; u < h; u++) {
            var d = g.default.getRandomInt(this.listSmallChipPrefabs.length),
              p = cc.instantiate(this.listSmallChipPrefabs[d]);
            if (p.parent = this.node, p.scale = .9, p.position = r.node.position, p.active = true, o) {
              _.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_raise");
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
              _.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_raise");
            })));
          }
        }
        r._money = n;
        r._currentBet = i;
        var m,
          y = "";
        switch (e) {
          case 1:
            y = "\xdap";
            m = 1;
            for (var S = 0; S < r.cards.length; ++S) {
              r.cards[S].setBlackFace(true);
            }
            break;
          case 2:
            y = "Theo";
            m = 2;
            break;
          case 3:
            y = "Xem";
            m = 2;
            break;
          case 4:
            y = "T\u1ed1";
            m = 3;
            break;
          case 5:
            y = "T\u1ea5t Tay";
            m = 3;
        }
        if (r._money <= 0) {
          r._money = 0;
        }
        r.setMoney(r._money);
        r.state = e;
        if (e > 0 && e < 6) {
          if (a || s) {
            this.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
              r.showBubbleFx(y, m, o, false);
            })));
          } else {
            r.showBubbleFx(y, m, o, false);
          }
          if (o) {
            if (1 === e) {
              _.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_fold");
              r.showUpBaiFxForPlayer(3);
            } else {
              if (3 === e) {
                _.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_check");
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
    e.prototype.newTurnRound = function(t, e) {
      if (this.xemUp) {
        this.onXemUpClick();
      }
      if (this.theoTat) {
        this.onTheoTatClick();
      }
      this._soVongDaTo++;
      this.currentMaxBet = 0;
      for (var i = 0; i < this.players.length; i++) {
        if (1 !== (n = this.players[i]).state && 5 !== n.state) {
          n.removeBubbleFx();
        }
      }
      this.btnToTheoUp.active = false;
      this.betListView.node.active = false;
      this.btntheoTatUpXem.active = false;
      this.isClick = false;
      for (i = 0; i < e.length; i++) {
        var n,
          o = e[i],
          a = o.uid;
        if (null !== (n = this.getPlayer(a)) && void 0 !== n) {
          var s = o.cb,
            c = o.m;
          n._currentBet = s;
          n.setMoney(c);
          n._money = c;
          var h = o.cs,
            u = n.isMine(),
            d = n.pos,
            p = d.x + this.cardSizeHiden.x,
            f = d.y - 5;
          if (n.pos.x < 0 || u) {
            p = d.x + 1.5 * this.cardSizeHiden.x;
            if (u) {
              p = d.x + 1.8 * this.cardSizeHiden.x;
              f = d.y;
            }
          } else {
            p = d.x - 1.5 * this.cardSizeHiden.x;
          }
          for (var y = 0, S = 1; S < n.cards.length; S++) {
            if (false === (C = n.cards[S]).node.active) {
              y = S;
              if (n.pos.x < 0 || u) {
                p += S * this.cardSizeBig.x * .4;
              } else {
                p -= S * this.cardSizeBig.x * .4;
              }
              break;
            }
          }
          for (S = y - 1; S < h.length; S++) {
            (C = n.cards[y]).setType(r.default.TypeSMALL);
            if (n.pos.x < 0 || u) {
              C.node.zIndex = m.default.MIDDLE_TOP + 2 * (S + 2);
            } else {
              C.node.zIndex = m.default.MIDDLE_TOP - 2 * (S + 2);
            }
            C.node.position = new cc.Vec2(0, 0);
            C.node.active = true;
            C.setTextureWithCode(h[S], l.default.getInstance().gameID);
            if (false === n.isMine()) {
              if (S === h.length - 1) {
                C.node.runAction(cc.sequence(cc.delayTime(0 + .08 * S), cc.moveTo(.6, new cc.Vec2(p, f)).easing(cc.easeExponentialOut()),
                  cc.callFunc(this.nextTurn, this, t)));
              } else {
                C.node.runAction(cc.sequence(cc.delayTime(0 + .08 * S), cc.moveTo(.6, new cc.Vec2(p, f)).easing(cc
              .easeExponentialOut())));
              }
            } else {
              if (S === h.length - 1) {
                C.node.runAction(cc.sequence(cc.delayTime(0 + .08 * S), cc.callFunc(this.phatBaiFX, this, u ? C : null), cc.moveTo(.6,
                  new cc.Vec2(p, f)).easing(cc.easeExponentialOut()), cc.callFunc(this.nextTurn, this, t)));
              } else {
                C.node.runAction(cc.sequence(cc.delayTime(0 + .08 * S), cc.callFunc(this.phatBaiFX, this, u ? C : null), cc.moveTo(.6,
                  new cc.Vec2(p, f)).easing(cc.easeExponentialOut())));
              }
            }
            y++;
          }
          if (n.isMine() && 1 !== n.state) {
            for (var _ = [], v = 0; v < n.cards.length; v++) {
              var C;
              if ((C = n.cards[v]).node.active) {
                _.push(C);
              }
            }
            var T = b.default.getInstance().getMark(_),
              E = "";
            if (T > 544) {
              E = "thungphasanh_lose";
            } else {
              if (T > 476) {
                E = "tuquy_lose";
              } else {
                if (T > 408) {
                  E = "culu_lose";
                } else {
                  if (T > 340) {
                    E = "thung_lose";
                  } else {
                    if (T > 272) {
                      E = "sanh_lose";
                    } else {
                      if (T > 204) {
                        E = "samco_lose";
                      } else {
                        if (T > 136) {
                          E = "thu_lose";
                        } else {
                          if (T > 68) {
                            E = "doi_lose";
                          } else {
                            if (0 == T) {
                              E = "mauthau_lose";
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (!g.default.isNullOrEmpty(E)) {
              n.showTextFxResultForPlayer(this.pkSpriteAtlas.getSpriteFrame(E), 5);
            }
          }
        }
      }
      this._thisPlayerView.state;
    };
    e.prototype.startGame = function(t, e) {
      this.node.stopAllActions();
      for (var i = 0; i < this.players.length; ++i) {
        (h = this.players[i]).removeBubbleFx(true);
        h.hideXiToCard(false);
      }
      if (this._dangKetThuc) {
        this.handlePendingPlayers();
      }
      this._dangPhatBai = true;
      this._soVongDaTo++;
      this.cardGameTableController.startGameUI();
      this.currentMaxBet = this.bet;
      this.rutTienBtn.active = false;
      this.isClick = false;
      var n = [];
      this.playersPlaying = [];
      for (i = 0; i < e.length; i++) {
        var o = this.AllPlayers[e[i]];
        if (null !== o && void 0 !== o) {
          n.push(o);
          this.playersPlaying.push(o);
        }
      }
      for (var a in this.players = [], this.players = n, this.pendingJoinPlayers = [], this.AllPlayers) {
        if (!(null === (h = this.AllPlayers[a]) || void 0 === h || h.checkInThisArray(n))) {
          if (h.isMine()) {
            this.players.push(h);
          } else {
            this.pendingJoinPlayers.push(h);
          }
        }
      }
      this.updateViewPostions();
      var s = this.getMinePlayer();
      if (null !== s && void 0 !== s) {
        s.setArrayCard(t);
      }
      for (i = 0; i < t.length; i++) {
        var r = t[i];
        (y = h.cards[i]).setTextureWithCode(r, l.default.getInstance().gameID);
      }
      for (i = 0; i < this.players.length; ++i) {
        (c = this.players[i]).iconnReady.active = false;
        if (!c.isHost) {
          h.kickButton.active = false;
        }
      }
      for (i = 0; i < this.playersPlaying.length; ++i) {
        var c = this.playersPlaying[i];
        this.setBetStateForPlayer(c.userID, 0, this.bet, c._money - this.bet);
      }
      for (i = 0; i < this.playersPlaying.length; ++i) {
        (c = this.playersPlaying[i]).hideXiToCard(true);
      }
      for (i = 0; i < this.playersPlaying.length; i++) {
        var h,
          u = (h = this.playersPlaying[i]).pos,
          d = u.x + this.cardSizeHiden.x,
          p = u.y - 5,
          f = h.isMine();
        if (h.pos.x < 0 || f) {
          d = u.x + 1.5 * this.cardSizeHiden.x;
          if (f) {
            d = u.x + 1.8 * this.cardSizeHiden.x;
            p = u.y;
          }
        } else {
          d = u.x - 1.5 * this.cardSizeHiden.x;
        }
        for (var g = 0; g < 2; g++) {
          var y;
          (y = h.cards[g]).node.position = new cc.Vec2(0, 0);
          if (h.pos.x < 0 || f) {
            y.node.zIndex = m.default.MIDDLE_TOP + g;
          } else {
            y.node.zIndex = m.default.MIDDLE_TOP - g;
          }
          if (f) {
            if (1 === g) {
              y.node.runAction(cc.sequence(cc.delayTime(.6 + .08 * g), cc.callFunc(this.phatBaiFX, this, f ? y : null), cc.moveTo(.6,
                new cc.Vec2(d, p)).easing(cc.easeExponentialOut()), cc.callFunc(this.finishPhatBai, this)));
            } else {
              y.node.runAction(cc.sequence(cc.delayTime(.6 + .08 * g), cc.callFunc(this.phatBaiFX, this, f ? y : null), cc.moveTo(.6,
                new cc.Vec2(d, p)).easing(cc.easeExponentialOut())));
            }
            this.revealCardPopupController.cards[g].serverCode = y.serverCode;
            this.revealCardPopupController.cards[g].setTextureWithCode(y.serverCode, l.default.getInstance().gameID);
          } else {
            y.node.runAction(cc.sequence(cc.delayTime(.6 + .08 * g), cc.callFunc(function() {
              _.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_preflop_card_distribution");
            }), cc.moveTo(.6, new cc.Vec2(d, p)).easing(cc.easeExponentialOut())));
          }
          if (h.pos.x < 0 || f) {
            d += .4 * this.cardSizeBig.x;
          } else {
            d -= .4 * this.cardSizeBig.x;
          }
        }
      }
      if (!this._thisPlayerView.checkInThisArray(this.playersPlaying)) {
        this.finishPhatBai(this);
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
    e.prototype.phatBaiFX = function(t, e) {
      e.node.active = true;
      e.setType(r.default.TypeSMALL);
      e.setTextureWithCode(e.serverCode, l.default.getInstance().gameID);
      _.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_preflop_card_distribution");
    };
    e.prototype.finishPhatBai = function(t) {
      this._dangPhatBai = false;
      this.state = a.GameState.PLAYING;
      if (this.playersPlaying.indexOf(this._thisPlayerView) < 0) {
        this.state = a.GameState.VIEWING;
      } else {
        this.chooseCardToReveal();
      }
      for (var e = 0; e < this.players.length; ++e) {
        var i = this.players[e];
        if (!(this.state == a.GameState.VIEWING && i.isMine())) {
          i.startCountDown(10);
        }
      }
    };
    e.prototype.nextTurn = function(t, e) {
      this.currentBetMoneyOnSlider = 0;
      var i = this.getPlayer(e);
      if (null !== i && void 0 !== i) {
        for (var n = 0; n < this.players.length; ++n) {
          this.players[n].stopCountDown();
        }
        if (i.startCountDown(20), i.isMine()) {
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
          var o = this.currentMaxBet - this._thisPlayerView._currentBet;
          if (o >= this._thisPlayerView._money && 0 != o) {
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
    e.prototype.startBetting = function(t) {
      if (!(t <= 0)) {
        if (this.players.length <= 1) {
          this.cardGameTableController.stopProgressStartGame();
        } else {
          this.cardGameTableController.startBetting(t, 7);
        }
      }
    };
    e.prototype.latBai = function(t, e) {
      for (var i = 0; i < this.players.length; i++) {
        var n = this.players[i];
        if (0 === n.userID.localeCompare(t) && !n._latBai) {
          n._latBai = true;
          for (var o = 0; o < e.length; o++) {
            var a = n.cards[o];
            a.cardSprite.node.color = cc.Color.WHITE;
            if (false === n.isMine()) {
              a.setTextureWithCode(e[o], l.default.getInstance().gameID);
            }
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
            var l = g.default.getRandomInt(this.listSmallChipPrefabs.length),
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
            for (var u = g; u < h; u++) {
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
                C.default.getInstance().sendGameToError(p);
              }
              c.coins.push(d);
              d.zIndex = u - g + l + 1;
              var f = cc.sequence(cc.delayTime(1.1), cc.callFunc(function() {
                _.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_chip_moving");
              }), cc.moveTo(1, new cc.Vec2(c.node.position.x + c.chipIconPos.position.x, c.node.position.y + c.chipIconPos.position
                .y)).easing(cc.easeExponentialOut()), cc.callFunc(function() {
                _.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_chip_win");
              }), cc.moveTo(.3, new cc.Vec2(c.node.position.x + c.chipIconPos.position.x, c.node.position.y + c.chipIconPos.position
                .y + 4 * (u - g + l))));
              d.runAction(f);
              var m = cc.sequence(cc.delayTime(1.1), cc.fadeOut(1), cc.fadeTo(.3, 255));
              d.runAction(m);
            }
            g += r[e];
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
        var S = function(e) {
            var i = t[e],
              n = i.id - 1;
            i.m;
            if (n >= v.listPkPots.length) {
              return "continue";
            }
            var o = v.listPkPots[n],
              a = i.uid,
              s = v.getPlayer(a);
            if (null === s || void 0 === s) {
              return "continue";
            }
            for (var r = function(t) {
                var e = o.coins[t],
                  i = cc.sequence(cc.delayTime(3 + .07 * (o.coins.length - 1 - t)), cc.callFunc(function() {
                    _.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_chip_win");
                  }), cc.moveTo(2.5, s.node.position).easing(cc.easeExponentialOut()), cc.callFunc(function() {
                    e.removeFromParent(true);
                  }));
                e.runAction(i);
                var n = cc.sequence(cc.delayTime(3 + .07 * (o.coins.length - 1 - t)), cc.fadeOut(1));
                e.runAction(n);
              }, c = 0; c < o.coins.length; c++) {
              r(c);
            }
            var l = cc.sequence(cc.delayTime(3.5 + .07 * o.coins.length), cc.fadeOut(.2), cc.callFunc(function() {
              o.node.active = false;
              o.node.opacity = 255;
              o.setNumber(0);
            }));
            o.node.runAction(l);
            o.coins = [];
          },
          v = this;
        for (s = 0; s < t.length; s++) {
          S(s);
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
      this._autoWithDrawMoney = h.default.getInstance().autoBuyIn;
      if (this.theoTat) {
        this.onTheoTatClick();
      }
      if (this.xemUp) {
        this.onXemUpClick();
      }
      if (4 !== this._soVongDaTo) {
        this.latHetBai(t);
      }
      this._soVongDaTo = 0;
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
          if (o.isMine()) {
            if (i.iw) {
              _.default.getInstance().playEffect("Sounds/sfx_add_money");
              _.default.getInstance().playEffect("Sounds/sfx_win");
            } else {
              _.default.getInstance().playEffect("Sounds/sfx_lose");
            }
          }
          o._currentBet = 0;
          var s = i.mX;
          o._winnings = s;
          s;
          var r = i.m;
          if (o._money = r, o._realMoney = i.rM, null !== i.cs && void 0 !== i.cs) {
            var c = i.cs;
            this.latBai(n, c);
          }
          o.setMoney(o._money);
          var l = this.timeToFinish;
          o.showMoneyFxForPlayer(s, l, 30);
          if (s > 0) {
            o.runWinAction(l);
          }
          var u,
            d,
            p = "";
          if (s > 0 || 2, null !== i.rh && void 0 !== i.rh) {
            var f = i.rh;
            if (0 == f) {
              p = "M\u1eadu th\u1ea7u";
              u = "mauthau_lose";
              d = "mauthau";
            } else {
              if (1 == f) {
                p = "\u0110\xf4i";
                u = "doi_lose";
                d = "doi";
              } else {
                if (2 == f) {
                  p = "Th\xfa";
                  u = "thu_lose";
                  d = "thu";
                } else {
                  if (3 == f) {
                    p = "X\xe1m";
                    u = "samco_lose";
                    d = "samco";
                  } else {
                    if (4 == f) {
                      p = "S\u1ea3nh";
                      u = "sanh_lose";
                      d = "sanh";
                    } else {
                      if (5 == f) {
                        p = "Th\xf9ng";
                        u = "thung_lose";
                        d = "thung";
                      } else {
                        if (6 == f) {
                          p = "C\xf9 l\u0169";
                          u = "culu_lose";
                          d = "culu";
                        } else {
                          if (7 == f) {
                            p = "T\u1ee9 Qu\xfd";
                            u = "tuquy_lose";
                            d = "tuquy";
                          } else {
                            if (8 == f) {
                              p = "Th\xf9ng Ph\xe1 S\u1ea3nh";
                              u = "thungphasanh_lose";
                              d = "thungphasanh";
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
          if (p.length > 0) {
            o.showTextFxResultForPlayer(s > 0 ? this.pkSpriteAtlas.getSpriteFrame(d) : this.pkSpriteAtlas.getSpriteFrame(u), l);
          }
          o.removeBubbleFx(true);
          o.state = 0;
          o._winnings = 0;
        }
      }
      this.updateReadyStatus();
      var g = cc.sequence(cc.delayTime(this.timeToFinish), cc.callFunc(this.handlePendingPlayers, this));
      this.node.runAction(g);
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
          v.default.getInstance().showPopupMessageUtil("B\u1ea1n kh\xf4ng \u0111\u1ee7 ti\u1ec1n tham gia b\xe0n ch\u01a1i!");
          return void this.sendLeaveRoom();
        }
        this._khongThaoTac = true;
        this.updateMoneys();
        this._dangKetThuc = false;
        if (this._daNgoi) {
          this.rutTienBtn.active = true;
        }
        this.removePendingPlayers();
        if (1 == this.players.length) {
          this.cardGameTableController.stopProgressStartGame();
        }
        this.state = a.GameState.WAITING;
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
    e.prototype.leave = function() {};
    e.prototype.indexA = function(t) {
      for (var e = 0; e < t.length; ++e) {
        if (14 === t[e].N) {
          return e;
        }
      }
      return 0;
    };
    e.prototype.sortVector = function(t) {
      t.sort(function(t, e) {
        return t.N > e.N ? 1 : t.N < e.N ? -1 : 0;
      });
    };
    e.prototype.sortVectorReverse = function(t, e) {
      t.sort(function(t, i) {
        if (t.N > i.N) {
          return 1;
        }
        if (t.N < i.N) {
          return -1;
        }
        if (e) {
          if (t.S > i.S) {
            return -1;
          }
          if (t.S < i.S) {
            return 1;
          }
        } else {
          if (t.S > i.S) {
            return 1;
          }
          if (t.S < i.S) {
            return -1;
          }
        }
        return 0;
      });
    };
    e.prototype.sortVector2 = function(t) {
      t.sort(function(t, e) {
        return t.S > e.S ? 1 : t.S < e.S ? -1 : t.N > e.N ? -1 : t.N < e.N ? 1 : 0;
      });
    };
    e.prototype.checkDoi = function(t) {
      var e = 0,
        i = t.slice();
      this.sortVector(i);
      for (var n = 0; n < i.length - 1; ++n) {
        if (i[n].N === i[n + 1].N) {
          e = 68 + i[n].N;
          break;
        }
      }
      return e;
    };
    e.prototype.checkThu = function(t) {
      var e = 0;
      if (t.length <= 3) {
        return 0;
      }
      var i = t.slice();
      this.sortVector(i);
      for (var n = 0, o = [], a = 0; a < i.length - 1; ++a) {
        for (var s = 0; s < i.length && i[a].N === i[s].N; ++s) {
          n++;
        }
        if (1 === n) {
          o.push(i[a]);
          o.push(i[a + 1]);
          a++;
        } else {
          n = 0;
        }
      }
      if (4 === o.length) {
        e = 136 + o[3].N;
      }
      return e;
    };
    e.prototype.checkSam = function(t) {
      var e = 0,
        i = t.slice();
      this.sortVector(i);
      for (var n = 0, o = 0; o < i.length - 1; ++o) {
        for (var a = 0; a < i.length && i[o].N === i[a].N; ++a) {
          n++;
        }
        if (2 === n) {
          e = 204 + i[o].N;
          break;
        }
        n = 0;
      }
      return e;
    };
    e.prototype.checkSanh = function(t) {
      var e = 0;
      if (t.length < 5) {
        return 0;
      }
      var i = t.slice();
      this.sortVector(i);
      for (var n = 0, o = 0, a = 0, s = this.indexA(i) > 0, r = 0; r < i.length - 1; ++r) {
        var c = i[r + 1].N - i[r].N;
        if (c > 1 ? (n = 0, o = 0, a = i[r + 1].N) : 1 === c && (n++, o = i[r].N, r === i.length - 2 && (n++, o = i[r + 1].N)), s && (
            3 === n && 4 === o || 4 === n && 5 === o)) {
          return 277;
        }
        if (5 === n) {
          break;
        }
      }
      if (5 === n) {
        if (e = 272 + o, s && 2 === a) {
          return 277;
        }
        if (s && 10 === a) {
          return 286;
        }
      }
      return e;
    };
    e.prototype.checkThung = function(t) {
      if (t.length < 5) {
        return 0;
      }
      var e = t.slice();
      this.sortVector2(e);
      for (var i = 0, n = 0; n < e.length - 1; ++n) {
        for (var o = n + 1; o < e.length && e[n].S === e[o].S; ++o) {
          i++;
        }
        if (4 === i) {
          return 340 + t[n + 4].N;
        }
        i = 0;
      }
      return 0;
    };
    e.prototype.checkCuLu = function(t) {
      if (t.length < 5) {
        return 0;
      }
      var e = t.slice();
      this.sortVector(e);
      for (var i = 0, n = -1, o = 0, a = 0; a < e.length - 1; ++a) {
        for (var s = a + 1; s < e.length && e[a].N === e[s].N; ++s) {
          i++;
        }
        if (2 === i) {
          n = a;
          i = 0;
          o = e[a].N;
          break;
        }
        i = 0;
      }
      if (-1 !== n) {
        e.splice(n, 3);
        for (a = 0; a < e.length; ++a) {
          if (e[a].N === e[a + 1].N) {
            return 408 + o;
          }
        }
      }
      return 0;
    };
    e.prototype.checkTuQuy = function(t) {
      if (t.length < 4) {
        return 0;
      }
      var e = 0,
        i = t.slice();
      this.sortVector(i);
      for (var n = 0, o = 0; o < i.length - 1; ++o) {
        for (var a = o + 1; a < i.length && i[o].N === i[a].N; ++a) {
          n++;
        }
        if (3 === n) {
          o;
          n = 0;
          return 476 + i[o].N;
        }
        n = 0;
      }
      return e;
    };
    e.prototype.checkTPS = function(t) {
      if (3 === t.length) {
        return 0;
      }
      var e = t.slice();
      this.sortVector(e);
      return this.checkThung(t) > 0 && this.checkSanh(t) > 0 ? 544 + e[4].N : 0;
    };
    e.prototype.getMark = function(t) {
      var e = 0;
      return (e = this.checkTPS(t)) > 0 ? e : (e = this.checkTuQuy(t)) > 0 ? e : (e = this.checkCuLu(t)) > 0 ? e : (e = this.checkThung(
          t)) > 0 ? e : (e = this.checkSanh(t)) > 0 ? e : (e = this.checkSam(t)) > 0 ? e : (e = this.checkThu(t)) > 0 ? e : e = this
        .checkDoi(t);
    };
    e.prototype.sortVectorPlayers = function() {
      this.players.sort(function(t, e) {
        return t.sit > e.sit ? -1 : t.sit < e.sit ? 1 : 0;
      });
    };
    e.prototype.buyIn = function() {
      this._autoWithDrawMoney = h.default.getInstance().autoBuyIn;
      this._moneyToAutoWithdraw = h.default.getInstance().moneyBuyIn;
      if (this._moneyToAutoWithdraw > 0) {
        y.default.getInstance().sendWithdrawMoneyCommom(this._moneyToAutoWithdraw);
      }
    };
    e.prototype.OnBetListViewValueChange = function(t) {
      this.currentBetMoneyOnSlider = t;
    };
    e.prototype.addPlayer = function(e, i, n, o, a, s, r, c, l, h, u, d, p) {
      var f = t.prototype.addPlayer.call(this, e, i, n, o, a, s, r, c, l, h, u, d, p);
      if (f.isMine()) {
        f.node.scale = .9;
      } else {
        f.node.scale = .7;
      }
      f.initXiToCard(this.prefabsGameCard);
      return f;
    };
    e.prototype.getViewPositionOfPlayer = function(t, e) {
      var i = -1,
        n = this.players.length,
        o = this.POS3;
      if (n > 3) {
        o = this.POS5;
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
        v.default.getInstance().showPopupMessageUtil("B\u1ea1n kh\xf4ng \u0111\u1ee7 ti\u1ec1n \u0111\u1ec3 buy-in");
      } else {
        if (this._autoWithDrawMoney) {
          this.buyIn();
        } else {
          v.default.getInstance().showPopupBuyIn(l.default.getInstance().maxBuyIn, l.default.getInstance().minBuyIn, l.default
            .getInstance().bet);
          v.default.getInstance().popupBuyIn.onHandleBuyIn = function() {
            t.buyIn();
            v.default.getInstance().popupBuyIn.hide();
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
    e.prototype.latHetBai = function(t) {
      for (var e = 0; e < t.length; e++) {
        var i = t[e],
          n = i.uid,
          o = this.getPlayer(n);
        if (o && i.cs) {
          var a = i.cs,
            s = o.isMine(),
            c = o.pos,
            h = c.x + this.cardSizeHiden.x,
            u = c.y - 5;
          if (o.pos.x < 0 || s) {
            h = c.x + 1.5 * this.cardSizeHiden.x;
            if (s) {
              h = c.x + 1.8 * this.cardSizeHiden.x;
              u = c.y;
            }
          } else {
            h = c.x - 1.5 * this.cardSizeHiden.x;
          }
          for (var d = 0; d < a.length; d++) {
            var p = o.cards[d];
            if (!p.node.active) {
              p.node.position = new cc.Vec2(0, 0);
            }
            p.setType(r.default.TypeHIDE);
            if (o.pos.x < 0 || s) {
              p.node.zIndex = m.default.MIDDLE_TOP + d;
            } else {
              p.node.zIndex = m.default.MIDDLE_TOP - d;
            }
            p.node.active = true;
            p.cardSprite.node.color = cc.Color.WHITE;
            p.setTextureWithCode(a[d], l.default.getInstance().gameID);
            if (false === o.isMine()) {
              p.node.runAction(cc.sequence(cc.delayTime(0 + .08 * d), cc.moveTo(.2, new cc.Vec2(h, u))));
            } else {
              p.node.runAction(cc.sequence(cc.delayTime(0 + .08 * d), cc.callFunc(this.phatBaiFX, this, s ? p : null), cc.moveTo(.2,
                new cc.Vec2(h, u))));
            }
            if (o.pos.x < 0 || s) {
              h += .4 * this.cardSizeBig.x;
            } else {
              h -= .4 * this.cardSizeBig.x;
            }
          }
        }
      }
    };
    e.prototype.setCardsForPlayer = function(t, e, i) {
      var n = this.getPlayer(t);
      if (n) {
        if (n.iconnReady.active = false, n.kickButton.active = false, false === n.isMine()) {
          if (6 === n.state && (cc.callFunc(this.nextTurn, this, n.userID), this.remainingTime <= 20 && this.remainingTime > 0 && n
              .startCountDown(this.remainingTime, .05 * (20 - this.remainingTime))), 0 !== e.length) {
            var o = (y = n.pos).x + 1.5 * this.cardSizeHiden.x;
            if (n.pos.x > 0) {
              o = y.x - 1.5 * this.cardSizeHiden.x;
            }
            var s = y.y - 5;
            (C = n.cards[0]).node.active = true;
            C.node.position = new cc.Vec2(o, s);
            if (n.pos.x < 0) {
              o += .4 * this.cardSizeBig.x;
              C.node.zIndex = m.default.MIDDLE_TOP;
            } else {
              o -= .4 * this.cardSizeBig.x;
              C.node.zIndex = m.default.MIDDLE_TOP;
            }
            for (var c = 0; c < e.length; c++) {
              (C = n.cards[c + 1]).node.active = true;
              C.setTextureWithCode(e[c], l.default.getInstance().gameID);
              C.node.position = new cc.Vec2(o, s);
              if (n.pos.x < 0) {
                o += .4 * this.cardSizeBig.x;
                C.node.zIndex = m.default.MIDDLE_TOP + c + 1;
              } else {
                o -= .4 * this.cardSizeBig.x;
                C.node.zIndex = m.default.MIDDLE_TOP - c - 1;
              }
            }
          } else {
            if (0 === n.cards.length || !n.isReady) {
              return;
            }
            for (var h = 0; h < 2; h++) {
              (C = n.cards[h]).node.position = new cc.Vec2(0, 0);
              C.node.active = true;
            }
            for (var u = 2; u < 5; u++) {
              (C = n.cards[u]).node.position = new cc.Vec2(0, 0);
              C.node.active = false;
            }
            o = (y = n.pos).x + 1.5 * this.cardSizeHiden.x;
            if (n.pos.x > 0) {
              o = y.x - 1.5 * this.cardSizeHiden.x;
            }
            s = y.y - 5;
            for (var d = 0; d < n.cards.length; d++) {
              var p = n.cards[d];
              p.setType(r.default.TypeSMALL);
              p.node.position = new cc.Vec2(o, s);
              if (n.pos.x < 0) {
                o += .4 * this.cardSizeBig.x;
                p.node.zIndex = m.default.MIDDLE_TOP + d;
              } else {
                o -= .4 * this.cardSizeBig.x;
                p.node.zIndex = m.default.MIDDLE_TOP - d;
              }
            }
          }
        } else {
          if (0 === e.length) {
            return;
          }
          this.state = a.GameState.PLAYING;
          this.rutTienBtn.active = false;
          n.node.stopAllActions();
          this.updateViewPostions(true, false, true);
          this._daNgoi = true;
          for (var f = 0; f < 2; f++) {
            (C = n.cards[f]).node.position = new cc.Vec2(0, 0);
            C.node.active = true;
          }
          for (var g = 2; g < 5; g++) {
            (C = n.cards[g]).node.position = new cc.Vec2(0, 0);
            C.node.active = false;
          }
          o = (y = n.pos).x + 1.8 * this.cardSizeHiden.x;
          s = y.y;
          for (var y, S = 0; S < n.cards.length; S++) {
            (C = n.cards[S]).node.zIndex = m.default.MIDDLE_TOP + S;
            C.node.position = new cc.Vec2(o, s);
            C.setType(r.default.TypeSMALL);
            o += .4 * this.cardSizeBig.x;
          }
          if (-1 === i) {
            for (var _ = 0; _ < e.length; _++) {
              var v = e[_];
              (C = n.cards[_]).setTextureWithCode(v, l.default.getInstance().gameID);
              C.node.active = true;
              this.revealCardPopupController.cards[_].serverCode = C.serverCode;
              this.revealCardPopupController.cards[_].setTextureWithCode(C.serverCode, l.default.getInstance().gameID);
            }
            return void this.revealCardPopupController.open();
          }
          for (_ = 0; _ < e.length; _++) {
            if ((v = e[_]) === i) {
              n.cards[0].setTextureWithCode(v, l.default.getInstance().gameID);
              n.cards[0].cardSprite.node.color = cc.Color.GRAY;
              n.cards[0].node.active = true;
              break;
            }
          }
          var b = 1;
          for (_ = 0; _ < e.length; _++) {
            var C;
            if ((v = e[_]) !== i) {
              (C = n.cards[b]).setTextureWithCode(v, l.default.getInstance().gameID);
              C.node.active = true;
              b++;
            }
          }
          if (6 === n.state) {
            cc.callFunc(this.nextTurn, this, n.userID);
            this.btnToTheoUp.active = true;
            if (this.remainingTime <= 20 && this.remainingTime > 0) {
              n.startCountDown(this.remainingTime, .05 * (20 - this.remainingTime));
            }
          } else {
            if (1 !== n.state && n._money > 0) {
              this.btntheoTatUpXem.active = true;
            }
          }
        }
      }
    };
    e.prototype.revealCard = function(t, e) {
      var i = this.getPlayer(t);
      if (i) {
        if (i.stopCountDown(), i.isMine()) {
          var n = i.cards[0];
          if ((s = i.cards[1]).serverCode === e) {
            n.cardSprite.node.color = cc.Color.GRAY;
          } else if (n.serverCode === e) {
            var o = s.node.position;
            s.node.position = n.node.position;
            n.node.position = o;
            var a = i.cards[1];
            i.cards[1] = i.cards[0];
            i.cards[0] = a;
            s.cardSprite.node.color = cc.Color.GRAY;
            s.node.zIndex = s.node.zIndex - 1;
            n.node.zIndex = s.node.zIndex + 1;
          }
          this.revealCardPopupController.close();
        } else {
          var s;
          n = i.cards[0];
          (s = i.cards[1]).setTextureWithCode(e, l.default.getInstance().gameID);
          s.setType(r.default.TypeSMALL);
        }
      }
    };
    e.prototype.chooseCardToReveal = function() {
      this.revealCardPopupController.open();
    };
    e.prototype.getCmdStart = function() {
      return a.Global_Message.START_GAME_CARD;
    };
    e.prototype.getSpriteFrameName = function() {
      return this.pkSpriteAtlas.getSpriteFrame("Sgame_XiTo");
    };
    o([P(cc.Prefab)], e.prototype, "betLabelPrefabs", void 0);
    o([P([cc.Node])], e.prototype, "listBetLabelPos", void 0);
    o([P(cc.Node)], e.prototype, "iConTheoTat", void 0);
    o([P(cc.Node)], e.prototype, "iConXemUp", void 0);
    o([P(cc.Node)], e.prototype, "btnToTheoUp", void 0);
    o([P(cc.Node)], e.prototype, "btntheoTatUpXem", void 0);
    o([P(cc.Node)], e.prototype, "theoBtn", void 0);
    o([P(cc.Node)], e.prototype, "xemBtn", void 0);
    o([P(cc.Button)], e.prototype, "toBtn", void 0);
    o([P(cc.Prefab)], e.prototype, "prefabBetListViewItem", void 0);
    o([P([cc.Node])], e.prototype, "listSmallChipPrefabs", void 0);
    o([P([p.default])], e.prototype, "listPkPots", void 0);
    o([P(cc.SpriteAtlas)], e.prototype, "pkSpriteAtlas", void 0);
    o([P(cc.Prefab)], e.prototype, "revealCardPopup", void 0);
    return e = o([A], e);
  }(c.default);
i.default = M;
void 0;
