
(function () {
    cc.PhoenixBetListView = cc.Class({
        "extends": cc.ListView,
        properties: {

        },

        initialize: function (messages, iscrashed) {
            this.messages = messages;
            // update() ben duoi doc `iscrashed` nhung no chi la THAM SO cua initialize -> ReferenceError
            // moi khi vong tai su dung item chay (cuon danh sach > 15 ve). Luu lai vao this de update doc duoc.
            this.iscrashed = iscrashed;
            var countMessage = this.messages.length;
            this.content.height = countMessage * (this.itemTemplate.height + this.spacing) + this.spacing;
            var spawnCountReal = Math.min(this.spawnCount, countMessage);

            for (var i = 0; i < spawnCountReal; ++i) {
                var item = cc.instantiate(this.itemTemplate);
                this.content.addChild(item);
                item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1));
                item.getComponent(cc.PhoenixBetItem).updateItem(this.messages[i], i, iscrashed);
                this.items.push(item);
            }
            this.rootContentY = this.content.y;
        },

        update: function (dt) {
            this.updateTimer += dt;
            if (this.updateTimer < this.updateInterval) return;
            this.updateTimer = 0;
            var items = this.items;
            var buffer = this.bufferZone;
            var isDown = this.scrollView.content.y < this.lastContentPosY;
            var offset = (this.itemTemplate.height + this.spacing) * items.length;
            for (var i = 0; i < items.length; ++i) {
                var viewPos = this.getPositionInView(items[i]);
                if (isDown) {
                    if (viewPos.y < -buffer && items[i].y + offset < 0) {
                        items[i].y = items[i].y + offset;
                        var item = items[i].getComponent(cc.PhoenixBetItem);
                        var itemId = item.itemID - items.length;
                        item.updateItem(this.messages[itemId], itemId, this.iscrashed);
                    }
                } else {
                    if (viewPos.y > buffer && items[i].y - offset > -this.content.height) {
                        items[i].y = items[i].y - offset;
                        item = items[i].getComponent(cc.PhoenixBetItem);
                        itemId = item.itemID + items.length;
                        item.updateItem(this.messages[itemId], itemId, this.iscrashed);
                    }
                }
            }
            this.lastContentPosY = this.scrollView.content.y;
        }
    });

}).call(this);
