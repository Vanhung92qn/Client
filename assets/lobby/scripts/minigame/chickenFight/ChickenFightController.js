/**
 * Created by Nobita on 07/29/2023.
 */

(function () {
    let ChickenFightController;

    ChickenFightController = (function () {
        let instance;

        function ChickenFightController() {
            this.sumaryAllSideBet = 0;
        }

        instance = void 0;

        ChickenFightController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }

            return instance.prototype;
        }

        ChickenFightController.prototype.setView = function (view) {
            return this.view = view;
        };

        ChickenFightController.prototype.getView = function () {
            return this.view;
        };

        ChickenFightController.prototype.setStateView = function (stateView) {
            return this.stateView = stateView;
        };

        ChickenFightController.prototype.getStateView = function () {
            return this.stateView;
        };

        //Set CurrentState
        ChickenFightController.prototype.setCurrentState = function (state) {
            return this.currentState = state;
        };
        //Get CurrentState
        ChickenFightController.prototype.getCurrentState = function () {
            return this.currentState;
        };

        ChickenFightController.prototype.changeStateView = function (phrase) {
            return this.stateView.handleChangePharse(phrase);
        };

        ChickenFightController.prototype.updateChickenFight = function (sessionInfo) {
            return this.stateView.updateChickenFight(sessionInfo);
        };

        ChickenFightController.prototype.startFighting = function () {
            return this.stateView.startFighting();
        };

        ChickenFightController.prototype.showWinChickenFight = function (winType, sessionInfo) {
            return this.stateView.showWinChickenFight(winType, sessionInfo);
        };

        ChickenFightController.prototype.sendRequestOnHub = function (method, data1, data2) {
            return this.view.sendRequestOnHub(method, data1, data2);
        };

        ChickenFightController.prototype.setBetView = function (betView) {
            return this.betView = betView;
        };

        ChickenFightController.prototype.getBetView = function () {
            return this.betView;
        };

        ChickenFightController.prototype.updateTotalUserBetSide = function (betSide, total) {
            return this.betView.updateTotalUserBetSide(betSide, total);
        };
        
        ChickenFightController.prototype.resetLabelBet = function () {
            return this.betView.reset()
        };

        ChickenFightController.prototype.setMoveChipView = function (moveChipView) {
            return this.moveChipView = moveChipView;
        };

        ChickenFightController.prototype.getMoveChipView = function () {
            return this.moveChipView;
        };

        ChickenFightController.prototype.updateTotalBetValue = function (betSide, totalBet) {
            return this.betView.updateTotalBetValue(betSide, totalBet);
        };

        ChickenFightController.prototype.updateTotalBet = function (betInfo) {
            return this.betView.updateTotalBet(betInfo);
        };

        ChickenFightController.prototype.activeBetAgain = function (active) {
            return this.betView.activeBetAgain(active);
        };

        ChickenFightController.prototype.setSID = function (sID) {
            return this.sID = sID;
        };

        ChickenFightController.prototype.getSID = function () {
            return this.sID;
        };

        //Cap nhat vi tri player trong ban
        ChickenFightController.prototype.updatePositionPlayerUI = function (positionUI) {
            return this.positionUI = positionUI;
        };
        ChickenFightController.prototype.getPositionUI = function () {
            return this.positionUI;
        };

        ChickenFightController.prototype.setInfoView = function (infoView) {
            return this.infoView = infoView;
        };
        ChickenFightController.prototype.getInfoView = function () {
            return this.infoView;
        };

        //Hien thi thong tin chat
        ChickenFightController.prototype.playerShowBubbleChat = function (data) {
            return this.infoView.playerShowBubbleChat(data);
        };

        ChickenFightController.prototype.updateBalancePlayer = function (data) {
            return this.infoView.updateBalancePlayer(data);
        };

        ChickenFightController.prototype.updateBalanceCurrPlayer = function (balance) {
            return this.infoView.updateBalanceCurrPlayer(balance);
        };

        //Cap nhat thong tin nguoi choi
        ChickenFightController.prototype.updatePlayerInfor = function (data) {
            return this.infoView.updatePlayerInfor(data);
        };
        //Hien thi thong tin thang cua nguoi choi
        ChickenFightController.prototype.winResult = function (data) {
            return this.infoView.winResult(data);
        };
        //Hien thi thong tin vip win
        ChickenFightController.prototype.winResultVip = function (data) {
            return this.infoView.winResultVip(data);
        };
        //Cap nhat balance player hien tai
        ChickenFightController.prototype.updateBalanceCurrPlayer = function (data) {
            return this.infoView.updateBalanceCurrPlayer(data);
        };
        //Cap nhat so du cua nguoi choi
        ChickenFightController.prototype.updatePlayerBalance = function (data) {
            return this.infoView.updatePlayerBalance(data);
        };

        //Hubob PlayerLeave
        ChickenFightController.prototype.unRegisterAllPlayer = function () {
            return this.infoView.unRegisterAllPlayer();
        };

        //Cap nhat danh sach vip player
        ChickenFightController.prototype.updatePlayersUI = function (data) {
            return this.infoView.updatePlayersUI(data);
        };

        //Reset lai UI player
        ChickenFightController.prototype.resetPlayerUI = function () {
            return this.infoView.resetPlayerUI();
        };

        ChickenFightController.prototype.onNotifyChangePhrase = function (data) {
            return this.infoView.onNotifyChangePhrase(data);
        };

        ChickenFightController.prototype.updateRoomTimer = function (timer) {
            return this.infoView.updateRoomTimer(timer);
        };

        ChickenFightController.prototype.drawGraph = function (list) {
            return this.infoView.drawGraph(list);
        };
        
        //Cap nhat so du cua nguoi choi
        ChickenFightController.prototype.updateBalance = function (balance) {
            this.view.updateBalance(balance)
        };
        //playerLeave
        ChickenFightController.prototype.playerLeave = function (info) {
            this.view.playerLeave(info);
            this.infoView.playerLeave(info);
        };

        ChickenFightController.prototype.getSfDice = function (index) {
            return this.view.getSfDice(index);
        };

        //HubOn updateSessionInfo
        ChickenFightController.prototype.updateSessionInfo = function (data) {
            return this.infoView.updateSessionInfo(data);
        };
        //HubOn summaryPlayer
        ChickenFightController.prototype.updatePlayersInGame = function (data) {
            return this.infoView.updatePlayersInGame(data);
        };

        ChickenFightController.prototype.setTotalWinResult = function (result) {
            return this.totalWinResultResponse = result;
        };
        ChickenFightController.prototype.getTotalWinResult = function () {
            return this.totalWinResultResponse;
        };

        ChickenFightController.prototype.setWinResult = function (result) {
            return this.winResultResponse = result;
        };
        ChickenFightController.prototype.getWinResult = function () {
            return this.winResultResponse;
        };

        //LogBet
        //
        //
        //Set betBlogSession
        ChickenFightController.prototype.setBetLogSession = function (sessionId) {
            return this.betLogSession = sessionId;
        };
        //Lay thong tin betLogSession
        ChickenFightController.prototype.getBetLogSession = function () {
            return this.betLogSession;
        };

        ChickenFightController.prototype.clearBetLog = function (sessionID) {
            this.betLog = this.betLog.filter(log => log.sessionID > (sessionID - 1));
        };
        ChickenFightController.prototype.getBetLogBySessionID = function (sessionID) {
            return this.betLog.filter(log => log.sessionID == sessionID - 1);
        };
        //Set betBlog
        ChickenFightController.prototype.setBetLog = function (betInfo) {
            return this.betLog.push(betInfo);
        };
        //Lay thong tin betLog
        ChickenFightController.prototype.getBetLog = function () {
            return this.betLog;
        };
        //Khoi tao/ reset betLog
        ChickenFightController.prototype.initBetLog = function () {
            return this.betLog = [];
        };


        //Menu

        return ChickenFightController;


    })();

    cc.ChickenFightController = ChickenFightController;
}).call(this);
