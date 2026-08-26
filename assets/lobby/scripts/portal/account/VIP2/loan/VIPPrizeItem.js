/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.VIPPrizeItem = cc.Class({
        "extends": cc.Component,
        properties: {
            spriteIcon: cc.Sprite,
            lbTitle: cc.Label,
            lbVP: cc.Label,
            lbRewards: [cc.Label],

            lbDesc: cc.Label,
            nodeClaim: cc.Node,
        },

        onLoad: function () {
            this.spriteBG = this.node.getComponent(cc.Sprite);
            this.btnClaim = this.nodeClaim.getComponent(cc.Button);
            this.vipAssets = cc.AccountController.getInstance().getVipAssets();
        },

        updateIndex: function (itemID) {
            if (itemID % 2 === 0) {
                this.spriteBG.spriteFrame = this.vipAssets.sfBgs[0];
            } else {
                this.spriteBG.spriteFrame = this.vipAssets.sfBgs[1];
            }
        },

        updateItem: function (item) {
            // var loginResponse = cc.LoginController.getInstance().getLoginResponse();

            this.lbTitle.string = 'Thưởng quý ' + item.CurrentQuater;
            this.lbDesc.string = 'Tích lũy càng nhiều VP thì thưởng quý càng nhiều';

            switch (item.QuaterPrizeStatus) {
                case cc.QuaterPrizeStatus.RECEIVED: //da nhan
                    this.lbVP.string = '';
                    this.nodeClaim.active = true;
                    this.btnClaim.interactable = false;
                    var button = 'Đã nhận'; //???
                    break;
                case cc.QuaterPrizeStatus.VALID_NOT_RECEIVED: //hop le chua nhan
                    this.lbVP.string = '';
                    this.nodeClaim.active = true;
                    this.btnClaim.interactable = true;
                    var button = cc.Tool.getInstance().formatNumber(item.QuaterAcc) + ' ' + cc.Config.getInstance().currency();
                    break;
                case cc.QuaterPrizeStatus.NOT_YET_RECEIVED_TIME: //chua den thoi gian nhan
                    this.lbVP.string = '';
                    this.nodeClaim.active = true;
                    this.btnClaim.interactable = false;
                    var button = cc.Tool.getInstance().formatNumber(item.QuaterAcc) + ' ' + cc.Config.getInstance().currency();
                    break;
                case cc.QuaterPrizeStatus.OVER_TIME_RECEIVE: //qua thoi gian nhan
                    this.lbVP.string = '';
                    this.nodeClaim.active = true;
                    this.btnClaim.interactable = false;
                    var button = 'Quá hạn'; //???
                    break;
                case cc.QuaterPrizeStatus.NOT_ENOUGH_CONDITION: //Chua du dieu kien nhan
                    this.lbVP.string = '';
                    this.nodeClaim.active = true;
                    this.btnClaim.interactable = false;
                    var button = 'Chưa đủ điều kiện'; //???
                    break;
            }

            for (var i = 0; i < this.lbRewards.length; i++) {
                this.lbRewards[i].string = button;
            }


            this.item = item;
        },

        onVIPReceiveQuaterPrizeResponse: function (info) {
            cc.PopupController.getInstance().hideBusy();
            cc.PopupController.getInstance().closePopup();
            cc.PopupController.getInstance().showMessage(info.Message);
            cc.BalanceController.getInstance().updateRealBalance(info.Balance);
            cc.BalanceController.getInstance().updateBalance(info.Balance);

            cc.DDNA.getInstance().vipSummary(cc.DDNATransactionName.VIP_PRIZE, this.item.QuaterAcc);

            /* Truoc day cho nay goi cc.VIPController.getInstance().getLoanInfo()
               de nap lai danh sach. Duong day do la:
                 getLoanInfo -> GetVIPLoanInfoCommand -> onGetVIPLoanInfoResponse
                 -> listView.resetListLoan() + initializeLoan()
               Ca ba mat xich giua da bi go trong commit c6e13f0 cung voi phan
               VAY TIEN (user chot khong lam), nen goi tiep la nem TypeError:
               VIP2View.getLoanInfo is not a function — dung ngay sau khi nguoi
               choi vua nhan thuong quy xong.

               Bo loi goi thay vi noi lai duong day: tien da cong o
               updateRealBalance/updateBalance ben tren, phan con lai chi la ve
               lai danh sach. Xem ghi chu o VIP2ListView.initializeLoan. */
        },

        //click
        claimClicked: function () {
            cc.PopupController.getInstance().showBusy();
            var VIPReceiveQuaterPrizeCommand = new cc.VIPReceiveQuaterPrizeCommand;
            VIPReceiveQuaterPrizeCommand.execute(this);
        },
    });
}).call(this);
