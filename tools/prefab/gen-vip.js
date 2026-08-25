/**
 * gen-vip.js — sinh toan bo prefab cua popup VIP.
 *
 *   node tools/prefab/gen-vip.js
 *
 * Sinh ra:
 *   assets/prefabs/portal/vip/VipPopup.prefab
 *   assets/prefabs/portal/vip/tabs/VipRankTab.prefab
 *   assets/prefabs/portal/vip/tabs/VipPointTab.prefab
 *   assets/prefabs/portal/vip/items/VipRankItem.prefab
 * kem file .meta cho tung cai.
 *
 * Script da duoc gan san vao node kem day du property, nen mo trong
 * Cocos Creator la chay duoc ngay, khong phai keo tay.
 *
 * Chay lai nhieu lan duoc: uuid trong .meta da co thi giu nguyen, khong
 * sinh moi (doi uuid = moi tham chieu toi prefab/script deu dut).
 */

'use strict';

const fs = require('fs');
const path = require('path');
const P = require('./lib/cocos-prefab');
const A = require('./lib/assets');

const ASSETS = A.ASSETS_ROOT;
const PREFAB_DIR = path.join(ASSETS, 'prefabs', 'portal', 'vip');
const SCRIPT_DIR = path.join(ASSETS, 'lobby', 'scripts', 'portal', 'vip');

// ─────────────────────────────────────────────────────────────────
// uuid: doc lai neu da co, chi sinh moi khi chua ton tai
// ─────────────────────────────────────────────────────────────────

/** Lay uuid cua mot file .js, tao .meta neu chua co. */
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

/** Lay uuid cua mot file .prefab sap ghi, giu nguyen neu .meta da ton tai. */
function prefabUuid(relFromPrefabDir) {
  const metaPath = path.join(PREFAB_DIR, relFromPrefabDir + '.meta');
  if (fs.existsSync(metaPath)) {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8')).uuid;
  }
  return P.uuid4();
}

/**
 * Bao dam mot thu muc trong assets/ co file .meta di kem.
 * Thieu .meta thi Cocos tu sinh khi mo project, gay ra file la trong git.
 */
function ensureFolderMeta(absDir) {
  fs.mkdirSync(absDir, { recursive: true });
  const metaPath = absDir + '.meta';
  if (fs.existsSync(metaPath)) return;
  fs.writeFileSync(
    metaPath,
    JSON.stringify(P.folderMeta(P.uuid4()), null, 2) + '\n',
    'utf8'
  );
  console.log(`  + .meta moi cho thu muc  ${path.relative(ASSETS, absDir)}`);
}

function writePrefab(relFromPrefabDir, rootNode, uuid) {
  const filePath = path.join(PREFAB_DIR, relFromPrefabDir);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const json = P.build(rootNode, uuid);
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
  fs.writeFileSync(
    filePath + '.meta',
    JSON.stringify(P.prefabMeta(uuid), null, 2) + '\n',
    'utf8'
  );
  console.log(`  ok  ${relFromPrefabDir}  (${json.length} doi tuong)`);
}

// ─────────────────────────────────────────────────────────────────
// Asset
// ─────────────────────────────────────────────────────────────────

const IMG = A.spriteFrames({
  bgPopup: 'common/images/popup/bg_popup.png',
  titPopup: 'common/images/popup/tit_popup.png',
  btnClose: 'common/images/popup/btn_close.png',
  bgContent: 'common/images/border/bgContent.png',
  borderNho: 'common/images/border/borderTableNho.png',
  sliceBg: 'images/new/portal/account/vipNew/slice_bg.png',
  sliceFull: 'images/new/portal/account/vipNew/slice_full.png',
  treasure: 'images/new/portal/account/vipNew/treasure.png',
  iconThe: 'images/new/portal/account/vipNew/icon_the.png',
  btnNhan: 'lobby/images/image_nohu/GateImages/Vip/nhan-btn-normal.png',
  btnNhanDis: 'lobby/images/image_nohu/GateImages/Vip/nhan-btn-disable.png',
});

/** So bac VIP — phai trung MAX_RANK trong VipModel.js va bang PrivilegeType. */
const RANK_COUNT = 30;

/*
 * Luu y ve anh: KHONG dung bo lobby/images/image_nohu/GateImages/Vip/vipN.png.
 * Bo do da ve san chu "VIP3" va so moc "500" NGAY TRONG ANH, lai la anh doc —
 * dat canh label thi chu chong len chu (da thay khi test tren may).
 * Bo dung o day la huy hieu SACH, khong chu.
 */

