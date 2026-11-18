// ======================================================
// COREBOUND - CINEMATIC STORY SYSTEM
// Dialogue Audio Controls Scene Progression
// ======================================================

const scenes = [

    // ==================================================
    // SCENE 01
    // ==================================================
    {
        image: "assets/images/01_Opening_Cosmos.png",

        music: "assets/audio/cosmic-awakening.mp3",

        dialogue: "assets/audio/dialogue_01.mp3",

        text: "ब्रह्मांड में एक ऐसी दुनिया थी जहाँ हर ज्ञान, हर खोज, हर विचार और हर तकनीक एक ही रहस्यमयी शक्ति से संचालित होती थी।"
    },


    // ==================================================
    // SCENE 02
    // ==================================================
    {
        image: "assets/images/02_World_Reveal.png",

        music: "assets/audio/cosmic-awakening.mp3",

        dialogue: "assets/audio/dialogue_02.mp3",

        text: "उस शक्ति का नाम था — The Core."
    },


    // ==================================================
    // SCENE 03
    // ==================================================
    {
        image: "assets/images/03_The_Civilization.png",

        music: "assets/audio/cosmic-awakening.mp3",

        dialogue: "assets/audio/dialogue_03.mp3",

        text: "The Core कोई साधारण क्रिस्टल नहीं था। वह सम्पूर्ण ज्ञान, बुद्धि और प्रगति का स्रोत था।"
    },


    // ==================================================
    // SCENE 04
    // ==================================================
    {
        image: "assets/images/06_Corruption_Begins.png",

        music: "assets/audio/corruption.mp3",

        dialogue: "assets/audio/dialogue_04.mp3",

        text: "लेकिन... एक दिन..."
    },


    // ==================================================
    // SCENE 05
    // ==================================================
    {
        image: "assets/images/10_NULL_Is_Born.png",

        music: "assets/audio/corruption.mp3",

        dialogue: "assets/audio/dialogue_05.mp3",

        text: "अंधेरे से एक रहस्यमयी शक्ति प्रकट हुई। उसका नाम था — NULL."
    },


    // ==================================================
    // SCENE 06 — NULL ATTACKS THE CORE
    // ==================================================
    {
        image: "assets/images/12_NULL_Attacks_The_Core (2).png",

        music: "assets/audio/corruption.mp3",

        dialogue: "assets/audio/dialogue_06.mp3",

        text: "NULL ने The Core को छू लिया।"
    },


    // ==================================================
    // SCENE 07 — FOUR GUARDIANS ARRIVE
    // ==================================================
    {
        image: "assets/images/14_Four_Guardians_Protect_The_Core.png",

        music: "assets/audio/guardian-theme.mp3",

        dialogue: "assets/audio/dialogue_07.mp3",

        text: "The Core की रक्षा करने वाले चार महान Guardians तुरंत वहाँ पहुँचे।"
    },


    // ==================================================
    // SCENE 08 — NOVA
    // ==================================================
    {
        image: "assets/images/15_Nova_The_Starward_Sentinel.png",

        music: "assets/audio/guardian-theme.mp3",

        dialogue: "assets/audio/dialogue_08.mp3",

        text: "NOVA — The Starward Sentinel."
    },


    // ==================================================
    // SCENE 09 — BYTE
    // ==================================================
    {
        image: "assets/images/16_Byte_The_Code_Architect.png",

        music: "assets/audio/guardian-theme.mp3",

        dialogue: "assets/audio/dialogue_09.mp3",

        text: "BYTE — The Code Architect."
    },


    // ==================================================
    // SCENE 10 — ECHO
    // ==================================================
    {
        image: "assets/images/17_Echo_The_Resonance_Weaver.png",

        music: "assets/audio/guardian-theme.mp3",

        dialogue: "assets/audio/dialogue_10.mp3",

        text: "ECHO — The Resonance Weaver."
    },


    // ==================================================
    // SCENE 11 — BLAZE
    // ==================================================
    // IMPORTANT:
    // Replace the image filename below with the EXACT
    // Blaze image filename from your images folder.
    // ==================================================
    {
        image: "assets/images/18_Blaze.png",

        music: "assets/audio/guardian-theme.mp3",

        dialogue: "assets/audio/dialogue_11.mp3",

        text: "BLAZE — One of the four Guardians."
    },


    // ==================================================
    // SCENE 12 — GUARDIANS UNITED
    // ==================================================
    {
        image: "assets/images/19_Guardians_United.png",

        music: "assets/audio/guardian-theme.mp3",

        dialogue: "assets/audio/dialogue_12.mp3",

        text: "चारों Guardians एक साथ खड़े हुए।"
    },


    // ==================================================
    // SCENE 13 — THE BATTLE AGAINST NULL
    // ==================================================
    {
        image: "assets/images/20_The_Battle_Against_NULL.png",

        music: "assets/audio/final-battle.mp3",

        dialogue: "assets/audio/dialogue_13.mp3",

        text: "The Guardians ने NULL को रोकने के लिए पूरी शक्ति से युद्ध किया।"
    },


    // ==================================================
    // SCENE 14 — THE CORE IS DESTROYED
    // ==================================================
    {
        image: "assets/images/21_The_Core_Is_Destroyed.png",

        music: "assets/audio/final-battle.mp3",

        dialogue: "assets/audio/dialogue_14.mp3",

        text: "एक विशाल विस्फोट हुआ। The Core टूटकर अनगिनत टुकड़ों में बिखर गया।"
    },


    // ==================================================
    // SCENE 15 — THE LAST HOPE
    // ==================================================
    {
        image: "assets/images/22_You_Are_Chosen.png",

        music: "assets/audio/player-awakening.mp3",

        dialogue: "assets/audio/dialogue_15.mp3",

        text: "The Core के टूटे हुए टुकड़ों में से एक छोटी-सी नीली रोशनी निकलने लगी।"
    },


    // ==================================================
    // SCENE 16 — PLAYER AWAKENS
    // ==================================================
    {
        image: "assets/images/23_You_Are_player.png",

        music: "assets/audio/player-awakening.mp3",

        dialogue: "assets/audio/dialogue_16.mp3",

        text: "वह रोशनी धीरे-धीरे एक इंसान का रूप लेने लगी। वही था — Player."
    },


    // ==================================================
    // SCENE 17 — NOVA REACHES THE PLAYER
    // ==================================================
    {
        image: "assets/images/24_You_Are_Chosen.png",

        music: "assets/audio/mysterious-revelation.mp3",

        dialogue: "assets/audio/dialogue_17.mp3",

        text: "क्या तुम मेरी आवाज सुन सकते हो?"
    },


    // ==================================================
    // SCENE 18 — UNKNOWN GUARDIAN
    // ==================================================
    {
        image: "assets/images/25_You_Are_Chosen.png",

        music: "assets/audio/mysterious-revelation.mp3",

        dialogue: "assets/audio/dialogue_18.mp3",

        text: "यह संभव कैसे है?"
    },


    // ==================================================
    // SCENE 19 — THE FINAL GUARDIAN
    // ==================================================
    {
        image: "assets/images/26_You_Are_Chosen.png",

        music: "assets/audio/mysterious-revelation.mp3",

        dialogue: "assets/audio/dialogue_19.mp3",

        text: "शायद... The Core ने अपना अंतिम रक्षक चुन लिया है।"
    },


    // ==================================================
    // SCENE 20 — THE DESTROYED WORLD
    // ==================================================
    {
        image: "assets/images/27_You_Are_Chosen.png",

        music: "assets/audio/emotional-journey.mp3",

        dialogue: "assets/audio/dialogue_20.mp3",

        text: "Player ने चारों ओर देखा। जो दुनिया कभी जीवित थी, वह अब टूट चुकी थी।"
    },


    // ==================================================
    // SCENE 21 — GUARDIAN ACADEMY
    // ==================================================
    {
        image: "assets/images/28_Train_Learn_Prepare.png",

        music: "assets/audio/adventure-theme.mp3",

        dialogue: "assets/audio/dialogue_21.mp3",

        text: "Nova Player को  ले जाती है। यहीं से उसकी Guardian Training शुरू होती है।"
    },


    // ==================================================
    // SCENE 22 — KNOWLEDGE SECTORS
    // ==================================================
    {
        image: "assets/images/29_The_Knowledge_Sectors.png",

        music: "assets/audio/adventure-theme.mp3",

        dialogue: "assets/audio/dialogue_22.mp3",

        text: "पूरी दुनिया के Knowledge Sectors धीरे-धीरे अंधकार में डूब रहे हैं।"
    },

];


