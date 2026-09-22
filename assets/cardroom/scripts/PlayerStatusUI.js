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
var GameDefine = require("GameDefine"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  PlayerStatusUI = function(_super) {
    function PlayerStatusUI() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.listStringText = ["\xdap", "Theo", "Xem", "T\u1ed1", "T\u1ea5t tay"];
      _this.spriteBackground = null;
      _this.label = null;
      return _this;
    }
    __extends(PlayerStatusUI, _super);
    PlayerStatusUI.prototype.start = function() {};
    PlayerStatusUI.prototype.setLiengStatus = function(playState) {
      if (!(playState - 1 >= this.listStringText.length)) {
        if (!(playState != GameDefine.ELiengPlayState.CHECK && playState != GameDefine.ELiengPlayState.CALL)) {
          3;
        }
        this.label.node.active = true;
        this.label.string = this.listStringText[playState - 1];
        this.show();
      }
    };
    PlayerStatusUI.prototype.setBaCayStatus = function(playState) {
      if (!(playState - 1 >= this.listStringText.length)) {
        if (!(playState != GameDefine.EBaCayPlayState.CHECK && playState != GameDefine.EBaCayPlayState.CALL)) {
          3;
        }
        this.label.node.active = true;
        this.label.string = this.listStringText[playState - 1];
        this.show();
      }
    };
    PlayerStatusUI.prototype.setPhomStatus = function(playerStatus, hideDelay) {
      if (void 0 === hideDelay) {
        hideDelay = 3;
      }
      var statusText = "";
      switch (playerStatus) {
        case GameDefine.EPhomPlayerStatus.MOM:
          statusText = "M\xf3m";
          break;
        case GameDefine.EPhomPlayerStatus.U:
          statusText = "\xd9";
          break;
        case GameDefine.EPhomPlayerStatus.AN_CHOT:
          statusText = "\u0102n ch\u1ed1t";
          break;
        default:
        case GameDefine.EPhomPlayerStatus.NONE:
          return void this.hide();
      }
      this.label.node.active = true;
      this.label.string = statusText;
      this.show();
      if (hideDelay > 0) {
        this.node.runAction(cc.sequence(cc.delayTime(hideDelay), cc.callFunc(function() {
          this.hide();
        }.bind(this))));
      }
    };
    PlayerStatusUI.prototype.show = function() {
      this.node.active = true;
    };
    PlayerStatusUI.prototype.hide = function() {
      this.node.active = false;
    };
    PlayerStatusUI.prototype.flipBackground = function(isFlipped) {
      this.spriteBackground.node.scaleX = isFlipped ? -1 : 1;
    };
    __decorate([property(cc.Sprite)], PlayerStatusUI.prototype, "spriteBackground", void 0);
    __decorate([property(cc.Label)], PlayerStatusUI.prototype, "label", void 0);
    return PlayerStatusUI = __decorate([ccclass], PlayerStatusUI);
  }(cc.Component);
moduleExports.default = PlayerStatusUI;
void 0;
