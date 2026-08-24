
(function () {
    cc.AviatorPlayersView = cc.Class({
        extends: cc.Component,
        properties: {
            lbTotalBet: cc.LabelIncrement,
            lbTotalWin: cc.LabelIncrement,
            lbTotalUser: cc.LabelIncrement,
            aviatorListView: cc.AviatorBetListView,
            curPlayerBet: cc.AviatorCurPlayerBetItem,
            nodeScroll: cc.Node,
        },

        onLoad: function () {
            this.controller = cc.AviatorController.getInstance();
            this.controller.setAviatorPlayerView(this);
            this.curPlayerId = cc.LoginController.getInstance().getUserId();
            this.viewNode = this.nodeScroll.getChildByName('view');
            this.isHeightAdjusted = false;
            this.defaultScrollHeight = 368;
            this.defaultViewHeight = 368;
        },

        updateBetList: function (infolist, iscrashed) {
            var list = infolist;
            if (list !== null && list.length > 0) {

                this.lbTotalUser.tweenValueto(list.length);
                this.lbTotalBet.tweenValueto(list.reduce(function (total, item) {
                    return total + item.BetValue;
                }, 0));
                this.lbTotalWin.tweenValueto(list.reduce(function (total, item) {
                    return total + item.Award;
                }, 0));
                const currentPlayerItem = list.find(item => item.AccountID === this.curPlayerId);
                list = list.filter(item => item.AccountID !== this.curPlayerId);
                
                this.aviatorListView.resetList();
                this.aviatorListView.initialize(list, iscrashed);
                if (currentPlayerItem) {
                    this.curPlayerBet.node.active = true;
                    this.curPlayerBet.updateItem(currentPlayerItem, 0, iscrashed);
                    if (!this.isHeightAdjusted) {
                        const curPlayerBetHeight = this.curPlayerBet.node.height;
                        this.nodeScroll.height -= curPlayerBetHeight;
                        let viewNode = this.nodeScroll.getChildByName('view');
                        viewNode.height -= curPlayerBetHeight;
                        this.isHeightAdjusted = true;
                    }
                } else {
                    this.curPlayerBet.node.active = false;
                }
            } else {
                this.curPlayerBet.node.active = false;
            }
        },

        resetList: function () {
            this.aviatorListView.resetList();
            this.curPlayerBet.resetItem();
            this.lbTotalBet.tweenValueto(0);
            this.lbTotalWin.tweenValueto(0);
            this.lbTotalUser.tweenValueto(0);
            this.curPlayerBet.node.active = false;
            this.isHeightAdjusted = false;
            this.nodeScroll.height = this.defaultScrollHeight;
            this.viewNode.height = this.defaultViewHeight;
        }
    });
}).call(this);




