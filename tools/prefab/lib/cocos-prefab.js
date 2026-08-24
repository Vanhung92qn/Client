/**
 * cocos-prefab.js — dung file .prefab cua Cocos Creator 2.4.x bang code.
 *
 * File .prefab thuc chat la mot MANG JSON phang: moi node/component la mot
 * phan tu, tham chieu lan nhau qua { "__id__": <chi so trong mang> }.
 * Thu vien nay cho phep khai bao cay node long nhau cho de doc, roi tu
 * "lam phang" thanh dung dinh dang Cocos hieu.
 *
 * Cach dung:
 *   const P = require('./lib/cocos-prefab');
 *   const root = P.node('VipPopup', { size: [1280, 720] }, [ ...con... ], [ ...component... ]);
 *   const json = P.build(root, prefabUuid);
 *
 * Tham chieu cheo giua cac node: dat `ref` cho node roi tro toi bang
 * P.ref('ten') (tro toi NODE) hoac P.refComp('ten', 'cc.Sprite') (tro toi
 * COMPONENT tren node do). Viec resolve lam sau khi da lam phang.
 */

'use strict';

const crypto = require('crypto');

// ─────────────────────────────────────────────────────────────────
// UUID & cid
// ─────────────────────────────────────────────────────────────────

const BASE64_KEYS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** Sinh uuid v4 — dung cho .meta cua prefab/anh/script moi. */
function uuid4() {
  const b = crypto.randomBytes(16);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = b.toString('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/**
 * Nen uuid thanh "cid" — chinh la gia tri Cocos dung lam `__type__` khi
 * gan mot SCRIPT vao node trong file .prefab.
 *
 * Thuat toan: giu nguyen 5 ky tu hex dau, 27 hex con lai gom tung nhom 3
 * (12 bit) roi ma hoa thanh 2 ky tu base64.
 *   86d3fd8e-5c8a-41e1-ba7e-06d8fc7d9d40  ->  86d3f2OXIpB4bp+Btj8fZ1A
 * (da doi chieu voi prefab that trong project truoc khi dung)
 */
function compressUuid(id) {
  if (id.length !== 36) return id;
  const hex = id.replace(/-/g, '');
  let out = hex.slice(0, 5);
  const rest = hex.slice(5);
  for (let i = 0; i < rest.length; i += 3) {
    const v = parseInt(rest.substr(i, 3), 16);
    out += BASE64_KEYS[v >> 6] + BASE64_KEYS[v & 63];
  }
  return out;
}

/** fileId cua cc.PrefabInfo: 22 ky tu, moi node mot cai khac nhau. */
function fileId() {
  let s = '';
  for (let i = 0; i < 22; i++) {
    s += BASE64_KEYS[Math.floor(Math.random() * 64)];
  }
  return s;
}

// ─────────────────────────────────────────────────────────────────
// Tham chieu cheo
// ─────────────────────────────────────────────────────────────────

const REF = Symbol('ref');

/** Tro toi NODE co `ref` tuong ung. */
function ref(name) {
  return { [REF]: { kind: 'node', name } };
}

/** Tro toi COMPONENT loai `type` nam tren node co `ref` tuong ung. */
function refComp(name, type) {
  return { [REF]: { kind: 'comp', name, type } };
}

/** Tro toi chinh component dang duoc khai bao tren node hien tai. */
function refSelfNode() {
  return { [REF]: { kind: 'selfNode' } };
}

// ─────────────────────────────────────────────────────────────────
// Node
// ─────────────────────────────────────────────────────────────────

/**
 * @param {string} name
 * @param {object} opts
 *   size    [w, h]            kich thuoc          (mac dinh [0,0])
 *   pos     [x, y]            vi tri so voi cha   (mac dinh [0,0])
 *   scale   [sx, sy]                              (mac dinh [1,1])
 *   anchor  [ax, ay]                              (mac dinh [0.5,0.5])
 *   color   [r,g,b] hoac [r,g,b,a]                (mac dinh trang)
 *   opacity 0..255                                (mac dinh 255)
 *   active  bool                                  (mac dinh true)
 *   angle   do                                    (mac dinh 0)
 *   ref     string            dat ten de tham chieu tu cho khac
 * @param {Array} children
 * @param {Array} components
 */
function node(name, opts = {}, children = [], components = []) {
  return { __node: true, name, opts, children, components };
}

// ─────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────

/**
 * cc.Sprite
 * @param {string} spriteFrameUuid uuid cua SPRITE-FRAME (uuid trong subMetas
 *        cua file .meta, KHONG phai uuid cua texture)
 * @param {object} o  type: 0=simple 1=sliced 2=tiled 3=filled
 *                    sizeMode: 0=custom 1=trimmed 2=raw
 */
function sprite(spriteFrameUuid, o = {}) {
  return {
    __comp: true,
    type: 'cc.Sprite',
    data: {
      _srcBlendFactor: 770,
      _dstBlendFactor: 771,
      _spriteFrame: spriteFrameUuid ? { __uuid__: spriteFrameUuid } : null,
      _type: o.type == null ? 0 : o.type,
      _sizeMode: o.sizeMode == null ? 0 : o.sizeMode,
      _fillType: 0,
      _fillCenter: { __type__: 'cc.Vec2', x: 0, y: 0 },
      _fillStart: 0,
      _fillRange: 0,
      _isTrimmedMode: o.trimmed === undefined ? true : !!o.trimmed,
      _state: 0,
      _atlas: null,
    },
  };
}

/**
 * cc.Label
 * @param {string} text
 * @param {object} o  size, lineHeight, font (uuid bitmap font), color,
 *                    hAlign 0=left 1=center 2=right,
 *                    vAlign 0=top 1=center 2=bottom,
 *                    overflow 0=none 1=clamp 2=shrink 3=resize,
 *                    wrap (bool)
 */
function label(text, o = {}) {
  const fontSize = o.size == null ? 20 : o.size;
  return {
    __comp: true,
    type: 'cc.Label',
    data: {
      _useOriginalSize: false,
      _string: text,
      _N$string: text,
      _fontSize: fontSize,
      _lineHeight: o.lineHeight == null ? fontSize + 4 : o.lineHeight,
      _enableWrapText: !!o.wrap,
      _N$file: o.font ? { __uuid__: o.font } : null,
      _isSystemFontUsed: !o.font,
      _spacingX: 0,
      _batchAsBitmap: false,
      _N$horizontalAlign: o.hAlign == null ? 1 : o.hAlign,
      _N$verticalAlign: o.vAlign == null ? 1 : o.vAlign,
      _N$fontFamily: 'Arial',
      _N$overflow: o.overflow == null ? 0 : o.overflow,
      _N$cacheMode: 0,
    },
  };
}

/**
 * cc.Button — KHONG gan clickEvents. Moi su kien click deu duoc dang ky
 * trong code bang node.on('click', ...) de doi ten ham khong lam mat
 * lien ket mot cach im lang (loi kinh dien khi gan handler trong editor).
 *
 * @param {object} o  transition: 0=none 1=color 2=sprite 3=scale
 *                    normal/pressed/hover/disabled: uuid sprite-frame
 *                    target: ref(...) node doi mau/scale, mac dinh chinh no
 */
function button(o = {}) {
  const d = {
    __comp: true,
    type: 'cc.Button',
    data: {
      duration: 0.1,
      zoomScale: o.zoomScale == null ? 1.05 : o.zoomScale,
      clickEvents: [],
      _N$interactable: o.interactable === undefined ? true : !!o.interactable,
      _N$enableAutoGrayEffect: false,
      _N$transition: o.transition == null ? 3 : o.transition,
      transition: o.transition == null ? 3 : o.transition,
      _N$normalColor: color4(o.normalColor || [255, 255, 255, 255]),
      _N$pressedColor: color4(o.pressedColor || [211, 211, 211, 255]),
      pressedColor: color4(o.pressedColor || [211, 211, 211, 255]),
      _N$hoverColor: color4(o.hoverColor || [255, 255, 255, 255]),
      hoverColor: color4(o.hoverColor || [255, 255, 255, 255]),
      _N$disabledColor: color4(o.disabledColor || [124, 124, 124, 255]),
      _N$normalSprite: o.normal ? { __uuid__: o.normal } : null,
      _N$pressedSprite: o.pressed ? { __uuid__: o.pressed } : null,
      pressedSprite: o.pressed ? { __uuid__: o.pressed } : null,
      _N$hoverSprite: o.hover ? { __uuid__: o.hover } : null,
      hoverSprite: o.hover ? { __uuid__: o.hover } : null,
      _N$disabledSprite: o.disabled ? { __uuid__: o.disabled } : null,
      _N$target: o.target || refSelfNode(),
    },
  };
  return d;
}

/**
 * cc.Layout — tu sap xep node con.
 * @param {object} o  layoutType: 0=none 1=horizontal 2=vertical 3=grid
 *                    resize: 0=none 1=container 2=children
 *                    padding{L,R,T,B}, spacingX, spacingY, cellSize [w,h]
 *                    verticalDirection: 0=bottom-to-top 1=top-to-bottom
 *                    horizontalDirection: 0=left-to-right 1=right-to-left
 */
function layout(o = {}) {
  const pad = o.padding || {};
  return {
    __comp: true,
    type: 'cc.Layout',
    data: {
      _layoutSize: {
        __type__: 'cc.Size',
        width: o.size ? o.size[0] : 100,
        height: o.size ? o.size[1] : 100,
      },
      _resize: o.resize == null ? 0 : o.resize,
      _N$layoutType: o.layoutType == null ? 2 : o.layoutType,
      _N$cellSize: {
        __type__: 'cc.Size',
        width: o.cellSize ? o.cellSize[0] : 40,
        height: o.cellSize ? o.cellSize[1] : 40,
      },
      _N$startAxis: o.startAxis == null ? 0 : o.startAxis,
      _N$paddingLeft: pad.L || 0,
      _N$paddingRight: pad.R || 0,
      _N$paddingTop: pad.T || 0,
      _N$paddingBottom: pad.B || 0,
      _N$spacingX: o.spacingX || 0,
      _N$spacingY: o.spacingY || 0,
      _N$verticalDirection: o.verticalDirection == null ? 1 : o.verticalDirection,
      _N$horizontalDirection: o.horizontalDirection == null ? 0 : o.horizontalDirection,
      _N$affectedByScale: false,
    },
  };
}

/**
 * cc.ScrollView
 * @param {object} o  content: ref(...) BAT BUOC, horizontal, vertical
 */
function scrollView(o = {}) {
  return {
    __comp: true,
    type: 'cc.ScrollView',
    data: {
      horizontal: !!o.horizontal,
      vertical: o.vertical === undefined ? true : !!o.vertical,
      inertia: true,
      brake: 0.75,
      elastic: true,
      bounceDuration: 0.23,
      scrollEvents: [],
      cancelInnerEvents: true,
      _N$content: o.content,
      content: o.content,
      _N$horizontalScrollBar: null,
      _N$verticalScrollBar: null,
    },
  };
}

/**
 * cc.ProgressBar
 * @param {object} o  barSprite: refComp(...) toi cc.Sprite cua thanh chay,
 *                    mode: 0=horizontal 1=vertical 2=filled,
 *                    totalLength, progress 0..1
 */
function progressBar(o = {}) {
  return {
    __comp: true,
    type: 'cc.ProgressBar',
    data: {
      _N$totalLength: o.totalLength == null ? 100 : o.totalLength,
      _N$barSprite: o.barSprite || null,
      _N$mode: o.mode == null ? 0 : o.mode,
      _N$progress: o.progress == null ? 0 : o.progress,
      _N$reverse: false,
    },
  };
}

/** cc.Mask — 0=rect 1=ellipse 2=image stencil */
function mask(o = {}) {
  return {
    __comp: true,
    type: 'cc.Mask',
    data: {
      _spriteFrame: o.spriteFrame ? { __uuid__: o.spriteFrame } : null,
      _type: o.type == null ? 0 : o.type,
      _segments: 64,
      _N$alphaThreshold: 0.1,
      _N$inverted: false,
    },
  };
}

/** cc.Widget — neo node theo canh cua cha. */
function widget(o = {}) {
  return {
    __comp: true,
    type: 'cc.Widget',
    data: {
      alignMode: o.alignMode == null ? 1 : o.alignMode,
      _target: null,
      _alignFlags: o.alignFlags == null ? 45 : o.alignFlags,
      _left: o.left || 0,
      _right: o.right || 0,
      _top: o.top || 0,
      _bottom: o.bottom || 0,
      _verticalCenter: 0,
      _horizontalCenter: 0,
      _isAbsLeft: true,
      _isAbsRight: true,
      _isAbsTop: true,
      _isAbsBottom: true,
      _isAbsHorizontalCenter: true,
      _isAbsVerticalCenter: true,
      _originalWidth: 0,
      _originalHeight: 0,
    },
  };
}

/**
 * Component la SCRIPT do minh viet.
 * @param {string} scriptUuid uuid trong file .js.meta
 * @param {object} props      cac property cua script (dung ref/refComp de tro node)
 */
function script(scriptUuid, props = {}) {
  return {
    __comp: true,
    type: compressUuid(scriptUuid),
    isScript: true,
    data: Object.assign({}, props),
  };
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function color4(c) {
  return {
    __type__: 'cc.Color',
    r: c[0],
    g: c[1],
    b: c[2],
    a: c.length > 3 ? c[3] : 255,
  };
}

// ─────────────────────────────────────────────────────────────────
// Build — lam phang cay node thanh mang JSON cua Cocos
// ─────────────────────────────────────────────────────────────────

/**
 * @param {object} root    node goc (tao boi node())
 * @param {string} pfUuid  uuid cua chinh file .prefab (phai trung .meta)
 * @returns {Array} mang JSON ghi thang ra file .prefab
 */
function build(root, pfUuid) {
  const out = [];
  const refIndex = {}; // ref name -> { nodeId, comps: { type: id } }

  // [0] la cc.Prefab, node goc luon la [1]
  out.push({
    __type__: 'cc.Prefab',
    _name: '',
    _objFlags: 0,
    _native: '',
    data: { __id__: 1 },
    optimizationPolicy: 0,
    asyncLoadAssets: false,
  });

  const rootId = walk(root, null);

  // Sau khi da co day du chi so, thay cac tham chieu bang { __id__ }
  resolveRefs(out, refIndex);

  return out;

  /** Dat node vao mang, de danh cho cho component & con, tra ve chi so. */
  function walk(n, parentId) {
    const id = out.length;
    const o = n.opts || {};
    const size = o.size || [0, 0];
    const pos = o.pos || [0, 0];
    const scale = o.scale || [1, 1];
    const anchor = o.anchor || [0.5, 0.5];
    const angle = o.angle || 0;

    // quaternion quay quanh truc Z
    const rad = (angle * Math.PI) / 180 / 2;
    const qz = Math.sin(rad);
    const qw = Math.cos(rad);

    const nodeObj = {
      __type__: 'cc.Node',
      _name: n.name,
      _objFlags: 0,
      _parent: parentId == null ? null : { __id__: parentId },
      _children: [],
      _active: o.active === undefined ? true : !!o.active,
      _level: 0,
      _components: [],
      _prefab: null,
      _opacity: o.opacity == null ? 255 : o.opacity,
      _color: color4(o.color || [255, 255, 255]),
      _contentSize: { __type__: 'cc.Size', width: size[0], height: size[1] },
      _anchorPoint: { __type__: 'cc.Vec2', x: anchor[0], y: anchor[1] },
      _skewX: 0,
      _skewY: 0,
      groupIndex: o.groupIndex || 0,
      _id: '',
      _eulerAngles: { __type__: 'cc.Vec3', x: 0, y: 0, z: angle },
      _trs: {
        __type__: 'TypedArray',
        ctor: 'Float64Array',
        array: [pos[0], pos[1], 0, 0, 0, qz, qw, scale[0], scale[1], 1],
      },
    };
    out.push(nodeObj);

    if (o.ref) {
      refIndex[o.ref] = refIndex[o.ref] || { comps: {} };
      refIndex[o.ref].nodeId = id;
    }

    // Con truoc, de thu tu trong mang giong Cocos xuat ra
    for (const c of n.children || []) {
      nodeObj._children.push({ __id__: walk(c, id) });
    }

    // Components
    for (const comp of n.components || []) {
      const cid = out.length;
      const co = Object.assign(
        {
          __type__: comp.type,
          _name: '',
          _objFlags: 0,
          node: { __id__: id },
          _enabled: true,
        },
        comp.data,
        { _id: '' }
      );
      // ghi nho de refComp() tim duoc
      if (o.ref) {
        refIndex[o.ref].comps[comp.type] = cid;
      }
      // component tro ve chinh node minh
      for (const k of Object.keys(co)) {
        if (co[k] && co[k][REF] && co[k][REF].kind === 'selfNode') {
          co[k] = { __id__: id };
        }
      }
      out.push(co);
      nodeObj._components.push({ __id__: cid });
    }

    // cc.PrefabInfo — moi node trong prefab deu phai co
    const pid = out.length;
    out.push({
      __type__: 'cc.PrefabInfo',
      root: { __id__: 1 },
      asset: { __uuid__: pfUuid },
      fileId: fileId(),
      sync: false,
    });
    nodeObj._prefab = { __id__: pid };

    return id;
  }
}

/** Duyet toan bo mang, thay moi doi tuong co REF bang { __id__ } that. */
function resolveRefs(out, refIndex) {
  const visit = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) obj[i] = visit(obj[i]);
      return obj;
    }
    const r = obj[REF];
    if (r) {
      const entry = refIndex[r.name];
      if (!entry) {
        throw new Error(`Khong tim thay node co ref="${r.name}"`);
      }
      if (r.kind === 'node') return { __id__: entry.nodeId };
      if (r.kind === 'comp') {
        const cid = entry.comps[r.type];
        if (cid == null) {
          throw new Error(
            `Node ref="${r.name}" khong co component ${r.type}`
          );
        }
        return { __id__: cid };
      }
      return obj;
    }
    for (const k of Object.keys(obj)) obj[k] = visit(obj[k]);
    return obj;
  };
  for (const item of out) visit(item);
}

