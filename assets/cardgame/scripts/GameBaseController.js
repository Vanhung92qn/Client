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
var a = require("./GameController"),
  s = require("./MessageCardGameHandler"),
  r = require("./GamePlayManager"),
  c = require("./GameConfigManager"),
  l = cc._decorator,
  h = l.ccclass,
  u = (l.property, function(t) {
    function e() {
      var e = t.call(this) || this;
      e.isReconnect = false;
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {
      t.prototype.onLoad.call(this);
    };
    e.prototype.start = function() {
      this.node.stopAllActions();
    };
    e.prototype.onGetInGameTableInfo = function(e) {
      t.prototype.onGetInGameTableInfo.call(this, e);
      var i = e.b,
        n = e.gS,
        o = e.rmT;
      o /= 1e3;
      var a = e.aid,
        r = e.Mu,
        c = false;
      if (null !== e.hpwd && void 0 !== e.hpwd) {
        c = e.hpwd;
      }
      this.state = s.GameState.WAITING;
      if (4 === n) {
        this.state = s.GameState.VIEWING;
      }
      this.setGameConfig(i, n, o, a, r, c);
      var l = e.tfeg;
      l /= 1e3;
      this.timeToFinish = l;
      var h = e.MMBI,
        u = e.mMBI;
      this.setMoneyBuyInThreshold(u, h);
      var d = e.ps;
      this.createListPlayerWhenGetTableInfo(d);
      this.updateViewPostions(true);
      for (var p = e.ps, f = 0; f < p.length; f++) {
        var g = p[f],
          m = this.getPlayer(g.uid);
        m.isHost = g.C;
        if (g.uid == this._thisPlayerView.userID) {
          this.isHost = g.C;
        }
        m.iconHost.active = m.isHost;
      }
      this._thisPlayerView.iconHost.active = this._thisPlayerView.isHost;
      if (void 0 != e.tfeg) {
        this.timeToFinish = e.tfeg / 1e3;
      } else {
        this.timeToFinish = 5;
      }
      var y = false;
      if (this.state === s.GameState.VIEWING) {
        if (null !== e.re && void 0 !== e.re && true === e.re) {
          y = true;
        } else {
          this.showViewTableMessage();
          y = false;
        }
      } else {
        this.startBetting(o);
      }
      this.isReconnect = y;
      this.updateReadyStatus();
      if (y) {
        this.onReconnect(e);
      } else {
        this.onJoinRoomPlaying(e.cmd, e);
      }
      if (4 == e.gS) {
        this.cardGameTableController.readyBtn.active = false;
        this.cardGameTableController.startBtn.active = false;
      }
    };
    e.prototype.onReceiveMessage = function(e, i, n) {
      t.prototype.onReceiveMessage.call(this, e, i, n);
    };
    e.prototype.setGameConfig = function(e, i, n, o, a, s) {
      t.prototype.setGameConfig.call(this, e, i, n, o, a, s);
      this.showHideInviteBtn();
    };
    e.prototype.showHideInviteBtn = function() {
      var e = this;
      if (r.default.getInstance().gameID == s.GAME.LIENG) {
        this.inviteBtns.forEach(function(t) {
          t.active = 9 === e.maxUser;
        });
        if (5 === this.maxUser) {
          this.POS5.forEach(function(t) {
            e.inviteBtns[t].active = true;
          });
        }
      } else {
        t.prototype.showHideInviteBtn.call(this);
      }
    };
    e.prototype.onJoinRoomPlaying = function(t, e) {
      this.updateViewPostions(true, true);
      if (!(this.state != s.GameState.WAITING)) {
        if (0 == this._thisPlayerView.isPlaying) {
          if (this._thisPlayerView.isHost) {
            this.cardGameTableController.readyBtn.active = false;
          } else {
            this.cardGameTableController.readyBtn.active = true;
            if (c.default.getInstance().autoReady) {
              this.sendReady();
            }
          }
        }
      }
    };
    e.prototype.init = function(t) {
      if (void 0 === t) {
        t = null;
      }
    };
    e.prototype.show = function() {
      this.node.active = true;
    };
    e.prototype.hide = function() {
      this.node.active = false;
      t.prototype.hide.call(this);
    };
    e.prototype.onReconnect = function(t) {
      this.isReconnect = true;
    };
    e.prototype.onBuyIn = function(t) {};
    e.prototype.dealCards = function(t, e) {
      for (var i = 0; i < this.players.length; i++) {
        this.players[i].iconnReady.active = false;
      }
      this._dangPhatBai = true;
      this.state = s.GameState.VIEWING;
      for (i = 0; i < this.playersPlaying.length; i++) {
        if (this.playersPlaying[i].userID == this._thisPlayerView.userID) {
          this.state = s.GameState.PLAYING;
          this._daNgoi = true;
        }
      }
      this.cardGameTableController.readyBtn.active = false;
      this.cardGameTableController.startBtn.active = false;
    };
    e.prototype.changeTurn = function(t, e) {};
    e.prototype.updatePlayerOnFinish = function() {
      this._dangPhatBai = false;
      for (var t = 0; t < this.players.length; t++) {
        var e = this.players[t];
        e.isReady = false;
        e.iconnReady.active = false;
        e.totalPhom = 0;
        e.removeBubbleFx();
        e.removeChat();
        if (null != e.playerStatusUI) {
          e.playerStatusUI.hide();
        }
      }
    };
    e.prototype.endGame = function(t, e) {
      this.updatePlayerOnFinish();
      this.state = s.GameState.WAITING;
      if (0 == this._thisPlayerView.isHost) {
        if (c.default.getInstance().autoReady) {
          this.sendReady();
        } else {
          this.cardGameTableController.readyBtn.active = true;
        }
      }
    };
    e.prototype.finishGame = function(t, e) {
      this.updatePlayerOnFinish();
      this.onEndGame();
    };
    e.prototype.onUserJoinRoom = function(t) {};
    e.prototype.onUserLeaveRoom = function(t) {};
    e.prototype.getNameGame = function() {
      return "";
    };
    e.prototype.getSpriteFrameName = function() {
      return null;
    };
    e.prototype.getListChatDefaultText = function() {
      return [];
    };
    e.prototype.getCmdStart = function() {
      return 0;
    };
    e.prototype.autoSendReady = function() {
      if (r.default.getInstance().gameID === s.GAME.LIENG || r.default.getInstance().gameID === s.GAME.PHOM) {
        t.prototype.autoSendReady.call(this);
      } else {
        if (!(this.isReconnect || this.isHost || this.state == s.GameState.VIEWING)) {
          if (this._daNgoi) {
            if (this.tuDongGuiSanSang || c.default.getInstance().autoReady) {
              this.sendReady();
            } else {
              if (null != this.cardGameTableController) {
                this.cardGameTableController.readyBtn.active = true;
              }
            }
          }
        }
      }
    };
    return e = o([h], e);
  }(a.default));
i.default = u;
void 0;
