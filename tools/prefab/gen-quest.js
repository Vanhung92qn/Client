/**
 * gen-quest.js — sinh 3 prefab cua he Nhiem vu bang code.
 *
 *   node tools/prefab/gen-quest.js        (cwd = C:\Server\Client)
 *
 * Vi sao sinh bang code: VPS khong mo noi Cocos Creator. Bu lai, chay lai
 * bao nhieu lan cung duoc ma uuid khong doi (giu .meta cu), va moi thay doi
 * bo cuc deu doc duoc trong diff git.
 *
 *   Quest/QuestPopup.prefab        man chinh, hai tab NHIEM VU / SU KIEN
 *   Quest/items/QuestItem.prefab   mot dong nhiem vu
 *   Quest/QuestGuidePopup.prefab   bang huong dan
 *
 * TOA DO lay tu chinh file anh poppup_sukien.png (1306x655), do bang cach
 * quet pixel de tim vien khung trong — khong uoc luong bang mat:
 *
 *   khung ngoai   x 98 .. 1275
 *   khung trong   x 140 .. 1224 , y 140 .. 615
 *   => vung noi dung  1084 x 475, tam lech (+29, -50) so voi tam popup
 *
 * Chay xong nho kiem lai:  node tools/prefab/validate.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const P = require('./lib/cocos-prefab');
const A = require('./lib/assets');

const ASSETS = A.ASSETS_ROOT;
const PREFAB_DIR = path.join(ASSETS, 'prefabs', 'portal');
const SCRIPT_DIR = path.join(ASSETS, 'lobby', 'scripts', 'portal', 'quest');

// ─────────────────────────────────────────────────────────────────
// Ha tang — cung khuon voi gen-lixi.js
// ─────────────────────────────────────────────────────────────────

function scriptUuid(relFromScriptDir) {
  const jsPath = path.join(SCRIPT_DIR, relFromScriptDir);
  const metaPath = jsPath + '.meta';
  if (!fs.existsSync(jsPath)) {
    throw new Error(`Thieu script: ${jsPath}`);
  }
  if (fs.existsSync(metaPath)) {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8')).uuid;
  }
  const id = P.uuid4();
  fs.writeFileSync(metaPath, JSON.stringify(P.scriptMeta(id), null, 2) + '\n', 'utf8');
  console.log(`  + .meta moi cho script  ${relFromScriptDir}`);
  return id;
}

/** Giu uuid cu neu .meta da co — doi uuid la dut moi tham chieu. */
function prefabUuid(relFromPrefabDir) {
  const metaPath = path.join(PREFAB_DIR, relFromPrefabDir + '.meta');
  if (fs.existsSync(metaPath)) {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8')).uuid;
  }
  return P.uuid4();
}

function ensureFolderMeta(absDir) {
  fs.mkdirSync(absDir, { recursive: true });
  const metaPath = absDir + '.meta';
  if (fs.existsSync(metaPath)) return;
  fs.writeFileSync(metaPath, JSON.stringify(P.folderMeta(P.uuid4()), null, 2) + '\n', 'utf8');
  console.log(`  + .meta moi cho thu muc  ${path.relative(ASSETS, absDir)}`);
}

function writePrefab(relFromPrefabDir, rootNode, uuid) {
  const filePath = path.join(PREFAB_DIR, relFromPrefabDir);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const json = P.build(rootNode, uuid);
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
  fs.writeFileSync(filePath + '.meta', JSON.stringify(P.prefabMeta(uuid), null, 2) + '\n', 'utf8');
  console.log(`  ok  ${relFromPrefabDir}  (${json.length} doi tuong)`);
}

// ─────────────────────────────────────────────────────────────────
// Asset
//
// TAT CA anh nam trong assets/lobby/images/quest/ — bundle 'lobby',
// cung bundle voi anh Li xi. Khong dung anh o bundle 'tk' (priority 1):
// bundle do khong chac da nap luc mo popup nen anh ve sau chu, nhin nhu
// man hinh vo. Da vap loi nay o he Li xi.
// ─────────────────────────────────────────────────────────────────

const Q = 'lobby/images/quest/';

