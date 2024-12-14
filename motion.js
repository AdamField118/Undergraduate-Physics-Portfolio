// Create a canvas element
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

// Get the drawing context
const ctx = canvas.getContext('2d');

// Draw a box
ctx.fillStyle = 'blue'; // Box color
const boxWidth = 100;
const boxHeight = 100;
const boxX = (canvas.width - boxWidth) / 2; // Center the box horizontally
const boxY = (canvas.height - boxHeight) / 2; // Center the box vertically
ctx.fillRect(boxX, boxY, boxWidth, boxHeight); // Draw the rectangle