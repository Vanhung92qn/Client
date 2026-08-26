/**
 * gen-lixi.js — sinh 4 prefab cua he Li xi bang code.
 *
 *   node tools/prefab/gen-lixi.js        (cwd = C:\Server\Client)
 *
 * Vi sao sinh bang code chu khong dung Cocos Creator: VPS khong mo noi
 * editor. Bu lai, sinh bang code cho phep chay lai bao nhieu lan cung duoc
 * ma uuid khong doi (giu .meta cu), va moi thay doi bo cuc deu doc duoc
 * trong diff git thay vi mot khoi JSON 2000 dong.
 *
 * Bon prefab:
 *   Lixi/LixiPopup.prefab       man chinh — danh sach + khoi gio vang
 *   Lixi/items/LixiItem.prefab  mot dong trong danh sach
 *   Lixi/LixiOpenView.prefab    man hieu ung mo hong bao
 *   Lixi/LixiHelpPopup.prefab   bang giai thich
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
const SCRIPT_DIR = path.join(ASSETS, 'lobby', 'scripts', 'portal', 'vip');

// ─────────────────────────────────────────────────────────────────
// Ha tang — cung khuon voi gen-vip.js
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
// Anh hong bao: project KHONG co PNG roi nao ten lixi/hongbao. Chi co bo
// Spine lobby/skeletons/event/HongBao/. Trong do HongBao_sf.png la anh
// TINH mot khung — dung duoc ngay cho cc.Sprite, khong can ve moi.
// ─────────────────────────────────────────────────────────────────

const IMG = A.spriteFrames({
  bgPopup: 'common/images/popup/bg_popup.png',
  titPopup: 'common/images/popup/tit_popup.png',
  btnClose: 'common/images/popup/btn_close.png',
  borderNho: 'common/images/border/borderTableNho.png',
  bgContent: 'common/images/border/bgContent.png',
  btnNhan: 'lobby/images/image_nohu/GateImages/Vip/nhan-btn-normal.png',
  btnNhanDis: 'lobby/images/image_nohu/GateImages/Vip/nhan-btn-disable.png',
  hongBao: 'lobby/skeletons/event/HongBao/HongBao_sf.png',
  coinGold: 'common/images/coin-gold.png',
  gift: 'tk/images/bonus/gift.png',
});

const C_GOLD = [255, 214, 122];
const C_WHITE = [255, 255, 255];
const C_DIM = [178, 190, 205];
const C_HOT = [255, 150, 90];

// ─────────────────────────────────────────────────────────────────
// Khung popup dung chung — cung bo cuc voi popup VIP va Hoan tra
// ─────────────────────────────────────────────────────────────────

function popupFrame(title, w, h, inner) {
  return [
    // Co ref de script bind duoc — bang giai thich cho bam nen mo de dong
    P.node('dim', { size: [2000, 1400], color: [0, 0, 0], opacity: 160, ref: 'dim' }, [], [
      P.sprite(IMG.bgPopup, { type: 1, sizeMode: 0 }),
    ]),

    P.node('frame', { size: [w, h] }, [
      P.node('bg', { size: [w, h] }, [], [
        P.sprite(IMG.bgPopup, { type: 1, sizeMode: 0 }),
      ]),

      P.node('titleBar', { size: [420, 64], pos: [0, h / 2 - 10] }, [
        P.node('bgTitle', { size: [420, 64] }, [], [
          P.sprite(IMG.titPopup, { type: 1, sizeMode: 0 }),
        ]),
        P.node('lbTitle', { size: [400, 44], ref: 'lbTitle', color: C_GOLD }, [], [
          P.label(title, { size: 26, overflow: 1 }),
        ]),
      ]),

      P.node('btnClose', {
        size: [66, 67],
        pos: [w / 2 - 34, h / 2 - 34],
        ref: 'btnClose',
      }, [], [
        P.sprite(IMG.btnClose, { sizeMode: 0 }),
        P.button({ transition: 3, zoomScale: 1.1 }),
      ]),

      ...inner,
    ]),
  ];
}

// ─────────────────────────────────────────────────────────────────
// 1. LixiItem — mot hong bao trong danh sach
// ─────────────────────────────────────────────────────────────────

const ITEM_W = 760;
const ITEM_H = 110;

function buildItem(uScript) {
  return P.node('LixiItem', { size: [ITEM_W, ITEM_H] }, [
    P.node('bgItem', { size: [ITEM_W, ITEM_H] }, [], [
      P.sprite(IMG.borderNho, { type: 1, sizeMode: 0 }),
    ]),

    // Anh phong bao ben trai
    P.node('iconBao', {
      size: [76, 76],
      pos: [-ITEM_W / 2 + 56, 0],
      ref: 'iconBao',
    }, [], [
      P.sprite(IMG.hongBao, { sizeMode: 0 }),
    ]),

    // Ten dot phat
    P.node('lbName', {
      size: [420, 34],
      pos: [-ITEM_W / 2 + 116 + 210, 18],
      anchor: [0, 0.5],
      ref: 'lbName',
      color: C_WHITE,
    }, [], [
      P.label('Khung giờ vàng 12h', { size: 24, hAlign: 0, overflow: 1 }),
    ]),

    // Dong phu: dem nguoc / so tien / het han
    P.node('lbSub', {
      size: [420, 30],
      pos: [-ITEM_W / 2 + 116 + 210, -18],
      anchor: [0, 0.5],
      ref: 'lbSub',
      color: C_WHITE,
    }, [], [
      P.label('12:45', { size: 21, hAlign: 0, overflow: 1 }),
    ]),

    // Nut Mo
    P.node('btnOpen', {
      size: [124, 44],
      pos: [ITEM_W / 2 - 82, 0],
      ref: 'btnOpen',
    }, [
      P.node('lbOpen', { size: [124, 40], color: C_WHITE }, [], [
        P.label('Mở', { size: 22, overflow: 1 }),
      ]),
    ], [
      P.sprite(IMG.btnNhan, { sizeMode: 0 }),
      P.button({ transition: 3, zoomScale: 1.06 }),
    ]),

    // Chu thay cho nut khi da mo / het han
    P.node('lbDone', {
      size: [124, 40],
      pos: [ITEM_W / 2 - 82, 0],
      ref: 'lbDone',
      color: C_DIM,
      active: false,
    }, [], [
      P.label('Đã nhận', { size: 21, overflow: 1 }),
    ]),
  ], [
    P.script(uScript, {
      spriteBao: P.refComp('iconBao', 'cc.Sprite'),
      lbName: P.refComp('lbName', 'cc.Label'),
      lbSub: P.refComp('lbSub', 'cc.Label'),
      nodeOpen: P.ref('btnOpen'),
      lbDone: P.refComp('lbDone', 'cc.Label'),
      sfBaoClosed: { __uuid__: IMG.hongBao },
      sfBaoOpened: { __uuid__: IMG.gift },
    }),
  ]);
}

// ─────────────────────────────────────────────────────────────────
// 2. LixiPopup — man chinh
// ─────────────────────────────────────────────────────────────────

const POPUP_W = 860;
const POPUP_H = 600;

/**
 * Man chinh — dung CHUNG cho hai popup:
 *
 *   Khung gio vang   co khoi gio vang, chi hien hong bao loai 1
 *   Li xi cua ban    khong co khoi gio vang, hien loai 2 + 3
 *
 * Hai cai giong nhau toi 90% (danh sach, trang thai rong, nut tro giup,
 * nut lich su) nen dung chung mot ham va mot script; khac nhau o
 * filterTypes va hasGoldenBlock truyen vao.
 *
 * @param {object} o
 *   nodeName, title, uScript, uItemPrefab, uHelpPrefab,
 *   filterTypes  [1] hoac [2,3]
 *   golden       co dung khoi khung gio vang khong
 */
