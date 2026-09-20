'use strict';
// ============================================================================
// LỚP GIẢ — CHO RỖNG (no-op)
//
// Vì sao rỗng: bản gốc Go88 (…\L00\AnalyticService.js) gom sự kiện rồi bắn HTTP về
// endpoint "ops" của Go88 (OPSEndpoint + AnalyticLogger), kèm header ghép từ
// fingerprint máy, userID, session_id và 🔴 CẢ TOKEN người chơi
// (`_updateOPSHeader`: ... + (e.session_id || "") + "|" + (e.token || "") + ...).
// Đây đúng là đường rò token sang máy chủ Go88 mà CLAUDE.md cấm tuyệt đối → cắt hẳn.
//
// Hành vi ở đây trùng với bản gốc khi chưa cấu hình: bản gốc `trackCustomQ` chỉ gửi khi
// `this._isInit === true`, mà `_isInit` chỉ bật trong `initializeWithConfig(...)` với
// danh sách endpoint của Go88. Trong lát cắt Ba Cây không ai gọi hàm đó → bản gốc cũng
// im lặng. Nên cho rỗng KHÔNG làm lệch luồng.
// ============================================================================

Object.defineProperty(exports, '__esModule', { value: true });

var AnalyticService = (function () {
    function AnalyticService() {}

    // Code đã bê gọi bằng `.default.instance` (thuộc tính tĩnh), KHÔNG phải getInstance().
    // Bản gốc tạo node bền `cc.Node("AnalyticService")` + addComponent + addPersistRootNode.
    // Ở đây chỉ cần một đối tượng thường, nhưng BẮT BUỘC khác null — cả 4 chỗ gọi đều
    // không kiểm tra null trước khi `.trackCustomQ(...)`:
    //   AnalyticButtonHelper.js:73, HeaderUi.js:429, MainGameViewModel.js:241,
    //   TableCellRoomXocDia.js:168
    Object.defineProperty(AnalyticService, 'instance', {
        get: function () {
            if (null === this._instance) {
                this._instance = new AnalyticService();
            }
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });

    // eventType: AnalyticDefine.AnaltyciEventType.CLICK …
    // value:     chuỗi định danh nút ("exit_cg_<gameID>", "leave_cg_<gameID>", …)
    // Không dùng giá trị trả về ở cả 4 chỗ gọi.
    AnalyticService.prototype.trackCustomQ = function (eventType, value) {};

    AnalyticService._instance = null;
    return AnalyticService;
})();

exports.default = AnalyticService;
