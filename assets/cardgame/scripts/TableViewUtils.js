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
  TableCell = require("TableCell"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  TableViewUtils = function(_super) {
    function TableViewUtils() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.scrollView = null;
      _this.itemPrefab = null;
      _this.firstItemData = {};
      _this.lastItemData = {};
      _this.itemPosMap = {};
      _this.lastResetItemIndex = null;
      _this.orientation = OrientationManager.Orientation.Landscape;
      _this.listTableCell = [];
      return _this;
    }
    __extends(TableViewUtils, _super);
    TableViewUtils.prototype.init = function(dataList, e, i, n, playItemAnim) {
      if (void 0 === playItemAnim) {
        playItemAnim = false;
      }
      this.content = this.scrollView.content;
      for (var index = this.listTableCell.length; index < dataList.length; ++index) {
        var cellNode = cc.instantiate(this.itemPrefab);
        cellNode.parent = this.content;
        (cell = cellNode.getComponent(TableCell.default)).setIndex(index);
        this.listTableCell.push(cell);
      }
      for (index = 0; index < dataList.length; ++index) {
        if (!(cell = this.listTableCell[index]).node.active) {
          cell.node.active = true;
        }
        if (playItemAnim) {
          cell.node.stopAllActions();
          cell.node.runAction(cc.sequence(cc.scaleTo(.15, 1.05), cc.scaleTo(.15, 1)));
        }
        cell.initValue(dataList[index], this, this.orientation);
      }
      for (index = dataList.length; index < this.listTableCell.length; ++index) {
        var cell;
        (cell = this.listTableCell[index]).node.active = false;
      }
    };
    TableViewUtils.prototype.hideAllItems = function() {
      for (var index = 0; index < this.listTableCell.length; index++) {
        this.listTableCell[index].node.active = false;
      }
    };
    TableViewUtils.prototype.callback = function(t, e) {};
    __decorate([property(cc.ScrollView)], TableViewUtils.prototype, "scrollView", void 0);
    __decorate([property(cc.Prefab)], TableViewUtils.prototype, "itemPrefab", void 0);
    return TableViewUtils = __decorate([ccclass], TableViewUtils);
  }(cc.Component);
moduleExports.default = TableViewUtils;
void 0;
