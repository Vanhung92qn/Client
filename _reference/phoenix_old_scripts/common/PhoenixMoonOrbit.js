/**
 * Created by TrungMTA on 9/25/2024.
 */
cc.Class({
    extends: cc.Component,

    properties: {
        earth: cc.Node,
        moons: {
            default: [],
            type: [cc.Node],
        },
        orbitRadius: 150,
        orbitSpeed: 20,
        earthRotationSpeed: 5,
    },

    onLoad() {
        this.angle = 0;
        this.moonAngles = [];
        this.orbitDirections = [];
        for (let i = 0; i < this.moons.length; i++) {
            this.orbitDirections[i] = (i % 2 === 0) ? 1 : -1;
            this.moonAngles[i] = i * 360 / this.moons.length;
        }

        this.resetMoonPositions();
    },

    update(dt) {
        this.earth.angle += this.earthRotationSpeed * dt;

        for (let i = 0; i < this.moons.length; i++) {
            this.moonAngles[i] += this.orbitDirections[i] * this.orbitSpeed * dt;
            let radian = cc.misc.degreesToRadians(this.moonAngles[i]);
            let moonX = this.earth.x + this.orbitRadius * Math.cos(radian);
            let moonY = this.earth.y + this.orbitRadius * Math.sin(radian);
            this.moons[i].setPosition(moonX, moonY);
        }
    },

    resetMoonPositions() {
        for (let i = 0; i < this.moons.length; i++) {
            let radian = cc.misc.degreesToRadians(this.moonAngles[i]);
            let x = this.earth.x + this.orbitRadius * Math.cos(radian);
            let y = this.earth.y + this.orbitRadius * Math.sin(radian);
            this.moons[i].setPosition(x, y);
        }
    },
});

