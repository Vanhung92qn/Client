/**
 * VipLixiTab — tab "LI XI" (hong bao).
 *
 * TRANG THAI: khung da xong, CHUA CO BACKEND. Giong VipRakebackTab:
 * doi HAS_API thanh true khi VipService co getLixiList()/openLixi().
 *
 * NGHIEP VU CAN CHOT TRUOC KHI LAM BACKEND (chua quyet):
 *   - Hong bao tu dau ra: moc nap, su kien theo dip, hay admin phat tay?
 *   - So tien co dinh hay ngau nhien trong khoang? Ai chiu rui ro khoan nay?
 *   - Han su dung bao lau? Het han thi mat hay tra ve quy?
 *   - Co dieu kien vong cuoc truoc khi rut khong? (rat quan trong, khong co
 *     thi bi lam dung ngay)
 */

'use strict';

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    /** Node content cua ScrollView chua danh sach hong bao. */
    nodeListContent: cc.Node,
    /** So hong bao chua mo. */
    lbCount: cc.Label,

    /** Hien khi chua co API hoac danh sach rong. */
    nodeNotReady: cc.Node,
    lbNotReady: cc.Label,
    nodeContent: cc.Node,
  },

  onLoad() {
    this._items = [];
  },

  start() {
    this.refresh();
  },

  refresh() {
    this._showNotReady(
      'Tính năng Lì xì đang được hoàn thiện.\n' +
      'Hồng bao sẽ xuất hiện ở đây khi có sự kiện.'
    );
  },

  _showNotReady(message) {
    if (this.nodeNotReady) this.nodeNotReady.active = !!message;
    if (this.nodeContent) this.nodeContent.active = !message;
    if (message && this.lbNotReady) this.lbNotReady.string = message;
  },

  _clearList() {
    for (const n of this._items) {
      if (n && n.isValid) n.destroy();
    }
    this._items = [];
  },

  onDestroy() {
    this._clearList();
  },
});
