/**
 * Created by Nofear on 3/15/2019.
 */
var netConfig = require('NetConfig');

(function () {
    cc.SettingView = cc.Class({
        "extends": cc.Component,
        properties: {
        },

        // use this for initialization
        onLoad: function () {
            cc.LobbyController.getInstance().setSettingView(this);
            this.node.zIndex = cc.NoteDepth.SETTING;
			// this.animation = this.node.getComponent(cc.Animation);
        },


        openSetting: function () {
            // Hien menu truc tiep, khong dung animation
            var seting = this.node.getChildByName('seting');
            seting.scale = 1;
            seting.active = true;
        },

        closeSetting: function () {
            this.node.getChildByName('seting').active = false;
        },

        // Optimistic: dọn dẹp đã chạy ngay ở confirmLogoutClicked -> server callback KHÔNG cần làm gì.
        onLogoutResponse: function () { /* no-op */ },

        _logoutCleanup: function () {
            // [TỐC ĐỘ #3+#5] Đặt loginState=false + xoá token TRƯỚC -> refreshAccountInfo (#5) tự bỏ qua,
            // tránh ~13 GetAccountInfo thừa (gọi với token null) dội ra khi destroy các view.
            cc.LoginController.getInstance().setLoginState(false);
            cc.ServerConnector.getInstance().setToken(null);
            cc.Tool.getInstance().setItem("@atn", null);

            cc.LobbyController.getInstance().resetTopBar();
            cc.BalanceController.getInstance().updateRealBalance(0);
            cc.BalanceController.getInstance().updateBalance(0);

            cc.LobbyController.getInstance().destroyAllMiniGameView();

            cc.HubController.getInstance().disconnectPortalHub();
            //disconnect hub tx
            cc.TaiXiuController.getInstance().disconnectAndLogout();
            //connect lai voi token = null (guest)
            cc.TaiXiuController.getInstance().connectHubTx();

            cc.PopupController.getInstance().closePopup();
            cc.LobbyController.getInstance().updateUILogin(true);
            //cc.LobbyController.getInstance().createLoginView();
            cc.LobbyController.getInstance().destroyAccountView();
            cc.LobbyController.getInstance().destroyShopView();

            cc.DDNA.getInstance().removeSessionId();
        },

        closeClicked: function () {
            this.closeSetting();
        },
        
        securityClicked: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createSecurityView(cc.AccountTab.SECURITY);
                this.closeSetting();
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'SETTING_SECURITY', cc.DDNAUIType.BUTTON);
                // if (cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
                //     cc.LobbyController.getInstance().createAccountView(cc.AccountTab.SAFE_PLUS);
                //     this.closeSetting();
                // } else {
                //     cc.LobbyController.getInstance().createAccountView(cc.AccountTab.SECURITY);
                //     this.closeSetting();
                //     cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'SETTING_SECURITY', cc.DDNAUIType.BUTTON);
                // }
            }
        },

        
        transactionHistoryClicked: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.GAME);
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'SETTING_HISTORY', cc.DDNAUIType.BUTTON);
                this.closeSetting();
            }
        },
        
        inboxClicked: function () {
            
        },
        
        hotlineClicked: function () {
            
        },
        
        logoutClicked: function () {
            this.closeSetting();
            this.showPopupLogout();
            cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'SETTING_LOGOUT', cc.DDNAUIType.BUTTON);
        },

        quickLogoutClicked: function () {
            this.showPopupLogout();
            cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'BACK', cc.DDNAUIType.BUTTON);
        },

        showPopupLogout: function () {
            var clickEventHandlerBlue = new cc.Component.EventHandler();
            clickEventHandlerBlue.target = this; //This node is the node to which your event handler code component belongs
            clickEventHandlerBlue.component = 'SettingView';//This is the code file name
            clickEventHandlerBlue.handler = 'confirmLogoutClicked';
            //clickEventHandlerBlue.customEventData = '';

            var clickEventHandlerRed = new cc.Component.EventHandler();
            clickEventHandlerRed.target = this; //This node is the node to which your event handler code component belongs
            clickEventHandlerRed.component = 'SettingView';//This is the code file name
            clickEventHandlerRed.handler = 'cancelLogoutClicked';

            cc.PopupController.getInstance().showPopup(
                'Bạn có chắc chắn muốn đăng xuất?',
                'HỦY',
                'CHẤP NHẬN',
                clickEventHandlerRed,
                clickEventHandlerBlue
            );
        },

        confirmLogoutClicked: function () {
            // [LOGOUT TỨC THÌ] Bug gốc (showLobbyAfterMinigame gọi checkLogin -> tự tạo login view) ĐÃ fix
            // (đổi sang getLoginState) -> optimistic giờ an toàn. Gọi Logout khi token CÒN hợp lệ (trước khi
            // _logoutCleanup xoá token) -> server trả 1, không -1001. Dọn + về sảnh guest NGAY, không chờ server.
            cc.PopupController.getInstance().closePopup();
            new cc.LogoutCommand().execute(this);   // gửi ngầm, token còn hợp lệ
            this._logoutCleanup();                    // dọn dẹp + về sảnh guest TỨC THÌ
        },

        cancelLogoutClicked: function () {
            cc.PopupController.getInstance().closePopup();
        },

        clickAudioBg: function() {
            cc.LobbyController.getInstance().setIsOnAudioBg();
        },

        clickHoTro: function() {
            cc.sys.openURL(cc.Config.getInstance().teleHotro());
        }

    });
}).call(this);
