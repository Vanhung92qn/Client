var requireRef = require,
  moduleRef = module,
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
var CardPopupBase = require("./CardPopupBase"),
  GamePlayManager = require("./GamePlayManager"),
  MusicPlayer = require("./MusicPlayer"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  StringUtil = require("./StringUtil"),
  GameDefine = require("./GameDefine"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  PopupJoinRoom = function(_super) {
    function PopupJoinRoom() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.edbRoomID = null;
      _this.edbPassword = null;
      return _this;
    }
    __extends(PopupJoinRoom, _super);
    PopupJoinRoom.prototype.onLoad = function() {
      cc.systemEvent.on(GameDefine.GameEventMessage.JoinRoom, this.onJoinRoom, this);
    };
    PopupJoinRoom.prototype.onDestroy = function() {
      cc.systemEvent.off(GameDefine.GameEventMessage.JoinRoom, this.onJoinRoom, this);
    };
    PopupJoinRoom.prototype.onJoinRoom = function() {
      this.hide(null, .4, true, false);
    };
    PopupJoinRoom.prototype.btnOKPress = function() {
      if (MusicPlayer.default.getInstance().playbtnClick(), this.edbRoomID.string.length <= 0) {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("Vui l\xf2ng nh\u1eadp \u0111\xfang s\u1ed1 b\xe0n");
      } else {
        var roomID = parseInt(this.edbRoomID.string);
        if (Number.isNaN(roomID)) {
          CommonPrefabsManager.default.getInstance().showPopupMessageUtil("Vui l\xf2ng nh\u1eadp \u0111\xfang s\u1ed1 b\xe0n");
        } else if (StringUtil.default.isNullOrEmpty(this.edbPassword.string)) {
          CommonPrefabsManager.default.getInstance().showPopupMessageUtil("Vui l\xf2ng nh\u1eadp m\u1eadt kh\u1ea9u");
        } else {
          var gameID = GamePlayManager.default.getInstance().gameID;
          GamePlayManager.default.getInstance().joinRoomWithGameID(roomID, this.edbPassword.string, gameID);
        }
      }
    };
    PopupJoinRoom.prototype.onClickClose = function() {
      this.hide();
    };
    __decorate([property(cc.EditBox)], PopupJoinRoom.prototype, "edbRoomID", void 0);
    __decorate([property(cc.EditBox)], PopupJoinRoom.prototype, "edbPassword", void 0);
    return PopupJoinRoom = __decorate([ccclass], PopupJoinRoom);
  }(CardPopupBase.default);
moduleExports.default = PopupJoinRoom;
void 0;
