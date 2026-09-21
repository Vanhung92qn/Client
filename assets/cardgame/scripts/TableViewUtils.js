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
var OrientationManager = require("./OrientationManager"),
  TableCell = require("./TableCell"),
  r = cc._decorator,
  c = r.ccclass,
  l = r.property,
  h = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.scrollView = null;
      e.itemPrefab = null;
      e.firstItemData = {};
      e.lastItemData = {};
      e.itemPosMap = {};
      e.lastResetItemIndex = null;
      e.orientation = OrientationManager.Orientation.Landscape;
      e.listTableCell = [];
      return e;
    }
    n(e, t);
    e.prototype.init = function(t, e, i, n, o) {
      if (void 0 === o) {
        o = false;
      }
      this.content = this.scrollView.content;
      for (var a = this.listTableCell.length; a < t.length; ++a) {
        var r = cc.instantiate(this.itemPrefab);
        r.parent = this.content;
        (c = r.getComponent(TableCell.default)).setIndex(a);
        this.listTableCell.push(c);
      }
      for (a = 0; a < t.length; ++a) {
        if (!(c = this.listTableCell[a]).node.active) {
          c.node.active = true;
        }
        if (o) {
          c.node.stopAllActions();
          c.node.runAction(cc.sequence(cc.scaleTo(.15, 1.05), cc.scaleTo(.15, 1)));
        }
        c.initValue(t[a], this, this.orientation);
      }
      for (a = t.length; a < this.listTableCell.length; ++a) {
        var c;
        (c = this.listTableCell[a]).node.active = false;
      }
    };
    e.prototype.hideAllItems = function() {
      for (var t = 0; t < this.listTableCell.length; t++) {
        this.listTableCell[t].node.active = false;
      }
    };
    e.prototype.callback = function(t, e) {};
    o([l(cc.ScrollView)], e.prototype, "scrollView", void 0);
    o([l(cc.Prefab)], e.prototype, "itemPrefab", void 0);
    return e = o([c], e);
  }(cc.Component);
i.default = h;
void 0;
