/**
 * bundle.js — dung bundle `bacay` MOI cho game Cao Rua (backend .NET 10).
 *
 * BOI CANH
 * Ba Cay CU nam rai hai cho: art o `assets/3cay/`, script o
 * `assets/lobby/scripts/cardgame/3cay/`. Ban moi KHONG dung chung mot tep nao voi no.
 * Hai bo song song, ten khac han nhau (`3cay` vs `bacay`) nen khong co cho nao lan.
 * Khi ban moi chay on thi xoa `3cay` bang dung mot commit sach.
 *
 * NGUYEN TAC (theo dung tien le tools/phoenix/bundle.js cua phien lam Phoenix)
 * KHONG chep ca thu muc. Moi tep phai co ten trong DANH_MUC duoi day kem ly do
 * dung o dau. Khong co ten trong danh muc = khong vao bundle.
 *
 * NGUON ART: C:\Reverse\go88_reverse — client Go88 dich nguoc.
 * Chu du an da xac nhan duoc dung art nay.
 *
 * 🔴 UUID: art Go88 den tu MOT DU AN KHAC, nen .meta cua no vo nghia o day.
 * Sinh uuid MOI cho moi tep. Chep nguyen .meta cu la rat de dinh trung uuid voi
 * asset san co cua Roy88 — Cocos se tu sinh lai mot cai va lam dut tham chieu
 * ma KHONG bao gi.
 *
 * Chay:  node tools/bacay/bundle.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const P = require('../prefab/lib/cocos-prefab');

const CLIENT = path.resolve(__dirname, '..', '..');
const GO88 = 'C:\\Reverse\\go88_reverse\\assets';
const NEW = path.join(CLIENT, 'assets', 'bacay');
const BUNDLE_META = path.join(CLIENT, 'assets', 'bacay.meta');

/**
 * 🔴 PRIORITY 1, KHONG PHAI 5.
 *
 * Priority quyet dinh bundle nao SO HUU asset dung chung. Dat 5 (cao hon game
 * thuong) thi bundle nay se HUT asset dung chung ve minh va bien chinh no thanh
 * phu thuoc bat buoc cua game khac — dung co che da lam gay 4 game cuoc voi loi
 * "Please load bundle xeng777 first".
 *
 * Kieu SO, khong phai chuoi: Roy88 co 2/34 bundle khai lech chuan (xeng777,
 * chickenFight de trong bundleName) va do la loai loi khong ai phat hien duoc
 * cho toi luc chay that.
 */
const BUNDLE_UUID = 'c7e14b90-5a6d-4f28-9d31-8b2e4c6a1f03';
const BUNDLE_PRIORITY = 1;

/** Thu muc cua bundle — so it, giong quy uoc Phoenix. */
const DIRS = ['art', 'card', 'font', 'spine', 'ui', 'prefab'];

/**
 * DANH MUC ASSET.
 *
 * `nhom` — chep ca cum tep anh em. Spine = .json + .atlas + .png; atlas = .plist + .png.
 *          Thieu mot manh la hong im lang: .atlas tro toi anh bang TEN TUONG DOI,
 *          khong phai uuid.
 */
