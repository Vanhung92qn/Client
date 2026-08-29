/**
 * taixiu-dice-spine.js — tra 3 con xuc xac cua Tai Xiu ve dang Spine.
 *
 *   node tools/prefab/taixiu-dice-spine.js          (xem truoc, khong ghi)
 *   node tools/prefab/taixiu-dice-spine.js --write  (ghi that)
 *
 * BOI CANH
 * --------
 * Ban dau Tai Xiu tung xuc xac bang Spine: 3 node Dice1/2/3 moi node mot
 * sp.Skeleton "xingauA2", ket qua duoc goi bang TEN ANIMATION —
 * setAnimation(0, "xi ngau bay <mat>", false) — anim dai 2.4s va dung dung mat
 * do. Trong qua trinh dev no bi doi sang anh tinh: component sp.Skeleton bi go
 * khoi Dice1/2/3 (node van con, van dung size 322.37x372.36 va scale 0.31), va
 * them 3 node sprite ten "1"/"2"/"3".
 *
 * Tool nay lap lai phan da bi go. Doi chieu voi HAI ban mau:
 *   - ClientBACKUP/assets/resources/taixiu/prefabs/taixiuView.prefab (ban goc)
 *   - assets/taixiusieutoc/prefabs/taiXiuSieuTocView.prefab (clone, dang LIVE)
 * Hai ban giong het nhau tung thong so, ke ca cho khong nhat quan (xem PMA).
 *
 * VI TRI NODE effect
 * ------------------
 * Ban goc dat cum dice thap hon ban dev 61.3px theo y (reskin da keo cum dice
 * len). Giu nguyen toa do dice cua ban dev, chi tinh lai cho cho node effect
 * theo DO LECH so voi trong tam cum dice trong ban goc:
 *
 *     ban goc : trong tam (-1.166, -68.5), effect (0, -91)  -> lech (+1.166, -22.5)
 *     ban dev : trong tam (-2.779, -7.201)                  -> effect (-1.613, -29.701)
 *
 * PMA (premultipliedAlpha) — KHONG PHAI GO NHAM
 * ---------------------------------------------
 * Ban goc dat Dice1=true, Dice2=true, Dice3=false. Atlas xingauA2 khong co co
 * "pma: true" nen ve ky thuat ca ba deu nen la false. Tool giu Y NGUYEN gia tri
 * ban goc de khong lam thay doi hinh anh so voi truoc; muon dong bo thi sua
 * DICE[].pma ben duoi thanh false ca ba roi chay lai.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const Backup = require('./lib/backup');

const ASSETS = path.resolve(__dirname, '..', '..', 'assets');
const PREFAB = path.join(ASSETS, 'taixiu', 'prefabs', 'taixiuView.prefab');

const WRITE = process.argv.includes('--write');

/** Spine dice rieng cua bundle taixiu (khong dung chung voi minigame_ui). */
const XINGAU_UUID = '0e5e6a02-0227-4363-8b74-a045cbbe748f';

/** Spine hao quang vua nhan ban sang bundle taixiu, uuid do copy-effect-spine.js sinh. */
const EFFECT_UUID = JSON.parse(
  fs.readFileSync(path.join(__dirname, '.effect-uuid.json'), 'utf8')
).json;

/** Material spine dung san trong engine. */
const SPINE_MATERIAL = '7afd064b-113f-480e-b793-8817d19f63c3';

/** defaultAnimation la tu the TINH (dai 0s) hien mat luc chua tung. */
const DICE = [
  { node: 'Dice1', anim: 1, pma: true },
  { node: 'Dice2', anim: 2, pma: true },
  { node: 'Dice3', anim: 3, pma: false },
];

/** 3 node sprite tinh — chi TAT, khong xoa (user tu don sau). */
const STATIC_DICE = ['1', '2', '3'];

const EFFECT_NODE = {
  size: { width: 1347.04, height: 1545.94 },
  pos: { x: -1.613, y: -29.701 },
  scale: { x: 0.25, y: 0.3 },
};

// -------------------------------------------------------------------

const raw = fs.readFileSync(PREFAB, 'utf8');
const d = JSON.parse(raw);
const objsBefore = d.length;
const deref = (r) => (r && typeof r === 'object' && '__id__' in r ? d[r.__id__] : null);
const idOf = (o) => d.indexOf(o);

function die(msg) {
  console.error('DUNG: ' + msg);
  process.exit(1);
}

/** Tim node theo ten + ten node cha, tranh trung ten o cho khac trong prefab. */
function findNode(name, parentName) {
  const hits = d.filter((o) => {
    if (o.__type__ !== 'cc.Node' || o._name !== name) return false;
    const p = deref(o._parent);
    return p && p._name === parentName;
  });
  if (hits.length !== 1) {
    die('tim thay ' + hits.length + ' node "' + name + '" duoi "' + parentName + '", mong doi dung 1');
  }
  return hits[0];
}

const effectNode = findNode('effect', 'result-Dice');