// ======================================================
// HTML ELEMENTS
// ======================================================

const storyBg = document.getElementById("story-bg");
const storyText = document.getElementById("story-text");
const bgAudio = document.getElementById("bg-audio");
const nextTrigger = document.getElementById("next-trigger");
const skipButton = document.getElementById("skip-btn");
const dotsContainer = document.getElementById("dots-container");
const centerContent = document.getElementById("center-content");
const btnStoryPrev = document.getElementById("btn-story-prev");
const btnStoryNext = document.getElementById("btn-story-next");

const introScreen = document.getElementById("intro-screen");
const btnBeginStory = document.getElementById("btn-begin-story");
const btnSkipIntro = document.getElementById("btn-skip-intro");

// Quantum Loading Screen Elements
const cbLoadingScreen = document.getElementById("cb-loading-screen");
const loadingBadge = document.getElementById("loading-badge");
const loadingTitle = document.getElementById("loading-title");
const loadingStatusText = document.getElementById("loading-status-text");
const loadingProgressFill = document.getElementById("loading-progress-fill");
const loadingPercent = document.getElementById("loading-percent");
const loadingSpeed = document.getElementById("loading-speed");
const loadingFlash = document.getElementById("loading-flash");


// ======================================================
// AUDIO SYSTEM & SOUND EFFECTS
// ======================================================

