/**
 * ============================================================================
 * COREBOUND — GUARDIAN CHARACTER (3D HUMANOID & VFX ENGINE)
 * ============================================================================
 * High-fidelity 3D Guardian character meticulously modeled after the primary
 * visual reference (guardian.png). Features:
 * - Natural sculpted masculine face with expressive glowing violet/cyan eyes
 * - Long, flowing, multi-layered wavy dark purple hair with silver highlights (NO HELMET)
 * - Open standing V-collar and draped royal purple velvet cowl
 * - Central planetary singularity core with orbital ring and stardust VFX
 * - Sleek crescent winged blade pauldrons and articulated combat gauntlets
 * - Tailored 3D dual-tail royal cloak with aerodynamic cloth wave physics
 * - High-tech pristine white cyber-combat sabatons with dark contrast soles
 * - 10-state kinematic locomotion engine + GLTF drop-in loader hook
 */

import * as THREE from 'three';

export class GuardianCharacter {
    constructor(scene, options = {}) {
        this.scene = scene;
        this.options = Object.assign({
            showNameplate: true,
            nameplateText: 'GUARDIAN'
        }, options);

        this.group = new THREE.Group();
        this.group.name = "GuardianPlayerRoot";

        // GLTF Model hook if replaced
        this.gltfModel = null;
        this.mixer = null;
        this.animations = new Map();

        // Locomotion & Physics runtime variables
        this.walkCycle = 0;
        this.breathTime = 0;
        this.currentTilt = 0;
        this.currentCapeFlare = 0.18;
        this.reactorPulse = 0;
        this.interactionProgress = 0;
        this.currentState = 'IDLE';

        this.initMaterials();
        this.buildProceduralModel();
        this.buildChestParticleVFX();
        this.buildShadowDisc();

        if (this.options.showNameplate) {
            this.buildNameplate();
        }

        this.scene.add(this.group);
    }

