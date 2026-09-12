/**
 * gen-prefab.js — sinh prefab Cocos 2.4.10 từ bố cục đã rút của Go88.
 *
 * Vào:  tools/bacay/layout/*.json  (extract-go88.js sinh ra)
 * Ra:   assets/bacay/prefab/*.prefab + .meta
 *
 * 🔴 KHÔNG ĐƯỢC IM LẶNG. Ba chốt chặn, sai chốt nào là dừng hẳn:
 *   1. Số node sinh ra phải BẰNG số node trong bố cục.
 *   2. Mọi frame ảnh phải giải được ra uuid thật trong bundle. Thiếu thì in kèm
 *      đường dẫn nguồn bên Go88 (từ frames.json) để biết lấy ở đâu.
 *   3. Mọi loại component trong bố cục phải có cách dựng. Gặp loại lạ thì báo,
 *      không lặng lẽ bỏ — một node thiếu component vẫn hiện ra bình thường,
 *      chỉ là không làm gì cả.
 *
 * Chạy:  node tools/bacay/gen-prefab.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const P = require('../prefab/lib/cocos-prefab');

const CLIENT = path.resolve(__dirname, '..', '..');
const ASSETS = path.join(CLIENT, 'assets');
const BUNDLE = path.join(ASSETS, 'bacay');
const LAYOUT = path.join(__dirname, 'layout');
const BUILTIN = require('../prefab/lib/builtin-uuids.json').uuids;

/**
 * Canvas của Roy88, đọc từ assets/lobby/scenes/MainGame.fire.
 * KHÁC canvas của Go88 (1560x720) — và khác cả chế độ căn: Roy88 `fitHeight`,
 * Go88 `fitWidth`. Nghĩa là ở Roy88 chiều RỘNG mới là chiều dư ra.
 */
const CANVAS = [1561, 732];

/** Prefab cần sinh. */
const CAN_SINH = [
  { bo_cuc: 'table', ra: 'BanCaoRua', mo_ta: 'khung bàn' },
  { bo_cuc: 'scoreui', ra: 'BangDiem', mo_ta: 'bảng điểm trên ghế' },
  { bo_cuc: 'extratime', ra: 'RutThemLa', mo_ta: 'hiệu ứng rút thêm lá khi hoà' },
  { bo_cuc: 'controller', ra: 'MocViTri', mo_ta: 'mốc vị trí ghế / bài / chip' },
  { bo_cuc: 'ghe', ra: 'GheNguoiChoi', mo_ta: 'ghế người chơi' },
  { bo_cuc: 'labai', ra: 'LaBai', mo_ta: 'một lá bài' },
  { bo_cuc: 'moi', ra: 'NutMoi', mo_ta: 'nút mời ở ghế trống' },
  { bo_cuc: 'sanh', ra: 'SanhChonBan', mo_ta: 'sảnh chọn bàn' },
  { bo_cuc: 'chip_red', ra: 'ChipDo', mo_ta: 'chip red' },
  { bo_cuc: 'chip_blue', ra: 'ChipXanh', mo_ta: 'chip blue' },
  { bo_cuc: 'chip_green', ra: 'ChipXanhLa', mo_ta: 'chip green' },
  { bo_cuc: 'chip_yellow', ra: 'ChipVang', mo_ta: 'chip yellow' },
  { bo_cuc: 'chip_orange', ra: 'ChipCam', mo_ta: 'chip orange' },
  { bo_cuc: 'chip_pink', ra: 'ChipHong', mo_ta: 'chip pink' },
  { bo_cuc: 'chip_purple', ra: 'ChipTim', mo_ta: 'chip purple' },
  { bo_cuc: 'chip_cyan', ra: 'ChipXanhNhat', mo_ta: 'chip cyan' },
  { bo_cuc: 'chip_brown', ra: 'ChipNau', mo_ta: 'chip brown' },
];

/**
 * Tên bên Go88 → tên trong bundle của ta.
 * Chỉ liệt kê những tệp ĐÃ ĐỔI TÊN lúc chép; còn lại giữ nguyên tên nên tra thẳng.
 */
