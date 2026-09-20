var t = require,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});

// ─────────────────────────────────────────────────────────────────────────────
//  LOP GIA cho truc "GameConfigManager" cua Go88.
//
//  VI SAO CO TEP NAY:
//  Ban goc Go88 (C:\Reverse\go88\assets\scripts\L00\GameConfigManager.js, 1632 dong)
//  chi lam 2 viec: (1) giu ~400 o cau hinh, (2) TAI cau hinh do ve tu "profiler" cua
//  Go88 (this.profileUrl = "https://dlgozeg.drsgems.com/8go88") roi do vao tung o.
//
//  🔴 CAM tai lai profiler: do la ha tang Go88, va no la duong co the mang token/thiet bi
//     nguoi choi sang may chu Go88 (hop dong LOP-GIA.md, dieu 2). Vi vay tep nay CHI giu
//     phan (1) — cac o cau hinh — voi gia tri HANG SO ghi thang trong tep.
//     Toan bo ham nap cau hinh tu xa cua ban goc da bi bo, KHONG thay the bang gi.
//
//  QUY TAC DAT GIA TRI (theo LOP-GIA.md):
//    - Do duoc tu bat goi that  -> dung dung so do. (chi co timeRefreshListRoom)
//    - Khong do duoc             -> giu DUNG mac dinh cua ban goc Go88, ghi chu "mac dinh
//                                   theo ban goc". Tuyet doi khong tu nghi ra so moi.
//
//  DANH SACH THANH VIEN: quet bang regex da-dong (code Go88 dich nguoc bi xuong dong giua
//  chung `getInstance()\n  .abc`, quet tung dong se SOT) tren ca 74 script da be. Moi thanh
//  vien duoi day deu truy nguoc duoc ve it nhat 1 dong goi that; cho nao dac biet thi co
//  ghi chu <tep>:<dong>. Thieu 1 thanh vien thi loi chi no LUC CHAY toi nhanh do — co khi
//  toi giua van moi chet — nen doi chieu bang danh sach, khong bang cam giac.
// ─────────────────────────────────────────────────────────────────────────────

var n = require("./StringUtil"),
  o = require("./GamePlayManager"),
  a = require("./GameDefine"),
  // NetConfig la NGUON DUY NHAT cua Roy88 cho ten mien (assets/config/network/NetConfig.js).
  // Require theo ten tran nhu code Roy88 dang lam (vd lobby/scripts/cardgame/3cay/BCView.js:5).
  s = t("NetConfig");

// Khoa luu "tu dong san sang" xuong may. Ban goc xuat ra ngoai module (i.KEY_AUTO_READY_CARDGAME)
// nen giu nguyen ten xuat, phong khi script khac tra toi.
i.KEY_AUTO_READY_CARDGAME = "KEY_AUTO_READY_CARDGAME";

// MusicPlayer nap MUON, va phai qua bi danh rieng nay. Hai ly do, ca hai deu tung lam gay that:
//  1. MusicPlayer require nguoc lai GameConfigManager. Nap som o dau tep thi luc chay mot trong
//     hai ben nhan duoc exports RONG -> `.default` la undefined.
//  2. Ben trong lop (var r = (function () { function t() {...}) chu `t` bi TEN LOP che mat, nen
//     trong than ham KHONG con goi duoc `t("./MusicPlayer")` nua — phai giu san bi danh nay.
var napModule = t;
var _mp = null;
function mayHat() {
  if (null === _mp) {
    try {
      _mp = napModule("./MusicPlayer");
    } catch (loi) {
      return null;
    }
  }
  return _mp && _mp.default ? _mp.default.getInstance() : null;
}

