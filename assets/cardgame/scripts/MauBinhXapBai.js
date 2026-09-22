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
var a = require("./GameZOrder"),
  s = cc._decorator,
  r = s.ccclass,
  c = s.property,
  l = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.mauBinhController = null;
      e.currentCardSelect = null;
      e.currentCardOvelap = null;
      e.currentEmptyCard = null;
      e.touch = null;
      e.widget = null;
      e.originalX = 0;
      e.originalY = 0;
      e.isMovingCard = false;
      e.isTouchBeganInsideEmptyCard = false;
      return e;
    }
    n(e, t);
    Object.defineProperty(e.prototype, "isNewVersion", {
      get: function() {
        return this.mauBinhController.isNewXepBaiCurrenting && !this.mauBinhController.IsClickedXepXong;
      },
      enumerable: true,
      configurable: true
    });
    e.prototype.onLoad = function() {
      this.widget.target = cc.director.getScene();
    };
    e.prototype.init = function(t) {
      this.mauBinhController = t;
      this.registerEventForTouch();
    };
    e.prototype.registerEventForTouch = function() {
      var t = this;
      this.node.on(cc.Node.EventType.TOUCH_START, function(e) {
        t.onTouchStart(e);
      });
      this.node.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
        t.onTouchMove(e);
      });
      this.node.on(cc.Node.EventType.TOUCH_END, function(e) {
        t.onTouchEnd(e);
      });
      this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
        t.onTouchEnd(e);
      });
    };
    e.prototype.onTouchStart = function(t) {
      if (!this.touch && this.node.active && false !== this.mauBinhController.isPlaying) {
        this.touch = t;
        for (var e = t.getLocationX() - this.node.width / 2, i = t.getLocationY() - this.node.height / 2, n = this.mauBinhController
            ._thisPlayerView.cards.length - 1; n >= 0; n--) {
          if ((o = this.mauBinhController._thisPlayerView.cards[n]).node.getNumberOfRunningActions() <= 0 && o.checkTouchInThis(e, i)) {
            this.originalX = t.getLocationX();
            this.originalY = t.getLocationY();
            this.currentCardSelect = o;
            if (this.currentCardSelect.emptyCardMauBinh) {
              this.currentCardSelect.originalPosMauBinh = this.currentCardSelect.emptyCardMauBinh.getPosition();
            } else {
              this.currentCardSelect.originalPosMauBinh = this.currentCardSelect.node.position;
            }
            this.currentCardSelect.indexChildMauBinh = this.currentCardSelect.node.zIndex;
            return void(this.currentCardSelect.node.zIndex = a.default.TOP_MOST);
          }
        }
        for (n = this.mauBinhController.lsEmptyCard.length - 1; n >= 0; n--) {
          var o;
          if ((o = this.mauBinhController.lsEmptyCard[n]).checkTouchInThis(e, i)) {
            this.isTouchBeganInsideEmptyCard = true;
          }
        }
        this.originalX = 0;
        this.originalY = 0;
      }
    };
    e.prototype.onTouchMove = function(t) {
      if (this.node.active && this.touch && this.touch.getID === t.getID) {
        this.isMovingCard = true;
        var e = t.getLocationX() - this.node.width / 2,
          i = t.getLocationY() - this.node.height / 2;
        if (this.isNewVersion && !this.currentCardSelect.isInBottomMauBinh && this.currentCardSelect.emptyCardMauBinh && (this
            .currentCardSelect.tempTouchEmptyCardMauBinh = this.currentCardSelect.emptyCardMauBinh, this.currentCardSelect
            .emptyCardMauBinh.clearCardChild()), this.currentCardSelect) {
          this.currentCardSelect.node.position = new cc.Vec2(e, i);
          for (var n = 0; n < 13; ++n) {
            var o = this.mauBinhController._thisPlayerView.cards[n],
              a = this.mauBinhController.lsEmptyCard[n];
            if (this.isNewVersion) {
              if (a.checkTouchInThis(e, i)) {
                if (this.currentEmptyCard && a.Index == this.currentEmptyCard.Index) {
                  return;
                }
                if (this.currentEmptyCard) {
                  if (this.currentEmptyCard.Card) {
                    this.currentEmptyCard.Card.setColor(cc.Color.WHITE);
                  } else {
                    this.currentEmptyCard.setColor(cc.Color.WHITE);
                  }
                }
                this.currentEmptyCard = a;
                return void(this.currentEmptyCard.Card ? this.currentEmptyCard.Card.setColor(cc.Color.GRAY) : this.currentEmptyCard
                  .setColor(cc.Color.GRAY));
              }
            } else if (o.index !== this.currentCardSelect.index && o.checkTouchInThis(e, i) && !o.isInBottomMauBinh) {
              if (this.currentCardOvelap) {
                this.currentCardOvelap.setColor(cc.Color.WHITE);
              }
              this.currentCardOvelap = o;
              return void this.currentCardOvelap.setColor(cc.Color.GRAY);
            }
          }
          if (this.currentCardOvelap) {
            this.currentCardOvelap.setColor(cc.Color.WHITE);
            this.currentCardOvelap = null;
          }
          if (this.currentEmptyCard) {
            this.currentEmptyCard.setColor(cc.Color.WHITE);
            if (!this.currentEmptyCard.IsEmpty) {
              this.currentEmptyCard.Card.setColor(cc.Color.WHITE);
            }
            this.currentEmptyCard = null;
          }
        }
      }
    };
    e.prototype.onTouchEnd = function(t) {
      if (this.touch && this.touch.getID === t.getID && this.node.active) {
        if (this.isNewVersion) {
          this.checkMoveDoneNewVersion(t.getLocationX(), t.getLocationY());
        } else {
          this.checkMoveDoneOldVersion();
        }
        this.isMovingCard = false;
        this.touch = null;
      }
    };
    e.prototype.checkMoveDoneOldVersion = function() {
      if (this.currentCardOvelap && this.currentCardSelect) {
        this.currentCardSelect.node.position = this.currentCardOvelap.node.position;
        this.currentCardOvelap.node.runAction(cc.sequence(cc.moveTo(.1, this.mauBinhController.getPlayerCardPositionMineBig(0, this
          .currentCardSelect.index)), cc.callFunc(this.movingDone, this, this.currentCardOvelap)));
        this.currentCardOvelap.node.zIndex = a.default.TOP;
        var t = this.currentCardSelect.index;
        this.currentCardSelect.index = this.currentCardOvelap.index;
        this.currentCardOvelap.index = t;
        this.showLog();
      }
      if (this.currentCardSelect) {
        if (!this.currentCardOvelap) {
          this.currentCardSelect.node.runAction(cc.moveTo(.1, this.mauBinhController.getPlayerCardPositionMineBig(0, this
            .currentCardSelect.index)));
        }
        this.currentCardSelect.node.zIndex = a.default.MIDDLE_TOP_2 + this.currentCardSelect.index + 1;
        this.currentCardSelect = null;
      }
      if (this.currentCardOvelap) {
        this.currentCardOvelap.setColor(cc.Color.WHITE);
        this.currentCardOvelap = null;
      }
      this.mauBinhController._khongThaoTac = false;
    };
    e.prototype.checkMoveDoneNewVersion = function(t, e) {
      if (this.currentCardSelect && !this.isMovingCard && !this.currentCardSelect.isInBottomMauBinh) {
        this.mauBinhController._khongThaoTac = false;
        this.currentCardSelect.node.zIndex = a.default.MIDDLE_TOP_2;
        this.currentCardSelect = null;
        return void(this.isTouchBeganInsideEmptyCard = false);
      }
      if (this.currentEmptyCard && this.currentCardSelect) {
        if (this.currentCardSelect.node.position = this.currentEmptyCard.getPosition(), !this.currentEmptyCard.IsEmpty && this
          .currentCardSelect.tempTouchEmptyCardMauBinh) {
          var i = this.currentCardSelect.tempTouchEmptyCardMauBinh;
          (n = this.currentEmptyCard.Card).node.runAction(cc.moveTo(.1, i.getPosition()));
          n.setColor(cc.Color.WHITE);
          i.setCardChild(n);
        } else if (!this.currentEmptyCard.IsEmpty && !this.currentCardSelect.emptyCardMauBinh) {
          var n;
          (n = this.currentEmptyCard.Card).node.runAction(cc.moveTo(.1, this.currentCardSelect.originalPosMauBinh));
          n.setColor(cc.Color.WHITE);
          n.emptyCardMauBinh = null;
          n.isInBottomMauBinh = true;
          n.node.zIndex = this.currentCardSelect.indexChildMauBinh;
        }
        this.currentCardSelect.node.zIndex = a.default.MIDDLE_TOP_2;
        this.currentEmptyCard.setCardChild(this.currentCardSelect);
        if (this.mauBinhController.isShowingQuickGuide) {
          this.mauBinhController.quickGuide.onDragCardStep();
        }
        this.mauBinhController.countAnalyticSort();
      }
      if (this.currentCardSelect) {
        if (!this.currentEmptyCard) {
          var o = Math.abs(t - this.originalX),
            s = Math.abs(e - this.originalY);
          if (this.currentCardSelect.isInBottomMauBinh && o < 15 && s < 15 && 0 != this.originalX && 0 != this.originalY) {
            this.onClickCard();
          } else {
            if (this.currentCardSelect.tempTouchEmptyCardMauBinh) {
              this.currentCardSelect.tempTouchEmptyCardMauBinh.setCardChild(this.currentCardSelect);
            }
            this.currentCardSelect.node.zIndex = this.currentCardSelect.indexChildMauBinh;
            this.currentCardSelect.node.runAction(cc.moveTo(.1, this.currentCardSelect.originalPosMauBinh));
            this.currentCardSelect.tempTouchEmptyCardMauBinh = null;
            this.currentCardSelect = null;
          }
        }
      } else {
        if (!this.isTouchBeganInsideEmptyCard && this.mauBinhController.isNeedSortBottom()) {
          this.sortBottomCard();
        }
      }
      if (this.currentEmptyCard) {
        this.currentEmptyCard = null;
      }
      if (this.currentCardSelect) {
        this.currentCardSelect.tempTouchEmptyCardMauBinh = null;
        this.currentCardSelect = null;
      }
      if (this.mauBinhController.isNoEmptyCard()) {
        this.showLog(true);
      }
      this.mauBinhController._khongThaoTac = false;
      this.isTouchBeganInsideEmptyCard = false;
    };
    e.prototype.movingDone = function(t, e) {
      e.node.zIndex = a.default.MIDDLE_TOP_2 + e.index + 1;
    };
    e.prototype.showLog = function(t) {
      if (void 0 === t && (t = false), t) {
        for (var e = 0; e < this.mauBinhController.lsEmptyCardSortIndex.length; e++) {
          this.mauBinhController.lsEmptyCardSortIndex[e].Card.index = 12 - e;
        }
      }
      this.mauBinhController._thisPlayerView.cards.sort(function(t, e) {
        return t.index > e.index ? 1 : t.index < e.index ? -1 : 0;
      });
      this.mauBinhController.updateTextBinh();
      if (this.mauBinhController.remainingTime < 3) {
        this.mauBinhController.sendUpdateBai(true);
      }
    };
    e.prototype.sortBottomCard = function() {
      this.mauBinhController.sortBottomCard();
    };
    e.prototype.onClickCard = function() {
      var t = this.currentCardSelect.node,
        e = this.mauBinhController.getNextEmptyCard(0);
      this.currentCardSelect.node.runAction(cc.sequence(cc.moveTo(.1, e.getPosition()), cc.callFunc(function() {
        t.zIndex = a.default.MIDDLE_TOP_2;
      })));
      e.setCardChild(this.currentCardSelect);
      if (this.mauBinhController.isShowingQuickGuide) {
        this.mauBinhController.quickGuide.onClickCardStep();
      }
      this.mauBinhController.countAnalyticSort();
    };
    e.prototype.newSessionReset = function() {
      if (this.currentEmptyCard) {
        this.currentEmptyCard = null;
      }
      if (this.currentCardSelect) {
        this.currentCardSelect.tempTouchEmptyCardMauBinh = null;
        this.currentCardSelect = null;
      }
    };
    o([c(cc.Widget)], e.prototype, "widget", void 0);
    return e = o([r], e);
  }(cc.Component);
i.default = l;
void 0;
