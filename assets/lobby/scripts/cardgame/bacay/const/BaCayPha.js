/**
 * BaCayPha.js — tên pha và số hiệu lệnh của Cào Rùa.
 *
 * 🔴 ĐÂY LÀ CHỖ DUY NHẤT trong client được phép viết ra một con số lệnh. Rải `51106`
 * vào giữa code hiển thị là cách chắc chắn nhất để sau này đổi giao thức thì sót một
 * chỗ — mà sót một chỗ ở đây thì không lỗi, chỉ là màn hình đứng im không rõ vì sao.
 *
 * Đối chiếu: CardGame.Contracts/Games/BaCayCmd.cs. Hai bên phải đổi cùng nhau.
 */

var G = 51;                 // GameId.BaCay
var B = G * 1000;           // 51000 — dải lệnh riêng của game này

var BaCayPha = {
    /** Mã game, dùng cho trường `g` của phong bì. */
    GAME_ID: G,

    // ── client → server ────────────────────────────────────────────
    /** Lật bài của chính mình. `d = { all }`. Hành động DUY NHẤT trong ván. */
    LAT: B + 1,

    // ── server → client ────────────────────────────────────────────
    PHA: B + 101,           // { phase, endsInMs }
    CHIA_BAI: B + 102,      // { myCards, othersCardCount, ante }
    DA_LAT: B + 103,        // { seat, count }
    NGUA_BAI: B + 104,      // { hands: [{ seat, cards, point, baTay, jqkCo }] }
    RUT_THEM: B + 105,      // { round, draws: [{ seat, card, value }] }
    CHIA_TIEN: B + 106,     // { pot, rake, winner, bonusJQK, results: [{ seat, delta }] }

    /**
     * Tên pha — server gửi đúng chuỗi này trong `d.phase`, không phải số.
     * Gửi tên chứ không gửi số là có chủ đích: đọc log thấy ngay đang ở đâu.
     */
    CHO: 'Waiting',
    CHOT: 'Confirm',
    DANG_CHIA: 'Dealing',
    NAN_BAI: 'Flipping',
    SO_BAI: 'Showdown',
    HOA: 'Extratime',
    CHIA_TIEN_PHA: 'Settling',
};

/** Thứ tự pha, dùng để biết một bản tin pha là tiến tới hay là bản tin muộn. */
BaCayPha.THU_TU = [
    BaCayPha.CHO, BaCayPha.CHOT, BaCayPha.DANG_CHIA, BaCayPha.NAN_BAI,
    BaCayPha.SO_BAI, BaCayPha.HOA, BaCayPha.CHIA_TIEN_PHA,
];

module.exports = BaCayPha;
