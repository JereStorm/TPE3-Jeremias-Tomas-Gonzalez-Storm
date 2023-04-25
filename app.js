"use strict"

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();

const width = canvas.width;
const height = canvas.height;

const reset_btn = document.getElementById("reset");
const pencil = document.getElementById("pencil");
const eraser = document.getElementById("eraser");
const color_sl = document.getElementById("color-selector");
const range_sl = document.getElementById("range");
const file_sl = document.getElementById("file_sl");
const img = new Image();

let posX = 0;
let posY = 0;

let drawing = false;

let color = color_sl.value;
let range = range_sl.value;

//------------------------------- MANEJANDO EVENTOS ---------------------------------------//

reset_btn.addEventListener('click', function () {
    file_sl.value = null;
    cleanCanvas();
})

file_sl.addEventListener('change', () => {
    img.src = URL.createObjectURL(file_sl.files[0]);
    img.onload = () => {
        myDrawImage();
    }
})

pencil.addEventListener('click', () => {
    if (eraser.classList.contains('selected')) {
        eraser.classList.toggle('selected');
    }
    pencil.classList.toggle('selected');
    setColor(color_sl.value);
})

eraser.addEventListener('click', () => {
    if (pencil.classList.contains('selected')) {
        pencil.classList.toggle('selected')
    }
    eraser.classList.toggle('selected');
    setColor('white');
})

canvas.addEventListener("mousedown", function (e) {
    if (pencil.classList.contains('selected') || eraser.classList.contains('selected')) {
        setMousePos(e);
        drawing = true;
    }
    //Seteo las variables posX y posY con la posicion inicial del mouse al quere dibujar
})

canvas.addEventListener("mousemove", function (evt) {
    //Si esta dibujando...
    if (drawing === true) {
        //Paso por parametros las nuevas posiciones a dibujar
        draw(evt.clientX - rect.left,
            evt.clientY - rect.top);
        //Actualizo las posiciones inciales
        setMousePos(evt);
    }
});

canvas.addEventListener("mouseup", function (e) {
    if (drawing === true) {
        //dibujo la ultima posicion del mouse cuando solto el click
        draw(e.clientX - rect.left,
            e.clientY - rect.top);
        //reinicio las posiciones del mouse
        posX = 0;
        posY = 0;
        //Hago un toggle a la varible de control
        drawing = false;
    }
})

//---------------------------- FUNCIONES DEL DRAW ------------------------------------//

function main() {
    //do something
    cleanCanvas();
}

function cleanCanvas() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
}

function draw(finX, finY) {

    ctx.beginPath();

    ctx.strokeStyle = color;
    ctx.lineWidth = range;
    ctx.moveTo(posX, posY);
    ctx.lineTo(finX, finY);
    ctx.stroke();

    ctx.closePath();

}
function myDrawImage() {
    ctx.drawImage(img, width / 2 - img.width / 2, height / 2 - img.height / 2);
}

function setMousePos(evt) {
    posX = evt.clientX - rect.left;
    posY = evt.clientY - rect.top;
}

function setColor(c) {
    if (!eraser.classList.contains('selected')) {
        color = c;
    } else {
        color = 'white'
    }
}

function setRange(g) {
    range = g;
}

//------------------------------------ FILTROS ------------------------------------------//

function addFilterGrey() {
    if (img.src == '') {
        return
    }

    let imageData = ctx.getImageData(width / 2 - img.width / 2, height / 2 - img.height / 2, img.width, img.height);

    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const gris = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = gris; // red
        data[i + 1] = gris; // green
        data[i + 2] = gris; // blue
    }

    ctx.putImageData(imageData, width / 2 - img.width / 2, height / 2 - img.height / 2);
}
function addFilterInvert() {
    if (img.src == '') {
        return
    }

    let imageData = ctx.getImageData(width / 2 - img.width / 2, height / 2 - img.height / 2, img.width, img.height);

    const data = imageData.data;


    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
    }

    ctx.putImageData(imageData, width / 2 - img.width / 2, height / 2 - img.height / 2);
}
function addFilterSepia() {
    if (img.src == '') {
        return
    }

    let imageData = ctx.getImageData(width / 2 - img.width / 2, height / 2 - img.height / 2, img.width, img.height);

    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min((data[i] * 0.393) + (data[i + 1] * 0.769) + (data[i + 2] * 0.189), 255); // red
        data[i + 1] = Math.min((data[i] * 0.349) + (data[i + 1] * 0.686) + (data[i + 2] * 0.168), 255); // green
        data[i + 2] = Math.min((data[i] * 0.272) + (data[i + 1] * 0.534) + (data[i + 2] * 0.131), 255); // blue
    }

    ctx.putImageData(imageData, width / 2 - img.width / 2, height / 2 - img.height / 2);
}