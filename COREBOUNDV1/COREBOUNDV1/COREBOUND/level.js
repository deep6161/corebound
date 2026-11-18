/**
 * COREBOUND — World Map & Cosmic Level Engine
 * Unified logic for Starfield, Island Physics, Nova AI Speech, Audio, and Chapter Transitions.
 */

// ==========================================================================
// 1. STARFIELD, COSMIC METEORS & LIVING COSMOS ANIMATION
// ==========================================================================
(function () {
    const c = document.getElementById('starsCanvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    let w = c.width = innerWidth;
    let h = c.height = innerHeight;
    const nebula1 = document.querySelector('.nebula-1');
    const nebula2 = document.querySelector('.nebula-2');
    const nebula3 = document.querySelector('.nebula-3');

    function onResize() {
        w = c.width = innerWidth;
        h = c.height = innerHeight;
    }
    window.addEventListener('resize', onResize);

    // Starfield with Depth & Living Motion
    const stars = [];
    const colors = ['#edf2f7', '#38bdf8', '#c4b5fd', '#8b5cf6', '#00e5ff', '#f5b942'];

    // Layer 0: Far Stars (Tiny, soft twinkle, slow deep drift)
    for (let i = 0; i < 80; i++) {
        stars.push({
            layer: 0,
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 0.65 + 0.35,
            baseAlpha: Math.random() * 0.45 + 0.2,
            phase: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.015 + 0.006,
            vx: (Math.random() - 0.5) * 0.04,
            vy: (Math.random() - 0.5) * 0.04,
            c: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    // Layer 1: Mid Stars & Constellation Nodes
    for (let i = 0; i < 55; i++) {
        stars.push({
            layer: 1,
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 0.9 + 0.7,
            baseAlpha: Math.random() * 0.55 + 0.3,
            phase: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.02 + 0.008,
            vx: (Math.random() - 0.5) * 0.07,
            vy: -Math.random() * 0.06 - 0.02,
            c: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    // Layer 2: Near Glowing Cosmic Dust Particles
    for (let i = 0; i < 32; i++) {
        stars.push({
            layer: 2,
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.5 + 1.1,
            baseAlpha: Math.random() * 0.45 + 0.25,
            phase: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.015 + 0.005,
            vx: (Math.random() - 0.5) * 0.11,
            vy: -Math.random() * 0.12 - 0.04,
            c: Math.random() > 0.4 ? '#38bdf8' : (Math.random() > 0.5 ? '#8b5cf6' : '#00e5ff')
        });
    }

    // Distant Celestial Nodes (Subtle ancient orbital points)
    const celestialNodes = [
        { xPct: 0.15, yPct: 0.28, r: 14, rot: 0, rotSpeed: 0.003, color: 'rgba(139, 92, 246, 0.12)' },
        { xPct: 0.85, yPct: 0.35, r: 18, rot: 0, rotSpeed: -0.002, color: 'rgba(0, 229, 255, 0.11)' },
        { xPct: 0.28, yPct: 0.82, r: 12, rot: 0, rotSpeed: 0.0025, color: 'rgba(56, 189, 248, 0.10)' },
        { xPct: 0.88, yPct: 0.72, r: 16, rot: 0, rotSpeed: -0.0035, color: 'rgba(245, 185, 66, 0.10)' }
    ];

    // ══════════════════════════════════════════════════
    // SHOOTING STAR SHOWERS & METEOR CASCADE ENGINE
    // ══════════════════════════════════════════════════
    const meteors = [];
    let nextShowerTime = performance.now() + 2500;
    let nextSingleMeteorTime = performance.now() + 1200;

    const meteorHues = [
        { main: '#00e5ff', glow: 'rgba(0, 229, 255, 0.45)', head: '#ffffff' }, // Electric Cyan
        { main: '#c084fc', glow: 'rgba(192, 132, 252, 0.45)', head: '#ffffff' }, // Cosmic Violet
        { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.40)', head: '#f0f9ff' }, // Starlight Blue
        { main: '#fde047', glow: 'rgba(253, 224, 71, 0.38)', head: '#ffffff' }  // Celestial Gold
    ];

    function createMeteor(opt) {
        opt = opt || {};
        const angle = opt.angle !== undefined ? opt.angle : ((Math.PI / 4) + (Math.random() - 0.5) * 0.22);
        const speed = opt.speed || (Math.random() * 8 + 12);
        const length = opt.length || (Math.random() * 110 + 85);
        const hue = opt.hue || meteorHues[Math.floor(Math.random() * meteorHues.length)];

        // Start predominantly around the top or top-left corners
        const startX = opt.x !== undefined ? opt.x : (Math.random() * (w * 0.85) - 40);
        const startY = opt.y !== undefined ? opt.y : (Math.random() * (h * 0.35) - 40);

        meteors.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            length: length,
            width: opt.width || (Math.random() * 0.6 + 1.4),
            hue: hue,
            alpha: 1.0,
            decay: opt.decay || (Math.random() * 0.016 + 0.010)
        });
    }

    // Trigger a synchronized Shooting Star Shower (3 to 5 stars cascading across)
    function triggerMeteorShower() {
        const count = Math.floor(Math.random() * 3) + 3; // 3 to 5 stars
        const showerOriginX = Math.random() * (w * 0.6) - 50;
        const showerOriginY = Math.random() * (h * 0.25) - 50;
        const sharedAngle = (Math.PI / 4) + (Math.random() - 0.5) * 0.14; // cohesive angle

        for (let i = 0; i < count; i++) {
            setTimeout(function () {
                const offsetX = (Math.random() - 0.5) * 160 + (i * 45);
                const offsetY = (Math.random() - 0.5) * 80 + (i * 20);
                const hue = meteorHues[Math.floor(Math.random() * meteorHues.length)];
                createMeteor({
                    x: showerOriginX + offsetX,
                    y: showerOriginY + offsetY,
                    angle: sharedAngle + (Math.random() - 0.5) * 0.05,
                    speed: Math.random() * 6 + 14,
                    length: Math.random() * 120 + 100,
                    width: Math.random() * 0.7 + 1.5,
                    hue: hue,
                    decay: Math.random() * 0.014 + 0.010
                });
            }, i * (Math.random() * 140 + 110)); // Staggered delays
        }
    }

    // Smooth Multi-Layer Parallax
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;
    let rawMouseX = w * 0.5, rawMouseY = h * 0.5;
    let curMouseX = w * 0.5, curMouseY = h * 0.5;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    if (!isTouch) {
        window.addEventListener('mousemove', function (e) {
            mouseX = (e.clientX / w - 0.5) * 2;
            mouseY = (e.clientY / h - 0.5) * 2;
            rawMouseX = e.clientX;
            rawMouseY = e.clientY;
        }, { passive: true });
    }

    function render(timestamp) {
        // Smooth lerp
        curX += (mouseX - curX) * 0.035;
        curY += (mouseY - curY) * 0.035;
        curMouseX += (rawMouseX - curMouseX) * 0.04;
        curMouseY += (rawMouseY - curMouseY) * 0.04;

        // Subtle Nebula depth parallax (Hardware accelerated translate3d)
        if (nebula1) nebula1.style.transform = `translate3d(${curX * 8}px, ${curY * 6}px, 0)`;
        if (nebula2) nebula2.style.transform = `translate3d(${-curX * 12}px, ${-curY * 9}px, 0)`;
        if (nebula3) nebula3.style.transform = `translate3d(${curX * 6}px, ${-curY * 7}px, 0)`;

        ctx.clearRect(0, 0, w, h);

        const time = timestamp * 0.001;

        // 1. Subtle Interactive Cosmic Cursor Halo (Fast arc drawing)
        if (!isTouch) {
            const cursorGlow = ctx.createRadialGradient(curMouseX, curMouseY, 0, curMouseX, curMouseY, 190);
            cursorGlow.addColorStop(0, 'rgba(0, 240, 255, 0.045)');
            cursorGlow.addColorStop(0.5, 'rgba(168, 85, 247, 0.025)');
            cursorGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = cursorGlow;
            ctx.beginPath();
            ctx.arc(curMouseX, curMouseY, 190, 0, Math.PI * 2);
            ctx.fill();
        }

        // 2. Distant Celestial Orbital Nodes (Low Intensity Geometry)
        for (let k = 0; k < celestialNodes.length; k++) {
            const node = celestialNodes[k];
            node.rot += node.rotSpeed;
            const nx = node.xPct * w + curX * 4;
            const ny = node.yPct * h + curY * 4;
            const pulse = 1 + Math.sin(time * 1.5 + k) * 0.12;

            ctx.save();
            ctx.translate(nx, ny);
            ctx.rotate(node.rot);
            ctx.strokeStyle = node.color;
            ctx.lineWidth = 0.8;
            ctx.setLineDash([3, 5]);

            // Outer orbit ring
            ctx.beginPath();
            ctx.arc(0, 0, node.r * pulse, 0, Math.PI * 2);
            ctx.stroke();

            // Tiny orbital satellite node
            ctx.setLineDash([]);
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(Math.cos(time * 0.8 + k) * (node.r * pulse), Math.sin(time * 0.8 + k) * (node.r * pulse), 1.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        // 3. Cosmic Constellation Proximity Lines (Layer 1, batched draw call - zero allocation)
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.10)';
        ctx.beginPath();
        const offX = curX * 2.2;
        const offY = curY * 2.2;
        for (let i = 0; i < stars.length; i++) {
            if (stars[i].layer !== 1) continue;
            const sx = stars[i].x + offX;
            const sy = stars[i].y + offY;
            for (let j = i + 1; j < stars.length; j++) {
                if (stars[j].layer !== 1) continue;
                const dx = stars[i].x - stars[j].x;
                const dy = stars[i].y - stars[j].y;
                if (dx * dx + dy * dy < 5625) { // 75px radius
                    ctx.moveTo(sx, sy);
                    ctx.lineTo(stars[j].x + offX, stars[j].y + offY);
                }
            }
        }
        ctx.stroke();

        // 4. Render Stars & Cosmic Dust Motes (Direct GPU Alpha Blitting - Zero CPU shadowBlur)
        for (let i = 0; i < stars.length; i++) {
            const p = stars[i];

            // Organic sinusoidal floating
            p.x += p.vx + Math.sin(time + p.phase) * 0.09;
            p.y += p.vy + Math.cos(time + p.phase) * 0.06;

            // Screen Wrap
            if (p.x < -10) p.x = w + 10;
            if (p.x > w + 10) p.x = -10;
            if (p.y < -10) p.y = h + 10;
            if (p.y > h + 10) p.y = -10;

            // Living Alpha Breathing
            const currentAlpha = p.baseAlpha + Math.sin(time * 2.5 + p.phase) * 0.2;
            const alpha = Math.max(0.06, Math.min(0.95, currentAlpha));

            // Parallax depth offset
            const depthFactor = (p.layer + 1) * 1.2;
            const renderX = p.x + curX * depthFactor;
            const renderY = p.y + curY * depthFactor;

            ctx.fillStyle = p.c;

            // Soft outer halo for layer 2 glowing particles
            if (p.layer === 2) {
                ctx.globalAlpha = alpha * 0.25;
                ctx.beginPath();
                ctx.arc(renderX, renderY, p.r * 2.4, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(renderX, renderY, p.r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        // 5. Periodic Celestial Meteor Showers & Shooting Stars
        if (timestamp > nextShowerTime) {
            triggerMeteorShower();
            nextShowerTime = timestamp + Math.random() * 7000 + 11000; // Shower every 11 - 18s
        } else if (timestamp > nextSingleMeteorTime) {
            createMeteor();
            nextSingleMeteorTime = timestamp + Math.random() * 3500 + 3500; // Single star every 3.5 - 7s
        }

        for (let i = meteors.length - 1; i >= 0; i--) {
            const m = meteors[i];
            m.x += m.vx;
            m.y += m.vy;
            m.alpha -= m.decay;

            if (m.alpha <= 0 || m.x > w + 120 || m.y > h + 120) {
                meteors.splice(i, 1);
                continue;
            }

            const speedMag = Math.hypot(m.vx, m.vy);
            const tailX = m.x - (m.vx / speedMag) * m.length;
            const tailY = m.y - (m.vy / speedMag) * m.length;

            // Radiant Ion Starlight Trail
            const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grad.addColorStop(0.65, m.hue.glow);
            grad.addColorStop(0.92, m.hue.main);
            grad.addColorStop(1, '#ffffff');

            ctx.strokeStyle = grad;
            ctx.lineWidth = m.width * Math.min(1, m.alpha * 1.2);
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();

            // Diamond-bright head sparkle
            ctx.fillStyle = m.hue.head;
            ctx.globalAlpha = Math.min(1, m.alpha * 1.3);
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.width * 0.95, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
})();

// ==========================================================================
// 2. ISLAND HOVER, CAMERA ZOOM, MATCHSTICK IGNITION & CHAPTER CONTROLLER
// ==========================================================================
(function () {
    const viewport = document.querySelector('.game-viewport');
    const stage = document.querySelector('.world-map-stage');
    const islands = document.querySelectorAll('.island-node[data-island]');
    const links = document.querySelectorAll('.energy-link');
    const enterBtn = document.getElementById('enterObservatoryBtn');

    // Matchstick Ignition Canvas Physics
    const ignCanvas = document.getElementById('ignitionCanvas');
    const ignCtx = ignCanvas ? ignCanvas.getContext('2d') : null;
    let ignSparks = [];
    let ignRings = [];
    let ignFlashes = [];
    let ignitionLoopRunning = false;

    function resizeIgnitionCanvas() {
        if (ignCanvas) {
            ignCanvas.width = innerWidth;
            ignCanvas.height = innerHeight;
        }
    }
    window.addEventListener('resize', resizeIgnitionCanvas);
    resizeIgnitionCanvas();

    const ignFlashOverlay = document.getElementById('ignFlashOverlay');

    function triggerMatchIgnition(node) {
        if (!node) return;

        // 1. Hardware-Accelerated Ambient Screen Pulse
        if (ignFlashOverlay) {
            ignFlashOverlay.classList.add('active');
            setTimeout(() => {
                ignFlashOverlay.classList.remove('active');
            }, 40);
        }

        // 2. Island Node Soft Radiant Bloom (GPU accelerated)
        node.classList.add('is-ignited');
        setTimeout(() => {
            node.classList.remove('is-ignited');
        }, 800);

        // 3. Soft Conduit Energy Surge
        const id = node.getAttribute('data-island');
        links.forEach(function (link) {
            const from = link.getAttribute('data-from');
            const to = link.getAttribute('data-to');
            if (from === id || to === id) {
                link.classList.add('link-surge');
                setTimeout(() => link.classList.remove('link-surge'), 800);
            }
        });
    }

    function renderIgnition() {
        if (!ignCtx) return;
        ignCtx.clearRect(0, 0, ignCanvas.width, ignCanvas.height);
        ignCtx.save();
        ignCtx.globalCompositeOperation = 'lighter';

        let activeElements = 0;

        // Render Central Strike Flashes
        for (let i = ignFlashes.length - 1; i >= 0; i--) {
            const f = ignFlashes[i];
            f.r += (f.maxR - f.r) * 0.18;
            f.alpha -= f.decay;

            if (f.alpha <= 0) {
                ignFlashes.splice(i, 1);
                continue;
            }
            activeElements++;

            const grad = ignCtx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
            grad.addColorStop(0, `rgba(255, 255, 255, ${f.alpha * 0.8})`);
            grad.addColorStop(0.4, `rgba(56, 189, 248, ${f.alpha * 0.5})`);
            grad.addColorStop(1, 'transparent');

            ignCtx.fillStyle = grad;
            ignCtx.beginPath();
            ignCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ignCtx.fill();
        }

        // Render Soft Silk Shockwave Rings
        for (let i = ignRings.length - 1; i >= 0; i--) {
            const rg = ignRings[i];
            rg.r += rg.speed;
            rg.speed *= 0.94;
            rg.alpha *= 0.94;

            if (rg.alpha <= 0.01 || rg.r >= rg.maxR) {
                ignRings.splice(i, 1);
                continue;
            }
            activeElements++;

            ignCtx.strokeStyle = rg.color;
            ignCtx.globalAlpha = rg.alpha;
            ignCtx.lineWidth = rg.lineWidth;

            ignCtx.beginPath();
            ignCtx.arc(rg.x, rg.y, rg.r, 0, Math.PI * 2);
            ignCtx.stroke();
        }

        // Render Soft Floating Embers with gentle trails (GPU alpha blitting)
        ignCtx.lineCap = 'round';
        for (let i = ignSparks.length - 1; i >= 0; i--) {
            const s = ignSparks[i];
            s.prevX = s.x;
            s.prevY = s.y;

            s.vx *= s.drag;
            s.vy = s.vy * s.drag + s.gravity;

            s.x += s.vx;
            s.y += s.vy;
            s.alpha -= s.decay;

            if (s.alpha <= 0) {
                ignSparks.splice(i, 1);
                continue;
            }
            activeElements++;

            // Soft Spark Trail
            ignCtx.strokeStyle = s.color;
            ignCtx.lineWidth = s.r * s.alpha;
            ignCtx.globalAlpha = s.alpha;

            ignCtx.beginPath();
            ignCtx.moveTo(s.prevX, s.prevY);
            ignCtx.lineTo(s.x, s.y);
            ignCtx.stroke();

            // Spark Glowing Head
            ignCtx.fillStyle = '#ffffff';
            ignCtx.globalAlpha = Math.min(1, s.alpha * 1.3);
            ignCtx.beginPath();
            ignCtx.arc(s.x, s.y, s.r * 0.6, 0, Math.PI * 2);
            ignCtx.fill();
        }
        ignCtx.globalAlpha = 1.0;

        ignCtx.restore();

        if (activeElements > 0) {
            requestAnimationFrame(renderIgnition);
        } else {
            ignitionLoopRunning = false;
            ignCtx.clearRect(0, 0, ignCanvas.width, ignCanvas.height);
        }
    }

    let currentFocusedIsland = null;

    // ==========================================
    // DYNAMIC CHAPTERS DATA & INSPECTOR SYSTEM
    // ==========================================
    const CHAPTERS_DATA = {
        1: {
            num: "01",
            title: "PATTERN OBSERVATORY",
            chapter: "CHAPTER 1",
            img: "assets/images/islands/pattern_observatory.png",
            unlocked: true,
            statusBadge: "ACTIVE CHAPTER",
            btnText: "ENTER CHAPTER",
            dialogue: "Guardian, NULL's corruption is destabilizing the Core.<br><span style='color:#38bdf8;font-weight:600;'>Pattern Observatory</span> is active. Select it to begin our mission!"
        },
        2: {
            num: "02",
            title: "LOGIC NEXUS",
            chapter: "CHAPTER 2",
            img: "assets/images/islands/logic_nexus.png",
            unlocked: false,
            statusBadge: "LOCKED SECTOR",
            btnText: "SECTOR LOCKED",
            requirement: "REQUIRES: COMPLETE CHAPTER 01",
            dialogue: "<span style='color:#f87171;'>[ACCESS DENIED]</span> Logic Nexus neural link is locked. Clear Pattern Observatory first!"
        },
        3: {
            num: "03",
            title: "PROGRAMMING DISTRICT",
            chapter: "CHAPTER 3",
            img: "assets/images/islands/programming_district.png",
            unlocked: false,
            statusBadge: "LOCKED SECTOR",
            btnText: "SECTOR LOCKED",
            requirement: "REQUIRES: COMPLETE CHAPTER 02",
            dialogue: "<span style='color:#f87171;'>[ACCESS DENIED]</span> Programming District compiler sub-grids are offline. Conquer Logic Nexus to unlock this sector."
        },
        4: {
            num: "04",
            title: "ALGORITHM FORGE",
            chapter: "CHAPTER 4",
            img: "assets/images/islands/algorithm_forge.png",
            unlocked: false,
            statusBadge: "LOCKED SECTOR",
            btnText: "SECTOR LOCKED",
            requirement: "REQUIRES: COMPLETE CHAPTER 03",
            dialogue: "<span style='color:#f87171;'>[ACCESS DENIED]</span> Algorithm Forge safety protocols are active. Gain clearance by clearing Programming District."
        },
        5: {
            num: "05",
            title: "DATABASE VAULT",
            chapter: "CHAPTER 5",
            img: "assets/images/islands/database_vault.png",
            unlocked: false,
            statusBadge: "LOCKED SECTOR",
            btnText: "SECTOR LOCKED",
            requirement: "REQUIRES: COMPLETE CHAPTER 04",
            dialogue: "<span style='color:#f87171;'>[ACCESS DENIED]</span> Encrypted memory vaults are sealed. High-tier decryption key needed from Algorithm Forge."
        },
        6: {
            num: "06",
            title: "NETWORK GRID",
            chapter: "CHAPTER 6",
            img: "assets/images/islands/network_grid.png",
            unlocked: false,
            statusBadge: "LOCKED SECTOR",
            btnText: "SECTOR LOCKED",
            requirement: "REQUIRES: COMPLETE CHAPTER 05",
            dialogue: "<span style='color:#f87171;'>[ACCESS DENIED]</span> High-voltage routing is offline. Restore power in Database Vault to activate the Network Grid."
        },
        7: {
            num: "07",
            title: "SYSTEM CORE",
            chapter: "CHAPTER 7",
            img: "assets/images/islands/system_core.png",
            unlocked: false,
            statusBadge: "LOCKED SECTOR",
            btnText: "SECTOR LOCKED",
            requirement: "REQUIRES: COMPLETE CHAPTER 06",
            dialogue: "<span style='color:#f87171;'>[ACCESS DENIED]</span> Central Mainframe Firewalls are engaged. Breach defense perimeters in Network Grid first."
        },
        8: {
            num: "08",
            title: "COMMUNICATION CITADEL",
            chapter: "CHAPTER 8",
            img: "assets/images/islands/communication_citadel.png",
            unlocked: false,
            statusBadge: "LOCKED SECTOR",
            btnText: "SECTOR LOCKED",
            requirement: "REQUIRES: COMPLETE CHAPTER 07",
            dialogue: "<span style='color:#f87171;'>[ACCESS DENIED]</span> Sub-space relay is silent. Sector coordinates are locked until System Core is secured."
        },
        9: {
            num: "09",
            title: "PLACEMENT ARENA",
            chapter: "CHAPTER 9",
            img: "assets/images/islands/placement_arena.png",
            unlocked: false,
            statusBadge: "LOCKED SECTOR",
            btnText: "SECTOR LOCKED",
            requirement: "REQUIRES: COMPLETE CHAPTER 08",
            dialogue: "<span style='color:#f87171;'>[ACCESS DENIED]</span> The Ultimate Crucible is sealed. Secure Communication Citadel and all prior sectors to enter the final arena."
        }
    };

    const inspectorCard = document.getElementById('enterObservatoryBtn');
    const inspectorBadge = document.getElementById('inspectorBadge');
    const inspectorThumbImg = document.getElementById('inspectorThumbImg');
    const inspectorSubTitle = document.getElementById('inspectorSubTitle');
    const inspectorTitle = document.getElementById('inspectorTitle');
    const inspectorRequirement = document.getElementById('inspectorRequirement');
    const inspectorCtaText = document.getElementById('inspectorCtaText');
    const inspectorBtnIcon = document.getElementById('inspectorBtnIcon');

    // Nova Interactive Voice Bubble Controls
    const novaVoicePanel = document.getElementById('novaVoicePanel');
    const novaAvatarBtn = document.getElementById('novaAvatarBtn');
    const novaReplayBtn = document.getElementById('novaReplayBtn');
    const novaMinimizeBtn = document.getElementById('novaMinimizeBtn');
    const novaDialogueText = document.getElementById('novaDialogueText');
    let novaSpeechTimeout = null;

    // Audio Elements & State
    const bgMusic = document.getElementById('levelBgMusic');
    const sfxClick = document.getElementById('sfxClick');
    const settingsDockBtn = document.getElementById('settingsDockBtn');
    const settingsModal = document.getElementById('settingsModal');
    const settingsCloseBtn = document.getElementById('settingsCloseBtn');
    const musicToggle = document.getElementById('musicToggleCheckbox');
    const sfxToggle = document.getElementById('sfxToggleCheckbox');

    const MASTER_MUSIC_VOL = 0.65;
    let isMusicPlaying = false;
    let isMusicMuted = localStorage.getItem('corebound_music_muted') === 'true';
    let isSfxMuted = localStorage.getItem('corebound_sfx_muted') === 'true';

    // Initialize checkbox states
    if (musicToggle) musicToggle.checked = !isMusicMuted;
    if (sfxToggle) sfxToggle.checked = !isSfxMuted;

    let sharedAudioCtx = null;
    function getAudioContext() {
        if (!sharedAudioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                sharedAudioCtx = new AudioContextClass();
            }
        }
        if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
            sharedAudioCtx.resume().catch(function () { });
        }
        return sharedAudioCtx;
    }

    function playSfx(pitch = 1.0) {
        if (isSfxMuted) return;
        if (sfxClick) {
            try {
                sfxClick.currentTime = 0;
                sfxClick.volume = 0.6;
                sfxClick.playbackRate = pitch;
                sfxClick.play().catch(function () { });
                return;
            } catch (err) { }
        }
        // Web Audio fallback click
        try {
            const actx = getAudioContext();
            if (!actx) return;
            const now = actx.currentTime;
            const osc = actx.createOscillator();
            const gain = actx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(650 * pitch, now);
            osc.frequency.exponentialRampToValueAtTime(320 * pitch, now + 0.05);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain);
            gain.connect(actx.destination);
            osc.start(now);
            osc.stop(now + 0.05);
        } catch (e) { }
    }

    // ══════════════════════════════════════════════════
    // CINEMATIC WHOOSH / LASER SFX SYSTEM
    // Assets: whoosh-laser-blast-2-roys-noise-water-ball-fast-2-7-0m02s.mp3
    // ══════════════════════════════════════════════════
    const WHOOSH_SFX_SRC = 'assets/audio/whoosh-laser-blast-2-roys-noise-water-ball-fast-2-7-0m02s.mp3';
    const whooshAudioPool = [];
    const WHOOSH_POOL_SIZE = 5;
    for (let i = 0; i < WHOOSH_POOL_SIZE; i++) {
        const aud = new Audio(WHOOSH_SFX_SRC);
        aud.preload = 'auto';
        whooshAudioPool.push(aud);
    }
    let whooshPoolIndex = 0;

    function playWhooshSfx(speed = 1.0) {
        if (isSfxMuted) return;
        try {
            const audio = whooshAudioPool[whooshPoolIndex];
            whooshPoolIndex = (whooshPoolIndex + 1) % whooshAudioPool.length;
            if (audio) {
                audio.currentTime = 0;
                audio.volume = 0.72;
                audio.playbackRate = Math.min(Math.max(speed, 0.7), 1.6);
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(function () {
                        // Browser autoplay policy or fallback
                    });
                }
                return;
            }
        } catch (e) {
            console.warn("Whoosh Audio file error, falling back to Web Audio synth:", e);
        }

        // Web Audio fallback
        try {
            const actx = getAudioContext();
            if (!actx) return;
            const now = actx.currentTime;
            const duration = 0.65;
            const osc = actx.createOscillator();
            const gain = actx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(850 * speed, now);
            osc.frequency.exponentialRampToValueAtTime(140, now + duration);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
            osc.connect(gain);
            gain.connect(actx.destination);
            osc.start(now);
            osc.stop(now + duration);
        } catch (err) { }
    }

    function playNovaChime() {
        if (isSfxMuted) return;
        try {
            const actx = getAudioContext();
            if (!actx) return;
            const now = actx.currentTime;

            // Harmonious crystal two-tone AI chime (F#5 to B5)
            const osc1 = actx.createOscillator();
            const gain1 = actx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(739.99, now);
            osc1.frequency.exponentialRampToValueAtTime(987.77, now + 0.12);
            gain1.gain.setValueAtTime(0.08, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

            const osc2 = actx.createOscillator();
            const gain2 = actx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(1479.98, now + 0.05);
            gain2.gain.setValueAtTime(0.035, now + 0.05);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            osc1.connect(gain1);
            gain1.connect(actx.destination);
            osc2.connect(gain2);
            gain2.connect(actx.destination);

            osc1.start(now);
            osc1.stop(now + 0.45);
            osc2.start(now + 0.05);
            osc2.stop(now + 0.45);
        } catch (e) {
            playSfx(1.3);
        }
    }

    // Nova AI Voice Synthesis System (TTS) - Dedicated Jenny Natural Voice
    let novaVoice = null;
    const NOVA_VOICE_PITCH = 1.14; // Tuned for Jenny Natural Feminine Sci-Fi Companion
    const NOVA_VOICE_RATE = 1.08;  // Lively & smooth cadence

    let hasSpokenOnEntry = (function () {
        try {
            return sessionStorage.getItem('cb_level_intro_spoken') === 'true';
        } catch (e) {
            return false;
        }
    })();

    function initNovaVoice() {
        if (!('speechSynthesis' in window)) return;
        function pickVoice() {
            const voices = window.speechSynthesis.getVoices();
            if (!voices || voices.length === 0) return;

            let bestVoice = null;
            let bestScore = -999;

            voices.forEach(v => {
                if (!v.lang || !v.lang.toLowerCase().startsWith('en')) return;
                const name = v.name || '';
                let score = 0;

                // Dedicated priority matching for Jenny Natural / Neural Voice
                if (name.includes('Jenny')) score += 100;
                if (name.includes('Natural') || name.includes('Neural')) score += 40;
                if (name.includes('Ana') || name.includes('Aria') || name.includes('Ava') || name.includes('Emma')) score += 30;
                if (name.includes('Google') && (name.includes('Female') || name.includes('US English'))) score += 25;
                if (name.includes('Samantha') || name.includes('Victoria')) score += 20;
                if (name.toLowerCase().includes('female')) score += 15;
                if (v.lang === 'en-US') score += 10;
                if (name.includes('Zira') || name.includes('David')) score -= 30;

                if (score > bestScore) {
                    bestScore = score;
                    bestVoice = v;
                }
            });

            novaVoice = bestVoice || voices.find(v => v.lang.startsWith('en')) || voices[0];
        }
        pickVoice();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = function () {
                pickVoice();
            };
        }
    }
    initNovaVoice();

    let autoCloseTimer = null;
    let entrySpeechTimer = null;
    let activeUtterance = null;
    let typewriterTimer = null;

    function closeNovaBubble() {
        if (novaVoicePanel && !novaVoicePanel.classList.contains('is-collapsed')) {
            novaVoicePanel.classList.add('is-collapsed');
            novaVoicePanel.classList.remove('speaking');
        }
    }

    // ── Cyber Typewriter Text Renderer ──
    function typewriteText(targetEl, htmlContent, onTypeComplete = null, baseSpeed = 24) {
        if (!targetEl) return;
        clearTimeout(typewriterTimer);

        // 1. Tokenize HTML into tags (<tag...>) and visible characters
        const tokens = [];
        let i = 0;
        while (i < htmlContent.length) {
            if (htmlContent[i] === '<') {
                const closeIdx = htmlContent.indexOf('>', i);
                if (closeIdx !== -1) {
                    tokens.push({ type: 'tag', value: htmlContent.substring(i, closeIdx + 1) });
                    i = closeIdx + 1;
                    continue;
                }
            }
            tokens.push({ type: 'char', value: htmlContent[i] });
            i++;
        }

        let tokenIndex = 0;
        let renderedHtml = '';
        targetEl.innerHTML = '<span class="typewriter-cursor">|</span>';

        function step() {
            if (tokenIndex >= tokens.length) {
                targetEl.innerHTML = renderedHtml;
                if (typeof onTypeComplete === 'function') {
                    onTypeComplete();
                }
                return;
            }

            // Flush all upcoming HTML tags immediately so markup is never broken
            while (tokenIndex < tokens.length && tokens[tokenIndex].type === 'tag') {
                renderedHtml += tokens[tokenIndex].value;
                tokenIndex++;
            }

            if (tokenIndex < tokens.length) {
                const char = tokens[tokenIndex].value;
                renderedHtml += char;
                tokenIndex++;

                targetEl.innerHTML = renderedHtml + '<span class="typewriter-cursor">|</span>';

                // Natural conversational cadence with punctuation breathers
                let delay = baseSpeed;
                if (char === '.' || char === '!' || char === '?') {
                    delay += 110;
                } else if (char === ',' || char === ';' || char === ':') {
                    delay += 50;
                }

                typewriterTimer = setTimeout(step, delay);
            } else {
                targetEl.innerHTML = renderedHtml;
                if (typeof onTypeComplete === 'function') {
                    onTypeComplete();
                }
            }
        }

        step();
    }

    const novaCenterIntro = document.getElementById('novaCenterIntro');
    const novaCenterDialogueText = document.getElementById('novaCenterDialogueText');
    const novaCenterSoundwave = document.getElementById('novaCenterSoundwave');

    // ── Reveal Level Screen Stage & Entrance Animation ──
    function revealStageEntrance() {
        if (novaCenterIntro && !novaCenterIntro.classList.contains('is-dismissed')) {
            novaCenterIntro.classList.add('is-dismissed');
        }
        const vp = document.querySelector('.game-viewport');
        if (vp && !vp.classList.contains('stage-revealed')) {
            vp.classList.add('stage-revealed', 'stage-entering');
            setTimeout(() => {
                if (typeof drawOrbitalConduits === 'function') {
                    drawOrbitalConduits();
                }
            }, 250);
            setTimeout(() => {
                if (vp) vp.classList.remove('stage-entering');
            }, 1200);
        }
    }

    // Convert ALL-CAPS words to TitleCase for Speech Synthesis so TTS pronounces words instead of spelling individual letters
    function formatTextForSpeech(rawHtml) {
        if (!rawHtml) return '';
        let text = rawHtml
            .replace(/<br\s*[\/]?>/gi, ' ')
            .replace(/<[^>]*>?/gm, '')
            .replace(/[“”"']/g, '')
            .replace(/\[TRANSMISSION RECEIVED\]/gi, 'Transmission Received.')
            .replace(/\[WELCOME TO COREBOUND\]/gi, 'Welcome to Corebound.')
            .replace(/\[ACCESS DENIED\]/gi, 'Access Denied.')
            .replace(/\bCOREBOUND\b/g, 'Corebound')
            .replace(/\bNOVA\b/g, 'Nova')
            .replace(/\bNULL\b/g, 'Null')
            .trim();

        // Convert any remaining ALL-CAPS words (2+ letters) to TitleCase so TTS pronounces whole words
        text = text.replace(/\b[A-Z]{2,}\b/g, function (word) {
            if (word === 'AI') return 'A I';
            return word.charAt(0) + word.slice(1).toLowerCase();
        });

        return text;
    }

    function speakNova(dialogueHtml, autoClose = true, onEndCallback = null) {
        if (!novaDialogueText) return;

        clearTimeout(autoCloseTimer);
        clearTimeout(novaSpeechTimeout);

        // 1. Ensure voice panel is expanded and active
        if (novaVoicePanel && novaVoicePanel.classList.contains('is-collapsed')) {
            novaVoicePanel.classList.remove('is-collapsed');
        }

        // 2. Play intro cyber crystal chime
        playNovaChime();

        // 3. Render dialogue with cyber typewriter effect
        typewriteText(novaDialogueText, dialogueHtml);

        // 4. Real Web Speech AI Voice
        if ('speechSynthesis' in window && !isSfxMuted) {
            try {
                window.speechSynthesis.cancel(); // Stop any previous speech

                const plainText = formatTextForSpeech(dialogueHtml);
                const utterance = new SpeechSynthesisUtterance(plainText);
                activeUtterance = utterance; // Prevent garbage collection mid-speech

                if (!novaVoice) {
                    initNovaVoice();
                }
                if (novaVoice) utterance.voice = novaVoice;
                utterance.rate = NOVA_VOICE_RATE;
                utterance.pitch = NOVA_VOICE_PITCH;
                utterance.volume = 1.0;

                utterance.onstart = function () {
                    if (novaVoicePanel) novaVoicePanel.classList.add('speaking');
                };

                utterance.onend = function () {
                    activeUtterance = null;
                    if (novaVoicePanel) novaVoicePanel.classList.remove('speaking');
                    if (typeof onEndCallback === 'function') {
                        onEndCallback();
                    } else if (autoClose) {
                        clearTimeout(autoCloseTimer);
                        autoCloseTimer = setTimeout(() => {
                            closeNovaBubble();
                        }, 1400); // 1.4s graceful pause after speech ends before collapse
                    }
                };

                utterance.onerror = function () {
                    activeUtterance = null;
                    if (novaVoicePanel) novaVoicePanel.classList.remove('speaking');
                    if (typeof onEndCallback === 'function') {
                        onEndCallback();
                    } else if (autoClose) {
                        clearTimeout(autoCloseTimer);
                        autoCloseTimer = setTimeout(() => {
                            closeNovaBubble();
                        }, 1500);
                    }
                };

                // Safety fallback auto-close only when there is no follow-up callback
                if (autoClose && !onEndCallback) {
                    const fallbackDuration = Math.max(7000, plainText.length * 85 + 2500);
                    autoCloseTimer = setTimeout(() => {
                        closeNovaBubble();
                    }, fallbackDuration);
                }

                window.speechSynthesis.speak(utterance);
            } catch (err) {
                console.warn('TTS error:', err);
                activeUtterance = null;
                if (typeof onEndCallback === 'function') {
                    onEndCallback();
                } else if (autoClose) {
                    autoCloseTimer = setTimeout(closeNovaBubble, 4500);
                }
            }
        } else {
            if (novaVoicePanel) {
                novaVoicePanel.classList.add('speaking');
                const displayTime = Math.max(5500, dialogueHtml.length * 42);
                novaSpeechTimeout = setTimeout(() => {
                    novaVoicePanel.classList.remove('speaking');
                    if (typeof onEndCallback === 'function') {
                        onEndCallback();
                    } else if (autoClose) {
                        clearTimeout(autoCloseTimer);
                        autoCloseTimer = setTimeout(closeNovaBubble, 1400);
                    }
                }, displayTime);
            }
        }
    }

    function triggerEntrySpeech() {
        if (hasSpokenOnEntry || (function () {
            try { return sessionStorage.getItem('cb_level_intro_spoken') === 'true'; } catch (e) { return false; }
        })()) {
            revealStageEntrance();
            return;
        }
        hasSpokenOnEntry = true;
        try {
            sessionStorage.setItem('cb_level_intro_spoken', 'true');
        } catch (e) {}

        const welcomeDialogue = "<span style='color:#c084fc;font-weight:700;'>[TRANSMISSION RECEIVED]</span><br>“Welcome to COREBOUND Guardian. I am NOVA. You stand at the edge of nine worlds, each hiding knowledge, secrets, and a path of its own. Explore. Discover. Learn. Your journey begins within.”";
        const chapter1Dialogue = CHAPTERS_DATA[1] ? CHAPTERS_DATA[1].dialogue : "Select Pattern Observatory to begin!";

        let hasRevealedStage = false;
        let isTypingDone = false;
        let isSpeechDone = false;

        function finishIntroAndReveal() {
            if (hasRevealedStage) return;
            hasRevealedStage = true;

            // 1. Dismiss Center Intro Presentation
            if (novaCenterIntro) {
                novaCenterIntro.classList.add('is-dismissed');
            }

            // 2. Trigger the cinematic entrance animation (flare, islands, HUD, dock)
            revealStageEntrance();

            // 3. Once the entrance animation arrives and settles (~1.25s), deliver Chapter 1 dialogue in bottom-left bubble
            clearTimeout(entrySpeechTimer);
            entrySpeechTimer = setTimeout(() => {
                if (currentSectorIndex === 0) {
                    speakNova(chapter1Dialogue, true);
                }
            }, 1250);
        }

        function checkBothDone() {
            if (isTypingDone && isSpeechDone) {
                clearTimeout(entrySpeechTimer);
                finishIntroAndReveal();
            }
        }

        // Phase 1: Render typewriter in the CENTER dialogue box
        playNovaChime();
        if (novaCenterDialogueText) {
            typewriteText(novaCenterDialogueText, welcomeDialogue, function onTypeComplete() {
                isTypingDone = true;
                checkBothDone();
            }, 20);
        } else {
            isTypingDone = true;
        }

        // Phase 2: Speech Synthesis
        if ('speechSynthesis' in window && !isSfxMuted) {
            try {
                window.speechSynthesis.cancel();
                const plainText = formatTextForSpeech(welcomeDialogue);
                const utterance = new SpeechSynthesisUtterance(plainText);
                activeUtterance = utterance;
                window._activeUtterance = utterance;

                if (!novaVoice) initNovaVoice();
                if (novaVoice) utterance.voice = novaVoice;
                utterance.rate = NOVA_VOICE_RATE;
                utterance.pitch = NOVA_VOICE_PITCH;
                utterance.volume = 1.0;

                // Chromium keep-alive so browser doesn't cut off speech
                const keepAliveInterval = setInterval(() => {
                    if (window.speechSynthesis && window.speechSynthesis.speaking) {
                        window.speechSynthesis.pause();
                        window.speechSynthesis.resume();
                    } else {
                        clearInterval(keepAliveInterval);
                    }
                }, 3500);

                utterance.onstart = function () {
                    if (novaCenterSoundwave) novaCenterSoundwave.classList.add('speaking');
                    if (novaCenterIntro) novaCenterIntro.classList.add('speaking');
                };

                utterance.onend = function () {
                    clearInterval(keepAliveInterval);
                    activeUtterance = null;
                    window._activeUtterance = null;
                    if (novaCenterSoundwave) novaCenterSoundwave.classList.remove('speaking');
                    if (novaCenterIntro) novaCenterIntro.classList.remove('speaking');
                    isSpeechDone = true;
                    checkBothDone();
                };

                utterance.onerror = function (err) {
                    clearInterval(keepAliveInterval);
                    activeUtterance = null;
                    window._activeUtterance = null;
                    if (novaCenterSoundwave) novaCenterSoundwave.classList.remove('speaking');
                    if (novaCenterIntro) novaCenterIntro.classList.remove('speaking');
                    isSpeechDone = true;
                    checkBothDone();
                };

                window.speechSynthesis.speak(utterance);
            } catch (err) {
                console.warn('TTS entry error:', err);
                activeUtterance = null;
                isSpeechDone = true;
                checkBothDone();
            }
        } else {
            isSpeechDone = true;
            checkBothDone();
        }

        // Manual Skip button listener
        const skipBtn = document.getElementById('novaIntroSkipBtn');
        if (skipBtn) {
            skipBtn.onclick = function (e) {
                e.stopPropagation();
                playSfx(1.0);
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                finishIntroAndReveal();
            };
        }

        const centerBubble = document.getElementById('novaCenterBubble');
        if (centerBubble) {
            centerBubble.onclick = function (e) {
                if (e.target && e.target.closest('#novaIntroSkipBtn')) return;
                playSfx(1.0);
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                finishIntroAndReveal();
            };
        }
    }

    if (novaAvatarBtn) {
        novaAvatarBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (novaVoicePanel) {
                const isCurrentlyCollapsed = novaVoicePanel.classList.contains('is-collapsed');
                if (isCurrentlyCollapsed) {
                    novaVoicePanel.classList.remove('is-collapsed');
                    const data = CHAPTERS_DATA[selectedChapterId] || CHAPTERS_DATA[1];
                    speakNova(data.dialogue, true); // Speaks and auto-closes after finish
                } else {
                    clearTimeout(autoCloseTimer);
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    closeNovaBubble();
                    playSfx(0.8);
                }
            }
        });
    }

    if (novaMinimizeBtn) {
        novaMinimizeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            clearTimeout(autoCloseTimer);
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            closeNovaBubble();
            playSfx(0.8);
        });
    }

    if (novaReplayBtn) {
        novaReplayBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const data = CHAPTERS_DATA[selectedChapterId] || CHAPTERS_DATA[1];
            speakNova(data.dialogue, true);
        });
    }

    let selectedChapterId = 1;

    function updateInspectorCard(chapterId, triggerVoice = true) {
        const data = CHAPTERS_DATA[chapterId] || CHAPTERS_DATA[1];
        selectedChapterId = chapterId;

        if (inspectorBadge) inspectorBadge.textContent = data.statusBadge;
        if (inspectorSubTitle) inspectorSubTitle.textContent = data.chapter;
        if (inspectorTitle) inspectorTitle.textContent = data.title;
        if (inspectorThumbImg) inspectorThumbImg.src = data.img;
        if (inspectorCtaText) inspectorCtaText.textContent = data.btnText;

        const startMissionBtn = document.getElementById('startMissionBtn');

        if (data.unlocked) {
            if (inspectorCard) {
                inspectorCard.classList.remove('is-locked');
                inspectorCard.setAttribute('data-status', 'unlocked');
            }
            if (startMissionBtn) {
                startMissionBtn.classList.remove('is-locked');
                startMissionBtn.title = 'Start Chapter Mission';
            }
            if (inspectorCtaText) inspectorCtaText.textContent = 'START';
            if (inspectorRequirement) inspectorRequirement.textContent = '';
            if (inspectorBtnIcon) {
                inspectorBtnIcon.innerHTML = `
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" class="start-play-icon">
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>`;
            }
        } else {
            if (inspectorCard) {
                inspectorCard.classList.add('is-locked');
                inspectorCard.setAttribute('data-status', 'locked');
            }
            if (startMissionBtn) {
                startMissionBtn.classList.add('is-locked');
                startMissionBtn.title = 'Sector Locked';
            }
            if (inspectorCtaText) inspectorCtaText.textContent = 'SECTOR LOCKED';
            if (inspectorRequirement) inspectorRequirement.textContent = data.requirement || 'LOCKED';
            if (inspectorBtnIcon) {
                inspectorBtnIcon.innerHTML = `
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round" class="start-play-icon">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>`;
            }
        }

        if (triggerVoice && data.dialogue) {
            speakNova(data.dialogue);
        }
    }

    function syncUnlockedChapters() {
        // Automatically check player completion state
        const ch1Completed = localStorage.getItem('COREBOUND_CHAPTER_1_COMPLETED') === 'true';
        if (ch1Completed && CHAPTERS_DATA[2]) {
            CHAPTERS_DATA[2].unlocked = true;
            CHAPTERS_DATA[2].statusBadge = "ACTIVE CHAPTER";
            CHAPTERS_DATA[2].btnText = "START";
        }

        // Apply unlock state and reveal sub-panel automatically for unlocked islands
        Object.keys(CHAPTERS_DATA).forEach(function (id) {
            const chId = parseInt(id, 10);
            const data = CHAPTERS_DATA[chId];
            const node = document.querySelector(`.island-node[data-island="${chId}"]`);
            if (!node) return;

            const plateCard = node.querySelector('.island-plate-card');
            const orbitBadge = node.querySelector('.island-orbit-badge');

            if (data.unlocked) {
                node.classList.add('is-unlocked');
                node.classList.remove('is-locked');
                if (plateCard) {
                    plateCard.classList.remove('is-locked', 'loc-locked');
                    plateCard.classList.add('loc-active');
                }
                if (orbitBadge) {
                    orbitBadge.classList.remove('is-locked');
                    const lockIcon = orbitBadge.querySelector('.badge-lock-icon');
                    if (lockIcon) lockIcon.remove();
                    if (!orbitBadge.querySelector('.badge-dot')) {
                        const dot = document.createElement('span');
                        dot.className = 'badge-dot';
                        orbitBadge.insertBefore(dot, orbitBadge.firstChild);
                    }
                }
            } else {
                node.classList.add('is-locked');
                node.classList.remove('is-unlocked');
                if (plateCard) {
                    plateCard.classList.add('is-locked', 'loc-locked');
                    plateCard.classList.remove('loc-active');
                }
                if (orbitBadge) {
                    orbitBadge.classList.add('is-locked');
                    const dot = orbitBadge.querySelector('.badge-dot');
                    if (dot) dot.remove();
                    if (!orbitBadge.querySelector('.badge-lock-icon')) {
                        const lockIcon = document.createElement('span');
                        lockIcon.className = 'badge-lock-icon';
                        lockIcon.textContent = '🔒';
                        orbitBadge.insertBefore(lockIcon, orbitBadge.firstChild);
                    }
                }
            }
        });
    }

    // Expose unlockChapter globally for gameplay events
    window.unlockChapter = function (chapterId, missionsCompleted = 0) {
        if (CHAPTERS_DATA[chapterId]) {
            CHAPTERS_DATA[chapterId].unlocked = true;
            CHAPTERS_DATA[chapterId].statusBadge = "ACTIVE CHAPTER";
            CHAPTERS_DATA[chapterId].btnText = "START";
        }
        const node = document.querySelector(`.island-node[data-island="${chapterId}"]`);
        if (node) {
            node.classList.add('is-unlocked');
            node.classList.remove('is-locked');
            const plateCard = node.querySelector('.island-plate-card');
            if (plateCard) {
                plateCard.classList.remove('is-locked', 'loc-locked');
                plateCard.classList.add('loc-active');
                const statusLabel = plateCard.querySelector('.plate-status-label');
                if (statusLabel) {
                    statusLabel.textContent = `${missionsCompleted}/10 MISSIONS COMPLETED`;
                }
            }
            const orbitBadge = node.querySelector('.island-orbit-badge');
            if (orbitBadge) {
                orbitBadge.classList.remove('is-locked');
                const lockIcon = orbitBadge.querySelector('.badge-lock-icon');
                if (lockIcon) lockIcon.remove();
                if (!orbitBadge.querySelector('.badge-dot')) {
                    const dot = document.createElement('span');
                    dot.className = 'badge-dot';
                    orbitBadge.insertBefore(dot, orbitBadge.firstChild);
                }
            }
        }
        if (selectedChapterId === chapterId) {
            updateInspectorCard(chapterId, false);
        }
        if (typeof drawOrbitalConduits === 'function') {
            drawOrbitalConduits();
        }
    };

    // Synchronize locked / unlocked island states
    syncUnlockedChapters();

    // ==========================================
    // PHASE 3: BACKEND CURRICULUM SYNCHRONIZATION
    // ==========================================
    async function initBackendCurriculum() {
        if (!window.cbApi || !window.cbApi.isAuthenticated()) {
            return;
        }

        try {
            const chapters = await window.cbApi.getChapters().catch(() => null);

            if (Array.isArray(chapters) && chapters.length > 0) {
                chapters.forEach(ch => {
                    const idx = ch.order_index;
                    if (CHAPTERS_DATA[idx]) {
                        CHAPTERS_DATA[idx].backendId = ch.id;
                        CHAPTERS_DATA[idx].title = ch.title;
                        if (ch.description) {
                            CHAPTERS_DATA[idx].description = ch.description;
                        }
                    }
                });
            }

            syncUnlockedChapters();
            updateInspectorCard(selectedChapterId, false);
        } catch (err) {
            console.warn('[COREBOUND] Error loading backend curriculum metadata:', err);
        }
    }

    // Initialize backend curriculum data if authenticated
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBackendCurriculum);
    } else {
        initBackendCurriculum();
    }

    // ==========================================
    // 3D ORBITAL CAROUSEL CONTROLLER
    // ==========================================
    const islandsArray = Array.from(document.querySelectorAll('.island-node[data-island]'));
    const btnCarouselPrev = document.getElementById('btnCarouselPrev');
    const btnCarouselNext = document.getElementById('btnCarouselNext');
    const orbitalConduitGroup = document.getElementById('orbitalConduitGroup');
    const energyConduitsSvg = document.getElementById('energyConduitsSvg');
    let currentSectorIndex = 0; // 0 = Chapter 1 (hero center)

    const CAROUSEL_SLOTS = [
        'slot-center',
        'slot-right-1',
        'slot-right-2',
        'slot-right-3',
        'slot-right-4',
        'slot-left-4',
        'slot-left-3',
        'slot-left-2',
        'slot-left-1'
    ];

    function drawOrbitalConduits() {
        if (orbitalConduitGroup) orbitalConduitGroup.innerHTML = '';
        return;

        function getPoint(node) {
            if (!node) return null;
            const targetEl = node.querySelector('.island-art') || node;
            const r = targetEl.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return null;
            return {
                x: ((r.left + r.width / 2 - svgRect.left) / svgRect.width) * 1920,
                y: ((r.top + r.height * 0.68 - svgRect.top) / svgRect.height) * 1080
            };
        }

        // =========================================================================
        // STRAIGHT + CONTROLLED CURVE ARCHITECTURE FOR MAIN ENERGY HIGHWAY
        // Approximately 60–70% straight:
        // Straight Launch (32%) -> Gentle Natural Bend (36%) -> Straight Dock (32%)
        // =========================================================================
        function generateMainHighway(p1, p2, sampleCount = 64) {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const len = Math.hypot(dx, dy);
            if (len === 0) return { d: '', pts: [], normals: [] };

            const pts = [];
            const normals = [];

            // 64% straight division: 32% start, 32% end, 36% controlled bend in middle
            const tStart = 0.32;
            const tEnd = 0.68;

            for (let i = 0; i <= sampleCount; i++) {
                const t = i / sampleCount;
                let x = p1.x + dx * t;
                let y;

                if (t <= tStart) {
                    // Straight Section 1: Exits island dock with controlled shelf launch (32% straight)
                    const u = t / tStart;
                    y = p1.y + (dy * 0.10) * u;
                } else if (t >= tEnd) {
                    // Straight Section 2: Smooth linear alignment into destination dock (32% straight)
                    const u = (t - tEnd) / (1 - tEnd);
                    y = p1.y + (dy * 0.90) + (dy * 0.10) * u;
                } else {
                    // Gentle Natural Bend: C1/C2 continuous cubic Hermite transition (36% curve)
                    const u = (t - tStart) / (tEnd - tStart);
                    const p0 = 0.10;
                    const p1_val = 0.90;
                    const m0 = 0.1125;
                    const m1 = 0.1125;
                    const h = (2 * u * u * u - 3 * u * u + 1) * p0 +
                        (u * u * u - 2 * u * u + u) * m0 +
                        (-2 * u * u * u + 3 * u * u) * p1_val +
                        (u * u * u - u * u) * m1;
                    y = p1.y + dy * h;
                }

                pts.push({ x, y });
            }

            // Calculate unit normals along the highway for secondary living strands
            for (let i = 0; i <= sampleCount; i++) {
                let tx, ty;
                if (i === 0) {
                    tx = pts[1].x - pts[0].x;
                    ty = pts[1].y - pts[0].y;
                } else if (i === sampleCount) {
                    tx = pts[sampleCount].x - pts[sampleCount - 1].x;
                    ty = pts[sampleCount].y - pts[sampleCount - 1].y;
                } else {
                    tx = pts[i + 1].x - pts[i - 1].x;
                    ty = pts[i + 1].y - pts[i - 1].y;
                }
                const tLen = Math.hypot(tx, ty) || 1;
                normals.push({ nx: -ty / tLen, ny: tx / tLen });
            }

            // Generate SVG path for the Main Highway
            let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
            for (let i = 1; i < pts.length; i++) {
                d += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
            }

            return { d, pts, normals };
        }

        // Secondary Living Strands: Flow organically around the main straight-bend-straight highway
        function generateSecondaryFilament(mainData, offsetFn) {
            const { pts, normals } = mainData;
            if (!pts || pts.length === 0) return '';

            const strandPts = [];
            const total = pts.length - 1;

            for (let i = 0; i <= total; i++) {
                const t = i / total;
                // Envelope guarantees zero offset at island terminals (clean docking into node)
                const envelope = Math.sin(t * Math.PI);
                const offset = offsetFn(t, envelope);

                strandPts.push({
                    x: pts[i].x + normals[i].nx * offset,
                    y: pts[i].y + normals[i].ny * offset
                });
            }

            // Smooth curve through points
            let d = `M ${strandPts[0].x.toFixed(1)} ${strandPts[0].y.toFixed(1)}`;
            for (let i = 1; i < strandPts.length - 1; i++) {
                const xc = (strandPts[i].x + strandPts[i + 1].x) / 2;
                const yc = (strandPts[i].y + strandPts[i + 1].y) / 2;
                d += ` Q ${strandPts[i].x.toFixed(1)} ${strandPts[i].y.toFixed(1)} ${xc.toFixed(1)} ${yc.toFixed(1)}`;
            }
            d += ` L ${strandPts[strandPts.length - 1].x.toFixed(1)} ${strandPts[strandPts.length - 1].y.toFixed(1)}`;
            return d;
        }

        const centerNode = document.querySelector('.island-node.slot-center');
        const right1Node = document.querySelector('.island-node.slot-right-1');
        const right2Node = document.querySelector('.island-node.slot-right-2');
        const right3Node = document.querySelector('.island-node.slot-right-3');
        const right4Node = document.querySelector('.island-node.slot-right-4');
        const left4Node = document.querySelector('.island-node.slot-left-4');
        const left3Node = document.querySelector('.island-node.slot-left-3');
        const left2Node = document.querySelector('.island-node.slot-left-2');
        const left1Node = document.querySelector('.island-node.slot-left-1');

        // ONE PRIMARY ENERGY ROUTE that travels in a mostly straight trajectory through ALL 9 islands
        const primaryHighwaySegments = [
            // Outer Cosmic Horizon Inflow (Left)
            { from: left4Node, to: left3Node, isMajor: false },
            { from: left3Node, to: left2Node, isMajor: false },
            // Primary Active Backbone Route (Central Core Archipelago)
            { from: left2Node, to: left1Node, isMajor: true },
            { from: left1Node, to: centerNode, isMajor: true },
            { from: centerNode, to: right1Node, isMajor: true },
            { from: right1Node, to: right2Node, isMajor: true },
            // Outer Cosmic Horizon Outflow (Right)
            { from: right2Node, to: right3Node, isMajor: false },
            { from: right3Node, to: right4Node, isMajor: false }
        ];

        const connectedIslandNodes = new Map();

        primaryHighwaySegments.forEach(({ from, to, isMajor }) => {
            if (!from || !to) return;
            const p1 = getPoint(from);
            const p2 = getPoint(to);
            if (!p1 || !p2) return;

            // Track unique island terminals for embedded architectural nodes
            connectedIslandNodes.set(from, p1);
            connectedIslandNodes.set(to, p2);

            // Generate Main Highway Data (60-70% straight + gentle natural bend)
            const mainData = generateMainHighway(p1, p2, 64);
            const mainPathD = mainData.d;
            if (!mainPathD) return;

            // 1. MAIN ROUTE AURA: Soft restrained atmospheric cyan glow
            const mainGlow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            mainGlow.setAttribute('d', mainPathD);
            mainGlow.setAttribute('fill', 'none');
            mainGlow.setAttribute('class', 'main-route-glow');
            if (!isMajor) mainGlow.setAttribute('style', 'opacity: 0.65; stroke-width: 4.0px;');
            orbitalConduitGroup.appendChild(mainGlow);

            // 2. MAIN ROUTE CORE: Concentrated white-cyan dominant backbone
            const mainCore = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            mainCore.setAttribute('d', mainPathD);
            mainCore.setAttribute('fill', 'none');
            mainCore.setAttribute('class', 'main-route-core');
            if (!isMajor) mainCore.setAttribute('style', 'opacity: 0.80; stroke-width: 1.6px;');
            orbitalConduitGroup.appendChild(mainCore);

            // 3. TRAVELING ENERGY BEHAVIOR ALONG PATH (Island -> Main Route -> Next Island)
            // Layer A: Small Moving Energy Particles
            const particles = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            particles.setAttribute('d', mainPathD);
            particles.setAttribute('fill', 'none');
            particles.setAttribute('class', 'main-route-particles');
            if (!isMajor) particles.setAttribute('style', 'opacity: 0.60;');
            orbitalConduitGroup.appendChild(particles);

            // Layer B: Subtle Traveling Glow Wave
            const glowWave = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            glowWave.setAttribute('d', mainPathD);
            glowWave.setAttribute('fill', 'none');
            glowWave.setAttribute('class', 'main-route-glow-wave');
            if (!isMajor) glowWave.setAttribute('style', 'opacity: 0.40;');
            orbitalConduitGroup.appendChild(glowWave);

            // Layer C: Occasional Brighter Energy Pulse (Surges periodically through highway)
            const surgePulse = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            surgePulse.setAttribute('d', mainPathD);
            surgePulse.setAttribute('fill', 'none');
            surgePulse.setAttribute('class', 'main-route-surge-pulse');
            if (!isMajor) surgePulse.setAttribute('style', 'opacity: 0.50;');
            orbitalConduitGroup.appendChild(surgePulse);

            // 4. SECONDARY LIVING STRANDS: 3 to 4 thin filaments gently curving around the main highway
            const ampFactor = isMajor ? 1.0 : 0.72;
            const strandConfigs = [
                // Strand 1: Early bend precursor filament (Cyan, thin)
                {
                    cls: 'spiral-strand spiral-strand-1',
                    fn: (t, env) => env * (12 * Math.sin(Math.PI * Math.pow(t, 0.75)) + 4 * Math.cos(t * Math.PI * 4)) * ampFactor
                },
                // Strand 2: Living wave filament curving organically around the bend (Violet)
                {
                    cls: 'spiral-strand spiral-strand-2',
                    fn: (t, env) => env * (13 * Math.sin(t * Math.PI * 6.2 + Math.PI) + 5 * Math.sin(t * Math.PI * 2.8)) * ampFactor
                },
                // Strand 3: Dual cyan/violet filament weaving across the highway
                {
                    cls: 'spiral-strand spiral-strand-3',
                    fn: (t, env) => env * (14 * Math.sin(t * Math.PI * 4.6 + Math.PI * 0.5)) * ampFactor
                },
                // Strand 4: Delicate outer harmonic thread
                {
                    cls: 'spiral-strand spiral-strand-4',
                    fn: (t, env) => env * (10 * Math.sin(t * Math.PI * 3.4 + Math.PI * 1.5) - 3 * env) * ampFactor
                }
            ];

            strandConfigs.forEach(cfg => {
                const strandD = generateSecondaryFilament(mainData, cfg.fn);
                if (!strandD) return;
                const strandEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                strandEl.setAttribute('d', strandD);
                strandEl.setAttribute('fill', 'none');
                strandEl.setAttribute('class', cfg.cls);
                if (!isMajor) strandEl.setAttribute('style', 'opacity: 0.55;');
                orbitalConduitGroup.appendChild(strandEl);
            });
        });

        // 5. ARCHITECTURAL ENERGY NODES: Embedded physically into island infrastructure
        connectedIslandNodes.forEach((pt, node) => {
            const isCenter = node.classList.contains('slot-center');
            const nodeG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            nodeG.setAttribute('class', 'island-energy-node');
            nodeG.setAttribute('transform', `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`);

            // Ambient soft glow
            const amb = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            amb.setAttribute('class', 'node-ambient-glow');
            amb.setAttribute('r', isCenter ? '14' : '11');

            // Energy Intake Induction Halo (energy visibly enters the island)
            const halo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            halo.setAttribute('class', 'node-intake-halo');
            halo.setAttribute('r', isCenter ? '8.5' : '6.5');

            // Rotating containment dashed ring
            const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            ring.setAttribute('class', 'node-outer-ring');
            ring.setAttribute('r', isCenter ? '7.2' : '5.8');

            // Concentrated bright white-cyan terminal core
            const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            core.setAttribute('class', 'node-core-dot');
            core.setAttribute('r', isCenter ? '4.0' : '2.8');

            nodeG.appendChild(amb);
            nodeG.appendChild(halo);
            nodeG.appendChild(ring);
            nodeG.appendChild(core);
            orbitalConduitGroup.appendChild(nodeG);
        });
    }

    let carouselTransitionTimer = null;

    function updateCarouselSlots(triggerVoice = true) {
        const total = islandsArray.length;
        if (total === 0) return;

        islandsArray.forEach((node, i) => {
            CAROUSEL_SLOTS.forEach(cls => node.classList.remove(cls));

            let diff = i - currentSectorIndex;
            while (diff > 4) diff -= total;
            while (diff < -4) diff += total;

            const badge = node.querySelector('.island-orbit-badge');

            if (diff === 0) {
                node.classList.add('slot-center');
                if (badge) badge.classList.add('badge-active');
                currentFocusedIsland = node;
            } else {
                if (badge) badge.classList.remove('badge-active');
                if (diff === 1) node.classList.add('slot-right-1');
                else if (diff === 2) node.classList.add('slot-right-2');
                else if (diff === 3) node.classList.add('slot-right-3');
                else if (diff === 4) node.classList.add('slot-right-4');
                else if (diff === -1) node.classList.add('slot-left-1');
                else if (diff === -2) node.classList.add('slot-left-2');
                else if (diff === -3) node.classList.add('slot-left-3');
                else if (diff === -4) node.classList.add('slot-left-4');
            }
        });

        // Sync inspector card to centered sector
        const centerChapterId = currentSectorIndex + 1;
        updateInspectorCard(centerChapterId, triggerVoice);
    }

    function goToSector(index, triggerVoice = true, fromButton = null) {
        clearTimeout(entrySpeechTimer);
        revealStageEntrance();
        const total = islandsArray.length;
        if (total === 0) return;
        currentSectorIndex = ((index % total) + total) % total;
        playWhooshSfx(1.0 + (Math.random() - 0.5) * 0.1);
        updateCarouselSlots(triggerVoice);

        // Tactile button pulse
        if (fromButton) {
            fromButton.classList.remove('btn-pressed');
            void fromButton.offsetWidth; // Reflow
            fromButton.classList.add('btn-pressed');
            setTimeout(() => fromButton.classList.remove('btn-pressed'), 350);
        }

        const centerNode = islandsArray[currentSectorIndex];
        if (centerNode) {
            triggerMatchIgnition(centerNode);
        }
    }

    function navigateSector(delta, btn = null) {
        goToSector(currentSectorIndex + delta, true, btn);
    }

    // Block click events on bottom cards, pills, and badges so they never launch missions
    document.querySelectorAll('.loc-card, .island-plate-card, .plate-header, .plate-sub-panel, .island-orbit-badge').forEach(el => {
        ['click', 'mousedown', 'pointerdown'].forEach(evt => {
            el.addEventListener(evt, function (e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            });
        });
    });

    // Attach Island click behaviors (Center = launch/lock; Flank = rotate to center)
    islandsArray.forEach((node, idx) => {
        node.addEventListener('click', function (e) {
            if (e.target && (e.target.closest('.loc-card') || e.target.closest('.island-plate-card') || e.target.closest('.island-orbit-badge'))) {
                e.stopPropagation();
                return;
            }
            e.stopPropagation();
            if (idx === currentSectorIndex) {
                triggerMatchIgnition(node);
                handleMissionLaunch(e);
            } else {
                goToSector(idx, true);
            }
        });
    });

    // Navigation chevrons (< and >)
    if (btnCarouselPrev) {
        btnCarouselPrev.addEventListener('click', function (e) {
            e.stopPropagation();
            navigateSector(-1, btnCarouselPrev);
        });
    }

    if (btnCarouselNext) {
        btnCarouselNext.addEventListener('click', function (e) {
            e.stopPropagation();
            navigateSector(1, btnCarouselNext);
        });
    }

    // Keyboard arrow keys (< and >)
    window.addEventListener('keydown', function (e) {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            navigateSector(-1, btnCarouselPrev);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            navigateSector(1, btnCarouselNext);
        }
    });

    // Window resize updates conduits
    window.addEventListener('resize', drawOrbitalConduits);

    // Initial setup: activate slots & render conduits immediately
    updateCarouselSlots(false);
    drawOrbitalConduits();

    // Auto-trigger Nova AI speech ONCE upon entering the level screen (skip if returning from mission screen)
    if (hasSpokenOnEntry) {
        revealStageEntrance();
    } else {
        setTimeout(function () {
            triggerEntrySpeech();
        }, 600);
    }

    // ==========================================
    // CHAPTER 1 MISSION LOADING & LAUNCH SYSTEM
    // ==========================================
    const loadingOverlay = document.getElementById('chapterLoadingOverlay');
    const loadingPctDisplay = document.getElementById('loadingPctDisplay');
    const loadingGaugeFill = document.getElementById('loadingGaugeFill');
    const loadingStageLabel = document.getElementById('loadingStageLabel');
    let isChapterLoading = false;

    function startChapter1Loading() {
        if (isChapterLoading) return;
        isChapterLoading = true;

        playSfx(1.1);
        playWhooshSfx(1.1);
        stopBgMusic();

        if (loadingOverlay) {
            loadingOverlay.classList.add('is-active');
            loadingOverlay.setAttribute('aria-hidden', 'false');
        }

        const startTime = performance.now();
        const totalDuration = 1200; // Fast & crisp 1.2s minimal transition

        function updateLoading(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(1, elapsed / totalDuration);
            const easeProgress = 1 - Math.pow(1 - progress, 2);
            const currentPct = Math.floor(easeProgress * 100);

            if (loadingPctDisplay) {
                loadingPctDisplay.textContent = currentPct + '%';
            }
            if (loadingGaugeFill) {
                loadingGaugeFill.style.width = currentPct + '%';
            }

            if (loadingStageLabel) {
                if (currentPct < 45) {
                    loadingStageLabel.textContent = 'CONNECTING...';
                } else if (currentPct < 85) {
                    loadingStageLabel.textContent = 'LOADING SECTOR 01...';
                } else {
                    loadingStageLabel.textContent = 'LAUNCHING...';
                }
            }

            if (progress < 1) {
                requestAnimationFrame(updateLoading);
            } else {
                setTimeout(function () {
                    window.location.href = 'sub_missions.html?intro=true';
                }, 120);
            }
        }

        requestAnimationFrame(updateLoading);
    }

    function handleMissionLaunch(e) {
        if (e) e.stopPropagation();
        const data = CHAPTERS_DATA[selectedChapterId] || CHAPTERS_DATA[1];
        if (data && data.unlocked) {
            startChapter1Loading();
        } else {
            playSfx(0.6); // Lock sound feedback
            const btn = document.getElementById('startMissionBtn');
            const target = btn || inspectorCard;
            if (target) {
                target.classList.remove('shake');
                void target.offsetWidth; // trigger reflow
                target.classList.add('shake');
            }
            if (data) {
                speakNova(`<span style="color:#f87171;font-weight:700;">[ACCESS DENIED]</span> ${data.requirement || 'Complete previous chapter first!'}`);
            }
        }
    }

    const startMissionBtn = document.getElementById('startMissionBtn');
    if (startMissionBtn) {
        startMissionBtn.addEventListener('click', handleMissionLaunch);
    }

    // ==========================================
    // COSMIC AUDIO CONTROLS & BACKGROUND MUSIC
    // ==========================================
    function startBgMusic() {
        if (isMusicMuted || !bgMusic) return;
        const savedTime = sessionStorage.getItem('story_ambient_time');
        if (savedTime && !isNaN(parseFloat(savedTime))) {
            try {
                bgMusic.currentTime = parseFloat(savedTime);
            } catch (e) { }
            sessionStorage.removeItem('story_ambient_time');
        }
        bgMusic.volume = 0;
        bgMusic.play().then(function () {
            isMusicPlaying = true;
            // Smooth fade-in
            let vol = 0;
            const fadeIn = setInterval(function () {
                if (isMusicMuted) { clearInterval(fadeIn); return; }
                vol += 0.04;
                if (vol >= MASTER_MUSIC_VOL) {
                    bgMusic.volume = MASTER_MUSIC_VOL;
                    clearInterval(fadeIn);
                } else {
                    bgMusic.volume = vol;
                }
            }, 40);
        }).catch(function () {
            // Autoplay policy: unlocks on first user gesture
        });
    }

    function stopBgMusic() {
        if (!bgMusic) return;
        let v = bgMusic.volume;
        const fadeOut = setInterval(function () {
            v -= 0.05;
            if (v <= 0) {
                bgMusic.volume = 0;
                bgMusic.pause();
                isMusicPlaying = false;
                clearInterval(fadeOut);
            } else {
                bgMusic.volume = v;
            }
        }, 25);
    }

    function setMusicState(enable) {
        isMusicMuted = !enable;
        localStorage.setItem('corebound_music_muted', isMusicMuted);
        if (musicToggle) musicToggle.checked = enable;

        if (enable) {
            startBgMusic();
        } else {
            stopBgMusic();
        }
    }

    // Music Checkbox Toggle
    if (musicToggle) {
        musicToggle.addEventListener('change', function () {
            setMusicState(this.checked);
            playSfx(1.1);
        });
    }

    // SFX Checkbox Toggle
    if (sfxToggle) {
        sfxToggle.addEventListener('change', function () {
            isSfxMuted = !this.checked;
            localStorage.setItem('corebound_sfx_muted', isSfxMuted);
            playSfx(1.2);
        });
    }

    // Open & Close Settings Modal
    function openSettings() {
        if (!settingsModal) return;
        settingsModal.classList.add('is-open');
        playSfx(1.2);
    }

    function closeSettings() {
        if (!settingsModal) return;
        settingsModal.classList.remove('is-open');
        playSfx(0.9);
    }

    if (settingsDockBtn) {
        settingsDockBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            openSettings();
        });
    }

    if (settingsCloseBtn) {
        settingsCloseBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            closeSettings();
        });
    }

    // Close when clicking modal backdrop
    if (settingsModal) {
        settingsModal.addEventListener('click', function (e) {
            if (e.target === settingsModal) {
                closeSettings();
            }
        });
    }

    // ==========================================================================
    // GUARDIAN DOSSIER MODAL CONTROLLER
    // ==========================================================================
    const guardianModal = document.getElementById('guardianModal');
    const guardianModalCloseBtn = document.getElementById('guardianModalCloseBtn');
    const hudProfileCard = document.getElementById('hudProfileCard') || document.querySelector('.hud-profile-card, .hud-profile-capsule');
    const profileDockBtn = document.getElementById('profileDockBtn');

    function openGuardianModal() {
        if (!guardianModal) return;
        guardianModal.classList.add('is-open');
        playSfx(1.2);
    }

    function closeGuardianModal() {
        if (!guardianModal) return;
        guardianModal.classList.remove('is-open');
        playSfx(0.9);
    }

    if (hudProfileCard) {
        hudProfileCard.addEventListener('click', function (e) {
            e.stopPropagation();
            openGuardianModal();
        });
    }

    if (profileDockBtn) {
        profileDockBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            openGuardianModal();
        });
    }

    if (guardianModalCloseBtn) {
        guardianModalCloseBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            closeGuardianModal();
        });
    }

    if (guardianModal) {
        guardianModal.addEventListener('click', function (e) {
            if (e.target === guardianModal) {
                closeGuardianModal();
            }
        });
    }

    // HUD Refill Energy Button (+)
    const btnRefillEnergy = document.getElementById('btnRefillEnergy');
    if (btnRefillEnergy) {
        btnRefillEnergy.addEventListener('click', function (e) {
            e.stopPropagation();
            playSfx(1.4);
            this.classList.add('pulse-pop');
            setTimeout(() => this.classList.remove('pulse-pop'), 400);
        });
    }

    // 'M' Key shortcut to toggle music & 'Escape' to close modals
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (guardianModal && guardianModal.classList.contains('is-open')) {
                closeGuardianModal();
                return;
            }
            if (settingsModal && settingsModal.classList.contains('is-open')) {
                closeSettings();
                return;
            }
        }
        if ((e.key === 'm' || e.key === 'M') && !e.target.closest('input, textarea')) {
            setMusicState(isMusicMuted);
        }
    });

    // Auto start on page load & unlock on first interaction
    if (!isMusicMuted) {
        startBgMusic();
    }
    const unlockAudio = function () {
        if (!isMusicPlaying && !isMusicMuted) {
            startBgMusic();
        }
        if (!hasSpokenOnEntry && (function () {
            try { return sessionStorage.getItem('cb_level_intro_spoken') !== 'true'; } catch (e) { return true; }
        })()) {
            triggerEntrySpeech();
        }
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });

    // ══════════════════════════════════════════════════
    // DAILY REWARD INTERACTION & LIVE COUNTDOWN
    // ══════════════════════════════════════════════════
    const rewardTimerEl = document.getElementById('rewardTimer');
    const claimRewardBtn = document.getElementById('claimRewardBtn');
    let rewardSecondsLeft = 12 * 3600 + 45 * 60 + 30; // 12:45:30

    function formatTime(totalSecs) {
        const h = Math.floor(totalSecs / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const s = totalSecs % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    const timerHoursEl = document.getElementById('timerHours');
    const timerMinsEl = document.getElementById('timerMins');
    const timerSecsEl = document.getElementById('timerSecs');

    if (rewardTimerEl) {
        setInterval(function () {
            if (rewardSecondsLeft > 0) {
                rewardSecondsLeft--;
                const h = Math.floor(rewardSecondsLeft / 3600);
                const m = Math.floor((rewardSecondsLeft % 3600) / 60);
                const s = rewardSecondsLeft % 60;
                if (timerHoursEl && timerMinsEl && timerSecsEl) {
                    timerHoursEl.textContent = String(h).padStart(2, '0');
                    timerMinsEl.textContent = String(m).padStart(2, '0');
                    timerSecsEl.textContent = String(s).padStart(2, '0');
                } else {
                    rewardTimerEl.textContent = formatTime(rewardSecondsLeft);
                }
            }
        }, 1000);
    }

    if (claimRewardBtn) {
        claimRewardBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            playSfx(1.3);
            playNovaChime();
            claimRewardBtn.classList.add('is-claimed');
            claimRewardBtn.innerHTML = '<span class="btn-text">CLAIMED</span>';
            setTimeout(() => {
                claimRewardBtn.classList.remove('is-claimed');
                claimRewardBtn.innerHTML = '<span class="btn-shine"></span><span class="btn-text">CLAIM</span>';
                claimRewardBtn.style.borderColor = '';
                claimRewardBtn.style.color = '';
                claimRewardBtn.style.background = '';
            }, 3000);
        });
    }

    // ══════════════════════════════════════════════════
    // PREMIUM HUD ANIMATIONS (Progress Arc Entrance)
    // ══════════════════════════════════════════════════
    const progressPctText = document.getElementById('progressPctText');
    const progressRingBar = document.querySelector('.ring-bar');
    let gaugeAnimationId = null;

    function renderProgressGauge(targetPct, duration = 1200) {
        if (!progressPctText || !progressRingBar) return;
        const totalCircumference = 351.85;
        if (gaugeAnimationId) {
            cancelAnimationFrame(gaugeAnimationId);
            gaugeAnimationId = null;
        }
        let startTime = null;

        function step(now) {
            if (!startTime) startTime = now;
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const val = Math.round(ease * targetPct);
            progressPctText.textContent = val;
            progressRingBar.style.strokeDashoffset = totalCircumference - (totalCircumference * (val / 100));
            if (progress < 1) {
                gaugeAnimationId = requestAnimationFrame(step);
            }
        }
        gaugeAnimationId = requestAnimationFrame(step);
    }

    // Fallback animation for unauthenticated / offline mode
    if (progressPctText && progressRingBar && (!window.cbApi || !window.cbApi.isAuthenticated())) {
        progressRingBar.style.strokeDashoffset = 351.85;
        setTimeout(() => renderProgressGauge(70), 500);
    }

    // ══════════════════════════════════════════════════
    // THREEUI SHADERBUTTONS: INDUCTION BUTTON VARIANT (Raw WebGL)
    // Canonical Source Runtime (Dynamic Neural Arcs & Valence Discharge)
    // ══════════════════════════════════════════════════
    (function initInductionButtonGL() {
        const btn = document.getElementById('startMissionBtn');
        const canvas = document.getElementById('btn-gl');
        if (!btn || !canvas) return;

        const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false }) ||
                   canvas.getContext('experimental-webgl', { alpha: true, antialias: true });
        if (!gl) {
            btn.style.background = 'rgba(6, 38, 48, 0.5)';
            btn.style.boxShadow = '0 0 0 2px #00f2fe, 0 0 24px rgba(0, 242, 254, .5)';
            return;
        }

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);

        function compileShader(gl, type, src) {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                console.error('shader compile failed:', gl.getShaderInfoLog(s));
            }
            return s;
        }

        function createProgram(gl, vsSrc, fsSrc) {
            const prog = gl.createProgram();
            gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, vsSrc));
            gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, fsSrc));
            gl.linkProgram(prog);
            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
                console.error('program link failed:', gl.getProgramInfoLog(prog));
            }
            return prog;
        }

        const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

        const FS_BTN = [
            'precision highp float;',
            'uniform vec2 u_res;',
            'uniform float u_time;',
            'uniform float u_arcs;',
            'uniform float u_flash;',
            'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}',
            'float noise(vec2 p){',
            '  vec2 i=floor(p), f=fract(p);',
            '  vec2 u=f*f*(3.0-2.0*f);',
            '  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),',
            '             mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);',
            '}',
            'float fbm(vec2 p){',
            '  float v=0.0; float a=0.5;',
            '  for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.05+vec2(9.7,3.1); a*=0.5; }',
            '  return v;',
            '}',
            'float sdChamferBox(vec2 p, vec2 b, float c){',
            '  vec2 q = abs(p) - b;',
            '  float ch = (abs(p.x) + abs(p.y) - (b.x + b.y - c)) * 0.70710678;',
            '  return max(max(q.x, q.y), ch);',
            '}',
            'void main(){',
            '  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;',
            '  float ar = u_res.x / u_res.y;',
            '  vec2 hs = vec2(ar * 0.5 - 0.045, 0.5 - 0.045);',
            '  float d = sdChamferBox(p, hs, 0.24);',
            '  float t = u_time;',
            '  float hover = clamp(u_arcs / 6.0, 0.0, 1.0);',
            '  float plate = 1.0 - smoothstep(-0.005, 0.005, d);',
            '  vec3 plateCol = vec3(0.015, 0.055, 0.095);',
            '  plateCol += vec3(0.01, 0.035, 0.065) * fbm(p * 8.0);',
            '  plateCol += vec3(0.0, 0.35, 0.55) * exp(d * 10.0) * (0.2 + hover * 0.5);',
            '  float a = atan(p.y, p.x);',
            '  vec3 arcCol = vec3(0.0);',
            '  for (int i = 0; i < 6; i++) {',
            '    float fi = float(i);',
            '    float w = clamp(u_arcs - fi, 0.0, 1.0);',
            '    float n1 = fbm(vec2(a * 2.4 + fi * 11.3, t * (1.6 + fi * 0.27) + fi * 53.1));',
            '    float off = (n1 - 0.5) * (0.09 + u_flash * 0.08);',
            '    float seg = smoothstep(0.35, 0.75, noise(vec2(a * 1.8 + fi * 7.7, t * (0.9 + fi * 0.13) + fi * 19.0)));',
            '    seg = 0.3 + 0.7 * seg;',
            '    float g = 0.0042 / (abs(d + off) + 0.0055);',
            '    arcCol += (vec3(0.0, 0.80, 1.0) * g + vec3(0.70, 1.0, 0.98) * g * g * 0.55) * w * seg;',
            '  }',
            '  float outerMask = 1.0 - smoothstep(0.01, 0.10, d);',
            '  vec3 finalArc = arcCol * (0.70 + 0.45 * hover) * outerMask;',
            '  float ring = 0.006 / (abs(d) + 0.006);',
            '  vec3 flashCol = (vec3(0.85, 0.98, 1.0) * ring * 1.6 + vec3(0.4, 0.9, 1.0) * 0.35) * u_flash * outerMask;',
            '  vec3 rgb = plateCol * plate + finalArc + flashCol;',
            '  float plateAlpha = plate * (0.32 + hover * 0.18);',
            '  float arcAlpha = clamp((finalArc.r + finalArc.g + finalArc.b) * 0.55, 0.0, 1.0);',
            '  float flashAlpha = clamp((flashCol.r + flashCol.g + flashCol.b) * 0.45, 0.0, 1.0);',
            '  float glowAlpha = exp(-max(d, 0.0) * 22.0) * (0.12 + hover * 0.20);',
            '  float aOut = clamp(plateAlpha + arcAlpha + flashAlpha + glowAlpha, 0.0, 1.0);',
            '  gl_FragColor = vec4(rgb, aOut);',
            '}'
        ].join('\n');

        const prog = createProgram(gl, VS, FS_BTN);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const locP = gl.getAttribLocation(prog, 'p');
        gl.enableVertexAttribArray(locP);
        gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0);

        const uRes = gl.getUniformLocation(prog, 'u_res');
        const uTime = gl.getUniformLocation(prog, 'u_time');
        const uArcs = gl.getUniformLocation(prog, 'u_arcs');
        const uFlash = gl.getUniformLocation(prog, 'u_flash');

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
            const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
                gl.viewport(0, 0, w, h);
                gl.uniform2f(uRes, w, h);
            }
        }
        window.addEventListener('resize', resize, { passive: true });
        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(resize);
            ro.observe(btn);
        }
        resize();

        let arcs = 2.4, arcsTarget = 2.4, flash = 0, crawl = 0;
        let last = performance.now();
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        btn.addEventListener('mouseenter', () => arcsTarget = 5.8);
        btn.addEventListener('mouseleave', () => arcsTarget = 2.4);
        btn.addEventListener('focus', () => arcsTarget = 5.8);
        btn.addEventListener('blur', () => arcsTarget = 2.4);
        btn.addEventListener('click', () => flash = 1.0);

        function frame(now) {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            arcs += (arcsTarget - arcs) * Math.min(1, dt * 5);
            flash *= Math.exp(-3.6 * dt);
            crawl += dt * (0.6 + (arcs / 6) * 1.1 + flash * 2.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform1f(uTime, reduced ? 3.0 : crawl);
            gl.uniform1f(uArcs, arcs);
            gl.uniform1f(uFlash, flash);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    })();

    // ==========================================================================
    // PHASE 11E: DYNAMIC LEVEL PROFILE & HUD SYNCHRONIZATION
    // ==========================================================================
    async function syncBackendLevelState() {
        if (!window.cbApi || !window.cbApi.isAuthenticated()) {
            return;
        }

        // Top HUD elements
        const xpEl = document.querySelector('.curr-val.xp-val');
        const coinEl = document.querySelector('.curr-val.coin-val');
        const shardEl = document.querySelector('.curr-val.shard-val');
        const heartEl = document.querySelector('.curr-val.heart-val');
        const lvlEl = document.querySelector('.profile-level');
        const roleEl = document.querySelector('.profile-role');
        const barEl = document.querySelector('.profile-progress-bar');
        const avatarEl = document.querySelector('.profile-avatar-img');

        // Guardian Dossier Modal elements
        const modalLvl = document.querySelector('.xp-level-badge');
        const modalXp = document.querySelector('.xp-ratio-text');
        const modalBar = document.querySelector('.xp-card-bar-fill');
        const modalHeart = document.querySelector('.stat-val.heart-color');
        const modalRank = document.querySelector('.guardian-rank-tag');
        const modalTitle = document.querySelector('.guardian-title-text');
        const modalPortrait = document.querySelector('.guardian-portrait-img');
        const modalFootnote = document.querySelector('.xp-card-footnote');

        // World Map Island & Chapter Progress elements
        const plateStatus = document.querySelector('.island-node[data-island="1"] .plate-status-label');
        const progressPctEl = document.getElementById('progressPctText');

        // Step 12: Set loading placeholders immediately to prevent stale hardcoded values from flashing
        if (xpEl && (xpEl.textContent === '2,450' || !xpEl.textContent)) xpEl.textContent = '—';
        if (coinEl && (coinEl.textContent === '1,280' || !coinEl.textContent)) coinEl.textContent = '—';
        if (shardEl) shardEl.textContent = '—';
        if (heartEl) heartEl.textContent = '—';
        if (lvlEl && (lvlEl.textContent.includes('12') || !lvlEl.textContent)) lvlEl.textContent = 'LEVEL —';
        if (barEl && barEl.style.width === '72%') barEl.style.width = '0%';
        if (progressPctEl && progressPctEl.textContent === '70') progressPctEl.textContent = '—';

        if (modalLvl && modalLvl.textContent.includes('12')) modalLvl.textContent = 'LEVEL —';
        if (modalXp && modalXp.textContent.includes('2,450')) modalXp.innerHTML = '<strong style="color:#d8b4fe;">—</strong> XP';
        if (modalBar && modalBar.style.width === '70%') modalBar.style.width = '0%';
        if (modalHeart) modalHeart.textContent = '—';
        if (modalRank && modalRank.textContent.includes('RANK S')) modalRank.textContent = 'SENTINEL';

        try {
            // Fetch authoritative profile, rewards, and progress summary in parallel
            const [profileRes, rewardsRes, summaryRes, progressRecordsRes] = await Promise.allSettled([
                window.cbApi.getProfile(),
                window.cbApi.getRewards ? window.cbApi.getRewards() : window.cbApi.request('/api/v1/rewards/me', { method: 'GET' }),
                window.cbApi.getProgressSummary(),
                window.cbApi.getMissionProgress()
            ]);

            const profile = profileRes.status === 'fulfilled' ? profileRes.value : null;
            const rewards = rewardsRes.status === 'fulfilled' ? rewardsRes.value : null;
            const summary = summaryRes.status === 'fulfilled' ? summaryRes.value : null;
            const progressRecords = progressRecordsRes.status === 'fulfilled' ? progressRecordsRes.value : null;

            // 1. Authoritative XP (Step 5, Step 7)
            const xpVal = (rewards && typeof rewards.xp === 'number')
                ? rewards.xp
                : (profile && typeof profile.xp === 'number' ? profile.xp : null);

            if (typeof xpVal === 'number') {
                if (xpEl) xpEl.textContent = xpVal.toLocaleString();
                if (modalXp) modalXp.innerHTML = `<strong style="color:#d8b4fe;">${xpVal.toLocaleString()}</strong> XP`;
            } else if (xpEl) {
                xpEl.textContent = '—';
            }

            // 2. Authoritative Credits (Step 5, Step 9)
            const creditsVal = (rewards && typeof rewards.credits === 'number')
                ? rewards.credits
                : (profile && typeof profile.credits === 'number' ? profile.credits : null);

            if (typeof creditsVal === 'number') {
                if (coinEl) coinEl.textContent = creditsVal.toLocaleString();
            } else if (coinEl) {
                coinEl.textContent = '—';
            }

            // 3. Authoritative Level (Step 4, Step 8)
            const levelVal = (rewards && typeof rewards.level === 'number')
                ? rewards.level
                : (profile && typeof profile.level === 'number' ? profile.level : 1);

            if (lvlEl) lvlEl.textContent = `LEVEL ${levelVal}`;
            if (modalLvl) modalLvl.textContent = `LEVEL ${levelVal}`;

            // 4. Pure visual XP progress bar within current level (Step 7)
            if (typeof xpVal === 'number') {
                const visualPct = xpVal === 0 ? 0 : Math.min(100, Math.max(5, Math.round((xpVal % 1000) / 10)));
                if (barEl) barEl.style.width = `${visualPct}%`;
                if (modalBar) modalBar.style.width = `${visualPct}%`;
            }

            // 5. User / Profile Name & Avatar (Step 4)
            let displayName = '';
            if (profile && profile.display_name && profile.display_name.trim()) {
                displayName = profile.display_name.trim();
            } else {
                const storedUser = (window.cbApi.getStoredUser && window.cbApi.getStoredUser()) || null;
                if (storedUser && storedUser.display_name && storedUser.display_name.trim()) {
                    displayName = storedUser.display_name.trim();
                } else if (storedUser && storedUser.email) {
                    displayName = storedUser.email.split('@')[0];
                }
            }
            if (displayName) {
                if (roleEl) roleEl.textContent = displayName.toUpperCase();
                if (modalTitle) modalTitle.textContent = displayName.toUpperCase();
            }
            if (profile && profile.avatar_url) {
                if (avatarEl) avatarEl.src = profile.avatar_url;
                if (modalPortrait) modalPortrait.src = profile.avatar_url;
            }

            // 6. Rank / Sentinel Tag (Step 8: Preserve static category without fabricating a fake rank)
            if (modalRank) {
                modalRank.textContent = `SENTINEL // LEVEL ${levelVal}`;
            }
            if (modalFootnote) {
                modalFootnote.textContent = `Current Status: Level ${levelVal} Sentinel`;
            }

            // 7. Shards (Step 9: Backend does not provide shards — preserve slot neutrally without fake 42)
            if (shardEl) {
                shardEl.textContent = '—';
                if (shardEl.parentElement) {
                    shardEl.parentElement.setAttribute('title', 'Aether Shards (Unavailable)');
                }
            }

            // 8. Energy (Step 10: Backend does not provide energy — preserve slot neutrally without fake 5/5)
            if (heartEl) {
                heartEl.textContent = '—';
                if (heartEl.parentElement) {
                    heartEl.parentElement.setAttribute('title', 'Guardian Energy (Active)');
                }
            }
            if (modalHeart) {
                modalHeart.textContent = '—';
            }

            // 9. Authoritative Progress & Chapter Arc (Step 6)
            let completedCount = 0;
            let totalMissions = 10;
            let completionPct = 0;

            if (summary && typeof summary.completed_missions === 'number') {
                completedCount = summary.completed_missions;
                totalMissions = summary.total_missions || 10;
                completionPct = Math.round(summary.completion_percentage || 0);
            } else if (Array.isArray(progressRecords)) {
                completedCount = progressRecords.filter(p => p.status === 'COMPLETED').length;
                totalMissions = progressRecords.length || 10;
                completionPct = Math.round((completedCount / totalMissions) * 100);
            }

            if (plateStatus) {
                plateStatus.textContent = `${completedCount}/${totalMissions} MISSIONS COMPLETED`;
            }

            // ISSUE 4 FIX: Populate dossier stat cards from authoritative backend data
            const dossierLogicSynth = document.getElementById('dossierLogicSynth');
            const dossierPatternAnalysis = document.getElementById('dossierPatternAnalysis');
            const dossierCorruptionShield = document.getElementById('dossierCorruptionShield');
            const dossierEnergyCapacity = document.getElementById('dossierEnergyCapacity');

            if (Array.isArray(progressRecords) && progressRecords.length > 0) {
                // Logic Synthesis: average best_score across all completed missions (0–100 → %)
                const completed = progressRecords.filter(p => p.status === 'COMPLETED' && typeof p.best_score === 'number');
                if (completed.length > 0) {
                    const avgScore = Math.round(completed.reduce((sum, p) => sum + p.best_score, 0) / completed.length);
                    if (dossierLogicSynth) dossierLogicSynth.textContent = `${avgScore}%`;
                } else if (dossierLogicSynth) {
                    dossierLogicSynth.textContent = '—';
                }

                // Pattern Analysis: completion rate (completed / total)
                const completionRatePct = totalMissions > 0 ? Math.round((completedCount / totalMissions) * 100) : 0;
                if (dossierPatternAnalysis) {
                    dossierPatternAnalysis.textContent = completedCount > 0 ? `${completionRatePct}%` : '—';
                }

                // Corruption Shield: 100% if all done, else proportional
                if (dossierCorruptionShield) {
                    dossierCorruptionShield.textContent = completedCount >= totalMissions ? '100%'
                        : (completedCount > 0 ? `${completionRatePct}%` : '—');
                }
            } else {
                // No progress data available — neutral display
                if (dossierLogicSynth) dossierLogicSynth.textContent = '—';
                if (dossierPatternAnalysis) dossierPatternAnalysis.textContent = '—';
                if (dossierCorruptionShield) dossierCorruptionShield.textContent = '—';
            }
            // Energy Capacity: not provided by backend — keep neutral
            if (dossierEnergyCapacity) dossierEnergyCapacity.textContent = '—';

            renderProgressGauge(completionPct);

            // Unlock Chapter 2 if all missions are completed
            if (completedCount >= 10 && typeof CHAPTERS_DATA !== 'undefined' && CHAPTERS_DATA[2]) {
                CHAPTERS_DATA[2].unlocked = true;
                CHAPTERS_DATA[2].statusBadge = "ACTIVE CHAPTER";
                CHAPTERS_DATA[2].btnText = "START";
                syncUnlockedChapters();
            }

        } catch (err) {
            console.warn('[COREBOUND] Level HUD synchronization warning:', err);
            // Safe fallback state on API failure (Step 13)
            if (xpEl && xpEl.textContent === '') xpEl.textContent = '—';
            if (coinEl && coinEl.textContent === '') coinEl.textContent = '—';
            if (lvlEl && lvlEl.textContent === '') lvlEl.textContent = 'LEVEL —';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncBackendLevelState);
    } else {
        syncBackendLevelState();
    }
})();

