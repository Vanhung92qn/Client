/**
 * VipPopups — khai bao cac popup DOC LAP o mot cho, kem ham mo dung chung.
 *
 * Ba popup rieng biet, moi cai mot prefab, mo bang nut rieng tu lobby:
 *   vip       Dac quyen VIP  (ben trong co 2 tab: Hang VIP / VIPPOINT)
 *   rakeback  Hoan tra cuoc
 *   lixi      Li xi
 *
 * Them popup moi chi can them mot dong vào BY_ID roi tao prefab + script
 * tuong ung — khong phai sua cho nao khac.
 */

'use strict';

/** Ten bundle chua prefab — xem assets/prefabs.meta ("bundleName": "prefabs"). */
const PREFAB_BUNDLE = 'prefabs';

const ID = {
  VIP: 'vip',
  RAKEBACK: 'rakeback',
  /** Khung gio vang — nut o lobby LUON HIEN. */
  LIXI: 'lixi',
  /** Li xi thang + qua CSKH — nut o lobby chi hien khi co. */
  LIXI_MINE: 'lixiMine',
  /** Lich su da nhan. */
  LIXI_HISTORY: 'lixiHistory',
  /** Man hieu ung mo hong bao — mo chong len tren popup Li xi. */
  LIXI_OPEN: 'lixiOpen',
};

const BY_ID = {
  [ID.VIP]: {
    id: ID.VIP,
    title: 'ĐẶC QUYỀN VIP',
    prefab: 'portal/vip/VipPopup',
    enabled: true,
  },
  [ID.RAKEBACK]: {
    id: ID.RAKEBACK,
    title: 'HOÀN TRẢ CƯỢC',
    // Duong dan PHAN BIET HOA THUONG — phai trung y het ten thu muc tren dia
    prefab: 'portal/RakeBack/RakebackPopup',
    enabled: true,
  },
  [ID.LIXI]: {
    id: ID.LIXI,
    title: 'KHUNG GIỜ VÀNG',
    prefab: 'portal/Lixi/LixiPopup',
    enabled: true,
  },
  [ID.LIXI_MINE]: {
    id: ID.LIXI_MINE,
    title: 'LÌ XÌ CỦA BẠN',
    prefab: 'portal/Lixi/LixiMinePopup',
    enabled: true,
  },
  [ID.LIXI_HISTORY]: {
    id: ID.LIXI_HISTORY,
    title: 'LỊCH SỬ LÌ XÌ',
    prefab: 'portal/Lixi/LixiHistoryPopup',
    enabled: true,
  },
  [ID.LIXI_OPEN]: {
    id: ID.LIXI_OPEN,
    title: 'MỞ HỒNG BAO',
    prefab: 'portal/Lixi/LixiOpenView',
    enabled: true,
    // Man hieu ung phai MO CHONG LEN moi lan bam, khong duoc tai su dung
    // cai dang mo: nguoi choi mo hai hong bao lien tiep thi lan thu hai se
    // thay lai ket qua cu.
    allowStack: true,
  },
};

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

/**
 * Mo mot popup theo id.
 *
 * Neu popup do dang mo san thi dua no len tren thay vi mo them cai nua —
 * tranh chong hai ba lop giong nhau khi nguoi choi bam nut lien tuc.
 *
 * @param {string} id      xem VipPopups.ID
 * @param {cc.Node} parent node cha, mac dinh la Canvas
 * @returns {Promise<cc.Node>}
 */
function open(id, parent) {
  const meta = BY_ID[id];
  if (!meta) {
    return Promise.reject(new Error(`Khong co popup ten "${id}"`));
  }
  if (!meta.enabled) {
    return Promise.reject(new Error(`Popup "${id}" dang tat`));
  }

  const root = parent || cc.director.getScene().getChildByName('Canvas');

  // Dang mo roi thi chi dua len tren — tru popup khai bao allowStack
  if (root && !meta.allowStack) {
    const existed = root.getChildByName(meta.nodeName || _nodeNameOf(meta));
    if (existed && existed.isValid) {
      existed.zIndex = cc.NoteDepth.POPUP_PORTAL;
      existed.active = true;
      return Promise.resolve(existed);
    }
  }

  return loadPrefab(meta.prefab).then((prefab) => {
    const node = cc.instantiate(prefab);
    node.parent = root;
    node.setPosition(0, 0);
    node.zIndex = cc.NoteDepth.POPUP_PORTAL;
    return node;
  });
}

/** Ten node goc cua prefab = phan cuoi duong dan. */
function _nodeNameOf(meta) {
  const parts = meta.prefab.split('/');
  return parts[parts.length - 1];
}

module.exports = {
  ID,
  BY_ID,
  loadPrefab,
  open,
};
