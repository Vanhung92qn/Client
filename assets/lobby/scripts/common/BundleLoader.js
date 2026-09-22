/**
 * BundleLoader.js
 * ─────────────────────────────────────────────────────────────────
 * Quản lý toàn bộ vòng đời của Asset Bundles trong S86CLUB.
 * Đặt file này tại: assets/lobby/scripts/common/BundleLoader.js
 *
 * CÁCH DÙNG:
 *   // Mở một game:
 *   cc.BundleLoader.getInstance().loadGame(cc.GameId.TAI_XIU, callback);
 *
 *   // Đóng một game (giải phóng RAM):
 *   cc.BundleLoader.getInstance().releaseGame(cc.GameId.TAI_XIU);
 *
 *   // Preload ngầm (không chờ kết quả):
 *   cc.BundleLoader.getInstance().preloadGame(cc.GameId.XOCXOC);
 * ─────────────────────────────────────────────────────────────────
 */
(function () {

    var BundleLoader;

    BundleLoader = (function () {
        var instance;

        function BundleLoader() {
            // Map: bundleName → cc.AssetBundle reference
            this._bundles = {};
            
            // ═══════════════════════════════════════════════════════════════
            // 🧠 BUNDLE CACHE SYSTEM (Production-Ready Memory Management)
            // ═══════════════════════════════════════════════════════════════
            this._lastUsed = {};           // bundleName → timestamp(ms) khi được dùng lần cuối
            this._activeGame = null;       // bundle game ĐANG mở → GC né, không release (tránh vỡ game)
            this._activeDeps = [];         // deps của game đang mở → GC cũng phải né (xem gcIdleBundles)
            this._idleThreshold = 45000;   // 45s không dùng → auto release (giảm từ 120s: iOS RAM)
            // Bundle DÙNG CHUNG (cardroom, cardroom_binhthuong, slots_core…) sống lâu hơn hẳn:
            // nó đắt để tải lại (cardroom 23 MB) và chắc chắn được dùng lại nếu người chơi còn
            // ở khu game bài. 5 phút — vẫn thu hồi được nếu họ bỏ đi thật.
            this._idleThresholdDungChung = 300000;
            this._dsDungChung = null;      // nhớ sau lần tra đầu (đọc từ GameBundleConfig)
            this._gcInterval = 30000;      // Check GC mỗi 30s
            this._gcScheduled = false;     // Flag để tránh schedule nhiều lần
            
            // Bắt đầu auto GC cycle
            this._startAutoGC();
        }

        instance = void 0;

        BundleLoader.getInstance = function () {
            if (instance === void 0) {
                instance = new BundleLoader();
            }
            return instance;
        };

        // ─────────────────────────────────────────────────────
        //  PUBLIC: Load game bundle theo GameId
        //  callback(err, bundle)
        //  Log timing (mac dinh BAT, opt-out: ?gamelog=0):
        //   [GAME] BEGIN <label> bundle=<n> deps=<arr> cache=HIT|MISS
        //   [GAME] DEPS_DONE <label> +Xms
        //   [GAME] BUNDLE_DONE <label> +Xms (OK|ERR)
        //   Lay full log: copy(JSON.stringify(window.__GAME_LOG__, null, 2))
        // ─────────────────────────────────────────────────────
        //  onProgress(frac 0..1): tiến độ pha tải BUNDLE (deps+game). Tùy chọn.
        BundleLoader.prototype.loadGame = function (gameId, callback, onProgress) {
            var config = cc.GameBundleConfig.getByGameId(gameId);
            if (!config) {
                var errMsg = '[BundleLoader] Không tìm thấy config cho gameId: ' + gameId;
                console.error(errMsg);
                callback && callback(new Error(errMsg), null);
                return;
            }
            this._activeGame = config.bundleName;   // đánh dấu game đang mở → GC né
            // …và nhớ luôn deps của nó để GC né theo. Nhớ ở ĐÂY vì `_activeGame` chỉ giữ
            // bundleName, còn GameBundleConfig lại tra theo gameId — không lần ngược được.
            this._activeDeps = config.deps || [];

            var self = this;
            var label = config.label;
            var bundleName = config.bundleName;
            var deps = config.deps || [];
            var t0 = Date.now();
            var logEnabled = self._isGameLogEnabled();
            var cacheHit = !!cc.assetManager.getBundle(bundleName);

            if (logEnabled) {
                console.log('[GAME] BEGIN', label, 'bundle=' + bundleName, 'deps=' + JSON.stringify(deps), 'cache=' + (cacheHit ? 'HIT' : 'MISS'));
                if (typeof window !== 'undefined') {
                    window.__GAME_LOG__ = window.__GAME_LOG__ || [];
                    window.__GAME_LOG__.push({ t: 0, tag: 'BEGIN', game: label, bundle: bundleName, deps: deps, cache: cacheHit ? 'HIT' : 'MISS' });
                }
            }

            var onAllDone = function (err, bundle) {
                var dt = Date.now() - t0;
                if (logEnabled) {
                    console.log('[GAME] BUNDLE_DONE', label, '+' + dt + 'ms', err ? 'ERR' : 'OK');
                    if (typeof window !== 'undefined') {
                        window.__GAME_LOG__.push({ t: dt, tag: err ? 'BUNDLE_FAIL' : 'BUNDLE_DONE', game: label, err: err ? String(err).slice(0, 120) : 0 });
                    }
                }
                callback && callback(err, bundle);
            };

            // ── 🔴 DEPS PHẢI NẠP XONG TRƯỚC BUNDLE GAME — KHÔNG ĐƯỢC SONG SONG ──────────
            //
            // Trước đây chỗ này nạp deps + bundle game SONG SONG cho cold-open nhanh hơn. Điều
            // đó an toàn CHỪNG NÀO bundle chỉ chứa TÀI SẢN. Từ lúc bundle chứa SCRIPT thì không
            // còn an toàn, và cách nó hỏng là thứ tệ nhất: NGẪU NHIÊN THEO TỐC ĐỘ MẠNG.
            //
            // Cơ chế, đọc thẳng từ bản build (`build/web-mobile/assets/main/index.*.js`):
            //     var a = "function" == typeof __require && __require;   // require của gói nạp TRƯỚC
            //     if (!u && a) return a(b, !0);                          // không thấy thì hỏi gói đó
            // Mỗi gói bắt lấy `__require` của gói nạp NGAY TRƯỚC làm dự phòng ⇒ một CHUỖI THEO
            // THỨ TỰ NẠP. Gói nạp sau với tới được gói nạp trước, KHÔNG ngược lại.
            //
            // Nên nếu `index.js` của bundle game chạy trước `cardroom`, chuỗi dự phòng của nó
            // không có cardroom, và mọi `require` sang script dùng chung ném
            // "Cannot find module" — ở một tệp khác hẳn tệp vừa sửa. Máy nhanh không tái hiện.
            //
            // Deps cũng nạp TUẦN TỰ theo đúng thứ tự khai, vì dep sau có thể cần dep trước.
            // Giá: thêm 1–2 lượt đi-về lúc mở game LẦN ĐẦU; sau đó bundle nằm trong cache.
            // Đổi lại một lớp lỗi không tái hiện được — đáng.
            var tongBuoc = deps.length + 1;
            var self2 = this;
            this._loadBundlesSequential(deps, function (errDeps) {
                if (errDeps) { onAllDone(errDeps, null); return; }
                onProgress && onProgress(deps.length / tongBuoc);
                if (logEnabled) {
                    var dtDeps = Date.now() - t0;
                    console.log('[GAME] DEPS_DONE', label, '+' + dtDeps + 'ms (tuần tự)');
                    if (typeof window !== 'undefined') {
                        window.__GAME_LOG__.push({ t: dtDeps, tag: 'DEPS_DONE', game: label, deps: deps });
                    }
                }
                self2._loadSingleBundle(bundleName, function (err) {
                    if (err) { onAllDone(err, null); return; }
                    onProgress && onProgress(1);
                    onAllDone(null, cc.assetManager.getBundle(bundleName));
                }, true);
            }, function (xong) {
                onProgress && onProgress(xong / tongBuoc);
            }, true /* silent: LobbyView đã có thanh loading THẬT, tránh 2 chỉ báo */);
        };

        // Mac dinh BAT log. Opt-out: ?gamelog=0 hoac localStorage 'gamelog' = '0'.
        BundleLoader.prototype._isGameLogEnabled = function () {
            if (typeof window === 'undefined') return false;
            try {
                var p = new URLSearchParams(window.location.search);
                if (p.get('gamelog') === '0') return false;
            } catch (e) {}
            try {
                var ls = window.localStorage;
                if (ls && ls.getItem('gamelog') === '0') return false;
            } catch (e) {}
            return true;
        };

        // ─────────────────────────────────────────────────────
        //  PUBLIC: Load bundle theo tên trực tiếp
        //  callback(err, bundle)
        // ─────────────────────────────────────────────────────
        BundleLoader.prototype.loadBundle = function (bundleName, callback) {
            this._loadSingleBundle(bundleName, callback);
        };

        // ─────────────────────────────────────────────────────
        //  PUBLIC: Giải phóng bundle khi thoát game
        // ─────────────────────────────────────────────────────
        BundleLoader.prototype.releaseGame = function (gameId) {
            var config = cc.GameBundleConfig.getByGameId(gameId);
            if (!config) {
                console.warn('[BundleLoader] releaseGame: Không tìm thấy config cho gameId: ' + gameId);
                return;
            }
            this._releaseSingleBundle(config.bundleName);
            // Không release dependency bundle (slots_core/cardgame_core) vì có thể game khác đang dùng
        };

        // ─────────────────────────────────────────────────────
        //  PUBLIC: Preload bundle ngầm, không block luồng chính
        // ─────────────────────────────────────────────────────
        //  [#1] Preload ngầm (deps + bundle game), KHÔNG hiện UI, không block.
        //  Lúc user đứng ở Lobby → kéo sẵn game hay chơi → khi bấm, thanh loading
        //  lần 2 gần như tức thì (chỉ còn instantiate). done() gọi khi xong (tùy chọn).
        //  Sửa: trước đây bỏ qua deps + bypass BundleControl → nay tải đủ deps qua
        //  BundleControl (giống loadGame) để prefetch THỰC SỰ dùng được.
        BundleLoader.prototype.preloadGame = function (gameId, done) {
            var config = cc.GameBundleConfig.getByGameId(gameId);
            if (!config) { done && done(); return; }
            if (cc.assetManager.getBundle(config.bundleName)) { this._markUsed(config.bundleName); done && done(); return; }

            var self = this;
            // 🔴 Cũng phải TUẦN TỰ, cùng lý do với `loadGame`: chuỗi `__require` của các gói
            // được dựng theo THỨ TỰ NẠP. Prefetch mà nạp bundle game trước dep của nó thì
            // module nằm trong dep không bao giờ tra được — và vì đây là đường chạy NGẦM,
            // lỗi sẽ hiện ra lúc người chơi bấm vào game chứ không phải lúc prefetch.
            var all = (config.deps || []).concat([config.bundleName]);
            console.log('[BundleLoader] Prefetch (ngầm): ' + config.bundleName);
            this._loadBundlesSequential(all, function (err) {
                if (err) console.warn('[BundleLoader] Prefetch lỗi: ' + config.bundleName, err);
                else { self._markUsed(config.bundleName); console.log('[BundleLoader] Prefetch xong: ' + config.bundleName); }
                done && done();
            }, null, true /* silent */);
        };

        //  [#1] Prefetch nhiều game LẦN LƯỢT (1 cái/lần, tránh bão hòa băng thông).
        //  Bỏ qua game đã có. Gọi lúc Lobby rảnh. Danh sách nên theo analytics.
        BundleLoader.prototype.preloadGames = function (gameIds) {
            if (!gameIds || !gameIds.length) return;
            var self = this, i = 0;
            function next() {
                if (i >= gameIds.length) return;
                self.preloadGame(gameIds[i++], next);
            }
            next();
        };

        // ─────────────────────────────────────────────────────
        //  PUBLIC: Lấy bundle reference đã load (hoặc null)
        // ─────────────────────────────────────────────────────
        BundleLoader.prototype.getBundle = function (bundleName) {
            var bundle = cc.assetManager.getBundle(bundleName);
            if (bundle) {
                this._markUsed(bundleName);  // ✅ Mark as used khi getBundle
            }
            return bundle || null;
        };

        // ─────────────────────────────────────────────────────
        //  PUBLIC: Kiểm tra bundle đã load chưa
        // ─────────────────────────────────────────────────────
        BundleLoader.prototype.isLoaded = function (bundleName) {
            return !!cc.assetManager.getBundle(bundleName);
        };

        // ═══════════════════════════════════════════════════════════════
        // 🧠 BUNDLE CACHE SYSTEM - Production Memory Management
        // ═══════════════════════════════════════════════════════════════

        /**
         * Mark bundle as "recently used" - gọi mỗi khi bundle được access
         */
        BundleLoader.prototype._markUsed = function (bundleName) {
            this._lastUsed[bundleName] = Date.now();
        };

        /**
         * Bắt đầu auto GC cycle - tự động dọn dẹp bundle idle
         * ⚠️ BundleLoader là plain JS object (không phải cc.Component)
         *    → KHÔNG dùng cc.Scheduler (cần uuid/instanceId)
         *    → Dùng setInterval() của browser/jsb
         */
        BundleLoader.prototype._startAutoGC = function () {
            if (this._gcScheduled) return;
            
            var self = this;
            this._gcScheduled = true;
            
            // Dùng setInterval thay vì cc.Scheduler
            this._gcTimer = setInterval(function () {
                self.gcIdleBundles();
            }, self._gcInterval);
            
            console.log('[BundleLoader] Auto GC started - check every ' + (this._gcInterval/1000) + 's, release after ' + (this._idleThreshold/1000) + 's idle');
        };

        /**
         * Dừng auto GC (gọi khi app đóng hoặc scene destroy)
         */
        BundleLoader.prototype.stopAutoGC = function () {
            if (this._gcTimer) {
                clearInterval(this._gcTimer);
                this._gcTimer = null;
                this._gcScheduled = false;
                console.log('[BundleLoader] Auto GC stopped');
            }
        };

        /**
         * Danh sách bundle phụ thuộc của game ĐANG mở. Rỗng nếu không có game nào mở.
         *
         * Tra ngược từ `_activeGame` (là bundleName) về config để lấy `deps`. Không đọc thẳng
         * biến nào khác vì `_activeGame` là nguồn sự thật duy nhất cho "đang mở game gì".
         */
        BundleLoader.prototype._layDepsCuaGameDangMo = function () {
            if (!this._activeGame) return [];
            return this._activeDeps || [];
        };

        /**
         * Bundle này có phải BUNDLE DÙNG CHUNG không — tức được khai trong `deps` của ít nhất
         * một game. Đọc thẳng từ `GameBundleConfig` chứ KHÔNG ghi cứng danh sách tên: thêm
         * bundle chung mới (như `cardroom_binhthuong`, `cardroom_chongquay`) thì không phải
         * nhớ sửa chỗ này — và cái gì phải nhớ thì sớm muộn cũng quên.
         */
        BundleLoader.prototype._laBundleDungChung = function (bundleName) {
            if (this._dsDungChung) return this._dsDungChung.indexOf(bundleName) >= 0;
            var ds = null;
            try {
                if (cc.GameBundleConfig && cc.GameBundleConfig.getSharedBundles) {
                    ds = cc.GameBundleConfig.getSharedBundles();
                }
            } catch (e) { /* config chưa dựng xong — lần GC sau hỏi lại */ }
            // Chưa hỏi được thì coi như bundle thường: thu hồi sớm còn hơn giữ nhầm RAM.
            if (!ds || !ds.length) return false;
            this._dsDungChung = ds;
            return ds.indexOf(bundleName) >= 0;
        };

        /**
         * Garbage collect idle bundles - giải phóng bundle không dùng lâu
         * 🎯 Đây là CORE của memory management trong game production
         */
        BundleLoader.prototype.gcIdleBundles = function () {
            var now = Date.now();
            var releasedCount = 0;
            
            for (var bundleName in this._lastUsed) {
                if (!this._lastUsed.hasOwnProperty(bundleName)) continue;
                
                // Game ĐANG mở → KHÔNG release (tránh free texture đang dùng → vỡ game)
                if (bundleName === this._activeGame) continue;

                // 🔴 …và cả BUNDLE PHỤ THUỘC của game đang mở.
                //
                // Trước bản vá này GC chỉ né đúng bundle game, nên bundle dùng chung mà game
                // đang mở vẫn cần (cardroom cho Cào Rùa, cardgame_core cho bộ bài cũ,
                // slots_core cho slot) bị thu hồi sau 45 giây NGỒI TRONG BÀN. Lỗi chỉ lộ ra ở
                // game nào nạp tài nguyên THEO YÊU CẦU: Cào Rùa mở popup bằng
                // `cc.assetManager.getBundle('cardroom')`, GC dọn xong thì hàm đó trả null và
                // popup không mở được nữa — người chơi chỉ thấy "Chưa tải xong dữ liệu".
                // Đo thật 2026-09-21:
                //     [BundleLoader] GC: Releasing idle bundle "cardroom" (idle: 60s)
                // Game nạp hết tài nguyên ngay lúc vào bàn thì không lộ, nhưng vẫn sai như nhau.
                if (this._layDepsCuaGameDangMo().indexOf(bundleName) >= 0) continue;

                // Kiểm tra bundle có thật sự tồn tại không
                var bundle = cc.assetManager.getBundle(bundleName);
                if (!bundle) {
                    delete this._lastUsed[bundleName];
                    continue;
                }

                // 🔴 BUNDLE DÙNG CHUNG ĐƯỢC SỐNG LÂU HƠN BUNDLE GAME.
                //
                // Lá chắn `_activeDeps` ở trên chỉ che khi ĐANG Ở TRONG GAME. Lúc người chơi
                // thoát ra sảnh, `releaseGame` đặt `_activeGame = null` ⇒ lá chắn mất ⇒ 45 giây
                // sau `cardroom` bị thu hồi. Mở game bài thứ hai là tải lại 23 MB.
                //
                // Triệu chứng người chơi thấy: "game bài thứ hai mở chậm hơn game đầu" — rất dễ
                // bị đổ oan cho mạng hoặc cho server.
                //
                // Bundle dùng chung khác bundle game ở hai điểm: nó ĐẮT để tải lại, và nó CHẮC
                // CHẮN được dùng lại nếu người chơi còn ở khu game bài. Nên cho nó ngưỡng dài
                // hơn hẳn thay vì ghim vĩnh viễn — vẫn thu hồi được nếu người chơi bỏ đi thật,
                // không phá mục tiêu tiết kiệm RAM trên iOS.
                var nguong = this._laBundleDungChung(bundleName)
                    ? this._idleThresholdDungChung
                    : this._idleThreshold;

                // Nếu idle quá lâu → release
                var idleTime = now - this._lastUsed[bundleName];
                if (idleTime > nguong) {
                    console.log('[BundleLoader] GC: Releasing idle bundle "' + bundleName + '" (idle: ' + Math.round(idleTime/1000) + 's)');
                    this._releaseSingleBundle(bundleName);
                    delete this._lastUsed[bundleName];
                    releasedCount++;
                }
            }
            
            if (releasedCount > 0) {
                console.log('[BundleLoader] GC: Released ' + releasedCount + ' idle bundles');
            }
        };

        /**
         * Cấu hình thời gian idle threshold (ms)
         */
        BundleLoader.prototype.setIdleThreshold = function (milliseconds) {
            this._idleThreshold = milliseconds;
            console.log('[BundleLoader] Idle threshold set to ' + (milliseconds/1000) + 's');
        };

        /**
         * Force GC ngay lập tức (debug/testing)
         */
        BundleLoader.prototype.forceGC = function () {
            console.log('[BundleLoader] Force GC triggered');
            this.gcIdleBundles();
        };

        /**
         * Thống kê bundle cache (debug)
         */
        BundleLoader.prototype.getCacheStats = function () {
            var now = Date.now();
            var stats = {
                totalBundles: 0,
                activeBundles: [],
                idleTimes: {}
            };
            
            for (var bundleName in this._lastUsed) {
                if (!this._lastUsed.hasOwnProperty(bundleName)) continue;
                if (!cc.assetManager.getBundle(bundleName)) continue;
                
                stats.totalBundles++;
                stats.activeBundles.push(bundleName);
                stats.idleTimes[bundleName] = Math.round((now - this._lastUsed[bundleName]) / 1000);
            }
            
            return stats;
        };

        // ─────────────────────────────────────────────────────
        //  PRIVATE: Load một bundle, có cache check
        // ─────────────────────────────────────────────────────
        //  silent = true → KHÔNG hiện busy spinner (dùng khi caller có thanh loading
        //  riêng, hoặc khi prefetch ngầm). Mặc định false (giữ hành vi cũ).
        BundleLoader.prototype._loadSingleBundle = function (bundleName, callback, silent) {
            // Kiểm tra cache
            var cached = cc.assetManager.getBundle(bundleName);
            if (cached) {
                this._markUsed(bundleName);  // ✅ Mark as used khi cache hit
                console.log('[BundleLoader] Cache hit: ' + bundleName);
                callback && callback(null, cached);
                return;
            }

            console.log('[BundleLoader] Loading bundle: ' + bundleName + '...');
            if (!silent) cc.PopupController.getInstance().showBusy();

            // Dung BundleControl: support CDN remote bundle voi cache-bust hash
            // (fallback cc.assetManager.loadBundle khi ASSET_CDN_URL rong).
            var loader = (cc.BundleControl && cc.BundleControl.getInstance)
                ? cc.BundleControl.getInstance()
                : { loadBundle: function (n, cb) { cc.assetManager.loadBundle(n, cb); } };
            loader.loadBundle(bundleName, function (err, bundle) {
                if (!silent) cc.PopupController.getInstance().hideBusy();

                if (err) {
                    console.error('[BundleLoader] FAILED: ' + bundleName, err);
                    callback && callback(err, null);
                    return;
                }

                this._bundles[bundleName] = bundle;
                this._markUsed(bundleName);  // ✅ Mark as used
                console.log('[BundleLoader] Loaded OK: ' + bundleName);
                callback && callback(null, bundle);
            }.bind(this));
        };

        // ─────────────────────────────────────────────────────
        //  PRIVATE: Load một danh sách bundles tuần tự (deps)
        // ─────────────────────────────────────────────────────
        // `onEach` gọi sau MỖI bundle xong (để vẽ tiến độ); `silent` = không bật vòng xoay
        // (đường prefetch ngầm và đường có thanh loading riêng đều cần im lặng).
        BundleLoader.prototype._loadBundlesSequential = function (bundleNames, callback, onEach, silent) {
            var self = this;
            var index = 0;

            function loadNext() {
                if (index >= bundleNames.length) {
                    callback && callback(null);
                    return;
                }
                var name = bundleNames[index++];
                self._loadSingleBundle(name, function (err) {
                    if (err) { callback && callback(err); return; }
                    onEach && onEach(index, bundleNames.length);
                    loadNext();
                }, silent);
            }

            loadNext();
        };

        // ─────────────────────────────────────────────────────
        //  PRIVATE: Release một bundle
        // ─────────────────────────────────────────────────────
        BundleLoader.prototype._releaseSingleBundle = function (bundleName) {
            var bundle = cc.assetManager.getBundle(bundleName);
            if (bundle) {
                // QUAN TRỌNG (fix iOS RAM): removeBundle CHỈ xoá index, KHÔNG free texture.
                // Phải releaseUnusedAssets() TRƯỚC → giải phóng VRAM. Ref-count aware →
                // KHÔNG đụng texture còn dùng (game active / shared deps còn ref) → an toàn.
                // Nếu không, VRAM tích luỹ qua mỗi game → iOS Safari kill tab + reload.
                try { if (bundle.releaseUnusedAssets) bundle.releaseUnusedAssets(); } catch (e) { console.warn('[BundleLoader] releaseUnusedAssets fail ' + bundleName, e); }
                cc.assetManager.removeBundle(bundle);
                delete this._bundles[bundleName];
                delete this._lastUsed[bundleName];
                if (this._activeGame === bundleName) { this._activeGame = null; this._activeDeps = []; }
                console.log('[BundleLoader] Released (free VRAM): ' + bundleName);
            }
        };

        return BundleLoader;

    })();

    cc.BundleLoader = BundleLoader;

}).call(this);