const dialogueAudio = new Audio();
const clickSound = new Audio('assets/audio/click.wav');

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log('Click sound playback:', e));
}

// ======================================================
// STORY INTRO AMBIENT AUDIO SYSTEM
// ======================================================
const TARGET_INTRO_AMBIENT_VOL = 0.25; // Matching level & loading ambient volume
const introAmbientAudio = new Audio('assets/audio/aurora_bg_music.mp3');
introAmbientAudio.loop = true;
introAmbientAudio.volume = 0;
introAmbientAudio.preload = 'auto';

let isIntroAmbientPlaying = false;
let isIntroAmbientFadingOut = false;
let introAmbientFadeInterval = null;

function playIntroAmbient() {
    if (isIntroAmbientPlaying || isIntroAmbientFadingOut) return;

    const savedTime = sessionStorage.getItem('story_ambient_time');
    if (savedTime && !isNaN(parseFloat(savedTime))) {
        try {
            introAmbientAudio.currentTime = parseFloat(savedTime);
        } catch (e) {}
        sessionStorage.removeItem('story_ambient_time');
    }

    introAmbientAudio.play().then(() => {
        isIntroAmbientPlaying = true;

        // Smooth fade-in over ~1.0s
        if (introAmbientFadeInterval) clearInterval(introAmbientFadeInterval);
        introAmbientFadeInterval = setInterval(() => {
            if (introAmbientAudio.volume < TARGET_INTRO_AMBIENT_VOL - 0.015) {
                introAmbientAudio.volume = Math.min(TARGET_INTRO_AMBIENT_VOL, introAmbientAudio.volume + 0.02);
            } else {
                introAmbientAudio.volume = TARGET_INTRO_AMBIENT_VOL;
                clearInterval(introAmbientFadeInterval);
                introAmbientFadeInterval = null;
            }
        }, 50);
    }).catch(() => {
        // Autoplay policy prevented immediate playback; unlock on user interaction
    });
}

function fadeAndStopIntroAmbient(duration = 450, callback) {
    if (!isIntroAmbientPlaying) {
        if (typeof callback === 'function') callback();
        return;
    }

    isIntroAmbientFadingOut = true;
    if (introAmbientFadeInterval) {
        clearInterval(introAmbientFadeInterval);
        introAmbientFadeInterval = null;
    }

    const startVolume = introAmbientAudio.volume;
    const stepInterval = 25;
    const totalSteps = Math.max(1, duration / stepInterval);
    const volumeStep = startVolume / totalSteps;

    introAmbientFadeInterval = setInterval(() => {
        if (introAmbientAudio.volume > volumeStep) {
            introAmbientAudio.volume = Math.max(0, introAmbientAudio.volume - volumeStep);
        } else {
            introAmbientAudio.volume = 0;
            introAmbientAudio.pause();
            introAmbientAudio.currentTime = 0;
            introAmbientAudio.src = '';
            isIntroAmbientPlaying = false;
            isIntroAmbientFadingOut = false;
            clearInterval(introAmbientFadeInterval);
            introAmbientFadeInterval = null;
            if (typeof callback === 'function') callback();
        }
    }, stepInterval);
}

// Start intro ambient audio on page load
playIntroAmbient();

