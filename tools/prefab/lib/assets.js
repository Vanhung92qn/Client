/**
 * assets.js — tra uuid cua asset trong project de gan vao prefab.
 *
 * Moi file anh trong Cocos co mot file .meta di kem chua HAI loai uuid:
 *   - uuid o ngoai cung : cua TEXTURE
 *   - uuid trong subMetas: cua SPRITE-FRAME  <-- day moi la cai cc.Sprite can
 * Nham hai cai nay thi anh se khong hien ra.
 */

'use strict';

const fs = require('fs');
const path = require('path');

/** Thu muc assets/ cua project (tools/prefab/lib -> ../../../assets) */
const ASSETS_ROOT = path.resolve(__dirname, '..', '..', '..', 'assets');

function readMeta(relPath) {
  const metaPath = path.join(ASSETS_ROOT, relPath + '.meta');
  if (!fs.existsSync(metaPath)) {
    throw new Error(`Khong tim thay .meta: ${relPath}.meta`);
  }
  return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
}

/**
 * Lay uuid SPRITE-FRAME cua mot file anh.
 * @param {string} relPath duong dan tinh tu assets/, vd:
 *        'common/images/popup/bg_popup.png'
 */
function spriteFrame(relPath) {
  const meta = readMeta(relPath);
  const subs = meta.subMetas || {};
  const keys = Object.keys(subs);
  if (!keys.length) {
    throw new Error(`Anh khong co sprite-frame: ${relPath}`);
  }
  return subs[keys[0]].uuid;
}

/** Kich thuoc goc cua anh — dung de dat contentSize cho khop. */
function size(relPath) {
  const meta = readMeta(relPath);
  return [meta.width, meta.height];
}

/** uuid cua asset khong phai anh (bitmap font, prefab, script...). */
function assetUuid(relPath) {
  return readMeta(relPath).uuid;
}

/**
 * Tra hang loat cung luc.
 * @param {object} map { alias: 'duong/dan/anh.png' }
 * @returns {object}   { alias: uuidSpriteFrame }
 * Anh nao thieu se bao ro alias + duong dan thay vi im lang tra undefined.
 */
function spriteFrames(map) {
  const out = {};
  const missing = [];
  for (const alias of Object.keys(map)) {
    try {
      out[alias] = spriteFrame(map[alias]);
    } catch (e) {
      missing.push(`  ${alias}  ->  ${map[alias]}\n      ${e.message}`);
    }
  }
  if (missing.length) {
    throw new Error('Thieu asset:\n' + missing.join('\n'));
  }
  return out;
}

/** Kiem tra mot file co ton tai trong assets/ khong. */
function exists(relPath) {
  return fs.existsSync(path.join(ASSETS_ROOT, relPath));
}

module.exports = {
  ASSETS_ROOT,
  spriteFrame,
  spriteFrames,
  size,
  assetUuid,
  exists,
};
