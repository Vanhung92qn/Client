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
var a = cc._decorator,
  s = a.ccclass,
  r = (a.property, function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.index = 0;
      e.card = null;
      e.maubinhController = null;
      e.serverCode = true;
      return e;
    }
    n(e, t);
    Object.defineProperty(e.prototype, "Card", {
      get: function() {
        return this.card;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(e.prototype, "Index", {
      get: function() {
        return this.index;
      },
      enumerable: true,
      configurable: true
    });
    e.prototype.setup = function(t, e) {
      this.index = t;
      this.maubinhController = e;
    };
    Object.defineProperty(e.prototype, "ServerCode", {
      get: function() {
        return this.serverCode;
      },
      set: function(t) {
        this.serverCode = t;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(e.prototype, "IsEmpty", {
      get: function() {
        return null == this.card;
      },
      enumerable: true,
      configurable: true
    });
    e.prototype.checkTouchInThis = function(t, e) {
      return !(t > this.node.position.x + this.node.width / 2 || t < this.node.position.x - this.node.width / 2 || e > this.node
        .position.y + this.node.parent.position.y + this.node.height / 2 || e < this.node.position.y + this.node.parent.position.y -
        this.node.height / 2);
    };
    e.prototype.clearCardChild = function(t) {
      if (void 0 === t) {
        t = false;
      }
      if (this.card) {
        this.card.emptyCardMauBinh = null;
        if (t) {
          this.card.tempTouchEmptyCardMauBinh = null;
        }
        this.card = null;
      }
    };
    e.prototype.setCardChild = function(t) {
      this.card = t;
      this.card.emptyCardMauBinh = this;
      this.card.isInBottomMauBinh = false;
      this.setColor(cc.Color.WHITE);
    };
    e.prototype.setColor = function(t) {
      this.node.color = t;
    };
    e.prototype.getPosition = function() {
      return new cc.Vec2(this.node.position.x + this.node.parent.position.x, this.node.position.y + this.node.parent.position.y);
    };
    return e = o([s], e);
  }(cc.Component));
i.default = r;
void 0;
