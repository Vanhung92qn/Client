/**
 * validate.js — kiem tra file .prefab sinh ra co hop le khong.
 *
 *   node tools/prefab/validate.js [duong/dan/toi.prefab ...]
 *   (khong truyen tham so thi kiem tra toan bo prefab trong prefabs/portal/vip)
 *
 * VPS khong mo duoc Cocos Creator de thu, nen phai tu kiem tra truoc khi
 * day len. Cac loi duoi day deu lam Cocos bao hong prefab hoac im lang
 * hien sai:
 *   - __id__ tro ra ngoai mang
 *   - node con/cha khong khop nhau
 *   - component khong tro ve dung node chua no
 *   - node thieu cc.PrefabInfo
 *   - uuid asset khong ton tai trong project
 *   - con sot gia tri undefined/null o cho bat buoc
 */

'use strict';

const fs = require('fs');
const path = require('path');
const A = require('./lib/assets');

/**
 * Cac thu muc chua prefab VIP. Hoan tra va Li xi nam o thu muc RIENG canh
 * vip/ nen phai liet ke ca ba, khong thi quet sot.
 */
const VIP_DIRS = [
  path.join(A.ASSETS_ROOT, 'prefabs', 'portal', 'vip'),
  path.join(A.ASSETS_ROOT, 'prefabs', 'portal', 'RakeBack'),
  path.join(A.ASSETS_ROOT, 'prefabs', 'portal', 'Lixi'),
  path.join(A.ASSETS_ROOT, 'prefabs', 'portal', 'Quest'),
];

/** Tap hop uuid co that trong project — quet mot lan roi tra cuu. */
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
        } catch (e) {
          /* .meta hong thi bo qua, khong phai viec cua validator */
        }
      }
    }
  };
  walk(A.ASSETS_ROOT);
  return set;
})();

