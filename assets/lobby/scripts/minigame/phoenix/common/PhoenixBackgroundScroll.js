/**
 * Created by TrungMTA on 9/25/2024.
 */
 
cc.Class({
    extends: cc.Component,

    properties: {
        speed: 100,
        backgrounds: {
            default: [],
            type: [cc.Node],
        },
    },

    onLoad() {
        this.totalWidth = this.backgrounds.length ? this.backgrounds[0].width : 0;
        this.resetPositions();
    },

    update(dt) {
        // HOA PHUNG: chi troi khi phuong BAY (luc cho/dau -> nen dung yen).
        if (typeof cc.PhoenixController !== 'undefined' && typeof cc.PhoenixState !== 'undefined') {
            var ctrl = cc.PhoenixController.getInstance();
            if (ctrl) {
                var s = ctrl.getCurrentState();
                if (s != null && s !== cc.PhoenixState.FLYING) return;
            }
        }
        for (let i = 0; i < this.backgrounds.length; i++) {
            this.backgrounds[i].x -= this.speed * dt;
            if (this.backgrounds[i].x <= -this.totalWidth) {
                this.backgrounds[i].x += this.totalWidth * this.backgrounds.length;
            }
        }
    },

    resetPositions() {
        for (let i = 0; i < this.backgrounds.length; i++) {
            this.backgrounds[i].x = i * this.totalWidth;
        }
    },
});
