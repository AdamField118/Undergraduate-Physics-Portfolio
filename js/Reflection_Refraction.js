const angle = document.createElement('input');
angle.id = 'angle';
angle.type = 'number';
angle.placeholder = 'Incident angle, starts 45';
document.body.appendChild(angle);

const n0 = document.createElement('input');
n0.id = 'n0';
n0.type = 'number';
n0.placeholder = 'n\u2080 here, starts n\u2080=1';
document.body.appendChild(n0);

const n1 = document.createElement('input');
n1.id = 'n1';
n1.type = 'number';
n1.placeholder = 'n\u2081 here, starts n\u2081=1.5';
document.body.appendChild(n1);

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

// Draw interface (air-glass boundary)
ctx.beginPath();
ctx.moveTo(0, canvas.height / 2);
ctx.lineTo(canvas.width, canvas.height / 2);
ctx.strokeStyle = 'black';
ctx.stroke();

// Draw normal
ctx.setLineDash([5, 5]);
ctx.beginPath();
ctx.moveTo((canvas.width / 2), 0);
ctx.lineTo((canvas.width / 2), canvas.height - 10);
ctx.stroke();
ctx.setLineDash([]);

// Draw incident ray
const incidentAngle = Math.PI / 4;
const rayLength = 150;
const startX = canvas.width / 4;
const startY = canvas.height / 2 - rayLength * Math.tan(incidentAngle);
ctx.beginPath();
ctx.moveTo(startX, startY);
ctx.lineTo(canvas.width / 2, canvas.height / 2);
ctx.strokeStyle = 'blue';
ctx.stroke();

// Calculate refraction (Snell's Law: n1*sin(theta1) = n2*sin(theta2))
const n2 = 1; // Air
const n3 = 1.5; // Glass
const thetaT = Math.asin((n2 / n3) * Math.sin(incidentAngle));

// Draw reflected ray
const endXR = (canvas.width / 2) + startX;
const endYR = startY;
ctx.beginPath();
ctx.moveTo(canvas.width / 2, canvas.height / 2);
ctx.lineTo(endXR, endYR);
ctx.strokeStyle = 'green';
ctx.stroke();

// Draw refracted ray
const endXT = canvas.width / 2 + rayLength * Math.cos(thetaT);
const endYT = canvas.height / 2 + rayLength * Math.sin(thetaT);
ctx.beginPath();
ctx.moveTo(canvas.width / 2, canvas.height / 2);
ctx.lineTo(endXT, endYT);
ctx.strokeStyle = 'red';
ctx.stroke();

//labels
ctx.fillText('n\u2080', 10, 180);
ctx.fillText('n\u2081', 10, 210);
ctx.fillStyle = 'blue';
ctx.fillText('Incident Ray', startX - 30, startY - 10);
ctx.fillStyle = 'green';
ctx.fillText('Reflected Ray', endXR - 30, endYR - 10);
ctx.fillStyle = 'red';
ctx.fillText('Refracted Ray', endXT - 30, endYT + 10);

function reload(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw interface (air-glass boundary)
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Draw normal
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo((canvas.width / 2), 0);
    ctx.lineTo((canvas.width / 2), canvas.height - 10);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw incident ray
    const incidentAngle = (document.getElementById('angle').value * Math.PI) / 180;
    const rayLength = 150;
    const startX = canvas.width / 4;
    const startY = canvas.height / 2 - rayLength * Math.tan(incidentAngle);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(canvas.width / 2, canvas.height / 2);
    ctx.strokeStyle = 'blue';
    ctx.stroke();

    // Calculate refraction (Snell's Law: n1*sin(theta1) = n2*sin(theta2))
    const n2 = document.getElementById('n0').value
    const n3 = document.getElementById('n1').value
    const thetaT = Math.asin((n2 / n3) * Math.sin(incidentAngle));

    // Draw reflected ray
    const endXR = (canvas.width / 2) + startX;
    const endYR = startY;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.lineTo(endXR, endYR);
    ctx.strokeStyle = 'green';
    ctx.stroke();

    // Draw refracted ray
    const endXT = canvas.width / 2 + rayLength * Math.cos(thetaT);
    const endYT = canvas.height / 2 + rayLength * Math.sin(thetaT);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.lineTo(endXT, endYT);
    ctx.strokeStyle = 'red';
    ctx.stroke();

    //labels
    ctx.fillStyle = 'black';
    ctx.fillText('n\u2080', 10, 180);
    ctx.fillText('n\u2081', 10, 210);
    ctx.fillStyle = 'blue';
    ctx.fillText('Incident Ray', startX - 30, Math.max(startY - 10, 10));
    ctx.fillStyle = 'green';
    ctx.fillText('Reflected Ray', endXR - 30, Math.max(endYR - 10, 10));
    ctx.fillStyle = 'red';
    ctx.fillText('Refracted Ray', endXT - 30, Math.min(endYT + 10, canvas.height - 10));
}

refresh.addEventListener("click", reload);