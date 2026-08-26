/**
 * LixiHistoryPopup — lich su hong bao da nhan.
 *
 * Tach thanh popup RIENG (user chot 2026-08-27) thay vi mot khoi trong
 * popup chinh: hai man hinh do phuc vu hai luc khac nhau. Popup chinh la
 * de HANH DONG (cuop, mo); lich su la de TRA CUU. Nhet chung thi man hanh
 * dong bi dai ra vi mot thu khong ai xem thuong xuyen.
 *
 * Hien CA BA loai (khung gio vang, li xi thang, qua CSKH) — tra cuu thi
 * xem het mot cho tien hon.
 */

'use strict';

const LixiService = require('LixiService');
const LixiModel = require('LixiModel');

/** So dong toi da keo ve. */
const TOP = 100;

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    lbTitle: cc.Label,
    btnClose: cc.Node,

    /** Dong tong ket dau man. */
    lbSummary: cc.Label,

    nodeListContent: cc.Node,
    prefabItem: cc.Prefab,

    nodeEmpty: cc.Node,
    lbEmpty: cc.Label,

    nodeLoading: cc.Node,
  },

  onLoad() {
    this._items = [];
    this.animation = this.node.getComponent(cc.Animation);

    if (this.btnClose) {
      this.btnClose.on(cc.Node.EventType.TOUCH_END, this.close, this);
    }
    this._setLoading(false);
  },

  onEnable() {
    if (this.animation) this.animation.play('openPopup');
    this.refresh();
  },

  refresh() {
    this._setLoading(true);

    LixiService.getList(TOP)
      .then((raw) => {
        if (!this.node || !this.node.isValid) return;

        const list = (raw || [])
          .map(LixiModel.parseItem)
          .filter((x) => x !== null);

        this._render(list);
      })
      .catch((err) => {
        cc.warn('[LixiHistoryPopup]', err.message);
        if (this.node && this.node.isValid) this._render([]);
      })
      .then(() => {
        if (this.node && this.node.isValid) this._setLoading(false);
      });
  },

  _render(list) {
    this._clearList();

    // Chi hien cai DA MO — day la lich su NHAN, khong phai danh sach dang cho
    const received = list.filter((x) => x.isOpened);

    if (this.lbSummary) {
      if (received.length) {
        const total = received.reduce((sum, x) => sum + x.amount, 0);
        this.lbSummary.string =
          `Đã nhận ${received.length} hồng bao · tổng ${LixiModel.formatNumber(total)}đ`;
      } else {
        this.lbSummary.string = '';
      }
    }

    const has = received.length > 0;
    if (this.nodeEmpty) this.nodeEmpty.active = !has;
    if (this.lbEmpty && !has) {
      this.lbEmpty.string = 'Bạn chưa nhận lì xì nào\n\nNhận rồi sẽ thấy ở đây';
    }
    if (!has || !this.prefabItem || !this.nodeListContent) return;

    for (const item of received) {
      const node = cc.instantiate(this.prefabItem);
      node.parent = this.nodeListContent;

      const comp = node.getComponent('LixiItem');
      if (comp) {
        // Truyen callback rong: o man lich su khong co gi de bam mo nua
        comp.setData(item, null);
      }
      this._items.push({ node, comp });
    }
  },

  _setLoading(on) {
    if (this.nodeLoading) this.nodeLoading.active = !!on;
  },

  _clearList() {
    for (const it of this._items) {
      if (it.node && it.node.isValid) it.node.destroy();
    }
    this._items = [];
  },

  close() {
    if (this.animation) {
      this.animation.play('closePopup');
      this.scheduleOnce(() => {
        if (this.node && this.node.isValid) this.node.destroy();
      }, 0.12);
      return;
    }
    if (this.node && this.node.isValid) this.node.destroy();
  },

  onDestroy() {
    this._clearList();
  },
});
