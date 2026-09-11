/**
 * ts.js — sinh component TypeScript cho Cocos Creator 2.4.10 + tra cid de gan
 * vao .prefab.
 *
 * VI SAO CAN FILE NAY
 * Prefab khong tham chieu script bang duong dan hay ten lop, ma bang "cid" —
 * dang nen cua uuid nam trong file .meta di kem. Muon sinh prefab co san script
 * gan vao thi phai:
 *   1. co uuid on dinh cho tung script  (doi uuid = dut moi tham chieu, IM LANG)
 *   2. nen uuid do thanh cid dung cach
 *
 * TYPESCRIPT KHAC JAVASCRIPT DUNG MOT CHU
 * Do tren file that trong project:
 *     ShootFish.Fish.ts.meta  ->  "importer": "typescript"
 *     PhoenixView.js.meta     ->  "importer": "javascript"
 * Moi truong con lai giong het nhau, ke ca thu tu khoa. Nghia la bo sinh prefab
 * chay y nguyen du script la .js hay .ts.
 *
 * (Da doi chung: uuid 308d82b6-2ea1-443c-87d5-c313a1bde714 cua PhoenixView.js
 *  nen ra cid 308d8K2LqFEPIfVwxOhvecU — dung chuoi xuat hien trong
 *  PhoenixView.prefab. Mo rong ra 39 script: 32 cai co cid trong prefab, 7 cai
 *  con lai la script chua gan vao prefab nao.)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const P = require('./cocos-prefab');
const A = require('./assets');

/** Nen uuid -> cid de dat vao truong `__type__` cua component script. */
function cid(uuid) {
  return P.compressUuid(uuid);
}

/**
 * Noi dung .ts.meta. Giong scriptMeta() cua cocos-prefab nhung importer khac.
 * Thu tu khoa giu dung nhu file that de khong sinh diff thua.
 */
function metaTs(uuid) {
  return {
    ver: '1.1.0',
    uuid,
    importer: 'typescript',
    isPlugin: false,
    loadPluginInWeb: true,
    loadPluginInNative: true,
    loadPluginInEditor: false,
    subMetas: {},
  };
}

/** Doc uuid cua mot script da ton tai. Tra null neu chua co .meta. */
function readUuid(relDir, name, ext = '.ts') {
  const metaPath = path.join(A.ASSETS_ROOT, relDir, name + ext + '.meta');
  if (!fs.existsSync(metaPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8')).uuid || null;
  } catch (e) {
    return null;
  }
}

/**
 * Ghi mot component TypeScript va .meta cua no. IDEMPOTENT: chay lai giu nguyen
 * uuid cu, chi sinh uuid moi khi that su chua co.
 *
 * 🔴 THU TU GHI QUAN TRONG: ghi file .ts TRUOC, .meta SAU.
 * Log cua Creator (08/09) cho thay moi lan mo project no quet va DI CHUYEN
 * nhung .meta "mo coi" sang temp/RemovedMetas/ — da an 12 file nhu vay. Neu
 * .meta xuat hien truoc file noi dung thi Creator coi no la mo coi, nuot mat
 * uuid, va moi prefab tro toi script do dut lien ket ma khong bao gi.
 *
 * @param {string} relDir  duong dan tinh tu assets/, vd 'lobby/scripts/minigame/phoenix'
 * @param {string} name    ten lop = ten file, KHONG kem duoi .ts
 * @param {string} source  ma nguon TypeScript
 * @returns {{uuid:string, cid:string, created:boolean, rel:string}}
 */
function writeScript(relDir, name, source) {
  const dirAbs = path.join(A.ASSETS_ROOT, relDir);
  fs.mkdirSync(dirAbs, { recursive: true });

  const tsAbs = path.join(dirAbs, name + '.ts');
  const metaAbs = tsAbs + '.meta';

  const existing = readUuid(relDir, name);
  const uuid = existing || P.uuid4();

  P.writeSource(tsAbs, source); // (1) noi dung truoc
  P.writeCocosJson(metaAbs, metaTs(uuid)); // (2) .meta sau

  return {
    uuid,
    cid: cid(uuid),
    created: !existing,
    rel: path.join(relDir, name + '.ts').replace(/\\/g, '/'),
  };
}

/**
 * Tra bang { tenLop: cid } cho mot loat script DA TON TAI.
 * Nem loi ngay neu thieu — de bo sinh prefab khong bao gio gan nham cid rong.
 */
function registry(relDir, names) {
  const out = {};
  const missing = [];
  for (const n of names) {
    const u = readUuid(relDir, n) || readUuid(relDir, n, '.js');
    if (!u) missing.push(n);
    else out[n] = cid(u);
  }
  if (missing.length) {
    throw new Error(
      `THIEU SCRIPT (chua co .meta) trong ${relDir}:\n  ` + missing.join('\n  ')
    );
  }
  return out;
}

/**
 * Kiem mot file .ts co dung mot lop cc.Component khong.
 * Cocos 2.4 chi nhan MOT component moi file; file co hai lop thi lop thu hai bi
 * bo qua lang le va prefab tro toi no se mat component.
 */
function assertSingleComponent(source, name) {
  const n = (source.match(/extends\s+cc\.Component/g) || []).length;
  if (n !== 1) {
    throw new Error(
      `${name}.ts co ${n} lop "extends cc.Component" — Cocos 2.4 chi nhan dung 1 moi file.`
    );
  }
  if (!/@ccclass\s*\n\s*export\s+default\s+class/.test(source)) {
    throw new Error(
      `${name}.ts phai dung dang "@ccclass" (tran, khong tham so) + "export default class".`
    );
  }
}

module.exports = {
  cid,
  metaTs,
  readUuid,
  writeScript,
  registry,
  assertSingleComponent,
};
