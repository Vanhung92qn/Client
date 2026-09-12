/**
 * ketnoi.js — endpoint công khai có mang nổi WebSocket không.
 *
 * Khác `smoke.js` ở một điểm quan trọng: nó KHÔNG vào bàn, KHÔNG chơi ván nào.
 *
 * Vì sao: bản chạy thật cắm VÍ THẬT. Vào bàn là server thu tiền sàn, và một tài khoản
 * bịa trong bài kiểm sẽ để lại dòng tiền thật trong sổ cái thật. Chuyện cần chứng minh
 * ở đây chỉ là đường truyền — bắt tay, nâng cấp lên WebSocket, khung bản tin, nhịp tim —
 * và cả bốn thứ đó chứng minh được mà không cần chạm tới một đồng nào.
 *
 * Chạy:  node ketnoi.js wss://card.bay789x.me/ws <đường-dẫn-appsettings.json>
 */

'use strict';

const { default: Transport } = require('./net/Transport');
const { MsgType } = require('./net/Envelope');
const { taoToken, docSecret } = require('./token');

const URL = process.argv[2] || 'wss://card.bay789x.me/ws';
const SECRET = docSecret(process.argv[3]);

const cho = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
    const loi = [];
    const net = new Transport({ url: URL, token: taoToken(200_179_001, 'KetNoi', SECRET) });
    net.onTrangThai((t) => console.log('  [trạng thái]', t));
    net.noi();

    const dn = await net.gui(MsgType.Login, {}).catch((e) => ({ e: -1, _loi: e.message }));
    if (dn.e) {
        console.error('❌ Đăng nhập hỏng:', dn.e, dn._loi || '');
        process.exit(1);
    }
    console.log(`✅ Đăng nhập qua ${URL}: userId=${dn.d.userId} games=[${dn.d.games}]`);

    // Đợi vài nhịp tim để đồng hồ kịp lấy mẫu — cũng là cách chứng minh Cloudflare
    // KHÔNG cắt kết nối nhàn rỗi giữa chừng.
    for (let i = 0; i < 12 && !net.dongHoSanSang(); i++) await cho(1000);

    console.log(`   RTT ${net.rtt()}ms · đồng hồ ${net.dongHoSanSang() ? 'đã đồng bộ' : 'CHƯA'}` +
        ` · lệch ${Math.round(net.serverNow() - Date.now())}ms`);

    if (!net.dongHoSanSang()) loi.push('không nhận được PONG — nhịp tim không qua được proxy');

    // Giữ im lặng một quãng: proxy nào cắt kết nối nhàn rỗi thì lộ ra ở đây.
    console.log('   Giữ im lặng 45 giây để xem có bị cắt kết nối nhàn rỗi không…');
    await cho(45_000);
    if (net.trangThaiHienTai() !== 'da-noi') {
        loi.push('kết nối rụng khi nhàn rỗi (trạng thái ' + net.trangThaiHienTai() + ')');
    } else {
        console.log('   ✅ Sau 45 giây vẫn còn kết nối.');
    }

    net.dong();
    console.log();
    if (loi.length) {
        console.error('❌ ' + loi.length + ' vấn đề:');
        for (const l of loi) console.error('   ' + l);
        process.exit(1);
    }
    console.log('✅ Endpoint công khai mang được WebSocket. Không đụng tới đồng nào.');
}

main().catch((e) => { console.error('❌', e); process.exit(1); });
