/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.ChickenFightGraphView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            chickenFightGraph100View: cc.ChickenFightGraph100View,
            chickenFightGraphCatCauView: cc.ChickenFightGraphCatCauView,

            pageView: cc.PageView,
            btnNext: cc.Button,
            btnBack: cc.Button,

            lbTotalTai: cc.Label,
            lbTotalXiu: cc.Label,
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.timeSwitchPage = 0.3;
            this.totalPages = 2;
            this.currentPageIndex = this.pageView.getCurrentPageIndex();
            this.checkStatusButton();
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getSoiCau();
            }, this, 1, 0, delay, false);

            this.animation.play('openPopup');

            //set tam du lieu de demo
        },

        getSoiCau: function () {
            var getSoiCauCommand = new cc.ChickenFightGetSoiCauCommand;
            getSoiCauCommand.execute(this)
        },

        onChickenFightGetSoiCauResponse: function (list) {
            this.chickenFightGraph100View.draw(list);
            this.chickenFightGraphCatCauView.draw(list);
        },

        pageEvent: function () {
            this.checkStatusButton();
        },

        closeClicked: function () {
            //reset truoc khi close cho ko lag
            this.chickenFightGraph100View.resetDraw();
            this.chickenFightGraphCatCauView.resetDraw();

            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.ChickenFightPopupController.getInstance().destroyGraphView();
            }, this, 1, 0, delay, false);
        },

        nextPageClicked: function() {
            this.currentPageIndex++;
            this.pageView.scrollToPage(this.currentPageIndex, this.timeSwitchPage);
            this.checkStatusButton();
        },

        backPageClicked: function() {
            this.currentPageIndex--;
            this.pageView.scrollToPage(this.currentPageIndex, this.timeSwitchPage);
            this.checkStatusButton();
        },

        checkStatusButton: function () {
            this.currentPageIndex = this.pageView.getCurrentPageIndex();
            if (this.currentPageIndex <  this.totalPages - 1) {
                this.btnNext.interactable = true;
            } else {
                this.btnNext.interactable = false;
            }

            if (this.currentPageIndex > 0) {
                this.btnBack.interactable = true;
            } else {
                this.btnBack.interactable = false;
            }
        },
    });
}).call(this);
