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
  RAKEBACK: 'rakeback',
  LIXI: 'lixi',
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
  // Hai tab duoi da co cho san trong UI nhung chua co backend.
  // Bat len khi API tuong ung san sang.
  [ID.RAKEBACK]: {
    id: ID.RAKEBACK,
    title: 'HOÀN TRẢ',
    prefab: 'portal/vip/tabs/VipRakebackTab',
    component: 'VipRakebackTab',
    enabled: false,
  },
  [ID.LIXI]: {
    id: ID.LIXI,
    title: 'LÌ XÌ',
    prefab: 'portal/vip/tabs/VipLixiTab',
    component: 'VipLixiTab',
    enabled: false,
  },
};

/** Thu tu hien thi — phai trung thu tu mang tabButtons trong prefab. */
const ORDER = [ID.RANK, ID.POINT, ID.RAKEBACK, ID.LIXI];

module.exports = {
  ID,
  BY_ID,
  ORDER,
  DEFAULT: ID.RANK,
};
