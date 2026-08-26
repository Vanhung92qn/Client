/**
 * trace-prefab.js — mot prefab con song hay da chet?
 *
 *   node tools/prefab/trace-prefab.js <duong/dan/prefab.prefab> [...]
 *   node tools/prefab/trace-prefab.js --all-portal
 *
 * Voi moi prefab, lan theo bon manh moi:
 *
 *   1. Script gan tren no la file nao (giai nguoc cid -> uuid -> .js)
 *   2. Ai require script do
 *   3. Ai nhac toi uuid cua prefab (scene, prefab khac, code)
 *   4. Ai nhac toi TEN prefab trong code (load theo duong dan chuoi)
 *
 * Khong manh moi nao = gan nhu chac chan da chet. Co manh moi thi in ra
 * de nguoi doc tu ket luan — tool khong tu xoa gi.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const P = require('./lib/cocos-prefab');
const A = require('./lib/assets');

const ROOT = A.ASSETS_ROOT;

// ── Quet mot lan toan bo project ────────────────────────────────

/** uuid -> duong dan tuong doi (khong duoi .meta) */
const uuidToPath = Object.create(null);
/** cid -> duong dan script */
const cidToScript = Object.create(null);

const allFiles = [];

(function walk(d) {
  for (const name of fs.readdirSync(d)) {
    const p = path.join(d, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) { walk(p); continue; }

    allFiles.push(p);

    // continue chu khong phai return: return o day thoat ca vong lap va
    // bo sot moi file con lai trong thu muc
    if (!name.endsWith('.meta')) continue;
    try {
      const m = JSON.parse(fs.readFileSync(p, 'utf8'));
      const rel = path.relative(ROOT, p).replace(/\.meta$/, '').split(path.sep).join('/');
      if (m.uuid) {
        uuidToPath[m.uuid] = rel;
        if (rel.endsWith('.js')) cidToScript[P.compressUuid(m.uuid)] = rel;
      }
      for (const k of Object.keys(m.subMetas || {})) {
        if (m.subMetas[k].uuid) uuidToPath[m.subMetas[k].uuid] = rel + '#' + k;
      }
    } catch (e) { /* .meta hong khong phai viec cua tool nay */ }
  }
})(ROOT);

const jsFiles = allFiles.filter((f) => f.endsWith('.js') && !f.includes('node_modules'));
const sceneFiles = allFiles.filter((f) => f.endsWith('.fire'));
const prefabFiles = allFiles.filter((f) => f.endsWith('.prefab'));

/** Doc file mot lan roi giu lai — quet nhieu prefab thi khoi doc lai. */
const cache = Object.create(null);
function read(p) {
  if (!(p in cache)) cache[p] = fs.readFileSync(p, 'utf8');
  return cache[p];
}

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join('/');
}

// ── Phan tich mot prefab ────────────────────────────────────────

function trace(prefabRel) {
  const abs = path.join(ROOT, prefabRel);
  if (!fs.existsSync(abs)) {
    console.log(`\n${prefabRel}\n  KHONG TON TAI`);
    return;
  }

  const raw = read(abs);
  const arr = JSON.parse(raw);

  const metaPath = abs + '.meta';
  const uuid = fs.existsSync(metaPath)
    ? JSON.parse(fs.readFileSync(metaPath, 'utf8')).uuid
    : null;

  console.log('\n' + '─'.repeat(70));
  console.log(prefabRel);
  console.log('─'.repeat(70));
  console.log(`  ${arr.length} doi tuong, ${arr.filter((o) => o && o.__type__ === 'cc.Node').length} node`);

  // 1. Script gan tren prefab
  const scripts = new Set();
  for (const o of arr) {
    if (!o || !o.__type__) continue;
    if (o.__type__.startsWith('cc.') || o.__type__.startsWith('sp.')) continue;
    const s = cidToScript[o.__type__];
    scripts.add(s ? s : `(khong tim thay script cho cid ${o.__type__})`);
  }
  console.log(`\n  SCRIPT GAN TREN PREFAB (${scripts.size}):`);
  if (!scripts.size) console.log('    (khong co — prefab thuan hinh anh)');
  for (const s of scripts) console.log(`    ${s}`);

  // 2. Ai require script do
  console.log('\n  AI REQUIRE SCRIPT DO:');
  let anyRequire = false;
  for (const s of scripts) {
    if (s.startsWith('(')) continue;
    const base = path.basename(s, '.js');
    const users = [];
    for (const f of jsFiles) {
      if (rel(f) === s) continue;
      const txt = read(f);
      if (new RegExp(`require\\(['"\`]${base}['"\`]\\)`).test(txt)
        || new RegExp(`getComponent\\(['"\`]${base}['"\`]\\)`).test(txt)) {
        users.push(rel(f));
      }
    }
    if (users.length) {
      anyRequire = true;
      console.log(`    ${base}:`);
      for (const u of users) console.log(`      <- ${u}`);
    } else {
      console.log(`    ${base}:  KHONG AI require/getComponent`);
    }
  }
  if (!scripts.size) console.log('    (khong co script)');

  // 3. Ai nhac toi uuid cua prefab
  console.log('\n  AI THAM CHIEU UUID PREFAB NAY:');
  let anyUuid = false;
  if (uuid) {
    for (const f of [...sceneFiles, ...prefabFiles, ...jsFiles]) {
      if (rel(f) === prefabRel) continue;
      if (read(f).includes(uuid)) {
        anyUuid = true;
        console.log(`    <- ${rel(f)}`);
      }
    }
    if (!anyUuid) console.log('    KHONG AI tham chieu');
  } else {
    console.log('    (khong doc duoc uuid — thieu .meta)');
  }

  // 4. Ai nhac toi TEN prefab (load theo duong dan chuoi)
  const nameNoExt = path.basename(prefabRel, '.prefab');
  console.log(`\n  AI NHAC TEN "${nameNoExt}" TRONG CODE:`);
  let anyName = false;
  for (const f of jsFiles) {
    const txt = read(f);
    if (txt.includes(nameNoExt)) {
      anyName = true;
      const line = txt.split('\n').findIndex((l) => l.includes(nameNoExt)) + 1;
      console.log(`    <- ${rel(f)}:${line}`);
    }
  }
  if (!anyName) console.log('    KHONG AI nhac toi');

  // ── Ket luan tho ──────────────────────────────────────────────
  console.log('\n  => ' + (
    (anyUuid || anyName || anyRequire)
      ? 'CON MANH MOI — doc ky phan tren truoc khi ket luan'
      : 'KHONG MANH MOI NAO — gan nhu chac chan da chet'
  ));
}

// ── Chay ────────────────────────────────────────────────────────

let targets = process.argv.slice(2);

if (targets[0] === '--all-portal') {
  targets = prefabFiles
    .map(rel)
    .filter((p) => p.startsWith('prefabs/portal/'));
}

if (!targets.length) {
  console.log('Dung: node tools/prefab/trace-prefab.js <prefab> [...] | --all-portal');
  process.exit(1);
}

console.log(`Quet ${jsFiles.length} file .js, ${sceneFiles.length} scene, ${prefabFiles.length} prefab\n`);
for (const t of targets) trace(t.split(path.sep).join('/'));
console.log('');
