/**
 * Created by Nofear on 2/27/2019.
 * 2026-08-28: bo captcha (server khong con kiem tra), sua loi double-slash.
 */

(function () {
    var VQMMSpinCommand;

    VQMMSpinCommand = (function () {
        function VQMMSpinCommand() {
        }

        VQMMSpinCommand.prototype.execute = function (controller) {
            //KHONG co dau '/' o dau: ServerConnector da tu noi 'https://' + subdomain + host + '/'
            //(ban cu de '/api/...' nen URL rap ra bi '//api/...')
            var url = 'api/luckyrotation/Spin';

            //Captcha da bo hoan toan o server. Van gui DeviceID vi server dung
            //no de ghi nhat ky (1=web, 2=ios, 3=android).
            var params = JSON.stringify({
                DeviceID: cc.Config.getInstance().getDeviceType()
            });

            return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.VQMM, url, params, function (response) {
                var obj = JSON.parse(response);

                cc.PopupController.getInstance().hideBusy();
                return controller.onVQMMSpinResponse(obj);
            });
        };

        return VQMMSpinCommand;

    })();

    cc.VQMMSpinCommand = VQMMSpinCommand;

}).call(this);
