var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
var LocalizeManager = require("./LocalizeManager"),
  StringUtil = require("./StringUtil"),
  FgIDConfigManager = require("./FgIDConfigManager"),
  GamePlayManager = require("./GamePlayManager"),
  r = "Kh\xf4ng th\u1ec3 k\u1ebft n\u1ed1i \u0111\u1ebfn m\xe1y ch\u1ee7, xin h\xe3y th\u1eed l\u1ea1i.",
  c = "K\u1ebft n\u1ed1i \u0111\u1ebfn m\xe1y ch\u1ee7 th\u1ea5t b\u1ea1i!",
  l = function() {
    function t() {}
    t.getInstance = function() {
      if (!(null !== this.Instance && void 0 !== this.Instance)) {
        this.Instance = new t();
      }
      return this.Instance;
    };
    t.prototype.sendGetHttpRequest = function(t, e, i, n) {
      if (void 0 === n) {
        n = false;
      }
      var l = new XMLHttpRequest();
      l.onreadystatechange = function() {
        if (4 == l.readyState) {
          if (l.status >= 200 && l.status < 400) {
            var t = l.responseText,
              n = null;
            try {
              n = JSON.parse(t);
            } catch (t) {}
            e(n);
          } else {
            i(r);
          }
        }
      };
      l.onerror = function() {
        var t = r;
        if (!StringUtil.default.isNullOrEmpty(l.responseText)) {
          var e = null;
          try {
            e = JSON.parse(l.responseText);
          } catch (t) {}
          if (!(null === e || void 0 === e || StringUtil.default.isNullOrEmpty(e.msg))) {
            t = e.msg;
          }
        }
        i(t);
      };
      l.ontimeout = function() {
        i(c);
      };
      l.timeout = 3e4;
      l.open("GET", t, true);
      if (n) {
        if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().session_id)) {
          l.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
          l.setRequestHeader("Content-Type", "application/json");
        }
      }
      FgIDConfigManager.FgIDConfigManager.checkAddFgIDToHeader(l, t);
      l.send();
    };
    t.prototype.sendGetHttpRequestWithMap = function(t, e, i, n, l) {
      if (void 0 === l) {
        l = false;
      }
      var h = new XMLHttpRequest();
      h.onreadystatechange = function() {
        if (4 == h.readyState) {
          if (h.status >= 200 && h.status < 400) {
            var t = h.responseText,
              n = null;
            try {
              n = JSON.parse(t);
            } catch (t) {}
            e(n);
          } else {
            i(r);
          }
        }
      };
      h.onerror = function() {
        var t = r;
        if (!StringUtil.default.isNullOrEmpty(h.responseText)) {
          var e = null;
          try {
            e = JSON.parse(h.responseText);
          } catch (t) {}
          if (!(null === e || void 0 === e || StringUtil.default.isNullOrEmpty(e.msg))) {
            t = e.msg;
          }
        }
        i(t);
      };
      h.ontimeout = function() {
        i(c);
      };
      h.timeout = 3e4;
      h.open("GET", t, true);
      if (l) {
        if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().session_id)) {
          h.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
          h.setRequestHeader("Content-Type", "application/json");
        }
      }
      if (n) {
        n.forEach(function(t, e) {
          h.setRequestHeader(e, t);
        });
      }
      FgIDConfigManager.FgIDConfigManager.checkAddFgIDToHeader(h, t);
      h.send();
    };
    t.prototype.sendGetHttpRequestNoJson = function(t, e, i) {
      var n = new XMLHttpRequest();
      n.onreadystatechange = function() {
        if (4 == n.readyState) {
          if (n.status >= 200 && n.status < 400) {
            var t = n.responseText;
            e(t);
          } else {
            i(r);
          }
        }
      };
      n.onerror = function() {
        var t = r;
        if (!StringUtil.default.isNullOrEmpty(n.responseText)) {
          var e = null;
          try {
            e = JSON.parse(n.responseText);
          } catch (t) {}
          if (!(null === e || void 0 === e || StringUtil.default.isNullOrEmpty(e.msg))) {
            t = e.msg;
          }
        }
        i(t);
      };
      n.ontimeout = function() {
        i(c);
      };
      n.timeout = 3e4;
      n.open("GET", t, true);
      FgIDConfigManager.FgIDConfigManager.checkAddFgIDToHeader(n, t);
      n.send();
    };
    t.prototype.sendGetHttpRequestWithToken = function(t, e, i) {
      var n = new XMLHttpRequest();
      n.onreadystatechange = function() {
        if (4 == n.readyState) {
          if (n.status >= 200 && n.status < 400) {
            var t = n.responseText;
            e(JSON.parse(t));
          } else {
            i(r);
          }
        }
      };
      n.onerror = function() {
        var t = r;
        if (!StringUtil.default.isNullOrEmpty(n.responseText)) {
          var e = null;
          try {
            e = JSON.parse(n.responseText);
          } catch (t) {}
          if (!(null === e || void 0 === e || StringUtil.default.isNullOrEmpty(e.msg))) {
            t = e.msg;
          }
        }
        i(t);
      };
      n.ontimeout = function() {
        i(c);
      };
      n.timeout = 3e4;
      n.open("GET", t, true);
      n.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
      FgIDConfigManager.FgIDConfigManager.checkAddFgIDToHeader(n, t);
      n.send();
      return n;
    };
    t.prototype.sendPostHttpRequest = function(e, i, n, o, a, s, r) {
      if (void 0 === a) {
        a = true;
      }
      if (void 0 === s) {
        s = false;
      }
      if (void 0 === r) {
        r = 0;
      }
      t.getInstance().sendPostHttpRequestBase(cc.loader.getXMLHttpRequest(), e, i, n, o, a, s, r);
    };
    t.prototype.sendPostHttpRequestUseFb = function(e, i, n, o, a, s, r) {
      if (void 0 === a) {
        a = true;
      }
      if (void 0 === s) {
        s = false;
      }
      if (void 0 === r) {
        r = 0;
      }
      t.getInstance().sendPostHttpRequestBase(fb2.getXMLHttpRequest(), e, i, n, o, a, s, r);
    };
    t.prototype.sendPostHttpRequestBase = function(t, e, i, n, l, h, u, d) {
      if (void 0 === h) {
        h = true;
      }
      if (void 0 === u) {
        u = false;
      }
      if (void 0 === d) {
        d = 0;
      }
      t.onreadystatechange = function() {
        if (4 == t.readyState) {
          if (t.status >= 200 && t.status < 400) {
            var e = t.responseText,
              i = null;
            try {
              i = JSON.parse(e);
            } catch (t) {}
            if (i) {
              n(i);
            }
          } else {
            var a = r;
            if (!StringUtil.default.isNullOrEmpty(t.responseText)) {
              try {
                var s = JSON.parse(t.responseText);
                if (null === s || void 0 === s || StringUtil.default.isNullOrEmpty(s.msg)) {
                  if (!(null === s || void 0 === s || StringUtil.default.isNullOrEmpty(s.message))) {
                    a = s.message;
                  }
                } else {
                  a = s.msg;
                }
              } catch (e) {
                if (true === u && 400 === t.status) {
                  a = t.responseText;
                }
              }
            }
            l(a);
          }
        }
      };
      t.onerror = function() {
        var e = r;
        if (!StringUtil.default.isNullOrEmpty(t.responseText)) {
          var i = null;
          try {
            i = JSON.parse(t.responseText);
          } catch (t) {}
          if (!(null === i || void 0 === i || StringUtil.default.isNullOrEmpty(i.msg))) {
            e = i.msg;
          }
        }
        l(e);
      };
      t.ontimeout = function() {
        l(c);
      };
      t.timeout = d > 0 ? d : 3e4;
      t.open("POST", e, true);
      if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().session_id)) {
        if (true === h) {
          t.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
        }
        t.setRequestHeader("Content-Type", "application/json");
      }
      FgIDConfigManager.FgIDConfigManager.checkAddFgIDToHeader(t, e);
      t.send(i);
    };
    t.prototype.sendPostHttpRequestWithMap = function(t, e, i, n, a, l, h, u) {
      if (void 0 === l) {
        l = true;
      }
      if (void 0 === h) {
        h = false;
      }
      if (void 0 === u) {
        u = 0;
      }
      var d = cc.loader.getXMLHttpRequest();
      d.onreadystatechange = function() {
        if (4 == d.readyState) {
          if (d.status >= 200 && d.status < 400) {
            var t = d.responseText,
              e = null;
            try {
              e = JSON.parse(t);
            } catch (t) {}
            if (e) {
              i(e);
            }
          } else {
            var a = r;
            if (!StringUtil.default.isNullOrEmpty(d.responseText)) {
              try {
                var s = JSON.parse(d.responseText);
                if (null === s || void 0 === s || StringUtil.default.isNullOrEmpty(s.msg)) {
                  if (!(null === s || void 0 === s || StringUtil.default.isNullOrEmpty(s.message))) {
                    a = s.message;
                  }
                } else {
                  a = s.msg;
                }
              } catch (t) {
                if (true === h && 400 === d.status) {
                  a = d.responseText;
                }
              }
            }
            n(a);
          }
        }
      };
      d.onerror = function() {
        var t = r;
        if (!StringUtil.default.isNullOrEmpty(d.responseText)) {
          var e = null;
          try {
            e = JSON.parse(d.responseText);
          } catch (t) {}
          if (!(null === e || void 0 === e || StringUtil.default.isNullOrEmpty(e.msg))) {
            t = e.msg;
          }
        }
        n(t);
      };
      d.ontimeout = function() {
        n(c);
      };
      d.timeout = u > 0 ? u : 3e4;
      d.open("POST", t, true);
      if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().session_id)) {
        if (true === l) {
          d.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
        }
        d.setRequestHeader("Content-Type", "application/json");
      }
      if (a) {
        a.forEach(function(t, e) {
          d.setRequestHeader(e, t);
        });
      }
      d.send(e);
    };
    t.prototype.onXHRBinaryReady = function(t, e, i) {
      if (4 == t.readyState && t.status >= 200 && t.status < 400) {
        var n = t.response;
        if (e) {
          e(n);
        }
      }
    };
    t.prototype.onXHRReady = function(t, e, i) {
      if (4 == t.readyState) {
        if (t.status >= 200 && t.status < 400) {
          var n = t.responseText,
            a = null;
          try {
            a = JSON.parse(n);
          } catch (e) {
            return void(i && i({
              code: t.status,
              msg: t.responseText
            }));
          }
          if (e) {
            e(a);
          }
        } else {
          try {
            if (StringUtil.default.isNullOrEmpty(t.responseText)) {
              if (i) {
                i({
                  code: t.status,
                  msg: r
                });
              }
            } else {
              a = null;
              a = JSON.parse(t.responseText);
              if (i) {
                i(a);
              }
            }
          } catch (e) {
            if (i) {
              i({
                code: t.status,
                msg: e
              });
            }
          }
        }
      }
    };
    t.prototype.onXHRError = function(t, e, i) {
      try {
        StringUtil.default.isNullOrEmpty(t.responseText);
      } catch (e) {
        return void(i && i({
          code: t.status,
          msg: e
        }));
      }
      var n = null;
      try {
        n = JSON.parse(t.responseText);
      } catch (e) {
        return void(i && i({
          code: t.status,
          msg: r
        }));
      }
      i(n);
    };
    t.prototype.getHTTPBinary = function(t, e, i, n) {
      if (void 0 === n) {
        n = false;
      }
      var a = new XMLHttpRequest(),
        r = this;
      a.responseType = "arraybuffer";
      a.onreadystatechange = function() {
        r.onXHRBinaryReady(a, e, i);
      };
      a.onerror = function(t) {
        r.onXHRError(a, e, i);
      };
      a.ontimeout = function() {
        if (i) {
          i({
            code: a.status,
            msg: c
          });
        }
      };
      a.timeout = 3e4;
      a.open("GET", t, true);
      if (n) {
        if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().session_id)) {
          a.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
        }
      }
      a.send();
    };
    t.prototype.getHTTP = function(t, e, i, n) {
      if (void 0 === n) {
        n = false;
      }
      var r = new XMLHttpRequest(),
        l = this;
      r.onreadystatechange = function() {
        l.onXHRReady(r, e, i);
      };
      r.onerror = function() {
        l.onXHRError(r, e, i);
      };
      r.ontimeout = function() {
        if (i) {
          i({
            code: r.status,
            msg: c
          });
        }
      };
      r.open("GET", t, true);
      if (n) {
        if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().session_id)) {
          r.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
          r.setRequestHeader("Content-Type", "application/json");
        }
      }
      FgIDConfigManager.FgIDConfigManager.checkAddFgIDToHeader(r, t);
      r.send();
    };
    t.prototype.postHTTP = function(t, e, i, n, r) {
      if (void 0 === r) {
        r = true;
      }
      var l = this,
        h = new XMLHttpRequest();
      h.onreadystatechange = function() {
        l.onXHRReady(h, i, n);
      };
      h.onerror = function() {
        l.onXHRError(h, i, n);
      };
      h.ontimeout = function() {
        if (n) {
          n({
            code: h.status,
            msg: c
          });
        }
      };
      h.timeout = 3e4;
      h.open("POST", t, true);
      if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().session_id)) {
        if (true === r) {
          h.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
        }
        h.setRequestHeader("Content-Type", "application/json");
      }
      FgIDConfigManager.FgIDConfigManager.checkAddFgIDToHeader(h, t);
      h.send(e);
    };
    t.prototype.getRawHTTP = function(t, e, i, a) {
      if (void 0 === a) {
        a = false;
      }
      var r = new XMLHttpRequest(),
        c = this;
      r.onreadystatechange = function() {
        c.onRawXHRReady(r, e, i);
      };
      r.onerror = function() {
        c.onXHRError(r, e, i);
      };
      r.ontimeout = function() {
        i({
          code: r.status,
          msg: LocalizeManager.default.getInstance().GetString("ConnectToServerFail")
        });
      };
      r.open("GET", t, true);
      if (a) {
        if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().session_id)) {
          r.setRequestHeader("X-TOKEN", GamePlayManager.default.getInstance().session_id);
          r.setRequestHeader("Content-Type", "application/json");
        }
      }
      r.send();
    };
    t.prototype.onRawXHRReady = function(t, e, i) {
      if (4 == t.readyState) {
        if (200 == t.status) {
          e(t.responseText);
        } else {
          try {
            if (StringUtil.default.isNullOrEmpty(t.responseText)) {
              i({
                code: t.status,
                msg: LocalizeManager.default.getInstance().GetString("NetworkUnstablePleaseTryAgain")
              });
            } else {
              i({
                code: t.status,
                msg: t.responseText
              });
            }
          } catch (e) {
            i({
              code: t.status,
              msg: e
            });
          }
        }
      }
    };
    t.Instance = null;
    return t;
  }();
i.default = l;
void 0;
