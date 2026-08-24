
cc.Class({
    extends: cc.Component,

    properties: {
        header: cc.Node,
        body:   cc.Node,
    },
    onLoad () {
    },
    onEnable: function () {
        //Sang nut mac dinh khi group hien ra: uu tien sub-tab co body dang active, ko thi nut dau tien
        if (!this.header || this.header.children.length === 0) return;
        let defName = this.header.children[0].name;
        if (this.body) {
            let act = this.body.children.find(c => c.active);
            if (act) defName = act.name;
        }
        this.applySelect(defName);
    },
    onSelectType: function(event) {
        this.applySelect(event.target.name);
    },
    //Sang/toi cac nut tab theo ten dang chon. Nut co LodeTabButton -> doi anh on/off; ko thi doi opacity.
    applySelect: function(name) {
        if (this.header) this.header.children.forEach(function(obj){
            let selected = (obj.name === name);
            let tabBtn = obj.getComponent('LodeTabButton');
            if (tabBtn) {
                tabBtn.setSelected(selected);
                obj.opacity = 255;
            } else {
                obj.opacity = selected ? 255 : 99;
            }
            if (selected) { obj.pauseSystemEvents(); } else { obj.resumeSystemEvents(); }
        });
        //body (form con) co the da bi xoa khi dung 1 panel bet chung -> guard null
        if (this.body) this.body.children.forEach(function(obj){
            obj.active = (obj.name === name);
        });
    },
});
