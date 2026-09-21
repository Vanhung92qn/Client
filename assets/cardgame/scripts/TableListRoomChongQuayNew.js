var t = require,
  e = module,
  moduleExports = exports;
"use strict";
void 0;
var __extends = this && this.__extends || function() {
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
  __decorate = this && this.__decorate || function(t, e, i, n) {
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
var RoomType,
  TableViewUtils = require("./TableViewUtils"),
  GamePlayManager = require("./GamePlayManager"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  CardGameCommonRequest = require("./CardGameCommonRequest"),
  GameConfigManager = require("./GameConfigManager"),
  decorator = cc._decorator,
  ccclass = decorator.ccclass,
  property = decorator.property;
(function(RoomType) {
  RoomType[RoomType.ALLROOM = 1] = "ALLROOM";
  RoomType[RoomType.BANRIENG = 2] = "BANRIENG";
  RoomType[RoomType.BANSOLO = 3] = "BANSOLO";
  RoomType[RoomType.BAN3NGUOI = 4] = "BAN3NGUOI";
  RoomType[RoomType.BAN4NGUOI = 5] = "BAN4NGUOI";
  RoomType[RoomType.BAN5NGUOI = 6] = "BAN5NGUOI";
  RoomType[RoomType.BAN9NGUOI = 7] = "BAN9NGUOI";
  RoomType[RoomType.BAN30NGUOI = 8] = "BAN30NGUOI";
  RoomType[RoomType.BAN6NGUOI = 9] = "BAN6NGUOI";
})(RoomType = moduleExports.RoomType || (moduleExports.RoomType = {}));
var TableListRoomChongQuayNew = function(superClass) {
  function TableListRoomChongQuayNew() {
    var instance = null !== superClass && superClass.apply(this, arguments) || this;
    instance.scrollView = null;
    instance.listFull = null;
    instance.txtTitle = null;
    instance.tabButtonSkeleton = [];
    instance.lblSoNguoiRoom = [];
    instance.listRoom = [];
    instance.listRoomTemp = [];
    instance.rs = [];
    instance.pR = [];
    instance.isLoaiPhong = 0;
    instance.numberTatCa = 0;
    instance.numberBanRieng = 0;
    instance.numberSolo = 0;
    instance.number3Nguoi = 0;
    instance.number4Nguoi = 0;
    instance.number5Nguoi = 0;
    instance.number6Nguoi = 0;
    instance.number9Nguoi = 0;
    instance.number30Nguoi = 0;
    instance.listTabWidget = null;
    instance.nodeConbangChongVay = null;
    instance.roomConfig = null;
    return instance;
  }
  var TableListRoomChongQuayNew_1;
  __extends(TableListRoomChongQuayNew, superClass);
  TableListRoomChongQuayNew_1 = TableListRoomChongQuayNew;
  TableListRoomChongQuayNew.prototype.onLoad = function() {
    if (cc.sys.isMobile) {
      this.node.width = cc.winSize.width;
      this.node.height = cc.winSize.height;
      var widget = this.getComponent(cc.Widget);
      if (!(null != widget && void 0 != widget)) {
        widget = new cc.Widget();
      }
      widget.target = cc.director.getScene();
    }
    var gameId = GamePlayManager.default.getInstance().gameID;
    if (gameId === MessageCardGameHandler.GAME.TIENLEN || gameId === MessageCardGameHandler.GAME.TLMN) {
      TableListRoomChongQuayNew_1.roomType = RoomType.BANSOLO;
      var savedRoomType = parseInt(cc.sys.localStorage.getItem("roomtype" + GamePlayManager.default.getInstance().gameID));
      if (!(isNaN(savedRoomType) || savedRoomType === RoomType.BANRIENG)) {
        TableListRoomChongQuayNew_1.roomType = savedRoomType;
      }
    } else if (gameId === MessageCardGameHandler.GAME.SAM) {
      TableListRoomChongQuayNew_1.roomType = RoomType.BANSOLO;
      savedRoomType = parseInt(cc.sys.localStorage.getItem("roomtype" + GamePlayManager.default.getInstance().gameID));
      if (!(isNaN(savedRoomType) || savedRoomType === RoomType.BANRIENG)) {
        TableListRoomChongQuayNew_1.roomType = savedRoomType;
      }
    } else if (gameId === MessageCardGameHandler.GAME.PHOM || gameId === MessageCardGameHandler.GAME.BINH) {
      TableListRoomChongQuayNew_1.roomType = RoomType.BAN4NGUOI;
    } else if (gameId === MessageCardGameHandler.GAME.CATTE) {
      TableListRoomChongQuayNew_1.roomType = RoomType.BANSOLO;
      savedRoomType = parseInt(cc.sys.localStorage.getItem("roomtype" + GamePlayManager.default.getInstance().gameID));
      if (!(isNaN(savedRoomType) || savedRoomType === RoomType.BANRIENG)) {
        TableListRoomChongQuayNew_1.roomType = savedRoomType;
      }
    } else {
      if (gameId === MessageCardGameHandler.GAME.XITO) {
        TableListRoomChongQuayNew_1.roomType = RoomType.ALLROOM;
      } else {
        if (gameId === MessageCardGameHandler.GAME.XOCDIA) {
          TableListRoomChongQuayNew_1.roomType = RoomType.ALLROOM;
        } else {
          if (!(gameId === MessageCardGameHandler.GAME.LIENG)) {
            MessageCardGameHandler.GAME.POKER;
          }
          TableListRoomChongQuayNew_1.roomType = RoomType.ALLROOM;
        }
      }
    }
    var tabIndex = Number(TableListRoomChongQuayNew_1.roomType) - 1;
    if (this.tabButtonSkeleton.length > tabIndex) {
      this.tabButtonSkeleton[tabIndex].setAnimation(0, "Button_ON", true);
    }
    this.setLbTallAllCountPeople(0);
  };
  TableListRoomChongQuayNew.prototype.applyConfigRoom = function() {
    var gameId = GamePlayManager.default.getInstance().gameID;
    if (GameConfigManager.default.getInstance().roomChongQuaySettings.has(gameId)) {
      this.roomConfig = GameConfigManager.default.getInstance().roomChongQuaySettings.get(gameId);
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
  TableListRoomChongQuayNew.prototype._setTabNodeActive = function(tabIndex, isActive) {
    if (tabIndex < 0 || tabIndex >= this.tabButtonSkeleton.length) {
      cc.warn("Wrong index");
    } else if (null !== isActive && void 0 !== isActive) {
      var tabSkeleton = this.tabButtonSkeleton[tabIndex];
      if (tabSkeleton && tabSkeleton.isValid) {
        tabSkeleton.node.active = isActive;
      }
    }
  };
  TableListRoomChongQuayNew.prototype.animShow = function() {
    this.scrollView.node.opacity = 0;
    this.scrollView.node.stopAllActions();
    this.scrollView.node.runAction(cc.fadeIn(1).easing(cc.easeBackOut()));
  };
  TableListRoomChongQuayNew.prototype.avtiveTab = function(showTable2, showTable3, showTable4, showTable5, showTable9, showTable30, showTable6) {
    if (!(this.tabButtonSkeleton.length < 4)) {
      this.tabButtonSkeleton[2].node.active = showTable2;
      this.tabButtonSkeleton[3].node.active = showTable3;
      this.tabButtonSkeleton[4].node.active = showTable4;
      this.tabButtonSkeleton[5].node.active = showTable5;
      this.tabButtonSkeleton[6].node.active = showTable9;
      this.tabButtonSkeleton[7].node.active = showTable30;
      this.tabButtonSkeleton[8].node.active = showTable6;
      this.applyConfigRoom();
      for (var activeTabIndex = -1, activeCount = 0, tabIndex = 0; tabIndex < this.tabButtonSkeleton.length; tabIndex++) {
        if (this.tabButtonSkeleton[tabIndex].node.active) {
          activeCount++;
          activeTabIndex = tabIndex;
        }
      }
      if (1 == activeCount && -1 != activeTabIndex) {
        this.tabButtonSkeleton[activeTabIndex].setAnimation(0, "Button_ON", true);
      }
    }
  };
  TableListRoomChongQuayNew.prototype.initListRoom = function() {
    var self = this;
    this.listRoom = [];
    this.rs.forEach(function(room) {
      self.listRoom.push(room);
    });
    if (!GameConfigManager.default.getInstance().ignorePrivateRoom) {
      this.pR.forEach(function(room) {
        self.listRoom.push(room);
      });
    }
    this.srs.forEach(function(room) {
      self.listRoom.push(room);
    });
    if (GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.XOCDIA) {
      this.listRoom = this.listRoom.filter(function(room) {
        return room.Mu !== GameConfigManager.default.getInstance().roomMaxUserIgnore;
      });
    }
    try {
      if (!(GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.XOCDIA && GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.POKER && GamePlayManager.default
          .getInstance().gameID !== MessageCardGameHandler.GAME.LIENG && GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.XITO && GamePlayManager.default.getInstance().gameID !==
          MessageCardGameHandler.GAME.BACAY)) {
        this.createEmtyRoom(this.listRoom);
      }
    } catch (error) {}
    this.listRoom.sort(function(roomA, roomB) {
      return roomA.Mu - roomB.Mu;
    });
    this.listRoom.sort(function(roomA, roomB) {
      return roomA.b - roomB.b;
    });
    this.listRoom.sort(function(room) {
      return true !== room.hpwd ? -1 : 1;
    });
    this.listRoom.sort(function(room) {
      return true !== room.hpwd ? -1 : 1;
    });
    if (GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.XOCDIA) {
      this.listRoom.sort(function(roomA, roomB) {
        return roomA.Mu >= 1e3 && roomB.Mu >= 1e3 ? roomA.b === roomB.b ? roomA.Mu - roomB.Mu : roomA.b - roomB.b : roomA.Mu >= 1e3 ? -1 : 1;
      });
    }
    if (GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.BACAY) {
      this.listRoom.sort(function(roomA, roomB) {
        return roomB.uC - roomA.uC;
      });
      this.listRoom.sort(function(roomA, roomB) {
        return roomB.b - roomA.b;
      });
      this.listRoom.sort(function(roomA, roomB) {
        return roomA.uC > 0 && roomB.uC > 0 ? roomB.b - roomA.b : 0 == roomA.uC ? 1 : -1;
      });
    }
    this.resetSoNguoi();
    this.listRoom.forEach(function(room) {
      if (!room.hpwd) {
        if (2 === room.Mu) {
          self.numberSolo += room.uC;
        } else {
          if (3 === room.Mu) {
            self.number3Nguoi += room.uC;
          } else {
            if (4 === room.Mu) {
              self.number4Nguoi += room.uC;
            } else {
              if (5 === room.Mu) {
                self.number5Nguoi += room.uC;
              } else {
                if (6 === room.Mu) {
                  self.number6Nguoi += room.uC;
                } else {
                  if (9 === room.Mu) {
                    self.number9Nguoi += room.uC;
                  } else {
                    if (30 === room.Mu) {
                      self.number30Nguoi += room.uC;
                    }
                  }
                }
              }
            }
          }
        }
      }
      self.numberTatCa += room.uC;
    });
    this.numberBanRieng = 0;
    this.pR.forEach(function(room) {
      self.numberBanRieng += room.uC;
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
  TableListRoomChongQuayNew.prototype.resetSoNguoi = function() {
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
  TableListRoomChongQuayNew.prototype.updateListFull = function(rooms, privateRooms, srsRooms, playItemAnim) {
    switch (void 0 === privateRooms && (privateRooms = []), void 0 === srsRooms && (srsRooms = []), void 0 === playItemAnim && (playItemAnim = false), this.rs = rooms, this.pR = privateRooms, this.srs = srsRooms,
      this.initListRoom(), Number(TableListRoomChongQuayNew_1.roomType)) {
      case RoomType.ALLROOM:
        this.sortAllRoom();
        break;
      case RoomType.BANRIENG:
        this.sortPhongRieng();
        break;
      case RoomType.BANSOLO:
        this.sortPhongTheoNguoi(2);
        break;
      case RoomType.BAN3NGUOI:
        this.sortPhongTheoNguoi(3);
        break;
      case RoomType.BAN4NGUOI:
        this.sortPhongTheoNguoi(4);
        break;
      case RoomType.BAN5NGUOI:
        this.sortPhongTheoNguoi(5);
        break;
      case RoomType.BAN6NGUOI:
        this.sortPhongTheoNguoi(6);
        break;
      case RoomType.BAN9NGUOI:
        this.sortPhongTheoNguoi(9);
        break;
      case RoomType.BAN30NGUOI:
        this.sortPhongTheoNguoi(30);
    }
    this.listFull.init(this.listRoom, 3, true, false, playItemAnim);
  };
  TableListRoomChongQuayNew.prototype.createEmtyRoom = function(rooms) {
    for (var roomsByBet = [], betLevels = [], index = 0; index < rooms.length; index++) {
      if (betLevels.indexOf(rooms[index].b) < 0 && !rooms[index].hpwd && rooms[index].Mu <= 30) {
        betLevels.push(rooms[index].b);
        roomsByBet.push([]);
        roomsByBet[betLevels.indexOf(rooms[index].b)].push(rooms[index]);
      } else {
        if (betLevels.indexOf(rooms[index].b) > -1 && !rooms[index].hpwd && rooms[index].Mu <= 30) {
          roomsByBet[betLevels.indexOf(rooms[index].b)].push(rooms[index]);
        }
      }
    }
    for (index = 0; index < roomsByBet.length; index++) {
      for (var allRoomsOccupied = true, groupRoomIndex = 0; groupRoomIndex < roomsByBet[index].length; groupRoomIndex++) {
        if (0 === roomsByBet[index][groupRoomIndex].uC) {
          allRoomsOccupied = false;
          break;
        }
      }
      if (allRoomsOccupied && void 0 !== roomsByBet[index][0] && null !== roomsByBet[index][0]) {
        var emptyRoom = {
          mM: roomsByBet[index][0].mM,
          b: roomsByBet[index][0].b,
          gid: roomsByBet[index][0].gid,
          MMBI: roomsByBet[index][0].MMBI,
          hpwd: false,
          Mu: roomsByBet[index][0].Mu,
          rid: -1,
          uC: 0,
          sid: 1,
          zn: this.getZoneName(),
          mMBI: roomsByBet[index][0].mMBI,
          rn: roomsByBet[index][0].rn,
          aid: 1,
          inc: false
        };
        if (!(GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.POKER && GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.LIENG && GamePlayManager.default
            .getInstance().gameID !== MessageCardGameHandler.GAME.BACAY)) {
          emptyRoom.Mu = 9;
        }
        this.listRoom.push(emptyRoom);
      }
    }
  };
  TableListRoomChongQuayNew.prototype.sortAllRoom = function() {};
  TableListRoomChongQuayNew.prototype.sortPhongRieng = function() {
    var self = this;
    this.listRoomTemp = [];
    this.listRoom.forEach(function(room) {
      if (room.hpwd) {
        self.listRoomTemp.push(room);
      }
    });
    this.listRoom = this.listRoomTemp;
  };
  TableListRoomChongQuayNew.prototype.sortPhongTheoNguoi = function(maxSeats) {
    var self = this;
    this.listRoomTemp = [];
    this.listRoom.forEach(function(room) {
      if (!(room.hpwd || room.Mu !== maxSeats)) {
        self.listRoomTemp.push(room);
      }
    });
    this.listRoom = this.listRoomTemp;
  };
  TableListRoomChongQuayNew.prototype.chooseRoomType = function(event, roomType) {
    if (roomType != TableListRoomChongQuayNew_1.roomType) {
      if (this.tabButtonSkeleton.length > 4) {
        this.tabButtonSkeleton[Number(TableListRoomChongQuayNew_1.roomType) - 1].setAnimation(0, "Button_OFF", false);
      }
      TableListRoomChongQuayNew_1.roomType = roomType;
      if (this.tabButtonSkeleton.length > 4) {
        this.tabButtonSkeleton[Number(TableListRoomChongQuayNew_1.roomType) - 1].setAnimation(0, "Button_ON", true);
      }
      this.scrollView.stopAutoScroll();
      this.scrollView.scrollToOffset(new cc.Vec2(this.scrollView.getScrollOffset().x, 0), 0, true);
      this.updateListFull(this.rs, this.pR, this.srs, true);
      cc.sys.localStorage.setItem("roomtype" + GamePlayManager.default.getInstance().gameID, roomType);
    }
  };
  TableListRoomChongQuayNew.prototype.showWebMobileIos = function(isWebMobileIos) {
    if (null !== this.listTabWidget && void 0 !== this.listTabWidget) {
      this.nodeConbangChongVay.active = isWebMobileIos ? !isWebMobileIos : isWebMobileIos;
    }
  };
  TableListRoomChongQuayNew.prototype.getZoneName = function() {
    return CardGameCommonRequest.default.getInstance().getZoneName();
  };
  TableListRoomChongQuayNew.prototype.setLbTallAllCountPeople = function(displayCount) {
    if (0 !== this.lblSoNguoiRoom.length) {
      if (GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.PHOM) {
        this.lblSoNguoiRoom[0].string = "PH\u1eceM (" + displayCount + ")";
      } else {
        if (GamePlayManager.default.getInstance().gameID === MessageCardGameHandler.GAME.BINH) {
          this.lblSoNguoiRoom[0].string = "M\u1eacU BINH (" + displayCount + ")";
        } else {
          this.lblSoNguoiRoom[0].string = "T\u1ea4T C\u1ea2 (" + displayCount + ")";
        }
      }
    }
  };
  __decorate([property(cc.ScrollView)], TableListRoomChongQuayNew.prototype, "scrollView", void 0);
  __decorate([property(TableViewUtils.default)], TableListRoomChongQuayNew.prototype, "listFull", void 0);
  __decorate([property(cc.Widget)], TableListRoomChongQuayNew.prototype, "txtTitle", void 0);
  __decorate([property(sp.Skeleton)], TableListRoomChongQuayNew.prototype, "tabButtonSkeleton", void 0);
  __decorate([property(cc.Label)], TableListRoomChongQuayNew.prototype, "lblSoNguoiRoom", void 0);
  __decorate([property(cc.Widget)], TableListRoomChongQuayNew.prototype, "listTabWidget", void 0);
  __decorate([property(cc.Node)], TableListRoomChongQuayNew.prototype, "nodeConbangChongVay", void 0);
  return TableListRoomChongQuayNew = TableListRoomChongQuayNew_1 = __decorate([ccclass], TableListRoomChongQuayNew);
}(cc.Component);
moduleExports.default = TableListRoomChongQuayNew;
void 0;
