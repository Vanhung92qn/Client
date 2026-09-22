/**
 * DongHo.js — bật đồng hồ đếm ngược hiện SỐ cho Cào Rùa.
 *
 * 🔴 ĐÂY LÀ CHỖ CỐ Ý LỆCH KHỎI GO88, do chủ dự án quyết (2026-09-20).
 *
 * Sự thật đã tra: Go88 **dựng sẵn** đồng hồ này rồi **bỏ không dùng**. Trong prefab
 * `BaCayController` có node `CountDown` (vòng tròn 124×124, góc dưới-trái) chứa `bar` +
 * `lbCountTime`, gắn component `ProcessCountdown`, và đã được bind vào thuộc tính
 * `processTimeCountdown` của controller. Nhưng node để `_active = false` và **không một dòng
 * mã nào gọi tới nó** — đúng như vậy ở cả bản Go88 2.4.10 lẫn bản gốc 2.1.3.
 * Trong 10 game bài Go88 chỉ Mậu Binh thật sự hiện số; Ba Cây, Liêng, Poker, Phỏm, TLMN,
 * TLĐL, Sâm Lốc, Cắt Tê, Xì Tố đều chỉ có thanh tiến trình.
 *
 * Vì sao vẫn bật: thanh tiến trình của bàn luôn được vẽ để cạn trong 7 giây, trong khi server
 * chia bài sau ~2,5 giây ở các ván nối tiếp — thanh chỉ tụt được khoảng một phần ba rồi biến
 * mất, người chơi không kịp nhận ra là có đếm giờ. Nặng hơn: **pha nặn bài 15 giây không có
 * dấu hiệu thời gian nào cả**, chỉ có nút rung một cái ở giây 13,5.
 *
 * Vì sao viết ở lớp giả chứ không sửa `BaCayController.js`: luật của dự án là giữ nguyên mã
 * Go88. Node này vốn không được mã Go88 đụng tới, nên điều khiển nó từ bên ngoài KHÔNG tranh
 * chấp với bất cứ thứ gì — và khi nào muốn quay lại đúng bản gốc thì chỉ việc bỏ một lời gọi.
 *
 * Dùng chính art và bố cục Go88 đã dựng: không vẽ thêm gì mới.
 */

'use strict';

/** Tìm lại mỗi lần vì view Ba Cây bị dựng/huỷ theo mỗi lần vào game. */
function layDongHo() {
    var scene = cc.director.getScene();
    if (!scene) return null;
    var ctl = scene.getComponentInChildren('BaCayController');
    if (!ctl) return null;
    var dh = ctl.processTimeCountdown;
    return dh && dh.node && dh.node.isValid ? dh : null;
}

/**
 * Hiện đồng hồ và đếm lùi `giay` giây.
 *
 * 🔴 Phải đặt lại `scale` và `active`: `ProcessCountdown.StopProcess()` kết thúc bằng
 * `scale = 0` rồi `active = false`. Không đặt lại thì lần đếm thứ hai chạy đúng nhưng
 * VÔ HÌNH — hỏng im lặng.
 */
function hien(giay) {
    if (!(giay > 0)) return;
    var dh = layDongHo();
    if (!dh) return;

    dh.node.stopAllActions();
    dh.node.active = true;
    dh.node.scale = 1;
    dh.setProgress(1);          // đầy, rồi cạn dần về 0
    dh.SetProgressTo(giay, 0);  // tự ghi số giây lên lbCountdown mỗi khung hình
}

/** Thu đồng hồ lại (có hoạt cảnh co nhỏ của Go88). */
function an() {
    var dh = layDongHo();
    if (dh && dh.node.active) dh.StopProcess();
}

/**
 * Đọc khung Simms vừa nhận và tự lái đồng hồ.
 *
 * Gọi từ móc nhận của `WSCardGameHandle`. Cố ý đọc khung THÔ thay vì chờ controller gọi:
 * như vậy không phải sửa một dòng nào của Go88.
 *
 *   1503 START_BETTING — đếm ngược trước khi chia bài (T mili-giây)
 *   1500 DEAL          — cửa sổ nặn bài (T mili-giây)
 *   1502 FINISH        — chốt ván, thu đồng hồ lại
 */
function theoKhung(raw) {
    var k;
    try { k = JSON.parse(raw); } catch (e) { return; }
    if (!(Array.isArray(k) && k.length === 2 && k[1] && typeof k[1] === 'object')) return;

    var g = k[1];
    // T của Go88 luôn là mili-giây — chính BaCayController cũng chia 1e3 trước khi dùng.
    if (g.cmd === 1503 || g.cmd === 1500) hien(g.T / 1000);
    else if (g.cmd === 1502) an();
}

module.exports = {
    hien: hien,
    an: an,
    theoKhung: theoKhung,
};
