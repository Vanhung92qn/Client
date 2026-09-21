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
  t[t.DEAL_CARDS = 700] = "DEAL_CARDS";
  t[t.CHANGE_TURN = 701] = "CHANGE_TURN";
  t[t.READY_DEAL_CARD = 708] = "READY_DEAL_CARD";
  t[t.FLIP_CARDS = 709] = "FLIP_CARDS";
  t[t.FINISH_GAME = 702] = "FINISH_GAME";
  t[t.BUY_IN = 699] = "BUY_IN";
  t[t.RAISE = 704] = "RAISE";
  t[t.CALL = 705] = "CALL";
  t[t.CHECK = 710] = "CHECK";
  t[t.FOLD = 706] = "FOLD";
})(a = i.LiengCommand || (i.LiengCommand = {}));
var p = function(t) {
  function e() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.onReceiveFlipCards = function(t) {};
    e.onReceiveBuyInMoney = function(t) {};
    e.onReceiveStartBetting = function(t) {};
    return e;
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
    return "LiengMessageHandler";
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
  e.prototype.receiveMessage = function(t, e, n) {
    switch (this.printLog(" receiveMessage command: " + t), t) {
      case a.CALL:
      case a.FOLD:
      case a.RAISE:
      case a.CHECK:
      case a.FLIP_CARDS:
        i.getInstance().receiveMessage(t, e, n);
        break;
      case a.CHANGE_TURN:
        h.default.getInstance().receiveChangeTurn(t, n);
        break;
      case a.DEAL_CARDS:
        h.default.getInstance().receiveDealCard(t, n);
        break;
      case a.FINISH_GAME:
        h.default.getInstance().receiveFinishGame(t, n);
        break;
      case a.READY_DEAL_CARD:
        h.default.getInstance().receiveReadyDealCard(t, n);
        break;
      case a.FLIP_CARDS:
        this.receiveFlipCards(n);
    }
  };
  e.prototype.requestRaise = function(t) {
    this.sendData(JSON.stringify(this.genMessage({
      cmd: a.RAISE,
      b: t
    })));
  };
  e.prototype.requestCall = function() {
    this.sendData(JSON.stringify(this.genMessage({
      cmd: a.CALL
    })));
  };
  e.prototype.requestCheck = function() {
    this.sendData(JSON.stringify(this.genMessage({
      cmd: a.CHECK
    })));
  };
  e.prototype.requestFold = function() {
    this.sendData(JSON.stringify(this.genMessage({
      cmd: a.FOLD
    })));
  };
  e.prototype.requestGetMoney = function(t) {
    this.sendData(JSON.stringify(this.genMessage({
      cmd: a.BUY_IN,
      m: t
    })));
  };
  e.prototype.requestGetMoneySuccess = function(t) {};
  e.prototype.requestFlipCard = function(t) {
    var e = [];
    e.push(t);
    this.requestFlipListCard(e);
  };
  e.prototype.requestFlipListCard = function(t) {
    this.sendData(JSON.stringify(this.genMessage({
      cmd: a.FLIP_CARDS,
      cs: t
    })));
  };
  e.prototype.receiveBuyInMoney = function(t) {};
  e.prototype.receiveStartBetting = function(t) {};
  e.prototype.receiveFlipCards = function(t) {
    this.onReceiveFlipCards(t);
  };
  e.prototype.requestBuyIn = function(t) {
    var e = [c.Message.MessageType.RoomPlugin_Type, l.getZoneName(), r.default.getInstance().roomID, {
      cmd: a.BUY_IN,
      m: t
    }];
    this.sendData(JSON.stringify(e));
  };
  e.instance = null;
  return e = i = o([d], e);
}(s.default);
i.default = p;
void 0;