/**
 * Huy hieu cho tung bac, anh xa 1-1: BADGES[0] la bac 1, BADGES[29] la bac 30.
 * Bac 1-5 dung bo vipN.png co san, tu bac 6 tro len dung icon_vN.png.
 */
const BADGES = [
  'common/images/VIP/vip1.png',
  'common/images/VIP/vip2.png',
  'common/images/VIP/vip3.png',
  'common/images/VIP/vip4.png',
  'common/images/VIP/vip5.png',
];
for (let i = 6; i <= 30; i++) {
  BADGES.push(`common/images/VIP/icon_v${i}.png`);
}

/**
 * Anh cho 30 bac.
 *
 * Bac nao chua co anh rieng thi lay tam anh cua bac GAN NHAT phia duoi da
 * co — nhu vay thu tu tang tien van dung, chi la hai bac lien tiep trong
 * giong nhau. Them anh dung ten icon_vN.png vao common/images/VIP roi chay
 * lai gen-vip.js la tu dong thay.
 */
const RANK_ICONS = (() => {
  const list = [];
  const missing = [];
  let lastGood = null;

  for (let rank = 1; rank <= RANK_COUNT; rank++) {
    const p = BADGES[rank - 1];
    let uuid = null;
    try {
      uuid = A.spriteFrame(p);
      lastGood = uuid;
    } catch (e) {
      missing.push(`bac ${rank}: ${p}`);
      uuid = lastGood; // dung anh cua bac ngay truoc
    }
    list.push(uuid ? { __uuid__: uuid } : null);
  }

  if (missing.length) {
    console.log(`  ! ${missing.length} bac chua co anh rieng, tam dung anh bac lien truoc:`);
    for (const m of missing) console.log(`      ${m}`);
  } else {
    console.log(`  i du ${RANK_COUNT} huy hieu rieng cho ${RANK_COUNT} bac`);
  }
  return list;
})();

// Mau chu
const C_GOLD = [255, 214, 122];
const C_WHITE = [255, 255, 255];
const C_DIM = [178, 190, 205];

// ─────────────────────────────────────────────────────────────────
// Prefab: VipRankItem — mot dong trong danh sach bac
// ─────────────────────────────────────────────────────────────────

const W_ITEM = 980;
const H_ITEM = 72;

function buildRankItem(uuidScript) {
  return P.node(
    'VipRankItem',
    { size: [W_ITEM, H_ITEM] },
    [
      P.node('bg', { size: [W_ITEM, H_ITEM] }, [], [
        P.sprite(IMG.bgContent, { type: 1, sizeMode: 0 }),
      ]),

      P.node('icon', { size: [56, 56], pos: [-430, 0], ref: 'icon' }, [], [
        P.sprite(null, { sizeMode: 0 }),
      ]),

      P.node('lbRankName', { size: [140, 34], pos: [-330, 0], ref: 'lbRank', color: C_GOLD }, [], [
        P.label('VIP 1', { size: 24, hAlign: 0, overflow: 1 }),
      ]),

      // Rong 280 va co chu 18: chuoi day du la "20.000.000 VP · nạp 400tr"
      // (~25 ky tu). O 220px co chu 20 nhu truoc thi bi cat mat phan nap.
      P.node('lbVpRequired', { size: [280, 30], pos: [-125, 0], ref: 'lbVp', color: C_DIM }, [], [
        P.label('0 VP', { size: 18, hAlign: 0, overflow: 1 }),
      ]),

      P.node('lbReward', { size: [220, 32], pos: [155, 0], ref: 'lbReward', color: C_WHITE }, [], [
        P.label('—', { size: 22, hAlign: 2, overflow: 1 }),
      ]),

      P.node('btnClaim', { size: [124, 44], pos: [400, 0], ref: 'claim' }, [
        P.node('lbClaim', { size: [124, 40], ref: 'lbClaim' }, [], [
          P.label('Nhận', { size: 20, overflow: 1 }),
        ]),
      ], [
        P.sprite(IMG.btnNhan, { sizeMode: 0 }),
        P.button({
          transition: 3,
          normal: IMG.btnNhan,
          disabled: IMG.btnNhanDis,
        }),
      ]),
    ],
    [
      P.script(uuidScript, {
        spIcon: P.refComp('icon', 'cc.Sprite'),
        lbRankName: P.refComp('lbRank', 'cc.Label'),
        lbVpRequired: P.refComp('lbVp', 'cc.Label'),
        lbReward: P.refComp('lbReward', 'cc.Label'),
        nodeClaim: P.ref('claim'),
        lbClaim: P.refComp('lbClaim', 'cc.Label'),
        sfClaimNormal: { __uuid__: IMG.btnNhan },
        sfClaimDisabled: { __uuid__: IMG.btnNhanDis },
      }),
    ]
  );
}

