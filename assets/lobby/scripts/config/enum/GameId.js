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
        //  🔴 NAM MA DUOI DAY LA GAME DA BI XOA — DUNG DUNG CHO VIEC MOI
        //     BA_CAY 51 · TIEN_LEN_MN 54 · MAU_BINH 55 · POKER_TEXAS 57 · TIEN_LEN_MN_SOLO 66
        //
        //  Bundle, prefab va script cua chung da bi xoa khoi repo (2026-09-22). Ban thay the
        //  nam o dai 200+: CAO_RUA 117 · TLMN_GO 206 · XAP_XAM 208 · POKER_TEXAS_GO 203.
        //
        //  VI SAO VAN GIU LAI NAM MA NAY: Config.js dung chung de tra ma -> TEN HIEN THI
        //  (Config.js:379-396). Lich su giao dich cua nguoi choi van con nhung van cu, xoa
        //  ma di thi lich su hien "Game#55" thay vi "Mau Binh".
        //
        //  🔴 VIET cc.GameId.MAU_BINH TRONG MA MOI LA SAI — no tra 55, mot game khong con
        //  bundle. Ban dang muon la XAP_XAM (208). Bay nay DA SAP MOT LAN voi PHOM (xem
        //  ghi chu o PHOM_CU ben duoi).
        // ════════════════════════════════════════════════════════════════════════════════
        BA_CAY: '51',
        CAO_RUA: '117', // Cao Rua = Ba Cay be tu Go88. Thay han BA_CAY (51) — ban do da bi xoa.
        // Lieng be tu Go88, backend .NET 10. Dung CHUNG mot so voi so sach ben server
        // (Protocol.cs: LiengGo88 = 201) — co y, de khong lap lai canh lech 117-vs-200 cua
        // Cao Rua. So nay la khoa cua TEN_MIEN_THEO_GAME trong cardgame/scripts/GameConfigManager.js.
        LIENG: '201',
        // Xi To be tu Go88. Dai 200+ danh rieng cho ho game bai .NET 10, cap phat theo thu tu be:
        //   200 CaoRua · 201 Lieng · 202 XiTo · 203 Poker · 204 Catte · 205 Phom · 206 TLMN
        //   207 SamLoc · 208 MauBinh
        // 🔴 Cap phat o day va o Protocol.cs ben server PHAI khop nhau. Cao Rua (117 vs 200) la
        // canh lech duy nhat con lai, do lich su; se gom khi dung lai pager game bai.
        XI_TO: '202',
        // Poker Texas be tu Go88. CUNG bien the voi POKER_TEXAS (57) cu cua Roy88 — da doi
        // chieu trong ma: PokerController.js co flop/preflop/blind/dealer. Hai ban chay song
        // song toi khi dung lai pager, nen bundle phai khac ten: `pokertexas` vs `poker`.
        POKER_TEXAS_GO: '203',
        CATTE: '204', // Catte (Cat te)
        PHOM_GO: '205', // Phom
        TLMN_GO: '206', // Tien Len Mien Nam
        SAM_LOC_GO: '207', // Sam Loc
        XAP_XAM: '208', // Mau Binh (Xap Xam)
        // 🔴 Doi ten y het truong hop LIENG_CU: game Phom .NET Framework nay da chet va
        // khong dong nao tham chieu toi. Giu ten "PHOM" la dat bay — va bay do da sap
        // ngay: toi vua khai PHOM: '205' cho ban moi, thanh ra MOT doi tuong co HAI khoa
        // trung ten, JS lay cai CUOI nen game moi thanh vo hinh. kiem-tra.js bat duoc.
        PHOM_CU: '52',
        POKER_HK: '53',
        TIEN_LEN_MN: '54',
        MAU_BINH: '55',
        TIEN_LEN_MB: '56',
        POKER_TEXAS: '57',
        SAM_LOC: '58',
        // 🔴 Doi ten tu LIENG thanh LIENG_CU. Game Lieng .NET Framework nay da chet, va khong
        // mot dong nao trong client tham chieu toi no (da soat). De no giu ten "LIENG" la dat
        // bay: ai viet cc.GameId.LIENG sau nay se tro vao ban da chet thay vi ban dang chay.
        // Ben server phan biet y het the — Protocol.cs: Lieng (59) hien thi "Lieng (cu)",
        // LiengGo88 (201) hien thi "Lieng".
        LIENG_CU: '59',
        CHAN: '60',
        BA_CAY_GA: '61',
        BA_CAY_BIEN: '62',
        XOC_XOC: '63',
        BAUCUA: '20',

        TIEN_LEN_MN_NHAT_AN_TAT: '64',
        MAYA_QUEST: '65',
        TIEN_LEN_MN_SOLO: '66',
        SAM_LOC_SOLO: '67',
        LODE: '21',
        VIETLOT: '22',

        SHOOT_FISH: '23',
        THUONG_HAI: '16',

        EVENT_TREASURE: 'EVENT_TREASURE',
        ESPORTS: '99'
    });

}).call(this);
