"use strict";

// Black Hole WebGL Simulation - Following https://github.com/kavan010/black_hole

const container = document.getElementById('simulation-container');

container.innerHTML = `
    <div class="black-hole-container">
        <div class="controls-panel">
            <div class="control-group">
                <label>Integration Steps</label>
                <input type="range" id="stepsSlider" min="1000" max="50000" step="1000" value="10000">
                <span id="stepsValue">10000</span>
            </div>
            <div class="control-group">
                <label>Step Size (D_LAMBDA)</label>
                <input type="range" id="stepSizeSlider" min="5e6" max="2e7" step="1e6" value="1e7">
                <span id="stepSizeValue">1e7</span>
            </div>
            <div class="control-group">
                <label>Camera Distance</label>
                <input type="range" id="distanceSlider" min="2e10" max="2e11" step="1e10" value="6.34194e10">
                <span id="distanceValue">63.4</span>
            </div>
            <div class="control-group">
                <label>Accretion Disk</label>
                <input type="checkbox" id="diskToggle" checked>
            </div>
            <button id="resetCamera">Reset View</button>
        </div>
        <canvas id="blackHoleCanvas"></canvas>
        <div class="info-panel">
            <div class="fps-counter">FPS: <span id="fpsDisplay">--</span></div>
            <div class="physics-info">
                <div>Rs: 12.69 million km</div>
                <div>Camera: <span id="cameraInfo">--</span></div>
            </div>
        </div>
    </div>
`;

const style = document.createElement('style');
style.textContent = `
    .black-hole-container {
        width: 100%;
        height: 90vh;
        position: relative;
        background: #000;
        overflow: hidden;
        border-radius: 8px;
    }
    
    .controls-panel {
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.9);
        padding: 15px;
        border-radius: 8px;
        color: white;
        z-index: 100;
        min-width: 200px;
        font-family: 'Courier New', monospace;
        font-size: 11px;
    }
    
    .control-group {
        margin-bottom: 12px;
    }
    
    .control-group label {
        display: block;
        font-size: 10px;
        margin-bottom: 4px;
        color: #ccc;
    }
    
    .control-group input[type="range"] {
        width: 100%;
        margin: 3px 0;
    }
    
    .control-group span {
        font-size: 9px;
        color: #0ff;
    }
    
    #blackHoleCanvas {
        width: 100%;
        height: 100%;
        display: block;
        cursor: grab;
    }
    
    .info-panel {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.9);
        padding: 10px;
        border-radius: 8px;
        color: white;
        font-size: 10px;
        font-family: 'Courier New', monospace;
        z-index: 100;
        margin-bottom: 6em;
    }
    
    .fps-counter {
        color: #0f0;
        margin-bottom: 5px;
    }
`;
document.head.appendChild(style);

class BlackHoleSimulation {
    constructor() {
        this.canvas = document.getElementById('blackHoleCanvas');
        this.gl = null;
        this.program = null;
        this.uniforms = {};
        this.buffer = null;
        
        // Constants matching
        this.SAGA_RS = 1.269e10; // Schwarzschild radius in meters
        this.D_LAMBDA = 1e7;     // Integration step size
        this.ESCAPE_R = 1e14;    // Escape radius
        
        // Camera parameters
        this.cameraRadius = 6.34194e10;
        this.azimuth = 0.0;
        this.elevation = Math.PI / 2.0;
        this.target = [0, 0, 0];
        
        // Simulation parameters
        this.maxSteps = 10000;
        this.diskEnabled = true;
        
        // Interaction
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        // Performance
        this.frameCount = 0;
        this.lastTime = 0;
        
        this.init();
    }
    
    init() {
        this.setupWebGL();
        this.createShaderProgram();
        this.createGeometry();
        this.setupEventListeners();
        this.updateDisplays();
        this.animate();
    }
    
    setupWebGL() {
        const gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }
        
        this.gl = gl;
        this.resizeCanvas();
        
        gl.clearColor(0.0, 0.0, 0.02, 1.0);
        
