const container = document.getElementById('simulation-container');

container.innerHTML = `
    <div class="physics-sim-container">
        <div class="sim-header">
            <h2>Newton's Law of Universal Gravitation</h2>
            <p>Every particle attracts every other particle with a force proportional to their masses and inversely proportional to the square of the distance!</p>
        </div>
        
        <div class="sim-layout">
            <div class="controls-panel">
                <h3>Controls</h3>
                
                <div class="control-group">
                    <label>Mass 1 (×10²⁴ kg)</label>
                    <input type="range" id="mass1" min="1" max="100" value="10" step="1">
                    <span id="mass1Value">10</span>
                </div>
                
                <div class="control-group">
                    <label>Mass 2 (×10²⁴ kg)</label>
                    <input type="range" id="mass2" min="1" max="100" value="20" step="1">
                    <span id="mass2Value">20</span>
                </div>
                
                <div class="control-group">
                    <label>Distance (×10⁶ m)</label>
                    <input type="range" id="distance" min="1" max="100" value="30" step="1">
                    <span id="distanceValue">30</span>
                </div>
                
                <div class="control-group">
                    <label>Show Orbits</label>
                    <input type="checkbox" id="showOrbits" checked>
                </div>
                
                <div class="button-group">
                    <button id="start">Start Orbit</button>
                    <button id="reset">Reset</button>
                </div>
                
                <div class="info-panel">
                    <h4>Gravitational Force</h4>
                    <div class="info-row">
                        <span>Force (F):</span>
                        <span id="forceDisplay">0.00 N</span>
                    </div>
                    <div class="info-row">
                        <span>Distance (r):</span>
                        <span id="distDisplay">0.0 Mm</span>
                    </div>
                    <div class="info-row">
                        <span>Force on M₁:</span>
                        <span id="force1Display">0.00 N</span>
                    </div>
                    <div class="info-row">
                        <span>Force on M₂:</span>
                        <span id="force2Display">0.00 N</span>
                    </div>
                </div>
                
                <div class="info-panel">
                    <h4>Orbital Properties</h4>
                    <div class="info-row">
                        <span>Orbital Period:</span>
                        <span id="periodDisplay">-- s</span>
                    </div>
                    <div class="info-row">
                        <span>Orbital Speed:</span>
                        <span id="speedDisplay">0.0 km/s</span>
                    </div>
                    <div class="info-row">
                        <span>Center of Mass:</span>
                        <span id="comDisplay">--</span>
                    </div>
                </div>
                
                <div class="equation-panel">
                    <h4>Universal Gravitation</h4>
                    <div class="principle" style="font-size: 18px;">
                        F = G(m₁m₂)/r²
                    </div>
                    <p style="font-size: 11px; margin: 5px 0;">
                        G = 6.674 × 10⁻¹¹ N·m²/kg²<br>
                        Universal gravitational constant
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
    
    .control-group input[type="checkbox"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
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
        font-size: 18px;
        font-weight: bold;
        color: #00458b;
        margin: 10px 0;
        font-family: 'Times New Roman', serif;
        padding: 8px;
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

class GravitationLaw {
    constructor() {
        this.mainCanvas = document.getElementById('mainCanvas');
        this.plotCanvas = document.getElementById('plotCanvas');
        this.mainCtx = this.mainCanvas.getContext('2d');
        this.plotCtx = this.plotCanvas.getContext('2d');
        
        // Constants
        this.G = 6.674e-11; // N·m²/kg²
        
        // Masses in kg (×10^24)
        this.mass1 = 10e24;
        this.mass2 = 20e24;
        
        // Distance in meters (×10^6)
        this.distance = 30e6;
        
        // State
        this.running = false;
        this.showOrbits = true;
        this.time = 0;
        this.lastTime = 0;
        
        // Orbital state
        this.pos1 = { x: 0, y: 0 };
        this.pos2 = { x: 0, y: 0 };
        this.vel1 = { x: 0, y: 0 };
        this.vel2 = { x: 0, y: 0 };
        
        // Trail
        this.trail1 = [];
        this.trail2 = [];
        this.maxTrailLength = 200;
        
        // Force
        this.force = 0;
        
        // Data for plotting
        this.timeData = [];
        this.forceData = [];
        this.distanceData = [];
        this.maxDataPoints = 200;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.calculateForce();
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
        document.getElementById('mass1').addEventListener('input', (e) => {
            this.mass1 = parseFloat(e.target.value) * 1e24;
            document.getElementById('mass1Value').textContent = e.target.value;
            if (!this.running) {
                this.calculateForce();
                this.updateDisplays();
                this.draw();
            }
        });
        
        document.getElementById('mass2').addEventListener('input', (e) => {
            this.mass2 = parseFloat(e.target.value) * 1e24;
            document.getElementById('mass2Value').textContent = e.target.value;
            if (!this.running) {
                this.calculateForce();
                this.updateDisplays();
                this.draw();
            }
        });
        
        document.getElementById('distance').addEventListener('input', (e) => {
            this.distance = parseFloat(e.target.value) * 1e6;
            document.getElementById('distanceValue').textContent = e.target.value;
            if (!this.running) {
                this.calculateForce();
                this.updateDisplays();
                this.draw();
            }
        });
        
        document.getElementById('showOrbits').addEventListener('change', (e) => {
            this.showOrbits = e.target.checked;
        });
        
        document.getElementById('start').addEventListener('click', () => {
            if (!this.running) {
                this.initializeOrbit();
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
    
    calculateForce() {
        // F = G * m1 * m2 / r²
        this.force = this.G * this.mass1 * this.mass2 / (this.distance * this.distance);
    }
    
    initializeOrbit() {
        // Calculate center of mass
        const totalMass = this.mass1 + this.mass2;
        const r1 = this.distance * this.mass2 / totalMass;
        const r2 = this.distance * this.mass1 / totalMass;
        
        // Position masses on opposite sides of center of mass
        this.pos1 = { x: -r1, y: 0 };
        this.pos2 = { x: r2, y: 0 };
        
        // Calculate orbital velocities (circular orbit)
        const v1 = Math.sqrt(this.G * this.mass2 * this.mass2 / (totalMass * this.distance));
        const v2 = Math.sqrt(this.G * this.mass1 * this.mass1 / (totalMass * this.distance));
        
        this.vel1 = { x: 0, y: v1 };
        this.vel2 = { x: 0, y: -v2 };
        
        this.trail1 = [];
        this.trail2 = [];
    }
    
    updateDisplays() {
        document.getElementById('forceDisplay').textContent = this.force.toExponential(2) + ' N';
        document.getElementById('distDisplay').textContent = (this.distance / 1e6).toFixed(1) + ' Mm';
        document.getElementById('force1Display').textContent = this.force.toExponential(2) + ' N';
        document.getElementById('force2Display').textContent = this.force.toExponential(2) + ' N';
        
        if (this.running) {
            // Calculate orbital period using Kepler's 3rd law
            const a = this.distance / 2; // semi-major axis for circular orbit
            const totalMass = this.mass1 + this.mass2;
            const period = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / (this.G * totalMass));
            document.getElementById('periodDisplay').textContent = period.toFixed(1) + ' s';
            
            // Speed of mass 1
            const speed1 = Math.sqrt(this.vel1.x * this.vel1.x + this.vel1.y * this.vel1.y);
            document.getElementById('speedDisplay').textContent = (speed1 / 1000).toFixed(2) + ' km/s';
            
            document.getElementById('comDisplay').textContent = 'At origin';
        } else {
            document.getElementById('periodDisplay').textContent = '-- s';
            document.getElementById('speedDisplay').textContent = '0.0 km/s';
            document.getElementById('comDisplay').textContent = '--';
        }
    }
    
    reset() {
        this.running = false;
        this.time = 0;
        this.pos1 = { x: 0, y: 0 };
        this.pos2 = { x: 0, y: 0 };
        this.vel1 = { x: 0, y: 0 };
        this.vel2 = { x: 0, y: 0 };
        this.trail1 = [];
        this.trail2 = [];
        this.timeData = [];
        this.forceData = [];
        this.distanceData = [];
        this.calculateForce();
        this.updateDisplays();
        this.draw();
        this.drawPlot();
    }
    
    physics(dt) {
        // Calculate distance between masses
        const dx = this.pos2.x - this.pos1.x;
        const dy = this.pos2.y - this.pos1.y;
        const r = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate gravitational force
        const F = this.G * this.mass1 * this.mass2 / (r * r);
        
        // Unit vector from 1 to 2
        const ux = dx / r;
        const uy = dy / r;
        
        // Force components
        const Fx = F * ux;
        const Fy = F * uy;
        
        // Accelerations
        const a1x = Fx / this.mass1;
        const a1y = Fy / this.mass1;
        const a2x = -Fx / this.mass2;
        const a2y = -Fy / this.mass2;
        
        // Update velocities
        this.vel1.x += a1x * dt;
        this.vel1.y += a1y * dt;
        this.vel2.x += a2x * dt;
        this.vel2.y += a2y * dt;
        
        // Update positions
        this.pos1.x += this.vel1.x * dt;
        this.pos1.y += this.vel1.y * dt;
        this.pos2.x += this.vel2.x * dt;
        this.pos2.y += this.vel2.y * dt;
        
        // Store trail
        this.trail1.push({ x: this.pos1.x, y: this.pos1.y });
        this.trail2.push({ x: this.pos2.x, y: this.pos2.y });
        
        if (this.trail1.length > this.maxTrailLength) {
            this.trail1.shift();
            this.trail2.shift();
        }
        
        this.time += dt;
        
        // Store data
        this.timeData.push(this.time);
        this.forceData.push(F);
        this.distanceData.push(r / 1e6); // in Mm
        
        if (this.timeData.length > this.maxDataPoints) {
            this.timeData.shift();
            this.forceData.shift();
            this.distanceData.shift();
        }
        
        this.force = F;
    }
    
    draw() {
        const ctx = this.mainCtx;
        const canvas = this.mainCanvas;
        
        ctx.fillStyle = getComputedStyle(canvas).backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = Math.min(canvas.width, canvas.height) / (this.distance * 3);
        
        // Draw center of mass
        ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#666' : '#999';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('COM', centerX, centerY - 10);
        
        if (this.running && this.showOrbits) {
            // Draw orbital trails
            ctx.strokeStyle = 'rgba(255, 100, 100, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < this.trail1.length; i++) {
                const x = centerX + this.trail1[i].x * scale;
                const y = centerY + this.trail1[i].y * scale;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            
            ctx.strokeStyle = 'rgba(100, 100, 255, 0.3)';
            ctx.beginPath();
            for (let i = 0; i < this.trail2.length; i++) {
                const x = centerX + this.trail2[i].x * scale;
                const y = centerY + this.trail2[i].y * scale;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        // Calculate positions
        let x1, y1, x2, y2;
        
        if (this.running) {
            x1 = centerX + this.pos1.x * scale;
            y1 = centerY + this.pos1.y * scale;
            x2 = centerX + this.pos2.x * scale;
            y2 = centerY + this.pos2.y * scale;
        } else {
            // Static display
            const totalMass = this.mass1 + this.mass2;
            const r1 = this.distance * this.mass2 / totalMass;
            const r2 = this.distance * this.mass1 / totalMass;
            
            x1 = centerX - r1 * scale;
            y1 = centerY;
            x2 = centerX + r2 * scale;
            y2 = centerY;
        }
        
        // Draw connection line
        ctx.strokeStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#444' : '#ddd';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw distance label
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const currentDist = this.running ? 
            Math.sqrt((this.pos2.x - this.pos1.x) ** 2 + (this.pos2.y - this.pos1.y) ** 2) / 1e6 :
            this.distance / 1e6;
        
        ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e4e4e4' : '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('r = ' + currentDist.toFixed(1) + ' Mm', midX, midY - 10);
        
        // Draw mass 1
        const radius1 = Math.cbrt(this.mass1 / 1e24) * 15 + 10;
        
        const gradient1 = ctx.createRadialGradient(
            x1 - radius1/3, y1 - radius1/3, radius1/10,
            x1, y1, radius1
        );
        gradient1.addColorStop(0, '#ff6666');
        gradient1.addColorStop(1, '#cc0000');
        
        ctx.fillStyle = gradient1;
        ctx.beginPath();
        ctx.arc(x1, y1, radius1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#880000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('M₁', x1, y1 + 4);
        
        // Draw mass 2
        const radius2 = Math.cbrt(this.mass2 / 1e24) * 15 + 10;
        
        const gradient2 = ctx.createRadialGradient(
            x2 - radius2/3, y2 - radius2/3, radius2/10,
            x2, y2, radius2
        );
        gradient2.addColorStop(0, '#6666ff');
        gradient2.addColorStop(1, '#0000cc');
        
        ctx.fillStyle = gradient2;
        ctx.beginPath();
        ctx.arc(x2, y2, radius2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#000088';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('M₂', x2, y2 + 4);
        
        // Draw force arrows
        const forceScale = 1e-20; // Adjust for visibility
        const arrowLength = Math.min(this.force * forceScale, 100);
        
        if (arrowLength > 5) {
            // Force on mass 1 (toward mass 2)
            const angle = Math.atan2(y2 - y1, x2 - x1);
            
            ctx.strokeStyle = '#ff6600';
            ctx.fillStyle = '#ff6600';
            ctx.lineWidth = 3;
            
            const f1x = x1 + radius1 * Math.cos(angle);
            const f1y = y1 + radius1 * Math.sin(angle);
            const f1endX = f1x + arrowLength * Math.cos(angle);
            const f1endY = f1y + arrowLength * Math.sin(angle);
            
            ctx.beginPath();
            ctx.moveTo(f1x, f1y);
            ctx.lineTo(f1endX, f1endY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(f1endX, f1endY);
            ctx.lineTo(f1endX - 10 * Math.cos(angle - Math.PI/6), f1endY - 10 * Math.sin(angle - Math.PI/6));
            ctx.lineTo(f1endX - 10 * Math.cos(angle + Math.PI/6), f1endY - 10 * Math.sin(angle + Math.PI/6));
            ctx.closePath();
            ctx.fill();
            
            // Force on mass 2 (toward mass 1)
            const f2x = x2 - radius2 * Math.cos(angle);
            const f2y = y2 - radius2 * Math.sin(angle);
            const f2endX = f2x - arrowLength * Math.cos(angle);
            const f2endY = f2y - arrowLength * Math.sin(angle);
            
            ctx.beginPath();
            ctx.moveTo(f2x, f2y);
            ctx.lineTo(f2endX, f2endY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(f2endX, f2endY);
            ctx.lineTo(f2endX + 10 * Math.cos(angle - Math.PI/6), f2endY + 10 * Math.sin(angle - Math.PI/6));
            ctx.lineTo(f2endX + 10 * Math.cos(angle + Math.PI/6), f2endY + 10 * Math.sin(angle + Math.PI/6));
            ctx.closePath();
            ctx.fill();
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
            ctx.fillText('Force and Distance vs Time', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        const padding = 50;
        const plotWidth = canvas.width - 2 * padding;
        const plotHeight = canvas.height - 2 * padding;
        
        const maxTime = Math.max(...this.timeData);
        const maxForce = Math.max(...this.forceData, 1e20);
        const maxDist = Math.max(...this.distanceData, 1);
        
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
        
        // Draw force curve (normalized)
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < this.timeData.length; i++) {
            const x = padding + (this.timeData[i] / maxTime) * plotWidth;
            const y = canvas.height - padding - (this.forceData[i] / maxForce) * plotHeight * 0.9;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Draw distance curve (normalized to same scale)
        const distScale = maxForce / maxDist;
        ctx.strokeStyle = '#0066ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < this.timeData.length; i++) {
            const x = padding + (this.timeData[i] / maxTime) * plotWidth;
            const y = canvas.height - padding - (this.distanceData[i] * distScale / maxForce) * plotHeight * 0.9;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Legend
        const legendX = canvas.width - padding - 100;
        const legendY = padding + 20;
        
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(legendX, legendY);
        ctx.lineTo(legendX + 30, legendY);
        ctx.stroke();
        
        ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e4e4e4' : '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Force', legendX + 35, legendY + 4);
        
        ctx.strokeStyle = '#0066ff';
        ctx.beginPath();
        ctx.moveTo(legendX, legendY + 20);
        ctx.lineTo(legendX + 30, legendY + 20);
        ctx.stroke();
        ctx.fillText('Distance', legendX + 35, legendY + 24);
    }
    
    animate() {
        if (!this.running) return;
        
        const currentTime = performance.now();
        const dt = Math.min((currentTime - this.lastTime) / 1000, 0.02);
        this.lastTime = currentTime;
        
        this.physics(dt);
        this.updateDisplays();
        this.draw();
        this.drawPlot();
        
        requestAnimationFrame(() => this.animate());
    }
}

new GravitationLaw();