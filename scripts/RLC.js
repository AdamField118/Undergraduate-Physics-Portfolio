const resistance = document.createElement('input');
resistance.id = 'R';
resistance.type = 'number';
resistance.placeholder = 'Enter resistance (\u03a9)';
document.body.appendChild(resistance);

const inductance = document.createElement('input');
inductance.id = 'L';
inductance.type = 'number';
inductance.placeholder = 'Enter inductance (H)';
document.body.appendChild(inductance);

const capacitance = document.createElement('input');
capacitance.id = 'C';
capacitance.type = 'number';
capacitance.placeholder = 'Enter capacitance (F)';
document.body.appendChild(capacitance);

const refresh = document.createElement('button');
refresh.style = 'height:25px;width:100px';
refresh.textContent = 'RELOAD';
document.body.appendChild(refresh);

const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 380;
document.body.appendChild(canvas);

function center() {
    canvas.style.position = "absolute";
    canvas.style.left = ((window.innerWidth - canvas.width) / 2) + "px";
    canvas.style.top = ((window.innerHeight - canvas.height) / 2) + 40 + "px";
}

center(); // Center the canvas initially

// Recenter canvas on window resize
window.addEventListener("resize", center);

// Get the drawing context
const ctx = canvas.getContext('2d');

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function makeResistor(position, orientation) {
    // position is of the center of the component
    // orientation true=vertical, false=horizontal
    let [x, y] = position;
    if (orientation) {
        ctx.beginPath();
        ctx.moveTo(x, y-20);
        ctx.lineTo(x, y-14);
        ctx.lineTo(x+6, y-10);
        ctx.lineTo(x-6, y-6);
        ctx.lineTo(x+6, y-2);
        ctx.lineTo(x-6, y+2);
        ctx.lineTo(x+6, y+6);
        ctx.lineTo(x-6, y+10);
        ctx.lineTo(x, y+14);
        ctx.lineTo(x, y+20);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText('R', x-20, y+3);
    }
    else {
        ctx.beginPath();
        ctx.moveTo(x-20, y);
        ctx.lineTo(x-14, y);
        ctx.lineTo(x-10, y+6);
        ctx.lineTo(x-6, y-6);
        ctx.lineTo(x-2, y+6);
        ctx.lineTo(x+2, y-6);
        ctx.lineTo(x+6, y+6);
        ctx.lineTo(x+10, y-6);
        ctx.lineTo(x+14, y);
        ctx.lineTo(x+20, y);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText('R', x-4, y-12);
    };
}
function makeCapacitor(position, orientation) {
    // position is of the center of the component
    // orientation true=vertical, false=horizontal
    let [x, y] = position;
    if (orientation) {
        ctx.beginPath();
        ctx.moveTo(x, y-20);
        ctx.lineTo(x, y-4);
        ctx.lineTo(x+10, y-4);
        ctx.lineTo(x-10, y-4);
        ctx.moveTo(x, y+20);
        ctx.lineTo(x, y+4)
        ctx.lineTo(x+10, y+4);
        ctx.lineTo(x-10, y+4);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText('C', x-25, y+3);
    }
    else {
        ctx.beginPath();
        ctx.moveTo(x-20, y);
        ctx.lineTo(x-4, y);
        ctx.lineTo(x-4, y+10);
        ctx.lineTo(x-4, y-10);
        ctx.moveTo(x+20, y);
        ctx.lineTo(x+4, y)
        ctx.lineTo(x+4, y+10);
        ctx.lineTo(x+4, y-10);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText('C', x-4, y-17);
    };
}
function makeInductor(position, orientation) {
    // position is of the center of the component
    // orientation true=vertical, false=horizontal
    let [x, y] = position;
    if (orientation) {
        ctx.beginPath();
        ctx.moveTo(x, y-20);
        ctx.lineTo(x, y-14);
        ctx.arc(x, y-7, 7, degreesToRadians(270), degreesToRadians(630), false)
        ctx.moveTo(x, y-10);
        ctx.arc(x, y-3, 7, degreesToRadians(270), degreesToRadians(630), false)
        ctx.moveTo(x, y-6);
        ctx.arc(x, y+1, 7, degreesToRadians(270), degreesToRadians(630), false)
        ctx.moveTo(x, y-2);
        ctx.arc(x, y+5, 7, degreesToRadians(270), degreesToRadians(630), false)
        ctx.moveTo(x, y);
        ctx.arc(x, y+7, 7, degreesToRadians(270), degreesToRadians(630), false)
        ctx.moveTo(x, y+20);
        ctx.lineTo(x, y+14);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText('L', x-20, y+3);
    }
    else {
        ctx.beginPath();
        ctx.moveTo(x-20, y);
        ctx.lineTo(x-14, y);
        ctx.arc(x-7, y, 7, degreesToRadians(180), degreesToRadians(540), false)
        ctx.moveTo(x-10, y);
        ctx.arc(x-3, y, 7, degreesToRadians(180), degreesToRadians(540), false)
        ctx.moveTo(x-6, y);
        ctx.arc(x+1, y, 7, degreesToRadians(180), degreesToRadians(540), false)
        ctx.moveTo(x-2, y);
        ctx.arc(x+5, y, 7, degreesToRadians(180), degreesToRadians(540), false)
        ctx.moveTo(x, y);
        ctx.arc(x+7, y, 7, degreesToRadians(180), degreesToRadians(540), false)
        ctx.moveTo(x+20, y);
        ctx.lineTo(x+14, y);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText('L', x-4, y-12);
    };
}
function makeBattery(position, orientation, direction) {
    // position is of the center of the component
    // orientation true=vertical, false=horizontal
    // direction true=negative left or up, false=negative right or down
    let [x, y] = position;
    if (orientation && direction) {
        ctx.beginPath();
        ctx.moveTo(x, y-20);
        ctx.lineTo(x, y-4);
        ctx.lineTo(x+5, y-4);
        ctx.lineTo(x-5, y-4);
        ctx.moveTo(x, y+20);
        ctx.lineTo(x, y+4)
        ctx.lineTo(x+10, y+4);
        ctx.lineTo(x-10, y+4);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText('\u2212', x-12, y-4);
    }
    else if (orientation && !direction) {
        ctx.beginPath();
        ctx.moveTo(x, y-20);
        ctx.lineTo(x, y-4);
        ctx.lineTo(x+10, y-4);
        ctx.lineTo(x-10, y-4);
        ctx.moveTo(x, y+20);
        ctx.lineTo(x, y+4)
        ctx.lineTo(x+5, y+4);
        ctx.lineTo(x-5, y+4);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText('\u2212', x-12, y+10);
    }
    else if (!orientation && direction) {
        ctx.beginPath();
        ctx.moveTo(x-20, y);
        ctx.lineTo(x-4, y);
        ctx.lineTo(x-4, y+5);
        ctx.lineTo(x-4, y-5);
        ctx.moveTo(x+20, y);
        ctx.lineTo(x+4, y)
        ctx.lineTo(x+4, y+10);
        ctx.lineTo(x+4, y-10);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText('\u2212', x-12, y-6);
    }
    else {
        ctx.beginPath();
        ctx.moveTo(x-20, y);
        ctx.lineTo(x-4, y);
        ctx.lineTo(x-4, y+10);
        ctx.lineTo(x-4, y-10);
        ctx.moveTo(x+20, y);
        ctx.lineTo(x+4, y)
        ctx.lineTo(x+4, y+5);
        ctx.lineTo(x+4, y-5);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText('\u2212', x+6, y-6);
    };
}
// U+223F for sin wave U+25B2 for filled triangle
function makeACSource(position, orientation, direction) {
    // position is of the center of the component
    // orientation true=vertical, false=horizontal
    // direction true=current up or left, false=current down or right
    let [x, y] = position;
    if (orientation && direction) {
        ctx.beginPath();
        ctx.moveTo(x, y-20);
        ctx.lineTo(x, y-10);
        ctx.arc(x, y, 10, degreesToRadians(270), degreesToRadians(630), false)
        ctx.moveTo(x, y+20);
        ctx.lineTo(x, y+10);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.font = "27px arial";
        ctx.fillText('\u223f', x-9, y+8);
        ctx.font = "8px serif";
        ctx.fillText('\u25b2', x-4, y-16);
        ctx.fillText('I', x-8, y-16);
        ctx.fillText('V', x-20, y+2);
    }
    else if(orientation && !direction) {
        ctx.beginPath();
        ctx.moveTo(x, y-20);
        ctx.lineTo(x, y-10);
        ctx.arc(x, y, 10, degreesToRadians(270), degreesToRadians(630), false)
        ctx.moveTo(x, y+20);
        ctx.lineTo(x, y+10);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.font = "27px arial";
        ctx.fillText('\u223f', x-9, y+8);
        ctx.font = "8px serif";
        ctx.fillText('\u25bc', x-4, y+22);
        ctx.fillText('I', x-8, y+22);
        ctx.fillText('V', x-20, y+2);
    }
    else if(!orientation && direction) {
        ctx.beginPath();
        ctx.moveTo(x-20, y);
        ctx.lineTo(x-10, y);
        ctx.arc(x, y, 10, degreesToRadians(180), degreesToRadians(540), false)
        ctx.moveTo(x+20, y);
        ctx.lineTo(x+10, y);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.font = "27px arial";
        ctx.fillText('\u223f', x-9, y+8);
        ctx.font = "8px serif";
        ctx.fillText('\u25b6', x+16, y+3);
        ctx.fillText('I', x+18, y-8);
        ctx.fillText('V', x-3, y-14);
    }
    else {
        ctx.beginPath();
        ctx.moveTo(x-20, y);
        ctx.lineTo(x-10, y);
        ctx.arc(x, y, 10, degreesToRadians(180), degreesToRadians(540), false)
        ctx.moveTo(x+20, y);
        ctx.lineTo(x+10, y);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.font = "27px arial";
        ctx.fillText('\u223f', x-9, y+8);
        ctx.font = "8px serif";
        ctx.fillText('\u25c0', x-24, y+3);
        ctx.fillText('I', x-24, y-8);
        ctx.fillText('V', x-3, y-14);
    };
}
function makeWire(start, end, initialOrientation, endOrientation){
    // initialOrientation true=vertical, false=horizontal
    // endOrientation true=vertical, false=horizontal
    // start and end cords are the center of the respective component
    let [startX, startY] = start;
    let [endX, endY] = end;
    if (initialOrientation && endOrientation) {
        ctx.moveTo(startX, startY+20)
        ctx.lineTo(endX, endY-20)
    }
    else if (!initialOrientation && !endOrientation) {
        ctx.moveTo(startX+20, startY)
        ctx.lineTo(endX-20, endY)
    }
    else if (initialOrientation && !endOrientation && startX<endX) {
        ctx.moveTo(startX, startY-20)
        ctx.lineTo(startX, endY)
        ctx.lineTo(endX-20, endY)
    }
    else if (initialOrientation && !endOrientation && endX<startX) {
        ctx.moveTo(startX, startY+20)
        ctx.lineTo(startX, endY)
        ctx.lineTo(endX+20, endY)
    }
    else if((!initialOrientation && endOrientation && startX<endX)) {
        ctx.moveTo(startX+20, startY)
        ctx.lineTo(endX, startY)
        ctx.lineTo(endX, endY-20)
    }
    else {
        ctx.moveTo(startX-20, startY)
        ctx.lineTo(endX, startY)
        ctx.lineTo(endX, endY+20)
    }
    ctx.strokeStyle = 'black';
        ctx.stroke();
}
function drawRLC(center, source, resistor, capacitor, inductor) {
    let sO = source[0];
    let sD = source[1];
    let rO = resistor;
    let cO = capacitor;
    let iO = inductor;
    let [sX, sY] = [center[0]-50, center[1]];
    let [rX, rY] = [center[0], center[1]-50];
    let [cX, cY] = [center[0]+50, center[1]];
    let [iX, iY] = [center[0], center[1]+50];

    makeACSource([sX, sY], sO, sD);
    makeWire([sX, sY], [rX, rY], sO, rO)
    makeResistor([rX, rY], rO);
    makeWire([rX, rY], [cX, cY], rO, cO)
    makeCapacitor([cX, cY], cO);
    makeWire([cX, cY], [iX, iY], cO, iO)
    makeInductor([iX, iY], iO);
    makeWire([iX, iY], [sX, sY], iO, sO)
}
// here is a display of all the components and variants currently available!
// makeResistor([400, 190], true)
// makeResistor([500, 190], false)
// makeCapacitor([300, 190], true)
// makeCapacitor([200, 190], false)
// makeInductor([400, 140], true)
// makeInductor([500, 140], false)
// makeBattery([300, 140], true, true)
// makeBattery([200, 140], true, false)
// makeBattery([300, 240], false, true)
// makeBattery([200, 240], false, false)
// makeACSource([400, 240], true, true)
// makeACSource([500, 240], true, false)
// makeACSource([600, 240], false, true)
// makeACSource([600, 190], false, false)

drawRLC([400, 190], [true, true], false, true, false);