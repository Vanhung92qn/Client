"""cut-frames.py — cắt ĐÚNG những frame cần dùng ra khỏi atlas dùng chung của Go88.

VÌ SAO KHÔNG CHÉP CẢ ATLAS
Hai atlas dùng chung của Go88 nặng 2,8 MB và chứa hơn 100 frame, trong khi bàn Cào Rùa
chỉ dùng 13 cái. Chép cả vào là lặp đúng cái bệnh mà phiên làm Phoenix vừa đo được:
61% dung lượng bundle cũ của họ không prefab nào tham chiếu.

Cắt riêng thì bundle giữ nguyên kỷ luật "mỗi tệp phải có lý do", và ảnh rời cũng dễ
thay sau này hơn là sửa một ô trong atlas.

⚠ BA CHỖ DỄ SAI, đều không báo lỗi mà chỉ hiện sai:
1. `rotated` — cocos2d-x xoay ảnh 90° NGƯỢC chiều kim đồng hồ khi xếp vào atlas để
   tiết kiệm chỗ. Cắt ra mà quên xoay lại là ảnh nằm ngang.
2. `sourceColorRect`/`offset` — ảnh bị CẮT CỤT phần trong suốt quanh viền. Muốn khôi
   phục đúng kích thước gốc thì phải dán lại vào khung `sourceSize` đúng vị trí, nếu
   không mọi toạ độ căn theo tâm đều lệch.
3. Hệ toạ độ: plist đếm y từ TRÊN xuống, giống Pillow — chỗ này may là trùng nhau.

Chạy:  python tools/bacay/cut-frames.py
"""

import io
import json
import os
import plistlib
import re
import sys

from PIL import Image

GO88 = r"C:\Reverse\go88_reverse\assets"
RA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "assets", "bacay", "ui")

# frame cần cắt → tên tệp mới. Đọc từ frames.json thì tiện hơn, nhưng khai tường minh
# ở đây để biết CHÍNH XÁC cái gì vào bundle, đúng kỷ luật của bundle.js.
CAN_CAT = {
    "_shared/plist/atlas_79338b97.plist": {
        "icChatRoom": None,                    # None = giữ nguyên tên
        "icExit_2": None,
        "borderLoadingTableHide": None,
        "borderLoadingTable": None,
        "txtPhong": None,
        "txtCUoc": None,
        "txtVanChoi": None,
        "icQuanBai": None,
        "loadingTable": None,
        "borderLoadingBattle": None,
        "icLoadingBattle": None,
        "btnDanhbai": None,
        "borderThangSapLang": None,
        "icTinhChi": None,
        "icInfoUser": None,
        "boderInfo": None,
        "icHeadChat": None,
        "icBodychat": None,
        "icPlus02": None,
        "boderAvatar02": None,
    },
    "_shared/plist/atlas_826aa8f8.plist": {
        "icCheck02": None,
        "borderCheck02_2": None,
        "boderAvatar": None,
        "efLoadingBar": None,
        "icMoney": None,
        "btnMoney": None,
    },
    "_shared/plist/atlas_0b1f9c46.plist": {
        "boderFooterLeft": None,
        "boderFooterRight": None,
        "borderLeft": None,
        "borderMask": None,
        "iConNews": None,
        "icChoiNhanh": None,
        "icHuongDan": None,
        "icRank": None,
        "icTaoBan": None,
        "txtChoiNhanh": None,
        "txtTaoBan": None,
        # ── dòng bàn trong sảnh (IconBanCHoiXocdia) ──
        "roomThuongXD": None,
        "loadingonline": None,
        "loadingBanChung": None,
        "icClock": None,
    },
    "_shared/plist/atlas_eaf90a0b.plist": {
        "bg": "lobby_bg",
    },
    "_shared/plist/atlas_80971fb1.plist": {
        "icoAvatar": None,
    },
}


def so(chuoi):
    return [float(x) for x in re.findall(r"-?\d+(?:\.\d+)?", chuoi or "")]


