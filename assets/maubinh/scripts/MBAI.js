var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
var n = require("MauBinhCheckCard"),
  o = function() {
    function t() {}
    t.getInstance = function() {
      if (!(null !== this.Instance && void 0 !== this.Instance)) {
        this.Instance = new t();
        this.Instance.init();
      }
      return this.Instance;
    };
    t.prototype.init = function() {};
    t.prototype.sortSanhTangDan = function(t) {
      t.sort(function(t, e) {
        return t.N > e.N ? 1 : t.N < e.N ? -1 : 0;
      });
    };
    t.prototype.sortSanhGiamDan = function(t) {
      t.sort(function(t, e) {
        return t.N > e.N ? -1 : t.N < e.N ? 1 : 0;
      });
    };
    t.prototype.sortThungGiamDan = function(t) {
      t.sort(function(t, e) {
        return t.S > e.S ? 1 : t.S < e.S ? -1 : t.N > e.N ? -1 : t.N < e.N ? 1 : 0;
      });
    };
    t.prototype.sortThungTangDan = function(t) {
      t.sort(function(t, e) {
        return t.S > e.S ? 1 : t.S < e.S ? -1 : t.N > e.N ? 1 : t.N < e.N ? -1 : 0;
      });
    };
    t.prototype.sapXep = function(t) {
      if (13 !== t.length) {
        return [];
      }
      for (var e = [], i = 0; i < t.length; ++i) {
        e.push(t[i].getData());
      }
      var n = this.sapXep2(e);
      if (n.mark3 > 544 || n.mark3 > 476) {
        return n.list;
      }
      if (n.mb > 0) {
        return n.list;
      }
      if (n.mark3 > 408 || n.mark3 > 340) {
        var o = [];
        for (i = 0; i < t.length; ++i) {
          o.push(t[i].getData());
        }
        var a = -1;
        if (n.mark3 > 408) {
          a = 1;
        } else {
          if (n.mark3 > 340) {
            a = 2;
          }
        }
        var s = this.sapXep2(o, a);
        if (s.p > n.p) {
          return s.list;
        }
        if (s.mb > 0) {
          return s.list;
        }
      }
      return n.list;
    };
    t.prototype.sapXep3 = function(t) {
      var e = this.sapXep2(t);
      return e.mark3 > 544 || e.mark3 > 476 ? e : (e.mb, e);
    };
    t.prototype.sapXep2 = function(t, e) {
      if (void 0 === e) {
        e = -1;
      }
      var i,
        o = [],
        a = [];
      o = this.getchi(t, e);
      a = this.getchi(t);
      i = t;
      this.checkAndMoveTuQuy(o, i);
      this.checkAndMoveTuQuy(a, i);
      var s = n.default.getInstance().getMark(o),
        r = n.default.getInstance().getMark(a),
        c = n.default.getInstance().getMark(i);
      if (r > s || s === r && n.default.getInstance().soSanhMauThau(a, o)) {
        var l = o;
        o = a;
        a = l;
        var h = s;
        s = r;
        r = h;
      }
      for (var u = [], d = [], p = 0; p < i.length; ++p) {
        d.push(i[p]);
        u.push(i[p].serverCode);
      }
      for (p = 0; p < a.length; ++p) {
        d.push(a[p]);
        u.push(a[p].serverCode);
      }
      for (p = 0; p < o.length; ++p) {
        d.push(o[p]);
        u.push(o[p].serverCode);
      }
      return {
        list: d,
        p: s + r + c,
        mark3: s,
        mark2: r,
        mark1: c,
        mb: n.default.getInstance().getMarkMauBinh(u, i, a, o)
      };
    };
    t.prototype.checkAndMoveTuQuy = function(t, e) {
      if (4 === t.length && e.length > 3) {
        var i = this.getComBo(e, 3);
        if (i.length > 0) {
          t.push(e[0]);
          e.splice(0, 1);
          e.push(i[0]);
          e.push(i[1]);
          e.push(i[2]);
        } else {
          if ((i = this.getComBo(e, 2)).length > 0) {
            t.push(e[0]);
            e.splice(0, 1);
            e.push(i[0]);
            e.push(i[1]);
          } else {
            t.push(e[0]);
            e.splice(0, 1);
          }
        }
      }
    };
    t.prototype.getchi = function(t, e) {
      if (void 0 === e) {
        e = -1;
      }
      var i = [],
        n = this.getThungPS(t);
      if (n.length > 0) {
        return n;
      }
      if ((n = this.getComBo(t, 4)).length > 0) {
        return n;
      }
      if (1 !== e) {
        var o = this.getComBo(t, 3);
        if (o.length > 0) {
          var a = this.getComBo(t, 2);
          if (a.length > 0) {
            for (var s = 0; s < a.length; ++s) {
              o.push(a[s]);
            }
          }
          if (5 === o.length) {
            return o;
          }
          for (s = 0; s < o.length; ++s) {
            t.push(o[s]);
          }
        }
      }
      if (2 !== e && (n = this.getThung(t)).length > 0) {
        return n;
      }
      if ((n = this.getSanh(t)).length > 0) {
        return n;
      }
      var r = this.getComBo(t, 3);
      if (r.length > 0) {
        this.sortSanhTangDan(t);
        for (s = 0; s < 2; ++s) {
          r.push(t[s]);
        }
        t.splice(0, 2);
        return r;
      }
      var c = this.getComBo(t, 2, true);
      if (c.length > 0) {
        var l = this.getComBo(t, 2);
        if (l.length > 0) {
          for (s = 0; s < l.length; ++s) {
            c.push(l[s]);
          }
        } else {
          this.sortSanhTangDan(t);
          for (s = 0; s < 3; ++s) {
            c.push(t[s]);
          }
          t.splice(0, 3);
        }
        return c;
      }
      this.sortSanhTangDan(t);
      for (s = 0; s < 4; ++s) {
        i.push(t[s]);
      }
      t.splice(0, 4);
      i.push(t[t.length - 1]);
      t.splice(t.length - 1, 1);
      return i;
    };
    t.prototype.getThungPS = function(t) {
      this.sortThungGiamDan(t);
      for (var e = [0, 0, 0, 0], i = 0; i < t.length; ++i) {
        var n = t[i];
        if (n.S > 4 || n.S < 1) {
          return [];
        }
        e[n.S - 1]++;
      }
      var o = 0;
      for (i = 0; i < e.length; ++i) {
        if (e[i] >= 5) {
          for (var a = 0, s = t[o].N, r = o; r < o + e[i] - 1; ++r) {
            if (1 === Math.abs(t[r + 1].N - t[r].N) ? a++ : (a = 0, s = t[r + 1].N), a >= 4) {
              for (var c = [], l = 0; l < 5; ++l) {
                c.push(t[r + 1 - 4 + l]);
              }
              t.splice(r + 1 - 4, 5);
              return c;
            }
            if (3 === a && 5 === s && 14 === t[o].N) {
              for (c = [], l = 0; l < 4; ++l) {
                c.push(t[r + 1 - 3 + l]);
              }
              t.splice(r + 1 - 3, 4);
              c.push(t[o]);
              t.splice(o, 1);
              return c;
            }
          }
        }
        o += e[i];
      }
      return [];
    };
    t.prototype.getThung = function(t) {
      this.sortThungGiamDan(t);
      for (var e = [0, 0, 0, 0], i = 0; i < t.length; ++i) {
        var n = t[i];
        if (n.S > 4 || n.S < 1) {
          return [];
        }
        e[n.S - 1]++;
      }
      var o = 0;
      for (i = 0; i < e.length; ++i) {
        if (e[i] >= 5) {
          for (var a = [], s = o; s < o + 5; ++s) {
            a.push(t[s]);
          }
          t.splice(o, 5);
          return a;
        }
        o += e[i];
      }
      return [];
    };
    t.prototype.getComBo = function(t, e, i) {
      if (void 0 === i && (i = false), t.length < e) {
        return [];
      }
      if (e > 2 || i) {
        this.sortSanhGiamDan(t);
      } else {
        this.sortSanhTangDan(t);
      }
      for (var n = 0, o = 0; o < t.length - 1; ++o) {
        for (var a = o + 1; a < t.length && t[o].N === t[a].N; ++a) {
          n++;
        }
        if (n === e - 1) {
          var s = [];
          for (a = o; a < o + e; ++a) {
            s.push(t[a]);
          }
          t.splice(o, e);
          return s;
        }
        n = 0;
      }
      return [];
    };
    t.prototype.getSanh = function(t) {
      this.sortSanhGiamDan(t);
      for (var e, i, n = 0, o = this.getXiIndex(t), a = 0; a < t.length - 1; ++a) {
        var s = t[a];
        e = s.N;
        i = s.N;
        n = 0;
        for (var r = a + 1; r < t.length; ++r) {
          var c = t[r],
            l = Math.abs(c.N - e);
          if (1 === l && (n++, e = c.N), l > 1) {
            break;
          }
          if (4 === n) {
            (d = []).push(s);
            t.splice(a, 1);
            e = s.N;
            for (var h = a; h < t.length; ++h) {
              var u = t[h];
              if (1 === Math.abs(u.N - e) && (d.push(u), e = u.N, t.splice(h, 1), h -= 1, 0 === --n)) {
                return d;
              }
            }
          } else if (o >= 0 && 3 === n && 5 === i) {
            var d;
            (d = []).push(s);
            t.splice(a, 1);
            e = s.N;
            for (h = a; h < t.length; ++h) {
              u = t[h];
              if (1 === Math.abs(u.N - e) && (d.push(u), e = u.N, t.splice(h, 1), h -= 1, 0 === --n)) {
                o = this.getXiIndex(t);
                d.push(t[o]);
                t.splice(o, 1);
                return d;
              }
            }
          }
        }
      }
      return [];
    };
    t.prototype.getXiIndex = function(t) {
      for (var e = 0; e < t.length; ++e) {
        if (14 === t[e].N) {
          return e;
        }
      }
      return -1;
    };
    t.Instance = null;
    return t;
  }();
i.default = o;
void 0;
