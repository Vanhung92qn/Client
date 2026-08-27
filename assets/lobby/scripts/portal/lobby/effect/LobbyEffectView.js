/**
 * Created by Nofear on 6/7/2017.
 */

var portalConfig = require('PortalConfig');

(function () {
    cc.LobbyEffectView = cc.Class({
        "extends": cc.Component,
        properties: {
            prefabEffect: cc.Prefab,

            /**
             * Banner cach MEP PHAI man hinh bao nhieu px. Muon xe ra xa goc thi
             * tang so nay. Chinh duoc o Inspector, hoac thu ngay luc chay bang
             * cc.leNoHu(30).
             *
             * 🔴 Toa do X cua node duoc TINH LAI luc chay theo be rong man hinh
             * that, nen keo node theo chieu NGANG trong editor se khong an thua
             * — dung so nay. Toa do Y thi van keo binh thuong: canvas web chay
             * FIXED_HEIGHT (SafeArea.js) nen chieu cao luon 732, truc doc khong
             * bao gio lech.
             */
            leMepPhai: 20,
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

            /* Canh ngay luc chay, khoi build lai moi lan thu.
                   cc.leNoHu(30)    <- cach mep PHAI bao nhieu px
                   cc.caoNoHu(400)  <- cao bao nhieu (toa do WORLD Y)
               Ca hai deu hien thu luon va in ra so de ghi vao scene. */
            cc.leNoHu = function (px) {
                if (!cc.isValid(self)) { cc.warn('[leNoHu] LobbyEffectView khong con song'); return; }
                self.leMepPhai = px;
                cc.log('[leNoHu] leMepPhai = ' + px + '  -- ghi vao Inspector cua LobbyEffectView');
                cc.testNoHu();
            };

            cc.caoNoHu = function (worldY) {
                if (!cc.isValid(self)) { cc.warn('[caoNoHu] LobbyEffectView khong con song'); return; }
                var n = self.node;
                n.y = n.parent.convertToNodeSpaceAR(cc.v2(0, worldY)).y;
                cc.log('[caoNoHu] lobbyEffectView Position Y = ' + n.y.toFixed(1)
                    + '  -- ghi vao Inspector (rieng X thi bo qua, no duoc tinh lai luc chay)');
                cc.testNoHu();
            };
        },

        onDestroy: function () {
            cc.leNoHu = undefined;
            cc.caoNoHu = undefined;
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
        /**
         * Neo banner vao MEP PHAI man hinh, tinh lai moi lan hien.
         *
         * VI SAO CAN: node cha 'widget-top-left-noHide' ghim cach mep phai 755px
         * CO DINH. Cong local x=450 thanh banner cach mep phai 195px — o do phan
         * giai thiet ke 1561px thi dep, nhung man cang hep thi 195px cang chiem
         * ti le lon:
         *
         *     16:9  rong 1301  banner 858..1106   ok
         *     1:1   rong  732  banner 289..537    da troi vao GIUA man
         *     9:16  rong  412  banner -32..216    LOT mep trai 32px
         *     9:19.5 rong 338  banner -106..142   LOT mep trai 106px
         *
         * Chi tinh lai truc X. Truc Y giu nguyen so da keo trong editor: canvas
         * web chay FIXED_HEIGHT nen chieu cao luon la 732, doc khong bao gio lech.
         */
        _neoMepPhai: function () {
            var TRAI = 113, PHAI = 135;   // noi dung trai ra 2 ben goc prefab
            var DEM_TRAI = 10;
            var rongMan = cc.view.getVisibleSize().width;

            var wx = rongMan - this.leMepPhai - PHAI;
            /* Man qua hep thi thu mep phai truoc, nhung khong duoc de lot mep
               trai — tha sat goc con hon bien mat mot nua. */
            if (wx - TRAI < DEM_TRAI) wx = DEM_TRAI + TRAI;

            this.node.x = this.node.parent.convertToNodeSpaceAR(cc.v2(wx, 0)).x;
        },

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
            this._neoMepPhai();

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
