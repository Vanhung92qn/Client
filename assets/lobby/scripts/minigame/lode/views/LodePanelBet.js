(function () {
    cc.LodePanelBet = cc.Class({
        extends: cc.Component,
        properties: {
            //Loai cuoc HIEN TAI (cc.LodeType). Set san = loai cua tab mac dinh; doi dong qua onSelectGate.
            gateType: 0,
            //Tieu de loai cuoc dang chon (vd "Đề đầu") - optional
            lbTitle: cc.Label,
            //He so an thua (vd "1 X 99") - optional
            lbRate: cc.Label,
            //Vung hien thi cac so da chon (Label nam trong ScrollView cuon ngang)
            lbNumbers: cc.Label,
            //O nhap tien cuoc
            edbBetValue: cc.EditBox,
            //Tong tien cuoc
            lbTotal: cc.Label,
            //Tien thang / 1 con
            lbWin: cc.Label,
        },
        onLoad: function () {
            this.numbers = [];
        },
        onEnable: function () {
            //Ap dung loai cuoc mac dinh khi panel hien
            this.applyGateType(this.gateType);
        },
        //===== Chon loai cuoc tu cac nut tab (gan vao MOI nut sub-tab) =====
        //clickEvent: customEventData = type (1..7)
        onSelectGate: function (event, customEventData) {
            var t = parseInt(customEventData);
            if (t === this.gateType) return; //bam lai chinh no -> giu nguyen lua chon
            this.applyGateType(t);
        },
        applyGateType: function (type) {
            this.gateType = parseInt(type) || 0;
            if (this.lbTitle) this.lbTitle.string = this.getTitleTypeBet(this.gateType) || "";
            this.updateRate();
            this.resetBet();
        },
        updateRate: function () {
            if (!this.lbRate) return;
            var mult = cc.LodeController.getInstance().getMultiplier(this.gateType) || 0;
            this.lbRate.string = "đặt 1 ăn " + mult;
        },
        //Mo popup chon so (gan vao btnChoice)
        openPicker: function () {
            if (!this.gateType) {
                return cc.PopupController.getInstance().showMessage("VUI LÒNG CHỌN LOẠI CƯỢC!");
            }
            var controller = cc.LodeController.getInstance();
            controller.setActiveBetPanel(this);
            //Tai su dung logic mo popup + chan phien WAITING san co cua LodeView
            controller.LodeView.onOpenChooseView(this, this.gateType);
        },
        //Popup tra so ve (duoc goi tu LodeChooseView.onConfirmSelection)
        onNumbersChosen: function (numbers) {
            this.numbers = (numbers || []).slice();
            this.lbNumbers.string = this.formatNumbers(this.numbers).join('-');
            this.recompute();
        },
        //Nut "X" o hang so -> xoa cac so da chon
        clearNumbers: function () {
            this.numbers = [];
            if (this.lbNumbers) this.lbNumbers.string = "";
            this.recompute();
        },
        //Nut "X" o hang tien -> xoa tien cuoc
        clearAmount: function () {
            if (this.edbBetValue) this.edbBetValue.string = "";
            this.recompute();
        },
        //Bam chip menh gia (gan vao tung nut chip, customEventData = menh gia: "1000","5000",...)
        onChip: function (event, customEventData) {
            var add = parseInt(customEventData) || 0;
            var cur = parseFloat(cc.Tool.getInstance().removeDot(this.edbBetValue.string)) || 0;
            this.edbBetValue.string = cc.Tool.getInstance().formatNumber(cur + add);
            this.recompute();
        },
        //Go tay tien cuoc (gan vao EditBox: Editing Changed + Editing Did Ended)
        onEditingChanged: function () {
            var val = cc.Tool.getInstance().removeDot(this.edbBetValue.string);
            this.edbBetValue.string = cc.Tool.getInstance().formatNumber(val);
            this.recompute();
        },
        //Tinh lai Tong tien cuoc + Tien thang / 1 con
        recompute: function () {
            var bet = this.getBetValue();
            var count = this.numbers.length;
            //Xien: giu nguyen tong tien; con lai: tien x so luong so
            var total = this.isXien() ? bet : bet * count;
            var mult = cc.LodeController.getInstance().getMultiplier(this.gateType) || 0;
            var win = bet * mult;
            if (this.lbTotal) this.lbTotal.string = cc.Tool.getInstance().formatNumber(total);
            if (this.lbWin) this.lbWin.string = cc.Tool.getInstance().formatNumber(win);
        },
        //Dat cuoc (gan vao btnBet). Toan bo validate tien chuyen tu popup ve day.
        placeBet: function () {
            if (!this.gateType) {
                return cc.PopupController.getInstance().showMessage("VUI LÒNG CHỌN LOẠI CƯỢC!");
            }
            if (cc.LodeController.getInstance().getCurrPharse() === cc.LodePharse.WAITING) {
                return cc.PopupController.getInstance().showMessage("VUI LÒNG CHỜ PHIÊN TIẾP THEO!");
            }
            if (!this.numbers || this.numbers.length === 0) {
                return cc.PopupController.getInstance().showMessage("VUI LÒNG CHỌN SỐ!");
            }
            var bet = this.getBetValue();
            if (isNaN(bet) || bet <= 0) {
                return cc.PopupController.getInstance().showMessage("VUI LÒNG NHẬP TIỀN CƯỢC!");
            }
            //De: toi thieu 1.000; con lai (Lo, De dau/cuoi, Xien): toi thieu 5.000
            var min = (this.gateType === cc.LodeType.DE) ? 1000 : 5000;
            if (bet < min) {
                return cc.PopupController.getInstance().showMessage("TIỀN CƯỢC TỐI THIỂU " + cc.Tool.getInstance().formatNumber(min) + "!");
            }
            var total = this.isXien() ? bet : bet * this.numbers.length;
            if (total > cc.BalanceController.getInstance().getBalance()) {
                return cc.PopupController.getInstance().showMessage("SỐ DƯ KHÔNG ĐỦ!");
            }
            cc.LodeController.getInstance().sendRequestOnHub(
                cc.MethodHubName.BET, this.gateType, bet, this.formatNumbers(this.numbers).join(',')
            );
            this.resetBet();
        },
        //===== Helpers =====
        getBetValue: function () {
            return parseFloat(cc.Tool.getInstance().removeDot(this.edbBetValue.string)) || 0;
        },
        isXien: function () {
            return this.gateType === cc.LodeType.XIEN2
                || this.gateType === cc.LodeType.XIEN3
                || this.gateType === cc.LodeType.XIEN4;
        },
        getTitleTypeBet: function (type) {
            switch (parseInt(type)) {
                case cc.LodeType.DE:      return 'Đề';
                case cc.LodeType.DE_DAU:  return 'Đề đầu';
                case cc.LodeType.DE_CUOI: return 'Đề cuối';
                case cc.LodeType.LO:      return 'Lô';
                case cc.LodeType.XIEN2:   return 'Xiên 2';
                case cc.LodeType.XIEN3:   return 'Xiên 3';
                case cc.LodeType.XIEN4:   return 'Xiên 4';
            }
            return '';
        },
        //Them so 0 vao truoc so < 10 (tru DE_DAU/DE_CUOI giu nguyen 1 chu so)
        formatNumbers: function (arr) {
            if (this.gateType === cc.LodeType.DE_DAU || this.gateType === cc.LodeType.DE_CUOI) {
                return arr.map(function (n) { return "" + n; });
            }
            return arr.map(function (n) { return (n < 10) ? "0" + n : "" + n; });
        },
        resetBet: function () {
            this.numbers = [];
            if (this.edbBetValue) this.edbBetValue.string = "";
            if (this.lbNumbers) this.lbNumbers.string = "";
            this.recompute();
        },
    });
}.call(this));
