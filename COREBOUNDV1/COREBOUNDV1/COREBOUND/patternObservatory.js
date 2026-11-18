/**
 * ==========================================================================
 * COREBOUND — PATTERN OBSERVATORY 3D GAMEPLAY WORLD (LIGHT THEME)
 * Stylized Human Hero Avatar, Stable 3rd-Person Camera & 15 Aptitude Missions
 * ==========================================================================
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GuardianCharacter } from './src/GuardianCharacter.js';
import { CelestialHorse } from './src/CelestialHorse.js';

// ==========================================================================
// 1. 15 IN-WORLD APTITUDE MISSIONS CONFIGURATION (3 STAGES PER SYSTEM)
// ==========================================================================
const OBSERVATORY_SYSTEMS_CONFIG = {
    lens: {
        id: "lens",
        name: "Celestial Pattern Lens",
        systemNum: "SYSTEM-01",
        tag: "SYSTEM 01 // EAST WING",
        guardianId: "nova",
        color: "#d97706",
        symbol: "🔭",
        pedestalPos: { x: 30, y: 1.6, z: 0 },
        camPos: { x: 38, y: 14, z: 12 },
        camTarget: { x: 30, y: 5, z: 0 },
        stages: [
            {
                stageNum: 1,
                title: "Lens Base Calibration",
                skill: "Arithmetic Progression (AP)",
                question: "Optical base sequence is missing a value. Rule: Each term increases by +5. Find the next value:",
                series: "4,  9,  14,  19,  [ ? ]",
                options: ["21", "23", "24", "26"],
                correctIndex: 2, // 24
                guardianSpeech: "खिलाड़ी... Lens के बेस को स्थिर करने के लिए नंबर पैटर्न (+5) पहचानो और लुप्त संख्या चुनो!",
                beaconPos: { x: 26.5, y: 2.1, z: -2.5 }
            },
            {
                stageNum: 2,
                title: "Crystal Ring Gear Alignment",
                skill: "Geometric Progression (GP)",
                question: "Gear rotation ratio follows a geometric progression (×2). Find the missing tooth frequency:",
                series: "3,  6,  12,  24,  [ ? ]",
                options: ["36", "48", "52", "64"],
                correctIndex: 1, // 48
                guardianSpeech: "रिंग्स का गियर अनुपात ज्यामितीय (×2) है। 24 के बाद आने वाली सही आवृत्ति को चुनो!",
                beaconPos: { x: 26.5, y: 2.1, z: 2.5 }
            },
            {
                stageNum: 3,
                title: "Optical Axis Prism Focus",
                skill: "Alternating Pattern Recognition",
                question: "Starlight wavelength oscillates with a dual rule (×3, then -2). Find the final focus frequency:",
                series: "2,  6,  4,  12,  10,  [ ? ]",
                options: ["20", "28", "30", "32"],
                correctIndex: 2, // 30
                guardianSpeech: "अंतिम फोकस! पैटर्न देखो: ×3, फिर -2, फिर ×3, फिर -2! 10 के बाद का सही मान बताओ!",
                beaconPos: { x: 34.0, y: 2.1, z: 0.0 }
            }
        ]
    },
    flux: {
        id: "flux",
        name: "Resonance Flux Chamber",
        systemNum: "SYSTEM-02",
        tag: "SYSTEM 02 // NORTH WING",
        guardianId: "byte",
        color: "#00b4d8",
        symbol: "⚡",
        pedestalPos: { x: 0, y: 1.6, z: -30 },
        camPos: { x: 0, y: 15, z: -42 },
        camTarget: { x: 0, y: 5, z: -30 },
        stages: [
            {
                stageNum: 1,
                title: "Pylon Energy Division",
                skill: "Direct Ratio Division",
                question: "Divide 100 MW of power between Pylons A & B in the ratio 3 : 2. What is the power for Pylon A?",
                series: "Ratio A : B = 3 : 2  |  Total = 100 MW",
                options: ["40 MW", "50 MW", "60 MW", "70 MW"],
                correctIndex: 2, // 60 MW
                guardianSpeech: "डायग्नोस्टिक अलर्ट: 100 MW ऊर्जा को 3:2 के अनुपात में बाँटना है। Pylon A का मान निकालो।",
                beaconPos: { x: -2.5, y: 2.1, z: -26.5 }
            },
            {
                stageNum: 2,
                title: "Compound Phase Ratio",
                skill: "Compound Ratio Formulation",
                question: "Flux ratio A:B is 2:3 and B:C is 3:5. What is the simplified combined flux ratio A : C?",
                series: "A : B = 2 : 3  and  B : C = 3 : 5",
                options: ["2 : 5", "3 : 5", "5 : 2", "6 : 15"],
                correctIndex: 0, // 2 : 5
                guardianSpeech: "फेज़ अनुपात मिलाओ: A:B = 2:3 और B:C = 3:5। A:C का संयुक्त अनुपात निर्धारित करो।",
                beaconPos: { x: 2.5, y: 2.1, z: -26.5 }
            },
            {
                stageNum: 3,
                title: "Quantum Core Equilibrium",
                skill: "Proportional Equilibrium",
                question: "If 4 pylons stabilize 120 THz, how much flux frequency can 6 synchronized pylons stabilize?",
                series: "4 Pylons = 120 THz  ➔  6 Pylons = [ ? ]",
                options: ["150 THz", "160 THz", "180 THz", "200 THz"],
                correctIndex: 2, // 180 THz
                guardianSpeech: "कोर स्थिरीकरण! 4 पाइलन्स = 120 THz। 6 पाइलन्स के लिए कुल स्थिर आवृत्ति की गणना करो!",
                beaconPos: { x: 0.0, y: 2.1, z: -34.0 }
            }
        ]
    },
    prism: {
        id: "prism",
        name: "Harmonic Prism Matrix",
        systemNum: "SYSTEM-03",
        tag: "SYSTEM 03 // WEST WING",
        guardianId: "echo",
        color: "#7c3aed",
        symbol: "💎",
        pedestalPos: { x: -30, y: 1.6, z: 0 },
        camPos: { x: -38, y: 14, z: 12 },
        camTarget: { x: -30, y: 5, z: 0 },
        stages: [
            {
                stageNum: 1,
                title: "Wavelength Deductive Logic",
                skill: "Syllogistic Logical Deduction",
                question: "All Active Prisms emit Harmonic Waves. Some Harmonic Waves are Violet. Does at least one Active Prism emit Violet?",
                series: "Premise 1: All Prisms ➔ Harmonic  |  Premise 2: Some Harmonic ➔ Violet",
                options: ["Definitely True", "Definitely False", "Cannot be Determined", "None"],
                correctIndex: 2, // Cannot be Determined
                guardianSpeech: "लॉजिकल डिडक्शन सुनो: सभी प्रिज़्म अनुनादी हैं, कुछ अनुनादी किरणें बैंगनी हैं। क्या निश्चित निष्कर्ष निकाला जा सकता है?",
                beaconPos: { x: -26.5, y: 2.1, z: -2.5 }
            },
            {
                stageNum: 2,
                title: "Corrupted Node Elimination",
                skill: "Logical Elimination Rules",
                question: "Node X is NOT 450nm. Node Y is either 450nm or 550nm. If Node Y is NOT 450nm, what is Node Y's wavelength?",
                series: "Conditions: Y ∈ {450nm, 550nm}  and  Y ≠ 450nm",
                options: ["450nm", "500nm", "550nm", "600nm"],
                correctIndex: 2, // 550nm
                guardianSpeech: "भ्रष्ट नोड्स को हटाओ! यदि Y केवल 450 या 550 हो सकता है और 450 नहीं है, तो Y का सही मान चुनो!",
                beaconPos: { x: -26.5, y: 2.1, z: 2.5 }
            },
            {
                stageNum: 3,
                title: "Seven-Color Spectrum Ordering",
                skill: "Relational Sequence Ordering",
                question: "Visible light frequencies: Red < Green < Blue < Violet. Which spectral color carries the HIGHEST frequency?",
                series: "Spectrum: [ Red (Low) ➔ Green ➔ Blue ➔ Violet (High) ]",
                options: ["Red", "Green", "Blue", "Violet"],
                correctIndex: 3, // Violet
                guardianSpeech: "सात रंगों का प्रकाश फूटने वाला है! सबसे उच्चतम आवृत्ति (Highest Frequency) वाला वर्ण चुनो!",
                beaconPos: { x: -34.0, y: 2.1, z: 0.0 }
            }
        ]
    },
    cubes: {
        id: "cubes",
        name: "Chrono Memory Cubes",
        systemNum: "SYSTEM-04",
        tag: "SYSTEM 04 // SOUTH WING",
        guardianId: "blaze",
        color: "#059669",
        symbol: "📦",
        pedestalPos: { x: 0, y: 1.6, z: 30 },
        camPos: { x: 0, y: 15, z: 42 },
        camTarget: { x: 0, y: 5, z: 30 },
        stages: [
            {
                stageNum: 1,
                title: "Simple Arithmetic Mean",
                skill: "Arithmetic Mean (Average)",
                question: "Calculate the uniform mean data flux across the 3 cubes: (120 TB + 150 TB + 210 TB) ÷ 3 = ?",
                series: "(120 + 150 + 210) ÷ 3 = [ ? ]",
                options: ["150 TB", "160 TB", "170 TB", "180 TB"],
                correctIndex: 1, // 160 TB
                guardianSpeech: "मेमोरी क्यूब्स का संतुलन! 120, 150 और 210 का औसत मान निकालो!",
                beaconPos: { x: -2.5, y: 2.1, z: 26.5 }
            },
            {
                stageNum: 2,
                title: "Weighted Archive Mean",
                skill: "Weighted Average Formula",
                question: "Cube A holds 2 units of 100 TB and Cube B holds 3 units of 150 TB. Find the weighted average flux: [2(100) + 3(150)] ÷ 5 = ?",
                series: "Weighted Mean = (200 + 450) ÷ 5 = [ ? ]",
                options: ["120 TB", "125 TB", "130 TB", "135 TB"],
                correctIndex: 2, // 130 TB
                guardianSpeech: "वेटेड एवरेज निकालो! 2 इकाइयां 100 TB की और 3 इकाइयां 150 TB की। कुल औसत क्या होगा?",
                beaconPos: { x: 2.5, y: 2.1, z: 26.5 }
            },
            {
                stageNum: 3,
                title: "Data Transfer Rate Average",
                skill: "Average Speed & Rate",
                question: "Data transfers at 100 MB/s for 2 seconds, then 200 MB/s for 2 seconds. What is the overall average transfer rate?",
                series: "Total Distance / Total Time = (200 + 400) ÷ 4 = [ ? ]",
                options: ["130 MB/s", "140 MB/s", "150 MB/s", "160 MB/s"],
                correctIndex: 2, // 150 MB/s
                guardianSpeech: "डेटा ट्रांसफर स्पीड! पहले 2 सेकंड 100 MB/s, अगले 2 सेकंड 200 MB/s। औसत स्पीड बताओ!",
                beaconPos: { x: 0.0, y: 2.1, z: 34.0 }
            }
        ]
    },
    core: {
        id: "core",
        name: "Central Prediction Engine",
        systemNum: "CORE-00",
        tag: "SINGULARITY CORE // GRAND ROTUNDA",
        guardianId: "nova",
        color: "#0284c7",
        symbol: "🌌",
        pedestalPos: { x: 0, y: 1.6, z: 0 },
        camPos: { x: 0, y: 16, z: 28 },
        camTarget: { x: 0, y: 7, z: 0 },
        stages: [
            {
                stageNum: 1,
                title: "Ring 1 Multi-Step Series",
                skill: "Multi-Operation Number Series",
                question: "Prediction series follows the rule (×2 + 1). Find the next synchronization sequence number:",
                series: "2,  5,  11,  23,  [ ? ]",
                options: ["45", "46", "47", "49"],
                correctIndex: 2, // 47
                guardianSpeech: "कोर की पहली रिंग अनलॉक करो! नियम: संख्या को दोगुना करो और 1 जोड़ो (×2 + 1)!",
                beaconPos: { x: -4.8, y: 2.1, z: -2.2 }
            },
            {
                stageNum: 2,
                title: "Conduit Energy Synthesis",
                skill: "Ratio & Average Synthesis",
                question: "Average of 3 conduits is 50 MW (Sum = 150 MW). Their ratio is 2 : 3 : 5. What is the power of the LARGEST conduit?",
                series: "Sum = 150 MW  |  Ratio = 2 : 3 : 5  ➔  Largest (5/10) = [ ? ]",
                options: ["60 MW", "70 MW", "75 MW", "80 MW"],
                correctIndex: 2, // 75 MW
                guardianSpeech: "रिंग्स 2 और 3 को अनलॉक करो! कुल 150 MW को 2:3:5 में विभाजित करो और सबसे बड़ा मान चुनो!",
                beaconPos: { x: 4.8, y: 2.1, z: 2.2 }
            },
            {
                stageNum: 3,
                title: "Master Singularity Ignition",
                skill: "System of Linear Deductions",
                question: "If A + B = 100, B + C = 150, and A + C = 110. Find the total awakened energy sum (A + B + C):",
                series: "2(A + B + C) = 100 + 150 + 110 = 360  ➔  A + B + C = [ ? ]",
                options: ["170", "180", "190", "200"],
                correctIndex: 1, // 180
                guardianSpeech: "अंतिम प्रज्वलन! तीनों समीकरणों को जोड़कर सिंगुलैरिटी कोर को हमेशा के लिए पुनर्जीवित करो!",
                beaconPos: { x: 0.0, y: 2.1, z: -5.0 }
            }
        ]
    }
};

const GUARDIAN_PROFILES = {
    nova: { name: "NOVA", title: "Starward Sentinel", color: "#d97706", avatar: "assets/images/characters/nova_avatar.png" },
    byte: { name: "BYTE", title: "Code Architect", color: "#0284c7", avatar: "assets/images/characters/byte_avatar.png" },
    echo: { name: "ECHO", title: "Resonance Weaver", color: "#7c3aed", avatar: "assets/images/characters/echo_avatar.png" },
    blaze: { name: "BLAZE", title: "Kinetic Vanguard", color: "#dc2626", avatar: "assets/images/characters/blaze_avatar.png" }
};

// ==========================================================================
// 2. AUDIO SYNTHESIS ENGINE (WEB AUDIO API)
// ==========================================================================
class SoundSynth {
    constructor() {
        this.ctx = null;
        this._lastHoofTime = 0;
        this._lastTrotTime = 0;
        this._ambientNode = null;
        this._windNode = null;
    }
    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // --- UTILITY: Create a noise buffer for percussive sounds ---
    _createNoiseBuffer(duration = 0.1) {
        const sr = this.ctx.sampleRate;
        const len = sr * duration;
        const buf = this.ctx.createBuffer(1, len, sr);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) {
            data[i] = (Math.random() * 2 - 1);
        }
        return buf;
    }

    // ========================
    // PLAYER MOVEMENT SOUNDS
    // ========================
    playFootstep() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140 + Math.random() * 40, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }
    playJump() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.18);
    }

    // ========================
    // HORSE GALLOP HOOFBEATS
    // ========================
    playHoofbeat() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        if (now - this._lastHoofTime < 0.12) return; // Rate-limit
        this._lastHoofTime = now;

        // Impact thud (low percussive)
        const noiseBuf = this._createNoiseBuffer(0.06);
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuf;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(800 + Math.random() * 400, now);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.18, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(now);

        // Tonal click (stone surface impact)
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(180 + Math.random() * 60, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.04);
        oscGain.gain.setValueAtTime(0.06, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
    }

    // 4-beat gallop pattern: clip-clop-clip-clop
    playGallopBeat() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        // Schedule 4 hoof strikes in a single gallop stride
        [0, 0.08, 0.22, 0.30].forEach((delay, i) => {
            const t = now + delay;
            const noiseBuf = this._createNoiseBuffer(0.05);
            const noise = this.ctx.createBufferSource();
            noise.buffer = noiseBuf;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(600 + (i % 2) * 500, t);
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(i < 2 ? 0.14 : 0.18, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start(t);
        });
    }

    // ========================
    // HORSE TROT BEATS
    // ========================
    playTrotBeat() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        if (now - this._lastTrotTime < 0.25) return;
        this._lastTrotTime = now;

        // Lighter 2-beat diagonal trot
        [0, 0.14].forEach((delay, i) => {
            const t = now + delay;
            const noiseBuf = this._createNoiseBuffer(0.04);
            const noise = this.ctx.createBufferSource();
            noise.buffer = noiseBuf;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(900 + i * 300, t);
            filter.Q.setValueAtTime(2, t);
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.10, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start(t);
        });
    }

    // ========================
    // HORSE WHINNY / NEIGH
    // ========================
    playHorseWhinny() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Rising glissando whistle (simulates horse neigh)
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(350, now);
        osc1.frequency.linearRampToValueAtTime(1200, now + 0.25);
        osc1.frequency.linearRampToValueAtTime(800, now + 0.45);
        osc1.frequency.linearRampToValueAtTime(400, now + 0.7);
        gain1.gain.setValueAtTime(0.0, now);
        gain1.gain.linearRampToValueAtTime(0.08, now + 0.05);
        gain1.gain.setValueAtTime(0.08, now + 0.35);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        const filter1 = this.ctx.createBiquadFilter();
        filter1.type = 'bandpass';
        filter1.frequency.setValueAtTime(1000, now);
        filter1.Q.setValueAtTime(3, now);
        osc1.connect(filter1);
        filter1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.72);

        // Breathy noise layer
        const noiseBuf = this._createNoiseBuffer(0.5);
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuf;
        const nFilter = this.ctx.createBiquadFilter();
        nFilter.type = 'bandpass';
        nFilter.frequency.setValueAtTime(1200, now);
        nFilter.Q.setValueAtTime(4, now);
        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.04, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        noise.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(this.ctx.destination);
        noise.start(now);
    }

    // ========================
    // HALT / SKID SOUND
    // ========================
    playHaltSkid() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Scraping stone skid
        const noiseBuf = this._createNoiseBuffer(0.3);
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuf;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1500, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 0.25);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);

        // Heavy thud
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, now + 0.05);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.2);
        oscGain.gain.setValueAtTime(0.15, now + 0.05);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(now + 0.05);
        osc.stop(now + 0.25);
    }

    // ========================
    // DISMOUNT LANDING THUD
    // ========================
    playDismountLand() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Heavy boots-on-stone impact
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 0.12);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);

        // Noise crunch overlay
        const noiseBuf = this._createNoiseBuffer(0.08);
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuf;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.10, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(this.ctx.destination);
        noise.start(now);
    }

    // ========================
    // HORSE DISSOLVE SPARKLE
    // ========================
    playDissolveSparkle() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Cascading ascending shimmer tones
        const freqs = [1200, 1600, 2100, 2800, 3400];
        freqs.forEach((freq, i) => {
            const t = now + i * 0.12;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.linearRampToValueAtTime(freq * 1.5, t + 0.3);
            gain.gain.setValueAtTime(0.04, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.42);
        });

        // Glittery noise sweep
        const noiseBuf = this._createNoiseBuffer(0.8);
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuf;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(4000, now);
        filter.frequency.linearRampToValueAtTime(8000, now + 0.6);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
    }

    // ========================
    // GATE ENTRY FANFARE
    // ========================
    playGateFanfare() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Brass-like triumphant notes (G4, B4, D5, G5)
        const notes = [392.00, 493.88, 587.33, 783.99];
        notes.forEach((freq, i) => {
            const t = now + i * 0.15;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, t);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(freq * 3, t);
            filter.frequency.exponentialRampToValueAtTime(freq * 0.8, t + 0.5);

            gain.gain.setValueAtTime(0.0, t);
            gain.gain.linearRampToValueAtTime(0.07, t + 0.03);
            gain.gain.setValueAtTime(0.07, t + 0.25);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.58);
        });
    }

    // ========================
    // CINEMATIC WIND WHOOSH
    // ========================
    playWindWhoosh() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const noiseBuf = this._createNoiseBuffer(1.2);
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuf;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.linearRampToValueAtTime(1200, now + 0.4);
        filter.frequency.linearRampToValueAtTime(300, now + 1.0);
        filter.Q.setValueAtTime(1.5, now);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.0, now);
        gain.gain.linearRampToValueAtTime(0.10, now + 0.2);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
    }

    // ========================
    // PUZZLE CORRECT / SUCCESS
    // ========================
    playPuzzleCorrect() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Ascending major triad + octave (C5, E5, G5, C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const t = now + idx * 0.10;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.10, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.42);
        });
    }

    // ========================
    // PUZZLE WRONG / ERROR
    // ========================
    playPuzzleWrong() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Dissonant descending minor 2nd buzz
        [310, 290].forEach((freq, i) => {
            const t = now + i * 0.12;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.06, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, t);
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.22);
        });
    }

    // ========================
    // BEACON PROXIMITY HUM
    // ========================
    playBeaconHum() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(520, now + 0.2);
        osc.frequency.linearRampToValueAtTime(440, now + 0.4);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.48);
    }

    // ========================
    // UI CLICK / SELECT
    // ========================
    playUIClick() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
    }

    // ========================
    // SANCTUARY ENTRY CHIME (Original chime — kept for compatibility)
    // ========================
    playChime() {
        if (!this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.35);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + idx * 0.08);
            osc.stop(this.ctx.currentTime + idx * 0.08 + 0.35);
        });
    }

    // ========================
    // AMBIENT WIND LOOP (Start/Stop)
    // ========================
    startAmbientWind() {
        if (!this.ctx || this._windNode) return;
        const noiseBuf = this._createNoiseBuffer(4.0);
        this._windNode = this.ctx.createBufferSource();
        this._windNode.buffer = noiseBuf;
        this._windNode.loop = true;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, this.ctx.currentTime);
        this._windGain = this.ctx.createGain();
        this._windGain.gain.setValueAtTime(0.025, this.ctx.currentTime);
        this._windNode.connect(filter);
        filter.connect(this._windGain);
        this._windGain.connect(this.ctx.destination);
        this._windNode.start();
    }
    stopAmbientWind() {
        if (this._windNode) {
            try { this._windNode.stop(); } catch (e) { /* ignore */ }
            this._windNode = null;
        }
    }
}

