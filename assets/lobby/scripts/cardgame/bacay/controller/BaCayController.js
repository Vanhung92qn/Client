/**
 * BaCayController.js — bộ điều phối một bàn Cào Rùa.
 *
 * Nó là nơi DUY NHẤT giữ trạng thái ván. Các view không nhớ gì cả: bảo vẽ thì vẽ.
 * Nhờ vậy có đúng một chỗ để dựng lại toàn bộ màn hình từ ảnh chụp bàn — và đó cũng
 * chính là đường nối lại sau khi rớt mạng.
 *
 * ── Nguyên tắc xương sống ──
 * 1. Server là nguồn sự thật DUY NHẤT. Client không tự tính điểm, không tự đoán ai
 *    thắng, không tự trừ tiền. Kể cả khi biết thừa luật.
 * 2. Mọi thứ tra theo SỐ GHẾ, không theo thứ tự trong mảng. Ghế đổi chủ giữa chừng là
 *    chuyện thường, và bản tin số dư có thể tới sau khi ghế đã sang tay.
 * 3. Bản tin tới muộn hoặc tới hai lần phải vô hại. Đặt lại cùng một trạng thái là
 *    không-làm-gì, chứ không phải làm thêm một lần nữa.
 */

var BaCayPha = require('BaCayPha');

