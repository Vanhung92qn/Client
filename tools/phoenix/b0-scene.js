/**
 * b0-scene.js — sinh mot SCENE toi thieu chua san PhoenixSmokeTest, de bam
 * Preview kiem phan CHAY THAT ma khong phai keo tha gi trong editor.
 *
 * VI SAO CAN
 * Cocos Preview chay SCENE dang mo, khong chay prefab. Mo prefab roi bam
 * Preview thi no chay scene truoc do — khong lien quan. Nen phai co mot scene
 * that chua san prefab.
 *
 * CACH LAM
 * Tai su dung dung cay node cua b0-smoketest roi nhung vao scene duoi dang
 * PREFAB INSTANCE — giong het cach MainGame.fire nhung 21 instance cua no:
 *     cc.PrefabInfo { root: <goc instance>, asset: { __uuid__: <prefab nguon> }, fileId, sync:false }
 * Khac voi prefab goc, noi `asset` la { __id__: 0 }.
 *
 * Lam vay thi bai test kiem CA prefab that (qua duong instance) chu khong phai
 * mot ban sao noi dung — neu prefab hong thi scene cung hong theo, dung y muon.
 *
 * Chay:  node tools/phoenix/b0-scene.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const P = require('../prefab/lib/cocos-prefab');
const A = require('../prefab/lib/assets');
const R = require('./reg');

const PREFAB_REL = 'phoenix/prefab/PhoenixSmokeTest.prefab';
const SCENE_REL = 'phoenix/prefab/PhoenixSmokeTest.fire';

/** .meta cua mot scene. Doi chieu assets/loading/update.fire.meta. */
function sceneMeta(uuid) {
  return {
    ver: '1.3.2',
    uuid,
    importer: 'scene',
    asyncLoadAssets: false,
    autoReleaseAssets: false, // khop update.fire.meta
    subMetas: {},
  };
}

