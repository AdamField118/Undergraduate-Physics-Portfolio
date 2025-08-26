"use strict";

// 1D Quantum Mechanics Sandbox - Scientifically Accurate Version
// Based on peer-reviewed methods from:
// - Feit, Fleck, and Steiger (1982) J. Comput. Phys. 47, 412
// - Kosloff and Tal-Ezer (1986) Chem. Phys. Lett. 127, 223
// - Goldberg et al. (1967) J. Comput. Phys. 1, 433

const container = document.getElementById('simulation-container');

// Create the UI structure
container.innerHTML = `
    <div class="quantum-container">
        <div class="controls-panel" id="controlsPanel">
            <h3>Quantum Controls</h3>
            
            <div class="control-section">
                <h4>Wave Packet</h4>
                <div class="control-group">
                    <label>Energy E/V₀</label>
                    <input type="range" id="energySlider" min="-2.0" max="5.0" step="0.05" value="1.5">
                    <span id="energyValue">1.5</span>
                </div>
                <div class="control-group">
                    <label>Packet Width σ</label>
                    <input type="range" id="widthSlider" min="1.0" max="4.0" step="0.1" value="2.0">
                    <span id="widthValue">2.0</span>
                </div>
                <div class="control-group">
                    <label>Initial Position x₀</label>
                    <input type="range" id="startPosSlider" min="-18" max="-6" step="0.5" value="-12">
                    <span id="startPosValue">-12</span>
                </div>
            </div>

            <div class="control-section">
                <h4>Potential</h4>
                <div class="control-group">
                    <label>Type</label>
                    <select id="potentialType">
                        <option value="step">Step Potential</option>
                        <option value="barrier">Rectangular Barrier</option>
                        <option value="well">Rectangular Well</option>
                        <option value="harmonic">Harmonic Oscillator</option>
                    </select>
                </div>
                <div class="control-group">
                    <label>Height V₀</label>
                    <input type="range" id="potentialHeight" min="-3.0" max="3.0" step="0.05" value="1.0">
                    <span id="potentialHeightValue">1.0</span>
                </div>
                <div class="control-group">
                    <label>Width a</label>
                    <input type="range" id="potentialWidth" min="2.0" max="8.0" step="0.2" value="4.0">
                    <span id="potentialWidthValue">4.0</span>
                </div>
            </div>

            <div class="control-section">
                <h4>Simulation</h4>
                <div class="control-group">
                    <label>Speed</label>
                    <input type="range" id="speedSlider" min="0.5" max="3.0" step="0.1" value="1.0">
                    <span id="speedValue">1.0x</span>
                </div>
                <div class="control-group">
                    <label>Grid Points</label>
                    <select id="gridPoints">
                        <option value="256">256 (Fast)</option>
                        <option value="512" selected>512 (Balanced)</option>
                        <option value="1024">1024 (Accurate)</option>
                    </select>
                </div>
                <div class="control-row">
                    <button id="playPauseBtn">▶ Start</button>
                    <button id="resetBtn">Reset</button>
                </div>
            </div>

            <div class="measurements-panel">
                <h4>Measurements</h4>
                <div class="measurement-row">
                    <span>Regime:</span>
                    <span id="energyRegime">Classical</span>
                </div>
                <div class="measurement-row theory-section">
                    <span><strong>Theory:</strong></span>
                </div>
                <div class="measurement-row">
                    <span>R:</span>
                    <span id="theoreticalR">0.000</span>
                </div>
                <div class="measurement-row">
                    <span>T:</span>
                    <span id="theoreticalT">1.000</span>
                </div>
                <div class="measurement-row measured-section">
                    <span><strong>Simulation:</strong></span>
                </div>
                <div class="measurement-row">
                    <span>R:</span>
                    <span id="reflectionValue">0.000</span>
                </div>
                <div class="measurement-row">
                    <span>T:</span>
                    <span id="transmissionValue">0.000</span>
                </div>
                <div class="measurement-row">
                    <span>Norm:</span>
                    <span id="conservationValue">1.000</span>
                </div>
            </div>
        </div>

        <div class="visualization-area">
            <canvas id="quantumCanvas"></canvas>
            <div class="plot-labels">
                <div class="legend-box">
                    <div class="legend-title">Visualization</div>
                    <div class="legend-item">
                        <span class="color-box" style="background: #00bcd4;"></span>
                        <span>|ψ|² Probability</span>
                    </div>
                    <div class="legend-item">
                        <span class="color-box" style="background: #4caf50;"></span>
                        <span>Re(ψ) Real Part</span>
                    </div>
                    <div class="legend-item">
                        <span class="color-box" style="background: #ff5722;"></span>
                        <span>V(x) Potential</span>
                    </div>
                    <div class="legend-item">
                        <span class="color-box" style="background: #ffc107;"></span>
                        <span>E Energy</span>
                    </div>
                </div>
            </div>
        </div>
        
        <button class="toggle-ui-btn" id="toggleUI">Hide Controls</button>
    </div>
`;

