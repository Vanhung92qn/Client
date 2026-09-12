/**
 * ChipBayView.js — chip bay: từ ghế vào giữa bàn lúc thu tiền sàn, từ giữa bàn về ghế
 * thắng lúc chia tiền.
 *
 * ⚠ Đây thuần là HOẠT HÌNH. Số chip bay không phải là số tiền thật và không được dùng
 * để tính bất cứ thứ gì. Số dư đúng chỉ đến từ bản tin `soDu` của server. Vẽ 7 con chip
 * hay 3 con chip đều không đổi một đồng nào trong ví.
 *
 * Chip được tái dùng qua một bể chứa: một ván 9 người là 27 lượt bay, sinh/huỷ node
 * từng ấy lần mỗi ván thì máy yếu sẽ khựng đúng vào lúc đang chia tiền.
 */

(function () {
    /**
     * Mệnh giá của từng loại chip, từ nhỏ tới lớn. Thứ tự này phải khớp thứ tự mảng
     * `prefabChip` gắn trong prefab.
     *
     * 🔸 Đây là thang của CHÚNG TA, không phải rút từ Go88 — trong prefab của họ chỉ có
     * màu, không có mệnh giá. Đổi thang thì đổi ở đúng đây.
     */
    var MENH_GIA = [1e3, 5e3, 1e4, 5e4, 1e5, 5e5, 1e6, 5e6, 1e7];

    /** Tối đa chip cho một lượt bay. Nhiều hơn thì rối mắt mà chẳng rõ thêm gì. */
    var TOI_DA = 5;

    cc.ChipBayView = cc.Class({
        'extends': cc.Component,

        properties: {
            /** 9 prefab chip, xếp từ mệnh giá nhỏ tới lớn — khớp `MENH_GIA`. */
            prefabChip: { default: [], type: [cc.Prefab] },
            /** Đích ở giữa bàn. */
            mocGiuaBan: cc.Node,
            /** Node cha chứa chip đang bay. */
            khoChip: cc.Node,
        },

        onLoad: function () {
            this.be = [];   // bể chứa chip rảnh
        },

        /** Tách một số tiền thành danh sách chỉ số chip, lớn trước. */
        tachChip: function (tien) {
            var ra = [];
            var con = Math.max(0, Math.round(tien));
            for (var i = MENH_GIA.length - 1; i >= 0 && ra.length < TOI_DA; i--) {
                while (con >= MENH_GIA[i] && ra.length < TOI_DA) {
                    ra.push(i);
                    con -= MENH_GIA[i];
                }
            }
            // Tiền nhỏ hơn cả chip bé nhất vẫn phải thấy một con chip, không thì lượt
            // thu tiền trông như không xảy ra.
            if (!ra.length) ra.push(0);
            return ra;
        },

        muon: function (loai) {
            var n = this.be.pop();
            if (!n || !n.isValid) {
                var p = this.prefabChip[Math.min(loai, this.prefabChip.length - 1)];
                if (!p) return null;
                n = cc.instantiate(p);
            } else {
                // Chip trong bể có thể là loại khác — dựng lại cho đúng mệnh giá.
                var pf = this.prefabChip[Math.min(loai, this.prefabChip.length - 1)];
                if (n._loaiChip !== loai && pf) {
                    n.destroy();
                    n = cc.instantiate(pf);
                }
            }
            n._loaiChip = loai;
            n.parent = this.khoChip || this.node;
            n.opacity = 255;
            n.scale = 1;
            n.active = true;
            return n;
        },

        tra: function (n) {
            if (!n || !n.isValid) return;
            n.active = false;
            this.be.push(n);
        },

        /**
         * Bay một chồng chip từ `tu` tới `den` (đều là node lấy vị trí thế giới).
         * `xong` gọi một lần sau khi con chip CUỐI hạ cánh.
         */
        bay: function (tu, den, tien, xong) {
            if (!tu || !den) { if (xong) return xong(); return; }

            var cha = this.khoChip || this.node;
            var p0 = cha.convertToNodeSpaceAR(tu.convertToWorldSpaceAR(cc.v2(0, 0)));
            var p1 = cha.convertToNodeSpaceAR(den.convertToWorldSpaceAR(cc.v2(0, 0)));

            var loai = this.tachChip(tien);
            var conLai = loai.length;
            var self = this;

            for (var i = 0; i < loai.length; i++) {
                var n = this.muon(loai[i]);
                if (!n) { conLai--; continue; }

                n.setPosition(p0);
                // Toè nhẹ ở đích để chồng chip trông là chồng chip, không phải một con.
                var lech = cc.v2(p1.x + (i - loai.length / 2) * 8, p1.y + i * 3);

                (function (node) {
                    cc.tween(node)
                        .delay(i * 0.05)
                        .to(0.35, { position: cc.v3(lech.x, lech.y, 0) }, { easing: 'quadOut' })
                        .call(function () {
                            self.tra(node);
                            if (--conLai <= 0 && xong) xong();
                        })
                        .start();
                })(n);
            }

            if (conLai <= 0 && xong) xong();
        },

        /** Thu tiền sàn: mọi ghế trong ván bay vào giữa. */
        gopVaoGiua: function (mocGhe, tien, xong) {
            var con = mocGhe.length;
            if (!con) { if (xong) xong(); return; }
            var self = this;
            for (var i = 0; i < mocGhe.length; i++) {
                this.bay(mocGhe[i], this.mocGiuaBan, tien, function () {
                    if (--con <= 0 && xong) xong();
                });
            }
        },

        /** Chia tiền: cả đống ở giữa bay về ghế thắng. */
        traChoNguoiThang: function (mocGhe, tien, xong) {
            this.bay(this.mocGiuaBan, mocGhe, tien, xong);
        },

        /** Dọn sạch — gọi khi rời bàn, không để chip treo lại sang ván sau. */
        don: function () {
            var cha = this.khoChip || this.node;
            cha.children.slice().forEach(function (n) { n.destroy(); });
            this.be.length = 0;
        },
    });
}).call(this);
