/**
 * GameLiveUtils — LỚP GIẢ. Bản gốc (222 dòng) là bộ tiện ích cho các game phát trực tiếp của
 * Go88 (Sicbo Live, Đá Gà Live, Baccarat Live…), kéo theo GameLiveUIDefine. Ta không bê game
 * Live nào.
 *
 * Bộ đã bê chỉ gọi ĐÚNG MỘT hàm: `changeToWorldPos(node)` — PopupSetting.js:312 dùng để đặt ô
 * sáng (nodeHighlight) trùng vị trí hàng vừa được chỉ tới trong bảng Cài đặt.
 *
 * Chép NGUYÊN VĂN thân hàm từ bản gốc (GameLiveUtils.js:33-39): lấy toạ độ thế giới của một
 * node bằng cách quy đổi `position` của nó QUA CHA.
 *
 * 🔴 Đừng "sửa cho gọn" thành `node.convertToWorldSpaceAR(cc.v2(0,0))`. Hai cách chỉ bằng nhau
 * khi node không xoay/không co giãn; bản gốc quy đổi qua cha nên phải giữ y hệt, lệch là ô
 * sáng nhảy sang chỗ khác mà không có lỗi nào.
 */
var t = require,
    i = exports;
'use strict';
Object.defineProperty(i, '__esModule', { value: true });

var GameLiveUtils = (function () {
    function GameLiveUtils() {}

    /** Toạ độ thế giới của `node`, quy đổi qua cha — y bản gốc. */
    GameLiveUtils.changeToWorldPos = function (node) {
        var cha = node;
        if (node.parent) {
            cha = node.parent;
        }
        return cha.convertToWorldSpaceAR(node.position);
    };

    return GameLiveUtils;
})();

i.default = GameLiveUtils;