const IMG = A.spriteFrames({
  bgDim: 'common/images/popup/bg_popup.png',

  popupBg: Q + 'poppup_sukien.png',
  close: Q + 'gift_close.png',

  tabQuestOn: Q + 'button-nhiem-vu@2x.png',
  tabQuestOff: Q + 'button-nhiem-vu-disable@2x.png',
  tabEventOn: Q + 'button-sukien-red@2x.png',
  tabEventOff: Q + 'button-sukien-black@2x.png',

  circleNum: Q + 'circle_so.png',

  bar: Q + 'questbar.png',
  barOff: Q + 'questbar_disable.png',
  star: Q + 'iconStar.png',
  starOff: Q + 'star_disable.png',
  money: Q + 'boxmoney.png',
  moneyOff: Q + 'boxmoney_disable.png',

  btnClaim: Q + 'ButtonNhan.png',
  btnDeposit: Q + 'buttonDeposit.png',
  btnBet: Q + 'buttonBetNow.png',
  checked: Q + 'iconChecked.png',

  titleGuide: Q + 'title_HuongDan.png',
});

const C_GOLD = [255, 216, 77];
const C_WHITE = [255, 255, 255];
const C_DIM = [178, 178, 178];

// ─────────────────────────────────────────────────────────────────
// Toa do — do tu file anh, xem chu thich dau file
// ─────────────────────────────────────────────────────────────────

const POPUP_W = 1306;
const POPUP_H = 655;

/** Tam vung noi dung so voi tam popup. */
const BODY_X = 29;
const BODY_Y = -50;
const BODY_W = 1084;
const BODY_H = 475;

/** Day tab nam trong dai trang tri phia tren, chan tab cham mep khung trong. */
const TAB_W = 170;
const TAB_H = 50;
const TAB_Y = BODY_Y + BODY_H / 2 + TAB_H / 2;        // = +212
const TAB1_X = BODY_X - BODY_W / 2 + 10 + TAB_W / 2;  // = -418
const TAB2_X = TAB1_X + TAB_W + 6;                    // = -242

/** Nut dong nam ngoai mep phai popup, ngang vai — dung nhu ban thiet ke. */
const CLOSE_X = 666;
const CLOSE_Y = 292;

// ─────────────────────────────────────────────────────────────────
// Khung popup dung chung cho ca man chinh lan bang huong dan
// ─────────────────────────────────────────────────────────────────

function popupFrame(inner) {
  return [
    P.node('dim', { size: [2000, 1400], color: [0, 0, 0], opacity: 160, ref: 'dim' }, [], [
      P.sprite(IMG.bgDim, { type: 1, sizeMode: 0 }),
    ]),

    P.node('frame', { size: [POPUP_W, POPUP_H] }, [
      P.node('bg', { size: [POPUP_W, POPUP_H] }, [], [
        P.sprite(IMG.popupBg, { sizeMode: 0 }),
      ]),

      P.node('btnClose', {
        size: [52, 52],
        pos: [CLOSE_X, CLOSE_Y],
        ref: 'btnClose',
      }, [], [
        P.sprite(IMG.close, { sizeMode: 0 }),
        P.button({ transition: 3, zoomScale: 1.12 }),
      ]),

      ...inner,
    ]),
  ];
}

/**
 * Mot tab kem huy hieu dem.
 *
 * Huy hieu dem so nhiem vu DA XONG CHUA NHAN — khong phai tong so nhiem vu.
 * Chi con so do moi dang lam nguoi choi mo popup.
 */
function tab(name, x, sfDefault, refName) {
  return P.node(name, { size: [TAB_W, TAB_H], pos: [x, TAB_Y], ref: refName }, [
    P.node('badge', {
      size: [46, 46],
      pos: [TAB_W / 2 - 13, TAB_H / 2 + 1],
      ref: refName + 'Badge',
      active: false,
    }, [
      P.node('lbNum', { size: [40, 30], ref: refName + 'Lb', color: C_GOLD }, [], [
        P.label('1', { size: 24, overflow: 0 }),
      ]),
    ], [
      P.sprite(IMG.circleNum, { sizeMode: 0 }),
    ]),
  ], [
    P.sprite(sfDefault, { sizeMode: 0 }),
    P.button({ transition: 3, zoomScale: 1.06 }),
  ]);
}

// ─────────────────────────────────────────────────────────────────
// 1. QuestItem — mot dong nhiem vu
//
// Vi tri cac phan lay theo hinh minh hoa content_HuongDan.png cua chinh
// bo asset (ti le so voi be ngang thanh), khong tu bia:
//   sao 3.9%   chu 8.4%   hop tien 75%   nut 94.4%
// ─────────────────────────────────────────────────────────────────

const ITEM_W = 1070;
const ITEM_H = 102;

const X_STAR = -ITEM_W / 2 + 0.039 * ITEM_W;        // -493
const X_TEXT = -ITEM_W / 2 + 0.084 * ITEM_W;        // -445
const X_MONEY = -ITEM_W / 2 + 0.750 * ITEM_W;       // +268
const X_BTN_R = -ITEM_W / 2 + 0.944 * ITEM_W + 50;  // mep phai nut = +525

