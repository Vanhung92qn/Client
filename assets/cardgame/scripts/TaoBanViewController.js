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
var CardPopupBase = require("CardPopupBase"),
  BetListViewItem = require("BetListViewItem"),
  GamePlayManager = require("GamePlayManager"),
  MessageCardGameHandler = require("MessageCardGameHandler"),
  MusicPlayer = require("MusicPlayer"),
  GameConfigManager = require("GameConfigManager"),
  CommonPrefabsManager = require("CommonPrefabsManager"),
  StringUtil = require("StringUtil"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  TaoBanViewController = function(_super) {
    function TaoBanViewController() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.mainContent = null;
      _this.itemPrefab = null;
      _this.listBetItem = [];
      _this.scrollView = null;
      _this.edtPassword = null;
      _this.checkBoxPlayer1 = null;
      _this.checkBoxPlayer2 = null;
      _this.checkBoxPlayer3 = null;
      _this.lblMaxPlayer1 = null;
      _this.lblMaxPlayer2 = null;
      _this.lblMaxPlayer3 = null;
      _this.btnOK = null;
      _this.maxPlayer = 5;
      _this.maxPlayer1 = 5;
      _this.maxPlayer2 = 9;
      _this.maxPlayer3 = 9;
      _this.password = "";
      _this.currentScrollIndex = 0;
      _this.scrollVelocity = 0;
      _this.previousY = 0;
      return _this;
    }
    __extends(TaoBanViewController, _super);
    TaoBanViewController.prototype.initUser = function() {
      var gameId = GamePlayManager.default.getInstance().gameID;
      if (gameId === MessageCardGameHandler.GAME.TIENLEN || gameId === MessageCardGameHandler.GAME.TLMN) {
        this.maxPlayer1 = 2;
        this.maxPlayer2 = 4;
        this.maxPlayer3 = 0;
        this.checkBoxPlayer3.node.active = false;
      } else {
        if (gameId === MessageCardGameHandler.GAME.SAM) {
          this.maxPlayer1 = 2;
          this.maxPlayer2 = 5;
          this.maxPlayer3 = 0;
          this.checkBoxPlayer3.node.active = false;
        } else {
          if (gameId === MessageCardGameHandler.GAME.PHOM || gameId === MessageCardGameHandler.GAME.BINH) {
            this.maxPlayer1 = 4;
            this.maxPlayer2 = 0;
            this.maxPlayer3 = 0;
            this.checkBoxPlayer2.node.active = false;
            this.checkBoxPlayer3.node.active = false;
          } else {
            if (gameId === MessageCardGameHandler.GAME.CATTE) {
              this.maxPlayer1 = 2;
              this.maxPlayer2 = 6;
              this.maxPlayer3 = 0;
              this.checkBoxPlayer3.node.active = false;
            } else {
              if (gameId === MessageCardGameHandler.GAME.XITO) {
                this.maxPlayer1 = 5;
                this.maxPlayer2 = 0;
                this.maxPlayer3 = 0;
                this.checkBoxPlayer2.node.active = false;
                this.checkBoxPlayer3.node.active = false;
              } else {
                if (gameId === MessageCardGameHandler.GAME.XOCDIA) {
                  this.maxPlayer1 = 9;
                  this.maxPlayer2 = 30;
                  this.maxPlayer3 = 0;
                  this.edtPassword.node.active = false;
                  this.checkBoxPlayer2.node.active = false;
                  this.checkBoxPlayer3.node.active = false;
                } else {
                  if (gameId === MessageCardGameHandler.GAME.LIENG || gameId === MessageCardGameHandler.GAME.POKER) {
                    this.maxPlayer1 = 5;
                    this.maxPlayer2 = 9;
                    this.maxPlayer3 = 0;
                    this.checkBoxPlayer3.node.active = false;
                  } else {
                    if (gameId === MessageCardGameHandler.GAME.SICBO) {
                      this.maxPlayer1 = 9;
                      this.maxPlayer2 = 30;
                      this.maxPlayer3 = 0;
                      this.edtPassword.node.active = false;
                      this.checkBoxPlayer2.node.active = false;
                      this.checkBoxPlayer3.node.active = false;
                    } else {
                      if (gameId === MessageCardGameHandler.GAME.BACAY) {
                        this.maxPlayer1 = 9;
                        this.maxPlayer2 = 5;
                        this.maxPlayer3 = 0;
                        this.checkBoxPlayer2.node.active = false;
                        this.checkBoxPlayer3.node.active = false;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      this.lblMaxPlayer1.string = this.maxPlayer1 + " Ng\u01b0\u1eddi";
      this.lblMaxPlayer2.string = this.maxPlayer2 + " Ng\u01b0\u1eddi";
      this.lblMaxPlayer3.string = this.maxPlayer3 + " Ng\u01b0\u1eddi";
    };
    TaoBanViewController.prototype.btnOKPress = function() {
      if (StringUtil.default.isNullOrEmpty(this.edtPassword.string) && this.edtPassword.node.active && GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME
        .XOCDIA && GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.POKER && GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.LIENG && GamePlayManager.default
        .getInstance().gameID !== MessageCardGameHandler.GAME.XITO && GamePlayManager.default.getInstance().gameID !== MessageCardGameHandler.GAME.BACAY) {
        CommonPrefabsManager.default.getInstance().showPopupMessageUtil("Ch\u01b0a nh\u1eadp m\u1eadt kh\u1ea9u b\xe0n !");
      } else if (GameConfigManager.default.getInstance().isShowPopupDone) {
        CommonPrefabsManager.default.getInstance().showLoading();
        this.scrollView.stopAutoScroll();
        var scrollOffsetX = Math.abs(this.scrollView.getScrollOffset().x),
          betIndex = Math.floor(scrollOffsetX / 120),
          snapDistance = scrollOffsetX - 120 * betIndex;
        if (snapDistance > 60) {
          betIndex++;
          snapDistance = 120 - snapDistance;
        } else {
          snapDistance = -snapDistance;
        }
        if (this.checkBoxPlayer1.isChecked) {
          this.maxPlayer = this.maxPlayer1;
        } else {
          if (this.checkBoxPlayer2.isChecked) {
            this.maxPlayer = this.maxPlayer2;
          } else {
            this.maxPlayer = this.maxPlayer3;
          }
        }
        this.password = this.edtPassword.string;
        GamePlayManager.default.getInstance().requestcreateRoom(GamePlayManager.default.getInstance().gameID, this.listBetItem[betIndex].value, this.maxPlayer, this
          .password);
        this.onClickClose();
        this.btnOK.interactable = false;
      } else {
        this.hide();
      }
    };
    TaoBanViewController.prototype.onClickClose = function() {
      this.hide();
    };
    TaoBanViewController.prototype.loadData = function(betValues) {
      var _this = this;
      this.initUser();
      for (var betIndex = this.listBetItem.length; betIndex < betValues.length; ++betIndex) {
        var itemNode = cc.instantiate(this.itemPrefab);
        itemNode.parent = this.mainContent;
        var betItem = itemNode.getComponent(BetListViewItem.default);
        this.listBetItem.push(betItem);
      }
      for (betIndex = 0; betIndex < betValues.length; ++betIndex) {
        this.listBetItem[betIndex].setText(betValues[betIndex]);
      }
      for (betIndex = betValues.length; betIndex < this.listBetItem.length; ++betIndex) {
        this.listBetItem[betIndex].node.active = false;
      }
      this.node.runAction(cc.sequence(cc.delayTime(.1), cc.callFunc(function() {
        var middleIndex = _this.currentScrollIndex = Math.floor(betValues.length / 2);
        _this.scrollView.scrollToOffset(new cc.Vec2(120 * middleIndex, _this.scrollView.getScrollOffset().y), .5, true);
      })));
    };
    TaoBanViewController.prototype.callback = function(scrollView, eventType) {
      switch (eventType) {
        case cc.ScrollView.EventType.SCROLLING:
          this.scrollVelocity = this.scrollView.getScrollOffset().x - this.previousY;
          var scrollOffsetX = Math.abs(this.scrollView.getScrollOffset().x);
          this.currentScrollIndex = Math.floor(scrollOffsetX / 120);
          var snapDistance = scrollOffsetX - 120 * this.currentScrollIndex;
          snapDistance > 60 ? (this.currentScrollIndex++, snapDistance = 120 - snapDistance) : snapDistance = -snapDistance;
          for (var betIndex = 0; betIndex < this.listBetItem.length; ++betIndex) {
            var betItem = this.listBetItem[betIndex],
              distanceRatio = Math.abs(scrollOffsetX - 120 * betIndex),
              scaleOffset = .2 * (distanceRatio /= 120),
              opacityOffset = 64 * distanceRatio;
            betItem.node.scale = 1 - scaleOffset;
            betItem.node.opacity = 255 - opacityOffset;
          }
          Math.abs(this.scrollVelocity) <= 2 && this.scrollView.stopAutoScroll();
          break;
        case cc.ScrollView.EventType.SCROLL_ENDED:
          scrollOffsetX = Math.abs(this.scrollView.getScrollOffset().x);
          this.currentScrollIndex = Math.round(scrollOffsetX / 120);
          this.scrollView.scrollToOffset(new cc.Vec2(120 * this.currentScrollIndex, this.scrollView.getScrollOffset().y), .2, true);
      }
      this.previousY = this.scrollView.getScrollOffset().x;
    };
    TaoBanViewController.prototype.onClickNext = function() {
      MusicPlayer.default.getInstance().playEffect("Sounds/sfx_btn_bet");
      this.scrollView.stopAutoScroll();
      if (this.currentScrollIndex < this.listBetItem.length - 1) {
        this.currentScrollIndex++;
      }
      this.scrollView.scrollToOffset(new cc.Vec2(120 * this.currentScrollIndex, this.scrollView.getScrollOffset().y), .2, true);
    };
    TaoBanViewController.prototype.onClickPrevius = function() {
      MusicPlayer.default.getInstance().playEffect("Sounds/sfx_btn_bet");
      this.scrollView.stopAutoScroll();
      if (this.currentScrollIndex > 0) {
        this.currentScrollIndex--;
      }
      this.scrollView.scrollToOffset(new cc.Vec2(120 * this.currentScrollIndex, this.scrollView.getScrollOffset().y), .2, true);
    };
    TaoBanViewController.prototype.ontextChanged = function(text, editBox, customEventData) {
      editBox.string = StringUtil.default.removeSpecialCharacter(text);
    };
    __decorate([property(cc.Node)], TaoBanViewController.prototype, "mainContent", void 0);
    __decorate([property(cc.Prefab)], TaoBanViewController.prototype, "itemPrefab", void 0);
    __decorate([property(cc.ScrollView)], TaoBanViewController.prototype, "scrollView", void 0);
    __decorate([property(cc.EditBox)], TaoBanViewController.prototype, "edtPassword", void 0);
    __decorate([property(cc.Toggle)], TaoBanViewController.prototype, "checkBoxPlayer1", void 0);
    __decorate([property(cc.Toggle)], TaoBanViewController.prototype, "checkBoxPlayer2", void 0);
    __decorate([property(cc.Toggle)], TaoBanViewController.prototype, "checkBoxPlayer3", void 0);
    __decorate([property(cc.Label)], TaoBanViewController.prototype, "lblMaxPlayer1", void 0);
    __decorate([property(cc.Label)], TaoBanViewController.prototype, "lblMaxPlayer2", void 0);
    __decorate([property(cc.Label)], TaoBanViewController.prototype, "lblMaxPlayer3", void 0);
    __decorate([property(cc.Button)], TaoBanViewController.prototype, "btnOK", void 0);
    return TaoBanViewController = __decorate([ccclass], TaoBanViewController);
  }(CardPopupBase.default);
moduleExports.default = TaoBanViewController;
void 0;
