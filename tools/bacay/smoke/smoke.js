/**
 * smoke.js — chạy thông MỘT VÁN Cào Rùa qua WebSocket THẬT, không có giao diện.
 *
 * VÌ SAO LÀM TRƯỚC KHI VIẾT SCRIPT GIAO DIỆN: đây là chốt chặn rẻ nhất. Nếu giao thức
 * hoặc tầng vận chuyển sai thì biết bây giờ tốn vài phút; biết sau khi đã ghép xong
 * 17 prefab thì tốn vài ngày.
 *
 * Nó dùng ĐÚNG tầng vận chuyển sẽ chạy trong Cocos (assets/common/net), biên dịch ra
 * JS — không phải một bản mô phỏng viết riêng. Bản mô phỏng thì chỉ chứng minh bản
 * mô phỏng chạy được.
 *
 * Server chạy cục bộ với VÍ TRONG BỘ NHỚ nên không để lại dòng tiền nào trong sổ thật.
 *
 * Chạy:  node smoke.js <url> <secret>
 */

'use strict';

const crypto = require('crypto');
const { default: Transport } = require('./net/Transport');
const { MsgType, MsgRes, Err, SharedCmd } = require('./net/Envelope');

const URL = process.argv[2] || 'ws://127.0.0.1:5310/ws';
const SECRET = process.argv[3] || 'smoke-test-secret';

const G_BACAY = 51;
const CMD_FLIP = 51001;
const CMD_PHASE = 51101;
const CMD_DEAL = 51102;
const CMD_FLIPPED = 51103;
const CMD_SHOWDOWN = 51104;
const CMD_EXTRATIME = 51105;
const CMD_SETTLE = 51106;

/**
 * Dựng token đúng khuôn hệ cũ — xem LegacyTokenValidator.
 *   phần mã  = base64( TripleDES-ECB-PKCS7( khoá, JSON ) )
 *   khoá     = 24 byte ASCII đầu của md5hex("System.Byte[]")
 *   chữ ký   = sha256hex( "{secret}.{phần mã}" )
 *   token    = "{phần mã}.{chữ ký}"
 */
function taoToken(userId, nick, secret) {
    const md5hex = crypto.createHash('md5').update('System.Byte[]', 'ascii').digest('hex');
    const key = Buffer.from(md5hex.slice(0, 24), 'ascii');

    const json = JSON.stringify({
        UserID: userId,
        NickName: nick,
        ServiceID: 1,
        AvatarID: 0,
        IPAddress: '127.0.0.1',
        // 🔴 GIỜ ĐỊA PHƯƠNG, không phải UTC.
        // Hệ cũ phát token bằng DateTime.Now và bộ kiểm cũng so bằng DateTime.Now.
        // Ghi giờ UTC thì ở múi +7 token sinh ra đã "hết hạn" 6 tiếng trước khi kịp dùng —
        // và thông báo lỗi chỉ nói "token không hợp lệ", không nói vì sao.
        ExpiredAt: new Date(Date.now() + 3600e3 - new Date().getTimezoneOffset() * 60000)
            .toISOString().replace('Z', ''),
    });

    const c = crypto.createCipheriv('des-ede3', key, null);
    c.setAutoPadding(true);
    const phanMa = Buffer.concat([c.update(json, 'ascii'), c.final()]).toString('base64');

    const chuKy = crypto.createHash('sha256').update(`${secret}.${phanMa}`, 'utf8').digest('hex');
    return `${phanMa}.${chuKy}`;
}

