/**
 * CommonPrefabsManager — LỚP GIẢ (shim) cho trục popup/loading dùng chung của Go88.
 *
 * 🔴 ĐÂY LÀ BẢN TẠM (v1). Chủ dự án đã CHỐT: popup phải là popup của Go88 — y hệt.
 *    Bản sau sẽ bê thẳng prefab popup của Go88 (Popup1Button, Popup2Button, PopupSetting,
 *    PopupUserTableInfo, PopupXepHangGame, PopupInvitePlayerRoom, PopupJoinRoom, PopupHelpImage…)
 *    rồi thay ruột từng hàm dưới đây. Viết sẵn theo hướng DỄ THAY:
 *      - Mỗi hàm public giữ ĐÚNG tên / đúng tham số / đúng kiểu giá trị trả về như bản gốc Go88
 *        (C:\Reverse\go88\assets\scripts\L00\CommonPrefabsManager.js) → thay ruột không phải sờ
 *        vào code game đã bê.
 *      - Phần nối tạm sang Roy88 gom hết vào 2 hàm riêng `_roy88()` và `_popupGia()` ở cuối tệp.
 *
 * Bản gốc Go88 là một cc.Component (getInstance trả về Instance gán trong onLoad). Ở đây dùng
 * singleton thuần theo hợp đồng LOP-GIA.md, vì lớp giả không gắn vào node nào.
 *
 * Danh sách thành viên dưới đây lấy từ CHỖ GỌI THẬT trong code đã bê
 * (grep -rn "CommonPrefabsManager" assets/lobby/scripts/go88/), không phải chép cả 120 hàm của Go88.
 */

'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

// Tiền tố log để lọc nhanh trong Console khi test.
var TAG = '[CommonPrefabsManager v1]';

// Bundle chứa các popup dùng chung cho cả họ game bài. Tên phải khớp `bundleName` trong
// assets/cardroom.meta VÀ cột deps của GameBundleConfig.js — lệch một chữ là getBundle() trả
// null, popup không mở mà chỉ có một dòng warn.
var BUNDLE_CHUNG = 'cardroom';

// = GameZOrder.TOP (GameZOrder.js:14). Ghi thẳng số thay vì require: tệp này là trục, kéo thêm
// require vào đây dễ tạo vòng. Bản gốc đặt popup ở đúng mức này.
var Z_TOP = 100;

// GameConfigManager nạp MUỘN. Tệp này là trục mà gần như mọi script đều require tới, nên nạp
// sớm ở đầu tệp là tự tạo vòng: bên kia sẽ nhận exports rỗng và `.default` là undefined.
var _cfgMod = null;
function _docCauHinh() {
    if (null === _cfgMod) {
        try {
            _cfgMod = require('GameConfigManager');
        } catch (loi) {
            return null;
        }
    }
    return _cfgMod && _cfgMod.default ? _cfgMod.default.getInstance() : null;
}

var _gpMod = null;
function _docNguoiChoi() {
    if (null === _gpMod) {
        try {
            _gpMod = require('GamePlayManager');
        } catch (loi) {
            return null;
        }
    }
    return _gpMod && _gpMod.default ? _gpMod.default.getInstance() : null;
}

