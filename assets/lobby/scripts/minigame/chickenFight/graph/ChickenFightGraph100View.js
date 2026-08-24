/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.ChickenFightGraph100View = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeParent: cc.Node,
            nodeDragonTemp: cc.Node,
            nodePhonixTemp: cc.Node,
            nodeTieTemp: cc.Node,
        },

        draw: function (list) {
            var self = this;
            this.resetDraw();
            if (!list || list.length === 0) return;
            // FIX: trước đây loop cứng 60 -> list[i] undefined khi soi cầu < 60 phiên -> crash. Cap theo list.length.
            var n = Math.min(60, list.length);
            for(var i = 0; i < n; i++) {
               const item = list[i];
                if (!item) continue;

                if (item.GateId === cc.ChickenFightBetSide.DRAGON) {
                    self.createNode(self.nodeDragonTemp);
                } else if (item.GateId === cc.ChickenFightBetSide.PHONIX) {
                    self.createNode(self.nodePhonixTemp);
                } else {
                    self.createNode(self.nodeTieTemp);
                }
            };
        },

        createNode: function (nodeTemp) {
            var nodeView = cc.instantiate(nodeTemp);
            nodeView.parent = this.nodeParent;
        },

        resetDraw: function () {
            //xoa cac node con
            var children = this.nodeParent.children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.nodeParent.removeChild(children[i]);
            }
        },
    });
}).call(this);
