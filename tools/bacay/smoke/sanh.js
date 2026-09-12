// Kiểm sảnh: ROOM_LIST không kèm `bet` phải trả về mọi bàn. Chỉ ĐỌC, không chạm tiền.
'use strict';
const { default: Transport } = require('./net/Transport');
const { MsgType } = require('./net/Envelope');
const { taoToken, docSecret } = require('./token');
const URL = process.argv[2], SECRET = docSecret(process.argv[3]);

(async () => {
    const net = new Transport({ url: URL, token: taoToken(200_179_002, 'Sanh', SECRET) });
    net.noi();
    const dn = await net.gui(MsgType.Login, {});
    if (dn.e) { console.error('❌ đăng nhập:', dn.e); process.exit(1); }

    for (const [nhan, d] of [['không kèm bet', {}], ['bet: 0 (kiểu cũ)', { bet: 0 }], ['bet: 1000', { bet: 1000 }]]) {
        const r = await net.gui(MsgType.ZoneCmd, { g: 51, c: 10, d });
        const n = r.d && r.d.rooms ? r.d.rooms.length : -1;
        console.log(`  ${nhan.padEnd(18)} → ${n} bàn` +
            (n > 0 ? '  ' + r.d.rooms.slice(0, 3).map(x => `#${x.rid}/${x.bet}(${x.seats}/${x.maxSeat})`).join(' ') : ''));
    }
    net.dong();
})().catch(e => { console.error('❌', e); process.exit(1); });
