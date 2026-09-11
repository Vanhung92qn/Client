// PhoenixSideTabView - 2 tab "Ket qua" | "Chat" cho dai ben trai (khop sunwin: ButtonResult / ButtonChat
// chuyen giua ResultPanelExpand va ChatPanel).
//
// VI SAO CAN: PlayerList (danh sach cuoc, x -749..-412) va chatView (x -751..-338) CHONG KHIT nhau
// tren cung dai trai. Truoc day chat la mot lop phu bat/tat de len danh sach cuoc.
//
// LUU Y: KHONG goi PhoenixChatRoomView.showChat() — ham do la TOGGLE, bam tab Chat khi dang o Chat
// se dong chat trong khi tab Ket qua cung dang tat => trong tron. O day set active TRUC TIEP.

cc.Class({
    extends: cc.Component,

    properties: {
        panelResult: cc.Node,      // MainGame/left/PlayerList
        panelChat: cc.Node,        // MainGame/left/chatView

        // Anh trang thai: moi tab co 1 anh BAT (phu) chong len anh TAT (nen), doi bang opacity.
        onResult: cc.Node,
        onChat: cc.Node,

        startOnChat: { default: false, tooltip: 'mo game vao thang tab Chat thay vi Ket qua' },
    },

    onLoad: function () {
        this.select(this.startOnChat);
    },

    select: function (isChat) {
        this._isChat = !!isChat;
        if (this.panelResult) this.panelResult.active = !this._isChat;
        if (this.panelChat) this.panelChat.active = this._isChat;
        if (this.onResult) this.onResult.opacity = this._isChat ? 0 : 255;
        if (this.onChat) this.onChat.opacity = this._isChat ? 255 : 0;
    },

    onClickTabResult: function () { this.select(false); },
    onClickTabChat: function () { this.select(true); },
});
