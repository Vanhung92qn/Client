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
var a = t("./MessageCardGameHandler"),
  s = t("./PlayerView"),
  r = t("./GamePlayManager"),
  c = t("./MessageCardGameHandler"),
  l = t("./StringUtil"),
  h = t("./GameZOrder"),
  u = t("./CardGameCommonRequest"),
  d = t("./GameConfigManager"),
  p = t("./CommonPrefabsManager"),
  f = t("./CardGameTableController"),
  g = t("./ErrorLogHandler"),
  m = t("./BetLabel"),
  y = t("./ListChatIconConfig"),
  S = t("./EmoScript"),
  _ = t("./BaseScene"),
  v = t("./GameDefine"),
  b = t("./RoomMessageHandler"),
  C = cc._decorator,
  T = C.ccclass,
  E = C.property,
  I = new cc.Color(61, 253, 255, 255),
  A = new cc.Color(235, 118, 0, 255),
  P = new cc.Color(255, 45, 45, 255);
i.posOutScreen = new cc.Vec3(5e3, 5e3, 5e3);
var M = function(t) {
  function e() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.mainGameViewModel = null;
    e.playerAvartaPrefabs = null;
    e.btnInvitePrefabs = null;
    e.prefabsGameCard = null;
    e.listBtnInvitePos = [];
    e.POS2 = [];
    e.POS3 = [];
    e.POS4 = [];
    e.POS5 = [];
    e.POS6 = [];
    e.POS7 = [];
    e.POS8 = [];
    e.POS9 = [];
    e.POS2_2 = [];
    e.POS5_2 = [];
    e.state = 0;
    e.gameState = 1;
    e.bet = 0;
    e.isHost = false;
    e.AllPlayers = {};
    e.players = [];
    e.playersPlaying = [];
    e._outOfSightPlayers = [];
    e.pendingJoinPlayers = [];
    e.pendingRemovePlayers = [];
    e._dangKetThuc = false;
    e._dangXocDia = true;
    e._ngungNhanCuoc = true;
    e.tuDongGuiSanSang = false;
    e.gameRutTien = false;
    e.autoReady = false;
    e._playedOnce = false;
    e._joinedTable = false;
    e._dangPhatBai = false;
    e._subscribedToGetOut = false;
    e._autoWithDrawMoney = false;
    e._moneyToAutoWithdraw = 0;
    e._daNgoi = true;
    e._forcedQuit = false;
    e._forcedToLeaveRoom = false;
    e.loaded = false;
    e._khongThaoTac = true;
    e._soVanKhongThaoTac = 0;
    e.isClickExit = false;
    e.isDelayLeave = false;
    e._incognito = false;
    e.inviteBtns = [];
    e.rutTienBtn = null;
    e.scalePlayerViewMine = .9;
    e.scalePlayerOther = .7;
    e.moneys = [];
    e.isClick = false;
    e.prefabsCardGameTableController = null;
    e.cardGameTableController = null;
    e.tuChoiGame = false;
    e.isInBgMode = false;
    e.oldClickTime = 0;
    e.isGameAnDanh = false;
    e.isGameAnDanhCheck = false;
    e.winEffectPrefab = null;
    e.winEffectList = [];
    e.winTextEffectPrefab = null;
    e.winTextEffectList = [];
    e.nodepoolingPlayerView = null;
    e.listChatIconConfig = null;
    e.emoSlotIndexPos = [];
    e.playerViewpos4AnDanh = null;
    e.maxUserInRoom = -1;
    e.totalCoinInGame = 0;
    e.coPass = false;
    e.popupHasPlayerNotReady = null;
    e.listChatHistory = [];
    return e;
  }
  n(e, t);
  e.prototype.initDefaultData = function() {
    for (var t in this.size = this.node.getContentSize(), this.state = a.GameState.WAITING, this._playedOnce = false, this
        ._joinedTable = false, this._dangPhatBai = false, null !== this.rutTienBtn && (this.rutTienBtn.active = false), this
        ._subscribedToGetOut = false, this._autoWithDrawMoney = false, this._moneyToAutoWithdraw = 0, this._dangKetThuc = false, this
        .tuDongGuiSanSang = d.default.getInstance().autoReady, this._forcedQuit = false, this._forcedToLeaveRoom = false, this.loaded =
        false, this._khongThaoTac = true, this._soVanKhongThaoTac = 0, this.bet = 0, this.maxMoneyBuyIn = 0, this.minMoneyBuyIn = 0,
        this.isHost = false, this._thisPlayerView = null, this._incognito = false, this.LeaveRoomMessage = null, this.AllPlayers) {
      var e = this.AllPlayers[t];
      if (null !== e && void 0 !== e) {
        for (var i = 0; i < e.coins.length; i++) {
          e.coins[i].removeFromParent(true);
        }
        e.destroyMe();
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
  e.prototype.hide = function() {
    this.node.active = false;
    this.isClickExit = false;
  };
  e.prototype.setMiniGameNode = function() {};
  e.prototype.walkUpBase = function(t) {
    this.mainGameViewModel = t;
    this.node.active = true;
    this.node.opacity = 0;
    this.node.scale = 0;
    this.initDefaultData();
    this.setMiniGameNode();
  };
  e.prototype.onLoad = function() {
    var t = this;
    if (this.nodepoolingPlayerView = new cc.NodePool(), null != this.prefabsCardGameTableController) {
      var e = cc.instantiate(this.prefabsCardGameTableController);
      e.parent = this.node;
      e.zIndex = -2;
      this.cardGameTableController = e.getComponent(f.default);
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
    this.listBtnInvitePos.forEach(function(e) {
      var i = cc.instantiate(t.btnInvitePrefabs);
      if (i.parent = t.node, i.zIndex = -1, i.position = e.position, t.inviteBtns.push(i), null !== t.winEffectPrefab && void 0 !==
        t.winEffectPrefab) {
        var n = cc.instantiate(t.winEffectPrefab);
        n.parent = t.node;
        n.position = e.position;
        n.zIndex = -1;
        t.winEffectList.push(n);
        n.active = false;
      }
      if (null !== t.winTextEffectPrefab && void 0 !== t.winTextEffectPrefab) {
        var o = cc.instantiate(t.winTextEffectPrefab);
        o.parent = t.node;
        o.position = e.position;
        o.zIndex = h.default.TOP;
        t.winTextEffectList.push(o.getComponent(m.default));
        o.active = false;
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
    cc.loader.loadRes("TX/ListChatIconConfig", function(t, e) {
      if (p.default.getInstance().hideLoading(), null === e) {
        ;
      } else {
        (n = cc.instantiate(e)).parent = this.node;
        this.listChatIconConfig = n.getComponent(y.default);
        for (var i = 0; i < this.inviteBtns.length; ++i) {
          var n;
          (n = cc.instantiate(this.listChatIconConfig.iconProfap)).parent = this.node;
          n.position = this.inviteBtns[i].position;
          n.active = false;
          n.zIndex = 1;
          var o = n.getComponent(S.default);
          this.emoSlotIndexPos.push(o);
        }
      }
    }.bind(this));
  };
  e.prototype.processIngameUserChat = function(t, e) {
    if (void 0 === e) {
      e = false;
    }
    var i = t.uid,
      n = t.mgs,
      o = t.dn,
      a = t.c;
    this.showChat(t, i, n, e, o, a);
  };
  e.prototype.onReceiveMessage = function(t, e, i, n) {
    switch (void 0 === n && (n = true), t != c.Global_Message.GET_TABLES && d.default.getInstance().enviromentName.includes("pre") && _
      .default.currentSceneName != v.GameConfigs.SceneName.BauCua && g.default.getInstance().addLog(JSON.stringify(i)), t) {
      case c.Global_Message.INGAME_JOIN_TABLE_INFOS:
        this.onGetInGameTableInfo(i);
        break;
      case c.Global_Message.SET_AUTO_READY:
        cc.error(i);
        break;
      case c.Global_Message.INGAME_USER_LEAVE_AND_JOIN_TABLE:
        var o = i.t,
          a = i.p;
        1 === o ? this.onUserJoinTable(a) : 2 === o && this.onUserLeaveTable(a);
        break;
      case c.Global_Message.UPDATE_BATCH_PLAYER_IN_ROOM:
        if (null !== i.ps && void 0 !== i.ps) {
          for (var s = 0; s < i.ps.length; ++s) {
            o = i.ps[s].t;
            var h = i.ps[s].p;
            if (1 === o) {
              this.onUserJoinTable(h);
            } else {
              if (2 === o) {
                this.onUserLeaveTable(h);
              }
            }
          }
        }
        null !== i.tTU && void 0 !== i.tTU && this.setTextUserbanCHung(i.tTU);
        break;
      case c.Global_Message.INGAME_USER_CHAT:
        this.processIngameUserChat(i);
        break;
      case c.Global_Message.BATCH_INGAME_USER_CHAT:
        var f = i.bmgs;
        if (f) {
          for (var m = 0; m < f.length; m++) {
            if (0 !== f[m].uid.localeCompare(r.default.getInstance().userID)) {
              this.processIngameUserChat(f[m], true);
            }
          }
        }
        break;
      case c.Global_Message.INGAME_SEND_READY_TO_COUNT_DOWN:
        this.autoSendReady();
        break;
      case c.Global_Message.INGAME_USER_READY:
        var y = i.uid;
        this.setReadyForPlayer(y);
        break;
      case c.Global_Message.INGAME_UPDATE_MONEY:
        var S = i.ps;
        this.updateMoneysMsg(S);
        break;
      case c.Global_Message.REFRESH_MONEY:
        var b = i.As,
          C = b.vip,
          T = b.gold,
          E = b.chip,
          I = b.safe;
        r.default.getInstance().vip = C;
        r.default.getInstance().gold = T;
        r.default.getInstance().chip = E;
        r.default.getInstance().goldSafe = I;
        this.refreshMoney(b);
        break;
      case c.Global_Message.BUY_IN:
        y = i.uid;
        var A = i.m;
        this.moneyWithdrawalResponse(y, A);
        break;
      case c.Global_Message.INGAME_CHANGE_HOST:
        y = i.uid;
        this.setHostPlayer(y);
        break;
      case c.Global_Message.FIND_PLAYERS_TO_INVITE:
        for (var P = i.us, M = [], O = 0; O < P.length; O++) {
          var N = P[O];
          M.push(N.u);
        }
        u.default.getInstance().sendInvitePlayers(M);
        p.default.getInstance().showPopupMessageUtil(
          "H\u1ec7 th\u1ed1ng \u0111\xe3 g\u1eedi l\u1eddi m\u1eddi \u0111\u1ebfn ng\u01b0\u1eddi ch\u01a1i kh\xe1c!");
        break;
      case c.Global_Message.JOIN_TABLE_INVITATION:
        if (false === this.node.active && false === r.default.getInstance().iskteckgame) {
          var B = i.fu,
            D = i.ri;
          p.default.getInstance().showPopupInviRoom(B, D);
        }
        break;
      case c.Global_Message.BAO_QUAY:
        l.default.isNullOrEmpty(i.mgs) ? p.default.getInstance().showPopupMessageUtil(
            "Ch\xfang t\xf4i s\u1ebd s\u1eed l\xfd v\xe0 th\xf4ng b\xe1o qua h\u1ed9p th\u01b0.") : p.default.getInstance()
          .showPopupMessageUtil(i.mgs);
    }
  };
  e.prototype.sendAutoReadyPreference = function() {
    b.default.getInstance().sendAutoReadyPref(d.default.getInstance().autoReady);
  };
  e.prototype.autoSendReady = function() {
    if (this._daNgoi) {
      if (this.isHost) {
        this.sendReady();
      } else {
        if (this.tuDongGuiSanSang || d.default.getInstance().autoReady) {
          this.sendReady();
        } else {
          if (null != this.cardGameTableController) {
            this.cardGameTableController.readyBtn.active = true;
          }
        }
      }
    }
  };
  e.prototype.setTextUserbanCHung = function(t) {};
  e.prototype.onGetInGameTableInfo = function(t) {
    p.default.getInstance().hideLoading();
    this.sendAutoReadyPreference();
    this.node.opacity = 255;
    this.node.scale = 1;
    if (null !== this.mainGameViewModel.roomController && void 0 !== this.mainGameViewModel.roomController) {
      this.mainGameViewModel.roomController.node.active = false;
    }
    if (d.default.getInstance().enviromentName.indexOf("pre") >= 0) {
      g.default.getInstance().clearLogString();
      g.default.getInstance().addLog(JSON.stringify(t));
    }
    if (null !== t.hpwd && void 0 !== t.hpwd && t.hpwd) {
      this.isGameAnDanh = false;
      this.isGameAnDanhCheck = false;
    }
    if (this.cardGameTableController) {
      if (t.cH) {
        this.listChatHistory = t.cH;
      } else {
        this.listChatHistory = [];
      }
      this.cardGameTableController.loadChatHistory();
    }
  };
  e.prototype.onUserJoinTable = function(t) {
    var e = false;
    if (this.state !== a.GameState.WAITING) {
      e = true;
    }
    this.addPlayerWithDict(t);
    if (e) {
      this.updateViewingPlayerPositions();
    } else {
      this.updateReadyStatus();
      this.updateViewPostions(false, true);
    }
  };
  e.prototype.onUserLeaveTable = function(t) {
    var e = t.uid;
    this.removePlayer(e);
  };
  e.prototype.setGameConfig = function(t, e, i, n, o, a) {
    if (this.bet = t, this.gameState = e, this.remainingTime = i, this.assetID = n, this.maxUser = o, this.coPass = a, null != this
      .cardGameTableController) {
      var s = this.isGameAnDanh;
      if (a) {
        s = false;
      }
      this.cardGameTableController.setGameConfig(t, s, a);
    }
  };
  e.prototype.setMoneyBuyInThreshold = function(t, e) {
    this.minMoneyBuyIn = t;
    this.maxMoneyBuyIn = e;
    r.default.getInstance().minBuyIn = this.minMoneyBuyIn;
    r.default.getInstance().maxBuyIn = this.maxMoneyBuyIn;
    r.default.getInstance().bet = this.bet;
  };
  e.prototype.getPlayer = function(t) {
    return this.AllPlayers[t];
  };
  e.prototype.getRmcDefaul = function() {
    return 3;
  };
  e.prototype.checkReconnect = function(t) {
    return false;
  };
  e.prototype.addPlayerWithDict = function(t) {
    var e = t.uid,
      i = t.C;
    if (0 === e.localeCompare(r.default.getInstance().userID)) {
      this.isHost = i;
    }
    var n = t.m,
      o = t.pS,
      s = this.getRmcDefaul(),
      c = t.sit,
      l = t.dn,
      h = t.r,
      u = t.pid,
      d = t.pi;
    if (this.state === a.GameState.WAITING || this.checkReconnect(t)) {
      d = true;
    }
    if (this._dangPhatBai) {
      if (!(r.default.getInstance().gameID !== a.GAME.XITO && r.default.getInstance().gameID !== a.GAME.POKER)) {
        d = false;
      }
    }
    var p = t.As,
      f = t.a,
      g = 0;
    if (null !== t.id && void 0 !== t.id && (g = t.id), null !== t.rM && void 0 !== t.rM) {
      var m = t.rM;
      p.rM = m;
    }
    var y = this.addPlayer(l, e, i, n, o, s, c, h, u, d, p, f, g);
    if (y.isPlaying = t.pi, this.state === a.GameState.VIEWING) {
      var S = t.cb;
      y._currentBet = S;
    }
  };
  e.prototype.createListPlayerWhenGetTableInfo = function(t) {
    for (var e = 0; e < t.length; ++e) {
      var i = t[e];
      this.addPlayerWithDict(i);
    }
  };
  e.prototype.addPlayer = function(t, e, n, o, a, r, c, l, u, d, p, f, g) {
    var m = this.getPlayer(e);
    if (null !== m && void 0 !== m) {
      this.removePendingPlayerWith(e);
      return m;
    }
    var y = this.getPlayerView();
    y.parent = this.node;
    y.zIndex = h.default.BOTTOM;
    y.setPosition(i.posOutScreen);
    (m = y.getComponent(s.default)).addInfo(t, e, n, o, a, r, c, l, u, g, p, f, this.isGameAnDanh);
    if (m.isMine()) {
      this._thisPlayerView = m;
    }
    this.AllPlayers[m.userID] = m;
    if (d || m.isMine()) {
      this.players.push(m);
    } else {
      this.pendingJoinPlayers.push(m);
    }
    if (m.isMine()) {
      m.node.scale = this.scalePlayerViewMine;
    } else {
      m.node.scale = this.scalePlayerOther;
    }
    return m;
  };
  e.prototype.sortVectorPlayers = function() {
    this.players.sort(function(t, e) {
      return t.sit > e.sit ? 1 : t.sit < e.sit ? -1 : 0;
    });
  };
  e.prototype.showHideInviteBtn = function() {
    if (-1 == this.maxUserInRoom) {
      for (var t = 0; t < this.inviteBtns.length; ++t) {
        this.inviteBtns[t].active = true;
      }
    } else {
      var e = true;
      for (t = 0; t < this.inviteBtns.length; ++t) {
        if (t >= this.maxUserInRoom) {
          e = false;
        }
        this.inviteBtns[this.POS9[t]].active = e;
      }
    }
  };
  e.prototype.updateViewPostions = function(t, e, i) {
    if (void 0 === t) {
      t = false;
    }
    if (void 0 === e) {
      e = false;
    }
    if (void 0 === i) {
      i = false;
    }
    this.showHideInviteBtn();
    this.sortVectorPlayers();
    for (var n = 0; n < this.players.length; ++n) {
      (o = this.players[n]).index = n;
    }
    for (n = 0; n < this.players.length; ++n) {
      var o = this.players[n];
      this.showPlayerViewBauCua(o, true);
      o.stopViewAction();
      o.pos = this.getViewPositionOfPlayer(o, n);
      if (o.indexPos < this.inviteBtns.length && o.node.active) {
        this.inviteBtns[o.indexPos].active = false;
      }
      if (!e || e && !o.isMine()) {
        if (o.isMine() && o.isMine() && !i) {
          o.runToPos(this.size);
        } else {
          o.runToPos(this.size, t);
        }
      }
    }
    this.updateViewingPlayerPositions();
    this._joinedTable = true;
  };
  e.prototype.getViewPositionOfPlayer = function(t, e) {
    var i = -1;
    if (null !== this._thisPlayerView && void 0 !== this._thisPlayerView) {
      i = this._thisPlayerView.index;
    }
    var n = this.inviteBtns.length;
    if (i >= 0) {
      e = (e + n - i) % n;
    }
    t.indexPos = e;
    return this.inviteBtns[e].position;
  };
  e.prototype.buyIn = function() {};
  e.prototype.updateReadyStatus = function() {
    if (this.state !== a.GameState.VIEWING && this.state !== a.GameState.PLAYING) {
      for (t = 0; t < this.players.length; ++t) {
        if ((e = this.players[t]).isHost) {
          e.node.color = cc.Color.WHITE;
        } else {
          if (e.isReady) {
            e.node.color = cc.Color.WHITE;
            e.iconnReady.active = true;
          } else {
            e.isReady = false;
            e.iconnReady.active = false;
          }
          if (this.isHost && false === e.isMine()) {
            e.kickButton.active = false;
          }
        }
      }
    } else {
      for (var t = 0; t < this.players.length; ++t) {
        var e;
        (e = this.players[t]).node.color = cc.Color.WHITE;
        e.isReady = false;
        e.iconnReady.active = false;
      }
    }
  };
  e.prototype.moneyWithdrawalResponse = function(t, e) {
    for (var i = 0; i < this.players.length; ++i) {
      if (0 === (n = this.players[i]).userID.localeCompare(t)) {
        n._money = e;
        return void n.setMoney(e);
      }
    }
    for (i = 0; i < this.pendingJoinPlayers.length; ++i) {
      var n;
      if (0 === (n = this.pendingJoinPlayers[i]).userID.localeCompare(t)) {
        n._money = e;
        return void n.setMoney(e);
      }
    }
  };
  e.prototype.setReadyForPlayer = function(t) {
    if (this.state !== a.GameState.WAITING) {
      ;
    } else {
      var e = this.getPlayer(t);
      if (null === e || void 0 === e) {
        return;
      }
      if (e.isReady) {
        return;
      }
      if (e.isMine() && null != this.cardGameTableController) {
        this.cardGameTableController.readyBtn.active = false;
      }
      e.isReady = true;
      if (!e.isHost) {
        e.iconnReady.active = true;
      }
      if (this.isHost) {
        this.hostCheckAllPlayerReadyForShowButtonStartGameWhenUserReady();
      }
    }
  };
  e.prototype.hostCheckAllPlayerReadyForShowButtonStartWhenRemovePlayer = function() {
    this.checkAllPlayerReadyForShowButtonStartWhenRemovePlayer();
  };
  e.prototype.checkAllPlayerReadyForShowButtonStartWhenRemovePlayer = function() {
    for (var t = 0, e = 0; e < this.players.length; ++e) {
      var i = this.players[e];
      if (!i.isMine() && i.isReady) {
        t++;
      }
    }
    if (!(t !== this.players.length - 1 || 0 == t || this._dangPhatBai)) {
      if (null != this.cardGameTableController && this.players.length >= 2) {
        this.cardGameTableController.startBtn.active = true;
      }
    }
    if (t > 0 && !this._dangPhatBai && null != this.cardGameTableController && this.players.length >= 2) {
      this.cardGameTableController.startBtn.active = true;
    }
  };
  e.prototype.checkShowButtonStartWhenRemovePlayer = function() {
    if (!this._dangPhatBai && this.players.length >= 2 && null != this.cardGameTableController) {
      this.cardGameTableController.startBtn.active = true;
    }
  };
  e.prototype.hostCheckAllPlayerReadyForShowButtonStartGameWhenUserReady = function() {
    this.checkAllPlayerReadyForShowButtonStartGameWhenUserReady();
  };
  e.prototype.checkAllPlayerReadyForShowButtonStartGameWhenUserReady = function() {
    for (var t = 0, e = 0; e < this.players.length; ++e) {
      var i = this.players[e];
      if (false === i.isMine() && i.isReady) {
        t++;
      }
    }
    if (t === this.players.length - 1 && 0 != t && this.players.length >= 2 && null != this.cardGameTableController) {
      this.cardGameTableController.startBtn.active = true;
      if (this.isHost && this.tuChoiGame) {
        this.cardGameTableController.sendStart();
      }
    }
    if (t > 0 && !this._dangPhatBai && this.players.length >= 2 && null != this.cardGameTableController) {
      this.cardGameTableController.startBtn.active = true;
    }
  };
  e.prototype.checkShowButtonStartGameWhenUserReady = function() {
    if (!this._dangPhatBai && this.players.length >= 2 && null != this.cardGameTableController) {
      this.cardGameTableController.startBtn.active = true;
    }
  };
  e.prototype.hostCheckAllPlayerReadyForShowButtonStartGameWhenChangeHost = function() {
    this.checkAllPlayerReadyForShowButtonStartGameWhenChangeHost();
  };
  e.prototype.checkAllPlayerReadyForShowButtonStartGameWhenChangeHost = function() {
    if (this.isHost) {
      if (null != this.cardGameTableController) {
        this.cardGameTableController.readyBtn.active = false;
      }
      for (var t = 0, e = 0; e < this.players.length; ++e) {
        var i = this.players[e];
        if (!i.isMine() && i.isReady) {
          t++;
        }
      }
      if (t > 0 && this.checkGameIsDOneAndWaitingToStart() && null != this.cardGameTableController && this.players.length >= 2) {
        this.cardGameTableController.startBtn.active = true;
      }
    }
  };
  e.prototype.checkShowButtonStartGameWhenChangeHost = function() {
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
  e.prototype.sendReady = function() {
    u.default.getInstance().sendReady();
  };
  e.prototype.sendStart = function() {
    this.cardGameTableController.sendStartCmd();
  };
  e.prototype.hostSendStartGame = function() {
    for (var t = this, e = 0, i = 0; i < this.players.length; ++i) {
      var n = this.players[i];
      if (false === n.isMine() && n.isReady) {
        e++;
      }
    }
    if (0 != e && e === this.players.length - 1) {
      this.sendStart();
    } else if (r.default.getInstance().isHostSentStartWarningOtherNotReady) {
      this.sendStart();
    } else {
      var o = p.default.getInstance().showPopup2Button();
      o.onOKClicked = function() {
        o.hide();
        t.sendStart();
      };
      o.onCancelClicked = function() {
        o.hide();
      };
      o.setContent("C\xf3 ng\u01b0\u1eddi ch\u01a1i ch\u01b0a s\u1eb5n s\xe0ng, b\u1ea1n c\xf3 mu\u1ed1n b\u1eaft \u0111\u1ea7u?");
      r.default.getInstance().isHostSentStartWarningOtherNotReady = true;
      this.popupHasPlayerNotReady = o;
    }
  };
  e.prototype.getViewPositionOfViewingPlayer = function(t, e) {
    if (t.isMine()) {
      for (var n = false, o = this.inviteBtns[0].position, a = 0; a < this.players.length; ++a) {
        t = this.players[a];
        if (l.default.checkVec2Equal(t.pos, o)) {
          n = true;
          break;
        }
      }
      if (!n) {
        t.indexPos = 0;
        return o;
      }
    }
    for (a = 0; a < this.inviteBtns.length; ++a) {
      var s = this.inviteBtns[a];
      if (s.active) {
        t.indexPos = a;
        s.active = false;
        return s.position;
      }
    }
    return new cc.Vec2(i.posOutScreen.x, i.posOutScreen.y);
  };
  e.prototype.updateViewingPlayerPositions = function() {
    this.pendingJoinPlayers.sort(function(t, e) {
      return t.sit > e.sit ? 1 : t.sit < e.sit ? -1 : 0;
    });
    for (var t = 0; t < this.pendingJoinPlayers.length; ++t) {
      var e = this.pendingJoinPlayers[t];
      this.showPlayerViewBauCua(e, true);
      e.iconnReady.active = false;
      e.kickButton.active = false;
      e.runViewAction();
      if (l.default.checkVec2Equal(e.node.position, cc.Vec2.ZERO) || this.state === a.GameState.WAITING) {
        e.pos = this.getViewPositionOfViewingPlayer(e, t);
        if (this.state !== a.GameState.VIEWING || e.isMine() || this._joinedTable) {
          e.runToPos(this.size);
        } else {
          e.node.position = e.pos;
        }
      }
    }
  };
  e.prototype.removePlayer = function(t) {
    if (this.state !== a.GameState.WAITING) {
      for (var e = 0; e < this.pendingJoinPlayers.length; ++e) {
        var i = this.pendingJoinPlayers[e];
        if (0 === i.userID.localeCompare(t)) {
          if (void 0 != this.inviteBtns[i.indexPos] && null != this.inviteBtns[i.indexPos]) {
            this.inviteBtns[i.indexPos].active = true;
            this.emoSlotIndexPos[i.indexPos].hide();
          }
          this.pendingJoinPlayers.splice(e, 1);
          delete this.AllPlayers[t];
          this.updateViewingPlayerPositions();
          if (this.autoReady && r.default.getInstance().gameID !== a.GAME.BINH) {
            if (i.isMine()) {
              this.isHost = false;
            } else {
              this._daNgoi;
            }
          }
          return void i.destroyMe();
        }
      }
      var n = this.getPlayer(t);
      if (null !== n && void 0 !== n) {
        n.removeChat();
        if (this.autoReady && r.default.getInstance().gameID !== a.GAME.BINH && n.isMine()) {
          if (n.checkInThisArray(this.playersPlaying)) {
            this.pendingRemovePlayers.push(n);
            n.iconQuit.active = true;
          } else {
            this.players.splice(n.index, 1);
            this.updateViewPostions(false, true);
            n.node.removeFromParent(true);
            delete this.AllPlayers[t];
          }
        } else {
          this.pendingRemovePlayers.push(n);
          n.iconQuit.active = true;
        }
      }
    } else {
      for (e = 0; e < this.players.length; e++) {
        var o = this.players[e];
        if (0 === o.userID.localeCompare(t)) {
          this.emoSlotIndexPos[o.indexPos].hide();
          o.removeChat();
          o.cards.forEach(function(t) {
            t.node.removeFromParent(true);
          });
          if (this.players.length <= 1 && null != this.cardGameTableController) {
            this.cardGameTableController.stopProgressStartGame();
            this.cardGameTableController.hideReadyBtn();
          }
          o.node.removeFromParent(true);
          this.players.splice(e, 1);
          delete this.AllPlayers[t];
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
  e.prototype.onLogOut = function() {};
  e.prototype.hideAllEmoticon = function() {
    for (var t = 0; t < this.emoSlotIndexPos.length; t++) {
      this.emoSlotIndexPos[t].hide();
    }
  };
  e.prototype.handleLeaveRoomResponse = function() {
    var t = this;
    if (this.isClickExit = false, this.cardGameTableController.handleLeaveRoom(), !r.default.getInstance().onLogOutKickUser()) {
      if (this.hideAllEmoticon(), r.default.getInstance().gameID == a.GAME.BACAY) {
        for (var e = 0; e < this.playersPlaying.length; e++) {
          this.playersPlaying[e].getComponent(s.default).reset();
        }
      }
      if (this.isDelayLeave) {
        this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function() {
          t.mainGameViewModel.showGameList(t.LeaveRoomMessage);
        })));
        this.isDelayLeave = false;
      } else {
        this.mainGameViewModel.showGameList(this.LeaveRoomMessage);
      }
    }
  };
  e.prototype.sendLeaveRoom = function() {
    u.default.getInstance().sendLeaveRoom();
    if ("1" == cc.sys.localStorage.getItem("isPlayBauCua")) {
      cc.sys.localStorage.setItem("isPlayBauCua", "0");
    }
    if ("1" == cc.sys.localStorage.getItem("isPlayXocDia")) {
      cc.sys.localStorage.setItem("isPlayXocDia", "0");
    }
    this.isClickExit = true;
  };
  e.prototype.getMinePlayer = function() {
    for (var t = 0; t < this.players.length; ++t) {
      var e = this.players[t];
      if (e.isMine()) {
        return e;
      }
    }
    return null;
  };
  e.prototype.showChat = function(t, e, i, n, o, a) {
    if (void 0 === n && (n = false), void 0 === o && (o = ""), void 0 === a && (a = 0), 0 !== i.length && " " !== i && !this
      .isGameAnDanhCheck) {
      if (0 === a) {
        var s = this.getPlayer(e);
        this.showChatForVisibliePlayer(s, i, n);
      }
      if (this.cardGameTableController) {
        if (0 === a) {
          var c = I;
          if (0 !== e.localeCompare(r.default.getInstance().userID)) {
            c = A;
          }
          this.cardGameTableController.loadChat(t, i, o, false, -1, c, c);
        } else {
          this.cardGameTableController.loadChat(t, i, "", true, -1, P, P);
        }
      }
    }
  };
  e.prototype.getListChatDefaultText = function() {
    return ["\u0110\xe1nh l\u1eb9 \u0111i pa", "Heo \u0111\xe2u, heo \u0111\xe2u", "Gi\u1ebft c\xf3ng m\u1ea5y ch\xfa", "Xui vl",
      "Th\xfai heo n\xe8", "Nu\xf4i heo h\u1ea3 c\u01b0ng", "M\xecnh anh ch\u1ea5p h\u1ebft", "T\u1edbi Tr\u1eafng n\xe8",
      "Th\u1eafng r\u1ed3i yeah yeah"
    ];
  };
  e.prototype.locPlayingPlayer = function(t) {
    var e = [];
    this.players = [];
    for (var i = 0; i < t.length; ++i) {
      var n = this.AllPlayers[t[i]];
      if (null !== n && void 0 !== n) {
        e.push(n);
        this.players.push(n);
      }
    }
    for (var o in this.pendingJoinPlayers = [], this.AllPlayers) {
      var a = this.AllPlayers[o];
      if (!(null === a || void 0 === a || a.checkInThisArray(e))) {
        if (a.isMine()) {
          this.players.push(a);
        } else {
          this.pendingJoinPlayers.push(a);
        }
      }
    }
    this.playersPlaying = [];
    this.playersPlaying = e;
    this.updateViewPostions(false, true);
  };
  e.prototype.startBetting = function(t) {
    if (!(t <= 0)) {
      if (this.players.length <= 1) {
        if (null != this.cardGameTableController) {
          this.cardGameTableController.stopProgressStartGame();
        }
      } else {
        if (null != this.cardGameTableController) {
          this.cardGameTableController.startBetting(t, 7);
        }
      }
    }
  };
  e.prototype.updateMoneys = function() {};
  e.prototype.updateMoneysMsg = function(t) {
    this.moneys = t;
    for (var e = 0; e < this.moneys.length; e++) {
      var i = this.moneys[e].uid;
      if (!l.default.isNullOrEmpty(i) && 0 === i.localeCompare(r.default.getInstance().userID)) {
        var n = this.moneys[e].m;
        r.default.getInstance().gold = n;
        if (null !== this.mainGameViewModel && void 0 !== this.mainGameViewModel && null !== this.mainGameViewModel.headerUi &&
          void 0 !== this.mainGameViewModel.headerUi) {
          this.mainGameViewModel.headerUi.updateUI();
        }
      }
    }
  };
  e.prototype.refreshMoney = function(t) {
    var e = t.vip,
      i = t.gold,
      n = t.chip,
      o = t.safe;
    r.default.getInstance().vip = e;
    r.default.getInstance().gold = i;
    r.default.getInstance().chip = n;
    r.default.getInstance().goldSafe = o;
    if (this.gameRutTien && null !== this._thisPlayerView && void 0 !== this._thisPlayerView) {
      this._thisPlayerView._realMoney = i;
    }
  };
  e.prototype.removeNodeFromParent = function(t, e) {
    e.removeFromParent(true);
  };
  e.prototype.checkGameIsDOneAndWaitingToStart = function() {
    return !this._dangPhatBai;
  };
  e.prototype.setHostPlayer = function(t) {
    this.isHost = 0 === t.localeCompare(r.default.getInstance().userID);
    var e = false;
    if (this.players.forEach(function(i) {
        if (0 === i.userID.localeCompare(t)) {
          i.isHost = true;
          i.iconnReady.active = false;
          i.iconHost.active = true;
          e = true;
        } else {
          i.isHost = false;
          i.iconHost.active = false;
        }
      }), !e) {
      var i = this.getPlayer(t);
      if (null !== i && void 0 !== i) {
        i.isHost = true;
        i.iconHost.active = true;
      }
    }
    if (this.isHost) {
      this.hostCheckAllPlayerReadyForShowButtonStartGameWhenChangeHost();
      if (this._daNgoi && this.isHost && this.state === a.GameState.WAITING) {
        this.sendReady();
      }
    }
  };
  e.prototype.handlePendingPlayers = function() {
    this.tuDongGuiSanSang = d.default.getInstance().autoReady;
  };
  e.prototype.checkAndQuitRoom = function() {
    if (this._forcedQuit) {
      this.onLogOut();
      return true;
    }
    if (this._forcedToLeaveRoom) {
      this.handleLeaveRoomResponse();
      return true;
    }
    if (r.default.getInstance().checkBaoTriGame()) {
      this.state = a.GameState.WAITING;
      this.sendLeaveRoom();
      return true;
    }
    if (this._subscribedToGetOut) {
      this.state = a.GameState.WAITING;
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
  e.prototype.onUserClickExit = function() {
    if (this._dangPhatBai || this.state === a.GameState.PLAYING) {
      return this._subscribedToGetOut ? (this._subscribedToGetOut = false, p.default.getInstance().showPopupMessageUtil(
          "B\u1ea1n s\u1ebd \u1edf l\u1ea1i ch\u01a1i ti\u1ebfp."), this.cardGameTableController.inGameBackPopup.btnExit.spriteFrame =
        this.cardGameTableController.inGameBackPopup.iconOutRoom, void(this._thisPlayerView.iconQuit.active = false)) : (this
        ._subscribedToGetOut = true, p.default.getInstance().showPopupMessageUtil(
          "B\u1ea1n s\u1ebd r\u1eddi ph\xf2ng khi k\u1ebft th\xfac v\xe1n."), this.cardGameTableController.inGameBackPopup.btnExit
        .spriteFrame = this.cardGameTableController.inGameBackPopup.iconHuyOutRoom, void(this._thisPlayerView.iconQuit.active = true));
    }
    if (this.isClickExit) {
      p.default.getInstance().showPopupMessageUtil("B\u1ea1n s\u1ebd r\u1eddi ph\xf2ng khi k\u1ebft th\xfac v\xe1n.");
    }
    if (null !== this._thisPlayerView && void 0 !== this._thisPlayerView) {
      this._thisPlayerView.iconQuit.active = true;
    }
    this.sendLeaveRoom();
  };
  e.prototype.setDelayLeaveRoom = function() {
    if (this.isClickExit) {
      this.isDelayLeave = true;
    } else {
      this.isDelayLeave = false;
    }
  };
  e.prototype.getCmdStart = function() {
    return c.Global_Message.START_GAME_CARD;
  };
  e.prototype.getNameGame = function() {
    return "";
  };
  e.prototype.getTag = function() {
    return "";
  };
  e.prototype.getSpriteFrameName = function() {
    return null;
  };
  e.prototype.removePendingPlayers = function() {
    for (var t = 0; t < this.pendingRemovePlayers.length; t++) {
      for (var e = this.pendingRemovePlayers[t], i = 0; i < this.players.length; i++) {
        var n = this.players[i];
        if (0 === n.userID.localeCompare(e.userID)) {
          delete this.AllPlayers[e.userID];
          true;
          this.players.splice(i, 1);
          this.reAddPlayerViewToPooling(n);
          break;
        }
      }
    }
    for (t = 0; t < this.pendingJoinPlayers.length; t++) {
      (e = this.pendingJoinPlayers[t]).index = this.players.length;
      this.players.push(e);
      e.pos = this.getViewPositionOfPlayer(e, e.index);
    }
    this.pendingJoinPlayers = [];
    this.pendingRemovePlayers = [];
    this.updateViewPostions(false, true);
  };
  e.prototype.onEndGame = function() {
    if (d.default.getInstance().enviromentName.indexOf("pre") >= 0) {
      g.default.getInstance().sendLog([this.getTag(), this._thisPlayerView.userID, "vanchoi"], true);
    }
  };
  e.prototype.onFocus = function(t) {
    this.isInBgMode = false;
  };
  e.prototype.onLostFocus = function() {
    this.isInBgMode = true;
  };
  e.prototype.checkNeedRemoveAnnDanh = function() {
    for (var t = 0; t < this.playersPlaying.length; ++t) {
      if (this.playersPlaying[t].isMine()) {
        return true;
      }
    }
    return false;
  };
  e.prototype.showuserAnDanh = function() {
    if (false !== this.checkNeedRemoveAnnDanh()) {
      for (var t = 0; t < this.playersPlaying.length; ++t) {
        this.playersPlaying[t].showAnDanhWhenDone();
      }
      if (null != this.cardGameTableController) {
        this.cardGameTableController.setGameId(this.coPass);
      }
      this.isGameAnDanhCheck = false;
    }
  };
  e.prototype.runWinAction = function(t, e) {
    var i = this.winEffectList[e];
    i.stopAllActions();
    i.active = true;
    i.runAction(cc.sequence(cc.delayTime(t), cc.callFunc(function() {
      i.active = false;
    })));
  };
  e.prototype.showMoneyFxForPlayerWin = function(t, e, i, n, o, a, s) {
    if (void 0 === s && (s = 25), !(t <= 0)) {
      var r = this.winTextEffectList[i].node;
      r.stopAllActions();
      r.active = true;
      r.position = new cc.Vec2(o, a - s * n);
      this.winTextEffectList[i].setNumber(t, false);
      r.scaleX = .2 * n;
      r.opacity = 255;
      r.runAction(cc.sequence(cc.scaleTo(.2, n), cc.moveBy(.3, new cc.Vec2(0, s * n * 2)), cc.delayTime(e - 1), cc.fadeOut(.5), cc
        .callFunc(function() {
          r.active = false;
        })));
    }
  };
  e.prototype.getPlayerView = function() {
    return cc.instantiate(this.playerAvartaPrefabs);
  };
  e.prototype.reAddPlayerViewToPooling = function(t) {
    t.destroyMe();
  };
  e.prototype.getEmoIndex = function(t) {
    if (null !== this.listChatIconConfig && void 0 !== this.listChatIconConfig) {
      var e = this.listChatIconConfig.dataMaping[t];
      if (null !== e && void 0 !== e) {
        return e;
      }
    }
    return -1;
  };
  e.prototype.checkAndShowEmo = function(t, e) {
    if (null !== this.listChatIconConfig && void 0 !== this.listChatIconConfig) {
      var i = this.listChatIconConfig.dataMaping[e];
      if (null !== i && void 0 !== i) {
        return !(t.indexPos < this.emoSlotIndexPos.length) || (this.emoSlotIndexPos[t.indexPos].setAnim(i), this.emoSlotIndexPos[t
            .indexPos].node.zIndex = t.node.zIndex + 1, this.emoSlotIndexPos[t.indexPos].node.scale = t.node.scale, this
          .emoSlotIndexPos[t.indexPos].node.position = t.node.position, true);
      }
    }
    return false;
  };
  e.prototype.showChatForVisibliePlayer = function(t, e, i) {
    if (void 0 === i) {
      i = false;
    }
    if (null !== t && void 0 !== t) {
      if (!this.checkAndShowEmo(t, e)) {
        t.showChat(e);
      }
    }
  };
  e.prototype.showPlayerViewBauCua = function(t, e) {
    if (t.node.active !== e) {
      t.node.active = e;
    }
  };
  e.prototype.checkSpamChat = function() {
    return "";
  };
  e.prototype.getPosanDanh4 = function() {
    return 1;
  };
  e.prototype.initUserAnDanh4 = function(t) {
    if (void 0 === t) {
      t = false;
    }
    var e = this.getPlayerView();
    e.parent = this.node;
    e.zIndex = h.default.BOTTOM;
    e.position = this.inviteBtns[this.getPosanDanh4()].position;
    e.scale = this.scalePlayerOther;
    e.active = false;
    this.playerViewpos4AnDanh = e.getComponent(s.default);
    this.playerViewpos4AnDanh.userID = "ddasdsadsadaszzzz12a091";
    this.playerViewpos4AnDanh.isAnDanh = true;
    if (t) {
      this.playerViewpos4AnDanh.runViewAction();
    }
  };
  e.prototype.showHideuserAnDanh4 = function(t) {
    if (null !== this.playerViewpos4AnDanh && void 0 !== this.playerViewpos4AnDanh) {
      this.playerViewpos4AnDanh.node.active = t;
      for (var e = 0; e < this.playerViewpos4AnDanh.cards.length; ++e) {
        this.playerViewpos4AnDanh.cards[e].node.active = t;
      }
    }
  };
  e.prototype.showViewTableMessage = function() {
    this.scheduleOnce(function() {
      p.default.getInstance().showPopupMessageUtil("B\xe0n \u0111ang ch\u01a1i, xin vui l\xf2ng ch\u1edd!");
    }, .5);
  };
  e.prototype.processCheckToOffAnDanh4 = function() {
    for (var t = 0, e = 0; e < this.players.length; e++) {
      if (!this.players[e].isAnDanh) {
        t++;
      }
    }
    if (t >= 4) {
      this.playerViewpos4AnDanh.node.active = false;
    }
  };
  e.prototype.removePendingPlayerWith = function(t) {
    for (var e = 0; e < this.pendingRemovePlayers.length; ++e) {
      if (0 === this.pendingRemovePlayers[e].userID.localeCompare(t)) {
        this.pendingRemovePlayers.splice(e, 1);
        break;
      }
    }
  };
  e.prototype.getChatHistory = function() {
    return this.listChatHistory;
  };
  e.prototype.onWsCardClose = function() {};
  o([E(cc.Prefab)], e.prototype, "playerAvartaPrefabs", void 0);
  o([E(cc.Prefab)], e.prototype, "btnInvitePrefabs", void 0);
  o([E(cc.Prefab)], e.prototype, "prefabsGameCard", void 0);
  o([E([cc.Node])], e.prototype, "listBtnInvitePos", void 0);
  o([E(cc.Node)], e.prototype, "rutTienBtn", void 0);
  o([E(cc.Prefab)], e.prototype, "prefabsCardGameTableController", void 0);
  o([E(cc.Prefab)], e.prototype, "winEffectPrefab", void 0);
  o([E(cc.Prefab)], e.prototype, "winTextEffectPrefab", void 0);
  return e = o([T], e);
}(cc.Component);
i.default = M;
void 0;
