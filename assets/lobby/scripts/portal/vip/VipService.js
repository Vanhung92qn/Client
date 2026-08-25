/**
 * VipService — mot cua duy nhat de goi API VIP.
 *
 * Thay cho 7 file Command roi rac cua ban cu (GetVIPInfoCommand,
 * ChangeVPToGifCommand, GetVIPCardBonusCommand, ...). Moi cai truoc day
 * lap lai cung mot doan sendRequest + JSON.parse + check ResponseCode.
 *
 * Hai thu duoc sua o day:
 *   1. ServerConnector.sendRequest CHI goi callback khi HTTP 200. Mat mang
 *      hay timeout thi callback khong bao gio chay -> UI treo mai o trang
 *      thai "dang tai". Ham request() ben duoi tu dat han gio de Promise
 *      LUON ket thuc, du thanh cong hay that bai.
 *   2. Gop cache vao mot cho, khong rai rac trong tung view.
 */

'use strict';

const ENDPOINT = {
  USER_VP: 'api/VIP2/GetUserVP',
  CLAIM_RANK: 'api/VIP2/ChangeVPToGif',
  RAKEBACK: 'api/VIP2/GetRakeback',
  RAKEBACK_CLAIM: 'api/VIP2/ClaimRakeback',
  RAKEBACK_HISTORY: 'api/VIP2/GetRakebackHistory',
};

/** Han gio tu bao ve (ms) — dai hon timeout 60s cua XHR mot chut. */
const REQUEST_TIMEOUT = 62000;

/** Thoi gian song cua cache (ms). Server cung cache 300s. */
const CACHE_TTL = 60000;

const _cache = Object.create(null);

/**
 * Boc mot loi goi API thanh Promise luon ket thuc.
 * @param {string} url
 * @param {object|null} body  co body -> POST, khong co -> GET
 * @returns {Promise<object>} object da parse tu JSON
 */
function request(url, body) {
  return new Promise((resolve, reject) => {
    let done = false;

    const finish = (fn, arg) => {
      if (done) return;
      done = true;
      fn(arg);
    };

    const timer = setTimeout(() => {
      finish(reject, new Error(`Het thoi gian cho: ${url}`));
    }, REQUEST_TIMEOUT);

    const onResponse = (responseText) => {
      clearTimeout(timer);
      let obj;
      try {
        obj = JSON.parse(responseText);
      } catch (e) {
        finish(reject, new Error(`Server tra ve khong phai JSON: ${url}`));
        return;
      }
      finish(resolve, obj);
    };

    const conn = cc.ServerConnector.getInstance();
    if (body) {
      conn.sendRequestPOST(cc.SubdomainName.PORTAL, url, JSON.stringify(body), onResponse);
    } else {
      conn.sendRequest(cc.SubdomainName.PORTAL, url, onResponse);
    }
  });
}

/** Bao loi ra popup dung chung cua game. */
function showError(obj) {
  const msg = (obj && obj.Message) || 'Có lỗi xảy ra, vui lòng thử lại.';
  const code = obj && obj.ResponseCode;
  cc.PopupController.getInstance().showMessageError(msg, code);
}

const VipService = {
  ENDPOINT,

  /**
   * Lay thong tin VIP cua nguoi choi hien tai.
   * Tra ve nguyen response de VipModel chuan hoa.
   * @param {boolean} force bo qua cache
   */
  getUserVp(force) {
    const key = 'userVp';
    const hit = _cache[key];
    if (!force && hit && Date.now() - hit.at < CACHE_TTL) {
      return Promise.resolve(hit.data);
    }
    return request(ENDPOINT.USER_VP).then((obj) => {
      if (obj.ResponseCode !== 1) {
        showError(obj);
        throw new Error(`GetUserVP that bai: ${obj.ResponseCode}`);
      }
      _cache[key] = { at: Date.now(), data: obj };
      return obj;
    });
  },

  /**
   * Nhan thuong thang hang cua mot bac.
   * @param {number} rankId
   * @returns {Promise<{Balance:number}>}
   */
  claimRankReward(rankId) {
    return request(ENDPOINT.CLAIM_RANK, { RankID: String(rankId) }).then((obj) => {
      if (obj.ResponseCode !== 1) {
        showError(obj);
        throw new Error(`ChangeVPToGif that bai: ${obj.ResponseCode}`);
      }
      // Nhan xong thi so lieu cu khong con dung nua
      VipService.clearCache();
      return obj;
    });
  },

  /**
   * So du hoan tra cuoc.
   * @param {boolean} force bo qua cache — tien hoan cong lien tuc sau moi van
   *                  nen thuong xuyen can so moi nhat
   */
  getRakeback(force) {
    const key = 'rakeback';
    const hit = _cache[key];
    if (!force && hit && Date.now() - hit.at < CACHE_TTL) {
      return Promise.resolve(hit.data);
    }
    return request(ENDPOINT.RAKEBACK).then((obj) => {
      if (obj.ResponseCode !== 1) {
        showError(obj);
        throw new Error(`GetRakeback that bai: ${obj.ResponseCode}`);
      }
      _cache[key] = { at: Date.now(), data: obj };
      return obj;
    });
  },

  /**
   * Nhan tien hoan tra. Lay tron goi phan nguyen dang co; phan le duoi
   * 1 dong server giu lai cong don cho lan sau.
   */
  claimRakeback() {
    return request(ENDPOINT.RAKEBACK_CLAIM, {}).then((obj) => {
      if (obj.ResponseCode !== 1) {
        showError(obj);
        throw new Error(`ClaimRakeback that bai: ${obj.ResponseCode}`);
      }
      VipService.clearCache();
      return obj;
    });
  },

  /** Lich su nhan hoan tra. */
  getRakebackHistory(top) {
    const url = `${ENDPOINT.RAKEBACK_HISTORY}?top=${top || 50}`;
    return request(url).then((obj) => {
      if (obj.ResponseCode !== 1) {
        showError(obj);
        throw new Error(`GetRakebackHistory that bai: ${obj.ResponseCode}`);
      }
      return obj.List || [];
    });
  },

  clearCache() {
    for (const k of Object.keys(_cache)) delete _cache[k];
  },
};

module.exports = VipService;
