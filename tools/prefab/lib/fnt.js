/**
 * fnt.js — doc tap glyph cua bitmap font (.fnt) va kiem chuoi co ve duoc khong.
 *
 * 🔴 VI SAO CAN FILE NAY
 * Bitmap font chi ve duoc nhung ky tu CO SAN trong atlas. Gap ky tu thieu,
 * Cocos KHONG bao loi — no chi de lai khoang trong va ghi mot dong warn chim
 * nghim giua Console:
 *
 *     bmfont.js:236 Can't find letter definition in texture atlas
 *                   roboto_30.png for letter:—
 *
 * Da dinh that: bai test B0 dat dau gach ngang dai `—` vao chuoi, font
 * roboto_30 khong co no. Man hinh trong van "binh thuong", chi thieu mot gach.
 * Voi UI tieng Viet day chu thi kieu loi nay rat de lot den tan luc phat hanh.
 *
 * Do duoc tren hai font cua bundle:
 *   roboto_30     230 glyph — DU ASCII 32..126 + 134 ky tu co dau
 *                            NHUNG THIEU: — – … “ ” ‘ ’ · × ₫ •
 *   font_money_3   21 glyph — chi ` +,-./0123456789:BKM`
 *
 * Dung `check()` truoc khi ghi prefab de bien loi im lang thanh loi nem ngay.
 */

'use strict';

const fs = require('fs');

/** Cache theo duong dan tuyet doi — mot .fnt doc mot lan. */
const _cache = new Map();

/**
 * Tap ma ky tu (code point) ma font ve duoc.
 * @param {string} fntAbsPath duong dan tuyet doi toi file .fnt
 * @returns {Set<number>}
 */
function glyphs(fntAbsPath) {
  if (_cache.has(fntAbsPath)) return _cache.get(fntAbsPath);
  if (!fs.existsSync(fntAbsPath)) throw new Error(`Khong thay font: ${fntAbsPath}`);
  const txt = fs.readFileSync(fntAbsPath, 'utf8');
  const set = new Set();
  for (const m of txt.matchAll(/char\s+id=(\d+)/g)) set.add(Number(m[1]));
  if (!set.size) throw new Error(`File .fnt khong co dong "char id=": ${fntAbsPath}`);
  _cache.set(fntAbsPath, set);
  return set;
}

/**
 * Nhung ky tu trong `text` ma font KHONG ve duoc.
 * Bo qua ky tu xuong dong (Cocos xu ly rieng, khong can glyph).
 * @returns {string[]} danh sach ky tu thieu, khong trung lap
 */
function missing(fntAbsPath, text) {
  const set = glyphs(fntAbsPath);
  const thieu = new Set();
  for (const ch of String(text)) {
    if (ch === '\n' || ch === '\r') continue;
    if (!set.has(ch.codePointAt(0))) thieu.add(ch);
  }
  return [...thieu];
}

/**
 * Nem loi neu chuoi co ky tu font khong ve duoc.
 * @param {string} fntAbsPath
 * @param {string} text
 * @param {string} [ngữCanh] mo ta cho de tim, vd ten node
 */
function check(fntAbsPath, text, nguCanh) {
  const thieu = missing(fntAbsPath, text);
  if (!thieu.length) return;
  const ten = fntAbsPath.split(/[\\/]/).pop();
  const moTa = thieu
    .map((c) => `"${c}" (U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')})`)
    .join(', ');
  throw new Error(
    `Font ${ten} KHONG co ${thieu.length} ky tu: ${moTa}\n` +
      `    Chuoi: ${JSON.stringify(text)}\n` +
      (nguCanh ? `    Tai  : ${nguCanh}\n` : '') +
      `    Cocos se KHONG bao loi — chi de lai khoang trong. Doi ky tu khac,\n` +
      `    hoac dung font co glyph do.`
  );
}

module.exports = { glyphs, missing, check };
