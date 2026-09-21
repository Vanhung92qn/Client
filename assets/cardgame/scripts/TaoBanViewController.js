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
var a = require("./CardPopupBase"),
  s = require("./BetListViewItem"),
  r = require("./GamePlayManager"),
  c = require("./MessageCardGameHandler"),
  l = require("./MusicPlayer"),
  h = require("./GameConfigManager"),
  u = require("./CommonPrefabsManager"),
  d = require("./StringUtil"),
  p = cc._decorator,
  f = p.ccclass,
  g = p.property,
  m = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.mainContent = null;
      e.itemPrefab = null;
      e.listBetItem = [];
      e.scrollView = null;
      e.edtPassword = null;
      e.checkBoxPlayer1 = null;
      e.checkBoxPlayer2 = null;
      e.checkBoxPlayer3 = null;
      e.lblMaxPlayer1 = null;
      e.lblMaxPlayer2 = null;
      e.lblMaxPlayer3 = null;
      e.btnOK = null;
      e.maxPlayer = 5;
      e.maxPlayer1 = 5;
      e.maxPlayer2 = 9;
      e.maxPlayer3 = 9;
      e.password = "";
      e.currentScrollIndex = 0;
      e.scrollVelocity = 0;
      e.previousY = 0;
      return e;
    }
    n(e, t);
    e.prototype.initUser = function() {
      var t = r.default.getInstance().gameID;
      if (t === c.GAME.TIENLEN || t === c.GAME.TLMN) {
        this.maxPlayer1 = 2;
        this.maxPlayer2 = 4;
        this.maxPlayer3 = 0;
        this.checkBoxPlayer3.node.active = false;
      } else {
        if (t === c.GAME.SAM) {
          this.maxPlayer1 = 2;
          this.maxPlayer2 = 5;
          this.maxPlayer3 = 0;
          this.checkBoxPlayer3.node.active = false;
        } else {
          if (t === c.GAME.PHOM || t === c.GAME.BINH) {
            this.maxPlayer1 = 4;
            this.maxPlayer2 = 0;
            this.maxPlayer3 = 0;
            this.checkBoxPlayer2.node.active = false;
            this.checkBoxPlayer3.node.active = false;
          } else {
            if (t === c.GAME.CATTE) {
              this.maxPlayer1 = 2;
              this.maxPlayer2 = 6;
              this.maxPlayer3 = 0;
              this.checkBoxPlayer3.node.active = false;
            } else {
              if (t === c.GAME.XITO) {
                this.maxPlayer1 = 5;
                this.maxPlayer2 = 0;
                this.maxPlayer3 = 0;
                this.checkBoxPlayer2.node.active = false;
                this.checkBoxPlayer3.node.active = false;
              } else {
                if (t === c.GAME.XOCDIA) {
                  this.maxPlayer1 = 9;
                  this.maxPlayer2 = 30;
                  this.maxPlayer3 = 0;
                  this.edtPassword.node.active = false;
                  this.checkBoxPlayer2.node.active = false;
                  this.checkBoxPlayer3.node.active = false;
                } else {
                  if (t === c.GAME.LIENG || t === c.GAME.POKER) {
                    this.maxPlayer1 = 5;
                    this.maxPlayer2 = 9;
                    this.maxPlayer3 = 0;
                    this.checkBoxPlayer3.node.active = false;
                  } else {
                    if (t === c.GAME.SICBO) {
                      this.maxPlayer1 = 9;
                      this.maxPlayer2 = 30;
                      this.maxPlayer3 = 0;
                      this.edtPassword.node.active = false;
                      this.checkBoxPlayer2.node.active = false;
                      this.checkBoxPlayer3.node.active = false;
                    } else {
                      if (t === c.GAME.BACAY) {
                        this.maxPlayer1 = 9;
                        this.maxPlayer2 = 5;
                        this.maxPlayer3 = 0;
                        this.checkBoxPlayer2.node.active = false;
                        this.checkBoxPlayer3.node.active = false;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      this.lblMaxPlayer1.string = this.maxPlayer1 + " Ng\u01b0\u1eddi";
      this.lblMaxPlayer2.string = this.maxPlayer2 + " Ng\u01b0\u1eddi";
      this.lblMaxPlayer3.string = this.maxPlayer3 + " Ng\u01b0\u1eddi";
    };
    e.prototype.btnOKPress = function() {
      if (d.default.isNullOrEmpty(this.edtPassword.string) && this.edtPassword.node.active && r.default.getInstance().gameID !== c.GAME
        .XOCDIA && r.default.getInstance().gameID !== c.GAME.POKER && r.default.getInstance().gameID !== c.GAME.LIENG && r.default
        .getInstance().gameID !== c.GAME.XITO && r.default.getInstance().gameID !== c.GAME.BACAY) {
        u.default.getInstance().showPopupMessageUtil("Ch\u01b0a nh\u1eadp m\u1eadt kh\u1ea9u b\xe0n !");
      } else if (h.default.getInstance().isShowPopupDone) {
        u.default.getInstance().showLoading();
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
        if (this.checkBoxPlayer1.isChecked) {
          this.maxPlayer = this.maxPlayer1;
        } else {
          if (this.checkBoxPlayer2.isChecked) {
            this.maxPlayer = this.maxPlayer2;
          } else {
            this.maxPlayer = this.maxPlayer3;
          }
        }
        this.password = this.edtPassword.string;
        r.default.getInstance().requestcreateRoom(r.default.getInstance().gameID, this.listBetItem[e].value, this.maxPlayer, this
          .password);
        this.onClickClose();
        this.btnOK.interactable = false;
      } else {
        this.hide();
      }
    };
    e.prototype.onClickClose = function() {
      this.hide();
    };
    e.prototype.loadData = function(t) {
      var e = this;
      this.initUser();
      for (var i = this.listBetItem.length; i < t.length; ++i) {
        var n = cc.instantiate(this.itemPrefab);
        n.parent = this.mainContent;
        var o = n.getComponent(s.default);
        this.listBetItem.push(o);
      }
      for (i = 0; i < t.length; ++i) {
        this.listBetItem[i].setText(t[i]);
      }
      for (i = t.length; i < this.listBetItem.length; ++i) {
        this.listBetItem[i].node.active = false;
      }
      this.node.runAction(cc.sequence(cc.delayTime(.1), cc.callFunc(function() {
        var i = e.currentScrollIndex = Math.floor(t.length / 2);
        e.scrollView.scrollToOffset(new cc.Vec2(120 * i, e.scrollView.getScrollOffset().y), .5, true);
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
          Math.abs(this.scrollVelocity) <= 2 && this.scrollView.stopAutoScroll();
          break;
        case cc.ScrollView.EventType.SCROLL_ENDED:
          i = Math.abs(this.scrollView.getScrollOffset().x);
          this.currentScrollIndex = Math.round(i / 120);
          this.scrollView.scrollToOffset(new cc.Vec2(120 * this.currentScrollIndex, this.scrollView.getScrollOffset().y), .2, true);
      }
      this.previousY = this.scrollView.getScrollOffset().x;
    };
    e.prototype.onClickNext = function() {
      l.default.getInstance().playEffect("Sounds/sfx_btn_bet");
      this.scrollView.stopAutoScroll();
      if (this.currentScrollIndex < this.listBetItem.length - 1) {
        this.currentScrollIndex++;
      }
      this.scrollView.scrollToOffset(new cc.Vec2(120 * this.currentScrollIndex, this.scrollView.getScrollOffset().y), .2, true);
    };
    e.prototype.onClickPrevius = function() {
      l.default.getInstance().playEffect("Sounds/sfx_btn_bet");
      this.scrollView.stopAutoScroll();
      if (this.currentScrollIndex > 0) {
        this.currentScrollIndex--;
      }
      this.scrollView.scrollToOffset(new cc.Vec2(120 * this.currentScrollIndex, this.scrollView.getScrollOffset().y), .2, true);
    };
    e.prototype.ontextChanged = function(t, e, i) {
      e.string = d.default.removeSpecialCharacter(t);
    };
    o([g(cc.Node)], e.prototype, "mainContent", void 0);
    o([g(cc.Prefab)], e.prototype, "itemPrefab", void 0);
    o([g(cc.ScrollView)], e.prototype, "scrollView", void 0);
    o([g(cc.EditBox)], e.prototype, "edtPassword", void 0);
    o([g(cc.Toggle)], e.prototype, "checkBoxPlayer1", void 0);
    o([g(cc.Toggle)], e.prototype, "checkBoxPlayer2", void 0);
    o([g(cc.Toggle)], e.prototype, "checkBoxPlayer3", void 0);
    o([g(cc.Label)], e.prototype, "lblMaxPlayer1", void 0);
    o([g(cc.Label)], e.prototype, "lblMaxPlayer2", void 0);
    o([g(cc.Label)], e.prototype, "lblMaxPlayer3", void 0);
    o([g(cc.Button)], e.prototype, "btnOK", void 0);
    return e = o([f], e);
  }(a.default);
i.default = m;
void 0;
