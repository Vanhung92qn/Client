// PhoenixMeteorFall - cho node thien thach BAY tu goc man hinh xuong (spine chi choi "roi" tai cho).
// Gan len node thien thach (spine). Lap: dat o startPos -> tween toi endPos trong fallDuration ->
// an di -> cho ngau nhien [minInterval,maxInterval]s -> lai roi. startPos/endPos chinh trong editor.

cc.Class({
    extends: cc.Component,

    properties: {
        startPos: { default: new cc.Vec2(720, 340), tooltip: 'diem xuat phat = goc phai-tren (b)' },
        endPos: { default: new cc.Vec2(60, -200), tooltip: 'diem ket thuc = giua-duoi (roi ve phia phuong 130,-100)' },
        fallDuration: 1.1,
        minInterval: 3,
        maxInterval: 7,
        autoStart: true,
    },

    onLoad: function () {
        this.node.active = false;
        if (this.autoStart) this.scheduleOnce(this._fall.bind(this), 1.2);
    },

    _fall: function () {
        var self = this;
        this.node.setPosition(this.startPos.x, this.startPos.y);
        this.node.active = true;
        cc.tween(this.node)
            .to(this.fallDuration, { position: cc.v3(this.endPos.x, this.endPos.y, 0) }, { easing: 'sineIn' })
            .call(function () {
                self.node.active = false;
                var wait = self.minInterval + Math.random() * Math.max(0, self.maxInterval - self.minInterval);
                self.scheduleOnce(self._fall.bind(self), wait);
            })
            .start();
    },

    // goi tu ngoai neu muon ep 1 lan roi (vd luc phuong bay)
    fallNow: function () {
        this.unscheduleAllCallbacks();
        this._fall();
    },
});
