/**
 * attach-lixi-badge.js — gan LixiBadge vao nut hong bao trong MainGame.fire.
 *
 *   node tools/prefab/attach-lixi-badge.js          (xem truoc, khong ghi)
 *   node tools/prefab/attach-lixi-badge.js --write  (ghi that)
 *
 * Vi sao phai lam bang code: VPS khong mo noi Cocos Creator. Scene la file
 * JSON 60k dong nen sua tay rat de hong; script nay chi them dung nhung gi
 * can va tu kiem lai truoc khi ghi.
 *
 * Viec no lam tren node 'btnHongBao':
 *   1. Them node con 'badge' (cham do) + 'lbCount' (so hong bao dang cho)
 *   2. Gan component LixiBadge, bind hai node tren
 *   3. Dat _active = false — nut AN cho toi khi server bao co hong bao
 *
 * LUU Y: autoOpenPopup = false. Scene DA CO san cc.ClickEvent tro toi
 * LobbyView.openLixiPopupClicked; de LixiBadge tu bat su kien nua thi bam
 * mot cai mo popup HAI lan.
 *
 * Chay lai nhieu lan an toan: thay da gan roi thi bo qua.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const P = require('./lib/cocos-prefab');
const A = require('./lib/assets');

const SCENE = path.join(A.ASSETS_ROOT, 'lobby', 'scenes', 'MainGame.fire');
const SCRIPT_META = path.join(A.ASSETS_ROOT, 'lobby', 'scripts', 'portal', 'vip', 'LixiBadge.js.meta');

/** Anh cham do game dang dung cho badge cua nut Thu (btnMail). */
const SF_DOT = '70db6f50-fb20-469c-bc48-9cfe460f0d56';

const WRITE = process.argv.includes('--write');

// ─────────────────────────────────────────────────────────────────

function trs(x, y) {
  return {
    __type__: 'TypedArray',
    ctor: 'Float64Array',
    array: [x, y, 0, 0, 0, 0, 1, 1, 1, 1],
  };
}

function color(r, g, b) {
  return { __type__: 'cc.Color', r, g, b, a: 255 };
}

function size(w, h) {
  return { __type__: 'cc.Size', width: w, height: h };
}

function vec2(x, y) {
  return { __type__: 'cc.Vec2', x, y };
}

/** Node kieu scene — khac prefab o cho _prefab = null thay vi tro toi PrefabInfo. */
function sceneNode(name, parentId, opts) {
  return {
    __type__: 'cc.Node',
    _name: name,
    _objFlags: 0,
    _parent: { __id__: parentId },
    _children: [],
    _active: opts.active !== false,
    _components: [],
    _prefab: null,
    _opacity: 255,
    _color: color(255, 255, 255),
    _contentSize: size(opts.w, opts.h),
    _anchorPoint: vec2(0.5, 0.5),
    _trs: trs(opts.x || 0, opts.y || 0),
    _eulerAngles: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 },
    _skewX: 0,
    _skewY: 0,
    _is3DNode: false,
    _groupIndex: 0,
    groupIndex: 0,
    _id: '',
  };
}

