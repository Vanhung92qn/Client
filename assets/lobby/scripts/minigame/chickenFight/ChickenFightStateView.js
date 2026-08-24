// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.ChickenFightStateView = cc.Class({
        extends: cc.Component,

        properties: {
            nodeWindowBetting: cc.Node,
            nodeWindowEnBetting: cc.Node,
            nodeWindowPlaying: cc.Node,
            nodePreview: cc.Node,
            spChickenPreviewLeft: sp.Skeleton,
            spChickenPreviewRight: sp.Skeleton,
            chickenInfoLeft: cc.ChickenInfo,
            chickenInfoRight: cc.ChickenInfo,
            btnTie: cc.Button,
            btnBigTie: cc.Button,
            spResults: [cc.SpriteFrame],
            lbResult: sp.Skeleton,
            spResult: cc.Sprite,
        },

        // LIFE-CYCLE CALLBACKS:

        onLoad() {
            this.chickenSkins = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            this.controller = cc.ChickenFightController.getInstance();
            this.controller.setStateView(this);
        },

        start() {
            this.currentPharse = null;
        },

        onDestroy() {
            this.controller.setStateView(null);
        },

        changePharse: function (event, pharse) {
            this.handleChangePharse(pharse);
        },

        handleChangePharse: function (sessionInfo) {
            var pharse = sessionInfo.Phrase;
            if (this.currentPharse == pharse) {
                return;
            }

            this.currentPharse = pharse;
            this.nodeWindowBetting.active = false;
            this.nodeWindowEnBetting.active = false;
            this.nodeWindowPlaying.active = false;

            switch (parseInt(pharse)) {
                case cc.ChickenFightPharse.WAITING:
                    this.nodeWindowPlaying.active = true;
                    break;
                case cc.ChickenFightPharse.PREVIEW:
                    //this.getChicken();
                    this.setChicken(sessionInfo);
                    this.nodePreview.active = true;
                    this.nodeWindowBetting.active = true;
                    this.nodeWindowPlaying.active = true;
                    this.showChicken(false);
                    this.activeBtnBet(false);

                    this.nodeWindowBetting.opacity = 0;
                    cc.tween(this.nodeWindowBetting)
                        .to(0.3, { opacity: 255 }).start();
                    break;
                case cc.ChickenFightPharse.BETTING:
                    this.setChicken(sessionInfo);
                    this.nodePreview.active = true;
                    this.nodeWindowBetting.active = true;
                    this.showChicken(false);
                    this.activeBtnBet(true);
                    break;
                case cc.ChickenFightPharse.END_BETTING:
                    this.setChicken(sessionInfo);
                    this.nodePreview.active = true;
                    this.nodeWindowEnBetting.active = true;
                    this.showChicken(false);
                    this.activeBtnBet(false);
                    this.startFighting();
                    break;
                case cc.ChickenFightPharse.START_FIGHTING:
                    this.setChicken(sessionInfo);
                    this.nodeWindowPlaying.active = true;
                    this.nodePreview.active = false;
                    this.showChicken(true);
                    this.activeBtnBet(false);
                    break;
                case cc.ChickenFightPharse.FIGHTING:
                    this.setChicken(sessionInfo);
                    this.nodeWindowPlaying.active = true;
                    this.nodePreview.active = false;
                    this.showChicken(true);
                    this.activeBtnBet(false);
                    break;
                case cc.ChickenFightPharse.END_FIGHTING:
                    this.setChicken(sessionInfo);
                    this.nodeWindowPlaying.active = true;
                    this.nodePreview.active = false;
                    this.showChicken(true);
                    this.activeBtnBet(false);
                    break;
                case cc.ChickenFightPharse.RESULT:
                    this.setChicken(sessionInfo);
                    this.nodeWindowPlaying.active = true;
                    this.nodePreview.active = false;
                    this.showChicken(true);
                    this.activeBtnBet(false);
                    break;
            }
        },

        changeWindow: function (pharse) {
            switch (pharse) {
                case cc.ChickenFightPharse.WAITING:

                    break;
                case cc.ChickenFightPharse.BETTING:
                    break;
                case cc.ChickenFightPharse.END_BETTING:
                    break;
                case cc.ChickenFightPharse.FIGHTING:
                    break;
                case cc.ChickenFightPharse.RESULT:
                    break;
            }
        },

        showChicken: function (show) {
            if (show) {
                this.chickenInfoLeft.show();
                this.chickenInfoRight.show();
            } else {
                this.chickenInfoLeft.hide();
                this.chickenInfoRight.hide();
            }
        },

        activeBtnBet: function (active) {
            this.btnTie.interactable = active;
            this.btnBigTie.interactable = active;
        },

        getRandomSkin: function () {
            const index = Math.floor(Math.random() * this.chickenSkins.length);

            return this.chickenSkins[index]
        },

        getChicken: function () {
            const chickenLeftSkin = this.getRandomSkin();
            const chickenRightSkin = this.getRandomSkin();

            this.spChickenPreviewLeft.setSkin(chickenLeftSkin);
            this.spChickenPreviewRight.setSkin(chickenRightSkin);
            this.spChickenPreviewLeft.setAnimation(0, cc.ChickenFightState.PREVIEW_LEFT, true);
            this.spChickenPreviewRight.setAnimation(0, cc.ChickenFightState.PREVIEW_RIGHT, true);

            this.chickenInfoLeft.setInfo({
                name: 'Ga Trai',
                hp: 300,
                skin: chickenLeftSkin
            });

            this.chickenInfoRight.setInfo({
                name: 'Ga Phai',
                hp: 300,
                skin: chickenRightSkin
            });
        },

        setChicken: function (sessionInfo) {
            const chickenLeftSkin = sessionInfo.ChickenFightLeft.Skin;
            const chickenRightSkin = sessionInfo.ChickenFightRight.Skin;

            this.chickenInfoLeft.setInfo(sessionInfo.ChickenFightLeft);

            this.chickenInfoRight.setInfo(sessionInfo.ChickenFightRight);

            this.spChickenPreviewLeft.setSkin(chickenLeftSkin);

            this.spChickenPreviewRight.setSkin(chickenRightSkin);

            this.spChickenPreviewLeft.setAnimation(0, cc.ChickenFightState.PREVIEW_LEFT, true);
            this.spChickenPreviewRight.setAnimation(0, cc.ChickenFightState.PREVIEW_RIGHT, true);


        },

        fight: function (isFirst) {
            if (isFirst) {
                this.chickenInfoLeft.setAnimation(cc.ChickenFightState.START, false);
                this.chickenInfoRight.setAnimation(cc.ChickenFightState.START, false);
                return;
            }

            const actions = [
                {
                    name: 'ATK',
                    skills: [
                        {
                            name: 'NORMAL',
                            damageMin: 5,
                            damageMax: 15,
                            probability: 0.6,
                            animation: cc.ChickenFightState.ATK_NORMAL,
                            effect: cc.ChickenFightEffect.NONE
                        },
                        {
                            name: 'STRONG',
                            damageMin: 30,
                            damageMax: 50,
                            probability: 0.3,
                            animation: cc.ChickenFightState.ATK_STRONG,
                            effect: cc.ChickenFightEffect.NONE
                        },
                        {
                            name: 'CRITICAL',
                            damageMin: 100,
                            damageMax: 100,
                            probability: 0.1,
                            animation: cc.ChickenFightState.ATK_CRITICAL,
                            effect: cc.ChickenFightEffect.CRIT
                        },
                    ]
                },
                {
                    name: 'DEF',
                    skills: [
                        {
                            name: 'BACK',
                            probability: 0.4,
                            animation: cc.ChickenFightState.DEF_BACK,
                            effect: cc.ChickenFightEffect.MISS,
                            dmgReduction: 1,
                        },
                        {
                            name: 'HIT',
                            probability: 0.3,
                            animation: cc.ChickenFightState.DEF_HIT,
                            effect: cc.ChickenFightEffect.NONE,
                            dmgReduction: 0,
                        },
                        {
                            name: 'TUMBLE',
                            probability: 0.3,
                            animation: cc.ChickenFightState.DEF_TUMBLE,
                            effect: cc.ChickenFightEffect.NONE,
                            dmgReduction: .3,
                        },
                    ]
                },
            ];

            const chickenLeftAction = Math.floor(Math.random() * actions.length);
            const chickenLeftSkill = this.getRandomSkill(actions[chickenLeftAction]);

            const chickenRightAction = Math.floor(Math.random() * actions.length);
            const chickenRightSkill = this.getRandomSkill(actions[chickenRightAction]);

            this.chickenInfoLeft.setAnimation(chickenLeftSkill.animation, false);
            this.chickenInfoLeft.setEffect(chickenLeftSkill.effect);
            this.chickenInfoRight.setAnimation(chickenRightSkill.animation, false);
            this.chickenInfoRight.setEffect(chickenRightSkill.effect);

            if (chickenLeftAction == 0) {
                let damage = Math.round(this.getRandomNumber(chickenLeftSkill.damageMin, chickenLeftSkill.damageMax));


                if (chickenRightAction == 1) {
                    damage -= Math.round(damage * chickenRightSkill.dmgReduction);
                }

                this.chickenInfoRight.minusHp(damage);

            }

            if (chickenRightAction == 0) {
                let damage = Math.round(this.getRandomNumber(chickenRightSkill.damageMin, chickenRightSkill.damageMax));

                if (chickenLeftAction == 1) {
                    damage -= Math.round(damage * chickenLeftSkill.dmgReduction);
                }

                this.chickenInfoLeft.minusHp(damage);
            }

            if (this.chickenInfoLeft.getHp() == 0) {
                this.chickenInfoLeft.setAnimation(cc.ChickenFightState.END_LOSER, false);
            }

            if (this.chickenInfoRight.getHp() == 0) {
                this.chickenInfoRight.setAnimation(cc.ChickenFightState.END_LOSER, false);
            }
        },

        getRandomNumber: function (min, max) {
            return Math.random() * (max - min) + min;
        },

        handleClickFight: function () {
            this.getChicken();
            var isFist = true;
            var interval = setInterval(() => {
                if (this.chickenInfoLeft.getHp() != 0 && this.chickenInfoRight.getHp() != 0) {
                    this.fight(isFist);
                    isFist = false;
                }
                else {
                    this.showWinner();
                    clearInterval(interval);
                }
            }, [1000]);
        },

        getRandomSkill: function (action) {
            let totalProbability = 0;
            const skills = action.skills;
            skills.forEach((skill) => (totalProbability += skill.probability));

            const randomValue = Math.random() * totalProbability;
            let currentProbability = 0;

            for (const skill of skills) {
                if (randomValue < currentProbability + skill.probability) {
                    return skill;
                }
                currentProbability += skill.probability;
            }

            // If no skill was selected, return null or a default skill
            return null;
        },

        showWinner: function (typeWin) {
            this.lbResult.node.active = true;

            if (typeWin == cc.ChickenFightBetSide.DRAGON) {
                this.lbResult.setAnimation(0, 'red', false);
                this.spResult.spriteFrame = this.spResults[0];
            }
            else if (typeWin == cc.ChickenFightBetSide.PHONIX) {
                this.lbResult.setAnimation(0, 'blue', false);
                this.spResult.spriteFrame = this.spResults[1];
            }
            else if (typeWin == cc.ChickenFightBetSide.TIE) {
                this.lbResult.setAnimation(0, 'green', false);
                this.spResult.spriteFrame = this.spResults[2];
            } else {
                this.lbResult.setAnimation(0, 'green', false);
                this.spResult.spriteFrame = this.spResults[3];
            }

            cc.director.getScheduler().schedule(function () {
                cc.tween(this.lbResult.node)
                    .to(.3, { opacity: 0 }).start();
            }, this, 2, 0, 0, false);

            cc.director.getScheduler().schedule(function () {
                this.lbResult.node.active = false;
                this.lbResult.node.opacity = 255;

            }, this, 3, 0, 0, false);

        },

        updateChickenFight: function (sessionInfo) {
            this.chickenInfoLeft.updateInfo(sessionInfo.ChickenFightLeft);
            this.chickenInfoRight.updateInfo(sessionInfo.ChickenFightRight);
            this.callAudioFight(sessionInfo.ChickenFightLeft);
            this.callAudioFight(sessionInfo.ChickenFightRight);
        },

        callAudioFight: function (chickenInfo) {
            switch (chickenInfo.Animation) {
                case cc.ChickenFightState.ATK_CRITICAL:
                case cc.ChickenFightState.ATK_NORMAL:
                case cc.ChickenFightState.ATK_STRONG:
                    if (chickenInfo.Effect == cc.ChickenFightEffect.NONE) {
                        cc.AudioController.getInstance().getAudioPool().enableAtk();
                    } else {
                        cc.AudioController.getInstance().getAudioPool().enableCrift();
                    }
                    break;
                case cc.ChickenFightState.DEF_BACK:
                case cc.ChickenFightState.DEF_HIT:
                case cc.ChickenFightState.DEF_TUMBLE:
                    if (chickenInfo.Effect == cc.ChickenFightEffect.NONE) {
                        cc.AudioController.getInstance().getAudioPool().enableDef();
                    } else {
                        cc.AudioController.getInstance().getAudioPool().enableMiss();
                    }
                    break;
            }
        },

        startFighting: function () {
            this.chickenInfoLeft.setAnimation(cc.ChickenFightState.START, false);
            this.chickenInfoRight.setAnimation(cc.ChickenFightState.START, false);
        },

        showWinChickenFight: function (typeWin, sessionInfo) {
            this.chickenInfoLeft.updateInfo(sessionInfo.ChickenFightLeft);
            this.chickenInfoRight.updateInfo(sessionInfo.ChickenFightRight);

            this.showWinner(typeWin);
        }



        // update (dt) {},
    });
}).call(this);