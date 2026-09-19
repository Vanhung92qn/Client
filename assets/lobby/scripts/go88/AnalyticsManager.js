'use strict';
// ============================================================================
// LỚP GIẢ — CHO RỖNG (no-op)
//
// Vì sao rỗng: bản gốc Go88 (C:\Reverse\go88\assets\scripts\L00\AnalyticsManager.js)
// chỉ làm một việc — đẩy sự kiện sang Firebase Analytics của Go88 qua
// `FirebaseAnalytics.getInstance().logEventFirebase(...)`, kèm tên thương hiệu lấy từ
// `GameConfigManager.enviromentName`. 🔴 Mọi đường ra hạ tầng Go88 đều bị cấm, và Roy88
// không dùng Firebase, nên toàn bộ thân hàm để trống.
//
// Tệp vẫn phải tồn tại: BaCayController bê nguyên xi có `t("./AnalyticsManager")`, bỏ đi
// là `require` trả undefined và gọi `.default.getInstance()` sẽ ném lỗi ngay khi vào bàn.
// ============================================================================

Object.defineProperty(exports, '__esModule', { value: true });

var AnalyticsManager = (function () {
    function AnalyticsManager() {}

    // Chỗ gọi thật: BaCayController.js dòng 300, 302, 668, 686, 1262, 1294, 1300
    //   E.default.getInstance().logEvent(...)
    AnalyticsManager.getInstance = function () {
        if (null === this.Instance || void 0 === this.Instance) {
            this.Instance = new AnalyticsManager();
        }
        return this.Instance;
    };

    // Bản gốc: chuẩn hoá tên sự kiện rồi bắn lên Firebase.
    // Bên gọi không dùng giá trị trả về (BaCayController viết `return void ...logEvent(...)`),
    // nên trả undefined là đúng, không gãy luồng.
    // eventName: chuỗi ("UserUseAutoFlipAllCard", "ShowAllCardCaoRua", "UserLeaveRoomCaoRua"…)
    // params:    object hoặc bỏ trống
    AnalyticsManager.prototype.logEvent = function (eventName, params) {};

    AnalyticsManager.Instance = null;
    return AnalyticsManager;
})();

exports.default = AnalyticsManager;