function buildItem(uScript) {
  return P.node('QuestItem', { size: [ITEM_W, ITEM_H] }, [

    /* Thanh nen: anh NAY TRONG SUOT MOT PHAN (alpha toi da 151), no la lop
       phu vang de len nen den cua popup chu khong phai nen dac. Vi vay
       khong duoc dung sliced — ve dung 1:1 moi ra dung y do thiet ke. */
    P.node('bar', { size: [ITEM_W, ITEM_H], ref: 'bar' }, [], [
      P.sprite(IMG.bar, { sizeMode: 0 }),
    ]),

    P.node('star', { size: [44, 42], pos: [X_STAR, 0], ref: 'star' }, [], [
      P.sprite(IMG.star, { sizeMode: 0 }),
    ]),

    /* Ten + tien do nam CUNG MOT HANG, ma ten thi dai ngan khac nhau.
       Dat x co dinh cho tien do thi hoac dam vao ten hoac ho mot khoang
       trong to. Dung cc.Layout ngang de tien do luon bam sat sau ten. */
    P.node('titleRow', {
      size: [10, 40],
      pos: [X_TEXT, 19],
      anchor: [0, 0.5],
    }, [
      P.node('lbTitle', { size: [10, 36], ref: 'lbTitle', color: C_GOLD }, [], [
        P.label('Hoàn thành nạp ngân hàng', { size: 27, hAlign: 0, overflow: 0 }),
      ]),
      P.node('lbProgress', { size: [10, 34], ref: 'lbProgress', color: C_WHITE }, [], [
        P.label('(0/1.000.000)', { size: 23, hAlign: 0, overflow: 0 }),
      ]),
    ], [
      P.layout({
        layoutType: 1,
        resize: 1,
        spacingX: 16,
        size: [10, 40],
      }),
    ]),

    P.node('lbDescription', {
      size: [700, 32],
      pos: [X_TEXT, -18],
      anchor: [0, 0.5],
      ref: 'lbDesc',
      color: C_WHITE,
    }, [], [
      P.label('Nạp thành công 1 triệu qua ngân hàng', { size: 21, hAlign: 0, overflow: 1 }),
    ]),

    // Hop tien thuong — dong xu chiem ~62px ben trai nen so day sang phai
    P.node('money', { size: [241, 71], pos: [X_MONEY, 0], ref: 'money' }, [
      P.node('lbReward', { size: [170, 46], pos: [31, 0], ref: 'lbReward', color: C_GOLD }, [], [
        P.label('30.000', { size: 30, overflow: 1 }),
      ]),
    ], [
      P.sprite(IMG.money, { sizeMode: 0 }),
    ]),

    /* Nut hanh dong: ba anh BA BE NGANG khac nhau (NHAN 101, NAP 96,
       CUOC NGAY 185). sizeMode = TRIMMED de node tu co gian theo anh, va
       neo [1,0.5] de mep PHAI dung yen — khong thi doi anh la nut nhay. */
    P.node('action', {
      size: [101, 56],
      pos: [X_BTN_R, 0],
      anchor: [1, 0.5],
      ref: 'action',
    }, [], [
      P.sprite(IMG.btnClaim, { sizeMode: 1 }),
      P.button({ transition: 3, zoomScale: 1.08 }),
    ]),

    P.node('checked', {
      size: [58, 49],
      pos: [X_BTN_R - 20, 0],
      anchor: [1, 0.5],
      ref: 'checked',
      active: false,
    }, [], [
      P.sprite(IMG.checked, { sizeMode: 0 }),
    ]),

  ], [
    P.script(uScript, {
      spriteBar: P.refComp('bar', 'cc.Sprite'),
      sfBar: { __uuid__: IMG.bar },
      sfBarDisable: { __uuid__: IMG.barOff },

      spriteStar: P.refComp('star', 'cc.Sprite'),
      sfStar: { __uuid__: IMG.star },
      sfStarDisable: { __uuid__: IMG.starOff },

      lbTitle: P.refComp('lbTitle', 'cc.Label'),
      lbProgress: P.refComp('lbProgress', 'cc.Label'),
      lbDescription: P.refComp('lbDesc', 'cc.Label'),

      spriteMoney: P.refComp('money', 'cc.Sprite'),
      sfMoney: { __uuid__: IMG.money },
      sfMoneyDisable: { __uuid__: IMG.moneyOff },
      lbReward: P.refComp('lbReward', 'cc.Label'),

      nodeAction: P.ref('action'),
      spriteAction: P.refComp('action', 'cc.Sprite'),
      // lbAction de TRONG co y: chu "NHAN" / "NAP" / "CUOC NGAY" da ve san
      // trong anh nut. Dat them label len tren la chong chu.
      sfClaim: { __uuid__: IMG.btnClaim },
      sfDeposit: { __uuid__: IMG.btnDeposit },
      sfBet: { __uuid__: IMG.btnBet },
      nodeChecked: P.ref('checked'),
    }),
  ]);
}

