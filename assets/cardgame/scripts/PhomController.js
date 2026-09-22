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
var a = require("./GameBaseController"),
  s = require("./PhomCardPack"),
  r = require("./PoolManager"),
  c = require("./CardSet"),
  l = require("./GameUtils"),
  h = require("./GameCardSprite"),
  u = require("./PhomMessageHandler"),
  d = require("./GameDefine"),
  p = require("./MessageCardGameHandler"),
  f = require("./MoneyUI"),
  g = require("./PhomRank"),
  m = require("./GameZOrder"),
  y = require("./CommonPrefabsManager"),
  S = require("./GamePlayManager"),
  _ = require("./GameConfigManager"),
  v = require("./GameCardSpriteType"),
  b = require("./StringUtil"),
  C = require("./MusicPlayer"),
  T = require("./VersionController"),
  E = cc._decorator,
  I = E.ccclass,
  A = E.property,
  P = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.background = null;
      e.listCardPositionUI = [];
      e.prefabCardSet = null;
      e.listBtnMain = null;
      e.btnDanhBai = null;
      e.btnAnBai = null;
      e.btnHaPhom = null;
      e.btnBaoU = null;
      e.btnGuiBai = null;
      e.btnRutBai = null;
      e.btnXepBai = null;
      e.phomCardPack = null;
      e.iconSelection = null;
      e.prefabMoneyUI = null;
      e.prefabPhomRank = null;
      e.poolGameCardName = "poolgamecard";
      e.poolGameCard = null;
      e.poolCardSetName = "poolcardset";
      e.poolCardSet = null;
      e.poolMoneyUIName = "poolmoneyui";
      e.poolMoneyUI = null;
      e.poolPhomRankName = "poolphomrank";
      e.poolPhomRank = null;
      e.myCardSet = null;
      e.mapCardSet = null;
      e.mapHaPhomUser = null;
      e.mapCardSetPhom = null;
      e.mapCardHighLight = null;
      e.mapPlayerPhomCount = null;
      e.smallCardScale = .5;
      e.myCardScale = 1.1;
      e.listSortCard = [];
      e.listOtherPlayerCards = [];
      e.cardHeight = 0;
      e.myCardSetPositionY = 0;
      e.paddingBottom = 30;
      e.isDealCardEd = false;
      return e;
    }
    n(e, t);
    e.prototype.initDefaultData = function() {
      t.prototype.initDefaultData.call(this);
      if (_.default.getInstance().isAnDanh) {
        this.isGameAnDanh = true;
        this.isGameAnDanhCheck = true;
      }
      this.showHideuserAnDanh4(false);
    };
    e.prototype.onLoad = function() {
      this.mapCardSet = new l.MapString();
      this.mapCardSetPhom = new l.MapInt();
      this.mapCardHighLight = new l.MapString();
      this.mapPlayerPhomCount = new l.MapString();
      this.mapHaPhomUser = new l.MapString();
      this.poolCardSet = r.PoolManager.getInstance().addPool(this.poolCardSetName, new r.PoolComponent());
      this.poolMoneyUI = r.PoolManager.getInstance().addPool(this.poolMoneyUIName, new r.PoolComponent());
      this.poolPhomRank = r.PoolManager.getInstance().addPool(this.poolPhomRankName, new r.PoolComponent());
      this.poolGameCard = r.PoolManager.getInstance().addPool(this.poolGameCardName, new r.PoolComponent());
      this.phomCardPack.node.active = false;
      this.listBtnMain.active = false;
      this.resetAllButtonState();
      t.prototype.onLoad.call(this);
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
      cc.game.on(cc.game.EVENT_HIDE, function() {
        if (null != this.myCardSet) {
          this.myCardSet.layout.updateLayout();
          this.myCardSet.setCardScale(this.myCardScale);
        }
      }.bind(this));
      this.initUserAnDanh4(true);
    };
    e.prototype.start = function() {
      t.prototype.start.call(this);
      var e = cc.instantiate(this.prefabsGameCard);
      this.cardHeight = e.height;
      e.destroy();
    };
    e.prototype.autoSendReady = function() {
      if (this._daNgoi) {
        if (!this.isHost) {
          if (this.tuDongGuiSanSang || _.default.getInstance().autoReady) {
            this.sendReady();
          } else {
            if (null != this.cardGameTableController) {
              this.cardGameTableController.readyBtn.active = true;
            }
          }
        }
      }
    };
    e.prototype.getNameGame = function() {
      return "PH\u1eceM";
    };
    e.prototype.getSpriteFrameName = function() {
      return this.background;
    };
    e.prototype.getListChatDefaultText = function() {
      return ["\u0110\xe1nh \u0111i ch\u1edd chi", "D\u1ec5 \xd9 v\xea l\xf9", "H\xf4m nay \u0111en qu\xe1",
        "\u0110\xe1nh ch\u1ecb c\xe2u em :)", "Tr\u1eddi kh\xf4ng th\u01b0\u01a1ng",
        "\u0110\xe3 m\xf3m c\xf2n b\u1ecb \u0103n Ch\u1ed1t.", "Ngon v\xe3i", "\u0110\u1ec3 xem m\xe0y c\u01b0\u1eddi bao l\xe2u",
        "Bus c\xe2y t\u1ed1t \u0111i m\xe0i!", "\u0110\xe1nh nhanh \u0111i ch\xfa", "C\xe2u tr\xfang ao c\xe1",
        "\xd9 \u0111\u1ea7u \u0111au cu\u1ed1i", "To t\u1eabn, nh\u1ecf g\u1eedi, gi\u1eefa \u0111\u1ee3i \xf9",
        "\u0110i c\xe2u g\u1eaby c\u1ea7n", "D\u1ed1t \u0111\xe1nh 1, d\u1ea1i d\u1ed9t \u0111\xe1nh 2", "\xd9 n\xe0o \xd9 n\xe0o",
        "\u0110\xe1nh ngu nh\u01b0 b\xf2", "C\u1ea3m \u01a1n c\xe2y ch\u1ed1t"
      ];
    };
    e.prototype.getCmdStart = function() {
      return p.TableCommand.START;
    };
    e.prototype.init = function(e) {
      if (void 0 === e) {
        e = null;
      }
      t.prototype.init.call(this, e);
    };
    e.prototype.getTag = function() {
      return "phom";
    };
    e.prototype.hide = function() {
      this.reset();
      t.prototype.hide.call(this);
    };
    e.prototype.onReconnect = function(e) {
      t.prototype.onReconnect.call(this, e);
      this.onJoinRoomPlaying(e.cmd, e);
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
    e.prototype.onJoinRoomPlaying = function(t, e) {
      this.reset();
      this.resetAllButtonState();
      var i = e.ps,
        n = e.rmC,
        o = e.ns;
      this.playersPlaying = [];
      for (var a = 0; a < i.length; a++) {
        if (i[a].pi) {
          this.playersPlaying.push(this.getPlayer(i[a].uid));
          this.isDealCardEd = true;
        }
      }
      for (var s = this.isGameAnDanhCheck, r = 0; r < e.ps.length; ++r) {
        if (0 == (u = e.ps[r]).uid.localeCompare(S.default.getInstance().userID) && void 0 != u.cs && u.cs.length > 0) {
          s = false;
          this._daNgoi = true;
        }
      }
      switch (this.state != p.GameState.WAITING ? this.phomCardPack.node.active = true : (0 == this._thisPlayerView.isPlaying && (this
          ._thisPlayerView.isHost ? this.cardGameTableController.readyBtn.active = false : this.cardGameTableController.readyBtn
          .active = true), _.default.getInstance().autoReady && 0 == this._thisPlayerView.isHost && this.sendReady()), this.state) {
        case p.GameState.PLAYING:
          this.cardGameTableController.readyBtn.active = false;
          break;
        case p.GameState.VIEWING:
          this.isDealCardEd = true;
      }
      this.phomCardPack.node.zIndex = m.default.TOP;
      this.phomCardPack.setCardCount(o);
      for (var c = [], l = [], h = 0; h < i.length; h++) {
        var u;
        if (0 != (u = i[h]).pi) {
          var f,
            g = u.uid,
            y = u.pS,
            C = u.dCs,
            T = null,
            E = u.ssc;
          if (l.push(g), n = u.rmC, g == this._thisPlayerView.userID) {
            this.initPlayerCardSet();
            var I = u.cs;
            switch (void 0 != u.sAC && (I = u.sAC), this.state = p.GameState.PLAYING, this.listSortCard = I, this.myCardSet.setListCards(
                I, false, this.myCardScale), this.myCardSet.setCardClick(true), this.myCardSet.setHighLightCards(u.sCs), this.myCardSet
              .isSelectOneCard = true, y) {
              case d.EPhomPlayerState.IN_TURN:
                this.listBtnMain.active = true;
                var A = 10 == n;
                this.btnRutBai.active = !A;
                this.btnDanhBai.active = A;
                break;
              case d.EPhomPlayerState.DRAW:
              case d.EPhomPlayerState.STEAL:
              case d.EPhomPlayerState.LAYING:
                this.listBtnMain.active = true;
                this.btnRutBai.active = false;
                this.btnDanhBai.active = true;
                break;
              case d.EPhomPlayerState.DISCARD:
                this.listBtnMain.active = true;
                this.btnRutBai.active = false;
                this.btnDanhBai.active = false;
            }
            if (E) {
              this.listBtnMain.active = true;
              this.btnAnBai.active = E;
            }
            c = u.sMs;
          } else {
            var P = this.getCardObject();
            P.node.parent = this.node;
            P.node.position = this.getOtherCardPosition(this.getPlayer(g));
            P.node.active = true;
            P.setType(v.default.TypeHIDE);
            P.setScale(this.smallCardScale);
            P.node.zIndex = m.default.TOP;
            this.listOtherPlayerCards.push(P);
          }
          (f = this.getPlayer(g)).listAnPhom = u.sCs;
          f.stopCountDown();
          (T = this.getPlayerCardSet(f)).reset();
          T.node.parent = this.listCardPositionUI[f.indexPos];
          T.node.active = true;
          T.node.zIndex = m.default.TOP;
          T.setHorizontalLayout();
          T.setListCards(C, false, null, s);
          T.setCardScale(this.smallCardScale);
          this.mapCardSet.set(g, T);
          if (g != this._thisPlayerView.userID && 0 == s) {
            this.createListCardHighLightReconnect(u.sCs, g, e.mes);
          }
        }
      }
      if (void 0 != e.mes && e.mes.length > 0 && (this.createCardSetHaPhomReconnect(e.mes, s), this.btnHaPhom.active = false), null != e
        .sAMC && e.sAMC.length > 0 && (this.listBtnMain.active = true, this.btnGuiBai.active = true, this.myCardSet.setListCardSelected(e
          .sAMC), this.myCardSet.isSelectOneCard = false), this.showuserAnDanh(), void 0 != e.cP) {
        if (void 0 != (f = this.getPlayer(e.cP)) && null != f && f.isPlaying && false === this.isGameAnDanhCheck) {
          f.startCountDown(e.rmT / 1e3, 1 - e.rmT / e.tft);
        }
      }
      if (this.listBtnMain.y = -cc.winSize.height / 2 + this.paddingBottom, this.showuserAnDanh(), this.phomCardPack.setCardCount(o, this
          .isGameAnDanhCheck), false === this.checkNeedRemoveAnnDanh() && 3 === this.players.length && b.default.getRandomInt(100) < 70 &&
        this.showHideuserAnDanh4(true), this.phomCardPack.setTextRutBaiVisible(this.btnRutBai.active), this._thisPlayerView.isPlaying) {
        this.isDealCardEd = true;
        (f = this._thisPlayerView).node.stopAllActions();
        f.node.setPosition(-cc.winSize.width / 2 + 120, this.listBtnInvitePos[0].y);
        this.sortCards();
        this.updatePlayerCardSetPosition();
        this.updateCardSet();
        if (void 0 != c && c.length >= 9) {
          this.onBtnBaoU();
        }
        this.goiYHaPhom(c);
      }
    };
    e.prototype.createListCardHighLightReconnect = function(t, e, i) {
      if (void 0 != i) {
        for (var n = 0; n < i.length; n++) {
          if (i[n].uid == e) {
            return;
          }
        }
      }
      var o = this.mapCardHighLight.get(e);
      if (!(null != o && void 0 != o)) {
        o = [];
      }
      var a = this.getPlayer(e);
      a.totalPhom = t.length;
      for (n = 0; n < t.length; n++) {
        var s = this.getCardObject(),
          r = this.getOtherCardPosition(a);
        r.y -= 35 * (n + 1);
        s.setTextureWithCode(t[n], p.GAME.PHOM);
        s.setHighLight(true);
        s.node.parent = this.node;
        s.node.x = r.x;
        s.node.y = r.y;
        s.node.active = true;
        s.node.zIndex = m.default.TOP + n + 1;
        s.setScale(this.smallCardScale);
        o.push(s);
      }
      this.mapCardHighLight.set(e, o);
    };
    e.prototype.createCardSetHaPhomReconnect = function(t, e) {
      this.mapPlayerPhomCount.clear();
      for (var i = 0; i < t.length; i++) {
        var n = t[i];
        if (void 0 == (s = this.mapPlayerPhomCount.get(n.uid))) {
          s = 1;
        } else {
          s += 1;
        }
        this.mapPlayerPhomCount.set(n.uid, s);
      }
      for (i = 0; i < t.length; i++) {
        var o = (n = t[i]).meid,
          a = this.getPlayer(n.uid),
          s = this.mapPlayerPhomCount.get(n.uid);
        a.totalPhom = s;
        var r = this.createPhomCardSetFinishGame(a.indexPos);
        r.node.parent = this.node;
        r.node.position = this.getPhomCardSetPosition(n.uid, i, s);
        r.node.active = true;
        r.node.zIndex = m.default.TOP - i + s + 1;
        r.setListCards(n.cs, false, null, e);
        r.setCardScale(this.smallCardScale);
        r.setCardClick(false);
        if (void 0 != a.listAnPhom && a.listAnPhom.length > 0) {
          r.setHighLightCards(a.listAnPhom);
        }
        this.mapCardSetPhom.set(o, r);
        this.addListHaPhom(n.uid, r);
        if (null != this.myCardSet) {
          this.myCardSet.layout.updateLayout();
        }
      }
      for (i = 0; i < t.length; i++) {
        this.updatePhomZIndex(t[i].uid);
      }
    };
    e.prototype.handleErrorMessage = function(t) {
      var e = t.c;
      if (void 0 != e && null != e) {
        var i = "";
        switch (e) {
          case 400:
            i = "\u0102n b\xe0i kh\xf4ng h\u1ee3p l\u1ec7!";
            break;
          case 401:
            i = "\xd9 kh\xf4ng h\u1ee3p l\u1ec7!";
            break;
          case 402:
            i = "H\u1ea1 ph\u1ecfm kh\xf4ng h\u1ee3p l\u1ec7!";
            break;
          case 403:
            i = "G\u1eedi b\xe0i kh\xf4ng h\u1ee3p l\u1ec7!";
            break;
          case 405:
            i = "\u0110\xe1nh b\xe0i kh\xf4ng h\u1ee3p l\u1ec7!";
            break;
          case 406:
            i = "Ph\u1ea3i h\u1ea1 ph\u1ecfm tr\u01b0\u1edbc khi \u0111\xe1nh b\xe0i!";
        }
        if (0 == i.length && void 0 != t.mgs) {
          i = t.mgs;
        }
        if (i.length > 0) {
          y.default.getInstance().showPopupMessageUtil(i);
        }
      }
    };
    e.prototype.onReceiveMessage = function(e, i, n) {
      switch (t.prototype.onReceiveMessage.call(this, e, i, n), e) {
        case p.Global_Message.ERROR_MESSAGE:
          this.handleErrorMessage(n);
          break;
        case u.PhomCommand.CHANGE_TURN:
          this.changeTurn(e, n);
          break;
        case u.PhomCommand.DEAL_CARDS:
          this.isDealCardEd = false;
          this.dealCards(e, n);
          this.setDelayLeaveRoom();
          break;
        case u.PhomCommand.FINISH_GAME:
          this.finishGame(e, n);
          break;
        case u.PhomCommand.BAO_U:
        case u.PhomCommand.DANH_BAI:
          break;
        case u.PhomCommand.DRAW_CARD:
        case u.PhomCommand.TAKE_CARD:
        case u.PhomCommand.HA_PHOM:
        case u.PhomCommand.GUI_BAI:
        case u.PhomCommand.BAO_U:
          this.changeTurn(e, n);
      }
    };
    e.prototype.resetAllButtonState = function() {
      this.btnAnBai.active = false;
      this.btnBaoU.active = false;
      this.btnDanhBai.active = false;
      this.btnGuiBai.active = false;
      this.btnHaPhom.active = false;
      this.btnRutBai.active = false;
    };
    e.prototype.reset = function() {
      this.listBtnMain.active = false;
      this.phomCardPack.node.active = false;
      this.phomCardPack.setTextRutBaiVisible(this.btnRutBai.active);
      this.mapHaPhomUser.clear();
      this.mapPlayerPhomCount.clear();
      this.listOtherPlayerCards = [];
      for (var t = 0; t < this.listOtherPlayerCards.length; t++) {
        if (null != this.listOtherPlayerCards[t]) {
          this.listOtherPlayerCards[t].reset();
        }
      }
      if (null != this.poolCardSet) {
        this.poolCardSet.resetAllObjectUsing();
        for (t = 0; t < this.poolCardSet.listObjectFree.length; t++) {
          this.poolCardSet.listObjectFree[t].reset();
        }
      }
      if (null != this.poolMoneyUI) {
        this.poolMoneyUI.resetAllObjectUsing();
      }
      if (null != this.poolGameCard) {
        this.poolGameCard.resetAllObjectUsing();
      }
      if (null != this.poolPhomRank) {
        this.poolPhomRank.resetAllObjectUsing();
      }
      if (null != this.myCardSet) {
        this.myCardSet.reset();
      }
      if (null != this.mapCardSet) {
        this.mapCardSet.forEach(function(t, e) {
          e.reset();
        }.bind(this));
        this.mapCardSet.clear();
      }
      if (null != this.mapCardSetPhom) {
        this.mapCardSetPhom.forEach(function(t, e) {
          e.reset();
        }.bind(this));
        this.mapCardSetPhom.clear();
      }
      if (null != this.mapCardHighLight) {
        this.mapCardHighLight.forEach(function(t, e) {
          for (var i = 0; i < e.length; i++) {
            e[i].reset();
            e[i].node.parent = null;
          }
        });
        this.mapCardHighLight.clear();
      }
      for (t = 0; t < this.players.length; t++) {
        var e = this.players[t];
        if (null != e && null != e.playerModel) {
          e.playerModel.TotalPhom = 0;
        }
      }
    };
    e.prototype.initPlayerCardSet = function() {
      if (null == this.myCardSet) {
        this.myCardSet = cc.instantiate(this.prefabCardSet).getComponent(c.default);
      }
      this.myCardSetPositionY = -cc.winSize.height / 2 + 100;
      this.myCardSet.node.parent = this.node;
      this.myCardSet.node.anchorY = 0;
      this.myCardSet.node.anchorX = 0;
      this.myCardSet.node.y = this.myCardSetPositionY;
      this.myCardSet.node.x = -cc.winSize.width / 2 + 260;
      this.myCardSet.setHorizontalLayout();
      this.myCardSet.setSpaceX(-35);
      this.myCardSet.setScaleDefault(this.myCardScale, true);
      this.myCardSet.node.zIndex = m.default.PLAYER_CARD_SET;
      var t = this.getPlayerCardSet(this._thisPlayerView);
      t.reset();
      t.setHorizontalLayout();
      t.node.parent = this.listCardPositionUI[this._thisPlayerView.indexPos];
      t.node.active = true;
      this.mapCardSet.set(this._thisPlayerView.userID, t);
    };
    e.prototype.updatePlayerCardSetPosition = function() {
      this.myCardSet.node.y = -cc.winSize.height / 2 + this.cardHeight / 2 + this.paddingBottom;
      this.listCardPositionUI[0].y = this.myCardSet.node.y + this.cardHeight * (1 + this.smallCardScale) / 2;
      this.listCardPositionUI[3].y = this.myCardSet.node.y + this.cardHeight * (1 + this.smallCardScale) / 2;
    };
    e.prototype.sortCards = function() {
      if (this.listSortCard.length > 0) {
        this.myCardSet.sortCard(this.listSortCard);
      }
    };
    e.prototype.dealCards = function(e, i, n) {
      if (void 0 === n) {
        n = false;
      }
      this.reset();
      this.isDealCardEd = true;
      this.resetAllButtonState();
      this.listSortCard = [];
      this.listOtherPlayerCards = [];
      var o = i.cs,
        a = i.lpi,
        s = void 0 != i.cfl && i.cfl,
        r = void 0;
      if (void 0 != i.tP && (r = i.tP.uid), n) {
        this._khongThaoTac = false;
        a = [];
        for (var c = 0; c < i.ps.length; c++) {
          var l = i.ps[c];
          a.push(l.uid);
          if (l.uid == this._thisPlayerView.userID) {
            o = l.cs;
          }
        }
      }
      if (o && (this._thisPlayerView.isPlaying = o.length > 0), this._thisPlayerView.listCards = [], this.phomCardPack.node.active = true,
        this.phomCardPack.setCardCount(4 * a.length - 1), this.phomCardPack.node.zIndex = m.default.TOP, this._dangKetThuc && this
        .handlePendingPlayers(), this.locPlayingPlayer(a), this.cardGameTableController.startGameUI(), this._thisPlayerView.isPlaying) {
        var u = this._thisPlayerView;
        u.node.runAction(cc.moveTo(.6, -cc.winSize.width / 2 + 120, u.node.position.y));
        this.listBtnMain.active = true;
        this.btnXepBai.active = true;
        if (s) {
          this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function() {
            this.onBtnBaoU();
          }.bind(this))));
        }
      }
      var p = [];
      if (o) {
        for (c = 0; c < o.length; c++) {
          var f = o[c];
          this._thisPlayerView.listCards.push(f);
          var g = this.poolGameCard.getObject();
          if (null == g) {
            g = cc.instantiate(this.prefabsGameCard).getComponent(h.default);
            this.poolGameCard.addObjectUsing(g);
          }
          g.reset();
          g.node.active = true;
          g.node.parent = this.node;
          g.node.zIndex = c;
          g.node.position = this.phomCardPack.node.position;
          g.setTextureWithCode(f, d.GameID.PHOM);
          g.setScale(this.myCardScale);
          p.push(g);
        }
      }
      this.initPlayerCardSet();
      this.myCardSet.setListGameCard(p, true, .1, .4, true);
      this.myCardSet.setCardClick(false);
      this.myCardSet.callbackCardSetReady = function() {
        this.myCardSet.setCardClick(true);
      }.bind(this);
      this.myCardSet.isSelectOneCard = true;
      this.updatePlayerCardSetPosition();
      t.prototype.dealCards.call(this, e, i);
      this.setOtherPlayerCards(a);
      if (void 0 != r && r == this._thisPlayerView.userID) {
        this.listBtnMain.active = true;
        this.btnDanhBai.active = true;
      }
      this.phomCardPack.setTextRutBaiVisible(false);
      this.showuserAnDanh();
      this.phomCardPack.setCardCount(4 * a.length - 1, this.isGameAnDanhCheck);
      if (void 0 != r && false === this.isGameAnDanhCheck) {
        this.getPlayer(r).startCountDown(20);
      }
      this.processCheckToOffAnDanh4();
    };
    e.prototype.getOtherCardPosition = function(t) {
      var e = this.node.parent.convertToWorldSpaceAR(this.listBtnInvitePos[t.indexPos].position);
      switch (t.indexPos) {
        case 0:
          cc.Vec2.ZERO;
          break;
        case 1:
          e.x -= 130;
          break;
        case 2:
          e.x += 130;
          e.y -= 20;
          break;
        case 3:
          e.x += 130;
      }
      return e = this.node.convertToNodeSpaceAR(e);
    };
    e.prototype.getPlayerCardSet = function(t) {
      var e = this.poolCardSet.getObject();
      switch (null == e && (e = cc.instantiate(this.prefabCardSet).getComponent(c.default), this.poolCardSet.addObjectUsing(e)), e
      .reset(), e.node.parent = this.listCardPositionUI[t.indexPos], e.node.position = cc.Vec2.ZERO, e.node.active = true, e.layout
        .spacingX = -30, e.setCardClick(false), t.indexPos) {
        case 0:
        case 1:
          e.node.anchorX = 1;
          e.layout.horizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
          break;
        case 2:
        case 3:
          e.node.anchorX = 0;
          e.layout.horizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
      }
      return e;
    };
    e.prototype.handlePendingPlayers = function() {
      if (t.prototype.handlePendingPlayers.call(this), this._forcedQuit) {
        this.onLogOut();
      } else if (this._forcedToLeaveRoom) {
        this.handleLeaveRoomResponse();
      } else {
        if (this._subscribedToGetOut) {
          this.state = p.GameState.WAITING;
          return void this.sendLeaveRoom();
        }
        if (S.default.getInstance().checkBaoTriGame()) {
          this.state = p.GameState.WAITING;
          return void this.sendLeaveRoom();
        }
        if (this._khongThaoTac && this._daNgoi) {
          if (this._soVanKhongThaoTac++, 3 == this._soVanKhongThaoTac) {
            return void this.sendLeaveRoom();
          }
        } else {
          this._soVanKhongThaoTac = 0;
        }
        this.updateMoneys();
        this._dangKetThuc = false;
        this.state = p.GameState.WAITING;
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
        this.autoSendReady();
        this.showHideuserAnDanh4(false);
        this._khongThaoTac = true;
      }
    };
    e.prototype.getCardObject = function() {
      var t = this.poolGameCard.getObject();
      if (null == t) {
        t = cc.instantiate(this.prefabsGameCard).getComponent(h.default);
        this.poolGameCard.addObjectUsing(t);
        if (0 == this.cardHeight) {
          this.cardHeight = t.node.height;
        }
      }
      t.reset();
      t.node.stopAllActions();
      t.node.active = true;
      return t;
    };
    e.prototype.setOtherPlayerCards = function(t, e) {
      if (void 0 === e && (e = true), 1 != t.length) {
        for (var i = 0; i < t.length; i++) {
          var n = t[i],
            o = this.getPlayer(n);
          if (void 0 != o) {
            o.isPlaying = true;
            this.playersPlaying.push(o);
            var a = this.getPlayerCardSet(o);
            if (a.setHorizontalLayout(), a.node.parent = this.listCardPositionUI[o.indexPos], a.node.active = true, a.node.zIndex = m
              .default.TOP, this.mapCardSet.set(n, a), 0 != this._thisPlayerView.userID.localeCompare(n) && e) {
              for (var s = function(t) {
                  var e = r.poolGameCard.getObject();
                  if (null == e) {
                    e = cc.instantiate(r.prefabsGameCard).getComponent(h.default);
                    r.poolGameCard.addObjectUsing(e);
                  }
                  var i = r.getOtherCardPosition(o);
                  e.node.active = true;
                  e.node.parent = r.node;
                  e.node.setPosition(0, 0);
                  e.reset();
                  e.setScale(r.smallCardScale);
                  e.node.runAction(cc.sequence(cc.delayTime(.08 * t), cc.moveTo(.2, i), cc.callFunc(function() {
                    if (0 != t) {
                      this.poolGameCard.addObject(e);
                    } else {
                      this.listOtherPlayerCards.push(e);
                      e.node.zIndex = m.default.TOP;
                    }
                  }.bind(r))));
                }, r = this, c = 0; c < 9; c++) {
                s(c);
              }
            }
          }
        }
        this._dangPhatBai = false;
      }
    };
    e.prototype.addListHaPhom = function(t, e) {
      var i = this.mapHaPhomUser.get(t);
      if (!(void 0 != i && null != i)) {
        i = [];
      }
      i.push(e);
      this.mapHaPhomUser.set(t, i);
    };
    e.prototype.updatePhomZIndex = function(t) {
      var e = this.mapHaPhomUser.get(t);
      if (void 0 != e && null != e) {
        for (var i = 0; i < e.length; i++) {
          for (var n = i + 1; n < e.length; n++) {
            if (e[i].node.y > e[n].node.y) {
              var o = e[i];
              e[i] = e[n];
              e[n] = o;
            }
          }
        }
        for (i = 0; i < e.length; i++) {
          e[i].node.zIndex = m.default.TOP - i + 1;
        }
      }
    };
    e.prototype.createMoneyUI = function() {
      var t = this.poolMoneyUI.getObject();
      if (null == t) {
        t = cc.instantiate(this.prefabMoneyUI).getComponent(f.default);
        this.poolMoneyUI.addObjectUsing(t);
      }
      return t;
    };
    e.prototype.createCardSet = function() {
      var t = this.poolCardSet.getObject();
      if (null == t) {
        t = cc.instantiate(this.prefabCardSet).getComponent(c.default);
        this.poolCardSet.addObjectUsing(t);
      }
      t.reset();
      t.node.anchorX = .5;
      t.node.anchorY = .5;
      t.node.active = true;
      t.node.position = cc.Vec2.ZERO;
      return t;
    };
    e.prototype.createPhomCardSetFinishGame = function(t) {
      var e = this.createCardSet();
      switch (t) {
        case 0:
          e.node.anchorY = 0;
          break;
        case 1:
          e.node.anchorX = 1;
          break;
        case 2:
          e.node.anchorY = 0;
          break;
        case 3:
          e.node.anchorX = 0;
      }
      e.reset();
      e.setHorizontalLayout();
      e.node.active = true;
      e.layout.spacingX = -30;
      return e;
    };
    e.prototype.createPlayerCardSetFinishGame = function(t) {
      var e = this.createCardSet(),
        i = (cc.Vec2.ZERO, t.node.parent.convertToWorldSpaceAR(t.node.position));
      switch (e.layout.spacingX = -30, t.indexPos) {
        case 0:
          e.node.anchorX = .5;
          e.node.anchorY = 0;
          break;
        case 1:
          e.setVerticalLayout();
          e.layout.spacingY = -50;
          e.node.anchorY = .5;
          e.node.anchorX = 1;
          i.x -= 120;
          break;
        case 2:
          e.setHorizontalLayout();
          e.node.anchorX = .5;
          e.node.anchorY = 0;
          i.y += 30;
          break;
        case 3:
          e.setVerticalLayout();
          e.layout.spacingY = -50;
          e.node.anchorY = .5;
          e.node.anchorX = .5;
          i.x += 120;
      }
      e.node.parent = this.node;
      e.node.zIndex = m.default.TOP;
      e.node.position = this.node.convertToNodeSpaceAR(i);
      e.setScaleDefault(this.smallCardScale);
      return e;
    };
    e.prototype.getPhomCardSetPosition = function(t, e, i) {
      var n = this.getPlayer(t),
        o = cc.Vec2.ZERO,
        a = this.cardHeight * this.smallCardScale * .4;
      switch (n.indexPos) {
        case 0:
          o.y = n.node.position.y + e * a + this.cardHeight * (.5 + this.smallCardScale / 2);
          break;
        case 1:
          (o = this.getOtherCardPosition(n)).x = .25 * cc.winSize.width;
          o.y += 3 == i ? (e - Math.floor(i / 2)) * a : e * a;
          break;
        case 2:
          o.y += 3 == i ? 100 + (e - Math.floor(i / 2)) * a : 2 == i ? 100 + e * a : 100 + a;
          break;
        case 3:
          (o = this.getOtherCardPosition(n)).x = .25 * -cc.winSize.width;
          o.y += 3 == i ? (e - Math.floor(i / 2)) * a : e * a;
      }
      return o;
    };
    e.prototype.changeTurn = function(e, i, n, o) {
      if (void 0 === n) {
        n = false;
      }
      if (void 0 === o) {
        o = false;
      }
      t.prototype.changeTurn.call(this, e, i);
      if (null != this.myCardSet) {
        this.myCardSet.setOpacityAll(255);
      }
      if (void 0 != i.sAC) {
        this.listSortCard = i.sAC;
      }
      this.btnDanhBai.active = false;
      this.iconSelection.active = false;
      this.cardGameTableController.readyBtn.active = false;
      this.cardGameTableController.startBtn.active = false;
      for (var a = 0; a < this.players.length; a++) {
        this.players[a].setPhomStatus(d.EPhomPlayerStatus.NONE);
      }
      switch (e) {
        case u.PhomCommand.DRAW_CARD:
          this.phomCardPack.setTextRutBaiVisible(false);
          this.btnAnBai.active = false;
          this.btnRutBai.active = false;
          var s = i.uid,
            r = i.mom,
            c = this.getCardObject(),
            l = i.sMs,
            p = i.sAMC,
            f = this.getPlayer(s);
          if (void 0 == l && (l = i.mes), void 0 != i.mes && 3 == i.mes.length && this.onBtnBaoU(), void 0 != l && l.length >= 9 && this
            .onBtnBaoU(), this.phomCardPack.PopCard(this.isGameAnDanhCheck), s == this._thisPlayerView.userID) {
            c.setTextureWithCode(i.cs, d.GameID.PHOM);
            if (this.isGameAnDanhCheck) {
              c.setType(v.default.TypeHIDE);
            }
            c.node.parent = this.node;
            c.node.active = true;
            c.node.position = cc.Vec2.ZERO;
            c.setScale(this.myCardScale);
            this.myCardSet.addCard(c, true);
            if (n) {
              this.btnRutBai.active = false;
              this.btnDanhBai.active = false;
              this.listBtnMain.active = false;
            } else {
              this.btnRutBai.active = false;
              this.btnDanhBai.active = true;
            }
            this.goiYHaPhom(l);
            if (void 0 != p && p.length > 0) {
              this.node.runAction(cc.sequence(cc.delayTime(.7), cc.callFunc(function() {
                this.myCardSet.setListCardSelected(p);
              }.bind(this))));
              this.btnGuiBai.active = true;
            }
          } else {
            var g = this.getOtherCardPosition(f);
            c.node.stopAllActions();
            c.node.parent = this.node;
            c.node.active = true;
            c.node.position = cc.Vec2.ZERO;
            c.reset();
            c.setScale(this.smallCardScale);
            c.node.runAction(cc.sequence(cc.moveTo(.2, g), cc.callFunc(function() {
              this.poolGameCard.addObject(c);
            }.bind(this))));
          }
          void 0 != r && r && false === this.isGameAnDanhCheck && this.node.runAction(cc.sequence(cc.delayTime(.2), cc.callFunc(
        function() {
            f.setPhomStatus(d.EPhomPlayerStatus.MOM);
          }.bind(this))));
          break;
        case u.PhomCommand.TAKE_CARD:
          this.btnAnBai.active = false;
          this.btnRutBai.active = false;
          void 0 == (Z = i.fP) && (Z = i);
          var y = Z.uid,
            S = Z.puid,
            _ = Z.m,
            b = Z.mX,
            C = Z.lm,
            T = i.cs,
            E = i.cmc,
            I = (l = i.sMs, i.ic),
            A = this.getPlayer(y),
            P = this.mapCardSet.get(S);
          if (void 0 == P || null == P) {
            break;
          }
          var M = P.getCardAndRemove(T);
          if (void 0 == l && (l = i.mes), A._realMoney = _, A.setMoney(_), null == M || A.isAnDanh || M.setHighLight(true), 1 == I &&
            false === this.isGameAnDanhCheck && A.setPhomStatus(d.EPhomPlayerStatus.AN_CHOT), y == this._thisPlayerView.userID) {
            M.node.stopAllActions();
            M.setClickEnabled(true);
            M.setScale(this.myCardScale);
            this.myCardSet.addCard(M);
            this.myCardSet.setCardClick(true);
            this.btnDanhBai.active = true;
          } else {
            var O = this.getOtherCardPosition(A);
            A.totalPhom += 1;
            O.y -= 35 * A.totalPhom;
            if (null == (j = this.mapCardHighLight.get(y))) {
              j = [];
              this.mapCardHighLight.set(y, j);
            }
            j.push(M);
            var N = M.node.parent.convertToWorldSpaceAR(M.node.position);
            N = this.node.convertToNodeSpaceAR(N);
            M.node.parent = this.node;
            M.node.position = N;
            M.node.active = true;
            M.node.zIndex = m.default.TOP + A.totalPhom;
            M.setScale(this.smallCardScale);
            M.node.stopAllActions();
            M.node.runAction(cc.moveTo(.2, O));
          }
          if (this.mapCardSet.forEach(function(t, e) {
              for (var i = 0; i < e.listCardNodes.length; i++) {
                e.listCardNodes[i].serverCode + " ";
              }
            }.bind(this)), void 0 != E) {
            var B = null,
              D = this.mapCardSet.getListKeys();
            for (a = 0; a < D.length; a++) {
              if (null != (B = (ot = this.mapCardSet.get(D[a])).getCardAndRemove(E))) {
                break;
              }
            }
            if (null != B) {
              B.setScale(this.smallCardScale);
              P.addCard(B);
              P.setCardScale(this.smallCardScale);
            }
          }
          if (void 0 != l && l.length >= 9 && this.onBtnBaoU(), y == this._thisPlayerView.userID && this.goiYHaPhom(l), false === this
            .isGameAnDanhCheck) {
            var R = this.getPlayer(S),
              L = A.node.parent.convertToWorldSpaceAR(A.node.position),
              w = R.node.parent.convertToWorldSpaceAR(R.node.position),
              k = this.createMoneyUI(),
              G = this.createMoneyUI();
            k.node.parent = this.node;
            k.node.position = this.node.convertToNodeSpaceAR(L);
            k.node.zIndex = m.default.WIN_MONEY_UI;
            k.setMoney(b);
            k.show(d.GameID.PHOM, 1.5);
            G.node.parent = this.node;
            G.node.position = this.node.convertToNodeSpaceAR(w);
            G.node.zIndex = m.default.WIN_MONEY_UI;
            G.setMoney(C);
            G.show(d.GameID.PHOM, 1.5);
          }
          break;
        case u.PhomCommand.HA_PHOM:
          this.btnRutBai.active = false;
          var x = this.getPlayer(i.uid),
            F = (l = i.mes, i.sAMC);
          if (void 0 != F && F.length > 0 && (this.node.runAction(cc.sequence(cc.delayTime(.7), cc.callFunc(function() {
              this.myCardSet.setListCardSelected(F);
            }.bind(this)))), this.btnGuiBai.active = true), !(void 0 != l && 0 != l.length || void 0 != (l = i.lCs) && 0 != l.length)) {
            break;
          }
          var U = 0,
            H = this.mapPlayerPhomCount.get(i.uid);
          if (void 0 == H || null == H ? H = l.length : (U = H, H += l.length), this.mapPlayerPhomCount.set(i.uid, H), x.totalPhom = H, i
            .uid == this._thisPlayerView.userID) {
            if (0 == n) {
              this.btnHaPhom.active = false;
              this.btnDanhBai.active = true;
            }
            for (a = 0; a < l.length; a++) {
              var W = (K = l[a]).meid,
                V = this.myCardSet.getListCardObject(K.cs);
              if (V.length > 0) {
                (ot = this.createPhomCardSetFinishGame(x.indexPos)).node.parent = this.node;
                ot.node.position = this.getPhomCardSetPosition(i.uid, U + a, H);
                ot.node.active = true;
                ot.resetCardState(false);
                ot.setScaleDefault(this.smallCardScale, true);
                ot.setListGameCard(V, false, 0);
                this.mapCardSetPhom.set(W, ot);
                this.myCardSet.layout.updateLayout();
                this.addListHaPhom(i.uid, ot);
              }
            }
            this.updateCardSet();
          } else {
            var j = this.mapCardHighLight.get(i.uid);
            for (a = 0; a < l.length; a++) {
              var K,
                X = false,
                Y = 0,
                J = null;
              W = (K = l[a]).meid;
              if (0 == this.mapCardSetPhom.isContainKey(W) || 3 == l.length || o) {
                if (void 0 != j) {
                  for (var z = 0; z < j.length; z++) {
                    for (var q = j[z], Q = 0; Q < K.cs.length; Q++) {
                      if (q.serverCode == K.cs[Q]) {
                        q.node.active = false;
                        Y = q.serverCode;
                        J = q.node.parent.convertToWorldSpaceAR(q.node.position);
                        j.splice(z, 1);
                        X = true;
                        break;
                      }
                    }
                    if (X) {
                      break;
                    }
                  }
                }
                if (null == J) {
                  J = this.node.parent.convertToWorldSpaceAR(this.getOtherCardPosition(x));
                }
                (ot = this.createPhomCardSetFinishGame(x.indexPos)).node.setParent(this.node);
                ot.node.active = true;
                ot.node.zIndex = m.default.TOP + H + 1 - (a + U);
                ot.node.setPosition(this.getPhomCardSetPosition(i.uid, a + U, H));
                ot.resetCardState(true);
                ot.setScaleDefault(this.smallCardScale, true);
                ot.setListCardWithAnimation(K.cs, J, Y, .15, this.isGameAnDanhCheck);
                this.addListHaPhom(i.uid, ot);
                if (0 == o) {
                  this.mapCardSetPhom.set(W, ot);
                }
              }
            }
          }
          this.updatePhomZIndex(i.uid);
          break;
        case u.PhomCommand.GUI_BAI:
          this.guiBai(i.uid, i.aMs);
          this.btnRutBai.active = false;
          break;
        case u.PhomCommand.BAO_U:
          break;
        default:
          var Z = null,
            $ = null,
            tt = null,
            et = null;
          void 0 != i.fP && (Z = i.fP, $ = Z.uid, tt = Z.pS, et = Z.dCs);
          var it = i.ssc,
            nt = "";
          if (void 0 != i.sAC && (this.listSortCard = i.sAC), it && (this.currentTakeCardID = i.cs), void 0 != i.tP && ((nt = i.tP.uid) ==
              this._thisPlayerView.userID ? (this.listBtnMain.active = true, this.btnDanhBai.active = true, this.btnXepBai.active = true,
                this.btnHaPhom.active = false, this.btnGuiBai.active = false, this.btnRutBai.active = true, this.btnDanhBai.active =
                false, this.btnAnBai.active = it) : (this.btnAnBai.active = false, this.btnDanhBai.active = false, this.btnGuiBai.active =
                false, this.btnRutBai.active = false, this.btnHaPhom.active = false, this.btnXepBai.active = true)), this.phomCardPack
            .setTextRutBaiVisible(this.btnRutBai.active, true), null != tt) {
            switch (tt) {
              case d.EPhomPlayerState.DISCARD:
                for (x = this.getPlayer($), a = 0; a < this.playersPlaying.length; a++) {
                  this.playersPlaying[a].stopCountDown();
                }
                null != (R = this.getPlayer(nt)) && 0 == n && false === this.isGameAnDanhCheck && R.startCountDown(20);
                var ot;
                q = null;
                if ($ == this._thisPlayerView.userID ? null != (q = n ? this.myCardSet.getCardAndRemove(Z.cs) : this.myCardSet
                    .getCardAndRemove(Z.dCs)) && (this.myCardSet.layout.updateLayout(), q.setScale(this.smallCardScale)) : (null == (q =
                      this.poolGameCard.getObject()) && (q = cc.instantiate(this.prefabsGameCard).getComponent(h.default), this
                      .poolGameCard.addObjectUsing(q)), q.reset(), q.setTextureWithCode(n ? Z.cs : Z.dCs, d.GameID.PHOM), this
                    .isGameAnDanhCheck && q.setType(v.default.TypeHIDE), q.node.parent = this.node, q.node.position = this
                    .getOtherCardPosition(x), q.node.zIndex = m.default.TOP, q.node.active = true, q.setScale(this.smallCardScale)),
                  null != q) {
                  if (void 0 != (ot = this.mapCardSet.get($))) {
                    ot.addCard(q);
                    ot.setScaleDefault(this.smallCardScale, true);
                    ot.setCardScale(this.smallCardScale);
                  }
                  if (null != this.myCardSet) {
                    this.myCardSet.layout.updateLayout();
                  }
                }
                it ? this.node.runAction(cc.sequence(cc.delayTime(.3), cc.callFunc(function() {
                  var t = this.mapCardSet.get($).getCard(et),
                    e = t.node.parent.convertToWorldSpaceAR(t.node.position);
                  (e = this.node.convertToNodeSpaceAR(e)).y += 50;
                  t.setClickEnabled(true, false, this.onTakeCardSelected.bind(this));
                  this.iconSelection.active = true;
                  this.iconSelection.position = e;
                  this.iconSelection.runAction(cc.repeatForever(cc.sequence(cc.moveBy(.4, 0, 8), cc.moveBy(.4, 0, -8))));
                }.bind(this)))) : (this.iconSelection.active = false, this.iconSelection.stopAllActions());
            }
          }
      }
      this.phomCardPack.setTextRutBaiVisible(this.btnRutBai.active);
    };
    e.prototype.onTakeCardSelected = function(t) {
      t.setClickEnabled(false);
      this.onBtnAnBai();
    };
    e.prototype.guiBai = function(t, e) {
      if (0 != e.length) {
        if (this.btnGuiBai.active = false, t == this._thisPlayerView.userID) {
          for (var i = 0; i < e.length; i++) {
            var n = e[i].cs,
              o = e[i].meid,
              a = this.mapCardSetPhom.get(o),
              s = this.myCardSet.getCardAndRemove(n);
            if (void 0 != a) {
              s.setScale(this.smallCardScale);
              a.addCard(s, false, true);
              a.setCardClick(false);
            }
          }
          this.btnDanhBai.active = true;
        } else {
          for (i = 0; i < e.length; i++) {
            n = e[i].cs;
            o = e[i].meid;
            a = this.mapCardSetPhom.get(o);
            (s = this.getCardObject()).setTextureWithCode(n, d.GameID.PHOM);
            if (this.isGameAnDanhCheck) {
              s.setType(v.default.TypeHIDE);
            }
            s.node.active = true;
            s.node.parent = this.node;
            s.node.position = this.getOtherCardPosition(this.getPlayer(t));
            s.setScale(this.smallCardScale);
            if (void 0 != a) {
              a.addCard(s, false, true);
              a.setCardScale(this.smallCardScale);
            }
          }
        }
      }
    };
    e.prototype.updateCardSet = function() {
      for (var t = false, e = 0; e < this.listSortCard.length; e++) {
        for (var i = 0; i < this.myCardSet.listCardNodes.length; i++) {
          if (this.listSortCard[e] == this.myCardSet.listCardNodes[i].serverCode) {
            t = true;
            break;
          }
        }
        if (0 == t) {
          this.listSortCard.splice(e, 1);
          e--;
        }
      }
    };
    e.prototype.goiYHaPhom = function(t) {
      var e = this.mapCardSet.get(this._thisPlayerView.userID);
      if (null != e && e.listCardNodes.length >= 3 && void 0 != t && t.length > 0) {
        this.mainGameViewModel.node.runAction(cc.sequence(cc.delayTime(.7), cc.callFunc(function() {
          this.btnHaPhom.active = true;
          this.myCardSet.isSelectOneCard = false;
          this.myCardSet.setListCardSelected(t);
        }.bind(this))));
      }
    };
    e.prototype.getMoneyUI = function() {
      var t = this.poolMoneyUI.getObject();
      if (null == t) {
        t = cc.instantiate(this.prefabMoneyUI).getComponent(f.default);
        this.poolMoneyUI.addObjectUsing(t);
      }
      t.node.active = true;
      return t;
    };
    e.prototype.getPhomRank = function() {
      var t = this.poolPhomRank.getObject();
      if (null == t) {
        t = cc.instantiate(this.prefabPhomRank).getComponent(g.default);
        this.poolPhomRank.addObjectUsing(t);
      }
      t.node.active = true;
      return t;
    };
    e.prototype.sendLogFinishGame = function(t, e) {};
    e.prototype.finishGame = function(e, i) {
      t.prototype.finishGame.call(this, e, i);
      this._dangKetThuc = true;
      this.listBtnMain.active = false;
      this.btnAnBai.active = false;
      this.btnBaoU.active = false;
      this.btnHaPhom.active = false;
      this.btnDanhBai.active = false;
      this.btnGuiBai.active = false;
      this.btnRutBai.active = false;
      var n = false,
        o = 2,
        a = 0,
        s = void 0,
        r = i.ps,
        c = d.EPhomPlayerState.NONE;
      if (void 0 != i.fP && (void 0 != i.fP.lCs && (s = i.fP.lCs), c = i.fP.pS), 0 == this.isDealCardEd && (o = 3, a = 2, n = true, this
          .dealCards(i.cmd, i, true)), void 0 != i.fP) {
        if (void 0 == s && void 0 != i.fP && (s = i.fP.mes), void 0 != s && s.length > 0) {
          n = true;
          this.phomCardPack.node.active = false;
          var l = false,
            h = 0;
          if (c == d.EPhomPlayerState.DRAW) {
            this.changeTurn(u.PhomCommand.DRAW_CARD, i.fP, true, true);
            l = true;
          } else {
            if (c == d.EPhomPlayerState.STEAL) {
              this.changeTurn(u.PhomCommand.TAKE_CARD, i.fP, true, true);
              l = true;
            } else {
              if (c == d.EPhomPlayerState.ADD_MELD) {
                this.changeTurn(u.PhomCommand.GUI_BAI, i.fP, true, true);
                l = true;
              }
            }
          }
          if (l) {
            h = 1;
          }
          this.node.runAction(cc.sequence(cc.delayTime(h + a), cc.callFunc(function() {
            this.changeTurn(u.PhomCommand.HA_PHOM, i.fP, true, true);
            for (var t = 0; t < r.length; t++) {
              if (r[t].uid != i.fP.uid) {
                this.changeTurn(u.PhomCommand.HA_PHOM, r[t], true, true);
              }
            }
          }.bind(this))));
        } else {
          if (void 0 != i.fP) {
            this.changeTurn(e, i, true);
          }
        }
      }
      this.isDealCardEd = false;
      if (n) {
        this.node.runAction(cc.sequence(cc.delayTime(o), cc.callFunc(function() {
          this.runAnimationFinishGame(e, i);
        }.bind(this))));
      } else {
        this.runAnimationFinishGame(e, i);
      }
    };
    e.prototype.runAnimationFinishGame = function(t, e) {
      this.phomCardPack.node.active = false;
      for (var i = 0; i < this.players.length; i++) {
        (o = this.players[i]).stopCountDown();
        o.removeBubbleFx();
      }
      this.isDealCardEd = false;
      var n = e.ps;
      for (i = 0; i < this.listOtherPlayerCards.length; i++) {
        this.listOtherPlayerCards[i].node.active = false;
      }
      for (i = 0; i < n.length; i++) {
        var o,
          a = (o = n[i]).uid,
          s = (o.pt, o.fT),
          r = o.mX,
          c = o.m,
          l = o.cs,
          h = this.getPlayer(a),
          u = h.node.parent.convertToWorldSpaceAR(h.node.position);
        if (h.setMoney(c), h._realMoney = c, a != this._thisPlayerView.userID) {
          var p = this.createPlayerCardSetFinishGame(h),
            f = this.node.convertToWorldSpaceAR(this.getOtherCardPosition(h));
          p.setListCardWithAnimation(l, f, null, .15, this.isGameAnDanhCheck);
        }
        if (false === this.isGameAnDanhCheck) {
          if (r > 0) {
            h.runWinAction(5);
          }
          var g = this.getMoneyUI();
          g.node.parent = this.node;
          g.node.position = this.node.convertToNodeSpaceAR(new cc.Vec2(u.x, u.y - 30));
          g.node.zIndex = m.default.WIN_MONEY_UI;
          g.setMoney(r);
          g.show(d.GameID.PHOM);
          g.setWinLose(r > 0);
          var y = this.getPhomRank();
          y.node.parent = this.node;
          y.node.zIndex = m.default.WIN_MONEY_UI;
          y.setRank(s);
          if (s == d.EPhomRank.U_DEN_TRON) {
            y.node.position = this.node.convertToNodeSpaceAR(new cc.Vec2(u.x, u.y + 15 + g.node.height));
          } else {
            y.node.position = this.node.convertToNodeSpaceAR(new cc.Vec2(u.x, u.y + 15));
          }
        }
      }
      this.node.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(function() {
        this.endGame(t, e);
      }.bind(this))));
    };
    e.prototype.endGame = function(e, i) {
      t.prototype.endGame.call(this, e, i);
      this.reset();
      this.handlePendingPlayers();
      this.updateViewPostions(false, true);
      if (_.default.getInstance().autoReady && 0 == this._thisPlayerView.isHost) {
        this.sendReady();
      }
      T.default.getInstance().CheckForceUpdateByGameScene(d.GameConfigs.SceneName.Phom);
    };
    e.prototype.startBetting = function(t) {
      if (null != this.cardGameTableController) {
        var e = this.cardGameTableController.countDownActionProgressTo;
        if (null !== e && void 0 !== e) {
          e.node.stopAllActions();
          e.node.active = false;
        }
      }
    };
    e.prototype.onBtnDanhBai = function() {
      if (C.default.getInstance().playbtnClick(), this.myCardSet.getListCardIDSelected().length > 1) {
        y.default.getInstance().showPopupMessageUtil("Ch\u1ec9 \u0111\u01b0\u1ee3c \u0111\xe1nh m\u1ed9t l\xe1 b\xe0i");
      } else {
        var t = this.myCardSet.getCardSelected();
        if (null == t) {
          y.default.getInstance().showPopupMessageUtil("Ph\u1ea3i ch\u1ecdn b\xe0i \u0111\u1ec3 \u0111\xe1nh");
        } else {
          u.default.getInstance().requestPlayCard(t);
        }
      }
      this._khongThaoTac = false;
    };
    e.prototype.onBtnAnBai = function() {
      C.default.getInstance().playbtnClick();
      u.default.getInstance().requestTakeCard(this.currentTakeCardID);
      this._khongThaoTac = false;
    };
    e.prototype.onBtnRutBai = function() {
      C.default.getInstance().playEffect("Sounds/phom/withdraw_card");
      u.default.getInstance().requestDrawCard();
      this._khongThaoTac = false;
    };
    e.prototype.onBtnHaPhom = function() {
      C.default.getInstance().playbtnClick();
      u.default.getInstance().requestHaPhom(this.myCardSet.getListCardIDSelected());
      this.myCardSet.getListCardIDSelected();
      this._khongThaoTac = false;
    };
    e.prototype.onBtnXepBai = function() {
      C.default.getInstance().playbtnClick();
      this.sortCards();
      this._khongThaoTac = false;
    };
    e.prototype.onBtnGuiBai = function() {
      C.default.getInstance().playbtnClick();
      u.default.getInstance().requestGuiBai(this.myCardSet.getListCardIDSelected());
      this._khongThaoTac = false;
    };
    e.prototype.onBtnBaoU = function() {
      C.default.getInstance().playbtnClick();
      u.default.getInstance().requestBaoU();
      this._khongThaoTac = false;
    };
    e.prototype.showPlayerViewBauCua = function(t, e) {
      if (t.node.active !== e && this.state !== p.GameState.PLAYING) {
        t.node.active = e;
      }
    };
    e.prototype.onUserJoinTable = function(e) {
      if (t.prototype.onUserJoinTable.call(this, e), this.isDealCardEd) {
        var i = this.getPlayer(e.uid);
        if (null !== i && void 0 !== i) {
          i.node.active = false;
          if (i.indexPos < this.inviteBtns.length) {
            this.inviteBtns[i.indexPos].active = true;
          }
        }
      }
    };
    o([A(cc.SpriteFrame)], e.prototype, "background", void 0);
    o([A(cc.Node)], e.prototype, "listCardPositionUI", void 0);
    o([A(cc.Prefab)], e.prototype, "prefabCardSet", void 0);
    o([A(cc.Node)], e.prototype, "listBtnMain", void 0);
    o([A(cc.Node)], e.prototype, "btnDanhBai", void 0);
    o([A(cc.Node)], e.prototype, "btnAnBai", void 0);
    o([A(cc.Node)], e.prototype, "btnHaPhom", void 0);
    o([A(cc.Node)], e.prototype, "btnBaoU", void 0);
    o([A(cc.Node)], e.prototype, "btnGuiBai", void 0);
    o([A(cc.Node)], e.prototype, "btnRutBai", void 0);
    o([A(cc.Node)], e.prototype, "btnXepBai", void 0);
    o([A(s.default)], e.prototype, "phomCardPack", void 0);
    o([A(cc.Node)], e.prototype, "iconSelection", void 0);
    o([A(cc.Prefab)], e.prototype, "prefabMoneyUI", void 0);
    o([A(cc.Prefab)], e.prototype, "prefabPhomRank", void 0);
    return e = o([I], e);
  }(a.default);
i.default = P;
void 0;