        // Enable floating point textures if available
        const floatExt = gl.getExtension('OES_texture_float') || gl.getExtension('EXT_color_buffer_float');
        if (!floatExt) {
            console.warn('Float textures not fully supported');
        }
    }
    
    createShaderProgram() {
        const gl = this.gl;
        
        // Vertex shader - simple fullscreen quad
        const vertexSource = `
            precision highp float;
            attribute vec2 position;
            varying vec2 vTexCoord;
            void main() {
                vTexCoord = position * 0.5 + 0.5;
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;
        
        // Fragment shader - direct port from geodesic.comp
        const fragmentSource = `
            precision highp float;
            varying vec2 vTexCoord;
            
            uniform vec2 resolution;
            uniform float time;
            
            // Camera uniforms
            uniform vec3 camPos;
            uniform vec3 camRight;  
            uniform vec3 camUp;
            uniform vec3 camForward;
            uniform float tanHalfFov;
            uniform float aspect;
            
            // Simulation uniforms
            uniform int maxSteps;
            uniform float dLambda;
            uniform bool diskEnabled;
            
            // Constants
            const float SagA_rs = 1.269e10;
            const float ESCAPE_R = 1e14;
            
            // Disk parameters
            const float disk_r1 = 2.2 * 1.269e10;
            const float disk_r2 = 5.2 * 1.269e10;
            
            // Ray struct
            struct Ray {
                float x, y, z;
                float r, theta, phi;
                float dr, dtheta, dphi;
                float E, L;
            };
            
            // Initialize ray
            Ray initRay(vec3 pos, vec3 dir) {
                Ray ray;
                ray.x = pos.x;
                ray.y = pos.y; 
                ray.z = pos.z;
                
                ray.r = length(pos);
                ray.theta = acos(pos.z / ray.r);
                ray.phi = atan(pos.y, pos.x);
                
                float dx = dir.x, dy = dir.y, dz = dir.z;
                ray.dr     = sin(ray.theta)*cos(ray.phi)*dx + sin(ray.theta)*sin(ray.phi)*dy + cos(ray.theta)*dz;
                ray.dtheta = (cos(ray.theta)*cos(ray.phi)*dx + cos(ray.theta)*sin(ray.phi)*dy - sin(ray.theta)*dz) / ray.r;
                ray.dphi   = (-sin(ray.phi)*dx + cos(ray.phi)*dy) / (ray.r * sin(ray.theta));
                
                ray.L = ray.r * ray.r * sin(ray.theta) * ray.dphi;
                float f = 1.0 - SagA_rs / ray.r;
                float dt_dL = sqrt((ray.dr*ray.dr)/f + ray.r*ray.r*(ray.dtheta*ray.dtheta + sin(ray.theta)*sin(ray.theta)*ray.dphi*ray.dphi));
                ray.E = f * dt_dL;
                
                return ray;
            }
            
            // Geodesic RHS 
            void geodesicRHS(Ray ray, out vec3 d1, out vec3 d2) {
                float r = ray.r, theta = ray.theta;
                float dr = ray.dr, dtheta = ray.dtheta, dphi = ray.dphi;
                float f = 1.0 - SagA_rs / r;
                float dt_dL = ray.E / f;

                d1 = vec3(dr, dtheta, dphi);
                d2.x = - (SagA_rs / (2.0 * r*r)) * f * dt_dL * dt_dL
                     + (SagA_rs / (2.0 * r*r * f)) * dr * dr
                     + r * (dtheta*dtheta + sin(theta)*sin(theta)*dphi*dphi);
                d2.y = -2.0*dr*dtheta/r + sin(theta)*cos(theta)*dphi*dphi;
                d2.z = -2.0*dr*dphi/r - 2.0*cos(theta)/(sin(theta)) * dtheta * dphi;
            }
            
            // Simple step function with adaptive step size
            void rk4Step(inout Ray ray, float dL) {
                vec3 k1a, k1b;
                geodesicRHS(ray, k1a, k1b);

                // Adaptive step size: larger steps when far from black hole
                float adaptiveDL = dL * clamp(ray.r / SagA_rs, 1.0, 10.0);

                ray.r      += adaptiveDL * k1a.x;
                ray.theta  += adaptiveDL * k1a.y;
                ray.phi    += adaptiveDL * k1a.z;
                ray.dr     += adaptiveDL * k1b.x;
                ray.dtheta += adaptiveDL * k1b.y;
                ray.dphi   += adaptiveDL * k1b.z;

                ray.x = ray.r * sin(ray.theta) * cos(ray.phi);
                ray.y = ray.r * sin(ray.theta) * sin(ray.phi);
                ray.z = ray.r * cos(ray.theta);
            }
            
            // Check if ray crosses equatorial plane (disk intersection)
            bool crossesEquatorialPlane(vec3 oldPos, vec3 newPos) {
                bool crossed = (oldPos.y * newPos.y < 0.0);
                float r = length(vec2(newPos.x, newPos.z));
                return crossed && (r >= disk_r1 && r <= disk_r2);
            }
            
            // Ray intercept with black hole
            bool intercept(Ray ray, float rs) {
                return ray.r <= rs;
            }
            
            void main() {
                vec2 pix = gl_FragCoord.xy;
                int WIDTH = int(resolution.x);
                int HEIGHT = int(resolution.y);
                
                if (pix.x >= float(WIDTH) || pix.y >= float(HEIGHT)) {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                    return;
                }
                
                // Camera ray setup 
                float u = (2.0 * (pix.x + 0.5) / float(WIDTH) - 1.0) * aspect * tanHalfFov;
                float v = (1.0 - 2.0 * (pix.y + 0.5) / float(HEIGHT)) * tanHalfFov;
                vec3 dir = normalize(u * camRight + v * camUp + camForward);
                
                Ray ray = initRay(camPos, dir);
                
                vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
                vec3 prevPos = vec3(ray.x, ray.y, ray.z);
                
                bool hitBlackHole = false;
                bool hitDisk = false;
                
                // Ray marching loop
                for (int i = 0; i < 100000; i++) {
                    if (i >= maxSteps) break;
                    
                    if (intercept(ray, SagA_rs)) {
                        hitBlackHole = true;
                        break;
                    }
                    
                    rk4Step(ray, dLambda);
                    
                    vec3 newPos = vec3(ray.x, ray.y, ray.z);
                    
                    if (diskEnabled && crossesEquatorialPlane(prevPos, newPos)) {
                        hitDisk = true;
                        break;
                    }
                    
                    prevPos = newPos;
                    
                    // Better early termination: exit much sooner when clearly escaped
                    if (ray.r > SagA_rs * 100.0) {
                        // Escaped to infinity - render background
                        break;
                    }
                }
                
                if (hitDisk) {
                    // Accretion disk color
                    float r = length(vec3(ray.x, ray.y, ray.z)) / disk_r2;
                    vec3 diskColor = vec3(1.0, r, 0.2);
                    color = vec4(diskColor, 1.0);
                } else if (hitBlackHole) {
                    // Black hole - pure black
                    color = vec4(0.0, 0.0, 0.0, 1.0);
                } else {
                    // Background stars
                    vec3 rayDir = normalize(vec3(ray.x, ray.y, ray.z));
                    float stars = 0.0;
                    
                    // Simple star field
                    vec3 p = rayDir * 100.0;
                    for (int j = 0; j < 4; j++) {
                        vec3 q = fract(p + float(j) * 0.1) - 0.5;
                        float d = length(q);
                        stars += smoothstep(0.4, 0.0, d) / pow(2.0, float(j));
                        p *= 2.0;
                    }
                    
                    color = vec4(vec3(0.8, 0.9, 1.0) * stars * 0.5 + vec3(0.02, 0.03, 0.05), 1.0);
                }
                
                gl_FragColor = color;
            }
        `;
        
        // Compile shaders
        const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentSource);
        
        if (!vertexShader || !fragmentShader) return;
        
        // Create program
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(this.program));
            return;
        }
        
        // Get uniform locations
        this.uniforms = {
            resolution: gl.getUniformLocation(this.program, 'resolution'),
            time: gl.getUniformLocation(this.program, 'time'),
            camPos: gl.getUniformLocation(this.program, 'camPos'),
            camRight: gl.getUniformLocation(this.program, 'camRight'),
            camUp: gl.getUniformLocation(this.program, 'camUp'),
            camForward: gl.getUniformLocation(this.program, 'camForward'),
            tanHalfFov: gl.getUniformLocation(this.program, 'tanHalfFov'),
            aspect: gl.getUniformLocation(this.program, 'aspect'),
            maxSteps: gl.getUniformLocation(this.program, 'maxSteps'),
            dLambda: gl.getUniformLocation(this.program, 'dLambda'),
            diskEnabled: gl.getUniformLocation(this.program, 'diskEnabled')
        };
    }
    
    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
            return null;
        }
        
        return shader;
    }
    
    createGeometry() {
        const gl = this.gl;
        
        // Fullscreen quad
        const vertices = new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1
        ]);
        
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }
    
    setupEventListeners() {
        const canvas = this.canvas;
        
        // Mouse interaction
        canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            this.resizeCanvas(); // Trigger resolution scaling
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const deltaX = e.clientX - this.lastMouseX;
            const deltaY = e.clientY - this.lastMouseY;
            
            this.azimuth -= deltaX * 0.01;
            this.elevation = Math.max(0.1, Math.min(Math.PI - 0.1, this.elevation - deltaY * 0.01));
            
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });
        
        canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.resizeCanvas(); // Return to full resolution
        });
        
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const factor = 1.1;
            if (e.deltaY > 0) {
                this.cameraRadius *= factor;
            } else {
                this.cameraRadius /= factor;
            }
            this.cameraRadius = Math.max(2e10, Math.min(5e11, this.cameraRadius));
            document.getElementById('distanceSlider').value = this.cameraRadius;
            this.updateDisplays();
        });
        
        // Controls
        document.getElementById('stepsSlider').addEventListener('input', (e) => {
            this.maxSteps = parseInt(e.target.value);
            this.updateDisplays();
        });
        
        document.getElementById('stepSizeSlider').addEventListener('input', (e) => {
            this.D_LAMBDA = parseFloat(e.target.value);
            this.updateDisplays();
        });
        
        document.getElementById('distanceSlider').addEventListener('input', (e) => {
            this.cameraRadius = parseFloat(e.target.value);
            this.updateDisplays();
        });
        
        document.getElementById('diskToggle').addEventListener('change', (e) => {
            this.diskEnabled = e.target.checked;
        });
        
        document.getElementById('resetCamera').addEventListener('click', () => {
            this.cameraRadius = 6.34194e10;
            this.azimuth = 0.0;
            this.elevation = Math.PI / 2.0;
            document.getElementById('distanceSlider').value = this.cameraRadius;
            this.updateDisplays();
        });
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
    
    updateDisplays() {
        document.getElementById('stepsValue').textContent = this.maxSteps.toString();
        document.getElementById('stepSizeValue').textContent = this.D_LAMBDA.toExponential(0);
        document.getElementById('distanceValue').textContent = (this.cameraRadius / 1e9).toFixed(1) + ' Gm';
        document.getElementById('cameraInfo').textContent = (this.cameraRadius / this.SAGA_RS).toFixed(1) + ' Rs';
    }
    
    resizeCanvas() {
        const canvas = this.canvas;
        const rect = canvas.getBoundingClientRect();
        
        // Resolution scaling: 1/4 resolution when moving, full when still
        const pixelRatio = this.isDragging ? 0.25 : 1.0;
        
        canvas.width = rect.width * pixelRatio;
        canvas.height = rect.height * pixelRatio;
        
        if (this.gl) {
            this.gl.viewport(0, 0, canvas.width, canvas.height);
        }
    }
    
    getCameraVectors() {
        // Calculate camera position (spherical to cartesian)
        const x = this.cameraRadius * Math.sin(this.elevation) * Math.cos(this.azimuth);
        const y = this.cameraRadius * Math.cos(this.elevation);
        const z = this.cameraRadius * Math.sin(this.elevation) * Math.sin(this.azimuth);
        
        const pos = [x, y, z];
        const forward = [-x/this.cameraRadius, -y/this.cameraRadius, -z/this.cameraRadius]; // toward origin
        const up = [0, 1, 0];
        
        // Right = forward x up
        const right = [
            forward[1] * up[2] - forward[2] * up[1],
            forward[2] * up[0] - forward[0] * up[2], 
            forward[0] * up[1] - forward[1] * up[0]
        ];
        
        // Normalize right
        const rightLen = Math.sqrt(right[0]*right[0] + right[1]*right[1] + right[2]*right[2]);
        right[0] /= rightLen; right[1] /= rightLen; right[2] /= rightLen;
        
        // Real up = right x forward
        const realUp = [
            right[1] * forward[2] - right[2] * forward[1],
            right[2] * forward[0] - right[0] * forward[2],
            right[0] * forward[1] - right[1] * forward[0]
        ];
        
        return { pos, forward, right, realUp };
    }
    
    render(time) {
        const gl = this.gl;
        
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.program);
        
        const camera = this.getCameraVectors();
        
        // Set uniforms
        gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        gl.uniform1f(this.uniforms.time, time * 0.001);
        
        // Camera uniforms
        gl.uniform3fv(this.uniforms.camPos, camera.pos);
        gl.uniform3fv(this.uniforms.camRight, camera.right);
        gl.uniform3fv(this.uniforms.camUp, camera.realUp);
        gl.uniform3fv(this.uniforms.camForward, camera.forward);
        gl.uniform1f(this.uniforms.tanHalfFov, Math.tan(Math.PI / 6)); // 60 degrees / 2
        gl.uniform1f(this.uniforms.aspect, this.canvas.width / this.canvas.height);
        
        // Simulation uniforms
        gl.uniform1i(this.uniforms.maxSteps, this.maxSteps);
        gl.uniform1f(this.uniforms.dLambda, this.D_LAMBDA);
        gl.uniform1i(this.uniforms.diskEnabled, this.diskEnabled ? 1 : 0);
        
        // Draw fullscreen quad
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        const posAttrib = gl.getAttribLocation(this.program, 'position');
        gl.enableVertexAttribArray(posAttrib);
        gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        // FPS
        this.frameCount++;
        if (time - this.lastTime > 1000) {
            const fps = Math.round(this.frameCount * 1000 / (time - this.lastTime));
            document.getElementById('fpsDisplay').textContent = fps;
            this.frameCount = 0;
            this.lastTime = time;
        }
    }
    
    animate() {
        const loop = (time) => {
            this.render(time);
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BlackHoleSimulation();
    });
} else {
    new BlackHoleSimulation();
}