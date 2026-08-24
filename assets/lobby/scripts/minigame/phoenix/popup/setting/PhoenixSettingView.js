// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    spOpenAudio: cc.Node,
    spOpenBgAudio: cc.Node,
    spOpenChat: cc.Node,

    bgAudio: cc.AudioSource,

    startFlyingAudio: cc.AudioSource,
    bumAudio: cc.AudioSource,
    fireAudio: cc.AudioSource,
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start() {
    this.isOpenAudio = true;
    this.isOpenBgAudio = true;
    this.isOpenChat = true;

    this.controller = cc.PhoenixController.getInstance();

    this.controller.setSettingView(this);
  },

  onClickOpenAudio: function () {
    this.isOpenAudio = !this.isOpenAudio;

    var volumn = this.isOpenAudio ? 100 : 0;

    this.spOpenAudio.opacity = this.isOpenAudio ? 255 : 0;

    this.startFlyingAudio.volume = volumn;
    this.bumAudio.volume = volumn;
    this.fireAudio.volume = volumn;
  },

  onClickOpenBgAudio: function () {
    this.isOpenBgAudio = !this.isOpenBgAudio;

    this.spOpenBgAudio.opacity = this.isOpenBgAudio ? 255 : 0;
    this.bgAudio.volume = this.isOpenBgAudio ? 100 : 0;
  },

  onClickOpenChat: function () {
    this.isOpenChat = !this.isOpenChat;

    this.spOpenChat.opacity = this.isOpenChat ? 255 : 0;
  },

  getIsOpenAudio: function () {
    return this.isOpenAudio;
  },

  getIsOpenChat: function () {
    return this.isOpenChat;
  },

  playFireAudio: function () {
    this.fireAudio.play();
  },

  playBumAudio: function () {
    this.bumAudio.play();
  },

  playStartFlyingAudio: function () {
    this.startFlyingAudio.play();
  },
  // update (dt) {},
});
