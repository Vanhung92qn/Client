
(function () {
    var AviatorController;
    AviatorController = (function () {
        var instance;

        function AviatorController() {

        }

        instance = void 0;

        AviatorController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        AviatorController.prototype.setAviatorView = function (view) {
            return this.AviatorView = view;
        };

        AviatorController.prototype.sendRequestOnHub = function (method, data) {
            if (this.AviatorView)
                return this.AviatorView.sendRequestOnHub(method, data);
        };

        AviatorController.prototype.setInfoView = function (view) {
            return this.AviatorInfoView = view;
        };

        AviatorController.prototype.setAviatorPlayerView = function (view) {
            return this.AviatorPlayersView = view;
        };

        AviatorController.prototype.setAviatorSoiCauView = function (view) {
            return this.AviatorSoiCauView = view;
        };

        // ==== AM THANH: di qua ha tang chung cua repo (cc.AudioController -> cc.AudioPoolPhoenix) ====
        // Pool tu lo hang rao 3 kenh (nhac / sfx / rieng-cho-phuong) nen cho goi cu goi, khong so chong tieng.
        AviatorController.prototype.phxAudio = function () {
            var ac = (typeof cc.AudioController !== 'undefined') ? cc.AudioController.getInstance() : null;
            return ac && ac.getAudioPool ? ac.getAudioPool() : null;
        };

        AviatorController.prototype.playPhx = function (clipType) {
            var p = this.phxAudio();
            if (p && p.play) p.play(clipType);
        };

        // HOA PHUNG: panel Nguoi trong phong (nguoi that dang ket noi + roster bot tu engine).
        AviatorController.prototype.setUserInRoomView = function (view) {
            return this.PhoenixUserInRoomView = view;
        };

        AviatorController.prototype.updateUserInRoom = function (users, total) {
            if (this.PhoenixUserInRoomView) return this.PhoenixUserInRoomView.updateList(users, total);
        };

        AviatorController.prototype.setAviatorGraphView = function (view) {
            return this.AviatorGraphView = view;
        };

        AviatorController.prototype.setAviatorBetView = function (view) {
            return this.AviatorBetView = view;
        };

        AviatorController.prototype.getCurrentState = function () {
            return this.currentState;
        };

        AviatorController.prototype.updateInfo = function (data) {
            this.currentState = data.Phrase;   // để getCurrentState() hoạt động (điều kiện restore Cashout khi join)
            if (this.AviatorInfoView) return this.AviatorInfoView.updateInfo(data);
        };

        AviatorController.prototype.updateCashout = function (accountId, amount) {
            if (this.AviatorInfoView) return this.AviatorInfoView.updateCashout(accountId, amount);
        };

        AviatorController.prototype.updateBetList = function (data, iscrashed) {
            if (this.AviatorPlayersView) return this.AviatorPlayersView.updateBetList(data, iscrashed);
        };

        AviatorController.prototype.updateMultiplier = function (multiplier) {
            // kênh này bắn MỖI tick (100ms) khi bay -> dùng luôn để cập nhật tiền-đang-có ở ô cược
            if (this.AviatorBetView) this.AviatorBetView.updateWinPreview(multiplier);
            if (this.AviatorInfoView) return this.AviatorInfoView.updateMultiplier(multiplier);
        };

        // HOA PHUNG: engine ban long vu roi (kenh phoenix_feather -> front featherDrop) -> hien slot long vu.
        AviatorController.prototype.updateFeather = function (count) {
            if (this.AviatorInfoView) return this.AviatorInfoView.updateFeather(count);
        };

        // HOA PHUNG: NO HU -> hu jackpot_sunphung `in`->`jackpot`, 5 khe long vu chop, dan chim bay ra.
        AviatorController.prototype.playJackpotAnim = function () {
            if (this.AviatorInfoView) return this.AviatorInfoView.playJackpotAnim();
        };

        // HOA PHUNG: bien dao bay (kenh phoenix_flight -> front flyingEvent) -> he lan ne/trung.
        AviatorController.prototype.setFlightLanes = function (view) {
            return this.PhoenixFlightLanes = view;
        };

        AviatorController.prototype.onFlyingEvent = function (cL, aL, bId, aId, fc) {
            if (this.PhoenixFlightLanes) return this.PhoenixFlightLanes.onFlyingEvent(cL, aL, bId, aId, fc);
        };

        AviatorController.prototype.resetBetList = function () {
            if (this.AviatorPlayersView) return this.AviatorPlayersView.resetList();
        };

        AviatorController.prototype.initListSoiCau = function (data) {
            if (this.AviatorSoiCauView) return this.AviatorSoiCauView.initListSoiCau(data);
        };

        AviatorController.prototype.updateSoiCau = function (data) {
            if (this.AviatorGraphView) return this.AviatorGraphView.draw(data);
        };

        AviatorController.prototype.updateBetView = function (info) {
            if (this.AviatorBetView) return this.AviatorBetView.updatePhrase(info);
        };

        AviatorController.prototype.setMultiplier = function (multiplier) {
            if (this.AviatorBetView) return this.AviatorBetView.setMultiplier(multiplier);
        };

        AviatorController.prototype.setBeted = function (isBeted) {
            return this.AviatorBetView.isBeted = isBeted;
        };

        AviatorController.prototype.setCashout = function (isCashout) {
            // KHÔNG gán thẳng cờ nữa: view phải vẽ lại nút ngay (updatePhrase bị dedup suốt Flying).
            return this.AviatorBetView.setCashout(isCashout);
        };

        AviatorController.prototype.setSettingView = function (settingView) {
            return (this.settingView = settingView);
        };

        AviatorController.prototype.playAudio = function () {
            return this.settingView;
        };

        AviatorController.prototype.playerShowBubbleChat = function (message) {
            // Aviator chua co UI bubble chat tren player -> stub tranh crash onHubMessage(RECEIVE_MESSAGE)
            return;
        };

        return AviatorController;
    })();
    cc.PhoenixController = AviatorController;
}).call(this);
