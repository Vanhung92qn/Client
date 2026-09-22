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
var o = require("GamePlayManager"),
  a = require("MessageCardGameHandler"),
  s = require("WSCardGameHandle"),
  r = require("SamLocRemakeMessage"),
  c = cc._decorator,
  l = c.ccclass,
  h = (c.property, function() {
    function t() {}
    var e;
    e = t;
    t.getInstance = function() {
      if (!(null !== this.Instance && void 0 !== this.Instance)) {
        this.Instance = new e();
        this.Instance.init();
      }
      return this.Instance;
    };
    t.prototype.init = function() {};
    t.prototype.getZoneName = function() {
      return "Simms";
    };
    t.prototype.sendData = function(t) {
      if (s.default.getInstance().isSocketOpen) {
        s.default.getInstance().ws.sendData(t);
      }
    };
    t.prototype.requestBoLuot = function() {
      var t = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), o.default.getInstance().roomID, {
        cmd: r.default.PASS
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.requestDanhBai = function(t) {
      var e = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), o.default.getInstance().roomID, {
        cmd: r.default.SEND_DANH_BAI,
        cs: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.requestBaoSam = function() {
      var t = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), o.default.getInstance().roomID, {
        cmd: r.default.BAO_SAM,
        ib: true
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.requestHuyBaoSam = function() {
      var t = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), o.default.getInstance().roomID, {
        cmd: r.default.BAO_SAM,
        ib: false
      }];
      this.sendData(JSON.stringify(t));
    };
    t.Instance = null;
    return t = e = n([l], t);
  }());
i.default = h;
void 0;
