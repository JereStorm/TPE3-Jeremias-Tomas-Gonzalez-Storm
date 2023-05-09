
class myImage {

    constructor(canvas, img, context, posX, posY, newWidth, newHeight) {
        this.canvas = canvas;
        this.img = img;
        this.ctx = context;
        this.posX = posX;
        this.posY = posY;
        this.width = Math.round(newWidth);
        this.height = Math.round(newHeight);
        this.originalData = null;
        this.actualData = null;
        this.lastFilter = null;
    }
    setLastFilter(newFilter) {
        this.lastFilter = newFilter;
    }
    getLastFilter() {
        return this.lastFilter;
    }

    moveTo(x, y) {
        this.posX = x;
        this.posY = y;
    };

    drawImageData() {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.closePath();

        this.ctx.putImageData(this.actualData ? this.actualData : this.originalData, this.posX, this.posY);
    }

    estaElPunto(x, y) {
        return ((x > this.posX) && (x < this.posX + this.width) && (y > this.posY) && (y < this.posY + this.height));
    }

    zoomIn() {
        this.width += Math.round(this.width / 4);
        this.height += Math.round(this.height / 4);

        this.myDrawImage();
    }

    zoomOut() {
        this.width -= Math.round(this.width / 4);
        this.height -= Math.round(this.height / 4);

        this.myDrawImage();
    }

    myDrawImage() {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.closePath();

        this.ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);

