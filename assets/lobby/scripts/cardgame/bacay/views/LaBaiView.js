/**
 * LaBaiView.js — MỘT lá bài trên bàn.
 *
 * Chỉ biết hai việc: đang úp hay đang ngửa, và nếu ngửa thì là lá nào. Nó KHÔNG biết
 * luật, không biết ai thắng, không biết pha nào. Mọi quyết định đến từ controller.
 *
 * 🔒 Lá bài của người khác chỉ có mã lá ở pha `Showdown`. Trước đó controller chỉ gọi
 * `datUp()` — không có mã nào để lộ, vì server không gửi. Đây là tuyến phòng thủ thứ
 * hai: kể cả code hiển thị có sai thì cũng không có gì để hiện sai.
 */

var BaCayCard = require('BaCayCard');

(function () {
    cc.LaBaiView = cc.Class({
        'extends': cc.Component,

        properties: {
            /** Mặt bài — đổi frame theo mã lá. */
            spMat: cc.Sprite,
            /** Lưng bài — che mặt khi úp. */
            spLung: cc.Sprite,
            /** Hiệu ứng lấp lánh, bật khi lá thuộc bộ thắng. */
            fxSang: cc.Node,
            /** Atlas bài. Gắn trong prefab để Cocos nạp cùng lá bài, không tự đi tải. */
            atlas: cc.SpriteAtlas,
        },

        onLoad: function () {
            this.ordinal = -1;
            this.dangNgua = false;
            if (this.fxSang) this.fxSang.active = false;
        },

        /** Đặt frame cho mặt bài. Mã sai thì rơi về lưng bài chứ không ném lỗi. */
        datFrame: function (ordinal) {
            if (!this.atlas || !this.spMat) return;
            var f = this.atlas.getSpriteFrame(BaCayCard.frame(ordinal));
            if (f) this.spMat.spriteFrame = f;
        },

        /** Úp bài. Đây là trạng thái mặc định của mọi lá không phải của mình. */
        datUp: function () {
            this.ordinal = -1;
            this.dangNgua = false;
            this.node.active = true;
            this.node.scaleX = 1;
            if (this.spLung) this.spLung.node.active = true;
            if (this.fxSang) this.fxSang.active = false;
        },

        /** Ngửa ngay lập tức, không hoạt hình. Dùng khi dựng lại bàn sau khi nối lại. */
        datMat: function (ordinal) {
            this.ordinal = ordinal;
            this.dangNgua = true;
            this.node.active = true;
            this.node.scaleX = 1;
            this.datFrame(ordinal);
            if (this.spLung) this.spLung.node.active = false;
        },

        /** Ẩn hẳn — chỗ chưa có bài. */
        datTrong: function () {
            this.ordinal = -1;
            this.dangNgua = false;
            this.node.active = false;
        },

        /**
         * Lật có hoạt hình: co ngang về 0 (lúc này không ai thấy mặt nào), đổi frame,
         * rồi nở lại. Đổi frame ĐÚNG lúc bề ngang bằng 0 nên không bao giờ thấy mặt bài
         * nhấp nháy trước khi lật xong.
         */
        lat: function (ordinal, xong) {
            if (this.dangNgua && this.ordinal === ordinal) {
                if (xong) xong();
                return;
            }
            this.node.active = true;
            var self = this;
            cc.tween(this.node)
                .to(0.12, { scaleX: 0 })
                .call(function () {
                    self.ordinal = ordinal;
                    self.dangNgua = true;
                    self.datFrame(ordinal);
                    if (self.spLung) self.spLung.node.active = false;
                })
                .to(0.12, { scaleX: 1 })
                .call(function () { if (xong) xong(); })
                .start();
        },

        /** Bật/tắt lấp lánh cho bộ bài thắng. */
        sang: function (bat) {
            if (this.fxSang) this.fxSang.active = !!bat;
        },
    });
}).call(this);
