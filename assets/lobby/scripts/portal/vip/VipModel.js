/**
 * VipModel — chuan hoa du lieu VIP tu API ve mot dang duy nhat cho UI dung.
 *
 * Ly do can file nay: response cua api/VIP2/GetUserVP co vai cho de gay hieu nham
 *
 *   - `VP` la VP KHA DUNG (tieu duoc, giam khi doi thuong), KHONG phai VP
 *     TICH LUY (chi tang, la cai quyet dinh bac VIP). Ban client cu lay `VP`
 *     roi so voi moc thang hang -> sai ngay khi nguoi choi doi thuong lan dau.
 *
 *   - Response KHONG tra ve bac hien tai (RankID) lan VP tich luy. Server co
 *     du lieu do (bang UserPrivilege) nhung khong dua ra. Model nay chap nhan
 *     ca hai truong hop: neu API duoc bo sung field thi dung so that, con
 *     khong thi suy ra tu danh sach va DANH DAU la uoc luong, de UI biet ma
 *     khong hien thi nhu so chinh xac.
 *
 *   - `RankName` tu server chi dung toi bac 10, bac 11-15 tra ve "Vip 1".
 *     Vi vay ten bac luon duoc tinh o client.
 */

'use strict';

/**
 * So bac VIP toi da. Tu 2026-08-25 la 30 bac (truoc do 15).
 * Phai trung so dong trong bang PrivilegeType, xem migration
 * Database/BettingGameCore/_migrations/2026-08-25_vip_30_ranks.sql
 */
const MAX_RANK = 30;

/** Ten hien thi cua mot bac. */
function rankName(rankId) {
  const id = Number(rankId) || 0;
  if (id < 1) return 'VIP 1';
  if (id > MAX_RANK) return `VIP ${MAX_RANK}`;
  return `VIP ${id}`;
}

