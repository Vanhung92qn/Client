/**
 * rename-x2-to-banner.js — doi ten popup banner cho dung voi viec no lam.
 *
 *   node tools/prefab/rename-x2-to-banner.js          (xem truoc)
 *   node tools/prefab/rename-x2-to-banner.js --write  (ghi that)
 *
 * VI SAO
 * ------
 * prefabs/portal/x2/x2View.prefab nghe nhu su kien nap X2, nhung mo ra
 * thi ben trong la BannerView + AutoScrollPageView + ba anh banner. No la
 * POPUP BANNER hien ngay sau khi dang nhap (LobbyView goi
 * createX2PopupView o dong 1954), bam vao thi mo man nap tien.
 *
 * Su kien X2 that la prefab KHAC: x2RewardView.prefab, co thanh tien do
 * va nut nhan thuong, goi api/X2Reward/* — va api do da chet.
 *
 * De hai cai cung ten "x2" trong cung mot thu muc la mam mong nham lan.
 *
 * DOI GI
 * ------
 *   prefabs/portal/x2/x2View.prefab
 *     -> prefabs/portal/banner/bannerPopup.prefab      (GIU NGUYEN uuid)
 *   ten node goc  x2View -> bannerPopup
 *
 *   lobby/scripts/portal/x2/X2View.js
 *     -> lobby/scripts/portal/lobby/banner/BannerPopupView.js
 *   cc.X2View -> cc.BannerPopupView
 *
 *   LobbyView.prefabX2Popup      -> prefabBannerPopup
 *   createX2PopupView            -> createBannerPopup
 *   destroyX2PopupView           -> destroyBannerPopup
 *   (sua ca ten thuoc tinh trong scene, neu khong la mat lien ket)
 *
 * GIU NGUYEN uuid cua prefab va cua script: doi uuid la dut moi tham
 * chieu, phai keo lai bang tay trong Cocos.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const A = require('./lib/assets');

const ROOT = A.ASSETS_ROOT;
const WRITE = process.argv.includes('--write');

const OLD_PREFAB = path.join(ROOT, 'prefabs', 'portal', 'x2', 'x2View.prefab');
const NEW_PREFAB_DIR = path.join(ROOT, 'prefabs', 'portal', 'banner');
const NEW_PREFAB = path.join(NEW_PREFAB_DIR, 'bannerPopup.prefab');

const OLD_JS = path.join(ROOT, 'lobby', 'scripts', 'portal', 'x2', 'X2View.js');
const NEW_JS = path.join(ROOT, 'lobby', 'scripts', 'portal', 'lobby', 'banner', 'BannerPopupView.js');

const SCENE = path.join(ROOT, 'lobby', 'scenes', 'MainGame.fire');

const RENAMES = [
  ['prefabX2Popup', 'prefabBannerPopup'],
  ['createX2PopupView', 'createBannerPopup'],
  ['destroyX2PopupView', 'destroyBannerPopup'],
  ['nodeX2Popup', 'nodeBannerPopup'],
  ['cc.X2View', 'cc.BannerPopupView'],
];

const plan = [];

function step(desc, fn) {
  plan.push({ desc, fn });
}

// ── 1. Prefab ───────────────────────────────────────────────────
if (fs.existsSync(OLD_PREFAB)) {
  step(`prefab: portal/x2/x2View.prefab -> portal/banner/bannerPopup.prefab`, () => {
    fs.mkdirSync(NEW_PREFAB_DIR, { recursive: true });

    // .meta cua thu muc moi
    const dirMeta = NEW_PREFAB_DIR + '.meta';
    if (!fs.existsSync(dirMeta)) {
      const P = require('./lib/cocos-prefab');
      fs.writeFileSync(dirMeta, JSON.stringify(P.folderMeta(P.uuid4()), null, 2) + '\n', 'utf8');
    }

    // Doi ten node goc trong noi dung prefab
    const arr = JSON.parse(fs.readFileSync(OLD_PREFAB, 'utf8'));
    for (const o of arr) {
      if (o && o.__type__ === 'cc.Node' && o._name === 'x2View') o._name = 'bannerPopup';
    }
    fs.writeFileSync(NEW_PREFAB, JSON.stringify(arr, null, 2), 'utf8');

    // .meta di theo — GIU NGUYEN uuid
    fs.copyFileSync(OLD_PREFAB + '.meta', NEW_PREFAB + '.meta');

    fs.unlinkSync(OLD_PREFAB);
    fs.unlinkSync(OLD_PREFAB + '.meta');
  });
} else {
  console.log('  (prefab da doi tu truoc)');
}

// ── 2. Script ───────────────────────────────────────────────────
if (fs.existsSync(OLD_JS)) {
  step(`script: portal/x2/X2View.js -> portal/lobby/banner/BannerPopupView.js`, () => {
    let src = fs.readFileSync(OLD_JS, 'utf8');
    src = src.replace(/cc\.X2View/g, 'cc.BannerPopupView');
    src = src.replace(/destroyX2PopupView/g, 'destroyBannerPopup');

    // Ghi chu dau file: giai thich vi sao ten cu gay hieu nham
    const note = '/**\n'
      + ' * BannerPopupView — popup banner hien ngay sau khi dang nhap.\n'
      + ' *\n'
      + ' * Ten cu la X2View, de trong thu muc x2/ nen nghe nhu su kien nap\n'
      + ' * X2. That ra no chi la khung popup cho banner quang cao: bam vao\n'
      + ' * thi mo man nap tien.\n'
      + ' *\n'
      + ' * Su kien X2 that la x2RewardView.prefab — co thanh tien do va nut\n'
      + ' * nhan thuong, goi api/X2Reward/* (api do da chet).\n'
      + ' */\n';
    src = src.replace(/^\/\*\*[\s\S]*?\*\/\n/, note);

    fs.mkdirSync(path.dirname(NEW_JS), { recursive: true });
    fs.writeFileSync(NEW_JS, src, 'utf8');
    fs.copyFileSync(OLD_JS + '.meta', NEW_JS + '.meta');
    fs.unlinkSync(OLD_JS);
    fs.unlinkSync(OLD_JS + '.meta');
  });
} else {
  console.log('  (script da doi tu truoc)');
}

