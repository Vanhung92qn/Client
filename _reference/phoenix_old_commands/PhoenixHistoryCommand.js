/*
 * HOA PHUNG (116) - Lich su cuoc CUA CHINH NGUOI CHOI. Ban toi subdomain PHOENIX + api/Phoenix/GetHistory.
 * TRUOC DAY goi cc.AviatorHistoryCommand -> endpoint loc theo AccountID nen nguoi choi mo ra
 * se thay lich su cuoc game AVIATOR cua ho (hoac bang trong), khong thay van Hoa Phung vua danh.
 */
(function () {
    var PhoenixHistoryCommand;

    PhoenixHistoryCommand = (function () {
        function PhoenixHistoryCommand() {
        }

        PhoenixHistoryCommand.prototype.execute = function (controller) {
            let url = 'api/Phoenix/GetHistory?top=50';
            let subDomainName = cc.SubdomainName.PHOENIX;
            return cc.ServerConnector.getInstance().sendRequest(subDomainName, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetHistoryResponse(obj);
            });
        };

        return PhoenixHistoryCommand;

    })();

    cc.PhoenixHistoryCommand = PhoenixHistoryCommand;

}).call(this);
