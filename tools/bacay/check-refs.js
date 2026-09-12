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

  if (hong) {
    console.error(`\n❌ ${hong} uuid trỏ vào hư không. Gần như chắc chắn là bộ sinh bundle đã ` +
      `cấp uuid MỚI cho asset cũ — chạy lại gen-prefab.js sau khi bundle.js.`);
    process.exit(1);
  }
  console.log('✅ Mọi tham chiếu đều giải được.');
}

main();
