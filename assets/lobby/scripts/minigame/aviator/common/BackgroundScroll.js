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
        this.totalWidth = this.backgrounds[0].width;
        this.resetPositions();
    },

    update(dt) {
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
