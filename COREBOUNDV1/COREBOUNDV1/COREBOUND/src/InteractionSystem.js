/**
 * ============================================================================
 * COREBOUND — INTERACTION SYSTEM & ANCIENT MECHANISM
 * ============================================================================
 * Proximity detection, 3D Ancient Mechanism construct, activation VFX,
 * energy pulse waves, Web Audio feedback, and the Pattern Lens Offline modal.
 */

import * as THREE from 'three';

export class InteractionSystem {
    constructor(scene, playerController, options = {}) {
        this.scene = scene;
        this.player = playerController;
        this.options = Object.assign({
            interactionRadius: 3.6,
            mechanismPos: new THREE.Vector3(0, 0, -7.5)
        }, options);

        this.isActivated = false;
        this.isNear = false;
        this.pulseTime = 0;

        this.buildMechanism3D();
        this.buildEnergyPulseVFX();
        this.createHUD();
        this.initAudio();
    }

    initAudio() {
        this.audioCtx = null;
    }

    ensureAudio() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) this.audioCtx = new AudioContext();
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playActivationChime() {
        this.ensureAudio();
        if (!this.audioCtx) return;

        const now = this.audioCtx.currentTime;
        const freqs = [330, 440, 554, 659, 880];
        freqs.forEach((f, idx) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + idx * 0.08);
            gain.gain.setValueAtTime(0.09, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.6);
        });
    }

    // =========================================================================
    // 1. ANCIENT COREBOUND MECHANISM 3D CONSTRUCT
    // =========================================================================
    buildMechanism3D() {
        this.mechanismGroup = new THREE.Group();
        this.mechanismGroup.position.copy(this.options.mechanismPos);

        // Materials
        this.stoneMat = new THREE.MeshStandardMaterial({
            color: 0x1e1e24,
            roughness: 0.85,
            metalness: 0.2
        });

        this.brassMat = new THREE.MeshStandardMaterial({
            color: 0xd97706,
            roughness: 0.25,
            metalness: 0.9
        });

        this.silverMat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            roughness: 0.2,
            metalness: 0.92
        });

        this.crystalMat = new THREE.MeshPhysicalMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            emissiveIntensity: 0.4,
            roughness: 0.1,
            metalness: 0.1,
            transmission: 0.7
        });

        this.activeGlowMat = new THREE.MeshStandardMaterial({
            color: 0x00e5ff,
            emissive: 0x00e5ff,
            emissiveIntensity: 3.2,
            roughness: 0.1
        });

        // 1. Octagonal Stone Plinth Base
        const baseGeo = new THREE.CylinderGeometry(1.6, 1.9, 0.45, 8);
        const baseMesh = new THREE.Mesh(baseGeo, this.stoneMat);
        baseMesh.position.y = 0.225;
        baseMesh.castShadow = true;
        baseMesh.receiveShadow = true;
        this.mechanismGroup.add(baseMesh);

        // Runic Base Ring
        this.runicRing = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.035, 8, 32), this.brassMat);
        this.runicRing.rotation.x = Math.PI / 2;
        this.runicRing.position.y = 0.46;
        this.mechanismGroup.add(this.runicRing);

        // 2. Three Curved Support Arches
        for (let i = 0; i < 3; i++) {
            const ang = (i / 3) * Math.PI * 2;
            const arch = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.06, 8, 24, Math.PI), this.silverMat);
            arch.position.set(Math.cos(ang) * 0.75, 1.1, Math.sin(ang) * 0.75);
            arch.rotation.y = ang + Math.PI / 2;
            arch.rotation.z = Math.PI / 2;
            this.mechanismGroup.add(arch);
        }

        // 3. Dual Rotating Gimbal Rings
        this.gimbalOuter = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.028, 8, 32), this.brassMat);
        this.gimbalOuter.position.y = 1.6;
        this.mechanismGroup.add(this.gimbalOuter);

        this.gimbalInner = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.022, 8, 24), this.silverMat);
        this.gimbalInner.position.y = 1.6;
        this.mechanismGroup.add(this.gimbalInner);

        // 4. Floating Celestial Crystal Lens Core
        this.crystalCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 1), this.crystalMat);
        this.crystalCore.position.y = 1.6;
        this.mechanismGroup.add(this.crystalCore);

        // Ambient Point Light
        this.coreLight = new THREE.PointLight(0x0284c7, 1.2, 8);
        this.coreLight.position.y = 1.6;
        this.mechanismGroup.add(this.coreLight);

        // 5. Floating Holographic Indicator Ring
        const holoGeo = new THREE.RingGeometry(1.8, 1.95, 32);
        this.holoRing = new THREE.Mesh(holoGeo, new THREE.MeshBasicMaterial({
            color: 0x00e5ff,
            transparent: true,
            opacity: 0.35,
            side: THREE.DoubleSide
        }));
        this.holoRing.rotation.x = -Math.PI / 2;
        this.holoRing.position.y = 0.05;
        this.mechanismGroup.add(this.holoRing);

        this.scene.add(this.mechanismGroup);
    }

    // =========================================================================
    // 2. ENERGY PULSE WAVE VFX
    // =========================================================================
    buildEnergyPulseVFX() {
        const pulseGeo = new THREE.RingGeometry(0.2, 0.45, 32);
        this.pulseMat = new THREE.MeshBasicMaterial({
            color: 0x00e5ff,
            transparent: true,
            opacity: 0.0,
            side: THREE.DoubleSide
        });
        this.pulseWave = new THREE.Mesh(pulseGeo, this.pulseMat);
        this.pulseWave.rotation.x = -Math.PI / 2;
        this.pulseWave.position.copy(this.options.mechanismPos);
        this.pulseWave.position.y = 0.08;
        this.scene.add(this.pulseWave);
    }

    // =========================================================================
    // 3. HUD PROMPT & PATTERN LENS MODAL
    // =========================================================================
    createHUD() {
        // Proximity Prompt
        this.promptElem = document.createElement('div');
        this.promptElem.id = 'mechanismProximityPrompt';
        this.promptElem.className = 'mechanism-prompt-hud hidden';
        this.promptElem.innerHTML = `
            <div class="prompt-key-badge">E</div>
            <div class="prompt-info">
                <span class="prompt-title">INTERACT</span>
                <span class="prompt-sub">ANCIENT COREBOUND MECHANISM</span>
            </div>
        `;
        document.body.appendChild(this.promptElem);

        // Offline Notification Modal
        this.modalElem = document.createElement('div');
        this.modalElem.id = 'patternLensOfflineModal';
        this.modalElem.className = 'pattern-lens-modal hidden';
        this.modalElem.innerHTML = `
            <div class="modal-glass-card">
                <div class="modal-header">
                    <span class="modal-tag">CELESTIAL RECONSTRUCTION PROTOCOL</span>
                    <button class="modal-close-btn" id="btnDismissModal">✕</button>
                </div>
                <div class="modal-body">
                    <div class="modal-icon-hex">🔮</div>
                    <h2 class="modal-title">PATTERN LENS</h2>
                    <div class="modal-status-badge offline">SYSTEM OFFLINE</div>
                    <p class="modal-desc">
                        The ancient harmonic focal matrix has fractured across 3 resonance nodes.
                        Awaiting celestial guardian sequence to recalibrate the observation prisms.
                    </p>
                    <div class="modal-stat-row">
                        <div class="modal-stat"><span class="lbl">MATRIX HARMONY</span><span class="val">0.00%</span></div>
                        <div class="modal-stat"><span class="lbl">SECTOR</span><span class="val">OBSERVATORY</span></div>
                        <div class="modal-stat"><span class="lbl">POWER GRID</span><span class="val">DORMANT</span></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn-confirm" id="btnAckOffline">ACKNOWLEDGE ➔</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.modalElem);

        // Modal dismissal
        const closeFunc = () => {
            this.modalElem.classList.add('hidden');
            this.player.isLocked = false;
        };
        document.getElementById('btnDismissModal')?.addEventListener('click', closeFunc);
        document.getElementById('btnAckOffline')?.addEventListener('click', closeFunc);
    }

    // =========================================================================
    // 4. ACTIVATION SEQUENCE
    // =========================================================================
    triggerActivation() {
        if (this.isActivated) return;
        this.isActivated = true;

        this.playActivationChime();

        // Trigger character interaction animation & lock movement
        this.player.triggerInteract(1.8, () => {
            this.modalElem.classList.remove('hidden');
        });

        // Power up mechanism materials
        this.crystalMat.emissive.setHex(0x00e5ff);
        this.crystalMat.emissiveIntensity = 3.5;
        this.coreLight.color.setHex(0x00e5ff);
        this.coreLight.intensity = 4.5;
        this.holoRing.material.opacity = 0.85;

        // Trigger expanding energy pulse wave
        this.pulseTime = 1.6;
    }

    // =========================================================================
    // 5. UPDATE LOOP
    // =========================================================================
    update(delta, time) {
        if (!delta || delta > 0.1) delta = 0.016;

        // 1. Idle Gimbal & Crystal Floating Animations
        if (this.gimbalOuter) {
            const speed = this.isActivated ? 4.5 : 0.8;
            this.gimbalOuter.rotation.x += delta * speed;
            this.gimbalOuter.rotation.y += delta * (speed * 0.6);
        }
        if (this.gimbalInner) {
            const speed = this.isActivated ? -5.5 : -1.1;
            this.gimbalInner.rotation.y += delta * speed;
            this.gimbalInner.rotation.z += delta * (speed * 0.7);
        }
        if (this.crystalCore) {
            const hover = Math.sin(time * 2.5) * 0.06;
            this.crystalCore.position.y = 1.6 + hover;
            this.crystalCore.rotation.y += delta * (this.isActivated ? 3.0 : 1.2);
            this.crystalCore.rotation.x = Math.sin(time * 1.5) * 0.15;
        }
        if (this.runicRing) {
            this.runicRing.rotation.z += delta * (this.isActivated ? 1.5 : 0.2);
        }

        // 2. Energy Pulse Wave Expansion
        if (this.pulseTime > 0) {
            this.pulseTime -= delta;
            const progress = (1.6 - this.pulseTime) / 1.6;
            this.pulseWave.scale.setScalar(1.0 + progress * 16.0);
            this.pulseMat.opacity = Math.max(0, (1.0 - progress) * 0.8);
        }

        // 3. Proximity Distance Check
        const playerPos = this.player.position;
        const dist = playerPos.distanceTo(this.options.mechanismPos);
        const wasNear = this.isNear;
        this.isNear = dist <= this.options.interactionRadius;

        if (this.isNear) {
            this.promptElem.classList.remove('hidden');

            // Listen for E key press
            if (this.player.keys.interact && !this.player.isLocked && !this.isActivated) {
                this.triggerActivation();
            }
        } else {
            this.promptElem.classList.add('hidden');
        }
    }
}