// ─────────────────────────────────────────────────────────────────
// Ghi file
// ─────────────────────────────────────────────────────────────────

/** Noi dung file .prefab.meta di kem. */
function prefabMeta(pfUuid) {
  return {
    ver: '1.3.2',
    uuid: pfUuid,
    importer: 'prefab',
    optimizationPolicy: 'AUTO',
    asyncLoadAssets: false,
    readonly: false,
    subMetas: {},
  };
}

/**
 * Noi dung .meta cua mot THU MUC. Cocos bat buoc moi thu muc trong assets/
 * phai co file .meta di kem, thieu la khi mo project no tu sinh ra va git
 * lai bao co file moi.
 */
function folderMeta(folderUuid) {
  return {
    ver: '1.1.3',
    uuid: folderUuid,
    importer: 'folder',
    isBundle: false,
    bundleName: '',
    priority: 1,
    compressionType: {},
    optimizeHotUpdate: {},
    inlineSpriteFrames: {},
    isRemoteBundle: {},
    subMetas: {},
  };
}

/** Noi dung file .js.meta di kem script. */
function scriptMeta(scriptUuid) {
  return {
    ver: '1.0.8',
    uuid: scriptUuid,
    importer: 'javascript',
    isPlugin: false,
    loadPluginInWeb: true,
    loadPluginInNative: true,
    loadPluginInEditor: false,
    subMetas: {},
  };
}

module.exports = {
  uuid4,
  compressUuid,
  fileId,
  ref,
  refComp,
  node,
  sprite,
  label,
  button,
  layout,
  scrollView,
  progressBar,
  mask,
  widget,
  script,
  build,
  prefabMeta,
  scriptMeta,
  folderMeta,
  color4,
};
