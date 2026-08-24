(function () {
    /**
     * Chat PHÒNG cho Aviator — fork của ChatView.js (họ SẢNH), KHÔNG phải ChatRoomView.js (họ PHÒNG).
     *
     * Vì sao không dùng thẳng ChatRoomPrefab như BauCua/Baccarat:
     *  - Art chat của Aviator (node `chatView`) đã dựng theo bộ ChatListView + ChatItem. ChatRoomView đòi
     *    ChatRoomListView + ChatRoomItem (3 cc.Label), trong khi item Aviator chỉ có 1 cc.RichText —
     *    Cocos không cho gán chéo kiểu, muốn dùng phải dựng lại toàn bộ art item.
     *  - ChatRoomView ÉP `this.node.x = -visibleWidth/2` (ChatRoomView.js:21-23) → khung chat Aviator ở
     *    (530,114) bên phải sẽ bị giật sang mép trái.
     *  - ChatRoomPrefab kèm lớp đen 3000x2000 opacity 150 phủ TOÀN MÀN khi mở. Aviator là crash game,
     *    che mất hệ số đang leo là không bấm Cash Out kịp → sai bản chất game real-time.
     * Nên giữ nguyên art + vị trí bên phải, chỉ đổi NGUỒN DỮ LIỆU: ChatHub sảnh riêng → AviatorHub.
     * Tiền lệ trong repo: SicBo cũng fork riêng (SbChatRoomView.js) đúng vì lý do này.
     *
     * ⚠️ SCRIPT NÀY PHẢI GẮN LÊN NODE LUÔN ACTIVE (MainGame), KHÔNG gắn lên node `chatView`:
     * Cocos không chạy onLoad của node inactive → setChatView không chạy → ChatRoomController.js:42 có
     * guard `if (this.chatView)` nên chat sẽ chết IM LẶNG, không log, không lỗi để lần.
     */
    cc.PhoenixChatRoomView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeChat: cc.Node,              // khung chat art riêng của Aviator — bật/tắt bằng active như cũ
            chatListView: cc.ChatListView,
            editBoxChat: cc.EditBox,
            lblTextNotiNewGame: cc.Label,   // để trống được (guard ở setNoti)
            bgNoti: cc.Node,                // để trống được
        },

        onLoad: function () {
            cc.ChatRoomController.getInstance().setChatView(this);
            this.listChat = [];
            this.maxChat = cc.sys.isNative ? 20 : 30;
            if (this.bgNoti) this.bgNoti.active = false;
            if (this.lblTextNotiNewGame) this.lblTextNotiNewGame.string = '';
        },

        /**
         * ChatRoomController đẩy vào MẢNG positional [nick, msg, serviceId, accId, isVip, vip]
         * (AviatorHub.cs phát 6 tham số), còn ChatItem.updateItem lại đọc {n, c} → đổi ngay tại đây.
         * Đổi ở đây = GIỮ NGUYÊN art item + giữ được NodePool của ChatListView.
         */
        addChatContent: function (message) {
            if (!message || !message.length) return;
            var item = { n: message[0], c: message[1] };
            this.listChat.push(item);
            if (this.listChat.length > this.maxChat) this.listChat.shift();

            // Panel đang đóng → ChatListView.onLoad CHƯA chạy (node inactive) nên content/items chưa tồn tại.
            // Đừng chạm vào nó; cứ dồn vào listChat, lúc mở đổ vào một thể ở showChat().
            if (!this.nodeChat || !this.nodeChat.active) return;
            this.chatListView.addChatItem(item, this.maxChat);
            this.scrollBottom();
        },

        /**
         * Nút chat của Aviator đi qua ChatRoomController.showChat() vào đây. Giữ đúng hành vi cũ: MỘT nút
         * bật/tắt (khung chat Aviator không có nút đóng riêng như ChatRoomPrefab).
         */
        showChat: function () {
            if (!this.nodeChat) return;
            this.nodeChat.active = !this.nodeChat.active;
            if (!this.nodeChat.active) return;   // đóng: ChatListView.onDisable tự trả item về pool

            // mở: gán node.active = true chạy onLoad/onEnable ĐỒNG BỘ → list sẵn sàng ngay dòng dưới.
            if (this.listChat.length > 0) {
                this.chatListView.resetList();
                this.chatListView.initialize(this.listChat);
            }
            this.scrollBottom();
        },

        scrollBottom: function () {
            var self = this;
            setTimeout(function () {
                if (self.chatListView && self.chatListView.scrollView) self.chatListView.scrollView.scrollToBottom();
            }, 5);
        },

        setNoti: function (text) {
            if (this.lblTextNotiNewGame) this.lblTextNotiNewGame.string = text;
            if (this.bgNoti) this.bgNoti.active = !!text;
        },

        // Cổng chặn 20k: bê nguyên từ ChatView.js:209-218 (user chốt GIỮ để chặn tài khoản rác spam).
        // Họ chat phòng (BauCua/Baccarat/...) KHÔNG có luật này.
        sendMessage: function () {
            if (cc.BalanceController.getInstance().getBalance() < 20000) {
                cc.PopupController.getInstance().showMessage('Số dư tối thiểu 20k mới đủ điều kiện chat');
                return;
            }
            if (this.editBoxChat.string === '') {
                this.setNoti('Bạn cần nhập nội dung tin nhắn trước khi gửi.');
                var self1 = this;
                setTimeout(function () { self1.setNoti(''); }, 4000);
                return;
            }
            this.setNoti('');
            cc.ChatRoomController.getInstance().sendRequestOnHub(cc.MethodHubName.SEND_MESSAGE, this.editBoxChat.string);
            this.editBoxChat.string = '';
            if (!cc.sys.isNative) {
                var self = this;
                setTimeout(function () { self.editBoxChat.focus(); }, 5);
            }
        },

        // 2 handler dưới GIỮ NGUYÊN TÊN của ChatView → 2 cc.ClickEvent sẵn có trong prefab chỉ cần trỏ lại
        // component, không phải gõ lại tên handler.
        editingReturn: function () { this.sendMessage(); },
        sendChatClicked: function () { this.sendMessage(); },
    });
}).call(this);
