/**
 * Created by Nofear on 3/15/2019.
 */

cc.AviatorJpHistoryView = cc.Class({
    "extends": cc.PopupBase,
    properties: {
        listItems: cc.Node,
        lblPage: cc.Label,	
        btnNext: cc.Button,
        btnPrev: cc.Button,
    },

    onLoad: function () {
        this.animation = this.node.getComponent(cc.Animation);
        this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
        this.listItems.children.forEach(function (e) {
            e.active = false;
        });
        this.maxItems = 1;
        this.btnNext.node.active = false;
        this.btnPrev.node.active = false;
    },

    onEnable: function () {
        var self = this;
        var delay = 0.2;
        cc.director.getScheduler().schedule(function () {
            self.getTopSessionWinners();
        }, this, 1, 0, delay, false);

        this.animation.play('openPopup');
    },

    getTopSessionWinners: function () {
        var aviatorGetHistoryJackpotCommand = new cc.AviatorGetHistoryJackpotCommand;
        aviatorGetHistoryJackpotCommand.execute(this);
    },

    onBCGetHistoryResponse: function (response) {
        // REST tra MANG TRAN, khong boc trong {list}. Ban cu doc response.list -> undefined ->
        // guard "!== null" van lot -> .length nem TypeError -> popup chet trang.
        this.list = response || [];
        if (this.list.length > 0) {
            this.page = 0;
            this.btnNext.node.active = true;
            this.updatePage();
        }
    },

    closeClicked: function () {
        this.animation.play('closePopup');
        var self = this;
        var delay = 0.12;
        cc.director.getScheduler().schedule(function () {
            self.animation.stop();
            cc.AviatorPopupController.getInstance().destroyJpHistoryView();
        }, this, 1, 0, delay, false);
    },

    onClickNextPage: function () {
        if (!this.list) return;
        var maxPage = Math.ceil(this.list.length / this.listItems.children.length);
        if (this.page < maxPage - 1) {
            this.page++;
            this.updatePage();
            this.btnPrev.node.active = true;
            this.btnNext.node.active = this.page < maxPage - 1;
        }
    },

    onClickPrevPage: function () {
        if (!this.list) return;
        if (this.page > 0) {
            this.page--;
            this.updatePage();
            this.btnNext.node.active = true;
            this.btnPrev.node.active = this.page > 0;
        }
    },

    updatePage: function () {
        this.lblPage.string = `Trang: ${this.page + 1}`;
        for (var i = 0; i < this.listItems.children.length; i++) {
            var itemData = this.list[this.page * this.maxItems + i];

            var node = this.listItems.children[i];
            if (itemData) {
                node.active = true;
                var a = node.getComponent(cc.AviatorJpHistoryItem);
                a.updateItem(itemData, i);
            } else {
                node.active = false;
            }
        }
    },
});
