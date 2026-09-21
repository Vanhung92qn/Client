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
var StringUtil = require("./StringUtil"),
  GamePlayManager = require("./GamePlayManager"),
  _decorator = cc._decorator,
  ccclass = _decorator.ccclass,
  property = _decorator.property,
  RemoteSprite = function(_super) {
    function RemoteSprite() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.textureDefault = null;
      _this.spriteSpriteAtlasDefaul = null;
      return _this;
    }
    __extends(RemoteSprite, _super);
    RemoteSprite.prototype.start = function() {
      if (null !== this.spriteFrame && void 0 !== this.spriteFrame) {
        this.textureDefault = this.spriteFrame.getTexture();
      }
    };
    RemoteSprite.prototype.isDownloaded = function() {
      return this._isDownloaded;
    };
    RemoteSprite.prototype.setIsDownloaded = function(isDownloaded) {
      this._isDownloaded = isDownloaded;
      if (!this._isDownloaded) {
        this.TextureCacheKey = "";
      }
    };
    RemoteSprite.prototype.initWithUrl = function(url) {
      this.DownloadUrl = url;
      this.textureDefault;
    };
    RemoteSprite.prototype.startDownloading = function(forceReload) {
      if (!(null !== this.TextureCacheKey && void 0 !== this.TextureCacheKey && 0 !== this.TextureCacheKey.length)) {
        this.TextureCacheKey = this.DownloadUrl;
      }
      if (forceReload) {
        this._isDownloaded = false;
        this.initWithUrl(this.DownloadUrl);
      }
      var _this = this;
      if (this.DownloadUrl.indexOf("http") >= 0) {
        cc.loader.load({
          url: this.DownloadUrl,
          type: "png"
        }, function(err, texture) {
          if (!(null !== err && void 0 !== err)) {
            _this.onSpriteFinishDownloading(texture);
          }
        });
      } else if (null !== this.spriteSpriteAtlasDefaul && void 0 !== this.spriteSpriteAtlasDefaul) {
        var atlasSpriteFrame = this.spriteSpriteAtlasDefaul.getSpriteFrame(this.DownloadUrl);
        if (null !== atlasSpriteFrame && void 0 !== atlasSpriteFrame) {
          this.spriteFrame = atlasSpriteFrame;
        }
      }
    };
    RemoteSprite.prototype.onSpriteFinishDownloading = function(texture) {
      if (texture) {
        this.spriteFrame = new cc.SpriteFrame(texture);
      }
    };
    RemoteSprite.prototype.loadUserAvarta = function() {
      if (!cc.sys.isNative) {
        window.location.hostname.indexOf("localhost");
      }
      if (!StringUtil.default.isNullOrEmpty(GamePlayManager.default.getInstance().avaURL)) {
        this.DownloadUrl = GamePlayManager.default.getInstance().avaURL;
        this.startDownloading(true);
      }
    };
    RemoteSprite.prototype.loadImage = function(url) {
      if (!cc.sys.isNative) {
        window.location.hostname.indexOf("localhost");
      }
      if (!StringUtil.default.isNullOrEmpty(url)) {
        this.DownloadUrl = url;
        this.startDownloading(true);
      }
    };
    __decorate([property(cc.SpriteAtlas)], RemoteSprite.prototype, "spriteSpriteAtlasDefaul", void 0);
    return RemoteSprite = __decorate([ccclass], RemoteSprite);
  }(cc.Sprite);
moduleExports.default = RemoteSprite;
void 0;
