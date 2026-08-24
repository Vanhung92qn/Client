/**
 * VipOpenButton — mo popup VIP tu bat ky nut nao.
 *
 * Co HAI cach dung, chon cai nao tien hon:
 *
 *   Cach 1 (khong phai gan gi):
 *     Keo script nay vao thang node cua nut. Xong. Bam la mo popup.
 *
 *   Cach 2 (gan ClickEvent nhu binh thuong):
 *     Node co cc.Button san roi -> keo script nay vao node do, o muc
 *     Click Events chon node do + component VipOpenButton + ham
 *     `openVipPopup`. Nho tat `autoBind` de khoi mo hai lan.
 *
 * Ngoai ra con mot cach nua khong can script nay: goi thang tu code
 *     require('VipPopup').open();
 */

'use strict';

const VipPopup = require('VipPopup');

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    autoBind: {
      default: true,
      tooltip:
        'Tu bat su kien cham vao node nay. Tat di neu ban tu gan ClickEvent ' +
        'toi ham openVipPopup, khong thi popup se mo hai lan.',
    },
  },

  onLoad() {
    if (this.autoBind) {
      this.node.on(cc.Node.EventType.TOUCH_END, this.openVipPopup, this);
    }
  },

  /** Gan ham nay vao Click Events cua cc.Button neu tat autoBind. */
  openVipPopup() {
    if (this._opening) return;
    this._opening = true;

    VipPopup.open()
      .then((node) => {
        node.zIndex = cc.NoteDepth.POPUP_PORTAL;
      })
      .catch((err) => {
        cc.error('[VipOpenButton] Khong mo duoc popup VIP:', err);
        cc.PopupController.getInstance().showMessageError(
          'Không mở được trang VIP, vui lòng thử lại.'
        );
      })
      .then(() => {
        this._opening = false;
      });
  },
});
