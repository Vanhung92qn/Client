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
   */
  setData(rank, icon, onClaimed) {
    this._rank = rank;
    this._onClaimed = onClaimed;

    if (icon && this.spIcon) this.spIcon.spriteFrame = icon;
    this.lbRankName.string = rank.name;
    this.lbVpRequired.string = `${VipModel.formatNumber(rank.vpRequired)} VP`;
    this.lbReward.string =
      rank.reward > 0 ? VipModel.formatNumber(rank.reward) : '—';

    this._updateClaimState();
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

    const button = this.nodeClaim.getComponent(cc.Button);
    if (button) button.interactable = canClaim;

    // Bac chua dat thi lam mo ca dong cho de phan biet
    this.node.opacity = r.reached ? 255 : 150;
  },

  _onClaim() {
    const r = this._rank;
    if (!r || this._busy) return;
    if (!r.reached || r.claimed || r.reward <= 0) return;

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
