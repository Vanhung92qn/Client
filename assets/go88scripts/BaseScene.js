'use strict';
/*
 * BaseScene — LỚP GIẢ (shim) thay cho lớp khung BaseScene của Go88.
 *
 * Đây KHÔNG phải singleton mà là LỚP CHA của cảnh game. Chuỗi kế thừa của Ba Cây:
 *      BaCayScene  ->  MainGameViewModel  ->  BaseScene  ->  cc.Component
 * nên tệp này phải là một cc.Component được đánh dấu @ccclass, đúng hình dạng mà
 * bộ trợ giúp __extends của hai lớp con đang trông đợi. Đổi hình dạng là lớp con gãy.
 *
 * Bề mặt phải hiện thực (mỗi mục đều truy được về một dòng gọi thật):
 *   - MainGameViewModel.js gọi ngược lên lớp cha:  onLoad, onFocus, onLostFocus,
 *     onTokenExpired, onReceiveMessage, onUserInfoRespone, resetTimeLostFocus,
 *     và đọc/ghi các trường  timeLostFocus, headerUi.
 *   - RoomController.js:198   gán  mainGameViewModel.headerUi
 *   - GameController.js:1007  đọc  mainGameViewModel.headerUi.updateUI()
 *   - GameController.js:282   đọc  BaseScene.default.currentSceneName  (tĩnh)
 *   - Các móc rỗng mà chính BaseScene gọi rồi lớp con đè lên: onGetListTableSuccess,
 *     onErrorMessage, onWSCardJoinRoom, onWSCardLeaveRoom, onUserInfoReponse, …
 *   - Tay cầm CHƠI NHANH / TẠO BÀN / ĐẶT CHỖ (onReceiveQuickPlay,
 *     onReceiveCreateRoomRespone, onBookRoomResponse, checkMinMoney): ở Go88 chúng nằm
 *     tại BaseScene chứ không nằm ở RoomController — RoomController chỉ PHÁT yêu cầu.
 *
 * 🔴 ĐÃ CẮT so với bản gốc Go88 (mọi mục đều là đường ra hạ tầng Go88 hoặc thứ Roy88 không có):
 *   1. verifyToken()      — gọi urlLoginVerifySession của Go88, mang theo session_id.
 *                           Roy88 tự quản phiên, để rỗng.
 *   2. updateLiveChatInhouseUrl() cuối onUserInfoRespone — nhét token vào URL live-chat
 *                           của Go88 rồi lưu localStorage. Cấm tuyệt đối.
 *   3. AnalyticService / ErrorLogHandler / ProfilerService — thống kê, log, cấu hình
 *                           máy chủ Go88.
 *   4. DownloadManager + checkDownloadSlot + preloadBanCa + checkIsKTek — tải bundle
 *                           slot/bắn cá của Go88 bằng hot-update native. Roy88 không dùng.
 *   5. WSMiniGamesHandle / WSXDGamesHandle / WSLodeSTMd5Handle / WSLiveGamesHandle —
 *                           Ba Cây chỉ dùng socket game bài.
 *   6. CanvasScene.onSizeChangeCallback — Roy88 đã có SafeArea + CanvasResizer lo việc này.
 *   7. MiniGameNode — nút mini game nổi của Go88, không bê sang.
 *   8. Chế độ "webcc no wallet" (isLoginWebccNoWallet) — Go88 chạy nhúng trong ví của
 *                           đối tác. Roy88 không chạy chế độ đó nên chỉ giữ nhánh thường.
 *   9. document.location.reload() vẫn GIỮ: đây là hành vi Go88 khi treo nền quá lâu, và
 *                           Roy88 cũng khởi động lại được từ URL. Ngưỡng nằm ở
 *                           GameConfigManager.reloadTime.
 *
 * Điểm nối sang Roy88: chuyển cảnh. Go88 dùng cc.director.loadScene; ở Roy88 Ba Cây là
 * một VIEW động trong sảnh, nên mọi lối "đi sang cảnh khác" quy về đóng view và trả người
 * chơi về sảnh Roy88 — xem openSceneGame().
 */


