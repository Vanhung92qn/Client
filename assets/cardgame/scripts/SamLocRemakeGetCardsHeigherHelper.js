var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
var n = require("./SamLocRemakeCardLib");

function o(t) {
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
  return e;
}

function a(t) {
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
i.loaiboxamvatuquy = o;
i.loaiboxamdoivatuquy = a;
i.getHigherStraight = function(t, e, i) {
  if (void 0 === i) {
    i = false;
  }
  for (var o = 0; o < t.length; o++) {
    t[o].N;
  }
  for (o = 0; o < e.length; o++) {
    e[o].N;
  }
  var s = a(e);
  n.sortVector(e, false);
  var r = [];
  if (s.length < t.length) {
    return r;
  }
  var c = [],
    l = [],
    h = false;
  if (14 == t[t.length - 2].N) {
    h = true;
  }
  s.forEach(function(t) {
    var e = t.N;
    if (15 == e) {
      e = 2;
    }
    c.push(e);
  });
  t.forEach(function(t) {
    var e = t.N;
    if (15 == e) {
      e = 2;
    }
    if (h && 14 == e) {
      e = 1;
    }
    l.push(e);
  });
  n.sortList(c);
  n.sortList(l);
  var u = -1;
  for (o = 0; o < c.length; o++) {
    if (c[o] > l[0]) {
      if (c.length - o < l.length) {
        break;
      }
      var d = l.length - 1;
      if (d == c[o + d] - c[o]) {
        u = o;
        break;
      }
    }
  }
  if (-1 != u) {
    for (o = u; o < u + l.length; o++) {
      for (var p = 0; p < s.length; p++) {
        var f = s[p].N;
        if (15 == f && (f = 2), f == c[o]) {
          r.push(s[p]);
          break;
        }
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
  var a = o(e),
    s = [];
  if (a.length < 6) {
    return s;
  }
  for (var r = 0; r < a.length - 5; r++) {
    if (!(a[r].N < t.N - 2 || a[r].N == t.N - 2 && i || a[r].N != a[r + 1].N || a[r].N != a[r + 2].N - 1 || a[r].N != a[r + 3].N - 1 || a[
        r].N != a[r + 4].N - 2 || a[r].N != a[r + 5].N - 2 || 15 == a[r + 5].N)) {
      if (a[r].N != t.N - 2) {
        s.push(a[r]);
        s.push(a[r + 1]);
        s.push(a[r + 2]);
        s.push(a[r + 3]);
        s.push(a[r + 4]);
        s.push(a[r + 5]);
        return s;
      }
      if (a[r + 5].S > t.S) {
        s.push(a[r]);
        s.push(a[r + 1]);
        s.push(a[r + 2]);
        s.push(a[r + 3]);
        s.push(a[r + 4]);
        s.push(a[r + 5]);
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
  var a = o(e),
    s = [];
  if (a.length < 8) {
    return s;
  }
  for (var r = 0; r < a.length - 7; r++) {
    if (!(a[r].N < t.N - 3 || a[r].N == t.N - 3 && i || a[r].N != a[r + 1].N || a[r].N != a[r + 2].N - 1 || a[r].N != a[r + 3].N - 1 || a[
        r].N != a[r + 4].N - 2 || a[r].N != a[r + 5].N - 2 || a[r].N != a[r + 6].N - 3 || a[r].N != a[r + 7].N - 3)) {
      if (a[r].N != t.N - 3) {
        s.push(a[r]);
        s.push(a[r + 1]);
        s.push(a[r + 2]);
        s.push(a[r + 3]);
        s.push(a[r + 4]);
        s.push(a[r + 5]);
        s.push(a[r + 6]);
        s.push(a[r + 7]);
        return s;
      }
      if (a[r + 7].S > t.S) {
        s.push(a[r]);
        s.push(a[r + 1]);
        s.push(a[r + 2]);
        s.push(a[r + 3]);
        s.push(a[r + 4]);
        s.push(a[r + 5]);
        s.push(a[r + 6]);
        s.push(a[r + 7]);
        return s;
      }
    }
  }
  return s;
};
void 0;