// ==========================================================================
// 3. ULTRA-REALISTIC 3D CELESTIAL GUARDIAN CHARACTER (MODULAR IMPORT)
// ==========================================================================
// Replaced by import { GuardianCharacter } from './src/GuardianCharacter.js'

// ==========================================================================
// 4. MAIN 3D APPLICATION CONTROLLER & STABLE SPRING-ARM CAMERA
// ==========================================================================
class PatternObservatoryApp {
    constructor() {
        this.container = document.getElementById('webgl-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.clock = new THREE.Clock();

        // 15-Missions State: Each system has [stage1: bool, stage2: bool, stage3: bool]
        this.systemProgress = {
            lens: [false, false, false],
            flux: [false, false, false],
            prism: [false, false, false],
            cubes: [false, false, false],
            core: [false, false, false]
        };

        this.selectedSystemId = 'lens';
        this.activeSolvingMission = null;
        this.selectedOptionIndex = null;
        this.activeProximityBeacon = null;

        this.interactiveNodes = [];
        this.beaconMeshes = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Arrival Cinematic Cutscene State
        this.isCutsceneActive = true;
        this.cutsceneTime = 0;
        this.cutsceneDuration = 7.0;
        this.celestialHorse = null;

        // Player & Movement Physics
        this.player = null;
        this.soundSynth = new SoundSynth();
        this.cameraMode = 'player'; // 'player' (3rd person) or 'orbit' (free inspect)
        this.playerPos = new THREE.Vector3(0, 2.05, 82);
        this.playerRotY = Math.PI; // Initial orientation: facing towards Central Prediction Engine (-Z)
        this.playerVelocityY = 0;
        this.isGrounded = true;

        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            sprint: false,
            jump: false
        };
        this.joystickDelta = { x: 0, y: 0 };

        // --- STABLE ROCK-SOLID THIRD-PERSON CAMERA VECTORS ---
        this.camDistance = 10.5;
        this.camHeight = 4.2;
        this.camYaw = 0;
        this.camPitch = 0.28;
        this.targetCamYaw = 0;
        this.targetCamPitch = 0.28;
        this.cameraLookTarget = new THREE.Vector3(0, 2.2, 82);
        this.cameraCurrentPos = new THREE.Vector3(7.5, 5.5, 92);

        this.isDraggingMouse = false;
        this.prevMousePos = { x: 0, y: 0 };

        // Camera Transition State
        this.isTransitioningCam = false;
        this.camStartPos = new THREE.Vector3();
        this.camEndPos = new THREE.Vector3();
        this.camStartTarget = new THREE.Vector3();
        this.camEndTarget = new THREE.Vector3();
        this.camProgress = 0;
        this.camDuration = 1.2;

        // Auto Tour
        this.isTourMode = false;
        this.tourAngle = 0;

        // 3D Visual Mesh Groups
        this.meshGroups = {
            lens: { group: null, mount: null, barrel: null, ring: null, lenses: [], brassMat: null, brokenMat: null, laserBeam: null },
            flux: { group: null, pylons: [], fluxCore: null, crystalMat: null, brokenCrystalMat: null, fluxRing: null },
            prism: { group: null, prisms: [], prismGlassMat: null, brokenMat: null, laserRays: [] },
            cubes: { group: null, cubes: [] },
            core: { group: null, rings: [], crystal: null, lightBeam: null }
        };

        this.animatables = {
            runicRings: [],
            floatingCubes: [],
            clouds: [],
            stardustParticles: null
        };

        // Audio
        this.bgAudio = document.getElementById('bgAudio');
        this.isMuted = false;

        this.init();
    }

