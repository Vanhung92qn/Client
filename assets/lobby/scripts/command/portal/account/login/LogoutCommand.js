/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var LogoutCommand;

    LogoutCommand = (function () {
        function LogoutCommand() {
        }

        LogoutCommand.prototype.execute = function (controller) {
            var url = 'api/Account/Logout';
            var params = JSON.stringify({
            });

            return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, url, params, function (response) {
                var obj = JSON.parse(response);
                if (obj.ResponseCode === 1) {
                    /*
                    {
                        "ResponseCode": 1
                    }
                    * */
                    return controller.onLogoutResponse(obj);
                } else {
                    // [TỐC ĐỘ #3] Logout best-effort: client đã đăng xuất optimistic rồi -> KHÔNG hiện lỗi
                    // (tránh popup "đăng xuất thất bại" sau khi đã về màn login). Chỉ log.
                    console.warn('[Logout] server tra ve loi (bo qua, da out optimistic):', obj.Message);
                }
            });
        };

        return LogoutCommand;

    })();

    cc.LogoutCommand = LogoutCommand;

}).call(this);
