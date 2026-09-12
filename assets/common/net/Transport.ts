import { Envelope, Err, MsgRes, MsgType, SharedCmd } from "./Envelope";
import Clock from "./Clock";

/**
 * Transport.ts — tầng vận chuyển dùng chung cho mọi game nối tới server .NET 10.
 *
 * 🔴 NÓ KHÔNG BIẾT LUẬT GAME NÀO. Không bàn, không ghế, không lượt, không mã lệnh.
 * Chỉ phong bì, kết nối, khớp cặp lệnh↔phản hồi, chống trùng lệnh tiền, ping/pong,
 * nối lại. Bảng lệnh là việc của từng họ game.
 *
 * Thêm khái niệm của một game cụ thể vào đây là bước đầu tiên để nó phình thành thư
 * viện-vạn-năng mà 16 game cùng kéo vào và không ai dám sửa. Nếu thấy buộc phải thêm,
 * hãy hỏi trước — gần như luôn có chỗ khác đúng hơn.
 */

export enum TrangThai {
    Roi = "roi",
    DangNoi = "dang-noi",
    DaNoi = "da-noi",
    DangNoiLai = "dang-noi-lai",
    DaDong = "da-dong",
}

export interface TuyChon {
    /** Ví dụ `wss://card.example.com/ws`. */
    url: string;
    /** Gắn vào query string lúc bắt tay. Vẫn gửi lại trong payload LOGIN. */
    token?: string;
    /** Trần hàng đợi gửi. Đầy thì bỏ lệnh KHÔNG đụng tiền và đếm lại. */
    tranHangDoi?: number;
    /** Chờ phản hồi bao lâu thì coi như hỏng. */
    hetGioMs?: number;
    /** Nhịp ping. Vừa giữ kết nối vừa nuôi đồng hồ server. */
    nhipPingMs?: number;
}

interface DangCho {
    giaiQuyet: (env: Envelope) => void;
    tuChoi: (loi: Error) => void;
    dongHo: any;
}

interface ChoGui {
    env: Envelope;
    tien: boolean;
}

/**
 * Ghi lỗi. Có `cc` thì dùng, không thì `console`.
 *
 * Tầng này KHÔNG được phụ thuộc cứng vào Cocos: nó phải chạy được cả ngoài engine để
 * viết được bài kiểm giao thức bằng Node. Một `cc.error` trần là đủ để cả tệp không
 * nạp nổi ngoài trình duyệt Cocos.
 */
function ghiLoi(e: any): void {
    const g: any = typeof globalThis !== "undefined" ? globalThis : {};
    if (g.cc && typeof g.cc.error === "function") g.cc.error(e);
    else if (typeof console !== "undefined") console.error(e);
}

/** Sinh khoá chống trùng. Không cần chuẩn RFC, chỉ cần đủ khó trùng. */
function khoaMoi(): string {
    let s = "";
    for (let i = 0; i < 32; i++) {
        s += ((Math.random() * 16) | 0).toString(16);
        if (i === 7 || i === 11 || i === 15 || i === 19) s += "-";
    }
    return s;
}

export default class Transport {
    private ws: WebSocket = null;
    private readonly opt: TuyChon;
    private readonly dongHoServer = new Clock();

    /**
     * 🔴 BẮT ĐẦU TỪ 1, KHÔNG PHẢI 0.
     *
     * `i = 0` dành riêng cho bản tin server tự đẩy. Nếu client cũng dùng 0 thì một bản
     * tin đẩy sẽ khớp nhầm vào lệnh số 0 và giải quyết sai một lời hứa — lỗi chỉ lộ ra
     * ở chỗ khác hẳn, rất khó lần.
     */
    private seq = 1;

    private dangCho: { [seq: number]: DangCho } = {};
    private hangDoi: ChoGui[] = [];
    private trangThai = TrangThai.Roi;

    private soLanThuLai = 0;
    private daBoKhiGui = 0;
    private daBoKhiNhan = 0;

    private hbTimer: any = null;
    private noiLaiTimer: any = null;
    private dongHan = false;

