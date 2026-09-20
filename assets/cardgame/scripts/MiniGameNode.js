'use strict';
// ============================================================================
// LỚP GIẢ — CHO RỖNG (no-op)
//
// Vì sao rỗng: `MiniGameNode` là node bền (persist root) của SẢNH Go88 — nó chứa nút nổi
// mini game, Tài Xỉu Live, marquee BroadCast, và đo lại vị trí mấy thứ đó theo từng scene.
// Bê thẳng thì kéo theo ~553 script (đo bằng bao-dong.js) và mở WebSocket sang hạ tầng
// Go88. Roy88 đã có sảnh riêng, Ba Cây không cần nút nổi mini game → cắt hẳn.
//
// Tệp vẫn phải tồn tại vì 3 script đã bê `require` nó và đọc `.default.instance`.
// ============================================================================

Object.defineProperty(exports, '__esModule', { value: true });

var MiniGameNode = (function () {
    function MiniGameNode() {
        this._topUI = null;
    }

    // Code đã bê đọc bằng `.default.instance`, KHÔNG phải getInstance().
    // Bắt buộc khác null: HeaderUi.js:583 và :587 viết thẳng
    //   `g.default.instance.node.parent = m.default.instance.topUI;`
    // mà chỉ bọc trong điều kiện `BroadCast.instance != null`, không kiểm tra MiniGameNode.
    Object.defineProperty(MiniGameNode, 'instance', {
        get: function () {
            if (null === this._instance) {
                this._instance = new MiniGameNode();
            }
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });

    // Bản gốc: `topUI` là `@property(cc.Node)` — lớp UI trên cùng của node bền MiniGameNode,
    // dùng làm CHỖ ĐỖ cho marquee BroadCast khi HeaderUi tắt (HeaderUi.onDisable).
    // Ta không bê prefab MiniGameNode nên phải tự tạo một node rỗng làm chỗ đỗ.
    // KHÔNG gắn vào scene của Roy88: node đỗ vốn dĩ đang ẩn (bản gốc gọi `hide(true)` ngay
    // trước khi đổi parent), gắn vào scene chỉ thêm rác. Quan trọng là KHÁC null — gán
    // `parent = null` sẽ móc node BroadCast ra khỏi cây và làm nó mất hẳn.
    // Ghi chú: trong lát cắt Ba Cây hiện tại không prefab nào gắn script BroadCast
    // (đã dò uuid 46c538c3… trong go88_caorua + go88_cardcore: không có), nên nhánh này
    // thực tế chưa chạy tới. Vẫn để cho đúng hợp đồng.
    Object.defineProperty(MiniGameNode.prototype, 'topUI', {
        get: function () {
            if (null === this._topUI || !cc.isValid(this._topUI)) {
                this._topUI = new cc.Node('MiniGameNodeTopUI');
            }
            return this._topUI;
        },
        enumerable: true,
        configurable: true
    });

    // Bản gốc: dời nút nổi mini game theo scene hiện tại (btnButtonIcon.x/y).
    // Không có nút nổi ⇒ không có gì để dời.
    // Chỗ gọi thật: MainGameViewModel.js:95, :258, :276 (đều có kiểm tra null trước).
    MiniGameNode.prototype.updatePositionByState = function () {};

    // Bản gốc: đưa node BroadCast vào `HeaderUi.nodeBroadcast` rồi đặt về (0,0).
    // Thân hàm gốc đã bị chặn bởi `null != this.broadCast` — mà `broadCast` đến từ prefab
    // MiniGameNode (ta không bê) nên bản gốc cũng sẽ không làm gì. Để rỗng là chép đúng.
    // Chỗ gọi thật: BroadCast.js:174 (có kiểm tra null trước).
    MiniGameNode.prototype.updateBroadCastPosition = function () {};

    MiniGameNode._instance = null;
    return MiniGameNode;
})();

exports.default = MiniGameNode;
