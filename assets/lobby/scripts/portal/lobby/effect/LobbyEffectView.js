/**
 * Created by Nofear on 6/7/2017.
 */

var portalConfig = require('PortalConfig');

/**
 * Khung hinh THAT cua lobbyEffectItem, do so voi goc prefab.
 *
 * 🔴 Do bang cach duyet ca cay node va tinh theo ANCHOR cua tung node, dung
 * nham la banner bi cat. Node 'black' co _anchorPoint.x = -0.13 (AM), nen no
 * trai tu +43.3 den +291.8 chu khong phai can doi quanh goc:
 *
 *     black    anchor(-0.13, 0.5)  248.5 x 60.2  ->  x   43.3 .. 291.8
 *       richtext anchor(0, 0.5)    193.5 x 54.2  ->  x   83.0 .. 276.5
 *     hu_g     anchor( 0.5,  0.5)  197.7 x 126.0 ->  x  -84.9 .. 112.9
 *     ------------------------------------------------------------
 *     khung that:  x -84.86 .. +291.76   (rong 376.6, KHONG phai 248)
 *
 * Truoc day toi doan phai = 135 vi tuong 'black' neo giua. Sai 156.8px, va do
 * dung bang phan bi cat khoi mep phai man hinh.
 *
 * Sua prefab thi phai do lai bo so nay.
 */
var KHUNG = { trai: 84.86, phai: 291.76 };

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
                /* Bao lai so do THAT sau khi truot vao xong, de khoi phai ta
                   bang mat "con che mot ti". */
                self.scheduleOnce(function () {
                    if (!cc.isValid(self.nodeEffect)) return;
                    var k = self.nodeEffect.getBoundingBoxToWorld();
                    var rong = cc.view.getVisibleSize().width;
                    cc.log('[testNoHu] banner trai=' + k.xMin.toFixed(0)
                        + ' phai=' + k.xMax.toFixed(0)
                        + ' | man rong=' + rong.toFixed(0)
                        + ' | cach mep phai=' + (rong - k.xMax).toFixed(0) + 'px'
                        + (k.xMax > rong ? '  <-- CON BI CAT' : ''));
                }, 0.6);
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
            var TRAI = KHUNG.trai, PHAI = KHUNG.phai;
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
            /* Muon khuat han thi mep TRAI cua noi dung phai vuot qua mep phai
               man hinh. */
            var LE_TRAI = KHUNG.trai;
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

            /* Do san ra ngoai mep phai truoc, chua ai thay gi. */
            this.nodeEffect.setPosition(this._offsetNgoaiMan(), 0);

            /* Doi ~2 khung hinh roi moi do va truot vao.
               Vi sao phai doi: cc.RichText khong tinh lai kich thuoc ngay khi
               gan _string — no danh dau layout ban va cap nhat o khung sau. Do
               ngay lap tuc la van ra kich thuoc cu ghi trong prefab.
               30ms khong ai kip thay, ma doi lai la so do THAT. Lay du 2 khung
               chu khong 1, vi thu tu update giua RichText va scheduleOnce trong
               cung mot khung la khong dam bao. */
            this.scheduleOnce(function () {
                if (!cc.isValid(this.nodeEffect)) return;
                this._chinhChoVua();

                cc.tween(this.nodeEffect)
                    .to(0.45, { x: 0 }, { easing: 'cubicOut' })
                    .start();
            }, 0.03);

            cc.director.getScheduler().schedule(this.destroyEffect, this, 0, 0, portalConfig.TIME_SHOW_EFFECT_JACKPOT, false);
        },

        /**
         * Do khung THAT cua banner sau khi da do chu vao, roi day node sang trai
         * dung bang phan bi tran ra ngoai mep phai.
         *
         * 🔴 Vi sao khong ghi so cung: noi dung banner CO GIAN theo chu. Ten dai
         * + so tien lon + ten game dai thi cc.RichText phinh rong hon kich thuoc
         * ghi trong prefab, va phan phinh them do bi cat mat. Toi da doan sai
         * kich thuoc HAI LAN (135 roi 291.76) truoc khi hieu ra dieu nay — nen
         * bo doan, de chinh no tu do.
         *
         * KHUNG chi con dung de tinh diem xuat phat ngoai man, cho do khong can
         * chinh xac tuyet doi.
         */
        _chinhChoVua: function () {
            var n = this.nodeEffect;
            var khung = n.getBoundingBoxToWorld();
            if (!khung || khung.width <= 0) return;

            /* Khung do luc node dang o ngoai man, nen quy ve vi tri NGHI (x=0)
               bang cach tru di do lech dang co. */
            var mepPhaiKhiNghi = khung.xMax - n.x;
            var mepPhaiChoPhep = cc.view.getVisibleSize().width - this.leMepPhai;
            var tran = mepPhaiKhiNghi - mepPhaiChoPhep;

            if (tran > 0.5) this.node.x -= tran;
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
