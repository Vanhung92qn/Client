/**
 * DownloadScene — LỚP GIẢ. Bản gốc là màn hình tải bản cài đặt của ứng dụng native, kéo theo
 * cả cụm Calculator / CalculatorLockManager / DownloadSceneImpl / ProfilerService (167 dòng và
 * 7 phụ thuộc nữa) — không liên quan gì tới game bài.
 *
 * Cả bộ đã bê chỉ đọc ĐÚNG MỘT thứ ở đây: hằng `KEY_ACTIVE_PASSCODE`, dùng làm khoá
 * localStorage để biết người chơi đã đặt mã khoá ứng dụng chưa (PopupSetting.js:275 và :439).
 * Nên thay vì bê 8 tệp, chỉ giữ lại đúng hằng đó.
 *
 * 🔴 Giá trị phải GIỮ NGUYÊN là "KEY_ACTIVE_CALCULATOR" (DownloadScene.js:60 bản gốc), KHÔNG
 * đổi cho "dễ hiểu": tên khoá này là thứ người chơi đã có sẵn trong localStorage của máy. Đổi
 * chuỗi thì bản cũ đọc ra rỗng ⇒ ô gạt "Mã khoá" tự tắt mà không báo gì.
 *
 * Trên bản web hai chỗ đọc nó đều nằm sau `if (cc.sys.isNative)` nên thực tế không chạy; giữ
 * đúng giá trị để bản native sau này cắm vào là chạy.
 */
var t = require,
    i = exports;
'use strict';
Object.defineProperty(i, '__esModule', { value: true });

i.KEY_ACTIVE_PASSCODE = 'KEY_ACTIVE_CALCULATOR';
