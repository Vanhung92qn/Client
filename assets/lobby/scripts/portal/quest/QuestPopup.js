/**
 * QuestPopup — man hinh Nhiem vu, hai tab.
 *
 *   NHIEM VU  TAT CA nhiem vu dang bat
 *   SU KIEN   danh cho su kien theo dot, hien chua co cai nao
 *
 * Ban dau toi chia tab theo chu ky (hang ngay / mot lan). Thu that thi hong:
 * chi co DUNG MOT nhiem vu hang ngay nen tab NHIEM VU luon tro troi mot dong,
 * ba nhiem vu con lai bi day het sang tab kia. User bao "cho hien thi o het
 * phan nhiem vu, hien tai su kien rong" — nen gio NHIEM VU gom tat ca.
 *
 * Muon chia lai theo chu ky: doi TAB_FILTER ben duoi, khong phai sua cho nao
 * khac.
 *
 * Badge tren tab = so nhiem vu DA XONG ma CHUA BAM NHAN trong tab do — chi
 * so do moi dang lam nguoi choi mo popup.
 */

'use strict';

const QuestService = require('QuestService');
const QuestModel = require('QuestModel');

/** Nhip tu lam moi khi popup dang mo (giay). */
const AUTO_REFRESH_SEC = 20;

const TAB = cc.Enum({
  DAILY: 0,
  ONCE: 1,
});

/**
 * Tab nao nhan nhiem vu nao. Mot cho duy nhat quyet dinh — doi o day la ca
 * danh sach lan huy hieu dem deu doi theo.
 *
 *   DAILY -> nhan tat ca
 *   ONCE  -> chua nhan gi (danh cho su kien theo dot sau nay)
 */
const TAB_FILTER = {
  [TAB.DAILY]: function () { return true; },
  [TAB.ONCE]: function () { return false; },
};

