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
var a = require("GameConfigManager"),
  s = require("GamePlayManager"),
  r = require("BetListViewItem"),
  c = require("CardPopupBase"),
  l = require("CommonPrefabsManager"),
  h = require("MusicPlayer"),
  u = require("StringUtil"),
  d = cc._decorator,
  p = d.ccclass,
  f = d.property,
  g = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.mainContent = null;
      e.itemPrefab = null;
      e.listBetItem = [];
      e.lblMoney = null;
      e.scrollView = null;
      e.autoBuyIn = null;
      e.password = null;
      e.btnOK = null;
      e.okCallback = null;
      e.currentScrollIndex = 0;
      e.scrollVelocity = 0;
      e.previousY = 0;
      e.isJoinRoom = false;
      return e;
    }
    n(e, t);
    e.prototype.onClickOk = function() {
      if (this.popup.stopAllActions(), this.isShowDone) {
        if (this.password.node.active && u.default.isNullOrEmpty(this.password.string)) {
          l.default.getInstance().showPopupMessageUtil("B\u1ea1n ch\u01b0a nh\u1eadp m\u1eadt kh\u1ea9u !");
        } else {
          this.scrollView.stopAutoScroll();
          var t = Math.abs(this.scrollView.getScrollOffset().x),
            e = Math.floor(t / 120),
            i = t - 120 * e;
          if (i > 60) {
            e++;
            i = 120 - i;
          } else {
            i = -i;
          }
          a.default.getInstance().moneyBuyIn = this.listBetItem[e].value;
          a.default.getInstance().autoBuyIn = this.autoBuyIn.isChecked;
          if (this.isJoinRoom) {
            this.onHandleJoinRoomAndBuyIn();
          } else {
            this.onHandleBuyIn();
          }
          if (null != this.okCallback) {
            this.okCallback(this.listBetItem[e].value);
          }
        }
      } else {
        this.hide();
      }
    };
    e.prototype.onHandleJoinRoomAndBuyIn = function() {
      var t = this.password.string;
      l.default.getInstance().showLoading();
      s.default.getInstance().joinRoomAndBuyIn(this.roomID, this.serverID, t, a.default.getInstance().moneyBuyIn);
      this.hide();
      this.btnOK.interactable = false;
    };
    e.prototype.onHandleBuyIn = function() {
      var t = this.password.string;
      l.default.getInstance().showLoading();
      s.default.getInstance().joinRoomAndBuyIn(this.roomID, this.serverID, t, a.default.getInstance().moneyBuyIn);
      this.hide();
      this.btnOK.interactable = false;
    };
    e.prototype.onClickClose = function() {
      this.hide();
    };
    e.prototype.onAddClick = function() {};
    e.prototype.onSubClick = function() {};
    e.prototype.onToggleAutoBuyin = function() {
      a.default.getInstance().autoBuyIn = this.autoBuyIn.isChecked;
    };
    e.prototype.loadData = function(t, e, i, n) {
      var o = this;
      if (void 0 === n) {
        n = false;
      }
      this.roomID = e;
      this.serverID = i;
      this.isJoinRoom = n;
      if (a.default.getInstance().autoBuyIn) {
        this.autoBuyIn.isChecked = true;
      } else {
        this.autoBuyIn.isChecked = false;
      }
      for (var s = this.listBetItem.length; s < t.length; ++s) {
        var c = cc.instantiate(this.itemPrefab);
        c.parent = this.mainContent;
        var l = c.getComponent(r.default);
        this.listBetItem.push(l);
      }
      for (s = 0; s < t.length; ++s) {
        this.listBetItem[s].setText(t[s]);
      }
      for (s = t.length; s < this.listBetItem.length; ++s) {
        this.listBetItem[s].node.active = false;
      }
      this.node.runAction(cc.sequence(cc.delayTime(.1), cc.callFunc(function() {
        var e = o.currentScrollIndex = Math.floor(t.length / 2);
        o.scrollView.scrollToOffset(new cc.Vec2(120 * e, o.scrollView.getScrollOffset().y), .5, true);
      })));
    };
    e.prototype.callback = function(t, e) {
      switch (e) {
        case cc.ScrollView.EventType.SCROLLING:
          this.scrollVelocity = this.scrollView.getScrollOffset().x - this.previousY;
          var i = Math.abs(this.scrollView.getScrollOffset().x);
          this.currentScrollIndex = Math.floor(i / 120);
          var n = i - 120 * this.currentScrollIndex;
          n > 60 ? (this.currentScrollIndex++, n = 120 - n) : n = -n;
          for (var o = 0; o < this.listBetItem.length; ++o) {
            var a = this.listBetItem[o],
              s = Math.abs(i - 120 * o),
              r = .2 * (s /= 120),
              c = 64 * s;
            a.node.scale = 1 - r;
            a.node.opacity = 255 - c;
          }
          Math.abs(this.scrollVelocity) <= 5 && this.scrollView.stopAutoScroll();
          break;
        case cc.ScrollView.EventType.SCROLL_ENDED:
          i = Math.abs(this.scrollView.getScrollOffset().x);
          this.currentScrollIndex = Math.round(i / 120);
          this.scrollView.scrollToOffset(new cc.Vec2(120 * this.currentScrollIndex, this.scrollView.getScrollOffset().y), .2, true);
      }
      this.previousY = this.scrollView.getScrollOffset().x;
    };
    e.prototype.onClickNext = function() {
      h.default.getInstance().playEffect("Sounds/sfx_btn_bet");
      this.scrollView.stopAutoScroll();
      if (this.currentScrollIndex < this.listBetItem.length - 1) {
        this.currentScrollIndex++;
      }
      this.scrollView.scrollToOffset(new cc.Vec2(120 * this.currentScrollIndex, this.scrollView.getScrollOffset().y), .2, true);
    };
    e.prototype.onClickPrevius = function() {
      h.default.getInstance().playEffect("Sounds/sfx_btn_bet");
      this.scrollView.stopAutoScroll();
      if (this.currentScrollIndex > 0) {
        this.currentScrollIndex--;
      }
      this.scrollView.scrollToOffset(new cc.Vec2(120 * this.currentScrollIndex, this.scrollView.getScrollOffset().y), .2, true);
    };
    e.prototype.onClickTouchDoNothing = function() {};
    e.prototype.getID = function() {
      return c.EPopupID.POPUP_BUY_IN;
    };
    e.prototype.ontextChanged = function(t, e, i) {
      e.string = u.default.removeSpecialCharacter(t);
    };
    o([f(cc.Node)], e.prototype, "mainContent", void 0);
    o([f(cc.Prefab)], e.prototype, "itemPrefab", void 0);
    o([f(cc.Label)], e.prototype, "lblMoney", void 0);
    o([f(cc.ScrollView)], e.prototype, "scrollView", void 0);
    o([f(cc.Toggle)], e.prototype, "autoBuyIn", void 0);
    o([f(cc.EditBox)], e.prototype, "password", void 0);
    o([f(cc.Button)], e.prototype, "btnOK", void 0);
    return e = o([p], e);
  }(c.default);
i.default = g;
void 0;
