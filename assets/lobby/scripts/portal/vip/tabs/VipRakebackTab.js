/**
 * VipRakebackTab — tab "HOAN TRA CUOC".
 *
 * TRANG THAI: khung da xong, CHUA CO BACKEND.
 * Tab tu biet minh chua co API va hien thi phan giai thich thay vi so lieu
 * gia. Khi API san sang chi can:
 *   1. viet 2 ham trong VipService (xem ghi chu ben duoi),
 *   2. doi HAS_API thanh true.
 * Khong phai dong vao VipPopup hay cac tab khac.
 *
 * NGHIEP VU CAN CHOT TRUOC KHI LAM BACKEND (chua quyet):
 *   - Hoan theo % TIEN CUOC hay % TIEN THUA?
 *   - Chu ky: theo ngay / tuan / thang?
 *   - Ti le co khac nhau theo hang VIP khong? Theo game khong?
 *   - Tien hoan cong thang vi hay phai bam nhan? Het han khong?
 * Truoc khi chot may cai nay thi khong nen viet SP, sua sau rat dat.
 */

'use strict';

const VipModel = require('VipModel');

/** Doi thanh true khi VipService da co getRakebackInfo()/claimRakeback(). */
const HAS_API = false;

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    /** So tien duoc hoan ky nay. */
    lbAmount: cc.Label,
    /** Ti le hoan theo hang hien tai, vd "0,5%". */
    lbRate: cc.Label,
    /** Ky hoan tra, vd "Tuần 34/2026". */
    lbPeriod: cc.Label,
    /** Tong cuoc trong ky — can cu tinh hoan. */
    lbTotalBet: cc.Label,

    nodeClaim: cc.Node,
    lbClaim: cc.Label,

    /** Hien khi chua co API — che phan so lieu lai. */
    nodeNotReady: cc.Node,
    lbNotReady: cc.Label,

    /** Phan so lieu, an di khi chua co API. */
    nodeContent: cc.Node,
  },

  onLoad() {
    this._busy = false;
    if (this.nodeClaim) {
      this.nodeClaim.on(cc.Node.EventType.TOUCH_END, this._onClaim, this);
    }
  },

  start() {
    this.refresh();
  },

  refresh() {
    if (!HAS_API) {
      this._showNotReady(
        'Tính năng Hoàn trả cược đang được hoàn thiện.\n' +
        'Bạn sẽ được hoàn lại một phần tiền cược theo hạng VIP.'
      );
      return;
    }

    // Khi co API thi thay doan nay bang:
    //   VipService.getRakebackInfo().then(d => this._render(d)) ...
    this._showNotReady('Chưa lấy được dữ liệu hoàn trả.');
  },

  _render(data) {
    this._showNotReady(null);
    this.lbAmount.string = VipModel.formatNumber(data.amount);
    this.lbRate.string = data.rate;
    this.lbPeriod.string = data.period;
    this.lbTotalBet.string = VipModel.formatNumber(data.totalBet);

    const canClaim = data.amount > 0 && !data.claimed;
    if (this.lbClaim) {
      this.lbClaim.string = data.claimed ? 'Đã nhận' : 'Nhận';
    }
    if (this.nodeClaim) this.nodeClaim.opacity = canClaim ? 255 : 150;
    this._data = data;
  },

  _onClaim() {
    if (!HAS_API) {
      cc.PopupController.getInstance().showMessage(
        'Tính năng Hoàn trả cược sắp ra mắt.'
      );
      return;
    }
    // Khi co API: goi VipService.claimRakeback() roi refresh()
  },

  _showNotReady(message) {
    if (this.nodeNotReady) this.nodeNotReady.active = !!message;
    if (this.nodeContent) this.nodeContent.active = !message;
    if (message && this.lbNotReady) this.lbNotReady.string = message;
  },
});
