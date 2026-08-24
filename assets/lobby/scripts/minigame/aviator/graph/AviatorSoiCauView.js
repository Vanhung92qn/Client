
cc.Class({
    extends: cc.Component,
    properties: {
        itemGray: cc.Prefab,
        itemRed: cc.Prefab,
        itemBlue: cc.Prefab,
        itemGreen: cc.Prefab,
        itemYellow: cc.Prefab,
        itemPurple: cc.Prefab,
        itemOrange: cc.Prefab,
        layoutParent: cc.Node,
    },

    onLoad: function () {
        this.controller = cc.AviatorController.getInstance();
        this.controller.setAviatorSoiCauView(this);
        this.clearList();
    },

    // Chon prefab theo he so. Ban cu dung `> 3 && < 5` (va tuong tu o 5/10/50) nen he so DUNG BANG
    // 3.00 / 5.00 / 10.00 / 50.00 khong khop nhanh nao -> roi xuong else -> hien DO, trong khi do la mau
    // danh cho >= 200x (van 5.00x trong nhu van 200x+). Dung >= o bien cho dung.
    // Gop 1 ham vi logic nay von bi COPY 2 cho -> bug nam ca hai, sua 1 cho la sot.
    pickItem: function (m) {
        if (m < 2) return this.itemGray;
        if (m < 3) return this.itemBlue;
        if (m < 5) return this.itemPurple;
        if (m < 10) return this.itemGreen;
        if (m < 50) return this.itemOrange;
        if (m < 200) return this.itemYellow;
        return this.itemRed;
    },

    initListSoiCau: function (data) {
        if (data.length === 0) {
            return;
        }

        if (!this.layoutParent.children.length) {
            for (let i = 9; i >= 0; i--) {
                let multiplier = data[i];
                if (!multiplier) continue;   // it hon 10 van (DB moi) -> data[i] undefined -> tranh nem
                let prefab = cc.instantiate(this.pickItem(multiplier.Multiplier));
                let valueLabel;

                this.layoutParent.addChild(prefab);
                valueLabel = prefab.getChildByName('value').getComponent(cc.Label);
                if (valueLabel) {
                    valueLabel.string = multiplier.Multiplier + 'x';
                }
            }
        } else {
            this.layoutParent.children[9].removeFromParent();
            this.layoutParent.children.forEach(child => {
                child.stopAllActions();
                child.scale = 1;
            });
            let multiplier = data[0];
            if (!multiplier) return;
            let prefab = cc.instantiate(this.pickItem(multiplier.Multiplier));
            // if (prefab.children.length > 0) {
            // 	prefab.children[9].active = true;
            // }
            this.layoutParent.addChild(prefab);
            let valueLabel2 = prefab.getChildByName('value').getComponent(cc.Label);
            if (valueLabel2) {
                valueLabel2.string = multiplier.Multiplier + 'x';
            }
        }
        cc.director.getScheduler().schedule(function () {
            cc.Tween.stopAllByTarget(this.layoutParent.children[9]);
            cc.tween(this.layoutParent.children[9])
                .repeatForever(
                    cc.tween()
                        .to(0.4, { scale: 1.2 })
                        .to(0.8, { scale: 1 })
                )
                .start();
        }, this, 0, 0, 0, false);
    },

    clearList: function () {
        this.layoutParent.removeAllChildren(true);
    },
});