/**
 * VipRakebackTab — tab "HOAN TRA CUOC".
 *
 * CACH HOAT DONG: tien hoan duoc cong NGAY sau moi van cuoc, khong cho chot
 * theo ngay. Nguoi choi bam nhan luc nao cung duoc, nhan tron goi phan dang
 * co roi no lai cong tiep tu van sau.
 *
 * VE PHAN LE: tien hoan tinh ra thuong le duoi 1 dong (vd cuoc 1.234.567d
 * x 0,17% = 2.098,7639d). Vi game chi chua duoc so nguyen nen khi nhan chi
 * chuyen 2.098d vao vi, con 0,7639d GIU LAI cong don cho lan sau — khong
 * vut di dong nao. Man hinh hien ca hai: so nhan duoc ngay va so tich luy
 * day du (co phan le) de nguoi choi thay tien dang chay lien tuc.
 */

'use strict';

const VipService = require('VipService');
const VipModel = require('VipModel');

/** Nhip tu lam moi so du khi tab dang mo (ms). */
const AUTO_REFRESH_MS = 15000;

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    /** So tien nhan duoc ngay bay gio (phan nguyen). */
    lbAmount: cc.Label,
    /** So tich luy day du ke ca phan le — cho thay tien dang chay. */
    lbPending: cc.Label,
    /** Ti le hoan theo hang hien tai, vd "0,32%". */
    lbRate: cc.Label,
    /** Hang hien tai. */
    lbRank: cc.Label,
    /** Tong da nhan tu truoc den nay. */
    lbTotalClaimed: cc.Label,

    nodeClaim: cc.Node,
    lbClaim: cc.Label,
    sfClaimNormal: cc.SpriteFrame,
    sfClaimDisabled: cc.SpriteFrame,

    /** Hien khi chua co gi de nhan hoac loi mang. */
    nodeNotReady: cc.Node,
    lbNotReady: cc.Label,
    /** Phan so lieu. */
    nodeContent: cc.Node,
  },

  onLoad() {
    this._busy = false;
    this._data = null;
    if (this.nodeClaim) {
      this.nodeClaim.on(cc.Node.EventType.TOUCH_END, this._onClaim, this);
    }
  },

  onEnable() {
    // Tien hoan cong lien tuc nen tu lam moi khi tab dang mo
    this.schedule(this._silentRefresh, AUTO_REFRESH_MS / 1000);
  },

  onDisable() {
    this.unschedule(this._silentRefresh);
  },

  start() {
    this.refresh();
  },

  refresh() {
    const popup = this._popup();
    if (popup) popup.setLoading(true);

    VipService.getRakeback(true)
      .then((res) => {
        if (!this.node || !this.node.isValid) return;
        this._render(res);
      })
      .catch((err) => {
        cc.warn('[VipRakebackTab] Khong lay duoc hoan tra:', err.message);
        this._showNotReady('Không tải được thông tin hoàn trả.\nVui lòng thử lại.');
      })
      .then(() => {
        if (popup) popup.setLoading(false);
      });
  },

  /** Lam moi ngam, khong hien vong xoay — dung cho nhip tu dong. */
  _silentRefresh() {
    if (this._busy) return;
    VipService.getRakeback(true)
      .then((res) => {
        if (this.node && this.node.isValid) this._render(res);
      })
      .catch(() => {
        /* mat mang tam thoi thi giu nguyen so cu, khong lam phien nguoi choi */
      });
  },

  // ───────────────────────────────────────────────────────────────

  _render(res) {
    this._data = res;
    this._showNotReady(null);

    const claimable = Number(res.ClaimableAmount) || 0;
    const pending = Number(res.PendingAmount) || 0;

    this.lbAmount.string = VipModel.formatNumber(claimable);

    // Hien ca phan le de nguoi choi thay tien dang chay tung dong,
    // thay vi mot con so nguyen dung im mai moi nhuc nhich.
    if (this.lbPending) {
      const le = pending - Math.floor(pending);
      this.lbPending.string = le > 0
        ? `Đang tích luỹ: ${VipModel.formatNumber(pending)}${le.toFixed(4).slice(1)}đ`
        : `Đang tích luỹ: ${VipModel.formatNumber(pending)}đ`;
    }

    if (this.lbRate) {
      const rate = Number(res.RakebackPercent) || 0;
      this.lbRate.string = `${rate}%`.replace('.', ',');
    }
    if (this.lbRank) {
      this.lbRank.string = VipModel.rankName(res.RankID) +
        (res.GroupName ? ` · ${res.GroupName}` : '');
    }
    if (this.lbTotalClaimed) {
      this.lbTotalClaimed.string = VipModel.formatNumber(res.TotalClaimed || 0);
    }

    this._updateClaimState(claimable > 0);
  },

  _updateClaimState(canClaim) {
    if (!this.nodeClaim) return;

    const on = canClaim && !this._busy;
    if (this.lbClaim) this.lbClaim.string = this._busy ? 'Đang nhận...' : 'Nhận';

    const sprite = this.nodeClaim.getComponent(cc.Sprite);
    if (sprite) {
      const frame = on ? this.sfClaimNormal : this.sfClaimDisabled;
      if (frame) sprite.spriteFrame = frame;
    }
    // Giu interactable = true de bam vao van co phan hoi, giong VipRankItem
    const button = this.nodeClaim.getComponent(cc.Button);
    if (button) button.interactable = true;
  },

  _onClaim() {
    if (this._busy) return;

    const claimable = this._data ? (Number(this._data.ClaimableAmount) || 0) : 0;
    if (claimable <= 0) {
      cc.PopupController.getInstance().showMessage(
        'Chưa có tiền hoàn trả để nhận.\nCứ đặt cược là tiền hoàn cộng vào đây ngay.'
      );
      this._shake();
      return;
    }

    this._busy = true;
    this._updateClaimState(false);

    VipService.claimRakeback()
      .then((res) => {
        if (!this.node || !this.node.isValid) return;
        cc.PopupController.getInstance().showMessage(
          `Đã nhận ${VipModel.formatNumber(res.Amount)}đ tiền hoàn trả.`
        );
        if (cc.LobbyController && cc.LobbyController.getInstance) {
          const lobby = cc.LobbyController.getInstance();
          if (lobby.refreshAccountInfo) lobby.refreshAccountInfo();
        }
      })
      .catch((err) => {
        cc.warn('[VipRakebackTab] Nhan hoan tra that bai:', err.message);
      })
      .then(() => {
        if (!this.node || !this.node.isValid) return;
        this._busy = false;
        this.refresh();
      });
  },

  _shake() {
    if (!this.nodeClaim || !this.nodeClaim.isValid) return;
    this.nodeClaim.stopAllActions();
    const x = this.nodeClaim.x;
    cc.tween(this.nodeClaim)
      .to(0.04, { x: x - 6 })
      .to(0.08, { x: x + 6 })
      .to(0.04, { x: x })
      .start();
  },

  _showNotReady(message) {
    if (this.nodeNotReady) this.nodeNotReady.active = !!message;
    if (this.nodeContent) this.nodeContent.active = !message;
    if (message && this.lbNotReady) this.lbNotReady.string = message;
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
