/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.BankTransactionItem = cc.Class({
        "extends": cc.Component,
        properties: {
            lbTime: cc.Label,
            lbType: cc.Label, //Loai giao dich (NAP, RUT)
            lbRequestID: cc.Label, //Ma giao dich
            lbTranID: cc.Label, //Ma giao dich
            lbValue: cc.Label, //Gia tri
            lbStatus: cc.Label, //Trang thai
			tennganhang: cc.Label,
        },

        onLoad: function () {
            // this.sprite = this.node.getComponent(cc.Sprite);

           // this.lbValue.node.color = cc.Color.YELLOW;
        },

        updateItem: function(item, itemID) {
            // {
            //     "RequestID": 52,
            //     "StatusStr": "Chờ xử lý",
            //     "RequestType": 2,
            //     "Type": "Rút tiền ",
            //     "Code": null,
            //     "RequestDate": "2019-09-06T15:46:30.317",
            //     "AmountGame": 1000000
            // }

            // this.sprite.enabled = itemID % 2 === 0;
            this.lbTime.string = cc.Tool.getInstance().convertUTCTime99(item.RequestDate); //UpdateDate

            switch (item.RequestType) {
                case 1:
                    this.lbType.string = 'Nạp Internet Banking';
                   // this.lbType.node.color = cc.Color.GREEN;
                    break;
                case 2:
                    this.lbType.string = 'Rút Internet Banking';
                   // this.lbType.node.color = cc.Color.RED;
                    break;
				case 3:
                    this.lbType.string = 'Nạp CodePay';
                   // this.lbType.node.color = cc.Color.RED;
                    break;
            }

            this.lbRequestID.string = '#' + item.RequestID;

            // Ghi chu (lbTranID) theo TRANG THAI:
            //  - Thanh cong  -> bao thanh cong
            //  - Dang xu ly  -> bao dang xu ly
            //  - Tu choi/huy -> hien LY DO admin nhap (item.RejectReason), khong co thi "Lien he CSKH"
            var _st = '' + item.Status;
            var _reason = ('' + (item.RejectReason || '')).trim();
            if (_st === cc.BankState.SUCCESS) {
                this.lbTranID.string = 'Giao dịch thành công';
            } else if (_st === cc.BankState.PENDING || _st === cc.BankState.PENDING_BANK) {
                this.lbTranID.string = 'Đang xử lý, vui lòng chờ';
            } else {
                this.lbTranID.string = _reason.length > 0 ? _reason : 'Liên hệ CSKH để được hỗ trợ';
            }

            this.lbValue.string = cc.Tool.getInstance().formatNumber(item.AmountGame);
            this.lbStatus.string = item.StatusStr;
            this.tennganhang.string = item.Bankname;

            // FAILED2: '-2', //Thất bại
            //     FAILED: '-1', //Thất bại
            //     PENDING: '0', //Chờ xử lý
            //     SUCCESS: '1', //Thành công
            //     PENDING_BANK: '3', //Chờ duyệt từ ngân hàng
            //     ADMIN_CANCEL: '4', //Admin huỷ giao dịch
            //     BANK_CANCEL: '5', //Ngân hàng từ chối giao dịch
            //Còn lại là thất bại

            switch (item.Status.toString()) {
                //Thành công
                case cc.BankState.SUCCESS:
				this.lbStatus.string = "Thành công";
                    this.lbStatus.node.color = cc.Color.YELLOW;
                    break;

                //Chờ xử lý
                case cc.BankState.PENDING:
                case cc.BankState.PENDING_BANK:
				this.lbStatus.string = "Đang xử lý";
                    this.lbStatus.node.color = cc.Color.WHITE;
                    break;

                //Thất bại
                case cc.BankState.FAILED:
                case cc.BankState.FAILED2:
                case cc.BankState.ADMIN_CANCEL:
                case cc.BankState.BANK_CANCEL:
				this.lbStatus.string = "Từ chối";
                    this.lbStatus.node.color = cc.Color.RED;
                    break;

                //Thất bại
                default:
                   // this.lbStatus.node.color = cc.Color.RED;
                    break;
            }

            this.item = item;
            this.itemID = itemID;
        },

    });
}).call(this);
