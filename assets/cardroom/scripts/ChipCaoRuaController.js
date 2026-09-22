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
var ChipCaoRua = require("ChipCaoRua"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  ChipCaoRuaController = function(_super) {
    function ChipCaoRuaController() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.chipParent = null;
      _this.positionChipOnTable = null;
      _this.listPrefabChip = [];
      _this.listPosUser = [];
      _this.listChip = [];
      _this.listChipOnTable = [];
      _this.contendSizeChipOnTable = cc.v2(350, 130);
      return _this;
    }
    __extends(ChipCaoRuaController, _super);
    ChipCaoRuaController.prototype.start = function() {
      this.createChipDefault();
    };
    ChipCaoRuaController.prototype.ClearAllChipInTable = function() {
      for (var index = 0; index < this.listChipOnTable.length; index++) {
        this.listChipOnTable[index].node.stopAllActions();
        this.listChipOnTable[index].node.active = false;
      }
      if (this.listChipOnTable = [], this.chipParent.childrenCount > 0) {
        var childNodes = this.chipParent.children;
        for (index = 0; index < childNodes.length; index++) {
          childNodes[index].stopAllActions();
          childNodes[index].active = false;
        }
      }
    };
    ChipCaoRuaController.prototype.setListPositionOfUser = function(userPositions) {
      this.listPosUser = userPositions;
    };
    ChipCaoRuaController.prototype.BetForAllUser = function(players, betAmount) {
      for (var chipPrices = this.getListPriceWithPrice(betAmount), playerIndex = 0; playerIndex < players.length; playerIndex++) {
        for (var chipIndex = 0; chipIndex < chipPrices.length; chipIndex++) {
          var delay = .4 * Math.random();
          this.betForUser(players[playerIndex].node.position, delay, chipPrices[chipIndex]);
        }
      }
    };
    ChipCaoRuaController.prototype.BetForUserReconect = function(userCount, betAmount) {
      for (var chipPrices = this.getListPriceWithPrice(betAmount), userIndex = 0; userIndex < userCount; userIndex++) {
        for (var chipIndex = 0; chipIndex < chipPrices.length; chipIndex++) {
          this.betForUserReconnect(chipPrices[chipIndex]);
        }
      }
    };
    ChipCaoRuaController.prototype.GetChipForUser = function() {
      this.getChipForUser();
    };
    ChipCaoRuaController.prototype.createChipDefault = function() {
      for (var index = 0; index < 10; index++) {
        var chip = this.createNewChip(1e3);
        this.listChip.push(chip);
      }
    };
    ChipCaoRuaController.prototype.getIndexChipOnPool = function(price) {
      for (var index = 0; index < this.listChip.length; index++) {
        if (null != this.listChip[index].node && void 0 != this.listChip[index].node && 0 == this.listChip[index].node.active && this.listChip[index]
          .GetPrice() == price) {
          return index;
        }
      }
      return -1;
    };
    ChipCaoRuaController.prototype.createNewChip = function(price) {
      var prefabIndex = this.getIndexChipInListWithPrice(price),
        chip = cc.instantiate(this.listPrefabChip[prefabIndex]).getComponent(ChipCaoRua.default);
      chip.node.active = false;
      chip.node.parent = this.chipParent;
      chip.node.position = cc.v2(0, 0);
      chip.SetPrice(price);
      return chip;
    };
    ChipCaoRuaController.prototype.sortToStack = function() {
      for (var offsetY = 0, index = 0; index < this.listChipOnTable.length; index++) {
        this.listChipOnTable[index].node.stopAllActions();
        this.listChipOnTable[index].node.runAction(cc.moveTo(.15, cc.v2(this.positionChipOnTable.position.x, this.positionChipOnTable.position
          .y + offsetY)));
        offsetY += 5;
      }
    };
    ChipCaoRuaController.prototype.betForUser = function(fromPosition, delay, price) {
      if (void 0 === delay) {
        delay = 0;
      }
      var poolIndex = this.getIndexChipOnPool(price),
        chip = null;
      if (poolIndex < 0 || void 0 == poolIndex || null == poolIndex) {
        chip = this.createNewChip(price);
        this.listChip.push(chip);
      } else {
        chip = this.listChip[poolIndex];
      }
      chip.node.position = fromPosition;
      chip.node.active = true;
      chip.node.stopAllActions();
      chip.node.runAction(cc.sequence(cc.delayTime(delay), cc.moveTo(.7, cc.v2(this.positionChipOnTable.position.x + Math.random() * this
        .contendSizeChipOnTable.x - this.contendSizeChipOnTable.x / 2, this.positionChipOnTable.position.y + Math.random() * this
        .contendSizeChipOnTable.y)).easing(cc.easeExponentialOut()), cc.callFunc(function() {})));
      this.listChipOnTable.push(chip);
    };
    ChipCaoRuaController.prototype.betForUserReconnect = function(price) {
      var poolIndex = this.getIndexChipOnPool(price),
        chip = null;
      if (poolIndex < 0 || void 0 == poolIndex || null == poolIndex) {
        chip = this.createNewChip(price);
        this.listChip.push(chip);
      } else {
        chip = this.listChip[poolIndex];
      }
      chip.node.position = cc.v2(this.positionChipOnTable.position.x + 250 * Math.random() - 125, this.positionChipOnTable.position.y + 110 *
        Math.random());
      chip.node.active = true;
      this.listChipOnTable.push(chip);
    };
    ChipCaoRuaController.prototype.getChipForUser = function(delay) {
      var _this = this;
      if (void 0 === delay) {
        delay = .6;
      }
      var userPosIndex = 0;
      if (this.listChipOnTable.length > 25) {
        delay = .2;
      }
      for (var moveChipToUser = function(chipIndex) {
          _this.listChipOnTable[chipIndex].node.stopAllActions();
          _this.listChipOnTable[chipIndex].node.runAction(cc.sequence(cc.delayTime(delay), cc.moveTo(.7, _this.listPosUser[userPosIndex]).easing(cc
          .easeCubicActionIn()), cc.callFunc(function() {
            _this.listChipOnTable[chipIndex].node.active = false;
            if (0 == chipIndex) {
              _this.ClearAllChipInTable();
            }
          })));
          if (++userPosIndex >= _this.listPosUser.length) {
            userPosIndex = 0;
          }
          if (_this.listChipOnTable.length < 25) {
            delay += .05;
          } else {
            delay += .01;
          }
        }, chipIndex = this.listChipOnTable.length - 1; chipIndex >= 0; chipIndex--) {
        moveChipToUser(chipIndex);
      }
    };
    ChipCaoRuaController.prototype.getListPriceWithPrice = function(betAmount) {
      var chipPrices = [];
      if (100 == betAmount) {
        chipPrices.push(100);
      } else {
        if (500 == betAmount) {
          chipPrices.push(500);
        } else {
          if (1e3 == betAmount) {
            chipPrices.push(500);
            chipPrices.push(500);
          } else {
            if (2e3 == betAmount) {
              chipPrices.push(100);
              chipPrices.push(500);
              chipPrices.push(500);
            } else {
              if (5e3 == betAmount) {
                chipPrices.push(500);
                chipPrices.push(500);
                chipPrices.push(500);
                chipPrices.push(500);
                chipPrices.push(500);
              } else {
                if (1e4 == betAmount) {
                  chipPrices.push(5e3);
                  chipPrices.push(1e3);
                  chipPrices.push(1e3);
                  chipPrices.push(1e3);
                  chipPrices.push(1e3);
                  chipPrices.push(1e3);
                } else {
                  if (2e4 == betAmount) {
                    chipPrices.push(1e4);
                    chipPrices.push(5e3);
                    chipPrices.push(1e3);
                    chipPrices.push(1e3);
                    chipPrices.push(1e3);
                    chipPrices.push(1e3);
                    chipPrices.push(1e3);
                  } else {
                    if (5e4 == betAmount) {
                      chipPrices.push(1e4);
                      chipPrices.push(1e4);
                      chipPrices.push(1e4);
                      chipPrices.push(5e3);
                      chipPrices.push(5e3);
                      chipPrices.push(5e3);
                      chipPrices.push(5e3);
                    }
                  }
                }
              }
            }
          }
        }
      }
      return chipPrices;
    };
    ChipCaoRuaController.prototype.getIndexChipInListWithPrice = function(price) {
      return 100 == price ? 0 : 500 == price ? 1 : 1e3 == price ? 2 : 5e3 == price ? 3 : 1e4 == price ? 4 : 5e4 == price ? 5 : 1e5 == price ? 6 : 5e5 == price ? 7 :
        1e6 == price ? 8 : 0;
    };
    __decorate([property(cc.Node)], ChipCaoRuaController.prototype, "chipParent", void 0);
    __decorate([property(cc.Node)], ChipCaoRuaController.prototype, "positionChipOnTable", void 0);
    __decorate([property(cc.Prefab)], ChipCaoRuaController.prototype, "listPrefabChip", void 0);
    return ChipCaoRuaController = __decorate([ccclass], ChipCaoRuaController);
  }(cc.Component);
moduleExports.default = ChipCaoRuaController;
void 0;
