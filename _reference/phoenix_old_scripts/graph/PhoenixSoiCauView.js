
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
        // Sunwin hien 8 o (dem tren anh chup that: x92.47 x4.15 x5.77 x2.3 x2.92 x2.21 x1.89 x80.14).
        // Dai `background_rate_history` rong 801px  =>  8 o x 97 + 7 x spacing 4 = 804px, khop.
        // (Ban cu do 10 o + spacing 40 = 1330px nen tran gap ruoi.)
        maxItems: 8,
        itemWidth: 97,
    },

    onLoad: function () {
        this.controller = cc.PhoenixController.getInstance();
        this.controller.setAviatorSoiCauView(this);
        this.clearList();
    },

    // Chon prefab theo he so. Ban cu dung `> 3 && < 5` (va tuong tu o 5/10/50) nen he so DUNG BANG
    // 3.00 / 5.00 / 10.00 / 50.00 khong khop nhanh nao -> roi xuong else -> hien DO, trong khi do la mau
    // danh cho >= 200x (van 5.00x trong nhu van 200x+). Dung >= o bien cho dung.
    // Gop 1 ham vi logic nay von bi COPY 2 cho -> bug nam ca hai, sua 1 cho la sot.
    // SUNWIN DUNG MOT LOAI O, TO MAU CHU — khong dung 7 anh nen mau nhu ban Roy88 cu.
    // Nen mau cu lam dai soi cau nhin nhu bang xep hang; ban goc chi la day chu mau tren nen toi lien mach.
    // Giu 6 property prefab cu (itemBlue/Green/...) de khong vo prefab da gan, nhung chi dung itemGray.
    pickItem: function (m) {
        return this.itemGray || this.itemBlue || this.itemGreen || this.itemYellow
            || this.itemPurple || this.itemOrange || this.itemRed;
    },

    // To mau chu + an nen mau cua o + thu o cho vua DAI.
    // Sunwin: dai `background_rate_history` rong 801px chua 10 o -> moi o ~78px, cac o SAT NHAU.
    // Ban cu: o 97px + spacingX 40 => 10 o chiem 1330px, tran gap ruoi.
    applyRateStyle: function (node, m) {
        if (!node || !node.isValid) return;
        var sp = node.getComponent(cc.Sprite);
        if (sp) sp.enabled = false;                       // bo nen mau tung o
        node.width = this.itemWidth;
        var v = node.getChildByName('value');
        var lb = v ? v.getComponent(cc.Label) : null;
        if (lb) {
            lb.node.width = this.itemWidth;
            if (typeof cc.PhoenixRateColor !== 'undefined') {
                lb.node.color = cc.PhoenixRateColor.get(m);   // bang mau chep tu AviatorConstant.js
            }
        }
    },

    initListSoiCau: function (data) {
        if (data.length === 0) {
            return;
        }

        if (!this.layoutParent.children.length) {
            // Dung maxItems (8 nhu sunwin), KHONG hardcode 10. Chay tu CU -> MOI nen children[0] la o cu nhat.
            for (let i = this.maxItems - 1; i >= 0; i--) {
                let multiplier = data[i];
                if (!multiplier) continue;   // it van hon maxItems (DB moi) -> data[i] undefined -> tranh nem
                let prefab = cc.instantiate(this.pickItem(multiplier.Multiplier));
                let valueLabel;

                this.layoutParent.addChild(prefab);
                valueLabel = prefab.getChildByName('value').getComponent(cc.Label);
                if (valueLabel) {
                    valueLabel.string = multiplier.Multiplier + 'x';
                }
                this.applyRateStyle(prefab, multiplier.Multiplier);
            }
        } else {
            // Vong khoi tao chay tu CU -> MOI nen children[0] = van CU NHAT, cuoi mang = MOI NHAT.
            // Truoc day xoa children[9] = xoa ngay o vua them, nen cac o cu DONG BANG vinh vien.
            // Xoa bot cho den khi con dung maxItems - 1 roi moi them o moi (phong khi maxItems bi giam).
            while (this.layoutParent.children.length >= this.maxItems) {
                this.layoutParent.children[0].removeFromParent();
            }
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
            this.applyRateStyle(prefab, multiplier.Multiplier);
        }
        cc.director.getScheduler().schedule(function () {
            var kids = this.layoutParent.children;
            var last = kids[kids.length - 1];   // chip mới nhất (lịch sử < 10 ván vẫn đúng, tránh children[9] undefined -> tween lỗi)
            if (!last) return;
            cc.Tween.stopAllByTarget(last);
            cc.tween(last)
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