"use strict"

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();

const filters = document.querySelector('.filters').children;
desactivateFilters();

const width = canvas.width;
const height = canvas.height;

const reset_btn = document.getElementById("reset");
const pencil_btn = document.getElementById("pencil");
const eraser_btn = document.getElementById("eraser");
const color_sl = document.getElementById("color-selector");
const range_sl = document.getElementById("range");
const file_sl = document.getElementById("file_sl");
const img = new Image();

let myImg = null;
let myPencil = null;
let last_filter = '';

let drawing = false;

let color = color_sl.value;
let range = range_sl.value;

//------------------------------- MANEJANDO EVENTOS ---------------------------------------//

document.getElementById("save").addEventListener("click", () => {
    let link = document.createElement('a');
    link.download = "canvas.png";
    link.href = canvas.toDataURL();
    link.click();
});

for (let filtro of filters) {

    filtro.addEventListener('click', () => {
        filtersDriver(filtro);
    })
};

reset_btn.addEventListener('click', function () {
    file_sl.value = null;
    myImg = null;
    desactivateFilters();
    cleanCanvas();
    cleanFiltersExcept();
})

file_sl.addEventListener('change', () => {
    cleanCanvas();
    cleanFiltersExcept();
    addImage();
})

pencil_btn.addEventListener('click', () => {
    if (eraser_btn.classList.contains('selected')) {
        eraser_btn.classList.toggle('selected');
    }
    pencil_btn.classList.toggle('selected');
    setColor(color_sl.value);
})

eraser_btn.addEventListener('click', () => {
    if (pencil_btn.classList.contains('selected')) {
        pencil_btn.classList.toggle('selected')
    }
    eraser_btn.classList.toggle('selected');
    setColor('white');
})

canvas.addEventListener("mousedown", function (e) {
    if (pencil_btn.classList.contains('selected') || eraser_btn.classList.contains('selected')) {
        const { x, y } = getMousePos(e);
        drawing = true;
        myPencil = new Pencil(x, y, ctx, color, range, 'none');
    }

})

canvas.addEventListener("mousemove", function (evt) {
    //Si esta dibujando...
    if (drawing) {
        //Paso por parametros las nuevas posiciones a dibujar
        myPencil.moveTo(evt.clientX - rect.left, evt.clientY - rect.top);
        myPencil.draw();
    }
});

canvas.addEventListener("mouseup", function (e) {
    if (drawing) {
        drawing = false;
        myPencil = null;
    }
})


//---------------------------- FUNCIONES DEL DRAW ------------------------------------//

function main() {
    cleanCanvas();
}

function cleanCanvas() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
}

function getMousePos(evt) {
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    }
}

function setColor(c) {
    if (!eraser_btn.classList.contains('selected')) {
        color = c;
    } else {
        color = 'white'
    }
}

function setRange(g) {
    range = g;
}

function addImage() {
    try {
        img.src = URL.createObjectURL(file_sl.files[0]);
        img.onload = () => {
            // get the scale
            // it is the min of the 2 ratios
            let { x, y, newWidth, newHeight } = adaptImage();

            // When drawing the image, we have to scale down the image
            // width and height in order to fit within the canvas
            if (x > y) {
                myImg = new myImage(img, ctx, width - newWidth - (x - y), height - newHeight, newWidth, newHeight);
            } else {
                myImg = new myImage(img, ctx, width - newWidth, height - newHeight - (y - x), newWidth, newHeight);
            }

            myImg.myDrawImage();
            activateFilters();
        };
    } catch (error) {
        desactivateFilters();
    }
}

function filtersDriver(filtro) {
    if (!file_sl.files[0]) {
        return
    }

    myImg.myDrawImage();

    let filterName = filtro.getAttribute('data-id');

    filtro.classList.add('filtro-selected');

    cleanFiltersExcept(filterName);

    if (filterName == myImg.getLastFilter()) {
        filtro.classList.toggle('filtro-selected');
        myImg.setLastFilter(null);
        return
    }

    switch (filterName) {
        case 'binarization':
            myImg.filterBinarization();
            break;
        case 'brightness':
            myImg.filterBrightness();
            break;
        case 'invert':
            myImg.filterInvert();
            break;
        case 'sepia':
            myImg.filterSepia();
            break;
        case 'grey':
            myImg.filterGrey();
            break;
        case 'saturation':
            myImg.filterSaturation();
            break;
        case 'blur':
            myImg.filterBlur();
            break;
        default:
            break;
    }
}

function cleanFiltersExcept(filterName = 'null') {
    for (let otherFiltro of filters) {
        if (otherFiltro.getAttribute('data-id') != filterName) {
            otherFiltro.classList.remove('filtro-selected');
        }
    }
}

function activateFilters() {
    for (let filtro of filters) {
        filtro.disabled = false;
        filtro.classList.remove('disabled');
    }
}
function desactivateFilters() {
    for (let filtro of filters) {
        filtro.disabled = true;
        filtro.classList.add('disabled');
    }
}

function adaptImage() {
    let scale_factor = Math.min(width / img.width, height / img.height);

    // Lets get the new width and height based on the scale factor
    let newWidth = img.width * scale_factor;
    let newHeight = img.height * scale_factor;

    // get the top left position of the image
    // in order to center the image within the canvas
    let x = (width / 2) - (newWidth / 2);
    let y = (height / 2) - (newHeight / 2);
    return { x, y, newWidth, newHeight };
}
