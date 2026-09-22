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
      e.textSpr = null;
      e.textureAtlas = null;
      e.prefix = "";
      return e;
    }
    n(e, t);
    e.prototype.loadImage = function(t) {
      for (var e = 0; e < this.textSpr.childrenCount; e++) {
        if (e < t.length) {
          this.textSpr.children[e].active = true;
          if (0 === t[e].localeCompare("/")) {
            this.textSpr.children[e].getComponent(cc.Sprite).spriteFrame = this.textureAtlas.getSpriteFrame(this.prefix + ":0");
          } else {
            if (0 === t[e].localeCompare(".")) {
              this.textSpr.children[e].getComponent(cc.Sprite).spriteFrame = this.textureAtlas.getSpriteFrame(this.prefix + "cham");
            } else {
              if (0 === t[e].localeCompare(",")) {
                this.textSpr.children[e].getComponent(cc.Sprite).spriteFrame = this.textureAtlas.getSpriteFrame(this.prefix + "phay");
              } else {
                this.textSpr.children[e].getComponent(cc.Sprite).spriteFrame = this.textureAtlas.getSpriteFrame(this.prefix + t[e]);
              }
            }
          }
        } else {
          this.textSpr.children[e].active = false;
        }
      }
    };
    o([r(cc.Node)], e.prototype, "textSpr", void 0);
    o([r(cc.SpriteAtlas)], e.prototype, "textureAtlas", void 0);
    // 🔴 cc.String, KHÔNG phải String thuần của JavaScript.
    //
    // Cocos 2.4 từ chối thẳng: The type of "TextToImage.prefix" must be cc.String, not String.
    // Bản dịch ngược sinh ra `String` vì mã TypeScript gốc khai `@property` với kiểu `string`,
    // và bộ dịch ngược ánh xạ nó sang hàm dựng của JavaScript. Cả ba kiểu nguyên thuỷ đều dính:
    //   String → cc.String · Number → cc.Float (hoặc cc.Integer) · Boolean → cc.Boolean
    //
    // Đã soát toàn bộ script đã bê: đây là chỗ DUY NHẤT.
    o([r(cc.String)], e.prototype, "prefix", void 0);
    return e = o([s], e);
  }(cc.Component);
i.default = c;
void 0;