const unlockIntroAmbient = () => {
    playIntroAmbient();
    window.removeEventListener('pointerdown', unlockIntroAmbient);
    window.removeEventListener('keydown', unlockIntroAmbient);
    window.removeEventListener('touchstart', unlockIntroAmbient);
};
window.addEventListener('pointerdown', unlockIntroAmbient, { passive: true });
window.addEventListener('keydown', unlockIntroAmbient, { passive: true });
window.addEventListener('touchstart', unlockIntroAmbient, { passive: true });


// ======================================================
// STORY STATE
// ======================================================

let currentScene = 0;

let storyStarted = false;

let isChangingScene = false;

let currentMusic = "";


// ======================================================
// CREATE SCENE DOTS
// ======================================================

function createDots() {

    dotsContainer.innerHTML = "";

    scenes.forEach((scene, index) => {

        const dot = document.createElement("div");

        dot.classList.add("story-dot");

        if (index === 0) {
            dot.classList.add("active");
        }

        dotsContainer.appendChild(dot);

    });
}


// ======================================================
// UPDATE DOTS
// ======================================================

function updateDots() {

    const dots =
        dotsContainer.querySelectorAll(".story-dot");

    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === currentScene
        );

    });
}


// ======================================================
// CHANGE BACKGROUND IMAGE
// ======================================================

function changeImage(imagePath) {

    storyBg.classList.add("scene-fade-out");

    setTimeout(() => {

        storyBg.style.backgroundImage =
            `url("${imagePath}")`;

        storyBg.classList.remove("scene-fade-out");

    }, 500);
}


// ======================================================
// MUSIC SYSTEM
// Music only changes when the music file changes.
// ======================================================

function playMusic(musicPath) {

    if (!musicPath) {
        return;
    }

    if (currentMusic === musicPath) {
        return;
    }

    currentMusic = musicPath;

    bgAudio.pause();

    bgAudio.src = musicPath;

    bgAudio.volume = 0.35;

    bgAudio.currentTime = 0;

    bgAudio.play().catch(() => {

        console.log(
            "Music will start after user interaction."
        );

    });
}


// ======================================================
// PLAY DIALOGUE
// Dialogue completion automatically starts next scene.
// ======================================================

function playDialogue(dialoguePath) {

    dialogueAudio.pause();

    dialogueAudio.currentTime = 0;

    if (!dialoguePath) {

        setTimeout(() => {

            nextScene();

        }, 3000);

        return;
    }

    dialogueAudio.src = dialoguePath;

    dialogueAudio.volume = 1.0;

    dialogueAudio.onended = () => {

        console.log(
            "Dialogue finished. Moving to next scene."
        );

        nextScene();

    };

    dialogueAudio.play().catch(() => {

        console.log(
            "Dialogue waiting for user interaction."
        );

    });
}


// ======================================================
// ======================================================
// SILKY SMOOTH DIALOGUE STREAMER
// Typewriter/streaming text with instantaneous reveal on interaction
// ======================================================

let typeInterval = null;
let isTyping = false;

function streamStoryText(fullText, onDone) {
    if (typeInterval) {
        clearInterval(typeInterval);
        typeInterval = null;
    }

    if (!storyText) return;
    storyText.textContent = "";
    isTyping = true;
    let charIndex = 0;
    const speed = 24; // ms per character

    typeInterval = setInterval(() => {
        if (charIndex < fullText.length) {
            storyText.textContent += fullText.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typeInterval);
            typeInterval = null;
            isTyping = false;
            if (typeof onDone === 'function') onDone();
        }
    }, speed);
}


// ======================================================
// LOAD SCENE
// ======================================================

function loadScene(index) {

    if (index < 0 || index >= scenes.length) {
        return;
    }

    const scene = scenes[index];

    console.log(
        `Loading Scene ${index + 1}`
    );


    // -----------------------------------------------
    // IMAGE
    // -----------------------------------------------

    changeImage(scene.image);


    // -----------------------------------------------
    // TEXT (STREAMED IN SMOOTHLY)
    // -----------------------------------------------

    streamStoryText(scene.text);


    // -----------------------------------------------
    // MUSIC
    // -----------------------------------------------

    playMusic(scene.music);


    // -----------------------------------------------
    // DIALOGUE
    // -----------------------------------------------

    setTimeout(() => {

        playDialogue(scene.dialogue);

    }, 450);


    // -----------------------------------------------
    // DOTS & NAVIGATION BUTTONS
    // -----------------------------------------------

    updateDots();
    updateNavButtons();
}


// ======================================================
// NEXT SCENE
// ======================================================

