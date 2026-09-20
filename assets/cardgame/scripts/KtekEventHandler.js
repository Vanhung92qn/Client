/**
 * KtekEventHandler — LỚP GIẢ. "ktek" là nhánh nhúng của bản gốc cho một đối tác khác; Roy88
 * không có nhánh đó (GamePlayManager.iskteckgame luôn false).
 *
 * Chỗ dùng duy nhất, PopupInveteJoinRoom.js:234, nằm trong `case GAME.XIDACH` — tức chỉ chạy
 * khi người chơi nhận lời mời vào bàn XÌ DÁCH. Cào Rùa không phải Xì Dách nên nhánh đó không
 * bao giờ tới.
 *
 * 🔴 `instance` trả về một đối tượng có hàm rỗng, KHÔNG trả null. Chỗ gọi viết thẳng
 * `p.default.instance.setJoinRoomData(...)` mà không kiểm null — trả null thì nếu sau này có
 * bê Xì Dách, nó sẽ ném TypeError ngay giữa lúc người chơi bấm "Đồng ý". Hàm rỗng kèm cảnh báo
 * nói rõ thiếu cái gì mà không làm gãy luồng.
 */
var t = require,
    i = exports;
'use strict';
Object.defineProperty(i, '__esModule', { value: true });

var _theHien = {
    setJoinRoomData: function (roomId, gameId, bet) {
        cc.warn('[KtekEventHandler] chưa bê — bỏ qua setJoinRoomData(' + roomId + ', ' + gameId + ', ' + bet + ')');
    },
};

var KtekEventHandler = (function () {
    function KtekEventHandler() {}
    return KtekEventHandler;
})();

Object.defineProperty(KtekEventHandler, 'instance', {
    get: function () {
        return _theHien;
    },
});

i.default = KtekEventHandler;
