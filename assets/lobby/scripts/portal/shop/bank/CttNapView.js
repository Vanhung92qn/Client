/**
 * CttNapView - NẠP qua cổng thanh toán tự động ConnectAuto (CTT).
 * ---------------------------------------------------------------------
 * Luồng: lấy list ngân hàng (api/Ctt/BankListDeposit) -> chọn bank + nhập tiền
 *   -> RequestDeposit (api/Ctt/RequestDeposit {BankId, Amount})
 *   -> cổng trả QR + STK + nội dung CK -> khách chuyển khoản
 *   -> cổng tự động cộng tiền (callback), KHÔNG cần CSKH duyệt.
 *
 * Khác nạp tay (BankingView.js): ở đây QR/STK/nội dung do CỔNG sinh,
 * người chơi chỉ chọn ngân hàng + nhập số tiền (không nhập tên/nội dung).
 * Command: cc.CttGetBankListCommand, cc.CttRequestDepositCommand.
 */
(function () {
    cc.CttNapView = cc.Class({
        "extends": cc.Component,
        properties: {
            // Điều hướng trang
            Trang1: cc.Node,             // Trang nhập (chọn bank + số tiền)
            Trang2: cc.Node,             // Trang QR (STK + nội dung + QR)
            NotificationPopup: cc.Node,  // Popup xác nhận quay lại
            PopupHelp: cc.Node,

            // Trang1
            toggleChooseValue: cc.ToggleChooseValue, // dropdown ngân hàng
            lbSelectedBank: cc.Label,
            animationMenuBank: cc.Animation,
            editBoxValue: cc.EditBox,    // số tiền nạp
            lbMoney: cc.Label,           // số tiền nhận (CTT 1:1)
            btnConfirm: cc.Button,
            btnXoaTienNhap: cc.Button,
            defaultImage: cc.SpriteFrame,
            pressedImage: cc.SpriteFrame,

            // Trang2 (thông tin cổng trả về)
            lbInfoSelectedBank: cc.Label,    // ngân hàng nhận
            lbInfoBankAccountNumber: cc.Label,// STK nhận
            lbInfoBankAccountName: cc.Label,  // tên chủ TK nhận
            lbInfoBankDesc: cc.Label,         // nội dung CK (cổng sinh)
            lbChiNhanhBankDesc: cc.Label,
            lbInfoAmount: cc.Label,           // số tiền
            btnCopyAmount: cc.Button,
            QRCODE: cc.Sprite,
            abcdSprite: cc.Sprite,

            // Âm thanh
            audioClick: cc.AudioSource,
            audioClickNap: cc.AudioSource,
            audioErorr: cc.AudioSource,
        },

        onLoad: function () {
            this.animOpenName = 'showDropdownMenu';
            this.animCloseName = 'hideDropdownMenu';

            this.rate = 1;        // CTT nạp 1:1 (không tỷ giá)
            this.min = 200000;    // tối thiểu (backend Gateway:Ctt:DepositMin=200000)
            this.max = 500000000; // tối đa (backend Gateway:Ctt:DepositMax=500000000)
            this.CttBankId = 0;

            // TẠM THỜI: tự chọn ngân hàng NGẪU NHIÊN (người chơi chỉ nhập tiền).
            // Đổi thành false nếu muốn cho người chơi tự chọn trên dropdown.
            this.AUTO_RANDOM_BANK = true;
            this.cttBankList = [];

            // Auto mode: hiển thị nhãn cố định, KHÔNG mở dropdown chọn bank
            if (this.AUTO_RANDOM_BANK && this.lbSelectedBank) {
                this.lbSelectedBank.string = 'AUTO INTERNET BANKING';
            }

            cc.PopupController.getInstance().showBusy();
            this.getCttBankList();

            if (this.btnXoaTienNhap) {
                this.btnXoaTienNhap.node.on('click', this.xoaTienNhap, this);
                this.btnXoaTienNhap.node.on('mousedown', this.onButtonPressed, this);
                this.btnXoaTienNhap.node.on('mouseup', this.onButtonReleased, this);
                this.btnXoaTienNhap.node.on('touchend', this.onButtonReleased, this);
            }
            if (this.btnCopyAmount) this.btnCopyAmount.node.on('click', this.copyAmountClicked, this);

            if (this.Trang1) this.Trang1.active = true;
            if (this.Trang2) this.Trang2.active = false;
            if (this.NotificationPopup) this.NotificationPopup.active = false;
            if (this.PopupHelp) this.PopupHelp.active = false;
            if (this.abcdSprite) this.abcdSprite.node.active = false;
            if (this.QRCODE) this.QRCODE.node.active = false;
        },

        onEnable: function () {
            if (this.animationMenuBank) this.animationMenuBank.node.scaleY = 0;
            this.resetInput();
            this.isTimerConfirm = false;
            this.timerConfirm = 0;
            this.timePerConfirm = 3;
            this.processTimeConfirm();
        },

        update: function (dt) {
            if (this.isTimerConfirm) {
                this.timerConfirm -= dt;
                this.processTimeConfirm();
            }
        },

        // ===================== Lấy danh sách ngân hàng NẠP =====================
        getCttBankList: function () {
            var cmd = new cc.CttGetBankListCommand;
            cmd.execute(this);
        },

        onGetCttBankListResponse: function (response) {
            // response.Orders.List = [{ Id, Name, ShortName, Bin, Logo, Code }]
            var list = (response.Orders && response.Orders.List) ? response.Orders.List : [];
            this.cttBankList = list; // lưu để auto random

            // Chế độ chọn tay: đổ vào dropdown (auto mode có thể bỏ hẳn dropdown -> guard null)
            if (this.toggleChooseValue) {
                this.toggleChooseValue.resetListChooseValue();
                var self = this;
                var posY = -35; // vị trí item đầu (fix bug do không dùng layout)
                list.forEach(function (bank) {
                    var displayName = bank.ShortName || bank.Name || bank.Code;
                    self.toggleChooseValue.initializeToggleChooseValue(
                        self,
                        "CttNapView",
                        "selectBankEvent",
                        bank,
                        displayName,
                        posY
                    );
                    posY -= 50;
                });
            }
        },

        setLBSelectedBank: function (bank) {
            this.lbSelectedBank.string = bank.ShortName || bank.Name || bank.Code;
            this.CttBankId = bank.Id;
            this.CttBankName = this.lbSelectedBank.string;
        },

        selectBank: function (value) {
            this.bankType = value;
        },

        selectBankEvent: function (event, data) {
            this.setLBSelectedBank(data);
            this.animationMenuBank.play(this.animCloseName);
            this.audioClick.loop = false;
            this.audioClick.play();
        },

        openMenuBankClicked: function () {
            if (this.AUTO_RANDOM_BANK) return; // auto mode: không mở dropdown
            if (this.animationMenuBank) this.animationMenuBank.play(this.animOpenName);
            this.audioClick.loop = false;
            this.audioClick.play();
        },

        hideMenuBankClicked: function () {
            if (this.animationMenuBank) this.animationMenuBank.play(this.animCloseName);
        },

        onEditingValueChanged: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxValue.string);
            this.editBoxValue.string = cc.Tool.getInstance().formatNumberkvn1102(val);
            var receive = Math.round(val * this.rate);
            this.lbMoney.string = 'Số ' + cc.Config.getInstance().currency() + ' nhận được: ' + cc.Tool.getInstance().formatNumber(receive);
        },

        onEditingValueDidEnd: function () {
            this.onEditingValueChanged();
        },

        // ===================== Tạo yêu cầu NẠP -> nhận QR =====================
        topupClicked: function () {
            this.amount = cc.Tool.getInstance().removeDot(this.editBoxValue.string);

            if (this.AUTO_RANDOM_BANK) {
                // Tự bốc NGẪU NHIÊN 1 ngân hàng từ list cổng (người chơi không cần chọn)
                if (!this.cttBankList || this.cttBankList.length === 0) {
                    return this.showError('Chưa tải được danh sách ngân hàng, vui lòng thử lại.');
                }
                var rb = this.cttBankList[Math.floor(Math.random() * this.cttBankList.length)];
                this.CttBankId = rb.Id;
                this.CttBankName = rb.ShortName || rb.Name || rb.Code;
                if (this.lbSelectedBank) this.lbSelectedBank.string = this.CttBankName;
            } else if (!this.lbSelectedBank || this.lbSelectedBank.string === 'CHỌN NGÂN HÀNG' || !this.CttBankId) {
                return this.showError('Vui lòng chọn ngân hàng.');
            }
            if (this.editBoxValue.string === '') {
                return this.showError('Vui lòng nhập số tiền muốn nạp.');
            }
            if (this.amount > this.max) {
                return this.showError('Số tiền nạp tối đa là ' + cc.Tool.getInstance().formatNumber(this.max) + ' đ');
            }
            if (this.amount < this.min) {
                return this.showError('Số tiền nạp tối thiểu là ' + cc.Tool.getInstance().formatNumber(this.min) + ' đ');
            }

            this.CttAmount = parseInt(this.amount, 10);

            var cmd = new cc.CttRequestDepositCommand;
            cmd.execute(this);
            this.activeTimeConfirm();
            this.audioClickNap.loop = false;
            this.audioClickNap.play();
        },

        onCttRequestDepositResponse: function (response) {
            var data = (response.Orders && response.Orders.Data) ? response.Orders.Data : null;
            if (!data) {
                cc.PopupController.getInstance().showMessageError('Không lấy được thông tin nạp.');
                return;
            }

            if (this.lbInfoBankAccountNumber) this.lbInfoBankAccountNumber.string = data.bankAccount || '';
            if (this.lbInfoBankAccountName) this.lbInfoBankAccountName.string = data.bankAccountName || '';
            if (this.lbInfoBankDesc) this.lbInfoBankDesc.string = data.content || '';
            if (this.lbChiNhanhBankDesc) this.lbChiNhanhBankDesc.string = data.bankProvider || this.CttBankName || '';

            if (this.lbInfoAmount) {
                this.lbInfoAmount.node.active = true;
                this.lbInfoAmount.string = cc.Tool.getInstance().formatNumber(data.amount) + ' đ';
            }
            if (this.lbInfoSelectedBank) {
                this.lbInfoSelectedBank.node.active = true;
                this.lbInfoSelectedBank.string = data.bankProvider || this.CttBankName || '';
            }

            this.loadQrFromUrl(data.qrCode);

            if (this.Trang1) this.Trang1.active = false;
            if (this.Trang2) this.Trang2.active = true;
        },

        onCttRequestDepositResponseError: function (response) {
            if (response && response.Description)
                cc.PopupController.getInstance().showMessageError(response.Description);
            else
                cc.PopupController.getInstance().showMessageError(response ? response.Message : 'Nạp thất bại', response ? response.ResponseCode : -1);
        },

        loadQrFromUrl: function (url) {
            if (!url) return;
            var self = this;
            var lower = url.toLowerCase();
            var type = (lower.indexOf('.jpg') >= 0 || lower.indexOf('.jpeg') >= 0) ? 'jpg' : 'png';
            if (!self.QRCODE) { cc.warn('CTT: chua bind QRCODE'); return; }
            self.QRCODE.node.removeAllChildren();
            cc.loader.load({ url: url, type: type }, function (err, tex) {
                if (err) { cc.error('CTT load QR failed:', err); return; }
                var node = new cc.Node('QRprite');
                var sp = node.addComponent(cc.Sprite);
                sp.spriteFrame = new cc.SpriteFrame(tex);
                var targetSize = 200;
                var org = sp.spriteFrame.getOriginalSize();
                node.setScale(targetSize / Math.max(org.width, org.height));
                node.setPosition(0, 0);
                self.QRCODE.node.addChild(node);
                if (self.abcdSprite) self.abcdSprite.node.active = true;
                self.QRCODE.node.active = true;
            });
        },

        // ===================== tiện ích =====================
        showError: function (msg) {
            cc.PopupController.getInstance().showMessage(msg);
            this.audioErorr.loop = false;
            this.audioErorr.play();
        },

        activeTimeConfirm: function () {
            this.isTimerConfirm = true;
            this.timerConfirm = this.timePerConfirm;
        },

        processTimeConfirm: function () {
            if (this.timerConfirm <= 0) {
                this.isTimerConfirm = false;
                this.btnConfirm.interactable = true;
            } else {
                this.isTimerConfirm = true;
                this.btnConfirm.interactable = false;
            }
        },

        resetInput: function () {
            if (this.editBoxValue) {
                this.editBoxValue.string = '';
                this.lbMoney.string = 'Số tiền nhận được: 0';
            }
        },

        resetScale: function () {
            this.animationMenuBank.node.scaleY = 0;
            this.animationMenuBank.node.opacity = 255;
        },

        restoreScale: function () {
            this.animationMenuBank.node.scaleY = 1;
            this.animationMenuBank.node.opacity = 0;
        },

        xoaTienNhap: function () {
            this.audioClick.loop = false;
            this.audioClick.play();
            if (this.editBoxValue) {
                this.editBoxValue.string = '';
                this.lbMoney.string = 'Số tiền nhận được: 0';
            }
        },

        onButtonPressed: function () {
            this.btnXoaTienNhap.node.getComponent(cc.Sprite).spriteFrame = this.pressedImage;
        },

        onButtonReleased: function () {
            this.btnXoaTienNhap.node.getComponent(cc.Sprite).spriteFrame = this.defaultImage;
        },

        // ===================== copy / điều hướng =====================
        copyBankAccountNumberClicked: function () {
            if (cc.Tool.getInstance().copyToClipboard(this.lbInfoBankAccountNumber.string)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép số tài khoản.');
                this.audioClick.loop = false;
                this.audioClick.play();
            }
        },

        copyBankAccountNameClicked: function () {
            if (cc.Tool.getInstance().copyToClipboard(this.lbInfoBankAccountName.string)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép tên tài khoản.');
                this.audioClick.loop = false;
                this.audioClick.play();
            }
        },

        copylbInfoBankDesc: function () {
            if (cc.Tool.getInstance().copyToClipboard(this.lbInfoBankDesc.string)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép nội dung chuyển khoản.');
                this.audioClick.loop = false;
                this.audioClick.play();
            }
        },

        copyAmountClicked: function () {
            this.audioClick.loop = false;
            this.audioClick.play();
            if (cc.Tool.getInstance().copyToClipboard(this.amount)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép số tiền: ' + cc.Tool.getInstance().formatNumber(this.amount) + ' đ');
            }
        },

        historyClicked: function () {
            cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.BANK);
            this.audioClick.loop = false;
            this.audioClick.play();
        },

        HelpButtonClicked: function () {
            this.PopupHelp.active = true;
        },

        closeHelpPopup: function () {
            this.PopupHelp.active = false;
        },

        continueClicked: function () {
            this.resetInput();
        },

        backToTrang1: function () {
            this.NotificationPopup.active = true;
        },

        onAcceptBack: function () {
            if (this.NotificationPopup) this.NotificationPopup.active = false;
            if (this.Trang1) this.Trang1.active = true;
            if (this.Trang2) this.Trang2.active = false;
            if (this.QRCODE) {
                this.QRCODE.node.removeAllChildren();
                this.QRCODE.node.active = false;
            }
        },

        onCancelBack: function () {
            if (this.NotificationPopup) this.NotificationPopup.active = false;
        },
    });
}).call(this);
