
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

    myDrawImage() {
        // this.ctx.beginPath();
        // this.ctx.fillStyle = '#ffffff';
        // this.ctx.fillRect(this.posX - 5, this.posY - 5, this.newWidth + 10, this.newHeight + 10);
        // this.ctx.closePath();

        this.ctx.drawImage(this.img, this.posX, this.posY, this.newWidth, this.newHeight);
    }

    addFilter(filtro) {

        if (this.img.src == '') {
            return
        }

        this.myDrawImage();

        if (this.lastFilter == filtro) {
            this.lastFilter = null;
            return;
        }

        let imageData = ctx.getImageData(this.posX, this.posY, this.newWidth, this.newHeight);

        switch (filtro) {
            case 'binarization':
                this.filterBinarization(imageData);
                break;
            case 'brightness':
                this.filterBrightness(imageData);
                break;
            case 'invert':
                this.filterInvert(imageData);
                break;
            case 'sepia':
                this.filterSepia(imageData);
                break;
            case 'grey':
                this.filterGrey(imageData);
                break;
            case 'saturation':
                this.filterSaturation(imageData);
                break;
            case 'blur':
                this.filterBlur(imageData);
                break;
            default:
                break;
        }
        this.lastFilter = filtro;

        ctx.putImageData(imageData, this.posX, this.posY);
    }

    filterInvert(imageData) {

        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]; // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
        }
    }

    filterSepia(imageData) {

        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {

            data[i] = Math.min((data[i] * 0.393) + (data[i + 1] * 0.769) + (data[i + 2] * 0.189), 255); // red
            data[i + 1] = Math.min((data[i] * 0.349) + (data[i + 1] * 0.686) + (data[i + 2] * 0.168), 255); // green
            data[i + 2] = Math.min((data[i] * 0.272) + (data[i + 1] * 0.534) + (data[i + 2] * 0.131), 255); // blue
        }
    }

    filterBrightness(imageData) {

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
    }

    filterGrey(imageData) {

        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const gris = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = gris; // red
            data[i + 1] = gris; // green
            data[i + 2] = gris; // blue
        }
    }

    filterBinarization(imageData) {

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
            // if (data[i] > 124) {
            //     data[i] = 255; // red 
            // } else {
            //     data[i] = 0; // red 
            // }
            // if (data[i + 1] > 124) {
            //     data[i + 1] = 255; // red 
            // } else {
            //     data[i + 1] = 0; // red 
            // }
            // if (data[i + 2] > 124) {
            //     data[i + 2] = 255; // red 
            // } else {
            //     data[i + 2] = 0; // red 
            // }
        }
    }

    filterSaturation(imageData) {

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

    }

    /*-- EN PROCESO:
        En este punto yo se que tendre una matriz de this.newWidth X this.newHeight = imageData;
    --*/
    filterBlur(imageData) {

        if (this.img.src == '') {
            return
        }

        let box_kernel = [
            [1 / 9, 1 / 9, 1 / 9],
            [1 / 9, 1 / 9, 1 / 9],
            [1 / 9, 1 / 9, 1 / 9]
        ];

        let gaussian_kernel = [
            [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
            [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
            [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
            [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
            [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256]
        ];


        for (let x = 1; x < this.newWidth - 1; x++) {
            for (let y = 1; y < this.newHeight - 1; y++) {

                let suma = imageData.data[((x - 1) * (y + 1)) * 4] + // Arriba a la izquierda
                    imageData.data[((x + 0) * (y + 1)) * 4] + // Centro superior
                    imageData.data[((x + 1) * (y + 1)) * 4] + // Arriba a la derecha
                    imageData.data[((x - 1) * (y + 0)) * 4] + // Medio a la izquierda
                    imageData.data[((x + 0) * (y + 0)) * 4] + // Píxel actual
                    imageData.data[((x + 1) * (y + 0)) * 4] + // Medio a la derecha
                    imageData.data[((x - 1) * (y - 1)) * 4] + // Baja izquierda
                    imageData.data[((x + 0) * (y - 1)) * 4] + // Centro bajo
                    imageData.data[((x + 1) * (y - 1)) * 4]; // Bajo a la derecha


                imageData.data[((x - 1) * (y + 1)) * 4] = suma / 9;// Arriba a la izquierda
                imageData.data[((x + 0) * (y + 1)) * 4] = suma / 9;// Centro superior
                imageData.data[((x + 1) * (y + 1)) * 4] = suma / 9;// Arriba a la derecha
                imageData.data[((x - 1) * (y + 0)) * 4] = suma / 9;// Medio a la izquierda
                imageData.data[((x + 0) * (y + 0)) * 4] = suma / 9;// Píxel actual
                imageData.data[((x + 1) * (y + 0)) * 4] = suma / 9;// Medio a la derecha
                imageData.data[((x - 1) * (y - 1)) * 4] = suma / 9;// Baja izquierda
                imageData.data[((x + 0) * (y - 1)) * 4] = suma / 9;// Centro bajo
                imageData.data[((x + 1) * (y - 1)) * 4] = suma / 9;
            }

        }
    }

}