    private nghePush: Array<(env: Envelope) => void> = [];
    private ngheTrangThai: Array<(t: TrangThai) => void> = [];

    constructor(opt: TuyChon) {
        this.opt = opt;
        this.opt.tranHangDoi = opt.tranHangDoi || 64;
        this.opt.hetGioMs = opt.hetGioMs || 15000;
        this.opt.nhipPingMs = opt.nhipPingMs || 10000;
    }

    // ── Vòng đời ───────────────────────────────────────────────────────

    public noi(): void {
        if (this.ws || this.dongHan) return;
        this.datTrangThai(this.soLanThuLai ? TrangThai.DangNoiLai : TrangThai.DangNoi);

        let url = this.opt.url;
        if (this.opt.token) {
            url += (url.indexOf("?") >= 0 ? "&" : "?") + "access_token=" + encodeURIComponent(this.opt.token);
        }

        const ws = new WebSocket(url);
        this.ws = ws;

        ws.onopen = () => {
            this.soLanThuLai = 0;
            this.datTrangThai(TrangThai.DaNoi);
            this.xaHangDoi();
            this.batNhipTim();
        };

        ws.onmessage = (ev) => this.nhan(ev.data);

        ws.onerror = () => { /* onclose luôn chạy ngay sau, dọn dẹp ở đó */ };

        ws.onclose = () => {
            if (this.ws !== ws) return;         // socket cũ đóng muộn, kệ nó
            this.ws = null;
            this.tatNhipTim();
            this.dongHoServer.xoa();
            this.huyMoiLoiHua("mất kết nối");

            if (this.dongHan) { this.datTrangThai(TrangThai.DaDong); return; }
            this.datTrangThai(TrangThai.Roi);
            this.henNoiLai();
        };
    }

    public dong(): void {
        this.dongHan = true;
        this.tatNhipTim();
        if (this.noiLaiTimer) { clearTimeout(this.noiLaiTimer); this.noiLaiTimer = null; }
        this.huyMoiLoiHua("đã đóng");
        if (this.ws) { this.ws.close(); this.ws = null; }
        this.datTrangThai(TrangThai.DaDong);
    }

    /**
     * Hẹn nối lại, giãn dần KÈM NHIỄU NGẪU NHIÊN.
     *
     * Nhiễu không phải cho đẹp: mất mạng thường làm CẢ ĐÁM client rớt cùng lúc, và nếu
     * ai cũng thử lại đúng một nhịp thì server vừa sống lại đã bị đạp chết lần nữa.
     */
    private henNoiLai(): void {
        if (this.noiLaiTimer || this.dongHan) return;
        const co_ban = Math.min(30000, 500 * Math.pow(2, Math.min(6, this.soLanThuLai)));
        const cho = co_ban * (0.5 + Math.random() * 0.5);
        this.soLanThuLai++;
        this.noiLaiTimer = setTimeout(() => { this.noiLaiTimer = null; this.noi(); }, cho);
    }

    // ── Gửi ────────────────────────────────────────────────────────────

    /**
     * Gửi một lệnh và chờ phản hồi khớp cặp.
     *
     * @param tien Lệnh có đụng tiền không. Đụng tiền thì SINH KHOÁ CHỐNG TRÙNG ngay tại
     *   đây, và khoá đó ĐI THEO lệnh suốt đời — kể cả khi phải nằm hàng đợi rồi gửi lại
     *   sau lúc nối lại.
     *
     *   🔴 RÀNG BUỘC THỨ TỰ QUAN TRỌNG NHẤT: khoá phải có TRƯỚC khi có hàng đợi gửi lại.
     *   Hệ cũ "an toàn nhờ hỏng" — nó vứt gói khi mất mạng nên không bao giờ gửi lại nên
     *   không bao giờ trừ tiền hai lần. Bật hàng đợi mà sinh khoá MỚI mỗi lần gửi là
     *   biến lỗi mạng thành lỗi TIỀN.
     */
    public gui(
        t: MsgType,
        o?: { g?: number; c?: number; d?: any; tien?: boolean }
    ): Promise<Envelope> {
        const co = o || {};
        const env: Envelope = { i: this.seq++, t: t };
        if (co.g) env.g = co.g;
        if (co.c) env.c = co.c;
        if (co.d !== undefined) env.d = co.d;
        if (co.tien) env.x = khoaMoi();

        return new Promise<Envelope>((giaiQuyet, tuChoi) => {
            const dongHo = setTimeout(() => {
                delete this.dangCho[env.i];
                tuChoi(new Error("hết giờ chờ phản hồi lệnh " + env.i));
            }, this.opt.hetGioMs);

            this.dangCho[env.i] = { giaiQuyet: giaiQuyet, tuChoi: tuChoi, dongHo: dongHo };

            if (!this.xepHang({ env: env, tien: !!co.tien })) {
                clearTimeout(dongHo);
                delete this.dangCho[env.i];
                tuChoi(new Error("hàng đợi gửi đã đầy"));
            }
        });
    }

