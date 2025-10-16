const container = document.getElementById('simulation-container');

container.innerHTML = `
    <div class="physics-sim-container">
        <div class="sim-header">
            <h2>Newton's First Law: Law of Inertia</h2>
            <p>An object at rest stays at rest, and an object in motion stays in motion with constant velocity, unless acted upon by a net external force.</p>
        </div>
        
        <div class="sim-layout">
            <div class="controls-panel">
                <h3>Controls</h3>
                
                <div class="control-group">
                    <label>Object Mass (kg)</label>
                    <input type="range" id="mass" min="1" max="20" value="5" step="0.5">
                    <span id="massValue">5.0</span>
                </div>
                
                <div class="control-group">
                    <label>Applied Force (N)</label>
                    <input type="range" id="force" min="0" max="100" value="0" step="5">
                    <span id="forceValue">0</span>
                </div>
                
                <div class="control-group">
                    <label>Friction Coefficient</label>
                    <input type="range" id="friction" min="0" max="0.5" value="0" step="0.05">
                    <span id="frictionValue">0.00</span>
                </div>
                
                <div class="button-group">
                    <button id="applyForce">Apply Force →</button>
                    <button id="reset">Reset</button>
                </div>
                
                <div class="info-panel">
                    <h4>Current State</h4>
                    <div class="info-row">
                        <span>Velocity:</span>
                        <span id="velocityDisplay">0.00 m/s</span>
                    </div>
                    <div class="info-row">
                        <span>Acceleration:</span>
                        <span id="accelDisplay">0.00 m/s²</span>
                    </div>
                    <div class="info-row">
                        <span>Net Force:</span>
                        <span id="netForceDisplay">0.00 N</span>
                    </div>
                </div>
            </div>
            
            <div class="visualization-area">
                <canvas id="mainCanvas"></canvas>
                <canvas id="plotCanvas"></canvas>
            </div>
        </div>
    </div>
`;

const style = document.createElement('style');
style.textContent = `
    .physics-sim-container {
        padding: 20px;
        max-width: 1400px;
        margin: 0 auto;
    }
    
    .sim-header {
        text-align: center;
        margin-bottom: 20px;
        padding: 15px;
        background: rgba(0, 69, 139, 0.1);
        border-radius: 8px;
    }
    
    .sim-header h2 {
        color: #00458b;
        margin-bottom: 10px;
    }
    
    .sim-layout {
        display: flex;
        gap: 20px;
    }
    
    .controls-panel {
        min-width: 280px;
        background: #f8f8f8;
        padding: 20px;
        border-radius: 8px;
        height: fit-content;
    }
    
    .controls-panel h3 {
        margin-top: 0;
        color: #00458b;
    }
    
    .control-group {
        margin-bottom: 20px;
    }
    
    .control-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        font-size: 14px;
    }
    
    .control-group input[type="range"] {
        width: 100%;
        margin: 5px 0;
    }
    
    .control-group span {
        display: inline-block;
        min-width: 60px;
        font-family: monospace;
        color: #00458b;
    }
    
    .button-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 20px 0;
    }
    
    .button-group button {
        padding: 10px;
        background: #00458b;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
    }
    
    .button-group button:hover {
        background: #003366;
    }
    
    .info-panel {
        background: white;
        padding: 15px;
        border-radius: 5px;
        margin-top: 20px;
    }
    
    .info-panel h4 {
        margin-top: 0;
        color: #00458b;
    }
    
    .info-row {
        display: flex;
        justify-content: space-between;
        margin: 8px 0;
        font-size: 14px;
    }
    
    .info-row span:last-child {
        font-family: monospace;
        font-weight: bold;
        color: #00458b;
    }
    
    .visualization-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    #mainCanvas {
        width: 100%;
        height: 400px;
        background: white;
        border: 2px solid #ddd;
        border-radius: 8px;
    }
    
    #plotCanvas {
        width: 100%;
        height: 250px;
        background: white;
        border: 2px solid #ddd;
        border-radius: 8px;
    }
    
    @media (prefers-color-scheme: dark) {
        .sim-header {
            background: rgba(125, 179, 240, 0.1);
        }
        
        .sim-header h2 {
            color: #7db3f0;
        }
        
        .controls-panel {
            background: #2a2a2a;
        }
        
        .controls-panel h3 {
            color: #7db3f0;
        }
        
        .control-group label {
            color: #e4e4e4;
        }
        
        .control-group span {
            color: #7db3f0;
        }
        
        .info-panel {
            background: #1a1a1a;
            color: #e4e4e4;
        }
        
        .info-panel h4 {
            color: #7db3f0;
        }
        
        .info-row span:last-child {
            color: #7db3f0;
        }
        
        #mainCanvas, #plotCanvas {
            background: #1a1a1a;
            border-color: #404040;
        }
    }
    
    @media (max-width: 768px) {
        .sim-layout {
            flex-direction: column;
        }
        
        .controls-panel {
            width: 100%;
        }
    }
`;
document.head.appendChild(style);

