// PhoenixMountainPerch - nui (object_nui) TROI LEN cho phuong dau luc WAITING/BETTING,
// TROI XUONG khoi man hinh luc FLYING (phuong bay). Doc state qua PhoenixController.getCurrentState().
// Gan len node goc cua prefab PhoenixMountain. Dat node sao cho DINH nui nam duoi chan phuong (perch).
// upY = vi tri dat trong editor (dau); downY = upY - hideDistance (an duoi man).

cc.Class({
    extends: cc.Component,

    properties: {
        hideDistance: 520,   // px keo xuong khi bay
        riseDur: 0.6,
        fallDelay: 0.8,      // CHO phuong nhun chan tung len roi nui moi truot (khop sunwin: delay 0.8s)
        fallDur: 0.6,        // sunwin truot trong 0.6s (khong tut ngay)
        cloudNodes: { default: [], type: [cc.Node], tooltip: 'may quanh chan nui - fade khi bay + troi nhe' },
        // May TROI NHE NHANG (sin, khong dung tween -> khong dinh voi tween fade opacity)
        cloudDriftX: 16,        // bien do troi ngang (px)
        cloudDriftY: 5,         // bien do troi doc (px)
        cloudDriftSpeed: 0.5,   // toc do (rad/s)
    },

    onLoad: function () {
        this._upY = this.node.y;
        this._downY = this.node.y - this.hideDistance;
        this._ctrl = (typeof cc.PhoenixController !== 'undefined') ? cc.PhoenixController.getInstance() : null;
        this._lastPerch = null;
        // moc vi tri goc cua may de troi quanh do
        this._cloudT = 0;
        this._cloudBase = [];
        for (var i = 0; i < this.cloudNodes.length; i++) {
            var c = this.cloudNodes[i];
            this._cloudBase.push((c && c.isValid) ? cc.v2(c.x, c.y) : null);
        }
    },

    update: function (dt) {
        this._driftClouds(dt);
        if (!this._ctrl) return;
        var s = this._ctrl.getCurrentState();
        if (s == null) return;
        var perch = (s === cc.PhoenixState.WAITING || s === cc.PhoenixState.BETTING);
        if (this._lastPerch === perch) return;
        this._lastPerch = perch;
        this._go(perch);
    },

    // May troi nhe nhang quanh vi tri goc (sin, moi dam lech pha -> tu nhien nhu may that).
    _driftClouds: function (dt) {
        if (!this._cloudBase || !this._cloudBase.length) return;
        this._cloudT += (dt || 0);
        for (var i = 0; i < this.cloudNodes.length; i++) {
            var c = this.cloudNodes[i], b = this._cloudBase[i];
            if (!c || !c.isValid || !b) continue;
            var ph = i * 1.7;   // lech pha giua cac dam may
            c.x = b.x + Math.sin(this._cloudT * this.cloudDriftSpeed + ph) * (this.cloudDriftX + i * 5);
            c.y = b.y + Math.sin(this._cloudT * this.cloudDriftSpeed * 0.7 + ph) * this.cloudDriftY;
        }
    },

    _go: function (perch) {
        cc.Tween.stopAllByTarget(this.node);
        var delay = perch ? 0 : (this.fallDelay || 0);   // luc BAY: cho phuong nhun chan tung len roi nui moi truot
        var tw = cc.tween(this.node);
        if (delay > 0) tw = tw.delay(delay);
        tw.to(perch ? this.riseDur : this.fallDur, { y: perch ? this._upY : this._downY },
              { easing: perch ? 'sineOut' : 'sineIn' })
          .start();
        if (this.cloudNodes) {
            for (var i = 0; i < this.cloudNodes.length; i++) {
                var c = this.cloudNodes[i];
                if (c && c.isValid) {
                    cc.Tween.stopAllByTarget(c);
                    var ct = cc.tween(c);
                    if (delay > 0) ct = ct.delay(delay);   // may fade cung nhip voi nui
                    ct.to(0.4, { opacity: perch ? (c._perchOpacity || 180) : 0 }).start();
                }
            }
        }
    },
});
