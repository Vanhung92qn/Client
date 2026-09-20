var t = require,
  e = module,
  i = exports;
"use strict";
void 0;
Object.defineProperty(i, "__esModule", {
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

    var dr = cc.Canvas.instance.designResolution;
    var w = cc.winSize.width;
    var h = cc.winSize.height;

    return dr.width / w > dr.height / h ? h / dr.height : w / dr.width;
  };

  return CanvasSceneBase;
})();

i.default = CanvasSceneBase;
void 0;
