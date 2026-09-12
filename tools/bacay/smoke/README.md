# smoke — chạy thông một ván qua WebSocket thật

Kiểm **tầng vận chuyển thật** (`assets/common/net`) nói chuyện được với server .NET 10,
không cần Cocos, không cần giao diện.

Nó dùng đúng bộ mã sẽ chạy trong game — không phải bản mô phỏng viết riêng. Bản mô phỏng
thì chỉ chứng minh bản mô phỏng chạy được.

## Chạy

**1. Server, ở một cửa sổ khác** (ví trong bộ nhớ, không chạm DB thật):

```
cd C:\Server\CardGame
$env:ASPNETCORE_URLS="http://127.0.0.1:5310"
$env:ConnectionStrings__BettingGameCore=""     # rỗng ⇒ ví dev trong bộ nhớ
$env:ConnectionStrings__Redis=""               # rỗng ⇒ chống trùng trong bộ nhớ
$env:Auth__SignalSecret="smoke-test-secret"
dotnet run --project src/CardGame.Server/CardGame.Server.csproj --no-launch-profile
```

**2. Biên dịch tầng vận chuyển rồi chạy:**

```
npx tsc --target es2017 --lib es2017,dom --module commonjs --skipLibCheck ^
  --outDir tools/bacay/smoke/net ^
  assets/common/net/Envelope.ts assets/common/net/Clock.ts assets/common/net/Transport.ts

node tools/bacay/smoke/smoke.js
```

## Ba bài kiểm

| Tệp | Kiểm gì | Có chạm tiền không |
|---|---|---|
| `smoke.js` | một ván trọn vẹn qua tầng vận chuyển thật | có — chỉ chạy với **ví dev** |
| `reconnect.js` | rớt mạng giữa ván → nối lại → đối soát sổ | có — chỉ chạy với **ví dev** |
| `ketnoi.js` | endpoint công khai mang được WebSocket | **không** — chỉ đăng nhập + nhịp tim |

`ketnoi.js` cố ý không vào bàn: bản chạy thật cắm ví THẬT, mà vào bàn là server thu tiền
sàn ngay. Đường truyền chứng minh được mà không cần chạm tới một đồng nào.

```
node tools/bacay/smoke/ketnoi.js wss://card.bay789x.me/ws ^
  C:\IIS\Service\CardGame.Server\appsettings.Production.json
```

Nó còn giữ im lặng 45 giây để bắt proxy cắt kết nối nhàn rỗi — thứ chỉ lộ ra khi đi qua
Cloudflare, không bao giờ thấy khi chạy `127.0.0.1`.

## Nó khẳng định gì

- Đăng nhập bằng token đúng khuôn hệ cũ (TripleDES + SHA256)
- Vào bàn, hai người, một ván trọn vẹn: `Confirm → Dealing → Flipping → Showdown → Settling`
- Nhận được `DEAL`, `FLIPPED`, `SHOWDOWN`, `SETTLE`, `BALANCE`
- `RESYNC` trả ảnh chụp đầy đủ
- Đồng hồ server đồng bộ được (cần Pong kèm `d.now`)

## Hai bẫy đã dẫm khi viết nó

1. **`ExpiredAt` phải là GIỜ ĐỊA PHƯƠNG.** Hệ cũ phát token bằng `DateTime.Now` và bộ kiểm
   cũng so bằng `DateTime.Now`. Ghi giờ UTC thì ở múi +7 token sinh ra đã "hết hạn" 6 tiếng
   trước khi kịp dùng — và lỗi trả về chỉ nói "token không hợp lệ", không nói vì sao.

2. **Pong phải kèm mốc giờ server.** Thiếu nó thì client chỉ đo được độ trễ chứ không suy
   ra được độ lệch đồng hồ, và `serverNow()` trở thành giờ máy người chơi.
