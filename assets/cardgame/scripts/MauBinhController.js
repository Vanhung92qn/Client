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
  },
  a = this && this.__awaiter || function(t, e, i, n) {
    return new(i || (i = Promise))(function(o, a) {
      function s(t) {
        try {
          c(n.next(t));
        } catch (t) {
          a(t);
        }
      }

      function r(t) {
        try {
          c(n.throw(t));
        } catch (t) {
          a(t);
        }
      }

      function c(t) {
        if (t.done) {
          o(t.value);
        } else {
          new i(function(e) {
            e(t.value);
          }).then(s, r);
        }
      }
      c((n = n.apply(t, e || [])).next());
    });
  },
  s = this && this.__generator || function(t, e) {
    var i,
      n,
      o,
      a,
      s = {
        label: 0,
        sent: function() {
          if (1 & o[0]) {
            throw o[1];
          }
          return o[1];
        },
        trys: [],
        ops: []
      };
    a = {
      next: r(0),
      throw: r(1),
      return: r(2)
    };
    if ("function" == typeof Symbol) {
      a[Symbol.iterator] = function() {
        return this;
      };
    }
    return a;

    function r(t) {
      return function(e) {
        return c([t, e]);
      };
    }

    function c(a) {
      if (i) {
        throw new TypeError("Generator is already executing.");
      }
      for (; s;) {
        try {
          if (i = 1, n && (o = 2 & a[0] ? n.return : a[0] ? n.throw || ((o = n.return) && o.call(n), 0) : n.next) && !(o = o.call(n, a[1]))
            .done) {
            return o;
          }
          switch (n = 0, o && (a = [2 & a[0], o.value]), a[0]) {
            case 0:
            case 1:
              o = a;
              break;
            case 4:
              return s.label++, {
                value: a[1],
                done: false
              };
            case 5:
              s.label++;
              n = a[1];
              a = [0];
              continue;
            case 7:
              a = s.ops.pop();
              s.trys.pop();
              continue;
            default:
              if (!(o = (o = s.trys).length > 0 && o[o.length - 1]) && (6 === a[0] || 2 === a[0])) {
                s = 0;
                continue;
              }
              if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
                s.label = a[1];
                break;
              }
              if (6 === a[0] && s.label < o[1]) {
                s.label = o[1];
                o = a;
                break;
              }
              if (o && s.label < o[2]) {
                s.label = o[2];
                s.ops.push(a);
                break;
              }
              o[2] && s.ops.pop();
              s.trys.pop();
              continue;
          }
          a = e.call(t, s);
        } catch (t) {
          a = [6, t];
          n = 0;
        } finally {
          i = o = 0;
        }
      }
      if (5 & a[0]) {
        throw a[1];
      }
      return {
        value: a[0] ? a[1] : void 0,
        done: true
      };
    }
  };
Object.defineProperty(i, "__esModule", {
  value: true
});
var r,
  c = require("./GameController"),
  l = require("./MessageCardGameHandler"),
  h = require("./GamePlayManager"),
  u = require("./MauBinhMessage"),
  d = require("./MusicPlayer"),
  p = require("./GameCardSprite"),
  f = require("./GameCardSpriteType"),
  g = require("./GameZOrder"),
  m = require("./ActionProgressTo"),
  y = require("./MauBinhRequest"),
  S = require("./MauBinhXapBai"),
  _ = require("./StringUtil"),
  v = require("./CommonPrefabsManager"),
  b = require("./MauBinhCheckCard"),
  C = require("./MBAI"),
  T = require("./MiniGameNode"),
  E = require("./GameConfigManager"),
  I = require("./GameUtils"),
  A = require("./MauBinhEmptyCard"),
  P = require("./MauBinhQuickGuide"),
  M = require("./CardGameCommonRequest"),
  O = require("./VersionController"),
  N = require("./GameDefine"),
  B = cc._decorator,
  D = B.ccclass,
  R = B.property;
