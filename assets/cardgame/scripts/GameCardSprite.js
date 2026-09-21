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
var GamePlayManager = require("./GamePlayManager"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  GameCardSpriteType = require("./GameCardSpriteType"),
  XiToRequestHandler = require("./XiToRequestHandler"),
  GameDefine = require("./GameDefine"),
  h = cc._decorator,
  u = h.ccclass,
  d = h.property,
  p = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.cardSprite = null;
      e.prefabSparklingFx = null;
      e.S = -1;
      e.N = -1;
      e.type = -1;
      e.cardName = "";
      e.serverCode = -1;
      e.isFading = false;
      e.isSelected = false;
      e.isAllowClick = false;
      e.isShowSelected = true;
      e.isCardBack = true;
      e.clickCallback = null;
      e.firstSelectPosition = null;
      e.sparklingFx = null;
      e.cardSpriteAtlas = null;
      e.cardSpriteEffect = null;
      e.emptyCardMauBinh = null;
      e.tempTouchEmptyCardMauBinh = null;
      e.originalPosMauBinh = null;
      e.indexChildMauBinh = 0;
      e.cardSize = cc.Size.ZERO;
      e.index = 0;
      e.isBlackFace = false;
      e.isInBottomMauBinh = false;
      e.isRotationY = false;
      e.isRotationX = false;
      e.delayTime = 0;
      e.rotateTime = 0;
      e.rotaionStart = 0;
      e.rotationByValue = 0;
      e.countTime = 0;
      return e;
    }
    var i;
    n(e, t);
    i = e;
    e.prototype.onLoad = function() {};
    e.prototype.start = function() {};
    e.prototype.init = function(t) {
      this.gameID = GamePlayManager.default.getInstance().gameID;
      this.setType(t);
    };
    e.prototype.initAndHide = function(t) {
      this.gameID = GamePlayManager.default.getInstance().gameID;
      this.type = t;
      this.type = t;
      this.node.stopAllActions();
      this.cardSprite.spriteFrame = this.cardSpriteAtlas.getSpriteFrame("icCardback");
      this.isCardBack = true;
      this.node.scale = this.getScaleWithType(this.type);
    };
    e.prototype.setType = function(t) {
      this.type = t;
      if (this.type == GameCardSpriteType.default.TypeHIDE) {
        this.node.stopAllActions();
        this.cardSprite.spriteFrame = this.cardSpriteAtlas.getSpriteFrame("icCardback");
        this.isCardBack = true;
      }
      this.node.scale = this.getScaleWithType(this.type);
    };
    e.prototype.setTypeHIDENoScale = function() {
      this.type = GameCardSpriteType.default.TypeHIDE;
      this.node.stopAllActions();
      this.cardSprite.spriteFrame = this.cardSpriteAtlas.getSpriteFrame("icCardback");
      this.isCardBack = true;
    };
    e.prototype.getScaleWithType = function(t) {
      var e = 1;
      switch (t === GameCardSpriteType.default.TypeBIG ? e = .65 : t === GameCardSpriteType.default.TypeMEDIUM ? e = .6 : t === GameCardSpriteType.default.TypeSMALL ? e = .5 : t === GameCardSpriteType
        .default.TypeHIDE && (e = .5), this.gameID) {
        case MessageCardGameHandler.GAME.TIENLEN:
          break;
        case MessageCardGameHandler.GAME.POKER:
          t === GameCardSpriteType.default.TypeSMALL ? e = .62 : t === GameCardSpriteType.default.TypeHIDE && (e = .62);
          break;
        case MessageCardGameHandler.GAME.XITO:
          t === GameCardSpriteType.default.TypeSMALL ? e = .6 : t === GameCardSpriteType.default.TypeHIDE && (e = .6);
          break;
        case MessageCardGameHandler.GAME.BINH:
          t === GameCardSpriteType.default.TypeBIG ? e = 1 : t !== GameCardSpriteType.default.TypeHIDE && t !== GameCardSpriteType.default.TypeMEDIUM || (e = .65);
          break;
        case MessageCardGameHandler.GAME.CATTE:
          t === GameCardSpriteType.default.TypeBIG ? e = 1 : t !== GameCardSpriteType.default.TypeHIDE && t !== GameCardSpriteType.default.TypeMEDIUM || (e = .43);
          break;
        case GameDefine.GameID.LIENG:
          t === GameCardSpriteType.default.TypeBIG ? e = 1.5 : t === GameCardSpriteType.default.TypeMEDIUM ? e = 1 : t === GameCardSpriteType.default.TypeSMALL ? e = .8 : t === GameCardSpriteType.default
            .TypeHIDE && (e = .5);
          break;
        case GameDefine.GameID.BACAY:
          t === GameCardSpriteType.default.TypeBIG ? e = .78 : t === GameCardSpriteType.default.TypeMEDIUM && (e = .65);
      }
      return e;
    };
    e.prototype.setTextureWithCode = function(t, e) {
      this.decodeCard(t, e);
      var i = this.getResourceName(),
        n = this.cardSpriteAtlas.getSpriteFrame(i);
      if (!(null === n || void 0 === n)) {
        this.cardSprite.spriteFrame = n;
        this.isCardBack = false;
      }
    };
    e.prototype.setTextureWithCodeHaveCheck = function(t, e) {
      if (t >= 0) {
        this.setTextureWithCode(t, e);
      } else {
        this.setTypeHIDENoScale();
        this.setBlackFace(true);
        this.serverCode = t;
      }
    };
    e.prototype.setServerCode = function(t) {
      this.decodeCard(t);
    };
    e.prototype.decodeCard = function(t, e) {
      if (void 0 === e) {
        e = -1;
      }
      this.serverCode = t;
      if (-1 === e) {
        e = this.gameID;
      }
      this.S = t % 4 + 1;
      this.N = Math.floor(t / 4) + 1;
      if (1 === this.N && e != MessageCardGameHandler.GAME.LIENG) {
        this.N = 14;
      }
      if (0 === this.N && MessageCardGameHandler.GAME.LIENG) {
        this.N = 1;
      }
      if (2 === this.N && e !== MessageCardGameHandler.GAME.BINH && e !== MessageCardGameHandler.GAME.POKER && e !== MessageCardGameHandler.GAME.BACAY && e !== MessageCardGameHandler.GAME.BLACK_JACK && e != MessageCardGameHandler.GAME.LIENG &&
        e != MessageCardGameHandler.GAME.CATTE) {
        this.N = 15;
      }
    };
    e.prototype.encodeCard = function(t) {
      if (void 0 === t) {
        t = -1;
      }
      if (-1 === t) {
        t = this.gameID;
      }
      return t === MessageCardGameHandler.GAME.TIENLEN ? 13 * (this.S - 1) + this.N - 2 : 13 * (this.S - 1) + this.N - 1;
    };
    e.prototype.getResourceName = function() {
      var t = 0;
      return (t = 15 == this.N ? 2 : 14 == this.N ? 1 : this.N) > 0 ? (this.cardName = "icCard" + t.toString() + " " + this
        .getSuitInVietnamese(), "icCard" + t.toString() + this.getSuitInVietnamese()) : "icCardback";
    };
    e.prototype.getSuitInVietnamese = function() {
      return 1 === this.S ? "D" : 2 === this.S ? "C" : 3 === this.S ? "B" : 4 === this.S ? "A" : "-1";
    };
    e.prototype.getNuocInVietnamese = function() {
      return 2 === this.N ? "2" : 14 === this.N ? "A" : 13 === this.N ? "K" : 12 === this.N ? "Q" : 11 === this.N ? "J" : this.N
      .toString();
    };
    e.prototype.getChatInVietnamese = function() {
      return 1 === this.S ? "b\xedch" : 2 === this.S ? "chu\u1ed3n" : 3 === this.S ? "r\xf4" : 4 === this.S ? "c\u01a1" : "-1";
    };
    e.prototype.getCardNameCatte = function() {
      return this.serverCode >= 0 ? this.getNuocInVietnamese() + " " + this.getChatInVietnamese() : "Thi\u1ec7p";
    };
    e.prototype.getSuit = function() {
      return this.S;
    };
    e.prototype.initSparkles = function() {
      this.sparklingFx = cc.instantiate(this.prefabSparklingFx);
      this.sparklingFx.parent = this.node;
      this.sparklingFx.position = new cc.Vec2(0, 0);
      this.sparklingFx.active = false;
    };
    e.prototype.sparkles = function() {
      var t = cc.sequence(cc.fadeTo(.3, 150), cc.fadeTo(.3, 255));
      this.sparklingFx.runAction(cc.repeatForever(t));
    };
    e.prototype.stopSparkling = function() {
      if (null !== this.sparklingFx && void 0 !== this.sparklingFx) {
        if (!(true !== this.sparklingFx.active)) {
          this.sparklingFx.active = false;
        }
      }
    };
    e.prototype.runActionFlip = function() {
      var t = this,
        e = this.node.scaleX,
        i = this.node.scaleY;
      this.node.runAction(cc.sequence(cc.scaleTo(.15, 0, i), cc.callFunc(function() {
        t.setTextureWithCode(t.serverCode, -1);
      }), cc.scaleTo(.15, e, i)));
    };
    e.prototype.runActionFlipToHideAnim = function() {
      var t = this,
        e = this.node.scaleX,
        i = this.node.scaleY;
      this.node.runAction(cc.sequence(cc.scaleTo(.15, 0, i), cc.callFunc(function() {
        t.type = GameCardSpriteType.default.TypeHIDE;
        t.cardSprite.spriteFrame = t.cardSpriteAtlas.getSpriteFrame("icCardback");
        t.isCardBack = true;
      }), cc.scaleTo(.15, e, i)));
    };
    e.prototype.runActionFlipToHide = function(t) {
      var e = this;
      this.cardSprite.node.runAction(cc.sequence(cc.delayTime(t), cc.callFunc(function() {
        e.runActionFlipToHideAnim();
      })));
    };
    e.prototype.runActionFlip3D = function() {
      this.setTextureWithCode(this.serverCode, -1);
      this.node.opacity = 0;
      var t = cc.instantiate(this.node);
      t.getComponent(i).init(GameCardSpriteType.default.TypeHIDE);
      t.parent = this.node;
      t.position = cc.Vec2.ZERO;
      t.scale = 1;
      t.runAction(cc.rotateTo(1.5, -90));
    };
    e.prototype.runActionFlip2 = function(t, e) {
      var i = this;
      if (void 0 === t && (t = 0), void 0 === e && (e = null), 0 != this.isCardBack) {
        this.isCardBack = false;
        var n = this.node.scale,
          o = cc.scaleTo(.15, 0, 1.2 * n).easing(cc.easeSineInOut()),
          a = cc.skewTo(.15, 10, 0).easing(cc.easeSineOut()),
          s = cc.scaleTo(.15, n, n).easing(cc.easeSineInOut()),
          r = cc.skewTo(.15, 0, 0).easing(cc.easeSineOut());
        this.node.runAction(cc.sequence(cc.delayTime(t), cc.spawn(o, a), cc.callFunc(function() {
          i.setTextureWithCode(i.serverCode, -1);
        }), cc.spawn(s, r), cc.callFunc(function() {
          if (e) {
            e();
          }
        })));
      }
    };
    e.prototype.runActionFlipCloseCard2 = function(t) {
      var e = this;
      if (void 0 === t && (t = 0), !this.isCardBack) {
        var i = this.node.scale,
          n = cc.scaleTo(.15, 0, 1.2 * i).easing(cc.easeSineInOut()),
          o = cc.skewTo(.15, 10, 0).easing(cc.easeSineOut()),
          a = cc.scaleTo(.15, i, i).easing(cc.easeSineInOut()),
          s = cc.skewTo(.15, 0, 0).easing(cc.easeSineOut());
        this.node.runAction(cc.sequence(cc.delayTime(t), cc.spawn(n, o), cc.callFunc(function() {
          e.cardSprite.spriteFrame = e.cardSpriteAtlas.getSpriteFrame("icCardback");
          e.isCardBack = true;
        }), cc.spawn(a, s), cc.callFunc(function() {})));
      }
    };
    e.prototype.chonLaBaiTay = function() {
      XiToRequestHandler.default.getInstance().sendChonLaBaiTay(this.serverCode);
    };
    e.prototype.isInArray = function(t) {
      for (var e = 0; e < t.length; ++e) {
        if (t[e].serverCode === this.serverCode) {
          return true;
        }
      }
      return false;
    };
    e.prototype.Rotationby = function(t, e, i, n) {
      if (void 0 === n) {
        n = true;
      }
      this.node.is3DNode = true;
      this.delayTime = t;
      this.rotateTime = e;
      this.rotationByValue = i;
      if (n) {
        this.isRotationY = true;
        this.isRotationX = false;
        this.rotaionStart = this.node.eulerAngles.y;
        this.cardSpriteEffect.active = true;
      } else {
        this.isRotationY = false;
        this.isRotationX = true;
        this.rotaionStart = this.node.eulerAngles.x;
      }
      this.countTime = 0;
    };
    e.prototype.update = function(t) {
      if (this.isRotationY || this.isRotationX) {
        if (this.delayTime > 0) {
          this.delayTime -= t;
          if (this.delayTime < 0) {
            this.countTime = Math.abs(this.delayTime);
          }
        } else {
          this.countTime += t;
          if (this.isRotationY) {
            this.node.eulerAngles = new cc.Vec3(0, this.rotaionStart + this.countTime / this.rotateTime * this.rotationByValue, 0);
            if (this.cardSpriteEffect.active && this.countTime >= this.rotateTime / 2) {
              this.cardSpriteEffect.active = false;
            }
            if (this.countTime >= this.rotateTime) {
              this.node.eulerAngles = new cc.Vec3(0, this.rotaionStart + this.rotationByValue, 0);
              this.isRotationY = false;
              this.isRotationX = false;
            }
          } else {
            this.node.eulerAngles = new cc.Vec3(this.rotaionStart + this.countTime / this.rotateTime * this.rotationByValue, 0, 0);
            if (this.countTime >= this.rotateTime) {
              this.node.eulerAngles = new cc.Vec3(this.rotaionStart + this.rotationByValue, 0, 0);
              this.isRotationX = false;
              this.isRotationY = false;
            }
          }
        }
      }
    };
    e.prototype.setColor = function(t) {
      this.cardSprite.node.color = t;
    };
    e.prototype.setBlackFace = function(t) {
      if (void 0 === t) {
        t = true;
      }
      this.isBlackFace = t;
      if (t) {
        this.setColor(cc.color(130, 130, 130));
      } else {
        this.setColor(cc.color(255, 255, 255));
      }
    };
    e.prototype.checkTouchInThis = function(t, e) {
      return !(t > this.node.position.x + this.node.width / 2 || t < this.node.position.x - this.node.width / 2 || e > this.node.position
        .y + this.node.height / 2 || e < this.node.position.y - this.node.height / 2);
    };
    e.prototype.reset = function() {
      this.serverCode = -1;
      this.N = -1;
      this.S = -1;
      this.cardSprite.spriteFrame = this.cardSpriteAtlas.getSpriteFrame("icCardback");
      this.isCardBack = true;
      this.setHighLight(false);
      this.setScale(1);
      this.setClickEnabled(false);
      this.setCardSelected(false, false);
      this.setBlackFace(false);
      this.node.stopAllActions();
      this.node.opacity = 255;
      this.node.scale = 1;
    };
    e.prototype.resetCattle = function() {
      this.serverCode = -1;
      this.N = -1;
      this.S = -1;
      this.isCardBack = true;
      this.setHighLight(false);
      this.setBlackFace(false);
      this.node.stopAllActions();
      this.node.opacity = 255;
    };
    e.prototype.setHighLight = function(t) {
      if (null != this.sparklingFx) {
        this.sparklingFx.active = t;
        if (t) {
          this.sparkles();
        }
      }
    };
    e.prototype.setScale = function(t) {
      if (null != this.sparklingFx) {
        this.sparklingFx.scale = t;
      }
      this.setContentSize(new cc.Size(this.cardSize.width * t, this.cardSize.height * t));
    };
    e.prototype.setContentSize = function(t) {
      this.cardSprite.node.setScale(1);
      this.node.setScale(1);
      this.node.setContentSize(t.width, t.height);
      this.cardSprite.node.setContentSize(t.width, t.height);
    };
    e.prototype.enableTouch = function(t, e) {
      if (void 0 === t) {
        t = null;
      }
      if (void 0 === e) {
        e = false;
      }
      if (!(GamePlayManager.default.getInstance().gameID != GameDefine.GameID.LIENG && GamePlayManager.default.getInstance().gameID != GameDefine.GameID.BACAY)) {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(i) {
          if (!this.isFading) {
            if (this.node.y >= .85 * this.node.height || this.node.y <= -this.node.height / 2 || this.node.x >= .5 * this.node
              .width || this.node.x <= -this.node.width / 2) {
              if (null != t) {
                t(this);
              }
              this.fadeOut(.5);
            } else {
              this.node.y += i.getDelta().y;
              if (e) {
                this.node.x += i.getDelta().x;
              }
            }
          }
        }.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, function(i) {
          if (!this.isFading) {
            if (this.node.y >= .85 * this.node.height || this.node.y <= -this.node.height / 2) {
              if (null != t) {
                t(this);
              }
              this.fadeOut(.5);
            } else {
              if (e && (this.node.x >= .5 * this.node.width || this.node.x <= -this.node.width / 2)) {
                if (null != t) {
                  t(this);
                }
                this.fadeOut(.5);
              }
            }
          }
        }.bind(this));
      }
    };
    e.prototype.fadeOut = function(t) {
      this.isFading = true;
      this.node.runAction(cc.sequence(cc.fadeOut(t), cc.callFunc(function() {
        this.node.active = false;
        this.node.opacity = 255;
        this.isFading = false;
      }.bind(this))));
    };
    e.prototype.setClickEnabled = function(t, e, i) {
      if (void 0 === e) {
        e = true;
      }
      if (void 0 === i) {
        i = null;
      }
      this.isAllowClick = t;
      this.clickCallback = i;
      this.isShowSelected = e;
    };
    e.prototype.setCardSelected = function(t, e) {
      if (void 0 === e && (e = true), !(this.isSelected == t || this.isBlackFace && t)) {
        if (t && (this.firstSelectPosition || (this.firstSelectPosition = this.node.position)), this.isSelected = t, this.node
          .stopAllActions(), e) {
          if (this.isSelected) {
            this.node.runAction(cc.moveTo(.07, this.firstSelectPosition.x, this.firstSelectPosition.y + 25));
          } else {
            this.node.runAction(cc.moveTo(.07, 0, 0));
          }
        } else {
          var i = cc.Vec2.ZERO;
          if (this.isSelected) {
            i = new cc.Vec2(0, this.firstSelectPosition.y + 25);
          }
          this.node.x = i.x;
          this.node.y = i.y;
        }
      }
    };
    e.prototype.getSelected = function() {
      return this.node.position.y >= 5;
    };
    e.prototype.onCardClicked = function(t) {
      if (0 != this.isAllowClick) {
        if (this.isShowSelected) {
          this.setCardSelected(!this.isSelected);
        }
        if (null != this.clickCallback) {
          this.clickCallback(this);
        }
      }
    };
    e.prototype.getData = function() {
      return {
        S: this.S,
        N: this.N,
        serverCode: this.serverCode
      };
    };
    e.prototype.getNSam = function() {
      return 14 == this.N ? 1 : 15 == this.N ? 2 : this.N;
    };
    o([d(cc.Sprite)], e.prototype, "cardSprite", void 0);
    o([d(cc.Prefab)], e.prototype, "prefabSparklingFx", void 0);
    o([d(cc.Node)], e.prototype, "sparklingFx", void 0);
    o([d(cc.SpriteAtlas)], e.prototype, "cardSpriteAtlas", void 0);
    o([d(cc.Node)], e.prototype, "cardSpriteEffect", void 0);
    o([d(cc.Size)], e.prototype, "cardSize", void 0);
    return e = i = o([u], e);
  }(cc.Component);
i.default = p;
void 0;
