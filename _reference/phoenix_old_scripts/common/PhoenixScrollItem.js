cc.Class({
    extends: cc.Component,

    properties: {
        itemLabel: cc.Label,
    },
    // Update the item's content based on the given index
    updateItem(index) {
        if (this.itemLabel) {
            this.itemLabel.string = index + 1;
        }
    }
});