class NewtonsFirstLaw {
    constructor() {
        this.mainCanvas = document.getElementById('mainCanvas');
        this.plotCanvas = document.getElementById('plotCanvas');
        this.mainCtx = this.mainCanvas.getContext('2d');
        this.plotCtx = this.plotCanvas.getContext('2d');
        
        // Simulation parameters
        this.mass = 5;
        this.appliedForce = 0;
        this.frictionCoeff = 0;
        this.g = 9.81;
        
        // Object state
        this.position = 100;
        this.velocity = 0;
        this.acceleration = 0;
        
        // Time tracking
        this.lastTime = 0;
        this.running = false;
        
        // Data for plotting
        this.timeData = [];
        this.velocityData = [];
        this.maxDataPoints = 200;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.updateDisplays();
        this.draw();
    }
    
    setupCanvas() {
        this.mainCanvas.width = this.mainCanvas.offsetWidth;
        this.mainCanvas.height = this.mainCanvas.offsetHeight;
        this.plotCanvas.width = this.plotCanvas.offsetWidth;
        this.plotCanvas.height = this.plotCanvas.offsetHeight;
    }
    
    setupEventListeners() {
        document.getElementById('mass').addEventListener('input', (e) => {
            this.mass = parseFloat(e.target.value);
            this.updateDisplays();
        });
        
        document.getElementById('force').addEventListener('input', (e) => {
            this.appliedForce = parseFloat(e.target.value);
            this.updateDisplays();
        });
        
        document.getElementById('friction').addEventListener('input', (e) => {
            this.frictionCoeff = parseFloat(e.target.value);
            this.updateDisplays();
        });
        
        document.getElementById('applyForce').addEventListener('click', () => {
            this.running = true;
            this.lastTime = performance.now();
            this.animate();
        });
        
        document.getElementById('reset').addEventListener('click', () => {
            this.reset();
        });
        
        window.addEventListener('resize', () => this.setupCanvas());
    }
    
    updateDisplays() {
        document.getElementById('massValue').textContent = this.mass.toFixed(1);
        document.getElementById('forceValue').textContent = this.appliedForce.toFixed(0);
        document.getElementById('frictionValue').textContent = this.frictionCoeff.toFixed(2);
        document.getElementById('velocityDisplay').textContent = this.velocity.toFixed(2) + ' m/s';
        document.getElementById('accelDisplay').textContent = this.acceleration.toFixed(2) + ' m/s²';
        
        const frictionForce = this.frictionCoeff * this.mass * this.g * (this.velocity > 0 ? -1 : (this.velocity < 0 ? 1 : 0));
        const netForce = this.appliedForce + frictionForce;
        document.getElementById('netForceDisplay').textContent = netForce.toFixed(2) + ' N';
    }
    
    reset() {
        this.running = false;
        this.position = 100;
        this.velocity = 0;
        this.acceleration = 0;
        this.timeData = [];
        this.velocityData = [];
        this.updateDisplays();
        this.draw();
        this.drawPlot();
    }
    
    physics(dt) {
        // Calculate friction force (opposes motion)
        let frictionForce = 0;
        if (Math.abs(this.velocity) > 0.01) {
            frictionForce = -this.frictionCoeff * this.mass * this.g * Math.sign(this.velocity);
        }
        
        // Net force
        const netForce = this.appliedForce + frictionForce;
        
        // F = ma, so a = F/m
        this.acceleration = netForce / this.mass;
        
        // Update velocity and position
        this.velocity += this.acceleration * dt;
        
        // Stop if velocity is very small and no applied force
        if (Math.abs(this.velocity) < 0.01 && this.appliedForce === 0) {
            this.velocity = 0;
        }
        
        this.position += this.velocity * dt;
        
        // Keep object on screen
        if (this.position < 50) {
            this.position = 50;
            this.velocity = 0;
        }
        if (this.position > this.mainCanvas.width - 50) {
            this.position = this.mainCanvas.width - 50;
            this.velocity = 0;
        }
        
        // Store data for plotting
        this.timeData.push(this.timeData.length * dt);
        this.velocityData.push(this.velocity);
        
        if (this.timeData.length > this.maxDataPoints) {
            this.timeData.shift();
            this.velocityData.shift();
        }
    }
    
    draw() {
        const ctx = this.mainCtx;
        const canvas = this.mainCanvas;
        
        // Clear canvas
        ctx.fillStyle = getComputedStyle(canvas).backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw ground
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 50);
        ctx.lineTo(canvas.width, canvas.height - 50);
        ctx.stroke();
        