const DOI_TEN = {
  'bgTlmn': 'bg_table',
  'caorua_mid_table': 'mid_table',
  'Button_LatTatCa': 'btn_lat_tat_ca',
  'Text_NanBai': 'txt_nan_bai',
  'Font-export.fnt': 'main.fnt',
  'Font_HelveticaNeue_Effect-export.fnt': 'effect.fnt',
  'Go_JQK.json': 'jqk.json',
  // Atlas dùng chung của Go88 có HAI bản lưng bài trùng nhau. Bộ bài của ta chỉ
  // giữ một, nên trỏ cả hai tên về cùng một frame.
  'icCardback_dup2': 'icCardback',
  'skeleton_4d9f506e.json': 'avatar_frame.json',
  'Chat.json': 'chat.json',
  'EffectCard.json': 'card_fx.json',
  'Font_HelveticaNeue-export.fnt': 'helv.fnt',
  'iconVipLobby': 'ic_vip',
  'tien': 'ic_tien',
  'bg': 'lobby_bg',
  'caorua_tinh diem.json': 'tinhdiem.json',
};

/**
 * NODE CẮT BỎ — kèm lý do, KHÔNG bỏ lặng lẽ.
 *
 * `PlayerView` của Go88 là ghế DÙNG CHUNG cho mọi game bài của họ, nên nó mang theo
 * cả đồ của Poker (dealer / small blind / big blind / tất tay). Cào Rùa không có
 * những khái niệm đó, giữ lại chỉ tổ nặng bundle và làm người đọc sau tưởng là game
 * có tính năng ấy.
 *
 * Mỗi lần sinh, danh sách này được IN RA để không ai quên mình đã cắt gì.
 */
const CAT_BO = {
  ig_dealer_lb: 'nhãn D (dealer) — luật Poker, Cào Rùa không có',
  ig_smallblind_lb: 'nhãn SB (small blind) — luật Poker',
  ig_bigblind_lb: 'nhãn BB (big blind) — luật Poker',
  Text: 'chữ "Tất tay" (all-in) — luật Poker',
  anim: 'hiệu ứng GietCong — của Poker',
  ig_host_icon: 'biểu tượng chủ bàn — Cào Rùa của ta tự mở ván, không có chủ bàn',
  iconPlatform: 'biểu tượng chủ bàn (bản thứ hai) — như trên',
  ig_subscribe_get_out: 'nút đuổi người — giao thức của ta chưa có lệnh KICK',
  btn_kick: 'nút đuổi người — như trên',
  icKickOut: 'biểu tượng đuổi người — như trên',

  // ── Sảnh: trang trí theo mùa của Go88 ──────────────────────────────
  // Sảnh của họ có skin lễ tết chồng lên nhau, mỗi bộ một spine riêng. Giữ lại là
  // gánh thêm ~10 spine cho thứ ta không dùng, và người đọc sau sẽ tưởng game có
  // hệ thống skin theo mùa.
  avatar_Xmas: 'trang trí Noel',
  noel_FooterL_room: 'trang trí Noel (chân trái)',
  noel_FooterR_room: 'trang trí Noel (chân phải)',
  go_trungthu: 'trang trí Trung Thu',
  'go_trungthu copy': 'trang trí Trung Thu (bản sao)',
  go_304: 'trang trí 30/4',
  'go_304 copy': 'trang trí 30/4 (bản sao)',
  'go_wc copy': 'trang trí World Cup',
  skinHalloween: 'trang trí Halloween — cắt cả cụm',
  bottomL: 'trang trí Tết (góc dưới trái)',
  bottomR: 'trang trí Tết (góc dưới phải)',
};

// ── Chỉ mục asset trong bundle của TA ─────────────────────────────────
/**
 * Quét mọi .meta trong `assets/bacay/` để dựng bảng: tên → uuid.
 *
 * Đăng ký cả hai kiểu tên: `subMetas` (frame trong atlas, hoặc sprite-frame của
 * một ảnh rời) và tên tệp (cho font, spine — thứ tham chiếu bằng uuid cấp 1).
 */
