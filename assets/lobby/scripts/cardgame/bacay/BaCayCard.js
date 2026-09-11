/**
 * BaCayCard.js — anh xa MOT lá bài giữa server và atlas ảnh.
 *
 * 🔴 ĐÂY LÀ CHỖ DUY NHẤT trong client được phép biết cách một lá bài thành tên frame.
 * Mọi nơi khác gọi vào đây. Có hai bảng mã hoá lá bài trong nhà (bản Ba Cây cũ dùng
 * công thức khác, AT_RO = 27) nên chép tay bảng thứ hai là chuyện sớm muộn.
 *
 * ── Mã lá bài của server (CardGame.Server/Games/BaCay/Rules/Card.cs) ──
 *   ordinal = (rank - 1) * 4 + suit      rank 1..13 (A=1, J=11, Q=12, K=13)
 *   suit: 0 = Bích ♠, 1 = Tép ♣, 2 = Rô ♦, 3 = Cơ ♥
 *
 * ── Tên frame trong atlas của Go88 (GameCardSprite.decodeCard) ──
 *   S = mã % 4 + 1   →  1→"D" bích · 2→"C" chuồn · 3→"B" rô · 4→"A" cơ
 *   N = mã / 4 + 1   →  1..13
 *   frame = "icCard" + N + chữ
 *
 * Hai bảng TRÙNG KHÍT nhau — đã đối chiếu bằng ba mốc mà Go88 hardcode trong code
 * của họ: serverCode 43/47/51 = J/Q/K cơ. Thử lại: (11-1)*4+3 = 43 ✓, 47 ✓, 51 ✓.
 * Nhờ vậy không cần dịch số, chỉ cần đổi chất sang chữ cái.
 */

/** Chất → chữ cái trong tên frame. Thứ tự khớp enum Suit của server. */
var CHU_CHAT = ['D', 'C', 'B', 'A'];   // Bích, Tép, Rô, Cơ

/** Tên hiển thị, dùng cho log và trợ năng. */
var TEN_CHAT = ['bích', 'chuồn', 'rô', 'cơ'];
var TEN_SO = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

var BaCayCard = {
    /** Tên atlas trong bundle `bacay`. */
    ATLAS: 'card/cards',

    /** Frame lưng bài — dùng cho bài úp của người khác. */
    UP: 'icCardback',

    /** Frame ô trống — chỗ chưa có bài. */
    TRONG: 'icCardEmpty',

    /**
     * Mã lá (0..51) → tên frame trong atlas.
     * Trả `icCardback` cho mã không hợp lệ, vì hiện lưng bài bao giờ cũng an toàn
     * hơn là ném lỗi giữa lúc đang chia bài.
     */
    frame: function (ordinal) {
        if (!Number.isInteger(ordinal) || ordinal < 0 || ordinal > 51) return BaCayCard.UP;
        return 'icCard' + (Math.floor(ordinal / 4) + 1) + CHU_CHAT[ordinal % 4];
    },

    /** Số của lá: 1..13 (A=1, J=11, Q=12, K=13). */
    so: function (ordinal) {
        return Math.floor(ordinal / 4) + 1;
    },

    /** Chất: 0 = Bích, 1 = Tép, 2 = Rô, 3 = Cơ. */
    chat: function (ordinal) {
        return ordinal % 4;
    },

    /**
     * Điểm của lá theo luật Cào Rùa: 10, J, Q, K = 0; A = 1; còn lại theo mặt.
     *
     * Cũng CHÍNH LÀ độ lớn khi so lá rút thêm lúc hoà (`K=Q=J=10 < A < 2 < … < 9`).
     * Một hàm, không phải hai luật rời nhau.
     */
    diem: function (ordinal) {
        var s = BaCayCard.so(ordinal);
        return s >= 10 ? 0 : s;
    },

    /** Tên đọc được, ví dụ "J cơ". Chỉ dùng cho log — đừng hiển thị lên UI. */
    ten: function (ordinal) {
        if (!Number.isInteger(ordinal) || ordinal < 0 || ordinal > 51) return '??';
        return TEN_SO[BaCayCard.so(ordinal)] + ' ' + TEN_CHAT[BaCayCard.chat(ordinal)];
    },
};

module.exports = BaCayCard;
