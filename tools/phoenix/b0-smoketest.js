/**
 * b0-smoketest.js — sinh PhoenixSmokeTest: prefab NHO NHAT chua du 5 co che
 * hong-im-lang nguy hiem nhat khi sinh prefab bang code.
 *
 * Y TUONG
 * Voi vong phan hoi cham (phai cho nguoi mo Cocos), sai lam la lam bai test
 * that don gian cho "an toan". Lam nguoc lai: nhoi du 5 co che nguy hiem vao
 * mot prefab 4 node, nhung bo tri sao cho MOI LOI CHO MOT TRIEU CHUNG KHAC NHAU
 * — nhin mot anh chup la biet hong cho nao, khong phai thu 5 vong.
 *
 * 5 co che duoc kiem, va trieu chung rieng cua tung cai:
 *   1. uuid sprite-frame vs texture   -> nen KHONG den
 *   2. cid script                     -> Inspector bao "Missing script"
 *   3. bitmap font + encoding UTF-8   -> mat dau tieng Viet, hoac ra font Arial
 *   4. _N$skeletonData + _cacheMode   -> long vu TRANG, hoac dung im khong doi dong tac
 *   5. bind @property qua refComp     -> chay Preview ma nhan so van RONG
 *
 * Chay:  node tools/phoenix/b0-smoketest.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const P = require('../prefab/lib/cocos-prefab');
const A = require('../prefab/lib/assets');
const TS = require('../prefab/lib/ts');
const Backup = require('../prefab/lib/backup');
const R = require('./reg');

// Script nam o bundle `lobby` (nap luc boot), art nam o bundle `phoenix` (nap
// lazy). Day la quy uoc toan du an — 11/11 game deu the. Dat script vao bundle
// game thi prefab khong resolve duoc lop cho toi khi bundle game nap xong.
const SCRIPT_DIR = 'lobby/scripts/minigame/phoenix';
const SCRIPT_NAME = 'PhoenixSmokeTest';
const PREFAB_REL = 'phoenix/prefab/PhoenixSmokeTest.prefab';

/**
 * Dau ban dung. TANG TAY moi lan sua bai test.
 * Muc dich: nguoi mo Cocos doc dong log "[PHX-SMOKE] onLoad OK, build=..." la
 * biet ngay Creator dang chay ban MOI hay ban cu con trong cache — thieu dau
 * nay thi moi lan sua xong lai phai doan xem "khong doi gi" la do sua khong an
 * hay do Cocos chua nap lai.
 */
const BUILD_TAG = 'B0-002';

// ─────────────────────────────────────────────────────────────────
// 1. Ma nguon TypeScript
// ─────────────────────────────────────────────────────────────────
//
// Ba dieu co y trong script nay:
//  - lbDynamic de RONG trong prefab, script moi gan gia tri -> phan biet tuyet
//    doi "prefab song" voi "script song".
//  - doi animation luc chay (default_idle -> active_idle) -> kiem _cacheMode:
//    neu dat nham che do cache thi setAnimation() chet cam, spine dung im.
//  - moi nhanh hong deu cc.error() kem tien to [PHX-SMOKE] -> loc Console de biet.

const SOURCE = `const { ccclass, property } = cc._decorator;

/**
 * PhoenixSmokeTest — component kiem dinh dang prefab sinh bang code.
 * Xoa sau khi qua duoc CHECKPOINT 1. Khong phai code cua game.
 */
@ccclass
export default class PhoenixSmokeTest extends cc.Component {

    @property(cc.Label)
    lbDynamic: cc.Label = null;

    @property(sp.Skeleton)
    spFeather: sp.Skeleton = null;

    /** Dau ban dung — tang tay moi lan sua, de biet Cocos dang doc ban nao. */
    public static BUILD: string = '${BUILD_TAG}';

    onLoad() {
        cc.log('[PHX-SMOKE] onLoad OK, build=' + PhoenixSmokeTest.BUILD);

        if (this.lbDynamic) {
            // font_money_3 chi co 21 glyph: so + dau phan cach. Du cho chuoi nay.
            this.lbDynamic.string = '1.234.567';
        } else {
            cc.error('[PHX-SMOKE] lbDynamic = NULL -> bind @property HONG');
        }

        if (this.spFeather) {
            // Doi dong tac luc chay. Neu _cacheMode khac 0 thi lenh nay chet cam.
            this.spFeather.setAnimation(0, '${R.anim.feather.ACTIVE}', true);
            cc.log('[PHX-SMOKE] spFeather -> ${R.anim.feather.ACTIVE}');
        } else {
            cc.error('[PHX-SMOKE] spFeather = NULL -> bind spine HONG');
        }
    }
}
`;

// ─────────────────────────────────────────────────────────────────
// 2. Cay node
// ─────────────────────────────────────────────────────────────────

