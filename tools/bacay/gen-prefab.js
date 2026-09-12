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

/** Prefab cần sinh. */
const CAN_SINH = [
  { bo_cuc: 'table', ra: 'BanCaoRua', mo_ta: 'khung bàn' },
  { bo_cuc: 'scoreui', ra: 'BangDiem', mo_ta: 'bảng điểm trên ghế' },
  { bo_cuc: 'extratime', ra: 'RutThemLa', mo_ta: 'hiệu ứng rút thêm lá khi hoà' },
  { bo_cuc: 'controller', ra: 'MocViTri', mo_ta: 'mốc vị trí ghế / bài / chip' },
  { bo_cuc: 'ghe', ra: 'GheNguoiChoi', mo_ta: 'ghế người chơi' },
  { bo_cuc: 'labai', ra: 'LaBai', mo_ta: 'một lá bài' },
  { bo_cuc: 'moi', ra: 'NutMoi', mo_ta: 'nút mời ở ghế trống' },
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
      case 'cc.Widget':
        ra.push(P.widget({
          top: c.top, bottom: c.bottom, left: c.left, right: c.right,
          alignFlags: c.alignFlags,
        }));
        break;
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
      case 'cc.Toggle':
      case 'cc.Graphics':
      case 'cc.Animation':
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
