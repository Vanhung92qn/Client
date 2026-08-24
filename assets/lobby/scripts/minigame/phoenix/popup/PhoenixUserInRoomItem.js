// PhoenixUserInRoomItem - 1 o trong panel Nguoi trong phong: avatar + ten.
// Bot co AccountID AM (engine sinh -700001 tro xuong) - hien y het nguoi that, khong danh dau gi.

cc.Class({
    extends: cc.Component,

    properties: {
        avatar: cc.Sprite,
        lbName: cc.Label,
    },

    setData: function (u) {
        if (!u) return;
        if (this.lbName) this.lbName.string = u.Nickname || '';
        if (this.avatar && cc.AccountController) {
            var sf = cc.AccountController.getInstance().getAvatarImage(u.Avatar);
            if (sf) this.avatar.spriteFrame = sf;
        }
    },
});
