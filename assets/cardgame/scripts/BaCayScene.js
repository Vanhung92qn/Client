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
var BaCayController = require("./BaCayController"),
  GamePlayManager = require("./GamePlayManager"),
  MessageCardGameHandler = require("./MessageCardGameHandler"),
  MainGameViewModel = require("./MainGameViewModel"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  BaCayScene = function(_super) {
    function BaCayScene() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.prefabBaCayScene = null;
      _this.baCayController = null;
      return _this;
    }
    __extends(BaCayScene, _super);
    BaCayScene.prototype.onLoad = function() {
      GamePlayManager.default.getInstance().gameID = MessageCardGameHandler.GAME.BACAY;
      var sceneNode = cc.instantiate(this.prefabBaCayScene);
      sceneNode.parent = this.mainUiNode;
      this.baCayController = sceneNode.getComponent(BaCayController.default);
      this.baCayController.mainGameViewModel = this;
      this.mainGameController = this.baCayController;
      sceneNode.active = false;
      _super.prototype.onLoad.call(this);
    };
    __decorate([property(cc.Prefab)], BaCayScene.prototype, "prefabBaCayScene", void 0);
    return BaCayScene = __decorate([ccclass], BaCayScene);
  }(MainGameViewModel.default);
moduleExports.default = BaCayScene;
void 0;
