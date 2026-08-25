/**
 * LixiHelpPanel — bang giai thich li xi.
 *
 * Mo bang nut "?" o goc popup Li xi.
 *
 * Noi dung SINH TU DU LIEU THAT lay ve tu server, khong go cung — giong
 * cach VipHelpPanel dang lam cho VIPPOINT. Nho vay doi so luong hay menh
 * gia trong bang LixiConfig thi phan huong dan tu dong khop theo, khong con
 * canh bang so mot dang phan giai thich noi mot neo.
 *
 * Day cung la ly do con so quang cao LUON bang con so thuc phat: ca hai
 * cung doc tu mot nguon.
 */

'use strict';

const LixiModel = require('LixiModel');

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
    if (this.nodeClose) {
      this.nodeClose.on(cc.Node.EventType.TOUCH_END, this._close, this);
    }
    if (this.nodeDim) {
      this.nodeDim.on(cc.Node.EventType.TOUCH_END, this._close, this);
    }
  },

  /**
   * @param {object} summary  ket qua LixiModel.parseSummary()
   * @param {object} vip      thong tin VIP (de noi ro thang nay duoc bao nhieu)
   */
  show(summary, vip) {
    if (this.lbContent) {
      this.lbContent.string = this._build(summary, vip);
    }
  },

  _build(s, vip) {
    const f = LixiModel.formatNumber;
    const lines = [];

    lines.push('CÓ BA LOẠI LÌ XÌ');
    lines.push('');

    // ── 1. Khung gio vang ────────────────────────────────────────────
    lines.push('1. KHUNG GIỜ VÀNG');
    lines.push('   Mỗi ngày 12h00 và 21h00');
    if (s && s.goldenQuantity > 0) {
      // Con so LAY TU CAU HINH THAT — bang dung so hong bao se tha ra
      lines.push(`   Mỗi lần thả ${s.goldenQuantity} hồng bao, mỗi cái ${s.goldenText}`);
    }
    lines.push('   Ai nhanh tay thì được, hết là hết');
    lines.push('   Phải đang đăng nhập lúc đó');
    lines.push('   Mỗi người một hồng bao mỗi đợt');
    lines.push('');

    // ── 2. Li xi thang ───────────────────────────────────────────────
    lines.push('2. LÌ XÌ THÁNG');
    lines.push('   Ngày 18 hàng tháng');
    lines.push('   Số tiền theo hạng VIP — hạng càng cao càng nhiều');
    if (vip && vip.currentRankId) {
      const rank = vip.ranks && vip.ranks[vip.currentRankId - 1];
      const reward = rank && rank.monthlyReward;
      lines.push(`   Hạng của bạn: VIP ${vip.currentRankId}`);
      if (reward > 0) {
        lines.push(`   Bạn sẽ nhận: ${f(reward)}đ`);
      } else {
        lines.push('   Hạng hiện tại chưa có lì xì tháng');
        lines.push('   Lên hạng cao hơn để bắt đầu nhận');
      }
    }
    lines.push('   Nhận trong 7 ngày');
    lines.push('');

    // ── 3. Qua tang CSKH ─────────────────────────────────────────────
    lines.push('3. QUÀ TẶNG TỪ CSKH');
    lines.push('   Không có lịch cố định');
    lines.push('   CSKH gửi khi có dịp hoặc khi cần bù đắp');
    lines.push('   Nhận trong 7 ngày');
    lines.push('');

    // ── Luu y ────────────────────────────────────────────────────────
    lines.push('CẦN NHỚ');
    lines.push('   • Hồng bao quá hạn không nhận thì mất');
    lines.push('   • Tiền vào thẳng ví, dùng được ngay');
    lines.push('');

    // ── Tinh trang hien tai ──────────────────────────────────────────
    if (s) {
      lines.push('BẠN ĐANG CÓ');
      if (s.pendingCount > 0) {
        lines.push(`   ${s.pendingCount} hồng bao chưa mở — tổng ${f(s.pendingAmount)}đ`);
      } else {
        lines.push('   Chưa có hồng bao nào');
      }

      if (s.activeCampaignId > 0 && s.activeRemain > 0) {
        if (s.alreadyGrabbed) {
          lines.push('   Đợt giờ vàng đang mở — bạn đã nhận rồi');
        } else {
          lines.push(`   Đợt giờ vàng đang mở, còn ${s.activeRemain} hồng bao`);
          lines.push(`   Còn ${LixiModel.formatCountdown(s.activeSeconds)} nữa là đóng`);
        }
      }

      if (!s.enabled) {
        lines.push('');
        lines.push('   * Tính năng lì xì đang tạm dừng.');
      }
    }

    return lines.join('\n');
  },

  _close() {
    if (this.node && this.node.isValid) this.node.destroy();
  },
});
