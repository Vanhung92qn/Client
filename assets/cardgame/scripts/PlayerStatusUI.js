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
var GameDefine = require("./GameDefine"),
  s = cc._decorator,
  r = s.ccclass,
  c = s.property,
  l = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.listStringText = ["\xdap", "Theo", "Xem", "T\u1ed1", "T\u1ea5t tay"];
      e.spriteBackground = null;
      e.label = null;
      return e;
    }
    n(e, t);
    e.prototype.start = function() {};
    e.prototype.setLiengStatus = function(t) {
      if (!(t - 1 >= this.listStringText.length)) {
        if (!(t != GameDefine.ELiengPlayState.CHECK && t != GameDefine.ELiengPlayState.CALL)) {
          3;
        }
        this.label.node.active = true;
        this.label.string = this.listStringText[t - 1];
        this.show();
      }
    };
    e.prototype.setBaCayStatus = function(t) {
      if (!(t - 1 >= this.listStringText.length)) {
        if (!(t != GameDefine.EBaCayPlayState.CHECK && t != GameDefine.EBaCayPlayState.CALL)) {
          3;
        }
        this.label.node.active = true;
        this.label.string = this.listStringText[t - 1];
        this.show();
      }
    };
    e.prototype.setPhomStatus = function(t, e) {
      if (void 0 === e) {
        e = 3;
      }
      var i = "";
      switch (t) {
        case GameDefine.EPhomPlayerStatus.MOM:
          i = "M\xf3m";
          break;
        case GameDefine.EPhomPlayerStatus.U:
          i = "\xd9";
          break;
        case GameDefine.EPhomPlayerStatus.AN_CHOT:
          i = "\u0102n ch\u1ed1t";
          break;
        default:
        case GameDefine.EPhomPlayerStatus.NONE:
          return void this.hide();
      }
      this.label.node.active = true;
      this.label.string = i;
      this.show();
      if (e > 0) {
        this.node.runAction(cc.sequence(cc.delayTime(e), cc.callFunc(function() {
          this.hide();
        }.bind(this))));
      }
    };
    e.prototype.show = function() {
      this.node.active = true;
    };
    e.prototype.hide = function() {
      this.node.active = false;
    };
    e.prototype.flipBackground = function(t) {
      this.spriteBackground.node.scaleX = t ? -1 : 1;
    };
    o([c(cc.Sprite)], e.prototype, "spriteBackground", void 0);
    o([c(cc.Label)], e.prototype, "label", void 0);
    return e = o([r], e);
  }(cc.Component);
i.default = l;
void 0;
