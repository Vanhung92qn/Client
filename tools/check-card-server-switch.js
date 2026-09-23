/**
 * Offline harness for the stale-card-socket fix.
 *
 * Loads the REAL assets/cardroom/scripts/WSCardGameHandle.js inside a stub Cocos environment and
 * drives the exact sequence that broke on 2026-09-24: open one card game, leave, open another.
 *
 * What it proves, without a browser:
 *   1. getUrlServer() follows the game, instead of pinning the first address of the session.
 *   2. connectWS(url) honours its argument instead of dropping it.
 *   3. Switching games closes the previous socket instead of trading on it.
 *   4. A game with no backend yields '' and opens nothing, rather than silently reusing another
 *      game's server.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = 'C:/ClientCaoRua/assets/cardroom/scripts/WSCardGameHandle.js';

// ── stub world ──────────────────────────────────────────────────────────────────────────────
let currentGameId = null;
const sockets = [];          // every WebSocket ever constructed, in order

class FakeWebSocket {
    constructor(url) {
        this.url = url;
        this.readyState = 1;            // OPEN
        this.closed = false;
        this.closeCount = 0;
        sockets.push(this);
    }
    close() { this.closed = true; this.closeCount++; this.readyState = 3; if (this.onclose) this.onclose({}); }
    send() {}
}
FakeWebSocket.OPEN = 1;
FakeWebSocket.CLOSED = 3;
FakeWebSocket.CLOSING = 2;

const logs = { error: [], warn: [] };
const cc = {
    log() {}, warn(...a) { logs.warn.push(a.join(' ')); },
    error(...a) { logs.error.push(a.join(' ')); },
    macro: { REPEAT_FOREVER: 0xffffffff },
    isValid: () => true,
    RoomController: { getInstance: () => ({ getGameId: () => currentGameId }) },
    ServerConnector: { getInstance: () => ({ getToken: () => 'TOKEN' }) },
    director: { emit() {}, getScheduler: () => ({ schedule() {}, unschedule() {}, enableForTarget() {}, unscheduleUpdate() {}, scheduleUpdate() {} }) },
};

// Subdomain map mirrors GameConfigManager.TEN_MIEN_THEO_GAME. 204 (Catte) deliberately absent:
// that game has no backend, and the point is that it must NOT fall back to another one.
const DOMAINS = { 201: 'lieng', 206: 'tienlen', 117: 'caorua' };

const stubs = {
    BangGhi: { default: { dangPhatLai: () => false, ghiVao() {}, ghiRa() {}, ganSocketGia() {} } },
    MessageCardGameHandler: { Message: { MessageType: { LogIn_Type: 1 } }, Global_Message: {} },
    NhatKy: { cai() {} },
    DongHo: { default: { now: () => Date.now() } },
    MessageHandlerBase: { default: {} },
    GameDefine: { ENetworkState: { GOOD: 1, DISCONNECT: 2 }, GameEventMessage: { WS_CARD_CONNECT_ERROR: 'e' } },
    WSXDGamesHandle: { default: { getInstance: () => ({ closeSocket() {} }) } },
    GameConfigManager: {
        default: {
            getInstance: () => ({
                getWsCardUrl() {
                    const sub = DOMAINS[currentGameId];
                    if (!sub) throw new Error('Khong biet game ' + currentGameId + ' chay tren backend nao.');
                    return 'wss://' + sub + '.bay789x.me/websocket';
                },
            }),
        },
    },
};

const sandbox = {
    cc, WebSocket: FakeWebSocket, console,
    module: { exports: {} },
    require: (name) => {
        if (stubs[name]) return stubs[name];
        throw new Error('harness thiếu stub cho module: ' + name);
    },
    setTimeout, clearTimeout, setInterval, clearInterval, Date, JSON, Math,
};
sandbox.exports = sandbox.module.exports;   // Cocos modules assign to `exports`
sandbox.window = { navigator: { onLine: true } };
sandbox.navigator = sandbox.window.navigator;

vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(SRC, 'utf8'), sandbox, { filename: SRC });

const WSCardGameHandle = sandbox.module.exports.default;

// ── checks ──────────────────────────────────────────────────────────────────────────────────
let failed = 0;
function check(label, actual, expected) {
    const ok = actual === expected;
    if (!ok) failed++;
    console.log((ok ? '  OK   ' : '  SAI  ') + label +
        (ok ? '' : '\n         mong đợi: ' + expected + '\n         nhận được: ' + actual));
}

const ws = WSCardGameHandle.getInstance();

console.log('\n[1] Mở Liêng (gid 201)');
currentGameId = 201;
let url = ws.getUrlServer();
check('getUrlServer -> lieng', url, 'wss://lieng.bay789x.me/websocket');
ws.connectWS(url);
check('socket mở tới lieng', sockets[sockets.length - 1].url, 'wss://lieng.bay789x.me/websocket');
check('số socket đã tạo', sockets.length, 1);
ws.onWSOpen({});                       // giả lập máy chủ chấp nhận
check('isSocketOpen sau khi mở', ws.isSocketOpen, true);

console.log('\n[2] Thoát Liêng, mở Tiến Lên MN (gid 206) — ĐÂY LÀ CHỖ TỪNG HỎNG');
currentGameId = 206;
url = ws.getUrlServer();
check('getUrlServer ĐI THEO GAME', url, 'wss://tienlen.bay789x.me/websocket');

const socketLieng = sockets[0];
ws.connectWS(url);
check('socket Liêng ĐÃ bị đóng', socketLieng.closed, true);
check('đã tạo socket thứ hai', sockets.length, 2);
check('socket mới tới tienlen', sockets[1].url, 'wss://tienlen.bay789x.me/websocket');

console.log('\n[3] Mở Cát Tê (gid 204) — game CHƯA có backend');
currentGameId = 204;
url = ws.getUrlServer();
check('getUrlServer trả rỗng, KHÔNG mượn máy chủ khác', url, '');
check('có báo lỗi rõ ràng', logs.error.length > 0, true);
const soSocketTruoc = sockets.length;
// BaseScene không gọi connectWS khi địa chỉ rỗng — mô phỏng đúng chốt đó.
if (url) ws.connectWS(url);
check('KHÔNG mở thêm socket nào', sockets.length, soSocketTruoc);

console.log('\n[4] Gọi getUrlServer nhiều lần cùng một game chỉ báo lỗi MỘT lần');
const soLoiTruoc = logs.error.length;
ws.getUrlServer(); ws.getUrlServer(); ws.getUrlServer();
check('không spam console', logs.error.length, soLoiTruoc);

console.log('\n[5] Quay lại Liêng thì nối lại đúng máy chủ Liêng');
currentGameId = 201;
url = ws.getUrlServer();
check('getUrlServer -> lieng', url, 'wss://lieng.bay789x.me/websocket');
ws.connectWS(url);
check('socket tienlen đã đóng', sockets[1].closed, true);
check('socket mới nhất tới lieng', sockets[sockets.length - 1].url, 'wss://lieng.bay789x.me/websocket');

console.log('\n' + (failed === 0 ? '✅ TẤT CẢ ĐỀU ĐÚNG' : '❌ CÓ ' + failed + ' PHÉP KIỂM SAI'));
process.exit(failed === 0 ? 0 : 1);
