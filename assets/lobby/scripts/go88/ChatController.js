'use strict';
// ============================================================================
// LỚP GIẢ — CHO RỖNG (no-op)
//
// Vì sao rỗng: `ChatController` của Go88 là bộ chat SẢNH (danh sách phòng chat, lịch sử,
// chống spam, tặng quà…), bê thẳng kéo theo ~281 script và các kênh của hạ tầng Go88.
// Ba Cây KHÔNG dùng nó — và đây không phải suy đoán, đã kiểm bằng dữ liệu:
//
//   • Chỗ duy nhất chạm tới là CardGameTableController.js:356
//       this.chatController = t.getComponent(m.default);
//     với `t` = node vừa `cc.instantiate(this.chatInGamePopupPrefabs)` (dòng 351).
//   • Prefab đó là ChatInGamePopup_1cec6b2b.prefab. Bản đã bê GIỐNG HỆT TỪNG BYTE bản gốc
//     Go88 (md5 trùng), và trong đó KHÔNG có component nào mang uuid 43ee0cc3-…
//     (= ChatController). ⇒ Ngay trên Go88 thật, `getComponent` ở dòng 356 cũng trả null.
//   • Mọi chỗ dùng sau đó đều bọc `if (this.chatController)` (dòng 357, 363, 375, 380).
//
// ⇒ Cho rỗng KHÔNG làm mất tính năng nào so với Go88. Bong bóng chat trong bàn Ba Cây do
//    PlayerView + PopBubbleUtil vẽ, ô nhập chat + emoji do ChatInGamePopup lo — cả ba đều
//    đã được bê thật.
//
// PHẢI là cc.Component thật: `node.getComponent(Lớp)` đối chiếu bằng instanceof, truyền
// một object thường vào sẽ không tìm ra component và có thể cảnh báo lúc chạy.
// ============================================================================

Object.defineProperty(exports, '__esModule', { value: true });

var ChatController = cc.Class({
    extends: cc.Component,

    // ------------------------------------------------------------------
    // Các hàm dưới đây chỉ tồn tại để khớp API CardGameTableController gọi tới.
    // Nếu sau này gắn ChatController vào một prefab nào đó thì phải thay bằng bản thật.
    // ------------------------------------------------------------------

    // CardGameTableController.js:358 — trong bản gốc Go88 hàm này cũng rỗng sẵn
    // (…\L00\ChatController.js:440 `e.prototype.initCellChat = function() {};`)
    initCellChat: function () {},

    // CardGameTableController.js:364
    clearChatHistory: function () {},

    // CardGameTableController.js:365 — loadChatHistory(lịchSử, gameID)
    loadChatHistory: function (history, gameID) {},

    // CardGameTableController.js:376 — loadChat(t, e, i, n, o, a, s), 7 tham số đúng bản gốc
    // (…\L00\ChatController.js:210)
    loadChat: function (a, b, c, d, e, f, g) {},

    // CardGameTableController.js:381 — hideSpamChat(t)
    hideSpamChat: function (isHide) {}
});

exports.default = ChatController;
