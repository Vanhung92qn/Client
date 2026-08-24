/**
 * Created by Nobita on 01/09/2022.
 */

const players = require('PlayerData').players;

(function () {
    cc.Xeng777InputView = cc.Class({
        extends: cc.Component,

        properties: {
            nodeParentChip: cc.Node,
            btnBets: [cc.Button],
            btnChips: [cc.Button],
            lbTotalBets: [cc.Label],
            lbTotalUserBets: [cc.Label],
            poolListContent: cc.Node,
            btnNextChipPool: cc.Button,
            btnPrevChipPool: cc.Button,
            btnBetX2: cc.Button,
            btnRepeat: cc.Button,
        },

        // LIFE-CYCLE CALLBACKS:

        onLoad() {
            this.controller = cc.Xeng777Controller.getInstance();
            this.controller.setInputView(this);
            this.betValue = 1000000;
            this.nodeChipPress = [];
            let self = this;
            this.btnChips.forEach(function (btnChip) {
                self.nodeChipPress.push(btnChip.node.getChildByName('chipPress'));
            });
            // this.btnNextChipPool.interactable = false;
        },

        onDestroy: function () {
            this.controller.setInputView(null);
        },

        start() {

        },

        onChipClicked: function (event, value) {          
            value = parseInt(value);
            if (value != this.betValue) {
                this.betValue = value;

                cc.AudioController.getInstance().playSound(cc.AudioTypes.CHIP_SELECT);
                this.resetChipSelected();
                this.updateCurrentChipSelected(event.target);
            }
        },

        resetChipSelected: function () {
            const self = this;
            this.btnChips.forEach(function (btnChip, index) {
                btnChip.interactable = true;
                cc.tween(btnChip.node).to(0.15, { scale: 1 }).start();

                self.getChipPress(btnChip.node).active = false;
            })

        },

        updateCurrentChipSelected: function (btnChip) {
            btnChip.interactable = false;
            cc.tween(btnChip.node).to(0.3, { scale: 1.2 }).start();

            this.getChipPress(btnChip).active = true;
        },

        getChipPress: function (btnChip) {
            // console.log(btnChip);
            const chipPress = btnChip.getChildByName("chipPress");

            return chipPress;
        },

        onNextPoolClicked: function () {
            const poolListView = this.poolListContent.parent;
            const minX = poolListView.width;
            let newX = this.poolListContent.x - 86;
            if (newX <= minX) {
                newX = minX;
                this.btnNextChipPool.interactable = false;
            }

            cc.tween(this.poolListContent).to(0.3, { position: cc.v2(newX, this.poolListContent.y) }).start();
            this.btnPrevChipPool.interactable = true;
        },

        onPrevPoolClicked: function () {
            const poolListView = this.poolListContent.parent;
            const maxX = this.poolListContent.width;
            let newX = this.poolListContent.x + 86;

            if (newX >= maxX) {
                newX = maxX;
                this.btnPrevChipPool.interactable = false;
            }

            cc.tween(this.poolListContent).to(0.3, { position: cc.v2(newX, this.poolListContent.y) }).start();
            this.btnNextChipPool.interactable = true;
        },

        // update (dt) {},
        activeAllButtonBet: function (active) {
            this.btnBets.forEach(function (btnBet) {
                btnBet.interactable = active;
            });
        },

        resetTable: function () {

        },

        onBetClick: function (event, betSide) {
            this.activeBetAgain(false);
            this.activeBetX2(false);
            cc.AudioController.getInstance().playSound(cc.AudioTypes.CHIP_BET);

            this.sendRequestBet(this.betValue, betSide);
        },

        activeBetAgain: function (active) {
            this.btnRepeat.node.active = active;
        },

        activeBetX2: function (active) {
            this.btnBetX2.node.active = active;
        },

        sendRequestBet: function (betValue, betSide) {
            return this.controller.sendRequestOnHub(cc.MethodHubName.BET, betValue, betSide);
        },

        playAnimationWin: function (sideWin) {

        },

        getBtnBets: function () {
            return this.btnBets;
        },

        getBtnBet: function (betSide) {
            return this.btnBets[betSide];
        },

        resetBet: function () {
            this.btnBets.forEach(function (btnBet) {
                const node = btnBet.node;
                const lbUserBet = node.getChildByName("lbUserBet").getComponent(cc.Label);
                const lbTotalUserBet = node.getChildByName("lbTotalUserBet").getComponent(cc.Label);
                lbUserBet.string = '';
                lbTotalUserBet.string = '';
            });
        },
    });
}).call(this);
