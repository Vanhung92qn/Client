/**
 * LixiBadge — icon li xi o lobby.
 *
 * Keo vao node 'btnHongBao' co san trong scene MainGame. Khong lam prefab
 * rieng vi chi la mot component gan them; dung prefab cho viec nay chi
 * them mot tang ma khong giai quyet gi.
 *
 * Nguyen tac: KHONG co hong bao thi icon AN HAN (node.active = false),
 * khong hien nut xam. Nut xam nam do quanh nam chi lam chat lobby.
 *
 * Tu hoi server theo nhip. Nhip nhanh hon binh thuong trong khung gio vang
 * vi luc do so hong bao con lai tut rat nhanh.
 */

'use strict';

const LixiService = require('LixiService');
const LixiModel = require('LixiModel');
const VipPopups = require('VipPopups');

/** Nhip hoi luc binh thuong (giay). */
const POLL_IDLE = 60;
/** Nhip hoi khi dang co dot gio vang (giay). */
const POLL_ACTIVE = 10;

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    /** Vong tron do hien so hong bao dang cho. */
    nodeBadge: cc.Node,
    lbBadge: cc.Label,
    /** Nhan "Đang phát" khi co dot gio vang. */
    nodeHot: cc.Node,
    /**
     * Bam vao icon co tu mo popup Li xi khong.
     * Tat di neu nut da co su kien click khac trong scene.
     */
    autoOpenPopup: true,
  },

  onLoad() {
    this._summary = null;
    this._pollSec = POLL_IDLE;

    // An ngay tu dau — cho toi khi server xac nhan co gi thi moi hien
    this.node.active = false;

    if (this.autoOpenPopup) {
      this.node.on(cc.Node.EventType.TOUCH_END, this._open, this);
    }
  },

  onEnable() {
    this._poll();
    this.schedule(this._poll, this._pollSec);
  },

  onDisable() {
    this.unschedule(this._poll);
  },

  _poll() {
    LixiService.getSummary()
      .then((raw) => {
        if (!this.node || !this.node.isValid) return;
        this._summary = LixiModel.parseSummary(raw);
        this._render();
        this._retune();
      })
      .catch((err) => {
        // Im lang. Badge hong thi cung khong the dam popup loi vao mat
        // nguoi choi moi phut mot lan chi vi mang chap chon.
        cc.warn('[LixiBadge]', err.message);
      });
  },

  /**
   * Doi nhip hoi cho khop tinh hinh: dang co dot gio vang thi hoi day hon
   * vi so hong bao con lai tut rat nhanh, con so con lai hien sai thi
   * nguoi choi bam vao roi hut.
   */
  _retune() {
    const s = this._summary;
    const want = (s && s.activeCampaignId > 0 && s.activeRemain > 0)
      ? POLL_ACTIVE
      : POLL_IDLE;

    if (want === this._pollSec) return;

    this._pollSec = want;
    this.unschedule(this._poll);
    this.schedule(this._poll, want);
  },

  _render() {
    const s = this._summary;
    if (!s || !s.enabled || !s.hasAnything) {
      this.node.active = false;
      return;
    }

    const first = !this.node.active;
    this.node.active = true;

    if (this.nodeBadge) {
      this.nodeBadge.active = s.pendingCount > 0;
      if (this.lbBadge && s.pendingCount > 0) {
        this.lbBadge.string = s.pendingCount > 99 ? '99+' : String(s.pendingCount);
      }
    }

    // Nhan "đang phát" chi bat khi CON hong bao va MINH CHUA lay
    if (this.nodeHot) {
      this.nodeHot.active = s.canGrab;
    }

    // Chi rung luc VUA hien len, khong rung moi nhip hoi — rung lien tuc
    // thanh phien nhieu chu khong con la loi nhac
    if (first) this._attract();
  },

  _attract() {
    if (!this.node || !this.node.isValid) return;
    this.node.stopAllActions();
    const s = this.node.scale;
    cc.tween(this.node)
      .to(0.12, { scale: s * 1.18 })
      .to(0.10, { scale: s * 0.94 })
      .to(0.08, { scale: s })
      .start();
  },

  _open() {
    VipPopups.open(VipPopups.ID.LIXI).catch((err) => {
      cc.warn('[LixiBadge] Khong mo duoc popup:', err.message);
    });
  },

  onDestroy() {
    this._summary = null;
  },
});
