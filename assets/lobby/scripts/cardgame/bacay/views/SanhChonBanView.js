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

/** Chiều cao một dòng bàn (đúng ảnh `roomThuongXD` của Go88) và khoảng cách giữa hai dòng. */
var CAO_DONG = 75;
var CACH_DONG = 12;

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
            this.tuKiem();
            this.batDau();
        },

        /**
         * TỰ KIỂM lúc dựng — nói thẳng ra màn hình console cái gì đang sai.
         *
         * Vì sao cần: "bấm không ăn" có ít nhất ba nguyên nhân hoàn toàn khác nhau —
         * node chưa nối, node bị ẩn/kích thước 0, hoặc có lớp khác nuốt cú chạm. Nhìn
         * ảnh chụp màn hình thì cả ba giống hệt nhau. Ba dòng log này tách chúng ra.
         *
         * Đầu dò chạm bắt ở pha BẮT (capture) trên node gốc: nếu cú chạm không tới được
         * đây thì chắc chắn có thứ khác nằm trên nuốt mất — không phải lỗi của nút.
         */
        tuKiem: function () {
            var self = this;
            var kiem = [
                ['ndDanhSach', this.ndDanhSach],
                ['btnChoiNhanh', this.btnChoiNhanh],
                ['btnTaoBan', this.btnTaoBan],
                ['lbTen', this.lbTen && this.lbTen.node],
                ['lbTien', this.lbTien && this.lbTien.node],
            ];
            for (var i = 0; i < kiem.length; i++) {
                var ten = kiem[i][0], nd = kiem[i][1];
                if (!nd) { cc.error('[bacay] CHƯA NỐI: ' + ten); continue; }
                var hop = nd.getBoundingBoxToWorld();
                cc.log('[bacay] ' + ten + ': "' + nd.name + '" hiện=' + nd.activeInHierarchy
                    + ' hộp=' + Math.round(hop.x) + ',' + Math.round(hop.y)
                    + ' ' + Math.round(hop.width) + 'x' + Math.round(hop.height));
                if (!nd.activeInHierarchy) cc.error('[bacay] ' + ten + ' ĐANG BỊ ẨN');
                if (hop.width < 1 || hop.height < 1) cc.error('[bacay] ' + ten + ' KÍCH THƯỚC 0 — không bấm trúng được');
            }

            this.node.on(cc.Node.EventType.TOUCH_START, function (e) {
                var p = e.getLocation();
                var trung = [];
                for (var k = 0; k < kiem.length; k++) {
                    var nd2 = kiem[k][1];
                    if (nd2 && nd2.activeInHierarchy && nd2.getBoundingBoxToWorld().contains(p)) {
                        trung.push(kiem[k][0]);
                    }
                }
                cc.log('[bacay] chạm tại ' + Math.round(p.x) + ',' + Math.round(p.y)
                    + ' — trúng: ' + (trung.join(', ') || '(không nút nào)'));
            }, this);
            // Nghe ở pha THƯỜNG trên node gốc, không phải pha bắt: node gốc phủ kín màn
            // hình nên nó thấy MỌI cú chạm, kể cả cú rơi vào chỗ trống. Đó chính là chỗ
            // cần phân biệt:
            //   • có dòng "chạm tại …"  → cú chạm TỚI ĐƯỢC sảnh, lỗi nằm ở nút
            //   • không có dòng nào     → có lớp khác nằm trên nuốt sạch, nút vô can
            // Con luôn được xét trước cha nên việc này không cướp chạm của nút nào.
        },

        onDestroy: function () {
            for (var i = 0; i < this.go.length; i++) this.go[i]();
            this.go.length = 0;
        },

        noNut: function () {
            var self = this;
            if (this.btnChoiNhanh) {
                this.btnChoiNhanh.on(cc.Node.EventType.TOUCH_END, function () {
                    cc.log('[bacay] bấm CHƠI NHANH');
                    self.choiNgay();
                });
            }
            if (this.btnTaoBan) {
                this.btnTaoBan.on(cc.Node.EventType.TOUCH_END, function () {
                    cc.log('[bacay] bấm TẠO BÀN');
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
                if (res.d) {
                    if (self.lbTen) self.lbTen.string = res.d.nick || '';
                    // Chữ mẫu trong prefab Go88 là "$ 9.999.000.000" — trông rất hợp lý
                    // nên không ai nghi ngờ. Phải ghi đè bằng số thật ngay.
                    self.datTien(res.d.balance || 0);
                }
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
            this.thuTu = [];
            if (this.ndDanhSach) this.ndDanhSach.removeAllChildren();
            for (var i = 0; i < rooms.length; i++) this.capNhatMotBan(rooms[i]);
            this.xepDanhSach();
        },

        /**
         * Xếp các dòng bàn thành cột dọc.
         *
         * `tableParent` của Go88 KHÔNG có Layout — họ tự đặt chỗ bằng script. Không xếp
         * thì cả sáu dòng nằm chồng khít lên nhau ở giữa màn hình, và người chơi thấy
         * đúng một dòng: sảnh trông như chỉ có một bàn.
         */
        xepDanhSach: function () {
            if (!this.ndDanhSach) return;
            var con = this.ndDanhSach.children;
            var buoc = CAO_DONG + CACH_DONG;
            var dau = (con.length - 1) * buoc / 2;
            for (var i = 0; i < con.length; i++) {
                con[i].setPosition(0, dau - i * buoc);
            }
        },

        capNhatMotBan: function (r) {
            if (!r || typeof r.rid !== 'number' || !this.ndDanhSach || !this.prefabMucBan) return;

            this.ban[r.rid] = r;
            var n = this.dong[r.rid];
            var moiDung = false;
            if (!n || !n.isValid) {
                n = cc.instantiate(this.prefabMucBan);
                n.parent = this.ndDanhSach;
                this.dong[r.rid] = n;
                moiDung = true;
            }

            var view = n.getComponent(cc.MucBanView);
            if (!view) {
                cc.error('[bacay] dòng bàn thiếu component MucBanView — prefab chưa gắn script?');
                return;
            }
            var self = this;
            view.dat(r, function (rid, khoa) {
                cc.log('[bacay] bấm vào bàn', rid, 'khoá=' + khoa);
                self.vaoBan(rid, khoa);
            });
            if (moiDung) this.xepDanhSach();
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

        /** Số dư ở góc sảnh. Giữ tiền tố "$" như thiết kế gốc. */
        datTien: function (soDu) {
            if (!this.lbTien) return;
            var n = (typeof soDu === 'number' && isFinite(soDu)) ? Math.round(soDu) : 0;
            this.lbTien.string = '$ ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        },
    });
}).call(this);