    init() {
        this.setupRendererAndScene();
        this.setupLighting();
        this.buildAtmosphereAndMountains();
        this.buildSummitTerrace();
        this.buildArrivalRoad();
        this.buildEntranceGateway();
        this.buildLensSystem();
        this.buildFluxSystem();
        this.buildPrismSystem();
        this.buildMemoryCubesSystem();
        this.buildCoreSystem();
        this.build15WaypointBeacons();
        this.buildGuardianAltars();
        this.buildStardustParticles();

        // Spawn 3D Celestial Horse Mount
        this.celestialHorse = new CelestialHorse(this.scene);
        this.celestialHorse.setPosition(0, 0.4, 82, 0);

        // Spawn 3D Guardian Character matching guardian.png
        this.player = new GuardianCharacter(this.scene, {
            showNameplate: true,
            nameplateText: 'GUARDIAN'
        });
        this.player.group.position.copy(this.playerPos);
        this.player.group.rotation.y = this.playerRotY;

        this.setupEventListeners();
        this.setupVirtualJoystick();
        this.setupUI();
        this.setupRadarMinimap();

        this.startArrivalCutscene();

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    // ==========================================================================
    // 2. SCENE SETUP, PBR LIGHTING & REALISTIC GREEN NATURE ENVIRONMENT
    // ==========================================================================
    setupRendererAndScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x38bdf8);
        this.scene.fog = new THREE.FogExp2(0x93c5fd, 0.0055);

        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 800);
        this.camera.position.set(0, 16, 26);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.container,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.18;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
        this.controls.minDistance = 3.5;
        this.controls.maxDistance = 180;
        this.controls.target.set(0, 2, 0);
        this.controls.enabled = false;
    }

    setupLighting() {
        // Warm Radiant Sun Directional Light
        const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.5);
        sunLight.position.set(50, 85, 45);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 280;
        sunLight.shadow.camera.left = -65;
        sunLight.shadow.camera.right = 65;
        sunLight.shadow.camera.top = 65;
        sunLight.shadow.camera.bottom = -65;
        sunLight.shadow.bias = -0.0003;
        this.scene.add(sunLight);

        // Hemisphere Sky Light (Sky Blue + Rich Green Earth Bounce)
        const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x166534, 1.15);
        hemiLight.position.set(0, 60, 0);
        this.scene.add(hemiLight);

        // Ambient Fill
        const ambLight = new THREE.AmbientLight(0xffffff, 0.45);
        this.scene.add(ambLight);

        // Central Core Point Glow
        const coreLight = new THREE.PointLight(0x0284c7, 2.8, 45);
        coreLight.position.set(0, 8, 0);
        this.scene.add(coreLight);
    }

    buildAtmosphereAndMountains() {
        // Lush Forest Green Hills & Alpine Mountain Ranges
        const hillGrassMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85 });
        const deepForestMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.9 });
        const cliffRockMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.95 });
        const snowPeakMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });

        // 20 Layered Rolling Green Hills & Mountains in the Valley
        for (let i = 0; i < 22; i++) {
            const angle = (i / 22) * Math.PI * 2 + (Math.random() * 0.1);
            const dist = 110 + Math.random() * 90;
            const height = 45 + Math.random() * 45;
            const radius = 28 + Math.random() * 20;

            const mountainGroup = new THREE.Group();
            mountainGroup.position.set(Math.cos(angle) * dist, -height * 0.38 - 8, Math.sin(angle) * dist);

            // Green Slopes
            const mGeo = new THREE.ConeGeometry(radius, height, 7);
            const mMat = i % 3 === 0 ? deepForestMat : (i % 3 === 1 ? hillGrassMat : cliffRockMat);
            const peak = new THREE.Mesh(mGeo, mMat);
            peak.rotation.y = Math.random() * Math.PI;
            peak.castShadow = true;
            mountainGroup.add(peak);

            // Distant Snow-capped Alpine Ridge on the tallest peaks
            if (height > 65) {
                const snowCap = new THREE.Mesh(new THREE.ConeGeometry(radius * 0.32, height * 0.32, 7), snowPeakMat);
                snowCap.position.y = height * 0.34;
                snowCap.rotation.y = peak.rotation.y;
                mountainGroup.add(snowCap);
            }

            this.scene.add(mountainGroup);
        }

        // 6 Floating Mossy Celestial Mini-Islands Hovering in Horizon
        for (let i = 0; i < 6; i++) {
            const islandGroup = new THREE.Group();
            const angle = (i / 6) * Math.PI * 2 + 0.3;
            const dist = 75 + (i % 2) * 25;
            const islandY = -12 + (i % 3) * 6;
            islandGroup.position.set(Math.cos(angle) * dist, islandY, Math.sin(angle) * dist);

            const isGeo = new THREE.ConeGeometry(8 + (i % 3) * 3, 10, 8);
            const isMesh = new THREE.Mesh(isGeo, cliffRockMat);
            isMesh.rotation.x = Math.PI;
            islandGroup.add(isMesh);

            const grassTop = new THREE.Mesh(new THREE.CylinderGeometry(8 + (i % 3) * 3, 8 + (i % 3) * 3, 0.8, 8), hillGrassMat);
            grassTop.position.y = 5.2;
            islandGroup.add(grassTop);

            // Add 1-2 small pine trees on floating islands
            const miniTree = this.createPineTree(5.0, 1.4);
            miniTree.position.set(1.5, 5.6, 0);
            islandGroup.add(miniTree);

            this.scene.add(islandGroup);
        }

        // Fluffy Drifting Cumulus Clouds
        const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.78, roughness: 1.0 });
        for (let i = 0; i < 22; i++) {
            const cloudGroup = new THREE.Group();
            const angle = (i / 22) * Math.PI * 2;
            const dist = 75 + Math.random() * 55;
            cloudGroup.position.set(Math.cos(angle) * dist, -18 + Math.random() * 12, Math.sin(angle) * dist);

            for (let j = 0; j < 5; j++) {
                const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(8 + Math.random() * 6, 1), cloudMat);
                puff.position.set((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 18);
                cloudGroup.add(puff);
            }
            this.scene.add(cloudGroup);
            this.animatables.clouds.push(cloudGroup);
        }
    }

    createLushGardenCanvasTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // 1. Rich Organic Grass Base (Multi-Tone Emerald Lawn)
        ctx.fillStyle = '#15803d';
        ctx.fillRect(0, 0, 1024, 1024);

        // Realistic Grass Blades, Moss & Dirt Variation Noise
        for (let i = 0; i < 30000; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const shades = ['#166534', '#14532d', '#22c55e', '#16a34a', '#4ade80', '#047857', '#15803d', '#3f6212', '#2e1065'];
            ctx.fillStyle = shades[Math.floor(Math.random() * shades.length)];
            ctx.fillRect(x, y, 2 + Math.random() * 3.5, 2 + Math.random() * 3.5);
        }

        // 2. Natural Flagstone / Cobblestone Pathways Connecting 4 Wings
        ctx.save();
        ctx.fillStyle = '#475569';
        // Central circle plaza
        ctx.beginPath();
        ctx.arc(512, 512, 130, 0, Math.PI * 2);
        ctx.fill();

        // 4 Straight Paths to East, North, West, South Wings
        ctx.fillRect(512 - 40, 0, 80, 1024);
        ctx.fillRect(0, 512 - 40, 1024, 80);

        // Circular connecting rings
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 44;
        ctx.beginPath();
        ctx.arc(512, 512, 280, 0, Math.PI * 2);
        ctx.stroke();

        ctx.lineWidth = 32;
        ctx.beginPath();
        ctx.arc(512, 512, 420, 0, Math.PI * 2);
        ctx.stroke();

        // Flagstone paver seams & cracks
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 600; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = 30 + Math.random() * 470;
            const px = 512 + Math.cos(angle) * r;
            const py = 512 + Math.sin(angle) * r;
            ctx.beginPath();
            ctx.arc(px, py, 6 + Math.random() * 12, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Gold Inlay Runic Compass Lines
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(512, 512, 280, 0, Math.PI * 2);
        ctx.arc(512, 512, 130, 0, Math.PI * 2);
        ctx.stroke();

        // Wildflower & Clover Speckles on Grass
        for (let i = 0; i < 500; i++) {
            const fx = Math.random() * 1024;
            const fy = Math.random() * 1024;
            const d = Math.hypot(fx - 512, fy - 512);
            if (d > 140 && (Math.abs(fx - 512) > 45 && Math.abs(fy - 512) > 45)) {
                const flowerColors = ['#fbbf24', '#f472b6', '#a78bfa', '#ffffff', '#38bdf8', '#f87171'];
                ctx.fillStyle = flowerColors[Math.floor(Math.random() * flowerColors.length)];
                ctx.beginPath();
                ctx.arc(fx, fy, 2.5 + Math.random() * 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    createPineTree(height = 6.5, radius = 1.8) {
        const treeGroup = new THREE.Group();
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
        const pineMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.8 });
        const pineMat2 = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });

        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.38, height * 0.4, 8), trunkMat);
        trunk.position.y = height * 0.2;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        const tiers = 4;
        for (let i = 0; i < tiers; i++) {
            const tRadius = radius * (1 - i * 0.18);
            const tHeight = (height * 0.75) / tiers;
            const cone = new THREE.Mesh(new THREE.ConeGeometry(tRadius, tHeight * 1.5, 7), i % 2 === 0 ? pineMat : pineMat2);
            cone.position.y = height * 0.35 + i * (tHeight * 0.8);
            cone.castShadow = true;
            treeGroup.add(cone);
        }
        return treeGroup;
    }

    createBroadleafTree(height = 7.5, crownRadius = 3.0, leafColor = 0x15803d) {
        const treeGroup = new THREE.Group();
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3b1d0c, roughness: 0.9 });
        const leafMat = new THREE.MeshStandardMaterial({ color: leafColor, roughness: 0.85 });
        const leafMatLight = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8 });

        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.48, height * 0.45, 8), trunkMat);
        trunk.position.y = height * 0.225;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        const puffs = [
            { x: 0, y: height * 0.65, z: 0, r: crownRadius * 0.85, mat: leafMat },
            { x: -crownRadius * 0.35, y: height * 0.55, z: crownRadius * 0.2, r: crownRadius * 0.6, mat: leafMatLight },
            { x: crownRadius * 0.35, y: height * 0.58, z: -crownRadius * 0.2, r: crownRadius * 0.65, mat: leafMat },
            { x: 0, y: height * 0.82, z: 0, r: crownRadius * 0.55, mat: leafMatLight }
        ];

        puffs.forEach(p => {
            const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(p.r, 1), p.mat);
            mesh.position.set(p.x, p.y, p.z);
            mesh.castShadow = true;
            treeGroup.add(mesh);
        });

        return treeGroup;
    }

    createBush(radius = 1.2, color = 0x16a34a) {
        const bush = new THREE.Mesh(
            new THREE.DodecahedronGeometry(radius, 1),
            new THREE.MeshStandardMaterial({ color, roughness: 0.9 })
        );
        bush.position.y = radius * 0.65;
        bush.scale.set(1.2, 0.85, 1.2);
        bush.castShadow = true;
        return bush;
    }

    createFlowerPatch(radius = 1.5, flowerCount = 8) {
        const patch = new THREE.Group();
        const colors = [0xfacc15, 0xf472b6, 0xa855f7, 0x38bdf8, 0xffffff];
        for (let i = 0; i < flowerCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * radius;
            const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.02, 0.45, 4),
                new THREE.MeshBasicMaterial({ color: 0x166534 })
            );
            stem.position.set(Math.cos(angle) * r, 0.22, Math.sin(angle) * r);
            patch.add(stem);

            const bloom = new THREE.Mesh(
                new THREE.SphereGeometry(0.09, 6, 6),
                new THREE.MeshBasicMaterial({ color: colors[Math.floor(Math.random() * colors.length)] })
            );
            bloom.position.set(Math.cos(angle) * r, 0.45, Math.sin(angle) * r);
            patch.add(bloom);
        }
        return patch;
    }

    buildSummitTerrace() {
        const gardenTex = this.createLushGardenCanvasTexture();
        const gardenMat = new THREE.MeshStandardMaterial({ map: gardenTex, roughness: 0.75, metalness: 0.05 });
        const cliffSideMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.95 });
        const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 });
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 });
        const cyanRuneMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x0284c7, emissiveIntensity: 0.6, roughness: 0.2 });

        // 1. Lush Green Floating Sanctuary Island Base (Expanded Grand Sanctuary)
        const plazaBase = new THREE.Mesh(new THREE.CylinderGeometry(48, 52, 3.5, 64), gardenMat);
        plazaBase.position.y = -1.75;
        plazaBase.receiveShadow = true;
        this.scene.add(plazaBase);

        // Island Cliff Underside
        const cliffUnder = new THREE.Mesh(new THREE.ConeGeometry(52, 24, 32), cliffSideMat);
        cliffUnder.position.y = -15.5;
        cliffUnder.rotation.x = Math.PI;
        this.scene.add(cliffUnder);

        // Gold & Stone Perimeter Garden Border
        const rimMesh = new THREE.Mesh(new THREE.TorusGeometry(48.5, 0.6, 16, 64), goldTrimMat);
        rimMesh.rotation.x = Math.PI / 2;
        rimMesh.position.y = 0.1;
        rimMesh.castShadow = true;
        this.scene.add(rimMesh);

        // 2. Perimeter Garden Balusters with Gold Finials
        const postCount = 40;
        for (let i = 0; i < postCount; i++) {
            const angle = (i / postCount) * Math.PI * 2;
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 1.4, 12), stoneMat);
            post.position.set(Math.cos(angle) * 48, 0.7, Math.sin(angle) * 48);
            post.castShadow = true;
            this.scene.add(post);

            const postCap = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), goldTrimMat);
            postCap.position.set(Math.cos(angle) * 48, 1.4, Math.sin(angle) * 48);
            this.scene.add(postCap);
        }

        // 3. 3D Trees & Lush Flora Placed on the Island
        // 20 Pine/Cypress Trees along the perimeter
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2 + 0.15;
            // Leave openings for the 4 bridges
            const isNearBridge = [0, Math.PI / 2, Math.PI, Math.PI * 1.5].some(bAngle => Math.abs(angle - bAngle) < 0.28);
            if (!isNearBridge) {
                const pine = this.createPineTree(5.5 + (i % 3) * 1.2, 1.6 + (i % 2) * 0.4);
                pine.position.set(Math.cos(angle) * 45.0, 0.0, Math.sin(angle) * 45.0);
                this.scene.add(pine);
            }
        }

        // 8 Grand Broadleaf & Flowering Blossom Trees in the 4 garden quadrants
        [
            { angle: Math.PI / 4, color: 0x15803d },
            { angle: Math.PI / 4 + 0.25, color: 0xec4899 }, // Pink Sakura Blossom
            { angle: 3 * Math.PI / 4, color: 0x166534 },
            { angle: 3 * Math.PI / 4 + 0.25, color: 0xec4899 },
            { angle: 5 * Math.PI / 4, color: 0x15803d },
            { angle: 5 * Math.PI / 4 + 0.25, color: 0x22c55e },
            { angle: 7 * Math.PI / 4, color: 0x166534 },
            { angle: 7 * Math.PI / 4 + 0.25, color: 0xec4899 }
        ].forEach((t, idx) => {
            const tree = this.createBroadleafTree(7.5 + (idx % 2), 3.0, t.color);
            tree.position.set(Math.cos(t.angle) * 28, 0.0, Math.sin(t.angle) * 28);
            this.scene.add(tree);
        });

        // 24 Bush & Shrub Clusters along walkways
        for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2 + 0.1;
            const dist = 15 + (i % 3) * 8;
            const bush = this.createBush(0.9 + (i % 3) * 0.3, i % 2 === 0 ? 0x16a34a : 0x15803d);
            bush.position.set(Math.cos(angle) * dist, 0.0, Math.sin(angle) * dist);
            this.scene.add(bush);

            // Add flower patch next to some bushes
            if (i % 2 === 0) {
                const flowers = this.createFlowerPatch(1.4, 7);
                flowers.position.set(Math.cos(angle) * dist + 1.2, 0.0, Math.sin(angle) * dist + 1.0);
                this.scene.add(flowers);
            }
        }

        // 4. Concentric Glowing Runic Rings on Lawn
        [14, 26, 38].forEach((r, i) => {
            const ringMesh = new THREE.Mesh(new THREE.RingGeometry(r - 0.25, r + 0.25, 64), cyanRuneMat);
            ringMesh.rotation.x = -Math.PI / 2;
            ringMesh.position.y = 0.05 + i * 0.01;
            ringMesh.receiveShadow = true;
            this.scene.add(ringMesh);
            this.animatables.runicRings.push({ mesh: ringMesh, speed: (i % 2 === 0 ? 1 : -1) * (0.12 / (i + 1)) });
        });

        // 5. 4 Grand Bridges & Expanded Calibration Pedestals (Radius 11.8m Deck)
        const wingConfigs = [
            { x: 30, z: 0, rotY: Math.PI / 2, openAngle: Math.PI },        // East (Lens) -> entrance at West (PI)
            { x: 0, z: -30, rotY: 0, openAngle: Math.PI / 2 },             // North (Flux) -> entrance at South (PI/2)
            { x: -30, z: 0, rotY: Math.PI / 2, openAngle: 0 },             // West (Prism) -> entrance at East (0)
            { x: 0, z: 30, rotY: 0, openAngle: -Math.PI / 2 }              // South (Cubes) -> entrance at North (-PI/2)
        ];

        wingConfigs.forEach(b => {
            const bridge = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.6, 26), stoneMat);
            bridge.position.set(b.x, 0.1, b.z);
            bridge.rotation.y = b.rotY;
            bridge.receiveShadow = true;
            bridge.castShadow = true;
            this.scene.add(bridge);

            const lineMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 26), cyanRuneMat);
            lineMesh.position.set(b.x, 0.45, b.z);
            lineMesh.rotation.y = b.rotY;
            this.scene.add(lineMesh);

            // Grand Expanded Pedestal (11.8m Top Radius, 12.8m Base Radius)
            const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(11.8, 12.8, 1.6, 48), stoneMat);
            pedestal.position.set(b.x, 0.8, b.z);
            pedestal.receiveShadow = true;
            this.scene.add(pedestal);

            // CUT THE CIRCULAR RIM WHERE STAIRS ENTER (Open C-shape Torus Arc):
            // Leaves a wide, clean 6.5m doorway opening for the 6.0m stairs landing
            const gapAngle = 0.54; // ~31 degrees opening (6.48m arc length)
            const sweepAngle = Math.PI * 2 - gapAngle;
            const startAngle = b.openAngle + gapAngle / 2;

            const pRim = new THREE.Mesh(new THREE.TorusGeometry(12.0, 0.35, 16, 48, sweepAngle), goldTrimMat);
            pRim.rotation.x = Math.PI / 2;
            pRim.rotation.z = startAngle;
            pRim.position.set(b.x, 1.6, b.z);
            this.scene.add(pRim);

            // Gold portal finials at the cut ends of the rim
            const leftEndAngle = b.openAngle - gapAngle / 2;
            const rightEndAngle = b.openAngle + gapAngle / 2;
            [leftEndAngle, rightEndAngle].forEach(fa => {
                const finial = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 12), goldTrimMat);
                finial.position.set(b.x + Math.cos(fa) * 12.0, 1.6, b.z + Math.sin(fa) * 12.0);
                this.scene.add(finial);

                const post = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.40, 1.4, 12), stoneMat);
                post.position.set(b.x + Math.cos(fa) * 12.0, 0.9, b.z + Math.sin(fa) * 12.0);
                this.scene.add(post);
            });

            // Perimeter Balusters around the remaining circumference (strictly avoiding the staircase opening)
            const postCount = 26;
            for (let i = 0; i < postCount; i++) {
                const angle = (i / postCount) * Math.PI * 2;
                let diff = Math.abs(angle - b.openAngle);
                while (diff > Math.PI) diff = Math.PI * 2 - diff;
                if (diff > gapAngle / 2 + 0.10) {
                    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.2, 8), stoneMat);
                    post.position.set(b.x + Math.cos(angle) * 11.8, 2.2, b.z + Math.sin(angle) * 11.8);
                    post.castShadow = true;
                    this.scene.add(post);

                    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), goldTrimMat);
                    cap.position.set(b.x + Math.cos(angle) * 11.8, 2.85, b.z + Math.sin(angle) * 11.8);
                    this.scene.add(cap);
                }
            }
        });

        // 6. 3D Physical Stone & Gold Ascension Staircases (Correct Facing Orientation & Alignment)
        // East Wing Stairs (Lens) - Ascends West to East (+X direction, rotY: +PI/2), flush with platform edge at x=18.2
        this.scene.add(this.createStaircase({ posX: 16.8, posZ: 0, rotY: Math.PI / 2, width: 6.0, startY: 0.4, endY: 1.6, length: 2.8, steps: 4 }));

        // North Wing Stairs (Flux) - Ascends South to North (-Z direction, rotY: PI), flush with platform edge at z=-18.2
        this.scene.add(this.createStaircase({ posX: 0, posZ: -16.8, rotY: Math.PI, width: 6.0, startY: 0.4, endY: 1.6, length: 2.8, steps: 4 }));

        // West Wing Stairs (Prism) - Ascends East to West (-X direction, rotY: -PI/2), flush with platform edge at x=-18.2
        this.scene.add(this.createStaircase({ posX: -16.8, posZ: 0, rotY: -Math.PI / 2, width: 6.0, startY: 0.4, endY: 1.6, length: 2.8, steps: 4 }));

        // South Wing Stairs (Cubes) - Ascends North to South (+Z direction, rotY: 0), flush with platform edge at z=18.2
        this.scene.add(this.createStaircase({ posX: 0, posZ: 16.8, rotY: 0, width: 6.0, startY: 0.4, endY: 1.6, length: 2.8, steps: 4 }));

        // 4 Grand Rotunda Entry Staircases - Ascending towards center (0,0) from bridge (r=11.0) up to dais edge (r=8.5)
        // East Rotunda: Ascends East to West (-X direction, rotY: -PI/2)
        this.scene.add(this.createStaircase({ posX: 9.75, posZ: 0, rotY: -Math.PI / 2, width: 5.6, startY: 0.4, endY: 1.6, length: 2.5, steps: 4 }));
        // North Rotunda: Ascends North to South (+Z direction, rotY: 0)
        this.scene.add(this.createStaircase({ posX: 0, posZ: -9.75, rotY: 0, width: 5.6, startY: 0.4, endY: 1.6, length: 2.5, steps: 4 }));
        // West Rotunda: Ascends West to East (+X direction, rotY: +PI/2)
        this.scene.add(this.createStaircase({ posX: -9.75, posZ: 0, rotY: Math.PI / 2, width: 5.6, startY: 0.4, endY: 1.6, length: 2.5, steps: 4 }));
        // South Rotunda: Ascends South to North (-Z direction, rotY: PI)
        this.scene.add(this.createStaircase({ posX: 0, posZ: 9.75, rotY: Math.PI, width: 5.6, startY: 0.4, endY: 1.6, length: 2.5, steps: 4 }));
    }

    createStaircase({ posX, posZ, rotY, width = 6.0, startY = 0.4, endY = 1.6, length = 2.8, steps = 4 }) {
        const stairGroup = new THREE.Group();
        stairGroup.position.set(posX, 0, posZ);
        stairGroup.rotation.y = rotY;

        const treadMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.75, metalness: 0.1 });
        const riserMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
        const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
        const neonCyanMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });

        const stepLength = length / steps;
        const totalRise = endY - startY;
        const stepRise = totalRise / steps;

        for (let i = 0; i < steps; i++) {
            const curStepTop = startY + (i + 1) * stepRise;
            const stepHeight = (i + 1) * stepRise;
            const stepZ = (i - steps / 2 + 0.5) * stepLength;

            // Solid Step Box Base from startY up to step top
            const stepGeo = new THREE.BoxGeometry(width, stepHeight, stepLength * 1.01);
            const stepMesh = new THREE.Mesh(stepGeo, treadMat);
            stepMesh.position.set(0, startY + stepHeight / 2, stepZ);
            stepMesh.receiveShadow = true;
            stepMesh.castShadow = true;
            stairGroup.add(stepMesh);

            // Gold Nosing Trim on Step Tread Front Leading Edge (facing climber)
            const nosing = new THREE.Mesh(new THREE.BoxGeometry(width + 0.15, 0.05, 0.06), goldTrimMat);
            nosing.position.set(0, curStepTop - 0.025, stepZ - stepLength / 2);
            stairGroup.add(nosing);

            // Glowing Rune Strip across step tread
            const rune = new THREE.Mesh(new THREE.BoxGeometry(width * 0.78, 0.02, 0.04), neonCyanMat);
            rune.position.set(0, curStepTop + 0.015, stepZ);
            stairGroup.add(rune);
        }

        // Side Stone Balustrades / Stringers with Gold Handrails (sloping upwards along +Z)
        const slopeAngle = Math.atan2(totalRise, length);
        [-width / 2 - 0.18, width / 2 + 0.18].forEach(sideX => {
            const stringer = new THREE.Mesh(
                new THREE.BoxGeometry(0.32, totalRise + 0.35, length * 1.04),
                riserMat
            );
            stringer.position.set(sideX, (startY + endY) / 2 + 0.08, 0);
            stringer.rotation.x = -slopeAngle;
            stringer.castShadow = true;
            stairGroup.add(stringer);

            const rail = new THREE.Mesh(
                new THREE.CylinderGeometry(0.07, 0.07, length * 1.06, 12),
                goldTrimMat
            );
            rail.position.set(sideX, (startY + endY) / 2 + 0.55, 0);
            rail.rotation.x = Math.PI / 2 - slopeAngle;
            stairGroup.add(rail);

            // Bottom and Top Newel Pillars with Gold Finials
            [
                { z: -length / 2, y: startY },
                { z: length / 2, y: endY }
            ].forEach(pillarPos => {
                const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.36, 1.0, 0.36), treadMat);
                pillar.position.set(sideX, pillarPos.y + 0.5, pillarPos.z);
                pillar.castShadow = true;
                stairGroup.add(pillar);

                const finial = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), goldTrimMat);
                finial.position.set(sideX, pillarPos.y + 1.08, pillarPos.z);
                stairGroup.add(finial);
            });
        });

        return stairGroup;
    }

    // ==========================================================================
    // 2B. OUTSIDE ARRIVAL ROAD & GRAND SANCTUARY ENTRANCE GATEWAY
    // ==========================================================================
    buildArrivalRoad() {
        const roadGroup = new THREE.Group();
        roadGroup.name = "OutsideArrivalRoad";

        const stoneDeckMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8, metalness: 0.1 });
        const marbleTrimMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.2 });
        const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.95 });
        const cyanRuneMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x0284c7, emissiveIntensity: 0.8, roughness: 0.1 });
        const lanternGlassMat = new THREE.MeshPhysicalMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            emissiveIntensity: 2.2,
            roughness: 0.1,
            transmission: 0.75,
            transparent: true
        });

        // 1. Massive Suspended Stone Viaduct Road Deck (z = 48 to 92, length = 44m, width = 8.8m, surface y = 0.4)
        const roadLength = 44.0;
        const centerZ = (48.0 + 92.0) / 2; // 70.0

        const roadDeck = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.8, roadLength), stoneDeckMat);
        roadDeck.position.set(0, 0.0, centerZ);
        roadDeck.receiveShadow = true;
        roadDeck.castShadow = true;
        roadGroup.add(roadDeck);

        // Marble Curb Trims with Gold Filigree Edging on Left and Right
        [-4.4, 4.4].forEach(sideX => {
            const curb = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, roadLength), marbleTrimMat);
            curb.position.set(sideX, 0.45, centerZ);
            curb.castShadow = true;
            roadGroup.add(curb);

            const goldBevel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, roadLength), goldTrimMat);
            goldBevel.position.set(sideX + (sideX > 0 ? -0.22 : 0.22), 0.76, centerZ);
            roadGroup.add(goldBevel);
        });

        // Glowing Centerline Power Conduit
        const centerLine = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.06, roadLength), cyanRuneMat);
        centerLine.position.set(0, 0.42, centerZ);
        roadGroup.add(centerLine);

        // 2. Giant Arch Foundation Supports underneath the viaduct into mountain clouds
        [58, 72, 86].forEach(pz => {
            const pierL = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 22, 16), stoneDeckMat);
            pierL.position.set(-3.6, -11.0, pz);
            pierL.castShadow = true;
            roadGroup.add(pierL);

            const pierR = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 22, 16), stoneDeckMat);
            pierR.position.set(3.6, -11.0, pz);
            pierR.castShadow = true;
            roadGroup.add(pierR);

            const pierArch = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.8, 12, 24, Math.PI), stoneDeckMat);
            pierArch.rotation.y = Math.PI / 2;
            pierArch.position.set(0, -1.0, pz);
            roadGroup.add(pierArch);
        });

        // 3. Ornate Celestial Roadside Lanterns at z = 56, 66, 76, 86
        [56, 66, 76, 86].forEach(pz => {
            [-4.4, 4.4].forEach(sideX => {
                const lanternPost = new THREE.Group();
                lanternPost.position.set(sideX, 0.75, pz);

                // Carved Marble Pedestal
                const base = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.1, 0.65), marbleTrimMat);
                base.position.y = 0.55;
                base.castShadow = true;
                lanternPost.add(base);

                // Gold Lantern Bracket & Housing
                const bracket = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.36, 0.8, 8), goldTrimMat);
                bracket.position.y = 1.35;
                bracket.castShadow = true;
                lanternPost.add(bracket);

                // Glowing Cyan Ether Core Crystal
                const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), lanternGlassMat);
                crystal.position.y = 1.35;
                lanternPost.add(crystal);

                // Soft Point Light
                const pLight = new THREE.PointLight(0x00e5ff, 1.4, 12);
                pLight.position.y = 1.35;
                lanternPost.add(pLight);

                roadGroup.add(lanternPost);
            });
        });

        // 4. Distant Mountain Pass Archway at z = 92m (Where the road enters from the clouds)
        const passArch = new THREE.Group();
        passArch.position.set(0, 0.4, 92);

        const archPostL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 12, 1.6), stoneDeckMat);
        archPostL.position.set(-4.8, 6, 0);
        archPostL.castShadow = true;
        passArch.add(archPostL);

        const archPostR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 12, 1.6), stoneDeckMat);
        archPostR.position.set(4.8, 6, 0);
        archPostR.castShadow = true;
        passArch.add(archPostR);

        const archLintel = new THREE.Mesh(new THREE.BoxGeometry(12, 1.8, 1.8), marbleTrimMat);
        archLintel.position.set(0, 11.5, 0);
        archLintel.castShadow = true;
        passArch.add(archLintel);

        const archGoldCrown = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.8, 4), goldTrimMat);
        archGoldCrown.position.set(0, 13.2, 0);
        archGoldCrown.rotation.y = Math.PI / 4;
        passArch.add(archGoldCrown);

        // Pine trees framing the distant mountain entrance
        const treeL = this.createPineTree(8.5, 2.4);
        treeL.position.set(-6.8, 0, 92);
        this.scene.add(treeL);

        const treeR = this.createPineTree(8.5, 2.4);
        treeR.position.set(6.8, 0, 92);
        this.scene.add(treeR);

        roadGroup.add(passArch);
        this.scene.add(roadGroup);
    }

    buildEntranceGateway() {
        const gateGroup = new THREE.Group();
        gateGroup.name = "SanctuaryEntranceGateway";
        gateGroup.position.set(0, 0.4, 48.0);

        const marbleWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.25 });
        const obsidianMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.35, metalness: 0.8 });
        const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.18, metalness: 0.95 });
        const cyanEnergyMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 2.8, roughness: 0.1 });
        const blueFlameMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });

        // 1. Left & Right Colossal Gateway Towers (x = -5.5m and +5.5m, Height = 14.5m)
        [-5.5, 5.5].forEach(sideX => {
            const towerGroup = new THREE.Group();
            towerGroup.position.set(sideX, 0, 0);

            // Stepped Plinth Base
            const plinth1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 2.4), obsidianMat);
            plinth1.position.y = 0.6;
            plinth1.castShadow = true;
            towerGroup.add(plinth1);

            const plinth2 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.8, 2.0), goldTrimMat);
            plinth2.position.y = 1.4;
            plinth2.castShadow = true;
            towerGroup.add(plinth2);

            // Main Fluted Marble Column Shaft (Height = 11m)
            const column = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 11.0, 24), marbleWhiteMat);
            column.position.y = 7.3;
            column.castShadow = true;
            towerGroup.add(column);

            // Vertical Gold Spiral Inlays
            for (let i = 0; i < 4; i++) {
                const ang = (i / 4) * Math.PI * 2;
                const rib = new THREE.Mesh(new THREE.BoxGeometry(0.08, 11.0, 0.12), goldTrimMat);
                rib.position.set(Math.cos(ang) * 0.9, 7.3, Math.sin(ang) * 0.9);
                towerGroup.add(rib);
            }

            // Capital & Crown Plinth
            const capital = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 2.2), marbleWhiteMat);
            capital.position.y = 13.4;
            capital.castShadow = true;
            towerGroup.add(capital);

            const capitalGold = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.14, 12, 24), goldTrimMat);
            capitalGold.rotation.x = Math.PI / 2;
            capitalGold.position.y = 13.4;
            towerGroup.add(capitalGold);

            // Eternal Cerulean Flame Brazier on Tower Top
            const brazierBowl = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.4, 0.8, 16), goldTrimMat);
            brazierBowl.position.y = 14.4;
            brazierBowl.castShadow = true;
            towerGroup.add(brazierBowl);

            // Eternal Blue Fire Flame Core & Light
            const flameCore = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.4, 8), blueFlameMat);
            flameCore.position.y = 15.3;
            towerGroup.add(flameCore);

            const blueLight = new THREE.PointLight(0x00e5ff, 2.8, 22);
            blueLight.position.y = 15.6;
            towerGroup.add(blueLight);

            gateGroup.add(towerGroup);
        });

        // 2. Colossal Grand Arch Beam (Spans between x = -5.5 and +5.5 at y = 13.0m - 15.0m)
        const archBeam = new THREE.Mesh(new THREE.BoxGeometry(13.4, 1.6, 2.2), marbleWhiteMat);
        archBeam.position.set(0, 13.4, 0);
        archBeam.castShadow = true;
        gateGroup.add(archBeam);

        const archGoldTrimTop = new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.18, 2.3), goldTrimMat);
        archGoldTrimTop.position.set(0, 14.25, 0);
        gateGroup.add(archGoldTrimTop);

        const archGoldTrimBot = new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.18, 2.3), goldTrimMat);
        archGoldTrimBot.position.set(0, 12.55, 0);
        gateGroup.add(archGoldTrimBot);

        // Sweeping Gold Arch Under-Curvature
        const archUnder = new THREE.Mesh(new THREE.TorusGeometry(4.65, 0.45, 16, 32, Math.PI), goldTrimMat);
        archUnder.position.set(0, 10.2, 0);
        gateGroup.add(archUnder);

        // 3. Central Glowing Sanctuary Keystone Crest
        const crestGroup = new THREE.Group();
        crestGroup.position.set(0, 13.4, 1.15);

        const crestMedallion = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.25, 32), obsidianMat);
        crestMedallion.rotation.x = Math.PI / 2;
        crestGroup.add(crestMedallion);

        const crestGoldRing = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.12, 12, 32), goldTrimMat);
        crestGroup.add(crestGoldRing);

        const crestRuneRing = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.06, 8, 32), cyanEnergyMat);
        crestGroup.add(crestRuneRing);

        // Central Radiant 8-Point Star
        const crestStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.7, 0), cyanEnergyMat);
        crestGroup.add(crestStar);

        // Central Backside Crest (Facing Inside the Sanctuary)
        const crestBack = crestGroup.clone();
        crestBack.position.set(0, 13.4, -1.15);
        crestBack.rotation.y = Math.PI;
        gateGroup.add(crestBack);

        gateGroup.add(crestGroup);

        // 4. Gold Pedestal Guardians / Statuary Finials along Gate Threshold
        [-5.5, 5.5].forEach(sideX => {
            const banner = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 4.5), new THREE.MeshStandardMaterial({
                color: 0x4c1d95,
                roughness: 0.6,
                side: THREE.DoubleSide
            }));
            banner.position.set(sideX, 9.5, 1.25);
            gateGroup.add(banner);
        });

        this.scene.add(gateGroup);
    }

    // ==========================================================================
    // 2C. CINEMATIC ARRIVAL CUTSCENE CONTROLLER
    // ==========================================================================
    startArrivalCutscene() {
        this.isCutsceneActive = true;
        this.cutsceneTime = 0;
        this._cutsceneAudio = {
            whinnyPlayed: false,
            skidPlayed: false,
            landPlayed: false,
            dissolvePlayed: false,
            lastGallopTime: 0,
            lastTrotTime: 0
        };
        document.body.classList.add('cutscene-active');

        // Initialize Audio Engine & Trigger Grand Gateway Entry Fanfare + Wind
        this.soundSynth.init();
        this.soundSynth.playGateFanfare();
        this.soundSynth.startAmbientWind();

        // Set initial camera for wide grand entrance view
        this.camera.position.set(7.5, 5.5, 92.0);
        this.camera.lookAt(0, 2.2, 82.0);
    }

    updateArrivalCutscene(delta, time) {
        this.cutsceneTime += delta;
        const t = this.cutsceneTime;

        if (!this.celestialHorse || !this.player) return;

        // Phase 1: High-Speed Celestial Gallop along the Outer Road & through the Gateway (0.0s - 3.8s)
        if (t < 3.8) {
            const progress = t / 3.8;
            // Smooth ease in-out
            const ease = progress * progress * (3.0 - 2.0 * progress);
            const horseZ = THREE.MathUtils.lerp(82.0, 48.0, ease);

            this.celestialHorse.setPosition(0, 0.4, horseZ, 0);
            this.celestialHorse.setKinematicState('GALLOP', 1.0);

            // Trigger rhythmic galloping hoofbeats
            if (t - this._cutsceneAudio.lastGallopTime >= 0.36) {
                this._cutsceneAudio.lastGallopTime = t;
                this.soundSynth.playGallopBeat();
            }

            // Horse Whinny / Neigh as it passes the grand golden arch threshold
            if (t >= 1.2 && !this._cutsceneAudio.whinnyPlayed) {
                this._cutsceneAudio.whinnyPlayed = true;
                this.soundSynth.playHorseWhinny();
            }

            // Mount rider on saddle
            this.player.group.position.set(0, 2.05, horseZ - 0.05);
            this.player.group.rotation.y = Math.PI;
            this.player.update(delta, time, 'RIDING', { gallopCycle: this.celestialHorse.gallopCycle });

            // Dynamic Sweeping Tracking Camera
            // Camera tracks alongside and orbits around the Gateway as the horse gallops through
            const camProgress = t / 3.8;
            const camX = Math.sin(camProgress * Math.PI * 0.85) * 8.0;
            const camY = THREE.MathUtils.lerp(5.5, 4.0, camProgress);
            const camZ = horseZ + THREE.MathUtils.lerp(12.0, 8.0, camProgress);

            this.camera.position.set(camX, camY, camZ);
            this.camera.lookAt(0, 2.0, horseZ - 3.5);

        } else if (t < 5.2) {
            // Phase 2: Decelerating Trot & Majestic Halt right at Gate Ending (3.8s - 5.2s)
            const progress = (t - 3.8) / 1.4;
            const ease = 1.0 - Math.pow(1.0 - progress, 3);
            const horseZ = THREE.MathUtils.lerp(48.0, 44.0, ease);

            this.celestialHorse.setPosition(0, 0.4, horseZ, 0);
            if (progress < 0.6) {
                this.celestialHorse.setKinematicState('TROT', 1.0);
                if (t - this._cutsceneAudio.lastTrotTime >= 0.28) {
                    this._cutsceneAudio.lastTrotTime = t;
                    this.soundSynth.playTrotBeat();
                }
            } else {
                this.celestialHorse.setKinematicState('HALT', 0);
                if (!this._cutsceneAudio.skidPlayed) {
                    this._cutsceneAudio.skidPlayed = true;
                    this.soundSynth.playHaltSkid();
                }
            }

            this.player.group.position.set(0, 2.05, horseZ - 0.05);
            this.player.group.rotation.y = Math.PI;
            this.player.update(delta, time, 'RIDING', { gallopCycle: 0 });

            // Camera settles behind horse in over-the-shoulder view
            this.camera.position.lerp(new THREE.Vector3(0, 4.2, 54.5), delta * 5.0);
            this.camera.lookAt(0, 2.0, 44.0);

        } else if (t < 6.8) {
            // Phase 3: Dismount from Saddle onto Ground at Gate Exit & Horse Dissolve VFX (5.2s - 6.8s)
            const dismountProgress = (t - 5.2) / 1.6;

            this.celestialHorse.setPosition(0, 0.4, 44.0, 0);
            this.celestialHorse.setKinematicState('IDLE', 0);

            if (t >= 5.5 && !this.celestialHorse.isDissolving) {
                this.celestialHorse.startDissolve();
                if (!this._cutsceneAudio.dissolvePlayed) {
                    this._cutsceneAudio.dissolvePlayed = true;
                    this.soundSynth.playDissolveSparkle();
                }
            }

            // Player dismounts down to ground elevation (y = 0.4) right at the gate exit
            const playerY = THREE.MathUtils.lerp(2.05, 0.40, dismountProgress);
            const playerZ = THREE.MathUtils.lerp(43.95, 44.0, dismountProgress);
            this.player.group.position.set(0, playerY, playerZ);
            this.player.group.rotation.y = Math.PI;
            this.player.update(delta, time, 'DISMOUNT', { dismountProgress });

            // Boots impact ground
            if (t >= 6.3 && !this._cutsceneAudio.landPlayed) {
                this._cutsceneAudio.landPlayed = true;
                this.soundSynth.playDismountLand();
            }

            this.camera.position.lerp(new THREE.Vector3(0, 4.6, 54.5), delta * 6.0);
            this.camera.lookAt(0, 1.85, 44.0);

        } else {
            // Phase 4: Complete Cutscene & Unlock Gameplay Controls
            this.finishCutscene();
        }
    }

    skipCutscene() {
        if (!this.isCutsceneActive) return;
        this.finishCutscene();
    }

    finishCutscene() {
        this.isCutsceneActive = false;
        document.body.classList.remove('cutscene-active');

        // Play sanctuary arrival chime
        this.soundSynth.playChime();

        // Place Guardian safely on gate exit threshold (z = 44.0)
        this.playerPos.set(0, 0.4, 44.0);
        this.playerRotY = Math.PI;
        this.player.group.position.copy(this.playerPos);
        this.player.group.rotation.y = this.playerRotY;
        this.player.update(0.016, 0, 'IDLE');

        // Hide horse
        if (this.celestialHorse) {
            this.celestialHorse.hide();
        }

        // Initialize 3rd person camera behind player at gate exit
        this.camYaw = 0;
        this.targetCamYaw = 0;
        this.camPitch = 0.28;
        this.targetCamPitch = 0.28;
        this.cameraLookTarget.set(0, 1.85, 44.0);
        this.cameraCurrentPos.set(0, 4.6, 54.5);
        this.camera.position.copy(this.cameraCurrentPos);
        this.camera.lookAt(this.cameraLookTarget);

        this.showToast('SANCTUARY ENTERED', 'Welcome to the Pattern Observatory. Calibrate the 5 systems to rebuild the Engine.');
    }

    // ==========================================================================
    // 3. 3D FLOATING HOLOGRAPHIC SYSTEM NAMEPLATES & DETAILED SCI-FI ARCHITECTURE
    // ==========================================================================
    createSystemFloatingNameplate(systemConfig, yOffset = 11.5) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 280;
        const ctx = canvas.getContext('2d');

        const primaryColor = systemConfig.color || '#38bdf8';
        const tag = systemConfig.tag || 'SYSTEM NODE';
        const title = `${systemConfig.symbol || '◈'} ${systemConfig.name.toUpperCase()}`;

        const drawRoundedRect = (x, y, w, h, radius) => {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + w - radius, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
            ctx.lineTo(x + w, y + h - radius);
            ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
            ctx.lineTo(x + radius, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        };

        const renderPlate = (solvedStages = 0) => {
            ctx.clearRect(0, 0, 1024, 280);

            // 1. Cyberpunk Dark Glass Plate Background with Neon Glow
            ctx.save();
            ctx.shadowColor = primaryColor;
            ctx.shadowBlur = 24;
            ctx.fillStyle = 'rgba(10, 16, 32, 0.92)';
            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = 4;
            drawRoundedRect(35, 20, 954, 240, 24);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            // Inner subtle holographic gradient
            const innerGrad = ctx.createLinearGradient(0, 20, 0, 260);
            innerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
            innerGrad.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
            ctx.fillStyle = innerGrad;
            drawRoundedRect(35, 20, 954, 240, 24);
            ctx.fill();

            // 2. Top System Tag Header Badge
            ctx.fillStyle = primaryColor;
            drawRoundedRect(55, 36, 430, 38, 8);
            ctx.fill();

            // Header Tag Text
            ctx.fillStyle = '#090d16';
            ctx.font = 'bold 22px "Inter", "Rajdhani", sans-serif';
            ctx.fillText(`[ ${tag.toUpperCase()} ]`, 70, 63);

            // 3. Status Pill on Right
            let statusText = 'OFFLINE // 0/3 SOLVED';
            let statusDotColor = '#ef4444';
            let statusBorderColor = 'rgba(239, 68, 68, 0.6)';

            if (solvedStages === 3) {
                statusText = 'ONLINE // MASTERED ✓';
                statusDotColor = '#10b981';
                statusBorderColor = 'rgba(16, 185, 129, 0.8)';
            } else if (solvedStages > 0) {
                statusText = `ACTIVE // ${solvedStages}/3 SOLVED`;
                statusDotColor = '#f59e0b';
                statusBorderColor = 'rgba(245, 158, 11, 0.8)';
            }

            ctx.strokeStyle = statusBorderColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(690, 36, 260, 38);

            ctx.fillStyle = statusDotColor;
            ctx.beginPath();
            ctx.arc(716, 55, 7, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 18px "Rajdhani", monospace';
            ctx.fillText(statusText, 735, 62);

            // 4. Main System Title (Prominent & High Contrast)
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 46px "Rajdhani", "Inter", sans-serif';
            ctx.shadowColor = primaryColor;
            ctx.shadowBlur = 12;
            ctx.fillText(title, 55, 142);
            ctx.shadowBlur = 0;

            // 5. Divider Glowing Line
            const grad = ctx.createLinearGradient(55, 168, 969, 168);
            grad.addColorStop(0, primaryColor);
            grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.7)');
            grad.addColorStop(1, 'transparent');
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(55, 168);
            ctx.lineTo(969, 168);
            ctx.stroke();

            // 6. Subtitle / Protocol Description
            ctx.fillStyle = 'rgba(226, 232, 240, 0.95)';
            ctx.font = '600 24px "Inter", sans-serif';
            ctx.fillText(`3-STAGE APTITUDE MATRIX • RESTORATION PROTOCOL`, 55, 216);

            // 7. Sci-fi Corner Brackets
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3.5;
            // Top-left
            ctx.beginPath(); ctx.moveTo(25, 50); ctx.lineTo(25, 12); ctx.lineTo(65, 12); ctx.stroke();
            // Top-right
            ctx.beginPath(); ctx.moveTo(999, 50); ctx.lineTo(999, 12); ctx.lineTo(959, 12); ctx.stroke();
            // Bottom-left
            ctx.beginPath(); ctx.moveTo(25, 230); ctx.lineTo(25, 268); ctx.lineTo(65, 268); ctx.stroke();
            // Bottom-right
            ctx.beginPath(); ctx.moveTo(999, 230); ctx.lineTo(999, 268); ctx.lineTo(959, 268); ctx.stroke();
        };

        renderPlate(0);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;

        const spriteMat = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
            blending: THREE.NormalBlending
        });

        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(8.8, 2.4, 1.0);
        sprite.position.set(0, yOffset, 0);

        // Holographic vertical projection light beam
        const beamGeo = new THREE.CylinderGeometry(0.04, 1.4, yOffset - 1.0, 16, 1, true);
        const beamMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(primaryColor),
            transparent: true,
            opacity: 0.16,
            side: THREE.DoubleSide
        });
        const beamMesh = new THREE.Mesh(beamGeo, beamMat);
        beamMesh.position.set(0, (yOffset - 1.0) / 2 + 1.0, 0);

        // Emitter Base Ring
        const emitterRing = new THREE.Mesh(
            new THREE.TorusGeometry(1.4, 0.09, 16, 32),
            new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 })
        );
        emitterRing.rotation.x = Math.PI / 2;
        emitterRing.position.set(0, 1.05, 0);

        const plateGroup = new THREE.Group();
        plateGroup.add(beamMesh);
        plateGroup.add(emitterRing);
        plateGroup.add(sprite);

        return {
            group: plateGroup,
            sprite,
            beam: beamMesh,
            canvas,
            ctx,
            texture,
            baseY: yOffset,
            updateStatus: (stagesDone) => {
                renderPlate(stagesDone);
                texture.needsUpdate = true;
            }
        };
    }

    buildLensSystem() {
        const group = new THREE.Group();
        group.position.set(30, 0, 0);

        const brassMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.9,
            roughness: 0.2,
            envMapIntensity: 1.2
        });
        const darkTitaniumMat = new THREE.MeshStandardMaterial({
            color: 0x334155,
            metalness: 0.85,
            roughness: 0.3
        });
        const brokenMat = new THREE.MeshStandardMaterial({
            color: 0x5c2b0c,
            metalness: 0.3,
            roughness: 0.85
        });
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xdbeafe,
            transmission: 0.95,
            roughness: 0.03,
            ior: 1.62,
            transparent: true,
            opacity: 0.88,
            reflectivity: 0.9
        });
        const goldTrimMat = new THREE.MeshStandardMaterial({
            color: 0xd97706,
            metalness: 0.95,
            roughness: 0.15
        });

        // 1. Multi-Tiered Pedestal Base & Outriggers
        const subBase = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.6, 0.8, 8), darkTitaniumMat);
        subBase.position.y = 1.6;
        subBase.receiveShadow = true;
        group.add(subBase);

        const brassRingTrack = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.14, 16, 32), goldTrimMat);
        brassRingTrack.rotation.x = Math.PI / 2;
        brassRingTrack.position.y = 2.02;
        group.add(brassRingTrack);

        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 1.6), darkTitaniumMat);
            leg.position.set(Math.cos(angle) * 3.2, 1.4, Math.sin(angle) * 3.2);
            leg.rotation.y = -angle;
            leg.castShadow = true;
            group.add(leg);

            const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.2, 12), brassMat);
            piston.position.set(Math.cos(angle) * 3.8, 1.8, Math.sin(angle) * 3.8);
            piston.rotation.x = Math.PI / 6;
            group.add(piston);
        }

        // 2. Yoke Turret & Azimuth Mount
        const mount = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.4, 3.2, 24), brokenMat);
        mount.position.set(0, 3.6, 0);
        mount.castShadow = true;
        group.add(mount);

        const yokeLeft = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.2, 0.9), brokenMat);
        yokeLeft.position.set(-1.8, 5.4, 0);
        yokeLeft.castShadow = true;
        group.add(yokeLeft);

        const yokeRight = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.2, 0.9), brokenMat);
        yokeRight.position.set(1.8, 5.4, 0);
        yokeRight.castShadow = true;
        group.add(yokeRight);

        // 3. Heavy Telescope Barrel Assembly
        const barrel = new THREE.Group();
        barrel.position.set(0.6, 5.6, -0.4);
        barrel.rotation.set(0.35, 0.2, -Math.PI / 5);

        const mainTube = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.35, 7.2, 32), brokenMat);
        mainTube.castShadow = true;
        barrel.add(mainTube);

        const secTube = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.92, 3.8, 32), darkTitaniumMat);
        secTube.position.y = 3.6;
        barrel.add(secTube);

        [-1.8, 0, 1.8].forEach(y => {
            const collar = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.12, 12, 32), brokenMat);
            collar.rotation.x = Math.PI / 2;
            collar.position.y = y;
            barrel.add(collar);
        });

        const iris = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.2, 16, 24), goldTrimMat);
        iris.rotation.x = Math.PI / 2;
        iris.position.y = 5.4;
        barrel.add(iris);

        const counterweight = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16), brokenMat);
        counterweight.position.y = -3.8;
        barrel.add(counterweight);

        group.add(barrel);

        // 4. Dual Astrolabe Gyroscope Rings
        const ring = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.18, 16, 64), brokenMat);
        ring.position.set(-0.6, 5.2, 0.5);
        ring.rotation.set(0.5, 0.7, 0.2);
        group.add(ring);

        const innerRing = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.14, 16, 48), brokenMat);
        innerRing.position.set(-0.6, 5.2, 0.5);
        innerRing.rotation.set(-0.4, 0.3, 0.8);
        group.add(innerRing);

        // 5. High-Precision Optical Lenses
        const lenses = [];
        for (let i = 0; i < 3; i++) {
            const lensHolder = new THREE.Mesh(new THREE.TorusGeometry(1.6 - i * 0.25, 0.08, 12, 32), brokenMat);
            const lensDisc = new THREE.Mesh(new THREE.CylinderGeometry(1.55 - i * 0.25, 1.55 - i * 0.25, 0.1, 32), glassMat);
            lensDisc.rotation.x = Math.PI / 2;
            lensHolder.add(lensDisc);

            lensHolder.position.set(i * 1.6 - 1.2, 5.2 + i * 0.9, i * 0.8 - 0.6);
            lensHolder.rotation.set(Math.random() * 0.6, Math.random() * 0.6, Math.random() * 0.6);
            group.add(lensHolder);
            lenses.push(lensHolder);
        }

        // 6. Floating 3D System Nameplate
        const nameplate = this.createSystemFloatingNameplate(OBSERVATORY_SYSTEMS_CONFIG.lens, 11.8);
        group.add(nameplate.group);

        const hitTarget = this.createHitTarget('lens', 30, 6, 0, 5.5);
        this.scene.add(hitTarget);

        this.meshGroups.lens = {
            group,
            mount,
            yokeLeft,
            yokeRight,
            barrel,
            mainTube,
            ring,
            innerRing,
            lenses,
            counterweight,
            brassMat,
            darkTitaniumMat,
            brokenMat,
            glassMat,
            goldTrimMat,
            laserBeam: null,
            nameplate
        };
        this.scene.add(group);
    }

    buildFluxSystem() {
        const group = new THREE.Group();
        group.position.set(0, 0, -30);

        const crystalMat = new THREE.MeshPhysicalMaterial({
            color: 0x00e5ff,
            emissive: 0x0284c7,
            emissiveIntensity: 0.75,
            roughness: 0.08,
            metalness: 0.2,
            transmission: 0.85,
            ior: 1.8
        });
        const brokenCrystalMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.85
        });
        const reactorMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            metalness: 0.9,
            roughness: 0.2
        });
        const whiteAlloyMat = new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            metalness: 0.7,
            roughness: 0.25
        });
        const copperFocusMat = new THREE.MeshStandardMaterial({
            color: 0xb45309,
            metalness: 0.9,
            roughness: 0.25
        });
        const cyanNeonMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8
        });

        // 1. Tokamak Reactor Foundation Dais
        const reactorBase = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.8, 0.8, 16), reactorMat);
        reactorBase.position.y = 1.6;
        reactorBase.receiveShadow = true;
        group.add(reactorBase);

        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const conduit = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.06, 3.8), cyanNeonMat);
            conduit.position.set(Math.cos(angle) * 1.9, 2.02, Math.sin(angle) * 1.9);
            conduit.rotation.y = -angle;
            group.add(conduit);
        }

        // 2. 4 Heavy Quantum Generator Pylons
        const pylons = [];
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const pylonGroup = new THREE.Group();
            pylonGroup.position.set(Math.cos(angle) * 3.6, 1.8, Math.sin(angle) * 3.6);
            pylonGroup.rotation.set(0.35 * (i % 2 === 0 ? 1 : -1), -angle, 0.25 * (i > 1 ? 1 : -1));

            const foot = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.2), reactorMat);
            foot.position.y = 0.25;
            foot.castShadow = true;
            pylonGroup.add(foot);

            const col = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.4, 0.8), brokenCrystalMat);
            col.position.y = 2.4;
            col.castShadow = true;
            pylonGroup.add(col);

            const plasmaStrip = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.8, 0.85), cyanNeonMat);
            plasmaStrip.position.y = 2.4;
            pylonGroup.add(plasmaStrip);

            [1.4, 2.4, 3.4].forEach(y => {
                const ring = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.06, 12, 24), copperFocusMat);
                ring.rotation.x = Math.PI / 2;
                ring.position.y = y;
                pylonGroup.add(ring);
            });

            const horn = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.2, 6), copperFocusMat);
            horn.position.set(0, 5.0, 0);
            horn.rotation.x = Math.PI;
            pylonGroup.add(horn);

            group.add(pylonGroup);
            pylons.push({ mesh: pylonGroup, col, targetAngle: angle });
        }

        // 3. Central Levitating Quantum Flux Core
        const coreGroup = new THREE.Group();
        coreGroup.position.set(0, 4.8, 0);

        const outerCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(2.0, 0), brokenCrystalMat);
        outerCrystal.castShadow = true;
        coreGroup.add(outerCrystal);

        const innerNucleus = new THREE.Mesh(new THREE.IcosahedronGeometry(1.0, 1), crystalMat);
        coreGroup.add(innerNucleus);

        coreGroup.rotation.set(0.4, 0.2, 0.5);
        group.add(coreGroup);

        // 4. Floating 3D System Nameplate
        const nameplate = this.createSystemFloatingNameplate(OBSERVATORY_SYSTEMS_CONFIG.flux, 12.0);
        group.add(nameplate.group);

        const hitTarget = this.createHitTarget('flux', 0, 5.5, -30, 5.5);
        this.scene.add(hitTarget);

        this.meshGroups.flux = {
            group,
            pylons,
            fluxCore: coreGroup,
            outerCrystal,
            innerNucleus,
            crystalMat,
            brokenCrystalMat,
            whiteAlloyMat,
            fluxRing: null,
            nameplate
        };
        this.scene.add(group);
    }

    buildPrismSystem() {
        const group = new THREE.Group();
        group.position.set(-30, 0, 0);

        const prismGlassMat = new THREE.MeshPhysicalMaterial({
            color: 0xf5f3ff,
            emissive: 0x8b5cf6,
            emissiveIntensity: 0.45,
            transmission: 0.94,
            roughness: 0.02,
            ior: 1.95,
            transparent: true,
            opacity: 0.92,
            reflectivity: 0.95
        });
        const brokenMat = new THREE.MeshStandardMaterial({
            color: 0x334155,
            roughness: 0.85
        });
        const silverMat = new THREE.MeshStandardMaterial({
            color: 0xe2e8f0,
            metalness: 0.95,
            roughness: 0.12
        });
        const darkPlinthMat = new THREE.MeshStandardMaterial({
            color: 0x1e1b4b,
            metalness: 0.8,
            roughness: 0.25
        });

        // 1. Hexagonal Sacred Geometry Dais
        const hexDais = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.8, 0.8, 6), darkPlinthMat);
        hexDais.position.y = 1.6;
        hexDais.receiveShadow = true;
        group.add(hexDais);

        const runicInlay = new THREE.Mesh(new THREE.RingGeometry(1.6, 2.8, 6), silverMat);
        runicInlay.rotation.x = -Math.PI / 2;
        runicInlay.position.y = 2.02;
        group.add(runicInlay);

        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2 + Math.PI / 6;
            const crystalShard = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.8, 5), prismGlassMat);
            crystalShard.position.set(Math.cos(angle) * 3.4, 2.0, Math.sin(angle) * 3.4);
            crystalShard.rotation.set(0.3, angle, -0.2);
            group.add(crystalShard);
        }

        // 2. Central Collimator Light Projector
        const emitterPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 2.4, 16), silverMat);
        emitterPedestal.position.y = 2.8;
        emitterPedestal.castShadow = true;
        group.add(emitterPedestal);

        const lightSourceSphere = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        lightSourceSphere.position.y = 4.2;
        group.add(lightSourceSphere);

        // 3. 3 Harmonic Monolith Prisms
        const prisms = [];
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            const prismGroup = new THREE.Group();
            prismGroup.position.set(Math.cos(angle) * 2.8, 2.0, Math.sin(angle) * 2.8);
            prismGroup.rotation.set(0.35, 0.4 * i, 0.45);

            const baseCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 0.5, 6), silverMat);
            baseCollar.position.y = 0.25;
            baseCollar.castShadow = true;
            prismGroup.add(baseCollar);

            const crystalGeo = new THREE.CylinderGeometry(0.18, 0.95, 4.4, 6);
            const prismMesh = new THREE.Mesh(crystalGeo, brokenMat);
            prismMesh.position.y = 2.6;
            prismMesh.castShadow = true;
            prismGroup.add(prismMesh);

            const topCap = new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.7, 6), silverMat);
            topCap.position.y = 5.0;
            prismGroup.add(topCap);

            const tuneRing = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.06, 12, 32), silverMat);
            tuneRing.rotation.x = Math.PI / 2;
            tuneRing.position.y = 2.6;
            prismGroup.add(tuneRing);

            group.add(prismGroup);
            prisms.push({ mesh: prismGroup, prismMesh, targetAngle: angle });
        }

        // 4. Floating 3D System Nameplate
        const nameplate = this.createSystemFloatingNameplate(OBSERVATORY_SYSTEMS_CONFIG.prism, 11.8);
        group.add(nameplate.group);

        const hitTarget = this.createHitTarget('prism', -30, 5, 0, 5.5);
        this.scene.add(hitTarget);

        this.meshGroups.prism = {
            group,
            prisms,
            prismGlassMat,
            brokenMat,
            silverMat,
            laserRays: [],
            nameplate
        };
        this.scene.add(group);
    }

    buildMemoryCubesSystem() {
        const group = new THREE.Group();
        group.position.set(0, 0, 30);

        const darkCyberMat = new THREE.MeshStandardMaterial({
            color: 0x091410,
            metalness: 0.9,
            roughness: 0.2
        });
        const cyberFrameMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            metalness: 0.9,
            roughness: 0.25
        });
        const brokenMat = new THREE.MeshStandardMaterial({
            color: 0x1f2937,
            roughness: 0.85
        });
        const neonCircuitMat = new THREE.MeshBasicMaterial({
            color: 0x10b981
        });

        // 1. Cybernetic Data Sanctuary Dais
        const cyberDais = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.8, 0.8, 12), darkCyberMat);
        cyberDais.position.y = 1.6;
        cyberDais.receiveShadow = true;
        group.add(cyberDais);

        const cubeData = [
            { size: 1.4, x: -1.8, y: 3.8, z: 0, color: 0x10b981, emissive: 0x059669 },
            { size: 1.8, x: 0, y: 4.4, z: 0, color: 0x059669, emissive: 0x047857 },
            { size: 2.2, x: 2.0, y: 5.0, z: 0, color: 0x047857, emissive: 0x065f46 }
        ];

        cubeData.forEach(c => {
            const pillar = new THREE.Mesh(new THREE.CylinderGeometry(c.size * 0.65, c.size * 0.75, 1.8, 8), cyberFrameMat);
            pillar.position.set(c.x, 2.6, c.z);
            pillar.castShadow = true;
            group.add(pillar);

            const emitterRing = new THREE.Mesh(new THREE.TorusGeometry(c.size * 0.7, 0.08, 12, 24), neonCircuitMat);
            emitterRing.rotation.x = Math.PI / 2;
            emitterRing.position.set(c.x, 3.52, c.z);
            group.add(emitterRing);
        });

        // 2. 3 High-Tech Multi-Layered Levitating Quantum Datacubes
        const cubes = [];
        cubeData.forEach((c, idx) => {
            const cubeGroup = new THREE.Group();
            cubeGroup.position.set(c.x + (idx - 1) * 1.5, 3.6 + idx * 0.4, (idx - 1) * 1.2);
            cubeGroup.rotation.set(0.4 * idx, 0.3 * idx, 0.2);

            const exoGeo = new THREE.BoxGeometry(c.size, c.size, c.size);
            const exoMesh = new THREE.Mesh(exoGeo, brokenMat);
            exoMesh.castShadow = true;
            cubeGroup.add(exoMesh);

            const innerGeo = new THREE.BoxGeometry(c.size * 0.72, c.size * 0.72, c.size * 0.72);
            const innerMat = new THREE.MeshPhysicalMaterial({
                color: c.color,
                emissive: c.emissive,
                emissiveIntensity: 0.6,
                roughness: 0.1,
                transmission: 0.75
            });
            const innerMesh = new THREE.Mesh(innerGeo, innerMat);
            cubeGroup.add(innerMesh);

            const orbitRing1 = new THREE.Mesh(new THREE.TorusGeometry(c.size * 0.85, 0.04, 12, 32), neonCircuitMat);
            orbitRing1.rotation.x = Math.PI / 3;
            cubeGroup.add(orbitRing1);

            const orbitRing2 = new THREE.Mesh(new THREE.TorusGeometry(c.size * 0.92, 0.04, 12, 32), neonCircuitMat);
            orbitRing2.rotation.y = Math.PI / 4;
            cubeGroup.add(orbitRing2);

            group.add(cubeGroup);
            cubes.push({
                mesh: cubeGroup,
                exoMesh,
                innerMesh,
                orbitRing1,
                orbitRing2,
                targetPos: { x: c.x, y: c.y, z: c.z },
                color: c.color,
                emissive: c.emissive,
                size: c.size,
                geo: exoGeo
            });
        });

        // 3. Floating 3D System Nameplate
        const nameplate = this.createSystemFloatingNameplate(OBSERVATORY_SYSTEMS_CONFIG.cubes, 12.0);
        group.add(nameplate.group);

        const hitTarget = this.createHitTarget('cubes', 0, 5.5, 30, 5.5);
        this.scene.add(hitTarget);

        this.meshGroups.cubes = { group, cubes, nameplate };
        this.scene.add(group);
    }

    buildCoreSystem() {
        const group = new THREE.Group();
        group.position.set(0, 0, 0);

        const alabasterMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.18
        });
        const goldAstralMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.95,
            roughness: 0.18,
            envMapIntensity: 1.4
        });
        const silverAstralMat = new THREE.MeshStandardMaterial({
            color: 0xe2e8f0,
            metalness: 0.95,
            roughness: 0.12
        });
        const brokenGoldMat = new THREE.MeshStandardMaterial({
            color: 0x78350f,
            metalness: 0.4,
            roughness: 0.8
        });
        const crystalMat = new THREE.MeshPhysicalMaterial({
            color: 0x00f0ff,
            emissive: 0x0284c7,
            emissiveIntensity: 0.75,
            roughness: 0.05,
            metalness: 0.1,
            transmission: 0.9,
            ior: 2.1
        });
        const brokenCrystalMat = new THREE.MeshStandardMaterial({
            color: 0x450a0a,
            emissive: 0x7f1d1d,
            emissiveIntensity: 0.25
        });

        // 1. Grand Imperial Altar Rotunda Dais
        const altarBase = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 9.5, 1.6, 32), alabasterMat);
        altarBase.position.y = 0.8;
        altarBase.receiveShadow = true;
        group.add(altarBase);

        // 4 Open Arc Segments for the Gold Rim (leaving 4 wide open portals for the 4 staircases)
        const rotundaGap = 0.68; // ~39 degrees opening per staircase portal
        const arcSweep = (Math.PI / 2) - rotundaGap;

        [Math.PI / 4, 3 * Math.PI / 4, 5 * Math.PI / 4, 7 * Math.PI / 4].forEach(quadAngle => {
            const arcGeo = new THREE.TorusGeometry(8.5, 0.22, 16, 16, arcSweep);
            const arcMesh = new THREE.Mesh(arcGeo, goldAstralMat);
            arcMesh.rotation.x = Math.PI / 2;
            arcMesh.rotation.z = quadAngle - arcSweep / 2;
            arcMesh.position.y = 1.6;
            group.add(arcMesh);

            // Gold portal finials at both ends of the arc
            [-1, 1].forEach(side => {
                const finAngle = quadAngle + side * (arcSweep / 2);
                const finial = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), goldAstralMat);
                finial.position.set(Math.cos(finAngle) * 8.5, 1.6, Math.sin(finAngle) * 8.5);
                group.add(finial);
            });
        });

        // 8 Classical Fluted Colonnades in 4 Grand Portal Pairs (leaving 4 wide open entries for stairs)
        [
            0.34, -0.34,                          // East Entrance Portal (flanking 0 deg)
            Math.PI / 2 + 0.34, Math.PI / 2 - 0.34, // South Entrance Portal (flanking 90 deg)
            Math.PI + 0.34, Math.PI - 0.34,       // West Entrance Portal (flanking 180 deg)
            -Math.PI / 2 + 0.34, -Math.PI / 2 - 0.34 // North Entrance Portal (flanking 270 deg)
        ].forEach(angle => {
            const col = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 5.6, 16), alabasterMat);
            col.position.set(Math.cos(angle) * 7.5, 4.6, Math.sin(angle) * 7.5);
            col.castShadow = true;
            group.add(col);

            const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 0.4, 12), goldAstralMat);
            cap.position.set(Math.cos(angle) * 7.5, 7.5, Math.sin(angle) * 7.5);
            group.add(cap);

            const baseTrim = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.3, 12), goldAstralMat);
            baseTrim.position.set(Math.cos(angle) * 7.5, 1.75, Math.sin(angle) * 7.5);
            group.add(baseTrim);
        });

        // 2. 3 Massive Geared Astral Rings (Armillary Sphere)
        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(5.0, 0.24, 16, 64), brokenGoldMat);
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.22, 16, 64), brokenGoldMat);
        const ring3 = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.20, 16, 64), brokenGoldMat);

        ring1.position.y = 6.8; ring1.rotation.set(0.65, 0.25, 0.45);
        ring2.position.y = 6.8; ring2.rotation.set(-0.55, 0.35, -0.25);
        ring3.position.y = 6.8; ring3.rotation.set(0.35, -0.45, 0.55);

        group.add(ring1); group.add(ring2); group.add(ring3);

        // 3. Central Singularity Hyper-Crystal & Core Nucleus
        const coreGroup = new THREE.Group();
        coreGroup.position.y = 7.2;

        const crystalGeo = new THREE.IcosahedronGeometry(2.2, 0);
        const crystalMesh = new THREE.Mesh(crystalGeo, brokenCrystalMat);
        crystalMesh.castShadow = true;
        coreGroup.add(crystalMesh);

        const innerNucleus = new THREE.Mesh(
            new THREE.SphereGeometry(1.2, 24, 24),
            new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
        );
        coreGroup.add(innerNucleus);

        group.add(coreGroup);

        // 4. Floating 3D System Nameplate (Grand Elevation)
        const nameplate = this.createSystemFloatingNameplate(OBSERVATORY_SYSTEMS_CONFIG.core, 14.5);
        group.add(nameplate.group);

        const hitTarget = this.createHitTarget('core', 0, 7.2, 0, 6.0);
        group.add(hitTarget);

        this.meshGroups.core = {
            group,
            rings: [ring1, ring2, ring3],
            crystal: crystalMesh,
            innerNucleus,
            coreGroup,
            goldAstralMat,
            silverAstralMat,
            crystalMat,
            brokenGoldMat,
            brokenCrystalMat,
            lightBeam: null,
            nameplate
        };
        this.scene.add(group);
    }

    // ==========================================================================
    // 4. 15 IN-WORLD 3D WAYPOINT BEACONS (3 PER SYSTEM)
    // ==========================================================================
    build15WaypointBeacons() {
        Object.keys(OBSERVATORY_SYSTEMS_CONFIG).forEach(sysId => {
            const sys = OBSERVATORY_SYSTEMS_CONFIG[sysId];
            sys.stages.forEach(st => {
                const beaconGroup = new THREE.Group();
                beaconGroup.position.set(st.beaconPos.x, st.beaconPos.y, st.beaconPos.z);

                const orbGeo = new THREE.SphereGeometry(0.45, 16, 16);
                const orbMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true });
                const orbMesh = new THREE.Mesh(orbGeo, orbMat);
                beaconGroup.add(orbMesh);

                const ringGeo = new THREE.RingGeometry(0.8, 1.1, 24);
                const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
                const ringMesh = new THREE.Mesh(ringGeo, ringMat);
                ringMesh.rotation.x = -Math.PI / 2;
                ringMesh.position.y = -1.4;
                beaconGroup.add(ringMesh);

                const beamGeo = new THREE.CylinderGeometry(0.12, 0.3, 14, 16, 1, true);
                const beamMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
                const beamMesh = new THREE.Mesh(beamGeo, beamMat);
                beamMesh.position.y = 5.5;
                beaconGroup.add(beamMesh);

                const hitMesh = new THREE.Mesh(new THREE.SphereGeometry(1.6, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
                hitMesh.userData = { isBeacon: true, systemId: sysId, stageNum: st.stageNum };
                beaconGroup.add(hitMesh);
                this.interactiveNodes.push(hitMesh);

                this.beaconMeshes.push({
                    sysId,
                    stageNum: st.stageNum,
                    group: beaconGroup,
                    orb: orbMesh,
                    ring: ringMesh,
                    beam: beamMesh,
                    stage: st,
                    pos: new THREE.Vector3(st.beaconPos.x, st.beaconPos.y, st.beaconPos.z)
                });

                this.scene.add(beaconGroup);
            });
        });
    }

    buildGuardianAltars() {
        const guardians = [
            { id: "nova", x: 22, z: 22, color: 0xd97706 },
            { id: "byte", x: 22, z: -22, color: 0x0284c7 },
            { id: "echo", x: -22, z: -22, color: 0x7c3aed },
            { id: "blaze", x: -22, z: 22, color: 0xdc2626 }
        ];

        guardians.forEach(g => {
            const altar = new THREE.Mesh(
                new THREE.CylinderGeometry(2.5, 3, 1.2, 16),
                new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
            );
            altar.position.set(g.x, 0.6, g.z);
            altar.receiveShadow = true;
            this.scene.add(altar);

            const beaconOrb = new THREE.Mesh(
                new THREE.SphereGeometry(0.8, 16, 16),
                new THREE.MeshBasicMaterial({ color: g.color, wireframe: true })
            );
            beaconOrb.position.set(g.x, 3.2, g.z);
            this.scene.add(beaconOrb);
        });
    }

    buildStardustParticles() {
        const particleCount = 1800;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const palette = [new THREE.Color(0xf59e0b), new THREE.Color(0x00b4d8), new THREE.Color(0xa78bfa), new THREE.Color(0xffffff)];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 160;
            positions[i * 3 + 1] = Math.random() * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 160;

            const c = palette[Math.floor(Math.random() * palette.length)];
            colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 0.45,
            vertexColors: true,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending
        });

        this.animatables.stardustParticles = new THREE.Points(geo, mat);
        this.scene.add(this.animatables.stardustParticles);
    }

    createHitTarget(systemId, x, y, z, radius) {
        const hitGeo = new THREE.SphereGeometry(radius, 12, 12);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitMesh = new THREE.Mesh(hitGeo, hitMat);
        hitMesh.position.set(x, y, z);
        hitMesh.userData = { isSystem: true, systemId };
        this.interactiveNodes.push(hitMesh);
        return hitMesh;
    }

    // ==========================================================================
    // 5. PLAYER CONTROLLER & KEYBOARD / TOUCH INPUTS
    // ==========================================================================
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Keyboard Controls
        window.addEventListener('keydown', (e) => {
            this.soundSynth.init();
            const key = e.key.toLowerCase();

            if (e.key === 'Escape' || key === 'escape') {
                if (this.isCutsceneActive) {
                    this.skipCutscene();
                    return;
                }
            }

            if (this.isCutsceneActive) return;

            if (key === 'w' || key === 'arrowup') this.keys.forward = true;
            if (key === 's' || key === 'arrowdown') this.keys.backward = true;
            if (key === 'a' || key === 'arrowleft') this.keys.left = true;
            if (key === 'd' || key === 'arrowright') this.keys.right = true;
            if (e.shiftKey || key === 'shift') this.keys.sprint = true;
            if (key === ' ' || key === 'space') {
                if (this.isGrounded && this.cameraMode === 'player') {
                    this.playerVelocityY = 10.5;
                    this.isGrounded = false;
                    this.soundSynth.playJump();
                }
            }
            if (key === 'e' || key === 'enter') {
                if (this.activeProximityBeacon) {
                    this.openAptitudeMission(this.activeProximityBeacon.sysId, this.activeProximityBeacon.stageNum);
                    this.soundSynth.playChime();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (key === 'w' || key === 'arrowup') this.keys.forward = false;
            if (key === 's' || key === 'arrowdown') this.keys.backward = false;
            if (key === 'a' || key === 'arrowleft') this.keys.left = false;
            if (key === 'd' || key === 'arrowright') this.keys.right = false;
            if (key === 'shift') this.keys.sprint = false;
        });

        // Mouse Drag to Rotate Camera in 3rd-Person Mode
        window.addEventListener('mousedown', (e) => {
            this.soundSynth.init();
            if (e.target.closest('.hud-interactive') || e.target.closest('.action-btn') || e.target.closest('.dock-node-btn') || e.target.closest('.restoration-puzzle-modal')) {
                return;
            }
            this.isDraggingMouse = true;
            this.prevMousePos = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            if (this.isDraggingMouse && this.cameraMode === 'player') {
                const deltaX = e.clientX - this.prevMousePos.x;
                const deltaY = e.clientY - this.prevMousePos.y;
                this.targetCamYaw -= deltaX * 0.005;
                this.targetCamPitch = Math.max(0.08, Math.min(Math.PI / 2.3, this.targetCamPitch + deltaY * 0.005));
                this.prevMousePos = { x: e.clientX, y: e.clientY };
            }
        });

        window.addEventListener('mouseup', () => {
            this.isDraggingMouse = false;
        });

        // Mouse Scroll Zoom
        window.addEventListener('wheel', (e) => {
            if (this.cameraMode === 'player') {
                this.camDistance = Math.max(5.0, Math.min(22.0, this.camDistance + e.deltaY * 0.01));
            }
        });

        // Raycast Click on Beacons & Systems
        window.addEventListener('click', (e) => {
            if (e.target.closest('.hud-interactive') || e.target.closest('.action-btn') || e.target.closest('.dock-node-btn') || e.target.closest('.restoration-puzzle-modal')) {
                return;
            }

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.interactiveNodes, true);

            if (intersects.length > 0) {
                const data = intersects[0].object.userData;
                if (data.isBeacon) {
                    this.focusOnSystem(data.systemId, true);
                    this.openAptitudeMission(data.systemId, data.stageNum);
                    this.playClickSound();
                } else if (data.isSystem) {
                    this.focusOnSystem(data.systemId, true);
                    this.playClickSound();
                }
            }
        });
    }

    setupVirtualJoystick() {
        const zone = document.getElementById('virtualJoystickZone');
        const knob = document.getElementById('joystickKnob');
        if (!zone || !knob) return;

        let isTouching = false;
        let startX = 0;
        let startY = 0;
        const maxRadius = 45;

        zone.addEventListener('touchstart', (e) => {
            this.soundSynth.init();
            const touch = e.touches[0];
            const rect = zone.getBoundingClientRect();
            startX = rect.left + rect.width / 2;
            startY = rect.top + rect.height / 2;
            isTouching = true;
            e.preventDefault();
        }, { passive: false });

        zone.addEventListener('touchmove', (e) => {
            if (!isTouching) return;
            const touch = e.touches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;
            const dist = Math.hypot(dx, dy);
            const angle = Math.atan2(dy, dx);
            const clampedDist = Math.min(dist, maxRadius);

            const finalX = Math.cos(angle) * clampedDist;
            const finalY = Math.sin(angle) * clampedDist;

            knob.style.transform = `translate(calc(-50% + ${finalX}px), calc(-50% + ${finalY}px))`;

            this.joystickDelta.x = finalX / maxRadius;
            this.joystickDelta.y = finalY / maxRadius;
            e.preventDefault();
        }, { passive: false });

        const endTouch = () => {
            isTouching = false;
            knob.style.transform = `translate(-50%, -50%)`;
            this.joystickDelta.x = 0;
            this.joystickDelta.y = 0;
        };

        zone.addEventListener('touchend', endTouch);
        zone.addEventListener('touchcancel', endTouch);

        document.getElementById('btnMobileJump')?.addEventListener('click', () => {
            if (this.isGrounded) {
                this.playerVelocityY = 10.5;
                this.isGrounded = false;
                this.soundSynth.playJump();
            }
        });

        document.getElementById('btnMobileSprint')?.addEventListener('click', (e) => {
            this.keys.sprint = !this.keys.sprint;
            e.currentTarget.classList.toggle('active', this.keys.sprint);
        });

        document.getElementById('btnMobileInteract')?.addEventListener('click', () => {
            if (this.activeProximityBeacon) {
                this.openAptitudeMission(this.activeProximityBeacon.sysId, this.activeProximityBeacon.stageNum);
                this.soundSynth.playChime();
            }
        });
    }

    // ==========================================================================
    // 6. PROXIMITY DETECTION & INTERACTION PROMPT (REQUIRES STAIR ASCENT)
    // ==========================================================================
    updateProximityDetection() {
        if (!this.player) return;
        const pPos = this.player.group.position;
        let nearestBeacon = null;
        let minDist = 4.8;

        // Player must ascend the stairs onto the raised platform (y >= 0.85) to unlock calibration
        this.beaconMeshes.forEach(b => {
            const dist = Math.hypot(pPos.x - b.pos.x, pPos.z - b.pos.z);
            if (dist < minDist && pPos.y >= 0.85) {
                minDist = dist;
                nearestBeacon = b;
            }
        });

        const promptHud = document.getElementById('proximityPromptHud');
        if (!promptHud) return;

        if (nearestBeacon) {
            if (this.activeProximityBeacon !== nearestBeacon) {
                const isSolved = this.systemProgress[nearestBeacon.sysId][nearestBeacon.stageNum - 1];
                if (!isSolved) {
                    this.soundSynth.playBeaconHum();
                }
            }
            this.activeProximityBeacon = nearestBeacon;
            const isSolved = this.systemProgress[nearestBeacon.sysId][nearestBeacon.stageNum - 1];

            document.getElementById('proximityPromptAction').textContent = isSolved ? "STAGE SOLVED ✓" : `TO CALIBRATE POINT ${nearestBeacon.stageNum}`;
            document.getElementById('proximityPromptTitle').textContent = nearestBeacon.stage.title;
            document.getElementById('proximityPromptSkill').textContent = `${nearestBeacon.stage.skill.toUpperCase()}`;

            const btn = document.getElementById('btnProximityInteract');
            if (btn) {
                btn.textContent = isSolved ? "REVIEW ➔" : "SOLVE ➔";
                btn.style.background = isSolved ? "linear-gradient(135deg, #059669 0%, #047857 100%)" : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
            }

            promptHud.classList.add('active');
        } else {
            this.activeProximityBeacon = null;
            promptHud.classList.remove('active');
        }
    }

    // ==========================================================================
    // 7. IN-WORLD APTITUDE PUZZLE MODAL & 3D RECONSTRUCTION
    // ==========================================================================
    openAptitudeMission(systemId, stageNum) {
        const sys = OBSERVATORY_SYSTEMS_CONFIG[systemId];
        const stage = sys.stages.find(s => s.stageNum === stageNum);
        if (!stage) return;

        this.activeSolvingMission = { systemId, stageNum, stage };
        this.selectedOptionIndex = null;

        const modal = document.getElementById('restorationPuzzleModal');
        const g = GUARDIAN_PROFILES[sys.guardianId];

        document.getElementById('modalPuzzleTag').textContent = `STAGE ${stageNum} // ${stage.skill.toUpperCase()}`;
        document.getElementById('modalPuzzleTitle').textContent = stage.title;

        document.getElementById('modalGuardianAvatar').src = g.avatar;
        document.getElementById('modalGuardianName').textContent = `${g.name} // ${g.title}`;
        document.getElementById('modalGuardianSpeech').textContent = `"${stage.guardianSpeech}"`;

        document.getElementById('puzzleSkillBadge').textContent = `APTITUDE SKILL: ${stage.skill.toUpperCase()}`;
        document.getElementById('puzzleQuestionText').textContent = stage.question;
        document.getElementById('puzzleSeriesDisplay').textContent = stage.series;

        const grid = document.getElementById('puzzleOptionsGrid');
        grid.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D'];

        stage.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="option-letter">[${letters[idx]}]</span> <span>${opt}</span>`;
            btn.addEventListener('click', () => {
                grid.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedOptionIndex = idx;
                document.getElementById('puzzleErrorMsg').style.display = 'none';
                this.playClickSound();
            });
            grid.appendChild(btn);
        });

        document.getElementById('puzzleErrorMsg').style.display = 'none';
        modal.classList.add('active');
    }

    closeAptitudeMission() {
        document.getElementById('restorationPuzzleModal')?.classList.remove('active');
        this.activeSolvingMission = null;
    }

    submitAptitudeAnswer() {
        if (!this.activeSolvingMission) return;
        const { systemId, stageNum, stage } = this.activeSolvingMission;

        if (this.selectedOptionIndex === null) {
            const err = document.getElementById('puzzleErrorMsg');
            err.textContent = "⚠️ Please select an option first!";
            err.style.display = 'block';
            this.soundSynth.playPuzzleWrong();
            return;
        }

        if (this.selectedOptionIndex !== stage.correctIndex) {
            const err = document.getElementById('puzzleErrorMsg');
            err.textContent = "❌ Incorrect calculation! Analyze the progression pattern and try again.";
            err.style.display = 'block';
            this.soundSynth.playPuzzleWrong();
            return;
        }

        this.systemProgress[systemId][stageNum - 1] = true;
        this.soundSynth.playPuzzleCorrect();
        this.closeAptitudeMission();

        this.applyStageReconstruction3D(systemId, stageNum);
        this.updateGlobalProgressUI();
        this.updateInspectionDrawer(OBSERVATORY_SYSTEMS_CONFIG[systemId]);

        this.showToast(`POINT ${stageNum} SOLVED!`, `${OBSERVATORY_SYSTEMS_CONFIG[systemId].name} stage ${stageNum} reconstructed.`);
    }

    applyStageReconstruction3D(systemId, stageNum) {
        const sfx = new Audio('assets/audio/cosmic-awakening.mp3');
        sfx.volume = 0.8;
        sfx.play().catch(() => {});
        this.soundSynth.playChime();

        const beacon = this.beaconMeshes.find(b => b.sysId === systemId && b.stageNum === stageNum);
        if (beacon) {
            beacon.orb.material = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: false });
            beacon.ring.material = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide });
            beacon.beam.material = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
        }

        const stagesDone = this.systemProgress[systemId].filter(v => v).length;

        // Update Floating Holographic System Nameplate Status
        if (this.meshGroups[systemId] && this.meshGroups[systemId].nameplate) {
            this.meshGroups[systemId].nameplate.updateStatus(stagesDone);
        }

        if (systemId === 'lens') {
            const m = this.meshGroups.lens;
            if (stageNum === 1) {
                m.mount.material = m.brassMat;
                m.yokeLeft.material = m.brassMat;
                m.yokeRight.material = m.brassMat;
            } else if (stageNum === 2) {
                m.ring.material = m.brassMat;
                m.ring.position.set(0, 5.6, 0);
                m.ring.rotation.set(0, 0, 0);
                m.innerRing.material = m.goldTrimMat;
                m.innerRing.position.set(0, 5.6, 0);
                m.innerRing.rotation.set(0, 0, 0);

                m.barrel.position.set(0, 5.6, 0);
                m.barrel.rotation.set(0, 0, -Math.PI / 4);
                m.mainTube.material = m.brassMat;
                m.counterweight.material = m.brassMat;
            } else if (stageNum === 3) {
                m.lenses.forEach((lensHolder, idx) => {
                    lensHolder.position.set(idx * 1.3, 5.6 + idx * 1.3, 0);
                    lensHolder.rotation.set(0, 0, -Math.PI / 4);
                    lensHolder.material = m.goldTrimMat;
                });
                if (!m.laserBeam) {
                    const laser = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.1, 0.1, 45, 16),
                        new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.9 })
                    );
                    laser.position.set(16, 21.6, 0);
                    laser.rotation.z = -Math.PI / 4;
                    m.group.add(laser);
                    m.laserBeam = laser;
                }
            }
        } else if (systemId === 'flux') {
            const m = this.meshGroups.flux;
            if (stageNum === 1) {
                m.pylons.slice(0, 2).forEach(p => {
                    p.mesh.position.set(Math.cos(p.targetAngle) * 4.8, 1.8, Math.sin(p.targetAngle) * 4.8);
                    p.mesh.rotation.set(0, -p.targetAngle, 0);
                    p.col.material = m.whiteAlloyMat;
                });
            } else if (stageNum === 2) {
                m.pylons.slice(2, 4).forEach(p => {
                    p.mesh.position.set(Math.cos(p.targetAngle) * 4.8, 1.8, Math.sin(p.targetAngle) * 4.8);
                    p.mesh.rotation.set(0, -p.targetAngle, 0);
                    p.col.material = m.whiteAlloyMat;
                });
            } else if (stageNum === 3) {
                m.outerCrystal.material = m.crystalMat;
                m.outerCrystal.rotation.set(0, 0, 0);
                if (!m.fluxRing) {
                    const fluxRing = new THREE.Mesh(
                        new THREE.TorusGeometry(3.4, 0.14, 16, 32),
                        new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.85 })
                    );
                    fluxRing.position.y = 5.2;
                    fluxRing.rotation.x = Math.PI / 2;
                    m.group.add(fluxRing);
                    m.fluxRing = fluxRing;
                }
            }
        } else if (systemId === 'prism') {
            const m = this.meshGroups.prism;
            if (stageNum === 1) {
                m.prisms[0].prismMesh.material = m.prismGlassMat;
                m.prisms[0].mesh.position.set(Math.cos(m.prisms[0].targetAngle) * 3.2, 2.2, Math.sin(m.prisms[0].targetAngle) * 3.2);
                m.prisms[0].mesh.rotation.set(0, 0, 0);
            } else if (stageNum === 2) {
                m.prisms.slice(1, 3).forEach(p => {
                    p.prismMesh.material = m.prismGlassMat;
                    p.mesh.position.set(Math.cos(p.targetAngle) * 3.2, 2.2, Math.sin(p.targetAngle) * 3.2);
                    p.mesh.rotation.set(0, 0, 0);
                });
            } else if (stageNum === 3) {
                const colors = [0xef4444, 0xf97316, 0xeab308, 0x22c55e, 0x06b6d4, 0x3b82f6, 0x8b5cf6];
                colors.forEach((c, idx) => {
                    const ray = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.04, 0.04, 16, 8),
                        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.85 })
                    );
                    ray.position.set(0, 4.6, 0);
                    ray.rotation.z = (idx / colors.length) * Math.PI;
                    ray.rotation.x = Math.PI / 4;
                    m.group.add(ray);
                });
            }
        } else if (systemId === 'cubes') {
            const m = this.meshGroups.cubes;
            if (stageNum === 1) {
                const c = m.cubes[0];
                c.mesh.position.set(c.targetPos.x, c.targetPos.y, c.targetPos.z);
                c.mesh.rotation.set(0, 0, 0);
                c.exoMesh.material = new THREE.MeshPhysicalMaterial({ color: c.color, emissive: c.emissive, emissiveIntensity: 0.5, roughness: 0.15, transmission: 0.7 });
            } else if (stageNum === 2) {
                m.cubes.slice(1, 3).forEach(c => {
                    c.mesh.position.set(c.targetPos.x, c.targetPos.y, c.targetPos.z);
                    c.mesh.rotation.set(0, 0, 0);
                    c.exoMesh.material = new THREE.MeshPhysicalMaterial({ color: c.color, emissive: c.emissive, emissiveIntensity: 0.5, roughness: 0.15, transmission: 0.7 });
                });
            } else if (stageNum === 3) {
                m.cubes.forEach(c => {
                    const wireMesh = new THREE.LineSegments(
                        new THREE.EdgesGeometry(c.geo),
                        new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 2 })
                    );
                    c.mesh.add(wireMesh);
                });
            }
        } else if (systemId === 'core') {
            const m = this.meshGroups.core;
            if (stageNum === 1) {
                m.rings[0].material = m.goldAstralMat;
            } else if (stageNum === 2) {
                m.rings[1].material = m.goldAstralMat;
                m.rings[2].material = m.silverAstralMat;
            } else if (stageNum === 3) {
                m.crystal.material = m.crystalMat;
                if (!m.lightBeam) {
                    const beam = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.8, 2.8, 100, 32),
                        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.38, side: THREE.DoubleSide })
                    );
                    beam.position.y = 55;
                    m.group.add(beam);
                    m.lightBeam = beam;
                }
            }
        }

        const dockBtn = document.querySelector(`.dock-node-btn[data-system="${systemId}"]`);
        if (dockBtn) {
            dockBtn.classList.remove('partial', 'restored');
            if (stagesDone === 3) dockBtn.classList.add('restored');
            else if (stagesDone > 0) dockBtn.classList.add('partial');
        }
    }

    updateGlobalProgressUI() {
        let totalDone = 0;
        Object.values(this.systemProgress).forEach(arr => {
            totalDone += arr.filter(v => v).length;
        });
        const totalMissions = 15;
        const percent = Math.round((totalDone / totalMissions) * 100);

        const valText = document.getElementById('globalRestorationPercent');
        const fill = document.getElementById('globalProgressBarFill');
        if (valText) valText.textContent = `${percent}% (${totalDone}/${totalMissions})`;
        if (fill) fill.style.width = `${percent}%`;

        const radarStatus = document.getElementById('radarSystemsStatus');
        if (radarStatus) {
            radarStatus.textContent = totalDone === 15 ? "15 / 15 MASTERED" : `${totalDone}/15 MISSIONS`;
            radarStatus.style.color = totalDone === 15 ? "#059669" : "#0284c7";
        }
    }

    showToast(title, desc) {
        const toast = document.getElementById('reconstructionToast');
        if (!toast) return;
        document.getElementById('toastTitle').textContent = title;
        document.getElementById('toastDesc').textContent = desc;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    // ==========================================================================
    // 8. UI CONTROLS & CAMERA MODE TOGGLES
    // ==========================================================================
    setupUI() {
        document.getElementById('btnSkipIntro')?.addEventListener('click', () => {
            this.skipCutscene();
            this.playClickSound();
        });

        document.getElementById('btnCameraModeToggle')?.addEventListener('click', () => {
            if (this.cameraMode === 'player') {
                this.cameraMode = 'orbit';
                this.controls.enabled = true;
                document.getElementById('camModeIcon').textContent = '🌐';
                document.getElementById('camModeText').textContent = 'FREE ORBIT';
                document.getElementById('btnCameraModeToggle').classList.add('active');
            } else {
                this.cameraMode = 'player';
                this.controls.enabled = false;
                document.getElementById('camModeIcon').textContent = '🎮';
                document.getElementById('camModeText').textContent = 'PLAYER VIEW';
                document.getElementById('btnCameraModeToggle').classList.remove('active');
            }
            this.playClickSound();
        });

        document.getElementById('btnProximityInteract')?.addEventListener('click', () => {
            if (this.activeProximityBeacon) {
                this.openAptitudeMission(this.activeProximityBeacon.sysId, this.activeProximityBeacon.stageNum);
                this.soundSynth.playChime();
            }
        });

        document.querySelectorAll('.dock-node-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const sysId = btn.dataset.system;
                if (sysId === 'orbit') {
                    this.focusFullOrbit();
                } else if (sysId) {
                    this.focusOnSystem(sysId, true);
                }
                this.playClickSound();
            });
        });

        document.getElementById('closeInspectBtn')?.addEventListener('click', () => {
            document.getElementById('systemInspectCard')?.classList.remove('open');
        });

        document.getElementById('btnClosePuzzleModal')?.addEventListener('click', () => {
            this.closeAptitudeMission();
        });

        document.getElementById('btnConfirmReconstruct')?.addEventListener('click', () => {
            this.submitAptitudeAnswer();
        });

        document.getElementById('btnTourMode')?.addEventListener('click', (e) => {
            this.isTourMode = !this.isTourMode;
            e.currentTarget.classList.toggle('active', this.isTourMode);
            if (this.isTourMode) {
                this.cameraMode = 'orbit';
                this.controls.enabled = false;
            }
            this.playClickSound();
        });

        document.getElementById('btnAudioToggle')?.addEventListener('click', () => {
            this.toggleAudio();
        });

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setAtmosphereMood(btn.dataset.mode);
                this.playClickSound();
            });
        });
    }

    focusOnSystem(systemId, animate = true) {
        const sys = OBSERVATORY_SYSTEMS_CONFIG[systemId];
        if (!sys) return;

        this.selectedSystemId = systemId;
        this.isTourMode = false;
        document.getElementById('btnTourMode')?.classList.remove('active');

        document.querySelectorAll('.dock-node-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.system === systemId);
        });

        this.updateInspectionDrawer(sys);

        if (!animate) {
            this.camera.position.set(sys.camPos.x, sys.camPos.y, sys.camPos.z);
            this.controls.target.set(sys.camTarget.x, sys.camTarget.y, sys.camTarget.z);
            this.controls.update();
            return;
        }

        this.camStartPos.copy(this.camera.position);
        this.camEndPos.set(sys.camPos.x, sys.camPos.y, sys.camPos.z);
        this.camStartTarget.copy(this.controls.target);
        this.camEndTarget.set(sys.camTarget.x, sys.camTarget.y, sys.camTarget.z);

        this.camProgress = 0;
        this.isTransitioningCam = true;
    }

    focusFullOrbit() {
        this.isTourMode = false;
        document.getElementById('btnTourMode')?.classList.remove('active');
        document.querySelectorAll('.dock-node-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.dock-node-btn[data-system="orbit"]')?.classList.add('active');

        this.camStartPos.copy(this.camera.position);
        this.camEndPos.set(0, 32, 60);
        this.camStartTarget.copy(this.controls.target);
        this.camEndTarget.set(0, 6, 0);

        this.camProgress = 0;
        this.isTransitioningCam = true;
    }

    updateInspectionDrawer(sys) {
        const drawer = document.getElementById('systemInspectCard');
        if (!drawer) return;

        const progress = this.systemProgress[sys.id];
        const solvedCount = progress.filter(v => v).length;

        document.getElementById('inspectTag').textContent = sys.tag;
        document.getElementById('inspectTitle').textContent = sys.name;
        document.getElementById('stageProgressLabel').textContent = `RECONSTRUCTION: ${solvedCount} / 3 STAGES`;

        ['dotStage1', 'dotStage2', 'dotStage3'].forEach((dotId, idx) => {
            const dot = document.getElementById(dotId);
            if (!dot) return;
            dot.className = 'stage-dot';
            if (progress[idx]) {
                dot.classList.add('completed');
            } else if (idx === solvedCount) {
                dot.classList.add('current');
            }
        });

        const list = document.getElementById('subMissionsList');
        list.innerHTML = '';

        sys.stages.forEach((st, idx) => {
            const isDone = progress[idx];
            const item = document.createElement('div');
            item.className = `sub-mission-item ${isDone ? 'completed' : ''}`;
            item.innerHTML = `
                <div class="sub-mission-info">
                    <span class="sub-mission-tag">POINT ${idx + 1} // ${st.skill.toUpperCase()}</span>
                    <span class="sub-mission-title">${st.title}</span>
                </div>
                <button class="sub-mission-btn ${isDone ? 'done' : ''}" data-stage="${st.stageNum}">
                    ${isDone ? '✓ SOLVED' : 'SOLVE ➔'}
                </button>
            `;

            item.querySelector('button').addEventListener('click', () => {
                this.openAptitudeMission(sys.id, st.stageNum);
                this.playClickSound();
            });

            list.appendChild(item);
        });

        drawer.classList.add('open');
    }

    setAtmosphereMood(mood) {
        if (mood === 'noon') {
            this.scene.background = new THREE.Color(0x38bdf8);
            this.scene.fog.color = new THREE.Color(0x93c5fd);
        } else if (mood === 'dawn') {
            this.scene.background = new THREE.Color(0xfbbf24);
            this.scene.fog.color = new THREE.Color(0xfed7aa);
        } else if (mood === 'aurora') {
            this.scene.background = new THREE.Color(0x0f172a);
            this.scene.fog.color = new THREE.Color(0x064e3b);
        }
    }

    toggleAudio() {
        if (!this.bgAudio) return;
        this.isMuted = !this.isMuted;
        this.bgAudio.muted = this.isMuted;
        if (!this.isMuted && this.bgAudio.paused) {
            this.bgAudio.play().catch(() => {});
        }
        document.getElementById('iconSoundOn').style.display = this.isMuted ? 'none' : 'block';
        document.getElementById('iconSoundOff').style.display = this.isMuted ? 'block' : 'none';
    }

    playClickSound() {
        if (this.soundSynth) this.soundSynth.playUIClick();
        const click = new Audio('assets/audio/click.wav');
        click.volume = 0.4;
        click.play().catch(() => {});
    }

    setupRadarMinimap() {
        const canvas = document.getElementById('radarCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = 112;
        canvas.height = 112;

        this.radarRender = () => {
            ctx.clearRect(0, 0, 112, 112);
            const cx = 56;
            const cy = 56;
            const scale = 0.95;

            ctx.strokeStyle = 'rgba(2, 132, 199, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, 16, 0, Math.PI * 2);
            ctx.arc(cx, cy, 34, 0, Math.PI * 2);
            ctx.arc(cx, cy, 50, 0, Math.PI * 2);
            ctx.stroke();

            const nodes = [
                { id: 'core', x: 0, z: 0 },
                { id: 'lens', x: 30, z: 0 },
                { id: 'flux', x: 0, z: -30 },
                { id: 'prism', x: -30, z: 0 },
                { id: 'cubes', x: 0, z: 30 }
            ];

            nodes.forEach(n => {
                const stages = this.systemProgress[n.id].filter(v => v).length;
                ctx.fillStyle = stages === 3 ? '#10b981' : stages > 0 ? '#f59e0b' : '#ef4444';
                ctx.beginPath();
                ctx.arc(cx + n.x * scale, cy + n.z * scale, 3.5, 0, Math.PI * 2);
                ctx.fill();
            });

            if (this.player) {
                const px = cx + (this.player.group.position.x * scale);
                const pz = cy + (this.player.group.position.z * scale);
                ctx.fillStyle = '#00e5ff';
                ctx.beginPath();
                ctx.arc(px, pz, 4.0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        };
    }

    // ==========================================================================
    // 9. ANIMATION LOOP, COLLISION PHYSICS & DYNAMIC STAIR ELEVATION
    // ==========================================================================
    getSurfaceElevation(x, z) {
        const r = Math.hypot(x, z);

        // 1. Central Rotunda Dais (Core Singularity Platform) & 4 Entry Stairs
        if (r <= 8.5) {
            return 1.6;
        }
        // 4 Rotunda Entry Stairs (connecting dais at r = 8.5 down to bridges at r = 11.0)
        if (Math.abs(z) <= 2.9 && x >= 8.5 && x <= 11.0) {
            const t = (x - 8.5) / 2.5;
            return THREE.MathUtils.lerp(1.6, 0.4, t);
        }
        if (Math.abs(x) <= 2.9 && z <= -8.5 && z >= -11.0) {
            const t = (-z - 8.5) / 2.5;
            return THREE.MathUtils.lerp(1.6, 0.4, t);
        }
        if (Math.abs(z) <= 2.9 && x <= -8.5 && x >= -11.0) {
            const t = (-x - 8.5) / 2.5;
            return THREE.MathUtils.lerp(1.6, 0.4, t);
        }
        if (Math.abs(x) <= 2.9 && z >= 8.5 && z <= 11.0) {
            const t = (z - 8.5) / 2.5;
            return THREE.MathUtils.lerp(1.6, 0.4, t);
        }

        // 2. East Wing (Lens Platform & Forward Bridge Stairs)
        const dLens = Math.hypot(x - 30, z);
        if (dLens <= 11.8 && x >= 18.2) {
            return 1.6;
        }
        if (Math.abs(z) <= 3.1 && x >= 15.4 && x <= 18.2) {
            const t = (x - 15.4) / 2.8;
            return THREE.MathUtils.lerp(0.4, 1.6, t);
        }

        // 3. North Wing (Flux Platform & Forward Bridge Stairs)
        const dFlux = Math.hypot(x, z + 30);
        if (dFlux <= 11.8 && z <= -18.2) {
            return 1.6;
        }
        if (Math.abs(x) <= 3.1 && z <= -15.4 && z >= -18.2) {
            const t = (-z - 15.4) / 2.8;
            return THREE.MathUtils.lerp(0.4, 1.6, t);
        }

        // 4. West Wing (Prism Platform & Forward Bridge Stairs)
        const dPrism = Math.hypot(x + 30, z);
        if (dPrism <= 11.8 && x <= -18.2) {
            return 1.6;
        }
        if (Math.abs(z) <= 3.1 && x <= -15.4 && x >= -18.2) {
            const t = (-x - 15.4) / 2.8;
            return THREE.MathUtils.lerp(0.4, 1.6, t);
        }

        // 5. South Wing (Cubes Platform & Forward Bridge Stairs)
        const dCubes = Math.hypot(x, z - 30);
        if (dCubes <= 11.8 && z >= 18.2) {
            return 1.6;
        }
        if (Math.abs(x) <= 3.1 && z >= 15.4 && z <= 18.2) {
            const t = (z - 15.4) / 2.8;
            return THREE.MathUtils.lerp(0.4, 1.6, t);
        }

        // 6. 4 Long Approach Bridges & Outside Arrival Road
        if ((Math.abs(x) < 4.6 && r <= 52) || (Math.abs(z) < 4.6 && r <= 52)) {
            return 0.4;
        }
        if (Math.abs(x) <= 4.6 && z >= 48.0 && z <= 92.0) {
            return 0.4;
        }

        // 7. Base Island Lawn
        return 0.0;
    }

    updatePlayerMovement(delta, time) {
        if (!this.player) return;
        if (this.isCutsceneActive) return;

        // Camera yaw vectors for camera-relative movement
        const sinYaw = Math.sin(this.camYaw);
        const cosYaw = Math.cos(this.camYaw);

        let moveDirX = 0;
        let moveDirZ = 0;

        // W / Up: Forward in camera view (away from camera, into the scene)
        if (this.keys.forward) {
            moveDirX -= sinYaw;
            moveDirZ -= cosYaw;
        }
        // S / Down: Backward towards camera
        if (this.keys.backward) {
            moveDirX += sinYaw;
            moveDirZ += cosYaw;
        }
        // D / Right: Move Right
        if (this.keys.right) {
            moveDirX += cosYaw;
            moveDirZ -= sinYaw;
        }
        // A / Left: Move Left
        if (this.keys.left) {
            moveDirX -= cosYaw;
            moveDirZ += sinYaw;
        }

        // Virtual Touch Joystick input
        if (Math.abs(this.joystickDelta.x) > 0.1 || Math.abs(this.joystickDelta.y) > 0.1) {
            const joyX = this.joystickDelta.x;
            const joyY = this.joystickDelta.y; // -1 forward, +1 backward
            moveDirX += cosYaw * joyX - sinYaw * joyY;
            moveDirZ += -sinYaw * joyX - cosYaw * joyY;
        }

        const moveLen = Math.hypot(moveDirX, moveDirZ);
        const isMoving = moveLen > 0.1;
        const isSprinting = this.keys.sprint && isMoving;

        if (isMoving && this.cameraMode !== 'player' && !this.isTransitioningCam) {
            this.cameraMode = 'player';
            this.controls.enabled = false;
            document.getElementById('camModeIcon').textContent = '🎮';
            document.getElementById('camModeText').textContent = 'PLAYER VIEW';
            document.getElementById('btnCameraModeToggle')?.classList.remove('active');
        }

        if (isMoving) {
            const normDirX = moveDirX / moveLen;
            const normDirZ = moveDirZ / moveLen;

            const speed = isSprinting ? 13.2 : 7.5;
            const dx = normDirX * speed * delta;
            const dz = normDirZ * speed * delta;

            let nextX = this.player.group.position.x + dx;
            let nextZ = this.player.group.position.z + dz;

            // MULTI-ITERATIVE SOLID OBSTACLE & BOUNDARY RESOLVER
            // Prevents penetrating into the 5 machine cores, 4 guardian altars, or clipping off platforms
            const obstacles = [
                { x: 30, z: 0, r: 3.7 },    // Celestial Lens Core Machinery
                { x: 0, z: -30, r: 3.8 },   // Resonance Flux Tokamak Core
                { x: -30, z: 0, r: 3.7 },   // Harmonic Prism Matrix Emitter
                { x: 0, z: 30, r: 3.7 },    // Chrono Memory Data Cubes
                { x: 0, z: 0, r: 4.2 },     // Central Prediction Singularity Nucleus & Rings
                { x: 22, z: 22, r: 2.8 },   // Nova Guardian Altar
                { x: 22, z: -22, r: 2.8 },  // Byte Guardian Altar
                { x: -22, z: -22, r: 2.8 }, // Echo Guardian Altar
                { x: -22, z: 22, r: 2.8 }   // Blaze Guardian Altar
            ];

            // 3-Pass relaxation ensures zero penetration even at maximum sprinting speed
            for (let iter = 0; iter < 3; iter++) {
                // Obstacle push-back
                for (const obs of obstacles) {
                    const ox = nextX - obs.x;
                    const oz = nextZ - obs.z;
                    const dist = Math.hypot(ox, oz);
                    if (dist < obs.r) {
                        const overlap = obs.r - dist;
                        if (dist > 0.001) {
                            nextX += (ox / dist) * overlap;
                            nextZ += (oz / dist) * overlap;
                        } else {
                            nextX = obs.x + obs.r;
                        }
                    }
                }

                // Wing Platform Perimeter Containment (stay within 11.6m circle or staircase exit)
                // East Wing (Lens)
                const dLens = Math.hypot(nextX - 30, nextZ);
                if (dLens < 13.0 && nextX >= 18.2) {
                    if (dLens > 11.6) {
                        nextX = 30 + ((nextX - 30) / dLens) * 11.6;
                        nextZ = (nextZ / dLens) * 11.6;
                    }
                }
                // North Wing (Flux)
                const dFlux = Math.hypot(nextX, nextZ + 30);
                if (dFlux < 13.0 && nextZ <= -18.2) {
                    if (dFlux > 11.6) {
                        nextX = (nextX / dFlux) * 11.6;
                        nextZ = -30 + ((nextZ + 30) / dFlux) * 11.6;
                    }
                }
                // West Wing (Prism)
                const dPrism = Math.hypot(nextX + 30, nextZ);
                if (dPrism < 13.0 && nextX <= -18.2) {
                    if (dPrism > 11.6) {
                        nextX = -30 + ((nextX + 30) / dPrism) * 11.6;
                        nextZ = (nextZ / dPrism) * 11.6;
                    }
                }
                // South Wing (Cubes)
                const dCubes = Math.hypot(nextX, nextZ - 30);
                if (dCubes < 13.0 && nextZ >= 18.2) {
                    if (dCubes > 11.6) {
                        nextX = (nextX / dCubes) * 11.6;
                        nextZ = 30 + ((nextZ - 30) / dCubes) * 11.6;
                    }
                }

                // Rotunda Dais Boundary (stay within 8.5m circle or 4 open staircase portals)
                const dCore = Math.hypot(nextX, nextZ);
                const isNearRotundaStair = (Math.abs(nextZ) <= 2.9 && Math.abs(nextX) >= 8.0) || (Math.abs(nextX) <= 2.9 && Math.abs(nextZ) >= 8.0);
                if (dCore < 9.5 && dCore > 8.5 && !isNearRotundaStair) {
                    nextX = (nextX / dCore) * 8.5;
                    nextZ = (nextZ / dCore) * 8.5;
                }
            }

            const r = Math.hypot(nextX, nextZ);
            const isOnWingPedestal = (
                Math.hypot(nextX - 30, nextZ) <= 12.0 ||
                Math.hypot(nextX, nextZ + 30) <= 12.0 ||
                Math.hypot(nextX + 30, nextZ) <= 12.0 ||
                Math.hypot(nextX, nextZ - 30) <= 12.0
            );
            const isOnBridge = (Math.abs(nextX) < 4.6 && r <= 52) || (Math.abs(nextZ) < 4.6 && r <= 52);
            const isOnArrivalRoad = Math.abs(nextX) <= 4.6 && nextZ >= 47.0 && nextZ <= 92.0;

            if (r <= 47.0 || isOnBridge || isOnWingPedestal || isOnArrivalRoad) {
                this.player.group.position.x = nextX;
                this.player.group.position.z = nextZ;
            }

            // Smoothly rotate character to face exact movement heading
            const targetRotation = Math.atan2(normDirX, normDirZ);
            let rotDiff = targetRotation - this.playerRotY;
            while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
            while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
            this.playerRotY += rotDiff * Math.min(1.0, delta * 14.0);
            this.player.group.rotation.y = this.playerRotY;

            // AUTO-ALIGN CAMERA BEHIND PLAYER'S BACK WHILE WALKING/RUNNING:
            // Automatically orients camera so the player always sees ahead
            if (!this.isDraggingMouse) {
                const behindBackYaw = this.playerRotY + Math.PI;
                let yawDiff = behindBackYaw - this.targetCamYaw;
                while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
                while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;

                const autoAlignSpeed = isSprinting ? 4.5 : 3.2;
                this.targetCamYaw += yawDiff * Math.min(1.0, delta * autoAlignSpeed);
            }

            if (this.isGrounded && Math.random() < (isSprinting ? 0.25 : 0.16)) {
                this.soundSynth.playFootstep();
            }
        }

        // Dynamic Surface Elevation & Physical Stair Ascent
        const groundElevation = this.getSurfaceElevation(this.player.group.position.x, this.player.group.position.z);

        if (!this.isGrounded) {
            this.playerVelocityY -= 28.0 * delta;
            this.player.group.position.y += this.playerVelocityY * delta;

            if (this.player.group.position.y <= groundElevation) {
                this.player.group.position.y = groundElevation;
                this.playerVelocityY = 0;
                this.isGrounded = true;
                this.soundSynth.playFootstep();
            }
        } else {
            const currentY = this.player.group.position.y;
            const lerpSpeed = isMoving ? 18.0 : 12.0;
            this.player.group.position.y = THREE.MathUtils.lerp(currentY, groundElevation, Math.min(1.0, delta * lerpSpeed));
        }

        this.player.updateAnimation(delta, time, isMoving, isSprinting, !this.isGrounded, this.isGrounded);
    }

    updateRockSolidCamera(delta) {
        if (this.cameraMode !== 'player' || this.isTransitioningCam || this.isTourMode || this.isCutsceneActive) return;

        // Smoothly interpolate camera yaw along shortest arc
        let yawDiff = this.targetCamYaw - this.camYaw;
        while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
        while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
        this.camYaw += yawDiff * Math.min(1.0, delta * 12.0);

        // Smoothly interpolate camera pitch
        this.camPitch = THREE.MathUtils.lerp(this.camPitch, this.targetCamPitch, Math.min(1.0, delta * 15.0));

        const pPos = this.player.group.position;

        // Desired Look-At target (centered at human chest/neck height)
        const targetLookY = pPos.y + 1.45;
        const targetLook = new THREE.Vector3(pPos.x, targetLookY, pPos.z);

        // Frame-rate independent exponential smoothing for camera focus
        const smoothLookFactor = 1.0 - Math.exp(-12.0 * delta);
        this.cameraLookTarget.lerp(targetLook, smoothLookFactor);

        // Desired Camera Position in spherical orbit strictly BEHIND the player
        const horizDist = Math.cos(this.camPitch) * this.camDistance;
        const vertDist = Math.sin(this.camPitch) * this.camDistance;

        const desiredCamX = pPos.x + Math.sin(this.camYaw) * horizDist;
        const desiredCamZ = pPos.z + Math.cos(this.camYaw) * horizDist;
        const desiredCamY = Math.max(1.2, pPos.y + vertDist + 1.2);

        const desiredPos = new THREE.Vector3(desiredCamX, desiredCamY, desiredCamZ);

        // Smooth camera position with spring damping (avoids jerky snapping)
        const smoothPosFactor = 1.0 - Math.exp(-9.5 * delta);
        this.cameraCurrentPos.lerp(desiredPos, smoothPosFactor);

        this.camera.position.copy(this.cameraCurrentPos);
        this.camera.lookAt(this.cameraLookTarget);
    }

    animate() {
        requestAnimationFrame(this.animate);
        const delta = Math.min(this.clock.getDelta(), 0.1);
        const time = this.clock.getElapsedTime();

        // Update Cutscene or Player Movement & Camera
        if (this.isCutsceneActive) {
            this.updateArrivalCutscene(delta, time);
        } else {
            this.updatePlayerMovement(delta, time);
            this.updateRockSolidCamera(delta);
            this.updateProximityDetection();
        }

        // Animate Celestial Mount VFX
        if (this.celestialHorse) {
            this.celestialHorse.update(delta, time);
        }

        // Animate Beacons Bobbing & Rotation
        this.beaconMeshes.forEach((b, idx) => {
            b.orb.position.y = Math.sin(time * 2.5 + idx) * 0.25;
            b.ring.rotation.z += 0.02;
            b.beam.rotation.y += 0.01;
        });

        // Hover floating 3D holographic system nameplates
        Object.values(this.meshGroups).forEach((mg, idx) => {
            if (mg && mg.nameplate && mg.nameplate.sprite) {
                mg.nameplate.sprite.position.y = mg.nameplate.baseY + Math.sin(time * 2.0 + idx * 1.3) * 0.22;
            }
        });

        // Rotate Restored Components
        if (this.systemProgress.core[2] && this.meshGroups.core) {
            this.meshGroups.core.rings.forEach((r, i) => {
                r.rotation.x += 0.012 * (i + 1);
                r.rotation.y += 0.016;
            });
            if (this.meshGroups.core.crystal) {
                this.meshGroups.core.crystal.rotation.y += 0.02;
                this.meshGroups.core.crystal.position.y = Math.sin(time * 2) * 0.25;
            }
        }

        if (this.systemProgress.lens[1] && this.meshGroups.lens) {
            if (this.meshGroups.lens.ring) this.meshGroups.lens.ring.rotation.z += 0.015;
            if (this.meshGroups.lens.innerRing) this.meshGroups.lens.innerRing.rotation.x += 0.02;
        }

        if (this.systemProgress.flux[2] && this.meshGroups.flux) {
            if (this.meshGroups.flux.fluxRing) this.meshGroups.flux.fluxRing.rotation.z += 0.02;
            if (this.meshGroups.flux.fluxCore) this.meshGroups.flux.fluxCore.rotation.y += 0.015;
        }

        if (this.meshGroups.cubes && this.meshGroups.cubes.cubes) {
            this.meshGroups.cubes.cubes.forEach((c, idx) => {
                if (this.systemProgress.cubes[0]) {
                    c.mesh.position.y = c.targetPos.y + Math.sin(time * 2.2 + idx * 1.4) * 0.25;
                }
                if (c.orbitRing1) c.orbitRing1.rotation.z += 0.02;
                if (c.orbitRing2) c.orbitRing2.rotation.x += 0.025;
            });
        }

        this.animatables.runicRings.forEach(r => {
            r.mesh.rotation.z += r.speed * 0.05;
        });

        this.animatables.clouds.forEach((c, idx) => {
            c.rotation.y += 0.001 * (idx % 2 === 0 ? 1 : -1);
        });

        if (this.animatables.stardustParticles) {
            this.animatables.stardustParticles.rotation.y = time * 0.02;
        }

        // Camera Transition Interpolation (when clicking dock buttons)
        if (this.isTransitioningCam) {
            this.camProgress += delta / this.camDuration;
            if (this.camProgress >= 1) {
                this.camProgress = 1;
                this.isTransitioningCam = false;
            }
            const ease = this.camProgress * this.camProgress * (3 - 2 * this.camProgress);
            this.camera.position.lerpVectors(this.camStartPos, this.camEndPos, ease);
            this.controls.target.lerpVectors(this.camStartTarget, this.camEndTarget, ease);
            this.controls.update();
        }

        // Auto Tour Camera
        if (this.isTourMode && !this.isTransitioningCam) {
            this.tourAngle += delta * 0.18;
            this.camera.position.x = Math.cos(this.tourAngle) * 58;
            this.camera.position.z = Math.sin(this.tourAngle) * 58;
            this.camera.position.y = 24 + Math.sin(this.tourAngle * 2) * 4;
            this.controls.target.set(0, 6, 0);
            this.controls.update();
        } else if (this.cameraMode === 'orbit') {
            this.controls.update();
        }

        // Radar Minimap Update
        if (this.radarRender) {
            this.radarRender();
        }

        this.renderer.render(this.scene, this.camera);
    }
}

function initObservatory() {
    if (!window.observatoryApp) {
        window.observatoryApp = new PatternObservatoryApp();
    }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initObservatory, 1);
} else {
    window.addEventListener('DOMContentLoaded', initObservatory);
    window.addEventListener('load', initObservatory);
}
