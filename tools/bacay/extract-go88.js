/**
 * extract-go88.js — rút BỐ CỤC từ prefab Go88 (Cocos 2.1.3) ra JSON trung gian.
 *
 * VÌ SAO KHÔNG CHUYỂN THẲNG PREFAB
 * Prefab 2.1.3 và 2.4.10 nhìn thì giống (đều là mảng JSON) nhưng khác nhau ở ba chỗ
 * đủ để hỏng im lặng: phiên bản `_prefab`/`PrefabInfo`, uuid asset (Go88 là dự án khác),
 * và `__type__` của script tự viết (`d339fGmg5hE/pI0+iDfQxgq` là script CỦA HỌ, ta
 * không có và cũng không muốn có).
 *
 * Nên: lấy DỮ LIỆU BỐ CỤC (cây node, toạ độ, kích thước, ảnh nào ở đâu), rồi SINH
 * prefab 2.4.10 bằng bộ công cụ của mình. Được bố cục y Go88 mà không mang theo rủi ro.
 *
 * 🔴 CHỐNG SÓT — đây là mục đích chính của tệp này:
 * Mọi thứ KHÔNG mang sang được đều bị ghi vào `boQua[]` kèm lý do. Bộ sinh prefab sẽ
 * in danh sách đó ra. Im lặng bỏ một node là loại lỗi tệ nhất ở đây, vì bàn vẫn hiện
 * ra bình thường và chỉ thiếu đúng một thứ mà không ai để ý.
 *
 * Chạy:  node tools/bacay/extract-go88.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const GO88 = 'C:\\Reverse\\go88_reverse\\assets';
const RA = path.join(__dirname, 'layout');

/**
 * Asset DỰNG SẴN của engine — không thuộc dự án nào nên không có .meta để tra.
 * Bảng này do phiên làm Phoenix rút ra từ chính bản cài Creator 2.4.10; thiếu nó thì
 * `default_sprite_splash` (ảnh trắng mặc định, dùng làm lớp phủ mờ) bị báo nhầm là
 * "asset thiếu" và ta đi tìm một thứ không tồn tại.
 */
const BUILTIN = require('../prefab/lib/builtin-uuids.json').uuids;

/** frameName -> tệp nguồn bên Go88. Bộ sinh prefab tra bảng này khi thiếu asset. */
const NGUON_FRAME = {};

/** Prefab cần rút. */
const CAN_RUT = [
  { tep: 'BaCay/prefabs/CardGameTableCaoRua_c09fb89e.prefab', ten: 'table', mo_ta: 'khung bàn Cào Rùa' },
  { tep: 'BaCay/prefabs/BaCayController_23ef3f28.prefab', ten: 'controller', mo_ta: 'mốc vị trí ghế/bài/chip' },
  { tep: 'BaCay/prefabs/BaCayScoreUI_7d0053ce.prefab', ten: 'scoreui', mo_ta: 'bảng điểm trên ghế' },
  { tep: 'BaCay/prefabs/BaCayAnimExtratime_0e13e9ae.prefab', ten: 'extratime', mo_ta: 'hiệu ứng rút thêm lá' },
  { tep: '_shared/prefabs/PlayerView_201107e0.prefab', ten: 'ghe', mo_ta: 'ghế người chơi' },
  { tep: '_shared/prefabs/Card_bc_bc29c05f.prefab', ten: 'labai', mo_ta: 'một lá bài' },
  { tep: '_shared/prefabs/BtnInvite_875cabc3.prefab', ten: 'moi', mo_ta: 'nút mời ở ghế trống' },
  { tep: '_shared/prefabs/RoomScenebinhThuongXocDia_25d010ef.prefab', ten: 'sanh', mo_ta: 'sảnh chọn bàn' },
  { tep: 'BaCay/prefabs/chipRed_3023057f.prefab', ten: 'chip_red', mo_ta: 'chip red' },
  { tep: 'BaCay/prefabs/chipBlue_2cfd2cdc.prefab', ten: 'chip_blue', mo_ta: 'chip blue' },
  { tep: 'BaCay/prefabs/chipGreen_8930a802.prefab', ten: 'chip_green', mo_ta: 'chip green' },
  { tep: 'BaCay/prefabs/chipYellow_0b548e69.prefab', ten: 'chip_yellow', mo_ta: 'chip yellow' },
  { tep: 'BaCay/prefabs/chipOrange_2cf9dc6d.prefab', ten: 'chip_orange', mo_ta: 'chip orange' },
  { tep: 'BaCay/prefabs/chipPink_677d2481.prefab', ten: 'chip_pink', mo_ta: 'chip pink' },
  { tep: 'BaCay/prefabs/chipPupple_e8e6b950.prefab', ten: 'chip_purple', mo_ta: 'chip purple' },
  { tep: 'BaCay/prefabs/chipCyan_9f85b0f3.prefab', ten: 'chip_cyan', mo_ta: 'chip cyan' },
  { tep: 'BaCay/prefabs/chipBrown_b7c62c66.prefab', ten: 'chip_brown', mo_ta: 'chip brown' },
];

