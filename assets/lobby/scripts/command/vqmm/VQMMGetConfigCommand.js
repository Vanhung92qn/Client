/**
 * Lay nhan + menh gia tung o tu server de ve dia.
 *
 * Truoc day 19 nhan (12 o vong lon + 7 o vong nho) duoc go cung trong
 * vqmmView.prefab, nen admin doi menh gia giai la phai mo Cocos build lai client.
 * Gio server tra ve kem SlotIndex nen client chi viec dien vao dung o.
 *
 * Created 2026-08-28.
 */

(function () {
    var VQMMGetConfigCommand;

    VQMMGetConfigCommand = (function () {
        function VQMMGetConfigCommand() {
        }

        VQMMGetConfigCommand.prototype.execute = function (controller) {
            var url = 'api/luckyrotation/GetConfig';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.VQMM, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onVQMMGetConfigResponse(obj);
            });
        };

        return VQMMGetConfigCommand;

    })();

    cc.VQMMGetConfigCommand = VQMMGetConfigCommand;

}).call(this);
