/**
 * VipOpenButton — mo mot trong ba popup VIP tu bat ky nut nao.
 *
 * Keo script nay vao node cua nut, roi chon `popup` trong Inspector:
 *     VIP       Dac quyen VIP (Hang VIP + VIPPOINT)
 *     RAKEBACK  Hoan tra cuoc
 *     LIXI      Li xi
 *
 * Co HAI cach dung:
 *   Cach 1 (khong phai gan gi):
 *     De `autoBind` bat. Bam vao node la mo popup da chon.
 *
 *   Cach 2 (gan ClickEvent nhu binh thuong):
 *     Tat `autoBind`, roi o muc Click Events cua cc.Button tro toi ham
 *     `openPopup` cua chinh component nay. Tat autoBind de khoi mo hai lan.
 *
 * Ngoai ra con goi thang tu code duoc:
 *     require('VipPopups').open('rakeback');
 */

'use strict';

const VipPopups = require('VipPopups');

/** Cho hien dropdown trong Inspector thay vi bat go chuoi. */
const PopupTarget = cc.Enum({
  VIP: 0,
  RAKEBACK: 1,
  LIXI: 2,
});

const TARGET_ID = {
  0: VipPopups.ID.VIP,
  1: VipPopups.ID.RAKEBACK,
  2: VipPopups.ID.LIXI,
};

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    popup: {
      default: PopupTarget.VIP,
      type: PopupTarget,
      tooltip: 'Popup se mo khi bam nut nay',
    },
    autoBind: {
      default: true,
      tooltip:
        'Tu bat su kien cham vao node nay. Tat di neu ban tu gan ClickEvent ' +
        'toi ham openPopup, khong thi popup se mo hai lan.',
    },
  },

  onLoad() {
    if (this.autoBind) {
      this.node.on(cc.Node.EventType.TOUCH_END, this.openPopup, this);
    }
  },

  /** Gan ham nay vao Click Events cua cc.Button neu tat autoBind. */
  openPopup() {
    if (this._opening) return;
    this._opening = true;

    const id = TARGET_ID[this.popup] || VipPopups.ID.VIP;

    VipPopups.open(id)
      .catch((err) => {
        cc.error(`[VipOpenButton] Khong mo duoc popup "${id}":`, err);
        cc.PopupController.getInstance().showMessageError(
          'Không mở được, vui lòng thử lại.'
        );
      })
      .then(() => {
        this._opening = false;
      });
  },
});
