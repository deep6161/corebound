import {
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    Color,
    Group,
    Box3,
    Vector3,
    Mesh,
    ExtrudeGeometry,
    MeshStandardMaterial,
    MeshPhysicalMaterial,
    MeshBasicMaterial,
    InstancedMesh,
    BoxGeometry,
    Object3D,
    AmbientLight,
    DirectionalLight,
    PointLight,
    BufferGeometry,
    Points,
    PointsMaterial,
    Float32BufferAttribute,
    ShaderMaterial,
    SphereGeometry,
    BackSide,
    OctahedronGeometry,
    IcosahedronGeometry,
    TorusGeometry,
    EdgesGeometry,
    LineSegments,
    LineBasicMaterial,
    RingGeometry,
    DoubleSide,
    AdditiveBlending
} from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { animate, createTimeline, createTimer, stagger, utils, cubicBezier, linear } from 'animejs';
import { getInstances } from 'animejs/adapters/three';

// ==========================================
// 3D CINEMATIC SOUND EFFECTS
// ==========================================
const dropSound = new Audio('./drop.mp3');
dropSound.preload = 'auto';

const hit1Sound = new Audio('./hit.mp3');
hit1Sound.preload = 'auto';

const hit2Sound = new Audio('./hit.mp3');
hit2Sound.preload = 'auto';

const boomSound = new Audio('./boom.mp3');
boomSound.preload = 'auto';

let dropPlayed = false;
let hit1Played = false;
let hit2Played = false;
let boomPlayed = false;
let audioUnlocked = false;

// Universal audio unlocker for browser autoplay policies
function unlockAudioEngine() {
    if (audioUnlocked) return;
    audioUnlocked = true;

    const allSounds = [dropSound, hit1Sound, hit2Sound, boomSound];
    allSounds.forEach(s => {
        try {
            const p = s.play();
            if (p !== undefined) {
                p.then(() => {
                    s.pause();
                    s.currentTime = 0;
                }).catch(() => {});
            }
        } catch (e) {}
    });
}

// Immediately capture any user gesture to unlock all sounds
window.addEventListener('pointerdown', unlockAudioEngine, { passive: true });
window.addEventListener('click', unlockAudioEngine, { passive: true });
window.addEventListener('keydown', unlockAudioEngine, { passive: true });
window.addEventListener('touchstart', unlockAudioEngine, { passive: true });

const LETTER_IDS = ['c', 'o1', 'r', 'e', 'b', 'o2', 'u', 'n', 'd'];
const DEPTH = 0.35;
const ITALIC_SKEW = 0;

const svgEl = document.querySelector('#logo');
const data = new SVGLoader().parse(svgEl.outerHTML);
const parsed = {};

function flipShapeY(shape) {
    const flipPath = (p) => p.curves.forEach((c) => {
        if (c.v0) c.v0.y = -c.v0.y;
        if (c.v1) c.v1.y = -c.v1.y;
        if (c.v2) c.v2.y = -c.v2.y;
        if (c.v3) c.v3.y = -c.v3.y;
    });
    flipPath(shape);
    shape.holes.forEach(flipPath);
}

let pathIndex = 0;
for (const path of data.paths) {
    const id = (path.userData && path.userData.node && path.userData.node.id) || LETTER_IDS[pathIndex];
    pathIndex++;
    if (!id) continue;
    const shapes = SVGLoader.createShapes(path);
    shapes.forEach(flipShapeY);
    const geom = new ExtrudeGeometry(shapes, { depth: DEPTH, bevelEnabled: false });
    const bbox = new Box3().setFromBufferAttribute(geom.attributes.position);
    const center = bbox.getCenter(new Vector3());
    const size = bbox.getSize(new Vector3());
    geom.translate(-center.x, -center.y, -center.z);
    parsed[id] = { geom, center, size };
}

const meshes = {};
const logoGroup = new Group();
for (const id of LETTER_IDS) {
    if (!parsed[id]) continue;
    const { geom, center, size } = parsed[id];

    const mesh = new Mesh(geom, new MeshStandardMaterial({
        color: new Color('#ffffff'),
        emissive: new Color('#8b5cf6'),
        emissiveIntensity: 0.45,
        roughness: 0.08,
        metalness: 0.95,
    }));
    mesh.position.copy(center);
    mesh.userData.halfHeight = size.y / 2;
    meshes[id] = mesh;
    logoGroup.add(mesh);
}

