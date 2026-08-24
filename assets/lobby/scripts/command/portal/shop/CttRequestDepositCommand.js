/**
 * CTT (ConnectAuto) - tao yeu cau NAP tu dong.
 * Portal: POST api/Ctt/RequestDeposit { BankId, Amount }
 *   -> { ResponseCode:1, Orders:{ Data:{ errorCode:0, depositId, requestId,
 *        qrCode, qrCodeBase64, content, bankAccount, bankAccountName, bankProvider, amount } } }
 * Khach quet QR chuyen khoan -> cong tu dong cong tien (callback), khong can CSKH duyet.
 */
(function () {
    var CttRequestDepositCommand;

    CttRequestDepositCommand = (function () {
        function CttRequestDepositCommand() {
        }

        CttRequestDepositCommand.prototype.execute = function (controller) {
            var url = 'api/Ctt/RequestDeposit';

            var params = JSON.stringify({
                BankId: controller.CttBankId,
                Amount: controller.CttAmount
            });

            cc.PopupController.getInstance().showBusy();
            return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, url, params, function (response) {
                var obj = JSON.parse(response);
                cc.PopupController.getInstance().hideBusy();
                if (obj.ResponseCode === 1) {
                    return controller.onCttRequestDepositResponse(obj);
                } else {
                    return controller.onCttRequestDepositResponseError(obj);
                }
            });
        };

        return CttRequestDepositCommand;
    })();

    cc.CttRequestDepositCommand = CttRequestDepositCommand;
}).call(this);
