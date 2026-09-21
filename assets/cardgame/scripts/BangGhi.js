var t = require,
  e = module,
  i = exports;
'use strict';
Object.defineProperty(i, '__esModule', { value: true });

// ─────────────────────────────────────────────────────────────────────────────
//  BangGhi — GHI và PHÁT LẠI một phiên chơi ở mức KHUNG TIN.
//
//  ── VÌ SAO CẦN ────────────────────────────────────────────────────────────
//  Cả bộ công cụ hiện có chỉ soát TĨNH (uuid, cid, đồ thị phụ thuộc). Không có cách nào trả lời
//  câu hỏi quan trọng nhất trước mỗi lần sửa client:
//
//        "Tôi vừa sửa xong — làm sao BIẾT mình không làm hỏng thứ gì?"
//
//  Không có câu trả lời thì mọi thay đổi đều là đánh bạc, và sai lệch chỉ lộ ra ở bàn có tiền
//  thật vài tuần sau. Đây chính là lý do đã chốt KHÔNG viết lại bộ script dịch ngược: không
//  phải vì mã khó đọc, mà vì không chứng minh được.
//
//  ── NGUYÊN LÝ ─────────────────────────────────────────────────────────────
//  Hành vi mà máy chủ (và tiền bạc) nhìn thấy của client chỉ gồm MỘT thứ: chuỗi khung tin nó
//  GỬI ĐI. Nên:
//     ghi     : lưu lại mọi khung VÀO và RA của một ván thật
//     phát lại: bơm đúng chuỗi khung VÀO đó cho client, thu lại chuỗi khung RA,
//               rồi SO với bản ghi gốc
//  Giống nhau ⇒ hành vi giao thức không đổi. Khác ⇒ chỉ đúng chỗ khác, kèm khung nào.
//
//  ── GIỚI HẠN, NÓI TRƯỚC ───────────────────────────────────────────────────
//  🔴 Cách này KHÔNG bắt được lỗi HÌNH ẢNH: popup lệch chỗ, ảnh sai, hiệu ứng mất. Nó chỉ
//  chứng minh phần GIAO THỨC không đổi. Nhưng đó đúng là phần chủ dự án KHÔNG thể tự soi bằng
//  mắt, còn phần hình ảnh thì nhìn phát thấy. Chia việc như vậy là đúng chỗ mạnh của mỗi bên.
//
//  ── DÙNG ──────────────────────────────────────────────────────────────────
//  Mở F12 rồi gõ:
//     ghiPhien()        bắt đầu ghi (chơi một ván bình thường)
//     taiBanGhi()       tải bản ghi về máy (.json)
//     phatLaiBanGhi()   chọn tệp .json rồi phát lại, tự in KHỚP / LỆCH
// ─────────────────────────────────────────────────────────────────────────────

/** Khung ping/pong đổi theo thời gian nên KHÔNG so — loại ra thay vì để nó báo lệch giả. */
function laNhipTim(khung) {
    try {
        var a = JSON.parse(khung);
        if (!Array.isArray(a)) return false;
        // ["7", zone, "1", n] lên · [6, 1, n] xuống
        return String(a[0]) === '7' || (a[0] === 6 && a.length === 3);
    } catch (loi) {
        return false;
    }
}

/**
 * Bỏ các ô đổi theo từng lần chạy để so cho công bằng.
 * Giữ nguyên MỌI thứ khác — thà báo lệch thừa còn hơn giấu mất một khác biệt thật.
 */
function chuanHoa(khung) {
    try {
        var a = JSON.parse(khung);
        // Khung đăng nhập mang accessToken đổi mỗi phiên; so phần còn lại.
        if (Array.isArray(a) && a[0] === 1 && a[a.length - 1] && a[a.length - 1].accessToken) {
            a[a.length - 1] = Object.assign({}, a[a.length - 1], { accessToken: '<token>' });
        }
        return JSON.stringify(a);
    } catch (loi) {
        return khung;
    }
}

/**
 * Khung RA do NGƯỜI BẤM NÚT sinh ra, không phải do client phản xạ với khung vào.
 * Phát lại chỉ bơm được khung VÀO nên KHÔNG thể tái tạo một cú bấm — để chúng trong phép so
 * là lần nào cũng báo thiếu, và một phép thử lúc nào cũng đỏ thì chẳng ai còn nhìn.
 *
 * Phân loại này lấy từ giao thức chứ không đoán:
 *   do người bấm : 3 vào bàn · 4 rời bàn · 8 vào theo id · 300 danh sách bàn · 303/304/305 mời
 *                  307 chơi nhanh · 308 tạo bàn · 310 làm mới tiền
 *   client tự trả: 1 đăng nhập (ngay khi socket mở) · 5 sẵn sàng (đáp 204) · 1504 xếp bài (đáp 1500)
 * Phần "client tự trả" mới là phần đáng gác: `1504` chính là thứ máy chủ dùng làm `DaLo` để
 * quyết bù thưởng bộ JQK (SimmsBaCayTable.cs:612-628). Sai thứ tự lá ở đây là sai TIỀN.
 */
