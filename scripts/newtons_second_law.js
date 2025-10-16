const container = document.getElementById('simulation-container');

container.innerHTML = `
    <div class="physics-sim-container">
        <div class="sim-header">
            <h2>Newton's Second Law: F = ma</h2>
            <p>The acceleration of an object is directly proportional to the net force and inversely proportional to its mass.</p>
        </div>
        
        <div class="sim-layout">
            <div class="controls-panel">
                <h3>Controls</h3>
                
                <div class="control-group">
                    <label>Mass (kg)</label>
                    <input type="range" id="mass" min="1" max="20" value="5" step="0.5">
                    <span id="massValue">5.0</span>
                </div>
                
                <div class="control-group">
                    <label>Force (N)</label>
                    <input type="range" id="force" min="10" max="200" value="50" step="5">
                    <span id="forceValue">50</span>
                </div>
                
                <div class="button-group">
                    <button id="start">Start Motion</button>
                    <button id="reset">Reset</button>
                </div>
                
                <div class="info-panel">
                    <h4>Physics Values</h4>
                    <div class="info-row">
                        <span>Mass (m):</span>
                        <span id="massDisplay">5.0 kg</span>
                    </div>
                    <div class="info-row">
                        <span>Force (F):</span>
                        <span id="forceDisplay">50.0 N</span>
                    </div>
                    <div class="info-row">
                        <span>Acceleration (a):</span>
                        <span id="accelDisplay">10.0 m/s²</span>
                    </div>
                    <div class="info-row">
                        <span>Velocity:</span>
                        <span id="velocityDisplay">0.0 m/s</span>
                    </div>
                    <div class="info-row">
                        <span>Distance:</span>
                        <span id="distanceDisplay">0.0 m</span>
                    </div>
                </div>
                
                <div class="equation-panel">
                    <h4>Equation</h4>
                    <div class="equation">
                        a = F / m
                    </div>
                    <div class="equation-result" id="equationResult">
                        a = 50 / 5 = 10 m/s²
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
    
    .info-panel, .equation-panel {
        background: white;
        padding: 15px;
        border-radius: 5px;
        margin-top: 20px;
    }
    
    .info-panel h4, .equation-panel h4 {
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
    
    .equation {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #00458b;
        margin: 15px 0;
        font-family: 'Times New Roman', serif;
    }
    
    .equation-result {
        text-align: center;
        font-size: 16px;
        color: #ff6600;
        font-family: monospace;
        background: #fff3e0;
        padding: 10px;
        border-radius: 5px;
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
        
        .info-panel, .equation-panel {
            background: #1a1a1a;
            color: #e4e4e4;
        }
        
        .info-panel h4, .equation-panel h4 {
            color: #7db3f0;
        }
        
        .info-row span:last-child {
            color: #7db3f0;
        }
        
        .equation {
            color: #7db3f0;
        }
        
        .equation-result {
            color: #ffaa44;
            background: #2a1a00;
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

class NewtonsSecondLaw {
    constructor() {
        this.mainCanvas = document.getElementById('mainCanvas');
        this.plotCanvas = document.getElementById('plotCanvas');
        this.mainCtx = this.mainCanvas.getContext('2d');
        this.plotCtx = this.plotCanvas.getContext('2d');
        
        // Simulation parameters
        this.mass = 5;
        this.force = 50;
        this.acceleration = 0;
        
        // Object state
        this.position = 100;
        this.velocity = 0;
        this.distance = 0;
        
        // Time tracking
        this.time = 0;
        this.lastTime = 0;
        this.running = false;
        
        // Data for plotting
        this.timeData = [];
        this.velocityData = [];
        this.accelerationData = [];
        this.maxDataPoints = 150;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.updateCalculations();
        this.draw();
        this.drawPlot();
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
            this.updateCalculations();
        });
        
        document.getElementById('force').addEventListener('input', (e) => {
            this.force = parseFloat(e.target.value);
            this.updateCalculations();
        });
        
        document.getElementById('start').addEventListener('click', () => {
            if (!this.running) {
                this.running = true;
                this.lastTime = performance.now();
                this.animate();
            }
        });
        
        document.getElementById('reset').addEventListener('click', () => {
            this.reset();
        });
        
        window.addEventListener('resize', () => this.setupCanvas());
    }
    
    updateCalculations() {
        // F = ma, so a = F/m
        this.acceleration = this.force / this.mass;
        
        document.getElementById('massValue').textContent = this.mass.toFixed(1);
        document.getElementById('forceValue').textContent = this.force.toFixed(0);
        document.getElementById('massDisplay').textContent = this.mass.toFixed(1) + ' kg';
        document.getElementById('forceDisplay').textContent = this.force.toFixed(1) + ' N';
        document.getElementById('accelDisplay').textContent = this.acceleration.toFixed(2) + ' m/s²';
        document.getElementById('velocityDisplay').textContent = this.velocity.toFixed(1) + ' m/s';
        document.getElementById('distanceDisplay').textContent = this.distance.toFixed(1) + ' m';
        document.getElementById('equationResult').textContent = 
            `a = ${this.force.toFixed(0)} / ${this.mass.toFixed(1)} = ${this.acceleration.toFixed(2)} m/s²`;
    }
    
    reset() {
        this.running = false;
        this.position = 100;
        this.velocity = 0;
        this.distance = 0;
        this.time = 0;
        this.timeData = [];
        this.velocityData = [];
        this.accelerationData = [];
        this.updateCalculations();
        this.draw();
        this.drawPlot();
    }
    
    physics(dt) {
        // F = ma
        this.acceleration = this.force / this.mass;
        
        // Update velocity: v = v0 + at
        this.velocity += this.acceleration * dt;
        
        // Update position
        const displacement = this.velocity * dt;
        this.position += displacement;
        this.distance += Math.abs(displacement);
        
        this.time += dt;
        
        // Wrap around if object goes off screen
        if (this.position > this.mainCanvas.width - 50) {
            this.position = 100;
        }
        
        // Store data for plotting
        this.timeData.push(this.time);
        this.velocityData.push(this.velocity);
        this.accelerationData.push(this.acceleration);
        
        if (this.timeData.length > this.maxDataPoints) {
            this.timeData.shift();
            this.velocityData.shift();
            this.accelerationData.shift();
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
        
        // Draw reference grid
        ctx.strokeStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#333' : '#e0e0e0';
        ctx.lineWidth = 1;
        for (let i = 100; i < canvas.width; i += 100) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height - 50);
            ctx.stroke();
        }
        
        // Draw object
        const boxSize = Math.sqrt(this.mass) * 10;
        const boxY = canvas.height - 50 - boxSize;
        
        ctx.fillStyle = '#00458b';
        ctx.fillRect(this.position - boxSize/2, boxY, boxSize, boxSize);
        
        ctx.strokeStyle = '#003366';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.position - boxSize/2, boxY, boxSize, boxSize);
        
        // Draw mass label
        ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#fff' : '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.mass.toFixed(1) + ' kg', this.position, boxY + boxSize/2 + 5);
        
        // Draw force arrow
        const arrowLength = Math.min(this.force * 1.5, 150);
        const arrowY = boxY + boxSize/2;
        
        ctx.strokeStyle = '#ff0000';
        ctx.fillStyle = '#ff0000';
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.moveTo(this.position + boxSize/2, arrowY);
        ctx.lineTo(this.position + boxSize/2 + arrowLength, arrowY);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(this.position + boxSize/2 + arrowLength, arrowY);
        ctx.lineTo(this.position + boxSize/2 + arrowLength - 10, arrowY - 5);
        ctx.lineTo(this.position + boxSize/2 + arrowLength - 10, arrowY + 5);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#ff0000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('F = ' + this.force.toFixed(0) + ' N', 
                    this.position + boxSize/2 + arrowLength/2, arrowY - 10);
        
        // Draw acceleration arrow
        const accelLength = Math.min(this.acceleration * 8, 120);
        const accelY = boxY - 30;
        
        ctx.strokeStyle = '#ff6600';
        ctx.fillStyle = '#ff6600';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(this.position, accelY);
        ctx.lineTo(this.position + accelLength, accelY);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(this.position + accelLength, accelY);
        ctx.lineTo(this.position + accelLength - 8, accelY - 4);
        ctx.lineTo(this.position + accelLength - 8, accelY + 4);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#ff6600';
        ctx.font = '12px Arial';
        ctx.fillText('a = ' + this.acceleration.toFixed(1) + ' m/s²', 
                    this.position + accelLength/2, accelY - 10);
        
        // Draw velocity vector if moving
        if (Math.abs(this.velocity) > 0.5) {
            const velLength = Math.min(Math.abs(this.velocity) * 3, 100);
            const velY = boxY - 60;
            
            ctx.strokeStyle = '#00aa00';
            ctx.fillStyle = '#00aa00';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(this.position, velY);
            ctx.lineTo(this.position + velLength, velY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(this.position + velLength, velY);
            ctx.lineTo(this.position + velLength - 8, velY - 4);
            ctx.lineTo(this.position + velLength - 8, velY + 4);
            ctx.closePath();
            ctx.fill();
            
            ctx.fillStyle = '#00aa00';
            ctx.font = '12px Arial';
            ctx.fillText('v = ' + this.velocity.toFixed(1) + ' m/s', 
                        this.position + velLength/2, velY - 10);
        }
    }
    
    drawPlot() {
        const ctx = this.plotCtx;
        const canvas = this.plotCanvas;
        
        ctx.fillStyle = getComputedStyle(canvas).backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (this.timeData.length < 2) {
            ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#666' : '#999';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Press "Start Motion" to see velocity vs time graph', 
                        canvas.width / 2, canvas.height / 2);
            return;
        }
        
        const padding = 50;
        const plotWidth = canvas.width - 2 * padding;
        const plotHeight = canvas.height - 2 * padding;
        
        const maxTime = Math.max(...this.timeData);
        const maxVel = Math.max(...this.velocityData.map(Math.abs), 10);
        
        // Draw axes
        ctx.strokeStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#666' : '#333';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e4e4e4' : '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Time (s)', canvas.width / 2, canvas.height - 10);
        
        ctx.save();
        ctx.translate(15, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Velocity (m/s)', 0, 0);
        ctx.restore();
        
        // Draw grid
        ctx.strokeStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#333' : '#ddd';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 4; i++) {
            const y = padding + (plotHeight * i) / 5;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }
        
        // Draw velocity curve
        ctx.strokeStyle = '#00458b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let i = 0; i < this.timeData.length; i++) {
            const x = padding + (this.timeData[i] / maxTime) * plotWidth;
            const y = canvas.height - padding - (this.velocityData[i] / maxVel) * plotHeight * 0.9;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Add legend
        ctx.fillStyle = '#00458b';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Velocity', canvas.width - padding - 60, padding + 20);
    }
    
    animate() {
        if (!this.running) return;
        
        const currentTime = performance.now();
        const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05);
        this.lastTime = currentTime;
        
        this.physics(dt);
        this.updateCalculations();
        this.draw();
        this.drawPlot();
        
        requestAnimationFrame(() => this.animate());
    }
}

new NewtonsSecondLaw();