'use strict';
// ============================================================================
// LỚP GIẢ — CHO RỖNG (no-op)
//
// Vì sao rỗng: bản gốc Go88 (…\L00\TabIdolLiveController.js) mở WebSocket tới game
// IDOL_LIVE của Go88 (`WSLiveGamesHandle.connectWS(GAMEID.IDOL_LIVE …)`) để hiện tab
// "Idol Live" trong popup chat. 🔴 Đây là đường ra thẳng hạ tầng Go88 → cắt hẳn.
// Kéo theo ~280 script nếu bê thật, mà Roy88 không có sản phẩm Idol Live.
//
// PHẢI là cc.Component thật (không được là object thường): ChatInGamePopup.js:238 dùng nó
// làm KIỂU của `@property` — `o([g(d.default)], e.prototype, "tabIdolLiveController")`.
// Truyền một thứ không phải CCClass vào `cc._decorator.property(Type)` là lỗi lúc nạp script.
// ============================================================================

Object.defineProperty(exports, '__esModule', { value: true });

var TabIdolLiveController = cc.Class({
    extends: cc.Component,

    properties: {
        // Giữ nguyên TÊN thuộc tính của bản gốc: prefab lưu @property theo tên, đổi là
        // dữ liệu prefab rơi mất im lặng.
        trackingGameID: '',
        lbDealerName: {
            default: null,
            type: cc.Label
        }
    },

    // Bản gốc `start()` làm 3 việc: ẩn node, lấy IdolLiveRequestHandler, mở WebSocket Go88.
    // Ta giữ đúng việc đầu tiên — ẩn tab. Bản gốc chỉ bật lại tab trong `checkActive()` khi
    // máy chủ Idol Live của Go88 trả về danh sách game đang phát; không có máy chủ đó thì
    // tab vĩnh viễn ẩn. Ẩn sẵn ⇒ trùng khớp hành vi, không phải "tự thiết kế lại".
    start: function () {
        this.node.active = false;
    },

    // Chỗ gọi thật: ChatInGamePopup.js:228 — this.tabIdolLiveController.setTrackingGameID(t)
    // (chỉ chạy khi thuộc tính khác null). Bản gốc chỉ lưu lại chuỗi, không gửi đi đâu.
    setTrackingGameID: function (gameID) {
        this.trackingGameID = gameID;
    }
});

exports.default = TabIdolLiveController;