function buildPopup(o) {
  const uScript = o.uScript;
  const uItemPrefab = o.uItemPrefab;
  const uHelpPrefab = o.uHelpPrefab;
  const listW = 780;
  // Khong co khoi gio vang thi danh sach duoc cao them — dung de trong
  const listH = o.golden ? 300 : 380;

  return P.node(o.nodeName, { size: [POPUP_W, POPUP_H] }, popupFrame(o.title, POPUP_W, POPUP_H, [

    // Nut "?" canh nut dong
    P.node('btnHelp', {
      size: [48, 48],
      pos: [POPUP_W / 2 - 104, POPUP_H / 2 - 34],
      ref: 'btnHelp',
    }, [
      P.node('lbQ', { size: [48, 44], color: C_GOLD }, [], [
        P.label('?', { size: 30, overflow: 1 }),
      ]),
    ], [
      P.button({ transition: 3, zoomScale: 1.15 }),
    ]),

    // ── Dong dau: dang co bao nhieu ──────────────────────────────
    P.node('lbCount', {
      size: [560, 34],
      pos: [-POPUP_W / 2 + 40 + 280, POPUP_H / 2 - 92],
      anchor: [0, 0.5],
      ref: 'lbCount',
      color: C_WHITE,
    }, [], [
      P.label('Bạn có 3 hồng bao chưa mở', { size: 24, hAlign: 0, overflow: 1 }),
    ]),

    P.node('lbTotal', {
      size: [260, 32],
      pos: [POPUP_W / 2 - 40 - 130, POPUP_H / 2 - 92],
      anchor: [1, 0.5],
      ref: 'lbTotal',
      color: C_GOLD,
    }, [], [
      P.label('Tổng 145.000đ', { size: 22, hAlign: 2, overflow: 1 }),
    ]),

    // ── Khoi khung gio vang ──────────────────────────────────────
    // LUON HIEN o popup gio vang (ke ca ngoai gio — luc do no noi "khung
    // gio sau: 12h00"). Popup "Li xi cua ban" khong dung khoi nay.
    P.node('nodeGolden', {
      size: [780, 96],
      pos: [0, POPUP_H / 2 - 168],
      ref: 'nodeGolden',
      active: !!o.golden,
    }, [
      P.node('bgGolden', { size: [780, 96] }, [], [
        P.sprite(IMG.borderNho, { type: 1, sizeMode: 0 }),
      ]),

      P.node('lbGoldenInfo', {
        size: [470, 32],
        pos: [-780 / 2 + 24 + 235, 20],
        anchor: [0, 0.5],
        ref: 'lbGoldenInfo',
        color: C_HOT,
      }, [], [
        P.label('Còn 19/20 hồng bao · 5.000đ', { size: 22, hAlign: 0, overflow: 1 }),
      ]),

      P.node('lbGoldenCountdown', {
        size: [470, 28],
        pos: [-780 / 2 + 24 + 235, -18],
        anchor: [0, 0.5],
        ref: 'lbGoldenCountdown',
        color: C_DIM,
      }, [], [
        P.label('14:32', { size: 20, hAlign: 0, overflow: 1 }),
      ]),

      P.node('btnGrab', {
        size: [180, 56],
        pos: [780 / 2 - 110, 0],
        ref: 'btnGrab',
      }, [
        P.node('lbGrab', { size: [180, 44], ref: 'lbGrab', color: C_WHITE }, [], [
          P.label('Cướp lì xì', { size: 24, overflow: 1 }),
        ]),
      ], [
        P.sprite(IMG.btnNhan, { type: 1, sizeMode: 0 }),
        P.button({ transition: 3, zoomScale: 1.06 }),
      ]),
    ]),

    // ── Danh sach ────────────────────────────────────────────────
    P.node('nodeContent', { size: [listW, listH], pos: [0, o.golden ? -60 : -20], ref: 'nodeContent' }, [
      P.node('scroll', { size: [listW, listH] }, [
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
              spacingY: 8,
              padding: { T: 4, B: 4 },
              size: [listW, 0],
            }),
          ]),
        ], [
          P.mask({ type: 0 }),
        ]),
      ], [
        P.scrollView({ vertical: true, horizontal: false, content: P.ref('listContent') }),
      ]),
    ]),

    // ── Trang thai rong ──────────────────────────────────────────
    // Man hinh trong la co hoi nhac quay lai, khong de no trong khong
    P.node('nodeEmpty', {
      size: [640, 220],
      pos: [0, o.golden ? -60 : -20],
      ref: 'nodeEmpty',
      active: false,
    }, [
      P.node('iconEmpty', { size: [90, 90], pos: [0, 66], opacity: 130 }, [], [
        P.sprite(IMG.hongBao, { sizeMode: 0 }),
      ]),
      P.node('lbEmpty', {
        size: [620, 130],
        pos: [0, -34],
        ref: 'lbEmpty',
        color: C_DIM,
      }, [], [
        P.label(
          'Chưa có hồng bao nào\n\nQuay lại lúc 12h00 hoặc 21h00\nđể cướp lì xì khung giờ vàng',
          { size: 21, lineHeight: 30, overflow: 1, wrap: true }
        ),
      ]),
    ]),

    // ── Dang tai ─────────────────────────────────────────────────
    P.node('nodeLoading', {
      size: [300, 40],
      pos: [0, o.golden ? -60 : -20],
      ref: 'nodeLoading',
      color: C_DIM,
      active: false,
    }, [], [
      P.label('Đang tải...', { size: 22, overflow: 1 }),
    ]),

    // ── Nut mo lich su ───────────────────────────────────────────
    // Lich su la popup RIENG: man nay de hanh dong (cuop, mo), man kia de
    // tra cuu. Nhet chung thi man hanh dong dai ra vi thu khong ai xem
    // thuong xuyen.
    P.node('btnHistory', {
      size: [200, 46],
      pos: [POPUP_W / 2 - 130, -POPUP_H / 2 + 46],
      ref: 'btnHistory',
    }, [
      P.node('lbHistory', { size: [200, 40], color: C_DIM }, [], [
        P.label('Lịch sử nhận  ›', { size: 20, overflow: 1 }),
      ]),
    ], [
      P.button({ transition: 3, zoomScale: 1.06 }),
    ]),

  ]), [
    P.script(uScript, {
      lbTitle: P.refComp('lbTitle', 'cc.Label'),
      btnClose: P.ref('btnClose'),
      btnHelp: P.ref('btnHelp'),
      lbCount: P.refComp('lbCount', 'cc.Label'),
      lbTotal: P.refComp('lbTotal', 'cc.Label'),
      nodeGolden: P.ref('nodeGolden'),
      lbGoldenInfo: P.refComp('lbGoldenInfo', 'cc.Label'),
      lbGoldenCountdown: P.refComp('lbGoldenCountdown', 'cc.Label'),
      nodeGrab: P.ref('btnGrab'),
      lbGrab: P.refComp('lbGrab', 'cc.Label'),
      nodeListContent: P.ref('listContent'),
      prefabItem: { __uuid__: uItemPrefab },
      nodeEmpty: P.ref('nodeEmpty'),
      lbEmpty: P.refComp('lbEmpty', 'cc.Label'),
      nodeContent: P.ref('nodeContent'),
      nodeLoading: P.ref('nodeLoading'),
      prefabHelp: { __uuid__: uHelpPrefab },
      btnHistory: P.ref('btnHistory'),
      // Hai popup dung chung script, khac nhau o hai gia tri nay
      filterTypes: o.filterTypes,
      hasGoldenBlock: !!o.golden,
    }),
  ]);
}

