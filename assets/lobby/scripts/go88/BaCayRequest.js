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
var o = t("./WSCardGameHandle"),
  a = t("./MessageCardGameHandler"),
  s = t("./GamePlayManager"),
  r = t("./BaCayMessage"),
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
      if (o.default.getInstance().isSocketOpen) {
        o.default.getInstance().ws.sendData(t);
      }
    };
    t.prototype.sendImformRoyalties = function(t) {
      var e = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: r.default.INFORM_ROYALTIES,
        cs: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendUpdateArrangeCardsState = function(t) {
      var e = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: r.default.UPDATE_ARRANGE_CARDS_STATE,
        cs: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendUpdateCurrentCardsState = function(t) {
      var e = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: r.default.UPDATE_CURRENT_CARDS_STATE,
        cs: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendRearrangeCards = function() {
      var t = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: r.default.REARRANGE_CARDS
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendStart = function() {
      var t = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: r.default.START
      }];
      this.sendData(JSON.stringify(t));
    };
    t.Instance = null;
    return t = e = n([l], t);
  }());
i.default = h;
void 0;
