/**
 * diff-go88.js — đối chiếu TỪNG NODE của prefab đã sinh với prefab gốc Go88.
 *
 * VÌ SAO CẦN: ba bộ kiểm kia canh cấu trúc và liên kết, không canh "có giống bản gốc
 * không". Chủ dự án đã phải tự mở Cocos và tìm ra BA lần tôi bỏ sót một trường:
 *
 *   1. `_color`            → mọi chữ ra trắng
 *   2. `_originalWidth/Height` của Widget → mở prefab ra 960x640 thay vì 1560x720
 *   3. (trước đó) `_contentSize.width` vắng mặt bị JSON.stringify nuốt
 *
 * Ba lần cùng một hình dạng: một trường không được rút, và hậu quả chỉ thấy bằng MẮT.
 * Nên thay vì chờ tìm ra cái thứ tư, so thẳng với bản gốc bằng máy.
 *
 * KHÔNG so những thứ CỐ Ý khác: uuid (dự án khác), node đã cắt (đồ Poker / trang trí
 * theo mùa), script riêng của Go88.
 *
 * Chạy:  node tools/bacay/diff-go88.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const GO88 = 'C:\\Reverse\\go88_reverse\\assets';
const BUNDLE = path.resolve(__dirname, '..', '..', 'assets', 'bacay');

const CAP = [
  { go88: 'BaCay/prefabs/CardGameTableCaoRua_c09fb89e.prefab', cua_toi: 'BanCaoRua' },
  { go88: 'BaCay/prefabs/BaCayController_23ef3f28.prefab', cua_toi: 'MocViTri' },
  { go88: 'BaCay/prefabs/BaCayScoreUI_7d0053ce.prefab', cua_toi: 'BangDiem' },
  { go88: 'BaCay/prefabs/BaCayAnimExtratime_0e13e9ae.prefab', cua_toi: 'RutThemLa' },
  { go88: '_shared/prefabs/PlayerView_201107e0.prefab', cua_toi: 'GheNguoiChoi' },
  { go88: '_shared/prefabs/Card_bc_bc29c05f.prefab', cua_toi: 'LaBai' },
  { go88: '_shared/prefabs/BtnInvite_875cabc3.prefab', cua_toi: 'NutMoi' },
  { go88: '_shared/prefabs/RoomScenebinhThuongXocDia_25d010ef.prefab', cua_toi: 'SanhChonBan' },
];

/**
 * Component HOÃN CÓ CHỦ ĐÍCH — thư viện dùng chung chưa có builder cho chúng.
 *
 * Vẫn IN RA mỗi lần chạy chứ không im lặng bỏ qua: hoãn là một quyết định, và quyết
 * định thì phải nhìn thấy được.
 */
const HOAN = {
  'cc.Toggle': 'công tắc tự động lật bài — lệnh FLIP đã có cờ `all` nên chưa cần',
  'cc.SkeletonAnimation': 'hoạt cảnh spine phụ trên bảng điểm — chưa dùng ở bản 1',
};

/** Sai số cho phép khi so số thực — Cocos ghi toạ độ dạng dấu phẩy động. */
const SAI_SO = 0.01;

function gan(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) < SAI_SO;
  return a === b;
}

