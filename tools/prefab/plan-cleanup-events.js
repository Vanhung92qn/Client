/**
 * plan-cleanup-events.js — liet ke chinh xac nhung gi se bi xoa khi don
 * he su kien cu, VA canh bao cai nao con duoc dung o cho khac.
 *
 *   node tools/prefab/plan-cleanup-events.js
 *
 * Xoa la viec kho lui. Tool nay khong xoa gi — chi in ra ban ke, va quan
 * trong hon la chi ra cai nao KHONG duoc xoa vi con nguoi dung.
 *
 * Voi moi tep sap xoa, kiem hai dieu:
 *   - Scene co tham chieu khong (uuid hoac cid)
 *   - Co tep NGOAI danh sach xoa nao require/getComponent no khong
 *
 * Con nguoi dung tu ben ngoai = GIU LAI, khong thi xoa an toan.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const P = require('./lib/cocos-prefab');
const A = require('./lib/assets');

const ROOT = A.ASSETS_ROOT;

// ── Danh sach du dinh xoa ───────────────────────────────────────
const PREFABS = [
  'prefabs/portal/event/eventView-4.prefab',
  'prefabs/portal/event/fxSummonDragon.prefab',
  'prefabs/portal/x2/x2RewardView.prefab',
];

const SCRIPT_DIRS = [
  'lobby/scripts/portal/event',
  'lobby/scripts/portal/x2',
];

// ── Gom tep ─────────────────────────────────────────────────────
function listJs(dirRel) {
  const out = [];
  const abs = path.join(ROOT, dirRel);
  if (!fs.existsSync(abs)) return out;
  (function walk(d) {
    for (const n of fs.readdirSync(d)) {
      const p = path.join(d, n);
      if (fs.statSync(p).isDirectory()) { walk(p); continue; }
      if (n.endsWith('.js')) out.push(path.relative(ROOT, p).split(path.sep).join('/'));
    }
  })(abs);
  return out;
}

const scripts = SCRIPT_DIRS.flatMap(listJs);
const doomed = new Set([...PREFABS, ...scripts]);

// ── Quet toan bo project ────────────────────────────────────────
const allJs = [];
const allPrefab = [];
const allScene = [];
const uuidOf = Object.create(null);

(function walk(d) {
  for (const n of fs.readdirSync(d)) {
    const p = path.join(d, n);
    if (fs.statSync(p).isDirectory()) { walk(p); continue; }
    const r = path.relative(ROOT, p).split(path.sep).join('/');
    if (n.endsWith('.js')) allJs.push(r);
    else if (n.endsWith('.prefab')) allPrefab.push(r);
    else if (n.endsWith('.fire')) allScene.push(r);
    else if (n.endsWith('.meta')) {
      try {
        const m = JSON.parse(fs.readFileSync(p, 'utf8'));
        if (m.uuid) uuidOf[r.replace(/\.meta$/, '')] = m.uuid;
      } catch (e) { /* bo qua */ }
    }
  }
})(ROOT);

const cache = Object.create(null);
const read = (r) => (cache[r] !== undefined ? cache[r] : (cache[r] = fs.readFileSync(path.join(ROOT, r), 'utf8')));

// ── Kiem tung tep ───────────────────────────────────────────────
const safe = [];
const keep = [];

for (const f of doomed) {
  const base = path.basename(f).replace(/\.(js|prefab)$/, '');
  const uuid = uuidOf[f];
  const reasons = [];

  // Scene co tham chieu khong
  for (const s of allScene) {
    const txt = read(s);
    if (uuid && txt.includes(uuid)) reasons.push(`scene ${s} tham chieu uuid`);
    else if (uuid && txt.includes(P.compressUuid(uuid))) reasons.push(`scene ${s} gan script nay`);
  }

  // Prefab NGOAI danh sach xoa co tham chieu khong
  for (const pf of allPrefab) {
    if (doomed.has(pf)) continue;
    const txt = read(pf);
    if (uuid && (txt.includes(uuid) || txt.includes(P.compressUuid(uuid)))) {
      reasons.push(`prefab ${pf} dung`);
    }
  }

  // Ma NGOAI danh sach xoa co require khong
  if (f.endsWith('.js')) {
    for (const js of allJs) {
      if (doomed.has(js)) continue;
      const txt = read(js);
      if (new RegExp(`require\\(['"\`]${base}['"\`]\\)`).test(txt)
        || new RegExp(`getComponent\\((cc\\.)?['"\`]?${base}['"\`]?\\)`).test(txt)
        || new RegExp(`\\bcc\\.${base}\\b`).test(txt)) {
        reasons.push(`ma ${js} dung`);
      }
    }
  }

  if (reasons.length) keep.push({ f, reasons: [...new Set(reasons)] });
  else safe.push(f);
}

// ── In ──────────────────────────────────────────────────────────
console.log(`Du dinh xoa ${doomed.size} tep: ${PREFABS.length} prefab + ${scripts.length} script\n`);

console.log('═'.repeat(70));
console.log(`XOA AN TOAN — khong ai dung  (${safe.length} tep)`);
console.log('═'.repeat(70));
for (const f of safe.sort()) console.log('  ' + f);

console.log('');
console.log('═'.repeat(70));
console.log(`GIU LAI — con nguoi dung  (${keep.length} tep)`);
console.log('═'.repeat(70));
if (!keep.length) console.log('  (khong co)');
for (const k of keep.sort((a, b) => a.f.localeCompare(b.f))) {
  console.log('  ' + k.f);
  for (const r of k.reasons.slice(0, 3)) console.log('      vi ' + r);
  if (k.reasons.length > 3) console.log(`      ... va ${k.reasons.length - 3} cho khac`);
}
console.log('');
