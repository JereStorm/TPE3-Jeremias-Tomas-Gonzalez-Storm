
class myImage {

    constructor(img, context, posX, posY) {
        this.img = img;
        this.ctx = context;
        this.posX = posX;
        this.posY = posY;
        this.newX = null;
        this.newY = null;
    }

    myDrawImage(newWidth, newHeight) {
        this.newWidth = newWidth;
        this.newHeight = newHeight;
        this.ctx.drawImage(this.img, this.posX, this.posY, this.newWidth, this.newHeight);
    }

    addFilter(filtro) {

        if (this.img.src == '') {
            return
        }

        let imageData = ctx.getImageData(this.posX, this.posY, this.newWidth, this.newHeight);

        switch (filtro) {
            case 'grey':
                this.filterGrey(imageData);
                break;
            case 'saturation':
                this.filterSaturation(imageData);
                break;
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
            case 'blur':
                this.filterBlur(imageData);
                break;
            default:
                break;
        }

        ctx.putImageData(imageData, this.posX, this.posY);
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

    filterSaturation(imageData) {


        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let bigger = Math.max(data[i], data[i + 1], data[i + 2]);

            if (bigger <= 245 && bigger == data[i]) {
                data[i] += 10;
                data[i + 1] -= 20;
                data[i + 2] -= 20;
            } else if (bigger <= 245 && bigger == data[i + 1]) {
                data[i] -= 20;
                data[i + 1] += 10;
                data[i + 2] -= 20;
            } else if (bigger <= 245 && bigger == data[i + 2]) {
                data[i] -= 20;
                data[i + 1] -= 20;
                data[i + 2] += 10;
            }
        }

    }

    /*-- EN PROCESO --*/
    filterBlur(imageData) {

        // if (this.img.src == '') {
        //     return
        // }

        // let strength = 3;
        // ctx.globalAlpha = 0.5;
        // for (var y = -strength; y <= strength; y += 2) {
        //     for (var x = -strength; x <= strength; x += 2) {
        //         // Apply layers
        //         ctx.drawImage(this.img, width / 2 - this.img.width / 2 + x, height / 2 - this.img.height / 2 + y);
        //         //  an extra layer, prevents it from rendering lines
        //         // on top of the images (does makes it slower though)
        //         if (x >= 0 && y >= 0) {
        //             ctx.drawImage(this.img, -(x - 1) + width / 2 - this.img.width / 2, -(y - 1) + height / 2 - this.img.height / 2);
        //         }
        //     }
        // }
        // ctx.globalAlpha = 1.0;
    }

    filterBinarization(imageData) {

        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            if ((data[i] + data[i + 1] + data[i + 2]) / 3 < 127) {
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

}