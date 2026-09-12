/**
 * GheView.js — MỘT ghế trên bàn: ai đang ngồi, còn bao nhiêu tiền, đang làm gì.
 *
 * Bài KHÔNG nằm ở đây. Bài do controller đặt vào các mốc `ListPlayerPosition_9User`
 * trong `MocViTri`, đúng như Go88 dựng. Ghế chỉ lo phần "người".
 *
 * ── Vắng mặt là một trạng thái, không phải một sự im lặng ──
 * Server phân biệt rõ "đang nói" và "đang vắng" (Seat.DangVang). Ghế phải vẽ ra được
 * sự khác nhau đó, vì người chơi cần biết là mình đang chờ một người mất mạng — chứ
 * không phải chờ một người lười bấm.
 */

(function () {
    /** Trạng thái hiển thị của ghế. Không gửi lên server, chỉ để vẽ. */
    var TT = {
        TRONG: 'trong',
        NGOI: 'ngoi',
        TRONG_VAN: 'trongVan',
        VANG: 'vang',
    };

    cc.GheView = cc.Class({
        'extends': cc.Component,

        properties: {
            lbTen: cc.Label,
            lbTien: cc.Label,
            /** Ảnh đại diện. Go88 vẽ bằng script riêng của họ nên ta tự cắm Sprite. */
            spAvatar: cc.Sprite,
            /** Dấu "đã sẵn sàng". */
            ndSanSang: cc.Node,
            /** Vòng đếm giờ quanh avatar — chỉ sáng ở ghế đang được chờ. */
            thanhGio: cc.ProgressBar,
            /** Khung chữ trạng thái ("Vắng mặt", "Hết tiền"). */
            ndTrangThai: cc.Node,
            lbTrangThai: cc.Label,
            /** Bong bóng chat. */
            ndChat: cc.Node,
        },

        statics: { TT: TT },

        onLoad: function () {
            this.uid = 0;
            this.viTri = -1;
            this.trangThai = TT.TRONG;
            this.datTrong();
        },

        /** Ghế trống: ẩn sạch, không để lại tên người vừa rời. */
        datTrong: function () {
            this.uid = 0;
            this.trangThai = TT.TRONG;
            this.node.active = false;
            this.hienChat(null);
        },

        /**
         * Đặt người ngồi. `s` là một phần tử `seats` của ảnh chụp bàn:
         * `{ seat, uid, name, balance, inRound, cards }`.
         */
        datNguoi: function (s) {
            this.uid = s.uid;
            this.viTri = s.seat;
            this.trangThai = s.inRound ? TT.TRONG_VAN : TT.NGOI;

            this.node.active = true;
            if (this.lbTen) this.lbTen.string = s.name || ('#' + s.uid);
            this.datTien(s.balance);
            if (this.ndSanSang) this.ndSanSang.active = !!s.inRound;
            this.hienTrangThai(null);
            this.tatGio();
        },

        /**
         * Cập nhật số dư.
         *
         * 🔴 Server đẩy số dư theo SỐ GHẾ, và controller phải tra đúng ghế đó rồi mới
         * gọi vào đây. Không tự suy ra từ thứ tự trong mảng — ghế đổi chủ giữa chừng là
         * chuyện bình thường.
         */
        datTien: function (soDu) {
            if (this.lbTien) this.lbTien.string = dinhDang(soDu);
        },

        /** Đánh dấu vắng mặt (mất kết nối) — ghế vẫn giữ chỗ trong thời gian ân hạn. */
        datVang: function (vang) {
            this.trangThai = vang ? TT.VANG : TT.NGOI;
            this.node.opacity = vang ? 140 : 255;
            this.hienTrangThai(vang ? 'Mất kết nối' : null);
        },

        hienTrangThai: function (chu) {
            if (!this.ndTrangThai) return;
            this.ndTrangThai.active = !!chu;
            if (chu && this.lbTrangThai) this.lbTrangThai.string = chu;
        },

        hienChat: function (chu) {
            if (!this.ndChat) return;
            this.ndChat.active = !!chu;
        },

        // ── đồng hồ quanh avatar ───────────────────────────────────

        /**
         * Chạy vòng đếm ngược. `ketThucLuc` là MỐC GIỜ SERVER, không phải số giây còn
         * lại — nhờ vậy một bản tin đến muộn vẫn vẽ đúng phần còn lại, thay vì kéo dài
         * thêm đúng bằng độ trễ mạng.
         */
        chayGio: function (ketThucLuc, tongMs, gioServer) {
            if (!this.thanhGio) return;
            this.thanhGio.node.active = true;
            this.gioKetThuc = ketThucLuc;
            this.gioTong = Math.max(1, tongMs);
            this.layGio = gioServer;
        },

        tatGio: function () {
            this.gioKetThuc = 0;
            if (this.thanhGio) {
                this.thanhGio.progress = 0;
                this.thanhGio.node.active = false;
            }
        },

        update: function () {
            if (!this.gioKetThuc || !this.thanhGio) return;
            var conLai = this.gioKetThuc - (this.layGio ? this.layGio() : Date.now());
            if (conLai <= 0) {
                this.tatGio();
                return;
            }
            this.thanhGio.progress = Math.min(1, conLai / this.gioTong);
        },
    });

    /** 1234567 → "1.234.567". Dấu chấm là quy ước VN, khớp phần còn lại của client. */
    function dinhDang(n) {
        if (typeof n !== 'number' || !isFinite(n)) return '0';
        return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
}).call(this);
