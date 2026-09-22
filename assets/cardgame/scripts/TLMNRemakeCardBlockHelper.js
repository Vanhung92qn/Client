var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
var n = require("TLMNRemakeCardsTypeHelper"),
  o = require("TLMNRemakeRecommendCardsHelper");

function a(t, e, i, n) {
  s(t, e, i, 0, [], 0, n);
}

function s(t, e, i, n, o, a, r) {
  if (n != i) {
    if (!(a >= e)) {
      var c = t[a];
      o[n] = c;
      s(t, e, i, n + 1, o, a + 1, r);
      s(t, e, i, n, o, a + 1, r);
    }
  } else {
    r.push(o.slice());
  }
}
i.getListRecommendCards = function(t, e) {
  var i = [];
  if (n.isStraight(t) || n.isThreeOfAKind(t)) {
    a(e, e.length, t.length, i);
  } else if (1 != t.length && !n.isPairs(t) || 15 == t[0].N) {
    for (var s = 1; s <= e.length; s++) {
      a(e, e.length, s, i);
    }
  } else {
    a(e, e.length, t.length, i);
  }
  var r = [];
  for (s = i.length - 1; s >= 0; s--) {
    var c = i[s],
      l = o.getRecommendCards(t, c);
    if (l.length > 0) {
      r.push(l);
    }
  }
  return r;
};
i.getAllowedCardsToPlay = function(t, e) {
  for (var i = [], n = e.length - 1; n >= 0; n--) {
    var a = e[n],
      s = o.getRecommendCards(t, a);
    if (s.length > 0 && s.length > 0) {
      i.push.apply(i, s);
    }
  }
  return i;
};
i.getCombination = a;
i.combinationUtil = s;
void 0;
