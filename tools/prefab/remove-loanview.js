/**
 * remove-loanview.js — go han cum node 'loanView' khoi shopTopupView3.prefab.
 *
 *   node tools/prefab/remove-loanview.js          (xem truoc, khong ghi)
 *   node tools/prefab/remove-loanview.js --write  (ghi that)
 *
 * VI SAO
 * ------
 * Commit c6e13f0 xoa assets/lobby/scripts/portal/shop/loan/LoanView.js theo
 * quyet dinh cua user ("vay tien bo khong sai"), va tin rang no mo coi. Sai:
 * shopTopupView3.prefab VAN CO node 'loanView' mang component tro toi script
 * do. Cocos mo len bao:
 *
 *   Script attached to "loanView" is missing or invalid
 *
 * Dot don ay chi soat scene + prefab VIP + accountViewNew3, khong soat het
 * moi prefab — bai hoc: xoa script phai quet TOAN BO *.prefab lan *.fire theo
 * cid, khong the doc bang mat.
 *
 * CHON GO NODE, KHONG KHOI PHUC SCRIPT: user da chot bo hin vay tien. Khoi
 * phuc lai la nuoi mot man hinh 259 dong khong ai dinh dung.
 *
 * CACH LAM
 * --------
 * File .prefab la MANG PHANG, moi tham chieu la { "__id__": <chi so> }. Xoa
 * phan tu la moi chi so phia sau dich mot bac. Nen khong xoa tai cho ma DUNG
 * LAI mang moi kem bang doi chieu cu -> moi, roi vie t lai toan bo __id__.
 *
 * Truoc khi ghi co mot chot chan quan trong: neu con bat ky tham chieu nao TU
 * NGOAI tro VAO trong cum sap xoa thi DUNG LAI — go di se de lai __id__ tro
 * vao khoang khong, hong ca prefab.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const Backup = require('./lib/backup');
const A = require('./lib/assets');

const PREFAB = path.join(A.ASSETS_ROOT, 'prefabs', 'portal', 'shopTopupView3.prefab');
const NODE_NAME = 'loanView';

/** cid cua LoanView.js da bi xoa — de bao cao cho ro, khong dung de tim. */
const DEAD_CID = 'b1eb6DLMTpDJqjo1P16kGiZ';

const WRITE = process.argv.includes('--write');

// ─────────────────────────────────────────────────────────────────