var CMD_NGUOI_BAM = [300, 303, 304, 305, 307, 308, 310];
function laDoNguoiBam(khung) {
    try {
        var a = JSON.parse(khung);
        if (!Array.isArray(a)) return false;
        if (a[0] === 3 || a[0] === 4 || a[0] === 8) return true;   // vào/rời bàn
        var o = a[a.length - 1];
        return !!(o && typeof o === 'object' && CMD_NGUOI_BAM.indexOf(o.cmd) >= 0);
    } catch (loi) {
        return false;
    }
}

var CHE_DO_TAT = 0;
var CHE_DO_GHI = 1;
var CHE_DO_PHAT = 2;

var cheDo = CHE_DO_TAT;
var banGhi = [];        // [{ huong: 'vao'|'ra', khung, t }]
var raThuDuoc = [];     // khung RA thu được trong lúc phát lại
var socketGia = null;   // WebSocketConnecter đang bị thế chỗ

var BangGhi = {
    dangGhi: function () { return cheDo === CHE_DO_GHI; },
    dangPhatLai: function () { return cheDo === CHE_DO_PHAT; },

    /** Khung máy chủ gửi xuống. */
    ghiVao: function (khung) {
        if (cheDo === CHE_DO_GHI && !laNhipTim(khung)) {
            banGhi.push({ huong: 'vao', khung: String(khung), t: Date.now() });
        }
    },

    /**
     * Khung client gửi lên. Lúc PHÁT LẠI thì thu vào `raThuDuoc` thay vì gửi thật —
     * chỗ gọi phải kiểm `dangPhatLai()` để KHÔNG chạm socket.
     */
    ghiRa: function (khung) {
        if (laNhipTim(khung)) return;
        if (cheDo === CHE_DO_GHI) banGhi.push({ huong: 'ra', khung: String(khung), t: Date.now() });
        else if (cheDo === CHE_DO_PHAT) raThuDuoc.push(String(khung));
    },

    /** Lúc phát lại, giữ lại socket giả để bơm khung vào. */
    ganSocketGia: function (conn) { socketGia = conn; },

    batDauGhi: function () {
        cheDo = CHE_DO_GHI;
        banGhi = [];
        cc.log('%c[BangGhi] ĐANG GHI — chơi một ván rồi gõ taiBanGhi()', 'color:#c60;font-weight:bold');
    },

    dungGhi: function () {
        cheDo = CHE_DO_TAT;
        cc.log('[BangGhi] đã dừng · %d khung (%d vào, %d ra)',
            banGhi.length,
            banGhi.filter(function (x) { return x.huong === 'vao'; }).length,
            banGhi.filter(function (x) { return x.huong === 'ra'; }).length);
        return banGhi;
    },

    layBanGhi: function () { return banGhi; },

    /**
     * Phát lại: bơm từng khung VÀO theo đúng thứ tự, chờ client lắng xuống, thu khung RA,
     * rồi so với bản ghi gốc.
     *
     * 🔴 BƠM THEO ĐÚNG NHỊP ĐÃ GHI, không bơm dồn.
     * Bản đầu bơm cách nhau 60ms rồi so sau 600ms. Bản ghi mẫu đầu tiên của chủ dự án
     * (`docs/caorua-banghi-*.json`) lật tẩy ngay: client trả `cmd 1504` mãi 3,9–4,1 giây sau khi
     * nhận `1500`, vì nó còn chạy hoạt cảnh chia bài. Bơm 60ms thì cả 31 khung vào hết trong 1,9s
     * và phép so chốt sổ ở giây 2,5 — trước lúc client kịp trả lời. Kết quả: báo "LỆCH 2/8" mà
     * cả 2 đều là báo động giả.
     *
     * Nén thời gian lại cũng không cứu được: hoạt cảnh trong client dài CỐ ĐỊNH, không nén theo.
     * Nén 2× thì khung của ván sau sẽ tới trước khi client trả lời xong ván trước — lệch thứ tự,
     * lại báo giả. Nên ở đây giữ nguyên nhịp thật; phát lại bản ghi 69 giây thì tốn 69 giây.
     * Một phép thử chạy vài phút mà tin được vẫn hơn một phép thử chạy 3 giây mà phải đoán.
     */
    phatLai: function (banGhiGoc, khiXong, tuyChon) {
        if (!socketGia) {
            cc.error('[BangGhi] chưa vào game — mở game rồi hãy phát lại');
            return;
        }
        tuyChon = tuyChon || {};
        // Chờ lắng sau khung cuối phải dài hơn độ trễ chậm nhất của client (đo được ~4,1s).
        var choLang = tuyChon.choLang != null ? tuyChon.choLang : 6000;
        cheDo = CHE_DO_PHAT;
        raThuDuoc = [];

        var dsVao = banGhiGoc.filter(function (x) { return x.huong === 'vao'; });
        var i = 0;

        function buoc() {
            if (i >= dsVao.length) {
                setTimeout(function () { BangGhi._soSanh(banGhiGoc, khiXong); }, choLang);
                return;
            }
            var k = dsVao[i++];
            try {
                socketGia.onmessage({ data: k.khung });
            } catch (loi) {
                cc.error('[BangGhi] khung %d làm client ném lỗi: %s', i, loi && loi.message);
            }
            if (i % 10 === 0) cc.log('[BangGhi] … %d/%d khung vào', i, dsVao.length);
            // Khoảng cách THẬT giữa hai khung liên tiếp. Bản ghi cũ không có `t` thì lùi về 60ms.
            var truoc = dsVao[i - 1];
            var sau = dsVao[i];
            var cach = (sau && sau.t && truoc && truoc.t) ? (sau.t - truoc.t) : 60;
            if (!(cach >= 0)) cach = 60;
            setTimeout(buoc, cach);
        }

        var tong = dsVao.length && dsVao[dsVao.length - 1].t && dsVao[0].t
            ? Math.round((dsVao[dsVao.length - 1].t - dsVao[0].t) / 1000) : 0;
        cc.log('%c[BangGhi] PHÁT LẠI %d khung vào — theo nhịp thật, ~%d giây…',
            'color:#06c;font-weight:bold', dsVao.length, tong + Math.round(choLang / 1000));
        buoc();
    },

    _soSanh: function (banGhiGoc, khiXong) {
        cheDo = CHE_DO_TAT;

        var raGoc = banGhiGoc.filter(function (x) { return x.huong === 'ra'; });
        var boQua = raGoc.filter(function (x) { return laDoNguoiBam(x.khung); });

        var mongDoi = raGoc
            .filter(function (x) { return !laDoNguoiBam(x.khung); })
            .map(function (x) { return chuanHoa(x.khung); });
        var thucTe = raThuDuoc
            .filter(function (k) { return !laDoNguoiBam(k); })
            .map(chuanHoa);

        // Nói rõ đã bỏ gì — một bộ thử âm thầm cắt bớt phạm vi thì đọc như đã soát hết.
        if (boQua.length) {
            cc.log('[BangGhi] bỏ %d khung do NGƯỜI BẤM (phát lại không tái tạo được cú bấm): %s',
                boQua.length,
                boQua.map(function (x) { return x.khung.slice(0, 48); }).join(' · '));
        }

        var lech = [];
        var n = Math.max(mongDoi.length, thucTe.length);
        for (var j = 0; j < n; j++) {
            if (mongDoi[j] !== thucTe[j]) {
                lech.push({ viTri: j, mongDoi: mongDoi[j] || '(không có)', thucTe: thucTe[j] || '(không có)' });
            }
        }

        if (!lech.length) {
            cc.log('%c[BangGhi] ✔ KHỚP — %d khung ra giống hệt bản ghi gốc',
                'color:#0a0;font-weight:bold', mongDoi.length);
        } else {
            cc.error('[BangGhi] ✘ LỆCH %d/%d khung ra', lech.length, n);
            lech.slice(0, 10).forEach(function (x) {
                cc.error('  #%d\n    mong đợi: %s\n    thực tế : %s', x.viTri, x.mongDoi, x.thucTe);
            });
        }
        if (khiXong) khiXong(lech);
        return lech;
    },
};

