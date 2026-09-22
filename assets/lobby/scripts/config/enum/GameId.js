/**
 * Created by Nofear on 9/25/2017.
 */

(function () {
    cc.GameId = cc.Enum({
        ALL: '-1',

        VQMM: '10',
        TAI_XIU: '8',
        TAI_XIU_SIEU_TOC: '81',
		TAI_XIU_MD5: '68',
		SICBO: '70',
        MINI_POKER: '11',
        SEVEN77: '7',
        BLOCK_BUSTER: '12',
        LUCKY_WILD: '13',

        THREE_KINGDOM: '2',
        EGYPT: '4',
        AQUARIUM: '1',
        DRAGON_BALL: '15',
        BUM_BUM: '24', //16
        COWBOY: '3',
        MONKEY: '90',
        GAINHAY: '17', // gai nhảy
        DRAGON_TIGER: '14',
        CHICKEN_FIGHT: '110', // Đá Gà
        XENG_777: '109', // Xèng 777
        AVIATOR: '115', // Aviator (crash game)
        PHOENIX: '116', // Hỏa Phụng (crash game phượng hoàng)
        BACCARAT: '19',

        // ════════════════════════════════════════════════════════════════════════════════
        //  HO GAME BAI .NET 10 — be tu Go88, dai ma 200+
        //
        //  Cap phat theo thu tu be, va PHAI khop voi so sach ben server (Protocol.cs):
        //     200 CaoRua · 201 Lieng · 202 XiTo · 203 Poker · 204 Catte
        //     205 Phom   · 206 TLMN  · 207 SamLoc · 208 MauBinh
        //  Cao Rua la canh lech duy nhat: client 117 vs so sach 200, do lich su.
        //
        //  Cac so nay cung la KHOA cua TEN_MIEN_THEO_GAME trong
        //  cardgame/scripts/GameConfigManager.js — moi game mot tien trinh, mot ten mien.
        // ════════════════════════════════════════════════════════════════════════════════
        CAO_RUA: '117',      // Cao Rua = Ba Cay be tu Go88
        LIENG: '201',
        XI_TO: '202',
        POKER_TEXAS: '203',  // Texas Hold'em — PokerController.js co flop/preflop/blind/dealer
        CATTE: '204',
        PHOM: '205',
        TIEN_LEN_MN: '206',
        SAM_LOC: '207',
        MAU_BINH: '208',     // con goi la Xap Xam

        // ════════════════════════════════════════════════════════════════════════════════
        //  🔴 MOI KHOA `*_CU` DUOI DAY LA GAME DA CHET — BUNDLE VA SCRIPT DA BI XOA (2026-09-22)
        //
        //  Chung KHONG mo duoc nua. Ban thay the deu nam o dai 200+ ngay ben tren, va da
        //  LAY LAI dung ten dep: MAU_BINH, TIEN_LEN_MN, POKER_TEXAS, SAM_LOC, PHOM, LIENG.
        //
        //  VI SAO VAN GIU LAI: Config.js:379-396 dung chung de tra ma -> TEN HIEN THI. Lich su
        //  giao dich cua nguoi choi van con nhung van cu; xoa ma di thi lich su hien "Game#55"
        //  thay vi "Mau Binh".
        //
        //  🔴 DUNG dung chung cho viec moi. Bay "mot doi tuong hai khoa trung ten" DA SAP MOT
        //  LAN: khai PHOM: '205' canh PHOM: '52' thi JS lay cai CUOI, va game moi thanh vo hinh
        //  ma khong mot dong loi nao. kiem-tra.js bat duoc, nhung dung trong cho vao do.
        // ════════════════════════════════════════════════════════════════════════════════
        BA_CAY_CU: '51',
        PHOM_CU: '52',
        POKER_HK: '53',
        TIEN_LEN_MN_CU: '54',
        MAU_BINH_CU: '55',
        TIEN_LEN_MB: '56',
        POKER_TEXAS_CU: '57',
        SAM_LOC_CU: '58',
        LIENG_CU: '59',
        CHAN: '60',
        BA_CAY_GA: '61',
        BA_CAY_BIEN: '62',
        XOC_XOC: '63',
        BAUCUA: '20',

        TIEN_LEN_MN_NHAT_AN_TAT: '64',
        MAYA_QUEST: '65',
        TIEN_LEN_MN_SOLO_CU: '66',
        SAM_LOC_SOLO: '67',
        LODE: '21',
        VIETLOT: '22',

        SHOOT_FISH: '23',
        THUONG_HAI: '16',

        EVENT_TREASURE: 'EVENT_TREASURE',
        ESPORTS: '99'
    });

}).call(this);