function main() {
  const raw = fs.readFileSync(PREFAB, 'utf8');
  const arr = JSON.parse(raw);

  const rootIdx = arr.findIndex(
    (o) => o && o.__type__ === 'cc.Node' && o._name === NODE_NAME
  );
  if (rootIdx < 0) {
    console.log(`Khong con node ${NODE_NAME} trong prefab — khong lam gi.`);
    return;
  }

  // ── Gom moi chi so thuoc cum sap xoa ──────────────────────────
  const doomed = new Set();
  (function collect(id) {
    const o = arr[id];
    if (!o) return;
    doomed.add(id);
    for (const c of o._components || []) doomed.add(c.__id__);
    for (const c of o._children || []) collect(c.__id__);
  })(rootIdx);

  /* Chua het: cc.ClickEvent (clickEvents cua Button) va cc.PrefabInfo (_prefab
     cua node) la nhung PHAN TU RIENG trong mang, khong nam trong _components
     hay _children nen vong duyet tren khong cham toi. Chung thuoc so huu cua
     node/component chua chung nen phai xoa theo.

     🔴 Chi bam theo QUYEN SO HUU, khong bam theo tham chieu bat ky. Ban dau
     toi viet quy tac chung "phan tu khong phai node cung khong phai component
     thi xoa theo" — no keo luon [0] (cc.Prefab goc) vao, vi moi cc.PrefabInfo
     deu tro .asset toi [0]. Xoa [0] la hong ca file. Nen o day dung DANH SACH
     TRANG cac loai doi tuong gia tri, va khong bao gio dung toi [0]. */
  const OWNED_TYPES = new Set([
    'cc.ClickEvent',
    'cc.Component.EventHandler',
    'cc.PrefabInfo',
  ]);

  let grew = true;
  while (grew) {
    grew = false;
    for (const id of [...doomed]) {
      const o = arr[id];
      if (!o) continue;
      (function scan(v) {
        if (!v || typeof v !== 'object') return;
        if (Array.isArray(v)) { v.forEach(scan); return; }
        if (typeof v.__id__ === 'number') {
          const to = v.__id__;
          const t = arr[to];
          if (!t || to === 0 || doomed.has(to)) return;
          if (OWNED_TYPES.has(t.__type__)) { doomed.add(to); grew = true; }
          return;
        }
        for (const k of Object.keys(v)) scan(v[k]);
      })(o);
    }
  }

  const parentIdx = arr[rootIdx]._parent.__id__;

  console.log(`Prefab : ${path.relative(A.ASSETS_ROOT, PREFAB)}`);
  console.log(`Node   : ${NODE_NAME} @ ${rootIdx}  (cha: ${arr[parentIdx]._name})`);
  console.log(`Cum    : ${doomed.size} phan tu`);

  const all = [...doomed];
  const nodes = all.filter((i) => arr[i] && arr[i].__type__ === 'cc.Node');
  const owned = all.filter((i) => arr[i] && OWNED_TYPES.has(arr[i].__type__));
  const comps = all.filter(
    (i) => arr[i] && arr[i].__type__ !== 'cc.Node' && !OWNED_TYPES.has(arr[i].__type__)
  );
  console.log(`         ${nodes.length} node + ${comps.length} component `
    + `+ ${owned.length} doi tuong gia tri (PrefabInfo / ClickEvent)`);

  const dead = comps.filter((i) => arr[i].__type__ === DEAD_CID);
  console.log(`         trong do ${dead.length} component tro toi script da xoa (${DEAD_CID})`);
  console.log('');

  // ── CHOT CHAN: co ai NGOAI cum tro VAO trong khong? ───────────
  const inbound = [];
  arr.forEach((o, i) => {
    if (doomed.has(i)) return;
    (function scan(v, where) {
      if (!v || typeof v !== 'object') return;
      if (Array.isArray(v)) { v.forEach((x, k) => scan(x, `${where}[${k}]`)); return; }
      if (typeof v.__id__ === 'number') {
        if (doomed.has(v.__id__)) {
          inbound.push(`[${i}] ${arr[i].__type__} .${where} -> [${v.__id__}]`);
        }
        return;
      }
      for (const k of Object.keys(v)) scan(v[k], where ? `${where}.${k}` : k);
    })(o, '');
  });

  // Chinh cha tro toi node goc la binh thuong — se go rieng ben duoi
  const realInbound = inbound.filter(
    (s) => !s.startsWith(`[${parentIdx}] cc.Node ._children`)
  );

  if (realInbound.length) {
    console.error(`DUNG LAI — con ${realInbound.length} tham chieu tu ngoai tro vao trong cum:`);
    for (const s of realInbound.slice(0, 25)) console.error('  x ' + s);
    if (realInbound.length > 25) console.error(`  ... con ${realInbound.length - 25} cai nua`);
    console.error('');
    console.error('Go di se de lai __id__ tro vao khoang khong. Phai xu ly tung cai truoc.');
    process.exit(1);
  }
  console.log('Chot chan: khong tham chieu nao tu ngoai tro vao cum. OK');

  // ── Dung lai mang + bang doi chieu ────────────────────────────
  const remap = new Array(arr.length).fill(-1);
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    if (doomed.has(i)) continue;
    remap[i] = out.length;
    out.push(arr[i]);
  }

  // Go node goc khoi danh sach con cua cha (lam TRUOC khi viet lai __id__)
  const parent = out[remap[parentIdx]];
  parent._children = (parent._children || []).filter((c) => !doomed.has(c.__id__));

  // Viet lai moi __id__ theo bang doi chieu
  let rewritten = 0;
  (function rewrite(v) {
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v)) { v.forEach(rewrite); return; }
    if (typeof v.__id__ === 'number') {
      const to = remap[v.__id__];
      if (to < 0) throw new Error(`__id__ ${v.__id__} tro vao phan tu da xoa — lo chot chan`);
      if (to !== v.__id__) rewritten++;
      v.__id__ = to;
      return;
    }
    for (const k of Object.keys(v)) rewrite(v[k]);
  })(out);

  console.log(`Mang    : ${arr.length} -> ${out.length} phan tu  (viet lai ${rewritten} tham chieu)`);
  console.log('');

  // ── Tu kiem lai tu dau ────────────────────────────────────────
  const errors = [];
  out.forEach((o, i) => {
    (function check(v, where) {
      if (!v || typeof v !== 'object') return;
      if (Array.isArray(v)) { v.forEach((x, k) => check(x, `${where}[${k}]`)); return; }
      if (typeof v.__id__ === 'number') {
        if (v.__id__ < 0 || v.__id__ >= out.length) {
          errors.push(`[${i}].${where}: __id__=${v.__id__} ngoai mang`);
        }
        return;
      }
      for (const k of Object.keys(v)) check(v[k], where ? `${where}.${k}` : k);
    })(o, '');

    // node con phai tro nguoc ve cha, component phai tro ve node chua no
    if (o.__type__ === 'cc.Node') {
      for (const c of o._children || []) {
        const ch = out[c.__id__];
        if (!ch || !ch._parent || ch._parent.__id__ !== i) {
          errors.push(`[${i}] ${o._name}: con [${c.__id__}] khong tro nguoc ve cha`);
        }
      }
      for (const c of o._components || []) {
        const k = out[c.__id__];
        if (!k || !k.node || k.node.__id__ !== i) {
          errors.push(`[${i}] ${o._name}: component [${c.__id__}] khong tro ve node nay`);
        }
      }
    }
  });

  if (out.some((o) => o && o.__type__ === 'cc.Node' && o._name === NODE_NAME)) {
    errors.push(`van con node ten ${NODE_NAME}`);
  }
  if (out.some((o) => o && o.__type__ === DEAD_CID)) {
    errors.push(`van con component cid ${DEAD_CID}`);
  }

  if (errors.length) {
    console.error('LOI — khong ghi:');
    for (const e of errors) console.error('  x ' + e);
    process.exit(1);
  }
  console.log('Tu kiem: OK  (moi __id__ trong mang, cha-con va component tro dung nhau)');

  if (!WRITE) {
    console.log('');
    console.log('Chua ghi. Chay lai voi --write de ghi that.');
    return;
  }

  const bak = Backup.save(PREFAB, raw);
  fs.writeFileSync(PREFAB, JSON.stringify(out, null, 2), 'utf8');
  console.log('');
  console.log(`Da ghi ${path.relative(A.ASSETS_ROOT, PREFAB)}`);
  console.log(`Ban cu o ${bak}`);
}

main();
