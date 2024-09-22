const canvas = document.getElementById("canvas");
const body = document.querySelector('body');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let theColor = 'black';
let lineW = 5;
let prevX = null;
let prevY = null;
let draw = false;
let currentShape = 'freeDraw';
let paths = [];

body.style.backgroundColor = "#FFFFFF";


const ctx = canvas.getContext("2d");
ctx.lineWidth = lineW;

let clrs = document.querySelectorAll(".clr");
clrs = Array.from(clrs);
clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        theColor = clr.dataset.clr;
    });
});

let clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paths = [];
});

function redrawPaths() {
    paths.forEach(path => {
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.lineWidth;
        ctx.beginPath();
        if (path.type === 'line') {
            ctx.moveTo(path.x1, path.y1);
            ctx.lineTo(path.x2, path.y2);
        } else if (path.type === 'circle') {
            ctx.arc(path.x, path.y, path.radius, 0, Math.PI * 2);
        } else if (path.type === 'rectangle') {
            ctx.rect(path.x, path.y, path.width, path.height);
        } else if (path.type === 'triangle') {
            ctx.moveTo(path.x1, path.y1);
            ctx.lineTo(path.x2, path.y2);
            ctx.lineTo(path.x3, path.y3);
            ctx.closePath();
        }
        ctx.stroke();
    });
}

window.addEventListener("mousedown", (e) => {
    draw = true;
    prevX = e.clientX;
    prevY = e.clientY;
});

window.addEventListener("mouseup", (e) => {
    draw = false;
    const currentX = e.clientX;
    const currentY = e.clientY;

    if (currentShape === 'freeDraw') {
        paths.push({ 
            type: 'line', 
            x1: prevX, 
            y1: prevY, 
            x2: currentX, 
            y2: currentY, 
            color: theColor,
            lineWidth: ctx.lineWidth 
        });
    } else if (currentShape === 'circle') {
        let radius = Math.sqrt(Math.pow(currentX - prevX, 2) + Math.pow(currentY - prevY, 2));
        paths.push({
            type: 'circle',
            x: prevX,
            y: prevY,
            radius: radius,
            color: theColor,
            lineWidth: ctx.lineWidth
        });
    } else if (currentShape === 'rectangle') {
        paths.push({
            type: 'rectangle',
            x: prevX,
            y: prevY,
            width: currentX - prevX,
            height: currentY - prevY,
            color: theColor,
            lineWidth: ctx.lineWidth
        });
    } else if (currentShape === 'triangle') {
        paths.push({
            type: 'triangle',
            x1: prevX,
            y1: prevY,
            x2: currentX,
            y2: currentY,
            x3: prevX - (currentX - prevX),
            y3: currentY,
            color: theColor,
            lineWidth: ctx.lineWidth
        });
    }

    redrawPaths();
    ctx.beginPath();
});

window.addEventListener("mousemove", (e) => {
    if (!draw) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    if (currentShape === 'freeDraw') {
        ctx.strokeStyle = theColor;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        paths.push({ 
            type: 'line', 
            x1: prevX, 
            y1: prevY, 
            x2: currentX, 
            y2: currentY, 
            color: theColor,
            lineWidth: ctx.lineWidth 
        });

        prevX = currentX;
        prevY = currentY;
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redrawPaths();

        ctx.strokeStyle = theColor;
        ctx.beginPath();
        if (currentShape === 'circle') {
            let radius = Math.sqrt(Math.pow(currentX - prevX, 2) + Math.pow(currentY - prevY, 2));
            ctx.arc(prevX, prevY, radius, 0, Math.PI * 2);
        } else if (currentShape === 'rectangle') {
            ctx.rect(prevX, prevY, currentX - prevX, currentY - prevY);
        } else if (currentShape === 'triangle') {
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(currentX, currentY);
            ctx.lineTo(prevX - (currentX - prevX), currentY);
            ctx.closePath();
        }
        ctx.stroke();
    }
});

document.getElementById("circleBtn").addEventListener("click", () => {
    currentShape = 'circle';
});
document.getElementById("rectBtn").addEventListener("click", () => {
    currentShape = 'rectangle';
});
document.getElementById("triangleBtn").addEventListener("click", () => {
    currentShape = 'triangle';
});
document.getElementById("freeDrawBtn").addEventListener("click", () => {
    currentShape = 'freeDraw';
});

