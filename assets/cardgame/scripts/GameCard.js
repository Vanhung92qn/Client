var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
var n = require("./GameDefine"),
  o = function() {
    function t(t, e) {
      this.resourceName = null;
      this.orginalValue = null;
      this.n = null;
      this.s = null;
      this.orginalValue = t;
      this.decodeCard(t, e);
      this.resourceName = this.getResourceName();
    }
    t.prototype.decodeCard = function(t, e) {
      this.s = t % 4 + 1;
      this.n = Math.floor(t / 4) + 1;
      if (1 == this.n) {
        this.n = 14;
      }
      if (2 == this.n && e != n.GameID.BINH && e != n.GameID.POKER && e != n.GameID.BACAY && e != n.GameID.BLACK_JACK) {
        this.n = 15;
      }
    };
    t.prototype.encodeCard = function(t) {
      return t == n.GameID.TIENLEN ? 13 * (this.s - 1) + this.n - 2 : 13 * (this.s - 1) + this.n - 1;
    };
    t.prototype.getResourceName = function() {
      var t = 0;
      if ((t = 15 == this.n ? 2 : 14 == this.n ? 1 : this.n) > 0) {
        this.getSuitInVietnamese();
        return "icCard" + t + this.getSuitInVietnamese() + ".png";
      }
      return "icCard.png";
    };
    t.prototype.getSuitInVietnamese = function() {
      return 1 == this.s ? "D" : 2 == this.s ? "C" : 3 == this.s ? "B" : 4 == this.s ? "A" : "-1";
    };
    return t;
  }();
i.GameCard = o;
void 0;
