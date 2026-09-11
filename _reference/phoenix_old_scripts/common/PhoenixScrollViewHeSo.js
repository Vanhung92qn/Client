

cc.Class({
    extends: cc.Component,

    properties: {
        scrollViewLeft: cc.ScrollView,
        scrollViewRight: cc.ScrollView,
        numberPrefab: cc.Prefab
    },

    onLoad: function() {
        this.initNumbers(this.scrollViewLeft.content);
        this.initNumbers(this.scrollViewRight.content);
        this.scrollViewLeft.node.on('scroll-ended', () => this.onScrollEnded(this.scrollViewLeft), this);
        this.scrollViewRight.node.on('scroll-ended', () => this.onScrollEnded(this.scrollViewRight), this);
        // PHAI khoi tao 2 bien nay. Neu de undefined, nguoi choi chi cuon MOT cot thi chuoi ghep ra
        // 'undefined.5' -> parseFloat = NaN -> NaN duoc gui THANG len hub lam moc auto-rut.
        this.currentNumberLeft = 1;
        this.currentNumberRight = 1;
        this.Multiplier = '1.01';
    },

    initNumbers: function (content) {
        content.removeAllChildren();
        for (let i = 0; i < 3; i++) {
            for (let j = 1; j <= 99; j++) {
                let item = cc.instantiate(this.numberPrefab);
                let numberLabel = item.getComponent(cc.Label);
                let displayNumber = j < 10 ? "0" + j : "" + j;
                numberLabel.string = displayNumber;
                content.addChild(item);
                item.y = -item.height * (i * 99 + (j - 1));
            }
        }
        content.height = content.children.length * content.children[0].height;
    },

    onScrollEnded: function (scrollView) {
        let content = scrollView.content;
        let closestItem = this.getClosestItem(content);

        if (closestItem) {
            let targetY = -closestItem.y;
            cc.tween(content)
                .to(0.3, { y: targetY }, { easing: 'cubicInOut' })
                .start();

            let adjustedIndex = parseInt(closestItem.getComponent(cc.Label).string);
            if (scrollView === this.scrollViewLeft) {
                this.currentNumberLeft = adjustedIndex;
            } else if (scrollView === this.scrollViewRight) {
                this.currentNumberRight = adjustedIndex;
            }
            // Cot phai la PHAN THAP PHAN 2 CHU SO (nhan hien '01'..'99'), nhung parseInt('05') = 5.
            // Ghep thang se ra '1.5' trong khi nguoi choi chon 1.05 -> sai moc rut GAP 10 LAN.
            var deci = this.currentNumberRight < 10 ? '0' + this.currentNumberRight : '' + this.currentNumberRight;
            this.Multiplier = this.currentNumberLeft + '.' + deci;
            cc.log(`Số đã chọn (${scrollView === this.scrollViewLeft ? 'Trái' : 'Phải'}): `, adjustedIndex < 10 ? "0" + adjustedIndex : "" + adjustedIndex);
        }
        this.adjustCircularScroll(content, closestItem);
    },

    getClosestItem: function(content) {
        let closestItem = null;
        let minDistance = Infinity;

        content.children.forEach(item => {
            let itemWorldPos = item.parent.convertToWorldSpaceAR(item.position);
            let contentWorldPos = content.parent.convertToWorldSpaceAR(cc.v2(0, 0));
            let distance = Math.abs(itemWorldPos.y - contentWorldPos.y);

            if (distance < minDistance) {
                minDistance = distance;
                closestItem = item;
            }
        });

        return closestItem;
    },

    adjustCircularScroll: function(content, closestItem) {
        let index = content.children.indexOf(closestItem);
        if (index >= 99 && index < 198) {
            return;
        }
        if (index < 99) {
            let offset = content.y - closestItem.y + content.children[99].y;
            content.y = offset;
        } else if (index >= 198) {
            let offset = content.y - closestItem.y + content.children[99].y;
            content.y = offset;
        }
    },

    setMultiplier: function() {
        cc.PhoenixController.getInstance().setMultiplier(this.Multiplier);
    },

    resetMultiplier: function() {
        this.scrollViewLeft.scrollToTop(0.3);
        this.scrollViewRight.scrollToTop(0.3);
        // Cuon xong se ban 'scroll-ended' -> onScrollEnded tinh lai tu o gan tam nhat. PHAI dat lai
        // 2 bien nay, neu khong gia tri cu con nguyen va ket qua tinh lai khong ve dung 1.01.
        this.currentNumberLeft = 1;
        this.currentNumberRight = 1;
        this.Multiplier = '1.01';
    }
});