module.exports = cc.Class({
  extends: cc.Component,

  statics: { TAB },

  properties: {
    btnClose: cc.Node,

    // ── Hai tab ──────────────────────────────────────────────────
    nodeTabDaily: cc.Node,
    spriteTabDaily: cc.Sprite,
    sfTabDailyOn: cc.SpriteFrame,
    sfTabDailyOff: cc.SpriteFrame,
    nodeBadgeDaily: cc.Node,
    lbBadgeDaily: cc.Label,

    nodeTabOnce: cc.Node,
    spriteTabOnce: cc.Sprite,
    sfTabOnceOn: cc.SpriteFrame,
    sfTabOnceOff: cc.SpriteFrame,
    nodeBadgeOnce: cc.Node,
    lbBadgeOnce: cc.Label,

    // ── Danh sach ────────────────────────────────────────────────
    nodeListContent: cc.Node,
    prefabItem: cc.Prefab,

    nodeEmpty: cc.Node,
    lbEmpty: cc.Label,
    nodeLoading: cc.Node,

    /** Bang huong dan, mo bang nut "?". */
    prefabGuide: cc.Prefab,
    btnGuide: cc.Node,
  },

  onLoad() {
    this._items = [];
    this._all = [];
    this._tab = TAB.DAILY;
    this._busy = false;

    this.animation = this.node.getComponent(cc.Animation);

    if (this.btnClose) {
      this.btnClose.on(cc.Node.EventType.TOUCH_END, this.close, this);
    }
    if (this.btnGuide) {
      this.btnGuide.on(cc.Node.EventType.TOUCH_END, this._openGuide, this);
    }
    if (this.nodeTabDaily) {
      this.nodeTabDaily.on(cc.Node.EventType.TOUCH_END, () => this._switchTab(TAB.DAILY), this);
    }
    if (this.nodeTabOnce) {
      this.nodeTabOnce.on(cc.Node.EventType.TOUCH_END, () => this._switchTab(TAB.ONCE), this);
    }

    this._setLoading(false);
  },

  onEnable() {
    if (this.animation) this.animation.play('openPopup');
    this.refresh();
    this.schedule(this._silentRefresh, AUTO_REFRESH_SEC);
  },

  onDisable() {
    this.unschedule(this._silentRefresh);
  },

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
    return QuestService.getList()
      .then((raw) => {
        if (!this.node || !this.node.isValid) return;
        this._all = (raw || []).map(QuestModel.parseItem).filter((x) => x !== null);
        this._render();
      })
      .catch((err) => {
        cc.warn('[QuestPopup]', err.message);
        if (this.node && this.node.isValid) {
          this._all = [];
          this._render();
        }
      });
  },

  // ───────────────────────────────────────────────────────────────

  _switchTab(tab) {
    if (tab === this._tab) return;
    this._tab = tab;
    this._render();
  },

  _render() {
    this._renderTabs();
    this._renderList();
  },

  _renderTabs() {
    const daily = this._all.filter(TAB_FILTER[TAB.DAILY]);
    const once = this._all.filter(TAB_FILTER[TAB.ONCE]);

    // Badge dem cai DA XONG CHUA NHAN, khong phai tong so nhiem vu —
    // con so do moi dang lam nguoi choi mo popup
    const dailyReady = daily.filter((x) => x.action === QuestModel.ACTION.CLAIM).length;
    const onceReady = once.filter((x) => x.action === QuestModel.ACTION.CLAIM).length;

    const on = this._tab;

    if (this.spriteTabDaily) {
      const f = on === TAB.DAILY ? this.sfTabDailyOn : this.sfTabDailyOff;
      if (f) this.spriteTabDaily.spriteFrame = f;
    }
    if (this.spriteTabOnce) {
      const f = on === TAB.ONCE ? this.sfTabOnceOn : this.sfTabOnceOff;
      if (f) this.spriteTabOnce.spriteFrame = f;
    }

    if (this.nodeBadgeDaily) {
      this.nodeBadgeDaily.active = dailyReady > 0;
      if (this.lbBadgeDaily && dailyReady > 0) this.lbBadgeDaily.string = String(dailyReady);
    }
    if (this.nodeBadgeOnce) {
      this.nodeBadgeOnce.active = onceReady > 0;
      if (this.lbBadgeOnce && onceReady > 0) this.lbBadgeOnce.string = String(onceReady);
    }
  },

  _renderList() {
    this._clearList();

    const list = this._all
      .filter(TAB_FILTER[this._tab] || TAB_FILTER[TAB.DAILY])
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const has = list.length > 0;
    if (this.nodeEmpty) this.nodeEmpty.active = !has;
    if (this.lbEmpty && !has) {
      this.lbEmpty.string = this._tab === TAB.DAILY
        ? 'Hôm nay chưa có nhiệm vụ nào'
        : 'Chưa có sự kiện nào đang diễn ra';
    }
    if (!has || !this.prefabItem || !this.nodeListContent) return;

    for (const item of list) {
      const node = cc.instantiate(this.prefabItem);
      node.parent = this.nodeListContent;

      const comp = node.getComponent('QuestItem');
      if (comp) {
        comp.setData(item, (picked) => this._onAction(picked, comp));
      }
      this._items.push({ node, comp });
    }
  },

  // ───────────────────────────────────────────────────────────────

  /**
   * Bam nut tren mot dong.
   *
   * Ba huong khac nhau: nhan thuong, mo man nap, mo game de cuoc.
   * Nut nao hien do QuestModel quyet dinh — o day chi thi hanh.
   */
  _onAction(item, comp) {
    const A = QuestModel.ACTION;

    if (item.action === A.CLAIM) {
      this._claim(item, comp);
      return;
    }

    // Hai huong con lai deu la "dua nguoi choi toi cho lam duoc" —
    // dong popup roi mo man tuong ung
    if (item.action === A.DEPOSIT) {
      this.close();
      if (cc.LobbyController && cc.LobbyController.getInstance) {
        cc.LobbyController.getInstance().createShopView(cc.ShopTab.TOPUP);
      }
      return;
    }

    if (item.action === A.BET) {
      this.close();
      this._openGame(item);
      return;
    }

    if (comp) comp.setBusy(false);
  },

  _claim(item, comp) {
    this._busy = true;

    QuestService.claim(item.questId)
      .then((res) => {
        if (!this.node || !this.node.isValid) return;

        if (res && res.ResponseCode === 1) {
          cc.PopupController.getInstance().showMessage(
            `Đã nhận ${QuestModel.formatNumber(res.Amount)}đ tiền thưởng.`
          );

          // So du vua doi — bao lobby ve lai thanh tien
          if (cc.LobbyController && cc.LobbyController.getInstance) {
            const lobby = cc.LobbyController.getInstance();
            if (lobby.refreshAccountInfo) lobby.refreshAccountInfo();
          }
          // Va bao badge o lobby bot mot cai
          QuestService.notifyChanged();
        } else {
          const msg = (res && res.Message) || 'Không nhận được thưởng.';
          cc.PopupController.getInstance().showMessage(msg);
        }
      })
      .catch((err) => {
        cc.warn('[QuestPopup] Nhan thuong that bai:', err.message);
      })
      .then(() => {
        this._busy = false;
        if (comp) comp.setBusy(false);
        if (this.node && this.node.isValid) this.refresh();
      });
  },

  /**
   * Mo game de lam nhiem vu cuoc.
   *
   * Mo dung game cua nhiem vu do — bat nguoi choi tu di tim thi nut mat
   * gan het y nghia.
   */
  _openGame(item) {
    if (!cc.LobbyController || !cc.LobbyController.getInstance) return;

    // joinGame() so sanh gameId bang switch tren cc.GameId — ma cac gia tri
    // do deu la CHUOI ('8', '68'). Truyen so vao thi khong case nao khop va
    // nut im lang khong lam gi.
    const gid = String(item.gameId);
    if (!gid || gid === '0') {
      cc.warn('[QuestPopup] Nhiem vu khong gan GameID:', item.code);
      return;
    }

    try {
      cc.LobbyController.getInstance().joinGame(gid);
    } catch (e) {
      cc.warn('[QuestPopup] Mo game that bai:', e.message);
    }
  },

  _openGuide() {
    if (!this.prefabGuide) return;
    const node = cc.instantiate(this.prefabGuide);
    node.parent = this.node;
    node.zIndex = 100;
  },

  // ───────────────────────────────────────────────────────────────

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
    this._all = [];
  },
});
