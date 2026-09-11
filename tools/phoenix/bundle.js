/**
 * bundle.js — dung bundle `phoenix` MOI, sach, chi chua asset THAT SU DUNG.
 *
 * BOI CANH
 * Bundle cu (523 tep / 43,3 MB) da chuyen ra `_reference/phoenix_old/` — ngoai
 * `assets/` nen Cocos khong import, khong vao ban build, nhung van doc duoc de
 * doi chieu. Do duoc: **61% dung luong cua no khong ai tham chieu** (340 tep /
 * 26,2 MB), gom ca `icon lobby.png` 4,2 MB va 8 tep nhac nen ~8 MB.
 *
 * NGUYEN TAC
 * Bundle moi KHONG chep ca thu muc. Moi tep phai co ten trong DANH MUC duoi
 * day, kem ly do dung o dau. Khong co ten trong danh muc = khong vao bundle.
 *
 * GIU NGUYEN UUID khi chep: chep ca tep lan `.meta` di kem. Lam duoc vi ban cu
 * da nam NGOAI `assets/` — neu con trong `assets/` thi se co hai tep trung uuid,
 * Cocos tu sinh lai mot cai va lam dut tham chieu ma khong bao gi.
 *
 * TEN THU MUC MOI — so it, khong hau to `_sp`:
 *   art/ font/ spine/ audio/ fx/ prefab/
 * Hau to `_sp` (Sun Phung) chi co nghia khi con lan ban cu; gio ca bundle deu la
 * Sun Phung nen bo di. Ten moi cung tranh 5 thu muc cu dang bi bo theo doi tep
 * cua trinh soan thao giu handle (fonts, images, spines, spines_sp, sprites_sp).
 *
 * Chay:  node tools/phoenix/bundle.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const P = require('../prefab/lib/cocos-prefab');

const CLIENT = path.resolve(__dirname, '..', '..');
const OLD = path.join(CLIENT, '_reference', 'phoenix_old');
const NEW = path.join(CLIENT, 'assets', 'phoenix');
const BUNDLE_META = path.join(CLIENT, 'assets', 'phoenix.meta');

/** uuid cua bundle cu — giu lai de khong doi danh tinh bundle. */
const BUNDLE_UUID = 'a3f7a02d-1b1b-41e5-9738-7d035cd7e2f3';

/** Thu muc cua bundle moi. */
const DIRS = ['art', 'font', 'spine', 'audio', 'fx', 'prefab'];

/**
 * DANH MUC ASSET.
 *
 * `nhom`  — chep ca cum tep anh em (spine = .skel + .atlas + .png;
 *           bitmap font = .fnt + .png). Thieu mot manh la hong im lang:
 *           .fnt tro toi anh bang ten tuong doi `file="..."`, khong phai uuid.
 * `bac`   — bac nao can den no. De sau nay biet tep nao vao vi ly do gi.
 */
const DANH_MUC = [
  // ── B0: smoke test ──────────────────────────────────────────────
  { bac: 'B0', cu: 'images/black.png', moi: 'art/black.png', ly_do: 'nen den cua bai test' },
  {
    bac: 'B0',
    cu: 'fonts_sp/roboto_30.fnt',
    moi: 'font/roboto_30.fnt',
    nhom: ['fonts_sp/roboto_30.png'],
    ly_do: '230 glyph, DU dau tieng Viet — font chu chinh',
  },
  {
    bac: 'B0',
    cu: 'fonts_sp/font_money_3.fnt',
    moi: 'font/font_money_3.fnt',
    nhom: ['fonts_sp/font_money_3.png'],
    ly_do: '21 glyph, chi so — font tien',
  },
  {
    bac: 'B0',
    cu: 'spines_sp/feather/feather.skel',
    moi: 'spine/feather/feather.skel',
    nhom: ['spines_sp/feather/feather.atlas', 'spines_sp/feather/feather.png'],
    ly_do: 'long vu — 5 dong tac appear/default_idle/active_idle/transfer/jackpot',
  },
];

// ─────────────────────────────────────────────────────────────────

function meoDuongDan(rel) {
  return rel.split('/').join(path.sep);
}

/** Chep mot tep + `.meta` di kem, giu nguyen uuid. */
function chep(cu, moi, ghiChu) {
  const src = path.join(OLD, meoDuongDan(cu));
  const dst = path.join(NEW, meoDuongDan(moi));
  if (!fs.existsSync(src)) throw new Error(`Khong co trong ban cu: ${cu}`);
  const srcMeta = src + '.meta';
  if (!fs.existsSync(srcMeta)) throw new Error(`Thieu .meta: ${cu}.meta`);

  fs.mkdirSync(path.dirname(dst), { recursive: true });

  // 🔴 Noi dung TRUOC, .meta SAU — Cocos quet va nuot `.meta` mo coi
  // (log 08/09 da an 12 tep nhu vay sang temp/RemovedMetas/).
  fs.copyFileSync(src, dst);
  fs.copyFileSync(srcMeta, dst + '.meta');

  const uuid = JSON.parse(fs.readFileSync(srcMeta, 'utf8')).uuid;
  const kb = (fs.statSync(src).size / 1024).toFixed(0);
  console.log(`    ${moi.padEnd(38)} ${String(kb).padStart(6)} KB  ${uuid.slice(0, 8)}  ${ghiChu || ''}`);
  return { moi, uuid };
}

