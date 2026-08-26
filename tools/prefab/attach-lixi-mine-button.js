/**
 * attach-lixi-mine-button.js — them nut "Li xi cua ban" vao lobby.
 *
 *   node tools/prefab/attach-lixi-mine-button.js          (xem truoc)
 *   node tools/prefab/attach-lixi-mine-button.js --write  (ghi that)
 *
 * Nut nay KHAC nut khung gio vang o cho: mac dinh AN, chi hien khi nguoi
 * choi that su co hong bao dang cho mo (li xi thang ngay 18, hoac qua CSKH
 * gui tay). Do la qua RIENG cua tung nguoi — hien nut cho nguoi khong co
 * gi thi ho bam vao roi thay danh sach trong.
 *
 * Hang nut ben phai dang la:
 *   VIP(331) · HoanTra(453) · HongBao(571) · x2nap(718)  — da kin
 * nen dat nut moi o (571, 60), ngay PHIA TREN nut hong bao: cung cum nen
 * nguoi choi hieu la ho hang, ma khong phai doi nut nao dang co.
 *
 * Chay lai nhieu lan an toan: thay da co roi thi bo qua.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const P = require('./lib/cocos-prefab');
const A = require('./lib/assets');

const SCENE = path.join(A.ASSETS_ROOT, 'lobby', 'scenes', 'MainGame.fire');
const SCRIPT_META = path.join(A.ASSETS_ROOT, 'lobby', 'scripts', 'portal', 'vip', 'LixiBadge.js.meta');

const NODE_NAME = 'btnLixiThang';
/** Anh cham do game dang dung cho badge cua nut Thu. */
const SF_DOT = '70db6f50-fb20-469c-bc48-9cfe460f0d56';
/** Anh tui vang — sinh bang Gemini, khac han phong bao do cua nut gio vang. */
const IMG_PATH = 'lobby/images/lixi/btn-lixi-thang.png';

const WRITE = process.argv.includes('--write');

// ─────────────────────────────────────────────────────────────────

function trs(x, y) {
  return { __type__: 'TypedArray', ctor: 'Float64Array', array: [x, y, 0, 0, 0, 0, 1, 1, 1, 1] };
}
function color(r, g, b) { return { __type__: 'cc.Color', r, g, b, a: 255 }; }
function size(w, h) { return { __type__: 'cc.Size', width: w, height: h }; }
function vec2(x, y) { return { __type__: 'cc.Vec2', x, y }; }

/** Node kieu scene — _prefab = null, khac node trong prefab. */
function sceneNode(name, parentId, o) {
  return {
    __type__: 'cc.Node',
    _name: name,
    _objFlags: 0,
    _parent: { __id__: parentId },
    _children: [],
    _active: o.active !== false,
    _components: [],
    _prefab: null,
    _opacity: 255,
    _color: color(255, 255, 255),
    _contentSize: size(o.w, o.h),
    _anchorPoint: vec2(0.5, 0.5),
    _trs: trs(o.x || 0, o.y || 0),
    _eulerAngles: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 },
    _skewX: 0,
    _skewY: 0,
    _is3DNode: false,
    _groupIndex: 0,
    groupIndex: 0,
    _id: '',
  };
}

function spriteComp(nodeId, uuid) {
  return {
    __type__: 'cc.Sprite',
    _name: '', _objFlags: 0,
    node: { __id__: nodeId },
    _enabled: true,
    _materials: [],
    _srcBlendFactor: 770, _dstBlendFactor: 771,
    _spriteFrame: { __uuid__: uuid },
    _type: 0, _sizeMode: 0,
    _fillType: 0, _fillCenter: vec2(0, 0), _fillStart: 0, _fillRange: 0,
    _isTrimmedMode: true, _atlas: null, _id: '',
  };
}

function labelComp(nodeId, text, fontSize) {
  return {
    __type__: 'cc.Label',
    _name: '', _objFlags: 0,
    node: { __id__: nodeId },
    _enabled: true,
    _materials: [],
    _useOriginalSize: false,
    _string: text, _N$string: text,
    _fontSize: fontSize, _lineHeight: fontSize + 2,
    _enableWrapText: false,
    _N$file: null, _isSystemFontUsed: true,
    _spacingX: 0, _batchAsBitmap: false,
    _styleFlags: 0, _underlineHeight: 0,
    _N$horizontalAlign: 1, _N$verticalAlign: 1,
    _N$fontFamily: 'Arial', _N$overflow: 0, _N$cacheMode: 0,
    _id: '',
  };
}