function nextScene() {

    if (isChangingScene) {
        return;
    }

    isChangingScene = true;


    // -----------------------------------------------
    // STOP CURRENT DIALOGUE
    // -----------------------------------------------

    dialogueAudio.pause();

    dialogueAudio.currentTime = 0;


    // -----------------------------------------------
    // CHECK STORY END
    // ===============================================

    if (currentScene >= scenes.length - 1) {

        finishStory();

        return;
    }


    // -----------------------------------------------
    // MOVE TO NEXT SCENE
    // -----------------------------------------------

    currentScene++;


    setTimeout(() => {

        isChangingScene = false;

        loadScene(currentScene);

    }, 300);
}


// ======================================================
// PREVIOUS SCENE
// ======================================================

function prevScene() {

    if (isChangingScene || currentScene <= 0) {
        return;
    }

    isChangingScene = true;


    // -----------------------------------------------
    // STOP CURRENT DIALOGUE
    // -----------------------------------------------

    dialogueAudio.pause();

    dialogueAudio.currentTime = 0;


    // -----------------------------------------------
    // MOVE TO PREVIOUS SCENE
    // -----------------------------------------------

    currentScene--;


    setTimeout(() => {

        isChangingScene = false;

        loadScene(currentScene);

    }, 300);
}


// ======================================================
// UPDATE NAVIGATION BUTTONS (< and >)
// ======================================================

function updateNavButtons() {
    if (btnStoryPrev) {
        if (currentScene <= 0) {
            btnStoryPrev.disabled = true;
            btnStoryPrev.classList.add("disabled");
        } else {
            btnStoryPrev.disabled = false;
            btnStoryPrev.classList.remove("disabled");
        }
    }
}


// ======================================================
// PHASE 2 CINEMATIC ENTRANCE & STORY AWAKENING
// Creates prologue chapter title card in #center-content,
// camera push-in on cosmos, then smoothly reveals dialogue & voice
// ======================================================

let isPhase2Entering = false;

function startPhase2Entrance() {
    if (isPhase2Entering) return;
    isPhase2Entering = true;
    storyStarted = true;
    currentScene = 0;

    console.log("COREBOUND PHASE 2 CINEMATIC ENTRANCE INITIALIZED");

    // 1. Prepare Scene 0 background with camera awaken animation
    storyBg.style.backgroundImage = `url("${scenes[0].image}")`;
    storyBg.classList.remove("scene-fade-out");
    storyBg.classList.remove("phase2-cinematic-intro");
    void storyBg.offsetWidth; // force DOM reflow
    storyBg.classList.add("phase2-cinematic-intro");

    // 2. Start cosmic background music smoothly
    playMusic(scenes[0].music);

    // 3. Keep HUD dialogue and skip controls hidden during prologue card
    if (nextTrigger) nextTrigger.classList.remove("visible");
    if (skipButton) skipButton.classList.remove("visible");

    // 4. Inject Prologue Chapter Title Card into #center-content
    if (centerContent) {
        centerContent.innerHTML = `
            <div class="prologue-banner" id="prologue-banner">
                <div class="prologue-crest-slot">
                    <div class="prologue-aura-glow"></div>
                    <img src="assets/images/corebound_logo.png" class="prologue-crest-img" alt="COREBOUND">
                </div>
                <div class="prologue-kicker">CHRONICLES OF COREBOUND</div>
                <h1 class="prologue-title">PROLOGUE: THE AWAKENING</h1>
                <div class="prologue-divider">
                    <span class="p-line-glow"></span>
                    <span class="p-star-sigil">✦</span>
                    <span class="p-line-glow"></span>
                </div>
            </div>
        `;
    }

    createDots();
    updateDots();
    updateNavButtons();

    // 5. Hold Prologue Title Card for ~1.85s, then dissolve smoothly
    setTimeout(() => {
        const prologueCard = document.getElementById("prologue-banner");
        if (prologueCard) {
            prologueCard.classList.add("prologue-fade-out");
        }

        // 6. As prologue card dissolves, glide HUD into place & start narrative
        setTimeout(() => {
            if (centerContent) {
                centerContent.innerHTML = "";
            }

            // Reveal top-right Skip button & bottom dialogue box
            if (skipButton) skipButton.classList.add("visible");
            if (nextTrigger) nextTrigger.classList.add("visible");

            // Text box opening sheen & stream narrative text
            if (storyText) {
                storyText.classList.remove("phase2-opening-sheen");
                void storyText.offsetWidth;
                storyText.classList.add("phase2-opening-sheen");
                streamStoryText(scenes[0].text);
            }

            // Start dialogue audio precisely as dialogue card glides into place
            setTimeout(() => {
                playDialogue(scenes[0].dialogue);
            }, 320);

            isPhase2Entering = false;
        }, 600);
    }, 1850);
}


