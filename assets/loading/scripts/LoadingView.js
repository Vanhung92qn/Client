
// ── FIX "Request Desktop Website": iPhone/iPad gửi UA Macintosh → cc.sys.isMobile=FALSE ──
//  Khi bật "Request Desktop Website" (hoặc 1 số webview), iOS gửi UA "Macintosh..." → Cocos
//  vẫn nhận đúng os = iOS (qua maxTouchPoints) NHƯNG cc.sys.isMobile = false. Mà TOÀN BỘ cơ
//  chế xoay đều khoá theo isMobile:
//    • main.js boot: `if(cc.sys.isMobile) setOrientation(LANDSCAPE)` → BỊ BỎ QUA.
//    • engine _initFrameSize: `!cc.sys.isMobile || ...` → luôn nhánh KHÔNG xoay.
//    • _forceLandscape.apply(): `if(!cc.sys.isMobile) return` → thoát.
//  → Đã nhận diện là thiết bị cảm ứng iOS/Android thì ÉP isMobile = true (đặt SỚM NHẤT,
//  trước mọi logic xoay). Mac thật (os = OSX, không cảm ứng) KHÔNG bị ảnh hưởng.
(function _fixDesktopUAisMobile() {
    try {
        if (typeof cc === 'undefined' || !cc.sys) return;
        var s = cc.sys;
        if ((s.os === s.OS_IOS || s.os === s.OS_ANDROID) && !s.isMobile) {
            s.isMobile = true;
            console.log('[LoadingView] forced cc.sys.isMobile=true (touch ' + s.os + ' + UA desktop) → mở khoá xoay ngang');
        }
    } catch (e) { /* noop */ }
})();

// ── FIX iOS WebP (chạy MODULE-LEVEL = sớm nhất, trước khi scene đầu deserialize) ──
// Cocos 2.4 detect webp bằng canvas.toDataURL('image/webp') = test ENCODE.
// Safari/iOS DECODE (hiển thị) webp tốt từ iOS 14+ nhưng KHÔNG encode được qua
// toDataURL → engine nhận nhầm "không hỗ trợ webp" → deserializer bỏ webp texture
// (dòng:  if(".webp"===ext && !cc.sys.capabilities.webp) continue) → lỗi
// "Can't find a texture format supported" → đứng loading. iOS >=14 decode webp OK
// → ép cờ = true. Chỉ động iOS (Android/desktop tự detect đúng vì Chrome encode được).
(function _fixIOSWebpSupport() {
    try {
        if (!cc || !cc.sys || cc.sys.os !== cc.sys.OS_IOS) return;
        if (!cc.sys.capabilities || cc.sys.capabilities.webp) return;
        var m = String((typeof navigator !== 'undefined' && navigator.userAgent) || '').match(/OS (\d+)[_.]/);
        var major = m ? parseInt(m[1], 10) : 99;   // không rõ phiên bản → coi như đời mới (đa số là vậy)
        if (major >= 14) {
            cc.sys.capabilities.webp = true;
            console.log('[LoadingView] iOS webp forced ON (decode OK on iOS ' + (m ? m[1] : '?') + ', toDataURL false-negative)');
        }
    } catch (e) { /* noop */ }
})();

