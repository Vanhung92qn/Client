/**
 * Created by Nofear on 6/21/2017.
 */

(function () {
    var ChatRoomController;

    ChatRoomController = (function () {
        var instance;

        function ChatRoomController() {

        }

        instance = void 0;

        ChatRoomController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        ChatRoomController.prototype.setChatView = function (chatView) {
            return this.chatView = chatView;
        };

        ChatRoomController.prototype.setHubView = function (hubView) {
            return this.hubView = hubView;
        };

        ChatRoomController.prototype.sendRequestOnHub = function (method, data1, data2) {
            if (this.hubView)
                return this.hubView.sendRequestOnHub(method, data1, data2);
        };

        // Guard chatView cho đồng bộ với sendRequestOnHub ở trên: scene nào quên nhúng
        // ChatRoomPrefab thì chatView undefined -> throw. Nguy hiểm ở chỗ onHubMessage của các
        // view duyệt message bằng .map KHÔNG try/catch, nên MỘT tin chat nổ là văng khỏi cả vòng
        // lặp, nuốt luôn những message game đứng sau nó trong cùng frame.
        ChatRoomController.prototype.showChat = function () {
            if (this.chatView)
                return this.chatView.showChat();
        };

        ChatRoomController.prototype.addChatContent = function (message) {
            if (this.chatView)
                return this.chatView.addChatContent(message);
        };

        ChatRoomController.prototype.getIndexEmotion = function (message) {
            if (this.chatView)
                return this.chatView.getIndexEmotion(message);
        };

        ChatRoomController.prototype.checkIsEmotion = function (message) {
            if (this.chatView)
                return this.chatView.checkIsEmotion(message);
        };


        return ChatRoomController;

    })();

    cc.ChatRoomController = ChatRoomController;

}).call(this);

