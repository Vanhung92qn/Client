var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
var n = this && this.__extends || function() {
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
  o = this && this.__decorate || function(t, e, i, n) {
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
Object.defineProperty(i, "__esModule", {
  value: true
});
var a = t("./StringUtil"),
  s = t("./GamePlayManager"),
  r = cc._decorator,
  c = r.ccclass,
  l = r.property,
  h = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.textureDefault = null;
      e.spriteSpriteAtlasDefaul = null;
      return e;
    }
    n(e, t);
    e.prototype.start = function() {
      if (null !== this.spriteFrame && void 0 !== this.spriteFrame) {
        this.textureDefault = this.spriteFrame.getTexture();
      }
    };
    e.prototype.isDownloaded = function() {
      return this._isDownloaded;
    };
    e.prototype.setIsDownloaded = function(t) {
      this._isDownloaded = t;
      if (!this._isDownloaded) {
        this.TextureCacheKey = "";
      }
    };
    e.prototype.initWithUrl = function(t) {
      this.DownloadUrl = t;
      this.textureDefault;
    };
    e.prototype.startDownloading = function(t) {
      if (!(null !== this.TextureCacheKey && void 0 !== this.TextureCacheKey && 0 !== this.TextureCacheKey.length)) {
        this.TextureCacheKey = this.DownloadUrl;
      }
      if (t) {
        this._isDownloaded = false;
        this.initWithUrl(this.DownloadUrl);
      }
      var e = this;
      if (this.DownloadUrl.indexOf("http") >= 0) {
        cc.loader.load({
          url: this.DownloadUrl,
          type: "png"
        }, function(t, i) {
          if (!(null !== t && void 0 !== t)) {
            e.onSpriteFinishDownloading(i);
          }
        });
      } else if (null !== this.spriteSpriteAtlasDefaul && void 0 !== this.spriteSpriteAtlasDefaul) {
        var i = this.spriteSpriteAtlasDefaul.getSpriteFrame(this.DownloadUrl);
        if (null !== i && void 0 !== i) {
          this.spriteFrame = i;
        }
      }
    };
    e.prototype.onSpriteFinishDownloading = function(t) {
      if (t) {
        this.spriteFrame = new cc.SpriteFrame(t);
      }
    };
    e.prototype.loadUserAvarta = function() {
      if (!cc.sys.isNative) {
        window.location.hostname.indexOf("localhost");
      }
      if (!a.default.isNullOrEmpty(s.default.getInstance().avaURL)) {
        this.DownloadUrl = s.default.getInstance().avaURL;
        this.startDownloading(true);
      }
    };
    e.prototype.loadImage = function(t) {
      if (!cc.sys.isNative) {
        window.location.hostname.indexOf("localhost");
      }
      if (!a.default.isNullOrEmpty(t)) {
        this.DownloadUrl = t;
        this.startDownloading(true);
      }
    };
    o([l(cc.SpriteAtlas)], e.prototype, "spriteSpriteAtlasDefaul", void 0);
    return e = o([c], e);
  }(cc.Sprite);
i.default = h;
void 0;