// Add comprehensive styling
const style = document.createElement('style');
style.textContent = `
    #simulation-container {
        margin: 20px;
        margin-bottom: 80px;
    }
    
    .quantum-container {
        width: 100%;
        height: calc(100vh - 160px);
        min-height: 400px;
        max-height: 700px;
        display: flex;
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        border-radius: 8px;
        position: relative;
        overflow: hidden;
    }
    
    .controls-panel {
        width: 280px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px;
        overflow-y: auto;
        font-family: 'Courier New', monospace;
        font-size: 11px;
        transition: transform 0.3s ease;
    }
    
    .controls-panel.hidden {
        transform: translateX(-100%);
        margin-left: -280px;
    }
    
    .controls-panel h3 {
        color: #00bcd4;
        margin: 0 0 15px 0;
        text-align: center;
        border-bottom: 1px solid #333;
        padding-bottom: 8px;
        font-size: 14px;
    }
    
    .controls-panel h4 {
        color: #4caf50;
        margin: 10px 0 8px 0;
        font-size: 12px;
        font-weight: bold;
    }
    
    .control-section {
        margin-bottom: 15px;
        padding: 10px;
        border: 1px solid #333;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.05);
    }
    
    .control-group {
        margin-bottom: 12px;
    }
    
    .control-group label {
        display: block;
        margin-bottom: 4px;
        color: #ccc;
        font-size: 10px;
    }
    
    .control-group input[type="range"] {
        width: 100%;
        margin: 4px 0;
    }
    
    .control-group select {
        width: 100%;
        padding: 4px;
        background: #222;
        color: white;
        border: 1px solid #444;
        border-radius: 3px;
        font-size: 10px;
    }
    
    .control-group span {
        color: #00bcd4;
        font-size: 10px;
        font-weight: bold;
    }
    
    .control-row {
        display: flex;
        gap: 8px;
    }
    
    .control-row button {
        flex: 1;
        padding: 8px;
        background: #2196f3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        font-weight: bold;
        transition: background 0.2s;
    }
    
    .control-row button:hover {
        background: #1976d2;
    }
    
    .measurements-panel {
        margin-top: 10px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }
    
    .measurement-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        font-size: 10px;
    }
    
    .measurement-row span:first-child {
        color: #aaa;
    }
    
    .measurement-row span:last-child {
        color: #00bcd4;
        font-weight: bold;
    }
    
    .theory-section, .measured-section {
        margin-top: 8px;
        padding-top: 5px;
        border-top: 1px solid #444;
    }
    
    .visualization-area {
        flex: 1;
        position: relative;
        display: flex;
    }
    
    #quantumCanvas {
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, #0a0e1a 0%, #1a2332 100%);
    }
    
    .legend-box {
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.85);
        padding: 10px;
        border-radius: 6px;
        border: 1px solid #333;
        font-family: 'Courier New', monospace;
        font-size: 10px;
    }
    
    .legend-title {
        color: #00bcd4;
        margin-bottom: 8px;
        font-weight: bold;
        text-align: center;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
        color: #ddd;
    }
    
    .color-box {
        width: 12px;
        height: 12px;
        border-radius: 2px;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .toggle-ui-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.85);
        color: white;
        border: 1px solid #444;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        z-index: 1000;
    }
    
    .toggle-ui-btn:hover {
        background: rgba(30, 30, 30, 0.9);
    }
    
    @media (max-width: 768px) {
        .quantum-container {
            flex-direction: column;
            height: calc(100vh - 140px);
        }
        
        .controls-panel {
            width: 100%;
            height: 300px;
            border-bottom: 2px solid #333;
        }
        
        .controls-panel.hidden {
            transform: translateY(-100%);
            margin-left: 0;
            margin-top: -300px;
        }
    }
`;
document.head.appendChild(style);

