/**
 * fix-jackpot-effect.js — tat animation cu cua thong bao no hu + dat node vao
 * giua man hinh phia tren.
 *
 *   node tools/prefab/fix-jackpot-effect.js          (xem truoc, khong ghi)
 *   node tools/prefab/fix-jackpot-effect.js --write  (ghi that)
 *
 * VI SAO
 * ------
 * Thong bao no hu chay nhung KHONG AI NHIN THAY. Do runtime that:
 *
 *     luc tao ra   WORLD x = 1350.732
 *     sau 0.5s     WORLD x = 1992.787     <- anim da chay xong
 *     man hinh rong        = 1561
 *     => lot ra ngoai mep phai 431.8px
 *
 * Chenh lech 1992.787 - 1350.732 = 642.055, dung bang track 'position' trong
 * fadeOut.anim. Node dat setPosition(0,0) nhung anim GHI DE thanh
 * (642.055, 233.576).
 *
 * fadeOut.anim la clip HIEN RA (playOnLoad, opacity 0->255, scale 0->1) — ten
 * bi dat nguoc. Ngoai opacity/scale no con keo ca vi tri, va toa do do la rac
 * thua tu node goc luc dung anim: clip nay dung CHUNG voi btnMINI (MINIView.js)
 * va TOPJackpotWinView (TopJackpotView.js), khong node nao co toa do trung.
 *
 * CHON TAT ANIMATION, KHONG NHAN BAN CLIP: user chot "bo animation cu di, cho
 * hien thi thay duoc da, sau muon animation the nao se bao". Tat playOnLoad la
 * du — prefab co san opacity 255 / scale 1 nen hien ngay. Khong dung toi 2 clip
 * dung chung, btnMINI va TOPJackpotWinView giu nguyen hanh vi.
 *
 * VI TRI
 * ------
 * Sau khi tat anim, node hieu ung nam DUNG tai vi tri cua lobbyEffectView.
 * Cha 'widget-top-left-noHide' co goc o WORLD (780.5, 732) — tinh nguoc tu so
 * do runtime: world(1350.732, 136.4) - local(570.232, -595.6).
 *
 *     local = world mong muon - (780.5, 732)
 *
 * Doi vi tri: sua TARGET_WORLD ben duoi roi chay lai voi --write.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const Backup = require('./lib/backup');
const A = require('./lib/assets');

const SCENE = path.join(A.ASSETS_ROOT, 'lobby', 'scenes', 'MainGame.fire');
const PREFAB = path.join(A.ASSETS_ROOT, 'prefabs', 'portal', 'lobbyEffectItem.prefab');

/** Goc cua node cha, do duoc luc chay that. */
const PARENT_WORLD = { x: 780.5, y: 732 };

/** Man hinh thiet ke — de canh bao neu dat ra ngoai. */
const SCREEN = { w: 1561, h: 732 };

/**
 * Cho no hu hien o giua man hinh, hoi cao. Prefab neo (0, 0.5) va noi dung trai
 * rong tu -113 den +135 theo x, nen dat x = giua man hinh la banner can doi.
 */
const TARGET_WORLD = { x: 780.5, y: 620 };

const WRITE = process.argv.includes('--write');

// ─────────────────────────────────────────────────────────────────

