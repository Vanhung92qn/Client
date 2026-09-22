var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
var n = this && this.__extends || function() {
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
  o = this && this.__decorate || function(t, e, i, n) {
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
var a,
  s = require("./MessageHandlerBase"),
  r = require("./GamePlayManager"),
  c = require("./MessageCardGameHandler"),
  l = require("./NetworkConfig"),
  h = require("./TableMessageHandler"),
  u = cc._decorator,
  d = u.ccclass;
u.property;
(function(t) {
  t[t.DEAL_CARDS = 850] = "DEAL_CARDS";
  t[t.CHANGE_TURN = 851] = "CHANGE_TURN";
  t[t.DRAW_CARD = 852] = "DRAW_CARD";
  t[t.TAKE_CARD = 853] = "TAKE_CARD";
  t[t.HA_PHOM = 854] = "HA_PHOM";
  t[t.GUI_BAI = 856] = "GUI_BAI";
  t[t.FINISH_GAME = 855] = "FINISH_GAME";
  t[t.DANH_BAI = 857] = "DANH_BAI";
  t[t.BAO_U = 858] = "BAO_U";
})(a = i.PhomCommand || (i.PhomCommand = {}));
var p = function(t) {
  function e() {
    return null !== t && t.apply(this, arguments) || this;
  }
  var i;
  n(e, t);
  i = e;
  e.getInstance = function() {
    if (!(null !== this.instance && void 0 !== this.instance)) {
      this.instance = new i();
      this.instance.init();
    }
    return this.instance;
  };
  e.prototype.init = function() {
    t.prototype.init.call(this);
  };
  e.prototype.getTag = function() {
    return "PhomMessageHandler";
  };
  e.prototype.genMessage = function(t, e) {
    if (void 0 === e) {
      e = -1;
    }
    if (-1 == e) {
      e = r.default.getInstance().roomID;
    }
    return [c.Message.MessageType.RoomPlugin_Type, l.getZoneName(), e, t];
  };
  e.prototype.receiveMessage = function(t, e, i) {
    if (0 != this.active) {
      switch (this.printLog("receiveMessage command: " + t), t) {
        case a.CHANGE_TURN:
          h.default.getInstance().receiveChangeTurn(t, i);
          break;
        case a.DEAL_CARDS:
          h.default.getInstance().receiveDealCard(t, i);
          break;
        case a.FINISH_GAME:
          h.default.getInstance().receiveFinishGame(t, i);
          break;
        case a.BAO_U:
        case a.DANH_BAI:
          break;
        case a.DRAW_CARD:
        case a.TAKE_CARD:
        case a.HA_PHOM:
        case a.GUI_BAI:
        case a.BAO_U:
          h.default.getInstance().receiveChangeTurn(t, i);
      }
    }
  };
  e.prototype.requestPlayCard = function(t) {
    [].push(t);
    this.sendData(JSON.stringify(this.genMessage({
      cmd: a.DANH_BAI,
      cs: t
    })));
  };
  e.prototype.requestTakeCard = function(t) {
    this.sendData(JSON.stringify(this.genMessage({
      cmd: a.TAKE_CARD,
      cs: t
    })));
  };
  e.prototype.requestDrawCard = function() {
    this.sendData(JSON.stringify(this.genMessage({
      cmd: a.DRAW_CARD
    })));
  };
  e.prototype.requestGuiBai = function(t) {
    this.sendData(JSON.stringify(this.genMessage({
      cmd: a.GUI_BAI,
      cs: t
    })));
  };
  e.prototype.requestHaPhom = function(t) {
    this.sendData(JSON.stringify(this.genMessage({
      cmd: a.HA_PHOM,
      cs: t
    })));
  };
  e.prototype.requestBaoU = function() {
    this.sendData(JSON.stringify(this.genMessage({
      cmd: a.BAO_U
    })));
  };
  e.instance = null;
  return e = i = o([d], e);
}(s.default);
i.default = p;
void 0;
