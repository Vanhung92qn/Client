/**
 * Created by Nofear on 7/14/2017.
 */

(function () {
    cc.BannerView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeBanner: cc.Node,
            nodeBanner2: cc.Node,
            nodeBanner3: cc.Node,
        },

        onLoad: function () {
            cc.BannerController.getInstance().setBannerView(this);
            this.setupBanners();
            this.scrollPageView = this.node.getComponent(cc.AutoScrollPageView);
            this.scrollPageView.getTotalPage();
        },

        // Chi hien cac banner DA GAN (nodeBanner/2/3). Trang khong ung voi banner nao -> xoa.
        // => keo vao 1 cai thi hien 1 cai. Khong gan cai nao thi GIU NGUYEN (an toan).
        setupBanners: function () {
            var pageView = this.node.getComponent(cc.PageView);
            if (!pageView || !pageView.content) return;
            var content = pageView.content;
            var assigned = [this.nodeBanner, this.nodeBanner2, this.nodeBanner3].filter(function (n) { return n && n.isValid; });
            if (assigned.length === 0) return;
            // Tim "trang" (con truc tiep cua content) chua banner da gan.
            function pageOf(node) { var n = node; while (n && n.parent && n.parent !== content) { n = n.parent; } return (n && n.parent === content) ? n : null; }
            var keep = [];
            assigned.forEach(function (b) { var p = pageOf(b); if (p && keep.indexOf(p) < 0) keep.push(p); });
            if (keep.length === 0) return;
            content.children.slice().forEach(function (p) { if (keep.indexOf(p) < 0) pageView.removePage(p); });
        },

        switchPage: function () {
            this.scrollPageView.switchPage();
        },

        openMomoTopupClicked: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createShopView(cc.ShopTab.MOMO);
            }
        },

        openAppSafeHelpClicked: function () {
            cc.LobbyController.getInstance().createAppSafeHelpView();
        },

        openDNSHelp:function(){
            cc.LobbyController.getInstance().createDNSHelpView();    
        },

        openUpdateAccount:function(){
            cc.LobbyController.getInstance().createUpdateAccountView();    
        },

        openMoveBB:function(){
            cc.LobbyController.getInstance().createMoveBBView();    
        },

        openUrlClicked: function (event, data) {
            if (data) {
                cc.sys.openURL(data.toString());
            }
        },

        openEventClicked: function (event, index) {
            if (index) {
                if (cc.LoginController.getInstance().checkLogin()) {
                    cc.Tool.getInstance().setItem('@startTabEvent', index.toString());
                    // He su kien 2019 da go 2026-08-27 (backend khong con controller).
                    cc.PopupController.getInstance().showMessage('Sự kiện đã kết thúc.');
                }
            }
        },

        openTreasureClicked: function () {
            cc.TreasureController.getInstance().openTreasure();
        },
    });

}).call(this);