/**
 * check-cards.js — đối chiếu 52 lá bài giữa mã của server và atlas ảnh thật.
 *
 * VÌ SAO CẦN: sai bảng ánh xạ lá bài là loại lỗi *nhìn thấy ngay* nhưng *rất tốn công
 * lần ra* — người chơi thấy J♥ mà server nghĩ là 3♠, và mọi thứ khác vẫn chạy bình thường.
 * Nó cũng đánh thẳng vào cảm nhận công bằng, nên phải chặn bằng máy chứ không bằng mắt.
 *
 * Kiểm ba điều:
 *   1. Đủ 52 lá, mỗi lá ra một tên frame KHÁC NHAU.
 *   2. Mọi tên frame sinh ra đều CÓ THẬT trong atlas.
 *   3. Ba mốc Go88 hardcode trong code của họ phải khớp: 43/47/51 = J/Q/K cơ.
 *
 * Chạy:  node tools/bacay/check-cards.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const CLIENT = path.resolve(__dirname, '..', '..');
const ATLAS = path.join(CLIENT, 'assets', 'bacay', 'card', 'cards.plist');
const MAP = path.join(CLIENT, 'assets', 'lobby', 'scripts', 'cardgame', 'bacay', 'BaCayCard.js');

// `module.exports` thuần nên nạp thẳng được bằng require, không cần bộ giả lập Cocos.
const BaCayCard = require(MAP);

function frameCoThat() {
  const xml = fs.readFileSync(ATLAS, 'utf8');
  const ten = new Set();
  const re = /<key>(icCard[A-Za-z0-9]*)<\/key>/g;
  let m;
  while ((m = re.exec(xml)) !== null) ten.add(m[1]);
  return ten;
}

function main() {
  const coThat = frameCoThat();
  console.log(`Atlas có ${coThat.size} frame\n`);

  const loi = [];
  const daDung = new Map();

  for (let ord = 0; ord < 52; ord++) {
    const frame = BaCayCard.frame(ord);

    if (!coThat.has(frame)) {
      loi.push(`ord ${ord} (${BaCayCard.ten(ord)}) → "${frame}" KHÔNG có trong atlas`);
    }
    if (daDung.has(frame)) {
      loi.push(`"${frame}" bị hai lá dùng chung: ord ${daDung.get(frame)} và ${ord}`);
    }
    daDung.set(frame, ord);
  }

  // Ba mốc Go88 tự hardcode — đối chứng độc lập với công thức của ta.
  const moc = [[43, 'icCard11A', 'J cơ'], [47, 'icCard12A', 'Q cơ'], [51, 'icCard13A', 'K cơ']];
  for (const [ord, mongDoi, mo_ta] of moc) {
    const thuc = BaCayCard.frame(ord);
    if (thuc !== mongDoi) loi.push(`Mốc Go88: ord ${ord} (${mo_ta}) phải là "${mongDoi}", ra "${thuc}"`);
  }

  // Điểm theo luật Cào Rùa.
  const diem = [[0, 1, 'A♠ = 1 điểm'], [(10 - 1) * 4, 0, '10♠ = 0'], [(13 - 1) * 4, 0, 'K♠ = 0'], [(9 - 1) * 4, 9, '9♠ = 9']];
  for (const [ord, mongDoi, mo_ta] of diem) {
    if (BaCayCard.diem(ord) !== mongDoi) loi.push(`Điểm: ${mo_ta}, ra ${BaCayCard.diem(ord)}`);
  }

  // In bảng để đối chiếu bằng mắt một lần.
  for (let so = 1; so <= 13; so++) {
    const hang = [];
    for (let chat = 0; chat < 4; chat++) {
      const ord = (so - 1) * 4 + chat;
      hang.push(`${String(ord).padStart(2)}=${BaCayCard.frame(ord).padEnd(10)}`);
    }
    console.log(`  ${hang.join(' ')}   (${BaCayCard.ten((so - 1) * 4)})`);
  }

  console.log();
  if (loi.length > 0) {
    console.error(`❌ ${loi.length} lỗi:`);
    for (const l of loi) console.error('   ' + l);
    process.exit(1);
  }

  console.log(`✅ 52 lá, 52 frame khác nhau, tất cả có thật trong atlas.`);
  console.log(`   Khớp cả 3 mốc Go88 hardcode (43/47/51 = J/Q/K cơ).`);
}

main();
