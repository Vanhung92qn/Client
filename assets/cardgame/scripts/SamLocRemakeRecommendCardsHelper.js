var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
var n = require("./GameCardSprite"),
  o = require("./SamLocRemakeCardLib"),
  a = require("./SamLocRemakeGetCardsHeigherHelper"),
  s = require("./SamLocRemakeCardsTypeHelper"),
  r = require("./SamLocRemakeConstant");
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
      s = a.getHigherThrees(t, e, true);
      break;
    case r.CARD_TYPE.FOUR_OF_A_KIND:
      (s = a.getHigherFours(t[0].N, e)).length <= 0 && (s = h(e));
      break;
    case r.CARD_TYPE.THREE_PAIRS_STRAIGHT:
      if ((s = a.getHigherThreePairs(t[t.length - 1], e, true)).length < 1) {
        var u = new n.default();
        u.N = 3;
        u.S = 1;
        s = a.getHigherFourPairs(u, e, true);
      }
      s.length < 1 && (s = a.getHigherFours(0, e));
      break;
    case r.CARD_TYPE.STRAIGHT:
      s = a.getHigherStraight(t, e, true);
      break;
    case r.CARD_TYPE.FOUR_PAIRS_STRAGHT:
      s = a.getHigherFourPairs(t[t.length - 1], e, true);
  }
  return s;
};
var c = function(t, e) {
    var i = [];
    if (15 == t.N) {
      i = a.getHigherFours(0, e);
    } else {
      for (var n = 0; n < e.length; n++) {
        var o = e[n];
        if (o.N > t.N) {
          i.push(o);
          break;
        }
      }
    }
    return i;
  },
  l = function(t, e) {
    return a.getHigherPairs(t, e, true);
  },
  h = function(t) {
    return a.getHigherFourPairs({
      n: 3,
      s: 1
    }, t, true);
  };
i.getCardType = function(t) {
  return 1 == t.length ? r.CARD_TYPE.SINGLE : s.isPairs(t) ? r.CARD_TYPE.PAIRS : s.isThreeOfAKind(t) ? r.CARD_TYPE.THREE_OF_A_KIND : s
    .isFourOfAKind(t) ? r.CARD_TYPE.FOUR_OF_A_KIND : s.isThreePairsStraight(t) ? r.CARD_TYPE.THREE_PAIRS_STRAIGHT : s.isStraight_Sam(t) ?
    r.CARD_TYPE.STRAIGHT : s.isFourPairsStraight(t) ? r.CARD_TYPE.FOUR_PAIRS_STRAGHT : void 0;
};
void 0;
