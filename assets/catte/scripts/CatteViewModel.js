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
var a = require("MainGameViewModel"),
  s = require("GamePlayManager"),
  r = require("MessageCardGameHandler"),
  c = require("CatteController"),
  l = require("BaseScene"),
  h = require("GameDefine"),
  u = cc._decorator,
  d = u.ccclass,
  p = u.property,
  f = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.controller = null;
      e.prefabController = null;
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {
      s.default.getInstance().gameID = r.GAME.CATTE;
      var e = cc.instantiate(this.prefabController);
      e.parent = this.mainUiNode;
      this.controller = e.getComponent(c.default);
      this.mainGameController = this.controller;
      e.active = false;
      t.prototype.onLoad.call(this);
      this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function() {}), cc.delayTime(4), cc.callFunc(function() {})));
      l.default.currentSceneName = h.GameConfigs.SceneName.Catte;
    };
    e.prototype.checkAndShowtestData = function(t) {
      if (t === r.Global_Message.GET_TABLES) {
        var e = [5, {
          rs: [{
            mM: 1e4,
            b: 1e3,
            gid: 4,
            MMBI: 0,
            hpwd: false,
            Mu: 6,
            ahp: false,
            rid: 57,
            uC: 0,
            sid: 1,
            zn: "Simms",
            mMBI: 0,
            rn: "ChinesePoker#2",
            aid: 1,
            inc: false
          }, {
            mM: 5e5,
            b: 5e4,
            gid: 4,
            MMBI: 0,
            hpwd: false,
            Mu: 2,
            ahp: false,
            rid: 62,
            uC: 0,
            sid: 1,
            zn: "Simms",
            mMBI: 0,
            rn: "ChinesePoker#7",
            aid: 1,
            inc: false
          }, {
            mM: 500,
            b: 100,
            gid: 4,
            MMBI: 0,
            hpwd: false,
            Mu: 2,
            ahp: false,
            rid: 55,
            uC: 0,
            sid: 1,
            zn: "Simms",
            mMBI: 0,
            rn: "ChinesePoker#0",
            aid: 1,
            inc: false
          }, {
            mM: 2e4,
            b: 2e3,
            gid: 4,
            MMBI: 0,
            hpwd: false,
            Mu: 6,
            ahp: false,
            rid: 58,
            uC: 0,
            sid: 1,
            zn: "Simms",
            mMBI: 0,
            rn: "ChinesePoker#3",
            aid: 1,
            inc: false
          }, {
            mM: 2e5,
            b: 2e4,
            gid: 4,
            MMBI: 0,
            hpwd: false,
            Mu: 6,
            ahp: false,
            rid: 61,
            uC: 0,
            sid: 1,
            zn: "Simms",
            mMBI: 0,
            rn: "ChinesePoker#6",
            aid: 1,
            inc: false
          }, {
            mM: 5e3,
            b: 500,
            gid: 4,
            MMBI: 0,
            hpwd: false,
            Mu: 6,
            ahp: false,
            rid: 56,
            uC: 0,
            sid: 1,
            zn: "Simms",
            mMBI: 0,
            rn: "ChinesePoker#1",
            aid: 1,
            inc: false
          }, {
            mM: 5e4,
            b: 5e3,
            gid: 4,
            MMBI: 0,
            hpwd: false,
            Mu: 6,
            ahp: false,
            rid: 59,
            uC: 0,
            sid: 1,
            zn: "Simms",
            mMBI: 0,
            rn: "ChinesePoker#4",
            aid: 1,
            inc: false
          }, {
            mM: 1e5,
            b: 1e4,
            gid: 4,
            MMBI: 0,
            hpwd: false,
            Mu: 6,
            ahp: false,
            rid: 60,
            uC: 0,
            sid: 1,
            zn: "Simms",
            mMBI: 0,
            rn: "ChinesePoker#5",
            aid: 1,
            inc: false
          }],
          pR: [],
          ahp: [{
            mM: 5e4,
            b: 5e3,
            gid: 4,
            MMBI: 0,
            hpwd: false,
            Mu: 6,
            ahp: true,
            rid: 67,
            uC: 0,
            sid: 1,
            zn: "Simms",
            mMBI: 0,
            rn: "ChinesePoker#12",
            aid: 1,
            inc: false
          }, {
            mM: 500,
            b: 100,
            gid: 4,
            MMBI: 0,
            hpwd: false,
            Mu: 6,
            ahp: true,
            rid: 63,
            uC: 0,
            sid: 1,
            zn: "Simms",
            mMBI: 0,
            rn: "ChinesePoker#8",
            aid: 1,
            inc: false
          }, {
            mM: 5e5,
            b: 5e4,
            gid: 4,
            MMBI: 0,
            hpwd: false,
            Mu: 6,
            ahp: true,
            rid: 70,
            uC: 0,
            sid: 1,
            zn: "Simms",
            mMBI: 0,
            rn: "ChinesePoker#15",
            aid: 1,
            inc: false
          }, {
            mM: 1e4,
            b: 1e3,
            gid: 4,
            MMBI: 0,
            hpwd: false,
            Mu: 6,
            ahp: true,
            rid: 65,
            uC: 0,
            sid: 1,
            zn: "Simms",
            mMBI: 0,
            rn: "ChinesePoker#10",
            aid: 1,
            inc: false
          }, {
            mM: 2e4,
            b: 2e3,
            gid: 4,
            MMBI: 0,
            hpwd: false,
            Mu: 6,
            ahp: true,
            rid: 66,
            uC: 0,
            sid: 1,
            zn: "Simms",
            mMBI: 0,
            rn: "ChinesePoker#11",
            aid: 1,
            inc: false
          }, {
            mM: 2e5,
            b: 2e4,
            gid: 4,
            MMBI: 0,
            hpwd: false,
            Mu: 6,
            ahp: true,
            rid: 69,
            uC: 0,
            sid: 1,
            zn: "Simms",
            mMBI: 0,
            rn: "ChinesePoker#14",
            aid: 1,
            inc: false
          }, {
            mM: 5e3,
            b: 500,
            gid: 4,
            MMBI: 0,
            hpwd: false,
            Mu: 6,
            ahp: true,
            rid: 64,
            uC: 0,
            sid: 1,
            zn: "Simms",
            mMBI: 0,
            rn: "ChinesePoker#9",
            aid: 1,
            inc: false
          }, {
            mM: 1e5,
            b: 1e4,
            gid: 4,
            MMBI: 0,
            hpwd: false,
            Mu: 6,
            ahp: true,
            rid: 68,
            uC: 0,
            sid: 1,
            zn: "Simms",
            mMBI: 0,
            rn: "ChinesePoker#13",
            aid: 1,
            inc: false
          }],
          cmd: 300
        }];
        this.onReceiveMessage(t, e, e[1]);
      } else if (t === r.Global_Message.INGAME_JOIN_TABLE_INFOS) {
        this.onWSCardJoinRoom([3, true, 0, 960995, null]);
        e = [5, {
          b: 1e3,
          tfeg: 4e3,
          tft: 2e4,
          ps: [{
            a: "Avatar42",
            pS: 1,
            C: false,
            rmC: 11,
            dn: "Tientien205",
            pid: 0,
            m: 158700,
            uid: "1_7671268",
            r: false,
            As: {
              gold: 15e4
            },
            pi: true,
            id: 0,
            sit: 0
          }, {
            a: "Avatar42",
            pS: 1,
            C: true,
            rmC: 11,
            dn: "Hieuvip63002",
            pid: 0,
            m: 158700,
            uid: "1_30288447",
            r: false,
            As: {
              gold: 15e4
            },
            pi: true,
            id: 0,
            sit: 3
          }, {
            a: "",
            pS: 3,
            C: false,
            rmC: 13,
            dn: "quangmeo1982",
            pid: 0,
            m: 98038,
            uid: "1_9845035",
            r: true,
            As: {
              gold: 94158
            },
            pi: true,
            id: 0,
            sit: 2
          }, {
            a: "Avatar12",
            pS: 0,
            C: false,
            rmC: 0,
            dn: "jackjac3",
            pid: 0,
            m: 1408958,
            cs: [],
            uid: "1_50193",
            r: false,
            As: {
              gold: 1408958
            },
            pi: false,
            id: 0,
            sit: 1
          }],
          tFDC: 3e3,
          hpwd: false,
          Mu: 6,
          ahp: false,
          ldc: [8, 11],
          gS: 4,
          re: false,
          rmT: 15568,
          cmd: 202,
          aid: 1,
          inc: false
        }];
        this.onReceiveMessage(t, e, e[1]);
      }
    };
    o([p(cc.Prefab)], e.prototype, "prefabController", void 0);
    return e = o([d], e);
  }(a.default);
i.default = f;
void 0;
