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
var ChatInGamePopup = require("ChatInGamePopup"),
  InGameBackPopup = require("InGameBackPopup"),
  ActionProgressTo = require("ActionProgressTo"),
  GameZOrder = require("GameZOrder"),
  StringUtil = require("StringUtil"),
  GamePlayManager = require("GamePlayManager"),
  CardGameCommonRequest = require("CardGameCommonRequest"),
  MusicPlayer = require("MusicPlayer"),
  GameConfigManager = require("GameConfigManager"),
  CommonPrefabsManager = require("CommonPrefabsManager"),
  MessageCardGameHandler = require("MessageCardGameHandler"),
  ChatController = require("ChatController"),
  GameDefine = require("GameDefine"),
  _decorator = cc._decorator,
  ccclass = _decorator.ccclass,
  property = _decorator.property,
  CardGameTableController = function(_super) {
    function CardGameTableController() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.chatInGamePopupPrefabs = null;
      _this.chatInGamePopup = null;
      _this.chatController = null;
      _this.inGameBackPopupPrefabs = null;
      _this.lbIdBanChoi = null;
      _this.lbMucCuoc = null;
      _this.lbNameGame = null;
      _this.imageNameGame = null;
      _this.countDownActionProgressTo = null;
      _this.readyBtn = null;
      _this.startBtn = null;
      _this.chatBtn = null;
      _this.backBtn = null;
      _this.inGameBackPopup = null;
      _this.listChatDefaultText = [];
      _this.isPopupInviteShowing = false;
      _this.dearlerSpine = null;
      _this.inviteInGamePopupPrefabs = null;
      _this.inviteInGamePopup = null;
      _this.isAnDanh = false;
      _this.gameController = null;
      _this.allowFocusChatBox = true;
      _this.showBtnChatWhenOpen = false;
      return _this;
    }
    __extends(CardGameTableController, _super);
    CardGameTableController.prototype.onLoad = function() {
      if (cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      }
      if (null !== this.startBtn && void 0 !== this.startBtn) {
        this.posBtnStartOriginal = this.startBtn.position;
      }
      cc.director.on(GameConfigManager.default.SHOW_CHAT_BAN_CHUNG, this.onHideChat, this);
      cc.systemEvent.on(GameDefine.GameEventMessage.HideSpamChat, this.onHideSpamChat, this);
    };
    CardGameTableController.prototype.start = function() {
      this.setActiveChatBtn(GameConfigManager.default.getInstance().showChatBanChung);
    };
    CardGameTableController.prototype.onKeyDown = function(event) {
      switch (event.keyCode) {
        case cc.macro.KEY.enter:
          false === GameConfigManager.default.getInstance().isShowPopupDone && (null !== this.chatInGamePopup && void 0 !== this.chatInGamePopup && this
            .chatInGamePopup.node.active ? this.chatInGamePopup.editBoxCustomChat.focus() : this.onClickBtnChat());
      }
    };
    CardGameTableController.prototype.onDestroy = function() {
      cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      cc.director.off(GameConfigManager.default.SHOW_CHAT_BAN_CHUNG, this.onHideChat, this);
      cc.systemEvent.on(GameDefine.GameEventMessage.HideSpamChat, this.onHideSpamChat, this);
    };
    CardGameTableController.prototype.init = function(gameName, gameNameSpriteFrame, chatDefaultTexts, cmdStart, onClickExit, gameController) {
      this.listChatDefaultText = chatDefaultTexts;
      this.cmdStart = cmdStart;
      this.onClickExit = onClickExit;
      if (null !== this.lbNameGame && void 0 !== this.lbNameGame) {
        this.lbNameGame.string = gameName;
      }
      if (null !== this.imageNameGame && void 0 !== this.imageNameGame) {
        this.imageNameGame.spriteFrame = gameNameSpriteFrame;
      }
      this.gameController = gameController;
      this.initChat();
    };
    CardGameTableController.prototype.initDefaultData = function() {
      if (null !== this.readyBtn && void 0 !== this.readyBtn) {
        this.readyBtn.active = false;
      }
      if (null !== this.startBtn && void 0 !== this.startBtn) {
        this.startBtn.active = false;
        this.resetPosStartBtn();
      }
      if (null !== this.countDownActionProgressTo && void 0 !== this.countDownActionProgressTo) {
        this.countDownActionProgressTo.node.active = false;
      }
      this.setActiveBackBtn(true);
      if (null !== this.inGameBackPopup) {
        this.inGameBackPopup.node.destroy();
        this.inGameBackPopup = null;
      }
      if (null !== this.chatInGamePopup && void 0 !== this.chatInGamePopup) {
        this.chatInGamePopup.hide();
      }
    };
    CardGameTableController.prototype.onClickBtnChat = function() {
      if (this.gameController.node.activeInHierarchy) {
        if (MusicPlayer.default.getInstance().playbtnClick(.6), this.gameController && this.gameController.isGameAnDanhCheck) {
          CommonPrefabsManager.default.getInstance().showPopupMessageUtil("Kh\xf4ng \u0110\u01b0\u1ee3c Chat Trong B\xe0n \u1ea8n Danh!");
        } else {
          if (null !== this.gameController && void 0 !== this.gameController) {
            var spamMessage = this.gameController.checkSpamChat();
            if (!StringUtil.default.isNullOrEmpty(spamMessage)) {
              return void CommonPrefabsManager.default.getInstance().showPopupMessageUtil(spamMessage);
            }
          }
          if (!(this.chatInGamePopup.node.getNumberOfRunningActions() > 0)) {
            this.chatInGamePopup.node.active = true;
            this.chatInGamePopup.loadData(this.listChatDefaultText, GameConfigManager.default.getInstance().getOldCHat());
            this.chatInGamePopup.show(this.allowFocusChatBox);
            this.setActiveChatBtn(this.showBtnChatWhenOpen);
          }
        }
      }
    };
    CardGameTableController.prototype.onHideChat = function(isChatBtnVisible) {
      if (null === isChatBtnVisible || void 0 === isChatBtnVisible) {
        this.setActiveChatBtn(true);
      } else {
        this.setActiveChatBtn(isChatBtnVisible);
      }
    };
    CardGameTableController.prototype.onBackClick = function() {
      if (MusicPlayer.default.getInstance().playbtnClick(), null === this.inGameBackPopup || void 0 === this.inGameBackPopup) {
        var backPopupNode = cc.instantiate(this.inGameBackPopupPrefabs);
        backPopupNode.parent = this.node.parent;
        backPopupNode.zIndex = GameZOrder.default.CHAT_BUBLES + 3;
        backPopupNode.position = new cc.Vec2(0, 240);
        this.inGameBackPopup = backPopupNode.getComponent(InGameBackPopup.default);
        this.inGameBackPopup.onCloseCallback = this.onHideBackPopup.bind(this);
        this.inGameBackPopup.onExitCallback = this.onClickExit.bind(this);
      }
      if (this.inGameBackPopup.node.active = true, !(this.inGameBackPopup.node.getNumberOfRunningActions() > 0)) {
        this.inGameBackPopup.node.active = true;
        var canBaoQuay = GameConfigManager.default.getInstance().isBaoQuay,
          betAmount = 100;
        if (null !== this.gameController && void 0 !== this.gameController) {
          if (this.gameController.maxUser <= 2) {
            canBaoQuay = false;
          }
          if (this.gameController.coPass || this.gameController.bet <= 100 || this.gameController.isGameAnDanhCheck) {
            canBaoQuay = false;
          }
          betAmount = this.gameController.bet;
        }
        this.inGameBackPopup.show(canBaoQuay, betAmount);
        this.setActiveBackBtn(false);
      }
    };
    CardGameTableController.prototype.onHideBackPopup = function() {
      this.setActiveBackBtn(true);
    };
    CardGameTableController.prototype.setGameConfig = function(betAmount, isAnonymous, hasPassword) {
      if (void 0 === isAnonymous && (isAnonymous = false), void 0 === hasPassword && (hasPassword = false), null !== this.lbMucCuoc && void 0 !== this.lbMucCuoc && (this
          .lbMucCuoc.string = StringUtil.default.formatMoneyNumber(betAmount)), null !== this.lbIdBanChoi && void 0 !== this.lbIdBanChoi) {
        if (false === isAnonymous) {
          this.isAnDanh = isAnonymous;
          var randomPrefix = StringUtil.default.getRandomInt(7) + 1,
            randomSuffix = StringUtil.default.getRandomInt(7) + 1;
          if (hasPassword) {
            this.lbIdBanChoi.string = GamePlayManager.default.getInstance().roomID.toString();
          } else {
            if (GamePlayManager.default.getInstance().roomID < 0) {
              this.lbIdBanChoi.string = "Ch\u1ed1ng V\xe2y";
            } else {
              if (GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.POKER) {
                this.lbIdBanChoi.string = randomPrefix + GamePlayManager.default.getInstance().roomID.toString() + randomSuffix;
              } else {
                this.lbIdBanChoi.string = GamePlayManager.default.getInstance().roomID.toString();
              }
            }
          }
        } else {
          this.lbIdBanChoi.string = "Ch\u1ed1ng V\xe2y";
        }
      }
    };
    CardGameTableController.prototype.setGameId = function(hasPassword) {
      if (void 0 === hasPassword && (hasPassword = false), hasPassword) {
        this.lbIdBanChoi.string = GamePlayManager.default.getInstance().roomID.toString();
      } else if (true !== this.isAnDanh && (this.isAnDanh = true, null !== this.lbIdBanChoi && void 0 !== this.lbIdBanChoi)) {
        if (GamePlayManager.default.getInstance().roomID < 0) {
          this.lbIdBanChoi.string = "Ch\u1ed1ng V\xe2y";
        } else {
          var randomPrefix = StringUtil.default.getRandomInt(7) + 1,
            randomSuffix = StringUtil.default.getRandomInt(7) + 1;
          this.lbIdBanChoi.string = randomPrefix + GamePlayManager.default.getInstance().roomID.toString() + randomSuffix;
        }
      }
    };
    CardGameTableController.prototype.hideReadyBtn = function() {
      if (null !== this.readyBtn && void 0 !== this.readyBtn) {
        this.readyBtn.active = false;
      }
    };
    CardGameTableController.prototype.setActiveBackBtn = function(isActive) {
      if (this.backBtn) {
        this.backBtn.active = isActive;
      }
    };
    CardGameTableController.prototype.setActiveChatBtn = function(isActive) {
      if (this.chatBtn) {
        this.chatBtn.active = isActive;
      }
    };
    CardGameTableController.prototype.stopProgressStartGame = function() {
      if (null !== this.startBtn && void 0 !== this.startBtn) {
        this.startBtn.active = false;
      }
      if (null !== this.countDownActionProgressTo && void 0 !== this.countDownActionProgressTo) {
        this.countDownActionProgressTo.node.stopAllActions();
        this.countDownActionProgressTo.node.active = false;
      }
    };
    CardGameTableController.prototype.startBetting = function(remainingTime, totalTime) {
      if (null !== this.countDownActionProgressTo && void 0 !== this.countDownActionProgressTo) {
        this.countDownActionProgressTo.node.active = true;
        this.countDownActionProgressTo.setProgress(remainingTime / totalTime);
        this.countDownActionProgressTo.RunActionProgress(remainingTime, 0);
      }
    };
    CardGameTableController.prototype.sendReady = function() {
      MusicPlayer.default.getInstance().playEffect("Sounds/sfx_btn_play");
      CardGameCommonRequest.default.getInstance().sendReady();
    };
    CardGameTableController.prototype.sendStart = function() {
      this.sendStartCmd();
      GamePlayManager.default.getInstance().countMatchNotInteract = 0;
    };
    CardGameTableController.prototype.sendStartCmd = function() {
      MusicPlayer.default.getInstance().playEffect("Sounds/sfx_btn_play");
      CardGameCommonRequest.default.getInstance().sendStart(this.cmdStart);
      this.startBtn.active = false;
    };
    CardGameTableController.prototype.startGameUI = function() {
      this.startBtn.active = false;
      this.readyBtn.active = false;
      this.stopProgressStartGame();
    };
    CardGameTableController.prototype.setDearlerAniamtionCallback = function() {
      var _this = this;
      this.dearlerSpine.setStartListener(function(t) {});
      this.dearlerSpine.setInterruptListener(function(t) {});
      this.dearlerSpine.setEndListener(function(t) {});
      this.dearlerSpine.setDisposeListener(function(t) {});
      this.dearlerSpine.setCompleteListener(function(trackEntry) {
        if ("animation" === (trackEntry.animation ? trackEntry.animation.name : "")) {
          _this.dearlerSpine.clearTrack(1);
          _this.dearlerSpine.setAnimation(0, "Smile", true);
        }
      });
      this.dearlerSpine.setEventListener(function(trackEntry, e) {
        if (trackEntry.animation) {
          trackEntry.animation.name;
        }
      });
    };
    CardGameTableController.prototype.showPlayersToBeInvited = function(playerList) {
      if (!this.isPopupInviteShowing) {
        for (var userIdList = [], index = 0; index < playerList.length; index++) {
          var player = playerList[index];
          userIdList.push(player.u);
        }
        var popupInvite = CommonPrefabsManager.default.getInstance().showPopup2Button();
        popupInvite.onOKClicked = function() {
          CardGameCommonRequest.default.getInstance().sendInvitePlayers(userIdList);
          popupInvite.hide();
          this.isPopupInviteShowing = false;
        }.bind(this);
        popupInvite.onCancelClicked = function() {
          popupInvite.hide();
          this.isPopupInviteShowing = false;
        }.bind(this);
        this.isPopupInviteShowing = true;
        popupInvite.lbContent.string = "B\u1ea1n c\xf3 mu\u1ed1n r\u1ee7 th\xeam ng\u01b0\u1eddi v\xe0o b\xe0n ch\u01a1i?";
      }
    };
    CardGameTableController.prototype.resetPosStartBtn = function() {
      if (null !== this.startBtn && void 0 !== this.startBtn) {
        this.startBtn.position = this.posBtnStartOriginal;
      }
    };
    CardGameTableController.prototype.offScreenPosStartBtn = function() {
      if (null !== this.startBtn && void 0 !== this.startBtn) {
        this.startBtn.position = this.posBtnStartOriginal + new cc.Vec2(0, 1e3);
      }
    };
    CardGameTableController.prototype.handleLeaveRoom = function() {
      this.isAnDanh = false;
    };
    CardGameTableController.prototype.initChat = function() {
      if (null === this.chatInGamePopup || void 0 === this.chatInGamePopup) {
        var chatPopupNode = cc.instantiate(this.chatInGamePopupPrefabs);
        chatPopupNode.parent = this.node.parent;
        chatPopupNode.zIndex = GameZOrder.default.CHAT_BUBLES + 3;
        this.chatInGamePopup = chatPopupNode.getComponent(ChatInGamePopup.default);
        this.chatInGamePopup.onCloseCallback = this.onHideChat.bind(this);
        this.chatInGamePopup.gameController = this.gameController;
        this.chatController = chatPopupNode.getComponent(ChatController.default);
        if (this.chatController) {
          this.chatController.initCellChat();
        }
      }
    };
    CardGameTableController.prototype.loadChatHistory = function() {
      if (this.chatController) {
        this.chatController.clearChatHistory();
        this.chatController.loadChatHistory(this.gameController.getChatHistory(), this.getCurrentGameID());
      }
    };
    CardGameTableController.prototype.loadChat = function(chatData, message, displayName, isSystemMessage, rankIndex, nameColor, rankColor) {
      if (void 0 === displayName) {
        displayName = "";
      }
      if (void 0 === isSystemMessage) {
        isSystemMessage = false;
      }
      if (this.chatController) {
        this.chatController.loadChat(chatData, message, displayName, isSystemMessage, rankIndex, nameColor, rankColor);
      }
    };
    CardGameTableController.prototype.onHideSpamChat = function(spammerUserId) {
      if (this.chatController) {
        this.chatController.hideSpamChat(spammerUserId);
      }
    };
    CardGameTableController.prototype.getCurrentGameID = function() {
      switch (GamePlayManager.default.getInstance().gameID) {
        case MessageCardGameHandler.GAME.BAU_CUA:
          return MessageCardGameHandler.GAMEID.BAU_CUA;
        case MessageCardGameHandler.GAME.XOCDIA:
          return MessageCardGameHandler.GAMEID.XOCDIA;
        default:
          return MessageCardGameHandler.GAMEID.TIENLEN;
      }
    };
    __decorate([property(cc.Prefab)], CardGameTableController.prototype, "chatInGamePopupPrefabs", void 0);
    __decorate([property(cc.Prefab)], CardGameTableController.prototype, "inGameBackPopupPrefabs", void 0);
    __decorate([property(cc.Label)], CardGameTableController.prototype, "lbIdBanChoi", void 0);
    __decorate([property(cc.Label)], CardGameTableController.prototype, "lbMucCuoc", void 0);
    __decorate([property(cc.Label)], CardGameTableController.prototype, "lbNameGame", void 0);
    __decorate([property(cc.Sprite)], CardGameTableController.prototype, "imageNameGame", void 0);
    __decorate([property(ActionProgressTo.default)], CardGameTableController.prototype, "countDownActionProgressTo", void 0);
    __decorate([property(cc.Node)], CardGameTableController.prototype, "readyBtn", void 0);
    __decorate([property(cc.Node)], CardGameTableController.prototype, "startBtn", void 0);
    __decorate([property(cc.Node)], CardGameTableController.prototype, "chatBtn", void 0);
    __decorate([property(cc.Node)], CardGameTableController.prototype, "backBtn", void 0);
    __decorate([property(sp.Skeleton)], CardGameTableController.prototype, "dearlerSpine", void 0);
    __decorate([property(cc.Prefab)], CardGameTableController.prototype, "inviteInGamePopupPrefabs", void 0);
    __decorate([property], CardGameTableController.prototype, "showBtnChatWhenOpen", void 0);
    return CardGameTableController = __decorate([ccclass], CardGameTableController);
  }(cc.Component);
moduleExports.default = CardGameTableController;
void 0;
