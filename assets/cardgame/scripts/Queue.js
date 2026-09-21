var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});
var Queue = function() {
  function Queue(capacity) {
    if (void 0 === capacity) {
      capacity = 10;
    }
    this.headIndex = 0;
    this.tailIndex = 0;
    this._length = 0;
    this.initialCapacity = 0;
    this.currentCapacity = 0;
    this.container = [];
    this.initialCapacity = capacity;
    this.currentCapacity = capacity;
    this.container.length = capacity;
  }
  Queue.prototype.enqueue = function(item) {
    if (this._length >= this.currentCapacity) {
      this.expand();
    }
    this.container[this.tailIndex] = item;
    this._length++;
    this.tailIndex++;
    if (this.tailIndex === this.currentCapacity) {
      this.tailIndex = 0;
    }
  };
  Queue.prototype.dequeue = function() {
    if (this._length <= 0) {
      return null;
    }
    var item = this.container[this.headIndex];
    this.headIndex++;
    this._length--;
    if (this.headIndex === this.currentCapacity) {
      this.headIndex = 0;
    }
    if (this._length === this.currentCapacity / 4 && this._length > this.initialCapacity) {
      this.shrink();
    }
    return item;
  };
  Queue.prototype.peek = function() {
    return 0 === this._length ? null : this.container[this.headIndex];
  };
  Object.defineProperty(Queue.prototype, "length", {
    get: function() {
      return this._length;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Queue.prototype, "isEmpty", {
    get: function() {
      return this._length <= 0;
    },
    enumerable: true,
    configurable: true
  });
  Queue.prototype.indexOf = function(item) {
    return this.container.indexOf(item);
  };
  Queue.prototype.expand = function() {
    var readIndex = this.headIndex,
      writeIndex = 0,
      newContainer = [];
    for (newContainer.length = 2 * this.currentCapacity; writeIndex < this.currentCapacity;) {
      newContainer[writeIndex] = this.container[readIndex];
      writeIndex++;
      if (++readIndex === this.currentCapacity) {
        readIndex = 0;
      }
    }
    this.container = newContainer;
    this.headIndex = 0;
    this.tailIndex = this.currentCapacity;
    this.currentCapacity *= 2;
  };
  Queue.prototype.shrink = function() {
    var readIndex = this.headIndex,
      writeIndex = 0,
      newContainer = [];
    for (newContainer.length = this.currentCapacity / 4; writeIndex < this.currentCapacity;) {
      newContainer[writeIndex] = this.container[readIndex];
      writeIndex++;
      if (++readIndex === this.currentCapacity) {
        readIndex = 0;
      }
    }
    this.container = newContainer;
    this.headIndex = 0;
    this.tailIndex = this.currentCapacity;
    this.currentCapacity /= 4;
  };
  return Queue;
}();
moduleExports.default = Queue;
void 0;