const DANH_MUC = [
  // ── Bo bai ──────────────────────────────────────────────────────────
  {
    nguon: '_shared/plist/cards_02470586.plist',
    dich: 'card/cards.plist',
    ly_do: '54 frame icCard1A..icCard13D + icCardback + icCardEmpty — bo bai chinh',
  },

  // ── Ban choi ────────────────────────────────────────────────────────
  {
    nguon: 'BaCay/images/caorua_mid_table.png',
    dich: 'art/mid_table.png',
    ly_do: 'vung giua ban — cho gom chip cua noi',
  },
  {
    nguon: 'BaCay/plist/atlas_1ae528df.plist',
    dich: 'art/table.plist',
    ly_do: '9 mau chip + 4 bieu tuong chat bai',
  },

  // ── Bieu tuong chat bai, ban to (dung cho hieu ung) ─────────────────
  { nguon: 'BaCay/images/club.png', dich: 'art/suit_club.png', ly_do: 'chat chuon, ban to' },
  { nguon: 'BaCay/images/diamond.png', dich: 'art/suit_diamond.png', ly_do: 'chat ro, ban to' },
  { nguon: 'BaCay/images/spade.png', dich: 'art/suit_spade.png', ly_do: 'chat bich, ban to' },
  { nguon: 'BaCay/plist/heart.png', dich: 'art/suit_heart.png', ly_do: 'chat co, ban to' },

  // ── Anh roi va chu ──────────────────────────────────────────────────
  { nguon: '_shared/images/bgTlmn.png', dich: 'art/bg_table.png', ly_do: 'nen ban — anh roi, khong nam trong atlas' },
  { nguon: '_shared/images/Button_LatTatCa.png', dich: 'art/btn_lat_tat_ca.png', ly_do: 'nut Lat tat ca' },
  { nguon: '_shared/images/Text_NanBai.png', dich: 'art/txt_nan_bai.png', ly_do: 'chu "Nan bai"' },
  {
    nguon: '_shared/fonts/Font_Myriad_Number-export.fnt',
    dich: 'font/so.fnt',
    nhom: ['_shared/fonts/Font_Myriad_Number-export.png'],
    ly_do: 'bitmap font so — muc cuoc toi thieu tren dong ban trong sanh',
  },
  {
    nguon: '_shared/fonts/Font-export.fnt',
    dich: 'font/main.fnt',
    nhom: ['_shared/fonts/Font-export.png'],
    ly_do: 'bitmap font chinh — nhan so ban, muc cuoc',
  },
  {
    nguon: '_shared/fonts/Font_HelveticaNeue_Effect-export.fnt',
    dich: 'font/effect.fnt',
    nhom: ['_shared/fonts/Font_HelveticaNeue_Effect-export.png'],
    ly_do: 'bitmap font co vien — nhan tren nut',
  },

  { nguon: '_shared/fonts/MyriadPro-Bold.ttf', dich: 'font/MyriadPro-Bold.ttf', ly_do: 'font hệ thống cho nhãn số bàn / mức cược / tên game' },

  { nguon: '_shared/fonts/SourceSansPro-Regular.ttf', dich: 'font/SourceSansPro-Regular.ttf', ly_do: 'font tên người chơi trên ghế' },
  {
    nguon: '_shared/fonts/Font_HelveticaNeue-export.fnt',
    dich: 'font/helv.fnt',
    nhom: ['_shared/fonts/Font_HelveticaNeue-export.png'],
    ly_do: 'bitmap font cho nhãn trong bong bóng chat',
  },

  { nguon: '_shared/images/iconVipLobby.png', dich: 'art/ic_vip.png', ly_do: 'huy hiệu VIP cạnh avatar ngoài sảnh' },
  { nguon: '_shared/images/tien.png', dich: 'art/ic_tien.png', ly_do: 'biểu tượng tiền ngoài sảnh' },

  // ── Spine ───────────────────────────────────────────────────────────
  {
    nguon: '_shared/skeletons/skeleton_4d9f506e.json',
    dich: 'spine/avatar_frame.json',
    nhom: ['_shared/skeletons/skeleton_4d9f506e.atlas', '_shared/skeletons/skeleton_4d9f506e.png'],
    ly_do: 'hiệu ứng khung avatar trên ghế',
  },
  {
    nguon: '_shared/skeletons/Chat.json',
    dich: 'spine/chat.json',
    nhom: ['_shared/skeletons/Chat.atlas', '_shared/skeletons/Chat.png'],
    ly_do: 'bong bóng chat trên ghế — ta CÓ chat/emote nên cần',
  },
  {
    nguon: '_shared/skeletons/EffectCard.json',
    dich: 'spine/card_fx.json',
    nhom: ['_shared/skeletons/EffectCard.atlas', '_shared/skeletons/EffectCard.png'],
    ly_do: 'hiệu ứng lấp lánh trên lá bài',
  },
  {
    nguon: 'BaCay/skeletons/Go_JQK.json',
    dich: 'spine/jqk.json',
    nhom: ['BaCay/skeletons/Go_JQK.atlas', 'BaCay/skeletons/Go_JQK.png'],
    ly_do: 'hieu ung thuong J♥Q♥K♥ x3 — bo bai hiem 1/22.100',
  },
  {
    nguon: 'BaCay/skeletons/caorua_tinh diem.json',
    dich: 'spine/tinhdiem.json',
    nhom: ['BaCay/skeletons/caorua_tinh diem.atlas', 'BaCay/skeletons/caorua_tinh diem.png'],
    ly_do: 'hieu ung cham diem luc lat ngua bai',
  },
];

