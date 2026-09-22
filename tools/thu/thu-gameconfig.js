/**
 * Chay THAT GameConfigManager.js trong Node, khong chep lai logic.
 *
 * Vi sao phai the: bai hoc lap di lap lai cua du an nay la "phep kiem chi IN ma khong SO
 * thi chi la do trang tri". Neu o day tu viet lai bang tra roi kiem bang do, phep thu se
 * luon dung ke ca khi tep that sai.
 *
 * Cach lam: boc nguyen van ban tep vao mot ham co san require/module/exports gia, va dung
 * `cc` gia o pham vi toan cuc — dung nhu Cocos lam.
 */
'use strict';

const fs = require('fs');

const DUONG_DAN = process.env.TEP || 'C:/ClientCaoRua/assets/cardgame/scripts/GameConfigManager.js';

let gameDangMo = null; // dieu khien tu phep thu

const cc = {
    sys: {
        isBrowser: false,
        localStorage: { getItem: () => null, setItem: () => {} },
    },
    log: () => {},
    warn: () => {},
    error: () => {},
    RoomController: {
        getInstance: () => ({ getGameId: () => gameDangMo }),
    },
};

const moduleGia = {
    NetConfig: { HOST: 'bay789x.me' },
};

function napThat() {
    const ma = fs.readFileSync(DUONG_DAN, 'utf8');
    const exp = {};
    const mod = { exports: exp };
    // Module anh em (./StringUtil, ./MusicPlayer…) khong lien quan toi thu dang thu, nhung ham
    // dung co cham vao. Tra ve mot vat the "noi gi cung co" de no chay qua, thay vi cat bot ma
    // that di cho de thu — cat bot la lam phep thu mat rang.
    const noiGiCungCo = new Proxy(function () {}, {
        get: (dich, khoa) => (khoa === Symbol.toPrimitive ? () => '' : noiGiCungCo),
        apply: () => noiGiCungCo,
        construct: () => noiGiCungCo,
    });
    const req = (ten) => {
        if (moduleGia[ten]) return moduleGia[ten];
        if (ten.startsWith('.')) return noiGiCungCo;
        throw new Error('phep thu chua gia lap module: ' + ten);
    };
    const boc = new Function('require', 'module', 'exports', 'cc', ma);
    boc(req, mod, exp, cc);
    return exp;
}

const GCM = napThat();
const cfg = GCM.default.getInstance();

let loi = 0;
function soSanh(nhan, thuc, mong) {
    const dat = thuc === mong;
    if (!dat) loi++;
    console.log('%s %s\n    duoc : %s\n    mong : %s',
        dat ? 'OK  ' : 'SAI ', nhan, JSON.stringify(thuc), JSON.stringify(mong));
}

function nem(nhan, ham) {
    try {
        const r = ham();
        loi++;
        console.log('SAI  %s\n    dang le phai NEM, nhung tra ve: %s', nhan, JSON.stringify(r));
    } catch (e) {
        console.log('OK   %s\n    da nem: %s', nhan, String(e.message).slice(0, 80) + '…');
    }
}

console.log('=== Cao Rua dang mo (117) ===');
gameDangMo = '117';
soSanh('getWsCardUrl', cfg.getWsCardUrl(), 'wss://caorua.bay789x.me/websocket');
soSanh('enviromentName', cfg.enviromentName, 'caorua');
soSanh('duatopTxURL', cfg.duatopTxURL, 'https://caorua.bay789x.me/api/duatop');

console.log('\n=== Lieng dang mo (201) — CHINH LA CAI TRUOC DAY GAY ===');
gameDangMo = '201';
soSanh('getWsCardUrl', cfg.getWsCardUrl(), 'wss://lieng.bay789x.me/websocket');
soSanh('enviromentName', cfg.enviromentName, 'lieng');
soSanh('duatopTxURL', cfg.duatopTxURL, 'https://lieng.bay789x.me/api/duatop');

console.log('\n=== gid dang SO chu khong phai chuoi ===');
gameDangMo = 201;
soSanh('getWsCardUrl', cfg.getWsCardUrl(), 'wss://lieng.bay789x.me/websocket');

console.log('\n=== chua vao game nao ===');
gameDangMo = null;
soSanh('enviromentName -> chuoi rong', cfg.enviromentName, '');
soSanh('duatopTxURL -> chuoi rong', cfg.duatopTxURL, '');
nem('getWsCardUrl -> phai NEM', () => cfg.getWsCardUrl());

console.log('\n=== game chua khai trong bang (vd Poker se be sau) ===');
gameDangMo = '999';
nem('getWsCardUrl -> phai NEM', () => cfg.getWsCardUrl());
soSanh('enviromentName -> chuoi rong', cfg.enviromentName, '');

console.log('\n=== KIEM CHUNG PHEP THU CO RANG: cac cho doc that van chay dung ===');
gameDangMo = '201';
// Day la 3 bieu thuc nguyen van lay tu ma that, khong phai mo phong:
//   HeaderUi.js:292        enviromentName.includes("caorua")
//   GameController.js:404  enviromentName.indexOf("pre") >= 0
//   PopupInveteJoinRoom:93 "2k" != enviromentName
soSanh('HeaderUi: Lieng KHONG bat nodeDomain', cfg.enviromentName.includes('caorua'), false);
gameDangMo = '117';
soSanh('HeaderUi: Cao Rua CO bat nodeDomain', cfg.enviromentName.includes('caorua'), true);
gameDangMo = null;
soSanh('GameController: khong gui log go roi', cfg.enviromentName.indexOf('pre') >= 0, false);
soSanh('PopupInvete: khong phai ban 2k', '2k' != cfg.enviromentName, true);

console.log('\n' + (loi === 0 ? 'TAT CA DUNG' : loi + ' PHEP SAI'));
process.exit(loi === 0 ? 0 : 1);
