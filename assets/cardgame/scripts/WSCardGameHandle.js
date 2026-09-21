'use strict';
/*
 * WSCardGameHandle — LỚP GIẢ (shim) thay cho trục cùng tên của Go88.
 *
 * Bản gốc để đối chiếu:
 *   C:\Reverse\go88\assets\scripts\L00\WSCardGameHandle.js   (lớp con)
 *   C:\Reverse\go88\assets\scripts\L00\WSHandlerBase.js      (lớp cha — chứa máy trạng thái)
 *   C:\Reverse\go88\assets\scripts\L00\WebSocketConnecter.js (bọc WebSocket)
 *
 * VÌ SAO GỘP 3 TỆP LÀM 1: `WSHandlerBase` và `WebSocketConnecter` KHÔNG nằm trong danh sách 74
 * script đã bê (chúng chỉ tồn tại để phục vụ hạ tầng Go88 — 5 socket khác, device attestation,
 * telemetry `fb2.vlog`). Bê chúng sẽ kéo theo cả cây hạ tầng đó. Nên lớp giả này tự chứa đúng
 * phần máy trạng thái mà Ba Cây cần, giữ NGUYÊN tên thành viên / thứ tự bước của bản gốc.
 *
 * 🔴 ĐÃ CẮT (tất cả đều là đường ra hạ tầng Go88 — cấm theo LOP-GIA.md điều 2):
 *   - `fb2.sa` / device assertion (khung loại 9/8) và `fb2.vlog` (gửi log WebSocket về Go88).
 *   - `verifyToken()` gọi HTTP `urlLoginVerifySession` của Go88 kèm token người chơi.
 *   - Sub-protocol `["jwt", jwToken]` (jwToken do máy chủ Go88 cấp).
 *   - `requestVersionForceUpdate` / `VersionController` (kiểm tra phiên bản app Go88).
 *   - `loginSuccess` bản gốc mở thêm socket MiniGame của Go88 + xoá danh sách ngân hàng.
 *   - `processServerMessage` bản gốc có ~25 nhánh nạp/rút/OTP của Go88 (OnePay, CodePay,
 *     Crypto, ViettelPay…). Backend của mình không phát những lệnh đó.
 *   - `AnalyticsManager.logEvent("DisconnectWsCardGame")`.
 *   - `ErrorLogHandler.sendTestSocket(... + token + tên người chơi ...)` — rò token.
 *
 * VIỆC CỦA LỚP NÀY: chỉ là ĐƯỜNG TRUYỀN. Mở WebSocket tới backend của mình, giữ nhịp ping,
 * tự nối lại, rồi đẩy khung nhận được vào đúng các callback mà code đã bê / BaseScene đăng ký.
 * Nó không biết một luật game nào.
 */
Object.defineProperty(exports, '__esModule', { value: true });

// Mấy module này không require ngược lại ai (đã kiểm) nên nạp thẳng ở đầu tệp được.
// BangGhi cũng vậy: nó không require gì cả, chỉ nhận khung tin từ đúng hai chỗ móc bên dưới.
var BangGhi = require('./BangGhi');
var MessageCardGameHandler = require('./MessageCardGameHandler');
var NhatKy = require('./NhatKy');
var DongHo = require('./DongHo');
var MessageHandlerBase = require('./MessageHandlerBase');
var GameDefine = require('./GameDefine');

/* ------------------------------------------------------------------ *
 * Bọc WebSocket — thay `WebSocketConnecter` của Go88.
 * Giữ đúng hình dạng mà code gọi tới: `.ws` (WebSocket thật), `.sendData(chuỗi)`,
 * `.connectWS(url)`, `.onopen/.onmessage/.onclose/.onerror`, `.isHaveSubProtocol`.
 * ------------------------------------------------------------------ */
