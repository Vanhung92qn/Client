'use strict';
/**
 * GamePlayManager — LỚP GIẢ (shim) cho trục cùng tên của Go88.
 *
 * Bản gốc: C:\Reverse\go88\assets\scripts\L00\GamePlayManager.js
 * Hợp đồng: C:\Server\tools\go88port\LOP-GIA.md
 *
 * Vai trò trong Go88: kho trạng thái của ván đang chơi (roomID / gameID / số dư / cờ giao diện)
 * + vài hàm phát yêu cầu chung lên socket "Simms". Code game Go88 được bê nguyên xi nên lớp này
 * phải giữ ĐÚNG tên và ĐÚNG API mà chúng gọi tới — sai chỗ nào thì sửa ở đây, không sửa code game.
 *
 * Khác bản gốc ở đâu (và vì sao):
 *  1. Ba nguồn dữ liệu người chơi (token / số dư / tên hiển thị) KHÔNG còn là biến riêng của Go88
 *     nữa mà đọc thẳng từ Roy88 — nếu giữ biến riêng thì tiền trong bàn và tiền ngoài sảnh sẽ lệch.
 *  2. Toàn bộ phần chỉ để nói chuyện với hạ tầng Go88 (HTTP OTP, verify session, top Tài Xỉu,
 *     inbox, log thiết bị, nhiệm vụ, Facebook login, logo nhà cái, fingerprint2…) đã CẮT BỎ.
 *     🔴 Không được nối lại: đó là đường có thể đẩy token người chơi sang máy chủ Go88.
 *  3. Chỉ giữ lại những thành viên mà 74 tệp đã bê THẬT SỰ gọi tới (dò bằng
 *     `node do-thi.js` + grep từng chỗ gọi). Không thêm thành viên "cho đủ".
 */
Object.defineProperty(exports, '__esModule', { value: true });

// Cùng bộ require như bản gốc, chỉ còn những module ĐÃ được bê sang.
// Lưu ý: CardGameCommonRequest cũng require ngược lại tệp này — vòng tròn này có sẵn trong
// bản gốc Go88 và không sao, vì ta chỉ chạm `.default` lúc gọi hàm chứ không lúc nạp module.
var MessageCardGameHandler = require('./MessageCardGameHandler');
var CardGameCommonRequest = require('./CardGameCommonRequest');
var GameConfigManager = require('./GameConfigManager');
var CommonPrefabsManager = require('./CommonPrefabsManager');
var GameUtils = require('./GameUtils');
var MusicPlayer = require('./MusicPlayer');
var StringUtil = require('./StringUtil');