/** 1.234.567 */
function formatNumber(n) {
  const v = Math.floor(Number(n) || 0);
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Rut gon tien cho vua o hep: 5.000.000 -> "5tr", 20.000.000.000 -> "20 tỷ".
 * Dung o cho chi can nhin luot; cho nao can so chinh xac thi dung formatNumber.
 */
function formatShort(n) {
  const v = Math.floor(Number(n) || 0);
  if (v >= 1000000000) {
    const t = v / 1000000000;
    return (t % 1 === 0 ? t : t.toFixed(1)) + ' tỷ';
  }
  if (v >= 1000000) {
    const t = v / 1000000;
    return (t % 1 === 0 ? t : t.toFixed(1)) + 'tr';
  }
  if (v >= 1000) return Math.round(v / 1000) + 'k';
  return String(v);
}

/** Doi DIEM sang tien cuoc tuong ung: 1 diem = 1.000d */
const VND_PER_POINT = 1000;
function pointToMoney(point) {
  return (Number(point) || 0) * VND_PER_POINT;
}

/**
 * @typedef {object} VipRank
 * @property {number}  rankId
 * @property {string}  name
 * @property {number}  vpRequired  VP tich luy can co de dat bac
 * @property {number}  reward      tien thuong thang hang
 * @property {boolean} claimed     da nhan thuong bac nay chua
 * @property {boolean} reached     da dat duoc bac nay chua
 */

/**
 * @param {object} res response tho tu api/VIP2/GetUserVP
 */
function parse(res) {
  const raw = Array.isArray(res.ListReWard) ? res.ListReWard : [];

  const vpAvailable = Number(res.VP) || 0;
  /** Tong tien da nap — server tra ve tu 2026-08-25. */
  const totalDeposit = Number(res.TotalDeposit) || 0;

  // Server co the (chua) tra ve hai field nay.
  const hasAccumulated = res.AccumulatedVP !== undefined && res.AccumulatedVP !== null;
  const hasRankId = res.RankID !== undefined && res.RankID !== null;

  const vpAccumulated = hasAccumulated ? Number(res.AccumulatedVP) || 0 : vpAvailable;

  const ranks = raw
    .map((r) => ({
      rankId: Number(r.RankID) || 0,
      name: rankName(r.RankID),
      vpRequired: Number(r.VipPoint) || 0,
      reward: Number(r.RefundAmount) || 0,
      claimed: Number(r.RedeemStatus) === 1,
      // Tu 2026-08-25 server tra ve them. Client cu khong doc cung khong sao.
      requiredDeposit: Number(r.RequiredDeposit) || 0,
      monthlyReward: Number(r.MonthlyReward) || 0,
      rakebackPercent: Number(r.RakebackPercent) || 0,
      groupName: r.GroupName || '',
      reached: false, // dien o duoi
    }))
    .filter((r) => r.rankId > 0)
    .sort((a, b) => a.rankId - b.rankId);

  // Bac hien tai: uu tien so that tu server, khong co thi suy ra tu VP.
  let currentRankId;
  if (hasRankId) {
    currentRankId = Number(res.RankID) || 1;
  } else {
    currentRankId = 1;
    for (const r of ranks) {
      if (vpAccumulated >= r.vpRequired) currentRankId = r.rankId;
    }
  }

  for (const r of ranks) {
    r.reached = r.rankId <= currentRankId;
  }

  // Bac ke tiep chua dat duoc
  const next = ranks.find((r) => r.rankId > currentRankId) || null;
  const current = ranks.find((r) => r.rankId === currentRankId) || null;

  let progress = 1;
  let vpToNext = 0;
  /** Con thieu bao nhieu TIEN NAP de len bac ke tiep. */
  let depositToNext = 0;
  /**
   * Ly do chua len duoc bac ke tiep: 'point' | 'deposit' | 'both' | null.
   *
   * Can phan biet ro: nguoi choi cuoc rat nhieu nhung nap it thi DU DIEM ma
   * van khong len hang. Neu chi bao "con thieu X diem" thi ho se thac mac vi
   * diem da du roi.
   */
  let blockedBy = null;

  if (next) {
    vpToNext = Math.max(0, next.vpRequired - vpAccumulated);
    depositToNext = Math.max(0, next.requiredDeposit - totalDeposit);
    if (vpToNext > 0 && depositToNext > 0) blockedBy = 'both';
    else if (vpToNext > 0) blockedBy = 'point';
    else if (depositToNext > 0) blockedBy = 'deposit';
    // Do tu 0 chu KHONG tu moc bac hien tai, de khop voi nhan
    // "513 / 1.000 VP" hien ngay tren thanh. Neu do tu moc bac thi
    // nhan bao 513/1.000 (nhin nhu quá nua) ma thanh moi chay 2,6%
    // — nguoi choi tuong bi loi.
    progress = next.vpRequired > 0 ? vpAccumulated / next.vpRequired : 0;
    progress = Math.min(1, Math.max(0, progress));
  }

  return {
    /** VP tieu duoc. */
    vpAvailable,
    /** Tong tien da nap thanh cong. */
    totalDeposit,
    /** Con thieu bao nhieu tien nap de len bac ke tiep. */
    depositToNext,
    /** Vi sao chua len bac ke tiep: 'point' | 'deposit' | 'both' | null. */
    blockedBy,
    /** VP tich luy — quyet dinh bac. Bang vpAvailable neu server chua tra ve. */
    vpAccumulated,
    /**
     * true khi hai so tren la SO THAT tu server; false khi dang tam dung
     * vpAvailable thay cho vpAccumulated (UI nen an bot chi tiet khi false).
     */
    accurate: hasAccumulated && hasRankId,
    currentRankId,
    currentRankName: rankName(currentRankId),
    ranks,
    current,
    next,
    /** Ti le hoan thanh toi bac ke tiep, 0..1 */
    progress,
    /** Con bao nhieu VP nua len bac ke tiep */
    vpToNext,
    /** Cac bac da dat nhung chua nhan thuong */
    claimable: ranks.filter((r) => r.reached && !r.claimed && r.reward > 0),
  };
}

module.exports = {
  MAX_RANK,
  VND_PER_POINT,
  rankName,
  formatNumber,
  formatShort,
  pointToMoney,
  parse,
};