/** Component hiển thị mang sang được. Ngoài danh sách này là script riêng của Go88. */
const MANG_SANG = new Set([
  'cc.Sprite', 'cc.Label', 'cc.Button', 'cc.ProgressBar', 'cc.Widget',
  'cc.Layout', 'cc.Mask', 'cc.Toggle', 'sp.Skeleton', 'cc.Graphics',
  'cc.RichText', 'cc.ParticleSystem', 'cc.Animation',

  // 🔴 Hai cái này TRƯỚC ĐÂY bị xếp nhầm là "script riêng của Go88" chỉ vì không có
  // trong danh sách. Chúng là component của ENGINE.
  // `cc.BlockInputEvents` đặc biệt đáng nhớ: nó chặn click xuyên qua lớp phủ mờ.
  // Thiếu nó thì lúc nắn bài, người chơi bấm trúng nút nằm PHÍA SAU lớp phủ — và
  // không có gì trên màn hình gợi ý là đang hỏng.
  'cc.BlockInputEvents', 'cc.SkeletonAnimation',
]);

// ── Chỉ mục uuid → tên frame, dựng từ chính .meta của Go88 ────────────
/**
 * Sprite trong prefab trỏ tới asset bằng UUID. UUID đó vô nghĩa với dự án ta, nên
 * phải dịch ngược về TÊN FRAME — thứ duy nhất mang sang được.
 */
function dungChiMucUuid() {
  const chiMuc = new Map();

  const quet = (thuMuc) => {
    for (const ten of fs.readdirSync(thuMuc)) {
      const p = path.join(thuMuc, ten);
      const st = fs.statSync(p);
      if (st.isDirectory()) { quet(p); continue; }
      if (!ten.endsWith('.meta')) continue;

      let j;
      try { j = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }

      const goc = path.relative(GO88, p).replace(/\.meta$/, '').replace(/\\/g, '/');
      if (j.uuid) chiMuc.set(j.uuid, { tep: goc, frame: null });

      for (const [tenCon, con] of Object.entries(j.subMetas || {})) {
        if (con && con.uuid) {
          chiMuc.set(con.uuid, { tep: goc, frame: tenCon.replace(/\.png$/, '') });
        }
      }
    }
  };

  quet(GO88);
  return chiMuc;
}

