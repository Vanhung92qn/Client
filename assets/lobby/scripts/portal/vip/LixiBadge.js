/**
 * LixiBadge — icon li xi o lobby. Mot component, HAI che do.
 *
 * Lobby co hai nut vi hai he li xi khac nhau ve ban chat:
 *
 *   MODE.GOLDEN    'btnHongBao' — khung gio vang.
 *                  LUON HIEN. Nguoi choi vao xem gio phat, doc luat, canh
 *                  san truoc gio. Do chinh la muc dich cua khung gio vang:
 *                  giau nut di thi khong ai biet ma canh.
 *                  Cham do chi sang khi dot dang mo va minh chua lay.
 *
 *   MODE.PERSONAL  nut moi — li xi thang ngay 18 + qua CSKH gui tay.
 *                  CHI HIEN khi that su co hong bao dang cho mo. Do la qua
 *                  RIENG cua tung nguoi; hien nut cho nguoi khong co gi thi
 *                  ho bam vao roi thay trong.
 *                  Cham do hien SO hong bao dang cho.
 *
 * Tach hai che do thay vi viet hai file: phan hoi server, nhip hoi, hieu
 * ung rung deu giong het nhau — chi khac dieu kien hien va noi dung badge.
 */

'use strict';

const LixiService = require('LixiService');
const LixiModel = require('LixiModel');
const VipPopups = require('VipPopups');

/** Nhip hoi luc binh thuong (giay). */
const POLL_IDLE = 60;
/** Nhip hoi khi dang co dot gio vang (giay). */
const POLL_ACTIVE = 10;

/** Hai che do — xem chu thich dau file. */
const MODE = cc.Enum({
  GOLDEN: 0,
  PERSONAL: 1,
});

