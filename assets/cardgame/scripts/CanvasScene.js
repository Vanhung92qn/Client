var requireRef = require,
  moduleRef = module,
  moduleExports = exports;
"use strict";
void 0;
Object.defineProperty(moduleExports, "__esModule", {
  value: true
});

// ─────────────────────────────────────────────────────────────────────────────
//  LOP GIA cho "CanvasScene" cua Go88.
//
//  Ban goc la mot lop canh (CanvasScene.js, ~200 dong) lo toan bo viec do khung hinh,
//  xoay man hinh, dang ky callback resize... Bo be KHONG can nhung thu do: Roy88 tu lo
//  canvas va huong man hinh.
//
//  Chi MOT ham duoc goi tu phan da be: `getBackgroundRatio()`, do
//  `AutoResizeBackground.js:59` dung de co gian anh nen cho vua khung hinh.
//  Cong thuc chep NGUYEN VAN tu ban goc (CanvasScene.js:185-189): lay ty le NHO HON giua
//  hai chieu, tuc anh nen luon phu kin ma khong bi keo meo.
//
//  🔴 Tra ve 1 khi chua co Canvas — giong het ban goc. Tra 0 hay undefined thi node bi
//  scale ve 0 va anh nen BIEN MAT ma khong bao loi gi.
// ─────────────────────────────────────────────────────────────────────────────

var CanvasSceneBase = (function () {
  function CanvasSceneBase() {}

  /** Go88 CanvasScene.js:185 — ty le co gian cho anh nen. */
  CanvasSceneBase.getBackgroundRatio = function () {
    if (cc.Canvas.instance == null) return 1;

    var designResolution = cc.Canvas.instance.designResolution;
    var screenWidth = cc.winSize.width;
    var screenHeight = cc.winSize.height;

    return designResolution.width / screenWidth > designResolution.height / screenHeight ? screenHeight / designResolution.height : screenWidth / designResolution.width;
  };

  return CanvasSceneBase;
})();

moduleExports.default = CanvasSceneBase;
void 0;
