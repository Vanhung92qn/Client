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
var EventDispatcher = require("./EventDispatcher"),
  Queue = require("./Queue"),
  r = cc._decorator,
  c = r.ccclass,
  l = (r.property, r.executionOrder),
  h = function() {
    return function(t, e, i) {
      this.messageType = t;
      this.event = e;
      this.data = i;
    };
  }(),
  u = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e._messageQueue = null;
      e._dispatcher = null;
      e._callbackMap = {};
      e.isInit = false;
      e.lastProcess = 0;
      e.limitTimeMs = 16;
      return e;
    }
    var i;
    n(e, t);
    i = e;
    Object.defineProperty(e, "instance", {
      get: function() {
        if (null == i._instance) {
          var t = new cc.Node("MessageBus");
          i._instance = t.addComponent(i);
          cc.game.addPersistRootNode(t);
          i._instance.init();
        }
        return i._instance;
      },
      enumerable: true,
      configurable: true
    });
    e.prototype.init = function() {
      if (!this.isInit) {
        this._dispatcher = new EventDispatcher.default();
        this._messageQueue = new Queue.default(100);
        this.isInit = true;
      }
    };
    e.prototype.update = function() {
      if (this.isInit) {
        for (this.lastProcess = Date.now(); 0 == this._messageQueue.isEmpty && Date.now() - this.lastProcess < this.limitTimeMs;) {
          this.processMessage();
        }
      }
    };
    e.prototype.processMessage = function() {
      if (this.init(), 0 == this._messageQueue.isEmpty) {
        var t = this._messageQueue.dequeue();
        if (null != t) {
          this._dispatcher.dispatchEvent(t.event, t.data);
        }
      }
    };
    e.prototype.addEventListener = function(t, e, i) {
      if (this.init(), null != i) {
        if (e = e.bind(i), t in this._callbackMap) {
          this._callbackMap[t][i._id] = e;
        } else {
          var n = {};
          n[i._id] = e;
          this._callbackMap[t] = n;
        }
        this._dispatcher.addEventListener(t, e);
      } else {
        cc.warn("Can't add event without binder");
      }
    };
    e.prototype.removeEventListener = function(t, e) {
      if (this.init(), null != e && void 0 != e) {
        var i = null;
        if (t in this._callbackMap) {
          var n = this._callbackMap[t];
          if (null != n && e._id in n) {
            i = this._callbackMap[t][e._id];
            delete this._callbackMap[t][e._id];
          }
          if (null != i) {
            this._dispatcher.removeEventListener(t, i);
          }
        }
      } else {
        cc.warn("Can't remove event without binder");
      }
    };
    e.prototype.clearListeners = function() {
      this.init();
      this._dispatcher.clearListeners();
    };
    e.prototype.dispatchMessage = function(t, e, i) {
      if (void 0 === i) {
        i = false;
      }
      this.init();
      if (i) {
        this._dispatcher.dispatchEvent(new Event(t), e);
      } else {
        this._messageQueue.enqueue(new h(t, new Event(t), e));
      }
    };
    e._instance = null;
    // 🔴 `c` (ccclass) gọi KHÔNG kèm tên. Bản gốc viết `c("MessageBus")`, và Cocos 2.4 cảnh báo
    // mỗi lần nạp project:
    //     Should not specify class name MessageBus for Component which defines in project.
    // Component nằm trong project thì Cocos lấy tên lớp theo TÊN TỆP, khai thêm là thừa và dễ
    // đụng tên. Bỏ đi KHÔNG đổi tên đăng ký (tệp cũng tên MessageBus.js) — đã soát: không
    // prefab nào gắn component này, và không chỗ nào tra nó theo chuỗi (chỉ dùng `.instance`).
    return e = i = o([c, l(-2)], e);
  }(cc.Component);
i.MessageBus = u;
void 0;
