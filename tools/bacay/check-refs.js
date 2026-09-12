/**
 * check-refs.js — mọi uuid mà prefab trỏ tới có tồn tại thật không.
 *
 * VÌ SAO CẦN: prefab tham chiếu asset bằng uuid. Nếu một .meta được sinh lại với uuid
 * MỚI thì prefab vẫn hợp lệ, Cocos vẫn mở được, chỉ là ô ảnh trống. Không một dòng lỗi
 * nào. Đây là loại hỏng im lặng tệ nhất trong cả chuỗi công cụ này, và nó xảy ra mỗi
 * lần bộ sinh bundle không ổn định.
 *
 * `validate.js` của tools/prefab kiểm CẤU TRÚC prefab; tệp này kiểm LIÊN KẾT giữa
 * prefab và bundle. Hai việc khác nhau, cần cả hai.
 *
 * Chạy:  node tools/bacay/check-refs.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const CLIENT = path.resolve(__dirname, '..', '..');
const ASSETS = path.join(CLIENT, 'assets');
const BUNDLE = path.join(ASSETS, 'bacay');
const BUILTIN = require('../prefab/lib/builtin-uuids.json').uuids;

/** Mọi uuid mà các .meta trong assets/ khai báo (cấp 1 + subMetas). */
function uuidCoThat() {
  const co = new Map();   // uuid -> mô tả ngắn

  const quet = (d) => {
    for (const ten of fs.readdirSync(d)) {
      const p = path.join(d, ten);
      let st;
      try { st = fs.statSync(p); } catch { continue; }
      if (st.isDirectory()) { quet(p); continue; }
      if (!ten.endsWith('.meta')) continue;

      let j;
      try { j = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
      const nhan = path.relative(ASSETS, p).replace(/\.meta$/, '').replace(/\\/g, '/');

      if (j.uuid) co.set(j.uuid, nhan);
      for (const [k, v] of Object.entries(j.subMetas || {})) {
        if (v && v.uuid) co.set(v.uuid, `${nhan}#${k}`);
      }
    }
  };

  quet(ASSETS);
  for (const [u, ten] of Object.entries(BUILTIN)) co.set(u, `@builtin:${ten}`);
  return co;
}

/**
 * Kiem tep tro toi anh bang TEN TUONG DOI — plist, .atlas cua spine, .fnt.
 *
 * Ba dinh dang nay deu ghi ten anh BEN TRONG noi dung, khong phai uuid. Doi ten tep
 * ma quen sua dong do thi Cocos khong tim ra texture, va hau qua HOAN TOAN IM LANG:
 * anh trong suot, chu rong tuech, prefab van hop le, ca hai bo kiem kia van xanh.
 *
 * Toi da dinh dung loi nay BA LAN o ba dinh dang khac nhau. Nen gio kiem bang may.
 */
function kiemTenTuongDoi() {
  const loi = [];

  const quet = (d) => {
    for (const ten of fs.readdirSync(d)) {
      const p = path.join(d, ten);
      if (fs.statSync(p).isDirectory()) { quet(p); continue; }

      let canhAnh = [];
      if (ten.endsWith('.plist')) {
        const tho = fs.readFileSync(p, 'utf8');
        canhAnh = [...tho.matchAll(/<key>(?:real)?[Tt]extureFileName<\/key>\s*<string>([^<]+)<\/string>/g)]
          .map((m) => m[1]);
      } else if (ten.endsWith('.atlas')) {
        canhAnh = fs.readFileSync(p, 'utf8').split(String.fromCharCode(10))
          .filter(function (l) { return /[.]png\s*$/.test(l.trim()); });
      } else if (ten.endsWith('.fnt')) {
        const m = /file="([^"]+)"/.exec(fs.readFileSync(p, 'utf8'));
        if (m) canhAnh = [m[1]];
      } else continue;

      for (const anh of canhAnh) {
        const dich = path.join(path.dirname(p), anh.trim());
        if (!fs.existsSync(dich)) {
          loi.push(`${path.relative(ASSETS, p)}  →  "${anh.trim()}" KHÔNG tồn tại cạnh nó`);
        }
      }
    }
  };

  quet(BUNDLE);
  return loi;
}

function main() {
  const co = uuidCoThat();
  const thuMuc = path.join(BUNDLE, 'prefab');
  const tep = fs.readdirSync(thuMuc).filter((f) => f.endsWith('.prefab'));

  console.log(`${co.size} uuid có thật trong assets/ (kể cả asset dựng sẵn của engine)\n`);

  let hong = 0;
  let tongRef = 0;

  for (const f of tep) {
    const tho = fs.readFileSync(path.join(thuMuc, f), 'utf8');
    const refs = [...tho.matchAll(/"__uuid__"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
    const riengBiet = [...new Set(refs)];
    tongRef += refs.length;

    const mat = riengBiet.filter((u) => !co.has(u));
    if (mat.length) {
      console.log(`❌ ${f}  —  ${mat.length}/${riengBiet.length} uuid KHÔNG tồn tại`);
      for (const u of mat.slice(0, 6)) console.log(`      ${u}`);
      hong += mat.length;
    } else {
      console.log(`✅ ${f.padEnd(22)} ${refs.length} tham chiếu, ${riengBiet.length} uuid, đều có thật`);
    }
  }

  console.log(`\nTổng ${tongRef} tham chiếu trong ${tep.length} prefab.`);

  const loiTen = kiemTenTuongDoi();
  if (loiTen.length) {
    console.error(`
❌ ${loiTen.length} tệp trỏ tới ảnh KHÔNG tồn tại (plist / .atlas / .fnt):`);
    for (const x of loiTen) console.error('   ' + x);
    hong += loiTen.length;
  } else {
    console.log('✅ Mọi plist / .atlas / .fnt đều trỏ tới ảnh có thật cạnh nó.');
  }

  if (hong) {
    console.error(`\n❌ ${hong} uuid trỏ vào hư không. Gần như chắc chắn là bộ sinh bundle đã ` +
      `cấp uuid MỚI cho asset cũ — chạy lại gen-prefab.js sau khi bundle.js.`);
    process.exit(1);
  }
  console.log('✅ Mọi tham chiếu đều giải được.');
}

main();