/**
 * 🔴 GIU NGUYEN UUID CU khi sinh lai .meta.
 *
 * Bo sinh nay cap uuid moi moi lan chay. Chay lai bundle.js ma quen chay gen-prefab.js
 * la moi prefab tro vao hu khong: prefab VAN HOP LE, Cocos VAN MO DUOC, chi la o anh
 * trong. Khong mot dong loi nao.
 *
 * Nen: da co .meta thi giu nguyen uuid cua no, ca cap 1 lan tung khoa trong subMetas.
 * Chay lai bao nhieu lan cung ra cung mot ket qua.
 */
function giuUuid(duongDan, moi) {
  if (!fs.existsSync(duongDan)) return moi;

  let cu;
  try { cu = JSON.parse(fs.readFileSync(duongDan, 'utf8')); } catch { return moi; }

  if (cu.uuid) moi.uuid = cu.uuid;
  if (cu.textureUuid && moi.textureUuid) moi.textureUuid = cu.textureUuid;

  for (const k of Object.keys(moi.subMetas || {})) {
    const kCu = (cu.subMetas || {})[k];
    if (kCu && kCu.uuid) moi.subMetas[k].uuid = kCu.uuid;
    if (kCu && kCu.rawTextureUuid && moi.subMetas[k].rawTextureUuid) {
      moi.subMetas[k].rawTextureUuid = kCu.rawTextureUuid;
    }
  }
  return moi;
}

/** Ghi .meta, giu nguyen uuid neu da co. Dung THAY CHO P.writeCocosJson o moi cho ghi meta. */
function ghiMeta(duongDan, noiDung) {
  P.writeCocosJson(duongDan, giuUuid(duongDan, noiDung));
}

