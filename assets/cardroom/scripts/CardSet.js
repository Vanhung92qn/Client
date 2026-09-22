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
var a = require("GameCardSprite"),
  s = require("PoolManager"),
  r = require("GamePlayManager"),
  c = require("GameUtils"),
  l = require("MusicPlayer"),
  h = cc._decorator,
  u = h.ccclass,
  d = h.property,
  p = function(t) {
    function e() {
      var e = t.call(this) || this;
      e.layout = null;
      e.prefabCard = null;
      e.flipIndex = -1;
      e.listCardNodes = [];
      e.poolGameCardName = "poolgamecardcardset";
      e.poolGameCard = null;
      e.isSelectOneCard = false;
      e.scaleDefault = 1;
      e.isUseScaleDefault = false;
      e.callbackCardSelected = null;
      e.callbackCardSetReady = null;
      e.initPool();
      return e;
    }
    var i;
    n(e, t);
    i = e;
    e.prototype.start = function() {};
    e.prototype.initPool = function() {
      i.CardSetIndex++;
      if (null == this.poolGameCard) {
        this.poolGameCard = s.PoolManager.getInstance().addPool(this.poolGameCardName + i.CardSetIndex.toString(), new s.PoolComponent());
      }
    };
    e.prototype.reset = function() {
      this.flipIndex = 0;
      for (var t = 0; t < this.listCardNodes.length; t++) {
        if (null != this.listCardNodes[t].node) {
          this.listCardNodes[t].node.parent = null;
        }
      }
      if (this.listCardNodes = [], null != this.poolGameCard) {
        this.poolGameCard.resetAllObjectUsing();
        for (t = 0; t < this.poolGameCard.listObjectFree.length; t++) {
          if (null != this.poolGameCard.listObjectFree[t] && void 0 != this.poolGameCard.listObjectFree[t]) {
            var e = this.poolGameCard.listObjectFree[t];
            e.reset();
            e.node.stopAllActions();
            e.node.parent = null;
          }
        }
      }
      this.node.stopAllActions();
      this.setScaleDefault(1);
      this.layout.updateLayout();
    };
    e.prototype.onDestroy = function() {
      this.poolGameCard.resetAllObjectUsing();
      this.poolGameCard.clear();
    };
    e.prototype.setScaleDefault = function(t, e) {
      if (void 0 === e) {
        e = false;
      }
      this.scaleDefault = t;
      this.isUseScaleDefault = e;
    };
    e.prototype.setHighLightCards = function(t) {
      if (void 0 != t && null != t && 0 != t.length) {
        for (var e = 0; e < this.listCardNodes.length; e++) {
          for (var i = 0; i < t.length; i++) {
            if (t[i] == this.listCardNodes[e].serverCode) {
              this.listCardNodes[e].setHighLight(true);
            }
          }
        }
      }
    };
    e.prototype.getListCardsForCache = function() {
      for (var t = [], e = 0; e < this.listCardNodes.length; e++) {
        this.listCardNodes[e].node.active = false;
        t.push(this.listCardNodes[e]);
      }
      this.listCardNodes = [];
      return t;
    };
    e.prototype.clearAll = function() {
      for (var t = 0; t < this.listCardNodes.length; t++) {
        if (null != this.listCardNodes[t].node) {
          this.listCardNodes[t].node.destroy();
        }
      }
      this.listCardNodes = [];
    };
    e.prototype.setCardSelectedCallback = function(t) {
      this.callbackCardSelected = t;
    };
    e.prototype.setListCardNumber = function(t) {
      var e = t.length;
      e = e > this.listCardNodes.length ? this.listCardNodes.length : e;
      for (var i = 0; i < e; i++) {
        var n = this.listCardNodes[i].node.getContentSize();
        this.listCardNodes[i].setTextureWithCode(t[i], r.default.getInstance().gameID);
        this.listCardNodes[i].setContentSize(n);
      }
    };
    e.prototype.setListCardSelected = function(t) {
      if (!(0 != t.length && void 0 != t)) {
        this.reset;
      }
      for (var e = t.slice(0), i = 0; i < this.listCardNodes.length; i++) {
        this.listCardNodes[i].node.stopAllActions();
        this.listCardNodes[i].setCardSelected(false);
        for (var n = 0; n < e.length; n++) {
          if (this.listCardNodes[i].serverCode == e[n]) {
            this.listCardNodes[i].setCardSelected(true);
            e.splice(n, 1);
            break;
          }
        }
      }
      this.layout.updateLayout();
    };
    e.prototype.setListCards = function(t, e, i, n) {
      if (void 0 === e) {
        e = false;
      }
      if (void 0 === i) {
        i = null;
      }
      if (void 0 === n) {
        n = false;
      }
      if (e) {
        this.reset();
      }
      for (var o = 0; o < t.length; o++) {
        var s = t[o],
          c = this.poolGameCard.getObject();
        if (null == c) {
          c = cc.instantiate(this.prefabCard).getComponent(a.default);
          this.poolGameCard.addObjectUsing(c);
        }
        c.node.opacity = 255;
        c.node.active = true;
        c.node.parent = this.node;
        c.node.position = cc.Vec2.ZERO;
        c.node.zIndex = o;
        if (-1 != s) {
          if (false === n) {
            c.setTextureWithCode(s, r.default.getInstance().gameID);
          }
        } else {
          c.reset();
        }
        if (null != i) {
          c.setScale(i);
        }
        this.listCardNodes.push(c);
      }
      this.layout.enabled = true;
      this.layout.updateLayout();
    };
    e.prototype.setBlackFace = function(t) {
      for (var e = 0; e < this.listCardNodes.length; e++) {
        if (t) {
          this.listCardNodes[e].setBlackFace(true);
        } else {
          this.listCardNodes[e].setBlackFace(false);
        }
      }
    };
    e.prototype.addCard = function(t, e, i) {
      if (void 0 === e) {
        e = false;
      }
      if (void 0 === i) {
        i = false;
      }
      var n = t.node.getPosition(),
        o = cc.Vec2.ZERO;
      if (null != t.node.parent) {
        n = this.node.convertToNodeSpaceAR(t.node.parent.convertToWorldSpaceAR(n));
      }
      t.node.getContentSize();
      t.node.parent = this.node;
      if (this.isUseScaleDefault) {
        t.setScale(this.scaleDefault);
      }
      t.node.position = cc.Vec2.ZERO;
      t.setClickEnabled(e, this.cardClickCallback.bind(this));
      this.layout.updateLayout();
      this.layout.enabled = false;
      o = t.node.position;
      t.node.position = n;
      if (this.listCardNodes.length > 0) {
        t.node.zIndex = this.listCardNodes[this.listCardNodes.length - 1].node.zIndex + 1;
      } else {
        t.node.zIndex = this.listCardNodes.length + 1;
      }
      t.node.runAction(cc.sequence(cc.moveTo(.4, o).easing(cc.easeExponentialOut()), cc.callFunc(function() {
        this.layout.enabled = true;
        if (i) {
          this.sortCardWithAnimation();
        }
      }.bind(this))));
      this.listCardNodes.push(t);
    };
    e.prototype.sortCardWithAnimation = function() {
      this.sortCard(c.sortListCards(this.getListCardID()));
    };
    e.prototype.setListCardWithAnimation = function(t, e, i, n, o) {
      if (void 0 === e) {
        e = null;
      }
      if (void 0 === i) {
        i = null;
      }
      if (void 0 === n) {
        n = .15;
      }
      if (void 0 === o) {
        o = false;
      }
      for (var s = [], c = 0; c < t.length; c++) {
        var l = t[c];
        if (null == (h = this.poolGameCard.getObject())) {
          h = cc.instantiate(this.prefabCard).getComponent(a.default);
          this.poolGameCard.addObjectUsing(h);
        }
        h.node.stopAllActions();
        h.node.active = true;
        h.node.opacity = 255;
        h.node.zIndex = c;
        h.node.setParent(this.node);
        if (false === o) {
          h.setTextureWithCode(l, r.default.getInstance().gameID);
        }
        h.setScale(this.scaleDefault);
        if (i == h.serverCode) {
          h.setHighLight(true);
        }
        if (null != e) {
          s.push(this.node.convertToNodeSpaceAR(e));
        } else {
          s.push(h.node.position);
        }
        h.node.position = cc.Vec2.ZERO;
        this.listCardNodes.push(h);
      }
      this.layout.updateLayout();
      this.layout.enabled = false;
      for (c = 0; c < this.listCardNodes.length; c++) {
        var h;
        if (void 0 != (h = this.listCardNodes[c])) {
          var u = h.node.position;
          h.node.position = s[c];
          h.node.runAction(cc.moveTo(n, u).easing(cc.easeExponentialOut()));
        }
      }
      this.node.runAction(cc.sequence(cc.delayTime(n + .2), cc.callFunc(function() {
        this.layout.enabled = true;
      }.bind(this))));
    };
    e.prototype.setListGameCard = function(t, e, i, n, o, a) {
      if (void 0 === e) {
        e = false;
      }
      if (void 0 === i) {
        i = .1;
      }
      if (void 0 === n) {
        n = .4;
      }
      if (void 0 === o) {
        o = false;
      }
      if (void 0 === a) {
        a = false;
      }
      if (e) {
        this.clearAll();
      }
      for (var s = [], r = function(e) {
          var n = t[e],
            a = n.node.parent,
            r = n.node.getPosition();
          if (null != a) {
            r = c.node.convertToNodeSpaceAR(a.convertToWorldSpaceAR(r));
          }
          s.push(r);
          var l = n.node.scale;
          n.node.stopAllActions();
          n.node.parent = c.node;
          n.node.position = cc.Vec2.ZERO;
          if (c.isUseScaleDefault) {
            n.setScale(c.scaleDefault);
          } else {
            n.setScale(l);
          }
          c.listCardNodes.push(n);
          if (o) {
            n.node.opacity = 0;
            n.node.runAction(cc.sequence(cc.delayTime(i * e), cc.callFunc(function() {
              n.node.opacity = 255;
            })));
          } else {
            n.node.active = true;
            n.node.opacity = 255;
          }
        }, c = this, h = 0; h < t.length; h++) {
        r(h);
      }
      this.layout.enabled = true;
      this.layout.updateLayout();
      this.layout.enabled = false;
      var u = [];
      for (h = 0; h < t.length; h++) {
        var d = t[h];
        u.push(new cc.Vec2(d.node.position.x, d.node.position.y));
        d.node.setPosition(s[h]);
        d.node.zIndex = h;
      }
      for (h = 0; h < t.length; h++) {
        (d = t[h]).node.runAction(cc.sequence(cc.delayTime(i * h), cc.moveTo(n, u[h]).easing(cc.easeExponentialOut()), cc.callFunc(
          function() {
            if (a) {
              l.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_card_distribution");
            }
          }.bind(this))));
      }
      this.node.runAction(cc.sequence(cc.delayTime(t.length * i + n + 1), cc.callFunc(function() {
        this.layout.enabled = true;
        if (null != this.callbackCardSetReady) {
          this.callbackCardSetReady();
        }
      }.bind(this))));
    };
    e.prototype.resetCardState = function(t) {
      if (void 0 === t) {
        t = false;
      }
      for (var e = 0; e < this.listCardNodes.length; e++) {
        var i = this.listCardNodes[e];
        i.setCardSelected(false);
        if (t) {
          i.setHighLight(false);
        }
      }
    };
    e.prototype.cardClickCallback = function(t) {
      if (this.isSelectOneCard && t.isSelected) {
        for (var e = 0; e < this.listCardNodes.length; e++) {
          var i = this.listCardNodes[e];
          if (i.serverCode != t.serverCode) {
            i.setCardSelected(false);
          }
        }
      }
      if (null != this.callbackCardSelected) {
        this.callbackCardSelected(t);
      }
    };
    e.prototype.setCardClick = function(t, e) {
      if (void 0 === e) {
        e = null;
      }
      if (null != e) {
        this.callbackCardSelected = e;
      }
      for (var i = 0; i < this.listCardNodes.length; i++) {
        this.listCardNodes[i].setClickEnabled(t, true, this.cardClickCallback.bind(this));
      }
    };
    e.prototype.setCardScale = function(t) {
      this.setScaleDefault(t);
      for (var e = 0; e < this.listCardNodes.length; e++) {
        this.listCardNodes[e].setScale(t);
      }
      this.layout.updateLayout();
    };
    e.prototype.setSpaceX = function(t) {
      this.layout.spacingX = t;
      this.layout.updateLayout();
    };
    e.prototype.getCardSelected = function() {
      for (var t = 0; t < this.listCardNodes.length; t++) {
        if (this.listCardNodes[t].isSelected) {
          return this.listCardNodes[t].serverCode;
        }
      }
      return null;
    };
    e.prototype.getListCardIDSelected = function() {
      for (var t = [], e = 0; e < this.listCardNodes.length; e++) {
        if (this.listCardNodes[e].getSelected()) {
          t.push(this.listCardNodes[e].serverCode);
        }
      }
      return t;
    };
    e.prototype.getListCardSelected = function() {
      for (var t = [], e = 0; e < this.listCardNodes.length; e++) {
        if (this.listCardNodes[e].isSelected) {
          t.push(this.listCardNodes[e]);
        }
      }
      return t;
    };
    e.prototype.getListCardID = function() {
      for (var t = [], e = 0; e < this.listCardNodes.length; e++) {
        t.push(this.listCardNodes[e].serverCode);
      }
      return t;
    };
    e.prototype.getListCardObject = function(t, e) {
      if (void 0 === e) {
        e = true;
      }
      for (var i = [], n = 0; n < t.length; n++) {
        for (var o = 0; o < this.listCardNodes.length; o++) {
          var a = this.listCardNodes[o];
          if (a.serverCode == t[n]) {
            i.push(a);
            if (e) {
              t.splice(n, 1);
              this.listCardNodes.splice(o, 1);
              n--;
            }
            break;
          }
        }
      }
      return i;
    };
    e.prototype.getCardAndRemove = function(t) {
      for (var e = null, i = 0; i < this.listCardNodes.length; i++) {
        if (this.listCardNodes[i].serverCode == t) {
          e = this.listCardNodes[i];
          this.listCardNodes.splice(i, 1);
          break;
        }
        if (-1 == this.listCardNodes[i].serverCode) {
          e = this.listCardNodes[i];
        }
      }
      return e;
    };
    e.prototype.setOpacityAll = function(t, e) {
      if (void 0 === e) {
        e = true;
      }
      for (var i = 0; i < this.listCardNodes.length; i++) {
        if (null != this.listCardNodes[i].node) {
          this.listCardNodes[i].node.opacity = t;
          this.listCardNodes[i].node.active = e;
        }
      }
    };
    e.prototype.getCard = function(t) {
      for (var e = 0; e < this.listCardNodes.length; e++) {
        if (this.listCardNodes[e].serverCode == t) {
          return this.listCardNodes[e];
        }
      }
      return null;
    };
    e.prototype.sortCard = function(t) {
      for (var e = true, i = 0; i < t.length; i++) {
        if (c.getCardNumber(t[i]) != c.getCardNumber(this.listCardNodes[i].serverCode)) {
          e = false;
          break;
        }
      }
      if (!e) {
        var n = [];
        for (i = 0; i < this.listCardNodes.length; i++) {
          if (null != (s = this.listCardNodes[i]) && void 0 != s) {
            for (var o = 0; o < t.length; o++) {
              if (!(o >= this.listCardNodes.length) && s.serverCode == t[o]) {
                s.node.zIndex = o;
                var a = this.listCardNodes[o].node.position;
                a.y = s.node.position.y;
                n.push(a);
                break;
              }
            }
          }
        }
        for (i = 0; i < this.listCardNodes.length; i++) {
          var s;
          (s = this.listCardNodes[i]).node.runAction(cc.moveTo(.15, n[i]));
        }
        this.layout.enabled = false;
        this.node.runAction(cc.sequence(cc.delayTime(.2), cc.callFunc(function() {
          var t;
          this.layout.enabled = true;
          for (var e = 0; e < this.listCardNodes.length; e++) {
            this.listCardNodes[e].isAllowClick = true;
            for (var i = e + 1; i < this.listCardNodes.length; i++) {
              if (this.listCardNodes[e].node.zIndex > this.listCardNodes[i].node.zIndex) {
                t = [this.listCardNodes[i], this.listCardNodes[e]];
                this.listCardNodes[e] = t[0];
                this.listCardNodes[i] = t[1];
              }
            }
          }
        }.bind(this))));
      }
    };
    e.prototype.flipCard = function(t) {
      if (this.flipIndex++, !(this.flipIndex >= this.listCardNodes.length)) {
        var e = this.listCardNodes[this.flipIndex],
          i = e.node.getContentSize();
        e.setTextureWithCode(t, r.default.getInstance().gameID);
        e.setContentSize(i);
      }
    };
    e.prototype.setVerticalLayout = function() {
      this.layout.type = cc.Layout.Type.VERTICAL;
      this.layout.spacingY = -70;
      for (var t = 0; t < this.listCardNodes.length; t++) {
        this.listCardNodes[t].node.position = cc.Vec2.ZERO;
      }
    };
    e.prototype.setHorizontalLayout = function() {
      this.layout.type = cc.Layout.Type.HORIZONTAL;
      for (var t = 0; t < this.listCardNodes.length; t++) {
        this.listCardNodes[t].node.position = cc.Vec2.ZERO;
      }
    };
    e.CardSetIndex = 0;
    o([d(cc.Layout)], e.prototype, "layout", void 0);
    o([d(cc.Prefab)], e.prototype, "prefabCard", void 0);
    return e = i = o([u], e);
  }(cc.Component);
i.default = p;
void 0;
