"use strict";

// 1D Quantum Mechanics Sandbox - Clean Version
const container = document.getElementById('simulation-container');

// Create the UI structure
container.innerHTML = `
    <div class="quantum-container">
        <div class="controls-panel" id="controlsPanel">
            <h3>Quantum Controls</h3>
            
            <div class="control-section">
                <h4>Wave Packet</h4>
                <div class="control-group">
                    <label>Energy (k₀²/2)</label>
                    <input type="range" id="energySlider" min="0.1" max="3.0" step="0.1" value="1.0">
                    <span id="energyValue">1.0</span>
                </div>
                <div class="control-group">
                    <label>Packet Width (σ)</label>
                    <input type="range" id="widthSlider" min="0.5" max="5.0" step="0.1" value="2.0">
                    <span id="widthValue">2.0</span>
                </div>
                <div class="control-group">
                    <label>Start Position</label>
                    <input type="range" id="startPosSlider" min="-15" max="-5" step="0.5" value="-10">
                    <span id="startPosValue">-10</span>
                </div>
            </div>

            <div class="control-section">
                <h4>Potential</h4>
                <div class="control-group">
                    <label>Type</label>
                    <select id="potentialType">
                        <option value="step">Step Barrier</option>
                        <option value="well">Square Well</option>
                        <option value="barrier">Square Barrier</option>
                    </select>
                </div>
                <div class="control-group">
                    <label>Height/Depth</label>
                    <input type="range" id="potentialHeight" min="0.0" max="2.0" step="0.1" value="0.5">
                    <span id="potentialHeightValue">0.5</span>
                </div>
                <div class="control-group">
                    <label>Width</label>
                    <input type="range" id="potentialWidth" min="1.0" max="10.0" step="0.5" value="3.0">
                    <span id="potentialWidthValue">3.0</span>
                </div>
            </div>

            <div class="control-section">
                <h4>Simulation</h4>
                <div class="control-group">
                    <label>Time Step</label>
                    <input type="range" id="timeStepSlider" min="0.01" max="0.1" step="0.01" value="0.05">
                    <span id="timeStepValue">0.05</span>
                </div>
                <div class="control-row">
                    <button id="playPauseBtn">▶ Start</button>
                    <button id="resetBtn">Reset</button>
                </div>
            </div>

            <div class="measurements-panel">
                <h4>Measurements</h4>
                <div class="measurement-row">
                    <span>E vs V₀:</span>
                    <span id="energyRegime">E > V₀</span>
                </div>
                <div class="measurement-row">
                    <span>k (left):</span>
                    <span id="kLeftValue">1.41</span>
                </div>
                <div class="measurement-row">
                    <span>k' (right):</span>
                    <span id="kRightValue">1.00</span>
                </div>
                <div class="measurement-row theory-section">
                    <span><strong>Theory:</strong></span>
                </div>
                <div class="measurement-row">
                    <span>R (theory):</span>
                    <span id="theoreticalR">0.000</span>
                </div>
                <div class="measurement-row">
                    <span>T (theory):</span>
                    <span id="theoreticalT">0.000</span>
                </div>
                <div class="measurement-row measured-section">
                    <span><strong>Measured:</strong></span>
                </div>
                <div class="measurement-row">
                    <span>R (measured):</span>
                    <span id="reflectionValue">0.000</span>
                </div>
                <div class="measurement-row">
                    <span>T (measured):</span>
                    <span id="transmissionValue">0.000</span>
                </div>
                <div class="measurement-row">
                    <span>R + T:</span>
                    <span id="conservationValue">1.000</span>
                </div>
            </div>
        </div>

        <div class="visualization-area">
            <canvas id="quantumCanvas"></canvas>
            <div class="plot-labels">
                <div class="legend-box">
                    <div class="legend-title">Legend</div>
                    <div class="legend-item">
                        <span class="color-box wavefunction-color"></span>
                        <span>|ψ(x)|² Probability</span>
                    </div>
                    <div class="legend-item">
                        <span class="color-box left-wave-color"></span>
                        <span>Re[ψ] Incident + Reflected</span>
                    </div>
                    <div class="legend-item">
                        <span class="color-box right-wave-color"></span>
                        <span>Re[ψ] Transmitted/Evanescent</span>
                    </div>
                    <div class="legend-item">
                        <span class="color-box potential-color"></span>
                        <span>V(x) Potential</span>
                    </div>
                    <div class="legend-item">
                        <span class="color-box energy-color"></span>
                        <span>E Energy Level</span>
                    </div>
                </div>
            </div>
        </div>
        
        <button class="toggle-ui-btn" id="toggleUI">Hide Controls</button>
    </div>
`;