        // Draw object (box)
        const boxSize = Math.sqrt(this.mass) * 10;
        const boxY = canvas.height - 50 - boxSize;
        
        ctx.fillStyle = '#00458b';
        ctx.fillRect(this.position - boxSize/2, boxY, boxSize, boxSize);
        
        // Draw border
        ctx.strokeStyle = '#003366';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.position - boxSize/2, boxY, boxSize, boxSize);
        
        // Draw mass label
        ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#fff' : '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.mass.toFixed(1) + ' kg', this.position, boxY + boxSize/2 + 5);
        
        // Draw force arrow
        if (this.appliedForce > 0) {
            const arrowLength = this.appliedForce * 2;
            const arrowY = boxY + boxSize/2;
            
            ctx.strokeStyle = '#ff0000';
            ctx.fillStyle = '#ff0000';
            ctx.lineWidth = 3;
            
            // Arrow line
            ctx.beginPath();
            ctx.moveTo(this.position + boxSize/2, arrowY);
            ctx.lineTo(this.position + boxSize/2 + arrowLength, arrowY);
            ctx.stroke();
            
            // Arrow head
            ctx.beginPath();
            ctx.moveTo(this.position + boxSize/2 + arrowLength, arrowY);
            ctx.lineTo(this.position + boxSize/2 + arrowLength - 10, arrowY - 5);
            ctx.lineTo(this.position + boxSize/2 + arrowLength - 10, arrowY + 5);
            ctx.closePath();
            ctx.fill();
            
            // Label
            ctx.fillStyle = '#ff0000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('F = ' + this.appliedForce.toFixed(0) + ' N', 
                        this.position + boxSize/2 + arrowLength/2, arrowY - 10);
        }
        
        // Draw velocity vector
        if (Math.abs(this.velocity) > 0.1) {
            const velLength = Math.min(Math.abs(this.velocity) * 10, 100);
            const velY = boxY - 20;
            
            ctx.strokeStyle = '#00aa00';
            ctx.fillStyle = '#00aa00';
            ctx.lineWidth = 2;
            
            // Arrow line
            ctx.beginPath();
            ctx.moveTo(this.position, velY);
            ctx.lineTo(this.position + velLength * Math.sign(this.velocity), velY);
            ctx.stroke();
            
            // Arrow head
            const headX = this.position + velLength * Math.sign(this.velocity);
            ctx.beginPath();
            ctx.moveTo(headX, velY);
            ctx.lineTo(headX - 8 * Math.sign(this.velocity), velY - 4);
            ctx.lineTo(headX - 8 * Math.sign(this.velocity), velY + 4);
            ctx.closePath();
            ctx.fill();
            
            // Label
            ctx.fillStyle = '#00aa00';
            ctx.font = '12px Arial';
            ctx.fillText('v = ' + this.velocity.toFixed(1) + ' m/s', 
                        this.position + velLength * Math.sign(this.velocity) / 2, velY - 10);
        }
    }
    
    drawPlot() {
        const ctx = this.plotCtx;
        const canvas = this.plotCanvas;
        
        // Clear canvas
        ctx.fillStyle = getComputedStyle(canvas).backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (this.velocityData.length < 2) return;
        
        const padding = 40;
        const plotWidth = canvas.width - 2 * padding;
        const plotHeight = canvas.height - 2 * padding;
        
        // Find min/max for scaling
        const maxVel = Math.max(...this.velocityData.map(Math.abs), 10);
        
        // Draw axes
        ctx.strokeStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#666' : '#333';
        ctx.lineWidth = 2;
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.stroke();
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e4e4e4' : '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Time', canvas.width / 2, canvas.height - 5);
        
        ctx.save();
        ctx.translate(15, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Velocity (m/s)', 0, 0);
        ctx.restore();
        
        // Draw grid
        ctx.strokeStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#333' : '#ddd';
        ctx.lineWidth = 1;
        for (let i = 1; i < 5; i++) {
            const y = padding + (plotHeight * i) / 5;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }
        
        // Draw velocity curve
        ctx.strokeStyle = '#00458b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < this.velocityData.length; i++) {
            const x = padding + (i / this.maxDataPoints) * plotWidth;
            const y = canvas.height - padding - ((this.velocityData[i] / maxVel) * plotHeight / 2 + plotHeight / 2);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
    
    animate() {
        if (!this.running) return;
        
        const currentTime = performance.now();
        const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;
        
        this.physics(dt);
        this.updateDisplays();
        this.draw();
        this.drawPlot();
        
        requestAnimationFrame(() => this.animate());
    }
}

new NewtonsFirstLaw();