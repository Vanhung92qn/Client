(function () {
    cc.PhoenixMenuView = cc.Class({
        "extends": cc.Component,
        properties: {
            layoutMenu: cc.Node,
			nodeBtnHideMenu: cc.Node,
            arrow: cc.Node,
            settingBar: cc.Node   // thanh cai dat (an san) - onClickSetting bat/tat
        },

        onClickShowMenu: function () {
			this.nodeBtnHideMenu.active = true;
            cc.tween(this.layoutMenu)
                .to(0.3, { position: cc.v2(-670, this.layoutMenu.y) })
                .start();
                cc.tween(this.arrow)
                .to(0.3, { scaleX: 1 })
                .start();
        },

        onClickHideMenu: function () {
            cc.tween(this.layoutMenu)
                .to(0.3, { position: cc.v2(-870, this.layoutMenu.y) })
                .start();
            cc.tween(this.arrow)
                .to(0.3, { scaleX: -1 })
                .start();
			this.nodeBtnHideMenu.active = false;
        },

        onClickHelp: function () {
			this.onClickHideMenu();
            cc.PhoenixPopupController.getInstance().createHelpView();
        },

        onClickTop: function () {
			this.onClickHideMenu();
            cc.PhoenixPopupController.getInstance().createTopView();
        },

        onClickHistory: function () {
			this.onClickHideMenu();
            cc.PhoenixPopupController.getInstance().createHistoryView();
        },

        // Nguoi trong phong (nguoi that dang ket noi + bot) - khop sunwin AviatorUserInRoomView.
        onClickUserInRoom: function () {
			this.onClickHideMenu();
            cc.PhoenixPopupController.getInstance().createUserInRoomView();
        },

        onClickJackpot: function () {
			//this.onClickHideMenu();
            cc.PhoenixPopupController.getInstance().createJpHistoryView();
        },

        onClickExit: function () {
            cc.LobbyController.getInstance().destroyDynamicView(null);
            cc.LobbyController.getInstance().offuserguest(true);
        },
		
        // Bat/tat THANH CAI DAT (side bar doc: am thanh / nhac nen / chat).
        // Truoc day ham nay RONG nen bam nut Cai dat khong ra gi.
        onClickSetting: function () {
            if (!this.settingBar) return;
            this.settingBar.active = !this.settingBar.active;
            if (this.settingBar.active) this.onClickHideMenu();
        },
		
    })
}).call();