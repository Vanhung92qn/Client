const { ccclass, property } = cc._decorator;

/**
 * PhoenixSmokeTest — component kiem dinh dang prefab sinh bang code.
 * Xoa sau khi qua duoc CHECKPOINT 1. Khong phai code cua game.
 */
@ccclass
export default class PhoenixSmokeTest extends cc.Component {

    @property(cc.Label)
    lbDynamic: cc.Label = null;

    @property(sp.Skeleton)
    spFeather: sp.Skeleton = null;

    /** Dau ban dung — tang tay moi lan sua, de biet Cocos dang doc ban nao. */
    public static BUILD: string = 'B0-002';

    onLoad() {
        cc.log('[PHX-SMOKE] onLoad OK, build=' + PhoenixSmokeTest.BUILD);

        if (this.lbDynamic) {
            // font_money_3 chi co 21 glyph: so + dau phan cach. Du cho chuoi nay.
            this.lbDynamic.string = '1.234.567';
        } else {
            cc.error('[PHX-SMOKE] lbDynamic = NULL -> bind @property HONG');
        }

        if (this.spFeather) {
            // Doi dong tac luc chay. Neu _cacheMode khac 0 thi lenh nay chet cam.
            this.spFeather.setAnimation(0, 'active_idle', true);
            cc.log('[PHX-SMOKE] spFeather -> active_idle');
        } else {
            cc.error('[PHX-SMOKE] spFeather = NULL -> bind spine HONG');
        }
    }
}
