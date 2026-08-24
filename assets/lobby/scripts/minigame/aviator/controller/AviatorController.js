
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
            return this.AviatorInfoView.updateInfo(data);
        };

        AviatorController.prototype.updateCashout = function (accountId, amount) {
            return this.AviatorInfoView.updateCashout(accountId, amount);
        };

        AviatorController.prototype.updateBetList = function (data, iscrashed) {
            return this.AviatorPlayersView.updateBetList(data, iscrashed);
        };

        AviatorController.prototype.updateMultiplier = function (multiplier) {
            // kênh này bắn MỖI tick (100ms) khi bay -> dùng luôn để cập nhật tiền-đang-có ở ô cược
            if (this.AviatorBetView) this.AviatorBetView.updateWinPreview(multiplier);
            return this.AviatorInfoView.updateMultiplier(multiplier);
        };

        AviatorController.prototype.resetBetList = function () {
            return this.AviatorPlayersView.resetList();
        };

        AviatorController.prototype.initListSoiCau = function (data) {
            return this.AviatorSoiCauView.initListSoiCau(data);
        };

        AviatorController.prototype.updateSoiCau = function (data) {
            return this.AviatorGraphView.draw(data);
        };

        AviatorController.prototype.updateBetView = function (info) {
            return this.AviatorBetView.updatePhrase(info);
        };

        AviatorController.prototype.setMultiplier = function (multiplier) {
            return this.AviatorBetView.setMultiplier(multiplier);
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
    cc.AviatorController = AviatorController;
}).call(this);
