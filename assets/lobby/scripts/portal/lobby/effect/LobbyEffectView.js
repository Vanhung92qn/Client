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

        /**
         * Khoang cach can day sang PHAI de banner nam tron ngoai mep man hinh.
         *
         * Tinh luc chay chu khong ghi cung so, vi do la dung cai bay vua sap:
         * fadeOut.anim ghi cung (642.055, 233.576) — toa do cua mot node khac tu
         * doi nao — nen node bay ra ngoai mep phai 431.8px va khong ai nhin thay.
         * Do lech do BAT BIEN voi moi do phan giai (cc.Widget ghim chuoi cha vao
         * mep PHAI), tuc no chua bao gio hien duoc tren bat ky may nao.
         *
         * Tinh dong thi keo node lobbyEffectView di dau animation van dung do.
         */
        _offsetNgoaiMan: function () {
            /* Goc prefab neo (0, 0.5), noi dung trai sang TRAI 113px va sang
               PHAI 135px. Muon khuat han thi mep TRAI cua noi dung phai vuot qua
               mep phai man hinh. */
            var LE_TRAI = 113;
            var DEM = 40;
            var rongMan = cc.view.getVisibleSize().width;
            var worldX = this.node.parent.convertToWorldSpaceAR(
                cc.v2(this.node.x, this.node.y)
            ).x;
            return Math.max(rongMan + LE_TRAI + DEM - worldX, 200);
        },

        showFxWinJackpot: function (user) {
            this.forceDestroyEffect();

            this.nodeEffect = cc.instantiate(this.prefabEffect);
            this.nodeEffect.parent = this.node;
            this.nodeEffect.getComponent(cc.LobbyEffectItem).updateUser(this, user);
            this.animationEffect = this.nodeEffect.getComponent(cc.Animation);

            /* Truot vao tu mep PHAI roi dung lai dung vi tri node.
               Dung cc.tween chu KHONG dung file .anim: .anim luu vi tri TUYET
               DOI, va do chinh la thu vua lam hong man nay. tween chay theo do
               lech tuong doi nen keo node di dau cung khong hong. */
            this.nodeEffect.setPosition(this._offsetNgoaiMan(), 0);
            cc.tween(this.nodeEffect)
                .to(0.45, { x: 0 }, { easing: 'cubicOut' })
                .start();

            cc.director.getScheduler().schedule(this.destroyEffect, this, 0, 0, portalConfig.TIME_SHOW_EFFECT_JACKPOT, false);
        },

        forceDestroyEffect: function () {
            if (cc.isValid(this.nodeEffect)) {
                cc.Tween.stopAllByTarget(this.nodeEffect);
                this.nodeEffect.destroy();
                this.animationEffect = null;
                this.nodeEffect = null;
                this.unscheduleAllCallbacks();
            }
        },

        destroyEffect: function () {
            if (!cc.isValid(this.nodeEffect)) return;

            /* Truot NGUOC ra mep phai roi moi huy. Ra cung ben voi luc vao:
               node nam sat mep phai nen duong ve ngan (~480px), snappy. Neu cho
               ra mep TRAI thi phai bang qua ca man hinh ~1370px — hoac cham le
               the, hoac nhanh den muc quet ngang mat nguoi choi.

               Huy trong .call() cua tween chu khong hen gio rieng: truoc day hen
               0.15s trong khi clip chay 0.333s nen node bi cat giua chung. */
            var self = this;
            cc.Tween.stopAllByTarget(this.nodeEffect);
            cc.tween(this.nodeEffect)
                .to(0.35, { x: this._offsetNgoaiMan() }, { easing: 'cubicIn' })
                .call(function () {
                    if (cc.isValid(self.nodeEffect)) self.nodeEffect.destroy();
                    self.nodeEffect = null;
                    self.animationEffect = null;
                })
                .start();
        },
    });
}).call(this);
