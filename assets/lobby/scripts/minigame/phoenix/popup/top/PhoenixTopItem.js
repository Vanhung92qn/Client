/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.PhoenixTopItem = cc.Class({
        "extends": cc.Component,
        properties: {
            sprite: cc.Sprite,
            lbRank: cc.Label,
            lbNickName: cc.Label,
            lbTotalWin: cc.Label,
            rankSprite1: sp.Skeleton,
            rankSprite2: sp.Skeleton,
            rankSprite3: sp.Skeleton,
        },

        updateItem: function(item, itemID) {
			var color = cc.Color.WHITE;
            this.sprite.enabled = itemID % 2 !== 0;
            if (itemID < 3) {
                this.lbRank.node.active = false;
                if (itemID == 0) {
                    this.rankSprite1.node.active = true;
                    this.rankSprite2.node.active = false;
                    this.rankSprite3.node.active = false;
                    this.lbNickName.node.color = color.fromHEX("#CC0000");
                } else if (itemID == 1) {
                    this.rankSprite1.node.active = false;
                    this.rankSprite2.node.active = true;
                    this.rankSprite3.node.active = false;
                    this.lbNickName.node.color = color.fromHEX("#FFCC00");
                } else {
                    this.rankSprite1.node.active = false;
                    this.rankSprite2.node.active = false;
                    this.rankSprite3.node.active = true;
                    this.lbNickName.node.color = color.fromHEX("#00CC34");
                }
            } else {
                this.lbNickName.node.color = color.fromHEX("#008DFF");
                this.lbTotalWin.node.color = color.fromHEX("#FFFFFF");
                // Bo 2 dong gan font tu this.fontName/this.fontRegurlar (khong khai bao -> undefined ->
                // xoa font o hang >=3). Giu font da gan san trong prefab.
                this.lbRank.string = itemID + 1;
                this.lbRank.node.active = true;
                this.rankSprite1.node.active = false;
                this.rankSprite2.node.active = false;
                this.rankSprite3.node.active = false;
            }

            this.lbNickName.string = item.Nickname;
            this.lbTotalWin.string = cc.Tool.getInstance().formatNumber(item.MaxPayout);

            this.item = item;
            this.itemID = itemID;
        },
    });
}).call(this);
