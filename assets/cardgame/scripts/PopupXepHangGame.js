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
var a = require("./CardPopupBase"),
  s = require("./MusicPlayer"),
  r = require("./CommonPrefabsManager"),
  c = require("./GameHTTPManager"),
  l = require("./GameConfigManager"),
  h = require("./ItemPoint"),
  u = require("./MessageCardGameHandler"),
  d = require("./StringUtil"),
  p = require("./ItemDuaTop"),
  f = require("./ItemLsDuaTop"),
  g = require("./GameZOrder"),
  m = require("./PopupHelpImage"),
  y = require("./GameUtils"),
  S = require("./AnalyticsManager"),
  _ = require("./OrientationManager"),
  v = require("./BaccaratLiveVariantConfig"),
  b = cc._decorator,
  C = b.ccclass,
  T = b.property,
  E = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.nodePopupXepHangGame = null;
      e.nodePopupDuaTop = null;
      e.nodePopupLsDuaTop = null;
      e.txtHang = null;
      e.txtPoint = null;
      e.txTotalBet = null;
      e.lbTimeCountDown = null;
      e.nodeTotalBet = null;
      e.nodeLoading = null;
      e.contend = null;
      e.contendScrollView = null;
      e.scrollView = null;
      e.itemPoint = null;
      e.itemPointTx = null;
      e.itemDuaTopPrefab = null;
      e.itemLsDuaTopPrefab = null;
      e.arrowNextDayLsDuaTop = null;
      e.arrowPreDayLsDuaTop = null;
      e.txtTittle = null;
      e.lbDateShowLSTop = null;
      e.nodeFullTop = null;
      e.tabDuatop = null;
      e.tabSLDuatop = null;
      e.listSpriteFrameTab = [];
      e.nodeSelectDateTime = null;
      e.lbTimeRequest = null;
      e.buttonRequestNextDay = null;
      e.buttonRequestPrevDay = null;
      e.scrollContentViewTop = -26;
      e.scrollContentViewBottom = -390;
      e.extraScrollContentView = 50;
      e.nodeBoardInfo = null;
      e.nodeTongThangOn = null;
      e.nodeSanHuOn = null;
      e.nodeTuanOn = null;
      e.nodeNgayOn = null;
      e.nodeBoardLeft = null;
      e.txtEmpty = null;
      e.dataDuatop = null;
      e.dataLsDuatop = null;
      e.listCachePoint = [];
      e.timeViewHistory = "";
      e.timeViewHistoryNext = "";
      e.timeViewHistoryPrev = "";
      e.callBackClose = null;
      e.txChatColor = [new cc.Color(235, 0, 0, 255), new cc.Color(235, 235, 0, 255), new cc.Color(0, 235, 0, 255), new cc.Color(0, 150, 255,
        255), new cc.Color(0, 150, 255, 255), new cc.Color(0, 150, 255, 255), new cc.Color(0, 150, 255, 255), new cc.Color(0, 150, 255,
        255), new cc.Color(0, 150, 255, 255), new cc.Color(0, 150, 255, 255), new cc.Color(0, 150, 255, 255), new cc.Color(0, 150, 255,
        255), new cc.Color(0, 150, 255, 255), new cc.Color(133, 0, 255, 255)];
      return e;
    }
    n(e, t);
    e.prototype.onLoad = function() {
      t.prototype.onLoad.call(this);
      this.scrollContentViewCache = this.contendScrollView.position.y;
      this.listCachePoint = [];
      if (0 === l.default.getInstance().tabLeftRankingDefault) {
        this.nodeTongThangOn.active = true;
        this.nodeSanHuOn.active = false;
      } else {
        this.nodeTongThangOn.active = false;
        this.nodeSanHuOn.active = true;
      }
      if (0 === l.default.getInstance().tabRightRankingDefault) {
        this.nodeTuanOn.active = true;
        this.nodeNgayOn.active = false;
      } else {
        this.nodeTuanOn.active = false;
        this.nodeNgayOn.active = true;
      }
    };
    e.prototype.show = function(e, i) {
      if (void 0 === e) {
        e = null;
      }
      if (void 0 === i) {
        i = .4;
      }
      y.setFpsNormal();
      t.prototype.show.call(this, e, i);
      this.node.runAction(cc.sequence(cc.delayTime(.1), cc.callFunc(function() {
        this.setTab(this.gameId);
      }.bind(this))));
    };
    e.prototype.init = function(t) {
      this.SetGameID(t);
      this.txtTittle.string = "\u0110ANG T\u1ea2I...";
    };
    e.prototype.SetOrientation = function(t) {
      if (t == _.Orientation.Portrait) {
        this.scrollContentViewBottom = -1 * this.scrollView.node.getContentSize().height;
      }
    };
    e.prototype.SetGameID = function(t) {
      if (t == u.GAME.XITO) {
        this.gameId = u.GAMEID.XITO;
      } else {
        if (t == u.GAME.BINH) {
          this.gameId = u.GAMEID.BINH;
        } else {
          if (t == u.GAME.TIENLEN) {
            this.gameId = u.GAMEID.TIENLEN;
          } else {
            if (t == u.GAME.POKER) {
              this.gameId = u.GAMEID.POKER;
            } else {
              if (t == u.GAME.LIENG) {
                this.gameId = u.GAMEID.LIENG;
              } else {
                if (t == u.GAME.SAM) {
                  this.gameId = u.GAMEID.SAM;
                } else {
                  if (t == u.GAME.XOCDIA) {
                    this.gameId = u.GAMEID.XOCDIA;
                  } else {
                    if (t == u.GAME.PHOM) {
                      this.gameId = u.GAMEID.PHOM;
                    } else {
                      if (t == u.GAME.TLMN) {
                        this.gameId = u.GAMEID.TLMN;
                      } else {
                        if (t == u.GAME.MINI_POKER) {
                          this.gameId = u.GAMEID.MINI_POKER;
                        } else {
                          if (t == u.GAME.KIM_CUONG) {
                            this.gameId = u.GAMEID.KIM_CUONG;
                          } else {
                            if (t == u.GAME.TAIXIU) {
                              this.gameId = u.GAMEID.TAIXIU;
                            } else {
                              if (t == u.GAME.TAIXIU_MD5) {
                                this.gameId = u.GAMEID.TAIXIU_MD5;
                              } else {
                                if (t == u.GAME.UP_DOWN) {
                                  this.gameId = u.GAMEID.UP_DOWN;
                                } else {
                                  if (t == u.GAME.THAN_TAI) {
                                    this.gameId = u.GAMEID.THAN_TAI;
                                  } else {
                                    if (t == u.GAME.BAU_CUA) {
                                      this.gameId = u.GAMEID.BAU_CUA;
                                    } else {
                                      if (t == u.GAME.SICBO) {
                                        this.gameId = u.GAMEID.SICBO;
                                      } else {
                                        if (t == u.GAME.FOOT_BALL) {
                                          this.gameId = u.GAMEID.FOOT_BALL;
                                        } else {
                                          if (t == u.GAME.BACAY) {
                                            this.gameId = u.GAMEID.BACAY;
                                          } else {
                                            if (t == u.GAME.CATTE) {
                                              this.gameId = u.GAMEID.CATTE;
                                            } else {
                                              if (t == u.GAME.TAIXIU_LIVESTREAM) {
                                                this.gameId = u.GAMEID.TAIXIU_LIVESTREAM;
                                              } else {
                                                if (t == u.GAME.AVIATOR) {
                                                  this.gameId = u.GAMEID.AVIATOR;
                                                } else {
                                                  if (t == u.GAME.TAIXIU_LIVESTREAM) {
                                                    this.gameId = u.GAMEID.TAIXIU_LIVESTREAM;
                                                  } else {
                                                    if (t == u.GAME.DAO_VANG) {
                                                      this.gameId = u.GAMEID.DAO_VANG;
                                                    } else {
                                                      if (t == u.GAME.XDLIVE_V2) {
                                                        this.gameId = u.GAMEID.XDLIVE_V2;
                                                      } else {
                                                        if (t == u.GAME.TXSTLIVE) {
                                                          this.gameId = u.GAMEID.TXSTLIVE;
                                                        } else {
                                                          if (t == u.GAME.PLINKO) {
                                                            this.gameId = u.GAMEID.PLINKO;
                                                          } else {
                                                            if (t == u.GAME.SICBOLIVE) {
                                                              this.gameId = u.GAMEID.SICBO_LIVE;
                                                            } else {
                                                              if (t == u.GAME.BACCARAT_LIVE || t == v.BaccaratLiveVariant.gameIDNumber) {
                                                                this.gameId = v.BaccaratLiveVariant.gameID;
                                                              } else {
                                                                if (t == u.GAME.DRAGONTIGER_LIVE) {
                                                                  this.gameId = u.GAMEID.DRAGONTIGER_LIVE;
                                                                } else {
                                                                  if (t == u.GAME.BAUCUA_LIVE) {
                                                                    this.gameId = u.GAMEID.BAUCUA_LIVE;
                                                                  } else {
                                                                    if (t == u.GAME.BAUCUA_BONUS) {
                                                                      this.gameId = u.GAMEID.BAUCUA_BONUS;
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
    e.prototype.SetTitleBXH = function(t) {
      this.txtTittle.string = "X\u1ebeP H\u1ea0NG";
    };
    e.prototype.SetTitleDuaTop = function(t) {
      switch (t) {
        case u.GAMEID.XITO:
          this.txtTittle.string = "CAO TH\u1ee6 X\xcc T\u1ed0";
          break;
        case u.GAMEID.BINH:
          this.txtTittle.string = "CAO TH\u1ee6 M\u1eacU BINH";
          break;
        case u.GAMEID.TIENLEN:
          this.txtTittle.string = "CAO TH\u1ee6 TL \u0110\u1ebeM L\xc1";
          break;
        case u.GAMEID.POKER:
          this.txtTittle.string = "CAO TH\u1ee6 POKER";
          break;
        case u.GAMEID.LIENG:
          this.txtTittle.string = "CAO TH\u1ee6 LI\xcaNG";
          break;
        case u.GAMEID.SAM:
          this.txtTittle.string = "CAO TH\u1ee6 S\xc2M L\u1ed0C";
          break;
        case u.GAMEID.XOCDIA:
          this.txtTittle.string = "CAO TH\u1ee6 X\xd3C \u0110\u0128A";
          break;
        case u.GAMEID.PHOM:
          this.txtTittle.string = "CAO TH\u1ee6 PH\u1eceM";
          break;
        case u.GAMEID.TLMN:
          this.txtTittle.string = "CAO TH\u1ee6 TL MI\u1ec0N NAM";
          break;
        case u.GAMEID.MINI_POKER:
          this.txtTittle.string = "CAO TH\u1ee6 MINI POKER";
          break;
        case u.GAMEID.KIM_CUONG:
          this.txtTittle.string = "CAO TH\u1ee6 KIM C\u01af\u01a0NG";
          break;
        case u.GAMEID.TAIXIU:
          this.txtTittle.string = "CAO TH\u1ee6 T\xc0I X\u1ec8U";
          break;
        case u.GAMEID.TAIXIU_MD5:
          this.txtTittle.string = "CAO TH\u1ee6 T\xc0I X\u1ec8U MD5";
          break;
        case u.GAMEID.UP_DOWN:
          this.txtTittle.string = "CAO TH\u1ee6 TR\xcaN D\u01af\u1edaI";
          break;
        case u.GAMEID.THAN_TAI:
          this.txtTittle.string = "CAO TH\u1ee6 TH\u1ea6N T\xc0I";
          break;
        case u.GAMEID.BAU_CUA:
          this.txtTittle.string = "CAO TH\u1ee6 B\u1ea6U CUA";
          break;
        case u.GAMEID.SICBO:
          this.txtTittle.string = "CAO TH\u1ee6 SICBO";
          break;
        case u.GAMEID.FOOT_BALL:
          this.txtTittle.string = "CAO TH\u1ee6 B\xd3NG \u0110\xc1";
          break;
        case u.GAMEID.BACAY:
          this.txtTittle.string = "CAO TH\u1ee6 C\xc0O R\xd9A";
          break;
        case u.GAMEID.CATTE:
          this.txtTittle.string = "CAO TH\u1ee6 CATTE";
          break;
        case u.GAMEID.TAIXIU_LIVESTREAM:
          this.txtTittle.string = "CAO TH\u1ee6 T\xc0I X\u1ec8U LIVESTREAM";
          break;
        case u.GAMEID.AVIATOR:
          this.txtTittle.string = "CAO TH\u1ee6 AVIATOR";
          break;
        case u.GAMEID.TXSTLIVE:
          this.txtTittle.string = "CAO TH\u1ee6 T\xc0I X\u1ec8U LIVESTREAM";
          break;
        case u.GAMEID.SICBO_LIVE:
          this.txtTittle.string = "CAO TH\u1ee6 SICBO LIVESTREAM";
          break;
        case u.GAMEID.DRAGONTIGER_LIVE:
          this.txtTittle.string = "CAO TH\u1ee6 R\u1ed2NG H\u1ed4 LIVESTREAM";
          break;
        case u.GAMEID.BAUCUA_BONUS:
          this.txtTittle.string = "CAO TH\u1ee6 B\u1ea6U CUA BONUS";
      }
    };
    e.prototype.isEnableChooseDate = function(t) {
      return 0 == t.localeCompare(u.GAMEID.AVIATOR) || 0 == t.localeCompare(u.GAMEID.DAO_VANG) || 0 == t.localeCompare(u.GAMEID.PLINKO);
    };
    e.prototype.isEnableChooseType = function(t) {
      return !(0 != t.localeCompare(u.GAMEID.TAIXIU) && 0 != t.localeCompare(u.GAMEID.TAIXIU_MD5) && 0 != t.localeCompare(u.GAMEID
          .TAIXIU_LIVESTREAM) && 0 != t.localeCompare(u.GAMEID.XOCDIA) && 0 != t.localeCompare(u.GAMEID.BAU_CUA) && 0 != t
        .localeCompare(u.GAMEID.XDLIVE_V2) && 0 != t.localeCompare(u.GAMEID.SICBO_LIVE) && !v.BaccaratLiveVariant.isBaccaratLiveID(t) &&
        0 != t.localeCompare(u.GAMEID.DRAGONTIGER_LIVE) && 0 != t.localeCompare(u.GAMEID.BAUCUA_LIVE) && 0 != t.localeCompare(u.GAMEID
          .BAUCUA_BONUS));
    };
    e.prototype.onLoadErr = function(t) {
      r.default.getInstance().hideLoading();
      r.default.getInstance().showPopupMessageUtil(t);
    };
    e.prototype.onClickClose = function() {
      this.contendScrollView.active = false;
      this.hide(this.callBackClose);
    };
    e.prototype.setTab = function(t, e) {
      if (void 0 === e) {
        e = "";
      }
      this.contendScrollView.scale = 0;
      r.default.getInstance().showLoading();
      if (l.default.getInstance().isLoginWebcc) {
        this.requestRankingForWebCC(t);
      } else {
        this.requestRanking(t, e);
      }
    };
    e.prototype.requestRankingForWebCC = function(t) {
      var e = this,
        i = l.default.getInstance().getTopUpDownURL + "?type=turnover&from=0&size=20&gid=" + t;
      c.default.getInstance().sendGetHttpRequest(i, function(t) {
        e.nodeLoading.active = false;
        var i = e.gameId == u.GAMEID.TAIXIU && l.default.getInstance().isLoginWebcc;
        if (null == t.event || void 0 == t.event || i) {
          e.nodePopupXepHangGame.active = true;
          e.nodePopupDuaTop.active = false;
          e.nodePopupLsDuaTop.active = false;
          e.nodeFullTop.active = false;
          e.txtTittle.node.active = true;
          e.SetTitleBXH(e.gameId);
          e.showRank(t);
        } else {
          e.startCoundDownTimeDuaTop();
          e.listConditionReward = t.event.content;
          e.nodePopupXepHangGame.active = false;
          e.nodePopupDuaTop.active = true;
          e.nodeFullTop.active = true;
          e.txtTittle.node.active = false;
          e.SetTitleDuaTop(e.gameId);
          e.dataDuatop = t;
          e.showDuaTop(t);
        }
      }, function(t) {
        e.txtTittle.string = "";
        e.onLoadErr(t);
      });
    };
    e.prototype.requestRanking = function(t, e) {
      var i,
        n = this;
      i = {};
      var o = JSON.stringify(i),
        a = "";
      if (this.isEnableChooseDate(t) && (a = "&date=" + (0 == e.length ? this.getFormattedDate(new Date()) : e)), this.isEnableChooseType(
          t)) {
        var s = l.default.getInstance().urlRanking,
          h = "";
        if (this.nodeTongThangOn.active) {
          s += "top/";
          h = "/win";
        } else {
          s += "top-jp/";
        }
        s += t + (this.nodeNgayOn.active ? "/daily" : "/weekly") + h;
        var d = this;
        c.default.getInstance().sendGetHttpRequest(s, function(t) {
          switch (n.nodeLoading.active = false, n.nodeBoardInfo.active = true, n.nodeBoardLeft.active = true, n.gameId) {
            case u.GAMEID.SICBO_LIVE:
            case u.GAMEID.TAIXIU_MD5:
            case u.GAMEID.DRAGONTIGER_LIVE:
            case u.GAMEID.BAUCUA_LIVE:
            case u.GAMEID.BAUCUA_BONUS:
              n.nodeBoardLeft.active = false;
          }
          if (v.BaccaratLiveVariant.isBaccaratLiveID(n.gameId)) {
            n.nodeBoardLeft.active = false;
          }
          n.nodePopupXepHangGame.active = true;
          n.nodePopupDuaTop.active = false;
          n.nodePopupLsDuaTop.active = false;
          n.nodeFullTop.active = false;
          n.txtTittle.node.active = true;
          n.SetTitleBXH(n.gameId);
          n.showRank(t);
          r.default.getInstance().hideLoading();
        }, function(t) {
          if (d.node) {
            d.txtTittle.string = "";
            d.onLoadErr(t);
          }
          r.default.getInstance().hideLoading();
        }, true);
      } else {
        s = l.default.getInstance().duatopTxURL + "?type=turnover&from=0&size=20&gid=" + t + a;
        var p = this;
        c.default.getInstance().sendPostHttpRequest(s, o, function(t) {
          n.nodeLoading.active = false;
          var e = n.gameId == u.GAMEID.TAIXIU && l.default.getInstance().isLoginWebcc;
          if (null == t.event || void 0 == t.event || e) {
            n.nodeBoardInfo.active = false;
            n.nodePopupXepHangGame.active = true;
            n.nodePopupDuaTop.active = false;
            n.nodePopupLsDuaTop.active = false;
            n.nodeFullTop.active = false;
            n.txtTittle.node.active = true;
            n.SetTitleBXH(n.gameId);
            n.showRank(t);
          } else {
            n.startCoundDownTimeDuaTop();
            n.listConditionReward = t.event.content;
            n.nodeBoardInfo.active = false;
            n.nodePopupXepHangGame.active = false;
            n.nodePopupDuaTop.active = true;
            n.nodeFullTop.active = true;
            n.txtTittle.node.active = false;
            n.SetTitleDuaTop(n.gameId);
            n.dataDuatop = t;
            n.showDuaTop(t);
          }
          r.default.getInstance().hideLoading();
        }, function(t) {
          if (p.node) {
            p.txtTittle.string = "";
            p.onLoadErr(t);
          }
          r.default.getInstance().hideLoading();
        });
      }
    };
    e.prototype.requestLsDuaTop = function(t, e) {
      var i,
        n = this,
        o = l.default.getInstance().lsDuatopTxURL + "?event_type=top_reward&gid=" + t + "&date=" + e;
      i = {};
      this.contendScrollView.scale = 0;
      r.default.getInstance().showLoading();
      var a = JSON.stringify(i);
      c.default.getInstance().sendPostHttpRequest(o, a, function(t) {
        n.dataLsDuatop = t;
        n.showLsDuaTop(t);
      }, function(t) {
        n.txtTittle.string = "";
        n.onLoadErr(t);
      });
    };
    e.prototype.checkPassTotalBet = function(t, e) {
      var i = Object.keys(this.listConditionReward).length,
        n = 0;
      if (e <= i && e > 0 && t > this.listConditionReward[e.toString()].cond.turnover) {
        n = this.listConditionReward[e.toString()].gift.money;
      } else {
        if (t > this.listConditionReward[(i - 1).toString()].cond.turnover && e > i) {
          n = this.listConditionReward[(i - 1).toString()].gift.money;
        }
      }
      return n;
    };
    e.prototype.getRewardByRank = function(t) {
      return t <= Object.keys(this.listConditionReward).length && t > 0 ? this.listConditionReward[t.toString()].gift.money : 0;
    };
    e.prototype.onShowLsDuaTopClick = function() {
      s.default.getInstance().playbtnClick();
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
      S.default.getInstance().logEvent("ClickButtonTaiXiu", JSON.parse('{"ButtonName":"TabLichSuDuaTopTX"}'));
    };
    e.prototype.onShowDuaTopClick = function() {
      s.default.getInstance().playbtnClick();
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
      S.default.getInstance().logEvent("ClickButtonTaiXiu", JSON.parse('{"ButtonName":"TabDuaTopTX"}'));
    };
    e.prototype.getFormattedDate = function(t) {
      var e = t.getFullYear(),
        i = (1 + t.getMonth()).toString();
      i = i.length > 1 ? i : "0" + i;
      var n = t.getDate().toString();
      return (n = n.length > 1 ? n : "0" + n) + "/" + i + "/" + e;
    };
    e.prototype.getTotalBetMaxCanGet = function(t) {
      for (var e = 0, i = Object.keys(this.listConditionReward).length; i > 0; i--) {
        if (t < (e = this.listConditionReward[i.toString()].cond.turnover)) {
          return e;
        }
      }
      return this.listConditionReward[1].cond.turnover;
    };
    e.prototype.getTotalBetTargetMin = function() {
      for (var t = 0, e = Object.keys(this.listConditionReward).length; e > 0; e--) {
        if ((t = this.listConditionReward[e.toString()].cond.turnover) > 0) {
          return t;
        }
      }
      return this.listConditionReward[1].cond.turnover;
    };
    e.prototype.getTotalBetByRank = function(t) {
      var e = this.listConditionReward[t.toString()];
      if (null == e || void 0 == e) {
        return 1e10;
      }
      var i = e.cond.turnover;
      if (null == i || void 0 == i || Number.isNaN(i)) {
        i = 1e10;
      }
      return i;
    };
    e.prototype.startCoundDownTimeDuaTop = function() {
      this.updateTimeDuaTop();
      this.lbTimeCountDown.schedule(this.updateTimeDuaTop.bind(this), 1, cc.macro.REPEAT_FOREVER, 0);
    };
    e.prototype.updateTimeDuaTop = function() {
      var t = new Date();
      t.setHours(23, 59, 59);
      var e = Math.floor(t.getTime() / 1e3),
        i = Math.floor(new Date().getTime() / 1e3),
        n = (e - i) / 60;
      this.lbTimeCountDown.string = this.zeroPad(Math.floor(n / 60), 2) + ":" + this.zeroPad(Math.floor(n % 60), 2) + ":" + this.zeroPad((
        e - i) % 60, 2);
    };
    e.prototype.zeroPad = function(t, e) {
      var i = e - t.toString().length + 1;
      return Array(+(i > 0 && i)).join("0") + t;
    };
    e.prototype.showDuaTop = function(t, e) {
      if (void 0 === e) {
        e = false;
      }
      var i = t.event.user.turnover;
      this.txTotalBet.string = d.default.formatMoneyNumberWithVietnameseUnit(i);
      var n = this.getTotalBetTargetMin();
      if (n > 0) {
        var o = d.default.formatMoneyNumberWithVietnameseUnit(n);
        cc.sys.localStorage.setItem("TargetTurnOverDuaTop", o);
      }
      if (this.nodeTotalBet.active = true, null !== t.data && void 0 !== t.data && t.data.length > 0) {
        for (var a = 0; a < t.data.length; a++) {
          var s, c;
          if (this.gameId === u.GAMEID.TAIXIU) {
            c = (s = cc.instantiate(this.itemDuaTopPrefab)).getComponent(p.default);
            if (a < 10 && a < this.txChatColor.length) {
              c.txtTenHienThi.node.color = this.txChatColor[a];
            } else {
              c.txtTenHienThi.node.color = this.txChatColor[this.txChatColor.length - 1];
            }
          } else {
            c = (s = cc.instantiate(this.itemPoint)).getComponent(p.default);
          }
          s.parent = this.contendScrollView;
          this.listCachePoint.push(c);
          var l,
            h = 0;
          h = this.checkPassTotalBet(t.data[a].game_stake, a + 1);
          l = this.getTotalBetByRank(a + 1);
          var f = false,
            g = false;
          if (h > 0) {
            f = true;
            g = true;
          }
          h = this.getRewardByRank(a + 1);
          var m = t.data[a].game_winlost;
          if (m < 0) {
            m = 0;
          }
          c.loadUI(a + 1, t.data[a].fullname, m, t.data[a].user_id, t.data[a].username, l, h, g, f);
          if (e) {
            c.nodeContent.active = true;
          } else {
            if (a > 7) {
              c.nodeContent.active = false;
            }
          }
        }
        this.scrollView.scrollToTop();
        this.updateViewItem();
        r.default.getInstance().hideLoading();
        this.contendScrollView.scale = 1;
        this.contendScrollView.active = true;
      } else {
        r.default.getInstance().hideLoading();
      }
    };
    e.prototype.onShowLsDuaTopNextClick = function() {
      s.default.getInstance().playbtnClick();
      if (null != this.timeViewHistoryNext && "null" != this.timeViewHistoryNext) {
        this.requestLsDuaTop(this.gameId, this.timeViewHistoryNext);
      }
    };
    e.prototype.onShowLsDuaTopPrevClick = function() {
      s.default.getInstance().playbtnClick();
      if (null != this.timeViewHistoryPrev && "null" != this.timeViewHistoryPrev) {
        this.requestLsDuaTop(this.gameId, this.timeViewHistoryPrev);
      }
    };
    e.prototype.onShowRankNormalNextClick = function() {
      s.default.getInstance().playbtnClick();
      if (null != this.timeViewHistoryNext && "" != this.timeViewHistoryNext) {
        r.default.getInstance().showLoading();
        this.requestRanking(this.gameId, this.timeViewHistoryNext);
      }
    };
    e.prototype.onShowRankNormalPrevClick = function() {
      s.default.getInstance().playbtnClick();
      if (null != this.timeViewHistoryPrev && "" != this.timeViewHistoryPrev) {
        r.default.getInstance().showLoading();
        this.requestRanking(this.gameId, this.timeViewHistoryPrev);
      }
    };
    e.prototype.onClickShowHelpDuaTop = function() {
      s.default.getInstance().playbtnClick();
      r.default.getInstance().showLoading();
      cc.loader.loadRes("Help/PopupHelpDuaTopTaiXiu", function(t, e) {
        if (r.default.getInstance().hideLoading(), null === e) {
          r.default.getInstance().showPopupMessageUtil("L\u1ed7i 404, Xin Th\u1eed l\u1ea1i!");
        } else {
          var i = cc.instantiate(e);
          i.parent = this.node;
          i.x = 0;
          i.y = 0;
          i.zIndex = g.default.TOP;
          i.getComponent(m.default).show();
        }
      }.bind(this));
      S.default.getInstance().logEvent("ClickButtonTaiXiu", JSON.parse('{"ButtonName":"ShowHelpDuaTop"}'));
    };
    e.prototype.showLsDuaTop = function(t, e) {
      if (void 0 === e && (e = false), null !== t.data && void 0 !== t.data && t.data.length > 0) {
        this.contendScrollView.removeAllChildren(true);
        this.lbDateShowLSTop.string = t.date;
        this.timeViewHistory = t.date;
        this.timeViewHistoryNext = t.next;
        this.timeViewHistoryPrev = t.prev;
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
        for (var i = 0; i < t.data.length; i++) {
          var n,
            o,
            a = t.data[i].rank;
          o = this.gameId === u.GAMEID.TAIXIU ? (n = cc.instantiate(this.itemLsDuaTopPrefab)).getComponent(f.default) : (n = cc
            .instantiate(this.itemPoint)).getComponent(f.default);
          n.parent = this.contendScrollView;
          this.listCachePoint.push(o);
          if (a < 10 && a < this.txChatColor.length) {
            o.txtTenHienThi.node.color = this.txChatColor[a - 1];
          } else {
            o.txtTenHienThi.node.color = this.txChatColor[this.txChatColor.length - 1];
          }
          o.loadUI(a, i, t.data[i].fullname, t.data[i].uid, t.data[i].fullname, t.data[i].gift_money, t.data[i].winlost);
          if (e) {
            o.nodeContent.active = true;
          } else {
            if (i > 7) {
              o.nodeContent.active = false;
            }
          }
        }
        this.scrollView.scrollToTop();
        this.updateViewItem();
        r.default.getInstance().hideLoading();
        this.contendScrollView.scale = 1;
        this.contendScrollView.active = true;
      } else {
        r.default.getInstance().hideLoading();
      }
    };
    e.prototype.showRank = function(t) {
      if (null !== t.data && void 0 !== t.data && t.data.length > 0) {
        if (t.hasOwnProperty("date") && t.hasOwnProperty("next") && t.hasOwnProperty("prev")) {
          if (null != this.nodeSelectDateTime && null != t.date) {
            this.nodeSelectDateTime.active = true;
            this.timeViewHistory = t.date;
            this.lbTimeRequest.string = this.timeViewHistory;
          }
          if (null == t.next) {
            this.buttonRequestNextDay.interactable = false;
          } else {
            this.timeViewHistoryNext = t.next;
            this.buttonRequestNextDay.interactable = true;
          }
          if (null == t.prev) {
            this.buttonRequestPrevDay.interactable = false;
          } else {
            this.timeViewHistoryPrev = t.prev;
            this.buttonRequestPrevDay.interactable = true;
          }
        }
        for (var e = 0; e < this.listCachePoint.length; e++) {
          this.listCachePoint[e].node.active = false;
        }
        for (var i = 0; i < t.data.length; i++) {
          var n,
            o,
            a = t.data[i];
          if (a.total) {
            a.game_winlost = a.total;
          }
          if (!(void 0 === a.game_winlost || a.game_winlost < 0)) {
            if (0 == this.listCachePoint.length || i >= this.listCachePoint.length) {
              o = (n = this.gameId === u.GAMEID.TAIXIU || this.gameId === u.GAMEID.AVIATOR || this.gameId == u.GAMEID.TAIXIU_MD5 || this
                .gameId === u.GAMEID.TAIXIU_LIVESTREAM || this.gameId === u.GAMEID.XOCDIA || this.gameId === u.GAMEID.BAU_CUA || this
                .gameId === u.GAMEID.DAO_VANG ? cc.instantiate(this.itemPointTx) : cc.instantiate(this.itemPoint)).getComponent(h
                .default);
              n.parent = this.contendScrollView;
              this.listCachePoint.push(o);
            } else {
              o = this.listCachePoint[i];
            }
            if (!(this.gameId != u.GAMEID.TAIXIU_MD5 && this.gameId !== u.GAMEID.TAIXIU && this.gameId !== u.GAMEID.AVIATOR && this
                .gameId !== u.GAMEID.TAIXIU_LIVESTREAM && this.gameId !== u.GAMEID.XOCDIA && this.gameId !== u.GAMEID.BAU_CUA && this
                .gameId !== u.GAMEID.DAO_VANG)) {
              if (i < 10 && i < this.txChatColor.length) {
                o.txtTenHienThi.node.color = this.txChatColor[i];
              } else {
                o.txtTenHienThi.node.color = this.txChatColor[this.txChatColor.length - 1];
              }
            }
            o.node.active = true;
            o.loadUI(i + 1, t.data[i].fullname, t.data[i].game_winlost, t.data[i].uid, t.data[i].username);
            o.nodeContent.active = !(i > 7);
          }
        }
        this.scrollView.scrollToTop();
        this.updateViewItem();
        r.default.getInstance().hideLoading();
        this.contendScrollView.scale = 1;
        this.contendScrollView.active = true;
        this.txtEmpty.node.active = false;
      } else {
        if (null != this.buttonRequestPrevDay) {
          this.buttonRequestPrevDay.interactable = false;
        }
        r.default.getInstance().hideLoading();
        for (e = 0; e < this.listCachePoint.length; e++) {
          this.listCachePoint[e].node.active = false;
        }
        this.nodePopupXepHangGame.active = false;
        this.txtEmpty.node.active = true;
        this.txtEmpty.string = this.nodeTongThangOn.active ? "Ch\u01b0a c\xf3 l\u1ecbch s\u1eed th\u1eafng" :
          "Ch\u01b0a c\xf3 l\u1ecbch s\u1eed n\u1ed5 h\u0169";
        this.timeViewHistory = t.date;
        this.lbTimeRequest.string = t.date;
        this.timeViewHistoryNext = t.next;
        if (null !== t.next) {
          this.buttonRequestNextDay.node.active = true;
          this.buttonRequestNextDay.interactable = true;
        }
      }
    };
    e.prototype.callbackTopPoint = function(t, e) {
      if (e == cc.ScrollView.EventType.SCROLLING) {
        this.updateViewItem();
      }
    };
    e.prototype.updateViewItem = function() {
      if (!(this.contendScrollView.position.y < this.scrollContentViewCache)) {
        for (var t = 0; t < this.listCachePoint.length; t++) {
          if (this.listCachePoint[t].node.position.y + this.contendScrollView.position.y <= this.scrollContentViewTop + this
            .extraScrollContentView + this.scrollContentViewCache && this.listCachePoint[t].node.position.y + this.contendScrollView
            .position.y >= this.scrollContentViewBottom - this.extraScrollContentView + this.scrollContentViewCache) {
            this.listCachePoint[t].nodeContent.active = true;
          } else {
            this.listCachePoint[t].nodeContent.active = false;
          }
        }
        if (y.isFpsLow()) {
          y.setFpsNormal();
        }
      }
    };
    e.prototype.getColorOfNameTxMD5 = function(t) {
      return t < 10 && t < this.txChatColor.length ? this.txChatColor[t] : this.txChatColor[10];
    };
    e.prototype.onClickTongThang = function() {
      s.default.getInstance().playbtnClick();
      this.nodeTongThangOn.active = true;
      this.nodeSanHuOn.active = false;
      r.default.getInstance().showLoading();
      this.requestRanking(this.gameId, "");
    };
    e.prototype.onClickSanHu = function() {
      s.default.getInstance().playbtnClick();
      this.nodeTongThangOn.active = false;
      this.nodeSanHuOn.active = true;
      r.default.getInstance().showLoading();
      this.requestRanking(this.gameId, "");
    };
    e.prototype.onClickTuan = function() {
      s.default.getInstance().playbtnClick();
      this.nodeTuanOn.active = true;
      this.nodeNgayOn.active = false;
      r.default.getInstance().showLoading();
      this.requestRanking(this.gameId, "");
    };
    e.prototype.onClickNgay = function() {
      s.default.getInstance().playbtnClick();
      this.nodeTuanOn.active = false;
      this.nodeNgayOn.active = true;
      r.default.getInstance().showLoading();
      this.requestRanking(this.gameId, "");
    };
    o([T(cc.Node)], e.prototype, "nodePopupXepHangGame", void 0);
    o([T(cc.Node)], e.prototype, "nodePopupDuaTop", void 0);
    o([T(cc.Node)], e.prototype, "nodePopupLsDuaTop", void 0);
    o([T(cc.Label)], e.prototype, "txtHang", void 0);
    o([T(cc.Label)], e.prototype, "txtPoint", void 0);
    o([T(cc.Label)], e.prototype, "txTotalBet", void 0);
    o([T(cc.Label)], e.prototype, "lbTimeCountDown", void 0);
    o([T(cc.Node)], e.prototype, "nodeTotalBet", void 0);
    o([T(cc.Node)], e.prototype, "nodeLoading", void 0);
    o([T(cc.Node)], e.prototype, "contend", void 0);
    o([T(cc.Node)], e.prototype, "contendScrollView", void 0);
    o([T(cc.ScrollView)], e.prototype, "scrollView", void 0);
    o([T(cc.Prefab)], e.prototype, "itemPoint", void 0);
    o([T(cc.Prefab)], e.prototype, "itemPointTx", void 0);
    o([T(cc.Prefab)], e.prototype, "itemDuaTopPrefab", void 0);
    o([T(cc.Prefab)], e.prototype, "itemLsDuaTopPrefab", void 0);
    o([T(cc.Node)], e.prototype, "arrowNextDayLsDuaTop", void 0);
    o([T(cc.Node)], e.prototype, "arrowPreDayLsDuaTop", void 0);
    o([T(cc.Label)], e.prototype, "txtTittle", void 0);
    o([T(cc.Label)], e.prototype, "lbDateShowLSTop", void 0);
    o([T(cc.Node)], e.prototype, "nodeFullTop", void 0);
    o([T(cc.Sprite)], e.prototype, "tabDuatop", void 0);
    o([T(cc.Sprite)], e.prototype, "tabSLDuatop", void 0);
    o([T(cc.SpriteFrame)], e.prototype, "listSpriteFrameTab", void 0);
    o([T(cc.Node)], e.prototype, "nodeSelectDateTime", void 0);
    o([T(cc.Label)], e.prototype, "lbTimeRequest", void 0);
    o([T(cc.Button)], e.prototype, "buttonRequestNextDay", void 0);
    o([T(cc.Button)], e.prototype, "buttonRequestPrevDay", void 0);
    o([T], e.prototype, "scrollContentViewTop", void 0);
    o([T], e.prototype, "scrollContentViewBottom", void 0);
    o([T], e.prototype, "extraScrollContentView", void 0);
    o([T(cc.Node)], e.prototype, "nodeBoardInfo", void 0);
    o([T(cc.Node)], e.prototype, "nodeTongThangOn", void 0);
    o([T(cc.Node)], e.prototype, "nodeSanHuOn", void 0);
    o([T(cc.Node)], e.prototype, "nodeTuanOn", void 0);
    o([T(cc.Node)], e.prototype, "nodeNgayOn", void 0);
    o([T(cc.Node)], e.prototype, "nodeBoardLeft", void 0);
    o([T(cc.Label)], e.prototype, "txtEmpty", void 0);
    return e = o([C], e);
  }(a.default);
i.default = E;
void 0;
