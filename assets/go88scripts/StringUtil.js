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
  t.IsObject = function(t) {
    return t && "object" == typeof t && !Array.isArray(t);
  };
  t.IsValidJSON = function(e, i) {
    if (void 0 === i) {
      i = false;
    }
    try {
      return !(i && !t.IsObject(e)) && "object" == typeof JSON.parse(e);
    } catch (t) {
      return false;
    }
  };
  t.formatMoneyNumber = function(t, e) {
    if (void 0 === e) {
      e = 2;
    }
    var i = 1,
      n = t;
    if (t < 0) {
      i = -1;
      n *= -1;
    }
    var o = "";
    if (n >= 1e9) {
      n /= 1e9;
      o = "B";
    } else {
      if (n >= 1e6) {
        n /= 1e6;
        o = "M";
      } else {
        if (n >= 1e3) {
          n /= 1e3;
          o = "K";
        }
      }
    }
    return (n = Math.floor(n * Math.pow(10, e) + 1e-8) / Math.pow(10, e) * i) + o;
  };
  t.formatMoneyNumberWithVietnameseUnit = function(t) {
    var e = 1,
      i = t;
    if (t < 0) {
      e = -1;
      i *= -1;
    }
    var n = "";
    if (i >= 1e9) {
      i /= 1e9;
      n = " t\u1ef7";
    } else {
      if (i >= 1e6) {
        i /= 1e6;
        n = " tri\u1ec7u";
      } else {
        if (i >= 1e3) {
          i /= 1e3;
          n = "K";
        }
      }
    }
    return (i = Math.floor(100 * i + 1e-8) / 100 * e) + n;
  };
  t.formatMoneyNumberWithDot = function(t) {
    var e = false;
    if (t < 0 && (t *= -1, e = true), t < 1e3) {
      var i = Math.floor(t).toString();
      if (1 == e) {
        i = "-" + i;
      }
      return i;
    }
    for (var n = "", o = Math.floor(t).toString(), a = o.length; a >= 0; a -= 3) {
      if (a - 3 <= 0) {
        n = o.slice(0, a) + n;
        break;
      }
      n = "." + o.slice(a - 3, a) + n;
    }
    if (1 == e) {
      n = "-" + n;
    }
    return n;
  };
  t.formatMoneyNumberWithColom = function(t) {
    var e = false;
    if (t < 0 && (t *= -1, e = true), t < 1e3) {
      var i = Math.floor(t).toString();
      if (1 == e) {
        i = "-" + i;
      }
      return i;
    }
    for (var n = "", o = Math.floor(t).toString(), a = o.length; a >= 0; a -= 3) {
      if (a - 3 <= 0) {
        n = o.slice(0, a) + n;
        break;
      }
      n = "," + o.slice(a - 3, a) + n;
    }
    if (1 == e) {
      n = "-" + n;
    }
    return n;
  };
  t.formatMoneyNumberWithColomNoFloor = function(t, e) {
    if (void 0 === e) {
      e = 1;
    }
    var i = t.toString().split("."),
      n = i[0],
      o = i[1],
      a = false;
    if (t < 0 && (t *= -1, a = true), t < 1e3) {
      var s = n;
      if (1 == a) {
        s = "-" + s;
      }
      return o ? s + "." + o.charAt(0) : s;
    }
    for (var r = "", c = n, l = c.length; l >= 0; l -= 3) {
      if (l - 3 <= 0) {
        r = c.slice(0, l) + r;
        break;
      }
      r = "," + c.slice(l - 3, l) + r;
    }
    if (1 == a) {
      r = "-" + r;
    }
    return o ? r + "." + o.charAt(0) : r;
  };
  t.formatNumber = function(t) {
    return t.toLocaleString();
  };
  t.getRandomInt = function(t) {
    return Math.floor(Math.random() * Math.floor(t));
  };
  t.getRandomArbitrary = function(t, e) {
    return Math.random() * (e - t) + t;
  };
  t.checkVec2Equal = function(t, e) {
    return t.x === e.x && t.y === e.y;
  };
  t.isNullOrEmpty = function(t) {
    return void 0 === t || "undefined" === t || null === t || "null" === t || "" === t || 0 === t.length;
  };
  t.getQueryStringValue = function(t) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(t).replace(/[\.\+\*]/g,
      "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  };
  t.filterTenDangNhap = function(t) {
    return t.replace(/[^A-Za-z0-9]/g, "");
  };
  t.removeSpaceBeforeAndLast = function(t) {
    if (!this.isNullOrEmpty(t)) {
      t = (t = t.replace(/^\s+/, "")).replace(/\s+$/, "");
    }
    return t;
  };
  t.isContainSpecialCharacter = function(t) {
    return t.search(
      /[\xc0\xc1\xc2\xc3\xc8\xc9\xca\xcc\xcd\xd2\xd3\xd4\xd5\xd9\xda\xdd\xe0\xe1\xe2\xe3\xe8\xe9\xea\xec\xed\xf2\xf3\xf4\xf5\xf9\xfa\xfd\u1ef2\u1ef8\u1ef3\u1ef9\u1ef6\u1ef7\u1ef4\u1ef5\u1ef1\u1ef0\u1eed\u1eec\u1eef\u1eee\u1eeb\u1eea\u1ee9\u1ee8\u01b0\u01af\u1ee5\u1ee4\u1ee7\u1ee6\u0169\u0168\u1ee3\u1ee2\u1edf\u1ede\u1ee1\u1ee0\u1edd\u1edc\u1edb\u1eda\u01a1\u01a0\u1ed9\u1ed8\u1ed5\u1ed4\u1ed7\u1ed6\u1ed3\u1ed2\u1ed1\u1ed0\u1ecd\u1ecc\u1ecf\u1ece\u1ecb\u1eca\u1ec9\u1ec8\u0129\u0128\u1ec7\u1ec6\u1ec3\u1ec2\u1ec5\u1ec4\u1ec1\u1ec0\u1ebf\u1ebe\u1eb9\u1eb8\u1ebb\u1eba\u1ebd\u1ebc\u1eb7\u1eb6\u1eb3\u1eb2\u1eb5\u1eb4\u1eb1\u1eb0\u1eaf\u1eae\u0103\u0102\u1ead\u1eac\u1ea9\u1ea8\u1eab\u1eaa\u1ea7\u1ea6\u1ea5\u1ea4\u1ea1\u1ea0\u1ea3\u1ea2\u0111\u0110 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g
      ) >= 0;
  };
  t.isContainSpecialCharacterNoSpace = function(t) {
    return t.search(
      /[\xc0\xc1\xc2\xc3\xc8\xc9\xca\xcc\xcd\xd2\xd3\xd4\xd5\xd9\xda\xdd\xe0\xe1\xe2\xe3\xe8\xe9\xea\xec\xed\xf2\xf3\xf4\xf5\xf9\xfa\xfd\u1ef2\u1ef8\u1ef3\u1ef9\u1ef6\u1ef7\u1ef4\u1ef5\u1ef1\u1ef0\u1eed\u1eec\u1eef\u1eee\u1eeb\u1eea\u1ee9\u1ee8\u01b0\u01af\u1ee5\u1ee4\u1ee7\u1ee6\u0169\u0168\u1ee3\u1ee2\u1edf\u1ede\u1ee1\u1ee0\u1edd\u1edc\u1edb\u1eda\u01a1\u01a0\u1ed9\u1ed8\u1ed5\u1ed4\u1ed7\u1ed6\u1ed3\u1ed2\u1ed1\u1ed0\u1ecd\u1ecc\u1ecf\u1ece\u1ecb\u1eca\u1ec9\u1ec8\u0129\u0128\u1ec7\u1ec6\u1ec3\u1ec2\u1ec5\u1ec4\u1ec1\u1ec0\u1ebf\u1ebe\u1eb9\u1eb8\u1ebb\u1eba\u1ebd\u1ebc\u1eb7\u1eb6\u1eb3\u1eb2\u1eb5\u1eb4\u1eb1\u1eb0\u1eaf\u1eae\u0103\u0102\u1ead\u1eac\u1ea9\u1ea8\u1eab\u1eaa\u1ea7\u1ea6\u1ea5\u1ea4\u1ea1\u1ea0\u1ea3\u1ea2\u0111\u0110!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g
      ) >= 0;
  };
  t.isContainSpecialCharacterNumberNoSpace = function(t) {
    return t.search(
      /[0123456789\xc0\xc1\xc2\xc3\xc8\xc9\xca\xcc\xcd\xd2\xd3\xd4\xd5\xd9\xda\xdd\xe0\xe1\xe2\xe3\xe8\xe9\xea\xec\xed\xf2\xf3\xf4\xf5\xf9\xfa\xfd\u1ef2\u1ef8\u1ef3\u1ef9\u1ef6\u1ef7\u1ef4\u1ef5\u1ef1\u1ef0\u1eed\u1eec\u1eef\u1eee\u1eeb\u1eea\u1ee9\u1ee8\u01b0\u01af\u1ee5\u1ee4\u1ee7\u1ee6\u0169\u0168\u1ee3\u1ee2\u1edf\u1ede\u1ee1\u1ee0\u1edd\u1edc\u1edb\u1eda\u01a1\u01a0\u1ed9\u1ed8\u1ed5\u1ed4\u1ed7\u1ed6\u1ed3\u1ed2\u1ed1\u1ed0\u1ecd\u1ecc\u1ecf\u1ece\u1ecb\u1eca\u1ec9\u1ec8\u0129\u0128\u1ec7\u1ec6\u1ec3\u1ec2\u1ec5\u1ec4\u1ec1\u1ec0\u1ebf\u1ebe\u1eb9\u1eb8\u1ebb\u1eba\u1ebd\u1ebc\u1eb7\u1eb6\u1eb3\u1eb2\u1eb5\u1eb4\u1eb1\u1eb0\u1eaf\u1eae\u0103\u0102\u1ead\u1eac\u1ea9\u1ea8\u1eab\u1eaa\u1ea7\u1ea6\u1ea5\u1ea4\u1ea1\u1ea0\u1ea3\u1ea2\u0111\u0110!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g
      ) >= 0;
  };
  t.removeSpecialCharacter = function(t, e) {
    if (void 0 === e) {
      e = true;
    }
    return e ? t.replace(
      /[^A-Za-z0-9\xc0\xc1\xc2\xc3\xc8\xc9\xca\xcc\xcd\xd2\xd3\xd4\xd5\xd9\xda\xdd\xe0\xe1\xe2\xe3\xe8\xe9\xea\xec\xed\xf2\xf3\xf4\xf5\xf9\xfa\xfd\u1ef2\u1ef8\u1ef3\u1ef9\u1ef6\u1ef7\u1ef4\u1ef5\u1ef1\u1ef0\u1eed\u1eec\u1eef\u1eee\u1eeb\u1eea\u1ee9\u1ee8\u01b0\u01af\u1ee5\u1ee4\u1ee7\u1ee6\u0169\u0168\u1ee3\u1ee2\u1edf\u1ede\u1ee1\u1ee0\u1edd\u1edc\u1edb\u1eda\u01a1\u01a0\u1ed9\u1ed8\u1ed5\u1ed4\u1ed7\u1ed6\u1ed3\u1ed2\u1ed1\u1ed0\u1ecd\u1ecc\u1ecf\u1ece\u1ecb\u1eca\u1ec9\u1ec8\u0129\u0128\u1ec7\u1ec6\u1ec3\u1ec2\u1ec5\u1ec4\u1ec1\u1ec0\u1ebf\u1ebe\u1eb9\u1eb8\u1ebb\u1eba\u1ebd\u1ebc\u1eb7\u1eb6\u1eb3\u1eb2\u1eb5\u1eb4\u1eb1\u1eb0\u1eaf\u1eae\u0103\u0102\u1ead\u1eac\u1ea9\u1ea8\u1eab\u1eaa\u1ea7\u1ea6\u1ea5\u1ea4\u1ea1\u1ea0\u1ea3\u1ea2\u0111\u0110 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g,
      "") : t.replace(
      /[^A-Za-z0-9\xc0\xc1\xc2\xc3\xc8\xc9\xca\xcc\xcd\xd2\xd3\xd4\xd5\xd9\xda\xdd\xe0\xe1\xe2\xe3\xe8\xe9\xea\xec\xed\xf2\xf3\xf4\xf5\xf9\xfa\xfd\u1ef2\u1ef8\u1ef3\u1ef9\u1ef6\u1ef7\u1ef4\u1ef5\u1ef1\u1ef0\u1eed\u1eec\u1eef\u1eee\u1eeb\u1eea\u1ee9\u1ee8\u01b0\u01af\u1ee5\u1ee4\u1ee7\u1ee6\u0169\u0168\u1ee3\u1ee2\u1edf\u1ede\u1ee1\u1ee0\u1edd\u1edc\u1edb\u1eda\u01a1\u01a0\u1ed9\u1ed8\u1ed5\u1ed4\u1ed7\u1ed6\u1ed3\u1ed2\u1ed1\u1ed0\u1ecd\u1ecc\u1ecf\u1ece\u1ecb\u1eca\u1ec9\u1ec8\u0129\u0128\u1ec7\u1ec6\u1ec3\u1ec2\u1ec5\u1ec4\u1ec1\u1ec0\u1ebf\u1ebe\u1eb9\u1eb8\u1ebb\u1eba\u1ebd\u1ebc\u1eb7\u1eb6\u1eb3\u1eb2\u1eb5\u1eb4\u1eb1\u1eb0\u1eaf\u1eae\u0103\u0102\u1ead\u1eac\u1ea9\u1ea8\u1eab\u1eaa\u1ea7\u1ea6\u1ea5\u1ea4\u1ea1\u1ea0\u1ea3\u1ea2\u0111\u0110!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g,
      "");
  };
  t.removeSpecialCharacterCustom = function(t, e) {
    if (void 0 === e) {
      e = true;
    }
    return e ? t.replace(/[^a-zA-Z* ]/g, "") : t.replace(/[^a-zA-Z*]/g, "");
  };
  t.removeAllCharacterWithoutNumber = function(t) {
    return t.replace(/[^0-9]/g, "");
  };
  t.filterForDisplayName = function(t) {
    return t.replace(
      /[^A-Za-z0-9 \xc0\xc1\xc2\xc3\xc8\xc9\xca\xcc\xcd\xd2\xd3\xd4\xd5\xd9\xda\xdd\xe0\xe1\xe2\xe3\xe8\xe9\xea\xec\xed\xf2\xf3\xf4\xf5\xf9\xfa\xfd\u1ef2\u1ef8\u1ef3\u1ef9\u1ef6\u1ef7\u1ef4\u1ef5\u1ef1\u1ef0\u1eed\u1eec\u1eef\u1eee\u1eeb\u1eea\u1ee9\u1ee8\u01b0\u01af\u1ee5\u1ee4\u1ee7\u1ee6\u0169\u0168\u1ee3\u1ee2\u1edf\u1ede\u1ee1\u1ee0\u1edd\u1edc\u1edb\u1eda\u01a1\u01a0\u1ed9\u1ed8\u1ed5\u1ed4\u1ed7\u1ed6\u1ed3\u1ed2\u1ed1\u1ed0\u1ecd\u1ecc\u1ecf\u1ece\u1ecb\u1eca\u1ec9\u1ec8\u0129\u0128\u1ec7\u1ec6\u1ec3\u1ec2\u1ec5\u1ec4\u1ec1\u1ec0\u1ebf\u1ebe\u1eb9\u1eb8\u1ebb\u1eba\u1ebd\u1ebc\u1eb7\u1eb6\u1eb3\u1eb2\u1eb5\u1eb4\u1eb1\u1eb0\u1eaf\u1eae\u0103\u0102\u1ead\u1eac\u1ea9\u1ea8\u1eab\u1eaa\u1ea7\u1ea6\u1ea5\u1ea4\u1ea1\u1ea0\u1ea3\u1ea2\u0111\u0110]/g,
      "");
  };
  t.filterNumber = function(t) {
    return t.replace(/[.]/g, "");
  };
  t.getNumBer = function(t) {
    for (; t.indexOf(".") >= 0;) {
      t = t.replace(".", "");
    }
    return parseInt(t);
  };
  t.getStringofNumBer = function(t) {
    return t <= 9 ? "0" + t : t.toString();
  };
  t.ParseIntBanPhimMobile = function(t, e) {
    if (void 0 === e) {
      e = false;
    }
    var i = 0;
    if (cc.sys.platform === cc.sys.MOBILE_BROWSER || cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
      i = parseInt(t);
    } else {
      i = parseInt(t.replace(".", ""));
      if (t.indexOf(".") >= 0 && e) {
        i = parseInt(t.split(".")[0]);
      }
    }
    return i;
  };
  t.removeComma = function(t) {
    var e = t.replace(/,/g, "");
    if (!(void 0 != e && null != e)) {
      e = "";
    }
    return e;
  };
  t.removeDot = function(t) {
    return t.split(".").join("");
  };
  t.filterNumber2 = function(t) {
    return t.replace(/[^0-9]/g, "");
  };
  t.filterAlphabet = function(t) {
    return t.replace(/[^A-Za-z0-9]/g, "");
  };
  t.formatMoneyNumberWithColomAndDot = function(e) {
    if (Number(e) >= 1e3) {
      var i = e.split("."),
        n = "",
        o = Number(i[0]);
      if (o >= 1e3) {
        n = t.formatMoneyNumberWithColom(o);
      }
      e = n;
      if (void 0 != i[1]) {
        e += "." + i[1];
      }
    }
    return e;
  };
  t.formatLongName = function(t, e) {
    if (void 0 === e) {
      e = 8;
    }
    return t.length <= e ? t : t.substring(0, e) + "...";
  };
  t.replacePlaceholders = function(t) {
    for (var e = [], i = 1; i < arguments.length; i++) {
      e[i - 1] = arguments[i];
    }
    return t.replace(/{(\d+)}/g, function(t, i) {
      var n = e[i];
      return void 0 !== n ? n.toString() : t;
    });
  };
  t.formatMoneyNumberDecimal = function(t, e) {
    if (void 0 === e) {
      e = 2;
    }
    return this.toFixed(t, e).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  t.toFixed = function(t, e) {
    if (void 0 === t || null === t) {
      return "0.00";
    }
    var i = t.toString();
    return i.indexOf(".") < 0 ? i + "." + "0".repeat(e) : i.split(".")[0] + "." + (i.split(".")[1] || "").slice(0, e).padEnd(e, "0");
  };
  t.cleanAccents = function(t) {
    return t = (t = (t = (t = (t = (t = (t = (t = (t = (t = (t = (t = (t = (t = (t = (t = t.replace(
        /\xe0|\xe1|\u1ea1|\u1ea3|\xe3|\xe2|\u1ea7|\u1ea5|\u1ead|\u1ea9|\u1eab|\u0103|\u1eb1|\u1eaf|\u1eb7|\u1eb3|\u1eb5/g,
        "a")).replace(/\xe8|\xe9|\u1eb9|\u1ebb|\u1ebd|\xea|\u1ec1|\u1ebf|\u1ec7|\u1ec3|\u1ec5/g, "e"))
      .replace(/\xec|\xed|\u1ecb|\u1ec9|\u0129/g, "i")).replace(
      /\xf2|\xf3|\u1ecd|\u1ecf|\xf5|\xf4|\u1ed3|\u1ed1|\u1ed9|\u1ed5|\u1ed7|\u01a1|\u1edd|\u1edb|\u1ee3|\u1edf|\u1ee1/g,
      "o")).replace(/\xf9|\xfa|\u1ee5|\u1ee7|\u0169|\u01b0|\u1eeb|\u1ee9|\u1ef1|\u1eed|\u1eef/g, "u")).replace(
      /\u1ef3|\xfd|\u1ef5|\u1ef7|\u1ef9/g, "y")).replace(/\u0111/g, "d")).replace(
      /\xc0|\xc1|\u1ea0|\u1ea2|\xc3|\xc2|\u1ea6|\u1ea4|\u1eac|\u1ea8|\u1eaa|\u0102|\u1eb0|\u1eae|\u1eb6|\u1eb2|\u1eb4/g,
      "A")).replace(/\xc8|\xc9|\u1eb8|\u1eba|\u1ebc|\xca|\u1ec0|\u1ebe|\u1ec6|\u1ec2|\u1ec4/g, "E")).replace(
      /\xcc|\xcd|\u1eca|\u1ec8|\u0128/g, "I")).replace(
      /\xd2|\xd3|\u1ecc|\u1ece|\xd5|\xd4|\u1ed2|\u1ed0|\u1ed8|\u1ed4|\u1ed6|\u01a0|\u1edc|\u1eda|\u1ee2|\u1ede|\u1ee0/g, "O"
      )).replace(/\xd9|\xda|\u1ee4|\u1ee6|\u0168|\u01af|\u1eea|\u1ee8|\u1ef0|\u1eec|\u1eee/g, "U")).replace(
      /\u1ef2|\xdd|\u1ef4|\u1ef6|\u1ef8/g, "Y")).replace(/\u0110/g, "D")).replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "")).replace(
      /\u02C6|\u0306|\u031B/g, "");
  };
  return t;
}();
i.default = n;
void 0;
