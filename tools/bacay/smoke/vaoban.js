// Mô phỏng ĐÚNG luồng người chơi bấm: đăng nhập → xin danh sách → bấm vào một bàn.
// Khẳng định: ảnh chụp bàn nằm trong PHẢN HỒI của lệnh, không phải bản tin đẩy.
'use strict';
const { default: Transport } = require('./net/Transport');
const { MsgType } = require('./net/Envelope');
const { taoToken, docSecret } = require('./token');
const URL = process.argv[2], SECRET = docSecret(process.argv[3]);

(async () => {
    const day = [];
    const net = new Transport({ url: URL, token: taoToken(200_178_001, 'VaoBan', SECRET) });
    net.onSuKien((env) => { if (env.d && typeof env.d.rid === 'number' && env.d.seats) day.push('đẩy'); });
    net.noi();
    await net.gui(MsgType.Login, {});

    const ds = await net.gui(MsgType.ZoneCmd, { g: 51, c: 10, d: {} });
    const ban = ds.d.rooms[0];
    console.log(`  sảnh có ${ds.d.rooms.length} bàn, bấm vào #${ban.rid}`);

    const vao = await net.gui(MsgType.JoinRoom, { d: { rid: ban.rid } });
    const coAnhChup = !vao.e && vao.d && typeof vao.d.rid === 'number' && Array.isArray(vao.d.seats);
    console.log(`  PHẢN HỒI: rid=${vao.d && vao.d.rid} mySeat=${vao.d && vao.d.mySeat}` +
        ` seats=${vao.d && vao.d.seats ? vao.d.seats.length : '-'} phase=${vao.d && vao.d.phase}`);
    await new Promise((r) => setTimeout(r, 1200));
    console.log(`  bản tin ĐẨY mang ảnh chụp nhận được: ${day.length}`);

    await net.gui(MsgType.LeaveRoom, {});
    net.dong();

    console.log();
    if (!coAnhChup) { console.error('❌ phản hồi KHÔNG mang ảnh chụp'); process.exit(1); }
    if (vao.d.mySeat < 0) { console.error('❌ không được xếp ghế'); process.exit(1); }
    console.log('✅ Ảnh chụp bàn nằm trong PHẢN HỒI. Client phải phát sự kiện từ đây,');
    console.log('   không được chỉ nghe đường đẩy — đó đúng là lỗi vừa vá.');
})().catch((e) => { console.error('❌', e); process.exit(1); });
