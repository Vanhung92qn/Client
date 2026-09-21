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
  TableViewUtils = require("./TableViewUtils"),
  GamePlayManager = require("./GamePlayManager"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  CardGameCommonRequest = require("./CardGameCommonRequest"),
  GameConfigManager = require("./GameConfigManager"),
  u = cc._decorator,
  d = u.ccclass,
  p = u.property;
(function(t) {
  t[t.ALLROOM = 1] = "ALLROOM";
  t[t.BANRIENG = 2] = "BANRIENG";
  t[t.BANSOLO = 3] = "BANSOLO";
  t[t.BAN3NGUOI = 4] = "BAN3NGUOI";
  t[t.BAN4NGUOI = 5] = "BAN4NGUOI";
  t[t.BAN5NGUOI = 6] = "BAN5NGUOI";
  t[t.BAN9NGUOI = 7] = "BAN9NGUOI";
  t[t.BAN30NGUOI = 8] = "BAN30NGUOI";
  t[t.BAN6NGUOI = 9] = "BAN6NGUOI";
})(a = i.RoomType || (i.RoomType = {}));
var f = function(t) {
  function e() {
    var e = null !== t && t.apply(this, arguments) || this;
    e.scrollView = null;
    e.listFull = null;
    e.txtTitle = null;
    e.tabButtonSkeleton = [];
    e.lblSoNguoiRoom = [];
    e.listRoom = [];
    e.listRoomTemp = [];
    e.rs = [];
    e.pR = [];
    e.isLoaiPhong = 0;
    e.numberTatCa = 0;
    e.numberBanRieng = 0;
    e.numberSolo = 0;
    e.number3Nguoi = 0;
    e.number4Nguoi = 0;
    e.number5Nguoi = 0;
    e.number6Nguoi = 0;
    e.number9Nguoi = 0;
    e.number30Nguoi = 0;
    e.listTabWidget = null;
    e.nodeConbangChongVay = null;
    e.roomConfig = null;
    return e;
  }
  var i;
  n(e, t);
  i = e;
  e.prototype.onLoad = function() {
    if (cc.sys.isMobile) {
      this.node.width = cc.winSize.width;
      this.node.height = cc.winSize.height;
      var t = this.getComponent(cc.Widget);
      if (!(null != t && void 0 != t)) {
        t = new cc.Widget();
      }
      t.target = cc.director.getScene();
    }
    var e = GamePlayManager.default.getInstance().gameID;
    if (e === MessageCardGameHandler.GAME.TIENLEN || e === MessageCardGameHandler.GAME.TLMN) {
      i.roomType = a.BANSOLO;
      var n = parseInt(cc.sys.localStorage.getItem("roomtype" + GamePlayManager.default.getInstance().gameID));
      if (!(isNaN(n) || n === a.BANRIENG)) {
        i.roomType = n;
      }
    } else if (e === MessageCardGameHandler.GAME.SAM) {
      i.roomType = a.BANSOLO;
      n = parseInt(cc.sys.localStorage.getItem("roomtype" + GamePlayManager.default.getInstance().gameID));
      if (!(isNaN(n) || n === a.BANRIENG)) {
        i.roomType = n;
      }
    } else if (e === MessageCardGameHandler.GAME.PHOM || e === MessageCardGameHandler.GAME.BINH) {
      i.roomType = a.BAN4NGUOI;
    } else if (e === MessageCardGameHandler.GAME.CATTE) {
      i.roomType = a.BANSOLO;
      n = parseInt(cc.sys.localStorage.getItem("roomtype" + GamePlayManager.default.getInstance().gameID));
      if (!(isNaN(n) || n === a.BANRIENG)) {
        i.roomType = n;
      }
    } else {
      if (e === MessageCardGameHandler.GAME.XITO) {
        i.roomType = a.ALLROOM;
      } else {
        if (e === MessageCardGameHandler.GAME.XOCDIA) {
          i.roomType = a.ALLROOM;
        } else {
          if (!(e === MessageCardGameHandler.GAME.LIENG)) {
            MessageCardGameHandler.GAME.POKER;
          }
          i.roomType = a.ALLROOM;
        }
      }
    }
    var o = Number(i.roomType) - 1;
    if (this.tabButtonSkeleton.length > o) {
      this.tabButtonSkeleton[o].setAnimation(0, "Button_ON", true);
    }
    this.setLbTallAllCountPeople(0);
  };
  e.prototype.applyConfigRoom = function() {
    var t = GamePlayManager.default.getInstance().gameID;
    if (GameConfigManager.default.getInstance().roomChongQuaySettings.has(t)) {
      this.roomConfig = GameConfigManager.default.getInstance().roomChongQuaySettings.get(t);
      this._setTabNodeActive(0, this.roomConfig.showAllRoom);
      this._setTabNodeActive(1, this.roomConfig.showTablePrivate);
      this._setTabNodeActive(2, this.roomConfig.showTable2);
      this._setTabNodeActive(3, this.roomConfig.showTable3);
      this._setTabNodeActive(4, this.roomConfig.showTable4);
      this._setTabNodeActive(5, this.roomConfig.showTable5);
      this._setTabNodeActive(6, this.roomConfig.showTable9);
      this._setTabNodeActive(7, this.roomConfig.showTable30);
      this._setTabNodeActive(8, this.roomConfig.showTable6);
    }
  };
  e.prototype._setTabNodeActive = function(t, e) {
    if (t < 0 || t >= this.tabButtonSkeleton.length) {
      cc.warn("Wrong index");
    } else if (null !== e && void 0 !== e) {
      var i = this.tabButtonSkeleton[t];
      if (i && i.isValid) {
        i.node.active = e;
      }
    }
  };
  e.prototype.animShow = function() {
    this.scrollView.node.opacity = 0;
    this.scrollView.node.stopAllActions();
    this.scrollView.node.runAction(cc.fadeIn(1).easing(cc.easeBackOut()));
  };
  e.prototype.avtiveTab = function(t, e, i, n, o, a, s) {
    if (!(this.tabButtonSkeleton.length < 4)) {
      this.tabButtonSkeleton[2].node.active = t;
      this.tabButtonSkeleton[3].node.active = e;
      this.tabButtonSkeleton[4].node.active = i;
      this.tabButtonSkeleton[5].node.active = n;
      this.tabButtonSkeleton[6].node.active = o;
      this.tabButtonSkeleton[7].node.active = a;
      this.tabButtonSkeleton[8].node.active = s;
      this.applyConfigRoom();
      for (var r = -1, c = 0, l = 0; l < this.tabButtonSkeleton.length; l++) {
        if (this.tabButtonSkeleton[l].node.active) {
          c++;
          r = l;
        }
      }
      if (1 == c && -1 != r) {
        this.tabButtonSkeleton[r].setAnimation(0, "Button_ON", true);
      }
    }
  };
  e.prototype.initListRoom = function() {
    var t = this;
    this.listRoom = [];
    this.rs.forEach(function(e) {
      t.listRoom.push(e);
    });
    if (!GameConfigManager.default.getInstance().ignorePrivateRoom) {
      this.pR.forEach(function(e) {
        t.listRoom.push(e);
      });
    }
    this.srs.forEach(function(e) {
      t.listRoom.push(e);
    });
    if (GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.XOCDIA) {
      this.listRoom = this.listRoom.filter(function(t) {
        return t.Mu !== GameConfigManager.default.getInstance().roomMaxUserIgnore;
      });
    }
    try {
      if (!(GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.XOCDIA && GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.POKER && GamePlayManager.default
          .getInstance().gameID !== MessageCardGameHandler.GAME.LIENG && GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.XITO && GamePlayManager.default.getInstance().gameID !==
          MessageCardGameHandler.GAME.BACAY)) {
        this.createEmtyRoom(this.listRoom);
      }
    } catch (t) {}
    this.listRoom.sort(function(t, e) {
      return t.Mu - e.Mu;
    });
    this.listRoom.sort(function(t, e) {
      return t.b - e.b;
    });
    this.listRoom.sort(function(t) {
      return true !== t.hpwd ? -1 : 1;
    });
    this.listRoom.sort(function(t) {
      return true !== t.hpwd ? -1 : 1;
    });
    if (GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.XOCDIA) {
      this.listRoom.sort(function(t, e) {
        return t.Mu >= 1e3 && e.Mu >= 1e3 ? t.b === e.b ? t.Mu - e.Mu : t.b - e.b : t.Mu >= 1e3 ? -1 : 1;
      });
    }
    if (GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.BACAY) {
      this.listRoom.sort(function(t, e) {
        return e.uC - t.uC;
      });
      this.listRoom.sort(function(t, e) {
        return e.b - t.b;
      });
      this.listRoom.sort(function(t, e) {
        return t.uC > 0 && e.uC > 0 ? e.b - t.b : 0 == t.uC ? 1 : -1;
      });
    }
    this.resetSoNguoi();
    this.listRoom.forEach(function(e) {
      if (!e.hpwd) {
        if (2 === e.Mu) {
          t.numberSolo += e.uC;
        } else {
          if (3 === e.Mu) {
            t.number3Nguoi += e.uC;
          } else {
            if (4 === e.Mu) {
              t.number4Nguoi += e.uC;
            } else {
              if (5 === e.Mu) {
                t.number5Nguoi += e.uC;
              } else {
                if (6 === e.Mu) {
                  t.number6Nguoi += e.uC;
                } else {
                  if (9 === e.Mu) {
                    t.number9Nguoi += e.uC;
                  } else {
                    if (30 === e.Mu) {
                      t.number30Nguoi += e.uC;
                    }
                  }
                }
              }
            }
          }
        }
      }
      t.numberTatCa += e.uC;
    });
    this.numberBanRieng = 0;
    this.pR.forEach(function(e) {
      t.numberBanRieng += e.uC;
    });
    if (this.lblSoNguoiRoom.length > 4) {
      this.setLbTallAllCountPeople(this.numberTatCa);
      this.lblSoNguoiRoom[1].string = "B\xc0N RI\xcaNG (" + this.numberBanRieng + ")";
      this.lblSoNguoiRoom[2].string = "B\xc0N SOLO (" + this.numberSolo + ")";
      this.lblSoNguoiRoom[3].string = "B\xc0N 3 NG\u01af\u1edcI (" + this.number3Nguoi + ")";
      this.lblSoNguoiRoom[4].string = "B\xc0N 4 NG\u01af\u1edcI (" + this.number4Nguoi + ")";
      this.lblSoNguoiRoom[5].string = "B\xc0N 5 NG\u01af\u1edcI (" + this.number5Nguoi + ")";
      this.lblSoNguoiRoom[6].string = "B\xc0N 9 NG\u01af\u1edcI (" + this.number9Nguoi + ")";
      this.lblSoNguoiRoom[7].string = "B\xc0N 30 NG\u01af\u1edcI (" + this.number30Nguoi + ")";
      this.lblSoNguoiRoom[8].string = "B\xc0N 6 NG\u01af\u1edcI (" + this.number6Nguoi + ")";
    }
    if (this.roomConfig && this.roomConfig.usePrivateForAllRoom) {
      this.setLbTallAllCountPeople(this.numberBanRieng);
    }
  };
  e.prototype.resetSoNguoi = function() {
    this.numberTatCa = 0;
    this.numberBanRieng = 0;
    this.numberSolo = 0;
    this.number3Nguoi = 0;
    this.number4Nguoi = 0;
    this.number5Nguoi = 0;
    this.number6Nguoi = 0;
    this.number9Nguoi = 0;
    this.number30Nguoi = 0;
  };
  e.prototype.updateListFull = function(t, e, n, o) {
    switch (void 0 === e && (e = []), void 0 === n && (n = []), void 0 === o && (o = false), this.rs = t, this.pR = e, this.srs = n,
      this.initListRoom(), Number(i.roomType)) {
      case a.ALLROOM:
        this.sortAllRoom();
        break;
      case a.BANRIENG:
        this.sortPhongRieng();
        break;
      case a.BANSOLO:
        this.sortPhongTheoNguoi(2);
        break;
      case a.BAN3NGUOI:
        this.sortPhongTheoNguoi(3);
        break;
      case a.BAN4NGUOI:
        this.sortPhongTheoNguoi(4);
        break;
      case a.BAN5NGUOI:
        this.sortPhongTheoNguoi(5);
        break;
      case a.BAN6NGUOI:
        this.sortPhongTheoNguoi(6);
        break;
      case a.BAN9NGUOI:
        this.sortPhongTheoNguoi(9);
        break;
      case a.BAN30NGUOI:
        this.sortPhongTheoNguoi(30);
    }
    this.listFull.init(this.listRoom, 3, true, false, o);
  };
  e.prototype.createEmtyRoom = function(t) {
    for (var e = [], i = [], n = 0; n < t.length; n++) {
      if (i.indexOf(t[n].b) < 0 && !t[n].hpwd && t[n].Mu <= 30) {
        i.push(t[n].b);
        e.push([]);
        e[i.indexOf(t[n].b)].push(t[n]);
      } else {
        if (i.indexOf(t[n].b) > -1 && !t[n].hpwd && t[n].Mu <= 30) {
          e[i.indexOf(t[n].b)].push(t[n]);
        }
      }
    }
    for (n = 0; n < e.length; n++) {
      for (var o = true, a = 0; a < e[n].length; a++) {
        if (0 === e[n][a].uC) {
          o = false;
          break;
        }
      }
      if (o && void 0 !== e[n][0] && null !== e[n][0]) {
        var s = {
          mM: e[n][0].mM,
          b: e[n][0].b,
          gid: e[n][0].gid,
          MMBI: e[n][0].MMBI,
          hpwd: false,
          Mu: e[n][0].Mu,
          rid: -1,
          uC: 0,
          sid: 1,
          zn: this.getZoneName(),
          mMBI: e[n][0].mMBI,
          rn: e[n][0].rn,
          aid: 1,
          inc: false
        };
        if (!(GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.POKER && GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.LIENG && GamePlayManager.default
            .getInstance().gameID !== MessageCardGameHandler.GAME.BACAY)) {
          s.Mu = 9;
        }
        this.listRoom.push(s);
      }
    }
  };
  e.prototype.sortAllRoom = function() {};
  e.prototype.sortPhongRieng = function() {
    var t = this;
    this.listRoomTemp = [];
    this.listRoom.forEach(function(e) {
      if (e.hpwd) {
        t.listRoomTemp.push(e);
      }
    });
    this.listRoom = this.listRoomTemp;
  };
  e.prototype.sortPhongTheoNguoi = function(t) {
    var e = this;
    this.listRoomTemp = [];
    this.listRoom.forEach(function(i) {
      if (!(i.hpwd || i.Mu !== t)) {
        e.listRoomTemp.push(i);
      }
    });
    this.listRoom = this.listRoomTemp;
  };
  e.prototype.chooseRoomType = function(t, e) {
    if (e != i.roomType) {
      if (this.tabButtonSkeleton.length > 4) {
        this.tabButtonSkeleton[Number(i.roomType) - 1].setAnimation(0, "Button_OFF", false);
      }
      i.roomType = e;
      if (this.tabButtonSkeleton.length > 4) {
        this.tabButtonSkeleton[Number(i.roomType) - 1].setAnimation(0, "Button_ON", true);
      }
      this.scrollView.stopAutoScroll();
      this.scrollView.scrollToOffset(new cc.Vec2(this.scrollView.getScrollOffset().x, 0), 0, true);
      this.updateListFull(this.rs, this.pR, this.srs, true);
      cc.sys.localStorage.setItem("roomtype" + GamePlayManager.default.getInstance().gameID, e);
    }
  };
  e.prototype.showWebMobileIos = function(t) {
    if (null !== this.listTabWidget && void 0 !== this.listTabWidget) {
      this.nodeConbangChongVay.active = t ? !t : t;
    }
  };
  e.prototype.getZoneName = function() {
    return CardGameCommonRequest.default.getInstance().getZoneName();
  };
  e.prototype.setLbTallAllCountPeople = function(t) {
    if (0 !== this.lblSoNguoiRoom.length) {
      if (GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.PHOM) {
        this.lblSoNguoiRoom[0].string = "PH\u1eceM (" + t + ")";
      } else {
        if (GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.BINH) {
          this.lblSoNguoiRoom[0].string = "M\u1eacU BINH (" + t + ")";
        } else {
          this.lblSoNguoiRoom[0].string = "T\u1ea4T C\u1ea2 (" + t + ")";
        }
      }
    }
  };
  o([p(cc.ScrollView)], e.prototype, "scrollView", void 0);
  o([p(TableViewUtils.default)], e.prototype, "listFull", void 0);
  o([p(cc.Widget)], e.prototype, "txtTitle", void 0);
  o([p(sp.Skeleton)], e.prototype, "tabButtonSkeleton", void 0);
  o([p(cc.Label)], e.prototype, "lblSoNguoiRoom", void 0);
  o([p(cc.Widget)], e.prototype, "listTabWidget", void 0);
  o([p(cc.Node)], e.prototype, "nodeConbangChongVay", void 0);
  return e = i = o([d], e);
}(cc.Component);
i.default = f;
void 0;
