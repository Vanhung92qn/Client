'use strict';
// ============================================================================
// LỚP GIẢ — CHO RỖNG (no-op)
//
// Vì sao rỗng: đây là đường gửi log/crash về máy chủ Go88. Đáng chú ý — ngay TRONG BẢN GỐC
// Go88 (…\L00\ErrorLogHandler.js) các hàm này ĐÃ rỗng sẵn (`sendCrashError`,
// `sendLogginError`, `addLog`, `sendLog`… đều là `function() {}`); chỉ còn
// `clearLogString` là thực sự gán `this.logString = ""`. Vậy cho rỗng ở đây là CHÉP ĐÚNG
// hành vi bản gốc, không mất gì.
//
// Ngoài ra mọi chỗ gọi đều nằm sau cổng `GameConfigManager.enviromentName` chứa/indexOf
// "pre" — tức môi trường thử nghiệm nội bộ của Go88, Roy88 không bao giờ rơi vào.
// ============================================================================

Object.defineProperty(exports, '__esModule', { value: true });

var ErrorLogHandler = (function () {
    function ErrorLogHandler() {
        this.logString = '';
    }

    // Chỗ gọi thật: GameController.js:283, 406, 407, 1150 ; HeaderUi.js:682
    ErrorLogHandler.getInstance = function () {
        if (null === this.instance || void 0 === this.instance) {
            this.instance = new ErrorLogHandler();
        }
        return this.instance;
    };

    // GameController.js:283  (trong biểu thức dấu phẩy của `switch`, không dùng trị trả về)
    // GameController.js:407
    ErrorLogHandler.prototype.addLog = function (text, isSend) {};

    // GameController.js:406 — bản gốc gán this.logString = "", chép y nguyên.
    ErrorLogHandler.prototype.clearLogString = function () {
        this.logString = '';
    };

    // GameController.js:1150 — sendLog([tag, userID, "vanchoi"], true)
    ErrorLogHandler.prototype.sendLog = function (parts, isForce) {};

    // HeaderUi.js:682 — sendLogginError(err)
    ErrorLogHandler.prototype.sendLogginError = function (err) {};

    ErrorLogHandler.instance = null;
    return ErrorLogHandler;
})();

exports.default = ErrorLogHandler;
