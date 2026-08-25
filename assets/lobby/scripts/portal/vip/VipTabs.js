/**
 * VipTabs — khai bao cac tab cua popup VIP o MOT cho duy nhat.
 *
 * Them mot tinh nang moi (vi du Hoan tra cuoc) chi can:
 *   1. dat `enabled: true` o duoi,
 *   2. tao prefab tabs/<Ten>Tab.prefab,
 *   3. viet script tabs/<Ten>Tab.js co ham refresh().
 * Khong phai sua VipPopup.js.
 *
 * `component` la ten class dang ky trong Cocos — phai trung ten file script
 * cua tab do.
 */

'use strict';

const ID = {
  RANK: 'rank',
  POINT: 'point',
};

const BY_ID = {
  [ID.RANK]: {
    id: ID.RANK,
    title: 'HẠNG VIP',
    prefab: 'portal/vip/tabs/VipRankTab',
    component: 'VipRankTab',
    enabled: true,
  },
  [ID.POINT]: {
    id: ID.POINT,
    title: 'VIPPOINT',
    prefab: 'portal/vip/tabs/VipPointTab',
    component: 'VipPointTab',
    enabled: true,
  },
  // Hoan tra va Li xi KHONG con la tab o day nua — moi cai la mot popup
  // RIENG, mo bang nut rieng tu lobby. Xem VipPopups.js.
};

/** Thu tu hien thi — phai trung thu tu mang tabButtons trong prefab. */
const ORDER = [ID.RANK, ID.POINT];

module.exports = {
  ID,
  BY_ID,
  ORDER,
  DEFAULT: ID.RANK,
};
