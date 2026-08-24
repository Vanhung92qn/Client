(function () {
    cc.Xeng777MenuView = cc.Class({
        "extends": cc.Component,
        properties: {
			nodeMaxBet: cc.Node,
			nodeBtnHideMenu: cc.Node,
			nodeBtnHideMaxBet: cc.Node,
            prefabHelp: cc.Prefab,
			prefabRank: cc.Prefab,
			prefabHistory: cc.Prefab,
			prefabSoiCau: cc.Prefab,
            nodeMenu: cc.Node,
        },

        onLoad: function () {
            this.controller = cc.Xeng777Controller.getInstance();
			this.controller.setMenuView(this);
            this.isOpen = false;
            this.nodeMenu.active = this.isOpen;
        },

        onClickShowMenu: function () {
			this.nodeBtnHideMenu.active = true;
            cc.tween(this.layoutMenu)
                .to(0.3, { position: cc.v2(-680, this.layoutMenu.y) })
                .start();
        },

        onClickHideMenu: function () {
            // cc.tween(this.layoutMenu)
            //     .to(0.3, { position: cc.v2(-1000, this.layoutMenu.y) })
            //     .start();
			// this.nodeBtnHideMenu.active = false;
            this.onClickMenu();
        },

        onClickExit: function () {
            cc.LobbyController.getInstance().destroyDynamicView(cc.GameId.XENG_777);
        },

        onClickMenu: function() {
            this.isOpen = !this.isOpen;

            this.nodeMenu.active = this.isOpen;
        },

        onClickHistory: function () {
			this.onClickHideMenu();
			this.historyView = this.controller.createView(this.prefabHistory);
        },

        onClickRank: function () {
			this.onClickHideMenu();
			this.topView = this.controller.createView(this.prefabRank);
        },
		
        onClickSoiCau: function () {
			this.onClickHideMenu();
			this.soiCauView = this.controller.createView(this.prefabSoiCau);
        },
		
        onClickRule: function () {
			this.onClickHideMenu();
            this.helpView = this.controller.createView(this.prefabHelp);
        },

        onClickMaxBet: function () {
			this.onClickHideMenu();
			this.nodeBtnHideMaxBet.active = true;
            cc.tween(this.nodeMaxBet)
                .to(0.3, { position: cc.v2(-680, this.nodeMaxBet.y) })
                .start();
        },

        onClickHideMaxBet: function () {
            cc.tween(this.nodeMaxBet)
                .to(0.3, { position: cc.v2(-1050, this.nodeMaxBet.y) })
                .start();
			this.nodeBtnHideMaxBet.active = false;
        },
		
        onClickSetting: function () {

        },

        destroyHelpView: function () {
            if (this.helpView)
                this.helpView.destroy();
        },
		
        destroyTopView: function () {
            if (this.topView)
                this.topView.destroy();
        },

        destroyHistoryView: function () {
            if (this.historyView)
                this.historyView.destroy();
        },

        destroyGraphView: function () {
            if (this.soiCauView)
                this.soiCauView.destroy();
        },			
		
        onDestroy: function () {
            //cc.SicBoController.getInstance().setSicBoMenuView(null);
        },
    })
}).call();