/**
 * Dựng singleton MusicPlayer nếu chưa có.
 *
 * 🔴 VÌ SAO CẦN: `MusicPlayer.Instance` chỉ được gán trong `onLoad()` của chính nó — tức ở Go88
 * nó là một component nằm sẵn trên node của CẢNH KHỞI ĐỘNG (Login.fire), mà cảnh đó không nằm
 * trong bộ bê. Không dựng thì `MusicPlayer.getInstance()` trả về null, và cú bấm ĐẦU TIÊN vào
 * bất kỳ nút nào cũng ném "Cannot read properties of null (reading 'playbtnClick')" — người chơi
 * bấm vào bàn là game đứng.
 *
 * Âm thanh nạp bằng `cc.loader.loadRes("Sounds/…")`, tức lấy từ thư mục `resources` của gói
 * chính; bộ tệp âm thanh của Go88 đã được bê sang nên đường này chạy thật.
 */
function baoDamMusicPlayer() {
    if (MusicPlayer.default.getInstance()) return;
    var node = new cc.Node('Go88MusicPlayer');
    node.parent = cc.director.getScene();
    node.addComponent(MusicPlayer.default);   // onLoad của nó tự gán Instance
}

/**
 * Chuyển hướng những lần Go88 đòi nạp CẢNH của riêng nó sang đường ra của Roy88.
 *
 * 🔴 VÌ SAO CẦN: ở Go88 mỗi game là một CẢNH, nên `HeaderUi.onclickBack` thoát game bằng
 * `cc.director.loadScene("LobbyNew")` (HeaderUi.js:447-449; tên cảnh ở GameDefine.js:59).
 * Roy88 không có cảnh nào tên đó — Ba Cây là view động trong sảnh. Engine chỉ in hai dòng đỏ
 * "not in the build settings" rồi thôi: nút Thoát bấm như hụt, KHÔNG có đường nào khác về sảnh,
 * người chơi phải tải lại cả client. `HeaderUi.js:695` nạp cảnh Login cũng chết y như vậy.
 *
 * Vá ở ĐÂY chứ không sửa HeaderUi.js, vì ba lẽ: giữ nguyên mã Go88 (luật của dự án), một chỗ
 * vá lo cho MỌI tệp Go88 gọi loadScene chứ không phải đuổi theo từng tệp, và `openSceneGame()`
 * bên dưới đã sẵn là đường ra đúng.
 *
 * Phạm vi cố ý HẸP: chỉ bắt đúng những tên cảnh của Go88. Cảnh thật của Roy88 vẫn nạp như cũ —
 * nới rộng ra là chặn nhầm đường chuyển cảnh của chính Roy88.
 */
function caiChuyenHuongCanh() {
    if (cc.director.__go88DaVaChuyenCanh) return;
    cc.director.__go88DaVaChuyenCanh = true;

    var ten = GameDefine.GameConfigs.SceneName;
    var canhGo88 = [ten.Lobby, ten.LobbyKTEK, ten.Login, ten.LoginKTEK, ten.NewScene];
    var laCanhGo88 = function (x) { return canhGo88.indexOf(x) >= 0; };

    var loadGoc = cc.director.loadScene.bind(cc.director);
    var preloadGoc = cc.director.preloadScene.bind(cc.director);

    cc.director.loadScene = function (tenCanh, onLaunched, onUnloaded) {
        if (!laCanhGo88(tenCanh)) return loadGoc(tenCanh, onLaunched, onUnloaded);
        CommonPrefabsManager.default.getInstance().hideLoading();
        CommonPrefabsManager.default.getInstance().closePopup(true);
        cc.LobbyController.getInstance().destroyDynamicView(null);
        return true;
    };

    // Go88 hay preload rồi mới load. Ở đây không có gì để nạp, nhưng PHẢI gọi lại callback —
    // thiếu thì vòng xoay chờ không bao giờ tắt và chốt chống bấm 2 lần không bao giờ nhả.
    cc.director.preloadScene = function (tenCanh, onProgress, onLoaded) {
        if (!laCanhGo88(tenCanh)) return preloadGoc(tenCanh, onProgress, onLoaded);
        var xong = typeof onProgress === 'function' && onLoaded === undefined ? onProgress : onLoaded;
        if (typeof xong === 'function') xong(null);
    };
}

