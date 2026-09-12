/**
 * MucBanView.js — MỘT dòng bàn trong sảnh.
 *
 * Dựng từ `IconBanCHoiXocdia` của Go88 — hàng bàn dùng chung cho các game bài của họ.
 * Ta giữ nguyên bố cục, chỉ thay phần chữ.
 *
 * Con số "số người" ở đây là thứ DUY NHẤT người chơi cảm nhận được là sảnh có đông hay
 * không. Nó đếm cả bot đang ngồi — có chủ đích, xem PROTOCOL.md §12.
 */

(function () {
    cc.MucBanView = cc.Class({
        'extends': cc.Component,

        properties: {
            lbMucCuoc: cc.Label,
            lbToiThieu: cc.Label,
            lbSoNguoi: cc.Label,
            /** Thanh lấp đầy — vẽ tỉ lệ ghế đã có người. */
            thanhDay: cc.ProgressBar,
            /** Ổ khoá, bật khi bàn có mật khẩu. */
            ndKhoa: cc.Node,
        },

        onLoad: function () {
            this.rid = 0;
            this.khoa = false;
            this.day = false;
            this.khiBam = null;

            /**
             * Đăng ký MỘT LẦN, giữ nguyên suốt đời node.
             *
             * 🔴 Bản trước tháo rồi lắp lại listener trong `dat()`. Hai chỗ hỏng:
             *
             *   1. `node.off(TOUCH_END)` KHÔNG kèm hàm sẽ xoá SẠCH mọi listener cùng loại
             *      trên node — kể cả listener mà `cc.Button` tự cài. Nút mất luôn hiệu
             *      ứng nhấn, mà chẳng có lỗi nào.
             *   2. Server đẩy cập nhật sảnh mỗi giây, tức `dat()` chạy mỗi giây. Cú chạm
             *      nào rơi đúng vào lúc tháo–lắp là mất trắng: người chơi bấm mà không
             *      có gì xảy ra, bấm lại thì lại được — kiểu hỏng khó chịu nhất vì nó
             *      không lặp lại đều.
             *
             * Giờ dữ liệu thay đổi nhưng listener đứng yên.
             */
            var self = this;
            this.node.on(cc.Node.EventType.TOUCH_END, function () {
                if (self.day || !self.khiBam) return;
                self.khiBam(self.rid, self.khoa);
            });
        },

        /** `r` là một phần tử `rooms`: `{ rid, bet, seats, maxSeat, minBuyIn, locked, state }`. */
        dat: function (r, khiBam) {
            this.rid = r.rid;
            this.khoa = !!r.locked;

            if (this.lbMucCuoc) this.lbMucCuoc.string = dinhDang(r.bet);
            if (this.lbToiThieu) this.lbToiThieu.string = 'Tối thiểu ' + dinhDang(r.minBuyIn);
            if (this.lbSoNguoi) this.lbSoNguoi.string = r.seats + '/' + r.maxSeat;
            if (this.thanhDay) {
                this.thanhDay.progress = r.maxSeat ? Math.min(1, r.seats / r.maxSeat) : 0;
            }
            if (this.ndKhoa) this.ndKhoa.active = !!r.locked;

            // Bàn đầy thì mờ đi và không bấm được — thà không cho bấm còn hơn cho bấm
            // rồi nhận về một lỗi. Chỉ đổi DỮ LIỆU, không đụng tới listener.
            this.day = r.seats >= r.maxSeat;
            this.khiBam = khiBam;
            this.node.opacity = this.day ? 140 : 255;
        },
    });

    function dinhDang(n) {
        if (typeof n !== 'number' || !isFinite(n)) return '0';
        if (n >= 1e9) return (n / 1e9).toFixed(n % 1e9 ? 1 : 0) + ' tỷ';
        if (n >= 1e6) return (n / 1e6).toFixed(n % 1e6 ? 1 : 0) + ' tr';
        if (n >= 1e3) return (n / 1e3).toFixed(n % 1e3 ? 1 : 0) + 'K';
        return String(Math.round(n));
    }
}).call(this);
