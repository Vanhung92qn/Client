/**
 * Created by Nofear on 3/14/2019.
 */

(function () {
    cc.AccountView = cc.Class({
        "extends": cc.Component,
        properties: {
			nodeSoDienThoai: cc.Node,
            nodeProfile: cc.Node,
            nodeVIP: cc.Node,
            nodeSafePlus: cc.Node,
            nodeSecurity: cc.Node,
            nodeChangePass: cc.Node,
            nodeInbox: cc.Node,
			nodeKetSat: cc.Node,
			nodeDangxuat: cc.Node,
			
        },

        // use this for initialization
        onLoad: function () {
            cc.AccountController.getInstance().setAccountView(this);
            this.allTabNodes = [
                this.nodeProfile,
                this.nodeVIP,
                this.nodeSafePlus,
                this.nodeSecurity,
                this.nodeChangePass,
                this.nodeInbox,
                this.nodeKetSat,
                this.nodeDangxuat,
                this.nodeSoDienThoai,
            ];
            this.node.zIndex = cc.NoteDepth.POPUP_PORTAL;
            this.animation = this.node.getComponent(cc.Animation);
            // Tat het tab tu dau de tranh flicker khi onEnable switch tab
            for (var i = 0; i < this.allTabNodes.length; i++) {
                if (this.allTabNodes[i]) this.allTabNodes[i].active = false;
            }
            this.nodeTabActive = this.nodeProfile;
            this.currentTab = cc.AccountTab.PROFILE;
        },

        onEnable: function () {
            this.animation.play('openPopup');
            var startTab = cc.Tool.getInstance().getItem('@startTab');
            cc.Tool.getInstance().setItem('@startTab', null);
            if (!startTab || startTab === 'null' || startTab === 'undefined') {
                startTab = cc.AccountTab.PROFILE;
            }
            this.activeTab(startTab);
        },

        changeTabClicked: function (event, data) {
            if (data.toString() === this.currentTab) return;
            this.activeTab(data.toString());

            cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.ACCOUNT_INFO, data.toString(), cc.DDNAUIType.BUTTON);
        },

        _getTabNode: function (tabName) {
            switch (tabName) {
                case cc.AccountTab.PROFILE:     return this.nodeProfile;
                case cc.AccountTab.VIP:         return this.nodeVIP;
                case cc.AccountTab.SAFE_PLUS:   return this.nodeSafePlus;
                case cc.AccountTab.SECURITY:    return this.nodeSecurity;
                case cc.AccountTab.CHANGE_PASS: return this.nodeChangePass;
                case cc.AccountTab.KET_SAT:     return this.nodeKetSat;
                case cc.AccountTab.DANG_XUAT:   return this.nodeDangxuat;
                case cc.AccountTab.REG_PHONE:   return this.nodeSoDienThoai;
                case cc.AccountTab.INBOX:       return this.nodeInbox;
                default:                        return this.nodeProfile;
            }
        },

        activeTab(tabName) {
            // Tab VIP da duoc tach ra thanh popup rieng
            // (prefabs/portal/vip/VipPopup + scripts/portal/vip/).
            // Node nodeVIP cu van con trong accountViewNew3.prefab nhung
            // khong con duoc mo nua — xoa han khi da chay on dinh.
            if (tabName === cc.AccountTab.VIP) {
                this._openVipPopup();
                return;
            }

            var nextNode = this._getTabNode(tabName);
            if (!nextNode) return;
            for (var i = 0; i < this.allTabNodes.length; i++) {
                if (this.allTabNodes[i]) this.allTabNodes[i].active = false;
            }
            nextNode.active = true;
            this.nodeTabActive = nextNode;
            this.currentTab = tabName;
        },

        /**
         * Mo popup VIP moi va dong man Tai khoan lai.
         * Popup duoc tha vao cung node cha voi AccountView de giu nguyen
         * thu tu hien thi, khong bi lobby de len tren.
         */
        _openVipPopup: function () {
            var parent = this.node.parent;
            require('VipPopup').open(parent)
                .then(function (node) {
                    node.zIndex = cc.NoteDepth.POPUP_PORTAL;
                })
                .catch(function (err) {
                    cc.error('[AccountView] Khong mo duoc popup VIP:', err);
                    cc.PopupController.getInstance().showMessageError(
                        'Không mở được trang VIP, vui lòng thử lại.'
                    );
                });
            cc.LobbyController.getInstance().destroyAccountView();
        },
		  quickLogoutClicked: function () {
            if (this.isCardGame) {
                //thoat game
                cc.LobbyController.getInstance().destroyDynamicView(null);
            } else {
                cc.LobbyController.getInstance().showPopupLogout();
            }
            cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'BACK', cc.DDNAUIType.BUTTON);
        },

        closeClicked: function () {
            //this.showRegister(false);
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.LobbyController.getInstance().destroyAccountView();
            }, this, 1, 0, delay, false);
        }
    });
}).call(this);
