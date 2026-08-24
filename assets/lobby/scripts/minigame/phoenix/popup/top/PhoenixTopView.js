/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.PhoenixTopView = cc.Class({
        extends: cc.PopupBase,
        properties: {
            topListView: cc.PhoenixTopListView,
            lbDate: cc.Label,
            btnPrevDay: cc.Button,
            btnNextDay: cc.Button
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
            this.dayAgo = 1;
            this.currDate = new Date();
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getTopSessionWinners(0);
            }, this, 1, 0, delay, false);
			this.checkActiveBtn();
            this.animation.play('openPopup');
        },

        getTopSessionWinners: function (direct) {
			let currDate = this.currDate;
			let date = currDate.getDate();
			currDate.setDate(date + direct);
            // ISO yyyy-MM-dd: server parse bang InvariantCulture, khong nhap nhang thang/ngay.
            var mm = ('0' + (currDate.getMonth() + 1)).slice(-2);
            var dd = ('0' + currDate.getDate()).slice(-2);
            let topDate = `${currDate.getFullYear()}-${mm}-${dd}`;
			this.lbDate.string = this.formatDate(currDate);
            var aviatorWinnerCommand = new cc.PhoenixWinnerCommand();
            aviatorWinnerCommand.execute(this, topDate);
        },

        onGetBigWinnerResponse: function (response) {
            var list = response || [];
            // resetList VO DIEU KIEN: ngay khong co ai thang thi phai xoa bang, khong duoc de nguyen data ngay cu
            this.topListView.resetList();
            if (list.length > 0) {
                this.topListView.initialize(list);
            }
        },
        
        prevDateClick: function () {
            this.dayAgo--;
            this.checkActiveBtn();
            this.getTopSessionWinners(-1);
        },

        nextDateClick: function () {
            this.dayAgo++;
            this.checkActiveBtn();
            this.getTopSessionWinners(1);
        },

        checkActiveBtn: function () {
            this.btnNextDay.interactable = true;
            this.btnNextDay.node.opacity = 255;
            this.btnPrevDay.interactable = true;
            this.btnPrevDay.node.opacity = 255;
            if (this.dayAgo >= 1) {
                this.dayAgo = 1;
                this.btnNextDay.interactable = false;
                this.btnNextDay.node.opacity = 150;
            }
            if (this.dayAgo <= -5) {
                this.dayAgo = -5;
                this.btnPrevDay.interactable = false;
                this.btnPrevDay.node.opacity = 150;
            }
        },
        
        formatDate: function (date) {
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            var formattedDate = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + ('' + year);
            return formattedDate;
        },
        
        closeClicked: function () {
            this.topListView.resetList();
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.PhoenixPopupController.getInstance().destroyTopView();
            }, this, 1, 0, delay, false);
        },
    });
}).call(this);