var CommonPrefabsManager = (function () {

    function CommonPrefabsManager() {
        // Giống hệt Go88: chặn hiện lại Y NGUYÊN một nội dung thông báo hai lần liên tiếp.
        // Go88 reset biến này trong Popup1Button (lúc bấm OK / đóng / destroy) — ta reset trong
        // hide() của popup giả để không bị "lần 2 trả null" làm chết chuỗi .setHideCallback().
        this.oldCOntentThongBao = '';

        // Popup "X mời bạn vào bàn" được GIỮ LẠI giữa các lời mời để xếp hàng, không dựng mới
        // mỗi lần. Chính popup tự đặt lại ô này về null khi đóng — xem showPopupInviRoom.
        this.popupInveteJoinRoom = null;

        // Go88 tự tắt loading sau `timeout` giây (tham số thứ 3 của showLoading, mặc định 20).
        // Giữ lại vì đây là cái phanh chống kẹt vòng xoay khi backend không trả lời.
        this._loadingWatchdog = null;

        // Buy-in prefab, kept in memory so showPopupBuyIn can stay synchronous — its four
        // callers all read `popupBuyIn` on the very next statement. See showPopupBuyIn.
        this._buyInPrefab = null;
        this._buyInPreloading = false;
    }

    CommonPrefabsManager.getInstance = function () {
        if (!this._instance) {
            this._instance = new CommonPrefabsManager();
        }
        // Kick the preload on every call, not just on construction: the very first getInstance()
        // can land before BundleLoader has `cardroom` up, and then there would be no second
        // chance. Both guards inside make repeat calls free.
        this._instance._preloadBuyInPrefab();
        return this._instance;
    };

    // ---------------------------------------------------------------- LOADING

    /**
     * Go88: showLoading(big = false, keepExisting = false, timeout = 20)
     * - big            : vòng xoay to (che cả màn) hay nhỏ
     * - keepExisting   : false thì gọi hideLoading() trước (Go88 làm đúng vậy)
     * - timeout        : sau bấy nhiêu giây tự tắt
     * Gọi tại: MainGameViewModel:99,265 (showLoading(true)); HeaderUi:446; RoomController:204,229;
     *          TableCellRoomXocDia:170,175,184.
     */
    CommonPrefabsManager.prototype.showLoading = function (big, keepExisting, timeout) {
        if (big === undefined) { big = false; }
        if (keepExisting === undefined) { keepExisting = false; }
        if (timeout === undefined) { timeout = 20; }

        if (!keepExisting) {
            this.hideLoading();
        }

        var roy88 = this._roy88();
        if (!roy88) {
            cc.warn(TAG + ' showLoading: chưa có PopupView của Roy88 trong scene hiện tại.');
            return;
        }
        roy88.showBusy(big);

        // Phanh chống kẹt — đúng như Go88 làm bằng cc.sequence(delayTime, callFunc).
        //
        // 🔴 CHỐT CHỐNG BẤM HAI LẦN ĐƯỢC NHẢ Ở ĐÂY, trong callback hết giờ — KHÔNG phải trong
        // hideLoading(). Bản gốc làm đúng thứ tự này ở cả 4 biến thể showLoading
        // (CommonPrefabsManager.js:294, 306, 328, 372: đặt isShowPopupDone = false RỒI hideLoading).
        var self = this;
        this._loadingWatchdog = setTimeout(function () {
            self._loadingWatchdog = null;
            nhaChotBamNut();
            self.hideLoading();
        }, timeout * 1000);
    };

    /**
     * 🔴 THUẦN TUÝ — KHÔNG đụng vào isShowPopupDone. Bản gốc cũng vậy
     * (CommonPrefabsManager.js:377-381 chỉ gọi loadingUI.hide()).
     *
     * Trước đây lớp giả này nhả chốt ngay trong hideLoading, và vì showLoading() gọi
     * hideLoading() ngay ở đầu, chốt bị xoá ĐÚNG MỘT DÒNG sau khi được bật:
     *     isShowPopupDone = true;   // HeaderUi:444, RoomController:203, :228
     *     showLoading();            // → hideLoading() → nhả chốt luôn
     * Tức phanh chống bấm hai lần chết ở MỌI nút vào bàn mà không có một dòng lỗi nào.
     *
     * Các đường nhả chốt đúng: closePopup() bên dưới (bản gốc dòng 238) — được gọi ở
     * RoomController.onEnable:193 mỗi lần quay lại danh sách bàn — và callback hết giờ
     * 20 giây ở showLoading() bên trên.
     */
    CommonPrefabsManager.prototype.hideLoading = function () {
        if (this._loadingWatchdog) {
            clearTimeout(this._loadingWatchdog);
            this._loadingWatchdog = null;
        }
        var roy88 = this._roy88();
        if (roy88) {
            roy88.hideBusy();
        }
    };

    // ---------------------------------------------------------------- ĐÓNG POPUP

    /**
     * Go88: huỷ sạch mọi popup đang nằm trong arrayPopup. Gọi tại RoomController:193 closePopup(true).
     * Khác Go88: closePopup() của Roy88 tắt luôn cả vòng xoay loading (Go88 thì không). Chấp nhận
     * được vì cả hai chỗ gọi đều là lúc vừa vào phòng — sau đó mới showLoading().
     */
    CommonPrefabsManager.prototype.closePopup = function (doClose) {
        if (doClose === undefined) { doClose = true; }
        if (!doClose) { return; }

        this.oldCOntentThongBao = '';
        var roy88 = this._roy88();
        if (roy88) {
            roy88.closePopup();
        }
        nhaChotBamNut();   // bản gốc làm đúng ở đây (CommonPrefabsManager.js:238)
    };

    // ---------------------------------------------------------------- THÔNG BÁO

    /**
     * Go88: toast chữ nổi giữa màn (PopupMessageUtil). Tham số 2..5 là góc xoay / kiểu / node cha /
     * ép hiện — bản tạm chỉ dùng nội dung. Đây là hàm bị gọi nhiều nhất (≈20 chỗ).
     */
    CommonPrefabsManager.prototype.showPopupMessageUtil = function (content, angle, type, parentNode, force) {
        var roy88 = this._roy88();
        if (!roy88) {
            cc.warn(TAG + ' showPopupMessageUtil (không có PopupView): ' + content);
            return;
        }
        roy88.showMessage(content);
    };

    /**
     * Go88: popup 1 nút có tiêu đề. TRẢ VỀ component Popup1Button — BaCayController:1247 gọi tiếp
     * `.setHideCallback(fn)` ngay trên giá trị trả về, nên KHÔNG được trả null ở đây.
     * Go88 trả null khi nội dung trùng lần trước (oldCOntentThongBao) — giữ nguyên cái chặn trùng
     * đó, nhưng trả về popup giả "câm" thay vì null để không làm nổ chuỗi gọi.
     */
    CommonPrefabsManager.prototype.showPopupOneMessage = function (title, content, callback) {
        cc.log('%c[BẤM] showPopupOneMessage', 'color:#0a0;font-weight:bold', '· tham số:', title, content, callback);
        if (callback === undefined) { callback = null; }

        var trungNoiDung = (this.oldCOntentThongBao.localeCompare(content) === 0);
        var popup = this._popupGia('PopupOneMessage', trungNoiDung);
        if (trungNoiDung) {
            return popup;
        }

        popup.onOKCallback = callback;
        popup.lbTitle.string = title;

        // 🔴 CHỖ NÀY PHẢI LÀ POPUP CÓ NÚT, không phải toast trôi qua.
        //
        // Ở Go88 đây là popup chặn màn hình có nút OK, và `hideCallBack` chỉ chạy KHI NGƯỜI CHƠI
        // TỰ BẤM — chính cú bấm đó là bằng chứng "tôi còn ngồi đây", nên bộ đếm không-tương-tác
        // mới được đặt lại (BaCayController.js:1247-1251). Dùng toast thì `hide()` không bao giờ
        // chạy ⇒ bộ đếm không bao giờ về 0 ⇒ người chơi bị mời ra khỏi bàn ở ván thứ 8 mà chỉ
        // được cảnh báo bằng một dòng chữ trôi qua.
        //
        // Toàn bộ mã đã bê gọi hàm này ĐÚNG MỘT CHỖ (cảnh báo ngồi im), nên đổi sang popup thật
        // không ảnh hưởng đường nào khác.
        var daHienPopupThat = false;
        try {
            var pc = cc.PopupController.getInstance();
            var pv = pc && pc.popupView;
            if (pv && pv.buttonBlue && pv.buttonBlue.node) {
                var eh = new cc.Component.EventHandler();
                eh.target = pv;                 // đúng cách Roy88 tự dựng (PopupView.js:285-287)
                eh.component = 'PopupView';
                eh.handler = 'closePopup';
                pc.showPopupSimple(content, 'Đồng ý', eh);

                // Chạy hideCallBack khi người chơi bấm THẬT. Dùng `once` trên node nút thay vì
                // nhét thêm clickEvent, để không để lại rác trong mảng clickEvents của Roy88.
                var tuDong = popup;
                pv.buttonBlue.node.once(cc.Node.EventType.TOUCH_END, function () { tuDong.hide(); });
                daHienPopupThat = true;
            }
        } catch (e) {
            cc.warn(TAG + ' showPopupOneMessage: không dựng được popup của Roy88 — ' + e.message);
        }

        // Đường lui: thiếu PopupView thì vẫn hiện toast như trước, còn hơn im lặng.
        if (!daHienPopupThat) {
            popup.lbContent.string = content;
        }

        this.oldCOntentThongBao = content;
        return popup;
    };

    /**
     * Go88: popup 1 nút trắng. Gọi tại GameUtils:976 — chỗ đó gán `btnBackground.interactable`,
     * `nodeButton.width/height`, `lbOk.string`, `lbContent.string`, `onOKCallback` trên giá trị trả về.
     */
    CommonPrefabsManager.prototype.showPopup1Button = function () {
        return this._popupGia('Popup1Button', false);
    };

    /**
     * Go88: popup 2 nút (Đồng ý / Huỷ). Gọi tại CardGameTableController:321, GameController:762,
     * InGameBackPopup:123 — cả ba đều GÁN ĐÈ `onOKClicked` / `onCancelClicked` rồi gọi `hide()`,
     * `setContent()`, `setTextOk()`, hoặc gán thẳng `lbContent.string`.
     *
     * 🔴 HẠN CHẾ BẢN TẠM: Roy88 chỉ có toast 1 chiều nên KHÔNG có nút để bấm → `onOKClicked` /
     *    `onCancelClicked` sẽ không bao giờ chạy. Nội dung vẫn hiện ra cho người chơi đọc.
     *    Hậu quả đã biết (chấp nhận cho v1, bản Go88 thật sẽ hết):
     *      - GameController: chủ bàn bấm Bắt đầu khi còn người chưa sẵn sàng → lần 1 chỉ hiện chữ,
     *        bấm lần 2 mới thật sự bắt đầu (vì isHostSentStartWarningOtherNotReady đã bật).
     *      - CardGameTableController: lời mời "rủ thêm người" không gửi được.
     *      - InGameBackPopup: nút Báo quay không gửi được.
     */
    CommonPrefabsManager.prototype.showPopup2Button = function () {
        return this._popupGia('Popup2Button', false);
    };

    // ---------------------------------------------------------------- POPUP ĐẶC THÙ GO88 (chưa bê)

    // Những hàm dưới đây ở Go88 đều instantiate một prefab riêng. Bản tạm CHƯA có prefab nên để
    // rỗng + log rõ ràng. KHÔNG thay bằng popup Roy88 khác chức năng — làm vậy là tự vẽ luồng.

    /**
     * Go88: showPopupSetting(callbackClose = null, settingKey = ''). Gọi: RoomController:282,
     * InGameBackPopup:111, HeaderUi:465.
     *
     * Bản gốc lấy prefab từ `this.commonPrefabs.popupSetting` — một ô @property được gán sẵn
     * trong scene Login của Go88. Ta không bê scene đó nên nạp thẳng từ bundle dùng chung.
     * Phần còn lại giữ y bản gốc (CommonPrefabsManager.js:253-269): gắn vào lớp popup, zIndex
     * TOP, show() rồi mới gán callbackClose và setSettingKey.
     *
     * Bỏ có chủ ý một dòng cuối của bản gốc: `cc.systemEvent.emit(SbLiveState.LiveHide, …)` —
     * đó là tín hiệu tạm ẩn khung phát trực tiếp, chỉ các game Live của Go88 nghe, ta không bê.
     */
    CommonPrefabsManager.prototype.showPopupSetting = function (callbackClose, settingKey) {
        cc.log('%c[BẤM] showPopupSetting', 'color:#0a0;font-weight:bold', '· tham số:', callbackClose, settingKey);
        if (void 0 === callbackClose) callbackClose = null;
        if (void 0 === settingKey) settingKey = '';

        this._napPrefabTuBundle(BUNDLE_CHUNG, 'prefabs/PopupSetting_c88773a8', function (node) {
            var c = node.getComponent('PopupSetting');
            if (!c) {
                cc.warn(TAG + ' PopupSetting thiếu component PopupSetting');
                return;
            }
            if (typeof c.show === 'function') c.show();
            c.callbackClose = callbackClose;
            if (typeof c.setSettingKey === 'function') c.setSettingKey(settingKey);
        });
    };

    /**
     * Go88: showPopupPasscode / showPopupFAQRemote — hai nút của hàng "Mã khoá" trong bảng Cài
     * đặt. Hàng đó chỉ hiện khi `cc.sys.isNative && đang ở Lobby` (PopupSetting.js:422), mà
     * Cào Rùa chạy web nên không bao giờ chạm tới. Giữ hàm để PopupSetting không nổ lúc nạp.
     */
    CommonPrefabsManager.prototype.showPopupPasscode = function (callbackClose) {
        cc.log('%c[BẤM] showPopupPasscode', 'color:#0a0;font-weight:bold', '· tham số:', callbackClose);
        this._chuaBe('showPopupPasscode (hàng Mã khoá chỉ có ở bản native)');
    };

    CommonPrefabsManager.prototype.showPopupFAQRemote = function (loai) {
        cc.log('%c[BẤM] showPopupFAQRemote', 'color:#0a0;font-weight:bold', '· tham số:', loai);
        this._chuaBe('showPopupFAQRemote(' + loai + ') — cấu hình FAQ tải từ hạ tầng bản gốc');
    };

    /**
     * Go88: showPopupKetSat / showPopupMessageWithPositionUtil — thuộc cụm "két sắt" trong
     * PopupUserTableInfo. Cả cụm KHÔNG chạy với Cào Rùa: khung `rightUI` chỉ bật khi gameID nằm
     * trong [221, 9, 14] hoặc đang ở một màn Live (PopupUserTableInfo.js:105), mà gid Cào Rùa là
     * 15 và ta không bê màn Live nào. Giữ hàm để không nổ nếu ai đó mở cụm đó ra.
     *
     * 🔴 Nếu sau này thật sự cần két sắt thì phải viết lại bằng ví BettingGameCore, TUYỆT ĐỐI
     * không nối lại `paymentURLs.postSafeLoad` (PopupUserTableInfo.js:147) — đó là API thanh
     * toán của hạ tầng bản gốc.
     */
    CommonPrefabsManager.prototype.showPopupKetSat = function (moTruoc, soTien, callbackClose) {
        cc.log('%c[BẤM] showPopupKetSat', 'color:#0a0;font-weight:bold', '· tham số:', moTruoc, soTien, callbackClose);
        this._chuaBe('showPopupKetSat — Roy88 không có két sắt');
    };

    /** Go88: bản "message util" đặt ở vị trí khác, chỉ dùng cho màn Live. Dồn về popup thường. */
    CommonPrefabsManager.prototype.showPopupMessageWithPositionUtil = function (noiDung) {
        return this.showPopupMessageUtil(noiDung);
    };

    /**
     * Nạp một prefab nằm trong bundle rồi gắn vào lớp popup. Dùng chung cho mọi popup bê từ
     * bản gốc mà ta để trong bundle thay vì `resources`.
     *
     * 🔴 KHÔNG được coi bundle là "chắc chắn còn đó". `caorua` khai `deps: ['cardroom']` nên
     * BundleLoader nạp nó trước khi dựng game — NHƯNG BundleLoader còn có bộ thu gom rác tự
     * thả bundle rảnh sau 45 giây, và trước bản vá 2026-09-21 nó chỉ né đúng bundle GAME chứ
     * không né bundle PHỤ THUỘC. Ngồi trong bàn quá 45 giây là `cardroom` bị thả:
     *     [BundleLoader] GC: Releasing idle bundle "cardroom" (idle: 60s)
     * rồi mọi popup đều báo "Chưa tải xong dữ liệu".
     * Gốc đã vá ở BundleLoader.gcIdleBundles. Đây là lớp chắn thứ hai: thiếu thì TỰ NẠP LẠI
     * thay vì bó tay — người chơi thấy chậm một nhịp còn hơn là bấm không ra gì.
     */
    CommonPrefabsManager.prototype._napPrefabTuBundle = function (tenBundle, duong, khiXong) {
        var tuDong = this;
        var bundle = cc.assetManager.getBundle(tenBundle);

        if (!bundle) {
            cc.warn(TAG + ' bundle "' + tenBundle + '" không còn trong bộ nhớ (nhiều khả năng bị GC thả) — nạp lại rồi mở ' + duong);
            tuDong.showLoading();
            cc.assetManager.loadBundle(tenBundle, function (loi, bd) {
                tuDong.hideLoading();
                if (loi || !bd) {
                    cc.error(TAG + ' nạp lại bundle "' + tenBundle + '" THẤT BẠI: ' + (loi && loi.message ? loi.message : loi));
                    tuDong.showPopupMessageUtil('Chưa tải xong dữ liệu. Thử lại nhé!');
                    return;
                }
                cc.log(TAG + ' đã nạp lại bundle "' + tenBundle + '", mở tiếp ' + duong);
                tuDong._napPrefabTuBundle(tenBundle, duong, khiXong);
            });
            return;
        }

        cc.log(TAG + ' nạp prefab ' + tenBundle + '/' + duong);
        bundle.load(duong, cc.Prefab, function (loi, prefab) {
            if (loi || !prefab) {
                cc.error(TAG + ' không nạp được ' + tenBundle + '/' + duong + ': ' + (loi && loi.message ? loi.message : loi));
                tuDong.showPopupMessageUtil('Không mở được. Thử lại nhé!');
                return;
            }

            var cha = tuDong._lopPopup();
            if (!cha) {
                cc.warn(TAG + ' không tìm được lớp để gắn ' + duong);
                return;
            }

            var node = cc.instantiate(prefab);
            node.parent = cha;
            node.x = 0;
            node.y = 0;
            node.zIndex = tuDong._zTrenCung(cha);
            tuDong._ghiNhanGan(node, cha, duong);
            khiXong(node);
        });
    };

    /**
     * Go88: showPopupHelpImage(gameID, ...). Gọi: RoomController:270, InGameBackPopup:119.
     *
     * 🔴 ĐƯỜNG DẪN KHÔNG ĐOÁN THEO TÊN TỆP. Bản gốc (CommonPrefabsManager.js:784-900) có một
     * `switch (gameID)` 17 nhánh, LẶP LẠI Y HỆT ở cả hai nhánh hướng màn hình, và nhánh
     * `case GAME.BACAY` (= 15, đúng gid Cào Rùa) trỏ `"Help/PopupHelpBaCay"`. Vì hai hướng
     * cho cùng một tệp nên ở đây không cần rẽ theo hướng — nhưng đã KIỂM cả hai mới dám bỏ.
     *
     * Bỏ có chủ ý: nhánh FAQ từ xa (`popupFAQRemoteConfig`) — cấu hình tải từ hạ tầng Go88.
     */
    CommonPrefabsManager.prototype.showPopupHelpImage = function (gameID, arg2, arg3) {
        cc.log('%c[BẤM] showPopupHelpImage', 'color:#0a0;font-weight:bold', '· tham số:', gameID, arg2, arg3);
        var tuDong = this;
        var duong = 'Help/PopupHelpBaCay';

        cc.loader.loadRes(duong, cc.Prefab, function (loi, prefab) {
            if (loi || !prefab) {
                cc.warn(TAG + ' không nạp được ' + duong + ': ' + (loi && loi.message ? loi.message : loi));
                tuDong.showPopupMessageUtil('Không mở được hướng dẫn. Thử lại nhé!');
                return;
            }

            var cha = tuDong._lopPopup();
            if (!cha) {
                cc.warn(TAG + ' không tìm được lớp để gắn popup hướng dẫn');
                return;
            }

            var node = cc.instantiate(prefab);
            node.parent = cha;
            node.x = 0;
            node.y = 0;
            // 🔴 Trước đây thiếu hẳn dòng zIndex này, nên popup hướng dẫn nằm dưới cả các node
            // khác của view game — dựng ra nhưng không ai thấy.
            node.zIndex = tuDong._zTrenCung(cha);
            tuDong._ghiNhanGan(node, cha, duong);

            // Bản gốc gọi getComponent(PopupHelpImage).show(). Tra theo TÊN LỚP thay vì
            // require thẳng, để không kéo script vào tệp này chỉ vì một lời gọi.
            var c = node.getComponent('PopupHelpImage');
            if (c && typeof c.show === 'function') c.show();
            else cc.warn(TAG + ' PopupHelpBaCay thiếu component PopupHelpImage');
        });
    };

    /** Lớp để gắn popup: ưu tiên PopupLayer của Roy88, không có thì gắn thẳng vào Canvas. */
    /**
     * Node để gắn popup vào.
     *
     * 🔴 KHÔNG được dùng `Canvas/PopupLayer` của sảnh Roy88. Lớp đó là con THỨ HAI của Canvas
     * nên vẽ gần dưới cùng, trong khi view Cào Rùa là con của node LobbyView — nằm SAU trong
     * danh sách anh em nên vẽ ĐÈ LÊN. Kết quả: popup dựng ra đàng hoàng, không lỗi, không cảnh
     * báo, mà người chơi KHÔNG THẤY GÌ vì nó nằm dưới cả màn game.
     * Đo thật 2026-09-21: log có "[BẤM] showPopupSetting" và "nạp prefab …PopupSetting…" rồi
     * im hẳn — đúng kiểu hỏng im lặng khó nhất, vì mọi dấu hiệu đều báo thành công.
     *
     * Đúng ra phải gắn vào GỐC CỦA VIEW GAME (bản gốc Go88 gắn vào
     * `MiniGameNode.instance.popupNode`, cũng nằm trong cây của game). Lấy qua
     * `BaseScene.currentScene` — ô tĩnh mà chính onLoad của cảnh game gán.
     */
    CommonPrefabsManager.prototype._lopPopup = function () {
        var bs = null;
        try { bs = require('BaseScene'); } catch (loi) { bs = null; }
        var canh = bs && bs.default ? bs.default.currentScene : null;
        if (canh && canh.node && cc.isValid(canh.node)) return canh.node;

        // Chưa vào game (hoặc cảnh vừa bị huỷ) thì mới dùng lớp popup của sảnh.
        cc.warn(TAG + ' không có BaseScene.currentScene — gắn popup vào lớp của sảnh, có thể bị che');
        var l = cc.find('Canvas/PopupLayer');
        if (l) return l;
        return cc.Canvas.instance ? cc.Canvas.instance.node : null;
    };

    /**
     * zIndex đủ để popup nổi lên trên MỌI anh em hiện có trong `cha`.
     *
     * Ghi cứng 100 (GameZOrder.TOP) là không đủ: view game có thể đã có con dùng zIndex lớn hơn
     * (miniGameLayer của sảnh dùng tới 9999). Tính theo thực tế thì không phải đoán.
     */
    CommonPrefabsManager.prototype._zTrenCung = function (cha) {
        var max = Z_TOP;
        if (cha && cha.children) {
            for (var i = 0; i < cha.children.length; i++) {
                var z = cha.children[i].zIndex || 0;
                if (z > max) max = z;
            }
        }
        return max + 1;
    };

    /**
     * Ghi lại popup vừa gắn ở ĐÂU và trông ra sao.
     *
     * Kiểu hỏng khó nhất của popup là "dựng thành công mà không nhìn thấy" — mọi dấu hiệu đều
     * báo ổn. Nên log phải trả lời đủ: gắn vào node nào, thứ tự vẽ bao nhiêu, node có bật
     * không, to bao nhiêu, và nằm ở toạ độ màn hình nào.
     */
    CommonPrefabsManager.prototype._ghiNhanGan = function (node, cha, duong) {
        var wp = node.convertToWorldSpaceAR(cc.v2(0, 0));
        cc.log('%c[POPUP] ' + duong, 'color:#06c;font-weight:bold',
            '· cha="' + cha.name + '"',
            '· zIndex=' + node.zIndex + '/' + cha.children.length + ' anh em',
            '· active=' + node.active,
            '· cỡ=' + Math.round(node.width) + 'x' + Math.round(node.height),
            '· opacity=' + node.opacity,
            '· scale=' + node.scale,
            '· toạ độ màn hình=(' + Math.round(wp.x) + ',' + Math.round(wp.y) + ')');
    };

    /** Go88: showPopupXepHangGame(gameID, orientation, callbackClose). Gọi: RoomController:278, InGameBackPopup:133. */
    CommonPrefabsManager.prototype.showPopupXepHangGame = function (gameID, orientation, callbackClose) {
        cc.log('%c[BẤM] showPopupXepHangGame', 'color:#0a0;font-weight:bold', '· tham số:', gameID, orientation, callbackClose);
        // Bản gốc (CommonPrefabsManager.js:988-1023) rẽ hai nhánh theo hướng màn hình: dọc thì
        // nạp prefab _portrait từ resources, ngang thì dùng prefab gắn sẵn trong scene. Cào Rùa
        // chỉ chạy ngang nên chỉ bê nhánh ngang — bê cả hai là mang thêm một prefab không dùng.
        //
        // Giữ nguyên hai chốt đầu của bản gốc, cả hai đều thật sự có tác dụng:
        //   · isShowPopupDone đang bật ⇒ không mở (chống mở chồng popup khi đang vào bàn)
        //   · "bangxephang" trong listcommingSoonGames ⇒ hiện "sắp ra mắt"
        // Bỏ chốt isLoginWebccNoWallet: Roy88 không có kiểu đăng nhập đó, ô luôn false.
        var cfg = _docCauHinh();
        // Log chốt này vì nó THOÁT IM LẶNG: không có dòng nào thì người test chỉ thấy bấm mà
        // không ra gì, và đi tìm nhầm ở chỗ khác. isShowPopupDone kẹt bật là lỗi đã gặp thật.
        if (cfg && cfg.isShowPopupDone) {
            cc.warn(TAG + ' showPopupXepHangGame BỎ QUA: isShowPopupDone đang bật (chốt chống mở chồng popup)');
            return;
        }
        if (cfg && cfg.listcommingSoonGames && cfg.listcommingSoonGames.indexOf('bangxephang') >= 0) {
            this.showPopupMessageUtil('Tính năng sắp ra mắt');
            return;
        }

        this._napPrefabTuBundle(BUNDLE_CHUNG, 'prefabs/PopupXepHangGame_33870f75', function (node) {
            var c = node.getComponent('PopupXepHangGame');
            if (!c) {
                cc.warn(TAG + ' PopupXepHangGame thiếu component PopupXepHangGame');
                return;
            }
            // Thứ tự y bản gốc: init() TRƯỚC show(). init đặt gameId, mà show() dựa vào gameId
            // để chọn tab rồi mới gọi mạng — đảo lại là gọi với gameId chưa có.
            if (typeof c.init === 'function') c.init(gameID);
            if (typeof c.show === 'function') c.show();
            c.callBackClose = callbackClose || null;
        });
    };

    /** Go88: showPopupJoinRoom(). Gọi: RoomController:286 (nhập mã bàn để vào). */
    CommonPrefabsManager.prototype.showPopupJoinRoom = function () {
        cc.log('%c[BẤM] showPopupJoinRoom', 'color:#0a0;font-weight:bold');
        this._napPrefabTuBundle(BUNDLE_CHUNG, 'prefabs/PopupJoinRoom_d157a933', function (node) {
            var c = node.getComponent('PopupJoinRoom');
            if (c && typeof c.show === 'function') c.show();
            else cc.warn(TAG + ' PopupJoinRoom thiếu component PopupJoinRoom');
        });
    };

    /**
     * Go88: showPopupPasswordTable(). Gọi: TableCellRoomXocDia:182 (bàn có mật khẩu).
     *
     * Không nhận mã bàn — ĐÚNG như bản gốc. Popup đọc `GamePlayManager.roomID`, mà ô đó đã được
     * đặt ngay dòng đầu của chính chỗ gọi (TableCellRoomXocDia.js:168) trước khi mở popup.
     */
    CommonPrefabsManager.prototype.showPopupPasswordTable = function () {
        cc.log('%c[BẤM] showPopupPasswordTable', 'color:#0a0;font-weight:bold');
        this._napPrefabTuBundle(BUNDLE_CHUNG, 'prefabs/PopupPasswordTable_a40afa96', function (node) {
            var c = node.getComponent('PopupPasswordTable');
            if (c && typeof c.show === 'function') c.show();
            else cc.warn(TAG + ' PopupPasswordTable thiếu component PopupPasswordTable');
        });
    };

    /**
     * Go88: showPopupInviRoom(fromUser, roomInfo) — popup "X mời bạn vào bàn".
     * Gọi: GameController:369. Go88 trả về component hoặc undefined; chỗ gọi bỏ qua giá trị trả về.
     */
    CommonPrefabsManager.prototype.showPopupInviRoom = function (fromUser, roomInfo) {
        cc.log('%c[BẤM] showPopupInviRoom', 'color:#0a0;font-weight:bold', '· tham số:', fromUser, roomInfo);
        var cfg = _docCauHinh();
        // Người chơi đã bấm "Từ chối hết" thì bỏ qua — y bản gốc (dòng 748). Ghi log vì đây là
        // đường THOÁT IM LẶNG: nhìn từ ngoài giống hệt "lời mời không tới nơi".
        if (cfg && !cfg.IsReceiveInvite) {
            cc.warn(TAG + ' showPopupInviRoom BỎ QUA: người chơi đã tắt nhận lời mời');
            return;
        }

        // Hai chốt còn lại của bản gốc (CommonPrefabsManager.js:751-752), giữ nguyên ý:
        //   · không đủ tiền vào bàn đó thì đừng mời mọc — trừ bàn có nhiều hơn 1000 ghế
        //   · vừa vào bàn nào đó trong vòng 10 giây thì bỏ qua, tránh popup chồng lên nhau
        //     ngay lúc người chơi đang chuyển bàn
        var gp = _docNguoiChoi();
        if (gp && roomInfo) {
            var thieuTien = (gp.gold < roomInfo.mM || gp.gold < roomInfo.b) && roomInfo.Mu < 1000;
            var vuaVaoBan = (Date.now() - (gp.timeInvite || 0)) / 1000 < 10;
            if (thieuTien || vuaVaoBan) {
                cc.warn(TAG + ' showPopupInviRoom BỎ QUA: '
                    + (thieuTien ? 'không đủ tiền vào bàn đó (có ' + gp.gold + ', cần ' + roomInfo.mM + ')'
                                 : 'vừa vào bàn khác trong 10 giây'));
                return;
            }
        }

        // Bản gốc GIỮ LẠI một thể hiện và gọi showInvite nhiều lần — chính popup đó xếp các lời
        // mời vào `arrRoomDict` rồi cho lật qua lại. Dựng mới mỗi lần là mất hàng đợi đó: người
        // chơi nhận 3 lời mời sẽ thấy 3 popup chồng lên nhau.
        //
        // 🔴 Ô nhớ PHẢI tên `popupInveteJoinRoom` — sai chính tả "Invete" là CỦA BẢN GỐC. Chính
        // popup tự xoá ô này khi đóng (PopupInveteJoinRoom.js:168 và :240). Đặt tên khác thì ô
        // của ta không bao giờ được xoá, và lời mời kế tiếp gọi showInvite trên một component
        // đã bị huỷ — không có popup nào hiện ra nữa cho tới khi tải lại trang.
        if (this.popupInveteJoinRoom && this.popupInveteJoinRoom.isValid) {
            this.popupInveteJoinRoom.showInvite(fromUser, roomInfo);
            return;
        }

        var tuDong = this;
        this._napPrefabTuBundle(BUNDLE_CHUNG, 'prefabs/PopupInveteJoinRom_9b5e7978', function (node) {
            var c = node.getComponent('PopupInveteJoinRoom');
            if (!c) {
                cc.warn(TAG + ' PopupInveteJoinRom thiếu component PopupInveteJoinRoom');
                return;
            }
            tuDong.popupInveteJoinRoom = c;
            c.showInvite(fromUser, roomInfo);
        });
    };

    /**
     * Go88: showPopupUserTableInfo(name, money, avatarUrl, isMine, callbackClose = null).
     * Gọi: PlayerView:954 (bấm vào người chơi trong bàn). Chỗ gọi bỏ qua giá trị trả về.
     */
    CommonPrefabsManager.prototype.showPopupUserTableInfo = function (name, money, avatarUrl, isMine, callbackClose) {
        cc.log('%c[BẤM] showPopupUserTableInfo', 'color:#0a0;font-weight:bold', '· tham số:', name, money, avatarUrl);
        if (void 0 === isMine) isMine = false;
        if (void 0 === callbackClose) callbackClose = null;

        // Thứ tự Y BẢN GỐC (CommonPrefabsManager.js:639-641): show() TRƯỚC rồi mới loadUI() rồi
        // mới gán callbackClose. loadUI gọi sau show vì nó còn bật/tắt node theo dữ liệu, mà
        // show() đặt lại scale/opacity của cả khung.
        this._napPrefabTuBundle(BUNDLE_CHUNG, 'prefabs/PopupUserTableInfo_8148a5c5', function (node) {
            var c = node.getComponent('PopupUserTableInfo');
            if (!c) {
                cc.warn(TAG + ' PopupUserTableInfo thiếu component PopupUserTableInfo');
                return;
            }
            if (typeof c.show === 'function') c.show();
            if (typeof c.loadUI === 'function') c.loadUI(name, money, avatarUrl, isMine);
            c.callbackClose = callbackClose;
        });
    };

    // --- Nhóm dưới đây là popup của SẢNH Go88 (HeaderUi gọi tới). Ba Cây chạy trong sảnh Roy88 nên
    //     mấy nút này của Go88 không dùng đến, nhưng phải có hàm, thiếu là bấm nhầm chết im lặng.

    // ── Ba màn TIỀN/HỒ SƠ: cố ý KHÔNG bê của Go88, mà nối sang Roy88 ──────────────────
    //
    // 🔴 LÝ DO, và nó là lằn ranh đỏ của dự án: chỉ thị "hai anh em sinh đôi" áp cho GIAO DIỆN
    // GAME. Còn ví / hồ sơ / số điện thoại là NGHIỆP VỤ TIỀN của Roy88. Bê form bản gốc sang là mở
    // đúng con đường gửi token, số điện thoại và OTP của người chơi sang hạ tầng Go88 — thứ bị
    // cấm tuyệt đối. Nên ba hàm này dựng màn THẬT của Roy88, cái đang chạy và đang ra tiền.
    //
    // Mở được ngay TRONG cảnh game, không phải thoát về sảnh: Cào Rùa không phải cảnh riêng —
    // nó là view động gắn vào node của LobbyView (LobbyView.js:807-840 nhánh fallback), nên
    // `cc.LobbyController` vẫn sống, và view dựng sau có sibling index lớn hơn nên vẽ đè lên.
    //
    // GIỮ NGUYÊN CHỮ KÝ của Go88 ở cả ba hàm — HeaderUi đang truyền tham số thật vào.

    /** Gọi: HeaderUi:508 showPopupNap(tab, callback). */
    CommonPrefabsManager.prototype.showPopupNap = function (tab, callback) {
        cc.log('%c[BẤM] showPopupNap', 'color:#0a0;font-weight:bold', '· tham số:', tab, callback);
        // Tham số `tab` của Go88 (TAB_LAST_SELECTED_OR_DEFAULT) không ánh xạ được sang
        // cc.ShopTab — bỏ qua có chủ ý, chọn tab theo cấu hình của chính Roy88.
        try {
            var mac = cc.ShopController.getInstance().getChargeDefault();
            var tabRoy88 = mac === 'BANK' ? cc.ShopTab.BANK
                : mac === 'MOMO' ? cc.ShopTab.MOMO
                    : cc.ShopTab.TOPUP;

            cc.LobbyController.getInstance().createShopView(tabRoy88);
            if (callback) callback();
        } catch (e) {
            cc.warn(TAG + ' showPopupNap: không mở được màn nạp của Roy88 — ' + e.message);
            this.showPopupMessageUtil('Không mở được màn nạp. Thử lại nhé!');
        }
    };

    /** Gọi: HeaderUi:515 showPopupUserInfo(tab). */
    CommonPrefabsManager.prototype.showPopupUserInfo = function (tab) {
        cc.log('%c[BẤM] showPopupUserInfo', 'color:#0a0;font-weight:bold', '· tham số:', tab);
        try {
            cc.LobbyController.getInstance().createAccountView(cc.AccountTab.PROFILE);
        } catch (e) {
            cc.warn(TAG + ' showPopupUserInfo: không mở được hồ sơ Roy88 — ' + e.message);
            this.showPopupMessageUtil('Không mở được hồ sơ. Thử lại nhé!');
        }
    };

    /** Gọi: HeaderUi:476 showPopupMail(). */
    CommonPrefabsManager.prototype.showPopupMail = function () {
        cc.log('%c[BẤM] showPopupMail', 'color:#0a0;font-weight:bold');
        this._chuaBe('showPopupMail');
    };

    /**
     * Gọi: HeaderUi:521 showPopupActivePhoneNumber(nodeKickHoat).
     * Tham số `nodeKickHoat` là node nút bên Go88 (dùng để ẩn nút sau khi kích hoạt) —
     * màn Roy88 tự lo việc đó nên ở đây không dùng tới.
     */
    CommonPrefabsManager.prototype.showPopupActivePhoneNumber = function (nodeKickHoat) {
        cc.log('%c[BẤM] showPopupActivePhoneNumber', 'color:#0a0;font-weight:bold', '· tham số:', nodeKickHoat);
        try {
            cc.LobbyController.getInstance().createAccountView(cc.AccountTab.REG_PHONE);
        } catch (e) {
            cc.warn(TAG + ' showPopupActivePhoneNumber: không mở được màn SĐT Roy88 — ' + e.message);
            this.showPopupMessageUtil('Không mở được màn kích hoạt. Thử lại nhé!');
        }
    };

    /** Gọi: HeaderUi:501 showPopupChangeUserDisplayName(caller, hideCallback). */
    CommonPrefabsManager.prototype.showPopupChangeUserDisplayName = function (caller, hideCallback) {
        cc.log('%c[BẤM] showPopupChangeUserDisplayName', 'color:#0a0;font-weight:bold', '· tham số:', caller, hideCallback);
        this._chuaBe('showPopupChangeUserDisplayName');
    };

    /**
     * Gọi: HeaderUi:471,592 showPopupDangNhap(loginCallback, parentNode).
     * 🔴 Đăng nhập/đăng ký là của Roy88, TUYỆT ĐỐI không dựng lại form của Go88 ở đây — mọi đường
     *    gửi tài khoản/mật khẩu sang hạ tầng Go88 đều bị cấm. Để rỗng.
     */
    CommonPrefabsManager.prototype.showPopupDangNhap = function (loginCallback, parentNode) {
        cc.log('%c[BẤM] showPopupDangNhap', 'color:#0a0;font-weight:bold', '· tham số:', loginCallback, parentNode);
        this._chuaBe('showPopupDangNhap — đăng nhập do Roy88 lo, không dựng lại form bản gốc');
    };

    /** Gọi: HeaderUi:598 showPopupDangKy(loginCallback, parentNode). Lý do để rỗng: như showPopupDangNhap. */
    CommonPrefabsManager.prototype.showPopupDangKy = function (loginCallback, parentNode) {
        cc.log('%c[BẤM] showPopupDangKy', 'color:#0a0;font-weight:bold', '· tham số:', loginCallback, parentNode);
        this._chuaBe('showPopupDangKy — đăng ký do Roy88 lo, không dựng lại form bản gốc');
    };

    // ---------------------------------------------------------------- PHẦN NỐI TẠM SANG ROY88
    // Bản sau chỉ cần đập ba hàm dưới đây + phần ruột các hàm show* ở trên.

    /**
     * Lấy PopupController của Roy88, trả null nếu scene hiện tại không có PopupView.
     * Không phải "phòng thủ thừa": PopupView của Roy88 KHÔNG phải persist root node, nên khi Ba Cây
     * chạy ở một scene riêng thì popupView có thể chưa gán hoặc đã bị huỷ theo scene cũ.
     */
    CommonPrefabsManager.prototype._roy88 = function () {
        if (!cc.PopupController) { return null; }
        var pc = cc.PopupController.getInstance();
        if (!pc || !pc.popupView || !pc.popupView.isValid) { return null; }
        return pc;
    };

    /** Popup Go88 chưa bê — ghi log để biết còn thiếu cái gì, thay vì im lặng không làm gì. */
    CommonPrefabsManager.prototype._chuaBe = function (ten) {
        cc.warn(TAG + ' CHƯA BÊ popup bản gốc: ' + ten);
    };

    /**
     * Dựng "popup giả": một object có đủ thành viên mà code Go88 đã bê sờ tới trên giá trị trả về
     * của showPopup1Button / showPopup2Button / showPopupOneMessage. Gán vào `lbContent.string`
     * (hoặc gọi setContent) sẽ đẩy nội dung ra toast của Roy88.
     *
     * `cam` = true → popup câm (không hiện gì), dùng cho trường hợp Go88 chặn hiện trùng nội dung.
     */
    CommonPrefabsManager.prototype._popupGia = function (tenPopup, cam) {
        var manager = this;
        var p = {};

        // Hiện một lần duy nhất, hoãn sang tick sau: code Go88 gán lbContent rồi mới gán lbTitle /
        // gọi show(), thứ tự mỗi chỗ một khác — hoãn một nhịp thì lúc hiện đã có đủ nội dung.
        p._noiDung = '';
        p._daHen = false;
        p._daHien = false;
        p._hen = function () {
            if (cam || p._daHen) { return; }
            p._daHen = true;
            setTimeout(function () {
                p._daHien = true;
                if (p._noiDung) {
                    manager.showPopupMessageUtil(p._noiDung);
                } else {
                    cc.warn(TAG + ' ' + tenPopup + ' hiện ra mà không có nội dung.');
                }
            }, 0);
        };

        p.lbContent = nhanGia(function (v) { p._noiDung = v; p._hen(); });
        p.lbTitle = nhanGia(null);
        p.lbOk = nhanGia(null);   // Popup1Button đặt tên là lbOk
        p.lbOK = nhanGia(null);   // Popup2Button đặt tên là lbOK — giữ cả hai cho đúng bản gốc
        p.lbCancel = nhanGia(null);

        // Node/Button giả: GameUtils:977-979 gán interactable, width, height lên mấy cái này.
        p.nodeButton = { active: true, width: 0, height: 0, x: 0, y: 0 };
        p.btnBackground = { interactable: true, node: { active: true } };
        p.node = { active: true, x: 0, y: 0, zIndex: 0, angle: 0, scale: 1 };

        // Các callback mà code đã bê GÁN ĐÈ lên (ở Go88 chúng là method của prototype).
        p.onOKCallback = null;      // Popup1Button
        p.onOKClicked = null;       // Popup2Button
        p.onCancelClicked = null;   // Popup2Button
        p.okCallback = null;
        p.cancelCallback = null;
        p.hideCallBack = null;
        p.isCanClickClose = true;
        p.allowClickBackground = true;

        p.setTitle = function (t) { p.lbTitle.string = t; return p; };
        p.setContent = function (t) { p.lbContent.string = t; return p; };
        p.setTextOk = function (t) { p.lbOK.string = t; p.lbOk.string = t; return p; };
        p.setHideCallback = function (fn) { p.hideCallBack = fn; return p; };
        p.show = function () { p._hen(); return p; };

        p.hide = function () {
            // Go88 reset oldCOntentThongBao ở đúng chỗ này (Popup1Button.onOKClicked/onCloseClicked/
            // onDestroy) — giữ nguyên để thông báo giống hệt có thể hiện lại lần sau.
            manager.oldCOntentThongBao = '';
            if (p.hideCallBack) {
                var fn = p.hideCallBack;
                p.hideCallBack = null;
                fn(p);
            }
            return p;
        };
        p.hideTemporary = p.hide;

        return p;
    };

    return CommonPrefabsManager;
})();

