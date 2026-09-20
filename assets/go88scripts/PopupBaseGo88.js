var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});

// ─────────────────────────────────────────────────────────────────────────────
//  LOP GIA cho "PopupBase" cua Go88.
//
//  VI SAO KHONG CHEP BAN GOC — hai ly do, ca hai deu la loi HONG IM LANG:
//
//  1. TRUNG TEN LOP. Roy88 da co `assets/lobby/scripts/base/PopupBase.js`. Hai lop cung
//     `__classname__` thi Cocos nem "A Class already exists with the same __classname__",
//     va PHAN CON LAI cua bundle khong dang ky duoc — mat ca cum, khong chi mot popup.
//     Cong cu `bao-dong.js` da canh bao dung cho nay ("TRUNG TEN Roy88: PopupBase").
//
//  2. BAN GOC KEO 7 PHU THUOC (CommonPrefabsManager, GamePlayManager, GameUtils, GameDefine,
//     GameConfigManager, MusicPlayer, WSLiveGameHandle) — trong do co nhung thu cham ha tang
//     Go88 that. Be het chi de chay mot popup anh la doi lay rui ro khong can thiet.
//
//  CAI GI PHAI GIU NGUYEN (da doi chieu tung dong voi PopupBase.js ban goc):
//   · `@property(cc.Node) popup` — 🔴 BAT BUOC. Prefab PopupHelpBaCay bind DUNG MOT truong,
//     va do la truong nay (khai o ban goc dong 233: `o([g(cc.Node)], e.prototype, "popup")`).
//     Khai thieu thi prefab van nap, van khong bao loi, nhung `this.popup` la null nen popup
//     KHONG BAO GIO HIEN — dung kieu loi im lang.
//   · `show()`  : opacity 50 -> fadeIn, scale .4 -> scaleTo(1) easing easeBackOut.
//   · `hide(cb)`: fadeOut + scaleTo(0) easing easeBackIn, xong thi active = false roi goi cb.
//     `PopupHelpImage.onCloseClicked` goi `this.hide(this.callbackClose)` — chu ky nay phai dung.
//
//  BO DI CO CHU Y: `arrayPopup` (ngan xep popup cua GamePlayManager), `isShowPopupDone`
//  (co chong mo chong popup) va `playbtnClick` — deu thuoc ha tang Go88 khong be. Thieu chung
//  thi popup van mo/dong dung, chi khong co tieng bam va khong vao ngan xep chung.
// ─────────────────────────────────────────────────────────────────────────────

var n = cc._decorator,
  o = n.ccclass,
  a = n.property;

var PopupBaseGo88 = cc.Class({
  extends: cc.Component,

  properties: {
    // Ten PHAI la "popup" — prefab luu theo TEN, doi la binding chet im lang.
    popup: {
      default: null,
      type: cc.Node
    }
  },

  /**
   * 🔴 PHẢI CÓ, dù rỗng. Bản gốc `PopupBase` có `onLoad`, và popup con gọi
   * `t.prototype.onLoad.call(this)` (vd `PopupXepHangGame.js:125`). Thiếu hàm này thì lời gọi
   * đó ném TypeError và popup CHẾT NGAY lúc nạp.
   *
   * Bẫy này KHÔNG lộ ở `PopupHelpImage` vì nó không gọi super.onLoad — tức nó sẽ nổ ở popup
   * TIẾP THEO chứ không phải cái đầu tiên, nên rất dễ tưởng là "bê cái sau bị lỗi".
   */
  onLoad: function () {},

  /** Go88: show(callback = null, thoiGian = 0.4, tyLe = 1). */
  show: function (callback, thoiGian, tyLe) {
    if (thoiGian === undefined || thoiGian === null) thoiGian = 0.4;
    if (tyLe === undefined || tyLe === null) tyLe = 1;
    if (!this.popup) {
      cc.warn('[PopupBase] khong co node `popup` — prefab chua bind, popup se khong hien');
      return;
    }

    this.popup.opacity = 50;
    this.popup.scale = 0.4;
    this.popup.active = true;
    this.popup.stopAllActions();
    this.popup.runAction(cc.fadeIn(thoiGian));
    this.popup.runAction(cc.sequence(
      cc.scaleTo(thoiGian, tyLe).easing(cc.easeBackOut()),
      cc.callFunc(function () {
        if (callback) callback();
      })
    ));
  },

  /** Go88: hide(callback = null, thoiGian = 0.4, …). Huy node sau khi dong. */
  hide: function (callback, thoiGian) {
    if (thoiGian === undefined || thoiGian === null) thoiGian = 0.4;
    if (!this.popup) {
      if (callback) callback();
      if (this.node && this.node.isValid) this.node.destroy();
      return;
    }

    var tuDong = this;
    this.popup.stopAllActions();
    this.popup.runAction(cc.fadeOut(thoiGian));
    this.popup.runAction(cc.sequence(
      cc.scaleTo(thoiGian, 0).easing(cc.easeBackIn()),
      cc.callFunc(function () {
        tuDong.popup.active = false;
        if (callback) callback();
        // Ban goc de node lai cho ngan xep popup quan ly; o day khong co ngan xep do nen
        // phai tu don, neu khong moi lan mo lai la them mot node chet trong popupNode.
        if (tuDong.node && tuDong.node.isValid) tuDong.node.destroy();
      })
    ));
  }
});

i.default = PopupBaseGo88;
void 0;
