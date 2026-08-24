
cc.Class({
    extends: cc.Component,
    properties: {
        itemGray: cc.Prefab,
        itemRed: cc.Prefab,
        itemBlue: cc.Prefab,
        itemGreen: cc.Prefab,
        itemYellow: cc.Prefab,
        itemPurple: cc.Prefab,
        itemOrange: cc.Prefab,
        nodeParents: [cc.Node],
        nodePanel: cc.Node,
        nodeLayout: cc.Node,
        nodeBlack: cc.Node
    },

    onLoad: function () {
        this.controller = cc.PhoenixController.getInstance();
        this.controller.setAviatorGraphView(this);
        this.nodeLayout.active = false;
    },

    draw: function (list) {
        this.resetDraw();
        var self = this;
        this.indexNodeParent = 0;
        var totalItems = [10, 10, 10, 10, 9];
        var currentItemCount = 0;

        // Server tra 100 dong (GetSoiCau(100)) nhung bang chi chua 49 o. Truoc day vong lap van chay het
        // 100 dong: sau o thu 49, indexNodeParent = 5 -> nodeParents[5] = undefined -> 51 lan cc.instantiate
        // roi vut thang, LAP LAI MOI VAN. Nay dung han khi het cho.
        for (var i = 0; i < list.length; i++) {
            if (currentItemCount >= totalItems[self.indexNodeParent]) {
                self.indexNodeParent++;
                currentItemCount = 0;
                if (self.indexNodeParent >= totalItems.length) break;   // het cot -> thoi
            }
            self.createNode(list[i]);
            currentItemCount++;
        }
    },

    createNode: function (item) {
        // SUNWIN TO MAU CHU (bang mau AviatorConstant.js + nguong AviatorHelper.js:41), khong dung
        // 7 anh nen mau. Dung MOT loai o roi doi mau Label -> khop ban goc.
        let m = item.Multiplier;
        let prefab = cc.instantiate(this.itemGray || this.itemBlue || this.itemGreen);
        prefab.parent = this.nodeParents[this.indexNodeParent];

        let sp = prefab.getComponent(cc.Sprite);
        if (sp) sp.enabled = false;                      // bo nen mau tung o

        let valueLabel = prefab.getChildByName('value').getComponent(cc.Label);
        if (valueLabel) {
            valueLabel.string = item.Multiplier + 'x';
            if (typeof cc.PhoenixRateColor !== 'undefined') {
                valueLabel.node.color = cc.PhoenixRateColor.get(m);
            }
        }
    },

    resetDraw: function () {
        // Xóa tất cả các nút con
        this.nodeParents.forEach(function (nodeParent) {
            nodeParent.removeAllChildren();
        });
    },

    openPanel: function () {
        this.nodeBlack.active = true;
        this.nodePanel.active = true;
        this.nodePanel.height = 0;
        cc.tween(this.nodePanel)
          .to(0.2, { height: 359 })
          .call(() => {
              this.nodeLayout.active = true;
          })
          .start();
    },
    
    closePanel: function () {
        this.nodeBlack.active = false;
        this.nodeLayout.active = false;
        cc.tween(this.nodePanel)
          .to(0.2, { height: 0 })
          .call(() => {
              this.nodePanel.active = false;
          })
          .start(); 
    }    
});

