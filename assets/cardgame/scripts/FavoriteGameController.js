/**
 * FavoriteGameController — LỚP GIẢ. Bản gốc (235 dòng) quản lý danh sách "game yêu thích" ở
 * sảnh của bản gốc, kèm gửi số liệu theo dõi. Roy88 có sảnh riêng nên ta không bê.
 *
 * Chỗ dùng duy nhất trong bộ đã bê, PopupInveteJoinRoom.js:195:
 *
 *     m.default.gI() && m.default.gI().DoSendTrackingGame(t)
 *
 * 🔴 `gI()` TRẢ null CÓ CHỦ Ý — và phải là `gI` chứ không phải `getInstance`: bản gốc viết tắt
 * như vậy, đổi tên là chỗ gọi nhận undefined rồi ném TypeError ngay khi người chơi bấm "Đồng ý"
 * một lời mời. Toán tử && ở chỗ gọi khiến null làm cả vế sau bị bỏ qua, tức không gửi số liệu
 * theo dõi nào — đúng điều ta muốn, vì đích của số liệu đó là hạ tầng bản gốc.
 */
var t = require,
    i = exports;
'use strict';
Object.defineProperty(i, '__esModule', { value: true });

var FavoriteGameController = (function () {
    function FavoriteGameController() {}

    /** Không bao giờ có thể hiện. Tên viết tắt là của bản gốc, đừng đổi. */
    FavoriteGameController.gI = function () {
        return null;
    };

    return FavoriteGameController;
})();

i.default = FavoriteGameController;
