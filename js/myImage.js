
class myImage {

    constructor(canvas, img, context, posX, posY, newWidth, newHeight) {
        this.canvas = canvas;
        this.img = img;
        this.ctx = context;
        this.posX = Math.round(posX);
        this.posY = Math.round(posY);
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

    /**
     * This Method update posX and posY from image and draw the image data
     * @param {number} x 
     * @param {number} y 
     */
    moveTo(x, y) {
        this.posX = Math.round(x);
        this.posY = Math.round(y);
        this.drawImageData();
    };

    /**
     * This method update orginal data with the actual data
     */
    updateOriginalData() {
        this.originalData = this.actualData;
    }

    /**
     * This method reset the actual data with the last one original data
     */
    resetActualData() {
        this.actualData = new ImageData(
            new Uint8ClampedArray(this.originalData.data),
            this.originalData.width,
            this.originalData.height
        )
    }

    /**
     * This method clean canvas and update the image data accordingly
     * the state from actualData and originalData
     */
    drawImageData() {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.closePath();

        this.ctx.putImageData(this.actualData ? this.actualData : this.originalData, this.posX, this.posY);
    }

    /**
     * This Function calculate in function of params x and y
     * if the image is in the postion of mouse and returns the result
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean}
     */
    isInPoint(x, y) {
        return ((x > this.posX) && (x < this.posX + this.width) && (y > this.posY) && (y < this.posY + this.height));
    }

    /**
     * This method clean canvas and draw the image
     * and the first time set atributte originalData
     */
    myDrawImage() {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.closePath();

        this.ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);

        //To start originalData is null 
        if (!this.originalData) {
            this.originalData = this.ctx.getImageData(this.posX, this.posY, this.width, this.height);
        }
    }

    filterInvert() {
        let imageData = new ImageData(
            new Uint8ClampedArray(this.originalData.data),
            this.originalData.width,
            this.originalData.height
        )

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
        let imageData = new ImageData(
            new Uint8ClampedArray(this.originalData.data),
            this.originalData.width,
            this.originalData.height
        )

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
        let imageData = new ImageData(
            new Uint8ClampedArray(this.originalData.data),
            this.originalData.width,
            this.originalData.height
        )

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
        let imageData = new ImageData(
            new Uint8ClampedArray(this.originalData.data),
            this.originalData.width,
            this.originalData.height
        )

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
        let imageData = new ImageData(
            new Uint8ClampedArray(this.originalData.data),
            this.originalData.width,
            this.originalData.height
        )

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
        let imageData = new ImageData(
            new Uint8ClampedArray(this.originalData.data),
            this.originalData.width,
            this.originalData.height
        )

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

        let imageData = new ImageData(
            new Uint8ClampedArray(this.originalData.data),
            this.originalData.width,
            this.originalData.height
        )

        let validW = imageData.width;
        let validH = imageData.height;

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
                //Acc is the final color that we set in the especific point x and y of imageData
                let acc = [0, 0, 0];
                //We move in the surrounding pixels and take their data
                for (let a = 0; a < box_kernel.length; a++) {
                    for (let b = 0; b < box_kernel.length; b++) {
                        let xn = x + a - offSet;
                        let yn = y + b - offSet;

                        //surrounding pixels
                        let pixel = (xn + yn * validW) * 4;

                        acc[0] += imageData.data[pixel] * box_kernel[a][b];
                        acc[1] += imageData.data[pixel + 1] * box_kernel[a][b];
                        acc[2] += imageData.data[pixel + 2] * box_kernel[a][b];
                    }
                }
                //finally set in the actual pixel acc data
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

        let imageData = new ImageData(
            new Uint8ClampedArray(this.originalData.data),
            this.originalData.width,
            this.originalData.height
        )

        let validW = imageData.width;
        let validH = imageData.height;

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
                //Draw in black and white the magnitude
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

    /**
     * This method calculate the average in "xn" and "yn" especific point of param "imageData"
     * @param {ImageData} imageData
     * @param {number} xn
     * @param {number} yn
     * @param {number} validW
     * 
     * @returns {number}
     */
    calcIntensity(imageData, xn, yn, validW) {
        return (
            (imageData.data[((xn + yn * validW) * 4)] +
                imageData.data[((xn + yn * validW) * 4) + 1] +
                imageData.data[((xn + yn * validW) * 4) + 2]) / 3
        );
    }
}