        this.originalData = this.ctx.getImageData(this.posX, this.posY, this.width, this.height);
    }

    filterInvert() {
        let imageData = ctx.getImageData(this.posX, this.posY, this.width, this.height);


        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]; // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
        }

        this.ctx.putImageData(imageData, this.posX, this.posY);
        this.actualData = imageData;
        this.setLastFilter('invert');
    }

    filterSepia() {
        let imageData = ctx.getImageData(this.posX, this.posY, this.width, this.height);


        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {

            data[i] = Math.min((data[i] * 0.393) + (data[i + 1] * 0.769) + (data[i + 2] * 0.189), 255); // red
            data[i + 1] = Math.min((data[i] * 0.349) + (data[i + 1] * 0.686) + (data[i + 2] * 0.168), 255); // green
            data[i + 2] = Math.min((data[i] * 0.272) + (data[i + 1] * 0.534) + (data[i + 2] * 0.131), 255); // blue
        }

        this.ctx.putImageData(imageData, this.posX, this.posY);
        this.actualData = imageData;
        this.setLastFilter('sepia');

    }

    filterBrightness() {
        let imageData = ctx.getImageData(this.posX, this.posY, this.width, this.height);


        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            if (data[i] < 240) {
                data[i] = data[i] + 14; // red 
            }
            if (data[i + 1] < 240) {

                data[i + 1] = data[i + 1] + 14; // green
            }
            if (data[i + 2] < 240) {
                data[i + 2] = data[i + 2] + 14; // blue
            }
        }

        this.ctx.putImageData(imageData, this.posX, this.posY);
        this.actualData = imageData;
        this.setLastFilter('brightness');
    }

    filterGrey() {
        let imageData = ctx.getImageData(this.posX, this.posY, this.width, this.height);


        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const gris = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = gris; // red
            data[i + 1] = gris; // green
            data[i + 2] = gris; // blue
        }

        this.ctx.putImageData(imageData, this.posX, this.posY);
        this.actualData = imageData;
        this.setLastFilter('grey');

    }

    filterBinarization() {
        let imageData = ctx.getImageData(this.posX, this.posY, this.width, this.height);

        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            if ((data[i] + data[i + 1] + data[i + 2]) / 3 > 120) {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
            } else {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
            }

        }
        this.ctx.putImageData(imageData, this.posX, this.posY);
        this.actualData = imageData;
        this.setLastFilter('binarization');
    }

    filterSaturation() {
        let imageData = ctx.getImageData(this.posX, this.posY, this.width, this.height);

        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let bigger = Math.max(data[i], data[i + 1], data[i + 2]);

            if (bigger <= 215 && bigger == data[i]) {
                data[i] += 40;
                data[i + 1] -= 40;
                data[i + 2] -= 40;
            } else if (bigger <= 215 && bigger == data[i + 1]) {
                data[i] -= 40;
                data[i + 1] += 40;
                data[i + 2] -= 40;
            } else if (bigger <= 215 && bigger == data[i + 2]) {
                data[i] -= 40;
                data[i + 1] -= 40;
                data[i + 2] += 40;
            }
        }

        this.ctx.putImageData(imageData, this.posX, this.posY);
        this.actualData = imageData;
        this.setLastFilter('saturation');
    }

    filterBlur() {

        if (this.img.src == '') {
            return
        }

        let validW = this.width;
        let validH = this.height;

        let imageData = ctx.getImageData(this.posX, this.posY, validW, validH);

        let box_kernel2 = [
            [1 / 9, 1 / 9, 1 / 9],
            [1 / 9, 1 / 9, 1 / 9],
            [1 / 9, 1 / 9, 1 / 9]
        ];

        let box_kernel = [
            [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
            [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
            [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
            [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
            [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256]
        ];

        let offSet = Math.floor(box_kernel.length / 2);

        for (let x = offSet; x < validW - offSet; x++) {
            for (let y = offSet; y < validH - offSet; y++) {
                let acc = [0, 0, 0];
                for (let a = 0; a < box_kernel.length; a++) {
                    for (let b = 0; b < box_kernel.length; b++) {
                        let xn = x + a - offSet;
                        let yn = y + b - offSet;

                        let pixel = (xn + yn * validW) * 4;

                        acc[0] += imageData.data[pixel] * box_kernel[a][b];
                        acc[1] += imageData.data[pixel + 1] * box_kernel[a][b];
                        acc[2] += imageData.data[pixel + 2] * box_kernel[a][b];
                    }
                }
                imageData.data[(x + y * validW) * 4] = acc[0];
                imageData.data[(x + y * validW) * 4 + 1] = acc[1];
                imageData.data[(x + y * validW) * 4 + 2] = acc[2];
            }
        }
        this.ctx.putImageData(imageData, this.posX, this.posY);
        this.actualData = imageData;
        this.setLastFilter('blur');
    }

    filterEdgeDetection() {

        if (this.img.src == '') {
            return
        }

        /*Primero debo obtener la parte valida de la imagen */
        let validW = this.width;
        let validH = this.height;
        let imageData = ctx.getImageData(this.posX, this.posY, validW, validH);

        let kernelX = [[-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]];

        let kernelY = [[-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]];

        for (let x = 0; x < validW; x++) {
            for (let y = 0; y < validH; y++) {
                let magX = 0;
                let magY = 0;
                for (let a = 0; a < 3; a++) {
                    for (let b = 0; b < 3; b++) {
                        let xn = x + a;
                        let yn = y + b;

                        let intensity = this.calcIntensity(imageData, xn, yn, validW);

                        magX += intensity * kernelX[a][b];
                        magY += intensity * kernelY[a][b];
                    }
                }
                let color = parseInt(Math.sqrt((magX * magX) + (magY * magY)));
                imageData.data[((x + y * validW) * 4)] = color;
                imageData.data[((x + y * validW) * 4) + 1] = color;
                imageData.data[((x + y * validW) * 4) + 2] = color;

            }
        }
        this.ctx.putImageData(imageData, this.posX, this.posY);
        this.actualData = imageData;
        this.setLastFilter('edgeDetection');
    }
    calcIntensity(imageData, xn, yn, validW) {
        return (
            (imageData.data[((xn + yn * validW) * 4)] +
                imageData.data[((xn + yn * validW) * 4) + 1] +
                imageData.data[((xn + yn * validW) * 4) + 2]) / 3
        );
    }
}




/*FILTROS FALOPAS:
        let deteccion_bordes = [
            [-1, -1, -1],
            [-1, 8, -1],
            [-1, -1, -1]
        ];

imageData.data[(x + y * this.newWidth) * 4] = (acc[2] + 255) / 2;
imageData.data[(x + y * this.newWidth) * 4 + 1] = (acc[0] + 255) / 2;
imageData.data[(x + y * this.newWidth) * 4 + 2] = (acc[1] + 255) / 2;
imageData.data[(x + y * this.newWidth) * 4 + 3] = 255;

*/