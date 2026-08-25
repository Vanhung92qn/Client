/**
 * LixiService — mot cua duy nhat de goi API Li xi.
 *
 * Cung khuon voi VipService: boc sendRequest thanh Promise LUON ket thuc.
 * Ly do phai tu dat han gio: cc.ServerConnector CHI goi callback khi HTTP
 * 200 — mat mang hay 500 thi callback khong bao gio chay, UI treo mai o
 * trang thai "dang tai".
 *
 * KHONG cache o day. Khac VipService (thong tin VIP doi cham), li xi la
 * cuoc tranh nhau tinh bang giay: cache mot giay cung du de nguoi choi bam
 * vao hong bao da bi nguoi khac lay mat, roi nhan thong bao kho hieu.
 */

'use strict';

const ENDPOINT = {
  SUMMARY: 'api/Lixi/GetSummary',
  LIST: 'api/Lixi/GetList',
  GRAB: 'api/Lixi/Grab',
  OPEN: 'api/Lixi/Open',
};

/** Han gio tu bao ve (ms) — dai hon timeout 60s cua XHR mot chut. */
const REQUEST_TIMEOUT = 62000;

/**
 * Boc mot loi goi API thanh Promise luon ket thuc.
 * @param {string} url
 * @param {object|null} body co body -> POST, khong co -> GET
 * @returns {Promise<object>}
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

const LixiService = {
  ENDPOINT,

  /**
   * Tom tat cho badge o lobby: co bao nhieu hong bao dang cho, va co dot
   * khung gio vang nao dang dien ra khong.
   *
   * Goi theo nhip nen phai that nhe. KHONG bao loi ra popup khi that bai —
   * badge im lang la duoc, khong the dam popup vao mat nguoi choi mot cach
   * dinh ky chi vi mang chap chon.
   */
  getSummary() {
    return request(ENDPOINT.SUMMARY, null).then((obj) => {
      if (!obj || obj.ResponseCode !== 1) {
        throw new Error(`GetSummary loi: ${obj && obj.ResponseCode}`);
      }
      return obj;
    });
  },

  /** Danh sach hong bao cua nguoi choi. */
  getList(top) {
    const url = `${ENDPOINT.LIST}?top=${top || 50}`;
    return request(url, null).then((obj) => {
      if (!obj || obj.ResponseCode !== 1) {
        showError(obj);
        throw new Error(`GetList loi: ${obj && obj.ResponseCode}`);
      }
      return obj.List || [];
    });
  },

  /**
   * Cuop mot hong bao khung gio vang. Cuop duoc la tien vao vi ngay.
   *
   * KHONG tu bao loi ra popup: cac ma -1 (het roi) / -2 (da nhan) / -3
   * (chua toi gio) la ket qua BINH THUONG cua cuoc tranh nhau, man hinh mo
   * hong bao se hien thong diep hop canh hon la popup loi do.
   *
   * @param {number} campaignId 0 = de server tu chon dot dang mo
   * @returns {Promise<object>} nguyen response, goi y phai tu doc ResponseCode
   */
  grab(campaignId) {
    const url = `${ENDPOINT.GRAB}?campaignId=${campaignId || 0}`;
    return request(url, {});
  },

  /**
   * Mo mot hong bao da co chu (li xi thang, qua tang CSKH).
   * Cung khong tu bao loi — de man hinh mo hong bao xu ly.
   */
  open(envelopeId) {
    const url = `${ENDPOINT.OPEN}?id=${envelopeId}`;
    return request(url, {});
  },

  showError,
};

module.exports = LixiService;
