// PhoenixUserInRoomView - panel NGUOI TRONG PHONG (khop sunwin AviatorUserInRoomView).
// Du lieu: hub GetUserInRoom -> {Total, Users:[{AccountID, Nickname, Avatar}]}
//   - nguoi THAT = dang ket noi (front nuoi _realPlayers qua EnterLobby / OnDisconnected)
//   - bot = roster engine ghi moi van vao redis phoenix.room:roster
// Phan trang giong ban goc: nut trai/phai + nhan "trang/tong".
//
// Goi mang CHI khi MO panel (va khi bam doi trang neu muon lam moi) - KHONG poll.

cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: cc.Prefab,        // 1 o nguoi choi (avatar + ten)
        content: cc.Node,             // node chua cac o
        lbPage: cc.Label,             // "1/5"
        lbTotal: cc.Label,            // tong so nguoi
        btnPrev: cc.Node,
        btnNext: cc.Node,
        perPage: { default: 12, tooltip: 'so o moi trang' },
    },

    onLoad: function () {
        this.controller = cc.PhoenixController.getInstance();
        if (this.controller) this.controller.setUserInRoomView(this);
        this._users = [];
        this._page = 0;
        this._maxPage = 1;
    },

    onEnable: function () {
        // Mo panel -> xin danh sach moi nhat.
        this.requestList();
    },

    requestList: function () {
        if (!this.controller) return;
        this.controller.sendRequestOnHub(cc.MethodHubName.GET_USER_IN_ROOM);
    },

    // Server tra ve -> ve lai trang hien tai.
    updateList: function (users, total) {
        this._users = users || [];
        this._maxPage = Math.max(1, Math.ceil(this._users.length / this.perPage));
        if (this._page >= this._maxPage) this._page = this._maxPage - 1;
        if (this.lbTotal) this.lbTotal.string = '' + (total != null ? total : this._users.length);
        this.render();
    },

    render: function () {
        if (!this.content) return;
        this.content.removeAllChildren();
        var from = this._page * this.perPage;
        var to = Math.min(from + this.perPage, this._users.length);
        for (var i = from; i < to; i++) {
            var u = this._users[i];
            if (!u || !this.itemPrefab) continue;
            var node = cc.instantiate(this.itemPrefab);
            this.content.addChild(node);
            var item = node.getComponent('PhoenixUserInRoomItem');
            if (item) item.setData(u);
        }
        if (this.lbPage) this.lbPage.string = (this._page + 1) + '/' + this._maxPage;
        if (this.btnPrev) this.btnPrev.active = this._page > 0;
        if (this.btnNext) this.btnNext.active = this._page < this._maxPage - 1;
    },

    onClickPrev: function () {
        if (this._page <= 0) return;
        this._page--;
        this.render();
    },

    onClickNext: function () {
        if (this._page >= this._maxPage - 1) return;
        this._page++;
        this.render();
    },

    onClickClose: function () {
        // PHAI HUY han. Truoc day chi tat active, ma createUserInRoomView() lai instantiate node MOI
        // moi lan mo -> cu bam la de lai 1 node chet trong scene, tich luy vinh vien.
        var pc = (typeof cc.PhoenixPopupController !== 'undefined') ? cc.PhoenixPopupController.getInstance() : null;
        if (pc && pc.destroyUserInRoomView) { pc.destroyUserInRoomView(); return; }
        if (this.node && this.node.isValid) this.node.destroy();
    },

    onDestroy: function () {
        // Controller la singleton song tren prototype -> khong tra ve null thi lan vao game sau
        // no van giu tham chieu toi component DA HUY.
        if (this.controller && this.controller.PhoenixUserInRoomView === this) {
            this.controller.PhoenixUserInRoomView = null;
        }
    },
});