// ── 3. Doi ten trong ma nguon ───────────────────────────────────
const jsToFix = [];
(function walk(d) {
  for (const name of fs.readdirSync(d)) {
    const p = path.join(d, name);
    if (fs.statSync(p).isDirectory()) { walk(p); continue; }
    if (!name.endsWith('.js')) continue;
    // Bo qua chinh file sap duoc chuyen: buoc 2 da sua noi dung roi xoa
    // ban cu, buoc nay dung toi thi khong con file de sua
    if (p === OLD_JS) continue;
    const txt = fs.readFileSync(p, 'utf8');
    if (RENAMES.some(([from]) => txt.includes(from))) jsToFix.push(p);
  }
})(ROOT);

for (const f of jsToFix) {
  step(`sua ten trong ${path.relative(ROOT, f).split(path.sep).join('/')}`, () => {
    let txt = fs.readFileSync(f, 'utf8');
    for (const [from, to] of RENAMES) {
      txt = txt.split(from).join(to);
    }
    fs.writeFileSync(f, txt, 'utf8');
  });
}

// ── 4. Scene: doi TEN THUOC TINH ────────────────────────────────
// Scene luu thuoc tinh theo TEN, doi ten trong script ma khong doi trong
// scene thi lien ket dut — Cocos khong bao gi, chi la prefab bi null.
step('sua ten thuoc tinh trong MainGame.fire', () => {
  let txt = fs.readFileSync(SCENE, 'utf8');
  txt = txt.split('"prefabX2Popup"').join('"prefabBannerPopup"');
  fs.writeFileSync(SCENE, txt, 'utf8');
});

// ── Chay ────────────────────────────────────────────────────────
console.log(`\n${plan.length} viec se lam:\n`);
for (const s of plan) console.log('  - ' + s.desc);

if (!WRITE) {
  console.log('\nChua ghi. Chay lai voi --write de ghi that.');
  process.exit(0);
}

console.log('');
for (const s of plan) {
  s.fn();
  console.log('  ok  ' + s.desc);
}
console.log('\nXong. Kiem lai bang:');
console.log('  node tools/prefab/validate-scene.js');
console.log('  node tools/prefab/validate.js');
