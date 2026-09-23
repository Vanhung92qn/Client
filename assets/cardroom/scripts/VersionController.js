'use strict';
// ============================================================================
// SHIM — INTENTIONALLY A NO-OP.
//
// Why empty: the original Go88 class (…\L00\VersionController.js) is Go88's forced-update
// gate. It reads `localStorage.currversion`, compares it against Go88's own remote config,
// then pops a dialog forcing the player to download a new build from Go88 infrastructure.
// Roy88 has its own release cycle and 🔴 must never call back to Go88, so the whole thing
// is cut.
//
// Staying empty costs nothing: with forced update disabled the game simply carries on —
// exactly the `isForceUpdateEnabled() === false` branch of the original.
//
// 🔴 A SHIM MUST IMPLEMENT EVERY METHOD ITS CALLERS EXPECT, NOT JUST THE ONES THE AUTHOR
// HAPPENED TO GREP FOR.
// The first version of this file declared only CheckForceUpdateByCurrentScene, because the
// author grepped `cardroom` alone. Eight game bundles call CheckForceUpdateByGameScene, and
// every one of them threw "is not a function" at runtime. Catte was hit worst: its call sits
// in the middle of startGame (CatteController.js:161), so the round never dealt at all. The
// others throw late enough to look harmless — Tien Len MN, for instance, threw once at the
// END of every round and still looked fine, because the error lands after the UI is drawn.
//
// The full caller list, re-derived with:
//   grep -rl 'require("VersionController")' assets --include=*.js
//   then, per file, resolve the local alias (s / E / O / T / N) and collect
//   <alias>.default.getInstance().<method>
// yields exactly two methods and nothing else:
//   CheckForceUpdateByCurrentScene  — cardroom/scripts/MainGameViewModel.js (:147, :261)
//   CheckForceUpdateByGameScene     — catte, lieng, maubinh, phom, poker, samloc,
//                                     tienlenMN, xito  (8 game controllers)
// Re-run that check whenever a new game bundle is ported; do not assume this list is final.
//
// The original exposes 16 further methods (CheckForceUpdateNow, SetBrandCode,
// GetVersionCurrent, UpdateNewVersionNow, …). They are deliberately NOT declared here:
// nothing in Roy88 calls them, and each one belongs to the path back to Go88's servers.
// Declare a method here only once a real caller exists — and keep it empty.
// ============================================================================

Object.defineProperty(exports, '__esModule', { value: true });

var VersionController = (function () {
    function VersionController() {}

    VersionController.getInstance = function () {
        if (null === this.Instance || void 0 === this.Instance) {
            this.Instance = new VersionController();
        }
        return this.Instance;
    };

    // Original delegates to checkForceUpdateByCurrentScene() (lowercase) and opens the update
    // dialog. Returns nothing, and callers ignore the result.
    VersionController.prototype.CheckForceUpdateByCurrentScene = function () {};

    // Same contract, scoped to a single game scene. `sceneName` comes from
    // GameConfigs.SceneName.<Game> at every call site. The original ignores the return too.
    VersionController.prototype.CheckForceUpdateByGameScene = function (sceneName) {};

    VersionController.Instance = null;
    return VersionController;
})();

exports.default = VersionController;
