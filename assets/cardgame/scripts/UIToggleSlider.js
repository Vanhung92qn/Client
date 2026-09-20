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
  r = a.property,
  c = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.iconChose = null;
      e.offset = 0;
      e.moveX = 0;
      e.isOnSelect = false;
      e.isMove = true;
      e.isPreventClick = false;
      e.onValueChange = function(t) {};
      return e;
    }
    n(e, t);
    e.prototype.isOnChange = function(t, e) {
      if (void 0 === e) {
        e = true;
      }
      if (!(this.isPreventClick || this.isOnSelect === t || this.iconChose.getNumberOfRunningActions() > 0)) {
        if (this.isMove) {
          this.isOnSelect = t;
          this.iconChose.runAction(cc.moveTo(.1, new cc.Vec2(this.isOnSelect ? this.moveX : -this.moveX, this.iconChose.position.y)));
        }
        if (e) {
          this.onValueChange(t);
        }
      }
    };
    e.prototype.initStart = function(t) {
      this.moveX = this.node.width / 2 - this.iconChose.width / 2 - this.offset;
      this.isOnSelect = t;
      this.iconChose.position = new cc.Vec2(this.isOnSelect ? this.moveX : -1 * this.moveX, this.iconChose.position.y);
    };
    e.prototype.setPreventClick = function(t) {
      this.isPreventClick = t;
    };
    e.prototype.onClick = function() {
      this.isOnChange(!this.isOnSelect);
    };
    o([r(cc.Node)], e.prototype, "iconChose", void 0);
    o([r], e.prototype, "offset", void 0);
    return e = o([s], e);
  }(cc.Component);
i.default = c;
void 0;
