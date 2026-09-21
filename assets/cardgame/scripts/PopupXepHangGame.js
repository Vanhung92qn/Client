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
var CardPopupBase = require("./CardPopupBase"),
  MusicPlayer = require("./MusicPlayer"),
  CommonPrefabsManager = require("./CommonPrefabsManager"),
  GameHTTPManager = require("./GameHTTPManager"),
  GameConfigManager = require("./GameConfigManager"),
  ItemPoint = require("./ItemPoint"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  StringUtil = require("./StringUtil"),
  ItemDuaTop = require("./ItemDuaTop"),
  ItemLsDuaTop = require("./ItemLsDuaTop"),
  GameZOrder = require("./GameZOrder"),
  PopupHelpImage = require("./PopupHelpImage"),
  GameUtils = require("./GameUtils"),
  AnalyticsManager = require("./AnalyticsManager"),
  OrientationManager = require("./OrientationManager"),
  BaccaratLiveVariantConfig = require("./BaccaratLiveVariantConfig"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  E = function(BaseClass) {
    function PopupXepHangGame() {
      var self = null !== BaseClass && BaseClass.apply(this, arguments) || this;
      self.nodePopupXepHangGame = null;
      self.nodePopupDuaTop = null;
      self.nodePopupLsDuaTop = null;
      self.txtHang = null;
      self.txtPoint = null;
      self.txTotalBet = null;
      self.lbTimeCountDown = null;
      self.nodeTotalBet = null;
      self.nodeLoading = null;
      self.contend = null;
      self.contendScrollView = null;
      self.scrollView = null;
      self.itemPoint = null;
      self.itemPointTx = null;
      self.itemDuaTopPrefab = null;
      self.itemLsDuaTopPrefab = null;
      self.arrowNextDayLsDuaTop = null;
      self.arrowPreDayLsDuaTop = null;
      self.txtTittle = null;
      self.lbDateShowLSTop = null;
      self.nodeFullTop = null;
      self.tabDuatop = null;
      self.tabSLDuatop = null;
      self.listSpriteFrameTab = [];
      self.nodeSelectDateTime = null;
      self.lbTimeRequest = null;
      self.buttonRequestNextDay = null;
      self.buttonRequestPrevDay = null;
      self.scrollContentViewTop = -26;
      self.scrollContentViewBottom = -390;
      self.extraScrollContentView = 50;
      self.nodeBoardInfo = null;
      self.nodeTongThangOn = null;
      self.nodeSanHuOn = null;
      self.nodeTuanOn = null;
      self.nodeNgayOn = null;
      self.nodeBoardLeft = null;
      self.txtEmpty = null;
      self.dataDuatop = null;
      self.dataLsDuatop = null;
      self.listCachePoint = [];
      self.timeViewHistory = "";
      self.timeViewHistoryNext = "";
      self.timeViewHistoryPrev = "";
      self.callBackClose = null;
      self.txChatColor = [new cc.Color(235, 0, 0, 255), new cc.Color(235, 235, 0, 255), new cc.Color(0, 235, 0, 255), new cc.Color(0, 150, 255,
        255), new cc.Color(0, 150, 255, 255), new cc.Color(0, 150, 255, 255), new cc.Color(0, 150, 255, 255), new cc.Color(0, 150, 255,
        255), new cc.Color(0, 150, 255, 255), new cc.Color(0, 150, 255, 255), new cc.Color(0, 150, 255, 255), new cc.Color(0, 150, 255,
        255), new cc.Color(0, 150, 255, 255), new cc.Color(133, 0, 255, 255)];
      return self;
    }
    __extends(PopupXepHangGame, BaseClass);
    PopupXepHangGame.prototype.onLoad = function() {
      BaseClass.prototype.onLoad.call(this);
      this.scrollContentViewCache = this.contendScrollView.position.y;
      this.listCachePoint = [];
      if (0 === GameConfigManager.default.getInstance().tabLeftRankingDefault) {
        this.nodeTongThangOn.active = true;
        this.nodeSanHuOn.active = false;
      } else {
        this.nodeTongThangOn.active = false;
        this.nodeSanHuOn.active = true;
      }
      if (0 === GameConfigManager.default.getInstance().tabRightRankingDefault) {
        this.nodeTuanOn.active = true;
        this.nodeNgayOn.active = false;
      } else {
        this.nodeTuanOn.active = false;
        this.nodeNgayOn.active = true;
      }
    };
    PopupXepHangGame.prototype.show = function(callback, duration) {
      if (void 0 === callback) {
        callback = null;
      }
      if (void 0 === duration) {
        duration = .4;
      }
      GameUtils.setFpsNormal();
      BaseClass.prototype.show.call(this, callback, duration);
      this.node.runAction(cc.sequence(cc.delayTime(.1), cc.callFunc(function() {
        this.setTab(this.gameId);
      }.bind(this))));
    };
    PopupXepHangGame.prototype.init = function(gameIdNumber) {
      this.SetGameID(gameIdNumber);
      this.txtTittle.string = "\u0110ANG T\u1ea2I...";
    };
    PopupXepHangGame.prototype.SetOrientation = function(orientation) {
      if (orientation == OrientationManager.Orientation.Portrait) {
        this.scrollContentViewBottom = -1 * this.scrollView.node.getContentSize().height;
      }
    };
    PopupXepHangGame.prototype.SetGameID = function(gameIdNumber) {
      if (gameIdNumber == MessageCardGameHandler.GAME.XITO) {
        this.gameId = MessageCardGameHandler.GAMEID.XITO;
      } else {
        if (gameIdNumber == MessageCardGameHandler.GAME.BINH) {
          this.gameId = MessageCardGameHandler.GAMEID.BINH;
        } else {
          if (gameIdNumber == MessageCardGameHandler.GAME.TIENLEN) {
            this.gameId = MessageCardGameHandler.GAMEID.TIENLEN;
          } else {
            if (gameIdNumber == MessageCardGameHandler.GAME.POKER) {
              this.gameId = MessageCardGameHandler.GAMEID.POKER;
            } else {
              if (gameIdNumber == MessageCardGameHandler.GAME.LIENG) {
                this.gameId = MessageCardGameHandler.GAMEID.LIENG;
              } else {
                if (gameIdNumber == MessageCardGameHandler.GAME.SAM) {
                  this.gameId = MessageCardGameHandler.GAMEID.SAM;
                } else {
                  if (gameIdNumber == MessageCardGameHandler.GAME.XOCDIA) {
                    this.gameId = MessageCardGameHandler.GAMEID.XOCDIA;
                  } else {
                    if (gameIdNumber == MessageCardGameHandler.GAME.PHOM) {
                      this.gameId = MessageCardGameHandler.GAMEID.PHOM;
                    } else {
                      if (gameIdNumber == MessageCardGameHandler.GAME.TLMN) {
                        this.gameId = MessageCardGameHandler.GAMEID.TLMN;
                      } else {
                        if (gameIdNumber == MessageCardGameHandler.GAME.MINI_POKER) {
                          this.gameId = MessageCardGameHandler.GAMEID.MINI_POKER;
                        } else {
                          if (gameIdNumber == MessageCardGameHandler.GAME.KIM_CUONG) {
                            this.gameId = MessageCardGameHandler.GAMEID.KIM_CUONG;
                          } else {
                            if (gameIdNumber == MessageCardGameHandler.GAME.TAIXIU) {
                              this.gameId = MessageCardGameHandler.GAMEID.TAIXIU;
                            } else {
                              if (gameIdNumber == MessageCardGameHandler.GAME.TAIXIU_MD5) {
                                this.gameId = MessageCardGameHandler.GAMEID.TAIXIU_MD5;
                              } else {
                                if (gameIdNumber == MessageCardGameHandler.GAME.UP_DOWN) {
                                  this.gameId = MessageCardGameHandler.GAMEID.UP_DOWN;
                                } else {
                                  if (gameIdNumber == MessageCardGameHandler.GAME.THAN_TAI) {
                                    this.gameId = MessageCardGameHandler.GAMEID.THAN_TAI;
                                  } else {
                                    if (gameIdNumber == MessageCardGameHandler.GAME.BAU_CUA) {
                                      this.gameId = MessageCardGameHandler.GAMEID.BAU_CUA;
                                    } else {
                                      if (gameIdNumber == MessageCardGameHandler.GAME.SICBO) {
                                        this.gameId = MessageCardGameHandler.GAMEID.SICBO;
                                      } else {
                                        if (gameIdNumber == MessageCardGameHandler.GAME.FOOT_BALL) {
                                          this.gameId = MessageCardGameHandler.GAMEID.FOOT_BALL;
                                        } else {
                                          if (gameIdNumber == MessageCardGameHandler.GAME.BACAY) {
                                            this.gameId = MessageCardGameHandler.GAMEID.BACAY;
                                          } else {
                                            if (gameIdNumber == MessageCardGameHandler.GAME.CATTE) {
                                              this.gameId = MessageCardGameHandler.GAMEID.CATTE;
                                            } else {
                                              if (gameIdNumber == MessageCardGameHandler.GAME.TAIXIU_LIVESTREAM) {
                                                this.gameId = MessageCardGameHandler.GAMEID.TAIXIU_LIVESTREAM;
                                              } else {
                                                if (gameIdNumber == MessageCardGameHandler.GAME.AVIATOR) {
                                                  this.gameId = MessageCardGameHandler.GAMEID.AVIATOR;
                                                } else {
                                                  if (gameIdNumber == MessageCardGameHandler.GAME.TAIXIU_LIVESTREAM) {
                                                    this.gameId = MessageCardGameHandler.GAMEID.TAIXIU_LIVESTREAM;
                                                  } else {
                                                    if (gameIdNumber == MessageCardGameHandler.GAME.DAO_VANG) {
                                                      this.gameId = MessageCardGameHandler.GAMEID.DAO_VANG;
                                                    } else {
                                                      if (gameIdNumber == MessageCardGameHandler.GAME.XDLIVE_V2) {
                                                        this.gameId = MessageCardGameHandler.GAMEID.XDLIVE_V2;
                                                      } else {
                                                        if (gameIdNumber == MessageCardGameHandler.GAME.TXSTLIVE) {
                                                          this.gameId = MessageCardGameHandler.GAMEID.TXSTLIVE;
                                                        } else {
                                                          if (gameIdNumber == MessageCardGameHandler.GAME.PLINKO) {
                                                            this.gameId = MessageCardGameHandler.GAMEID.PLINKO;
                                                          } else {
                                                            if (gameIdNumber == MessageCardGameHandler.GAME.SICBOLIVE) {
                                                              this.gameId = MessageCardGameHandler.GAMEID.SICBO_LIVE;
                                                            } else {
                                                              if (gameIdNumber == MessageCardGameHandler.GAME.BACCARAT_LIVE || gameIdNumber == BaccaratLiveVariantConfig.BaccaratLiveVariant.gameIDNumber) {
                                                                this.gameId = BaccaratLiveVariantConfig.BaccaratLiveVariant.gameID;
                                                              } else {
                                                                if (gameIdNumber == MessageCardGameHandler.GAME.DRAGONTIGER_LIVE) {
                                                                  this.gameId = MessageCardGameHandler.GAMEID.DRAGONTIGER_LIVE;
                                                                } else {
                                                                  if (gameIdNumber == MessageCardGameHandler.GAME.BAUCUA_LIVE) {
                                                                    this.gameId = MessageCardGameHandler.GAMEID.BAUCUA_LIVE;
                                                                  } else {
                                                                    if (gameIdNumber == MessageCardGameHandler.GAME.BAUCUA_BONUS) {
                                                                      this.gameId = MessageCardGameHandler.GAMEID.BAUCUA_BONUS;
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    PopupXepHangGame.prototype.SetTitleBXH = function(gameId) {
      this.txtTittle.string = "X\u1ebeP H\u1ea0NG";
    };
    PopupXepHangGame.prototype.SetTitleDuaTop = function(gameId) {
      switch (gameId) {
        case MessageCardGameHandler.GAMEID.XITO:
          this.txtTittle.string = "CAO TH\u1ee6 X\xcc T\u1ed0";
          break;
        case MessageCardGameHandler.GAMEID.BINH:
          this.txtTittle.string = "CAO TH\u1ee6 M\u1eacU BINH";
          break;
        case MessageCardGameHandler.GAMEID.TIENLEN:
          this.txtTittle.string = "CAO TH\u1ee6 TL \u0110\u1ebeM L\xc1";
          break;
        case MessageCardGameHandler.GAMEID.POKER:
          this.txtTittle.string = "CAO TH\u1ee6 POKER";
          break;
        case MessageCardGameHandler.GAMEID.LIENG:
          this.txtTittle.string = "CAO TH\u1ee6 LI\xcaNG";
          break;
        case MessageCardGameHandler.GAMEID.SAM:
          this.txtTittle.string = "CAO TH\u1ee6 S\xc2M L\u1ed0C";
          break;
        case MessageCardGameHandler.GAMEID.XOCDIA:
          this.txtTittle.string = "CAO TH\u1ee6 X\xd3C \u0110\u0128A";
          break;
        case MessageCardGameHandler.GAMEID.PHOM:
          this.txtTittle.string = "CAO TH\u1ee6 PH\u1eceM";
          break;
        case MessageCardGameHandler.GAMEID.TLMN:
          this.txtTittle.string = "CAO TH\u1ee6 TL MI\u1ec0N NAM";
          break;
        case MessageCardGameHandler.GAMEID.MINI_POKER:
          this.txtTittle.string = "CAO TH\u1ee6 MINI POKER";
          break;
        case MessageCardGameHandler.GAMEID.KIM_CUONG:
          this.txtTittle.string = "CAO TH\u1ee6 KIM C\u01af\u01a0NG";
          break;
        case MessageCardGameHandler.GAMEID.TAIXIU:
          this.txtTittle.string = "CAO TH\u1ee6 T\xc0I X\u1ec8U";
          break;
        case MessageCardGameHandler.GAMEID.TAIXIU_MD5:
          this.txtTittle.string = "CAO TH\u1ee6 T\xc0I X\u1ec8U MD5";
          break;
        case MessageCardGameHandler.GAMEID.UP_DOWN:
          this.txtTittle.string = "CAO TH\u1ee6 TR\xcaN D\u01af\u1edaI";
          break;
        case MessageCardGameHandler.GAMEID.THAN_TAI:
          this.txtTittle.string = "CAO TH\u1ee6 TH\u1ea6N T\xc0I";
          break;
        case MessageCardGameHandler.GAMEID.BAU_CUA:
          this.txtTittle.string = "CAO TH\u1ee6 B\u1ea6U CUA";
          break;
        case MessageCardGameHandler.GAMEID.SICBO:
          this.txtTittle.string = "CAO TH\u1ee6 SICBO";
          break;
        case MessageCardGameHandler.GAMEID.FOOT_BALL:
          this.txtTittle.string = "CAO TH\u1ee6 B\xd3NG \u0110\xc1";
          break;
        case MessageCardGameHandler.GAMEID.BACAY:
          this.txtTittle.string = "CAO TH\u1ee6 C\xc0O R\xd9A";
          break;
        case MessageCardGameHandler.GAMEID.CATTE:
          this.txtTittle.string = "CAO TH\u1ee6 CATTE";
          break;
        case MessageCardGameHandler.GAMEID.TAIXIU_LIVESTREAM:
          this.txtTittle.string = "CAO TH\u1ee6 T\xc0I X\u1ec8U LIVESTREAM";
          break;
        case MessageCardGameHandler.GAMEID.AVIATOR:
          this.txtTittle.string = "CAO TH\u1ee6 AVIATOR";
          break;
        case MessageCardGameHandler.GAMEID.TXSTLIVE:
          this.txtTittle.string = "CAO TH\u1ee6 T\xc0I X\u1ec8U LIVESTREAM";
          break;
        case MessageCardGameHandler.GAMEID.SICBO_LIVE:
          this.txtTittle.string = "CAO TH\u1ee6 SICBO LIVESTREAM";
          break;
        case MessageCardGameHandler.GAMEID.DRAGONTIGER_LIVE:
          this.txtTittle.string = "CAO TH\u1ee6 R\u1ed2NG H\u1ed4 LIVESTREAM";
          break;
        case MessageCardGameHandler.GAMEID.BAUCUA_BONUS:
          this.txtTittle.string = "CAO TH\u1ee6 B\u1ea6U CUA BONUS";
      }
    };
    PopupXepHangGame.prototype.isEnableChooseDate = function(gameId) {
      return 0 == gameId.localeCompare(MessageCardGameHandler.GAMEID.AVIATOR) || 0 == gameId.localeCompare(MessageCardGameHandler.GAMEID.DAO_VANG) || 0 == gameId.localeCompare(MessageCardGameHandler.GAMEID.PLINKO);
    };
    PopupXepHangGame.prototype.isEnableChooseType = function(gameId) {
      return !(0 != gameId.localeCompare(MessageCardGameHandler.GAMEID.TAIXIU) && 0 != gameId.localeCompare(MessageCardGameHandler.GAMEID.TAIXIU_MD5) && 0 != gameId.localeCompare(MessageCardGameHandler.GAMEID
          .TAIXIU_LIVESTREAM) && 0 != gameId.localeCompare(MessageCardGameHandler.GAMEID.XOCDIA) && 0 != gameId.localeCompare(MessageCardGameHandler.GAMEID.BAU_CUA) && 0 != gameId
        .localeCompare(MessageCardGameHandler.GAMEID.XDLIVE_V2) && 0 != gameId.localeCompare(MessageCardGameHandler.GAMEID.SICBO_LIVE) && !BaccaratLiveVariantConfig.BaccaratLiveVariant.isBaccaratLiveID(gameId) &&
        0 != gameId.localeCompare(MessageCardGameHandler.GAMEID.DRAGONTIGER_LIVE) && 0 != gameId.localeCompare(MessageCardGameHandler.GAMEID.BAUCUA_LIVE) && 0 != gameId.localeCompare(MessageCardGameHandler.GAMEID
          .BAUCUA_BONUS));
    };
    PopupXepHangGame.prototype.onLoadErr = function(errorMessage) {
      CommonPrefabsManager.default.getInstance().hideLoading();
      CommonPrefabsManager.default.getInstance().showPopupMessageUtil(errorMessage);
    };
    PopupXepHangGame.prototype.onClickClose = function() {
      this.contendScrollView.active = false;
      this.hide(this.callBackClose);
    };
    PopupXepHangGame.prototype.setTab = function(gameId, dateText) {
      if (void 0 === dateText) {
        dateText = "";
      }
      this.contendScrollView.scale = 0;
      CommonPrefabsManager.default.getInstance().showLoading();
      if (GameConfigManager.default.getInstance().isLoginWebcc) {
        this.requestRankingForWebCC(gameId);
      } else {
        this.requestRanking(gameId, dateText);
      }
    };
    PopupXepHangGame.prototype.requestRankingForWebCC = function(gameId) {
      var self = this,
        url = GameConfigManager.default.getInstance().getTopUpDownURL + "?type=turnover&from=0&size=20&gid=" + gameId;
      GameHTTPManager.default.getInstance().sendGetHttpRequest(url, function(response) {
        self.nodeLoading.active = false;
        var isTaiXiuWebCC = self.gameId == MessageCardGameHandler.GAMEID.TAIXIU && GameConfigManager.default.getInstance().isLoginWebcc;
        if (null == response.event || void 0 == response.event || isTaiXiuWebCC) {
          self.nodePopupXepHangGame.active = true;
          self.nodePopupDuaTop.active = false;
          self.nodePopupLsDuaTop.active = false;
          self.nodeFullTop.active = false;
          self.txtTittle.node.active = true;
          self.SetTitleBXH(self.gameId);
          self.showRank(response);
        } else {
          self.startCoundDownTimeDuaTop();
          self.listConditionReward = response.event.content;
          self.nodePopupXepHangGame.active = false;
          self.nodePopupDuaTop.active = true;
          self.nodeFullTop.active = true;
          self.txtTittle.node.active = false;
          self.SetTitleDuaTop(self.gameId);
          self.dataDuatop = response;
          self.showDuaTop(response);
        }
      }, function(errorMessage) {
        self.txtTittle.string = "";
        self.onLoadErr(errorMessage);
      });
    };
    PopupXepHangGame.prototype.requestRanking = function(gameId, dateText) {
      var requestBody,
        self = this;
      requestBody = {};
      var requestBodyJson = JSON.stringify(requestBody),
        dateQuery = "";
      if (this.isEnableChooseDate(gameId) && (dateQuery = "&date=" + (0 == dateText.length ? this.getFormattedDate(new Date()) : dateText)), this.isEnableChooseType(
          gameId)) {
        var url = GameConfigManager.default.getInstance().urlRanking,
          winPathSuffix = "";
        if (this.nodeTongThangOn.active) {
          url += "top/";
          winPathSuffix = "/win";
        } else {
          url += "top-jp/";
        }
        url += gameId + (this.nodeNgayOn.active ? "/daily" : "/weekly") + winPathSuffix;
        var selfRankError = this;
        GameHTTPManager.default.getInstance().sendGetHttpRequest(url, function(response) {
          switch (self.nodeLoading.active = false, self.nodeBoardInfo.active = true, self.nodeBoardLeft.active = true, self.gameId) {
            case MessageCardGameHandler.GAMEID.SICBO_LIVE:
            case MessageCardGameHandler.GAMEID.TAIXIU_MD5:
            case MessageCardGameHandler.GAMEID.DRAGONTIGER_LIVE:
            case MessageCardGameHandler.GAMEID.BAUCUA_LIVE:
            case MessageCardGameHandler.GAMEID.BAUCUA_BONUS:
              self.nodeBoardLeft.active = false;
          }
          if (BaccaratLiveVariantConfig.BaccaratLiveVariant.isBaccaratLiveID(self.gameId)) {
            self.nodeBoardLeft.active = false;
          }
          self.nodePopupXepHangGame.active = true;
          self.nodePopupDuaTop.active = false;
          self.nodePopupLsDuaTop.active = false;
          self.nodeFullTop.active = false;
          self.txtTittle.node.active = true;
          self.SetTitleBXH(self.gameId);
          self.showRank(response);
          CommonPrefabsManager.default.getInstance().hideLoading();
        }, function(errorMessage) {
          if (selfRankError.node) {
            selfRankError.txtTittle.string = "";
            selfRankError.onLoadErr(errorMessage);
          }
          CommonPrefabsManager.default.getInstance().hideLoading();
        }, true);
      } else {
        url = GameConfigManager.default.getInstance().duatopTxURL + "?type=turnover&from=0&size=20&gid=" + gameId + dateQuery;
        var selfDuaTopError = this;
        GameHTTPManager.default.getInstance().sendPostHttpRequest(url, requestBodyJson, function(response) {
          self.nodeLoading.active = false;
          var isTaiXiuWebCC = self.gameId == MessageCardGameHandler.GAMEID.TAIXIU && GameConfigManager.default.getInstance().isLoginWebcc;
          if (null == response.event || void 0 == response.event || isTaiXiuWebCC) {
            self.nodeBoardInfo.active = false;
            self.nodePopupXepHangGame.active = true;
            self.nodePopupDuaTop.active = false;
            self.nodePopupLsDuaTop.active = false;
            self.nodeFullTop.active = false;
            self.txtTittle.node.active = true;
            self.SetTitleBXH(self.gameId);
            self.showRank(response);
          } else {
            self.startCoundDownTimeDuaTop();
            self.listConditionReward = response.event.content;
            self.nodeBoardInfo.active = false;
            self.nodePopupXepHangGame.active = false;
            self.nodePopupDuaTop.active = true;
            self.nodeFullTop.active = true;
            self.txtTittle.node.active = false;
            self.SetTitleDuaTop(self.gameId);
            self.dataDuatop = response;
            self.showDuaTop(response);
          }
          CommonPrefabsManager.default.getInstance().hideLoading();
        }, function(errorMessage) {
          if (selfDuaTopError.node) {
            selfDuaTopError.txtTittle.string = "";
            selfDuaTopError.onLoadErr(errorMessage);
          }
          CommonPrefabsManager.default.getInstance().hideLoading();
        });
      }
    };
    PopupXepHangGame.prototype.requestLsDuaTop = function(gameId, dateText) {
      var requestBody,
        self = this,
        url = GameConfigManager.default.getInstance().lsDuatopTxURL + "?event_type=top_reward&gid=" + gameId + "&date=" + dateText;
      requestBody = {};
      this.contendScrollView.scale = 0;
      CommonPrefabsManager.default.getInstance().showLoading();
      var requestBodyJson = JSON.stringify(requestBody);
      GameHTTPManager.default.getInstance().sendPostHttpRequest(url, requestBodyJson, function(response) {
        self.dataLsDuatop = response;
        self.showLsDuaTop(response);
      }, function(errorMessage) {
        self.txtTittle.string = "";
        self.onLoadErr(errorMessage);
      });
    };
    PopupXepHangGame.prototype.checkPassTotalBet = function(totalBet, rank) {
      var rewardTierCount = Object.keys(this.listConditionReward).length,
        rewardMoney = 0;
      if (rank <= rewardTierCount && rank > 0 && totalBet > this.listConditionReward[rank.toString()].cond.turnover) {
        rewardMoney = this.listConditionReward[rank.toString()].gift.money;
      } else {
        if (totalBet > this.listConditionReward[(rewardTierCount - 1).toString()].cond.turnover && rank > rewardTierCount) {
          rewardMoney = this.listConditionReward[(rewardTierCount - 1).toString()].gift.money;
        }
      }
      return rewardMoney;
    };
    PopupXepHangGame.prototype.getRewardByRank = function(rank) {
      return rank <= Object.keys(this.listConditionReward).length && rank > 0 ? this.listConditionReward[rank.toString()].gift.money : 0;
    };
    PopupXepHangGame.prototype.onShowLsDuaTopClick = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      this.nodePopupLsDuaTop.active = true;
      this.nodePopupDuaTop.active = false;
      this.tabDuatop.spriteFrame = this.listSpriteFrameTab[1];
      this.tabSLDuatop.spriteFrame = this.listSpriteFrameTab[2];
      this.contendScrollView.removeAllChildren(true);
      this.listCachePoint = [];
      if (null != this.dataLsDuatop) {
        this.showLsDuaTop(this.dataLsDuatop, true);
      } else {
        this.requestLsDuaTop(this.gameId, this.getFormattedDate(new Date()));
      }
      AnalyticsManager.default.getInstance().logEvent("ClickButtonTaiXiu", JSON.parse('{"ButtonName":"TabLichSuDuaTopTX"}'));
    };
    PopupXepHangGame.prototype.onShowDuaTopClick = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      this.nodePopupLsDuaTop.active = false;
      this.nodePopupDuaTop.active = true;
      this.tabDuatop.spriteFrame = this.listSpriteFrameTab[0];
      this.tabSLDuatop.spriteFrame = this.listSpriteFrameTab[3];
      this.contendScrollView.removeAllChildren(true);
      this.updateTimeDuaTop();
      this.listCachePoint = [];
      if (null != this.dataDuatop) {
        this.showDuaTop(this.dataDuatop, true);
      } else {
        this.setTab(this.gameId);
      }
      AnalyticsManager.default.getInstance().logEvent("ClickButtonTaiXiu", JSON.parse('{"ButtonName":"TabDuaTopTX"}'));
    };
    PopupXepHangGame.prototype.getFormattedDate = function(date) {
      var year = date.getFullYear(),
        month = (1 + date.getMonth()).toString();
      month = month.length > 1 ? month : "0" + month;
      var day = date.getDate().toString();
      return (day = day.length > 1 ? day : "0" + day) + "/" + month + "/" + year;
    };
    PopupXepHangGame.prototype.getTotalBetMaxCanGet = function(totalBet) {
      for (var turnoverTarget = 0, rank = Object.keys(this.listConditionReward).length; rank > 0; rank--) {
        if (totalBet < (turnoverTarget = this.listConditionReward[rank.toString()].cond.turnover)) {
          return turnoverTarget;
        }
      }
      return this.listConditionReward[1].cond.turnover;
    };
    PopupXepHangGame.prototype.getTotalBetTargetMin = function() {
      for (var turnoverTarget = 0, rank = Object.keys(this.listConditionReward).length; rank > 0; rank--) {
        if ((turnoverTarget = this.listConditionReward[rank.toString()].cond.turnover) > 0) {
          return turnoverTarget;
        }
      }
      return this.listConditionReward[1].cond.turnover;
    };
    PopupXepHangGame.prototype.getTotalBetByRank = function(rank) {
      var rewardTier = this.listConditionReward[rank.toString()];
      if (null == rewardTier || void 0 == rewardTier) {
        return 1e10;
      }
      var turnoverTarget = rewardTier.cond.turnover;
      if (null == turnoverTarget || void 0 == turnoverTarget || Number.isNaN(turnoverTarget)) {
        turnoverTarget = 1e10;
      }
      return turnoverTarget;
    };
    PopupXepHangGame.prototype.startCoundDownTimeDuaTop = function() {
      this.updateTimeDuaTop();
      this.lbTimeCountDown.schedule(this.updateTimeDuaTop.bind(this), 1, cc.macro.REPEAT_FOREVER, 0);
    };
    PopupXepHangGame.prototype.updateTimeDuaTop = function() {
      var endOfDay = new Date();
      endOfDay.setHours(23, 59, 59);
      var endSeconds = Math.floor(endOfDay.getTime() / 1e3),
        nowSeconds = Math.floor(new Date().getTime() / 1e3),
        totalMinutes = (endSeconds - nowSeconds) / 60;
      this.lbTimeCountDown.string = this.zeroPad(Math.floor(totalMinutes / 60), 2) + ":" + this.zeroPad(Math.floor(totalMinutes % 60), 2) + ":" + this.zeroPad((
        endSeconds - nowSeconds) % 60, 2);
    };
    PopupXepHangGame.prototype.zeroPad = function(value, width) {
      var padArraySize = width - value.toString().length + 1;
      return Array(+(padArraySize > 0 && padArraySize)).join("0") + value;
    };
    PopupXepHangGame.prototype.showDuaTop = function(response, showAllItems) {
      if (void 0 === showAllItems) {
        showAllItems = false;
      }
      var userTurnover = response.event.user.turnover;
      this.txTotalBet.string = StringUtil.default.formatMoneyNumberWithVietnameseUnit(userTurnover);
      var minTargetTurnover = this.getTotalBetTargetMin();
      if (minTargetTurnover > 0) {
        var minTargetTurnoverText = StringUtil.default.formatMoneyNumberWithVietnameseUnit(minTargetTurnover);
        cc.sys.localStorage.setItem("TargetTurnOverDuaTop", minTargetTurnoverText);
      }
      if (this.nodeTotalBet.active = true, null !== response.data && void 0 !== response.data && response.data.length > 0) {
        for (var index = 0; index < response.data.length; index++) {
          var itemNode, itemDuaTop;
          if (this.gameId === MessageCardGameHandler.GAMEID.TAIXIU) {
            itemDuaTop = (itemNode = cc.instantiate(this.itemDuaTopPrefab)).getComponent(ItemDuaTop.default);
            if (index < 10 && index < this.txChatColor.length) {
              itemDuaTop.txtTenHienThi.node.color = this.txChatColor[index];
            } else {
              itemDuaTop.txtTenHienThi.node.color = this.txChatColor[this.txChatColor.length - 1];
            }
          } else {
            itemDuaTop = (itemNode = cc.instantiate(this.itemPoint)).getComponent(ItemDuaTop.default);
          }
          itemNode.parent = this.contendScrollView;
          this.listCachePoint.push(itemDuaTop);
          var targetTotalBet,
            rewardMoney = 0;
          rewardMoney = this.checkPassTotalBet(response.data[index].game_stake, index + 1);
          targetTotalBet = this.getTotalBetByRank(index + 1);
          var isPassTotalBet = false,
            isRewardHighlighted = false;
          if (rewardMoney > 0) {
            isPassTotalBet = true;
            isRewardHighlighted = true;
          }
          rewardMoney = this.getRewardByRank(index + 1);
          var winLost = response.data[index].game_winlost;
          if (winLost < 0) {
            winLost = 0;
          }
          itemDuaTop.loadUI(index + 1, response.data[index].fullname, winLost, response.data[index].user_id, response.data[index].username, targetTotalBet, rewardMoney, isRewardHighlighted, isPassTotalBet);
          if (showAllItems) {
            itemDuaTop.nodeContent.active = true;
          } else {
            if (index > 7) {
              itemDuaTop.nodeContent.active = false;
            }
          }
        }
        this.scrollView.scrollToTop();
        this.updateViewItem();
        CommonPrefabsManager.default.getInstance().hideLoading();
        this.contendScrollView.scale = 1;
        this.contendScrollView.active = true;
      } else {
        CommonPrefabsManager.default.getInstance().hideLoading();
      }
    };
    PopupXepHangGame.prototype.onShowLsDuaTopNextClick = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      if (null != this.timeViewHistoryNext && "null" != this.timeViewHistoryNext) {
        this.requestLsDuaTop(this.gameId, this.timeViewHistoryNext);
      }
    };
    PopupXepHangGame.prototype.onShowLsDuaTopPrevClick = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      if (null != this.timeViewHistoryPrev && "null" != this.timeViewHistoryPrev) {
        this.requestLsDuaTop(this.gameId, this.timeViewHistoryPrev);
      }
    };
    PopupXepHangGame.prototype.onShowRankNormalNextClick = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      if (null != this.timeViewHistoryNext && "" != this.timeViewHistoryNext) {
        CommonPrefabsManager.default.getInstance().showLoading();
        this.requestRanking(this.gameId, this.timeViewHistoryNext);
      }
    };
    PopupXepHangGame.prototype.onShowRankNormalPrevClick = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      if (null != this.timeViewHistoryPrev && "" != this.timeViewHistoryPrev) {
        CommonPrefabsManager.default.getInstance().showLoading();
        this.requestRanking(this.gameId, this.timeViewHistoryPrev);
      }
    };
    PopupXepHangGame.prototype.onClickShowHelpDuaTop = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      CommonPrefabsManager.default.getInstance().showLoading();
      cc.loader.loadRes("Help/PopupHelpDuaTopTaiXiu", function(error, prefab) {
        if (CommonPrefabsManager.default.getInstance().hideLoading(), null === prefab) {
          CommonPrefabsManager.default.getInstance().showPopupMessageUtil("L\u1ed7i 404, Xin Th\u1eed l\u1ea1i!");
        } else {
          var popupNode = cc.instantiate(prefab);
          popupNode.parent = this.node;
          popupNode.x = 0;
          popupNode.y = 0;
          popupNode.zIndex = GameZOrder.default.TOP;
          popupNode.getComponent(PopupHelpImage.default).show();
        }
      }.bind(this));
      AnalyticsManager.default.getInstance().logEvent("ClickButtonTaiXiu", JSON.parse('{"ButtonName":"ShowHelpDuaTop"}'));
    };
    PopupXepHangGame.prototype.showLsDuaTop = function(response, showAllItems) {
      if (void 0 === showAllItems && (showAllItems = false), null !== response.data && void 0 !== response.data && response.data.length > 0) {
        this.contendScrollView.removeAllChildren(true);
        this.lbDateShowLSTop.string = response.date;
        this.timeViewHistory = response.date;
        this.timeViewHistoryNext = response.next;
        this.timeViewHistoryPrev = response.prev;
        if (null != this.timeViewHistoryNext && "null" != this.timeViewHistoryNext) {
          this.arrowNextDayLsDuaTop.color = cc.Color.WHITE;
        } else {
          this.arrowNextDayLsDuaTop.color = cc.Color.GRAY;
        }
        if (null != this.timeViewHistoryPrev && "null" != this.timeViewHistoryPrev) {
          this.arrowPreDayLsDuaTop.color = cc.Color.WHITE;
        } else {
          this.arrowPreDayLsDuaTop.color = cc.Color.GRAY;
        }
        for (var index = 0; index < response.data.length; index++) {
          var itemNode,
            itemLsDuaTop,
            rank = response.data[index].rank;
          itemLsDuaTop = this.gameId === MessageCardGameHandler.GAMEID.TAIXIU ? (itemNode = cc.instantiate(this.itemLsDuaTopPrefab)).getComponent(ItemLsDuaTop.default) : (itemNode = cc
            .instantiate(this.itemPoint)).getComponent(ItemLsDuaTop.default);
          itemNode.parent = this.contendScrollView;
          this.listCachePoint.push(itemLsDuaTop);
          if (rank < 10 && rank < this.txChatColor.length) {
            itemLsDuaTop.txtTenHienThi.node.color = this.txChatColor[rank - 1];
          } else {
            itemLsDuaTop.txtTenHienThi.node.color = this.txChatColor[this.txChatColor.length - 1];
          }
          itemLsDuaTop.loadUI(rank, index, response.data[index].fullname, response.data[index].uid, response.data[index].fullname, response.data[index].gift_money, response.data[index].winlost);
          if (showAllItems) {
            itemLsDuaTop.nodeContent.active = true;
          } else {
            if (index > 7) {
              itemLsDuaTop.nodeContent.active = false;
            }
          }
        }
        this.scrollView.scrollToTop();
        this.updateViewItem();
        CommonPrefabsManager.default.getInstance().hideLoading();
        this.contendScrollView.scale = 1;
        this.contendScrollView.active = true;
      } else {
        CommonPrefabsManager.default.getInstance().hideLoading();
      }
    };
    PopupXepHangGame.prototype.showRank = function(response) {
      if (null !== response.data && void 0 !== response.data && response.data.length > 0) {
        if (response.hasOwnProperty("date") && response.hasOwnProperty("next") && response.hasOwnProperty("prev")) {
          if (null != this.nodeSelectDateTime && null != response.date) {
            this.nodeSelectDateTime.active = true;
            this.timeViewHistory = response.date;
            this.lbTimeRequest.string = this.timeViewHistory;
          }
          if (null == response.next) {
            this.buttonRequestNextDay.interactable = false;
          } else {
            this.timeViewHistoryNext = response.next;
            this.buttonRequestNextDay.interactable = true;
          }
          if (null == response.prev) {
            this.buttonRequestPrevDay.interactable = false;
          } else {
            this.timeViewHistoryPrev = response.prev;
            this.buttonRequestPrevDay.interactable = true;
          }
        }
        for (var cacheIndex = 0; cacheIndex < this.listCachePoint.length; cacheIndex++) {
          this.listCachePoint[cacheIndex].node.active = false;
        }
        for (var index = 0; index < response.data.length; index++) {
          var itemNode,
            rankItem,
            rowData = response.data[index];
          if (rowData.total) {
            rowData.game_winlost = rowData.total;
          }
          if (!(void 0 === rowData.game_winlost || rowData.game_winlost < 0)) {
            if (0 == this.listCachePoint.length || index >= this.listCachePoint.length) {
              rankItem = (itemNode = this.gameId === MessageCardGameHandler.GAMEID.TAIXIU || this.gameId === MessageCardGameHandler.GAMEID.AVIATOR || this.gameId == MessageCardGameHandler.GAMEID.TAIXIU_MD5 || this
                .gameId === MessageCardGameHandler.GAMEID.TAIXIU_LIVESTREAM || this.gameId === MessageCardGameHandler.GAMEID.XOCDIA || this.gameId === MessageCardGameHandler.GAMEID.BAU_CUA || this
                .gameId === MessageCardGameHandler.GAMEID.DAO_VANG ? cc.instantiate(this.itemPointTx) : cc.instantiate(this.itemPoint)).getComponent(ItemPoint
                .default);
              itemNode.parent = this.contendScrollView;
              this.listCachePoint.push(rankItem);
            } else {
              rankItem = this.listCachePoint[index];
            }
            if (!(this.gameId != MessageCardGameHandler.GAMEID.TAIXIU_MD5 && this.gameId !== MessageCardGameHandler.GAMEID.TAIXIU && this.gameId !== MessageCardGameHandler.GAMEID.AVIATOR && this
                .gameId !== MessageCardGameHandler.GAMEID.TAIXIU_LIVESTREAM && this.gameId !== MessageCardGameHandler.GAMEID.XOCDIA && this.gameId !== MessageCardGameHandler.GAMEID.BAU_CUA && this
                .gameId !== MessageCardGameHandler.GAMEID.DAO_VANG)) {
              if (index < 10 && index < this.txChatColor.length) {
                rankItem.txtTenHienThi.node.color = this.txChatColor[index];
              } else {
                rankItem.txtTenHienThi.node.color = this.txChatColor[this.txChatColor.length - 1];
              }
            }
            rankItem.node.active = true;
            rankItem.loadUI(index + 1, response.data[index].fullname, response.data[index].game_winlost, response.data[index].uid, response.data[index].username);
            rankItem.nodeContent.active = !(index > 7);
          }
        }
        this.scrollView.scrollToTop();
        this.updateViewItem();
        CommonPrefabsManager.default.getInstance().hideLoading();
        this.contendScrollView.scale = 1;
        this.contendScrollView.active = true;
        this.txtEmpty.node.active = false;
      } else {
        if (null != this.buttonRequestPrevDay) {
          this.buttonRequestPrevDay.interactable = false;
        }
        CommonPrefabsManager.default.getInstance().hideLoading();
        for (cacheIndex = 0; cacheIndex < this.listCachePoint.length; cacheIndex++) {
          this.listCachePoint[cacheIndex].node.active = false;
        }
        this.nodePopupXepHangGame.active = false;
        this.txtEmpty.node.active = true;
        this.txtEmpty.string = this.nodeTongThangOn.active ? "Ch\u01b0a c\xf3 l\u1ecbch s\u1eed th\u1eafng" :
          "Ch\u01b0a c\xf3 l\u1ecbch s\u1eed n\u1ed5 h\u0169";
        this.timeViewHistory = response.date;
        this.lbTimeRequest.string = response.date;
        this.timeViewHistoryNext = response.next;
        if (null !== response.next) {
          this.buttonRequestNextDay.node.active = true;
          this.buttonRequestNextDay.interactable = true;
        }
      }
    };
    PopupXepHangGame.prototype.callbackTopPoint = function(scrollView, eventType) {
      if (eventType == cc.ScrollView.EventType.SCROLLING) {
        this.updateViewItem();
      }
    };
    PopupXepHangGame.prototype.updateViewItem = function() {
      if (!(this.contendScrollView.position.y < this.scrollContentViewCache)) {
        for (var index = 0; index < this.listCachePoint.length; index++) {
          if (this.listCachePoint[index].node.position.y + this.contendScrollView.position.y <= this.scrollContentViewTop + this
            .extraScrollContentView + this.scrollContentViewCache && this.listCachePoint[index].node.position.y + this.contendScrollView
            .position.y >= this.scrollContentViewBottom - this.extraScrollContentView + this.scrollContentViewCache) {
            this.listCachePoint[index].nodeContent.active = true;
          } else {
            this.listCachePoint[index].nodeContent.active = false;
          }
        }
        if (GameUtils.isFpsLow()) {
          GameUtils.setFpsNormal();
        }
      }
    };
    PopupXepHangGame.prototype.getColorOfNameTxMD5 = function(index) {
      return index < 10 && index < this.txChatColor.length ? this.txChatColor[index] : this.txChatColor[10];
    };
    PopupXepHangGame.prototype.onClickTongThang = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      this.nodeTongThangOn.active = true;
      this.nodeSanHuOn.active = false;
      CommonPrefabsManager.default.getInstance().showLoading();
      this.requestRanking(this.gameId, "");
    };
    PopupXepHangGame.prototype.onClickSanHu = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      this.nodeTongThangOn.active = false;
      this.nodeSanHuOn.active = true;
      CommonPrefabsManager.default.getInstance().showLoading();
      this.requestRanking(this.gameId, "");
    };
    PopupXepHangGame.prototype.onClickTuan = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      this.nodeTuanOn.active = true;
      this.nodeNgayOn.active = false;
      CommonPrefabsManager.default.getInstance().showLoading();
      this.requestRanking(this.gameId, "");
    };
    PopupXepHangGame.prototype.onClickNgay = function() {
      MusicPlayer.default.getInstance().playbtnClick();
      this.nodeTuanOn.active = false;
      this.nodeNgayOn.active = true;
      CommonPrefabsManager.default.getInstance().showLoading();
      this.requestRanking(this.gameId, "");
    };
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "nodePopupXepHangGame", void 0);
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "nodePopupDuaTop", void 0);
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "nodePopupLsDuaTop", void 0);
    __decorate([property(cc.Label)], PopupXepHangGame.prototype, "txtHang", void 0);
    __decorate([property(cc.Label)], PopupXepHangGame.prototype, "txtPoint", void 0);
    __decorate([property(cc.Label)], PopupXepHangGame.prototype, "txTotalBet", void 0);
    __decorate([property(cc.Label)], PopupXepHangGame.prototype, "lbTimeCountDown", void 0);
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "nodeTotalBet", void 0);
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "nodeLoading", void 0);
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "contend", void 0);
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "contendScrollView", void 0);
    __decorate([property(cc.ScrollView)], PopupXepHangGame.prototype, "scrollView", void 0);
    __decorate([property(cc.Prefab)], PopupXepHangGame.prototype, "itemPoint", void 0);
    __decorate([property(cc.Prefab)], PopupXepHangGame.prototype, "itemPointTx", void 0);
    __decorate([property(cc.Prefab)], PopupXepHangGame.prototype, "itemDuaTopPrefab", void 0);
    __decorate([property(cc.Prefab)], PopupXepHangGame.prototype, "itemLsDuaTopPrefab", void 0);
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "arrowNextDayLsDuaTop", void 0);
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "arrowPreDayLsDuaTop", void 0);
    __decorate([property(cc.Label)], PopupXepHangGame.prototype, "txtTittle", void 0);
    __decorate([property(cc.Label)], PopupXepHangGame.prototype, "lbDateShowLSTop", void 0);
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "nodeFullTop", void 0);
    __decorate([property(cc.Sprite)], PopupXepHangGame.prototype, "tabDuatop", void 0);
    __decorate([property(cc.Sprite)], PopupXepHangGame.prototype, "tabSLDuatop", void 0);
    __decorate([property(cc.SpriteFrame)], PopupXepHangGame.prototype, "listSpriteFrameTab", void 0);
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "nodeSelectDateTime", void 0);
    __decorate([property(cc.Label)], PopupXepHangGame.prototype, "lbTimeRequest", void 0);
    __decorate([property(cc.Button)], PopupXepHangGame.prototype, "buttonRequestNextDay", void 0);
    __decorate([property(cc.Button)], PopupXepHangGame.prototype, "buttonRequestPrevDay", void 0);
    __decorate([property], PopupXepHangGame.prototype, "scrollContentViewTop", void 0);
    __decorate([property], PopupXepHangGame.prototype, "scrollContentViewBottom", void 0);
    __decorate([property], PopupXepHangGame.prototype, "extraScrollContentView", void 0);
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "nodeBoardInfo", void 0);
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "nodeTongThangOn", void 0);
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "nodeSanHuOn", void 0);
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "nodeTuanOn", void 0);
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "nodeNgayOn", void 0);
    __decorate([property(cc.Node)], PopupXepHangGame.prototype, "nodeBoardLeft", void 0);
    __decorate([property(cc.Label)], PopupXepHangGame.prototype, "txtEmpty", void 0);
    return PopupXepHangGame = __decorate([ccclass], PopupXepHangGame);
  }(CardPopupBase.default);
moduleExports.default = E;
void 0;
