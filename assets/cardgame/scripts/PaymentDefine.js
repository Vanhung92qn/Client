/**
 * PaymentDefine — LỚP GIẢ. Bản gốc (209 dòng) khai đủ các hằng của cụm nạp/rút: mã cổng, mã
 * lỗi, tên tab… Cả bộ đã bê chỉ đọc ĐÚNG MỘT hằng.
 *
 * `TAB_LAST_SELECTED_OR_DEFAULT = -1` (PaymentDefine.js:51 bản gốc) là tham số truyền cho
 * `CommonPrefabsManager.showPopupNap(tab)`: -1 nghĩa là "mở lại tab người chơi chọn lần trước,
 * không có thì lấy tab mặc định". Chỉ PopupUserTableInfo.onClickNap dùng.
 *
 * 🔴 Giữ nguyên giá trị -1. Bên Roy88 `showPopupNap` chuyển tiếp sang createShopView; đổi số
 * này là mở nhầm tab mà không có lỗi nào.
 */
var t = require,
    i = exports;
'use strict';
Object.defineProperty(i, '__esModule', { value: true });

i.TAB_LAST_SELECTED_OR_DEFAULT = -1;