function main() {
  const actions = [];

  // ── 1. Prefab: tat playOnLoad ────────────────────────────────
  const prefabRaw = fs.readFileSync(PREFAB, 'utf8');
  const prefab = JSON.parse(prefabRaw);

  const animIdx = prefab.findIndex((o) => o && o.__type__ === 'cc.Animation');
  if (animIdx < 0) {
    console.error('Khong tim thay cc.Animation trong lobbyEffectItem.prefab');
    process.exit(1);
  }
  const anim = prefab[animIdx];

  if (anim.playOnLoad) {
    actions.push({
      desc: `prefab [${animIdx}] cc.Animation.playOnLoad: true -> false  (tat clip fadeOut keo vi tri)`,
      run: () => { anim.playOnLoad = false; },
    });
  } else {
    console.log('prefab: playOnLoad da tat tu truoc — bo qua.');
  }

  // ── 2. Scene: dat lai vi tri lobbyEffectView ─────────────────
  const sceneRaw = fs.readFileSync(SCENE, 'utf8');
  const scene = JSON.parse(sceneRaw);

  const nodeIdx = scene.findIndex(
    (o) => o && o.__type__ === 'cc.Node' && o._name === 'lobbyEffectView'
  );
  if (nodeIdx < 0) {
    console.error('Khong tim thay node lobbyEffectView trong MainGame.fire');
    process.exit(1);
  }
  const node = scene[nodeIdx];

  const wantX = TARGET_WORLD.x - PARENT_WORLD.x;
  const wantY = TARGET_WORLD.y - PARENT_WORLD.y;

  const curX = node._trs.array[0];
  const curY = node._trs.array[1];

  if (curX !== wantX || curY !== wantY) {
    actions.push({
      desc: `scene [${nodeIdx}] lobbyEffectView: (${curX}, ${curY}) -> (${wantX}, ${wantY})`
        + `   => WORLD (${TARGET_WORLD.x}, ${TARGET_WORLD.y})`,
      run: () => { node._trs.array[0] = wantX; node._trs.array[1] = wantY; },
    });
  } else {
    console.log('scene: vi tri da dung — bo qua.');
  }

  // ── Bao cao ──────────────────────────────────────────────────
  console.log('');
  console.log(`Vi tri hien tai : WORLD (${(curX + PARENT_WORLD.x).toFixed(1)}, ${(curY + PARENT_WORLD.y).toFixed(1)})`);
  console.log(`Vi tri se dat   : WORLD (${TARGET_WORLD.x}, ${TARGET_WORLD.y})`);
  console.log(`Man hinh        : ${SCREEN.w} x ${SCREEN.h}`);

  // Prefab neo (0, 0.5); noi dung trai -113.23 .. +135.23 theo x, -80.02 .. +46.02 theo y
  const box = {
    left: TARGET_WORLD.x - 113.23,
    right: TARGET_WORLD.x + 135.23,
    bottom: TARGET_WORLD.y - 80.02,
    top: TARGET_WORLD.y + 46.02,
  };
  console.log(`Khung banner    : x ${box.left.toFixed(0)}..${box.right.toFixed(0)}`
    + `  y ${box.bottom.toFixed(0)}..${box.top.toFixed(0)}`);

  const off = [];
  if (box.left < 0) off.push('lot mep TRAI');
  if (box.right > SCREEN.w) off.push('lot mep PHAI');
  if (box.bottom < 0) off.push('lot mep DUOI');
  if (box.top > SCREEN.h) off.push('lot mep TREN');
  if (off.length) {
    console.error('');
    console.error('DUNG LAI — vi tri nay nam ngoai man hinh: ' + off.join(', '));
    console.error('Sua TARGET_WORLD trong script roi chay lai.');
    process.exit(1);
  }
  console.log('Kiem khung      : nam TRON trong man hinh. OK');
  console.log('');

  if (!actions.length) {
    console.log('Khong co gi de lam.');
    return;
  }

  console.log(`${actions.length} viec se lam:`);
  for (const a of actions) console.log('  - ' + a.desc);

  if (!WRITE) {
    console.log('');
    console.log('Chua ghi. Chay lai voi --write de ghi that.');
    return;
  }

  console.log('');
  for (const a of actions) { a.run(); console.log('  ok  ' + a.desc); }

  const bakPrefab = Backup.save(PREFAB, prefabRaw);
  const bakScene = Backup.save(SCENE, sceneRaw);
  fs.writeFileSync(PREFAB, JSON.stringify(prefab, null, 2), 'utf8');
  fs.writeFileSync(SCENE, JSON.stringify(scene, null, 2), 'utf8');

  console.log('');
  console.log(`Da ghi. Ban cu o ${bakPrefab} va ${bakScene}`);
}

main();
