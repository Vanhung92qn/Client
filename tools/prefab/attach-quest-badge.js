/**
 * attach-quest-badge.js — gan QuestBadge vao nut "Su kien" o thanh duoi lobby.
 *
 *   node tools/prefab/attach-quest-badge.js          (xem truoc, khong ghi)
 *   node tools/prefab/attach-quest-badge.js --write  (ghi that)
 *
 * KHONG tao nut moi. Scene DA CO san node 'btnEvent' trong thanh duoi
 * (canh CSKH / Thu / Cai dat), dang bat, co san icon Spine 'LobbyIcons'
 * — nhung cc.ClickEvent cua no RONG (target = null, handler = ""), tuc la
 * bam vao khong xay ra gi. Do la cho dung cua man Nhiem vu: nguoi choi da
 * quen no nam o day, va khong phai chen them nut vao mot thanh da chat.
 *
 * Viec script nay lam tren node 'btnEvent':
 *   1. Them node con 'badge' (cham do) + 'lbCount' (so nhiem vu cho nhan)
 *   2. Gan component QuestBadge, bind hai node tren
 *
 * autoOpenPopup = true: cc.ClickEvent cua nut rong nen khong ai mo popup
 * ca — de QuestBadge tu bat TOUCH_END. (Khac nut hong bao: nut do da co
 * ClickEvent that, bat them la mo popup hai lan.)
 *
 * autoHide = false: nut LUON HIEN. Nhiem vu hang ngay thi ngay nao cung
 * co viec de lam, giau nut di thi khong ai biet ma vao.
 *
 * Chay lai nhieu lan an toan: thay da gan roi thi bo qua.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const P = require('./lib/cocos-prefab');
const A = require('./lib/assets');

const SCENE = path.join(A.ASSETS_ROOT, 'lobby', 'scenes', 'MainGame.fire');
const SCRIPT_META = path.join(
  A.ASSETS_ROOT, 'lobby', 'scripts', 'portal', 'quest', 'QuestBadge.js.meta'
);

const HOST_NAME = 'btnEvent';
/** Cham do trong chinh bo asset Nhiem vu — cung bundle 'lobby' voi popup. */
const DOT_IMG = 'lobby/images/quest/redcircle.png';

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
  const sfDot = A.spriteFrame(DOT_IMG);

  const hostIdx = arr.findIndex(
    (o) => o && o.__type__ === 'cc.Node' && o._name === HOST_NAME
  );
  if (hostIdx < 0) {
    console.error(`Khong tim thay node ${HOST_NAME} trong scene`);
    process.exit(1);
  }
  const host = arr[hostIdx];

  const already = (host._components || []).some(
    (c) => arr[c.__id__] && arr[c.__id__].__type__ === badgeCid
  );
  if (already) {
    console.log('QuestBadge da duoc gan tu truoc — khong lam gi.');
    return;
  }

  // Kiem lai gia dinh: nut nay that su chua tro toi dau ca. Neu ai do da
  // noi handler vao thi dung lai — bat them TOUCH_END se mo hai lan.
  const btnComp = (host._components || [])
    .map((c) => arr[c.__id__])
    .find((k) => k && k.__type__ === 'cc.Button');
  let handlers = [];
  if (btnComp) {
    handlers = (btnComp.clickEvents || [])
      .map((e) => arr[e.__id__])
      .filter((h) => h && h.handler);
  }
  if (handlers.length) {
    console.error(`${HOST_NAME} da co cc.ClickEvent that: `
      + handlers.map((h) => h.handler).join(', '));
    console.error('Gan them QuestBadge voi autoOpenPopup=true se mo popup HAI lan.');
    console.error('Dung lai — xem lai truoc khi chay tiep.');
    process.exit(1);
  }

  console.log(`${HOST_NAME} @ ${hostIdx}`);
  console.log(`  _active          : ${host._active}`);
  console.log(`  cc.ClickEvent    : ${btnComp ? (btnComp.clickEvents || []).length : 0} cai, deu RONG`);
  console.log(`  QuestBadge cid   : ${badgeCid}`);
  console.log(`  cham do          : ${DOT_IMG}`);
  console.log('');

  let next = arr.length;
  const idBadgeNode = next++;
  const idBadgeSprite = next++;
  const idLbNode = next++;
  const idLbLabel = next++;
  const idComp = next++;

  // Cham do o goc tren phai cua nut (nut 90x90 -> lech 30, 30)
  const badgeNode = sceneNode('badge', hostIdx, { w: 28, h: 28, x: 30, y: 30, active: false });
  badgeNode._children = [{ __id__: idLbNode }];
  badgeNode._components = [{ __id__: idBadgeSprite }];
  const badgeSprite = spriteComp(idBadgeNode, sfDot);

  const lbNode = sceneNode('lbCount', idBadgeNode, { w: 28, h: 22, x: 0, y: 0 });
  lbNode._components = [{ __id__: idLbLabel }];
  const lbLabel = labelComp(idLbNode, '1', 17);

  const comp = {
    __type__: badgeCid,
    _name: '', _objFlags: 0,
    node: { __id__: hostIdx },
    _enabled: true,
    nodeBadge: { __id__: idBadgeNode },
    lbBadge: { __id__: idLbLabel },
    nodeTarget: null,
    autoOpenPopup: true,
    autoHide: false,
    _id: '',
  };

  arr.push(badgeNode, badgeSprite, lbNode, lbLabel, comp);

  host._children = (host._children || []).concat([{ __id__: idBadgeNode }]);
  host._components = (host._components || []).concat([{ __id__: idComp }]);

  console.log('Se them:');
  console.log(`  [${idBadgeNode}] cc.Node   badge    (cham do 28x28, an san)`);
  console.log(`  [${idBadgeSprite}] cc.Sprite`);
  console.log(`  [${idLbNode}] cc.Node   lbCount`);
  console.log(`  [${idLbLabel}] cc.Label`);
  console.log(`  [${idComp}] ${badgeCid}  (QuestBadge, autoOpenPopup=true, autoHide=false)`);
  console.log('');

  // ── Tu kiem truoc khi ghi ────────────────────────────────────
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
  [badgeNode, badgeSprite, lbNode, lbLabel, comp].forEach((o, i) => walk(o, `moi[${i}]`));

  if (badgeSprite.node.__id__ !== idBadgeNode) errors.push('badgeSprite.node sai');
  if (lbLabel.node.__id__ !== idLbNode) errors.push('lbLabel.node sai');
  if (comp.node.__id__ !== hostIdx) errors.push('comp.node sai');
  if (badgeNode._parent.__id__ !== hostIdx) errors.push('badgeNode._parent sai');
  if (lbNode._parent.__id__ !== idBadgeNode) errors.push('lbNode._parent sai');

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
