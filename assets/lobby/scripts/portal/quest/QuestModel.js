/**
 * QuestModel — chuan hoa du lieu nhiem vu tu may chu.
 *
 * Giu rieng khoi view de moi cho doc cung mot cach: dinh dang tien, tien
 * do, va quan trong nhat la QUYET DINH NUT NAO hien.
 */

'use strict';

/** Loai nhiem vu — khop QuestConfig.Type ben DB. */
const TYPE = {
  BET: 1,     // cuoc
  DEPOSIT: 2, // nap tien
  LOGIN: 3,   // dang nhap
};

/** Chu ky — khop QuestConfig.Cycle. */
const CYCLE = {
  DAILY: 1, // hang ngay
  ONCE: 2,  // mot lan ca doi
};

/** Trang thai — khop QuestProgress.Status. */
const STATUS = {
  DOING: 0,     // dang lam
  DONE: 1,      // xong, chua bam nhan
  CLAIMED: 2,   // da nhan
};

/**
 * Nut nao hien tren dong nhiem vu.
 *
 * Bo anh user thiet ke da co nut RIENG cho tung viec — do la chi tiet tot:
 * nut noi thang viec can lam thay vi "Lam" chung chung, va bam vao dua
 * thang toi cho lam duoc.
 */
const ACTION = {
  CLAIM: 'claim',     // da xong -> ButtonNhan
  DEPOSIT: 'deposit', // chua xong, nhiem vu nap -> buttonDeposit, mo man nap
  BET: 'bet',         // chua xong, nhiem vu cuoc -> buttonBetNow, mo game
  DONE: 'done',       // da nhan roi -> iconChecked, khong bam duoc
  NONE: 'none',       // khong co gi de bam (nhiem vu dang nhap chua xong)
};

/** GameID -> ten game, de nut "Cuoc" biet mo cai gi. */
const GAME_NAME = {
  8: 'Tài Xỉu',
  68: 'Tài Xỉu MD5',
  63: 'Xóc Đĩa',
  70: 'Sicbo',
};

/** 1234567 -> "1.234.567" */
function formatNumber(n) {
  const v = Math.floor(Number(n) || 0);
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Tien do dang doc duoc.
 *
 * Nhiem vu dang nhap khong hien "0/1" — con so do vo nghia voi nguoi choi;
 * ho chi can biet da xong hay chua.
 */
function formatProgress(q) {
  if (q.type === TYPE.LOGIN) return '';
  const cur = Math.min(q.progress, q.target);
  return `(${formatNumber(cur)}/${formatNumber(q.target)})`;
}

/** Chu ky dang doc duoc. */
function formatCycle(cycle) {
  return cycle === CYCLE.DAILY ? 'Hằng ngày' : 'Một lần';
}

/** Chuan hoa mot dong tu SP_Quest_List. */
function parseItem(raw) {
  if (!raw) return null;

  const type = Number(raw.Type) || 0;
  const status = Number(raw.Status) || 0;
  const progress = Math.floor(Number(raw.Progress) || 0);
  const target = Math.floor(Number(raw.Target) || 0);
  const reached = !!raw.Reached;

  // Quyet dinh nut o day chu khong o view: mot cho quyet dinh thi moi man
  // hinh hien giong nhau
  let action;
  if (status === STATUS.CLAIMED) action = ACTION.DONE;
  else if (status === STATUS.DONE || reached) action = ACTION.CLAIM;
  else if (type === TYPE.DEPOSIT) action = ACTION.DEPOSIT;
  else if (type === TYPE.BET) action = ACTION.BET;
  else action = ACTION.NONE;

  return {
    questId: Number(raw.QuestID) || 0,
    code: raw.Code || '',
    title: raw.Title || '',
    description: raw.Description || '',
    type,
    gameId: Number(raw.GameID) || 0,
    gameName: GAME_NAME[Number(raw.GameID)] || '',
    target,
    reward: Math.floor(Number(raw.Reward) || 0),
    cycle: Number(raw.Cycle) || CYCLE.DAILY,
    sortOrder: Number(raw.SortOrder) || 0,

    progress,
    status,
    reached,
    action,

    isClaimed: status === STATUS.CLAIMED,
    isDone: status === STATUS.DONE,

    progressText: formatProgress({ type, progress, target }),
    cycleText: formatCycle(Number(raw.Cycle) || CYCLE.DAILY),
    rewardText: formatNumber(Number(raw.Reward) || 0),
  };
}

/** Chuan hoa ket qua SP_Quest_Summary. */
function parseSummary(raw) {
  if (!raw) return null;
  const count = Number(raw.ClaimableCount) || 0;
  return {
    enabled: !!raw.Enabled,
    claimableCount: count,
    claimableAmount: Math.floor(Number(raw.ClaimableAmount) || 0),
    totalQuest: Number(raw.TotalQuest) || 0,
    /** Co gi de nhac o lobby khong. */
    hasClaimable: count > 0,
  };
}

module.exports = {
  TYPE,
  CYCLE,
  STATUS,
  ACTION,
  GAME_NAME,
  formatNumber,
  formatProgress,
  formatCycle,
  parseItem,
  parseSummary,
};
