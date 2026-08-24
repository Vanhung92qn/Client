/**
 * CTT (ConnectAuto) - lay danh sach ngan hang NAP tu cong tu dong.
 * Portal: GET api/Ctt/BankListDeposit -> { ResponseCode:1, Orders:{ List:[{Id,Name,ShortName,Bin,Logo,Code}] } }
 */
(function () {
    var CttGetBankListCommand;

    CttGetBankListCommand = (function () {
        function CttGetBankListCommand() {
        }

        CttGetBankListCommand.prototype.execute = function (controller) {
            var url = 'api/Ctt/BankListDeposit';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                cc.PopupController.getInstance().hideBusy();
                var obj = JSON.parse(response);
                if (obj.ResponseCode === 1) {
                    return controller.onGetCttBankListResponse(obj);
                } else {
                    cc.PopupController.getInstance().showMessageError(obj.Message, obj.ResponseCode);
                }
            });
        };

        return CttGetBankListCommand;
    })();

    cc.CttGetBankListCommand = CttGetBankListCommand;
}).call(this);
