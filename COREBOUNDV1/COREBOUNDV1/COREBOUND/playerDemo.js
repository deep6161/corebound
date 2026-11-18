/**
 * ============================================================================
 * COREBOUND — 3D PLAYER DEMO APPLICATION CONTROLLER
 * ============================================================================
 * Standalone playable 3D character test environment.
 * Integrates GuardianCharacter, PlayerController, ThirdPersonCamera,
 * and InteractionSystem with the test sci-fi ruins environment.
 */

import { GuardianCharacter } from './src/GuardianCharacter.js';
import { PlayerController } from './src/PlayerController.js';
import { ThirdPersonCamera } from './src/ThirdPersonCamera.js';
import { InteractionSystem } from './src/InteractionSystem.js';

class PlayerDemoApp {
    constructor() {
        this.container = document.getElementById('webgl-canvas');
        this.clock = new THREE.Clock();

        this.initScene();
        this.initLighting();
        this.buildTestEnvironment();
        this.buildPlayerAndSystems();
        this.bindWindowResize();

        // Start render loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    // =========================================================================
    // 1. SCENE SETUP & RENDERER
    // =========================================================================
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x090d16);
        this.scene.fog = new THREE.FogExp2(0x090d16, 0.015);

        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
        this.camera.position.set(0, 6, 20);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.container,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.25;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    // =========================================================================
    // 2. LIGHTING (ATMOSPHERIC SCI-FI FANTASY)
    // =========================================================================
    initLighting() {
        // Main Celestial Key Light with Soft PCF Shadows
        const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.2);
        keyLight.position.set(25, 45, 25);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 120;
        keyLight.shadow.camera.left = -35;
        keyLight.shadow.camera.right = 35;
        keyLight.shadow.camera.top = 35;
        keyLight.shadow.camera.bottom = -35;
        keyLight.shadow.bias = -0.0003;
        this.scene.add(keyLight);

