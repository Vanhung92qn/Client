/**
 * BaCayNet.js — cửa duy nhất giữa game Cào Rùa và tầng vận chuyển.
 *
 * 🔴 QUY TẮC: KHÔNG view nào được cầm `Transport`, và không view nào được biết con số
 * `51106`. View đăng ký sự kiện đã đặt tên ở đây. Đổi giao thức thì sửa đúng tệp này.
 *
 * Vì sao đáng một tệp riêng: bản Ba Cây cũ rải lệnh mạng khắp hơn hai chục view, nên
 * mỗi lần đổi giao thức là một cuộc truy tìm. Ở đây tầng hiển thị hoàn toàn không biết
 * nó đang nói chuyện WebSocket — nhờ đó thay cả tầng mạng cũng không phải mở view ra.
 *
 * ── Lưu ý về tiền ──
 * Cào Rùa KHÔNG có lệnh nào của client chạm tiền: tiền sàn do server tự thu ở pha
 * `Confirm`. Nên ở đây không chỗ nào đặt cờ `tien: true`. Nếu sau này thêm một lệnh
 * đụng ví (mua chip, cược thêm) thì BẮT BUỘC đặt cờ đó, không thì server từ chối thẳng —
 * cố ý hỏng to lúc phát triển, còn hơn im lặng mở đường cho trừ tiền hai lần.
 */

var BaCayPha = require('BaCayPha');
var netConfig = require('NetConfig');

/** Nhập tầng vận chuyển viết bằng TypeScript. `export default` → `.default`. */
function napTransport() {
    var m = require('Transport');
    return m && m.default ? m.default : m;
}

/** Kiểu bản tin của khung — đối chiếu CardGame.Contracts/Protocol.cs `MsgType`. */
var MSG = {
    LOGIN: 1,
    LOGOUT: 2,
    JOIN_ROOM: 3,
    LEAVE_ROOM: 4,
    ROOM_CMD: 5,
    ZONE_CMD: 6,
    QUICK_JOIN: 8,
};

/** Lệnh khung dùng chung cho mọi game bài — dải 0..999, đối chiếu `Cmd`. */
var CHUNG = {
    CHAT: 4,
    EMOTE: 5,
    ROOM_LIST: 10,
    ROOM_SUB: 11,
    ROOM_UNSUB: 12,
    // server đẩy xuống
    NGUOI_VAO: 101,
    NGUOI_ROI: 102,
    TIN_CHAT: 103,
    TIN_EMOTE: 104,
    SO_DU: 105,
    BAN_CAP_NHAT: 111,
    BAN_DONG: 112,
};

/**
 * Địa chỉ máy chủ game bài.
 *
 * LUÔN trỏ ra endpoint công khai, kể cả khi xem thử trong Cocos Creator. Lý do rất đời
 * thường: máy chủ nằm trên VPS, còn Cocos thì mở ở máy cá nhân — mặc định `127.0.0.1`
 * nghe thì "an toàn" nhưng thực tế là trỏ vào một cái máy không có server nào, và lỗi
 * duy nhất thấy được là màn hình đứng im.
 *
 * Bám theo `NetConfig.HOST` để đổi tên miền một chỗ là xong, đúng cách CDN đang làm.
 *
 * Ai chạy server ngay trên máy mình thì ghi đè bằng tham số địa chỉ:
 *     ?cardws=ws://127.0.0.1:5310/ws
 */
function diaChiMayChu() {
    var mien = 'wss://card.' + (netConfig.HOST || 'bay789x.me') + '/ws';
    if (typeof window === 'undefined' || !window.location) return mien;

    var q = /[?&]cardws=([^&]+)/.exec(window.location.search || '');
    return q ? decodeURIComponent(q[1]) : mien;
}

/** Token đăng nhập — đúng token mà cả client đang dùng, không phát token riêng. */
function layToken() {
    try {
        return cc.ServerConnector.getInstance().getToken();
    } catch (e) {
        return '';
    }
}

