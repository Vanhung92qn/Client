/**
 * RutThemLaView.js — báo hoà ở đỉnh và trình lá rút thêm.
 *
 * Pha này KHÔNG chạy ở ván bình thường. Chỉ khi từ hai người trở lên cùng cao điểm
 * nhất thì mỗi người rút một lá để phân định — và có thể lặp nhiều vòng nếu lá rút
 * thêm lại hoà tiếp (server đếm vòng trong `d.round`).
 *
 * Lá rút thêm so theo thang RIÊNG: K = Q = J = 10 < A < 2 … < 9. Con số server gửi
 * trong `d.draws[].value` đã là điểm theo thang đó rồi — client chỉ việc vẽ, tuyệt đối
 * không tự tính lại. Hai nơi cùng tính một luật là hai nơi có thể lệch nhau.
 */

var BaCayCard = require('BaCayCard');

(function () {
    cc.RutThemLaView = cc.Class({
        'extends': cc.Component,

        properties: {
            /** Chữ "Hoà". */
            lbHoa: cc.Label,
            /** Hoạt hình "hoà, so bài tiếp". */
            spBaoHoa: sp.Skeleton,
            /** Prefab lá bài, dùng để dựng lá rút thêm. */
            prefabLaBai: cc.Prefab,
        },

        onLoad: function () {
            this.laDaDung = [];
            this.node.active = false;
        },

        /**
         * Trình một vòng rút thêm.
         *
         * @param {number} vong   vòng thứ mấy, đếm từ 1
         * @param {Array}  rut    [{ seat, card, value }]
         * @param {Function} mocCuaGhe  (seat) → node mốc để đặt lá, do controller cấp
         */
        hien: function (vong, rut, mocCuaGhe) {
            this.node.active = true;

            if (this.lbHoa) {
                // Vòng đầu chỉ cần "Hoà"; từ vòng hai trở đi phải nói rõ là vẫn còn hoà,
                // không thì người chơi tưởng màn hình treo.
                this.lbHoa.string = vong > 1 ? ('Hoà · vòng ' + vong) : 'Hoà';
            }
            if (this.spBaoHoa) {
                this.spBaoHoa.node.active = true;
                this.spBaoHoa.setAnimation(0, 'animation', false);
            }

            this.don();
            if (!this.prefabLaBai || !mocCuaGhe) return;

            for (var i = 0; i < rut.length; i++) {
                var r = rut[i];
                var moc = mocCuaGhe(r.seat);
                if (!moc) continue;

                var n = cc.instantiate(this.prefabLaBai);
                n.parent = moc;
                n.setPosition(0, 0);
                this.laDaDung.push(n);

                var view = n.getComponent(cc.LaBaiView);
                if (!view) continue;
                view.datUp();
                // Lệch nhịp một chút cho từng lá, để mắt theo kịp ai rút được gì.
                (function (v, card, tre) {
                    setTimeout(function () {
                        if (v.isValid) v.lat(card);
                    }, tre);
                })(view, r.card, 250 + i * 220);
            }
        },

        /** Dọn lá rút thêm của vòng trước. */
        don: function () {
            for (var i = 0; i < this.laDaDung.length; i++) {
                if (this.laDaDung[i] && this.laDaDung[i].isValid) this.laDaDung[i].destroy();
            }
            this.laDaDung.length = 0;
        },

        an: function () {
            this.don();
            if (this.spBaoHoa) this.spBaoHoa.node.active = false;
            this.node.active = false;
        },

        /** Tên đọc được của lá — chỉ dùng cho log. */
        tenLa: function (ordinal) {
            return BaCayCard.ten(ordinal);
        },
    });
}).call(this);
