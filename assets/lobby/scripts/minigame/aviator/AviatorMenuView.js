(function () {
    cc.AviatorMenuView = cc.Class({
        "extends": cc.Component,
        properties: {
            layoutMenu: cc.Node,
			nodeBtnHideMenu: cc.Node,
            arrow: cc.Node
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
            cc.AviatorPopupController.getInstance().createHelpView();
        },

        onClickTop: function () {
			this.onClickHideMenu();
            cc.AviatorPopupController.getInstance().createTopView();
        },

        onClickHistory: function () {
			this.onClickHideMenu();
            cc.AviatorPopupController.getInstance().createHistoryView();
        },

        onClickJackpot: function () {
			//this.onClickHideMenu();
            cc.AviatorPopupController.getInstance().createJpHistoryView();
        },

        onClickExit: function () {
            cc.LobbyController.getInstance().destroyDynamicView(null);
            cc.LobbyController.getInstance().offuserguest(true);
        },
		
        onClickSetting: function () {

        },			
		
    })
}).call();