
var netConfig = require('NetConfig');
(function () {
    cc.AviatorView = cc.Class({
        extends: cc.Component,
        properties: {
            lbNickName: cc.Label,
            lbBalance: cc.LabelIncrement,
            avatar: cc.Avatar,


            // Màn loading TRONG game (giống Baccarat): che khoảng trống lúc negotiate + connect hub
            // + chờ dữ liệu ván đầu. KHÁC màn loading ở sảnh (cái đó che lúc tải bundle).
            // Để trống được — code có guard, chưa gán node thì fallback spinner cũ, KHÔNG lỗi.
            loading: cc.Node,          // node gốc màn loading (bg che + logo + tàu + thanh), active=false mặc định
            progressBar: cc.ProgressBar,
            planet: cc.Node,           // quả cầu LĂN ở đầu vệt loading — PHẢI là con của node ProgressBar
            ship: cc.Node,             // tàu ở màn loading — bồng bềnh nhẹ như đang bay

            // Thời gian hiện màn loading TỐI THIỂU (ms) — chỉ để tránh CHỚP quá nhanh.
            // ĐỪNG để cao: người chơi ĐÃ ngồi nhìn màn loading ở SẢNH ~3.5s (tải 23MB art) trước khi
            // tới đây. Màn này chỉ còn phải che ~270ms connect hub -> đặt cao là bắt chờ suông,
            // tổng thời gian mở game phình lên (đo thật: 3.5s sảnh + 2.4s ở đây = 5.9s).
            // (cc.Class KHÔNG cho để số trần ở cấp class -> phải khai trong properties kèm type.)
            MIN_LOADING_MS: {
                default: 800,
                type: cc.Integer,
                tooltip: 'Thời gian hiện màn loading tối thiểu (ms). Chỉ để tránh chớp quá nhanh — KHÔNG nên để cao vì sảnh đã loading ~3.5s trước đó rồi.',
            },
        },

        onLoad: function () {
            this.controller = cc.AviatorController.getInstance();
            this.controller.setAviatorView(this);
            cc.ChatRoomController.getInstance().setHubView(this);
            this.hubName = cc.HubName.AviatorHub;
            this.subDomainName = cc.SubdomainName.AVIATOR;
            this.lastTimeReconnect = (new Date()).getTime();
            //check jonGame
            this.currAccId = null;

            this.showLoading();
            this.connectHub();
        },

        // Baccarat tween cứng 3s rồi tắt — thanh đó GIẢ, không gắn với việc gì.
        // Ở đây chạy tới 90% rồi ĐỢI: chỉ đầy 100% + tắt khi game THẬT SỰ có dữ liệu (joinGame về).
        showLoading: function () {
            if (!this.loading) { cc.PopupController.getInstance().showBusy(); return; }
            this.loading.active = true;
            this.loadStartMs = Date.now();
            this.gameReady = false;
            if (this.planet) this.planet.angle = 0;   // vào lại game -> reset góc lăn, không giữ góc ván trước
            if (this.progressBar) {
                cc.Tween.stopAllByTarget(this.progressBar);
                this.progressBar.progress = 0;
                // Pha 1 chạy TRỌN MIN_LOADING_MS tới 95% -> data thường về trước mốc đó nên vừa hết pha 1
                //   là đầy luôn: KHÔNG có quãng đứng hình. Để 95% (không phải 92%) cho cú vọt cuối
                //   chỉ còn 5% -> mượt, không giật.
                // Pha 2 chỉ dùng khi data về MUỘN: bò rất chậm 95%->99%, thà chậm còn hơn đứng im
                //   (đứng im người dùng đọc thành "treo/lỗi" — đúng triết lý _barAnimTick của LobbyView).
                // Pha 2 chỉ lộ ra khi data về MUỘN hơn MIN. Để 8s cho 4% là quá ì -> nhìn như treo;
                // 2.5s cho 4% vẫn là "chậm dần" nhưng mắt thấy rõ nó CÒN NHÚC NHÍCH.
                cc.tween(this.progressBar)
                    .to(this.MIN_LOADING_MS / 1000, { progress: 0.95 })
                    .to(2.5, { progress: 0.99 })
                    .start();
            }
            // Tàu BAY CHÉO LÊN-VỀ PHÍA TRƯỚC: xuất phát lùi-thấp, lao tới-lên dần suốt màn loading.
            // Đi cả 2 trục (x tiến + y lên) mới ra "đang bay tới"; chỉ đổi y thì trông như thang máy.
            // easing sineOut = vọt lúc đầu rồi giảm dần -> giống cất cánh, không phải trôi đều máy móc.
            // Lấy mốc GỐC trong prefab 1 lần — vào lại game không cộng dồn làm trôi mất tàu.
            if (this.ship) {
                cc.Tween.stopAllByTarget(this.ship);
                if (this.shipX0 === undefined) this.shipX0 = this.ship.x;
                if (this.shipY0 === undefined) this.shipY0 = this.ship.y;
                this.ship.x = this.shipX0 - 70;
                this.ship.y = this.shipY0 - 30;
                this.ship.angle = 0;
                // Bay TRỌN màn loading rồi bồng bềnh tiếp — KHÔNG để tween kết thúc rồi tàu đứng chết
                // (bản cũ tween cứng 1.8s: màn kéo dài hơn là tàu đứng như tượng).
                cc.tween(this.ship)
                    .to(this.MIN_LOADING_MS / 1000, { x: this.shipX0 + 70, y: this.shipY0 + 30, angle: -4 }, { easing: 'sineOut' })
                    .repeatForever(
                        cc.tween()
                            .to(1.3, { y: this.shipY0 + 42, angle: -2 }, { easing: 'sineInOut' })
                            .to(1.3, { y: this.shipY0 + 30, angle: -4 }, { easing: 'sineInOut' })
                    )
                    .start();
            }
            // Chốt chặn: mạng lỗi/không có data thì vẫn phải tắt, không để người chơi kẹt màn loading vĩnh viễn.
            // Gọi THẲNG _doHideLoading — KHÔNG gọi hideLoading (hàm đó có `if (gameReady) return`
            // nên khi data đã về mà lịch tắt lỡ hỏng thì chốt chặn sẽ không làm gì cả).
            this.scheduleOnce(this._doHideLoading, 10);
        },

        // Quả cầu LĂN theo đầu vệt loading. Chạy mỗi frame nên bám sát tween, không giật.
        // Vị trí: mép trái thanh + progress * chiều dài  (tính theo anchor nên anchorX nào cũng đúng).
        // Góc:    quãng đường / chu vi * 360  -> lăn ĐÚNG vật lý, không phải xoay bừa.
        //         Dấu ÂM = lăn theo chiều kim đồng hồ khi đi sang phải.
        update: function () {
            if (!this.loading || !this.loading.active) return;
            if (!this.planet || !this.progressBar) return;
            var bar = this.progressBar.node;
            if (!bar || !bar.width) return;
            var p = this.progressBar.progress;
            var dist = p * bar.width;
            this.planet.x = -bar.width * bar.anchorX + dist;
            var r = this.planet.width * 0.5;
            if (r > 0) this.planet.angle = -(dist / (2 * Math.PI * r)) * 360;
        },

        // Data về (joinGame) = sẵn sàng. Tính phần thời gian còn THIẾU so với MIN_LOADING_MS rồi hẹn
        // ĐÚNG MỘT LẦN. Gọi nhiều lần (reconnect) cũng vô hại nhờ cờ gameReady.
        hideLoading: function () {
            if (this.gameReady) return;   // đã xếp lịch tắt rồi -> bỏ qua
            this.gameReady = true;
            var elapsed = Date.now() - (this.loadStartMs || 0);
            console.log('[Aviator] LOADING: data ve sau ' + elapsed + 'ms | nguong toi thieu ' + this.MIN_LOADING_MS + 'ms');

            var wait = (this.MIN_LOADING_MS - elapsed) / 1000;
            this.unschedule(this._doHideLoading);
            if (wait > 0) this.scheduleOnce(this._doHideLoading, wait);
            else this._doHideLoading();
        },

        // CHỈ có việc tắt. KHÔNG kiểm tra lại thời gian, KHÔNG tự hẹn lại.
        // (Bản cũ `_tryHideLoading` tự gọi scheduleOnce(chính nó) TỪ BÊN TRONG callback của chính nó ->
        //  Cocos đang duyệt timer đó và XOÁ nó sau khi callback trả về, nên lần hẹn mới BỊ XOÁ LUÔN
        //  -> không bao giờ chạy -> màn loading treo tới chốt chặn 10s: ship đứng (tween 1.8s đã xong),
        //  bar+planet bò ri rí suốt pha 2 (8s cho 4%). Đúng triệu chứng user gặp.)
        _doHideLoading: function () {
            cc.PopupController.getInstance().hideBusy();
            if (!this.loading || !this.loading.active) return;
            this.unschedule(this.hideLoading);
            this.unschedule(this._doHideLoading);
            var self = this;
            if (this.ship) cc.Tween.stopAllByTarget(this.ship);
            if (this.progressBar) {
                cc.Tween.stopAllByTarget(this.progressBar);
                // chỉ còn ~5% -> 0.22s là đủ mượt mà không lê thê; giữ 0.1s cho mắt kịp thấy 100% rồi tắt
                cc.tween(this.progressBar).to(0.22, { progress: 1 }, { easing: 'sineOut' })
                    .delay(0.1)
                    .call(function () { self.loading.active = false; })
                    .start();
            } else {
                this.loading.active = false;
            }
        },

        onDestroy: function () {
            //Exit lobby
            this.sendRequestOnHub(cc.MethodHubName.EXIT_LOBBY);
            if (this.AviatorHub)
                this.AviatorHub.disconnect();
            this.unscheduleAllCallbacks();
            this.controller.setAviatorView(null);
            if (cc.sys.isNative) {
                cc.assetManager.releaseAsset('Aviator');
            }
            cc.PopupController.getInstance().hideBusy();
        },

        disconnectAndLogout: function () {
            if (this.AviatorHub) {
                this.AviatorHub.disconnect();
            }
            this.lastTimeReconnect = (new Date()).getTime();
        },

        connectHub: function () {
            var negotiateCommand = new cc.NegotiateCommand;
            negotiateCommand.execute(this, this.subDomainName);
        },

        reconnect: function () {
            this.lastTimeReconnect = (new Date()).getTime();
            this.AviatorHub.connect(this, this.hubName, this.connectionToken, true);
        },

        sendRequestOnHub: function (method, data) {
            switch (method) {
                case cc.MethodHubName.ENTER_LOBBY:
                    this.AviatorHub.enterLobby();
                    break;
                case cc.MethodHubName.EXIT_LOBBY:
                    this.AviatorHub.exitLobby();
                    break;
                case cc.MethodHubName.BET:
                    this.AviatorHub.bet(data[0], data[1]); //[betValue, autoCashoutAt]
                    break;
                case cc.MethodHubName.CASH_OUT:
                    this.AviatorHub.cashout();
                    break;
                case cc.MethodHubName.PLAY_NOW:
                    this.AviatorHub.playNow();
                    break;
                case cc.MethodHubName.SEND_MESSAGE:
                    this.AviatorHub.sendRoomMessage(data);
                    break;
            }
        },

        onSlotsNegotiateResponse: function (response) {
            this.connectionToken = response.ConnectionToken;
            this.AviatorHub = new cc.Hub;
            this.AviatorHub.connect(this, this.hubName, response.ConnectionToken);
        },

        onHubMessage: function (response) {
            if (response.M !== undefined && response.M.length > 0) {
                let res = response.M;
                res.map(m => {
                    switch (m.M) {
                        //Thoat game
                        case cc.MethodHubOnName.PLAYER_LEAVE:
                            this.playerLeave(m.A);
                            break;
                        //Thong tin game
                        case cc.MethodHubOnName.SESSION_INFO:
                            let info = m.A[0];
                            this.controller.updateInfo(info);
                            this.controller.updateBetView(info);
                            break;
                        case cc.MethodHubOnName.JOIN_GAME:
                            this.updatePlayerInfor(m.A[0]);
                            let gamehis = m.A[2];
                            this.controller.initListSoiCau(gamehis);
                            this.controller.updateSoiCau(gamehis);
                            var data = m.A[1];
                            this.controller.updateBetList(data.BetList, data.IsCrashed);
                            // Vào lại giữa phiên đang bay + mình còn cược sống -> khôi phục nút Cashout
                            var myAccId = cc.LoginController.getInstance().getUserId();
                            var myBet = (data.BetList || []).find(function (b) { return b.AccountID === myAccId; });
                            if (myBet && !data.IsCrashed && this.controller.getCurrentState() === cc.AviatorState.FLYING && !myBet.IsWon && (myBet.Award | 0) <= 0) {
                                this.controller.setBeted(true);
                                this.controller.updateBetView({ Phrase: cc.AviatorState.FLYING });
                            }
                            this.hideLoading();   // joinGame về = đã đủ info + betlist + lịch sử -> game render được rồi
                            break;
                        //Lich su phien
                        case cc.MethodHubOnName.GAME_HISTORY:
                            this.controller.initListSoiCau(m.A[0]);
                            this.controller.updateSoiCau(m.A[0]);
                            break;
                        case cc.MethodHubOnName.BET_LIST:
                            this.controller.updateBetList(m.A[0], m.A[1]);
                            break;
                        //Bet thanh cong
                        case cc.MethodHubOnName.BET_SUCCESS:
                            this.controller.setBeted(true);
                            this.lbBalance.tweenValueto(m.A[1]);
                            cc.BalanceController.getInstance().updateRealBalance(m.A[1]);
                            break;
                        //Ket qua
                        case cc.MethodHubOnName.PLAYER_CASH_OUT:
                            this.controller.updateCashout(m.A[0], m.A[1]);
                            break;
                        case cc.MethodHubOnName.CASH_OUT_SUCCESS:
                            if (m.A[0] > 0) {   //A[0]=tiền thắng (guard), A[1]=SỐ DƯ thật sau khi cộng
                                this.controller.setCashout(true);
                                this.lbBalance.tweenValueto(m.A[1]);
                                cc.BalanceController.getInstance().updateRealBalance(m.A[1]);
                            }
                            break;
                        //Thong bao
                        case cc.MethodHubOnName.PLAYER_MESSAGE:
                            cc.PopupController.getInstance().showMessage(m.A[0]);
                            break;
                        //thong bao
                        case cc.MethodHubOnName.MESSAGE:
                            if (!cc.game.isPaused())
                                cc.PopupController.getInstance().showMessage(m.A[0]);
                            break;
                        //nhan message chat
                        case cc.MethodHubOnName.RECEIVE_MESSAGE:
                            cc.ChatRoomController.getInstance().addChatContent(m.A);
                            this.controller.playerShowBubbleChat(m.A);
                            break;
                        case cc.MethodHubOnName.UPDATE_MULTIPLIER:
                            this.controller.updateMultiplier(m.A[0]);
                            break;
                        //Nổ hũ - unicast riêng mình: A[0]=phần hũ trúng, A[1]=số dư THẬT sau khi cộng
                        case cc.MethodHubOnName.JACKPOT_AWARD:
                            this.lbBalance.tweenValueto(m.A[1]);
                            cc.BalanceController.getInstance().updateRealBalance(m.A[1]);
                            cc.PopupController.getInstance().showMessage(
                                'Chúc mừng! Bạn trúng HŨ ' + cc.Tool.getInstance().formatNumber(m.A[0]));
                            break;
                        //Nổ hũ - cả phòng: A[0]=tổng hũ đã chia, A[1]=JSON [{a,w}]
                        case cc.MethodHubOnName.JACKPOT_WINNER:
                            this.showJackpotBroadcast(m.A[0], m.A[1]);
                            break;

                    }
                });

            } else if (response.R && response.R.AccountID) {
                this.currAccId = response.R.AccountID;
                // Set header NGAY từ EnterLobby (R phẳng: {Nickname, Avatar, Balance}) - không đợi joinGame
                this.lbNickName.string = response.R.Nickname;
                this.lbBalance.tweenValueto(response.R.Balance);
                cc.BalanceController.getInstance().updateRealBalance(response.R.Balance);
                this.avatar.setAvatar(cc.AccountController.getInstance().getAvatarImage(response.R.Avatar));
                this.sendRequestOnHub(cc.MethodHubName.PLAY_NOW);
                // KHÔNG tắt loading ở đây: mới có header, chưa có betlist/lịch sử.
                // Tắt ở JOIN_GAME (dữ liệu về đủ) — xem hideLoading().

            } else {
                //PING PONG
                if (response.I) {
                    this.AviatorHub.pingPongResponse(response.I);
                }
            }
        },

        onHubOpen: function () {
            this.sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);
            // KHÔNG showBusy nữa: đã có màn loading riêng, bật spinner lên nữa là ĐÈ CHỒNG lên nó.
            // Khi chưa gán node loading thì showLoading() tự fallback sang showBusy (xem showLoading).
            if (!this.loading) cc.PopupController.getInstance().showBusy();
        },

        onHubClose: function () {
            //reconnect
            if ((new Date()).getTime() - this.lastTimeReconnect >= netConfig.RECONNECT_TIME * 1000) {
                this.reconnect();
            } else {
                cc.director.getScheduler().schedule(this.reconnect, this, netConfig.RECONNECT_TIME, 0, 0, false);
            }
        },

        onHubError: function () {

        },

        updatePlayerInfor: function (data) {
            this.lbNickName.string = data.NickName;
            this.lbBalance.tweenValueto(data.Account.Balance);
            cc.BalanceController.getInstance().updateRealBalance(data.Account.Balance);
            this.avatar.setAvatar(cc.AccountController.getInstance().getAvatarImage(data.Account.Avatar));
        },

        // Nổ hũ - thông báo cả phòng. Bundle aviator KHÔNG có prefab hiệu ứng nổ hũ nên dùng popup message
        // (AviatorController cũng không có hàm hiệu ứng nào để gọi -> không bịa ra).
        showJackpotBroadcast: function (amount, winnersJson) {
            var winners = [];
            try { winners = JSON.parse(winnersJson || '[]') || []; } catch (e) { winners = []; }
            var myId = cc.LoginController.getInstance().getUserId();
            // mình trúng -> đã có popup riêng ở JACKPOT_AWARD rồi, không hiện chồng lần 2
            if (winners.some(function (w) { return w.a === myId; })) return;
            cc.PopupController.getInstance().showMessage(
                'NỔ HŨ! ' + winners.length + ' người chia ' + cc.Tool.getInstance().formatNumber(amount));
        },

        playerLeave: function (info) {
            var accID = info[0];
            if (accID === cc.LoginController.getInstance().getUserId()) {
                var message = info[1];
                cc.LobbyController.getInstance().destroyDynamicView(null);
                cc.PopupController.getInstance().showMessage(message)
            }
        },

        // ChatRoomView ẩn/hiện bằng animation (node LUÔN active) chứ không bằng node.active — nút
        // này chỉ mở, đóng là do nút bên trong khung chat lo. Giống BauCuaView.js:281.
        chatClick: function () {
            cc.ChatRoomController.getInstance().showChat();
        }
    });
}).call(this);
