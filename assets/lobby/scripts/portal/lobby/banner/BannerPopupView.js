/**
 * BannerPopupView — popup banner hien ngay sau khi dang nhap.
 *
 * Ten cu la X2View, de trong thu muc x2/ nen nghe nhu su kien nap
 * X2. That ra no chi la khung popup cho banner quang cao: bam vao
 * thi mo man nap tien.
 *
 * Su kien X2 that la x2RewardView.prefab — co thanh tien do va nut
 * nhan thuong, goi api/X2Reward/* (api do da chet).
 */

(function () {
    cc.BannerPopupView = cc.Class({
        "extends": cc.Component,
        properties: {

        },

        onLoad: function () {
            this.node.zIndex =  cc.NoteDepth.POPUP_PORTAL;
            this.animation = this.node.getComponent(cc.Animation);
        },

        onEnable: function () {
            this.animation.play('openPopup');
        },

        cardClicked: function () {
            cc.LobbyController.getInstance().createShopView(cc.ShopTab.TOPUP);
            cc.LobbyController.getInstance().destroyBannerPopup();
        },

        momoClicked: function () {
            cc.LobbyController.getInstance().createShopView(cc.ShopTab.MOMO);
            cc.LobbyController.getInstance().destroyBannerPopup();
        },

        bankClicked: function () {
            cc.LobbyController.getInstance().createShopView(cc.ShopTab.BANK);
            cc.LobbyController.getInstance().destroyBannerPopup();
        },

        agencyClicked: function () {
            cc.LobbyController.getInstance().createShopView(cc.ShopTab.AGENCY);
            cc.LobbyController.getInstance().destroyBannerPopup();
        },

        helpClicked: function () {
            // He su kien 2019 da go 2026-08-27 (backend khong con controller).
            cc.PopupController.getInstance().showMessage('Sự kiện đã kết thúc.');
            cc.LobbyController.getInstance().destroyBannerPopup();
        },

        openEventClicked: function (event, index) {
            if (index) {
                if (cc.LoginController.getInstance().checkLogin()) {
                    cc.Tool.getInstance().setItem('@startTabEvent', index.toString());
                    // He su kien 2019 da go 2026-08-27 (backend khong con controller).
                    cc.PopupController.getInstance().showMessage('Sự kiện đã kết thúc.');
                    cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'EVENT_TOP_VP', cc.DDNAUIType.BUTTON);
                    this.closeFinished();
                }
            }
        },

        closeFinished: function () {
            //this.showRegister(false);
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.3;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.LobbyController.getInstance().destroyBannerPopup();
            }, this, 1, 0, delay, false);
        },
    });
}).call(this);