// ─────────────────────────────────────────────────────────────────
// Prefab: VipRankTab
// ─────────────────────────────────────────────────────────────────

const W_TAB = 1040;
const H_TAB = 440;

function buildRankTab(uuidScript, uuidItemPrefab) {
  const listW = 1000;
  const listH = 270;

  return P.node(
    'VipRankTab',
    { size: [W_TAB, H_TAB] },
    [
      // ── Tom tat bac hien tai ──
      P.node('summary', { size: [listW, 130], pos: [0, 150] }, [
        P.node('bg', { size: [listW, 130] }, [], [
          P.sprite(IMG.borderNho, { type: 1, sizeMode: 0 }),
        ]),

        // Icon chiem tu -478 den -402; chu bat dau tu -380 nen khong cham nhau.
        P.node('iconRank', { size: [76, 76], pos: [-440, 0], ref: 'iconRank' }, [], [
          P.sprite(RANK_ICONS[0] ? RANK_ICONS[0].__uuid__ : null, { sizeMode: 0 }),
        ]),

        P.node('lbRankName', { size: [230, 42], pos: [-265, 26], ref: 'lbRankName', color: C_GOLD }, [], [
          P.label('VIP 1', { size: 30, hAlign: 0, overflow: 1 }),
        ]),

        // Gop so va chu vao MOT label ("513 VP tích luỹ") — truoc day tach
        // lam hai node canh nhau nen de dam vao icon.
        P.node('lbVpAccumulated', { size: [230, 32], pos: [-265, -14], ref: 'lbVpAcc', color: C_WHITE }, [], [
          P.label('0 VP tích luỹ', { size: 19, hAlign: 0, overflow: 1 }),
        ]),

        // Thanh tien do
        P.node('progress', { size: [440, 28], pos: [190, 12], ref: 'bar' }, [
          P.node('bar', { size: [434, 22], pos: [-217, 0], anchor: [0, 0.5], ref: 'barFill' }, [], [
            P.sprite(IMG.sliceFull, { type: 1, sizeMode: 0 }),
          ]),
        ], [
          P.sprite(IMG.sliceBg, { type: 1, sizeMode: 0 }),
          P.progressBar({
            barSprite: P.refComp('barFill', 'cc.Sprite'),
            mode: 0,
            totalLength: 434,
            progress: 0,
          }),
        ]),

        P.node('lbProgress', { size: [440, 26], pos: [190, 12], ref: 'lbProgress', color: C_WHITE }, [], [
          P.label('0 / 0 VP', { size: 18, overflow: 1 }),
        ]),

        P.node('lbNextHint', { size: [460, 26], pos: [190, -26], ref: 'lbNext', color: C_DIM }, [], [
          P.label('', { size: 17, overflow: 1 }),
        ]),
      ]),

      // ── Tieu de cot ──
      P.node('header', { size: [listW, 28], pos: [0, 62] }, [
        P.node('h1', { size: [200, 26], pos: [-330, 0], color: C_DIM }, [], [
          P.label('Hạng', { size: 17, hAlign: 0, overflow: 1 }),
        ]),
        P.node('h2', { size: [280, 26], pos: [-125, 0], color: C_DIM }, [], [
          P.label('Điều kiện lên hạng', { size: 17, hAlign: 0, overflow: 1 }),
        ]),
        P.node('h3', { size: [220, 26], pos: [155, 0], color: C_DIM }, [], [
          P.label('Thưởng thăng hạng', { size: 17, hAlign: 2, overflow: 1 }),
        ]),
      ]),

      // ── Danh sach ──
      P.node('scroll', { size: [listW, listH], pos: [0, -90], ref: 'scroll' }, [
        P.node('view', { size: [listW, listH], ref: 'view' }, [
          P.node(
            'content',
            { size: [listW, 0], pos: [0, listH / 2], anchor: [0.5, 1], ref: 'listContent' },
            [],
            [
              P.layout({
                layoutType: 2,
                resize: 1,
                spacingY: 8,
                padding: { T: 4, B: 4 },
                size: [listW, 0],
              }),
            ]
          ),
        ], [
          P.mask({ type: 0 }),
        ]),
      ], [
        P.scrollView({ vertical: true, horizontal: false, content: P.ref('listContent') }),
      ]),

      // ── Trang thai rong ──
      P.node('empty', { size: [600, 80], pos: [0, -90], active: false, ref: 'empty' }, [
        P.node('lbEmpty', { size: [600, 70], ref: 'lbEmpty', color: C_DIM }, [], [
          P.label('', { size: 20, wrap: true, overflow: 0 }),
        ]),
      ]),
    ],
    [
      P.script(uuidScript, {
        spIconRank: P.refComp('iconRank', 'cc.Sprite'),
        lbRankName: P.refComp('lbRankName', 'cc.Label'),
        lbVpAccumulated: P.refComp('lbVpAcc', 'cc.Label'),
        barProgress: P.refComp('bar', 'cc.ProgressBar'),
        lbProgress: P.refComp('lbProgress', 'cc.Label'),
        lbNextHint: P.refComp('lbNext', 'cc.Label'),
        nodeListContent: P.ref('listContent'),
        prefabRankItem: { __uuid__: uuidItemPrefab },
        rankIcons: RANK_ICONS,
        nodeEmpty: P.ref('empty'),
        lbEmpty: P.refComp('lbEmpty', 'cc.Label'),
      }),
    ]
  );
}

