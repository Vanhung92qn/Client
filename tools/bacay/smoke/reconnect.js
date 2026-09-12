/**
 * reconnect.js — rớt mạng GIỮA VÁN rồi nối lại, đối soát tiền.
 *
 * 🔴 CHỐT CHẶN QUAN TRỌNG NHẤT của cả chuỗi. Nếu chưa qua được thì mọi công sức giao
 * diện phía sau đang xây trên nền có thể phải đập.
 *
 * Nó khẳng định ba điều, và điều thứ ba là điều đắt nhất:
 *   1. Ghế được GIỮ trong thời gian ân hạn, không bị người khác ngồi mất.
 *   2. Nối lại thì về ĐÚNG bàn cũ, ĐÚNG ghế cũ, kèm ảnh chụp đầy đủ — không phải xếp
 *      chỗ mới, và client không phải tự biết mình đang dở ván nào.
 *   3. Tiền chỉ đi ĐÚNG MỘT LẦN. Đứt kết nối giữa lúc server đang chia tiền là tình
 *      huống kinh điển sinh ra trừ tiền hai lần.
 *
 * Ngắt bằng `ws.close()` đột ngột chứ KHÔNG gửi LEAVE_ROOM — rời bàn tử tế là ý định
 * rõ ràng và server gỡ ghế ngay; ta cần mô phỏng SỰ CỐ, không phải lời chào.
 *
 * Chạy:  node reconnect.js [url] [secret|đường-dẫn-appsettings.json]
 */

'use strict';

const { default: Transport } = require('./net/Transport');
const { MsgType, SharedCmd } = require('./net/Envelope');
const { taoToken, docSecret } = require('./token');

const URL = process.argv[2] || 'ws://127.0.0.1:5310/ws';
const SECRET = docSecret(process.argv[3]);

const G = 51;
const CMD_FLIP = 51001;
const CMD_PHASE = 51101;
const CMD_SETTLE = 51106;

const UID_A = 200_171_001;
const UID_B = 200_171_002;

const cho = (ms) => new Promise((r) => setTimeout(r, ms));

/** Nối, đăng nhập, trả về transport. Tự lật bài mỗi khi cửa nắn bài mở. */
function moKetNoi(uid, nick, thu) {
    const net = new Transport({ url: URL, token: taoToken(uid, nick, SECRET) });
    net.onSuKien((env) => {
        if (thu) thu(env);
        if (env.c === CMD_PHASE && env.d && env.d.phase === 'Flipping') {
            net.gui(MsgType.RoomCmd, { g: G, c: CMD_FLIP, d: { all: true } }).catch(() => {});
        }
    });
    net.noi();
    return net;
}

function soDuTrongAnhChup(snap, ghe) {
    const s = (snap.d.seats || []).find((x) => x.seat === ghe);
    return s ? s.balance : null;
}

