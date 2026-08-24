/**
 * Created by Nofear on 3/15/2019.
 */

/**
    Draw tu phai qua trai
    Draw tu duoi len tren
 */


(function () {
    cc.ChickenFightGraphCatCauView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeParent: cc.Node,
            nodeDragonTemp: cc.Node,
            nodePhonixTemp: cc.Node,
            nodeTieTemp: cc.Node,

            sfTaiXiu: [cc.SpriteFrame],
        },

        onLoad: function () {
            this.rootPosX = -5; //toa do goc
            this.rootPosY = 107; //toa do goc
            this.spaceX = 17.5;
            this.spaceY = 20;

            this.maxItemPerCol = 10;
        },

        convertToMatrix: function (list) {
            var self = this;
            //luu lai side dau tien
            var currentSide = list[0].GateId;
            var matrix = [];
            var arrCols = [];
            list.forEach(function (item) {
                if (arrCols.length === self.maxItemPerCol) {
                    //du 6 thi dua vao matrix + chuyen sang cot khac
                    matrix.push(arrCols);
                    //reset cols
                    arrCols = [];
                    //push vao cols
                    arrCols.push(item);
                    //set lai currentSide
                    currentSide = item.GateId;
                } else if (item.GateId === currentSide || item.GateId == cc.ChickenFightBetSide.TIE || item.GateId == cc.ChickenFightBetSide.BIG_TIE ) {
                    //giong thi them vao
                    arrCols.push(item);
                } else {
                    //khac thi push vao matrix + reset cols
                    matrix.push(arrCols);
                    //reset cols
                    arrCols = [];
                    //set lai currentSide
                    currentSide = item.GateId;
                    //push vao cols
                    arrCols.push(item);
                }
            });

            //push arr cuoi vao matrix
            matrix.push(arrCols);

            return matrix;
        },

        draw: function (list) {
            this.resetDraw();
            if (!list || list.length === 0) return;   // FIX: tránh convertToMatrix đọc list[0].GateId khi rỗng
            var matrix = this.convertToMatrix(list);
            for (var i = 0; i < matrix.length; i++) {
                this.drawCol(matrix[i], i);
            }
            this.nodeParent.width = Math.max(matrix.length * 10, 782);
        },

        drawCol: function (cols, colIndex) {
            //vi tri X
            var posX = this.rootPosX - (colIndex * this.spaceX);
            //toa do Y bat dau ve
            // var starY = this.rootPosY + (this.maxItemPerCol - cols.length) * this.spaceY;
            var posY = this.rootPosY + this.spaceY;

            for (var i = 0; i < cols.length; i++) {
                if(cols[i].GateId != cc.ChickenFightBetSide.TIE && cols[i].GateId != cc.ChickenFightBetSide.BIG_TIE) {
                    posY -= this.spaceY;
                }

                this.createNode(cols[i], cc.v2(posX, posY));
            }
        },

        createNode: function (item, pos) {
            if (item.GateId === cc.ChickenFightBetSide.DRAGON) {
                var nodeView = cc.instantiate(this.nodeDragonTemp);
            } else if (item.GateId === cc.ChickenFightBetSide.PHONIX) {
                var nodeView = cc.instantiate(this.nodePhonixTemp);
            } else {
                nodeView = cc.instantiate(this.nodeTieTemp);
            }
            nodeView.parent = this.nodeParent;
            nodeView.position = pos;
            //nodeView.getComponent(cc.Sprite).spriteFrame = this.sfTaiXiu[item.DiceSum - 3];
            // nodeView.getComponentInChildren(cc.Label).string = item.DiceSum;
        },

        resetDraw: function () {
            //xoa cac node con
            var children = this.nodeParent.children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.nodeParent.removeChild(children[i]);
            }
        },
    });
}).call(this);