// ─────────────────────────────────────────────────────────────────
// 3. LixiOpenView — man hieu ung mo hong bao
//
// Phu kin man hinh, khong dung popupFrame: day la mot khoanh khac chu
// khong phai mot bang thong tin, co khung vien vao lai lam nhat di.
// ─────────────────────────────────────────────────────────────────

function buildOpenView(uScript) {
  return P.node('LixiOpenView', { size: [2000, 1400] }, [

    P.node('dim', {
      size: [2000, 1400],
      color: [0, 0, 0],
      opacity: 190,
      ref: 'dim',
    }, [], [
      P.sprite(IMG.bgPopup, { type: 1, sizeMode: 0 }),
    ]),

    // Phong bao dong — rung nhe roi bung ra
    P.node('nodeBao', { size: [220, 220], pos: [0, 20], ref: 'nodeBao' }, [], [
      P.sprite(IMG.hongBao, { sizeMode: 0 }),
    ]),

    // Khoi ket qua
    P.node('nodeResult', {
      size: [560, 420],
      ref: 'nodeResult',
      active: false,
    }, [
      P.node('lbHeader', {
        size: [520, 44],
        pos: [0, 150],
        ref: 'lbHeader',
        color: C_GOLD,
      }, [], [
        P.label('CHÚC MỪNG', { size: 30, overflow: 1 }),
      ]),

      P.node('fxCoin', { size: [120, 120], pos: [0, 56], ref: 'fxCoin', active: false }, [], [
        P.sprite(IMG.coinGold, { sizeMode: 0 }),
      ]),

      P.node('lbAmount', {
        size: [540, 80],
        pos: [0, -18],
        ref: 'lbAmount',
        color: C_GOLD,
      }, [], [
        P.label('5.000đ', { size: 46, overflow: 1, wrap: true }),
      ]),

      P.node('lbSource', {
        size: [520, 34],
        pos: [0, -80],
        ref: 'lbSource',
        color: C_DIM,
      }, [], [
        P.label('Khung giờ vàng 12h', { size: 21, overflow: 1 }),
      ]),

      P.node('btnConfirm', {
        size: [200, 60],
        pos: [0, -160],
        ref: 'btnConfirm',
      }, [
        P.node('lbConfirm', { size: [200, 46], ref: 'lbConfirm', color: C_WHITE }, [], [
          P.label('Nhận', { size: 24, overflow: 1 }),
        ]),
      ], [
        P.sprite(IMG.btnNhan, { type: 1, sizeMode: 0 }),
        P.button({ transition: 3, zoomScale: 1.06 }),
      ]),
    ]),

  ], [
    P.script(uScript, {
      nodeBao: P.ref('nodeBao'),
      nodeResult: P.ref('nodeResult'),
      lbAmount: P.refComp('lbAmount', 'cc.Label'),
      lbSource: P.refComp('lbSource', 'cc.Label'),
      lbHeader: P.refComp('lbHeader', 'cc.Label'),
      nodeConfirm: P.ref('btnConfirm'),
      lbConfirm: P.refComp('lbConfirm', 'cc.Label'),
      fxCoin: P.ref('fxCoin'),
      nodeDim: P.ref('dim'),
    }),
  ]);
}

