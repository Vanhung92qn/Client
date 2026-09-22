var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
var __decorate = this && this.__decorate || function(t, e, i, n) {
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
var WSCardGameHandle = require("WSCardGameHandle"),
  MessageCardGameHandler = require("MessageCardGameHandler"),
  GamePlayManager = require("GamePlayManager"),
  WSXDGamesHandle = require("WSXDGamesHandle"),
  GameConfigManager = require("GameConfigManager"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  CardGameCommonRequest = (ccDecorator.property, function() {
    function CardGameCommonRequest() {
      this.isCanGetREFRESH_MONEY = true;
    }
    var CardGameCommonRequestClass;
    CardGameCommonRequestClass = CardGameCommonRequest;
    CardGameCommonRequest.getInstance = function() {
      if (!(null !== this.Instance && void 0 !== this.Instance)) {
        this.Instance = new CardGameCommonRequestClass();
        this.Instance.init();
      }
      return this.Instance;
    };
    CardGameCommonRequest.prototype.init = function() {};
    CardGameCommonRequest.prototype.getZoneNameWSCard = function() {
      return "Simms";
    };
    CardGameCommonRequest.prototype.getZoneNameWSXD = function() {
      return "SimmsRoBe";
    };
    CardGameCommonRequest.prototype.sendDataWSCard = function(data) {
      if (WSCardGameHandle.default.getInstance().isSocketOpen) {
        WSCardGameHandle.default.getInstance().ws.sendData(data);
      }
    };
    CardGameCommonRequest.prototype.sendDataWSXD = function(data) {
      if (WSXDGamesHandle.default.getInstance().isSocketOpen) {
        WSXDGamesHandle.default.getInstance().ws.sendData(data);
      }
    };
    CardGameCommonRequest.prototype.getZoneName = function() {
      return GameConfigManager.default.getInstance().canUseSocketXD() ? this.getZoneNameWSXD() : this.getZoneNameWSCard();
    };
    CardGameCommonRequest.prototype.sendData = function(data) {
      if (GameConfigManager.default.getInstance().canUseSocketXD()) {
        this.sendDataWSXD(data);
      } else {
        this.sendDataWSCard(data);
      }
    };
    CardGameCommonRequest.prototype.sendChat = function(message) {
      var payload = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: MessageCardGameHandler.Global_Message.INGAME_USER_CHAT,
        mgs: message
      }];
      this.sendData(JSON.stringify(payload));
    };
    CardGameCommonRequest.prototype.sendLogout = function() {
      var payload = [MessageCardGameHandler.Message.MessageType.LogOut_Type, this.getZoneNameWSCard()];
      this.sendDataWSCard(JSON.stringify(payload));
    };
    CardGameCommonRequest.prototype.sendLeaveRoom = function() {
      var payload = [MessageCardGameHandler.Message.MessageType.LeaveRoom_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID];
      this.sendData(JSON.stringify(payload));
    };
    CardGameCommonRequest.prototype.GetListRoom = function() {
      var payload = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: MessageCardGameHandler.Global_Message.GET_TABLES,
        aid: "1",
        gid: GamePlayManager.default.getInstance().gameID
      }];
      this.sendData(JSON.stringify(payload));
    };
    CardGameCommonRequest.prototype.sendReady = function() {
      var payload = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: MessageCardGameHandler.Global_Message.INGAME_USER_READY
      }];
      this.sendData(JSON.stringify(payload));
    };
    CardGameCommonRequest.prototype.sendStart = function(cmd) {
      var payload = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: cmd
      }];
      this.sendData(JSON.stringify(payload));
    };
    CardGameCommonRequest.prototype.sendArranged = function(cmd, userID, cardCode) {
      if (void 0 === cardCode) {
        cardCode = -1;
      }
      var payload = null;
      payload = -1 != cardCode ? [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: cmd,
        uid: userID,
        cs: [cardCode]
      }] : [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: cmd,
        uid: userID
      }];
      this.sendData(JSON.stringify(payload));
    };
    CardGameCommonRequest.prototype.sendArrayArranged = function(cmd, userID, cardCodes) {
      if (void 0 === cardCodes) {
        cardCodes = [];
      }
      var payload = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: cmd,
        uid: userID,
        cs: cardCodes
      }];
      this.sendData(JSON.stringify(payload));
    };
    CardGameCommonRequest.prototype.sendInvitePlayers = function(userIDs) {
      var payload = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: MessageCardGameHandler.Global_Message.ZONE_INVITE_USERS_REQUEST,
        rid: GamePlayManager.default.getInstance().roomID,
        us: userIDs
      }];
      this.sendData(JSON.stringify(payload));
    };
    CardGameCommonRequest.prototype.sendInvitePlayersKtek = function(userIDs) {
      var payload = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: MessageCardGameHandler.Global_Message.ZONE_INVITE_USERS_REQUEST,
        rid: GamePlayManager.default.getInstance().roomIDKtek,
        us: userIDs,
        tpgid: GamePlayManager.default.getInstance().gameIDKtek,
        tpgrid: GamePlayManager.default.getInstance().roomIDKtek,
        tpgTT: GamePlayManager.default.getInstance().tableTypeKtek,
        rn: "X\xec D\xe1ch",
        b: GamePlayManager.default.getInstance().betKtek
      }];
      this.sendData(JSON.stringify(payload));
    };
    CardGameCommonRequest.prototype.sendGetInviteList = function() {
      var payload = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: MessageCardGameHandler.Global_Message.FIND_PLAYERS_TO_INVITE,
        rid: GamePlayManager.default.getInstance().roomID
      }];
      this.sendData(JSON.stringify(payload));
    };
    CardGameCommonRequest.prototype.sendGetInviteListKtek = function(roomIDKtek, moneyMin) {
      var payload = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: MessageCardGameHandler.Global_Message.FIND_PLAYERS_TO_INVITE,
        rid: roomIDKtek,
        mM: moneyMin
      }];
      this.sendData(JSON.stringify(payload));
    };
    CardGameCommonRequest.prototype.sendKickUser = function(userID) {
      var payload = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), {
        cmd: 3,
        uid: userID
      }];
      this.sendData(JSON.stringify(payload));
    };
    CardGameCommonRequest.prototype.sendRefreshMoney = function() {
      if (GamePlayManager.default.getInstance().token.length > 0) {
        this.isCanGetREFRESH_MONEY = true;
        var payload = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, this.getZoneNameWSCard(), "channelPlugin", {
          cmd: MessageCardGameHandler.Global_Message.REFRESH_MONEY
        }];
        this.sendDataWSCard(JSON.stringify(payload));
      }
    };
    CardGameCommonRequest.prototype.sendPlayerDisplayName = function() {
      var payload = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: 309,
        dn: GamePlayManager.default.getInstance().displayName
      }];
      this.sendData(JSON.stringify(payload));
    };
    CardGameCommonRequest.prototype.sendBaoQuay = function() {
      var payload = [MessageCardGameHandler.Message.MessageType.RoomPlugin_Type, this.getZoneName(), GamePlayManager.default.getInstance().roomID, {
        cmd: MessageCardGameHandler.Global_Message.BAO_QUAY
      }];
      this.sendData(JSON.stringify(payload));
    };
    CardGameCommonRequest.prototype.fetchSettingRoom = function() {
      var payload = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: MessageCardGameHandler.Global_Message.FETCH_SETTING_ROOM,
        gid: GamePlayManager.default.getInstance().gameID
      }];
      this.sendData(JSON.stringify(payload));
    };
    CardGameCommonRequest.prototype.sendSettingRoom = function(isUsingNewArrange, e, i) {
      var payload = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, this.getZoneName(), "channelPlugin", {
        cmd: MessageCardGameHandler.Global_Message.SETTING_SORT_CARD,
        nArr: isUsingNewArrange,
        fINArr: e,
        fPNArr: i,
        gid: GamePlayManager.default.getInstance().gameID
      }];
      this.sendData(JSON.stringify(payload));
    };
    CardGameCommonRequest.Instance = null;
    return CardGameCommonRequest = CardGameCommonRequestClass = __decorate([ccclass], CardGameCommonRequest);
  }());
moduleExports.default = CardGameCommonRequest;
void 0;