// ======================================================
// START STORY (DIRECT ENTRYPOINT)
// ======================================================

function startStory() {
    if (storyStarted) {
        return;
    }

    console.log("COREBOUND STORY STARTED");

    // Stop and release intro ambient audio
    fadeAndStopIntroAmbient(300);

    // Clear any level ambient flag
    sessionStorage.removeItem('story_ambient_active');
    sessionStorage.removeItem('story_ambient_time');

    // Immediately hide first/intro screen
    if (introScreen) {
        introScreen.style.display = "none";
    }

    startPhase2Entrance();
}


// ======================================================
// AAA QUANTUM LOADING SCREEN CONTROLLER
// Handles futuristic charging audio, dynamic HUD logs,
// precision progress bar, and optical warp flash transitions
// ======================================================

let isLoadingActive = false;

function playLoadingSynthesizedAudio() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return { triggerChime: () => {} };
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }

        // 1. Futuristic Quantum Charging Drone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(75, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 2.0);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 2.0);

        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.35);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.8);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 2.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 2.35);

        // 2. Resonant Celestial Chime at 100%
        const triggerChime = () => {
            try {
                const now = ctx.currentTime;
                const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Celestial Major Chord)
                freqs.forEach((freq, idx) => {
                    const cOsc = ctx.createOscillator();
                    const cGain = ctx.createGain();
                    cOsc.type = 'sine';
                    cOsc.frequency.setValueAtTime(freq, now + idx * 0.035);

                    cGain.gain.setValueAtTime(0.08, now + idx * 0.035);
                    cGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.035 + 1.2);

                    cOsc.connect(cGain);
                    cGain.connect(ctx.destination);

                    cOsc.start(now + idx * 0.035);
                    cOsc.stop(now + idx * 0.035 + 1.25);
                });
            } catch (e) {}
        };

        return { triggerChime };
    } catch (e) {
        return { triggerChime: () => {} };
    }
}