// Add comprehensive styling with proper spacing
const style = document.createElement('style');
style.textContent = `
    /* Account for your website's nav and footer structure */
    #simulation-container {
        margin: 20px;
        margin-bottom: 80px; /* Extra space for fixed footer */
    }
    
    .quantum-container {
        width: 100%;
        height: calc(100vh - 160px); /* Nav (~50px) + Footer (~50px) + Margins (~60px) */
        min-height: 400px;
        max-height: 700px;
        display: flex;
        background: linear-gradient(135deg, #000428 0%, #004e92 100%);
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        margin: 0;
        padding: 0;
    }
    
    .controls-panel {
        width: 320px;
        min-width: 320px;
        background: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 15px;
        overflow-y: auto;
        border-right: 2px solid #333;
        font-family: 'Courier New', monospace;
        font-size: 11px;
        transition: transform 0.3s ease;
        flex-shrink: 0;
    }
    
    .controls-panel.hidden {
        transform: translateX(-100%);
        margin-left: -320px;
    }
    
    .controls-panel h3 {
        color: #4fc3f7;
        margin: 0 0 15px 0;
        text-align: center;
        border-bottom: 1px solid #333;
        padding-bottom: 8px;
        font-size: 13px;
    }
    
    .controls-panel h4 {
        color: #81c784;
        margin: 15px 0 8px 0;
        font-size: 11px;
    }
    
    .control-section {
        margin-bottom: 15px;
        border: 1px solid #444;
        padding: 10px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.02);
    }
    
    .control-group {
        margin-bottom: 10px;
    }
    
    .control-group label {
        display: block;
        margin-bottom: 4px;
        color: #ccc;
        font-size: 10px;
    }
    
    .control-group input[type="range"] {
        width: 100%;
        margin: 3px 0;
        cursor: pointer;
    }
    
    .control-group select {
        width: 100%;
        padding: 4px;
        background: #333;
        color: white;
        border: 1px solid #555;
        border-radius: 3px;
        font-size: 10px;
        cursor: pointer;
    }
    
    .control-group span {
        color: #4fc3f7;
        font-size: 10px;
        font-weight: bold;
    }
    
    .control-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }
    
    .control-row button {
        flex: 1;
        min-width: 70px;
        padding: 8px 10px;
        background: #1976d2;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 10px;
        font-family: 'Courier New', monospace;
        cursor: pointer;
        transition: background 0.2s;
    }
    
    .control-row button:hover {
        background: #1565c0;
    }
    
    .control-row button:active {
        background: #0d47a1;
    }
    
    .measurements-panel {
        margin-top: 15px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        border: 1px solid #444;
    }
    
    .measurement-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
        font-size: 10px;
    }
    
    .measurement-row span:first-child {
        color: #ccc;
    }
    
    .measurement-row span:last-child {
        color: #4fc3f7;
        font-weight: bold;
    }
    
    .theory-section span, .measured-section span {
        color: #81c784 !important;
        font-weight: bold !important;
        font-size: 10px !important;
    }
    
    .theory-section, .measured-section {
        margin-top: 8px !important;
        border-top: 1px solid #444 !important;
        padding-top: 4px !important;
    }
    
    .visualization-area {
        flex: 1;
        position: relative;
        display: flex;
        flex-direction: column;
        min-width: 0;
        height: 100%;
    }
    
    #quantumCanvas {
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, #001122 0%, #002244 100%);
        cursor: crosshair;
    }
    
    .plot-labels {
        position: absolute;
        pointer-events: none;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
    
    .legend-box {
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px;
        border-radius: 6px;
        border: 1px solid #333;
        font-family: 'Courier New', monospace;
        font-size: 9px;
        min-width: 180px;
        backdrop-filter: blur(5px);
    }
    
    .legend-title {
        font-weight: bold;
        color: #4fc3f7;
        margin-bottom: 6px;
        font-size: 10px;
        text-align: center;
        border-bottom: 1px solid #333;
        padding-bottom: 3px;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 3px;
        gap: 6px;
    }
    
    .color-box {
        width: 10px;
        height: 6px;
        border-radius: 2px;
        flex-shrink: 0;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .wavefunction-color {
        background: #4fc3f7;
    }
    
    .left-wave-color {
        background: #81c784;
    }
    
    .right-wave-color {
        background: linear-gradient(to right, #ff9800, #f44336);
    }
    
    .potential-color {
        background: #ff6b6b;
    }
    
    .energy-color {
        background: #ffeb3b;
    }
    
    .legend-item span:last-child {
        color: #e0e0e0;
        font-size: 8px;
        line-height: 1.2;
    }
    
    .toggle-ui-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        border: 1px solid #555;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        font-family: 'Courier New', monospace;
        z-index: 1000;
        transition: background 0.2s;
    }
    
    .toggle-ui-btn:hover {
        background: rgba(50, 50, 50, 0.9);
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
        #simulation-container {
            margin: 10px;
            margin-bottom: 70px;
        }
        
        .quantum-container {
            height: calc(100vh - 140px);
            max-height: none;
            flex-direction: column;
        }
        
        .controls-panel {
            width: 100%;
            min-width: auto;
            height: 280px;
            border-right: none;
            border-bottom: 2px solid #333;
        }
        
        .controls-panel.hidden {
            transform: translateY(-100%);
            margin-left: 0;
            margin-top: -280px;
        }
        
        .visualization-area {
            flex: 1;
            min-height: 250px;
        }
        
        .legend-box {
            top: 5px;
            left: 5px;
            padding: 4px;
            min-width: 150px;
            font-size: 7px;
        }
        
        .legend-title {
            font-size: 8px;
            margin-bottom: 4px;
        }
        
        .legend-item span:last-child {
            font-size: 6px;
        }
        
        .color-box {
            width: 8px;
            height: 5px;
        }
        
        .toggle-ui-btn {
            top: 5px;
            right: 5px;
            padding: 6px 8px;
            font-size: 9px;
        }
    }
    
    @media (max-width: 480px) {
        #simulation-container {
            margin: 5px;
            margin-bottom: 65px;
        }
        
        .quantum-container {
            height: calc(100vh - 120px);
        }
        
        .controls-panel {
            height: 260px;
        }
        
        .legend-box {
            font-size: 6px;
            min-width: 120px;
            padding: 3px;
        }
        
        .legend-title {
            font-size: 7px;
        }
        
        .legend-item span:last-child {
            font-size: 5px;
        }
    }
`;
document.head.appendChild(style);

