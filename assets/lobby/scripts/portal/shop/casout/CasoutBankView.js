
var BrowserUtil = require('BrowserUtil');
var helper = require('Helper');
// vn1102 coder

// === CHINH KICH THUOC DONG NGAN HANG O DAY (px) ===
var BANK_ROW_HEIGHT = 50;   // chieu cao moi dong -> QUYET DINH khoang cach giua cac ten NH (nho lai = sat lai)
var BANK_ROW_SPACING = 5;   // khe ho them giua 2 dong

// Danh sach ngan hang cho man RUT (rut THU CONG - CSKH duyet tay).
// Them/bot/doi ten ngan hang: CHI sua mang nay, list tu sinh bang code (renderBankList).
var BANK_LIST = [
    'Vietcombank', 'Techcombank', 'BIDV', 'VietinBank', 'MB Bank', 'ACB',
    'VPBank', 'Agribank', 'Sacombank', 'TPBank', 'SHB', 'VIB', 'HDBank',
    'OCB', 'MSB', 'SeABank', 'Eximbank', 'LPBank', 'Nam A Bank', 'ABBANK',
    'Bac A Bank', 'PVcomBank', 'SCB', 'DongA Bank', 'KienlongBank',
    'SaigonBank', 'VietABank', 'BaoVietBank', 'NCB', 'PGBank', 'BVBank',
    'VietBank', 'GPBank', 'OceanBank', 'CBBank'
];

