/**
 * BangDiemView.js — nhãn điểm nổi lên cạnh bộ bài của một người lúc so bài.
 *
 * Ba cách hiện, đúng cách người chơi Cào Rùa gọi tên:
 *   • 0 điểm  → chữ "Bù". Không hiện số 0 — không ai nói "tôi không điểm".
 *   • 1..9    → con số.
 *   • Ba Tây  → chữ "Ba Cây" (ba lá hình), trên tất cả.
 *
 * Đúng thứ tự lớn nhỏ của luật: 0 là THẤP NHẤT, và Ba Tây đè mọi thứ. Hiển thị mà
 * ngược với luật là cách nhanh nhất làm người chơi mất lòng tin vào bàn.
 */

(function () {
    /**
     * Chạy hoạt cảnh của một spine, lấy tên NGAY TRONG PREFAB.
     *
     * 🔴 Đừng ghi cứng tên "animation". Sáu spine của Ba Cây thì bốn cái mang tên khác:
     * "3tay", "2 nha hoa diem", "sobaitiep", "DemNguoc10s". Gọi sai tên thì Cocos không
     * ném lỗi — nó chỉ đứng im, và ta ngồi tìm xem tại sao hiệu ứng không chạy.
     */
    function chay(sk, lap) {
        if (!sk) return;
        var ten = sk._animationName || sk.animation || 'animation';
        sk.node.active = true;
        sk.setAnimation(0, ten, lap === undefined ? !!sk.loop : lap);
    }

    cc.BangDiemView = cc.Class({
        'extends': cc.Component,

        properties: {
            /** Khung nền chứa ba nhãn. */
            ndKhung: cc.Node,
            /** Nhãn "Bù" — bật khi 0 điểm. */
            ndBu: cc.Node,
            /** Con số điểm 1..9. */
            lbDiem: cc.Label,
            /** Nhãn "Ba Cây" — bật khi ba lá hình. */
            ndBaCay: cc.Node,

            /** Hoạt hình lúc tính điểm. */
            spTinhDiem: sp.Skeleton,
            /** Hoạt hình thưởng J-Q-K cơ (ăn gấp ba). */
            spJQK: sp.Skeleton,
            /** Hoạt hình báo hoà điểm. */
            spHoaDiem: sp.Skeleton,
        },

        onLoad: function () {
            this.an();
        },

        an: function () {
            if (this.ndKhung) this.ndKhung.active = false;
            this.tatAnim();
        },

        tatAnim: function () {
            if (this.spTinhDiem) this.spTinhDiem.node.active = false;
            if (this.spJQK) this.spJQK.node.active = false;
            if (this.spHoaDiem) this.spHoaDiem.node.active = false;
        },

        /**
         * Hiện điểm của một người.
         * @param {number}  diem   0..9
         * @param {boolean} baTay  ba lá hình
         */
        hien: function (diem, baTay) {
            if (this.ndKhung) this.ndKhung.active = true;

            var laBu = !baTay && diem === 0;
            if (this.ndBu) this.ndBu.active = laBu;
            if (this.ndBaCay) this.ndBaCay.active = !!baTay;
            if (this.lbDiem) {
                this.lbDiem.node.active = !baTay && !laBu;
                if (!baTay && !laBu) this.lbDiem.string = String(diem);
            }

            chay(this.spTinhDiem, false);
        },

        /** Ăn gấp ba vì J-Q-K cùng cơ. */
        thuongJQK: function () {
            chay(this.spJQK, false);
        },

        /** Hoà ở đỉnh — sắp phải rút thêm lá. */
        baoHoa: function () {
            chay(this.spHoaDiem);
        },
    });
}).call(this);