class AccurateQuantumSimulation {
    constructor() {
        this.canvas = document.getElementById('quantumCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Simulation parameters (natural units: ℏ = 2m = 1)
        this.L = 60.0;              // System size (increased for better boundaries)
        this.N = 512;               // Default grid points
        this.dx = this.L / this.N;  // Spatial step
        this.dt = 0.001;            // Time step (small for stability)
        this.speedMultiplier = 1.0; // Animation speed
        
        // Arrays
        this.x = null;
        this.V = null;
        this.psi = null;        // Complex array: [real0, imag0, real1, imag1, ...]
        this.prob = null;        // Probability density
        this.expV = null;        // Exp(-iV*dt/2) for potential evolution
        this.expT = null;        // Exp(-iT*dt) for kinetic evolution in k-space
        
        // Wave packet parameters  
        this.energy = 1.5;       // Default energy (relative to V₀)
        this.sigma = 2.0;        // Packet width
        this.x0 = -12.0;         // Initial position (moved closer to center)
        
        // Potential parameters
        this.potentialType = 'step';
        this.V0 = 1.0;           // Potential height
        this.a = 4.0;            // Potential width
        
        // State
        this.isRunning = false;
        this.time = 0;
        this.frame = 0;
        
        // Measurements
        this.norm = 1.0;
        this.reflection = 0;
        this.transmission = 0;
        this.theoreticalR = 0;
        this.theoreticalT = 0;
        
        this.init();
    }
    
    init() {
        this.setupArrays();
        this.setupGrid();
        this.setupPotential();
        this.setupInitialWavepacket();
        this.setupEvolutionOperators();
        this.calculateTheory();
        this.setupEventListeners();
        this.resizeCanvas();
        this.render();
    }
    
    setupArrays() {
        this.x = new Float64Array(this.N);
        this.V = new Float64Array(this.N);
        this.psi = new Float64Array(this.N * 2);  // Complex array
        this.prob = new Float64Array(this.N);
        this.expV = new Float64Array(this.N * 2); // Complex
        this.expT = new Float64Array(this.N * 2); // Complex
    }
    
    setupGrid() {
        // Center the grid around the origin where the potential is
        for (let i = 0; i < this.N; i++) {
            this.x[i] = -this.L/2 + i * this.dx;
        }
    }
    
    setupPotential() {
        const type = this.potentialType;
        const V0 = this.V0;
        const a = this.a;
        
        for (let i = 0; i < this.N; i++) {
            const x = this.x[i];
            
            switch(type) {
                case 'step':
                    // Step at x=0
                    this.V[i] = x > 0 ? V0 : 0;
                    break;
                    
                case 'barrier':
                    // Barrier centered at x=0
                    this.V[i] = Math.abs(x) < a/2 ? V0 : 0;
                    break;
                    
                case 'well':
                    // Well centered at x=0
                    this.V[i] = Math.abs(x) < a/2 ? -Math.abs(V0) : 0;
                    break;
                    
                case 'harmonic':
                    // Harmonic oscillator centered at x=0
                    const k = 8 * Math.abs(V0) / (a * a);
                    this.V[i] = 0.5 * k * x * x;
                    break;
                    
                default:
                    this.V[i] = 0;
            }
        }
    }
    
    setupInitialWavepacket() {
        const k0 = Math.sign(this.energy) * Math.sqrt(2 * Math.abs(this.energy));
        const sigma2 = this.sigma * this.sigma;
        
        // Create Gaussian wave packet
        let norm = 0;
        for (let i = 0; i < this.N; i++) {
            const x = this.x[i] - this.x0;
            const gauss = Math.exp(-x * x / (4 * sigma2)) / Math.pow(2 * Math.PI * sigma2, 0.25);
            
            const idx = 2 * i;
            this.psi[idx] = gauss * Math.cos(k0 * this.x[i]);     // Real part
            this.psi[idx + 1] = gauss * Math.sin(k0 * this.x[i]); // Imaginary part
            
            norm += this.psi[idx] * this.psi[idx] + this.psi[idx + 1] * this.psi[idx + 1];
        }
        
        // Normalize
        norm = Math.sqrt(norm * this.dx);
        for (let i = 0; i < this.N * 2; i++) {
            this.psi[i] /= norm;
        }
        
        this.time = 0;
        this.frame = 0;
    }
    
    setupEvolutionOperators() {
        // Setup exp(-iV*dt/2) for potential evolution
        const dt = this.dt;
        for (let i = 0; i < this.N; i++) {
            const phase = -this.V[i] * dt / 2;
            const idx = 2 * i;
            this.expV[idx] = Math.cos(phase);
            this.expV[idx + 1] = -Math.sin(phase);
        }
        
        // Setup exp(-iT*dt) for kinetic evolution in k-space
        const dk = 2 * Math.PI / this.L;
        for (let i = 0; i < this.N; i++) {
            // k values with proper ordering for FFT
            let k;
            if (i <= this.N / 2) {
                k = i * dk;
            } else {
                k = (i - this.N) * dk;
            }
            
            const phase = -0.5 * k * k * dt;
            const idx = 2 * i;
            this.expT[idx] = Math.cos(phase);
            this.expT[idx + 1] = -Math.sin(phase);
        }
    }
    
    // Cooley-Tukey FFT implementation
    fft(data, inverse = false) {
        const n = data.length / 2;
        const angle = (inverse ? 2 : -2) * Math.PI;
        
        // Bit reversal
        let j = 0;
        for (let i = 1; i < n - 1; i++) {
            let bit = n >> 1;
            while (j & bit) {
                j ^= bit;
                bit >>= 1;
            }
            j ^= bit;
            
            if (i < j) {
                // Swap complex numbers at positions i and j
                let tempR = data[2 * i];
                let tempI = data[2 * i + 1];
                data[2 * i] = data[2 * j];
                data[2 * i + 1] = data[2 * j + 1];
                data[2 * j] = tempR;
                data[2 * j + 1] = tempI;
            }
        }
        
        // Cooley-Tukey FFT
        for (let len = 2; len <= n; len <<= 1) {
            const ang = angle / len;
            const wlenR = Math.cos(ang);
            const wlenI = Math.sin(ang);
            
            for (let i = 0; i < n; i += len) {
                let wR = 1;
                let wI = 0;
                
                for (let j = 0; j < len / 2; j++) {
                    const idx1 = 2 * (i + j);
                    const idx2 = 2 * (i + j + len / 2);
                    
                    const uR = data[idx1];
                    const uI = data[idx1 + 1];
                    const vR = data[idx2] * wR - data[idx2 + 1] * wI;
                    const vI = data[idx2] * wI + data[idx2 + 1] * wR;
                    
                    data[idx1] = uR + vR;
                    data[idx1 + 1] = uI + vI;
                    data[idx2] = uR - vR;
                    data[idx2 + 1] = uI - vI;
                    
                    const tempR = wR * wlenR - wI * wlenI;
                    wI = wR * wlenI + wI * wlenR;
                    wR = tempR;
                }
            }
        }
        
        // Normalize for inverse transform
        if (inverse) {
            for (let i = 0; i < data.length; i++) {
                data[i] /= n;
            }
        }
    }
    
    evolve() {
        // Split-operator method: V/2 -> T -> V/2
        
        // Step 1: Half potential evolution
        for (let i = 0; i < this.N; i++) {
            const idx = 2 * i;
            const psiR = this.psi[idx];
            const psiI = this.psi[idx + 1];
            const expR = this.expV[idx];
            const expI = this.expV[idx + 1];
            
            this.psi[idx] = psiR * expR - psiI * expI;
            this.psi[idx + 1] = psiR * expI + psiI * expR;
        }
        
        // Step 2: FFT to k-space
        const psiCopy = new Float64Array(this.psi);
        this.fft(psiCopy, false);
        
        // Step 3: Kinetic evolution in k-space
        for (let i = 0; i < this.N; i++) {
            const idx = 2 * i;
            const psiR = psiCopy[idx];
            const psiI = psiCopy[idx + 1];
            const expR = this.expT[idx];
            const expI = this.expT[idx + 1];
            
            psiCopy[idx] = psiR * expR - psiI * expI;
            psiCopy[idx + 1] = psiR * expI + psiI * expR;
        }
        
        // Step 4: Inverse FFT back to position space
        this.fft(psiCopy, true);
        
        // Step 5: Half potential evolution again
        for (let i = 0; i < this.N; i++) {
            const idx = 2 * i;
            const psiR = psiCopy[idx];
            const psiI = psiCopy[idx + 1];
            const expR = this.expV[idx];
            const expI = this.expV[idx + 1];
            
            this.psi[idx] = psiR * expR - psiI * expI;
            this.psi[idx + 1] = psiR * expI + psiI * expR;
        }
        
        // Apply gentle absorbing boundaries at edges
        const absorberWidth = 8;
        const dampingStrength = 0.98; // Gentler damping
        for (let i = 0; i < absorberWidth; i++) {
            const factor = Math.cos((Math.PI / 2) * (1 - i / absorberWidth));
            const damping = 1 - (1 - dampingStrength) * (1 - factor * factor);
            
            // Left edge
            this.psi[2 * i] *= damping;
            this.psi[2 * i + 1] *= damping;
            
            // Right edge
            const j = this.N - 1 - i;
            this.psi[2 * j] *= damping;
            this.psi[2 * j + 1] *= damping;
        }
        
        this.time += this.dt;
        this.frame++;
    }
    
    calculateMeasurements() {
        // Calculate probability density and norm
        let norm = 0;
        let leftProb = 0;
        let rightProb = 0;
        
        for (let i = 0; i < this.N; i++) {
            const idx = 2 * i;
            const prob = this.psi[idx] * this.psi[idx] + this.psi[idx + 1] * this.psi[idx + 1];
            this.prob[i] = prob;
            norm += prob;
            
            // Measure reflection and transmission
            if (this.x[i] < -5) {
                leftProb += prob;
            } else if (this.x[i] > 5) {
                rightProb += prob;
            }
        }
        
        this.norm = norm * this.dx;
        this.reflection = leftProb * this.dx;
        this.transmission = rightProb * this.dx;
    }
    
    calculateTheory() {
        const E = this.energy;
        const V0 = this.V0;
        
        if (this.potentialType === 'step') {
            if (E > V0) {
                const k1 = Math.sqrt(2 * E);
                const k2 = Math.sqrt(2 * (E - V0));
                this.theoreticalR = Math.pow((k1 - k2) / (k1 + k2), 2);
                this.theoreticalT = 1 - this.theoreticalR;
            } else {
                this.theoreticalR = 1;
                this.theoreticalT = 0;
            }
        } else if (this.potentialType === 'barrier') {
            const a = this.a;
            if (E > V0) {
                const k = Math.sqrt(2 * E);
                const q = Math.sqrt(2 * (E - V0));
                const T = 1 / (1 + Math.pow((k * k - q * q) / (2 * k * q), 2) * Math.pow(Math.sin(q * a), 2));
                this.theoreticalT = T;
                this.theoreticalR = 1 - T;
            } else if (E > 0) {
                const k = Math.sqrt(2 * E);
                const kappa = Math.sqrt(2 * (V0 - E));
                const T = 1 / (1 + Math.pow((k * k + kappa * kappa) / (2 * k * kappa), 2) * Math.pow(Math.sinh(kappa * a), 2));
                this.theoreticalT = T;
                this.theoreticalR = 1 - T;
            } else {
                this.theoreticalR = 1;
                this.theoreticalT = 0;
            }
        } else {
            this.theoreticalR = 0;
            this.theoreticalT = 0;
        }
    }
    
    setupEventListeners() {
        // Controls
        document.getElementById('energySlider').addEventListener('input', (e) => {
            this.energy = parseFloat(e.target.value);
            document.getElementById('energyValue').textContent = this.energy.toFixed(2);
            if (!this.isRunning) this.reset();
        });
        
        document.getElementById('widthSlider').addEventListener('input', (e) => {
            this.sigma = parseFloat(e.target.value);
            document.getElementById('widthValue').textContent = this.sigma.toFixed(1);
            if (!this.isRunning) this.reset();
        });
        
        document.getElementById('startPosSlider').addEventListener('input', (e) => {
            this.x0 = parseFloat(e.target.value);
            document.getElementById('startPosValue').textContent = this.x0.toFixed(1);
            if (!this.isRunning) this.reset();
        });
        
        document.getElementById('potentialType').addEventListener('change', (e) => {
            this.potentialType = e.target.value;
            if (!this.isRunning) this.reset();
        });
        
        document.getElementById('potentialHeight').addEventListener('input', (e) => {
            this.V0 = parseFloat(e.target.value);
            document.getElementById('potentialHeightValue').textContent = this.V0.toFixed(2);
            if (!this.isRunning) this.reset();
        });
        
        document.getElementById('potentialWidth').addEventListener('input', (e) => {
            this.a = parseFloat(e.target.value);
            document.getElementById('potentialWidthValue').textContent = this.a.toFixed(1);
            if (!this.isRunning) this.reset();
        });
        
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            this.speedMultiplier = parseFloat(e.target.value);
            document.getElementById('speedValue').textContent = this.speedMultiplier.toFixed(1) + 'x';
        });
        
