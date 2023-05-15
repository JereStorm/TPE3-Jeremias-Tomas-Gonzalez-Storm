"use strict";

// ------------------------------------------
//  CANVAS ATTRIBUTES
// ------------------------------------------

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();
const width = canvas.width;
const height = canvas.height;

// ------------------------------------------
//  DOM ELEMENTS
// ------------------------------------------

const filters = document.querySelector('.filters').children;
const reset_btn = document.getElementById("reset");
const pencil_btn = document.getElementById("pencil");
const eraser_btn = document.getElementById("eraser");
const color_sl = document.getElementById("color-selector");
const range_sl = document.getElementById("range");
const file_sl = document.getElementById("file_sl");
const saveFilterData_btn = document.getElementById("saveData");

// ------------------------------------------
//  CONTROL ATTRIBUTES
// ------------------------------------------

const img = new Image();
const filterHelper = new FilterHelper(filters);

let myImg = null;
let myPencil = null;

let drawing = false;
let draging = false;

let color = color_sl.value;
let range = range_sl.value;

// ------------------------------------------
//  HANDLING EVENTS
// ------------------------------------------

//DOWNLOAD CANVAS AS IMAGE
document.getElementById("save").addEventListener("click", () => {
    let link = document.createElement('a');
    link.download = "canvas.png";
    link.href = canvas.toDataURL();
    link.click();
});

//FOR EACH FILTER OF FILTERS
for (let filtro of filters) {
    filtro.addEventListener('click', () => {
        //Enable the Save Filter button
        saveFilterData_btn.disabled = false;
        saveFilterData_btn.classList.remove(filterHelper.styles.disabled);
        filtersDriver(filtro);
    })
};

//SAVING THE NEW DATA FOR IMAGE
saveFilterData_btn.addEventListener('click', () => {
    myImg.updateOriginalData();
    myImg.setLastFilter(null);
    filterHelper.diselectedFiltersExcept();
    //Disble the Save Filter button
    saveFilterData_btn.classList.add('disabled');
    saveFilterData_btn.disabled = true;
})

//RESET CANVAS
reset_btn.addEventListener('click', function () {
    //Clean Image attributes
    file_sl.value = null;
    myImg = null;
    //Clean filter Styles
    filterHelper.desactivateFilters();
    filterHelper.diselectedFiltersExcept();
    //Clean saveFilter styles
    saveFilterData_btn.disabled = true;
    saveFilterData_btn.classList.add(filterHelper.styles.disabled)
    //Clean Canvas
    cleanCanvas();
})

//SUBMIT IMAGE
file_sl.addEventListener('change', () => {
    //Clean Filter Styles
    filterHelper.diselectedFiltersExcept();
    addImage();
})

//PENCIL BTN SELECTED
pencil_btn.addEventListener('click', () => {
    //Handling Style
    if (eraser_btn.classList.contains('selected')) {
        eraser_btn.classList.toggle('selected');
    }
    pencil_btn.classList.toggle('selected');
    //Update Color
    setColor(color_sl.value);
})

//ERASER BTN SELECTED
eraser_btn.addEventListener('click', () => {
    //Handling Style
    if (pencil_btn.classList.contains('selected')) {
        pencil_btn.classList.toggle('selected')
    }
    eraser_btn.classList.toggle('selected');
    //Update Color
    setColor('white');
})

//CANVAS MOUSEDOWN
canvas.addEventListener("mousedown", function (e) {
    //Get Mouse position
    const { x, y } = getMousePos(e);

    //Setting the App State (Drawing or Draging)
    if (pencil_btn.classList.contains('selected') || eraser_btn.classList.contains('selected')) {
        //Set Drawing 
        drawing = true;
        myPencil = new Pencil(x, y, ctx, color, range, 'none');
        myPencil.draw();
    } else if (myImg && myImg.estaElPunto(x, y)) {
        //Set Draging
        draging = true;
        canvas.style.cursor = 'move';
        filterHelper.desactivateFilters();
        myImg.moveTo(x - myImg.width / 2, y - myImg.height / 2);
    }

})

