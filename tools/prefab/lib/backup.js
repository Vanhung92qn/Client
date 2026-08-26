/**
 * backup.js — cat ban goc TRUOC khi ghi de mot file trong assets/.
 *
 * 🔴 VI SAO PHAI CO FILE NAY
 * Truoc day cac tool ghi thang `<duong-dan>.bak` NGAY CANH file goc, tuc la
 * ben trong assets/. Cocos Creator import MOI thu trong assets/, nen mo editor
 * len la no coi luon `MainGame.fire.bak` la mot SCENE that: sinh .meta cho no,
 * dua no vao danh sach scene, va goi no theo vao ban build.
 *
 * Backup khong phai asset. Chuyen sang tools/prefab/.backup/ — nam ngoai
 * assets/ nen Cocos khong ngo toi.
 *
 * Ten file giu ca duong dan tuong doi (thay / bang __) de hai file trung ten o
 * hai thu muc khac nhau khong de len nhau.
 */

'use strict';

const fs = require('fs');
const path = require('path');

/** tools/prefab/lib -> tools/prefab/.backup */
const BACKUP_DIR = path.resolve(__dirname, '..', '.backup');

/** Goc cua project (tools/prefab/lib -> ../../..). */
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');

/**
 * @param {string} absPath  file sap bi ghi de
 * @param {string} content  noi dung GOC (doc truoc khi sua)
 * @returns {string} duong dan ban luu, de in ra cho nguoi dung biet
 */
function save(absPath, content) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const rel = path.relative(PROJECT_ROOT, absPath).replace(/[\\/]/g, '__');
  const dest = path.join(BACKUP_DIR, rel + '.bak');

  fs.writeFileSync(dest, content, 'utf8');
  return path.relative(PROJECT_ROOT, dest);
}

module.exports = { save, BACKUP_DIR };
