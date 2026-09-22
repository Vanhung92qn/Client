/**
 * NhatKy.js — bộ ghi nhật ký PHÍA CLIENT cho game Cào Rùa.
 *
 * 🔴 VÌ SAO CẦN: phần lớn lỗi của bản bê này nằm ở client và KHÔNG để lại một dấu vết nào ở
 * server. Ba lỗi nặng nhất tìm được trong ngày — sảnh thiếu lối vào, client kéo assets từ CDN
 * bản cũ, IIS trả 404 cho .webp — log server im lặng tuyệt đối với cả ba. Người ngồi trước màn
 * hình thấy được, còn người đọc log thì không. Tệp này lấp đúng khoảng mù đó.
 *
 * Ghi ba thứ:
 *   · mọi khung WebSocket đi và về (đây là thứ quý nhất — nó cho biết server nói gì, client
 *     hiểu ra sao, và chỗ nào đứt mạch);
 *   · mọi lỗi JS chưa bắt được, kể cả lỗi trong Promise;
 *   · các mốc do chính lớp giả tự ghi (mở socket, vào bàn, đổi cảnh...).
 *
 * 🔴 CHE TOKEN: khung đăng nhập mang `accessToken` THẬT của người chơi. Nhật ký này sinh ra để
 * gửi đi cho người khác đọc, nên token PHẢI bị che trước khi vào bộ đệm — không phải lúc xuất
 * ra. Che lúc xuất là sớm muộn sẽ có đường rò.
 *
 * Cách dùng (mở F12 → Console):
 *   layLog()    → in ra toàn bộ nhật ký dạng chữ, bôi đen rồi chép
 *   taiLog()    → tải về một tệp .txt (tiện hơn khi nhật ký dài)
 *   xoaLog()    → xoá sạch để bắt đầu một lượt thử mới
 *
 * Nhật ký được giữ lại qua F5 (lưu ở localStorage), nên vẫn đọc được sau khi trang tải lại —
 * đúng lúc cần nhất, vì lỗi nặng thường bắt người ta phải tải lại trang.
 */

'use strict';

var SUC_CHUA = 600;          // đủ cho vài ván; vượt thì bỏ dòng cũ nhất
var KHOA_LUU = 'caorua_nhatky';
var DAI_TOI_DA = 600;        // cắt bớt khung quá dài cho dễ đọc

var dem = [];
var batDau = Date.now();
var daCai = false;

/** Giây kể từ lúc bắt đầu phiên, để lần theo thứ tự sự việc. */
function moc() {
    return ((Date.now() - batDau) / 1000).toFixed(2);
}

function gioDongHo() {
    var d = new Date();
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2)
        + ':' + ('0' + d.getSeconds()).slice(-2);
}

/**
 * 🔴 Che mọi thứ trông giống bí mật TRƯỚC khi đưa vào bộ đệm.
 * Bắt cả `accessToken` lẫn `token` vì hai tên này đều xuất hiện trong khung của Go88.
 */
function cheBiMat(s) {
    if (typeof s !== 'string') return s;
    return s.replace(/("(?:accessToken|token|pwd|password)"\s*:\s*")([^"]{0,999})(")/gi,
        function (_, dau, giua, cuoi) {
            return dau + '«đã che ' + giua.length + ' ký tự»' + cuoi;
        });
}

function ghi(nhan, noiDung) {
    var s = typeof noiDung === 'string' ? noiDung : JSON.stringify(noiDung);
    s = cheBiMat(s || '');
    if (s.length > DAI_TOI_DA) s = s.slice(0, DAI_TOI_DA) + '…(' + s.length + ' ký tự)';
    dem.push(moc().padStart(8) + 's ' + gioDongHo() + ' ' + nhan + ' ' + s);
    if (dem.length > SUC_CHUA) dem.shift();
    luu();
}

var hanLuu = null;
/** Gom nhiều lần ghi rồi mới chạm localStorage — ghi từng dòng sẽ giật game. */
function luu() {
    if (hanLuu) return;
    hanLuu = setTimeout(function () {
        hanLuu = null;
        try { cc.sys.localStorage.setItem(KHOA_LUU, dem.join('\n')); } catch (e) { /* đầy bộ nhớ thì thôi */ }
    }, 1000);
}

function doc() {
    var cu = '';
    try { cu = cc.sys.localStorage.getItem(KHOA_LUU) || ''; } catch (e) { cu = ''; }
    return cu;
}

