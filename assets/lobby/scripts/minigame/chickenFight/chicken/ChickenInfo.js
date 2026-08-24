// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.ChickenInfo = cc.Class({
        extends: cc.Component,

        properties: {
            chickenName: cc.Label,
            lbMaxHp: cc.Label,
            lbHp: cc.Label,
            spHp: cc.Sprite,
            miss: cc.Node,
            crit: cc.Node,
            chicken: sp.Skeleton,
        },

        // LIFE-CYCLE CALLBACKS:

        onLoad() {
            this.resetEffect();
            this.hp = 0;
        },

        start() {

        },

        setInfo: function (info) {
            this.chickenName.string = info.Name;
            this.lbMaxHp.string = info.Hp;
            this.lbHp.string = info.CurrentHp;
            this.spHp.node.width = 455;
            this.resetEffect();
            this.hp = info.CurrentHp;
            this.maxHp = info.Hp;
            this.chicken.setSkin(info.Skin);

            this.spHp.node.width = 455 * ((this.hp * 1.0) / this.maxHp);
        },

        updateInfo: function (info) {
            this.chickenName.string = info.Name;
            this.lbMaxHp.string = info.Hp;
            this.lbHp.string = info.CurrentHp;
            this.spHp.node.width = 455;
            this.resetEffect();
            this.hp = info.CurrentHp;
            this.maxHp = info.Hp;

            this.chicken.setSkin(info.Skin);

            this.setAnimation(info.Animation, false);
            this.setEffect(info.Effect);

            this.spHp.node.width = 455 * ((this.hp * 1.0) / this.maxHp);
        },

        hide: function () {
            this.chicken.node.active = false;
            this.resetEffect();
        },

        show: function () {
            this.chicken.node.active = true;
            this.resetEffect();
        },

        resetEffect: function () {
            this.miss.active = false;
            this.crit.active = false;
        },

        setAnimation: function (animName, isLoop) {
            this.chicken.setAnimation(0, animName, isLoop)
        },

        setEffect: function (effect) {
            this.resetEffect();

            switch (effect) {
                case cc.ChickenFightEffect.NONE:
                    break;
                case cc.ChickenFightEffect.CRIT:
                    this.crit.active = true;
                    break;
                case cc.ChickenFightEffect.MISS:
                    this.miss.active = true;
                    break;
            }
        },

        minusHp: function (damage) {
            this.hp -= damage;

            if (this.hp < 0) {
                this.hp = 0;
            }

            this.lbHp.string = this.hp;
            this.spHp.node.width = 455 * ((this.hp * 1.0) / this.maxHp);
        },

        getHp: function () {
            return this.hp;
        }

        // update (dt) {},
    });
}).call(this);