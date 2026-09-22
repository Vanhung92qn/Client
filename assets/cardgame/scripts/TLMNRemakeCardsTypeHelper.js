var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
var n = require("./TLMNRemakeCardLib");

function o(t) {
  if (t.length < 3) {
    return false;
  }
  n.sortList(t);
  for (var e = true, i = t[0], o = 1; o < t.length; o++) {
    e = e && t[o] == i + o;
  }
  return e;
}
i.isStraight = function(t) {
  var e = true;
  if (t.length < 3) {
    return false;
  }
  for (var i = 0; i < t.length - 1; i++) {
    var n = t[i].N,
      o = t[i + 1].N;
    if (15 == n || 15 == o) {
      return false;
    }
    e = e && n + 1 == o;
  }
  return e;
};
i.isStraight_Sam = function(t) {
  var e = [],
    i = [];
  t.forEach(function(t) {
    e.push(15 == t.N ? 2 : t.N);
    i.push(15 == t.N ? 2 : 14 == t.N ? 1 : t.N);
  });
  return !!o(e) || !!o(i);
};
i.checkSanh_sam = o;
i.isPairs = function(t) {
  return 2 == t.length && t[0].N == t[1].N;
};
i.isThreeOfAKind = function(t) {
  return 3 == t.length && t[0].N == t[1].N && t[1].N == t[2].N;
};
i.isFourOfAKind = function(t) {
  return 4 == t.length && t[0].N == t[1].N && t[1].N == t[2].N && t[2].N == t[3].N;
};
i.isThreePairsStraight = function(t) {
  return 6 == t.length && (t.forEach(function(t) {
    if (15 == t.N) {
      return false;
    }
  }), t[0].N == t[1].N && t[1].N == t[2].N - 1 && t[1].N == t[3].N - 1 && t[1].N == t[4].N - 2 && t[1].N == t[5].N - 2);
};
i.isFourPairsStraight = function(t) {
  return 8 == t.length && (t.forEach(function(t) {
    if (15 == t.N) {
      return false;
    }
  }), t[0].N == t[1].N && t[1].N == t[2].N - 1 && t[1].N == t[3].N - 1 && t[1].N == t[4].N - 2 && t[1].N == t[5].N - 2 && t[1].N == t[
    6].N - 3 && t[1].N == t[7].N - 3);
};
void 0;
