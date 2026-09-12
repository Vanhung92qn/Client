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

/**
 * KHÁC BIỆT CÓ CHỦ ĐÍCH — khai báo chứ không nới lỏng chốt.
 *
 * Node gốc toàn màn hình mang canvas của ROY88 (1561x732) chứ không phải của Go88
 * (1560x720). Widget kéo cả bốn cạnh nên lúc chạy nó giãn bằng node cha; con số lưu
 * chỉ là kích thước tác giả dựng, và prefab này sống trong Roy88.
 *
 * Đối chứng trong chính dự án: LoadingOverlay / LoDeLobby / ShootFish đều có Widget
 * alignFlags 45 ở gốc và đều lưu 1561x732.
 */
const KHAC_CO_CHU_DICH = {
  // Gốc toàn màn hình mang canvas Roy88, và với bàn thì còn được THÊM Widget kéo bốn
  // cạnh (Go88 không cần vì họ fitWidth).
  // `props` ở đây là cc.Widget._originalWidth/Height — kích thước canvas Roy88
  // (1561×732) thay cho Go88 (1560×720). Cùng một lý do với `w`/`h`.
  '': new Set(['x', 'y', 'w', 'h', 'widget', 'comps', 'props']),

};

/**
 * Node được THÊM component vì Go88 làm việc đó bằng script riêng của họ.
 *
 * `avr`: Go88 gắn `63af6iNvX5M+Ix3hKfM1Qqt` để vẽ ảnh đại diện, nên node chỉ có
 * `cc.Button`. Ta không chép script của họ, nên phải tự cắm `cc.Sprite` làm chỗ đặt
 * ảnh — `GheView.spAvatar` trỏ vào đó. Xem THEM_COMPONENT ở attach-scripts.js.
 */
const COMP_THEM = new Set(['avr']);

/**
 * Nền được PHÓNG TO để phủ kín màn rộng, giữ nguyên tỉ lệ.
 *
 * Go88 fitWidth nên nền 1560 vừa khít; Roy88 fitHeight nên trên máy 19.5:9 màn rộng
 * 1586 và nền 1560 sẽ hở hai bên. Phóng lên 1720 phủ tới 21:9.
 */
const NEN_PHONG_TO = new Set(['bgTlmn', 'ld_bg']);

/**
 * Node được THÊM Widget neo mép — Go88 không cần vì họ fitWidth khoá bề rộng.
 * Xem NEO_MEP trong gen-prefab.js.
 */
const NEO_THEM = new Set(['icChatRoom', 'icExit_2']);

/**
 * Node được CHO GIÃN bằng màn hình — xem GIAN_BANG_CHA trong gen-prefab.js.
 *
 * `HUD` của Go88 là 0×0 với Widget "căn giữa, không kéo". Với họ thì vô hại vì fitWidth
 * khoá bề rộng. Với ta thì neo con vào "mép phải của HUD" là neo vào đúng giữa màn hình:
 * nút chat và nút thoát xếp sát nhau ở giữa, không một lỗi nào được in ra.
 */
