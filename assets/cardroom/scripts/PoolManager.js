var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
var __extends = this && this.__extends || function() {
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
  __decorate = this && this.__decorate || function(t, e, i, n) {
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
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});
var GameUtils = require("GameUtils"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  PoolObject = (ccDecorator.property, function() {
    function PoolObject() {
      this.poolName = "";
      this.listObjectUsing = [];
      this.listObjectFree = [];
    }
    PoolObject.prototype.setName = function(poolName) {
      this.poolName = poolName;
    };
    PoolObject.prototype.clear = function() {
      this.listObjectFree = [];
      this.listObjectUsing = [];
    };
    PoolObject.prototype.getObject = function() {
      if (0 == this.listObjectFree.length) {
        return null;
      }
      var obj = this.listObjectFree.pop();
      this.listObjectUsing.push(obj);
      return obj;
    };
    PoolObject.prototype.addObject = function(obj) {
      this.listObjectFree.push(obj);
      for (var index = 0; index < this.listObjectUsing.length; index++) {
        if (obj === this.listObjectUsing[index]) {
          this.listObjectUsing.splice(index, 1);
          break;
        }
      }
    };
    PoolObject.prototype.addObjectUsing = function(obj) {
      this.listObjectUsing.push(obj);
    };
    PoolObject.prototype.resetAllObjectUsing = function() {
      for (var index = 0; index < this.listObjectUsing.length; index++) {
        if (null != this.listObjectUsing[index] && void 0 != this.listObjectUsing[index]) {
          this.listObjectFree.push(this.listObjectUsing[index]);
        } else {
          this.listObjectFree.splice(index, 1);
          index--;
        }
      }
      this.listObjectUsing = [];
    };
    return PoolObject;
  }());
moduleExports.PoolObject = PoolObject;
var PoolNode = function(_super) {
  function PoolNode() {
    return null !== _super && _super.apply(this, arguments) || this;
  }
  __extends(PoolNode, _super);
  PoolNode.prototype.clear = function() {
    for (var index = 0; index < this.listObjectFree.length; index++) {
      if (null != this.listObjectFree[index] && void 0 != this.listObjectFree[index]) {
        this.listObjectFree[index].destroy();
      }
    }
    for (index = 0; index < this.listObjectUsing.length; index++) {
      if (null != this.listObjectUsing[index] && void 0 != this.listObjectUsing[index]) {
        this.listObjectUsing[index].destroy();
      }
    }
    _super.prototype.clear.call(this);
  };
  PoolNode.prototype.resetAllObjectUsing = function() {
    _super.prototype.resetAllObjectUsing.call(this);
    for (var index = 0; index < this.listObjectFree.length; index++) {
      this.listObjectFree[index].parent = null;
      this.listObjectFree[index].active = false;
    }
  };
  PoolNode.prototype.getObject = function() {
    if (0 == this.listObjectFree.length) {
      return null;
    }
    var node = this.listObjectFree.pop();
    this.listObjectUsing.push(node);
    return null == node.node ? null : (node.active = true, node.opacity = 255, node);
  };
  PoolNode.prototype.addObject = function(node) {
    _super.prototype.addObject.call(this, node);
  };
  return PoolNode;
}(PoolObject);
moduleExports.PoolNode = PoolNode;
var PoolComponent = function(_super) {
  function PoolComponent() {
    return null !== _super && _super.apply(this, arguments) || this;
  }
  __extends(PoolComponent, _super);
  PoolComponent.prototype.clear = function() {
    this.resetAllObjectUsing();
    for (var index = 0; index < this.listObjectFree.length; index++) {
      if (null != this.listObjectFree[index].node && void 0 != this.listObjectFree[index].node) {
        this.listObjectFree[index].node.destroy();
      } else {
        this.listObjectFree.splice(index, 1);
        index--;
      }
    }
    _super.prototype.clear.call(this);
  };
  PoolComponent.prototype.resetAllObjectUsing = function() {
    _super.prototype.resetAllObjectUsing.call(this);
    for (var index = 0; index < this.listObjectFree.length; index++) {
      if (null != this.listObjectFree[index].node) {
        this.listObjectFree[index].node.active = false;
        this.listObjectFree[index].node.parent = null;
      } else {
        this.listObjectFree.splice(index, 1);
        index--;
      }
    }
  };
  PoolComponent.prototype.getObject = function() {
    if (0 == this.listObjectFree.length) {
      return null;
    }
    var component = this.listObjectFree.pop();
    this.listObjectUsing.push(component);
    return null == component.node ? null : (component.node.active = true, component);
  };
  PoolComponent.prototype.addObject = function(component) {
    component.node.active = false;
    component.node.parent = null;
    _super.prototype.addObject.call(this, component);
  };
  return PoolComponent;
}(PoolObject);
moduleExports.PoolComponent = PoolComponent;
var PoolManager = function() {
  function PoolManager() {
    this.mapPool = new GameUtils.MapString();
  }
  var PoolManagerClass;
  PoolManagerClass = PoolManager;
  PoolManager.getInstance = function() {
    if (null == PoolManagerClass.instance) {
      PoolManagerClass.instance = new PoolManagerClass();
    }
    return PoolManagerClass.instance;
  };
  PoolManager.prototype.addPool = function(poolName, pool) {
    pool.setName(poolName);
    this.mapPool.set(poolName, pool);
    return pool;
  };
  PoolManager.prototype.getPool = function(poolName) {
    return this.mapPool.get(poolName);
  };
  return PoolManager = PoolManagerClass = __decorate([ccclass], PoolManager);
}();
moduleExports.PoolManager = PoolManager;
void 0;