(function(t) {
  t[t.RANDOM = 0] = "RANDOM";
  t[t.RANK = 1] = "RANK";
  t[t.SUIT = 2] = "SUIT";
})(r = i.MAUBINH_SORT_BOTTOM_CARD_TYPE || (i.MAUBINH_SORT_BOTTOM_CARD_TYPE = {}));
var L = function() {
    function t() {
      this.countRankMode = 0;
      this.countRandomMode = 0;
      this.countSuitMode = 0;
      this.currentSortBottomType = -1;
      this.reset();
    }
    Object.defineProperty(t.prototype, "CountRankMode", {
      get: function() {
        return this.countRankMode;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(t.prototype, "CountSuitMode", {
      get: function() {
        return this.countSuitMode;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(t.prototype, "CountRandomMode", {
      get: function() {
        return this.countRandomMode;
      },
      enumerable: true,
      configurable: true
    });
    t.prototype.reset = function() {
      this.countRankMode = 0;
      this.countRandomMode = 0;
      this.countSuitMode = 0;
      this.currentSortBottomType = -1;
    };
    t.prototype.count = function(t) {
      if (this.currentSortBottomType != t) {
        switch (this.currentSortBottomType = t, this.currentSortBottomType) {
          case r.RANDOM:
            this.countRandomMode++;
            break;
          case r.SUIT:
            this.countSuitMode++;
            break;
          case r.RANK:
            this.countRankMode++;
        }
      }
    };
    return t;
  }(),
  w = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.mauBinhViewModel = null;
      e.listPlayerCardPos = [];
      e.listPlayerCardPosSoChi = [];
      e.playerCardPosWhenDone = null;
      e.layerXepBai = null;
      e.bgLayerXepBai = null;
      e.mauBinhXapBai = null;
      e.btnXepLai = null;
      e.btnXepXong = null;
      e.btnBaoBinh = null;
      e.btnTuSapXep = null;
      e.progressXapBai = null;
      e.labelCountTime = null;
      e.listPlayerXepBaiLabel = [];
      e.lbTinhChi = null;
      e.prefabBinhLung = null;
      e.prefab3Sanh = null;
      e.prefab3Thung = null;
      e.prefab6Doi = null;
      e.prefab5doi1Xam = null;
      e.prefabDongHoa = null;
      e.prefabSanhRong = null;
      e.prefabSanhRongDongHoa = null;
      e.prefabMauThau = null;
      e.prefabDoi = null;
      e.prefabThu = null;
      e.prefabXamChi = null;
      e.prefabSanh = null;
      e.prefabThung = null;
      e.prefabCuLu = null;
      e.prefabTuQuy = null;
      e.prefabThungPhaSanh = null;
      e.prefabThangSapHam = null;
      e.prefabThangSaplang = null;
      e.prefabThuaSapHam = null;
      e.prefabThuaSapLang = null;
      e.blockLayerXepBai = null;
      e.emptyNodeContainer = null;
      e.lsEmptyCard = [];
      e.lsEmptyCardSortIndex = [];
      e.quickGuide = null;
      e.chatLayer = null;
      e.lsBottomCard = [];
      e.isRuningUpdate = false;
      e.currentCountDownTime = 0;
      e.isPlaying = false;
      e.daBaoBinh = false;
      e.playersSoChi = [];
      e.listEffect = [];
      e.listEffectSoChi = [];
      e.timeAutoSendDataDefault = 1.9;
      e.timeAutoSendData = 1.9;
      e.nextTimeSendUpdateBai = 0;
      e.IsKhongChoiVanNay = true;
      e.countEmptyCard = 0;
      e.currentSortBottomType = r.RANDOM;
      e.analyticNewSort = new L();
      e.isNewXepBaiCurrenting = false;
      e.isClickedXepXong = false;
      e.isDealNewCardDone = true;
      e.destinationY = -250;
      e.destinationTempY = -280;
      e.destinationRotationTemp = -235;
      e.destinationRotationFinal = 55;
      e.timeMoveTemp = .3;
      e.timeMoveFinal = .25;
      e.timeDelayBetweenCard = .1;
      e.distanceCardOffset = 40;
      e.cardWidth = 50;
      return e;
    }
    n(e, t);
    Object.defineProperty(e.prototype, "IsClickedXepXong", {
      get: function() {
        return this.isClickedXepXong;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(e.prototype, "isShowingQuickGuide", {
      get: function() {
        return this.quickGuide.node.active;
      },
      enumerable: true,
      configurable: true
    });
    e.prototype.initDefaultData = function() {
      t.prototype.initDefaultData.call(this);
      if (E.default.getInstance().isAnDanh) {
        this.isGameAnDanh = true;
        this.isGameAnDanhCheck = true;
      }
      this.node.stopAllActions();
      this.layerXepBai.active = false;
      this.btnXepLai.node.active = false;
      this.listPlayerXepBaiLabel.forEach(function(t) {
        t.string = "";
      });
      this.lbTinhChi.node.parent.stopAllActions();
      this.lbTinhChi.node.parent.active = false;
      this.removeEffect();
      this.listEffect.forEach(function(t) {
        t.removeFromParent(true);
      });
      this.listEffect = [];
      this.playersSoChi = [];
      this.stopCountDown();
      this.btnXepLai.node.active = false;
      this.daBaoBinh = false;
      this.isPlaying = false;
      this.progressXapBai.node.active = false;
      this.showHideuserAnDanh4(false);
    };
    e.prototype.onLoad = function() {
      for (var e = 0; e < this.lsEmptyCard.length; e++) {
        this.lsEmptyCard[e].setup(e, this);
      }
      this.resetNewSort();
      t.prototype.onLoad.call(this);
      this.POS2 = [];
      this.POS2.push(0);
      this.POS2.push(2);
      this.POS3 = [];
      this.POS3.push(0);
      this.POS3.push(3);
      this.POS3.push(2);
      this.POS4 = [];
      this.POS4.push(0);
      this.POS4.push(3);
      this.POS4.push(2);
      this.POS4.push(1);
      var i = cc.instantiate(this.prefabsGameCard),
        n = i.getComponent(p.default);
      n.init(f.default.TypeBIG);
      this.cardSizeBig = new cc.Vec2(i.getContentSize().width * i.scale, i.getContentSize().height * i.scale);
      n.init(f.default.TypeHIDE);
      this.cardSizeHiden = new cc.Vec2(i.getContentSize().width * i.scale, i.getContentSize().height * i.scale);
      n.init(f.default.TypeMEDIUM);
      this.cardSizeMedium = new cc.Vec2(i.getContentSize().width * i.scale, i.getContentSize().height * i.scale);
      i.destroy();
      this.layerXepBai.zIndex = g.default.MIDDLE_TOP;
      this.quickGuide.node.zIndex = g.default.MIDDLE_TOP + 1;
      this.distanceCard = new cc.Vec2(.4 * this.cardSizeMedium.x, .5 * this.cardSizeMedium.y);
      this.mauBinhXapBai.init(this);
      this.progressXapBai.node.zIndex = this.layerXepBai.zIndex + 1;
      this.initUserAnDanh4();
      this.playerViewpos4AnDanh.initMauBinhCard(this.prefabsGameCard);
      for (var o = 0; o < this.playerViewpos4AnDanh.cards.length; ++o) {
        this.playerViewpos4AnDanh.cards[o].node.position = this.getPlayerCardPosition(1, o, this.distanceCard);
      }
    };
    e.prototype.getTag = function() {
      return "maubinh";
    };
    e.prototype.onReceiveMessage = function(e, i, n) {
      switch (t.prototype.onReceiveMessage.call(this, e, i, n), e) {
        case u.default.DEAL_CARDS:
        case u.default.UPDATE_ARRANGE_CARDS_STATE:
        case u.default.FINISH_GAME:
        case u.default.START_BETTING:
        case u.default.REARRANGE_CARDS:
        case u.default.INFORM_ROYALTIES:
        case u.default.UPDATE_CURRENT_CARDS_STATE:
          this.onMauBinhEventReciveHandle(i, n);
      }
    };
    e.prototype.onMauBinhEventReciveHandle = function(t, e) {
      var i = this;
      if (null !== e && void 0 !== e) {
        switch (e.cmd) {
          case u.default.DEAL_CARDS:
            this.isNewXepBaiCurrenting = h.default.getInstance().IsMauBinhUsingNewXepBai;
            this.isClickedXepXong = false;
            this.showUINewXepBai();
            var n = e.cs,
              o = e.lpi;
            this.lsBottomCard = n;
            this.IsKhongChoiVanNay = true;
            for (var a = 0; a < o.length; ++a) {
              var s = o[a];
              if (null !== s && void 0 !== s && 0 === h.default.getInstance().userID.localeCompare(s)) {
                this.IsKhongChoiVanNay = false;
              }
            }
            this.cardGameTableController.startGameUI();
            false === this.IsKhongChoiVanNay ? this.startGame(n, o) : this.node.runAction(cc.sequence(cc.delayTime(_.default.getRandomInt(
              300) / 100 + .3), cc.callFunc(function() {
              i.startGame(n, o);
            })));
            break;
          case u.default.START_BETTING:
            var r = e.T;
            r /= 1e3;
            this.hideALLForStart();
            this.startBetting(r);
            O.default.getInstance().CheckForceUpdateByGameScene(N.GameConfigs.SceneName.MauBinh);
            break;
          case u.default.UPDATE_ARRANGE_CARDS_STATE:
            var c = e.uid,
              l = e.iar,
              d = -1;
            null !== e.r && void 0 !== e.r && (d = parseInt(e.r));
            l ? this.soBaiResponse(c, d) : this.xepLaiResponse(c);
            break;
          case u.default.FINISH_GAME:
            this.finishThisGame(e);
        }
      }
    };
    e.prototype.onGetInGameTableInfo = function(e) {
      t.prototype.onGetInGameTableInfo.call(this, e);
      var i = e.b,
        n = e.gS,
        o = e.rmT;
      o /= 1e3;
      var a = e.aid,
        s = e.Mu,
        r = false;
      if (null !== e.hpwd && void 0 !== e.hpwd) {
        r = e.hpwd;
      }
      this.isClickedXepXong = true;
      if (this.blockLayerXepBai.active) {
        this.blockLayerXepBai.active = false;
      }
      if (e.hasOwnProperty("nArr")) {
        h.default.getInstance().IsMauBinhUsingNewXepBai = e.nArr;
        this.isNewXepBaiCurrenting = h.default.getInstance().IsMauBinhUsingNewXepBai;
      }
      if (e.hasOwnProperty("fPNArr")) {
        h.default.getInstance().IsMauBinhFistTimeShowQuickGuide = e.fPNArr;
      }
      this.state = l.GameState.WAITING;
      if (!(4 !== n && 5 !== n)) {
        this.state = l.GameState.VIEWING;
      }
      this.setGameConfig(i, n, o, a, s, r);
      var c = e.ps;
      if (this.createListPlayerWhenGetTableInfo(c), this.updateViewPostions(true), this.state === l.GameState.VIEWING) {
        if (null !== e.re && void 0 !== e.re && e.re) {
          for (var u = -1, d = void 0, p = [], f = [], g = 0; g < c.length; g++) {
            var m = c[g];
            if (0 === m.uid.localeCompare(h.default.getInstance().userID)) {
              d = m.cs;
              f = m.aCs;
              p = m.aiCs;
              if (null !== m.rr && void 0 !== m.rr) {
                u = m.rr;
              }
              if (h.default.getInstance().IsMauBinhUsingNewXepBai && f && p && f.length > 0 && p.length > 0 && f.indexOf(-1) >= 0) {
                this.isClickedXepXong = false;
              }
              break;
            }
          }
          this.reconnectLastGame(d, u, f, p);
          this.updateViewingPlayerPositions();
          this.IsKhongChoiVanNay = false;
        } else {
          this.showViewTableMessage();
          this.IsKhongChoiVanNay = true;
        }
        if (this.initPlayerCardsViewing(), null !== e.re && void 0 !== e.re && e.re && this.showuserAnDanh(), null !== e.fi && void 0 !==
          e.fi) {
          var y = e.fi;
          if (y.ps.length > 0) {
            this.finishThisGame(y, true);
          }
        } else {
          if (this.isGameAnDanhCheck) {
            if (3 === this.players.length && _.default.getRandomInt(100) < 70) {
              this.showHideuserAnDanh4(true);
            }
          } else {
            this.countDown(o);
          }
        }
      } else {
        this.startBetting(o);
        this.IsKhongChoiVanNay = false;
      }
      this.showUINewXepBai();
      this.updateReadyStatus();
    };
    e.prototype.getRmcDefaul = function() {
      return 13;
    };
    e.prototype.checkReconnect = function(t) {
      return t.uid.localeCompare(h.default.getInstance().userID) && null !== t.re && void 0 !== t.re && false === t.re;
    };
    e.prototype.reconnectLastGame = function(t, e, i, n) {
      if (void 0 === i) {
        i = [];
      }
      if (void 0 === n) {
        n = [];
      }
      this.showuserAnDanh();
      this.state = l.GameState.PLAYING;
      this._playedOnce = true;
      this.daBaoBinh = false;
      this.isDealNewCardDone = true;
      var o = this._thisPlayerView;
      o.node.stopAllActions();
      o.node.position = this.listBtnInvitePos[0].position;
      for (var a = 0; a < t.length; a++) {
        var s = t[a];
        (u = o.cards[t.length - a - 1]).setTextureWithCode(s, h.default.getInstance().gameID);
        u.node.active = true;
        if (!this.isClickedXepXong) {
          u.node.scale = u.getScaleWithType(f.default.TypeBIG);
          u.isInBottomMauBinh = true;
        }
        for (var r = 0; r < i.length; r++) {
          if (i[r] == s) {
            this.lsEmptyCard[r].setCardChild(u);
            u.node.position = this.lsEmptyCard[r].getPosition();
            u.node.zIndex = g.default.MIDDLE_TOP_2;
          }
        }
      }
      if (this.isClickedXepXong) {
        for (a = 0; a < 13; ++a) {
          (u = o.cards[a]).index = a;
          u.node.position = this.getPlayerCardPosition(0, a, this.distanceCard);
          u.node.zIndex = g.default.MIDDLE_TOP_2 + a + 1;
        }
      } else {
        var c = [];
        for (r = 0; r < o.cards.length; r++) {
          var u;
          if ((u = o.cards[r]).isInBottomMauBinh) {
            c.push(u);
          }
        }
        for (r = 0; r < c.length; r++) {
          var d = c[r].node;
          d.zIndex = g.default.MIDDLE_TOP_2 + Math.floor(c.length / 2) + r;
          var p = -Math.floor(c.length / 2) * (this.cardWidth + this.distanceCardOffset) / 2 + r * (this.cardWidth + this
            .distanceCardOffset) / 2;
          d.position = new cc.Vec2(p, this.destinationY);
        }
      }
      this.btnXepXong.node.active = true;
      this.btnXepXong.interactable = true;
      this.btnXepLai.node.active = true;
      this.btnXepLai.interactable = true;
      this.btnBaoBinh.interactable = true;
      this.updateTextBinh();
      for (a = 0; a < this.players.length; ++a) {
        var m = this.players[a];
        if (2 === m.state) {
          this.xepLaiResponse(m.userID);
        } else {
          if (3 === m.state) {
            if (m.isMine()) {
              this.soBaiResponse(m.userID, e);
              if (e > 0) {
                this.btnXepLai.node.active = false;
              }
            } else {
              this.soBaiResponse(m.userID);
            }
          }
        }
      }
    };
    e.prototype.getViewPositionOfPlayer = function(t, e) {
      var i = -1,
        n = this.players.length,
        o = this.POS2;
      if (3 === n) {
        o = this.POS3;
      } else {
        if (4 === n) {
          o = this.POS4;
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
    e.prototype.addPlayer = function(e, i, n, o, a, s, r, c, l, h, u, d, p) {
      var f = t.prototype.addPlayer.call(this, e, i, n, o, a, s, r, c, l, h, u, d, p);
      f.setChatLayer(this.chatLayer);
      f.initMauBinhCard(this.prefabsGameCard);
      return f;
    };
    e.prototype.hideALLForStart = function() {
      this.node.stopAllActions();
      this.players.forEach(function(t) {
        t.hideAllCard(false);
        t.stopViewAction();
        t.removeBubbleFx();
      });
    };
    e.prototype.startGame = function(t, e) {
      var i = this;
      d.default.getInstance().playEffect("Sounds/chiabai");
      this.hideALLForStart();
      if (this._dangKetThuc) {
        this.handlePendingPlayers();
      }
      this._dangPhatBai = true;
      if (this.locPlayingPlayer(e), this.state = l.GameState.PLAYING, null !== this._thisPlayerView && void 0 !== this._thisPlayerView &&
        t.length > 0) {
        this._thisPlayerView.setArrayCard(t);
        for (var n = 0; n < this._thisPlayerView.cards.length; ++n) {
          var o = this._thisPlayerView.cards[n];
          o.setTextureWithCode(t[t.length - 1 - n], h.default.getInstance().gameID);
          o.index = n;
        }
      }
      for (n = 0; n < this.players.length; ++n) {
        var a = this.players[n];
        a.iconnReady.active = false;
        a.isHost;
      }
      var s = .2;
      this.isDealNewCardDone = true;
      for (var r = 0; r < this.playersPlaying.length; r++) {
        var c = this.playersPlaying[r],
          u = c.isMine();
        if (u) {
          if (0 === t.length) {
            continue;
          }
          if (this.isNewXepBaiCurrenting) {
            this.isDealNewCardDone = false;
            this.newDealCardStart(c);
            continue;
          }
        }
        for (var p = 0; p < c.cards.length; ++p) {
          var m = c.cards[p];
          m.node.active = true;
          m.node.name = "Other player card: " + c.userID;
          m.isInBottomMauBinh = false;
          var y = .6;
          if (u) {
            var S = this.getPlayerCardPositionMineBig(c.indexPos, p),
              _ = S.mag();
            m.setType(f.default.TypeBIG);
            m.node.zIndex = g.default.MIDDLE_TOP_2 + p + 1;
            y = _ / 1300;
            m.node.opacity = 0;
            var v = cc.sequence(cc.delayTime(.2 + .08 * p), cc.callFunc(this.phatBaiFX, this, m), cc.moveTo(y, S).easing(cc
              .easeExponentialOut()));
            m.node.runAction(v);
            if (12 === p) {
              s = y;
            }
          } else {
            v = cc.sequence(cc.delayTime(.2 + .08 * p), cc.moveTo(y, this.getPlayerCardPosition(c.indexPos, p, this.distanceCard)).easing(
              cc.easeExponentialOut()));
            m.node.runAction(v);
          }
          m.node.eulerAngles = new cc.Vec3(-23, 0, 0);
          m.Rotationby(.2 + .08 * p, y, 23, false);
        }
      }
      this.node.runAction(cc.sequence(cc.delayTime(1.16 + s), cc.callFunc(function() {
        i.finishPhatBai();
      })));
      this.countDown(60);
      this.showuserAnDanh();
      this.processCheckToOffAnDanh4();
    };
    e.prototype.newDealCardStart = function(t) {
      var e = this;
      this.resetNewSort();
      this.blockLayerXepBai.active = true;
      for (var i = function(i) {
          t.cards[i].initAndHide(f.default.TypeBIG);
          t.cards[i].node.setPosition(0, 0);
          t.cards[i].node.rotation = 180;
          t.cards[i].node.zIndex = g.default.MIDDLE_TOP_2 + 13 - i;
          t.cards[i].node.active = true;
          t.cards[i].isInBottomMauBinh = true;
          t.cards[i].emptyCardMauBinh = null;
          n.lsBottomCard[i] = t.cards[i].serverCode;
          n.newMoveCardAnimation(t.cards[i], i * n.timeDelayBetweenCard, function() {
            if (i == t.cards.length - 1) {
              t.cards[i].runActionFlip2(0, function() {
                e.isDealNewCardDone = true;
                e.blockLayerXepBai.active = false;
              });
            } else {
              t.cards[i].runActionFlip2();
            }
          }, i);
        }, n = this, o = 0; o < t.cards.length; o++) {
        i(o);
      }
      this.sendUpdateBai(true);
    };
    e.prototype.newMoveCardAnimation = function(t, e, i, n) {
      var o = -6 * (this.cardWidth + this.distanceCardOffset) / 2 + n * (this.cardWidth + this.distanceCardOffset) / 2,
        a = cc.sequence(cc.moveTo(this.timeMoveTemp, new cc.Vec2(o, this.destinationTempY)).easing(cc.easeSineOut()), cc.moveTo(this
          .timeMoveFinal, new cc.Vec2(o, this.destinationY))),
        s = cc.sequence(cc.rotateBy(this.timeMoveTemp, this.destinationRotationTemp).easing(cc.easeSineOut()), cc.rotateBy(this
          .timeMoveFinal, this.destinationRotationFinal));
      t.node.runAction(cc.sequence(cc.delayTime(e), cc.spawn(a, s), cc.callFunc(function() {
        t.node.zIndex = g.default.MIDDLE_TOP_2 + 13 + n;
        t.isInBottomMauBinh = true;
        t.tempTouchEmptyCardMauBinh = null;
        t.emptyCardMauBinh = null;
        if (i) {
          i();
        }
      })));
    };
    e.prototype.onClickedXepXongBtn = function() {
      this.onXepXong(true);
    };
    e.prototype.onXepXong = function(t) {
      if (void 0 === t) {
        t = false;
      }
      return a(this, void 0, void 0, function() {
        var e,
          i,
          n,
          o,
          a,
          r,
          c,
          l,
          h,
          u = this;
        return s(this, function(s) {
          switch (s.label) {
            case 0:
              if (this.btnBaoBinh.node.active && (t = false), this.btnXepXong.interactable = false, this.blockLayerXepBai.active =
                true, this.isShowingQuickGuide && this.quickGuide.hide(), !this.isNoEmptyCard()) {
                for (n = 0; n < this.lsEmptyCard.length; n++) {
                  if (!this.lsEmptyCard[n].IsEmpty) {
                    this.lsEmptyCard[n].Card.index = 12 - n;
                  }
                }
              }
              if (e = 0, (i = this.isNewXepBaiCurrenting) && !this.isNoEmptyCard()) {
                for (this._thisPlayerView.cards.sort(function(t, e) {
                    return t.isInBottomMauBinh !== e.isInBottomMauBinh ? e.isInBottomMauBinh ? 1 : -1 : t.isInBottomMauBinh ? t
                      .node.position.x - e.node.position.x : t.node.position.y !== e.node.position.y ? t.node.position.y - e
                      .node.position.y : t.node.position.x - e.node.position.x;
                  }), n = 0; n < this._thisPlayerView.cards.length; n++) {
                  if ((o = this._thisPlayerView.cards[n]).isInBottomMauBinh && (a = this.getNextEmptyCard(-1))) {
                    a.setCardChild(o);
                    o.node.runAction(cc.sequence(cc.delayTime(.1 * e), cc.moveTo(.1, a.getPosition())));
                    e++;
                  }
                }
              }
              return (r = .1 * (e - 1) + .1 + .15) < 0 && (r = 0), [4, I.delay(1e3 * r)];
            case 1:
              return s.sent(), c = false, i && !this.isClickedXepXong && (this.mauBinhXapBai.showLog(true), this.btnBaoBinh.node
                .active && (c = true)), c && t ? (this.btnXepXong.interactable = true, this.blockLayerXepBai.active = false, [3,
                4
              ]) : [3, 2];
            case 2:
              return l = this.sapXepBai(), this.isPlaying = false, h = 0, l && (h = .2, d.default.getInstance().playEffect(
                "Sounds/latbai")), this.node.runAction(cc.sequence(cc.delayTime(h), cc.callFunc(function() {
                for (var t = [], e = 12; e >= 0; --e) {
                  var n = u._thisPlayerView.cards[e].serverCode;
                  t.push(n);
                }
                y.default.getInstance().sendUpdateArrangeCardsState(t, i && !u.isClickedXepXong, u.analyticNewSort
                  .CountSuitMode, u.analyticNewSort.CountRandomMode, u.analyticNewSort.CountRankMode);
                u.isClickedXepXong = true;
              }))), [4, I.delay(1500)];
            case 3:
              s.sent();
              this.blockLayerXepBai.active = false;
              s.label = 4;
            case 4:
              return [2];
          }
        });
      });
    };
    e.prototype.sendUpdateBai = function(t) {
      if (void 0 === t && (t = false), this.layerXepBai.active && 0 === this.layerXepBai.getNumberOfRunningActions() || t) {
        if (this.isNewXepBaiCurrenting && !this.isClickedXepXong) {
          for (var e = [], i = [], n = 0; n < this.lsEmptyCard.length; n++) {
            var o = this.lsEmptyCard[n];
            if (o.IsEmpty) {
              e.push(-1);
            } else {
              e.push(o.Card.serverCode);
            }
          }
          var a = this._thisPlayerView.cards.filter(function(t) {
            return !e.includes(t.serverCode);
          }).map(function(t) {
            return t.serverCode;
          });
          for (n = 0; n < e.length; n++) {
            if (-1 == e[n]) {
              i.push(a.shift());
            } else {
              i.push(-1);
            }
          }
          y.default.getInstance().sendArrangingNewCards(e, i);
        } else {
          for (var s = [], r = 12; r >= 0; --r) {
            var c = this._thisPlayerView.cards[r].serverCode;
            s.push(c);
          }
          y.default.getInstance().sendUpdateCurrentCardsState(s);
        }
      }
    };
    e.prototype.phatBaiFX = function(t, e) {
      e.node.active = true;
      e.node.opacity = 255;
    };
    e.prototype.onClickXepLai = function() {
      d.default.getInstance().playbtnClick();
      y.default.getInstance().sendRearrangeCards();
    };
    e.prototype.onClickBaoBinh = function() {
      var t = this,
        e = this.sapXepBai();
      this.daBaoBinh = true;
      this.btnBaoBinh.interactable = false;
      this.btnXepXong.interactable = false;
      var i = 0;
      if (e) {
        i = .2;
        d.default.getInstance().playEffect("Sounds/latbai");
      }
      this.node.runAction(cc.sequence(cc.delayTime(i), cc.callFunc(function() {
        for (var e = [], i = 12; i >= 0; --i) {
          var n = t._thisPlayerView.cards[i];
          e.push(n.serverCode);
        }
        y.default.getInstance().sendImformRoyalties(e);
      })));
    };
    e.prototype.onClickTuSapBai = function() {
      var t = this;
      if (d.default.getInstance().playbtnClick(), this.bet > 110 && !this.tuChoiGame) {
        v.default.getInstance().showPopupMessageUtil("T\xednh n\u0103ng ch\u1ec9 h\u1ed7 tr\u1ee3 cho m\u1ee9c c\u01b0\u1ee3c 100!");
      } else {
        for (var e = C.default.getInstance().sapXep(this._thisPlayerView.cards), i = 0; i < 13; ++i) {
          var n = this._thisPlayerView.cards[i];
          n.setTextureWithCode(e[i].serverCode, h.default.getInstance().gameID);
          n.index = i;
        }
        if (this.isNewXepBaiCurrenting && !this.isClickedXepXong) {
          this.blockLayerXepBai.active = true;
          for (i = 0; i < 13; ++i) {
            this.lsEmptyCard[12 - i].clearCardChild(true);
          }
          var o = function(e) {
              var i = a.lsEmptyCard[12 - e];
              i.setCardChild(a._thisPlayerView.cards[e]);
              a._thisPlayerView.cards[e].node.stopAllActions();
              a._thisPlayerView.cards[e].node.runAction(cc.sequence(cc.moveTo(.15, i.getPosition()), cc.callFunc(function() {
                if (12 == e) {
                  t.blockLayerXepBai.active = false;
                }
              })));
            },
            a = this;
          for (i = 0; i < 13; ++i) {
            o(i);
          }
        }
        this.updateTextBinh();
        this._khongThaoTac = false;
      }
    };
    e.prototype.finishPhatBai = function() {
      var t = this;
      this._dangPhatBai = false;
      if (this._thisPlayerView.checkInThisArray(this.playersPlaying)) {
        this.state = l.GameState.PLAYING;
        this.xepLaiMovingDone();
      } else {
        this.state = l.GameState.VIEWING;
        this._thisPlayerView.runViewAction();
      }
      this.players.forEach(function(e) {
        if (!e.isMine()) {
          e.runViewAction();
        }
        if (e.mauBinhSoBai) {
          t.soBaiResponse(e.userID);
        }
      });
    };
    e.prototype.updateTextBinh = function() {
      for (var t = [], e = [], i = [], n = [], o = 1, a = 0; a < 13; ++a) {
        var s = this._thisPlayerView.cards[a];
        if (1 === o) {
          t.push(s);
        } else {
          if (2 === o) {
            e.push(s);
          } else {
            if (3 === o) {
              i.push(s);
            }
          }
        }
        if (!(2 !== a && 7 !== a)) {
          o++;
        }
        n.push(s.serverCode);
      }
      if (this.isNewXepBaiCurrenting && !this.isNoEmptyCard() && this.emptyNodeContainer.active) {
        this.listPlayerXepBaiLabel[0].string = "";
        this.listPlayerXepBaiLabel[1].string = "";
        this.listPlayerXepBaiLabel[2].string = "";
        this.btnBaoBinh.node.active = false;
      } else {
        var r = b.default.getInstance().getMarkMauBinh(n, t, e, i);
        if (0 === r) {
          var c = b.default.getInstance().getMark(t),
            l = b.default.getInstance().getMark(e),
            h = b.default.getInstance().getMark(i);
          if (c > l || c > h || c === l && b.default.getInstance().soSanhMauThau(t, e) || l > h || h === l && b.default.getInstance()
            .soSanhMauThau(e, i)) {
            this.listPlayerXepBaiLabel[0].string = "";
            this.listPlayerXepBaiLabel[1].string = "Binh l\u1ee7ng";
            this.listPlayerXepBaiLabel[2].string = "";
          } else {
            this.listPlayerXepBaiLabel[0].string = b.default.getInstance().getTextOfListCard(c);
            this.listPlayerXepBaiLabel[1].string = b.default.getInstance().getTextOfListCard(l);
            this.listPlayerXepBaiLabel[2].string = b.default.getInstance().getTextOfListCard(h);
          }
          this.btnBaoBinh.node.active = false;
        } else {
          this.listPlayerXepBaiLabel[0].string = "";
          this.listPlayerXepBaiLabel[1].string = b.default.getInstance().getTextofMauBinh(r);
          this.listPlayerXepBaiLabel[2].string = "";
          this.btnBaoBinh.interactable = true;
          this.btnBaoBinh.node.active = true;
        }
      }
    };
    e.prototype.soBaiResponse = function(t, e) {
      var i = this;
      if (void 0 === e && (e = -1), !this._dangPhatBai) {
        if (0 === t.localeCompare(h.default.getInstance().userID)) {
          this.isPlaying = false;
          if (e > 0) {
            this.showEffectMauBinh(this._thisPlayerView, e);
          }
          for (var n = this._thisPlayerView.cards.length - 1; n >= 0; --n) {
            var o = this._thisPlayerView.cards[n],
              a = this.getPlayerCardPosition(this._thisPlayerView.indexPos, n, this.distanceCard);
            o.node.runAction(cc.sequence(cc.delayTime(0), cc.moveTo(.2, a)));
            o.node.runAction(cc.sequence(cc.delayTime(0), cc.scaleTo(.2, o.getScaleWithType(f.default.TypeMEDIUM))));
          }
          this._thisPlayerView.cards[12].node.runAction(cc.sequence(cc.delayTime(0), cc.callFunc(function() {
            d.default.getInstance().playEffect("Sounds/latbai");
          }), cc.delayTime(.2), cc.callFunc(function() {
            i.soBaiMovingDone(e);
          })));
        } else {
          for (n = 0; n < this.players.length; ++n) {
            var s = this.players[n];
            if (0 === s.userID.localeCompare(t)) {
              s.stopViewAction();
              return void(s.mauBinhSoBai = true);
            }
          }
        }
      }
    };
    e.prototype.showEffectMauBinh = function(t, e) {
      d.default.getInstance().playEffect("Sounds/maubinh");
      var i = e,
        n = null;
      if (2 === i ? n = this.prefab3Sanh : 3 === i ? n = this.prefab3Thung : 4 === i ? n = this.prefab6Doi : 5 === i ? n = this
        .prefab5doi1Xam : 8 === i ? n = this.prefabDongHoa : 9 === i ? n = this.prefabDongHoa : 10 === i ? n = this.prefabSanhRong :
        11 === i && (n = this.prefabSanhRongDongHoa), null !== n && void 0 !== n) {
        var o = cc.instantiate(n);
        o.parent = this.node;
        o.position = t.node.position;
        o.zIndex = g.default.CHAT_BUBLES;
        this.listEffect.push(o);
      }
    };
    e.prototype.soBaiMovingDone = function(t) {
      var e = this;
      if (t <= 0) {
        this.btnXepLai.node.active = true;
        this.btnXepLai.interactable = true;
      }
      this.layerXepBai.stopAllActions();
      this.layerXepBai.runAction(cc.sequence(cc.fadeTo(.2, 0), cc.callFunc(function() {
        e.layerXepBai.active = false;
      })));
    };
    e.prototype.xepLaiMovingDone = function() {
      var t = this;
      this.layerXepBai.active = true;
      this.layerXepBai.stopAllActions();
      this.layerXepBai.opacity = 0;
      this.bgLayerXepBai.opacity = 255;
      this.layerXepBai.runAction(cc.sequence(cc.fadeTo(.2, 200), cc.callFunc(function() {
        t.bgLayerXepBai.opacity = 200;
        t.layerXepBai.opacity = 255;
      })));
      if (this.isNewXepBaiCurrenting && h.default.getInstance().IsMauBinhFistTimeShowQuickGuide && !this.isClickedXepXong) {
        this.quickGuide.show(this);
      }
      this.btnXepLai.node.active = false;
      this.btnXepXong.interactable = true;
      this.isPlaying = true;
      this.updateTextBinh();
      this.btnBaoBinh.interactable = true;
      if (this.tuChoiGame) {
        this.node.runAction(cc.sequence(cc.delayTime(.3), cc.callFunc(function() {
          if (t.btnXepXong.interactable) {
            if (t.btnBaoBinh.node.active) {
              t.onClickBaoBinh();
            } else {
              t.onClickTuSapBai();
            }
          }
        }), cc.delayTime(.1), cc.callFunc(function() {
          if (t.btnXepXong.interactable) {
            if (t.btnBaoBinh.node.active) {
              t.onClickBaoBinh();
            } else {
              t.onXepXong();
            }
          }
        })));
      }
    };
    e.prototype.xepLaiResponse = function(t) {
      var e = this;
      if (this.showUINewXepBai(), 0 === t.localeCompare(h.default.getInstance().userID)) {
        if (this.btnXepLai.node.active = false, this.isPlaying = true, this.isClickedXepXong) {
          for (var i = 0; i < 13; ++i) {
            var n = this._thisPlayerView.cards[i];
            n.node.active = true;
            n.node.runAction(cc.scaleTo(.2, n.getScaleWithType(f.default.TypeBIG)));
            n.node.runAction(cc.moveTo(.2, this.getPlayerCardPositionMineBig(this._thisPlayerView.indexPos, i)));
          }
        }
        this._thisPlayerView.cards[12].node.runAction(cc.sequence(cc.delayTime(.2), cc.callFunc(function() {
          e.xepLaiMovingDone();
        })));
      } else {
        var o = this.getPlayer(t);
        if (o) {
          o.runViewAction();
        }
      }
    };
    e.prototype.sapXepBai = function() {
      for (var t = [], e = [], i = [], n = [], o = 1, a = 0; a < 13; ++a) {
        var s = this._thisPlayerView.cards[a];
        if (1 === o) {
          t.push(s);
        } else {
          if (2 === o) {
            e.push(s);
          } else {
            if (3 === o) {
              i.push(s);
            }
          }
        }
        if (!(2 !== a && 7 !== a)) {
          o++;
        }
        n.push(s.serverCode);
      }
      b.default.getInstance().SapXepBaiTheoChi(t);
      b.default.getInstance().SapXepBaiTheoChi(e);
      b.default.getInstance().SapXepBaiTheoChi(i);
      this._thisPlayerView.cards = [];
      for (a = 0; a < t.length; ++a) {
        (s = t[a]).index = this._thisPlayerView.cards.length;
        this._thisPlayerView.cards.push(s);
      }
      for (a = 0; a < e.length; ++a) {
        (s = e[a]).index = this._thisPlayerView.cards.length;
        this._thisPlayerView.cards.push(s);
      }
      for (a = 0; a < i.length; ++a) {
        (s = i[a]).index = this._thisPlayerView.cards.length;
        this._thisPlayerView.cards.push(s);
      }
      var r = [];
      for (a = 0; a < 13; ++a) {
        (s = this._thisPlayerView.cards[a]).node.zIndex = g.default.MIDDLE_TOP_2 + a + 1;
        s.node.stopAllActions();
        if (this.emptyNodeContainer.active) {
          s.node.runAction(cc.moveTo(.2, this.lsEmptyCardSortIndex[12 - a].getPosition()));
        } else {
          s.node.runAction(cc.moveTo(.2, this.getPlayerCardPositionMineBig(0, a)));
        }
        r.push(s.serverCode);
      }
      for (a = 0; a < 13; ++a) {
        if (r[a] !== n[a]) {
          return true;
        }
      }
      return false;
    };
    e.prototype.countDown = function(t) {
      this.nextTimeSendUpdateBai = t > 10 ? t - 10 : -1;
      this.remainingTime = t;
      this.currentCountDownTime = t;
      this.progressXapBai.node.active = true;
      this.progressXapBai.setProgress(t / 60);
      this.progressXapBai.RunActionProgress(t, 0);
      this.isRuningUpdate = true;
      this.labelCountTime.string = Math.ceil(this.remainingTime).toString();
      this.remainingTimeInTimeStamp = new Date().getTime();
      this.remainingTimeStart = t;
    };
    e.prototype.stopCountDown = function() {
      this.isRuningUpdate = false;
    };
    e.prototype.update = function(t) {
      if (this.isRuningUpdate) {
        if (this.remainingTime -= t, this.isInBgMode && (this.remainingTime = this.remainingTimeStart - (Date.now() - this
            .remainingTimeInTimeStamp) / 1e3), this.remainingTime > 0) {
          var e = Math.ceil(this.remainingTime);
          if (e !== this.currentCountDownTime) {
            this.labelCountTime.string = e.toString();
            if (e <= 5 && this.currentCountDownTime >= 5) {
              d.default.getInstance().stopEffect("Sounds/sfx_count_down_time");
            }
            this.currentCountDownTime = e;
          }
        }
        if (this.remainingTime < this.timeAutoSendData && this.layerXepBai.active && 0 === this.layerXepBai.getNumberOfRunningActions()) {
          this.onXepXong();
          this.btnXepLai.node.active = false;
          this.isPlaying = false;
          this.stopCountDown();
        } else {
          if (this.nextTimeSendUpdateBai > 0 && this.remainingTime < this.nextTimeSendUpdateBai) {
            this.nextTimeSendUpdateBai -= 5;
            this.sendUpdateBai();
          }
        }
      }
    };
    e.prototype.finishThisGame = function(t, e) {
      var i = this;
      if (void 0 === e) {
        e = false;
      }
      if (this.isShowingQuickGuide) {
        this.quickGuide.hide();
      }
      this.layerXepBai.stopAllActions();
      this.layerXepBai.opacity = 0;
      this.layerXepBai.active = false;
      if (this._dangKetThuc = true, !this._dangPhatBai) {
        for (var n = 0; n < this.players.length; n++) {
          for (var o = (m = this.players[n]).isMine(), a = 0; a < m.cards.length; a++) {
            (v = m.cards[a]).node.stopAllActions();
            if (o) {
              v.node.zIndex = g.default.MIDDLE_TOP_2 + a + 1;
            }
          }
        }
      }
      this.stopCountDown();
      this.btnXepLai.node.active = false;
      this.daBaoBinh = false;
      this.isPlaying = false;
      this.progressXapBai.node.active = false;
      for (var s = t.hb, r = t.hsc, c = t.hsh, l = t.hsl, u = t.ps, d = false, p = 0; p < u.length; p++) {
        if (0 === h.default.getInstance().userID.localeCompare(u[p].uid)) {
          d = true;
        }
      }
      if (false !== d) {
        for (n = 0; n < u.length; n++) {
          var m,
            y = u[n],
            S = y.uid;
          if (null !== (m = this.getPlayer(S)) && void 0 !== m) {
            m.isReady = false;
            m.mauBinhSoBai = false;
            m.stopViewAction();
            var _ = y.cs;
            if (m.isMine()) {
              for (a = 0; a < _.length; a++) {
                b = _[a];
                (v = m.cards[_.length - a - 1]).index = _.length - a - 1;
                v.setTextureWithCode(b, h.default.getInstance().gameID);
              }
            } else {
              for (var a = 0; a < _.length && a < m.cards.length; a++) {
                var v,
                  b = _[a];
                (v = m.cards[a]).node.active = false;
                if (false === this.isGameAnDanhCheck) {
                  v.setTextureWithCode(b, h.default.getInstance().gameID);
                }
                v.setType(f.default.TypeMEDIUM);
              }
            }
            var C = y.mX;
            m._winnings = C;
            C;
            var T = y.m;
            m._money = T;
            var E = y.psl;
            m.pointSapLang = E;
            var I = y.psh;
            m.pointSapHam = I;
            var A = y.rp;
            m.pointSoBinh = A;
            var P = y.tp;
            m.totalPoint = P;
            var M = -1;
            if (void 0 !== y.rr && null !== y.rr) {
              if (1 === (M = parseInt(y.rr))) {
                m.binhLung = true;
              } else {
                m.binhLung = false;
                m.mauBinh = true;
                m.binhPoint = M;
              }
              if (y.hsc && r) {
                this.playersSoChi.push(m);
              }
              this.showSpecialChi(m);
            } else {
              if (r) {
                this.playersSoChi.push(m);
              }
            }
            var O = y.gr,
              N = [];
            for (a = 0; a < O.length; a++) {
              for (var B = O[a], D = [], R = 0; R < B.length; R++) {
                var L = B[R],
                  w = L.sc,
                  k = L.uid;
                if (void 0 == w) {
                  w = 0;
                }
                if (void 0 == k) {
                  k = "";
                }
                var G = {
                  sc: w,
                  uid: k
                };
                D.push(G);
              }
              N.push(D);
            }
            m.soChiResult = [];
            m.soChiResult = N;
          }
        }
        this.playersSoChi.sort(function(t, e) {
          return t.indexPos > e.indexPos ? -1 : t.indexPos < e.indexPos ? 1 : 0;
        });
        var x = .8 * (this.playersSoChi.length - 1) + 2,
          F = null,
          U = null,
          H = null,
          W = null;
        if (r) {
          if (e) {
            var V = 3 * x + 9;
            if (c) {
              V += 3;
            }
            if (l) {
              V += 3;
            }
            if (s) {
              V += 3;
            }
            V += 4;
            F = this.remainingTime < V - 3 * x ? cc.callFunc(this.showAllCard, this) : this.remainingTime < V - 2 * x ? cc.sequence(cc
              .callFunc(this.hideAllCard, this), cc.callFunc(this.showChi1, this), cc.delayTime(x), cc.callFunc(this.showResultForChi,
                this, 1), cc.delayTime(3)) : this.remainingTime < V - 1 * x ? cc.sequence(cc.callFunc(this.hideAllCard, this), cc
              .callFunc(this.showChi2, this), cc.delayTime(x), cc.callFunc(this.showResultForChi, this, 2), cc.delayTime(3), cc
              .callFunc(this.hideAllCard, this), cc.callFunc(this.showChi1, this), cc.delayTime(x), cc.callFunc(this.showResultForChi,
                this, 1), cc.delayTime(3)) : cc.sequence(cc.callFunc(this.hideAllCard, this), cc.callFunc(this.showChi3, this), cc
              .delayTime(x), cc.callFunc(this.showResultForChi, this, 3), cc.delayTime(3), cc.callFunc(this.hideAllCard, this), cc
              .callFunc(this.showChi2, this), cc.delayTime(x), cc.callFunc(this.showResultForChi, this, 2), cc.delayTime(3), cc
              .callFunc(this.hideAllCard, this), cc.callFunc(this.showChi1, this), cc.delayTime(x), cc.callFunc(this.showResultForChi,
                this, 1), cc.delayTime(3));
          } else {
            F = cc.sequence(cc.callFunc(this.hideAllCard, this), cc.callFunc(this.showChi3, this), cc.delayTime(x), cc.callFunc(this
                .showResultForChi, this, 3), cc.delayTime(3), cc.callFunc(this.hideAllCard, this), cc.callFunc(this.showChi2, this), cc
              .delayTime(x), cc.callFunc(this.showResultForChi, this, 2), cc.delayTime(3), cc.callFunc(this.hideAllCard, this), cc
              .callFunc(this.showChi1, this), cc.delayTime(x), cc.callFunc(this.showResultForChi, this, 1), cc.delayTime(3));
          }
        } else {
          F = cc.callFunc(this.showAllCard, this);
        }
        if (c) {
          if (e) {
            V = 3;
            if (l) {
              V += 3;
            }
            if (s) {
              V += 3;
            }
            V += 4;
            U = (this.remainingTime, cc.sequence(cc.callFunc(this.showAllCard, this), cc.callFunc(this.showResult, this, 2), cc.delayTime(
              3)));
          } else {
            U = cc.sequence(cc.callFunc(this.showAllCard, this), cc.callFunc(this.showResult, this, 2), cc.delayTime(3));
          }
        } else {
          U = cc.callFunc(this.showAllCard, this);
        }
        if (l) {
          if (e) {
            V = 3;
            if (s) {
              V += 3;
            }
            V += 4;
            H = this.remainingTime < V - 3 ? cc.callFunc(this.showAllCard, this) : cc.sequence(cc.callFunc(this.showAllCard, this), cc
              .callFunc(this.showResult, this, 3), cc.delayTime(3));
          } else {
            H = cc.sequence(cc.callFunc(this.showAllCard, this), cc.callFunc(this.showResult, this, 3), cc.delayTime(3));
          }
        } else {
          H = cc.callFunc(this.showAllCard, this);
        }
        if (s) {
          if (this.players.forEach(function(t) {
              if (t.binhLung || t.mauBinh) {
                i.showSpecialChi(m);
              }
            }), e) {
            V = 3;
            V += 4;
            W = this.remainingTime < V - 3 ? cc.callFunc(this.showAllCard, this) : cc.sequence(cc.callFunc(this.showAllCard, this), cc
              .callFunc(this.showResult, this, 4), cc.delayTime(3));
          } else {
            W = cc.sequence(cc.callFunc(this.showAllCard, this), cc.callFunc(this.showResult, this, 4), cc.delayTime(3));
          }
        } else {
          W = cc.callFunc(this.showAllCard, this);
        }
        var j = cc.sequence(F, U, H, W, cc.callFunc(this.showResult, this, 1), cc.delayTime(3), cc.callFunc(this.showResultTable, this),
          cc.delayTime(1), cc.callFunc(this.handlePendingPlayers, this));
        this.node.runAction(j);
        this.onEndGame();
      } else {
        this.finishThisGameForAnDanh(t, e);
      }
    };
    e.prototype.showSpecialChi = function(t) {
      for (var e = 0; e < t.cards.length; ++e) {
        var i = t.cards[e];
        i.node.stopAllActions();
        i.setType(f.default.TypeMEDIUM);
        i.node.position = this.getPlayerCardPosition(t.indexPos, e, this.distanceCard);
        if (t.binhLung) {
          i.setColor(cc.Color.GRAY);
        }
        i.node.active = true;
      }
      var n = null;
      if (t.binhLung) {
        n = this.prefabBinhLung;
      } else {
        switch (d.default.getInstance().playEffect("Sounds/maubinh"), t.binhPoint) {
          case 2:
            n = this.prefab3Sanh;
            break;
          case 3:
            n = this.prefab3Thung;
            break;
          case 4:
            n = this.prefab6Doi;
            break;
          case 5:
            n = this.prefab5doi1Xam;
            break;
          case 8:
          case 9:
            n = this.prefabDongHoa;
            break;
          case 10:
            n = this.prefabSanhRong;
            break;
          case 11:
            n = this.prefabSanhRongDongHoa;
        }
      }
      if (null !== n && void 0 !== n && false === this.isGameAnDanhCheck) {
        var o = cc.instantiate(n);
        o.parent = this.node;
        o.zIndex = g.default.CHAT_BUBLES;
        o.position = t.node.position;
        this.listEffect.push(o);
      }
    };
    e.prototype.showAllCard = function() {
      for (var t = 0; t < this.playersPlaying.length; t++) {
        for (var e = this.playersPlaying[t], i = 0; i < e.cards.length; i++) {
          var n = e.cards[i];
          n.node.stopAllActions();
          n.setType(f.default.TypeMEDIUM);
          if (e.binhLung) {
            n.setColor(cc.Color.GRAY);
          } else {
            n.setColor(cc.Color.WHITE);
          }
          n.node.active = true;
          n.node.position = this.getPlayerCardPosition(e.indexPos, i, this.distanceCard);
        }
      }
    };
    e.prototype.hideAllCard = function() {
      for (var t = 0; t < this.players.length; t++) {
        var e = this.players[t];
        if (!e.binhLung && !e.mauBinh) {
          e.currentTotalPoint = 0;
          for (var i = 0; i < e.cards.length; i++) {
            var n = e.cards[i];
            n.node.active = false;
            n.setColor(cc.Color.WHITE);
            n.node.stopAllActions();
          }
        }
      }
    };
    e.prototype.showChi = function(t, e) {
      if (this.isShowingQuickGuide) {
        this.quickGuide.hide();
      }
      var i = t + e,
        n = 13 - e - t,
        o = new cc.Vec2(.7 * this.cardSizeBig.x, .5 * this.cardSizeBig.y),
        a = new cc.Vec2(.7 * this.cardSizeMedium.x, .5 * this.cardSizeMedium.y),
        s = Math.ceil(t / 5);
      this.removeEffect();
      for (var r = 0; r < this.playersSoChi.length; ++r) {
        var c = this.playersSoChi[r];
        c.removeBubbleFx();
        c.currentTotalPoint = 0;
        for (var l = c.soChiResult[s], u = 0; u < l.length; u++) {
          var d = l[u].sc;
          c.currentTotalPoint += d;
        }
        if (!c.binhLung) {
          var p = this.listPlayerCardPosSoChi[c.indexPos].position,
            m = null;
          m = this.prefabMauThau;
          var y = [],
            S = new cc.Vec2(p.x - Math.floor(e / 2) * a.x, p.y + 85),
            _ = .8 * r + .2;
          if (c.isMine()) {
            _ = 0;
            S = new cc.Vec2(p.x - (2 === s ? 3 : 2) * o.x, p.y + .5 * this.cardSizeBig.y + 37);
            for (u = n; u < n + e; ++u) {
              var v = c.cards[u];
              y.push(v);
              v.node.active = true;
              v.setType(f.default.TypeBIG);
              v.node.position = this.getPlayerCardPositionSoCHi(c.indexPos, u, o);
            }
          } else {
            for (u = t; u < i; ++u) {
              v = c.cards[u];
              y.push(v);
              v.node.active = true;
              v.setType(f.default.TypeMEDIUM);
              if (false === this.isGameAnDanhCheck) {
                v.setTextureWithCode(v.serverCode, h.default.getInstance().gameID);
              }
              v.node.position = this.getPlayerCardPositionSoCHi(c.indexPos, u, a);
              v.node.eulerAngles = new cc.Vec3(0, 180, 0);
              v.Rotationby(.8 * r, .27, 180);
            }
          }
          var C = b.default.getInstance().getMark(y);
          if (C > 544 ? m = this.prefabThungPhaSanh : C > 476 ? m = this.prefabTuQuy : C > 408 ? m = this.prefabCuLu : C > 340 ? m = this
            .prefabThung : C > 272 ? m = this.prefabSanh : C > 204 ? m = this.prefabXamChi : C > 136 ? m = this.prefabThu : C > 68 && (m =
              this.prefabDoi), c.binhLung && (m = null), null !== m && void 0 !== m && false === this.isGameAnDanhCheck) {
            var T = cc.instantiate(m);
            T.parent = this.node;
            T.zIndex = g.default.MIDDLE;
            T.position = S;
            this.listEffectSoChi.push(T);
            T.active = false;
            this.node.runAction(cc.sequence(cc.delayTime(_), cc.callFunc(this.showThis, this, T)));
          }
        }
      }
      this.lbTinhChi.string = "CHI " + (s + 1);
      this.lbTinhChi.node.parent.active = true;
      this.lbTinhChi.node.parent.scale = .2;
      this.lbTinhChi.node.parent.runAction(cc.scaleTo(.2, 1));
    };
    e.prototype.showThis = function(t, e) {
      e.active = true;
    };
    e.prototype.showChi1 = function() {
      this.showChi(10, 3);
    };
    e.prototype.showChi2 = function() {
      this.showChi(5, 5);
    };
    e.prototype.showChi3 = function() {
      this.showChi(0, 5);
    };
    e.prototype.showResultForChi = function(t, e) {
      this.node.runAction(cc.sequence(cc.delayTime(.2), cc.callFunc(function() {
        d.default.getInstance().playEffect("Sounds/sochi");
      })));
      this.removeEffect();
      for (var i = 0; i < this.playersSoChi.length; ++i) {
        var n = this.playersSoChi[i];
        n.removeBubbleFx();
        var o = n.isMine();
        if (!(n.mauBinh || o && this.state === l.GameState.VIEWING)) {
          var a,
            s = n.currentTotalPoint,
            r = "";
          if (s > 0) {
            r = "+";
            a = 3;
          } else {
            if (0 === s) {
              r = "+";
              a = 2;
            } else {
              r = "-";
              a = 1;
            }
          }
          r += Math.abs(s).toString();
          r += " Chi";
          var c = false;
          if (!(0 !== n.indexPos && 3 !== n.indexPos)) {
            c = true;
          }
          if (false === this.isGameAnDanhCheck) {
            if (!(n.binhLung && 0 == s)) {
              n.showBubbleFx(r, a, true, c);
            }
          }
          for (var u = 0; u < n.cards.length; ++u) {
            if (!n.binhLung) {
              var p = n.cards[u],
                g = u;
              if (o) {
                g = 12 - u;
              }
              var m = 3 - Math.floor(g / 5);
              p.node.active = true;
              if (m == e) {
                p.setTextureWithCode(p.serverCode, h.default.getInstance().gameID);
              }
              p.node.runAction(cc.moveTo(.2, this.getPlayerCardPosition(n.indexPos, u, this.distanceCard)));
              if (o) {
                p.node.runAction(cc.scaleTo(.2, p.getScaleWithType(f.default.TypeMEDIUM)));
                if (m !== e) {
                  p.node.opacity = 0;
                  p.node.runAction(cc.sequence(cc.delayTime(.2), cc.callFunc(this.setGrayColorThisCard, this, p)));
                }
              } else {
                if (m < e) {
                  p.node.opacity = 0;
                  p.node.runAction(cc.sequence(cc.delayTime(.2), cc.callFunc(this.setHidenThisCard, this, p)));
                } else {
                  if (m > e) {
                    p.node.opacity = 0;
                    p.node.runAction(cc.sequence(cc.delayTime(.2), cc.callFunc(this.setGrayColorThisCard, this, p)));
                  }
                }
              }
            }
          }
        }
      }
    };
    e.prototype.setGrayColorThisCard = function(t, e) {
      e.setColor(cc.Color.GRAY);
      e.node.active = true;
      e.node.opacity = 255;
    };
    e.prototype.setHidenThisCard = function(t, e) {
      e.setColor(cc.Color.WHITE);
      e.setType(f.default.TypeHIDE);
      e.node.active = true;
      e.node.opacity = 255;
    };
    e.prototype.removeEffect = function() {
      this.listEffectSoChi.forEach(function(t) {
        t.removeFromParent(true);
      });
      this.listEffectSoChi = [];
    };
    e.prototype.showResult = function(t, e) {
      if (this.isShowingQuickGuide) {
        this.quickGuide.hide();
      }
      this.node.runAction(cc.sequence(cc.delayTime(.2), cc.callFunc(function() {
        d.default.getInstance().playEffect("Sounds/sochi");
      })));
      this.removeEffect();
      if (1 === e) {
        this.lbTinhChi.string = "K\u1ebft Qu\u1ea3";
      } else {
        if (2 === e) {
          this.lbTinhChi.string = "So S\u1eadp H\u1ea7m";
        } else {
          if (3 === e) {
            this.lbTinhChi.string = "So S\u1eadp L\xe0ng";
          } else {
            if (4 === e) {
              this.lbTinhChi.string = "So Binh";
            }
          }
        }
      }
      this.lbTinhChi.node.parent.scale = .2;
      this.lbTinhChi.node.parent.runAction(cc.scaleTo(.2, 1));
      for (var i = 0; i < this.playersPlaying.length; ++i) {
        var n = this.playersPlaying[i];
        if (n.removeBubbleFx(), !n.isMine() || this.state !== l.GameState.VIEWING) {
          var o = null;
          if (2 === e && (n.pointSapHam > 0 ? o = this.prefabThangSapHam : n.pointSapHam < 0 && (o = this.prefabThuaSapHam)), 3 === e && (
              n.pointSapLang > 0 ? o = this.prefabThangSaplang : n.pointSapLang < 0 && (o = this.prefabThuaSapLang)), null !== o &&
            void 0 !== o && false === this.isGameAnDanhCheck) {
            var a = cc.instantiate(o);
            a.parent = this.node;
            a.position = n.node.position;
            a.zIndex = n.node.zIndex + 1;
            a.scale = n.node.scale;
            this.listEffectSoChi.push(a);
          }
          var s = n.totalPoint;
          if (1 === e) {
            s = n.totalPoint;
          } else {
            if (2 === e) {
              s = n.pointSapHam;
            } else {
              if (3 === e) {
                s = n.pointSapLang;
              } else {
                if (4 === e) {
                  s = n.pointSoBinh;
                }
              }
            }
          }
          var r = "",
            c = -1;
          if (s > 0) {
            r = "+";
            c = 3;
          } else {
            if (0 == s) {
              r = "+";
              c = 2;
            } else {
              r = "-";
              c = 1;
            }
          }
          r += _.default.formatMoneyNumber(Math.abs(s));
          r += " Chi";
          var h = false;
          if (!(0 !== n.indexPos && 3 !== n.indexPos)) {
            h = true;
          }
          if (false === this.isGameAnDanhCheck) {
            if (!(n.binhLung && 0 == s)) {
              n.showBubbleFx(r, c, true, h);
            }
          }
        }
      }
    };
    e.prototype.showResultTable = function() {
      this.removeEffect();
      d.default.getInstance().playEffect("Sounds/finished");
      this.updateReadyStatus();
      for (var t = 0; t < this.players.length; ++t) {
        var e = this.players[t];
        if (e.removeBubbleFx(), this.state === l.GameState.VIEWING && e.isMine()) {
          e.mauBinhSoBai = false;
        } else {
          for (var i = 0; i < e.cards.length; ++i) {
            e.cards[i].node.active = false;
          }
          e.setMoney(e._money);
          if (false === this.isGameAnDanhCheck) {
            e.showMoneyFxForPlayer(e._winnings, 3.5);
            if (e._winnings > 0) {
              e.runWinAction(3.5);
            }
          }
          e.binhLung = false;
          e.mauBinh = false;
          e._winnings = 0;
        }
      }
      if (this._thisPlayerView._money < 10 * this.bet) {
        this.state = l.GameState.WAITING;
        return void this.node.stopAllActions();
      }
    };
    e.prototype.handlePendingPlayers = function() {
      if (t.prototype.handlePendingPlayers.call(this), this._forcedQuit) {
        this.onLogOut();
      } else if (this._forcedToLeaveRoom) {
        this.handleLeaveRoomResponse();
      } else {
        if (h.default.getInstance().checkBaoTriGame()) {
          this.state = l.GameState.WAITING;
          return void this.sendLeaveRoom();
        }
        if (this.lbTinhChi.node.parent.stopAllActions(), this.lbTinhChi.node.parent.active = false, this.players.forEach(function(t) {
            t.resetDefaultValueForMauBinh();
          }), this.removeEffect(), this.listEffect.forEach(function(t) {
            t.removeFromParent(true);
          }), this.listEffect = [], this.playersSoChi = [], this._subscribedToGetOut) {
          this.state = l.GameState.WAITING;
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
        this.state = l.GameState.WAITING;
        this.removePendingPlayers();
        this.updateReadyStatus();
        for (var e = 0; e < this.players.length; e++) {
          var i = this.players[e];
          i.stopViewAction();
          i._latBai = false;
          i.cards.forEach(function(t) {
            t.node.active = false;
            t.setColor(cc.Color.WHITE);
            t.stopSparkling();
          });
        }
        this.showHideuserAnDanh4(false);
      }
    };
    e.prototype.initPlayerCardsViewing = function() {
      for (var t = 0 === this.playersPlaying.length, e = 0; e < this.players.length; ++e) {
        var i = this.players[e];
        if (i.isMine() || 2 !== i.state && 3 !== i.state) {
          if (t && i.isMine() && (2 === i.state || 3 === i.state)) {
            this.playersPlaying.push(i);
          }
          if (0 === i.state) {
            i.runViewAction();
          }
        } else {
          for (var n = 0; n < i.cards.length; ++n) {
            var o = i.cards[n];
            o.node.active = true;
            o.node.position = this.getPlayerCardPosition(i.indexPos, n, this.distanceCard);
          }
          if (2 === i.state) {
            i.runViewAction();
          }
          if (t) {
            this.playersPlaying.push(i);
          }
        }
      }
    };
    e.prototype.showViewTableMessage = function() {
      this.node.runAction(cc.sequence(cc.delayTime(.7), cc.callFunc(function() {
        v.default.getInstance().showPopupMessageUtil("B\xe0n \u0111ang ch\u01a1i, xin vui l\xf2ng ch\u1edd!");
      })));
    };
    e.prototype.getPlayerCardPositionMineBig = function(t, e) {
      var i = this.listPlayerCardPos[t].position;
      e = 12 - e;
      var n = 0;
      if (2 === Math.floor(e / 5)) {
        n = 1.1 * -this.cardSizeBig.x * 2;
      }
      var o = i.x - e % 5 * this.cardSizeBig.x * 1.1,
        a = i.y + Math.floor(e / 5) * this.cardSizeBig.y * 1.05;
      return new cc.Vec2(o + n, a);
    };
    e.prototype.getPlayerCardPosition = function(t, e, i) {
      var n = this.listPlayerCardPos[t].position,
        o = 0;
      if (0 === t) {
        n = this.playerCardPosWhenDone.position;
        e = 12 - e;
        if (2 === Math.floor(e / 5)) {
          o = 2 * -i.x;
        }
      }
      var a = n.x - e % 5 * i.x,
        s = n.y + Math.floor(e / 5) * i.y;
      return new cc.Vec2(a + o, s);
    };
    e.prototype.getPlayerCardPositionSoCHi = function(t, e, i) {
      var n = this.listPlayerCardPosSoChi[t].position,
        o = 0;
      if (0 === t) {
        e = 12 - e;
        if (2 === Math.floor(e / 5)) {
          o = 2 * -i.x;
        }
      }
      var a = n.x - e % 5 * i.x,
        s = n.y;
      return new cc.Vec2(a + o, s);
    };
    e.prototype.getNameGame = function() {
      return "M\u1eacU BINH";
    };
    e.prototype.getListChatDefaultText = function() {
      return ["Binh kh\xf4ng c\u1ea7n suy ngh\u0129", "S\u1eadp ch\u1ebft c\xe1c ch\xfa", "C\xf9 l\u0169 t\xe0ng h\xecnh r\u1ed3i",
        "T\xe8n t\xe9n t\xe8n tennnnnn", "B\xe0i n\xe0y b\xe1n nh\xe0 lu\xf4n", "Toang r\u1ed3i \xd4ng Gi\xe1o \u1ea1!",
        "Th\xf9ng ph\xe1 s\u1ea3nh NH\u1ece th\xf4i m\xe0", "V\u1eady m\xe0 n\xf3 m\xe9o S\u1eadp",
        "Chi cu\u1ed1i c\u1ee9u c\u1ea3 L\xe0ng", "Suy ngh\u0129 l\xe2u nh\u1ec9", "S\u1eadp ch\u1ebft c\xe1c ch\xfa",
        "B\xe0i th\u1ebf n\xe0y th\xec ch\u1ecbu", "M\u1ea5y ch\xfa c\xf2n non v\xe0 xanh l\u1eafm.",
        "H\xf4m nay kh\xf4ng may r\u1ed3i", "Chia b\xe0i \u0111en th\u1ebf", "B\xe0i \u0111\u1eb9p v\xf4 \u0111\u1ed1i",
        "X\u1ebfp b\xe0i \u0111\xfang ngu", "X\u1ebfp \u0111\u1ec9nh v\xe3i"
      ];
    };
    e.prototype.setGameConfig = function(e, i, n, o, a, s) {
      t.prototype.setGameConfig.call(this, e, i, n, o, a, s);
      this.btnTuSapXep.active = e <= 110;
    };
    e.prototype.onFocus = function(e) {
      t.prototype.onFocus.call(this, e);
      this.timeAutoSendData = this.timeAutoSendDataDefault;
    };
    e.prototype.onLostFocus = function() {
      t.prototype.onLostFocus.call(this);
      this.timeAutoSendData = 1.5 * this.timeAutoSendDataDefault;
      if (this.layerXepBai.active && 0 === this.layerXepBai.getNumberOfRunningActions()) {
        this.sendUpdateBai();
      }
    };
    e.prototype.setMiniGameNode = function() {
      if (null !== T.default.instance && void 0 !== T.default.instance && null !== T.default.instance.mainNode && void 0 !== T.default
        .instance.mainNode) {
        T.default.instance.mainNode.x = this.progressXapBai.node.x + 150 + this.layerXepBai.width / 2;
        T.default.instance.mainNode.y = this.listBtnInvitePos[0].y - 10 + this.layerXepBai.height / 2;
        T.default.instance.btnButtonIcon.position = T.default.instance.mainNode.position;
      }
    };
    e.prototype.showPlayerViewBauCua = function(t, e) {
      if (t.node.active !== e && this.state !== l.GameState.PLAYING) {
        t.node.active = e;
      }
    };
    e.prototype.onUserJoinTable = function(e) {
      t.prototype.onUserJoinTable.call(this, e);
    };
    e.prototype.finishThisGameForAnDanh = function(t, e) {
      if (void 0 === e) {
        e = false;
      }
      t.hb;
      var i = t.hsc,
        n = (t.hsh, t.hsl, 0);
      if (i) {
        n += 8;
      }
      var o = cc.sequence(cc.delayTime(_.default.getRandomInt(200) / 100 + 3 + n), cc.callFunc(this.handlePendingPlayers, this));
      this.node.runAction(o);
    };
    e.prototype.showUINewXepBai = function() {
      if (this.isNewXepBaiCurrenting && !this.isClickedXepXong) {
        this.emptyNodeContainer.active = true;
        this.listPlayerXepBaiLabel[0].node.y = 263;
        this.listPlayerXepBaiLabel[1].node.y = 103;
        this.listPlayerXepBaiLabel[2].node.y = -58;
      } else {
        this.emptyNodeContainer.active = false;
        this.listPlayerXepBaiLabel[0].node.y = 151;
        this.listPlayerXepBaiLabel[1].node.y = -9;
        this.listPlayerXepBaiLabel[2].node.y = -170;
      }
    };
    e.prototype.getNextEmptyCard = function(t) {
      for (var e = 0; e < this.lsEmptyCard.length; e++) {
        if (this.lsEmptyCard[e].IsEmpty) {
          return this.lsEmptyCard[e];
        }
      }
      return null;
    };
    e.prototype.isNoEmptyCard = function() {
      for (var t = 0; t < this.lsEmptyCard.length; t++) {
        if (this.lsEmptyCard[t].IsEmpty) {
          return false;
        }
      }
      if (this.isShowingQuickGuide) {
        this.quickGuide.hide();
      }
      return true;
    };
    e.prototype.isNeedSortBottom = function() {
      for (var t = 0, e = 0; e < this.lsEmptyCard.length; e++) {
        if (this.lsEmptyCard[e].IsEmpty) {
          t++;
        }
      }
      return t >= 2;
    };
    e.prototype.resetNewSort = function() {
      this.mauBinhXapBai.newSessionReset();
      this.analyticNewSort.reset();
      this.currentSortBottomType = r.RANDOM;
      this.countEmptyCard = 0;
      this.lsBottomCard = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      for (var t = 0; t < this.lsEmptyCard.length; t++) {
        this.lsEmptyCard[t].clearCardChild();
        this.lsEmptyCard[t].setColor(cc.Color.WHITE);
      }
    };
    e.prototype.sortBottomCard = function() {
      if (this.isDealNewCardDone) {
        for (var t = [], e = 0; e < this._thisPlayerView.cards.length; e++) {
          var i = this._thisPlayerView.cards[e];
          if (i.isInBottomMauBinh) {
            t.push(i);
          }
        }
        switch (this.currentSortBottomType) {
          case r.RANDOM:
          case r.SUIT:
            this.currentSortBottomType = r.RANK;
            b.default.getInstance().sortVectorReverse(t, false);
            break;
          case r.RANK:
            this.currentSortBottomType = r.SUIT;
            b.default.getInstance().sortVector2(t, false);
        }
        for (e = 0; e < t.length; e++) {
          t[e].node.zIndex = g.default.MIDDLE_TOP_2 + Math.floor(t.length / 2) + e;
          this.moveCardBottom(t[e].node, e, t.length);
        }
        if (t.length > 1) {
          this.sortBottomByX();
        }
        if (this.isShowingQuickGuide) {
          this.quickGuide.onClickSortBottomStep();
        }
      }
    };
    e.prototype.moveCardBottom = function(t, e, i) {
      var n = -Math.floor(i / 2) * (this.cardWidth + this.distanceCardOffset) / 2 + e * (this.cardWidth + this.distanceCardOffset) / 2,
        o = cc.moveTo(.1, new cc.Vec2(n, t.position.y)).easing(cc.easeSineOut());
      t.stopAllActions();
      t.runAction(o);
    };
    e.prototype.sortBottomByX = function() {
      return a(this, void 0, void 0, function() {
        return s(this, function(t) {
          switch (t.label) {
            case 0:
              return [4, I.delay(100.05)];
            case 1:
              return t.sent(), this._thisPlayerView.cards.sort(function(t, e) {
                return t.isInBottomMauBinh !== e.isInBottomMauBinh ? e.isInBottomMauBinh ? 1 : -1 : t.isInBottomMauBinh ? t
                  .node.position.x - e.node.position.x : 0;
              }), [2];
          }
        });
      });
    };
    e.prototype.onClickedResetFirstTimeNewSort = function() {
      M.default.getInstance().sendSettingRoom(h.default.getInstance().IsMauBinhUsingNewXepBai, true, true);
      v.default.getInstance().showPopupMessageUtil("Reset r\u1ed3i nha!");
    };
    e.prototype.countAnalyticSort = function() {
      this.analyticNewSort.count(this.currentSortBottomType);
    };
    o([R([cc.Node])], e.prototype, "listPlayerCardPos", void 0);
    o([R([cc.Node])], e.prototype, "listPlayerCardPosSoChi", void 0);
    o([R(cc.Node)], e.prototype, "playerCardPosWhenDone", void 0);
    o([R(cc.Node)], e.prototype, "layerXepBai", void 0);
    o([R(cc.Node)], e.prototype, "bgLayerXepBai", void 0);
    o([R(S.default)], e.prototype, "mauBinhXapBai", void 0);
    o([R(cc.Button)], e.prototype, "btnXepLai", void 0);
    o([R(cc.Button)], e.prototype, "btnXepXong", void 0);
    o([R(cc.Button)], e.prototype, "btnBaoBinh", void 0);
    o([R(cc.Node)], e.prototype, "btnTuSapXep", void 0);
    o([R(m.default)], e.prototype, "progressXapBai", void 0);
    o([R(cc.Label)], e.prototype, "labelCountTime", void 0);
    o([R([cc.Label])], e.prototype, "listPlayerXepBaiLabel", void 0);
    o([R(cc.Label)], e.prototype, "lbTinhChi", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabBinhLung", void 0);
    o([R(cc.Prefab)], e.prototype, "prefab3Sanh", void 0);
    o([R(cc.Prefab)], e.prototype, "prefab3Thung", void 0);
    o([R(cc.Prefab)], e.prototype, "prefab6Doi", void 0);
    o([R(cc.Prefab)], e.prototype, "prefab5doi1Xam", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabDongHoa", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabSanhRong", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabSanhRongDongHoa", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabMauThau", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabDoi", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabThu", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabXamChi", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabSanh", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabThung", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabCuLu", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabTuQuy", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabThungPhaSanh", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabThangSapHam", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabThangSaplang", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabThuaSapHam", void 0);
    o([R(cc.Prefab)], e.prototype, "prefabThuaSapLang", void 0);
    o([R(cc.Node)], e.prototype, "blockLayerXepBai", void 0);
    o([R(cc.Node)], e.prototype, "emptyNodeContainer", void 0);
    o([R([A.default])], e.prototype, "lsEmptyCard", void 0);
    o([R([A.default])], e.prototype, "lsEmptyCardSortIndex", void 0);
    o([R(P.default)], e.prototype, "quickGuide", void 0);
    o([R(cc.Node)], e.prototype, "chatLayer", void 0);
    o([R], e.prototype, "destinationY", void 0);
    o([R], e.prototype, "destinationTempY", void 0);
    o([R], e.prototype, "destinationRotationTemp", void 0);
    o([R], e.prototype, "destinationRotationFinal", void 0);
    o([R], e.prototype, "timeMoveTemp", void 0);
    o([R], e.prototype, "timeMoveFinal", void 0);
    o([R], e.prototype, "timeDelayBetweenCard", void 0);
    o([R], e.prototype, "distanceCardOffset", void 0);
    return e = o([D], e);
  }(c.default);
i.default = w;
void 0;