(function () {
    var instance = null;

    cc.BaCayNet = cc.Class({
        ctor: function () {
            this.net = null;
            this.nghe = {};          // tên sự kiện → [hàm]
            this.goSuKien = null;    // huỷ đăng ký với transport
            this.goTrangThai = null;
            this.rid = -1;
            this.gheCuaToi = -1;
            this.daDangNhap = false;
        },

        statics: {
            getInstance: function () {
                if (!instance) instance = new cc.BaCayNet();
                return instance;
            },
        },

        // ── đăng ký sự kiện ────────────────────────────────────────

        /**
         * Nghe một sự kiện đã đặt tên. Trả về hàm huỷ đăng ký — view PHẢI gọi nó trong
         * `onDestroy`, không thì node đã chết vẫn còn nghe và chạm vào `this.node` rỗng.
         */
        on: function (ten, fn) {
            if (!this.nghe[ten]) this.nghe[ten] = [];
            this.nghe[ten].push(fn);
            var self = this;
            return function () {
                var a = self.nghe[ten];
                if (!a) return;
                var i = a.indexOf(fn);
                if (i >= 0) a.splice(i, 1);
            };
        },

        phat: function (ten, d) {
            var a = this.nghe[ten];
            if (!a || !a.length) return;
            // Chép mảng trước khi duyệt: hàm nghe có quyền tự huỷ đăng ký ngay trong nó.
            a = a.slice();
            for (var i = 0; i < a.length; i++) {
                try {
                    a[i](d);
                } catch (e) {
                    cc.error('[bacay] hàm nghe "' + ten + '" ném lỗi:', e);
                }
            }
        },

        // ── vòng đời kết nối ───────────────────────────────────────

        ketNoi: function () {
            if (this.net) return;

            var Transport = napTransport();
            this.net = new Transport({ url: diaChiMayChu(), token: layToken() });

            var self = this;
            this.goSuKien = this.net.onSuKien(function (env) { self.nhan(env); });
            this.goTrangThai = this.net.onTrangThai(function (t) { self.phat('trangThai', t); });
            this.net.noi();
        },

        ngat: function () {
            if (!this.net) return;
            if (this.goSuKien) this.goSuKien();
            if (this.goTrangThai) this.goTrangThai();
            this.net.dong();
            this.net = null;
            this.daDangNhap = false;
            this.rid = -1;
            this.gheCuaToi = -1;
        },

        /**
         * Dịch bản tin server tự đẩy thành sự kiện có tên.
         *
         * Ảnh chụp bàn đi CHUNG một đường với mọi thứ khác: server tự đẩy nó ngay sau
         * khi đăng nhập nếu người này đang dở một bàn. Nhờ vậy client không phải tự biết
         * mình có đang dở ván hay không — cứ nghe là ra.
         */
        nhan: function (env) {
            switch (env.c) {
                case BaCayPha.PHA:       this.phat('pha', env.d); break;
                case BaCayPha.CHIA_BAI:  this.phat('chiaBai', env.d); break;
                case BaCayPha.DA_LAT:    this.phat('daLat', env.d); break;
                case BaCayPha.NGUA_BAI:  this.phat('nguaBai', env.d); break;
                case BaCayPha.RUT_THEM:  this.phat('rutThem', env.d); break;
                case BaCayPha.CHIA_TIEN: this.phat('chiaTien', env.d); break;

                case CHUNG.SO_DU:        this.phat('soDu', env.d); break;
                case CHUNG.NGUOI_VAO:    this.phat('nguoiVao', env.d); break;
                case CHUNG.NGUOI_ROI:    this.phat('nguoiRoi', env.d); break;
                case CHUNG.TIN_CHAT:     this.phat('chat', env.d); break;
                case CHUNG.TIN_EMOTE:    this.phat('emote', env.d); break;

                case CHUNG.BAN_CAP_NHAT: this.phat('banCapNhat', env.d); break;
                case CHUNG.BAN_DONG:     this.phat('banDong', env.d); break;

                default:
                    // Ảnh chụp bàn không mang mã lệnh riêng khi server tự đẩy sau đăng
                    // nhập; nhận ra nó bằng hình dạng: có `rid` và có `seats`.
                    if (env.d && typeof env.d.rid === 'number' && env.d.seats) {
                        this.ghiNhoBan(env.d);
                        this.phat('anhChup', env.d);
                    }
                    break;
            }
        },

        ghiNhoBan: function (d) {
            this.rid = d.rid;
            this.gheCuaToi = typeof d.mySeat === 'number' ? d.mySeat : -1;
        },

        // ── lệnh ───────────────────────────────────────────────────

        dangNhap: function () {
            var self = this;
            return this.net.gui(MSG.LOGIN, {}).then(function (res) {
                self.daDangNhap = !res.e;
                return res;
            });
        },

        /** Danh sách bàn theo mức cược. `bet = 0` là lấy tất cả. */
        danhSachBan: function (bet) {
            return this.net.gui(MSG.ZONE_CMD, {
                g: BaCayPha.GAME_ID, c: CHUNG.ROOM_LIST, d: { bet: bet || 0 },
            });
        },

        /**
         * Theo dõi sảnh: server sẽ tự đẩy `banCapNhat` / `banDong` mỗi khi một bàn đổi.
         *
         * Dùng cái này thay vì hỏi lại danh sách mỗi vài giây. Sảnh có thể có hàng trăm
         * bàn; hỏi lại toàn bộ theo nhịp là tự tạo ra một cơn lụt đều đặn cho server,
         * mà vẫn hiện số người cũ trong khoảng giữa hai lần hỏi.
         */
        theoDoiSanh: function () {
            return this.net.gui(MSG.ZONE_CMD, { g: BaCayPha.GAME_ID, c: CHUNG.ROOM_SUB });
        },

        thoiTheoDoiSanh: function () {
            return this.net.gui(MSG.ZONE_CMD, { g: BaCayPha.GAME_ID, c: CHUNG.ROOM_UNSUB });
        },

        vaoNhanh: function (bet) {
            var self = this;
            return this.net.gui(MSG.QUICK_JOIN, { g: BaCayPha.GAME_ID, d: { bet: bet } })
                .then(function (res) {
                    if (!res.e && res.d) self.ghiNhoBan(res.d);
                    return res;
                });
        },

        vaoBan: function (rid, matKhau) {
            var self = this;
            var d = { rid: rid };
            if (matKhau) d.pwd = matKhau;
            return this.net.gui(MSG.JOIN_ROOM, { d: d }).then(function (res) {
                if (!res.e && res.d) self.ghiNhoBan(res.d);
                return res;
            });
        },

        roiBan: function () {
            var self = this;
            return this.net.gui(MSG.LEAVE_ROOM, {}).then(function (res) {
                self.rid = -1;
                self.gheCuaToi = -1;
                return res;
            });
        },

        /**
         * Lật bài. `tatCa = true` thì lật sạch một lần.
         *
         * Không đánh dấu `tien` vì lệnh này không chạm ví: lật hay không lật đều KHÔNG
         * đổi kết quả, tiền sàn đã thu từ pha `Confirm`. Nó thuần là phần nắn bài.
         */
        lat: function (tatCa) {
            return this.net.gui(MSG.ROOM_CMD, {
                g: BaCayPha.GAME_ID, c: BaCayPha.LAT, d: { all: !!tatCa },
            });
        },

        noiChuyen: function (chu) {
            return this.net.gui(MSG.ROOM_CMD, {
                g: BaCayPha.GAME_ID, c: CHUNG.CHAT, d: { text: chu, to: -1 },
            });
        },

        /** Xin lại ảnh chụp bàn. Dùng khi màn hình nghi mình đang lỡ nhịp. */
        dongBo: function () {
            var self = this;
            return this.net.resync(BaCayPha.GAME_ID).then(function (res) {
                if (!res.e && res.d) {
                    self.ghiNhoBan(res.d);
                    self.phat('anhChup', res.d);
                }
                return res;
            });
        },

        // ── đồng hồ ────────────────────────────────────────────────

        /**
         * Giờ server theo đồng hồ đã hiệu chỉnh.
         *
         * ⚠ CHỈ để vẽ thanh đếm ngược. Không bao giờ dùng để quyết định chuyện tiền —
         * việc đó là của server; client chỉ vẽ lại cái server đã quyết.
         */
        gioServer: function () {
            return this.net ? this.net.serverNow() : Date.now();
        },

        dongHoSanSang: function () {
            return !!this.net && this.net.dongHoSanSang();
        },
    });
}).call(this);
