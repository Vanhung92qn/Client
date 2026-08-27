/**
 * Created by Welcome on 4/18/2019.
 *
 * 2026-08-28 — sua theo backend moi (LuckyWheel.Api, .NET 10):
 *   - Bo buoc captcha: bam Quay la quay luon.
 *   - Nhan 19 o duoc nap DONG tu server (GetConfig) thay vi go cung trong prefab.
 *   - Vong nho khong con tra "luot quay game slot" ma tra HONG BAO / +1 LUOT.
 *   - So luot con lai lay tu response.Remain (su that o server) thay vi tu tru.
 *
 * PHAN TINH GOC GIU NGUYEN — do la hop dong voi server:
 *   index o vong lon = PrizeID % 12 ; vong nho = idConvert % 7 (6 va 7 hoan vi).
 */

var vqmmConfig = require('VQMMConfig');

(function () {
    //ID cac o dac biet cua vong nho, khop bang SpinWeight ben server
    var SMALL_SLOT_BONUS = 1;   //+1 LUOT
    var SMALL_SLOT_MISS = 6;    //TRUOT

    cc.VQMMView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            nodeBig: cc.Node,
            nodeBig2: cc.Node,      //"big copy"  — vong chua 12 nhan
            nodeSmall: cc.Node,
            nodeSmall2: cc.Node,    //"small copy" — vong chua 7 nhan
            lbRemaining: cc.Label,

            //sprite icon
            spriteIcons: [cc.Sprite],
        },

        start: function () {
            var self = this;
            this.spriteIcons.forEach(function (spriteIcon) {
                spriteIcon.spriteFrame =  cc.LobbyController.getInstance().getGameAssets().icons[cc.Config.getInstance().getIndexIcon(cc.Config.getInstance().getServiceId())];
            });

            this.countPrizeBig = 12;
            this.countPrizeSmall = 7;

            this.bigRotation = 360 / this.countPrizeBig;
            this.smallRotation = 360 / this.countPrizeSmall;

            // this.bigStartRotMin = (this.bigRotation / 2) + 5; //goc bat dau tu giai 0
            // this.bigStartRotMax = ((this.bigRotation / 2) + this.bigRotation) - 5; //goc bat dau tu giai 0
            this.bigStartRotMin = -35;
            this.bigStartRotMax = -55;

            this.smallStartRotMin = -((this.smallRotation / 2) + 5); //goc bat dau tu giai 0
            this.smallStartRotMax = -(((this.smallRotation / 2) + this.smallRotation) - 5); //goc bat dau tu giai 0

            cc.VQMMController.getInstance().setVQMMView(this);

            //set zIndex
            this.node.zIndex = cc.Config.getInstance().getZINDEX();

            this.isSpinning = false;
        },

        onEnable: function () {
            this.animation.play('openPopup');
            this.getInfo();
            this.getConfig();
        },

        // ------------------------------------------------------- cau hinh o

        getConfig: function () {
            var vqmmGetConfigCommand = new cc.VQMMGetConfigCommand;
            vqmmGetConfigCommand.execute(this);
        },

        onVQMMGetConfigResponse: function (response) {
            if (!response) return;
            this.applySlotLabels(this.nodeBig2, response.Big);
            this.applySlotLabels(this.nodeSmall2, response.Small);
        },

        //Dien nhan vao dung o. Thu tu con cua node trung voi SlotIndex
        //(con thu 0 cua "big copy" la o TRUOT, dung SlotIndex 0).
        applySlotLabels: function (node, slots) {
            if (!node || !slots) return;

            slots.forEach(function (slot) {
                var child = node.children[slot.SlotIndex];
                if (!child) return;

                var label = child.getComponent(cc.Label);
                if (label) label.string = slot.Label;
            });
        },

        // ---------------------------------------------------------- quay

        //quay vong quay
        spinVQMM: function () {
            this.stopVQMM();
        },

        //dung vong quay
        stopVQMM: function () {
            //lay ve ket qua
            var response = cc.VQMMController.getInstance().getVQMMSpinResponse();

            //tinh goc cua giai thuong - vong to
            var rotationMax = this.bigStartRotMax + (-this.bigRotation * (response.PrizeID - 1));
            var rotationMin = this.bigStartRotMin + (-this.bigRotation * (response.PrizeID - 1));
            var rotation =  Math.floor((Math.random() * (rotationMax - rotationMin) + rotationMin));

            //set goc ket thuc
            this.nodeBig.rotation = rotation;
            this.nodeBig2.rotation = rotation;

            //1=+1 LUOT, 2..5 va 7=HONG BAO, 6=TRUOT
            if (response.FreeSpinID === 6) {
                var idConvert = 7; //truot chuyen ve index 7
            } else  if (response.FreeSpinID === 7) {
                idConvert = 6; //chuyen ve index 6
            } else {
                idConvert = response.FreeSpinID;
            }

            //tinh goc cua giai thuong - vong nho
            rotationMax = this.smallStartRotMax + (-this.smallRotation * (idConvert - 1));
            rotationMin = this.smallStartRotMin + (-this.smallRotation * (idConvert - 1));
            rotation =  Math.floor((Math.random() * (rotationMax - rotationMin) + rotationMin));

            //set goc ket thuc
            this.nodeSmall.rotation = rotation;
            this.nodeSmall2.rotation = rotation;

            //quay
            this.nodeBig.stopAllActions();
            this.nodeBig.runAction(cc.rotateBy(vqmmConfig.SPIN_TIME, -1800).easing(cc.easeQuadraticActionOut()));

            this.nodeBig2.stopAllActions();
            this.nodeBig2.runAction(cc.rotateBy(vqmmConfig.SPIN_TIME, -1800).easing(cc.easeQuadraticActionOut()));

            this.nodeSmall.stopAllActions();
            this.nodeSmall.runAction(cc.rotateBy(vqmmConfig.SPIN_TIME, 1800).easing(cc.easeQuadraticActionOut()));

            this.nodeSmall2.stopAllActions();
            this.nodeSmall2.runAction(cc.rotateBy(vqmmConfig.SPIN_TIME, 1800).easing(cc.easeQuadraticActionOut()));

            //So luot con lai lay theo server. Ban cu tu tru 1 nen lech ngay khi
            //trung o "+1 LUOT" (tru 1 roi lai duoc cong 1).
            if (typeof response.Remain === 'number') {
                this.quantity = response.Remain;
            } else {
                this.quantity = Math.max(0, this.quantity - 1);
            }
            this.lbRemaining.string = this.quantity;

            var self = this;
            cc.director.getScheduler().schedule(function () {
                cc.PopupController.getInstance().showMessage(self.buildRewardMessage(response));
                self.isSpinning = false;
            }, this, 0, 0, vqmmConfig.SPIN_TIME, false);

            cc.LobbyController.getInstance().refreshAccountInfo();

            //DDNA chi tinh tien MAT da vao vi. Tien hong bao chua vao vi (con
            //phai mo trong 24h) nen khong cong vao day.
            if (response.PrizeValue > 0) {
                cc.DDNA.getInstance().spinVQMM(response.PrizeValue);
            }
        },

        //Server LUON tra FreeSpinValue = 0 (tien hong bao chua vao vi), nen phai
        //nhin FreeSpinID de biet vong nho trung gi — khong nhin FreeSpinValue.
        buildRewardMessage: function (response) {
            var currency = cc.Config.getInstance().currency();
            var cash = response.PrizeValue > 0
                ? cc.Tool.getInstance().formatNumber(response.PrizeValue) + ' ' + currency
                : '';

            var bonus = '';
            if (response.FreeSpinID === SMALL_SLOT_BONUS) {
                bonus = 'thêm 1 lượt quay';
            } else if (response.FreeSpinID !== SMALL_SLOT_MISS) {
                bonus = 'một hồng bao ' + response.FreeSpinName + ' (nhớ mở trong 24 giờ)';
            }

            if (cash && bonus) return 'Bạn đã nhận được ' + cash + ' và ' + bonus;
            if (cash) return 'Bạn đã nhận được ' + cash;
            if (bonus) return 'Bạn đã nhận được ' + bonus;
            return 'Chúc bạn may mắn lần sau';
        },

        // ------------------------------------------------------- thong tin

        getInfo: function () {
            var vqmmGetInfoCommand = new cc.VQMMGetInfoCommand;
            vqmmGetInfoCommand.execute(this);
        },

        onVQMMGetInfoResponse: function (response) {
            //{"quantity":20,"isOpen":true,"response":0,"dailyQuota":20,"used":0,"bonus":0}
            this.quantity = response.Quantity;
            this.lbRemaining.string = response.Quantity;
            this.responseCode = response.Response;
            if (response.Message) {
                this.responseMessage = response.Message;
            }
        },

        spinClicked: function () {
            if (this.isSpinning) return;

            if (this.responseCode === -203) {
                cc.PopupController.getInstance().showMessage(cc.VQMMSpinError.ERROR_203);
            } else if (this.responseCode < 0 && this.responseMessage) {
                cc.PopupController.getInstance().showMessage(this.responseMessage);
            } else if (this.quantity > 0) {
                this.isSpinning = true;
                cc.PopupController.getInstance().showBusy();

                var vqmmSpinCommand = new cc.VQMMSpinCommand;
                vqmmSpinCommand.execute(this);
            } else {
                cc.PopupController.getInstance().showMessage('Bạn không có lượt quay. Vui lòng quay lại sau');
            }
        },

        //Truoc day nam trong VQMMCaptchaView; captcha da bo nen dua thang ve day.
        onVQMMSpinResponse: function (response) {
            switch (response.Response) {
                case -200:
                    this.isSpinning = false;
                    cc.PopupController.getInstance().showMessage(cc.VQMMSpinError.ERROR_200);
                    break;
                case -202:
                    this.isSpinning = false;
                    cc.PopupController.getInstance().showMessage(cc.VQMMSpinError.ERROR_202);
                    break;
                case -203:
                    this.isSpinning = false;
                    cc.PopupController.getInstance().showMessage(cc.VQMMSpinError.ERROR_203);
                    break;
                case -204:
                    this.isSpinning = false;
                    cc.PopupController.getInstance().showMessage(cc.VQMMSpinError.ERROR_204);
                    break;
                case -205:
                    this.isSpinning = false;
                    cc.PopupController.getInstance().showMessage(cc.VQMMSpinError.ERROR_205);
                    break;
                case -1001:
                    this.isSpinning = false;
                    cc.PopupController.getInstance().showMessage(cc.VQMMSpinError.ERROR_1001);
                    break;
                case 0:
                    //set qua ket + goi SPIN
                    cc.VQMMController.getInstance().setVQMMSpinResponse(response);
                    cc.VQMMController.getInstance().spinVQMM();
                    break;
                default:
                    this.isSpinning = false;
                    cc.PopupController.getInstance().showMessage(cc.VQMMSpinError.ERROR_1003);
            }
        },

        helpClicked: function () {
            // cc.VQMMPopupController.getInstance().createHelpView();
        },

        topClicked: function () {
            cc.VQMMPopupController.getInstance().createTopView();
        },

        historyClicked: function () {
            cc.VQMMPopupController.getInstance().createHistoryView();
        },

        closeFinished: function () {
            cc.LobbyController.getInstance().destroyVQMMView();
        },
    });
}).call(this);
