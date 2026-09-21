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
// ── BẢNG TRA BÍ DANH (máy sinh — ghi-bang-tra-bi-danh.js) ──────
// Mã dịch ngược đặt bí danh một chữ cho mỗi module. Bảng này để khỏi phải cuộn ngược.
// KHÔNG đổi tên chúng bằng tìm-kiếm-thay-thế: đoạn mở đầu __decorate khai lại đúng
// những chữ này làm biến cục bộ, đổi là hỏng im lặng.
//   a = CardPopupBase   s = MusicPlayer
// ────────────────────────────────────────────────────────────────
var a = require("./CardPopupBase"),
  s = require("./MusicPlayer"),
  r = cc._decorator,
  c = r.ccclass,
  l = r.property,
  h = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.listNodeImage = [];
      e.nodeIntro = null;
      e.listLbPageCurrent = [];
      e.spriteButtonPre = [];
      e.spriteButtonNex = [];
      e.spriteFrameArrowEnable = null;
      e.spriteFrameArrowDisable = null;
      e.currentImage = 0;
      e.callbackClose = null;
      e.isActiveClose = false;
      return e;
    }
    n(e, t);
    e.prototype.start = function() {
      var t = this;
      this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function() {
        t.isActiveClose = true;
      })));
    };
    e.prototype.onCloseClicked = function() {
      if (this.isActiveClose) {
        this.hide(this.callbackClose);
      }
    };
    e.prototype.onClickBg = function() {};
    e.prototype.onClickHideIntro = function() {
      this.hideIntro();
    };
    e.prototype.setCustomData = function(t) {
      var e = JSON.parse(t);
      if (e.hasOwnProperty("hideIntroTxMd5") && this.hideIntro(), e.hasOwnProperty("showTab")) {
        var i = Number(e.showTab);
        this.currentImage = i;
        this.setPage();
      }
    };
    e.prototype.hideIntro = function() {
      this.nodeIntro.active = false;
      this.listNodeImage[0].active = true;
    };
    e.prototype.onClickNext = function() {
      if (null != s.default.getInstance()) {
        s.default.getInstance().playbtnClick();
      }
      if (!(this.popup.getNumberOfRunningActions() > 0)) {
        if (null !== this.listNodeImage && void 0 !== this.listNodeImage && this.listNodeImage.length > 1) {
          this.currentImage++;
          this.setPage();
        }
      }
    };
    e.prototype.onClickPre = function() {
      if (null != s.default.getInstance()) {
        s.default.getInstance().playbtnClick();
      }
      if (!(this.popup.getNumberOfRunningActions() > 0)) {
        if (null !== this.listNodeImage && void 0 !== this.listNodeImage && this.listNodeImage.length > 1) {
          this.currentImage--;
          this.setPage();
        }
      }
    };
    e.prototype.onClicComeTo0 = function() {
      if (null != s.default.getInstance()) {
        s.default.getInstance().playbtnClick();
      }
      if (!(this.popup.getNumberOfRunningActions() > 0)) {
        if (null !== this.listNodeImage && void 0 !== this.listNodeImage && this.listNodeImage.length > 1) {
          this.currentImage = 0;
          this.setPage();
        }
      }
    };
    e.prototype.setPageCurrent = function(t) {
      this.currentImage = t - 1;
      this.setPage();
    };
    e.prototype.setPage = function() {
      if (this.currentImage + 1 >= this.listNodeImage.length) {
        this.currentImage = this.listNodeImage.length - 1;
      }
      if (this.currentImage < 0) {
        this.currentImage = 0;
      }
      if (this.currentImage + 1 == 1) {
        this.setEnabledButtonPre(false);
        this.setEnabledButtonNext(true);
      } else {
        if (this.currentImage == this.listNodeImage.length - 1) {
          this.setEnabledButtonPre(true);
          this.setEnabledButtonNext(false);
        }
      }
      for (var t = 0; t < this.listLbPageCurrent.length; t++) {
        if (null != this.listLbPageCurrent[t]) {
          this.listLbPageCurrent[t].string = (this.currentImage + 1).toString();
        }
      }
      for (var e = 0; e < this.listNodeImage.length; ++e) {
        this.listNodeImage[e].active = this.currentImage === e;
        if (this.currentImage === e) {
          this.popup = this.listNodeImage[e];
        }
      }
    };
    e.prototype.setEnabledButtonNext = function(t) {
      for (var e = 0; e < this.spriteButtonNex.length; e++) {
        this.spriteButtonNex[e].spriteFrame = t ? this.spriteFrameArrowEnable : this.spriteFrameArrowDisable;
      }
    };
    e.prototype.setEnabledButtonPre = function(t) {
      for (var e = 0; e < this.spriteButtonPre.length; e++) {
        this.spriteButtonPre[e].spriteFrame = t ? this.spriteFrameArrowEnable : this.spriteFrameArrowDisable;
      }
    };
    e.prototype.openURL = function(t, e) {
      cc.sys.openURL(e);
    };
    e.prototype.onChangeTab1 = function() {
      if (null !== this.listNodeImage && void 0 !== this.listNodeImage && this.listNodeImage.length > 1) {
        this.listNodeImage[0].active = false;
        this.listNodeImage[1].active = true;
        this.popup = this.listNodeImage[1];
      }
    };
    e.prototype.onChangeTab2 = function() {
      if (null !== this.listNodeImage && void 0 !== this.listNodeImage && this.listNodeImage.length > 1) {
        this.listNodeImage[0].active = true;
        this.listNodeImage[1].active = false;
        this.popup = this.listNodeImage[0];
      }
    };
    o([l([cc.Node])], e.prototype, "listNodeImage", void 0);
    o([l(cc.Node)], e.prototype, "nodeIntro", void 0);
    o([l([cc.Label])], e.prototype, "listLbPageCurrent", void 0);
    o([l(cc.Sprite)], e.prototype, "spriteButtonPre", void 0);
    o([l(cc.Sprite)], e.prototype, "spriteButtonNex", void 0);
    o([l(cc.SpriteFrame)], e.prototype, "spriteFrameArrowEnable", void 0);
    o([l(cc.SpriteFrame)], e.prototype, "spriteFrameArrowDisable", void 0);
    return e = o([c], e);
  }(a.default);
i.default = h;
void 0;
