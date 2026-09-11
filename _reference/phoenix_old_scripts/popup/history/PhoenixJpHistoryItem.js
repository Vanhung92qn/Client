cc.PhoenixJpHistoryItem = cc.Class({
    extends: cc.Component,

    properties: {
        line: cc.Node,
        lblSession: cc.Label,
        lblTime: cc.Label,
        //lblResult: cc.Label,
        lblJackpot: cc.Label,
        vinhDanh: cc.Node,
        btnMore: cc.Button
    },

    updateItem(itemData, idx) {
        // vinhDanh duoc deref o 2 vong lap ben duoi -> chuan hoa 1 lan, tranh nem khi rong/thieu
        if (!itemData.vinhDanh) itemData.vinhDanh = [];
        this.lblSession.string = '#' + itemData.session;
        this.lblTime.string = cc.Tool.getInstance().convertUTCTime(itemData.time);
        //this.lblResult.string = itemData.result;
        this.lblJackpot.string = `${cc.Tool.getInstance().formatNumber(itemData.jackpot)}`;
        this.btnMore.node.off("click");
        this.btnMore.node.active = true;
        this.btnMore.node.on("click", function () {
            this.btnMore.node.active = false;
            for (let i = 0; i < itemData.vinhDanh.length || i < this.vinhDanh.childrenCount; i++) {
                let vItem = this.vinhDanh.children[i];
				this.node.height = Math.max(60, 60 * itemData.vinhDanh.length);   // rong -> 0 => ep san 60
                if (i < itemData.vinhDanh.length) {
                    let vItemData = itemData.vinhDanh[i];
                    if (!vItem || vItem.name == "1") {
                        vItem = cc.instantiate(this.vinhDanh.children[0]);
                        vItem.parent = this.vinhDanh;
                    }
                    vItem.active = true;
                    vItem.getChildByName("lblNickname").getComponent(cc.Label).string = vItemData.nickname;
                    vItem.getChildByName("lblCoin").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumberK(vItemData.coin);
                     
                } else if (vItem) {
                    vItem.active = false;
                }
            }
        }.bind(this));

        for (let i = 0; i < itemData.vinhDanh.length || i < this.vinhDanh.childrenCount; i++) {
            let vItem = this.vinhDanh.children[i];
            if (i < itemData.vinhDanh.length && i < 4) {
				this.node.height = 400;
                let vItemData = itemData.vinhDanh[i];
                if (!vItem || vItem.name == "1") {
                    vItem = cc.instantiate(this.vinhDanh.children[0]);
                    vItem.parent = this.vinhDanh;
                    vItem.setSiblingIndex(1);
                }
                vItem.active = true;
                vItem.getChildByName("lblNickname").getComponent(cc.Label).string = vItemData.nickname;
                vItem.getChildByName("lblCoin").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumberK(vItemData.coin);
                 
            } else if (vItem) {
                vItem.active = false;
            }
        }
    },

    update() {
        this.line.height = this.node.height;
    }
});
