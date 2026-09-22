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
  s = require("GameBaseController"),
  r = require("MessageCardGameHandler"),
  c = require("SamLocRemakeMessage"),
  l = require("GameCardSprite"),
  h = require("CardSet"),
  u = require("GameUtils"),
  d = require("PoolManager"),
  p = require("GamePlayManager"),
  f = require("MoneyUI"),
  g = require("StringUtil"),
  m = require("GameZOrder"),
  y = require("SamLocRemakeRequestHandler"),
  S = require("SamLocRemakeCardBlockHelper"),
  _ = require("SamLocRemakeRecommendCardsHelper"),
  v = require("SamLocRemakeConstant"),
  b = require("SamLocRemakeCardsTypeHelper"),
  C = require("SamLocRemakeBaoSamProgressBar"),
  T = require("CommonPrefabsManager"),
  E = require("SamLocRemakeCardLib"),
  I = require("MusicPlayer"),
  A = require("GameConfigManager"),
  P = require("GameController"),
  M = require("GameDefine"),
  O = require("VersionController"),
  N = cc._decorator,
  B = N.ccclass,
  D = N.property;
(function(t) {
  t[t.NONE = 0] = "NONE";
  t[t.DANH_BAI = 1] = "DANH_BAI";
  t[t.BO_LUOT = 2] = "BO_LUOT";
  t[t.DANG_CO_LUOT = 3] = "DANG_CO_LUOT";
})(a = i.ESamLocRemakePlayerState || (i.ESamLocRemakePlayerState = {}));
var R = function(t) {
  function e() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.prefabCardSet = null;
    e.background = null;
    e.listCardPositionUI = [];
    e.listBtnMain = null;
    e.btnBoLuot = null;
    e.btnDanhBai = null;
    e.btnBaoSam = null;
    e.btnHuyBaoSam = null;
    e.prefabMoneyUI = null;
    e.skeletonEffect = null;
    e.nodeDanhBaiAction = null;
    e.AnSam = null;
    e.BiBatSam = null;
    e.ChanSam = null;
    e.Den = null;
    e.GietCong = null;
    e.Hoa = null;
    e.Thoi = null;
    e.animTuQuy2 = null;
    e.anim3DoiThong = null;
    e.anim4DoiThong = null;
    e.animDongHoa = null;
    e.animSanhRong = null;
    e.animSanhRongDongHoa = null;
    e.animTuQuy = null;
    e.anim5Doi = null;
    e.baoSamProgressBar = null;
    e.myCardSet = null;
    e.mapOtherPlayerCardSet = null;
    e.poolCardSet = null;
    e.poolCard = null;
    e.smallCardScale = .6;
    e.isNewRound = false;
    e.listBoLuotPlayer = [];
    e.timeForTurn = 20;
    e.timeBaoSam = 10;
    e.isReconnect = false;
    e.listCardSetOnTable = [];
    e.listOtherPlayerCard = [];
    e.playerPlaying = null;
    e.listRecommendCards = [];
    e.isMyTurn = false;
    e.listCardOnTable = [];
    e.indexChatHeo = 0;
    e.isEndGame = false;
    e.isDealCard = false;
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
    p.default.getInstance().gameID = r.GAME.SAM;
    t.prototype.onLoad.call(this);
    this.myCardSet = cc.instantiate(this.prefabCardSet).getComponent(h.default);
    this.mapOtherPlayerCardSet = new u.MapString();
    this.poolCardSet = d.PoolManager.getInstance().addPool("poolCardSetSamLocRemake", new d.PoolComponent());
    this.poolCard = d.PoolManager.getInstance().addPool("poolCardSamLocRemake", new d.PoolComponent());
    this.myCardSet.node.parent = this.node;
    this.myCardSet.node.zIndex = m.default.TOP;
    this.myCardSet.node.anchorX = 0;
    this.myCardSet.node.position = new cc.Vec2(-cc.winSize.width / 2 + 380, this.listBtnInvitePos[0].y - 15);
    this.baoSamProgressBar.progressBar = this.cardGameTableController.countDownActionProgressTo.progressBar;
    this.baoSamProgressBar.boundProgressBar = this.baoSamProgressBar.progressBar.node;
    this.cardGameTableController.countDownActionProgressTo.stopAllActions();
    this.cardGameTableController.countDownActionProgressTo.enabled = false;
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
    this.POS5 = [];
    this.POS5.push(0);
    this.POS5.push(1);
    this.POS5.push(2);
    this.POS5.push(3);
    this.POS5.push(4);
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
    return "samloc";
  };
  e.prototype.getNameGame = function() {
    return "S\xc2M L\u1ed0C";
  };
  e.prototype.getSpriteFrameName = function() {
    return this.background;
  };
  e.prototype.getListChatDefaultText = function() {
    return ["\u0110\xe1nh l\u1eb9 \u0111i c\xf2n \u0111\u1ee3i g\xec n\u1eefa?", "S\xe2m n\xe0y ai ngon ch\u1eb7n \u0111i",
      "R\u1ed3i \u0111i b\xe1n mu\u1ed1i lu\xf4n", "Cho e h\xfap v\xe1n n\xe0y nha :))", "Ch\u01a1i hay ngh\u1ec9 \u0111\xe2y",
      "\xc2y da b\xe0i m\u1ea1nh ta", "B\xe0i n\xe0y ch\u1ea5p h\u1ebft nh\xe9!", "\u0110\u1eadu xanh b\xe0i to\xe0n r\xe1c",
      "B\xe1c l\u1ea1i 'nh\u1eb9' tay n\u1eefa r\u1ed3i", "Kh\xf4ng \u0111\xe1nh th\xec b\u1ecf l\u01b0\u1ee3t deee",
      "B\xe0i ch\xfa m\u1ea1nh nh\u01b0ng anh r\u1ea5t ti\u1ebfc", "T\u01b0\u1edfng ngon.. ai d\xe8.. \u0110au vl",
      "Th\u1eadt kh\xf4ng th\u1ec3 tin n\u1ed5i", "Ai kh\xf3c cho n\u1ed7i \u0111au n\xe0y", "\u0110en h\u1ebft n\xf3i",
      "H\xf4m nay ch\u01a1i l\u1edbn n\xe8!", "\u0110\xe1nh l\u1eb9 \u0111i c\xf2n ch\u01a1i v\xe1n kh\xe1c", "V\xe2ng, em xin"
    ];
  };
  e.prototype.getCmdStart = function() {
    return r.Global_Message.INGAME_USER_READY;
  };
  e.prototype.hide = function() {
    this.reset();
    t.prototype.hide.call(this);
  };
  e.prototype.onGetInGameTableInfo = function(e) {
    if (null !== e && void 0 !== e && 2 === e.Mu && (this.isGameAnDanh = false, this.isGameAnDanhCheck = false), t.prototype
      .onGetInGameTableInfo.call(this, e), void 0 != e.tft ? this.timeForTurn = e.tft / 1e3 : this.timeForTurn = 20, void 0 != e.tfbs ?
      this.timeBaoSam = e.tfbs / 1e3 : this.timeBaoSam = 10, this.timeBaoSam -= .5, 3 == e.gS) {
      if (this._thisPlayerView.isPlaying) {
        this._thisPlayerView.node.stopAllActions();
        this._thisPlayerView.node.setPosition(-cc.winSize.width / 2 + 160, this.listBtnInvitePos[0].y);
      }
      this._thisPlayerView.iconnReady.active = false;
      if (null != this.cardGameTableController) {
        this.cardGameTableController.readyBtn.active = false;
      }
      for (var i = 0; i < this.players.length; i++) {
        this.players[i].iconnReady.active = false;
      }
    } else {
      if (null != this.cardGameTableController) {
        this.cardGameTableController.stopProgressStartGame();
      }
    }
    this.isDealCard = false;
    this.isEndGame = false;
    if (3 == this.gameState && this.state == r.GameState.WAITING || this.state == r.GameState.VIEWING) {
      this.showViewTableMessage();
      this.baoSamProgressBar.stopBaoSamProgressBar();
    }
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
    return new cc.Vec2(P.posOutScreen.x, P.posOutScreen.y);
  };
  e.prototype.onReconnect = function(e) {
    t.prototype.onReconnect.call(this, e);
    this.onJoinRoomPlaying(e.cmd, e);
    this._thisPlayerView.node.stopAllActions();
    this._thisPlayerView.node.setPosition(-cc.winSize.width / 2 + 160, this.listBtnInvitePos[0].y);
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
      } else {
        if (5 === n) {
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
  e.prototype.autoSendReady = function() {
    t.prototype.autoSendReady.call(this);
  };
  e.prototype.onJoinRoomPlaying = function(e, i) {
    t.prototype.onJoinRoomPlaying.call(this, e, i);
    this.autoSendReady();
    this.reset();
    this.listBtnMain.active = false;
    this.btnBaoSam.active = false;
    this.btnHuyBaoSam.active = false;
    this.isNewRound = false;
    for (var n = this.isGameAnDanhCheck, o = 0; o < i.ps.length; ++o) {
      var s = i.ps[o];
      if (0 == s.uid.localeCompare(p.default.getInstance().userID) && void 0 != s.cs && s.cs.length > 0) {
        n = false;
      }
    }
    var c = false,
      l = false;
    if (void 0 != i.ps) {
      if (void 0 != i.ldc) {
        if (i.ldc.length > 0) {
          this.clearListCardSetOnTable();
          var h = this.createCardSet();
          h.setListCards(i.ldc, false, null, n);
          h.setCardScale(this.smallCardScale);
          h.node.parent = this.node;
          h.node.x = 0;
          h.node.y = 0;
          h.node.zIndex = 1;
          this.listCardSetOnTable.push(h);
          this.listCardOnTable = h.listCardNodes;
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
      for (var u = 0; u < i.ps.length; u++) {
        var d = i.ps[u],
          f = this.getPlayer(d.uid);
        if (void 0 != d.pi && 1 == d.pi) {
          this.playersPlaying.push(f);
          this.isDealCard = true;
        }
      }
      for (var y = 0; y < i.ps.length; y++) {
        var S = i.ps[y];
        if ((f = this.getPlayer(S.uid)).remainingCards = S.rmC, f.state = S.pS, f.isHost = void 0 != S.C && S.C, S.uid == this
          ._thisPlayerView.userID) {
          if (null != this.myCardSet) {
            this.myCardSet.reset();
          }
          if (void 0 != S.cs && S.cs.length > 0) {
            this.state = r.GameState.PLAYING;
            this.myCardSet.isSelectOneCard = false;
            this.myCardSet.setListCards(S.cs);
            this.myCardSet.setCardClick(true, this.onCardSelected.bind(this));
            this.myCardSet.setCardSelectedCallback(this.onCardSelected.bind(this));
            this.myCardSet.node.active = true;
          }
          c = S.ib;
          l = S.icbs;
        } else if (f.isPlaying) {
          var _ = this.createCard();
          _.node.parent = this.node;
          _.node.position = this.listCardPositionUI[f.indexPos].position;
          _.node.zIndex = m.default.TOP;
          _.setScale(this.smallCardScale);
          this.listOtherPlayerCard.push(_);
        }
        if (this.checkAndShowPlayerStateWhenReconnect(f, S.ib, 1 === S.rmC, S.icbs, i.gS), f.state == a.DANG_CO_LUOT) {
          var v = i.rmT / 1e3;
          f.startCountDown(v, 1 - v / this.timeForTurn);
          if (f.userID == this._thisPlayerView.userID) {
            this.listBtnMain.active = true;
            this.btnDanhBai.active = true;
            this.btnBoLuot.active = true;
            this.isMyTurn = true;
          }
        } else {
          if (f.state == a.BO_LUOT) {
            this.addBoLuotPlayer(f);
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
        if (this._thisPlayerView.state == a.DANG_CO_LUOT) {
          this.checkRecommend(this.listCardOnTable);
        }
      }
      if (!(0 != this._thisPlayerView.isPlaying || this.state != r.GameState.VIEWING && 3 != i.gS)) {
        this._thisPlayerView.runViewAction();
      }
    }
    if (this._thisPlayerView.isPlaying && this.state == r.GameState.PLAYING && 3 == i.gS) {
      if (!(l || c)) {
        this.btnBaoSam.active = true;
        this.btnHuyBaoSam.active = true;
      }
      this.listBtnMain.active = true;
    }
    this.showuserAnDanh();
    for (o = 0; o < this.players.length; ++o) {
      var b = this.players[o];
      if (b.isAnDanh) {
        b.stopCountDown();
      }
    }
    if (false === this.checkNeedRemoveAnnDanh() && 3 === this.players.length && g.default.getRandomInt(100) < 70) {
      this.showHideuserAnDanh4(true);
    }
    if (this._thisPlayerView.isPlaying && this.state == r.GameState.VIEWING && 3 == i.gS) {
      this.baoSamProgressBar.stopBaoSamProgressBar();
    }
  };
  e.prototype.handleErrorMessage = function(t) {
    if (void 0 != t && null != t && 0 != t.length) {
      T.default.getInstance().showPopupMessageUtil(t);
    }
  };
  e.prototype.onReceiveMessage = function(e, i, n) {
    switch (t.prototype.onReceiveMessage.call(this, e, i, n), e) {
      case r.Global_Message.ERROR_MESSAGE:
        break;
      case r.Global_Message.INGAME_USER_READY:
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
      case c.default.DEAL_CARDS:
        this.isDealCard = false;
        this.dealCards(e, n);
        this.setDelayLeaveRoom();
        break;
      case c.default.DANH_BAI:
        this.changeTurn(e, n, false);
        break;
      case c.default.PASS:
        break;
      case c.default.BAO_SAM:
        this.baoSam(n);
        break;
      case c.default.HUY_BAO_SAM:
        this.huyBaoSam(n);
        break;
      case c.default.FINISH_GAME:
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
      if (2 == e.length && (i = Math.abs(e[1].getNSam() - e[0].getNSam())) > 1 && (e[0].getNSam() != t.getNSam() ? e[0].setCardSelected(
          false, true) : e[1].setCardSelected(false, true)), this.listRecommendCards.length > 0) {
        for (var n = false, o = (this.listCardOnTable.length, 0); o < this.listRecommendCards.length; o++) {
          for (var a = this.listRecommendCards[o], s = 0; s < a.length; s++) {
            if ((l = a[s]).serverCode != t.serverCode || 0 != n) {
              if (n) {
                l.setCardSelected(true);
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
        var r = false,
          c = 0;
        for (o = 0; o < e.length; o++) {
          if (e[o].getNSam() > c) {
            c = e[o].getNSam();
          }
        }
        for (o = 0; o < this.myCardSet.listCardNodes.length; o++) {
          var l = this.myCardSet.listCardNodes[o],
            h = this.myCardSet.listCardNodes[o + 1];
          if (!(void 0 != h && l.N == h.N && l.S < h.S)) {
            if (15 != l.N && l.N - c == 1) {
              c = l.N;
              r = true;
              l.setCardSelected(true, true);
              e = this.myCardSet.getListCardSelected();
            }
          }
        }
        if (!r) {
          if (e[0].getNSam() != t.getNSam()) {
            e[0].setCardSelected(false, true);
          } else {
            e[1].setCardSelected(false, true);
          }
        }
      } else if (0 == i) {
        for (o = 0; o < this.myCardSet.listCardNodes.length; o++) {
          if (0 == (l = this.myCardSet.listCardNodes[o]).isSelected && l.N == e[0].N) {
            l.setCardSelected(true, true);
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
    this.reset();
    this.listCardOnTable = [];
    this.listRecommendCards = [];
    var o = e.cs,
      a = e.lpi,
      s = [];
    if (void 0 != e.ps && void 0 != e.ps) {
      e.ps;
    }
    if (void 0 == o) {
      for (var c = 0; c < e.ps.length; c++) {
        if ((l = this.getPlayer(e.ps[c].uid)).isMine()) {
          o = e.ps[c].cs;
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
    if (void 0 != e.ps && e.ps.uid == this._thisPlayerView.userID) {
      this.listBtnMain.active = true;
      this.btnDanhBai.active = false;
      this.btnBoLuot.active = false;
    } else {
      this.listBtnMain.active = false;
    }
    for (c = 0; c < this.players.length; c++) {
      this.players[c].iconnReady.active = false;
      this.players[c].iconQuit.active = false;
      this.players[c].removeBubbleFx();
    }
    this.state = r.GameState.VIEWING;
    this._thisPlayerView.isPlaying = false;
    for (c = 0; c < this.playersPlaying.length; c++) {
      var l;
      if ((l = this.playersPlaying[c]).userID == this._thisPlayerView.userID) {
        this.state = r.GameState.PLAYING;
        this._daNgoi = true;
        this._dangPhatBai = true;
        this._thisPlayerView.isPlaying = true;
        this._thisPlayerView.node.stopAllActions();
        this._thisPlayerView.node.runAction(cc.moveTo(.4, -cc.winSize.width / 2 + 160, this.listBtnInvitePos[0].y).easing(cc
          .easeExponentialOut()));
      }
      for (var h = function(t) {
          var e = u.createCard();
          e.node.parent = u.node;
          e.node.position = cc.Vec2.ZERO;
          e.setScale(1);
          l.remainingCards = 10;
          if (l.userID == u._thisPlayerView.userID) {
            e.setTextureWithCode(o[t], r.GAME.SAM);
            s.push(e);
          } else {
            e.node.zIndex = m.default.TOP;
            e.setScale(u.smallCardScale);
            e.node.runAction(cc.sequence(cc.delayTime(.06 * t), cc.moveTo(.3, u.listCardPositionUI[l.indexPos].position), cc.callFunc(
              function() {
                if (0 != t) {
                  this.poolCard.addObject(e);
                } else {
                  this.listOtherPlayerCard.push(e);
                  if (9 == t) {
                    this._dangPhatBai = false;
                  }
                }
              }.bind(u))));
          }
        }, u = this, d = 0; d < 10; d++) {
        h(d);
      }
    }
    if (this._thisPlayerView.isPlaying) {
      this.myCardSet.setListGameCard(s, true, .1, .3, true, true);
      this.myCardSet.isSelectOneCard = false;
      this.myCardSet.setCardClick(false);
      this.scheduleOnce(function() {
        n._dealCardCallBack(.1 * s.length);
      }, .1 * s.length);
      this.myCardSet.callbackCardSetReady = function() {
        n.myCardSet.setCardClick(true, n.onCardSelected.bind(n));
      };
    } else {
      this._dangPhatBai = false;
      this._thisPlayerView.runViewAction();
    }
    this.showuserAnDanh();
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
    var o = this.getPlayer(e.tP.uid);
    if (void 0 != e.fP) {
      var s = this.getPlayer(e.fP.uid),
        r = this.getPlayer(e.fP.puid),
        c = e.fP.mX,
        l = e.fP.lm;
      if (false === this.isGameAnDanhCheck && o.startCountDown(this.timeForTurn), o.userID == this._thisPlayerView.userID ? (this
          .listBtnMain.active = true, this.btnBoLuot.active = true, this.btnDanhBai.active = true, this.isMyTurn = true) : (this
          .listBtnMain.active = false, this.isMyTurn = false), s.stopCountDown(), s.state = e.fP.pS, o.state = e.tP.pS, this
        ._thisPlayerView.state == a.BO_LUOT ? this.myCardSet.setBlackFace(true) : this.myCardSet.setBlackFace(false), s.state == a
        .DANH_BAI) {
        this.isNewRound = false;
        s.remainingCards -= e.fP.dCs.length;
        var h = 0;
        if (true === this.isGameAnDanhCheck ? (h = g.default.getRandomArbitrary(4, 5), this.nodeDanhBaiAction.runAction(cc.sequence(cc
            .delayTime(h), cc.callFunc(function() {
              n.danhBai(s, e.fP.dCs, o, r, c, l);
            })))) : this.danhBai(s, e.fP.dCs, o, r, c, l), void 0 != e.rfu) {
          var u = this.getPlayer(e.rfu.uid),
            d = e.rfu.m,
            p = e.rfu.mX;
          this.refundMoney(u, d, p);
        }
      } else if (s.state == a.BO_LUOT) {
        this.addBoLuotPlayer(s);
        var f = 0 != s.indexPos && 3 != s.indexPos && 4 != s.indexPos;
        if (false === this.isGameAnDanhCheck && s.showBubbleFx("B\u1ecf l\u01b0\u1ee3t", 0, true, f), I.default.getInstance()
          .playEffect("Sounds/gameto/sfx_gameto_fold"), s.userID == this._thisPlayerView.userID) {
          for (var m = 0; m < this.myCardSet.listCardNodes.length; m++) {
            var y = this.myCardSet.listCardNodes[m];
            if (1 == y.isSelected) {
              y.setCardSelected(false, true);
            }
          }
        }
        if (this.isNewRound) {
          this.onNewRound();
          if (o.userID == this._thisPlayerView.userID) {
            this.btnBoLuot.active = false;
          }
        } else {
          if (o.userID == this._thisPlayerView.userID) {
            this.checkRecommend(this.listCardOnTable);
          }
        }
      }
      if (1 == s.remainingCards) {
        f = 0 != s.indexPos && 3 != s.indexPos && 4 != s.indexPos;
        if (false === this.isGameAnDanhCheck) {
          s.showBubbleSpecialFx("B\xe1o 1", 1, true, f);
        }
      }
    } else {
      if (void 0 != e.tP.ib && 1 == e.tP.ib) {
        this.baoSam(e.tP);
      }
      this.baoSamProgressBar.stopBaoSamProgressBar();
      this.btnBaoSam.active = false;
      this.btnHuyBaoSam.active = false;
      if (false === this.isGameAnDanhCheck) {
        o.startCountDown(this.timeForTurn);
      }
      if (o.userID == this._thisPlayerView.userID) {
        this.listBtnMain.active = true;
        this.btnBoLuot.active = false;
        this.btnDanhBai.active = true;
        this.isMyTurn = true;
      } else {
        this.listBtnMain.active = false;
        this.isMyTurn = false;
      }
      o.state = e.tP.pS;
      for (m = 0; m < this.playersPlaying.length; m++) {
        this.playersPlaying[m].removeBubbleFx();
      }
      this.onNewRound();
    }
    this.playerPlaying = o;
  };
  e.prototype.danhBai = function(t, e, i, n, o, a) {
    I.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_btn_danhbai");
    if (this.checkNeedSortListCard(e)) {
      e.sort(this.compareNumbers);
    }
    if (void 0 != o && 0 != o && null != t) {
      this.showMoneyForPlayer(t, o);
    }
    if (void 0 != a && 0 != a && null != n) {
      this.showMoneyForPlayer(n, a);
    }
    var s = g.default.getRandomInt(100) - 75,
      r = g.default.getRandomInt(100) - 50,
      c = this.createCardSet();
    c.node.parent = this.node;
    c.node.position = new cc.Vec2(s, r);
    c.node.zIndex = m.default.TOP + this.listCardSetOnTable.length + 1;
    var l = [];
    if (t.userID == this._thisPlayerView.userID) {
      l = this.myCardSet.getListCardObject(e, true);
      c.resetCardState();
      c.setScaleDefault(this.smallCardScale, true);
      c.setListGameCard(l, false, 0, .6);
      c.setCardSelectedCallback(null);
      c.setCardClick(false);
      this.listCardOnTable = l;
    } else {
      c.setScaleDefault(this.smallCardScale);
      var h = this.listCardPositionUI[t.indexPos].parent.convertToWorldSpaceAR(this.listCardPositionUI[t.indexPos].position);
      if (true === this.isGameAnDanhCheck && e.length > 1) {
        var u = g.default.getRandomInt(e.length - 1) + 1;
        if (u > 0) {
          e.splice(e.length - u, u);
        }
      }
      c.setListCardWithAnimation(e, h, null, .6, this.isGameAnDanhCheck);
      this.listCardOnTable = c.listCardNodes;
    }
    for (var d = 0; d < this.listCardSetOnTable.length; d++) {
      this.listCardSetOnTable[d].setBlackFace(true);
    }
    this.listCardSetOnTable.push(c);
    c.setBlackFace(false);
    if (null != i && i.userID == this._thisPlayerView.userID) {
      this.checkRecommend(c.listCardNodes);
    }
    this.checkAndShowEffect(this.listCardOnTable);
  };
  e.prototype.checkRecommend = function(t) {
    if (this._thisPlayerView.state != a.BO_LUOT) {
      this.myCardSet.setBlackFace(true);
    }
    for (var e = false, i = S.getListRecommendCards(t, this.myCardSet.listCardNodes), n = S.getAllowedCardsToPlay(t, i), o = 0; o < n
      .length; o++) {
      n[o].setBlackFace(false);
      e = true;
    }
    for (o = 0; o < this.myCardSet.listCardNodes.length; o++) {
      if (this.myCardSet.listCardNodes[o].isBlackFace) {
        this.myCardSet.listCardNodes[o].setCardSelected(false);
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
    if (void 0 === e && (e = v.RANK_SAM.NONE), !this.isGameAnDanhCheck) {
      var i = null,
        n = "animation",
        o = "";
      if (e == v.RANK_SAM.NONE) {
        switch (_.getCardType(t)) {
          case v.CARD_TYPE.FOUR_OF_A_KIND:
            this.playSfxChatHeo();
            i = Object.create(this.animTuQuy);
            break;
          case v.CARD_TYPE.FOUR_PAIRS_STRAGHT:
            this.playSfxChatHeo();
            i = Object.create(this.anim4DoiThong);
            break;
          case v.CARD_TYPE.THREE_PAIRS_STRAIGHT:
            this.playSfxChatHeo();
            i = Object.create(this.anim3DoiThong);
            break;
          default:
            this.indexChatHeo = 0;
        }
      } else {
        switch (I.default.getInstance().playEffect("Sounds/sfx_jackpot"), e) {
          case v.RANK_SAM.TU_QUY_2:
            i = Object.create(this.animTuQuy2);
            break;
          case v.RANK_SAM.SANH_RONG_DONG_HOA:
            i = Object.create(this.animSanhRongDongHoa);
            o = "Loop";
            n = "Start";
            break;
          case v.RANK_SAM.DONG_HOA:
            i = Object.create(this.animDongHoa);
            break;
          case v.RANK_SAM.SANH_RONG:
            i = Object.create(this.animSanhRong);
            o = "Loop";
            n = "Start";
            break;
          case v.RANK_SAM.BA_XAM:
            break;
          case v.RANK_SAM.NAM_DOI:
            i = Object.create(this.anim5Doi);
            o = "Loop";
            n = "Start";
        }
      }
      if (null != i) {
        this.skeletonEffect.node.active = true;
        this.skeletonEffect.node.zIndex = m.default.TL_EFFECT;
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
  e.prototype.checkAndShowEffectLoseType = function(t, e) {
    if (!this.isGameAnDanhCheck) {
      var i = null,
        n = "Start",
        o = false;
      switch (e) {
        case v.LOST_TYPE_RANK.ANSAM:
          t.node.position = new cc.Vec2(0, 100);
          t.node.scale = .35;
          i = Object.create(this.AnSam);
          break;
        case v.LOST_TYPE_RANK.BIBATSAM:
          t.node.position = new cc.Vec2(0, 100);
          t.node.scale = .35;
          i = Object.create(this.BiBatSam);
          break;
        case v.LOST_TYPE_RANK.CHANSAM:
          t.node.position = new cc.Vec2(0, 100);
          t.node.scale = .35;
          i = Object.create(this.ChanSam);
          break;
        case v.LOST_TYPE_RANK.CONG:
          t.node.position = new cc.Vec2(4, -19.487);
          t.node.scale = 1;
          n = "animation";
          i = Object.create(this.GietCong);
          o = true;
          break;
        case v.LOST_TYPE_RANK.DEN:
          t.node.position = new cc.Vec2(0, 100);
          t.node.scale = .35;
          i = Object.create(this.Den);
          break;
        case v.LOST_TYPE_RANK.HOA:
          t.node.position = new cc.Vec2(0, 100);
          t.node.scale = .35;
          break;
        case v.LOST_TYPE_RANK.THOI:
          t.node.position = new cc.Vec2(0, 100);
          t.node.scale = .35;
          n = "animation";
          i = Object.create(this.Thoi);
      }
      if (null != i) {
        t.node.active = true;
        t.node.zIndex = m.default.TL_EFFECT;
        t.skeletonData = i;
        t.setAnimation(0, n, o);
        t.setCompleteListener(function() {
          this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(function() {
            t.node.active = false;
          }.bind(this))));
        }.bind(this));
      }
    }
  };
  e.prototype.showMoneyForPlayer = function(t, e) {
    if (!this.isGameAnDanhCheck && null != t) {
      var i = cc.instantiate(this.prefabMoneyUI).getComponent(f.default);
      i.setMoney(e);
      i.show(r.GAME.TIENLEN, 3, true);
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
    if (this.listBoLuotPlayer.length >= this.playersPlaying.length - 1) {
      this.listBoLuotPlayer = [];
      this.isNewRound = true;
    }
  };
  e.prototype.onNewRound = function() {
    this.listRecommendCards = [];
    this.listCardOnTable = [];
    this.isNewRound = true;
    this.myCardSet.setBlackFace(false);
    for (var t = function(t) {
        var i = e.playersPlaying[t];
        i.state = a.DANH_BAI;
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
    this.clearListGameCardOfOthers();
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
      o.removeBubbleSpecialFx();
      var a = e.fP.mX,
        s = e.fP.lm;
      if (void 0 != e.fP.sm && (a = e.fP.sm, s = e.fP.lm), this.danhBai(o, e.fP.dCs, null, null, a, s), void 0 != e.rfu) {
        var c = this.getPlayer(e.rfu.uid),
          l = e.rfu.m,
          h = e.rfu.mX;
        this.refundMoney(c, l, h);
      }
      if (false === this.isGameAnDanhCheck) {
        if (a > 0) {
          o.runWinAction(this.timeToFinish);
          I.default.getInstance().playEffect("Sounds/sfx_win");
        } else {
          I.default.getInstance().playEffect("Sounds/tlmn/sfx_tlmn_lose");
        }
        if (void 0 != e.fP.m) {
          o.setMoney(e.fP.m);
        }
      }
      this.checkAndShowEffectLoseType(o.skeletonEffect, e.fP.lt);
    }
    for (var u = 0; u < e.ps.length; u++) {
      if (void 0 != e.ps[u].wcr) {
        true;
        this._khongThaoTac = false;
        break;
      }
    }
    var d = function(o) {
        var a = p.getPlayer(e.ps[o].uid);
        a.stopCountDown();
        a.removeBubbleFx();
        a.removeBubbleSpecialFx();
        var s = e.ps[o].wcr,
          c = "";
        switch (s) {
          case 1:
            c = "\u0110\u1ed3ng Hoa";
            break;
          case 2:
            c = "T\u1ee9 Qu\xfd 2";
            break;
          case 3:
            c = "3 X\xe1m";
            break;
          case 4:
            c = "5 \u0110\xf4i";
            break;
          case 5:
            c = "S\u1ea3nh R\u1ed3ng";
            break;
          case 6:
            c = "S\u1ea3nh R\u1ed3ng \u0110\u1ed3ng Hoa";
        }
        if (c.length > 0) {
          p.playersPlaying = [];
          for (var l = 0; l < e.ps.length; l++) {
            p.playersPlaying.push(p.getPlayer(e.ps[l].uid));
          }
          p.dealCards(t, e, true);
          n = i = 1.5;
        }
        p.node.runAction(cc.sequence(cc.delayTime(n), cc.callFunc(function() {
          if (a.userID != this._thisPlayerView.userID) {
            var t = this.createCardSetFinish(a);
            t.node.parent = this.node;
            t.node.zIndex = m.default.TOP;
            t.node.position = this.getCardSetPosition(a);
            t.setListCards(e.ps[o].cs, false, null, this.isGameAnDanhCheck);
            t.setCardScale(this.smallCardScale);
            t.setBlackFace(false);
          }
          var i = e.ps[o].mX;
          if (void 0 != e.ps[o].sm && (i = e.ps[o].sm), c.length > 0 && false === this.isGameAnDanhCheck) {
            var n = 0 != a.indexPos && 3 != a.indexPos && 4 != a.indexPos;
            a.showBubbleFx(c, 0, true, n);
            if (i > 0) {
              this.checkAndShowEffect(null, s);
            }
            this.clearListGameCardOfOthers();
          }
          if (false === this.isGameAnDanhCheck) {
            if (i > 0 ? (a.runWinAction(this.timeToFinish), I.default.getInstance().playEffect("Sounds/sfx_win")) : I.default
              .getInstance().playEffect("Sounds/tlmn/sfx_tlmn_lose"), void 0 != i && 0 != i) {
              var l = cc.instantiate(this.prefabMoneyUI).getComponent(f.default);
              l.node.parent = this.node;
              l.node.zIndex = a.node.zIndex + 1;
              l.node.position = a.node.position;
              l.setMoney(i);
              l.show(r.GAME.TIENLEN, this.timeToFinish, true);
            }
            if (void 0 != e.ps[o].m) {
              a.setMoney(e.ps[o].m);
            }
            this.checkAndShowEffectLoseType(a.skeletonEffect, e.ps[o].lt);
          }
        }.bind(p))));
      },
      p = this;
    for (u = 0; u < e.ps.length; u++) {
      d(u);
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
    O.default.getInstance().CheckForceUpdateByGameScene(M.GameConfigs.SceneName.SamLoc);
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
        (e = this.listBtnInvitePos[3].position).y -= 80;
        break;
      case 4:
        (e = this.listBtnInvitePos[4].position).x += 120;
    }
    return e;
  };
  e.prototype.createCardSet = function() {
    var t = this.poolCardSet.getObject();
    if (null == t) {
      t = cc.instantiate(this.prefabCardSet).getComponent(h.default);
      this.poolCardSet.addObjectUsing(t);
    }
    t.setHorizontalLayout();
    t.setBlackFace(false);
    t.node.active = true;
    return t;
  };
  e.prototype.createCardSetFinish = function(t) {
    var e = this.createCardSet();
    if (2 == t.indexPos || 3 == t.indexPos) {
      e.setHorizontalLayout();
    } else {
      e.setVerticalLayout();
      e.layout.spacingY = -55;
    }
    return e;
  };
  e.prototype.createCard = function() {
    var t = this.poolCard.getObject();
    if (null == t) {
      t = cc.instantiate(this.prefabsGameCard).getComponent(l.default);
      this.poolCard.addObjectUsing(t);
    }
    t.node.active = true;
    t.node.opacity = 255;
    t.node.stopAllActions();
    t.reset();
    t.setClickEnabled(false);
    t.setColor(cc.color(255, 255, 255));
    return t;
  };
  e.prototype.onBtnBoLuot = function() {
    y.default.getInstance().requestBoLuot();
    this._khongThaoTac = false;
  };
  e.prototype.onBtnDanhBai = function() {
    if (this._khongThaoTac = false, 0 != this.myCardSet.getListCardSelected().length) {
      if (this.myCardSet.getListCardSelected().length >= 2) {
        if (E.sortVector(this.myCardSet.getListCardSelected(), false), b.isPairs(this.myCardSet.getListCardSelected()) || b
          .isThreeOfAKind(this.myCardSet.getListCardSelected()) || b.isFourOfAKind(this.myCardSet.getListCardSelected()) || b
          .isStraight_Sam(this.myCardSet.getListCardSelected()) || b.isThreePairsStraight(this.myCardSet.getListCardSelected())) {
          if (this.listCardOnTable.length > 0 && _.getRecommendCards(this.listCardOnTable, this.myCardSet.getListCardSelected())
            .length != this.myCardSet.getListCardSelected().length) {
            return void T.default.getInstance().showPopupMessageUtil("B\xe0i \u0111\xe1nh kh\xf4ng h\u1ee3p l\u1ec7!");
          }
        } else {
          if (!b.isFourPairsStraight(this.myCardSet.getListCardSelected())) {
            return void T.default.getInstance().showPopupMessageUtil("B\xe0i \u0111\xe1nh kh\xf4ng h\u1ee3p l\u1ec7!");
          }
          if (this.listCardOnTable.length > 0) {
            var t = _.getRecommendCards(this.listCardOnTable, this.myCardSet.getListCardSelected());
            if (6 != t.length && 8 != t.length) {
              return void T.default.getInstance().showPopupMessageUtil("B\xe0i \u0111\xe1nh kh\xf4ng h\u1ee3p l\u1ec7!");
            }
          }
        }
      } else if (1 == this.myCardSet.getListCardSelected().length && this.listCardOnTable.length > 1) {
        return void T.default.getInstance().showPopupMessageUtil("B\xe0i \u0111\xe1nh kh\xf4ng h\u1ee3p l\u1ec7!");
      }
      y.default.getInstance().requestDanhBai(this.myCardSet.getListCardIDSelected());
    } else {
      T.default.getInstance().showPopupMessageUtil("B\u1ea1n ch\u01b0a ch\u1ecdn b\xe0i \u0111\u1ec3 \u0111\xe1nh!");
    }
  };
  e.prototype.onBtnBaoSam = function() {
    I.default.getInstance().playbtnClick();
    y.default.getInstance().requestBaoSam();
    this._khongThaoTac = false;
  };
  e.prototype.onBtnHuyBaoSam = function() {
    I.default.getInstance().playbtnClick();
    y.default.getInstance().requestHuyBaoSam();
    this._khongThaoTac = false;
  };
  e.prototype._dealCardCallBack = function(t) {
    if (void 0 === t) {
      t = 0;
    }
    this.baoSamProgressBar.showBaoSamProgressBar(this.timeBaoSam - t);
    this.listBtnMain.active = true;
    this.btnBaoSam.active = true;
    this.btnHuyBaoSam.active = true;
    this.btnDanhBai.active = false;
    this.btnBoLuot.active = false;
  };
  e.prototype.baoSam = function(t) {
    if (t.uid == this._thisPlayerView.userID) {
      this.listBtnMain.active = false;
      this.btnBaoSam.active = false;
      this.btnHuyBaoSam.active = false;
    }
    var e = this.getPlayer(t.uid);
    if (void 0 != e) {
      var i = 0 != e.indexPos && 3 != e.indexPos && 4 != e.indexPos;
      if (false === this.isGameAnDanhCheck) {
        e.showBubbleSpecialFx("B\xe1o S\xe2m", 1, true, i);
      }
    }
  };
  e.prototype.huyBaoSam = function(t) {
    if (t.uid == this._thisPlayerView.userID) {
      this.listBtnMain.active = false;
      this.btnBaoSam.active = false;
      this.btnHuyBaoSam.active = false;
    }
    var e = this.getPlayer(t.uid);
    if (void 0 != e) {
      var i = 0 != e.indexPos && 3 != e.indexPos && 4 != e.indexPos;
      if (false === this.isGameAnDanhCheck) {
        e.showBubbleFx("Hu\u1ef7 B\xe1o", 1, true, i);
      }
    }
  };
  e.prototype.handlePendingPlayers = function() {
    if (t.prototype.handlePendingPlayers.call(this), this._forcedQuit) {
      this.onLogOut();
    } else if (this._forcedToLeaveRoom) {
      this.handleLeaveRoomResponse();
    } else {
      if (this._subscribedToGetOut) {
        this.state = r.GameState.WAITING;
        return void this.sendLeaveRoom();
      }
      if (p.default.getInstance().checkBaoTriGame()) {
        this.state = r.GameState.WAITING;
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
      this.state = r.GameState.WAITING;
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
    var t = this;
    this.inviteBtns.forEach(function(e) {
      e.active = 5 === t.maxUser;
    });
    if (2 === this.maxUser) {
      this.POS2.forEach(function(e) {
        t.inviteBtns[e].active = true;
      });
    }
  };
  e.prototype.showPlayerViewBauCua = function(t, e) {
    if (t.node.active !== e && this.state !== r.GameState.PLAYING) {
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
  e.prototype.clearListGameCardOfOthers = function() {
    for (var t = 0; t < this.listOtherPlayerCard.length; t++) {
      this.poolCard.addObject(this.listOtherPlayerCard[t]);
    }
    this.listOtherPlayerCard = [];
  };
  e.prototype.compareNumbers = function(t, e) {
    return t - e;
  };
  e.prototype.checkAndShowPlayerStateWhenReconnect = function(t, e, i, n, o) {
    var a = this;
    if (t) {
      var s = 0 != t.indexPos && 3 != t.indexPos && 4 != t.indexPos;
      this.scheduleOnce(function() {
        if (e && false === a.isGameAnDanhCheck) {
          t.showBubbleSpecialFx("B\xe1o S\xe2m", 1, false, s);
        }
        if (i && false === a.isGameAnDanhCheck) {
          t.showBubbleSpecialFx("B\xe1o 1", 1, false, s);
        }
        if (n && 3 == o && false === a.isGameAnDanhCheck) {
          t.showBubbleFx("Hu\u1ef7 B\xe1o", 1, false, s);
        }
      }, .1);
    }
  };
  e.prototype.checkNeedSortListCard = function(t) {
    if (t) {
      if (t.length < 3) {
        return false;
      }
      for (var e = 0; e < t.length; e++) {
        var i = Math.floor(t[e] / 4) + 1;
        if (11 === i || 12 === i || 13 === i) {
          return false;
        }
      }
      return true;
    }
    return false;
  };
  o([D(cc.Prefab)], e.prototype, "prefabCardSet", void 0);
  o([D(cc.SpriteFrame)], e.prototype, "background", void 0);
  o([D(cc.Node)], e.prototype, "listCardPositionUI", void 0);
  o([D(cc.Node)], e.prototype, "listBtnMain", void 0);
  o([D(cc.Node)], e.prototype, "btnBoLuot", void 0);
  o([D(cc.Node)], e.prototype, "btnDanhBai", void 0);
  o([D(cc.Node)], e.prototype, "btnBaoSam", void 0);
  o([D(cc.Node)], e.prototype, "btnHuyBaoSam", void 0);
  o([D(cc.Prefab)], e.prototype, "prefabMoneyUI", void 0);
  o([D(sp.Skeleton)], e.prototype, "skeletonEffect", void 0);
  o([D(cc.Node)], e.prototype, "nodeDanhBaiAction", void 0);
  o([D(sp.SkeletonData)], e.prototype, "AnSam", void 0);
  o([D(sp.SkeletonData)], e.prototype, "BiBatSam", void 0);
  o([D(sp.SkeletonData)], e.prototype, "ChanSam", void 0);
  o([D(sp.SkeletonData)], e.prototype, "Den", void 0);
  o([D(sp.SkeletonData)], e.prototype, "GietCong", void 0);
  o([D(sp.SkeletonData)], e.prototype, "Hoa", void 0);
  o([D(sp.SkeletonData)], e.prototype, "Thoi", void 0);
  o([D(sp.SkeletonData)], e.prototype, "animTuQuy2", void 0);
  o([D(sp.SkeletonData)], e.prototype, "anim3DoiThong", void 0);
  o([D(sp.SkeletonData)], e.prototype, "anim4DoiThong", void 0);
  o([D(sp.SkeletonData)], e.prototype, "animDongHoa", void 0);
  o([D(sp.SkeletonData)], e.prototype, "animSanhRong", void 0);
  o([D(sp.SkeletonData)], e.prototype, "animSanhRongDongHoa", void 0);
  o([D(sp.SkeletonData)], e.prototype, "animTuQuy", void 0);
  o([D(sp.SkeletonData)], e.prototype, "anim5Doi", void 0);
  o([D(C.default)], e.prototype, "baoSamProgressBar", void 0);
  return e = o([B], e);
}(s.default);
i.default = R;
void 0;