// ── Rút một prefab ────────────────────────────────────────────────────
function rut(tuyetDoi, chiMuc, boQua) {
  const mang = JSON.parse(fs.readFileSync(tuyetDoi, 'utf8'));
  const lay = (r) => (r && typeof r.__id__ === 'number' ? mang[r.__id__] : null);

  const tenAsset = (r) => {
    if (!r || !r.__uuid__) return null;
    if (BUILTIN[r.__uuid__]) return '@builtin:' + BUILTIN[r.__uuid__];

    const hit = chiMuc.get(r.__uuid__);
    if (!hit) {
      boQua.push({ loai: 'asset', chi_tiet: r.__uuid__, ly_do: 'không có .meta nào khai uuid này' });
      return null;
    }

    const ten = hit.frame || path.basename(hit.tep);

    // Ghi lại frame này lấy TỪ TỆP NÀO bên Go88. Bộ sinh prefab dùng để nói thẳng
    // "thiếu frame X, lấy ở Y" thay vì bắt người đọc đi mò trong 58.000 uuid.
    NGUON_FRAME[ten] = hit.tep;
    return ten;
  };

  /**
   * 🔴 Ép về SỐ, không bao giờ trả `undefined`.
   *
   * Cocos bỏ hẳn khoá mang giá trị mặc định, nên `_contentSize.width` có thể vắng mặt.
   * Đọc thẳng ra `undefined`, rồi `JSON.stringify` NUỐT LUÔN khoá đó — bố cục mất một
   * trường mà không có dòng lỗi nào. Đã dính thật: `idBanLb` và `mucCuocLb` ra `?x50.4`.
   */
  const so = (v, macDinh) => (typeof v === 'number' && Number.isFinite(v) ? v : macDinh);

  const doc = (nodeIdx) => {
    const n = mang[nodeIdx];
    if (!n || n.__type__ !== 'cc.Node') return null;

    const pos = n._position || {};
    const cs = n._contentSize || {};
    const ap = n._anchorPoint || {};

    const kq = {
      ten: n._name,
      x: Math.round(so(pos.x, n._trs ? so(n._trs[0], 0) : 0) * 100) / 100,
      y: Math.round(so(pos.y, n._trs ? so(n._trs[1], 0) : 0) * 100) / 100,
      w: so(cs.width, 0),
      h: so(cs.height, 0),
      anchorX: so(ap.x, 0.5),
      anchorY: so(ap.y, 0.5),
      scaleX: so(n._scaleX, 1),
      scaleY: so(n._scaleY, 1),
      active: n._active !== false,
      opacity: so(n._opacity, 255),

      // 🔴 Cocos bỏ hẳn `_color` khi nó là trắng, nên vắng mặt = trắng.
      // Bỏ sót trường này thì mọi chữ và mọi ảnh nhuộm màu đều ra TRẮNG mà không
      // có dấu hiệu gì. Đã dính thật: nhãn NameGame của Go88 là #074722, ra trắng.
      color: n._color
        ? [so(n._color.r, 255), so(n._color.g, 255), so(n._color.b, 255)]
        : [255, 255, 255],
      comps: [],
      con: [],
    };

    // Chốt chặn: sau khi dựng xong, KHÔNG trường số nào được phép undefined.
    for (const k of ['x', 'y', 'w', 'h', 'anchorX', 'anchorY', 'scaleX', 'scaleY', 'opacity']) {
      if (typeof kq[k] !== 'number' || !Number.isFinite(kq[k])) {
        throw new Error(`Node "${n._name}": trường ${k} không phải số (${kq[k]})`);
      }
    }

    for (const cRef of n._components || []) {
      const c = lay(cRef);
      if (!c) continue;
      const t = c.__type__;

      if (!MANG_SANG.has(t)) {
        // Script riêng của Go88. Ghi lại tường minh — KHÔNG im lặng bỏ.
        boQua.push({ loai: 'component', node: n._name, chi_tiet: t, ly_do: 'script riêng của Go88, ta gắn script của mình' });
        continue;
      }

      const mo = { loai: t };
      if (t === 'cc.Sprite') {
        mo.frame = tenAsset(c._spriteFrame);
        mo.sizeMode = c._sizeMode;
        mo.type = c._type;
      } else if (t === 'cc.Label') {
        mo.text = c._string;
        mo.co = c._fontSize;
        mo.canhNgang = c._N$horizontalAlign;
        mo.font = tenAsset(c._N$file);
      } else if (t === 'sp.Skeleton') {
        mo.skel = tenAsset(c._N$skeletonData);
        mo.anim = c.defaultAnimation;
        mo.loop = c.loop;
      } else if (t === 'cc.Widget') {
        mo.top = c._top; mo.bottom = c._bottom; mo.left = c._left; mo.right = c._right;
        mo.alignFlags = c._alignFlags;

        // 🔴 Hai số này là kích thước TÁC GIẢ DỰNG, Cocos giữ lại để khi cờ căn lề
        // không phủ hết hai chiều thì còn biết lấy số nào.
        // Bỏ trống (0) thì editor tính lại từ node cha — mở prefab riêng lẻ ra
        // 960x640 thay vì 1560x720. Không sai lúc chạy, nhưng sai lúc nhìn, và người
        // dựng giao diện làm việc bằng mắt.
        mo.originalWidth = so(c._originalWidth, 0);
        mo.originalHeight = so(c._originalHeight, 0);
      } else if (t === 'cc.ProgressBar') {
        mo.mode = c._N$mode;
        mo.total = c._N$totalLength;

        // 🔴 barSprite trỏ tới cc.Sprite của MỘT NODE KHÁC (thường là node con "bar").
        // Bỏ sót thì thanh tiến độ dựng ra vẫn hợp lệ, vẫn hiện, nhưng KHÔNG BAO GIỜ
        // chạy — không có dòng lỗi nào. Bộ kiểm của tools/prefab bắt được đúng cái này.
        const bs = lay(c._N$barSprite);
        if (bs) {
          const chu = lay(bs.node);
          mo.barSpriteNode = chu ? chu._name : null;
          if (!mo.barSpriteNode) {
            boQua.push({ loai: 'ref', node: n._name, chi_tiet: 'barSprite', ly_do: 'không lần ra node chủ' });
          }
        }
      }
      kq.comps.push(mo);
    }

    for (const cRef of n._children || []) {
      const con = doc(cRef.__id__);
      if (con) kq.con.push(con);
      else if (cRef && typeof cRef.__id__ === 'number') {
        const o = mang[cRef.__id__];
        boQua.push({ loai: 'node', node: n._name, chi_tiet: o ? o.__type__ : '?', ly_do: 'con không phải cc.Node (vd cc.PrivateNode)' });
      }
    }

    return kq;
  };

  // Gốc của prefab: cc.Prefab.data
  const pf = mang.find((o) => o && o.__type__ === 'cc.Prefab');
  if (!pf) throw new Error(`Không tìm thấy cc.Prefab: ${tuyetDoi}`);

  const soNodeGoc = mang.filter((o) => o && o.__type__ === 'cc.Node').length;
  const cay = doc(pf.data.__id__);

  let dem = 0;
  (function demCay(n) { dem++; n.con.forEach(demCay); })(cay);

  return { cay, soNodeGoc, soNodeRut: dem };
}

