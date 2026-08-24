(function () {
    cc.AviatorBetView = cc.Class({
        extends: cc.Component,
        properties: {
            lbBetValue: cc.Label,
            lbStopMultiplier: cc.Label,
            popupConfigAuto: cc.Node,
            btnSteupAuto: cc.Button,
            btnStopAuto: cc.Button,
            btnBet: cc.Button,
            btnBetLater: cc.Button,
            btnCashout: cc.Button,
            btnCancel: cc.Button,
            btn5k: cc.Button,
            btn50k: cc.Button,
            btn500k: cc.Button,
            btn5m: cc.Button,
            btnAuto: cc.Button,
            btnAutoStop: cc.Button,
            btnResetBetValue: cc.Button,
            sprBtnAuto: [cc.SpriteFrame],
            sprStopAuto: [cc.SpriteFrame],
        },

        onLoad: function () {
            this.controller = cc.AviatorController.getInstance();
            this.controller.setAviatorBetView(this);
            this.popupConfigAuto.active = false;
            this.isAutoBet = false;
            this.isAutoStop = false;
            this.isBetLater = false;
            this.hesodung = 1.01;
            this.lbStopMultiplier.string = this.hesodung + 'x';
            // Số dư LIVE (BalanceController) — KHÔNG dùng ảnh chụp lúc login: nạp tiền/thắng giữa phiên
            // sẽ không được thấy -> chặn cược oan dù còn tiền. Khớp pattern Seven77/TQButtonView.
            this.betValue = 0;
            if (cc.BalanceController.getInstance().getBalance() < 5000) {
                this.lbBetValue.string = "0";
            } else {
                this.lbBetValue.string = "5000";
                this.betValue = 5000;
            }
            this.isResetInputOnWaiting = false;
            this.resetInput();
        },

        resetInput: function () {
            this.isBeted = false;
            this.isCashout = false;
            this.btnBet.node.active = true;
            this.btnBet.interactable = true;
            this.btnBetLater.node.active = false;
            this.btnCashout.node.active = false;
            this.btnCancel.node.active = false;
            this.btnSteupAuto.node.active = true;
            this.btnStopAuto.node.active = false;

            this.btnResetBetValue.interactable = true;

            this.enableBetButtons(true);

            if (this.isBetLater || this.isAutoBet) {
                this.enableBetButtons(false);
            } else {
                this.resetBetValue();
            }
        },

        updatePhrase: function (info) {
            this.phrase = info.Phrase;
            let Multiplier = info.Multiplier;

            switch (info.Phrase) {
                case cc.AviatorState.WAITING:
                    if (!this.isResetInputOnWaiting) {
                        this.resetInput();
                        this.isResetInputOnWaiting = true;
                    }
                    break;
                case cc.AviatorState.BETTING:
                    if (this.isBeted && !this.isBetLater) {
                        this.btnBet.node.active = true;
                        this.btnBet.interactable = false;
                        this.btnBetLater.node.active = false;
                        this.btnCashout.node.active = false;
                        this.btnCancel.node.active = false;

                        // this.btnResetBetValue.interactable = false;
                        this.enableBetButtons(false);
                    } else if (this.isBetLater && this.isBeted) {
                        this.btnBet.node.active = false;
                        this.btnBetLater.node.active = true;
                        this.btnBetLater.interactable = true;
                        this.btnCashout.node.active = false;
                        this.btnCancel.node.active = false;

                        //this.btnResetBetValue.interactable = true;
                        this.enableBetButtons(true);
                    } else if (this.isAutoBet && !this.isBeted) {
                        this.sendRequestBet(this.betValue);
                        this.btnBet.node.active = false;
                        this.btnBetLater.node.active = false;
                        this.btnBetLater.interactable = false;
                        this.btnCashout.node.active = false;
                        this.btnCancel.node.active = true;
                        this.btnCancel.interactable = false;

                        //this.btnResetBetValue.interactable = false;
                        this.enableBetButtons(false);
                    } else if (!this.isAutoBet && !this.isBeted && this.isBetLater) {
                        this.sendRequestBet(this.betValue);
                        this.isBetLater = false;
                    } else if (this.isBeted && this.isBetLater) {
                        this.btnBet.node.active = false;
                        this.btnBetLater.node.active = true;
                        this.btnBetLater.interactable = false;
                        this.btnCashout.node.active = false;
                        this.btnCancel.node.active = false;

                        //this.btnResetBetValue.interactable = false;
                        this.enableBetButtons(false);
                    }

                    this.isResetInputOnWaiting = false;
                    break;
                case cc.AviatorState.FLYING:
                    if (!this.isBeted && !this.isBetLater && !this.isAutoBet) {
                        this.btnBet.node.active = false;
                        this.btnBetLater.node.active = true;
                        this.btnCashout.node.active = false;
                        this.btnCancel.node.active = false;

                        //this.btnResetBetValue.interactable = true;
                        this.enableBetButtons(true);
                    } else if (!this.isCashout && this.isBeted && !this.isAutoStop) {
                        this.btnBet.node.active = false;
                        this.btnBetLater.node.active = false;
                        this.btnCashout.node.active = true;
                        this.btnCancel.node.active = false;

                        this.btnResetBetValue.interactable = false;
                    } else if (this.isCashout && !this.isBetLater) {
                        this.btnBet.node.active = false;
                        this.btnBetLater.node.active = true;
                        this.btnCashout.node.active = false;
                        this.btnCancel.node.active = false;

                        //this.btnResetBetValue.interactable = true;
                        this.enableBetButtons(true);
                    } else if (this.isCashout && this.isBetLater) {
                        this.btnBet.node.active = false;
                        this.btnBetLater.node.active = false;
                        this.btnCashout.node.active = false;
                        this.btnCancel.node.active = true;

                        //this.btnResetBetValue.interactable = true;
                        this.enableBetButtons(true);
                    } else if (
                        !this.isCashout &&
                        this.isAutoStop &&
                        Multiplier >= this.hesodung
                    ) {
                        // Auto-cashout do SERVER xu ly (autoCashoutAt gui kem bet, rut dung moc chinh xac).
                        // KHONG goi client-side cashoutClicked() nua -> tranh double-fire; xac nhan rut den qua cashoutSuccess.
                        // this.cashoutClicked();
                        this.btnBet.node.active = false;
                        this.btnBetLater.node.active = false;
                        this.btnCashout.node.active = false;
                        this.btnCancel.node.active = false;
                        this.btnStopAuto.node.active = true;

                        //this.btnResetBetValue.interactable = false;
                        this.enableBetButtons(false);

                        this.isResetInputOnWaiting = false;
                    }
                    break;
                case cc.AviatorState.CRASHED:
                    this.restoreBetValueLabel();   // hết bay -> thôi hiện tiền nhân, trả về số đã cược
                    this.btnBet.node.active = true;
                    this.btnBet.interactable = false;
                    //this.btnBetLater.node.active = true;
                    this.btnCashout.node.active = false;
                    //this.btnCancel.node.active = false;

                    //this.btnResetBetValue.interactable = true;
                    this.enableBetButtons(false);

                    this.isResetInputOnWaiting = false;
                    break;
            }
        },

        onClickAutoBet: function () {
            if (this.isAutoBet) {
                this.isAutoBet = false;
                this.btnAuto.getComponent(cc.Sprite).spriteFrame = this.sprBtnAuto[0];
            } else {
                this.isAutoBet = true;
                this.btnAuto.getComponent(cc.Sprite).spriteFrame = this.sprBtnAuto[1];
            }
        },

        onClickAutoStop: function () {
            if (this.isAutoStop) {
                this.isAutoStop = false;
                this.btnAutoStop.getComponent(cc.Sprite).spriteFrame = this.sprStopAuto[0];
            } else {
                this.isAutoStop = true;
                this.btnAutoStop.getComponent(cc.Sprite).spriteFrame = this.sprStopAuto[1];
            }
        },

        onClickSetupAuto: function () {
            this.popupConfigAuto.active = !this.popupConfigAuto.active;
        },

        onClickStopAuto: function () {
            this.isAutoBet = false;
            this.isAutoStop = false;
            this.btnStopAuto.node.active = false;
            this.btnSteupAuto.node.active = true;
        },

        chooseBetValue: function (event, data) {
            // 2 lỗi bản cũ: (1) so với curBalance = ảnh chụp lúc login -> nạp tiền xong vẫn bị chặn;
            // (2) so 1 CHIP LẺ thay vì TỔNG đang đặt -> số dư 60k bấm chip 50k hai lần đều lọt -> đặt 100k -> server đá -504.
            var balance = cc.BalanceController.getInstance().getBalance();
            var next = parseInt(this.betValue || 0) + parseInt(data);
            if (next > balance) {
                cc.PopupController.getInstance().showMessage('Số dư không đủ');
                return;
            }
            this.betValue = next;
            this.lbBetValue.string = cc.Tool.getInstance().formatNumber(this.betValue);
        },

        betClicked: function () {
            if (this.betValue <= 0) {
                cc.PopupController.getInstance().showMessage('Cược tối thiểu 5000');
                return;
            }
            this.sendRequestBet(this.betValue);
        },

        cashoutClicked: function () {
            this.sendRequestCashout();
        },

        betLaterClicked: function () {
            if (this.betValue <= 0) {
                cc.PopupController.getInstance().showMessage("Cược tối thiểu 5K");
                return;
            }

            this.isBetLater = true;
            this.btnCancel.node.active = true;
            this.btnBetLater.node.active = false;

            this.enableBetButtons(false);
        },

        cancelClicked: function () {
            this.isBetLater = false;
            this.btnCancel.node.active = false;
            this.btnBetLater.node.active = true;

            this.enableBetButtons(true);
        },

        setMultiplier: function (multiplier) {
            this.hesodung = parseFloat(multiplier);
            this.lbStopMultiplier.string = multiplier + 'x';
        },

        sendRequestBet: function (betValue) {
            var autoCashoutAt = this.isAutoStop ? this.hesodung : 0; //gui moc auto cho server (server-side auto-cashout)
            return this.controller.sendRequestOnHub(cc.MethodHubName.BET, [betValue, autoCashoutAt]);
        },

        sendRequestCashout: function () {
            return this.controller.sendRequestOnHub(cc.MethodHubName.CASH_OUT);
        },

        enableBetButtons: function (enable) {
            this.btnBet.interactable = enable;
            this.btn5k.interactable = enable;
            this.btn50k.interactable = enable;
            this.btn500k.interactable = enable;
            this.btn5m.interactable = enable;
            //this.btn1k.interactable = enable;
            //this.btnAuto.interactable = enable;
            this.btnResetBetValue.interactable = enable;
        },

        resetBetValue: function () {
            if (this.phrase == cc.AviatorState.FLYING && !this.isCashout && this.isBeted) {
                return;
            }

            this.betValue = 0;
            this.lbBetValue.string = "0";
        },

        // Đang bay + mình còn vé sống -> lbBetValue hiện TIỀN ĐANG CÓ (cược x hệ số) thay vì số cược đứng im,
        // để người chơi thấy ngay rút bây giờ được bao nhiêu.
        // Gọi từ controller.updateMultiplier (bắn MỖI tick 100ms) — KHÔNG dùng updatePhrase vì sessionInfo
        // chỉ bắn 1 lần/ván lúc vào Flying (engine ghim Ellapsed=0 + front dedup) -> số sẽ đứng ở 1.00x.
        updateWinPreview: function (multiplier) {
            if (this.phrase !== cc.AviatorState.FLYING) return;
            if (!this.isBeted || this.isCashout) return;
            var bet = parseInt(this.betValue);
            if (!(bet > 0)) return;
            this.lbBetValue.string = cc.Tool.getInstance().formatNumber(Math.floor(bet * multiplier));
        },

        // Rút xong -> đổi nút NGAY tại đây, KHÔNG chờ updatePhrase.
        // updatePhrase chỉ chạy ĐÚNG 1 LẦN/ván lúc vào Flying: front dedup sessionInfo theo
        // (SessionID, Phrase, Ellapsed) mà engine ghim Ellapsed=0 suốt Flying -> 2 nhánh isCashout
        // ở updatePhrase (dòng ~142 và ~150) THỰC TẾ không bao giờ chạy -> nút "DỪNG" đứng im,
        // người chơi bấm lại là ăn "Không thể rút (đã rút / máy bay đã nổ)!" từ server.
        // (Cùng gốc với việc lbValue từng đứng ở 1.00x -> phải bám kênh updateMultiplier 100ms.)
        setCashout: function (isCashout) {
            this.isCashout = isCashout;
            if (!isCashout || this.phrase !== cc.AviatorState.FLYING) return;

            // đúng trạng thái mà updatePhrase đã thiết kế sẵn cho vé đã rút
            this.btnBet.node.active = false;
            this.btnCashout.node.active = false;
            this.btnStopAuto.node.active = false;
            this.btnBetLater.node.active = !this.isBetLater;
            this.btnBetLater.interactable = true;   // nhánh auto-bet có thể đã tắt -> bật lại kẻo nút chết
            this.btnCancel.node.active = this.isBetLater;
            this.enableBetButtons(true);

            // Ô tiền đang hiện TIỀN THẮNG (updateWinPreview) trong khi betValue vẫn là số cược cũ ->
            // bấm "Cược lại" sẽ đặt số KHÁC số đang hiện. Trả ô về đúng betValue.
            this.restoreBetValueLabel();
        },

        // Nổ mà chưa rút -> thua: trả ô về đúng số tiền đã cược, không để treo số nhân ảo.
        restoreBetValueLabel: function () {
            var bet = parseInt(this.betValue);
            this.lbBetValue.string = cc.Tool.getInstance().formatNumber(bet > 0 ? bet : 0);
        },
    });
}).call(this);
