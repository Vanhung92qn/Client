// PhoenixGlowPulse - quang sang dung nham "tho" theo nhip + thi thoang BUNG manh.
// Dung cho anh thun.png (quang do co van lua) o day nui. Pack sunwin KHONG co asset tia set,
// nen "set" duoc thay bang nhip bung cua quang dung nham - dung ban chat anh, khong che ra thu khong co.
//
// Doi lap voi component cuon nen: quang nay VAN tho khi phuong dang dau (nui van song),
// chi khong troi ngang. Bien do/nhip chinh truc tiep o Inspector.

cc.Class({
    extends: cc.Component,

    properties: {
        baseOpacity: { default: 90, tooltip: 'do mo nen (luc tho nhe nhat)' },
        pulseOpacity: { default: 60, tooltip: 'bien do tho (cong them vao baseOpacity)' },
        pulseSpeed: { default: 0.9, tooltip: 'nhip tho - rad/giay' },
        baseScale: { default: 1, tooltip: 'ti le nen' },
        pulseScale: { default: 0.06, tooltip: 'bien do phong to khi tho' },

        // BUNG manh: thi thoang quang sang manh len roi tat dan (nhu dung nham trao).
        flareMinGap: { default: 4.5, tooltip: 'giay - khoang cach ngan nhat giua 2 lan bung' },
        flareMaxGap: { default: 11, tooltip: 'giay - khoang cach dai nhat' },
        flareOpacity: { default: 105, tooltip: 'do mo cong them luc bung' },
        flareUp: { default: 0.12, tooltip: 'giay - sang len' },
        flareDown: { default: 0.65, tooltip: 'giay - tat dan' },

        phase: { default: 0, tooltip: 'lech pha - dat khac nhau cho tung quang de khong tho dong loat' },
    },

    onLoad: function () {
        this._t = this.phase;
        this._flareT = 0;
        this._flareVal = 0;
        this._nextFlare = this._pickGap();
    },

    _pickGap: function () {
        return this.flareMinGap + Math.random() * Math.max(0, this.flareMaxGap - this.flareMinGap);
    },

    update: function (dt) {
        if (!dt) return;
        this._t += dt;

        // --- nhip bung ---
        this._flareT += dt;
        if (this._flareVal > 0) {
            // dang trong mot lan bung: sang len roi tat dan
            var up = this.flareUp > 0 ? this.flareUp : 0.01;
            var down = this.flareDown > 0 ? this.flareDown : 0.01;
            if (this._flareT <= up) {
                this._flareVal = this._flareT / up;
            } else if (this._flareT <= up + down) {
                this._flareVal = 1 - (this._flareT - up) / down;
            } else {
                this._flareVal = 0;
                this._flareT = 0;
                this._nextFlare = this._pickGap();
            }
        } else if (this._flareT >= this._nextFlare) {
            this._flareT = 0;
            this._flareVal = 0.0001;   // khac 0 de vao nhanh tren o tick sau
        }

        var s = Math.sin(this._t * this.pulseSpeed);
        var o = this.baseOpacity + this.pulseOpacity * (0.5 + 0.5 * s) + this.flareOpacity * this._flareVal;
        this.node.opacity = o < 0 ? 0 : (o > 255 ? 255 : o);

        var sc = this.baseScale + this.pulseScale * s + this.pulseScale * 1.5 * this._flareVal;
        this.node.scaleX = sc;
        this.node.scaleY = sc;
    },
});