/**
 * Nhãn giả: chỉ có thuộc tính `string`. Gán `string` thì gọi onSet để popup giả biết mà hiện ra —
 * đây là cách để `o.lbContent.string = "..."` của Go88 vẫn đẩy được chữ ra màn hình.
 */
function nhanGia(onSet) {
    var giaTri = '';
    var o = { node: { active: true, width: 0, height: 0 } };
    Object.defineProperty(o, 'string', {
        get: function () { return giaTri; },
        set: function (v) {
            giaTri = v;
            if (onSet) { onSet(v); }
        }
    });
    return o;
}


    // ── Bốn thành viên BaseScene.js gọi tới mà bản v1 còn thiếu ───────────────
    // Phát hiện bằng đối chiếu chéo giữa hai lớp giả: thiếu cái nào thì lỗi chỉ nổ ra ĐÚNG
    // LÚC người chơi bấm vào nhánh đó (tạo bàn, mạng yếu, buy-in) — tức là giữa ván.

    /**
     * Go88 hiện một icon "mạng yếu" nhỏ, KHÔNG chặn thao tác. Roy88 chưa có icon tương đương,
     * mà bật bánh xe chờ thì chặn cả màn hình — khác hẳn Go88. Nên tạm chỉ ghi log.
     * @param {number} soLan số lần thử lại
     * @param {number} thoiGian giây
     */
    CommonPrefabsManager.prototype.showLoadingNetwork = function (soLan, thoiGian) {
        cc.log('[caorua] mạng yếu: thử lại ' + soLan + ' lần trong ' + thoiGian + ' giây');
    };

    /**
     * Buy-in popup — how many chips the player carries to the table.
     * Original: CommonPrefabsManager.js:494-515. Callers: BaseScene.js:572 (clicked a table row),
     * LiengController.js:338, PokerController.js:1454, XiToController.js:1562.
     *
     * 🔴 THIS FUNCTION MUST FINISH SYNCHRONOUSLY. Every one of the four callers reads
     * `CommonPrefabsManager.getInstance().popupBuyIn` on the STATEMENT RIGHT AFTER the call —
     * BaseScene sets `.password.node.active`, the three game controllers assign `.onHandleBuyIn`.
     * Load the prefab asynchronously here and `popupBuyIn` is undefined for that statement, which
     * is a hard TypeError in BaseScene and a silently dead OK button in the three controllers.
     * The original got this for free: `commonPrefabs.prefabBuyIn` is an @property, so the prefab
     * was already in memory with the scene. The Roy88 equivalent of "in memory with the scene" is
     * "in memory with the bundle", which is what `_preloadBuyInPrefab` below arranges.
     *
     * Ba Cay never reaches this (MMBI = mMBI = 0 on the wire, so no buy-in step) — it is Lieng,
     * Poker and Xi To that need it. Until 2026-09-24 this was a stub that only logged, which is
     * why those three could not enter a table at all: no popup, no OK button, so the join frame
     * `[3, zone, rid, pwd, null, {m}]` was never sent. Nothing threw; the game just sat there.
     *
     * @param {number} maxBuyIn upper bound, wire field `MMBI`
     * @param {number} minBuyIn lower bound, wire field `mMBI`
     * @param {number} bet      table bet, used as the step between selectable amounts
     * @param {boolean} [autoJoin=false] true when the player clicked a table and still has to
     *                  join it, so OK must join AND buy in; false when already seated.
     */
    CommonPrefabsManager.prototype.showPopupBuyIn = function (maxBuyIn, minBuyIn, bet, autoJoin) {
        if (void 0 === autoJoin) autoJoin = false;
        cc.log('%c[BẤM] showPopupBuyIn', 'color:#0a0;font-weight:bold', '· tham số:', maxBuyIn, minBuyIn, bet, autoJoin);

        // Selectable amounts: min, then min + bet, + bet, … while <= max. Copied from the
        // original loop verbatim — note it is `<= maxBuyIn`, so max itself is offered only when
        // it lands exactly on the step grid. Do not "improve" this: the server validates the
        // amount and the grid is what Go88's own popup offers.
        var betList = [];
        betList.push(minBuyIn);
        for (var amount = minBuyIn + bet; amount <= maxBuyIn;) {
            betList.push(amount);
            amount += bet;
        }

        var prefab = this._getBuyInPrefab();
        if (!prefab) {
            // Cold path. Should be unreachable: _preloadBuyInPrefab() runs at getInstance() and
            // the popup cannot be asked for until a table row is clicked, which is at minimum one
            // network round-trip later. Shout, do not fail quietly — a silent stub here is exactly
            // what cost three games their entry for days.
            cc.error(TAG + ' popup buy-in CHƯA nạp xong prefab — không mở được. ' +
                'Kiểm prefabs/PopupBuyIn_4e0c736a có nằm trong bundle "' + BUNDLE_CHUNG + '" không.');
            this._preloadBuyInPrefab();
            this.showPopupMessageUtil('Chưa tải xong dữ liệu. Thử lại nhé!');
            return null;
        }

        // Original reuses the node while it is still valid. We cannot: CardPopupBase.hide()
        // destroys the node (isDestroyOnHide, see CardPopupBase.js:207) because Roy88 does not
        // port GamePlayManager.arrayPopup, the stack that used to own that lifetime. So a fresh
        // instance per open, and the isValid guard below still matters for a double open.
        if (!this.popupBuyIn || !this.popupBuyIn.isValid || !this.popupBuyIn.node || !this.popupBuyIn.node.isValid) {
            var parent = this._lopPopup();
            if (!parent) {
                cc.warn(TAG + ' không tìm được lớp để gắn popup buy-in');
                return null;
            }

            var node = cc.instantiate(prefab);
            node.parent = parent;
            node.x = 0;
            node.y = 0;
            node.zIndex = this._zTrenCung(parent);
            this._ghiNhanGan(node, parent, 'prefabs/PopupBuyIn_4e0c736a');

            var BuyInViewController = require('BuyInViewController');
            this.popupBuyIn = node.getComponent(BuyInViewController.default);
            if (!this.popupBuyIn) {
                cc.error(TAG + ' PopupBuyIn dựng được nhưng KHÔNG có component BuyInViewController — ' +
                    'prefab và script lệch uuid. Xem .meta của cả hai.');
                node.destroy();
                return null;
            }
        }

        // Order matters and is the original's: show() first, then loadData(). Reversed, show()
        // resets scale/opacity after loadData has already built the amount tiles.
        this.popupBuyIn.show();

        var player = _docNguoiChoi();
        if (this.popupBuyIn.lblMoney && player) {
            this.popupBuyIn.lblMoney.string = (player.gold || 0).toLocaleString();
        }
        this.popupBuyIn.loadData(
            betList,
            player ? player.roomID : undefined,
            player ? player.serverID : undefined,
            autoJoin);

        return this.popupBuyIn;
    };

    /**
     * Synchronous handle on the buy-in prefab, or null if it is not in memory yet.
     * `bundle.get()` is the synchronous half of the asset manager: it returns an asset only when
     * it has already been loaded, and never starts a load itself.
     */
    CommonPrefabsManager.prototype._getBuyInPrefab = function () {
        if (this._buyInPrefab && this._buyInPrefab.isValid) return this._buyInPrefab;

        var bundle = cc.assetManager.getBundle(BUNDLE_CHUNG);
        if (!bundle) return null;

        this._buyInPrefab = bundle.get('prefabs/PopupBuyIn_4e0c736a', cc.Prefab);
        return this._buyInPrefab || null;
    };

    /**
     * Pull the buy-in prefab into memory ahead of time, so showPopupBuyIn can stay synchronous.
     *
     * Called from getInstance(), i.e. as soon as any card game touches this shim — long before a
     * table row can be clicked. Safe to call repeatedly: bundle.load() de-duplicates, and the
     * isValid check above short-circuits once it is cached.
     *
     * 🔴 The prefab lives in `cardroom` and nothing references it by uuid, so no dependency graph
     * pulls it in. It is only ever reached through this string path — which is also why the
     * project's uuid-integrity scan reports zero broken references while this popup is broken.
     * It sat in the `phom` bundle until 2026-09-24; the loader only ever looks in BUNDLE_CHUNG,
     * so not even Phom itself could open it.
     */
    CommonPrefabsManager.prototype._preloadBuyInPrefab = function () {
        if (this._buyInPrefab && this._buyInPrefab.isValid) return;
        if (this._buyInPreloading) return;

        var bundle = cc.assetManager.getBundle(BUNDLE_CHUNG);
        if (!bundle) return;   // bundle not up yet; getInstance() will try again on the next game open

        var self = this;
        this._buyInPreloading = true;
        bundle.load('prefabs/PopupBuyIn_4e0c736a', cc.Prefab, function (err, prefab) {
            self._buyInPreloading = false;
            if (err || !prefab) {
                cc.error(TAG + ' nạp trước prefab buy-in THẤT BẠI: ' + (err && err.message ? err.message : err));
                return;
            }
            self._buyInPrefab = prefab;
            cc.log(TAG + ' đã nạp sẵn prefab buy-in');
        });
    };

    /**
     * Popup Tạo bàn (băng chọn mức cược + chọn số người + ô mật khẩu + nút TẠO).
     *
     * `danhSachMucCuoc` là mảng `b` của `cmd 311` — chỉ gồm mức cược người này ĐỦ TIỀN tạo,
     * do máy chủ lọc theo số dư. Client không tự bịa thêm mức nào.
     *
     * Thứ tự y bản gốc (CommonPrefabsManager.js:516-525): `show()` TRƯỚC rồi mới `loadData()`.
     * Đảo lại thì loadData dựng các ô mức cược xong mới bị show() đặt lại scale/opacity.
     */
    CommonPrefabsManager.prototype.showPopupTaoBan = function (danhSachMucCuoc) {
        cc.log('%c[BẤM] showPopupTaoBan', 'color:#0a0;font-weight:bold', '· tham số:', danhSachMucCuoc);

        this._napPrefabTuBundle(BUNDLE_CHUNG, 'prefabs/PopupTaoBan_5e414114', function (node) {
            var c = node.getComponent('TaoBanViewController');
            if (!c) {
                cc.warn(TAG + ' PopupTaoBan thiếu component TaoBanViewController');
                return;
            }
            if (typeof c.show === 'function') c.show();
            if (typeof c.loadData === 'function') c.loadData(danhSachMucCuoc);
        });
    };

    /** Lấy GameConfigManager mà không tạo phụ thuộc vòng lúc nạp module. */
    function GameConfigManagerCuaToi() {
        return require('GameConfigManager').default.getInstance();
    }

    /**
     * Nhả chốt chống bấm hai lần. Các nút Chơi nhanh / Tạo bàn bật `isShowPopupDone = true`
     * rồi chờ popup hoặc loading đóng lại mới nhả. Bản gốc Go88 nhả ở 5 chỗ trong chính lớp
     * này; thiếu là nút kẹt cứng.
     */
    function nhaChotBamNut() {
        GameConfigManagerCuaToi().isShowPopupDone = false;
    }

exports.default = CommonPrefabsManager;
