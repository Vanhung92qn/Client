'use strict';
// ============================================================================
// LỚP GIẢ — CHO RỖNG (no-op)
//
// Vì sao rỗng: bản gốc Go88 (…\L00\VersionController.js) là bộ "ép cập nhật phiên bản"
// của Go88 — đọc `localStorage.currversion`, so với bản trên remote config của Go88, rồi
// bật popup bắt người chơi tải bản mới từ hạ tầng Go88. Roy88 có vòng đời phát hành riêng,
// và 🔴 không được gọi về Go88, nên cắt hẳn.
//
// Cho rỗng KHÔNG mất gì: không ép cập nhật thì game chạy tiếp bình thường — đúng nhánh
// `isForceUpdateEnabled() === false` của bản gốc.
// ============================================================================

Object.defineProperty(exports, '__esModule', { value: true });

var VersionController = (function () {
    function VersionController() {}

    // Chỗ gọi thật: MainGameViewModel.js:147 và :261
    //   m.default.getInstance().CheckForceUpdateByCurrentScene()
    VersionController.getInstance = function () {
        if (null === this.Instance || void 0 === this.Instance) {
            this.Instance = new VersionController();
        }
        return this.Instance;
    };

    // Bản gốc chỉ uỷ quyền xuống `checkForceUpdateByCurrentScene()` (chữ thường) rồi mở
    // popup cập nhật. Không trả về gì, bên gọi cũng không dùng.
    VersionController.prototype.CheckForceUpdateByCurrentScene = function () {};

    VersionController.Instance = null;
    return VersionController;
})();

exports.default = VersionController;
