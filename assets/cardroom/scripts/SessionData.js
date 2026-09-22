var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
var __decorate = this && this.__decorate || function(t, e, i, n) {
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
var ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  SessionData = (ccDecorator.property, function() {
    function SessionData() {}
    var SessionData_1;
    SessionData_1 = SessionData;
    SessionData.reset = function() {
      SessionData_1.isShowingUpdateDocumentTooltip = false;
      SessionData_1.isShowingComplainDocumentTooltip = false;
      SessionData_1.isHandledShowNotifyStatus = false;
    };
    SessionData.isShowingUpdateDocumentTooltip = false;
    SessionData.isShowingComplainDocumentTooltip = false;
    SessionData.isHandledShowNotifyStatus = false;
    return SessionData = SessionData_1 = __decorate([ccclass], SessionData);
  }());
moduleExports.SessionData = SessionData;
void 0;
