/**
 * fix-lixi-mine-host.js — sua loi nut li xi thang khong bao gio hien.
 *
 *   node tools/prefab/fix-lixi-mine-host.js          (xem truoc)
 *   node tools/prefab/fix-lixi-mine-host.js --write  (ghi that)
 *
 * LOI DANG SUA
 * ------------
 * Ban dau gan LixiBadge (mode PERSONAL, autoHide) len chinh node
 * btnLixiThang, va dat node do _active = false.
 *
 * Cocos KHONG goi onLoad/onEnable cua component nam tren node inactive.
 * Nen ham _poll() chua bao gio chay, nut khong bao gio tu hien lai — va
 * khong co lay mot dong log nao de lan ra nguyen nhan.
 *
 * Nut tu an chinh minh thi khong bao gio tu hien lai duoc.
 *
 * CACH SUA
 * --------
 * Chen mot node BOC luon active, chuyen component len do:
 *
 *   lixiMineHost   (LUON active, khong hinh khong nut — chi de chay code)
 *     └─ btnLixiThang  (nut that: sprite + button + badge)
 *
 * LixiBadge nam tren host nen luon chay; no bat/tat btnLixiThang qua
 * property nodeTarget.
 *
 * Host khong co sprite lan button nen khong nuot su kien cham; su kien
 * duoc gan thang len btnLixiThang.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const Backup = require('./lib/backup');
const P = require('./lib/cocos-prefab');
const A = require('./lib/assets');

const SCENE = path.join(A.ASSETS_ROOT, 'lobby', 'scenes', 'MainGame.fire');
const SCRIPT_META = path.join(A.ASSETS_ROOT, 'lobby', 'scripts', 'portal', 'vip', 'LixiBadge.js.meta');

const HOST_NAME = 'lixiMineHost';
const BTN_NAME = 'btnLixiThang';

const WRITE = process.argv.includes('--write');

function trs(x, y) {
  return { __type__: 'TypedArray', ctor: 'Float64Array', array: [x, y, 0, 0, 0, 0, 1, 1, 1, 1] };
}

function main() {
  const raw = fs.readFileSync(SCENE, 'utf8');
  const arr = JSON.parse(raw);

  const badgeCid = P.compressUuid(JSON.parse(fs.readFileSync(SCRIPT_META, 'utf8')).uuid);

  if (arr.some((o) => o && o.__type__ === 'cc.Node' && o._name === HOST_NAME)) {
    console.log(`Node ${HOST_NAME} da co — khong lam gi.`);
    return;
  }

  const btnIdx = arr.findIndex(
    (o) => o && o.__type__ === 'cc.Node' && o._name === BTN_NAME
  );
  if (btnIdx < 0) {
    console.error(`Khong tim thay ${BTN_NAME}. Chay attach-lixi-mine-button.js truoc.`);
    process.exit(1);
  }

  const btn = arr[btnIdx];
  const parentId = btn._parent.__id__;
  const parent = arr[parentId];

  // Tim component LixiBadge dang nam tren nut
  let compIdx = -1;
  for (const c of btn._components || []) {
    if (arr[c.__id__] && arr[c.__id__].__type__ === badgeCid) {
      compIdx = c.__id__;
      break;
    }
  }
  if (compIdx < 0) {
    console.error(`${BTN_NAME} khong co component LixiBadge`);
    process.exit(1);
  }

  console.log(`${BTN_NAME} @ ${btnIdx}  (_active = ${btn._active})`);
  console.log(`  cha        : ${parent._name} @ ${parentId}`);
  console.log(`  LixiBadge  : @ ${compIdx}  mode=${arr[compIdx].mode === 1 ? 'PERSONAL' : 'GOLDEN'}`);
  console.log('');

  const hostIdx = arr.length;

  // Host: khong hinh, khong nut — chi de code chay. Toa do lay tu nut cu,
  // nut se ve goc toa do trong host.
  const bx = btn._trs.array[0];
  const by = btn._trs.array[1];

  const host = {
    __type__: 'cc.Node',
    _name: HOST_NAME,
    _objFlags: 0,
    _parent: { __id__: parentId },
    _children: [{ __id__: btnIdx }],
    _active: true,
    _components: [{ __id__: compIdx }],
    _prefab: null,
    _opacity: 255,
    _color: { __type__: 'cc.Color', r: 255, g: 255, b: 255, a: 255 },
    _contentSize: { __type__: 'cc.Size', width: 0, height: 0 },
    _anchorPoint: { __type__: 'cc.Vec2', x: 0.5, y: 0.5 },
    _trs: trs(bx, by),
    _eulerAngles: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 },
    _skewX: 0,
    _skewY: 0,
    _is3DNode: false,
    _groupIndex: 0,
    groupIndex: 0,
    _id: '',
  };
  arr.push(host);

  // Nut chuyen vao lam con cua host, ve goc toa do
  btn._parent = { __id__: hostIdx };
  btn._trs = trs(0, 0);
  btn._components = (btn._components || []).filter((c) => c.__id__ !== compIdx);

  // Cha bo nut, nhan host
  parent._children = (parent._children || [])
    .filter((c) => c.__id__ !== btnIdx)
    .concat([{ __id__: hostIdx }]);

  // Component chuyen len host, tro nodeTarget toi nut
  const comp = arr[compIdx];
  comp.node = { __id__: hostIdx };
  comp.nodeTarget = { __id__: btnIdx };

  console.log('Se sua:');
  console.log(`  [${hostIdx}] cc.Node ${HOST_NAME}  LUON active, chua ${BTN_NAME}`);
  console.log(`  ${BTN_NAME} thanh con cua host, ve pos(0,0)`);
  console.log(`  LixiBadge chuyen len host, nodeTarget -> [${btnIdx}] ${BTN_NAME}`);
  console.log('');

  // ── Tu kiem ──────────────────────────────────────────────────
  const errors = [];
  if (comp.node.__id__ !== hostIdx) errors.push('comp.node khong tro toi host');
  if (comp.nodeTarget.__id__ !== btnIdx) errors.push('comp.nodeTarget khong tro toi nut');
  if (btn._parent.__id__ !== hostIdx) errors.push('nut khong nhan host lam cha');
  if (!host._children.some((c) => c.__id__ === btnIdx)) errors.push('host khong liet ke nut');
  if (!host._components.some((c) => c.__id__ === compIdx)) errors.push('host khong mang component');
  if ((btn._components || []).some((c) => c.__id__ === compIdx)) errors.push('nut van con giu component');
  if (!parent._children.some((c) => c.__id__ === hostIdx)) errors.push('cha khong nhan host');
  if (parent._children.some((c) => c.__id__ === btnIdx)) errors.push('cha van con giu nut');
  if (!host._active) errors.push('host phai luon active');

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

  const bak = Backup.save(SCENE, raw);
  fs.writeFileSync(SCENE, JSON.stringify(arr, null, 2), 'utf8');
  console.log('');
  console.log(`Da ghi scene. Ban cu o ${bak}`);
}

main();
