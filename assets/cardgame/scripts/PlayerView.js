var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
var __extends = this && this.__extends || function() {
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
  __decorate = this && this.__decorate || function(t, e, i, n) {
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
  __awaiter = this && this.__awaiter || function(t, e, i, n) {
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
  __generator = this && this.__generator || function(t, e) {
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
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});
var EPlayerState,
  GamePlayManager = require("./GamePlayManager"),
  StringUtil = require("./StringUtil"),
  GameCardSprite = require("./GameCardSprite"),
  BetLabel = require("./BetLabel"),
  PopBubbleUtil = require("./PopBubbleUtil"),
  GameZOrder = require("./GameZOrder"),
  GameCardSpriteType = require("./GameCardSpriteType"),
  ActionProgressTo = require("./ActionProgressTo"),
  GameDefine = require("./GameDefine"),
  CardGameCommonRequest = require("./CardGameCommonRequest"),
  RemoteSprite = require("./RemoteSprite"),
  PlayerStatusUI = require("./PlayerStatusUI"),
  MusicPlayer = require("./MusicPlayer"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  GameConfigManager = require("./GameConfigManager"),
  GameUtils = require("./GameUtils"),
  GameController = require("./GameController"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property;
(function(EPlayerState) {
  EPlayerState.INVITE = "INVITE";
  EPlayerState.EMPTY = "EMPTY";
  EPlayerState.SPECTATOR = "SPECTATOR";
  EPlayerState.PLAYING = "PLAYING";
  EPlayerState.IN_GAME = "IN_GAME";
})(EPlayerState = moduleExports.EPlayerState || (moduleExports.EPlayerState = {}));
(function(EPlayerStatus) {
  EPlayerStatus[EPlayerStatus.NONE = -1] = "NONE";
  EPlayerStatus[EPlayerStatus.FOLD = 1] = "FOLD";
  EPlayerStatus[EPlayerStatus.CALL = 2] = "CALL";
  EPlayerStatus[EPlayerStatus.CHECK = 3] = "CHECK";
  EPlayerStatus[EPlayerStatus.BET = 4] = "BET";
  EPlayerStatus[EPlayerStatus.ALL_IN = 5] = "ALL_IN";
  EPlayerStatus[EPlayerStatus.TURN = 6] = "TURN";
})(moduleExports.EPlayerStatus || (moduleExports.EPlayerStatus = {}));
var PlayerView = function(_super) {
  function PlayerView() {
    var _this = null !== _super && _super.apply(this, arguments) || this;
    _this.lbName = null;
    _this.lbMoney = null;
    _this.text = "hello";
    _this.shakeDiskBets = [];
    _this._currentBet = 0;
    _this.shakeDiskCoins = [];
    _this.positionIndex = 0;
    _this.isPlaying = false;
    _this.pos = cc.Vec2.ZERO;
    _this.totalPhom = 0;
    _this.tableBetUI = null;
    _this.listCards = [];
    _this.PositionUI = 0;
    _this.listAnPhom = [];
    _this.BigBlindIcon = null;
    _this.smallBlindIcon = null;
    _this.deadlerIcon = null;
    _this.iconHost = null;
    _this.iconQuit = null;
    _this.iconnReady = null;
    _this.cards = [];
    _this.indexPos = 0;
    _this.currentBetLb = null;
    _this.kickButton = null;
    _this.coins = [];
    _this.bubbleFxPos = null;
    _this.bubbleFxPrefab = null;
    _this.bubbleFx = null;
    _this.bubbleChat = null;
    _this.bubbleSpecial = null;
    _this.winEffectPrefab = null;
    _this.winTextEffectPrefab = null;
    _this.loseTextEffectPrefab = null;
    _this.upbaiEffectPrefab = null;
    _this.textResultPrefab = null;
    _this.countDownProgressTo = null;
    _this.chatIconView = null;
    _this.nodePlayerAvatar = null;
    _this.nodePlayerName = null;
    _this.playerStatusUI = null;
    _this.borderInfo = null;
    _this.avarta = null;
    _this.skeletonEffect = null;
    _this.skeletonCountDown = null;
    _this.listCardOnHandTL = [];
    _this.iconDola = null;
    _this.widthCutString = 125;
    _this.mauBinhSoBai = false;
    _this.binhLung = false;
    _this.mauBinh = false;
    _this.pointSapLang = 0;
    _this.pointSapHam = 0;
    _this.pointSoBinh = 0;
    _this.totalPoint = 0;
    _this.binhPoint = -1;
    _this.soChiResult = [];
    _this.playerModel = null;
    _this.currentTotalPoint = 0;
    _this.winEffectNode = null;
    _this.textEffectNode = null;
    _this.userDisplayName = "";
    _this.isAnDanh = false;
    _this.isShowAnimBonusMoney = false;
    _this.cardsDaDanhRa = [];
    _this.nodeMoneyFX = null;
    _this.layerChatBubble = null;
    return _this;
  }
  __extends(PlayerView, _super);
  PlayerView.prototype.InitData = function(playerInfo) {
    this.userID = playerInfo.uid;
    this.lbName.string = playerInfo.dn;
    this.lbMoney.string = StringUtil.default.formatMoneyNumber(playerInfo.m);
    this.shakeDiskBets = [];
    for (var betIndex = 0; betIndex < 6; ++betIndex) {
      this.shakeDiskBets.push(0);
    }
    this.processCutLongString();
  };
  PlayerView.prototype.processCutLongString = function() {
    return __awaiter(this, void 0, Promise, function() {
      return __generator(this, function(generatorState) {
        switch (generatorState.label) {
          case 0:
            return [4, GameUtils.delay(50)];
          case 1:
            return generatorState.sent(), this.lbName.node.getContentSize().width > this.widthCutString && (this.lbName.string = this.lbName
              .string.substring(0, 10) + ".."), [2];
        }
      });
    });
  };
  PlayerView.prototype.addInfo = function(displayName, userId, isHost, money, playerState, remainingCards, seatIndex, isReady, pid, accountId, assets, avatar, isAnonymous) {
    if (void 0 === isAnonymous) {
      isAnonymous = false;
    }
    if (GamePlayManager.default.getInstance().gameID == GameDefine.GameID.BACAY) {
      this.reset();
    }
    this.userID = userId;
    if (this.isMine()) {
      this.lbName.string = GamePlayManager.default.getInstance().displayName;
      this.lbMoney.string = StringUtil.default.formatMoneyNumber(money);
    } else {
      if (false === isAnonymous) {
        this.lbName.string = displayName;
        this.lbMoney.string = StringUtil.default.formatMoneyNumber(money);
      }
      this.userDisplayName = displayName;
      this.isAnDanh = isAnonymous;
    }
    this.processCutLongString();
    this.iconQuit.active = false;
    this.shakeDiskBets = [];
    this.isHost = isHost;
    this._money = money;
    this.moneyUIDangShow = money;
    this.state = playerState;
    this.remainingCards = remainingCards;
    this.sit = seatIndex;
    this.isReady = isReady;
    if (void 0 != assets.rM) {
      this._realMoney = assets.rM;
    }
    for (var betIndex = 0; betIndex < 6; ++betIndex) {
      this.shakeDiskBets.push(0);
    }
    if (null !== this.iconHost && void 0 !== this.iconHost) {
      this.iconHost.active = this.isHost;
    }
    if (StringUtil.default.isNullOrEmpty(avatar)) {
      avatar = "Avatar0";
    }
    if (null !== this.avarta && void 0 !== this.avarta) {
      if (this.isMine()) {
        if (GamePlayManager.default.getInstance().avaURL.includes("-")) {
          GamePlayManager.default.getInstance().avaURL = GameUtils.transformAvatarString(GamePlayManager.default.getInstance().avaURL);
        }
        this.avatarUrl = GamePlayManager.default.getInstance().avaURL;
        if (0 == this.avatarUrl.includes("Avatar") || this.avatarUrl.includes("NaN")) {
          this.avatarUrl = "Avatar0";
        }
        this.avarta.loadImage(this.avatarUrl);
      } else {
        if (avatar.includes("-")) {
          avatar = GameUtils.transformAvatarString(avatar);
        }
        this.avatarUrl = avatar;
        if (0 == this.avatarUrl.includes("Avatar") || this.avatarUrl.includes("NaN")) {
          this.avatarUrl = "Avatar" + Math.floor(StringUtil.default.getRandomInt(59));
        }
        if (false === isAnonymous) {
          this.avarta.loadImage(this.avatarUrl);
        }
      }
    }
  };
  PlayerView.prototype.showAnDanhWhenDone = function() {
    if (this.isAnDanh) {
      this.lbName.string = this.userDisplayName;
      this.lbMoney.string = StringUtil.default.formatMoneyNumber(this._money);
      this.moneyUIDangShow = this._money;
      this.isAnDanh = false;
      this.processCutLongString();
    }
    if (null !== this.avarta && void 0 !== this.avarta) {
      this.avarta.loadImage(this.avatarUrl);
    }
  };
  PlayerView.prototype.isMine = function() {
    return void 0 != this.userID && null != this.userID && 0 == this.userID.localeCompare(GamePlayManager.default.getInstance().userID);
  };
  PlayerView.prototype.setMoney = function(money) {
    if (false === this.isAnDanh) {
      this.lbMoney.string = StringUtil.default.formatMoneyNumber(money);
    }
    this._money = money;
    this.moneyUIDangShow = this._money;
    if (null != this.playerModel) {
      this.playerModel.BuyIn = money;
    }
  };
  PlayerView.prototype.stopCountDown = function() {
    if (null !== this.countDownProgressTo && void 0 !== this.countDownProgressTo) {
      this.countDownProgressTo.isRuning = false;
      this.countDownProgressTo.setProgress(0);
      this.skeletonCountDown.node.active = false;
    }
  };
  PlayerView.prototype.startCountDown = function(remainingSeconds, elapsedRatio, i) {
    if (void 0 === elapsedRatio) {
      elapsedRatio = 0;
    }
    if (void 0 === i) {
      i = true;
    }
    this.countDownProgressTo.setProgress(1 - elapsedRatio);
    this.countDownProgressTo.RunActionProgress(remainingSeconds, 0);
    try {
      this.skeletonCountDown.node.active = true;
      var fullDuration = remainingSeconds;
      if (elapsedRatio > 0 && elapsedRatio < 1) {
        fullDuration = remainingSeconds * (1 / (1 - elapsedRatio));
      }
      this.skeletonCountDown.clearTrack(0);
      var trackEntry = this.skeletonCountDown.setAnimation(0, "DemNguoc10s", false);
      this.skeletonCountDown.timeScale = trackEntry.animationEnd / fullDuration;
      trackEntry.trackTime = trackEntry.animationEnd * elapsedRatio;
    } catch (err) {}
  };
  PlayerView.prototype.stopViewAction = function() {
    if (null !== this.chatIconView && void 0 !== this.chatIconView) {
      this.chatIconView.active = false;
    }
  };
  PlayerView.prototype.runViewAction = function() {
    if (null !== this.chatIconView && void 0 !== this.chatIconView) {
      this.chatIconView.active = true;
    }
  };
  PlayerView.prototype.start = function() {};
  PlayerView.prototype.showChat = function(message, autoHide) {
    var _this = this;
    if (void 0 === autoHide && (autoHide = true), null === this.bubbleChat || void 0 === this.bubbleChat) {
      var bubbleNode = cc.instantiate(this.bubbleFxPrefab);
      bubbleNode.parent = this.layerChatBubble ? this.layerChatBubble : this.node.parent;
      bubbleNode.zIndex = GameZOrder.default.CHAT_BUBLES;
      this.bubbleChat = bubbleNode.getComponent(PopBubbleUtil.default);
    } else {
      this.bubbleChat.stopAllActions();
    }
    var rightPosY = this.node.position.y + (40 + this.bubbleFxPos.position.y) * this.node.scale;
    if (rightPosY > 320) {
      rightPosY = 320;
    }
    var leftPosY = this.node.position.y + (20 + this.bubbleFxPos.position.y) * this.node.scale;
    if (leftPosY > 320) {
      leftPosY = 320;
    }
    this.bubbleChat.node.position = new cc.Vec2(this.node.position.x + this.bubbleFxPos.position.x * this.node.scale, rightPosY);
    this.bubbleChat.initPos(new cc.Vec2(this.node.position.x + this.bubbleFxPos.position.x * this.node.scale, rightPosY), new cc.Vec2(this.node
      .position.x - this.bubbleFxPos.position.x * this.node.scale, leftPosY));
    if (GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.BACAY && this.isMine()) {
      this.bubbleChat.showBubbleReverse(true);
    } else {
      this.bubbleChat.showBubbleReverse(this.node.position.x > 200);
    }
    this.bubbleChat.label.string = message;
    this.bubbleChat.node.active = true;
    this.bubbleChat.node.opacity = 255;
    this.bubbleChat.node.scale = .1;
    this.bubbleChat.popOut();
    if (autoHide) {
      this.bubbleChat.node.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(function() {
        _this.bubbleChat.popIn();
      })));
    }
  };
  PlayerView.prototype.removeBubbleFx = function(hideImmediately, e) {
    if (void 0 === hideImmediately) {
      hideImmediately = false;
    }
    if (void 0 === e) {
      e = -1;
    }
    if (null !== this.bubbleFx && void 0 !== this.bubbleFx) {
      this.bubbleFx.node.stopAllActions();
      this.bubbleFx._isPopping = false;
      if (hideImmediately) {
        this.bubbleFx.node.active = false;
      } else {
        this.bubbleFx.popIn();
      }
    }
  };
  PlayerView.prototype.showBubbleFx = function(text, e, usePopAnimation, reverse, onFinished) {
    if (void 0 === onFinished && (onFinished = void 0), null === this.bubbleFx || void 0 === this.bubbleFx) {
      var bubbleNode = cc.instantiate(this.bubbleFxPrefab);
      bubbleNode.parent = this.node.parent;
      bubbleNode.zIndex = GameZOrder.default.CHAT_BUBLES;
      this.bubbleFx = bubbleNode.getComponent(PopBubbleUtil.default);
    } else {
      this.bubbleFx.node.stopAllActions();
      this.bubbleFx._isPopping = false;
    }
    var rightPosY = this.node.position.y + (40 + this.bubbleFxPos.position.y) * this.node.scale;
    if (rightPosY > 320) {
      rightPosY = 320;
    }
    var leftPosY = rightPosY;
    this.bubbleFx.node.position = new cc.Vec2(this.node.position.x + this.bubbleFxPos.position.x, rightPosY);
    this.bubbleFx.initPos(new cc.Vec2(this.node.position.x + this.bubbleFxPos.position.x, rightPosY), new cc.Vec2(this.node.position.x - this
      .bubbleFxPos.position.x, leftPosY));
    this.bubbleFx.label.string = text;
    this.bubbleFx.node.active = true;
    this.bubbleFx.node.opacity = 255;
    this.bubbleFx.showBubbleReverse(reverse);
    if (GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.XITO) {
      this.bubbleFx.showBubbleReverse(this.node.position.x < 200);
    }
    if (usePopAnimation) {
      this.bubbleFx.node.scale = .1;
      this.bubbleFx.popOut();
    } else {
      this.bubbleFx.node.scale = 1;
    }
    if (void 0 != onFinished) {
      this.bubbleFx.finishPoppingOutCallBack = onFinished;
    }
  };
  PlayerView.prototype.removeBubbleSpecialFx = function(hideImmediately, e) {
    if (void 0 === hideImmediately) {
      hideImmediately = false;
    }
    if (void 0 === e) {
      e = -1;
    }
    if (null !== this.bubbleSpecial && void 0 !== this.bubbleSpecial) {
      this.bubbleSpecial.node.stopAllActions();
      this.bubbleSpecial._isPopping = false;
      if (hideImmediately) {
        this.bubbleSpecial.node.active = false;
      } else {
        this.bubbleSpecial.popIn();
      }
    }
  };
  PlayerView.prototype.showBubbleSpecialFx = function(text, e, usePopAnimation, reverse, onFinished) {
    if (void 0 === onFinished && (onFinished = void 0), null === this.bubbleSpecial || void 0 === this.bubbleSpecial) {
      var bubbleNode = cc.instantiate(this.bubbleFxPrefab);
      bubbleNode.parent = this.node.parent;
      bubbleNode.zIndex = GameZOrder.default.CHAT_BUBLES;
      this.bubbleSpecial = bubbleNode.getComponent(PopBubbleUtil.default);
    } else {
      this.bubbleSpecial.node.stopAllActions();
      this.bubbleSpecial._isPopping = false;
    }
    this.bubbleSpecial.node.position = new cc.Vec2(this.node.position.x + this.bubbleFxPos.position.x, this.node.position.y + this
      .bubbleFxPos.position.y);
    this.bubbleSpecial.initPos(new cc.Vec2(this.node.position.x + this.bubbleFxPos.position.x, this.node.position.y + (this.bubbleFxPos
      .position.y - 40)), new cc.Vec2(this.node.position.x - this.bubbleFxPos.position.x, this.node.position.y + (this.bubbleFxPos
      .position.y - 40)));
    if (text == this.bubbleSpecial.label.string) {
      usePopAnimation = false;
    }
    this.bubbleSpecial.label.string = text;
    this.bubbleSpecial.node.active = true;
    this.bubbleSpecial.node.opacity = 255;
    this.bubbleSpecial.showBubbleReverse(reverse);
    if (usePopAnimation) {
      this.bubbleSpecial.node.scale = .1;
      this.bubbleSpecial.popOut();
    } else {
      this.bubbleSpecial.node.scale = 1;
    }
    if (void 0 != onFinished) {
      this.bubbleSpecial.finishPoppingOutCallBack = onFinished;
    }
  };
  PlayerView.prototype.getBubbleFx = function() {
    return null;
  };
  PlayerView.prototype.runWinAction = function(duration, onFinished) {
    if (void 0 === onFinished) {
      onFinished = void 0;
    }
    var effectNode = cc.instantiate(this.winEffectPrefab);
    effectNode.parent = this.node.parent;
    effectNode.position = this.node.position;
    effectNode.zIndex = -1;
    if (null != this.winEffectNode && void 0 != this.winEffectNode) {
      this.winEffectNode.active = true;
    }
    this.winEffectNode = effectNode;
    effectNode.runAction(cc.sequence(cc.delayTime(duration), cc.callFunc(function() {
      if (effectNode && effectNode.isValid) {
        effectNode.removeFromParent(true);
      }
      if (void 0 != onFinished) {
        onFinished();
      }
    })));
  };
  PlayerView.prototype.showBonusMoneyFxForPlayer = function(amount, duration, delay, offsetY) {
    if (void 0 === offsetY && (offsetY = 25), 0 != amount && !this.isShowAnimBonusMoney) {
      this.isShowAnimBonusMoney = true;
      var textNode = cc.instantiate(this.loseTextEffectPrefab);
      textNode.parent = this.node.parent;
      textNode.zIndex = GameZOrder.default.TOP;
      var nodeScale = this.node.scale;
      textNode.position = new cc.Vec2(this.node.position.x, this.node.position.y - offsetY * nodeScale);
      if (null != this.textEffectNode && void 0 != this.textEffectNode) {
        this.textEffectNode.active = true;
      }
      this.textEffectNode = textNode;
      textNode.getComponent(BetLabel.default).setNumberWithPrefix(amount, false, "+");
      textNode.scaleX = 0;
      textNode.runAction(cc.sequence(cc.delayTime(delay), cc.scaleTo(.2, nodeScale), cc.moveBy(.3, new cc.Vec2(0, offsetY * nodeScale * 2)), cc.delayTime(duration - 1), cc
        .fadeOut(.5), cc.callFunc(function() {
          textNode.removeFromParent(true);
        })));
    }
  };
  PlayerView.prototype.showMoneyFxForPlayer = function(amount, duration, offsetY) {
    if (void 0 === offsetY && (offsetY = 25), 0 != amount) {
      var textNode = cc.instantiate(amount > 0 ? this.winTextEffectPrefab : this.loseTextEffectPrefab);
      textNode.parent = this.node.parent;
      textNode.zIndex = GameZOrder.default.TOP;
      var nodeScale = this.node.scale;
      textNode.position = new cc.Vec2(this.node.position.x, this.node.position.y - offsetY * nodeScale);
      if (null != this.textEffectNode && void 0 != this.textEffectNode) {
        this.textEffectNode.active = true;
      }
      this.textEffectNode = textNode;
      textNode.getComponent(BetLabel.default).setNumber(amount, false);
      textNode.scaleX = .2 * nodeScale;
      textNode.runAction(cc.sequence(cc.scaleTo(.2, nodeScale), cc.moveBy(.3, new cc.Vec2(0, offsetY * nodeScale * 2)), cc.delayTime(duration - 1), cc.fadeOut(.5), cc
        .callFunc(function() {
          if (textNode && textNode.isValid) {
            textNode.removeFromParent(true);
          }
        })));
      this.nodeMoneyFX = textNode;
    }
  };
  PlayerView.prototype.showUpBaiFxForPlayer = function(duration, offsetY) {
    if (void 0 === offsetY) {
      offsetY = 25;
    }
    var effectNode = cc.instantiate(this.upbaiEffectPrefab);
    effectNode.parent = this.node.parent;
    effectNode.zIndex = GameZOrder.default.TOP;
    var nodeScale = this.node.scale;
    effectNode.position = new cc.Vec2(this.node.position.x, this.node.position.y - offsetY * nodeScale);
    this.textEffectNode = effectNode;
    effectNode.scaleX = .2 * nodeScale;
    effectNode.runAction(cc.scaleTo(.2, 1 * nodeScale));
    effectNode.runAction(cc.sequence(cc.delayTime(.2), cc.moveBy(.3, new cc.Vec2(0, offsetY * nodeScale * 1.8)), cc.delayTime(duration - 1), cc.fadeOut(.5), cc
      .callFunc(function() {
        effectNode.removeFromParent(true);
      })));
  };
  PlayerView.prototype.showTextFxResultForPlayer = function(spriteFrame, duration, offsetY) {
    if (void 0 === offsetY && (offsetY = -35), null !== spriteFrame && void 0 !== spriteFrame) {
      var resultNode = cc.instantiate(this.textResultPrefab);
      resultNode.parent = this.node;
      resultNode.scale = .7;
      resultNode.position = new cc.Vec2(0, offsetY);
      resultNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      resultNode.runAction(cc.sequence(cc.scaleTo(.2, 1), cc.delayTime(duration - .2 - .2), cc.fadeOut(.2), cc.callFunc(function() {
        resultNode.removeFromParent(true);
      })));
    }
  };
  PlayerView.prototype.runToPos = function(tableSize, instant) {
    if (void 0 === instant && (instant = false), this.node.position.x === GameController.posOutScreen.x && this.node.position.y === GameController.posOutScreen.y && (this.pos
        .x <= 0 && this.pos.y <= 0 ? this.node.position = new cc.Vec2(-tableSize.width / 2, -tableSize.height / 2) : this.pos.x <= 0 && this.pos.y >=
        0 ? this.node.position = new cc.Vec2(-tableSize.width / 2, tableSize.height / 2) : this.pos.x >= 0 && this.pos.y <= 0 ? this.node.position =
        new cc.Vec2(tableSize.width / 2, -tableSize.height / 2) : this.pos.x >= 0 && this.pos.y >= 0 && (this.node.position = new cc.Vec2(tableSize.width / 2, tableSize
          .height / 2))), this.node.stopAllActions(), instant) {
      this.node.position = this.pos;
    } else {
      var moveAction = cc.moveTo(.3, this.pos);
      this.node.stopAllActions();
      this.node.runAction(moveAction);
    }
  };
  PlayerView.prototype.checkInThisArray = function(players) {
    for (var playerIndex = 0; playerIndex < players.length; ++playerIndex) {
      if (0 === this.userID.localeCompare(players[playerIndex].userID)) {
        return true;
      }
    }
    return false;
  };
  PlayerView.prototype.removeChat = function() {
    if (null !== this.bubbleChat && void 0 !== this.bubbleChat) {
      this.bubbleChat.node.stopAllActions();
      this.bubbleChat.node.removeFromParent(true);
      this.bubbleChat = null;
    }
  };
  PlayerView.prototype.createNewCard = function(cardPrefab) {
    var cardNode = cc.instantiate(cardPrefab);
    cardNode.parent = this.node.parent;
    cardNode.position = new cc.Vec2(0, 0);
    cardNode.zIndex = GameZOrder.default.MIDDLE + this.cards.length;
    var cardSprite = cardNode.getComponent(GameCardSprite.default);
    cardSprite.init(GameCardSpriteType.default.TypeHIDE);
    this.cards.push(cardSprite);
    cardNode.active = false;
    return cardSprite;
  };
  PlayerView.prototype.initPokerCard = function(cardPrefab) {
    for (var cardIndex = this.cards.length; cardIndex < 2; ++cardIndex) {
      this.createNewCard(cardPrefab);
    }
  };
  PlayerView.prototype.initMauBinhCard = function(cardPrefab) {
    for (var startIndex = this.cards.length, isMine = this.isMine(), cardIndex = startIndex; cardIndex < 13; ++cardIndex) {
      this.createNewCard(cardPrefab).node.zIndex = isMine ? GameZOrder.default.MIDDLE_TOP_2 + 1 + cardIndex : 15 - cardIndex;
    }
  };
  PlayerView.prototype.initCatteCard = function(cardPrefab) {
    for (var startIndex = this.cards.length, isMine = this.isMine(), cardIndex = startIndex; cardIndex < 6; ++cardIndex) {
      this.createNewCard(cardPrefab).node.zIndex = isMine ? GameZOrder.default.MIDDLE_TOP_2 + 1 + cardIndex : 15 - cardIndex;
    }
  };
  PlayerView.prototype.iniBaCayCard = function(cardPrefab) {
    for (var startIndex = this.cards.length, isMine = this.isMine(), cardIndex = startIndex; cardIndex < 3; ++cardIndex) {
      this.createNewCard(cardPrefab).node.zIndex = isMine ? GameZOrder.default.MIDDLE_TOP_2 + 1 + cardIndex : 15 - cardIndex;
    }
  };
  PlayerView.prototype.hideAllCard = function(visible) {
    if (void 0 === visible) {
      visible = false;
    }
    for (var cardIndex = 0; cardIndex < this.cards.length; ++cardIndex) {
      var cardSprite = this.cards[cardIndex];
      cardSprite.node.stopAllActions();
      cardSprite.init(GameCardSpriteType.default.TypeHIDE);
      cardSprite.setColor(cc.Color.WHITE);
      cardSprite.node.position = new cc.Vec2(0, 0);
      cardSprite.node.active = visible;
      cardSprite.node.opacity = 255;
    }
  };
  PlayerView.prototype.setArrayCard = function(cardCodes, applyTexture) {
    if (void 0 === applyTexture) {
      applyTexture = true;
    }
    for (var cardIndex = 0; cardIndex < cardCodes.length; ++cardIndex) {
      var cardSprite = this.cards[cardIndex],
        cardCode = cardCodes[cardIndex];
      if (applyTexture) {
        cardSprite.setTextureWithCode(cardCode, GamePlayManager.default.getInstance().gameID);
      }
    }
  };
  PlayerView.prototype.resetDefaultValueForMauBinh = function() {
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
  PlayerView.prototype.initXiToCard = function(cardPrefab) {
    var cardCount = this.cards.length;
    if (cardCount < 5) {
      for (var cardIndex = cardCount; cardIndex < 5; ++cardIndex) {
        var cardNode = cc.instantiate(cardPrefab);
        cardNode.parent = this.node.parent;
        cardNode.position = new cc.Vec2(0, 0);
        var cardSprite = cardNode.getComponent(GameCardSprite.default);
        cardSprite.init(GameCardSpriteType.default.TypeHIDE);
        this.cards.push(cardSprite);
        cardNode.active = false;
      }
    }
  };
  PlayerView.prototype.hideXiToCard = function(visible) {
    if (void 0 === visible) {
      visible = false;
    }
    for (var cardIndex = 0; cardIndex < 2; ++cardIndex) {
      var cardSprite = this.cards[cardIndex];
      cardSprite.node.stopAllActions();
      cardSprite.init(GameCardSpriteType.default.TypeHIDE);
      cardSprite.node.position = new cc.Vec2(0, 0);
      cardSprite.node.active = visible;
    }
  };
  PlayerView.prototype.setState = function(state) {
    switch (this.node.active = true, this.nodePlayerAvatar.active = true, this.nodePlayerName.active = true, state) {
      case EPlayerState.EMPTY:
        this.node.active = false;
        break;
      case EPlayerState.INVITE:
        this.nodePlayerAvatar.active = false;
        this.nodePlayerName.active = false;
        break;
      case EPlayerState.IN_GAME:
      case EPlayerState.PLAYING:
      case EPlayerState.SPECTATOR:
    }
  };
  PlayerView.prototype.moveToPosision = function(newParent) {
    var worldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
    this.node.parent = newParent;
    this.node.position = newParent.convertToNodeSpaceAR(worldPos);
    this.node.runAction(cc.moveTo(.3, cc.Vec2.ZERO));
  };
  PlayerView.prototype.setPhomStatus = function(status) {
    var reverse = false;
    switch (1 != this.indexPos && 3 != this.indexPos || (reverse = true), status) {
      case GameDefine.EPhomPlayerStatus.MOM:
        this.showBubbleFx("M\xf3m", 0, true, reverse);
        break;
      case GameDefine.EPhomPlayerStatus.U:
        this.showBubbleFx("\xd9", 0, true, reverse);
        break;
      case GameDefine.EPhomPlayerStatus.AN_CHOT:
        this.showBubbleFx("\u0102n Ch\u1ed1t", 0, true, reverse);
        break;
      default:
      case GameDefine.EPhomPlayerStatus.NONE:
        return void this.removeBubbleFx();
    }
  };
  PlayerView.prototype.setLiengStatus = function(status) {
    if (this.indexPos < 5 && this.indexPos >= 0) {
      this.playerStatusUI.node.x = -100;
      this.playerStatusUI.flipBackground(true);
    } else {
      this.playerStatusUI.node.x = 100;
      this.playerStatusUI.flipBackground(false);
    }
    this.playerStatusUI.node.y = 70;
    this.playerStatusUI.setLiengStatus(status);
    if (status == GameDefine.ELiengPlayState.FOLD) {
      this.showUpBaiFxForPlayer(3);
    }
  };
  PlayerView.prototype.setBaCayStatus = function(status) {};
  PlayerView.prototype.setModel = function(playerModel, updateState) {
    if (void 0 === updateState) {
      updateState = true;
    }
    this.playerModel = playerModel;
    if (updateState) {
      if (playerModel.IsPlaying) {
        this.setState(EPlayerState.IN_GAME);
      } else {
        this.setState(EPlayerState.SPECTATOR);
      }
    }
    this.lbName.string = playerModel.DisplayName;
    this.processCutLongString();
    this.setMoney(playerModel.BuyIn);
    if (playerModel.IsRoomMaster) {
      this.iconHost.active = true;
    } else {
      this.iconHost.active = false;
    }
  };
  PlayerView.prototype.reset = function() {
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
  PlayerView.prototype.setTableBetUI = function(tableBetUI, fromPosition) {
    if (void 0 === fromPosition && (fromPosition = null), void 0 != tableBetUI && null != tableBetUI) {
      if (this.tableBetUI = tableBetUI, null == fromPosition) {
        var worldPos = this.node.parent.convertToWorldSpaceAR(this.node.getPosition()),
          localPos = this.tableBetUI.node.convertToNodeSpaceAR(worldPos);
        this.tableBetUI.setFromPosition(localPos);
      } else {
        this.tableBetUI.setFromPosition(fromPosition);
      }
    }
  };
  PlayerView.prototype.showUserInfo = function() {
    this.borderInfo.active = false;
  };
  PlayerView.prototype.kickUser = function() {
    this.borderInfo.active = false;
  };
  PlayerView.prototype._kickUser = function() {
    CardGameCommonRequest.default.getInstance().sendKickUser(this.userID);
  };
  PlayerView.prototype.destroyMe = function() {
    if (null !== this.bubbleFx && void 0 !== this.bubbleFx) {
      this.bubbleFx.node.removeFromParent(true);
    }
    if (null !== this.bubbleSpecial && void 0 !== this.bubbleSpecial) {
      this.bubbleSpecial.node.removeFromParent(true);
    }
    if (null !== this.bubbleChat && void 0 !== this.bubbleChat) {
      this.bubbleChat.node.removeFromParent(true);
    }
    this.cards.forEach(function(cardSprite) {
      cardSprite.node.removeFromParent(true);
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
  PlayerView.prototype.hideAlllistCardOnHandTL = function() {
    for (var cardIndex = 0; cardIndex < this.listCardOnHandTL.length; cardIndex++) {
      if (null != this.listCardOnHandTL[cardIndex] && null != this.listCardOnHandTL[cardIndex].node) {
        this.listCardOnHandTL[cardIndex].node.active = false;
      }
    }
    this.listCardOnHandTL = [];
  };
  PlayerView.prototype.showPopupUserTableInfo = function() {
    if (MusicPlayer.default.getInstance().playbtnClick(), this.isAnDanh) {
      CommonPrefabsManager.default.getInstance().showPopupMessageUtil("Ng\u01b0\u1eddi Ch\u01a1i \u1ea8n Danh");
    } else if (!GameConfigManager.default.getInstance().isLoginWebcc || !this.isMine()) {
      var displayMoney = this.moneyUIDangShow;
      if (!(GamePlayManager.default.getInstance().gameID != GameDefine.GameID.LIENG && GamePlayManager.default.getInstance().gameID != GameDefine.GameID.POKER && GamePlayManager.default
          .getInstance().gameID != GameDefine.GameID.XITO)) {
        displayMoney = this._realMoney;
      }
      CommonPrefabsManager.default.getInstance().showPopupUserTableInfo(this.lbName.string, displayMoney, this.avatarUrl, this.isMine());
    }
  };
  PlayerView.prototype.setPlayerViewBauCua = function() {
    var nameSprite = this.nodePlayerName.getComponent(cc.Sprite);
    if (null !== nameSprite && void 0 !== nameSprite) {
      nameSprite.enabled = false;
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
  PlayerView.prototype.getCardOfMine = function(serverCode, defaultValue) {
    if (void 0 === defaultValue) {
      defaultValue = null;
    }
    for (var cardIndex = 0; cardIndex < this.cards.length; ++cardIndex) {
      var cardSprite = this.cards[cardIndex];
      if (cardSprite.serverCode === serverCode) {
        return cardSprite;
      }
    }
    return defaultValue;
  };
  PlayerView.prototype.blockAllCardTouch = function() {
    for (var cardIndex = 0; cardIndex < this.cards.length; ++cardIndex) {
      this.cards[cardIndex].setClickEnabled(false, false, null);
    }
  };
  PlayerView.prototype.onDisable = function() {
    if (this.nodeMoneyFX && this.nodeMoneyFX.isValid) {
      this.nodeMoneyFX.stopAllActions();
      this.nodeMoneyFX.destroy();
    }
    if (this.winEffectNode && this.winEffectNode.isValid) {
      this.winEffectNode.stopAllActions();
      this.winEffectNode.destroy();
    }
  };
  PlayerView.prototype.setChatLayer = function(chatLayer) {
    this.layerChatBubble = chatLayer;
  };
  __decorate([property(cc.Label)], PlayerView.prototype, "lbName", void 0);
  __decorate([property(cc.Label)], PlayerView.prototype, "lbMoney", void 0);
  __decorate([property], PlayerView.prototype, "text", void 0);
  __decorate([property(cc.Node)], PlayerView.prototype, "BigBlindIcon", void 0);
  __decorate([property(cc.Node)], PlayerView.prototype, "smallBlindIcon", void 0);
  __decorate([property(cc.Node)], PlayerView.prototype, "deadlerIcon", void 0);
  __decorate([property(cc.Node)], PlayerView.prototype, "iconHost", void 0);
  __decorate([property(cc.Node)], PlayerView.prototype, "iconQuit", void 0);
  __decorate([property(cc.Node)], PlayerView.prototype, "iconnReady", void 0);
  __decorate([property(cc.Node)], PlayerView.prototype, "kickButton", void 0);
  __decorate([property([cc.Node])], PlayerView.prototype, "coins", void 0);
  __decorate([property(cc.Node)], PlayerView.prototype, "bubbleFxPos", void 0);
  __decorate([property(cc.Prefab)], PlayerView.prototype, "bubbleFxPrefab", void 0);
  __decorate([property(cc.Prefab)], PlayerView.prototype, "winEffectPrefab", void 0);
  __decorate([property(cc.Prefab)], PlayerView.prototype, "winTextEffectPrefab", void 0);
  __decorate([property(cc.Prefab)], PlayerView.prototype, "loseTextEffectPrefab", void 0);
  __decorate([property(cc.Prefab)], PlayerView.prototype, "upbaiEffectPrefab", void 0);
  __decorate([property(cc.Prefab)], PlayerView.prototype, "textResultPrefab", void 0);
  __decorate([property(ActionProgressTo.default)], PlayerView.prototype, "countDownProgressTo", void 0);
  __decorate([property(cc.Node)], PlayerView.prototype, "chatIconView", void 0);
  __decorate([property(cc.Node)], PlayerView.prototype, "nodePlayerAvatar", void 0);
  __decorate([property(cc.Node)], PlayerView.prototype, "nodePlayerName", void 0);
  __decorate([property(PlayerStatusUI.default)], PlayerView.prototype, "playerStatusUI", void 0);
  __decorate([property(cc.Node)], PlayerView.prototype, "borderInfo", void 0);
  __decorate([property(RemoteSprite.default)], PlayerView.prototype, "avarta", void 0);
  __decorate([property(sp.Skeleton)], PlayerView.prototype, "skeletonEffect", void 0);
  __decorate([property(sp.Skeleton)], PlayerView.prototype, "skeletonCountDown", void 0);
  __decorate([property(cc.Node)], PlayerView.prototype, "iconDola", void 0);
  __decorate([property], PlayerView.prototype, "widthCutString", void 0);
  return PlayerView = __decorate([ccclass], PlayerView);
}(cc.Component);
moduleExports.default = PlayerView;
void 0;
