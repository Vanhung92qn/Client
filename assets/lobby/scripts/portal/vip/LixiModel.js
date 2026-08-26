/**
 * LixiModel — chuan hoa du lieu li xi tu server thanh thu client dung duoc.
 *
 * Giu rieng khoi view de cho nao cung doc cung mot cach: dinh dang tien,
 * dem nguoc, ten kieu hong bao.
 */

'use strict';

/** Kieu dot phat — khop LixiCampaign.Type ben DB. */
const TYPE = {
  GOLDEN: 1,  // khung gio vang
  MONTHLY: 2, // li xi thang
  MANUAL: 3,  // qua tang CSKH
};

/** Trang thai hong bao — khop LixiEnvelope.Status. */
const STATUS = {
  PENDING: 0, // chua mo
  OPENED: 1,  // da mo, tien da vao vi
  EXPIRED: 2, // het han, mat
};

/** Ten hien cho tung kieu khi server khong gui Title. */
const TYPE_NAME = {
  [TYPE.GOLDEN]: 'Khung giờ vàng',
  [TYPE.MONTHLY]: 'Lì xì tháng',
  [TYPE.MANUAL]: 'Quà tặng từ CSKH',
};

/** 1234567 -> "1.234.567" */
function formatNumber(n) {
  const v = Math.floor(Number(n) || 0);
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Dem nguoc cho de doc.
 *
 * Duoi 1 gio thi hien mm:ss — do la luc nguoi choi can biet chinh xac con
 * bao lau. Tren 1 gio thi so giay khong con y nghia gi.
 *
 * @param {number} seconds
 * @returns {string}
 */
function formatCountdown(seconds) {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  if (s <= 0) return 'Đã hết hạn';

  if (s < 3600) {
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${m}:${ss < 10 ? '0' : ''}${ss}`;
  }
  if (s < 86400) {
    return `còn ${Math.floor(s / 3600)} giờ`;
  }
  return `còn ${Math.floor(s / 86400)} ngày`;
}

/**
 * Menh gia hien cho nguoi choi.
 *
 * Hai so BANG NHAU nghia la menh gia co dinh — hien mot so thay vi
 * "5.000d - 5.000d" cho thua. Ca hai deu lay tu LixiConfig nen con so hien
 * ra LUON bang con so thuc phat.
 */
function formatRange(min, max) {
  const a = Math.floor(Number(min) || 0);
  const b = Math.floor(Number(max) || 0);
  if (b > a) return `${formatNumber(a)}đ - ${formatNumber(b)}đ`;
  return `${formatNumber(a)}đ`;
}

/**
 * Chuan hoa mot dong tu SP_Lixi_List.
 * @param {object} raw
 */
function parseItem(raw) {
  if (!raw) return null;

  const type = Number(raw.Type) || 0;
  const status = Number(raw.Status) || 0;
  const secondsLeft = Math.max(0, Number(raw.SecondsLeft) || 0);

  return {
    id: Number(raw.ID) || 0,
    campaignId: Number(raw.CampaignID) || 0,
    type,
    typeName: TYPE_NAME[type] || 'Lì xì',
    // Title cua server uu tien hon (kieu CSKH thi day la ly do phat)
    title: raw.Title || TYPE_NAME[type] || 'Lì xì',
    amount: Math.floor(Number(raw.Amount) || 0),
    status,
    secondsLeft,
    // Het han tinh theo secondsLeft cua SERVER chu khong theo dong ho may
    // nguoi choi — may lech gio thi dem nguoc se sai
    isPending: status === STATUS.PENDING && secondsLeft > 0,
    isOpened: status === STATUS.OPENED,
    isExpired: status === STATUS.EXPIRED || (status === STATUS.PENDING && secondsLeft <= 0),
    openDate: raw.OpenDate || null,
  };
}

/**
 * Gio phat ke tiep, dang doc duoc.
 * @param {number} hour  0..23, -1 nghia la khong co lich
 * @param {number} minutes  con bao nhieu phut nua
 */
function formatNextGolden(hour, minutes) {
  if (hour < 0) return '';

  const hh = `${hour < 10 ? '0' : ''}${hour}h00`;

  // Duoi mot tieng thi noi so phut cho de hinh dung; xa hon thi so phut
  // khong con y nghia gi
  if (minutes > 0 && minutes < 60) return `Khung giờ sau: ${hh} (còn ${minutes} phút)`;
  return `Khung giờ sau: ${hh}`;
}

/** Chuan hoa ket qua SP_Lixi_Summary. */
function parseSummary(raw) {
  if (!raw) return null;

  const quantity = Number(raw.GoldenQuantity) || 0;
  const min = Number(raw.GoldenMin) || 0;
  const max = Number(raw.GoldenMax) || 0;

  const nextHour = raw.NextGoldenHour === undefined ? -1 : Number(raw.NextGoldenHour);
  const nextMinutes = Math.max(0, Number(raw.NextGoldenMinutes) || 0);

  const activeCampaignId = Number(raw.ActiveCampaignID) || 0;
  const activeRemain = Number(raw.ActiveRemain) || 0;
  const alreadyGrabbed = !!raw.AlreadyGrabbed;
  const personalCount = Number(raw.PersonalCount) || 0;

  return {
    enabled: !!raw.Enabled,
    pendingCount: Number(raw.PendingCount) || 0,
    pendingAmount: Math.floor(Number(raw.PendingAmount) || 0),

    // ── Rieng loai 2 + 3: qua CUA RIENG nguoi nay ────────────────
    // Nut "Li xi cua ban" o lobby chi hien khi con so nay > 0
    personalCount,
    personalAmount: Math.floor(Number(raw.PersonalAmount) || 0),

    activeCampaignId,
    activeRemain,
    activeSeconds: Math.max(0, Number(raw.ActiveSeconds) || 0),
    alreadyGrabbed,

    // Khung gio ke tiep — de ngoai gio van noi duoc bao gio quay lai
    nextGoldenHour: nextHour,
    nextGoldenMinutes: nextMinutes,
    nextGoldenText: formatNextGolden(nextHour, nextMinutes),

    // Cau hinh that. KHONG con hien cho nguoi choi (user chot 2026-08-27)
    // nhung giu lai vi man hinh quan tri va cac man sau nay con dung.
    goldenQuantity: quantity,
    goldenMin: min,
    goldenMax: max,
    goldenText: formatRange(min, max),

    /** Dot dang mo, con hong bao, va minh chua lay. */
    canGrab: !!raw.Enabled && activeCampaignId > 0 && activeRemain > 0 && !alreadyGrabbed,

    /** Dot dang dien ra (du minh da lay hay chua). */
    goldenLive: activeCampaignId > 0 && Math.max(0, Number(raw.ActiveSeconds) || 0) > 0,
  };
}

module.exports = {
  TYPE,
  STATUS,
  TYPE_NAME,
  formatNumber,
  formatCountdown,
  formatRange,
  formatNextGolden,
  parseItem,
  parseSummary,
};
