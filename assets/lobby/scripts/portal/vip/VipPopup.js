/**
 * VipPopup — khung popup Dac quyen VIP.
 *
 * Khac ban cu o ba diem:
 *   1. Dung prefab RIENG (prefabs/portal/vip/VipPopup), khong con nhet trong
 *      accountViewNew3.prefab nua.
 *   2. Moi tab la mot prefab rieng, nap khi nguoi choi bam vao tab do. Them
 *      tinh nang moi (Hoan tra cuoc, Li xi) = them mot prefab tab, khong phai
 *      dong vao cai da chay.
 *   3. Su kien click dang ky bang code (node.on) chu khong gan trong editor.
 *      Gan trong editor thi doi ten ham la mat lien ket ma khong bao loi gi.
 */

'use strict';

const TAB = require('VipTabs');

/** Ten bundle chua prefab — xem assets/prefabs.meta ("bundleName": "prefabs"). */
const PREFAB_BUNDLE = 'prefabs';

/** Nap mot prefab trong bundle, tra ve Promise. */
function loadPrefab(pathInBundle) {
  return new Promise((resolve, reject) => {
    const done = (bundle) => {
      bundle.load(pathInBundle, cc.Prefab, (err, prefab) => {
        if (err) reject(err);
        else resolve(prefab);
      });
    };
    const loaded = cc.assetManager.getBundle(PREFAB_BUNDLE);
    if (loaded) {
      done(loaded);
      return;
    }
    cc.assetManager.loadBundle(PREFAB_BUNDLE, (err, bundle) => {
      if (err) reject(err);
      else done(bundle);
    });
  });
}

const VipPopup = cc.Class({
  extends: cc.Component,

  properties: {
    lbTitle: cc.Label,
    /** Vung tha noi dung cua tab dang mo. */
    nodeContent: cc.Node,
    /** Cac nut tab, thu tu phai trung VipTabs.ORDER. */
    tabButtons: [cc.Node],
    /** Hien khi dang nap tab / dang goi API. */
    nodeLoading: cc.Node,
    btnClose: cc.Node,
    /** Nut "?" mo bang giai thich cach tinh diem. */
    btnHelp: cc.Node,
    /** Bang giai thich (VipHelpPanel), an san. */
    nodeHelp: cc.Node,
  },

  onLoad() {
    this._tabCache = Object.create(null); // id -> node da nap
    this._currentTab = null;
    this._loadingCount = 0;

    this.animation = this.node.getComponent(cc.Animation);

    if (this.btnClose) {
      this.btnClose.on(cc.Node.EventType.TOUCH_END, this.close, this);
    }

    if (this.btnHelp) {
      this.btnHelp.on(cc.Node.EventType.TOUCH_END, this.toggleHelp, this);
    }

    TAB.ORDER.forEach((tabId, i) => {
      const btn = this.tabButtons[i];
      if (!btn) return;
      const meta = TAB.BY_ID[tabId];
      const button = btn.getComponent(cc.Button);
      if (button) button.interactable = !!meta.enabled;
      if (meta.enabled) {
        btn.on(cc.Node.EventType.TOUCH_END, () => this.openTab(tabId), this);
      }
    });

    this.setLoading(false);
  },

  start() {
    this.openTab(TAB.DEFAULT);
  },

  onEnable() {
    if (this.animation) this.animation.play('openPopup');
  },

  // ───────────────────────────────────────────────────────────────
  // Tab
  // ───────────────────────────────────────────────────────────────

  /**
   * Mo mot tab. Prefab chi nap lan dau, sau do chi bat/tat.
   * @param {string} tabId xem VipTabs
   */
  openTab(tabId) {
    const meta = TAB.BY_ID[tabId];
    if (!meta || !meta.enabled) return;
    if (this._currentTab === tabId) return;

    this._highlightTab(tabId);
    this._currentTab = tabId;

    const cached = this._tabCache[tabId];
    if (cached && cached.isValid) {
      this._showOnly(cached);
      const comp = cached.getComponent(meta.component);
      if (comp && comp.refresh) comp.refresh();
      return;
    }

    this.setLoading(true);
    loadPrefab(meta.prefab)
      .then((prefab) => {
        // Nguoi choi co the da dong popup hoac chuyen tab khac trong luc nap
        if (!this.node || !this.node.isValid) return;
        if (this._currentTab !== tabId) return;

        const view = cc.instantiate(prefab);
        view.parent = this.nodeContent;
        view.setPosition(0, 0);
        this._tabCache[tabId] = view;
        this._showOnly(view);
      })
      .catch((err) => {
        cc.error(`[VipPopup] Khong nap duoc tab ${tabId}:`, err);
        if (this._currentTab === tabId) this._currentTab = null;
      })
      .then(() => this.setLoading(false));
  },

  _showOnly(view) {
    const children = this.nodeContent.children;
    for (let i = 0; i < children.length; i++) {
      children[i].active = children[i] === view;
    }
  },

  _highlightTab(tabId) {
    TAB.ORDER.forEach((id, i) => {
      const btn = this.tabButtons[i];
      if (!btn) return;
      const on = id === tabId;
      btn.opacity = on ? 255 : 170;
      btn.scale = on ? 1 : 0.95;
    });
  },

  // ───────────────────────────────────────────────────────────────
  // Trang thai dang tai — dem long nhau, nhieu request khong dam nhau
  // ───────────────────────────────────────────────────────────────

  setLoading(on) {
    this._loadingCount = Math.max(0, this._loadingCount + (on ? 1 : -1));
    if (this.nodeLoading) {
      this.nodeLoading.active = this._loadingCount > 0;
    }
  },

  // ───────────────────────────────────────────────────────────────
  // Bang giai thich cach tinh diem
  // ───────────────────────────────────────────────────────────────

  /**
   * Mo/dong bang "?". Truyen so lieu that vao de vi du trong bang khop
   * voi bac ke tiep cua chinh nguoi dang xem, thay vi mot vi du chung chung.
   */
  toggleHelp() {
    if (!this.nodeHelp) return;
    const panel = this.nodeHelp.getComponent('VipHelpPanel');
    if (!panel) return;

    if (this.nodeHelp.active) {
      panel.hide();
      return;
    }

    // Lay tu cache neu co, khong doi mang cham lam nut bam khong an
    const VipService = require('VipService');
    const VipModel = require('VipModel');
    panel.show(null);
    VipService.getUserVp()
      .then((res) => {
        if (this.nodeHelp && this.nodeHelp.isValid && this.nodeHelp.active) {
          panel.show(VipModel.parse(res));
        }
      })
      .catch(() => {
        /* khong lay duoc so lieu thi van hien phan giai thich chung */
      });
  },

  // ───────────────────────────────────────────────────────────────
  // Dong
  // ───────────────────────────────────────────────────────────────

  close() {
    if (!this.animation) {
      this.node.destroy();
      return;
    }
    this.animation.play('closePopup');
    this.scheduleOnce(() => {
      if (this.node && this.node.isValid) this.node.destroy();
    }, 0.12);
  },
});

/**
 * Mo popup VIP tu bat ky dau:  require('VipPopup').open(parentNode)
 * @param {cc.Node} parent node cha, mac dinh la Canvas
 * @returns {Promise<cc.Node>}
 */
VipPopup.open = function (parent) {
  return loadPrefab('portal/vip/VipPopup').then((prefab) => {
    const node = cc.instantiate(prefab);
    node.parent = parent || cc.director.getScene().getChildByName('Canvas');
    node.setPosition(0, 0);
    return node;
  });
};

module.exports = VipPopup;
