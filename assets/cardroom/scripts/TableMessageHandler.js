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
var a = require("MessageHandlerBase"),
  s = require("GameDefine"),
  r = require("MessageCardGameHandler"),
  c = require("GamePlayManager"),
  l = require("NetworkConfig"),
  h = cc._decorator,
  u = h.ccclass,
  d = (h.property, function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.onReceiveMessage = function(t, e, i) {};
      e.onReceiveReady = function(t, e) {};
      e.onReceiveBuyIn = function(t, e) {};
      e.onReceiveStandUp = function(t, e) {};
      e.onReceiveLeaveRoom = function(t) {};
      e.onReceiveReadyDealCard = function(t, e) {};
      e.onReceiveUpdateInGameMoney = function(t, e) {};
      e.onReceiveDealCard = function(t, e) {};
      e.onReceiveChangeTurn = function(t, e) {};
      e.onReceiveFinishGame = function(t, e) {};
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
      return "TableMessageHandler";
    };
    e.prototype.genMessage = function(t, e) {
      return [r.Message.MessageType.RoomPlugin_Type, l.getZoneName(), t, e];
    };
    e.prototype.requestReady = function(t) {
      if (void 0 === t) {
        t = -1;
      }
      if (-1 == t) {
        t = c.default.getInstance().roomID;
      }
      var e = this.genMessage(t, {
        cmd: r.TableCommand.READY
      });
      this.sendData(JSON.stringify(e));
    };
    e.prototype.requestStartGame = function(t) {
      if (void 0 === t) {
        t = -1;
      }
      if (-1 == t) {
        t = c.default.getInstance().roomID;
      }
      var e = c.default.getInstance().gameID,
        i = r.TableCommand.START;
      i = e == s.GameID.LIENG ? r.TableCommand.AUTO_START : c.default.getInstance().isAutoStart ? r.TableCommand.AUTO_START : r
        .TableCommand.START;
      var n = this.genMessage(t, {
        cmd: i
      });
      this.sendData(JSON.stringify(n));
    };
    e.prototype.requestReadyDealCard = function(t) {};
    e.prototype.requestStandUp = function(t) {};
    e.prototype.requestBuyIn = function(t) {};
    e.prototype.requestLeaveRoom = function(t) {
      if (void 0 === t) {
        t = -1;
      }
      if (-1 == t) {
        t = c.default.getInstance().roomID;
      }
      var e = [r.Message.MessageType.LeaveRoom_Type, l.getZoneName(), t];
      this.sendData(JSON.stringify(e));
    };
    e.prototype.receiveMessage = function(e, i, n) {
      switch (t.prototype.receiveMessage.call(this, e, i, n), e) {
        case r.TableCommand.READY:
          this.onReceiveReady(e, n);
          break;
        case r.TableCommand.BUY_IN:
          this.onReceiveBuyIn(e, n);
          break;
        case r.TableCommand.STAND_UP:
          this.onReceiveStandUp(e, n);
      }
      this.onReceiveMessage(e, i, n);
    };
    e.prototype.receiveUpdateInGameMoney = function(t, e) {
      this.onReceiveUpdateInGameMoney(t, e);
    };
    e.prototype.receiveReadyDealCard = function(t, e) {
      this.onReceiveReadyDealCard(t, e);
    };
    e.prototype.receiveDealCard = function(t, e) {
      this.onReceiveDealCard(t, e);
    };
    e.prototype.receiveLeaveRoom = function(t) {
      this.onReceiveLeaveRoom(t);
    };
    e.prototype.receiveChangeTurn = function(t, e) {
      this.onReceiveChangeTurn(t, e);
    };
    e.prototype.receiveFinishGame = function(t, e) {
      this.onReceiveFinishGame(t, e);
    };
    e.instance = null;
    return e = i = o([u], e);
  }(a.default));
i.default = d;
void 0;