function chiMucBundle() {
  const frame = new Map();   // tên frame → uuid sprite-frame
  const tep = new Map();     // tên tệp   → uuid asset

  const quet = (d) => {
    for (const ten of fs.readdirSync(d)) {
      const p = path.join(d, ten);
      if (fs.statSync(p).isDirectory()) { quet(p); continue; }
      if (!ten.endsWith('.meta')) continue;

      const j = JSON.parse(fs.readFileSync(p, 'utf8'));
      const goc = ten.replace(/\.meta$/, '');

      if (j.uuid) tep.set(goc, j.uuid);
      for (const [k, v] of Object.entries(j.subMetas || {})) {
        if (v && v.uuid) frame.set(k.replace(/\.png$/, ''), v.uuid);
      }
    }
  };

  quet(BUNDLE);
  return { frame, tep };
}

// ── Dựng component ────────────────────────────────────────────────────
function dungComps(n, ctx) {
  const ra = [];

  for (const c of n.comps) {
    switch (c.loai) {
      case 'cc.Sprite': {
        const uuid = ctx.traFrame(c.frame, n.ten);
        ra.push(P.sprite(uuid, { type: c.type, sizeMode: c.sizeMode }));
        break;
      }
      case 'cc.Label': {
        const o = { size: c.co, hAlign: c.canhNgang };
        if (c.font) {
          const u = ctx.traTep(c.font, n.ten);
          if (u) o.font = u;
        }
        ra.push(P.label(c.text == null ? '' : String(c.text), o));
        break;
      }
      case 'cc.Button':
        ra.push(P.button({}));
        break;
      case 'cc.ProgressBar': {
        const o = { mode: c.mode, totalLength: c.total };
        if (c.barSpriteNode) {
          if (!ctx.tenDuyNhat.has(c.barSpriteNode)) {
            throw new Error(`ProgressBar ở "${n.ten}" trỏ tới node "${c.barSpriteNode}" ` +
              `nhưng tên đó KHÔNG duy nhất trong cây — không đặt ref được`);
          }
          o.barSprite = P.refComp(c.barSpriteNode, 'cc.Sprite');
        } else {
          ctx.hoan.push(`${n.ten}: ProgressBar không có barSprite`);
        }
        ra.push(P.progressBar(o));
        break;
      }
      case 'cc.Widget': {
        const w = P.widget({
          top: c.top, bottom: c.bottom, left: c.left, right: c.right,
          alignFlags: c.alignFlags,
        });

        // 🔴 `P.widget()` hardcode _originalWidth/_originalHeight = 0 và không nhận
        // tuỳ chọn (thư viện của phiên Phoenix, tôi không sửa tệp của họ).
        //
        // Hai số này là kích thước tác giả dựng. Để 0 thì editor tính lại từ node cha —
        // mở prefab riêng lẻ ra 960x640 thay vì 1560x720.
        //
        // ⚠ CHÉP ĐÚNG GIÁ TRỊ GO88, đừng tự tính. Bản đầu tôi gán bừa bằng contentSize
        // của node, và lệch 9/11 Widget: Cocos chỉ ghi hai số này ở một số cờ căn lề
        // nhất định, không phải cứ có Widget là có.
        w.data._originalWidth = c.originalWidth || 0;
        w.data._originalHeight = c.originalHeight || 0;
        ra.push(w);
        break;
      }
      case 'cc.Mask':
        ra.push(P.mask({}));
        break;
      case 'cc.Layout':
        ra.push(P.layout({}));
        break;
      case 'sp.Skeleton': {
        const u = ctx.traTep(c.skel, n.ten);
        ra.push(P.skeleton(u, { anim: c.anim, loop: c.loop }));
        break;
      }
      case 'cc.BlockInputEvents':
        // Không có dữ liệu gì, chỉ cần có mặt. Thư viện dùng chung chưa có builder
        // nên dựng tay — đúng hình dạng một component rỗng của Cocos.
        ra.push({ __comp: true, type: 'cc.BlockInputEvents', data: {} });
        break;

      case 'cc.Toggle':
      case 'cc.Graphics':
      case 'cc.Animation':
      case 'cc.SkeletonAnimation':
      case 'cc.ParticleSystem':
      case 'cc.RichText':
        // Có trong bố cục nhưng CHƯA cần cho bản 1. Ghi lại tường minh để không
        // ai tưởng là đã dựng đủ.
        ctx.hoan.push(`${n.ten}: ${c.loai}`);
        break;
      default:
        throw new Error(`Chưa biết dựng component ${c.loai} (node "${n.ten}")`);
    }
  }

  return ra;
}

