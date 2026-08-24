/**
 * HOA PHUNG (116) — pool am thanh, ke thua cc.AudioPool cua repo (KHONG clone AviatorSoundManager cua sunwin).
 *
 * Kien truc lay tu sunwin nhung dung ha tang san co:
 *   - 13 SFX gan THANG lam cc.AudioSource trong prefab (~0.6 MB) -> co ngay, khong doi tai.
 *   - 7 BGM (8.85 MB) NAP LAZY bang bundle.load khi thuc su can -> khong phinh man cho.
 *   - 3 KENH chong chong tieng (bat chuoc AviatorSoundManager.js:81-102):
 *       music  : phat BGM moi thi dung BGM cu
 *       sfx    : tieng ngan, phat chong len nhau duoc
 *       phuong : idle / cat canh / bay / chet — DANG PHAT CAI NAO thi bo qua neu goi lai chinh no
 *                (neu khong, setLine() chay moi beat se restart file 12s -> tieng canh dap bi cat khuc)
 */
(function () {
    cc.AudioPoolPhoenix = cc.Class({
        "extends": cc.AudioPool,

        properties: {
            // ==== 13 SFX (gan trong editor / da gan san bang script va prefab) ====
            sfxBet: cc.AudioSource,
            sfxIdle: cc.AudioSource,
            sfxTakeOff: cc.AudioSource,
            sfxFlying: cc.AudioSource,
            sfxHitStar: cc.AudioSource,
            sfxMeteorBypass: cc.AudioSource,
            sfxTakeProfit: cc.AudioSource,
            sfxDie: cc.AudioSource,
            sfxJackpot: cc.AudioSource,
            sfxJackpotOther: cc.AudioSource,
            sfxEgg: cc.AudioSource,
            sfxClick: cc.AudioSource,
            sfxWindUp: cc.AudioSource,

            // ==== BGM: 1 AudioSource DUNG CHUNG, clip nap lazy roi gan vao ====
            bgmSource: cc.AudioSource,

            bundleName: { default: 'phoenix', tooltip: 'bundle chua thu muc sounds_sp' },
            bgmFolder: { default: 'sounds_sp', tooltip: 'thu muc chua mp3 trong bundle' },
        },

        onLoad: function () {
            this._super();                 // dang ky voi cc.AudioController
            this._clipCache = {};
            this._curBgm = null;           // ten clip BGM dang phat
            this._curShip = null;          // kenh rieng cua phuong
        },

        // ---------- kenh phuong: dang phat chinh no thi BO QUA ----------
        _isShipChannel: function (t) {
            var T = cc.AudioTypes;
            return t === T.PHX_SFX_IDLE || t === T.PHX_SFX_TAKE_OFF
                || t === T.PHX_SFX_FLYING || t === T.PHX_SFX_DIE;
        },

        // ---------- BGM: nap lazy ----------
        // name: ten file khong duoi (vd 'aviator_bgm_1', 'aviator_bgm_fly_3')
        playBgm: function (name) {
            if (!this.bgmSource) return;
            if (this._curBgm === name && this.bgmSource.isPlaying) return;   // dang phat chinh no
            this._curBgm = name;

            var self = this;
            var apply = function (clip) {
                if (!self.bgmSource || !self.bgmSource.isValid) return;
                if (self._curBgm !== name) return;        // da doi bai trong luc dang tai
                self.bgmSource.stop();
                self.bgmSource.clip = clip;
                self.bgmSource.loop = true;
                if (cc.AudioController.getInstance().musicState) self.bgmSource.play();
            };

            if (this._clipCache[name]) { apply(this._clipCache[name]); return; }

            var path = this.bgmFolder + '/' + name;
            var bundle = cc.assetManager ? cc.assetManager.getBundle(this.bundleName) : null;
            var loader = bundle || cc.resources;
            if (!loader) return;
            loader.load(path, cc.AudioClip, function (err, clip) {
                if (err || !clip) { cc.warn('[PhoenixAudio] khong nap duoc BGM ' + path, err); return; }
                self._clipCache[name] = clip;
                apply(clip);
            });
        },

        // 6 bai nhac bay, chon theo n % 6 (khop sunwin getFlyingSoundNameByNumber)
        playFlyingBgm: function (n) {
            var i = ((n | 0) % 6 + 6) % 6;
            this.playBgm('aviator_bgm_fly_' + (i + 1));
        },

        playBettingBgm: function () {
            this.playBgm('aviator_bgm_1');
        },

        stopBgm: function () {
            this._curBgm = null;
            if (this.bgmSource) this.bgmSource.stop();
        },

        // ---------- ha tang chung cua repo ----------
        enableMusic: function (enable) {
            if (!this.bgmSource) return;
            if (enable) { if (!this.bgmSource.isPlaying && this.bgmSource.clip) this.bgmSource.play(); }
            else this.bgmSource.stop();
        },

        enableSound: function (enable) {
            var list = [this.sfxBet, this.sfxIdle, this.sfxTakeOff, this.sfxFlying, this.sfxHitStar,
            this.sfxMeteorBypass, this.sfxTakeProfit, this.sfxDie, this.sfxJackpot,
            this.sfxJackpotOther, this.sfxEgg, this.sfxClick, this.sfxWindUp];
            for (var i = 0; i < list.length; i++) if (list[i]) list[i].mute = !enable;
            // KHONG goi enableMusic o day: cong tac SFX va cong tac NHAC la 2 thu rieng.
            // (Sunwin dinh loi nay — onToggleSound cua ho chi doi volume cua BGM.)
        },

        getAudioClip: function (clipType) {
            var T = cc.AudioTypes;
            switch (clipType) {
                case T.PHX_SFX_BET: return this.sfxBet;
                case T.PHX_SFX_IDLE: return this.sfxIdle;
                case T.PHX_SFX_TAKE_OFF: return this.sfxTakeOff;
                case T.PHX_SFX_FLYING: return this.sfxFlying;
                case T.PHX_SFX_HIT_STAR: return this.sfxHitStar;
                case T.PHX_SFX_METEOR_BYPASS: return this.sfxMeteorBypass;
                case T.PHX_SFX_TAKE_PROFIT: return this.sfxTakeProfit;
                case T.PHX_SFX_DIE: return this.sfxDie;
                case T.PHX_SFX_JACKPOT: return this.sfxJackpot;
                case T.PHX_SFX_JACKPOT_OTHER: return this.sfxJackpotOther;
                case T.PHX_SFX_EGG: return this.sfxEgg;
                case T.PHX_SFX_CLICK: return this.sfxClick;
                case T.PHX_SFX_WIND_UP: return this.sfxWindUp;
                case T.PHX_BGM_BETTING:
                case T.PHX_BGM_FLYING: return this.bgmSource;
            }
            return null;
        },

        // Diem vao chinh cho game goi. Tu lo hang rao 3 kenh.
        play: function (clipType) {
            var src = this.getAudioClip(clipType);
            if (!src) return;
            if (this._isShipChannel(clipType)) {
                if (this._curShip === clipType && src.isPlaying) return;   // dang phat chinh no -> bo qua
                var prev = this.getAudioClip(this._curShip);
                if (prev && prev !== src) prev.stop();
                this._curShip = clipType;
            }
            if (cc.AudioController.getInstance().soundState === false) return;
            src.play();
        },
    });

}).call(this);
