/**
 * cleanup-events-scene.js — go he su kien cu khoi MainGame.fire.
 *
 *   node tools/prefab/cleanup-events-scene.js          (xem truoc)
 *   node tools/prefab/cleanup-events-scene.js --write  (ghi that)
 *
 * Ba viec:
 *   1. Go ba thuoc tinh tro toi prefab da xoa (prefabEvent, prefabX2Reward,
 *      prefabFxSummonDragon) — de lai thi scene tro toi uuid khong con,
 *      Cocos bao thieu tai nguyen khi mo project
 *   2. Tat nut btnMINIEvent — no chi de mo trung tam su kien vua xoa
 *   3. Bao cac uuid mo coi con sot (neu co)
 *
 * KHONG xoa node btnMINIEvent, chi tat: xoa node trong scene rui ro hon
 * nhieu, va co the ban con muon dung lai cho do cho viec khac.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const A = require('./lib/assets');

const SCENE = path.join(A.ASSETS_ROOT, 'lobby', 'scenes', 'MainGame.fire');
const WRITE = process.argv.includes('--write');

const PROPS = ['prefabEvent', 'prefabX2Reward', 'prefabFxSummonDragon'];

const raw = fs.readFileSync(SCENE, 'utf8');
const arr = JSON.parse(raw);

const actions = [];

// ── 1. Go thuoc tinh ────────────────────────────────────────────
for (const o of arr) {
  if (!o || typeof o !== 'object') continue;
  for (const p of PROPS) {
    if (o[p] !== undefined) {
      actions.push({
        desc: `go thuoc tinh ${p} (tro toi ${o[p] && o[p].__uuid__ ? o[p].__uuid__.slice(0, 8) + '...' : 'null'})`,
        run: () => { delete o[p]; },
      });
    }
  }
}

// ── 2. Tat nut btnMINIEvent ─────────────────────────────────────
const btnIdx = arr.findIndex(
  (o) => o && o.__type__ === 'cc.Node' && o._name === 'btnMINIEvent'
);
if (btnIdx >= 0 && arr[btnIdx]._active) {
  actions.push({
    desc: 'tat nut btnMINIEvent (chi de mo trung tam su kien vua xoa)',
    run: () => { arr[btnIdx]._active = false; },
  });
}

// ── 3. Tim uuid mo coi ──────────────────────────────────────────
const known = new Set();
(function walk(d) {
  for (const n of fs.readdirSync(d)) {
    const p = path.join(d, n);
    if (fs.statSync(p).isDirectory()) { walk(p); continue; }
    if (!n.endsWith('.meta')) continue;
    try {
      const m = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (m.uuid) known.add(m.uuid);
      for (const k of Object.keys(m.subMetas || {})) {
        if (m.subMetas[k].uuid) known.add(m.subMetas[k].uuid);
      }
    } catch (e) { /* bo qua */ }
  }
})(A.ASSETS_ROOT);

const orphans = new Set();
raw.replace(/"__uuid__"\s*:\s*"([^"]+)"/g, (m, u) => {
  if (!known.has(u)) orphans.add(u);
  return m;
});

console.log(`${actions.length} viec se lam:\n`);
for (const a of actions) console.log('  - ' + a.desc);

if (orphans.size) {
  console.log(`\n${orphans.size} uuid mo coi trong scene (tai nguyen khong con):`);
  for (const u of [...orphans].slice(0, 10)) console.log('    ' + u);
  console.log('  (mot so la material dung san cua Cocos, nam trong engine — binh thuong)');
}

if (!WRITE) {
  console.log('\nChua ghi. Chay lai voi --write de ghi that.');
  process.exit(0);
}

console.log('');
for (const a of actions) { a.run(); console.log('  ok  ' + a.desc); }

fs.writeFileSync(SCENE + '.bak', raw, 'utf8');
fs.writeFileSync(SCENE, JSON.stringify(arr, null, 2), 'utf8');
console.log('\nDa ghi scene. Ban cu o MainGame.fire.bak');