module.exports = cc.Class({
  extends: cc.Component,

  statics: { MODE },

  properties: {
    /**
     * Nut nay phuc vu he nao.
     * GOLDEN   khung gio vang, luon hien
     * PERSONAL li xi thang + qua CSKH, chi hien khi co
     */
    mode: {
      default: MODE.GOLDEN,
      type: MODE,
    },

    /** Vong tron do hien so hong bao dang cho. */
    nodeBadge: cc.Node,
    lbBadge: cc.Label,
    /** Nhan "Đang phát" khi co dot gio vang. */
    nodeHot: cc.Node,
    /**
     * Node THAT SU duoc bat/tat va bat su kien cham.
     *
     * 🔴 BAT BUOC dat khi che do PERSONAL (nut tu an khi khong co gi).
     *
     * Ly do: Cocos KHONG goi onLoad/onEnable cua component nam tren node
     * dang inactive. Neu component tu tat chinh node cua no thi lan sau no
     * khong con chay de bat lai — nut bien mat vinh vien, va khong co lay
     * mot dong log nao vi ham poll chua bao gio duoc goi.
     *
     * Cach dung: gan component len mot node BOC luon active, tro
     * nodeTarget toi nut that ben trong.
     *
     * De trong thi dung chinh node mang component — chi an toan khi node
     * do luon active (che do GOLDEN).
     */
    nodeTarget: cc.Node,

    /**
     * Bam vao icon co tu mo popup Li xi khong.
     * Tat di neu nut da co su kien click khac trong scene.
     */
    autoOpenPopup: true,

    /**
     * Tu an nut khi khong co hong bao nao.
     *
     * MAC DINH TAT — nut luon hien, badge van chay binh thuong. Nhu vay
     * moi nguoi deu thay co tinh nang li xi va bam vao xem duoc gio phat,
     * thay vi khong bao gio biet no ton tai.
     *
     * Bat len thi nut chi hien khi that su co hong bao — lobby gon hon
     * nhung nguoi choi moi se khong biet co tinh nang nay.
     */
    autoHide: false,
  },

  /** Node duoc bat/tat va nhan su kien cham. Xem chu thich nodeTarget. */
  _target() {
    return (this.nodeTarget && this.nodeTarget.isValid) ? this.nodeTarget : this.node;
  },

  onLoad() {
    this._summary = null;
    this._pollSec = POLL_IDLE;

    const target = this._target();

    // Canh bao som thay vi de nguoi sau ngoi do ma khong hieu vi sao nut
    // khong bao gio hien: component nam tren chinh node no se tat.
    if (this.autoHide && target === this.node) {
      cc.warn('[LixiBadge] autoHide bat nhung nodeTarget de trong — '
        + 'component se tu tat node cua chinh no va khong bao gio chay lai. '
        + 'Hay gan component len node boc luon active roi tro nodeTarget toi nut.');
    }

    if (this.autoHide) {
      target.active = false;
    }

    // Bat cham tren NUT THAT, khong phai node boc: node boc khong co hinh
    // gi nen cham vao no la cham vao khoang trong
    if (this.autoOpenPopup) {
      target.on(cc.Node.EventType.TOUCH_END, this._open, this);
    }

    /* Nap truoc popup va anh cua no ngay khi vao lobby.

       Anh cua cac popup nay chua tung xuat hien o dau trong game nen lan
       dau mo Cocos phai di tai tung cai — chu ve ngay con anh ve sau,
       nhin nhu man hinh vo. Nap truoc luc lobby ranh thi toi luc bam moi
       thu da nam san trong bo nho dem.

       Hoan mot nhip de khong tranh bang thong voi thu can gap hon khi
       lobby vua mo.                                                     */
    this.scheduleOnce(() => {
      VipPopups.preload(this.mode === MODE.PERSONAL ? VipPopups.ID.LIXI_MINE : VipPopups.ID.LIXI);
      VipPopups.preload(VipPopups.ID.LIXI_OPEN);
    }, 2);
  },

  onEnable() {
    cc.log(`[LixiBadge] onEnable mode=${this._modeName()} target=${this._target().name}`);
    this._poll();
    this.schedule(this._poll, this._pollSec);

    // Mo hong bao xong thi biet ngay, khong phai cho toi nhip hoi ke tiep
    // (toi 60 giay) — luc do nut con nam do voi cham do trong khi tui da
    // rong, nhin nhu he thong dung hinh
    LixiService.onChanged(this._poll, this);
  },

  onDisable() {
    this.unschedule(this._poll);
    LixiService.offChanged(this._poll, this);
  },

  _modeName() {
    return this.mode === MODE.PERSONAL ? 'PERSONAL' : 'GOLDEN';
  },

  _poll() {
    LixiService.getSummary()
      .then((raw) => {
        if (!this.node || !this.node.isValid) return;
        this._summary = LixiModel.parseSummary(raw);

        // Log gon nhung du de chan doan tu F12 ma khong phai doc code:
        // thay ngay server tra gi va nut se hien hay khong
        const s = this._summary;
        cc.log(`[LixiBadge:${this._modeName()}] enabled=${s.enabled} `
          + `personal=${s.personalCount} pending=${s.pendingCount} `
          + `canGrab=${s.canGrab} nextGolden=${s.nextGoldenHour}h`);

        this._render();
        this._retune();

        cc.log(`[LixiBadge:${this._modeName()}] -> nut ${this._target().active ? 'HIEN' : 'an'}`);
      })
      .catch((err) => {
        // Khong dam popup loi vao mat nguoi choi moi phut mot lan chi vi
        // mang chap chon — nhung phai co log, neu khong thi luc hong se
        // khong con manh moi nao de lan.
        cc.warn('[LixiBadge] goi GetSummary that bai:', err.message);
      });
  },

  /**
   * Doi nhip hoi cho khop tinh hinh: dang co dot gio vang thi hoi day hon
   * vi so hong bao con lai tut rat nhanh, con so con lai hien sai thi
   * nguoi choi bam vao roi hut.
   */
  _retune() {
    const s = this._summary;

    // Chi che do GOLDEN moi can hoi day: so hong bao con lai tut rat nhanh
    // trong 15 phut do. Qua rieng thi ca ngay khong doi, hoi day chi ton
    // bang thong.
    const want = (this.mode === MODE.GOLDEN && s && s.activeCampaignId > 0 && s.activeRemain > 0)
      ? POLL_ACTIVE
      : POLL_IDLE;

    if (want === this._pollSec) return;

    this._pollSec = want;
    this.unschedule(this._poll);
    this.schedule(this._poll, want);
  },

  _render() {
    const s = this._summary;

    if (this.mode === MODE.PERSONAL) {
      this._renderPersonal(s);
      return;
    }
    this._renderGolden(s);
  },

  /**
   * Khung gio vang: nut luon o do, cham do chi sang khi dang phat va minh
   * chua lay. Da lay roi thi tat cham do — khong con viec gi de nhac.
   */
  _renderGolden(s) {
    const target = this._target();
    if (!s || !s.enabled) {
      if (this.autoHide) target.active = false;
      else if (this.nodeBadge) this.nodeBadge.active = false;
      return;
    }

    const first = !target.active;
    target.active = true;

    // Cham do khong hien SO o che do nay: dot gio vang la chuyen chung cua
    // ca phong, con so "1" chang noi len dieu gi
    if (this.nodeBadge) this.nodeBadge.active = s.canGrab;
    if (this.lbBadge) this.lbBadge.node.active = false;
    if (this.nodeHot) this.nodeHot.active = s.canGrab;

    // Chi rung luc VUA co gi de nhac, khong rung moi nhip hoi — rung lien
    // tuc thanh phien nhieu chu khong con la loi nhac
    if (s.canGrab && (first || !this._wasHot)) this._attract();
    this._wasHot = s.canGrab;
  },

  /**
   * Li xi rieng: khong co gi thi AN HAN nut di, du autoHide tat.
   *
   * Khac che do GOLDEN o cho nay: nut khung gio vang con ly do de nam do
   * (cho nguoi choi biet gio phat ma canh), con nut qua rieng thi khong —
   * bam vao chi thay danh sach trong.
   */
  _renderPersonal(s) {
    const target = this._target();
    const count = s ? s.personalCount : 0;

    if (!s || !s.enabled || count <= 0) {
      target.active = false;
      this._wasHot = false;
      return;
    }

    const first = !target.active;
    target.active = true;

    if (this.nodeBadge) {
      this.nodeBadge.active = true;
      if (this.lbBadge) {
        this.lbBadge.node.active = true;
        this.lbBadge.string = count > 99 ? '99+' : String(count);
      }
    }
    if (this.nodeHot) this.nodeHot.active = false;

    if (first) this._attract();
    this._wasHot = true;
  },

  _attract() {
    const target = this._target();
    if (!target || !target.isValid) return;
    target.stopAllActions();
    const s = target.scale;
    cc.tween(target)
      .to(0.12, { scale: s * 1.18 })
      .to(0.10, { scale: s * 0.94 })
      .to(0.08, { scale: s })
      .start();
  },

  _open() {
    const id = this.mode === MODE.PERSONAL
      ? VipPopups.ID.LIXI_MINE
      : VipPopups.ID.LIXI;

    VipPopups.open(id).catch((err) => {
      cc.warn('[LixiBadge] Khong mo duoc popup:', err.message);
    });
  },

  onDestroy() {
    this._summary = null;
  },
});
