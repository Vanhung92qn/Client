
//Created by SpiderMan404
(function () {
    var Xeng777GetSessionHistoryDetailsCommand;

    Xeng777GetSessionHistoryDetailsCommand = (function () {
        function Xeng777GetSessionHistoryDetailsCommand() {
        }

        Xeng777GetSessionHistoryDetailsCommand.prototype.execute = function (controller) {
            var url = 'api/xeng777/GetSessionHistoryDetails?top=100';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.XENG_777, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetSessionHistoryDetailsResponse(obj);
            });
        };

        return Xeng777GetSessionHistoryDetailsCommand;

    })();

    cc.Xeng777GetSessionHistoryDetailsCommand = Xeng777GetSessionHistoryDetailsCommand;

}).call(this);
