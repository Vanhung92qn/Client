var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
var n = require("./TLMNRemakeCardLib"),
  o = require("./TLMNRemakeCardsTypeHelper");

function a(t) {
  n.sortVector(t, true);
  for (var e = [], i = 0, o = 0, a = 0; a < t.length; a++) {
    if (i == t[a].N) {
      if (++o < 3) {
        e.push(t[a]);
      }
    } else {
      o = 1;
      i = t[a].N;
      e.push(t[a]);
    }
  }
  n.sortVector(t, false);
  n.sortVector(e, false);
  return e;
}

function s(t) {
  n.sortVector(t, true);
  for (var e = [], i = 0, o = 0, a = 0; a < t.length; a++) {
    if (i == t[a].N) {
      if (++o < 2) {
        e.push(t[a]);
      }
    } else {
      o = 1;
      i = t[a].N;
      e.push(t[a]);
    }
  }
  n.sortVector(t, false);
  return e;
}
i.loaiboxamvatuquy = a;
i.loaiboxamdoivatuquy = s;
i.getHigherStraight = function(t, e, i) {
  if (void 0 === i) {
    i = false;
  }
  for (var n = 0; n < t.length; n++) {
    t[n].N;
  }
  for (n = 0; n < e.length; n++) {
    e[n].N;
  }
  var a = s(e),
    r = [];
  if (a.length < t.length) {
    return r;
  }
  for (n = 0; n < a.length - 1; n++) {
    if (!(a[n].N < t[0].N || a[n].N == t[0].N && i)) {
      if (a.length - n < t.length) {
        break;
      }
      for (var c = 0; c < t.length; c++) {
        var l = c;
        if (c > 0) {
          for (; n + l < a.length - 1 && r[c - 1].N == a[n + l].N;) {
            l++;
          }
        }
        if (c < t.length - 1) {
          r.push(a[n + l]);
        } else if (a[n + l].N == t[c].N && a[n + l].S < t[c].S) {
          for (var h = l; n + h < a.length - 1 && t[c].N == a[n + h].N && a[n + h].S < t[c].S;) {
            h++;
          }
          if (h > l) {
            h--;
          }
          r.push(a[n + h]);
        } else {
          r.push(a[n + l]);
        }
      }
      if (r.length == t.length && (i ? o.isStraight_Sam(r) : o.isStraight(r))) {
        if (r[0].N != t[0].N) {
          return r;
        }
        if (r[t.length - 1].S > t[t.length - 1].S) {
          return r;
        }
        r = [];
      } else {
        r = [];
      }
    }
  }
  return r;
};
i.getHigherPairs = function(t, e, i) {
  if (void 0 === i) {
    i = false;
  }
  var o = [];
  if (e.length < 2) {
    return o;
  }
  n.sortVector(e, false);
  for (var a = 0; a < e.length - 1; a++) {
    if (!(e[a].N < t[0].N || e[a].N == t[0].N && i || e[a].N != e[a + 1].N)) {
      if (e[a].N != t[0].N) {
        o.push(e[a]);
        o.push(e[a + 1]);
        return o;
      }
      if (e[a + 1].S > t[1].S) {
        o.push(e[a]);
        o.push(e[a + 1]);
        return o;
      }
    }
  }
  return o;
};
i.getHigherThrees = function(t, e, i) {
  if (void 0 === i) {
    i = false;
  }
  var o = [];
  if (e.length < 3) {
    return o;
  }
  n.sortVector(e, false);
  for (var a = 0; a < e.length - 2; a++) {
    if (!(e[a].N < t[0].N || e[a].N == t[0].N && i || e[a].N != e[a + 1].N || e[a + 1].N != e[a + 2].N)) {
      if (e[a].N != t[0].N) {
        o.push(e[a]);
        o.push(e[a + 1]);
        o.push(e[a + 2]);
        return o;
      }
      if (e[a + 2].S > t[a].S) {
        o.push(e[a]);
        o.push(e[a + 1]);
        o.push(e[a + 2]);
        return o;
      }
    }
  }
  return o;
};
i.getHigherFours = function(t, e) {
  var i = [];
  if (e.length < 4) {
    return i;
  }
  n.sortVector(e, false);
  for (var o = 0; o < e.length - 3; o++) {
    if (!(e[o].N < t) && e[o].N == e[o + 1].N && e[o + 1].N == e[o + 2].N && e[o + 2].N == e[o + 3].N) {
      i.push(e[o]);
      i.push(e[o + 1]);
      i.push(e[o + 2]);
      i.push(e[o + 3]);
      return i;
    }
  }
  return i;
};
i.getHigherThreePairs = function(t, e, i) {
  if (void 0 === i) {
    i = false;
  }
  n.sortVector(e, false);
  var o = a(e),
    s = [];
  if (o.length < 6) {
    return s;
  }
  for (var r = 0; r < o.length - 5; r++) {
    if (!(o[r].N < t.N - 2 || o[r].N == t.N - 2 && i || o[r].N != o[r + 1].N || o[r].N != o[r + 2].N - 1 || o[r].N != o[r + 3].N - 1 || o[
        r].N != o[r + 4].N - 2 || o[r].N != o[r + 5].N - 2 || 15 == o[r + 5].N)) {
      if (o[r].N != t.N - 2) {
        s.push(o[r]);
        s.push(o[r + 1]);
        s.push(o[r + 2]);
        s.push(o[r + 3]);
        s.push(o[r + 4]);
        s.push(o[r + 5]);
        return s;
      }
      if (o[r + 5].S > t.S) {
        s.push(o[r]);
        s.push(o[r + 1]);
        s.push(o[r + 2]);
        s.push(o[r + 3]);
        s.push(o[r + 4]);
        s.push(o[r + 5]);
        return s;
      }
    }
  }
  return s;
};
i.getHigherFourPairs = function(t, e, i) {
  if (void 0 === i) {
    i = false;
  }
  n.sortVector(e, false);
  var o = a(e),
    s = [];
  if (o.length < 8) {
    return s;
  }
  for (var r = 0; r < o.length - 7; r++) {
    if (!(o[r].N < t.N - 3 || o[r].N == t.N - 3 && i || o[r].N != o[r + 1].N || o[r].N != o[r + 2].N - 1 || o[r].N != o[r + 3].N - 1 || o[
        r].N != o[r + 4].N - 2 || o[r].N != o[r + 5].N - 2 || o[r].N != o[r + 6].N - 3 || o[r].N != o[r + 7].N - 3 || 15 == o[r + 7].N)) {
      if (o[r].N != t.N - 3) {
        s.push(o[r]);
        s.push(o[r + 1]);
        s.push(o[r + 2]);
        s.push(o[r + 3]);
        s.push(o[r + 4]);
        s.push(o[r + 5]);
        s.push(o[r + 6]);
        s.push(o[r + 7]);
        return s;
      }
      if (o[r + 7].S > t.S) {
        s.push(o[r]);
        s.push(o[r + 1]);
        s.push(o[r + 2]);
        s.push(o[r + 3]);
        s.push(o[r + 4]);
        s.push(o[r + 5]);
        s.push(o[r + 6]);
        s.push(o[r + 7]);
        return s;
      }
    }
  }
  return s;
};
void 0;