// ─────────────────────────────────────────────────────────────────
// 2. QuestPopup — man chinh
// ─────────────────────────────────────────────────────────────────

function buildPopup(uScript, uItemPrefab, uGuidePrefab) {
  const listW = BODY_W - 8;
  const listH = BODY_H - 8;

  return P.node('QuestPopup', { size: [POPUP_W, POPUP_H] }, popupFrame([

    // Tab mac dinh: NHIEM VU dang chon, SU KIEN chua chon — dung trang
    // thai ban dau cua QuestPopup._tab
    tab('tabDaily', TAB1_X, IMG.tabQuestOn, 'tabDaily'),
    tab('tabOnce', TAB2_X, IMG.tabEventOff, 'tabOnce'),

    // Nut huong dan — dat canh tab thay vi goc phai: goc phai la cho bay
    // hop qua trong tranh, de nut len do vua kho thay vua roi mat
    P.node('btnGuide', {
      size: [46, 46],
      pos: [TAB2_X + TAB_W / 2 + 40, TAB_Y],
      ref: 'btnGuide',
    }, [
      P.node('lbQ', { size: [46, 40], color: C_GOLD }, [], [
        P.label('?', { size: 28, overflow: 0 }),
      ]),
    ], [
      P.sprite(IMG.circleNum, { sizeMode: 0 }),
      P.button({ transition: 3, zoomScale: 1.15 }),
    ]),

    // ── Danh sach ────────────────────────────────────────────────
    P.node('scroll', { size: [listW, listH], pos: [BODY_X, BODY_Y] }, [
      P.node('view', { size: [listW, listH] }, [
        P.node('listContent', {
          size: [listW, 0],
          pos: [0, listH / 2],
          anchor: [0.5, 1],
          ref: 'listContent',
        }, [], [
          P.layout({
            layoutType: 2,
            resize: 1,
            spacingY: 6,
            padding: { T: 6, B: 6 },
            size: [listW, 0],
          }),
        ]),
      ], [
        P.mask({ type: 0 }),
      ]),
    ], [
      P.scrollView({ vertical: true, horizontal: false, content: P.ref('listContent') }),
    ]),

    P.node('nodeEmpty', {
      size: [700, 160],
      pos: [BODY_X, BODY_Y],
      ref: 'nodeEmpty',
      active: false,
    }, [
      P.node('lbEmpty', { size: [680, 120], ref: 'lbEmpty', color: C_DIM }, [], [
        P.label('Hôm nay chưa có nhiệm vụ nào',
          { size: 23, lineHeight: 34, overflow: 1, wrap: true }),
      ]),
    ]),

    P.node('nodeLoading', {
      size: [340, 44],
      pos: [BODY_X, BODY_Y],
      ref: 'nodeLoading',
      color: C_DIM,
      active: false,
    }, [], [
      P.label('Đang tải...', { size: 23, overflow: 1 }),
    ]),

  ]), [
    P.script(uScript, {
      btnClose: P.ref('btnClose'),

      nodeTabDaily: P.ref('tabDaily'),
      spriteTabDaily: P.refComp('tabDaily', 'cc.Sprite'),
      sfTabDailyOn: { __uuid__: IMG.tabQuestOn },
      sfTabDailyOff: { __uuid__: IMG.tabQuestOff },
      nodeBadgeDaily: P.ref('tabDailyBadge'),
      lbBadgeDaily: P.refComp('tabDailyLb', 'cc.Label'),

      nodeTabOnce: P.ref('tabOnce'),
      spriteTabOnce: P.refComp('tabOnce', 'cc.Sprite'),
      sfTabOnceOn: { __uuid__: IMG.tabEventOn },
      sfTabOnceOff: { __uuid__: IMG.tabEventOff },
      nodeBadgeOnce: P.ref('tabOnceBadge'),
      lbBadgeOnce: P.refComp('tabOnceLb', 'cc.Label'),

      nodeListContent: P.ref('listContent'),
      prefabItem: { __uuid__: uItemPrefab },

      nodeEmpty: P.ref('nodeEmpty'),
      lbEmpty: P.refComp('lbEmpty', 'cc.Label'),
      nodeLoading: P.ref('nodeLoading'),

      prefabGuide: { __uuid__: uGuidePrefab },
      btnGuide: P.ref('btnGuide'),
    }),
  ]);
}