// ── Chạy ──────────────────────────────────────────────────────────────
function main() {
  fs.mkdirSync(RA, { recursive: true });

  console.log('Dựng chỉ mục uuid từ .meta của Go88…');
  const chiMuc = dungChiMucUuid();
  console.log(`  ${chiMuc.size} uuid\n`);

  for (const muc of CAN_RUT) {
    const boQua = [];
    const { cay, soNodeGoc, soNodeRut } = rut(path.join(GO88, muc.tep), chiMuc, boQua);

    fs.writeFileSync(
      path.join(RA, muc.ten + '.json'),
      JSON.stringify({ nguon: muc.tep, mo_ta: muc.mo_ta, soNodeGoc, soNodeRut, boQua, cay }, null, 2),
      'utf8');

    // 🔴 ĐỐI CHIẾU SỐ NODE. Đây là chốt chặn chống sót cây.
    const thieu = soNodeGoc - soNodeRut;
    const dau = thieu === 0 ? '✅' : '⚠️';
    console.log(`${dau} ${muc.ten.padEnd(10)} ${soNodeRut}/${soNodeGoc} node` +
      (thieu ? ` — THIẾU ${thieu}` : '') +
      `, bỏ qua ${boQua.length} mục`);

    const nhom = {};
    for (const b of boQua) nhom[b.ly_do] = (nhom[b.ly_do] || 0) + 1;
    for (const [ly_do, n] of Object.entries(nhom)) console.log(`      ${n}× ${ly_do}`);
  }

  fs.writeFileSync(path.join(RA, 'frames.json'), JSON.stringify(NGUON_FRAME, null, 2), 'utf8');
  console.log(`
${Object.keys(NGUON_FRAME).length} frame duoc dung — nguon ghi o frames.json`);
  console.log(`\nBố cục đã ghi ra ${path.relative(path.resolve(__dirname, '..', '..'), RA)}/`);
}

main();
