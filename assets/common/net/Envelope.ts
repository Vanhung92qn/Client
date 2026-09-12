/**
 * Envelope.ts — phong bì bản tin, dùng chung cho MỌI game nối tới server .NET 10.
 *
 * Tệp này là HỢP ĐỒNG THUẦN: không logic, không trạng thái, không phụ thuộc gì.
 * Nguồn sự thật là `C:\Server\CardGame\docs\PROTOCOL.md` §1–§2 và §6; sửa giao thức
 * thì sửa tài liệu đó trước, sửa đây sau.
 *
 * 🔴 KHÔNG được thêm mã lệnh của game nào vào đây. Dải lệnh là việc của từng họ game
 * (`c = gameId * 1000 + n`). Nhét bảng lệnh vào tầng chung là bước đầu tiên để nó phình
 * thành thư viện-vạn-năng mà ai cũng kéo vào và không ai dám sửa.
 */

/** Loại bản tin client → server. */
export enum MsgType {
    Login = 1,
    Logout = 2,
    JoinRoom = 3,
    LeaveRoom = 4,
    /** Lệnh trong bàn — mang `g` + `c`. Mọi luật game đi qua đây. */
    RoomCmd = 5,
    /** Lệnh ngoài sảnh. */
    ZoneCmd = 6,
    Ping = 7,
    QuickJoin = 8,
}

/** Loại bản tin server → client. */
export enum MsgRes {
    Login = 1,
    Logout = 2,
    /** Kèm ảnh chụp ĐẦY ĐỦ — một trong đúng hai chỗ được gửi full. */
    JoinRoom = 3,
    LeaveRoom = 4,
    /** Mọi sự kiện trong game về qua đây. */
    Extension = 5,
    Pong = 6,
    /** Server đá: token hết hạn, đăng nhập nơi khác, bảo trì. */
    Kick = 9,
}

/** Mã lỗi. Xem PROTOCOL.md §6. */
export enum Err {
    Ok = 0,
    BadMessage = -1,
    NotAuthenticated = -2,
    NotInRoom = -3,
    WrongPhase = -4,
    InvalidAction = -5,
    RoomFull = -6,
    RoomDisabled = -7,

    /**
     * Lệnh tiền hỏng giữa chừng — KHÔNG BIẾT ví đã chuyển hay chưa.
     *
     * 🔴 Khác `ServerError` ở đúng một điểm sống còn: ServerError nghĩa là "chắc chắn
     * không có gì xảy ra, cứ gửi lại"; mã này nghĩa là "có thể đã xảy ra rồi,
     * ĐỪNG tự động gửi lại". Client phải xin `resync()` thay vì gửi lại lệnh.
     */
    PendingReview = -98,

    ServerError = -99,

    /** Không đủ số dư. Giữ nguyên số của stored procedure tầng tiền. */
    NotEnoughBalance = -520,
}

/** Lệnh dùng chung mọi game BÀI (dải 0–999). Game khác không cần biết. */
export const SharedCmd = {
    Chat: 4,
    Emote: 5,
    Resync: 6,
    RoomList: 10,
    RoomSub: 11,
    RoomUnsub: 12,
    CreateRoom: 13,

    PlayerJoined: 101,
    PlayerLeft: 102,
    ChatMsg: 103,
    EmoteMsg: 104,
    Balance: 105,
    Snapshot: 106,
    RoomListRes: 110,
    RoomUpd: 111,
    RoomGone: 112,
};

/**
 * Phong bì. Một khung duy nhất cho cả hai chiều.
 *
 * Trường lạ bị BỎ QUA IM LẶNG — nhờ vậy server thêm trường mới không làm gãy client cũ.
 */
export interface Envelope {
    /**
     * Số thứ tự, để khớp lệnh với phản hồi.
     *
     * 🔴 `i = 0` nghĩa là SERVER TỰ ĐẨY, không trả lời ai. Tuyệt đối không được khớp
     * cặp với lệnh nào. Client bắt đầu đánh số từ 1 để quy ước này thành bất biến
     * chứ không còn là thoả thuận lỏng.
     */
    i: number;
    /** `MsgType` ở chiều lên, `MsgRes` ở chiều xuống. */
    t: number;
    /** GameID. 0 = không thuộc game nào. */
    g?: number;
    /** Mã lệnh trong game. */
    c?: number;
    /** Dữ liệu của lệnh. */
    d?: any;
    /** Khoá chống trùng (GUID) — CHỈ có ở lệnh đụng tiền. Xem PROTOCOL.md §7. */
    x?: string;
    /** Mã lỗi, chỉ có ở chiều xuống. 0 = thành công. */
    e?: number;
}

/** Lệnh này có thành công không. Lỗi thì `e` khác 0. */
export function thanhCong(env: Envelope): boolean {
    return !env.e;
}

/**
 * Có được phép tự động gửi lại lệnh này không sau khi nhận lỗi.
 *
 * CHỈ `ServerError` mới an toàn để tự gửi lại. `PendingReview` thì TUYỆT ĐỐI KHÔNG:
 * ví có thể đã chuyển tiền rồi, gửi lại là trừ lần thứ hai.
 */
export function duocGuiLai(env: Envelope): boolean {
    return env.e === Err.ServerError;
}
