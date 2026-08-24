(function () {
    cc.LodeTabButton = cc.Class({
        extends: cc.Component,
        properties: {
            //Sprite hien thi (de trong = tu lay cc.Sprite tren chinh node nay)
            sprite: cc.Sprite,
            //Anh khi nut DUOC chon (sang)
            sfOn: cc.SpriteFrame,
            //Anh khi nut KHONG chon (toi)
            sfOff: cc.SpriteFrame,
        },
        onLoad: function () {
            if (!this.sprite) this.sprite = this.node.getComponent(cc.Sprite);
        },
        //Selectheader / LodeView goi ham nay de bat/tat sang
        setSelected: function (selected) {
            if (!this.sprite) this.sprite = this.node.getComponent(cc.Sprite);
            if (!this.sprite) return;
            var sf = selected ? this.sfOn : this.sfOff;
            if (sf) this.sprite.spriteFrame = sf;
        },
    });
}.call(this));
