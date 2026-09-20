var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});

// ─────────────────────────────────────────────────────────────────────────────
//  LOP NEN cho moi popup be tu ban goc. Ban goc goi no la "PopupBase".
//
//  VI SAO KHONG CHEP THANG BAN GOC — hai ly do, ca hai deu la loi HONG IM LANG:
//
//  1. TRUNG TEN LOP. Roy88 da co `assets/lobby/scripts/base/PopupBase.js`. Hai lop cung
//     `__classname__` thi Cocos nem "A Class already exists with the same __classname__",
//     va PHAN CON LAI cua bundle khong dang ky duoc — mat ca cum, khong chi mot popup.
//     Cong cu `bao-dong.js` da canh bao dung cho nay ("TRUNG TEN Roy88: PopupBase").
//
//  2. BAN GOC KEO 7 PHU THUOC (CommonPrefabsManager, GamePlayManager, GameUtils, GameDefine,
//     GameConfigManager, MusicPlayer, WSLiveGameHandle) — trong do co nhung thu cham ha tang
//     ban goc that. Be het chi de chay mot popup la doi lay rui ro khong can thiet.
//
//  CAI GI PHAI GIU NGUYEN (da doi chieu tung dong voi PopupBase.js ban goc):
//
//   · BON @property, dung ten, dung thu tu khai o ban goc dong 232-235. 🔴 Prefab luu gia tri
//     theo TEN truong; khai thieu mot cai thi gia tri trong prefab bi bo qua AM THAM:
//        bgPopup       (cc.Node)      man nen mo phia sau popup
//        popup         (cc.Node)      khung popup — thieu la popup KHONG BAO GIO HIEN
//        moveDistance  (cc.Float)     day popup len khi ban phim ao che
//        arrayEditbox  ([cc.EditBox]) cac o nhap can day len
//
//   · `isShowDone` + `GameConfigManager.isShowPopupDone`. 🔴 DAY LA CHO DE MAT NHAT: ban goc
//     HA `isShowPopupDone = false` trong callback cua hide (PopupBase.js:169). Do la CHOT CHONG
//     BAM HAI LAN dung chung ca sanh: RoomController.onClickChoiNhanh / onClickTaoBan
//     (RoomController.js:202, 227) deu thoat som neu chot con dang bat. Quen ha chot thi mo roi
//     dong bang Cai dat mot lan la nut "Choi nhanh" va "Tao ban" CHET HAN toi khi tai lai trang,
//     ma khong co mot dong loi nao.
//
//   · `show()`  : opacity 50 -> fadeIn, scale .4 -> scaleTo(tyLe) easing easeBackOut.
//   · `hide()`  : fadeOut + scaleTo(0) easing easeBackIn, xong thi active = false roi goi cb.
//     Chu ky day du la hide(callback, thoiGian, coHuyNode, coPhatTieng) — PopupSetting.js:464
//     goi `this.hide()` khong tham so nen ca bon phai co mac dinh dung ban goc.
//
//  BO DI CO CHU Y (ghi ro de khoi ai tuong la sot):
//   · `arrayPopup` — ngan xep popup cua GamePlayManager, ta khong be, nen hide() tu huy node
//     (xem `isDestroyOnHide`) thay vi de ngan xep don.
//   · `setFpsLow/Normal` — chinh FPS theo man hinh, thuoc khung ban goc.
//   · `cc.systemEvent.emit(EventPopupGameShowHide, …)` — chi cac game Live nghe.
//   · Cum day popup theo ban phim ao (onKeyboardShow/Hide): giu @property de prefab bind duoc,
//     nhung khong lam hanh vi — khong popup nao trong bo game bai co o nhap.
// ─────────────────────────────────────────────────────────────────────────────

// Nap MUON GameConfigManager: no khong require nguoc lai tep nay, nhung giu cung mot kieu voi
// cac lop gia khac cho de doc, va tranh phu thuoc thu tu nap.
var napModule = t;
var _cfg = null;
function cauHinh() {
  if (null === _cfg) {
    try {
      _cfg = napModule("./GameConfigManager");
    } catch (loi) {
      return null;
    }
  }
  return _cfg && _cfg.default ? _cfg.default.getInstance() : null;
}

var _nhac = null;
function mayHat() {
  if (null === _nhac) {
    try {
      _nhac = napModule("./MusicPlayer");
    } catch (loi) {
      return null;
    }
  }
  return _nhac && _nhac.default ? _nhac.default.getInstance() : null;
}