// ─────────────────────────────────────────────────────────────────
// Prefab: VipPointTab
// ─────────────────────────────────────────────────────────────────

function buildPointTab(uuidScript) {
  /** Mot the so lieu lon. */
  const card = (name, refName, caption, iconUuid, x, colorNum) =>
    P.node('card' + name, { size: [460, 150], pos: [x, 110] }, [
      P.node('bg', { size: [460, 150] }, [], [
        P.sprite(IMG.borderNho, { type: 1, sizeMode: 0 }),
      ]),
      P.node('icon', { size: [72, 64], pos: [-170, 20] }, [], [
        P.sprite(iconUuid, { sizeMode: 0 }),
      ]),
      P.node('lbValue', { size: [280, 48], pos: [50, 24], ref: refName, color: colorNum }, [], [
        P.label('0', { size: 38, hAlign: 2, overflow: 1 }),
      ]),
      P.node('lbCaption', { size: [400, 26], pos: [0, -42], color: C_DIM }, [], [
        P.label(caption, { size: 18, overflow: 1 }),
      ]),
    ]);

  return P.node(
    'VipPointTab',
    { size: [W_TAB, H_TAB] },
    [
      card('Available', 'lbAvail', 'VIPPOINT khả dụng — dùng để đổi thưởng', IMG.iconThe, -250, C_GOLD),
      card('Accumulated', 'lbAcc', 'VIPPOINT tích luỹ — quyết định hạng VIP', IMG.treasure, 250, C_WHITE),

      P.node('rankRow', { size: [900, 40], pos: [0, 8] }, [
        P.node('lbRankName', { size: [900, 36], ref: 'lbRank', color: C_WHITE }, [], [
          P.label('VIP 1', { size: 24, overflow: 1 }),
        ]),
      ]),

      P.node('lbConversionHint', { size: [940, 30], pos: [0, -34], ref: 'lbHint', color: C_DIM }, [], [
        P.label('', { size: 18, wrap: true, overflow: 0 }),
      ]),

      // Chi hien khi server chua tra ve VP tich luy that
      P.node('estimateNote', { size: [940, 30], pos: [0, -70], active: false, ref: 'note', color: [255, 186, 120] }, [], [
        P.label('* Số tích luỹ đang là ước lượng, chưa phải số chính xác từ máy chủ.', {
          size: 16,
          wrap: true,
          overflow: 0,
        }),
      ]),

      // Cho danh san cho lich su VP / doi thuong
      P.node('comingSoon', { size: [940, 120], pos: [0, -150], ref: 'soon' }, [
        P.node('bg', { size: [940, 120], opacity: 90 }, [], [
          P.sprite(IMG.bgContent, { type: 1, sizeMode: 0 }),
        ]),
        P.node('lb', { size: [900, 100], color: C_DIM }, [], [
          P.label('Lịch sử VIPPOINT và đổi thưởng sẽ có ở bản cập nhật tới.', {
            size: 18,
            wrap: true,
            overflow: 0,
          }),
        ]),
      ]),
    ],
    [
      P.script(uuidScript, {
        lbVpAvailable: P.refComp('lbAvail', 'cc.Label'),
        lbVpAccumulated: P.refComp('lbAcc', 'cc.Label'),
        lbRankName: P.refComp('lbRank', 'cc.Label'),
        nodeEstimateNote: P.ref('note'),
        lbConversionHint: P.refComp('lbHint', 'cc.Label'),
        nodeComingSoon: P.ref('soon'),
      }),
    ]
  );
}