var WebSocketConnecter = (function () {
    function WebSocketConnecter() {
        this.ws = null;
        this.url = '';
        this.onopen = function (e) {};
        this.onclose = function (e) {};
        this.onmessage = function (e) {};
        this.onerror = function (e) {};
        // Go88 dùng cờ này để gắn sub-protocol ["jwt", jwToken]. Giữ tên cho khớp API
        // (GameConfigManager có thể set qua setFlagSubProtocol) nhưng KHÔNG dùng: backend của
        // mình xác thực bằng accessToken trong khung đăng nhập, không qua sub-protocol.
        this.isHaveSubProtocol = false;
        this._clientCloseReason = '';
    }

    WebSocketConnecter.prototype.connectWS = function (url) {
        var self = this;
        this.url = url;
        this._clientCloseReason = '';
        // Gỡ hết handler của socket cũ trước khi thay, nếu không socket cũ đóng muộn sẽ bắn
        // onclose vào máy trạng thái của socket mới (bản gốc Go88 cũng làm đúng bước này).
        if (null != this.ws) {
            this.ws.onopen = null;
            this.ws.onerror = null;
            this.ws.onmessage = null;
            this.ws.onclose = null;
        }
        // ── Móc GHI / PHÁT LẠI (BangGhi.js) ────────────────────────────────────────────────
        // 🔴 Lúc phát lại thì KHÔNG mở socket thật. Khung vào do BangGhi bơm thẳng vào
        // `self.onmessage`, khung ra bị `sendData` giữ lại để so. Nếu vẫn mở socket thì phát lại
        // một ván cũ sẽ gửi CƯỢC THẬT lên máy chủ — mất tiền thật để chạy một phép thử.
        if (BangGhi.default.dangPhatLai()) {
            BangGhi.default.ganSocketGia(self);
            setTimeout(function () { self.onopen({}); }, 0);
            return;
        }

        this.ws = new WebSocket(this.url);
        this.ws.onopen = function (e) { self.onopen(e); };
        this.ws.onmessage = function (e) {
            BangGhi.default.ghiVao(e && e.data);
            self.onmessage(e);
        };
        this.ws.onerror = function (e) {
            // Go88 chủ động close() ngay trong onerror để máy trạng thái đi tiếp bằng onclose.
            self._clientCloseReason = 'transport-error (onerror)';
            self.ws.close();
            self.onerror(e);
        };
        this.ws.onclose = function (e) {
            self._clientCloseReason = '';
            self.onclose(e);
        };
    };

    // Tham số thứ hai của bản gốc chỉ dùng để bật/tắt ghi log telemetry — đã cắt, giữ chỗ
    // để chữ ký hàm không đổi (ping() gọi sendData(chuỗi, false)).
    WebSocketConnecter.prototype.sendData = function (data, _log) {
        // Ghi TRƯỚC khi gửi, và lúc phát lại thì CHỈ ghi chứ không gửi — xem connectWS.
        BangGhi.default.ghiRa(data);
        if (BangGhi.default.dangPhatLai()) return;

        if (null != this.ws && this.ws.readyState == WebSocket.OPEN) {
            this.ws.send(data);
        }
    };

    return WebSocketConnecter;
})();

/* ------------------------------------------------------------------ */

