/**
 * BanCaoRuaView.js — khung bàn: nền, mã bàn, mức cược, thanh đếm ngược, nút thoát/chat.
 *
 * Nó KHÔNG biết luật và không giữ trạng thái ván. Controller bảo gì thì vẽ nấy.
 *
 * ── Vì sao BtnStart và ReadyBtn bị ẩn ──
 * Hai nút đó thuộc khung bàn DÙNG CHUNG cho nhiều game bài của Go88, nhưng Cào Rùa
 * không có động tác "sẵn sàng": cứ ngồi vào ghế và còn đủ tiền là vào ván, bàn tự mở
 * ván theo đồng hồ. Server cũng không cài `Cmd.Ready` (mã có trong hợp đồng nhưng
 * không có bộ xử lý). Hiện một cái nút mà bấm vào không có gì xảy ra còn tệ hơn là
 * không có nút — nên ẩn, và ghi lại đây lý do để lần sau không ai tưởng là thiếu sót.
 */

(function () {
    cc.BanCaoRuaView = cc.Class({
        'extends': cc.Component,

        properties: {
            lbIdBan: cc.Label,
            lbMucCuoc: cc.Label,

            /** Thanh đếm ngược chung của bàn — chạy theo mốc kết thúc pha. */
            thanhDem: cc.ProgressBar,
            ndThanhDem: cc.Node,

            btnThoat: cc.Node,
            btnChat: cc.Node,

            /** Hai nút của khung dùng chung, Cào Rùa không dùng — xem đầu tệp. */
            btnBatDau: cc.Node,
            btnSanSang: cc.Node,

            /** Mốc giữa bàn — chip bay về đây. */
            mocGiuaBan: cc.Node,
        },

        onLoad: function () {
            this.ketThucLuc = 0;
            this.tongMs = 0;
            this.layGio = null;

            if (this.btnBatDau) this.btnBatDau.active = false;
            if (this.btnSanSang) this.btnSanSang.active = false;
            this.tatDem();
        },

        /** Gắn hai việc bấm ra ngoài, view không tự quyết chuyện rời bàn. */
        noNut: function (khiThoat, khiChat) {
            if (this.btnThoat && khiThoat) {
                this.btnThoat.on(cc.Node.EventType.TOUCH_END, khiThoat, this);
            }
            if (this.btnChat && khiChat) {
                this.btnChat.on(cc.Node.EventType.TOUCH_END, khiChat, this);
            }
        },

        datThongTinBan: function (rid, mucCuoc) {
            if (this.lbIdBan) this.lbIdBan.string = String(rid);
            if (this.lbMucCuoc) this.lbMucCuoc.string = dinhDang(mucCuoc);
        },

        /**
         * Chạy đếm ngược tới `ketThucLuc` — MỐC GIỜ SERVER, không phải số giây còn lại.
         *
         * Đây là lý do tầng vận chuyển phải hiệu chỉnh đồng hồ: nếu vẽ theo "còn 7 giây"
         * thì mỗi lần bản tin tới muộn 300ms là thanh lại giật về đầy, ván nào cũng thấy.
         * Vẽ theo mốc thì trễ mạng chỉ làm thanh bắt đầu ở chỗ thấp hơn — đúng thực tế.
         */
        chayDem: function (ketThucLuc, tongMs, layGio) {
            if (!this.thanhDem || !tongMs) return this.tatDem();
            this.ketThucLuc = ketThucLuc;
            this.tongMs = Math.max(1, tongMs);
            this.layGio = layGio;
            if (this.ndThanhDem) this.ndThanhDem.active = true;
        },

        tatDem: function () {
            this.ketThucLuc = 0;
            if (this.thanhDem) this.thanhDem.progress = 0;
            if (this.ndThanhDem) this.ndThanhDem.active = false;
        },

        update: function () {
            if (!this.ketThucLuc || !this.thanhDem) return;
            var con = this.ketThucLuc - (this.layGio ? this.layGio() : Date.now());
            if (con <= 0) return this.tatDem();
            this.thanhDem.progress = Math.min(1, con / this.tongMs);
        },
    });

    function dinhDang(n) {
        if (typeof n !== 'number' || !isFinite(n)) return '0';
        return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
}).call(this);
