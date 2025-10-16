const container = document.getElementById('simulation-container');

container.innerHTML = `
    <div class="physics-sim-container">
        <div class="sim-header">
            <h2>Newton's Third Law: Action and Reaction</h2>
            <p>For every action, there is an equal and opposite reaction. Forces always occur in pairs.</p>
        </div>
        
        <div class="sim-layout">
            <div class="controls-panel">
                <h3>Controls</h3>
                
                <div class="control-group">
                    <label>Object A Mass (kg)</label>
                    <input type="range" id="massA" min="1" max="20" value="5" step="0.5">
                    <span id="massAValue">5.0</span>
                </div>
                
                <div class="control-group">
                    <label>Object B Mass (kg)</label>
                    <input type="range" id="massB" min="1" max="20" value="10" step="0.5">
                    <span id="massBValue">10.0</span>
                </div>
                
                <div class="control-group">
                    <label>Interaction Force (N)</label>
                    <input type="range" id="force" min="10" max="200" value="100" step="10">
                    <span id="forceValue">100</span>
                </div>
                
                <div class="button-group">
                    <button id="interact">Apply Forces</button>
                    <button id="reset">Reset</button>
                </div>
                
                <div class="info-panel">
                    <h4>Object A (Red)</h4>
                    <div class="info-row">
                        <span>Mass:</span>
                        <span id="massADisplay">5.0 kg</span>
                    </div>
                    <div class="info-row">
                        <span>Force on A:</span>
                        <span id="forceADisplay">0.0 N</span>
                    </div>
                    <div class="info-row">
                        <span>Acceleration:</span>
                        <span id="accelADisplay">0.0 m/s²</span>
                    </div>
                    <div class="info-row">
                        <span>Velocity:</span>
                        <span id="velADisplay">0.0 m/s</span>
                    </div>
                </div>
                
                <div class="info-panel">
                    <h4>Object B (Blue)</h4>
                    <div class="info-row">
                        <span>Mass:</span>
                        <span id="massBDisplay">10.0 kg</span>
                    </div>
                    <div class="info-row">
                        <span>Force on B:</span>
                        <span id="forceBDisplay">0.0 N</span>
                    </div>
                    <div class="info-row">
                        <span>Acceleration:</span>
                        <span id="accelBDisplay">0.0 m/s²</span>
                    </div>
                    <div class="info-row">
                        <span>Velocity:</span>
                        <span id="velBDisplay">0.0 m/s</span>
                    </div>
                </div>
                
                <div class="equation-panel">
                    <h4>Key Principle</h4>
                    <div class="principle">
                        F<sub>A on B</sub> = -F<sub>B on A</sub>
                    </div>
                    <p style="font-size: 12px; margin-top: 10px;">
                        The forces are equal in magnitude but opposite in direction!
                    </p>
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
    
    .principle {
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        color: #00458b;
        margin: 15px 0;
        font-family: 'Times New Roman', serif;
        padding: 10px;
        background: #f0f8ff;
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
        
        .principle {
            color: #7db3f0;
            background: #0a1a2a;
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

class NewtonsThirdLaw {
    constructor() {
        this.mainCanvas = document.getElementById('mainCanvas');
        this.plotCanvas = document.getElementById('plotCanvas');
        this.mainCtx = this.mainCanvas.getContext('2d');
        this.plotCtx = this.plotCanvas.getContext('2d');
        
        // Object properties
        this.massA = 5;
        this.massB = 10;
        this.interactionForce = 100;
        
        // Object states
        this.objectA = {
            pos: 200,
            vel: 0,
            accel: 0,
            force: 0
        };
        
        this.objectB = {
            pos: 600,
            vel: 0,
            accel: 0,
            force: 0
        };
        
        // Time tracking
        this.time = 0;
        this.lastTime = 0;
        this.running = false;
        this.interacting = false;
        this.interactionTime = 0;
        this.interactionDuration = 0.5; // seconds
        
        // Data for plotting
        this.timeData = [];
        this.momentumAData = [];
        this.momentumBData = [];
        this.totalMomentumData = [];
        this.maxDataPoints = 150;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.updateDisplays();
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
        document.getElementById('massA').addEventListener('input', (e) => {
            this.massA = parseFloat(e.target.value);
            this.updateDisplays();
        });
        
        document.getElementById('massB').addEventListener('input', (e) => {
            this.massB = parseFloat(e.target.value);
            this.updateDisplays();
        });
        
        document.getElementById('force').addEventListener('input', (e) => {
            this.interactionForce = parseFloat(e.target.value);
            this.updateDisplays();
        });
        
        document.getElementById('interact').addEventListener('click', () => {
            if (!this.running) {
                this.interacting = true;
                this.interactionTime = 0;
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
    
    updateDisplays() {
        document.getElementById('massAValue').textContent = this.massA.toFixed(1);
        document.getElementById('massBValue').textContent = this.massB.toFixed(1);
        document.getElementById('forceValue').textContent = this.interactionForce.toFixed(0);
        
        document.getElementById('massADisplay').textContent = this.massA.toFixed(1) + ' kg';
        document.getElementById('massBDisplay').textContent = this.massB.toFixed(1) + ' kg';
        
        document.getElementById('forceADisplay').textContent = this.objectA.force.toFixed(1) + ' N';
        document.getElementById('forceBDisplay').textContent = this.objectB.force.toFixed(1) + ' N';
        
        document.getElementById('accelADisplay').textContent = this.objectA.accel.toFixed(2) + ' m/s²';
        document.getElementById('accelBDisplay').textContent = this.objectB.accel.toFixed(2) + ' m/s²';
        
        document.getElementById('velADisplay').textContent = this.objectA.vel.toFixed(2) + ' m/s';
        document.getElementById('velBDisplay').textContent = this.objectB.vel.toFixed(2) + ' m/s';
    }
    
    reset() {
        this.running = false;
        this.interacting = false;
        this.interactionTime = 0;
        
        this.objectA = { pos: 200, vel: 0, accel: 0, force: 0 };
        this.objectB = { pos: 600, vel: 0, accel: 0, force: 0 };
        
        this.time = 0;
        this.timeData = [];
        this.momentumAData = [];
        this.momentumBData = [];
        this.totalMomentumData = [];
        
        this.updateDisplays();
        this.draw();
        this.drawPlot();
    }
    
    physics(dt) {
        if (this.interacting && this.interactionTime < this.interactionDuration) {
            // Apply equal and opposite forces
            this.objectA.force = this.interactionForce;
            this.objectB.force = -this.interactionForce;
            
            this.interactionTime += dt;
        } else {
            this.interacting = false;
            this.objectA.force = 0;
            this.objectB.force = 0;
        }
        
        // Calculate accelerations (F = ma)
        this.objectA.accel = this.objectA.force / this.massA;
        this.objectB.accel = this.objectB.force / this.massB;
        
        // Update velocities
        this.objectA.vel += this.objectA.accel * dt;
        this.objectB.vel += this.objectB.accel * dt;
        
        // Update positions
        this.objectA.pos += this.objectA.vel * dt;
        this.objectB.pos += this.objectB.vel * dt;
        
        this.time += dt;
        
        // Calculate momenta
        const momentumA = this.massA * this.objectA.vel;
        const momentumB = this.massB * this.objectB.vel;
        const totalMomentum = momentumA + momentumB;
        
        // Store data
        this.timeData.push(this.time);
        this.momentumAData.push(momentumA);
        this.momentumBData.push(momentumB);
        this.totalMomentumData.push(totalMomentum);
        
        if (this.timeData.length > this.maxDataPoints) {
            this.timeData.shift();
            this.momentumAData.shift();
            this.momentumBData.shift();
            this.totalMomentumData.shift();
        }
        
        // Stop if objects are off screen
        if (this.objectA.pos < -100 || this.objectA.pos > this.mainCanvas.width + 100 ||
            this.objectB.pos < -100 || this.objectB.pos > this.mainCanvas.width + 100) {
            this.running = false;
        }
    }
    
    draw() {
        const ctx = this.mainCtx;
        const canvas = this.mainCanvas;
        
        ctx.fillStyle = getComputedStyle(canvas).backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw ground
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 50);
        ctx.lineTo(canvas.width, canvas.height - 50);
        ctx.stroke();
        
        // Draw Object A (red)
        const sizeA = Math.sqrt(this.massA) * 10;
        const yA = canvas.height - 50 - sizeA;
        
        ctx.fillStyle = '#cc0000';
        ctx.fillRect(this.objectA.pos - sizeA/2, yA, sizeA, sizeA);
        ctx.strokeStyle = '#880000';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.objectA.pos - sizeA/2, yA, sizeA, sizeA);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('A', this.objectA.pos, yA + sizeA/2 + 5);
        ctx.font = '10px Arial';
        ctx.fillText(this.massA.toFixed(1) + ' kg', this.objectA.pos, yA + sizeA/2 + 18);
        
        // Draw Object B (blue)
        const sizeB = Math.sqrt(this.massB) * 10;
        const yB = canvas.height - 50 - sizeB;
        
        ctx.fillStyle = '#0000cc';
        ctx.fillRect(this.objectB.pos - sizeB/2, yB, sizeB, sizeB);
        ctx.strokeStyle = '#000088';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.objectB.pos - sizeB/2, yB, sizeB, sizeB);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('B', this.objectB.pos, yB + sizeB/2 + 5);
        ctx.font = '10px Arial';
        ctx.fillText(this.massB.toFixed(1) + ' kg', this.objectB.pos, yB + sizeB/2 + 18);
        
        // Draw force arrows if interacting
        if (this.interacting) {
            const arrowLength = Math.min(Math.abs(this.interactionForce) * 0.8, 100);
            
            // Force on A (pointing right)
            ctx.strokeStyle = '#ff0000';
            ctx.fillStyle = '#ff0000';
            ctx.lineWidth = 3;
            
            const arrowYA = yA + sizeA/2;
            ctx.beginPath();
            ctx.moveTo(this.objectA.pos + sizeA/2, arrowYA);
            ctx.lineTo(this.objectA.pos + sizeA/2 + arrowLength, arrowYA);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(this.objectA.pos + sizeA/2 + arrowLength, arrowYA);
            ctx.lineTo(this.objectA.pos + sizeA/2 + arrowLength - 10, arrowYA - 5);
            ctx.lineTo(this.objectA.pos + sizeA/2 + arrowLength - 10, arrowYA + 5);
            ctx.closePath();
            ctx.fill();
            
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('F = ' + this.interactionForce.toFixed(0) + ' N', 
                        this.objectA.pos + sizeA/2 + arrowLength/2, arrowYA - 10);
            
            // Force on B (pointing left)
            const arrowYB = yB + sizeB/2;
            ctx.beginPath();
            ctx.moveTo(this.objectB.pos - sizeB/2, arrowYB);
            ctx.lineTo(this.objectB.pos - sizeB/2 - arrowLength, arrowYB);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(this.objectB.pos - sizeB/2 - arrowLength, arrowYB);
            ctx.lineTo(this.objectB.pos - sizeB/2 - arrowLength + 10, arrowYB - 5);
            ctx.lineTo(this.objectB.pos - sizeB/2 - arrowLength + 10, arrowYB + 5);
            ctx.closePath();
            ctx.fill();
            
            ctx.fillText('F = ' + this.interactionForce.toFixed(0) + ' N', 
                        this.objectB.pos - sizeB/2 - arrowLength/2, arrowYB - 10);
        }
        
        // Draw velocity vectors
        if (Math.abs(this.objectA.vel) > 0.1) {
            const velLength = Math.min(Math.abs(this.objectA.vel) * 5, 80);
            const velY = yA - 20;
            
            ctx.strokeStyle = '#00aa00';
            ctx.fillStyle = '#00aa00';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(this.objectA.pos, velY);
            ctx.lineTo(this.objectA.pos + velLength * Math.sign(this.objectA.vel), velY);
            ctx.stroke();
            
            const headX = this.objectA.pos + velLength * Math.sign(this.objectA.vel);
            ctx.beginPath();
            ctx.moveTo(headX, velY);
            ctx.lineTo(headX - 8 * Math.sign(this.objectA.vel), velY - 4);
            ctx.lineTo(headX - 8 * Math.sign(this.objectA.vel), velY + 4);
            ctx.closePath();
            ctx.fill();
            
            ctx.font = '11px Arial';
            ctx.fillText('v', this.objectA.pos + velLength * Math.sign(this.objectA.vel) / 2, velY - 8);
        }
        
        if (Math.abs(this.objectB.vel) > 0.1) {
            const velLength = Math.min(Math.abs(this.objectB.vel) * 5, 80);
            const velY = yB - 20;
            
            ctx.strokeStyle = '#00aa00';
            ctx.fillStyle = '#00aa00';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(this.objectB.pos, velY);
            ctx.lineTo(this.objectB.pos + velLength * Math.sign(this.objectB.vel), velY);
            ctx.stroke();
            
            const headX = this.objectB.pos + velLength * Math.sign(this.objectB.vel);
            ctx.beginPath();
            ctx.moveTo(headX, velY);
            ctx.lineTo(headX - 8 * Math.sign(this.objectB.vel), velY - 4);
            ctx.lineTo(headX - 8 * Math.sign(this.objectB.vel), velY + 4);
            ctx.closePath();
            ctx.fill();
            
            ctx.font = '11px Arial';
            ctx.fillText('v', this.objectB.pos + velLength * Math.sign(this.objectB.vel) / 2, velY - 8);
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
            ctx.fillText('Momentum vs Time (Conservation of Momentum)', 
                        canvas.width / 2, canvas.height / 2);
            return;
        }
        
        const padding = 50;
        const plotWidth = canvas.width - 2 * padding;
        const plotHeight = canvas.height - 2 * padding;
        
        const maxTime = Math.max(...this.timeData);
        const maxMomentum = Math.max(
            ...this.momentumAData.map(Math.abs),
            ...this.momentumBData.map(Math.abs),
            50
        );
        
        // Draw axes
        ctx.strokeStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#666' : '#333';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // Zero line
        const zeroY = canvas.height - padding - plotHeight / 2;
        ctx.strokeStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#444' : '#999';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(padding, zeroY);
        ctx.lineTo(canvas.width - padding, zeroY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Labels
        ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e4e4e4' : '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Time (s)', canvas.width / 2, canvas.height - 10);
        
        ctx.save();
        ctx.translate(15, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Momentum (kg·m/s)', 0, 0);
        ctx.restore();
        
        // Draw momentum curves
        const drawCurve = (data, color, label) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let i = 0; i < this.timeData.length; i++) {
                const x = padding + (this.timeData[i] / maxTime) * plotWidth;
                const y = zeroY - (data[i] / maxMomentum) * (plotHeight / 2) * 0.9;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        };
        
        drawCurve(this.momentumAData, '#cc0000', 'Object A');
        drawCurve(this.momentumBData, '#0000cc', 'Object B');
        drawCurve(this.totalMomentumData, '#00aa00', 'Total');
        
        // Legend
        const legendX = canvas.width - padding - 100;
        const legendY = padding + 20;
        
        ctx.strokeStyle = '#cc0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(legendX, legendY);
        ctx.lineTo(legendX + 30, legendY);
        ctx.stroke();
        
        ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e4e4e4' : '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Object A', legendX + 35, legendY + 4);
        
        ctx.strokeStyle = '#0000cc';
        ctx.beginPath();
        ctx.moveTo(legendX, legendY + 20);
        ctx.lineTo(legendX + 30, legendY + 20);
        ctx.stroke();
        ctx.fillText('Object B', legendX + 35, legendY + 24);
        
        ctx.strokeStyle = '#00aa00';
        ctx.beginPath();
        ctx.moveTo(legendX, legendY + 40);
        ctx.lineTo(legendX + 30, legendY + 40);
        ctx.stroke();
        ctx.fillText('Total (conserved!)', legendX + 35, legendY + 44);
    }
    
    animate() {
        if (!this.running) return;
        
        const currentTime = performance.now();
        const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05);
        this.lastTime = currentTime;
        
        this.physics(dt);
        this.updateDisplays();
        this.draw();
        this.drawPlot();
        
        requestAnimationFrame(() => this.animate());
    }
}

new NewtonsThirdLaw();