/**
 * SanhChonBanView.js — sảnh Cào Rùa: danh sách bàn, chơi ngay, mở bàn.
 *
 * Đây là màn hình ĐẦU TIÊN của game, nên nó cũng là nơi dựng kết nối. Thứ tự bắt buộc:
 * nối → đăng nhập → theo dõi sảnh → xin danh sách. Đảo thứ tự thì server trả
 * `NotAuthenticated (-2)` và màn hình đứng trắng mà không nói vì sao.
 *
 * 🔴 Nếu người chơi đang DỞ MỘT VÁN ở bàn cũ, server tự đẩy ảnh chụp bàn ngay sau khi
 * đăng nhập — không cần hỏi. Gặp ảnh chụp thì sảnh nhường chỗ cho bàn luôn. Đây chính
 * là đường nối lại sau khi rớt mạng, và nó đi chung một lối với vào bàn bình thường
 * nên không có nhánh code riêng nào để mà hỏng riêng.
 */

var BaCayNet = null;

(function () {
    cc.SanhChonBanView = cc.Class({
        'extends': cc.Component,

        properties: {
            /** Nơi xếp các dòng bàn. */
            ndDanhSach: cc.Node,
            /** Prefab một dòng bàn. */
            prefabMucBan: cc.Prefab,

            btnChoiNhanh: cc.Node,
            btnTaoBan: cc.Node,
            btnHuongDan: cc.Node,

            lbTen: cc.Label,
            lbTien: cc.Label,

            /** Prefab bàn chơi — dựng khi vào bàn. */
            prefabBan: cc.Prefab,
        },

        onLoad: function () {
            BaCayNet = cc.BaCayNet.getInstance();

            this.ban = {};        // rid → dữ liệu bàn
            this.dong = {};       // rid → node dòng
            this.go = [];         // các hàm huỷ đăng ký
            this.mucCuocDangXem = 0;
            this.nodeBan = null;

            var self = this;
            this.go.push(BaCayNet.on('banCapNhat', function (d) { self.capNhatMotBan(d); }));
            this.go.push(BaCayNet.on('banDong', function (d) { self.boMotBan(d && d.rid); }));
            this.go.push(BaCayNet.on('anhChup', function (d) { self.moBan(d); }));
            this.go.push(BaCayNet.on('trangThai', function (t) { self.doiTrangThai(t); }));

            this.noNut();
            this.batDau();
        },

        onDestroy: function () {
            for (var i = 0; i < this.go.length; i++) this.go[i]();
            this.go.length = 0;
        },

        noNut: function () {
            var self = this;
            if (this.btnChoiNhanh) {
                this.btnChoiNhanh.on(cc.Node.EventType.TOUCH_END, function () {
                    self.choiNgay();
                });
            }
            if (this.btnTaoBan) {
                this.btnTaoBan.on(cc.Node.EventType.TOUCH_END, function () {
                    self.choiNgay();   // TODO: hộp thoại chọn mức cược + mật khẩu
                });
            }
        },

        // ── dựng kết nối ───────────────────────────────────────────

        batDau: function () {
            var self = this;
            BaCayNet.ketNoi();

            BaCayNet.dangNhap().then(function (res) {
                if (res.e) {
                    cc.error('[bacay] đăng nhập hỏng:', res.e);
                    return;
                }
                if (self.lbTen && res.d) self.lbTen.string = res.d.nick || '';
                return BaCayNet.theoDoiSanh();
            }).then(function () {
                return BaCayNet.danhSachBan(self.mucCuocDangXem);
            }).then(function (res) {
                if (res && !res.e && res.d) self.dungDanhSach(res.d.rooms || []);
            }).catch(function (e) {
                cc.error('[bacay] dựng sảnh hỏng:', e && e.message);
            });
        },

        doiTrangThai: function (t) {
            // Mất kết nối ở sảnh không nguy hiểm như mất giữa ván — chỉ cần xin lại
            // danh sách khi nối lại được, vì trong lúc đứt thì bản tin cập nhật đã trôi.
            if (t === 'da-noi' && BaCayNet.daDangNhap) {
                var self = this;
                BaCayNet.danhSachBan(this.mucCuocDangXem).then(function (res) {
                    if (res && !res.e && res.d) self.dungDanhSach(res.d.rooms || []);
                }).catch(function () { /* lần sau nối lại sẽ thử tiếp */ });
            }
        },

        // ── danh sách bàn ──────────────────────────────────────────

        dungDanhSach: function (rooms) {
            this.ban = {};
            this.dong = {};
            if (this.ndDanhSach) this.ndDanhSach.removeAllChildren();
            for (var i = 0; i < rooms.length; i++) this.capNhatMotBan(rooms[i]);
        },

        capNhatMotBan: function (r) {
            if (!r || typeof r.rid !== 'number' || !this.ndDanhSach || !this.prefabMucBan) return;

            this.ban[r.rid] = r;
            var n = this.dong[r.rid];
            if (!n || !n.isValid) {
                n = cc.instantiate(this.prefabMucBan);
                n.parent = this.ndDanhSach;
                this.dong[r.rid] = n;
            }

            var view = n.getComponent(cc.MucBanView);
            if (!view) return;
            var self = this;
            view.dat(r, function (rid, khoa) { self.vaoBan(rid, khoa); });
        },

        boMotBan: function (rid) {
            if (typeof rid !== 'number') return;
            var n = this.dong[rid];
            if (n && n.isValid) n.destroy();
            delete this.dong[rid];
            delete this.ban[rid];
        },

        // ── vào bàn ────────────────────────────────────────────────

        choiNgay: function () {
            // Chưa có hộp thoại chọn mức: lấy mức nhỏ nhất đang mở, không có thì mức mặc định.
            var muc = 0;
            for (var rid in this.ban) {
                var b = this.ban[rid];
                if (!muc || b.bet < muc) muc = b.bet;
            }
            if (!muc) muc = 1000;

            BaCayNet.vaoNhanh(muc).then(function (res) {
                if (res.e) cc.error('[bacay] chơi ngay hỏng:', res.e);
                // Thành công thì ảnh chụp bàn tới qua sự kiện `anhChup` → `moBan`.
            }).catch(function (e) {
                cc.error('[bacay] chơi ngay hỏng:', e && e.message);
            });
        },

        vaoBan: function (rid, khoa) {
            if (khoa) {
                // TODO: hỏi mật khẩu. Tạm thời không cho vào còn hơn gửi lên rồi bị từ chối.
                cc.warn('[bacay] bàn ' + rid + ' có mật khẩu, chưa làm hộp thoại');
                return;
            }
            BaCayNet.vaoBan(rid).then(function (res) {
                if (res.e) cc.error('[bacay] vào bàn ' + rid + ' hỏng:', res.e);
            }).catch(function (e) {
                cc.error('[bacay] vào bàn hỏng:', e && e.message);
            });
        },

        /**
         * Có ảnh chụp bàn → dựng bàn và ẩn sảnh.
         *
         * Cùng một lối cho ba trường hợp: bấm vào bàn, bấm chơi ngay, và nối lại sau khi
         * rớt mạng giữa ván. Ba lối riêng là ba chỗ có thể hỏng riêng.
         */
        moBan: function (d) {
            if (!d || typeof d.rid !== 'number' || d.mySeat < 0) return;
            if (this.nodeBan && this.nodeBan.isValid) {
                // Đã ở trong bàn rồi — ảnh chụp này là đồng bộ lại, để controller lo.
                return;
            }
            if (!this.prefabBan) {
                cc.error('[bacay] chưa gắn prefab bàn vào sảnh');
                return;
            }

            this.nodeBan = cc.instantiate(this.prefabBan);
            this.nodeBan.parent = this.node.parent || this.node;
            this.node.active = false;

            var dieuPhoi = this.nodeBan.getComponent(cc.BaCayController);
            if (dieuPhoi) dieuPhoi.vaoBan(d, this);
        },

        /** Controller gọi lại khi người chơi rời bàn. */
        veSanh: function () {
            if (this.nodeBan && this.nodeBan.isValid) this.nodeBan.destroy();
            this.nodeBan = null;
            this.node.active = true;

            var self = this;
            BaCayNet.danhSachBan(this.mucCuocDangXem).then(function (res) {
                if (res && !res.e && res.d) self.dungDanhSach(res.d.rooms || []);
            }).catch(function () { /* danh sách cũ vẫn hiện được */ });
        },

        /** Số dư ở góc sảnh. */
        datTien: function (soDu) {
            if (this.lbTien) {
                this.lbTien.string = Math.round(soDu).toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }
        },
    });
}).call(this);
