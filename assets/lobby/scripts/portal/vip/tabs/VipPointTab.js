/**
 * VipPointTab — tab "VIPPOINT".
 *
 * Tach rieng khoi tab Hang VIP vi hai con so nay khac nhau va truoc gio
 * hay bi nham:
 *
 *   VP TICH LUY  chi tang, khong bao gio giam  -> quyet dinh BAC VIP
 *   VP KHA DUNG  tang cung tich luy nhung TIEU DUOC khi doi thuong
 *
 * Nguoi choi doi thuong xong thi VP kha dung giam, con bac VIP giu nguyen.
 * Ban cu chi hien mot so duy nhat nen khong ai hieu chuyen gi dang xay ra.
 */

'use strict';

const VipService = require('VipService');
const VipModel = require('VipModel');

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    /** VP tieu duoc. */
    lbVpAvailable: cc.Label,
    /** VP tich luy tron doi. */
    lbVpAccumulated: cc.Label,
    /** Bac hien tai, de doi chieu voi VP tich luy. */
    lbRankName: cc.Label,

    /**
     * Hien khi server chua tra ve VP tich luy that (VipModel.accurate = false).
     * Luc do con so tich luy dang tam lay tu VP kha dung nen co the sai.
     */
    nodeEstimateNote: cc.Node,

    /** Cach quy doi: cuoc bao nhieu duoc 1 VP. */
    lbConversionHint: cc.Label,

    /** Cho danh cho lich su VP / doi thuong — chua co API. */
    nodeComingSoon: cc.Node,
  },

  onLoad() {
    if (this.nodeEstimateNote) this.nodeEstimateNote.active = false;
  },

  start() {
    this.refresh();
  },

  refresh(force) {
    const popup = this._popup();
    if (popup) popup.setLoading(true);

    VipService.getUserVp(force)
      .then((res) => {
        if (!this.node || !this.node.isValid) return;
        this._render(VipModel.parse(res));
      })
      .catch((err) => {
        cc.warn('[VipPointTab] Khong lay duoc VIPPOINT:', err.message);
      })
      .then(() => {
        if (popup) popup.setLoading(false);
      });
  },

  _render(vip) {
    this.lbVpAvailable.string = VipModel.formatNumber(vip.vpAvailable);
    this.lbVpAccumulated.string = VipModel.formatNumber(vip.vpAccumulated);
    if (this.lbRankName) this.lbRankName.string = vip.currentRankName;

    // Noi that voi nguoi choi khi con so chi la uoc luong
    if (this.nodeEstimateNote) {
      this.nodeEstimateNote.active = !vip.accurate;
    }

    if (this.lbConversionHint) {
      this.lbConversionHint.string =
        'VIPPOINT tích luỹ theo tiền cược — thắng hay thua đều được tính.';
    }
  },

  _popup() {
    let n = this.node.parent;
    while (n) {
      const c = n.getComponent('VipPopup');
      if (c) return c;
      n = n.parent;
    }
    return null;
  },
});
