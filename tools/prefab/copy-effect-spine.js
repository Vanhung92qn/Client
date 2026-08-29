/**
 * copy-effect-spine.js — nhan ban spine hao quang "effect" tu bundle
 * minigame_ui sang bundle taixiu.
 *
 *   node tools/prefab/copy-effect-spine.js          (xem truoc)
 *   node tools/prefab/copy-effect-spine.js --write  (ghi that)
 *
 * VI SAO NHAN BAN THAY VI DUNG CHUNG
 * ----------------------------------
 * User dang reskin rieng Tai Xiu. Neu tro thang vao minigame_ui/skeletons/effect
 * thi doi art hao quang se keo theo ca Tai Xiu Sieu Toc (dang LIVE). Ban sao
 * nam trong bundle taixiu -> doi rieng duoc, va bundle tu chua, khong phu thuoc
 * thu tu load bundle. Gia phai tra: 88KB (61KB json + 26KB png).
 *
 * UUID
 * ----
 * File .meta viet tay voi uuid moi. Cocos chi sinh uuid khi THIEU .meta, nen
 * .meta hop le se duoc giu nguyen — cung co che ma lib/cocos-prefab.js
 * (prefabMeta/imageMeta) van dung.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { uuid4 } = require('./lib/cocos-prefab');

const ASSETS = path.resolve(__dirname, '..', '..', 'assets');
const SRC = path.join(ASSETS, 'minigame_ui', 'skeletons', 'effect');
const DST = path.join(ASSETS, 'taixiu', 'skeletons', 'effect');
const DST_FOLDER_META = DST + '.meta';

const WRITE = process.argv.includes('--write');

const newJsonUuid = uuid4();
const newAtlasUuid = uuid4();
const newTexUuid = uuid4();
const newFrameUuid = uuid4();
const newFolderUuid = uuid4();

/** .meta cua png: giu nguyen moi thong so import, chi thay uuid. */
const srcPngMeta = JSON.parse(fs.readFileSync(path.join(SRC, 'effect.png.meta'), 'utf8'));
srcPngMeta.uuid = newTexUuid;
const frameKey = Object.keys(srcPngMeta.subMetas)[0];
srcPngMeta.subMetas[frameKey].uuid = newFrameUuid;
srcPngMeta.subMetas[frameKey].rawTextureUuid = newTexUuid;

const jsonMeta = {
  ver: '1.2.5',
  uuid: newJsonUuid,
  importer: 'spine',
  textures: [newTexUuid],
  scale: 1,
  subMetas: {},
};

const atlasMeta = { ver: '1.0.3', uuid: newAtlasUuid, importer: 'asset', subMetas: {} };

/** Thu muc thuong, KHONG phai bundle — bundle la assets/taixiu o tren. */
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

const plan = [
  ['effect.json', 'copy'],
  ['effect.atlas', 'copy'],
  ['effect.png', 'copy'],
  ['effect.json.meta', JSON.stringify(jsonMeta, null, 2)],
  ['effect.atlas.meta', JSON.stringify(atlasMeta, null, 2)],
  ['effect.png.meta', JSON.stringify(srcPngMeta, null, 2)],
];

console.log(WRITE ? '== GHI THAT ==' : '== XEM TRUOC (them --write de ghi) ==');
console.log('nguon:', path.relative(ASSETS, SRC));
console.log('dich :', path.relative(ASSETS, DST));
console.log('uuid moi: json=%s atlas=%s tex=%s frame=%s', newJsonUuid, newAtlasUuid, newTexUuid, newFrameUuid);

if (fs.existsSync(DST)) {
  console.error('DUNG: thu muc dich da ton tai, khong ghi de. Xoa tay roi chay lai.');
  process.exit(1);
}

if (WRITE) fs.mkdirSync(DST, { recursive: true });

for (const [name, what] of plan) {
  const dest = path.join(DST, name);
  if (what === 'copy') {
    const bytes = fs.statSync(path.join(SRC, name)).size;
    console.log('  copy  ' + name.padEnd(18) + ' ' + bytes + ' bytes');
    if (WRITE) fs.copyFileSync(path.join(SRC, name), dest);
  } else {
    console.log('  write ' + name.padEnd(18) + ' (meta moi)');
    if (WRITE) fs.writeFileSync(dest, what, 'utf8');
  }
}
console.log('  write ' + 'effect.meta'.padEnd(18) + ' (meta thu muc)');
if (WRITE) fs.writeFileSync(DST_FOLDER_META, JSON.stringify(folderMeta, null, 2), 'utf8');

if (WRITE) {
  fs.writeFileSync(
    path.join(__dirname, '.effect-uuid.json'),
    JSON.stringify({ json: newJsonUuid, atlas: newAtlasUuid, texture: newTexUuid, frame: newFrameUuid }, null, 2),
    'utf8'
  );
  console.log('\nDa ghi. uuid luu tai tools/prefab/.effect-uuid.json de buoc sua prefab dung lai.');
}
