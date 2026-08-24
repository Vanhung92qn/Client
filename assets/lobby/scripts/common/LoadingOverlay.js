// ──────────────────────────────────────────────────────────────────
// LoadingOverlay.js — Lớp loading phủ toàn màn (che cú "khựng" khi login/vào game/thoát game).
//   cc.LoadingOverlay.show();             // KHÔNG biết % thật → trickle (ease) tiến dần tới ~99% rồi đợi nhẹ
//   cc.LoadingOverlay.show(true);         // CÓ % thật → dùng setProgress
//   cc.LoadingOverlay.setProgress(0.65);  // cập nhật % THẬT (0..1)
//   cc.LoadingOverlay.hide();             // QUÉT MƯỢT % hiện tại → 100% (không "vút") rồi fade ra
//   Luôn gọi an toàn null:  if (cc.LoadingOverlay) cc.LoadingOverlay.show();
//
//  Trước đây AUTO mode dùng ease-out hàm mũ:  _shown += (0.9 - _shown) * k * dt
//  → bước nhảy tỉ lệ khoảng cách còn lại → càng gần 0.9 càng CHẬM (chững ở ~80%), rồi hide() snap 100% ("vút").
//  Nay: rise = TỐC ĐỘ HẰNG SỐ (đều), và hide() quét mượt tới 100% thay vì nhảy.
// ──────────────────────────────────────────────────────────────────
cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: cc.ProgressBar,
        lbProgress: cc.Label,
        fadeTime: { default: 0.1 },      // fade vào/ra (giây) — nhỏ cho snappy
        endFillTime: { default: 0.12 },  // hide(): quét % hiện tại -> 100% (giây) — nhỏ cho nhanh
    },

    onLoad: function () {
        cc.LoadingOverlay = this;     // ref toàn cục
        this.node.active = false;
        this.node.opacity = 0;
        this._reset();
    },

    onDestroy: function () {
        if (cc.LoadingOverlay === this) cc.LoadingOverlay = null;
    },

    _reset: function () {
        this._showing = false;
        this._auto = false;    // true = tự bò (không có % thật)
        this._filling = false; // true = đang quét cuối tới 100% (sau khi hide)
        this._target = 0;      // % đích (chế độ thật)
        this._shown = 0;       // % đang vẽ
        this._fillFrom = 0;
        this._fillElapsed = 0;
    },

    // hasRealProgress=true (vào game): bám % thật từ setProgress.
    // bỏ trống/false (login, thoát game): trickle tiến dần tới ~99% rồi đợi nhẹ (vì JS KHÔNG biết thời gian thật).
    show: function (hasRealProgress) {
        this._reset();
        this._showing = true;
        this._auto = !hasRealProgress;
        this.node.active = true;
        this.node.zIndex = (cc.macro && cc.macro.MAX_ZINDEX) || 999999;          // luôn trên cùng
        if (this.node.parent) this.node.setSiblingIndex(this.node.parent.childrenCount - 1);
        this.node.stopAllActions();
        cc.tween(this.node).to(this.fadeTime, { opacity: 255 }).start();
        this._draw(0);
        // phao cứu sinh: tự ẩn sau 20s nếu flow nào đó quên gọi hide
        if (this._safetyT) clearTimeout(this._safetyT);
        var _self = this;
        this._safetyT = setTimeout(function () { console.warn('[LoadingOverlay] auto-hide 20s (flow quen hideBusy?)'); _self.hide(); }, 20000);
    },

    setProgress: function (p) {
        this._auto = false;
        p = Math.max(0, Math.min(1, p || 0));
        if (p > this._target) this._target = p;   // chỉ tiến, không lùi
    },

    hide: function () {
        if (this._safetyT) { clearTimeout(this._safetyT); this._safetyT = null; }
        if (!this._showing && !this._filling) return;
        this._showing = false;
        // BẮT ĐẦU quét mượt từ % hiện tại -> 100% (thay vì snap "vút"). Fade chạy sau khi quét xong.
        this._filling = true;
        this._fillFrom = this._shown;
        this._fillElapsed = 0;
    },

    _startFadeOut: function () {
        var self = this;
        this.node.stopAllActions();
        cc.tween(this.node)
            .delay(0.05)
            .to(this.fadeTime, { opacity: 0 })
            .call(function () { self.node.active = false; })
            .start();
    },

    _draw: function (p) {
        if (this.progressBar) this.progressBar.progress = p;
        if (this.lbProgress) this.lbProgress.string = Math.round(p * 100) + '%';
    },

    update: function (dt) {
        if (!this.node.active) return;

        // 1) Quét cuối (sau hide): % hiện tại -> 100% ĐỀU trong endFillTime, xong thì fade ra.
        if (this._filling) {
            this._fillElapsed += dt;
            var t = Math.min(this._fillElapsed / Math.max(this.endFillTime, 0.01), 1);
            this._shown = this._fillFrom + (1 - this._fillFrom) * t;
            this._draw(this._shown);
            if (t >= 1) {
                this._filling = false;
                this._startFadeOut();
            }
            return;
        }

        if (!this._showing) return;

        if (this._auto) {
            // [TRICKLE] KHÔNG biết thời gian thật -> EASE tiến dần tới ~0.99 (KHÔNG cap cứng ở 0.9).
            // Tiến nhanh lúc đầu, chậm dần; vùng bò chậm dồn lên 97-99% (trông "sắp xong") chứ KHÔNG
            // khựng cứng ở 90%. Login xong -> hide() quét mượt nốt lên 100%. (speed cao = đầu nhanh hơn.)
            var cap = 0.99, speed = 2.0;
            if (this._shown < cap) {
                this._shown += (cap - this._shown) * speed * dt;
                if (this._shown > cap) this._shown = cap;
                this._draw(this._shown);
            }
        } else {
            // CÓ % thật (vào game): bám % thật, tốc độ tối thiểu để vẫn nhúc nhích đều.
            if (this._shown < this._target) {
                this._shown += Math.max((this._target - this._shown) * 4 * dt, 0.5 * dt);
                if (this._shown > this._target) this._shown = this._target;
                this._draw(this._shown);
            }
        }
    },
});