// ── ÉP XOAY NGANG (auto-rotate) cho WEB MOBILE — chạy MODULE-LEVEL, bền qua mọi scene ──
//  Game thiết kế landscape. Cocos web mặc định cc.view._orientation = ORIENTATION_AUTO
//  (= 3, chứa bit PORTRAIT=1). Cầm DỌC → _initFrameSize coi như "khớp portrait" → KHÔNG
//  xoay → game bị fit nhỏ (đúng hiện tượng bẹp dí). Đặt _orientation = LANDSCAPE (=2) →
//  cầm dọc, engine TỰ: đảo frame landscape + cc.game.container.transform = rotate(90deg)
//  + margin-left bù vị trí + _isRotated=true → convertToLocationInView TỰ ánh xạ lại toạ
//  độ chạm. Render + input đều là code GỐC engine nên chắc chắn khớp (không patch tay).
//
//  Vì sao lần trước (gọi 1 phát trong onLoad) không ăn:
//   • setOrientation → setDesignResolutionSize gọi _initFrameSize TRỰC TIẾP (không "ẩn
//     container trước khi đo" như _resizeEvent) → phép đo frame dễ sai.
//   • Scene mới (loading → MainGame) gọi setDesignResolutionSize có thể trúng nhánh
//     `_resizing || _initFrameSize()` → BỎ QUA xoay.
//  Fix: set _orientation sớm + ÉP áp lại bằng _resizeEvent(true) (đường đo SẠCH) ngay,
//  SAU MỖI scene, và khi xoay máy. Log [BOOT] FORCE_LANDSCAPE {isRotated} để soi F12.
(function _setupForceLandscape() {
    try {
        if (typeof cc === 'undefined' || !cc.view || !cc.macro || cc.sys.isNative) return;
        var L = cc.macro.ORIENTATION_LANDSCAPE;
        if (!L || typeof cc.view.setOrientation !== 'function') return;

        function apply(why) {
            try {
                if (!cc.sys.isMobile) return;                       // chỉ mobile mới xoay
                var ds = cc.view._originalDesignResolutionSize;
                if (!ds || !ds.width) return;                       // design res chưa sẵn sàng
                if (cc.view._orientation !== L) cc.view._orientation = L;  // bật cờ trực tiếp...
                if (cc.view._resizeEvent) cc.view._resizeEvent(true);      // ...để _resizeEvent(true) lo phần đo SẠCH + áp (tránh 1 lượt đo không-sạch của setOrientation)
                var info = {
                    tag: 'FORCE_LANDSCAPE', why: why,
                    isRotated: cc.view._isRotated, orient: cc.view._orientation,
                    win: window.innerWidth + 'x' + window.innerHeight
                };
                if (window.__BOOT_LOG__) window.__BOOT_LOG__.push(info);
                console.log('[BOOT]', JSON.stringify(info));
            } catch (e) { console.warn('[FORCE_LANDSCAPE]', e); }
        }

        // 1) set + áp ngay khi design res sẵn sàng (chờ tối đa ~1s)
        var n = 0;
        (function waitInit() {
            var ds = cc.view._originalDesignResolutionSize;
            if (ds && ds.width) { apply('init'); }
            else if (n++ < 60) setTimeout(waitInit, 16);
            else { try { cc.view._orientation = L; } catch (e) {} }  // ít nhất bật cờ cho resize sau
        })();

        // 2) áp lại SAU MỖI scene (loading → MainGame → ...) — chống scene reset layout
        if (cc.director && cc.Director && cc.Director.EVENT_AFTER_SCENE_LAUNCH) {
            cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () { apply('scene'); });
        }
        // 3) áp lại khi xoay máy (Safari đôi khi cần kick sau orientationchange)
        window.addEventListener('orientationchange', function () {
            setTimeout(function () { apply('orient'); }, 150);
        });
        // 4) iOS Safari nhiều khi CHỈ bắn 'resize' (URL bar co/giãn) chứ không 'orientationchange'
        //    → debounce 200ms để không spam _resizeEvent trong lúc animation thanh địa chỉ.
        var _rzT = null;
        window.addEventListener('resize', function () {
            if (_rzT) clearTimeout(_rzT);
            _rzT = setTimeout(function () { _rzT = null; apply('resize'); }, 200);
        });
    } catch (e) { /* noop */ }
})();

