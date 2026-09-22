'use strict';
/*
 * WSXDGamesHandle — LỚP GIẢ RỖNG.
 *
 * Bản gốc: C:\Reverse\go88\assets\scripts\L00\WSXDGamesHandle.js
 * Ở Go88 đây là socket RIÊNG cho Xóc Đĩa (zone "SimmsRoBe", ping ["7","SimmsRoBe","1",N]).
 * Ba Cây KHÔNG dùng nó — nhưng `CardGameCommonRequest` (script đã bê, cấm sửa) vẫn require và
 * chạm vào hai thành viên, nên tệp này phải tồn tại, nếu không cả bundle gãy ngay lúc nạp.
 *
 * Hai chỗ gọi thật (C:\ClientCaoRua\assets\lobby\scripts\go88\CardGameCommonRequest.js:60-61):
 *     if (r.default.getInstance().isSocketOpen) {      // r = ./WSXDGamesHandle
 *         r.default.getInstance().ws.sendData(t);
 *     }
 * `isSocketOpen` luôn false nên nhánh trong không bao giờ chạy; `ws` vẫn phải có thật để
 * không ai vấp ReferenceError nếu sau này có nhánh khác đọc tới.
 *
 * Đường vào nhánh này còn bị chặn một lớp nữa: CardGameCommonRequest chỉ chọn socket Xóc Đĩa khi
 * `GameConfigManager.getInstance().canUseSocketXD()` trả true. Với Ba Cây hàm đó PHẢI trả false.
 *
 * 🔴 CẤM mở kết nối ở đây: địa chỉ socket Xóc Đĩa là hạ tầng Go88, và khung đăng nhập của nó
 * mang accessToken của người chơi. Tệp này không được chạm vào WebSocket, dưới mọi hình thức.
 */
Object.defineProperty(exports, '__esModule', { value: true });

var WSXDGamesHandle = (function () {
    function WSXDGamesHandle() {
        // Luôn đóng. Đây là cái phanh duy nhất giữ cho mọi lệnh không đi nhầm sang zone Xóc Đĩa.
        this.isSocketOpen = false;
        this.isSocketLogined = false;
        // Hình dạng giống WebSocketConnecter của Go88 nhưng rỗng ruột: `ws` (WebSocket thật) là
        // null vĩnh viễn, `sendData` nuốt im lặng.
        this.ws = {
            ws: null,
            sendData: function (_data, _log) {}
        };
        this.name = 'Socket XD';
        this.urlServer = '';
        this.CMD_PING_SIMMS = '["7", "SimmsRoBe", "1",';
        this.isReconnectOnClose = false;
        this.isNeedLogin = false;
        this.isReconnect = false;
        this.onReceiveMessage = function (cmd, arr, obj, isCard) {};
        this.onJoinRoom = function (arr) {};
        this.onLeaveRoom = function (arr) {};
    }

    WSXDGamesHandle.getInstance = function () {
        if (!(null !== this.Instance && void 0 !== this.Instance)) {
            this.Instance = new WSXDGamesHandle();
            this.Instance.init();
        }
        return this.Instance;
    };

    WSXDGamesHandle.prototype.init = function () {};

    WSXDGamesHandle.prototype.getZoneName = function () {
        return 'SimmsRoBe';
    };

    /*
     * Các hàm dưới đây giữ NGUYÊN chữ ký của bản gốc nhưng không làm gì.
     * `closeSocket` được WSCardGameHandle.onWSClose gọi (đúng như bản gốc Go88 làm);
     * `logout` được WSCardGameHandle.receiveLogout gọi. Giữ để hình dạng lời gọi không đổi.
     */
    WSXDGamesHandle.prototype.closeSocket = function (_showPopupReconnect, _reason) {};
    WSXDGamesHandle.prototype.closeMine = function () {};
    WSXDGamesHandle.prototype.closeWS = function () {};
    WSXDGamesHandle.prototype.logout = function () {};
    WSXDGamesHandle.prototype.sendData = function (_data) {};
    WSXDGamesHandle.prototype.connect = function (_loginCmd) {};
    WSXDGamesHandle.prototype.connectWS = function () {};
    WSXDGamesHandle.prototype.startConnect = function (_loginCmd) {};
    WSXDGamesHandle.prototype.update = function (_dt) {};
    WSXDGamesHandle.prototype.ping = function () {};

    WSXDGamesHandle.Instance = null;
    return WSXDGamesHandle;
})();

exports.default = WSXDGamesHandle;