const cho = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
    const ketQua = { pha: new Set(), deal: 0, flipped: 0, showdown: 0, extratime: 0, settle: 0, balance: 0 };
    const loi = [];

    const net = new Transport({ url: URL, token: taoToken(200_170_001, 'SmokeA', SECRET) });

    net.onSuKien((env) => {
        if (env.c === CMD_PHASE && env.d) ketQua.pha.add(env.d.phase);
        if (env.c === CMD_DEAL) ketQua.deal++;
        if (env.c === CMD_FLIPPED) ketQua.flipped++;
        if (env.c === CMD_SHOWDOWN) ketQua.showdown++;
        if (env.c === CMD_EXTRATIME) ketQua.extratime++;
        if (env.c === CMD_SETTLE) ketQua.settle++;
        if (env.c === SharedCmd.Balance) ketQua.balance++;

        // Cửa nắn bài mở thì lật — hành động DUY NHẤT của người chơi trong ván.
        if (env.c === CMD_PHASE && env.d && env.d.phase === 'Flipping') {
            net.gui(MsgType.RoomCmd, { g: G_BACAY, c: CMD_FLIP, d: { all: true } })
                .catch((e) => loi.push('lật bài: ' + e.message));
        }
    });

    net.onTrangThai((t) => console.log('  [trạng thái]', t));
    net.noi();

    // ── 1. Đăng nhập ────────────────────────────────────────────────
    // Không cần gửi token trong payload: tầng vận chuyển đã gắn vào query string lúc
    // bắt tay, và server nhận cả hai đường.
    const dn = await net.gui(MsgType.Login, {}).catch((e) => ({ e: -1, _loi: e.message }));
    if (dn.e) { console.error('❌ Đăng nhập hỏng:', dn.e, dn._loi || ''); process.exit(1); }
    console.log(`✅ Đăng nhập: userId=${dn.d.userId} nick=${dn.d.nick} games=[${dn.d.games}]`);

    // ── 2. Người thứ hai: Cào Rùa cần tối thiểu 2 người ─────────────
    const net2 = new Transport({ url: URL, token: taoToken(200_170_002, 'SmokeB', SECRET) });
    net2.noi();
    await net2.gui(MsgType.Login, {});

    // ── 3. Vào bàn ──────────────────────────────────────────────────
    const vao = await net.gui(MsgType.QuickJoin, { g: G_BACAY, d: { bet: 1000 } });
    if (vao.e) { console.error('❌ Vào bàn hỏng:', vao.e); process.exit(1); }
    const rid = vao.d.rid;
    console.log(`✅ Vào bàn ${rid}, ghế ${vao.d.mySeat}, ${vao.d.maxSeat} ghế, tiền sàn ${vao.d.ante}`);

    const vao2 = await net2.gui(MsgType.JoinRoom, { d: { rid: rid } });
    if (vao2.e) { console.error('❌ Người thứ hai vào bàn hỏng:', vao2.e); process.exit(1); }
    console.log(`✅ Người thứ hai vào ghế ${vao2.d.mySeat}`);

    // ── 4. Xem một ván trọn vẹn ─────────────────────────────────────
    console.log('\nChờ một ván chạy…');
    await cho(25_000);

    // ── 5. Resync — ảnh chụp đầy đủ ─────────────────────────────────
    const rs = await net.resync(G_BACAY).catch((e) => ({ e: -1, _loi: e.message }));
    const rsOk = !rs.e && rs.d && typeof rs.d.rid === 'number';

    net.dong();
    net2.dong();

    // ── Kết luận ────────────────────────────────────────────────────
    console.log('\n── Kết quả ──────────────────────────────');
    console.log('  Pha thấy được:', [...ketQua.pha].join(' → ') || '(không có)');
    console.log(`  DEAL ${ketQua.deal} · FLIPPED ${ketQua.flipped} · SHOWDOWN ${ketQua.showdown}` +
        ` · EXTRATIME ${ketQua.extratime} · SETTLE ${ketQua.settle} · BALANCE ${ketQua.balance}`);
    console.log(`  RTT ${net.rtt()}ms · đồng hồ server ${net.dongHoSanSang() ? 'đã đồng bộ' : 'CHƯA'}` +
        ` · lệch ${Math.round(net.serverNow() - Date.now())}ms`);
    console.log(`  Đã bỏ: gửi ${net.soDaBo().gui}, nhận ${net.soDaBo().nhan}`);
    console.log(`  RESYNC: ${rsOk ? 'trả ảnh chụp đầy đủ ✅' : '❌ ' + (rs._loi || rs.e)}`);

    const canCo = ['Confirm', 'Dealing', 'Flipping', 'Showdown', 'Settling'];
    const thieuPha = canCo.filter((p) => !ketQua.pha.has(p));

    if (thieuPha.length) loi.push('thiếu pha: ' + thieuPha.join(', '));
    if (!ketQua.deal) loi.push('không nhận được bài');
    if (!ketQua.settle) loi.push('không tới được pha chia tiền');
    if (!ketQua.balance) loi.push('không nhận được bản tin số dư');
    if (!rsOk) loi.push('RESYNC hỏng');
    if (!net.dongHoSanSang()) loi.push('đồng hồ server chưa đồng bộ được');

    console.log();
    if (loi.length) {
        console.error('❌ ' + loi.length + ' vấn đề:');
        for (const l of loi) console.error('   ' + l);
        process.exit(1);
    }
    console.log('✅ Một ván trọn vẹn chạy qua tầng vận chuyển thật. Giao thức thông.');
}

main().catch((e) => { console.error('❌', e); process.exit(1); });
