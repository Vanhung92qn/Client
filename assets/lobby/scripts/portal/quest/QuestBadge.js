/**
 * QuestBadge — nut Nhiem vu o lobby.
 *
 * LUON HIEN, khac nut li xi rieng (chi hien khi co qua). Ly do: nhiem vu
 * la thu nguoi choi chu dong tim, va co nhiem vu hang ngay nen ngay nao
 * cung co viec de lam. Giau nut di thi khong ai biet ma vao.
 *
 * 🔴 nodeTarget: neu bat autoHide thi PHAI dat, vi Cocos khong goi
 * onLoad/onEnable cua component nam tren node dang inactive — component tu
 * tat node cua chinh no thi khong bao gio chay lai duoc. Bai hoc tu
 * LixiBadge.
 */

'use strict';

const QuestService = require('QuestService');
const QuestModel = require('QuestModel');
const VipPopups = require('VipPopups');

/** Nhip hoi (giay). Nhiem vu doi cham nen khong can hoi day. */
const POLL_SEC = 60;

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    /** Cham do + so nhiem vu da xong chua nhan. */
    nodeBadge: cc.Node,
    lbBadge: cc.Label,

    /**
     * Node thuc su duoc bat/tat va nhan su kien cham.
     * De trong thi dung chinh node mang component — chi an toan khi node
     * do luon active (mac dinh cua nut nay).
     */
    nodeTarget: cc.Node,

    autoOpenPopup: true,

    /**
     * Tu an nut khi khong co nhiem vu nao cho nhan.
     * MAC DINH TAT — xem chu thich dau file.
     */
    autoHide: false,
  },

  _target() {
    return (this.nodeTarget && this.nodeTarget.isValid) ? this.nodeTarget : this.node;
  },

  onLoad() {
    this._summary = null;

    const target = this._target();

    if (this.autoHide && target === this.node) {
      cc.warn('[QuestBadge] autoHide bat nhung nodeTarget de trong — '
        + 'component se tu tat node cua chinh no va khong bao gio chay lai.');
    }
    if (this.autoHide) target.active = false;

    if (this.autoOpenPopup) {
      target.on(cc.Node.EventType.TOUCH_END, this._open, this);
    }

    // Nap truoc popup va anh cua no: anh nhiem vu chua tung xuat hien o dau
    // nen lan dau mo se phai di tai tung cai, chu ve ngay con anh ve sau.
    // Hoan mot nhip de khong tranh bang thong luc lobby vua mo.
    this.scheduleOnce(() => {
      VipPopups.preload(VipPopups.ID.QUEST);
    }, 2);
  },

  onEnable() {
    cc.log('[QuestBadge] onEnable target=' + this._target().name);
    this._poll();
    this.schedule(this._poll, POLL_SEC);

    // Nhan thuong xong thi biet ngay, khong phai cho toi nhip hoi ke tiep
    QuestService.onChanged(this._poll, this);
  },

  onDisable() {
    this.unschedule(this._poll);
    QuestService.offChanged(this._poll, this);
  },

  _poll() {
    QuestService.getSummary()
      .then((raw) => {
        if (!this.node || !this.node.isValid) return;
        this._summary = QuestModel.parseSummary(raw);

        const s = this._summary;
        cc.log(`[QuestBadge] enabled=${s.enabled} cho-nhan=${s.claimableCount} `
          + `tien=${s.claimableAmount} tong=${s.totalQuest}`);

        this._render();
      })
      .catch((err) => {
        // Im lang ra popup, nhung phai co log — khong thi luc hong khong
        // con manh moi nao de lan
        cc.warn('[QuestBadge] goi GetSummary that bai:', err.message);
      });
  },

  _render() {
    const s = this._summary;
    const target = this._target();

    if (!s || !s.enabled) {
      if (this.autoHide) target.active = false;
      else if (this.nodeBadge) this.nodeBadge.active = false;
      return;
    }

    const first = !target.active;
    target.active = true;

    if (this.nodeBadge) {
      this.nodeBadge.active = s.hasClaimable;
      if (this.lbBadge && s.hasClaimable) {
        this.lbBadge.string = s.claimableCount > 99 ? '99+' : String(s.claimableCount);
      }
    }

    // Chi rung luc VUA co gi de nhac, khong rung moi nhip hoi
    if (s.hasClaimable && (first || !this._wasReady)) this._attract();
    this._wasReady = s.hasClaimable;
  },

  _attract() {
    const target = this._target();
    if (!target || !target.isValid) return;
    target.stopAllActions();
    const sc = target.scale;
    cc.tween(target)
      .to(0.12, { scale: sc * 1.15 })
      .to(0.10, { scale: sc * 0.95 })
      .to(0.08, { scale: sc })
      .start();
  },

  _open() {
    VipPopups.open(VipPopups.ID.QUEST).catch((err) => {
      cc.warn('[QuestBadge] Khong mo duoc popup:', err.message);
    });
  },

  onDestroy() {
    this._summary = null;
  },
});