var netConfig = require('NetConfig');
(function () {
    cc.LoadingView = cc.Class({
        "extends": cc.Component,
        properties: {
            skeLogo: sp.Skeleton,

            hotUpdate: cc.HotUpdate,
            progressBar: cc.ProgressBar,
            lbProgress: cc.Label,
            lbMessage: cc.Label,

            nodeButtonTry: cc.Node,
            nodeButtonTryCheckVersion: cc.Node,
        },

        onLoad: function () {
            this._bootT0 = Date.now();
            // Ẩn màn loading HTML (#splash trong index.html) khi scene loading game đã lên
            // → tránh splash z-index cao che game; búng thanh % lên 100% rồi fade mượt.
            try {
                if (typeof window !== 'undefined' && window.__scProg) { clearInterval(window.__scProg); window.__scProg = null; }
                var _bar = document.querySelector('#splash-bar>span'), _pct = document.getElementById('splash-pct');
                if (_bar) _bar.style.width = '100%';
                if (_pct) _pct.textContent = 'ĐANG TẢI 100%';
                var _sp = document.getElementById('splash');
                if (_sp) { _sp.style.opacity = '0'; setTimeout(function () { _sp.style.display = 'none'; }, 500); }
            } catch (e) {}
            this._tuneDownloader();
            this._tuneMemory();
            this._installNetTap();
            this._bootLog('SCENE_ONLOAD', { ua: navigator.userAgent, online: navigator.onLine });
            // cc.debug.setDisplayStats(true);
            if (cc.sys.isNative) {
                if (cc.Device) {
                    cc.Device.setKeepScreenOn(true);
                } else if (jsb.Device) {
                    jsb.Device.setKeepScreenOn(true);
                }
            }

            this.sceneName = 'MainGame';

            // Fix bug iOS 14
            const isIOS14Device = cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser && cc.sys.isMobile && /iPhone OS 14/.test(window.navigator.userAgent);
            if (isIOS14Device) {
                cc.MeshBuffer.prototype.checkAndSwitchBuffer = function (vertexCount) {
                    if (this.vertexOffset + vertexCount > 65535) { this.uploadData(); this._batcher._flush(); }
                };
                cc.MeshBuffer.prototype.forwardIndiceStartToOffset = function () {
                    this.uploadData(); this.switchBuffer();
                };
            }

            // Ko phai ban native -> ko init hotUpdate -> vao game luon
            if (!cc.sys.isNative) {
                this.loadSceneGame();
            } else {
                if (netConfig.IS_APPSTORE) {
                    var getConfigCommand = new cc.GetConfigCommand;
                    getConfigCommand.execute(this);
                } else {
                    this.hotUpdate.init();
                }
            }
        },

        // ─────────────────────────────────────────────────────
        //  [P0] Tăng song song tải asset (giống Sunwin: maxConcurrency = 16).
        //  Mặc định Cocos 2.4 web chỉ tải ~6 request/lượt → sảnh có hàng chục
        //  PNG rời bị xếp hàng (waterfall) làm thanh loading lâu. Đặt 1 lần ở
        //  đây (script chạy sớm nhất) → áp dụng cho MỌI load sau: 4 bundle boot,
        //  scene MainGame, và các bundle game khi mở. An toàn: browser vẫn tự
        //  giới hạn theo HTTP/2 multiplex; 16 là giá trị Sunwin đang dùng.
        // ─────────────────────────────────────────────────────
        _tuneDownloader: function () {
            try {
                var dl = cc.assetManager && cc.assetManager.downloader;
                if (!dl) return;
                dl.maxConcurrency = cc.sys.isNative ? 24 : 16;
                dl.maxRequestsPerFrame = 64;
                this._bootLog('DOWNLOADER_TUNED', {
                    maxConcurrency: dl.maxConcurrency,
                    maxRequestsPerFrame: dl.maxRequestsPerFrame
                });
            } catch (e) {
                console.warn('[LoadingView] _tuneDownloader fail:', e);
            }
        },

        // ─────────────────────────────────────────────────────
        //  [iOS RAM] Giảm áp lực bộ nhớ GPU (fix crash/reload + giật + nóng máy iOS).
        //  - Dynamic Atlas runtime mặc định 5 trang × 2048² × 4 = 80MB VRAM; static .pac
        //    đã batching (packable:false) nên hạ xuống 1 trang × 1024² = 4MB là đủ.
        //  - CLEANUP_IMAGE_CACHE: free bitmap nguồn sau khi upload GPU → bớt spike decode.
        //  (Việc giải phóng VRAM game khi đổi game nằm ở LobbyView.destroyDynamicView +
        //   BundleLoader.releaseUnusedAssets.)
        // ─────────────────────────────────────────────────────
        _tuneMemory: function () {
            try {
                if (cc.dynamicAtlasManager) {
                    try { cc.dynamicAtlasManager.maxAtlasCount = 1; } catch (e) {}
                    try { cc.dynamicAtlasManager.textureSize = 1024; } catch (e) {}
                }
                // [iOS BLACK-TEX] Engine build (7ff4a) KHÔNG có handler webglcontextlost/restored.
                // Nếu cleanup=true → ảnh nguồn bị xoá ngay sau khi up GPU → khi iOS đẩy texture khỏi
                // GPU/mất context dưới áp lực RAM (vào game nặng MD5) thì KHÔNG up lại được → đen vĩnh
                // viễn. Giữ mặc định engine (false) để texture bị đẩy còn nguồn up lại. (Fix RAM F5 nằm
                // ở releaseGame/releaseUnusedAssets/removeBundle, KHÔNG phải cờ này.)
                if (cc.macro) cc.macro.CLEANUP_IMAGE_CACHE = false;
                this._bootLog && this._bootLog('MEMORY_TUNED', {
                    dynAtlasMax: cc.dynamicAtlasManager ? cc.dynamicAtlasManager.maxAtlasCount : null,
                    dynAtlasSize: cc.dynamicAtlasManager ? cc.dynamicAtlasManager.textureSize : null
                });
            } catch (e) { console.warn('[LoadingView] _tuneMemory fail:', e); }
        },

        onGetConfigResponse: function (response) {
            netConfig.HOTS_U = response.host;
            console.log('Loading onGetConfigResponse host: ', response.host);
            this.hotUpdate.init();
        },

        activeProgressHotUpdate: function (enable) {
            this.lbMessage.node.active = enable;
            this.nodeButtonTry.active = false;
            this.nodeButtonTryCheckVersion.active = false;
            if (enable) {
                this.lbMessage.string = 'Đang cập nhật phiên bản mới...';
            }
        },

        setProgressHotUpdate: function (progress) {
            if (progress) {
                this.progressBar.progress = progress;
                this.lbProgress.string = Math.round(progress * 100) + '%';
            } else {
                this.progressBar.progress = 0;
                this.lbProgress.string = '0%';
            }
        },

        // ═══════════════════════════════════════════════════════════════
        //  BOOT LOG (LoadingView path)
        //  F12 → Console → filter "[BOOT]"
        //  copy(window.__BOOT_LOG__)  → paste cho audit
        // ═══════════════════════════════════════════════════════════════
        _bootLog: function (tag, data) {
            var t = Date.now() - (this._bootT0 || Date.now());
            var line = { t: t + 'ms', tag: tag, src: 'LV' };
            if (data) for (var k in data) line[k] = data[k];
            if (typeof window !== 'undefined') {
                window.__BOOT_LOG__ = window.__BOOT_LOG__ || [];
                window.__BOOT_LOG__.push(line);
            }
            console.log('[BOOT]', JSON.stringify(line));
        },

        // Hook XHR + Image fetch o DOM level → bat MOI HTTP request Cocos thuc su lam.
        _installNetTap: function () {
            var self = this;
            if (typeof window === 'undefined' || window.__BOOT_NET_TAP__) return;
            window.__BOOT_NET_TAP__ = true;

            // Hook XMLHttpRequest
            try {
                var XO = XMLHttpRequest.prototype.open;
                var XS = XMLHttpRequest.prototype.send;
                XMLHttpRequest.prototype.open = function (method, url) {
                    this.__bootUrl = String(url);
                    this.__bootT0 = Date.now();
                    return XO.apply(this, arguments);
                };
                XMLHttpRequest.prototype.send = function () {
                    var xhr = this;
                    xhr.addEventListener('loadend', function () {
                        var size = 0;
                        try {
                            if (xhr.response && xhr.response.byteLength) size = xhr.response.byteLength;
                            else if (xhr.responseText) size = xhr.responseText.length;
                            else size = parseInt(xhr.getResponseHeader('content-length') || 0, 10);
                        } catch (e) {}
                        self._bootLog('NET_XHR', {
                            url: String(xhr.__bootUrl || '').split('/').slice(-3).join('/'),
                            dt: (Date.now() - xhr.__bootT0) + 'ms',
                            size: size,
                            status: xhr.status
                        });
                    });
                    return XS.apply(this, arguments);
                };
            } catch (e) {}

            // Hook Image.src (Cocos load texture qua <img>)
            try {
                var imgT0Map = new WeakMap();
                var ImagePrototype = Image.prototype;
                var srcDesc = Object.getOwnPropertyDescriptor(ImagePrototype, 'src') ||
                              Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
                if (srcDesc && srcDesc.set) {
                    var origSet = srcDesc.set;
                    Object.defineProperty(HTMLImageElement.prototype, 'src', {
                        configurable: true,
                        enumerable: true,
                        get: srcDesc.get,
                        set: function (v) {
                            var t0 = Date.now();
                            imgT0Map.set(this, t0);
                            this.__bootImgUrl = String(v);
                            var img = this;
                            this.addEventListener('load', function _onLoad() {
                                img.removeEventListener('load', _onLoad);
                                self._bootLog('NET_IMG', {
                                    url: String(img.__bootImgUrl).split('/').slice(-3).join('/'),
                                    dt: (Date.now() - t0) + 'ms',
                                    w: img.naturalWidth,
                                    h: img.naturalHeight
                                });
                            });
                            origSet.call(this, v);
                        }
                    });
                }
            } catch (e) {}

            self._bootLog('NET_TAP_INSTALLED');
        },

        _bundleStat: function (name) {
            var b = cc.assetManager.getBundle(name);
            if (!b) return { exists: 0 };
            var stat = { exists: 1, name: b.name };
            try {
                var cfg = b.config || b._config;
                if (cfg) {
                    var paths = cfg.paths;
                    stat.paths = paths ? Object.keys(paths.map || paths).length : 0;
                    if (cfg.uuids) stat.uuids = cfg.uuids.length || Object.keys(cfg.uuids).length;
                }
            } catch (e) {}
            return stat;
        },

        // ─────────────────────────────────────────────────────
        //  LOAD SCENE GAME — Điểm thay đổi chính cho Bundle
        // ─────────────────────────────────────────────────────
        loadSceneGame: function () {
            var self = this;
            self._bootLog('LOAD_SCENE_GAME_BEGIN');

            // Đọc token từ URL (Web)
            if (cc.sys.isBrowser) {
                var navigated = new URLSearchParams(window.location.search);
                if (navigated && navigated.get('tk')) {
                    var token = navigated.get('tk');
                    cc.ServerConnector.getInstance().setToken(token);
                    var refCode = navigated.get('refcode');
                    cc.Tool.getInstance().setItem("@refcode", refCode === null ? "" : refCode);
                }
            }

            self.activeProgressHotUpdate(false);
            self.progressBar.progress = 0;
            self.lbProgress.string = '0%';
            self.lbMessage.node.active = true;
            self.lbMessage.string = 'Đang tải dữ liệu...';

            // ── BƯỚC 1: Load song song common + prefabs + lobby + minigame_ui
            //  → Tránh lazy round-trip khi MainGame ref asset trong common/prefabs
            //  → minigame_ui (4.5MB) la UI shared cho moi minigame (TaiXiu, BauCua,
            //    Sicbo, XocXoc, ...), prefab game ref asset trong day, phai load TRUOC.
            var bundleNames = ['common', 'prefabs', 'lobby', 'minigame_ui'];
            var loaded = 0;
            var failed = false;
            var batchT0 = Date.now();

            self._bootLog('BUNDLE_BATCH_START', { bundles: bundleNames.join(',') });

            bundleNames.forEach(function (name) {
                if (cc.assetManager.getBundle(name)) {
                    loaded++;
                    self._bootLog('BUNDLE_CACHED', { name: name });
                    if (loaded === bundleNames.length && !failed) self._onLobbyBundleReady();
                    return;
                }
                var t0 = Date.now();
                self._bootLog('BUNDLE_LOAD_BEGIN', { name: name });
                // Dung BundleControl de support CDN remote bundle (kem cache-bust hash).
                cc.BundleControl.getInstance().loadBundle(name, function (err) {
                    if (failed) return;
                    if (err) {
                        failed = true;
                        self._bootLog('BUNDLE_LOAD_FAIL', { name: name, dt: (Date.now() - t0) + 'ms', err: String(err).slice(0, 120) });
                        self.lbMessage.string = '⚠ Lỗi tải dữ liệu!\nVui lòng khởi động lại ứng dụng.';
                        self.nodeButtonTry.active = true;
                        return;
                    }
                    loaded++;
                    self._bootLog('BUNDLE_LOAD_OK', {
                        name: name,
                        dt: (Date.now() - t0) + 'ms',
                        progress: loaded + '/' + bundleNames.length,
                        stat: self._bundleStat(name)
                    });
                    if (loaded === bundleNames.length) {
                        self._bootLog('BUNDLE_BATCH_DONE', { dt: (Date.now() - batchT0) + 'ms' });
                        self._onLobbyBundleReady();
                    }
                });
            });
        },

        // Gọi sau khi lobby bundle đã sẵn sàng → preload + load MainGame scene qua bundle
        _onLobbyBundleReady: function () {
            var self = this;
            var lobby = cc.assetManager.getBundle('lobby');
            if (!lobby) {
                self._bootLog('LOAD_SCENE_NO_BUNDLE');
                return;
            }

            // 10% dành cho việc load bundle, 90% còn lại cho scene preload
            self.progressBar.progress = 0.10;
            self.lbProgress.string = '10%';
            self.lbMessage.string = 'Đang tải màn hình chính...';

            // Bo preloadScene (double work voi loadScene). Pattern SunWin:
            //  bundle.loadScene(name, progress, onLoaded) → cc.director.runScene
            self._bootLog('LOAD_SCENE_BEGIN', { scene: self.sceneName });
            var loadT0 = Date.now();
            var lastPct = -1;

            lobby.loadScene(
                self.sceneName,
                function (completedCount, totalCount) {
                    var sceneProgress = totalCount ? completedCount / totalCount : 0;
                    var pct10 = Math.floor(sceneProgress * 10) * 10;
                    if (pct10 !== lastPct) {
                        lastPct = pct10;
                        self._bootLog('SCENE_PROGRESS', { pct: pct10 + '%', completed: completedCount, total: totalCount });
                    }
                    var totalProgress = 0.10 + (0.90 * sceneProgress);
                    var pctVisible = Math.round(totalProgress * 100);
                    if (self.progressBar) {
                        self.progressBar.progress = totalProgress;
                        self.lbProgress.string = pctVisible + '%';
                    }
                },
                function (err, scene) {
                    if (err) {
                        self._bootLog('LOAD_SCENE_FAIL', { err: String(err).slice(0, 120), dt: (Date.now() - loadT0) + 'ms' });
                        return;
                    }
                    self._bootLog('LOAD_SCENE_DONE', { dt: (Date.now() - loadT0) + 'ms' });
                    cc.director.runScene(scene);
                    self._bootLog('RUN_SCENE_DONE', { totalSinceOnLoad: (Date.now() - self._bootT0) + 'ms' });
                }
            );
        },

        // ─────────────────────────────────────────────────────
        //  NÚT RETRY (Hot Update thất bại)
        // ─────────────────────────────────────────────────────
        retryClicked: function () {
            this.nodeButtonTry.active = false;
            this.loadSceneGame();
        },
    });
}).call(this);