function main() {
  const raw = fs.readFileSync(SCENE, 'utf8');
  const arr = JSON.parse(raw);

  const badgeUuid = JSON.parse(fs.readFileSync(SCRIPT_META, 'utf8')).uuid;
  const badgeCid = P.compressUuid(badgeUuid);
  const sfIcon = A.spriteFrame(IMG_PATH);

  if (arr.some((o) => o && o.__type__ === 'cc.Node' && o._name === NODE_NAME)) {
    console.log(`Node ${NODE_NAME} da co trong scene — khong lam gi.`);
    return;
  }

  const anchorIdx = arr.findIndex(
    (o) => o && o.__type__ === 'cc.Node' && o._name === 'btnHongBao'
  );
  if (anchorIdx < 0) {
    console.error('Khong tim thay btnHongBao de lay lam moc');
    process.exit(1);
  }
  const parentId = arr[anchorIdx]._parent.__id__;
  const anchorX = arr[anchorIdx]._trs.array[0];

  console.log(`Node cha  : ${arr[parentId]._name}`);
  console.log(`Moc       : btnHongBao @ x=${anchorX.toFixed(0)}`);
  console.log(`Anh       : ${IMG_PATH}`);
  console.log(`sprite-frame: ${sfIcon}`);
  console.log('');

  let next = arr.length;
  const idNode = next++;
  const idSprite = next++;
  const idButton = next++;
  const idBadgeNode = next++;
  const idBadgeSprite = next++;
  const idLbNode = next++;
  const idLbLabel = next++;
  const idComp = next++;

  // Nut chinh — dat ngay tren nut hong bao, thu nho cho vua cum
  const node = sceneNode(NODE_NAME, parentId, {
    w: 130, h: 140, x: anchorX, y: 62, active: false,
  });
  node._children = [{ __id__: idBadgeNode }];
  node._components = [
    { __id__: idSprite },
    { __id__: idButton },
    { __id__: idComp },
  ];

  const sprite = spriteComp(idNode, sfIcon);

  const button = {
    __type__: 'cc.Button',
    _name: '', _objFlags: 0,
    node: { __id__: idNode },
    _enabled: true,
    _normalMaterial: null, _grayMaterial: null,
    duration: 0.1, zoomScale: 1.08,
    clickEvents: [],
    _N$interactable: true,
    _N$enableAutoGrayEffect: false,
    _N$transition: 3,
    transition: 3,
    _N$normalColor: { __type__: 'cc.Color', r: 255, g: 255, b: 255, a: 255 },
    _N$pressedColor: { __type__: 'cc.Color', r: 211, g: 211, b: 211, a: 255 },
    pressedColor: { __type__: 'cc.Color', r: 211, g: 211, b: 211, a: 255 },
    _N$hoverColor: { __type__: 'cc.Color', r: 255, g: 255, b: 255, a: 255 },
    hoverColor: { __type__: 'cc.Color', r: 255, g: 255, b: 255, a: 255 },
    _N$disabledColor: { __type__: 'cc.Color', r: 124, g: 124, b: 124, a: 255 },
    _N$normalSprite: null, _N$pressedSprite: null,
    pressedSprite: null, _N$hoverSprite: null, hoverSprite: null,
    _N$disabledSprite: null,
    _N$target: { __id__: idNode },
    _id: '',
  };

  // Badge: cham do + so hong bao dang cho
  const badgeNode = sceneNode('badge', idNode, { w: 25, h: 25, x: 44, y: 50 });
  badgeNode._children = [{ __id__: idLbNode }];
  badgeNode._components = [{ __id__: idBadgeSprite }];
  const badgeSprite = spriteComp(idBadgeNode, SF_DOT);

  const lbNode = sceneNode('lbCount', idBadgeNode, { w: 25, h: 22, x: 0, y: 0 });
  lbNode._components = [{ __id__: idLbLabel }];
  const lbLabel = labelComp(idLbNode, '1', 16);

  // LixiBadge o che do PERSONAL: tu an nut khi khong co gi.
  // autoOpenPopup = true vi node nay MOI, chua co ClickEvent nao.
  const comp = {
    __type__: badgeCid,
    _name: '', _objFlags: 0,
    node: { __id__: idNode },
    _enabled: true,
    mode: 1,
    nodeBadge: { __id__: idBadgeNode },
    lbBadge: { __id__: idLbLabel },
    nodeHot: null,
    autoOpenPopup: true,
    autoHide: true,
    _id: '',
  };

  arr.push(node, sprite, button, badgeNode, badgeSprite, lbNode, lbLabel, comp);
  arr[parentId]._children = (arr[parentId]._children || []).concat([{ __id__: idNode }]);

  console.log('Se them:');
  console.log(`  [${idNode}] cc.Node   ${NODE_NAME}  (130x140 @ x=${anchorX.toFixed(0)} y=62, AN san)`);
  console.log(`  [${idSprite}] cc.Sprite  tui vang`);
  console.log(`  [${idButton}] cc.Button`);
  console.log(`  [${idBadgeNode}] cc.Node   badge + [${idLbNode}] lbCount`);
  console.log(`  [${idComp}] ${badgeCid}  (LixiBadge mode=PERSONAL, autoHide=true)`);
  console.log('');

  // ── Tu kiem ──────────────────────────────────────────────────
  const errors = [];
  const walk = (o, where) => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { o.forEach((v, i) => walk(v, `${where}[${i}]`)); return; }
    if (typeof o.__id__ === 'number') {
      if (o.__id__ < 0 || o.__id__ >= arr.length) errors.push(`${where}: __id__=${o.__id__} ngoai mang`);
      return;
    }
    for (const k of Object.keys(o)) {
      if (o[k] === undefined) errors.push(`${where}.${k}: undefined`);
      walk(o[k], `${where}.${k}`);
    }
  };
  [node, sprite, button, badgeNode, badgeSprite, lbNode, lbLabel, comp]
    .forEach((o, i) => walk(o, `moi[${i}]`));

  if (sprite.node.__id__ !== idNode) errors.push('sprite.node sai');
  if (button.node.__id__ !== idNode) errors.push('button.node sai');
  if (comp.node.__id__ !== idNode) errors.push('comp.node sai');
  if (badgeNode._parent.__id__ !== idNode) errors.push('badgeNode._parent sai');
  if (lbNode._parent.__id__ !== idBadgeNode) errors.push('lbNode._parent sai');
  if (node._parent.__id__ !== parentId) errors.push('node._parent sai');

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
  console.log('Da ghi scene. Ban cu o MainGame.fire.bak');
}

main();
