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
            this._idleThreshold = 45000;   // 45s không dùng → auto release (giảm từ 120s: iOS RAM)
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

            // [#1] Tải deps + bundle game SONG SONG (trước đây tuần tự) → cold-open
            //  nhanh hơn (deps không phải chờ nhau). silent=true: không hiện busy
            //  spinner ở đây vì LobbyView đã có thanh loading THẬT (tránh 2 chỉ báo).
            var all = deps.concat([bundleName]);
            var loadedCount = 0;
            this._loadBundlesParallel(all, function (err) {
                if (err) { onAllDone(err, null); return; }
                if (logEnabled) {
                    var dtDeps = Date.now() - t0;
                    console.log('[GAME] DEPS_DONE', label, '+' + dtDeps + 'ms (parallel)');
                    if (typeof window !== 'undefined') {
                        window.__GAME_LOG__.push({ t: dtDeps, tag: 'DEPS_DONE', game: label, deps: deps });
                    }
                }
                onAllDone(null, cc.assetManager.getBundle(bundleName));
            }, function () {
                loadedCount++;
                onProgress && onProgress(loadedCount / all.length);
            }, true);
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
            var all = (config.deps || []).concat([config.bundleName]);
            console.log('[BundleLoader] Prefetch (ngầm): ' + config.bundleName);
            this._loadBundlesParallel(all, function (err) {
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

                // Kiểm tra bundle có thật sự tồn tại không
                var bundle = cc.assetManager.getBundle(bundleName);
                if (!bundle) {
                    delete this._lastUsed[bundleName];
                    continue;
                }

                // Nếu idle quá lâu → release
                var idleTime = now - this._lastUsed[bundleName];
                if (idleTime > this._idleThreshold) {
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
        BundleLoader.prototype._loadBundlesSequential = function (bundleNames, callback) {
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
                    loadNext();
                });
            }

            loadNext();
        };

        // ─────────────────────────────────────────────────────
        //  [#1] PRIVATE: Load danh sách bundles SONG SONG (cold-open nhanh hơn).
        //  callback(err) khi TẤT CẢ xong (hoặc lỗi đầu tiên). onEach(name) gọi
        //  mỗi khi 1 bundle xong (để báo progress). silent: không hiện busy.
        // ─────────────────────────────────────────────────────
        BundleLoader.prototype._loadBundlesParallel = function (bundleNames, callback, onEach, silent) {
            if (!bundleNames || !bundleNames.length) { callback && callback(null); return; }
            var self = this;
            var remaining = bundleNames.length;
            var errored = false;
            bundleNames.forEach(function (name) {
                self._loadSingleBundle(name, function (err) {
                    if (errored) return;
                    if (err) { errored = true; callback && callback(err); return; }
                    onEach && onEach(name);
                    remaining--;
                    if (remaining === 0) callback && callback(null);
                }, silent);
            });
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
                if (this._activeGame === bundleName) this._activeGame = null;
                console.log('[BundleLoader] Released (free VRAM): ' + bundleName);
            }
        };

        return BundleLoader;

    })();

    cc.BundleLoader = BundleLoader;

}).call(this);
