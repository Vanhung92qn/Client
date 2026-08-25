/**
 * LixiItem — mot hong bao trong danh sach.
 *
 * BA trang thai dung CHUNG mot prefab, doi bang anh va chu chu khong tao ba
 * loai item: chua mo / da mo / het han. Tach ra ba prefab thi moi lan sua
 * bo cuc phai sua ba cho.
 */

'use strict';

const LixiModel = require('LixiModel');

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    /** Anh phong bao — doi theo trang thai. */
    spriteBao: cc.Sprite,
    /** Ten dot phat, hoac ly do neu la qua tang CSKH. */
    lbName: cc.Label,
    /** Dong phu: dem nguoc khi chua mo, so tien khi da mo. */
    lbSub: cc.Label,
    /** Nut Mo — an di khi da mo hoac het han. */
    nodeOpen: cc.Node,
    /** Chu "Đã nhận" thay cho nut. */
    lbDone: cc.Label,

    sfBaoClosed: cc.SpriteFrame,
    sfBaoOpened: cc.SpriteFrame,
  },

  onLoad() {
    this._data = null;
    this._onOpen = null;
    this._busy = false;

    if (this.nodeOpen) {
      this.nodeOpen.on(cc.Node.EventType.TOUCH_END, this._click, this);
    }
  },

  /**
   * @param {object} item  ket qua LixiModel.parseItem()
   * @param {function} onOpen  callback(item) khi nguoi choi bam Mo
   */
  setData(item, onOpen) {
    this._data = item;
    this._onOpen = onOpen;
    this._busy = false;
    this._render();
  },

  /**
   * Cap nhat rieng dong dem nguoc, khong dung toi phan con lai.
   *
   * Goi moi giay tu popup cha. Tach rieng khoi _render() de moi nhip khong
   * phai dat lai spriteFrame va chuoi ten — thua va gay nhap nhay.
   */
  tick(seconds) {
    if (!this._data || !this._data.isPending) return;

    this._data.secondsLeft = seconds;
    if (seconds <= 0) {
      this._data.isPending = false;
      this._data.isExpired = true;
      this._render();
      return;
    }
    if (this.lbSub) {
      this.lbSub.string = LixiModel.formatCountdown(seconds);
    }
    this._applyUrgentColor(seconds);
  },

  _render() {
    const d = this._data;
    if (!d) return;

    if (this.lbName) this.lbName.string = d.title;

    if (this.spriteBao) {
      const frame = d.isPending ? this.sfBaoClosed : this.sfBaoOpened;
      if (frame) this.spriteBao.spriteFrame = frame;
      // Het han thi lam xam di — nguoi choi nhin luot la biet cai nao con
      this.spriteBao.node.opacity = d.isExpired ? 120 : 255;
    }

    if (d.isPending) {
      if (this.lbSub) this.lbSub.string = LixiModel.formatCountdown(d.secondsLeft);
      this._applyUrgentColor(d.secondsLeft);
      if (this.nodeOpen) this.nodeOpen.active = true;
      if (this.lbDone) this.lbDone.node.active = false;
    } else if (d.isOpened) {
      if (this.lbSub) {
        this.lbSub.string = `${LixiModel.formatNumber(d.amount)}đ`;
        this.lbSub.node.color = cc.color(255, 214, 122);
      }
      if (this.nodeOpen) this.nodeOpen.active = false;
      if (this.lbDone) {
        this.lbDone.node.active = true;
        this.lbDone.string = 'Đã nhận';
      }
    } else {
      if (this.lbSub) {
        this.lbSub.string = 'Đã hết hạn';
        this.lbSub.node.color = cc.color(150, 150, 150);
      }
      if (this.nodeOpen) this.nodeOpen.active = false;
      if (this.lbDone) {
        this.lbDone.node.active = true;
        this.lbDone.string = 'Hết hạn';
      }
    }
  },

  /** Duoi 5 phut thi doi mau do — de nguoi choi biet phai mo ngay. */
  _applyUrgentColor(seconds) {
    if (!this.lbSub) return;
    this.lbSub.node.color = seconds < 300
      ? cc.color(255, 110, 100)
      : cc.color(255, 255, 255);
  },

  _click() {
    if (this._busy) return;
    if (!this._data || !this._data.isPending) return;
    if (!this._onOpen) return;

    this._busy = true;
    this._onOpen(this._data);
  },

  /** Popup cha goi khi mo xong hoac that bai, de nut bam lai duoc. */
  setBusy(on) {
    this._busy = !!on;
  },

  onDestroy() {
    this._data = null;
    this._onOpen = null;
  },
});
