(function () {
    var AudioController;

    AudioController = (function () {
        var instance;

        function AudioController() {
        }

        instance = void 0;

        AudioController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };


        AudioController.prototype.setAudioPool = function (audioPool) {
            this.audioPool = audioPool;
        };

        // Trả pool âm thanh của game đang active (AudioPoolChickenFight/...). Một số game (Đá gà) gọi trực tiếp
        // các method enableXxx của pool. Additive — không đổi hành vi game khác.
        AudioController.prototype.getAudioPool = function () {
            return this.audioPool;
        };

        AudioController.prototype.playSound = function (clipType) {
            if (!this.soundState) return;
            var audioClip = this.audioPool.getAudioClip(clipType);
            if (audioClip !== null) {
                return audioClip.play();
            }
        };

        AudioController.prototype.stopSound = function (clipType) {
            if (!this.soundState) return;
            var audioClip = this.audioPool.getAudioClip(clipType);
            if (audioClip !== null) {
                return audioClip.stop();
            }
        };

        AudioController.prototype.playMusic = function (clipType) {
            if (!this.musicState) return;
            var audioClip = this.audioPool.getAudioClip(clipType);
            if (audioClip !== null) {
                return audioClip.play();
            }
        };

        AudioController.prototype.stopMusic = function (clipType) {
            if (!this.musicState) return;
            var audioClip = this.audioPool.getAudioClip(clipType);
            if (audioClip !== null) {
                return audioClip.stop();
            }
        };

        AudioController.prototype.enableMusic = function (enable) {
            this.musicState = enable;
            this.audioPool.enableMusic(enable);
        };

        AudioController.prototype.enableSound = function (enable) {
            this.soundState = enable;
            this.audioPool.enableSound(enable);
        };

        return AudioController;

    })();

    cc.AudioController = AudioController;

}).call(this);