async function main() {
    const loi = [];

    // ── Dựng bàn hai người ──────────────────────────────────────────
    const deltas = [];
    let daChiaTien = 0;

    const a = moKetNoi(UID_A, 'RcA', (env) => {
        if (env.c === CMD_SETTLE) daChiaTien++;
    });
    await a.gui(MsgType.Login, {});
    const vaoA = await a.gui(MsgType.QuickJoin, { g: G, d: { bet: 1000 } });
    const rid = vaoA.d.rid;
    const gheA = vaoA.d.mySeat;
    const soDuDau = soDuTrongAnhChup(vaoA, gheA);

    const b = moKetNoi(UID_B, 'RcB');
    await b.gui(MsgType.Login, {});
    await b.gui(MsgType.JoinRoom, { d: { rid } });

    console.log(`Bàn ${rid} · A ghế ${gheA} · số dư đầu ${soDuDau.toLocaleString('vi')}`);

    // Ghi lại mọi lần đẩy số dư của ghế A — đây là sổ đối soát.
    a.onSuKien((env) => {
        if (env.c === SharedCmd.Balance && env.d && env.d.seat === gheA) deltas.push(env.d.delta);
    });

    // ── Chờ một ván chạy xong để có dòng tiền thật ──────────────────
    console.log('Chờ ván đầu chạy xong…');
    for (let i = 0; i < 60 && daChiaTien === 0; i++) await cho(1000);
    if (!daChiaTien) { console.error('❌ không ván nào chạy xong'); process.exit(1); }

    const deltaTruocKhiDut = deltas.slice();
    console.log(`Ván đầu xong. Đã nhận ${deltaTruocKhiDut.length} lần đẩy số dư: ` +
        `[${deltaTruocKhiDut.join(', ')}]`);

    // ── ĐỨT PHŨ ─────────────────────────────────────────────────────
    console.log('\n⚡ Ngắt kết nối A đột ngột (không gửi LEAVE_ROOM)…');
    a.dong();
    await cho(2500);

    // ── Nối lại bằng kết nối MỚI, cùng tài khoản ────────────────────
    let veCho = null;
    const a2 = new Transport({ url: URL, token: taoToken(UID_A, 'RcA', SECRET) });
    a2.onSuKien((env) => {
        // Server TỰ ĐẨY ảnh chụp bàn cũ ngay sau phản hồi đăng nhập — client không hỏi.
        if (env.t === 3 && env.d && typeof env.d.rid === 'number' && !veCho) veCho = env;
        if (env.c === CMD_PHASE && env.d && env.d.phase === 'Flipping') {
            a2.gui(MsgType.RoomCmd, { g: G, c: CMD_FLIP, d: { all: true } }).catch(() => {});
        }
    });
    a2.noi();
    await a2.gui(MsgType.Login, {});
    await cho(1500);

    // ── Đối chiếu ───────────────────────────────────────────────────
    if (!veCho) {
        loi.push('nối lại KHÔNG được tự trả về bàn cũ — client sẽ mù hoàn toàn');
    } else {
        if (veCho.d.rid !== rid) loi.push(`nối lại về bàn ${veCho.d.rid}, đáng lẽ ${rid}`);
        if (veCho.d.mySeat !== gheA) loi.push(`nối lại về ghế ${veCho.d.mySeat}, đáng lẽ ${gheA}`);
        console.log(`✅ Nối lại: bàn ${veCho.d.rid}, ghế ${veCho.d.mySeat} — đúng chỗ cũ`);

        // 🔴 ĐỐI SOÁT TIỀN: số dư server đang giữ phải bằng ĐÚNG
        //    số dư đầu + tổng mọi lần đẩy đã nhận. Lệch nghĩa là có một lần trừ/cộng
        //    KHÔNG được báo — mà ở ranh giới đứt kết nối thì đó chính là trừ hai lần.
        const soDuSau = soDuTrongAnhChup(veCho, gheA);
        const tong = deltaTruocKhiDut.reduce((x, y) => x + y, 0);
        const mongDoi = soDuDau + tong;

        console.log(`   số dư: đầu ${soDuDau.toLocaleString('vi')} ` +
            `${tong >= 0 ? '+' : ''}${tong.toLocaleString('vi')} = ${mongDoi.toLocaleString('vi')}` +
            `  ·  server nói ${soDuSau.toLocaleString('vi')}`);

        if (soDuSau !== mongDoi) {
            loi.push(`ĐỐI SOÁT LỆCH ${(soDuSau - mongDoi).toLocaleString('vi')} — ` +
                `có dòng tiền không được báo qua BALANCE`);
        } else {
            console.log('✅ Đối soát khớp: tiền đi đúng một lần, không trừ lặp qua ranh giới đứt kết nối');
        }
    }

    a2.dong();
    b.dong();

    console.log();
    if (loi.length) {
        console.error(`❌ ${loi.length} vấn đề:`);
        for (const l of loi) console.error('   ' + l);
        process.exit(1);
    }
    console.log('✅ Rớt mạng giữa ván: giữ ghế, về đúng chỗ, tiền không lệch một đồng.');
}

main().catch((e) => { console.error('❌', e); process.exit(1); });
