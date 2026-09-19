var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
var n = function() {
  function t() {
    this._listeners = void 0;
  }
  t.prototype.clearListeners = function() {
    this._listeners = {};
  };
  t.prototype.addEventListener = function(t, e) {
    if (this._listeners || (this._listeners = {}), t in this._listeners) {
      var i = this._listeners[t];
      if (i.indexOf(e) < 0) {
        i.push(e);
      }
    } else {
      this._listeners[t] = [e];
    }
  };
  t.prototype.removeEventListener = function(t, e) {
    if (this._listeners && t in this._listeners) {
      var i = this._listeners[t],
        n = i.indexOf(e);
      if (n >= 0) {
        if (1 === i.length) {
          delete this._listeners[t];
        } else {
          i.splice(n, 1);
        }
      }
    }
  };
  t.prototype.dispatchEvent = function(t, e) {
    if (!this._listeners) {
      return true;
    }
    var i = t.type,
      n = false;
    if (i in this._listeners) {
      for (var o = this._listeners[i], a = 0, s = void 0; s = o[a]; a++) {
        if (s.handlerEvent) {
          try {
            var r = false === s.handlerEvent.call(s, t, e);
            n = n || r;
          } catch (t) {
            console.warn(t);
          }
        } else {
          try {
            r = false === s.call(s, t, e);
            n = n || r;
          } catch (t) {
            console.warn(t);
          }
        }
      }
    }
    return !n && !t.defaultPrevented;
  };
  return t;
}();
i.default = n;
void 0;
