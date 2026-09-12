/**
 * token.js — dựng token đúng khuôn hệ cũ, dùng chung cho các bài kiểm giao thức.
 *
 * Xem `CardGame.Server/Auth/LegacyTokenValidator.cs` — đây là bản đối xứng của nó.
 *
 *   phần mã  = base64( TripleDES-ECB-PKCS7( khoá, JSON ) )
 *   khoá     = 24 byte ASCII đầu của md5hex("System.Byte[]")
 *   chữ ký   = sha256hex( "{secret}.{phần mã}" )
 *   token    = "{phần mã}.{chữ ký}"
 *
 * ⚠ Chuỗi khoá đúng là `"System.Byte[]"` — KHÔNG phải lỗi đánh máy. Hệ cũ gọi
 * `Encoding.UTF8.GetBytes(Secret).ToString()`, và trong .NET thì `byte[].ToString()`
 * trả về đúng tên kiểu. Nên hằng `Secret` của họ chưa bao giờ được dùng làm khoá thật.
 */

'use strict';

const crypto = require('crypto');
const fs = require('fs');

/**
 * Lấy khoá ký.
 * @param {string} [a] Bỏ trống = khoá thử. Đường dẫn `.json` = đọc thẳng từ file cấu
 *   hình SERVER đang dùng, để kiểm được khoá thật mà không phải chép nó đi đâu.
 */
function docSecret(a) {
    if (!a) return 'smoke-test-secret';
    if (!a.endsWith('.json')) return a;
    // PowerShell hay ghi kèm BOM — cắt trước khi parse.
    const tho = fs.readFileSync(a, 'utf8').replace(/^﻿/, '');
    return JSON.parse(tho).Auth.SignalSecret;
}

function taoToken(userId, nick, secret) {
    const md5hex = crypto.createHash('md5').update('System.Byte[]', 'ascii').digest('hex');
    const key = Buffer.from(md5hex.slice(0, 24), 'ascii');

    const json = JSON.stringify({
        UserID: userId,
        NickName: nick,
        ServiceID: 1,
        AvatarID: 0,
        IPAddress: '127.0.0.1',
        // 🔴 GIỜ ĐỊA PHƯƠNG, không phải UTC.
        // Hệ cũ phát bằng DateTime.Now và bộ kiểm cũng so bằng DateTime.Now. Ghi giờ
        // UTC thì ở múi +7 token sinh ra đã "hết hạn" 6 tiếng trước khi kịp dùng — và
        // lỗi trả về chỉ nói "token không hợp lệ", không nói vì sao.
        ExpiredAt: new Date(Date.now() + 3600e3 - new Date().getTimezoneOffset() * 60000)
            .toISOString().replace('Z', ''),
    });

    const c = crypto.createCipheriv('des-ede3', key, null);   // des-ede3 = 3DES ECB
    c.setAutoPadding(true);
    const phanMa = Buffer.concat([c.update(json, 'ascii'), c.final()]).toString('base64');

    const chuKy = crypto.createHash('sha256').update(`${secret}.${phanMa}`, 'utf8').digest('hex');
    return `${phanMa}.${chuKy}`;
}

module.exports = { taoToken, docSecret };