function triggerLoadingScreen(options = {}) {
    if (isLoadingActive) return;
    isLoadingActive = true;

    const mode = options.mode || 'story'; // 'story' or 'level'
    const onComplete = options.onComplete || (() => {});

    if (!cbLoadingScreen) {
        isLoadingActive = false;
        onComplete();
        return;
    }

    // Immediately hide the first screen so it never flashes or shows when loading finishes
    if (introScreen) {
        introScreen.style.display = "none";
    }

    // Configure text diagnostics based on destination
    if (mode === 'story') {
        if (loadingBadge) loadingBadge.textContent = "CHRONICLE AWAKENING";
        if (loadingTitle) loadingTitle.textContent = "SYNCHRONIZING ARCHIVES";

        // Stop intro ambient audio immediately
        fadeAndStopIntroAmbient(300);
        sessionStorage.removeItem('story_ambient_active');
        sessionStorage.removeItem('story_ambient_time');

        // Pre-warm Scene 0 behind the loading screen with zero flicker
        storyStarted = true;
        currentScene = 0;
        storyBg.style.backgroundImage = `url("${scenes[0].image}")`;
        storyBg.classList.remove("scene-fade-out");
        storyText.textContent = "";
        // Keep HUD hidden until Phase 2 prologue animation finishes
        if (nextTrigger) nextTrigger.classList.remove("visible");
        if (skipButton) skipButton.classList.remove("visible");
        createDots();
        updateDots();
    } else {
        if (loadingBadge) loadingBadge.textContent = "CELESTIAL WARP TRANSIT";
        if (loadingTitle) loadingTitle.textContent = "WARPING TO WORLD MAP";

        // Preserve ambient playback state for seamless level.html continuation
        sessionStorage.setItem('story_ambient_active', 'true');
        sessionStorage.setItem('story_ambient_time', introAmbientAudio.currentTime.toString());
    }

    // Dynamic status log messages
    const statusLogs = mode === 'story' ? [
        "CALIBRATING QUANTUM MEMORY MATRIX...",
        "DECODING PRECURSOR SCRIPTURES...",
        "AWAKENING SCENIC CONSCIOUSNESS...",
        "CHRONICLES SYNCHRONIZED. ENTERING WORLD..."
    ] : [
        "BYPASSING CHRONICLES ARCHIVE...",
        "CALCULATING ORBITAL WARP VECTORS...",
        "CONNECTING TO AETHERIA LEVEL NEXUS...",
        "WARP CONDUIT STABLE. TRANSFERRING..."
    ];

    const speedSamples = ["8.4 GB/s", "12.8 GB/s", "16.4 GB/s", "24.9 GB/s"];

    // Reset visual elements
    if (loadingProgressFill) loadingProgressFill.style.width = "0%";
    if (loadingPercent) loadingPercent.textContent = "0%";
    if (loadingStatusText) loadingStatusText.textContent = statusLogs[0];
    if (loadingSpeed) loadingSpeed.textContent = speedSamples[0];
    if (loadingFlash) loadingFlash.classList.remove("flash");

    cbLoadingScreen.classList.remove("fade-out");
    cbLoadingScreen.classList.add("active");

    // Start synthesized charging audio
    const audioEffects = playLoadingSynthesizedAudio();

    // Animate progress smoothly over 2.3 seconds
    const startTime = performance.now();
    const duration = 2300; // ms

    const updateFrame = (currentTime) => {
        const elapsed = currentTime - startTime;
        const rawProgress = Math.min(1, elapsed / duration);

        // Cubic ease-out curve for natural acceleration then settle
        const easeProgress = 1 - Math.pow(1 - rawProgress, 2.2);
        const percent = Math.floor(easeProgress * 100);

        if (loadingProgressFill) loadingProgressFill.style.width = `${percent}%`;
        if (loadingPercent) loadingPercent.textContent = `${percent}%`;

        // Update status messages dynamically
        if (percent < 30) {
            if (loadingStatusText) loadingStatusText.textContent = statusLogs[0];
            if (loadingSpeed) loadingSpeed.textContent = speedSamples[0];
        } else if (percent < 65) {
            if (loadingStatusText) loadingStatusText.textContent = statusLogs[1];
            if (loadingSpeed) loadingSpeed.textContent = speedSamples[1];
        } else if (percent < 90) {
            if (loadingStatusText) loadingStatusText.textContent = statusLogs[2];
            if (loadingSpeed) loadingSpeed.textContent = speedSamples[2];
        } else {
            if (loadingStatusText) loadingStatusText.textContent = statusLogs[3];
            if (loadingSpeed) loadingSpeed.textContent = speedSamples[3];
        }

        if (rawProgress < 1) {
            requestAnimationFrame(updateFrame);
        } else {
            // Reached 100%!
            if (loadingProgressFill) loadingProgressFill.style.width = "100%";
            if (loadingPercent) loadingPercent.textContent = "100%";
            if (loadingStatusText) loadingStatusText.textContent = statusLogs[3];

            // Trigger harmonic completion chime
            audioEffects.triggerChime();

            if (mode === 'level') {
                // For Skip Story: smoothly dissolve loading screen and route to Sentinel Auth / Calibration / World Map
                cbLoadingScreen.classList.add("fade-out");
                setTimeout(() => {
                    cbLoadingScreen.classList.remove("active");
                    cbLoadingScreen.classList.remove("fade-out");
                    isLoadingActive = false;
                    if (window.COREBOUND_AUTH && window.COREBOUND_AUTH.handleStoryComplete) {
                        window.COREBOUND_AUTH.handleStoryComplete();
                    } else {
                        window.location.href = "level.html";
                    }
                }, 380);
                return;
            }

            // For Begin Story: Dissolve loading screen smoothly into Phase 2 Entrance sequence
            setTimeout(() => {
                cbLoadingScreen.classList.add("fade-out");

                // Launch the premium Phase 2 cinematic entrance & prologue
                startPhase2Entrance();

                setTimeout(() => {
                    cbLoadingScreen.classList.remove("active");
                    cbLoadingScreen.classList.remove("fade-out");
                    isLoadingActive = false;
                    onComplete();
                }, 520);
            }, 100);
        }
    };

    requestAnimationFrame(updateFrame);
}


// ======================================================
// BUTTON INTERACTIONS (FIRST SCREEN)
// ======================================================

if (btnBeginStory) {
    btnBeginStory.addEventListener("click", (event) => {
        event.stopPropagation();
        playClickSound();

        // Trigger cinematic quantum loading screen before beginning the story
        triggerLoadingScreen({
            mode: 'story'
        });
    });
}

