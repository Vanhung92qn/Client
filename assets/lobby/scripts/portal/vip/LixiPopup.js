/**
 * LixiPopup — man hinh chinh cua he Li xi.
 *
 * Ba kieu hong bao hien chung mot danh sach, phan biet bang ten dot:
 *   1 khung gio vang   2 li xi thang   3 qua tang CSKH
 *
 * Hai duong vao khac nhau:
 *   - Dang co dot GIO VANG va minh chua lay -> khoi "cuop li xi" noi len
 *     tren dau, bam mot phat la mo luon.
 *   - Hong bao da co chu (thang, CSKH) -> nam trong danh sach, bam Mo tung cai.
 *
 * So luong va menh gia hien o day LAY TU CAU HINH THAT (LixiConfig qua
 * SP_Lixi_Summary), nen con so nguoi choi doc duoc luon bang con so thuc
 * phat ra.
 */

'use strict';

const LixiService = require('LixiService');
const LixiModel = require('LixiModel');
const VipPopups = require('VipPopups');

/** Nhip tu lam moi khi popup dang mo (giay). */
const AUTO_REFRESH_SEC = 20;

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    lbTitle: cc.Label,
    btnClose: cc.Node,
    btnHelp: cc.Node,

    /** "Bạn có N hồng bao chưa mở" */
    lbCount: cc.Label,
    /** "Tổng 145.000đ" */
    lbTotal: cc.Label,

    /** Khoi noi len khi dang co dot gio vang. */
    nodeGolden: cc.Node,
    lbGoldenInfo: cc.Label,
    lbGoldenCountdown: cc.Label,
    nodeGrab: cc.Node,
    lbGrab: cc.Label,

    /** Danh sach hong bao da co chu. */
    nodeListContent: cc.Node,
    prefabItem: cc.Prefab,

    /** Hien khi khong co gi. */
    nodeEmpty: cc.Node,
    lbEmpty: cc.Label,

    nodeContent: cc.Node,
    nodeLoading: cc.Node,

    /** Prefab bang giai thich, mo bang nut "?". */
    prefabHelp: cc.Prefab,
  },

  onLoad() {
    this._items = [];
    this._summary = null;
    this._busy = false;

    this.animation = this.node.getComponent(cc.Animation);

    if (this.btnClose) {
      this.btnClose.on(cc.Node.EventType.TOUCH_END, this.close, this);
    }
    if (this.btnHelp) {
      this.btnHelp.on(cc.Node.EventType.TOUCH_END, this._openHelp, this);
    }
    if (this.nodeGrab) {
      this.nodeGrab.on(cc.Node.EventType.TOUCH_END, this._onGrab, this);
    }

    this._setLoading(false);
  },

  onEnable() {
    if (this.animation) this.animation.play('openPopup');
    this.refresh();
    this.schedule(this._silentRefresh, AUTO_REFRESH_SEC);
    // Dem nguoc chay tung giay — tach khoi nhip goi API
    this.schedule(this._tick, 1);
  },

  onDisable() {
    this.unschedule(this._silentRefresh);
    this.unschedule(this._tick);
  },

  // ───────────────────────────────────────────────────────────────
  // Tai du lieu
  // ───────────────────────────────────────────────────────────────

  refresh() {
    this._setLoading(true);
    this._load().then(() => this._setLoading(false));
  },

  _silentRefresh() {
    if (this._busy) return;
    this._load();
  },

  _load() {
    // Hai loi goi doc lap nen chay song song — cho tuan tu thi popup mo
    // cham gap doi ma khong duoc gi
    return Promise.all([
      LixiService.getSummary().catch((e) => { cc.warn('[LixiPopup] summary:', e.message); return null; }),
      LixiService.getList(50).catch((e) => { cc.warn('[LixiPopup] list:', e.message); return null; }),
    ]).then((res) => {
      if (!this.node || !this.node.isValid) return;

      const [rawSummary, rawList] = res;
      this._summary = rawSummary ? LixiModel.parseSummary(rawSummary) : null;

      const list = (rawList || [])
        .map(LixiModel.parseItem)
        .filter((x) => x !== null);

      this._renderHeader();
      this._renderGolden();
      this._renderList(list);
    });
  },

  // ───────────────────────────────────────────────────────────────
  // Ve giao dien
  // ───────────────────────────────────────────────────────────────

  _renderHeader() {
    const s = this._summary;
    const count = s ? s.pendingCount : 0;

    if (this.lbCount) {
      this.lbCount.string = count > 0
        ? `Bạn có ${count} hồng bao chưa mở`
        : 'Chưa có hồng bao nào';
    }
    if (this.lbTotal) {
      this.lbTotal.node.active = count > 0;
      if (count > 0) {
        this.lbTotal.string = `Tổng ${LixiModel.formatNumber(s.pendingAmount)}đ`;
      }
    }
  },

  _renderGolden() {
    const s = this._summary;
    const show = !!(s && s.enabled && s.activeCampaignId > 0 && s.activeRemain > 0);

    if (this.nodeGolden) this.nodeGolden.active = show;
    if (!show) return;

    if (this.lbGoldenInfo) {
      // Con so LAY TU CAU HINH THAT — bang dung so se phat ra
      this.lbGoldenInfo.string =
        `Còn ${s.activeRemain}/${s.goldenQuantity} hồng bao · ${s.goldenText}`;
    }
    if (this.lbGoldenCountdown) {
      this.lbGoldenCountdown.string = LixiModel.formatCountdown(s.activeSeconds);
    }

    if (this.lbGrab) {
      this.lbGrab.string = s.alreadyGrabbed ? 'Đã nhận' : 'Cướp lì xì';
    }
    if (this.nodeGrab) {
      // Giu interactable = true de bam vao van co phan hoi. Tat di thi
      // cc.Button nuot luon su kien cham, nut thanh cam.
      this.nodeGrab.opacity = s.alreadyGrabbed ? 140 : 255;
    }
  },

  _renderList(list) {
    this._clearList();

    const has = list.length > 0;
    if (this.nodeEmpty) this.nodeEmpty.active = !has;
    if (this.lbEmpty && !has) {
      // Man hinh trong la co hoi nhac quay lai, dung de no trong khong
      this.lbEmpty.string =
        'Chưa có hồng bao nào\n\nQuay lại lúc 12h00 hoặc 21h00\nđể cướp lì xì khung giờ vàng';
    }
    if (!has || !this.prefabItem || !this.nodeListContent) return;

    for (const item of list) {
      const node = cc.instantiate(this.prefabItem);
      node.parent = this.nodeListContent;

      const comp = node.getComponent('LixiItem');
      if (comp) {
        comp.setData(item, (picked) => this._onOpenItem(picked, comp));
      }
      this._items.push({ node, comp, data: item });
    }
  },

  /** Dem nguoc chay tung giay, khong goi API. */
  _tick() {
    const s = this._summary;
    if (s && s.activeSeconds > 0) {
      s.activeSeconds -= 1;
      if (this.lbGoldenCountdown && this.nodeGolden && this.nodeGolden.active) {
        this.lbGoldenCountdown.string = LixiModel.formatCountdown(s.activeSeconds);
      }
      // Het gio thi giau khoi gio vang di ngay, khong cho toi nhip goi API
      if (s.activeSeconds <= 0 && this.nodeGolden) {
        this.nodeGolden.active = false;
      }
    }

    for (const it of this._items) {
      if (it.comp && it.data && it.data.isPending) {
        it.comp.tick(it.data.secondsLeft - 1);
      }
    }
  },

  // ───────────────────────────────────────────────────────────────
  // Hanh dong
  // ───────────────────────────────────────────────────────────────

  _onGrab() {
    if (this._busy) return;

    const s = this._summary;
    if (!s || !s.canGrab) {
      if (s && s.alreadyGrabbed) {
        cc.PopupController.getInstance().showMessage(
          'Bạn đã nhận lì xì đợt này rồi.\nHẹn bạn khung giờ sau nhé.'
        );
      } else {
        cc.PopupController.getInstance().showMessage(
          'Chưa tới giờ phát lì xì.\nMỗi ngày 12h00 và 21h00.'
        );
      }
      this._shake(this.nodeGrab);
      return;
    }

    this._busy = true;
    this._openView(null, 'grab');
  },

  _onOpenItem(item, comp) {
    if (this._busy) {
      if (comp) comp.setBusy(false);
      return;
    }
    this._busy = true;
    this._openView(item, 'open', comp);
  },

  /** Mo man hieu ung. Ca hai luong (cuop / mo) deu di qua day. */
  _openView(item, mode, comp) {
    VipPopups.open(VipPopups.ID.LIXI_OPEN)
      .then((node) => {
        const view = node.getComponent('LixiOpenView');
        if (!view) {
          throw new Error('Prefab LixiOpenView thieu component');
        }
        view.show(item, mode, () => {
          this._busy = false;
          if (comp) comp.setBusy(false);
          if (this.node && this.node.isValid) this.refresh();
        });
      })
      .catch((err) => {
        cc.warn('[LixiPopup] Khong mo duoc man hieu ung:', err.message);
        this._busy = false;
        if (comp) comp.setBusy(false);
      });
  },

  _openHelp() {
    if (!this.prefabHelp) return;

    const node = cc.instantiate(this.prefabHelp);
    node.parent = this.node;
    node.zIndex = 100;

    const comp = node.getComponent('LixiHelpPanel');
    if (comp) {
      // Truyen ca thong tin VIP neu da co san — de bang giai thich noi ro
      // thang nay hang cua nguoi dang xem duoc bao nhieu
      const vip = cc.LixiVipCache || null;
      comp.show(this._summary, vip);
    }
  },

  // ───────────────────────────────────────────────────────────────

  _shake(node) {
    if (!node || !node.isValid) return;
    node.stopAllActions();
    const x = node.x;
    cc.tween(node)
      .to(0.04, { x: x - 6 })
      .to(0.08, { x: x + 6 })
      .to(0.04, { x: x })
      .start();
  },

  _setLoading(on) {
    if (this.nodeLoading) this.nodeLoading.active = !!on;
  },

  _clearList() {
    for (const it of this._items) {
      if (it.node && it.node.isValid) it.node.destroy();
    }
    this._items = [];
  },

  close() {
    if (this.animation) {
      this.animation.play('closePopup');
      this.scheduleOnce(() => {
        if (this.node && this.node.isValid) this.node.destroy();
      }, 0.12);
      return;
    }
    if (this.node && this.node.isValid) this.node.destroy();
  },

  onDestroy() {
    this._clearList();
    this._summary = null;
  },
});
