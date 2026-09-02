/**
 * QuestGuidePopup — bang huong dan nhiem vu.
 *
 * Noi dung SINH TU DU LIEU THAT lay ve tu may chu, khong go cung — giong
 * cach LixiHelpPanel va VipHelpPanel dang lam. Doi moc hay muc thuong trong
 * QuestConfig thi huong dan tu dong khop theo, khong con canh bang so mot
 * dang huong dan noi mot neo.
 */

'use strict';

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    btnClose: cc.Node,
    nodeDim: cc.Node,
  },

  onLoad() {
    if (this.btnClose) {
      this.btnClose.on(cc.Node.EventType.TOUCH_END, this._close, this);
    }
    if (this.nodeDim) {
      this.nodeDim.on(cc.Node.EventType.TOUCH_END, this._close, this);
    }
  },

  _close() {
    if (this.node && this.node.isValid) this.node.destroy();
  },
});
