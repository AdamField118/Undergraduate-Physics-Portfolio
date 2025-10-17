const container = document.getElementById('simulation-container');

container.innerHTML = `
    <div class="physics-sim-container">
        <div class="sim-header">
            <h2>Kepler's Second Law - Equal Area Law</h2>
            <p>A line from the Sun to a planet sweeps out equal areas in equal times!</p>
        </div>
        
        <div class="sim-layout">
            <div class="controls-panel">
                <h3>Controls</h3>
                
                <div class="control-group">
                    <label>Semi-Major Axis (AU)</label>
                    <input type="range" id="semiMajor" min="1" max="3" value="1.5" step="0.1">
                    <span id="semiMajorValue">1.5</span>
                </div>
                
                <div class="control-group">
                    <label>Eccentricity</label>
                    <input type="range" id="eccentricity" min="0" max="0.8" value="0.5" step="0.05">
                    <span id="eccentricityValue">0.50</span>
                </div>
                
                <div class="control-group">
                    <label>Time Interval (days)</label>
                    <input type="range" id="timeInterval" min="10" max="60" value="30" step="5">
                    <span id="timeIntervalValue">30</span>
                </div>
                
                <div class="control-group">
                    <label>Show Area Sweeps</label>
                    <input type="checkbox" id="showAreas" checked>
                </div>
                
                <div class="button-group">
                    <button id="start">Start Orbit</button>
                    <button id="pause">Pause</button>
                    <button id="reset">Reset</button>
                </div>
                
                <div class="info-panel">
                    <h4>Orbital Properties</h4>
                    <div class="info-row">
                        <span>Orbital Period:</span>
                        <span id="periodDisplay">0.0 days</span>
                    </div>
                    <div class="info-row">
                        <span>Current Speed:</span>
                        <span id="speedDisplay">0.0 km/s</span>
                    </div>
                    <div class="info-row">
                        <span>Distance from Sun:</span>
                        <span id="distanceDisplay">0.0 AU</span>
                    </div>
                </div>
                
                <div class="info-panel">
                    <h4>Area Measurements</h4>
                    <div class="info-row">
                        <span>Area 1 (near perihelion):</span>
                        <span id="area1Display">-- AU²</span>
                    </div>
                    <div class="info-row">
                        <span>Area 2 (near aphelion):</span>
                        <span id="area2Display">-- AU²</span>
                    </div>
                    <div class="info-row">
                        <span>Ratio:</span>
                        <span id="ratioDisplay">--</span>
                    </div>
                </div>
                
                <div class="equation-panel">
                    <h4>Kepler's Laws</h4>
                    <div class="principle" style="font-size: 14px;">
                        1st: Orbits are ellipses
                    </div>
                    <div class="principle" style="font-size: 14px;">
                        2nd: dA/dt = constant
                    </div>
                    <div class="principle" style="font-size: 14px;">
                        3rd: T² ∝ a³
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

class KeplersLaws {
    constructor() {
        this.mainCanvas = document.getElementById('mainCanvas');
        this.plotCanvas = document.getElementById('plotCanvas');
        this.mainCtx = this.mainCanvas.getContext('2d');
        this.plotCtx = this.plotCanvas.getContext('2d');
        
        // Orbital parameters
        this.semiMajorAxis = 1.5; // AU
        this.eccentricity = 0.5;
        this.timeInterval = 30; // days
        
        // State
        this.running = false;
        this.showAreas = true;
        this.time = 0;
        this.lastTime = 0;
        this.theta = 0; // true anomaly
        
        // Area tracking
        this.areaSweeps = [];
        this.area1 = null;
        this.area2 = null;
        this.measuring = false;
        this.measureStart = 0;
        this.measurePositions = [];
        
        // Trail
        this.trail = [];
        this.maxTrailLength = 200;
        
        // Data for plotting
        this.timeData = [];
        this.speedData = [];
        this.distanceData = [];
        this.maxDataPoints = 300;
        
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
        document.getElementById('semiMajor').addEventListener('input', (e) => {
            this.semiMajorAxis = parseFloat(e.target.value);
            document.getElementById('semiMajorValue').textContent = this.semiMajorAxis.toFixed(1);
            this.updateDisplays();
            if (!this.running) this.draw();
        });
        
        document.getElementById('eccentricity').addEventListener('input', (e) => {
            this.eccentricity = parseFloat(e.target.value);
            document.getElementById('eccentricityValue').textContent = this.eccentricity.toFixed(2);
            if (!this.running) this.draw();
        });
        
        document.getElementById('timeInterval').addEventListener('input', (e) => {
            this.timeInterval = parseFloat(e.target.value);
            document.getElementById('timeIntervalValue').textContent = this.timeInterval;
        });
        
        document.getElementById('showAreas').addEventListener('change', (e) => {
            this.showAreas = e.target.checked;
        });
        
        document.getElementById('start').addEventListener('click', () => {
            if (!this.running) {
                this.running = true;
                this.lastTime = performance.now();
                this.animate();
            }
        });
        
        document.getElementById('pause').addEventListener('click', () => {
            this.running = false;
        });
        
        document.getElementById('reset').addEventListener('click', () => {
            this.reset();
        });
        
        window.addEventListener('resize', () => this.setupCanvas());
    }
    
    calculateOrbitalPeriod() {
        // Kepler's 3rd law: T² = a³ (in years for AU)
        return Math.sqrt(Math.pow(this.semiMajorAxis, 3)) * 365.25; // days
    }
    
    getPosition(theta) {
        // Polar equation: r = a(1-e²)/(1+e*cos(θ))
        const a = this.semiMajorAxis;
        const e = this.eccentricity;
        const r = a * (1 - e * e) / (1 + e * Math.cos(theta));
        
        return {
            r: r,
            x: r * Math.cos(theta),
            y: r * Math.sin(theta)
        };
    }
    
    getSpeed(r) {
        // Vis-viva equation: v² = GM(2/r - 1/a)
        // In AU and days: v² = 4π²(2/r - 1/a)
        const a = this.semiMajorAxis;
        const v = Math.sqrt(4 * Math.PI * Math.PI * (2 / r - 1 / a));
        return v * 1731; // Convert to km/s (approximately)
    }
    
    updateDisplays() {
        const period = this.calculateOrbitalPeriod();
        document.getElementById('periodDisplay').textContent = period.toFixed(1) + ' days';
        
        if (this.running) {
            const pos = this.getPosition(this.theta);
            const speed = this.getSpeed(pos.r);
            document.getElementById('speedDisplay').textContent = speed.toFixed(2) + ' km/s';
            document.getElementById('distanceDisplay').textContent = pos.r.toFixed(3) + ' AU';
        } else {
            document.getElementById('speedDisplay').textContent = '0.0 km/s';
            document.getElementById('distanceDisplay').textContent = '0.0 AU';
        }
        
        if (this.area1 !== null && this.area2 !== null) {
            document.getElementById('area1Display').textContent = this.area1.toFixed(4) + ' AU²';
            document.getElementById('area2Display').textContent = this.area2.toFixed(4) + ' AU²';
            const ratio = this.area1 / this.area2;
            document.getElementById('ratioDisplay').textContent = ratio.toFixed(3) + ' ≈ 1.000';
        }
    }
    
    reset() {
        this.running = false;
        this.time = 0;
        this.theta = 0;
        this.trail = [];
        this.areaSweeps = [];
        this.area1 = null;
        this.area2 = null;
        this.measuring = false;
        this.measurePositions = [];
        this.timeData = [];
        this.speedData = [];
        this.distanceData = [];
        this.updateDisplays();
        this.draw();
        this.drawPlot();
    }
    
    calculateSweptArea(positions) {
        // Calculate area of triangle swept by sun-planet line
        // Using shoelace formula for polygon area
        if (positions.length < 2) return 0;
        
        let area = 0;
        for (let i = 0; i < positions.length - 1; i++) {
            area += positions[i].x * positions[i+1].y - positions[i+1].x * positions[i].y;
        }
        // Close the polygon (back to origin)
        area += positions[positions.length-1].x * 0 - 0 * positions[positions.length-1].y;
        
        return Math.abs(area) / 2;
    }
    
    physics(dt) {
        // Angular momentum conservation: r²(dθ/dt) = constant
        // For simplicity, use mean motion adjusted by distance
        const period = this.calculateOrbitalPeriod();
        const meanMotion = 2 * Math.PI / period; // radians per day
        
        const pos = this.getPosition(this.theta);
        
        // Kepler's 2nd law: dθ/dt varies with 1/r²
        const perihelionDist = this.semiMajorAxis * (1 - this.eccentricity);
        const dThetaDt = meanMotion * Math.pow(perihelionDist / pos.r, 2);
        
        this.theta += dThetaDt * dt;
        
        // Keep theta in range
        if (this.theta > 2 * Math.PI) {
            this.theta -= 2 * Math.PI;
        }
        
        this.time += dt;
        
        // Store position for area calculation
        this.measurePositions.push({ x: pos.x, y: pos.y, time: this.time });
        
        // Check if we should measure an area
        if (this.measurePositions.length > 1) {
            const timeSpan = this.time - this.measurePositions[0].time;
            
            if (timeSpan >= this.timeInterval) {
                const area = this.calculateSweptArea(this.measurePositions);
                
                // Store areas near perihelion and aphelion
                if (this.area1 === null && this.theta < Math.PI / 4) {
                    this.area1 = area;
                    this.areaSweeps.push({
                        positions: [...this.measurePositions],
                        area: area,
                        color: 'rgba(255, 100, 100, 0.3)',
                        label: 'Area 1'
                    });
                } else if (this.area2 === null && this.theta > Math.PI && this.theta < 5 * Math.PI / 4) {
                    this.area2 = area;
                    this.areaSweeps.push({
                        positions: [...this.measurePositions],
                        area: area,
                        color: 'rgba(100, 100, 255, 0.3)',
                        label: 'Area 2'
                    });
                }
                
                // Clear for next measurement
                this.measurePositions = [this.measurePositions[this.measurePositions.length - 1]];
            }
        }
        
        // Store trail
        this.trail.push({ x: pos.x, y: pos.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        
        // Store data for plotting
        const speed = this.getSpeed(pos.r);
        this.timeData.push(this.time);
        this.speedData.push(speed);
        this.distanceData.push(pos.r);
        
        if (this.timeData.length > this.maxDataPoints) {
            this.timeData.shift();
            this.speedData.shift();
            this.distanceData.shift();
        }
    }
    
    draw() {
        const ctx = this.mainCtx;
        const canvas = this.mainCanvas;
        
        ctx.fillStyle = getComputedStyle(canvas).backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = Math.min(canvas.width, canvas.height) / (this.semiMajorAxis * 3);
        
        // Draw orbital ellipse
        const a = this.semiMajorAxis * scale;
        const b = a * Math.sqrt(1 - this.eccentricity * this.eccentricity);
        const c = a * this.eccentricity; // focus distance
        
        ctx.strokeStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#444' : '#ddd';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.ellipse(centerX + c, centerY, a, a, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw trail
        if (this.trail.length > 1) {
            ctx.strokeStyle = 'rgba(100, 150, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < this.trail.length; i++) {
                const x = centerX + this.trail[i].x * scale;
                const y = centerY + this.trail[i].y * scale;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        // Draw area sweeps
        if (this.showAreas) {
            for (const sweep of this.areaSweeps) {
                ctx.fillStyle = sweep.color;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY); // Sun
                for (const pos of sweep.positions) {
                    ctx.lineTo(centerX + pos.x * scale, centerY + pos.y * scale);
                }
                ctx.closePath();
                ctx.fill();
            }
        }
        
        // Draw Sun
        const sunRadius = 20;
        const sunGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, sunRadius
        );
        sunGradient.addColorStop(0, '#ffff00');
        sunGradient.addColorStop(0.5, '#ffaa00');
        sunGradient.addColorStop(1, '#ff6600');
        
        ctx.fillStyle = sunGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#cc5500';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('☉', centerX, centerY + 5);
        
        // Draw planet
        const pos = this.running ? this.getPosition(this.theta) : { x: this.semiMajorAxis * (1 - this.eccentricity), y: 0, r: 0 };
        const planetX = centerX + pos.x * scale;
        const planetY = centerY + pos.y * scale;
        const planetRadius = 12;
        
        const planetGradient = ctx.createRadialGradient(
            planetX - planetRadius/3, planetY - planetRadius/3, 0,
            planetX, planetY, planetRadius
        );
        planetGradient.addColorStop(0, '#6699ff');
        planetGradient.addColorStop(1, '#0044cc');
        
        ctx.fillStyle = planetGradient;
        ctx.beginPath();
        ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#003388';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw line from sun to planet
        ctx.strokeStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#666' : '#999';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(planetX, planetY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw perihelion and aphelion markers
        const perihelion = this.semiMajorAxis * (1 - this.eccentricity);
        const aphelion = this.semiMajorAxis * (1 + this.eccentricity);
        
        ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#888' : '#666';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        
        ctx.fillText('Perihelion', centerX + perihelion * scale, centerY + 30);
        ctx.fillText('(fast)', centerX + perihelion * scale, centerY + 42);
        
        ctx.fillText('Aphelion', centerX - aphelion * scale, centerY + 30);
        ctx.fillText('(slow)', centerX - aphelion * scale, centerY + 42);
        
        // Labels
        ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e4e4e4' : '#333';
        ctx.font = '12px Arial';
        ctx.fillText('a = ' + this.semiMajorAxis.toFixed(1) + ' AU', centerX, 25);
        ctx.fillText('e = ' + this.eccentricity.toFixed(2), centerX, 40);
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
            ctx.fillText('Speed varies with distance (Kepler\'s 2nd Law)', 
                        canvas.width / 2, canvas.height / 2);
            return;
        }
        
        const padding = 50;
        const plotWidth = canvas.width - 2 * padding;
        const plotHeight = canvas.height - 2 * padding;
        
        const maxTime = Math.max(...this.timeData);
        const maxSpeed = Math.max(...this.speedData, 10);
        const minSpeed = Math.min(...this.speedData, 0);
        const speedRange = maxSpeed - minSpeed;
        
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
        ctx.fillText('Time (days)', canvas.width / 2, canvas.height - 10);
        
        ctx.save();
        ctx.translate(15, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Orbital Speed (km/s)', 0, 0);
        ctx.restore();
        
        // Draw speed curve
        ctx.strokeStyle = '#0066ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < this.timeData.length; i++) {
            const x = padding + (this.timeData[i] / maxTime) * plotWidth;
            const y = canvas.height - padding - ((this.speedData[i] - minSpeed) / speedRange) * plotHeight * 0.9;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    
    animate() {
        if (!this.running) return;
        
        const currentTime = performance.now();
        const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05) * 5; // Speed up simulation
        this.lastTime = currentTime;
        
        this.physics(dt);
        this.updateDisplays();
        this.draw();
        this.drawPlot();
        
        requestAnimationFrame(() => this.animate());
    }
}

new KeplersLaws();