        // Ambient Fill
        const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e1b4b, 0.7);
        hemiLight.position.set(0, 40, 0);
        this.scene.add(hemiLight);

        const ambientLight = new THREE.AmbientLight(0x0f172a, 0.6);
        this.scene.add(ambientLight);

        // Violet & Cyan Rim Lights for AAA Edge Highlights
        const cyanRim = new THREE.PointLight(0x00e5ff, 2.0, 30);
        cyanRim.position.set(-18, 8, -12);
        this.scene.add(cyanRim);

        const purpleRim = new THREE.PointLight(0xa855f7, 2.4, 30);
        purpleRim.position.set(18, 8, 12);
        this.scene.add(purpleRim);
    }

    // =========================================================================
    // 3. DEMO TEST ENVIRONMENT (DARK STONE RUINS & PLATFORMS)
    // =========================================================================
    buildTestEnvironment() {
        // Materials
        const darkStoneMat = new THREE.MeshStandardMaterial({
            color: 0x131722,
            roughness: 0.85,
            metalness: 0.2
        });

        const stonePillarMat = new THREE.MeshStandardMaterial({
            color: 0x1e2230,
            roughness: 0.75,
            metalness: 0.3
        });

        const brassFiligreeMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            roughness: 0.25,
            metalness: 0.95
        });

        const cyanRuneMat = new THREE.MeshStandardMaterial({
            color: 0x00e5ff,
            emissive: 0x00e5ff,
            emissiveIntensity: 2.2,
            roughness: 0.1
        });

        // 1. Main Circular Stone Terrace
        const terraceGeo = new THREE.CylinderGeometry(44, 46, 2.0, 48);
        const terrace = new THREE.Mesh(terraceGeo, darkStoneMat);
        terrace.position.y = -1.0;
        terrace.receiveShadow = true;
        this.scene.add(terrace);

        // Concentric Runic Inlays
        [12, 24, 36].forEach(radius => {
            const ringGeo = new THREE.TorusGeometry(radius, 0.04, 8, 48);
            const ring = new THREE.Mesh(ringGeo, brassFiligreeMat);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = 0.02;
            this.scene.add(ring);
        });

        // 2. Stepped Test Platforms (For jumping & ground collision tests)
        const step1 = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 6.0, 0.8, 16), stonePillarMat);
        step1.position.set(16, 0.4, 0);
        step1.castShadow = true;
        step1.receiveShadow = true;
        this.scene.add(step1);

        const step2 = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 4.2, 0.8, 16), stonePillarMat);
        step2.position.set(16, 1.2, 0);
        step2.castShadow = true;
        step2.receiveShadow = true;
        this.scene.add(step2);

        // 3. Sci-Fi Ruin Pillars & Floating Monoliths around perimeter
        for (let i = 0; i < 8; i++) {
            const ang = (i / 8) * Math.PI * 2;
            const dist = 34 + (i % 2) * 4;
            const height = 8 + (i % 3) * 3;

            const pillar = new THREE.Mesh(new THREE.BoxGeometry(2.2, height, 2.2), stonePillarMat);
            pillar.position.set(Math.cos(ang) * dist, height / 2, Math.sin(ang) * dist);
            pillar.castShadow = true;
            pillar.receiveShadow = true;
            this.scene.add(pillar);

            // Glowing vertical rune slot
            const runeSlot = new THREE.Mesh(new THREE.BoxGeometry(0.15, height * 0.7, 0.15), cyanRuneMat);
            runeSlot.position.set(Math.cos(ang) * (dist - 1.05), height / 2, Math.sin(ang) * (dist - 1.05));
            this.scene.add(runeSlot);
        }

        // 4. Ambient Stardust Particles
        const stardustGeo = new THREE.BufferGeometry();
        const pCount = 180;
        const pPos = new Float32Array(pCount * 3);
        for (let j = 0; j < pCount; j++) {
            const a = Math.random() * Math.PI * 2;
            const d = Math.random() * 40;
            pPos[j * 3] = Math.cos(a) * d;
            pPos[j * 3 + 1] = 0.5 + Math.random() * 8.0;
            pPos[j * 3 + 2] = Math.sin(a) * d;
        }
        stardustGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({
            color: 0xc084fc,
            size: 0.05,
            transparent: true,
            opacity: 0.65,
            blending: THREE.AdditiveBlending
        });
        this.stardust = new THREE.Points(stardustGeo, pMat);
        this.scene.add(this.stardust);
    }

    // =========================================================================
    // 4. PLAYER, CONTROLLER, CAMERA & INTERACTION SYSTEM
    // =========================================================================
    buildPlayerAndSystems() {
        // 1. Instantiate 3D Guardian Character Model
        this.guardian = new GuardianCharacter(this.scene, {
            showNameplate: true,
            nameplateText: 'GUARDIAN'
        });

        // 2. Instantiate Kinematic Player Controller
        this.controller = new PlayerController(this.guardian, {
            walkSpeed: 7.5,
            runSpeed: 10.8,
            sprintSpeed: 14.2,
            acceleration: 34.0,
            deceleration: 26.0,
            gravity: 28.0,
            jumpImpulse: 11.2,
            groundY: 0.0
        });

        // Setup custom elevation resolver for stepped platforms
        this.controller.groundHeightResolver = (x, z) => {
            const distToStep = Math.hypot(x - 16, z - 0);
            if (distToStep < 3.8) return 1.6;
            if (distToStep < 5.5) return 0.8;
            return 0.0;
        };

        // Set initial player spawn position (8m from origin)
        this.guardian.group.position.set(0, 0, 8);
        this.guardian.group.rotation.y = Math.PI; // Face towards ancient mechanism at (0, 0, -7.5)

        // 3. Instantiate Third-Person Spring-Arm Camera
        this.thirdPersonCam = new ThirdPersonCamera(this.camera, this.guardian.group, {
            distance: 9.5,
            heightOffset: 1.45,
            pitch: 0.28,
            autoAlignSpeed: 3.6
        });

        // 4. Instantiate Interaction System with Ancient Mechanism at (0, 0, -7.5)
        this.interactionSystem = new InteractionSystem(this.scene, this.controller, {
            interactionRadius: 3.8,
            mechanismPos: new THREE.Vector3(0, 0, -7.5)
        });

        // UI state binding
        this.uiStateVal = document.getElementById('debugAnimState');
        this.uiSpeedVal = document.getElementById('debugSpeed');
        this.uiGroundedVal = document.getElementById('debugGrounded');
    }

    bindWindowResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // =========================================================================
    // 5. MAIN RENDER & SIMULATION LOOP
    // =========================================================================
    animate() {
        requestAnimationFrame(this.animate);

        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        // 1. Update Player Movement Physics & Kinematics
        this.controller.update(delta, time, this.thirdPersonCam.yaw);

        // 2. Update Third-Person Camera with smooth follow & auto-alignment
        const isMoving = this.controller.currentSpeed > 0.1;
        this.thirdPersonCam.update(delta, this.controller.rotationY, isMoving);

        // 3. Update Interaction System (Mechanism rotation, proximity checks, pulse VFX)
        this.interactionSystem.update(delta, time);

        // 4. Update Stardust Particle Float
        if (this.stardust) {
            this.stardust.rotation.y = time * 0.02;
        }

        // 5. Update Real-time Debug HUD
        if (this.uiStateVal) {
            this.uiStateVal.textContent = this.controller.currentState;
            this.uiSpeedVal.textContent = `${this.controller.currentSpeed.toFixed(1)} m/s`;
            this.uiGroundedVal.textContent = this.controller.isGrounded ? 'YES' : 'AIRBORNE';
        }

        // 6. Render Scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
    new PlayerDemoApp();
});
