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
}


def so(chuoi):
    return [float(x) for x in re.findall(r"-?\d+(?:\.\d+)?", chuoi or "")]


def doc_plist(path):
    """Trả {tên frame: thông số}. Chỉ đọc khối <key>frames</key>."""
    xml = io.open(path, encoding="utf-8").read()
    dau = xml.index("<key>frames</key>")
    than = xml[dau:]

    ra = {}
    for m in re.finditer(r"<key>([^<]+)</key>\s*<dict>(.*?)</dict>", than, re.S):
        ten, body = m.group(1), m.group(2)
        if "<key>frame</key>" not in body:
            break

        def lay(k):
            mm = re.search(rf"<key>{k}</key>\s*<string>([^<]*)</string>", body)
            return mm.group(1) if mm else None

        f = so(lay("frame"))
        off = so(lay("offset")) or [0, 0]
        src = so(lay("sourceSize")) or [f[2], f[3]]
        ra[ten] = {
            "x": int(f[0]), "y": int(f[1]), "w": int(f[2]), "h": int(f[3]),
            "offX": off[0], "offY": off[1],
            "srcW": int(src[0]), "srcH": int(src[1]),
            "rotated": bool(re.search(r"<key>rotated</key>\s*<true\s*/>", body)),
        }
    return ra


def anh_cua_plist(plist_path):
    xml = io.open(plist_path, encoding="utf-8").read()
    m = re.search(r"<key>textureFileName</key>\s*<string>([^<]+)</string>", xml)
    if not m:
        raise SystemExit(f"Plist không khai textureFileName: {plist_path}")
    return os.path.join(os.path.dirname(plist_path), m.group(1))


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

            # 1. Cắt ô trong atlas. Khi xoay, w/h trong plist là chiều ĐÃ xoay.
            w, h = (f["h"], f["w"]) if f["rotated"] else (f["w"], f["h"])
            o = sheet.crop((f["x"], f["y"], f["x"] + (f["w"] if not f["rotated"] else f["w"]),
                            f["y"] + (f["h"] if not f["rotated"] else f["h"])))

            # 2. Xoay lại nếu atlas đã xoay đi.
            if f["rotated"]:
                o = o.rotate(90, expand=True)

            # 3. Dán vào khung gốc để khôi phục phần trong suốt đã bị cắt cụt.
            khung = Image.new("RGBA", (f["srcW"], f["srcH"]), (0, 0, 0, 0))
            x = int(round((f["srcW"] - o.width) / 2 + f["offX"]))
            y = int(round((f["srcH"] - o.height) / 2 - f["offY"]))
            khung.paste(o, (x, y))

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
