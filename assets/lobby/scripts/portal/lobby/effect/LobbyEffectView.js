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
             * Banner cach MEP PHAI man hinh bao nhieu px.
             * Thu ngay luc chay: cc.leNoHu(30)
             */
            leMepPhai: 20,

            /**
             * Banner lech bao nhieu so voi TAM DOC man hinh (am = xuong duoi).
             * Thu ngay luc chay: cc.caoNoHu(-234)
             */
            lechTamDoc: -234,
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

            /* Canh ngay luc chay, khoi build lai moi lan thu. Ca hai deu hien
               thu luon va in ra so de ghi vao Inspector cua LobbyEffectView.
                   cc.leNoHu(30)     <- cach mep PHAI bao nhieu px
                   cc.caoNoHu(-234)  <- lech bao nhieu so voi TAM DOC (am = xuong)
               Doi sang gia lap iPad/dien thoai roi goi lai de kiem tra ca hai. */
            cc.leNoHu = function (px) {
                if (!cc.isValid(self)) { cc.warn('[leNoHu] LobbyEffectView khong con song'); return; }
                self.leMepPhai = px;
                cc.log('[leNoHu] leMepPhai = ' + px);
                cc.testNoHu();
            };

            cc.caoNoHu = function (lech) {
                if (!cc.isValid(self)) { cc.warn('[caoNoHu] LobbyEffectView khong con song'); return; }
                self.lechTamDoc = lech;
                var man = cc.view.getVisibleSize();
                cc.log('[caoNoHu] lechTamDoc = ' + lech
                    + '  (man ' + man.width.toFixed(0) + 'x' + man.height.toFixed(0)
                    + ' -> banner o WORLD y = ' + (man.height / 2 + lech).toFixed(0) + ')');
                cc.testNoHu();
            };
        },

        onDestroy: function () {
            cc.leNoHu = undefined;
            cc.caoNoHu = undefined;
            if (cc.testNoHu) cc.testNoHu = undefined;
        },

        /**
         * Neo banner vao MEP PHAI + TAM DOC man hinh, tinh lai moi lan hien.
         *
         * Vi tri node trong scene chi con dung de tham khao — ca hai truc deu
         * duoc tinh lai o day, nen keo node trong editor khong an thua. Chinh
         * bang 2 thuoc tinh leMepPhai / lechTamDoc.
         */
        _neoViTri: function () {
            var TRAI = 113, PHAI = 135;   // noi dung trai ra 2 ben goc prefab
            var DEM = 10;
            var man = cc.view.getVisibleSize();

            var wx = man.width - this.leMepPhai - PHAI;
            /* Man qua hep thi thu mep phai truoc, nhung khong duoc de lot mep
               trai — tha sat goc con hon bien mat mot nua. */
            if (wx - TRAI < DEM) wx = DEM + TRAI;

            /* Neo theo TAM DOC, khong phai mep tren hay mep duoi. Do bang so
               lieu that: CanvasResizer.ts giu be rong 1561 CO DINH va co gian
               chieu cao (desktop 732 -> iPad Air 2 thanh 2081.33). Con toan bo
               noi dung lobby nam trong 'offset-left' o y=0 cua khung phu kin
               man, tuc CAN GIUA theo chieu doc.
               Bam mep tren thi tren iPad banner treo lo lung cach cum game hang
               tram pixel — do dung la trieu chung 'van bi lech'. */
            var wy = man.height / 2 + this.lechTamDoc;

            this.node.setPosition(this.node.parent.convertToNodeSpaceAR(cc.v2(wx, wy)));
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
            this._neoViTri();

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
