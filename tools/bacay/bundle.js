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
const DIRS = ['art', 'card', 'spine', 'prefab'];

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

  // ── Spine ───────────────────────────────────────────────────────────
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

function metaAtlas(atlasUuid, texUuid, size, frames) {
  const subMetas = {};
  for (const [ten, f] of Object.entries(frames)) {
    subMetas[ten] = {
      ver: '1.0.6',
      uuid: P.uuid4(),
      importer: 'sprite-frame',
      rawTextureUuid: texUuid,
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
    tex: {
      ver: '2.3.7',
      uuid: texUuid,
      importer: 'texture',
      type: 'raw',
      wrapMode: 'clamp',
      filterMode: 'bilinear',
      premultiplyAlpha: false,
      genMipmaps: false,
      packable: false,
      width: size.width,
      height: size.height,
      platformSettings: {},
      subMetas: {},
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

      const frames = docPlist(dst);
      const size = kichThuocPng(pngDst);
      const texUuid = P.uuid4();
      const mm = metaAtlas(P.uuid4(), texUuid, size, frames);

      P.writeCocosJson(dst + '.meta', mm.atlas);
      P.writeCocosJson(pngDst + '.meta', mm.tex);
      console.log(`  atlas ${muc.dich}  ${Object.keys(frames).length} frame  ${size.width}x${size.height}`);
      continue;
    }

    if (ext === '.png') {
      P.writeCocosJson(dst + '.meta', metaThuong(dst, path.basename(muc.dich, '.png')));
      console.log(`  anh   ${muc.dich}`);
      continue;
    }

    if (ext === '.json') {
      // Spine: .json (skeleton) + .atlas + .png.
      for (const anhEm of muc.nhom) {
        const dichAnhEm = muc.dich.replace(/\.json$/, path.extname(anhEm));
        const d2 = chep(anhEm, dichAnhEm);
        if (anhEm.endsWith('.png')) {
          P.writeCocosJson(d2 + '.meta', metaThuong(d2, path.basename(dichAnhEm, '.png')));
        } else {
          P.writeCocosJson(d2 + '.meta', metaTho(P.uuid4(), 'text'));
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

      P.writeCocosJson(dst + '.meta', metaTho(P.uuid4(), 'spine-data'));
      console.log(`  spine ${muc.dich}  (tro toi ${tenAnhMoi})`);
      continue;
    }

    throw new Error(`Chua biet xu ly duoi ${ext}: ${muc.dich}`);
  }

  // .meta cho tung thu muc con
  for (const d of DIRS) {
    P.writeCocosJson(path.join(NEW, d) + '.meta', P.folderMeta(P.uuid4()));
  }

  // .meta cua BUNDLE
  P.writeCocosJson(BUNDLE_META, {
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
