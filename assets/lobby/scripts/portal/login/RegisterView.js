/**
 * Created by Nofear on 3/14/2019.
 */

var netConfig = require('NetConfig');

(function () {
    cc.RegisterView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeRegister: cc.Node,
            editBoxUsername: cc.EditBox,
            editBoxPassword: cc.EditBox,
            editBoxRePassword: cc.EditBox,

            editBoxPhoneNumber: cc.EditBox, //#KingViet

            editBoxCode: cc.EditBox,

            editBoxNickname: cc.EditBox, // D2: gop nickname vao form dang ky (keo EditBox nickname vao day)

           // lbError: cc.Label,
            imageUrlCaptcha: cc.ImageUrl,

           
          
            animationMenuNation: cc.Animation, //#KingViet
            lbNation: cc.Label, //#KingViet
            spriteNation: cc.Sprite,
        },

        // use this for initialization
        onLoad: function () {
            cc.LoginController.getInstance().setRegisterView(this);
        },

        onEnable: function () {
           // this.lbError.string = '';
            this.editBoxUsername.string = '';

         

            this.editBoxPassword.string = '';
            this.editBoxRePassword.string = '';
            if (this.editBoxNickname) this.editBoxNickname.string = '';

            this._accountCreated = false; // D2: reset trang thai chain (tao account -> update nickname)
            this.IsLanding = false;
        },

        getCaptcha: function () {
            var getCaptchaCommand = new cc.GetCaptchaCommand;
            getCaptchaCommand.execute(this);
        },

        showRegister: function (enable) {
            this.nodeRegister.active = enable;
            if (enable) {
                this.getCaptcha();
                var tool = cc.Tool.getInstance();
                if (tool.getItem('@isLanding') !== null) {
                    if (tool.getItem('@isLanding') === 'true') {
                        this.editBoxUsername.string = tool.getItem('@usernameRegis').toString();
                        this.editBoxPassword.string = tool.getItem('@passwordRegis').toString();
                        this.editBoxRePassword.string = tool.getItem('@rePasswordRegis').toString();
                        this.IsLanding = true;
                    }
                }
            }
        },

        backClicked: function () {
            this.showRegister(false);
            cc.LoginController.getInstance().showLogin(true);
        },

        // Mở màn QUÊN MẬT KHẨU từ màn Đăng ký. showForgotPass tự ẩn register/login/nickname/otp
        // (state machine _hideAuthExcept trong LoginController) -> chỉ hiện đúng màn quên mật khẩu.
        forgotPassClicked: function () {
            cc.LoginController.getInstance().showForgotPass(true);
        },

        //Response
        onGetCaptchaResponse: function (response) {
            this.imageUrlCaptcha.get('data:image/png;base64,' + cc.Tool.getInstance().removeStr(response[1], '\r\n'));
        },

        onRegisterResponse: function (response) {
            // se set Access Token o day -> de update duoc nick name luon
            if (response.Token) {
                cc.ServerConnector.getInstance().setToken(response.Token);
            }

            // [D2-fold] non-VK + da gui nickname trong CreateAccount -> account da du (DisplayName + NextVIP + token),
            // VAO SANH LUON, bo round-trip UpdateNickName. (Trung ten da bi server chan -103 o nhanh loi, account khong mo coi.)
            var folded = this.editBoxNickname && this.nickname &&
                         !cc.Config.getInstance().getDomainVK().includes(netConfig.HOST);
            if (folded) {
                cc.PopupController.getInstance().hideBusy();
                if (response.ConnectionToken) {
                    cc.LoginController.getInstance().setPortalConnectionToken(response.ConnectionToken);
                }
                cc.LoginController.getInstance().setUserId(response.AccountInfo.AccountID);
                cc.LoginController.getInstance().setLoginResponse(response.AccountInfo);
                cc.LoginController.getInstance().setNextVPResponse(response.NextVIP);
                cc.LoginController.getInstance().setNickname(response.AccountInfo.AccountName);
                // [P1] destroyLoginView TRƯỚC loginSuccess (deactivate popup ngay, không lộ ~1s mobile).
                cc.LobbyController.getInstance().destroyLoginView();
                cc.LobbyController.getInstance().loginSuccess();
                cc.DDNA.getInstance().updateAccountName();
                return;
            }

            cc.LoginController.getInstance().setUserId(response.AccountInfo.AccountID);

            if (this.editBoxNickname) {
                // D2 (gop): account tao xong -> noi THANG sang UpdateNickname, GIU overlay, KHONG popup
                this._accountCreated = true;
                this._submitNickname();
            } else {
                // Fallback: chua keo editBoxNickname -> dung popup nickname cu
                cc.PopupController.getInstance().hideBusy();
                cc.LoginController.getInstance().showNickname(true);
            }
            // cc.DDNA.getInstance().newPlayer();
        },

        // D2: gui nickname da nhap o form (dung chung UpdateNicknameCommand voi popup cu).
        _submitNickname: function () {
            // this.nickname + this.nationCode da co san tu form -> RegisterView dong vai "controller"
            var cmd = new cc.UpdateNicknameCommand;
            cmd.execute(this);
        },

        // Thanh cong -> vao sang luon (mirror NicknameView.onUpdateNicknameResponse).
        onUpdateNicknameResponse: function (response) {
            cc.PopupController.getInstance().hideBusy();
            if (response.Token) {
                cc.ServerConnector.getInstance().setToken(response.Token);
            }
            cc.LoginController.getInstance().setLoginResponse(response.AccountInfo);
            cc.LoginController.getInstance().setNextVPResponse(response.NextVIP);
            cc.LobbyController.getInstance().destroyLoginView();
            cc.LobbyController.getInstance().loginSuccess();
            cc.PopupController.getInstance().showMessage(response.Message, response.ResponseCode);
            cc.DDNA.getInstance().updateAccountName();
        },

        // Loi (vd nickname trung) -> an overlay + bao loi, GIU form de sua nickname.
        // _accountCreated van = true => bam "Dang ky" lan nua CHI update nickname (khong tao account lai).
        onUpdateNicknameResponseError: function (response) {
            cc.PopupController.getInstance().hideBusy();
            cc.PopupController.getInstance().showMessage(response.Message);
        },

        selectNationEvent: function(event, data) {
            var index = cc.Config.getInstance().getIndexByNation(data.toString());

            if (this.gameAssets === undefined) {
                this.gameAssets = cc.LobbyController.getInstance().getGameAssets();
            }

            this.spriteNation.spriteFrame = this.gameAssets.sfNations[index];

            this.nationCode = data.toString();
            this.lbNation.string = '+' + data.toString();
            this.animationMenuNation.play('hideDropdownMenu');
        },

        //Click
        openMenuNationClicked: function () {
            this.animationMenuNation.play('showDropdownMenu');
        },

        hideMenuNationClicked: function () {
            this.animationMenuNation.play('hideDropdownMenu');
        },

        createAccountClicked: function () {
            //this.lbError.string = '';
            this.username = this.editBoxUsername.string;
            this.password = this.editBoxPassword.string;
            this.rePassword = this.editBoxRePassword.string;
            this.captcha = this.editBoxCode.string;
            this.nickname = this.editBoxNickname ? this.editBoxNickname.string : ''; // D2

            if (this.username === '') {
               // this.lbError.string = 'Vui lòng nhập tên tài khoản';
			   cc.PopupController.getInstance().showMessage('Vui lòng nhập tên tài khoản');
                return;
            }

            if (this.password === '') {
				cc.PopupController.getInstance().showMessage('Vui lòng nhập mật khẩu');
               // this.lbError.string = 'Vui lòng nhập mật khẩu';
                return;
            }

            if (this.rePassword === '') {
				cc.PopupController.getInstance().showMessage('Vui lòng nhập lại mật khẩu');
               // this.lbError.string = 'Nhập lại mật khẩu không khớp';
                return;
            }
			 if (this.rePassword !== this.password) {
				cc.PopupController.getInstance().showMessage('Nhập lại mật khẩu không chính xác');
               // this.lbError.string = 'Nhập lại mật khẩu không khớp';
                return;
            }
            if (this.captcha === '') {
				cc.PopupController.getInstance().showMessage('Vui lòng nhập mã Captcha');
               // this.lbError.string = 'Vui lòng nhập mã xác nhận';
                return;
            }

            // D2: validate nickname ngay trong form (chi khi da gan editBoxNickname)
            if (this.editBoxNickname) {
                if (cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
                    if (this.lbNation && this.lbNation.string === 'Chọn quốc gia') {
                        cc.PopupController.getInstance().showMessage('Chọn quốc gia');
                        return;
                    }
                }
                if (this.nickname === '') {
                    cc.PopupController.getInstance().showMessage('Vui lòng nhập tên hiển thị');
                    return;
                }
            }

            cc.Tool.getInstance().setItem('@isLanding', false);

            cc.PopupController.getInstance().showBusy(true);   // LoadingOverlay muot cho ca dang ky + dat nickname

            // D2: neu account da tao (lan truoc nickname bi trung) -> CHI update nickname, khong tao account lai
            if (this._accountCreated) {
                this._submitNickname();
                return;
            }

            var registerCommand = new cc.RegisterCommand;
            registerCommand.execute(this);
        },

        refreshCaptchaClicked: function () {
            this.getCaptcha();
        },

       
    });
}).call(this);
