/**
 * attach-scripts.js — gắn component script vào prefab và nối @property tới node.
 *
 * VÌ SAO CẦN
 * `gen-prefab.js` dựng ra hình hài; tệp này làm cho nó sống. Cocos Creator nối script
 * vào prefab bằng "cid" — dạng nén của uuid nằm trong `.js.meta`. Nên muốn làm bằng
 * code thì phải: giữ uuid script ỔN ĐỊNH, nén ra cid, rồi vá vào mảng prefab.
 *
 * 🔴 CỔNG KIỂM QUAN TRỌNG NHẤT ở cuối tệp: MỌI `@property` khai trong script phải nối
 * được tới một node/component có thật. Thiếu một cái là DỪNG, không ghi gì cả.
 *
 * Vì sao phải gắt như vậy: một property chưa nối thì Cocos KHÔNG báo lỗi. Nó chỉ là
 * `null` lúc chạy, và màn hình thiếu đúng một thứ — y hệt lần `cc.ProgressBar` thiếu
 * `barSprite`: prefab hợp lệ, thanh hiện ra, chỉ là không bao giờ nhúc nhích.
 *
 * Chạy:  node attach-scripts.js          (kiểm rồi ghi)
 *        node attach-scripts.js --kiem   (chỉ kiểm, không ghi)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const P = require('../prefab/lib/cocos-prefab');

const CLIENT = path.resolve(__dirname, '..', '..');
const ASSETS = path.join(CLIENT, 'assets');
const PREFAB = path.join(ASSETS, 'bacay', 'prefab');
const SCRIPT = path.join(ASSETS, 'lobby', 'scripts', 'cardgame', 'bacay');

const CHI_KIEM = process.argv.includes('--kiem');

// ─────────────────────────────────────────────────────────────────────
// Bảng gắn
//
// `node`  — đường dẫn từ gốc prefab, ngăn bằng '/'. Rỗng = chính node gốc.
//           Trùng tên thì thêm '#n' (n đếm từ 0) — ví dụ 'Card_bc#1'.
// `props` — tên property trong script → nguồn giá trị:
//           ['node',  'đường/dẫn']              tham chiếu NODE
//           ['comp',  'đường/dẫn', 'cc.Sprite'] tham chiếu COMPONENT trên node đó
//           ['asset', 'assets/…']               tham chiếu tài nguyên (đọc uuid từ .meta)
//           ['assets',['assets/…','assets/…']]  mảng tài nguyên
// ─────────────────────────────────────────────────────────────────────

const CHIP = [
    'ChipVang', 'ChipXanhNhat', 'ChipXanh', 'ChipXanhLa',
    'ChipCam', 'ChipHong', 'ChipDo', 'ChipTim', 'ChipNau',
].map((t) => `assets/bacay/prefab/${t}.prefab`);

const GAN = [
    {
        prefab: 'LaBai',
        node: '',
        script: 'views/LaBaiView.js',
        props: {
            spMat: ['comp', 'CardSprite', 'cc.Sprite'],
            spLung: ['comp', 'Card_bc', 'cc.Sprite'],
            fxSang: ['node', 'SparklingFx'],
            atlas: ['asset', 'assets/bacay/card/cards.plist'],
        },
    },
    {
        prefab: 'GheNguoiChoi',
        node: '',
        script: 'views/GheView.js',
        props: {
            lbTen: ['comp', 'PlayerName/name', 'cc.Label'],
            lbTien: ['comp', 'PlayerName/Mn/mn', 'cc.Label'],
            spAvatar: ['comp', 'PlayerAvarta/AvartaMark/avr', 'cc.Sprite'],
            ndSanSang: ['node', 'PlayerAvarta/ig_icon_ready'],
            thanhGio: ['comp', 'efLoadingBar', 'cc.ProgressBar'],
            ndTrangThai: ['node', 'PlayerStatusUI'],
            lbTrangThai: ['comp', 'PlayerStatusUI/Label', 'cc.Label'],
            ndChat: ['node', 'ChatView'],
        },
    },
    {
        prefab: 'BangDiem',
        node: '',
        script: 'views/BangDiemView.js',
        props: {
            ndKhung: ['node', 'New Node'],
            ndBu: ['node', 'New Node/Bù'],
            lbDiem: ['comp', 'New Node/Score', 'cc.Label'],
            ndBaCay: ['node', 'New Node/Ba Cây'],
            spTinhDiem: ['comp', 'caorua_tinh diem', 'sp.Skeleton'],
            spJQK: ['comp', 'animJQK', 'sp.Skeleton'],
            spHoaDiem: ['comp', 'sameScore', 'sp.Skeleton'],
        },
    },
    {
        prefab: 'RutThemLa',
        node: '',
        script: 'views/RutThemLaView.js',
        props: {
            lbHoa: ['comp', 'Hòa', 'cc.Label'],
            spBaoHoa: ['comp', 'Hòa so bài tiếp', 'sp.Skeleton'],
            prefabLaBai: ['asset', 'assets/bacay/prefab/LaBai.prefab'],
        },
    },
    {
        prefab: 'MucBan',
        node: '',
        script: 'views/MucBanView.js',
        props: {
            lbMucCuoc: ['comp', 'lblMucCuoc', 'cc.Label'],
            lbToiThieu: ['comp', 'lblMucCuocToiThieu', 'cc.Label'],
            lbSoNguoi: ['comp', 'lblSoNguoi', 'cc.Label'],
            thanhDay: ['comp', 'New ProgressBar', 'cc.ProgressBar'],
            ndKhoa: ['node', 'icClock'],
        },
    },
    {
        prefab: 'BanCaoRua',
        node: '',
        script: 'views/BanCaoRuaView.js',
        props: {
            lbIdBan: ['comp', 'HUD/borderLoadingTableHide/idBanLb', 'cc.Label'],
            lbMucCuoc: ['comp', 'HUD/borderLoadingTableHide/mucCuocLb', 'cc.Label'],
            thanhDem: ['comp', 'HUD/countDownProgress', 'cc.ProgressBar'],
            ndThanhDem: ['node', 'HUD/countDownProgress'],
            btnThoat: ['node', 'HUD/icExit_2'],
            btnChat: ['node', 'HUD/icChatRoom'],
            btnBatDau: ['node', 'HUD/BtnStart'],
            btnSanSang: ['node', 'HUD/ReadyBtn'],
            mocGiuaBan: ['node', 'HUD/caorua_mid_table'],
        },
    },
    {
        prefab: 'MocViTri',
        node: 'ChipController',
        script: 'views/ChipBayView.js',
        props: {
            prefabChip: ['assets', CHIP],
            mocGiuaBan: ['node', 'ChipController/posChipOnTable'],
            khoChip: ['node', 'ChipController/chipParent'],
        },
    },
    {
        prefab: 'MocViTri',
        node: '',
        script: 'controller/BaCayController.js',
        props: {
            prefabKhungBan: ['asset', 'assets/bacay/prefab/BanCaoRua.prefab'],
            prefabGhe: ['asset', 'assets/bacay/prefab/GheNguoiChoi.prefab'],
            prefabLaBai: ['asset', 'assets/bacay/prefab/LaBai.prefab'],
            prefabBangDiem: ['asset', 'assets/bacay/prefab/BangDiem.prefab'],
            mocGhe: ['node', 'ListPlayerPosition_9User'],
            mocChip: ['node', 'ListBetLabel_9User'],
            mocRutThem: ['node', 'ListPositionCardExtratime'],
            ndNanBai: ['node', 'NanBai'],
            btnLatTatCa: ['node', 'NanBai/BtnFlipAll'],
            demTron: ['comp', 'CountDown', 'cc.ProgressBar'],
            lbDemGiay: ['comp', 'CountDown/lbCountTime', 'cc.Label'],
            ndTuLat: ['node', 'ToggleAutoFlipAllCard'],
            ndTuLatDau: ['node', 'ToggleAutoFlipAllCard/checkmark'],
            chipBay: ['comp', 'ChipController', 'script:views/ChipBayView.js'],
            // RutThemLa dựng lúc chạy chứ không lồng sẵn: prefab lồng trong prefab ở
            // Cocos 2.4 phải nhúng cả cây node vào tệp cha, và một node rỗng chỉ mang
            // PrefabInfo thì lúc chạy KHÔNG sinh ra gì cả — hỏng im lặng.
            prefabRutThem: ['asset', 'assets/bacay/prefab/RutThemLa.prefab'],
        },
    },
    {
        prefab: 'SanhChonBan',
        node: '',
        script: 'views/SanhChonBanView.js',
        props: {
            ndDanhSach: ['node', 'tableParent'],
            prefabMucBan: ['asset', 'assets/bacay/prefab/MucBan.prefab'],
            btnChoiNhanh: ['node', 'FootterRoomUi/Right/buttonChoiNhanh@2x'],
            btnTaoBan: ['node', 'FootterRoomUi/Right/buttonTaoBan@2x'],
            btnHuongDan: ['node', 'letBorder@2x/BtnHuongDan'],
            lbTen: ['comp', 'FootterRoomUi/Left/buttonName/NameUser', 'cc.Label'],
            lbTien: ['comp', 'FootterRoomUi/Left/buttonMoney/moneyLabel', 'cc.Label'],
            prefabBan: ['asset', 'assets/bacay/prefab/MocViTri.prefab'],
        },
    },
];

/**
 * Component còn THIẾU so với bản Go88, phải cắm thêm trước khi nối.
 *
 * Go88 vẽ avatar bằng script riêng của họ nên node `avr` chỉ có `cc.Button`, không có
 * `cc.Sprite`. Ta không chép script của họ, nên phải tự cắm chỗ để đặt ảnh vào.
 */
