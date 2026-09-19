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
  c = function() {
    return function() {
      this.Text = "";
      this.HexaColor = ";";
    };
  }(),
  l = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.text = "";
      e.prefabLabel = null;
      e.layout = null;
      e.currentText = "";
      e.listLabel = [];
      e.content = null;
      e.maxLength = 200;
      e.currLength = 0;
      return e;
    }
    n(e, t);
    e.prototype.start = function() {};
    e.prototype.onDestroy = function() {
      for (var t = 0; t < this.listLabel.length; t++) {
        if (null != this.listLabel[t] && null != this.listLabel[t].node) {
          this.listLabel[t].node.destroy();
        }
      }
      this.listLabel = [];
    };
    e.prototype.setString = function(t) {
      this.createLabels(t);
      if (null != this.layout) {
        this.layout.updateLayout();
      }
    };
    e.prototype.parseData = function(t) {
      var e = [],
        i = t.indexOf("color"),
        n = -1,
        o = -1,
        a = "",
        s = "",
        r = 0;
      do {
        if (i >= 0) {
          for (var l = i; l < t.length; l++) {
            if ("#" != t[l] || (n = l, -1 == r)) {
              if (">" == t[l] && (o = l, s = t.substring(n, l)), "<" == t[l]) {
                a = t.substring(o + 1, l);
                (u = new c()).Text = a;
                u.HexaColor = s;
                e.push(u);
                for (var h = l; h < t.length; h++) {
                  if (">" == t[h]) {
                    r = h + 1;
                    break;
                  }
                }
                a = "";
                s = "";
                n = -1;
                o = -1;
                break;
              }
            } else {
              a = t.substring(r, i - 1);
              (u = new c()).Text = a;
              u.HexaColor = "";
              e.push(u);
              r = -1;
            }
          }
        }
        if ((i = t.indexOf("color", i + 1)) < 0) {
          for (l = t.length - 1; l >= 0; l--) {
            if (">" == t[l]) {
              o = l;
              break;
            }
          }
          var u;
          a = t.substring(o + 1, t.length);
          (u = new c()).Text = a;
          u.HexaColor = "";
          e.push(u);
          break;
        }
      } while (-1 != i);
      return e;
    };
    e.prototype.createLabels = function(t) {
      if (t != this.currentText) {
        for (var e = this.parseData(t), i = 0; i < this.listLabel.length; i++) {
          this.listLabel[i].node.active = false;
          this.listLabel[i].node.parent = null;
          this.listLabel[i].node.color = cc.color(255, 255, 255, 255);
          this.listLabel[i].string = "";
        }
        if (0 == e.length) {
          var n = null;
          if (this.listLabel.length > 0) {
            n = this.listLabel[0];
          }
          if (null == n) {
            n = cc.instantiate(this.prefabLabel).getComponent(cc.Label);
            this.listLabel.push(n);
          }
          n.node.active = true;
          n.string = t;
          n.node.parent = this.node;
        } else {
          this.currLength = 0;
          this.node.y = 0;
          var o = 0,
            a = false;
          for (i = 0; i < e.length; i++) {
            var s = e[i];
            if (0 != s.Text.length) {
              if ("\n" === s.Text.slice(0, 1) && (s.Text = s.Text.replace("\n", ""), a = true), null != this.content) {
                for (var r = 0, c = 25, l = this.maxLength, h = 0; h < e.length; h++) {
                  r += e[h].Text.length;
                }
                if (r > 85) {
                  c -= (r - 85) / 4;
                  l = r / 2 - 10;
                }
                for (var u = s.Text.split(" "), d = 0; d < u.length; d++) {
                  if (0 != u[d].length) {
                    n = null;
                    if (o < this.listLabel.length) {
                      n = this.listLabel[o];
                    }
                    o++;
                    if (null == n) {
                      n = cc.instantiate(this.prefabLabel).getComponent(cc.Label);
                      this.listLabel.push(n);
                    }
                    n.fontSize = c;
                    n.node.active = true;
                    n.string = u[d];
                    this.currLength += n.string.length;
                    if ("\n" === u[d].slice(0, 1)) {
                      n.string = u[d] = u[d].replace("\n", "");
                      a = true;
                    }
                    if (this.currLength >= l || a) {
                      n.node.parent = this.content;
                      this.node.y = 14;
                      this.content.y = -16;
                    } else {
                      n.node.parent = this.node;
                      if ("\n" === u[d].slice(-1)) {
                        n.string = u[d] = u[d].replace("\n", "");
                        a = true;
                      }
                    }
                    n.node.x = 0;
                    n.node.y = 0;
                    if (s.HexaColor.length > 0) {
                      n.node.color = this.node.color.fromHEX(s.HexaColor);
                    } else {
                      n.node.color = cc.color(255, 255, 255, 255);
                    }
                  }
                }
                this.doActionFadeInListLabel();
              } else {
                n = null;
                if (i < this.listLabel.length) {
                  n = this.listLabel[i];
                }
                if (null == n) {
                  n = cc.instantiate(this.prefabLabel).getComponent(cc.Label);
                  this.listLabel.push(n);
                }
                n.node.active = true;
                n.string = s.Text;
                n.node.parent = this.node;
                n.node.x = 0;
                n.node.y = 0;
                if (s.HexaColor.length > 0) {
                  n.node.color = this.node.color.fromHEX(s.HexaColor);
                } else {
                  n.node.color = cc.color(255, 255, 255, 255);
                }
              }
            }
          }
        }
        this.currentText = t;
      }
    };
    e.prototype.doActionFadeInListLabel = function() {
      for (var t = 0; t < this.listLabel.length; t++) {
        this.listLabel[t].node.opacity = 0;
        this.listLabel[t].node.runAction(cc.fadeIn(.5));
      }
    };
    e.prototype.resetOpacityListLabel = function() {
      for (var t = 0; t < this.listLabel.length; t++) {
        this.listLabel[t].node.opacity = 255;
      }
    };
    o([r], e.prototype, "text", void 0);
    o([r(cc.Prefab)], e.prototype, "prefabLabel", void 0);
    o([r(cc.Layout)], e.prototype, "layout", void 0);
    o([r(cc.Node)], e.prototype, "content", void 0);
    o([r], e.prototype, "maxLength", void 0);
    return e = o([s], e);
  }(cc.Component);
i.default = l;
void 0;