    /**
     * Xếp lệnh vào hàng đợi. Trả `false` nếu không nhận được.
     *
     * Khi hàng đầy: bỏ lệnh KHÔNG đụng tiền cũ nhất và ĐẾM LẠI. Lệnh đụng tiền thì
     * KHÔNG BAO GIỜ bị bỏ — thà từ chối lệnh mới và để người gọi biết, còn hơn lặng lẽ
     * vứt một lệnh tiền rồi không ai hay.
     */
    private xepHang(muc: ChoGui): boolean {
        if (this.hangDoi.length >= this.opt.tranHangDoi) {
            let bo = -1;
            for (let i = 0; i < this.hangDoi.length; i++) {
                if (!this.hangDoi[i].tien) { bo = i; break; }
            }
            if (bo < 0) return false;               // toàn lệnh tiền, không bỏ cái nào

            const cu = this.hangDoi.splice(bo, 1)[0];
            this.daBoKhiGui++;
            this.hoanThanhCho(cu.env.i, null, new Error("bị bỏ vì hàng đợi đầy"));
        }

        this.hangDoi.push(muc);
        this.xaHangDoi();
        return true;
    }

    private xaHangDoi(): void {
        if (!this.ws || this.ws.readyState !== 1) return;
        while (this.hangDoi.length) {
            const muc = this.hangDoi.shift();
            try {
                this.ws.send(JSON.stringify(muc.env));
            } catch (e) {
                this.hangDoi.unshift(muc);          // gửi hỏng thì trả lại đầu hàng
                return;
            }
        }
    }

    // ── Nhận ───────────────────────────────────────────────────────────

    private nhan(tho: any): void {
        let env: Envelope;
        try {
            env = JSON.parse(tho);
        } catch (e) {
            this.daBoKhiNhan++;
            return;                                  // gói hỏng: bỏ, KHÔNG đứt kết nối
        }
        if (!env || typeof env.i !== "number") { this.daBoKhiNhan++; return; }

        if (env.t === MsgRes.Pong) { this.nhanPong(env); return; }

        // 🔴 i = 0 ⇒ SERVER TỰ ĐẨY. Không bao giờ khớp cặp.
        if (env.i === 0) { this.phatSuKien(env); return; }

        const cho = this.dangCho[env.i];
        if (!cho) {
            // Phản hồi tới sau khi đã hết giờ, hoặc sau khi nối lại. Đây là đường
            // BÌNH THƯỜNG chứ không phải ngoại lệ — đẩy vào luồng sự kiện để tầng game
            // tự quyết, đừng vứt đi.
            this.phatSuKien(env);
            return;
        }

        // 🔴 Khớp cặp BẤT KỂ `e`. Lỗi cũng mang seq của lệnh gây ra nó, và client phải
        // dựa vào đó để mở lại nút. Chỉ khớp khi e == 0 là để nút chết im lặng đúng
        // như hệ cũ.
        this.hoanThanhCho(env.i, env, null);
    }

    private hoanThanhCho(seq: number, env: Envelope, loi: Error): void {
        const cho = this.dangCho[seq];
        if (!cho) return;
        clearTimeout(cho.dongHo);
        delete this.dangCho[seq];
        if (loi) cho.tuChoi(loi); else cho.giaiQuyet(env);
    }

