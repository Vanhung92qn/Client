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
var a = require("PoolManager"),
  s = require("StringUtil"),
  r = require("GameUtils"),
  c = require("MusicPlayer"),
  l = cc._decorator,
  h = l.ccclass,
  u = l.property,
  d = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.background = null;
      e.prefabChip = null;
      e.label = null;
      e.chip = null;
      e.container = null;
      e.atlasChip = null;
      e.money = 0;
      e.maxChip = 4;
      e.listChips = [];
      e.chipPosition = cc.Vec2.ZERO;
      e.fromPosition = cc.Vec2.ZERO;
      e.poolChipName = "poolchip";
      e.poolChip = null;
      e.ignoreFirstChip = false;
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {
      this.poolChip = a.PoolManager.getInstance().getPool(this.poolChipName);
      if (!(null != this.poolChip && void 0 != this.poolChip)) {
        this.poolChip = a.PoolManager.getInstance().addPool(this.poolChipName, new a.PoolNode());
      }
      this.chipPosition = this.chip.getPosition();
    };
    e.prototype.start = function() {};
    e.prototype.onDestroy = function() {
      if (null != this.poolChip) {
        this.poolChip.clear();
      }
    };
    e.prototype.reset = function() {
      if (null != this.poolChip) {
        this.poolChip.resetAllObjectUsing();
      }
      this.listChips = [];
      this.chip.active = true;
      this.chip.opacity = 255;
      this.node.opacity = 255;
    };
    e.prototype.initPool = function() {
      this.poolChip = a.PoolManager.getInstance().getPool(this.poolChipName);
      if (!(null != this.poolChip && void 0 != this.poolChip)) {
        this.poolChip = a.PoolManager.getInstance().addPool(this.poolChipName, new a.PoolNode());
      }
    };
    e.prototype.addFirstChipToList = function() {
      if (!this.ignoreFirstChip) {
        if (null == this.poolChip) {
          this.initPool();
        }
        var t = this.poolChip.getObject();
        if (null == t) {
          t = cc.instantiate(this.prefabChip);
          this.poolChip.addObjectUsing(t);
        }
        t.parent = this.node;
        t.opacity = 255;
        t.position = this.chipPosition;
        this.listChips.push(t);
      }
    };
    e.prototype.setMaxChip = function(t) {
      this.maxChip = t;
    };
    e.prototype.setMoney = function(t, e, i, n) {
      if (void 0 === e) {
        e = true;
      }
      if (void 0 === i) {
        i = false;
      }
      if (void 0 === n) {
        n = 0;
      }
      if (e) {
        r.runAnimationMoney(this.label, this.money, t);
      } else {
        this.label.string = s.default.formatMoneyNumber(t);
      }
      if (i) {
        this.runChipAnimation(n);
      }
      c.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_chip_moving");
      this.money = t;
    };
    e.prototype.show = function() {
      this.chip.active = true;
      this.node.active = true;
      this.node.opacity = 255;
    };
    e.prototype.hide = function() {
      this.node.active = false;
    };
    e.prototype.setFromPosition = function(t) {
      this.fromPosition = t;
    };
    e.prototype.runChipAnimation = function(t, e) {
      if (void 0 === e) {
        e = null;
      }
      if (null == this.poolChip) {
        this.initPool();
      }
      if (null == e) {
        e = this.fromPosition;
      }
      if (t > this.maxChip) {
        t = this.maxChip;
      }
      for (var i = this.chipPosition, n = 0; n < t; n++) {
        i.y = this.getChipPosY();
        var o = this.poolChip.getObject();
        if (null == o) {
          o = cc.instantiate(this.prefabChip);
          this.poolChip.addObjectUsing(o);
        }
        o.parent = this.node;
        o.active = true;
        o.opacity = 255;
        o.position = e;
        o.zIndex = this.listChips.length + 1;
        o.getComponent(cc.Sprite).spriteFrame = this.getChipSprite(s.default.getRandomInt(4));
        o.runAction(cc.sequence(cc.delayTime(.02 * n), cc.moveTo(.15, i)));
        o.setContentSize(this.chip.getContentSize());
        this.listChips.push(o);
      }
    };
    e.prototype.moveChips = function(t, e, i) {
      if (void 0 === e && (e = true), void 0 === i && (i = -1), void 0 != t && null != t) {
        if (0 == this.listChips.length) {
          this.addFirstChipToList();
        }
        if (e) {
          i = 1;
        }
        if (-1 == i) {
          i = Math.random();
        }
        if (this.listChips.length <= 3) {
          i = 1;
        }
        this.chip.active = false;
        for (this.listChips.length; this.listChips.length > 0;) {
          var n = this.listChips.pop();
          if (null != n && void 0 != n && null != n.parent) {
            var o = t.node.convertToNodeSpaceAR(n.parent.convertToWorldSpaceAR(n.position));
            n.active = true;
            n.parent = t.node;
            n.stopAllActions();
            n.setPosition(o);
            n.runAction(cc.sequence(cc.delayTime(0), cc.moveTo(1.5, t.chipPosition).easing(cc.easeExponentialInOut())));
            c.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_chip_moving");
            t.listChips.push(n);
          }
        }
        this.node.runAction(cc.sequence(cc.delayTime(.5), cc.fadeOut(.5)));
      }
    };
    e.prototype.stackChips = function(t) {
      if (void 0 === t && (t = null), this.chip.active = false, this.listChips.length > 30) {
        for (var e = this.listChips.length - 30, i = 0; i < e; i++) {
          this.listChips.pop();
        }
      }
      var n = function(e) {
          var i = o.listChips[e];
          i.active = false;
          i.setPosition(o.chipPosition);
          i.zIndex = e;
          i.stopAllActions();
          o.node.runAction(cc.sequence(cc.delayTime(.04 * e), cc.callFunc(function() {
            i.y += 4 * e;
            i.active = true;
            i.opacity = 255;
            c.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_chip_win");
            if (null != t && e == this.listChips.length - 1) {
              t();
            }
          }.bind(o))));
        },
        o = this;
      for (i = 0; i < this.listChips.length; i++) {
        n(i);
      }
      this.listChips.length;
      this.node.runAction(cc.sequence(cc.delayTime(0), cc.callFunc(function() {
        this.background.active = true;
        this.label.node.active = true;
        this.container.active = true;
        this.container.opacity = 0;
        this.container.runAction(cc.fadeIn(.4).easing(cc.easeSineOut()));
      }.bind(this))));
    };
    e.prototype.getChipPosY = function() {
      return 4 * (this.listChips.length + 1);
    };
    e.prototype.getChipSprite = function(t) {
      var e = "";
      switch (t) {
        case 0:
          e = "chipRed";
          break;
        case 1:
          e = "chipPink";
          break;
        case 2:
          e = "chipGreen";
          break;
        case 3:
          e = "chipBlue";
      }
      return "" === e ? null : this.atlasChip.getSpriteFrame(e);
    };
    e.prototype.moveChipToPlayer = function(t) {
      var e = this,
        i = this.node.convertToNodeSpaceAR(t);
      this.chip.active = false;
      for (var n = 0, o = function() {
          var t = a.listChips.pop();
          t.runAction(cc.sequence(cc.delayTime(.05 * n), cc.fadeOut(.4)));
          t.runAction(cc.sequence(cc.delayTime(.05 * n), cc.moveTo(.3, i), cc.callFunc(function() {
            t.active = false;
            t.opacity = 255;
            c.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_chip_win");
          })));
          n++;
        }, a = this; this.listChips.length > 0;) {
        o();
      }
      this.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
        e.label.node.active = false;
        e.background.active = false;
      })));
    };
    o([u(cc.Node)], e.prototype, "background", void 0);
    o([u(cc.Prefab)], e.prototype, "prefabChip", void 0);
    o([u(cc.Label)], e.prototype, "label", void 0);
    o([u(cc.Node)], e.prototype, "chip", void 0);
    o([u(cc.Node)], e.prototype, "container", void 0);
    o([u(cc.SpriteAtlas)], e.prototype, "atlasChip", void 0);
    return e = o([h], e);
  }(cc.Component);
i.default = d;
void 0;
