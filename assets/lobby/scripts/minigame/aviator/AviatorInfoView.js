(function () {
  cc.AviatorInfoView = cc.Class({
    extends: cc.Component,
    properties: {
      lbSessionId: cc.Label,
      lbJackpot: cc.LabelIncrement,
      lbMultiplier: cc.Label,
      lbTimer: cc.Label,
      lbTotalBet: cc.LabelIncrement,
      lbTotalUser: cc.LabelIncrement,
      popupStart: cc.Node,
      nodeAirCraft: cc.Node,
      aircraft: sp.Skeleton,
      attackcraft: sp.Skeleton,
      lazeFire: sp.Skeleton,
      chartMask: cc.Node,
      chartSpr: cc.Node,
      parachute: cc.Prefab,
      parachute1: cc.Prefab,
    },

    onLoad: function () {
      this.controller = cc.AviatorController.getInstance();
      this.controller.setInfoView(this);
      this.initPositions();
      this.setupRandomLazer();
      this.flying = false;
      this.crashed = false;
      this.lazeFire.node.active = false;
      this.aircraftSpeed = false;
      this.incrementMultiplier = null;

      const self = this;
      this.aircraft.setCompleteListener((trackEntry) => {
        const animationName = trackEntry.animation
          ? trackEntry.animation.name
          : "";

        if (animationName == "ne") {
          self.aircraft.setAnimation(0, "speed", true);
          self.lazeFire.node.active = false;
        }
      });
    },

    setupRandomLazer: function () {
      const lazerInterval = Math.random() * (5000 - 1000) + 1000;
      this.schedule(
        () => {
          if (!this.crashed && this.flying) {
            this.fireLazer();
            this.controller.playAudio().playFireAudio();
          }
        },
        lazerInterval / 1000,
        cc.macro.REPEAT_FOREVER
      );
    },

    fireLazer: function () {
      if (this.crashed) {
        return;
      }
      this.lazeFire.node.active = true;
      this.lazeFire.setAnimation(0, "laser", false);
      this.aircraft.setAnimation(0, "ne", false);
      // this.scheduleOnce(() => {
      //     this.lazeFire.node.active = false;
      //     if (!this.crashed) {
      //         this.aircraft.setAnimation(0, 'speed', true);
      //     }
      // }, 0.5);
    },

    onEnable: function () {
      //this.resetAircraft();
    },

    onDestroy: function () {
      this.controller.setInfoView(null);
    },

    initPositions: function () {
      this.nodeAirCraft.position = cc.v2(-509, -143);
      this.chartMaskWidth = 567;
      this.chartMask.width = 0;
      this.chartMask.height = 230;
      this.chartSpr.height = 230;
      this.chartMask.active = false;
    },

    resetAircraft: function () {
      cc.Tween.stopAllByTarget(this.aircraft.node);
      cc.Tween.stopAllByTarget(this.nodeAirCraft);
      cc.Tween.stopAllByTarget(this.chartMask);
      cc.Tween.stopAllByTarget(this.chartSpr);

      this.nodeAirCraft.position = cc.v2(-509, -143);
      this.chartMask.width = 0;
      this.chartMask.height = 230;
      this.chartSpr.height = 230;
      this.chartMask.active = false;
      this.flying = false;
      this.crashed = false;
      this.lazeFire.node.position = cc.v2(-254, 110);
      this.attackcraft.node.position = cc.v2(483, 226);
    },

    flyAlongChart: function () {
      this.resetAircraft();
      this.flying = true;
      this.chartMask.width = 0;
      this.chartMask.active = true;
      cc.tween(this.nodeAirCraft)
        .bezierTo(2.5, cc.v2(-509, -143), cc.v2(-310, -115), cc.v2(-280, -90))
        .bezierTo(2.5, cc.v2(-170, -50), cc.v2(-60, 20), cc.v2(20, 83))
        .call(() => {
          this.upDownEffect();
        })
        .start();
      cc.tween(this.chartMask).to(5, { width: this.chartMaskWidth }).start();
    },

    // Vào GIỮA phiên đang bay: đặt máy bay đúng độ cao theo elapsed, KHÔNG kéo về gốc bay lại từ 1.00x.
    flySeekMidFlight: function (sessionInfo) {
      var elapsed = 0;
      if (sessionInfo.FlyStartMs > 0 && sessionInfo.ServerNowMs > 0) {
        elapsed = Math.max(0, (sessionInfo.ServerNowMs - sessionInfo.FlyStartMs) / 1000);
      }
      var climbDuration = 5; // khớp tween leo 2.5 + 2.5
      if (elapsed < climbDuration) {
        this.flyAlongChart(); // còn trong giai đoạn leo -> chạy bình thường (sai lệch nhỏ)
        return;
      }
      // đã qua giai đoạn leo -> đặt thẳng ở đỉnh cruise
      this.resetAircraft();
      this.flying = true;
      this.chartMask.active = true;
      this.nodeAirCraft.position = cc.v2(20, 83);
      this.chartMask.width = this.chartMaskWidth;
      this.chartMask.height = this.nodeAirCraft.position.y + 150;
      this.chartSpr.height = this.chartMask.height;
      this.upDownEffect();
    },

    upDownEffect: function () {
      cc.tween(this.nodeAirCraft)
        .repeatForever(
          cc
            .tween()
            .by(1, { position: cc.v2(0, 30) })
            .by(1, { position: cc.v2(0, -30) })
        )
        .start();
      cc.tween(this.chartMask)
        .repeatForever(
          cc
            .tween()
            .call(() => {
              this.chartMask.height = this.nodeAirCraft.position.y + 150;
            })
            .delay(0.1)
        )
        .start();

      cc.tween(this.chartSpr)
        .repeatForever(
          cc
            .tween()
            .call(() => {
              this.chartSpr.height = this.nodeAirCraft.position.y + 150;
            })
            .delay(0.1)
        )
        .start();
    },

    updateInfo: function (sessionInfo) {
      //console.log('updateInfo', sessionInfo);
      var time = sessionInfo.Elapsed;
      switch (sessionInfo.Phrase) {
        case cc.AviatorState.WAITING:
        //   if (cc.AviatorController.getInstance().getIsLogout()) {
        //     cc.LobbyController.getInstance().destroyDynamicView(null);

        //     return;
        //   }
          this.lbMultiplier.node.active = false;
          this.lazeFire.node.active = false;
          this.chartMask.active = false;
          this.resetAircraft();
          this.controller.resetBetList();
          this.aircraftFlying = false;
          this.aircraftIdle = false;
          this.sawBetting = false;
          break;
        case cc.AviatorState.BETTING:
          this.sawBetting = true;
          this.popupStart.active = true;
          this.lbTimer.string = time;
          this.lbTotalBet.tweenValueto(sessionInfo.TotalBet);
          this.lbTotalUser.tweenValueto(sessionInfo.TotalPlayer);
          this.lazeFire.node.active = false;
          this.chartMask.active = false;
          this.nodeAirCraft.active = true;
          if (!this.aircraftIdle) {
            this.aircraft.setAnimation(0, "idle", true);
            this.aircraftIdle = true;
          }
          this.aircraftFlying = false;
          break;
        case cc.AviatorState.FLYING:
          this.popupStart.active = false;
          this.lbMultiplier.node.active = true;
          this.nodeAirCraft.active = true;

          if (!this.aircraftSpeed) {
            this.aircraft.setAnimation(0, "speed", true);
            this.aircraftSpeed = true;
            this.controller.playAudio().playStartFlyingAudio();
          }
          this.chartMask.active = true;
          if (!this.flying) {
            if (this.sawBetting) {
              this.flyAlongChart();
            } else {
              this.flySeekMidFlight(sessionInfo);   // vào giữa phiên -> đặt máy bay đúng độ cao, không kéo về gốc
            }
          }
          this.updateMultiplier(sessionInfo.Multiplier);
          break;
        case cc.AviatorState.CRASHED:
          if (!this.crashed) {
            this.handleCrash();
            this.stopMultiplier();
          }
          this.aircraftFlying = false;
          this.aircraftIdle = false;
          break;
      }

      this.lastTime = time;
      this.currentState = sessionInfo.Phrase;
      this.lbSessionId.string = "#" + sessionInfo.SessionID;
      this.lbJackpot.tweenValueto(sessionInfo.Jackpot);
    },

    handleCrash: function () {
      this.fireLazer();
      this.crashed = true;
      this.flying = false;
      this.chartMask.active = false;
      const aircraftPosition = this.nodeAirCraft.position;
      this.lazeFire.node.position = cc.v2(-254, aircraftPosition.y);
      this.attackcraft.node.position = cc.v2(483, aircraftPosition.y + 110);
      this.aircraft.setAnimation(0, "no", false);
      this.controller.playAudio().playBumAudio();
    },

    updateCashout: function (accountId, amount) {
      const isCurPlayer =
        accountId === cc.LoginController.getInstance().getUserId();
      let newParachute;
      if (!isCurPlayer) {
        newParachute = cc.instantiate(this.parachute);
      } else {
        newParachute = cc.instantiate(this.parachute1);
      }
      this.nodeAirCraft.addChild(newParachute);
      let valueLabel = newParachute
        .getChildByName("value")
        .getComponent(cc.Label);
      if (valueLabel) {
        valueLabel.string = cc.Tool.getInstance().nFormatter(amount);
      }

      const x = Math.random() * -500 - 250;
      const y = -350;
      const time = Math.random() * 1 + 2;

      cc.tween(newParachute)
        .set({ scale: 0, opacity: 255 }) 
        .parallel(
          cc.tween().to(time, { position: cc.v2(x, y) }),
          cc.tween().to(0.3, { scale: 1 }) 
        )
        .call(() => {
          if (Math.abs(newParachute.position.x - x) < 10 && Math.abs(newParachute.position.y - y) < 10) {
           
            cc.tween(newParachute)
                .to(0.5, { opacity: 0 })
                .call(() => {
                    newParachute.destroy();
                })
                .start();
        } else {
            newParachute.destroy();
        }
        })
        .start();
    },

    updateMultiplier: function (multiplier) {
      const incrementValue = 0.01;
      const incrementsPerSecond = 10;
      this.lbMultiplier.string = multiplier.toFixed(2) + "x";

      // this.incrementMultiplier = cc
      //   .tween(this.lbMultiplier)
      //   .repeatForever(
      //     cc
      //       .tween()
      //       .call(() => {
      //         let currentMultiplier = parseFloat(
      //           this.lbMultiplier.string.replace("x", "")
      //         );
      //         this.lbMultiplier.string =
      //           (currentMultiplier + incrementValue).toFixed(2) + "x";
      //       })
      //       .delay(1 / incrementsPerSecond)
      //   )
      //   .start();
    },

    stopMultiplier: function () {
      if (this.incrementMultiplier) {
        this.incrementMultiplier.stop();
        this.incrementMultiplier = null;
      }
    },
  });
}).call(this);
