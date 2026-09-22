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
  t.hasTuQuy = function(e) {
    return !(e.length < 4) && t.findSameCard(e, 4).length > 0;
  };
  t.findSameCard = function(t, e) {
    var i = {},
      n = [];
    for (var o in t.forEach(function(t) {
        if (i[t]) {
          i[t]++;
        } else {
          i[t] = 1;
        }
      }), i) {
      if (i[o] >= e) {
        n.push(parseInt(o));
      }
    }
    return n;
  };
  t.hasDoiThong = function(e, i) {
    var n = t.findSameCard(e, 2);
    if (n.sort(function(t, e) {
        return t - e;
      }), n.length < 3) {
      return false;
    }
    for (var o = [], a = 0; a < n.length - 1; a++) {
      var s = n[a],
        r = n[a + 1];
      if (r - s == 1) {
        if (0 == o.length ? (o.push(s), o.push(r)) : o.push(r), o.length >= i) {
          return true;
        }
      } else {
        o = [];
      }
    }
    return false;
  };
  return t;
}();
i.TienLenUtil = n;
void 0;
