

(function () {
    var AviatorGetHistoryJackpotCommand;

    AviatorGetHistoryJackpotCommand = (function () {
        function AviatorGetHistoryJackpotCommand() {
        }

        AviatorGetHistoryJackpotCommand.prototype.execute = function (controller) {
            var url = 'api/Aviator/GetJackpotsHis';
			cc.PopupController.getInstance().showBusy();
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.AVIATOR, url, function (response) {
                var obj = JSON.parse(response);
				cc.PopupController.getInstance().hideBusy();
                return controller.onBCGetHistoryResponse(obj);
            });
        };

        return AviatorGetHistoryJackpotCommand;

    })();

    cc.AviatorGetHistoryJackpotCommand = AviatorGetHistoryJackpotCommand;

}).call(this);