/**
 * Cài một lần cho cả phiên. Gọi từ BaseScene.onLoad.
 *
 * Bắt lỗi ở BA đường vì mỗi đường lọt một kiểu khác nhau: `window.onerror` không thấy lỗi
 * trong Promise, `unhandledrejection` không thấy lỗi đồng bộ, còn `cc.error` là đường riêng
 * của engine mà hai cái kia không đụng tới.
 */
function cai() {
    if (daCai) return;
    daCai = true;

    var cuOnError = window.onerror;
    window.onerror = function (msg, tep, dong, cot, loi) {
        ghi('LỖI ', msg + ' @ ' + (tep || '?') + ':' + dong + ':' + cot
            + (loi && loi.stack ? '\n' + String(loi.stack).split('\n').slice(0, 4).join('\n') : ''));
        if (typeof cuOnError === 'function') return cuOnError.apply(this, arguments);
        return false;
    };

    window.addEventListener('unhandledrejection', function (e) {
        ghi('LỖI ', 'Promise không bắt: ' + (e && e.reason ? (e.reason.stack || e.reason.message || e.reason) : '?'));
    });

    // 🔴 BỌC `cc.error` LÀ CON DAO HAI LƯỠI: trình duyệt quy mọi lỗi về DÒNG NÀY thay vì nơi
    // phát sinh thật. Chủ dự án đã gửi "NhatKy.js:112 getComponent: Type must be non-nil" — số
    // dòng đó vô dụng, nó chỉ là chỗ mình gọi lại hàm gốc.
    // Nên phải TỰ chụp ngăn xếp và in ra, nếu không bộ ghi log lại che mất đúng thứ nó sinh ra
    // để soi. Bỏ 3 khung đầu (Error, hàm này, chỗ gọi cc.error trong engine) cho đỡ nhiễu.
    var cuCcError = cc.error;
    cc.error = function () {
        var noiDung = '';
        try { noiDung = Array.prototype.join.call(arguments, ' '); } catch (x) { /* bỏ qua */ }

        var nguon = '';
        try {
            var khung = String(new Error().stack || '').split('\n').slice(3, 7)
                .map(function (d) { return d.trim(); })
                .filter(function (d) { return d && d.indexOf('NhatKy.js') < 0; });
            if (khung.length) nguon = '\n    ← ' + khung.join('\n    ← ');
        } catch (x) { /* bỏ qua */ }

        try { ghi('cc.error', noiDung + nguon); } catch (x) { /* bỏ qua */ }
        // In thẳng ra console kèm nguồn, vì dòng do engine in ra sẽ mang số dòng của TỆP NÀY.
        if (nguon) { try { console.warn('[NhatKy] lỗi trên phát sinh từ:' + nguon); } catch (x) { /* bỏ qua */ } }
        return cuCcError.apply(cc, arguments);
    };

    ghi('BẮT ĐẦU', 'phiên mới · ' + location.href + ' · ' + navigator.userAgent.slice(0, 90));

    // Ba hàm này cố ý gắn vào window để mở F12 gõ được ngay, không phải tìm đường require.
    window.layLog = function () {
        var s = xuat();
        console.log(s);
        return '(' + dem.length + ' dòng — bôi đen phần trên rồi chép, hoặc gõ taiLog() để tải về tệp)';
    };

    window.taiLog = function () {
        try {
            var b = new Blob([xuat()], { type: 'text/plain;charset=utf-8' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(b);
            a.download = 'caorua-nhatky-' + gioDongHo().replace(/:/g, '') + '.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return 'đã tải về';
        } catch (e) {
            return 'không tải được (' + e.message + ') — dùng layLog() rồi chép tay';
        }
    };

    window.xoaLog = function () {
        dem = [];
        batDau = Date.now();
        try { cc.sys.localStorage.removeItem(KHOA_LUU); } catch (e) { /* bỏ qua */ }
        return 'đã xoá, bắt đầu lượt thử mới';
    };
}

function xuat() {
    var cu = doc();
    var nay = dem.join('\n');
    // Phần trước F5 để lên trên, phần hiện tại ở dưới — đọc theo dòng thời gian.
    return cu && cu !== nay ? cu + '\n──── (tải lại trang) ────\n' + nay : nay;
}

module.exports = {
    cai: cai,
    ghi: ghi,
    xuat: xuat,
};