(function () {
    /** Bao nhiêu lá một người — Cào Rùa luôn là 3. */
    var SO_LA = 3;

    /** Khoảng cách giữa hai lá trên tay. */
    var GIAN_LA = 42;

    /** Khoá nhớ tuỳ chọn tự lật. */
    var KHOA_TU_LAT = 'bacay.tuLat';

    cc.BaCayController = cc.Class({
        'extends': cc.Component,

        properties: {
            /** Khung bàn (nền, HUD, đếm ngược). Dựng làm con đầu tiên, nằm dưới cùng. */
            prefabKhungBan: cc.Prefab,
            prefabGhe: cc.Prefab,
            prefabLaBai: cc.Prefab,
            prefabBangDiem: cc.Prefab,

            /** Mốc chỗ ngồi, mốc chip, mốc lá rút thêm. */
            mocGhe: cc.Node,
            mocChip: cc.Node,
            mocRutThem: cc.Node,

            /** Lớp nắn bài: nền tối + nút lật tất cả. */
            ndNanBai: cc.Node,
            btnLatTatCa: cc.Node,

            /** Đồng hồ tròn giữa bàn. */
            demTron: cc.ProgressBar,
            lbDemGiay: cc.Label,

            /** Tuỳ chọn tự lật hết bài. */
            ndTuLat: cc.Node,
            ndTuLatDau: cc.Node,

            chipBay: cc.ChipBayView,

            /**
             * Lớp rút thêm lá — dựng lúc chạy, không lồng sẵn vào prefab này.
             *
             * Prefab lồng trong prefab ở Cocos 2.4 phải nhúng cả cây node vào tệp cha;
             * dựng bằng code thì dễ sinh ra một node rỗng chỉ mang `PrefabInfo`, lúc
             * chạy không hiện gì mà cũng chẳng báo lỗi. Dựng lúc chạy thì chỉ có hai
             * khả năng: có hoặc không có — và cái "không có" thì thấy ngay.
             */
            prefabRutThem: cc.Prefab,
        },

        // ── vòng đời ───────────────────────────────────────────────

        onLoad: function () {
            this.net = cc.BaCayNet.getInstance();
            this.sanh = null;

            this.rid = -1;
            this.gheCuaToi = -1;
            this.soGheToiDa = 9;
            this.mucCuoc = 0;
            this.pha = BaCayPha.CHO;

            this.ghe = {};        // số ghế → { node, view }
            this.bai = {};        // số ghế → [node lá bài]
            this.diem = {};       // số ghế → node bảng điểm
            this.baiCuaToi = [];  // mã lá của chính mình

            this.ketThucPhaLuc = 0;
            this.tongPhaMs = 0;

            this.tuLat = cc.sys.localStorage.getItem(KHOA_TU_LAT) === '1';
            this.go = [];

            this.dungKhungBan();
            this.dungLopRutThem();
            this.noSuKien();
            this.noNut();
            this.anNanBai();
        },

        onDestroy: function () {
            for (var i = 0; i < this.go.length; i++) this.go[i]();
            this.go.length = 0;
        },

        dungKhungBan: function () {
            if (!this.prefabKhungBan) return;
            var n = cc.instantiate(this.prefabKhungBan);
            n.parent = this.node;
            n.setSiblingIndex(0);        // nền phải nằm dưới mọi mốc
            this.khungBan = n.getComponent(cc.BanCaoRuaView);

            var self = this;
            if (this.khungBan) {
                this.khungBan.noNut(
                    function () { self.roiBan(); },
                    function () { /* TODO: bảng chat */ }
                );
            }
        },

        dungLopRutThem: function () {
            this.rutThemLa = null;
            if (!this.prefabRutThem) return;
            var n = cc.instantiate(this.prefabRutThem);
            n.parent = this.node;
            n.setPosition(0, 0);
            this.rutThemLa = n.getComponent(cc.RutThemLaView);
            if (this.rutThemLa) this.rutThemLa.an();
        },

        noSuKien: function () {
            var self = this;
            var on = function (ten, fn) { self.go.push(self.net.on(ten, fn)); };

            on('anhChup', function (d) { self.apAnhChup(d); });
            on('pha', function (d) { self.doiPha(d); });
            on('chiaBai', function (d) { self.nhanBai(d); });
            on('daLat', function (d) { self.aiDoLat(d); });
            on('nguaBai', function (d) { self.soBai(d); });
            on('rutThem', function (d) { self.hoaRutThem(d); });
            on('chiaTien', function (d) { self.chiaTien(d); });
            on('soDu', function (d) { self.doiSoDu(d); });
            on('nguoiVao', function (d) { self.nguoiVao(d); });
            on('nguoiRoi', function (d) { self.nguoiRoi(d); });
        },

        noNut: function () {
            var self = this;
            if (this.btnLatTatCa) {
                this.btnLatTatCa.on(cc.Node.EventType.TOUCH_END, function () {
                    self.latTatCa();
                });
            }
            if (this.ndTuLat) {
                this.ndTuLat.on(cc.Node.EventType.TOUCH_END, function () {
                    self.tuLat = !self.tuLat;
                    cc.sys.localStorage.setItem(KHOA_TU_LAT, self.tuLat ? '1' : '0');
                    self.veTuLat();
                });
            }
            this.veTuLat();
        },

        veTuLat: function () {
            if (this.ndTuLatDau) this.ndTuLatDau.active = !!this.tuLat;
        },

        // ── dựng lại toàn bộ từ ảnh chụp ───────────────────────────

        /** Sảnh gọi vào đây ngay sau khi dựng bàn. */
        vaoBan: function (anhChup, sanh) {
            this.sanh = sanh;
            this.apAnhChup(anhChup);
        },

        /**
         * Ảnh chụp bàn → màn hình. Chạy được ở BẤT KỲ lúc nào, kể cả giữa ván.
         *
         * 🔴 Đây là hàm quan trọng nhất tệp này. Nó phải tự đủ: sau khi chạy xong, màn
         * hình phải đúng mà không cần biết trước đó đang hiện gì. Nếu nó phụ thuộc vào
         * trạng thái cũ thì nối lại giữa ván sẽ ra một màn hình nửa mới nửa cũ.
         */
        apAnhChup: function (d) {
            if (!d || typeof d.rid !== 'number') return;

            this.rid = d.rid;
            this.gheCuaToi = typeof d.mySeat === 'number' ? d.mySeat : -1;
            this.soGheToiDa = d.maxSeat || 9;
            this.mucCuoc = d.ante || d.bet || 0;
            this.baiCuaToi = d.myCards || [];

            if (this.khungBan) this.khungBan.datThongTinBan(this.rid, this.mucCuoc);

            this.donBai();
            this.donDiem();
            this.dungGhe(d.seats || []);

            // Bài của chính mình: ngửa ngay, không hoạt hình — đây là dựng lại, không
            // phải vừa được chia.
            if (this.baiCuaToi.length && this.gheCuaToi >= 0) {
                this.dungBai(this.gheCuaToi, this.baiCuaToi, true);
            }
            // Bài người khác: chỉ biết SỐ LÁ, úp hết.
            for (var i = 0; i < (d.seats || []).length; i++) {
                var s = d.seats[i];
                if (s.seat === this.gheCuaToi || !s.cards) continue;
                this.dungBai(s.seat, null, true);
            }

            this.datPha(d.phase, d.endsInMs);
        },

        dungGhe: function (seats) {
            // Ghế không còn trong ảnh chụp thì phải biến mất, không để lại người cũ.
            var con = {};
            for (var i = 0; i < seats.length; i++) con[seats[i].seat] = true;
            for (var k in this.ghe) {
                if (!con[k]) {
                    if (this.ghe[k].node.isValid) this.ghe[k].node.destroy();
                    delete this.ghe[k];
                }
            }

            for (var j = 0; j < seats.length; j++) this.datGhe(seats[j]);
        },

        datGhe: function (s) {
            var moc = this.mocCuaGhe(s.seat);
            if (!moc || !this.prefabGhe) return;

            var g = this.ghe[s.seat];
            if (!g || !g.node.isValid) {
                var n = cc.instantiate(this.prefabGhe);
                n.parent = moc;
                n.setPosition(0, 0);
                g = { node: n, view: n.getComponent(cc.GheView) };
                this.ghe[s.seat] = g;
            }
            if (g.view) g.view.datNguoi(s);
        },

        /**
         * Mốc chỗ ngồi cho một số ghế.
         *
         * Xoay bàn sao cho GHẾ CỦA MÌNH luôn ở mốc đầu tiên (dưới đáy màn hình). Người
         * chơi nào cũng thấy mình ngồi dưới cùng — quy ước của mọi game bài, và cũng là
         * cách duy nhất để một bàn 9 người vừa màn điện thoại mà vẫn dễ nhìn.
         */
        mocCuaGhe: function (seat) {
            if (!this.mocGhe) return null;
            var n = this.soGheToiDa || 9;
            var goc = this.gheCuaToi >= 0 ? this.gheCuaToi : 0;
            var idx = ((seat - goc) % n + n) % n;
            return this.mocGhe.children[idx] || null;
        },

        mocChipCuaGhe: function (seat) {
            if (!this.mocChip) return this.mocCuaGhe(seat);
            var n = this.soGheToiDa || 9;
            var goc = this.gheCuaToi >= 0 ? this.gheCuaToi : 0;
            var idx = ((seat - goc) % n + n) % n;
            return this.mocChip.children[idx] || this.mocCuaGhe(seat);
        },

        mocRutThemCuaGhe: function (seat) {
            if (!this.mocRutThem) return this.mocCuaGhe(seat);
            var n = this.soGheToiDa || 9;
            var goc = this.gheCuaToi >= 0 ? this.gheCuaToi : 0;
            var idx = ((seat - goc) % n + n) % n;
            return this.mocRutThem.children[idx] || this.mocCuaGhe(seat);
        },

        // ── bài ────────────────────────────────────────────────────

        /**
         * Dựng bộ bài cho một ghế.
         * @param {Array|null} cards  mã lá nếu được phép thấy, `null` thì úp hết
         * @param {boolean}    ngay   true = không hoạt hình
         */
        dungBai: function (seat, cards, ngay) {
            var moc = this.mocCuaGhe(seat);
            if (!moc || !this.prefabLaBai) return;

            this.boBai(seat);
            var ds = [];
            for (var i = 0; i < SO_LA; i++) {
                var n = cc.instantiate(this.prefabLaBai);
                n.parent = moc;
                n.setPosition((i - (SO_LA - 1) / 2) * GIAN_LA, 60);
                n.scale = seat === this.gheCuaToi ? 1 : 0.62;

                var v = n.getComponent(cc.LaBaiView);
                if (v) {
                    if (cards && cards.length > i) {
                        if (ngay) v.datMat(cards[i]); else v.datUp();
                    } else {
                        v.datUp();
                    }
                }
                ds.push(n);
            }
            this.bai[seat] = ds;
        },

        boBai: function (seat) {
            var ds = this.bai[seat];
            if (!ds) return;
            for (var i = 0; i < ds.length; i++) {
                if (ds[i] && ds[i].isValid) ds[i].destroy();
            }
            delete this.bai[seat];
        },

        donBai: function () {
            for (var k in this.bai) this.boBai(k);
            this.bai = {};
        },

        donDiem: function () {
            for (var k in this.diem) {
                if (this.diem[k] && this.diem[k].isValid) this.diem[k].destroy();
            }
            this.diem = {};
        },

        // ── bản tin trong ván ──────────────────────────────────────

        /** Server chuyển pha. Một bản tin duy nhất cho mọi chuyển pha. */
        doiPha: function (d) {
            if (!d) return;
            this.datPha(d.phase, d.endsInMs);
        },

        datPha: function (ten, conLaiMs) {
            this.pha = ten || BaCayPha.CHO;
            this.tongPhaMs = conLaiMs || 0;
            this.ketThucPhaLuc = conLaiMs ? this.net.gioServer() + conLaiMs : 0;

            var self = this;
            if (this.khungBan) {
                this.khungBan.chayDem(this.ketThucPhaLuc, this.tongPhaMs, function () {
                    return self.net.gioServer();
                });
            }

            // Lớp nắn bài chỉ mở đúng pha của nó, và chỉ cho người ĐANG TRONG VÁN.
            var duocNan = this.pha === BaCayPha.NAN_BAI
                && this.gheCuaToi >= 0 && this.baiCuaToi.length === SO_LA;
            if (duocNan) this.hienNanBai(); else this.anNanBai();

            if (this.pha === BaCayPha.NAN_BAI && this.tuLat) {
                // Người chơi đã chọn tự lật thì lật luôn, khỏi phải bấm mỗi ván.
                this.latTatCa();
            }
            if (this.pha === BaCayPha.CHOT) {
                this.donDiem();
                if (this.rutThemLa) this.rutThemLa.an();
            }
        },

        /** Nhận bài của chính mình. Bài người khác chỉ có SỐ LÁ. */
        nhanBai: function (d) {
            if (!d) return;
            this.baiCuaToi = d.myCards || [];
            this.mucCuoc = d.ante || this.mucCuoc;

            // Chip bay vào giữa: đây là lúc tiền sàn đã bị thu THẬT ở server.
            this.bayTienSan(d.othersCardCount);

            if (this.gheCuaToi >= 0) this.chiaBaiCoHinh(this.gheCuaToi, this.baiCuaToi);
            for (var seat in (d.othersCardCount || {})) {
                this.chiaBaiCoHinh(parseInt(seat, 10), null);
            }
        },

        bayTienSan: function (othersCardCount) {
            if (!this.chipBay) return;
            var moc = [];
            if (this.gheCuaToi >= 0) {
                var m = this.mocChipCuaGhe(this.gheCuaToi);
                if (m) moc.push(m);
            }
            for (var seat in (othersCardCount || {})) {
                var mm = this.mocChipCuaGhe(parseInt(seat, 10));
                if (mm) moc.push(mm);
            }
            this.chipBay.gopVaoGiua(moc, this.mucCuoc);
        },

        /** Chia bài có hoạt hình: lá bay ra từng cái một. */
        chiaBaiCoHinh: function (seat, cards) {
            this.dungBai(seat, cards, false);
            var ds = this.bai[seat];
            if (!ds) return;

            for (var i = 0; i < ds.length; i++) {
                var n = ds[i];
                var dich = n.position;
                n.setPosition(0, 0);
                n.opacity = 0;
                cc.tween(n)
                    .delay(i * 0.12)
                    .to(0.01, { opacity: 255 })
                    .to(0.22, { position: dich }, { easing: 'quadOut' })
                    .start();
            }
        },

        /**
         * Ai đó lật thêm bài. Chỉ có SỐ LÁ, không có mặt bài — nên với người khác ta chỉ
         * nhích lá cho thấy là họ đang nắn, chứ không lật ngửa.
         */
        aiDoLat: function (d) {
            if (!d || typeof d.seat !== 'number') return;
            if (d.seat === this.gheCuaToi) {
                this.latBaiCuaToi(d.count);
                return;
            }
            var ds = this.bai[d.seat];
            if (!ds) return;
            for (var i = 0; i < Math.min(d.count, ds.length); i++) {
                if (ds[i] && ds[i].isValid) ds[i].angle = -6 - i * 3;
            }
        },

        latBaiCuaToi: function (soLa) {
            var ds = this.bai[this.gheCuaToi];
            if (!ds) return;
            for (var i = 0; i < Math.min(soLa, ds.length, this.baiCuaToi.length); i++) {
                var v = ds[i].getComponent(cc.LaBaiView);
                if (v) v.lat(this.baiCuaToi[i]);
            }
            if (soLa >= SO_LA) this.anNanBai();
        },

        latTatCa: function () {
            var self = this;
            this.net.lat(true).then(function (res) {
                if (res.e) cc.warn('[bacay] lật hỏng:', res.e);
                // Không tự vẽ ở đây: đợi bản tin `daLat` của server. Vẽ trước rồi server
                // từ chối là màn hình nói dối.
            }).catch(function (e) {
                cc.warn('[bacay] lật hỏng:', e && e.message);
                self.anNanBai();
            });
        },

        hienNanBai: function () {
            if (this.ndNanBai) this.ndNanBai.active = true;
        },

        anNanBai: function () {
            if (this.ndNanBai) this.ndNanBai.active = false;
        },

        /** Lật ngửa toàn bàn. Đây là lần ĐẦU TIÊN client thấy bài người khác. */
        soBai: function (d) {
            if (!d || !d.hands) return;
            this.anNanBai();

            for (var i = 0; i < d.hands.length; i++) {
                var h = d.hands[i];
                this.nguaBaiCuaGhe(h);
                this.hienDiem(h);
            }
        },

        nguaBaiCuaGhe: function (h) {
            var ds = this.bai[h.seat];
            if (!ds) {
                this.dungBai(h.seat, h.cards, true);
                return;
            }
            for (var i = 0; i < Math.min(ds.length, (h.cards || []).length); i++) {
                if (!ds[i] || !ds[i].isValid) continue;
                ds[i].angle = 0;
                var v = ds[i].getComponent(cc.LaBaiView);
                if (v) v.lat(h.cards[i]);
            }
        },

        hienDiem: function (h) {
            var moc = this.mocCuaGhe(h.seat);
            if (!moc || !this.prefabBangDiem) return;

            var n = this.diem[h.seat];
            if (!n || !n.isValid) {
                n = cc.instantiate(this.prefabBangDiem);
                n.parent = moc;
                n.setPosition(0, 120);
                this.diem[h.seat] = n;
            }
            var v = n.getComponent(cc.BangDiemView);
            if (!v) return;
            v.hien(h.point, h.baTay);
            if (h.jqkCo) v.thuongJQK();
        },

        /** Hoà ở đỉnh — rút thêm lá phân định. Có thể lặp nhiều vòng. */
        hoaRutThem: function (d) {
            if (!d || !this.rutThemLa) return;
            var self = this;
            this.rutThemLa.hien(d.round || 1, d.draws || [], function (seat) {
                return self.mocRutThemCuaGhe(seat);
            });
        },

        /**
         * Chia tiền.
         *
         * ⚠ `results[].delta` chỉ để làm hoạt hình. Số dư ĐÚNG đến từ bản tin `soDu`
         * riêng, và đó mới là con số khớp với ví. Cộng tay delta vào số dư đang hiện là
         * cách chắc chắn để lệch dần sau vài ván.
         */
        chiaTien: function (d) {
            if (!d) return;

            if (typeof d.winner === 'number' && this.chipBay) {
                var moc = this.mocChipCuaGhe(d.winner);
                if (moc) this.chipBay.traChoNguoiThang(moc, d.pot || 0);

                // Bộ bài thắng sáng lên.
                var ds = this.bai[d.winner];
                if (ds) {
                    for (var i = 0; i < ds.length; i++) {
                        var v = ds[i] && ds[i].isValid ? ds[i].getComponent(cc.LaBaiView) : null;
                        if (v) v.sang(true);
                    }
                }
            }

            if (this.rutThemLa) this.rutThemLa.an();
        },

        // ── bản tin khung ──────────────────────────────────────────

        /** Số dư đổi. Tra theo SỐ GHẾ, không theo thứ tự nào khác. */
        doiSoDu: function (d) {
            if (!d || typeof d.seat !== 'number') return;
            var g = this.ghe[d.seat];
            if (g && g.view) g.view.datTien(d.balance);
            if (d.seat === this.gheCuaToi && this.sanh) this.sanh.datTien(d.balance);
        },

        nguoiVao: function (d) {
            if (!d || typeof d.seat !== 'number') return;
            this.datGhe(d);
        },

        nguoiRoi: function (d) {
            if (!d || typeof d.seat !== 'number') return;
            var g = this.ghe[d.seat];
            if (g && g.node.isValid) g.node.destroy();
            delete this.ghe[d.seat];
            this.boBai(d.seat);
        },

        // ── rời bàn ────────────────────────────────────────────────

        roiBan: function () {
            var self = this;
            this.net.roiBan().then(function () {
                if (self.chipBay) self.chipBay.don();
                if (self.sanh) self.sanh.veSanh();
            }).catch(function (e) {
                cc.error('[bacay] rời bàn hỏng:', e && e.message);
                // Rời bàn hỏng thì vẫn phải về sảnh — kẹt lại ở bàn đã mất kết nối là
                // trạng thái tệ nhất cho người chơi.
                if (self.sanh) self.sanh.veSanh();
            });
        },

        // ── đồng hồ tròn giữa bàn ──────────────────────────────────

        update: function () {
            if (!this.ketThucPhaLuc) {
                if (this.demTron) this.demTron.node.active = false;
                return;
            }
            var con = this.ketThucPhaLuc - this.net.gioServer();
            if (con <= 0) {
                this.ketThucPhaLuc = 0;
                if (this.demTron) this.demTron.node.active = false;
                if (this.lbDemGiay) this.lbDemGiay.string = '';
                return;
            }
            if (this.demTron) {
                this.demTron.node.active = true;
                this.demTron.progress = Math.min(1, con / Math.max(1, this.tongPhaMs));
            }
            if (this.lbDemGiay) this.lbDemGiay.string = String(Math.ceil(con / 1000));
        },
    });
}).call(this);
