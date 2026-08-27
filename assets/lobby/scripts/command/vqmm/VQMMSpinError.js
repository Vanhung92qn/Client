/**
 * Created by Nofear on 6/8/2017.
 * 2026-08-28: cap nhat theo ma loi cua backend moi (LuckyWheel.Api).
 *   Bo ERROR_100 (captcha da go) va ERROR_201 (khong con cap FreeSpin cho slot).
 */

(function() {
    cc.VQMMSpinError = cc.Enum({
        ERROR_200: 'Bạn đã hết lượt quay hôm nay. Quay lại vào ngày mai nhé!',
        ERROR_202: 'Tài khoản không tồn tại',
        ERROR_203: 'Bạn cần xác thực số điện thoại để mở Vòng Quay May Mắn',
        ERROR_204: 'Vòng quay đang tạm khoá. Vui lòng quay lại sau',
        ERROR_205: 'Trả thưởng không thành công, lượt quay đã được hoàn lại',
        ERROR_1001: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại',
        ERROR_1003: 'Có lỗi xảy ra. Vui lòng thử lại'
    });

}).call(this);