const FLOOR_COLS = 31;
const FLOOR_ROWS = 31;
const tileSize = 1;

const logoBox = new Box3().setFromObject(logoGroup);
const logoSize = logoBox.getSize(new Vector3());
const logoCenter = logoBox.getCenter(new Vector3());
const TARGET_WIDTH = 28;
const scale = TARGET_WIDTH / logoSize.x;
logoGroup.scale.setScalar(scale);
logoGroup.position.set(-logoCenter.x * scale, tileSize / 2, 0);

const wrapper = new Group();
wrapper.add(logoGroup);
wrapper.position.y = -5;

// Cosmic Core Palette - Clearly Visible Luminous Celestial Surface
const SCENE_CRYSTAL = '#2a2254';
const SCENE_EMISSIVE = '#4c1d95';
const HORIZON_PURPLE = '#260e52';
const SKY_VOID = '#03010c';
const BG = '#03010c';

const scene = new Scene();
scene.background = new Color(BG);

const skyMaterial = new ShaderMaterial({
    uniforms: {
        topColor: { value: new Color(SKY_VOID) },
        bottomColor: { value: new Color(HORIZON_PURPLE) },
        offset: { value: 35 },
        exponent: { value: 0.65 },
    },
    side: BackSide,
    fog: false,
    vertexShader: `
    varying vec3 vWorldPosition;
    void main() {
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
    fragmentShader: `
    uniform vec3 topColor; uniform vec3 bottomColor;
    uniform float offset; uniform float exponent;
    varying vec3 vWorldPosition;
    void main() {
      float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
      gl_FragColor = vec4(mix(bottomColor, topColor, pow(max(h, 0.0), exponent)), 1.0);
      #include <colorspace_fragment>
    }`,
});
const sky = new Mesh(new SphereGeometry(600, 32, 15), skyMaterial);
scene.add(sky);
scene.add(wrapper);

// Ambient 3D Cosmic Starfield
const starCount = 350;
const starGeo = new BufferGeometry();
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 140;
    starPositions[i + 1] = Math.random() * 80 - 15;
    starPositions[i + 2] = (Math.random() - 0.5) * 140;
}
starGeo.setAttribute('position', new Float32BufferAttribute(starPositions, 3));
const starMat = new PointsMaterial({
    color: new Color('#c4b5fd'),
    size: 0.35,
    transparent: true,
    opacity: 0.8
});
const starField = new Points(starGeo, starMat);
scene.add(starField);

// Deep Obsidian & Cosmic Crystal Floor
const floorGroup = new Group();
const floor = new InstancedMesh(
    new BoxGeometry(tileSize, tileSize, tileSize),
    new MeshStandardMaterial({
        color: new Color(SCENE_CRYSTAL),
        emissive: new Color(SCENE_EMISSIVE),
        emissiveIntensity: 0.65,
        roughness: 0.3,
        metalness: 0.6
    }),
    FLOOR_COLS * FLOOR_ROWS,
);
const dummy = new Object3D();
for (let r = 0; r < FLOOR_ROWS; r++) {
    for (let c = 0; c < FLOOR_COLS; c++) {
        dummy.position.set(c - (FLOOR_COLS - 1) / 2, 0, r - (FLOOR_ROWS - 1) / 2);
        dummy.updateMatrix();
        floor.setMatrixAt(r * FLOOR_COLS + c, dummy.matrix);
    }
}
floorGroup.add(floor);
const tiles = getInstances(floor);

const FLOOR_HALF_X = FLOOR_COLS * tileSize / 2;
const FLOOR_HALF_Z = FLOOR_ROWS * tileSize / 2;
const SKIRT_EXT = 5;
const skirts = [];
const addSkirt = (width, depth, x, z) => {
    const skirt = new Mesh(new BoxGeometry(width, tileSize, depth), floor.material);
    skirt.position.set(x, 0, z);
    floorGroup.add(skirt);
    skirts.push(skirt);
};
addSkirt(SKIRT_EXT, 2 * FLOOR_HALF_Z, FLOOR_HALF_X + SKIRT_EXT / 2, 0);
addSkirt(SKIRT_EXT, 2 * FLOOR_HALF_Z, -FLOOR_HALF_X - SKIRT_EXT / 2, 0);
addSkirt(2 * FLOOR_HALF_X + 2 * SKIRT_EXT, SKIRT_EXT, 0, FLOOR_HALF_Z + SKIRT_EXT / 2);
addSkirt(2 * FLOOR_HALF_X + 2 * SKIRT_EXT, SKIRT_EXT, 0, -FLOOR_HALF_Z - SKIRT_EXT / 2);
scene.add(floorGroup);

// ======================================================
// THE CELESTIAL HYPER-CRYSTAL (PREMIUM CORE ARTIFACT)
// ======================================================
const cube = new Group();

// 1. Outer Faceted Crystal Prism (Diamond Physical Glass with Refraction)
const crystalOuterGeo = new OctahedronGeometry(tileSize * 0.95, 0);
crystalOuterGeo.scale(0.85, 1.35, 0.85);

const crystalOuterMat = new MeshPhysicalMaterial({
    color: new Color('#ffffff'),
    emissive: new Color('#00d8ff'),
    emissiveIntensity: 0.35,
    roughness: 0.04,
    metalness: 0.05,
    transmission: 0.88,    // Physical glass transparency
    ior: 2.42,            // Diamond refractive index
    thickness: 1.6,
    reflectivity: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transparent: true,
    opacity: 0.92
});
const crystalOuterMesh = new Mesh(crystalOuterGeo, crystalOuterMat);
cube.add(crystalOuterMesh);

// 2. Luminous Crystalline Facet Wireframe (Laser-Sharp Cyan Edge Highlights)
const edgeGeo = new EdgesGeometry(crystalOuterGeo);
const edgeMat = new LineBasicMaterial({
    color: new Color('#00ffff'),
    transparent: true,
    opacity: 0.95
});
const crystalEdges = new LineSegments(edgeGeo, edgeMat);
cube.add(crystalEdges);

// 3. Inner Hyper-Dense Energy Singularity (Pulsating Radiant Core)
const innerCoreGeo = new IcosahedronGeometry(tileSize * 0.42, 0);
const innerCoreMat = new MeshStandardMaterial({
    color: new Color('#00ffff'),
    emissive: new Color('#9333ea'),
    emissiveIntensity: 3.5,
    roughness: 0.1,
    metalness: 0.9
});
const innerCoreMesh = new Mesh(innerCoreGeo, innerCoreMat);
innerCoreMesh.rotation.set(0.5, 0.5, 0.5);
cube.add(innerCoreMesh);

// 4. High-Lumen Dual Dynamic PointLights
const coreLight = new PointLight('#00ffff', 5.5, 18);
cube.add(coreLight);

const violetHaloLight = new PointLight('#9333ea', 3.5, 12);
cube.add(violetHaloLight);

scene.add(cube);

// Cosmic Cinematic Lighting - High Visibility Grid Illumination
const ambient = new AmbientLight('#581c87', 1.8);
scene.add(ambient);
const keyLight = new DirectionalLight('#ffffff', 2.8);
keyLight.position.set(100, 150, 200);
scene.add(keyLight);
const rimLight = new DirectionalLight('#00e5ff', 3.8);
rimLight.position.set(-200, 60, -150);
scene.add(rimLight);
const violetFill = new DirectionalLight('#c084fc', 3.2);
violetFill.position.set(150, -50, -150);
scene.add(violetFill);
const topGridLight = new DirectionalLight('#818cf8', 1.8);
topGridLight.position.set(0, 120, 0);
scene.add(topGridLight);

// ======================================================
// SURFACE IMPACT & ABSORPTION LIGHT ENERGY WAVE
// ======================================================
const impactLight = new PointLight('#00ffff', 0, 40);
impactLight.position.set(0, 0.5, 0);
scene.add(impactLight);

const ringMat1 = new MeshBasicMaterial({
    color: new Color('#00ffff'),
    side: DoubleSide,
    transparent: true,
    opacity: 0,
    blending: AdditiveBlending,
    depthWrite: false
});
const impactRing1 = new Mesh(new RingGeometry(0.2, 0.9, 64), ringMat1);
impactRing1.rotation.x = -Math.PI / 2;
impactRing1.position.set(0, 0.05, 0);
impactRing1.scale.set(0.01, 0.01, 0.01);
scene.add(impactRing1);

const ringMat2 = new MeshBasicMaterial({
    color: new Color('#c084fc'),
    side: DoubleSide,
    transparent: true,
    opacity: 0,
    blending: AdditiveBlending,
    depthWrite: false
});
const impactRing2 = new Mesh(new RingGeometry(0.3, 1.4, 64), ringMat2);
impactRing2.rotation.x = -Math.PI / 2;
impactRing2.position.set(0, 0.06, 0);
impactRing2.scale.set(0.01, 0.01, 0.01);
scene.add(impactRing2);

// ======================================================
// CELESTIAL IMPACT STARDUST SPARKS (3D PARTICLES)
// ======================================================
const SPARK_COUNT = 85;
const sparkGeo = new BufferGeometry();
const sparkPositions = new Float32Array(SPARK_COUNT * 3);
const sparkColors = new Float32Array(SPARK_COUNT * 3);
const sparkVelocities = [];

const sparkPalette = [
    new Color('#00ffff'),
    new Color('#ffffff'),
    new Color('#c084fc'),
    new Color('#a855f7'),
    new Color('#38bdf8')
];

for (let i = 0; i < SPARK_COUNT; i++) {
    const i3 = i * 3;
    sparkPositions[i3] = 0;
    sparkPositions[i3 + 1] = 0.2;
    sparkPositions[i3 + 2] = 0;

    const col = sparkPalette[Math.floor(Math.random() * sparkPalette.length)];
    sparkColors[i3] = col.r;
    sparkColors[i3 + 1] = col.g;
    sparkColors[i3 + 2] = col.b;

    // Outward radial explosive fountain velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = 2.2 + Math.random() * 4.8;
    const upSpeed = 2.4 + Math.random() * 4.2;
    sparkVelocities.push({
        vx: Math.cos(angle) * speed,
        vy: upSpeed,
        vz: Math.sin(angle) * speed
    });
}

sparkGeo.setAttribute('position', new Float32BufferAttribute(sparkPositions, 3));
sparkGeo.setAttribute('color', new Float32BufferAttribute(sparkColors, 3));

const sparkMat = new PointsMaterial({
    size: 0.42,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: AdditiveBlending,
    depthWrite: false
});

const sparkPoints = new Points(sparkGeo, sparkMat);
scene.add(sparkPoints);

const sparkAnim = { progress: 0, opacity: 0 };

const camera = new PerspectiveCamera(35, innerWidth / innerHeight, 0.01, 100);
const cameraRig = new Group();
cameraRig.add(camera);
scene.add(cameraRig);

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio || 1);
document.body.appendChild(renderer.domElement);
renderer.domElement.style.opacity = '0';

addEventListener('resize', () => {
    const aspect = innerWidth / innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});

const letters = LETTER_IDS.map(id => meshes[id]).filter(Boolean);
const bottomOrigin = (m) => `0 ${-m.userData.halfHeight} 0`;
letters.forEach(m => utils.set(m, { skewX: -ITALIC_SKEW, transformOrigin: bottomOrigin(m) }));

utils.set(camera, { x: 0, y: 5.64, z: 20.66, rotateX: -14.73, fov: 60, zoom: 1, near: 1, far: 2000 });
const DEG2RAD = Math.PI / 180;
const FLATTEN_BASE_FOV = camera.fov;
const FLATTEN_DIST_NUM = camera.position.z * Math.tan(FLATTEN_BASE_FOV * 0.5 * DEG2RAD);
const flattenDezoom = { value: 1 };

createTimer({
    priority: 0,
    onUpdate: () => {
        camera.position.z = FLATTEN_DIST_NUM * flattenDezoom.value / Math.tan(camera.fov * 0.5 * DEG2RAD);
        if (innerCoreMesh) {
            innerCoreMesh.rotation.y += 0.035;
            innerCoreMesh.rotation.x += 0.02;
        }

        // Animate Celestial Impact Stardust Sparks
        if (sparkMat && sparkAnim.opacity > 0.001) {
            sparkMat.opacity = sparkAnim.opacity;
            const p = sparkAnim.progress;
            const pos = sparkGeo.attributes.position.array;
            for (let i = 0; i < SPARK_COUNT; i++) {
                const i3 = i * 3;
                const v = sparkVelocities[i];
                pos[i3] = v.vx * p;
                pos[i3 + 1] = Math.max(0.08, 0.2 + (v.vy * p) - (p * p * 5.2));
                pos[i3 + 2] = v.vz * p;
            }
            sparkGeo.attributes.position.needsUpdate = true;
        }

        renderer.render(scene, camera);
    },
});

utils.set(skyMaterial, { topColor: '#000000', bottomColor: '#05021a', offset: -38, exponent: 1.15 });
utils.set(tiles, { x: stagger(1, { grid: true, from: 'center', axis: 'x' }), z: stagger(1, { grid: true, from: 'center', axis: 'z' }), y: 0 });
utils.set(cube, { x: 0, y: 0, z: 0, transformOriginY: -0.5 });
utils.set(impactRing1, { scale: 0.01 });
utils.set(impactRing2, { scale: 0.01 });
utils.set(sparkAnim, { progress: 0, opacity: 0 });

const centerTile = tiles[Math.floor(FLOOR_ROWS / 2) * FLOOR_COLS + Math.floor(FLOOR_COLS / 2)];
const EXPLODE_RADIUS = 10;
const tileRingDistance = (i) => Math.hypot((i % FLOOR_COLS) - Math.floor(FLOOR_COLS / 2), Math.floor(i / FLOOR_COLS) - Math.floor(FLOOR_ROWS / 2));
const getCenterTiles = (radius) => tiles.filter((tile, i) => tileRingDistance(i) <= radius);
const getOuterTiles = (radius) => tiles.filter((tile, i) => tileRingDistance(i) > radius);

const explodeDurX = utils.createSeededRandom(4, 800, 1279);
const explodeDurZ = utils.createSeededRandom(0, 800, 1279);
const explodeDurY = utils.createSeededRandom(7, 800, 1279);
const explodeRotX = utils.createSeededRandom(7, -1080, 1080);
const explodeRotY = utils.createSeededRandom(13, -1080, 1080);
const explodeRotZ = utils.createSeededRandom(21, -1080, 1080);
const explodeScaleDur = utils.createSeededRandom(0, 500, 1200);

const shake = (amp, cycles, { decay = 1, sweep = 0, settle = 0, dir = 1, center = 0 } = {}) =>
    t => center + dir * (settle + (amp - settle) * (1 - t) ** decay) * Math.sin(cycles * (t + sweep * t * t) * 2 * Math.PI);
const lateShake = (amp, cycles, start, opts = {}) => {
    const inner = shake(amp, cycles, opts);
    return t => t < start ? 0 : inner((t - start) / (1 - start));
};

const tl = createTimeline({ id: 'COREBOUND 3D logo', autoplay: false })
    .add(renderer.domElement, { opacity: [0, 1], duration: 1300, ease: 'inOut(2)' }, 0)
    .add(camera, {
        rotateX: [
            { to: 38, duration: 700, ease: 'inOut(2)' }, { to: 41, duration: 500, ease: 'inOutSine' },
            { to: 40.5, duration: 200, ease: 'inOutSine' }, { to: 36, duration: 180, ease: 'in(2)' },
            { to: 24, duration: 80, ease: 'in(2)' }, { to: -10, duration: 40, ease: 'in(1.5)' },
            { to: -16.5, duration: 90, delay: 20, ease: 'out(2)' }, { to: -14.73, duration: 190, ease: 'inOutSine' }
        ],
        y: [
            { to: 6.3, duration: 900, ease: 'inOut(2)' }, { to: 6.4, duration: 500, ease: 'inOutSine' },
            { to: 6.15, duration: 180, ease: 'in(2)' }, { to: 5.04, duration: 120, ease: 'in(2)' }
        ],
    }, 300)

    .add(cube, {
        y: [
            { from: 24, to: 1, duration: 300, delay: 1700, ease: 'in(5.0825)' },
            { from: 0, to: 0.138, duration: 60, ease: cubicBezier(0, 1.1575, 0.5712, 0.9605) },
            { to: -0.75, duration: 1040, ease: cubicBezier(0, 1.1575, 0.5712, 0.9605) },
            { from: -1.75, to: -2.5, duration: 146, ease: 'out(9.8523)' }
        ],
        scaleX: [{ from: 0, to: 1, duration: 2000 }, { from: 1.3, to: 1, duration: 100, ease: 'out(2)' }],
        scaleY: [{ from: 5, to: 2, duration: 2000 }, { to: 1.25, duration: 200, ease: cubicBezier(0.1, 0.7, 0.5763, 0.7728) }, { to: 1, duration: 900, ease: cubicBezier(0.1, 0.7, 0.5763, 0.7728) }],
        scaleZ: [{ from: 0, to: 1, duration: 2000 }, { from: 1.3, to: 1, duration: 100, ease: 'out(2)' }],
        rotateY: { to: 720, duration: 3000, ease: 'outExpo' },
        ease: 'in(2.4146)'
    }, 0)

    .set(centerTile, { scale: 0 }, 2000)
    // ⚡ Luminous Energy Absorption Surge across the Surface
    .add(impactLight, {
        intensity: [
            { from: 0, to: 35, duration: 80, ease: 'outQuad' },
            { to: 8, duration: 350, ease: 'outQuad' },
            { to: 0, duration: 1100, ease: 'inOutQuad' }
        ]
    }, 2000)
    .add(impactRing1, {
        scale: { from: 0.1, to: 22, duration: 1150, ease: 'outExpo' }
    }, 2000)
    .add(ringMat1, {
        opacity: [
            { from: 0, to: 1, duration: 60 },
            { to: 0, duration: 1090, ease: 'outQuad' }
        ]
    }, 2000)
    .add(impactRing2, {
        scale: { from: 0.1, to: 28, duration: 1400, delay: 50, ease: 'outExpo' }
    }, 2000)
    .add(ringMat2, {
        opacity: [
            { from: 0, to: 0.85, duration: 80, delay: 50 },
            { to: 0, duration: 1250, ease: 'outQuad' }
        ]
    }, 2000)
    // ✨ Stardust Particle Sparks Burst on Crystal Impact
    .add(sparkAnim, {
        progress: { from: 0, to: 1, duration: 1100, ease: 'outExpo' },
        opacity: [
            { from: 0, to: 1, duration: 40 },
            { to: 0, duration: 1060, ease: 'outQuad' }
        ]
    }, 2000)
    .add(tiles, {
        y: [
            { from: 0, to: stagger([0.15, 0], { from: 'center', ease: linear('0', '0.185 70.69%', '0.4644 84.63%', '0.7852 95.62%', '1'), grid: true }), duration: 50, delay: stagger([0, 451], { from: 'center', ease: 'in(2.5507)', grid: true }), ease: cubicBezier(0.5621, 0.9568, 0.5, 1) },
            { to: stagger([-1.5, 0], { from: 'center', ease: linear('0', '0.2812 12.72%', '0.5478 20.84%', '1 41.29%', '1'), grid: true, jitter: [0.102, 0], seed: 0 }), duration: 1050, ease: cubicBezier(0, 0.8, 0, 1.0128) },
            { to: stagger([-3, 0], { from: 'center', ease: linear('0', '0 14.17%', '0.5317 25.26%', '0.8904 47.35%', '1 47.8%', '1'), grid: true, jitter: [0.3, 0], seed: 0 }), duration: stagger([0, 656], { from: 'center', ease: linear('0', '0.0368 14.54%', '0.3042 62.23%', '1 62.24%', '1'), grid: true, jitter: [50, 0], seed: 0 }), ease: cubicBezier(0, 1.0807, 0.3512, 1.2537) }
        ],
        rotateX: { to: stagger([0, 0], { from: 'center', ease: linear('0', '0 13.93%', '0.2419 40.77%', '1 55.03%', '1'), grid: true, jitter: [20, 0], seed: 6 }), duration: 1200 },
        rotateY: { to: stagger([0, 0], { from: 'center', ease: linear('0', '0 13.93%', '0.2419 40.77%', '1 55.03%', '1'), grid: true, jitter: [20, 0], seed: 12 }), duration: 1260 },
        rotateZ: { to: stagger([0, 0], { from: 'center', ease: linear('0', '0 13.93%', '0.2419 40.77%', '1 55.03%', '1'), grid: true, jitter: [20, 0], seed: 3 }), duration: 1200, delay: 50 },
    }, 2000)
    .add(camera, {
        y: { from: 0, to: 1, duration: 1412, ease: 'linear', modifier: t => shake(0.12, 15, { decay: 2, center: 5.64 })(t) + lateShake(0.97, 2, 0.78, { decay: 1.6 })(t) },
        rotateZ: { from: 0, to: 1, duration: 1437, ease: 'linear', modifier: t => shake(0.42, 10, { decay: 1.8 })(t) + lateShake(0.42, 2, 0.79, { decay: 1.4 })(t) },
        ease: 'inOutSine',
    }, 2000)

    .add(getCenterTiles(8), {
        y: [
            { to: stagger([-3.5, -0.82], { from: 'center', ease: linear('0', '0.0878 0.01%', '0.3904 50.14%', '0.7766 68.95%', '1'), grid: true, jitter: [0.3, 0], seed: 0 }), duration: 260, ease: 'out(3)' },
            { to: stagger([1.4, -0.72], { from: 'center', ease: linear('0', '0 28.61%', '0.27 28.62%', '0.7766 68.95%', '1'), grid: true, jitter: [0.3, 0], seed: 0 }), duration: 4100, delay: 440, ease: cubicBezier(0.2423, -0.0053, 0.367, 0.5896) }
        ],
    }, 3200)

    .label('POP', 8000)
    .label('slowmo start', 'POP-=0')
    .label('slowmo end', 'POP+=500')

    .add(cube, { scale: 0, duration: 250, ease: 'inBack' }, 'POP-=100')
    .add(skyMaterial, {
        topColor: '#03010c',
        bottomColor: '#03010c',
        duration: 800,
        ease: 'outQuad'
    }, 'POP')

    .add(camera, { zoom: { to: 2, duration: 5500, ease: cubicBezier(0.6985, 0.1061, 0.5527, 0.7364) } }, 2500)
    .add(cameraRig, {
        rotateY: [{ from: -270, to: -180, duration: 3600 }, { to: 0, duration: 700, delay: 1000, ease: cubicBezier(0.375, -0.0148, 0, 1.0101) }],
        rotateX: { to: 0, duration: 1900, delay: 2700 },
        y: [{ to: 0, duration: 1900, delay: 2700 }, { to: 0, duration: 300, ease: 'out(2)' }],
        ease: 'inOut(2)'
    }, 3400)

    .add(getCenterTiles(EXPLODE_RADIUS), {
        x: { to: stagger([1, 40], { from: 'center', grid: true, axis: 'x', jitter: 5, seed: 0 }), duration: () => explodeDurX(), delay: stagger([0, 137], { from: 'center', grid: true }), ease: 'out(5.3605)' },
        z: { to: stagger([1, 40], { from: 'center', grid: true, axis: 'z' }), duration: () => explodeDurZ(), delay: stagger([0, 137], { from: 'center', grid: true, jitter: 5, seed: 0 }), ease: 'out(5.3605)' },
        y: { to: stagger([40, 1], { from: 'center', ease: cubicBezier(0.3326, 0.0289, 0.9886, 0.4057), grid: true, jitter: 5, seed: 0 }), duration: () => explodeDurY(), delay: stagger([0, 137], { from: 'center', grid: true }), ease: 'out(5.3605)' },
        rotateX: { to: () => explodeRotX(), duration: 815, delay: stagger([0, 314], { from: 'center', grid: true }), ease: 'out(2)' },
        rotateY: { to: () => explodeRotY(), duration: 815, delay: stagger([0, 314], { from: 'center', grid: true }), ease: 'out(2)' },
        rotateZ: { to: () => explodeRotZ(), duration: 815, delay: stagger([0, 314], { from: 'center', grid: true }), ease: 'out(2)' },
        scale: { to: 0, duration: () => explodeScaleDur(), delay: stagger([0, 314], { from: 'center', grid: true }), ease: 'out(2.8731)' },
        duration: 113,
        delay: stagger([0, 210], { from: 'center', grid: true, seed: 0 }),
        ease: 'linear',
    }, 'POP-=15')
    .add([...getOuterTiles(EXPLODE_RADIUS), ...skirts], { y: { to: -50, duration: 604, delay: 146, ease: cubicBezier(0.8109, 0.0308, 0.9152, 0.5479) } }, 'POP-=150')
    .add(letters, {
        y: [{ from: -0.39, to: 3.23, duration: 240, ease: cubicBezier(0.225, 1, 0.915, 0.98) }, { to: 1.9, duration: 120, delay: 20, ease: 'inQuad' }, { to: 1.9, duration: 120, ease: 'outQuad' }],
        scaleX: [{ to: [0.25, 0.85], duration: 240, ease: 'outQuad' }, { to: 1.08, duration: 120, delay: 85, ease: 'inOutSine' }, { to: 1, duration: 260, delay: 25, ease: 'outQuad' }],
        scaleY: [{ to: [0.4, 1.5], duration: 120, ease: 'outSine' }, { to: 0.6, duration: 120, delay: 180, ease: 'inOutSine' }, { to: 1.2, duration: 180, delay: 25, ease: 'outQuad' }, { to: 1, duration: 190, delay: 15, ease: 'outQuad' }],
        duration: 400,
        ease: 'outSine',
        delay: stagger(60, { from: 'center' }),
    }, 'POP')
    .add(wrapper, { scale: { from: 1.25, to: 1, duration: 600 }, y: { from: -5.28, to: 0, duration: 600 }, duration: 900, ease: 'outExpo' }, 'POP')
    .add(camera, {
        y: { to: 7, duration: 1100, ease: 'out(4.9225)' },
        rotateX: [{ to: 9.1, duration: 260, ease: 'out(3.2713)' }, { to: 0, duration: 700, ease: 'out(3)', delay: 140 }],
        zoom: { to: 1, duration: 400, ease: 'out(3)' }
    }, 'POP')
    .add(letters, { skewX: 0, duration: 1350, ease: 'outElastic(1.1, .9)' }, 'POP+=1050')
    .add(camera, { fov: { to: 2, duration: 700, ease: 'out(2)' } }, 'POP+=1450')
    .add(flattenDezoom, { value: { to: 1.5, duration: 1125 }, duration: 1150, ease: 'out(2)' }, 'POP+=1050')

    .init();

// ======================================================
// SEAMLESS CINEMATIC NAVIGATION TO STORY.HTML
// When 3D Awakening Intro completes -> smoothly transition to story.html
// ======================================================
let isNavigating = false;
let player = null;

function navigateToNextStep() {
    if (isNavigating) return;
    isNavigating = true;

    // Smoothly fade page to deep space void
    document.body.style.transition = 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
    document.body.style.opacity = '0';

    setTimeout(() => {
        let isOldUser = false;
        try {
            const rawUser = localStorage.getItem('corebound_sentinel_user');
            const rawPrefs = localStorage.getItem('corebound_guardian_prefs');
            if (rawUser && rawPrefs) {
                const user = JSON.parse(rawUser);
                if (user && (user.isCalibrated || user.hasWatchedStory)) {
                    isOldUser = true;
                }
            }
        } catch(e) {}

        if (isOldUser) {
            // Old / existing user: Skip opening story and enter World Map directly
            window.location.href = 'level.html';
        } else {
            // First-time user: Compulsory opening story cutscene
            window.location.href = 'story.html';
        }
    }, 700);
}

function start3DAnimation() {
    player = animate(tl, {
        id: 'Player',
        currentTime: [
            { to: () => tl.labels['slowmo start'], duration: () => tl.labels['slowmo start'], ease: cubicBezier(1, 0.7, 1, 0.85) },
            { to: () => tl.labels['slowmo end'], duration: 2000, ease: cubicBezier(0.0314, 0.3616, 0.8994, -0.2122) },
            { to: () => tl.duration, duration: () => tl.duration - tl.labels['slowmo end'] }
        ],
        duration: tl.duration,
        loop: false,
        ease: 'linear',
        onUpdate: () => {
            const t = tl.currentTime;

            if (t >= 1700 && !dropPlayed) {
                dropSound.currentTime = 0;
                dropSound.play().then(() => {
                    dropPlayed = true;
                }).catch(e => {
                    console.log('drop sound waiting for user gesture:', e.message);
                });
            }
            if (t >= 2000 && !hit1Played) {
                hit1Sound.currentTime = 0;
                hit1Sound.play().then(() => {
                    hit1Played = true;
                }).catch(e => {
                    console.log('hit1 sound waiting for user gesture:', e.message);
                });
            }
            if (t >= 3100 && !hit2Played) {
                hit2Sound.currentTime = 0;
                hit2Sound.play().then(() => {
                    hit2Played = true;
                }).catch(e => {
                    console.log('hit2 sound waiting for user gesture:', e.message);
                });
            }
            if (t >= 8000 && !boomPlayed) {
                boomSound.currentTime = 0;
                boomSound.play().then(() => {
                    boomPlayed = true;
                }).catch(e => {
                    console.log('boom sound waiting for user gesture:', e.message);
                });
            }
        },
        onComplete: () => {
            // 3D Animation completed -> check user status and navigate appropriately
            navigateToNextStep();
        }
    });
}

// 🚀 Automatically start the 3D intro animation on page load
start3DAnimation();