function validate(filePath) {
  const errors = [];
  const warns = [];
  const rel = path.relative(A.ASSETS_ROOT, filePath);

  let arr;
  try {
    arr = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return { rel, errors: [`JSON hong: ${e.message}`], warns: [] };
  }
  if (!Array.isArray(arr)) {
    return { rel, errors: ['File .prefab phai la mot mang JSON'], warns: [] };
  }

  const at = (i) => arr[i];

  // 1. Moi __id__ phai tro vao trong mang
  const checkIds = (obj, where) => {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      obj.forEach((v, i) => checkIds(v, `${where}[${i}]`));
      return;
    }
    if (typeof obj.__id__ === 'number') {
      if (obj.__id__ < 0 || obj.__id__ >= arr.length) {
        errors.push(`${where}: __id__=${obj.__id__} nam ngoai mang (0..${arr.length - 1})`);
      }
      return;
    }
    if (typeof obj.__uuid__ === 'string') {
      if (!knownUuids.has(obj.__uuid__)) {
        errors.push(`${where}: uuid khong co trong project -> ${obj.__uuid__}`);
      }
      return;
    }
    for (const k of Object.keys(obj)) {
      if (obj[k] === undefined) {
        errors.push(`${where}.${k}: gia tri undefined (JSON se nuot mat key nay)`);
      }
      if (typeof obj[k] === 'symbol') {
        errors.push(`${where}.${k}: con sot Symbol — tham chieu chua duoc resolve`);
      }
      checkIds(obj[k], `${where}.${k}`);
    }
  };
  arr.forEach((o, i) => checkIds(o, `[${i}] ${o && o.__type__}`));

  // 2. Phan tu [0] phai la cc.Prefab tro toi node goc
  if (!arr[0] || arr[0].__type__ !== 'cc.Prefab') {
    errors.push('[0] phai la cc.Prefab');
  } else if (!arr[0].data || arr[0].data.__id__ !== 1) {
    errors.push('[0].data phai tro toi node goc [1]');
  }
  if (!arr[1] || arr[1].__type__ !== 'cc.Node') {
    errors.push('[1] phai la node goc (cc.Node)');
  } else if (arr[1]._parent !== null) {
    errors.push('[1]._parent cua node goc phai la null');
  }

  // 3. Quan he cha - con
  arr.forEach((o, i) => {
    if (!o || o.__type__ !== 'cc.Node') return;
    for (const c of o._children || []) {
      const child = at(c.__id__);
      if (!child || child.__type__ !== 'cc.Node') {
        errors.push(`[${i}] ${o._name}: _children tro toi phan tu khong phai node`);
        continue;
      }
      if (!child._parent || child._parent.__id__ !== i) {
        errors.push(`[${i}] ${o._name}: con "${child._name}" co _parent khong tro nguoc lai`);
      }
    }
    // 4. Component phai tro ve dung node chua no
    for (const c of o._components || []) {
      const comp = at(c.__id__);
      if (!comp) {
        errors.push(`[${i}] ${o._name}: _components tro toi phan tu khong ton tai`);
        continue;
      }
      if (!comp.node || comp.node.__id__ !== i) {
        errors.push(
          `[${i}] ${o._name}: component ${comp.__type__} co .node khong tro ve node nay`
        );
      }
    }
    // 5. Node nao cung phai co cc.PrefabInfo
    if (!o._prefab || typeof o._prefab.__id__ !== 'number') {
      errors.push(`[${i}] ${o._name}: thieu _prefab (cc.PrefabInfo)`);
    } else {
      const pi = at(o._prefab.__id__);
      if (!pi || pi.__type__ !== 'cc.PrefabInfo') {
        errors.push(`[${i}] ${o._name}: _prefab khong tro toi cc.PrefabInfo`);
      }
    }
    // 6. _trs phai du 10 so
    if (!o._trs || !Array.isArray(o._trs.array) || o._trs.array.length !== 10) {
      errors.push(`[${i}] ${o._name}: _trs phai la mang 10 phan tu`);
    }
  });

  // 7. Rang buoc rieng cua tung component
  arr.forEach((o, i) => {
    if (!o) return;
    if (o.__type__ === 'cc.ScrollView') {
      if (!o._N$content || typeof o._N$content.__id__ !== 'number') {
        errors.push(`[${i}] cc.ScrollView: thieu content -> se khong cuon duoc`);
      }
    }
    if (o.__type__ === 'cc.ProgressBar') {
      if (!o._N$barSprite || typeof o._N$barSprite.__id__ !== 'number') {
        errors.push(`[${i}] cc.ProgressBar: thieu barSprite -> thanh tien do khong chay`);
      } else {
        const bar = at(o._N$barSprite.__id__);
        if (!bar || bar.__type__ !== 'cc.Sprite') {
          errors.push(`[${i}] cc.ProgressBar: barSprite phai tro toi cc.Sprite`);
        }
      }
    }
    if (o.__type__ === 'cc.Sprite' && o._spriteFrame === null) {
      const owner = typeof o.node?.__id__ === 'number' ? at(o.node.__id__) : null;
      warns.push(`[${i}] cc.Sprite tren "${owner ? owner._name : '?'}" chua co anh (gan luc chay)`);
    }
  });

  return { rel, errors, warns };
}

function main() {
  let files = process.argv.slice(2);
  if (!files.length) {
    const collect = (dir) => {
      const out = [];
      for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name);
        if (fs.statSync(p).isDirectory()) out.push(...collect(p));
        else if (name.endsWith('.prefab')) out.push(p);
      }
      return out;
    };
    files = [];
    for (const d of VIP_DIRS) {
      if (fs.existsSync(d)) files.push(...collect(d));
    }
  }

  let bad = 0;
  for (const f of files) {
    const r = validate(f);
    const tag = r.errors.length ? 'LOI ' : 'OK  ';
    console.log(`${tag} ${r.rel}`);
    for (const e of r.errors) console.log(`       x ${e}`);
    for (const w of r.warns) console.log(`       - ${w}`);
    if (r.errors.length) bad++;
  }
  console.log('---');
  console.log(bad ? `${bad}/${files.length} file co loi` : `Tat ca ${files.length} file hop le`);
  process.exit(bad ? 1 : 0);
}

main();