class QuantumSandbox {
    constructor() {
        console.log("Initializing Quantum Sandbox...");
        
        this.canvas = document.getElementById('quantumCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        if (!this.canvas || !this.ctx) {
            console.error("Canvas not found!");
            return;
        }
        
        // Physical parameters (dimensionless units: ℏ = m = 1)
        this.L = 40;           // Domain length
        this.N = 256;          // Grid points
        this.dx = this.L / this.N;
        this.dt = 0.05;        // Time step
        
        // Grid arrays
        this.x = new Float32Array(this.N);
        this.V = new Float32Array(this.N);
        this.absorber = new Float32Array(this.N);
        
        // Wave function (complex)
        this.psi_real = new Float32Array(this.N);
        this.psi_imag = new Float32Array(this.N);
        
        // Simulation state
        this.isRunning = false;
        this.currentStep = 0;
        this.time = 0;
        this.animationId = null;
        
        // Wave packet parameters
        this.energy = 1.0;
        this.sigma = 2.0;
        this.x0 = -10.0;
        
        // Potential parameters
        this.potentialType = 'step';
        this.potentialHeight = 0.5;
        this.potentialWidth = 3.0;
        
        // Measurements - Initialize all properties with correct defaults
        this.reflection = 0;
        this.transmission = 0;
        this.packetCenter = -10;
        this.conservationValue = 1;
        
        // Initialize theoretical values properly
        this.theoreticalR = 0;
        this.theoreticalT = 0;
        this.k = Math.sqrt(2 * this.energy);
        this.kPrime = Math.sqrt(2 * Math.max(0.1, this.energy - this.potentialHeight));
        this.energyRegime = this.energy > this.potentialHeight ? "E > V₀" : "E < V₀";
        
        console.log(`Constructor: E=${this.energy}, V₀=${this.potentialHeight}, Initial regime=${this.energyRegime}`);
        
        console.log("Starting initialization...");
        this.init();
    }
    
