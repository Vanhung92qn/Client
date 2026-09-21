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
  };
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});
var GamePlayManager = require("./GamePlayManager"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  GameCardSpriteType = require("./GameCardSpriteType"),
  XiToRequestHandler = require("./XiToRequestHandler"),
  GameDefine = require("./GameDefine"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  GameCardSprite = function(Base) {
    function GameCardSprite() {
      var _this = null !== Base && Base.apply(this, arguments) || this;
      _this.cardSprite = null;
      _this.prefabSparklingFx = null;
      _this.S = -1;
      _this.N = -1;
      _this.type = -1;
      _this.cardName = "";
      _this.serverCode = -1;
      _this.isFading = false;
      _this.isSelected = false;
      _this.isAllowClick = false;
      _this.isShowSelected = true;
      _this.isCardBack = true;
      _this.clickCallback = null;
      _this.firstSelectPosition = null;
      _this.sparklingFx = null;
      _this.cardSpriteAtlas = null;
      _this.cardSpriteEffect = null;
      _this.emptyCardMauBinh = null;
      _this.tempTouchEmptyCardMauBinh = null;
      _this.originalPosMauBinh = null;
      _this.indexChildMauBinh = 0;
      _this.cardSize = cc.Size.ZERO;
      _this.index = 0;
      _this.isBlackFace = false;
      _this.isInBottomMauBinh = false;
      _this.isRotationY = false;
      _this.isRotationX = false;
      _this.delayTime = 0;
      _this.rotateTime = 0;
      _this.rotaionStart = 0;
      _this.rotationByValue = 0;
      _this.countTime = 0;
      return _this;
    }
    var GameCardSpriteClass;
    __extends(GameCardSprite, Base);
    GameCardSpriteClass = GameCardSprite;
    GameCardSprite.prototype.onLoad = function() {};
    GameCardSprite.prototype.start = function() {};
    GameCardSprite.prototype.init = function(type) {
      this.gameID = GamePlayManager.default.getInstance().gameID;
      this.setType(type);
    };
    GameCardSprite.prototype.initAndHide = function(type) {
      this.gameID = GamePlayManager.default.getInstance().gameID;
      this.type = type;
      this.type = type;
      this.node.stopAllActions();
      this.cardSprite.spriteFrame = this.cardSpriteAtlas.getSpriteFrame("icCardback");
      this.isCardBack = true;
      this.node.scale = this.getScaleWithType(this.type);
    };
    GameCardSprite.prototype.setType = function(type) {
      this.type = type;
      if (this.type == GameCardSpriteType.default.TypeHIDE) {
        this.node.stopAllActions();
        this.cardSprite.spriteFrame = this.cardSpriteAtlas.getSpriteFrame("icCardback");
        this.isCardBack = true;
      }
      this.node.scale = this.getScaleWithType(this.type);
    };
    GameCardSprite.prototype.setTypeHIDENoScale = function() {
      this.type = GameCardSpriteType.default.TypeHIDE;
      this.node.stopAllActions();
      this.cardSprite.spriteFrame = this.cardSpriteAtlas.getSpriteFrame("icCardback");
      this.isCardBack = true;
    };
    GameCardSprite.prototype.getScaleWithType = function(type) {
      var scale = 1;
      switch (type === GameCardSpriteType.default.TypeBIG ? scale = .65 : type === GameCardSpriteType.default.TypeMEDIUM ? scale = .6 : type === GameCardSpriteType.default.TypeSMALL ? scale = .5 : type === GameCardSpriteType
        .default.TypeHIDE && (scale = .5), this.gameID) {
        case MessageCardGameHandler.GAME.TIENLEN:
          break;
        case MessageCardGameHandler.GAME.POKER:
          type === GameCardSpriteType.default.TypeSMALL ? scale = .62 : type === GameCardSpriteType.default.TypeHIDE && (scale = .62);
          break;
        case MessageCardGameHandler.GAME.XITO:
          type === GameCardSpriteType.default.TypeSMALL ? scale = .6 : type === GameCardSpriteType.default.TypeHIDE && (scale = .6);
          break;
        case MessageCardGameHandler.GAME.BINH:
          type === GameCardSpriteType.default.TypeBIG ? scale = 1 : type !== GameCardSpriteType.default.TypeHIDE && type !== GameCardSpriteType.default.TypeMEDIUM || (scale = .65);
          break;
        case MessageCardGameHandler.GAME.CATTE:
          type === GameCardSpriteType.default.TypeBIG ? scale = 1 : type !== GameCardSpriteType.default.TypeHIDE && type !== GameCardSpriteType.default.TypeMEDIUM || (scale = .43);
          break;
        case GameDefine.GameID.LIENG:
          type === GameCardSpriteType.default.TypeBIG ? scale = 1.5 : type === GameCardSpriteType.default.TypeMEDIUM ? scale = 1 : type === GameCardSpriteType.default.TypeSMALL ? scale = .8 : type === GameCardSpriteType.default
            .TypeHIDE && (scale = .5);
          break;
        case GameDefine.GameID.BACAY:
          type === GameCardSpriteType.default.TypeBIG ? scale = .78 : type === GameCardSpriteType.default.TypeMEDIUM && (scale = .65);
      }
      return scale;
    };
    GameCardSprite.prototype.setTextureWithCode = function(serverCode, gameID) {
      this.decodeCard(serverCode, gameID);
      var resourceName = this.getResourceName(),
        spriteFrame = this.cardSpriteAtlas.getSpriteFrame(resourceName);
      if (!(null === spriteFrame || void 0 === spriteFrame)) {
        this.cardSprite.spriteFrame = spriteFrame;
        this.isCardBack = false;
      }
    };
    GameCardSprite.prototype.setTextureWithCodeHaveCheck = function(serverCode, gameID) {
      if (serverCode >= 0) {
        this.setTextureWithCode(serverCode, gameID);
      } else {
        this.setTypeHIDENoScale();
        this.setBlackFace(true);
        this.serverCode = serverCode;
      }
    };
    GameCardSprite.prototype.setServerCode = function(serverCode) {
      this.decodeCard(serverCode);
    };
    GameCardSprite.prototype.decodeCard = function(serverCode, gameID) {
      if (void 0 === gameID) {
        gameID = -1;
      }
      this.serverCode = serverCode;
      if (-1 === gameID) {
        gameID = this.gameID;
      }
      this.S = serverCode % 4 + 1;
      this.N = Math.floor(serverCode / 4) + 1;
      if (1 === this.N && gameID != MessageCardGameHandler.GAME.LIENG) {
        this.N = 14;
      }
      if (0 === this.N && MessageCardGameHandler.GAME.LIENG) {
        this.N = 1;
      }
      if (2 === this.N && gameID !== MessageCardGameHandler.GAME.BINH && gameID !== MessageCardGameHandler.GAME.POKER && gameID !== MessageCardGameHandler.GAME.BACAY && gameID !== MessageCardGameHandler.GAME.BLACK_JACK && gameID != MessageCardGameHandler.GAME.LIENG &&
        gameID != MessageCardGameHandler.GAME.CATTE) {
        this.N = 15;
      }
    };
    GameCardSprite.prototype.encodeCard = function(gameID) {
      if (void 0 === gameID) {
        gameID = -1;
      }
      if (-1 === gameID) {
        gameID = this.gameID;
      }
      return gameID === MessageCardGameHandler.GAME.TIENLEN ? 13 * (this.S - 1) + this.N - 2 : 13 * (this.S - 1) + this.N - 1;
    };
    GameCardSprite.prototype.getResourceName = function() {
      var resourceRank = 0;
      return (resourceRank = 15 == this.N ? 2 : 14 == this.N ? 1 : this.N) > 0 ? (this.cardName = "icCard" + resourceRank.toString() + " " + this
        .getSuitInVietnamese(), "icCard" + resourceRank.toString() + this.getSuitInVietnamese()) : "icCardback";
    };
    GameCardSprite.prototype.getSuitInVietnamese = function() {
      return 1 === this.S ? "D" : 2 === this.S ? "C" : 3 === this.S ? "B" : 4 === this.S ? "A" : "-1";
    };
    GameCardSprite.prototype.getNuocInVietnamese = function() {
      return 2 === this.N ? "2" : 14 === this.N ? "A" : 13 === this.N ? "K" : 12 === this.N ? "Q" : 11 === this.N ? "J" : this.N
      .toString();
    };
    GameCardSprite.prototype.getChatInVietnamese = function() {
      return 1 === this.S ? "b\xedch" : 2 === this.S ? "chu\u1ed3n" : 3 === this.S ? "r\xf4" : 4 === this.S ? "c\u01a1" : "-1";
    };
    GameCardSprite.prototype.getCardNameCatte = function() {
      return this.serverCode >= 0 ? this.getNuocInVietnamese() + " " + this.getChatInVietnamese() : "Thi\u1ec7p";
    };
    GameCardSprite.prototype.getSuit = function() {
      return this.S;
    };
    GameCardSprite.prototype.initSparkles = function() {
      this.sparklingFx = cc.instantiate(this.prefabSparklingFx);
      this.sparklingFx.parent = this.node;
      this.sparklingFx.position = new cc.Vec2(0, 0);
      this.sparklingFx.active = false;
    };
    GameCardSprite.prototype.sparkles = function() {
      var blinkAction = cc.sequence(cc.fadeTo(.3, 150), cc.fadeTo(.3, 255));
      this.sparklingFx.runAction(cc.repeatForever(blinkAction));
    };
    GameCardSprite.prototype.stopSparkling = function() {
      if (null !== this.sparklingFx && void 0 !== this.sparklingFx) {
        if (!(true !== this.sparklingFx.active)) {
          this.sparklingFx.active = false;
        }
      }
    };
    GameCardSprite.prototype.runActionFlip = function() {
      var _this = this,
        scaleX = this.node.scaleX,
        scaleY = this.node.scaleY;
      this.node.runAction(cc.sequence(cc.scaleTo(.15, 0, scaleY), cc.callFunc(function() {
        _this.setTextureWithCode(_this.serverCode, -1);
      }), cc.scaleTo(.15, scaleX, scaleY)));
    };
    GameCardSprite.prototype.runActionFlipToHideAnim = function() {
      var _this = this,
        scaleX = this.node.scaleX,
        scaleY = this.node.scaleY;
      this.node.runAction(cc.sequence(cc.scaleTo(.15, 0, scaleY), cc.callFunc(function() {
        _this.type = GameCardSpriteType.default.TypeHIDE;
        _this.cardSprite.spriteFrame = _this.cardSpriteAtlas.getSpriteFrame("icCardback");
        _this.isCardBack = true;
      }), cc.scaleTo(.15, scaleX, scaleY)));
    };
    GameCardSprite.prototype.runActionFlipToHide = function(delay) {
      var _this = this;
      this.cardSprite.node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function() {
        _this.runActionFlipToHideAnim();
      })));
    };
    GameCardSprite.prototype.runActionFlip3D = function() {
      this.setTextureWithCode(this.serverCode, -1);
      this.node.opacity = 0;
      var backCardNode = cc.instantiate(this.node);
      backCardNode.getComponent(GameCardSpriteClass).init(GameCardSpriteType.default.TypeHIDE);
      backCardNode.parent = this.node;
      backCardNode.position = cc.Vec2.ZERO;
      backCardNode.scale = 1;
      backCardNode.runAction(cc.rotateTo(1.5, -90));
    };
    GameCardSprite.prototype.runActionFlip2 = function(delay, onDone) {
      var _this = this;
      if (void 0 === delay && (delay = 0), void 0 === onDone && (onDone = null), 0 != this.isCardBack) {
        this.isCardBack = false;
        var scale = this.node.scale,
          shrinkAction = cc.scaleTo(.15, 0, 1.2 * scale).easing(cc.easeSineInOut()),
          skewAction = cc.skewTo(.15, 10, 0).easing(cc.easeSineOut()),
          restoreScaleAction = cc.scaleTo(.15, scale, scale).easing(cc.easeSineInOut()),
          restoreSkewAction = cc.skewTo(.15, 0, 0).easing(cc.easeSineOut());
        this.node.runAction(cc.sequence(cc.delayTime(delay), cc.spawn(shrinkAction, skewAction), cc.callFunc(function() {
          _this.setTextureWithCode(_this.serverCode, -1);
        }), cc.spawn(restoreScaleAction, restoreSkewAction), cc.callFunc(function() {
          if (onDone) {
            onDone();
          }
        })));
      }
    };
    GameCardSprite.prototype.runActionFlipCloseCard2 = function(delay) {
      var _this = this;
      if (void 0 === delay && (delay = 0), !this.isCardBack) {
        var scale = this.node.scale,
          shrinkAction = cc.scaleTo(.15, 0, 1.2 * scale).easing(cc.easeSineInOut()),
          skewAction = cc.skewTo(.15, 10, 0).easing(cc.easeSineOut()),
          restoreScaleAction = cc.scaleTo(.15, scale, scale).easing(cc.easeSineInOut()),
          restoreSkewAction = cc.skewTo(.15, 0, 0).easing(cc.easeSineOut());
        this.node.runAction(cc.sequence(cc.delayTime(delay), cc.spawn(shrinkAction, skewAction), cc.callFunc(function() {
          _this.cardSprite.spriteFrame = _this.cardSpriteAtlas.getSpriteFrame("icCardback");
          _this.isCardBack = true;
        }), cc.spawn(restoreScaleAction, restoreSkewAction), cc.callFunc(function() {})));
      }
    };
    GameCardSprite.prototype.chonLaBaiTay = function() {
      XiToRequestHandler.default.getInstance().sendChonLaBaiTay(this.serverCode);
    };
    GameCardSprite.prototype.isInArray = function(cardList) {
      for (var index = 0; index < cardList.length; ++index) {
        if (cardList[index].serverCode === this.serverCode) {
          return true;
        }
      }
      return false;
    };
    GameCardSprite.prototype.Rotationby = function(delay, rotateTime, rotationByValue, isRotationY) {
      if (void 0 === isRotationY) {
        isRotationY = true;
      }
      this.node.is3DNode = true;
      this.delayTime = delay;
      this.rotateTime = rotateTime;
      this.rotationByValue = rotationByValue;
      if (isRotationY) {
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
    GameCardSprite.prototype.update = function(dt) {
      if (this.isRotationY || this.isRotationX) {
        if (this.delayTime > 0) {
          this.delayTime -= dt;
          if (this.delayTime < 0) {
            this.countTime = Math.abs(this.delayTime);
          }
        } else {
          this.countTime += dt;
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
    GameCardSprite.prototype.setColor = function(color) {
      this.cardSprite.node.color = color;
    };
    GameCardSprite.prototype.setBlackFace = function(isBlackFace) {
      if (void 0 === isBlackFace) {
        isBlackFace = true;
      }
      this.isBlackFace = isBlackFace;
      if (isBlackFace) {
        this.setColor(cc.color(130, 130, 130));
      } else {
        this.setColor(cc.color(255, 255, 255));
      }
    };
    GameCardSprite.prototype.checkTouchInThis = function(x, y) {
      return !(x > this.node.position.x + this.node.width / 2 || x < this.node.position.x - this.node.width / 2 || y > this.node.position
        .y + this.node.height / 2 || y < this.node.position.y - this.node.height / 2);
    };
    GameCardSprite.prototype.reset = function() {
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
    GameCardSprite.prototype.resetCattle = function() {
      this.serverCode = -1;
      this.N = -1;
      this.S = -1;
      this.isCardBack = true;
      this.setHighLight(false);
      this.setBlackFace(false);
      this.node.stopAllActions();
      this.node.opacity = 255;
    };
    GameCardSprite.prototype.setHighLight = function(isHighLight) {
      if (null != this.sparklingFx) {
        this.sparklingFx.active = isHighLight;
        if (isHighLight) {
          this.sparkles();
        }
      }
    };
    GameCardSprite.prototype.setScale = function(scale) {
      if (null != this.sparklingFx) {
        this.sparklingFx.scale = scale;
      }
      this.setContentSize(new cc.Size(this.cardSize.width * scale, this.cardSize.height * scale));
    };
    GameCardSprite.prototype.setContentSize = function(size) {
      this.cardSprite.node.setScale(1);
      this.node.setScale(1);
      this.node.setContentSize(size.width, size.height);
      this.cardSprite.node.setContentSize(size.width, size.height);
    };
    GameCardSprite.prototype.enableTouch = function(onDragOut, allowHorizontalDrag) {
      if (void 0 === onDragOut) {
        onDragOut = null;
      }
      if (void 0 === allowHorizontalDrag) {
        allowHorizontalDrag = false;
      }
      if (!(GamePlayManager.default.getInstance().gameID != GameDefine.GameID.LIENG && GamePlayManager.default.getInstance().gameID != GameDefine.GameID.BACAY)) {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(touchEvent) {
          if (!this.isFading) {
            if (this.node.y >= .85 * this.node.height || this.node.y <= -this.node.height / 2 || this.node.x >= .5 * this.node
              .width || this.node.x <= -this.node.width / 2) {
              if (null != onDragOut) {
                onDragOut(this);
              }
              this.fadeOut(.5);
            } else {
              this.node.y += touchEvent.getDelta().y;
              if (allowHorizontalDrag) {
                this.node.x += touchEvent.getDelta().x;
              }
            }
          }
        }.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, function(touchEvent) {
          if (!this.isFading) {
            if (this.node.y >= .85 * this.node.height || this.node.y <= -this.node.height / 2) {
              if (null != onDragOut) {
                onDragOut(this);
              }
              this.fadeOut(.5);
            } else {
              if (allowHorizontalDrag && (this.node.x >= .5 * this.node.width || this.node.x <= -this.node.width / 2)) {
                if (null != onDragOut) {
                  onDragOut(this);
                }
                this.fadeOut(.5);
              }
            }
          }
        }.bind(this));
      }
    };
    GameCardSprite.prototype.fadeOut = function(duration) {
      this.isFading = true;
      this.node.runAction(cc.sequence(cc.fadeOut(duration), cc.callFunc(function() {
        this.node.active = false;
        this.node.opacity = 255;
        this.isFading = false;
      }.bind(this))));
    };
    GameCardSprite.prototype.setClickEnabled = function(isAllowClick, isShowSelected, clickCallback) {
      if (void 0 === isShowSelected) {
        isShowSelected = true;
      }
      if (void 0 === clickCallback) {
        clickCallback = null;
      }
      this.isAllowClick = isAllowClick;
      this.clickCallback = clickCallback;
      this.isShowSelected = isShowSelected;
    };
    GameCardSprite.prototype.setCardSelected = function(isSelected, isAnimated) {
      if (void 0 === isAnimated && (isAnimated = true), !(this.isSelected == isSelected || this.isBlackFace && isSelected)) {
        if (isSelected && (this.firstSelectPosition || (this.firstSelectPosition = this.node.position)), this.isSelected = isSelected, this.node
          .stopAllActions(), isAnimated) {
          if (this.isSelected) {
            this.node.runAction(cc.moveTo(.07, this.firstSelectPosition.x, this.firstSelectPosition.y + 25));
          } else {
            this.node.runAction(cc.moveTo(.07, 0, 0));
          }
        } else {
          var targetPosition = cc.Vec2.ZERO;
          if (this.isSelected) {
            targetPosition = new cc.Vec2(0, this.firstSelectPosition.y + 25);
          }
          this.node.x = targetPosition.x;
          this.node.y = targetPosition.y;
        }
      }
    };
    GameCardSprite.prototype.getSelected = function() {
      return this.node.position.y >= 5;
    };
    GameCardSprite.prototype.onCardClicked = function(event) {
      if (0 != this.isAllowClick) {
        if (this.isShowSelected) {
          this.setCardSelected(!this.isSelected);
        }
        if (null != this.clickCallback) {
          this.clickCallback(this);
        }
      }
    };
    GameCardSprite.prototype.getData = function() {
      return {
        S: this.S,
        N: this.N,
        serverCode: this.serverCode
      };
    };
    GameCardSprite.prototype.getNSam = function() {
      return 14 == this.N ? 1 : 15 == this.N ? 2 : this.N;
    };
    __decorate([property(cc.Sprite)], GameCardSprite.prototype, "cardSprite", void 0);
    __decorate([property(cc.Prefab)], GameCardSprite.prototype, "prefabSparklingFx", void 0);
    __decorate([property(cc.Node)], GameCardSprite.prototype, "sparklingFx", void 0);
    __decorate([property(cc.SpriteAtlas)], GameCardSprite.prototype, "cardSpriteAtlas", void 0);
    __decorate([property(cc.Node)], GameCardSprite.prototype, "cardSpriteEffect", void 0);
    __decorate([property(cc.Size)], GameCardSprite.prototype, "cardSize", void 0);
    return GameCardSprite = GameCardSpriteClass = __decorate([ccclass], GameCardSprite);
  }(cc.Component);
moduleExports.default = GameCardSprite;
void 0;
