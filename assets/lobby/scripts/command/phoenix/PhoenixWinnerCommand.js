/*
 * HOA PHUNG (116) - Bang vang. Ban toi subdomain PHOENIX + api/Phoenix/GetBigWinner.
 * TRUOC DAY popup Bang vang cua Hoa Phung goi cc.AviatorWinnerCommand -> hien bang vang cua game AVIATOR.
 */
(function () {
    var PhoenixWinnerCommand;

    PhoenixWinnerCommand = (function () {
        function PhoenixWinnerCommand() {
        }

        PhoenixWinnerCommand.prototype.execute = function (controller, topDate) {
            let url = 'api/Phoenix/GetBigWinner?topDate=' + topDate;
            cc.PopupController.getInstance().showBusy();
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PHOENIX, url, function (response) {
                var obj = JSON.parse(response);
                cc.PopupController.getInstance().hideBusy();
                return controller.onGetBigWinnerResponse(obj);
            });
        };

        return PhoenixWinnerCommand;

    })();

    cc.PhoenixWinnerCommand = PhoenixWinnerCommand;

}).call(this);
