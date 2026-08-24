/**
 * Created by Nobita on 01/12/2022.
 */

(function () {
    cc.SicBoInfoView = cc.Class({
        "extends": cc.Component,
        properties: {
            lbSessionID: cc.Label,
            lbHash: cc.Label,
            lbMd5Decript: cc.Label,
			lbUserTotalBet: cc.Label,
            nodeHash: cc.Node,
            nodeString: cc.Node,
            lblTextNoti: cc.Label,
            lbTimer: cc.Label,
            lbTotalBetTai: cc.Label,
            lbTotalBetXiu: cc.Label,
            lbTotalBetChan: cc.Label,
            lbTotalBetLe: cc.Label,
            nodeDiceBox: cc.Node,
            // Spine GỘP (idle/rung/open) - thay boxBase + lid + diceBoxJounce
            skeDiceBox: sp.Skeleton,
            // Sprite plate.png (bat up khong dia) - hien khi user bat Nan + cho cham
            batUpStatic: cc.Node,
            // Container 'dices' (parent cua dice1/2/3 IN BOWL).
            // Wire truc tiep node 'dices' (sibling cua skeDiceBox) vao day.
            nodeDicesInBowl: cc.Node,
            // Spine Dealer (idle/win/win_big)
            skeDealer: sp.Skeleton,
            effectMd5: sp.Skeleton,
            lstPlayers: [cc.SicBoPlayer],
            lbTotalPlayer: cc.Label,
            lbTotalUserWin: cc.Label,
            lbStatus: cc.Label,
            lbLastResult: cc.Label,
            lbResult: cc.Label,
            spDice1: cc.Sprite,
            spDice2: cc.Sprite,
            spDice3: cc.Sprite,
            spDices: [cc.SpriteFrame],
            circleTimeLeft: cc.ProgressBar,
			circleBar: cc.Node,
            spShakerCupGlow: cc.Sprite,
        },

        onLoad: function () {
            this.controller = cc.SicBoController.getInstance();
            this.controller.setSicBoInfoView(this);
            this.activeTimer(false);
            this.showStatus(null);
            this.currentState = null;
            this.interval = null;
            this.time = 0;
            this.sumaryAllSideBet = 0;
            this.currPlayer = this.lstPlayers[0];
            this.animTotalUserWin = this.lbTotalUserWin.node.getComponent(cc.Animation);
            this.animationMess = this.lblTextNoti.node.parent.getComponent(cc.Animation);
            // Cache vi tri goc cua batUpStatic
            if (this.batUpStatic) {
                this.rootPasBatUp = this.batUpStatic.position;
                this.batUpStatic.active = false;
            }
            // Force initial state khi load: bat dong 'idle'.
            if (this.skeDiceBox) this.skeDiceBox.setAnimation(0, 'idle', true);
            if (this.skeDealer) this.skeDealer.setAnimation(0, 'idle', true);
            // _setDicesVisible(false) DOI sang start() de tranh race condition:
            // SicBoInfoView.onLoad chay TRUOC SicBoResultView.onLoad -> sicboResultView
            // chua register -> fallback fail -> dice container van active mac dinh.
            // start() goi sau khi tat ca onLoad xong, _setDicesVisible chac chan ok.
        },

        start: function () {
            // Initial dice hidden (Spine 'idle' = bat dong).
            // Chay o start() de cross-component refs (sicboResultView) san sang.
            this._setDicesVisible(false);
        },

        onEnable: function () {
            this.resetPlate();
        },

        onDestroy: function () {
            cc.SicBoController.getInstance().setSicBoInfoView(null);

            try {
                if (this.interval) {
                    clearInterval(this.interval);
                }
            } catch (e) {

            }
        },

        // User tha tay sau khi keo plate -> ran xong: an plate va reveal text/glow.
        // skeDiceBox da o trang thai 'open' + dice da show san tu activeOpenPlate
        // (de keo plate la lo dice dan dan underneath).
        openEndDiaNan: function(){
            if (this.batUpStatic && this.batUpStatic.active) {
                this.batUpStatic.active = false;
                if (this.rootPasBatUp) this.batUpStatic.position = this.rootPasBatUp;
                this._revealResult();
            }
        },

        // Logic Nan dung theo style Tai Xiu:
        // - LUON open + show dice khi vao OpenPlate state (skeDiceBox o 'open' frame cuoi
        //   suot Show Result, den khi phien moi resetPlate moi quay ve 'idle').
        // - Nan OFF: kem theo show lbResult/glow ngay (auto reveal).
        // - Nan ON:  plate.png che len top. User keo plate -> dice lo dan underneath.
        //           User tha tay -> plate an + lbResult/glow moi hien (ran thanh cong).
        activeOpenPlate: function () {
            if (this.skeDiceBox) this.skeDiceBox.node.active = true;
            cc.tween(this.nodeDiceBox).to(0.3, { position: cc.v2(0, 0), scale: 0.5 }).start();
            let isNan = this.controller.getIsNan();
            if (this.batUpStatic) this.batUpStatic.active = isNan;
            // Sau 0.6s (cho tween zoom xong) play bowl reveal
            cc.director.getScheduler().schedule(function () {
                this._revealBowl();
                if (!isNan) {
                    // Nan OFF: lo luon text + glow
                    this._revealResult();
                }
                // Nan ON: doi user keo-tha plate, openEndDiaNan se goi _revealResult
            }, this, 0, 0, 0.6, false);
        },

        // Bowl reveal: Spine 'open' + show dice. KHONG addAnimation 'idle' o day
        // - giu bat o trang thai open (frame cuoi) den khi phien moi (resetPlate
        // moi set ve 'idle').
        _revealBowl: function () {
            if (this.skeDiceBox) this.skeDiceBox.setAnimation(0, 'open', false);
            this._setDicesVisible(true);
        },

        // Result text + glow. Set opacity 255 truc tiep + tween fade out sau 7s.
        // Bo .to(0, opacity:0).to(0.15, opacity:255) fade in chain - khong tin
        // cay neu opacity dang stuck o 0 tu tween truoc, hoac parent.active vua
        // set true cung tick nen tween khong kip cap nhat.
        _revealResult: function () {
            if (this.lbResult && this.lbResult.node && this.lbResult.node.parent) {
                var parent = this.lbResult.node.parent;
                parent.stopAllActions();   // huy tween cu (neu co fade out dang chay)
                parent.active = true;
                parent.opacity = 255;       // visible NGAY khong qua tween
                cc.tween(parent)
                    .delay(7)
                    .to(0.15, { opacity: 0 })
                    .start();
            }
            if (this.spShakerCupGlow) {
                var glowNode = this.spShakerCupGlow.node;
                glowNode.stopAllActions();
                glowNode.opacity = 255;
                cc.tween(glowNode)
                    .delay(7)
                    .to(0.15, { opacity: 0 })
                    .start();
            }
        },
		
        reset: function () {
            this.currentState = 999;
            this.lastTime = 999;
        },

        nFormatter: function (num, digits) {
            if (!digits) {
                digits = 2;
            }

            const lookup = [
                { value: 1, symbol: "" },
                { value: 1e3, symbol: "K" },
                { value: 1e6, symbol: "M" },
                { value: 1e9, symbol: "G" },
                { value: 1e12, symbol: "T" },
                { value: 1e15, symbol: "P" },
                { value: 1e18, symbol: "E" }
            ];
            const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
            var item = lookup.slice().reverse().find(function (item) {
                return num >= item.value;
            });
            return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
        },

		timeProgressBar: function (time) {
			if (time === 0) {
				this.circleBar.active = false;
			} else {
				this.circleBar.active = true;
			}
			
			cc.tween(this.circleTimeLeft)
				.to(time, { progress: 0 })
				.call(() => { this.circleTimeLeft.progress = 1; })
				.start();
		},
		
        updateTimerInfo: function (time) {			
            if (this.lbTimer) {
                var timeInt = time;
                if (timeInt >= 0) {
                    this.lbTimer.string = (timeInt < 10 ? "0" : "") + timeInt;

                    if (timeInt < 10) {
                        cc.tween(this.lbTimer.node)
                            .to(0, { scale: 1.5 })
                            .to(0.3, { scale: 1 })
                            .start();
                    }
                    switch (this.currentState) {						
                        case cc.SicBoState.Shaking: 
							this.timeProgressBar(timeInt);
                            break;
                        case cc.SicBoState.Betting:
                            this.timeProgressBar(timeInt);
                            break;
                        case cc.SicBoState.OpenPlate:
                            this.timeProgressBar(timeInt);
                            break;
                        case cc.SicBoState.ShowResult:
                            this.timeProgressBar(timeInt);
                            break;
                   }
                }
            }
        },

        updateResultLastSession: function (data) {
            const lastSession = data[0];
            this.spDice1.spriteFrame = this.spDices[lastSession.FirstDice - 1];
            this.spDice2.spriteFrame = this.spDices[lastSession.SecondDice - 1];
            this.spDice3.spriteFrame = this.spDices[lastSession.ThirdDice - 1];
            this.lbLastResult.string = lastSession.DiceSum + ' / ' + (lastSession.DiceSum > 10 ? 'TÀI' : 'XỈU');
        },

        showRuleClick: function () {
            cc.SicBoMainController.getInstance().createRuleView();
        },
		
        updateTotalBet: function (data) {
            // Server sessionInfo gui Totals tai moi state transition (4 lan/cycle).
            // Sync vao local cache de accumulate tu playerBet sau do.
            this._localTotals = this._localTotals || [0, 0, 0, 0, 0];
            this._localTotals[1] = (data && data.Totals && data.Totals[1]) || 0;
            this._localTotals[2] = (data && data.Totals && data.Totals[2]) || 0;
            this._localTotals[3] = (data && data.Totals && data.Totals[3]) || 0;
            this._localTotals[4] = (data && data.Totals && data.Totals[4]) || 0;
            this._renderTotals();
        },

        // Tang dan totals khi co playerBet/betSuccess - khong cho khach hang doi sessionInfo
        accumulateBetTotal: function (betSide, betValue) {
            if (!this._localTotals) this._localTotals = [0, 0, 0, 0, 0];
            betSide = parseInt(betSide);
            betValue = parseInt(betValue) || 0;
            // Chi count 4 cua chinh (Tai=1, Xiu=2, Chan=3, Le=4) - cua phu khong co lbl
            if (betSide >= 1 && betSide <= 4) {
                this._localTotals[betSide] += betValue;
                this._renderTotals();
            }
        },

        _renderTotals: function () {
            try {
                if (this.lbTotalBetTai) this.lbTotalBetTai.string = this.nFormatter(this._localTotals[1]);
                if (this.lbTotalBetXiu) this.lbTotalBetXiu.string = this.nFormatter(this._localTotals[2]);
                if (this.lbTotalBetChan) this.lbTotalBetChan.string = this.nFormatter(this._localTotals[3]);
                if (this.lbTotalBetLe) this.lbTotalBetLe.string = this.nFormatter(this._localTotals[4]);
            } catch (e) {}
        },

        resetTotals: function () {
            this._localTotals = [0, 0, 0, 0, 0];
            this._renderTotals();
        },

		updateBetOfAccount: function (betValue) {
			this.sumaryAllSideBet += betValue;
			this.lbUserTotalBet.string = cc.Tool.getInstance().formatNumberK(this.sumaryAllSideBet);
		},
		
        onNotifyChangePhrase: function (data) {
            var totalDice = data.Result.Dice1 + data.Result.Dice2 + data.Result.Dice3;
            if (data.Result.Dice1 == data.Result.Dice2 && data.Result.Dice1 == data.Result.Dice3) {
                this.lbResult.string = totalDice + ' - ' + ('BÃO');
            } else {
                this.lbResult.string = totalDice + ' - ' + (totalDice > 10 ? 'TÀI' : 'XỈU');
            }
			const state = parseInt(data.Phrase);
			const time = parseInt(data.Elapsed);

			if (state === cc.SicBoState.Betting) {
			  this.nodeHash.active = true;
			  this.nodeString.active = false;
			} else {
				this.nodeHash.active = state === cc.SicBoState.EndBetting;
				this.nodeString.active = !this.nodeHash.active;
			}

            switch (state) {
                case cc.SicBoState.None:
                    if (this.currentState !== state) {
                        this.controller.enableClickBet(false);
                        this.showStatus(null);
                    }
                    break;
                case cc.SicBoState.Waiting://Cho phien moi
                    if (this.currentState !== state) {
                        this.resetPlate();
                        //Reset trang thai
                        this.controller.enableClickBet(false);
                        //Stop animation
                        this.controller.stopAnimationWin();
                        //Clear chip
                        this.controller.clearAllChips();
                        //Khoi tao lai paramchip
                        this.controller.initParamChips();
                        this.controller.resetUserBets();
                        //Reset lbTotalBetTai/Xiu/Chan/Le ve 0 cho phien moi
                        this.controller.resetTotals();
                        //Clear session truoc
                        this.controller.clearBetLog(this.controller.getBetLogSession());
                        //Tao session betlog
                        this.controller.setBetLogSession(this.controller.getBetLogSession() + 1);
                        this.resetPlayerUI();
                        this.updateTotalUserWin(null);
                        this.playAnimDiceBox(cc.SicBoState.Waiting);
                        this.showStatus("CHỜ PHIÊN MỚI");
                    }
                    break;
                case cc.SicBoState.Shaking://Xoc
                    if (this.currentState !== state) {
                        this.playAnimDiceBox(cc.SicBoState.Shaking);
                        this.controller.enableClickBet(false);
                    }
                    break;
                case cc.SicBoState.Betting://Dat Cua
                    if (time >= 34) {
                        this.effectMd5.node.active = true;
                        this.effectMd5.setAnimation(0, 'animation_md5', false);
                    }
                    if (this.currentState !== state) {
                        this.resetPlate();
                        // Play 'rung' CHI khi tu Waiting -> Betting (= phien thuc su moi).
                        // Truong hop user join giua chung (currentState null) hoac
                        // reconnect mid-Betting (currentState = OpenPlate/ShowResult)
                        // -> bo qua rung, giu idle.
                        if (this.currentState === cc.SicBoState.Waiting) {
                            this.playAnimDiceBox(cc.SicBoState.Betting);
                        }
                        this.controller.setWinResult(null);
                        this.controller.setWinVipResult(null);
                        this.controller.setTotalWinResult(null);
                        this.controller.enableClickBet(true);
                        this.activeTimer(true);
                        this.showStatus("ĐẶT CỬA");
                        this.lbHash.string = data.Md5Encript;
                    }
                    break;
                case cc.SicBoState.EndBetting://Dat Cua
                    if (this.currentState !== state) {
                        this.controller.enableClickBet(false);
                        this.showStatus("HẾT THỜI GIAN ĐẶT");
                    }
                    break;
                case cc.SicBoState.OpenPlate://Mo bat
						this.effectMd5.node.active = true;
						this.effectMd5.setAnimation(0, 'animation_key', false);
						this.effectMd5.setCompleteListener(() => {
							this.effectMd5.node.active = false;
						});
                    if (this.currentState !== state) {
                        this.controller.enableClickBet(false);
                        this.controller.setDicesResult(data);
                        this.activeOpenPlate();
                        this.activeTimer(false);
                        this.lbMd5Decript.string = data.Md5Decript;
                        this.showStatus(null);
                    }
                    break;
                case cc.SicBoState.ShowResult://Ket qua
                    if (this.currentState !== state) {
                        this.playAnimDiceBox(cc.SicBoState.ShowResult);
                        this.controller.initChipsWin();
                        this.controller.enableClickBet(false);
                        this.controller.onShowResult(data);
                        // Dealer animation: chi react khi user THANG.
                        // User thua -> giu idle (khong play charge - user yeu cau giu don gian).
                        if (this.skeDealer) {
                            var winData = this.controller.getWinResult();
                            if (winData && winData.Award > 0) {
                                var betAmt = parseInt(winData.BetAmount) || 0;
                                var awardAmt = parseInt(winData.Award) || 0;
                                var anim = (betAmt > 0 && awardAmt >= 5 * betAmt) ? 'win_big' : 'win';
                                this.skeDealer.setAnimation(0, anim, false);
                            }
                        }
                        this.activeTimer(true);
                        this.showStatus(null);
                        this.lbMd5Decript.string = data.Md5Decript;
                    }
                    break;
            }
            this.controller.setCurrentState(state);
            this.currentState = state;
            this.updateSessionId(data.SessionID);
            //Cap nhat tong tien bet
            this.controller.updateTotalBet(data);
        },

        resetPlayerUI: function () {
			this.lbUserTotalBet.string = '0';
			this.sumaryAllSideBet = 0;
            this.lstPlayers.map(player => {
                player.resetPlayerResultUI();
            }, this)
        },
		
        //Cap nhat thong tin nguoi choi hien tai
        updatePlayerInfor: function (dataPlayer) {
            this.currPlayer.registerPlayer(dataPlayer.Account);
        },
		
        //Cap nhat thong tin player
        updatePlayersUI: function (dataPlayers) {
            this.positionsUI = [0, 0, 0, 0, 0, 0, 0];
            let countPlayer = 0;
            this.positionsUI[countPlayer] = cc.LoginController.getInstance().getUserId();
            countPlayer++;
            dataPlayers.map(player => {
                if (player.AccountID != cc.LoginController.getInstance().getUserId()) {
                    if (countPlayer <= 6) {
                        this.positionsUI[countPlayer] = player.AccountID;
                        countPlayer++;
                    }
                }
            }, this);

            //Hien thi player
            this.positionsUI.forEach(function (accID, index) {
                if (accID != 0) {
                    try {
                        let playerInfo = dataPlayers.filter(player => player.AccountID == accID);
                        //Loai tru player hien tai
                        if (playerInfo.length > 0 && index != 0) {
                            this.lstPlayers[index].registerPlayer(playerInfo[0].Account);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    try {
                        //Reset lai vi tri cua player
                        this.lstPlayers[index].unRegisterPlayer();
                    } catch (e) {
                        console.log(e);
                    }
                }
            }, this);

            this.controller.updatePositionPlayerUI(this.positionsUI);
        },

        //Cap nhat balance cua player hien tai
        updateBalanceCurrPlayer: function (balance) {
            this.currPlayer.updateChipNormal(balance);
        },

        //Cap nhat balance player khac
        updateBalancePlayer: function (data) {
            let accID = data[0];
            let balance = data[3];
            // Defensive: server bot bcast playerBet co the khong gui balance hop le (bot dummy = balanceIn-amount)
            if (balance == null || isNaN(balance)) {
                return;
            }
            if (this.positionsUI) {
                let indexPlayer = this.positionsUI.indexOf(accID);
                if (indexPlayer != -1) {
                    this.lstPlayers[indexPlayer].updateChip(balance);
                }
            }
        },

        //Hien thi ket qua thang
        winResult: function (data) {
			//console.log(data);
            this.currPlayer.playerResultUI(data.Award, data.Balance);
        },

        //Hien thi tien thang cua nguoi choi ngoi trong ban
        winResultVip: function (data) {
            data.map(player => {
                //Kiem tra player co trong mang hay ko
                if (this.positionsUI.includes(player.AccountID) && player.AccountID != cc.LoginController.getInstance().getUserId()) {
                    let indexPlayer = this.positionsUI.indexOf(player.AccountID);
                    this.lstPlayers[indexPlayer].playerResultUI(player.Award, player.Balance);
                }
            }, this);
        },

        resetPlate: function () {
            this.nodeDiceBox.active = true;
            if (this.batUpStatic) {
                this.batUpStatic.active = false;
                if (this.rootPasBatUp) this.batUpStatic.position = this.rootPasBatUp;
            }
            if (this.skeDiceBox) {
                this.skeDiceBox.node.active = true;
                // KHONG set 'idle' o day - dice + open giu trang thai cho toi khi
                // 'rung' tu case Betting (phien moi) moi reset ve idle + hide dice.
            }
            if (this.skeDealer) this.skeDealer.setAnimation(0, 'idle', true);
            this.lbResult.node.parent.active = false;
        },

        // Helper: an/hien container dice1/2/3 BEN TRONG bat.
        // Ưu tien dùng property nodeDicesInBowl (wire truc tiep node 'dices').
        // Fallback qua SicBoResultView neu nodeDicesInBowl chua wire.
        _setDicesVisible: function (visible) {
            try {
                if (this.nodeDicesInBowl) {
                    this.nodeDicesInBowl.active = visible;
                    return;
                }
                // Fallback: lay qua SicBoResultView (script wire in-bowl dice)
                var rv = this.controller && this.controller.sicboResultView;
                if (rv && rv.spDice1 && rv.spDice1.node && rv.spDice1.node.parent) {
                    rv.spDice1.node.parent.active = visible;
                }
            } catch (e) {}
        },

        playAnimDiceBox: function (sicBoState) {
            this.animationOpenPlaying = true;
            switch (sicBoState) {
                case cc.SicBoState.Waiting:
                    // KHONG dong bat ve idle - giu 'open' frame cuoi den khi rung
                    // phien moi. Chi dealer idle.
                    if (this.skeDealer) this.skeDealer.setAnimation(0, 'idle', true);
                    break;

                case cc.SicBoState.Betting:
                    // Phien moi -> 'rung' 1 lan + queue 'idle' loop.
                    // Day la moment dice + open ket thuc -> hide dice cho phien moi.
                    if (this.skeDiceBox) {
                        this.skeDiceBox.setAnimation(0, 'rung', false);
                        this.skeDiceBox.addAnimation(0, 'idle', true, 0);
                    }
                    this._setDicesVisible(false);
                    if (this.skeDealer) this.skeDealer.setAnimation(0, 'idle', true);
                    break;

                case cc.SicBoState.Shaking:
                    // Server hien skip; case du phong cho future
                    if (this.skeDiceBox) {
                        this.skeDiceBox.setAnimation(0, 'rung', false);
                        this.skeDiceBox.addAnimation(0, 'idle', true, 0);
                    }
                    this._setDicesVisible(false);
                    break;

                case cc.SicBoState.OpenPlate:
                    // Legacy entry point - logic chinh trong activeOpenPlate (handle isNan).
                    // Goi truc tiep playAnimDiceBox(OpenPlate) = force auto-reveal day du.
                    cc.tween(this.nodeDiceBox).to(0.3, { position: cc.v2(0, 0), scale: 0.5 }).start();
                    cc.director.getScheduler().schedule(function () {
                        this._revealBowl();
                        this._revealResult();
                    }, this, 0, 0, 0.6, false);
                    break;

                case cc.SicBoState.ShowResult:
                    this.lbResult.node.parent.active = false;
                    if (this.batUpStatic) this.batUpStatic.active = false;
                    // KHONG hide dice o day - dice giu visible suot ShowResult + Waiting,
                    // den khi rung phien moi (case Betting trong playAnimDiceBox) moi hide.
                    cc.tween(this.nodeDiceBox).to(0.3, { position: cc.v2(0, 240), scale: 0.15 }).start();
                    break;
            }
        },

        //reset dem nguoc
        activeTimer: function (isActive) {
            this.lbTimer.active = isActive;
            if (this.interval && !isActive) {
                clearInterval(this.interval);
            }
        },

        updateTime: function (time) {
            //Clear interval
            if (this.interval) {
                clearInterval(this.interval);
            }
            this.time = parseInt(time);
            this.startTimer();

            this.interval = setInterval(function () {
                this.startTimer();
            }.bind(this), 1000)
        },

        startTimer: function () {
            if (this.time < 0) {
                this.time = 0;
                return;
            }
            this.lbTimer.string = this.time;
            this.time--;
        },

        showStatus: function (strStatus) {
            if (strStatus != null) {
                this.lbStatus.string = strStatus;
                this.lbStatus.node.parent.active = true;
                this.lbStatus.node.getComponent(cc.Animation).play('notify-checkchi');

                cc.tween(this.lbStatus.node.parent)
                    .to(0, { opacity: 0 })
                    .to(0.3, { opacity: 255 })
                    .delay(2)
                    .to(0.3, { opacity: 0 })
                    .start();
            } else {
                this.lbStatus.node.parent.active = false;
            }
        },

        //Cap nhat phien
        updateSessionId: function (sID) {
            this.lbSessionID.string = "#" + sID;
        },

        updatePlayersInGame: function (totalPlayer) {
            // Server gui SummaryPlayerPayload object {TotalTai, TotalXiu, TotalChan, TotalLe, TotalCcu}.
            // Lay TotalCcu (so nguoi choi tong) thay vi stringify ca object -> tranh "[object Object]".
            var ccu = (totalPlayer && typeof totalPlayer === 'object')
                ? (totalPlayer.TotalCcu || 0)
                : (totalPlayer || 0);
            this.lbTotalPlayer.string = ccu;
        },

        //Hien thi tin nhan
        playerShowBubbleChat: function (message) {
            if (message[4] == false && message[3] != cc.LoginController.getInstance().getUserId()) {
                return;
            }
            if (cc.ChatRoomController.getInstance().checkIsEmotion(message)) {
                this.lstPlayers.forEach(function (player) {
                    let playerNickName = player.nickName;
                    let nickName = message[0];
                    if (nickName === playerNickName) {
                        player.showEmotion(cc.ChatRoomController.getInstance().getIndexEmotion(message)
                            , message);
                    }
                });
            } else {
                this.lstPlayers.forEach(function (player) {
                    let playerNickName = player.nickName;
                    let nickName = message[0];
                    if (nickName === playerNickName) {
                        player.showBubbleChat(message);
                    }
                });
            }

        },

        //Hien thi tien thang cua user ko ngoi trong ban
        updateTotalUserWin: function (amount) {
            this.lbTotalUserWin.node.active = false;
            if (amount != null && amount != 0) {
                this.lbTotalUserWin.string = "+" + cc.Tool.getInstance().formatNumber(amount);
                this.lbTotalUserWin.node.active = true;
                this.lbTotalUserWin.node.scaleY = 0;
                this.animTotalUserWin.play('xxWin');
            }
        },

        copyHashClicked: function () {
            cc.Tool.getInstance().copyToClipboard(this.lbHash.string)
            this.animationMess.play('openMessage');
            this.lblTextNoti.string = 'Copy chuỗi MD5 thành công';
        },

        copyResultClicked: function () {
            cc.Tool.getInstance().copyToClipboard(this.lbMd5Decript.string)
            this.animationMess.play('openMessage');
            this.lblTextNoti.string = 'Copy chuỗi kết quả thành công';
        }
    });
}).call(this);