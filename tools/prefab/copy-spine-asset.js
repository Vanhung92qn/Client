/**
 * copy-spine-asset.js — nhan ban mot thu muc spine (.json/.atlas/.png) sang
 * bundle khac, cap uuid MOI cho ban sao.
 *
 *   node tools/prefab/copy-spine-asset.js <thu-muc-nguon> <thu-muc-dich>
 *   node tools/prefab/copy-spine-asset.js <nguon> <dich> --write
 *
 * Duong dan tinh tu assets/. Vi du:
 *   node tools/prefab/copy-spine-asset.js taixiu/skeletons/xingauA2 taixiumd5/skeletons/xingauA2 --write
 *
 * VI SAO CAP UUID MOI THAY VI DUNG CHUNG
 * --------------------------------------
 * Moi game reskin rieng. Neu hai bundle cung tro vao mot spine thi doi art cho
 * game nay se keo theo game kia. Ban sao co uuid rieng = tu chua, doi duoc rieng,
 * va bundle khong phu thuoc thu tu load. Gia phai tra la dung luong nhan doi.
 *
 * UUID VIET TAY CO AN TOAN KHONG — CO, DA KIEM CHUNG THAT
 * ------------------------------------------------------
 * Cocos chi sinh uuid khi THIEU .meta. Lan nhan ban spine "effect" sang bundle
 * taixiu, sau khi mo Cocos Creator len va re-save prefab, uuid viet tay van
 * nguyen ven. Dieu kien: .meta phai dung `ver`/`importer` nhu Cocos tu ghi, va
 * ghi UTF-8 khong BOM.
 *
 * Nho: .meta cap thu muc la file RIENG nam NGOAI thu muc (vd xingauA2.meta nam
 * canh xingauA2/), rat de sot khi git add.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { uuid4 } = require('./lib/cocos-prefab');

const ASSETS = path.resolve(__dirname, '..', '..', 'assets');

const args = process.argv.slice(2).filter((a) => a !== '--write');
const WRITE = process.argv.includes('--write');

if (args.length !== 2) {
  console.error('Dung: node tools/prefab/copy-spine-asset.js <nguon> <dich> [--write]');
  console.error('  duong dan tinh tu assets/, vd: taixiu/skeletons/xingauA2 taixiumd5/skeletons/xingauA2');
  process.exit(1);
}

const SRC = path.join(ASSETS, args[0]);
const DST = path.join(ASSETS, args[1]);
const DST_FOLDER_META = DST + '.meta';

if (!fs.existsSync(SRC)) {
  console.error('DUNG: khong thay thu muc nguon ' + SRC);
  process.exit(1);
}
if (fs.existsSync(DST)) {
  console.error('DUNG: thu muc dich da ton tai, khong ghi de. Xoa tay roi chay lai.');
  process.exit(1);
}

/** Ten spine = ten file .json trong thu muc nguon. */
const jsonFile = fs.readdirSync(SRC).find((f) => f.endsWith('.json') && !f.endsWith('.meta'));
if (!jsonFile) {
  console.error('DUNG: thu muc nguon khong co file .json');
  process.exit(1);
}
const base = jsonFile.slice(0, -'.json'.length);

const pngFile = base + '.png';
const atlasFile = base + '.atlas';
for (const f of [pngFile, atlasFile]) {
  if (!fs.existsSync(path.join(SRC, f))) {
    console.error('DUNG: thieu ' + f + ' trong thu muc nguon');
    process.exit(1);
  }
}

const newJsonUuid = uuid4();
const newAtlasUuid = uuid4();
const newTexUuid = uuid4();
const newFolderUuid = uuid4();

/** .meta cua png: giu nguyen moi thong so import, chi thay uuid (ke ca sprite-frame con). */
const pngMeta = JSON.parse(fs.readFileSync(path.join(SRC, pngFile + '.meta'), 'utf8'));
pngMeta.uuid = newTexUuid;
for (const k of Object.keys(pngMeta.subMetas || {})) {
  pngMeta.subMetas[k].uuid = uuid4();
  pngMeta.subMetas[k].rawTextureUuid = newTexUuid;
}

/** .meta cua json: giu ver/importer cua ban nguon de Cocos khong nang cap importer. */
const srcJsonMeta = JSON.parse(fs.readFileSync(path.join(SRC, jsonFile + '.meta'), 'utf8'));
const jsonMeta = Object.assign({}, srcJsonMeta, { uuid: newJsonUuid, textures: [newTexUuid] });

const srcAtlasMeta = JSON.parse(fs.readFileSync(path.join(SRC, atlasFile + '.meta'), 'utf8'));
const atlasMeta = Object.assign({}, srcAtlasMeta, { uuid: newAtlasUuid });

/** Thu muc thuong, KHONG phai bundle. */
const folderMeta = {
  ver: '1.1.3',
  uuid: newFolderUuid,
  importer: 'folder',
  isBundle: false,
  bundleName: '',
  priority: 1,
  compressionType: {},
  optimizeHotUpdate: {},
  inlineSpriteFrames: {},
  isRemoteBundle: {},
  subMetas: {},
};

console.log(WRITE ? '== GHI THAT ==' : '== XEM TRUOC (them --write de ghi) ==');
console.log('nguon:', args[0]);
console.log('dich :', args[1]);
console.log('spine:', base);
console.log('uuid moi: json=%s atlas=%s tex=%s', newJsonUuid, newAtlasUuid, newTexUuid);

if (WRITE) fs.mkdirSync(DST, { recursive: true });

const plan = [
  [jsonFile, null],
  [atlasFile, null],
  [pngFile, null],
  [jsonFile + '.meta', JSON.stringify(jsonMeta, null, 2)],
  [atlasFile + '.meta', JSON.stringify(atlasMeta, null, 2)],
  [pngFile + '.meta', JSON.stringify(pngMeta, null, 2)],
];

for (const [name, content] of plan) {
  const dest = path.join(DST, name);
  if (content === null) {
    console.log('  copy  ' + name.padEnd(20) + ' ' + fs.statSync(path.join(SRC, name)).size + ' bytes');
    if (WRITE) fs.copyFileSync(path.join(SRC, name), dest);
  } else {
    console.log('  write ' + name.padEnd(20) + ' (meta moi)');
    if (WRITE) fs.writeFileSync(dest, content, 'utf8');
  }
}
console.log('  write ' + (path.basename(DST) + '.meta').padEnd(20) + ' (meta thu muc, nam NGOAI thu muc)');
if (WRITE) fs.writeFileSync(DST_FOLDER_META, JSON.stringify(folderMeta, null, 2), 'utf8');

if (WRITE) {
  const out = path.join(__dirname, '.' + path.basename(DST) + '-' + path.basename(path.dirname(path.dirname(DST))) + '-uuid.json');
  fs.writeFileSync(out, JSON.stringify({ json: newJsonUuid, atlas: newAtlasUuid, texture: newTexUuid }, null, 2), 'utf8');
  console.log('\nDa ghi. uuid luu tai ' + path.relative(path.resolve(__dirname, '..', '..'), out));
}
