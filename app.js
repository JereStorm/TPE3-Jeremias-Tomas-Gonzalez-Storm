"use strict"
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();

const filters = document.querySelector('.filters').children;

const width = canvas.width;
const height = canvas.height;

const reset_btn = document.getElementById("reset");
const pencil_btn = document.getElementById("pencil");
const eraser_btn = document.getElementById("eraser");
const color_sl = document.getElementById("color-selector");
const range_sl = document.getElementById("range");
const file_sl = document.getElementById("file_sl");
const zoomIn = document.getElementById("zoomIn");
const zoomOut = document.getElementById("zoomOut");

const img = new Image();

let filterHelper = new FilterHelper(filters);

let myImg = null;
let myPencil = null;

let drawing = false;
let draging = false;

let color = color_sl.value;
let range = range_sl.value;

//------------------------------- MANEJANDO EVENTOS ---------------------------------------//

document.getElementById("save").addEventListener("click", () => {
    let link = document.createElement('a');
    link.download = "canvas.png";
    link.href = canvas.toDataURL();
    link.click();
});

zoomIn.addEventListener("click", () => {
    if (!myImg) {
        return
    }
    cleanCanvas();
    myImg.zoomIn();
    if (myImg.getLastFilter())
        applyFilterByName(myImg.getLastFilter());
});
zoomOut.addEventListener("click", () => {
    if (!myImg) {
        return
    }
    cleanCanvas();
    myImg.zoomOut();
    if (myImg.getLastFilter())
        applyFilterByName(myImg.getLastFilter());
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
    filterHelper.cleanFiltersExcept();
})

file_sl.addEventListener('change', () => {
    cleanCanvas();
    filterHelper.cleanFiltersExcept();
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
    const { x, y } = getMousePos(e);
    if (pencil_btn.classList.contains('selected') || eraser_btn.classList.contains('selected')) {
        drawing = true;
        myPencil = new Pencil(x, y, ctx, color, range, 'none');
        myPencil.draw();
    } else if (myImg.src != '' && myImg.estaElPunto(x, y)) {
        draging = true;
        filterHelper.desactivateFilters();
        myImg.moveTo(x - myImg.width / 2, y - myImg.height / 2);
        myImg.myDrawImage();
    }

})

canvas.addEventListener("mousemove", function (evt) {
    //Si esta dibujando...
    if (drawing) {
        //Paso por parametros las nuevas posiciones a dibujar
        myPencil.moveTo(evt.clientX - rect.left, evt.clientY - rect.top);
        myPencil.draw();
    } else if (draging) {
        // cleanCanvas();
        myImg.moveTo(evt.clientX - rect.left - myImg.width / 2, evt.clientY - rect.top - myImg.height / 2);
        myImg.myDrawImage();
    }
});

canvas.addEventListener("mouseup", function (e) {
    if (drawing) {
        drawing = false;
        myPencil = null;
    } else if (draging) {
        draging = false;
        filterHelper.activateFilters();
        if (myImg.getLastFilter())
            applyFilterByName(myImg.getLastFilter());
    }
})


//---------------------------- FUNCIONES DEL DRAW ------------------------------------//

cleanCanvas();
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
            let { x, y, newWidth, newHeight } = adaptImage();

            if (x > y) {
                myImg = new myImage(canvas, img, ctx, width - newWidth - (x - y), height - newHeight, newWidth, newHeight);
            } else {
                myImg = new myImage(canvas, img, ctx, width - newWidth, height - newHeight - (y - x), newWidth, newHeight);
            }

            myImg.myDrawImage();
            filterHelper.activateFilters();
        };
    } catch (error) {
        filterHelper.desactivateFilters();
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

function filtersDriver(filtroNodeHTML) {
    if (!file_sl.files[0]) {
        return
    }

    myImg.myDrawImage();

    let filterName = filtroNodeHTML.getAttribute('data-id');

    filtroNodeHTML.classList.add(filterHelper.styles.selected);

    filterHelper.cleanFiltersExcept(filterName);

    if (filterName == myImg.getLastFilter()) {
        filtroNodeHTML.classList.toggle(filterHelper.styles.selected);
        myImg.setLastFilter(null);
        myImg.myDrawImage();
        return
    }

    applyFilterByName(filterName);

}

function applyFilterByName(filterName) {
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
        case 'edgeDetection':
            myImg.filterEdgeDetection();
            break;
        default:
            break;
    }
}