// ─────────────────────────────────────────────────────────────────
// 3. QuestGuidePopup — bang huong dan
//
// KHONG dung content_HuongDan.png trong bo asset: anh do ve san cau chu
// va lay vi du "Thu van may Bau Cua" — khong phai nhiem vu cua minh, ma
// anh thi khong sua duoc khi doi moc hay muc thuong. Noi dung o day do
// QuestGuidePopup._build() sinh tu chinh du lieu may chu tra ve.
// ─────────────────────────────────────────────────────────────────

function buildGuide(uScript) {
  const listW = 1000;
  const listH = 430;

  return P.node('QuestGuidePopup', { size: [POPUP_W, POPUP_H] }, popupFrame([

    P.node('titleGuide', { size: [234, 38], pos: [BODY_X, TAB_Y] }, [], [
      P.sprite(IMG.titleGuide, { sizeMode: 0 }),
    ]),

    P.node('scroll', { size: [listW, listH], pos: [BODY_X, BODY_Y - 6] }, [
      P.node('view', { size: [listW, listH] }, [
        P.node('helpContent', {
          size: [listW, 0],
          pos: [0, listH / 2],
          anchor: [0.5, 1],
          ref: 'helpContent',
        }, [
          P.node('lbContent', {
            size: [listW - 60, 800],
            anchor: [0.5, 1],
            ref: 'lbContent',
            color: C_WHITE,
          }, [], [
            // Chuoi o day chi de nhin thay bo cuc trong editor — noi dung
            // that do QuestGuidePopup._build() sinh tu du lieu may chu
            P.label('Đang tải nội dung...', {
              size: 22,
              lineHeight: 34,
              hAlign: 0,
              vAlign: 0,
              overflow: 0,
              wrap: true,
            }),
          ]),
        ], [
          P.layout({
            layoutType: 2,
            resize: 1,
            spacingY: 0,
            padding: { T: 10, B: 10 },
            size: [listW, 0],
          }),
        ]),
      ], [
        P.mask({ type: 0 }),
      ]),
    ], [
      P.scrollView({ vertical: true, horizontal: false, content: P.ref('helpContent') }),
    ]),

  ]), [
    P.script(uScript, {
      lbContent: P.refComp('lbContent', 'cc.Label'),
      btnClose: P.ref('btnClose'),
      nodeDim: P.ref('dim'),
    }),
  ]);
}

// ─────────────────────────────────────────────────────────────────

function main() {
  console.log('Sinh prefab he Nhiem vu\n');

  ensureFolderMeta(path.join(SCRIPT_DIR, 'items'));
  ensureFolderMeta(path.join(PREFAB_DIR, 'Quest'));
  ensureFolderMeta(path.join(PREFAB_DIR, 'Quest', 'items'));

  // Moi file .js phai co .meta de Cocos require duoc theo ten — ke ca file
  // khong phai component (QuestService, QuestModel)
  const uService = scriptUuid('QuestService.js');
  const uModel = scriptUuid('QuestModel.js');
  const uPopup = scriptUuid('QuestPopup.js');
  const uItem = scriptUuid(path.join('items', 'QuestItem.js'));
  const uGuide = scriptUuid('QuestGuidePopup.js');
  const uBadge = scriptUuid('QuestBadge.js');
  console.log(`  script: service=${uService.slice(0, 8)} model=${uModel.slice(0, 8)} badge=${uBadge.slice(0, 8)}\n`);

  const P_ITEM = path.join('Quest', 'items', 'QuestItem.prefab');
  const P_GUIDE = path.join('Quest', 'QuestGuidePopup.prefab');
  const P_POPUP = path.join('Quest', 'QuestPopup.prefab');

  const uItemPf = prefabUuid(P_ITEM);
  const uGuidePf = prefabUuid(P_GUIDE);
  const uPopupPf = prefabUuid(P_POPUP);

  // Prefab CON sinh truoc: popup cha can uuid cua chung de bind property
  writePrefab(P_ITEM, buildItem(uItem), uItemPf);
  writePrefab(P_GUIDE, buildGuide(uGuide), uGuidePf);
  writePrefab(P_POPUP, buildPopup(uPopup, uItemPf, uGuidePf), uPopupPf);

  console.log('\nXong. Kiem lai bang: node tools/prefab/validate.js');
}

main();
