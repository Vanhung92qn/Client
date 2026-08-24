/**
 * import-image.js — them anh moi vao project kem file .meta dung chuan.
 *
 *   node tools/prefab/import-image.js <anh-nguon> <duong-dan-dich-trong-assets>
 *   node tools/prefab/import-image.js C:\tmp\icon_v11.png common/images/VIP/icon_v11.png
 *
 * Nhieu anh mot luc:
 *   node tools/prefab/import-image.js --dir C:\tmp\icons common/images/VIP
 *
 * Vi sao can cong cu nay: copy file anh vao assets/ khong thoi la CHUA DU.
 * Cocos can file .meta di kem, trong do co uuid texture VA uuid sprite-frame
 * rieng. Thieu .meta thi khi mo Creator no tu sinh uuid moi, ma prefab da
 * tro san toi uuid cu -> anh mat trang.
 *
 * Chay lai an toan: anh da co .meta thi GIU NGUYEN uuid, chi ghi de file
 * anh. Nho vay thay anh moi ma prefab van tro dung.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const P = require('./lib/cocos-prefab');
const A = require('./lib/assets');

/** Doc kich thuoc PNG tu 8 byte trong khoi IHDR — khoi can thu vien ngoai. */
function pngSize(filePath) {
  const fd = fs.openSync(filePath, 'r');
  const buf = Buffer.alloc(24);
  fs.readSync(fd, buf, 0, 24, 0);
  fs.closeSync(fd);
  const sig = buf.slice(0, 8).toString('hex');
  if (sig !== '89504e470d0a1a0a') {
    throw new Error(`Khong phai file PNG: ${filePath}`);
  }
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function importOne(srcPath, relDest) {
  const destPath = path.join(A.ASSETS_ROOT, relDest);
  const metaPath = destPath + '.meta';
  const frameName = path.basename(relDest, path.extname(relDest));

  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  const { width, height } = pngSize(srcPath);
  fs.copyFileSync(srcPath, destPath);

  let texUuid;
  let frameUuid;
  if (fs.existsSync(metaPath)) {
    // Giu nguyen uuid cu de moi tham chieu dang co van tro dung
    const old = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    texUuid = old.uuid;
    const keys = Object.keys(old.subMetas || {});
    frameUuid = keys.length ? old.subMetas[keys[0]].uuid : P.uuid4();
    console.log(`  ~ ${relDest}  (${width}x${height}, giu uuid cu)`);
  } else {
    texUuid = P.uuid4();
    frameUuid = P.uuid4();
    console.log(`  + ${relDest}  (${width}x${height}, uuid moi)`);
  }

  const meta = P.imageMeta(texUuid, frameUuid, frameName, width, height);
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n', 'utf8');
  return { relDest, texUuid, frameUuid, width, height };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Dung: node import-image.js <anh> <duong/dan/trong/assets.png>');
    console.log('      node import-image.js --dir <thu-muc> <duong/dan/trong/assets>');
    process.exit(1);
  }

  console.log('Them anh vao project');
  console.log('--------------------');

  if (args[0] === '--dir') {
    const srcDir = args[1];
    const destDir = args[2];
    if (!destDir) {
      console.log('Thieu thu muc dich trong assets/');
      process.exit(1);
    }
    const files = fs.readdirSync(srcDir).filter((f) => f.toLowerCase().endsWith('.png'));
    if (!files.length) {
      console.log(`Khong co file .png nao trong ${srcDir}`);
      process.exit(1);
    }
    for (const f of files.sort()) {
      importOne(path.join(srcDir, f), path.posix.join(destDir, f));
    }
  } else {
    importOne(args[0], args[1]);
  }

  console.log('--------------------');
  console.log('Xong. Nho chay lai gen-vip.js neu prefab can dung anh moi.');
}

main();