// ─────────────────────────────────────────────────────────────────
// 3b. LixiHistoryPopup — lich su da nhan
// ─────────────────────────────────────────────────────────────────

const HIST_W = 860;
const HIST_H = 560;

function buildHistory(uScript, uItemPrefab) {
  const listW = 780;
  const listH = 380;

  return P.node('LixiHistoryPopup', { size: [HIST_W, HIST_H] },
    popupFrame('LỊCH SỬ LÌ XÌ', HIST_W, HIST_H, [

      // Dong tong ket: da nhan bao nhieu cai, tong bao nhieu tien
      P.node('lbSummary', {
        size: [740, 34],
        pos: [0, HIST_H / 2 - 92],
        ref: 'lbSummary',
        color: C_GOLD,
      }, [], [
        P.label('Đã nhận 3 hồng bao · tổng 15.000đ', { size: 22, overflow: 1 }),
      ]),

      P.node('scroll', { size: [listW, listH], pos: [0, -34] }, [
        P.node('view', { size: [listW, listH] }, [
          P.node('histContent', {
            size: [listW, 0],
            pos: [0, listH / 2],
            anchor: [0.5, 1],
            ref: 'histContent',
          }, [], [
            P.layout({
              layoutType: 2,
              resize: 1,
              spacingY: 8,
              padding: { T: 4, B: 4 },
              size: [listW, 0],
            }),
          ]),
        ], [
          P.mask({ type: 0 }),
        ]),
      ], [
        P.scrollView({ vertical: true, horizontal: false, content: P.ref('histContent') }),
      ]),

      P.node('nodeEmpty', {
        size: [640, 160],
        pos: [0, -34],
        ref: 'nodeEmpty',
        active: false,
      }, [
        P.node('lbEmpty', { size: [620, 120], ref: 'lbEmpty', color: C_DIM }, [], [
          P.label('Bạn chưa nhận lì xì nào\n\nNhận rồi sẽ thấy ở đây',
            { size: 21, lineHeight: 30, overflow: 1, wrap: true }),
        ]),
      ]),

      P.node('nodeLoading', {
        size: [300, 40],
        pos: [0, -34],
        ref: 'nodeLoading',
        color: C_DIM,
        active: false,
      }, [], [
        P.label('Đang tải...', { size: 22, overflow: 1 }),
      ]),

    ]),
  [
    P.script(uScript, {
      lbTitle: P.refComp('lbTitle', 'cc.Label'),
      btnClose: P.ref('btnClose'),
      lbSummary: P.refComp('lbSummary', 'cc.Label'),
      nodeListContent: P.ref('histContent'),
      prefabItem: { __uuid__: uItemPrefab },
      nodeEmpty: P.ref('nodeEmpty'),
      lbEmpty: P.refComp('lbEmpty', 'cc.Label'),
      nodeLoading: P.ref('nodeLoading'),
    }),
  ]);
}

