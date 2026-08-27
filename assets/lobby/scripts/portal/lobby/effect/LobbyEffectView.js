/**
 * Created by Nofear on 6/7/2017.
 */

var portalConfig = require('PortalConfig');

(function () {
    cc.LobbyEffectView = cc.Class({
        "extends": cc.Component,
        properties: {
            prefabEffect: cc.Prefab,
        },

        onLoad: function () {
            cc.LobbyController.getInstance().setLobbyEffectView(this);
            this.node.parent.zIndex = cc.NoteDepth.PORTAL_JACKPOT_EFFECT;
            this.nodeEffect = null;

            /* Cong tac thu tay. Go vao Console trinh duyet (hoac cua so preview
               cua Cocos):
                   cc.testNoHu()
                   cc.testNoHu('SumClub', 88888888, 'Ai Cap')

               Vi sao can: hieu ung that phu thuoc server ban tin xuong, khong
               the ngoi cho no hu de canh vi tri. Co cai nay thi goi bao nhieu
               lan tuy y.

               Co tinh KHONG dung phim tat: nguoi choi bam nham la hien thong
               bao no hu gia giua lobby. */
            var self = this;
            cc.testNoHu = function (nickName, jackpotValue, gameName) {
                if (!cc.isValid(self)) { cc.warn('[testNoHu] LobbyEffectView khong con song'); return; }
                self.showFxWinJackpot({
                    NickName: nickName || 'NguoiChoiThu',
                    JackpotValue: jackpotValue || 123456789,
                    GameName: gameName || 'Ai Cap',
                });
            };

            /* Canh vi tri ngay luc chay, khoi build lai moi lan thu:
                   cc.viTriNoHu(780, 620)   <- toa do WORLD muon dat
               No doi node roi hien thu luon, va in ra so LOCAL de ghi vao scene.
               Chi co tac dung khi da tat animation (playOnLoad=false trong
               lobbyEffectItem.prefab) — con anim thi vi tri bi ghi de. */
            cc.viTriNoHu = function (worldX, worldY) {
                if (!cc.isValid(self)) { cc.warn('[viTriNoHu] LobbyEffectView khong con song'); return; }
                var n = self.node;
                n.setPosition(n.parent.convertToNodeSpaceAR(cc.v2(worldX, worldY)));
                cc.log('[viTriNoHu] lobbyEffectView local = ('
                    + n.x.toFixed(1) + ', ' + n.y.toFixed(1) + ')  -- doc so nay cho toi de ghi vao scene');
                cc.testNoHu();
            };
        },

        onDestroy: function () {
            if (cc.testNoHu) cc.testNoHu = undefined;
        },

        showFxWinJackpot: function (user) {
            this.forceDestroyEffect();

            this.nodeEffect = cc.instantiate(this.prefabEffect);
            this.nodeEffect.parent = this.node;
            this.nodeEffect.setPosition(0, 0);
            this.nodeEffect.getComponent(cc.LobbyEffectItem).updateUser(this, user);
            this.animationEffect = this.nodeEffect.getComponent(cc.Animation);

            cc.director.getScheduler().schedule(this.destroyEffect, this, 0, 0, portalConfig.TIME_SHOW_EFFECT_JACKPOT, false);
        },

        forceDestroyEffect: function () {
            if (cc.isValid(this.nodeEffect)) {
                this.nodeEffect.destroy();
                this.animationEffect = null;
                this.nodeEffect = null;
                this.unscheduleAllCallbacks();
            }
        },

        destroyEffect: function () {
            if (this.animationEffect === null) return;
            /* Da TAT animation cu theo yeu cau: cho hien thi thay duoc truoc,
               animation tinh sau. Clip 'fadeIn' (thuc ra la clip BIEN MAT) van
               con nguyen trong prefab, bo comment dong duoi la chay lai.

               Rieng clip HIEN RA ('fadeOut', playOnLoad) da tat trong prefab vi
               no keo ca vi tri: track 'position' ghi de setPosition(0,0) thanh
               (642.055, 233.576) — do runtime that thi node bay ra ngoai mep
               phai 431.8px nen khong ai nhin thay. Toa do do la rac thua, vi
               2 clip nay dung CHUNG voi btnMINI va TOPJackpotWinView. */
            // this.animationEffect.play('fadeIn');
            var self = this;
            cc.director.getScheduler().schedule(function () {
                if (cc.isValid(self.nodeEffect)) {
                    self.nodeEffect.destroy();
                }
            }, this, 0, 0, 0.15, false);
        },
    });
}).call(this);
