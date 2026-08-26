/**
 * trace-scene-usage.js — prefab duoc scene tham chieu, nhung CO CHAY khong?
 *
 *   node tools/prefab/trace-scene-usage.js <prefab.prefab> [...]
 *
 * "Co trong scene" chua co nghia la "con hoat dong". Tool nay tim:
 *   - Node nao trong scene giu prefab do, node do co _active khong
 *   - Ca chuoi cha cua no co active khong (cha tat thi con cung tat)
 *   - Component nao giu tham chieu, thuoc script nao
 */

'use strict';

const fs = require('fs');
const path = require('path');
const P = require('./lib/cocos-prefab');
const A = require('./lib/assets');

const ROOT = A.ASSETS_ROOT;
const SCENE = path.join(ROOT, 'lobby', 'scenes', 'MainGame.fire');

// uuid -> duong dan, cid -> script
const uuidToPath = Object.create(null);
const cidToScript = Object.create(null);

(function walk(d) {
  for (const name of fs.readdirSync(d)) {
    const p = path.join(d, name);
    if (fs.statSync(p).isDirectory()) { walk(p); continue; }
    if (!name.endsWith('.meta')) continue;
    try {
      const m = JSON.parse(fs.readFileSync(p, 'utf8'));
      const rel = path.relative(ROOT, p).replace(/\.meta$/, '').split(path.sep).join('/');
      if (m.uuid) {
        uuidToPath[m.uuid] = rel;
        if (rel.endsWith('.js')) cidToScript[P.compressUuid(m.uuid)] = rel;
      }
    } catch (e) { /* bo qua */ }
  }
})(ROOT);

const arr = JSON.parse(fs.readFileSync(SCENE, 'utf8'));

/** Duong dan node tu goc, kem trang thai active cua ca chuoi. */
function nodePath(idx) {
  const parts = [];
  let cur = idx;
  let guard = 0;
  let allActive = true;
  while (cur !== undefined && cur !== null && guard++ < 100) {
    const n = arr[cur];
    if (!n || n.__type__ !== 'cc.Node') break;
    parts.unshift(n._name + (n._active ? '' : ' [TAT]'));
    if (!n._active) allActive = false;
    cur = n._parent ? n._parent.__id__ : null;
  }
  return { path: parts.join(' / '), allActive };
}

/** Node chua component thu idx. */
function ownerNodeOf(compIdx) {
  const comp = arr[compIdx];
  if (comp && comp.node && typeof comp.node.__id__ === 'number') return comp.node.__id__;
  return -1;
}

for (const target of process.argv.slice(2)) {
  const relTarget = target.split(path.sep).join('/');
  const metaPath = path.join(ROOT, relTarget + '.meta');
  if (!fs.existsSync(metaPath)) {
    console.log(`\n${relTarget}\n  thieu .meta`);
    continue;
  }
  const uuid = JSON.parse(fs.readFileSync(metaPath, 'utf8')).uuid;

  console.log('\n' + '─'.repeat(70));
  console.log(relTarget);
  console.log('─'.repeat(70));

  let found = 0;
  arr.forEach((o, i) => {
    if (!o || typeof o !== 'object') return;
    const txt = JSON.stringify(o);
    if (!txt.includes(uuid)) return;

    found++;
    const isNode = o.__type__ === 'cc.Node';
    const ownerIdx = isNode ? i : ownerNodeOf(i);
    const info = ownerIdx >= 0 ? nodePath(ownerIdx) : { path: '(khong ro node)', allActive: false };
    const script = cidToScript[o.__type__];

    console.log(`\n  [${i}] ${script ? script : o.__type__}`);
    console.log(`      node : ${info.path}`);
    console.log(`      chay : ${info.allActive ? 'CO — ca chuoi cha deu bat' : 'KHONG — co node bi tat tren duong'}`);
  });

  if (!found) console.log('  Khong thay trong scene');
}

console.log('');
