/**
 * Clock.ts — đồng hồ server, suy từ ping/pong.
 *
 * VÌ SAO TÁCH RIÊNG: nó nhỏ nhưng có một chỗ tinh tế đủ để đáng đứng một mình —
 * lấy mẫu cuối là SAI, phải làm mượt.
 *
 * VÌ SAO TẦNG CHUNG CẦN: mọi game đều có đồng hồ đếm ngược do server đặt. Đồng hồ
 * client lệch 300 ms là người chơi thấy "hết giờ" TRƯỚC server — bấm không kịp, hoặc
 * tệ hơn là thấy nút còn sáng mà bấm vào thì server báo sai pha.
 *
 * 🔴 NHƯNG: con số ở đây là CHUYỆN HIỂN THỊ, KHÔNG PHẢI CHUYỆN TIỀN.
 * Server tự tính lại mọi thứ đụng tiền từ mốc thời gian của chính nó. Đừng bao giờ
 * dùng `serverNow()` để quyết định một khoản tiền — bài học từ hệ Phoenix cũ: ba đồng
 * hồ khác nhau cùng mô tả một chuyến bay, sai lệch nhỏ nhưng CÓ HỆ THỐNG và luôn
 * nghiêng về nhà cái. Gốc là tin vào đồng hồ hiển thị.
 */

/** Một lần đo. */
interface Mau {
    rtt: number;
    /** `serverTime − clientTime + rtt/2` */
    lech: number;
}

export default class Clock {
    /** Giữ vài mẫu gần nhất để chọn được mẫu sạch, không bị một gói nghẽn kéo lệch. */
    private static readonly CUA_SO = 8;

    /**
     * Mỗi lần hiệu chỉnh chỉ kéo được bấy nhiêu phần khoảng cách.
     *
     * Gán thẳng độ lệch mới là đồng hồ NHẢY — người chơi thấy số đếm ngược giật hoặc
     * lùi lại. Kéo dần thì sai số tan đi trong vài nhịp mà mắt không thấy.
     */
    private static readonly HE_SO_KEO = 0.25;

    /** Lệch quá ngưỡng này thì nhảy thẳng: đang sai quá xa, kéo dần còn tệ hơn. */
    private static readonly NGUONG_NHAY_MS = 2000;

    private mau: Mau[] = [];
    private lech = 0;
    private daCo = false;

    /**
     * Nạp một lần đo.
     * @param guiLuc  `Date.now()` lúc gửi Ping
     * @param nhanLuc `Date.now()` lúc nhận Pong
     * @param serverMs mốc thời gian server kèm trong Pong. Bỏ trống = server không gửi,
     *                 lúc đó chỉ đo được RTT chứ không suy được độ lệch.
     */
    public nap(guiLuc: number, nhanLuc: number, serverMs?: number): void {
        const rtt = nhanLuc - guiLuc;
        if (rtt < 0) return;                       // đồng hồ máy vừa bị chỉnh, bỏ mẫu

        if (serverMs === undefined || serverMs === null) {
            this.mau.push({ rtt: rtt, lech: this.lech });
        } else {
            this.mau.push({ rtt: rtt, lech: serverMs - nhanLuc + rtt / 2 });
        }

        if (this.mau.length > Clock.CUA_SO) this.mau.shift();
        if (serverMs === undefined || serverMs === null) return;

        // 🔴 Chọn mẫu có RTT NHỎ NHẤT, không lấy trung bình và không lấy mẫu cuối.
        // Mẫu đi nhanh nhất là mẫu ít bị hàng đợi mạng làm méo nhất, nên độ lệch suy ra
        // từ nó là đáng tin nhất. Trung bình thì bị mấy gói nghẽn kéo đi.
        let tot = this.mau[0];
        for (let i = 1; i < this.mau.length; i++) {
            if (this.mau[i].rtt < tot.rtt) tot = this.mau[i];
        }

        if (!this.daCo || Math.abs(tot.lech - this.lech) > Clock.NGUONG_NHAY_MS) {
            this.lech = tot.lech;
            this.daCo = true;
        } else {
            this.lech += (tot.lech - this.lech) * Clock.HE_SO_KEO;
        }
    }

    /** Độ trễ khứ hồi gần nhất, mili giây. 0 = chưa đo được lần nào. */
    public rtt(): number {
        return this.mau.length ? this.mau[this.mau.length - 1].rtt : 0;
    }

    /** RTT nhỏ nhất trong cửa sổ — dùng để vẽ vạch mạng cho đỡ nhấp nháy. */
    public rttTot(): number {
        if (!this.mau.length) return 0;
        let m = this.mau[0].rtt;
        for (let i = 1; i < this.mau.length; i++) m = Math.min(m, this.mau[i].rtt);
        return m;
    }

    /** Thời điểm hiện tại THEO ĐỒNG HỒ SERVER, mili giây. */
    public serverNow(): number {
        return Date.now() + this.lech;
    }

    /** Đã đo được độ lệch lần nào chưa. Chưa thì `serverNow()` chính là giờ máy. */
    public sanSang(): boolean {
        return this.daCo;
    }

    /** Mất kết nối thì vứt hết mẫu cũ: đường mạng mới có thể khác hẳn. */
    public xoa(): void {
        this.mau = [];
        this.daCo = false;
        this.lech = 0;
    }
}