// ── Doc kich thuoc PNG tu header, khong can thu vien ──────────────────
function kichThuocPng(abs) {
  const fd = fs.openSync(abs, 'r');
  const buf = Buffer.alloc(24);
  fs.readSync(fd, buf, 0, 24, 0);
  fs.closeSync(fd);
  if (buf.toString('ascii', 1, 4) !== 'PNG') throw new Error(`Khong phai PNG: ${abs}`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

// ── Chuyen plist cua cocos2d-x sang .meta sprite-atlas cua Creator ────
/**
 * Plist ghi toa do kieu chuoi `{{x,y},{w,h}}`. Creator can tung truong roi.
 *
 * ⚠ BAY XOAY ANH: khi `rotated` = true, plist ghi w/h trong `frame` theo chieu
 * DA XOAY, con Creator lai muon kich thuoc CHUA xoay. Quen doi cho nay thi anh
 * hien ra bi keo det theo mot chieu — nhin thay ngay nhung rat ton cong lan ra.
 */
function docPlist(abs) {
  const xml = fs.readFileSync(abs, 'utf8');
  const frames = {};

  // Cat khoi <key>frames</key> roi duyet tung cap key/dict.
  const dauFrames = xml.indexOf('<key>frames</key>');
  if (dauFrames < 0) throw new Error(`Plist khong co khoi frames: ${abs}`);

  const re = /<key>([^<]+)<\/key>\s*<dict>([\s\S]*?)<\/dict>/g;
  re.lastIndex = xml.indexOf('<dict>', dauFrames) + 6;

  let m;
  while ((m = re.exec(xml)) !== null) {
    const ten = m[1];
    const than = m[2];
    if (!/<key>frame<\/key>/.test(than)) break;   // het khoi frames

    const lay = (k) => {
      const mm = new RegExp(`<key>${k}</key>\\s*<string>([^<]*)</string>`).exec(than);
      return mm ? mm[1] : null;
    };
    const so = (s) => (s || '').match(/-?\d+(\.\d+)?/g).map(Number);

    const f = so(lay('frame'));                   // x, y, w, h
    const off = so(lay('offset')) || [0, 0];
    const src = so(lay('sourceSize')) || [f[2], f[3]];
    const rotated = /<key>rotated<\/key>\s*<true\s*\/>/.test(than);

    frames[ten] = {
      trimX: f[0],
      trimY: f[1],
      width: rotated ? f[3] : f[2],
      height: rotated ? f[2] : f[3],
      rawWidth: src[0],
      rawHeight: src[1],
      offsetX: off[0],
      offsetY: off[1],
      rotated,
    };
  }

  if (Object.keys(frames).length === 0) throw new Error(`Khong doc duoc frame nao: ${abs}`);
  return frames;
}

function metaAtlas(atlasUuid, texUuid, size, frames, tenTex) {
  const subMetas = {};
  for (const [ten, f] of Object.entries(frames)) {
    subMetas[ten] = {
      ver: '1.0.6',
      uuid: P.uuid4(),
      importer: 'sprite-frame',
      // 🔴 KHONG ghi rawTextureUuid o day. Doi chieu atlas THAT cua Roy88
      // (cardgame_core/_shared/tienlenMN/images/TLMN-sprites.plist.meta): sprite-atlas
      // meta KHONG co truong nay — anh nao thi da nam trong chinh tep .plist roi.
      //
      // Ghi vao con sinh mot lop bat nhat quan: no tro toi uuid cua texture, ma texture
      // lai giu uuid CU khi sinh lai, nen atlas tro vao mot texture khong ton tai. Va
      // check-refs.js KHONG bat duoc vi no chi soi __uuid__ trong prefab.
      trimType: 'auto',
      trimThreshold: 1,
      rotated: f.rotated,
      offsetX: f.offsetX,
      offsetY: f.offsetY,
      trimX: f.trimX,
      trimY: f.trimY,
      width: f.width,
      height: f.height,
      rawWidth: f.rawWidth,
      rawHeight: f.rawHeight,
      borderTop: 0,
      borderBottom: 0,
      borderLeft: 0,
      borderRight: 0,
      spriteType: 'normal',
      subMetas: {},
    };
  }

  return {
    atlas: {
      ver: '1.2.6',
      uuid: atlasUuid,
      importer: 'sprite-atlas',
      size: { width: size.width, height: size.height },
      type: 'Texture Packer',
      subMetas,
    },
    // 🔴 PNG cua atlas phai la `type: sprite` KEM MOT sprite-frame, KHONG phai `raw`.
    //
    // De `raw` thi Cocos coi no la texture tho, khong sinh sprite-frame nao, va MOI frame
    // trong atlas khong bind duoc vao dau — hien ra 0x0. Prefab van hop le, editor van mo,
    // chi la moi la bai va moi con chip deu trong.
    // Doi chieu atlas THAT cua Roy88 (TLMN-sprites.png.meta): type "sprite", packable true,
    // subMetas co dung mot sprite-frame ten theo tep.
    tex: {
      ver: '2.3.7',
      uuid: texUuid,
      importer: 'texture',
      type: 'sprite',
      wrapMode: 'clamp',
      filterMode: 'bilinear',
      premultiplyAlpha: false,
      genMipmaps: false,
      packable: true,
      width: size.width,
      height: size.height,
      platformSettings: {},
      subMetas: {
        [tenTex]: {
          ver: '1.0.6',
          uuid: P.uuid4(),
          importer: 'sprite-frame',
          rawTextureUuid: texUuid,
          trimType: 'auto',
          trimThreshold: 1,
          rotated: false,
          offsetX: 0,
          offsetY: 0,
          trimX: 0,
          trimY: 0,
          width: size.width,
          height: size.height,
          rawWidth: size.width,
          rawHeight: size.height,
          borderTop: 0,
          borderBottom: 0,
          borderLeft: 0,
          borderRight: 0,
          spriteType: 'normal',
          subMetas: {},
        },
      },
    },
  };
}

function metaThuong(abs, tenFrame) {
  const { width, height } = kichThuocPng(abs);
  return P.imageMeta(P.uuid4(), P.uuid4(), tenFrame, width, height);
}

function metaTho(uuid, importer) {
  return { ver: '1.0.1', uuid, importer, subMetas: {} };
}

// ── Chay ──────────────────────────────────────────────────────────────
function main() {
  for (const d of DIRS) fs.mkdirSync(path.join(NEW, d), { recursive: true });

  let soTep = 0;
  let soByte = 0;

  const chep = (nguon, dich) => {
    const src = path.join(GO88, nguon);
    if (!fs.existsSync(src)) throw new Error(`THIEU NGUON: ${src}`);
    const dst = path.join(NEW, dich);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    soTep++;
    soByte += fs.statSync(dst).size;
    return dst;
  };

  for (const muc of DANH_MUC) {
    const dst = chep(muc.nguon, muc.dich);
    const ext = path.extname(muc.dich).toLowerCase();

    if (ext === '.plist') {
      // 🔴 Ten anh phai DOC TU PLIST, khong duoc suy tu ten tep plist.
      // `cards_02470586.plist` tro toi `atlas_1c6a6bd1.png` — mot atlas DUNG CHUNG
      // khac ten hoan toan. Doan theo ten tep la chep nham hoac thieu anh.
      const tenAnh = /<key>textureFileName<\/key>\s*<string>([^<]+)<\/string>/
        .exec(fs.readFileSync(dst, 'utf8'));
      if (!tenAnh) throw new Error(`Plist khong khai textureFileName: ${muc.dich}`);

      const pngNguon = path.posix.join(path.posix.dirname(muc.nguon), tenAnh[1]);
      const pngDich = muc.dich.replace(/\.plist$/, '.png');
      const pngDst = chep(pngNguon, pngDich);

      // 🔴 PLIST TRO TOI ANH BANG TEN TUONG DOI, y het .atlas cua spine va .fnt.
      // Doi ten tep ma quen sua dong nay thi Cocos khong tim ra texture: editor hien
      // "Raw Texture File: None" va MOI frame trong atlas thanh o trong suot.
      // Prefab van hop le, validate.js van xanh, check-refs.js van xanh.
      //
      // Toi da viet dung canh bao nay cho .atlas va .fnt o commit truoc ma QUEN AP
      // CHO .plist — cung mot loai loi, ba dinh dang.
      {
        let noiDungPlist = fs.readFileSync(dst, 'utf8');
        const tenMoi = path.basename(pngDich);
        noiDungPlist = noiDungPlist.replace(
          /(<key>(?:real)?[Tt]extureFileName<\/key>\s*<string>)[^<]*(<\/string>)/g,
          `$1${tenMoi}$2`);
        fs.writeFileSync(dst, noiDungPlist, 'utf8');
      }

      const frames = docPlist(dst);
      const size = kichThuocPng(pngDst);
      const texUuid = P.uuid4();
      const mm = metaAtlas(P.uuid4(), texUuid, size, frames, path.basename(pngDich, '.png'));

      ghiMeta(dst + '.meta', mm.atlas);
      ghiMeta(pngDst + '.meta', mm.tex);
      console.log(`  atlas ${muc.dich}  ${Object.keys(frames).length} frame  ${size.width}x${size.height}`);
      continue;
    }

    if (ext === '.png') {
      ghiMeta(dst + '.meta', metaThuong(dst, path.basename(muc.dich, '.png')));
      console.log(`  anh   ${muc.dich}`);
      continue;
    }

    if (ext === '.json') {
      // Spine: .json (skeleton) + .atlas + .png.
      for (const anhEm of muc.nhom) {
        const dichAnhEm = muc.dich.replace(/\.json$/, path.extname(anhEm));
        const d2 = chep(anhEm, dichAnhEm);
        if (anhEm.endsWith('.png')) {
          ghiMeta(d2 + '.meta', metaThuong(d2, path.basename(dichAnhEm, '.png')));
        } else {
          ghiMeta(d2 + '.meta', metaTho(P.uuid4(), 'text'));
        }
      }

      // ⚠ .atlas tro toi anh bang TEN TUONG DOI ghi ben trong no, khong phai uuid.
      // Doi ten tep thi phai sua ca dong ten anh trong .atlas, neu khong Cocos
      // im lang khong tim thay texture va spine hien ra trong suot.
      const tenAnhMoi = path.basename(muc.dich, '.json') + '.png';
      const atlasPath = dst.replace(/\.json$/, '.atlas');
      const noiDung = fs.readFileSync(atlasPath, 'utf8').split(/\r?\n/);
      for (let i = 0; i < noiDung.length; i++) {
        if (/\.png\s*$/.test(noiDung[i])) noiDung[i] = tenAnhMoi;
      }
      fs.writeFileSync(atlasPath, noiDung.join('\n'), 'utf8');

      ghiMeta(dst + '.meta', metaTho(P.uuid4(), 'spine-data'));
      console.log(`  spine ${muc.dich}  (tro toi ${tenAnhMoi})`);
      continue;
    }

    if (ext === '.ttf') {
      ghiMeta(dst + '.meta', { ver: '1.1.2', uuid: P.uuid4(), importer: 'ttf-font', subMetas: {} });
      console.log(`  ttf   ${muc.dich}`);
      continue;
    }

    if (ext === '.fnt') {
      // Bitmap font: .fnt + .png. 🔴 .fnt tro toi anh bang TEN TUONG DOI ghi trong
      // dong `file="..."`, khong phai uuid — doi ten tep ma quen sua dong do thi chu
      // hien ra rong tuech, Cocos khong bao gi.
      const pngNguon = muc.nhom.find((x) => x.endsWith('.png'));
      const pngDich = muc.dich.replace(/\.fnt$/, '.png');
      const pngDst = chep(pngNguon, pngDich);

      const texUuid = P.uuid4();
      ghiMeta(pngDst + '.meta', metaThuong(pngDst, path.basename(pngDich, '.png')));

      let noiDung = fs.readFileSync(dst, 'utf8');
      noiDung = noiDung.replace(/file="[^"]*"/, `file="${path.basename(pngDich)}"`);
      fs.writeFileSync(dst, noiDung, 'utf8');

      const co = /size=(-?\d+)/.exec(noiDung);
      ghiMeta(dst + '.meta', {
        ver: '2.1.2',
        uuid: P.uuid4(),
        importer: 'bitmap-font',
        textureUuid: JSON.parse(fs.readFileSync(pngDst + '.meta', 'utf8')).uuid,
        fontSize: co ? Math.abs(Number(co[1])) : 32,
        subMetas: {},
      });
      console.log(`  font  ${muc.dich}  (tro toi ${path.basename(pngDich)})`);
      continue;
    }

    throw new Error(`Chua biet xu ly duoi ${ext}: ${muc.dich}`);
  }

  // ── Anh do cut-frames.py cat ra ────────────────────────────────────
  // Chay cut-frames.py TRUOC bundle.js. Anh roi thi chua co .meta, sinh o day
  // de moi .meta trong bundle deu do mot cho tao ra.
  const thuMucUi = path.join(NEW, 'ui');
  let soUi = 0;
  for (const ten of fs.existsSync(thuMucUi) ? fs.readdirSync(thuMucUi) : []) {
    if (!ten.endsWith('.png')) continue;
    const abs = path.join(thuMucUi, ten);
    ghiMeta(abs + '.meta', metaThuong(abs, path.basename(ten, '.png')));
    soTep++;
    soByte += fs.statSync(abs).size;
    soUi++;
  }
  if (soUi > 0) console.log(`  ui    ${soUi} anh da cat rieng tu atlas dung chung`);

  // .meta cho tung thu muc con
  for (const d of DIRS) {
    ghiMeta(path.join(NEW, d) + '.meta', P.folderMeta(P.uuid4()));
  }

  // .meta cua BUNDLE
  ghiMeta(BUNDLE_META, {
    ver: '1.1.3',
    uuid: BUNDLE_UUID,
    importer: 'folder',
    isBundle: true,
    bundleName: 'bacay',
    priority: BUNDLE_PRIORITY,
    compressionType: {},
    optimizeHotUpdate: {},
    inlineSpriteFrames: {},
    isRemoteBundle: {},
    subMetas: {},
  });

  console.log(`\nXong: ${soTep} tep, ${(soByte / 1024).toFixed(0)} KB`);
  console.log(`Bundle "bacay" priority ${BUNDLE_PRIORITY} (kieu so)`);
}

main();
