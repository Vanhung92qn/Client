var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
var n = this && this.__decorate || function(t, e, i, n) {
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
var o = cc._decorator,
  a = o.ccclass,
  s = (o.property, function() {
    function t() {}
    var e;
    e = t;
    t.reset = function() {
      e.isShowingUpdateDocumentTooltip = false;
      e.isShowingComplainDocumentTooltip = false;
      e.isHandledShowNotifyStatus = false;
    };
    t.isShowingUpdateDocumentTooltip = false;
    t.isShowingComplainDocumentTooltip = false;
    t.isHandledShowNotifyStatus = false;
    return t = e = n([a], t);
  }());
i.SessionData = s;
void 0;
