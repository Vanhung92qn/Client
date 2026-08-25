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
  LIXI: 'lixi',
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
    prefab: 'portal/vip/RakebackPopup',
    enabled: true,
  },
  [ID.LIXI]: {
    id: ID.LIXI,
    // Chua co backend — mo vao van xem duoc nhung ben trong bao "sap co".
    title: 'LÌ XÌ',
    prefab: 'portal/vip/LixiPopup',
    enabled: true,
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

  // Dang mo roi thi chi dua len tren
  if (root) {
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