var WSCardGameHandle = (function () {
    function WSCardGameHandle() {
        /* --- callback do BaseScene / LobbyViewController đăng ký (bản gốc: BaseScene.onLoad) --- */
        this.onLoginSuccess = function (arr) {};
        this.onLoginFail = function (arr) {};
        this.onLogOut = function (arr) {};
        this.onJoinRoom = function (arr) {};
        this.onLeaveRoom = function (arr) {};
        this.onPing = function (arr) {};
        this.onopen = function () {};
        this.onclose = function () {};
        this.onerror = function (e) {};
        this.onUpdateNetworkState = function (state) {};
        this.tokenExpireCallback = null;
        this.callbackWSLoginSuccess = null;
        // (cmd, khungĐầyĐủ, đốiTượng, làSocketBài) — MainGameViewModel/GameController nhận ở đây.
        this.onReceiveMessage = function (cmd, arr, obj, isCard) {};
        this.onReceiveBroadCast = function (obj) {};

        /* --- trạng thái đường truyền --- */
        this.name = 'Socket Card';
        this.CMD_PING_SIMMS = '';
        this.urlServer = '';
        this.ws = null;
        this.cm_login = '';
        this.isSocketOpen = false;
        this.isSocketLogined = false;

        /* --- nhịp ping & tự nối lại (số liệu giữ đúng bản gốc Go88, đã đối chiếu bắt gói thật) --- */
        this.timeDelayPing = 5;        // 5 giây gửi một ping
        this.timeAutoReconnect = 10;   // 10 giây không nhận được gì thì tự đóng để nối lại
        this.countTimePing = 0;
        this.pingIndex = 0;
        this.pongIndex = 0;
        this.isReceivePong = false;
        this.timeNoResponse = -1;
        this.timeLostConnect = 0;
        this.timeCheckNetworkStatus = 0;
        this.timeConnectAfterClose = 5;
        this.deltaTimeConnectAfterClose = 5;
        this.connectOnClose = true;
        this.isReconnectOnClose = true;
        this.isNeedLogin = false;
        this.isNeedReconnect = true;
        this.isReconnect = false;
        this.isConnectError = false;
        this.timeConnectError = 0;
        this.networkState = GameDefine.ENetworkState.GOOD;
        this.isShowPopupReconnect = true;
        // Bản gốc dùng cờ này khi người chơi tự thoát; ở đây do chính lớp này bật khi đăng nhập
        // hỏng, để khỏi lao vào vòng nối-lại vô tận. KHÁC bản gốc ở chỗ không đọc GamePlayManager.
        this.isForceStopRelogin = false;

        /* --- cờ cấu hình Go88 giữ lại cho khớp API (GameConfigManager có thể set) --- */
        this.isSubProtocol = false;
        this.isNeedVerifyTokenFirst = false;
        this.isSkipVerifyWhenLogin = false;

        this._isMaintain = false;
        this._isBusyShown = false;   // đang hiện bánh xe chờ "đang kết nối lại" của Roy88
        this._isTicking = false;     // đã cắm vào bộ đếm khung hình chưa
    }

    Object.defineProperty(WSCardGameHandle.prototype, 'isMaintain', {
        get: function () { return this._isMaintain; },
        set: function (v) { this._isMaintain = v; },
        enumerable: true,
        configurable: true
    });

    WSCardGameHandle.getInstance = function () {
        if (!(null !== this.Instance && void 0 !== this.Instance)) {
            this.Instance = new WSCardGameHandle();
            this.Instance.init();
        }
        return this.Instance;
    };

    WSCardGameHandle.prototype.init = function () {
        this.name = 'Socket Card';
        this.ws = new WebSocketConnecter();
        this.urlServer = '';
        // Khung ping của giao thức Simms: ["7", "Simms", "1", N] — N là số thứ tự ping.
        this.CMD_PING_SIMMS = '["7", "' + this.getZoneName() + '", "1",';
        this.startTicking();
    };

    /*
     * KHÁC GO88 — bắt buộc: ở Go88, `update(dt)` được `MiniGameNode` (nút minigame nổi ở sảnh)
     * gọi mỗi khung hình (MiniGameNode.js:764). MiniGameNode là trục "cho rỗng" (bê thẳng sẽ kéo
     * thêm 553 script), nên không còn ai lái vòng lặp này. Ta tự cắm vào bộ lập lịch của Cocos.
     * Dùng `cc.director.getScheduler()` chứ không dùng một Component: bộ lập lịch chỉ huỷ theo
     * target khi Component bị destroy, nên target thường như thế này sống qua các lần đổi scene —
     * đúng như MiniGameNode (nút thường trú ở sảnh) trước đây.
     */
    WSCardGameHandle.prototype.startTicking = function () {
        if (this._isTicking) {
            return;
        }
        this._isTicking = true;
        var scheduler = cc.director.getScheduler();
        scheduler.enableForTarget(this);   // gán _id, nếu không schedule() sẽ từ chối target
        scheduler.schedule(this.update, this, 0, cc.macro.REPEAT_FOREVER, 0, false);
    };

    WSCardGameHandle.prototype.getZoneName = function () {
        // Go88 dựng khung đăng nhập ở LoadingScene.js:688 với zone "Simms" cứng. Bản gốc của
        // WSHandlerBase trả "" rồi để nơi gọi truyền vào; ở đây gom về một chỗ cho khỏi lệch.
        return 'Simms';
    };

    /* --------------------------- địa chỉ máy chủ --------------------------- */

    /*
     * `urlServer` ở Go88 do LoadingScene gán (LoadingScene.js:849) từ cấu hình tải về. Ở Roy88,
     * địa chỉ lấy từ GameConfigManager.
     * ⚠️ require MUỘN (không để đầu tệp) vì GameConfigManager cũng require ngược WSCardGameHandle
     * — nạp vòng tròn ở đầu tệp sẽ nhận về exports rỗng.
     */
    WSCardGameHandle.prototype.getUrlServer = function () {
        if (this.urlServer && this.urlServer.length > 0) {
            return this.urlServer;
        }
        var GameConfigManager = require('./GameConfigManager');
        this.urlServer = GameConfigManager.default.getInstance().getWsCardUrl();
        return this.urlServer;
    };

    /* --------------------------- vòng lặp mỗi khung hình --------------------------- */

    WSCardGameHandle.prototype.update = function (dt) {
        var url = this.getUrlServer();
        // Điều kiện chạy của bản gốc: có url + không ở scene đăng nhập + có token + chưa đăng xuất.
        // Ở Roy88, "có token" chính là cái cổng đó — chưa đăng nhập thì token rỗng.
        if (!url || url.length === 0 || this.getToken().length === 0 || false === this.isNeedReconnect) {
            return;
        }

        if (0 == this.isSocketOpen) {
            if (this.timeConnectAfterClose > 0) {
                this.timeConnectAfterClose -= dt;
            } else if (this.isNeedLogin) {
                this.startConnect(this.cm_login);
                this.timeConnectAfterClose += this.deltaTimeConnectAfterClose;
            }
            if (this.networkState != GameDefine.ENetworkState.DISCONNECT) {
                this.updateNetworkState(GameDefine.ENetworkState.DISCONNECT);
            }
            return;
        }

        // 10 giây không nghe thấy gì từ máy chủ → coi như đứt, đóng để đi nhánh nối lại.
        if (this.timeNoResponse >= this.timeAutoReconnect) {
            this.timeNoResponse = 0;
            this.closeSocket();
        }
        if (this.isConnectError) {
            this.timeConnectError += dt;
            if (this.timeConnectError >= 30) {
                this.timeConnectError = 0;
                this.reConnect();
            }
        }
        if (0 == this.isReceivePong) {
            this.timeNoResponse += dt;
        }
        this.countTimePing += dt;
        if (this.countTimePing >= this.timeDelayPing) {
            this.countTimePing = 0;
            this.ping();
        }
        this.timeCheckNetworkStatus += dt;
        if (this.timeCheckNetworkStatus >= 3) {
            this.timeCheckNetworkStatus = 0;
            this.checkNetworkStatus();
            if (this.networkState == GameDefine.ENetworkState.LOST_CONNECT) {
                this.timeLostConnect += dt;
            }
        }
    };

    // Bậc thang đánh giá đường truyền — giữ nguyên các mốc 3/6/10/15 giây của bản gốc.
    WSCardGameHandle.prototype.checkNetworkStatus = function () {
        if (this.timeNoResponse >= 15) {
            if (this.networkState != GameDefine.ENetworkState.LOST_CONNECT) {
                this.updateNetworkState(GameDefine.ENetworkState.LOST_CONNECT);
                this.timeLostConnect = 0;
            }
        } else if (this.timeNoResponse >= 10) {
            if (this.networkState != GameDefine.ENetworkState.VERY_LOW) {
                this.updateNetworkState(GameDefine.ENetworkState.VERY_LOW);
            }
        } else if (this.timeNoResponse >= 6) {
            if (this.networkState != GameDefine.ENetworkState.LOW) {
                this.updateNetworkState(GameDefine.ENetworkState.LOW);
            }
        } else if (this.timeNoResponse >= 3) {
            if (this.networkState != GameDefine.ENetworkState.MEDIUM) {
                this.updateNetworkState(GameDefine.ENetworkState.MEDIUM);
            }
        } else if (this.networkState != GameDefine.ENetworkState.GOOD) {
            this.updateNetworkState(GameDefine.ENetworkState.GOOD);
        }
        if (this.timeLostConnect > 10 && this.networkState != GameDefine.ENetworkState.LOST_CONNECT_LONG) {
            this.updateNetworkState(GameDefine.ENetworkState.LOST_CONNECT_LONG);
        }
    };

    WSCardGameHandle.prototype.updateNetworkState = function (state) {
        this.networkState = state;
        this.onUpdateNetworkState(state);
        if (state != GameDefine.ENetworkState.LOST_CONNECT_LONG) {
            this.timeLostConnect = 0;
        }
        // Bản gốc (WSCardGameHandle.updateNetworkState) hiện/ẩn lớp "mạng yếu" của
        // CommonPrefabsManager. Ở đây nối vào bánh xe chờ của Roy88 — xem showPopupReconnect().
        switch (state) {
            case GameDefine.ENetworkState.GOOD:
            case GameDefine.ENetworkState.MEDIUM:
            case GameDefine.ENetworkState.LOW:
                this.hidePopupReconnect();
                break;
            case GameDefine.ENetworkState.VERY_LOW:
                // Go88 hiện icon "mạng yếu" nhỏ (showLoadingNetwork) — KHÔNG chặn thao tác.
                // Roy88 chưa có icon tương đương; cố tình để trống thay vì bật bánh xe chờ,
                // vì bánh xe chờ chặn cả màn hình — sẽ khác hành vi Go88.
                break;
            case GameDefine.ENetworkState.LOST_CONNECT:
            case GameDefine.ENetworkState.DISCONNECT:
                if (this.getToken().length > 0) {
                    this.showPopupReconnect();
                }
                break;
        }
    };

    WSCardGameHandle.prototype.clearUpdate = function () {
        this.timeLostConnect = 0;
        this.timeNoResponse = 0;
    };

    WSCardGameHandle.prototype.setTimeDelayPing = function (t) {
        this.timeDelayPing = t;
    };

    WSCardGameHandle.prototype.startPing = function () {
        this.clearUpdate();
        this.countTimePing = 0;
        this.pingIndex = 0;
    };

    // Giữ tên hàm cho khớp API GameConfigManager; sub-protocol jwt là của Go88 nên không dùng.
    WSCardGameHandle.prototype.setFlagSubProtocol = function (flag) {
        this.isSubProtocol = flag;
        if (this.ws) {
            this.ws.isHaveSubProtocol = flag;
        }
    };

    /* --------------------------- mở / đóng kết nối --------------------------- */

    WSCardGameHandle.prototype.getToken = function () {
        // Điểm nối Roy88 (LOP-GIA.md). Token của Go88 nằm ở GamePlayManager.token; ở Roy88 nguồn
        // sự thật là phiên đăng nhập của chính client.
        var token = cc.ServerConnector.getInstance().getToken();
        return token ? token : '';
    };

    // Dựng khung đăng nhập Simms và mở kết nối. Ở Go88 việc này do LoadingScene.js:688 làm.
    WSCardGameHandle.prototype.connectWS = function () {
        this.timeConnectAfterClose = 5;
        this.isReconnectOnClose = true;
        this.isNeedReconnect = true;
        this.isNeedLogin = true;
        this.isForceStopRelogin = false;
        var cmd = [MessageCardGameHandler.Message.MessageType.LogIn_Type, this.getZoneName(), '', '', {
            agentId: '1',
            accessToken: this.getToken(),
            reconnect: false
        }];
        this.connect(JSON.stringify(cmd));
    };

    WSCardGameHandle.prototype.closeWS = function () {
        this.isReconnectOnClose = false;
        this.isNeedReconnect = false;
        this.closeMine();
    };

    WSCardGameHandle.prototype.connect = function (loginCmd) {
        this.timeConnectAfterClose = 0;
        this.isConnectError = false;
        var cmd = JSON.parse(loginCmd);
        cmd[4].reconnect = this.isReconnect;
        this.isNeedReconnect = false;   // chốt lại: đang có một lần mở kết nối chủ động
        this.setLoginCmd(JSON.stringify(cmd));
        this.startConnect(loginCmd);
    };

    WSCardGameHandle.prototype.reConnect = function () {
        this.connect(this.cm_login);
    };

    WSCardGameHandle.prototype.setLoginCmd = function (cmd) {
        this.cm_login = cmd;
    };

    /*
     * Bản gốc chạy verifyToken() (HTTP về Go88) rồi mới mở socket, và còn một nhánh device
     * attestation. Cả hai đã cắt: token của Roy88 do chính backend của mình phát và chính
     * backend đó xác thực lại trong khung đăng nhập — không có bước trung gian nào nữa.
     */
    WSCardGameHandle.prototype.startConnect = function (loginCmd) {
        var url = this.getUrlServer();
        if (!url || url.length === 0 || this.isForceStopRelogin) {
            return;
        }
        this.isConnectError = false;
        var cmd = JSON.parse(loginCmd);
        cmd[4].reconnect = this.isReconnect;
        // Nối lại thì phải mang token mới nhất — phiên Roy88 có thể đã đổi token.
        cmd[4].accessToken = this.getToken();
        this.isSocketOpen = false;
        this.setLoginCmd(JSON.stringify(cmd));
        this._openSocket(url);
    };

    WSCardGameHandle.prototype._openSocket = function (url) {
        this.ws.connectWS(url);
        this.ws.onopen = this.onWSOpen.bind(this);
        this.ws.onmessage = this.onWsReciveMessage.bind(this);
        this.ws.onclose = this.onWSClose.bind(this);
        this.ws.onerror = this.onWSError.bind(this);
    };

    WSCardGameHandle.prototype.closeSocket = function (showPopupReconnect, reason) {
        if (void 0 === showPopupReconnect) {
            showPopupReconnect = true;
        }
        if (void 0 === reason) {
            reason = 'closeSocket';
        }
        this.isShowPopupReconnect = showPopupReconnect;
        if (null != this.ws && null != this.ws.ws) {
            if (this.ws.ws.readyState != WebSocket.CLOSED && this.ws.ws.readyState != WebSocket.CLOSING) {
                this.ws._clientCloseReason = this.name + ' ' + reason;
                this.ws.ws.close();
            } else {
                // Socket đã chết sẵn: onclose sẽ không bắn nữa nên phải tự đẩy máy trạng thái.
                this.isReconnectOnClose = true;
                this.onWSClose(null);
            }
        }
    };

    // Đóng hẳn, không nối lại (người chơi chủ động rời).
    WSCardGameHandle.prototype.closeMine = function () {
        if (this.isSocketOpen) {
            this.isSocketOpen = false;
            this.cm_login = '';
            if (null != this.ws.ws) {
                this.ws._clientCloseReason = this.name + ' closeMine';
                this.ws.ws.close();
            }
        }
    };

    WSCardGameHandle.prototype.isNetWorkOk = function () {
        return !!window.navigator.onLine;
    };

    /* --------------------------- sự kiện socket --------------------------- */

    WSCardGameHandle.prototype.onWSOpen = function (e) {
        this.isSocketOpen = true;
        this.isReconnectOnClose = true;
        this.isNeedReconnect = true;
        this.deltaTimeConnectAfterClose = 5;
        this.connectOnClose = true;
        // MessageHandlerBase.init() lấy socket từ đây (các *MessageHandler đã bê dùng để gửi).
        MessageHandlerBase.default.staticSocket = this.ws;
        this.updateNetworkState(GameDefine.ENetworkState.GOOD);
        this.proceedLogin();
        this.hidePopupReconnect();
        this.onopen();
    };

    WSCardGameHandle.prototype.proceedLogin = function () {
        if (this.isNeedLogin) {
            this.ws.sendData(this.cm_login);
            this.isNeedLogin = false;
            this.countTimePing = 0;
        }
    };

    WSCardGameHandle.prototype.onWSClose = function (e) {
        this.isSocketOpen = false;
        this.isSocketLogined = false;
        if (this.onclose) this.onclose();

        if (this.getToken().length > 0 && !this.isForceStopRelogin && this.isReconnectOnClose) {
            if (this.isShowPopupReconnect) {
                this.showPopupReconnect();
            }
            this.isReconnect = true;
            this.isNeedLogin = true;
            // Giãn dần thời gian chờ nối lại: 5 → 7 → 9 … tối đa 15 giây (đúng bản gốc).
            if (this.timeConnectAfterClose <= 0) {
                if (this.connectOnClose) {
                    this.startConnect(this.cm_login);
                    this.connectOnClose = false;
                    this.timeConnectAfterClose = this.deltaTimeConnectAfterClose;
                }
                this.timeConnectAfterClose += this.deltaTimeConnectAfterClose;
                this.deltaTimeConnectAfterClose += 2;
                if (this.deltaTimeConnectAfterClose > 15) {
                    this.deltaTimeConnectAfterClose = 15;
                }
            } else {
                this.timeConnectAfterClose = this.deltaTimeConnectAfterClose;
                this.deltaTimeConnectAfterClose = 5;
            }
        }

        // Bản gốc còn đóng kèm socket TechPlay + Xóc Đĩa. TechPlay không bê; Xóc Đĩa giữ lại
        // cho đúng hình dạng (lớp giả của nó không bao giờ mở nên đây là no-op).
        require('./WSXDGamesHandle').default.getInstance().closeSocket(false);
    };

    WSCardGameHandle.prototype.onWSError = function (e) {
        this.isConnectError = true;
        this.onerror(e);
        cc.director.emit(GameDefine.GameEventMessage.WS_CARD_CONNECT_ERROR);
    };

    /*
     * Cửa vào của MỌI khung từ máy chủ. Giao thức Simms: khung là mảng JSON, phần tử [0] là loại.
     *   1 = phản hồi đăng nhập, 2 = đăng xuất, 3 = vào bàn, 4 = rời bàn,
     *   5 = sự kiện trong bàn/zone (đối tượng nằm ở [1], mang khoá `cmd`), 6 = pong.
     */
    WSCardGameHandle.prototype.onWsReciveMessage = function (evt) {
        NhatKy.ghi('←NHẬN', evt.data);
        DongHo.theoKhung(evt.data);
        this.isConnectError = false;
        this.hidePopupReconnect();

        var arr = JSON.parse(evt.data);
        var type = arr[0];
        this.isSocketOpen = true;
        cc.director.emit(MessageCardGameHandler.Message.ESocketStatus.OPEN, type, evt, arr);

        switch (type) {
            case MessageCardGameHandler.Message.CommandReponse.LogIn_Response:
                if (null === arr || void 0 === arr || arr.length <= 1) {
                    this.isSocketLogined = false;
                    this.loginFailed(arr);
                    return;
                }
                if (105 == arr[2]) {          // token hết hạn
                    if (null != this.tokenExpireCallback) {
                        this.tokenExpireCallback();
                    }
                    return;
                }
                if (104 == arr[2]) {          // máy chủ bảo trì
                    var msgMaintain = 'M\u00e1y ch\u1ee7 \u0111ang trong ch\u1ebf \u0111\u1ed9 b\u1ea3o tr\xec. M\u1eddi b\u1ea1n quay l\u1ea1i sau.';
                    if (null != arr[5] && void 0 != arr[5]) {
                        msgMaintain = arr[5];
                    }
                    cc.director.emit('ON_LOGIN_FAIL', msgMaintain);
                    this.closeSocket(false);
                    return;
                }
                if (arr[1]) {
                    this.isReconnect = true;
                    this.loginSuccess(arr);
                } else {
                    this.isSocketLogined = false;
                    this.loginFailed(arr);
                    this.clearUpdate();
                }
                break;
            case MessageCardGameHandler.Message.CommandReponse.LogOut_Response:
                this.receiveLogout(arr);
                break;
            case MessageCardGameHandler.Message.CommandReponse.JoinRoom_Response:
                if (null !== this.onJoinRoom && void 0 !== this.onJoinRoom) {
                    this.onJoinRoom(arr);
                }
                break;
            case MessageCardGameHandler.Message.CommandReponse.LeaveRoom_Response:
                if (null !== this.onLeaveRoom && void 0 !== this.onLeaveRoom) {
                    this.onLeaveRoom(arr);
                }
                break;
            case MessageCardGameHandler.Message.CommandReponse.Ping_Response:
                this.pong(arr);
                if (this.onPing) this.onPing(arr);
                break;
            case MessageCardGameHandler.Message.CommandReponse.Extension_Response:
                this.onExtensionResponse(arr, arr[1]);
                break;
        }
        this.timeNoResponse = 0;
    };

    /* --------------------------- đăng nhập / đăng xuất --------------------------- */

    WSCardGameHandle.prototype.loginSuccess = function (arr) {
        this.isSocketLogined = true;
        this.isForceStopRelogin = false;
        if (this.onLoginSuccess) this.onLoginSuccess(arr);
        this.startPing();
        if (null !== this.callbackWSLoginSuccess) {
            this.callbackWSLoginSuccess();
            this.callbackWSLoginSuccess = null;
        }
    };

    WSCardGameHandle.prototype.loginFailed = function (arr) {
        this.isSocketLogined = false;
        this.isReconnect = false;

        var message = '\u0110\u0103ng nh\u1eadp th\u1ea5t b\u1ea1i';
        if (arr && arr.length > 0 && arr[arr.length - 1] && arr[arr.length - 1].length > 0) {
            message = arr[arr.length - 1];
        }

        // Đăng nhập hỏng thì dừng hẳn vòng nối lại, nếu không client sẽ quay vòng vô tận.
        this.isReconnectOnClose = false;
        this.isNeedLogin = false;
        this.connectOnClose = false;
        this.timeConnectAfterClose = 0;
        this.isForceStopRelogin = true;

        this.hidePopupReconnect();
        // Bản gốc dựng popup 1 nút của Go88 rồi đá về scene Login của Go88. Ở Roy88 chỉ báo lỗi;
        // việc đóng game / về sảnh do BaseScene quyết (nó mới biết mình đang ở đâu).
        cc.PopupController.getInstance().showMessage(message);
        if (this.onLoginFail) this.onLoginFail(arr);
    };

    WSCardGameHandle.prototype.receiveLogout = function (arr) {
        this.isNeedLogin = false;
        this.isSocketLogined = false;
        if (null !== this.onLogOut && void 0 !== this.onLogOut) {
            this.onLogOut(arr);
        }
    };

    WSCardGameHandle.prototype.onTokenExpired = function () {
        this.receiveLogout([2, true,
            'Phi\xean \u0111\u0103ng nh\u1eadp h\u1ebft h\u1ea1n, vui l\xf2ng \u0111\u0103ng nh\u1eadp l\u1ea1i!']);
    };

    /* --------------------------- ping / pong --------------------------- */

    WSCardGameHandle.prototype.ping = function () {
        if (null !== this.ws && false !== this.isSocketOpen) {
            if (0 == this.pingIndex || this.isReceivePong) {
                this.timeNoResponse = 0;
            }
            this.isReceivePong = false;
            this.pingIndex++;
            // ["7", "Simms", "1", N]
            this.ws.sendData(this.CMD_PING_SIMMS + this.pingIndex + ']', false);
        }
    };

    WSCardGameHandle.prototype.pong = function (arr) {
        this.isSocketOpen = true;
        this.pongIndex = arr[2];
        this.timeNoResponse = 0;
        this.isReceivePong = true;
        this.hidePopupReconnect();
        if (this.networkState != GameDefine.ENetworkState.GOOD) {
            this.updateNetworkState(GameDefine.ENetworkState.GOOD);
        }
    };

    /* --------------------------- gửi dữ liệu --------------------------- */

    WSCardGameHandle.prototype.sendData = function (data) {
        NhatKy.ghi('→GỬI', data);
        if (this.isSocketOpen) {
            this.ws.sendData(data);
        } else {
            this.isReconnectOnClose = true;
        }
    };

    /* --------------------------- phân loại sự kiện (loại 5) --------------------------- */

    WSCardGameHandle.prototype.onExtensionResponse = function (arr, obj) {
        var cmd = obj.cmd;
        switch (cmd) {
            case MessageCardGameHandler.Global_Message.BROADCAST_MESSAGE:
                if (null != this.onReceiveBroadCast) {
                    this.onReceiveBroadCast(obj);
                }
                break;
            case MessageCardGameHandler.Global_Message.SERVER_MESSAGE:
                this.processServerMessage(obj);
                break;
            case MessageCardGameHandler.Global_Message.MESSAGES_AND_NEWS:
                // require muộn: BroadCast là Component và kéo theo GameConfigManager/MiniGameNode.
                require('./BroadCast').default.listBroadCastMessage = obj.bcm;
                break;
            case MessageCardGameHandler.Global_Message.BROADCAST_MESSAGES:
                break;
            case MessageCardGameHandler.Global_Message.HIDE_SPAM_CHAT:
                // CardGameTableController.js:103 lắng nghe sự kiện này để ẩn chat của kẻ spam.
                cc.systemEvent.emit(GameDefine.GameEventMessage.HideSpamChat, obj.uid);
                break;
            case MessageCardGameHandler.Global_Message.FORCE_UPDATE_NEW_VERSION:
                // Kiểm tra phiên bản app Go88 — không áp dụng cho Roy88 (xem đầu tệp).
                break;
            default:
                if (null !== this.onReceiveMessage && void 0 !== this.onReceiveMessage) {
                    this.onReceiveMessage(cmd, arr, obj, true);
                }
        }
    };

    /*
     * Thông báo hệ thống. Bản gốc có ~25 nhánh nạp/rút của Go88; giữ lại đúng 2 nhánh bảo trì
     * (là thứ backend của mình sẽ dùng) + nhánh mặc định hiện nguyên văn lời nhắn.
     */
    WSCardGameHandle.prototype.processServerMessage = function (obj) {
        switch (obj.t) {
            case GameDefine.ServerMessageCommand.SOCKET_MAINTAIN:
                this.isMaintain = obj.mms;
                cc.PopupController.getInstance().showMessage(obj.message);
                break;
            case GameDefine.ServerMessageCommand.MAINTAIN:
            default:
                cc.PopupController.getInstance().showMessage(obj.message);
        }
    };

    /* --------------------------- báo "đang kết nối lại" --------------------------- */

    /*
     * Go88 dựng một popup 1 nút (ẩn nút, ẩn nền bấm được) rồi nhấp nháy dấu chấm
     * "Bị mất kết nối tới máy chủ / Đang kết nối lại...". Bản đầu này nối tạm vào bánh xe chờ
     * của Roy88 để khỏi phụ thuộc hình dạng popup của CommonPrefabsManager (lớp giả khác đang
     * viết). 🔴 CẦN THAY bằng đúng popup của Go88 ở bản sau — chủ dự án đã chốt "y hệt Go88".
     */
    WSCardGameHandle.prototype.showPopupReconnect = function () {
        if (this.getToken().length <= 0) {
            this.hidePopupReconnect();
            return;
        }
        if (this._isBusyShown) {
            return;
        }
        this._isBusyShown = true;
        cc.PopupController.getInstance().showBusy();
    };

    WSCardGameHandle.prototype.hidePopupReconnect = function () {
        if (!this._isBusyShown) {
            return;
        }
        this._isBusyShown = false;
        cc.PopupController.getInstance().hideBusy();
    };

    WSCardGameHandle.Instance = null;
    return WSCardGameHandle;
})();

exports.default = WSCardGameHandle;
