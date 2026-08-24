/**
 * Created by Nobita on 01/15/2022.
 */

(function () {
    var ChickenFightNegotiateCommand;

    ChickenFightNegotiateCommand = (function () {
        function ChickenFightNegotiateCommand() {
        }

        ChickenFightNegotiateCommand.prototype.execute = function (controller) {
            var url = 'signalr/negotiate';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.CHICKEN_FIGHT, url, function (response) {				
                var obj = JSON.parse(response);
				//console.log(obj);
                return controller.onChickenFightNegotiateResponse(obj);

            }, true);
        };

        return ChickenFightNegotiateCommand;

    })();

    cc.ChickenFightNegotiateCommand = ChickenFightNegotiateCommand;

}).call(this);