// ── Dia chi WebSocket cua BACKEND RIENG (CardGame .NET 10, giao thuc "Simms") ────────────
// 🔴 DAY LA CHO DUY NHAT ghi dia chi nay. Cac lop gia khac (WSCardGameHandle, ...) phai goi
//    GameConfigManager.getInstance().getWsCardUrl(), KHONG duoc tu ghep URL o cho khac.
// Cach ghep bam dung quy uoc san co cua Roy88:
//    'https://' + subdomain + host + '/' + path   (assets/lobby/scripts/xhr/ServerConnector.js:45)
// ban WebSocket thi doi lay 'wss://'.
//    - host      : NetConfig.HOST                 -> nguon duy nhat cua Roy88
//    - subdomain : cc.SubdomainName.THREE_CARDS   -> enum san co cua Roy88 ('bacay.')
//    - WS_CARD_PATH : duong dan endpoint tren backend .NET 10.
// ⚠️ WS_CARD_PATH chua doi chieu duoc voi backend (backend dang viet). Sai thi sua DUNG 1 dong nay.
var WS_CARD_PATH = "websocket"; // dung y duong dan cua Go88 that: wss://<host>/websocket

// Ten mien con cua backend Cao Rua. Phai khac 'bacay.' — xem ly do o getWsCardUrl().
// Backend dang ky truc tiep tren HTTP.SYS (khong qua IIS), cau hinh o
// CardGame/src/CardGame.Server/appsettings.Test.json -> Hosting:HttpSysPrefixes.
var WS_CARD_SUBDOMAIN = "caorua.";