// ─────────────────────────────────────────────────────────────────
// Prefab: VipRakebackTab — Hoan tra cuoc (chua co backend)
// ─────────────────────────────────────────────────────────────────

function buildRakebackTab(uuidScript) {
  /** Mot o so lieu nho. */
  const cell = (name, refName, caption, x, y, w) =>
    P.node('cell' + name, { size: [w, 92], pos: [x, y] }, [
      P.node('bg', { size: [w, 92] }, [], [
        P.sprite(IMG.borderNho, { type: 1, sizeMode: 0 }),
      ]),
      P.node('lbValue', { size: [w - 24, 36], pos: [0, 12], ref: refName, color: C_WHITE }, [], [
        P.label('—', { size: 26, overflow: 1 }),
      ]),
      P.node('lbCaption', { size: [w - 24, 24], pos: [0, -26], color: C_DIM }, [], [
        P.label(caption, { size: 16, overflow: 1 }),
      ]),
    ]);

  return P.node(
    'VipRakebackTab',
    { size: [W_TAB, H_TAB] },
    [
      // ── Phan so lieu, an di khi chua co API ──
      P.node('content', { size: [W_TAB, H_TAB], active: false, ref: 'content' }, [
        P.node('hero', { size: [940, 150], pos: [0, 130] }, [
          P.node('bg', { size: [940, 150] }, [], [
            P.sprite(IMG.borderNho, { type: 1, sizeMode: 0 }),
          ]),
          P.node('icon', { size: [78, 68], pos: [-380, 16] }, [], [
            P.sprite(IMG.treasure, { sizeMode: 0 }),
          ]),
          P.node('lbAmount', { size: [520, 56], pos: [40, 22], ref: 'lbAmount', color: C_GOLD }, [], [
            P.label('0', { size: 44, overflow: 1 }),
          ]),
          P.node('lbCaption', { size: [820, 26], pos: [0, -44], color: C_DIM }, [], [
            P.label('Tiền hoàn trả kỳ này', { size: 18, overflow: 1 }),
          ]),
        ]),

        cell('Rate', 'lbRate', 'Tỷ lệ hoàn theo hạng', -310, 0, 300),
        cell('Period', 'lbPeriod', 'Kỳ hoàn trả', 0, 0, 300),
        cell('Bet', 'lbTotalBet', 'Tổng cược trong kỳ', 310, 0, 300),

        P.node('btnClaim', { size: [124, 44], pos: [0, -110], ref: 'claim' }, [
          P.node('lbClaim', { size: [124, 40], ref: 'lbClaim' }, [], [
            P.label('Nhận', { size: 20, overflow: 1 }),
          ]),
        ], [
          P.sprite(IMG.btnNhan, { sizeMode: 0 }),
          P.button({ transition: 3, normal: IMG.btnNhan, disabled: IMG.btnNhanDis }),
        ]),
      ]),

      // ── Man hinh "chua co" ──
      P.node('notReady', { size: [900, 200], pos: [0, 20], ref: 'notReady' }, [
        P.node('icon', { size: [78, 68], pos: [0, 60] }, [], [
          P.sprite(IMG.treasure, { sizeMode: 0 }),
        ]),
        P.node('lb', { size: [860, 110], pos: [0, -30], ref: 'lbNotReady', color: C_DIM }, [], [
          P.label('', { size: 20, wrap: true, overflow: 0 }),
        ]),
      ]),
    ],
    [
      P.script(uuidScript, {
        lbAmount: P.refComp('lbAmount', 'cc.Label'),
        lbRate: P.refComp('lbRate', 'cc.Label'),
        lbPeriod: P.refComp('lbPeriod', 'cc.Label'),
        lbTotalBet: P.refComp('lbTotalBet', 'cc.Label'),
        nodeClaim: P.ref('claim'),
        lbClaim: P.refComp('lbClaim', 'cc.Label'),
        nodeNotReady: P.ref('notReady'),
        lbNotReady: P.refComp('lbNotReady', 'cc.Label'),
        nodeContent: P.ref('content'),
      }),
    ]
  );
}