// Ba hàm gắn vào window để mở F12 gõ được ngay, không phải tìm đường require.
if (typeof window !== 'undefined') {
    window.ghiPhien = function () { BangGhi.batDauGhi(); return 'đang ghi — chơi một ván rồi gõ taiBanGhi()'; };

    window.taiBanGhi = function () {
        var ds = BangGhi.dungGhi();
        try {
            var b = new Blob([JSON.stringify(ds, null, 1)], { type: 'application/json' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(b);
            a.download = 'caorua-banghi-' + Date.now() + '.json';
            a.click();
            return ds.length + ' khung đã tải về';
        } catch (loi) {
            cc.log(JSON.stringify(ds));
            return 'không tải được tệp — bản ghi đã in ra Console, tự chép';
        }
    };

    window.phatLaiBanGhi = function () {
        var o = document.createElement('input');
        o.type = 'file';
        o.accept = '.json';
        o.onchange = function () {
            var f = o.files[0];
            if (!f) return;
            var r = new FileReader();
            r.onload = function () {
                try { BangGhi.phatLai(JSON.parse(r.result)); } catch (loi) { cc.error('[BangGhi] tệp hỏng: ' + loi.message); }
            };
            r.readAsText(f);
        };
        o.click();
        return 'chọn tệp .json đã ghi';
    };
}

i.default = BangGhi;