function main() {
  const raw = fs.readFileSync(SCENE, 'utf8');
  const arr = JSON.parse(raw);

  const badgeUuid = JSON.parse(fs.readFileSync(SCRIPT_META, 'utf8')).uuid;
  const badgeCid = P.compressUuid(badgeUuid);

  const btnIdx = arr.findIndex(
    (o) => o && o.__type__ === 'cc.Node' && o._name === 'btnHongBao'
  );
  if (btnIdx < 0) {
    console.error('Khong tim thay node btnHongBao trong scene');
    process.exit(1);
  }
  const btn = arr[btnIdx];

  // Da gan roi thi thoi
  const already = (btn._components || []).some(
    (c) => arr[c.__id__] && arr[c.__id__].__type__ === badgeCid
  );
  if (already) {
    console.log('LixiBadge da duoc gan tu truoc — khong lam gi.');
    return;
  }

  console.log(`btnHongBao @ ${btnIdx}`);
  console.log(`  _active hien tai : ${btn._active}`);
  console.log(`  so node con      : ${(btn._children || []).length}`);
  console.log(`  LixiBadge cid    : ${badgeCid}`);
  console.log('');

  // Cac phan tu moi noi vao CUOI mang — khong dung toi chi so cu, nen moi
  // tham chieu __id__ dang co van tro dung cho
  let next = arr.length;

  const idBadgeNode = next++;
  const idBadgeSprite = next++;
  const idLbNode = next++;
  const idLbLabel = next++;
  const idComp = next++;

  // ── Node 'badge': cham do o goc tren phai cua nut ──────────────
  const badgeNode = sceneNode('badge', btnIdx, { w: 25, h: 25, x: 52, y: 46, active: false });
  badgeNode._components = [{ __id__: idBadgeSprite }];

  const badgeSprite = {
    __type__: 'cc.Sprite',
    _name: '',
    _objFlags: 0,
    node: { __id__: idBadgeNode },
    _enabled: true,
    _materials: [],
    _srcBlendFactor: 770,
    _dstBlendFactor: 771,
    _spriteFrame: { __uuid__: SF_DOT },
    _type: 0,
    _sizeMode: 0,
    _fillType: 0,
    _fillCenter: vec2(0, 0),
    _fillStart: 0,
    _fillRange: 0,
    _isTrimmedMode: true,
    _atlas: null,
    _id: '',
  };

  // ── Node con 'lbCount': so hong bao dang cho ───────────────────
  const lbNode = sceneNode('lbCount', idBadgeNode, { w: 25, h: 22, x: 0, y: 0 });
  lbNode._components = [{ __id__: idLbLabel }];

  const lbLabel = {
    __type__: 'cc.Label',
    _name: '',
    _objFlags: 0,
    node: { __id__: idLbNode },
    _enabled: true,
    _materials: [],
    _useOriginalSize: false,
    _string: '1',
    _N$string: '1',
    _fontSize: 16,
    _lineHeight: 18,
    _enableWrapText: false,
    _N$file: null,
    _isSystemFontUsed: true,
    _spacingX: 0,
    _batchAsBitmap: false,
    _styleFlags: 0,
    _underlineHeight: 0,
    _N$horizontalAlign: 1,
    _N$verticalAlign: 1,
    _N$fontFamily: 'Arial',
    _N$overflow: 0,
    _N$cacheMode: 0,
    _id: '',
  };

  badgeNode._children = [{ __id__: idLbNode }];

  // ── Component LixiBadge ────────────────────────────────────────
  const comp = {
    __type__: badgeCid,
    _name: '',
    _objFlags: 0,
    node: { __id__: btnIdx },
    _enabled: true,
    nodeBadge: { __id__: idBadgeNode },
    lbBadge: { __id__: idLbLabel },
    nodeHot: null,
    // Scene DA CO cc.ClickEvent -> LobbyView.openLixiPopupClicked.
    // Bat them su kien o day nua thi mot cai bam mo popup hai lan.
    autoOpenPopup: false,
    _id: '',
  };

  arr.push(badgeNode, badgeSprite, lbNode, lbLabel, comp);

  btn._children = (btn._children || []).concat([{ __id__: idBadgeNode }]);
  btn._components = (btn._components || []).concat([{ __id__: idComp }]);

  // Nut AN cho toi khi server bao co hong bao. Day la ca thay doi hanh vi
  // nguoi choi thay ro nhat: truoc do nut nam do quanh nam.
  btn._active = false;

  console.log('Se them:');
  console.log(`  [${idBadgeNode}] cc.Node   badge    (cham do 25x25, an san)`);
  console.log(`  [${idBadgeSprite}] cc.Sprite`);
  console.log(`  [${idLbNode}] cc.Node   lbCount`);
  console.log(`  [${idLbLabel}] cc.Label`);
  console.log(`  [${idComp}] ${badgeCid}  (LixiBadge, autoOpenPopup=false)`);
  console.log('');
  console.log('Va dat btnHongBao._active = false');
  console.log('');

  // ── Tu kiem truoc khi ghi ──────────────────────────────────────
  const errors = [];
  const check = (o, where) => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { o.forEach((v, i) => check(v, `${where}[${i}]`)); return; }
    if (typeof o.__id__ === 'number') {
      if (o.__id__ < 0 || o.__id__ >= arr.length) errors.push(`${where}: __id__=${o.__id__} ngoai mang`);
      return;
    }
    for (const k of Object.keys(o)) {
      if (o[k] === undefined) errors.push(`${where}.${k}: undefined`);
      check(o[k], `${where}.${k}`);
    }
  };
  [badgeNode, badgeSprite, lbNode, lbLabel, comp].forEach((o, i) => check(o, `moi[${i}]`));

  // Component phai tro ve dung node chua no
  if (badgeSprite.node.__id__ !== idBadgeNode) errors.push('badgeSprite.node sai');
  if (lbLabel.node.__id__ !== idLbNode) errors.push('lbLabel.node sai');
  if (comp.node.__id__ !== btnIdx) errors.push('comp.node sai');
  // Cha - con tro nguoc nhau
  if (lbNode._parent.__id__ !== idBadgeNode) errors.push('lbNode._parent sai');
  if (badgeNode._parent.__id__ !== btnIdx) errors.push('badgeNode._parent sai');

  if (errors.length) {
    console.error('LOI — khong ghi:');
    for (const e of errors) console.error('  x ' + e);
    process.exit(1);
  }
  console.log('Tu kiem: OK');

  if (!WRITE) {
    console.log('');
    console.log('Chua ghi. Chay lai voi --write de ghi that.');
    return;
  }

  fs.writeFileSync(SCENE + '.bak', raw, 'utf8');
  fs.writeFileSync(SCENE, JSON.stringify(arr, null, 2), 'utf8');
  console.log('');
  console.log(`Da ghi ${SCENE}`);
  console.log(`Ban cu luu o ${path.basename(SCENE)}.bak`);
}

main();