    // =========================================================================
    // 1. PBR MATERIALS PALETTE (BASED ON GUARDIAN.PNG)
    // =========================================================================
    initMaterials() {
        // Natural Human Skin & Facial Tones
        this.skinMat = new THREE.MeshStandardMaterial({
            color: 0xf5d5be,
            roughness: 0.54,
            metalness: 0.04
        });

        this.lipsMat = new THREE.MeshStandardMaterial({
            color: 0xba6c60,
            roughness: 0.48,
            metalness: 0.02
        });

        this.beardMat = new THREE.MeshStandardMaterial({
            color: 0x221a2e,
            roughness: 0.85,
            metalness: 0.02
        });

        // Flowing Volumetric Dark Indigo / Violet Hair (Multi-Tone)
        this.hairDarkMat = new THREE.MeshStandardMaterial({
            color: 0x181324,
            roughness: 0.65,
            metalness: 0.18
        });

        this.hairVioletTressMat = new THREE.MeshStandardMaterial({
            color: 0x3b255e,
            roughness: 0.58,
            metalness: 0.24
        });

        this.hairSilverHighlightMat = new THREE.MeshStandardMaterial({
            color: 0x827b9c,
            roughness: 0.5,
            metalness: 0.38
        });

        // Face Feature Materials
        this.eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.irisVioletMat = new THREE.MeshStandardMaterial({
            color: 0x9333ea,
            emissive: 0x7e22ce,
            emissiveIntensity: 1.8,
            roughness: 0.12
        });
        this.pupilCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
        this.catchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.eyebrowMat = new THREE.MeshStandardMaterial({ color: 0x141020, roughness: 0.9 });

        // Forehead Circlet & Inlaid Crystal
        this.circletSilverMat = new THREE.MeshStandardMaterial({
            color: 0xe2e8f0,
            roughness: 0.16,
            metalness: 0.94
        });
        this.foreheadCrystalMat = new THREE.MeshStandardMaterial({
            color: 0x00e5ff,
            emissive: 0x00e5ff,
            emissiveIntensity: 2.8,
            roughness: 0.1
        });

        // Heavy Dark Titanium / Obsidian Armor
        this.armorBlackMat = new THREE.MeshStandardMaterial({
            color: 0x151519,
            roughness: 0.22,
            metalness: 0.88
        });

        // Brushed Silver / Chrome Armor Trim & Chevron Plates
        this.armorSilverMat = new THREE.MeshStandardMaterial({
            color: 0xd1d5db,
            roughness: 0.16,
            metalness: 0.94
        });

        // Inlaid Ancient Gold Filigree
        this.goldFiligreeMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            roughness: 0.2,
            metalness: 0.95
        });

        // Royal Purple Velvet Draped Cowl & Flowing Cape
        this.royalPurpleMat = new THREE.MeshStandardMaterial({
            color: 0x4c1d95,
            roughness: 0.60,
            side: THREE.DoubleSide
        });

        // Pristine White & Platinum Cyber-Titanium Sabatons / Shoes
        this.bootWhiteMat = new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            roughness: 0.22,
            metalness: 0.28
        });

        this.bootSoleMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.65,
            metalness: 0.15
        });

        this.bootGoldTrimMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            roughness: 0.2,
            metalness: 0.95
        });

        // Celestial Glowing Crystals & Singularity Core (Physical Glass + Emissive)
        this.cosmicOrbMat = new THREE.MeshPhysicalMaterial({
            color: 0xc084fc,
            emissive: 0x7e22ce,
            emissiveIntensity: 2.4,
            roughness: 0.1,
            metalness: 0.1,
            transmission: 0.55
        });

        this.cyanConduitMat = new THREE.MeshStandardMaterial({
            color: 0x00e5ff,
            emissive: 0x00e5ff,
            emissiveIntensity: 2.6,
            roughness: 0.12
        });

        this.violetGlowMat = new THREE.MeshStandardMaterial({
            color: 0xc084fc,
            emissive: 0xa855f7,
            emissiveIntensity: 2.8,
            roughness: 0.1
        });
    }

    // =========================================================================
    // 2. PROCEDURAL 3D HUMANOID HIERARCHY
    // =========================================================================
    buildProceduralModel() {
        this.characterRoot = new THREE.Group();
        this.group.add(this.characterRoot);

        // --- UPPER BODY ROOT PIVOT ---
        this.bodyGroup = new THREE.Group();
        this.bodyGroup.position.y = 1.05;

        // 1. Muscular V-Taper Titanium Cuirass
        const chestGeo = new THREE.CylinderGeometry(0.32, 0.25, 0.68, 16);
        const chestMesh = new THREE.Mesh(chestGeo, this.armorBlackMat);
        chestMesh.castShadow = true;
        this.bodyGroup.add(chestMesh);

        // Silver / Chrome Pectoral Chevron Armor Plates
        const pecLeft = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.20, 0.06), this.armorSilverMat);
        pecLeft.position.set(-0.11, 0.14, 0.29);
        pecLeft.rotation.set(0.1, -0.15, 0.05);
        this.bodyGroup.add(pecLeft);

        const pecRight = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.20, 0.06), this.armorSilverMat);
        pecRight.position.set(0.11, 0.14, 0.29);
        pecRight.rotation.set(0.1, 0.15, -0.05);
        this.bodyGroup.add(pecRight);

        // Gold Filigree Rib & Collarbone Trims
        const collarTrim = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.018, 8, 24, Math.PI), this.goldFiligreeMat);
        collarTrim.rotation.x = Math.PI / 2 + 0.1;
        collarTrim.position.set(0, 0.24, 0.1);
        this.bodyGroup.add(collarTrim);

        // 2. Sleek Low V-Neck Collar (Fully exposes neck & jawline)
        const collarLeft = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.10, 0.12), this.armorBlackMat);
        collarLeft.position.set(-0.15, 0.29, 0.01);
        collarLeft.rotation.set(0, 0.35, -0.15);
        this.bodyGroup.add(collarLeft);

        const collarRight = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.10, 0.12), this.armorBlackMat);
        collarRight.position.set(0.15, 0.29, 0.01);
        collarRight.rotation.set(0, -0.35, 0.15);
        this.bodyGroup.add(collarRight);

        const collarGoldL = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.10, 0.012), this.goldFiligreeMat);
        collarGoldL.position.set(-0.135, 0.29, 0.07);
        this.bodyGroup.add(collarGoldL);

        const collarGoldR = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.10, 0.012), this.goldFiligreeMat);
        collarGoldR.position.set(0.135, 0.29, 0.07);
        this.bodyGroup.add(collarGoldR);

        // 3. Central Planetary Singularity Reactor (From guardian.png)
        const reactorGroup = new THREE.Group();
        reactorGroup.position.set(0, 0.07, 0.32);

        const bezelOuter = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.016, 12, 32), this.goldFiligreeMat);
        reactorGroup.add(bezelOuter);

        const bezelInner = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 12, 24), this.armorSilverMat);
        reactorGroup.add(bezelInner);

        // 4 Diamond power conduit prongs
        [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].forEach(ang => {
            const prong = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.05, 4), this.goldFiligreeMat);
            prong.position.set(Math.cos(ang) * 0.12, Math.sin(ang) * 0.12, 0.01);
            prong.rotation.z = ang - Math.PI / 2;
            reactorGroup.add(prong);

            const crystalProng = new THREE.Mesh(new THREE.ConeGeometry(0.01, 0.035, 4), this.cyanConduitMat);
            crystalProng.position.set(Math.cos(ang) * 0.085, Math.sin(ang) * 0.085, 0.015);
            crystalProng.rotation.z = ang - Math.PI / 2;
            reactorGroup.add(crystalProng);
        });

        // Pulsating Cosmic Galaxy Core
        this.chestCoreSphere = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), this.cosmicOrbMat);
        reactorGroup.add(this.chestCoreSphere);

        // Rotating Planetary Singularity Ring
        this.chestRing = new THREE.Mesh(new THREE.TorusGeometry(0.088, 0.009, 8, 32), this.cyanConduitMat);
        this.chestRing.rotation.set(0.6, 0.4, 0.2);
        reactorGroup.add(this.chestRing);

        this.bodyGroup.add(reactorGroup);

        // Glowing Cyan & Violet Power Conduit Inlays on Ribs
        [-0.2, 0.2].forEach(xSide => {
            for (let i = 0; i < 3; i++) {
                const conduit = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.016, 0.02), i % 2 === 0 ? this.cyanConduitMat : this.violetGlowMat);
                conduit.position.set(xSide > 0 ? 0.21 : -0.21, -0.05 - i * 0.065, 0.19 - i * 0.04);
                conduit.rotation.y = xSide > 0 ? -0.4 : 0.4;
                this.bodyGroup.add(conduit);
            }
        });

        // 4. Royal Velvet Draped Cowl & 3D Dual-Tail Tailored Mantle
        // Soft draped cowl folds over the shoulders
        const cowlGeo = new THREE.TorusGeometry(0.25, 0.055, 10, 24);
        const cowlMesh = new THREE.Mesh(cowlGeo, this.royalPurpleMat);
        cowlMesh.rotation.x = Math.PI / 2 + 0.15;
        cowlMesh.position.set(0, 0.23, 0.02);
        this.bodyGroup.add(cowlMesh);

        // Sculpted Upper Back Mantle Yoke & Spine Power Conduit
        const mantleYoke = new THREE.Group();
        mantleYoke.position.set(0, 0.16, -0.18);

        const dorsalArmorPlate = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.36, 0.05), this.armorBlackMat);
        dorsalArmorPlate.position.set(0, -0.04, -0.02);
        dorsalArmorPlate.castShadow = true;
        mantleYoke.add(dorsalArmorPlate);

        // Spine Cyan Conduit
        const spineConduit = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.32, 0.02), this.cyanConduitMat);
        spineConduit.position.set(0, -0.04, -0.045);
        mantleYoke.add(spineConduit);

        // Gold Filigree Brooches on Left and Right Shoulder Blades
        [-0.13, 0.13].forEach(xSide => {
            const brooch = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.008, 8, 16), this.goldFiligreeMat);
            brooch.position.set(xSide, 0.08, -0.035);
            mantleYoke.add(brooch);

            const broochGem = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), this.cosmicOrbMat);
            broochGem.position.set(xSide, 0.08, -0.035);
            mantleYoke.add(broochGem);
        });

        this.bodyGroup.add(mantleYoke);

        // 3D Contoured Dual-Tail Tailored Royal Cloak (Eliminates clipping & provides true aerodynamic volume)
        this.capeRoot = new THREE.Group();
        this.capeRoot.position.set(0, 0.18, -0.21);

        const createCloakTail = (isRight) => {
            const tailGroup = new THREE.Group();
            tailGroup.position.set(isRight ? 0.11 : -0.11, 0, 0);
            tailGroup.rotation.z = isRight ? -0.08 : 0.08;

            // Main Velvet Fabric Body (Sleek 0.65 length for full leg visibility)
            const tailBody = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.65, 0.02), this.royalPurpleMat);
            tailBody.position.set(0, -0.325, 0);
            tailBody.castShadow = true;
            tailGroup.add(tailBody);

            // Gold Embroidered Outer Hem Striping
            const outerTrim = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.65, 0.024), this.goldFiligreeMat);
            outerTrim.position.set(isRight ? 0.095 : -0.095, -0.325, 0);
            tailGroup.add(outerTrim);

            const innerTrim = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.65, 0.022), this.goldFiligreeMat);
            innerTrim.position.set(isRight ? -0.095 : 0.095, -0.325, 0);
            tailGroup.add(innerTrim);

            // Pointed Gold Heraldic Swallowtail Hem Chevron
            const hemChevron = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.14, 4), this.goldFiligreeMat);
            hemChevron.position.set(0, -0.65, 0);
            hemChevron.rotation.x = Math.PI;
            hemChevron.rotation.y = Math.PI / 4;
            tailGroup.add(hemChevron);

            return tailGroup;
        };

        this.capeTailLeft = createCloakTail(false);
        this.capeTailRight = createCloakTail(true);
        this.capeRoot.add(this.capeTailLeft);
        this.capeRoot.add(this.capeTailRight);
        this.bodyGroup.add(this.capeRoot);

        // 5. Armored Belt & Singularity Buckle
        const beltMesh = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.032, 8, 24), this.armorBlackMat);
        beltMesh.rotation.x = Math.PI / 2;
        beltMesh.position.y = -0.32;
        this.bodyGroup.add(beltMesh);

        const beltBuckle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.06), this.goldFiligreeMat);
        beltBuckle.position.set(0, -0.32, 0.26);
        this.bodyGroup.add(beltBuckle);

        const buckleGlow = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), this.cyanConduitMat);
        buckleGlow.position.set(0, -0.32, 0.29);
        this.bodyGroup.add(buckleGlow);

        // --- 6. SCULPTED MASCULINE HEAD, FACE & FLOWING PURPLE HAIR (NO HELMET) ---
        this.buildHeadAndHair();

        // --- 7. ARTICULATED CURVED ARMS & CRESCENT PAULDRONS (NATURAL 24° ELBOW BEND) ---
        this.leftArm = this.createGuardianArm(-0.40, false);
        this.rightArm = this.createGuardianArm(0.40, true);
        this.bodyGroup.add(this.leftArm.shoulder);
        this.bodyGroup.add(this.rightArm.shoulder);

        this.characterRoot.add(this.bodyGroup);

        // --- 8. ARTICULATED CURVED LEGS & WHITE CYBER SABATONS ---
        this.leftLeg = this.createGuardianLeg(-0.16);
        this.rightLeg = this.createGuardianLeg(0.16);
        this.characterRoot.add(this.leftLeg.hip);
        this.characterRoot.add(this.rightLeg.hip);
    }

    // =========================================================================
    // 3. SCULPTED HEAD, MASCULINE FACE & REAL FLOWING HAIR (NO HELMET)
    // =========================================================================
    buildHeadAndHair() {
        this.headGroup = new THREE.Group();
        this.headGroup.position.y = 0.44;

        // Muscular Human Neck
        const neckGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.22, 16);
        const neckMesh = new THREE.Mesh(neckGeo, this.skinMat);
        neckMesh.position.y = -0.06;
        this.headGroup.add(neckMesh);

        // Sculpted Handsome Human Cranium / Head
        const headGeo = new THREE.SphereGeometry(0.20, 24, 24);
        headGeo.scale(0.92, 1.08, 0.98);
        const headMesh = new THREE.Mesh(headGeo, this.skinMat);
        headMesh.position.y = 0.15;
        headMesh.castShadow = true;
        this.headGroup.add(headMesh);

        // Sculpted Ears with Drop Earrings
        [-0.19, 0.19].forEach(xOff => {
            const ear = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.07, 0.04), this.skinMat);
            ear.position.set(xOff, 0.16, -0.01);
            ear.rotation.y = xOff > 0 ? 0.2 : -0.2;
            this.headGroup.add(ear);

            // Dangling Silver Diamond Earring (guardian.png)
            const earring = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.05, 4), this.circletSilverMat);
            earring.position.set(xOff > 0 ? 0.205 : -0.205, 0.11, -0.01);
            earring.rotation.z = Math.PI;
            this.headGroup.add(earring);

            const gemDrop = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8, 8), this.cyanConduitMat);
            gemDrop.position.set(xOff > 0 ? 0.205 : -0.205, 0.075, -0.01);
            this.headGroup.add(gemDrop);
        });

        // Sculpted Masculine Jaw & Light Trimmed Beard / Goatee (guardian.png)
        const chin = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), this.skinMat);
        chin.position.set(0, 0.045, 0.185);
        chin.scale.set(1.2, 0.8, 1.0);
        this.headGroup.add(chin);

        const beard = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 12), this.beardMat);
        beard.position.set(0, 0.04, 0.186);
        beard.scale.set(1.25, 0.75, 0.95);
        this.headGroup.add(beard);

        // Defined Natural Lips
        const upperLip = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.045, 8), this.lipsMat);
        upperLip.position.set(0, 0.09, 0.195);
        upperLip.rotation.z = Math.PI / 2;
        this.headGroup.add(upperLip);

        const lowerLip = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), this.lipsMat);
        lowerLip.position.set(0, 0.078, 0.195);
        lowerLip.scale.set(1.5, 0.5, 0.6);
        this.headGroup.add(lowerLip);

        // Sculpted Natural Nose
        const noseBridge = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.018, 0.075, 8), this.skinMat);
        noseBridge.position.set(0, 0.155, 0.205);
        noseBridge.rotation.x = -0.22;
        this.headGroup.add(noseBridge);

        const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), this.skinMat);
        noseTip.position.set(0, 0.125, 0.215);
        this.headGroup.add(noseTip);

        // Glowing Stylized Eyes with Violet Iris, Cyan Pupil & Specular Catchlight
        [-0.065, 0.065].forEach(xOff => {
            const eyeGroup = new THREE.Group();
            eyeGroup.position.set(xOff, 0.175, 0.18);
            eyeGroup.rotation.y = xOff > 0 ? -0.14 : 0.14;

            // Sclera
            const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 12), this.eyeWhiteMat);
            sclera.scale.set(1.4, 0.7, 0.6);
            eyeGroup.add(sclera);

            // Glowing Violet Iris
            const iris = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 12), this.irisVioletMat);
            iris.position.set(0, 0, 0.012);
            iris.scale.set(1.0, 1.0, 0.4);
            eyeGroup.add(iris);

            // Cyan Starlight Pupil
            const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 8), this.pupilCyanMat);
            pupil.position.set(0, 0, 0.017);
            eyeGroup.add(pupil);

            // Specular Catchlight Glint
            const glint = new THREE.Mesh(new THREE.SphereGeometry(0.003, 6, 6), this.catchlightMat);
            glint.position.set(0.004, 0.004, 0.018);
            eyeGroup.add(glint);

            this.headGroup.add(eyeGroup);

            // Masculine Angled Eyebrow
            const brow = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.015), this.eyebrowMat);
            brow.position.set(xOff, 0.21, 0.195);
            brow.rotation.z = xOff > 0 ? -0.15 : 0.15;
            brow.rotation.y = xOff > 0 ? -0.15 : 0.15;
            this.headGroup.add(brow);

            // Subtle Glowing Purple Rune Lines on Cheekbone (guardian.png)
            const rune = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.008), this.violetGlowMat);
            rune.position.set(xOff > 0 ? 0.105 : -0.105, 0.14, 0.185);
            rune.rotation.z = xOff > 0 ? -0.35 : 0.35;
            rune.rotation.y = xOff > 0 ? -0.2 : 0.2;
            this.headGroup.add(rune);
        });

        // =====================================================================
        // MODERN TEXTURED SHORT HAIR (CLEAN FADE + SHORT QUIFF, NO HELMET)
        // =====================================================================
        const hairRoot = new THREE.Group();
        hairRoot.position.set(0, 0.15, 0);

        // 1. Sleek Short Scalp Base (Close faded sides and back)
        const scalpBase = new THREE.Mesh(
            new THREE.SphereGeometry(0.206, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.62),
            this.hairDarkMat
        );
        scalpBase.scale.set(0.93, 1.05, 0.97);
        scalpBase.position.set(0, 0.02, -0.005);
        scalpBase.castShadow = true;
        hairRoot.add(scalpBase);

        // 2. Neat Tapered Sideburns
        [-0.185, 0.185].forEach(xOff => {
            const sideburn = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.08, 0.04), this.hairDarkMat);
            sideburn.position.set(xOff, 0.04, 0.06);
            sideburn.rotation.y = xOff > 0 ? -0.2 : 0.2;
            hairRoot.add(sideburn);
        });

        // 3. Helper to construct stylish short textured locks
        const createShortLock = (points, radiusTop, radiusBot, mat) => {
            const curve = new THREE.CatmullRomCurve3(points);
            const geo = new THREE.TubeGeometry(curve, 6, radiusTop, 5, false);
            const lockMesh = new THREE.Mesh(geo, mat);
            lockMesh.castShadow = true;
            return lockMesh;
        };

        // 4. Textured Short Quiff Top & Layered Front Fringe
        const shortLocks = [
            // Center-front textured fringe (short, styled above eyebrows)
            createShortLock([
                new THREE.Vector3(0, 0.16, 0.16),
                new THREE.Vector3(0.01, 0.12, 0.19),
                new THREE.Vector3(0.02, 0.08, 0.195)
            ], 0.022, 0.008, this.hairVioletTressMat),

            createShortLock([
                new THREE.Vector3(-0.04, 0.17, 0.15),
                new THREE.Vector3(-0.05, 0.13, 0.18),
                new THREE.Vector3(-0.07, 0.09, 0.185)
            ], 0.02, 0.007, this.hairDarkMat),

            createShortLock([
                new THREE.Vector3(0.04, 0.17, 0.15),
                new THREE.Vector3(0.05, 0.13, 0.18),
                new THREE.Vector3(0.07, 0.09, 0.185)
            ], 0.02, 0.007, this.hairSilverHighlightMat),

            // Left temple short texture
            createShortLock([
                new THREE.Vector3(-0.09, 0.15, 0.13),
                new THREE.Vector3(-0.12, 0.11, 0.15),
                new THREE.Vector3(-0.14, 0.07, 0.14)
            ], 0.018, 0.006, this.hairDarkMat),

            // Right temple short texture
            createShortLock([
                new THREE.Vector3(0.09, 0.15, 0.13),
                new THREE.Vector3(0.12, 0.11, 0.15),
                new THREE.Vector3(0.14, 0.07, 0.14)
            ], 0.018, 0.006, this.hairVioletTressMat),

            // Crown Top Lifted Textured Spikes / Quiff Crest
            createShortLock([
                new THREE.Vector3(0, 0.20, 0.10),
                new THREE.Vector3(0.01, 0.24, 0.12),
                new THREE.Vector3(0.02, 0.26, 0.09)
            ], 0.026, 0.01, this.hairVioletTressMat),

            createShortLock([
                new THREE.Vector3(-0.05, 0.20, 0.08),
                new THREE.Vector3(-0.06, 0.24, 0.10),
                new THREE.Vector3(-0.07, 0.25, 0.07)
            ], 0.024, 0.008, this.hairSilverHighlightMat),

            createShortLock([
                new THREE.Vector3(0.05, 0.20, 0.08),
                new THREE.Vector3(0.06, 0.24, 0.10),
                new THREE.Vector3(0.07, 0.25, 0.07)
            ], 0.024, 0.008, this.hairDarkMat),

            // Mid-crown texture
            createShortLock([
                new THREE.Vector3(-0.03, 0.21, 0.02),
                new THREE.Vector3(-0.04, 0.24, 0.03),
                new THREE.Vector3(-0.04, 0.25, 0.0)
            ], 0.022, 0.008, this.hairVioletTressMat),

            createShortLock([
                new THREE.Vector3(0.03, 0.21, 0.02),
                new THREE.Vector3(0.04, 0.24, 0.03),
                new THREE.Vector3(0.04, 0.25, 0.0)
            ], 0.022, 0.008, this.hairDarkMat),

            // Back crown short texture
            createShortLock([
                new THREE.Vector3(0, 0.19, -0.06),
                new THREE.Vector3(0, 0.21, -0.08),
                new THREE.Vector3(0, 0.18, -0.11)
            ], 0.022, 0.008, this.hairDarkMat)
        ];
        shortLocks.forEach(lock => hairRoot.add(lock));

        this.headGroup.add(hairRoot);
        this.bodyGroup.add(this.headGroup);
    }

    // =========================================================================
    // 4. CRESCENT WINGED PAULDRONS, ARMS & GAUNTLETS (NATURAL 24° ELBOW BEND)
    // =========================================================================
    createGuardianArm(xOffset, isRight) {
        const shoulder = new THREE.Group();
        shoulder.position.set(xOffset, 0.24, 0);

        // Natural Anatomical Shoulder Flare
        shoulder.rotation.z = isRight ? -0.14 : 0.14;
        shoulder.rotation.x = 0.08;

        // Crescent Winged Combat Pauldron (Swept upward/backward - guardian.png)
        const pauldronGroup = new THREE.Group();

        // Main smooth curved pauldron dome
        const pauldronGeo = new THREE.SphereGeometry(0.18, 16, 16, 0, Math.PI, 0, Math.PI / 1.4);
        const pauldronMesh = new THREE.Mesh(pauldronGeo, this.armorBlackMat);
        pauldronMesh.rotation.set(0, isRight ? -Math.PI / 2 : Math.PI / 2, isRight ? -0.3 : 0.3);
        pauldronMesh.castShadow = true;
        pauldronGroup.add(pauldronMesh);

        // Gold Filigree Beveled Outer Rim
        const rimMesh = new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.02, 8, 24, Math.PI), this.goldFiligreeMat);
        rimMesh.rotation.set(0, isRight ? -Math.PI / 2 : Math.PI / 2, isRight ? -0.3 : 0.3);
        pauldronGroup.add(rimMesh);

        // Sleek Upward-Sweeping Crescent Wing Blade (guardian.png)
        const wingCurvePoints = [
            new THREE.Vector3(isRight ? 0.08 : -0.08, 0.04, -0.04),
            new THREE.Vector3(isRight ? 0.18 : -0.18, 0.14, -0.02),
            new THREE.Vector3(isRight ? 0.22 : -0.22, 0.24, 0.04)
        ];
        const wingCurve = new THREE.CatmullRomCurve3(wingCurvePoints);
        const wingGeo = new THREE.TubeGeometry(wingCurve, 8, 0.028, 4, false);
        const wingMesh = new THREE.Mesh(wingGeo, this.armorSilverMat);
        pauldronGroup.add(wingMesh);

        // Inlaid Circular Celestial Energy Device (guardian.png)
        const socketBezel = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.01, 8, 24), this.goldFiligreeMat);
        socketBezel.position.set(isRight ? 0.11 : -0.11, 0.02, 0.05);
        socketBezel.rotation.y = isRight ? 0.6 : -0.6;
        pauldronGroup.add(socketBezel);

        const shoulderOrb = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 12), this.cosmicOrbMat);
        shoulderOrb.position.copy(socketBezel.position);
        pauldronGroup.add(shoulderOrb);

        shoulder.add(pauldronGroup);

        // Upper Arm (Bicep)
        const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.062, 0.34, 12), this.armorBlackMat);
        upperArm.position.y = -0.17;
        upperArm.castShadow = true;
        shoulder.add(upperArm);

        // Forearm & Articulated Elbow Joint (NATURAL BASE BEND 24° FORWARD)
        const forearm = new THREE.Group();
        forearm.position.set(0, -0.34, 0);
        forearm.rotation.x = -0.42; // 24° natural resting forward flexion
        forearm.rotation.y = isRight ? -0.16 : 0.16;

        // Silver Vambrace (Tapered, length 0.24)
        const lowerArm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.048, 0.24, 12), this.armorSilverMat);
        lowerArm.position.y = -0.12;
        lowerArm.castShadow = true;
        forearm.add(lowerArm);

        const conduitLine = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.22, 0.014), this.cyanConduitMat);
        conduitLine.position.set(0, -0.12, 0.052);
        forearm.add(conduitLine);

        // Gold Filigree Wrist Bracer / Gauntlet Cuff
        const wristCuff = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.01, 8, 20), this.goldFiligreeMat);
        wristCuff.rotation.x = Math.PI / 2;
        wristCuff.position.y = -0.24;
        forearm.add(wristCuff);

        // =====================================================================
        // ARTICULATED 3D HUMAN HAND & FINGERS (HIGH-FIDELITY SCULPTED)
        // =====================================================================
        const handGroup = new THREE.Group();
        handGroup.position.set(0, -0.26, 0);

        // 1. Natural Palm & Hand Chassis (Warm Skin with Gold Knuckle Guard)
        const palm = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.075, 0.034), this.skinMat);
        palm.position.set(0, -0.038, 0.005);
        palm.castShadow = true;
        handGroup.add(palm);

        // Dorsal Back of Hand Gold Armor Crest
        const dorsalPlate = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.045, 0.008), this.goldFiligreeMat);
        dorsalPlate.position.set(0, -0.028, 0.022);
        handGroup.add(dorsalPlate);

        // Gold Knuckle Bar
        const knuckleBar = new THREE.Mesh(new THREE.BoxGeometry(0.064, 0.016, 0.024), this.goldFiligreeMat);
        knuckleBar.position.set(0, -0.065, 0.012);
        handGroup.add(knuckleBar);

        // 2. Helper to construct an articulated 3D Finger with natural soft curl
        const createFinger = (xPos, length, thickness, curlAngle = 0.25) => {
            const fingerRoot = new THREE.Group();
            fingerRoot.position.set(xPos, -0.075, 0.005);
            fingerRoot.rotation.x = curlAngle;

            // Proximal Phalanx (Upper segment)
            const seg1 = new THREE.Mesh(
                new THREE.CapsuleGeometry(thickness, length * 0.55, 6, 8),
                this.skinMat
            );
            seg1.position.y = -(length * 0.3);
            seg1.castShadow = true;
            fingerRoot.add(seg1);

            // Intermediate & Distal Phalanx (Lower segment curved inward)
            const seg2 = new THREE.Mesh(
                new THREE.CapsuleGeometry(thickness * 0.85, length * 0.45, 6, 8),
                this.skinMat
            );
            seg2.position.set(0, -(length * 0.72), length * 0.12);
            seg2.rotation.x = 0.35;
            seg2.castShadow = true;
            fingerRoot.add(seg2);

            return fingerRoot;
        };

        // 3. Four Articulated Fingers (Index, Middle, Ring, Pinky)
        const sign = isRight ? 1 : -1;

        // Index Finger
        const indexFinger = createFinger(-0.024 * sign, 0.062, 0.009, 0.22);
        handGroup.add(indexFinger);

        // Middle Finger (Longest)
        const middleFinger = createFinger(-0.008 * sign, 0.068, 0.0095, 0.28);
        handGroup.add(middleFinger);

        // Ring Finger
        const ringFinger = createFinger(0.008 * sign, 0.063, 0.009, 0.32);
        handGroup.add(ringFinger);

        // Pinky Finger
        const pinkyFinger = createFinger(0.024 * sign, 0.052, 0.008, 0.38);
        handGroup.add(pinkyFinger);

        // 4. Opposable Articulated Thumb
        const thumbGroup = new THREE.Group();
        thumbGroup.position.set(isRight ? -0.038 : 0.038, -0.028, 0.015);
        thumbGroup.rotation.z = isRight ? 0.55 : -0.55;
        thumbGroup.rotation.x = 0.45;
        thumbGroup.rotation.y = isRight ? -0.3 : 0.3;

        const thumbSeg1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.010, 0.035, 6, 8), this.skinMat);
        thumbSeg1.position.y = -0.018;
        thumbSeg1.castShadow = true;
        thumbGroup.add(thumbSeg1);

        const thumbSeg2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.009, 0.030, 6, 8), this.skinMat);
        thumbSeg2.position.set(0, -0.045, 0.01);
        thumbSeg2.rotation.x = 0.4;
        thumbSeg2.castShadow = true;
        thumbGroup.add(thumbSeg2);

        handGroup.add(thumbGroup);

        forearm.add(handGroup);

        shoulder.add(forearm);

        return { shoulder, forearm, handGroup, shoulderOrb, pauldronGroup };
    }

    // =========================================================================
    // 5. ARTICULATED LEGS & WHITE CYBER COMBAT SABATONS
    // =========================================================================
    createGuardianLeg(xOffset) {
        const hip = new THREE.Group();
        hip.position.set(xOffset, 0.74, 0);
        hip.rotation.z = xOffset > 0 ? -0.03 : 0.03;

        // Armored Cuisses (Thigh)
        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.082, 0.38, 12), this.armorBlackMat);
        thigh.position.set(0, -0.19, 0.02);
        thigh.rotation.x = -0.08;
        thigh.castShadow = true;
        hip.add(thigh);

        const goldSeam = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.36, 0.018), this.goldFiligreeMat);
        goldSeam.position.set(xOffset > 0 ? 0.10 : -0.10, -0.19, 0.02);
        hip.add(goldSeam);

        // Knee Joint with resting soft bend
        const knee = new THREE.Group();
        knee.position.set(0, -0.38, 0);
        knee.rotation.x = 0.08;

        // Silver Poleyn Knee Cap
        const kneeCap = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.095, 0.055), this.armorSilverMat);
        kneeCap.position.set(0, 0, 0.065);
        knee.add(kneeCap);

        const kneeGem = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.032, 4), this.goldFiligreeMat);
        kneeGem.position.set(0, 0, 0.09);
        kneeGem.rotation.x = Math.PI / 2;
        knee.add(kneeGem);

        // Shin Greave
        const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.068, 0.34, 12), this.armorBlackMat);
        shin.position.set(0, -0.17, 0);
        shin.castShadow = true;
        knee.add(shin);

        // High-Tech Pristine White Cyber Combat Sabatons / Shoes
        const bootGroup = new THREE.Group();
        bootGroup.position.set(0, -0.31, 0.03);

        // White High-Top Ankle Collar Cuff
        const bootCuff = new THREE.Mesh(new THREE.BoxGeometry(0.138, 0.055, 0.145), this.bootWhiteMat);
        bootCuff.position.set(0, 0.07, -0.01);
        bootCuff.castShadow = true;
        bootGroup.add(bootCuff);

        // Gold collar rim
        const bootCuffTrim = new THREE.Mesh(new THREE.BoxGeometry(0.142, 0.015, 0.15), this.bootGoldTrimMat);
        bootCuffTrim.position.set(0, 0.09, -0.01);
        bootGroup.add(bootCuffTrim);

        // White Main Sneaker / Sabaton Body Chassis
        const bootUpper = new THREE.Mesh(new THREE.BoxGeometry(0.128, 0.11, 0.225), this.bootWhiteMat);
        bootUpper.position.set(0, 0.01, 0.01);
        bootUpper.castShadow = true;
        bootGroup.add(bootUpper);

        // Dark Anthracite High-Traction Tread Sole (rests flush at world y = 0.00)
        const bootSole = new THREE.Mesh(new THREE.BoxGeometry(0.136, 0.032, 0.255), this.bootSoleMat);
        bootSole.position.set(0, -0.05, 0.02);
        bootSole.castShadow = true;
        bootGroup.add(bootSole);

        // Sleek White & Silver Sabaton Toe Box
        const toeCap = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.095, 4), this.bootWhiteMat);
        toeCap.position.set(0, -0.015, 0.115);
        toeCap.rotation.x = Math.PI / 2.3;
        toeCap.castShadow = true;
        bootGroup.add(toeCap);

        const toeSilverTip = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.048, 4), this.armorSilverMat);
        toeSilverTip.position.set(0, -0.025, 0.145);
        toeSilverTip.rotation.x = Math.PI / 2.3;
        bootGroup.add(toeSilverTip);

        // Gold Heel Stabilizer & Shock Absorber
        const heelAccent = new THREE.Mesh(new THREE.BoxGeometry(0.132, 0.032, 0.028), this.bootGoldTrimMat);
        heelAccent.position.set(0, -0.03, -0.095);
        bootGroup.add(heelAccent);

        // Lateral Glowing Cyan Energy Conduit Stripe
        const lateralX = xOffset > 0 ? 0.066 : -0.066;
        const conduitStripe = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.018, 0.14), this.cyanConduitMat);
        conduitStripe.position.set(lateralX, 0.01, 0.02);
        conduitStripe.rotation.y = xOffset > 0 ? -0.08 : 0.08;
        bootGroup.add(conduitStripe);

        knee.add(bootGroup);

        hip.add(knee);

        return { hip, knee };
    }

    // =========================================================================
    // 6. CHEST CORE STARDUST PARTICLE VFX
    // =========================================================================
    buildChestParticleVFX() {
        const particleCount = 45;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = 0.08 + Math.random() * 0.14;
            positions[i * 3] = Math.cos(angle) * r;
            positions[i * 3 + 1] = Math.sin(angle) * r;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const pMat = new THREE.PointsMaterial({
            color: 0x00e5ff,
            size: 0.022,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending
        });

        this.chestParticles = new THREE.Points(geo, pMat);
        this.chestParticles.position.set(0, 1.12, 0.35);
        this.characterRoot.add(this.chestParticles);
    }

    // =========================================================================
    // 7. DYNAMIC GROUND SHADOW & NAMEPLATE
    // =========================================================================
    buildShadowDisc() {
        const shadowGeo = new THREE.CircleGeometry(0.65, 24);
        const shadowMat = new THREE.MeshBasicMaterial({
            color: 0x090d16,
            transparent: true,
            opacity: 0.45,
            depthWrite: false
        });
        this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
        this.shadowMesh.rotation.x = -Math.PI / 2;
        this.shadowMesh.position.y = 0.04;
        this.scene.add(this.shadowMesh);
    }

    buildNameplate() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.roundRect(16, 12, 224, 40, 8);
        ctx.fill();

        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2;
        ctx.roundRect(16, 12, 224, 40, 8);
        ctx.stroke();

        ctx.font = 'bold 22px "Inter", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.options.nameplateText, 128, 32);

        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
        this.nameplateSprite = new THREE.Sprite(mat);
        this.nameplateSprite.scale.set(1.4, 0.35, 1);
        this.nameplateSprite.position.set(0, 2.35, 0);
        this.characterRoot.add(this.nameplateSprite);
    }

    // =========================================================================
    // 8. GLTF LOADER HOOK (FUTURE PRODUCTION MODEL DROP-IN)
    // =========================================================================
    loadGLTF(url, GLTFLoaderClass, onComplete) {
        if (!GLTFLoaderClass) return;
        const loader = new GLTFLoaderClass();
        loader.load(url, (gltf) => {
            if (this.characterRoot) {
                this.characterRoot.visible = false;
            }
            this.gltfModel = gltf.scene;
            this.group.add(this.gltfModel);

            if (gltf.animations && gltf.animations.length > 0) {
                this.mixer = new THREE.AnimationMixer(this.gltfModel);
                gltf.animations.forEach(clip => {
                    this.animations.set(clip.name.toUpperCase(), this.mixer.clipAction(clip));
                });
            }
            if (onComplete) onComplete(gltf);
        });
    }

    // =========================================================================
    // 9. ANIMATION STATE MACHINE UPDATE (PROCEDURAL + GLTF)
    // =========================================================================
    update(delta, time, state, physics = {}) {
        this.currentState = state;

        // 1. Update GLTF Animation Mixer if present
        if (this.mixer) {
            this.mixer.update(delta);
            return;
        }

        // 2. Dynamic Ground Shadow position & scaling
        if (this.shadowMesh) {
            this.shadowMesh.position.x = this.group.position.x;
            this.shadowMesh.position.z = this.group.position.z;
            const heightAboveGround = this.group.position.y;
            this.shadowMesh.scale.setScalar(Math.max(0.3, 1.0 - heightAboveGround * 0.15));
            this.shadowMesh.material.opacity = Math.max(0.08, 0.45 - heightAboveGround * 0.08);
        }

        // 3. Ambient Singularity VFX (Ring spin, core breathing pulse, stardust cloud)
        if (this.chestRing) {
            this.chestRing.rotation.z += delta * 2.8;
            this.chestRing.rotation.x += delta * 1.4;
        }
        if (this.chestCoreSphere) {
            this.reactorPulse += delta * 3.5;
            const pulseScale = 1.0 + Math.sin(this.reactorPulse) * 0.12;
            this.chestCoreSphere.scale.setScalar(pulseScale);
        }
        if (this.chestParticles) {
            this.chestParticles.rotation.z += delta * 1.2;
        }

        // 4. Dynamic High-Lift Aerodynamic Cloth Billowing (Hawa me udna taaki legs clearly visible rahe)
        if (this.capeTailLeft && this.capeTailRight) {
            let targetFlare = 0.18;
            let windSpeed = 5.0;
            let waveAmp = 0.04;

            if (state === 'SPRINT' || state === 'RIDING') {
                targetFlare = 1.38; // ~80° High-speed aerodynamic wind stream
                windSpeed = 28;
                waveAmp = 0.28;
            } else if (state === 'RUN') {
                targetFlare = 1.15; // ~66° High billowing
                windSpeed = 22;
                waveAmp = 0.24;
            } else if (state === 'WALK') {
                targetFlare = 0.90; // ~52° High wind lift exposing full leg stride and shoes
                windSpeed = 16;
                waveAmp = 0.18;
            } else if (state === 'JUMP' || state === 'FALL') {
                targetFlare = 1.45; // Dramatic airborne flap
                windSpeed = 26;
                waveAmp = 0.32;
            } else {
                targetFlare = 0.18; // Relaxed resting drape
                windSpeed = 4.5;
                waveAmp = 0.04;
            }

            // Smooth high-speed response to locomotion
            this.currentCapeFlare = THREE.MathUtils.lerp(this.currentCapeFlare, targetFlare, delta * 7);

            // Left Tail Wave Dynamics (Flared out slightly in V-shape)
            this.capeTailLeft.rotation.x = this.currentCapeFlare + Math.sin(time * windSpeed) * waveAmp;
            this.capeTailLeft.rotation.y = Math.cos(time * windSpeed * 0.7) * (waveAmp * 0.45);
            this.capeTailLeft.rotation.z = 0.12 + Math.sin(time * windSpeed * 0.5) * (waveAmp * 0.35);

            // Right Tail Wave Dynamics (Phase shifted for independent fluid wind ripples)
            this.capeTailRight.rotation.x = this.currentCapeFlare + Math.sin(time * windSpeed + 0.45) * waveAmp;
            this.capeTailRight.rotation.y = -Math.cos(time * windSpeed * 0.7 + 0.45) * (waveAmp * 0.45);
            this.capeTailRight.rotation.z = -0.12 - Math.sin(time * windSpeed * 0.5 + 0.45) * (waveAmp * 0.35);
        }

        // 5. Kinematics State Machine
        switch (state) {
            case 'RIDING':
                this.animateRiding(delta, time, physics.gallopCycle || 0);
                break;
            case 'DISMOUNT':
                this.animateDismount(physics.dismountProgress || 0);
                break;
            case 'JUMP':
            case 'FALL':
                this.animateAirborne(delta);
                break;
            case 'LAND':
                this.animateLanding(delta);
                break;
            case 'INTERACT':
                this.animateInteract(delta);
                break;
            case 'INSPECT':
                this.animateInspect(delta);
                break;
            case 'VICTORY':
                this.animateVictory(delta, time);
                break;
            case 'SPRINT':
                this.animateLocomotion(delta, 12.5, 0.26, true);
                break;
            case 'RUN':
                this.animateLocomotion(delta, 10.0, 0.18, false);
                break;
            case 'WALK':
                this.animateLocomotion(delta, 7.6, 0.12, false);
                break;
            case 'IDLE':
            default:
                this.animateIdle(delta);
                break;
        }
    }

    animateRiding(delta, time, gallopCycle) {
        this.walkCycle = 0;
        const bounce = Math.sin(gallopCycle * 2) * 0.04;
        const forwardPitch = 0.16 + Math.cos(gallopCycle) * 0.05;

        // Torso posture seated in saddle
        this.bodyGroup.position.y = 0.88 + bounce;
        this.bodyGroup.rotation.set(forwardPitch, Math.sin(gallopCycle) * 0.02, 0);

        // Legs wrapped around horse flanks
        this.leftLeg.hip.rotation.set(-0.85, 0.1, 0.32);
        this.leftLeg.knee.rotation.x = 1.30;
        this.rightLeg.hip.rotation.set(-0.85, -0.1, -0.32);
        this.rightLeg.knee.rotation.x = 1.30;

        // Arms reaching forward holding reins firmly
        this.leftArm.shoulder.rotation.set(-0.72, 0.18, 0.20);
        this.leftArm.forearm.rotation.set(-0.70, 0.12, 0);
        if (this.leftArm.handGroup) {
            this.leftArm.handGroup.rotation.set(-0.25, 0, 0);
        }

        this.rightArm.shoulder.rotation.set(-0.72, -0.18, -0.20);
        this.rightArm.forearm.rotation.set(-0.70, -0.12, 0);
        if (this.rightArm.handGroup) {
            this.rightArm.handGroup.rotation.set(-0.25, 0, 0);
        }

        if (this.headGroup) {
            this.headGroup.rotation.set(-0.08, 0, 0);
        }
    }

    animateDismount(progress) {
        // progress: 0.0 (riding) -> 1.0 (standing on ground)
        const t = THREE.MathUtils.clamp(progress, 0, 1);

        if (t < 0.5) {
            // Phase 1: Leg swing over horse flank (0 -> 0.5)
            const p1 = t / 0.5;
            this.bodyGroup.position.y = THREE.MathUtils.lerp(0.88, 1.05, p1);
            this.bodyGroup.rotation.set(0.12 * (1 - p1), -0.35 * p1, 0);

            // Left leg supports dismount on left side
            this.leftLeg.hip.rotation.set(
                THREE.MathUtils.lerp(-0.85, -0.2, p1),
                THREE.MathUtils.lerp(0.1, 0.05, p1),
                THREE.MathUtils.lerp(0.32, 0.15, p1)
            );
            this.leftLeg.knee.rotation.x = THREE.MathUtils.lerp(1.30, 0.4, p1);

            // Right leg swings up and over to the left side
            this.rightLeg.hip.rotation.set(
                THREE.MathUtils.lerp(-0.85, -0.4, p1),
                THREE.MathUtils.lerp(-0.1, 0.6 * Math.sin(p1 * Math.PI), p1),
                THREE.MathUtils.lerp(-0.32, 0.45 * p1, p1)
            );
            this.rightLeg.knee.rotation.x = THREE.MathUtils.lerp(1.30, 0.5, p1);

            // Hands releasing reins
            this.leftArm.shoulder.rotation.set(-0.5, 0.1, 0.2);
            this.leftArm.forearm.rotation.set(-0.5, 0, 0);
            this.rightArm.shoulder.rotation.set(-0.6, -0.1, -0.2);
            this.rightArm.forearm.rotation.set(-0.5, 0, 0);
        } else {
            // Phase 2: Dropping smoothly to ground and landing on feet (0.5 -> 1.0)
            const p2 = (t - 0.5) / 0.5;
            this.bodyGroup.position.y = 1.05;
            this.bodyGroup.rotation.set(0, THREE.MathUtils.lerp(-0.35, 0, p2), 0);

            // Both legs returning to upright stance
            this.leftLeg.hip.rotation.set(
                THREE.MathUtils.lerp(-0.2, 0.04, p2),
                0,
                THREE.MathUtils.lerp(0.15, 0.03, p2)
            );
            this.leftLeg.knee.rotation.x = THREE.MathUtils.lerp(0.4, 0.08, p2);

            this.rightLeg.hip.rotation.set(
                THREE.MathUtils.lerp(-0.4, -0.04, p2),
                0,
                THREE.MathUtils.lerp(0.2, -0.03, p2)
            );
            this.rightLeg.knee.rotation.x = THREE.MathUtils.lerp(0.5, 0.08, p2);

            // Arms returning to resting side posture
            this.leftArm.shoulder.rotation.set(THREE.MathUtils.lerp(-0.5, -0.06, p2), 0, 0.14);
            this.leftArm.forearm.rotation.set(THREE.MathUtils.lerp(-0.5, -0.38, p2), 0.16, 0);
            this.rightArm.shoulder.rotation.set(THREE.MathUtils.lerp(-0.6, -0.06, p2), 0, -0.14);
            this.rightArm.forearm.rotation.set(THREE.MathUtils.lerp(-0.5, -0.38, p2), -0.16, 0);
        }
    }

    animateLocomotion(delta, cadence, forwardTilt, isSprinting) {
        this.walkCycle += delta * cadence;
        const cycle = this.walkCycle;

        // Primary gait oscillation (Opposing left and right limbs)
        const swingL = Math.sin(cycle);
        const swingR = -swingL;

        // Secondary harmonic for apex snap and natural human gait non-linearity
        const cosL = Math.cos(cycle);
        const cosR = -cosL;

        // === 1. LEGS: 3-PHASE GAIT (Heel Strike -> Midstance -> Push-off) ===
        // Left Leg:
        if (swingL > 0) { // Forward Swing Phase
            this.leftLeg.hip.rotation.x = swingL * (isSprinting ? 0.85 : 0.62);
            // Dynamic Knee Flexion: High knee lift during forward swing, extending before heel strike
            this.leftLeg.knee.rotation.x = Math.max(0.08, Math.sin(cycle) * (isSprinting ? 1.35 : 0.95));
            this.leftLeg.hip.rotation.z = Math.sin(cycle) * 0.04;
        } else { // Stance / Push-off Phase (Leg pushes backward)
            this.leftLeg.hip.rotation.x = swingL * (isSprinting ? 0.55 : 0.40);
            this.leftLeg.knee.rotation.x = 0.08 + Math.max(0, -cosL * 0.15);
            this.leftLeg.hip.rotation.z = -Math.sin(cycle) * 0.02;
        }

        // Right Leg:
        if (swingR > 0) { // Forward Swing Phase
            this.rightLeg.hip.rotation.x = swingR * (isSprinting ? 0.85 : 0.62);
            this.rightLeg.knee.rotation.x = Math.max(0.08, Math.sin(cycle + Math.PI) * (isSprinting ? 1.35 : 0.95));
            this.rightLeg.hip.rotation.z = -Math.sin(cycle) * 0.04;
        } else { // Stance / Push-off Phase
            this.rightLeg.hip.rotation.x = swingR * (isSprinting ? 0.55 : 0.40);
            this.rightLeg.knee.rotation.x = 0.08 + Math.max(0, -cosR * 0.15);
            this.rightLeg.hip.rotation.z = Math.sin(cycle) * 0.02;
        }

        // === 2. ARMS: 3D NATURAL PUMPING KINEMATICS (FORWARD BEND -> SWEEP BACK EXTEND) ===
        // When arm swings FORWARD: shoulder pitches forward, elbow bends inward across chest, wrist fl        // === 2. ARMS: 3D FORWARD-BENDING KINEMATICS (FORWARD BEND -> SWEEP BACK EXTEND) ===
        const armAmp = isSprinting ? 0.72 : 0.48;
        const elbowBase = isSprinting ? 0.75 : 0.52;
        const elbowSwing = isSprinting ? 0.60 : 0.38;

        // LEFT ARM:
        // Shoulder pitch: Negative when swinging forward, positive when swinging back
        this.leftArm.shoulder.rotation.x = swingL * armAmp;
        this.leftArm.shoulder.rotation.y = -swingL * 0.14;
        this.leftArm.shoulder.rotation.z = 0.14 + Math.max(0, -swingL * 0.08);

        // Elbow Flexion: ALWAYS NEGATIVE to bend forward! High forward bend when arm is in front
        const flexL = THREE.MathUtils.clamp(elbowBase - swingL * elbowSwing, 0.15, 1.35);
        this.leftArm.forearm.rotation.x = -flexL;
        this.leftArm.forearm.rotation.y = 0.16 + Math.max(0, -swingL * 0.16);

        if (this.leftArm.handGroup) {
            this.leftArm.handGroup.rotation.x = swingL * 0.18;
            this.leftArm.handGroup.rotation.z = -swingL * 0.10;
        }

        // RIGHT ARM:
        this.rightArm.shoulder.rotation.x = -swingL * armAmp;
        this.rightArm.shoulder.rotation.y = swingL * 0.14;
        this.rightArm.shoulder.rotation.z = -0.14 - Math.max(0, swingL * 0.08);

        const flexR = THREE.MathUtils.clamp(elbowBase + swingL * elbowSwing, 0.15, 1.35);
        this.rightArm.forearm.rotation.x = -flexR;
        this.rightArm.forearm.rotation.y = -0.16 - Math.max(0, swingL * 0.16);

        if (this.rightArm.handGroup) {
            this.rightArm.handGroup.rotation.x = -swingL * 0.18;
            this.rightArm.handGroup.rotation.z = swingL * 0.10;
        }

        // === 3. TORSO & HEAD DYNAMICS (Athletic Sway, Twist, Bounce & Stabilization) ===
        this.currentTilt = THREE.MathUtils.lerp(this.currentTilt, forwardTilt, delta * 8);
        this.bodyGroup.rotation.x = this.currentTilt;
        this.bodyGroup.rotation.z = Math.sin(cycle) * (isSprinting ? 0.06 : 0.035);
        this.bodyGroup.rotation.y = Math.sin(cycle) * (isSprinting ? 0.08 : 0.05);

        // Dynamic Double-Frequency Step Bounce
        const bounce = Math.abs(Math.sin(cycle)) * (isSprinting ? 0.065 : 0.04);
        this.bodyGroup.position.y = 1.05 + bounce;

        if (this.headGroup) {
            this.headGroup.rotation.y = -Math.sin(cycle) * 0.035;
            this.headGroup.rotation.z = -Math.sin(cycle) * 0.02;
        }
    }

    animateIdle(delta) {
        this.walkCycle = 0;
        this.breathTime += delta * 2.2;
        this.currentTilt = THREE.MathUtils.lerp(this.currentTilt, 0, delta * 8);

        this.leftLeg.hip.rotation.set(0.04, 0, 0.03);
        this.leftLeg.knee.rotation.x = 0.08;
        this.rightLeg.hip.rotation.set(-0.04, 0, -0.03);
        this.rightLeg.knee.rotation.x = 0.08;

        this.leftArm.shoulder.rotation.set(-0.06 + Math.sin(this.breathTime) * 0.03, 0, 0.14);
        this.leftArm.forearm.rotation.set(-0.38, 0.16, 0);
        if (this.leftArm.handGroup) {
            this.leftArm.handGroup.rotation.set(0, 0, 0);
        }

        this.rightArm.shoulder.rotation.set(-0.06 - Math.sin(this.breathTime) * 0.03, 0, -0.14);
        this.rightArm.forearm.rotation.set(-0.38, -0.16, 0);
        if (this.rightArm.handGroup) {
            this.rightArm.handGroup.rotation.set(0, 0, 0);
        }

        if (this.headGroup) {
            this.headGroup.rotation.set(0, 0, 0);
        }

        this.bodyGroup.rotation.set(this.currentTilt, 0, 0);
        this.bodyGroup.position.y = 1.05 + Math.sin(this.breathTime) * 0.015;
    }

    animateAirborne(delta) {
        this.leftLeg.hip.rotation.x = -0.55;
        this.leftLeg.knee.rotation.x = 0.85;
        this.rightLeg.hip.rotation.x = 0.4;
        this.rightLeg.knee.rotation.x = 0.5;

        this.leftArm.shoulder.rotation.x = -0.85;
        this.leftArm.forearm.rotation.x = -0.75;
        this.rightArm.shoulder.rotation.x = -0.85;
        this.rightArm.forearm.rotation.x = -0.75;

        this.bodyGroup.position.y = 1.05;
        this.bodyGroup.rotation.x = 0.15;
    }

    animateLanding(delta) {
        this.leftLeg.hip.rotation.x = 0.35;
        this.leftLeg.knee.rotation.x = 0.65;
        this.rightLeg.hip.rotation.x = 0.35;
        this.rightLeg.knee.rotation.x = 0.65;

        this.leftArm.shoulder.rotation.x = -0.35;
        this.leftArm.forearm.rotation.x = -0.55;
        this.rightArm.shoulder.rotation.x = -0.35;
        this.rightArm.forearm.rotation.x = -0.55;

        this.bodyGroup.position.y = 0.92;
        this.bodyGroup.rotation.x = 0.18;
    }

    animateInteract(delta) {
        this.rightArm.shoulder.rotation.x = THREE.MathUtils.lerp(this.rightArm.shoulder.rotation.x, -1.35, delta * 8);
        this.rightArm.shoulder.rotation.y = THREE.MathUtils.lerp(this.rightArm.shoulder.rotation.y, -0.25, delta * 8);
        this.rightArm.forearm.rotation.x = THREE.MathUtils.lerp(this.rightArm.forearm.rotation.x, -0.25, delta * 8);

        this.leftArm.shoulder.rotation.x = THREE.MathUtils.lerp(this.leftArm.shoulder.rotation.x, -0.2, delta * 8);
        this.leftArm.forearm.rotation.x = -0.45;

        this.bodyGroup.rotation.x = 0.08;
    }

    animateInspect(delta) {
        this.rightArm.shoulder.rotation.x = THREE.MathUtils.lerp(this.rightArm.shoulder.rotation.x, -0.95, delta * 8);
        this.leftArm.shoulder.rotation.x = THREE.MathUtils.lerp(this.leftArm.shoulder.rotation.x, -0.95, delta * 8);
        this.rightArm.forearm.rotation.x = THREE.MathUtils.lerp(this.rightArm.forearm.rotation.x, -0.85, delta * 8);
        this.leftArm.forearm.rotation.x = THREE.MathUtils.lerp(this.leftArm.forearm.rotation.x, -0.85, delta * 8);
    }

    animateVictory(delta, time) {
        this.rightArm.shoulder.rotation.x = -1.6;
        this.rightArm.shoulder.rotation.z = -0.4;
        this.leftArm.shoulder.rotation.x = -0.1;
        this.bodyGroup.rotation.x = -0.1;
    }

    updateAnimation(delta, time, isMoving, isSprinting, isJumping, isGrounded) {
        let state = 'IDLE';
        if (isJumping || !isGrounded) {
            state = 'JUMP';
        } else if (isMoving) {
            state = isSprinting ? 'SPRINT' : 'WALK';
        }
        this.update(delta, time, state, { isGrounded, speed: isMoving ? (isSprinting ? 13 : 7) : 0 });
    }
}