/** Rút đặc điểm của một node để so. Khoá là ĐƯỜNG DẪN trong cây, không phải tên. */
function dacDiem(mang, goc) {
  const ra = new Map();

  const di = (id, duong) => {
    const n = mang[id];
    if (!n || n.__type__ !== 'cc.Node') return;

    const p = n._position || {};
    const cs = n._contentSize || {};
    const ap = n._anchorPoint || {};
    const c = n._color || {};
    const trs = n._trs && n._trs.array ? n._trs.array : null;

    ra.set(duong, {
      x: trs ? trs[0] : (p.x || 0),
      y: trs ? trs[1] : (p.y || 0),
      w: cs.width || 0,
      h: cs.height || 0,
      anchorX: ap.x === undefined ? 0.5 : ap.x,
      anchorY: ap.y === undefined ? 0.5 : ap.y,
      scaleX: trs ? trs[7] : (n._scaleX === undefined ? 1 : n._scaleX),
      scaleY: trs ? trs[8] : (n._scaleY === undefined ? 1 : n._scaleY),
      r: c.r === undefined ? 255 : c.r,
      g: c.g === undefined ? 255 : c.g,
      b: c.b === undefined ? 255 : c.b,
      opacity: n._opacity === undefined ? 255 : n._opacity,
      active: n._active !== false,
      comps: (n._components || [])
        .map((x) => (mang[x.__id__] || {}).__type__)
        .filter((t) => t && t.indexOf('.') > 0)      // bỏ script riêng (cid băm)
        .sort()
        .join(','),
      widget: (() => {
        for (const x of n._components || []) {
          const cc2 = mang[x.__id__];
          if (cc2 && cc2.__type__ === 'cc.Widget') {
            return `${cc2._alignFlags}/${cc2._originalWidth || 0}/${cc2._originalHeight || 0}`;
          }
        }
        return '';
      })(),
    });

    const dem = {};
    for (const con of n._children || []) {
      const cn = mang[con.__id__];
      const ten = cn && cn._name ? cn._name : '?';
      dem[ten] = (dem[ten] || 0) + 1;
      // Thêm số thứ tự vào đường dẫn: Go88 có node TRÙNG TÊN cùng cấp.
      di(con.__id__, `${duong}/${ten}#${dem[ten]}`);
    }
  };

  di(goc, '');
  return ra;
}

function nap(tuyetDoi) {
  const mang = JSON.parse(fs.readFileSync(tuyetDoi, 'utf8'));
  const pf = mang.find((o) => o && o.__type__ === 'cc.Prefab');
  return dacDiem(mang, pf.data.__id__);
}

function main() {
  let tongLech = 0;
  let tongNode = 0;

  for (const c of CAP) {
    const a = nap(path.join(GO88, c.go88));
    const b = nap(path.join(BUNDLE, 'prefab', c.cua_toi + '.prefab'));

    // Chỉ so node CÓ Ở CẢ HAI. Node thiếu bên tôi là node đã CỐ Ý cắt — gen-prefab.js
    // đã in danh sách đó kèm lý do, không lặp lại ở đây.
    const chung = [...b.keys()].filter((k) => a.has(k));
    tongNode += chung.length;

    const lech = [];
    const hoan = [];
    for (const k of chung) {
      const x = a.get(k);
      const y = b.get(k);
      for (const truong of Object.keys(x)) {
        if (gan(x[truong], y[truong])) continue;

        // Lệch ở `comps` mà phần thiếu TOÀN LÀ component đã hoãn thì không tính là lỗi.
        if (truong === 'comps') {
          const co = new Set(String(x.comps).split(',').filter(Boolean));
          const cua_toi = new Set(String(y.comps).split(',').filter(Boolean));
          const thieu = [...co].filter((t) => !cua_toi.has(t));
          const thua = [...cua_toi].filter((t) => !co.has(t));

          if (!thua.length && thieu.length && thieu.every((t) => HOAN[t])) {
            for (const t of thieu) hoan.push(`${k || '(gốc)'}: ${t} — ${HOAN[t]}`);
            continue;
          }
        }

        lech.push(`${k || '(gốc)'} . ${truong}:  Go88 ${JSON.stringify(x[truong])}  ≠  ${JSON.stringify(y[truong])}`);
      }
    }

    const dau = lech.length ? '❌' : '✅';
    console.log(`${dau} ${c.cua_toi.padEnd(14)} ${chung.length} node đối chiếu, ${lech.length} lệch`);
    for (const l of hoan) console.log(`      ⏸ ${l}`);
    for (const l of lech.slice(0, 8)) console.log(`      ${l}`);
    if (lech.length > 8) console.log(`      … và ${lech.length - 8} chỗ nữa`);
    tongLech += lech.length;
  }

  console.log(`\n${tongNode} node đối chiếu với bản gốc Go88.`);
  if (tongLech) {
    console.error(`❌ ${tongLech} chỗ lệch. Mỗi chỗ là một trường chưa được rút sang.`);
    process.exit(1);
  }
  console.log('✅ Không lệch chỗ nào.');
}

main();
