/**
 * ============================================================================
 * COREBOUND — CELESTIAL HORSE (3D EQUINE PROCEDURAL MODEL & KINEMATICS)
 * ============================================================================
 * High-fidelity 3D procedural steed for the Guardian's arrival cutscene.
 * Features:
 * - Pristine white/silver pearl coat with gold-trimmed armor barding
 * - Ethereal luminous cyan mane and flowing dual-tail with aerodynamic wind physics
 * - Chamfron headplate, peytral chest plate, royal velvet saddle, and leather reins
 * - 4-leg articulated kinematics (gallop, trot, halt, rear, idle)
 * - Stardust particle dissolve VFX for cinematic arrival handoff
 */

import * as THREE from 'three';

export class CelestialHorse {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.group.name = "CelestialHorseRoot";

        this.gallopCycle = 0;
        this.breathTime = 0;
        this.state = 'IDLE'; // 'GALLOP', 'TROT', 'HALT', 'REAR', 'IDLE', 'DISSOLVING'
        this.kinematicSpeed = 1.0;
        this.dissolveProgress = 0;
        this.isDissolving = false;

        this.initMaterials();
        this.buildModel();
        this.buildDissolveVFX();

        this.scene.add(this.group);
    }

    initMaterials() {
        // Celestial Pearl White Coat
        this.coatMat = new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            roughness: 0.38,
            metalness: 0.12
        });

        // Muzzle & Soft Skin
        this.muzzleMat = new THREE.MeshStandardMaterial({
            color: 0x334155,
            roughness: 0.60
        });

        // Ancient Inlaid Gold Barding & Armor
        this.goldArmorMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.92,
            roughness: 0.18,
            envMapIntensity: 1.3
        });

        // Dark Obsidian Steel
        this.darkSteelMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            metalness: 0.85,
            roughness: 0.28
        });

        // Royal Purple Velvet Saddle & Flanks
        this.saddleVelvetMat = new THREE.MeshStandardMaterial({
            color: 0x4c1d95,
            roughness: 0.55,
            side: THREE.DoubleSide
        });

        // Leather Bridle & Stirrup Straps
        this.leatherMat = new THREE.MeshStandardMaterial({
            color: 0x271911,
            roughness: 0.75
        });

        // Ethereal Glowing Cyan Mane & Tail
        this.etherealManeMat = new THREE.MeshStandardMaterial({
            color: 0x00f0ff,
            emissive: 0x0284c7,
            emissiveIntensity: 1.2,
            roughness: 0.15,
            transparent: true,
            opacity: 0.92
        });

        // Violet Gem Eyes
        this.eyeGemMat = new THREE.MeshBasicMaterial({ color: 0xc084fc });

        // Hooves
        this.hoofMat = new THREE.MeshStandardMaterial({
            color: 0xd97706,
            metalness: 0.9,
            roughness: 0.2
        });
    }

    buildModel() {
        // Main Body Root (positioned so hooves touch ground y = 0)
        this.bodyGroup = new THREE.Group();
        this.bodyGroup.position.set(0, 1.45, 0);

        // 1. Torso / Barrel & Muscular Flanks
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.44, 1.65, 16), this.coatMat);
        barrel.rotation.x = Math.PI / 2;
        barrel.castShadow = true;
        this.bodyGroup.add(barrel);

        // Muscular Chest / Withers
        const chest = new THREE.Mesh(new THREE.SphereGeometry(0.52, 16, 16), this.coatMat);
        chest.position.set(0, 0.08, -0.65);
        chest.scale.set(0.9, 1.05, 1.1);
        chest.castShadow = true;
        this.bodyGroup.add(chest);

        // Croup / Haunches (Back Hip)
        const croup = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16), this.coatMat);
        croup.position.set(0, 0.04, 0.65);
        croup.scale.set(0.9, 1.02, 1.05);
        croup.castShadow = true;
        this.bodyGroup.add(croup);

        // Peytral Armor (Gold Chestplate)
        const peytral = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.52, 0.5, 12, 1, false, 0, Math.PI), this.goldArmorMat);
        peytral.rotation.y = Math.PI / 2;
        peytral.position.set(0, -0.05, -0.75);
        this.bodyGroup.add(peytral);

        const peytralGem = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.12, 6), this.etherealManeMat);
        peytralGem.rotation.x = -Math.PI / 2;
        peytralGem.position.set(0, 0.0, -1.02);
        this.bodyGroup.add(peytralGem);

        // 2. Arched Equine Neck & Mane
        this.neck = new THREE.Group();
        this.neck.position.set(0, 0.28, -0.72);
        this.neck.rotation.x = 0.65; // Arched forward-upward

        const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.38, 0.95, 12), this.coatMat);
        neckMesh.position.set(0, 0.42, -0.08);
        neckMesh.rotation.x = -0.32;
        neckMesh.scale.set(0.75, 1.0, 1.15);
        neckMesh.castShadow = true;
        this.neck.add(neckMesh);

        // Gold Neck Gorget Plates
        const gorget = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.36, 0.45, 12), this.goldArmorMat);
        gorget.position.set(0, 0.35, -0.08);
        gorget.rotation.x = -0.32;
        this.neck.add(gorget);

        // 3. Sculpted Equine Head
        this.head = new THREE.Group();
        this.head.position.set(0, 0.85, -0.26);
        this.head.rotation.x = -0.72; // Crest angle

        const skull = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.32, 0.45), this.coatMat);
        skull.position.set(0, 0.05, -0.15);
        skull.castShadow = true;
        this.head.add(skull);

        const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.38, 10), this.muzzleMat);
        muzzle.position.set(0, -0.04, -0.38);
        muzzle.rotation.x = Math.PI / 2.8;
        muzzle.castShadow = true;
        this.head.add(muzzle);

        // Nostrils
        [-0.07, 0.07].forEach(nx => {
            const nostril = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), this.darkSteelMat);
            nostril.position.set(nx, -0.02, -0.56);
            this.head.add(nostril);
        });

        // Alert Pointed Ears
        [-0.10, 0.10].forEach(ex => {
            const ear = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.18, 5), this.coatMat);
            ear.position.set(ex, 0.24, -0.05);
            ear.rotation.set(-0.25, ex > 0 ? -0.18 : 0.18, ex > 0 ? -0.15 : 0.15);
            ear.castShadow = true;
            this.head.add(ear);
        });

        // Chamfron (Gold Forehead Armor Plate)
        const chamfron = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.42), this.goldArmorMat);
        chamfron.position.set(0, 0.18, -0.22);
        chamfron.rotation.x = -0.12;
        this.head.add(chamfron);

        const headGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.06), this.etherealManeMat);
        headGem.position.set(0, 0.23, -0.18);
        this.head.add(headGem);

        // Glowing Violet Star Eyes
        [-0.15, 0.15].forEach(eyeX => {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), this.eyeGemMat);
            eye.position.set(eyeX, 0.10, -0.12);
            this.head.add(eye);
        });

        this.neck.add(this.head);

        // Ethereal Flowing Cyan Mane Locks along Neck Crest
        this.maneGroup = new THREE.Group();
        this.maneGroup.position.set(0, 0.45, 0.14);
        for (let i = 0; i < 6; i++) {
            const maneLock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.28), this.etherealManeMat);
            maneLock.position.set(0, (i - 2.5) * 0.12, (i - 2.5) * 0.04);
            maneLock.rotation.set(0.35 + i * 0.05, 0, (i % 2 === 0 ? 0.15 : -0.15));
            this.maneGroup.add(maneLock);
        }
        this.neck.add(this.maneGroup);

        this.bodyGroup.add(this.neck);

        // 4. Velvet Saddle, Fluted Cantle & Stirrups
        this.saddleGroup = new THREE.Group();
        this.saddleGroup.position.set(0, 0.32, -0.05);

        // Royal Purple Saddle Cloth
        const saddlePad = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.95), this.saddleVelvetMat);
        saddlePad.position.y = 0.02;
        this.saddleGroup.add(saddlePad);

        const saddlePadTrim = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.02, 0.98), this.goldArmorMat);
        this.saddleGroup.add(saddlePadTrim);

        // Leather Seat with High Gold Cantle & Pommel
        const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.65, 12), this.leatherMat);
        seat.rotation.x = Math.PI / 2;
        seat.position.set(0, 0.08, 0);
        this.saddleGroup.add(seat);

        // Pommel (Front) & Cantle (Back)
        const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), this.goldArmorMat);
        pommel.position.set(0, 0.22, -0.32);
        this.saddleGroup.add(pommel);

        const cantle = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.12), this.goldArmorMat);
        cantle.position.set(0, 0.22, 0.28);
        this.saddleGroup.add(cantle);

        // Stirrup Straps and Gold Stirrup Irons
        [-0.38, 0.38].forEach(sx => {
            const strap = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.65, 0.04), this.leatherMat);
            strap.position.set(sx, -0.30, 0.02);
            this.saddleGroup.add(strap);

            const stirrup = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.018, 8, 16), this.goldArmorMat);
            stirrup.position.set(sx, -0.62, 0.02);
            stirrup.rotation.y = Math.PI / 2;
            this.saddleGroup.add(stirrup);
        });

        // Reins connecting from bit to saddle
        [-0.14, 0.14].forEach(rx => {
            const rein = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.25, 6), this.leatherMat);
            rein.position.set(rx, 0.45, -0.55);
            rein.rotation.x = Math.PI / 3.8;
            this.bodyGroup.add(rein);
        });

        this.bodyGroup.add(this.saddleGroup);

        // 5. Ethereal Flowing Cyan Tail
        this.tailGroup = new THREE.Group();
        this.tailGroup.position.set(0, 0.22, 0.82);

        for (let i = 0; i < 4; i++) {
            const tailPlume = new THREE.Mesh(new THREE.ConeGeometry(0.12 - i * 0.02, 0.85 + i * 0.25, 8), this.etherealManeMat);
            tailPlume.position.set((i % 2 === 0 ? 0.05 : -0.05), -0.45 - i * 0.15, 0.15 + i * 0.08);
            tailPlume.rotation.x = Math.PI + 0.35 + i * 0.1;
            this.tailGroup.add(tailPlume);
        }
        this.bodyGroup.add(this.tailGroup);

        // 6. 4 Articulated Legs
        // Front Left & Right Legs
        this.frontLeftLeg = this.createHorseLeg(-0.32, -0.52, true);
        this.frontRightLeg = this.createHorseLeg(0.32, -0.52, true);
        this.bodyGroup.add(this.frontLeftLeg.root);
        this.bodyGroup.add(this.frontRightLeg.root);

        // Hind Left & Right Legs
        this.hindLeftLeg = this.createHorseLeg(-0.32, 0.58, false);
        this.hindRightLeg = this.createHorseLeg(0.32, 0.58, false);
        this.bodyGroup.add(this.hindLeftLeg.root);
        this.bodyGroup.add(this.hindRightLeg.root);

        this.group.add(this.bodyGroup);

        // Mount Anchor Position (Exact coordinate where Guardian character sits)
        this.mountAnchor = new THREE.Vector3(0, 1.85, -0.05);
    }

    createHorseLeg(xOffset, zOffset, isFront) {
        const root = new THREE.Group();
        root.position.set(xOffset, -0.05, zOffset);

        // Upper Leg / Shoulder or Flank
        const upperGeo = new THREE.CylinderGeometry(isFront ? 0.14 : 0.18, 0.10, 0.65, 10);
        const upper = new THREE.Mesh(upperGeo, this.coatMat);
        upper.position.set(0, -0.30, 0);
        upper.castShadow = true;
        root.add(upper);

        // Gold Upper Armor Plate
        const legArmor = new THREE.Mesh(new THREE.CylinderGeometry(isFront ? 0.15 : 0.19, 0.11, 0.32, 10), this.goldArmorMat);
        legArmor.position.set(0, -0.18, 0);
        root.add(legArmor);

        // Knee / Hock Joint
        const knee = new THREE.Group();
        knee.position.set(0, -0.62, 0);

        const kneeCap = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), this.coatMat);
        knee.add(kneeCap);

        // Lower Leg / Cannon Bone
        const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.65, 8), this.coatMat);
        lower.position.set(0, -0.32, 0);
        lower.castShadow = true;
        knee.add(lower);

        // Fetlock & Polished Gold Hoof
        const hoofGroup = new THREE.Group();
        hoofGroup.position.set(0, -0.65, 0);

        const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.10, 0.12, 12), this.hoofMat);
        hoof.position.set(0, -0.06, 0.02);
        hoof.castShadow = true;
        hoofGroup.add(hoof);

        knee.add(hoofGroup);
        root.add(knee);

        return { root, upper, knee, hoofGroup };
    }

    buildDissolveVFX() {
        const particleCount = 120;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 1.8;
            positions[i * 3 + 1] = Math.random() * 2.2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;

            const isGold = i % 2 === 0;
            colors[i * 3] = isGold ? 1.0 : 0.0;
            colors[i * 3 + 1] = isGold ? 0.75 : 0.95;
            colors[i * 3 + 2] = isGold ? 0.1 : 1.0;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 0.12,
            vertexColors: true,
            transparent: true,
            opacity: 0.0,
            blending: THREE.AdditiveBlending
        });

        this.dissolveParticles = new THREE.Points(geo, mat);
        this.group.add(this.dissolveParticles);
    }

    // =========================================================================
    // POSITIONING & STATE HELPERS
    // =========================================================================
    setPosition(x, y, z, rotY = 0) {
        this.group.position.set(x, y, z);
        this.group.rotation.y = rotY;
    }

    setKinematicState(state, speed = 1.0) {
        this.state = state;
        this.kinematicSpeed = speed;
    }

    startDissolve() {
        this.isDissolving = true;
        this.dissolveProgress = 0;
    }

    hide() {
        this.group.visible = false;
    }

    show() {
        this.group.visible = true;
    }

    // =========================================================================
    // KINEMATICS & PROCEDURAL GAIT ENGINE
    // =========================================================================
    update(delta, time) {
        if (!this.group.visible) return;

        if (this.isDissolving) {
            this.dissolveProgress += delta * 0.75;
            this.dissolve(Math.min(1.0, this.dissolveProgress));
            if (this.dissolveProgress >= 1.0) {
                this.hide();
                return;
            }
        }

        const state = this.state || 'IDLE';
        const speed = this.kinematicSpeed || 1.0;
        this.updateKinematics(delta, time, state, speed);
    }

    updateKinematics(delta, time, state = 'GALLOP', speed = 1.0) {
        this.state = state;

        if (state === 'GALLOP') {
            this.gallopCycle += delta * 14.0 * speed;
            const cycle = this.gallopCycle;

            // Gallop Suspension Bounce & Torso Rocking Pitch
            const bounce = Math.sin(cycle * 2) * 0.14;
            this.bodyGroup.position.y = 1.45 + bounce;
            this.bodyGroup.rotation.x = Math.sin(cycle) * 0.18; // Gallop rocking
            this.bodyGroup.rotation.z = Math.cos(cycle) * 0.04; // Side sway

            // Arched Neck & Head Rhythmic Response
            this.neck.rotation.x = 0.65 - Math.sin(cycle) * 0.15;
            this.head.rotation.x = -0.72 + Math.sin(cycle) * 0.10;

            // Dynamic Mane & Tail billow
            this.tailGroup.rotation.x = Math.sin(cycle + 1.2) * 0.35 + 0.3;
            this.tailGroup.rotation.z = Math.cos(cycle * 0.8) * 0.18;
            this.maneGroup.rotation.z = Math.sin(time * 24) * 0.22;

            // 4-Beat Articulated Leg Kinematics (Gallop stride)
            // Front Left:
            this.frontLeftLeg.root.rotation.x = Math.sin(cycle) * 0.85;
            this.frontLeftLeg.knee.rotation.x = Math.max(0, -Math.cos(cycle) * 1.4);

            // Front Right (Phase Offset for true asymmetric gallop):
            this.frontRightLeg.root.rotation.x = Math.sin(cycle + 0.6) * 0.85;
            this.frontRightLeg.knee.rotation.x = Math.max(0, -Math.cos(cycle + 0.6) * 1.4);

            // Hind Left (Pushing off):
            this.hindLeftLeg.root.rotation.x = Math.sin(cycle + Math.PI) * 0.80;
            this.hindLeftLeg.knee.rotation.x = Math.max(0, Math.cos(cycle + Math.PI) * 1.3);

            // Hind Right:
            this.hindRightLeg.root.rotation.x = Math.sin(cycle + Math.PI + 0.6) * 0.80;
            this.hindRightLeg.knee.rotation.x = Math.max(0, Math.cos(cycle + Math.PI + 0.6) * 1.3);

        } else if (state === 'TROT') {
            this.gallopCycle += delta * 8.5 * speed;
            const cycle = this.gallopCycle;

            // Trot 2-Beat Diagonal Gait
            this.bodyGroup.position.y = 1.45 + Math.abs(Math.sin(cycle * 2)) * 0.08;
            this.bodyGroup.rotation.x = Math.sin(cycle) * 0.06;

            this.neck.rotation.x = 0.65 + Math.sin(cycle * 2) * 0.05;
            this.tailGroup.rotation.x = 0.25 + Math.sin(cycle * 2) * 0.15;

            // Diagonal pair 1: Front-Left & Hind-Right
            const swing1 = Math.sin(cycle);
            this.frontLeftLeg.root.rotation.x = swing1 * 0.65;
            this.frontLeftLeg.knee.rotation.x = Math.max(0, -swing1 * 0.9);
            this.hindRightLeg.root.rotation.x = -swing1 * 0.55;
            this.hindRightLeg.knee.rotation.x = Math.max(0, swing1 * 0.9);

            // Diagonal pair 2: Front-Right & Hind-Left
            this.frontRightLeg.root.rotation.x = -swing1 * 0.65;
            this.frontRightLeg.knee.rotation.x = Math.max(0, swing1 * 0.9);
            this.hindLeftLeg.root.rotation.x = swing1 * 0.55;
            this.hindLeftLeg.knee.rotation.x = Math.max(0, -swing1 * 0.9);

        } else if (state === 'HALT') {
            // Decelerating & settling into majestic halt
            this.bodyGroup.position.y = THREE.MathUtils.lerp(this.bodyGroup.position.y, 1.45, delta * 8);
            this.bodyGroup.rotation.x = THREE.MathUtils.lerp(this.bodyGroup.rotation.x, -0.10, delta * 8);

            this.frontLeftLeg.root.rotation.x = THREE.MathUtils.lerp(this.frontLeftLeg.root.rotation.x, 0.25, delta * 8);
            this.frontLeftLeg.knee.rotation.x = THREE.MathUtils.lerp(this.frontLeftLeg.knee.rotation.x, 0.10, delta * 8);

            this.frontRightLeg.root.rotation.x = THREE.MathUtils.lerp(this.frontRightLeg.root.rotation.x, -0.15, delta * 8);
            this.frontRightLeg.knee.rotation.x = THREE.MathUtils.lerp(this.frontRightLeg.knee.rotation.x, 0.05, delta * 8);

            this.hindLeftLeg.root.rotation.x = THREE.MathUtils.lerp(this.hindLeftLeg.root.rotation.x, -0.22, delta * 8);
            this.hindRightLeg.root.rotation.x = THREE.MathUtils.lerp(this.hindRightLeg.root.rotation.x, 0.18, delta * 8);

        } else if (state === 'REAR') {
            // Majestic Rearing up on hind legs
            this.bodyGroup.position.y = THREE.MathUtils.lerp(this.bodyGroup.position.y, 1.85, delta * 5);
            this.bodyGroup.rotation.x = THREE.MathUtils.lerp(this.bodyGroup.rotation.x, -0.75, delta * 5);

            this.neck.rotation.x = THREE.MathUtils.lerp(this.neck.rotation.x, 0.95, delta * 5);
            this.head.rotation.x = THREE.MathUtils.lerp(this.head.rotation.x, -0.45, delta * 5);

            // Front legs pawing the air
            this.frontLeftLeg.root.rotation.x = -0.9 + Math.sin(time * 12) * 0.25;
            this.frontLeftLeg.knee.rotation.x = 1.25;
            this.frontRightLeg.root.rotation.x = -1.1 - Math.sin(time * 12) * 0.25;
            this.frontRightLeg.knee.rotation.x = 1.35;

            // Hind legs supporting weight
            this.hindLeftLeg.root.rotation.x = 0.55;
            this.hindLeftLeg.knee.rotation.x = 0.35;
            this.hindRightLeg.root.rotation.x = 0.55;
            this.hindRightLeg.knee.rotation.x = 0.35;

        } else { // 'IDLE'
            this.breathTime += delta * 2.0;
            this.bodyGroup.position.y = 1.45 + Math.sin(this.breathTime) * 0.015;
            this.bodyGroup.rotation.set(0, 0, 0);

            this.neck.rotation.x = 0.65 + Math.sin(this.breathTime * 0.7) * 0.03;
            this.tailGroup.rotation.x = 0.2 + Math.sin(this.breathTime * 1.5) * 0.08;

            this.frontLeftLeg.root.rotation.set(0.04, 0, 0);
            this.frontLeftLeg.knee.rotation.set(0.02, 0, 0);
            this.frontRightLeg.root.rotation.set(-0.04, 0, 0);
            this.frontRightLeg.knee.rotation.set(0.02, 0, 0);

            this.hindLeftLeg.root.rotation.set(-0.05, 0, 0);
            this.hindLeftLeg.knee.rotation.set(0.02, 0, 0);
            this.hindRightLeg.root.rotation.set(0.05, 0, 0);
            this.hindRightLeg.knee.rotation.set(0.02, 0, 0);
        }
    }

    // =========================================================================
    // PARTICLE DISSOLVE EFFECT (Cinematic Exit)
    // =========================================================================
    dissolve(progress) {
        this.dissolveProgress = progress;

        // Shrink & Fade model
        const s = Math.max(0.01, 1.0 - progress * 0.85);
        this.bodyGroup.scale.set(s, s, s);

        // Fade materials
        const op = Math.max(0.0, 1.0 - progress * 1.2);
        this.coatMat.transparent = true;
        this.coatMat.opacity = op;
        this.goldArmorMat.transparent = true;
        this.goldArmorMat.opacity = op;
        this.saddleVelvetMat.opacity = op;
        this.leatherMat.transparent = true;
        this.leatherMat.opacity = op;

        // Burst Stardust Particles
        if (this.dissolveParticles) {
            this.dissolveParticles.material.opacity = Math.sin(progress * Math.PI) * 0.95;
            this.dissolveParticles.rotation.y += 0.05;
            this.dissolveParticles.position.y += 0.02;
        }

        if (progress >= 1.0) {
            this.group.visible = false;
        }
    }

    getMountWorldPosition(targetVec = new THREE.Vector3()) {
        targetVec.copy(this.mountAnchor);
        targetVec.applyEuler(this.bodyGroup.rotation);
        targetVec.add(this.bodyGroup.position);
        targetVec.applyEuler(this.group.rotation);
        targetVec.add(this.group.position);
        return targetVec;
    }
}