function buildTree(scriptCid) {
  return P.node(
    'PhoenixSmokeTest',
    { size: [640, 360] },
    [
      // Nhan tinh: font DU dau tieng Viet + chuoi CO dau -> bat loi encoding.
      //
      // ⚠️ Ban dau cho dau gach ngang DAI `—` (U+2014) vao day. Preview chay
      // duoc, chu hien ra, chi thieu mot gach va mot dong warn chim trong
      // Console: "Can't find letter definition ... for letter:—".
      // roboto_30 co du ASCII + 134 ky tu co dau nhung KHONG co dau cau kieu
      // chu (— – … “ ” ‘ ’ · × ₫ •). Gio moi nhan deu di qua R.label() de nem
      // loi ngay thay vi de lai khoang trong.
      P.node('lbStatic', { pos: [0, 120], size: [600, 44] }, [], [
        R.label('PHOENIX PREFAB OK - Tiếng Việt có dấu đủ đặng', {
          font: R.font.roboto_30,
          size: 30,
          lineHeight: 34,
          hAlign: 1,
        }, 'lbStatic'),
      ]),

      // Nhan dong: RONG trong prefab, script gan luc chay.
      P.node('lbDynamic', { pos: [0, 55], size: [420, 48], ref: 'lbDynamic' }, [], [
        R.label('', { font: R.font.money_3, size: 36, lineHeight: 42, hAlign: 1 }, 'lbDynamic'),
      ]),

      // Spine long vu: dat dong tac IDLE, script doi sang ACTIVE luc chay.
      P.node('spFeather', { pos: [0, -70], size: [120, 160], ref: 'spFeather' }, [], [
        P.skeleton(R.spine.feather, {
          skin: 'default',
          anim: R.anim.feather.IDLE,
          loop: true,
        }),
      ]),
    ],
    [
      // Nen den — kiem uuid SPRITE-FRAME (khong phai uuid texture).
      P.sprite(R.img.black, { type: 0, sizeMode: 0 }),
      // Script + hai bind qua refComp.
      P.script(scriptCid, {
        lbDynamic: P.refComp('lbDynamic', 'cc.Label'),
        spFeather: P.refComp('spFeather', 'sp.Skeleton'),
      }),
    ]
  );
}

// ─────────────────────────────────────────────────────────────────
// 3. Chay
// ─────────────────────────────────────────────────────────────────

function main() {
  console.log('--- B0 smoke test ---');

  // (a0) .meta cua thu muc script — Cocos bat buoc moi thu muc trong assets/
  // phai co. Thieu thi Cocos tu sinh uuid moi moi lan, tao diff lung tung.
  const scriptDirAbs = path.join(A.ASSETS_ROOT, SCRIPT_DIR);
  fs.mkdirSync(scriptDirAbs, { recursive: true });
  const scriptDirMeta = scriptDirAbs + '.meta';
  if (!fs.existsSync(scriptDirMeta)) {
    P.writeCocosJson(scriptDirMeta, P.folderMeta(P.uuid4()));
    console.log(`  thu muc: ${SCRIPT_DIR}/  (sinh .meta)`);
  }

  // (a) Script truoc: prefab can cid cua no.
  TS.assertSingleComponent(SOURCE, SCRIPT_NAME);
  const sc = TS.writeScript(SCRIPT_DIR, SCRIPT_NAME, SOURCE);
  console.log(
    `  script : ${sc.rel}  uuid=${sc.uuid}  ${sc.created ? '(sinh moi)' : '(dung lai uuid cu)'}`
  );
  console.log(`           cid = ${sc.cid}`);

  // (b) Prefab — giu uuid cu neu da tung sinh (doi uuid = dut tham chieu, im lang).
  const prefabAbs = path.join(A.ASSETS_ROOT, PREFAB_REL);
  const metaAbs = prefabAbs + '.meta';
  let pfUuid = null;
  if (fs.existsSync(metaAbs)) {
    pfUuid = JSON.parse(fs.readFileSync(metaAbs, 'utf8')).uuid;
    Backup.save(prefabAbs, fs.readFileSync(prefabAbs, 'utf8'));
  }
  pfUuid = pfUuid || P.uuid4();

  const json = P.build(buildTree(sc.cid), pfUuid);

  // 🔴 Noi dung TRUOC, .meta SAU. Creator quet va di chuyen .meta "mo coi" sang
  // temp/RemovedMetas/ moi lan mo project (log 08/09: da an 12 file nhu vay).
  P.writeCocosJson(prefabAbs, json);
  P.writeCocosJson(metaAbs, P.prefabMeta(pfUuid));

  console.log(`  prefab : ${PREFAB_REL}  uuid=${pfUuid}`);
  console.log(`           ${json.length} phan tu JSON`);

  // (c) Tu kiem ngay — khong de sai lot sang vong cho nguoi mo Cocos.
  const nodes = json.filter((x) => x.__type__ === 'cc.Node').length;
  const comps = json.filter((x) => x.__type__ && !['cc.Node', 'cc.Prefab', 'cc.PrefabInfo'].includes(x.__type__)).length;
  console.log(`           ${nodes} node, ${comps} component`);

  const raw = fs.readFileSync(prefabAbs);
  const loi = [];
  if (raw[0] === 0xef) loi.push('file co BOM');
  if (raw.includes('\r')) loi.push('co ky tu CR (phai LF thuan)');
  if (raw[raw.length - 1] === 0x0a) loi.push('co newline o cuoi (Cocos khong ghi)');
  if (!raw.toString('utf8').includes('Tiếng Việt')) loi.push('mat dau tieng Viet');
  if (loi.length) {
    console.error('  x DINH DANG SAI: ' + loi.join(' | '));
    process.exit(1);
  }
  console.log('           dinh dang byte: LF, khong BOM, khong newline cuoi, dau tieng Viet con nguyen');
  console.log('');
  console.log('Tiep theo:  node tools/prefab/validate.js assets/' + PREFAB_REL);
}

main();
