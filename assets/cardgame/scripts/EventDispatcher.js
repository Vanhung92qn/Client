var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});
var EventDispatcher = function() {
  function EventDispatcher() {
    this._listeners = void 0;
  }
  EventDispatcher.prototype.clearListeners = function() {
    this._listeners = {};
  };
  EventDispatcher.prototype.addEventListener = function(eventType, listener) {
    if (this._listeners || (this._listeners = {}), eventType in this._listeners) {
      var listeners = this._listeners[eventType];
      if (listeners.indexOf(listener) < 0) {
        listeners.push(listener);
      }
    } else {
      this._listeners[eventType] = [listener];
    }
  };
  EventDispatcher.prototype.removeEventListener = function(eventType, listener) {
    if (this._listeners && eventType in this._listeners) {
      var listeners = this._listeners[eventType],
        index = listeners.indexOf(listener);
      if (index >= 0) {
        if (1 === listeners.length) {
          delete this._listeners[eventType];
        } else {
          listeners.splice(index, 1);
        }
      }
    }
  };
  EventDispatcher.prototype.dispatchEvent = function(event, data) {
    if (!this._listeners) {
      return true;
    }
    var eventType = event.type,
      isCanceled = false;
    if (eventType in this._listeners) {
      for (var listeners = this._listeners[eventType], index = 0, listener = void 0; listener = listeners[index]; index++) {
        if (listener.handlerEvent) {
          try {
            var listenerCanceled = false === listener.handlerEvent.call(listener, event, data);
            isCanceled = isCanceled || listenerCanceled;
          } catch (err) {
            console.warn(err);
          }
        } else {
          try {
            listenerCanceled = false === listener.call(listener, event, data);
            isCanceled = isCanceled || listenerCanceled;
          } catch (err) {
            console.warn(err);
          }
        }
      }
    }
    return !isCanceled && !event.defaultPrevented;
  };
  return EventDispatcher;
}();
moduleExports.default = EventDispatcher;
void 0;
