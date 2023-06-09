"use strict";


class Pencil {
    constructor(posX, posY, context, color, lineWidth, style) {
        this.startX = posX;
        this.startY = posY;
        this.endX = this.startX;
        this.endY = this.startY;
        this.ctx = context;
        this.style = style;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    /**
     * This Method update the positions where draw
     * @param {number} x represent the new Position
     * @param {number} y represent the new Position
     */
    moveTo(x, y) {
        this.startX = this.endX;
        this.startY = this.endY;
        this.endX = x;
        this.endY = y;
    }

    /**
     * This Method draw a line with posX, posY, endX, and endY into canvas
     */
    draw() {

        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(this.endX, this.endY);
        this.ctx.stroke();
        this.ctx.closePath();
    }

}