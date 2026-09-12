/**
 * index.ts — bề mặt công khai của tầng vận chuyển.
 *
 * Tầng game CHỈ nên nhập từ đây. Nhập thẳng vào tệp bên trong là tự buộc mình vào
 * cấu trúc nội bộ, và lần sau đổi chỗ một tệp là gãy cả hai game.
 *
 * Cách dùng tối thiểu:
 *
 *     import { Transport, MsgType, Err } from "../../common/net";
 *
 *     const net = new Transport({ url: "wss://…/ws", token: token });
 *     net.onSuKien((env) => { ... });      // bản tin server tự đẩy (i = 0)
 *     net.noi();
 *
 *     const res = await net.gui(MsgType.Login, { d: { token: token } });
 *     if (res.e) { ...mở lại nút và báo lỗi... }
 *
 * 🔴 Lệnh đụng tiền BẮT BUỘC đánh dấu `tien: true` để tầng này sinh khoá chống trùng:
 *
 *     await net.gui(MsgType.RoomCmd, { g: 51, c: 51001, d: { amount: 1000 }, tien: true });
 *
 * Quên cờ đó thì server TỪ CHỐI THẲNG với BadMessage — cố ý hỏng to lúc phát triển,
 * còn hơn im lặng mở đường cho trừ tiền hai lần khi mạng chập chờn.
 */

export { default as Transport, TrangThai, TuyChon } from "./Transport";
export { default as Clock } from "./Clock";
export { Envelope, MsgType, MsgRes, Err, SharedCmd, thanhCong, duocGuiLai } from "./Envelope";
