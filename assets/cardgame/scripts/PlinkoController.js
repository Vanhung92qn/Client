/**
 * PlinkoController — LỚP GIẢ. Bản gốc là bộ điều khiển game Plinko (1037 dòng). Ta không bê
 * Plinko, nhưng PopupUserTableInfo `require` nó nên thiếu tệp là popup chết ngay lúc nạp.
 *
 * Chỗ dùng duy nhất, PopupUserTableInfo.js:98:
 *
 *     if (p.default.getInstance() && p.default.getInstance().isInGamePlinko
 *         && (o -= p.default.getInstance().TotalMoneyWin) < 0) { o = 0; }
 *
 * Nghĩa là: khi đang ở trong ván Plinko thì số dư hiển thị phải TRỪ đi phần tiền thắng chưa
 * chốt, tránh khoe số dư ảo. Ngoài Plinko thì không đụng tới số dư.
 *
 * 🔴 getInstance() TRẢ null CÓ CHỦ Ý — đừng "sửa cho đẹp" thành trả một đối tượng rỗng. Toán
 * tử && ở đầu điều kiện khiến null làm cả nhánh bị bỏ qua, tức số dư giữ nguyên: đúng hành vi
 * của người chơi không ở trong Plinko. Trả đối tượng rỗng thì `isInGamePlinko` là undefined
 * nên KẾT QUẢ vẫn đúng, nhưng lại che mất việc lớp này chưa có thật — null nói thẳng điều đó.
 */
var t = require,
    i = exports;
'use strict';
Object.defineProperty(i, '__esModule', { value: true });

var PlinkoController = (function () {
    function PlinkoController() {}

    /** Không bao giờ có thể hiện: Plinko không được bê sang Roy88. */
    PlinkoController.getInstance = function () {
        return null;
    };

    return PlinkoController;
})();

i.default = PlinkoController;