const THEM_COMPONENT = [
    {
        prefab: 'GheNguoiChoi',
        node: 'PlayerAvarta/AvartaMark/avr',
        loai: 'cc.Sprite',
        ly_do: 'Go88 vẽ avatar bằng script riêng; ta cần một Sprite để đặt ảnh vào',
    },
];

// ─────────────────────────────────────────────────────────────────────
// Tiện ích
// ─────────────────────────────────────────────────────────────────────

function doc(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

/** uuid của một asset, đọc từ `.meta` cạnh nó. */
function uuidCua(duongDan) {
    const meta = path.join(CLIENT, duongDan + '.meta');
    if (!fs.existsSync(meta)) throw new Error('không có .meta cho ' + duongDan);
    const m = doc(meta);
    if (!m.uuid) throw new Error('.meta không có uuid: ' + duongDan);
    return m.uuid;
}

/**
 * uuid ỔN ĐỊNH cho một script: có `.js.meta` rồi thì GIỮ NGUYÊN, chưa có thì sinh mới.
 *
 * 🔴 Sinh lại uuid mỗi lần chạy là đứt sạch tham chiếu trong mọi prefab, và đứt IM
 * LẶNG — đúng cái bẫy đã dính một lần ở `bundle.js`.
 */
const NHO_UUID = new Map();

function uuidScript(tuongDoi) {
    // Nhớ trong một lần chạy. Không nhớ thì ở chế độ `--kiem` (không ghi .meta) mỗi
    // lần gọi lại sinh một uuid khác, và tham chiếu chéo giữa hai script tự dưng lệch.
    if (NHO_UUID.has(tuongDoi)) return NHO_UUID.get(tuongDoi);

    const abs = path.join(SCRIPT, tuongDoi);
    if (!fs.existsSync(abs)) throw new Error('không có script ' + tuongDoi);
    const meta = abs + '.meta';
    if (fs.existsSync(meta)) {
        const m = doc(meta);
        if (m.uuid) { NHO_UUID.set(tuongDoi, m.uuid); return m.uuid; }
    }
    const u = P.uuid4();
    NHO_UUID.set(tuongDoi, u);
    if (!CHI_KIEM) fs.writeFileSync(meta, JSON.stringify(P.scriptMeta(u), null, 2) + '\n', 'utf8');
    return u;
}

/** Chỉ mục node theo đường dẫn tên, xử lý cả trùng tên bằng hậu tố '#n'. */
function chiMucNode(mang) {
    const conCua = new Map();
    const laCon = new Set();
    mang.forEach((x, i) => {
        if (x && x.__type__ === 'cc.Node') {
            const ids = (x._children || []).map((c) => c.__id__);
            conCua.set(i, ids);
            ids.forEach((k) => laCon.add(k));
        }
    });
    const goc = [...conCua.keys()].find((i) => !laCon.has(i));

    const duong = new Map();
    (function di(id, tien) {
        duong.set(tien, id);
        const dem = new Map();
        for (const c of conCua.get(id) || []) {
            const ten = mang[c]._name;
            const n = dem.get(ten) || 0;
            dem.set(ten, n + 1);
            const nhanh = tien ? tien + '/' + ten : ten;
            if (n === 0) duong.set(nhanh, c);
            duong.set((tien ? tien + '/' : '') + ten + '#' + n, c);
            di(c, nhanh + (n ? '#' + n : ''));
        }
    })(goc, '');

    return { goc, duong };
}

function timComponent(mang, nodeId, loai) {
    for (const c of mang[nodeId]._components || []) {
        if (mang[c.__id__] && mang[c.__id__].__type__ === loai) return c.__id__;
    }
    return -1;
}

/** Tên các @property khai trong một script Roy88 (`properties: { … }`). */
function propsCuaScript(tuongDoi) {
    const src = fs.readFileSync(path.join(SCRIPT, tuongDoi), 'utf8');
    const i = src.indexOf('properties:');
    if (i < 0) return [];

    // Quét cân bằng ngoặc từ dấu '{' đầu tiên sau `properties:`.
    const mo = src.indexOf('{', i);
    let sau = 0, ket = -1;
    for (let k = mo; k < src.length; k++) {
        if (src[k] === '{') sau++;
        else if (src[k] === '}') { sau--; if (!sau) { ket = k; break; } }
    }
    if (ket < 0) return [];

    const than = src.slice(mo + 1, ket);
    const ra = [];
    // Chỉ lấy khai báo ở MỨC NGOÀI CÙNG — bên trong `{ default: …, type: … }` cũng có
    // dấu hai chấm, đếm cả vào là ra property ma.
    let sau2 = 0;
    for (const dong of than.split('\n')) {
        const chu = dong.trim();
        const m = /^([A-Za-z_$][\w$]*)\s*:/.exec(chu);
        if (sau2 === 0 && m && !chu.startsWith('//')) ra.push(m[1]);
        for (const ch of chu) {
            if (ch === '{' || ch === '[') sau2++;
            else if (ch === '}' || ch === ']') sau2--;
        }
    }
    return ra;
}

// ─────────────────────────────────────────────────────────────────────
// Chạy
// ─────────────────────────────────────────────────────────────────────

function main() {
    const loi = [];
    const ghi = new Map();      // tên prefab → mảng đã vá
    const bao = [];

    // Gom việc theo prefab để một prefab chỉ đọc/ghi một lần.
    const theoPrefab = new Map();
    for (const g of GAN) {
        if (!theoPrefab.has(g.prefab)) theoPrefab.set(g.prefab, []);
        theoPrefab.get(g.prefab).push(g);
    }

    for (const [tenPrefab, viec] of theoPrefab) {
        const tep = path.join(PREFAB, tenPrefab + '.prefab');
        if (!fs.existsSync(tep)) { loi.push(`không có prefab ${tenPrefab}`); continue; }
        const a = doc(tep);

        // 1. Cắm component còn thiếu so với Go88.
        for (const t of THEM_COMPONENT.filter((x) => x.prefab === tenPrefab)) {
            const { duong } = chiMucNode(a);
            const id = duong.get(t.node);
            if (id === undefined) { loi.push(`${tenPrefab}: không có node "${t.node}"`); continue; }
            if (timComponent(a, id, t.loai) >= 0) continue;

            const comp = {
                __type__: t.loai,
                _name: '',
                _objFlags: 0,
                node: { __id__: id },
                _enabled: true,
                _materials: [{ __uuid__: P.MAT_SPRITE }],
                _srcBlendFactor: 770,
                _dstBlendFactor: 771,
                _spriteFrame: null,
                _type: 0,
                _sizeMode: 0,
                _fillType: 0,
                _fillCenter: { __type__: 'cc.Vec2', x: 0, y: 0 },
                _fillStart: 0,
                _fillRange: 0,
                _isTrimmedMode: true,
                _atlas: null,
                _id: '',
            };
            a.push(comp);
            const ci = a.length - 1;
            // Sprite phải đứng TRƯỚC Button để Button lấy nó làm target.
            a[id]._components = a[id]._components || [];
            a[id]._components.unshift({ __id__: ci });
            bao.push(`  + ${tenPrefab}/${t.node}: thêm ${t.loai} — ${t.ly_do}`);
        }

        // 2. Cắm node con dựng từ prefab khác (nếu có khai báo).
        for (const v of viec) {
            for (const con of v.themCon || []) {
                const { duong, goc } = chiMucNode(a);
                if (duong.has(con.ten)) continue;
                const u = uuidCua(con.tuPrefab);
                const nodeId = a.length;
                a.push({
                    __type__: 'cc.Node',
                    _name: con.ten,
                    _objFlags: 0,
                    _parent: { __id__: goc },
                    _children: [],
                    _active: true,
                    _components: [],
                    _prefab: { __id__: nodeId + 1 },
                    _opacity: 255,
                    _color: { __type__: 'cc.Color', r: 255, g: 255, b: 255, a: 255 },
                    _contentSize: { __type__: 'cc.Size', width: 0, height: 0 },
                    _anchorPoint: { __type__: 'cc.Vec2', x: 0.5, y: 0.5 },
                    _trs: { __type__: 'TypedArray', ctor: 'Float64Array',
                        array: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1] },
                    _eulerAngles: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 },
                    _is3DNode: false,
                    _groupIndex: 0,
                    groupIndex: 0,
                    _id: '',
                });
                a.push({ __type__: 'cc.PrefabInfo', root: { __id__: goc },
                    asset: { __uuid__: u }, fileId: P.fileId(), sync: false });
                a[goc]._children.push({ __id__: nodeId });
                bao.push(`  + ${tenPrefab}: cắm node "${con.ten}" từ ${path.basename(con.tuPrefab)}`);
            }
        }

        // 3. Gắn script + nối property.
        for (const v of viec) {
            const { duong } = chiMucNode(a);
            const chu = duong.get(v.node);
            if (chu === undefined) {
                loi.push(`${tenPrefab}: không có node "${v.node}" để gắn ${v.script}`);
                continue;
            }

            const uid = uuidScript(v.script);
            const cid = P.compressUuid(uid);

            // Đã gắn rồi thì thay tại chỗ, không chồng thêm bản thứ hai.
            let ci = (a[chu]._components || []).map((c) => c.__id__)
                .find((i) => a[i] && a[i].__type__ === cid);
            const moi = ci === undefined;
            if (moi) ci = a.length;

            const comp = {
                __type__: cid,
                _name: '',
                _objFlags: 0,
                node: { __id__: chu },
                _enabled: true,
            };

            const khaiBao = propsCuaScript(v.script);
            const thieu = [];

            for (const ten of khaiBao) {
                const nguon = v.props[ten];
                if (!nguon) { thieu.push(ten); continue; }

                let gt = null;
                try {
                    gt = giaiNguon(a, duong, nguon, tenPrefab);
                } catch (e) {
                    loi.push(`${tenPrefab}.${path.basename(v.script)}.${ten}: ${e.message}`);
                    continue;
                }
                comp[ten] = gt;
            }

            if (thieu.length) {
                loi.push(`${tenPrefab}.${path.basename(v.script)}: chưa nối ${thieu.join(', ')}`);
            }

            comp._id = '';
            if (moi) {
                a.push(comp);
                a[chu]._components = a[chu]._components || [];
                a[chu]._components.push({ __id__: ci });
            } else {
                a[ci] = comp;
            }
            bao.push(`  ✎ ${tenPrefab}/${v.node || '(gốc)'} ← ${v.script} (${khaiBao.length} property)`);
        }

        ghi.set(tep, a);
    }

    // ── CỔNG KIỂM ────────────────────────────────────────────────────
    console.log(bao.join('\n'));
    console.log();

    // Không còn cid script LẠ nào sót lại trong prefab.
    //
    // Đổi tên hay bỏ một script thì component cũ vẫn nằm nguyên trong prefab với cid
    // trỏ vào hư không. Cocos nạp lên chỉ bỏ qua, không kêu ca — và ta thì cứ tưởng
    // là đã gỡ sạch. Bắt ở đây.
    const biet = new Set([...NHO_UUID.values()].map((u) => P.compressUuid(u)));
    for (const [tep, a] of ghi) {
        for (const x of a) {
            const t = x && x.__type__;
            if (typeof t !== 'string') continue;
            if (t.startsWith('cc.') || t.startsWith('sp.') || t === 'TypedArray') continue;
            if (!biet.has(t)) {
                loi.push(`${path.basename(tep)}: còn component script lạ, cid ${t}`);
            }
        }
    }

    if (loi.length) {
        console.error(`❌ ${loi.length} vấn đề — KHÔNG ghi gì cả:`);
        for (const l of loi) console.error('   ' + l);
        console.error('\nMột @property chưa nối thì Cocos không báo lỗi, chỉ là null lúc chạy.');
        process.exit(1);
    }

    if (CHI_KIEM) {
        console.log('✅ Kiểm xong, mọi @property đều nối được. (--kiem nên không ghi)');
        return;
    }

    for (const [tep, a] of ghi) {
        fs.writeFileSync(tep, JSON.stringify(a, null, 2) + '\n', 'utf8');
    }
    console.log(`✅ Đã gắn script vào ${ghi.size} prefab, mọi @property đều nối tới thứ có thật.`);
}

/** Một mục trong `props` → giá trị đặt vào component. */
function giaiNguon(a, duong, nguon, tenPrefab) {
    const [kieu, x, y] = nguon;

    if (kieu === 'node') {
        const id = duong.get(x);
        if (id === undefined) throw new Error(`không có node "${x}" trong ${tenPrefab}`);
        return { __id__: id };
    }

    if (kieu === 'comp') {
        const id = duong.get(x);
        if (id === undefined) throw new Error(`không có node "${x}" trong ${tenPrefab}`);
        const loai = y.startsWith('script:') ? P.compressUuid(uuidScript(y.slice(7))) : y;
        const ci = timComponent(a, id, loai);
        if (ci < 0) throw new Error(`node "${x}" không có ${y}`);
        return { __id__: ci };
    }

    if (kieu === 'asset') return { __uuid__: uuidCua(x) };

    if (kieu === 'assets') return x.map((p) => ({ __uuid__: uuidCua(p) }));

    throw new Error('kiểu nguồn lạ: ' + kieu);
}

main();
