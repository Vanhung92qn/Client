var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
var __extends = this && this.__extends || function() {
    var t = function(e, i) {
      return (t = Object.setPrototypeOf || {
          __proto__: []
        }
        instanceof Array && function(t, e) {
          t.__proto__ = e;
        } || function(t, e) {
          for (var i in e) {
            if (e.hasOwnProperty(i)) {
              t[i] = e[i];
            }
          }
        })(e, i);
    };
    return function(e, i) {
      function n() {
        this.constructor = e;
      }
      t(e, i);
      e.prototype = null === i ? Object.create(i) : (n.prototype = i.prototype, new n());
    };
  }(),
  __decorate = this && this.__decorate || function(t, e, i, n) {
    var o,
      a = arguments.length,
      s = a < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, i) : n;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) {
      s = Reflect.decorate(t, e, i, n);
    } else {
      for (var r = t.length - 1; r >= 0; r--) {
        if (o = t[r]) {
          s = (a < 3 ? o(s) : a > 3 ? o(e, i, s) : o(e, i)) || s;
        }
      }
    }
    if (a > 3 && s) {
      Object.defineProperty(e, i, s);
    }
    return s;
  };
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});
var OrientationManager = require("OrientationManager"),
  StringUtil = require("StringUtil"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  TableCell = (ccDecorator.property, function(_super) {
    function TableCell() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.tableViewUtils = null;
      _this.index = 0;
      return _this;
    }
    __extends(TableCell, _super);
    TableCell.prototype.initValue = function(data, tableViewUtils, orientation) {
      if (void 0 === orientation) {
        orientation = OrientationManager.Orientation.Landscape;
      }
      this.tableViewUtils = tableViewUtils;
      this.data = data;
    };
    TableCell.prototype.setIndex = function(index) {
      this.index = index;
    };
    TableCell.prototype.getNewValueGYB = function(rawValue) {
      if (StringUtil.default.isNullOrEmpty(rawValue)) {
        return "";
      }
      try {
        var parsed = JSON.parse(rawValue);
        if (parsed && !StringUtil.default.isNullOrEmpty(parsed.sm)) {
          return parsed.sm;
        }
      } catch (parseError) {}
      return rawValue;
    };
    return TableCell = __decorate([ccclass], TableCell);
  }(cc.Component));
moduleExports.default = TableCell;
void 0;
