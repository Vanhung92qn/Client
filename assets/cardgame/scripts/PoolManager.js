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
var GameUtils = require("./GameUtils"),
  s = cc._decorator,
  r = s.ccclass,
  c = (s.property, function() {
    function t() {
      this.poolName = "";
      this.listObjectUsing = [];
      this.listObjectFree = [];
    }
    t.prototype.setName = function(t) {
      this.poolName = t;
    };
    t.prototype.clear = function() {
      this.listObjectFree = [];
      this.listObjectUsing = [];
    };
    t.prototype.getObject = function() {
      if (0 == this.listObjectFree.length) {
        return null;
      }
      var t = this.listObjectFree.pop();
      this.listObjectUsing.push(t);
      return t;
    };
    t.prototype.addObject = function(t) {
      this.listObjectFree.push(t);
      for (var e = 0; e < this.listObjectUsing.length; e++) {
        if (t === this.listObjectUsing[e]) {
          this.listObjectUsing.splice(e, 1);
          break;
        }
      }
    };
    t.prototype.addObjectUsing = function(t) {
      this.listObjectUsing.push(t);
    };
    t.prototype.resetAllObjectUsing = function() {
      for (var t = 0; t < this.listObjectUsing.length; t++) {
        if (null != this.listObjectUsing[t] && void 0 != this.listObjectUsing[t]) {
          this.listObjectFree.push(this.listObjectUsing[t]);
        } else {
          this.listObjectFree.splice(t, 1);
          t--;
        }
      }
      this.listObjectUsing = [];
    };
    return t;
  }());
i.PoolObject = c;
var l = function(t) {
  function e() {
    return null !== t && t.apply(this, arguments) || this;
  }
  n(e, t);
  e.prototype.clear = function() {
    for (var e = 0; e < this.listObjectFree.length; e++) {
      if (null != this.listObjectFree[e] && void 0 != this.listObjectFree[e]) {
        this.listObjectFree[e].destroy();
      }
    }
    for (e = 0; e < this.listObjectUsing.length; e++) {
      if (null != this.listObjectUsing[e] && void 0 != this.listObjectUsing[e]) {
        this.listObjectUsing[e].destroy();
      }
    }
    t.prototype.clear.call(this);
  };
  e.prototype.resetAllObjectUsing = function() {
    t.prototype.resetAllObjectUsing.call(this);
    for (var e = 0; e < this.listObjectFree.length; e++) {
      this.listObjectFree[e].parent = null;
      this.listObjectFree[e].active = false;
    }
  };
  e.prototype.getObject = function() {
    if (0 == this.listObjectFree.length) {
      return null;
    }
    var t = this.listObjectFree.pop();
    this.listObjectUsing.push(t);
    return null == t.node ? null : (t.active = true, t.opacity = 255, t);
  };
  e.prototype.addObject = function(e) {
    t.prototype.addObject.call(this, e);
  };
  return e;
}(c);
i.PoolNode = l;
var h = function(t) {
  function e() {
    return null !== t && t.apply(this, arguments) || this;
  }
  n(e, t);
  e.prototype.clear = function() {
    this.resetAllObjectUsing();
    for (var e = 0; e < this.listObjectFree.length; e++) {
      if (null != this.listObjectFree[e].node && void 0 != this.listObjectFree[e].node) {
        this.listObjectFree[e].node.destroy();
      } else {
        this.listObjectFree.splice(e, 1);
        e--;
      }
    }
    t.prototype.clear.call(this);
  };
  e.prototype.resetAllObjectUsing = function() {
    t.prototype.resetAllObjectUsing.call(this);
    for (var e = 0; e < this.listObjectFree.length; e++) {
      if (null != this.listObjectFree[e].node) {
        this.listObjectFree[e].node.active = false;
        this.listObjectFree[e].node.parent = null;
      } else {
        this.listObjectFree.splice(e, 1);
        e--;
      }
    }
  };
  e.prototype.getObject = function() {
    if (0 == this.listObjectFree.length) {
      return null;
    }
    var t = this.listObjectFree.pop();
    this.listObjectUsing.push(t);
    return null == t.node ? null : (t.node.active = true, t);
  };
  e.prototype.addObject = function(e) {
    e.node.active = false;
    e.node.parent = null;
    t.prototype.addObject.call(this, e);
  };
  return e;
}(c);
i.PoolComponent = h;
var u = function() {
  function t() {
    this.mapPool = new GameUtils.MapString();
  }
  var e;
  e = t;
  t.getInstance = function() {
    if (null == e.instance) {
      e.instance = new e();
    }
    return e.instance;
  };
  t.prototype.addPool = function(t, e) {
    e.setName(t);
    this.mapPool.set(t, e);
    return e;
  };
  t.prototype.getPool = function(t) {
    return this.mapPool.get(t);
  };
  return t = e = o([r], t);
}();
i.PoolManager = u;
void 0;
