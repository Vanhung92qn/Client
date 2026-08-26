/**
 * QuestService — mot cua duy nhat de goi API Nhiem vu.
 *
 * Cung khuon voi LixiService: boc sendRequest thanh Promise LUON ket thuc.
 * Ly do phai tu dat han gio: cc.ServerConnector CHI goi callback khi HTTP
 * 200 — mat mang hay 500 thi callback khong bao gio chay, UI treo.
 *
 * KHONG co ham nao "bao da lam xong nhiem vu". Tien do do MAY CHU tu dem
 * qua ba diem moc (cuoc / nap / dang nhap); client chi doc va bam nhan.
 * Do la co y — de client tu khai bao thi ai cung tu cho minh thuong.
 */

'use strict';

const ENDPOINT = {
  SUMMARY: 'api/Quest/GetSummary',
  LIST: 'api/Quest/GetList',
  CLAIM: 'api/Quest/Claim',
};

/** Han gio tu bao ve (ms) — dai hon timeout 60s cua XHR mot chut. */
const REQUEST_TIMEOUT = 62000;

/**
 * Kenh bao "tien do vua doi".
 *
 * Khong co no thi badge o lobby phai cho toi nhip hoi ke tiep moi biet
 * nguoi choi vua nhan thuong — nut con nam do voi cham do trong khi khong
 * con gi de nhan. Bai hoc rut ra tu he Li xi.
 */
const bus = new cc.EventTarget();
const EVT_CHANGED = 'quest:changed';

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

function showError(obj) {
  const msg = (obj && obj.Message) || 'Có lỗi xảy ra, vui lòng thử lại.';
  const code = obj && obj.ResponseCode;
  cc.PopupController.getInstance().showMessageError(msg, code);
}

const QuestService = {
  ENDPOINT,
  bus,
  EVT_CHANGED,

  /** Bao cho moi cho dang hien so nhiem vu rang no vua doi. */
  notifyChanged() {
    bus.emit(EVT_CHANGED);
  },

  onChanged(cb, target) {
    bus.on(EVT_CHANGED, cb, target);
  },

  offChanged(cb, target) {
    bus.off(EVT_CHANGED, cb, target);
  },

  /**
   * Tom tat cho badge o lobby.
   *
   * KHONG bao loi ra popup khi that bai — badge im lang la duoc, khong the
   * dam popup vao mat nguoi choi moi phut mot lan vi mang chap chon.
   */
  getSummary() {
    return request(ENDPOINT.SUMMARY, null).then((obj) => {
      if (!obj || obj.ResponseCode !== 1) {
        throw new Error(`GetSummary loi: ${obj && obj.ResponseCode}`);
      }
      return obj;
    });
  },

  /** Danh sach nhiem vu kem tien do. */
  getList() {
    return request(ENDPOINT.LIST, null).then((obj) => {
      if (!obj || obj.ResponseCode !== 1) {
        showError(obj);
        throw new Error(`GetList loi: ${obj && obj.ResponseCode}`);
      }
      return obj.List || [];
    });
  },

  /**
   * Nhan thuong. Tra nguyen response de cho goi tu doc ResponseCode —
   * ma -1 (chua xong) va -2 (da nhan roi) la ket qua binh thuong, khong
   * dang bat popup loi.
   */
  claim(questId) {
    return request(`${ENDPOINT.CLAIM}?questId=${questId}`, {});
  },

  showError,
};

module.exports = QuestService;
