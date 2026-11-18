/**
 * COREBOUND — Chapter 1: Sub-Missions Hub Controller (100vh Non-Scrollable Stage)
 * Flow: Level Screen START -> Chapter 1 Main Story Cutscene Transmission -> Sub-Missions Hub.
 * Features: Strict sequential unlock, 3D Cyber Carousel Stage, top stepper rail, full-body voice acting cutscene.
 */

(function () {
    'use strict';

    // 1. CHAPTER 1 MAIN TRANSMISSION PROLOGUE SCRIPT
    const CHAPTER1_PROLOGUE_SCRIPT = [
        {
            guardianId: "nova",
            speaker: "NOVA",
            symbol: "🧭",
            audioSrc: "assets/audio/cutscenes/ch1_cutscene_01_nova.mp3",
            text: "खिलाड़ी... देखो। यही है माउंट ल्यूमिना के शिखर पर स्थित पैटर्न ऑब्ज़र्वेटरी। कभी यहीं से प्राचीन सभ्यता ने ब्रह्मांड के रहस्यमय पैटर्न को समझने की कोशिश की थी। और इसी जगह पर... द कोर का पहला और सबसे शक्तिशाली प्रेडिक्शन इंजन बनाया गया था।"
        },
        {
            guardianId: "byte",
            speaker: "BYTE",
            symbol: "🤖",
            audioSrc: "assets/audio/cutscenes/ch1_cutscene_02_byte.mp3",
            text: "डायग्नोस्टिक अलर्ट। ऑब्ज़र्वेटरी के मुख्य सिस्टम निष्क्रिय हैं। पाँच बड़े सिस्टम... पूरी तरह ऑफलाइन।"
        },
        {
            guardianId: "echo",
            speaker: "ECHO",
            symbol: "📡",
            audioSrc: "assets/audio/cutscenes/ch1_cutscene_03_echo.mp3",
            text: "मुझे इसकी ऊर्जा महसूस हो रही है... ये जगह अभी भी जीवित है। लेकिन इसकी रेज़ोनेंस... बिखर चुकी है।"
        },
        {
            guardianId: "blaze",
            speaker: "BLAZE",
            symbol: "⚔️",
            audioSrc: "assets/audio/cutscenes/ch1_cutscene_04_blaze.mp3",
            text: "तो फिर इसे वापस जगाना होगा। जो भी इसके अंदर छिपा है... हम उसका सामना करेंगे।"
        },
        {
            guardianId: "nova",
            speaker: "NOVA",
            symbol: "🧭",
            audioSrc: "assets/audio/cutscenes/ch1_cutscene_05_nova.mp3",
            text: "चलो। पहले पता लगाते हैं कि यहाँ हुआ क्या है।"
        }
    ];

    const CHARACTER_CONFIG = {
        nova: { name: "NOVA", badgeClass: "speaker-nova", side: "left", img: "assets/images/characters/nova.png" },
        byte: { name: "BYTE", badgeClass: "speaker-byte", side: "right", img: "assets/images/characters/byte.png" },
        echo: { name: "ECHO", badgeClass: "speaker-echo", side: "left", img: "assets/images/characters/echo.png" },
        blaze: { name: "BLAZE", badgeClass: "speaker-blaze", side: "right", img: "assets/images/characters/blaze.png" }
    };

    // 2. 10 TACTICAL SUB-MISSIONS FOR CHAPTER 1
    const SUB_MISSIONS_DATA = [
        {
            id: 1,
            title: "AWAKEN THE PATTERN LENS",
            chamber: "SYSTEM: PATTERN LENS",
            chamberKey: "pattern",
            format: "NUMBER SERIES & PATTERNS",
            directive: "The Pattern Lens, one of the Observatory's ancient systems, has gone offline. Solve the hidden patterns within its crystalline mechanisms to awaken the first prediction layer.",
            guardian: "NOVA",
            guardianSymbol: "🧭",
            guardianRole: "EXPEDITION LEADER",
            xpReward: 250,
            bgImage: "assets/images/missions_bg/ch1_mission1_bg.png"
        },
        {
            id: 2,
            title: "ALIGN THE CRYSTAL RINGS",
            chamber: "SYSTEM: PATTERN LENS",
            chamberKey: "pattern",
            format: "RESONANCE FREQUENCIES",
            directive: "The Pattern Lens has awakened, but its optical crystal rings are misaligned. Align each concentric ring to a harmonious frequency to focus the starlight beam.",
            guardian: "ECHO",
            guardianSymbol: "📡",
            guardianRole: "RESONANCE GUARDIAN",
            xpReward: 250,
            bgImage: "assets/images/missions_bg/ch1_mission2_bg.png"
        },
        {
            id: 3,
            title: "RESTART THE ENERGY CHANNELS",
            chamber: "SYSTEM: ENERGY CORE",
            chamberKey: "energy",
            format: "ENERGY BALANCING",
            directive: "Severe fluctuations are detected across the conduit grid. Rebalance energy outputs across the three primary distribution channels before catastrophic overload.",
            guardian: "BLAZE",
            guardianSymbol: "⚔️",
            guardianRole: "COMBAT TACTICIAN",
            xpReward: 250,
            bgImage: "assets/images/missions_bg/ch1_mission3_bg.png"
        },
        {
            id: 4,
            title: "STABILIZE THE ENERGY CORE",
            chamber: "SYSTEM: ENERGY CORE",
            chamberKey: "energy",
            format: "STABILITY CRITICAL MATH",
            directive: "The central Energy Core is oscillating in critical disharmony. Calibrate core flux by solving the ratio equation to stabilize containment.",
            guardian: "BYTE",
            guardianSymbol: "🤖",
            guardianRole: "TECHNICAL ARCHITECT",
            xpReward: 250,
            bgImage: "assets/images/missions_bg/ch1_mission4_bg.png"
        },
        {
            id: 5,
            title: "RECONNECT THE CRYSTAL NETWORK",
            chamber: "SYSTEM: CRYSTAL NETWORK",
            chamberKey: "crystal",
            format: "TOPOLOGICAL PATHFINDING",
            directive: "The Observatory's neural crystal network has fragmented. Calculate the shortest topological path between active relays to restore global signal flow.",
            guardian: "NOVA",
            guardianSymbol: "🧭",
            guardianRole: "EXPEDITION LEADER",
            xpReward: 250,
            bgImage: "assets/images/missions_bg/ch1_mission5_bg.png"
        },
        {
            id: 6,
            title: "PURGE THE CORRUPTED NODES",
            chamber: "SYSTEM: CRYSTAL NETWORK",
            chamberKey: "crystal",
            format: "CORRUPTION PURGE",
            directive: "NULL energy has infiltrated multiple data nodes. Target and neutralize corrupted frequencies before they compromise the central memory matrix.",
            guardian: "BLAZE",
            guardianSymbol: "⚔️",
            guardianRole: "COMBAT TACTICIAN",
            xpReward: 250,
            bgImage: "assets/images/missions_bg/ch1_mission6_bg.png"
        },
        {
            id: 7,
            title: "ENTER THE ANALYSIS CORE",
            chamber: "SYSTEM: ANALYSIS CORE",
            chamberKey: "analysis",
            format: "RATIO & PROPORTIONS",
            directive: "With the network restored, access the Analysis Core archive. Balance proportion streams to unlock historical data logs.",
            guardian: "BYTE",
            guardianSymbol: "🤖",
            guardianRole: "TECHNICAL ANALYZER",
            xpReward: 250,
            bgImage: "assets/images/missions_bg/ch1_mission7_bg.png"
        },
        {
            id: 8,
            title: "DECODE THE LOST MEMORIES",
            chamber: "SYSTEM: ANALYSIS CORE",
            chamberKey: "analysis",
            format: "DATA DECRYPTION",
            directive: "Distorted fragments of ancient memories have been recovered. Compute the security override sequence to reconstruct what happened on Mount Lumina.",
            guardian: "ECHO",
            guardianSymbol: "📡",
            guardianRole: "RESONANCE GUARDIAN",
            xpReward: 250,
            bgImage: "assets/images/missions_bg/ch1_mission8_bg.png"
        },
        {
            id: 9,
            title: "SYNCHRONIZE PREDICTION ENGINE",
            chamber: "SYSTEM: PREDICTION ENGINE",
            chamberKey: "engine",
            format: "SYSTEM SYNCHRONIZATION",
            directive: "All supporting subsystems are active. Synchronize the grand Prediction Engine to initiate full temporal calculations.",
            guardian: "NOVA",
            guardianSymbol: "🧭",
            guardianRole: "EXPEDITION LEADER",
            xpReward: 250,
            bgImage: "assets/images/missions_bg/ch1_mission9_bg.png"
        },
        {
            id: 10,
            title: "GUARDIAN ATLAS // THE CORRUPTED SENTINEL",
            chamber: "SYSTEM: PREDICTION ENGINE // BOSS",
            chamberKey: "engine",
            format: "BOSS ENCOUNTER COMBAT",
            directive: "Guardian Atlas has awakened under NULL corruption! Defeat the corrupted sentinel using multi-phase tactical calculations to reclaim the Observatory.",
            guardian: "BLAZE",
            guardianSymbol: "⚔️",
            guardianRole: "BOSS STRIKE COMMANDER",
            xpReward: 500,
            bgImage: "assets/images/missions_bg/ch1_mission10_bg.png",
            isBoss: true
        }
    ];

    let currentCardIndex = 0;

    // Cutscene state
    let isCutsceneActive = false;
    let cutsceneIndex = 0;
    let typewriterTimer = null;
    let isTyping = false;
    let currentSlideText = "";
    const cutsceneVoicePlayer = new Audio();
    let currentSpeakerId = null;
    let currentSide = null;
    let switchTimeout = null;

    // DOM Elements
    const dom = {
        bgAudio: document.getElementById('bgAudio'),
        sfxClick: document.getElementById('sfxClick'),
        btnSoundToggle: document.getElementById('btnSoundToggle'),
        progressVal: document.getElementById('progressVal'),
        progressMiniFill: document.getElementById('progressMiniFill'),
        xpDisplay: document.getElementById('xpDisplay'),
        creditsDisplay: document.getElementById('creditsDisplay'),
        hudPlayerName: document.getElementById('hudPlayerName'),
        hudPlayerLevel: document.getElementById('hudPlayerLevel'),
        missionStepperRail: document.getElementById('missionStepperRail'),
        cardsTrack: document.getElementById('cardsTrack'),
        btnCarouselPrev: document.getElementById('btnCarouselPrev'),
        btnCarouselNext: document.getElementById('btnCarouselNext'),
        statusChamberText: document.getElementById('statusChamberText'),
        commsSpeakerTag: document.getElementById('commsSpeakerTag'),
        commsMessageText: document.getElementById('commsMessageText'),

        // Cutscene modal elements
        storyCutsceneModal: document.getElementById('storyCutsceneModal'),
        cutsceneDialogueBox: document.getElementById('cutsceneDialogueBox'),
        cutsceneSpeakerBadge: document.getElementById('cutsceneSpeakerBadge'),
        speechAudioWave: document.getElementById('speechAudioWave'),
        cutsceneText: document.getElementById('cutsceneText'),
        cutsceneDots: document.getElementById('cutsceneDots'),
        btnPrevCutscene: document.getElementById('btnPrevCutscene'),
        btnNextCutscene: document.getElementById('btnNextCutscene'),
        btnSkipCutscene: document.getElementById('btnSkipCutscene'),
        autoProgressFill: document.getElementById('autoProgressFill'),
        cinematicCharLeft: document.getElementById('cinematicCharLeft'),
        cinematicCharRight: document.getElementById('cinematicCharRight'),
        charFullbodyLeft: document.getElementById('charFullbodyLeft'),
        charFullbodyRight: document.getElementById('charFullbodyRight')
    };

    let isMuted = false;

    function initAudio() {
        if (dom.bgAudio) {
            dom.bgAudio.volume = 0.45;
            const playPromise = dom.bgAudio.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    const unlock = () => {
                        dom.bgAudio.play();
                        document.removeEventListener('click', unlock);
                    };
                    document.addEventListener('click', unlock, { once: true });
                });
            }
        }

        if (dom.btnSoundToggle) {
            dom.btnSoundToggle.addEventListener('click', () => {
                isMuted = !isMuted;
                if (dom.bgAudio) dom.bgAudio.muted = isMuted;
                if (dom.sfxClick) dom.sfxClick.muted = isMuted;
                if (cutsceneVoicePlayer) cutsceneVoicePlayer.muted = isMuted;

                const soundOn = dom.btnSoundToggle.querySelector('.icon-sound-on');
                const soundOff = dom.btnSoundToggle.querySelector('.icon-sound-off');
                if (soundOn && soundOff) {
                    soundOn.style.display = isMuted ? 'none' : 'block';
                    soundOff.style.display = isMuted ? 'block' : 'none';
                }
            });
        }
    }

    function playClick() {
        if (dom.sfxClick && !isMuted) {
            dom.sfxClick.currentTime = 0;
            dom.sfxClick.play().catch(() => {});
        }
    }

    // Progression Management (Strict Sequential Unlock with Backend Authority)
    let activeProgress = null;

    function getStoredProgress() {
        try {
            const rawProgress = localStorage.getItem('cb_ch1_progress');
            if (rawProgress) {
                const parsed = JSON.parse(rawProgress);
                if (parsed && Array.isArray(parsed.completedMissions)) {
                    return parsed;
                }
            }
        } catch (e) {}
        return { completedMissions: [], highestUnlocked: 1, totalXp: 0 };
    }

    function isMissionUnlocked(missionId, progress) {
        if (!progress) progress = activeProgress || getStoredProgress();

        // 1. Authoritative Backend status
        if (progress.fromBackend && progress.statusMap) {
            const st = progress.statusMap[missionId];
            if (st) {
                return st === 'AVAILABLE' || st === 'IN_PROGRESS' || st === 'COMPLETED';
            }
            if (SUB_MISSIONS_DATA.length > 0 && missionId === SUB_MISSIONS_DATA[0].id) {
                return true;
            }
            return false;
        }

        // 2. Local fallback rule
        const idx = SUB_MISSIONS_DATA.findIndex(m => m.id === missionId);
        if (idx <= 0) return true;
        const prevId = SUB_MISSIONS_DATA[idx - 1].id;
        return progress.completedMissions.includes(prevId);
    }

    function updateProgressBadges(progress, profile) {
        const completedCount = (progress.completedMissions && progress.completedMissions.length) || 0;
        const totalMissions = SUB_MISSIONS_DATA.length || 10;
        const pct = Math.round((completedCount / totalMissions) * 100);

        if (dom.progressVal) {
            dom.progressVal.textContent = `${completedCount} / ${totalMissions} COMPLETED`;
        }
        if (dom.progressMiniFill) {
            dom.progressMiniFill.style.width = `${pct}%`;
        }

        // Real authoritative profile values
        const totalXp = (profile && typeof profile.xp === 'number') ? profile.xp : (progress.totalXp || (completedCount * 250));
        const totalCredits = (profile && typeof profile.credits === 'number') ? profile.credits : (completedCount * 50);
        const level = (profile && profile.level) ? profile.level : Math.max(1, Math.floor(totalXp / 500) + 1);
        const username = (profile && profile.username) ? profile.username.toUpperCase() : 'SENTINEL';

        if (dom.xpDisplay) {
            dom.xpDisplay.textContent = `${totalXp.toLocaleString()} XP`;
        }
        if (dom.creditsDisplay) {
            dom.creditsDisplay.textContent = `${totalCredits.toLocaleString()} CR`;
        }
        if (dom.hudPlayerName) {
            dom.hudPlayerName.textContent = username;
        }
        if (dom.hudPlayerLevel) {
            dom.hudPlayerLevel.textContent = `LVL ${level}`;
        }
    }

    // Load curriculum, profile & progress from FastAPI backend
    async function loadBackendMissionsAndProgress() {
        activeProgress = getStoredProgress();
        let userProfile = null;

        if (!window.cbApi || !window.cbApi.isAuthenticated()) {
            return { progress: activeProgress, profile: null };
        }

        try {
            const [missions, progressRecords, profile] = await Promise.all([
                window.cbApi.getMissions().catch(() => null),
                window.cbApi.getMissionProgress().catch(() => null),
                window.cbApi.getProfile().catch(() => null)
            ]);

            userProfile = profile;

            // Merge backend mission metadata into SUB_MISSIONS_DATA
            if (Array.isArray(missions) && missions.length > 0) {
                missions.forEach(bm => {
                    const targetIdx = (bm.order_index ? bm.order_index - 1 : SUB_MISSIONS_DATA.findIndex(m => m.id === bm.id));
                    if (targetIdx >= 0 && targetIdx < SUB_MISSIONS_DATA.length) {
                        const local = SUB_MISSIONS_DATA[targetIdx];
                        local.id = bm.id;
                        local.title = bm.title || local.title;
                        if (bm.objective) {
                            local.directive = bm.objective;
                        }
                        local.gameplay_type = bm.gameplay_type;
                        local.difficulty = bm.difficulty;
                        local.order_index = bm.order_index;
                        local.topic_id = bm.topic_id;
                        local.sector_id = bm.sector_id;
                    }
                });
            }

            // Build authoritative user progress state from backend
            if (Array.isArray(progressRecords)) {
                const statusMap = {};
                const completed = [];
                let totalStars = 0;

                progressRecords.forEach(p => {
                    statusMap[p.mission_id] = p.status;
                    if (p.status === 'COMPLETED') {
                        completed.push(p.mission_id);
                    }
                    totalStars += (p.stars || 0);
                });

                activeProgress = {
                    completedMissions: completed,
                    statusMap: statusMap,
                    totalXp: (userProfile && userProfile.xp) || (completed.length * 250),
                    totalStars: totalStars,
                    fromBackend: true
                };
            }
        } catch (err) {
            console.warn('[COREBOUND] Fallback to local progress:', err);
        }

        return { progress: activeProgress, profile: userProfile };
    }

    // Build 10-Node Stepper Rail
    function buildStepperRail(progress) {
        if (!dom.missionStepperRail) return;

        dom.missionStepperRail.innerHTML = '';
        SUB_MISSIONS_DATA.forEach((mission, idx) => {
            const isCompleted = progress.completedMissions.includes(mission.id);
            const unlocked = isMissionUnlocked(mission.id, progress);

            const node = document.createElement('button');
            node.className = `rail-node ${idx === currentCardIndex ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!unlocked ? 'locked' : ''}`;
            node.textContent = (mission.order_index || mission.id).toString().padStart(2, '0');
            node.title = `Mission ${mission.order_index || mission.id}: ${mission.title} ${isCompleted ? '(COMPLETED)' : (!unlocked ? '(LOCKED)' : '(AVAILABLE)')}`;

            node.addEventListener('click', () => {
                playClick();
                goToMissionIndex(idx);
            });

            dom.missionStepperRail.appendChild(node);
        });
    }

    function updateStepperRailUI() {
        if (!dom.missionStepperRail) return;
        const nodes = dom.missionStepperRail.querySelectorAll('.rail-node');
        nodes.forEach((node, idx) => {
            node.classList.toggle('active', idx === currentCardIndex);
        });
    }

    // Build Cards in 3D Carousel Stage with 3 Strict States (Completed, Available/Current, Locked)
    function buildCarouselCards(progress) {
        if (!dom.cardsTrack) return;
        dom.cardsTrack.innerHTML = '';

        // Determine current objective index (first unlocked, not completed mission)
        let currentObjectiveIndex = -1;
        for (let i = 0; i < SUB_MISSIONS_DATA.length; i++) {
            const m = SUB_MISSIONS_DATA[i];
            if (isMissionUnlocked(m.id, progress) && !progress.completedMissions.includes(m.id)) {
                currentObjectiveIndex = i;
                break;
            }
        }

        SUB_MISSIONS_DATA.forEach((mission, idx) => {
            const isCompleted = progress.completedMissions.includes(mission.id);
            const unlocked = isMissionUnlocked(mission.id, progress);
            const isCurrentObjective = (idx === currentObjectiveIndex);

            const card = document.createElement('article');
            let stateClass = 'state-available';
            if (isCompleted) stateClass = 'state-completed';
            else if (!unlocked) stateClass = 'state-locked locked';
            else if (isCurrentObjective) stateClass = 'state-available state-current';

            card.className = `mission-card ${mission.isBoss ? 'boss-mission' : ''} ${stateClass}`;
            card.dataset.index = idx;
            card.dataset.id = mission.id;

            // Background art
            const bgEl = document.createElement('div');
            bgEl.className = 'mission-card-bg';
            bgEl.style.backgroundImage = `url('${mission.bgImage}')`;

            // Vignette
            const vignette = document.createElement('div');
            vignette.className = 'mission-card-vignette';

            // Content container
            const content = document.createElement('div');
            content.className = 'mission-card-content';

            // Status chip badge markup
            let statusChipHtml = '';
            if (isCompleted) {
                statusChipHtml = `<span class="status-chip chip-completed"><span class="chip-icon">✓</span> COMPLETE</span>`;
            } else if (isCurrentObjective) {
                statusChipHtml = `<span class="status-chip chip-current"><span class="chip-pulse-dot"></span>CURRENT OBJECTIVE</span>`;
            } else if (unlocked) {
                statusChipHtml = `<span class="status-chip chip-available">AVAILABLE</span>`;
            } else {
                statusChipHtml = `<span class="status-chip chip-locked">🔒 LOCKED</span>`;
            }

            // Action button markup
            let actionBtnHtml = '';
            if (isCompleted) {
                actionBtnHtml = `
                    <a href="ch1_missions.html?mission=${mission.id}" class="btn-launch-mission cyber-action-btn btn-secondary btn-replay">
                        <span class="btn-shine"></span>
                        <span class="btn-text">REPLAY MISSION</span>
                        <span class="btn-icon">↺</span>
                    </a>
                `;
            } else if (unlocked) {
                actionBtnHtml = `
                    <a href="ch1_missions.html?mission=${mission.id}" class="btn-launch-mission cyber-action-btn ${mission.isBoss ? 'btn-primary boss-btn' : (isCurrentObjective ? 'btn-primary btn-current-glow' : 'btn-primary')}">
                        <span class="btn-shine"></span>
                        <span class="btn-text">${isCurrentObjective ? 'ENTER MISSION' : 'START MISSION'}</span>
                        <span class="btn-icon">➔</span>
                    </a>
                `;
            } else {
                actionBtnHtml = `
                    <button type="button" class="btn-launch-mission cyber-action-btn btn-secondary disabled" disabled>
                        <span class="btn-text">LOCKED</span>
                        <span class="btn-icon">🔒</span>
                    </button>
                `;
            }

            content.innerHTML = `
                <div class="card-header-row">
                    <div class="header-tag-group">
                        <span class="mission-number-tag">${mission.isBoss ? 'BOSS MISSION 10' : `MISSION 0${mission.order_index || mission.id}`}</span>
                        <span class="chamber-pill ${mission.chamberKey}">${mission.chamber.replace('SYSTEM: ', '')}</span>
                    </div>
                    <div class="header-status-group">
                        ${statusChipHtml}
                    </div>
                </div>

                <div class="card-body-section">
                    <div class="format-row">
                        <span class="format-label">FORMAT: ${mission.gameplay_type ? `${mission.gameplay_type} // ${mission.format}` : mission.format}</span>
                        <span class="difficulty-tier-tag">${mission.isBoss ? 'TACTICAL TIER III // BOSS' : 'TIER I // STANDARD'}</span>
                    </div>
                    <h2 class="mission-card-title">${mission.title}</h2>
                    <p class="mission-card-directive">${mission.directive}</p>
                    <div class="card-guardian-lead">
                        <span class="guardian-icon">${mission.guardianSymbol}</span>
                        <span>${mission.guardian} // ${mission.guardianRole}</span>
                    </div>
                </div>

                <div class="card-footer-row">
                    <div class="reward-info">
                        <div class="reward-values">
                            <span class="reward-xp">✦ +${mission.xpReward} XP</span>
                            <span class="reward-credits">⬡ +${Math.round(mission.xpReward * 0.2)} CR</span>
                        </div>
                        <span class="stars-rating ${isCompleted ? 'earned' : ''}">${isCompleted ? '★★★' : '☆☆☆'}</span>
                    </div>
                    ${actionBtnHtml}
                </div>
            `;

            card.appendChild(bgEl);
            card.appendChild(vignette);
            card.appendChild(content);

            // Locked overlay
            if (!unlocked) {
                const prevIdx = idx - 1;
                const prevMission = prevIdx >= 0 ? SUB_MISSIONS_DATA[prevIdx] : null;
                const lockOverlay = document.createElement('div');
                lockOverlay.className = 'card-lock-overlay';
                lockOverlay.innerHTML = `
                    <div class="lock-glyph-box">🔒</div>
                    <div class="lock-status-title">MISSION RESTRICTED</div>
                    <div class="lock-req-text">Complete Mission 0${prevMission ? (prevMission.order_index || prevIdx + 1) : 1} to unlock this sector.</div>
                `;
                card.appendChild(lockOverlay);
            }

            // Card click
            card.addEventListener('click', (e) => {
                if (idx !== currentCardIndex) {
                    playClick();
                    goToMissionIndex(idx);
                    return;
                }

                if (!unlocked) {
                    playClick();
                    card.classList.remove('shake');
                    void card.offsetWidth;
                    card.classList.add('shake');
                    return;
                }

                if (e.target.closest('a')) return;
                playClick();
                window.location.href = `ch1_missions.html?mission=${mission.id}`;
            });

            dom.cardsTrack.appendChild(card);
        });

        updateCarouselPositions();
    }

    function updateCarouselPositions() {
        if (!dom.cardsTrack) return;
        const cards = dom.cardsTrack.querySelectorAll('.mission-card');
        const total = cards.length;

        cards.forEach((card, idx) => {
            card.classList.remove('active', 'prev', 'next');

            if (idx === currentCardIndex) {
                card.classList.add('active');
            } else if (idx === currentCardIndex - 1 || (currentCardIndex === 0 && idx === total - 1)) {
                card.classList.add('prev');
            } else if (idx === currentCardIndex + 1 || (currentCardIndex === total - 1 && idx === 0)) {
                card.classList.add('next');
            }
        });

        const activeMission = SUB_MISSIONS_DATA[currentCardIndex];
        if (dom.statusChamberText && activeMission) {
            dom.statusChamberText.textContent = `${activeMission.chamber} // ${activeMission.format}`;
        }

        // Update Guardian comms strip based on active mission
        if (dom.commsSpeakerTag && dom.commsMessageText && activeMission) {
            dom.commsSpeakerTag.textContent = `GUARDIAN COMMS // ${activeMission.guardian}:`;
            dom.commsMessageText.textContent = `"${activeMission.directive}"`;
        }

        if (dom.btnCarouselPrev) dom.btnCarouselPrev.disabled = (currentCardIndex === 0);
        if (dom.btnCarouselNext) dom.btnCarouselNext.disabled = (currentCardIndex === total - 1);

        updateStepperRailUI();
    }

    function goToMissionIndex(index) {
        if (index < 0 || index >= SUB_MISSIONS_DATA.length) return;
        currentCardIndex = index;
        updateCarouselPositions();
    }

    // ==========================================================================
    // 3. CINEMATIC CUTSCENE PROLOGUE TRANSMISSION SYSTEM
    // ==========================================================================
    function openStoryCutscene() {
        if (!dom.storyCutsceneModal) return;

        isCutsceneActive = true;
        cutsceneIndex = 0;
        currentSpeakerId = null;
        currentSide = null;

        dom.storyCutsceneModal.style.display = 'flex';
        dom.storyCutsceneModal.style.visibility = 'visible';
        dom.storyCutsceneModal.style.opacity = '1';
        dom.storyCutsceneModal.style.pointerEvents = 'all';
        dom.storyCutsceneModal.classList.add('active');
        dom.storyCutsceneModal.setAttribute('aria-hidden', 'false');

        buildCutsceneDots();
        renderCutsceneSlide(0);
    }

    function closeStoryCutscene() {
        isCutsceneActive = false;
        if (typewriterTimer) clearTimeout(typewriterTimer);
        if (switchTimeout) clearTimeout(switchTimeout);
        if (cutsceneVoicePlayer) {
            cutsceneVoicePlayer.pause();
            cutsceneVoicePlayer.currentTime = 0;
        }

        if (dom.storyCutsceneModal) {
            dom.storyCutsceneModal.style.opacity = '0';
            dom.storyCutsceneModal.classList.remove('active');
            dom.storyCutsceneModal.setAttribute('aria-hidden', 'true');
            setTimeout(() => {
                dom.storyCutsceneModal.style.display = 'none';
            }, 380);
        }

        try {
            sessionStorage.setItem('cb_ch1_intro_played', 'true');
        } catch (e) {}
    }

    function buildCutsceneDots() {
        if (!dom.cutsceneDots) return;
        dom.cutsceneDots.innerHTML = '';
        CHAPTER1_PROLOGUE_SCRIPT.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = `cutscene-dot ${idx === 0 ? 'active' : ''}`;
            dom.cutsceneDots.appendChild(dot);
        });
    }

    function updateCutsceneDots() {
        if (!dom.cutsceneDots) return;
        const dots = dom.cutsceneDots.querySelectorAll('.cutscene-dot');
        dots.forEach((d, idx) => {
            d.className = 'cutscene-dot';
            if (idx === cutsceneIndex) d.classList.add('active');
            else if (idx < cutsceneIndex) d.classList.add('passed');
        });
    }

    // Cutscene auto-advance timers & voice synthesis
    let autoAdvanceTimer = null;
    let autoProgressInterval = null;
    let synthVoices = [];

    if ('speechSynthesis' in window) {
        synthVoices = window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            synthVoices = window.speechSynthesis.getVoices();
        };
    }

    function clearCutsceneTimers() {
        if (typewriterTimer) clearTimeout(typewriterTimer);
        if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
        if (autoProgressInterval) clearInterval(autoProgressInterval);
        if (dom.autoProgressFill) dom.autoProgressFill.style.width = '0%';
    }

    function startAutoAdvance(currentIndex) {
        if (!isCutsceneActive) return;

        const pauseDurationMs = 1200; // 1.2s breath pause after voice ends
        const intervalMs = 25;
        let elapsed = 0;

        if (autoProgressInterval) clearInterval(autoProgressInterval);

        autoProgressInterval = setInterval(() => {
            if (!isCutsceneActive) {
                clearInterval(autoProgressInterval);
                return;
            }
            elapsed += intervalMs;
            const pct = Math.min(100, Math.round((elapsed / pauseDurationMs) * 100));
            if (dom.autoProgressFill) dom.autoProgressFill.style.width = `${pct}%`;

            if (elapsed >= pauseDurationMs) {
                clearInterval(autoProgressInterval);
                if (dom.autoProgressFill) dom.autoProgressFill.style.width = '0%';
                if (currentIndex < CHAPTER1_PROLOGUE_SCRIPT.length - 1) {
                    renderCutsceneSlide(currentIndex + 1);
                } else {
                    closeStoryCutscene();
                }
            }
        }, intervalMs);
    }

    function playGuardianVoice(slide, onEndCallback) {
        if (isMuted) {
            if (onEndCallback) onEndCallback();
            return;
        }

        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        if (cutsceneVoicePlayer) {
            cutsceneVoicePlayer.pause();
            cutsceneVoicePlayer.currentTime = 0;
        }

        if (dom.bgAudio) dom.bgAudio.volume = 0.15;

        let finished = false;
        const completeVoice = function () {
            if (finished) return;
            finished = true;
            if (dom.speechAudioWave) dom.speechAudioWave.classList.remove('speaking');
            if (dom.bgAudio && !isMuted) dom.bgAudio.volume = 0.45;
            if (onEndCallback) onEndCallback();
        };

        if (slide.audioSrc) {
            cutsceneVoicePlayer.src = slide.audioSrc;
            cutsceneVoicePlayer.volume = 1.0;
            cutsceneVoicePlayer.onplay = () => {
                if (dom.speechAudioWave) dom.speechAudioWave.classList.add('speaking');
            };
            cutsceneVoicePlayer.onended = () => {
                completeVoice();
            };
            cutsceneVoicePlayer.onerror = () => {
                speakGuardianFallback(slide.text, slide.guardianId, completeVoice);
            };

            const playPromise = cutsceneVoicePlayer.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    if (dom.speechAudioWave) dom.speechAudioWave.classList.add('speaking');
                }).catch(() => {
                    // Autoplay prevented by browser: fallback speech
                    speakGuardianFallback(slide.text, slide.guardianId, completeVoice);
                });
            }
        } else {
            speakGuardianFallback(slide.text, slide.guardianId, completeVoice);
        }
    }

    /**
     * Intelligent Voice Selector & Acoustic Profiler
     * Nova: Female Leader (Clear, confident pitch)
     * Byte: Male AI (Robotic, analytical low-mid pitch)
     * Echo: Female Mystic (Serene, ethereal harmonic pitch)
     * Blaze: Male Vanguard (Deep bass, bold heroic pitch)
     */
    function getGuardianVoiceConfig(guardianId, text) {
        const gid = (guardianId || 'nova').toLowerCase();
        const isFemale = (gid === 'nova' || gid === 'echo');
        const isDevanagari = /[\u0900-\u097F]/.test(text || '');

        if (!synthVoices || synthVoices.length === 0) {
            if ('speechSynthesis' in window) {
                synthVoices = window.speechSynthesis.getVoices();
            }
        }

        const voices = synthVoices || [];
        
        // Female voice name hints
        const femaleHints = ['female', 'swara', 'heera', 'zira', 'samantha', 'victoria', 'jenny', 'aria', 'hazel', 'kavita', 'kalpana', 'aditi', 'raveena', 'ananya', 'shruti', 'sunita', 'geeta', 'veena', 'google हिन्दी', 'google us english'];
        
        // Male voice name hints
        const maleHints = ['male', 'madhav', 'hemant', 'david', 'mark', 'george', 'guy', 'ryan', 'roger', 'prabhat', 'ravi', 'neerja', 'alok', 'tarun', 'google uk english male'];

        let matchedVoice = null;

        if (isDevanagari) {
            const hindiVoices = voices.filter(v => 
                (v.lang && (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('hi-in') || v.lang.toLowerCase().includes('hin'))) ||
                (v.name && v.name.toLowerCase().includes('hindi'))
            );

            if (hindiVoices.length > 0) {
                if (isFemale) {
                    matchedVoice = hindiVoices.find(v => {
                        const name = v.name.toLowerCase();
                        return femaleHints.some(h => name.includes(h)) && !maleHints.some(m => name.includes(m));
                    }) || hindiVoices.find(v => !maleHints.some(m => v.name.toLowerCase().includes(m))) || hindiVoices[0];
                } else {
                    matchedVoice = hindiVoices.find(v => {
                        const name = v.name.toLowerCase();
                        return maleHints.some(h => name.includes(h));
                    }) || hindiVoices.find(v => !femaleHints.some(f => v.name.toLowerCase().includes(f))) || hindiVoices[hindiVoices.length - 1] || hindiVoices[0];
                }
            }
        }

        if (!matchedVoice && voices.length > 0) {
            const langVoices = voices.filter(v => v.lang && (v.lang.toLowerCase().startsWith('en') || v.lang.toLowerCase().startsWith('hi')));
            const targetList = langVoices.length > 0 ? langVoices : voices;

            if (isFemale) {
                matchedVoice = targetList.find(v => {
                    const name = v.name.toLowerCase();
                    return femaleHints.some(h => name.includes(h)) && !maleHints.some(m => name.includes(m));
                }) || targetList[0];
            } else {
                matchedVoice = targetList.find(v => {
                    const name = v.name.toLowerCase();
                    return maleHints.some(h => name.includes(h));
                }) || targetList[targetList.length - 1] || targetList[0];
            }
        }

        let pitch = 1.0;
        let rate = 0.96;

        switch (gid) {
            case 'nova':
                pitch = 1.12;
                rate = 0.98;
                break;
            case 'echo':
                pitch = 1.28;
                rate = 0.92;
                break;
            case 'byte':
                pitch = 0.82;
                rate = 1.06;
                break;
            case 'blaze':
                pitch = 0.72;
                rate = 1.02;
                break;
            default:
                pitch = isFemale ? 1.10 : 0.85;
                rate = 0.98;
        }

        return {
            voice: matchedVoice,
            lang: matchedVoice ? matchedVoice.lang : (isDevanagari ? 'hi-IN' : 'en-US'),
            pitch,
            rate
        };
    }

    function speakGuardianFallback(text, guardianId, onEndCallback) {
        if (!('speechSynthesis' in window) || isMuted) {
            const delay = Math.max(3500, (text || '').length * 85);
            autoAdvanceTimer = setTimeout(() => {
                if (onEndCallback) onEndCallback();
            }, delay);
            return;
        }

        try {
            window.speechSynthesis.cancel();

            let executed = false;
            const safeDone = () => {
                if (executed) return;
                executed = true;
                if (dom.speechAudioWave) dom.speechAudioWave.classList.remove('speaking');
                if (onEndCallback) onEndCallback();
            };

            setTimeout(() => {
                const cleanText = (text || '').replace(/["“”«»]/g, '').trim();
                if (!cleanText) { safeDone(); return; }

                const voiceCfg = getGuardianVoiceConfig(guardianId, cleanText);
                const utterance = new SpeechSynthesisUtterance(cleanText);

                if (voiceCfg.voice) {
                    utterance.voice = voiceCfg.voice;
                    utterance.lang = voiceCfg.voice.lang || voiceCfg.lang;
                } else {
                    utterance.lang = voiceCfg.lang;
                }

                utterance.pitch = voiceCfg.pitch;
                utterance.rate = voiceCfg.rate;

                utterance.onstart = () => {
                    if (dom.speechAudioWave) dom.speechAudioWave.classList.add('speaking');
                };
                utterance.onend = () => {
                    safeDone();
                };
                utterance.onerror = () => {
                    safeDone();
                };

                const maxSafetyTime = Math.max(9000, cleanText.length * 110);
                setTimeout(safeDone, maxSafetyTime);

                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                }
                window.speechSynthesis.speak(utterance);
            }, 50);
        } catch (e) {
            if (onEndCallback) onEndCallback();
        }
    }

    function renderCutsceneSlide(idx) {
        if (idx < 0 || idx >= CHAPTER1_PROLOGUE_SCRIPT.length) {
            closeStoryCutscene();
            return;
        }

        clearCutsceneTimers();
        cutsceneIndex = idx;
        const slide = CHAPTER1_PROLOGUE_SCRIPT[idx];

        updateCutsceneDots();
        transitionCharacterToSpeaker(slide.guardianId);

        // Update speaker badge
        if (dom.cutsceneSpeakerBadge) {
            const conf = CHARACTER_CONFIG[slide.guardianId.toLowerCase()] || CHARACTER_CONFIG.nova;
            dom.cutsceneSpeakerBadge.className = `cutscene-speaker-badge ${conf.badgeClass}`;
            dom.cutsceneSpeakerBadge.textContent = slide.speaker;
        }

        // Update prev button state
        if (dom.btnPrevCutscene) {
            dom.btnPrevCutscene.disabled = (idx === 0);
        }

        currentSlideText = slide.text;

        // Play real voice audio with auto-advance on complete
        playGuardianVoice(slide, () => {
            if (isCutsceneActive) {
                startAutoAdvance(idx);
            }
        });

        // Typewriter Animation
        typewriterEffect(slide.text, () => {
            if (isCutsceneActive && (!cutsceneVoicePlayer || cutsceneVoicePlayer.paused)) {
                startAutoAdvance(idx);
            }
        });
    }

    function typewriterEffect(text, onComplete) {
        if (typewriterTimer) clearTimeout(typewriterTimer);
        isTyping = true;
        let charIndex = 0;
        dom.cutsceneText.textContent = '';

        if (dom.speechAudioWave) dom.speechAudioWave.classList.add('speaking');

        function step() {
            if (!isCutsceneActive) return;
            if (charIndex < text.length) {
                dom.cutsceneText.textContent += text.charAt(charIndex);
                charIndex++;
                typewriterTimer = setTimeout(step, 18);
            } else {
                isTyping = false;
                if (dom.speechAudioWave) dom.speechAudioWave.classList.remove('speaking');
                if (onComplete) onComplete();
            }
        }
        step();
    }

    function transitionCharacterToSpeaker(guardianId) {
        const charId = (guardianId || 'nova').toLowerCase();
        const nextConfig = CHARACTER_CONFIG[charId] || CHARACTER_CONFIG.nova;
        const nextSide = nextConfig.side;

        if (switchTimeout) {
            clearTimeout(switchTimeout);
            switchTimeout = null;
        }

        if (currentSpeakerId === charId) {
            const actor = (nextSide === 'left') ? dom.cinematicCharLeft : dom.cinematicCharRight;
            if (actor && !actor.classList.contains('fade-in')) {
                actor.className = `cinematic-char-actor char-side-${nextSide} fade-in`;
            }
            return;
        }

        if (currentSpeakerId && currentSide) {
            const prevActor = (currentSide === 'left') ? dom.cinematicCharLeft : dom.cinematicCharRight;
            if (prevActor) {
                prevActor.className = `cinematic-char-actor char-side-${currentSide} fade-out`;
            }

            switchTimeout = setTimeout(() => {
                if (!isCutsceneActive) return;
                if (prevActor) prevActor.className = `cinematic-char-actor char-side-${currentSide} hidden`;
                showSpeakerActor(charId, nextConfig);
            }, 380);
        } else {
            showSpeakerActor(charId, nextConfig);
        }
    }

    function showSpeakerActor(charId, config) {
        const side = config.side;
        const actor = (side === 'left') ? dom.cinematicCharLeft : dom.cinematicCharRight;
        const img = (side === 'left') ? dom.charFullbodyLeft : dom.charFullbodyRight;
        const opposite = (side === 'left') ? dom.cinematicCharRight : dom.cinematicCharLeft;

        if (opposite) opposite.className = `cinematic-char-actor char-side-${side === 'left' ? 'right' : 'left'} hidden`;
        if (img) img.src = config.img;
        if (actor) {
            actor.className = `cinematic-char-actor char-side-${side} fade-in`;
        }

        currentSpeakerId = charId;
        currentSide = side;
    }

    function handleNextCutscene() {
        playClick();
        if (isTyping) {
            // Instantly finish typewriter text
            if (typewriterTimer) clearTimeout(typewriterTimer);
            dom.cutsceneText.textContent = currentSlideText;
            isTyping = false;
            if (dom.speechAudioWave) dom.speechAudioWave.classList.remove('speaking');
            return;
        }

        clearCutsceneTimers();

        if (cutsceneVoicePlayer) {
            cutsceneVoicePlayer.pause();
            cutsceneVoicePlayer.currentTime = 0;
        }
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();

        if (cutsceneIndex < CHAPTER1_PROLOGUE_SCRIPT.length - 1) {
            renderCutsceneSlide(cutsceneIndex + 1);
        } else {
            closeStoryCutscene();
        }
    }

    function handlePrevCutscene() {
        playClick();
        clearCutsceneTimers();

        if (cutsceneVoicePlayer) {
            cutsceneVoicePlayer.pause();
            cutsceneVoicePlayer.currentTime = 0;
        }
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();

        if (cutsceneIndex > 0) {
            renderCutsceneSlide(cutsceneIndex - 1);
        }
    }

    function setupControls() {
        if (dom.btnCarouselPrev) {
            dom.btnCarouselPrev.addEventListener('click', () => {
                if (currentCardIndex > 0) {
                    playClick();
                    goToMissionIndex(currentCardIndex - 1);
                }
            });
        }

        if (dom.btnCarouselNext) {
            dom.btnCarouselNext.addEventListener('click', () => {
                if (currentCardIndex < SUB_MISSIONS_DATA.length - 1) {
                    playClick();
                    goToMissionIndex(currentCardIndex + 1);
                }
            });
        }

        // Cutscene Controls
        if (dom.btnNextCutscene) {
            dom.btnNextCutscene.addEventListener('click', (e) => {
                e.stopPropagation();
                handleNextCutscene();
            });
        }

        if (dom.btnPrevCutscene) {
            dom.btnPrevCutscene.addEventListener('click', (e) => {
                e.stopPropagation();
                handlePrevCutscene();
            });
        }

        if (dom.cutsceneDialogueBox) {
            dom.cutsceneDialogueBox.addEventListener('click', (e) => {
                if (e.target.closest('.dialogue-nav-btn') || e.target.closest('button')) return;
                handleNextCutscene();
            });
        }

        if (dom.btnSkipCutscene) {
            dom.btnSkipCutscene.addEventListener('click', (e) => {
                e.stopPropagation();
                playClick();
                closeStoryCutscene();
            });
        }

        // Keyboard Controls: Left / Right arrows, Space, Enter, Escape
        document.addEventListener('keydown', (e) => {
            if (isCutsceneActive) {
                if (e.code === 'Space' || e.key === 'Enter') {
                    e.preventDefault();
                    handleNextCutscene();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    handleNextCutscene();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    handlePrevCutscene();
                } else if (e.key === 'Escape') {
                    closeStoryCutscene();
                }
                return;
            }

            if (e.key === 'ArrowLeft' && currentCardIndex > 0) {
                playClick();
                goToMissionIndex(currentCardIndex - 1);
            } else if (e.key === 'ArrowRight' && currentCardIndex < SUB_MISSIONS_DATA.length - 1) {
                playClick();
                goToMissionIndex(currentCardIndex + 1);
            } else if (e.key === 'Enter') {
                const progress = activeProgress || getStoredProgress();
                const activeMission = SUB_MISSIONS_DATA[currentCardIndex];
                if (isMissionUnlocked(activeMission.id, progress)) {
                    playClick();
                    window.location.href = `ch1_missions.html?mission=${activeMission.id}`;
                }
            }
        });
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', async () => {
        initAudio();
        
        // Load backend curriculum, profile and authoritative user progress if available
        const { progress, profile } = await loadBackendMissionsAndProgress();
        updateProgressBadges(progress, profile);

        // Find initial mission index (first unlocked & uncompleted mission)
        let initialIndex = 0;
        for (let i = 0; i < SUB_MISSIONS_DATA.length; i++) {
            const mId = SUB_MISSIONS_DATA[i].id;
            if (isMissionUnlocked(mId, progress) && !progress.completedMissions.includes(mId)) {
                initialIndex = i;
                break;
            }
        }
        currentCardIndex = initialIndex;

        buildStepperRail(progress);
        buildCarouselCards(progress);
        setupControls();

        // Check if Chapter 1 main story should play (when clicking START from level.html or first chapter visit)
        const urlParams = new URLSearchParams(window.location.search);
        const shouldPlayIntro = urlParams.get('intro') === 'true' || sessionStorage.getItem('cb_ch1_intro_played') !== 'true';

        if (shouldPlayIntro) {
            openStoryCutscene();
        }
    });

    // Global developer helper to reset/relock missions easily from console
    window.resetChapter1Progress = function () {
        localStorage.removeItem('cb_ch1_progress');
        localStorage.removeItem('COREBOUND_CHAPTER_1_COMPLETED');
        sessionStorage.removeItem('cb_ch1_intro_played');
        console.log("%c[COREBOUND] Chapter 1 progress reset. All missions locked except Mission 01.", "color: #00e5ff; font-weight: bold; font-size: 14px;");
        location.reload();
    };
})();
