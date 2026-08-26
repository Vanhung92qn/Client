/**
 * cleanup-vip-legacy.js — don VIP doi dau (trung lap) va phan VAY TIEN.
 *
 *   node tools/prefab/cleanup-vip-legacy.js          (xem truoc)
 *   node tools/prefab/cleanup-vip-legacy.js --write  (xoa that)
 *
 * User chot 2026-08-27: VIP trung lap thi bo, vay tien thi khong lam.
 *
 * HAI THU DEU DA CHET SAN, khong phai tat di:
 *   - VIP doi dau (VIPView/VIPItem): KHONG co node nao trong
 *     accountViewNew3. Chi ton tai duoi dang tep.
 *   - Vay tien: getLoanInfo() da bi comment trong VIP2View, va ca ba node
 *     contentLoan / contentLoanProgress / contentLoanActive deu TAT.
 *
 * GIU LAI (nam cung thu muc nhung VIP2 con dung):
 *   VIPRedeemStatus.js   VIP2Item + VIP2ListView dung
 *   VIPIcons.js          dang BAT trong accountViewNew3
 *   QuaterPrizeStatus.js VIPPrizeItem (thuong quy) dung
 *   VIPPrizeItem.js      thuong quy — user khong yeu cau bo
 *   VIPCardItem / VIPPrize prefab — the thang va thuong quy van dung
 */

'use strict';

const fs = require('fs');
const path = require('path');
const Backup = require('./lib/backup');
const A = require('./lib/assets');

const ROOT = A.ASSETS_ROOT;
const WRITE = process.argv.includes('--write');

const FILES = [
  // ── VIP doi dau ──────────────────────────────────────────────
  'lobby/scripts/portal/account/VIP/VIPView.js',
  'lobby/scripts/portal/account/VIP/VIPItem.js',
  'lobby/scripts/portal/account/VIP/VIPMaps.js',
  'lobby/scripts/portal/account/VIP/PolicyView.js',
  'prefabs/portal/vip/VIPItem.prefab',

  // ── Vay tien ─────────────────────────────────────────────────
  'lobby/scripts/portal/account/VIP2/loan/VIPLoanItem.js',
  'prefabs/portal/vip/VIPLoanItem.prefab',
  'lobby/scripts/command/portal/account/VIP/loan/GetVIPLoanInfoCommand.js',
  'lobby/scripts/command/portal/account/VIP/loan/VIPLoanProcessCommand.js',
  'lobby/scripts/command/portal/account/VIP/loan/VIPLoanReturnCommand.js',
];

const ACCOUNT_PREFAB = path.join(ROOT, 'prefabs', 'portal', 'accountViewNew3.prefab');
/** Thuoc tinh tro toi hai prefab sap xoa — de lai thi Cocos bao thieu tai nguyen. */
const PROPS = ['itemVIP', 'itemVIPLoan'];

const exists = FILES.filter((f) => fs.existsSync(path.join(ROOT, f)));

let bytes = 0;
for (const f of exists) {
  bytes += fs.statSync(path.join(ROOT, f)).size;
  const m = path.join(ROOT, f + '.meta');
  if (fs.existsSync(m)) bytes += fs.statSync(m).size;
}

console.log(`Xoa ${exists.length} tep — ${(bytes / 1024).toFixed(0)} KB\n`);
for (const f of exists) console.log('  ' + f);

console.log('\nGo thuoc tinh trong accountViewNew3.prefab:');
for (const p of PROPS) console.log('  ' + p);

if (!WRITE) {
  console.log('\nChua ghi. Chay lai voi --write de xoa that.');
  console.log('Nho go tham chieu trong VIP2ListView / VIP2View bang tay sau do.');
  process.exit(0);
}

console.log('');
for (const f of exists) {
  const abs = path.join(ROOT, f);
  fs.unlinkSync(abs);
  const m = abs + '.meta';
  if (fs.existsSync(m)) fs.unlinkSync(m);
  console.log('  xoa  ' + f);
}

// ── Go thuoc tinh khoi accountViewNew3 ──────────────────────────
const raw = fs.readFileSync(ACCOUNT_PREFAB, 'utf8');
const arr = JSON.parse(raw);
let removed = 0;
for (const o of arr) {
  if (!o || typeof o !== 'object') continue;
  for (const p of PROPS) {
    if (o[p] !== undefined) { delete o[p]; removed++; }
  }
}
if (removed) {
  const bak = Backup.save(ACCOUNT_PREFAB, raw);
  fs.writeFileSync(ACCOUNT_PREFAB, JSON.stringify(arr, null, 2), 'utf8');
  console.log(`\n  go ${removed} thuoc tinh khoi accountViewNew3.prefab`);
}

// ── Don thu muc rong ────────────────────────────────────────────
function prune(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return;
  for (const n of fs.readdirSync(abs)) {
    const p = path.join(abs, n);
    if (!fs.existsSync(p)) continue;
    if (fs.statSync(p).isDirectory()) prune(path.relative(ROOT, p).split(path.sep).join('/'));
  }
  if (fs.readdirSync(abs).length === 0) {
    fs.rmdirSync(abs);
    const m = abs + '.meta';
    if (fs.existsSync(m)) fs.unlinkSync(m);
    console.log('  don thu muc rong: ' + rel);
  }
}
prune('lobby/scripts/command/portal/account/VIP/loan');
prune('lobby/scripts/portal/account/VIP2/loan');

console.log('\nTiep theo — go bang tay:');
console.log('  VIP2ListView.js  property nodeParentLoan* + itemVIP/itemVIPLoan + ham loan');
console.log('  VIP2View.js      getLoanInfo / onGetVIPLoanInfoResponse');
