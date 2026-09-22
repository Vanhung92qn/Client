var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
var n = function() {
  function t() {}
  t.getInstance = function() {
    if (!(null !== this.Instance && void 0 !== this.Instance)) {
      this.Instance = new t();
      this.Instance.init();
    }
    return this.Instance;
  };
  t.prototype.init = function() {};
  t.prototype.indexA = function(t) {
    for (var e = 0; e < t.length; ++e) {
      if (14 === t[e].N) {
        return e;
      }
    }
    return 0;
  };
  t.prototype.sortVector = function(t) {
    t.sort(function(t, e) {
      return t.N > e.N ? 1 : t.N < e.N ? -1 : 0;
    });
  };
  t.prototype.sortVectorIndex = function(t) {
    t.sort(function(t, e) {
      return t.index > e.index ? 1 : t.index < e.index ? -1 : 0;
    });
  };
  t.prototype.sortVectorReverse = function(t, e) {
    t.sort(function(t, i) {
      if (t.N > i.N) {
        return 1;
      }
      if (t.N < i.N) {
        return -1;
      }
      if (e) {
        if (t.S > i.S) {
          return -1;
        }
        if (t.S < i.S) {
          return 1;
        }
      } else {
        if (t.S > i.S) {
          return 1;
        }
        if (t.S < i.S) {
          return -1;
        }
      }
      return 0;
    });
  };
  t.prototype.sortVector2 = function(t, e) {
    if (void 0 === e) {
      e = true;
    }
    t.sort(function(t, i) {
      if (t.S > i.S) {
        return 1;
      }
      if (t.S < i.S) {
        return -1;
      }
      if (e) {
        if (t.N > i.N) {
          return -1;
        }
        if (t.N < i.N) {
          return 1;
        }
      } else {
        if (t.N > i.N) {
          return 1;
        }
        if (t.N < i.N) {
          return -1;
        }
      }
      return 0;
    });
  };
  t.prototype.checkDoi = function(t) {
    var e = 0,
      i = t.slice();
    this.sortVector(i);
    for (var n = 0; n < i.length - 1; ++n) {
      if (i[n].N === i[n + 1].N) {
        e = 68 + i[n].N;
        break;
      }
    }
    return e;
  };
  t.prototype.checkThu = function(t) {
    var e = 0;
    if (t.length <= 3) {
      return 0;
    }
    var i = t.slice();
    this.sortVector(i);
    for (var n = 0, o = [], a = 0; a < i.length - 1; ++a) {
      for (var s = a + 1; s < i.length && i[a].N === i[s].N; ++s) {
        n++;
      }
      if (1 === n) {
        o.push(i[a]);
        o.push(i[a + 1]);
        a += 1;
      }
      n = 0;
    }
    if (4 === o.length) {
      e = 136 + o[3].N;
    }
    return e;
  };
  t.prototype.checkSam = function(t) {
    var e = 0,
      i = t.slice();
    this.sortVector(i);
    for (var n = 0, o = 0; o < i.length - 1; ++o) {
      for (var a = o + 1; a < i.length && i[o].N === i[a].N; ++a) {
        n++;
      }
      if (2 === n) {
        e = 204 + i[o].N;
        break;
      }
      n = 0;
    }
    return e;
  };
  t.prototype.checkSanh = function(t) {
    var e = 0;
    if (t.length < 5) {
      return 0;
    }
    var i = t.slice();
    this.sortVector(i);
    for (var n = 0, o = 0, a = 0, s = this.indexA(i) > 0, r = 0; r < i.length - 1; ++r) {
      var c = i[r + 1].N - i[r].N;
      if (c > 1 ? (n = 0, o = 0, a = i[r + 1].N) : 1 === c && (n++, o = i[r].N, r === i.length - 2 && (n++, o = i[r + 1].N)), s && (
          3 === n && 4 === o || 4 === n && 5 === o)) {
        return 277;
      }
      if (5 === n) {
        break;
      }
    }
    if (5 === n) {
      if (e = 272 + o, s && 2 === a) {
        return 277;
      }
      if (s && 10 === a) {
        return 286;
      }
    }
    return e;
  };
  t.prototype.checkThung = function(t) {
    if (t.length < 5) {
      return 0;
    }
    var e = t.slice();
    this.sortVector2(e);
    for (var i = 0, n = 0; n < e.length - 1; ++n) {
      for (var o = n + 1; o < e.length && e[n].S === e[o].S; ++o) {
        i++;
      }
      if (4 === i) {
        return 340 + e[0].N;
      }
      i = 0;
    }
    return 0;
  };
  t.prototype.checkCuLu = function(t) {
    if (t.length < 5) {
      return 0;
    }
    var e = t.slice();
    this.sortVector(e);
    for (var i = 0, n = -1, o = 0, a = 0; a < e.length - 1; ++a) {
      for (var s = a + 1; s < e.length && e[a].N === e[s].N; ++s) {
        i++;
      }
      if (2 === i) {
        n = a;
        i = 0;
        o = e[a].N;
        break;
      }
      i = 0;
    }
    if (-1 !== n) {
      e.splice(n, 3);
      for (a = 0; a < e.length - 1; ++a) {
        if (e[a].N === e[a + 1].N) {
          return 408 + o;
        }
      }
    }
    return 0;
  };
  t.prototype.checkTuQuy = function(t) {
    if (t.length < 4) {
      return 0;
    }
    var e = 0,
      i = t.slice();
    this.sortVector(i);
    for (var n = 0, o = 0; o < i.length - 1; ++o) {
      for (var a = o + 1; a < i.length && i[o].N === i[a].N; ++a) {
        n++;
      }
      if (3 === n) {
        o;
        n = 0;
        return 476 + i[o].N;
      }
      n = 0;
    }
    return e;
  };
  t.prototype.checkTPS = function(t) {
    if (t.length < 5) {
      return 0;
    }
    var e = t.slice();
    this.sortVector(e);
    return this.checkThung(t) > 0 && this.checkSanh(t) > 0 ? 544 + e[4].N : 0;
  };
  t.prototype.getMark = function(t) {
    var e = 0;
    return (e = this.checkTPS(t)) > 0 ? e : (e = this.checkTuQuy(t)) > 0 ? e : (e = this.checkCuLu(t)) > 0 ? e : (e = this.checkThung(
        t)) > 0 ? e : (e = this.checkSanh(t)) > 0 ? e : (e = this.checkSam(t)) > 0 ? e : (e = this.checkThu(t)) > 0 ? e : e = this
      .checkDoi(t);
  };
  t.prototype.soSanhMauThau = function(t, e) {
    this.sortVector(t);
    this.sortVector(e);
    for (var i = Math.min(t.length, e.length), n = 0; n < i; ++n) {
      var o = t[t.length - 1 - n].N,
        a = e[e.length - 1 - n].N;
      if (o > a) {
        return true;
      }
      if (o < a) {
        return false;
      }
    }
    return false;
  };
  t.prototype.getTextOfListCard = function(t) {
    return t > 544 ? "TPS\u1ea3nh" : t > 476 ? "T\u1ee9 Qu\xfd" : t > 408 ? "C\xf9 l\u0169" : t > 340 ? "Th\xf9ng" : t > 272 ?
      "S\u1ea3nh" : t > 204 ? "X\xe1m" : t > 136 ? "Th\xfa" : t > 68 ? "\u0110\xf4i" : "M\u1eadu Th\u1ea7u";
  };
  t.prototype.getTextofMauBinh = function(t) {
    return 10 === t ? "3 S\u1ea3nh" : 11 === t ? "3 Th\xf9ng" : 12 === t ? "6 \u0110\xf4i" : 13 === t ? "\u0110\u1ed3ng Hoa" : 14 ===
      t ? "S\u1ea3nh R\u1ed3ng" : 15 === t ? "S\u1ea3nh R\u1ed3ng\n\u0110\u1ed3ng Hoa" : 16 === t ? "5 \u0110\xf4i 1 X\xe1m" : "";
  };
  t.prototype.SapXepBaiTheoChi = function(t) {
    var e = this.getMark(t);
    if (e > 544) {
      this.sortVector_Sanh(t);
    } else {
      if (e > 476) {
        this.getTuQuyChi(t);
      } else {
        if (e > 408) {
          this.getCuLuChi(t);
        } else {
          if (e > 340) {
            this.sortVectorReverse(t, false);
          } else {
            if (e > 272) {
              this.sortVector_Sanh(t);
            } else {
              if (e > 204) {
                this.getXamChi(t);
              } else {
                if (e > 136) {
                  this.getThuChi(t);
                } else {
                  if (e > 68) {
                    this.getDoiChi(t);
                  } else {
                    if (0 == e) {
                      this.sortVectorReverse(t, false);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  t.prototype.sortVector_Sanh = function(t) {
    if (this.sortVectorReverse(t, false), 14 === t[t.length - 1].N && 2 === t[0].N) {
      var e = 0;
      t[t.length - 1].index = e;
      e++;
      for (var i = 0; i < t.length - 1; i++) {
        t[i].index = e;
        e++;
      }
      this.sortVectorIndex(t);
    }
  };
  t.prototype.getTuQuyChi = function(t) {
    this.sortVectorReverse(t, false);
    var e = 0;
    if (t[0].N !== t[1].N) {
      for (var i = 1; i < t.length; i++) {
        t[i].index = e;
        e++;
      }
      t[0].index = e;
      this.sortVectorIndex(t);
    }
  };
  t.prototype.getCuLuChi = function(t) {
    this.getXamChi(t);
  };
  t.prototype.getXamChi = function(t) {
    this.sortVectorReverse(t, false);
    for (var e = -1, i = 0, n = 0; n < t.length - 2; ++n) {
      var o = t[n],
        a = t[n + 1],
        s = t[n + 2];
      if (o.N === a.N && a.N === s.N) {
        e = n;
        break;
      }
    }
    if (-1 !== e) {
      for (n = e; n < e + 3; ++n) {
        t[n].index = i;
        i++;
      }
      for (n = 0; n < e; ++n) {
        t[n].index = i;
        i++;
      }
      for (n = e + 3; n < t.length; ++n) {
        t[n].index = i;
        i++;
      }
      this.sortVectorIndex(t);
    }
  };
  t.prototype.getThuChi = function(t) {
    this.sortVectorReverse(t, false);
    for (var e = -1, i = 0, n = 0; n < t.length - 1; ++n) {
      var o = t[n],
        a = t[n + 1];
      if (o.N === a.N) {
        o.index = i;
        i++;
        a.index = i;
        i++;
        n += 1;
      } else {
        e = n;
      }
    }
    if (-1 !== e) {
      t[e].index = i;
      i++;
    }
    this.sortVectorIndex(t);
  };
  t.prototype.getDoiChi = function(t) {
    this.sortVectorReverse(t, false);
    for (var e = -1, i = 0, n = 0; n < t.length - 1; ++n) {
      var o = t[n],
        a = t[n + 1];
      if (o.N === a.N) {
        o.index = i;
        i++;
        a.index = i;
        i++;
        e = n;
        break;
      }
    }
    for (n = 0; n < e; ++n) {
      t[n].index = i;
      i++;
    }
    for (n = e + 2; n < t.length; ++n) {
      t[n].index = i;
      i++;
    }
    this.sortVectorIndex(t);
  };
  t.prototype.getMarkMauBinh = function(t, e, i, n) {
    this.listSort(t);
    if (15 === this.checkSanhRongDongHoa(t)) {
      return 15;
    }
    if (14 === this.checkMauBinhSanhRong(t)) {
      return 14;
    }
    if (13 === this.checkMauBinhDongHoa(t)) {
      return 13;
    }
    var o = this.checkMauBinh6Doi(t);
    return 16 === o ? 16 : 12 === o ? 12 : 11 === this.checkMauBinh3Thung(e, i, n) ? 11 : 10 === this.checkMauBinh3Sanh(e, i, n) ? 10 :
      0;
  };
  t.prototype.listSort = function(t) {
    t.sort(function(t, e) {
      return t > e ? 1 : t < e ? -1 : 0;
    });
  };
  t.prototype.listSodu = function(t) {
    for (var e = [], i = 0; i < t.length; i++) {
      var n = Math.floor(t[i] / 4) + 1;
      if (0 === n) {
        n = 13;
      }
      e.push(n);
    }
    this.listSort(e);
    return e;
  };
  t.prototype.checkSanhRongDongHoa = function(t) {
    return -1;
  };
  t.prototype.checkMauBinhSanhRong = function(t) {
    if (t.length < 13) {
      return -1;
    }
    for (var e = this.listSodu(t), i = 0; i < e.length; i++) {
      if (e[i] !== i + 1) {
        return -1;
      }
    }
    return 14;
  };
  t.prototype.checkMauBinhDongHoa = function(t) {
    if (t.length < 13) {
      return -1;
    }
    for (var e = t[0] % 4, i = 0 === e || 1 === e, n = 1; n < t.length; ++n) {
      var o = t[n] % 4;
      if (i !== (0 === o || 1 === o)) {
        return -1;
      }
    }
    return 13;
  };
  t.prototype.checkMauBinh6Doi = function(t) {
    if (t.length < 13) {
      return -1;
    }
    for (var e = 0, i = 0, n = 0, o = 0; o < 12; ++o) {
      for (var a = Math.floor(t[o] / 4) + 1, s = o + 1; s < 13; ++s) {
        if (a !== Math.floor(t[s] / 4) + 1) {
          break;
        }
        n++;
      }
      if (n >= 1 && n <= 2) {
        e += 1;
        if (n > 1) {
          i += 1;
        }
        o += n;
        n = 0;
      } else {
        if (n > 2) {
          e += 2;
          o += n;
          n = 0;
        }
      }
    }
    return e >= 6 ? i > 0 ? 16 : 12 : -1;
  };
  t.prototype.checkMauBinh3Sanh = function(t, e, i) {
    return this.checkSanh(e) <= 0 || this.checkSanh(i) <= 0 ? -1 : 3 !== t.length ? -1 : (this.sortVector(t), 12 === t[0].N && 13 === t[
        1].N && 14 === t[2].N ? 10 : 2 === t[0].N && 3 === t[1].N && 14 === t[2].N ? 10 : t[0].N + 1 === t[1].N && t[1].N + 1 === t[2]
      .N ? 10 : -1);
  };
  t.prototype.checkMauBinh3Thung = function(t, e, i) {
    return this.checkThung(e) <= 0 || this.checkThung(i) <= 0 ? -1 : 3 !== t.length ? -1 : t[0].S === t[1].S && t[0].S === t[2].S ? 11 :
      -1;
  };
  t.prototype.sapXep = function(t) {
    if (13 !== t.length) {
      return this.getCardNumBer(t);
    }
    var e = t.slice();
    this.sortVector(e);
    var i = t.slice();
    this.sortVector2(i);
    for (var n = [0, 0, 0, 0], o = 0; o < i.length; ++o) {
      var a = i[o];
      if (a.S > 4 || a.S < 1) {
        return [];
      }
      n[a.S - 1]++;
    }
    return this.getCardNumBer(i);
  };
  t.prototype.getCardNumBer = function(t) {
    for (var e = [], i = 0; i < t.length; ++i) {
      e.push(t[i].serverCode);
    }
    return e;
  };
  t.prototype.SapBaiWithThung = function(t) {
    var e = t.slice();
    this.sortVector2(e);
    for (var i = [0, 0, 0, 0], n = 0; n < e.length; ++n) {
      var o = e[n];
      if (o.S > 4 || o.S < 1) {
        return [];
      }
      i[o.S - 1]++;
    }
    for (n = 0; n < i.length; ++n) {
      if (i[n] >= 5) {
        ;
      } else {
        i[n];
      }
    }
  };
  t.prototype.getTPS = function(t) {};
  t.Instance = null;
  return t;
}();
i.default = n;
void 0;
