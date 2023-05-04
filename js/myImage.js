
class myImage {

    constructor(img, context, posX, posY, newWidth, newHeight) {
        this.img = img;
        this.ctx = context;
        this.posX = posX;
        this.posY = posY;
        this.newWidth = Math.round(newWidth);
        this.newHeight = Math.round(newHeight);
        this.lastFilter = null;
    }
    setLastFilter(newFilter) {
        this.lastFilter = newFilter;
    }
    getLastFilter() {
        return this.lastFilter;
    }

    myDrawImage() {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(this.posX - 5, this.posY - 5, this.newWidth + 10, this.newHeight + 10);
        this.ctx.closePath();

        this.ctx.drawImage(this.img, this.posX, this.posY, this.newWidth, this.newHeight);
    }

    filterInvert() {
        let imageData = ctx.getImageData(this.posX, this.posY, this.newWidth, this.newHeight);

        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]; // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
        }

        ctx.putImageData(imageData, this.posX, this.posY);

        this.setLastFilter('invert');
    }

    filterSepia() {
        let imageData = ctx.getImageData(this.posX, this.posY, this.newWidth, this.newHeight);

        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {

            data[i] = Math.min((data[i] * 0.393) + (data[i + 1] * 0.769) + (data[i + 2] * 0.189), 255); // red
            data[i + 1] = Math.min((data[i] * 0.349) + (data[i + 1] * 0.686) + (data[i + 2] * 0.168), 255); // green
            data[i + 2] = Math.min((data[i] * 0.272) + (data[i + 1] * 0.534) + (data[i + 2] * 0.131), 255); // blue
        }

        ctx.putImageData(imageData, this.posX, this.posY);
        this.setLastFilter('sepia');

    }

    filterBrightness() {
        let imageData = ctx.getImageData(this.posX, this.posY, this.newWidth, this.newHeight);

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

        ctx.putImageData(imageData, this.posX, this.posY);
        this.setLastFilter('brightness');
    }

    filterGrey() {
        let imageData = ctx.getImageData(this.posX, this.posY, this.newWidth, this.newHeight);

        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const gris = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = gris; // red
            data[i + 1] = gris; // green
            data[i + 2] = gris; // blue
        }

        ctx.putImageData(imageData, this.posX, this.posY);
        this.setLastFilter('grey');

    }

    filterBinarization() {
        let imageData = ctx.getImageData(this.posX, this.posY, this.newWidth, this.newHeight);

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
        ctx.putImageData(imageData, this.posX, this.posY);
        this.setLastFilter('binarization');
    }

    filterSaturation() {
        let imageData = ctx.getImageData(this.posX, this.posY, this.newWidth, this.newHeight);

        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let bigger = Math.max(data[i], data[i + 1], data[i + 2]);

            if (bigger <= 245 && bigger == data[i]) {
                data[i] += 40;
                data[i + 1] -= 40;
                data[i + 2] -= 40;
            } else if (bigger <= 245 && bigger == data[i + 1]) {
                data[i] -= 40;
                data[i + 1] += 40;
                data[i + 2] -= 40;
            } else if (bigger <= 245 && bigger == data[i + 2]) {
                data[i] -= 40;
                data[i + 1] -= 40;
                data[i + 2] += 40;
            }
        }
        /**
        if (data[i] > 124) {
            data[i] = 255; // red 
        } else {
            data[i] = 0; // red 
        }
        if (data[i + 1] > 124) {
            data[i + 1] = 255; // red 
        } else {
            data[i + 1] = 0; // red 
        }
        if (data[i + 2] > 124) {
            data[i + 2] = 255; // red 
        } else {
            data[i + 2] = 0; // red 
        }
         */
        ctx.putImageData(imageData, this.posX, this.posY);
        this.setLastFilter('saturation');
    }

    filterBlur() {
        let imageData = ctx.getImageData(this.posX, this.posY, this.newWidth, this.newHeight);

        if (this.img.src == '') {
            return
        }

        let box_kernel1 = [
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

        for (let x = offSet; x < this.newWidth - offSet; x++) {
            for (let y = offSet; y < this.newHeight - offSet; y++) {
                let acc = [0, 0, 0];
                for (let a = 0; a < box_kernel.length; a++) {
                    for (let b = 0; b < box_kernel.length; b++) {
                        let xn = x + a - offSet;
                        let yn = y + b - offSet;

                        let pixel = (xn + yn * this.newWidth) * 4;

                        acc[0] += imageData.data[pixel] * box_kernel[a][b];
                        acc[1] += imageData.data[pixel + 1] * box_kernel[a][b];
                        acc[2] += imageData.data[pixel + 2] * box_kernel[a][b];
                    }
                }
                imageData.data[(x + y * this.newWidth) * 4] = acc[0];
                imageData.data[(x + y * this.newWidth) * 4 + 1] = acc[1];
                imageData.data[(x + y * this.newWidth) * 4 + 2] = acc[2];

            }
        }
        ctx.putImageData(imageData, this.posX, this.posY);
        this.setLastFilter('blur');
    }
}