const resultView = d.find((o) => String(o.__type__).startsWith('450ba'));
if (!resultView) die('khong tim thay component TaiXiuResultView (uuid 450ba090...) trong prefab');

console.log(WRITE ? '== GHI THAT ==' : '== XEM TRUOC (them --write de ghi) ==');
console.log('prefab  :', path.relative(ASSETS, PREFAB));
console.log('xingauA2:', XINGAU_UUID);
console.log('effect  :', EFFECT_UUID);
console.log('');

// -- 1. Gan lai sp.Skeleton cho Dice1/2/3 ---------------------------
const diceCompIds = [];
for (const spec of DICE) {
  const n = findNode(spec.node, 'result-Dice');
  if (n._components.length) {
    die(spec.node + ' da co san ' + n._components.length + ' component — tool nay chi lap vao node rong');
  }

  const comp = {
    __type__: 'sp.Skeleton',
    _name: '',
    _objFlags: 0,
    node: { __id__: idOf(n) },
    _enabled: true,
    _materials: [{ __uuid__: SPINE_MATERIAL }],
    paused: false,
    defaultSkin: 'default',
    defaultAnimation: spec.anim,
    _preCacheMode: 0,
    _cacheMode: 0,
    loop: true,
    premultipliedAlpha: spec.pma,
    timeScale: 1,
    _accTime: 0,
    _playCount: 0,
    _frameCache: null,
    _curFrame: null,
    _skeletonCache: null,
    _animationName: spec.anim,
    _animationQueue: [],
    _headAniInfo: null,
    _playTimes: 0,
    _isAniComplete: true,
    _N$skeletonData: { __uuid__: XINGAU_UUID },
    _N$_defaultCacheMode: 0,
    _N$debugSlots: false,
    _N$debugBones: false,
    _N$debugMesh: false,
    _N$useTint: false,
    _N$enableBatch: false,
    _id: '',
  };

  const cid = d.push(comp) - 1;
  n._components.push({ __id__: cid });
  diceCompIds.push(cid);

  const t = n._trs.array;
  console.log(
    '  + sp.Skeleton -> ' + spec.node + ' (id ' + cid + ')  anim="' + spec.anim +
    '" pma=' + spec.pma + '  pos(' + t[0] + ', ' + t[1] + ') scale ' + t[7]
  );
}

// -- 2. Doi node effect: spine xoc bat -> spine hao quang -----------
const effectComp = deref(effectNode._components[0]);
if (!effectComp || effectComp.__type__ !== 'sp.Skeleton') die('node effect khong co sp.Skeleton');

const oldEffectSpine = effectComp._N$skeletonData.__uuid__;
effectComp._N$skeletonData = { __uuid__: EFFECT_UUID };
effectComp.defaultAnimation = 'effect';
effectComp._animationName = 'effect';
effectComp.premultipliedAlpha = false;
effectComp.loop = true;

effectNode._contentSize.width = EFFECT_NODE.size.width;
effectNode._contentSize.height = EFFECT_NODE.size.height;
effectNode._trs.array[0] = EFFECT_NODE.pos.x;
effectNode._trs.array[1] = EFFECT_NODE.pos.y;
effectNode._trs.array[7] = EFFECT_NODE.scale.x;
effectNode._trs.array[8] = EFFECT_NODE.scale.y;

console.log('  ~ effect: spine ' + oldEffectSpine + ' (xoc bat) -> ' + EFFECT_UUID + ' (hao quang)');
console.log(
  '            anim "animation" -> "effect", pos(' + EFFECT_NODE.pos.x + ', ' + EFFECT_NODE.pos.y +
  ') scale(' + EFFECT_NODE.scale.x + ', ' + EFFECT_NODE.scale.y + ')'
);

// -- 3. Tat 3 node sprite tinh --------------------------------------
for (const name of STATIC_DICE) {
  const n = findNode(name, 'result-Dice');
  n._active = false;
  console.log('  - node sprite tinh "' + name + '" -> _active = false (giu lai, user tu xoa sau)');
}

// -- 4. Cap nhat property cua TaiXiuResultView ----------------------
for (const dead of ['spDice', 'sfDices', 'diceShakeAnimName']) {
  if (dead in resultView) {
    delete resultView[dead];
    console.log('  - bo property "' + dead + '" (script khong con khai bao)');
  }
}
resultView.xnAnimation = diceCompIds.map((id) => ({ __id__: id }));
console.log('  + xnAnimation = [Dice1, Dice2, Dice3] -> ids ' + diceCompIds.join(', '));

// -- Ghi ------------------------------------------------------------
const out = JSON.stringify(d, null, 2);
console.log('\nobjs: ' + objsBefore + ' -> ' + d.length + '   bytes: ' + raw.length + ' -> ' + out.length);

if (WRITE) {
  console.log('backup:', Backup.save(PREFAB, raw));
  fs.writeFileSync(PREFAB, out, 'utf8');
  console.log('Da ghi prefab.');
} else {
  console.log('(chua ghi)');
}
