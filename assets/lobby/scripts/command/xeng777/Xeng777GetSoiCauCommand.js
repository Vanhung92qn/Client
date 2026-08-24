//Created by SpiderMan404

(function () {
    var Xeng777GetSoiCauCommand;

    Xeng777GetSoiCauCommand = (function () {
        function Xeng777GetSoiCauCommand() {
        }

        Xeng777GetSoiCauCommand.prototype.execute = function (controller) {
            var url = 'api/xeng777/GetSoiCau';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.XENG_777, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetSoiCauResponse(obj);
            });
        };

        return Xeng777GetSoiCauCommand;

    })();

    cc.Xeng777GetSoiCauCommand = Xeng777GetSoiCauCommand;

}).call(this);