def doc_plist(path):
    """Trả {tên frame: thông số}.

    🔴 DÙNG plistlib CHỨ KHÔNG TỰ PARSE BẰNG REGEX.

    Bản đầu tôi tự bắt cặp `<key>…</key><dict>…</dict>` bằng regex không tham lam.
    Nó dừng GIỮA CHỪNG khi gặp `<dict>` lồng nhau, và hậu quả là im lặng: những frame
    nằm sau chỗ vỡ đơn giản không tồn tại. `boderFooterLeft` cắt được, `boderFooterRight`
    thì không, dù cả hai nằm cạnh nhau trong cùng một tệp.

    May là bộ sinh prefab bắt được ("thiếu asset"), chứ nếu tôi không có chốt đó thì
    sảnh sẽ thiếu đúng một viền và chẳng ai biết vì sao.
    """
    with open(path, "rb") as f:
        goc = plistlib.load(f)

    ra = {}
    for ten, f in (goc.get("frames") or {}).items():
        fr = so(f.get("frame"))
        off = so(f.get("offset")) or [0, 0]
        src = so(f.get("sourceSize")) or [fr[2], fr[3]]
        ra[ten] = {
            "x": int(fr[0]), "y": int(fr[1]), "w": int(fr[2]), "h": int(fr[3]),
            "offX": off[0], "offY": off[1],
            "srcW": int(src[0]), "srcH": int(src[1]),
            "rotated": bool(f.get("rotated") or f.get("textureRotated")),
        }

    if not ra:
        raise SystemExit(f"Plist không có frame nào: {path}")

    # 🔴 ĐỐI CHỨNG ĐỘC LẬP — đừng tin một mình bộ parse của mình.
    #
    # plistlib đáng tin hơn regex nhiều, nhưng "đáng tin hơn" không phải "chắc chắn".
    # Nên đếm lại số frame bằng một cơ chế KHÁC HẲN: đọc thô văn bản và đếm thẻ <key>
    # trong khối frames. Hai cách đọc độc lập cùng một tệp, lệch nhau là dừng.
    #
    # Vì sao cần: lỗi regex trước đó lộ ra chỉ nhờ may — hai frame nằm cạnh nhau mà
    # một cái mất. Nếu lần sau mất đúng một cái ở GIỮA thì không có gì gợi ý cả.
    # (Ý này do phiên làm Phoenix đề xuất sau khi nghe chuyện regex.)
    tho = io.open(path, encoding="utf-8").read()
    dau = tho.index("<key>frames</key>")
    cuoi = tho.index("<key>metadata</key>") if "<key>metadata</key>" in tho[dau:] else len(tho)
    if cuoi < dau:
        cuoi = len(tho)
    dem_tho = tho[dau:cuoi].count("<key>") - 1        # trừ chính thẻ <key>frames</key>

    # Mỗi frame có 1 khoá tên + các khoá thuộc tính bên trong, nên đếm thô sẽ LỚN HƠN.
    # Điều phải đúng là: số frame plistlib đọc được KHÔNG được nhỏ hơn số tên frame thật.
    ten_tho = set(re.findall(r"<key>([^<]+)</key>\s*<dict>", tho[dau:cuoi]))
    ten_tho -= {"frames", "metadata"}      # hai khoá cấp trên, không phải frame
    thieu = ten_tho - set(ra)
    if thieu:
        raise SystemExit(
            f"ĐỐI CHỨNG LỆCH ở {os.path.basename(path)}: đọc thô thấy {len(ten_tho)} frame, "
            f"plistlib trả {len(ra)}. Thiếu: {sorted(thieu)[:8]}")

    return ra


def anh_cua_plist(plist_path):
    with open(plist_path, "rb") as f:
        meta = (plistlib.load(f).get("metadata") or {})
    ten = meta.get("textureFileName") or meta.get("realTextureFileName")
    if not ten:
        raise SystemExit(f"Plist không khai textureFileName: {plist_path}")
    return os.path.join(os.path.dirname(plist_path), ten)


def main():
    os.makedirs(RA, exist_ok=True)
    tong = 0
    thieu = []

    for rel_plist, danh_sach in CAN_CAT.items():
        plist = os.path.join(GO88, rel_plist.replace("/", os.sep))
        frames = doc_plist(plist)
        sheet = Image.open(anh_cua_plist(plist)).convert("RGBA")

        for ten, ten_moi in danh_sach.items():
            if ten not in frames:
                thieu.append(f"{ten}  (trong {rel_plist})")
                continue

            f = frames[ten]

            # 1. Cắt ô trong atlas.
            #
            # 🔴 KHI XOAY: `frame` khai kích thước LOGIC (bằng sourceSize), còn vùng THẬT
            # nằm trong atlas thì HOÁN NGƯỢC w/h. Cắt theo w/h khai báo là cắt sai vùng —
            # ảnh ra đúng khung nhưng nội dung chỉ còn một dải hẹp ở giữa.
            # Đo thật: icTaoBan khung 68x37, vùng có pixel chỉ (16,0)-(53,37), rộng 37
            # thay vì 68. Nhìn thì "có ảnh" nên rất dễ cho qua.
            cw, ch = (f["h"], f["w"]) if f["rotated"] else (f["w"], f["h"])
            o = sheet.crop((f["x"], f["y"], f["x"] + cw, f["y"] + ch))

            # 2. Xoay lại. cocos2d-x xếp ảnh vào atlas bằng cách xoay THEO CHIỀU KIM ĐỒNG
            # HỒ, nên khôi phục là xoay NGƯỢC chiều — đúng chiều dương của Pillow.
            if f["rotated"]:
                o = o.rotate(90, expand=True)

            # 3. Dán vào khung gốc để khôi phục phần trong suốt đã bị cắt cụt.
            khung = Image.new("RGBA", (f["srcW"], f["srcH"]), (0, 0, 0, 0))
            x = int(round((f["srcW"] - o.width) / 2 + f["offX"]))
            y = int(round((f["srcH"] - o.height) / 2 - f["offY"]))
            khung.paste(o, (x, y))

            # 🔴 CHỐT: frame không bị cắt cụt (sourceColorRect == sourceSize) thì ảnh
            # khôi phục phải LẤP ĐẦY khung. Không đầy nghĩa là cắt sai vùng.
            if o.size != (f["srcW"], f["srcH"]):
                thieu.append(f"{ten}: cắt ra {o.size}, đáng lẽ {(f['srcW'], f['srcH'])}")
                continue

            ra = os.path.join(RA, (ten_moi or ten) + ".png")
            khung.save(ra, "PNG", optimize=True)
            tong += 1
            print(f"  {ten:<26} {f['srcW']}x{f['srcH']}" + ("  (đã xoay lại)" if f["rotated"] else ""))

    if thieu:
        print("\n❌ Không tìm thấy trong atlas:", file=sys.stderr)
        for t in thieu:
            print("   " + t, file=sys.stderr)
        sys.exit(1)

    byte = sum(os.path.getsize(os.path.join(RA, f)) for f in os.listdir(RA) if f.endswith(".png"))
    print(f"\nCắt {tong} frame, {byte // 1024} KB — thay vì kéo cả 2.800 KB atlas dùng chung.")


if __name__ == "__main__":
    main()
