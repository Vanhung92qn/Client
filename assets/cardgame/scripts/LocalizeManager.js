var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
var __extends = this && this.__extends || function() {
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
  __decorate = this && this.__decorate || function(t, e, i, n) {
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
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});
var GameHTTPManager = require("GameHTTPManager"),
  GamePlayManager = require("GamePlayManager"),
  RMCLocalizeConfig = require("RMCLocalizeConfig"),
  StringUtil = require("StringUtil"),
  ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  LocalizeManager = function(_super) {
    function LocalizeManager() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.text = null;
      _this.arrayText = [
        []
      ];
      _this.langID = 0;
      return _this;
    }
    var LocalizeManagerClass;
    __extends(LocalizeManager, _super);
    LocalizeManagerClass = LocalizeManager;
    LocalizeManager.getInstance = function() {
      if (!(null !== this.Instance && void 0 !== this.Instance)) {
        this.Instance = new LocalizeManagerClass();
      }
      return this.Instance;
    };
    LocalizeManager.prototype.onLoad = function() {
      cc.game.addPersistRootNode(this.node);
      LocalizeManagerClass.Instance = this;
      this.langID = GamePlayManager.default.getInstance().language;
      this.arrayText = this.CSVToArray(this.text.text, ",");
    };
    LocalizeManager.prototype.fetchRemoteLanguageData = function() {
      var localizeConfig = RMCLocalizeConfig.getLocalizeConfig();
      if (localizeConfig && !StringUtil.default.isNullOrEmpty(localizeConfig.urlCSV)) {
        var self = this;
        GameHTTPManager.default.getInstance().getRawHTTP(localizeConfig.urlCSV + "?" + new Date().getTime().toString(), function(csvContent) {
          self.updateCSVContent(csvContent);
        }, function(errorInfo) {});
      }
    };
    LocalizeManager.prototype.updateCSVContent = function(csvContent) {
      if (csvContent && csvContent.length && csvContent.length > 100) {
        try {
          var parsedRows = this.CSVToArray(csvContent, ",");
          if (parsedRows) {
            this.arrayText = parsedRows;
          }
        } catch (parseError) {}
      }
    };
    LocalizeManager.prototype.SetLang = function(langID) {
      this.langID = langID;
    };
    LocalizeManager.prototype.GetLang = function() {
      return this.langID;
    };
    LocalizeManager.prototype.Clean = function() {
      if (null != this.node) {
        cc.game.removePersistRootNode(this.node);
        this.node.removeFromParent(true);
      }
    };
    LocalizeManager.prototype.GetKeyValueWithPlaceholders = function(key) {
      for (var placeholderValues = [], argIndex = 1; argIndex < arguments.length; argIndex++) {
        placeholderValues[argIndex - 1] = arguments[argIndex];
      }
      return StringUtil.default.replacePlaceholders(this.GetKeyValue(key), placeholderValues);
    };
    LocalizeManager.prototype.GetString = function(key, defaultValue, i) {
      if (void 0 === defaultValue) {
        defaultValue = "";
      }
      if (void 0 === i) {
        i = false;
      }
      var value = this.GetKeyValue(key, i);
      return null != value && "" != value ? value : defaultValue;
    };
    LocalizeManager.prototype.GetKeyValue = function(key, e) {
      if (void 0 === e && (e = false), 0 == key.length) {
        return "";
      }
      for (var rowIndex = 0; rowIndex < this.arrayText.length; rowIndex++) {
        if (this.arrayText[rowIndex][0] === key) {
          var value = this.arrayText[rowIndex][this.langID + 2];
          return value = value.replace(/\\n/g, "\n");
        }
      }
      return "";
    };
    LocalizeManager.prototype.GetData = function() {
      return this.arrayText;
    };
    LocalizeManager.prototype.CSVToArray = function(csvText, delimiter) {
      delimiter = delimiter || ",";
      for (var pattern = new RegExp("(\\" + delimiter + '|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\' + delimiter + "\\r\\n]*))", "gi"), rows = [
          []
        ], match = null; match = pattern.exec(csvText);) {
        var matchedDelimiter = match[1];
        if (matchedDelimiter.length && matchedDelimiter != delimiter && rows.push([]), match[2]) {
          var cellValue = match[2].replace(new RegExp('""', "g"), '"');
        } else {
          cellValue = match[3];
        }
        rows[rows.length - 1].push(cellValue);
      }
      return rows;
    };
    LocalizeManager.Instance = null;
    __decorate([property(cc.TextAsset)], LocalizeManager.prototype, "text", void 0);
    return LocalizeManager = LocalizeManagerClass = __decorate([ccclass], LocalizeManager);
  }(cc.Component);
moduleExports.default = LocalizeManager;
void 0;
