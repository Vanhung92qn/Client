/**
 * Lich su RUT tien bank. Goi endpoint RIENG api/BankCharge/GetHistoryRut
 * (khac api/BankCharge/GetHistory = lich su NAP).
 * Tra ve cung cau truc { ResponseCode, List } nen dung chung onBankHistoryResponse
 * cua BankTransactionView (khong can view rieng).
 */
(function () {
    var BankHistoryRutCommand;

    BankHistoryRutCommand = (function () {
        function BankHistoryRutCommand() {
        }

        BankHistoryRutCommand.prototype.execute = function (controller) {
            var url = 'api/BankCharge/GetHistoryRut';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);
                if (obj.ResponseCode === 1) {
                    return controller.onBankHistoryResponse(obj);
                } else {
                    cc.PopupController.getInstance().showMessageError(obj.Message, obj.ResponseCode);
                }
            });
        };

        return BankHistoryRutCommand;

    })();

    cc.BankHistoryRutCommand = BankHistoryRutCommand;

}).call(this);
