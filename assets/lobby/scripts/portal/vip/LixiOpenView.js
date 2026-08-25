/**
 * LixiOpenView — man mo hong bao.
 *
 * Day la cho DUY NHAT tao ra cam xuc trong ca he Li xi; phan con lai chi la
 * danh sach. Nen dang de lam hieu ung tu te.
 *
 * Trinh tu: bao dong rung nhe -> bung ra -> so tien chay tu 0 len.
 * Chay so re hon nhieu so voi hien thang ket qua ma cam giac manh hon han.
 *
 * Dung cho CA hai luong:
 *   - Khung gio vang: goi show(null, 'grab') -> tu goi API cuop
 *   - Li xi thang / CSKH: goi show(item, 'open') -> mo dung cai do
 */

'use strict';

const LixiService = require('LixiService');
const LixiModel = require('LixiModel');

/** Thoi gian chay so (giay). */
const COUNT_DURATION = 0.6;

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    /** Phong bao dong — hien luc dau, bung ra roi an. */
    nodeBao: cc.Node,
    /** Khoi ket qua — hien sau khi bao bung. */
    nodeResult: cc.Node,
    /** So tien lon o giua. */
    lbAmount: cc.Label,
    /** Dong nho ghi hong bao nay tu dau ra. */
    lbSource: cc.Label,
    /** Dong tieu de "CHUC MUNG" hoac thong diep that bai. */
    lbHeader: cc.Label,
    /** Nut dong. */
    nodeConfirm: cc.Node,
    lbConfirm: cc.Label,
    /** Hieu ung tien bay len. */
    fxCoin: cc.Node,
    /** Nen mo, bam vao cung dong. */
    nodeDim: cc.Node,
  },

  onLoad() {
    this._busy = false;
    this._onDone = null;

    if (this.nodeConfirm) {
      this.nodeConfirm.on(cc.Node.EventType.TOUCH_END, this._close, this);
    }
    if (this.nodeDim) {
      this.nodeDim.on(cc.Node.EventType.TOUCH_END, this._close, this);
    }
    if (this.fxCoin) this.fxCoin.active = false;
    if (this.nodeResult) this.nodeResult.active = false;
  },

  /**
   * @param {object|null} item  hong bao can mo; null = cuop khung gio vang
   * @param {string} mode  'grab' | 'open'
   * @param {function} onDone  callback(ketQua) — popup cha lam moi danh sach
   */
  show(item, mode, onDone) {
    this._onDone = onDone;
    this._busy = true;

    if (this.nodeResult) this.nodeResult.active = false;
    if (this.nodeBao) {
      this.nodeBao.active = true;
      this._shakeBao();
    }

    const call = mode === 'grab'
      ? LixiService.grab(0)
      : LixiService.open(item ? item.id : 0);

    call
      .then((res) => {
        if (!this.node || !this.node.isValid) return;
        if (res && res.ResponseCode === 1) {
          this._showSuccess(Math.floor(Number(res.Amount) || 0), item, res);
        } else {
          this._showFail(res);
        }
      })
      .catch((err) => {
        cc.warn('[LixiOpenView] Mo hong bao that bai:', err.message);
        if (!this.node || !this.node.isValid) return;
        this._showFail(null);
      })
      .then(() => {
        this._busy = false;
      });
  },

  _showSuccess(amount, item, res) {
    if (this.nodeBao) this._burstBao();

    if (this.lbHeader) this.lbHeader.string = 'CHÚC MỪNG';
    if (this.lbSource) {
      this.lbSource.string = item ? item.title : 'Khung giờ vàng';
    }

    if (this.nodeResult) this.nodeResult.active = true;
    if (this.fxCoin) this.fxCoin.active = true;
    if (this.lbConfirm) this.lbConfirm.string = 'Nhận';

    this._countUp(amount);

    // So du vua doi — bao lobby ve lai thanh tien
    if (cc.LobbyController && cc.LobbyController.getInstance) {
      const lobby = cc.LobbyController.getInstance();
      if (lobby.refreshAccountInfo) lobby.refreshAccountInfo();
    }

    this._result = { ok: true, amount, res };
  },

  /**
   * That bai KHONG dung popup loi chung.
   *
   * Voi khung gio vang thi "het roi" hay "da nhan roi" la ket qua BINH
   * THUONG cua cuoc tranh nhau, khong phai loi he thong. Hien ngay tai day
   * voi loi le hop canh de chiu hon nhieu so voi mot hop thoai bao loi.
   */
  _showFail(res) {
    if (this.nodeBao) this.nodeBao.active = false;
    if (this.nodeResult) this.nodeResult.active = true;
    if (this.fxCoin) this.fxCoin.active = false;

    const message = (res && res.Message) || 'Không nhận được lì xì, bạn thử lại nhé';

    if (this.lbHeader) this.lbHeader.string = 'RẤT TIẾC';
    if (this.lbAmount) {
      this.lbAmount.string = message;
      // Thong diep dai hon so tien nen phai thu chu lai
      this.lbAmount.fontSize = 26;
      this.lbAmount.node.color = cc.color(230, 230, 230);
    }
    if (this.lbSource) this.lbSource.string = '';
    if (this.lbConfirm) this.lbConfirm.string = 'Đóng';

    this._result = { ok: false, res };
  },

  /** So chay tu 0 len trong COUNT_DURATION giay. */
  _countUp(target) {
    if (!this.lbAmount) return;

    this.lbAmount.fontSize = 46;
    this.lbAmount.node.color = cc.color(255, 214, 122);

    const from = { v: 0 };
    cc.tween(from)
      .to(COUNT_DURATION, { v: target }, {
        progress: (start, end, current, ratio) => {
          const val = Math.floor(start + (end - start) * ratio);
          if (this.lbAmount && this.lbAmount.node && this.lbAmount.node.isValid) {
            this.lbAmount.string = `${LixiModel.formatNumber(val)}đ`;
          }
          return val;
        },
      })
      .call(() => {
        if (this.lbAmount && this.lbAmount.node && this.lbAmount.node.isValid) {
          this.lbAmount.string = `${LixiModel.formatNumber(target)}đ`;
        }
      })
      .start();
  },

  _shakeBao() {
    if (!this.nodeBao || !this.nodeBao.isValid) return;
    this.nodeBao.stopAllActions();
    this.nodeBao.angle = 0;
    cc.tween(this.nodeBao)
      .repeatForever(
        cc.tween()
          .to(0.08, { angle: -7 })
          .to(0.16, { angle: 7 })
          .to(0.08, { angle: 0 })
      )
      .start();
  },

  _burstBao() {
    if (!this.nodeBao || !this.nodeBao.isValid) return;
    this.nodeBao.stopAllActions();
    cc.tween(this.nodeBao)
      .to(0.12, { scale: 1.25, opacity: 255 })
      .to(0.14, { scale: 0.4, opacity: 0 })
      .call(() => {
        if (this.nodeBao && this.nodeBao.isValid) this.nodeBao.active = false;
      })
      .start();
  },

  _close() {
    if (this._busy) return;

    const done = this._onDone;
    const result = this._result;
    this._onDone = null;

    if (this.node && this.node.isValid) this.node.destroy();
    if (done) done(result);
  },

  onDestroy() {
    this._onDone = null;
  },
});