window.startOpeningStory = function() {
    if (btnBeginStory) {
        btnBeginStory.click();
    }
};

function skipToLevel() {
    // 1. Immediately stop & reset all story audio/dialogue tracks
    try {
        dialogueAudio.pause();
        dialogueAudio.currentTime = 0;
        dialogueAudio.src = "";
    } catch (e) {}

    try {
        bgAudio.pause();
        bgAudio.currentTime = 0;
        bgAudio.src = "";
    } catch (e) {}

    if ('speechSynthesis' in window) {
        try {
            window.speechSynthesis.cancel();
        } catch (e) {}
    }

    // 2. Halt typing intervals & prevent further scene progression
    if (typeInterval) {
        clearInterval(typeInterval);
        typeInterval = null;
    }
    isTyping = false;
    isChangingScene = true;
    isPhase2Entering = false;
    storyStarted = false;

    // 3. Hide story HUD immediately
    if (nextTrigger) nextTrigger.classList.remove("visible");
    if (skipButton) skipButton.classList.remove("visible");

    // 4. Trigger the cinematic quantum loading screen to transition to level.html
    triggerLoadingScreen({
        mode: 'level'
    });
}

if (btnSkipIntro) {
    btnSkipIntro.addEventListener("click", (event) => {
        event.stopPropagation();
        playClickSound();
        skipToLevel();
    });
}

// ======================================================
// SKIP STORY (DURING MAIN STORY PLAYBACK)
// ======================================================

if (skipButton) {
    skipButton.addEventListener("click", (event) => {
        event.stopPropagation();
        playClickSound();
        skipToLevel();
    });
}


// ======================================================
// NEXT SCENE TRIGGER / DIALOGUE ADVANCEMENT
// ======================================================

if (nextTrigger) {
    nextTrigger.addEventListener("click", (event) => {
        event.stopPropagation();
        if (isPhase2Entering) return;

        if (isTyping) {
            // Instantly complete current typing on click
            if (typeInterval) {
                clearInterval(typeInterval);
                typeInterval = null;
            }
            isTyping = false;
            storyText.textContent = scenes[currentScene].text;
        } else {
            playClickSound();
            nextScene();
        }
    });
}


// ======================================================
// DIALOGUE NAVIGATION BUTTONS (< PREV and > NEXT)
// ======================================================

if (btnStoryNext) {
    btnStoryNext.addEventListener("click", (event) => {
        event.stopPropagation();
        if (isPhase2Entering) return;

        playClickSound();

        if (isTyping) {
            // Instantly complete current typing on click
            if (typeInterval) {
                clearInterval(typeInterval);
                typeInterval = null;
            }
            isTyping = false;
            storyText.textContent = scenes[currentScene].text;
        } else {
            nextScene();
        }
    });
}

if (btnStoryPrev) {
    btnStoryPrev.addEventListener("click", (event) => {
        event.stopPropagation();
        if (isPhase2Entering || currentScene <= 0) return;

        playClickSound();

        if (typeInterval) {
            clearInterval(typeInterval);
            typeInterval = null;
        }
        isTyping = false;

        prevScene();
    });
}


// ======================================================
// FINISH STORY
// ======================================================

function finishStory(immediate = false) {
    window._COREBOUND_STORY_FINISHED = true;

    console.log(
        "COREBOUND STORY COMPLETE"
    );

    dialogueAudio.pause();

    bgAudio.pause();

    if (immediate) {
        setTimeout(() => {
            if (window.COREBOUND_AUTH && window.COREBOUND_AUTH.handleStoryComplete) {
                window.COREBOUND_AUTH.handleStoryComplete();
            } else {
                window.location.href = "level.html";
            }
        }, 120);
        return;
    }

    storyText.textContent =
        "THE FINAL GUARDIAN OF KNOWLEDGE";

    storyBg.classList.add(
        "story-complete"
    );

    setTimeout(() => {
        if (window.COREBOUND_AUTH && window.COREBOUND_AUTH.handleStoryComplete) {
            window.COREBOUND_AUTH.handleStoryComplete();
        } else {
            window.location.href = "level.html";
        }
    }, 1800);
}


// ======================================================
// INITIALIZATION
// ======================================================

createDots();
updateNavButtons();


// ======================================================
// FIRST SCREEN BACKGROUND SETUP
// Sets the cinematic first background initially.
// ======================================================

storyBg.style.backgroundImage =
    `url("assets/background/first_background.png")`;

storyText.textContent = "";