var GamePlayManager = (function () {

    function GamePlayManager() {
        // ── Hồ sơ người chơi ────────────────────────────────────────────────────────────────
        // displayName / gold / token / userID là accessor nối sang Roy88 (xem cuối tệp).

        // Go88 không khai avaURL trong hàm dựng: nó được màn Login/Lobby của Go88 gán trước khi
        // vào bàn. Ta không bê hai màn đó, mà PlayerView.js:359 lại gọi thẳng avaURL.includes("-")
        // → để trống là NỔ ngay ván đầu. Lấy đúng giá trị dự phòng của chính Go88 ("Avatar0",
        // xem LobbyScene/LoginScene bản gốc) làm mặc định.
        // ⚠️ Roy88 lưu ảnh đại diện bằng SỐ (loginResponse.AvatarID + AvatarImages), Go88 lưu bằng
        //    CHUỖI tên/URL. Chưa ánh xạ được hai hệ này nên tạm dùng ảnh mặc định.
        this.avaURL = 'Avatar0';
        this.username = '';
        this.fb_id = '';
        this.phoneNumber = '';
        this.spriteFrameAvatar = null;
        this.uid = '';                  // BaseScene.js:369 ← USER_INFO.u (tên đăng nhập máy chủ trả)
        this.verified = false;          // BaseScene.js:386 ← USER_INFO.pvr
        this.loginDict = null;          // BaseScene.js:363 — giữ nguyên cả gói USER_INFO

        // customerID / serverID: bản gốc cũng KHÔNG khai trong hàm dựng, chúng chỉ xuất hiện khi
        // máy chủ trả USER_INFO (customerID, BaseScene.js:367) và đáp BOOK_ROOM (serverID,
        // BaseScene.js:333) — đúng như Go88 BaseScene dòng 353 và 382. Giữ nguyên undefined.
        this.customerID = undefined;
        this.serverID = undefined;
        // Kho chứa cho accessor `userID` ở cuối tệp: số hiệu do máy chủ bàn bài phát về.
        this._userIDFromServer = undefined;

        // session_id: Go88 dùng làm header X-TOKEN cho các API HTTP của Go88
        // (GameHTTPManager.js:61,107 và GameUtils.js:1002).
        // 🔴 CỐ Ý để rỗng: Roy88 không có "session id" riêng, và nếu trả token Roy88 ra đây thì
        // mỗi lời gọi HTTP còn sót lại sẽ mang token người chơi đi. Rỗng ⇒ isNullOrEmpty ⇒
        // header không bao giờ được gắn. Đây là cái phanh thứ hai, sau việc bỏ trống URL trong
        // GameConfigManager.
        this.session_id = '';

        // ── Tiền ────────────────────────────────────────────────────────────────────────────
        // vip / chip / goldSafe được GameController ghi từ bản tin REFRESH_MONEY (dòng 341-344
        // và 1017-1020). Go88 không khai `chip` trong hàm dựng; khai ở đây cho đủ bộ.
        this.vip = 0;
        this.chip = 0;
        this.goldSafe = 0;

        // ── Bàn đang chơi ───────────────────────────────────────────────────────────────────
        // GameController.setMoneyBuyInThreshold (dòng 452-454) ghi ba trường này.
        this.minBuyIn = 0;
        this.maxBuyIn = 0;
        this.bet = 0;
        this.gameIDIcon = null;
        this.timeInvite = 0;

        // Hai "việc còn dở" mà BaseScene cầm để quyết định vào bàn nào ngay sau khi đăng nhập:
        //   reconnectData ← USER_INFO.lr (bàn đang chơi dở)   — BaseScene.js:140-142
        //   inviteData    ← lời mời của người chơi khác        — BaseScene.js:148-151
        this.reconnectData = null;
        this.inviteData = null;

        // MessageLogOut: lý do bị đăng xuất. null = chưa bị. BaseScene.js:218,268 dựa vào đây để
        // phân biệt "mất mạng, nối lại đi" với "đã bị đăng xuất, đừng nối lại nữa".
        this.MessageLogOut = null;

        // 🔴 gameID / roomID / roomPassword: bản gốc Go88 KHÔNG khai trong hàm dựng, chúng là
        // undefined cho tới khi BaCayScene.js:66 (gameID) và joinRoom/RoomMessageHandler (roomID)
        // gán. Giữ nguyên undefined chứ không đặt 0 — vì GameID.LOADING_VIEW cũng bằng 0, đặt 0
        // sẽ biến phép so sánh `gameID === ...` thành đúng một cách im lặng.
        this.gameID = undefined;
        this.roomID = undefined;
        this.roomPassword = undefined;

        // ── Cờ điều hướng màn hình ──────────────────────────────────────────────────────────
        this.isListRoomScene = false;
        this.isInCardGame = false;
        this.isserverKickOut = false;

        // currentScene: bản gốc để rỗng trong hàm dựng rồi màn hình nào chạy thì ghi tên mình vào.
        // Ta không bê màn Login/Lobby của Go88 nên KHÔNG ai ghi — và rỗng chính là điều ta muốn:
        //   · GameConfigManager.js:256-257 → canUseSocketXD() = false → Ba Cây gửi qua zone "Simms"
        //     (đúng), không đụng zone Xóc Đĩa "SimmsRoBe".
        //   · BaseScene.js:393-394 → không nhận nhầm mình đang ở sảnh/màn đăng nhập của Go88.
        this.currentScene = '';

        // ── Chống ngồi lì không tương tác (BaCayController.js:1244) ─────────────────────────
        this.countMatchNotInteract = 0;

        // ── Chat trong bàn (ChatInGamePopup.js:179-189) ─────────────────────────────────────
        this.isEmoChat = false;
        this.lastChatTime = 0;
        this.lastChatTime1Minute = 0;
        this.numChatInGame = 0;
        this.lockChatInTime = 0;

        // ── Cờ linh tinh code đã bê còn đọc ────────────────────────────────────────────────
        this.isHostSentStartWarningOtherNotReady = false;   // GameController.js:759,771
        this.numShowThongBao = 3;                           // HeaderUi.js:338
        this.idTamBanMd5 = 0;                               // TableCellRoomXocDia.js:189
        this.fingerprint = '';                              // FgIDConfigManager.js:53
        this.browser = '';
        this.language = 0;                                  // = LocalizeDefine.Language.Vie của Go88
                                                            // (LocalizeManager.js:79). LocalizeDefine
                                                            // không được bê nên ghi thẳng số 0.

        // ── Đường quay lại màn Login của Go88 (HeaderUi.js:692-694) ────────────────────────
        // Chỉ có nhánh đăng nhập Facebook của Go88 ghi ba trường này, mà nhánh đó đã chết vì
        // urlLoginFB để trống. Giữ trường cho HeaderUi không nổ, không có ai đọc.
        this.forceLogin = false;
        this.tokenTemp = '';
        this.session_idTemp = '';

        // ── Ba ô của bảng Cài đặt mà Cào Rùa KHÔNG bao giờ hiện ───────────────────────────
        // PopupSetting.onLoad (PopupSetting.js:253-259) ĐỌC ba trường này vô điều kiện để đặt
        // trạng thái ô gạt, rồi mới tới setBGSize() mới quyết định ẩn/hiện hàng. Thiếu trường
        // thì initStart(undefined) — ô gạt về trạng thái lửng, không nổ nên không ai thấy.
        // Ba hàng tương ứng đều tắt với Cào Rùa bản web:
        //   · "Sắp xếp bài mới" chỉ hiện khi gameID === GAME.BINH (Mậu Binh)
        //   · "Chặn đăng nhập web" và "Mã khoá" chỉ hiện khi cc.sys.isNative && đang ở Lobby
        this.IsBlockLoginWeb = false;
        this.IsMauBinhUsingNewXepBai = true;                // khớp GameConfigManager.isNewXepBaiMauBinh
        this.IsMauBinhFistTimeShowQuickGuide = false;       // tên sai chính tả là của bản gốc

        // ── Két sắt: Roy88 không có, cụm này chết với Cào Rùa ─────────────────────────────
        // PopupUserTableInfo chỉ bật khung két sắt khi gameID thuộc [221, 9, 14] hoặc đang ở
        // một màn Live (PopupUserTableInfo.js:105) — gid Cào Rùa là 15 và ta không bê màn Live.
        // Vẫn khai hai ô để nếu cụm đó có bị mở ra thì hiện "0 đồng / nút Rút xám", chứ không
        // phải "NaN" hay nút bấm được rồi gọi vào hàm rỗng.
        this.extraMoney = 0;
        this.isUpdateKetSat = false;

        // ── Xóc Đĩa / ktek: Ba Cây KHÔNG dùng, giữ đúng kiểu và mặc định của bản gốc ───────
        this.iskteckgame = false;                           // GameController.js:366 (đọc)
        this.spinAutoXocDia = false;                        // MainGameViewModel.js:260 (ghi)
        this.xocdiaIconBG = new Map();                      // setXocDiaIconBG
        // Bốn trường ktek dưới đây bản gốc cũng không khai trong hàm dựng: chỉ MiniGameNode
        // (trục sẽ cho rỗng) mới gán chúng, và chỉ hai hàm sendInvitePlayersKtek /
        // sendGetInviteListKtek đọc — không tệp nào trong 74 tệp đã bê gọi tới hai hàm đó.
        // Giữ undefined y như Go88.
        this.roomIDKtek = undefined;
        this.gameIDKtek = undefined;
        this.betKtek = undefined;
        this.tableTypeKtek = undefined;

        // ── Ẩn/hiện tab trình duyệt ────────────────────────────────────────────────────────
        this.isFocusing = true;
        this.lastTimeHide = 0;
        this.onFocusCallback = null;
        this.onLostFocusCallback = null;
        this.onFocusMiniGameCallback = null;
        this.onLostFocusMiniGameCallback = null;
    }

    GamePlayManager.Instance = null;

    GamePlayManager.getInstance = function () {
        if (this.Instance === null || this.Instance === undefined) {
            this.Instance = new GamePlayManager();
            this.Instance.init();
        }
        return this.Instance;
    };

    /**
     * Giữ nguyên vòng đời ẩn/hiện tab của bản gốc: hạ khung hình khi mất focus, tắt nhạc nền,
     * và hỏi lại số dư khi quay lại (người chơi có thể vừa nạp tiền ở tab khác).
     * Đã bỏ: fingerprint2, sessionIDIgnoreResult (Ba Cây không đọc tới).
     */
    GamePlayManager.prototype.init = function () {
        this.browser = cc.sys.isNative ? 'App' : cc.sys.browserType;

        var self = this;
        cc.game.on(cc.game.EVENT_HIDE, function () {
            cc.game.setFrameRate(59);
            GameUtils.setFpsKeepUpdate();
            self.isFocusing = false;
            self.lastTimeHide = new Date().getTime();
            self.onLostFocus();
            var musicPlayer = MusicPlayer.default.getInstance();
            if (musicPlayer != null) {
                musicPlayer.onPlayMusic = false;
            }
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            cc.game.setFrameRate(60);
            GameUtils.setFpsCurrent();
            self.isFocusing = true;
            self.onFocus();
        });
    };

    GamePlayManager.prototype.onFocus = function () {
        var secondsHidden = (new Date().getTime() - this.lastTimeHide) / 1000;
        if (cc.sys.isMobile) {
            CardGameCommonRequest.default.getInstance().sendRefreshMoney();
        }
        if (this.onFocusCallback != null) {
            this.onFocusCallback(secondsHidden);
        }
        if (this.onFocusMiniGameCallback != null) {
            this.onFocusMiniGameCallback(secondsHidden);
        }
        this.lastTimeHide = 0;
    };

    GamePlayManager.prototype.onLostFocus = function () {
        if (this.onLostFocusCallback != null) {
            this.onLostFocusCallback();
        }
        if (this.onLostFocusMiniGameCallback != null) {
            this.onLostFocusMiniGameCallback();
        }
    };

    // ── Phát yêu cầu lên socket ────────────────────────────────────────────────────────────
    // Khung "Simms" giữ NGUYÊN XI bản gốc. Đã đối chiếu từng khung với bản bắt gói thật
    // C:\Go88Capture\captures\go88-tk2-20260919-204529.jsonl (xem chú thích từng hàm).

    GamePlayManager.prototype.sendData = function (data) {
        CardGameCommonRequest.default.getInstance().sendData(data);
    };

    GamePlayManager.prototype.getZoneName = function () {
        return CardGameCommonRequest.default.getInstance().getZoneName();
    };

    /**
     * Đặt chỗ trước ở bàn (Poker / Liêng / Xì Tố bấm chọn bàn) — TableCellRoomXocDia.js:174.
     * Bắt gói: [6,"Simms","channelPlugin",{"cmd":315,"rid":<rid>}]
     * Ba Cây không đi đường này (nó vào thẳng bằng joinRoom), nhưng cùng một tệp dùng chung.
     */
    GamePlayManager.prototype.bookRoom = function (rid, unusedArg, unusedPassword) {
        this.roomID = rid;
        this.timeInvite = Date.now();
        var frame = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, this.getZoneName(), 'channelPlugin', {
            cmd: MessageCardGameHandler.Global_Message.BOOK_ROOM,
            rid: rid
        }];
        this.sendData(JSON.stringify(frame));
    };

    /**
     * Vào bàn — RoomController.js:215, TableCellRoomXocDia.js:185 (cả hai gọi 3 tham số).
     * Bắt gói: [3,"Simms",180,""] — đúng 4 phần tử, phần tử cuối là mật khẩu bàn.
     * Nhánh 5 phần tử (thêm `true`) là đường "vào bàn có mật khẩu đã xác nhận" của bản gốc.
     */
    GamePlayManager.prototype.joinRoom = function (rid, unusedArg, password, isConfirmedPassword) {
        if (isConfirmedPassword === undefined) {
            isConfirmedPassword = false;
        }
        this.timeInvite = Date.now();
        this.roomID = rid;
        this.roomPassword = password;
        var frame;
        if (isConfirmedPassword) {
            frame = [MessageCardGameHandler.Message.MessageType.JoinRoom_Type, this.getZoneName(), rid, password, true];
        } else {
            frame = [MessageCardGameHandler.Message.MessageType.JoinRoom_Type, this.getZoneName(), rid, password];
        }
        this.sendData(JSON.stringify(frame));
    };

    /**
     * Vào bàn theo MÃ BÀN người chơi tự gõ — PopupJoinRoom.js:87.
     *
     * Khung 5 phần tử, khác kiểu với joinRoom ở chỗ mang thêm gid ở cuối:
     *     [8, zone, rid, pwd, gid]
     *
     * 🔴 gid ở đây là gid GIAO THỨC (Ba Cây = 15), tức `GamePlayManager.gameID`, KHÔNG phải mã
     * kế toán của backend. Chỗ gọi đã tự lấy đúng ô đó rồi truyền xuống.
     */
    GamePlayManager.prototype.joinRoomWithGameID = function (rid, password, gid) {
        this.timeInvite = Date.now();
        this.roomID = rid;
        this.roomPassword = password;
        // Tên hằng viết thường chữ j đầu là CỦA BẢN GỐC (MessageCardGameHandler.js:20), không
        // phải lỗi gõ. Viết hoa thành JoinRoom... thì nhận `undefined`, khung gửi đi có ô loại
        // rỗng và server không hiểu — im lặng, không lỗi nào.
        var frame = [MessageCardGameHandler.Message.MessageType.joinRoomWithGameID_Type, this.getZoneName(), rid, password, gid];
        this.sendData(JSON.stringify(frame));
    };

    /**
     * Vào bàn KÈM mua chip mang vào (Liêng / Xì Tố / Poker, sau khi đã đặt chỗ) —
     * BaseScene.js:465.
     * Khung 6 phần tử của bản gốc: [3, zone, rid, pwd, null, {m:<số chip>}].
     * Ba Cây không đi đường này (không có buy-in), nhưng dùng chung tệp với các game kia.
     */
    GamePlayManager.prototype.joinRoomAndBuyIn = function (rid, unusedArg, password, moneyBuyIn) {
        this.timeInvite = Date.now();
        this.roomID = rid;
        this.roomPassword = password;
        var frame = [MessageCardGameHandler.Message.MessageType.JoinRoom_Type, this.getZoneName(), rid, password, null, {
            m: moneyBuyIn
        }];
        this.sendData(JSON.stringify(frame));
    };

    /**
     * Bấm "Tạo bàn" ở sảnh: xin server trả về cấu hình tạo bàn — RoomController.js:231.
     * Bắt gói: [6,"Simms","channelPlugin",{"cmd":311,"gid":15,"aid":1}]
     */
    GamePlayManager.prototype.requestcreateRoomResponse = function (gid) {
        var frame = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, this.getZoneName(), 'channelPlugin', {
            cmd: MessageCardGameHandler.Global_Message.CREATE_TABLE_RESPONSE,
            gid: gid,
            aid: 1
        }];
        this.sendData(JSON.stringify(frame));
    };

    /**
     * Bấm "Chơi nhanh" — RoomController.js:217,220.
     * Bắt gói: [6,"Simms","channelPlugin",{"cmd":307,"aid":1,"gid":15,"inc":false}]
     */
    GamePlayManager.prototype.requestquickPlay = function (gid) {
        var frame = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, this.getZoneName(), 'channelPlugin', {
            cmd: MessageCardGameHandler.Global_Message.QUICK_PLAY,
            aid: 1,
            gid: gid,
            inc: false
        }];
        this.sendData(JSON.stringify(frame));
    };

    /**
     * "Chơi nhanh" có chọn sẵn mức cược (Liêng / Xì Tố / Poker) — RoomController.js:207.
     * Vẫn là cmd 307 y như bản gốc, chỉ thêm trường `b`. KHÔNG đổi sang 313 (QUICK_PLAY_WITH_BET)
     * dù hằng số đó có tồn tại — bản gốc không dùng nó.
     */
    GamePlayManager.prototype.requestquickPlayBet = function (gid, bet) {
        var frame = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, this.getZoneName(), 'channelPlugin', {
            cmd: MessageCardGameHandler.Global_Message.QUICK_PLAY,
            aid: 1,
            gid: gid,
            b: bet,
            inc: false
        }];
        this.sendData(JSON.stringify(frame));
    };

    /**
     * Tạo bàn thật sau khi chọn mức cược/số người — TableCellRoomXocDia.js:171 (gọi 3 tham số).
     * Bắt gói: [6,"Simms","channelPlugin",
     *           {"cmd":308,"aid":1,"gid":15,"b":1000,"Mu":9,"iJ":true,"inc":false,"pwd":""}]
     */
    GamePlayManager.prototype.requestcreateRoom = function (gid, bet, maxUser, password) {
        if (password === undefined) {
            password = '';
        }
        var frame = [MessageCardGameHandler.Message.MessageType.ZonePlugin_Type, this.getZoneName(), 'channelPlugin', {
            cmd: MessageCardGameHandler.Global_Message.CREATE_TABLE,
            aid: 1,
            gid: gid,
            b: bet,
            Mu: maxUser,
            iJ: true,
            inc: false,
            pwd: password
        }];
        this.sendData(JSON.stringify(frame));
    };

    // ── Tiện ích code đã bê gọi tới ────────────────────────────────────────────────────────

    /** BaCayController.js:1282, GameController.js:1070 — đang bảo trì thì rời bàn. */
    GamePlayManager.prototype.checkBaoTriGame = function () {
        return !!this.isserverKickOut;
    };

    /**
     * GameController.js:899 — gọi trong handleLeaveRoomResponse:
     * trả về true nghĩa là "server đá, đang dọn sạch, bỏ qua phần dọn bàn thông thường".
     *
     * Bản gốc Go88 còn xoá token/isAutoLogin trong localStorage rồi quay về màn Login, vì ở Go88
     * cả ứng dụng CHÍNH LÀ tài khoản. Ở Roy88 thì Ba Cây chỉ là một bundle: bị đá khỏi bàn bài
     * KHÔNG được đăng xuất người chơi khỏi Roy88. Nên chỉ đóng game và trả về sảnh Roy88.
     *
     * Hiện `isserverKickOut` chưa có ai bật (ở Go88 nó do màn Lobby bật khi nhận bản tin bảo trì —
     * màn đó không được bê), nên nhánh này tạm thời chưa chạy tới.
     */
    GamePlayManager.prototype.onLogOutKickUser = function () {
        if (!this.isserverKickOut) {
            return false;
        }
        CardGameCommonRequest.default.getInstance().sendLogout();
        this.isserverKickOut = false;
        cc.LobbyController.getInstance().destroyDynamicView(null);
        return true;
    };

    /** ChatInGamePopup.js:114 — Safari iOS đẩy bàn phím lên, popup chat phải bù chiều cao. */
    GamePlayManager.prototype.isWebMobileSafari = function () {
        return cc.sys.platform === cc.sys.MOBILE_BROWSER &&
            cc.sys.browserType === cc.sys.BROWSER_TYPE_SAFARI &&
            navigator.userAgent.indexOf('Safari') > -1 &&
            navigator.userAgent.indexOf('Chrome') <= -1 &&
            navigator.userAgent.indexOf('CriOS') <= -1;
    };

    /**
     * FgIDConfigManager.js:38 — sinh mã định danh thiết bị, dùng cho header X-FG-ID.
     * Bản gốc gọi thư viện fingerprint2 (thu thập canvas/font/WebGL để nhận diện máy).
     * 🔴 KHÔNG bê fingerprint2: đó là đồ theo dõi của hạ tầng Go88.
     * Dùng luôn nhánh dự phòng CỦA CHÍNH Go88 — GameUtils.getFakeFingerPrint() (chuỗi ngẫu nhiên
     * lưu localStorage, không gọi mạng). Giữ nguyên trình tự của bản gốc: đọc cache → chưa có
     * thì sinh → lưu lại.
     * (Header X-FG-ID cũng chỉ được gắn khi URL khớp fgIDConfig.pathInternals — danh sách đó
     * rỗng khi GameConfigManager không còn URL Go88.)
     */
    GamePlayManager.prototype.getFingerPrint = function () {
        this.fingerprint = cc.sys.localStorage.getItem('fingerprint');
        if (StringUtil.default.isNullOrEmpty(this.fingerprint)) {
            this.fingerprint = GameUtils.getFakeFingerPrint();
            cc.sys.localStorage.setItem('fingerprint', this.fingerprint);
        }
    };

    /**
     * BaseScene.js:554 — trước khi vào bàn, cảnh báo nếu mức cược của bàn quá lớn.
     * Giữ NGUYÊN XI luồng rẽ nhánh của bản gốc (GamePlayManager.js:1091 bản Go88):
     *   bet          mức cược của bàn
     *   gameId       để tra ngưỡng riêng theo game trong warningJoinRoomGameConfig
     *   skipWarning  BaseScene truyền !showWarning
     *   onEnough     việc phải làm khi được đi tiếp
     *
     * ⚠️ Hiện GameConfigManager chưa có `warningJoinRoomGameConfig`, nên đúng theo chính mạch
     * rẽ của bản gốc: cấu hình undefined ⇒ `a` giữ nguyên true ⇒ `bet < o || a` luôn đúng ⇒
     * gọi thẳng onEnough(), popup không bao giờ hiện. Không cắt nhánh popup đi, để ngày thêm
     * cấu hình vào là nó sống lại y như Go88.
     */
    GamePlayManager.prototype.checkMinMoney = function (bet, gameId, skipWarning, onEnough) {
        var config = GameConfigManager.default.getInstance().warningJoinRoomGameConfig;
        if (!config || config.isOn) {
            if (skipWarning && config && !config.isWarningWhenChooseRoom) {
                onEnough();
            } else {
                var threshold = 50000;
                var noThreshold = true;
                if (config && config.hasOwnProperty(gameId.toString())) {
                    threshold = config[gameId];
                    noThreshold = false;
                }
                if (bet < threshold || noThreshold) {
                    onEnough();
                } else {
                    var popup = CommonPrefabsManager.default.getInstance().showPopup2Button();
                    popup.setContent('B\xe0n c\xf3 tiền cược lớn ' +
                        StringUtil.default.formatMoneyNumber(bet) +
                        ', bạn chắc chắn bắt đầu chơi?');
                    popup.setTextOk('OK');
                    popup.onOKClicked = function (event) {
                        onEnough();
                        popup.hide();
                        event.target.getComponent(cc.Button).interactable = false;
                    };
                }
            }
        } else {
            onEnough();
        }
    };

    /** TableCellRoomXocDia.js:117,122 — nhớ bàn Xóc Đĩa nào đang chạy hiệu ứng nào. */
    GamePlayManager.prototype.setXocDiaIconBG = function (animName, rid) {
        this.xocdiaIconBG.set(animName, rid);
    };

    /**
     * PopupSetting.js:451 — ô gạt "Chỉ đăng nhập ứng dụng này" (chặn đăng nhập từ web).
     *
     * 🔴 CỐ Ý KHÔNG nối ra mạng. Bản gốc gọi API tài khoản của Go88; đó là một đường nữa có thể
     * mang token người chơi đi, và backend Cào Rùa không có khái niệm này. Hàng đó cũng không
     * bao giờ hiện ra (PopupSetting.js:422 đòi cc.sys.isNative, bản web luôn false), nên hàm
     * này chỉ tồn tại để popup không nổ lúc nạp nếu ai đó bật hàng lên.
     *
     * Giữ đúng giao kèo với chỗ gọi: KHÔNG đổi IsBlockLoginWeb, rồi gọi callback. Bên gọi so
     * lại `IsBlockLoginWeb != t` và tự bật ô gạt về trạng thái cũ — người chơi thấy nó bật lên
     * rồi trả về, tức "không làm được", đúng hơn là giả vờ đã lưu.
     */
    GamePlayManager.prototype.updateBlockLoginWeb = function (unusedValue, onDone) {
        if (typeof onDone === 'function') onDone();
    };

    // ── Điểm nối sang Roy88 ────────────────────────────────────────────────────────────────
    // Bốn trường dưới đây là accessor chứ không phải biến, để trong bàn bài và ngoài sảnh Roy88
    // luôn là MỘT nguồn sự thật. Code đã bê vừa đọc vừa ghi nên phải có đủ cả get lẫn set —
    // thiếu set thì phép gán trong chế độ strict sẽ ném lỗi.

    Object.defineProperty(GamePlayManager.prototype, 'gold', {
        // Đọc: HeaderUi.js:259,338,355,357,358 · GameController.js:1004 · RoomController.js:208
        get: function () {
            return cc.BalanceController.getInstance().getBalance();
        },
        // Ghi: GameController.js:342 (bản tin REFRESH_MONEY) và :1004 (bản tin đồng bộ tiền).
        // Theo đúng nếp sẵn có của Roy88 (xem PKInfoView.js:215-216): updateRealBalance đặt giá
        // trị thật + phát USER_UPDATE_COIN, updateBalance vẽ lại các ô hiển thị số dư.
        set: function (value) {
            cc.BalanceController.getInstance().updateRealBalance(value);
            cc.BalanceController.getInstance().updateBalance(value);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(GamePlayManager.prototype, 'displayName', {
        // Đọc: HeaderUi.js:256,384 · PlayerView.js:325 · CardGameCommonRequest.js:190
        get: function () {
            return cc.LoginController.getInstance().getNickname();
        },
        // Ghi: HeaderUi.js:669 (nhánh đăng nhập Facebook của Go88 — đã chết). Vẫn ghi ngược về
        // Roy88 thay vì nuốt im lặng, để không bao giờ có hai cái tên khác nhau.
        set: function (value) {
            cc.LoginController.getInstance().setNickname(value);
        },
        enumerable: true,
        configurable: true
    });

    // token CỐ Ý chỉ có get, không có set: không tệp nào trong bộ đã bê gán nó. Để chỉ-đọc thì
    // nếu sau này có đường nào định ghi đè token Roy88, nó sẽ nổ ngay và thấy được, thay vì âm
    // thầm đổi danh tính người chơi.
    Object.defineProperty(GamePlayManager.prototype, 'token', {
        // Đọc: HeaderUi.js:262,338,470 · CardGameCommonRequest.js:179 · BaseScene.js:220 —
        // đều chỉ để hỏi "đã đăng nhập chưa".
        get: function () {
            return cc.ServerConnector.getInstance().getToken();
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(GamePlayManager.prototype, 'userID', {
        // Đọc: BaCayController.js:336,371 · GameController.js:318,468 · PlayerView.js:394 —
        // luôn đem so bằng localeCompare, nên phải là CHUỖI. Roy88 giữ AccountID dạng số.
        //
        // Ghi: BaseScene.js:368 ← USER_INFO.uid. Đây mới là nguồn CHUẨN, y như Go88 (bản gốc
        // BaseScene dòng 382 gán đúng chỗ này) — vì số hiệu người chơi mà máy chủ bàn bài dùng
        // để đánh dấu từng ghế phải do chính máy chủ đó phát ra.
        //
        // Khi chưa nhận USER_INFO thì trả tạm số hiệu Roy88, chỉ để PlayerView.isMine() không
        // phải so với `undefined` trong khoảnh khắc đó. Backend của mình xác thực bằng token
        // Roy88 nên hai số này phải trùng; lệch nhau là dấu hiệu backend trả sai.
        get: function () {
            if (this._userIDFromServer !== undefined) {
                return this._userIDFromServer;
            }
            return String(cc.LoginController.getInstance().getUserId());
        },
        set: function (value) {
            this._userIDFromServer = value;
        },
        enumerable: true,
        configurable: true
    });

    return GamePlayManager;
})();

exports.default = GamePlayManager;
