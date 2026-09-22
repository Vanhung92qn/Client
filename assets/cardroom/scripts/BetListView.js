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
  s = require("BetListViewItem"),
  r = require("MusicPlayer"),
  c = cc._decorator,
  l = c.ccclass,
  h = c.property,
  u = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.mainContent = null;
      e.itemPrefab = null;
      e.listBetItem = [];
      e.scrollView = null;
      e.itemHeight = 0;
      e.currentValue = 0;
      e.currentIndex = 0;
      e.previousY = 0;
      e.expectIndex = -1;
      e.isMoveUp = false;
      e.isEndScroll = false;
      e.poolBetItemName = "poolBetItem";
      e.poolBetItem = null;
      e.scrollVelocity = 0;
      e.isAllowScroll = false;
      e.onValueChange = function(t) {};
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {};
    e.prototype.onDestroy = function() {
      if (null !== this.poolBetItem && void 0 !== this.poolBetItem) {
        this.poolBetItem.clear();
      }
    };
    e.prototype.reset = function() {
      for (var t = 0; t < this.listBetItem.length; t++) {
        this.listBetItem[t].node.removeFromParent();
      }
      if (null != this.poolBetItem) {
        this.poolBetItem.resetAllObjectUsing();
      }
      this.listBetItem = [];
      this.currentIndex = 0;
      this.currentValue = 0;
    };
    e.prototype.callback = function(t, e) {
      switch (e) {
        case cc.ScrollView.EventType.SCROLL_ENDED:
          -1 != this.expectIndex && (this.scrollView.stopAutoScroll(), this.scrollToIndex(this.expectIndex), this.expectIndex = -1);
          0 == this.isEndScroll && (this.scrollVelocity = 0, this.isEndScroll = true, this.isAllowScroll = false, this.scrollView
            .inertia = true, this.scrollToIndex(Math.round(this.scrollView.getScrollOffset().y / this.itemHeight)));
          break;
        case cc.ScrollView.EventType.SCROLL_BEGAN:
          this.isAllowScroll = true;
          this.isEndScroll = false;
          break;
        case cc.ScrollView.EventType.SCROLLING:
          this.isAllowScroll && (this.scrollVelocity = this.scrollView.getScrollOffset().y - this.previousY, Math.abs(this
            .scrollVelocity) <= 7 && this.scrollView.stopAutoScroll());
      }
      this.previousY = this.scrollView.getScrollOffset().y;
    };
    e.prototype.loadData = function(t) {
      if (null == this.poolBetItem && (this.poolBetItem = a.PoolManager.getInstance().addPool(this.poolBetItemName, new a
        .PoolComponent())), 0 != t.length && 0 !== t[t.length - 1]) {
        this.reset();
        t.unshift(-1, -1);
        t.push(-1, -1);
        for (var e = 0; e < t.length; ++e) {
          var i = this.poolBetItem.getObject();
          if (null == i) {
            i = cc.instantiate(this.itemPrefab).getComponent(s.default);
            this.poolBetItem.addObjectUsing(i);
          }
          this.itemHeight = i.node.height;
          i.node.parent = this.mainContent;
          i.setText(t[e]);
          this.listBetItem.push(i);
        }
        this.show();
      }
    };
    e.prototype.show = function() {
      this.node.active = true;
      this.node.runAction(cc.sequence(cc.delayTime(.1), cc.callFunc(function() {
        this.expectIndex = Math.floor((this.listBetItem.length - 4) / 2);
        this.scrollToIndex(this.expectIndex);
      }.bind(this))));
    };
    e.prototype.hide = function() {
      this.node.active = false;
      this.reset();
    };
    e.prototype.scrollToIndex = function(t) {
      if (t >= this.listBetItem.length) {
        t = this.listBetItem.length - 1;
      } else {
        if (t < 0) {
          t = 0;
        }
      }
      this.scrollView.scrollToOffset(new cc.Vec2(this.scrollView.getScrollOffset().x, t * this.itemHeight), .3, true);
      this.updateValue(t + 2);
    };
    e.prototype.updateValue = function(t) {
      this.currentIndex = t;
      if (t >= this.listBetItem.length) {
        t = this.listBetItem.length - 1;
      } else {
        if (t < 0) {
          t = 0;
        }
      }
      this.currentValue = this.listBetItem[t].value;
      this.onValueChange(this.currentValue);
    };
    e.prototype.onClickAllIn = function() {
      r.default.getInstance().playEffect("Sounds/gameto/sfx_gameto_all_in");
      this.scrollView.scrollToOffset(new cc.Vec2(this.scrollView.getScrollOffset().x, this.scrollView.content.height), .5, true);
      this.updateValue(this.listBetItem.length - 3);
    };
    o([h(cc.Node)], e.prototype, "mainContent", void 0);
    o([h(cc.Prefab)], e.prototype, "itemPrefab", void 0);
    o([h(cc.ScrollView)], e.prototype, "scrollView", void 0);
    return e = o([l], e);
  }(cc.Component);
i.default = u;
void 0;