// ── Dựng cây node ─────────────────────────────────────────────────────
function dungNode(n, ctx) {
  ctx.dem++;

  // `ref` để script gắn vào prefab tìm lại node theo tên. Tên node của Go88 có thể
  // trùng nhau (vd hai node cùng tên "timebar3"), mà ref trùng thì lib NÉM LỖI —
  // nên chỉ đặt ref cho node có tên duy nhất trong cả cây.
  const opts = {
    pos: [n.x, n.y],
    size: [n.w, n.h],
    anchor: [n.anchorX, n.anchorY],
    scale: [n.scaleX, n.scaleY],
    active: n.active,
    opacity: n.opacity,
    color: n.color || [255, 255, 255],
  };
  if (ctx.tenDuyNhat.has(n.ten)) opts.ref = n.ten;

  const con = [];
  for (const c of n.con) {
    if (CAT_BO[c.ten]) {
      let bo = 0;
      (function dem(x) { bo++; x.con.forEach(dem); })(c);
      ctx.cat.push(`${c.ten} (${bo} node): ${CAT_BO[c.ten]}`);
      ctx.dem += bo;              // vẫn tính vào tổng để chốt đối chiếu không báo nhầm
      continue;
    }
    con.push(dungNode(c, ctx));
  }

  return P.node(n.ten, opts, con, dungComps(n, ctx));
}

/** Tên xuất hiện ĐÚNG MỘT lần trong cây — chỉ những tên này được làm ref. */
function tenDuyNhat(goc) {
  const dem = new Map();
  (function di(n) {
    dem.set(n.ten, (dem.get(n.ten) || 0) + 1);
    n.con.forEach(di);
  })(goc);
  return new Set([...dem].filter(([, v]) => v === 1).map(([k]) => k));
}

