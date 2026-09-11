/**
 * reg.js — BANG UUID cua Hoa Phung. Nguon su that duy nhat.
 *
 * VI SAO PHAI CO
 * Prefab tro toi asset bang uuid. Rai uuid literal khap cac tep sinh thi mot
 * ngay nao do co cai go nham mot ky tu, prefab van mo duoc, anh van "co" trong
 * Inspector — chi la trong tron. Tap trung o day va NEM LOI ngay khi thieu, de
 * sai lam lo ra luc chay bo sinh chu khong phai luc nguoi dung mo Cocos.
 *
 * QUAN HE VOI bundle.js
 * Moi muc o day PHAI co ten trong DANH_MUC cua `bundle.js`. Them asset moi thi
 * them vao bundle.js TRUOC (chep tep vao bundle), roi khai o day. Khai o day ma
 * chua chep thi `must()` nem loi ngay — dung y muon.
 */

'use strict';

const path = require('path');
const A = require('../prefab/lib/assets');
const P = require('../prefab/lib/cocos-prefab');
const FNT = require('../prefab/lib/fnt');

/** Thu muc goc cua bundle Hoa Phung, tinh tu assets/. */
const B = 'phoenix/';

function must(fn, what) {
  let v;
  try {
    v = fn();
  } catch (e) {
    throw new Error(`THIEU ASSET: ${what}\n    ${e.message}\n    -> khai trong tools/phoenix/bundle.js roi chay lai no truoc.`);
  }
  if (!v) throw new Error(`THIEU ASSET: ${what} (tra ve rong)`);
  return v;
}

// ─── Do phan giai thiet ke ────────────────────────────────────────
// Roy88 (MainGame.fire): 1561 x 732, fitHeight = true, fitWidth = false.
// Sun Phung (aviator.scene): cac node phu toan man deu 1560 x 720.
// Lech 1px ngang / 12px doc => toa do chep sang gan nhu 1:1.
//
// ⚠️ UITransform cua node "Canvas" trong aviator.scene ghi 1280x640 — do la
// kich thuoc khung xem luc dump, KHONG phai do phan giai thiet ke. Tin vao cac
// node phu toan man: aviator / root / View / icon_baotri, ca bon deu 1560x720.
const DESIGN = { w: 1561, h: 732 };
const SUNWIN_DESIGN = { w: 1560, h: 720 };

// ─── Font ──────────────────────────────────────────────────────────
// Da dem glyph tren chinh file .fnt:
//   roboto_30      230 glyph — DU dau tieng Viet (ế ụ ơ ă đ ữ Đ ệ)
//   font_money_3    21 glyph — CHI so va dau phan cach, KHONG co chu
/** Duong dan .fnt, tinh tu assets/ — dung de doc tap glyph. */
const fontPath = {
  roboto_30: B + 'font/roboto_30.fnt',
  money_3: B + 'font/font_money_3.fnt',
};

const font = {
  roboto_30: must(() => A.assetUuid(fontPath.roboto_30), fontPath.roboto_30),
  money_3: must(() => A.assetUuid(fontPath.money_3), fontPath.money_3),
};

/** uuid font -> duong dan tuyet doi .fnt, de `label()` tra nguoc ra tap glyph. */
const _uuidToFnt = new Map(
  Object.keys(font).map((k) => [font[k], path.join(A.ASSETS_ROOT, fontPath[k])])
);

/**
 * Tao cc.Label CO KIEM GLYPH. Dung ham nay thay cho `P.label()` truc tiep.
 *
 * 🔴 VI SAO BAT BUOC DI QUA DAY
 * Bitmap font gap ky tu khong co trong atlas thi Cocos chi de lai KHOANG TRONG
 * va ghi mot dong warn trong Console — khong loi, khong crash. Da dinh that o
 * bai test B0: dau gach ngang dai `—` khong co trong roboto_30.
 *
 * Do duoc tren hai font dang dung:
 *   roboto_30    du ASCII 32..126 + 134 ky tu co dau, NHUNG thieu — – … “ ” ‘ ’ · × ₫ •
 *   font_money_3 chi co ` +,-./0123456789:BKM`
 *
 * @param {string} text
 * @param {object} o  nhu P.label(), nhung `font` la uuid lay tu `reg.font`
 * @param {string} [nguCanh] ten node — de thong bao loi chi dung cho
 */
function label(text, o = {}, nguCanh) {
  if (o.font) {
    const fnt = _uuidToFnt.get(o.font);
    if (!fnt) {
      throw new Error(
        `font uuid ${o.font} khong co trong reg.font — khai no o day truoc, ` +
          `khong truyen uuid la vao label().`
      );
    }
    FNT.check(fnt, text, nguCanh);
  }
  return P.label(text, o);
}

// ─── Spine ─────────────────────────────────────────────────────────
// Ca kho Sun Phung deu la spine 3.8.99 — khop runtime spine cua Cocos 2.4.10,
// va Cocos da import thanh cong (co ban .bin trong library/imports).
const spine = {
  feather: must(() => A.assetUuid(B + 'spine/feather/feather.skel'), 'spine/feather/feather.skel'),
};

/**
 * Ten animation DA KIEM CHUNG — tim thay chuoi trong chinh file .skel, va khop
 * ma nguon Sunwin `AviatorJackpotObject.ts:96-101` (FEATHER_APPEAR / FEATHER_IDLE
 * / FEATHER_ACTIVE / FEATHER_TRANSFER / FEATHER_JACKPOT).
 *
 * KHONG doan them ten nao chua kiem duoc. Dat ten sai thi spine dung im, khong
 * bao loi — mot trong nam co che hong-im-lang cua tang nay.
 */
const anim = {
  feather: {
    APPEAR: 'appear',
    IDLE: 'default_idle',
    ACTIVE: 'active_idle',
    TRANSFER: 'transfer',
    JACKPOT: 'jackpot',
  },
};

/**
 * Ten animation cua cac spine CHUA dua vao bundle — rut tu PhoenixView.prefab
 * cua ban cu (tuc la thu client that su goi) roi doi chieu nguoc vao .skel.
 * De san day de bac sau khoi phai do lai; chua dung nen chua khai trong `spine`.
 *
 *   phoenix.skel          idle1, feather_loop
 *   meteorite.skel        meteorite
 *   jackpot_sunphung.skel idle
 *   jackpot_bird.skel     idle_to_win_birds
 */

// ─── Anh ───────────────────────────────────────────────────────────
const img = {
  black: must(() => A.spriteFrame(B + 'art/black.png'), 'art/black.png'),
};

module.exports = {
  B,
  DESIGN,
  SUNWIN_DESIGN,
  font,
  fontPath,
  label,
  spine,
  anim,
  img,
  must,
};
