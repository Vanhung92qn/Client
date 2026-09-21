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
// ── BẢNG TRA BÍ DANH (máy sinh — ghi-bang-tra-bi-danh.js) ──────
// Mã dịch ngược đặt bí danh một chữ cho mỗi module. Bảng này để khỏi phải cuộn ngược.
// KHÔNG đổi tên chúng bằng tìm-kiếm-thay-thế: đoạn mở đầu __decorate khai lại đúng
// những chữ này làm biến cục bộ, đổi là hỏng im lặng.
//   o = WSCardGameHandle   a = MessageCardGameHandler   s = GamePlayManager
//   r = XiToMessage
// ────────────────────────────────────────────────────────────────
var o = require("./WSCardGameHandle"),
  a = require("./MessageCardGameHandler"),
  s = require("./GamePlayManager"),
  r = require("./XiToMessage"),
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
    t.prototype.GetListRoom = function() {
      var t = [a.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: a.Global_Message.GET_TABLES,
        aid: "1",
        gid: a.GAME.XITO
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendReady = function(t) {
      var e = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), t, {
        cmd: a.Global_Message.INGAME_USER_READY
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendReadyToDealCard = function(t) {
      var e = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), t, {
        cmd: r.default.START_BETTING
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendWithdrawMoney = function(t) {
      var e = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: r.default.WITHDRA_MONEY,
        m: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendWithdrawMoneyCommom = function(t) {
      var e = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: r.default.BUY_IN,
        m: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendStandUp = function() {
      var t = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: r.default.STAND_UP
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendRaise = function(t) {
      var e = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: r.default.RAISE,
        b: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendCall = function() {
      var t = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: r.default.CALL
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendFold = function() {
      var t = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: r.default.FOLD
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendCheck = function() {
      var t = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: r.default.CHECK
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendStart = function() {
      var t = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: r.default.START
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendChonLaBaiTay = function(t) {
      var e = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: r.default.SEND_LAT_BAI_TAY,
        cs: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.Instance = null;
    return t = e = n([l], t);
  }());
i.default = h;
void 0;
