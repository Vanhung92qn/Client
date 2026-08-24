/**
 * VipRankTab — tab "HANG VIP": bac hien tai, tien do len bac ke tiep,
 * va danh sach toan bo cac bac kem nut nhan thuong.
 */

'use strict';

const VipService = require('VipService');
const VipModel = require('VipModel');

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    // ── Phan tom tat o tren ──
    spIconRank: cc.Sprite,
    lbRankName: cc.Label,
    /** VP tich luy — con so quyet dinh bac. */
    lbVpAccumulated: cc.Label,
    barProgress: cc.ProgressBar,
    /** Vi du: "50.000 / 100.000 VP" */
    lbProgress: cc.Label,
    /** Vi du: "Còn 50.000 VP nữa lên VIP 8" */
    lbNextHint: cc.Label,

    // ── Danh sach bac ──
    /** Node content cua ScrollView (co cc.Layout doc). */
    nodeListContent: cc.Node,
    prefabRankItem: cc.Prefab,

    /** Icon tung bac, phan tu 0 = VIP 1 ... phan tu 14 = VIP 15. */
    rankIcons: [cc.SpriteFrame],

    /** Hien khi danh sach rong / loi mang. */
    nodeEmpty: cc.Node,
    lbEmpty: cc.Label,
  },

  onLoad() {
    this._items = [];
    if (this.nodeEmpty) this.nodeEmpty.active = false;
  },

  start() {
    this.refresh();
  },

  /** Lay so lieu moi nhat va ve lai. Duoc VipPopup goi khi quay lai tab. */
  refresh(force) {
    const popup = this._popup();
    if (popup) popup.setLoading(true);

    VipService.getUserVp(force)
      .then((res) => {
        if (!this.node || !this.node.isValid) return;
        this._render(VipModel.parse(res));
      })
      .catch((err) => {
        cc.warn('[VipRankTab] Khong lay duoc thong tin VIP:', err.message);
        this._showEmpty('Không tải được thông tin VIP.\nVui lòng thử lại.');
      })
      .then(() => {
        if (popup) popup.setLoading(false);
      });
  },

  // ───────────────────────────────────────────────────────────────

  _render(vip) {
    this._showEmpty(null);

    // Tom tat
    this.lbRankName.string = vip.currentRankName;
    this._setRankIcon(this.spIconRank, vip.currentRankId);

    this.lbVpAccumulated.string = VipModel.formatNumber(vip.vpAccumulated);

    if (vip.next) {
      this.barProgress.progress = vip.progress;
      this.lbProgress.string =
        `${VipModel.formatNumber(vip.vpAccumulated)} / ${VipModel.formatNumber(vip.next.vpRequired)} VP`;
      this.lbNextHint.string =
        `Còn ${VipModel.formatNumber(vip.vpToNext)} VP nữa lên ${vip.next.name}`;
    } else {
      this.barProgress.progress = 1;
      this.lbProgress.string = `${VipModel.formatNumber(vip.vpAccumulated)} VP`;
      this.lbNextHint.string = 'Bạn đã đạt hạng cao nhất';
    }

    // Danh sach
    this._clearList();
    if (!vip.ranks.length) {
      this._showEmpty('Chưa có dữ liệu hạng VIP.');
      return;
    }
    for (const rank of vip.ranks) {
      const node = cc.instantiate(this.prefabRankItem);
      node.parent = this.nodeListContent;
      const item = node.getComponent('VipRankItem');
      if (item) {
        item.setData(rank, this._iconOf(rank.rankId), () => this._onClaimed());
      }
      this._items.push(node);
    }
  },

  _onClaimed() {
    // Nhan thuong xong: so du va trang thai da doi -> lay lai so lieu that
    this.refresh(true);
  },

  _iconOf(rankId) {
    const i = (Number(rankId) || 1) - 1;
    return this.rankIcons[i] || this.rankIcons[0] || null;
  },

  _setRankIcon(sprite, rankId) {
    if (!sprite) return;
    const frame = this._iconOf(rankId);
    if (frame) sprite.spriteFrame = frame;
  },

  _clearList() {
    for (const n of this._items) {
      if (n && n.isValid) n.destroy();
    }
    this._items = [];
  },

  _showEmpty(message) {
    if (!this.nodeEmpty) return;
    this.nodeEmpty.active = !!message;
    if (message && this.lbEmpty) this.lbEmpty.string = message;
  },

  /** Tim component VipPopup o node cha de bat/tat trang thai dang tai. */
  _popup() {
    let n = this.node.parent;
    while (n) {
      const c = n.getComponent('VipPopup');
      if (c) return c;
      n = n.parent;
    }
    return null;
  },

  onDestroy() {
    this._clearList();
  },
});