    private huyMoiLoiHua(vi: string): void {
        const ds = Object.keys(this.dangCho);
        for (let i = 0; i < ds.length; i++) {
            const k = Number(ds[i]);
            this.hoanThanhCho(k, null, new Error(vi));
        }
    }

    private phatSuKien(env: Envelope): void {
        for (let i = 0; i < this.nghePush.length; i++) {
            try { this.nghePush[i](env); } catch (e) { ghiLoi(e); }
        }
    }

    // ── Ping / đồng hồ server ──────────────────────────────────────────

    private guiLuc = 0;

    private batNhipTim(): void {
        this.tatNhipTim();
        this.ping();
        this.hbTimer = setInterval(() => this.ping(), this.opt.nhipPingMs);
    }

    private tatNhipTim(): void {
        if (this.hbTimer) { clearInterval(this.hbTimer); this.hbTimer = null; }
    }

    private ping(): void {
        if (!this.ws || this.ws.readyState !== 1) return;
        this.guiLuc = Date.now();
        try {
            this.ws.send(JSON.stringify({ i: this.seq++, t: MsgType.Ping }));
        } catch (e) { /* onclose sẽ lo */ }
    }

    private nhanPong(env: Envelope): void {
        const sv = env.d && typeof env.d.now === "number" ? env.d.now : undefined;
        this.dongHoServer.nap(this.guiLuc, Date.now(), sv);
    }

    // ── Bề mặt cho tầng game ───────────────────────────────────────────

    /** Nghe bản tin server tự đẩy. Trả về hàm gỡ nghe. */
    public onSuKien(fn: (env: Envelope) => void): () => void {
        this.nghePush.push(fn);
        return () => {
            const i = this.nghePush.indexOf(fn);
            if (i >= 0) this.nghePush.splice(i, 1);
        };
    }

    /** Nghe đổi trạng thái kết nối. Trả về hàm gỡ nghe. */
    public onTrangThai(fn: (t: TrangThai) => void): () => void {
        this.ngheTrangThai.push(fn);
        return () => {
            const i = this.ngheTrangThai.indexOf(fn);
            if (i >= 0) this.ngheTrangThai.splice(i, 1);
        };
    }

    private datTrangThai(t: TrangThai): void {
        if (this.trangThai === t) return;
        this.trangThai = t;
        for (let i = 0; i < this.ngheTrangThai.length; i++) {
            try { this.ngheTrangThai[i](t); } catch (e) { ghiLoi(e); }
        }
    }

    /**
     * Xin lại ảnh chụp ĐẦY ĐỦ trạng thái bàn.
     *
     * Phơi ra đúng MỘT hàm cho việc này. Ảnh chụp đầy đủ chỉ có ở hai chỗ — lúc vào bàn
     * và lúc gọi hàm này — nên mọi thứ khác là delta. Để mỗi game tự chế cách đồng bộ
     * lại là sớm muộn có game quên mất, và người chơi nối lại mạng xong thì mù hoàn toàn
     * (đúng lỗ thủng nặng nhất của hệ cũ).
     */
    public resync(gameId: number): Promise<Envelope> {
        return this.gui(MsgType.RoomCmd, { g: gameId, c: SharedCmd.Resync });
    }

    public rtt(): number { return this.dongHoServer.rtt(); }
    public rttTot(): number { return this.dongHoServer.rttTot(); }
    public serverNow(): number { return this.dongHoServer.serverNow(); }
    public dongHoSanSang(): boolean { return this.dongHoServer.sanSang(); }
    public trangThaiHienTai(): TrangThai { return this.trangThai; }

    /**
     * Số bản tin đã bỏ. Phơi ra để tầng game ĐỌC ĐƯỢC.
     *
     * Bỏ im lặng thì sau này không ai phân biệt được máy yếu, mạng kém, hay code sai.
     * Phoenix chẳng hạn có thể dựa vào đây để hạ chất lượng hiệu ứng khi thấy rớt nhiều.
     */
    public soDaBo(): { gui: number; nhan: number } {
        return { gui: this.daBoKhiGui, nhan: this.daBoKhiNhan };
    }
}