// ─────────────────────────────────────────────────────────────────
// Prefab: VipLixiTab — Li xi / hong bao (chua co backend)
// ─────────────────────────────────────────────────────────────────

function buildLixiTab(uuidScript) {
  const listW = 960;
  const listH = 300;

  return P.node(
    'VipLixiTab',
    { size: [W_TAB, H_TAB] },
    [
      P.node('content', { size: [W_TAB, H_TAB], active: false, ref: 'content' }, [
        P.node('lbCount', { size: [900, 34], pos: [0, 190], ref: 'lbCount', color: C_GOLD }, [], [
          P.label('Bạn có 0 hồng bao chưa mở', { size: 22, overflow: 1 }),
        ]),

        P.node('scroll', { size: [listW, listH], pos: [0, 0], ref: 'scroll' }, [
          P.node('view', { size: [listW, listH], ref: 'view' }, [
            P.node(
              'listContent',
              { size: [listW, 0], pos: [0, listH / 2], anchor: [0.5, 1], ref: 'listContent' },
              [],
              [
                P.layout({
                  layoutType: 2,
                  resize: 1,
                  spacingY: 10,
                  padding: { T: 6, B: 6 },
                  size: [listW, 0],
                }),
              ]
            ),
          ], [
            P.mask({ type: 0 }),
          ]),
        ], [
          P.scrollView({ vertical: true, horizontal: false, content: P.ref('listContent') }),
        ]),
      ]),

      P.node('notReady', { size: [900, 200], pos: [0, 20], ref: 'notReady' }, [
        P.node('icon', { size: [84, 61], pos: [0, 60] }, [], [
          P.sprite(IMG.iconThe, { sizeMode: 0 }),
        ]),
        P.node('lb', { size: [860, 110], pos: [0, -30], ref: 'lbNotReady', color: C_DIM }, [], [
          P.label('', { size: 20, wrap: true, overflow: 0 }),
        ]),
      ]),
    ],
    [
      P.script(uuidScript, {
        nodeListContent: P.ref('listContent'),
        lbCount: P.refComp('lbCount', 'cc.Label'),
        nodeNotReady: P.ref('notReady'),
        lbNotReady: P.refComp('lbNotReady', 'cc.Label'),
        nodeContent: P.ref('content'),
      }),
    ]
  );
}

// ─────────────────────────────────────────────────────────────────
// Prefab: VipPopup — khung ngoai
// ─────────────────────────────────────────────────────────────────

const W_POPUP = 1100;
const H_POPUP = 620;

const TAB_TITLES = ['HẠNG VIP', 'VIPPOINT', 'HOÀN TRẢ', 'LÌ XÌ'];
// Ca 4 tab deu mo duoc. Hai tab cuoi da co prefab + script rieng nhung
// chua co backend nen ben trong hien phan giai thich, khong hien so gia.
const TAB_ENABLED = [true, true, true, true];

