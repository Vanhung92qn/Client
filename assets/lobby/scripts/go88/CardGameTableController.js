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
var a = t("./ChatInGamePopup"),
  s = t("./InGameBackPopup"),
  r = t("./ActionProgressTo"),
  c = t("./GameZOrder"),
  l = t("./StringUtil"),
  h = t("./GamePlayManager"),
  u = t("./CardGameCommonRequest"),
  d = t("./MusicPlayer"),
  p = t("./GameConfigManager"),
  f = t("./CommonPrefabsManager"),
  g = t("./MessageCardGameHandler"),
  m = t("./ChatController"),
  y = t("./GameDefine"),
  S = cc._decorator,
  _ = S.ccclass,
  v = S.property,
  b = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.chatInGamePopupPrefabs = null;
      e.chatInGamePopup = null;
      e.chatController = null;
      e.inGameBackPopupPrefabs = null;
      e.lbIdBanChoi = null;
      e.lbMucCuoc = null;
      e.lbNameGame = null;
      e.imageNameGame = null;
      e.countDownActionProgressTo = null;
      e.readyBtn = null;
      e.startBtn = null;
      e.chatBtn = null;
      e.backBtn = null;
      e.inGameBackPopup = null;
      e.listChatDefaultText = [];
      e.isPopupInviteShowing = false;
      e.dearlerSpine = null;
      e.inviteInGamePopupPrefabs = null;
      e.inviteInGamePopup = null;
      e.isAnDanh = false;
      e.gameController = null;
      e.allowFocusChatBox = true;
      e.showBtnChatWhenOpen = false;
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {
      if (cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      }
      if (null !== this.startBtn && void 0 !== this.startBtn) {
        this.posBtnStartOriginal = this.startBtn.position;
      }
      cc.director.on(p.default.SHOW_CHAT_BAN_CHUNG, this.onHideChat, this);
      cc.systemEvent.on(y.GameEventMessage.HideSpamChat, this.onHideSpamChat, this);
    };
    e.prototype.start = function() {
      this.setActiveChatBtn(p.default.getInstance().showChatBanChung);
    };
    e.prototype.onKeyDown = function(t) {
      switch (t.keyCode) {
        case cc.macro.KEY.enter:
          false === p.default.getInstance().isShowPopupDone && (null !== this.chatInGamePopup && void 0 !== this.chatInGamePopup && this
            .chatInGamePopup.node.active ? this.chatInGamePopup.editBoxCustomChat.focus() : this.onClickBtnChat());
      }
    };
    e.prototype.onDestroy = function() {
      cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      cc.director.off(p.default.SHOW_CHAT_BAN_CHUNG, this.onHideChat, this);
      cc.systemEvent.on(y.GameEventMessage.HideSpamChat, this.onHideSpamChat, this);
    };
    e.prototype.init = function(t, e, i, n, o, a) {
      this.listChatDefaultText = i;
      this.cmdStart = n;
      this.onClickExit = o;
      if (null !== this.lbNameGame && void 0 !== this.lbNameGame) {
        this.lbNameGame.string = t;
      }
      if (null !== this.imageNameGame && void 0 !== this.imageNameGame) {
        this.imageNameGame.spriteFrame = e;
      }
      this.gameController = a;
      this.initChat();
    };
    e.prototype.initDefaultData = function() {
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
    e.prototype.onClickBtnChat = function() {
      if (this.gameController.node.activeInHierarchy) {
        if (d.default.getInstance().playbtnClick(.6), this.gameController && this.gameController.isGameAnDanhCheck) {
          f.default.getInstance().showPopupMessageUtil("Kh\xf4ng \u0110\u01b0\u1ee3c Chat Trong B\xe0n \u1ea8n Danh!");
        } else {
          if (null !== this.gameController && void 0 !== this.gameController) {
            var t = this.gameController.checkSpamChat();
            if (!l.default.isNullOrEmpty(t)) {
              return void f.default.getInstance().showPopupMessageUtil(t);
            }
          }
          if (!(this.chatInGamePopup.node.getNumberOfRunningActions() > 0)) {
            this.chatInGamePopup.node.active = true;
            this.chatInGamePopup.loadData(this.listChatDefaultText, p.default.getInstance().getOldCHat());
            this.chatInGamePopup.show(this.allowFocusChatBox);
            this.setActiveChatBtn(this.showBtnChatWhenOpen);
          }
        }
      }
    };
    e.prototype.onHideChat = function(t) {
      if (null === t || void 0 === t) {
        this.setActiveChatBtn(true);
      } else {
        this.setActiveChatBtn(t);
      }
    };
    e.prototype.onBackClick = function() {
      if (d.default.getInstance().playbtnClick(), null === this.inGameBackPopup || void 0 === this.inGameBackPopup) {
        var t = cc.instantiate(this.inGameBackPopupPrefabs);
        t.parent = this.node.parent;
        t.zIndex = c.default.CHAT_BUBLES + 3;
        t.position = new cc.Vec2(0, 240);
        this.inGameBackPopup = t.getComponent(s.default);
        this.inGameBackPopup.onCloseCallback = this.onHideBackPopup.bind(this);
        this.inGameBackPopup.onExitCallback = this.onClickExit.bind(this);
      }
      if (this.inGameBackPopup.node.active = true, !(this.inGameBackPopup.node.getNumberOfRunningActions() > 0)) {
        this.inGameBackPopup.node.active = true;
        var e = p.default.getInstance().isBaoQuay,
          i = 100;
        if (null !== this.gameController && void 0 !== this.gameController) {
          if (this.gameController.maxUser <= 2) {
            e = false;
          }
          if (this.gameController.coPass || this.gameController.bet <= 100 || this.gameController.isGameAnDanhCheck) {
            e = false;
          }
          i = this.gameController.bet;
        }
        this.inGameBackPopup.show(e, i);
        this.setActiveBackBtn(false);
      }
    };
    e.prototype.onHideBackPopup = function() {
      this.setActiveBackBtn(true);
    };
    e.prototype.setGameConfig = function(t, e, i) {
      if (void 0 === e && (e = false), void 0 === i && (i = false), null !== this.lbMucCuoc && void 0 !== this.lbMucCuoc && (this
          .lbMucCuoc.string = l.default.formatMoneyNumber(t)), null !== this.lbIdBanChoi && void 0 !== this.lbIdBanChoi) {
        if (false === e) {
          this.isAnDanh = e;
          var n = l.default.getRandomInt(7) + 1,
            o = l.default.getRandomInt(7) + 1;
          if (i) {
            this.lbIdBanChoi.string = h.default.getInstance().roomID.toString();
          } else {
            if (h.default.getInstance().roomID < 0) {
              this.lbIdBanChoi.string = "Ch\u1ed1ng V\xe2y";
            } else {
              if (h.default.getInstance().gameID !== g.GAME.POKER) {
                this.lbIdBanChoi.string = n + h.default.getInstance().roomID.toString() + o;
              } else {
                this.lbIdBanChoi.string = h.default.getInstance().roomID.toString();
              }
            }
          }
        } else {
          this.lbIdBanChoi.string = "Ch\u1ed1ng V\xe2y";
        }
      }
    };
    e.prototype.setGameId = function(t) {
      if (void 0 === t && (t = false), t) {
        this.lbIdBanChoi.string = h.default.getInstance().roomID.toString();
      } else if (true !== this.isAnDanh && (this.isAnDanh = true, null !== this.lbIdBanChoi && void 0 !== this.lbIdBanChoi)) {
        if (h.default.getInstance().roomID < 0) {
          this.lbIdBanChoi.string = "Ch\u1ed1ng V\xe2y";
        } else {
          var e = l.default.getRandomInt(7) + 1,
            i = l.default.getRandomInt(7) + 1;
          this.lbIdBanChoi.string = e + h.default.getInstance().roomID.toString() + i;
        }
      }
    };
    e.prototype.hideReadyBtn = function() {
      if (null !== this.readyBtn && void 0 !== this.readyBtn) {
        this.readyBtn.active = false;
      }
    };
    e.prototype.setActiveBackBtn = function(t) {
      if (this.backBtn) {
        this.backBtn.active = t;
      }
    };
    e.prototype.setActiveChatBtn = function(t) {
      if (this.chatBtn) {
        this.chatBtn.active = t;
      }
    };
    e.prototype.stopProgressStartGame = function() {
      if (null !== this.startBtn && void 0 !== this.startBtn) {
        this.startBtn.active = false;
      }
      if (null !== this.countDownActionProgressTo && void 0 !== this.countDownActionProgressTo) {
        this.countDownActionProgressTo.node.stopAllActions();
        this.countDownActionProgressTo.node.active = false;
      }
    };
    e.prototype.startBetting = function(t, e) {
      if (null !== this.countDownActionProgressTo && void 0 !== this.countDownActionProgressTo) {
        this.countDownActionProgressTo.node.active = true;
        this.countDownActionProgressTo.setProgress(t / e);
        this.countDownActionProgressTo.RunActionProgress(t, 0);
      }
    };
    e.prototype.sendReady = function() {
      d.default.getInstance().playEffect("Sounds/sfx_btn_play");
      u.default.getInstance().sendReady();
    };
    e.prototype.sendStart = function() {
      this.sendStartCmd();
      h.default.getInstance().countMatchNotInteract = 0;
    };
    e.prototype.sendStartCmd = function() {
      d.default.getInstance().playEffect("Sounds/sfx_btn_play");
      u.default.getInstance().sendStart(this.cmdStart);
      this.startBtn.active = false;
    };
    e.prototype.startGameUI = function() {
      this.startBtn.active = false;
      this.readyBtn.active = false;
      this.stopProgressStartGame();
    };
    e.prototype.setDearlerAniamtionCallback = function() {
      var t = this;
      this.dearlerSpine.setStartListener(function(t) {});
      this.dearlerSpine.setInterruptListener(function(t) {});
      this.dearlerSpine.setEndListener(function(t) {});
      this.dearlerSpine.setDisposeListener(function(t) {});
      this.dearlerSpine.setCompleteListener(function(e) {
        if ("animation" === (e.animation ? e.animation.name : "")) {
          t.dearlerSpine.clearTrack(1);
          t.dearlerSpine.setAnimation(0, "Smile", true);
        }
      });
      this.dearlerSpine.setEventListener(function(t, e) {
        if (t.animation) {
          t.animation.name;
        }
      });
    };
    e.prototype.showPlayersToBeInvited = function(t) {
      if (!this.isPopupInviteShowing) {
        for (var e = [], i = 0; i < t.length; i++) {
          var n = t[i];
          e.push(n.u);
        }
        var o = f.default.getInstance().showPopup2Button();
        o.onOKClicked = function() {
          u.default.getInstance().sendInvitePlayers(e);
          o.hide();
          this.isPopupInviteShowing = false;
        }.bind(this);
        o.onCancelClicked = function() {
          o.hide();
          this.isPopupInviteShowing = false;
        }.bind(this);
        this.isPopupInviteShowing = true;
        o.lbContent.string = "B\u1ea1n c\xf3 mu\u1ed1n r\u1ee7 th\xeam ng\u01b0\u1eddi v\xe0o b\xe0n ch\u01a1i?";
      }
    };
    e.prototype.resetPosStartBtn = function() {
      if (null !== this.startBtn && void 0 !== this.startBtn) {
        this.startBtn.position = this.posBtnStartOriginal;
      }
    };
    e.prototype.offScreenPosStartBtn = function() {
      if (null !== this.startBtn && void 0 !== this.startBtn) {
        this.startBtn.position = this.posBtnStartOriginal + new cc.Vec2(0, 1e3);
      }
    };
    e.prototype.handleLeaveRoom = function() {
      this.isAnDanh = false;
    };
    e.prototype.initChat = function() {
      if (null === this.chatInGamePopup || void 0 === this.chatInGamePopup) {
        var t = cc.instantiate(this.chatInGamePopupPrefabs);
        t.parent = this.node.parent;
        t.zIndex = c.default.CHAT_BUBLES + 3;
        this.chatInGamePopup = t.getComponent(a.default);
        this.chatInGamePopup.onCloseCallback = this.onHideChat.bind(this);
        this.chatInGamePopup.gameController = this.gameController;
        this.chatController = t.getComponent(m.default);
        if (this.chatController) {
          this.chatController.initCellChat();
        }
      }
    };
    e.prototype.loadChatHistory = function() {
      if (this.chatController) {
        this.chatController.clearChatHistory();
        this.chatController.loadChatHistory(this.gameController.getChatHistory(), this.getCurrentGameID());
      }
    };
    e.prototype.loadChat = function(t, e, i, n, o, a, s) {
      if (void 0 === i) {
        i = "";
      }
      if (void 0 === n) {
        n = false;
      }
      if (this.chatController) {
        this.chatController.loadChat(t, e, i, n, o, a, s);
      }
    };
    e.prototype.onHideSpamChat = function(t) {
      if (this.chatController) {
        this.chatController.hideSpamChat(t);
      }
    };
    e.prototype.getCurrentGameID = function() {
      switch (h.default.getInstance().gameID) {
        case g.GAME.BAU_CUA:
          return g.GAMEID.BAU_CUA;
        case g.GAME.XOCDIA:
          return g.GAMEID.XOCDIA;
        default:
          return g.GAMEID.TIENLEN;
      }
    };
    o([v(cc.Prefab)], e.prototype, "chatInGamePopupPrefabs", void 0);
    o([v(cc.Prefab)], e.prototype, "inGameBackPopupPrefabs", void 0);
    o([v(cc.Label)], e.prototype, "lbIdBanChoi", void 0);
    o([v(cc.Label)], e.prototype, "lbMucCuoc", void 0);
    o([v(cc.Label)], e.prototype, "lbNameGame", void 0);
    o([v(cc.Sprite)], e.prototype, "imageNameGame", void 0);
    o([v(r.default)], e.prototype, "countDownActionProgressTo", void 0);
    o([v(cc.Node)], e.prototype, "readyBtn", void 0);
    o([v(cc.Node)], e.prototype, "startBtn", void 0);
    o([v(cc.Node)], e.prototype, "chatBtn", void 0);
    o([v(cc.Node)], e.prototype, "backBtn", void 0);
    o([v(sp.Skeleton)], e.prototype, "dearlerSpine", void 0);
    o([v(cc.Prefab)], e.prototype, "inviteInGamePopupPrefabs", void 0);
    o([v], e.prototype, "showBtnChatWhenOpen", void 0);
    return e = o([_], e);
  }(cc.Component);
i.default = b;
void 0;
