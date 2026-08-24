/**
 * Created by Nofear on 2/27/2019.
 */

var netConfig = require('NetConfig');

(function () {
    var RegisterCommand;

    RegisterCommand = (function () {
        function RegisterCommand() {
        }

        RegisterCommand.prototype.execute = function (controller) {
            var url = 'api/Account/CreateAccount';


            // [D2-fold] non-VK: gửi luôn nickname trong CreateAccount -> server lưu DisplayName atomic,
            // bỏ round-trip UpdateNickName. VK (nothing.club) giữ luồng cũ (NationCode đi qua UpdateInfo).
            var foldNickname = controller.nickname && !cc.Config.getInstance().getDomainVK().includes(netConfig.HOST);

            if (!cc.sys.isNative) {
                var referUrl = cc.Tool.getInstance().getHref();

                var body = {
                    LoginType: cc.LoginType.Type1,
                    UserName: controller.username,
                    Password: controller.password,
                    DeviceId: cc.ServerConnector.getInstance().getDeviceId(),
                    PrivateKey: cc.ServerConnector.getInstance().getCaptchaPrivateKey(),
                    Captcha: controller.captcha,
                    DeviceType: cc.Config.getInstance().getDeviceType(),
                    IsLanding: controller.IsLanding,
                    ReferUrl: referUrl
                };
                if (foldNickname) { body.NickName = controller.nickname; }
                var params = JSON.stringify(body);
            } else {
                var bodyNative = {
                    LoginType: cc.LoginType.Type1,
                    UserName: controller.username,
                    Password: controller.password,
                    DeviceId: cc.ServerConnector.getInstance().getDeviceId(),
                    PrivateKey: cc.ServerConnector.getInstance().getCaptchaPrivateKey(),
                    Captcha: controller.captcha,
                    DeviceType: cc.Config.getInstance().getDeviceType(),
                };
                if (foldNickname) { bodyNative.NickName = controller.nickname; }
                params = JSON.stringify(bodyNative);
            }

            return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, url, params, function (response) {
                var obj = JSON.parse(response);
                if (obj.ResponseCode === 1) {
                    /*
                    {
                        "ResponseCode": 1,
                        "AccountInfo": {
                            "AccountID": 15364647,
                            "AccountName": "93939abceete",
                            "AvatarID": 2,
                            "Balance": 0,
                            "Status": "",
                            "Gender": -1,
                            "BirthDay": "0001-01-01T00:00:00",
                            "PhoneNumber": "0",
                            "PendingMessage": 0,
                            "PendingGiftcode": 0,
                            "TotalWin": 0,
                            "TotalLose": 0,
                            "TotalDraw": 0,
                            "IsUpdateAccountName": false
                        }
                    }
                    * */
                    return controller.onRegisterResponse(obj);
                } else {
                    // [D2-fold] CreateAccount lỗi (vd -103 trùng tên hiển thị, hoặc username/captcha lỗi):
                    // tắt LoadingOverlay rồi báo lỗi -> không kẹt spinner; account chưa tạo nên user sửa & gửi lại được.
                    cc.PopupController.getInstance().hideBusy();
                    cc.PopupController.getInstance().showMessageError(obj.Message, obj.ResponseCode);
                }
            });
        };

        return RegisterCommand;

    })();

    cc.RegisterCommand = RegisterCommand;

}).call(this);
