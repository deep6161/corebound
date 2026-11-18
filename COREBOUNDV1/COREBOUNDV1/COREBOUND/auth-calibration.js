/**
 * COREBOUND — Unified Sentinel Auth & 7-Phase Calibration Controller
 * Coordinates the exact flow:
 * Opening Story -> Sentinel Access (Login or Register) -> 7-Phase Calibration (if registering / uncalibrated) -> Enter World Map (level.html)
 */
(function () {
    'use strict';

    // 1. Procedural Audio Engine
    let audioCtx = null;
    function playTone(freq = 440, type = 'sine', duration = 0.15) {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {}
    }

    function playChime() {
        [440, 554.37, 659.25, 880].forEach((f, i) => {
            setTimeout(() => playTone(f, 'triangle', 0.25), i * 70);
        });
    }

    function playError() {
        playTone(140, 'sawtooth', 0.2);
    }

    // 2. Storage Helpers
    const USER_KEY = 'corebound_sentinel_user';
    const PREFS_KEY = 'corebound_guardian_prefs';

    function getStoredUser() {
        try {
            const raw = localStorage.getItem(USER_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }

    function setStoredUser(u) {
        try {
            if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
            else localStorage.removeItem(USER_KEY);
        } catch {}
    }

    function getStoredPrefs() {
        try {
            const raw = localStorage.getItem(PREFS_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }

    function setStoredPrefs(p) {
        try {
            localStorage.setItem(PREFS_KEY, JSON.stringify(p));
        } catch {}
    }

    // 3. 7-Phase Calibration Matrix Data
    const PHASES = [
        {
            num: 1,
            key: "primaryGoal",
            title: "Phase 1: Primary Directive & Goal",
            subtitle: "Define the core motivation for your Sentinel journey through Aetheria.",
            lore: "Neural synchronization requires aligning your cognitive trajectory.",
            type: "single",
            options: [
                { id: "placement_prep", title: "Placement Prep", desc: "Campus recruitments, aptitude drills & core CS fundamentals.", badge: "CAMPUS TRACK", glow: "cyan" },
                { id: "interview_prep", title: "Interview Prep", desc: "Live coding simulations & system architecture defense.", badge: "CAREER SPRINT", glow: "cyan" },
                { id: "skill_improvement", title: "Skill Improvement", desc: "Algorithmic speed, pattern recognition & clean code.", badge: "ENGINE BOOST", glow: "purple" },
                { id: "competitive_programming", title: "Competitive Programming", desc: "Hardcore DSA, time-bound contests & ranking ladders.", badge: "COMBAT LEAGUE", glow: "gold" },
                { id: "academic_prep", title: "Academic Prep", desc: "University coursework, CS theory & discrete math.", badge: "SCHOLAR PROTOCOL", glow: "purple" },
                { id: "other_custom", title: "Other / Custom Directive", desc: "Self-directed open exploration & personalized track.", badge: "CUSTOM MATRIX", glow: "cyan" }
            ]
        },
        {
            num: 2,
            key: "targetRole",
            title: "Phase 2: Target Role Specialization",
            subtitle: "Select the engineering discipline you wish to command in the field.",
            lore: "Your Codex will tailor sector drills and challenge suites to this designated role.",
            type: "single",
            cols: 3,
            options: [
                { id: "frontend", title: "Frontend Developer", desc: "UI/UX architecture, WebGL shaders & reactive state." },
                { id: "backend", title: "Backend Developer", desc: "Microservices, distributed APIs & high throughput." },
                { id: "fullstack", title: "Full Stack Developer", desc: "End-to-end stack dominance across client & database." },
                { id: "software_engineer", title: "Software Engineer", desc: "Generalist architecture, OOP & algorithmic systems." },
                { id: "data_analyst", title: "Data Analyst", desc: "SQL queries, statistical modeling & telemetry." },
                { id: "data_scientist_ml", title: "Data Scientist / ML", desc: "Neural networks, PyTorch tensors & predictive AI." },
                { id: "qa_automation", title: "QA / Automation Engineer", desc: "Test harnesses, fuzzing protocols & stress testing." },
                { id: "devops_cloud", title: "DevOps / Cloud Engineer", desc: "Kubernetes, CI/CD telemetry & Docker containers." },
                { id: "other_role", title: "Other Specialization", desc: "Security, Embedded IoT, Mobile or Game Systems." }
            ]
        },
        {
            num: 3,
            key: "skillLevel",
            title: "Phase 3: Current Skill Level Tier",
            subtitle: "Calibrate your starting baseline for dynamic challenge scaling.",
            lore: "Honest assessment guarantees optimal experience gain without cognitive overload.",
            type: "single",
            cols: 3,
            options: [
                { id: "beginner", title: "Tier I — Beginner", desc: "Learning syntax, logic & coding constructs from scratch.", badge: "🌱 CYAN GLOW • INITIATE", tier: "I", glow: "cyan" },
                { id: "intermediate", title: "Tier II — Intermediate", desc: "Building standard projects & solving medium DSA problems.", badge: "⚔️ PURPLE GLOW • SENTINEL", tier: "II", glow: "purple" },
                { id: "advanced", title: "Tier III — Advanced", desc: "Deep optimization, complex dynamic DP & system scale.", badge: "👑 GOLD GLOW • ARCHON", tier: "III", glow: "gold" }
            ]
        },
        {
            num: 4,
            key: "practiceTopics",
            title: "Phase 4: Focus Practice Topics",
            subtitle: "Select one or more domain topics to prioritize in your training matrix.",
            lore: "You can select multiple topics. The Core will synthesize mixed domain challenges.",
            type: "multi",
            cols: 3,
            options: [
                { id: "dsa", title: "Data Structures & Algorithms", desc: "Trees, Graphs, DP, Arrays, Heaps", badge: "CORE DSA" },
                { id: "javascript_ts", title: "JavaScript / TypeScript", desc: "Async/Await, Closures, DOM, Types", badge: "WEB RUNTIME" },
                { id: "python", title: "Python", desc: "Data Science, PyTorch, OOP, Scripts", badge: "PYTHON" },
                { id: "java", title: "Java", desc: "JVM internals, Spring, Multithreading", badge: "ENTERPRISE" },
                { id: "cpp", title: "C++", desc: "Pointers, Memory, STL, High Performance", badge: "PERFORMANCE" },
                { id: "sql_db", title: "SQL & Databases", desc: "Joins, Indexing, ACID, Optimization", badge: "DATA VAULT" },
                { id: "html_css", title: "HTML / Modern CSS", desc: "Flexbox, Grid, Animations, Responsive", badge: "FOUNDRY" },
                { id: "backend_arch", title: "Backend Architecture", desc: "REST, GraphQL, WebSockets, Caching", badge: "SYSTEMS" },
                { id: "problem_solving", title: "Problem Solving & Clean Code", desc: "Refactoring, Debugging, Edge Cases", badge: "SYNTHESIS" }
            ]
        },
        {
            num: 5,
            key: "dailyCommitment",
            title: "Phase 5: Daily Practice Commitment",
            subtitle: "How much neural compute time will you dedicate each rotation?",
            lore: "Consistency maintains resonance. Choose a sustainable pace for daily streaks.",
            type: "single",
            options: [
                { id: "15_mins", title: "15 Minutes", desc: "Micro-sprints — 1 focused problem or refresh per day.", badge: "⚡ MICRO SPRINT", glow: "cyan" },
                { id: "30_mins", title: "30 Minutes", desc: "Steady progress — 2 targeted drills with instant code evaluations.", badge: "🎯 STEADY PACE", glow: "cyan" },
                { id: "1_hour", title: "1 Hour", desc: "Standard interview preparation — 1 DSA medium + 1 domain drill.", badge: "⚔️ STANDARD BATTLE", glow: "purple" },
                { id: "2_hours", title: "2 Hours", desc: "Deep-dive problem solving — Comprehensive coverage of theory and code.", badge: "🔥 DEEP FOCUS", glow: "purple" },
                { id: "3_plus_hours", title: "3+ Hours", desc: "Hardcore grinding — Rapid conquest of high-tier sectors and ladders.", badge: "👑 OVERCLOCK GRIND", glow: "gold" }
            ]
        },
        {
            num: 6,
            key: "difficultyPreference",
            title: "Phase 6: Challenge Engine & Difficulty",
            subtitle: "Configure how the Singularity Core modulates problem complexity.",
            lore: "The Adaptive Engine dynamically adjusts difficulty based on your live performance.",
            type: "single",
            options: [
                { id: "adaptive", title: "Adaptive Engine", desc: "Auto-tunes difficulty dynamically based on accuracy and speed.", badge: "★ RECOMMENDED", glow: "cyan" },
                { id: "easy", title: "Easy Guided Pace", desc: "Contextual hints, step-by-step breakdowns, relaxed time bounds.", badge: "GUIDED CRUISE", glow: "cyan" },
                { id: "medium", title: "Medium Standard", desc: "Standard tech company interview difficulty with standard constraints.", badge: "BALANCED DEFENSE", glow: "purple" },
                { id: "hard", title: "Hardcore Mode", desc: "Strict execution bounds, complex edge cases & high penalty modifiers.", badge: "NIGHTMARE GAUNTLET", glow: "gold" }
            ]
        },
        {
            num: 7,
            key: "learningStyle",
            title: "Phase 7: Cognitive Learning Style",
            subtitle: "How do you prefer narrative and technical material presented?",
            lore: "Finalizing neural pathway mapping. Choose your preferred learning balance.",
            type: "single",
            options: [
                { id: "story", title: "Story-driven Lore", desc: "Immersive cosmic narrative briefings, quest chronicles & worldbuilding.", badge: "COSMIC SAGA", glow: "purple" },
                { id: "practice", title: "Practice-heavy Drills", desc: "Direct code execution, minimal dialogue & instant test runners.", badge: "PURE CODE", glow: "cyan" },
                { id: "balanced", title: "Balanced Symphony", desc: "Harmonious mix of rich sci-fi lore context with rigorous programming challenges.", badge: "HARMONIC PRIME", glow: "gold" },
                { id: "challenge", title: "Challenge-heavy PvP", desc: "Timed competitive drills, boss battles, and leaderboard climbs.", badge: "GLADIATOR PROTOCOL", glow: "gold" }
            ]
        }
    ];

    let currentPhaseIdx = 0;
    let selectedPrefs = {
        primaryGoal: 'interview_prep',
        targetRole: 'fullstack',
        skillLevel: 'intermediate',
        practiceTopics: ['dsa', 'javascript_ts', 'backend_arch', 'problem_solving'],
        dailyCommitment: '1_hour',
        difficultyPreference: 'adaptive',
        learningStyle: 'balanced'
    };
    let authMode = 'register'; // Default to register for new recruits
    let activeUser = null;

    // 4. Inject Modal HTML Overlay
    function injectOverlay() {
        if (document.getElementById('cb-unified-overlay')) return;

        // Overlay Backdrop
        const overlay = document.createElement('div');
        overlay.id = 'cb-unified-overlay';
        overlay.className = 'cb-overlay-backdrop';
        overlay.innerHTML = `
            <!-- AUTH MODAL -->
            <div class="cb-modal-box cb-auth-box" id="cbAuthModal" style="display: none;">
                <div class="cb-corner-b cb-cb-tl"></div>
                <div class="cb-corner-b cb-cb-tr"></div>
                <div class="cb-corner-b cb-cb-bl"></div>
                <div class="cb-corner-b cb-cb-br"></div>

                <div class="cb-m-head">
                    <div class="cb-m-brand">
                        <div class="cb-m-crest">✦</div>
                        <div>
                            <span class="cb-m-sub">COREBOUND SECURITY MAINFRAME</span>
                            <h2 class="cb-m-title" id="cbAuthHeading">INITIALIZE SENTINEL</h2>
                        </div>
                    </div>
                    <button type="button" class="cb-m-close" id="cbCloseAuth">✕</button>
                </div>

                <div class="cb-tabs-row">
                    <button type="button" class="cb-tab-btn active" id="tabRegister">REGISTER (INITIALIZE SENTINEL)</button>
                    <button type="button" class="cb-tab-btn" id="tabLogin">LOGIN (ACCESS LINK)</button>
                </div>

                <div style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
                    <button type="button" id="btnQuickDemoFill" style="background: rgba(0,229,255,0.1); border: 1px dashed rgba(0,229,255,0.4); color: #00e5ff; border-radius: 6px; padding: 4px 10px; font-family: 'Rajdhani', sans-serif; font-size: 11px; font-weight: 700; cursor: pointer;">
                        ✨ AUTOFILL DEMO CREDENTIALS
                    </button>
                </div>

                <div id="authAlertBox" style="display: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; margin-bottom: 12px; background: rgba(239,68,68,0.2); border: 1px solid #ef4444; color: #fca5a5;"></div>

                <form id="cbAuthFormActual">
                    <div class="cb-f-group" id="groupUsername">
                        <label class="cb-f-label">
                            <span>SENTINEL CODEX ID / USERNAME</span>
                            <span style="color: #00e5ff; font-size: 10px;">UNIQUE ID</span>
                        </label>
                        <div class="cb-f-input-wrap">
                            <input type="text" class="cb-f-input" id="inpUsername" placeholder="e.g. NexusHunter, Valkyrie99" required value="GuardianRecruit">
                        </div>
                    </div>

                    <div class="cb-f-group">
                        <label class="cb-f-label">
                            <span id="lblEmail">QUANTUM TRANSMISSION EMAIL</span>
                            <span style="color: #00e5ff; font-size: 10px;">COMMS LINK</span>
                        </label>
                        <div class="cb-f-input-wrap">
                            <input type="email" class="cb-f-input" id="inpEmail" placeholder="guardian@corebound.io" required value="guardian@corebound.io">
                        </div>
                    </div>

                    <div class="cb-f-group">
                        <label class="cb-f-label">
                            <span>SECRET ACCESS KEY (PASSWORD)</span>
                        </label>
                        <div class="cb-f-input-wrap">
                            <input type="password" class="cb-f-input" id="inpPassword" placeholder="••••••••••••" required value="CyberSentinel#2026">
                            <button type="button" id="btnTogglePass" style="background: none; border: none; color: #cbd5e1; padding: 0 12px; cursor: pointer; height: 42px;">👁</button>
                        </div>
                    </div>

                    <div class="cb-f-group" id="groupConfirmPass">
                        <label class="cb-f-label">
                            <span>CONFIRM SECRET ACCESS KEY</span>
                        </label>
                        <div class="cb-f-input-wrap">
                            <input type="password" class="cb-f-input" id="inpConfirmPassword" placeholder="••••••••••••" value="CyberSentinel#2026">
                        </div>
                    </div>

                    <div style="margin: 6px 0 12px 0; display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="chkRemember" checked style="accent-color: #00e5ff; width: 16px; height: 16px; cursor: pointer;">
                        <label for="chkRemember" style="font-size: 12px; color: #cbd5e1; cursor: pointer;">Remember Neural Link (Persist Guardian Codex Session)</label>
                    </div>

                    <button type="submit" class="cb-f-submit" id="btnSubmitAuth">
                        INITIALIZE SENTINEL & CALIBRATE ➔
                    </button>
                </form>

                <div class="cb-sso-grid">
                    <button type="button" class="cb-sso-item" id="btnSSOGoogle">
                        <span>🌐 Google Quantum</span>
                    </button>
                    <button type="button" class="cb-sso-item" id="btnSSOGithub">
                        <span>🐙 GitHub Codex</span>
                    </button>
                    <button type="button" class="cb-sso-item" id="btnSSODiscord">
                        <span>💬 Discord Relay</span>
                    </button>
                </div>
            </div>

            <!-- 7-PHASE CALIBRATION WIZARD -->
            <div class="cb-modal-box cb-calib-box" id="cbCalibModal" style="display: none;">
                <div class="cb-corner-b cb-cb-tl"></div>
                <div class="cb-corner-b cb-cb-tr"></div>
                <div class="cb-corner-b cb-cb-bl"></div>
                <div class="cb-corner-b cb-cb-br"></div>

                <div class="cb-m-head">
                    <div class="cb-m-brand">
                        <div class="cb-m-crest">⚙</div>
                        <div>
                            <span class="cb-m-sub">NEURAL LINK CALIBRATION PROTOCOL</span>
                            <h2 class="cb-m-title">GUARDIAN CALIBRATION & PREFERENCES</h2>
                        </div>
                    </div>
                    <button type="button" class="cb-m-close" id="cbCloseCalib">✕</button>
                </div>

                <div class="cb-stepper-line" id="calibStepperLine"></div>

                <div class="cb-laser-bar-track">
                    <div class="cb-laser-bar-fill" id="calibLaserFill" style="width: 14%;"></div>
                </div>

                <div id="calibPhaseContentPane" style="flex: 1; overflow-y: auto; padding-right: 4px;"></div>

                <div class="cb-wiz-foot">
                    <button type="button" class="cb-foot-btn cb-btn-back" id="btnWizPrev" style="visibility: hidden;">PREV PHASE</button>
                    <button type="button" class="cb-foot-btn cb-btn-forward" id="btnWizNext">NEXT PHASE ➔</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        bindEvents();
    }

    // 5. Open / Close Controls
    function openAuthModal(defaultMode = 'register') {
        injectOverlay();
        playTone(620, 'triangle', 0.15);
        authMode = defaultMode;
        updateAuthModeUI();

        const overlay = document.getElementById('cb-unified-overlay');
        const authBox = document.getElementById('cbAuthModal');
        const calibBox = document.getElementById('cbCalibModal');

        overlay.classList.add('active');
        authBox.style.display = 'flex';
        calibBox.style.display = 'none';
    }

    function openCalibrationWizard() {
        injectOverlay();
        playTone(700, 'triangle', 0.18);
        currentPhaseIdx = 0;

        const overlay = document.getElementById('cb-unified-overlay');
        const authBox = document.getElementById('cbAuthModal');
        const calibBox = document.getElementById('cbCalibModal');

        overlay.classList.add('active');
        authBox.style.display = 'none';
        calibBox.style.display = 'flex';

        renderPhase();
    }

    function closeAllModals() {
        playTone(320, 'sine', 0.1);
        const overlay = document.getElementById('cb-unified-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.getElementById('cbAuthModal').style.display = 'none';
            document.getElementById('cbCalibModal').style.display = 'none';
        }
    }

    function updateAuthModeUI() {
        const tabReg = document.getElementById('tabRegister');
        const tabLog = document.getElementById('tabLogin');
        const grpUser = document.getElementById('groupUsername');
        const grpConf = document.getElementById('groupConfirmPass');
        const btnSub = document.getElementById('btnSubmitAuth');
        const heading = document.getElementById('cbAuthHeading');
        const lblEmail = document.getElementById('lblEmail');

        if (authMode === 'register') {
            tabReg.classList.add('active');
            tabLog.classList.remove('active');
            grpUser.style.display = 'flex';
            grpConf.style.display = 'flex';
            btnSub.innerText = 'INITIALIZE SENTINEL & CALIBRATE ➔';
            heading.innerText = 'INITIALIZE SENTINEL';
            lblEmail.innerText = 'QUANTUM TRANSMISSION EMAIL';
        } else {
            tabLog.classList.add('active');
            tabReg.classList.remove('active');
            grpUser.style.display = 'none';
            grpConf.style.display = 'none';
            btnSub.innerText = 'ESTABLISH ACCESS LINK & ENTER ➔';
            heading.innerText = 'SENTINEL ACCESS LINK';
            lblEmail.innerText = 'EMAIL OR SENTINEL CODEX ID';
        }
    }

    function renderPhase() {
        const isSynthesis = currentPhaseIdx === PHASES.length;
        const stepper = document.getElementById('calibStepperLine');
        const laser = document.getElementById('calibLaserFill');
        const pane = document.getElementById('calibPhaseContentPane');
        const btnPrev = document.getElementById('btnWizPrev');
        const btnNext = document.getElementById('btnWizNext');

        // Stepper
        stepper.innerHTML = PHASES.map((p, idx) => `
            <div class="cb-step-pill ${idx === currentPhaseIdx ? 'active' : ''} ${idx < currentPhaseIdx ? 'done' : ''}" data-idx="${idx}">
                P0${p.num}
            </div>
        `).join('') + `
            <div class="cb-step-pill ${isSynthesis ? 'active' : ''}" data-idx="${PHASES.length}">
                MATRIX
            </div>
        `;

        stepper.querySelectorAll('.cb-step-pill').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.getAttribute('data-idx'));
                if (idx <= currentPhaseIdx || isSynthesis) {
                    playTone(500, 'sine', 0.08);
                    currentPhaseIdx = idx;
                    renderPhase();
                }
            });
        });

        const progressPercent = isSynthesis ? 100 : Math.round(((currentPhaseIdx + 1) / (PHASES.length + 1)) * 100);
        laser.style.width = `${progressPercent}%`;

        if (!isSynthesis) {
            const p = PHASES[currentPhaseIdx];
            pane.innerHTML = `
                <div style="margin-bottom: 14px;">
                    <span class="cb-c-badge">PHASE 0${p.num} OF 07 • ${p.type === 'single' ? 'SINGLE SELECT' : 'MULTI SELECT'}</span>
                    <h3 style="font-family: 'Cinzel', serif; font-size: 19px; color: #fff; margin: 4px 0;">${p.title}</h3>
                    <p style="font-size: 12.5px; color: #cbd5e1; margin: 0 0 6px 0;">${p.subtitle}</p>
                    <div style="padding: 6px 10px; background: rgba(139,92,246,0.1); border-left: 2px solid #8b5cf6; font-size: 11.5px; color: #c4b5fd;">
                        ⚡ <em>${p.lore}</em>
                    </div>
                </div>

                <div class="cb-cards-grid ${p.cols === 3 ? 'cols-3' : ''}">
                    ${p.options.map(opt => {
                        let isSelected = false;
                        if (p.type === 'single') {
                            isSelected = selectedPrefs[p.key] === opt.id;
                        } else {
                            isSelected = (selectedPrefs[p.key] || []).includes(opt.id);
                        }

                        return `
                            <div class="cb-card-choice ${isSelected ? 'selected' : ''}" data-optid="${opt.id}">
                                ${opt.badge ? `<span class="cb-c-badge">${opt.badge}</span>` : ''}
                                <h4 class="cb-c-title">${opt.title}</h4>
                                <p class="cb-c-desc">${opt.desc}</p>
                                ${opt.tier ? `
                                    <div style="font-size: 10.5px; color: #f5b942; font-weight: 700; margin-top: 4px;">
                                        TIER ${opt.tier} BUFF ACTIVE
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            pane.querySelectorAll('.cb-card-choice').forEach(card => {
                card.addEventListener('click', () => {
                    playTone(560, 'triangle', 0.12);
                    const optId = card.getAttribute('data-optid');
                    if (p.type === 'single') {
                        selectedPrefs[p.key] = optId;
                    } else {
                        const list = selectedPrefs[p.key] || [];
                        if (list.includes(optId)) {
                            selectedPrefs[p.key] = list.filter(x => x !== optId);
                        } else {
                            selectedPrefs[p.key] = [...list, optId];
                        }
                    }
                    renderPhase();
                });
            });

            btnPrev.style.visibility = currentPhaseIdx > 0 ? 'visible' : 'hidden';
            btnNext.innerText = currentPhaseIdx === PHASES.length - 1 ? 'SYNTHESIZE MATRIX ➔' : 'NEXT PHASE ➔';
        } else {
            // Phase 8 Synthesis Dossier
            playChime();
            const user = getStoredUser() || activeUser || { codexId: 'SENTINEL-VALKYRIE-07', rankTitle: 'SENTINEL PRIME' };
            pane.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 36px; color: #00e5ff; filter: drop-shadow(0 0 15px #00e5ff);">✦</div>
                    <h3 style="font-family: 'Cinzel', serif; font-size: 22px; color: #fff; margin: 4px 0;">CALIBRATION SYNTHESIS COMPLETE</h3>
                    <p style="font-size: 13px; color: #cbd5e1;">Your combat curriculum and neural link resonance are synchronized.</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                    <div style="background: rgba(6,4,18,0.85); border: 1px solid rgba(139,92,246,0.35); border-radius: 10px; padding: 14px;">
                        <span style="font-size: 11px; color: #00e5ff; font-family: 'Rajdhani', sans-serif; font-weight: 700;">GUARDIAN CODEX PROFILE</span>
                        <h4 style="font-family: 'Cinzel', serif; font-size: 18px; color: #fff; margin: 4px 0;">${user.codexId || 'SENTINEL-PRIME-07'}</h4>
                        <div style="color: #f5b942; font-size: 12px; font-weight: 700; margin-bottom: 8px;">⚔️ ${user.rankTitle || 'SENTINEL PRIME'}</div>
                        
                        <div style="display: flex; flex-direction: column; gap: 4px; font-size: 11.5px; color: #cbd5e1;">
                            <div><strong>Directive:</strong> ${selectedPrefs.primaryGoal.replace(/_/g, ' ').toUpperCase()}</div>
                            <div><strong>Target Role:</strong> ${selectedPrefs.targetRole.replace(/_/g, ' ').toUpperCase()}</div>
                            <div><strong>Skill Tier:</strong> ${selectedPrefs.skillLevel.toUpperCase()}</div>
                            <div><strong>Commitment:</strong> ${selectedPrefs.dailyCommitment.replace(/_/g, ' ').toUpperCase()}</div>
                            <div><strong>Engine:</strong> ${selectedPrefs.difficultyPreference.toUpperCase()}</div>
                        </div>
                    </div>

                    <div style="background: rgba(6,4,18,0.85); border: 1px solid rgba(139,92,246,0.35); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <span style="font-size: 11px; color: #00e5ff; font-family: 'Rajdhani', sans-serif; font-weight: 700;">ACTIVE TOPICS (${(selectedPrefs.practiceTopics || []).length})</span>
                            <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px;">
                                ${(selectedPrefs.practiceTopics || []).map(t => `<span style="background: rgba(139,92,246,0.2); border: 1px solid rgba(139,92,246,0.4); color: #00e5ff; padding: 2px 7px; border-radius: 4px; font-size: 10.5px;">${t.replace(/_/g, ' ')}</span>`).join('')}
                            </div>
                        </div>

                        <div style="margin-top: 12px; padding: 8px 10px; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); border-radius: 6px; color: #6ee7b7; font-size: 11.5px;">
                            ✓ Ready to enter Aetheria World Map with tuned sector parameters.
                        </div>
                    </div>
                </div>
            `;

            btnPrev.style.visibility = 'visible';
            btnNext.innerText = '⚡ ENGAGE & ENTER AETHERIA ➔';
        }
    }

    function bindEvents() {
        document.getElementById('cbCloseAuth')?.addEventListener('click', closeAllModals);
        document.getElementById('cbCloseCalib')?.addEventListener('click', closeAllModals);

        // Tabs
        document.getElementById('tabRegister')?.addEventListener('click', () => {
            authMode = 'register';
            playTone(520, 'sine', 0.08);
            updateAuthModeUI();
        });

        document.getElementById('tabLogin')?.addEventListener('click', () => {
            authMode = 'login';
            playTone(520, 'sine', 0.08);
            updateAuthModeUI();
        });

        // Demo Autofill
        document.getElementById('btnQuickDemoFill')?.addEventListener('click', () => {
            playTone(650, 'triangle', 0.1);
            document.getElementById('inpUsername').value = 'AegisRunner';
            document.getElementById('inpEmail').value = 'aegis.runner@corebound.io';
            document.getElementById('inpPassword').value = 'CyberMatrix#2026';
            document.getElementById('inpConfirmPassword').value = 'CyberMatrix#2026';
        });

        // Toggle Password Eye
        document.getElementById('btnTogglePass')?.addEventListener('click', () => {
            playTone(450, 'sine', 0.05);
            const p = document.getElementById('inpPassword');
            p.type = p.type === 'password' ? 'text' : 'password';
        });

        // Auth Form Submit
        document.getElementById('cbAuthFormActual')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('inpEmail').value.trim();
            const pass = document.getElementById('inpPassword').value;
            const user = document.getElementById('inpUsername').value.trim();
            const conf = document.getElementById('inpConfirmPassword').value;
            const alertBox = document.getElementById('authAlertBox');
            const submitBtn = document.getElementById('btnAuthSubmit');

            alertBox.style.display = 'none';

            if (authMode === 'register') {
                if (!user) {
                    playError();
                    alertBox.innerText = 'Sentinel Codex ID / Username is required.';
                    alertBox.style.display = 'block';
                    return;
                }
                if (!pass || pass.length < 6) {
                    playError();
                    alertBox.innerText = 'Access key must be at least 6 characters.';
                    alertBox.style.display = 'block';
                    return;
                }
                if (pass !== conf) {
                    playError();
                    alertBox.innerText = 'Password confirmation does not match.';
                    alertBox.style.display = 'block';
                    return;
                }

                const origBtnText = submitBtn ? submitBtn.innerText : '';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerText = 'TRANSMITTING CREDENTIALS...';
                }

                try {
                    let backendUser = null;
                    if (window.cbApi && typeof window.cbApi.register === 'function') {
                        const res = await window.cbApi.register(email, pass, user);
                        backendUser = res.user || res;
                    }

                    // Store authoritative user profile state
                    const uid = backendUser && backendUser.id ? backendUser.id : 'usr_' + Date.now();
                    const newUser = {
                        id: uid,
                        codexId: user.toUpperCase() + '-' + String(uid).padStart(3, '0'),
                        email: email,
                        rankTitle: 'SENTINEL INITIATE',
                        isCalibrated: false,
                        hasWatchedStory: false
                    };
                    activeUser = newUser;
                    setStoredUser(newUser);

                    playChime();
                    closeAllModals();

                    // If user registered from intro screen before watching the compulsory story:
                    const hasStoryFinished = window._COREBOUND_STORY_FINISHED === true;
                    const isIntroScreen = document.getElementById('intro-screen') && !document.getElementById('intro-screen').classList.contains('intro-hidden');

                    if (isIntroScreen && !hasStoryFinished && window.startOpeningStory) {
                        setTimeout(() => {
                            window.startOpeningStory();
                        }, 250);
                    } else {
                        openCalibrationWizard();
                    }
                } catch (err) {
                    playError();
                    alertBox.innerText = err.message || 'Registration failed. Please check your details and try again.';
                    alertBox.style.display = 'block';
                } finally {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerText = origBtnText;
                    }
                }
            } else {
                // Login
                if (!email || !pass) {
                    playError();
                    alertBox.innerText = 'Email and access key are required.';
                    alertBox.style.display = 'block';
                    return;
                }

                const origBtnText = submitBtn ? submitBtn.innerText : '';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerText = 'AUTHENTICATING CODEX...';
                }

                try {
                    let backendUser = null;
                    let profile = null;
                    if (window.cbApi && typeof window.cbApi.login === 'function') {
                        const res = await window.cbApi.login(email, pass);
                        backendUser = res.user;
                        try {
                            profile = await window.cbApi.getProfile();
                        } catch (pe) {
                            console.warn('Could not fetch profile on login:', pe);
                        }
                    }

                    const prefs = getStoredPrefs();
                    const isCalibratedOnBackend = !!(profile && (profile.goal || profile.preferences_updated_at || profile.skill_level));
                    const uid = backendUser && backendUser.id ? backendUser.id : (getStoredUser()?.id || 'usr_login_' + Date.now());
                    const loggedUser = {
                        id: uid,
                        codexId: (email.split('@')[0] || 'GUARDIAN').toUpperCase() + '-' + String(uid).padStart(3, '0'),
                        email: email,
                        rankTitle: (profile && profile.level > 1) ? `SENTINEL TIER ${profile.level}` : 'SENTINEL PRIME',
                        isCalibrated: isCalibratedOnBackend || !!prefs,
                        hasWatchedStory: true
                    };
                    activeUser = loggedUser;
                    setStoredUser(loggedUser);

                    if (profile) {
                        setStoredPrefs({
                            primaryGoal: profile.goal || prefs?.primaryGoal,
                            targetRole: profile.target_role || prefs?.targetRole,
                            skillLevel: profile.skill_level || prefs?.skillLevel,
                            practiceTopics: profile.subjects || prefs?.practiceTopics || [],
                            dailyCommitment: profile.daily_time || prefs?.dailyCommitment,
                            difficultyPreference: profile.difficulty_preference || prefs?.difficultyPreference,
                            learningStyle: profile.learning_preference || prefs?.learningStyle
                        });
                    }

                    playChime();

                    if (loggedUser.isCalibrated) {
                        // Already calibrated -> Enter world map immediately!
                        closeAllModals();
                        setTimeout(() => {
                            window.location.href = 'level.html';
                        }, 400);
                    } else {
                        // Not calibrated -> Route to 7-Phase wizard
                        openCalibrationWizard();
                    }
                } catch (err) {
                    playError();
                    alertBox.innerText = err.message || 'Invalid credentials or server unavailable.';
                    alertBox.style.display = 'block';
                } finally {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerText = origBtnText;
                    }
                }
            }
        });

        // SSO Buttons
        ['btnSSOGoogle', 'btnSSOGithub', 'btnSSODiscord'].forEach(id => {
            document.getElementById(id)?.addEventListener('click', () => {
                playError();
                const alertBox = document.getElementById('authAlertBox');
                if (alertBox) {
                    alertBox.innerText = 'Third-party OAuth is pending Sentinel Gateway deployment. Please use email access key.';
                    alertBox.style.display = 'block';
                }
            });
        });

        // Wizard Next / Prev Buttons
        document.getElementById('btnWizPrev')?.addEventListener('click', () => {
            if (currentPhaseIdx > 0) {
                playTone(400, 'sine', 0.1);
                currentPhaseIdx--;
                renderPhase();
            }
        });

        document.getElementById('btnWizNext')?.addEventListener('click', async () => {
            const btnNext = document.getElementById('btnWizNext');
            if (currentPhaseIdx < PHASES.length) {
                // Validate selection
                const p = PHASES[currentPhaseIdx];
                if (p && p.type === 'multi' && (!selectedPrefs[p.key] || selectedPrefs[p.key].length === 0)) {
                    selectedPrefs[p.key] = ['dsa', 'javascript_ts', 'problem_solving'];
                }

                playTone(650, 'sine', 0.1);
                currentPhaseIdx++;
                renderPhase();
            } else {
                // Completed Synthesis -> Save preferences to backend & enter level.html!
                const origBtnText = btnNext ? btnNext.innerText : '';
                if (btnNext) {
                    btnNext.disabled = true;
                    btnNext.innerText = 'SYNCHRONIZING WITH CORE...';
                }

                try {
                    let syncResult = null;
                    if (window.cbApi && typeof window.cbApi.updatePreferences === 'function') {
                        syncResult = await window.cbApi.updatePreferences(selectedPrefs);
                    }

                    playChime();
                    setStoredPrefs(selectedPrefs);

                    const u = getStoredUser() || activeUser || {};
                    u.isCalibrated = true;
                    u.hasWatchedStory = true;
                    u.calibrationData = selectedPrefs;
                    setStoredUser(u);

                    closeAllModals();
                    setTimeout(() => {
                        window.location.href = 'level.html';
                    }, 400);
                } catch (err) {
                    playError();
                    if (btnNext) {
                        btnNext.disabled = false;
                        btnNext.innerText = origBtnText;
                    }
                    const pane = document.getElementById('calibPhaseContentPane');
                    if (pane) {
                        let errBox = document.getElementById('calibSyncErrorBox');
                        if (!errBox) {
                            errBox = document.createElement('div');
                            errBox.id = 'calibSyncErrorBox';
                            errBox.style.cssText = 'margin-top: 14px; padding: 10px 12px; background: rgba(239,68,68,0.2); border: 1px solid #ef4444; border-radius: 6px; color: #fca5a5; font-size: 12px;';
                            pane.appendChild(errBox);
                        }
                        errBox.innerText = `Synchronization failed: ${err.message || 'Unable to update preferences on backend.'}`;
                        errBox.style.display = 'block';
                    }
                }
            }
        });
    }

    // 6. Hook called when Story Completes or Skip Story is clicked in story.html
    function handleStoryComplete() {
        const storedUser = getStoredUser();
        const storedPrefs = getStoredPrefs();

        if (storedUser && storedUser.isCalibrated && storedPrefs) {
            // User is already registered AND calibrated -> enter world map directly
            window.location.href = 'level.html';
        } else if (storedUser && !storedUser.isCalibrated) {
            // User is registered but not calibrated -> open 7-phase wizard
            openCalibrationWizard();
        } else {
            // User is not registered -> Open Sentinel Access (Register / Login) Modal!
            openAuthModal('register');
        }
    }

    // Expose Global API
    window.COREBOUND_AUTH = {
        openAuth: openAuthModal,
        openCalib: openCalibrationWizard,
        close: closeAllModals,
        handleStoryComplete: handleStoryComplete,
        getStoredUser: getStoredUser,
        getStoredPrefs: getStoredPrefs
    };
})();