function main() {
  console.log('--- dung bundle phoenix moi ---');
  if (!fs.existsSync(OLD)) throw new Error('Khong thay ' + OLD);

  // 1. Cau hinh bundle. `priority` kieu SO (ban cu ghi chuoi "5" — lech chuan,
  //    common/sicbo deu ghi so). Anh huong thu tu tranh chap asset dung chung.
  fs.mkdirSync(NEW, { recursive: true });
  P.writeCocosJson(BUNDLE_META, {
    ver: '1.1.3',
    uuid: BUNDLE_UUID,
    importer: 'folder',
    isBundle: true,
    bundleName: 'phoenix',
    priority: 5,
    compressionType: {},
    optimizeHotUpdate: {},
    inlineSpriteFrames: {},
    isRemoteBundle: {},
    subMetas: {},
  });
  console.log('  cau hinh: assets/phoenix.meta  bundleName=phoenix  priority=5 (kieu so)');

  // 2. Thu muc + .meta cua tung thu muc
  console.log('  thu muc:');
  for (const d of DIRS) {
    const abs = path.join(NEW, d);
    fs.mkdirSync(abs, { recursive: true });
    const metaAbs = abs + '.meta';
    const uuid = fs.existsSync(metaAbs)
      ? JSON.parse(fs.readFileSync(metaAbs, 'utf8')).uuid
      : P.uuid4();
    P.writeCocosJson(metaAbs, P.folderMeta(uuid));
    console.log(`    ${d}/`);
  }

  // 3. Chep theo danh muc
  console.log('  asset:');
  let n = 0;
  const theoBac = {};
  for (const m of DANH_MUC) {
    chep(m.cu, m.moi, m.ly_do);
    n++;
    for (const g of m.nhom || []) {
      // tep anh em di theo: giu nguyen ten, doi thu muc theo tep chinh
      const ten = g.split('/').pop();
      const thuMuc = m.moi.split('/').slice(0, -1).join('/');
      chep(g, thuMuc + '/' + ten, '(di kem)');
      n++;
    }
    theoBac[m.bac] = (theoBac[m.bac] || 0) + 1;
  }

  // .meta cho thu muc con moi sinh (vd spine/feather).
  //
  // ⚠️ CHI di vao cac thu muc trong DIRS. Khong quet ca NEW: trong do con vai
  // VO THU MUC RONG cua bundle cu (fonts/ images/ spines/ spines_sp/ sprites_sp/)
  // dang bi bo theo doi tep cua trinh soan thao giu handle — Windows danh dau
  // xoa nhung chua xoa duoc, doc vao la EPERM. Chung rong, se tu bien mat khi
  // handle duoc nha; dung sinh .meta cho chung.
  for (const d of DIRS) {
    (function metaThuMucCon(dir) {
      let ds;
      try {
        ds = fs.readdirSync(dir);
      } catch (e) {
        return; // thu muc kẹt — bo qua
      }
      for (const name of ds) {
        const p = path.join(dir, name);
        let st;
        try {
          st = fs.statSync(p);
        } catch (e) {
          continue;
        }
        if (!st.isDirectory()) continue;
        const metaAbs = p + '.meta';
        if (!fs.existsSync(metaAbs)) {
          P.writeCocosJson(metaAbs, P.folderMeta(P.uuid4()));
          console.log(`    (meta thu muc) ${path.relative(NEW, p).split(path.sep).join('/')}/`);
        }
        metaThuMucCon(p);
      }
    })(path.join(NEW, d));
  }

  // 4. Bao cao
  let tong = 0;
  for (const d of DIRS) {
    tong += (function dem(dir) {
      let s = 0;
      let ds;
      try {
        ds = fs.readdirSync(dir);
      } catch (e) {
        return 0;
      }
      for (const name of ds) {
        const p = path.join(dir, name);
        const st = fs.statSync(p);
        if (st.isDirectory()) s += dem(p);
        else if (!name.endsWith('.meta')) s += st.size;
      }
      return s;
    })(path.join(NEW, d));
  }
  console.log('');
  console.log(`  => ${n} tep asset, ${(tong / 1024).toFixed(0)} KB`);
  console.log(`     theo bac: ${Object.entries(theoBac).map(([k, v]) => k + '=' + v).join(', ')}`);
  console.log(`     (ban cu: 523 tep / 43,3 MB — trong do 340 tep / 26,2 MB khong ai dung)`);
}

main();
