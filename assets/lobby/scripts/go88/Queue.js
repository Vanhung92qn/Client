var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
var n = function() {
  function t(t) {
    if (void 0 === t) {
      t = 10;
    }
    this.headIndex = 0;
    this.tailIndex = 0;
    this._length = 0;
    this.initialCapacity = 0;
    this.currentCapacity = 0;
    this.container = [];
    this.initialCapacity = t;
    this.currentCapacity = t;
    this.container.length = t;
  }
  t.prototype.enqueue = function(t) {
    if (this._length >= this.currentCapacity) {
      this.expand();
    }
    this.container[this.tailIndex] = t;
    this._length++;
    this.tailIndex++;
    if (this.tailIndex === this.currentCapacity) {
      this.tailIndex = 0;
    }
  };
  t.prototype.dequeue = function() {
    if (this._length <= 0) {
      return null;
    }
    var t = this.container[this.headIndex];
    this.headIndex++;
    this._length--;
    if (this.headIndex === this.currentCapacity) {
      this.headIndex = 0;
    }
    if (this._length === this.currentCapacity / 4 && this._length > this.initialCapacity) {
      this.shrink();
    }
    return t;
  };
  t.prototype.peek = function() {
    return 0 === this._length ? null : this.container[this.headIndex];
  };
  Object.defineProperty(t.prototype, "length", {
    get: function() {
      return this._length;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(t.prototype, "isEmpty", {
    get: function() {
      return this._length <= 0;
    },
    enumerable: true,
    configurable: true
  });
  t.prototype.indexOf = function(t) {
    return this.container.indexOf(t);
  };
  t.prototype.expand = function() {
    var t = this.headIndex,
      e = 0,
      i = [];
    for (i.length = 2 * this.currentCapacity; e < this.currentCapacity;) {
      i[e] = this.container[t];
      e++;
      if (++t === this.currentCapacity) {
        t = 0;
      }
    }
    this.container = i;
    this.headIndex = 0;
    this.tailIndex = this.currentCapacity;
    this.currentCapacity *= 2;
  };
  t.prototype.shrink = function() {
    var t = this.headIndex,
      e = 0,
      i = [];
    for (i.length = this.currentCapacity / 4; e < this.currentCapacity;) {
      i[e] = this.container[t];
      e++;
      if (++t === this.currentCapacity) {
        t = 0;
      }
    }
    this.container = i;
    this.headIndex = 0;
    this.tailIndex = this.currentCapacity;
    this.currentCapacity /= 4;
  };
  return t;
}();
i.default = n;
void 0;
