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
var a,
  s,
  r = require("./GameBaseController"),
  c = require("./MessageCardGameHandler"),
  l = require("./TLMNRemakeMessage"),
  h = require("./GameCardSprite"),
  u = require("./CardSet"),
  d = require("./GameUtils"),
  p = require("./PoolManager"),
  f = require("./GamePlayManager"),
  g = require("./MoneyUI"),
  m = require("./StringUtil"),
  y = require("./GameZOrder"),
  S = require("./TLMNRemakeRequestHandler"),
  _ = require("./TLMNRemakeCardBlockHelper"),
  v = require("./TLMNRemakeRecommendCardsHelper"),
  b = require("./TLMNRemakeConstant"),
  C = require("./TLMNRemakeCardsTypeHelper"),
  T = require("./CommonPrefabsManager"),
  E = require("./TLMNRemakeCardLib"),
  I = require("./MusicPlayer"),
  A = require("./GameConfigManager"),
  P = require("./TienLenUtil"),
  M = require("./GameController"),
  O = require("./GameDefine"),
  N = require("./VersionController"),
  B = cc._decorator,
  D = B.ccclass,
  R = B.property;
(function(t) {
  t[t.CONG = 1] = "CONG";
  t[t.THOI = 2] = "THOI";
})(a = i.ETLMNRemakeLoseType || (i.ETLMNRemakeLoseType = {}));
(function(t) {
  t[t.DUTMU = 1] = "DUTMU";
})(i.ETLMNRemakeWinType || (i.ETLMNRemakeWinType = {}));
(function(t) {
  t[t.NONE = 0] = "NONE";
  t[t.DANH_BAI = 1] = "DANH_BAI";
  t[t.BO_LUOT = 2] = "BO_LUOT";
  t[t.DANG_CO_LUOT = 3] = "DANG_CO_LUOT";
})(s = i.ETLMNRemakePlayerState || (i.ETLMNRemakePlayerState = {}));
var L = function(t) {
  function e() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.prefabCardSet = null;
    e.background = null;
    e.listCardPositionUI = [];
    e.listBtnMain = null;
    e.btnBoLuot = null;
    e.btnDanhBai = null;
    e.prefabMoneyUI = null;
    e.skeletonEffect = null;
    e.nodeDanhBaiAction = null;
    e.isDealCard = false;
    e.anim2TuQuy = null;
    e.animTuQuy2 = null;
    e.animTuQuy3 = null;
    e.anim3DoiThong = null;
    e.anim3DoiThong3Bich = null;
    e.anim4DoiThong = null;
    e.anim4DoiThong3Bich = null;
    e.anim5DoiThong = null;
    e.anim6Doi = null;
    e.anim6DoiThong = null;
    e.animDongHoa = null;
    e.animSanhRong = null;
    e.animSanhRongDongHoa = null;
    e.animTuQuy = null;
    e.animNhat = null;
    e.animNhi = null;
    e.animBa = null;
    e.animBet = null;
    e.animThoi = null;
    e.animGietCong = null;
    e.animDutMu = null;
    e.myCardSet = null;
    e.mapOtherPlayerCardSet = null;
    e.poolCardSet = null;
    e.poolCard = null;
    e.smallCardScale = .6;
    e.isNewRound = false;
    e.listBoLuotPlayer = [];
    e.timeForTurn = 20;
    e.isReconnect = false;
    e.listCardSetOnTable = [];
    e.listOtherPlayerCard = [];
    e.playerPlaying = null;
    e.listRecommendCards = [];
    e.isMyTurn = false;
    e.listCardOnTable = [];
    e.numplayersPlaying = 0;
    e.indexChatHeo = 0;
    e.isEndGame = false;
    e.listInvitePos = [];
    e.listCardPos = [];
    return e;
  }
  n(e, t);
  e.prototype.initDefaultData = function() {
    t.prototype.initDefaultData.call(this);
    if (A.default.getInstance().isAnDanh) {
      this.isGameAnDanh = true;
      this.isGameAnDanhCheck = true;
    }
    this.showHideuserAnDanh4(false);
  };
  e.prototype.onLoad = function() {
    f.default.getInstance().gameID = c.GAME.TLMN;
    t.prototype.onLoad.call(this);
    this.myCardSet = cc.instantiate(this.prefabCardSet).getComponent(u.default);
    this.mapOtherPlayerCardSet = new d.MapString();
    this.poolCardSet = p.PoolManager.getInstance().addPool("poolCardSetTLMNRemake", new p.PoolComponent());
    this.poolCard = p.PoolManager.getInstance().addPool("poolCardTLMNRemake", new p.PoolComponent());
    this.myCardSet.node.parent = this.node;
    this.myCardSet.node.zIndex = y.default.TOP;
    this.myCardSet.node.anchorX = 0;
    this.myCardSet.node.position = new cc.Vec2(-cc.winSize.width / 2 + 250, this.listBtnInvitePos[0].y - 15);
    this.POS2 = [];
    this.POS2.push(0);
    this.POS2.push(2);
    this.POS3 = [];
    this.POS3.push(0);
    this.POS3.push(2);
    this.POS3.push(3);
    this.POS4 = [];
    this.POS4.push(0);
    this.POS4.push(1);
    this.POS4.push(2);
    this.POS4.push(3);
    this.listInvitePos = [];
    this.listInvitePos.push(this.inviteBtns[0].position);
    this.listInvitePos.push(this.inviteBtns[1].position);
    this.listInvitePos.push(this.inviteBtns[2].position);
    this.listInvitePos.push(this.inviteBtns[3].position);
    this.listCardPos = [];
    this.listCardPos.push(this.listCardPositionUI[0].position);
    this.listCardPos.push(this.listCardPositionUI[1].position);
    this.listCardPos.push(this.listCardPositionUI[2].position);
    this.listCardPos.push(this.listCardPositionUI[3].position);
    cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);
    this.initUserAnDanh4(true);
  };
  e.prototype.onHide = function(t) {
    if (this.isEndGame) {
      this.reset();
    }
  };
  e.prototype.onDestroy = function() {
    cc.game.off(cc.game.EVENT_HIDE, this.onHide, this);
  };
  e.prototype.start = function() {
    t.prototype.start.call(this);
  };
  e.prototype.getTag = function() {
    return "TLMN";
  };
  e.prototype.getNameGame = function() {
    return "TI\u1ebeN L\xcaN MI\u1ec0N NAM";
  };
  e.prototype.getSpriteFrameName = function() {
    return this.background;
  };
  e.prototype.getListChatDefaultText = function() {
    return ["\u0110\xe1nh nhanh \u0111\xea.", "B\xe0i to khi\u1ebfp", "Kh\xf4ng xong r\u1ed3i \u0111\u1ea1i v\u01b0\u01a1ng \u01a1i",
      "\u0110\xfat ngay 3 b\xedch ch\xe9n ngay con g\xe0", "B\xe0i to\xe0n thi\u1ebfu nhi", "Th\u1ed1n v\xe3i",
      "H\xe0ng \u0111\xe2u h\u1ebft r\u1ed3i ta", "B\xe0i t\u1ed1t \u0111\xe1nh d\u1ed1t c\u0169ng thua. :)",
      "\u0110\xe1nh hay \u0111\xe1nh ti\u1ebfp \u0111i ch\xfa", "Nhanh \u0111i cha n\u1ed9i", "M\xecnh anh ch\u1ea5p h\u1ebft",
      "Mo\xe1 l\u1ea1i thua n\u1eefa", "Heo c\u1ea3 \u0111\xe0n", "\xd4i c\xe1i cu\u1ed9c \u0111\u1eddi",
      "C\xe2y n\xe0y \u0111\xfang nh\u1ecd", "B\xe0i \u0111\u1eb9p v\xf4 \u0111\u1ed1i",
      "Ngh\u0129 th\u1eadt l\xe2u, \u0111\xe1nh th\u1eadt ngu", "Nh\u1edb b\xe0i hay th\u1ebf"
    ];
  };
  e.prototype.getCmdStart = function() {
    return c.Global_Message.INGAME_USER_READY;
  };
  e.prototype.hide = function() {
    this.reset();
    t.prototype.hide.call(this);
  };
  e.prototype.onGetInGameTableInfo = function(e) {
    if (null !== e && void 0 !== e && 2 === e.Mu) {
      this.isGameAnDanh = false;
      this.isGameAnDanhCheck = false;
    }
    t.prototype.onGetInGameTableInfo.call(this, e);
    if (null != this.cardGameTableController) {
      this.cardGameTableController.stopProgressStartGame();
    }
    if (void 0 != e.tft) {
      this.timeForTurn = e.tft / 1e3;
    } else {
      this.timeForTurn = 20;
    }
    this.isDealCard = false;
    this.isEndGame = false;
  };
  e.prototype.getViewPositionOfViewingPlayer = function(t, e) {
    if (t.isMine()) {
      for (var i = false, n = this.inviteBtns[0].position, o = 0; o < this.players.length; ++o) {
        if (0 == (t = this.players[o]).indexPos) {
          i = true;
          break;
        }
      }
      if (!i) {
        t.indexPos = 0;
        return n;
      }
    }
    for (o = 0; o < this.inviteBtns.length; ++o) {
      var a = this.inviteBtns[o];
      if (a.active) {
        t.indexPos = o;
        a.active = false;
        return a.position;
      }
    }
    return new cc.Vec2(M.posOutScreen.x, M.posOutScreen.y);
  };
  e.prototype.onReconnect = function(e) {
    t.prototype.onReconnect.call(this, e);
    this.onJoinRoomPlaying(e.cmd, e);
    this._thisPlayerView.node.stopAllActions();
    this._thisPlayerView.node.setPosition(-cc.winSize.width / 2 + 120, this.listBtnInvitePos[0].y);
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
  e.prototype.autoSendReady = function() {
    t.prototype.autoSendReady.call(this);
  };
  e.prototype.onJoinRoomPlaying = function(e, i) {
    t.prototype.onJoinRoomPlaying.call(this, e, i);
    this.autoSendReady();
    this.reset();
    this.listBtnMain.active = false;
    this.isNewRound = false;
    for (var n = this.isGameAnDanhCheck, o = 0; o < i.ps.length; ++o) {
      var a = i.ps[o];
      if (0 == a.uid.localeCompare(f.default.getInstance().userID) && void 0 != a.cs && a.cs.length > 0) {
        n = false;
      }
    }
    if (void 0 != i.ps) {
      if (void 0 != i.ldc) {
        if (i.ldc.length > 0) {
          this.clearListCardSetOnTable();
          var r = this.createCardSet();
          r.setListCards(i.ldc, false, null, n);
          r.setCardScale(this.smallCardScale);
          r.node.parent = this.node;
          r.node.x = 0;
          r.node.y = 0;
          r.node.zIndex = 1;
          this.listCardSetOnTable.push(r);
          this.listCardOnTable = r.listCardNodes;
        } else {
          this.isNewRound = true;
        }
      }
      if (void 0 != i.tft) {
        this.timeForTurn = i.tft / 1e3;
      } else {
        this.timeForTurn = 20;
      }
      this.playersPlaying = [];
      for (var l = 0; l < i.ps.length; l++) {
        var h = i.ps[l];
        (d = this.getPlayer(h.uid)).remainingCards = h.rmC;
        if (void 0 != h.pi && 1 == h.pi) {
          this.playersPlaying.push(d);
          this.isDealCard = true;
        }
      }
      this.updateNumPlayersPlaying();
      for (var u = 0; u < i.ps.length; u++) {
        var d,
          p = i.ps[u];
        if ((d = this.getPlayer(p.uid)).state = p.pS, d.isHost = void 0 != p.C && p.C, p.uid == this._thisPlayerView.userID) {
          if (null != this.myCardSet) {
            this.myCardSet.reset();
          }
          if (void 0 != p.cs && p.cs.length > 0) {
            this.state = c.GameState.PLAYING;
            this.myCardSet.isSelectOneCard = false;
            this.myCardSet.setListCards(p.cs);
            this.myCardSet.setCardClick(true, this.onCardSelected.bind(this));
            this.myCardSet.setCardSelectedCallback(this.onCardSelected.bind(this));
            this.myCardSet.node.active = true;
          }
        } else if (d.isPlaying) {
          d.listCardOnHandTL = [];
          var g = this.createCard(d);
          g.node.parent = this.node;
          g.node.position = this.listCardPositionUI[d.indexPos].position;
          g.node.zIndex = y.default.TOP;
          g.setScale(this.smallCardScale);
          this.listOtherPlayerCard.push(g);
        }
        if (d.state == s.DANG_CO_LUOT) {
          var S = i.rmT / 1e3;
          d.startCountDown(S, 1 - S / this.timeForTurn);
          if (d.userID == this._thisPlayerView.userID) {
            this.listBtnMain.active = true;
            this.btnDanhBai.active = true;
            this.btnBoLuot.active = true;
            this.isMyTurn = true;
          }
        } else {
          if (d.state == s.BO_LUOT) {
            this.addBoLuotPlayer(d);
          }
        }
      }
      if (this.isNewRound) {
        this.onNewRound();
        if (this.isMyTurn) {
          this.btnBoLuot.active = false;
          this.btnDanhBai.active = true;
        } else {
          this.btnBoLuot.active = false;
          this.btnDanhBai.active = false;
        }
      } else {
        if (this._thisPlayerView.state == s.DANG_CO_LUOT) {
          this.checkRecommend(this.listCardOnTable);
        }
      }
      if (0 == this._thisPlayerView.isPlaying && this.state == c.GameState.VIEWING) {
        this._thisPlayerView.runViewAction();
      }
    }
    this.showuserAnDanh();
    for (o = 0; o < this.players.length; ++o) {
      var _ = this.players[o];
      if (_.isAnDanh) {
        _.stopCountDown();
      }
    }
    if (false === this.checkNeedRemoveAnnDanh() && 3 === this.players.length && m.default.getRandomInt(100) < 70) {
      this.showHideuserAnDanh4(true);
    }
  };
  e.prototype.handleErrorMessage = function(t) {
    if (void 0 != t && null != t && 0 != t.length) {
      T.default.getInstance().showPopupMessageUtil(t);
    }
  };
  e.prototype.onReceiveMessage = function(e, i, n) {
    switch (t.prototype.onReceiveMessage.call(this, e, i, n), e) {
      case c.Global_Message.ERROR_MESSAGE:
        this.handleErrorMessage(n.mgs);
        break;
      case c.Global_Message.INGAME_USER_READY:
        if (t.prototype.onReceiveMessage.call(this, e, i, n), n.uid == this._thisPlayerView.userID) {
          this.cardGameTableController.readyBtn.active = false;
          if (0 == this._thisPlayerView.isHost) {
            this._thisPlayerView.iconnReady.active = true;
          }
        } else if (this._thisPlayerView.isHost && (this.cardGameTableController.startBtn.active = true, this.isEndGame ? null != this
            .cardGameTableController && this.cardGameTableController.offScreenPosStartBtn() : null != this.cardGameTableController &&
            this.cardGameTableController.resetPosStartBtn()), this.isEndGame) {
          var o = this.getPlayer(n.uid);
          if (null === o || void 0 === o) {
            return;
          }
          o.isReady = true;
        }
        break;
      case l.default.DEAL_CARDS:
        this.isDealCard = false;
        this.dealCards(e, n);
        this.updateNumPlayersPlaying();
        this.setDelayLeaveRoom();
        break;
      case l.default.DANH_BAI:
        this.changeTurn(e, n, false);
        break;
      case l.default.PASS:
        break;
      case l.default.FINISH_GAME:
        this.finishGame(e, n);
    }
  };
  e.prototype.reset = function() {
    if (null != this.skeletonEffect && (this.skeletonEffect.node.active = false), null != this.myCardSet && this.myCardSet.reset(),
      null != this.poolCard) {
      this.poolCard.resetAllObjectUsing();
      for (var t = 0; t < this.poolCard.listObjectFree.length; t++) {
        if (null != this.poolCard.listObjectFree[t] && void 0 != this.poolCard.listObjectFree[t]) {
          this.poolCard.listObjectFree[t].reset();
        }
      }
    }
    if (null != this.poolCardSet) {
      this.poolCardSet.resetAllObjectUsing();
      for (t = 0; t < this.poolCardSet.listObjectFree.length; t++) {
        if (null != this.poolCardSet.listObjectFree[t] && void 0 != this.poolCardSet.listObjectFree[t]) {
          this.poolCardSet.listObjectFree[t].reset();
        }
      }
    }
    this.listOtherPlayerCard = [];
    this.listCardSetOnTable = [];
    this.listBoLuotPlayer = [];
  };
  e.prototype.onCardSelected = function(t) {
    if (t.isBlackFace || I.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_select_card_on_hand"), 0 != t.isSelected && (this
        .isNewRound && this.isMyTurn, this.isMyTurn)) {
      var e = this.myCardSet.getListCardSelected(),
        i = -1;
      if (2 == e.length && (i = Math.abs(e[1].N - e[0].N)) > 1 && (e[0].N != t.N ? e[0].setCardSelected(false, true) : e[1]
          .setCardSelected(false, true)), this.listRecommendCards.length > 0) {
        for (var n = false, o = (this.listCardOnTable.length, 0); o < this.listRecommendCards.length; o++) {
          for (var a = this.listRecommendCards[o], s = 0; s < a.length; s++) {
            if ((c = a[s]).serverCode != t.serverCode || 0 != n) {
              if (n) {
                c.setCardSelected(true);
              }
            } else {
              n = true;
              s = -1;
            }
          }
          if (n) {
            break;
          }
        }
      } else if (1 == i) {
        var r = false;
        for (o = 0; o < this.myCardSet.listCardNodes.length; o++) {
          var c = this.myCardSet.listCardNodes[o],
            l = this.myCardSet.listCardNodes[o + 1];
          if (!(void 0 != l && c.N == l.N && c.S < l.S)) {
            if (15 != c.N && c.N - e[e.length - 1].N == 1) {
              r = true;
              c.setCardSelected(true, true);
              e = this.myCardSet.getListCardSelected();
            }
          }
        }
        if (!r) {
          if (e[0].N != t.N) {
            e[0].setCardSelected(false, true);
          } else {
            e[1].setCardSelected(false, true);
          }
        }
      } else if (0 == i) {
        for (o = 0; o < this.myCardSet.listCardNodes.length; o++) {
          if (0 == (c = this.myCardSet.listCardNodes[o]).isSelected && c.N == e[0].N) {
            c.setCardSelected(true, true);
          }
        }
      }
    }
  };
  e.prototype.dealCards = function(t, e, i) {
    var n = this;
    if (void 0 === i) {
      i = false;
    }
    if (0 == i) {
      this.isEndGame = false;
    }
    this.isDealCard = true;
    this.reset();
    this.listCardOnTable = [];
    this.listRecommendCards = [];
    var o = e.cs,
      a = e.lpi,
      s = [];
    if (void 0 == o) {
      for (var r = 0; r < e.ps.length; r++) {
        if ((l = this.getPlayer(e.ps[r].uid)).isMine()) {
          o = e.ps[r].cs;
          break;
        }
      }
    }
    this.cardGameTableController.startBtn.active = false;
    this.cardGameTableController.readyBtn.active = false;
    if (this._dangKetThuc) {
      this.handlePendingPlayers();
    }
    this.listBoLuotPlayer = [];
    if (void 0 != a) {
      this.locPlayingPlayer(a);
    }
    this.cardGameTableController.startGameUI();
    this.listBtnMain.active = false;
    for (r = 0; r < this.players.length; r++) {
      this.players[r].iconnReady.active = false;
      this.players[r].iconQuit.active = false;
      this.players[r].removeBubbleFx();
    }
    this.state = c.GameState.VIEWING;
    this._thisPlayerView.isPlaying = false;
    for (r = 0; r < this.playersPlaying.length; r++) {
      var l;
      (l = this.playersPlaying[r]).listCardOnHandTL = [];
      if (l.userID == this._thisPlayerView.userID) {
        this.state = c.GameState.PLAYING;
        this._daNgoi = true;
        this._dangPhatBai = true;
        this._thisPlayerView.isPlaying = true;
        this._thisPlayerView.node.stopAllActions();
        this._thisPlayerView.node.runAction(cc.moveTo(.4, -cc.winSize.width / 2 + 120, this.listBtnInvitePos[0].y).easing(cc
          .easeExponentialOut()));
      }
      for (var h = function(t) {
          var e = u.createCard(l);
          e.node.parent = u.node;
          e.node.position = cc.Vec2.ZERO;
          e.setScale(1);
          l.remainingCards = 13;
          if (l.userID == u._thisPlayerView.userID) {
            e.setTextureWithCode(o[t], c.GAME.TIENLEN);
            s.push(e);
          } else {
            e.node.zIndex = y.default.TOP;
            e.setScale(u.smallCardScale);
            e.node.runAction(cc.sequence(cc.delayTime(.06 * t), cc.moveTo(.3, u.listCardPositionUI[l.indexPos].position), cc.callFunc(
              function() {
                if (0 != t) {
                  this.poolCard.addObject(e);
                } else {
                  this.listOtherPlayerCard.push(e);
                  if (12 == t) {
                    this._dangPhatBai = false;
                  }
                }
              }.bind(u))));
          }
        }, u = this, d = 0; d < 13; d++) {
        h(d);
      }
    }
    if (this.showuserAnDanh(), void 0 != e.tP) {
      var p = this.getPlayer(e.tP.uid);
      if (false === this.isGameAnDanhCheck) {
        p.startCountDown(this.timeForTurn);
      }
      if (e.tP.uid == this._thisPlayerView.userID) {
        this.isMyTurn = true;
        this.btnBoLuot.active = false;
      }
    }
    if (void 0 != e.tP && e.tP.uid == this._thisPlayerView.userID) {
      this.scheduleOnce(function() {
        n.listBtnMain.active = true;
        n.btnDanhBai.active = true;
      }, .1 * s.length + .3);
    }
    if (this._thisPlayerView.isPlaying) {
      this.myCardSet.setListGameCard(s, true, .1, .3, true, true);
      this.myCardSet.isSelectOneCard = false;
      this.myCardSet.setCardClick(false);
      this.myCardSet.callbackCardSetReady = function() {
        this.myCardSet.setCardClick(true, this.onCardSelected.bind(this));
      }.bind(this);
    } else {
      this._dangPhatBai = false;
      this._thisPlayerView.runViewAction();
    }
    this.processCheckToOffAnDanh4();
  };
  e.prototype.changeTurn = function(t, e, i) {
    var n = this;
    if (void 0 === i) {
      i = false;
    }
    this.cardGameTableController.readyBtn.active = false;
    this.cardGameTableController.startBtn.active = false;
    this.isEndGame = false;
    var o = this.getPlayer(e.fP.uid),
      a = this.getPlayer(e.tP.uid),
      r = this.getPlayer(e.fP.puid),
      c = e.fP.mX,
      l = e.fP.lm;
    if (o.stopCountDown(), o.state = e.fP.pS, void 0 != e.tP.pS && (a.state = e.tP.pS), false === this.isGameAnDanhCheck && a
      .startCountDown(this.timeForTurn), a.userID == this._thisPlayerView.userID ? (this.listBtnMain.active = true, this.btnBoLuot
        .active = true, this.btnDanhBai.active = true, this.isMyTurn = true) : (this.listBtnMain.active = false, this.isMyTurn = false),
      this._thisPlayerView.state == s.BO_LUOT ? this.myCardSet.setBlackFace(true) : this.myCardSet.setBlackFace(false), o.state == s
      .DANH_BAI) {
      this.isNewRound = false;
      if (this.numplayersPlaying > this.getNumPlayersPlaying()) {
        this.numplayersPlaying--;
      }
      o.remainingCards -= e.fP.dCs.length;
      var h = 0;
      if (true === this.isGameAnDanhCheck && (h = m.default.getRandomArbitrary(4, 5)), void 0 != e.rfu) {
        var u = this.getPlayer(e.rfu.uid),
          d = e.rfu.m,
          p = e.rfu.mX;
        this.refundMoney(u, d, p);
      }
      var f = function(t) {
        if (void 0 === t) {
          t = true;
        }
        if (true === n.isGameAnDanhCheck) {
          n.nodeDanhBaiAction.runAction(cc.sequence(cc.delayTime(h), cc.callFunc(function() {
            n.danhBai(o, e.fP.dCs, a, r, c, l, t);
          })));
        } else {
          n.danhBai(o, e.fP.dCs, a, r, c, l, t);
        }
      };
      if (o.userID == a.userID) {
        f(false);
        if (a.userID == this._thisPlayerView.userID) {
          this.btnBoLuot.active = false;
          this.btnDanhBai.active = false;
        }
        this.node.runAction(cc.sequence(cc.delayTime(h + .7), cc.callFunc(function() {
          n.forceResetNewRound(a);
        })));
      } else if (0 == o.remainingCards) {
        if (o.userID != this._thisPlayerView.userID) {
          o.hideAlllistCardOnHandTL();
        }
        var g = this.getNextRankIndex();
        if (g <= this.playersPlaying.length - 2 && this.checkAndShowEffectRank(o.skeletonEffect, g), 1 == g && 1 == e.fP.dCs.length &&
          8 == e.fP.dCs[0] && this.showEffectDutMu(), this.listBoLuotPlayer.length >= this.numplayersPlaying - 2) {
          var y = this.findNextPlayer(o);
          if (a.indexPos == y) {
            f(false);
            if (a.userID == this._thisPlayerView.userID) {
              this.btnBoLuot.active = false;
              this.btnDanhBai.active = false;
            }
            this.node.runAction(cc.sequence(cc.delayTime(h + .7), cc.callFunc(function() {
              n.forceResetNewRound(a);
            })));
          } else {
            f(true);
          }
        } else {
          f(true);
        }
      } else {
        f(true);
      }
    } else if (o.state == s.BO_LUOT) {
      this.addBoLuotPlayer(o);
      var S = 0 != o.indexPos && 3 != o.indexPos;
      if (false === this.isGameAnDanhCheck && o.showBubbleFx("B\u1ecf l\u01b0\u1ee3t", 0, true, S), I.default.getInstance().playEffect(
          "Sounds/gameto/sfx_gameto_fold"), o.userID == this._thisPlayerView.userID) {
        for (var _ = 0; _ < this.myCardSet.listCardNodes.length; _++) {
          var v = this.myCardSet.listCardNodes[_];
          if (1 == v.isSelected) {
            v.setCardSelected(false, true);
          }
        }
      }
      if (this.isNewRound) {
        this.onNewRound();
        if (a.userID == this._thisPlayerView.userID) {
          this.btnBoLuot.active = false;
        }
      } else {
        if (a.userID == this._thisPlayerView.userID) {
          this.checkRecommend(this.listCardOnTable);
        }
      }
    }
    this.playerPlaying = a;
  };
  e.prototype.findNextPlayer = function(t) {
    var e = t.indexPos,
      i = -1;
    this.playersPlaying.sort(function(t, e) {
      return 0 - (t.indexPos > e.indexPos ? -1 : 1);
    });
    for (var n = 0; n < this.playersPlaying.length; n++) {
      var o = this.playersPlaying[n];
    }
    for (n = 0; n < this.playersPlaying.length; n++) {
      if (0 != (o = this.playersPlaying[n]).remainingCards && o.indexPos > e) {
        i = o.indexPos;
        break;
      }
    }
    if (-1 == i) {
      e = -1;
      for (n = 0; n < this.playersPlaying.length; n++) {
        if (0 != (o = this.playersPlaying[n]).remainingCards && o.indexPos > e) {
          i = o.indexPos;
          break;
        }
      }
    }
    return i;
  };
  e.prototype.forceResetNewRound = function(t) {
    this.setNewRound();
    this.onNewRound();
    if (t.userID == this._thisPlayerView.userID) {
      this.btnBoLuot.active = false;
      this.btnDanhBai.active = true;
    }
  };
  e.prototype.danhBai = function(t, e, i, n, o, a, s) {
    if (void 0 === s) {
      s = true;
    }
    I.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_btn_danhbai");
    if (void 0 != o && 0 != o && null != t) {
      this.showMoneyForPlayer(t, o);
    }
    if (void 0 != a && 0 != a && null != n) {
      this.showMoneyForPlayer(n, a);
    }
    var r = m.default.getRandomInt(100) - 75,
      c = m.default.getRandomInt(100) - 50,
      l = this.createCardSet();
    l.node.parent = this.node;
    l.node.position = new cc.Vec2(r, c);
    l.node.zIndex = y.default.TOP + this.listCardSetOnTable.length + 1;
    var h = [];
    if (t.userID == this._thisPlayerView.userID) {
      h = this.myCardSet.getListCardObject(e, true);
      l.resetCardState();
      l.setScaleDefault(this.smallCardScale, true);
      l.setListGameCard(h, false, 0, .6);
      l.setCardSelectedCallback(null);
      l.setCardClick(false);
      this.listCardOnTable = h;
    } else {
      l.setScaleDefault(this.smallCardScale);
      var u = this.listCardPositionUI[t.indexPos].parent.convertToWorldSpaceAR(this.listCardPositionUI[t.indexPos].position);
      if (true === this.isGameAnDanhCheck && e.length > 1) {
        var d = m.default.getRandomInt(e.length - 1) + 1;
        if (d > 0) {
          e.splice(e.length - d, d);
        }
      }
      l.setListCardWithAnimation(e, u, null, .6, this.isGameAnDanhCheck);
      this.listCardOnTable = l.listCardNodes;
    }
    for (var p = 0; p < this.listCardSetOnTable.length; p++) {
      this.listCardSetOnTable[p].setBlackFace(true);
    }
    this.listCardSetOnTable.push(l);
    l.setBlackFace(false);
    if (null != i && i.userID == this._thisPlayerView.userID && s) {
      this.checkRecommend(l.listCardNodes);
    }
    this.checkAndShowEffect(this.listCardOnTable);
  };
  e.prototype.checkRecommend = function(t) {
    if (this._thisPlayerView.state != s.BO_LUOT) {
      this.myCardSet.setBlackFace(true);
    }
    for (var e = false, i = _.getListRecommendCards(t, this.myCardSet.listCardNodes), n = _.getAllowedCardsToPlay(t, i), o = 0; o < n
      .length; o++) {
      n[o].setBlackFace(false);
      e = true;
    }
    for (o = 0; o < this.myCardSet.listCardNodes.length; o++) {
      if (this.myCardSet.listCardNodes[o].isBlackFace) {
        this.myCardSet.listCardNodes[o].setCardSelected(false, true);
      }
    }
    this.listRecommendCards = i;
    if (0 == e) {
      this.btnDanhBai.active = false;
    }
  };
  e.prototype.playSfxChatHeo = function() {
    this.node.runAction(cc.sequence(cc.delayTime(.6), cc.callFunc(function() {
      this.sfxChatHeo();
    }.bind(this))));
  };
  e.prototype.sfxChatHeo = function() {
    switch (this.indexChatHeo++, this.indexChatHeo) {
      case 1:
      case 2:
        I.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_chat_heo_00");
        break;
      case 3:
        I.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_chat_heo_01");
        break;
      case 4:
        I.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_chat_heo_02");
        break;
      case 5:
        I.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_chat_heo_03");
        break;
      default:
        I.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_chat_heo_04");
    }
  };
  e.prototype.checkAndShowEffect = function(t, e) {
    if (void 0 === e && (e = b.RANK.NONE), !this.isGameAnDanhCheck) {
      var i = null,
        n = "animation",
        o = "";
      if (e == b.RANK.NONE) {
        switch (v.getCardType(t)) {
          case b.CARD_TYPE.FOUR_OF_A_KIND:
            this.playSfxChatHeo();
            i = Object.create(this.animTuQuy);
            break;
          case b.CARD_TYPE.FOUR_PAIRS_STRAGHT:
            this.playSfxChatHeo();
            i = Object.create(this.anim4DoiThong);
            break;
          case b.CARD_TYPE.THREE_PAIRS_STRAIGHT:
            this.playSfxChatHeo();
            i = Object.create(this.anim3DoiThong);
            break;
          default:
            this.indexChatHeo = 0;
        }
      } else {
        switch (I.default.getInstance().playEffect("Sounds/sfx_jackpot"), e) {
          case b.RANK.TWO_OF_FOURS:
            i = Object.create(this.anim2TuQuy);
            break;
          case b.RANK.FOUR_OF_TWO:
            i = Object.create(this.animTuQuy2);
            break;
          case b.RANK.FOUR_OF_THREE:
            i = Object.create(this.animTuQuy3);
            break;
          case b.RANK.DONGHOA_DRAGON:
            i = Object.create(this.animSanhRongDongHoa);
            o = "Loop";
            n = "Start";
            break;
          case b.RANK.DONG_HOA:
            i = Object.create(this.animDongHoa);
            break;
          case b.RANK.DRAGON:
            i = Object.create(this.animSanhRong);
            o = "Loop";
            n = "Start";
            break;
          case b.RANK.FIVE_CONSECUTIVE_PAIRS:
            i = Object.create(this.anim5DoiThong);
            break;
          case b.RANK.FOUR_CONSECUTIVE_PAIRS_HAS_THREE_ACE:
            i = Object.create(this.anim4DoiThong3Bich);
            break;
          case b.RANK.SIX_CONSECUTIVE_PAIRS:
            i = Object.create(this.anim6DoiThong);
            break;
          case b.RANK.SIX_PAIRS:
            i = Object.create(this.anim6Doi);
            break;
          case b.RANK.THREE_CONSECUTIVE_PAIRS_HAS_THREE_ACE:
            i = Object.create(this.anim3DoiThong3Bich);
        }
      }
      if (null != i) {
        this.skeletonEffect.node.active = true;
        this.skeletonEffect.node.zIndex = y.default.TL_EFFECT;
        this.skeletonEffect.skeletonData = i;
        this.skeletonEffect.setAnimation(0, n, false);
        this.skeletonEffect.setCompleteListener(function() {
          if (o.length > 0) {
            this.skeletonEffect.setAnimation(0, o, true);
            o = "";
          } else {
            this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(function() {
              this.skeletonEffect.node.active = false;
            }.bind(this))));
          }
        }.bind(this));
      }
    }
  };
  e.prototype.checkAndShowEffectRank = function(t, e, i, n) {
    if (void 0 === i && (i = false), void 0 === n && (n = false), !this.isGameAnDanhCheck) {
      var o = null;
      switch (e == this.playersPlaying.length && (e = 4), e) {
        case 1:
          I.default.getInstance().playEffect("Sounds/sfx_win");
          t.node.position = new cc.Vec2(0, 100);
          t.node.scale = .35;
          o = Object.create(this.animNhat);
          break;
        case 2:
          I.default.getInstance().playEffect("Sounds/sfx_win");
          t.node.position = new cc.Vec2(0, 100);
          t.node.scale = .35;
          o = Object.create(this.animNhi);
          break;
        case 3:
          I.default.getInstance().playEffect("Sounds/sfx_win");
          t.node.position = new cc.Vec2(0, 100);
          t.node.scale = .35;
          o = Object.create(this.animBa);
          break;
        case 4:
          I.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_lose");
          t.node.position = new cc.Vec2(0, 100);
          t.node.scale = .35;
          o = Object.create(this.animBet);
      }
      if (null != o) {
        t.node.active = false;
        t.node.active = true;
        t.node.zIndex = y.default.TL_EFFECT;
        t.skeletonData = o;
        t.setAnimation(0, "animation", i);
        if (1 == n) {
          t.setCompleteListener(function() {
            this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(function() {
              t.node.active = false;
            }.bind(this))));
          }.bind(this));
        } else {
          t.setCompleteListener(function() {}.bind(this));
        }
      }
    }
  };
  e.prototype.checkAndShowEffectLoseType = function(t, e) {
    if (!this.isGameAnDanhCheck) {
      var i = null,
        n = "Start",
        o = false,
        s = 1.5;
      switch (e) {
        case a.CONG:
          I.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_lose");
          t.node.position = new cc.Vec2(4, -19.487);
          t.node.scale = 1;
          n = "animation";
          i = Object.create(this.animGietCong);
          o = true;
          s = 1.85;
          break;
        case a.THOI:
          t.node.position = new cc.Vec2(0, 100);
          t.node.scale = .35;
          n = "animation";
          i = Object.create(this.animThoi);
      }
      if (null != i) {
        t.node.active = true;
        t.node.zIndex = y.default.TL_EFFECT;
        t.skeletonData = i;
        t.setAnimation(0, n, o);
        t.setCompleteListener(function() {
          this.node.runAction(cc.sequence(cc.delayTime(s), cc.callFunc(function() {
            t.node.active = false;
          }.bind(this))));
        }.bind(this));
      }
    }
  };
  e.prototype.showEffectDutMu = function() {
    this.isGameAnDanhCheck;
  };
  e.prototype.showMoneyForPlayer = function(t, e) {
    if (!this.isGameAnDanhCheck && null != t) {
      var i = cc.instantiate(this.prefabMoneyUI).getComponent(g.default);
      i.setMoney(e);
      i.show(c.GAME.TIENLEN, 3, true);
      i.node.position = t.node.position;
      i.node.zIndex = t.node.zIndex + 1;
      i.node.parent = this.node;
    }
  };
  e.prototype.refundMoney = function(t, e, i) {
    this.showMoneyForPlayer(t, i);
  };
  e.prototype.addBoLuotPlayer = function(t) {
    this.listBoLuotPlayer.push(t);
    if (this.listBoLuotPlayer.length >= this.numplayersPlaying - 1) {
      this.setNewRound();
    }
  };
  e.prototype.setNewRound = function() {
    this.listBoLuotPlayer = [];
    this.isNewRound = true;
    this.updateNumPlayersPlaying();
  };
  e.prototype.updateNumPlayersPlaying = function() {
    this.numplayersPlaying = this.getNumPlayersPlaying();
  };
  e.prototype.getNumPlayersPlaying = function() {
    for (var t = 0, e = 0; e < this.playersPlaying.length; e++) {
      if (this.playersPlaying[e].remainingCards > 0) {
        t++;
      }
    }
    return t;
  };
  e.prototype.onNewRound = function() {
    this.listRecommendCards = [];
    this.listCardOnTable = [];
    this.isNewRound = true;
    this.myCardSet.setBlackFace(false);
    for (var t = function(t) {
        var i = e.playersPlaying[t];
        i.state = s.DANH_BAI;
        e.node.runAction(cc.sequence(cc.delayTime(.7), cc.callFunc(function() {
          i.removeBubbleFx();
        }.bind(e))));
      }, e = this, i = 0; i < this.playersPlaying.length; i++) {
      t(i);
    }
    this.clearListCardSetOnTable();
    this.nodeDanhBaiAction.stopAllActions();
    if (null != this.skeletonEffect) {
      this.skeletonEffect.node.active = false;
    }
  };
  e.prototype.clearListCardSetOnTable = function() {
    for (var t = 0; t < this.listCardSetOnTable.length; t++) {
      var e = this.listCardSetOnTable[t];
      e.node.stopAllActions();
      e.reset();
      this.poolCardSet.addObject(this.listCardSetOnTable[t]);
    }
    this.listCardSetOnTable = [];
  };
  e.prototype.finishGame = function(e, i) {
    this.isEndGame = true;
    t.prototype.finishGame.call(this, e, i);
    this.listBtnMain.active = false;
    this._dangKetThuc = true;
    for (var n = 0; n < this.listOtherPlayerCard.length; n++) {
      this.poolCard.addObject(this.listOtherPlayerCard[n]);
    }
    this.listOtherPlayerCard = [];
    this.runAnimationFinishGame(e, i);
  };
  e.prototype.runAnimationFinishGame = function(t, e) {
    this.myCardSet.setBlackFace(false);
    this.isDealCard = false;
    var i = 1,
      n = 0;
    if (void 0 != e.fP) {
      var o = this.getPlayer(e.fP.uid);
      o.stopCountDown();
      o.removeBubbleFx();
      var s = e.fP.mX,
        r = e.fP.lm,
        l = e.fP.dCs;
      if (void 0 != e.fP.sm && (s = e.fP.sm, r = e.fP.lm), this.checkAndShowEffectRank(o.skeletonEffect, e.fP.wI, false, true),
        void 0 != e.fP.lT) {
        this.checkAndShowEffectLoseType(o.skeletonEffect, e.fP.lT);
      } else if (void 0 == e.fP.whR) {
        var h = e.fP.cs;
        if (void 0 != h && 1 == this.checkThoi(h)) {
          this.checkAndShowEffectLoseType(o.skeletonEffect, a.THOI);
        }
        if (13 == o.remainingCards) {
          this.checkAndShowEffectLoseType(o.skeletonEffect, a.CONG);
        }
      }
      if (void 0 != e.fP.wT && 1 == e.fP.wT ? this.showEffectDutMu() : 1 == e.fP.wI && void 0 != l && 1 == l.length && 8 == l[0] && this
        .showEffectDutMu(), this.danhBai(o, l, null, null, s, r), void 0 != e.rfu) {
        var u = this.getPlayer(e.rfu.uid),
          d = e.rfu.m,
          p = e.rfu.mX;
        this.refundMoney(u, d, p);
      }
      if (false === this.isGameAnDanhCheck) {
        if (s > 0) {
          o.runWinAction(this.timeToFinish);
        }
        if (void 0 != e.fP.m) {
          o.setMoney(e.fP.m);
        }
      }
    }
    for (var f = 0; f < e.ps.length; f++) {
      if (void 0 != e.ps[f].whR) {
        true;
        this._khongThaoTac = false;
        break;
      }
    }
    var m = function(o) {
        var s = S.getPlayer(e.ps[o].uid);
        s.stopCountDown();
        s.removeBubbleFx();
        var r = e.ps[o].dCs,
          l = e.ps[o].cs;
        if (void 0 != e.ps[o].wT && 1 == e.ps[o].wT) {
          S.showEffectDutMu();
        } else {
          if (1 == e.ps[o].wI && void 0 != r && 1 == r.length && 8 == r[0]) {
            S.showEffectDutMu();
          }
        }
        if (0 == l.length && r.length > 0 && 0 != s.remainingCards) {
          S.danhBai(s, r, null, null, 0, 0);
        }
        var h = e.ps[o].whR,
          u = "";
        switch (h) {
          case 1:
            u = "T\u1ee9 Qu\xfd 3";
            break;
          case 2:
            u = "T\u1ee9 Qu\xfd 2";
            break;
          case 3:
            u = "2 T\u1ee9 Qu\xfd";
            break;
          case 4:
            u = "6 \u0110\xf4i";
            break;
          case 5:
            u = "3 \u0110\xf4i Th\xf4ng c\xf3 3 B\xedch";
            break;
          case 6:
            u = "4 \u0110\xf4i Th\xf4ng c\xf3 3 B\xedch";
            break;
          case 7:
            u = "5 \u0110\xf4i Th\xf4ng";
            break;
          case 8:
            u = "6 \u0110\xf4i Th\xf4ng";
            break;
          case 9:
            u = "\u0110\u1ed3ng Hoa";
            break;
          case 10:
            u = "S\u1ea3nh R\u1ed3ng";
            break;
          case 11:
            u = "S\u1ea3nh R\u1ed3ng \u0110\u1ed3ng Hoa";
        }
        if (u.length > 0) {
          S.playersPlaying = [];
          for (var d = 0; d < e.ps.length; d++) {
            S.playersPlaying.push(S.getPlayer(e.ps[d].uid));
          }
          S.dealCards(t, e, true);
          n = i = 1.5;
        }
        S.node.runAction(cc.sequence(cc.delayTime(n), cc.callFunc(function() {
          if (s.userID != this._thisPlayerView.userID) {
            var t = this.createCardSetFinish(s);
            t.node.parent = this.node;
            t.node.zIndex = y.default.TOP;
            t.node.position = this.getCardSetPosition(s);
            t.setListCards(e.ps[o].cs, false, null, this.isGameAnDanhCheck);
            t.setCardScale(this.smallCardScale);
            t.setBlackFace(false);
          }
          var i = e.ps[o].mX;
          if (void 0 != e.ps[o].sm && (i = e.ps[o].sm), u.length > 0) {
            var n = 0 != s.indexPos && 3 != s.indexPos;
            s.showBubbleFx(u, 0, true, n);
            if (i > 0) {
              this.checkAndShowEffect(null, h);
            }
          }
          if (false === this.isGameAnDanhCheck) {
            if (i > 0 && s.runWinAction(this.timeToFinish), void 0 != i && 0 != i) {
              var r = cc.instantiate(this.prefabMoneyUI).getComponent(g.default);
              r.node.parent = this.node;
              r.node.zIndex = s.node.zIndex + 1;
              r.node.position = s.node.position;
              r.setMoney(i);
              r.show(c.GAME.TIENLEN, this.timeToFinish, true);
            }
            if (void 0 != e.ps[o].m) {
              s.setMoney(e.ps[o].m);
            }
          }
          if (this.checkAndShowEffectRank(s.skeletonEffect, e.ps[o].wI, false, true), void 0 != e.ps[o].lT) {
            this.checkAndShowEffectLoseType(s.skeletonEffect, e.ps[o].lT);
          } else if (void 0 == e.ps[o].whR) {
            var l = e.ps[o].cs;
            if (void 0 != l && 1 == this.checkThoi(l)) {
              this.checkAndShowEffectLoseType(s.skeletonEffect, a.THOI);
            }
            if (13 == s.remainingCards) {
              this.checkAndShowEffectLoseType(s.skeletonEffect, a.CONG);
            }
          }
        }.bind(S))));
      },
      S = this;
    for (f = 0; f < e.ps.length; f++) {
      m(f);
    }
    this.node.runAction(cc.sequence(cc.delayTime(this.timeToFinish + i + n), cc.callFunc(function() {
      this.endGame(t, e);
    }.bind(this))));
  };
  e.prototype.endGame = function(e, i) {
    t.prototype.endGame.call(this, e, i);
    if (1 == this.isEndGame) {
      this.reset();
    }
    this.handlePendingPlayers();
    this.updateViewPostions(false, true);
    if (0 == this._thisPlayerView.isHost && 1 == this.isEndGame) {
      this.cardGameTableController.readyBtn.active = true;
    }
    this.isNewRound = true;
    this.isEndGame = false;
    if (null != this.cardGameTableController) {
      this.cardGameTableController.resetPosStartBtn();
    }
    N.default.getInstance().CheckForceUpdateByGameScene(O.GameConfigs.SceneName.TLMN);
  };
  e.prototype.getCardSetPosition = function(t) {
    var e = cc.Vec2.ZERO;
    switch (t.indexPos) {
      case 0:
        break;
      case 1:
        (e = this.listBtnInvitePos[1].position).x -= 120;
        break;
      case 2:
        (e = this.listBtnInvitePos[2].position).y -= 80;
        break;
      case 3:
        (e = this.listBtnInvitePos[3].position).x += 120;
    }
    return e;
  };
  e.prototype.createCardSet = function() {
    var t = this.poolCardSet.getObject();
    if (null == t) {
      t = cc.instantiate(this.prefabCardSet).getComponent(u.default);
      this.poolCardSet.addObjectUsing(t);
    }
    t.setHorizontalLayout();
    t.setBlackFace(false);
    t.node.active = true;
    return t;
  };
  e.prototype.createCardSetFinish = function(t) {
    var e = this.createCardSet();
    if (2 == t.indexPos) {
      e.setHorizontalLayout();
    } else {
      e.setVerticalLayout();
      e.layout.spacingY = -55;
    }
    return e;
  };
  e.prototype.createCard = function(t) {
    var e = this.poolCard.getObject();
    if (null == e) {
      e = cc.instantiate(this.prefabsGameCard).getComponent(h.default);
      this.poolCard.addObjectUsing(e);
    }
    e.node.active = true;
    e.node.opacity = 255;
    e.node.stopAllActions();
    e.reset();
    e.setClickEnabled(false);
    e.setColor(cc.color(255, 255, 255));
    if (null != t) {
      t.listCardOnHandTL.push(e);
    }
    return e;
  };
  e.prototype.onBtnBoLuot = function() {
    S.default.getInstance().requestBoLuot();
    this._khongThaoTac = false;
  };
  e.prototype.onBtnDanhBai = function() {
    if (this._khongThaoTac = false, 0 != this.myCardSet.getListCardSelected().length) {
      if (this.myCardSet.getListCardSelected().length >= 2) {
        if (E.sortVector(this.myCardSet.getListCardSelected(), false), C.isPairs(this.myCardSet.getListCardSelected()) || C
          .isThreeOfAKind(this.myCardSet.getListCardSelected()) || C.isFourOfAKind(this.myCardSet.getListCardSelected()) || C
          .isStraight(this.myCardSet.getListCardSelected()) || C.isThreePairsStraight(this.myCardSet.getListCardSelected())) {
          if (this.listCardOnTable.length > 0 && v.getRecommendCards(this.listCardOnTable, this.myCardSet.getListCardSelected())
            .length != this.myCardSet.getListCardSelected().length) {
            return void T.default.getInstance().showPopupMessageUtil("B\xe0i \u0111\xe1nh kh\xf4ng h\u1ee3p l\u1ec7!");
          }
        } else {
          if (!C.isFourPairsStraight(this.myCardSet.getListCardSelected())) {
            return void T.default.getInstance().showPopupMessageUtil("B\xe0i \u0111\xe1nh kh\xf4ng h\u1ee3p l\u1ec7!");
          }
          if (this.listCardOnTable.length > 0) {
            var t = v.getRecommendCards(this.listCardOnTable, this.myCardSet.getListCardSelected());
            if (6 != t.length && 8 != t.length) {
              return void T.default.getInstance().showPopupMessageUtil("B\xe0i \u0111\xe1nh kh\xf4ng h\u1ee3p l\u1ec7!");
            }
          }
        }
      } else if (1 == this.myCardSet.getListCardSelected().length && this.listCardOnTable.length > 1) {
        return void T.default.getInstance().showPopupMessageUtil("B\xe0i \u0111\xe1nh kh\xf4ng h\u1ee3p l\u1ec7!");
      }
      S.default.getInstance().requestDanhBai(this.myCardSet.getListCardIDSelected());
    } else {
      T.default.getInstance().showPopupMessageUtil("B\u1ea1n ch\u01b0a ch\u1ecdn b\xe0i \u0111\u1ec3 \u0111\xe1nh!");
    }
  };
  e.prototype.handlePendingPlayers = function() {
    if (t.prototype.handlePendingPlayers.call(this), this._forcedQuit) {
      this.onLogOut();
    } else if (this._forcedToLeaveRoom) {
      this.handleLeaveRoomResponse();
    } else {
      if (this._subscribedToGetOut) {
        this.state = c.GameState.WAITING;
        return void this.sendLeaveRoom();
      }
      if (f.default.getInstance().checkBaoTriGame()) {
        this.state = c.GameState.WAITING;
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
      this.state = c.GameState.WAITING;
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
        i.removeBubbleFx();
      }
      this.autoSendReady();
      this.showHideuserAnDanh4(false);
    }
  };
  e.prototype.showHideInviteBtn = function() {
    for (var t = this, e = 0; e < 4; e++) {
      this.inviteBtns[e].position = this.listInvitePos[e];
      this.listCardPositionUI[e].position = this.listCardPos[e];
    }
    this.inviteBtns.forEach(function(e) {
      e.active = 4 === t.maxUser;
    });
    if (2 === this.maxUser) {
      this.POS2.forEach(function(e) {
        t.inviteBtns[e].active = true;
      });
    }
    if (3 === this.maxUser) {
      this.POS3.forEach(function(e) {
        t.inviteBtns[e].active = true;
        if (2 == e) {
          t.inviteBtns[e].position = new cc.Vec2(350, 260);
          t.listCardPositionUI[e].position = new cc.Vec2(230, 260);
        } else {
          if (3 == e) {
            t.inviteBtns[e].position = new cc.Vec2(-350, 260);
            t.listCardPositionUI[e].position = new cc.Vec2(-230, 260);
          }
        }
      });
    }
  };
  e.prototype.getNextRankIndex = function() {
    for (var t = 0, e = 0; e < this.playersPlaying.length; e++) {
      if (0 == this.playersPlaying[e].remainingCards) {
        t++;
      }
    }
    return t;
  };
  e.prototype.checkThoi = function(t) {
    for (var e = [], i = 0; i < t.length; i++) {
      e.push(this.decodeCard(t[i]));
    }
    for (i = 0; i < e.length; i++) {
      if (15 == e[i]) {
        return true;
      }
    }
    return !!P.TienLenUtil.hasTuQuy(e) || !!P.TienLenUtil.hasDoiThong(e, 3);
  };
  e.prototype.decodeCard = function(t) {
    var e;
    if (1 === (e = Math.floor(t / 4) + 1)) {
      e = 14;
    }
    if (2 === e) {
      e = 15;
    }
    return e;
  };
  e.prototype.showPlayerViewBauCua = function(t, e) {
    if (t.node.active !== e && this.state !== c.GameState.PLAYING) {
      t.node.active = e;
    }
  };
  e.prototype.onUserJoinTable = function(e) {
    if (t.prototype.onUserJoinTable.call(this, e), this.isDealCard) {
      var i = this.getPlayer(e.uid);
      if (null !== i && void 0 !== i) {
        i.node.active = false;
        if (i.indexPos < this.inviteBtns.length) {
          this.inviteBtns[i.indexPos].active = true;
        }
      }
    }
  };
  o([R(cc.Prefab)], e.prototype, "prefabCardSet", void 0);
  o([R(cc.SpriteFrame)], e.prototype, "background", void 0);
  o([R(cc.Node)], e.prototype, "listCardPositionUI", void 0);
  o([R(cc.Node)], e.prototype, "listBtnMain", void 0);
  o([R(cc.Node)], e.prototype, "btnBoLuot", void 0);
  o([R(cc.Node)], e.prototype, "btnDanhBai", void 0);
  o([R(cc.Prefab)], e.prototype, "prefabMoneyUI", void 0);
  o([R(sp.Skeleton)], e.prototype, "skeletonEffect", void 0);
  o([R(cc.Node)], e.prototype, "nodeDanhBaiAction", void 0);
  o([R(sp.SkeletonData)], e.prototype, "anim2TuQuy", void 0);
  o([R(sp.SkeletonData)], e.prototype, "animTuQuy2", void 0);
  o([R(sp.SkeletonData)], e.prototype, "animTuQuy3", void 0);
  o([R(sp.SkeletonData)], e.prototype, "anim3DoiThong", void 0);
  o([R(sp.SkeletonData)], e.prototype, "anim3DoiThong3Bich", void 0);
  o([R(sp.SkeletonData)], e.prototype, "anim4DoiThong", void 0);
  o([R(sp.SkeletonData)], e.prototype, "anim4DoiThong3Bich", void 0);
  o([R(sp.SkeletonData)], e.prototype, "anim5DoiThong", void 0);
  o([R(sp.SkeletonData)], e.prototype, "anim6Doi", void 0);
  o([R(sp.SkeletonData)], e.prototype, "anim6DoiThong", void 0);
  o([R(sp.SkeletonData)], e.prototype, "animDongHoa", void 0);
  o([R(sp.SkeletonData)], e.prototype, "animSanhRong", void 0);
  o([R(sp.SkeletonData)], e.prototype, "animSanhRongDongHoa", void 0);
  o([R(sp.SkeletonData)], e.prototype, "animTuQuy", void 0);
  o([R(sp.SkeletonData)], e.prototype, "animNhat", void 0);
  o([R(sp.SkeletonData)], e.prototype, "animNhi", void 0);
  o([R(sp.SkeletonData)], e.prototype, "animBa", void 0);
  o([R(sp.SkeletonData)], e.prototype, "animBet", void 0);
  o([R(sp.SkeletonData)], e.prototype, "animThoi", void 0);
  o([R(sp.SkeletonData)], e.prototype, "animGietCong", void 0);
  o([R(sp.SkeletonData)], e.prototype, "animDutMu", void 0);
  return e = o([D], e);
}(r.default);
i.default = L;
void 0;