var __extends = (this && this.__extends) || (function () {
    var setProto = function (d, b) {
        return (setProto = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var k in b) { if (b.hasOwnProperty(k)) { d[k] = b[k]; } } })(d, b);
    };
    return function (d, b) {
        function Ctor() { this.constructor = d; }
        setProto(d, b);
        d.prototype = null === b ? Object.create(b) : (Ctor.prototype = b.prototype, new Ctor());
    };
})();

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var d,
        argc = arguments.length,
        r = argc < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for (var i = decorators.length - 1; i >= 0; i--) {
            if (d = decorators[i]) {
                r = (argc < 3 ? d(r) : argc > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    if (argc > 3 && r) { Object.defineProperty(target, key, r); }
    return r;
};

Object.defineProperty(exports, "__esModule", { value: true });

var MessageCardGame = require("./MessageCardGameHandler");
var WSCardGameHandle = require("./WSCardGameHandle");
var GamePlayManager = require("./GamePlayManager");
var CommonPrefabsManager = require("./CommonPrefabsManager");
var GameConfigManager = require("./GameConfigManager");
var BroadCast = require("./BroadCast");
var HeaderUi = require("./HeaderUi");
var StringUtil = require("./StringUtil");
var GameDefine = require("./GameDefine");
var MusicPlayer = require("./MusicPlayer");
var NhatKy = require("./NhatKy");
var SessionDataModule = require("./SessionData");

var decorator = cc._decorator,
    ccclass = decorator.ccclass,
    property = decorator.property;

var BaseScene = (function (_super) {
    function BaseScene() {
        var self = (null !== _super && _super.apply(this, arguments)) || this;
        // Đang trong luồng chơi nhanh: BOOK_ROOM trả về thì vào bàn thẳng, không hỏi mua chip.
        self.isQuickPlay = false;
        // RoomController.walkUp() gán vào đây; GameController đọc ra để cập nhật thanh tiền.
        self.headerUi = null;
        // Số giây đã rời khỏi màn hình, MainGameViewModel.onFocus ghi vào.
        self.timeLostFocus = 0;
        // Chặn onTokenExpired chạy hai lần (socket và HTTP có thể cùng báo hết hạn).
        self.isCallExpireCallback = false;
        return self;
    }

    var BaseSceneRef;
    __extends(BaseScene, _super);
    BaseSceneRef = BaseScene;

    // ---------------------------------------------------------------- vòng đời

    BaseScene.prototype.onLoad = function () {
        GameConfigManager.default.getInstance().isShowPopupDone = false;

        // Go88 cho cảnh hiện dần trong 0,25 giây. Giữ nguyên để khớp cảm giác vào game.
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.25));

        // Nối socket game bài về các móc của cảnh. Lớp con đè lên móc nào thì móc đó chạy
        // bản của lớp con, vì bind() lấy theo chuỗi nguyên mẫu lúc chạy.
        NhatKy.cai();   // cài TRƯỚC mọi thứ khác để bắt được cả lỗi lúc dựng cảnh
        baoDamMusicPlayer();
        caiChuyenHuongCanh();

        var wsCard = WSCardGameHandle.default.getInstance();

        // 🔴 MỞ SOCKET Ở ĐÂY. Ở Go88, người gọi connectWS là LoadingScene.js — tệp đó KHÔNG
        // nằm trong bộ đã bê (nó thuộc khung khởi động của Go88, kéo theo cả cây hạ tầng).
        // Không có dòng này thì isNeedLogin mãi là false, socket không bao giờ mở, và game
        // đứng im ở màn danh sách bàn mà không báo một lỗi nào.
        if (!wsCard.isSocketOpen) {
            wsCard.connectWS(GameConfigManager.default.getInstance().getWsCardUrl());
        }

        wsCard.onReceiveMessage = this.onReceiveMessage.bind(this);
        wsCard.onLoginSuccess = this.onLoginCardSuccess.bind(this);
        wsCard.onLoginFail = this.onLoginCardFail.bind(this);
        wsCard.onJoinRoom = this.onWSCardJoinRoom.bind(this);
        wsCard.onLeaveRoom = this.onWSCardLeaveRoom.bind(this);
        wsCard.onPing = this.onWSCardPing.bind(this);
        wsCard.onclose = this.onWSCardClose.bind(this);
        wsCard.tokenExpireCallback = this.onTokenExpired.bind(this);

        var gamePlay = GamePlayManager.default.getInstance();
        gamePlay.onFocusCallback = this.onFocus.bind(this);
        gamePlay.onLostFocusCallback = this.onLostFocus.bind(this);

        // Vào lại bàn đang chơi dở. Máy chủ trả ô "lr" trong USER_INFO, onUserInfoRespone
        // cất vào reconnectData, tới đây mới thực sự vào bàn.
        if (null != gamePlay.reconnectData) {
            var reconnectRoomId = gamePlay.reconnectData.rid;
            var reconnectPassword = gamePlay.reconnectData.pwd;
            gamePlay.joinRoom(reconnectRoomId, 0, reconnectPassword, true);
            gamePlay.reconnectData = null;
        }

        // Vào bàn theo lời mời của người chơi khác.
        if (null != gamePlay.inviteData && void 0 != gamePlay.inviteData) {
            var inviteRoomId = gamePlay.roomID;
            var invitePassword = GameConfigManager.default.getInstance().roomPassword;
            gamePlay.inviteData = null;
            // Liêng / Xì Tố / Poker phải ĐẶT CHỖ trước rồi mới mua chip vào bàn.
            // Ba Cây không thuộc nhóm này nên đi nhánh vào thẳng.
            if (gamePlay.gameID === MessageCardGame.GAME.LIENG ||
                gamePlay.gameID === MessageCardGame.GAME.XITO ||
                gamePlay.gameID === MessageCardGame.GAME.POKER) {
                gamePlay.bookRoom(inviteRoomId, 0, "");
            } else {
                gamePlay.joinRoom(inviteRoomId, 0, invitePassword, true);
            }
        }

        this.isCallExpireCallback = false;
    };

    /*
     * KHÁC GO88 — bắt buộc.
     * Ở Go88, rời game là đổi cảnh nên toàn bộ callback trỏ vào cảnh cũ chết theo cảnh.
     * Ở Roy88, Ba Cây chỉ là một view bị huỷ còn WSCardGameHandle thì sống tiếp, nên nếu
     * không gỡ, một khung tin đến muộn sẽ gọi vào cc.Component đã huỷ và ném lỗi.
     * Chỉ gỡ đúng những callback do onLoad ở trên cắm vào.
     */
    BaseScene.prototype.onDestroy = function () {
        var wsCard = WSCardGameHandle.default.getInstance();
        wsCard.onReceiveMessage = null;
        wsCard.onLoginSuccess = null;
        wsCard.onLoginFail = null;
        wsCard.onJoinRoom = null;
        wsCard.onLeaveRoom = null;
        wsCard.onPing = null;
        wsCard.onclose = null;
        wsCard.tokenExpireCallback = null;

        var gamePlay = GamePlayManager.default.getInstance();
        gamePlay.onFocusCallback = null;
        gamePlay.onLostFocusCallback = null;
    };

    BaseScene.prototype.update = function (dt) {};

    // ------------------------------------------------- ẩn / hiện cửa sổ trình duyệt

    // Gọi từ GamePlayManager.onFocusCallback. secondsAway = số giây vừa rời khỏi màn hình.
    BaseScene.prototype.onFocus = function (secondsAway) {
        cc.systemEvent.emit(GameDefine.GameEventMessage.Focus, secondsAway);

        // Treo nền quá lâu thì nạp lại hẳn trang, y như Go88. Ngưỡng do máy chủ cấu hình.
        if (secondsAway >= GameConfigManager.default.getInstance().reloadTime) {
            if (cc.sys.platform === cc.sys.MOBILE_BROWSER || cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
                document.location.reload();
            }
        }

        if (null != MusicPlayer.default.getInstance()) {
            MusicPlayer.default.getInstance().isLostFocus = false;
        }

        // Go88 gọi verifyToken() ở đây. Đã cắt — xem ghi chú đầu tệp.

        var gamePlay = GamePlayManager.default.getInstance();
        var reconnectThreshold = 5;
        if (cc.sys.platform != cc.sys.MOBILE_BROWSER && cc.sys.platform != cc.sys.DESKTOP_BROWSER) {
            reconnectThreshold = 20;
        }
        this.timeLostFocus = secondsAway;

        if (secondsAway >= reconnectThreshold) {
            if (null == gamePlay.MessageLogOut) {
                // Rời màn hình đủ lâu thì socket coi như đã chết: đóng rồi đăng nhập lại.
                if (gamePlay.token.length > 0 && gamePlay.currentScene != GameDefine.GameConfigs.SceneName.Lobby) {
                    CommonPrefabsManager.default.getInstance().showLoadingNetwork(1, 5);
                    var wsCard = WSCardGameHandle.default.getInstance();
                    wsCard.isNeedLogin = true;
                    wsCard.isReconnect = true;
                    wsCard.closeSocket(false);
                }
            } else {
                // Máy chủ đã đá vì đăng nhập nơi khác — báo rồi trả về sảnh.
                var popup = CommonPrefabsManager.default.getInstance().showPopup1Button();
                popup.setContent("Bạn đ\xe3 đăng nhập tr\xean thiết bị kh\xe1c");
                popup.hideCallBack = function () {
                    this.openSceneGame(GameDefine.GameConfigs.SceneName.Login);
                }.bind(this);
            }
        }
    };

    BaseScene.prototype.onLostFocus = function () {
        if (null != MusicPlayer.default.getInstance()) {
            MusicPlayer.default.getInstance().isLostFocus = true;
        }
        this.resetTimeLostFocus();
    };

    BaseScene.prototype.resetTimeLostFocus = function () {
        this.timeLostFocus = 0;
    };

    // ------------------------------------------------------------------ hết phiên

    BaseScene.prototype.onTokenExpired = function () {
        if (this.isCallExpireCallback) {
            return;
        }
        this.isCallExpireCallback = true;

        var gamePlay = GamePlayManager.default.getInstance();
        var wsCard = WSCardGameHandle.default.getInstance();

        // Go88 còn xoá khoá "<enviromentName>session_id" trong localStorage. Đã cắt: phiên
        // là của Roy88, Roy88 tự quyết định khi nào xoá.
        gamePlay.session_id = "";
        wsCard.isReconnectOnClose = false;
        wsCard.isNeedLogin = false;
        SessionDataModule.SessionData.reset();

        var message;
        if (null == gamePlay.MessageLogOut) {
            message = "Phi\xean đăng nhập hết hạn, vui l\xf2ng đăng nhập lại!";
            wsCard.closeSocket(false);
        } else {
            // Máy chủ đã gửi lệnh đá — socket coi như đã đóng, không đóng lại nữa.
            message = "Bạn đ\xe3 đăng nhập tr\xean thiết bị kh\xe1c";
        }

        // Go88 đẩy việc này cho MiniGameNode (nút mini game toàn cục) xử lý. Roy88 không có
        // nút đó, nên dùng đúng popup của Go88 rồi đóng view trả về sảnh Roy88.
        var popup = CommonPrefabsManager.default.getInstance().showPopup1Button();
        popup.setContent(message);
        popup.hideCallBack = function () {
            this.openSceneGame(GameDefine.GameConfigs.SceneName.Login);
        }.bind(this);
    };

    // --------------------------------------------------------------- nhận khung tin

    // cmd: mã lệnh; raw: khung gốc; data: phần thân; applyGameConfig: có nuốt gC hay không.
    BaseScene.prototype.onReceiveMessage = function (cmd, raw, data, applyGameConfig) {
        if (void 0 === applyGameConfig) {
            applyGameConfig = true;
        }
        var gamePlay = GamePlayManager.default.getInstance();

        switch (cmd) {
            case MessageCardGame.Global_Message.GET_TABLES:
                this.onGetListTableSuccess(raw, data);
                break;

            case MessageCardGame.Global_Message.ERROR_MESSAGE:
                this.onErrorMessage(raw, data);
                if (this.isQuickPlay) {
                    this.isQuickPlay = false;
                    GameConfigManager.default.getInstance().isShowPopupDone = false;
                }
                break;

            case MessageCardGame.Global_Message.USER_INFO:
                this.onUserInfoRespone(data, applyGameConfig);
                break;

            case MessageCardGame.Global_Message.CREATE_TABLE_RESPONSE:
                this.onReceiveCreateRoomRespone(raw, data);
                break;

            case MessageCardGame.Global_Message.QUICK_PLAY:
            case MessageCardGame.Global_Message.QUICK_PLAY_WITH_BET:
                this.onReceiveQuickPlay(raw, data);
                break;

            case MessageCardGame.Global_Message.CREATE_TABLE:
                // Tạo bàn: bỏ qua bước kiểm tiền tối thiểu vì máy chủ đã chốt mức cược.
                this.onReceiveQuickPlay(raw, data, true);
                break;

            case MessageCardGame.Global_Message.BOOK_ROOM:
                var hasPassword = false;
                if (null !== data.hpwd && void 0 !== data.hpwd) {
                    hasPassword = data.hpwd;
                }
                gamePlay.minBuyIn = data.mMBI;
                gamePlay.maxBuyIn = data.MMBI;
                gamePlay.roomID = data.rid;
                gamePlay.serverID = data.sid;
                gamePlay.bet = data.b;
                this.onBookRoomResponse(data.tfb, data.rid, data.sid, data.mMBI, data.MMBI, data.b, hasPassword);
                break;

            case MessageCardGame.Global_Message.REFRESH_MONEY:
            case MessageCardGame.Global_Message.REFRESH_MONEY_SYN:
                var assets = data.As;
                gamePlay.vip = assets.vip;
                gamePlay.gold = assets.gold;
                gamePlay.chip = assets.chip;
                gamePlay.goldSafe = assets.safe;
                if (null !== this.headerUi && void 0 !== this.headerUi) {
                    this.headerUi.updateUI();
                }
                break;

            case MessageCardGame.Global_Message.FETCH_SETTING_ROOM:
                this.fetchSettingLobbyRoom(data);
                break;
        }
    };

    BaseScene.prototype.onUserInfoRespone = function (data, applyGameConfig) {
        if (void 0 === applyGameConfig) {
            applyGameConfig = true;
        }
        var gamePlay = GamePlayManager.default.getInstance();
        var assets = data.As;

        gamePlay.chip = assets.chip;
        gamePlay.gold = assets.gold;
        gamePlay.vip = assets.vip;

        /*
         * 🔴 BẮT BUỘC gán userID ở đây, đúng như bản gốc Go88 (BaseScene.js:382).
         *
         * PlayerView.isMine() so CHUỖI: `this.userID.localeCompare(GamePlayManager.userID)`.
         * Máy chủ bàn bài đánh dấu từng ghế bằng uid dạng "1_<số>", còn Roy88 giữ số hiệu
         * dạng số trần. Không gán thì accessor rơi về số hiệu Roy88, hai chuỗi không bao giờ
         * bằng nhau ⇒ isMine() LUÔN sai ⇒ người chơi không nhận ra bài của chính mình, không
         * lật được, và không có một dòng lỗi nào. (GamePlayManager shim có sẵn setter cho
         * đúng việc này — bản ghi chú cũ nói nó chỉ-đọc là nhầm.)
         */
        gamePlay.userID = data.uid;

        /*
         * Còn loginDict / customerID / uid / verified thì Go88 cất cho các màn khác của sảnh
         * Go88 dùng; bộ 74 tệp bê sang cho Ba Cây không đọc trường nào trong số đó.
         */

        // Ảnh đại diện: máy chủ không trả thì lấy cái người chơi đã chọn lần trước,
        // chưa có nữa thì về Avatar0. Tên ảnh là tên trong bộ atlas của Go88.
        if (StringUtil.default.isNullOrEmpty(data.a)) {
            var savedAvatar = cc.sys.localStorage.getItem(data.uid + "UserAvarta");
            if (StringUtil.default.isNullOrEmpty(savedAvatar)) {
                gamePlay.avaURL = "Avatar0";
            } else {
                gamePlay.avaURL = savedAvatar;
            }
        } else {
            if (StringUtil.default.isNullOrEmpty(gamePlay.avaURL)) {
                gamePlay.avaURL = data.a;
            }
        }

        BroadCast.default.listBroadCastMessage = data.bcm;
        this.onUserInfoReponse(data);

        // "lr" = bàn đang chơi dở của phiên trước.
        if (void 0 !== data.lr && null !== data.lr) {
            gamePlay.reconnectData = data.lr;
            if (gamePlay.currentScene == GameDefine.GameConfigs.SceneName.Lobby ||
                gamePlay.currentScene == GameDefine.GameConfigs.SceneName.Login) {
                this.openReconnectRoom(data.lr.gid);
            } else {
                // Đã đứng sẵn trong cảnh của game đó rồi thì vào bàn luôn.
                var reconnectRoomId = gamePlay.reconnectData.rid;
                var reconnectPassword = gamePlay.reconnectData.pwd;
                gamePlay.joinRoom(reconnectRoomId, 0, reconnectPassword);
                gamePlay.reconnectData = null;
            }
        }

        if (applyGameConfig) {
            var gameConfig = data.gC;
            if (null !== gameConfig && void 0 !== gameConfig && null !== gameConfig.sXD && void 0 !== gameConfig.sXD) {
                GameConfigManager.default.getInstance().useSocketXD = gameConfig.sXD;
            } else {
                GameConfigManager.default.getInstance().useSocketXD = false;
            }
        }

        // Go88 gọi updateLiveChatInhouseUrl() ở đây — nhét token vào URL live-chat của họ.
        // Đã cắt, xem ghi chú đầu tệp.
    };

    /*
     * Go88: nạp cảnh của game đang chơi dở, rồi onLoad của cảnh mới thấy reconnectData
     * khác null nên tự vào bàn.
     * Roy88: Ba Cây là view, không có cảnh nào để nạp — ta đã đứng sẵn trong view Ba Cây
     * rồi, nên làm luôn việc mà onLoad của cảnh mới sẽ làm.
     * Các game bài khác của Go88 chưa được bê sang nên không có chỗ vào lại: đóng view,
     * trả về sảnh Roy88 để Roy88 tự lo.
     */
    BaseScene.prototype.openReconnectRoom = function (gameId) {
        var gamePlay = GamePlayManager.default.getInstance();
        if (gameId === MessageCardGame.GAME.BACAY) {
            if (null != gamePlay.reconnectData) {
                var reconnectRoomId = gamePlay.reconnectData.rid;
                var reconnectPassword = gamePlay.reconnectData.pwd;
                gamePlay.joinRoom(reconnectRoomId, 0, reconnectPassword, true);
                gamePlay.reconnectData = null;
            }
            return;
        }
        cc.warn("openReconnectRoom: game " + gameId + " chua duoc be sang Roy88, ve sanh.");
        this.openSceneGame(GameDefine.GameConfigs.SceneName.Lobby);
    };

    // --------------------------------- CHƠI NHANH / TẠO BÀN / ĐẶT CHỖ (đáp của máy chủ)

    /*
     * Đáp của ĐẶT CHỖ. RoomController chỉ phát yêu cầu; chỗ xử lý đáp nằm ở đây.
     * minBuyIn/maxBuyIn/bet là của chính bàn vừa đặt.
     */
    BaseScene.prototype.onBookRoomResponse = function (tableFeeBack, roomId, serverId, minBuyIn, maxBuyIn, bet, hasPassword) {
        var gamePlay = GamePlayManager.default.getInstance();
        var gameId = gamePlay.gameID;

        if (gamePlay.gold < minBuyIn) {
            CommonPrefabsManager.default.getInstance().showPopupMessageUtil(
                "Bạn kh\xf4ng đủ tiền v\xe0o ph\xf2ng!");
            CommonPrefabsManager.default.getInstance().hideLoading();
            GameConfigManager.default.getInstance().isShowPopupDone = false;
            return;
        }

        if (this.isQuickPlay) {
            // Chơi nhanh: không hỏi, vào thẳng.
            this.isQuickPlay = false;
            if (gameId === MessageCardGame.GAME.LIENG ||
                gameId === MessageCardGame.GAME.XITO ||
                gameId === MessageCardGame.GAME.POKER) {
                gamePlay.joinRoomAndBuyIn(roomId, serverId, GameConfigManager.default.getInstance().roomPassword, minBuyIn);
            } else {
                gamePlay.joinRoom(roomId, serverId, GameConfigManager.default.getInstance().roomPassword);
            }
        } else {
            // Người chơi tự bấm vào bàn: hiện popup chọn số chip mang vào.
            CommonPrefabsManager.default.getInstance().hideLoading();
            GameConfigManager.default.getInstance().isShowPopupDone = false;
            CommonPrefabsManager.default.getInstance().showPopupBuyIn(maxBuyIn, minBuyIn, bet, true);
            if (hasPassword) {
                CommonPrefabsManager.default.getInstance().popupBuyIn.password.node.active = true;
            }
        }
    };

    // Đáp của TẠO BÀN: data.b là danh sách mức cược mà người chơi đủ tiền tạo.
    BaseScene.prototype.onReceiveCreateRoomRespone = function (raw, data) {
        CommonPrefabsManager.default.getInstance().hideLoading();
        var listBet = data.b;
        if (listBet.length > 0) {
            CommonPrefabsManager.default.getInstance().showPopupTaoBan(listBet);
        } else {
            GameConfigManager.default.getInstance().isShowPopupDone = false;
            CommonPrefabsManager.default.getInstance().showPopupMessageUtil(
                "Bạn kh\xf4ng đủ tiền tạo b\xe0n chơi!");
        }
    };

    // Đáp của CHƠI NHANH (và TẠO BÀN). data.ri là bàn máy chủ chọn giúp.
    BaseScene.prototype.onReceiveQuickPlay = function (raw, data, isCreateTable) {
        var self = this;
        if (void 0 === isCreateTable) {
            isCreateTable = false;
        }

        if (null !== data.ri && void 0 !== data.ri) {
            var roomInfo = data.ri;
            var roomId = roomInfo.rid;
            var bet = roomInfo.b;
            var serverId = roomInfo.sid;
            var gameId = roomInfo.gid;
            var password = "";
            if (null !== roomInfo.pwd && void 0 !== roomInfo.pwd) {
                password = roomInfo.pwd;
            }

            GameConfigManager.default.getInstance().bet = bet;
            GameConfigManager.default.getInstance().isShowPopupDone = false;

            if (gameId === MessageCardGame.GAME.LIENG ||
                gameId === MessageCardGame.GAME.XITO ||
                gameId === MessageCardGame.GAME.POKER) {
                // Nhóm phải đặt chỗ: xin chỗ trước, đáp sẽ rơi vào onBookRoomResponse.
                this.checkMinMoney(bet, gameId, isCreateTable, true, function () {
                    var moneyBuyIn = roomInfo.MMBI;
                    GameConfigManager.default.getInstance().moneyBuyIn = moneyBuyIn;
                    GameConfigManager.default.getInstance().roomPassword = password;
                    if (moneyBuyIn > GamePlayManager.default.getInstance().gold) {
                        GameConfigManager.default.getInstance().moneyBuyIn = GamePlayManager.default.getInstance().gold;
                    }
                    self.isQuickPlay = true;
                    GamePlayManager.default.getInstance().bookRoom(roomId, serverId, password);
                });
            } else {
                // Ba Cây đi nhánh này: vào bàn thẳng.
                this.checkMinMoney(bet, gameId, isCreateTable, true, function () {
                    GamePlayManager.default.getInstance().joinRoom(roomId, serverId, password);
                });
            }

            GameConfigManager.default.getInstance().autoBuyIn = false;
        } else {
            GameConfigManager.default.getInstance().isShowPopupDone = false;
            CommonPrefabsManager.default.getInstance().hideLoading();
            if (null !== data.mgs && void 0 !== data.mgs) {
                CommonPrefabsManager.default.getInstance().showPopupMessageUtil(data.mgs);
                return;
            }
            CommonPrefabsManager.default.getInstance().showPopupMessageUtil(
                "Kh\xf4ng t\xecm thấy ph\xf2ng th\xedch hợp!");
        }
    };

    // skipCheck = true (luồng TẠO BÀN) thì chạy thẳng, vì mức cược đã do máy chủ chốt.
    BaseScene.prototype.checkMinMoney = function (bet, gameId, skipCheck, showWarning, onEnough) {
        CommonPrefabsManager.default.getInstance().hideLoading();
        if (skipCheck) {
            onEnough();
        } else {
            GamePlayManager.default.getInstance().checkMinMoney(bet, gameId, !showWarning, onEnough);
        }
    };

    // ------------------------------------------------------------------ chuyển cảnh

    /*
     * Go88: preloadScene rồi loadScene, kèm cả tải bundle. Roy88: Ba Cây là view động
     * trong sảnh, không có cảnh nào để nạp, nên mọi lời gọi ở đây đều có nghĩa "rời Ba Cây"
     * — đóng view và trả người chơi về sảnh Roy88. Giữ nguyên chữ ký 4 tham số của Go88 để
     * lớp con gọi kiểu nào cũng không gãy.
     */
    BaseScene.prototype.openSceneGame = function (sceneName, parentNode, isRetry, forceLoad) {
        CommonPrefabsManager.default.getInstance().hideLoading();
        CommonPrefabsManager.default.getInstance().closePopup(true);
        cc.LobbyController.getInstance().destroyDynamicView(null);
    };

    // ------------------------------------------------- móc rỗng cho lớp con đè lên

    BaseScene.prototype.onGetListTableSuccess = function (raw, data) {};
    BaseScene.prototype.onErrorMessage = function (raw, data) {};
    BaseScene.prototype.onUserInfoReponse = function (data) {};
    BaseScene.prototype.fetchSettingLobbyRoom = function (data) {};
    BaseScene.prototype.onWSCardJoinRoom = function (message) {};
    BaseScene.prototype.onWSCardLeaveRoom = function (message) {};
    BaseScene.prototype.onWSCardPing = function (message) {};
    BaseScene.prototype.onWSCardClose = function () {};
    BaseScene.prototype.onLoginCardSuccess = function (message) {};
    BaseScene.prototype.onLoginCardFail = function () {};

    /*
     * Tĩnh. GameController.js:282 đọc giá trị này, nhưng chỉ trong nhánh môi trường "pre"
     * của Go88 nên ở Roy88 không bao giờ chạy tới. Ở Go88 nó được gán trong openSceneGame;
     * ở đây openSceneGame nghĩa là RỜI game nên không gán, giữ đúng giá trị khởi tạo "".
     * Phép so sánh tại chỗ đọc ra kết quả y hệt Go88 (khác tên cảnh Bầu Cua).
     */
    BaseScene.currentSceneName = "";

    __decorate([property(HeaderUi.default)], BaseScene.prototype, "headerUi", void 0);
    return BaseScene = BaseSceneRef = __decorate([ccclass], BaseScene);
})(cc.Component);

exports.default = BaseScene;
