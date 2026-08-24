/*
 * HOA PHUNG (116) - Lich su NO HU. Ban toi subdomain PHOENIX + api/Phoenix/GetJackpotsHis.
 * TRUOC DAY goi cc.AviatorGetHistoryJackpotCommand -> hien lich su no hu cua game AVIATOR.
 */
(function () {
    var PhoenixGetHistoryJackpotCommand;

    PhoenixGetHistoryJackpotCommand = (function () {
        function PhoenixGetHistoryJackpotCommand() {
        }

        PhoenixGetHistoryJackpotCommand.prototype.execute = function (controller) {
            var url = 'api/Phoenix/GetJackpotsHis';
            cc.PopupController.getInstance().showBusy();
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PHOENIX, url, function (response) {
                var obj = JSON.parse(response);
                cc.PopupController.getInstance().hideBusy();
                return controller.onBCGetHistoryResponse(obj);   // ten ham giu nguyen nhu view dang co
            });
        };

        return PhoenixGetHistoryJackpotCommand;

    })();

    cc.PhoenixGetHistoryJackpotCommand = PhoenixGetHistoryJackpotCommand;

}).call(this);