    init() {
        try {
            this.setupGrid();
            this.setupPotential(); // This calls calculateTheoreticalRT()
            this.setupInitialWavepacket();
            this.calculateMeasurements();
            this.updateDisplays();
            this.setupEventListeners();
            this.resizeCanvas();
            this.render();
            
            // Force initial theoretical calculation
            this.calculateTheoreticalRT();
            this.updateDisplays();
            
            console.log("Quantum Sandbox initialized successfully!");
            console.log(`Initial theory: R=${this.theoreticalR.toFixed(3)}, T=${this.theoreticalT.toFixed(3)}`);
        } catch (error) {
            console.error("Error during initialization:", error);
        }
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.render();
        });
    }
    
    setupGrid() {
        // Position grid: centered at origin
        for (let i = 0; i < this.N; i++) {
            this.x[i] = -this.L/2 + i * this.dx;
        }
        
        // Setup absorbing boundaries
        this.setupAbsorber();
    }
    
    setupAbsorber() {
        const absorberWidth = this.L * 0.1;
        const gamma = 0.05;
        
        for (let i = 0; i < this.N; i++) {
            const x = this.x[i];
            const edgeDistance = Math.min(Math.abs(x + this.L/2), Math.abs(x - this.L/2));
            
            if (edgeDistance < absorberWidth) {
                const ratio = 1 - edgeDistance / absorberWidth;
                this.absorber[i] = gamma * ratio * ratio;
            } else {
                this.absorber[i] = 0;
            }
        }
    }
    
    setupPotential() {
        this.V.fill(0);
        
        switch (this.potentialType) {
            case 'step':
                for (let i = 0; i < this.N; i++) {
                    if (this.x[i] > 0) {
                        this.V[i] = this.potentialHeight;
                    }
                }
                break;
                
            case 'well':
                for (let i = 0; i < this.N; i++) {
                    const x = this.x[i];
                    if (Math.abs(x) < this.potentialWidth/2) {
                        this.V[i] = -this.potentialHeight;
                    }
                }
                break;
                
            case 'barrier':
                for (let i = 0; i < this.N; i++) {
                    const x = this.x[i];
                    if (Math.abs(x) < this.potentialWidth/2) {
                        this.V[i] = this.potentialHeight;
                    }
                }
                break;
        }
        
        this.calculateTheoreticalRT();
    }
    
    setupInitialWavepacket() {
        const k0 = Math.sqrt(2 * this.energy);
        
        let norm = 0;
        for (let i = 0; i < this.N; i++) {
            const x = this.x[i];
            const gauss = Math.exp(-Math.pow(x - this.x0, 2) / (2 * this.sigma * this.sigma));
            this.psi_real[i] = gauss * Math.cos(k0 * x);
            this.psi_imag[i] = gauss * Math.sin(k0 * x);
            norm += this.psi_real[i] * this.psi_real[i] + this.psi_imag[i] * this.psi_imag[i];
            
            // Check for NaN during creation
            if (isNaN(this.psi_real[i]) || isNaN(this.psi_imag[i])) {
                console.warn(`NaN detected at grid point ${i}, resetting to zero`);
                this.psi_real[i] = 0;
                this.psi_imag[i] = 0;
            }
        }
        
        norm = Math.sqrt(norm * this.dx);
        
        // Prevent division by zero in normalization
        if (norm < 1e-10 || !isFinite(norm) || isNaN(norm)) {
            console.warn("Invalid normalization constant, reinitializing with default packet...");
            // Create a simple default packet
            const center = Math.floor(this.N / 4); // Left side of domain
            for (let i = 0; i < this.N; i++) {
                this.psi_real[i] = 0;
                this.psi_imag[i] = 0;
            }
            // Small Gaussian at default position
            for (let i = center - 20; i < center + 20 && i < this.N; i++) {
                if (i >= 0) {
                    const x = this.x[i];
                    const gauss = Math.exp(-0.1 * x * x);
                    this.psi_real[i] = gauss * Math.cos(k0 * x);
                    this.psi_imag[i] = gauss * Math.sin(k0 * x);
                }
            }
            // Recalculate norm
            norm = 0;
            for (let i = 0; i < this.N; i++) {
                norm += this.psi_real[i] * this.psi_real[i] + this.psi_imag[i] * this.psi_imag[i];
            }
            norm = Math.sqrt(norm * this.dx);
        }
        
        // Normalize with safety check
        if (norm > 1e-10) {
            for (let i = 0; i < this.N; i++) {
                this.psi_real[i] /= norm;
                this.psi_imag[i] /= norm;
                
                // Final NaN check after normalization
                if (isNaN(this.psi_real[i]) || isNaN(this.psi_imag[i])) {
                    this.psi_real[i] = 0;
                    this.psi_imag[i] = 0;
                }
            }
        }
        
        this.currentStep = 0;
        this.time = 0;
        
        console.log(`Wavepacket initialized: norm=${norm.toFixed(6)}`);
    }
    
    calculateTheoreticalRT() {
        console.log(`Calculating theory: E=${this.energy}, V₀=${this.potentialHeight}, type=${this.potentialType}`);
        
        if (this.potentialType !== 'step') {
            this.theoreticalR = 0;
            this.theoreticalT = 0;
            this.k = Math.sqrt(2 * this.energy);
            this.kPrime = this.k;
            this.energyRegime = "Not step";
            return;
        }
        
        const E = this.energy;
        const V0 = this.potentialHeight;
        
        // Ensure positive energy
        this.k = Math.sqrt(Math.max(0.001, 2 * E));
        
        if (E > V0) {
            // Ensure we don't get negative values under square root
            this.kPrime = Math.sqrt(Math.max(0.001, 2 * (E - V0)));
            this.energyRegime = "E > V₀";
            
            // Prevent division by zero
            const denominator = (this.k + this.kPrime) * (this.k + this.kPrime);
            if (denominator < 1e-10) {
                this.theoreticalR = 0.5;
                this.theoreticalT = 0.5;
            } else {
                const numerator = (this.k - this.kPrime) * (this.k - this.kPrime);
                this.theoreticalR = numerator / denominator;
                this.theoreticalT = (4 * this.k * this.kPrime) / denominator;
            }
            
            // NaN checks and corrections
            if (!isFinite(this.theoreticalR) || isNaN(this.theoreticalR)) {
                console.warn("NaN detected in R calculation, setting to 0.5");
                this.theoreticalR = 0.5;
            }
            if (!isFinite(this.theoreticalT) || isNaN(this.theoreticalT)) {
                console.warn("NaN detected in T calculation, setting to 0.5");
                this.theoreticalT = 0.5;
            }
            
            // Ensure conservation
            const sum = this.theoreticalR + this.theoreticalT;
            if (Math.abs(sum - 1.0) > 0.1) {
                console.warn(`Conservation violation: R+T=${sum}, normalizing...`);
                this.theoreticalR /= sum;
                this.theoreticalT /= sum;
            }
            
            console.log(`E > V₀: k=${this.k.toFixed(3)}, k'=${this.kPrime.toFixed(3)}`);
            console.log(`Theory: R=${this.theoreticalR.toFixed(3)}, T=${this.theoreticalT.toFixed(3)}, sum=${(this.theoreticalR + this.theoreticalT).toFixed(3)}`);
        } else {
            this.kPrime = Math.sqrt(Math.max(0.001, 2 * (V0 - E)));
            this.energyRegime = "E < V₀";
            this.theoreticalR = 1.0;
            this.theoreticalT = 0.0;
            
            console.log(`E < V₀: k=${this.k.toFixed(3)}, κ=${this.kPrime.toFixed(3)} (evanescent)`);
            console.log(`Theory: R=${this.theoreticalR}, T=${this.theoreticalT} (total reflection)`);
        }
    }
    
    setupEventListeners() {
        console.log("Setting up event listeners...");
        
        // Control updates
        const energySlider = document.getElementById('energySlider');
        const widthSlider = document.getElementById('widthSlider');
        const startPosSlider = document.getElementById('startPosSlider');
        const potentialType = document.getElementById('potentialType');
        const potentialHeight = document.getElementById('potentialHeight');
        const potentialWidth = document.getElementById('potentialWidth');
        const timeStepSlider = document.getElementById('timeStepSlider');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        const toggleUI = document.getElementById('toggleUI');
        
        if (!energySlider || !playPauseBtn) {
            console.error("Critical UI elements not found!");
            return;
        }
        
        energySlider.addEventListener('input', (e) => {
            this.energy = parseFloat(e.target.value);
            this.calculateTheoreticalRT();
            this.updateDisplays();
            if (!this.isRunning) this.reset();
        });
        
        widthSlider.addEventListener('input', (e) => {
            this.sigma = parseFloat(e.target.value);
            this.calculateTheoreticalRT();
            this.updateDisplays();
            if (!this.isRunning) this.reset();
        });
        
        startPosSlider.addEventListener('input', (e) => {
            this.x0 = parseFloat(e.target.value);
            this.calculateTheoreticalRT();
            this.updateDisplays();
            if (!this.isRunning) this.reset();
        });
        
        potentialType.addEventListener('change', (e) => {
            this.potentialType = e.target.value;
            this.setupPotential();
            this.calculateTheoreticalRT();
            this.updateDisplays();
            if (!this.isRunning) this.reset();
        });
        
        potentialHeight.addEventListener('input', (e) => {
            this.potentialHeight = parseFloat(e.target.value);
            this.setupPotential();
            this.calculateTheoreticalRT();
            this.updateDisplays();
            if (!this.isRunning) this.reset();
        });
        
        potentialWidth.addEventListener('input', (e) => {
            this.potentialWidth = parseFloat(e.target.value);
            this.setupPotential();
            this.calculateTheoreticalRT();
            this.updateDisplays();
            if (!this.isRunning) this.reset();
        });
        
        timeStepSlider.addEventListener('input', (e) => {
            this.dt = parseFloat(e.target.value);
            this.calculateTheoreticalRT();
            this.updateDisplays();
        });
        
        playPauseBtn.addEventListener('click', () => {
            this.toggleSimulation();
        });
        
        resetBtn.addEventListener('click', () => {
            this.reset();
        });
        
        toggleUI.addEventListener('click', () => {
            this.toggleUI();
        });
        
        console.log("Event listeners set up successfully!");
    }
    
    toggleUI() {
        const panel = document.getElementById('controlsPanel');
        const btn = document.getElementById('toggleUI');
        
        panel.classList.toggle('hidden');
        btn.textContent = panel.classList.contains('hidden') ? 'Show Controls' : 'Hide Controls';
        
        // Trigger a resize to adjust canvas
        setTimeout(() => {
            this.resizeCanvas();
            this.render();
        }, 300);
    }
    
    toggleSimulation() {
        this.isRunning = !this.isRunning;
        const btn = document.getElementById('playPauseBtn');
        
        if (this.isRunning) {
            btn.textContent = '⏸ Pause';
            this.startEvolution();
        } else {
            btn.textContent = '▶ Start';
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }
    }
    
    reset() {
        this.isRunning = false;
        document.getElementById('playPauseBtn').textContent = '▶ Start';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        this.setupPotential();
        this.setupInitialWavepacket();
        this.calculateTheoreticalRT(); // Ensure theory is recalculated
        this.calculateMeasurements();
        this.updateDisplays();
        this.render();
    }
    
    startEvolution() {
        const evolve = () => {
            if (!this.isRunning) return;
            
            // Perform time steps
            for (let step = 0; step < 2; step++) {
                this.timeStep();
                this.currentStep++;
                this.time += this.dt;
                
                // Periodic normalization check to prevent drift
                if (this.currentStep % 50 === 0) {
                    this.checkAndCorrectNormalization();
                }
            }
            
            this.calculateMeasurements();
            this.updateDisplays();
            this.render();
            
            this.animationId = requestAnimationFrame(evolve);
        };
        
        evolve();
    }
    
    checkAndCorrectNormalization() {
        let norm = 0;
        for (let i = 0; i < this.N; i++) {
            const prob = this.psi_real[i] * this.psi_real[i] + this.psi_imag[i] * this.psi_imag[i];
            if (isFinite(prob)) {
                norm += prob;
            }
        }
        norm = Math.sqrt(norm * this.dx);
        
        // Check if normalization has drifted significantly
        if (norm < 0.1 || norm > 2.0 || !isFinite(norm)) {
            console.warn(`Normalization drift detected: ${norm}, correcting...`);
            
            if (norm > 1e-10 && isFinite(norm)) {
                // Renormalize
                for (let i = 0; i < this.N; i++) {
                    this.psi_real[i] /= norm;
                    this.psi_imag[i] /= norm;
                }
            } else {
                // Reset to a simple wave packet if normalization completely failed
                console.warn("Complete normalization failure, resetting wavefunction...");
                this.setupInitialWavepacket();
            }
        }
    }
    
    timeStep() {
        // Simple time evolution using potential and kinetic operators
        this.applyPotentialEvolution(this.dt / 2);
        this.applyKineticEvolution(this.dt);
        this.applyPotentialEvolution(this.dt / 2);
        this.applyAbsorber();
    }
    
    applyPotentialEvolution(dt) {
        for (let i = 0; i < this.N; i++) {
            const phase = -this.V[i] * dt;
            
            // Check for valid phase
            if (!isFinite(phase) || isNaN(phase)) {
                console.warn(`Invalid phase at ${i}: ${phase}, skipping evolution`);
                continue;
            }
            
            const cos_phase = Math.cos(phase);
            const sin_phase = Math.sin(phase);
            
            const real = this.psi_real[i];
            const imag = this.psi_imag[i];
            
            this.psi_real[i] = real * cos_phase - imag * sin_phase;
            this.psi_imag[i] = real * sin_phase + imag * cos_phase;
            
            // NaN check after evolution
            if (isNaN(this.psi_real[i]) || isNaN(this.psi_imag[i])) {
                console.warn(`NaN detected after potential evolution at ${i}, setting to zero`);
                this.psi_real[i] = 0;
                this.psi_imag[i] = 0;
            }
        }
    }
    
    applyKineticEvolution(dt) {
        // Simplified kinetic evolution using second derivatives
        const temp_real = new Float32Array(this.N);
        const temp_imag = new Float32Array(this.N);
        
        // Copy boundary conditions
        temp_real[0] = this.psi_real[0];
        temp_imag[0] = this.psi_imag[0];
        temp_real[this.N-1] = this.psi_real[this.N-1];
        temp_imag[this.N-1] = this.psi_imag[this.N-1];
        
        for (let i = 1; i < this.N - 1; i++) {
            // Second derivative approximation with safety checks
            const dx2 = this.dx * this.dx;
            
            if (dx2 < 1e-10) {
                temp_real[i] = this.psi_real[i];
                temp_imag[i] = this.psi_imag[i];
                continue;
            }
            
            const d2_real = (this.psi_real[i+1] - 2*this.psi_real[i] + this.psi_real[i-1]) / dx2;
            const d2_imag = (this.psi_imag[i+1] - 2*this.psi_imag[i] + this.psi_imag[i-1]) / dx2;
            
            // Check for NaN in derivatives
            if (isNaN(d2_real) || isNaN(d2_imag) || !isFinite(d2_real) || !isFinite(d2_imag)) {
                temp_real[i] = this.psi_real[i];
                temp_imag[i] = this.psi_imag[i];
                continue;
            }
            
            // Apply kinetic evolution: -i * (-1/2) * d²/dx² * dt = i/2 * d²/dx² * dt
            temp_real[i] = this.psi_real[i] - 0.5 * dt * d2_imag;
            temp_imag[i] = this.psi_imag[i] + 0.5 * dt * d2_real;
            
            // NaN check after kinetic evolution
            if (isNaN(temp_real[i]) || isNaN(temp_imag[i])) {
                console.warn(`NaN detected after kinetic evolution at ${i}, keeping original value`);
                temp_real[i] = this.psi_real[i];
                temp_imag[i] = this.psi_imag[i];
            }
        }
        
        // Copy back with final NaN check
        for (let i = 0; i < this.N; i++) {
            if (isFinite(temp_real[i]) && isFinite(temp_imag[i])) {
                this.psi_real[i] = temp_real[i];
                this.psi_imag[i] = temp_imag[i];
            }
        }
    }
    
    applyAbsorber() {
        for (let i = 0; i < this.N; i++) {
            if (this.absorber[i] > 0) {
                const factor = Math.exp(-this.absorber[i] * this.dt);
                
                // Check for valid absorption factor
                if (isFinite(factor) && factor > 0 && factor <= 1) {
                    this.psi_real[i] *= factor;
                    this.psi_imag[i] *= factor;
                } else {
                    // If absorption factor is invalid, gradually damp instead
                    this.psi_real[i] *= 0.99;
                    this.psi_imag[i] *= 0.99;
                }
                
                // Final NaN check
                if (isNaN(this.psi_real[i]) || isNaN(this.psi_imag[i])) {
                    this.psi_real[i] = 0;
                    this.psi_imag[i] = 0;
                }
            }
        }
    }
    
    calculateMeasurements() {
        let norm = 0;
        let leftProb = 0;
        let rightProb = 0;
        let packetCenter = 0;
        let totalProb = 0;
        
        // Calculate probabilities with NaN checking
        for (let i = 0; i < this.N; i++) {
            // Check for NaN in wavefunction components
            if (isNaN(this.psi_real[i]) || isNaN(this.psi_imag[i])) {
                console.warn(`NaN detected in wavefunction at ${i}, setting to zero`);
                this.psi_real[i] = 0;
                this.psi_imag[i] = 0;
            }
            
            const prob = this.psi_real[i] * this.psi_real[i] + this.psi_imag[i] * this.psi_imag[i];
            
            // Check for NaN in probability calculation
            if (isNaN(prob) || !isFinite(prob)) {
                console.warn(`Invalid probability at ${i}: ${prob}, setting to zero`);
                continue;
            }
            
            norm += prob;
            totalProb += prob;
            packetCenter += this.x[i] * prob;
            
            // Classify regions more conservatively to avoid edge effects
            if (this.x[i] < -3) {  // Further left for reflection
                leftProb += prob;
            } else if (this.x[i] > 3) {  // Further right for transmission
                rightProb += prob;
            }
        }
        
        norm *= this.dx;
        leftProb *= this.dx;
        rightProb *= this.dx;
        totalProb *= this.dx;
        
        // Handle NaN in integrated values
        if (isNaN(norm) || !isFinite(norm)) {
            console.warn("NaN in norm calculation");
            norm = 1.0;
        }
        
        if (isNaN(leftProb) || !isFinite(leftProb)) {
            console.warn("NaN in leftProb calculation");
            leftProb = 0.0;
        }
        
        if (isNaN(rightProb) || !isFinite(rightProb)) {
            console.warn("NaN in rightProb calculation");
            rightProb = 0.0;
        }
        
        // Calculate packet center with safety check
        if (totalProb > 1e-10) {
            packetCenter = (packetCenter * this.dx) / totalProb;
            if (isNaN(packetCenter) || !isFinite(packetCenter)) {
                packetCenter = this.x0; // Fall back to initial position
            }
        } else {
            packetCenter = this.x0;
        }
        
        // Update measurements with bounds checking
        this.reflection = Math.max(0, Math.min(1, leftProb));
        this.transmission = Math.max(0, Math.min(1, rightProb));
        this.packetCenter = packetCenter;
        this.conservationValue = this.reflection + this.transmission;
        
        // Additional conservation check and correction
        if (this.conservationValue > 1.1) {
            console.warn(`Conservation violation: R+T=${this.conservationValue.toFixed(3)}, normalizing...`);
            const scale = 1.0 / this.conservationValue;
            this.reflection *= scale;
            this.transmission *= scale;
            this.conservationValue = 1.0;
        }
        
        // Final NaN checks
        if (isNaN(this.reflection)) {
            console.warn("NaN in reflection, setting to 0");
            this.reflection = 0;
        }
        if (isNaN(this.transmission)) {
            console.warn("NaN in transmission, setting to 0");  
            this.transmission = 0;
        }
        
        // Debug output for problematic cases
        if (this.currentStep % 100 === 0) {
            console.log(`Step ${this.currentStep}: R=${this.reflection.toFixed(4)}, T=${this.transmission.toFixed(4)}, norm=${norm.toFixed(4)}, center=${packetCenter.toFixed(2)}`);
        }
    }
    
    updateDisplays() {
        // Helper function to safely format numbers
        const safeFormat = (value, decimals = 3) => {
            if (isNaN(value) || !isFinite(value)) {
                return "0.000";
            }
            return value.toFixed(decimals);
        };
        
        const elements = {
            energyValue: safeFormat(this.energy, 1),
            widthValue: safeFormat(this.sigma, 1),
            startPosValue: safeFormat(this.x0, 1),
            potentialHeightValue: safeFormat(this.potentialHeight, 1),
            potentialWidthValue: safeFormat(this.potentialWidth, 1),
            timeStepValue: safeFormat(this.dt, 2),
            energyRegime: this.energyRegime || "E > V₀",
            kLeftValue: safeFormat(this.k, 3),
            kRightValue: this.energyRegime === "E < V₀" ? `i${safeFormat(this.kPrime, 3)}` : safeFormat(this.kPrime, 3),
            theoreticalR: safeFormat(this.theoreticalR, 3),
            theoreticalT: safeFormat(this.theoreticalT, 3),
            reflectionValue: safeFormat(this.reflection, 3),
            transmissionValue: safeFormat(this.transmission, 3),
            conservationValue: safeFormat(this.conservationValue, 3)
        };
        
        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            } else {
                console.warn(`Element ${id} not found`);
            }
        }
        
        // Debug output for theory values
        console.log(`Display update: Theory R=${safeFormat(this.theoreticalR, 3)}, T=${safeFormat(this.theoreticalT, 3)}, Regime=${this.energyRegime}`);
        
        // Color-code conservation to help identify issues
        const conservationElement = document.getElementById('conservationValue');
        if (conservationElement) {
            const conservationVal = parseFloat(this.conservationValue);
            if (Math.abs(conservationVal - 1.0) < 0.05) {
                conservationElement.style.color = '#4caf50'; // Green for good conservation
            } else {
                conservationElement.style.color = '#ff5722'; // Red for poor conservation
            }
        }
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    render() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        if (width === 0 || height === 0) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Calculate scales
        const xScale = width / this.L;
        const xOffset = width / 2;
        const yScale = height * 0.3;
        const waveOffset = height * 0.3;
        const potOffset = height * 0.8;
        
        // Draw potential
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        let maxV = 0;
        for (let i = 0; i < this.N; i++) {
            if (isFinite(this.V[i])) {
                maxV = Math.max(maxV, this.V[i]);
            }
        }
        maxV = Math.max(maxV, 0.1); // Ensure non-zero for scaling
        
        for (let i = 0; i < this.N; i++) {
            const x = this.x[i] * xScale + xOffset;
            const potValue = isFinite(this.V[i]) ? this.V[i] : 0;
            const y = potOffset - (potValue / maxV) * yScale * 0.4;
            
            if (isFinite(x) && isFinite(y)) {
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
        }
        ctx.stroke();
        
        // Draw energy line
        const energyY = potOffset - (this.energy / maxV) * yScale * 0.4;
        ctx.strokeStyle = '#ffeb3b';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, energyY);
        ctx.lineTo(width, energyY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw step divider
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(xOffset, 0);
        ctx.lineTo(xOffset, height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw wavefunction
        ctx.strokeStyle = '#4fc3f7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        let maxProb = 0;
        const probDensity = new Float32Array(this.N);
        for (let i = 0; i < this.N; i++) {
            probDensity[i] = this.psi_real[i] * this.psi_real[i] + this.psi_imag[i] * this.psi_imag[i];
            if (isFinite(probDensity[i])) {
                maxProb = Math.max(maxProb, probDensity[i]);
            } else {
                probDensity[i] = 0; // Replace NaN/Inf with zero
            }
        }
        maxProb = Math.max(maxProb, 0.001); // Ensure non-zero for scaling
        
        for (let i = 0; i < this.N; i++) {
            const x = this.x[i] * xScale + xOffset;
            const y = waveOffset - (probDensity[i] / maxProb) * yScale;
            
            // Safety check for coordinates
            if (isFinite(x) && isFinite(y)) {
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
        }
        ctx.stroke();
        
        // Fill under wavefunction
        ctx.fillStyle = 'rgba(79, 195, 247, 0.3)';
        ctx.beginPath();
        for (let i = 0; i < this.N; i++) {
            const x = this.x[i] * xScale + xOffset;
            const y = waveOffset - (probDensity[i] / maxProb) * yScale;
            
            if (i === 0) {
                ctx.moveTo(x, waveOffset);
                ctx.lineTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.lineTo(width, waveOffset);
        ctx.closePath();
        ctx.fill();
        
        // Draw real parts with different colors
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        
        // Left region
        ctx.strokeStyle = '#81c784';
        ctx.beginPath();
        let leftStarted = false;
        for (let i = 0; i < this.N; i++) {
            if (this.x[i] >= 0) break;
            const x = this.x[i] * xScale + xOffset;
            const realValue = isFinite(this.psi_real[i]) ? this.psi_real[i] : 0;
            const y = waveOffset - (realValue / Math.sqrt(maxProb)) * yScale * 0.5;
            
            if (isFinite(x) && isFinite(y)) {
                if (!leftStarted) {
                    ctx.moveTo(x, y);
                    leftStarted = true;
                } else {
                    ctx.lineTo(x, y);
                }
            }
        }
        ctx.stroke();
        
        // Right region
        ctx.strokeStyle = this.energyRegime === "E < V₀" ? '#f44336' : '#ff9800';
        ctx.beginPath();
        let rightStarted = false;
        for (let i = 0; i < this.N; i++) {
            if (this.x[i] <= 0) continue;
            const x = this.x[i] * xScale + xOffset;
            const realValue = isFinite(this.psi_real[i]) ? this.psi_real[i] : 0;
            const y = waveOffset - (realValue / Math.sqrt(maxProb)) * yScale * 0.5;
            
            if (isFinite(x) && isFinite(y)) {
                if (!rightStarted) {
                    ctx.moveTo(x, y);
                    rightStarted = true;
                } else {
                    ctx.lineTo(x, y);
                }
            }
        }
        ctx.stroke();
        
        ctx.globalAlpha = 1.0;
        
        // Essential numerical labels only
        ctx.fillStyle = 'white';
        ctx.font = '11px Courier New';
        ctx.fillText('V = 0', 20, potOffset - yScale * 0.5);
        ctx.fillText(`V₀ = ${this.potentialHeight.toFixed(1)}`, xOffset + 20, potOffset - yScale * 0.5);
        ctx.fillText(`E = ${this.energy.toFixed(1)}`, width - 80, energyY - 8);
        
        // Basic info only
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '11px Courier New';
        ctx.fillText(`Time: ${this.time.toFixed(1)}`, 10, height - 25);
        ctx.fillText(`${this.energyRegime}`, 10, height - 10);
    }
}

// Initialize the simulation with error handling
try {
    console.log("Starting Quantum Sandbox initialization...");
    const quantumSim = new QuantumSandbox();
    window.quantumSim = quantumSim; // For debugging
    console.log("Quantum Sandbox created successfully!");
} catch (error) {
    console.error("Failed to create Quantum Sandbox:", error);
    // Show error message to user
    const container = document.getElementById('simulation-container');
    if (container) {
        container.innerHTML = `
            <div style="padding: 20px; color: red; font-family: monospace;">
                <h3>Error Loading Quantum Simulation</h3>
                <p>There was an error initializing the quantum mechanics simulation.</p>
                <p>Error: ${error.message}</p>
                <p>Please refresh the page and try again.</p>
            </div>
        `;
    }
}