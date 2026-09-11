// PhoenixFrameAnim - phat chuoi frame roi (lava/smoke/sparkle) tren cc.Sprite cung node.
// Load theo PATH tu bundle luc chay -> khong can gan 19/33 sprite-frame thu cong.
// Gan len 1 node CO cc.Sprite; set "folder" = duong dan thu muc frame trong bundle.
// Node hien trong editor (keo-tha/chinh vi tri), animation chay luc runtime.

cc.Class({
    extends: cc.Component,

    properties: {
        bundleName: 'phoenix',
        folder: '',          // vd: images/bg_sunphung/lava
        fps: 12,
    },

    onLoad: function () {
        this._frames = null;
        this._i = 0;
        this._t = 0;
        this._sprite = this.getComponent(cc.Sprite);
        if (!this._sprite) { cc.warn('[PhoenixFrameAnim] can cc.Sprite tren cung node'); return; }
        if (!this.folder) return;
        var bundle = cc.assetManager.getBundle(this.bundleName);
        if (!bundle) { cc.warn('[PhoenixFrameAnim] khong tim thay bundle ' + this.bundleName); return; }
        var self = this;
        bundle.loadDir(this.folder, cc.SpriteFrame, function (err, arr) {
            if (err || !arr || !arr.length) { cc.warn('[PhoenixFrameAnim] loadDir loi: ' + self.folder); return; }
            arr.sort(function (a, b) { return (a.name < b.name) ? -1 : (a.name > b.name ? 1 : 0); });
            self._frames = arr;
            self._sprite.spriteFrame = arr[0];
        });
    },

    update: function (dt) {
        if (!this._frames || this.fps <= 0) return;
        this._t += dt;
        var step = 1 / this.fps;
        if (this._t >= step) {
            this._t -= step;
            this._i = (this._i + 1) % this._frames.length;
            if (this._sprite.isValid) this._sprite.spriteFrame = this._frames[this._i];
        }
    },
});
