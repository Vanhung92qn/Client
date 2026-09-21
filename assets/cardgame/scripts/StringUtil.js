var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});
var StringUtil = function() {
  function StringUtil() {}
  StringUtil.IsObject = function(value) {
    return value && "object" == typeof value && !Array.isArray(value);
  };
  StringUtil.IsValidJSON = function(jsonText, requireObject) {
    if (void 0 === requireObject) {
      requireObject = false;
    }
    try {
      return !(requireObject && !StringUtil.IsObject(jsonText)) && "object" == typeof JSON.parse(jsonText);
    } catch (error) {
      return false;
    }
  };
  StringUtil.formatMoneyNumber = function(amount, decimals) {
    if (void 0 === decimals) {
      decimals = 2;
    }
    var sign = 1,
      value = amount;
    if (amount < 0) {
      sign = -1;
      value *= -1;
    }
    var suffix = "";
    if (value >= 1e9) {
      value /= 1e9;
      suffix = "B";
    } else {
      if (value >= 1e6) {
        value /= 1e6;
        suffix = "M";
      } else {
        if (value >= 1e3) {
          value /= 1e3;
          suffix = "K";
        }
      }
    }
    return (value = Math.floor(value * Math.pow(10, decimals) + 1e-8) / Math.pow(10, decimals) * sign) + suffix;
  };
  StringUtil.formatMoneyNumberWithVietnameseUnit = function(amount) {
    var sign = 1,
      value = amount;
    if (amount < 0) {
      sign = -1;
      value *= -1;
    }
    var unit = "";
    if (value >= 1e9) {
      value /= 1e9;
      unit = " t\u1ef7";
    } else {
      if (value >= 1e6) {
        value /= 1e6;
        unit = " tri\u1ec7u";
      } else {
        if (value >= 1e3) {
          value /= 1e3;
          unit = "K";
        }
      }
    }
    return (value = Math.floor(100 * value + 1e-8) / 100 * sign) + unit;
  };
  StringUtil.formatMoneyNumberWithDot = function(amount) {
    var isNegative = false;
    if (amount < 0 && (amount *= -1, isNegative = true), amount < 1e3) {
      var smallText = Math.floor(amount).toString();
      if (1 == isNegative) {
        smallText = "-" + smallText;
      }
      return smallText;
    }
    for (var result = "", digits = Math.floor(amount).toString(), groupEnd = digits.length; groupEnd >= 0; groupEnd -= 3) {
      if (groupEnd - 3 <= 0) {
        result = digits.slice(0, groupEnd) + result;
        break;
      }
      result = "." + digits.slice(groupEnd - 3, groupEnd) + result;
    }
    if (1 == isNegative) {
      result = "-" + result;
    }
    return result;
  };
  StringUtil.formatMoneyNumberWithColom = function(amount) {
    var isNegative = false;
    if (amount < 0 && (amount *= -1, isNegative = true), amount < 1e3) {
      var smallText = Math.floor(amount).toString();
      if (1 == isNegative) {
        smallText = "-" + smallText;
      }
      return smallText;
    }
    for (var result = "", digits = Math.floor(amount).toString(), groupEnd = digits.length; groupEnd >= 0; groupEnd -= 3) {
      if (groupEnd - 3 <= 0) {
        result = digits.slice(0, groupEnd) + result;
        break;
      }
      result = "," + digits.slice(groupEnd - 3, groupEnd) + result;
    }
    if (1 == isNegative) {
      result = "-" + result;
    }
    return result;
  };
  StringUtil.formatMoneyNumberWithColomNoFloor = function(amount, decimalsUnused) {
    if (void 0 === decimalsUnused) {
      decimalsUnused = 1;
    }
    var parts = amount.toString().split("."),
      intPart = parts[0],
      fracPart = parts[1],
      isNegative = false;
    if (amount < 0 && (amount *= -1, isNegative = true), amount < 1e3) {
      var smallText = intPart;
      if (1 == isNegative) {
        smallText = "-" + smallText;
      }
      return fracPart ? smallText + "." + fracPart.charAt(0) : smallText;
    }
    for (var result = "", digits = intPart, groupEnd = digits.length; groupEnd >= 0; groupEnd -= 3) {
      if (groupEnd - 3 <= 0) {
        result = digits.slice(0, groupEnd) + result;
        break;
      }
      result = "," + digits.slice(groupEnd - 3, groupEnd) + result;
    }
    if (1 == isNegative) {
      result = "-" + result;
    }
    return fracPart ? result + "." + fracPart.charAt(0) : result;
  };
  StringUtil.formatNumber = function(value) {
    return value.toLocaleString();
  };
  StringUtil.getRandomInt = function(maxExclusive) {
    return Math.floor(Math.random() * Math.floor(maxExclusive));
  };
  StringUtil.getRandomArbitrary = function(min, max) {
    return Math.random() * (max - min) + min;
  };
  StringUtil.checkVec2Equal = function(vecA, vecB) {
    return vecA.x === vecB.x && vecA.y === vecB.y;
  };
  StringUtil.isNullOrEmpty = function(text) {
    return void 0 === text || "undefined" === text || null === text || "null" === text || "" === text || 0 === text.length;
  };
  StringUtil.getQueryStringValue = function(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g,
      "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  };
  StringUtil.filterTenDangNhap = function(userName) {
    return userName.replace(/[^A-Za-z0-9]/g, "");
  };
  StringUtil.removeSpaceBeforeAndLast = function(text) {
    if (!this.isNullOrEmpty(text)) {
      text = (text = text.replace(/^\s+/, "")).replace(/\s+$/, "");
    }
    return text;
  };
  StringUtil.isContainSpecialCharacter = function(text) {
    return text.search(
      /[\xc0\xc1\xc2\xc3\xc8\xc9\xca\xcc\xcd\xd2\xd3\xd4\xd5\xd9\xda\xdd\xe0\xe1\xe2\xe3\xe8\xe9\xea\xec\xed\xf2\xf3\xf4\xf5\xf9\xfa\xfd\u1ef2\u1ef8\u1ef3\u1ef9\u1ef6\u1ef7\u1ef4\u1ef5\u1ef1\u1ef0\u1eed\u1eec\u1eef\u1eee\u1eeb\u1eea\u1ee9\u1ee8\u01b0\u01af\u1ee5\u1ee4\u1ee7\u1ee6\u0169\u0168\u1ee3\u1ee2\u1edf\u1ede\u1ee1\u1ee0\u1edd\u1edc\u1edb\u1eda\u01a1\u01a0\u1ed9\u1ed8\u1ed5\u1ed4\u1ed7\u1ed6\u1ed3\u1ed2\u1ed1\u1ed0\u1ecd\u1ecc\u1ecf\u1ece\u1ecb\u1eca\u1ec9\u1ec8\u0129\u0128\u1ec7\u1ec6\u1ec3\u1ec2\u1ec5\u1ec4\u1ec1\u1ec0\u1ebf\u1ebe\u1eb9\u1eb8\u1ebb\u1eba\u1ebd\u1ebc\u1eb7\u1eb6\u1eb3\u1eb2\u1eb5\u1eb4\u1eb1\u1eb0\u1eaf\u1eae\u0103\u0102\u1ead\u1eac\u1ea9\u1ea8\u1eab\u1eaa\u1ea7\u1ea6\u1ea5\u1ea4\u1ea1\u1ea0\u1ea3\u1ea2\u0111\u0110 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g
      ) >= 0;
  };
  StringUtil.isContainSpecialCharacterNoSpace = function(text) {
    return text.search(
      /[\xc0\xc1\xc2\xc3\xc8\xc9\xca\xcc\xcd\xd2\xd3\xd4\xd5\xd9\xda\xdd\xe0\xe1\xe2\xe3\xe8\xe9\xea\xec\xed\xf2\xf3\xf4\xf5\xf9\xfa\xfd\u1ef2\u1ef8\u1ef3\u1ef9\u1ef6\u1ef7\u1ef4\u1ef5\u1ef1\u1ef0\u1eed\u1eec\u1eef\u1eee\u1eeb\u1eea\u1ee9\u1ee8\u01b0\u01af\u1ee5\u1ee4\u1ee7\u1ee6\u0169\u0168\u1ee3\u1ee2\u1edf\u1ede\u1ee1\u1ee0\u1edd\u1edc\u1edb\u1eda\u01a1\u01a0\u1ed9\u1ed8\u1ed5\u1ed4\u1ed7\u1ed6\u1ed3\u1ed2\u1ed1\u1ed0\u1ecd\u1ecc\u1ecf\u1ece\u1ecb\u1eca\u1ec9\u1ec8\u0129\u0128\u1ec7\u1ec6\u1ec3\u1ec2\u1ec5\u1ec4\u1ec1\u1ec0\u1ebf\u1ebe\u1eb9\u1eb8\u1ebb\u1eba\u1ebd\u1ebc\u1eb7\u1eb6\u1eb3\u1eb2\u1eb5\u1eb4\u1eb1\u1eb0\u1eaf\u1eae\u0103\u0102\u1ead\u1eac\u1ea9\u1ea8\u1eab\u1eaa\u1ea7\u1ea6\u1ea5\u1ea4\u1ea1\u1ea0\u1ea3\u1ea2\u0111\u0110!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g
      ) >= 0;
  };
  StringUtil.isContainSpecialCharacterNumberNoSpace = function(text) {
    return text.search(
      /[0123456789\xc0\xc1\xc2\xc3\xc8\xc9\xca\xcc\xcd\xd2\xd3\xd4\xd5\xd9\xda\xdd\xe0\xe1\xe2\xe3\xe8\xe9\xea\xec\xed\xf2\xf3\xf4\xf5\xf9\xfa\xfd\u1ef2\u1ef8\u1ef3\u1ef9\u1ef6\u1ef7\u1ef4\u1ef5\u1ef1\u1ef0\u1eed\u1eec\u1eef\u1eee\u1eeb\u1eea\u1ee9\u1ee8\u01b0\u01af\u1ee5\u1ee4\u1ee7\u1ee6\u0169\u0168\u1ee3\u1ee2\u1edf\u1ede\u1ee1\u1ee0\u1edd\u1edc\u1edb\u1eda\u01a1\u01a0\u1ed9\u1ed8\u1ed5\u1ed4\u1ed7\u1ed6\u1ed3\u1ed2\u1ed1\u1ed0\u1ecd\u1ecc\u1ecf\u1ece\u1ecb\u1eca\u1ec9\u1ec8\u0129\u0128\u1ec7\u1ec6\u1ec3\u1ec2\u1ec5\u1ec4\u1ec1\u1ec0\u1ebf\u1ebe\u1eb9\u1eb8\u1ebb\u1eba\u1ebd\u1ebc\u1eb7\u1eb6\u1eb3\u1eb2\u1eb5\u1eb4\u1eb1\u1eb0\u1eaf\u1eae\u0103\u0102\u1ead\u1eac\u1ea9\u1ea8\u1eab\u1eaa\u1ea7\u1ea6\u1ea5\u1ea4\u1ea1\u1ea0\u1ea3\u1ea2\u0111\u0110!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g
      ) >= 0;
  };
  StringUtil.removeSpecialCharacter = function(text, keepSpace) {
    if (void 0 === keepSpace) {
      keepSpace = true;
    }
    return keepSpace ? text.replace(
      /[^A-Za-z0-9\xc0\xc1\xc2\xc3\xc8\xc9\xca\xcc\xcd\xd2\xd3\xd4\xd5\xd9\xda\xdd\xe0\xe1\xe2\xe3\xe8\xe9\xea\xec\xed\xf2\xf3\xf4\xf5\xf9\xfa\xfd\u1ef2\u1ef8\u1ef3\u1ef9\u1ef6\u1ef7\u1ef4\u1ef5\u1ef1\u1ef0\u1eed\u1eec\u1eef\u1eee\u1eeb\u1eea\u1ee9\u1ee8\u01b0\u01af\u1ee5\u1ee4\u1ee7\u1ee6\u0169\u0168\u1ee3\u1ee2\u1edf\u1ede\u1ee1\u1ee0\u1edd\u1edc\u1edb\u1eda\u01a1\u01a0\u1ed9\u1ed8\u1ed5\u1ed4\u1ed7\u1ed6\u1ed3\u1ed2\u1ed1\u1ed0\u1ecd\u1ecc\u1ecf\u1ece\u1ecb\u1eca\u1ec9\u1ec8\u0129\u0128\u1ec7\u1ec6\u1ec3\u1ec2\u1ec5\u1ec4\u1ec1\u1ec0\u1ebf\u1ebe\u1eb9\u1eb8\u1ebb\u1eba\u1ebd\u1ebc\u1eb7\u1eb6\u1eb3\u1eb2\u1eb5\u1eb4\u1eb1\u1eb0\u1eaf\u1eae\u0103\u0102\u1ead\u1eac\u1ea9\u1ea8\u1eab\u1eaa\u1ea7\u1ea6\u1ea5\u1ea4\u1ea1\u1ea0\u1ea3\u1ea2\u0111\u0110 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g,
      "") : text.replace(
      /[^A-Za-z0-9\xc0\xc1\xc2\xc3\xc8\xc9\xca\xcc\xcd\xd2\xd3\xd4\xd5\xd9\xda\xdd\xe0\xe1\xe2\xe3\xe8\xe9\xea\xec\xed\xf2\xf3\xf4\xf5\xf9\xfa\xfd\u1ef2\u1ef8\u1ef3\u1ef9\u1ef6\u1ef7\u1ef4\u1ef5\u1ef1\u1ef0\u1eed\u1eec\u1eef\u1eee\u1eeb\u1eea\u1ee9\u1ee8\u01b0\u01af\u1ee5\u1ee4\u1ee7\u1ee6\u0169\u0168\u1ee3\u1ee2\u1edf\u1ede\u1ee1\u1ee0\u1edd\u1edc\u1edb\u1eda\u01a1\u01a0\u1ed9\u1ed8\u1ed5\u1ed4\u1ed7\u1ed6\u1ed3\u1ed2\u1ed1\u1ed0\u1ecd\u1ecc\u1ecf\u1ece\u1ecb\u1eca\u1ec9\u1ec8\u0129\u0128\u1ec7\u1ec6\u1ec3\u1ec2\u1ec5\u1ec4\u1ec1\u1ec0\u1ebf\u1ebe\u1eb9\u1eb8\u1ebb\u1eba\u1ebd\u1ebc\u1eb7\u1eb6\u1eb3\u1eb2\u1eb5\u1eb4\u1eb1\u1eb0\u1eaf\u1eae\u0103\u0102\u1ead\u1eac\u1ea9\u1ea8\u1eab\u1eaa\u1ea7\u1ea6\u1ea5\u1ea4\u1ea1\u1ea0\u1ea3\u1ea2\u0111\u0110!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g,
      "");
  };
  StringUtil.removeSpecialCharacterCustom = function(text, keepSpace) {
    if (void 0 === keepSpace) {
      keepSpace = true;
    }
    return keepSpace ? text.replace(/[^a-zA-Z* ]/g, "") : text.replace(/[^a-zA-Z*]/g, "");
  };
  StringUtil.removeAllCharacterWithoutNumber = function(text) {
    return text.replace(/[^0-9]/g, "");
  };
  StringUtil.filterForDisplayName = function(displayName) {
    return displayName.replace(
      /[^A-Za-z0-9 \xc0\xc1\xc2\xc3\xc8\xc9\xca\xcc\xcd\xd2\xd3\xd4\xd5\xd9\xda\xdd\xe0\xe1\xe2\xe3\xe8\xe9\xea\xec\xed\xf2\xf3\xf4\xf5\xf9\xfa\xfd\u1ef2\u1ef8\u1ef3\u1ef9\u1ef6\u1ef7\u1ef4\u1ef5\u1ef1\u1ef0\u1eed\u1eec\u1eef\u1eee\u1eeb\u1eea\u1ee9\u1ee8\u01b0\u01af\u1ee5\u1ee4\u1ee7\u1ee6\u0169\u0168\u1ee3\u1ee2\u1edf\u1ede\u1ee1\u1ee0\u1edd\u1edc\u1edb\u1eda\u01a1\u01a0\u1ed9\u1ed8\u1ed5\u1ed4\u1ed7\u1ed6\u1ed3\u1ed2\u1ed1\u1ed0\u1ecd\u1ecc\u1ecf\u1ece\u1ecb\u1eca\u1ec9\u1ec8\u0129\u0128\u1ec7\u1ec6\u1ec3\u1ec2\u1ec5\u1ec4\u1ec1\u1ec0\u1ebf\u1ebe\u1eb9\u1eb8\u1ebb\u1eba\u1ebd\u1ebc\u1eb7\u1eb6\u1eb3\u1eb2\u1eb5\u1eb4\u1eb1\u1eb0\u1eaf\u1eae\u0103\u0102\u1ead\u1eac\u1ea9\u1ea8\u1eab\u1eaa\u1ea7\u1ea6\u1ea5\u1ea4\u1ea1\u1ea0\u1ea3\u1ea2\u0111\u0110]/g,
      "");
  };
  StringUtil.filterNumber = function(text) {
    return text.replace(/[.]/g, "");
  };
  StringUtil.getNumBer = function(text) {
    for (; text.indexOf(".") >= 0;) {
      text = text.replace(".", "");
    }
    return parseInt(text);
  };
  StringUtil.getStringofNumBer = function(value) {
    return value <= 9 ? "0" + value : value.toString();
  };
  StringUtil.ParseIntBanPhimMobile = function(text, takeIntegerPart) {
    if (void 0 === takeIntegerPart) {
      takeIntegerPart = false;
    }
    var result = 0;
    if (cc.sys.platform === cc.sys.MOBILE_BROWSER || cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
      result = parseInt(text);
    } else {
      result = parseInt(text.replace(".", ""));
      if (text.indexOf(".") >= 0 && takeIntegerPart) {
        result = parseInt(text.split(".")[0]);
      }
    }
    return result;
  };
  StringUtil.removeComma = function(text) {
    var result = text.replace(/,/g, "");
    if (!(void 0 != result && null != result)) {
      result = "";
    }
    return result;
  };
  StringUtil.removeDot = function(text) {
    return text.split(".").join("");
  };
  StringUtil.filterNumber2 = function(text) {
    return text.replace(/[^0-9]/g, "");
  };
  StringUtil.filterAlphabet = function(text) {
    return text.replace(/[^A-Za-z0-9]/g, "");
  };
  StringUtil.formatMoneyNumberWithColomAndDot = function(amountText) {
    if (Number(amountText) >= 1e3) {
      var parts = amountText.split("."),
        formatted = "",
        intValue = Number(parts[0]);
      if (intValue >= 1e3) {
        formatted = StringUtil.formatMoneyNumberWithColom(intValue);
      }
      amountText = formatted;
      if (void 0 != parts[1]) {
        amountText += "." + parts[1];
      }
    }
    return amountText;
  };
  StringUtil.formatLongName = function(name, maxLength) {
    if (void 0 === maxLength) {
      maxLength = 8;
    }
    return name.length <= maxLength ? name : name.substring(0, maxLength) + "...";
  };
  StringUtil.replacePlaceholders = function(template) {
    for (var args = [], argIndex = 1; argIndex < arguments.length; argIndex++) {
      args[argIndex - 1] = arguments[argIndex];
    }
    return template.replace(/{(\d+)}/g, function(match, index) {
      var value = args[index];
      return void 0 !== value ? value.toString() : match;
    });
  };
  StringUtil.formatMoneyNumberDecimal = function(amount, decimals) {
    if (void 0 === decimals) {
      decimals = 2;
    }
    return this.toFixed(amount, decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  StringUtil.toFixed = function(value, decimals) {
    if (void 0 === value || null === value) {
      return "0.00";
    }
    var text = value.toString();
    return text.indexOf(".") < 0 ? text + "." + "0".repeat(decimals) : text.split(".")[0] + "." + (text.split(".")[1] || "").slice(0, decimals).padEnd(decimals, "0");
  };
  StringUtil.cleanAccents = function(text) {
    return text = (text = (text = (text = (text = (text = (text = (text = (text = (text = (text = (text = (text = (text = (text = (text = text.replace(
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
  return StringUtil;
}();
moduleExports.default = StringUtil;
void 0;
