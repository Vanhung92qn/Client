/**
 * VipHelpPanel — bang giai thich cach tinh VIPPOINT.
 *
 * Mo bang nut "?" o goc popup VIP.
 *
 * Noi dung duoc SINH TU DU LIEU THAT lay ve tu server, khong go cung. Nho
 * vay khi doi moc hay muc thuong trong bang PrivilegePrize thi phan giai
 * thich tu dong khop theo — khong con canh bang so mot dang, phan huong dan
 * noi mot neo.
 */

'use strict';

const VipModel = require('VipModel');

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    /** Noi dung giai thich, mot label duy nhat cho de sua. */
    lbContent: cc.Label,
    /** Nut dong bang. */
    nodeClose: cc.Node,
    /** Nen mo phia sau, bam vao cung dong. */
    nodeDim: cc.Node,
  },

  onLoad() {
    this.node.active = false;
    if (this.nodeClose) {
      this.nodeClose.on(cc.Node.EventType.TOUCH_END, this.hide, this);
    }
    if (this.nodeDim) {
      this.nodeDim.on(cc.Node.EventType.TOUCH_END, this.hide, this);
    }
  },

  /**
   * @param {object} vip ket qua VipModel.parse(), de lay so lieu that.
   *                     Khong truyen thi hien ban rut gon.
   */
  show(vip) {
    this.node.active = true;
    if (this.lbContent) {
      this.lbContent.string = this._build(vip);
    }
  },

  hide() {
    this.node.active = false;
  },

  toggle(vip) {
    if (this.node.active) this.hide();
    else this.show(vip);
  },

  // ───────────────────────────────────────────────────────────────

  _build(vip) {
    const f = VipModel.formatNumber;
    const lines = [];

    lines.push('VIPPOINT LÀ GÌ?');
    lines.push('');
    lines.push('• Cứ đặt cược 1.000đ được 1 điểm.');
    lines.push('  Thắng hay thua đều được tính. Tiền thắng');
    lines.push('  đem cược tiếp vẫn cộng điểm bình thường.');
    lines.push('');
    lines.push('• Nạp tiền KHÔNG ra điểm — chỉ đặt cược mới có.');
    lines.push('');
    lines.push('• Điểm tích luỹ chỉ tăng, không bao giờ giảm.');
    lines.push('  Hạng VIP đã lên là giữ vĩnh viễn.');
    lines.push('');
    lines.push('ĐỂ LÊN HẠNG CẦN ĐỦ CẢ HAI');
    lines.push('  1. Điểm cược tích luỹ đạt mốc của hạng đó');
    lines.push('  2. Tổng tiền đã nạp đạt mức tối thiểu');
    lines.push('');

    // Vi du lay tu chinh bac ke tiep cua nguoi dang xem
    const ex = (vip && vip.next) || null;
    if (ex) {
      lines.push(`VÍ DỤ — ${ex.name}`);
      lines.push(`  Cược ${f(VipModel.pointToMoney(ex.vpRequired))}đ`);
      lines.push(`     → ${f(ex.vpRequired)} điểm`);
      if (ex.requiredDeposit > 0) {
        lines.push(`  Và đã nạp ${f(ex.requiredDeposit)}đ`);
      }
      if (ex.reward > 0) {
        lines.push(`  → lên ${ex.name}, nhận ${f(ex.reward)}đ`);
      }
      lines.push('');
    }

    lines.push('QUYỀN LỢI MỖI HẠNG');
    lines.push('  • Thưởng thăng hạng — nhận một lần');
    lines.push('  • Thưởng tháng — nhận mỗi tháng');
    lines.push('  • Hoàn trả cược — tính theo % tiền cược');
    lines.push('');
    lines.push('Hạng càng cao thì cả ba khoản đều càng lớn.');

    if (vip && !vip.accurate) {
      lines.push('');
      lines.push('* Số điểm đang hiển thị là ước lượng.');
    }

    return lines.join('\n');
  },
});
