'use strict';
/*
 * WSLiveGameHandle — LỚP GIẢ RỖNG.
 *
 * Bản gốc: C:\Reverse\go88\assets\scripts\L00\WSLiveGameHandle.js
 * Ở Go88 đây là socket cho mảng LIVE (game có người dẫn, chat live, tip dealer). Game bài
 * KHÔNG dùng nó. Cùng họ với `WSCardGameHandle` và `WSXDGamesHandle` — cả ba đều là trục.
 *
 * 🔴 VÌ SAO PHẢI CÓ TỆP NÀY: nó là CỬA RÒ LỚN NHẤT của bộ bê.
 *
 *     BuyInViewController → PopupBase → WSLiveGameHandle → MiniGameData
 *         → WSMiniGamesHandle → LobbyViewController → đăng nhập, đăng ký, captcha,
 *           live stream, thư viện mã hoá…
 *
 * Bao đóng của Phỏm là 340 script, của Sâm Lốc — game cùng họ luật, cùng cỡ — là 66. Toàn bộ
 * 286 script chênh lệch đi qua đúng một cạnh: `PopupBase` require tệp này. Mậu Binh rò y hệt.
 *
 * Mà `PopupBase` dùng gì ở đây? ĐÚNG MỘT HẰNG SỐ TÊN SỰ KIỆN, ở ba chỗ:
 *     PopupBase.js:138  cc.systemEvent.emit(d.EventPopupGameShowHide, true,  this.node)
 *     PopupBase.js:170  cc.systemEvent.emit(d.EventPopupGameShowHide, false, this.node)
 *     PopupBase.js:200  cc.systemEvent.emit(d.EventPopupGameShowHide, false, this.node)
 * Không có gì khác. Một chuỗi kéo theo 286 script.
 *
 * 🔴 GIÁ TRỊ CHUỖI PHẢI GIỮ NGUYÊN VĂN. Tên sự kiện nằm trong danh sách CẤM ĐỔI: bên phát
 * (`PopupBase`) và bên nghe khớp nhau bằng chuỗi, không qua ký hiệu nào. Đổi một chữ là popup
 * vẫn mở bình thường còn bên nghe im lặng không bao giờ chạy.
 *
 * 🔴 CẤM mở kết nối ở đây: địa chỉ socket live là hạ tầng Go88 và khung đăng nhập của nó mang
 * accessToken của người chơi. Tệp này không được chạm vào WebSocket, dưới mọi hình thức.
 */
Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Tên sự kiện "popup trong game vừa hiện / vừa ẩn".
 * Giữ nguyên văn chuỗi của bản gốc (WSLiveGameHandle.js:39) — đây là hợp đồng duy nhất mà
 * `PopupBase` cần ở tệp này.
 */
exports.EventPopupGameShowHide = 'EventPopupGameShowHide';

var WSLiveGameHandle = (function () {
    function WSLiveGameHandle() {
        // Luôn đóng — cái phanh giữ cho không lệnh nào đi nhầm sang hạ tầng live của Go88.
        this.isSocketOpen = false;
        this.isSocketLogined = false;
        // Cùng hình dạng WebSocketConnecter của Go88 nhưng rỗng ruột: `ws` null vĩnh viễn,
        // `sendData` nuốt im lặng. Giữ hình dạng để nhánh nào lỡ đọc tới không vấp
        // ReferenceError — chứ không phải để nó chạy được.
        this.ws = {
            ws: null,
            sendData: function (_data, _log) {}
        };
        this.name = 'Socket Live';
        this.urlServer = '';
        this.isReconnectOnClose = false;
        this.isNeedLogin = false;
    }

    WSLiveGameHandle.getInstance = function () {
        if (this.Instance === null || this.Instance === undefined) {
            this.Instance = new WSLiveGameHandle();
        }
        return this.Instance;
    };

    // Mọi lối vào mạng đều nuốt im lặng. KHÔNG ném: bản gốc gọi mấy hàm này ở nhánh dọn dẹp
    // (đóng popup, rời bàn), ném ở đó là giết cả luồng thoát.
    WSLiveGameHandle.prototype.connectWS = function (_url) {};
    WSLiveGameHandle.prototype.closeWS = function () {};
    WSLiveGameHandle.prototype.sendData = function (_data) {};
    WSLiveGameHandle.prototype.login = function () {};

    WSLiveGameHandle.Instance = null;
    return WSLiveGameHandle;
})();

exports.default = WSLiveGameHandle;