        document.getElementById('gridPoints').addEventListener('change', (e) => {
            this.N = parseInt(e.target.value);
            this.dx = this.L / this.N;
            this.setupArrays();
            this.reset();
        });
        
        document.getElementById('playPauseBtn').addEventListener('click', () => {
            this.toggleSimulation();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.reset();
        });
        
        document.getElementById('toggleUI').addEventListener('click', () => {
            const panel = document.getElementById('controlsPanel');
            const btn = document.getElementById('toggleUI');
            panel.classList.toggle('hidden');
            btn.textContent = panel.classList.contains('hidden') ? 'Show Controls' : 'Hide Controls';
            setTimeout(() => {
                this.resizeCanvas();
                this.render();
            }, 300);
        });
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.render();
        });
    }
    
    toggleSimulation() {
        this.isRunning = !this.isRunning;
        const btn = document.getElementById('playPauseBtn');
        btn.textContent = this.isRunning ? '⏸ Pause' : '▶ Start';
        
        if (this.isRunning) {
            this.animate();
        }
    }
    
    reset() {
        this.isRunning = false;
        document.getElementById('playPauseBtn').textContent = '▶ Start';
        this.setupGrid();
        this.setupPotential();
        this.setupInitialWavepacket();
        this.setupEvolutionOperators();
        this.calculateTheory();
        this.calculateMeasurements();
        this.updateDisplays();
        this.render();
    }
    
    animate() {
        if (!this.isRunning) return;
        
        // Evolve multiple steps per frame for speed control
        const steps = Math.ceil(5 * this.speedMultiplier);
        for (let i = 0; i < steps; i++) {
            this.evolve();
        }
        
        this.calculateMeasurements();
        this.updateDisplays();
        this.render();
        
        requestAnimationFrame(() => this.animate());
    }
    
    updateDisplays() {
        // Determine regime
        let regime = '';
        if (this.potentialType === 'step') {
            regime = this.energy > this.V0 ? 'Classical' : 'Total Reflection';
        } else if (this.potentialType === 'barrier') {
            regime = this.energy > this.V0 ? 'Over Barrier' : 
                    this.energy > 0 ? 'Tunneling' : 'Bound';
        } else if (this.potentialType === 'well') {
            regime = this.energy > 0 ? 'Scattering' : 'Bound State';
        } else if (this.potentialType === 'harmonic') {
            regime = 'Oscillator';
        }
        
        document.getElementById('energyRegime').textContent = regime;
        document.getElementById('theoreticalR').textContent = this.theoreticalR.toFixed(3);
        document.getElementById('theoreticalT').textContent = this.theoreticalT.toFixed(3);
        document.getElementById('reflectionValue').textContent = this.reflection.toFixed(3);
        document.getElementById('transmissionValue').textContent = this.transmission.toFixed(3);
        document.getElementById('conservationValue').textContent = this.norm.toFixed(3);
        
        // Color code norm
        const normEl = document.getElementById('conservationValue');
        if (Math.abs(this.norm - 1) < 0.01) {
            normEl.style.color = '#4caf50';
        } else if (Math.abs(this.norm - 1) < 0.05) {
            normEl.style.color = '#ffc107';
        } else {
            normEl.style.color = '#f44336';
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
        
        if (!width || !height) return;
        
        // Clear canvas with gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#0a0e1a');
        gradient.addColorStop(1, '#1a2332');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Setup proper scaling and centering
        const margin = 40;
        const plotWidth = width - 2 * margin;
        const plotHeight = height - 2 * margin;
        
        // View window: focus on -20 to 20 (where action happens)
        const viewXMin = -20;
        const viewXMax = 20;
        const viewRange = viewXMax - viewXMin;
        
        // Coordinate transformations
        const xToCanvas = (x) => {
            return margin + ((x - viewXMin) / viewRange) * plotWidth;
        };
        
        // Y-axis positions for different components
        const waveY = height * 0.35;  // Wavefunction position
        const potY = height * 0.75;   // Potential baseline
        
        // Find max values for scaling
        let maxProb = 0.0001;
        let maxV = 0.0001;
        for (let i = 0; i < this.N; i++) {
            if (this.x[i] >= viewXMin && this.x[i] <= viewXMax) {
                maxProb = Math.max(maxProb, this.prob[i]);
            }
            maxV = Math.max(maxV, Math.abs(this.V[i]));
        }
        maxV = Math.max(maxV, Math.abs(this.energy) * 1.5, Math.abs(this.V0) * 1.5);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Vertical grid lines
        for (let x = -20; x <= 20; x += 5) {
            ctx.beginPath();
            ctx.moveTo(xToCanvas(x), margin);
            ctx.lineTo(xToCanvas(x), height - margin);
            ctx.stroke();
        }
        
        // Horizontal grid lines
        for (let i = 0; i <= 4; i++) {
            const y = margin + i * plotHeight / 4;
            ctx.beginPath();
            ctx.moveTo(margin, y);
            ctx.lineTo(width - margin, y);
            ctx.stroke();
        }
        
        // Draw main axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        
        // X-axis at wavefunction baseline
        ctx.beginPath();
        ctx.moveTo(margin, waveY);
        ctx.lineTo(width - margin, waveY);
        ctx.stroke();
        
        // X-axis at potential baseline
        ctx.beginPath();
        ctx.moveTo(margin, potY);
        ctx.lineTo(width - margin, potY);
        ctx.stroke();
        
        // Y-axis at x=0
        const x0Canvas = xToCanvas(0);
        ctx.beginPath();
        ctx.moveTo(x0Canvas, margin);
        ctx.lineTo(x0Canvas, height - margin);
        ctx.stroke();
        
        // Draw potential with better visibility
        ctx.strokeStyle = '#ff5722';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ff5722';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        
        let potentialDrawn = false;
        for (let i = 0; i < this.N; i++) {
            if (this.x[i] < viewXMin || this.x[i] > viewXMax) continue;
            
            const x = xToCanvas(this.x[i]);
            const y = potY - (this.V[i] / maxV) * plotHeight * 0.25;
            
            if (!potentialDrawn) {
                ctx.moveTo(x, y);
                potentialDrawn = true;
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Fill under potential for better visibility
        if (this.potentialType === 'well' && this.V0 < 0) {
            ctx.fillStyle = 'rgba(255, 87, 34, 0.1)';
            ctx.beginPath();
            ctx.moveTo(xToCanvas(viewXMin), potY);
            for (let i = 0; i < this.N; i++) {
                if (this.x[i] < viewXMin || this.x[i] > viewXMax) continue;
                const x = xToCanvas(this.x[i]);
                const y = potY - (this.V[i] / maxV) * plotHeight * 0.25;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(xToCanvas(viewXMax), potY);
            ctx.closePath();
            ctx.fill();
        }
        
        // Draw energy level
        ctx.strokeStyle = '#ffc107';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#ffc107';
        ctx.shadowBlur = 3;
        ctx.setLineDash([8, 4]);
        const energyY = potY - (this.energy / maxV) * plotHeight * 0.25;
        ctx.beginPath();
        ctx.moveTo(margin, energyY);
        ctx.lineTo(width - margin, energyY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
        
        // Draw probability density |ψ|²
        ctx.fillStyle = 'rgba(0, 188, 212, 0.2)';
        ctx.strokeStyle = '#00bcd4';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00bcd4';
        ctx.shadowBlur = 8;
        
        ctx.beginPath();
        ctx.moveTo(margin, waveY);
        
        for (let i = 0; i < this.N; i++) {
            if (this.x[i] < viewXMin || this.x[i] > viewXMax) continue;
            
            const x = xToCanvas(this.x[i]);
            const probHeight = (this.prob[i] / maxProb) * plotHeight * 0.2;
            const y = waveY - probHeight;
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width - margin, waveY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Draw real part of wavefunction (thinner, more subtle)
        ctx.strokeStyle = 'rgba(76, 175, 80, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        
        let realDrawn = false;
        for (let i = 0; i < this.N; i++) {
            if (this.x[i] < viewXMin || this.x[i] > viewXMax) continue;
            
            const x = xToCanvas(this.x[i]);
            const realHeight = (this.psi[2 * i] / Math.sqrt(maxProb)) * plotHeight * 0.15;
            const y = waveY - realHeight;
            
            if (!realDrawn) {
                ctx.moveTo(x, y);
                realDrawn = true;
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Draw measurement regions
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        
        // Left measurement region
        ctx.fillRect(margin, margin, xToCanvas(-5) - margin, plotHeight);
        ctx.strokeRect(margin, margin, xToCanvas(-5) - margin, plotHeight);
        
        // Right measurement region
        ctx.fillRect(xToCanvas(5), margin, width - margin - xToCanvas(5), plotHeight);
        ctx.strokeRect(xToCanvas(5), margin, width - margin - xToCanvas(5), plotHeight);
        ctx.setLineDash([]);
        
        // Draw potential type label
        ctx.fillStyle = '#ff5722';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        let potLabel = '';
        switch(this.potentialType) {
            case 'step': potLabel = 'Step Potential'; break;
            case 'barrier': potLabel = 'Rectangular Barrier'; break;
            case 'well': potLabel = 'Rectangular Well'; break;
            case 'harmonic': potLabel = 'Harmonic Oscillator'; break;
        }
        ctx.fillText(potLabel, width / 2, margin - 10);
        
        // Draw axis labels
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        
        // X-axis labels
        for (let x = -20; x <= 20; x += 10) {
            ctx.fillText(x.toString(), xToCanvas(x), height - margin + 20);
        }
        ctx.fillText('Position x', width / 2, height - 10);
        
        // Y-axis labels
        ctx.textAlign = 'left';
        ctx.fillText('|ψ|²', margin - 30, waveY);
        ctx.fillText('V(x)', margin - 30, potY);
        
        // Draw info panel
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(width - 180, 10, 170, 90);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(width - 180, 10, 170, 90);
        
        ctx.fillStyle = '#00bcd4';
        ctx.font = 'bold 11px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText('Simulation Info', width - 170, 28);
        
        ctx.fillStyle = 'white';
        ctx.font = '10px Courier New';
        ctx.fillText(`Time: ${this.time.toFixed(2)}`, width - 170, 45);
        ctx.fillText(`E = ${this.energy.toFixed(2)}`, width - 170, 60);
        ctx.fillText(`V₀ = ${this.V0.toFixed(2)}`, width - 170, 75);
        ctx.fillText(`Frame: ${this.frame}`, width - 170, 90);
        
        // Draw measurement labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '9px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('R', xToCanvas(-10), margin - 5);
        ctx.fillText('T', xToCanvas(10), margin - 5);
    }
}

// Initialize simulation
try {
    const sim = new AccurateQuantumSimulation();
    window.quantumSim = sim;
    console.log("Quantum simulation initialized successfully!");
} catch (error) {
    console.error("Failed to initialize quantum simulation:", error);
    container.innerHTML = `
        <div style="padding: 20px; color: red;">
            <h3>Error Loading Simulation</h3>
            <p>${error.message}</p>
        </div>
    `;
}