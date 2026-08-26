/**
 * QuestGuidePopup — bang huong dan nhiem vu.
 *
 * Noi dung SINH TU DU LIEU THAT lay ve tu may chu, khong go cung — giong
 * cach LixiHelpPanel va VipHelpPanel dang lam. Doi moc hay muc thuong trong
 * QuestConfig thi huong dan tu dong khop theo, khong con canh bang so mot
 * dang huong dan noi mot neo.
 */

'use strict';

const QuestService = require('QuestService');
const QuestModel = require('QuestModel');

module.exports = cc.Class({
  extends: cc.Component,

  properties: {
    /** Noi dung, mot label duy nhat cho de sua. */
    lbContent: cc.Label,
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
    this._load();
  },

  _load() {
    QuestService.getList()
      .then((raw) => {
        if (!this.node || !this.node.isValid) return;
        const list = (raw || []).map(QuestModel.parseItem).filter((x) => x !== null);
        if (this.lbContent) this.lbContent.string = this._build(list);
      })
      .catch(() => {
        if (this.node && this.node.isValid && this.lbContent) {
          this.lbContent.string = this._build([]);
        }
      });
  },

  _build(list) {
    const f = QuestModel.formatNumber;
    const lines = [];

    lines.push('NHIỆM VỤ LÀ GÌ');
    lines.push('');
    lines.push('• Chơi game như bình thường, hệ thống tự ghi nhận');
    lines.push('• Đủ mốc thì bấm NHẬN để lấy tiền vào ví');
    lines.push('• Không cần làm gì thêm, không cần chờ duyệt');
    lines.push('');

    const daily = list.filter((x) => x.cycle === QuestModel.CYCLE.DAILY);
    const once = list.filter((x) => x.cycle === QuestModel.CYCLE.ONCE);

    if (daily.length) {
      lines.push('NHIỆM VỤ HẰNG NGÀY');
      lines.push('   Làm lại được mỗi ngày, 0h reset');
      for (const q of daily) {
        lines.push(`   • ${q.title} — thưởng ${f(q.reward)}đ`);
      }
      lines.push('');
    }

    if (once.length) {
      lines.push('NHIỆM VỤ SỰ KIỆN');
      lines.push('   Chỉ làm được MỘT LẦN, xong là hết');
      for (const q of once) {
        const moc = q.target > 1 ? ` (${f(q.target)}đ)` : '';
        lines.push(`   • ${q.title}${moc} — thưởng ${f(q.reward)}đ`);
      }
      lines.push('');
    }

    if (list.length) {
      const total = list.reduce((s, x) => s + x.reward, 0);
      const got = list.filter((x) => x.isClaimed).reduce((s, x) => s + x.reward, 0);
      lines.push('BẠN ĐANG CÓ');
      lines.push(`   Đã nhận: ${f(got)}đ / ${f(total)}đ`);
      const ready = list.filter((x) => x.action === QuestModel.ACTION.CLAIM);
      if (ready.length) {
        const amt = ready.reduce((s, x) => s + x.reward, 0);
        lines.push(`   Đang chờ nhận: ${ready.length} nhiệm vụ, ${f(amt)}đ`);
      }
      lines.push('');
    }

    lines.push('CẦN NHỚ');
    lines.push('   • Tiến độ chỉ tính từ lúc tính năng bật');
    lines.push('   • Mỗi game tính riêng, cược game này');
    lines.push('     không tính cho nhiệm vụ game kia');
    lines.push('   • Nạp ngân hàng mới tính, nạp kênh khác');
    lines.push('     không tính vào nhiệm vụ nạp');

    return lines.join('\n');
  },

  _close() {
    if (this.node && this.node.isValid) this.node.destroy();
  },
});