canvas.addEventListener("mousemove", function (evt) {
    //Get Mouse position
    const { x, y } = getMousePos(evt);

    //Handling cursor style (independently of App State) 
    if (!pencil_btn.classList.contains('selected') && !eraser_btn.classList.contains('selected')) {
        if (myImg && !draging && myImg.estaElPunto(x, y)) {
            canvas.style.cursor = 'pointer';
        } else if (!draging) {
            canvas.style.cursor = 'default';
        }
    }

    //If App State is Drawing
    if (drawing) {
        //Move myPencil to new coordinate of Mouse position
        myPencil.moveTo(x, y);
        myPencil.draw();
    } else if (draging) {
        //Move myImg to center of new coordinate of Mouse position
        myImg.moveTo(x - myImg.width / 2, y - myImg.height / 2);
    }
});

//CANVAS MOUSE UP
canvas.addEventListener("mouseup", function (e) {
    //Handling the App State as appropriate
    if (drawing) {
        drawing = false;
        myPencil = null;
    } else if (draging) {
        draging = false;
        canvas.style.cursor = 'default';
        filterHelper.activateFilters();
    }
})


//---------------------------- FUNCIONES DEL DRAW ------------------------------------//

/**
 * This Method that cleans the Canvas by drawing a white rect
 */
function cleanCanvas() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
}

/**
 * This Function get the real Mouse Position from Canvas
 * @param {MouseEvent} evt 
 * @returns {{x: number, y: number}}
 */
function getMousePos(evt) {
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    }
}

/**
 * This Method set the new color value "c" in the control attribute "color"
 * @param {String} c 
 */
function setColor(c) {
    if (!eraser_btn.classList.contains('selected')) {
        color = c;
    } else {
        color = 'white'
    }
}

/**
 * This Method set the new range value "g" in the control attribute "range"
 * @param {String} g 
 */
function setRange(g) {
    range = g;
}

/**
 * This Method try to add the new Image, adapting the size from image in function size of cavnas
 */
function addImage() {
    //Use Try Catch because i can handle some error in load the Image 
    try {
        img.src = URL.createObjectURL(file_sl.files[0]);
        img.onload = () => {
            //get the rendered attributes for the image
            let { x, y, newWidth, newHeight } = adaptImage();

            //calculate the central positions x and y where to draw the image
            let centerX = Math.round(width - newWidth - (x - y));
            let centerY = Math.round(height - newHeight - (y - x));

            //guide the positions according to the predominance of the image
            if (x > y) {
                myImg = new myImage(canvas, img, ctx, centerX, height - newHeight, newWidth, newHeight);
            } else {
                myImg = new myImage(canvas, img, ctx, width - newWidth, centerY, newWidth, newHeight);
            }

            //draw image
            myImg.myDrawImage();
            //activate filters
            filterHelper.activateFilters();
        };
    } catch (error) {
        //desactivate filters
        filterHelper.desactivateFilters();
    }
}

/**
 * This function calculate new values for the Image from one scale factor
 * @returns {{x: number, y: number, newWidth: number, newHeight: number}}
 */
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

/**
 * This Method handling the filters style and  
 * @param {HTMLCollection} filtroNodeHTML 
 * @returns {void}
 */
function filtersDriver(filtroNodeHTML) {
    //validate state input file
    if (!file_sl.files[0]) {
        return
    }

    let filterName = filtroNodeHTML.getAttribute('data-id');

    filtroNodeHTML.classList.add(filterHelper.styles.selected);

    //clean filters style
    filterHelper.diselectedFiltersExcept(filterName);

    //validate if new filter name is equals atributte last filter of image
    //then handler filters styles and reset the actual data to oldest data 
    if (filterName == myImg.getLastFilter()) {
        filtroNodeHTML.classList.toggle(filterHelper.styles.selected);
        myImg.setLastFilter(null);
        myImg.resetActualData();
        myImg.drawImageData();
        saveFilterData_btn.disabled = true;
        saveFilterData_btn.classList.add(filterHelper.styles.disabled);
        return
    }

    //if everything is good, apply the filter
    applyFilterByName(filterName);

}

/**
 * This Method apply the filter accordingly to param filterName
 * @param {String} filterName 
 */
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

//Default function clean canvas
cleanCanvas();