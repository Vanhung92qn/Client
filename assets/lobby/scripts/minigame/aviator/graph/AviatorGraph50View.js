
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
        this.controller = cc.AviatorController.getInstance();
        this.controller.setAviatorGraphView(this);
        this.nodeLayout.active = false;
    },

    draw: function (list) {
        this.resetDraw();
        var self = this;
        this.indexNodeParent = 0;
        var totalItems = [10, 10, 10, 10, 9];
        var currentItemCount = 0;

        list.forEach(function (item, index) {
            if (currentItemCount >= totalItems[self.indexNodeParent]) {
                self.indexNodeParent++;
                currentItemCount = 0;
            }

            self.createNode(item);
            currentItemCount++;
        });
    },

    createNode: function (item) {
        let prefab;
        if (item.Multiplier < 2) {
            prefab = cc.instantiate(this.itemGray);
        } else if (item.Multiplier < 3) {
            prefab = cc.instantiate(this.itemBlue);
        } else if (item.Multiplier > 3 && item.Multiplier < 5) {
            prefab = cc.instantiate(this.itemPurple);
        } else if (item.Multiplier > 5 && item.Multiplier < 10) {
            prefab = cc.instantiate(this.itemGreen);
        } else if (item.Multiplier > 10 && item.Multiplier < 50) {
            prefab = cc.instantiate(this.itemOrange);
        } else if (item.Multiplier > 50 && item.Multiplier < 200) {
            prefab = cc.instantiate(this.itemYellow);
        } else {
            prefab = cc.instantiate(this.itemRed);
        }
        prefab.parent = this.nodeParents[this.indexNodeParent];
        
        let valueLabel = prefab.getChildByName('value').getComponent(cc.Label);
        if (valueLabel) {
            valueLabel.string = item.Multiplier + 'x';
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

