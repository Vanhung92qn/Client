/**
 * cleanup-events.js — don he su kien cu (2019).
 *
 *   node tools/prefab/cleanup-events.js          (xem truoc)
 *   node tools/prefab/cleanup-events.js --write  (xoa that)
 *
 * Nam su kien trong eventView-4 deu tu thang 4-5/2019 va deu da chet:
 * backend khong con ShortBreathController / KingBoomController /
 * QuayController / X2RewardController, va cac bang du lieu nguoi choi
 * deu 0 dong. User chot 2026-08-27: bo ca nam, khong giu cai nao.
 *
 * XOA:  3 prefab + toan bo script cua chung
 * GIU:  bon script van con nguoi dung tu ben ngoai (xem KEEP ben duoi)
 *
 * Tool chi xoa TEP. Phan go tham chieu trong ma va scene lam bang tay —
 * sua ma bang bieu thuc chinh quy de hong hon la xoa nham tep.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const A = require('./lib/assets');

const ROOT = A.ASSETS_ROOT;
const WRITE = process.argv.includes('--write');

const PREFABS = [
  'prefabs/portal/event/eventView-4.prefab',
  'prefabs/portal/event/fxSummonDragon.prefab',
  'prefabs/portal/x2/x2RewardView.prefab',
];

const SCRIPT_DIRS = ['lobby/scripts/portal/event', 'lobby/scripts/portal/x2'];

/**
 * Bon tep PHAI GIU du nam trong thu muc bi don — chung con nguoi dung
 * tu ben ngoai he su kien:
 */
const KEEP = new Set([
  // Ten gay hieu nham: day KHONG phai trung tam su kien ma la view LOGO
  // MINIGAME o lobby (nodeLogoMiniPoker, nodeLogoTX, nodeLogoXocDia...).
  // Scene gan truc tiep script nay.
  'lobby/scripts/portal/event/EventLobbyView.js',

  // LobbyJackpotController dung
  'lobby/scripts/portal/event/EventController.js',

  // Scene gan vao nut btnMINIEvent. Ham openEventClicked cua no se duoc
  // go bang tay (no mo trung tam su kien vua xoa), nhung openTreasureClicked
  // van dung duoc nen giu tep.
  'lobby/scripts/portal/event/MINIEventView.js',

  // BannerPopupView va BottomBarView dung (enum tab)
  'lobby/scripts/portal/x2/X2Tab.js',
]);

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

const scripts = SCRIPT_DIRS.flatMap(listJs).filter((f) => !KEEP.has(f));
const targets = [...PREFABS, ...scripts].filter((f) => fs.existsSync(path.join(ROOT, f)));

let bytes = 0;
for (const f of targets) {
  bytes += fs.statSync(path.join(ROOT, f)).size;
  const meta = path.join(ROOT, f + '.meta');
  if (fs.existsSync(meta)) bytes += fs.statSync(meta).size;
}

console.log(`Xoa ${targets.length} tep (+ .meta di kem) — ${(bytes / 1024).toFixed(0)} KB\n`);
console.log(`  ${PREFABS.filter((f) => fs.existsSync(path.join(ROOT, f))).length} prefab`);
console.log(`  ${scripts.length} script`);
console.log('');
console.log(`GIU LAI ${KEEP.size} tep con nguoi dung:`);
for (const k of KEEP) console.log('  ' + k);

if (!WRITE) {
  console.log('\nChua xoa. Chay lai voi --write de xoa that.');
  console.log('Nho: go tham chieu trong ma va scene BANG TAY sau khi xoa.');
  process.exit(0);
}

console.log('');
let n = 0;
for (const f of targets) {
  const abs = path.join(ROOT, f);
  fs.unlinkSync(abs);
  const meta = abs + '.meta';
  if (fs.existsSync(meta)) fs.unlinkSync(meta);
  n++;
}
console.log(`Da xoa ${n} tep.`);

// Don thu muc rong (va .meta cua chung) — de lai thu muc rong thi Cocos
// van hien trong cay tai nguyen, nhin nhu chua don xong
function pruneEmpty(dirRel) {
  const abs = path.join(ROOT, dirRel);
  if (!fs.existsSync(abs)) return;
  for (const n2 of fs.readdirSync(abs)) {
    const p = path.join(abs, n2);
    // Kiem ton tai truoc khi stat: xoa thu muc con cung xoa .meta cua no,
    // ma .meta do nam CUNG CAP nen van con trong danh sach doc luc dau
    if (!fs.existsSync(p)) continue;
    if (fs.statSync(p).isDirectory()) {
      pruneEmpty(path.relative(ROOT, p).split(path.sep).join('/'));
    }
  }
  if (fs.readdirSync(abs).length === 0) {
    fs.rmdirSync(abs);
    const meta = abs + '.meta';
    if (fs.existsSync(meta)) fs.unlinkSync(meta);
    console.log('  don thu muc rong: ' + dirRel);
  }
}
for (const d of SCRIPT_DIRS) pruneEmpty(d);
pruneEmpty('prefabs/portal/event');
pruneEmpty('prefabs/portal/x2');

console.log('\nTiep theo — go tham chieu bang tay:');
console.log('  LobbyView.js       property prefabEvent / prefabX2Reward / prefabFxSummonDragon');
console.log('                     ham create/destroy EventView, X2RewardView, FxSummonDragon');
console.log('  LobbyController.js cac ham uy quyen tuong ung + createEventViewTopVP');
console.log('  6 cho goi createEventView (banner, TaiXiu, MD5, SieuToc, SicBo, Blockbuster)');
console.log('  BottomBarView.js   createX2RewardView');
console.log('  MINIEventView.js   openEventClicked');
console.log('  MainGame.fire      3 thuoc tinh prefab + tat nut btnMINIEvent');
