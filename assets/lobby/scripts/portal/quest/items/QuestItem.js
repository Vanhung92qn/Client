/**
 * QuestItem — mot dong nhiem vu.
 *
 * Bo anh user thiet ke da co nut RIENG cho tung viec (buttonDeposit,
 * buttonBetNow, ButtonNhan, iconChecked). Day la chi tiet tot nen giu:
 * nut noi thang viec can lam, va bam vao dua nguoi choi TOI CHO lam duoc
 * — khong bat ho tu di tim.
 *
 * Bon trang thai dung CHUNG mot prefab, doi bang anh va chu.
 */

'use strict';

const QuestModel = require('QuestModel');

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    /** Nen dong — sang khi con lam duoc, xam khi da nhan. */
    spriteBar: cc.Sprite,
    sfBar: cc.SpriteFrame,
    sfBarDisable: cc.SpriteFrame,

    /** Ngoi sao dau dong. */
    spriteStar: cc.Sprite,
    sfStar: cc.SpriteFrame,
    sfStarDisable: cc.SpriteFrame,

    lbTitle: cc.Label,
    /** "(0/1.000.000)" — nhiem vu dang nhap thi de trong. */
    lbProgress: cc.Label,
    lbDescription: cc.Label,

    /** Hop tien thuong. */
    spriteMoney: cc.Sprite,
    sfMoney: cc.SpriteFrame,
    sfMoneyDisable: cc.SpriteFrame,
    lbReward: cc.Label,

    /** Nut hanh dong — doi anh theo viec can lam. */
    nodeAction: cc.Node,
    spriteAction: cc.Sprite,
    lbAction: cc.Label,
    sfClaim: cc.SpriteFrame,
    sfDeposit: cc.SpriteFrame,
    sfBet: cc.SpriteFrame,
    /** Dau tich khi da nhan — thay cho nut. */
    nodeChecked: cc.Node,
  },

  onLoad() {
    this._data = null;
    this._onAction = null;
    this._busy = false;

    if (this.nodeAction) {
      this.nodeAction.on(cc.Node.EventType.TOUCH_END, this._click, this);
    }
  },

  /**
   * @param {object} item   ket qua QuestModel.parseItem()
   * @param {function} onAction  callback(item) khi bam nut
   */
  setData(item, onAction) {
    this._data = item;
    this._onAction = onAction;
    this._busy = false;
    this._render();
  },

  _render() {
    const d = this._data;
    if (!d) return;

    const dim = d.isClaimed;

    if (this.lbTitle) this.lbTitle.string = d.title;
    if (this.lbDescription) this.lbDescription.string = d.description;
    if (this.lbReward) this.lbReward.string = d.rewardText;

    if (this.lbProgress) {
      this.lbProgress.string = d.progressText;
      this.lbProgress.node.active = !!d.progressText;
    }

    // Nen va sao xam di khi da nhan — nhin luot la biet cai nao con lam duoc
    if (this.spriteBar) {
      const f = dim ? this.sfBarDisable : this.sfBar;
      if (f) this.spriteBar.spriteFrame = f;
    }
    if (this.spriteStar) {
      const f = dim ? this.sfStarDisable : this.sfStar;
      if (f) this.spriteStar.spriteFrame = f;
    }
    if (this.spriteMoney) {
      const f = dim ? this.sfMoneyDisable : this.sfMoney;
      if (f) this.spriteMoney.spriteFrame = f;
    }

    // Thanh nen la lop phu BAN TRONG SUOT tren nen den, doi anh xam khong
    // du de nhin luot la biet dong nao xong. Ha do duc ca dong xuong cho
    // chu cung mo theo — dong da nhan thut han ve sau.
    this.node.opacity = dim ? 165 : 255;

    this._renderAction(d);
  },

  /**
   * Nut noi thang viec can lam.
   *
   * Giu interactable = true o moi trang thai bam duoc: tat di thi cc.Button
   * nuot luon su kien cham, nut thanh cam.
   */
  _renderAction(d) {
    const A = QuestModel.ACTION;

    // Da nhan roi -> dau tich, khong con nut
    if (d.action === A.DONE) {
      if (this.nodeAction) this.nodeAction.active = false;
      if (this.nodeChecked) this.nodeChecked.active = true;
      return;
    }

    if (this.nodeChecked) this.nodeChecked.active = false;
    if (!this.nodeAction) return;

    // Nhiem vu dang nhap chua xong thi khong co gi de bam — nhung truong hop
    // nay gan nhu khong xay ra: vao duoc man nay tuc la da dang nhap
    if (d.action === A.NONE) {
      this.nodeAction.active = false;
      return;
    }

    this.nodeAction.active = true;

    let frame = null;
    let text = '';

    if (d.action === A.CLAIM) {
      frame = this.sfClaim;
      text = 'Nhận';
    } else if (d.action === A.DEPOSIT) {
      frame = this.sfDeposit;
      text = 'Nạp';
    } else if (d.action === A.BET) {
      frame = this.sfBet;
      // Noi ro cuoc o game nao, khong bat nguoi choi doan
      text = d.gameName ? 'Cược' : 'Chơi';
    }

    if (frame && this.spriteAction) this.spriteAction.spriteFrame = frame;
    if (this.lbAction) this.lbAction.string = text;
  },

  _click() {
    if (this._busy) return;
    if (!this._data || !this._onAction) return;
    if (this._data.action === QuestModel.ACTION.DONE) return;
    if (this._data.action === QuestModel.ACTION.NONE) return;

    this._busy = true;
    this._onAction(this._data);
  },

  /** Popup cha goi khi xong viec, de nut bam lai duoc. */
  setBusy(on) {
    this._busy = !!on;
  },

  onDestroy() {
    this._data = null;
    this._onAction = null;
  },
});