// ── Chạy ──────────────────────────────────────────────────────────────
function main() {
  const { frame, tep } = chiMucBundle();
  const nguonFrame = JSON.parse(fs.readFileSync(path.join(LAYOUT, 'frames.json'), 'utf8'));
  console.log(`Bundle có ${frame.size} frame, ${tep.size} tệp\n`);

  fs.mkdirSync(path.join(BUNDLE, 'prefab'), { recursive: true });

  let hong = 0;

  for (const muc of CAN_SINH) {
    const bc = JSON.parse(fs.readFileSync(path.join(LAYOUT, muc.bo_cuc + '.json'), 'utf8'));
    const thieu = [];
    const hoan = [];

    const cat = [];
    const ctx = {
      dem: 0,
      hoan,
      cat,
      tenDuyNhat: tenDuyNhat(bc.cay),

      traFrame(ten, node) {
        if (!ten) return null;                                  // Sprite không gán ảnh — hợp lệ
        if (ten.startsWith('@builtin:')) {
          const mo_ta = ten.slice(9);
          const u = Object.keys(BUILTIN).find((k) => BUILTIN[k] === mo_ta);
          if (u) return u;
          thieu.push({ ten, node, nguon: 'asset dựng sẵn của engine' });
          return null;
        }
        const key = DOI_TEN[ten] || ten;
        const u = frame.get(key) || frame.get(key.replace(/\.png$/, ''));
        if (!u) thieu.push({ ten, node, nguon: nguonFrame[ten] || '(không rõ)' });
        return u || null;
      },

      traTep(ten, node) {
        if (!ten) return null;
        const key = DOI_TEN[ten] || ten;
        const u = tep.get(key);
        if (!u) thieu.push({ ten, node, nguon: nguonFrame[ten] || '(không rõ)' });
        return u || null;
      },
    };

    const goc = dungNode(bc.cay, ctx);
    const pfUuid = P.uuid4();
    const mang = P.build(goc, pfUuid);

    // ── Gốc toàn màn hình: theo canvas ROY88, không theo canvas Go88 ──────
    //
    // Node gốc có Widget kéo cả bốn cạnh thì nó tự giãn bằng node cha lúc chạy, nên
    // con số lưu chỉ là kích thước tác giả dựng. Nhưng prefab này sống trong Roy88,
    // nên phải mang số của Roy88.
    //
    // Đối chứng trong chính dự án: LoadingOverlay / LoDeLobby / ShootFish — cả ba đều
    // có Widget alignFlags 45 ở gốc và đều lưu 1561x732, đúng bằng canvas MainGame.
    // Go88 lưu 1560x720 vì canvas của HỌ là thế.
    {
      const goc = mang[1];
      const w = mang[1]._components
        .map((x) => mang[x.__id__])
        .find((c) => c && c.__type__ === 'cc.Widget');

      const keoNgang = w && (w._alignFlags & 8) && (w._alignFlags & 32);
      const keoDoc = w && (w._alignFlags & 1) && (w._alignFlags & 4);

      if (keoNgang && keoDoc) {
        goc._contentSize.width = CANVAS[0];
        goc._contentSize.height = CANVAS[1];
        w._originalWidth = CANVAS[0];
        w._originalHeight = CANVAS[1];
        // Neo giữa ⇒ vị trí là nửa kích thước.
        goc._trs.array[0] = CANVAS[0] * goc._anchorPoint.x;
        goc._trs.array[1] = CANVAS[1] * goc._anchorPoint.y;
        console.log(`      ⤢ gốc toàn màn hình → canvas Roy88 ${CANVAS[0]}x${CANVAS[1]}`);
      }
    }

    // 🔴 CHỐT 1: node sinh ra + node cố ý cắt phải BẰNG ĐÚNG bố cục.
    // Cắt có chủ đích thì được, nhưng phải cộng lại đủ — nếu không thì một node
    // biến mất vì lý do khác sẽ lẫn vào đám "đã cắt" và không ai thấy.
    const soNode = mang.filter((o) => o && o.__type__ === 'cc.Node').length;
    if (ctx.dem !== bc.soNodeRut) {
      throw new Error(`${muc.ra}: duyệt ${ctx.dem} node nhưng bố cục có ${bc.soNodeRut}`);
    }

    const rap = path.join(BUNDLE, 'prefab', muc.ra + '.prefab');
    P.writeCocosJson(rap, mang);
    P.writeCocosJson(rap + '.meta', P.prefabMeta(pfUuid));

    const dau = thieu.length ? '⚠️' : '✅';
    const catGon = cat.length ? ` (cắt ${bc.soNodeRut - soNode})` : '';
    console.log(`${dau} ${muc.ra.padEnd(13)} ${soNode}/${bc.soNodeRut} node${catGon}, ` +
      `${mang.length} object — ${muc.mo_ta}`);
    for (const c of cat) console.log(`      ✂ ${c}`);

    if (hoan.length) {
      console.log(`      hoãn ${hoan.length} component chưa cần bản 1: ${hoan.join(', ')}`);
    }
    for (const t of thieu) {
      console.log(`      ❌ thiếu "${t.ten}" ở node ${t.node}  →  lấy tại ${t.nguon}`);
      hong++;
    }
  }

  if (hong > 0) {
    console.error(`\n❌ ${hong} asset chưa giải được. Thêm vào DANH_MUC của bundle.js rồi chạy lại.`);
    process.exit(1);
  }

  console.log('\n✅ Sinh xong, mọi asset đều giải được ra uuid thật trong bundle.');
}

main();
