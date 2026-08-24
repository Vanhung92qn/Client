/**
 * VipRankItem — mot dong trong danh sach bac VIP.
 *
 * Trang thai nut nhan thuong:
 *   - chua dat bac        -> mo, khong bam duoc
 *   - da dat, chua nhan   -> sang, bam duoc
 *   - da nhan roi         -> doi thanh chu "Đã nhận", khong bam duoc
 *
 * Nut bi KHOA NGAY khi bam, chi mo lai neu that bai. Tranh nguoi choi bam
 * lien tuc gui nhieu request nhan thuong cung luc.
 */

'use strict';

const VipService = require('VipService');
const VipModel = require('VipModel');

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    spIcon: cc.Sprite,
    lbRankName: cc.Label,
    /** Moc VP tich luy can co. */
    lbVpRequired: cc.Label,
    /** Tien thuong thang hang. */
    lbReward: cc.Label,

    nodeClaim: cc.Node,
    lbClaim: cc.Label,
    /** Anh nut khi bam duoc / khong bam duoc. */
    sfClaimNormal: cc.SpriteFrame,
    sfClaimDisabled: cc.SpriteFrame,
  },

  onLoad() {
    this._busy = false;
    if (this.nodeClaim) {
      this.nodeClaim.on(cc.Node.EventType.TOUCH_END, this._onClaim, this);
    }
  },

  /**
   * @param {object}   rank     mot phan tu trong VipModel.parse().ranks
   * @param {cc.SpriteFrame} icon
   * @param {Function} onClaimed goi lai sau khi nhan thuong thanh cong
   * @param {number}   vpAccumulated VP tich luy hien tai — de bao con
   *                   thieu bao nhieu khi nguoi choi bam vao bac chua dat
   */
  setData(rank, icon, onClaimed, vpAccumulated) {
    this._rank = rank;
    this._onClaimed = onClaimed;
    this._vpAccumulated = Number(vpAccumulated) || 0;

    if (icon && this.spIcon) this.spIcon.spriteFrame = icon;
    this.lbRankName.string = rank.name;
    this.lbVpRequired.string = `${VipModel.formatNumber(rank.vpRequired)} VP`;
    this.lbReward.string =
      rank.reward > 0 ? VipModel.formatNumber(rank.reward) : '—';

    this._updateClaimState();
  },

  /** Rung nhe nut — phan hoi tuc thi cho biet cu bam da an, chi la khong dung duoc. */
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

  _updateClaimState() {
    const r = this._rank;
    if (!r || !this.nodeClaim) return;

    // Bac khong co thuong thi khong hien nut
    if (r.reward <= 0) {
      this.nodeClaim.active = false;
      return;
    }
    this.nodeClaim.active = true;

    const canClaim = r.reached && !r.claimed && !this._busy;

    if (this.lbClaim) {
      this.lbClaim.string = r.claimed ? 'Đã nhận' : 'Nhận';
    }

    const sprite = this.nodeClaim.getComponent(cc.Sprite);
    if (sprite) {
      const frame = canClaim ? this.sfClaimNormal : this.sfClaimDisabled;
      if (frame) sprite.spriteFrame = frame;
    }

    // CO Y giu interactable = true ke ca khi khong nhan duoc.
    // Neu tat di thi cc.Button nuot luon su kien cham, nguoi choi bam vao
    // se khong thay bat cu phan hoi nao — dung loi vua sua o _onClaim.
    // Trang thai "khong dung duoc" the hien bang ANH NUT va do mo cua dong.
    const button = this.nodeClaim.getComponent(cc.Button);
    if (button) button.interactable = true;

    // Bac chua dat thi lam mo ca dong cho de phan biet
    this.node.opacity = r.reached ? 255 : 150;
  },

  _onClaim() {
    const r = this._rank;
    if (!r || this._busy) return;

    // Bam vao nut khong dung duoc thi phai NOI RO vi sao. Truoc day ham
    // nay return im lang, nguoi choi bam mai khong thay gi xay ra.
    if (r.reward <= 0) return; // bac khong co thuong, nut da an san

    if (r.claimed) {
      cc.PopupController.getInstance().showMessage(
        `Bạn đã nhận thưởng ${r.name} rồi. Mỗi hạng chỉ nhận được một lần.`
      );
      this._shake();
      return;
    }

    if (!r.reached) {
      const thieu = Math.max(0, r.vpRequired - this._vpAccumulated);
      cc.PopupController.getInstance().showMessage(
        `Chưa đủ điều kiện nhận thưởng ${r.name}.\n` +
        `Cần ${VipModel.formatNumber(r.vpRequired)} VP tích luỹ, ` +
        `bạn còn thiếu ${VipModel.formatNumber(thieu)} VP.`
      );
      this._shake();
      return;
    }

    this._busy = true;
    this._updateClaimState();

    VipService.claimRankReward(r.rankId)
      .then((res) => {
        if (!this.node || !this.node.isValid) return;
        r.claimed = true;
        cc.PopupController.getInstance().showMessage(
          `Bạn đã nhận ${VipModel.formatNumber(r.reward)} từ ${r.name}.`
        );
        // Cap nhat lai so du hien o lobby
        if (cc.LobbyController && cc.LobbyController.getInstance) {
          const lobby = cc.LobbyController.getInstance();
          if (lobby.refreshAccountInfo) lobby.refreshAccountInfo();
        }
        if (this._onClaimed) this._onClaimed(r, res);
      })
      .catch((err) => {
        cc.warn('[VipRankItem] Nhan thuong that bai:', err.message);
      })
      .then(() => {
        if (!this.node || !this.node.isValid) return;
        this._busy = false;
        this._updateClaimState();
      });
  },
});
