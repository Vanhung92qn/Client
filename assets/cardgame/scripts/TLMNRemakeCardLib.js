var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
var n = require("./GameCard"),
  o = require("./GameDefine");

function a(t, e, i, n, o, s, r) {
  if (n == i) {
    var c = o;
    r.push(c);
  }
  if (!(s >= e)) {
    var l = t[s];
    o[n] = l;
    a(t, e, i, n + 1, o, s + 1, r);
    a(t, e, i, n, o, s + 1, r);
  }
}

function s(t, e, i) {
  var n;
  n = [t[i], t[e]];
  t[e] = n[0];
  t[i] = n[1];
}
i.getCombination = function(t, e, i, n) {
  a(t, e, i, 0, [], 0, n);
};
i.combinationUtil = a;
i.swap = s;
i.sortVector = function(t, e) {
  if (e) {
    for (var i = 0; i < t.length - 1;) {
      var n = (l = t[i]).N,
        o = l.S,
        a = void 0;
      for (a = i + 1; a < t.length; a++) {
        var r = (h = t[a]).N,
          c = h.S;
        if (n > r) {
          s(t, i, a);
          i = 0;
          break;
        }
        if (n == r && o < c) {
          s(t, i, a);
          i = 0;
          break;
        }
      }
      if (!(0 == i && a != t.length)) {
        i++;
      }
    }
  } else {
    for (i = 0; i < t.length - 1;) {
      var l;
      for (n = (l = t[i]).N, o = l.S, a = void 0, a = i + 1; a < t.length; a++) {
        var h;
        if (r = (h = t[a]).N, c = h.S, n > r) {
          s(t, i, a);
          i = 0;
          break;
        }
        if (n == r && o > c) {
          s(t, i, a);
          i = 0;
          break;
        }
      }
      if (!(0 == i && a != t.length)) {
        i++;
      }
    }
  }
};
i.sortList = function(t) {
  if (0 != t.length) {
    for (var e = 0; e < t.length - 1;) {
      var i = t[e],
        n = void 0;
      for (n = e + 1; n < t.length; n++) {
        if (i > t[n]) {
          var o = i;
          t[e] = t[n];
          t[n] = o;
          e = 0;
          break;
        }
      }
      if (!(0 == e && n != t.length)) {
        e++;
      }
    }
  }
};
i.convertCardNumbersToGameCards = function(t) {
  var e = Array();
  if (void 0 != t && t.length > 0) {
    t.forEach(function(t) {
      e.push(new n.GameCard(t, o.GameID.TIENLEN));
    });
  }
  return e;
};
i.compare2SingleCards = function(t, e) {
  if (15 == t.n) {
    if (15 == e.n && e.s > t.s) {
      return true;
    }
  } else {
    if (t.n > e.n) {
      return true;
    }
    if (t.n == e.n && t.s > e.s) {
      return true;
    }
  }
  return false;
};
void 0;
