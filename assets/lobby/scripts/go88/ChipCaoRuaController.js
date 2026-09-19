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
var a = t("./ChipCaoRua"),
  s = cc._decorator,
  r = s.ccclass,
  c = s.property,
  l = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.chipParent = null;
      e.positionChipOnTable = null;
      e.listPrefabChip = [];
      e.listPosUser = [];
      e.listChip = [];
      e.listChipOnTable = [];
      e.contendSizeChipOnTable = cc.v2(350, 130);
      return e;
    }
    n(e, t);
    e.prototype.start = function() {
      this.createChipDefault();
    };
    e.prototype.ClearAllChipInTable = function() {
      for (var t = 0; t < this.listChipOnTable.length; t++) {
        this.listChipOnTable[t].node.stopAllActions();
        this.listChipOnTable[t].node.active = false;
      }
      if (this.listChipOnTable = [], this.chipParent.childrenCount > 0) {
        var e = this.chipParent.children;
        for (t = 0; t < e.length; t++) {
          e[t].stopAllActions();
          e[t].active = false;
        }
      }
    };
    e.prototype.setListPositionOfUser = function(t) {
      this.listPosUser = t;
    };
    e.prototype.BetForAllUser = function(t, e) {
      for (var i = this.getListPriceWithPrice(e), n = 0; n < t.length; n++) {
        for (var o = 0; o < i.length; o++) {
          var a = .4 * Math.random();
          this.betForUser(t[n].node.position, a, i[o]);
        }
      }
    };
    e.prototype.BetForUserReconect = function(t, e) {
      for (var i = this.getListPriceWithPrice(e), n = 0; n < t; n++) {
        for (var o = 0; o < i.length; o++) {
          this.betForUserReconnect(i[o]);
        }
      }
    };
    e.prototype.GetChipForUser = function() {
      this.getChipForUser();
    };
    e.prototype.createChipDefault = function() {
      for (var t = 0; t < 10; t++) {
        var e = this.createNewChip(1e3);
        this.listChip.push(e);
      }
    };
    e.prototype.getIndexChipOnPool = function(t) {
      for (var e = 0; e < this.listChip.length; e++) {
        if (null != this.listChip[e].node && void 0 != this.listChip[e].node && 0 == this.listChip[e].node.active && this.listChip[e]
          .GetPrice() == t) {
          return e;
        }
      }
      return -1;
    };
    e.prototype.createNewChip = function(t) {
      var e = this.getIndexChipInListWithPrice(t),
        i = cc.instantiate(this.listPrefabChip[e]).getComponent(a.default);
      i.node.active = false;
      i.node.parent = this.chipParent;
      i.node.position = cc.v2(0, 0);
      i.SetPrice(t);
      return i;
    };
    e.prototype.sortToStack = function() {
      for (var t = 0, e = 0; e < this.listChipOnTable.length; e++) {
        this.listChipOnTable[e].node.stopAllActions();
        this.listChipOnTable[e].node.runAction(cc.moveTo(.15, cc.v2(this.positionChipOnTable.position.x, this.positionChipOnTable.position
          .y + t)));
        t += 5;
      }
    };
    e.prototype.betForUser = function(t, e, i) {
      if (void 0 === e) {
        e = 0;
      }
      var n = this.getIndexChipOnPool(i),
        o = null;
      if (n < 0 || void 0 == n || null == n) {
        o = this.createNewChip(i);
        this.listChip.push(o);
      } else {
        o = this.listChip[n];
      }
      o.node.position = t;
      o.node.active = true;
      o.node.stopAllActions();
      o.node.runAction(cc.sequence(cc.delayTime(e), cc.moveTo(.7, cc.v2(this.positionChipOnTable.position.x + Math.random() * this
        .contendSizeChipOnTable.x - this.contendSizeChipOnTable.x / 2, this.positionChipOnTable.position.y + Math.random() * this
        .contendSizeChipOnTable.y)).easing(cc.easeExponentialOut()), cc.callFunc(function() {})));
      this.listChipOnTable.push(o);
    };
    e.prototype.betForUserReconnect = function(t) {
      var e = this.getIndexChipOnPool(t),
        i = null;
      if (e < 0 || void 0 == e || null == e) {
        i = this.createNewChip(t);
        this.listChip.push(i);
      } else {
        i = this.listChip[e];
      }
      i.node.position = cc.v2(this.positionChipOnTable.position.x + 250 * Math.random() - 125, this.positionChipOnTable.position.y + 110 *
        Math.random());
      i.node.active = true;
      this.listChipOnTable.push(i);
    };
    e.prototype.getChipForUser = function(t) {
      var e = this;
      if (void 0 === t) {
        t = .6;
      }
      var i = 0;
      if (this.listChipOnTable.length > 25) {
        t = .2;
      }
      for (var n = function(n) {
          o.listChipOnTable[n].node.stopAllActions();
          o.listChipOnTable[n].node.runAction(cc.sequence(cc.delayTime(t), cc.moveTo(.7, o.listPosUser[i]).easing(cc
          .easeCubicActionIn()), cc.callFunc(function() {
            e.listChipOnTable[n].node.active = false;
            if (0 == n) {
              e.ClearAllChipInTable();
            }
          })));
          if (++i >= o.listPosUser.length) {
            i = 0;
          }
          if (o.listChipOnTable.length < 25) {
            t += .05;
          } else {
            t += .01;
          }
        }, o = this, a = this.listChipOnTable.length - 1; a >= 0; a--) {
        n(a);
      }
    };
    e.prototype.getListPriceWithPrice = function(t) {
      var e = [];
      if (100 == t) {
        e.push(100);
      } else {
        if (500 == t) {
          e.push(500);
        } else {
          if (1e3 == t) {
            e.push(500);
            e.push(500);
          } else {
            if (2e3 == t) {
              e.push(100);
              e.push(500);
              e.push(500);
            } else {
              if (5e3 == t) {
                e.push(500);
                e.push(500);
                e.push(500);
                e.push(500);
                e.push(500);
              } else {
                if (1e4 == t) {
                  e.push(5e3);
                  e.push(1e3);
                  e.push(1e3);
                  e.push(1e3);
                  e.push(1e3);
                  e.push(1e3);
                } else {
                  if (2e4 == t) {
                    e.push(1e4);
                    e.push(5e3);
                    e.push(1e3);
                    e.push(1e3);
                    e.push(1e3);
                    e.push(1e3);
                    e.push(1e3);
                  } else {
                    if (5e4 == t) {
                      e.push(1e4);
                      e.push(1e4);
                      e.push(1e4);
                      e.push(5e3);
                      e.push(5e3);
                      e.push(5e3);
                      e.push(5e3);
                    }
                  }
                }
              }
            }
          }
        }
      }
      return e;
    };
    e.prototype.getIndexChipInListWithPrice = function(t) {
      return 100 == t ? 0 : 500 == t ? 1 : 1e3 == t ? 2 : 5e3 == t ? 3 : 1e4 == t ? 4 : 5e4 == t ? 5 : 1e5 == t ? 6 : 5e5 == t ? 7 :
        1e6 == t ? 8 : 0;
    };
    o([c(cc.Node)], e.prototype, "chipParent", void 0);
    o([c(cc.Node)], e.prototype, "positionChipOnTable", void 0);
    o([c(cc.Prefab)], e.prototype, "listPrefabChip", void 0);
    return e = o([r], e);
  }(cc.Component);
i.default = l;
void 0;