var CardPopupBase = cc.Class({
  extends: cc.Component,

  properties: {
    // 🔴 Ten PHAI trung ban goc — prefab luu theo TEN, doi la binding chet im lang.
    bgPopup: {
      default: null,
      type: cc.Node
    },
    popup: {
      default: null,
      type: cc.Node
    },
    moveDistance: {
      default: 0,
      type: cc.Float
    },
    arrayEditbox: {
      default: [],
      type: [cc.EditBox]
    }
  },

  /**
   * 🔴 PHẢI CÓ, dù gần như rỗng. Bản gốc `PopupBase` có `onLoad`, và popup con gọi
   * `t.prototype.onLoad.call(this)` (vd `PopupXepHangGame.js:125`). Thiếu hàm này thì lời gọi
   * đó ném TypeError và popup CHẾT NGAY lúc nạp.
   *
   * Bẫy này KHÔNG lộ ở `PopupHelpImage` vì nó không gọi super.onLoad — tức nó sẽ nổ ở popup
   * TIẾP THEO chứ không phải cái đầu tiên, nên rất dễ tưởng là "bê cái sau bị lỗi".
   */
  onLoad: function () {
    this.posStart = cc.Vec2.ZERO;
  },

  onDestroy: function () {},

  setShowCallback: function (cb) {
    this.showCallBack = cb;
  },

  setHideCallback: function (cb) {
    this.hideCallBack = cb;
  },

  /** Go88: show(callback = null, thoiGian = 0.4, tyLe = 1). */
  show: function (callback, thoiGian, tyLe) {
    if (callback === undefined) callback = null;
    if (thoiGian === undefined || thoiGian === null) thoiGian = 0.4;
    if (tyLe === undefined || tyLe === null) tyLe = 1;

    var cfg = cauHinh();

    // Y ban goc (PopupBase.js:112): khong co khung thi thoi, va da hien roi thi khong hien lai.
    if (null == this.popup || (cfg && cfg.isShowPopupDone && this.isShowDone)) {
      if (null == this.popup) {
        cc.warn('[CardPopupBase] prefab chua bind o `popup` — popup se khong hien');
      }
      return;
    }

    this.popup.opacity = 50;
    this.popup.scale = 0.4;
    this.popup.active = true;
    this.popup.stopAllActions();
    this.popup.runAction(cc.fadeIn(thoiGian));

    if (cfg) cfg.isShowPopupDone = true;
    this.isShowDone = true;

    var tuDong = this;
    this.popup.runAction(cc.sequence(
      cc.scaleTo(thoiGian, tyLe).easing(cc.easeBackOut()),
      cc.callFunc(function () {
        var c = cauHinh();
        if (c) c.isShowPopupDone = true;
        if (callback) callback(tuDong);
        else if (null != tuDong.showCallBack) tuDong.showCallBack(tuDong);
      })
    ));

    // Man nen mo dan len 178.5/255 — con so cua ban goc, giu nguyen.
    if (null != this.bgPopup) {
      this.bgPopup.stopAllActions();
      this.bgPopup.opacity = 0;
      this.bgPopup.runAction(cc.fadeTo(thoiGian, 178.5));
    }
  },

  /** Go88: hide(callback = null, thoiGian = 0.4, coHuyNode = true, coPhatTieng = true). */
  hide: function (callback, thoiGian, coHuyNode, coPhatTieng) {
    if (callback === undefined) callback = null;
    if (thoiGian === undefined || thoiGian === null) thoiGian = 0.4;
    if (coHuyNode === undefined) coHuyNode = true;
    if (coPhatTieng === undefined) coPhatTieng = true;

    // Khong co khung thi khong dien duoc hoat anh — van phai ha chot va don node, neu khong
    // se ket dung cai chot ma ca cum chong-bam-hai-lan dua vao.
    if (null == this.popup) {
      var c0 = cauHinh();
      if (c0) c0.isShowPopupDone = false;
      this.isShowDone = false;
      if (callback) callback(this);
      else if (null != this.hideCallBack) this.hideCallBack(this);
      if (coHuyNode && this.isDestroyOnHide && this.node && this.node.isValid) this.node.destroy();
      return;
    }

    if (coPhatTieng) {
      var m = mayHat();
      if (m && typeof m.playbtnClick === 'function') m.playbtnClick();
    }

    if (null != this.bgPopup) {
      this.bgPopup.stopAllActions();
      this.bgPopup.runAction(cc.fadeOut(thoiGian).easing(cc.easeBackIn()));
    }

    var tuDong = this;
    this.popup.stopAllActions();
    this.popup.runAction(cc.fadeOut(thoiGian));
    this.popup.runAction(cc.sequence(
      cc.scaleTo(thoiGian, 0).easing(cc.easeBackIn()),
      cc.callFunc(function () {
        tuDong.isShowDone = false;
        var c = cauHinh();
        if (c) c.isShowPopupDone = false;
        tuDong.popup.active = false;

        if (callback) callback(tuDong);
        else if (null != tuDong.hideCallBack) tuDong.hideCallBack(tuDong);

        // Ban goc de node lai cho `arrayPopup` quan ly; ta khong be ngan xep do nen phai tu
        // don, neu khong moi lan mo lai la them mot node chet trong lop popup.
        if (coHuyNode && tuDong.isDestroyOnHide && tuDong.node && tuDong.node.isValid) {
          tuDong.node.destroy();
        }
      })
    ));
  },

  /** Go88: hideWithoutAnimation(callback = null, coHuyNode = true). */
  hideWithoutAnimation: function (callback, coHuyNode) {
    if (coHuyNode === undefined) coHuyNode = true;
    var c = cauHinh();
    if (c) c.isShowPopupDone = false;
    this.isShowDone = false;
    if (coHuyNode && this.node && this.node.isValid) this.node.destroy();
    else if (this.node) this.node.active = false;
    if (callback) callback(this);
  }
});

// Cac truong CHAY (khong phai @property) — ban goc khai trong ham dung, PopupBase.js:70-86.
// Dat tren prototype de moi the hien co mac dinh dung nhu ban goc ngay truoc onLoad.
CardPopupBase.prototype.showCallBack = null;
CardPopupBase.prototype.hideCallBack = null;
CardPopupBase.prototype.isDestroyOnHide = true;
CardPopupBase.prototype.isShowDone = false;
CardPopupBase.prototype.data = null;

i.default = CardPopupBase;
