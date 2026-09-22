var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
var n = require("./GameCardSprite"),
  o = require("./TLMNRemakeCardLib"),
  a = require("./TLMNRemakeGetCardsHeigherHelper"),
  s = require("./TLMNRemakeCardsTypeHelper"),
  r = require("./TLMNRemakeConstant");
i.getRecommendCards = function(t, e) {
  o.sortVector(t, false);
  var s = [];
  switch (i.getCardType(t)) {
    case r.CARD_TYPE.SINGLE:
      s = c(t[0], e);
      break;
    case r.CARD_TYPE.PAIRS:
      s = l(t, e);
      break;
    case r.CARD_TYPE.THREE_OF_A_KIND:
      s = a.getHigherThrees(t, e);
      break;
    case r.CARD_TYPE.FOUR_OF_A_KIND:
      (s = a.getHigherFours(t[0].N, e)).length <= 0 && (s = h(e));
      break;
    case r.CARD_TYPE.THREE_PAIRS_STRAIGHT:
      if ((s = a.getHigherThreePairs(t[t.length - 1], e)).length < 1) {
        var u = new n.default();
        u.N = 3;
        u.S = 1;
        s = a.getHigherFourPairs(u, e);
      }
      s.length < 1 && (s = a.getHigherFours(0, e));
      break;
    case r.CARD_TYPE.STRAIGHT:
      s = a.getHigherStraight(t, e);
      break;
    case r.CARD_TYPE.FOUR_PAIRS_STRAGHT:
      s = a.getHigherFourPairs(t[t.length - 1], e);
  }
  return s;
};
var c = function(t, e) {
    var i = [];
    if (15 == t.N) {
      for (var n = 0; n < e.length; n++) {
        var o = e[n];
        if (15 == o.N && o.S > t.S) {
          i.push(o);
          break;
        }
      }
      if (i.length <= 0 && (i = a.getHigherFours(0, e)).length <= 0 && (i = h(e)).length <= 0) {
        i = a.getHigherThreePairs({
          n: 3,
          s: 1
        }, e);
      }
    } else {
      for (n = 0; n < e.length; n++) {
        var s = e[n];
        if (s.N > t.N) {
          i.push(s);
          break;
        }
        if (s.N == t.N && s.S > t.S) {
          i.push(s);
          break;
        }
      }
    }
    return i;
  },
  l = function(t, e) {
    var i = [];
    if ((i = a.getHigherPairs(t, e)).length <= 0 && 15 == t[0].N && (i = a.getHigherFours(0, e)).length <= 0) {
      i = h(e);
    }
    return i;
  },
  h = function(t) {
    return a.getHigherFourPairs({
      n: 3,
      s: 1
    }, t);
  };
i.getCardType = function(t) {
  return 1 == t.length ? r.CARD_TYPE.SINGLE : s.isPairs(t) ? r.CARD_TYPE.PAIRS : s.isThreeOfAKind(t) ? r.CARD_TYPE.THREE_OF_A_KIND : s
    .isFourOfAKind(t) ? r.CARD_TYPE.FOUR_OF_A_KIND : s.isThreePairsStraight(t) ? r.CARD_TYPE.THREE_PAIRS_STRAIGHT : s.isStraight(t) ? r
    .CARD_TYPE.STRAIGHT : s.isFourPairsStraight(t) ? r.CARD_TYPE.FOUR_PAIRS_STRAGHT : void 0;
};
void 0;
