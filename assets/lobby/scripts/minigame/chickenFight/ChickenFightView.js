/**
 * Created by Nobita on 07/29/2023.
 */

var netConfig = require('NetConfig');

(function () {
    cc.ChickenFightView = cc.Class({
        extends: cc.Component,

        properties: {
            //spriteSound: cc.Sprite,
            //sfSounds: [cc.SpriteFrame], //0=on, 1=off
            //spriteBack: cc.Sprite,
            //nodeRegisterLeave: cc.Node,
            nodeParentChat: cc.Node,
            prefabChat: cc.Prefab,
            lbTotalUser: cc.Label,
            spGates: [cc.SpriteFrame]
        },

        onLoad() {
            this.controller = cc.ChickenFightController.getInstance();
            this.controller.setView(this);
            this.controller.initBetLog();
            this.controller.setBetLogSession(1);
            this.lastTimeReconnect = (new Date()).getTime();
            //this.currentState = -1;
            this.isAuthorized = false;
            cc.PopupController.getInstance().showBusy();
            this.connectHubChickenFight();
            var nodeChat = cc.instantiate(this.prefabChat);
            this.nodeParentChat.addChild(nodeChat);
            this.accountId = cc.LoginController.getInstance().getUserId();
        },

        start: function () {
            cc.AudioController.getInstance().enableSound(true);
            cc.AudioController.getInstance().enableMusic(true);
        },

        disconnectAndLogout: function () {
            if (this.chickenFightHub) {
                this.chickenFightHub.disconnect();
            }
            this.lastTimeReconnect = (new Date()).getTime();
            this.isAuthorized = false;
            this.lastTimeReconnect = (new Date()).getTime();
            //timeAll = 60;
        },

        connectHubChickenFightAuthorize: function () {
            if (!this.isAuthorized) {
                if (this.chickenFightHub) {
                    this.chickenFightHub.disconnect();
                }

                this.lastTimeReconnect = (new Date()).getTime();
                this.isAuthorized = true;
                //cc.PopupController.getInstance().showBusy();
                var chickenFightNegotiateCommand = new cc.ChickenFightNegotiateCommand;
                chickenFightNegotiateCommand.execute(this);

                return false;
            } else {
                return true;
            }
        },

        connectHubChickenFight: function () {
            //console.log('connectHubChickenFight');
            cc.PopupController.getInstance().showBusy();
            this.isAuthorized = false;
            var chickenFightNegotiateCommand = new cc.ChickenFightNegotiateCommand;
            chickenFightNegotiateCommand.execute(this);
        },

        reconnect: function () {
            this.lastTimeReconnect = (new Date()).getTime();
            this.chickenFightHub.connect(this, cc.HubName.ChickenFightHub, this.connectionToken, true);
            this.lastTimeReconnect = (new Date()).getTime();
            //timeAll = 60;
        },

        onEnable: function () {
            cc.BalanceController.getInstance().updateBalance(cc.BalanceController.getInstance().getBalance());
            // cc.PopupController.getInstance().showBusy();
        },

        onDestroy: function () {
            cc.LobbyJackpotController.getInstance().pauseUpdateJackpot(false);
            cc.ChickenFightController.getInstance().sendRequestOnHub(cc.MethodHubName.EXIT_LOBBY);

            if (this.interval !== null) {
                clearInterval(this.interval);
            }

            if (this.chickenFightHub) {
                this.chickenFightHub.disconnect();
            }

            this.unscheduleAllCallbacks();
            cc.ChickenFightController.getInstance().setView(null);

            if (cc.sys.isNative) {
                cc.loader.releaseResDir('chickenFight/prefabs');
                cc.loader.releaseResDir('chickenFight/images');
            }
            cc.PopupController.getInstance().hideBusy();
        },

        sendRequestOnHub: function (method, data1, data2) {
            switch (method) {
                case cc.MethodHubName.ENTER_LOBBY:
                    this.chickenFightHub.enterLobby();
                    break;
                case cc.MethodHubName.EXIT_LOBBY:
                    this.chickenFightHub.exitLobby();
                    break;
                case cc.MethodHubName.BET:
                    this.chickenFightHub.bet(data1, data2);
                    break;
                case cc.MethodHubName.PLAY_NOW:
                    this.chickenFightHub.playNow();
                    break;
                case cc.MethodHubName.REGISTER_LEAVE_ROOM:
                    this.chickenFightHub.registerLeaveRoom();
                    break;
                case cc.MethodHubName.UNREGISTER_LEAVE_ROOM:
                    this.chickenFightHub.unRegisterLeaveRoom();
                    break;
                case cc.MethodHubName.SEND_MESSAGE:
                    this.chickenFightHub.sendRoomMessage(data1);
                    break;
            }
        },

        onChickenFightNegotiateResponse: function (response) {
            this.connectionToken = response.ConnectionToken;
            this.chickenFightHub = new cc.Hub;
            this.chickenFightHub.connect(this, cc.HubName.ChickenFightHub, response.ConnectionToken);
        },

        onHubMessage: function (response) {
            //console.log(response);
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
                            // console.log("SESSION_INFO", m.A);
                            let info = m.A[0];
                            this.controller.onNotifyChangePhrase(info);
                            //Cap nhat tong tien bet
                            this.controller.updateTotalBet(info);
                            break;
                        case cc.MethodHubOnName.FIGHTING:
                            // console.log('FIGHTING')
                            // console.log(m.A[0]);
                            this.controller.updateChickenFight(m.A[0]);
                            //this.controller.updateChickenFight(info);
                            break;
                        case cc.MethodHubOnName.END_FIGHTING:
                            // console.log('FIGHTING')
                            // console.log(m.A[0]);
                            this.controller.showWinChickenFight(m.A[1], m.A[0]);
                            //this.controller.updateChickenFight(info);
                            break;
                        //Thong tin game
                        case cc.MethodHubOnName.NOTIFY_CHANGE_PHRASE:
                            // console.log("NOTIFY_CHANGE_PHRASE", m.A);
                            this.controller.onNotifyChangePhrase(m.A[0]);
                            break;
                        case cc.MethodHubOnName.UPDATE_ROOM_TIME:
                            this.controller.updateRoomTimer(parseInt(m.A[0]));
                            break;
                        //Danh sach nguoi choi
                        case cc.MethodHubOnName.SUMMARY_PLAYER:
                            this.controller.updatePlayersInGame(m.A[0]);
                            break;
                        //Thong tin game
                        case cc.MethodHubOnName.JOIN_GAME:
                            this.controller.updatePlayerInfor(m.A[0]);
                            this.controller.onNotifyChangePhrase(m.A[1]);
                            //Cap nhat tong tien bet cua user
                            var self = this;
                            if (m.A[3].length > 0) {
                                m.A[3].map(betData => {
                                    self.controller.updateTotalUserBetSide(betData.BetSide, betData.SummaryBet);
                                }, this);
                            }
                            //Cap nhat chip cua phien
                            this.controller.updateTotalBet(m.A[1]);
                            //this.controller.updateChipForBetSession(m.A[4]);
                            this.controller.drawGraph(m.A[2])
                            break;
                        //Cap nhat danh sach player
                        case cc.MethodHubOnName.VIP_PLAYERS:
                            break;
                            let dataPlayer = m.A[0];
                            // console.log(dataPlayer);
                            if (dataPlayer.length > 0) {
                                this.controller.updatePlayersUI(dataPlayer);
                            }

                            break;
                        //Lich su bet
                        case cc.MethodHubOnName.GAME_HISTORY:
                            // console.log("GAME_HISTORY", m.A);
                            this.controller.drawGraph(m.A[0])
                            break;
                        //Thong tin bet cua player
                        case cc.MethodHubOnName.BET_OF_ACCOUNT:
                            this.controller.updateBetOfAccount(m.A[0]);
                            break;
                        //Bet thanh cong
                        case cc.MethodHubOnName.BET_SUCCESS:
                            let sessionID = this.controller.getBetLogSession();

                            this.controller.setBetLog({
                                sessionID: sessionID,
                                value: m.A[0].BetValue,
                                betSide: m.A[0].BetSide
                            });
                            //Cap nhat balance
                            this.controller.updateBalanceCurrPlayer(m.A[1]);
                            cc.BalanceController.getInstance().updateRealBalance(m.A[1]);

                            this.controller.updateTotalUserBetSide(m.A[0].BetSide, m.A[0].SummaryBet);
                            //this.controller.moveChipBet(m.A[0].BetValue, m.A[0].BetSide, cc.BacaratChipOf.PLAYER, m.A[0].AccountID);
                            this.updateMoveChip([m.A[0].BetValue, m.A[0].BetSide], true);
                            break;
                        //Nguoi choi bet
                        case cc.MethodHubOnName.PLAYER_BET:
                            if (m.A[0] != cc.LoginController.getInstance().getUserId()) {
                                //Update chip player
                                this.controller.updateBalancePlayer(m.A);
                                //Move Chip
                                //this.controller.moveChipBet(m.A[1], m.A[2], cc.BacaratChipOf.USERS, m.A[0]);
                                this.updateMoveChip([m.A[1], m.A[2]], false);
                            }
                            break;

                        //Ket qua
                        case cc.MethodHubOnName.WIN_RESULT:
                            //KO hien thi luon khi co winResult
                            this.controller.setWinResult(m.A[0]);
                            cc.BalanceController.getInstance().updateRealBalance(m.A[0].Balance);
                            break;
                        case cc.MethodHubOnName.WIN_RESULT_VIP:
                            // console.log("WIN_RESULT_VIP", m.A);
                            break;
                            if (m.A.length > 0) {
                                this.controller.setWinVipResult(m.A[0]);
                            }
                            break;
                        case cc.MethodHubOnName.TOTAL_WIN_MONEY:
                            this.controller.setTotalWinResult(parseInt(m.A[0]));
                            break;
                        //thong bao khi dat cuoc
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

                    }
                });

            } else if (response.R && response.R.AccountID) {
                this.currAccId = response.R.AccountID;
                this.sendRequestOnHub(cc.MethodHubName.PLAY_NOW);
                //sau khi enterLobby
                cc.PopupController.getInstance().hideBusy();

            } else {
                //PING PONG
                if (response.I) {
                    this.chickenFightHub.pingPongResponse(response.I);
                }
            }
        },

        onHubOpen: function () {
            cc.PopupController.getInstance().hideBusy();
            this.sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);
            cc.PopupController.getInstance().showBusy();
        },

        onHubClose: function () {
            if ((new Date()).getTime() - this.lastTimeReconnect >= netConfig.RECONNECT_TIME * 1000) {
                this.reconnect();
            } else {
                cc.director.getScheduler().schedule(this.reconnect, this, netConfig.RECONNECT_TIME, 0, 0, false);
            }
        },

        onHubError: function () {

        },

        playerLeave: function (info) {
            var accID = info[0];
            if (accID === cc.LoginController.getInstance().getUserId()) {
                var message = info[1];
                cc.LobbyController.getInstance().destroyDynamicView(null);
                cc.PopupController.getInstance().showMessage(message)
            }
        },

        chatClicked: function () {
            cc.ChatRoomController.getInstance().showChat();
        },

        updateMoveChip: function (data, isCurrentUser) {
            // this.controller.moveChipView.moveChip(data, isCurrentUser);
            cc.AudioController.getInstance().playSound(cc.AudioTypes.CHIP_BET);

            this.controller.moveChipView.moveChipWithStartPos(data, isCurrentUser);
        },

        updateTotalUser: function (totalUser) {
            this.lbTotalUser.string = totalUser.toString();
        },

        backClicked: function () {
            cc.LobbyController.getInstance().destroyDynamicView(null);
        },

        getSfDice: function(index) {
            return this.spGates[index];
        }
    });
}).call(this);
