// PhoenixRateColor - bang mau he so, chep NGUYEN VAN tu sunwin.
//
// Nguon: template_aviator\aviator_code\modules_readable\AviatorConstant.js dong 11 (bang mau)
//        + AviatorHelper.js dong 41 (nguong chia).
//
//   RATE_1_5 = #f9f9f9   RATE_2  = #f9f9f9   RATE_4  = #cef435   RATE_7  = #45aaff
//   RATE_15  = #8b63ff   RATE_25 = #ff4949   RATE_40 = #d229e6
//   RATE_75 = RATE_100 = RATE_500 = RATE_MAX = #ffba00
//
// Nguong that (AviatorHelper.js:41):
//   n == -1 || n < 1.5 -> RATE_1_5 | n < 3 -> RATE_4  | n < 7  -> RATE_7
//   n < 10 -> RATE_15  | n < 20 -> RATE_25 | n < 35 -> RATE_40 | con lai -> RATE_75(vang)
// (Nhanh 'n < 1.5 -> RATE_2' trong ban goc la CODE CHET — khong bao gio toi duoc, da bo.)
//
// LUU Y: sunwin TO MAU CHU, khong dung anh nen mau cho tung o nhu ban Roy88 cu cua ta.

(function () {
    var HEX = {
        R1_5: '#f9f9f9',
        R4: '#cef435',
        R7: '#45aaff',
        R15: '#8b63ff',
        R25: '#ff4949',
        R40: '#d229e6',
        R75: '#ffba00'
    };

    var cache = {};
    function toColor(hex) {
        if (!cache[hex]) cache[hex] = new cc.Color().fromHEX(hex);
        return cache[hex];
    }

    cc.PhoenixRateColor = {
        HEX: HEX,

        // Tra cc.Color theo he so. Giu nguyen thu tu nguong cua ban goc.
        get: function (n) {
            if (n === -1 || n === undefined || n === null || n < 1.5) return toColor(HEX.R1_5);
            if (n < 3) return toColor(HEX.R4);
            if (n < 7) return toColor(HEX.R7);
            if (n < 10) return toColor(HEX.R15);
            if (n < 20) return toColor(HEX.R25);
            if (n < 35) return toColor(HEX.R40);
            return toColor(HEX.R75);
        }
    };
}).call(this);
