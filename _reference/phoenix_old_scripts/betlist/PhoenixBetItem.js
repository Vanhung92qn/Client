
(function () {
    cc.PhoenixBetItem = cc.Class({
        "extends": cc.Component,
        properties: {
            bgSprite: cc.Sprite,
            lbNickName: cc.Label,
            lbBet: cc.Label,
            lbAward: cc.Label,
            lbMultiplier: cc.Label,
        },

        updateItem: function(item, itemID, iscrashed) {
            this.bgSprite.enabled = itemID % 2 === 0;
            var color = cc.Color.WHITE;
            function formatNickname(nickname) {
                if (nickname.length > 8) {
                    return nickname.substring(0, 5) + "...";
                }
                return nickname;
            }
            this.lbNickName.string = formatNickname(item.Nickname);

            if(!iscrashed && !item.IsWon) {
                this.lbBet.string = cc.Tool.getInstance().formatNumberK(item.BetValue);
                this.lbAward.string = '-';
                this.lbMultiplier.string = '-';
            } else if (item.IsWon && item.Award > 0){
                this.lbNickName.node.color = color.fromHEX("#14FF00");
                this.lbBet.node.color = color.fromHEX("#14FF00");
                this.lbAward.node.color = color.fromHEX("#14FF00");
                this.lbMultiplier.node.color = color.fromHEX("#14FF00");
                this.lbBet.string = cc.Tool.getInstance().formatNumberK(item.BetValue);
                this.lbAward.string = cc.Tool.getInstance().formatNumberK(item.Award);
                this.lbMultiplier.string = item.Multiplier + 'x';
            } else if (iscrashed && !item.IsWon) {
                this.lbNickName.node.color = color.fromHEX("#FF0000");
                this.lbBet.node.color = color.fromHEX("#FF0000");
                this.lbAward.node.color = color.fromHEX("#FF0000");
                this.lbMultiplier.node.color = color.fromHEX("#FF0000");
                this.lbBet.string = cc.Tool.getInstance().formatNumberK(item.BetValue);
                this.lbAward.string = cc.Tool.getInstance().formatNumberK(item.Award);
                this.lbMultiplier.string = '-';
            }
            this.item = item;
            this.itemID = itemID;
        },
    });
}).call(this);