function main() {
  console.log('--- B0 scene ---');

  // ── 1. Doc prefab da sinh ─────────────────────────────────────
  const prefabAbs = path.join(A.ASSETS_ROOT, PREFAB_REL);
  if (!fs.existsSync(prefabAbs)) {
    throw new Error('Chua co ' + PREFAB_REL + ' — chay b0-smoketest.js truoc.');
  }
  const prefabUuid = JSON.parse(fs.readFileSync(prefabAbs + '.meta', 'utf8')).uuid;
  const pf = JSON.parse(fs.readFileSync(prefabAbs, 'utf8'));

  // ── 2. Khung scene ────────────────────────────────────────────
  // [0] SceneAsset · [1] Scene · [2] Canvas node · [3] Camera node
  // [4] cc.Camera  · [5] cc.Canvas · [6..] instance
  const INST = 6; // chi so node goc cua instance trong scene
  const OFF = INST - 1; // prefab[i] -> scene[i + OFF]  (bo prefab[0] = cc.Prefab)

  const { w, h } = R.DESIGN;
  const out = [];

  // uuid cua scene phai biet TRUOC: trong update.fire, cc.Scene._id BANG DUNG
  // uuid trong .meta. Sinh hai gia tri khac nhau thi Creator chuan hoa lai o
  // lan luu dau tien, tao diff thua.
  const sceneAbs = path.join(A.ASSETS_ROOT, SCENE_REL);
  const sceneMetaAbs = sceneAbs + '.meta';
  const scUuid = fs.existsSync(sceneMetaAbs)
    ? JSON.parse(fs.readFileSync(sceneMetaAbs, 'utf8')).uuid
    : P.uuid4();

  out.push({
    __type__: 'cc.SceneAsset',
    _name: '',
    _objFlags: 0,
    _native: '',
    scene: { __id__: 1 },
  });

  out.push({
    __type__: 'cc.Scene',
    _objFlags: 0,
    _parent: null,
    _children: [{ __id__: 2 }],
    _active: false,
    _components: [],
    _prefab: null,
    _opacity: 255,
    _color: { __type__: 'cc.Color', r: 255, g: 255, b: 255, a: 255 },
    _contentSize: { __type__: 'cc.Size', width: 0, height: 0 },
    _anchorPoint: { __type__: 'cc.Vec2', x: 0, y: 0 },
    _trs: { __type__: 'TypedArray', ctor: 'Float64Array', array: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1] },
    _is3DNode: true,
    _groupIndex: 0,
    groupIndex: 0,
    autoReleaseAssets: false,
    _id: scUuid, // = uuid cua scene, xem tren
  });

  // Canvas: dat o giua he toa do scene (nua do phan giai), giong update.fire.
  out.push({
    __type__: 'cc.Node',
    _name: 'Canvas',
    _objFlags: 0,
    _parent: { __id__: 1 },
    _children: [{ __id__: 3 }, { __id__: INST }],
    _active: true,
    _components: [{ __id__: 5 }],
    _prefab: null,
    _opacity: 255,
    _color: { __type__: 'cc.Color', r: 255, g: 255, b: 255, a: 255 },
    _contentSize: { __type__: 'cc.Size', width: w, height: h },
    _anchorPoint: { __type__: 'cc.Vec2', x: 0.5, y: 0.5 },
    _trs: { __type__: 'TypedArray', ctor: 'Float64Array', array: [w / 2, h / 2, 0, 0, 0, 0, 1, 1, 1, 1] },
    _eulerAngles: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 },
    _skewX: 0,
    _skewY: 0,
    _is3DNode: false,
    _groupIndex: 0,
    groupIndex: 0,
    _id: '',
  });

  out.push({
    __type__: 'cc.Node',
    _name: 'Main Camera',
    _objFlags: 0,
    _parent: { __id__: 2 },
    _children: [],
    _active: true,
    _components: [{ __id__: 4 }],
    _prefab: null,
    _opacity: 255,
    _color: { __type__: 'cc.Color', r: 255, g: 255, b: 255, a: 255 },
    _contentSize: { __type__: 'cc.Size', width: 0, height: 0 },
    _anchorPoint: { __type__: 'cc.Vec2', x: 0.5, y: 0.5 },
    _trs: {
      __type__: 'TypedArray',
      ctor: 'Float64Array',
      array: [0, 0, 503.1607595987589, 0, 0, 0, 1, 1, 1, 1],
    },
    _eulerAngles: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 },
    _skewX: 0,
    _skewY: 0,
    _is3DNode: false,
    _groupIndex: 0,
    groupIndex: 0,
    _id: '',
  });

  out.push({
    __type__: 'cc.Camera',
    _name: '',
    _objFlags: 0,
    node: { __id__: 3 },
    _enabled: true,
    _cullingMask: 4294967295,
    _clearFlags: 7,
    _backgroundColor: { __type__: 'cc.Color', r: 0, g: 0, b: 0, a: 255 },
    _depth: -1,
    _zoomRatio: 1,
    _targetTexture: null,
    _fov: 60,
    _orthoSize: 10,
    _nearClip: 1,
    _farClip: 4096,
    _ortho: true,
    _rect: { __type__: 'cc.Rect', x: 0, y: 0, width: 1, height: 1 },
    _renderStages: 1,
    _alignWithScreen: true,
    _id: '',
  });

  out.push({
    __type__: 'cc.Canvas',
    _name: '',
    _objFlags: 0,
    node: { __id__: 2 },
    _enabled: true,
    _designResolution: { __type__: 'cc.Size', width: w, height: h },
    _fitWidth: false,
    _fitHeight: true,
    _id: '',
  });

  // ── 3. Nhung prefab vao lam instance ──────────────────────────
  // Doi chi so: prefab[i] -> scene[i + OFF]. Bo prefab[0] (cc.Prefab).
  const remap = (o) => {
    if (!o || typeof o !== 'object') return o;
    if (Array.isArray(o)) return o.map(remap);
    if (typeof o.__id__ === 'number') {
      if (o.__id__ === 0) {
        throw new Error('Con tham chieu toi prefab[0] chua xu ly'); // PrefabInfo.asset da thay o duoi
      }
      return { __id__: o.__id__ + OFF };
    }
    const r = {};
    for (const k of Object.keys(o)) r[k] = remap(o[k]);
    return r;
  };

  for (let i = 1; i < pf.length; i++) {
    const src = pf[i];
    let el;
    if (src.__type__ === 'cc.PrefabInfo') {
      // 🔴 Day la cho DUY NHAT khac prefab goc:
      //    prefab goc : asset = { __id__: 0 }  (tro vao cc.Prefab cua chinh no)
      //    instance   : asset = { __uuid__ }   (tro toi FILE prefab nguon)
      // Sai cho nay thi Creator lam PHANG instance — mat lien ket, sua prefab
      // goc khong con cap nhat xuong scene, va khong co loi nao bao.
      el = {
        __type__: 'cc.PrefabInfo',
        root: { __id__: src.root.__id__ + OFF },
        asset: { __uuid__: prefabUuid },
        fileId: src.fileId, // giu nguyen fileId cua node nguon
        sync: false,
      };
    } else {
      el = remap(src);
    }
    out.push(el);
  }

  // Goc instance treo vao Canvas thay vi khong co cha.
  out[INST]._parent = { __id__: 2 };

  // ── 4. Ghi ────────────────────────────────────────────────────
  P.writeCocosJson(sceneAbs, out); // noi dung truoc
  P.writeCocosJson(sceneMetaAbs, sceneMeta(scUuid)); // .meta sau

  console.log(`  scene  : ${SCENE_REL}  uuid=${scUuid}`);
  console.log(`           ${out.length} phan tu (khung 6 + instance ${pf.length - 1})`);

  // ── 5. Tu kiem ────────────────────────────────────────────────
  const loi = [];
  if (out[0].__type__ !== 'cc.SceneAsset') loi.push('[0] phai la cc.SceneAsset');
  if (out[1].__type__ !== 'cc.Scene') loi.push('[1] phai la cc.Scene');
  out.forEach((x, i) => {
    const chk = (o, w) => {
      if (!o || typeof o !== 'object') return;
      if (Array.isArray(o)) return o.forEach((v, j) => chk(v, `${w}[${j}]`));
      if (typeof o.__id__ === 'number') {
        if (o.__id__ < 0 || o.__id__ >= out.length) loi.push(`${w}: __id__=${o.__id__} ngoai mang`);
        return;
      }
      for (const k of Object.keys(o)) chk(o[k], `${w}.${k}`);
    };
    chk(x, `[${i}] ${x.__type__}`);
  });
  const pi = out.filter((x) => x.__type__ === 'cc.PrefabInfo');
  if (pi.length !== pf.filter((x) => x.__type__ === 'cc.PrefabInfo').length) {
    loi.push('so PrefabInfo khong khop prefab nguon');
  }
  if (!pi.every((x) => x.asset && x.asset.__uuid__ === prefabUuid)) {
    loi.push('co PrefabInfo khong tro toi prefab nguon');
  }
  if (loi.length) {
    console.error('  x LOI: ' + loi.join(' | '));
    process.exit(1);
  }
  console.log(`           ${pi.length} PrefabInfo deu tro toi ${prefabUuid.slice(0, 8)}`);
  console.log('');
  console.log('Mo trong Cocos:  assets/phoenix/PhoenixSmokeTest.fire  roi bam Preview.');
}

main();
