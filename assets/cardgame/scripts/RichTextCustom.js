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
var ccDecorator = cc._decorator,
  ccclass = ccDecorator.ccclass,
  property = ccDecorator.property,
  RichTextSegment = function() {
    return function() {
      this.Text = "";
      this.HexaColor = ";";
    };
  }(),
  RichTextCustom = function(_super) {
    function RichTextCustom() {
      var _this = null !== _super && _super.apply(this, arguments) || this;
      _this.text = "";
      _this.prefabLabel = null;
      _this.layout = null;
      _this.currentText = "";
      _this.listLabel = [];
      _this.content = null;
      _this.maxLength = 200;
      _this.currLength = 0;
      return _this;
    }
    __extends(RichTextCustom, _super);
    RichTextCustom.prototype.start = function() {};
    RichTextCustom.prototype.onDestroy = function() {
      for (var labelIndex = 0; labelIndex < this.listLabel.length; labelIndex++) {
        if (null != this.listLabel[labelIndex] && null != this.listLabel[labelIndex].node) {
          this.listLabel[labelIndex].node.destroy();
        }
      }
      this.listLabel = [];
    };
    RichTextCustom.prototype.setString = function(text) {
      this.createLabels(text);
      if (null != this.layout) {
        this.layout.updateLayout();
      }
    };
    RichTextCustom.prototype.parseData = function(rawText) {
      var segments = [],
        colorTagIndex = rawText.indexOf("color"),
        hexStartIndex = -1,
        tagEndIndex = -1,
        segmentText = "",
        hexColor = "",
        plainTextStart = 0;
      do {
        if (colorTagIndex >= 0) {
          for (var charIndex = colorTagIndex; charIndex < rawText.length; charIndex++) {
            if ("#" != rawText[charIndex] || (hexStartIndex = charIndex, -1 == plainTextStart)) {
              if (">" == rawText[charIndex] && (tagEndIndex = charIndex, hexColor = rawText.substring(hexStartIndex, charIndex)), "<" == rawText[charIndex]) {
                segmentText = rawText.substring(tagEndIndex + 1, charIndex);
                (segment = new RichTextSegment()).Text = segmentText;
                segment.HexaColor = hexColor;
                segments.push(segment);
                for (var closeTagIndex = charIndex; closeTagIndex < rawText.length; closeTagIndex++) {
                  if (">" == rawText[closeTagIndex]) {
                    plainTextStart = closeTagIndex + 1;
                    break;
                  }
                }
                segmentText = "";
                hexColor = "";
                hexStartIndex = -1;
                tagEndIndex = -1;
                break;
              }
            } else {
              segmentText = rawText.substring(plainTextStart, colorTagIndex - 1);
              (segment = new RichTextSegment()).Text = segmentText;
              segment.HexaColor = "";
              segments.push(segment);
              plainTextStart = -1;
            }
          }
        }
        if ((colorTagIndex = rawText.indexOf("color", colorTagIndex + 1)) < 0) {
          for (charIndex = rawText.length - 1; charIndex >= 0; charIndex--) {
            if (">" == rawText[charIndex]) {
              tagEndIndex = charIndex;
              break;
            }
          }
          var segment;
          segmentText = rawText.substring(tagEndIndex + 1, rawText.length);
          (segment = new RichTextSegment()).Text = segmentText;
          segment.HexaColor = "";
          segments.push(segment);
          break;
        }
      } while (-1 != colorTagIndex);
      return segments;
    };
    RichTextCustom.prototype.createLabels = function(text) {
      if (text != this.currentText) {
        for (var segments = this.parseData(text), index = 0; index < this.listLabel.length; index++) {
          this.listLabel[index].node.active = false;
          this.listLabel[index].node.parent = null;
          this.listLabel[index].node.color = cc.color(255, 255, 255, 255);
          this.listLabel[index].string = "";
        }
        if (0 == segments.length) {
          var label = null;
          if (this.listLabel.length > 0) {
            label = this.listLabel[0];
          }
          if (null == label) {
            label = cc.instantiate(this.prefabLabel).getComponent(cc.Label);
            this.listLabel.push(label);
          }
          label.node.active = true;
          label.string = text;
          label.node.parent = this.node;
        } else {
          this.currLength = 0;
          this.node.y = 0;
          var labelIndex = 0,
            wrapToNextLine = false;
          for (index = 0; index < segments.length; index++) {
            var segment = segments[index];
            if (0 != segment.Text.length) {
              if ("\n" === segment.Text.slice(0, 1) && (segment.Text = segment.Text.replace("\n", ""), wrapToNextLine = true), null != this.content) {
                for (var totalTextLength = 0, fontSize = 25, wrapLimit = this.maxLength, segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
                  totalTextLength += segments[segmentIndex].Text.length;
                }
                if (totalTextLength > 85) {
                  fontSize -= (totalTextLength - 85) / 4;
                  wrapLimit = totalTextLength / 2 - 10;
                }
                for (var words = segment.Text.split(" "), wordIndex = 0; wordIndex < words.length; wordIndex++) {
                  if (0 != words[wordIndex].length) {
                    label = null;
                    if (labelIndex < this.listLabel.length) {
                      label = this.listLabel[labelIndex];
                    }
                    labelIndex++;
                    if (null == label) {
                      label = cc.instantiate(this.prefabLabel).getComponent(cc.Label);
                      this.listLabel.push(label);
                    }
                    label.fontSize = fontSize;
                    label.node.active = true;
                    label.string = words[wordIndex];
                    this.currLength += label.string.length;
                    if ("\n" === words[wordIndex].slice(0, 1)) {
                      label.string = words[wordIndex] = words[wordIndex].replace("\n", "");
                      wrapToNextLine = true;
                    }
                    if (this.currLength >= wrapLimit || wrapToNextLine) {
                      label.node.parent = this.content;
                      this.node.y = 14;
                      this.content.y = -16;
                    } else {
                      label.node.parent = this.node;
                      if ("\n" === words[wordIndex].slice(-1)) {
                        label.string = words[wordIndex] = words[wordIndex].replace("\n", "");
                        wrapToNextLine = true;
                      }
                    }
                    label.node.x = 0;
                    label.node.y = 0;
                    if (segment.HexaColor.length > 0) {
                      label.node.color = this.node.color.fromHEX(segment.HexaColor);
                    } else {
                      label.node.color = cc.color(255, 255, 255, 255);
                    }
                  }
                }
                this.doActionFadeInListLabel();
              } else {
                label = null;
                if (index < this.listLabel.length) {
                  label = this.listLabel[index];
                }
                if (null == label) {
                  label = cc.instantiate(this.prefabLabel).getComponent(cc.Label);
                  this.listLabel.push(label);
                }
                label.node.active = true;
                label.string = segment.Text;
                label.node.parent = this.node;
                label.node.x = 0;
                label.node.y = 0;
                if (segment.HexaColor.length > 0) {
                  label.node.color = this.node.color.fromHEX(segment.HexaColor);
                } else {
                  label.node.color = cc.color(255, 255, 255, 255);
                }
              }
            }
          }
        }
        this.currentText = text;
      }
    };
    RichTextCustom.prototype.doActionFadeInListLabel = function() {
      for (var labelIndex = 0; labelIndex < this.listLabel.length; labelIndex++) {
        this.listLabel[labelIndex].node.opacity = 0;
        this.listLabel[labelIndex].node.runAction(cc.fadeIn(.5));
      }
    };
    RichTextCustom.prototype.resetOpacityListLabel = function() {
      for (var labelIndex = 0; labelIndex < this.listLabel.length; labelIndex++) {
        this.listLabel[labelIndex].node.opacity = 255;
      }
    };
    __decorate([property], RichTextCustom.prototype, "text", void 0);
    __decorate([property(cc.Prefab)], RichTextCustom.prototype, "prefabLabel", void 0);
    __decorate([property(cc.Layout)], RichTextCustom.prototype, "layout", void 0);
    __decorate([property(cc.Node)], RichTextCustom.prototype, "content", void 0);
    __decorate([property], RichTextCustom.prototype, "maxLength", void 0);
    return RichTextCustom = __decorate([ccclass], RichTextCustom);
  }(cc.Component);
moduleExports.default = RichTextCustom;
void 0;
