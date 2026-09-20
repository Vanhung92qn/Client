var t = require,
  e = module,
  i = exports;
"use strict";

function n(t, e) {
  var i = Math.ceil(t),
    n = Math.floor(e);
  return Math.floor(Math.random() * (n - i + 1)) + i;
}

function o(t, e) {
  return Math.random() * (e - t) + t;
}

function a(t) {
  for (var e, i = t.length - 1; i > 0; i--) {
    var o = n(0, i);
    e = [t[o], t[i]];
    t[i] = e[0];
    t[o] = e[1];
  }
  return t;
}

function s(t) {
  var e = t.reduce(function(t, e) {
    return t + Math.max(0, e);
  }, 0);
  if (e <= 0) {
    throw new Error("sum(weights) must be > 0");
  }
  for (var i = Math.random() * e, n = 0; n < t.length; n++) {
    if ((i -= Math.max(0, t[n])) <= 0) {
      return n;
    }
  }
  return t.length - 1;
}

function r(t, e, i) {
  return Math.max(e, Math.min(i, t));
}

function c(t, e, i) {
  return t + (e - t) * i;
}

function l(t, e, i) {
  return (i - t) / (e - t);
}

function h(t, e) {
  return (t % e + e) % e;
}

function u(t, e, i) {
  return h(t - e, i - e) + e;
}

function d(t) {
  if (!t.length) {
    throw new Error("mean: empty array");
  }
  return t.reduce(function(t, e) {
    return t + e;
  }, 0) / t.length;
}

function p(t, e) {
  if (void 0 === e && (e = 1), t.length - e <= 0) {
    throw new Error("variance: insufficient data");
  }
  var i = d(t);
  return t.reduce(function(t, e) {
    return t + (e - i) * (e - i);
  }, 0) / (t.length - e);
}
cc._RF.push(e, "4eaa27PiQlMg43wtQSOjm8+", "GbMathUtils");
Object.defineProperty(i, "__esModule", {
  value: true
});
i.randFloat = function(t, e) {
  return o(t, e);
};
i.randInt = n;
i.getRandomArbitrary = o;
i.randBool = function(t) {
  if (void 0 === t) {
    t = .5;
  }
  return Math.random() < t;
};
i.randSign = function() {
  return Math.random() < .5 ? -1 : 1;
};
i.randChoice = function(t) {
  if (!t.length) {
    throw new Error("randChoice: empty array");
  }
  return t[Math.floor(Math.random() * t.length)];
};
i.shuffleInPlace = a;
i.sampleWithoutReplacement = function(t, e) {
  if (e > t.length) {
    throw new Error("k > array.length");
  }
  var i = t.slice();
  a(i);
  return i.slice(0, e);
};
i.weightedIndex = s;
i.weightedChoice = function(t, e) {
  if (t.length !== e.length) {
    throw new Error("items vs weights mismatch");
  }
  return t[s(e)];
};
i.randNormal = function(t, e) {
  if (void 0 === t) {
    t = 0;
  }
  if (void 0 === e) {
    e = 1;
  }
  var i = 1 - Math.random(),
    n = Math.random();
  return t + Math.sqrt(-2 * Math.log(i)) * Math.cos(2 * Math.PI * n) * e;
};
i.randInCircle = function(t) {
  if (void 0 === t) {
    t = 1;
  }
  var e = 2 * Math.PI * Math.random(),
    i = Math.random() + Math.random(),
    n = (i > 1 ? 2 - i : i) * t;
  return {
    x: n * Math.cos(e),
    y: n * Math.sin(e)
  };
};
i.randOnCircle = function(t) {
  if (void 0 === t) {
    t = 1;
  }
  var e = 2 * Math.PI * Math.random();
  return {
    x: t * Math.cos(e),
    y: t * Math.sin(e)
  };
};
i.clamp = r;
i.lerp = c;
i.invLerp = l;
i.remap = function(t, e, i, n, o, a) {
  if (void 0 === a) {
    a = false;
  }
  var s = l(e, i, t);
  return c(n, o, a ? r(s, 0, 1) : s);
};
i.nearlyEqual = function(t, e, i) {
  if (void 0 === i) {
    i = 1e-6;
  }
  return Math.abs(t - e) <= i * Math.max(1, Math.max(Math.abs(t), Math.abs(e)));
};
i.roundTo = function(t, e) {
  return Math.round(t / e) * e;
};
i.snap = function(t, e) {
  return Math.round(t / e) * e;
};
i.mod = h;
i.wrap = u;
i.degToRad = function(t) {
  return t * Math.PI / 180;
};
i.radToDeg = function(t) {
  return 180 * t / Math.PI;
};
i.normalizeAngle = function(t) {
  return u(t, -Math.PI, Math.PI);
};
i.dist2D = function(t, e, i, n) {
  return Math.hypot(i - t, n - e);
};
i.smoothstep = function(t, e, i) {
  var n = r((i - t) / (e - t), 0, 1);
  return n * n * (3 - 2 * n);
};
i.smootherstep = function(t, e, i) {
  var n = r((i - t) / (e - t), 0, 1);
  return n * n * n * (n * (6 * n - 15) + 10);
};
i.mean = d;
i.variance = p;
i.stddev = function(t, e) {
  if (void 0 === e) {
    e = 1;
  }
  return Math.sqrt(p(t, e));
};
i.getRandomPositionInEllipse = function(t, e) {
  var i = t,
    n = e,
    o = Math.min(i.x, n.x),
    a = Math.max(i.x, n.x),
    s = Math.min(i.y, n.y),
    r = Math.max(i.y, n.y),
    c = .5 * (o + a),
    l = .5 * (s + r),
    h = .5 * (a - o),
    u = .5 * (r - s),
    d = Math.random() * Math.PI * 2,
    p = Math.sqrt(Math.random()),
    f = c + h * p * Math.cos(d),
    g = l + u * p * Math.sin(d),
    m = Math.floor(f),
    y = Math.floor(g);
  return new cc.Vec2(m, y);
};
cc._RF.pop();