// ─────────────────────────────────────────────────────────────────
// 4. LixiHelpPopup — bang giai thich
// ─────────────────────────────────────────────────────────────────

const HELP_W = 760;
const HELP_H = 640;

function buildHelp(uScript) {
  const listW = 680;
  const listH = 470;

  return P.node('LixiHelpPopup', { size: [HELP_W, HELP_H] },
    popupFrame('LÌ XÌ LÀ GÌ', HELP_W, HELP_H, [
      P.node('scroll', { size: [listW, listH], pos: [0, -34] }, [
        P.node('view', { size: [listW, listH] }, [
          P.node('helpContent', {
            size: [listW, 0],
            pos: [0, listH / 2],
            anchor: [0.5, 1],
            ref: 'helpContent',
          }, [
            P.node('lbContent', {
              size: [listW - 40, 900],
              anchor: [0.5, 1],
              ref: 'lbContent',
              color: C_WHITE,
            }, [], [
              // Noi dung that do LixiHelpPanel._build() sinh tu du lieu
              // server; chuoi o day chi de nhin thay bo cuc trong editor
              P.label('Đang tải nội dung...', {
                size: 20,
                lineHeight: 30,
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
              padding: { T: 8, B: 8 },
              size: [listW, 0],
            }),
          ]),
        ], [
          P.mask({ type: 0 }),
        ]),
      ], [
        P.scrollView({ vertical: true, horizontal: false, content: P.ref('helpContent') }),
      ]),
    ]),
  [
    P.script(uScript, {
      lbContent: P.refComp('lbContent', 'cc.Label'),
      nodeClose: P.ref('btnClose'),
      nodeDim: P.ref('dim'),
    }),
  ]);
}

// ─────────────────────────────────────────────────────────────────

function main() {
  console.log('Sinh prefab he Li xi\n');

  ensureFolderMeta(path.join(SCRIPT_DIR, 'items'));
  ensureFolderMeta(path.join(PREFAB_DIR, 'Lixi'));
  ensureFolderMeta(path.join(PREFAB_DIR, 'Lixi', 'items'));

  // Moi file .js phai co .meta de Cocos require duoc theo ten — ke ca file
  // khong phai component (LixiService, LixiModel)
  const uService = scriptUuid('LixiService.js');
  const uModel = scriptUuid('LixiModel.js');
  const uPopup = scriptUuid('LixiPopup.js');
  const uItem = scriptUuid(path.join('items', 'LixiItem.js'));
  const uOpen = scriptUuid('LixiOpenView.js');
  const uHelp = scriptUuid('LixiHelpPanel.js');
  const uBadge = scriptUuid('LixiBadge.js');
  const uHist = scriptUuid('LixiHistoryPopup.js');
  console.log(`  script: service=${uService.slice(0, 8)} model=${uModel.slice(0, 8)} badge=${uBadge.slice(0, 8)}\n`);

  const P_ITEM = path.join('Lixi', 'items', 'LixiItem.prefab');
  const P_OPEN = path.join('Lixi', 'LixiOpenView.prefab');
  const P_HELP = path.join('Lixi', 'LixiHelpPopup.prefab');
  const P_POPUP = path.join('Lixi', 'LixiPopup.prefab');
  const P_MINE = path.join('Lixi', 'LixiMinePopup.prefab');
  const P_HIST = path.join('Lixi', 'LixiHistoryPopup.prefab');

  const uItemPf = prefabUuid(P_ITEM);
  const uOpenPf = prefabUuid(P_OPEN);
  const uHelpPf = prefabUuid(P_HELP);
  const uPopupPf = prefabUuid(P_POPUP);
  const uMinePf = prefabUuid(P_MINE);
  const uHistPf = prefabUuid(P_HIST);

  // Prefab CON sinh truoc: popup cha can uuid cua chung de bind property
  writePrefab(P_ITEM, buildItem(uItem), uItemPf);
  writePrefab(P_OPEN, buildOpenView(uOpen), uOpenPf);
  writePrefab(P_HELP, buildHelp(uHelp), uHelpPf);
  writePrefab(P_HIST, buildHistory(uHist, uItemPf), uHistPf);

  // Hai popup chinh — cung ham, cung script, khac filterTypes va golden
  writePrefab(P_POPUP, buildPopup({
    nodeName: 'LixiPopup',
    title: 'KHUNG GIỜ VÀNG',
    uScript: uPopup,
    uItemPrefab: uItemPf,
    uHelpPrefab: uHelpPf,
    filterTypes: [1],
    golden: true,
  }), uPopupPf);

  writePrefab(P_MINE, buildPopup({
    nodeName: 'LixiMinePopup',
    title: 'LÌ XÌ CỦA BẠN',
    uScript: uPopup,
    uItemPrefab: uItemPf,
    uHelpPrefab: uHelpPf,
    filterTypes: [2, 3],
    golden: false,
  }), uMinePf);

  console.log('\nXong. Kiem lai bang: node tools/prefab/validate.js');
}

main();
