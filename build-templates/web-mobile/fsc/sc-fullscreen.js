// ============================================================================
//  SumClub — Adapter "vuốt lên để ẩn thanh URL (fullscreen)" cho iPhone Safari.
//  File tĩnh: build-templates/web-mobile/fsc/sc-fullscreen.js  (copy nguyên vào build).
//
//  v10 = PORT TRUNG THÀNH luồng Safari-iOS của hitclub (fsc/cmn.js), sau 9 vòng
//  tự-bịa-logic thất bại. Bài học xương máu từ đọc cmn.js + DUMP máy thật:
//   • Trên iOS 15+, gọi scrollTo() BẰNG CODE **KHÔNG** làm hiện lại thanh URL
//     (chỉ user KÉO XUỐNG mới hiện). Suốt v3-v9 tôi tưởng ngược -> né scroll -> sai.
//   • hitclub CHỦ ĐỘNG scrollTo: =0 khi đã full, =-100 khi chưa full.
//   • hitclub CHỈ phản ứng theo SỰ KIỆN rời rạc (resize + touchend), KHÔNG poll nóng.
//     Cái poll 500ms + reflow-liên-hồi tôi bịa ra chính là thủ phạm nhấp nháy.
//   • Body: chưa full = '110vh' (có chỗ cuộn để vuốt); đã full = engine/logic để '100%'
//     (canvas tràn ra -> scroll range 0 -> bar đứng im, hết gap).
//
//  GIỮ NGUYÊN nguyên tắc geometry-free: KHÔNG tự ghi canvas/container; canvas do
//  ENGINE (_setupForceLandscape) fit qua 'resize'. Adapter chỉ lo body-height + scroll + mask.
//  CỔNG AN TOÀN: chỉ chạy khi cc.view._isRotated===false (cầm ngang thật); cầm dọc -> A2HS lo.
// ============================================================================
(function (global) {
  'use strict';

  var VER = 'v19';

  var CFG = {
    HINT_DELAY_MS: 1200,   // trễ hiện gợi ý vuốt lần đầu (chờ game vẽ xong)
    CB_DELAY_MS: 120,      // trễ đọc trạng thái fullscreen sau mỗi resize (hitclub dùng 100ms)
    BODY_H: '110vh'        // chưa full: body cao hơn viewport để có chỗ cuộn (Chrome-iOS 150vh)
  };

  var S = {
    inited: false, armed: false, isFS: null, hintOff: false, touching: false, kbShow: false,
    minH: 0, maxH: 0, bodyHeight: '110vh', frameHooked: false,
    mask: null, cbT: null, scrollT: null, rT: null, sT: null, lastKb: null, dumpT: null
  };

  // Telemetry: soi F12 lọc "[SC]".
  function dlog() {
    try { console.log.apply(console, ['[SC ' + VER + ']'].concat([].slice.call(arguments))); } catch (e) {}
  }
  function isEditing() {
    try { var el = document.activeElement; return !!(el && /INPUT|TEXTAREA/i.test(el.tagName)); }
    catch (e) { return false; }
  }

  // ---- helpers cơ bản ------------------------------------------------------
  function hasCC() { return (typeof global.cc !== 'undefined') && global.cc && cc.view && cc.sys; }
  function ua() { return (global.navigator && navigator.userAgent) || ''; }
  function isIOS() { return hasCC() && cc.sys.os === cc.sys.OS_IOS; }
  function isRealIPhone() { return /iPhone|iPod/i.test(ua()); }
  function isChromeIOS() { return /CriOS/i.test(ua()); }
  function isStandalone() {
    try {
      return (('standalone' in navigator) && navigator.standalone) ||
             (global.matchMedia && matchMedia('(display-mode: standalone)').matches);
    } catch (e) { return false; }
  }
  function isPortraitGame() {
    try { var d = cc.view.getDesignResolutionSize(); return d && d.height > d.width; } catch (e) { return false; }
  }
  function isLandscapeScreen() { return global.innerWidth >= global.innerHeight; }
  // CỔNG 1: máy đang NGANG thật, engine KHÔNG xoay container (an toàn cho body-scroll).
  function safeToArm() {
    return hasCC() && cc.view._isRotated === false && isLandscapeScreen() && !isPortraitGame();
  }

  var iOsVersion = (function () { var m = ua().match(/OS (\d+)[_.](\d+)/); return m ? parseFloat(m[1] + '.' + m[2]) : 15; })();

  // ---- phát hiện fullscreen: MIN/MAX hysteresis (robust, không phụ thuộc outerHeight) ------
  // (Giữ từ v9 — đã thấy "FS VAO" bắn đúng trên máy user; hitclub dùng outerHeight/clientHeight
  //  nhưng các giá trị đó thất thường giữa máy, min/max thì bất chấp.)
  function detectFS() {
    var h = global.innerHeight;
    if (!S.minH || h < S.minH) S.minH = h;
    if (h > S.maxH) S.maxH = h;
    if ((S.maxH - S.minH) <= 24) return false;   // chưa thấy bar dịch đủ biên độ
    if (h >= S.maxH - 12) return true;            // rõ ràng fullscreen
    if (h <= S.minH + 24) return false;           // rõ ràng bar hiện
    return S.isFS === true;                       // vùng giữa (animation) -> giữ nguyên
  }

  // ---- mask gợi ý vuốt -----------------------------------------------------
  function showMask(v) {
    if (v && S.hintOff) v = false;      // user đã bấm X -> tôn trọng
    if (S.mask) S.mask.style.display = v ? 'block' : 'none';
    global.__SC_SWIPE_ACTIVE__ = !!v;   // để A2HS trong inject tự nhường
  }

  // [v16] scrollTo AN TOÀN: TUYỆT ĐỐI không cuộn khi ngón tay còn trên màn (S.touching) — nếu không
  //  sẽ GIẬT NGƯỢC giữa cú vuốt -> bar không ẩn được ("vuốt không ăn"). Chỉ touchend mới cuộn (đã nhấc tay).
  function safeScroll(y) {
    if (S.touching) return;
    try { global.scrollTo(0, y); } catch (e) {}
  }

  // ---- [v19 — SỬA Ở GỐC] Bọc _initFrameSize để ENGINE ĐO innerHeight -------
  //  Engine đo khung qua _initFrameSize -> availHeight() = documentElement.clientHeight (378, hằng
  //  số, KHÔNG đổi khi bar ẩn) thay vì innerHeight (428). Rồi _resizeEvent gọi setDesignResolutionSize
  //  fit theo _frameSize đó -> hụt 50px. v12-v18 tôi CHỌC TAY _viewportRect/_scaleX SAU khi engine
  //  fit -> render một kiểu, còn convertToLocationInView (ánh xạ chạm) đọc bounding-rect+dpr một kiểu
  //  -> LỆCH INPUT. Cách ĐÚNG (như bạn nói): sửa để engine ĐO 428, rồi engine tự fit TOÀN BỘ (render
  //  + scale + touch-map) ĐỒNG BỘ. Bọc _initFrameSize: sau khi engine tính _frameSize (378), nếu
  //  fullscreen -> ép _frameSize = innerWidth x innerHeight. Mọi _resizeEvent (từ đâu cũng vậy) từ đó
  //  fit đúng 428 -> HẾT RACE + HẾT LỆCH INPUT (không còn chọc tay nội bộ).
  function pinContainer() {
    // container position:FIXED, top:0 -> bounding-rect.top LUÔN = 0 bất kể scrollY -> touch-map đúng
    //  + phủ kín viewport (không hụt do scroll). Engine set lại absolute mỗi fit nên pin lại sau đó.
    try {
      var ct = cc.game && cc.game.container;
      if (ct) { ct.style.position = 'fixed'; ct.style.left = '0px'; ct.style.top = '0px'; }
    } catch (e) {}
  }

  function hookFrame() {
    if (S.frameHooked || !hasCC()) return;
    try {
      if (typeof cc.view._initFrameSize === 'function') {
        var origIFS = cc.view._initFrameSize;
        cc.view._initFrameSize = function () {
          origIFS.call(this);   // engine tính _frameSize (378 khi bar ẩn vì availHeight=clientHeight)
          if (this._frameSize && safeToArm() && detectFS()) {
            this._frameSize.width = global.innerWidth;    // ÉP đo lại = innerHeight (428) khi fullscreen
            this._frameSize.height = global.innerHeight;
          }
        };
      }
      if (typeof cc.view._resizeEvent === 'function') {
        var origRE = cc.view._resizeEvent;
        cc.view._resizeEvent = function () {
          var r = origRE.apply(this, arguments);   // engine fit ĐỒNG BỘ theo _frameSize (giờ = 428)
          if (safeToArm() && detectFS()) pinContainer();   // pin fixed -> rect.top=0 -> chạm đúng
          return r;
        };
      }
      S.frameHooked = true;
      dlog('hooked _initFrameSize + _resizeEvent (sua o goc)');
    } catch (e) { dlog('hookFrame ERR ' + e); }
  }

  // "Fill" = gọi engine tự fit lại (native). _resizeEvent(true) -> _initFrameSize (bọc -> 428) ->
  //  setDesignResolutionSize -> engine cập nhật canvas/viewport/scale/touch-map ĐỒNG BỘ. KHÔNG chọc tay.
  function alignCanvas() {
    if (!safeToArm()) return;
    try {
      if (cc.view._resizeEvent) cc.view._resizeEvent(true);
      pinContainer();
      var fr = '?'; try { var s = cc.view.getFrameSize(); fr = Math.round(s.width) + 'x' + Math.round(s.height); } catch (e) {}
      dlog('refit(native) -> inner=' + global.innerWidth + 'x' + global.innerHeight + ' frame=' + fr);
    } catch (e) { dlog('refit ERR ' + e); }
  }
  function fitFS() {
    alignCanvas();
    setTimeout(function () { if (S.isFS) alignCanvas(); }, 280);
    setTimeout(function () { if (S.isFS) alignCanvas(); }, 650);
  }

  // ---- body-style (PORT hitclub listenCallBack, nhánh landscape) -----------
  function applyBodyStyle() {
    var b = document.body; if (!b) return;
    // [v16] LUÔN để body cao (cuộn được) khi armed -> vuốt luôn ăn. CHỈ onFS(full) mới khoá '100%'.
    //  (Bỏ nhánh outer-inner<=23 của hitclub: nó set '100%' lúc bar đang hiện -> body cứng giữa cú vuốt.)
    b.style.overflow = 'auto';
    b.style.position = 'absolute';
    b.style.height = isChromeIOS() ? '150vh' : CFG.BODY_H;
  }

  // ---- [v15] WATCHDOG: lấp gap dựa trên SỰ THẬT (frameSize < innerHeight), KHÔNG phụ thuộc
  //  "phát hiện vuốt". Full bằng cách nào (vuốt / xoay / A2HS) mà canvas thấp hơn viewport -> fill.
  //  Chạy 500ms/lần; chỉ hành động khi CÓ gap (idempotent, hết gap thì thôi -> không churn).
  function watch() {
    if (!safeToArm()) return;
    var full = detectFS();
    if (full) {
      var fh = -1; try { fh = cc.view.getFrameSize().height; } catch (e) {}
      // engine fit 378 mà màn 428 -> lệch >8px = còn gap -> fill (body khoá + scroll 0 + align 428)
      if (fh > 0 && Math.abs(fh - global.innerHeight) > 8) {
        if (S.touching) return;   // đang vuốt -> chờ nhấc tay, đừng đụng gì
        // [v17] chỉ align (container:fixed phủ kín) — KHÔNG collapse body / KHÔNG scrollTo(0) (bounce).
        alignCanvas();
        showMask(false);
        dlog('watch-fill fh=' + fh + ' inner=' + global.innerHeight);
      }
    } else {
      // KHÔNG full mà body kẹt '100%' (từ lần full trước) -> trả lại '110vh' để còn vuốt được.
      if (document.body && document.body.style.height === '100%') document.body.style.height = CFG.BODY_H;
    }
  }

  // ---- onIOSFullscreenChanged (PORT hitclub, nhánh Safari) -----------------
  function onFS(isFull) {
    if (S.kbShow) return;
    var was = S.isFS;
    if (!isFull) {
      document.body.style.overflow = 'auto';
      document.body.style.height = isChromeIOS() ? '150vh' : CFG.BODY_H;
      // [v17] trả container về absolute (bỏ 'fixed' của lúc full) để engine tự fit 378 khi bar hiện.
      try { if (cc.game && cc.game.container) cc.game.container.style.position = 'absolute'; } catch (e) {}
      showMask(true);
      safeScroll(-100);   // [v16] safeScroll: KHÔNG giật nếu đang vuốt (touching) -> hết "vuốt không ăn"
    } else {
      showMask(false);
      // [v17] KHÔNG collapse body, KHÔNG scrollTo(0)! Cả 2 kéo scroll về đỉnh -> iOS bung bar (bounce
      //  đúng như log v16: FS VAO 428 -> collapse -> FS ROT 378). Việc phủ kín để container:fixed lo.
      fitFS();   // [v12] fit canvas theo innerHeight (428) — KHÔNG để engine fit clientHeight (378) -> hết hụt
      if (S.dumpT) clearTimeout(S.dumpT);
      S.dumpT = setTimeout(function () { if (S.isFS) dump('fs'); }, 800);
    }
    S.isFS = isFull;
    if (was !== isFull) dlog('FS ' + (isFull ? 'VAO' : 'ROT') + ' h=' + global.innerHeight + ' min=' + S.minH + ' max=' + S.maxH + ' sy=' + (global.pageYOffset || 0));
  }

  // ---- listenCallBack (PORT): set body + (trễ) đọc fullscreen --------------
  function listenCallBack() {
    if (S.kbShow && !isEditing()) S.kbShow = false;   // tự giải kẹt cờ bàn phím
    if (!safeToArm()) { showMask(false); S.isFS = null; return; }  // cầm dọc/khác -> nhường A2HS
    applyBodyStyle();
    if (S.cbT) clearTimeout(S.cbT);
    S.cbT = setTimeout(function () {
      S.cbT = null;
      if (!safeToArm()) return;
      onFS(detectFS());
    }, CFG.CB_DELAY_MS);
  }

  // ---- touchend -> scrollToEdge (PORT hitclub windowScrollToEdge) ----------
  function scrollToEdge() { try { global.scrollTo(0, detectFS() ? 0 : -100); } catch (e) {} }
  function onTouchStart() { S.touching = true; }
  function onTouchEnd() {
    S.touching = false;
    if (!S.armed) return;
    if (S.scrollT) clearTimeout(S.scrollT);
    S.scrollT = setTimeout(scrollToEdge, S.isFS ? 100 : 400);   // hitclub: 100ms nếu full, 400ms nếu chưa
    listenCallBack();   // bar có thể vừa đổi -> đọc lại
  }

  // ---- visualViewport (bàn phím) -------------------------------------------
  function onVVResize(e) {
    try {
      var kb = !!(e && e.target && parseInt(e.target.width) === global.innerWidth &&
                  parseInt(e.target.height) + 50 < global.innerHeight) && isEditing();
      S.kbShow = kb;
      if (!kb && S.lastKb === true) { try { global.scrollTo(0, 0); } catch (er) {} }
      S.lastKb = kb;
      if (!kb) listenCallBack();
    } catch (err) {}
  }

  // ---- DUMP số đo (giữ để telemetry) ---------------------------------------
  function dump(tag) {
    function g(f) { try { return f(); } catch (e) { return 'ERR'; } }
    var cv = g(function () { return cc.game.canvas; });
    var ct = g(function () { return cc.game.container; });
    var r = (cv && cv.getBoundingClientRect) ? cv.getBoundingClientRect() : null;
    var o = {
      inner: global.innerWidth + 'x' + global.innerHeight,
      outer: global.outerWidth + 'x' + global.outerHeight,
      scrollY: g(function () { return global.pageYOffset; }),
      deCH: g(function () { return document.documentElement.clientHeight; }),
      bodyH: g(function () { return document.body.style.height + '/' + document.body.clientHeight; }),
      canvasRect: r ? (Math.round(r.left) + ',' + Math.round(r.top) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)) : null,
      canvasBuf: cv ? (cv.width + 'x' + cv.height) : null,              // buffer (device px)
      canvasCss: cv ? (cv.style.width + '|' + cv.style.height) : null,  // CSS hiển thị
      dpr: g(function () { return cc.view.getDevicePixelRatio(); }),
      scale: g(function () { return cc.view._scaleX + ',' + cc.view._scaleY; }),   // <0.001 khác nhau x/y = méo
      win: g(function () { var w = cc.winSize; return Math.round(w.width) + 'x' + Math.round(w.height); }),
      vis: g(function () { var v = cc.view._visibleRect; return Math.round(v.width) + 'x' + Math.round(v.height); }),
      design: g(function () { var d = cc.view.getDesignResolutionSize(); return Math.round(d.width) + 'x' + Math.round(d.height); }),
      contStyle: ct ? ct.style.cssText : null,
      frame: g(function () { var s = cc.view.getFrameSize(); return Math.round(s.width) + 'x' + Math.round(s.height); }),
      rot: g(function () { return cc.view._isRotated; }),
      fs: S.isFS, min: S.minH, max: S.maxH
    };
    dlog('DUMP' + (tag ? '(' + tag + ')' : '') + ' ' + JSON.stringify(o));
  }

  // ---- boot ----------------------------------------------------------------
  function boot() {
    if (!isIOS() || !isRealIPhone() || isStandalone() || isPortraitGame()) return;

    // Nền body ĐEN: nếu còn hở 1px thì chìm vào cạnh tối game (thay vì xám #2c2c2c).
    try { if (document.body) document.body.style.backgroundColor = '#000'; } catch (e) {}

    S.mask = document.getElementById('sc-mask');
    var hide = document.getElementById('sc-hide');
    if (hide) hide.addEventListener('click', function (ev) {
      ev && ev.stopPropagation && ev.stopPropagation();
      S.hintOff = true; showMask(false);   // user tắt gợi ý -> không hiện lại (không giết listener)
    });

    // Sự kiện rời rạc (giống hitclub) — KHÔNG poll nóng.
    if (global.visualViewport && global.visualViewport.addEventListener)
      global.visualViewport.addEventListener('resize', onVVResize);
    global.addEventListener('resize', function () {
      if (S.rT) clearTimeout(S.rT);
      S.rT = setTimeout(function () { S.rT = null; listenCallBack(); }, 120);
    });
    global.addEventListener('orientationchange', function () { setTimeout(listenCallBack, 250); });
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    // [v16] ĐÃ BỎ listener 'scroll' -> onFS: nó gọi onFS(not-full) -> scrollTo(0,-100) NGAY GIỮA
    //  cú vuốt (bar chưa ẩn hẳn) -> giật ngược về đỉnh -> "vuốt không ăn". Phát hiện bar-ẩn giờ
    //  dựa vào 'resize' (iOS bắn khi bar co) + watchdog 500ms + touchend. KHÔNG đụng scroll khi vuốt.

    S.armed = true;

    // [v15] SEED maxH từ kích thước màn: chiều cao viewport landscape khi FULL ≈ cạnh NGẮN của
    //  screen (screen.width/height không đổi theo hướng trên iOS). -> detectFS nhận ra full NGAY
    //  cả khi phiên vào thẳng fullscreen (xoay/A2HS), KHÔNG cần quan sát bar ẩn/hiện trước. detectFS
    //  vẫn refine min/max theo thực tế sau đó.
    try {
      var sw = Math.min(global.screen.width || 0, global.screen.height || 0);
      if (sw > 200) S.maxH = Math.max(S.maxH, sw);
    } catch (e) {}

    // [v19] SỬA Ở GỐC: bọc _initFrameSize -> engine ĐO innerHeight(428) -> tự fit đồng bộ (hết lệch input + hết race).
    hookFrame();

    // [v15] WATCHDOG 500ms — lấp gap độc lập với việc vuốt (an toàn: chỉ align khi CÓ gap).
    setInterval(watch, 500);

    dlog('boot ok ios=' + iOsVersion + ' rot=' + (hasCC() ? cc.view._isRotated : '?') +
         ' inner=' + global.innerWidth + 'x' + global.innerHeight + ' outer=' + global.outerWidth + 'x' + global.outerHeight +
         ' screen=' + (global.screen ? global.screen.width + 'x' + global.screen.height : '?') + ' seedMax=' + S.maxH);

    setTimeout(function () {
      if (safeToArm()) listenCallBack();
      else dlog('KHONG arm safeToArm=' + safeToArm());
    }, CFG.HINT_DELAY_MS);
  }

  function init() {
    if (S.inited) return; S.inited = true;
    var n = 0;
    (function wait() {
      if (hasCC() && document.body) { boot(); return; }
      if (n++ < 500) setTimeout(wait, 16);
    })();
  }

  global.SCFullscreen = { init: init, dump: dump, cfg: CFG };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window);