const GIAN_THEM = new Set(['HUD']);

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
    // 🔴 Xem chú thích ở extract-go88.js: `_anchorPoint` vắng HẲN thì mặc định là
    // (0.5, 0.5) của node; còn khi đã ghi ra mà thiếu một thành phần thì thành phần
    // đó là **0** (mặc định của cc.Vec2).
    //
    // ⚠️ Bộ kiểm này TỪNG MANG ĐÚNG LỖI mà nó có nhiệm vụ bắt: cả hai bên cùng mặc
    // định 0.5 nên lúc nào cũng khớp, và 79 node lệch neo đi lọt sạch. Bộ kiểm dùng
    // chung một giả định sai với thứ nó kiểm thì không kiểm được gì cả.
    const apGoc = n._anchorPoint;
    const neoMacDinh = apGoc ? 0 : 0.5;
    const ap = apGoc || {};
    const c = n._color || {};
    const trs = n._trs && n._trs.array ? n._trs.array : null;

    ra.set(duong, {
      x: trs ? trs[0] : (p.x || 0),
      y: trs ? trs[1] : (p.y || 0),
      w: cs.width || 0,
      h: cs.height || 0,
      anchorX: ap.x === undefined ? neoMacDinh : ap.x,
      anchorY: ap.y === undefined ? neoMacDinh : ap.y,
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

      /**
       * Thuộc tính BÊN TRONG từng component.
       *
       * 🔴 Đây từng là chỗ mù lớn nhất của bộ kiểm này: nó so tên loại component
       * ("có cc.Layout không") mà không so component đó được cấu hình ra sao. Nhờ vậy
       * một `cc.Layout` dựng bằng MẶC ĐỊNH (lưới 40×40) vẫn khớp với `cc.Layout` của
       * Go88 (hàng ngang 88×32, đệm âm) — và nhãn số dư trên ghế biến mất mà 165/165
       * node vẫn báo "không lệch chỗ nào".
       *
       * Cùng một hình dạng với ba lần sót trước: một trường không được rút, hậu quả
       * chỉ thấy bằng mắt.
       */
      props: (() => {
        const ra = {};
        for (const x of n._components || []) {
          const c = mang[x.__id__];
          if (!c || typeof c.__type__ !== 'string' || c.__type__.indexOf('.') < 0) continue;
          for (const [k, v] of Object.entries(c)) {
            // Bỏ những thứ KHÔNG so được giữa hai dự án: danh tính, tham chiếu asset
            // (uuid khác nhau là đương nhiên) và tham chiếu node (chỉ số mảng khác).
            if (k === '__type__' || k === '_name' || k === '_objFlags' || k === '_id'
              || k === 'node' || k === '_materials') continue;
            if (v === null || v === undefined) continue;

            if (typeof v === 'object') {
              if (v.__uuid__ !== undefined || v.__id__ !== undefined) continue;
              // Phẳng hoá cc.Size / cc.Vec2 / cc.Color để so từng thành phần.
              for (const [k2, v2] of Object.entries(v)) {
                if (k2 === '__type__') continue;
                if (typeof v2 === 'number' || typeof v2 === 'boolean') {
                  ra[`${c.__type__}.${k}.${k2}`] = v2;
                }
              }
              continue;
            }
            if (typeof v === 'number' || typeof v === 'boolean' || typeof v === 'string') {
              ra[`${c.__type__}.${k}`] = v;
            }
          }
        }
        return ra;
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
    const coChuDich = [];
    for (const k of chung) {
      const x = a.get(k);
      const y = b.get(k);
      // So THUỘC TÍNH COMPONENT: chỉ xét khoá Go88 có ghi ra. Cocos bỏ hẳn khoá mang
      // giá trị mặc định, nên khoá họ CÓ ghi chính là thứ họ cố ý đặt khác mặc định —
      // và đó đúng là thứ ta phải mang sang cho bằng được.
      for (const [khoa, giaTri] of Object.entries(x.props || {})) {
        const cuaTa = (y.props || {})[khoa];
        if (gan(giaTri, cuaTa)) continue;

        // Component ĐÃ HOÃN có chủ đích thì đương nhiên không có thuộc tính nào —
        // đã liệt kê riêng ở phần "hoãn", không đếm hai lần.
        if (HOAN[khoa.split('.').slice(0, 2).join('.')]) continue;

        // `_useOriginalSize` là trường đời cũ: chỉ 6% cc.Label thật của 2.4 còn ghi nó,
        // nên thư viện dùng chung cố ý BỎ. Ghi vào là sinh diff thừa ở mọi nhãn.
        if (khoa === 'cc.Label._useOriginalSize') continue;
        const tenNode = (k.split('/').pop() || '').split('#')[0];
        const boQuaP = KHAC_CO_CHU_DICH[k]
          || (NEO_THEM.has(tenNode) ? new Set(['props']) : null)
          || (GIAN_THEM.has(tenNode) ? new Set(['props']) : null);
        if (boQuaP && boQuaP.has('props')) continue;
        lech.push(`${k || '(gốc)'} . ${khoa}:  Go88 ${JSON.stringify(giaTri)}  ≠  ${JSON.stringify(cuaTa)}`);
      }

      for (const truong of Object.keys(x)) {
        if (truong === 'props') continue;
        if (gan(x[truong], y[truong])) continue;

        const tenNode = (k.split('/').pop() || '').split('#')[0];
        const boQua = KHAC_CO_CHU_DICH[k]
          || (NEN_PHONG_TO.has(tenNode) ? new Set(['w', 'h']) : null)
          || (NEO_THEM.has(tenNode) ? new Set(['comps', 'widget']) : null)
          || (COMP_THEM.has(tenNode) ? new Set(['comps']) : null)
          || (GIAN_THEM.has(tenNode) ? new Set(['w', 'h', 'widget']) : null);
        if (boQua && boQua.has(truong)) {
          coChuDich.push(`${k || '(gốc)'} . ${truong}: Go88 ${JSON.stringify(x[truong])} → ${JSON.stringify(y[truong])}`);
          continue;
        }

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
    for (const l of coChuDich) console.log(`      ⤢ ${l}`);
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
