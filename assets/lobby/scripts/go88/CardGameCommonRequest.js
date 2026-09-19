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
  r = t("./WSXDGamesHandle"),
  c = t("./GameConfigManager"),
  l = cc._decorator,
  h = l.ccclass,
  u = (l.property, function() {
    function t() {
      this.isCanGetREFRESH_MONEY = true;
    }
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
    t.prototype.getZoneNameWSCard = function() {
      return "Simms";
    };
    t.prototype.getZoneNameWSXD = function() {
      return "SimmsRoBe";
    };
    t.prototype.sendDataWSCard = function(t) {
      if (o.default.getInstance().isSocketOpen) {
        o.default.getInstance().ws.sendData(t);
      }
    };
    t.prototype.sendDataWSXD = function(t) {
      if (r.default.getInstance().isSocketOpen) {
        r.default.getInstance().ws.sendData(t);
      }
    };
    t.prototype.getZoneName = function() {
      return c.default.getInstance().canUseSocketXD() ? this.getZoneNameWSXD() : this.getZoneNameWSCard();
    };
    t.prototype.sendData = function(t) {
      if (c.default.getInstance().canUseSocketXD()) {
        this.sendDataWSXD(t);
      } else {
        this.sendDataWSCard(t);
      }
    };
    t.prototype.sendChat = function(t) {
      var e = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: a.Global_Message.INGAME_USER_CHAT,
        mgs: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendLogout = function() {
      var t = [a.Message.MessageType.LogOut_Type, this.getZoneNameWSCard()];
      this.sendDataWSCard(JSON.stringify(t));
    };
    t.prototype.sendLeaveRoom = function() {
      var t = [a.Message.MessageType.LeaveRoom_Type, this.getZoneName(), s.default.getInstance().roomID];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.GetListRoom = function() {
      var t = [a.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: a.Global_Message.GET_TABLES,
        aid: "1",
        gid: s.default.getInstance().gameID
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendReady = function() {
      var t = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: a.Global_Message.INGAME_USER_READY
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendStart = function(t) {
      var e = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendArranged = function(t, e, i) {
      if (void 0 === i) {
        i = -1;
      }
      var n = null;
      n = -1 != i ? [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: t,
        uid: e,
        cs: [i]
      }] : [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: t,
        uid: e
      }];
      this.sendData(JSON.stringify(n));
    };
    t.prototype.sendArrayArranged = function(t, e, i) {
      if (void 0 === i) {
        i = [];
      }
      var n = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: t,
        uid: e,
        cs: i
      }];
      this.sendData(JSON.stringify(n));
    };
    t.prototype.sendInvitePlayers = function(t) {
      var e = [a.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: a.Global_Message.ZONE_INVITE_USERS_REQUEST,
        rid: s.default.getInstance().roomID,
        us: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendInvitePlayersKtek = function(t) {
      var e = [a.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: a.Global_Message.ZONE_INVITE_USERS_REQUEST,
        rid: s.default.getInstance().roomIDKtek,
        us: t,
        tpgid: s.default.getInstance().gameIDKtek,
        tpgrid: s.default.getInstance().roomIDKtek,
        tpgTT: s.default.getInstance().tableTypeKtek,
        rn: "X\xec D\xe1ch",
        b: s.default.getInstance().betKtek
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendGetInviteList = function() {
      var t = [a.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: a.Global_Message.FIND_PLAYERS_TO_INVITE,
        rid: s.default.getInstance().roomID
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendGetInviteListKtek = function(t, e) {
      var i = [a.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: a.Global_Message.FIND_PLAYERS_TO_INVITE,
        rid: t,
        mM: e
      }];
      this.sendData(JSON.stringify(i));
    };
    t.prototype.sendKickUser = function(t) {
      var e = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), {
        cmd: 3,
        uid: t
      }];
      this.sendData(JSON.stringify(e));
    };
    t.prototype.sendRefreshMoney = function() {
      if (s.default.getInstance().token.length > 0) {
        this.isCanGetREFRESH_MONEY = true;
        var t = [a.Message.MessageType.ZonePlugin_Type, this.getZoneNameWSCard(), "channelPlugin", {
          cmd: a.Global_Message.REFRESH_MONEY
        }];
        this.sendDataWSCard(JSON.stringify(t));
      }
    };
    t.prototype.sendPlayerDisplayName = function() {
      var t = [a.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: 309,
        dn: s.default.getInstance().displayName
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendBaoQuay = function() {
      var t = [a.Message.MessageType.RoomPlugin_Type, this.getZoneName(), s.default.getInstance().roomID, {
        cmd: a.Global_Message.BAO_QUAY
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.fetchSettingRoom = function() {
      var t = [a.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: a.Global_Message.FETCH_SETTING_ROOM,
        gid: s.default.getInstance().gameID
      }];
      this.sendData(JSON.stringify(t));
    };
    t.prototype.sendSettingRoom = function(t, e, i) {
      var n = [a.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: a.Global_Message.SETTING_SORT_CARD,
        nArr: t,
        fINArr: e,
        fPNArr: i,
        gid: s.default.getInstance().gameID
      }];
      this.sendData(JSON.stringify(n));
    };
    t.Instance = null;
    return t = e = n([h], t);
  }());
i.default = u;
void 0;
