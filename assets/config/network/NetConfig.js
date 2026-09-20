// ─────────────────────────────────────────────────────────────────
//  Auto-detect: chay local (Cocos Creator preview / file://) -> tat CDN
//  → tranh mismatch hash khi build local chua deploy CDN.
//  Production (bay789x.me, Cloudflare) -> bat CDN.
// ─────────────────────────────────────────────────────────────────
function detectCdnUrl() {
    if (typeof window === 'undefined' || !window.location) return '';
    var host = window.location.hostname || '';
    var isLocal = host === 'localhost'
        || host === '127.0.0.1'
        || host === ''
        || /^192\.168\./.test(host)
        || /^10\./.test(host)
        || /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host);

    // 🔴 SITE THU cung phai tinh la "cuc bo". Truoc day chi loc theo localhost/IP noi bo, nen
    // MOI ten mien cong khai — ke ca web.bay789x.me — deu bi day sang CDN cua ban LIVE. Hau qua:
    // deploy ban moi len site thu xong mo ra van thay GIAO DIEN CU, vi chi index.html + main.js
    // lay cuc bo con TOAN BO canh/anh/script deu tai tu res.bay789x.me. Khong mot dong loi nao.
    // Da dinh that, va chu du an phat hien chu khong phai bo kiem tu dong.
    // Danh sach nay la cac site CHI de thu build; bay789x.me that van di qua CDN nhu cu.
    var laSiteThu = host === 'web.bay789x.me';

    return (isLocal || laSiteThu) ? '' : 'https://res.bay789x.me/';
}

module.exports = {

    HOST_U: '',
    IS_APPSTORE: false,
    PORTAL: 'test',

    HOST: 'bay789x.me',
    FB_LOGIN_URL: 'http://fbook.bay789x.me/Home/FbLogin',

    PING_TIME: 5,
    RECONNECT_TIME: 5,

    // ─────────────────────────────────────────────────────────────
    //  ASSET CDN (BundleControl):
    //  - Local (preview/test):  '' -> fallback relative URL (load tu Creator server).
    //  - Production:            'https://res.bay789x.me/' -> CDN voi cache-bust hash.
    //  Auto-detect qua hostname.
    // ─────────────────────────────────────────────────────────────
    ASSET_CDN_URL: detectCdnUrl(),

};
