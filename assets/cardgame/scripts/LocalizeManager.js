var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
var n = this && this.__extends || function() {
    var t = function(e, i) {
      return (t = Object.setPrototypeOf || {
          __proto__: []
        }
        instanceof Array && function(t, e) {
          t.__proto__ = e;
        } || function(t, e) {
          for (var i in e) {
            if (e.hasOwnProperty(i)) {
              t[i] = e[i];
            }
          }
        })(e, i);
    };
    return function(e, i) {
      function n() {
        this.constructor = e;
      }
      t(e, i);
      e.prototype = null === i ? Object.create(i) : (n.prototype = i.prototype, new n());
    };
  }(),
  o = this && this.__decorate || function(t, e, i, n) {
    var o,
      a = arguments.length,
      s = a < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, i) : n;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) {
      s = Reflect.decorate(t, e, i, n);
    } else {
      for (var r = t.length - 1; r >= 0; r--) {
        if (o = t[r]) {
          s = (a < 3 ? o(s) : a > 3 ? o(e, i, s) : o(e, i)) || s;
        }
      }
    }
    if (a > 3 && s) {
      Object.defineProperty(e, i, s);
    }
    return s;
  };
Object.defineProperty(i, "__esModule", {
  value: true
});
var a = require("./GameHTTPManager"),
  s = require("./GamePlayManager"),
  r = require("./RMCLocalizeConfig"),
  c = require("./StringUtil"),
  l = cc._decorator,
  h = l.ccclass,
  u = l.property,
  d = function(t) {
    function e() {
      var e = null !== t && t.apply(this, arguments) || this;
      e.text = null;
      e.arrayText = [
        []
      ];
      e.langID = 0;
      return e;
    }
    var i;
    n(e, t);
    i = e;
    e.getInstance = function() {
      if (!(null !== this.Instance && void 0 !== this.Instance)) {
        this.Instance = new i();
      }
      return this.Instance;
    };
    e.prototype.onLoad = function() {
      cc.game.addPersistRootNode(this.node);
      i.Instance = this;
      this.langID = s.default.getInstance().language;
      this.arrayText = this.CSVToArray(this.text.text, ",");
    };
    e.prototype.fetchRemoteLanguageData = function() {
      var t = r.getLocalizeConfig();
      if (t && !c.default.isNullOrEmpty(t.urlCSV)) {
        var e = this;
        a.default.getInstance().getRawHTTP(t.urlCSV + "?" + new Date().getTime().toString(), function(t) {
          e.updateCSVContent(t);
        }, function(t) {});
      }
    };
    e.prototype.updateCSVContent = function(t) {
      if (t && t.length && t.length > 100) {
        try {
          var e = this.CSVToArray(t, ",");
          if (e) {
            this.arrayText = e;
          }
        } catch (t) {}
      }
    };
    e.prototype.SetLang = function(t) {
      this.langID = t;
    };
    e.prototype.GetLang = function() {
      return this.langID;
    };
    e.prototype.Clean = function() {
      if (null != this.node) {
        cc.game.removePersistRootNode(this.node);
        this.node.removeFromParent(true);
      }
    };
    e.prototype.GetKeyValueWithPlaceholders = function(t) {
      for (var e = [], i = 1; i < arguments.length; i++) {
        e[i - 1] = arguments[i];
      }
      return c.default.replacePlaceholders(this.GetKeyValue(t), e);
    };
    e.prototype.GetString = function(t, e, i) {
      if (void 0 === e) {
        e = "";
      }
      if (void 0 === i) {
        i = false;
      }
      var n = this.GetKeyValue(t, i);
      return null != n && "" != n ? n : e;
    };
    e.prototype.GetKeyValue = function(t, e) {
      if (void 0 === e && (e = false), 0 == t.length) {
        return "";
      }
      for (var i = 0; i < this.arrayText.length; i++) {
        if (this.arrayText[i][0] === t) {
          var n = this.arrayText[i][this.langID + 2];
          return n = n.replace(/\\n/g, "\n");
        }
      }
      return "";
    };
    e.prototype.GetData = function() {
      return this.arrayText;
    };
    e.prototype.CSVToArray = function(t, e) {
      e = e || ",";
      for (var i = new RegExp("(\\" + e + '|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\' + e + "\\r\\n]*))", "gi"), n = [
          []
        ], o = null; o = i.exec(t);) {
        var a = o[1];
        if (a.length && a != e && n.push([]), o[2]) {
          var s = o[2].replace(new RegExp('""', "g"), '"');
        } else {
          s = o[3];
        }
        n[n.length - 1].push(s);
      }
      return n;
    };
    e.Instance = null;
    o([u(cc.TextAsset)], e.prototype, "text", void 0);
    return e = i = o([h], e);
  }(cc.Component);
i.default = d;
void 0;