cc.Class({
    extends: cc.Component,

    properties: {
        animationMenuBank: cc.Animation,
        moreHinhThuc: cc.Node,
        bankContent: cc.Node,   // node 'content' chua item ngan hang (content cua ScrollView 'view')
        bankItem: cc.Node,      // 1 item MAU (co Label ten 'name'); code clone ra ca list
        labelHinhthuc: cc.Label,
        hinhThuc: '',
        // editBank:   cc.EditBox,
        editNumber: cc.EditBox,
        editName: cc.EditBox,
        editOtp: cc.EditBox,
        // editBranch: cc.EditBox,
        editRut: cc.EditBox,
        CoinCasout: cc.Label,
        ghichu: cc.Label,
        sotienview: cc.Label,
        nodedangky: cc.Node,
        nodexacnhan: cc.Node,
        btnConfirm: cc.Button,
        lbConfirms: [cc.Label],
        audioClick: cc.AudioSource,
        audioClickRut: cc.AudioSource,
    },
    init() {
        var self = this;
        this.editboxs = [this.editNumber, this.editName, this.editRut];
        this.keyHandle = function (t) {
            return t.keyCode === cc.macro.KEY.tab ? (self.isTop() && self.changeNextFocusEditBox(),
                t.preventDefault && t.preventDefault(),
                !1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onNapClick(),
                    t.preventDefault && t.preventDefault(),
                    !1) : void 0
        }
    },
    onEnable: function () {
        cc.sys.isBrowser && this.addEvent();
        this.bankSelect = [];
        this.nodedangky.active = true;
        this.nodexacnhan.active = false;
        this.isTimerConfirm = false;
        this.timerConfirm = 0;
        this.timePerConfirm = 60;
        this.processTimeConfirm();
        this.renderBankList();
        // Format so tien LIVE: 2000000 -> 2,000,000 (noi bang code, khong can wire trong scene).
        if (this.editRut && this.editRut.node) {
            this.editRut.node.off('text-changed', this.onChangermoney, this);
            this.editRut.node.on('text-changed', this.onChangermoney, this);
        }
    },
    activeTimeConfirm: function () {
        this.isTimerConfirm = true;
        this.timerConfirm = this.timePerConfirm;
    },
    update: function (dt) {
        if (this.isTimerConfirm) {
            this.timerConfirm -= dt;

            this.processTimeConfirm();
        }
    },
    processTimeConfirm: function () {
        if (this.timerConfirm <= 0) {
            this.isTimerConfirm = false;
            this.btnConfirm.interactable = true;

            this.lbConfirms.forEach(function (lbConfirm) {
                lbConfirm.string = 'Lấy OTP';
            });
        } else {
            var self = this;
            var time = Math.round(self.timerConfirm);
            this.isTimerConfirm = true;
            this.btnConfirm.interactable = false;
            this.lbConfirms.forEach(function (lbConfirm) {
                lbConfirm.string = time;
            });
        }
    },
    onDisable: function () {
        cc.sys.isBrowser && this.removeEvent();
        if (this.editRut && this.editRut.node) this.editRut.node.off('text-changed', this.onChangermoney, this);
        this.moreHinhThuc.active = false;
        this.clean();
    },
    toggleHinhThuc: function () {
        this.moreHinhThuc.active = !this.moreHinhThuc.active;
        this.audioClick.loop = false;
        this.audioClick.play();
    },
    // Sinh danh sach ngan hang tu BANK_LIST bang code: chi can 1 item mau (bankItem).
    renderBankList: function () {
        if (!this.bankContent || !this.bankItem) return;   // chua gan node -> bo qua, khong crash
        var self = this;
        // Tach item mau ra khoi content 1 lan, giu lam khuon (khong bi xoa khi removeAllChildren).
        if (this.bankItem.parent) {
            this.bankItem.active = false;
            this.bankItem.removeFromParent(false);
        }
        this.bankContent.removeAllChildren();
        // EP Layout DOC len content -> item khong bi don 1 cuc. Force ca khi da co Layout sai kieu.
        var layout = this.bankContent.getComponent(cc.Layout) || this.bankContent.addComponent(cc.Layout);
        layout.enabled = true;
        layout.type = cc.Layout.Type.VERTICAL;
        layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        layout.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
        layout.spacingY = BANK_ROW_SPACING;                // khe ho giua 2 dong (chinh o dau file)
        BANK_LIST.forEach(function (name) {
            var item = cc.instantiate(self.bankItem);
            item.active = true;
            item.name = name;
            item.setPosition(0, 0);                        // reset vi tri de Layout tu xep
            item.height = BANK_ROW_HEIGHT;                 // EP chieu cao dong -> QUYET DINH khoang cach (chinh o dau file)
            var w = item.getComponent(cc.Widget);          // Widget GHIM item 1 cho -> tat di de Layout xep
            if (w) w.enabled = false;
            self.setItemLabel(item, name);
            var btn = item.getComponent(cc.Button);
            if (btn) btn.clickEvents = [];                 // bo click cu (neu co) de tranh goi nham handler
            item.off(cc.Node.EventType.TOUCH_END);
            item.on(cc.Node.EventType.TOUCH_END, function () { self.selectBank(name); }, self);
            self.bankContent.addChild(item);
        });
        layout.updateLayout();                             // ep xep lai NGAY trong frame nay
    },
    setItemLabel: function (item, text) {
        var labelNode = item.getChildByName('name');
        var lb = labelNode ? labelNode.getComponent(cc.Label) : item.getComponentInChildren(cc.Label);
        if (lb) lb.string = text;
    },
    // Chon 1 ngan hang tu list code sinh ra.
    selectBank: function (bankName) {
        if (this.labelHinhthuc) this.labelHinhthuc.string = bankName;
        this.bankSelect = bankName;
        if (this.moreHinhThuc) this.moreHinhThuc.active = false;
        if (this.audioClick) { this.audioClick.loop = false; this.audioClick.play(); }
    },
    // Legacy: item dat tay cu. List gio sinh bang code nen ham nay chi con lam SAFETY.
    // Guard: bo qua khi bi goi sai (vd gan nham vao su kien EditBox -> khong co event.target).
    hinhThucSelect: function (event, select) {
        if (!event || !event.target || !event.target.parent) return;
        var self = this;
        event.target.parent.children.forEach(function (obj) {
            if (obj.name === select) {
                var nameNode = obj.getChildByName('name');
                self.selectBank(nameNode ? nameNode.getComponent(cc.Label).string : select);
            }
        });
    },
    clickruttien: function () {
        if (this.bankSelect.length == 0) {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập chọn ngân hàng');
            return;
        }
        if (this.editNumber.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập Số tài khoản');
            return;
        }
        if (this.editName.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập Tên tài khoản');
            return;
        }

        if (this.editRut.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập số tiền cần rút');
            return;
        }
        this.ghichu.string = this.labelHinhthuc.string + " STK " + this.editNumber.string + " Tên TK " + this.editName.string;
        this.sotienview.string = " Số tiền rút " + helper.numberWithCommas(this.editRut.string);
        // this.nodedangky.active = false;
        // this.nodexacnhan.active = true;

        this.onSubmit()

    },
    addEvent: function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        for (var t in this.editboxs) {
            BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener("keydown", this.keyHandle, !1)
        }
    },
    chatbot: function () {
        cc.sys.openURL("https://t.me/CSKHSUMCLUBNL");
    },
    // Mo lich su RUT tien Bank. Tro nut "Lich su rut" -> Component CasoutBankView -> Handler historyClicked.
    historyClicked: function () {
        cc.Tool.getInstance().setItem('@bankHistoryType', 'RUT');   // bao HistoryView load lich su RUT (khong phai nap)
        cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.BANK);
    },
    removeEvent: function () {
        for (var t in this.editboxs) {
            BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener("keydown", this.keyHandle, !1)
        }
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },
    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.tab:
                this.isTop() && this.changeNextFocusEditBox();
                break;
            case cc.macro.KEY.enter:
                this.isTop() && this.onNapClick();
                break;
        }
    },
    changeNextFocusEditBox: function () {
        for (var t = !1, e = 0, i = this.editboxs.length; e < i; e++) {
            if (BrowserUtil.checkEditBoxFocus(this.editboxs[e])) {
                BrowserUtil.focusEditBox(this.editboxs[e]);
                t = !0;
                break
            }
        }
        !t && 0 < this.editboxs.length && BrowserUtil.focusEditBox(this.editboxs[0]);
    },
    isTop: function () {
        return !cc.RedT.inGame.notice.node.active && !cc.RedT.inGame.loading.active;
    },
    clean: function () {
        this.editRut.string = '';
    },
    // Format so tien nhap thanh 2,000,000. Luon strip ve so truoc roi cham phay lai (chiu ca khi da co phay).
    onChangermoney: function () {
        if (!this.editRut) return;
        var raw = helper.getOnlyNumberInString(this.editRut.string);   // bo dau phay/ky tu -> chi con so
        this.editRut.string = raw ? helper.numberWithCommas(raw) : '';
    },
    getOTPClicked: function () {
        // this.activeTimeOTPButton();
        var getOTPCommand = new cc.GetOTPCommand;
        getOTPCommand.execute(this, '', this.otpType);
        this.activeTimeConfirm();
    },
    onGetOTPResponse: function (response) {
        if (response.Message) {
            cc.PopupController.getInstance().showMessage(response.Message);
        } else {
            cc.PopupController.getInstance().showMessage('Lấy OTP thành công');
        }
    },

    onGetOTPResponseError: function (response) {
        cc.PopupController.getInstance().showMessageError(response.Message, response.ResponseCode);
    },

    onSubmit: function () {
        if (this.bankSelect.length == 0) {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập chọn ngân hàng');
            return;
        }
        if (this.editNumber.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập Số tài khoản');
            return;
        }
        if (this.editName.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập Tên tài khoản');
            return;
        }
        //  if (this.editOtp.string === '') {
        //     cc.PopupController.getInstance().showMessage('Vui lòng nhập mã OTP');
        //     return;
        // }if (this.editOtp.length =! 6) {
        //     cc.PopupController.getInstance().showMessage('Vui lòng nhập chính xác mã OTP');
        //     return;
        // }

        if (this.editRut.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập số tiền cần rút');
            return;
        }
        var magd = helper.randomString(7);
        this.VarSoTk = this.editNumber.string;
        this.VarNameTk = this.editName.string;
        this.VarAmount = helper.getOnlyNumberInString(this.editRut.string);
        this.VarCodeValue = "RK_" + magd;
        this.VarOtp = this.editOtp.string;
        this.VarBankCode = this.VarBankName = this.labelHinhthuc.string;
        var CastoutBankChargeOut = new cc.CastoutBankChargeOut();
        CastoutBankChargeOut.execute(this);
        this.audioClickRut.loop = false;
        this.audioClickRut.play();
    },
    onCastoutBankChargeOutResponse: function (data) {
        cc.PopupController.getInstance().showMessage(data.Message);
    },
    onCastoutBankChargeOutResponseError: function (data) {
        cc.PopupController.getInstance().showMessageError(data.Message);
    },

    onTotalAmount: function () {
        if (!this.CoinCasout || !this.editRut) return;   // CoinCasout chua gan -> bo qua, khong crash
        var coin = parseFloat(this.editRut.string);
        this.CoinCasout.string = isNaN(coin) ? '' : helper.numberWithCommas(coin);
    }
});
