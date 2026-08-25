/**
 * LixiPopup — popup "LI XI" (hong bao), DOC LAP voi popup VIP.
 *
 * TRANG THAI: khung da xong, CHUA CO BACKEND. Popup tu biet minh chua co
 * API va hien phan giai thich thay vi bia so lieu.
 *
 * Khi API san sang chi can:
 *   1. viet getLixiList() / openLixi() trong VipService,
 *   2. doi HAS_API thanh true,
 *   3. dien not _render().
 * Khong phai dong vao cho nao khac.
 *
 * NGHIEP VU CAN CHOT TRUOC KHI LAM BACKEND (chua quyet):
 *   - Hong bao tu dau ra: moc nap, su kien theo dip, hay admin phat tay?
 *   - So tien co dinh hay ngau nhien trong khoang? Ai chiu rui ro khoan nay?
 *   - Han su dung bao lau? Het han thi mat hay tra ve quy?
 *   - Co dieu kien vong cuoc truoc khi rut khong? (rat quan trong, khong co
 *     thi bi lam dung ngay)
 */

'use strict';

/** Doi thanh true khi VipService da co getLixiList()/openLixi(). */
const HAS_API = false;

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    lbTitle: cc.Label,
    btnClose: cc.Node,

    /** Node content cua ScrollView chua danh sach hong bao. */
    nodeListContent: cc.Node,
    /** So hong bao chua mo. */
    lbCount: cc.Label,

    /** Hien khi chua co API hoac danh sach rong. */
    nodeNotReady: cc.Node,
    lbNotReady: cc.Label,
    /** Phan danh sach. */
    nodeContent: cc.Node,
  },

  onLoad() {
    this._items = [];
    this.animation = this.node.getComponent(cc.Animation);

    if (this.btnClose) {
      this.btnClose.on(cc.Node.EventType.TOUCH_END, this.close, this);
    }
  },

  onEnable() {
    if (this.animation) this.animation.play('openPopup');
  },

  start() {
    this.refresh();
  },

  refresh() {
    if (!HAS_API) {
      this._showNotReady(
        'Tính năng Lì xì đang được hoàn thiện.\n' +
        'Hồng bao sẽ xuất hiện ở đây khi có sự kiện.'
      );
      return;
    }

    // Khi co API thi thay doan nay bang:
    //   VipService.getLixiList().then(list => this._render(list)) ...
    this._showNotReady('Chưa lấy được danh sách hồng bao.');
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

  close() {
    if (!this.animation) {
      this.node.destroy();
      return;
    }
    this.animation.play('closePopup');
    this.scheduleOnce(() => {
      if (this.node && this.node.isValid) this.node.destroy();
    }, 0.12);
  },

  onDestroy() {
    this._clearList();
  },
});
