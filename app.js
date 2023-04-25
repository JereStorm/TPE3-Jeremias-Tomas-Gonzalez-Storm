"use strict"

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();

const width = canvas.width;
const height = canvas.height;

const pencil = document.getElementById("pencil");
const eraser = document.getElementById("eraser");
const color_sl = document.getElementById("color-selector");
const range_sl = document.getElementById("range");

let posX = 0;
let posY = 0;

let drawing = false;

let color = color_sl.value;
let range = range_sl.value;

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