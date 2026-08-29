/**
 * taixiumd5-dice-spine.js — tra 3 xuc xac cua Tai Xiu MD5 ve dang Spine.
 *
 *   node tools/prefab/taixiumd5-dice-spine.js          (xem truoc)
 *   node tools/prefab/taixiumd5-dice-spine.js --write  (ghi that)
 *
 * MD5 KHAC TAI XIU THUONG — DUNG BE NGUYEN CACH LAM CUA TAIXIU
 * -----------------------------------------------------------
 * Tai Xiu thuong: tung xuc xac DE ra ket qua (clip bay 2.4s roi dung o mat do).
 * MD5 nguoc lai: ket qua hien NGAY, con man lac xuc xac thuoc ve DAU PHIEN MOI.
 * Vi vay o day chi gan lai 3 sp.Skeleton; phan dieu khien nam trong
 * TaiXiuMd5ResultView.js (applyDiceFaces day kim doc toi cuoi clip bay, va
 * playShakeNewSession() goi o state BETTING).
 *
 * Spine lac (node 'effect' -> skeletons/diceSpine) GIU NGUYEN, khong doi.
 *
 * BA NODE DEU TEN 'Dice1v'
 * ------------------------
 * Ban goc dat trung ten ca ba. Khong tim theo ten duoc — phai lay theo THU TU
 * con cua node cha 'vn1102-dice'. Thu tu do khop voi Dice1/Dice2/Dice3 trong
 * ban goc (xac nhan bang defaultAnimation 1/2/3 cua prefab goc trong ClientBACKUP).
 *
 * THONG SO LAY TU BAN GOC ClientBACKUP/assets/resources/taixiumd5/prefabs:
 *   scale 0.32 (khac taixiu thuong dung 0.31), premultipliedAlpha=false ca ba.
 * Toa do node giu nguyen ban dev, khong dong toi.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const Backup = require('./lib/backup');

const ASSETS = path.resolve(__dirname, '..', '..', 'assets');
const PREFAB = path.join(ASSETS, 'taixiumd5', 'prefabs', 'taixiuMd5View.prefab');

const WRITE = process.argv.includes('--write');

/** Spine dice rieng cua bundle taixiumd5, uuid do copy-spine-asset.js sinh. */
const XINGAU_UUID = JSON.parse(
  fs.readFileSync(path.join(__dirname, '.xingauA2-taixiumd5-uuid.json'), 'utf8')
).json;

const SPINE_MATERIAL = '7afd064b-113f-480e-b793-8817d19f63c3';

/** defaultAnimation chi la tu the xem truoc trong editor; runtime goi 'xi ngau bay N'. */
const DICE_ANIMS = [1, 2, 3];

/** 3 node sprite tinh duoi result-Dice — chi TAT, khong xoa. */
const STATIC_DICE = ['1', '2', '3'];

const raw = fs.readFileSync(PREFAB, 'utf8');
const d = JSON.parse(raw);
const objsBefore = d.length;
const deref = (r) => (r && typeof r === 'object' && '__id__' in r ? d[r.__id__] : null);

function die(msg) {
  console.error('DUNG: ' + msg);
  process.exit(1);
}

function findNode(name, parentName) {
  const hits = d.filter((o) => {
    if (o.__type__ !== 'cc.Node' || o._name !== name) return false;
    const p = deref(o._parent);
    return p && p._name === parentName;
  });
  if (hits.length !== 1) die(`tim thay ${hits.length} node "${name}" duoi "${parentName}", mong doi 1`);
  return hits[0];
}

const container = findNode('vn1102-dice', 'result-sprite');
const diceNodes = container._children.map(deref).filter((n) => n._name === 'Dice1v');
if (diceNodes.length !== 3) die(`vn1102-dice co ${diceNodes.length} node Dice1v, mong doi 3`);

const resultView = d.find((o) => String(o.__type__) === '31233FAsMVA85fIiyXwP3IM');
if (!resultView) die('khong tim thay component TaiXiumd5ResultView trong prefab');

console.log(WRITE ? '== GHI THAT ==' : '== XEM TRUOC (them --write de ghi) ==');
console.log('prefab  :', path.relative(ASSETS, PREFAB));
console.log('xingauA2:', XINGAU_UUID);
console.log('');

// -- 1. Gan sp.Skeleton cho 3 node Dice1v ---------------------------
const diceCompIds = [];
diceNodes.forEach((n, i) => {
  if (n._components.length) die(`Dice1v thu ${i + 1} da co ${n._components.length} component — tool chi lap vao node rong`);

  const comp = {
    __type__: 'sp.Skeleton',
    _name: '',
    _objFlags: 0,
    node: { __id__: d.indexOf(n) },
    _enabled: true,
    _materials: [{ __uuid__: SPINE_MATERIAL }],
    paused: false,
    defaultSkin: 'default',
    defaultAnimation: DICE_ANIMS[i],
    _preCacheMode: 0,
    _cacheMode: 0,
    loop: true,
    premultipliedAlpha: false,
    timeScale: 1,
    _accTime: 0,
    _playCount: 0,
    _frameCache: null,
    _curFrame: null,
    _skeletonCache: null,
    _animationName: DICE_ANIMS[i],
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
    `  + sp.Skeleton -> Dice1v[${i}] (id ${cid})  anim="${DICE_ANIMS[i]}"  pos(${t[0]}, ${t[1]}) scale ${t[7]}`
  );
});

// -- 2. Tat 3 node sprite tinh --------------------------------------
for (const name of STATIC_DICE) {
  const n = findNode(name, 'result-Dice');
  n._active = false;
  console.log(`  - node sprite tinh "${name}" -> _active = false (giu lai, don sau)`);
}

// -- 3. Cap nhat property cua component -----------------------------
for (const dead of ['spDice', 'sfDices']) {
  if (dead in resultView) {
    delete resultView[dead];
    console.log(`  - bo property "${dead}" (script khong con khai bao)`);
  }
}
resultView.xnAnimation = diceCompIds.map((id) => ({ __id__: id }));
console.log(`  + xnAnimation = 3 Spine xuc xac -> ids ${diceCompIds.join(', ')}`);
console.log('  = giu nguyen xnEffect (spine lac) va diceShakeAnimName');

const out = JSON.stringify(d, null, 2);
console.log(`\nobjs: ${objsBefore} -> ${d.length}   bytes: ${raw.length} -> ${out.length}`);

if (WRITE) {
  console.log('backup:', Backup.save(PREFAB, raw));
  fs.writeFileSync(PREFAB, out, 'utf8');
  console.log('Da ghi prefab.');
} else {
  console.log('(chua ghi)');
}
