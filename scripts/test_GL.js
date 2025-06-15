"use strict";

// Get the simulation container
const container = document.getElementById('simulation-container');

// Only replace the content inside the container
container.innerHTML = `
  <canvas id='canvas'></canvas>
  <div id='uiContainer'>
    <div id='ui'>
      <div id='x'></div>
      <div id='y'></div>
      <div id='angle'></div>
      <div id='scaleX'></div>
      <div id='scaleY'></div>
    </div>
  </div>
  <!-- vertex shader -->
  <script id='vertex-shader-2d' type='x-shader/x-vertex'>
attribute vec2 a_position;
uniform mat3 u_matrix;
varying vec4 v_color;

void main() {
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
  v_color = gl_Position * 0.5 + 0.5;
}
<\/script>
  <!-- fragment shader -->
  <script id='fragment-shader-2d' type='x-shader/x-fragment'>
precision mediump float;
varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
<\/script>
`;

// Dynamically load required scripts
const scripts = [
  'https://webglfundamentals.org/webgl/resources/webgl-utils.js',
  'https://webglfundamentals.org/webgl/resources/webgl-lessons-ui.js',
  'https://webglfundamentals.org/webgl/resources/m3.js'
];

let loadedCount = 0;
scripts.forEach(src => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = () => {
    loadedCount++;
    if (loadedCount === scripts.length) {
      main();
    }
  };
  script.onerror = () => {
    console.error(`Error loading script: ${src}`);
  };
  document.body.appendChild(script);
});

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // Setup GLSL program
  const program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

  // Look up where the vertex data needs to go
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Lookup uniforms
  const matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Set Geometry
  setGeometry(gl);

  const translation = [200, 150];
  let angleInRadians = 0;
  const scale = [1, 1];

  // Setup UI after ensuring webglLessonsUI is loaded
  webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: canvas.width});
  webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: canvas.height});
  webglLessonsUI.setupSlider("#angle", {slide: updateAngle, max: 360});
  webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
  webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});

  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
      drawScene();
    };
  }

  function updateAngle(event, ui) {
    const angleInDegrees = 360 - ui.value;
    angleInRadians = angleInDegrees * Math.PI / 180;
    drawScene();
  }

  function updateScale(index) {
    return function(event, ui) {
      scale[index] = ui.value;
      drawScene();
    };
  }

  // Draw the scene
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Use our program
    gl.useProgram(program);

    // Enable attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Configure attribute
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // Compute matrix
    let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
    matrix = m3.translate(matrix, translation[0], translation[1]);
    matrix = m3.rotate(matrix, angleInRadians);
    matrix = m3.scale(matrix, scale[0], scale[1]);

    // Set matrix uniform
    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    // Draw geometry
    const primitiveType = gl.TRIANGLES;
    const count = 3;
    gl.drawArrays(primitiveType, 0, count);
  }

  // Initial draw
  drawScene();
}

// Create triangle geometry
function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, -100, 150, 125, -175, 100]),
    gl.STATIC_DRAW
  );
}