function buildPopup(uuidScript, uuidHelp) {
  const tabW = 236;
  const tabH = 56;
  const gap = 12;
  const totalW = TAB_TITLES.length * tabW + (TAB_TITLES.length - 1) * gap;

  const tabs = TAB_TITLES.map((title, i) =>
    P.node(
      'tab' + i,
      {
        size: [tabW, tabH],
        pos: [-totalW / 2 + tabW / 2 + i * (tabW + gap), 0],
        ref: 'tab' + i,
        opacity: TAB_ENABLED[i] ? 255 : 120,
      },
      [
        P.node('lb', { size: [tabW - 16, 34], color: TAB_ENABLED[i] ? C_GOLD : C_DIM }, [], [
          P.label(title, { size: 21, overflow: 1 }),
        ]),
      ],
      [
        P.sprite(IMG.bgPopup, { type: 1, sizeMode: 0 }),
        P.button({ transition: 3, zoomScale: 1.04, interactable: TAB_ENABLED[i] }),
      ]
    )
  );

  return P.node(
    'VipPopup',
    { size: [W_POPUP, H_POPUP] },
    [
      // Nen mo phu kin man hinh, bam ra ngoai khong dong (tranh bam nham)
      P.node('dim', { size: [2000, 1400], color: [0, 0, 0], opacity: 160 }, [], [
        P.sprite(IMG.bgPopup, { type: 1, sizeMode: 0 }),
      ]),

      P.node('frame', { size: [W_POPUP, H_POPUP] }, [
        P.node('bg', { size: [W_POPUP, H_POPUP] }, [], [
          P.sprite(IMG.bgPopup, { type: 1, sizeMode: 0 }),
        ]),

        P.node('titleBar', { size: [420, 64], pos: [0, H_POPUP / 2 - 10] }, [
          P.node('bgTitle', { size: [420, 64] }, [], [
            P.sprite(IMG.titPopup, { type: 1, sizeMode: 0 }),
          ]),
          P.node('lbTitle', { size: [400, 44], ref: 'lbTitle', color: C_GOLD }, [], [
            P.label('ĐẶC QUYỀN VIP', { size: 28, overflow: 1 }),
          ]),
        ]),

        P.node('btnClose', {
          size: [66, 67],
          pos: [W_POPUP / 2 - 34, H_POPUP / 2 - 34],
          ref: 'btnClose',
        }, [], [
          P.sprite(IMG.btnClose, { sizeMode: 0 }),
          P.button({ transition: 3, zoomScale: 1.1 }),
        ]),

        // Nut "?" — mo bang giai thich cach tinh diem
        P.node('btnHelp', {
          size: [48, 48],
          pos: [W_POPUP / 2 - 104, H_POPUP / 2 - 34],
          ref: 'btnHelp',
        }, [
          P.node('lb', { size: [48, 44], color: C_GOLD }, [], [
            P.label('?', { size: 30, overflow: 1 }),
          ]),
        ], [
          P.sprite(IMG.bgPopup, { type: 1, sizeMode: 0 }),
          P.button({ transition: 3, zoomScale: 1.12 }),
        ]),

        P.node('tabbar', { size: [totalW, tabH], pos: [0, H_POPUP / 2 - 110] }, tabs),

        P.node('content', {
          size: [W_TAB, H_TAB],
          pos: [0, -40],
          ref: 'content',
        }),

        P.node('loading', { size: [300, 60], pos: [0, -40], active: false, ref: 'loading' }, [
          P.node('lb', { size: [300, 50], color: C_WHITE }, [], [
            P.label('Đang tải...', { size: 22, overflow: 1 }),
          ]),
        ]),
      ]),

      // ── Bang giai thich, phu len tren cung, an san ──
      buildHelpPanel(uuidHelp),
    ],
    [
      P.script(uuidScript, {
        lbTitle: P.refComp('lbTitle', 'cc.Label'),
        nodeContent: P.ref('content'),
        tabButtons: [P.ref('tab0'), P.ref('tab1'), P.ref('tab2'), P.ref('tab3')],
        nodeLoading: P.ref('loading'),
        btnClose: P.ref('btnClose'),
        btnHelp: P.ref('btnHelp'),
        nodeHelp: P.ref('help'),
      }),
    ]
  );
}

// ─────────────────────────────────────────────────────────────────
// Bang giai thich cach tinh diem (nam trong VipPopup, an san)
// ─────────────────────────────────────────────────────────────────

