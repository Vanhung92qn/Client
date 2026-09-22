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
var EventDispatcher = require("EventDispatcher"),
  Queue = require("Queue"),
  _decorator = cc._decorator,
  ccclass = _decorator.ccclass,
  executionOrder = (_decorator.property, _decorator.executionOrder),
  QueuedMessage = function() {
    return function(messageType, event, data) {
      this.messageType = messageType;
      this.event = event;
      this.data = data;
    };
  }(),
  MessageBus = function(_super) {
    function MessageBus() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this._messageQueue = null;
      _this._dispatcher = null;
      _this._callbackMap = {};
      _this.isInit = false;
      _this.lastProcess = 0;
      _this.limitTimeMs = 16;
      return _this;
    }
    var MessageBus_1;
    __extends(MessageBus, _super);
    MessageBus_1 = MessageBus;
    Object.defineProperty(MessageBus, "instance", {
      get: function() {
        if (null == MessageBus_1._instance) {
          var busNode = new cc.Node("MessageBus");
          MessageBus_1._instance = busNode.addComponent(MessageBus_1);
          cc.game.addPersistRootNode(busNode);
          MessageBus_1._instance.init();
        }
        return MessageBus_1._instance;
      },
      enumerable: true,
      configurable: true
    });
    MessageBus.prototype.init = function() {
      if (!this.isInit) {
        this._dispatcher = new EventDispatcher.default();
        this._messageQueue = new Queue.default(100);
        this.isInit = true;
      }
    };
    MessageBus.prototype.update = function() {
      if (this.isInit) {
        for (this.lastProcess = Date.now(); 0 == this._messageQueue.isEmpty && Date.now() - this.lastProcess < this.limitTimeMs;) {
          this.processMessage();
        }
      }
    };
    MessageBus.prototype.processMessage = function() {
      if (this.init(), 0 == this._messageQueue.isEmpty) {
        var message = this._messageQueue.dequeue();
        if (null != message) {
          this._dispatcher.dispatchEvent(message.event, message.data);
        }
      }
    };
    MessageBus.prototype.addEventListener = function(eventType, callback, binder) {
      if (this.init(), null != binder) {
        if (callback = callback.bind(binder), eventType in this._callbackMap) {
          this._callbackMap[eventType][binder._id] = callback;
        } else {
          var callbacksByBinder = {};
          callbacksByBinder[binder._id] = callback;
          this._callbackMap[eventType] = callbacksByBinder;
        }
        this._dispatcher.addEventListener(eventType, callback);
      } else {
        cc.warn("Can't add event without binder");
      }
    };
    MessageBus.prototype.removeEventListener = function(eventType, binder) {
      if (this.init(), null != binder && void 0 != binder) {
        var callback = null;
        if (eventType in this._callbackMap) {
          var callbacksByBinder = this._callbackMap[eventType];
          if (null != callbacksByBinder && binder._id in callbacksByBinder) {
            callback = this._callbackMap[eventType][binder._id];
            delete this._callbackMap[eventType][binder._id];
          }
          if (null != callback) {
            this._dispatcher.removeEventListener(eventType, callback);
          }
        }
      } else {
        cc.warn("Can't remove event without binder");
      }
    };
    MessageBus.prototype.clearListeners = function() {
      this.init();
      this._dispatcher.clearListeners();
    };
    MessageBus.prototype.dispatchMessage = function(messageType, data, isImmediate) {
      if (void 0 === isImmediate) {
        isImmediate = false;
      }
      this.init();
      if (isImmediate) {
        this._dispatcher.dispatchEvent(new Event(messageType), data);
      } else {
        this._messageQueue.enqueue(new QueuedMessage(messageType, new Event(messageType), data));
      }
    };
    MessageBus._instance = null;
    // 🔴 `c` (ccclass) gọi KHÔNG kèm tên. Bản gốc viết `c("MessageBus")`, và Cocos 2.4 cảnh báo
    // mỗi lần nạp project:
    //     Should not specify class name MessageBus for Component which defines in project.
    // Component nằm trong project thì Cocos lấy tên lớp theo TÊN TỆP, khai thêm là thừa và dễ
    // đụng tên. Bỏ đi KHÔNG đổi tên đăng ký (tệp cũng tên MessageBus.js) — đã soát: không
    // prefab nào gắn component này, và không chỗ nào tra nó theo chuỗi (chỉ dùng `.instance`).
    return MessageBus = MessageBus_1 = __decorate([ccclass, executionOrder(-2)], MessageBus);
  }(cc.Component);
moduleExports.MessageBus = MessageBus;
void 0;
