var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";

function randInt(min, max) {
  var minCeil = Math.ceil(min),
    maxFloor = Math.floor(max);
  return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function shuffleInPlace(array) {
  for (var swapPair, index = array.length - 1; index > 0; index--) {
    var randomIndex = randInt(0, index);
    swapPair = [array[randomIndex], array[index]];
    array[index] = swapPair[0];
    array[randomIndex] = swapPair[1];
  }
  return array;
}

function weightedIndex(weights) {
  var totalWeight = weights.reduce(function(sum, weight) {
    return sum + Math.max(0, weight);
  }, 0);
  if (totalWeight <= 0) {
    throw new Error("sum(weights) must be > 0");
  }
  for (var roll = Math.random() * totalWeight, index = 0; index < weights.length; index++) {
    if ((roll -= Math.max(0, weights[index])) <= 0) {
      return index;
    }
  }
  return weights.length - 1;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(from, to, ratio) {
  return from + (to - from) * ratio;
}

function invLerp(from, to, value) {
  return (value - from) / (to - from);
}

function mod(value, modulus) {
  return (value % modulus + modulus) % modulus;
}

function wrap(value, min, max) {
  return mod(value - min, max - min) + min;
}

function mean(values) {
  if (!values.length) {
    throw new Error("mean: empty array");
  }
  return values.reduce(function(sum, value) {
    return sum + value;
  }, 0) / values.length;
}

function variance(values, ddof) {
  if (void 0 === ddof && (ddof = 1), values.length - ddof <= 0) {
    throw new Error("variance: insufficient data");
  }
  var average = mean(values);
  return values.reduce(function(sum, value) {
    return sum + (value - average) * (value - average);
  }, 0) / (values.length - ddof);
}
cc._RF.push(moduleRef, "4eaa27PiQlMg43wtQSOjm8+", "GbMathUtils");
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});
moduleExports.randFloat = function(min, max) {
  return randomInRange(min, max);
};
moduleExports.randInt = randInt;
moduleExports.getRandomArbitrary = randomInRange;
moduleExports.randBool = function(probability) {
  if (void 0 === probability) {
    probability = .5;
  }
  return Math.random() < probability;
};
moduleExports.randSign = function() {
  return Math.random() < .5 ? -1 : 1;
};
moduleExports.randChoice = function(array) {
  if (!array.length) {
    throw new Error("randChoice: empty array");
  }
  return array[Math.floor(Math.random() * array.length)];
};
moduleExports.shuffleInPlace = shuffleInPlace;
moduleExports.sampleWithoutReplacement = function(array, count) {
  if (count > array.length) {
    throw new Error("k > array.length");
  }
  var shuffled = array.slice();
  shuffleInPlace(shuffled);
  return shuffled.slice(0, count);
};
moduleExports.weightedIndex = weightedIndex;
moduleExports.weightedChoice = function(items, weights) {
  if (items.length !== weights.length) {
    throw new Error("items vs weights mismatch");
  }
  return items[weightedIndex(weights)];
};
moduleExports.randNormal = function(meanValue, stdDev) {
  if (void 0 === meanValue) {
    meanValue = 0;
  }
  if (void 0 === stdDev) {
    stdDev = 1;
  }
  var radiusSeed = 1 - Math.random(),
    angleSeed = Math.random();
  return meanValue + Math.sqrt(-2 * Math.log(radiusSeed)) * Math.cos(2 * Math.PI * angleSeed) * stdDev;
};
moduleExports.randInCircle = function(radius) {
  if (void 0 === radius) {
    radius = 1;
  }
  var angle = 2 * Math.PI * Math.random(),
    radiusFactorRaw = Math.random() + Math.random(),
    distance = (radiusFactorRaw > 1 ? 2 - radiusFactorRaw : radiusFactorRaw) * radius;
  return {
    x: distance * Math.cos(angle),
    y: distance * Math.sin(angle)
  };
};
moduleExports.randOnCircle = function(radius) {
  if (void 0 === radius) {
    radius = 1;
  }
  var angle = 2 * Math.PI * Math.random();
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle)
  };
};
moduleExports.clamp = clamp;
moduleExports.lerp = lerp;
moduleExports.invLerp = invLerp;
moduleExports.remap = function(value, inMin, inMax, outMin, outMax, shouldClamp) {
  if (void 0 === shouldClamp) {
    shouldClamp = false;
  }
  var ratio = invLerp(inMin, inMax, value);
  return lerp(outMin, outMax, shouldClamp ? clamp(ratio, 0, 1) : ratio);
};
moduleExports.nearlyEqual = function(valueA, valueB, epsilon) {
  if (void 0 === epsilon) {
    epsilon = 1e-6;
  }
  return Math.abs(valueA - valueB) <= epsilon * Math.max(1, Math.max(Math.abs(valueA), Math.abs(valueB)));
};
moduleExports.roundTo = function(value, step) {
  return Math.round(value / step) * step;
};
moduleExports.snap = function(value, step) {
  return Math.round(value / step) * step;
};
moduleExports.mod = mod;
moduleExports.wrap = wrap;
moduleExports.degToRad = function(degrees) {
  return degrees * Math.PI / 180;
};
moduleExports.radToDeg = function(radians) {
  return 180 * radians / Math.PI;
};
moduleExports.normalizeAngle = function(angle) {
  return wrap(angle, -Math.PI, Math.PI);
};
moduleExports.dist2D = function(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
};
moduleExports.smoothstep = function(edgeStart, edgeEnd, value) {
  var ratio = clamp((value - edgeStart) / (edgeEnd - edgeStart), 0, 1);
  return ratio * ratio * (3 - 2 * ratio);
};
moduleExports.smootherstep = function(edgeStart, edgeEnd, value) {
  var ratio = clamp((value - edgeStart) / (edgeEnd - edgeStart), 0, 1);
  return ratio * ratio * ratio * (ratio * (6 * ratio - 15) + 10);
};
moduleExports.mean = mean;
moduleExports.variance = variance;
moduleExports.stddev = function(values, ddof) {
  if (void 0 === ddof) {
    ddof = 1;
  }
  return Math.sqrt(variance(values, ddof));
};
moduleExports.getRandomPositionInEllipse = function(cornerA, cornerB) {
  var pointA = cornerA,
    pointB = cornerB,
    minX = Math.min(pointA.x, pointB.x),
    maxX = Math.max(pointA.x, pointB.x),
    minY = Math.min(pointA.y, pointB.y),
    maxY = Math.max(pointA.y, pointB.y),
    centerX = .5 * (minX + maxX),
    centerY = .5 * (minY + maxY),
    radiusX = .5 * (maxX - minX),
    radiusY = .5 * (maxY - minY),
    angle = Math.random() * Math.PI * 2,
    radiusFactor = Math.sqrt(Math.random()),
    rawX = centerX + radiusX * radiusFactor * Math.cos(angle),
    rawY = centerY + radiusY * radiusFactor * Math.sin(angle),
    flooredX = Math.floor(rawX),
    flooredY = Math.floor(rawY);
  return new cc.Vec2(flooredX, flooredY);
};
cc._RF.pop();
