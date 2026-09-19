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
  c = require("./GamePlayManager"),
  l = require("./StringUtil"),
  h = require("./GameCardSprite"),
  u = require("./BetLabel"),
  d = require("./PopBubbleUtil"),
  p = require("./GameZOrder"),
  f = require("./GameCardSpriteType"),
  g = require("./ActionProgressTo"),
  m = require("./GameDefine"),
  y = require("./CardGameCommonRequest"),
  S = require("./RemoteSprite"),
  _ = require("./PlayerStatusUI"),
  v = require("./MusicPlayer"),
  b = require("./MessageCardGameHandler"),
  C = require("./CommonPrefabsManager"),
  T = require("./GameConfigManager"),
  E = require("./GameUtils"),
  I = require("./GameController"),
  A = cc._decorator,
  P = A.ccclass,
  M = A.property;
(function(t) {
  t.INVITE = "INVITE";
  t.EMPTY = "EMPTY";
  t.SPECTATOR = "SPECTATOR";
  t.PLAYING = "PLAYING";
  t.IN_GAME = "IN_GAME";
})(r = i.EPlayerState || (i.EPlayerState = {}));
(function(t) {
  t[t.NONE = -1] = "NONE";
  t[t.FOLD = 1] = "FOLD";
  t[t.CALL = 2] = "CALL";
  t[t.CHECK = 3] = "CHECK";
  t[t.BET = 4] = "BET";
  t[t.ALL_IN = 5] = "ALL_IN";
  t[t.TURN = 6] = "TURN";
})(i.EPlayerStatus || (i.EPlayerStatus = {}));
var O = function(t) {
  function e() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.lbName = null;
    e.lbMoney = null;
    e.text = "hello";
    e.shakeDiskBets = [];
    e._currentBet = 0;
    e.shakeDiskCoins = [];
    e.positionIndex = 0;
    e.isPlaying = false;
    e.pos = cc.Vec2.ZERO;
    e.totalPhom = 0;
    e.tableBetUI = null;
    e.listCards = [];
    e.PositionUI = 0;
    e.listAnPhom = [];
    e.BigBlindIcon = null;
    e.smallBlindIcon = null;
    e.deadlerIcon = null;
    e.iconHost = null;
    e.iconQuit = null;
    e.iconnReady = null;
    e.cards = [];
    e.indexPos = 0;
    e.currentBetLb = null;
    e.kickButton = null;
    e.coins = [];
    e.bubbleFxPos = null;
    e.bubbleFxPrefab = null;
    e.bubbleFx = null;
    e.bubbleChat = null;
    e.bubbleSpecial = null;
    e.winEffectPrefab = null;
    e.winTextEffectPrefab = null;
    e.loseTextEffectPrefab = null;
    e.upbaiEffectPrefab = null;
    e.textResultPrefab = null;
    e.countDownProgressTo = null;
    e.chatIconView = null;
    e.nodePlayerAvatar = null;
    e.nodePlayerName = null;
    e.playerStatusUI = null;
    e.borderInfo = null;
    e.avarta = null;
    e.skeletonEffect = null;
    e.skeletonCountDown = null;
    e.listCardOnHandTL = [];
    e.iconDola = null;
    e.widthCutString = 125;
    e.mauBinhSoBai = false;
    e.binhLung = false;
    e.mauBinh = false;
    e.pointSapLang = 0;
    e.pointSapHam = 0;
    e.pointSoBinh = 0;
    e.totalPoint = 0;
    e.binhPoint = -1;
    e.soChiResult = [];
    e.playerModel = null;
    e.currentTotalPoint = 0;
    e.winEffectNode = null;
    e.textEffectNode = null;
    e.userDisplayName = "";
    e.isAnDanh = false;
    e.isShowAnimBonusMoney = false;
    e.cardsDaDanhRa = [];
    e.nodeMoneyFX = null;
    e.layerChatBubble = null;
    return e;
  }
  n(e, t);
  e.prototype.InitData = function(t) {
    this.userID = t.uid;
    this.lbName.string = t.dn;
    this.lbMoney.string = l.default.formatMoneyNumber(t.m);
    this.shakeDiskBets = [];
    for (var e = 0; e < 6; ++e) {
      this.shakeDiskBets.push(0);
    }
    this.processCutLongString();
  };
  e.prototype.processCutLongString = function() {
    return a(this, void 0, Promise, function() {
      return s(this, function(t) {
        switch (t.label) {
          case 0:
            return [4, E.delay(50)];
          case 1:
            return t.sent(), this.lbName.node.getContentSize().width > this.widthCutString && (this.lbName.string = this.lbName
              .string.substring(0, 10) + ".."), [2];
        }
      });
    });
  };
  e.prototype.addInfo = function(t, e, i, n, o, a, s, r, h, u, d, p, f) {
    if (void 0 === f) {
      f = false;
    }
    if (c.default.getInstance().gameID == m.GameID.BACAY) {
      this.reset();
    }
    this.userID = e;
    if (this.isMine()) {
      this.lbName.string = c.default.getInstance().displayName;
      this.lbMoney.string = l.default.formatMoneyNumber(n);
    } else {
      if (false === f) {
        this.lbName.string = t;
        this.lbMoney.string = l.default.formatMoneyNumber(n);
      }
      this.userDisplayName = t;
      this.isAnDanh = f;
    }
    this.processCutLongString();
    this.iconQuit.active = false;
    this.shakeDiskBets = [];
    this.isHost = i;
    this._money = n;
    this.moneyUIDangShow = n;
    this.state = o;
    this.remainingCards = a;
    this.sit = s;
    this.isReady = r;
    if (void 0 != d.rM) {
      this._realMoney = d.rM;
    }
    for (var g = 0; g < 6; ++g) {
      this.shakeDiskBets.push(0);
    }
    if (null !== this.iconHost && void 0 !== this.iconHost) {
      this.iconHost.active = this.isHost;
    }
    if (l.default.isNullOrEmpty(p)) {
      p = "Avatar0";
    }
    if (null !== this.avarta && void 0 !== this.avarta) {
      if (this.isMine()) {
        if (c.default.getInstance().avaURL.includes("-")) {
          c.default.getInstance().avaURL = E.transformAvatarString(c.default.getInstance().avaURL);
        }
        this.avatarUrl = c.default.getInstance().avaURL;
        if (0 == this.avatarUrl.includes("Avatar") || this.avatarUrl.includes("NaN")) {
          this.avatarUrl = "Avatar0";
        }
        this.avarta.loadImage(this.avatarUrl);
      } else {
        if (p.includes("-")) {
          p = E.transformAvatarString(p);
        }
        this.avatarUrl = p;
        if (0 == this.avatarUrl.includes("Avatar") || this.avatarUrl.includes("NaN")) {
          this.avatarUrl = "Avatar" + Math.floor(l.default.getRandomInt(59));
        }
        if (false === f) {
          this.avarta.loadImage(this.avatarUrl);
        }
      }
    }
  };
  e.prototype.showAnDanhWhenDone = function() {
    if (this.isAnDanh) {
      this.lbName.string = this.userDisplayName;
      this.lbMoney.string = l.default.formatMoneyNumber(this._money);
      this.moneyUIDangShow = this._money;
      this.isAnDanh = false;
      this.processCutLongString();
    }
    if (null !== this.avarta && void 0 !== this.avarta) {
      this.avarta.loadImage(this.avatarUrl);
    }
  };
  e.prototype.isMine = function() {
    return void 0 != this.userID && null != this.userID && 0 == this.userID.localeCompare(c.default.getInstance().userID);
  };
  e.prototype.setMoney = function(t) {
    if (false === this.isAnDanh) {
      this.lbMoney.string = l.default.formatMoneyNumber(t);
    }
    this._money = t;
    this.moneyUIDangShow = this._money;
    if (null != this.playerModel) {
      this.playerModel.BuyIn = t;
    }
  };
  e.prototype.stopCountDown = function() {
    if (null !== this.countDownProgressTo && void 0 !== this.countDownProgressTo) {
      this.countDownProgressTo.isRuning = false;
      this.countDownProgressTo.setProgress(0);
      this.skeletonCountDown.node.active = false;
    }
  };
  e.prototype.startCountDown = function(t, e, i) {
    if (void 0 === e) {
      e = 0;
    }
    if (void 0 === i) {
      i = true;
    }
    this.countDownProgressTo.setProgress(1 - e);
    this.countDownProgressTo.RunActionProgress(t, 0);
    try {
      this.skeletonCountDown.node.active = true;
      var n = t;
      if (e > 0 && e < 1) {
        n = t * (1 / (1 - e));
      }
      this.skeletonCountDown.clearTrack(0);
      var o = this.skeletonCountDown.setAnimation(0, "DemNguoc10s", false);
      this.skeletonCountDown.timeScale = o.animationEnd / n;
      o.trackTime = o.animationEnd * e;
    } catch (t) {}
  };
  e.prototype.stopViewAction = function() {
    if (null !== this.chatIconView && void 0 !== this.chatIconView) {
      this.chatIconView.active = false;
    }
  };
  e.prototype.runViewAction = function() {
    if (null !== this.chatIconView && void 0 !== this.chatIconView) {
      this.chatIconView.active = true;
    }
  };
  e.prototype.start = function() {};
  e.prototype.showChat = function(t, e) {
    var i = this;
    if (void 0 === e && (e = true), null === this.bubbleChat || void 0 === this.bubbleChat) {
      var n = cc.instantiate(this.bubbleFxPrefab);
      n.parent = this.layerChatBubble ? this.layerChatBubble : this.node.parent;
      n.zIndex = p.default.CHAT_BUBLES;
      this.bubbleChat = n.getComponent(d.default);
    } else {
      this.bubbleChat.stopAllActions();
    }
    var o = this.node.position.y + (40 + this.bubbleFxPos.position.y) * this.node.scale;
    if (o > 320) {
      o = 320;
    }
    var a = this.node.position.y + (20 + this.bubbleFxPos.position.y) * this.node.scale;
    if (a > 320) {
      a = 320;
    }
    this.bubbleChat.node.position = new cc.Vec2(this.node.position.x + this.bubbleFxPos.position.x * this.node.scale, o);
    this.bubbleChat.initPos(new cc.Vec2(this.node.position.x + this.bubbleFxPos.position.x * this.node.scale, o), new cc.Vec2(this.node
      .position.x - this.bubbleFxPos.position.x * this.node.scale, a));
    if (c.default.getInstance().gameID === b.GAME.BACAY && this.isMine()) {
      this.bubbleChat.showBubbleReverse(true);
    } else {
      this.bubbleChat.showBubbleReverse(this.node.position.x > 200);
    }
    this.bubbleChat.label.string = t;
    this.bubbleChat.node.active = true;
    this.bubbleChat.node.opacity = 255;
    this.bubbleChat.node.scale = .1;
    this.bubbleChat.popOut();
    if (e) {
      this.bubbleChat.node.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(function() {
        i.bubbleChat.popIn();
      })));
    }
  };
  e.prototype.removeBubbleFx = function(t, e) {
    if (void 0 === t) {
      t = false;
    }
    if (void 0 === e) {
      e = -1;
    }
    if (null !== this.bubbleFx && void 0 !== this.bubbleFx) {
      this.bubbleFx.node.stopAllActions();
      this.bubbleFx._isPopping = false;
      if (t) {
        this.bubbleFx.node.active = false;
      } else {
        this.bubbleFx.popIn();
      }
    }
  };
  e.prototype.showBubbleFx = function(t, e, i, n, o) {
    if (void 0 === o && (o = void 0), null === this.bubbleFx || void 0 === this.bubbleFx) {
      var a = cc.instantiate(this.bubbleFxPrefab);
      a.parent = this.node.parent;
      a.zIndex = p.default.CHAT_BUBLES;
      this.bubbleFx = a.getComponent(d.default);
    } else {
      this.bubbleFx.node.stopAllActions();
      this.bubbleFx._isPopping = false;
    }
    var s = this.node.position.y + (40 + this.bubbleFxPos.position.y) * this.node.scale;
    if (s > 320) {
      s = 320;
    }
    var r = s;
    this.bubbleFx.node.position = new cc.Vec2(this.node.position.x + this.bubbleFxPos.position.x, s);
    this.bubbleFx.initPos(new cc.Vec2(this.node.position.x + this.bubbleFxPos.position.x, s), new cc.Vec2(this.node.position.x - this
      .bubbleFxPos.position.x, r));
    this.bubbleFx.label.string = t;
    this.bubbleFx.node.active = true;
    this.bubbleFx.node.opacity = 255;
    this.bubbleFx.showBubbleReverse(n);
    if (c.default.getInstance().gameID === b.GAME.XITO) {
      this.bubbleFx.showBubbleReverse(this.node.position.x < 200);
    }
    if (i) {
      this.bubbleFx.node.scale = .1;
      this.bubbleFx.popOut();
    } else {
      this.bubbleFx.node.scale = 1;
    }
    if (void 0 != o) {
      this.bubbleFx.finishPoppingOutCallBack = o;
    }
  };
  e.prototype.removeBubbleSpecialFx = function(t, e) {
    if (void 0 === t) {
      t = false;
    }
    if (void 0 === e) {
      e = -1;
    }
    if (null !== this.bubbleSpecial && void 0 !== this.bubbleSpecial) {
      this.bubbleSpecial.node.stopAllActions();
      this.bubbleSpecial._isPopping = false;
      if (t) {
        this.bubbleSpecial.node.active = false;
      } else {
        this.bubbleSpecial.popIn();
      }
    }
  };
  e.prototype.showBubbleSpecialFx = function(t, e, i, n, o) {
    if (void 0 === o && (o = void 0), null === this.bubbleSpecial || void 0 === this.bubbleSpecial) {
      var a = cc.instantiate(this.bubbleFxPrefab);
      a.parent = this.node.parent;
      a.zIndex = p.default.CHAT_BUBLES;
      this.bubbleSpecial = a.getComponent(d.default);
    } else {
      this.bubbleSpecial.node.stopAllActions();
      this.bubbleSpecial._isPopping = false;
    }
    this.bubbleSpecial.node.position = new cc.Vec2(this.node.position.x + this.bubbleFxPos.position.x, this.node.position.y + this
      .bubbleFxPos.position.y);
    this.bubbleSpecial.initPos(new cc.Vec2(this.node.position.x + this.bubbleFxPos.position.x, this.node.position.y + (this.bubbleFxPos
      .position.y - 40)), new cc.Vec2(this.node.position.x - this.bubbleFxPos.position.x, this.node.position.y + (this.bubbleFxPos
      .position.y - 40)));
    if (t == this.bubbleSpecial.label.string) {
      i = false;
    }
    this.bubbleSpecial.label.string = t;
    this.bubbleSpecial.node.active = true;
    this.bubbleSpecial.node.opacity = 255;
    this.bubbleSpecial.showBubbleReverse(n);
    if (i) {
      this.bubbleSpecial.node.scale = .1;
      this.bubbleSpecial.popOut();
    } else {
      this.bubbleSpecial.node.scale = 1;
    }
    if (void 0 != o) {
      this.bubbleSpecial.finishPoppingOutCallBack = o;
    }
  };
  e.prototype.getBubbleFx = function() {
    return null;
  };
  e.prototype.runWinAction = function(t, e) {
    if (void 0 === e) {
      e = void 0;
    }
    var i = cc.instantiate(this.winEffectPrefab);
    i.parent = this.node.parent;
    i.position = this.node.position;
    i.zIndex = -1;
    if (null != this.winEffectNode && void 0 != this.winEffectNode) {
      this.winEffectNode.active = true;
    }
    this.winEffectNode = i;
    i.runAction(cc.sequence(cc.delayTime(t), cc.callFunc(function() {
      if (i && i.isValid) {
        i.removeFromParent(true);
      }
      if (void 0 != e) {
        e();
      }
    })));
  };
  e.prototype.showBonusMoneyFxForPlayer = function(t, e, i, n) {
    if (void 0 === n && (n = 25), 0 != t && !this.isShowAnimBonusMoney) {
      this.isShowAnimBonusMoney = true;
      var o = cc.instantiate(this.loseTextEffectPrefab);
      o.parent = this.node.parent;
      o.zIndex = p.default.TOP;
      var a = this.node.scale;
      o.position = new cc.Vec2(this.node.position.x, this.node.position.y - n * a);
      if (null != this.textEffectNode && void 0 != this.textEffectNode) {
        this.textEffectNode.active = true;
      }
      this.textEffectNode = o;
      o.getComponent(u.default).setNumberWithPrefix(t, false, "+");
      o.scaleX = 0;
      o.runAction(cc.sequence(cc.delayTime(i), cc.scaleTo(.2, a), cc.moveBy(.3, new cc.Vec2(0, n * a * 2)), cc.delayTime(e - 1), cc
        .fadeOut(.5), cc.callFunc(function() {
          o.removeFromParent(true);
        })));
    }
  };
  e.prototype.showMoneyFxForPlayer = function(t, e, i) {
    if (void 0 === i && (i = 25), 0 != t) {
      var n = cc.instantiate(t > 0 ? this.winTextEffectPrefab : this.loseTextEffectPrefab);
      n.parent = this.node.parent;
      n.zIndex = p.default.TOP;
      var o = this.node.scale;
      n.position = new cc.Vec2(this.node.position.x, this.node.position.y - i * o);
      if (null != this.textEffectNode && void 0 != this.textEffectNode) {
        this.textEffectNode.active = true;
      }
      this.textEffectNode = n;
      n.getComponent(u.default).setNumber(t, false);
      n.scaleX = .2 * o;
      n.runAction(cc.sequence(cc.scaleTo(.2, o), cc.moveBy(.3, new cc.Vec2(0, i * o * 2)), cc.delayTime(e - 1), cc.fadeOut(.5), cc
        .callFunc(function() {
          if (n && n.isValid) {
            n.removeFromParent(true);
          }
        })));
      this.nodeMoneyFX = n;
    }
  };
  e.prototype.showUpBaiFxForPlayer = function(t, e) {
    if (void 0 === e) {
      e = 25;
    }
    var i = cc.instantiate(this.upbaiEffectPrefab);
    i.parent = this.node.parent;
    i.zIndex = p.default.TOP;
    var n = this.node.scale;
    i.position = new cc.Vec2(this.node.position.x, this.node.position.y - e * n);
    this.textEffectNode = i;
    i.scaleX = .2 * n;
    i.runAction(cc.scaleTo(.2, 1 * n));
    i.runAction(cc.sequence(cc.delayTime(.2), cc.moveBy(.3, new cc.Vec2(0, e * n * 1.8)), cc.delayTime(t - 1), cc.fadeOut(.5), cc
      .callFunc(function() {
        i.removeFromParent(true);
      })));
  };
  e.prototype.showTextFxResultForPlayer = function(t, e, i) {
    if (void 0 === i && (i = -35), null !== t && void 0 !== t) {
      var n = cc.instantiate(this.textResultPrefab);
      n.parent = this.node;
      n.scale = .7;
      n.position = new cc.Vec2(0, i);
      n.getComponent(cc.Sprite).spriteFrame = t;
      n.runAction(cc.sequence(cc.scaleTo(.2, 1), cc.delayTime(e - .2 - .2), cc.fadeOut(.2), cc.callFunc(function() {
        n.removeFromParent(true);
      })));
    }
  };
  e.prototype.runToPos = function(t, e) {
    if (void 0 === e && (e = false), this.node.position.x === I.posOutScreen.x && this.node.position.y === I.posOutScreen.y && (this.pos
        .x <= 0 && this.pos.y <= 0 ? this.node.position = new cc.Vec2(-t.width / 2, -t.height / 2) : this.pos.x <= 0 && this.pos.y >=
        0 ? this.node.position = new cc.Vec2(-t.width / 2, t.height / 2) : this.pos.x >= 0 && this.pos.y <= 0 ? this.node.position =
        new cc.Vec2(t.width / 2, -t.height / 2) : this.pos.x >= 0 && this.pos.y >= 0 && (this.node.position = new cc.Vec2(t.width / 2, t
          .height / 2))), this.node.stopAllActions(), e) {
      this.node.position = this.pos;
    } else {
      var i = cc.moveTo(.3, this.pos);
      this.node.stopAllActions();
      this.node.runAction(i);
    }
  };
  e.prototype.checkInThisArray = function(t) {
    for (var e = 0; e < t.length; ++e) {
      if (0 === this.userID.localeCompare(t[e].userID)) {
        return true;
      }
    }
    return false;
  };
  e.prototype.removeChat = function() {
    if (null !== this.bubbleChat && void 0 !== this.bubbleChat) {
      this.bubbleChat.node.stopAllActions();
      this.bubbleChat.node.removeFromParent(true);
      this.bubbleChat = null;
    }
  };
  e.prototype.createNewCard = function(t) {
    var e = cc.instantiate(t);
    e.parent = this.node.parent;
    e.position = new cc.Vec2(0, 0);
    e.zIndex = p.default.MIDDLE + this.cards.length;
    var i = e.getComponent(h.default);
    i.init(f.default.TypeHIDE);
    this.cards.push(i);
    e.active = false;
    return i;
  };
  e.prototype.initPokerCard = function(t) {
    for (var e = this.cards.length; e < 2; ++e) {
      this.createNewCard(t);
    }
  };
  e.prototype.initMauBinhCard = function(t) {
    for (var e = this.cards.length, i = this.isMine(), n = e; n < 13; ++n) {
      this.createNewCard(t).node.zIndex = i ? p.default.MIDDLE_TOP_2 + 1 + n : 15 - n;
    }
  };
  e.prototype.initCatteCard = function(t) {
    for (var e = this.cards.length, i = this.isMine(), n = e; n < 6; ++n) {
      this.createNewCard(t).node.zIndex = i ? p.default.MIDDLE_TOP_2 + 1 + n : 15 - n;
    }
  };
  e.prototype.iniBaCayCard = function(t) {
    for (var e = this.cards.length, i = this.isMine(), n = e; n < 3; ++n) {
      this.createNewCard(t).node.zIndex = i ? p.default.MIDDLE_TOP_2 + 1 + n : 15 - n;
    }
  };
  e.prototype.hideAllCard = function(t) {
    if (void 0 === t) {
      t = false;
    }
    for (var e = 0; e < this.cards.length; ++e) {
      var i = this.cards[e];
      i.node.stopAllActions();
      i.init(f.default.TypeHIDE);
      i.setColor(cc.Color.WHITE);
      i.node.position = new cc.Vec2(0, 0);
      i.node.active = t;
      i.node.opacity = 255;
    }
  };
  e.prototype.setArrayCard = function(t, e) {
    if (void 0 === e) {
      e = true;
    }
    for (var i = 0; i < t.length; ++i) {
      var n = this.cards[i],
        o = t[i];
      if (e) {
        n.setTextureWithCode(o, c.default.getInstance().gameID);
      }
    }
  };
  e.prototype.resetDefaultValueForMauBinh = function() {
    this.mauBinhSoBai = false;
    this.binhLung = false;
    this.mauBinh = false;
    this.pointSapLang = 0;
    this.pointSapHam = 0;
    this.pointSoBinh = 0;
    this.totalPoint = 0;
    this.binhPoint = -1;
    this.soChiResult = [];
  };
  e.prototype.initXiToCard = function(t) {
    var e = this.cards.length;
    if (e < 5) {
      for (var i = e; i < 5; ++i) {
        var n = cc.instantiate(t);
        n.parent = this.node.parent;
        n.position = new cc.Vec2(0, 0);
        var o = n.getComponent(h.default);
        o.init(f.default.TypeHIDE);
        this.cards.push(o);
        n.active = false;
      }
    }
  };
  e.prototype.hideXiToCard = function(t) {
    if (void 0 === t) {
      t = false;
    }
    for (var e = 0; e < 2; ++e) {
      var i = this.cards[e];
      i.node.stopAllActions();
      i.init(f.default.TypeHIDE);
      i.node.position = new cc.Vec2(0, 0);
      i.node.active = t;
    }
  };
  e.prototype.setState = function(t) {
    switch (this.node.active = true, this.nodePlayerAvatar.active = true, this.nodePlayerName.active = true, t) {
      case r.EMPTY:
        this.node.active = false;
        break;
      case r.INVITE:
        this.nodePlayerAvatar.active = false;
        this.nodePlayerName.active = false;
        break;
      case r.IN_GAME:
      case r.PLAYING:
      case r.SPECTATOR:
    }
  };
  e.prototype.moveToPosision = function(t) {
    var e = this.node.parent.convertToWorldSpaceAR(this.node.position);
    this.node.parent = t;
    this.node.position = t.convertToNodeSpaceAR(e);
    this.node.runAction(cc.moveTo(.3, cc.Vec2.ZERO));
  };
  e.prototype.setPhomStatus = function(t) {
    var e = false;
    switch (1 != this.indexPos && 3 != this.indexPos || (e = true), t) {
      case m.EPhomPlayerStatus.MOM:
        this.showBubbleFx("M\xf3m", 0, true, e);
        break;
      case m.EPhomPlayerStatus.U:
        this.showBubbleFx("\xd9", 0, true, e);
        break;
      case m.EPhomPlayerStatus.AN_CHOT:
        this.showBubbleFx("\u0102n Ch\u1ed1t", 0, true, e);
        break;
      default:
      case m.EPhomPlayerStatus.NONE:
        return void this.removeBubbleFx();
    }
  };
  e.prototype.setLiengStatus = function(t) {
    if (this.indexPos < 5 && this.indexPos >= 0) {
      this.playerStatusUI.node.x = -100;
      this.playerStatusUI.flipBackground(true);
    } else {
      this.playerStatusUI.node.x = 100;
      this.playerStatusUI.flipBackground(false);
    }
    this.playerStatusUI.node.y = 70;
    this.playerStatusUI.setLiengStatus(t);
    if (t == m.ELiengPlayState.FOLD) {
      this.showUpBaiFxForPlayer(3);
    }
  };
  e.prototype.setBaCayStatus = function(t) {};
  e.prototype.setModel = function(t, e) {
    if (void 0 === e) {
      e = true;
    }
    this.playerModel = t;
    if (e) {
      if (t.IsPlaying) {
        this.setState(r.IN_GAME);
      } else {
        this.setState(r.SPECTATOR);
      }
    }
    this.lbName.string = t.DisplayName;
    this.processCutLongString();
    this.setMoney(t.BuyIn);
    if (t.IsRoomMaster) {
      this.iconHost.active = true;
    } else {
      this.iconHost.active = false;
    }
  };
  e.prototype.reset = function() {
    if (null != this.tableBetUI) {
      this.tableBetUI.hide();
    }
    if (null != this.playerModel) {
      this.playerModel.TotalPhom = 0;
    }
    if (null !== this.playerStatusUI && void 0 !== this.playerStatusUI) {
      this.playerStatusUI.node.active = false;
    }
    this.stopCountDown();
    if (null != this.winEffectNode && void 0 != this.winEffectNode) {
      this.winEffectNode.active = false;
      this.winEffectNode.removeFromParent(true);
    }
    if (null !== this.textEffectNode && void 0 !== this.textEffectNode) {
      this.textEffectNode.active = false;
      this.textEffectNode.removeFromParent(true);
    }
  };
  e.prototype.setTableBetUI = function(t, e) {
    if (void 0 === e && (e = null), void 0 != t && null != t) {
      if (this.tableBetUI = t, null == e) {
        var i = this.node.parent.convertToWorldSpaceAR(this.node.getPosition()),
          n = this.tableBetUI.node.convertToNodeSpaceAR(i);
        this.tableBetUI.setFromPosition(n);
      } else {
        this.tableBetUI.setFromPosition(e);
      }
    }
  };
  e.prototype.showUserInfo = function() {
    this.borderInfo.active = false;
  };
  e.prototype.kickUser = function() {
    this.borderInfo.active = false;
  };
  e.prototype._kickUser = function() {
    y.default.getInstance().sendKickUser(this.userID);
  };
  e.prototype.destroyMe = function() {
    if (null !== this.bubbleFx && void 0 !== this.bubbleFx) {
      this.bubbleFx.node.removeFromParent(true);
    }
    if (null !== this.bubbleSpecial && void 0 !== this.bubbleSpecial) {
      this.bubbleSpecial.node.removeFromParent(true);
    }
    if (null !== this.bubbleChat && void 0 !== this.bubbleChat) {
      this.bubbleChat.node.removeFromParent(true);
    }
    this.cards.forEach(function(t) {
      t.node.removeFromParent(true);
    });
    if (null !== this.winEffectNode && void 0 !== this.winEffectNode) {
      this.winEffectNode.active = false;
      this.winEffectNode.removeFromParent(true);
    }
    if (null !== this.textEffectNode && void 0 !== this.textEffectNode) {
      this.textEffectNode.active = false;
      this.textEffectNode.removeFromParent(true);
    }
    this.removeChat();
    this.node.removeFromParent(true);
  };
  e.prototype.hideAlllistCardOnHandTL = function() {
    for (var t = 0; t < this.listCardOnHandTL.length; t++) {
      if (null != this.listCardOnHandTL[t] && null != this.listCardOnHandTL[t].node) {
        this.listCardOnHandTL[t].node.active = false;
      }
    }
    this.listCardOnHandTL = [];
  };
  e.prototype.showPopupUserTableInfo = function() {
    if (v.default.getInstance().playbtnClick(), this.isAnDanh) {
      C.default.getInstance().showPopupMessageUtil("Ng\u01b0\u1eddi Ch\u01a1i \u1ea8n Danh");
    } else if (!T.default.getInstance().isLoginWebcc || !this.isMine()) {
      var t = this.moneyUIDangShow;
      if (!(c.default.getInstance().gameID != m.GameID.LIENG && c.default.getInstance().gameID != m.GameID.POKER && c.default
          .getInstance().gameID != m.GameID.XITO)) {
        t = this._realMoney;
      }
      C.default.getInstance().showPopupUserTableInfo(this.lbName.string, t, this.avatarUrl, this.isMine());
    }
  };
  e.prototype.setPlayerViewBauCua = function() {
    var t = this.nodePlayerName.getComponent(cc.Sprite);
    if (null !== t && void 0 !== t) {
      t.enabled = false;
    }
    this.lbName.fontSize = 32;
    this.lbName.node.x = 237;
    this.lbName.node.y = 96;
    this.lbMoney.fontSize = 26;
    this.lbMoney.node.parent.x = 237;
    this.lbMoney.node.parent.y = 42;
    this.iconDola.scale = 1.5;
    this.iconDola.y = -7;
    this.iconQuit.x = 130;
    this.iconQuit.y = -50;
  };
  e.prototype.getCardOfMine = function(t, e) {
    if (void 0 === e) {
      e = null;
    }
    for (var i = 0; i < this.cards.length; ++i) {
      var n = this.cards[i];
      if (n.serverCode === t) {
        return n;
      }
    }
    return e;
  };
  e.prototype.blockAllCardTouch = function() {
    for (var t = 0; t < this.cards.length; ++t) {
      this.cards[t].setClickEnabled(false, false, null);
    }
  };
  e.prototype.onDisable = function() {
    if (this.nodeMoneyFX && this.nodeMoneyFX.isValid) {
      this.nodeMoneyFX.stopAllActions();
      this.nodeMoneyFX.destroy();
    }
    if (this.winEffectNode && this.winEffectNode.isValid) {
      this.winEffectNode.stopAllActions();
      this.winEffectNode.destroy();
    }
  };
  e.prototype.setChatLayer = function(t) {
    this.layerChatBubble = t;
  };
  o([M(cc.Label)], e.prototype, "lbName", void 0);
  o([M(cc.Label)], e.prototype, "lbMoney", void 0);
  o([M], e.prototype, "text", void 0);
  o([M(cc.Node)], e.prototype, "BigBlindIcon", void 0);
  o([M(cc.Node)], e.prototype, "smallBlindIcon", void 0);
  o([M(cc.Node)], e.prototype, "deadlerIcon", void 0);
  o([M(cc.Node)], e.prototype, "iconHost", void 0);
  o([M(cc.Node)], e.prototype, "iconQuit", void 0);
  o([M(cc.Node)], e.prototype, "iconnReady", void 0);
  o([M(cc.Node)], e.prototype, "kickButton", void 0);
  o([M([cc.Node])], e.prototype, "coins", void 0);
  o([M(cc.Node)], e.prototype, "bubbleFxPos", void 0);
  o([M(cc.Prefab)], e.prototype, "bubbleFxPrefab", void 0);
  o([M(cc.Prefab)], e.prototype, "winEffectPrefab", void 0);
  o([M(cc.Prefab)], e.prototype, "winTextEffectPrefab", void 0);
  o([M(cc.Prefab)], e.prototype, "loseTextEffectPrefab", void 0);
  o([M(cc.Prefab)], e.prototype, "upbaiEffectPrefab", void 0);
  o([M(cc.Prefab)], e.prototype, "textResultPrefab", void 0);
  o([M(g.default)], e.prototype, "countDownProgressTo", void 0);
  o([M(cc.Node)], e.prototype, "chatIconView", void 0);
  o([M(cc.Node)], e.prototype, "nodePlayerAvatar", void 0);
  o([M(cc.Node)], e.prototype, "nodePlayerName", void 0);
  o([M(_.default)], e.prototype, "playerStatusUI", void 0);
  o([M(cc.Node)], e.prototype, "borderInfo", void 0);
  o([M(S.default)], e.prototype, "avarta", void 0);
  o([M(sp.Skeleton)], e.prototype, "skeletonEffect", void 0);
  o([M(sp.Skeleton)], e.prototype, "skeletonCountDown", void 0);
  o([M(cc.Node)], e.prototype, "iconDola", void 0);
  o([M], e.prototype, "widthCutString", void 0);
  return e = o([P], e);
}(cc.Component);
i.default = O;
void 0;
