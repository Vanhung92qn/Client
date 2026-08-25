/**
 * validate-scene.js — kiem tra file .fire con hop le sau khi sua bang code.
 *
 *   node tools/prefab/validate-scene.js [duong/dan/toi.fire]
 *   (khong truyen thi kiem MainGame.fire)
 *
 * Scene la file JSON hang nghin phan tu; sua bang code ma lam dut mot tham
 * chieu thi Cocos bao hong ca lobby, va loi thuong chi lo ra luc chay. Kiem
 * truoc thi re hon nhieu.
 *
 * Khac validate.js (danh cho .prefab) o hai cho:
 *   - Node trong scene co _prefab = null, KHONG can cc.PrefabInfo
 *   - Phan tu [0] la cc.SceneAsset chu khong phai cc.Prefab
 */

'use strict';

const fs = require('fs');
const path = require('path');
const A = require('./lib/assets');

const file = process.argv[2] || path.join(A.ASSETS_ROOT, 'lobby', 'scenes', 'MainGame.fire');

/** Tap hop uuid co that trong project. */
const knownUuids = (() => {
  const set = new Set();
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else if (name.endsWith('.meta')) {
        try {
          const m = JSON.parse(fs.readFileSync(p, 'utf8'));
          if (m.uuid) set.add(m.uuid);
          for (const k of Object.keys(m.subMetas || {})) {
            if (m.subMetas[k].uuid) set.add(m.subMetas[k].uuid);
          }
        } catch (e) { /* .meta hong khong phai viec cua validator */ }
      }
    }
  };
  walk(A.ASSETS_ROOT);
  return set;
})();

const arr = JSON.parse(fs.readFileSync(file, 'utf8'));
const errors = [];
const warns = [];

// 1. Moi __id__ tro vao trong mang, moi __uuid__ co that
const seen = new Set();
const checkRefs = (o, where) => {
  if (!o || typeof o !== 'object') return;
  if (Array.isArray(o)) { o.forEach((v, i) => checkRefs(v, `${where}[${i}]`)); return; }
  if (typeof o.__id__ === 'number') {
    if (o.__id__ < 0 || o.__id__ >= arr.length) {
      errors.push(`${where}: __id__=${o.__id__} nam ngoai mang (0..${arr.length - 1})`);
    }
    return;
  }
  if (typeof o.__uuid__ === 'string') {
    if (!knownUuids.has(o.__uuid__) && !seen.has(o.__uuid__)) {
      seen.add(o.__uuid__);
      warns.push(`${where}: uuid khong thay trong project -> ${o.__uuid__}`);
    }
    return;
  }
  for (const k of Object.keys(o)) {
    if (o[k] === undefined) errors.push(`${where}.${k}: undefined (JSON se nuot key)`);
    checkRefs(o[k], `${where}.${k}`);
  }
};
arr.forEach((o, i) => checkRefs(o, `[${i}] ${o && o.__type__}`));

// 2. Quan he cha - con, va component tro ve dung node
arr.forEach((o, i) => {
  if (!o || o.__type__ !== 'cc.Node') return;

  for (const c of o._children || []) {
    const child = arr[c.__id__];
    if (!child || child.__type__ !== 'cc.Node') {
      errors.push(`[${i}] ${o._name}: _children tro toi phan tu khong phai node`);
      continue;
    }
    if (!child._parent || child._parent.__id__ !== i) {
      errors.push(`[${i}] ${o._name}: con "${child._name}" co _parent khong tro nguoc lai`);
    }
  }

  for (const c of o._components || []) {
    const comp = arr[c.__id__];
    if (!comp) {
      errors.push(`[${i}] ${o._name}: _components tro toi phan tu khong ton tai`);
      continue;
    }
    if (!comp.node || comp.node.__id__ !== i) {
      errors.push(`[${i}] ${o._name}: component ${comp.__type__} co .node khong tro ve node nay`);
    }
  }

  if (!o._trs || !Array.isArray(o._trs.array) || o._trs.array.length !== 10) {
    errors.push(`[${i}] ${o._name}: _trs phai la mang 10 phan tu`);
  }
});

// 3. Node mo coi — co _parent nhung cha khong nhan
arr.forEach((o, i) => {
  if (!o || o.__type__ !== 'cc.Node' || !o._parent) return;
  const parent = arr[o._parent.__id__];
  if (!parent || !parent._children) return;
  if (!parent._children.some((c) => c.__id__ === i)) {
    errors.push(`[${i}] ${o._name}: cha "${parent._name}" khong liet ke node nay trong _children`);
  }
});

const rel = path.relative(A.ASSETS_ROOT, file);
console.log(`${rel} — ${arr.length} phan tu`);
console.log(`  node      : ${arr.filter((o) => o && o.__type__ === 'cc.Node').length}`);
console.log('');
for (const e of errors) console.log(`  x ${e}`);
for (const w of warns.slice(0, 10)) console.log(`  - ${w}`);
if (warns.length > 10) console.log(`  - ... va ${warns.length - 10} canh bao uuid khac`);
console.log('');
console.log(errors.length ? `${errors.length} LOI` : 'Hop le');
process.exit(errors.length ? 1 : 0);