var r = (function () {
  function t() {
    // ── Am thanh (MusicPlayer.js doc, va GHI de vao currentBgMusic/isPlayingLobbyMusicBg) ──
    this.enableSound = true; // mac dinh theo ban goc; init() se doc de tu localStorage
    this.enableBackgroundMusic = true; // mac dinh theo ban goc; init() doc de tu localStorage
    this.currentBgMusic = ""; // MusicPlayer GHI vao va goi .localeCompare() -> phai la chuoi
    this.isPlayingLobbyMusicBg = false; // MusicPlayer GHI vao
    this.isLobbyMusicBg = false; // RoomController.js:192 GHI true, MainGameViewModel GHI false
    this.listLobbyBgMusic = []; // MusicPlayer.js:276 - rong thi no tu dung BGM_lobby_default

    // ── Khoa luong (co, khong phai cau hinh) ────────────────────────────────────────────
    // isShowPopupDone la CHOT CHONG BAM 2 LAN luc vao ban: RoomController.js:201 bat len truoc
    // khi gui yeu cau, MainGameViewModel ha xuong khi co ket qua. Phai ghi/doc duoc tu do.
    this.isShowPopupDone = false;

    // ── Ban bai ────────────────────────────────────────────────────────────────────────
    // autoReady: o "Tu Dong San Sang" trong bang BAT SAN. Ban Go88 that mac dinh BAT.
    // GameController doc luc khoi tao (this.tuDongGuiSanSang) va moi lan xep nguoi vao ban.
    this.autoReady = true;
    this.bet = 0; // RoomController.js:207 - muc cuoc cho "choi nhanh"; mac dinh theo ban goc

    // 3 o duoi la BIEN TRUYEN TIN giua 2 buoc cua luong vao ban, khong phai cau hinh:
    // BaseScene GHI vao luc nguoi choi bam vao ban (roomPassword = mat khau vua nhap,
    // moneyBuyIn = so tien mua chip roomInfo.MMBI), roi DOC lai o buoc joinRoomAndBuyIn /
    // joinRoom. Vi vay phai ghi/doc duoc tu do, va mac dinh phai dung ban goc.
    this.roomPassword = ""; // mac dinh theo ban goc
    this.moneyBuyIn = 0; // mac dinh theo ban goc
    this.autoBuyIn = false; // BaseScene ha xuong sau khi vao ban xong; mac dinh theo ban goc

    // Nguong (giay) treo nen lau qua thi nap lai han trang - BaseScene doc.
    // 3600 = mac dinh theo ban goc (1 tieng).
    this.reloadTime = 3600;
    this.showChatBanChung = true; // mac dinh theo ban goc; init() doc de tu localStorage
    this.isAnDanh = true; // BaCayController.js:122 - che do an danh; mac dinh theo ban goc
    this.isNewXepBaiMauBinh = true; // RoomController.js:176 - bat nut Sap Xep; mac dinh theo ban goc

    // ── "Chi dang nhap thiet bi nay" (trust device) — TAT HAN, xem setEnableTrustDevice ──
    this.trustDevice = false; // PopupSetting.js:272 doc de dat trang thai o gat
    this.checkDeviceURL = ''; // 🔴 PHAI RONG: xem ghi chu o listcommingSoonGames ben duoi

    // "Bao quay" = to cao nguoi choi nghi ngo gian lan. InGameBackPopup.js:124 lay chuoi nay
    // lam noi dung popup. Giu nguyen van ban Go88 (muc tieu "hai anh em sinh doi").
    this.isBaoQuay = true;
    this.textBaoQuay =
      "Th\u01b0\u1edfng l\xean \u0111\u1ebfn 10 l\u1ea7n ti\u1ec1n c\u01b0\u1ee3c n\u1ebfu th\xf4ng tin b\xe1o l\xe0 ch\xednh x\xe1c !!!\n(Spam b\xe1o v\xe2y c\xf3 th\u1ec3 d\u1eabn \u0111\u1ebfn Kh\xf3a T\xe0i Kho\u1ea3n v\u0129nh vi\u1ec5n)";

    // ── Danh sach ban ──────────────────────────────────────────────────────────────────
    // 🔵 GIA TRI DO DUOC: bat goi that tren Go88 cho thay client hoi lai danh sach ban
    //    moi ~10 giay. Ban goc de hang so 5 roi de profiler ghi de len; ta khong co profiler
    //    nen ghi thang so DO DUOC vao day.
    //    Ba Cay di nhanh nay: RoomController.js:247 chi dung timeRefreshListRoomChongQuay khi
    //    isChongQuay, ma case GAME.BACAY (RoomController.js:141-144) KHONG bat co do.
    this.timeRefreshListRoom = 10;
    // Nhanh "chong quay" (TLMN/Sam/Phom/Mau Binh/Catte) — KHONG do duoc vi Ba Cay khong di
    // qua day. Giu 5 = mac dinh theo ban goc.
    this.timeRefreshListRoomChongQuay = 5;
    this.roomMaxUserIgnore = 103; // TableListRoomChongQuayNew.js:218 (loc ban Xoc Dia); mac dinh theo ban goc
    this.ignorePrivateRoom = false; // TableListRoomChongQuayNew.js:208; mac dinh theo ban goc
    // Map<gameID, {useButtonJoinRoom, showAllRoom, showTablePrivate, showTable2..5}>.
    // RoomController.js:185 va TableListRoomChongQuayNew.js:153 goi .has()/.get() -> PHAI la Map.
    // De rong: ca 2 cho deu boc trong `if (...has(gameID))` nen rong = giu nguyen giao dien mac
    // dinh cua prefab, dung hanh vi Go88 khi profiler chua tra ve.
    this.roomChongQuaySettings = new Map();

    // Cau hinh rieng tung game do server day xuong. BaCayController.js:201-211 chi doc
    // remoteConfig.configCaoRua {amountMatchShowPopNotInteract, amountMatchKickUserAffterNotInteract,
    // enableKickUserIfNotInteract}. Null = BaCayController giu nguyen mac dinh cua chinh no
    // (dung hanh vi Go88 khi chua co cau hinh) -> KHONG bia so vao day.
    this.remoteConfig = null;

    // ── Xoc Dia (TableCellRoomXocDia.js van nam trong bo da be nen phai co du o) ────────
    this.listImageXDBanChung = []; // TableCellRoomXocDia.js:106-107; mac dinh theo ban goc
    this.banVipMinBet = 4e3; // TableCellRoomXocDia.js:138 - nguong ban VIP; mac dinh theo ban goc

    // ── Bang chay chu (BroadCast.js:91) ────────────────────────────────────────────────
    // Null = BroadCast dung danh sach mac dinh cua chinh no. Mac dinh theo ban goc.
    this.broadCastConfig = null;

    // ── Sanh chung (GameUtils.js:652-668) ──────────────────────────────────────────────
    this.publicLobbyConfig = null; // mac dinh theo ban goc
    this.listDisLobbyBundleId = []; // isDisablePublicLobby() tra ve theo danh sach nay
    // 2 o nay la CHUOI "true"/"false" trong ban goc (GameUtils.js:667 so sanh == "true"),
    // khong phai boolean. Giu nguyen kieu, sai kieu la lech luong.
    this.isActivePublicLobbyApp = "true"; // mac dinh theo ban goc
    this.isActivePublicLobbyWeb = "false"; // mac dinh theo ban goc

    // ── Thuong hieu / ten moi truong ───────────────────────────────────────────────────
    // 🔴 Day KHONG phai nhan hieu hien ra man hinh, no la CO RE NHANH GIAO DIEN. Doi chuoi nay
    //    phai doi DONG THOI ca hai dau, khong thi giao dien lech ban goc mot cach IM LANG:
    //      · HeaderUi.js:292  `enviromentName.includes("caorua")` -> bat/tat nodeDomain.
    //    Hai cong khac cung doc chinh chuoi nay, va ten dang dung CO Y khong khop cai nao:
    //      · GameController.js:282/405/1149 chi gui log go roi khi ten chua "pre" -> khong gui.
    //      · HeaderUi.js:605 re nhanh khi ten chua "hit"                          -> khong re.
    //    Do la dung y: khong ban bat cu thu gi sang ha tang ban goc.
    this.enviromentName = "caorua";
    // isforcebrand = false thi GameUtils.showPopupNewBrandInfo() thoat ngay o dong dau
    // (GameUtils.js:969), nen 4 o duoi day khong bao gio duoc doc. Giu rong de chac chan
    // KHONG co URL Go88 nao lot ra ngoai (GameUtils.js:985 lam cc.sys.openURL).
    this.isforcebrand = false;
    this.homeUrl = ""; // HeaderUi.js:444/457 cc.sys.openURL -> de rong = bam khong di dau
    this.newHomeUrl = "";
    this.newBrandTime = "";
    this.newBrandName = "";

    // ── Chat ho tro ────────────────────────────────────────────────────────────────────
    // isUseLiveChatInhouse = false thi GameUtils.updateLiveChatInhouseUrl() thoat ngay, 2 o
    // kia khong duoc dung. Mac dinh theo ban goc, va giu false cung dung y: khong noi sang
    // he thong chat cua Go88.
    this.isUseLiveChatInhouse = false;
    this.liveChatUrl = "";
    this.liveChatOriginalUrl = "";

    // ── Dang nhap Facebook / webcc (HeaderUi.js) ───────────────────────────────────────
    // 🔴 Toan bo nhanh nay la ha tang Go88 (urlLoginFB, urlFBCallback tro ve may chu Go88 va
    //    mang tokenFB di). De RONG het: HeaderUi.js:660-663 chi gui request khi co URL, rong
    //    thi khong co request nao roi khoi may nguoi choi. KHONG dien gia tri "cho giong".
    this.aff_id = ""; // HeaderUi.js:642 co GHI vao (doc tu query string) -> phai ghi duoc
    this.app_id = "";
    this.Appid_FaceBook = "";
    this.urlFBCallback = "";
    this.urlLoginFB = "";
    this.tokenFB = ""; // HeaderUi.js:435/629/631 GHI vao -> phai ghi duoc
    // webcc = luong "dang nhap qua cong doi tac" cua Go88. Ca 2 co de FALSE thi HeaderUi di
    // nhanh binh thuong (nhanh ma nguoi choi Go88 that nhin thay). Mac dinh theo ban goc.
    this.isLoginWebcc = false;
    this.isLoginWebccNoWallet = false;
    this.webccBrand = ""; // BroadCast.js:115 so sanh == "mu9"; HeaderUi.js:267 doc .length
    this.webccHomePage = ""; // HeaderUi.js:431/457 window.location.href -> de rong

    this.allowRegister = true; // HeaderUi.js:597; mac dinh theo ban goc
    // HeaderUi.js:473 .indexOf("inbox"); danh sach tinh nang bi khoa, hien "Tinh nang sap ra mat!".
    // 🔴 "onedevice" o day la CO CHAN CO CHU DICH, khong phai gia tri mac dinh — xoa la ro du lieu:
    // PopupSetting.onChangeTrustDevice (PopupSetting.js:334) neu KHONG thay "onedevice" trong danh
    // sach nay se POST { action, fg_id: <van tay thiet bi> } len checkDeviceURL, tuc ban dac diem
    // may nguoi choi sang ha tang ban goc. Chan bang chinh co san cua ban goc thay vi va ma nguon:
    //   · onLoad  (PopupSetting.js:269) -> an luon ca hang "Chi dang nhap thiet bi nay"
    //   · neu van cham toi        -> hien "Tinh nang sap ra mat!", KHONG goi mang
    // checkDeviceURL de rong la lop chan thu hai, phong khi ai do go "onedevice" ra.
    this.listcommingSoonGames = ['onedevice'];
    // HeaderUi chi doc .textKichHoat lam nhan tren header. Giu NGUYEN VAN doi tuong mac dinh
    // cua ban goc Go88 (muc tieu "sinh doi"); day la van ban, khong phai duong ra Go88.
    this.activePhoneNumberData = {
      isActiveSms: true,
      phone1: "8077",
      phone2: "0",
      reward1: "5000",
      reward2: "25000",
      nativeSupportFillSMS: true,
      isActiveWithOTP: true,
      textKichHoat: "K\xedch Ho\u1ea1t Nh\u1eadn 1,500 VND",
      textKichHoatPopup:
        "(M\u1ed7i S\u0110T \u0111\u01b0\u1ee3c nh\u1eadn 1,500 VND 1 l\u1ea7n)",
      textRewardKichHoatPhone: "Kh\xf4ng khuy\u1ebfn m\xe3i"
    };

    // ── misc: goi nho cac co vat (ban goc de nguyen cum, khong tach) ───────────────────
    // Doc tai EditBoxCustom.js:82 + LabelEditbox.js:70 (isForceNoAdjustEditBox) va
    // RoomMessageHandler.js:110 (sendAutoReadyPref). Ca cum la mac dinh theo ban goc.
    this.misc = {
      sendAutoReadyPref: false,
      isForceNoAdjustEditBox: false,
      isEnableFullScreenWebMobile: false,
      isOpenLSGDFromTip: false,
      offsetY: -20
    };

    // ── Lich su chat trong ban, tach theo gameID ──────────────────────────────────────
    this.oldChat = {};

    // ── Socket Xoc Dia ────────────────────────────────────────────────────────────────
    // Ba Cay KHONG dung socket rieng cua Xoc Dia — no di chung duong WSCardGameHandle.
    // Giu useSocketXD = false (mac dinh theo ban goc) thi canUseSocketXD() luon tra false va
    // CardGameCommonRequest.js:65/68 luon chon duong WSCard. Dung hanh vi Go88 cho Ba Cay.
    this.useSocketXD = false;
    this.urlSocketXD = "";

    // Ban goc ghi lua chon "tu dong san sang" xuong may khi co nay bat. Mac dinh theo ban goc.
    this.isCardGameSaveReadyLocal = true;

    // Kho cau hinh thu tu server, getConfig() doc tu day.
    // 🔴 De RONG vinh vien: khong co profiler thi khong co gi do vao. Day dung la trang thai
    //    cua Go88 truoc khi profiler tra ve, nen cac cho doc deu da chiu duoc null:
    //      FgIDConfigManager.js:35, RMCLocalizeConfig.js:26, RMCThemeConfig.js:38
    //      -> ca 3 deu boc bang Object.assign({}, mac_dinh, ket_qua), null la vo hai.
    //    (Ngoai le: RMCAppInfoConfig.getBrandCodeConfig() se nem loi neu goi voi null. No CHI
    //     duoc goi tu GameUtils.getPopupPositionCenter/setPopupPosition — da grep: 2 ham nay
    //     duoc DINH NGHIA nhung KHONG CO AI GOI trong bo 74 script. Nen khong mo gia tri gia
    //     vao day; bia "app_info" gia moi la them cau hinh tu nghi ra.)
    this._serverConfig = {};
  }

  // Ban goc doc lai 3 lua chon nguoi dung da luu tren may. Giu nguyen cach doc (chuoi
  // "true"/"false", thieu thi coi nhu bat) de nguoi choi khong bi mat cai da chinh.
  // Phan con lai cua init() ban goc dung de dung 3 URL bot Telegram cua Go88 va do ten mien
  // Go88 -> da BO HAN, khong thay the.
  t.prototype.init = function () {
    var t = cc.sys.localStorage.getItem("enableSound");
    this.enableSound = null === t || void 0 === t || 0 === t.localeCompare("true");
    var e = cc.sys.localStorage.getItem("enableBackgroundMusic");
    this.enableBackgroundMusic = null === e || void 0 === e || 0 === e.localeCompare("true");
    var i = cc.sys.localStorage.getItem("showChatBanChung");
    this.showChatBanChung = null === i || void 0 === i || 0 === i.localeCompare("true");

    // 🔴 Khôi phục "Tự động sẵn sàng". Thiếu đoạn này thì công tắc người chơi TẮT trong bàn
    // âm thầm BẬT lại sau mỗi lần tải trang — và client tự gửi sẵn sàng, cuốn họ vào ván kế
    // tiếp (đã trừ tiền cược) trước khi kịp bấm gì.
    //
    // Bản gốc Go88 khôi phục ở `LobbyViewController.onLoad` (LobbyViewController.js:200-204),
    // nhưng tệp đó thuộc SẢNH của Go88 nên không nằm trong bộ bê. `init()` là chỗ tương đương
    // trong kiến trúc này: chạy đúng một lần lúc dựng singleton.
    // Giữ nguyên ngữ nghĩa bản gốc: chỉ đọc khi `isCardGameSaveReadyLocal`, và KHÔNG có khoá
    // thì giữ mặc định (bật) — đúng như Go88.
    // 🔴 DÙNG CHUỖI THẲNG, ĐỪNG VIẾT `i.KEY_AUTO_READY_CARDGAME`. Trong hàm này `i` là BIẾN
    // CỤC BỘ giữ giá trị "showChatBanChung" đọc từ localStorage (dòng ngay trên) — nó CHE mất
    // `i` của module. Máy nào chưa có khoá đó thì `i` là null ⇒ ném ngay trong `init()`, mà
    // `init()` chạy lúc dựng singleton trong `onLoad` nên CẢ GAME KHÔNG VÀO ĐƯỢC.
    // Đã ném thật: "Cannot read properties of null (reading 'KEY_AUTO_READY_CARDGAME')".
    if (this.isCardGameSaveReadyLocal) {
      var n = cc.sys.localStorage.getItem("KEY_AUTO_READY_CARDGAME");
      if (null !== n && void 0 !== n && "" !== n) {
        this.autoReady = "true" === n;
      }
    }
  };

  // Giong het ban goc: thieu khoa thi tra null (khong nem loi).
  t.prototype.getConfig = function (t) {
    return this._serverConfig[t] || null;
  };

  // ActiveByRUQuery.js:114 goi co ngoac -> PHAI la ham, khong phai thuoc tinh.
  t.prototype.isWebCC = function () {
    return this.isLoginWebccNoWallet;
  };

  // GameUtils.js:657/662 goi khi chay ban native va co publicLobbyConfig.
  t.prototype.isDisablePublicLobby = function (t) {
    return this.listDisLobbyBundleId.indexOf(t) >= 0;
  };

  // CardGameCommonRequest.js:65/68 dung de chon zone gui len. Giu nguyen bieu thuc cua ban goc:
  // useSocketXD = false nen JS cat mach ngay, 2 ve sau khong bao gio duoc tinh.
  t.prototype.canUseSocketXD = function () {
    return !(
      !t.getInstance().useSocketXD ||
      n.default.isNullOrEmpty(t.getInstance().urlSocketXD) ||
      (o.default.getInstance().currentScene !== a.GameConfigs.SceneName.BauCua &&
        o.default.getInstance().currentScene !== a.GameConfigs.SceneName.XocDia)
    );
  };

  // InGameBackPopup.js:114 goi khi nguoi choi gat o "Tu Dong San Sang".
  // Ban goc ghi qua StorageUtil.setString (co ma hoa khoa). StorageUtil KHONG nam trong bo da
  // be, ma no keo theo ca cum ma hoa cua Go88 -> ghi thang localStorage, GIU NGUYEN ten khoa
  // va nguyen dinh dang "true"/"false" de khong doi hanh vi.
  t.prototype.setEnableAutoReady = function (e) {
    if (t.getInstance().isCardGameSaveReadyLocal) {
      cc.sys.localStorage.setItem(i.KEY_AUTO_READY_CARDGAME, e ? "true" : "false");
    }
    this.autoReady = e;
  };

  // ── Bon o gat con lai cua bang Cai dat (PopupSetting.js) ────────────────────────────────
  // Ten khoa localStorage phai TRUNG KHOP voi init() o tren, neu khong thi gat xong tat game
  // mo lai la tro ve mac dinh — hong im lang, khong co loi nao.

  // PopupSetting.js:329. Y NGUYEN ban goc: chi keo am luong len khi BAT, con luc TAT khong ha
  // ve 0 — moi cho phat hieu ung deu da tu kiem `enableSound` truoc (MusicPlayer.js:332/346/
  // 360/384). Them setEffectsVolume(0) o nhanh tat la tu them hanh vi, dung.
  t.prototype.setEnableSound = function (e) {
    if (e) {
      cc.audioEngine.setEffectsVolume(1);
    }
    cc.sys.localStorage.setItem("enableSound", e ? "true" : "false");
    this.enableSound = e;
  };

  // PopupSetting.js:325. Ban goc nhan 3 tham so (e = bat/tat, n = co phat lai ngay, o = co ghi
  // nho xuong may) roi re theo currentScene qua gan 20 tang if de chon ban nhac cua tung game;
  // ca chum do rot ve playRandomIngameBgMusic() cho scene game bai (GameConfigManager.js:646
  // ban goc). Ben minh chi co game bai nen goi thang nhanh do. Giu nguyen chu ky 3 tham so.
  t.prototype.setEnableBgMusic = function (e, n, o) {
    if (void 0 === n) n = true;
    if (void 0 === o) o = true;
    if (o) {
      cc.sys.localStorage.setItem("enableBackgroundMusic", e ? "true" : "false");
    }
    this.enableBackgroundMusic = e;
    this.canResetBackgroundMusic = false;
    var s = mayHat();
    if (null === s) return;
    if (e) {
      if (n) s.playRandomIngameBgMusic();
    } else {
      s.stopMusic();
    }
  };

  // PopupSetting.js:345 — CHI duoc goi sau khi may chu tra ve 200. Ben minh hang "Chi dang nhap
  // thiet bi nay" bi khoa bang listcommingSoonGames nen duong nay khong bao gio chay; giu ham
  // lai vi PopupSetting tham chieu toi no, thieu la no ngay luc nap.
  t.prototype.setEnableTrustDevice = function (e) {
    cc.sys.localStorage.setItem("trustdevice", e ? "true" : "false");
    this.trustDevice = e;
  };

  // PopupSetting.js:361 - o gat "Hien chat ban chung".
  t.prototype.setEnableShowChatBanChung = function (e) {
    cc.sys.localStorage.setItem("showChatBanChung", e ? "true" : "false");
    this.showChatBanChung = e;
  };

  // CardGameTableController.js:166 - do lai 3 cau chat gan nhat vao popup chat.
  // Luu y: ten ham viet hoa chu H ("getOldCHat") la LOI CHINH TA CUA BAN GOC. Giu nguyen,
  // doi ten la cho goi chet im lang.
  t.prototype.getOldCHat = function () {
    var t = this.oldChat[o.default.getInstance().gameID.toString()];
    return null !== t && void 0 !== t ? t : [];
  };

  // ChatInGamePopup.js:159 - luu cau vua chat. Ban goc giu toi da 3 cau, cau moi nhat len dau.
  t.prototype.setOldChat = function (t) {
    var e = this.oldChat[o.default.getInstance().gameID.toString()];
    if (null !== e && void 0 !== e) {
      this.oldChat[o.default.getInstance().gameID.toString()].unshift(t);
      if (this.oldChat[o.default.getInstance().gameID.toString()].length > 3) {
        this.oldChat[o.default.getInstance().gameID.toString()].splice(3, 1);
      }
    } else {
      this.oldChat[o.default.getInstance().gameID.toString()] = [t];
    }
  };

  // ── THEM MOI (khong co trong ban goc Go88) ────────────────────────────────────────────
  // Ban goc lay dia chi socket tu profiler (socketCard/socketCardProd/...). Ta khong co
  // profiler, nen day la CHO DUY NHAT tra ve dia chi WebSocket cua backend rieng.
  // Cac lop gia khac (WSCardGameHandle...) goi ham nay, KHONG tu ghep URL.
  t.prototype.getWsCardUrl = function () {
    // Cho phep ghi de bang ?wscard=... nhu chinh ban goc Go88 — de chay thu voi backend cuc bo
    // (vd ?wscard=ws://127.0.0.1:5080/websocket) ma khong phai build lai client.
    if (cc.sys.isBrowser && window.location && window.location.search) {
      var m = /[?&]wscard=([^&]+)/.exec(window.location.search);
      if (m) return decodeURIComponent(m[1]);
    }
    // 🔴 KHONG dung cc.SubdomainName.THREE_CARDS ('bacay.'): ten mien con do la SERVER BA CAY CU
    // (game 51) van dang chay cho nguoi choi, noi giao thuc Roy88 hoan toan khac. Tro vao do thi
    // client Go88 gui khung Simms sang mot server khong hieu no — hong im lang, va te hon nua la
    // dam vao he dang song. Cao Rua co ten mien con RIENG.
    return "wss://" + WS_CARD_SUBDOMAIN + s.HOST + "/" + WS_CARD_PATH;
  };

  t.getInstance = function () {
    if (!(null !== this.Instance && void 0 !== this.Instance)) {
      this.Instance = new t();
      this.Instance.init();
    }
    return this.Instance;
  };

  // Ten su kien cc.director dang ky/huy tai CardGameTableController.js:102 va :117.
  // 🔴 Chuoi phai y het ban goc, doi la nut tat chat chet im lang.
  t.SHOW_CHAT_BAN_CHUNG = "GameConfigManager.SHOW_CHAT_BAN_CHUNG";
  t.Instance = null;
  return t;
})();

i.default = r;
void 0;
