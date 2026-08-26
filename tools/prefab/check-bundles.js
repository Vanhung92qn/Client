/**
 * check-bundles.js — liet ke prefab phu thuoc vao nhung bundle nao.
 *
 *   node tools/prefab/check-bundles.js <thu-muc-prefab>
 *   node tools/prefab/check-bundles.js prefabs/portal/Lixi
 *
 * Vi sao can: prefab nam o bundle nay ma dung anh o bundle khac thi lan
 * dau mo Cocos phai di tai bundle kia — chu ve ngay con anh ve sau, nhin
 * nhu man hinh vo. Cang it bundle phu thuoc cang do.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const A = require('./lib/assets');

const target = process.argv[2] || path.join('prefabs', 'portal', 'Lixi');
const dir = path.join(A.ASSETS_ROOT, target);

// ── Tra nguoc uuid -> duong dan ──────────────────────────────────
const map = Object.create(null);
(function walk(d) {
  for (const name of fs.readdirSync(d)) {
    const p = path.join(d, name);
    if (fs.statSync(p).isDirectory()) { walk(p); continue; }
    if (!name.endsWith('.meta')) continue;
    try {
      const m = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (m.uuid) map[m.uuid] = p;
      for (const k of Object.keys(m.subMetas || {})) {
        if (m.subMetas[k].uuid) map[m.subMetas[k].uuid] = p;
      }
    } catch (e) { /* .meta hong khong phai viec cua tool nay */ }
  }
})(A.ASSETS_ROOT);

// ── Bundle cua tung thu muc goc trong assets/ ───────────────────
const bundleOf = Object.create(null);
for (const name of fs.readdirSync(A.ASSETS_ROOT)) {
  const metaPath = path.join(A.ASSETS_ROOT, name + '.meta');
  if (!fs.existsSync(metaPath)) continue;
  try {
    const m = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    bundleOf[name] = m.isBundle ? (m.bundleName || name) : '(main package)';
  } catch (e) { /* bo qua */ }
}

// ── Quet prefab ──────────────────────────────────────────────────
const files = fs.readdirSync(dir, { recursive: true })
  .filter((f) => typeof f === 'string' && f.endsWith('.prefab'));

const byBundle = Object.create(null);

for (const f of files) {
  const raw = fs.readFileSync(path.join(dir, f), 'utf8');
  const uuids = new Set();
  // JSON da format nen co khoang trang sau dau hai cham
  raw.replace(/"__uuid__"\s*:\s*"([^"]+)"/g, (m, u) => { uuids.add(u); return m; });

  for (const u of uuids) {
    const p = map[u];
    if (!p) continue;
    const rel = path.relative(A.ASSETS_ROOT, p).split(path.sep);
    const root = rel[0];
    const bundle = bundleOf[root] || root;
    if (!byBundle[bundle]) byBundle[bundle] = new Set();
    byBundle[bundle].add(rel.join('/').replace(/\.meta$/, ''));
  }
}

console.log(`${target} phu thuoc ${Object.keys(byBundle).length} bundle:\n`);
for (const b of Object.keys(byBundle).sort()) {
  console.log(`  [${b}]  ${byBundle[b].size} tep`);
  for (const f of [...byBundle[b]].sort()) console.log(`      ${f}`);
  console.log('');
}
