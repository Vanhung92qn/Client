/**
 * Ket qua, effect ket qua,
 */

var taiXiuMd5Config = require("TaiXiuMd5Config");

(function () {
  cc.TaiXiumd5ResultView = cc.Class({
    extends: cc.Component,
    properties: {
      //node ket qua
      //nodeResult: cc.Node,
      //node 3 dice ket qua
      // nodeResultDice: cc.Node,

      //bat de nan
      nodeBowl: cc.Node,
      nodebaton: cc.Node,
      // md5 key hash
      md5key: cc.Label,
      md5hash: cc.Label,
      nodeketqua: cc.Node,
      //animation Dice
      nodeBGTimer: cc.Node,
      //3 Spine xuc xac (keo sp.Skeleton cua tung dice vao theo thu tu 1,2,3)
      xnAnimation: {
        default: [],
        type: sp.Skeleton,
      },
      //node cha cua 3 Spine xuc xac, bat len khi hien ket qua
      Showketqua: cc.Node,
      //Spine lac xuc xac — MD5 lac o DAU PHIEN MOI, khong lac luc ra ket qua
      xnEffect: sp.Skeleton,
      //ten clip Spine cua man lac dau phien
      diceShakeAnimName: 'animation',
      lbTotalDice: cc.Label,
      lblTextNotiNewGame: cc.Label,
      //node effect bat len khi win
      nodeTaiWins: [cc.Node],
      nodeXiuWins: [cc.Node],
      winSound: cc.AudioSource,
      rollDice: cc.AudioSource,
      //node Tai/Xiu tat di khi chay fx
      nodeTai: cc.Node,
      nodeXiu: cc.Node,
      nodeLBBetTai: cc.Label,
      nodeLBBetXiu: cc.Label,
      animationBetResult: cc.Animation,
      nodeLBBetResult: cc.Label,
    },

    onLoad: function () {
      //setView
      cc.TaiXiuMd5Controller.getInstance().setTaiXiuMd5ResultView(this);
      this.rootPasBowl = this.nodeBowl.position; //save lai vi tri goc
      this.animationMess = this.lblTextNotiNewGame.node.parent.getComponent(
        cc.Animation
      );
      this.animation = this.node.getComponent(cc.Animation);

      this.reset();
    },

    onDestroy: function () {
      cc.TaiXiuMd5Controller.getInstance().setTaiXiuMd5ResultView(null);
    },

    reset: function () {
      this.currentState = 999;
      var ctrl = cc.TaiXiuMd5Controller.getInstance();
      if (ctrl.clearPendingWin) ctrl.clearPendingWin();
      this.resetUI();
    },

    resetUI: function () {
      this.nodeBowl.active = false;
      this.nodeBGTimer.active = false;
      this.md5hash.node.active = false;
      this.nodeketqua.active = false;
      this.lbTotalDice.node.active = false;

      //an cum 3 xuc xac
      if (this.Showketqua) this.Showketqua.active = false;
      //tat Spine lac
      if (this.xnEffect && this.xnEffect.node) {
        this.xnEffect.node.active = false;
      }

      //reset lai vi tri bowl
      this.nodeBowl.position = this.rootPasBowl;

      this.nodeTaiWins.forEach(function (nodeTaiWin) {
        nodeTaiWin.active = false;
      });
      this.nodeXiuWins.forEach(function (nodeXiuWin) {
        nodeXiuWin.active = false;
      });

      this.nodeTai.active = true;
      this.nodeXiu.active = true;

      //label cuoc Tai/Xiu reset ve 0
      if (this.nodeLBBetTai) this.nodeLBBetTai.string = '0';
      if (this.nodeLBBetXiu) this.nodeLBBetXiu.string = '0';
    },

    getIsBowl: function () {
      return this.nodeBowl.active;
    },

    //gan mat 1..6 cho 3 Spine xuc xac — hien NGAY, khong chay man tung
    //Clip "1".."6" dai 0 giay, la tu the tinh cua tung mat.
    //BAT BUOC setToSetupPose() truoc: clip "1" khong key slot mat-tren va clip "4"
    //khong key slot mat-giua, slot khong duoc key se giu nguyen anh cua van truoc
    //-> ra mat xuc xac lai. Reset ve setup pose thi hai slot do roi dung ve dung
    //gia tri (da doi chieu ca 6 mat voi tu the ket thuc cua clip "xi ngau bay N").
    applyDiceFaces: function (result) {
      var dice = [result.Dice1, result.Dice2, result.Dice3];
      for (var i = 0; i < this.xnAnimation.length; i++) {
        var v = dice[i];
        var skel = this.xnAnimation[i];
        if (!skel || !skel.node) continue;
        if (v >= 1 && v <= 6) {
          skel.setToSetupPose();
          skel.setAnimation(0, '' + v, false);
        }
      }
      if (this.Showketqua) this.Showketqua.active = true;
    },

    //man lac xuc xac mo man phien moi (state BETTING)
    playShakeNewSession: function () {
      if (!this.xnEffect || !this.xnEffect.node) return;
      var self = this;
      this.xnEffect.node.active = true;
      this.xnEffect.setAnimation(0, this.diceShakeAnimName, false);
      this.xnEffect.setCompleteListener(function () {
        self.xnEffect.node.active = false;
      });
      if (this.rollDice) this.rollDice.play();
    },

    updateResult: function (md5sessionInfo) {
      if (md5sessionInfo.CurrentState !== this.currentState) {
        //check state de xu ly hien thi
        switch (md5sessionInfo.CurrentState) {
          case cc.TaiXiuState.BETTING: //54
            //reset lai UI
            this.resetUI();
            //this.nodebaton.active = true;
            this.md5key.node.active = true;
            this.md5key.string = md5sessionInfo.Md5Encript;
            //MD5 lac xuc xac de mo man phien moi (khac Tai Xiu thuong: tung de ra ket qua)
            this.playShakeNewSession();
            break;
          case cc.TaiXiuState.END_BETTING:
            //this.animationMess.play('openMessage');
            //this.lblTextNotiNewGame.string = 'Dừng cược';
            //Ko cho dat cuoc nua
            //reset lai UI
            this.resetUI();
            break;
          case cc.TaiXiuState.RESULT: //15
            //console.log('test time');
            this.nodebaton.active = false;
            this.md5key.node.active = false;
            this.md5hash.string = md5sessionInfo.Md5Decript;
            this.nodeketqua.active = true;
            this.playAnimationAndSetResult(md5sessionInfo);
            break;

          case cc.TaiXiuState.PREPARE_NEW_SESSION:
            this.md5key.node.active = false;
            //neu dang hien thi bat de nan -> tat bat di + play fx + flush pending win
            if (this.nodeBowl.active) {
              this.nodeBowl.active = false;
              this.startEffectResult();
              this._flushPendingWin();
            }
            break;
        }
      }

      this.currentState = md5sessionInfo.CurrentState;
    },

    playAnimationAndSetResult: function (md5sessionInfo) {
      this.totalDice =
        md5sessionInfo.Result.Dice1 +
        md5sessionInfo.Result.Dice2 +
        md5sessionInfo.Result.Dice3;

      this.Showketqua.active = true;
      this.lbTotalDice.string = this.totalDice;

      //an Bat Dang Up ngay khi vao RESULT
      if (this.nodebaton) this.nodebaton.active = false;

      //CHE DO NAN: chuyen instant tu bat up sang bat nan, khong play Spine tung
      if (cc.TaiXiuMd5Controller.getInstance().getIsNan()) {
        this.nodeBowl.active = true;
        this.nodeketqua.active = false;
        this.applyDiceFaces(md5sessionInfo.Result); //pre-set mat dice (an duoi bat)
        //an Spine tung de khong lo phia sau bat
        if (this.xnEffect && this.xnEffect.node) this.xnEffect.node.active = false;
        //thong bao xin moi nan
        if (this.animationMess) this.animationMess.play('openMessage');
        if (this.lblTextNotiNewGame) this.lblTextNotiNewGame.string = 'Xin mời nặn!';
        this.nodeBGTimer.active = true;
        return;
      }

      //CHE DO BINH THUONG: MD5 hien ket qua NGAY, khong co man tung.
      //Man lac xuc xac cua MD5 nam o dau phien moi (state BETTING) chu khong phai o day.
      if (this.xnEffect && this.xnEffect.node) this.xnEffect.node.active = false;
      this.applyDiceFaces(md5sessionInfo.Result);
      this.nodeBGTimer.active = true;
      this.diceAnimFinish();
    },

    //chi bat ket qua xuc xac (che do Nan)

    //goi set ket qua luon (ko chay animation dice)

    startEffectResult: function () {
      this.md5hash.node.active = true;

      this.winSound.play();
      //Kiem tra xem ban nao thang
      if (this.totalDice > 10) {
        this.nodebaton.active = false;
        //TAI
        this.nodeTaiWins.forEach(function (nodeTaiWin) {
          nodeTaiWin.active = true;
        });
        this.nodeXiuWins.forEach(function (nodeXiuWin) {
          nodeXiuWin.active = false;
        });
        this.nodeTai.active = false;
        if (this.nodeLBBetTai.string.length > 2) {
          let bet = Number.parseInt(this.nodeLBBetTai.string.replace(/,/g, ""));
          this.nodeLBBetResult.string =
            "+" + cc.Tool.getInstance().formatNumber(bet + (bet * 98) / 100);
          this.animationBetResult.play("openMessage");
        }
      } else if (this.totalDice > 2 && this.totalDice <= 10) {
        this.nodebaton.active = false;
        //XIU
        this.nodeTaiWins.forEach(function (nodeTaiWin) {
          nodeTaiWin.active = false;
        });
        this.nodeXiuWins.forEach(function (nodeXiuWin) {
          nodeXiuWin.active = true;
        });
        this.nodeXiu.active = false;

        if (this.nodeLBBetXiu.string.length > 2) {
          let bet = Number.parseInt(this.nodeLBBetXiu.string.replace(/,/g, ""));
          this.nodeLBBetResult.string =
            "+" + cc.Tool.getInstance().formatNumber(bet + (bet * 98) / 100);
          this.animationBetResult.play("openMessage");
        }
      }
    },
    openEndDiaNan: function () {
      if (this.nodeBowl.active) {
        this.nodeBowl.active = false;
        this.startEffectResult();
        this._flushPendingWin();
      }
    },

    //play effect win neu co pending (user ran xong, hoac bowl tu dong)
    _flushPendingWin: function () {
      var ctrl = cc.TaiXiuMd5Controller.getInstance();
      if (!ctrl.getPendingWin) return;
      var pending = ctrl.getPendingWin();
      if (!pending) return;
      ctrl.playEffectWin(pending.award);
      cc.BalanceController.getInstance().updateRealBalance(pending.balance);
      cc.BalanceController.getInstance().updateBalance(pending.balance);
      ctrl.clearPendingWin();
    },

    //sau khi play xong animation Dice
    diceAnimFinish: function () {
      this.nodeBGTimer.active = true;
      // anim mới xong
      // this.nodeDiceAnim.active = false;
      //dang mo bat de nan -> ko chay animation thang
      if (cc.TaiXiuMd5Controller.getInstance().getIsNan()) {
        this.animationMess.play("openMessage");
        this.lblTextNotiNewGame.string = "Xin mời nặn!";
        this.nodeBowl.active = true;
        this.nodebaton.active = false;
        this.nodeketqua.active = false;
        //tat node Dice Anim
        // this.animationDice.node.active = false;

        //Bat node Dice Ket qua (3 Dice)
        // this.nodeResultDice.active = true;
      } else {
        this.nodeketqua.active = true;
        //tat node Dice Anim
        // this.animationDice.node.active = false;

        //Bat node Dice Ket qua (3 Dice)
        //this.amthanhmodia.play();
        //this.nodeResultDice.active = true;

        //Bat node ket qua tong
        // this.nodeBgTotalDice.active = true;
        this.lbTotalDice.node.active = true;

        //effect
        this.startEffectResult();
      }
    },

    copyHashClicked: function () {
      cc.Tool.getInstance().copyToClipboard(this.md5key.string);
      this.animationMess.play("openMessage");
      this.lblTextNotiNewGame.string = "Copy chuỗi MD5 thành công!";
    },

    copyResultClicked: function () {
      cc.Tool.getInstance().copyToClipboard(this.md5hash.string);
      this.animationMess.play("openMessage");
      this.lblTextNotiNewGame.string = "Copy chuỗi kết quả thành công!";
    },
  });
}.call(this));