function buildHelpPanel(uuidScript) {
  const boxW = 720;
  const boxH = 500;
  const viewH = boxH - 92;

  return P.node(
    'help',
    { size: [W_POPUP, H_POPUP], active: false, ref: 'help' },
    [
      // Nen mo — bam ra ngoai hop la dong
      P.node('dim', { size: [2000, 1400], color: [0, 0, 0], opacity: 190, ref: 'helpDim' }, [], [
        P.sprite(IMG.bgPopup, { type: 1, sizeMode: 0 }),
      ]),

      P.node('box', { size: [boxW, boxH] }, [
        P.node('bg', { size: [boxW, boxH] }, [], [
          P.sprite(IMG.bgPopup, { type: 1, sizeMode: 0 }),
        ]),

        P.node('lbTitle', { size: [boxW - 40, 44], pos: [0, boxH / 2 - 34], color: C_GOLD }, [], [
          P.label('CÁCH TÍNH VIPPOINT', { size: 25, overflow: 1 }),
        ]),

        P.node('btnClose', {
          size: [52, 53],
          pos: [boxW / 2 - 30, boxH / 2 - 28],
          ref: 'helpClose',
        }, [], [
          P.sprite(IMG.btnClose, { sizeMode: 0 }),
          P.button({ transition: 3, zoomScale: 1.1 }),
        ]),

        // Noi dung dai -> cho vao ScrollView de cuon duoc
        P.node('scroll', { size: [boxW - 56, viewH], pos: [0, -30], ref: 'helpScroll' }, [
          P.node('view', { size: [boxW - 56, viewH], ref: 'helpView' }, [
            P.node(
              'content',
              { size: [boxW - 76, 900], pos: [0, viewH / 2], anchor: [0.5, 1], ref: 'helpContent' },
              [
                P.node('lb', {
                  size: [boxW - 96, 880],
                  pos: [0, -440],
                  ref: 'lbHelp',
                  color: C_WHITE,
                }, [], [
                  P.label('', { size: 18, hAlign: 0, vAlign: 0, wrap: true, overflow: 0, lineHeight: 27 }),
                ]),
              ]
            ),
          ], [
            P.mask({ type: 0 }),
          ]),
        ], [
          P.scrollView({ vertical: true, horizontal: false, content: P.ref('helpContent') }),
        ]),
      ]),
    ],
    [
      P.script(uuidScript, {
        lbContent: P.refComp('lbHelp', 'cc.Label'),
        nodeClose: P.ref('helpClose'),
        nodeDim: P.ref('helpDim'),
      }),
    ]
  );
}

// ─────────────────────────────────────────────────────────────────
// Chay
// ─────────────────────────────────────────────────────────────────

function main() {
  console.log('Sinh prefab popup VIP');
  console.log('---------------------');

  // Thu muc moi phai co .meta truoc, neu khong Cocos se tu sinh khi mo
  ensureFolderMeta(SCRIPT_DIR);
  ensureFolderMeta(path.join(SCRIPT_DIR, 'tabs'));
  ensureFolderMeta(path.join(SCRIPT_DIR, 'items'));
  ensureFolderMeta(PREFAB_DIR);
  ensureFolderMeta(path.join(PREFAB_DIR, 'tabs'));
  ensureFolderMeta(path.join(PREFAB_DIR, 'items'));

  const sItem = scriptUuid(path.join('items', 'VipRankItem.js'));
  const sRankTab = scriptUuid(path.join('tabs', 'VipRankTab.js'));
  const sPointTab = scriptUuid(path.join('tabs', 'VipPointTab.js'));
  const sRakeTab = scriptUuid(path.join('tabs', 'VipRakebackTab.js'));
  const sLixiTab = scriptUuid(path.join('tabs', 'VipLixiTab.js'));
  const sPopup = scriptUuid('VipPopup.js');
  const sHelp = scriptUuid('VipHelpPanel.js');
  // Hai file duoi khong phai component nhung van can .meta de Cocos import
  scriptUuid('VipService.js');
  scriptUuid('VipModel.js');
  scriptUuid('VipTabs.js');
  scriptUuid('VipOpenButton.js');

  const uItem = prefabUuid(path.join('items', 'VipRankItem.prefab'));
  const uRankTab = prefabUuid(path.join('tabs', 'VipRankTab.prefab'));
  const uPointTab = prefabUuid(path.join('tabs', 'VipPointTab.prefab'));
  const uRakeTab = prefabUuid(path.join('tabs', 'VipRakebackTab.prefab'));
  const uLixiTab = prefabUuid(path.join('tabs', 'VipLixiTab.prefab'));
  const uPopup = prefabUuid('VipPopup.prefab');

  writePrefab(path.join('items', 'VipRankItem.prefab'), buildRankItem(sItem), uItem);
  writePrefab(path.join('tabs', 'VipRankTab.prefab'), buildRankTab(sRankTab, uItem), uRankTab);
  writePrefab(path.join('tabs', 'VipPointTab.prefab'), buildPointTab(sPointTab), uPointTab);
  writePrefab(path.join('tabs', 'VipRakebackTab.prefab'), buildRakebackTab(sRakeTab), uRakeTab);
  writePrefab(path.join('tabs', 'VipLixiTab.prefab'), buildLixiTab(sLixiTab), uLixiTab);
  writePrefab('VipPopup.prefab', buildPopup(sPopup, sHelp), uPopup);

  console.log('---------------------');
  console.log('Xong.');
}

main();
