/**
 * ==========================================================================
 * COREBOUND — CHAPTER 1: PATTERN OBSERVATORY
 * Multi-Format Mission Engine & Story Cutscene Voice System (ch1_missions.js)
 * Grounded in Corebound Lore & 4 Original Guardians (Nova, Byte, Echo, Blaze)
 * ==========================================================================
 */

(function () {
    'use strict';

    // ==========================================================================
    // 1. CHAPTER 1 MAIN PROLOGUE & PER-MISSION CUTSCENE DIALOGUES
    // ==========================================================================
    const CHAPTER1_PROLOGUE_SCRIPT = [
        {
            guardianId: "nova",
            speaker: "NOVA",
            symbol: "🧭",
            expression: "leader",
            audioSrc: "assets/audio/cutscenes/ch1_cutscene_01_nova.mp3",
            text: "खिलाड़ी... देखो। यही है माउंट ल्यूमिना के शिखर पर स्थित पैटर्न ऑब्ज़र्वेटरी। कभी यहीं से प्राचीन सभ्यता ने ब्रह्मांड के रहस्यमय पैटर्न को समझने की कोशिश की थी। और इसी जगह पर... द कोर का पहला और सबसे शक्तिशाली प्रेडिक्शन इंजन बनाया गया था।"
        },
        {
            guardianId: "byte",
            speaker: "BYTE",
            symbol: "🤖",
            expression: "alert",
            audioSrc: "assets/audio/cutscenes/ch1_cutscene_02_byte.mp3",
            text: "डायग्नोस्टिक अलर्ट। ऑब्ज़र्वेटरी के मुख्य सिस्टम निष्क्रिय हैं। पाँच बड़े सिस्टम... पूरी तरह ऑफलाइन।"
        },
        {
            guardianId: "echo",
            speaker: "ECHO",
            symbol: "📡",
            expression: "serene",
            audioSrc: "assets/audio/cutscenes/ch1_cutscene_03_echo.mp3",
            text: "मुझे इसकी ऊर्जा महसूस हो रही है... ये जगह अभी भी जीवित है। लेकिन इसकी रेज़ोनेंस... बिखर चुकी है।"
        },
        {
            guardianId: "blaze",
            speaker: "BLAZE",
            symbol: "⚔️",
            expression: "combat_ready",
            audioSrc: "assets/audio/cutscenes/ch1_cutscene_04_blaze.mp3",
            text: "तो फिर इसे वापस जगाना होगा। जो भी इसके अंदर छिपा है... हम उसका सामना करेंगे।"
        },
        {
            guardianId: "nova",
            speaker: "NOVA",
            symbol: "🧭",
            expression: "inspiring",
            audioSrc: "assets/audio/cutscenes/ch1_cutscene_05_nova.mp3",
            text: "चलो। पहले पता लगाते हैं कि यहाँ हुआ क्या है।"
        }
    ];

    const CHAPTER1_MISSION_CUTSCENES = {
        1: {
            title: "Mission 1: Awaken the Pattern Lens",
            start: [
                { 
                    guardianId: "nova", 
                    speaker: "NOVA", 
                    symbol: "🧭", 
                    expression: "leader",
                    audioSrc: "assets/audio/cutscenes/ch1_m1_start_1_nova.mp3",
                    text: "यह है Pattern Lens। इसके बिना Observatory ब्रह्मांड के पैटर्न को समझ नहीं सकता।" 
                },
                { 
                    guardianId: "byte", 
                    speaker: "BYTE", 
                    symbol: "🤖", 
                    expression: "analyzing",
                    audioSrc: "assets/audio/cutscenes/ch1_m1_start_2_byte.mp3",
                    text: "जाँच पूरी हुई। Pattern Lens पूरी तरह निष्क्रिय है। इसके नंबर सीरीज़ पैटर्न को पहचानकर इसे सक्रिय करना होगा।" 
                },
                { 
                    guardianId: "echo", 
                    speaker: "ECHO", 
                    symbol: "📡", 
                    expression: "channeling",
                    audioSrc: "assets/audio/cutscenes/ch1_m1_start_3_echo.mp3",
                    text: "इसमें अभी भी हल्की अनुनाद ऊर्जा मौजूद है... हमें बस सही क्रिस्टल जोड़कर इसे जागृत करना होगा।" 
                }
            ],
            complete: [
                { 
                    guardianId: "nova", 
                    speaker: "NOVA", 
                    symbol: "🧭", 
                    expression: "triumphant",
                    audioSrc: "assets/audio/cutscenes/ch1_m1_complete_1_nova.mp3",
                    text: "Pattern Lens फिर से सक्रिय हो गया।" 
                },
                { 
                    guardianId: "byte", 
                    speaker: "BYTE", 
                    symbol: "🤖", 
                    expression: "logic_solved",
                    audioSrc: "assets/audio/cutscenes/ch1_m1_complete_2_byte.mp3",
                    text: "नंबर सीरीज़ का समन्वय सफल रहा।" 
                },
                { 
                    guardianId: "echo", 
                    speaker: "ECHO", 
                    symbol: "📡", 
                    expression: "joy",
                    audioSrc: "assets/audio/cutscenes/ch1_m1_complete_3_echo.mp3",
                    text: "अब मैं Observatory के भीतर ऊर्जा का प्रवाह स्पष्ट रूप से महसूस कर सकती हूँ।" 
                },
                { 
                    guardianId: "nova", 
                    speaker: "NOVA", 
                    symbol: "🧭", 
                    expression: "inspiring",
                    audioSrc: "assets/audio/cutscenes/ch1_m1_complete_4_nova.mp3",
                    text: "शानदार। अब अगले तंत्र Gyro Engine को कैलिब्रेट करते हैं।" 
                }
            ]
        },
        2: {
            title: "Mission 2: Calibrate Gyroscopic Engine",
            start: [
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "Pattern Lens जागृत हो चुका है, लेकिन उसकी ऊर्जा स्थिर नहीं है।" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "alert", text: "मैंने असामान्य कंपन का स्रोत खोज लिया है। Gyro Engine की frequency असंतुलित है।" },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "channeling", text: "इंजन की धड़कन सुनो... इसकी गति सही लय में नहीं है।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "Gyro Engine को उसकी सही frequency पर calibrate करो। Observatory की ऊर्जा तभी स्थिर रहेगी।" }
            ],
            complete: [
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "triumphant", text: "Gyro Engine स्थिर हो गया।" },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "joy", text: "उसकी ऊर्जा अब Observatory के अगले तंत्र तक पहुँच रही है।" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "analyzing", text: "Auxiliary Power Grid प्रतिक्रिया दे रहा है।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "inspiring", text: "तो अगला मार्ग खुल गया। चलो Power Grid को सक्रिय करते हैं।" }
            ]
        },
        3: {
            title: "Mission 3: Activate Auxiliary Power Grid",
            start: [
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "alert", text: "Auxiliary Power Grid को ऊर्जा मिल रही है, लेकिन उसकी input सीमा सुरक्षित स्तर पर नहीं है।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "अगर हमने सही मात्रा में ऊर्जा नहीं भेजी, तो पूरा grid overload हो सकता है।" },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "channeling", text: "Power conduits तैयार हैं... लेकिन उन्हें उतनी ही ऊर्जा चाहिए जितनी system स्वीकार कर सकता है।" },
                { guardianId: "blaze", speaker: "BLAZE", symbol: "⚔️", expression: "combat_ready", text: "Power cells सामने हैं। सही cell चुनो और grid से connect करो।" }
            ],
            complete: [
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "logic_solved", text: "Auxiliary Power Grid stabilized." },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "joy", text: "ऊर्जा अब Exchange Terminal तक पहुँच चुकी है।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "inspiring", text: "अब हमारा अगला लक्ष्य Energy Exchange Terminal है।" }
            ]
        },
        4: {
            title: "Mission 4: Calculate Energy Yield Margin",
            start: [
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "Energy Exchange Terminal तक पहुँच गए हैं। लेकिन exchange system अभी locked है।" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "alert", text: "Terminal एक energy core की लागत और निर्धारित profit rate दिखा रहा है।" },
                { guardianId: "blaze", speaker: "BLAZE", symbol: "⚔️", expression: "shielding", text: "मतलब हमें पता लगाना होगा कि इसे exchange में किस final price पर register करना है।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "Cost को आधार मानकर profit जोड़ो और सही selling price terminal में set करो।" }
            ],
            complete: [
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "triumphant", text: "Energy Exchange फिर से काम कर रहा है।" },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "channeling", text: "लेकिन इसकी ऊर्जा एक और system तक पहुँच रही है..." },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "alert", text: "Catalyst Core." },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "inspiring", text: "वहाँ energy mixture unstable है। हमें उसे balance करना होगा।" }
            ]
        },
        5: {
            title: "Mission 5: Equalize Quantum Fuel Mixture",
            start: [
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "alert", text: "Catalyst Core तक energy पहुँच चुकी है, लेकिन reaction शुरू नहीं हो रही।" },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "troubled", text: "Mixture chamber में दोनों compounds का संतुलन बिगड़ गया है।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "Catalyst system एक निश्चित ratio में काम करता है।" },
                { guardianId: "blaze", speaker: "BLAZE", symbol: "⚔️", expression: "combat_ready", text: "Fuel cylinders तैयार हैं। सही मात्रा वाला catalyst चुनो और chamber में डालो।" }
            ],
            complete: [
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "triumphant", text: "Catalyst Core stabilize हो गया।" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "analyzing", text: "लेकिन इससे जुड़े generator pods में flux अभी भी असंतुलित है।" },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "serene", text: "चारों pods अलग-अलग ऊर्जा भेज रहे हैं..." },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "तो अगला कदम स्पष्ट है। हमें उनका संतुलन ढूँढना होगा।" }
            ]
        },
        6: {
            title: "Mission 6: Balance Multi-Pod Flux",
            start: [
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "channeling", text: "Generator Pods की ऊर्जा एक समान नहीं है।" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "analyzing", text: "Central synchronization beam को सभी pods के combined output का औसत चाहिए।" },
                { guardianId: "blaze", speaker: "BLAZE", symbol: "⚔️", expression: "combat_ready", text: "सही balance point खोजो और beam को उसी node पर lock करो।" }
            ],
            complete: [
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "triumphant", text: "Generator network फिर से संतुलित है।" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "alert", text: "लेकिन synchronization ने एक buried system को activate कर दिया है।" },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "channeling", text: "मैं पानी की आवाज़ सुन सकती हूँ..." },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "Hydro-Pump Matrix." }
            ]
        },
        7: {
            title: "Mission 7: Synchronize Conduit Dual Pumps",
            start: [
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "Hydro-Pump Matrix reservoir को भरने की कोशिश कर रहा है, लेकिन flow बहुत धीमा है।" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "tech_guide", text: "दो independent pumps उपलब्ध हैं। दोनों अलग-अलग rate पर काम करते हैं।" },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "serene", text: "अगर दोनों एक साथ काम करें, तो reservoir जल्दी भर सकता है।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "inspiring", text: "उनकी combined work rate निर्धारित करो और system को बताओ कि reservoir कब पूर्ण होगा।" }
            ],
            complete: [
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "logic_solved", text: "Hydro-Pump synchronization complete." },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "inspiring", text: "अब Observatory की outer systems फिर से सक्रिय हो रही हैं।" },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "channeling", text: "और एक signal बाहर की ओर जा रहा है।" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "alert", text: "Orbital beacon." },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "उस signal को intercept करो।" }
            ]
        },
        8: {
            title: "Mission 8: Intercept Orbital Beacon",
            start: [
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "troubled", text: "वह signal Observatory से बाहर निकल रहा है।" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "analyzing", text: "Recon drone ने beacon की ओर trajectory lock की है।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "अगर beacon की exact distance मिल जाए, तो हम उसका signal intercept कर सकते हैं।" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "tech_guide", text: "Drone की speed और travel time navigation console पर उपलब्ध हैं।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "inspiring", text: "पहले time की unit को सही रूप में बदलो। फिर distance calculate करके cipher dial lock करो।" }
            ],
            complete: [
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "channeling", text: "इस signal के पीछे एक और frequency छिपी हुई थी..." },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "alert", text: "Quantum Vault से आ रही है।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "तो अब हमें पता लगाना होगा कि वहाँ कौन-सा signal हमें बुला रहा है।" }
            ]
        },
        9: {
            title: "Mission 9: Decode Quantum Resonance Chance",
            start: [
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "tech_guide", text: "Quantum Vault खुल गया है, लेकिन इसके अंदर कई resonance crystals active हैं।" },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "channeling", text: "हर crystal का signal अलग probability pattern बना रहा है।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "हमें Gold resonance का chance determine करना होगा, तभी vault का prediction channel unlock होगा।" },
                { guardianId: "blaze", speaker: "BLAZE", symbol: "⚔️", expression: "combat_ready", text: "Vault को सही probability signal दो और resonance core को activate करो।" }
            ],
            complete: [
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "logic_solved", text: "Prediction Engine signal restored." },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "troubled", text: "नहीं... कुछ और भी जाग गया है।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "alert", text: "क्या?" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "alert", text: "Guardian Atlas।" },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "troubled", text: "उसकी energy... सामान्य नहीं है।" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "alert", text: "Atlas shield पर external lock detected।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "NULL।" },
                { guardianId: "blaze", speaker: "BLAZE", symbol: "⚔️", expression: "combat_ready", text: "तो आखिरकार वह सामने आ ही गया।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "inspiring", text: "Team, तैयार हो जाओ। हमें Atlas को मुक्त करना होगा।" }
            ]
        },
        10: {
            title: "Mission 10: Liberate Guardian Atlas",
            start: [
                { guardianId: "blaze", speaker: "BLAZE", symbol: "⚔️", expression: "combat_ready", text: "Atlas की Null Armor बहुत मजबूत है... एक अकेले attack से यह नहीं टूटेगी।" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "alert", text: "उसके चारों ओर 3 elemental resonance nodes detected हैं।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "हमें एक साथ 3-Hit Combo Strike execute करनी होगी — Blaze की अग्नि, Byte का voltage multiplier, और मेरा cosmic overdrive!" },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "channeling", text: "तीनों attacks की शक्ति chain में जुड़ेगी... तभी Null barrier shatter होगा!" },
                { guardianId: "blaze", speaker: "BLAZE", symbol: "⚔️", expression: "hyped", text: "Team तैयार है! Combo chain को lock करो और Atlas को मुक्त करो!" }
            ],
            complete: [
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "logic_solved", text: "External corruption disconnected." },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "joy", text: "Guardian Atlas... मुक्त हो गया है।" },
                { guardianId: "blaze", speaker: "BLAZE", symbol: "⚔️", expression: "hyped", text: "हमने उसे वापस पा लिया।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "triumphant", text: "और हमने Pattern Observatory की सभी प्रमुख systems को फिर से सक्रिय कर दिया।" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "alert", text: "लेकिन एक समस्या है।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "क्या?" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "analyzing", text: "Atlas की memory में एक corrupted transmission मिला है।" },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "troubled", text: "वह Observatory से नहीं आया था..." },
                { guardianId: "blaze", speaker: "BLAZE", symbol: "⚔️", expression: "combat_ready", text: "तो कहाँ से आया?" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "alert", text: "Logic Nexus." },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "leader", text: "मतलब यह सिर्फ Pattern Observatory पर हमला नहीं था।" },
                { guardianId: "echo", speaker: "ECHO", symbol: "📡", expression: "channeling", text: "Corruption आगे बढ़ चुका है।" },
                { guardianId: "nova", speaker: "NOVA", symbol: "🧭", expression: "inspiring", text: "फिर हमारी यात्रा यहीं खत्म नहीं होती।" },
                { guardianId: "byte", speaker: "BYTE", symbol: "🤖", expression: "tech_guide", text: "Chapter 2 destination identified." }
            ]
        }
    };

    // ==========================================================================
    // 1.5. GAMEPLAY TACTICAL DIRECTIVES & REACTIVE DIALOGUES (All 10 Missions)
    // Clean & Concise: Short Start Directive, Short Success/Error Dialogues,
    // and Pure Variable/Formula Logic Hints without answer spoilers.
    // ==========================================================================
    const CHAPTER1_GAMEPLAY_DIRECTIVES = {
        1: {
            start: {
                guardianId: "byte",
                expr: "analyzing",
                mood: "TACTICAL DIRECTIVE",
                speaker: "BYTE // DIRECTIVE",
                text: "Crystal Rack में एक resonance slot खाली है। सही crystal खोजकर उसे Lens से जोड़ो।"
            },
            error: {
                guardianId: "byte",
                expr: "alert",
                mood: "WARNING ALERT",
                speaker: "BYTE // DIAGNOSTIC",
                text: "Resonance sequence invalid."
            },
            success: {
                guardianId: "echo",
                expr: "joy",
                mood: "HARMONIC RESONANCE",
                speaker: "ECHO // SUCCESS",
                text: "Pattern Lens जाग उठा है।"
            },
            hint: {
                guardianId: "echo",
                expr: "serene",
                mood: "HARMONIC HINT",
                speaker: "ECHO // GUIDANCE",
                text: "Find the step differences: Δ₁ = T₂ - T₁. Observe how the gaps grow (Δ[next] = 2 × Δ[prev]). Then: T[next] = T[last] + Δ[next]."
            }
        },
        2: {
            start: {
                guardianId: "byte",
                expr: "tech_guide",
                mood: "TACTICAL DIRECTIVE",
                speaker: "BYTE // DIRECTIVE",
                text: "Calibration console active है। इसके readings को समझकर tuning dial को सही स्थिति में लाओ।"
            },
            error: {
                guardianId: "byte",
                expr: "alert",
                mood: "WARNING ALERT",
                speaker: "BYTE // DIAGNOSTIC",
                text: "Frequency अभी सही resonance range में नहीं है।"
            },
            success: {
                guardianId: "echo",
                expr: "joy",
                mood: "HARMONIC HARMONY",
                speaker: "ECHO // SUCCESS",
                text: "इंजन की लय अब स्थिर हो गई है।"
            },
            hint: {
                guardianId: "nova",
                expr: "inspiring",
                mood: "TACTICAL HINT",
                speaker: "NOVA // GUIDANCE",
                text: "Follow BODMAS strictly: 1. Brackets ( ) → 2. Division (÷) → 3. Multiplication (×) → 4. Addition / Subtraction (+ / -) left to right."
            }
        },
        3: {
            start: {
                guardianId: "byte",
                expr: "alert",
                mood: "TACTICAL DIRECTIVE",
                speaker: "BYTE // DIRECTIVE",
                text: "Grid capacity और required percentage console पर दिखाई दे रहे हैं।"
            },
            error: {
                guardianId: "byte",
                expr: "alert",
                mood: "WARNING ALERT",
                speaker: "BYTE // DIAGNOSTIC",
                text: "Energy output required level से match नहीं कर रहा।"
            },
            success: {
                guardianId: "blaze",
                expr: "combat_ready",
                mood: "POWER RESTORED",
                speaker: "BLAZE // SUCCESS",
                text: "Power flow locked! Grid फिर से जाग उठा है।"
            },
            hint: {
                guardianId: "byte",
                expr: "analyzing",
                mood: "TECH HINT",
                speaker: "BYTE // GUIDANCE",
                text: "To find P% of Total Capacity C: Required Power = (P ÷ 100) × C."
            }
        },
        4: {
            start: {
                guardianId: "byte",
                expr: "tech_guide",
                mood: "TACTICAL DIRECTIVE",
                speaker: "BYTE // DIRECTIVE",
                text: "Trade terminal active है। Cost और profit data को देखकर final selling price निर्धारित करो।"
            },
            error: {
                guardianId: "byte",
                expr: "alert",
                mood: "WARNING ALERT",
                speaker: "BYTE // DIAGNOSTIC",
                text: "Selling price सही नहीं है। Profit को cost के आधार पर फिर से जाँचो।"
            },
            success: {
                guardianId: "nova",
                expr: "triumphant",
                mood: "TRADE UNLOCKED",
                speaker: "NOVA // SUCCESS",
                text: "Exchange value accepted. Energy trade channel खुल गया है।"
            },
            hint: {
                guardianId: "byte",
                expr: "tech_guide",
                mood: "TECH HINT",
                speaker: "BYTE // GUIDANCE",
                text: "1. Profit Amount = (Profit % ÷ 100) × CP → 2. Selling Price (SP) = CP + Profit Amount."
            }
        },
        5: {
            start: {
                guardianId: "byte",
                expr: "analyzing",
                mood: "TACTICAL DIRECTIVE",
                speaker: "BYTE // DIRECTIVE",
                text: "Required ratio और total mixture volume control panel पर उपलब्ध हैं।"
            },
            error: {
                guardianId: "echo",
                expr: "troubled",
                mood: "BALANCE WARNING",
                speaker: "ECHO // DIAGNOSTIC",
                text: "Mixture का balance अभी सही नहीं है।"
            },
            success: {
                guardianId: "echo",
                expr: "serene",
                mood: "HARMONIC BALANCE",
                speaker: "ECHO // SUCCESS",
                text: "दोनों compounds अब सही संतुलन में बह रहे हैं।"
            },
            hint: {
                guardianId: "echo",
                expr: "serene",
                mood: "HARMONIC HINT",
                speaker: "ECHO // GUIDANCE",
                text: "For ratio A : B and Total Volume V: Total Parts = A + B. Then Volume of B = (B ÷ (A + B)) × V."
            }
        },
        6: {
            start: {
                guardianId: "byte",
                expr: "analyzing",
                mood: "TACTICAL DIRECTIVE",
                speaker: "BYTE // DIRECTIVE",
                text: "सभी generator outputs सामने हैं। उनका combined flux समझकर सही balance node चुनो।"
            },
            error: {
                guardianId: "byte",
                expr: "alert",
                mood: "WARNING ALERT",
                speaker: "BYTE // DIAGNOSTIC",
                text: "Flux alignment गलत है। सही balance point खोजो।"
            },
            success: {
                guardianId: "blaze",
                expr: "proud_smirk",
                mood: "SYNC LOCKED",
                speaker: "BLAZE // SUCCESS",
                text: "Target locked! सभी generator pods synchronize हो गए।"
            },
            hint: {
                guardianId: "byte",
                expr: "analyzing",
                mood: "TECH HINT",
                speaker: "BYTE // GUIDANCE",
                text: "Average = (Sum of all pod values) ÷ (Total number of pods)."
            }
        },
        7: {
            start: {
                guardianId: "byte",
                expr: "tech_guide",
                mood: "TACTICAL DIRECTIVE",
                speaker: "BYTE // DIRECTIVE",
                text: "दोनों pumps की work rates console पर उपलब्ध हैं। उन्हें साथ में calculate करके completion time निर्धारित करो।"
            },
            error: {
                guardianId: "byte",
                expr: "alert",
                mood: "WARNING ALERT",
                speaker: "BYTE // DIAGNOSTIC",
                text: "Combined work rate सही नहीं है। दोनों pumps की rates को साथ में देखो।"
            },
            success: {
                guardianId: "echo",
                expr: "joy",
                mood: "RHYTHM RESTORED",
                speaker: "ECHO // SUCCESS",
                text: "Reservoir भर गया। दोनों pumps अब एक ही rhythm में चल रहे हैं।"
            },
            hint: {
                guardianId: "nova",
                expr: "leader",
                mood: "TACTICAL HINT",
                speaker: "NOVA // GUIDANCE",
                text: "If Pump 1 takes A hours and Pump 2 takes B hours: Combined Time = (A × B) ÷ (A + B)."
            }
        },
        8: {
            start: {
                guardianId: "byte",
                expr: "tech_guide",
                mood: "TACTICAL DIRECTIVE",
                speaker: "BYTE // DIRECTIVE",
                text: "Navigation data active है। Speed और travel time को देखकर drone की travel distance निर्धारित करो।"
            },
            error: {
                guardianId: "byte",
                expr: "alert",
                mood: "WARNING ALERT",
                speaker: "BYTE // DIAGNOSTIC",
                text: "Trajectory distance गलत है। Navigation data को फिर से जाँचो।"
            },
            success: {
                guardianId: "nova",
                expr: "triumphant",
                mood: "BEACON LOCKED",
                speaker: "NOVA // SUCCESS",
                text: "Beacon locked. Signal हमारे नियंत्रण में है।"
            },
            hint: {
                guardianId: "byte",
                expr: "tech_guide",
                mood: "TECH HINT",
                speaker: "BYTE // GUIDANCE",
                text: "1. Convert minutes to hours: T = minutes ÷ 60. 2. Distance = Speed × T."
            }
        },
        9: {
            start: {
                guardianId: "byte",
                expr: "analyzing",
                mood: "TACTICAL DIRECTIVE",
                speaker: "BYTE // DIRECTIVE",
                text: "Active crystals की distribution सामने है। Gold resonance का chance calculate करके core में set करो।"
            },
            error: {
                guardianId: "byte",
                expr: "alert",
                mood: "WARNING ALERT",
                speaker: "BYTE // DIAGNOSTIC",
                text: "Resonance probability सही नहीं है। Active crystal का chance फिर से calculate करो।"
            },
            success: {
                guardianId: "echo",
                expr: "serene",
                mood: "SIGNAL SYNCHRONIZED",
                speaker: "ECHO // SUCCESS",
                text: "Resonance synchronized है... Vault ने अपना signal खोल दिया।"
            },
            hint: {
                guardianId: "blaze",
                expr: "combat_ready",
                mood: "TACTICAL HINT",
                speaker: "BLAZE // GUIDANCE",
                text: "Probability % = (Favorable Outcomes ÷ Total Outcomes) × 100."
            }
        },
        10: {
            start: {
                guardianId: "blaze",
                expr: "combat_ready",
                mood: "TACTICAL COMBO",
                speaker: "BLAZE // DIRECTIVE",
                text: "Atlas की Null Shield सक्रिय है! Tactical equation solve करके power calibrate करो और fire strike launch करो!"
            },
            error: {
                guardianId: "byte",
                expr: "alert",
                mood: "WARNING ALERT",
                speaker: "BYTE // DIAGNOSTIC",
                text: "Calculated power deflection detected! Current phase equation को BODMAS rule के अनुसार solve करो।"
            },
            success: {
                guardianId: "blaze",
                expr: "hyped",
                mood: "SHIELD SHATTERED",
                speaker: "BLAZE // SUCCESS",
                text: "CRITICAL BREAK! Grand Overdrive ने Null Armor को नष्ट कर दिया! Atlas मुक्त हो गया है!"
            },
            hint: {
                guardianId: "nova",
                expr: "inspiring",
                mood: "HEROIC HINT",
                speaker: "NOVA // GUIDANCE",
                text: "BODMAS Rule: पहले Brackets हल करो, फिर Division/Multiplication, और अंत में Addition!"
            }
        }
    };

    // ==========================================================================
    // DEMO-ONLY FALLBACK SOLUTIONS (UNAUTHENTICATED GUEST MODE ONLY)
    // NEVER loaded or accessed by authenticated production gameplay
    // ==========================================================================
    const DEMO_MODE_FALLBACK_SOLUTIONS = Object.freeze({
        1: { correctAnswer: "159", acceptedAnswers: ["159", 159] },
        2: { correctAnswer: "37", acceptedAnswers: ["37", 37] },
        3: { correctAnswer: "140 MW", acceptedAnswers: ["140 MW", "140", 140] },
        4: { correctAnswer: "500", acceptedAnswers: ["500", "500 UNITS", 500] },
        5: { correctAnswer: "210 L", acceptedAnswers: ["210 L", "210", 210] },
        6: { correctAnswer: "T2", acceptedAnswers: ["T2", "200 MW", "200", 200] },
        7: { correctAnswer: "4", acceptedAnswers: ["4", 4, "4 Hours", "4 hrs"] },
        8: { correctAnswer: "60", acceptedAnswers: ["60", 60, "60 km", "60 KM", "60km", "60KM"] },
        9: { correctAnswer: "35", acceptedAnswers: ["35", 35, "35%", "7/20"] },
        10: { correctAnswer: "104", acceptedAnswers: ["104", 104, "104 GW", "104GW", "104 gw", "104gw", "104 Gw"] }
    });

    // ==========================================================================
    // 2. DATA: 10 DIVERSE STORY MISSIONS FOR CHAPTER 1 (PRESENTATION & NARRATIVE)
    // ==========================================================================
    const CHAPTER_MISSIONS = [
        // --- MISSION 1: NUMBER SERIES ---
        {
            id: 1,
            chamber: "SYSTEM: PATTERN LENS",
            title: "AWAKEN THE PATTERN LENS",
            format: "NUMBER SERIES",
            directive: "The Pattern Lens is offline. To reactivate it, place the correct energy crystal. Each crystal in the rack is labeled with a power signature. Examine the pattern of active crystals (4 → 9 → 19 → 39 → 79 → ?) and find the missing crystal with the correct resonance value.",
            guardianId: "echo",
            guardianSymbol: "📡",
            speaker: "ECHO // RESONANCE GUARDIAN",
            speech: "The Pattern Lens is dormant. One resonance crystal is missing from the rack. Examine the sequence pattern — each value follows a progression rule. Drag the correct crystal into the empty slot to restore the lens!",
            actionLabel: "AWAKEN PATTERN LENS →",
            formatType: "interactive_scene",
            data: {
                sequence: [4, 9, 19, 39, 79],
                targetIndex: 5,
                stepRule: "T[n] = 2 × T[n-1] + 1",
                formulaDisplay: "4 → 9 → 19 → 39 → 79 → [ ? ]",
                formulaHint: "Sequence Rule: T[n] = 2 × T[n-1] + 1",
                sceneStatusText: "PATTERN LENS — OFFLINE",
                crystals: [
                    { id: "c139", label: "139", correct: false },
                    { id: "c149", label: "149", correct: false },
                    { id: "c159", label: "159", correct: true },
                    { id: "c169", label: "169", correct: false }
                ]
            },

            explanation: "Each term is twice the previous term plus 1: (79 × 2) + 1 = 159.",
            xpReward: 200
        },

        // --- MISSION 2: SIMPLIFICATION ---
        {
            id: 2,
            chamber: "SYSTEM: GYRO ENGINE",
            title: "CALIBRATE GYROSCOPIC ENGINE",
            format: "SIMPLIFICATION",
            directive: "The Gyro Engine's frequency controls are misaligned. Use the rotary tuning dial to set the frequency to the correct value. Calculate the engine's optimal frequency from the console expression using BODMAS order of operations.",
            guardianId: "byte",
            guardianSymbol: "🤖",
            speaker: "BYTE // TECHNICAL ANALYZER",
            speech: "Gyroscopic Engine frequency is unstable! The console shows an arithmetic expression — evaluate it using BODMAS and align the rotary calibrator to lock the correct frequency.",
            actionLabel: "CALIBRATE GYRO ENGINE →",
            formatType: "interactive_scene_dial",
            data: {
                min: 10,
                max: 80,
                step: 1,
                initial: 25,
                formulaDisplay: "(120 ÷ 6) + (4 × 8) - 15",
                formulaHint: "BODMAS: Divide first → Multiply → Add/Subtract left-to-right",
                sceneStatusText: "GYRO ENGINE — UNBALANCED",
                step1: "120 ÷ 6 = 20",
                step2: "4 × 8 = 32",
                step3: "20 + 32 - 15 = 37",
                quickPresets: [27, 37, 47, 57]
            },

            explanation: "(120 ÷ 6 = 20) + (4 × 8 = 32) - 15 = 20 + 32 - 15 = 37.",
            xpReward: 200
        },

        // --- MISSION 3: PERCENTAGE ---
        {
            id: 3,
            chamber: "SYSTEM: ENERGY MATRIX",
            title: "ACTIVATE AUXILIARY POWER GRID",
            format: "PERCENTAGE",
            directive: "The Auxiliary Power Grid needs precisely 35% of its 400 MW total capacity to avoid overload. Select and connect the power cell that supplies the exact required energy to ignite the conduit channels.",
            guardianId: "echo",
            guardianSymbol: "📡",
            speaker: "ECHO // RESONANCE GUARDIAN",
            speech: "The power grid is decoupled! Calculate 35% of 400 MW and connect the matching power cell. Too much or too little will cause grid instability!",
            actionLabel: "ACTIVATE POWER GRID →",
            formatType: "interactive_scene_nodes",
            data: {
                totalCapacity: "400 MW",
                percentageRequired: "35%",
                formulaDisplay: "35% of 400 MW",
                formulaHint: "Required MW = (P% ÷ 100) × Total Capacity",
                sceneStatusText: "POWER GRID — DECOUPLED",
                leftNodes: [
                    { id: "L1", label: "GRID SECTOR A", targetMatch: "R2", desc: "Auxiliary Sub-Grid" },
                    { id: "L2", label: "REACTOR CORE", targetMatch: "R2", desc: "Total Capacity: 400 MW" },
                    { id: "L3", label: "CONDUIT RELAY", targetMatch: "R2", desc: "Target: 35% Capacity" }
                ],
                cells: [
                    { id: "cell_100", label: "100 MW", pct: "25%", correct: false },
                    { id: "cell_120", label: "120 MW", pct: "30%", correct: false },
                    { id: "cell_140", label: "140 MW", pct: "35%", correct: true },
                    { id: "cell_160", label: "160 MW", pct: "40%", correct: false }
                ],
                quickOptions: ["100 MW", "120 MW", "140 MW", "160 MW"]
            },

            explanation: "35% of 400 MW = (35 ÷ 100) × 400 = 140 MW.",
            xpReward: 250
        },

        // --- MISSION 4: PROFIT & LOSS ---
        {
            id: 4,
            chamber: "SYSTEM: ENERGY EXCHANGE",
            title: "CALCULATE ENERGY YIELD MARGIN",
            format: "PROFIT & LOSS",
            directive: "The Energy Exchange Terminal shows an energy core at Cost Price (CP) of 400 Units. To meet the required 25% profit margin, calculate the correct Selling Price and authorize the matching trade manifest.",
            guardianId: "blaze",
            guardianSymbol: "⚔️",
            speaker: "BLAZE // COMBAT DEFENDER",
            speech: "The exchange terminal requires a profitable trade! CP is 400 Units with a +25% margin. Calculate SP = CP + Profit and select the correct trade manifest to unlock the terminal!",
            actionLabel: "AUTHORIZE TRADE CONTRACT →",
            formatType: "interactive_scene_keypad",
            data: {
                costPrice: "400 UNITS",
                profitMargin: "+25%",
                formulaDisplay: "SP = CP + (Profit% × CP)",
                formulaHint: "SP = CP + (Profit% ÷ 100) × CP",
                sceneStatusText: "ENERGY EXCHANGE — LOCKED",
                contracts: [
                    { id: "contract_450", code: "MANIFEST α", label: "450 UNITS", margin: "+12.5% YIELD", profit: "+50 U Profit", icon: "💎", correct: false },
                    { id: "contract_480", code: "MANIFEST β", label: "480 UNITS", margin: "+20.0% YIELD", profit: "+80 U Profit", icon: "💠", correct: false },
                    { id: "contract_500", code: "MANIFEST γ", label: "500 UNITS", margin: "+25.0% YIELD", profit: "+100 U Profit", icon: "👑", correct: true },
                    { id: "contract_520", code: "MANIFEST δ", label: "520 UNITS", margin: "+30.0% YIELD", profit: "+120 U Profit", icon: "✨", correct: false }
                ],
                unit: "UNITS"
            },

            explanation: "Profit = 25% of 400 = 100. Selling Price (SP) = 400 + 100 = 500 Units.",
            xpReward: 250
        },

        // --- MISSION 5: RATIO & PROPORTION ---
        {
            id: 5,
            chamber: "SYSTEM: CATALYST CORE",
            title: "EQUALIZE QUANTUM FUEL MIXTURE",
            format: "RATIO & PROPORTION",
            directive: "The Catalyst Core requires mixing Liquid Plasma A and Catalyst B in a precise 5:7 ratio. For a total synthesis batch of 360 Litres, determine the exact volume of Catalyst B needed and insert the corresponding cylinder.",
            guardianId: "nova",
            guardianSymbol: "🧭",
            speaker: "NOVA // EXPEDITION LEADER",
            speech: "The fuel mixture is uncalibrated! Ratio A:B = 5:7 in a 360L batch. Calculate Catalyst B's exact volume and insert the matching cylinder to stabilize the core!",
            actionLabel: "EQUALIZE FUEL RATIO →",
            formatType: "interactive_scene_cells",
            data: {
                ratio: "5 : 7",
                totalVolume: "360 L",
                componentA: "Plasma A (5 parts)",
                componentB: "Catalyst B (7 parts)",
                formulaDisplay: "Catalyst B = (7 ÷ 12) × 360 L",
                formulaHint: "Component B = [B ÷ (A + B)] × Total Volume",
                sceneStatusText: "CATALYST CORE — UNCALIBRATED",
                cells: [
                    { id: "cell_180", label: "180 L", ratio: "5:5", correct: false },
                    { id: "cell_195", label: "195 L", ratio: "6.5:5.5", correct: false },
                    { id: "cell_210", label: "210 L", ratio: "5:7 Target", correct: true },
                    { id: "cell_225", label: "225 L", ratio: "4.5:7.5", correct: false }
                ]
            },

            explanation: "Total ratio parts = 5 + 7 = 12. Volume of Catalyst B = (7 ÷ 12) × 360 L = 210 L.",
            xpReward: 250
        },

        // --- MISSION 6: AVERAGE ---
        {
            id: 6,
            chamber: "SYSTEM: FLUX EQUILIBRIUM",
            title: "BALANCE MULTI-POD FLUX",
            format: "AVERAGE",
            directive: "Four generator pods are outputting 140 MW, 180 MW, 210 MW, and 270 MW. The central synchronization beam requires the average flux value. Select the target node that matches the required mean flux to balance equilibrium.",
            guardianId: "blaze",
            guardianSymbol: "⚔️",
            speaker: "BLAZE // COMBAT DEFENDER",
            speech: "Pod outputs are imbalanced! Calculate the arithmetic mean of all four generators and fire the sync beam at the matching equilibrium node!",
            actionLabel: "BALANCE MULTI-POD FLUX →",
            formatType: "interactive_scene_tiles",
            data: {
                podValues: [140, 180, 210, 270],
                totalSum: 800,
                podCount: 4,
                formulaDisplay: "Mean = (140 + 180 + 210 + 270) ÷ 4",
                formulaHint: "Average = (Sum of all pod values) ÷ Number of pods",
                sceneStatusText: "FLUX EQUILIBRIUM — IMBALANCED",
                targets: [
                    { id: "T1", label: "NODE ALPHA", val: "185 MW", desc: "Under-capacity", correct: false },
                    { id: "T2", label: "NODE BETA", val: "200 MW", desc: "Equilibrium Mean", correct: true },
                    { id: "T3", label: "NODE GAMMA", val: "215 MW", desc: "Over-capacity", correct: false },
                    { id: "T4", label: "NODE DELTA", val: "230 MW", desc: "Surge Level", correct: false }
                ]
            },

            explanation: "Average Flux = (140 + 180 + 210 + 270) ÷ 4 = 800 ÷ 4 = 200 MW (Node Beta).",
            xpReward: 250
        },

        // --- MISSION 7: TIME & WORK ---
        {
            id: 7,
            chamber: "SYSTEM: HYDRO-PUMP MATRIX",
            title: "SYNCHRONIZE CONDUIT DUAL PUMPS",
            format: "TIME & WORK",
            directive: "Coolant Pump A fills the reservoir in 12 hours, and Pump B fills it in 6 hours. Both pumps will operate simultaneously. Calculate how long they take to fill the reservoir together and enter the total time into the terminal.",
            guardianId: "byte",
            guardianSymbol: "🤖",
            speaker: "BYTE // TECHNICAL ANALYZER",
            speech: "The coolant system is out of sync! Pump A takes 12 hrs alone, Pump B takes 6 hrs alone. Calculate the combined fill time when both operate together and enter it into the terminal!",
            actionLabel: "SYNCHRONIZE HYDRO PUMPS →",
            formatType: "interactive_scene_terminal",
            data: {
                pumpATime: "12 Hours",
                pumpBTime: "6 Hours",
                formulaDisplay: "1/T = 1/12 + 1/6 = 3/12 = 1/4 → T = 4 Hours",
                formulaHint: "Combined Time T = (T₁ × T₂) ÷ (T₁ + T₂)",
                sceneStatusText: "HYDRO-PUMPS — DESYNCED",
                unit: "HOURS",
                quickOptions: ["3", "4", "6", "8"]
            },

            explanation: "Combined rate = 1/12 + 1/6 = 3/12 = 1/4. Total time required = 4 Hours.",
            xpReward: 250
        },

        // --- MISSION 8: TIME-SPEED-DISTANCE ---
        {
            id: 8,
            chamber: "SYSTEM: WARP TRAJECTORY",
            title: "INTERCEPT ORBITAL BEACON",
            format: "TIME-SPEED-DISTANCE",
            directive: "A recon drone is heading towards the orbital beacon at a constant speed of 90 km/h. It has been flying for 40 minutes. Calculate the intercept distance in kilometers and set the cipher dial to lock the trajectory code.",
            guardianId: "echo",
            guardianSymbol: "📡",
            speaker: "ECHO // RESONANCE GUARDIAN",
            speech: "The drone trajectory is unaligned! Speed = 90 km/h, flight time = 40 minutes. Convert time to hours, calculate Distance = Speed × Time, and set the cipher dial to lock the intercept code!",
            actionLabel: "ENGAGE WARP INTERCEPT →",
            formatType: "interactive_scene_cipher",
            data: {
                speed: "90 km/h",
                time: "40 min (2/3 hr)",
                formulaDisplay: "Distance = 90 km/h × (40/60 hr) = 60 km",
                formulaHint: "Distance = Speed × Time (convert minutes to hours: t ÷ 60)",
                sceneStatusText: "WARP TRAJECTORY — UNALIGNED",
                targetTens: 6,
                targetOnes: 0,
                quickPresets: ["45", "54", "60", "75"]
            },

            explanation: "Distance = Speed × Time = 90 × (40 ÷ 60) = 90 × (2 ÷ 3) = 60 km.",
            xpReward: 250
        },

        // --- MISSION 9: PROBABILITY ---
        {
            id: 9,
            chamber: "SYSTEM: QUANTUM VAULT",
            title: "DECODE QUANTUM RESONANCE CHANCE",
            format: "PROBABILITY",
            directive: "The Quantum Matrix Vault contains a mix of crystals: 8 Blue, 5 Red, and 7 Gold (total 20). Calculate the probability of drawing a Gold crystal as a percentage and set the resonance dial to dock the probability core.",
            guardianId: "nova",
            guardianSymbol: "🧭",
            speaker: "NOVA // EXPEDITION LEADER",
            speech: "The vault holds 8 Blue, 5 Red, and 7 Gold crystals — 20 total. Calculate the chance of selecting a Gold crystal as a percentage and dock the probability core!",
            actionLabel: "HARMONIZE PROBABILITY →",
            formatType: "interactive_scene_cubes",
            data: {
                blueCount: 8,
                redCount: 5,
                goldCount: 7,
                totalCount: 20,
                formulaDisplay: "P(Gold) = 7 ÷ 20 = 35%",
                formulaHint: "P(E) = Favorable ÷ Total × 100%",
                sceneStatusText: "QUANTUM VAULT — SEALED",
                cubes: [
                    { id: "cube_blue", val: 8, label: "8 BLUE (40%)", name: "CRYSTAL ALPHA" },
                    { id: "cube_red", val: 5, label: "5 RED (25%)", name: "CRYSTAL BETA" },
                    { id: "cube_gold", val: 7, label: "7 GOLD (35%)", name: "CRYSTAL GAMMA" }
                ],
                quickOptions: ["25", "30", "35", "40"]
            },

            explanation: "Probability P(Gold) = 7 ÷ 20 = 0.35 = 35%.",
            xpReward: 300
        },

        // --- MISSION 10: 3-HIT ELEMENTAL COMBO STRIKE (BOSS CLIMAX) ---
        {
            id: 10,
            chamber: "SYSTEM: PREDICTION ENGINE",
            title: "LIBERATE GUARDIAN ATLAS // BOSS CLIMAX",
            format: "3-HIT ELEMENTAL COMBO STRIKE",
            directive: "Guardian Atlas has awakened under NULL corruption! Execute the progressive 3-phase hero strike sequence using multi-step BODMAS calculations to shatter Atlas's barrier!",
            guardianId: "blaze",
            guardianSymbol: "⚔️",
            speaker: "NOVA & BLAZE // GUARDIAN DEFENSE",
            speech: "Atlas की Null Shield सक्रिय है! पहले Blaze का fire strike launch करो!",
            actionLabel: "EXECUTE GRAND BODMAS OVERDRIVE →",
            formatType: "interactive_scene_boss",
            data: {
                blazeBase: 18,
                byteMultiplier: 3,
                novaOverdrive: 24,
                targetComboPower: 104,
                formulaDisplay: "BODMAS OVERDRIVE CHAIN",
                formulaHint: "Solve each phase equation step-by-step using BODMAS rules",
                sceneStatusText: "PREDICTION ENGINE — NULL CORRUPTION",
                durationSeconds: 120,
                quickPresets: ["84", "96", "104", "120"]
            },

            explanation: "Phase 1 = 25 GW -> Phase 2 = 70 GW -> Phase 3 Final Overdrive = {[(70 × 2) - 40] ÷ 5} × 4 + 24 = 104 GW Total Damage.",
            xpReward: 500
        }
    ];

    // ==========================================================================
    // 3. STATE MANAGEMENT
    // ==========================================================================
    const gameState = {
        currentMissionIndex: 0,
        unlockedMissions: [0],
        totalXp: 0,
        isAudioMuted: false,
        bgMusicStarted: false,
        timerInterval: null,
        
        // Cutscene state
        cutsceneIndex: 0,
        activeCutsceneScript: [],
        activeCutsceneCallback: null,
        activeMissionNum: 1,
        activeCutsceneStage: 'start',
        isCutsceneActive: false,
        isAutoPlay: true,
        isTyping: false,
        isVoicePlaying: false,
        fullCurrentText: "",
        typewriterTimer: null,
        autoAdvanceTimer: null,
        autoProgressInterval: null,

        selectedMatchPair: null,
        matchedPairsCount: 0,
        selectedTargetId: null,
        droppedValue: null,

        // Backend gameplay session state (Phase 4 & 5)
        activeGameplaySessionId: null,
        activePlayableChallenge: null,
        activeGameplayType: null,
        activeDifficulty: null,
        isBackendSession: false,
        isGameplayLoading: false,
        isSubmittingAnswer: false,
        missionStartTime: 0,
        // ISSUE 2: Persistent timer epoch (ms) derived from backend started_at
        missionTimerEpoch: null
    };

    // ==========================================================================
    // 4. AUDIO ENGINE & VOICE ACTING SYSTEM
    // ==========================================================================
    const audioCtx = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;
    let bgAudioEl = null;
    const cutsceneVoicePlayer = new Audio();
    let synthVoices = [];
    let activeCutsceneUtterance = null;
    let activeInGameUtterance = null;
    let cutsceneKeepAliveTimer = null;
    let inGameKeepAliveTimer = null;

    function initAudio() {
        bgAudioEl = document.getElementById('bgAudio');
        if (bgAudioEl) {
            bgAudioEl.volume = 0.35;
        }

        if ('speechSynthesis' in window) {
            synthVoices = window.speechSynthesis.getVoices();
            window.speechSynthesis.onvoiceschanged = () => {
                synthVoices = window.speechSynthesis.getVoices();
            };
        }

        const startMusicOnInteraction = function () {
            if (!gameState.bgMusicStarted && bgAudioEl && !gameState.isAudioMuted) {
                bgAudioEl.play().then(() => {
                    gameState.bgMusicStarted = true;
                }).catch(() => {});
            }
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            document.removeEventListener('pointerdown', startMusicOnInteraction);
            document.removeEventListener('keydown', startMusicOnInteraction);
        };

        document.addEventListener('pointerdown', startMusicOnInteraction);
        document.addEventListener('keydown', startMusicOnInteraction);
    }

    function playSfx(type) {
        if (!audioCtx || gameState.isAudioMuted) return;

        try {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'chirp') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(1200, now);
                osc.frequency.exponentialRampToValueAtTime(1600, now + 0.03);
                gain.gain.setValueAtTime(0.035, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
                osc.start(now);
                osc.stop(now + 0.03);
            } else if (type === 'select') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(520, now);
                osc.frequency.exponentialRampToValueAtTime(980, now + 0.09);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
                osc.start(now);
                osc.stop(now + 0.09);
            } else if (type === 'slider') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.linearRampToValueAtTime(440, now + 0.04);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.start(now);
                osc.stop(now + 0.04);
            } else if (type === 'success') {
                const notes = [523.25, 659.25, 783.99, 1046.50];
                notes.forEach((freq, i) => {
                    const o = audioCtx.createOscillator();
                    const g = audioCtx.createGain();
                    o.connect(g);
                    g.connect(audioCtx.destination);
                    o.type = 'triangle';
                    o.frequency.setValueAtTime(freq, now + (i * 0.08));
                    g.gain.setValueAtTime(0.18, now + (i * 0.08));
                    g.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.08) + 0.28);
                    o.start(now + (i * 0.08));
                    o.stop(now + (i * 0.08) + 0.3);
                });
            } else if (type === 'error') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180, now);
                osc.frequency.linearRampToValueAtTime(110, now + 0.2);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            } else if (type === 'warp') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.start(now);
                osc.stop(now + 0.35);
            }
        } catch (e) {
            console.warn("Audio SFX Error:", e);
        }
    }

    function toggleMute() {
        gameState.isAudioMuted = !gameState.isAudioMuted;
        
        if (dom.iconSoundOn && dom.iconSoundOff) {
            dom.iconSoundOn.style.display = gameState.isAudioMuted ? 'none' : 'block';
            dom.iconSoundOff.style.display = gameState.isAudioMuted ? 'block' : 'none';
        }

        if (gameState.isAudioMuted) {
            if (bgAudioEl) bgAudioEl.pause();
            if (cutsceneVoicePlayer) cutsceneVoicePlayer.pause();
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            if (cutsceneKeepAliveTimer) { clearInterval(cutsceneKeepAliveTimer); cutsceneKeepAliveTimer = null; }
            if (inGameKeepAliveTimer) { clearInterval(inGameKeepAliveTimer); inGameKeepAliveTimer = null; }
            if (dom.speechAudioWave) dom.speechAudioWave.classList.remove('speaking');
            gameState.isVoicePlaying = false;
        } else {
            if (bgAudioEl) {
                bgAudioEl.volume = 0.45;
                bgAudioEl.play().catch(() => {});
            }
            playSfx('click');
        }
    }

    function playGuardianVoice(slide, onEndCallback) {
        if (gameState.isAudioMuted) {
            gameState.isVoicePlaying = false;
            if (onEndCallback) onEndCallback();
            return;
        }

        if (cutsceneKeepAliveTimer) {
            clearInterval(cutsceneKeepAliveTimer);
            cutsceneKeepAliveTimer = null;
        }
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        if (cutsceneVoicePlayer) {
            cutsceneVoicePlayer.pause();
            cutsceneVoicePlayer.currentTime = 0;
        }

        if (bgAudioEl && !gameState.isAudioMuted) {
            bgAudioEl.volume = 0.12;
        }

        gameState.isVoicePlaying = true;
        let finished = false;
        const completeVoice = function () {
            if (finished) return;
            finished = true;
            gameState.isVoicePlaying = false;
            if (dom.speechAudioWave) dom.speechAudioWave.classList.remove('speaking');
            if (bgAudioEl && !gameState.isAudioMuted) bgAudioEl.volume = 0.45;
            if (onEndCallback) onEndCallback();
        };

        if (slide.audioSrc) {
            cutsceneVoicePlayer.src = slide.audioSrc;
            cutsceneVoicePlayer.volume = 1.0;
            cutsceneVoicePlayer.onplay = () => { 
                if (dom.speechAudioWave) dom.speechAudioWave.classList.add('speaking'); 
            };
            cutsceneVoicePlayer.onended = () => { completeVoice(); };
            cutsceneVoicePlayer.onerror = () => { 
                speakGuardianFallback(slide.text, slide.guardianId, completeVoice); 
            };

            const playPromise = cutsceneVoicePlayer.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    if (dom.speechAudioWave) dom.speechAudioWave.classList.add('speaking');
                }).catch(() => {
                    // Autoplay waiting for user gesture unlock - keep audio wave ready
                });
            }
        } else {
            speakGuardianFallback(slide.text, slide.guardianId, completeVoice);
        }
    }

    /**
     * Intelligent Voice Selector & Acoustic Profiler
     * Nova: Female Leader (Clear, confident, mid-high pitch)
     * Byte: Male AI (Robotic, analytical low-mid pitch)
     * Echo: Female Mystic (Serene, ethereal harmonic high pitch)
     * Blaze: Male Vanguard (Deep bass, bold heroic warrior pitch)
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
        const femaleHints = ['female', 'swara', 'heera', 'zira', 'samantha', 'victoria', 'jenny', 'aria', 'hazel', 'kavita', 'kalpana', 'aditi', 'raveena', 'ananya', 'shruti', 'sunita', 'geeta', 'veena', 'google हिन्दी', 'female'];
        
        // Male voice name hints
        const maleHints = ['male', 'madhav', 'hemant', 'david', 'mark', 'george', 'guy', 'ryan', 'roger', 'prabhat', 'ravi', 'neerja', 'alok', 'tarun', 'male'];

        let matchedVoice = null;

        if (isDevanagari) {
            // Hindi locale matching
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

        // English/General fallback if no Hindi voice or text in Latin script
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

        // Guardian Persona Tone & Pitch Settings
        let pitch = 1.0;
        let rate = 0.95;

        switch (gid) {
            case 'nova':
                // Female Leader: Confident, crisp, clear mid-high pitch
                pitch = 1.08;
                rate = 0.98;
                break;
            case 'echo':
                // Female Oracle: Ethereal, gentle, harmonic high pitch
                pitch = 1.25;
                rate = 0.90;
                break;
            case 'byte':
                // Male AI Specialist: Analytical, cybernetic, low-mid pitch
                pitch = 0.80;
                rate = 1.04;
                break;
            case 'blaze':
                // Male Vanguard: Deep bass, bold, energetic resonant pitch
                pitch = 0.70;
                rate = 1.00;
                break;
            default:
                pitch = isFemale ? 1.10 : 0.82;
                rate = 0.96;
        }

        return {
            voice: matchedVoice,
            lang: matchedVoice ? matchedVoice.lang : (isDevanagari ? 'hi-IN' : 'en-US'),
            pitch,
            rate
        };
    }

    function speakGuardianFallback(text, guardianId, onEndCallback) {
        if (!('speechSynthesis' in window) || gameState.isAudioMuted) {
            if (onEndCallback) onEndCallback();
            return;
        }

        try {
            if (cutsceneKeepAliveTimer) {
                clearInterval(cutsceneKeepAliveTimer);
                cutsceneKeepAliveTimer = null;
            }
            window.speechSynthesis.cancel();
            
            let executed = false;
            const safeDone = () => {
                if (executed) return;
                executed = true;
                if (cutsceneKeepAliveTimer) {
                    clearInterval(cutsceneKeepAliveTimer);
                    cutsceneKeepAliveTimer = null;
                }
                activeCutsceneUtterance = null;
                window._activeCutsceneUtterance = null;
                if (dom.speechAudioWave) dom.speechAudioWave.classList.remove('speaking');
                if (onEndCallback) onEndCallback();
            };

            setTimeout(() => {
                // Clean punctuation and pauses so Hindi speech synthesis reads cleanly without cutting off
                let cleanText = (text || '')
                    .replace(/["“”«»]/g, '')
                    .replace(/\.{2,}/g, ', ')
                    .replace(/—/g, ', ')
                    .trim();

                if (!cleanText) {
                    safeDone();
                    return;
                }

                const voiceCfg = getGuardianVoiceConfig(guardianId, cleanText);
                const utterance = new SpeechSynthesisUtterance(cleanText);
                
                // Keep global references to prevent Chromium V8 Garbage Collection from cutting off speech
                activeCutsceneUtterance = utterance;
                window._activeCutsceneUtterance = utterance;

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
                    if (cutsceneKeepAliveTimer) clearInterval(cutsceneKeepAliveTimer);
                    cutsceneKeepAliveTimer = setInterval(() => {
                        if (window.speechSynthesis.paused) {
                            window.speechSynthesis.resume();
                        }
                    }, 500);
                };
                utterance.onend = () => { 
                    safeDone();
                };
                utterance.onerror = (err) => { 
                    safeDone();
                };

                // Generous safety timeout: 160ms per character with minimum 14s so long sentences complete fully
                const maxSafetyTime = Math.max(14000, cleanText.length * 160);
                setTimeout(safeDone, maxSafetyTime);

                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                }
                window.speechSynthesis.speak(utterance);
            }, 50);
        } catch (e) {
            console.warn("SpeechSynthesis Exception:", e);
            if (onEndCallback) onEndCallback();
        }
    }

    const dom = {
        stepper: document.getElementById('missionStepper'),
        btnPrev: document.getElementById('btnPrevMission'),
        btnNext: document.getElementById('btnNextMission'),
        counterLabel: document.getElementById('missionCounterLabel'),
        xpDisplay: document.getElementById('xpDisplay') || document.getElementById('xpValue'),
        soundToggle: document.getElementById('btnSoundToggle'),
        btnToggleSound: document.getElementById('btnSoundToggle'),
        iconSoundOn: document.querySelector('.icon-sound-on'),
        iconSoundOff: document.querySelector('.icon-sound-off'),

        chamberBadge: document.getElementById('chamberBadge'),
        formatBadge: document.getElementById('formatBadge'),
        heading: document.getElementById('missionHeading'),
        directive: document.getElementById('missionDirective'),
        machineChassis: document.getElementById('machineChassis'),
        stabilityFill: document.getElementById('stabilityFill'),
        stabilityPctText: document.getElementById('stabilityPctText'),

        guardianCard: document.getElementById('guardianCard'),
        guardianAvatarImg: document.getElementById('guardianAvatarImg'),
        guardianSymbol: document.getElementById('guardianSymbol'),
        guardianMoodTag: document.getElementById('guardianMoodTag'),
        btnCloseComms: document.getElementById('btnCloseComms'),
        btnTriggerComms: document.getElementById('btnTriggerComms'),
        speaker: document.getElementById('dialogueSpeaker'),
        speech: document.getElementById('dialogueSpeech'),
        missionTipBox: document.getElementById('missionTipBox'),
        missionTipText: document.getElementById('missionTipText'),

        heroQuestionCard: document.getElementById('heroQuestionCard') || document.querySelector('.hero-question-card'),
        heroSequenceContainer: document.getElementById('heroSequenceContainer') || document.querySelector('.hero-sequence-container'),

        gameplayStage: document.getElementById('gameplayStage') || document.getElementById('interactiveGameplayStage'),
        feedbackBanner: document.getElementById('feedbackBanner'),
        feedbackMessage: document.getElementById('feedbackMessage'),

        storyCutsceneModal: document.getElementById('storyCutsceneModal'),
        cutsceneVisual: document.getElementById('cutsceneVisual'),
        cutsceneAvatarImg: document.getElementById('cutsceneAvatarImg'),
        cutscenePortrait: document.getElementById('cutscenePortrait'),
        cutsceneSpeakerBadge: document.getElementById('cutsceneSpeakerBadge'),
        cutsceneText: document.getElementById('cutsceneText'),
        cutsceneNextLabel: document.getElementById('cutsceneNextLabel'),
        cutsceneDots: document.getElementById('cutsceneDots'),
        btnNextCutscene: document.getElementById('btnNextCutscene'),
        btnSkipCutscene: document.getElementById('btnSkipCutscene'),
        btnToggleAutoCutscene: document.getElementById('btnToggleAutoCutscene'),
        autoBtnLabel: document.getElementById('autoBtnLabel'),
        autoProgressFill: document.getElementById('autoProgressFill'),
        btnOpenStoryIntro: document.getElementById('btnOpenStoryIntro'),
        speechAudioWave: document.getElementById('speechAudioWave'),

        cutsceneCharacterStage: document.getElementById('cutsceneCharacterStage'),
        cinematicCharLeft: document.getElementById('cinematicCharLeft'),
        cinematicCharRight: document.getElementById('cinematicCharRight'),
        charFullbodyLeft: document.getElementById('charFullbodyLeft'),
        charFullbodyRight: document.getElementById('charFullbodyRight'),

        briefingModal: document.getElementById('missionBriefingModal'),
        briefingSectorTag: document.getElementById('briefingSectorTag'),
        briefingTitle: document.getElementById('briefingTitle'),
        briefingObjectiveText: document.getElementById('briefingObjectiveText'),
        briefingDifficulty: document.getElementById('briefingDifficulty'),
        briefingFormat: document.getElementById('briefingFormat'),
        briefingReward: document.getElementById('briefingReward'),
        btnBeginMission: document.getElementById('btnBeginMission'),

        successModal: document.getElementById('missionSuccessModal'),
        modalSubtitle: document.getElementById('modalSubtitle'),
        modalTitle: document.getElementById('modalTitle'),
        modalXpReward: document.getElementById('modalXpReward'),
        modalCreditsReward: document.getElementById('modalCreditsReward'),
        modalStarsReward: document.getElementById('modalStarsReward'),
        modalUnlockBanner: document.getElementById('modalUnlockBanner'),
        modalNarrative: document.getElementById('modalNarrative'),
        btnModalNext: document.getElementById('btnModalNext'),
        btnModalReturnMap: document.getElementById('btnModalReturnMap'),
        chapterCompleteModal: document.getElementById('chapterCompleteModal')
    };

    // ==========================================================================
    // CINEMATIC FULL-BODY CHARACTER PRESENTATION SYSTEM
    // ==========================================================================
    const CHARACTER_CONFIG = {
        nova: {
            side: 'left',
            name: 'NOVA',
            defaultImage: 'assets/images/characters/nova.png',
            expressions: {
                leader: 'assets/images/characters/expressions/nova_leader.png',
                alert: 'assets/images/characters/expressions/nova_alert.png',
                inspiring: 'assets/images/characters/expressions/nova_inspiring.png',
                triumphant: 'assets/images/characters/expressions/nova_triumphant.png'
            }
        },
        byte: {
            side: 'left',
            name: 'BYTE',
            defaultImage: 'assets/images/characters/byte.png',
            expressions: {
                analyzing: 'assets/images/characters/expressions/byte_analyzing.png',
                alert: 'assets/images/characters/expressions/byte_alert.png',
                logic_solved: 'assets/images/characters/expressions/byte_logic_solved.png',
                tech_guide: 'assets/images/characters/expressions/byte_tech_guide.png'
            }
        },
        echo: {
            side: 'right',
            name: 'ECHO',
            defaultImage: 'assets/images/characters/echo.png',
            expressions: {
                serene: 'assets/images/characters/expressions/echo_serene.png',
                channeling: 'assets/images/characters/expressions/echo_channeling.png',
                troubled: 'assets/images/characters/expressions/echo_troubled.png',
                joy: 'assets/images/characters/expressions/echo_joy.png'
            }
        },
        blaze: {
            side: 'right',
            name: 'BLAZE',
            defaultImage: 'assets/images/characters/blaze.png',
            expressions: {
                combat_ready: 'assets/images/characters/expressions/blaze_combat_ready.png',
                shielding: 'assets/images/characters/expressions/blaze_shielding.png',
                hyped: 'assets/images/characters/expressions/blaze_hyped.png',
                proud_smirk: 'assets/images/characters/expressions/blaze_proud_smirk.png'
            }
        }
    };

    function getGuardianExpressionPath(guardianId, exprType = 'default') {
        const gid = (guardianId || 'nova').toLowerCase();
        const config = CHARACTER_CONFIG[gid] || CHARACTER_CONFIG.nova;
        if (exprType && config.expressions && config.expressions[exprType]) {
            return config.expressions[exprType];
        }
        const moodMap = {
            success: { nova: 'triumphant', byte: 'logic_solved', echo: 'joy', blaze: 'hyped' },
            error: { nova: 'alert', byte: 'alert', echo: 'troubled', blaze: 'shielding' },
            hint: { nova: 'inspiring', byte: 'tech_guide', echo: 'serene', blaze: 'proud_smirk' },
            default: { nova: 'leader', byte: 'tech_guide', echo: 'serene', blaze: 'combat_ready' }
        };
        const mappedExpr = moodMap[exprType]?.[gid] || moodMap.default[gid];
        if (mappedExpr && config.expressions && config.expressions[mappedExpr]) {
            return config.expressions[mappedExpr];
        }
        return config.defaultImage || `assets/images/characters/${gid}_avatar.png`;
    }

    let inGameTypeTimer = null;
    let guardianPopupTimer = null;

    function typeInGameText(fullText) {
        if (inGameTypeTimer) clearInterval(inGameTypeTimer);
        if (!dom.speech) return;
        dom.speech.textContent = '';
        let charIndex = 0;
        inGameTypeTimer = setInterval(() => {
            if (charIndex < fullText.length) {
                dom.speech.textContent += fullText[charIndex];
                charIndex++;
            } else {
                clearInterval(inGameTypeTimer);
                inGameTypeTimer = null;
            }
        }, 14);
    }

    function speakText(text, guardianId = 'nova', onEndCallback = null) {
        if (!('speechSynthesis' in window) || gameState.isAudioMuted || gameState.isCutsceneActive) {
            if (onEndCallback) onEndCallback();
            return;
        }
        try {
            if (inGameKeepAliveTimer) {
                clearInterval(inGameKeepAliveTimer);
                inGameKeepAliveTimer = null;
            }
            window.speechSynthesis.cancel();
            
            let cleanText = (text || '')
                .replace(/["“”«»]/g, '')
                .replace(/\.{2,}/g, ', ')
                .replace(/—/g, ', ')
                .trim();
            if (!cleanText) {
                if (onEndCallback) onEndCallback();
                return;
            }

            let finished = false;
            const handleDone = () => {
                if (finished) return;
                finished = true;
                if (inGameKeepAliveTimer) { clearInterval(inGameKeepAliveTimer); inGameKeepAliveTimer = null; }
                activeInGameUtterance = null;
                window._activeInGameUtterance = null;
                if (dom.speechAudioWave) dom.speechAudioWave.classList.remove('speaking');
                if (onEndCallback) onEndCallback();
            };

            const voiceCfg = getGuardianVoiceConfig(guardianId, cleanText);
            const utterance = new SpeechSynthesisUtterance(cleanText);
            
            activeInGameUtterance = utterance;
            window._activeInGameUtterance = utterance;

            if (voiceCfg.voice) {
                utterance.voice = voiceCfg.voice;
                utterance.lang = voiceCfg.voice.lang || voiceCfg.lang;
            } else {
                utterance.lang = voiceCfg.lang;
            }
            utterance.pitch = voiceCfg.pitch;
            utterance.rate = voiceCfg.rate;

            utterance.onstart = () => {
                if (gameState.isCutsceneActive) {
                    window.speechSynthesis.cancel();
                    handleDone();
                    return;
                }
                if (dom.speechAudioWave) dom.speechAudioWave.classList.add('speaking');
                if (inGameKeepAliveTimer) clearInterval(inGameKeepAliveTimer);
                inGameKeepAliveTimer = setInterval(() => {
                    if (gameState.isCutsceneActive) {
                        window.speechSynthesis.cancel();
                        handleDone();
                        return;
                    }
                    if (window.speechSynthesis.paused) {
                        window.speechSynthesis.resume();
                    }
                }, 500);
            };
            utterance.onend = () => {
                handleDone();
            };
            utterance.onerror = () => {
                handleDone();
            };

            // Generous fallback safety timeout
            const maxSafety = Math.max(14000, cleanText.length * 160);
            setTimeout(handleDone, maxSafety);

            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            }
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn("In-game speech error:", e);
            if (onEndCallback) onEndCallback();
        }
    }

    /**
     * Show reactive, floating Guardian Transmission Popup with Expression Sprite
     * Dynamically calculates readable duration and waits for voice completion before invoking onEndCallback
     */
    function showGuardianPopup(guardianId, expr, text, moodTag = null, speakerTag = null, durationMs = null, onEndCallback = null) {
        if (gameState.isCutsceneActive) {
            hideGuardianPopup();
            if (onEndCallback) onEndCallback();
            return;
        }

        if (guardianPopupTimer) {
            clearTimeout(guardianPopupTimer);
            guardianPopupTimer = null;
        }

        const gid = (guardianId || 'nova').toLowerCase();
        const exprPath = getGuardianExpressionPath(gid, expr || 'default');
        const defaultSpeaker = `${gid.toUpperCase()} // DIRECTIVE`;
        const cleanText = (text || '').trim();

        if (dom.guardianAvatarImg) {
            dom.guardianAvatarImg.src = exprPath;
            dom.guardianAvatarImg.alt = `${gid.toUpperCase()} (${expr})`;
        }

        if (dom.guardianMoodTag) {
            dom.guardianMoodTag.textContent = moodTag || (expr ? expr.toUpperCase() : 'COMMS ACTIVE');
        }

        if (dom.speaker) {
            dom.speaker.textContent = speakerTag || defaultSpeaker;
        }

        let voiceFinished = false;
        let readingTimerFinished = false;
        let isDone = false;

        const checkCompletion = () => {
            if (isDone) return;
            if (voiceFinished && readingTimerFinished) {
                isDone = true;
                hideGuardianPopup();
                if (onEndCallback && typeof onEndCallback === 'function') {
                    onEndCallback();
                }
            }
        };

        if (cleanText) {
            typeInGameText(cleanText);
            speakText(cleanText, gid, () => {
                voiceFinished = true;
                checkCompletion();
            });
        } else {
            voiceFinished = true;
        }

        if (dom.guardianCard) {
            dom.guardianCard.classList.remove('hidden');
            dom.guardianCard.className = `guardian-transmission-popup guardian-${gid}`;
        }

        // Dynamic minimum reading duration: at least 3.5s + 80ms/char
        const minReadDuration = Math.max(3500, cleanText.length * 80);
        const actualDuration = (durationMs && durationMs > 0) ? Math.max(durationMs, minReadDuration) : minReadDuration;

        guardianPopupTimer = setTimeout(() => {
            readingTimerFinished = true;
            checkCompletion();
        }, actualDuration);
    }

    function hideGuardianPopup() {
        if (guardianPopupTimer) {
            clearTimeout(guardianPopupTimer);
            guardianPopupTimer = null;
        }
        if (dom.guardianCard) {
            dom.guardianCard.classList.add('hidden');
        }
    }

    function triggerGuardianHint() {
        const mission = CHAPTER_MISSIONS[gameState.currentMissionIndex];
        if (!mission) return;
        if (gameState.isBackendSession) {
            playSfx('select');
            const gid = (mission && mission.guardianId) || 'nova';
            const speaker = (mission && mission.speaker) || `${gid.toUpperCase()} // GUIDANCE`;
            const hintText = gameState.lastServerFeedback
                ? `Diagnostic Telemetry: ${gameState.lastServerFeedback}`
                : `Tactical Directive: ${dom.directive ? dom.directive.textContent : 'Analyze the active energy sequence and align the calibration parameters.'}`;
            showGuardianPopup(gid, 'analyzing', hintText, gameState.lastServerFeedback ? 'DIAGNOSTIC HINT' : 'TACTICAL HINT', speaker, 6000);
            return;
        }
        const directiveData = CHAPTER1_GAMEPLAY_DIRECTIVES[mission.id] || CHAPTER1_GAMEPLAY_DIRECTIVES[1];
        const hintObj = directiveData.hint || directiveData.start;
        playSfx('select');
        showGuardianPopup(hintObj.guardianId, hintObj.expr, hintObj.text, hintObj.mood, hintObj.speaker, 6000);
    }

    function updateGuardianAvatarMood(mood = 'default') {
        const mission = CHAPTER_MISSIONS[gameState.currentMissionIndex];
        if (!mission) return;
        const gid = mission.guardianId || 'nova';
        const newSrc = getGuardianExpressionPath(gid, mood);
        if (dom.guardianAvatarImg) {
            dom.guardianAvatarImg.src = newSrc;
        }
    }

    let activeCharacterState = {
        currentSpeakerId: null,
        currentSide: null,
        currentExpression: null,
        switchTimeout: null
    };

    function resetCharacterStage() {
        if (activeCharacterState.switchTimeout) {
            clearTimeout(activeCharacterState.switchTimeout);
            activeCharacterState.switchTimeout = null;
        }
        activeCharacterState.currentSpeakerId = null;
        activeCharacterState.currentSide = null;
        activeCharacterState.currentExpression = null;

        if (dom.cinematicCharLeft) {
            dom.cinematicCharLeft.className = 'cinematic-char-actor char-side-left hidden';
        }
        if (dom.cinematicCharRight) {
            dom.cinematicCharRight.className = 'cinematic-char-actor char-side-right hidden';
        }
    }

    function transitionCharacterToSpeaker(guardianId, expression = null) {
        const charId = (guardianId || 'nova').toLowerCase();
        const nextConfig = CHARACTER_CONFIG[charId] || CHARACTER_CONFIG.nova;
        const nextSide = nextConfig.side; // 'left' or 'right'

        if (activeCharacterState.switchTimeout) {
            clearTimeout(activeCharacterState.switchTimeout);
            activeCharacterState.switchTimeout = null;
        }

        const prevSpeakerId = activeCharacterState.currentSpeakerId;
        const prevSide = activeCharacterState.currentSide;
        const prevExpr = activeCharacterState.currentExpression;

        // If the same character is speaking consecutive slides with same expression, keep active
        if (prevSpeakerId === charId && prevExpr === expression) {
            const actor = (nextSide === 'left') ? dom.cinematicCharLeft : dom.cinematicCharRight;
            if (actor && !actor.classList.contains('fade-in')) {
                actor.className = `cinematic-char-actor char-side-${nextSide} expr-${expression || 'default'} fade-in`;
            }
            return;
        }

        // If same character with new expression, update sprite image directly with a smooth micro-dissolve
        if (prevSpeakerId === charId && prevExpr !== expression) {
            showNextSpeaker(charId, nextConfig, expression);
            return;
        }

        // If another character is currently active, fade them out first
        if (prevSpeakerId && prevSide) {
            const prevActor = (prevSide === 'left') ? dom.cinematicCharLeft : dom.cinematicCharRight;
            if (prevActor) {
                prevActor.className = `cinematic-char-actor char-side-${prevSide} fade-out`;
            }

            // Wait for smooth fade-out (~380ms), then enter the new character
            activeCharacterState.switchTimeout = setTimeout(() => {
                if (!gameState.isCutsceneActive) return;
                
                // Hide previous actor
                if (prevActor) {
                    prevActor.className = `cinematic-char-actor char-side-${prevSide} hidden`;
                }

                // Fade in next speaker
                showNextSpeaker(charId, nextConfig, expression);
            }, 380);
        } else {
            // First speaker entering the cutscene
            showNextSpeaker(charId, nextConfig, expression);
        }
    }

    function showNextSpeaker(guardianId, config, expression = null) {
        const side = config.side;
        const actor = (side === 'left') ? dom.cinematicCharLeft : dom.cinematicCharRight;
        const img = (side === 'left') ? dom.charFullbodyLeft : dom.charFullbodyRight;
        const oppositeActor = (side === 'left') ? dom.cinematicCharRight : dom.cinematicCharLeft;

        // Ensure opposite side is hidden
        if (oppositeActor) {
            oppositeActor.className = `cinematic-char-actor char-side-${side === 'left' ? 'right' : 'left'} hidden`;
        }

        if (actor && img) {
            let targetSrc = config.defaultImage;
            if (expression && config.expressions && config.expressions[expression]) {
                targetSrc = config.expressions[expression];
            }

            img.onerror = () => {
                img.onerror = null;
                img.src = config.defaultImage;
            };

            img.src = targetSrc;
            img.alt = `${config.name} (${expression || 'default'})`;
            actor.className = `cinematic-char-actor char-side-${side} expr-${expression || 'default'}`;
            
            // Trigger reflow for smooth transition
            void actor.offsetWidth;
            actor.classList.add('fade-in');
        }

        activeCharacterState.currentSpeakerId = guardianId;
        activeCharacterState.currentSide = side;
        activeCharacterState.currentExpression = expression;
    }

    function init() {
        if ('speechSynthesis' in window) {
            synthVoices = window.speechSynthesis.getVoices();
            window.speechSynthesis.onvoiceschanged = () => {
                synthVoices = window.speechSynthesis.getVoices();
            };
        }
        initAudio();
        
        let highestUnlocked = 1;
        try {
            const raw = localStorage.getItem('cb_ch1_progress');
            if (raw) {
                const stored = JSON.parse(raw);
                if (stored && Array.isArray(stored.completedMissions)) {
                    highestUnlocked = stored.highestUnlocked || 1;
                    gameState.unlockedMissions = [];
                    for (let i = 0; i < highestUnlocked && i < CHAPTER_MISSIONS.length; i++) {
                        gameState.unlockedMissions.push(i);
                    }
                    gameState.totalXp = stored.totalXp || 0;
                    if (dom.xpDisplay) dom.xpDisplay.textContent = `+${gameState.totalXp} XP`;
                }
            }
        } catch (e) {}

        if (window.cbApi && typeof window.cbApi.isAuthenticated === 'function' && window.cbApi.isAuthenticated()) {
            fetchBackendMissions();
        }

        buildStepper();
        setupGlobalEvents();

        const urlParams = new URLSearchParams(window.location.search);
        const missionParam = parseInt(urlParams.get('mission'), 10);
        let targetIndex = (!isNaN(missionParam) && missionParam >= 1 && missionParam <= 10) ? (missionParam - 1) : 0;
        // ISSUE 1 FIX: When authenticated, trust the URL param directly.
        // The backend enforces access control on /gameplay/start, so we do not need
        // to gate here based on potentially stale localStorage state.
        // For unauthenticated/guest mode, apply the localStorage unlock gate as before.
        const isAuthenticated = window.cbApi && typeof window.cbApi.isAuthenticated === 'function' && window.cbApi.isAuthenticated();
        if (!isAuthenticated && !gameState.unlockedMissions.includes(targetIndex)) {
            targetIndex = gameState.unlockedMissions[gameState.unlockedMissions.length - 1] || 0;
        }

        loadMission(targetIndex, false);

        const introSeen = sessionStorage.getItem('corebound_ch1_intro_seen');
        if (!introSeen && targetIndex === 0) {
            openPrologueCutscene(() => {
                openMissionCutscene(1, 'start', () => {
                    triggerStartDirective(1);
                });
            });
        } else {
            openMissionCutscene(targetIndex + 1, 'start', () => {
                triggerStartDirective(targetIndex + 1);
            });
        }
    }

    function openPrologueCutscene(onComplete = null) {
        clearCutsceneTimers();
        resetCharacterStage();
        hideGuardianPopup();
        if (cutsceneVoicePlayer) { cutsceneVoicePlayer.pause(); cutsceneVoicePlayer.currentTime = 0; }
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        if (inGameKeepAliveTimer) { clearInterval(inGameKeepAliveTimer); inGameKeepAliveTimer = null; }
        activeInGameUtterance = null;
        window._activeInGameUtterance = null;

        gameState.activeMissionNum = 0;
        gameState.activeCutsceneStage = 'prologue';
        gameState.activeCutsceneScript = CHAPTER1_PROLOGUE_SCRIPT;
        gameState.activeCutsceneCallback = onComplete || null;
        gameState.cutsceneIndex = 0;
        gameState.isCutsceneActive = true;

        buildCutsceneDots();
        if (dom.storyCutsceneModal) {
            dom.storyCutsceneModal.classList.add('active');
            dom.storyCutsceneModal.setAttribute('aria-hidden', 'false');
            dom.storyCutsceneModal.style.display = 'flex';
            dom.storyCutsceneModal.style.visibility = 'visible';
            dom.storyCutsceneModal.style.opacity = '1';
            dom.storyCutsceneModal.style.pointerEvents = 'all';
        }
        renderCutsceneSlide(0);
    }

    function openMissionCutscene(missionNum, stage = 'start', onComplete = null) {
        clearCutsceneTimers();
        resetCharacterStage();
        hideGuardianPopup();
        if (cutsceneVoicePlayer) { cutsceneVoicePlayer.pause(); cutsceneVoicePlayer.currentTime = 0; }
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        if (inGameKeepAliveTimer) { clearInterval(inGameKeepAliveTimer); inGameKeepAliveTimer = null; }
        activeInGameUtterance = null;
        window._activeInGameUtterance = null;

        const missionCutscenes = CHAPTER1_MISSION_CUTSCENES[missionNum];
        if (!missionCutscenes || !missionCutscenes[stage] || missionCutscenes[stage].length === 0) {
            if (onComplete && typeof onComplete === 'function') onComplete();
            return;
        }

        gameState.activeMissionNum = missionNum;
        gameState.activeCutsceneStage = stage;
        gameState.activeCutsceneScript = missionCutscenes[stage];
        gameState.activeCutsceneCallback = onComplete || null;
        gameState.cutsceneIndex = 0;
        gameState.isCutsceneActive = true;

        buildCutsceneDots();
        if (dom.storyCutsceneModal) {
            dom.storyCutsceneModal.classList.add('active');
            dom.storyCutsceneModal.setAttribute('aria-hidden', 'false');
            dom.storyCutsceneModal.style.display = 'flex';
            dom.storyCutsceneModal.style.visibility = 'visible';
            dom.storyCutsceneModal.style.opacity = '1';
            dom.storyCutsceneModal.style.pointerEvents = 'all';
        }
        renderCutsceneSlide(0);
    }

    function closeCutscene(playWarp = true) {
        clearCutsceneTimers();
        resetCharacterStage();
        if (cutsceneVoicePlayer) { cutsceneVoicePlayer.pause(); cutsceneVoicePlayer.currentTime = 0; }
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        if (dom.speechAudioWave) dom.speechAudioWave.classList.remove('speaking');
        
        if (bgAudioEl && !gameState.isAudioMuted) bgAudioEl.volume = 0.45;

        gameState.isCutsceneActive = false;
        if (dom.storyCutsceneModal) {
            dom.storyCutsceneModal.classList.remove('active');
            dom.storyCutsceneModal.setAttribute('aria-hidden', 'true');
            dom.storyCutsceneModal.style.display = '';
            dom.storyCutsceneModal.style.visibility = '';
            dom.storyCutsceneModal.style.opacity = '';
            dom.storyCutsceneModal.style.pointerEvents = '';
        }
        sessionStorage.setItem('corebound_ch1_intro_seen', 'true');
        if (playWarp) playSfx('warp');

        if (!gameState.bgMusicStarted && bgAudioEl && !gameState.isAudioMuted) {
            bgAudioEl.play().then(() => { gameState.bgMusicStarted = true; }).catch(() => {});
        }

        const cb = gameState.activeCutsceneCallback;
        gameState.activeCutsceneCallback = null;
        if (cb && typeof cb === 'function') {
            cb();
        }
    }

    function clearCutsceneTimers() {
        if (gameState.typewriterTimer) clearInterval(gameState.typewriterTimer);
        if (gameState.autoAdvanceTimer) clearTimeout(gameState.autoAdvanceTimer);
        if (gameState.autoProgressInterval) clearInterval(gameState.autoProgressInterval);
        if (dom.autoProgressFill) dom.autoProgressFill.style.width = '0%';
    }

    function buildCutsceneDots() {
        dom.cutsceneDots.innerHTML = '';
        const slides = gameState.activeCutsceneScript || [];
        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = `cutscene-dot ${idx === 0 ? 'active' : ''}`;
            dom.cutsceneDots.appendChild(dot);
        });
    }

    function renderCutsceneSlide(index) {
        clearCutsceneTimers();
        gameState.cutsceneIndex = index;
        const slides = gameState.activeCutsceneScript || [];
        const slide = slides[index];
        if (!slide) return;

        if (dom.cutsceneSpeakerBadge) {
            dom.cutsceneSpeakerBadge.textContent = slide.speaker;
            dom.cutsceneSpeakerBadge.className = `cutscene-speaker-badge speaker-${slide.guardianId || 'nova'}`;
        }
        gameState.fullCurrentText = slide.text;

        // Cinematic Character Dialogue Fade Presentation
        transitionCharacterToSpeaker(slide.guardianId);

        // Dynamic Cutscene Background (Prologue vs Missions)
        const cutsceneBgPan = dom.storyCutsceneModal ? dom.storyCutsceneModal.querySelector('.cutscene-bg-pan') : null;
        if (cutsceneBgPan) {
            if (gameState.activeCutsceneStage === 'prologue') {
                cutsceneBgPan.style.backgroundImage = "url('assets/images/ch_bg/ch1_bg.png')";
            } else {
                const missionBgNum = gameState.activeMissionNum || (gameState.currentMissionIndex + 1) || 1;
                cutsceneBgPan.style.backgroundImage = `url('assets/images/missions_bg/ch1_mission${missionBgNum}_bg.png')`;
            }
        }

        // Header sector title
        const cinemaSector = dom.storyCutsceneModal.querySelector('.cinema-sector-title');
        if (cinemaSector) {
            if (gameState.activeCutsceneStage === 'prologue') {
                cinemaSector.textContent = "SECTOR 01: PATTERN OBSERVATORY PROLOGUE";
            } else if (gameState.activeCutsceneStage === 'start') {
                cinemaSector.textContent = `MISSION ${(gameState.activeMissionNum || 1).toString().padStart(2, '0')}: MISSION BRIEFING`;
            } else {
                cinemaSector.textContent = `MISSION ${(gameState.activeMissionNum || 1).toString().padStart(2, '0')}: MISSION COMPLETE`;
            }
        }

        // Next button tooltip & state
        const isLastSlide = index === slides.length - 1;
        if (dom.cutsceneNextLabel) {
            if (isLastSlide) {
                if (gameState.activeCutsceneStage === 'prologue') {
                    dom.cutsceneNextLabel.textContent = "START MISSION 1 🚀";
                } else if (gameState.activeCutsceneStage === 'start') {
                    dom.cutsceneNextLabel.textContent = `BEGIN MISSION ${gameState.activeMissionNum} ⚡`;
                } else {
                    dom.cutsceneNextLabel.textContent = (gameState.activeMissionNum === 10) ? "VIEW CHAPTER FINALE 🏆" : `NEXT MISSION ${(gameState.activeMissionNum + 1).toString().padStart(2, '0')} ⚡`;
                }
            } else {
                dom.cutsceneNextLabel.textContent = "CONTINUE [SPACE] →";
            }
        }
        if (dom.btnNextCutscene) {
            if (isLastSlide) {
                dom.btnNextCutscene.title = (gameState.activeCutsceneStage === 'prologue') ? "Start Mission 1" : "Begin Mission";
            } else {
                dom.btnNextCutscene.title = "Next [SPACE]";
            }
        }

        // Update dots
        const dots = dom.cutsceneDots.querySelectorAll('.cutscene-dot');
        dots.forEach((d, i) => {
            d.className = 'cutscene-dot';
            if (i === index) d.classList.add('active');
            else if (i < index) d.classList.add('passed');
        });

        // Play real voice audio
        gameState.isVoicePlaying = true;
        playGuardianVoice(slide, () => {
            gameState.isVoicePlaying = false;
            // Only auto-advance if typewriter has ALSO completed!
            if (gameState.isAutoPlay && gameState.isCutsceneActive && !gameState.isTyping) {
                startAutoAdvance(index);
            }
        });

        // Start Typewriter Animation
        typewriterAnimation(gameState.fullCurrentText);
    }

    function typewriterAnimation(fullText) {
        if (gameState.typewriterTimer) clearInterval(gameState.typewriterTimer);
        gameState.isTyping = true;
        if (dom.cutsceneText) dom.cutsceneText.textContent = '';
        let charIdx = 0;

        gameState.typewriterTimer = setInterval(() => {
            charIdx++;
            if (dom.cutsceneText) {
                dom.cutsceneText.textContent = fullText.slice(0, charIdx);
            }

            if (charIdx % 4 === 0) {
                playSfx('chirp');
            }

            if (charIdx >= fullText.length) {
                clearInterval(gameState.typewriterTimer);
                gameState.typewriterTimer = null;
                gameState.isTyping = false;
                // Only auto-advance if voice has ALSO finished!
                if (gameState.isAutoPlay && gameState.isCutsceneActive && !gameState.isVoicePlaying) {
                    startAutoAdvance(gameState.cutsceneIndex);
                }
            }
        }, 18);
    }

    function startAutoAdvance(currentIndex) {
        if (!gameState.isAutoPlay) return;

        const pauseDurationMs = 1200; // 1.2s comfortable breath pause after voice ends
        const intervalMs = 30;
        let elapsed = 0;
        const slides = gameState.activeCutsceneScript || [];

        if (gameState.autoProgressInterval) clearInterval(gameState.autoProgressInterval);

        gameState.autoProgressInterval = setInterval(() => {
            if (!gameState.isCutsceneActive || !gameState.isAutoPlay) {
                clearInterval(gameState.autoProgressInterval);
                return;
            }
            elapsed += intervalMs;
            const pct = Math.min(100, Math.round((elapsed / pauseDurationMs) * 100));
            if (dom.autoProgressFill) dom.autoProgressFill.style.width = `${pct}%`;

            if (elapsed >= pauseDurationMs) {
                clearInterval(gameState.autoProgressInterval);
                if (currentIndex < slides.length - 1) {
                    renderCutsceneSlide(currentIndex + 1);
                } else {
                    if (gameState.activeCutsceneStage === 'prologue') {
                        openMissionCutscene(1, 'start', () => {
                            triggerStartDirective(1);
                        });
                    } else {
                        closeCutscene(true);
                    }
                }
            }
        }, intervalMs);
    }

    function advanceCutscene() {
        if (!gameState.isCutsceneActive) return;

        playSfx('click');

        if (gameState.isTyping) {
            if (gameState.typewriterTimer) clearInterval(gameState.typewriterTimer);
            gameState.typewriterTimer = null;
            gameState.isTyping = false;
            if (dom.cutsceneText) dom.cutsceneText.textContent = gameState.fullCurrentText;
            return;
        }

        clearCutsceneTimers();

        // Stop current audio and advance to next slide
        gameState.isVoicePlaying = false;
        if (cutsceneKeepAliveTimer) {
            clearInterval(cutsceneKeepAliveTimer);
            cutsceneKeepAliveTimer = null;
        }
        if (cutsceneVoicePlayer) {
            cutsceneVoicePlayer.pause();
            cutsceneVoicePlayer.currentTime = 0;
        }
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        if (dom.speechAudioWave) dom.speechAudioWave.classList.remove('speaking');

        const slides = gameState.activeCutsceneScript || [];
        if (gameState.cutsceneIndex < slides.length - 1) {
            renderCutsceneSlide(gameState.cutsceneIndex + 1);
        } else {
            if (gameState.activeCutsceneStage === 'prologue') {
                playSfx('select');
                openMissionCutscene(1, 'start', () => {
                    triggerStartDirective(1);
                });
            } else {
                closeCutscene(true);
            }
        }
    }

    function toggleAutoPlay() {
        gameState.isAutoPlay = !gameState.isAutoPlay;
        if (gameState.isAutoPlay) {
            if (dom.btnToggleAutoCutscene) dom.btnToggleAutoCutscene.classList.remove('auto-off');
            if (dom.autoBtnLabel) dom.autoBtnLabel.textContent = 'AUTO: ON';
            if (!gameState.isTyping && !gameState.isVoicePlaying) {
                startAutoAdvance(gameState.cutsceneIndex);
            }
        } else {
            if (dom.btnToggleAutoCutscene) dom.btnToggleAutoCutscene.classList.add('auto-off');
            if (dom.autoBtnLabel) dom.autoBtnLabel.textContent = 'AUTO: OFF';
            if (gameState.autoProgressInterval) clearInterval(gameState.autoProgressInterval);
            if (dom.autoProgressFill) dom.autoProgressFill.style.width = '0%';
        }
        playSfx('click');
    }

    function buildStepper() {
        dom.stepper.innerHTML = '';
        CHAPTER_MISSIONS.forEach((m, idx) => {
            const btn = document.createElement('button');
            btn.className = `step-node ${idx === 0 ? 'active' : ''}`;
            btn.textContent = (idx + 1).toString().padStart(2, '0');
            btn.title = `Mission ${idx + 1}: ${m.title}`;
            btn.addEventListener('click', () => {
                if (gameState.unlockedMissions.includes(idx)) {
                    loadMission(idx, true);
                } else {
                    showFeedback('Locked. Complete previous missions first.', 'error');
                }
            });
            dom.stepper.appendChild(btn);
        });
    }

    function updateStepperUI() {
        const nodes = dom.stepper.querySelectorAll('.step-node');
        nodes.forEach((node, idx) => {
            node.classList.remove('active', 'completed');
            if (idx === gameState.currentMissionIndex) {
                node.classList.add('active');
            } else if (gameState.unlockedMissions.includes(idx) && idx < gameState.currentMissionIndex) {
                node.classList.add('completed');
            }
        });
    }

    // ==========================================================================
    // BACKEND MISSION METADATA & REWARD DEFINITIONS (Phase 11C)
    // Server is the SOLE authority for mission titles, objectives, and XP rewards
    // ==========================================================================
    const BACKEND_XP_BY_DIFFICULTY = {
        'EASY': 50,
        'MEDIUM': 100,
        'HARD': 150
    };

    let backendMissionsCache = null;

    async function fetchBackendMissions() {
        if (backendMissionsCache && backendMissionsCache.length > 0) {
            return backendMissionsCache;
        }
        if (window.cbApi && typeof window.cbApi.getMissions === 'function') {
            try {
                const list = await window.cbApi.getMissions();
                if (Array.isArray(list) && list.length > 0) {
                    backendMissionsCache = list;
                    return backendMissionsCache;
                }
            } catch (e) {
                console.warn('[COREBOUND] Failed to fetch backend missions list:', e);
            }
        }
        return null;
    }

    async function getBackendMission(missionId, index) {
        if (!backendMissionsCache) {
            await fetchBackendMissions();
        }
        if (backendMissionsCache) {
            const found = backendMissionsCache.find(m => m.id === missionId || m.order_index === (index + 1));
            if (found) return found;
        }
        if (window.cbApi && typeof window.cbApi.getMission === 'function') {
            try {
                return await window.cbApi.getMission(missionId);
            } catch (e) {
                console.warn(`[COREBOUND] Failed to fetch backend mission ${missionId}:`, e);
            }
        }
        return null;
    }

    // ==========================================================================
    // 7. MISSION LOADER & FORMAT ROUTER
    // ==========================================================================
    function triggerStartDirective(missionId) {
        if (gameState.isCutsceneActive) return;
        if (gameState.isBackendSession) {
            const mission = CHAPTER_MISSIONS[gameState.currentMissionIndex];
            const gid = (mission && mission.guardianId) || 'nova';
            const speaker = (mission && mission.speaker) || `${gid.toUpperCase()} // DIRECTIVE`;
            const objective = (dom.directive && dom.directive.textContent) || 'Analyze the active energy sequence and align the calibration parameters.';
            showGuardianPopup(gid, 'analyzing', objective, 'MISSION DIRECTIVE', speaker, 6000);
            return;
        }
        const directiveData = CHAPTER1_GAMEPLAY_DIRECTIVES[missionId] || CHAPTER1_GAMEPLAY_DIRECTIVES[1];
        if (directiveData && directiveData.start) {
            const st = directiveData.start;
            showGuardianPopup(st.guardianId, st.expr, st.text, st.mood, st.speaker, 6000);
        }
    }

    async function loadMission(index, playStartCutscene = false) {
        if (gameState.timerInterval) clearInterval(gameState.timerInterval);
        if (gameState.completeCutsceneTimer) {
            clearTimeout(gameState.completeCutsceneTimer);
            gameState.completeCutsceneTimer = null;
        }
        gameState.pendingCompleteCutscene = null;

        gameState.currentMissionIndex = index;
        const mission = CHAPTER_MISSIONS[index];

        // ISSUE 1 FIX: Keep URL in sync with current mission index so refresh preserves state
        const urlMissionNum = index + 1;
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('mission', String(urlMissionNum));
        history.replaceState({ missionIndex: index }, '', newUrl.toString());

        // Reset per-mission timer epoch on mission switch (fresh missions start fresh)
        gameState.missionTimerEpoch = null;

        // Header and context
        let initialTitle = mission.title;
        let initialObjective = mission.directive;
        let initialDifficulty = (['NORMAL', 'NORMAL', 'NORMAL', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'HARD', 'HARD', 'HARD', 'BOSS CLIMAX'][index] || 'MEDIUM');
        let initialReward = `+${mission.xpReward || 200} XP`;
        let initialFormat = `FORMAT: ${mission.format}`;

        if (window.cbApi && typeof window.cbApi.isAuthenticated === 'function' && window.cbApi.isAuthenticated() && backendMissionsCache) {
            const cachedM = backendMissionsCache.find(m => m.order_index === (index + 1) || m.id === (index + 1));
            if (cachedM) {
                initialTitle = cachedM.title;
                if (cachedM.objective) initialObjective = cachedM.objective;
                initialDifficulty = (cachedM.difficulty || 'MEDIUM').toUpperCase();
                initialReward = `+${BACKEND_XP_BY_DIFFICULTY[initialDifficulty] || 100} XP`;
                initialFormat = `FORMAT: ${cachedM.gameplay_type || 'GM001'}`;
            }
        }

        if (dom.chamberBadge) dom.chamberBadge.textContent = mission.chamber;
        if (dom.formatBadge) dom.formatBadge.textContent = initialFormat;
        if (dom.heading) dom.heading.textContent = initialTitle;
        if (dom.directive) dom.directive.textContent = initialObjective;
        if (dom.speaker) dom.speaker.textContent = mission.speaker;
        const initialSpeech = (window.cbApi && typeof window.cbApi.isAuthenticated === 'function' && window.cbApi.isAuthenticated())
            ? (initialObjective || 'Awaiting operator calibration action...')
            : (mission.speech || '').replace(/^["“”']+|["“”']+$/g, '');
        if (dom.speech) dom.speech.textContent = initialSpeech;
        if (dom.guardianMoodTag) {
            dom.guardianMoodTag.textContent = (window.cbApi && typeof window.cbApi.isAuthenticated === 'function' && window.cbApi.isAuthenticated())
                ? 'DIRECTIVE ACTIVE'
                : 'COMMANDING';
        }
        if (dom.counterLabel) dom.counterLabel.textContent = `MISSION ${(index + 1).toString().padStart(2, '0')} / 10`;

        // Hero Chamber & Question Header updates
        const heroSystemTag = document.getElementById('heroSystemTag');
        if (heroSystemTag) heroSystemTag.textContent = `${(mission.chamber || 'PATTERN LENS').replace('SYSTEM: ', '')} // SYSTEM ${(index + 1).toString().padStart(2, '0')}`;
        
        const heroSystemTitle = document.getElementById('heroSystemTitle');
        if (heroSystemTitle) heroSystemTitle.textContent = initialTitle;

        const heroQuestionPrompt = document.getElementById('heroQuestionPrompt');
        if (heroQuestionPrompt) {
            heroQuestionPrompt.textContent = (mission.id === 10) 
                ? 'CRITICAL CLIMAX: EXECUTE BODMAS OVERDRIVE CHAIN' 
                : (mission.id === 1 ? 'WHAT COMES NEXT IN THE SEQUENCE?' : `RESTORE ${initialTitle}`);
        }

        const heroSequenceDisplay = document.getElementById('heroSequenceDisplay');
        if (heroSequenceDisplay) {
            heroSequenceDisplay.textContent = (mission.data && mission.data.formulaDisplay) || '3 → 6 → 12 → 24 → ?';
        }

        const missionCounterBadge = document.getElementById('missionCounterBadge');
        if (missionCounterBadge) missionCounterBadge.textContent = `${(index + 1).toString().padStart(2, '0')} / 10`;

        const missionDifficultyBadge = document.getElementById('missionDifficultyBadge');
        if (missionDifficultyBadge) {
            missionDifficultyBadge.textContent = initialDifficulty;
        }

        const missionRewardBadge = document.getElementById('missionRewardBadge');
        if (missionRewardBadge) missionRewardBadge.textContent = initialReward;

        const missionTipText = document.getElementById('missionTipText');
        if (missionTipText) {
            const tip = (CHAPTER1_GAMEPLAY_DIRECTIVES[mission.id]?.hint?.text) || (mission.data?.formulaHint) || 'Examine pattern carefully.';
            missionTipText.textContent = tip;
        }

        // Live Mission Timer — initial display reset; will be refined if backend provides started_at
        const liveTimerEl = document.getElementById('missionLiveTimer');
        if (liveTimerEl) liveTimerEl.textContent = '00:00';
        // Store local start time as fallback (overridden below when backend session responds)
        if (!gameState.missionTimerEpoch) {
            gameState.missionTimerEpoch = Date.now();
        }
        if (gameState.timerInterval) clearInterval(gameState.timerInterval);
        gameState.timerInterval = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - (gameState.missionTimerEpoch || Date.now())) / 1000);
            const mins = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
            const secs = (elapsedSeconds % 60).toString().padStart(2, '0');
            if (liveTimerEl) liveTimerEl.textContent = `${mins}:${secs}`;
        }, 1000);

        // Navigation state
        dom.btnPrev.disabled = index === 0;
        dom.btnNext.disabled = !gameState.unlockedMissions.includes(index + 1);

        // Reset visual machine
        if (dom.machineChassis) {
            dom.machineChassis.className = 'hud-card square-reactor-card';
        }
        const progressPct = Math.round(((index) / CHAPTER_MISSIONS.length) * 100);
        dom.stabilityFill.style.width = `${progressPct}%`;
        dom.stabilityPctText.textContent = `${progressPct}%`;

        // Reset backend session runtime state
        gameState.activeGameplaySessionId = null;
        gameState.activePlayableChallenge = null;
        gameState.activeGameplayType = null;
        gameState.activeDifficulty = null;
        gameState.isBackendSession = false;
        gameState.lastServerFeedback = null;

        // Reset static hero presentation visibility
        if (dom.heroQuestionCard) dom.heroQuestionCard.classList.remove('backend-active');
        if (dom.heroSequenceContainer) dom.heroSequenceContainer.classList.remove('backend-active');
        if (dom.missionTipBox) dom.missionTipBox.classList.remove('backend-active');

        // Show Loading State during generic gameplay initialization
        dom.gameplayStage.innerHTML = `
            <div class="gameplay-loading-state" style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:220px; text-align:center; padding:30px 20px;">
                <div class="cyber-spinner" style="width:48px; height:48px; border:3px solid rgba(0,229,255,0.2); border-top-color:#00e5ff; border-radius:50%; animation:spin 1s linear infinite; margin-bottom:18px;"></div>
                <div class="loading-text" style="color:#00e5ff; font-family:monospace; letter-spacing:2px; font-size:14px; font-weight:600;">GENERATING MISSION CALIBRATION MATRIX...</div>
                <div style="color:#78909c; font-size:12px; margin-top:8px; font-family:sans-serif;">Connecting to adaptive neural engine...</div>
            </div>
        `;
        showFeedback('GENERATING MISSION CALIBRATION MATRIX...', 'normal');

        // Dynamic Mission Gameplay Background Art
        const missionNum = index + 1;
        document.body.style.backgroundImage = `linear-gradient(180deg, rgba(4, 2, 10, 0.35) 0%, rgba(7, 3, 20, 0.4) 50%, rgba(4, 2, 10, 0.65) 100%), url('assets/images/missions_bg/ch1_mission${missionNum}_bg.png')`;

        updateStepperUI();

        // Attempt generic backend gameplay start if authenticated
        let backendSession = null;
        let backendMissionData = null;
        let backendError = null;
        const isAuth = window.cbApi && typeof window.cbApi.isAuthenticated === 'function' && window.cbApi.isAuthenticated();

        if (isAuth) {
            if (dom.heroQuestionCard) dom.heroQuestionCard.classList.add('backend-active');
            if (dom.heroSequenceContainer) dom.heroSequenceContainer.classList.add('backend-active');
            if (dom.missionTipBox) dom.missionTipBox.classList.add('backend-active');
            try {
                const [sessionRes, missionRes] = await Promise.all([
                    window.cbApi.startGameplay(mission.id),
                    getBackendMission(mission.id, index)
                ]);
                backendSession = sessionRes;
                backendMissionData = missionRes;
            } catch (err) {
                console.warn('[COREBOUND] Failed to start backend gameplay session:', err);
                backendSession = null;
                backendMissionData = null;
                backendError = err;
            }
        }

        dom.gameplayStage.innerHTML = '';

        if (backendSession && backendSession.session_id && backendSession.playable) {
            gameState.activeGameplaySessionId = backendSession.session_id;
            gameState.activePlayableChallenge = backendSession.playable;
            gameState.activeGameplayType = backendSession.gameplay_type;
            gameState.activeDifficulty = backendSession.difficulty;
            gameState.isBackendSession = true;
            gameState.isSubmittingAnswer = false;

            // ISSUE 2 FIX: Derive timer epoch from backend started_at for persistence across refresh
            if (backendSession.started_at) {
                gameState.missionTimerEpoch = new Date(backendSession.started_at).getTime();
            } else {
                gameState.missionTimerEpoch = Date.now();
            }
            gameState.missionStartTime = gameState.missionTimerEpoch;

            // Ensure static question wrapper, sequence, and stale tactical tip are hidden during active backend gameplay
            if (dom.heroQuestionCard) dom.heroQuestionCard.classList.add('backend-active');
            if (dom.heroSequenceContainer) dom.heroSequenceContainer.classList.add('backend-active');
            if (dom.missionTipBox) dom.missionTipBox.classList.add('backend-active');

            // Dynamic Mission Metadata updates (Phase 11C)
            const activeTitle = (backendMissionData && backendMissionData.title) || mission.title;
            const activeObjective = (backendMissionData && backendMissionData.objective) || mission.directive;
            const activeOrderIndex = (backendMissionData && backendMissionData.order_index) || (index + 1);
            const totalMissionsCount = (backendMissionsCache && backendMissionsCache.length) || CHAPTER_MISSIONS.length || 10;
            const formattedMissionNum = activeOrderIndex.toString().padStart(2, '0');
            const formattedTotal = totalMissionsCount.toString().padStart(2, '0');
            const activeDifficulty = (backendSession.difficulty || (backendMissionData && backendMissionData.difficulty) || 'MEDIUM').toUpperCase();
            const activeRewardXp = BACKEND_XP_BY_DIFFICULTY[activeDifficulty] || 100;
            const activeFormat = backendSession.gameplay_type || (backendMissionData && backendMissionData.gameplay_type) || 'GM001';

            if (dom.heading) dom.heading.textContent = activeTitle;
            if (dom.directive) dom.directive.textContent = activeObjective;
            if (dom.speech) dom.speech.textContent = activeObjective;
            if (dom.guardianMoodTag) dom.guardianMoodTag.textContent = 'CALIBRATION READY';
            updateGuardianAvatarMood('default');
            const heroSystemTitle = document.getElementById('heroSystemTitle');
            if (heroSystemTitle) heroSystemTitle.textContent = activeTitle;

            const missionCounterBadge = document.getElementById('missionCounterBadge');
            if (missionCounterBadge) missionCounterBadge.textContent = `${formattedMissionNum} / ${formattedTotal}`;
            if (dom.counterLabel) dom.counterLabel.textContent = `MISSION ${formattedMissionNum} / ${formattedTotal}`;

            const missionDifficultyBadge = document.getElementById('missionDifficultyBadge');
            if (missionDifficultyBadge) missionDifficultyBadge.textContent = activeDifficulty;

            const missionRewardBadge = document.getElementById('missionRewardBadge');
            if (missionRewardBadge) missionRewardBadge.textContent = `+${activeRewardXp} XP`;

            if (dom.formatBadge) dom.formatBadge.textContent = `FORMAT: ${activeFormat}`;

            renderBackendPlayable(backendSession.gameplay_type, backendSession.playable);
            showFeedback('Live calibration matrix engaged. Awaiting operator input...', 'normal');
        } else if (isAuth) {
            // AUTHENTICATED USER + BACKEND FAILURE -> EXPLICIT ERROR STATE (PHASE 14B)
            // NEVER silently fall back to static gameplay!
            gameState.isBackendSession = false;
            gameState.activeGameplaySessionId = null;
            gameState.isSubmittingAnswer = false;

            // Ensure static hero question card and sequence display remain strictly HIDDEN
            if (dom.heroQuestionCard) dom.heroQuestionCard.classList.add('backend-active');
            if (dom.heroSequenceContainer) dom.heroSequenceContainer.classList.add('backend-active');
            if (dom.missionTipBox) dom.missionTipBox.classList.add('backend-active');
            if (dom.guardianMoodTag) dom.guardianMoodTag.textContent = 'LINK DISRUPTED';
            if (dom.speech) dom.speech.textContent = 'Neural link to Corebound Command is severed. Re-establish connection to begin calibration.';

            renderBackendErrorState(mission, backendError, () => {
                loadMission(index, false);
            });
        } else {
            // Unauthenticated Guest / Demo Mode ONLY
            gameState.isBackendSession = false;
            gameState.isSubmittingAnswer = false;

            // Restore static hero question card and sequence display for legacy fallback
            if (dom.heroQuestionCard) dom.heroQuestionCard.classList.remove('backend-active');
            if (dom.heroSequenceContainer) dom.heroSequenceContainer.classList.remove('backend-active');
            if (dom.missionTipBox) dom.missionTipBox.classList.remove('backend-active');
            if (dom.speech) dom.speech.textContent = (mission.speech || '').replace(/^["“”']+|["“”']+$/g, '');

            renderActiveFormat(mission);
            showFeedback('Awaiting operator calibration action...', 'normal');
        }

        // Populate Tactical Mission Briefing
        if (dom.briefingModal) {
            const bTitle = (backendMissionData && backendMissionData.title) || mission.title || 'CALIBRATION';
            const bObj = (backendMissionData && backendMissionData.objective) || mission.directive || 'Analyze the active energy sequence and calibrate the missing resonance parameter.';
            const bDiff = (backendSession && backendSession.difficulty) ? backendSession.difficulty.toUpperCase() : ((backendMissionData && backendMissionData.difficulty) ? backendMissionData.difficulty.toUpperCase() : 'MEDIUM');
            const bFormat = (backendSession && backendSession.gameplay_type) || (backendMissionData && backendMissionData.gameplay_type) || mission.format;
            const bReward = BACKEND_XP_BY_DIFFICULTY[bDiff] || (mission.xpReward || 200);

            if (dom.briefingTitle) dom.briefingTitle.textContent = `MISSION ${(index + 1).toString().padStart(2, '0')}: ${bTitle.toUpperCase()}`;
            if (dom.briefingObjectiveText) dom.briefingObjectiveText.textContent = bObj;
            if (dom.briefingDifficulty) dom.briefingDifficulty.textContent = bDiff;
            if (dom.briefingFormat) dom.briefingFormat.textContent = `${bFormat} // INTERACTIVE`;
            if (dom.briefingReward) dom.briefingReward.textContent = `+${bReward} XP`;
        }

        if (playStartCutscene) {
            openMissionCutscene(mission.id, 'start', () => {
                triggerStartDirective(mission.id);
                if (mission.id === 10 && typeof window._triggerM10BossEntrance === 'function') {
                    window._triggerM10BossEntrance();
                }
            });
        } else {
            if (mission.id === 10 && typeof window._triggerM10BossEntrance === 'function') {
                window._triggerM10BossEntrance();
            }
        }
    }

    // ==========================================================================
    // BACKEND ANSWER SUBMISSION & SERVER-SIDE EVALUATION (Phase 5 & 9)
    // Server is the SOLE authority for correctness, XP, rewards, and progression
    // ==========================================================================
    async function submitBackendAnswer(submittedAnswer) {
        if (gameState.isSubmittingAnswer) return;
        if (!gameState.activeGameplaySessionId || !gameState.isBackendSession) {
            showFeedback('No active backend gameplay session. Reinitializing...', 'error');
            return;
        }

        gameState.isSubmittingAnswer = true;
        const timeTakenMs = Math.max(0, Date.now() - (gameState.missionStartTime || Date.now()));
        showFeedback('TRANSMITTING TELEMETRY TO SERVER CORE... [SYNCING]', 'normal');

        try {
            const result = await window.cbApi.submitGameplayAnswer(
                gameState.activeGameplaySessionId,
                submittedAnswer,
                timeTakenMs
            );

            if (result && result.is_correct) {
                if (gameState.timerInterval) clearInterval(gameState.timerInterval);
                playSfx('success');
                updateGuardianAvatarMood('success');
                if (dom.machineChassis) {
                    dom.machineChassis.className = 'hud-card square-reactor-card state-success';
                }
                if (dom.stabilityFill) dom.stabilityFill.style.width = '100%';
                if (dom.stabilityPctText) dom.stabilityPctText.textContent = '100%';

                // Server-authoritative XP and rewards (NO client-side recomputation)
                if (typeof result.xp_earned === 'number') {
                    gameState.totalXp += result.xp_earned;
                    if (dom.xpDisplay) dom.xpDisplay.textContent = `+${gameState.totalXp} XP`;
                }

                // Update Mission Completion Modal with authoritative server rewards
                if (dom.successModal) {
                    if (dom.modalTitle) dom.modalTitle.textContent = result.mission_completed ? 'MISSION COMPLETE' : 'CALIBRATION STABILIZED';
                    if (dom.modalSubtitle) dom.modalSubtitle.textContent = 'SYSTEM RESTORED // RESONANCE EQUALIZED';
                    if (dom.modalXpReward && typeof result.xp_earned === 'number') {
                        dom.modalXpReward.textContent = `+${result.xp_earned} XP`;
                    }
                    if (dom.modalCreditsReward && typeof result.credits_earned === 'number') {
                        dom.modalCreditsReward.textContent = `+${result.credits_earned}`;
                    }
                    if (dom.modalStarsReward) {
                        const stars = typeof result.stars_earned === 'number' ? result.stars_earned : 3;
                        dom.modalStarsReward.textContent = stars === 3 ? '★★★' : (stars === 2 ? '★★☆' : '★☆☆');
                    }
                    if (dom.modalUnlockBanner) {
                        dom.modalUnlockBanner.style.display = result.next_mission_unlocked ? 'block' : 'none';
                    }
                    if (dom.modalNarrative && result.explanation) {
                        dom.modalNarrative.textContent = result.explanation;
                    }
                }

                const mission = CHAPTER_MISSIONS[gameState.currentMissionIndex];
                const nextIdx = gameState.currentMissionIndex + 1;

                if (!gameState.unlockedMissions.includes(nextIdx) && nextIdx < CHAPTER_MISSIONS.length) {
                    gameState.unlockedMissions.push(nextIdx);
                }

                // Preserve legacy localStorage compatibility without overriding server authority
                try {
                    const raw = localStorage.getItem('cb_ch1_progress');
                    const stored = raw ? JSON.parse(raw) : { completedMissions: [], highestUnlocked: 1, totalXp: 0 };
                    if (!stored.completedMissions.includes(mission.id)) {
                        stored.completedMissions.push(mission.id);
                    }
                    stored.highestUnlocked = Math.max(stored.highestUnlocked || 1, mission.id + 1);
                    stored.totalXp = Math.max(stored.totalXp || 0, gameState.totalXp);
                    localStorage.setItem('cb_ch1_progress', JSON.stringify(stored));
                } catch (e) {}

                if (dom.btnNext) dom.btnNext.disabled = false;
                updateStepperUI();

                const serverMsg = result.explanation 
                    ? `CALIBRATION STABILIZED! ${result.explanation}`
                    : 'CALIBRATION STABILIZED! Resonance restored.';
                showFeedback(serverMsg, 'success');

                gameState.pendingCompleteCutscene = mission.id;
                if (gameState.completeCutsceneTimer) {
                    clearTimeout(gameState.completeCutsceneTimer);
                    gameState.completeCutsceneTimer = null;
                }

                const proceedToCompleteCutscene = () => {
                    if (gameState.pendingCompleteCutscene === mission.id) {
                        gameState.pendingCompleteCutscene = null;
                        hideGuardianPopup();
                        openMissionCutscene(mission.id, 'complete', () => {
                            if (nextIdx >= CHAPTER_MISSIONS.length) {
                                // ISSUE 6 FIX: Update chapter complete modal with server-authoritative XP
                                const chapterXpEl = dom.chapterCompleteModal && dom.chapterCompleteModal.querySelector('.stat-val.text-purple');
                                if (chapterXpEl && gameState.totalXp > 0) {
                                    chapterXpEl.textContent = `+${gameState.totalXp.toLocaleString()} XP`;
                                }
                                if (dom.chapterCompleteModal) dom.chapterCompleteModal.classList.add('active');
                            } else {
                                if (dom.successModal) dom.successModal.classList.add('active');
                            }
                        });
                    }
                };

                const gid = (mission && mission.guardianId) || 'nova';
                const speaker = (mission && mission.speaker) || `${gid.toUpperCase()} // SUCCESS`;
                const successText = result.explanation
                    ? `Calibration stabilized! ${result.explanation}`
                    : 'Resonance frequency synchronized. System restored!';
                showGuardianPopup(gid, 'joy', successText, 'CALIBRATION STABILIZED', speaker, 4000, proceedToCompleteCutscene);
            } else {
                // Server-evaluated incorrect answer
                playSfx('error');
                updateGuardianAvatarMood('error');
                if (dom.machineChassis) {
                    dom.machineChassis.className = 'hud-card square-reactor-card state-error';
                }
                const serverExplanation = (result && result.explanation)
                    ? result.explanation
                    : 'Entered parameter does not restore resonance. Recalculate!';
                showFeedback(`SIGNAL REJECTED: ${serverExplanation}`, 'error');

                gameState.lastServerFeedback = serverExplanation;

                const mission = CHAPTER_MISSIONS[gameState.currentMissionIndex];
                const gid = (mission && mission.guardianId) || 'byte';
                const speaker = `${gid.toUpperCase()} // DIAGNOSTIC`;
                showGuardianPopup(gid, 'alert', serverExplanation, 'CALIBRATION REJECTED', speaker, 6000);

                setTimeout(() => {
                    if (dom.machineChassis) {
                        dom.machineChassis.className = 'hud-card square-reactor-card';
                    }
                    updateGuardianAvatarMood('default');
                }, 800);
            }
        } catch (err) {
            console.error('[COREBOUND] Error submitting gameplay answer:', err);
            // ISSUE 3 FIX: Strictly distinguish auth/session/network errors from wrong answers.
            // HTTP errors throw with err.status set by corebound-api.js request().
            // NEVER classify a non-200 response as an incorrect answer.
            const httpStatus = err && err.status;
            if (httpStatus === 401) {
                updateGuardianAvatarMood('default');
                showFeedback('SESSION EXPIRED: Please log in again to continue.', 'error');
                showGuardianPopup('byte', 'alert',
                    'Authentication token expired. Please return to the login screen and sign in again.',
                    'SESSION EXPIRED', 'BYTE // SYSTEM', 7000);
            } else if (httpStatus === 403) {
                updateGuardianAvatarMood('default');
                showFeedback('ACCESS DENIED: This session is no longer valid for this mission.', 'error');
                showGuardianPopup('byte', 'alert',
                    'This mission session is not accessible. Try reloading the mission.',
                    'ACCESS DENIED', 'BYTE // SYSTEM', 7000);
            } else if (httpStatus === 409) {
                updateGuardianAvatarMood('default');
                showFeedback('SESSION CONFLICT: This mission may already be completed.', 'error');
                showGuardianPopup('byte', 'alert',
                    'Conflict detected — the session may already be completed. Reload to see current state.',
                    'SESSION CONFLICT', 'BYTE // SYSTEM', 7000);
            } else if (!httpStatus) {
                // Network failure — no HTTP status available
                updateGuardianAvatarMood('default');
                showFeedback('CONNECTION ERROR: Unable to reach Core server. Check your network.', 'error');
                showGuardianPopup('byte', 'alert',
                    'Unable to contact the Corebound Core server. Please check your connection and try again.',
                    'CONNECTION ERROR', 'BYTE // SYSTEM', 7000);
            } else {
                // Other unexpected server error (5xx etc.)
                updateGuardianAvatarMood('default');
                showFeedback(`SERVER ERROR [${httpStatus}]: ${err.message || 'Unexpected error from server'}`, 'error');
            }
        } finally {
            gameState.isSubmittingAnswer = false;
        }
    }

    // ==========================================================================
    // BACKEND GENERIC GAMEPLAY RENDERERS (GM001, GM002, GM003, GM004)
    // Authoritative rendering based on backend gameplay_type contract
    // Canonical answers are never exposed or rendered in DOM
    // ==========================================================================
    function renderBackendPlayable(gameplayType, playable) {
        const content = (playable && playable.content) ? playable.content : playable;
        if (content && content.format === 'boss_3phase') {
            renderBossRushScene(CHAPTER_MISSIONS[9], content);
            return;
        }
        switch (gameplayType) {
            case 'GM001':
                renderGM001Backend(content);
                break;
            case 'GM002':
                renderGM002Backend(content);
                break;
            case 'GM003':
                renderGM003Backend(content);
                break;
            case 'GM004':
                renderGM004Backend(content);
                break;
            default:
                console.warn(`[COREBOUND] Unknown backend gameplay type: ${gameplayType}, falling back to GM004 layout`);
                renderGM004Backend(content);
        }
    }

    // GM001: Multiple Choice Question (No canonical answer in DOM)
    function renderGM001Backend(content) {
        const container = document.createElement('div');
        container.className = 'backend-gm-container gm001-container';

        const promptBox = document.createElement('div');
        promptBox.className = 'gm-prompt-card';
        promptBox.textContent = content.question || 'Select the calibration parameter to harmonize the pattern lens:';
        container.appendChild(promptBox);

        const optionsGrid = document.createElement('div');
        optionsGrid.className = 'gm-options-grid';

        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        (content.options || []).forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'cyber-action-btn gm-option-btn';
            btn.innerHTML = `<span class="btn-shine"></span><span class="option-badge">[ ${letters[idx] || (idx + 1)} ]</span><span class="option-text">${opt}</span>`;
            
            btn.addEventListener('click', () => {
                if (gameState.isSubmittingAnswer) return;
                optionsGrid.querySelectorAll('.gm-option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                playSfx('select');
                submitBackendAnswer(opt);
            });
            optionsGrid.appendChild(btn);
        });

        container.appendChild(optionsGrid);
        dom.gameplayStage.appendChild(container);
    }

    // GM002: Object to Slot Matching (No canonical mapping in DOM)
    function renderGM002Backend(content) {
        const container = document.createElement('div');
        container.className = 'backend-gm-container gm002-container';

        const promptBox = document.createElement('div');
        promptBox.className = 'gm-prompt-card';
        promptBox.textContent = content.instructions || 'Match each calibration source to its corresponding resonance slot:';
        container.appendChild(promptBox);

        const matchArea = document.createElement('div');
        matchArea.className = 'gm002-match-area';

        const objCol = document.createElement('div');
        objCol.className = 'gm002-col gm002-source-col';
        const objHeader = document.createElement('div');
        objHeader.className = 'gm002-col-header gm002-source-header';
        objHeader.textContent = '◈ CALIBRATION SOURCES';
        objCol.appendChild(objHeader);

        const slotCol = document.createElement('div');
        slotCol.className = 'gm002-col gm002-slot-col';
        const slotHeader = document.createElement('div');
        slotHeader.className = 'gm002-col-header gm002-slot-header';
        slotHeader.textContent = '⬡ TARGET SLOTS';
        slotCol.appendChild(slotHeader);

        let selectedObj = null;
        const currentMappings = {};

        (content.objects || []).forEach(obj => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'gm002-obj-card';
            card.dataset.id = obj.id;
            card.innerHTML = `<span style="color:#00e5ff;">◈</span> <span>${obj.label || obj.id}</span>`;
            card.addEventListener('click', () => {
                objCol.querySelectorAll('.gm002-obj-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedObj = obj;
                playSfx('select');
                showFeedback(`Source [${obj.label || obj.id}] selected. Choose target slot to dock.`, 'normal');
            });
            objCol.appendChild(card);
        });

        (content.slots || []).forEach(slot => {
            const slotCard = document.createElement('button');
            slotCard.type = 'button';
            slotCard.className = 'gm002-slot-card';
            slotCard.dataset.id = slot.id;
            slotCard.innerHTML = `<span style="color:#fbbf24;">⬡</span> <span>${slot.label || slot.id}</span>`;
            slotCard.addEventListener('click', () => {
                if (selectedObj) {
                    currentMappings[selectedObj.id] = slot.id;
                    slotCard.classList.add('docked');
                    slotCard.innerHTML = `<span style="color:#00e5ff;">✓</span> <span>${slot.label || slot.id} ➔ [${selectedObj.label || selectedObj.id}]</span>`;
                    playSfx('select');
                    showFeedback(`Mapped ${selectedObj.label || selectedObj.id} to ${slot.label || slot.id}`, 'normal');
                    selectedObj = null;
                } else {
                    showFeedback(`Select a calibration source first, then click a target slot.`, 'normal');
                }
            });
            slotCol.appendChild(slotCard);
        });

        matchArea.appendChild(objCol);
        matchArea.appendChild(slotCol);
        container.appendChild(matchArea);

        const submitBtn = createActionButton('ENGAGE SYSTEM MAPPING →', () => {
            if (gameState.isSubmittingAnswer) return;
            const expectedCount = (content.objects || []).length;
            if (Object.keys(currentMappings).length < expectedCount) {
                showFeedback('Please map all calibration sources to target slots before engaging.', 'normal');
                return;
            }
            playSfx('select');
            submitBackendAnswer(JSON.stringify(currentMappings));
        });
        submitBtn.classList.add('primary-gameplay-btn');
        container.appendChild(submitBtn);

        dom.gameplayStage.appendChild(container);
    }

    // GM003: Step / Item Sequence Ordering (Items shuffled, no canonical order in DOM)
    function renderGM003Backend(content) {
        const container = document.createElement('div');
        container.className = 'backend-gm-container gm003-container';

        const promptBox = document.createElement('div');
        promptBox.className = 'gm-prompt-card';
        promptBox.textContent = content.instructions || 'Arrange the items into the correct sequence:';
        container.appendChild(promptBox);


        const list = document.createElement('div');
        list.className = 'gm003-sequence-list';

        let items = (content.items || []).slice();

        function renderList() {
            list.innerHTML = '';
            items.forEach((item, idx) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'gm003-item';

                const labelWrap = document.createElement('div');
                labelWrap.className = 'gm003-item-left';
                labelWrap.innerHTML = `<span class="node-badge">${(idx + 1).toString().padStart(2, '0')}</span><span class="node-divider">──</span><span class="node-label">${item.label || item.id}</span>`;

                const btnGroup = document.createElement('div');
                btnGroup.className = 'gm003-btn-group';

                if (idx > 0) {
                    const upBtn = document.createElement('button');
                    upBtn.type = 'button';
                    upBtn.className = 'cyber-action-btn gm003-ctrl-btn';
                    upBtn.textContent = '▲';
                    upBtn.title = 'Move Up';
                    upBtn.addEventListener('click', () => {
                        const temp = items[idx - 1];
                        items[idx - 1] = items[idx];
                        items[idx] = temp;
                        playSfx('click');
                        renderList();
                    });
                    btnGroup.appendChild(upBtn);
                }

                if (idx < items.length - 1) {
                    const downBtn = document.createElement('button');
                    downBtn.type = 'button';
                    downBtn.className = 'cyber-action-btn gm003-ctrl-btn';
                    downBtn.textContent = '▼';
                    downBtn.title = 'Move Down';
                    downBtn.addEventListener('click', () => {
                        const temp = items[idx + 1];
                        items[idx + 1] = items[idx];
                        items[idx] = temp;
                        playSfx('click');
                        renderList();
                    });
                    btnGroup.appendChild(downBtn);
                }

                itemEl.appendChild(labelWrap);
                itemEl.appendChild(btnGroup);
                list.appendChild(itemEl);
            });
        }

        renderList();
        container.appendChild(list);

        const submitBtn = createActionButton('EXECUTE SEQUENCE ORDER →', () => {
            if (gameState.isSubmittingAnswer) return;
            const order = items.map(it => it.id);
            playSfx('select');
            submitBackendAnswer(JSON.stringify(order));
        });
        submitBtn.classList.add('primary-gameplay-btn');
        container.appendChild(submitBtn);

        dom.gameplayStage.appendChild(container);
    }

    // GM004: Direct Value / Formula Input (No accepted answers in DOM)
    function renderGM004Backend(content) {
        const container = document.createElement('div');
        container.className = 'backend-gm-container gm004-container';

        const promptBox = document.createElement('div');
        promptBox.className = 'gm-prompt-card';
        promptBox.textContent = content.question || 'Calculate and enter the required calibration parameter:';
        container.appendChild(promptBox);


        const inputCard = document.createElement('div');
        inputCard.className = 'gm004-input-card';

        const inputWrap = document.createElement('div');
        inputWrap.className = 'crystal-input-wrap';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'crystal-input';
        const typeHint = content.answer_type ? ` [${content.answer_type.toUpperCase()}]` : '';
        input.placeholder = `ENTER CALIBRATION VALUE${typeHint}`;
        input.id = 'activeInput';
        input.autocomplete = 'off';

        const btn = createActionButton('CALIBRATE RESONANCE →', () => {
            if (gameState.isSubmittingAnswer) return;
            const val = input.value.trim();
            if (!val) {
                showFeedback('Please enter a calibration value.', 'normal');
                return;
            }
            playSfx('select');
            submitBackendAnswer(val);
        });
        btn.classList.add('primary-gameplay-btn');

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                btn.click();
            }
        });

        inputWrap.appendChild(input);
        inputCard.appendChild(inputWrap);
        inputCard.appendChild(btn);
        container.appendChild(inputCard);
        dom.gameplayStage.appendChild(container);

        setTimeout(() => input.focus(), 100);
    }


    // ==========================================================================
    // BACKEND GAMEPLAY ERROR RENDERER (PHASE 14B)
    // Renders an explicit, non-leaking error card when authenticated gameplay fails.
    // NEVER silently falls back to static gameplay.
    // ==========================================================================
    function renderBackendErrorState(mission, err, onRetry) {
        dom.gameplayStage.innerHTML = '';

        // Ensure static hero presentation cards remain strictly HIDDEN
        if (dom.heroQuestionCard) dom.heroQuestionCard.classList.add('backend-active');
        if (dom.heroSequenceContainer) dom.heroSequenceContainer.classList.add('backend-active');
        if (dom.missionTipBox) dom.missionTipBox.classList.add('backend-active');

        const httpStatus = err && (err.status || (err.response && err.response.status));

        let errorTitle = 'COREBOUND COMMAND LINK LOST';
        let errorSubtitle = 'NEURAL TELEMETRY OFFLINE';
        let errorDesc = 'Unable to establish a secure gameplay session with the Corebound server. The neural telemetry link is offline or unreachable.';
        let icon = '⚡';
        let showRetry = true;
        let showLogin = false;
        let showMap = true;

        if (httpStatus === 401) {
            errorTitle = 'SESSION EXPIRED';
            errorSubtitle = 'AUTHENTICATION REQUIRED';
            errorDesc = 'Your security clearance token has expired or is invalid. Please sign in again to access server-authoritative missions.';
            icon = '🔒';
            showRetry = false;
            showLogin = true;
        } else if (httpStatus === 403) {
            errorTitle = 'ACCESS RESTRICTED';
            errorSubtitle = 'CLEARANCE REQUIRED';
            errorDesc = 'Access to this mission calibration sequence is restricted or locked. Complete previous sector missions to unlock clearance.';
            icon = '🚫';
            showRetry = false;
        } else if (httpStatus === 409) {
            errorTitle = 'SESSION CONFLICT';
            errorSubtitle = 'ACTIVE STATE MISMATCH';
            errorDesc = 'A session conflict occurred for this mission. Please retry to synchronize your active mission session.';
            icon = '⚠️';
            showRetry = true;
        } else if (httpStatus && httpStatus >= 500) {
            errorTitle = 'SERVER CORE ERROR';
            errorSubtitle = 'INTERNAL ENGINE FAULT';
            errorDesc = 'The Corebound neural computation engine encountered an internal server error. Please retry shortly.';
            icon = '💥';
            showRetry = true;
        }

        const card = document.createElement('div');
        card.className = 'backend-error-card glass-panel';
        card.id = 'backendGameplayErrorCard';
        card.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 40px 24px;
            min-height: 280px;
            background: rgba(15, 7, 30, 0.88);
            border: 1px solid rgba(255, 45, 85, 0.4);
            border-radius: 12px;
            box-shadow: 0 0 30px rgba(255, 30, 86, 0.2);
            max-width: 600px;
            margin: 20px auto;
        `;

        card.innerHTML = `
            <div style="font-size: 42px; margin-bottom: 12px; filter: drop-shadow(0 0 12px rgba(255, 50, 50, 0.6));">${icon}</div>
            <div style="color: #ff3366; font-size: 11px; font-weight: 700; letter-spacing: 3px; font-family: monospace; margin-bottom: 6px;">${errorSubtitle}</div>
            <h3 style="color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 1px; margin: 0 0 12px 0; font-family: sans-serif;">${errorTitle}</h3>
            <p style="color: #a0aec0; font-size: 13px; line-height: 1.6; max-width: 480px; margin: 0 0 24px 0; font-family: sans-serif;">${errorDesc}</p>
            <div style="display: flex; gap: 14px; flex-wrap: wrap; justify-content: center;" id="errorActionButtons"></div>
        `;

        const btnContainer = card.querySelector('#errorActionButtons');

        if (showRetry && typeof onRetry === 'function') {
            const retryBtn = document.createElement('button');
            retryBtn.type = 'button';
            retryBtn.id = 'btnRetryGameplay';
            retryBtn.className = 'cyber-action-btn btn-primary action-cta-btn';
            retryBtn.style.cssText = 'padding: 10px 24px; font-weight: 700; letter-spacing: 1px; cursor: pointer;';
            retryBtn.innerHTML = '<span class="btn-shine"></span><span class="btn-text">RETRY CONNECTION</span>';
            retryBtn.addEventListener('click', onRetry);
            btnContainer.appendChild(retryBtn);
        }

        if (showLogin) {
            const loginBtn = document.createElement('a');
            loginBtn.href = 'auth_calibration.html';
            loginBtn.id = 'btnLoginRedirect';
            loginBtn.className = 'cyber-action-btn btn-primary action-cta-btn';
            loginBtn.style.cssText = 'padding: 10px 24px; font-weight: 700; letter-spacing: 1px; text-decoration: none; display: inline-flex; align-items: center;';
            loginBtn.innerHTML = '<span class="btn-shine"></span><span class="btn-text">SIGN IN AGAIN</span>';
            btnContainer.appendChild(loginBtn);
        }

        if (showMap) {
            const mapBtn = document.createElement('a');
            mapBtn.href = 'sub_missions.html';
            mapBtn.id = 'btnReturnMissionMap';
            mapBtn.className = 'cyber-action-btn action-cta-btn';
            mapBtn.style.cssText = 'padding: 10px 20px; font-weight: 600; letter-spacing: 1px; text-decoration: none; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #e2e8f0; display: inline-flex; align-items: center;';
            mapBtn.innerHTML = '<span class="btn-text">MISSION MAP</span>';
            btnContainer.appendChild(mapBtn);
        }

        dom.gameplayStage.appendChild(card);
        showFeedback(`${errorTitle}: ${errorSubtitle}`, 'error');
        updateGuardianAvatarMood('alert');
    }

    function renderActiveFormat(mission) {
        switch (mission.formatType) {
            case 'interactive_scene':
                renderInteractiveScene(mission);
                break;
            case 'interactive_scene_dial':
                renderDialScene(mission);
                break;
            case 'interactive_scene_nodes':
                renderNodeRoutingScene(mission);
                break;
            case 'interactive_scene_keypad':
                renderReactorKeypadScene(mission);
                break;
            case 'interactive_scene_cells':
                renderCellBayScene(mission);
                break;
            case 'interactive_scene_tiles':
                renderTileGridScene(mission);
                break;
            case 'interactive_scene_terminal':
                renderRatioTerminalScene(mission);
                break;
            case 'interactive_scene_cipher':
                renderCipherWheelsScene(mission);
                break;
            case 'interactive_scene_cubes':
                renderCubePedestalScene(mission);
                break;
            case 'interactive_scene_boss':
                renderBossRushScene(mission);
                break;
            case 'pattern_complete':
                renderPatternComplete(mission);
                break;
            case 'slider':
                renderSlider(mission);
                break;
            case 'match_pairs':
                renderMatchPairs(mission);
                break;
            case 'calc_machine':
                renderCalcMachine(mission);
                break;
            case 'unlock_code':
                renderUnlockCode(mission);
                break;
            case 'drag_drop':
                renderDragDrop(mission);
                break;
            case 'target_select':
                renderTargetSelect(mission);
                break;
            case 'type_answer':
                renderTypeAnswer(mission);
                break;
            case 'equilibrium':
                renderEquilibrium(mission);
                break;
            case 'timed_boss':
                renderTimedBoss(mission);
                break;
            default:
                renderTypeAnswer(mission);
        }
    }

    // ==========================================================================
    // 8. FORMAT RENDERERS (All 10 Interactive Modes)
    // ==========================================================================

    // ==========================================================================
    // FORMAT: INTERACTIVE PUZZLE SCENE — Mission 1 "Awaken Pattern Lens"
    // Full 2.5D chamber with drag-and-drop crystal puzzle
    // ==========================================================================
    function renderInteractiveScene(m) {
        // --- Scene State Machine ---
        const sceneState = {
            phase: 'explore', // explore | rack_opened | dragging | validated | activating | completed
            draggedCrystal: null,
            touchGhost: null,
            touchSource: null
        };

        // --- Build Scene Container ---
        const scene = document.createElement('div');
        scene.className = 'interactive-scene';
        scene.id = 'interactiveScene';

        // Background depth layers
        scene.innerHTML = `
            <div class="scene-layer scene-layer-far"></div>
            <div class="scene-layer scene-layer-mid"></div>
            <div class="scene-ambient-pulse"></div>
            <div class="scene-layer scene-layer-fore"></div>
            <div class="scene-activation-flash" id="sceneFlash"></div>
            <div class="scene-particles-burst" id="sceneBurst"></div>
            <div class="scene-success-banner" id="sceneSuccessBanner">PATTERN LENS RESTORED</div>
            <div class="scene-reject-banner" id="sceneRejectBanner">CRYSTAL REJECTED — TRY AGAIN</div>
        `;

        // --- Scene Content (above layers) ---
        const content = document.createElement('div');
        content.className = 'scene-content';

        // Status bar
        const statusBar = document.createElement('div');
        statusBar.className = 'scene-status-bar';
        statusBar.id = 'sceneStatusBar';
        statusBar.innerHTML = `<span class="status-dot"></span> ${m.data.sceneStatusText || 'PATTERN LENS — OFFLINE'}`;
        content.appendChild(statusBar);

        // --- Main 3-column grid ---
        const mainGrid = document.createElement('div');
        mainGrid.className = 'scene-main-grid';

        // ===== LEFT: Crystal Rack (Expanded) =====
        const rackObj = document.createElement('div');
        rackObj.className = 'scene-object crystal-rack-panel expanded-rack';
        rackObj.id = 'crystalRackObj';
        rackObj.setAttribute('role', 'button');
        rackObj.setAttribute('aria-label', 'Crystal Rack — click to inspect slots');
        rackObj.setAttribute('tabindex', '0');

        const rackPrompt = document.createElement('div');
        rackPrompt.className = 'interact-prompt';
        rackPrompt.textContent = '[E] INSPECT RACK';
        rackObj.appendChild(rackPrompt);

        const rackHeader = document.createElement('div');
        rackHeader.className = 'rack-header-bar';
        rackHeader.innerHTML = `
            <span class="scene-object-label">◆ CONTAINMENT RACK</span>
            <span class="rack-status-chip">6-CELL MATRIX</span>
        `;
        rackObj.appendChild(rackHeader);

        // Crystal slots grid (Expanded 6 slots: 5 filled + 1 empty)
        const slotsGrid = document.createElement('div');
        slotsGrid.className = 'crystal-slots-grid expanded-grid';
        slotsGrid.id = 'crystalSlotsGrid';

        const seqValues = m.data.sequence; // [4, 9, 19, 39, 79]
        seqValues.forEach((val, idx) => {
            const slot = document.createElement('div');
            slot.className = 'crystal-slot filled';
            slot.innerHTML = `
                <div class="slot-bay-label">BAY 0${idx + 1}</div>
                <div class="slot-crystal-facet"></div>
                <span class="slot-crystal-num">${val.toString().padStart(2, '0')}</span>
                <div class="slot-dock-tag">SECURED</div>
                <div class="slot-bracket bracket-tl"></div>
                <div class="slot-bracket bracket-tr"></div>
                <div class="slot-bracket bracket-bl"></div>
                <div class="slot-bracket bracket-br"></div>
            `;
            slotsGrid.appendChild(slot);
        });

        // Empty drop-target slot (6th slot)
        const emptySlot = document.createElement('div');
        emptySlot.className = 'crystal-slot empty-slot';
        emptySlot.id = 'emptySlotTarget';
        emptySlot.innerHTML = `
            <div class="slot-bay-label">BAY 06</div>
            <div class="empty-slot-laser-sweep"></div>
            <div class="empty-slot-reticle"></div>
            <span class="empty-slot-glyph">?</span>
            <div class="slot-dock-tag awaiting">AWAITING</div>
            <div class="slot-bracket bracket-tl"></div>
            <div class="slot-bracket bracket-tr"></div>
            <div class="slot-bracket bracket-bl"></div>
            <div class="slot-bracket bracket-br"></div>
        `;
        emptySlot.setAttribute('aria-label', 'Empty crystal slot — drop a crystal here');
        slotsGrid.appendChild(emptySlot);
        rackObj.appendChild(slotsGrid);

        const rackFooter = document.createElement('div');
        rackFooter.className = 'rack-footer-telemetry';
        rackFooter.innerHTML = `
            <span class="rack-telemetry-led"></span>
            <span class="rack-telemetry-txt">CONTAINMENT MATRIX: 83.3% ACTIVE</span>
        `;
        rackObj.appendChild(rackFooter);
        mainGrid.appendChild(rackObj);

        // ===== CENTER: Pattern Lens Device (Celestial Quantum Apparatus) =====
        const lensObj = document.createElement('div');
        lensObj.className = 'scene-object pattern-lens-container';
        lensObj.id = 'patternLensObj';

        const lensLabel = document.createElement('div');
        lensLabel.className = 'scene-object-label';
        lensLabel.textContent = '◆ PATTERN LENS DEVICE';
        lensObj.appendChild(lensLabel);

        const lensDevice = document.createElement('div');
        lensDevice.className = 'pattern-lens-device';
        lensDevice.innerHTML = `
            <!-- Ambient Cosmic Nebula Glow & Starlight Bloom -->
            <div class="lens-cosmic-glow-halo"></div>
            
            <!-- 1. Vertical Celestial Alignment Strut Pillar -->
            <div class="lens-vertical-pillar">
                <div class="pillar-beam"></div>
                <div class="pillar-fin fin-top"></div>
                <div class="pillar-fin fin-bottom"></div>
            </div>

            <!-- 2. Outer Camera/Telescope Lens Barrel with Knurled Metal Grip & Optical Specs -->
            <div class="lens-outer-barrel">
                <div class="barrel-knurled-grip"></div>
                <div class="barrel-spec-markings">
                    <span class="spec-txt spec-top">PATTERN LENS // 85mm F/1.2</span>
                    <span class="spec-txt spec-bot">λ 520nm • AR COATED</span>
                    <span class="spec-deg deg-0">0°</span>
                    <span class="spec-deg deg-90">90°</span>
                    <span class="spec-deg deg-180">180°</span>
                    <span class="spec-deg deg-270">270°</span>
                </div>
            </div>

            <!-- 3. Astrolabe Gimbal Rings (matching celestial observatory) -->
            <div class="lens-astrolabe-apparatus">
                <div class="astrolabe-gimbal-ring ring-outer-brass">
                    <span class="gimbal-rune-notch notch-1"></span>
                    <span class="gimbal-rune-notch notch-2"></span>
                    <span class="gimbal-rune-notch notch-3"></span>
                    <span class="gimbal-rune-notch notch-4"></span>
                </div>
                <div class="astrolabe-gimbal-ring ring-mid-titanium"></div>
                <div class="astrolabe-gimbal-ring ring-inner-cyan"></div>
                <div class="astrolabe-energy-orbit orbit-cw"></div>
                <div class="astrolabe-energy-orbit orbit-ccw"></div>
            </div>

            <!-- 4. Precision Mechanical Iris Aperture Blades (Real Optical Camera Shutter) -->
            <div class="lens-iris-assembly" id="lensIris">
                <div class="iris-blade blade-1"></div>
                <div class="iris-blade blade-2"></div>
                <div class="iris-blade blade-3"></div>
                <div class="iris-blade blade-4"></div>
                <div class="iris-blade blade-5"></div>
                <div class="iris-blade blade-6"></div>
                <div class="iris-blade blade-7"></div>
                <div class="iris-blade blade-8"></div>
                <div class="iris-inner-ring"></div>
            </div>

            <!-- 5. Multi-Coated Optical Glass Elements (Curvature, AR Sheen, Specular Glare & Reticle) -->
            <div class="lens-optical-dome">
                <div class="dome-specular-glare"></div>
                <div class="dome-specular-arc"></div>
                <div class="dome-fluorite-coating"></div>
                <div class="dome-fresnel-rings"></div>
                <div class="dome-reticle-crosshair">
                    <span class="reticle-bracket b-tl"></span>
                    <span class="reticle-bracket b-tr"></span>
                    <span class="reticle-bracket b-bl"></span>
                    <span class="reticle-bracket b-br"></span>
                    <span class="reticle-circle-center"></span>
                </div>
            </div>

            <!-- 6. Radiant Quantum Crystal Orb / Core (DEAD CENTER) -->
            <div class="lens-quantum-core" id="lensCore">
                <div class="quantum-singularity-aura"></div>
                <div class="crystal-orb-sphere">
                    <div class="orb-inner-nebula"></div>
                    <div class="orb-faceted-lattice">
                        <div class="orb-facet facet-top"></div>
                        <div class="orb-facet facet-bottom"></div>
                        <div class="orb-facet facet-left"></div>
                        <div class="orb-facet facet-right"></div>
                        <div class="orb-facet facet-diag-tl"></div>
                        <div class="orb-facet facet-diag-tr"></div>
                        <div class="orb-facet facet-diag-bl"></div>
                        <div class="orb-facet facet-diag-br"></div>
                        <div class="orb-facet facet-center-gem"></div>
                    </div>
                    <div class="orb-starburst-singularity"></div>
                </div>
                <!-- Alignment Laser Beams & Anamorphic Streak -->
                <div class="lens-laser-crosshair beam-h"></div>
                <div class="lens-laser-crosshair beam-v"></div>
                <div class="lens-anamorphic-streak"></div>
            </div>
        `;
        lensObj.appendChild(lensDevice);

        // Real-Time Telemetry Badge
        const telemetryBadge = document.createElement('div');
        telemetryBadge.className = 'lens-astral-telemetry';
        telemetryBadge.innerHTML = `
            <span class="telemetry-badge"><span class="badge-pulse-dot"></span>CELESTIAL LENS</span>
            <span class="telemetry-res" id="lensResonanceTelemetry">RES: 0.00 Hz</span>
        `;
        lensObj.appendChild(telemetryBadge);

        // Interactive 3D Cursor Tracking Parallax on Pattern Lens
        lensObj.addEventListener('pointermove', (e) => {
            const rect = lensObj.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            lensDevice.style.setProperty('--lens-tilt-x', `${(-y * 15).toFixed(2)}deg`);
            lensDevice.style.setProperty('--lens-tilt-y', `${(x * 15).toFixed(2)}deg`);
            lensDevice.style.setProperty('--lens-glare-x', `${(50 + x * 65).toFixed(1)}%`);
            lensDevice.style.setProperty('--lens-glare-y', `${(45 + y * 65).toFixed(1)}%`);
        });

        lensObj.addEventListener('pointerleave', () => {
            lensDevice.style.setProperty('--lens-tilt-x', '0deg');
            lensDevice.style.setProperty('--lens-tilt-y', '0deg');
            lensDevice.style.setProperty('--lens-glare-x', '35%');
            lensDevice.style.setProperty('--lens-glare-y', '30%');
        });

        const lensStatusLabel = document.createElement('div');
        lensStatusLabel.className = 'lens-status-label';
        lensStatusLabel.id = 'lensStatusLabel';
        lensStatusLabel.textContent = 'DORMANT • AWAITING CRYSTAL';
        lensObj.appendChild(lensStatusLabel);

        mainGrid.appendChild(lensObj);

        // ===== RIGHT: Ultra-Premium Control Panel with Loose Crystals =====
        const panelObj = document.createElement('div');
        panelObj.className = 'scene-object control-panel-display premium-terminal';
        panelObj.id = 'controlPanelObj';
        panelObj.setAttribute('role', 'button');
        panelObj.setAttribute('aria-label', 'Control Panel — shows sequence monitor and resonance crucible');

        const panelPrompt = document.createElement('div');
        panelPrompt.className = 'interact-prompt';
        panelPrompt.textContent = '[E] INSPECT PANEL';
        panelObj.appendChild(panelPrompt);

        const panelHeader = document.createElement('div');
        panelHeader.className = 'terminal-header-bar';
        panelHeader.innerHTML = `
            <span class="scene-object-label">◆ SPECTRAL ANALYSIS TERMINAL</span>
            <span class="terminal-status-chip">SCAN: ACTIVE</span>
        `;
        panelObj.appendChild(panelHeader);

        // Upper Holographic HUD Screen
        const terminalHud = document.createElement('div');
        terminalHud.className = 'terminal-hud-screen';

        // Equalizer Spectrum Visualizer
        const spectrumVisualizer = document.createElement('div');
        spectrumVisualizer.className = 'terminal-spectrum-visualizer';
        for (let i = 0; i < 14; i++) {
            const bar = document.createElement('div');
            bar.className = 'spectrum-bar';
            bar.style.animationDelay = `${(i * 0.11).toFixed(2)}s`;
            spectrumVisualizer.appendChild(bar);
        }
        terminalHud.appendChild(spectrumVisualizer);

        // Sequence display
        const seqDisplay = document.createElement('div');
        seqDisplay.className = 'sequence-display';

        seqValues.forEach((val, idx) => {
            const node = document.createElement('span');
            node.className = 'seq-display-node';
            node.textContent = val;
            seqDisplay.appendChild(node);

            const arrow = document.createElement('span');
            arrow.className = 'seq-display-arrow';
            arrow.textContent = '➔';
            seqDisplay.appendChild(arrow);
        });

        const targetNode = document.createElement('span');
        targetNode.className = 'seq-display-node target';
        targetNode.id = 'seqTargetNode';
        targetNode.textContent = '?';
        seqDisplay.appendChild(targetNode);
        terminalHud.appendChild(seqDisplay);

        const terminalTelemetry = document.createElement('div');
        terminalTelemetry.className = 'terminal-telemetry-row';
        terminalTelemetry.innerHTML = `
            <span>SERIES: MULTI-STEP</span>
            <span class="telemetry-lock-target">TARGET: FREQUENCY LOCK</span>
        `;
        terminalHud.appendChild(terminalTelemetry);
        panelObj.appendChild(terminalHud);

        // --- Loose Crystals Area (inside Control Panel block!) ---
        const looseCrystalsArea = document.createElement('div');
        looseCrystalsArea.className = 'loose-crystals-area in-terminal';

        const looseCrystalsLabel = document.createElement('div');
        looseCrystalsLabel.className = 'scene-object-label crucible-header';
        looseCrystalsLabel.innerHTML = '<span>◆ RESONANCE CRUCIBLE</span><span class="crucible-sublabel">SELECT / DRAG SHARD</span>';
        looseCrystalsArea.appendChild(looseCrystalsLabel);

        const looseCrystalsRow = document.createElement('div');
        looseCrystalsRow.className = 'loose-crystals-row';

        // Shuffle crystals for display variety
        const shuffledCrystals = [...m.data.crystals].sort(() => Math.random() - 0.5);

        shuffledCrystals.forEach(crystal => {
            const cEl = document.createElement('div');
            cEl.className = 'crystal-draggable';
            cEl.id = crystal.id;
            cEl.draggable = true;
            cEl.setAttribute('role', 'button');
            cEl.setAttribute('aria-label', `Crystal ${crystal.label}`);
            cEl.setAttribute('tabindex', '0');
            cEl.dataset.value = crystal.label;
            cEl.dataset.correct = crystal.correct.toString();

            cEl.innerHTML = `
                <div class="crystal-facet-shard"></div>
                <div class="crystal-inner-plasma"></div>
                <div class="crystal-light-sheen"></div>
                <span class="crystal-val-label">${crystal.label}</span>
                <div class="crystal-corner-glow"></div>
            `;

            // --- HTML5 Drag Events ---
            cEl.addEventListener('dragstart', (e) => {
                if (sceneState.phase === 'validated' || sceneState.phase === 'activating' || sceneState.phase === 'completed') return;
                sceneState.phase = 'dragging';
                sceneState.draggedCrystal = crystal;
                e.dataTransfer.setData('text/plain', crystal.label);
                e.dataTransfer.effectAllowed = 'move';
                playSfx('select');
                setTimeout(() => {
                    cEl.classList.add('dragging');
                }, 0);
            });
            cEl.addEventListener('dragend', () => {
                cEl.classList.remove('dragging');
                if (sceneState.phase === 'dragging') sceneState.phase = 'rack_opened';
            });

            // --- Click to place support ---
            cEl.addEventListener('click', () => {
                if (sceneState.phase === 'validated' || sceneState.phase === 'activating' || sceneState.phase === 'completed' || cEl.classList.contains('placed')) return;
                handleCrystalDrop(crystal, cEl);
            });

            // --- Touch Drag Support ---
            cEl.addEventListener('touchstart', (e) => {
                if (sceneState.phase === 'validated' || sceneState.phase === 'activating' || sceneState.phase === 'completed') return;
                e.preventDefault();
                sceneState.phase = 'dragging';
                sceneState.draggedCrystal = crystal;
                sceneState.touchSource = cEl;
                cEl.classList.add('dragging');
                playSfx('select');

                // Create ghost
                const ghost = document.createElement('div');
                ghost.className = 'crystal-touch-ghost';
                ghost.textContent = crystal.label;
                const touch = e.touches[0];
                ghost.style.left = touch.clientX + 'px';
                ghost.style.top = touch.clientY + 'px';
                document.body.appendChild(ghost);
                sceneState.touchGhost = ghost;
            }, { passive: false });

            cEl.addEventListener('touchmove', (e) => {
                if (!sceneState.touchGhost) return;
                e.preventDefault();
                const touch = e.touches[0];
                sceneState.touchGhost.style.left = touch.clientX + 'px';
                sceneState.touchGhost.style.top = touch.clientY + 'px';

                // Highlight drop target on hover
                const targetRect = emptySlot.getBoundingClientRect();
                const isOver = touch.clientX >= targetRect.left && touch.clientX <= targetRect.right &&
                               touch.clientY >= targetRect.top && touch.clientY <= targetRect.bottom;
                emptySlot.classList.toggle('drag-hover', isOver);
            }, { passive: false });

            cEl.addEventListener('touchend', (e) => {
                if (!sceneState.touchGhost || !sceneState.draggedCrystal) return;
                e.preventDefault();

                const touch = e.changedTouches[0];
                const targetRect = emptySlot.getBoundingClientRect();
                const isOver = touch.clientX >= targetRect.left && touch.clientX <= targetRect.right &&
                               touch.clientY >= targetRect.top && touch.clientY <= targetRect.bottom;

                emptySlot.classList.remove('drag-hover');

                if (isOver) {
                    handleCrystalDrop(sceneState.draggedCrystal, cEl);
                } else {
                    cEl.classList.remove('dragging');
                    sceneState.phase = 'rack_opened';
                }

                // Cleanup ghost
                if (sceneState.touchGhost) {
                    sceneState.touchGhost.remove();
                    sceneState.touchGhost = null;
                }
                sceneState.touchSource = null;
            }, { passive: false });

            // Hover SFX (once)
            let hasHovered = false;
            cEl.addEventListener('mouseenter', () => {
                if (!hasHovered) { playSfx('chirp'); hasHovered = true; }
            });

            looseCrystalsRow.appendChild(cEl);
        });

        looseCrystalsArea.appendChild(looseCrystalsRow);
        panelObj.appendChild(looseCrystalsArea);
        mainGrid.appendChild(panelObj);
        content.appendChild(mainGrid);

        scene.appendChild(content);
        dom.gameplayStage.appendChild(scene);

        // --- Drop Target Events (HTML5 Drag API) ---
        emptySlot.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            emptySlot.classList.add('drag-hover');
        });
        emptySlot.addEventListener('dragleave', () => {
            emptySlot.classList.remove('drag-hover');
        });
        emptySlot.addEventListener('drop', (e) => {
            e.preventDefault();
            emptySlot.classList.remove('drag-hover');
            if (!sceneState.draggedCrystal) return;

            const dragSource = document.getElementById(sceneState.draggedCrystal.id);
            handleCrystalDrop(sceneState.draggedCrystal, dragSource);
        });

        // --- Keyboard support: E key to open rack ---
        const keyHandler = (e) => {
            if (e.key === 'e' || e.key === 'E') {
                if (sceneState.phase === 'explore') {
                    sceneState.phase = 'rack_opened';
                    updateDialogue('ECHO:', 'One resonance crystal is missing! Examine the loose crystals and drag the correct one into the empty slot.');
                    playSfx('select');
                }
            }
        };
        window.addEventListener('keydown', keyHandler);

        // Hover SFX for main objects
        let rackHovered = false, panelHovered = false;
        rackObj.addEventListener('mouseenter', () => { if (!rackHovered) { playSfx('chirp'); rackHovered = true; } });
        panelObj.addEventListener('mouseenter', () => { if (!panelHovered) { playSfx('chirp'); panelHovered = true; } });

        // Click rack to update dialogue
        rackObj.addEventListener('click', () => {
            if (sceneState.phase === 'explore' || sceneState.phase === 'rack_opened') {
                sceneState.phase = 'rack_opened';
                updateDialogue('ECHO:', 'One resonance crystal is missing! Drag the correct crystal into the empty slot to complete the harmonic series.');
                playSfx('click');
            }
        });

        // Click panel to inspect
        panelObj.addEventListener('click', () => {
            updateDialogue('BYTE:', 'Study the progression differences between consecutive terms.');
            playSfx('click');
        });

        // --- Crystal Drop Handler ---
        function handleCrystalDrop(crystal, sourceEl) {
            if (crystal.correct) {
                // === CORRECT CRYSTAL ===
                sceneState.phase = 'validated';
                sourceEl.classList.remove('dragging');
                sourceEl.classList.add('placed');
                emptySlot.innerHTML = `
                    <div class="slot-bay-label">BAY 06</div>
                    <div class="slot-crystal-facet"></div>
                    <span class="slot-crystal-num">${crystal.label}</span>
                    <div class="slot-dock-tag secured">SECURED</div>
                    <div class="slot-bracket bracket-tl"></div>
                    <div class="slot-bracket bracket-tr"></div>
                    <div class="slot-bracket bracket-bl"></div>
                    <div class="slot-bracket bracket-br"></div>
                `;
                emptySlot.classList.add('accepted', 'filled');
                emptySlot.classList.remove('empty-slot');

                const seqTarget = document.getElementById('seqTargetNode');
                if (seqTarget) { seqTarget.textContent = crystal.label; seqTarget.classList.remove('target'); }

                updateDialogue('NOVA:', '✦ Resonance locked! The Pattern Lens is fully restored.');
                playSfx('success');

                // Disable all other crystals
                document.querySelectorAll('.crystal-draggable').forEach(c => {
                    c.draggable = false;
                    c.style.pointerEvents = 'none';
                });

                // Start lens activation after brief pause
                setTimeout(() => playLensActivation(), 800);
            } else {
                // === WRONG CRYSTAL ===
                sourceEl.classList.remove('dragging');
                emptySlot.classList.add('reject-flash');
                sceneState.phase = 'rack_opened';

                // Red glow and shake the center Pattern Lens (no center text banner)
                const centerLens = document.getElementById('patternLensObj') || lensObj;
                if (centerLens) {
                    centerLens.classList.remove('reject-shake');
                    void centerLens.offsetWidth; // trigger reflow
                    centerLens.classList.add('reject-shake');
                    setTimeout(() => centerLens.classList.remove('reject-shake'), 750);
                }

                const lensStatus = document.getElementById('lensStatusLabel');
                if (lensStatus) {
                    lensStatus.textContent = '⚠ HARMONIC REJECTION';
                    lensStatus.classList.add('status-reject');
                    setTimeout(() => {
                        if (sceneState.phase !== 'validated' && sceneState.phase !== 'activating' && sceneState.phase !== 'completed') {
                            lensStatus.textContent = 'DORMANT • AWAITING CRYSTAL';
                            lensStatus.classList.remove('status-reject');
                        }
                    }, 1800);
                }

                updateDialogue('BYTE:', 'Resonance mismatch! Check the gap progression and try again.');
                handleError(m);

                setTimeout(() => {
                    emptySlot.classList.remove('reject-flash');
                }, 500);
            }
        }

        // --- Lens Activation Cinematic ---
        function playLensActivation() {
            sceneState.phase = 'activating';
            scene.style.pointerEvents = 'none';

            // Add activated class for CSS transitions & power-up animations
            scene.classList.add('lens-activated');
            const centerLens = document.getElementById('patternLensObj') || lensObj;
            if (centerLens) {
                centerLens.classList.add('lens-online-pulse');
            }

            // Update status bar
            const sBar = document.getElementById('sceneStatusBar');
            if (sBar) {
                sBar.classList.add('active');
                sBar.innerHTML = `<span class="status-dot"></span> PATTERN LENS — ONLINE`;
            }

            // Update lens status and telemetry
            const lensLabel = document.getElementById('lensStatusLabel');
            if (lensLabel) {
                lensLabel.textContent = '✦ ONLINE (HARMONIZED)';
                lensLabel.classList.add('status-online');
            }
            const telem = document.getElementById('lensResonanceTelemetry');
            if (telem) telem.textContent = 'RES: 159.00 Hz (LOCKED)';

            // Flash effect
            const flash = document.getElementById('sceneFlash');
            if (flash) flash.classList.add('flash-active');

            // Spawn particles from center
            spawnParticles();

            // Update stability gauge
            if (dom.stabilityFill) dom.stabilityFill.style.width = '100%';
            if (dom.stabilityPctText) dom.stabilityPctText.textContent = '100%';
            if (dom.machineChassis) dom.machineChassis.className = 'hud-card square-reactor-card state-success';

            // Warp SFX
            playSfx('warp');

            updateDialogue('NOVA:', '✦ The Pattern Lens is restored! Energy flows through the Observatory once more.');

            // After lens activation cinematic, complete the mission (no blocking center text banner)
            gameState.pendingCompleteCutscene = 1;
            setTimeout(() => {
                sceneState.phase = 'completed';
                scene.style.pointerEvents = '';
                window.removeEventListener('keydown', keyHandler);

                // Call the existing success handler
                const demoAns = (DEMO_MODE_FALLBACK_SOLUTIONS[1] && DEMO_MODE_FALLBACK_SOLUTIONS[1].correctAnswer) || '159';
                checkAnswer(demoAns);
            }, 1200);
        }

        // --- Particle Burst Effect ---
        function spawnParticles() {
            const burst = document.getElementById('sceneBurst');
            if (!burst) return;

            for (let i = 0; i < 24; i++) {
                const p = document.createElement('div');
                p.className = 'scene-particle';

                const angle = (Math.PI * 2 / 24) * i + (Math.random() * 0.5);
                const dist = 60 + Math.random() * 120;
                const dx = Math.cos(angle) * dist;
                const dy = Math.sin(angle) * dist;

                p.style.left = '50%';
                p.style.top = '45%';
                p.style.setProperty('--dx', dx + 'px');
                p.style.setProperty('--dy', dy + 'px');
                p.style.animationDelay = (Math.random() * 0.4) + 's';
                p.style.background = Math.random() > 0.5 ? 'var(--cyan-neon)' : 'var(--purple-neon)';
                p.style.boxShadow = Math.random() > 0.5 ? '0 0 6px var(--cyan-neon)' : '0 0 6px var(--purple-neon)';

                burst.appendChild(p);
                requestAnimationFrame(() => p.classList.add('burst'));
            }
        }

        // --- Update dialogue text ---
        function updateDialogue(speaker, text) {
            const el = document.getElementById('sceneDialogue');
            if (el) {
                el.innerHTML = `<span class="dialogue-speaker">${speaker}</span> ${text}`;
            }
        }
    }

    // ==========================================================================
    // SHARED SCENE BUILDER UTILITIES (Missions 1–10 Interactive Environments)
    // ==========================================================================

    function createSceneShell(missionId, systemLabel, successBannerText, rejectBannerText) {
        const scene = document.createElement('div');
        scene.className = 'interactive-scene';
        scene.id = `interactiveScene_M${missionId}`;

        scene.innerHTML = `
            <div class="scene-layer scene-layer-far"></div>
            <div class="scene-layer scene-layer-mid"></div>
            <div class="scene-ambient-pulse"></div>
            <div class="scene-layer scene-layer-fore"></div>
            <div class="scene-activation-flash" id="sceneFlash_M${missionId}"></div>
            <div class="scene-particles-burst" id="sceneBurst_M${missionId}"></div>
        `;
        return scene;
    }

    function createSceneStatusBar(systemLabel, statusText) {
        const bar = document.createElement('div');
        bar.className = 'scene-status-bar';
        bar.innerHTML = `
            <div class="status-left">
                <span class="status-dot"></span>
                <span class="status-system">${systemLabel}</span>
            </div>
            ${statusText ? `<div class="status-mode">STATUS: <span class="status-mode-val">${statusText}</span></div>` : ''}
        `;
        return bar;
    }

    function createSceneDialogueOverlay(speaker, text) {
        const dlg = document.createElement('div');
        dlg.className = 'scene-dialogue-overlay';
        dlg.innerHTML = `
            <div class="dialogue-text">
                <span class="dialogue-speaker">${speaker}</span> ${text}
            </div>
        `;
        return dlg;
    }

    /**
     * Creates a Formula Hint Overlay panel — glassmorphism panel showing
     * the variable-based formula hint for a mission's scene.
     * @param {string} formulaHint - The variable formula text (e.g. "T[n] = 2 × T[n-1] + 1")
     * @param {string} [title] - Optional header title for the hint box
     * @returns {HTMLElement}
     */
    function createFormulaHintOverlay(formulaHint, title) {
        const overlay = document.createElement('div');
        overlay.className = 'formula-hint-overlay';
        overlay.innerHTML = `
            <div class="formula-hint-header">${title || '◆ FORMULA HINT'}</div>
            <div class="formula-hint-body">${formulaHint}</div>
        `;
        return overlay;
    }

    function playSceneSuccessSequence(scene, missionId, correctVal, callback, customDialogue) {
        gameState.pendingCompleteCutscene = missionId;
        scene.classList.add('lens-activated');
        scene.style.pointerEvents = 'none';

        const flash = document.getElementById(`sceneFlash_M${missionId}`) || document.getElementById('sceneFlash');
        if (flash) flash.classList.add('flash');

        spawnSceneParticles(missionId);

        if (dom.stabilityFill) dom.stabilityFill.style.width = '100%';
        if (dom.stabilityPctText) dom.stabilityPctText.textContent = '100%';
        if (dom.machineChassis) dom.machineChassis.className = 'hud-card square-reactor-card state-success';

        playSfx('warp');

        const dlg = scene.querySelector('.scene-dialogue-overlay .dialogue-text');
        if (dlg && customDialogue) {
            dlg.innerHTML = customDialogue;
        }

        setTimeout(() => {
            scene.style.pointerEvents = '';
            if (callback) callback();
            else checkAnswer(correctVal);
        }, 800);
    }

    function triggerSceneReject(missionId, customMessage) {
        const mission = (missionId !== undefined && missionId !== null) 
            ? (CHAPTER_MISSIONS[missionId - 1] || CHAPTER_MISSIONS[gameState.currentMissionIndex]) 
            : CHAPTER_MISSIONS[gameState.currentMissionIndex];

        if (mission) {
            handleError(mission);
        } else {
            playSfx('error');
            if (dom.machineChassis) {
                dom.machineChassis.className = 'hud-card square-reactor-card state-error';
                setTimeout(() => {
                    if (dom.machineChassis && dom.machineChassis.className.includes('state-error')) {
                        dom.machineChassis.className = 'hud-card square-reactor-card';
                    }
                }, 1200);
            }
        }

        const banner = document.getElementById(`sceneRejectBanner_M${missionId}`) || document.getElementById('sceneRejectBanner');
        if (banner) {
            if (customMessage) banner.textContent = customMessage;
            banner.classList.remove('show');
            void banner.offsetWidth; // trigger reflow
            banner.classList.add('show');
            setTimeout(() => banner.classList.remove('show'), 2200);
        }
    }

    function spawnSceneParticles(missionId) {
        const burst = document.getElementById(`sceneBurst_M${missionId}`) || document.getElementById('sceneBurst');
        if (!burst) return;
        burst.innerHTML = '';
        for (let i = 0; i < 28; i++) {
            const p = document.createElement('div');
            p.className = 'scene-particle';
            const angle = (Math.PI * 2 / 28) * i + (Math.random() * 0.4);
            const dist = 70 + Math.random() * 130;
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist;
            p.style.left = '50%';
            p.style.top = '48%';
            p.style.setProperty('--dx', dx + 'px');
            p.style.setProperty('--dy', dy + 'px');
            p.style.animationDelay = (Math.random() * 0.35) + 's';
            p.style.background = Math.random() > 0.5 ? 'var(--cyan-neon)' : (Math.random() > 0.5 ? 'var(--purple-neon)' : '#fbbf24');
            p.style.boxShadow = '0 0 8px currentColor';
            burst.appendChild(p);
            requestAnimationFrame(() => p.classList.add('burst'));
        }
    }

    // ==========================================================================
    // MISSION 2: PATTERN DIAL SCENE — "Align the Crystal Rings"
    // Center Object: 2.5D ROTARY CRYSTAL RINGS CALIBRATOR DEVICE
    // ==========================================================================
    // ==========================================================================
    // MISSION 2: CELESTIAL GYROSCOPIC ENGINE — "Calibrate Gyroscopic Engine"
    // Center Object: 2.5D / 3D CELESTIAL GYROSCOPIC ARMILLARY ENGINE (Matching Artwork)
    // ==========================================================================
    function renderDialScene(m) {
        const scene = createSceneShell(2, 'SYSTEM: GYRO ENGINE // CALIBRATOR', 'GYROSCOPIC ENGINE CALIBRATED', 'HARMONIC MISMATCH — RE-CALIBRATE');
        const content = document.createElement('div');
        content.className = 'scene-content';

        let currentVal = m.data.initial || 25;
        const minVal = m.data.min || 10;
        const maxVal = m.data.max || 80;
        const demoAns = (DEMO_MODE_FALLBACK_SOLUTIONS[2] && DEMO_MODE_FALLBACK_SOLUTIONS[2].correctAnswer) || '37';
        const targetAns = parseInt(demoAns, 10);

        const statusBar = createSceneStatusBar('SYSTEM: GYRO ENGINE', 'UNBALANCED // BODMAS CALIBRATION');
        content.appendChild(statusBar);

        const mainGrid = document.createElement('div');
        mainGrid.className = 'scene-main-grid dial-scene-grid';

        // ===== LEFT: BODMAS Arithmetic Calibration Equation =====
        const cluePanel = document.createElement('div');
        cluePanel.className = 'scene-object dial-clue-panel premium-terminal';
        cluePanel.innerHTML = `
            <div class="terminal-header-bar">
                <span class="scene-object-label">◆ CALIBRATION EQUATION</span>
                <span class="terminal-status-chip">TARGET FREQ</span>
            </div>
            
            <div class="bodmas-formula-card standalone-formula">
                <div class="formula-header-tag">CALCULATE OPTIMAL FREQUENCY</div>
                <div class="formula-math-display">${m.data.formulaDisplay || '(120 ÷ 6) + (4 × 8) - 15'} = <span class="formula-target-qmark">? Hz</span></div>
            </div>
        `;

        // ===== CENTER: 3D Floating Celestial Gyroscopic Engine =====
        const deviceContainer = document.createElement('div');
        deviceContainer.className = 'scene-object gyro-engine-container';
        deviceContainer.id = 'dialDeviceObj';
        deviceContainer.innerHTML = `
            <div class="scene-object-label">◆ FLOATING GYROSCOPIC ENGINE</div>
            
            <div class="gyro-engine-apparatus" id="gyroApparatus">
                <!-- Floating Antigravity Cosmic Starlight Aura -->
                <div class="gyro-cosmic-glow"></div>

                <!-- Containment Laser Alignment Beams -->
                <div class="gyro-laser-axis axis-h"></div>
                <div class="gyro-laser-axis axis-v"></div>

                <!-- 1. Outer Mechanical Titanium-Cyan Gimbal Ring (Yaw/Pitch Orbit) -->
                <div class="gyro-gimbal-ring gyro-ring-outer-cyan" id="gyroRing1">
                    <span class="gimbal-pivot pivot-top"></span>
                    <span class="gimbal-pivot pivot-bottom"></span>
                    <span class="gimbal-pivot pivot-left"></span>
                    <span class="gimbal-pivot pivot-right"></span>
                    <span class="gyro-rune r-1">᚛✦᚜</span>
                    <span class="gyro-rune r-2">᚛ᛟ᚜</span>
                    <span class="gyro-rune r-3">᚛ᚱ᚜</span>
                    <span class="gyro-rune r-4">᚛ᛊ᚜</span>
                </div>

                <!-- 2. Middle Inclined Golden Armillary Orbit Ring (Precession Roll) -->
                <div class="gyro-gimbal-ring gyro-ring-inclined-gold" id="gyroRing2">
                    <span class="gyro-node-dot nd-1"></span>
                    <span class="gyro-node-dot nd-2"></span>
                    <span class="gyro-node-dot nd-3"></span>
                    <span class="gyro-node-dot nd-4"></span>
                </div>

                <!-- 3. Inner High-Frequency Rotor Ring with Graduation Scale -->
                <div class="gyro-gimbal-ring gyro-ring-inner-purple" id="gyroRing3">
                    <div class="dial-graduations-scale"></div>
                    <div class="dial-laser-needle-ray" id="dialNeedleRay">
                        <div class="laser-needle-tip"></div>
                    </div>
                </div>

                <!-- 4. Center: Floating Glowing Energy Core Engine -->
                <div class="gyro-core-engine" id="gyroCoreEngine">
                    <div class="core-singularity-aura" id="coreAura"></div>
                    <div class="core-energy-orb">
                        <div class="core-inner-plasma"></div>
                        <div class="star-facet facet-core-top"></div>
                        <div class="star-facet facet-core-bottom"></div>
                        <div class="star-facet facet-core-left"></div>
                        <div class="star-facet facet-core-right"></div>
                        <div class="star-facet facet-core-diag-tl"></div>
                        <div class="star-facet facet-core-diag-tr"></div>
                        <div class="star-facet facet-core-diag-bl"></div>
                        <div class="star-facet facet-core-diag-br"></div>
                        <div class="star-facet facet-core-center"></div>
                    </div>
                    <div class="core-quantum-spark"></div>
                </div>
            </div>

            <!-- Live Telemetry & Digital Readout Bar -->
            <div class="gyro-telemetry-hud">
                <div class="gyro-readout-pill">
                    <span class="readout-label">FREQ:</span>
                    <span class="readout-number" id="dialValDisplay">${currentVal}</span>
                    <span class="readout-unit">Hz</span>
                </div>
                <div class="gyro-resonance-state" id="dialResonanceState">
                    <span class="state-pulse-led"></span>
                    <span class="state-txt" id="dialResonanceTxt">STATUS: TUNING</span>
                </div>
            </div>

            <!-- Status Label -->
            <div class="gyro-status-label" id="dialStatusBadge">GYRO ENGINE • UNSTABLE ROTATION</div>
        `;

        // Interactive 3D Cursor Tracking Parallax on Gyroscopic Engine
        deviceContainer.addEventListener('pointermove', (e) => {
            const rect = deviceContainer.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            deviceContainer.style.setProperty('--gyro-tilt-x', `${(-y * 18).toFixed(2)}deg`);
            deviceContainer.style.setProperty('--gyro-tilt-y', `${(x * 18).toFixed(2)}deg`);
            deviceContainer.style.setProperty('--gyro-glare-x', `${(50 + x * 60).toFixed(1)}%`);
            deviceContainer.style.setProperty('--gyro-glare-y', `${(45 + y * 60).toFixed(1)}%`);
        });

        deviceContainer.addEventListener('pointerleave', () => {
            deviceContainer.style.setProperty('--gyro-tilt-x', '0deg');
            deviceContainer.style.setProperty('--gyro-tilt-y', '0deg');
            deviceContainer.style.setProperty('--gyro-glare-x', '35%');
            deviceContainer.style.setProperty('--gyro-glare-y', '30%');
        });

        // ===== RIGHT: Tactile Frequency Controller Console =====
        const controlsPanel = document.createElement('div');
        controlsPanel.className = 'scene-object dial-controls-panel premium-terminal minimal-calibrator';
        controlsPanel.innerHTML = `
            <div class="terminal-header-bar">
                <span class="scene-object-label">◆ ROTARY CALIBRATOR</span>
                <span class="terminal-status-chip">FREQ TUNER</span>
            </div>
            
            <!-- Minimalist Digital Frequency Readout Pod -->
            <div class="minimal-readout-pod">
                <div class="readout-caption">ACTIVE FREQUENCY</div>
                <div class="readout-digital-val">
                    <span class="readout-hz-num" id="currentSliderHz">${currentVal}</span>
                    <span class="readout-hz-unit">Hz</span>
                </div>
                <div class="readout-accent-line"></div>
            </div>

            <!-- Precision Minimalist Cyber Slider -->
            <div class="frequency-slider-wrapper minimal-slider-wrap">
                <div class="slider-labels-row">
                    <span class="slider-limit-txt">${minVal} Hz</span>
                    <span class="slider-track-title">PRECISION TUNING</span>
                    <span class="slider-limit-txt">${maxVal} Hz</span>
                </div>
            </div>
        `;

        const sliderRow = document.createElement('div');
        sliderRow.className = 'dial-slider-row';
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'cyber-range-slider plasma-track-slider minimal-slider';
        slider.min = minVal;
        slider.max = maxVal;
        slider.step = m.data.step || 1;
        slider.value = currentVal;
        slider.id = 'gyroRangeInput';
        slider.addEventListener('input', (e) => updateVal(parseInt(e.target.value, 10), false));
        sliderRow.appendChild(slider);
        controlsPanel.querySelector('.frequency-slider-wrapper').appendChild(sliderRow);

        // Segmented Micro-Step Tuning Bar (-10, -1, +1, +10)
        const stepSection = document.createElement('div');
        stepSection.className = 'dial-step-section minimal-step-section';
        stepSection.innerHTML = `<div class="dial-sub-header">STEP ADJUSTMENT</div>`;

        const stepBtnsRow = document.createElement('div');
        stepBtnsRow.className = 'dial-step-btns-row minimal-segmented-bar';

        const btnMinus10 = document.createElement('button');
        btnMinus10.className = 'dial-step-btn btn-neg-10';
        btnMinus10.textContent = '-10';
        btnMinus10.title = 'Decrease frequency by 10 Hz';
        btnMinus10.addEventListener('click', () => updateVal(currentVal - 10));

        const btnMinus1 = document.createElement('button');
        btnMinus1.className = 'dial-step-btn btn-neg-1';
        btnMinus1.textContent = '-1';
        btnMinus1.title = 'Decrease frequency by 1 Hz';
        btnMinus1.addEventListener('click', () => updateVal(currentVal - 1));

        const btnPlus1 = document.createElement('button');
        btnPlus1.className = 'dial-step-btn btn-pos-1';
        btnPlus1.textContent = '+1';
        btnPlus1.title = 'Increase frequency by 1 Hz';
        btnPlus1.addEventListener('click', () => updateVal(currentVal + 1));

        const btnPlus10 = document.createElement('button');
        btnPlus10.className = 'dial-step-btn btn-pos-10';
        btnPlus10.textContent = '+10';
        btnPlus10.title = 'Increase frequency by 10 Hz';
        btnPlus10.addEventListener('click', () => updateVal(currentVal + 10));

        stepBtnsRow.appendChild(btnMinus10);
        stepBtnsRow.appendChild(btnMinus1);
        stepBtnsRow.appendChild(btnPlus1);
        stepBtnsRow.appendChild(btnPlus10);
        stepSection.appendChild(stepBtnsRow);
        controlsPanel.appendChild(stepSection);

        // Real-Time Value Updater (Neutral during tuning)
        function updateVal(newVal, updateSlider = true) {
            currentVal = Math.max(minVal, Math.min(maxVal, newVal));
            const display = document.getElementById('dialValDisplay');
            if (display) display.textContent = currentVal;
            
            const sliderHz = document.getElementById('currentSliderHz');
            if (sliderHz) sliderHz.textContent = currentVal;

            if (updateSlider) slider.value = currentVal;

            // Needle Ray rotation: minVal -> -140deg, maxVal -> +140deg (total 280deg arc)
            const needleRay = document.getElementById('dialNeedleRay');
            if (needleRay) {
                const pct = (currentVal - minVal) / (maxVal - minVal);
                const angle = pct * 280 - 140;
                needleRay.style.transform = `rotate(${angle}deg)`;
            }

            // Keep status neutral while tuning (do not reveal correctness)
            const resState = document.getElementById('dialResonanceState');
            const resTxt = document.getElementById('dialResonanceTxt');
            if (resTxt && resState && !deviceContainer.classList.contains('aligned')) {
                resState.className = 'gyro-resonance-state';
                resTxt.textContent = 'TUNING FREQUENCY';
            }

            playSfx('select');
        }

        // Action CTA Button — Validation happens ONLY here upon clicking
        const actionBtn = createActionButton(m.actionLabel || 'CALIBRATE GYRO ENGINE →', () => {
            if (currentVal === targetAns) {
                // === CORRECT FREQUENCY ===
                const badge = document.getElementById('dialStatusBadge');
                if (badge) {
                    badge.textContent = `✦ GYRO ENGINE LOCKED (${targetAns} Hz)`;
                    badge.classList.remove('status-reject');
                    badge.classList.add('locked');
                }
                const resState = document.getElementById('dialResonanceState');
                const resTxt = document.getElementById('dialResonanceTxt');
                if (resState && resTxt) {
                    resState.className = 'gyro-resonance-state harmonized';
                    resTxt.textContent = '✦ HARMONIC LOCK';
                }

                deviceContainer.classList.remove('reject-shake');
                deviceContainer.classList.add('aligned', 'gyro-online-pulse');
                scene.classList.add('lens-activated', 'gyro-activated');
                playSceneSuccessSequence(scene, 2, String(targetAns), null, `<span class="dialogue-speaker">BYTE:</span> ✦ Gyroscopic Engine calibrated at ${targetAns} Hz! Power systems synchronized.`);
            } else {
                // === WRONG FREQUENCY ===
                deviceContainer.classList.remove('reject-shake');
                void deviceContainer.offsetWidth; // trigger reflow
                deviceContainer.classList.add('reject-shake');
                setTimeout(() => deviceContainer.classList.remove('reject-shake'), 750);

                const badge = document.getElementById('dialStatusBadge');
                if (badge) {
                    badge.textContent = `⚠ FREQUENCY MISMATCH (${currentVal} Hz)`;
                    badge.classList.add('status-reject');
                    setTimeout(() => {
                        if (!deviceContainer.classList.contains('aligned')) {
                            badge.textContent = 'GYRO ENGINE • UNSTABLE ROTATION';
                            badge.classList.remove('status-reject');
                        }
                    }, 1800);
                }
                const resState = document.getElementById('dialResonanceState');
                const resTxt = document.getElementById('dialResonanceTxt');
                if (resState && resTxt) {
                    resState.className = 'gyro-resonance-state reject-state';
                    resTxt.textContent = 'MISALIGNED';
                    setTimeout(() => {
                        if (!deviceContainer.classList.contains('aligned')) {
                            resState.className = 'gyro-resonance-state';
                            resTxt.textContent = 'TUNING FREQUENCY';
                        }
                    }, 1800);
                }

                const dlg = scene.querySelector('.scene-dialogue-overlay .dialogue-text');
                if (dlg) {
                    dlg.innerHTML = `<span class="dialogue-speaker">BYTE:</span> Frequency ${currentVal} Hz rejected — Harmonic instability! Use BODMAS: (120 ÷ 6) + (4 × 8) - 15.`;
                }

                handleError(m);
            }
        });

        controlsPanel.appendChild(actionBtn);

        mainGrid.appendChild(cluePanel);
        mainGrid.appendChild(deviceContainer);
        mainGrid.appendChild(controlsPanel);
        content.appendChild(mainGrid);

        scene.appendChild(content);
        dom.gameplayStage.appendChild(scene);
        updateVal(currentVal);
    }

    // ==========================================================================
    // MISSION 3: AUXILIARY POWER REACTOR — "Activate Auxiliary Power Grid"
    // Center Object: VERTICAL CYLINDRICAL ENERGY REACTOR WITH FLOATING CORE (Matching User Diagram)
    // Gameplay: Connect Correct Power Cell (140 MW) -> Conduit -> Reactor -> Chamber Lights Up
    // ==========================================================================
    function renderNodeRoutingScene(m) {
        const scene = createSceneShell(3, 'SYSTEM: ENERGY MATRIX // POWER REACTOR', 'AUXILIARY REACTOR ENERGIZED', 'CAPACITY MISMATCH — GRID OVERLOAD');
        const content = document.createElement('div');
        content.className = 'scene-content';

        const targetMw = 140; // 35% of 400 MW = 140 MW
        const targetPct = 35;

        const statusBar = createSceneStatusBar('SYSTEM: ENERGY MATRIX', 'DECOUPLED // 35% OF 400 MW REQUIRED');
        content.appendChild(statusBar);

        const mainGrid = document.createElement('div');
        mainGrid.className = 'scene-main-grid dial-scene-grid reactor-scene-grid';

        // ===== LEFT: Power Grid Metrics & Percentage Formula Terminal =====
        const cluePanel = document.createElement('div');
        cluePanel.className = 'scene-object dial-clue-panel premium-terminal';
        cluePanel.innerHTML = `
            <div class="terminal-header-bar">
                <span class="scene-object-label">◆ POWER GRID METRICS</span>
                <span class="terminal-status-chip">PERCENTAGE</span>
            </div>
            
            <div class="bodmas-formula-card standalone-formula">
                <div class="formula-header-tag">CALIBRATION EQUATION</div>
                <div class="formula-math-display">35% of 400 MW = <span class="formula-target-qmark">? MW</span></div>
            </div>
        `;

        // ===== CENTER: 3D Transparent Cylindrical Vertical Energy Reactor =====
        const deviceContainer = document.createElement('div');
        deviceContainer.className = 'scene-object vertical-reactor-container';
        deviceContainer.id = 'reactorDeviceObj';
        deviceContainer.innerHTML = `
            <div class="scene-object-label">◆ AUXILIARY POWER REACTOR</div>
            
            <div class="vertical-reactor-apparatus" id="reactorApparatus">
                <!-- Cosmic Starlight Atmosphere -->
                <div class="reactor-ambient-aura"></div>

                <!-- Top Energy Exhaust Flow: ENERGY ↑ -->
                <div class="reactor-exhaust-top" id="exhaustTop">
                    <div class="exhaust-label">ENERGY ↑</div>
                    <div class="exhaust-beam-up"></div>
                </div>

                <!-- Cylindrical Chamber Outer Cage -->
                <div class="cylindrical-chamber-chassis">
                    <!-- Top Emitter Cap: ◉ -->
                    <div class="chamber-cap cap-top">
                        <div class="emitter-core-dot dot-top">◉</div>
                        <div class="cap-flux-ring"></div>
                    </div>

                    <!-- Transparent Glass Cylinder Chamber -->
                    <div class="transparent-glass-cylinder" id="glassCylinder">
                        <!-- Liquid Plasma Column (moves up/down dynamically with slider) -->
                        <div class="reactor-plasma-liquid" id="reactorFluidColumn" style="height: 37.5%;">
                            <div class="plasma-liquid-meniscus"></div>
                            <div class="plasma-liquid-glow"></div>
                        </div>

                        <div class="glass-specular-sheen"></div>
                        <div class="glass-vertical-ribs"></div>
                        
                        <!-- Floating Energy Singularity Core: ⚡ (levitates dynamically) -->
                        <div class="floating-singularity-core" id="singularityCore">
                            <div class="singularity-corona-aura"></div>
                            <div class="singularity-orbital-ring ring-1"></div>
                            <div class="singularity-orbital-ring ring-2"></div>
                            <div class="singularity-center-glyph">⚡</div>
                        </div>

                        <!-- Vertical Plasma Discharge Column -->
                        <div class="chamber-plasma-flux" id="chamberPlasmaFlux"></div>
                    </div>

                    <!-- Bottom Induction Cap: ◉ -->
                    <div class="chamber-cap cap-bottom">
                        <div class="emitter-core-dot dot-bottom">◉</div>
                        <div class="cap-flux-ring"></div>
                    </div>
                </div>

                <!-- Bottom Energy Ground Discharge: ↓ -->
                <div class="reactor-discharge-bottom" id="dischargeBottom">
                    <div class="exhaust-beam-down"></div>
                    <div class="exhaust-label">↓</div>
                </div>

                <!-- Multiple Power Conduit Energy Tubes -->
                <div class="conduit-bundle" id="conduitBundle">
                    <div class="conduit-pipe pipe-top" id="conduit1">
                        <div class="conduit-energy-pulse"></div>
                    </div>
                    <div class="conduit-pipe pipe-mid-1" id="conduit2">
                        <div class="conduit-energy-pulse"></div>
                    </div>
                    <div class="conduit-pipe pipe-mid-2 active-pipe" id="conduit3">
                        <div class="conduit-energy-pulse"></div>
                    </div>
                    <div class="conduit-pipe pipe-bottom active-pipe" id="conduit4">
                        <div class="conduit-energy-pulse"></div>
                    </div>
                </div>
            </div>

            <!-- Live Telemetry & Status HUD -->
            <div class="gyro-telemetry-hud">
                <div class="gyro-readout-pill">
                    <span class="readout-label">CONNECTED:</span>
                    <span class="readout-number" id="dockedCellNum">--</span>
                    <span class="readout-unit">MW</span>
                </div>
                <div class="gyro-resonance-state" id="reactorResonanceState">
                    <span class="state-pulse-led"></span>
                    <span class="state-txt" id="reactorResonanceTxt">STATUS: STANDBY</span>
                </div>
            </div>

            <!-- Status Label -->
            <div class="gyro-status-label" id="reactorStatusBadge">REACTOR • AWAITING CELL COUPLING</div>
        `;

        // Interactive 3D Cursor Tracking Parallax on Vertical Reactor
        deviceContainer.addEventListener('pointermove', (e) => {
            const rect = deviceContainer.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            deviceContainer.style.setProperty('--reactor-tilt-x', `${(-y * 18).toFixed(2)}deg`);
            deviceContainer.style.setProperty('--reactor-tilt-y', `${(x * 18).toFixed(2)}deg`);
        });

        deviceContainer.addEventListener('pointerleave', () => {
            deviceContainer.style.setProperty('--reactor-tilt-x', '0deg');
            deviceContainer.style.setProperty('--reactor-tilt-y', '0deg');
        });

        // ===== RIGHT: Tactical Vertical Power Throttle & Ladder Scale =====
        let currentMw = 100; // Initial 100 MW
        const minMw = 40;    // 40 MW (10%)
        const maxMw = 200;   // 200 MW (50%)

        const controlsPanel = document.createElement('div');
        controlsPanel.className = 'scene-object dial-controls-panel premium-terminal vertical-thrust-panel';
        controlsPanel.innerHTML = `
            <div class="terminal-header-bar">
                <span class="scene-object-label">◆ POWER THROTTLE MATRIX</span>
                <span class="terminal-status-chip">INJECTION RAIL</span>
            </div>
            
            <!-- Minimalist Digital Wattage Readout Pod -->
            <div class="minimal-readout-pod thrust-compact-pod">
                <div class="readout-caption">ACTIVE POWER INJECTION</div>
                <div class="readout-digital-val">
                    <span class="readout-hz-num" id="throttleMwVal">100</span>
                    <span class="readout-hz-unit">MW</span>
                </div>
                <div class="readout-accent-line"></div>
            </div>

            <!-- Vertical Throttle Chamber with Ladder Scale & Cyber Rail -->
            <div class="vertical-thrust-chamber" id="verticalThrustChamber">
                <!-- Left: Pure MW Ladder Scale -->
                <div class="thrust-ladder-scale" id="ladderScale">
                    <div class="ladder-mark" data-val="200" style="bottom: 100%;"><span>200 MW</span></div>
                    <div class="ladder-mark" data-val="160" style="bottom: 75%;"><span>160 MW</span></div>
                    <div class="ladder-mark" data-val="140" style="bottom: 62.5%;"><span>140 MW</span></div>
                    <div class="ladder-mark" data-val="120" style="bottom: 50%;"><span>120 MW</span></div>
                    <div class="ladder-mark active-ladder" data-val="100" style="bottom: 37.5%;"><span>100 MW</span></div>
                    <div class="ladder-mark" data-val="80" style="bottom: 25%;"><span>80 MW</span></div>
                    <div class="ladder-mark" data-val="40" style="bottom: 0%;"><span>40 MW</span></div>
                </div>

                <!-- Center/Right: Vertical Throttle Cyber Rail -->
                <div class="vertical-throttle-rail" id="throttleRail">
                    <div class="rail-glass-pipe"></div>
                    <div class="rail-plasma-fluid" id="railPlasmaFluid" style="height: 37.5%;"></div>
                    <div class="throttle-grip-handle" id="throttleGripHandle" style="bottom: calc(37.5% - 13px);" title="Drag vertical lever to adjust power injection">
                        <div class="grip-groove-stripes"></div>
                        <div class="grip-led-core"></div>
                        <div class="grip-pointer-arrow"></div>
                    </div>
                </div>
            </div>

            <!-- Segmented Micro-Step Tuning Section (-20 MW, -5 MW, +5 MW, +20 MW) -->
            <div class="dial-step-section minimal-step-section vertical-trimmer-section">
                <div class="dial-sub-header">PRECISION STEP ADJUSTMENT</div>
                <div class="dial-step-btns-row minimal-segmented-bar">
                    <button class="dial-step-btn btn-neg-10" id="btnMinus20" title="Decrease by 20 MW">-20 MW</button>
                    <button class="dial-step-btn btn-neg-1" id="btnMinus5" title="Decrease by 5 MW">-5 MW</button>
                    <button class="dial-step-btn btn-pos-1" id="btnPlus5" title="Increase by 5 MW">+5 MW</button>
                    <button class="dial-step-btn btn-pos-10" id="btnPlus20" title="Increase by 20 MW">+20 MW</button>
                </div>
            </div>
        `;

        // Interactive Pointer Drag on Throttle Lever Rail
        const railEl = controlsPanel.querySelector('#throttleRail');
        let isDraggingLever = false;

        const handlePointerPosition = (clientY) => {
            const rect = railEl.getBoundingClientRect();
            const bottomY = rect.bottom;
            const topY = rect.top;
            const height = rect.height;
            const clampedY = Math.max(topY, Math.min(bottomY, clientY));
            const fraction = (bottomY - clampedY) / height;
            const mw = Math.round(minMw + fraction * (maxMw - minMw));
            updateThrottle(mw);
        };

        railEl.addEventListener('pointerdown', (e) => {
            if (deviceContainer.classList.contains('energized')) return;
            isDraggingLever = true;
            try { railEl.setPointerCapture(e.pointerId); } catch (_) {}
            handlePointerPosition(e.clientY);
        });

        railEl.addEventListener('pointermove', (e) => {
            if (isDraggingLever) {
                handlePointerPosition(e.clientY);
            }
        });

        const stopDrag = (e) => {
            if (isDraggingLever) {
                isDraggingLever = false;
                try { railEl.releasePointerCapture(e.pointerId); } catch (_) {}
            }
        };
        railEl.addEventListener('pointerup', stopDrag);
        railEl.addEventListener('pointercancel', stopDrag);

        // Click on any ladder scale mark to jump
        controlsPanel.querySelectorAll('.ladder-mark').forEach(lm => {
            lm.addEventListener('click', () => {
                if (deviceContainer.classList.contains('energized')) return;
                const v = parseInt(lm.getAttribute('data-val'), 10);
                if (!isNaN(v)) updateThrottle(v);
            });
        });

        // Micro-step buttons
        controlsPanel.querySelector('#btnPlus20').addEventListener('click', () => {
            if (!deviceContainer.classList.contains('energized')) updateThrottle(currentMw + 20);
        });
        controlsPanel.querySelector('#btnPlus5').addEventListener('click', () => {
            if (!deviceContainer.classList.contains('energized')) updateThrottle(currentMw + 5);
        });
        controlsPanel.querySelector('#btnMinus5').addEventListener('click', () => {
            if (!deviceContainer.classList.contains('energized')) updateThrottle(currentMw - 5);
        });
        controlsPanel.querySelector('#btnMinus20').addEventListener('click', () => {
            if (!deviceContainer.classList.contains('energized')) updateThrottle(currentMw - 20);
        });

        // Real-Time Value Updater
        function updateThrottle(newVal) {
            currentMw = Math.max(minMw, Math.min(maxMw, newVal));

            const mwValEl = document.getElementById('throttleMwVal');
            const dockedNum = document.getElementById('dockedCellNum');
            const railFluid = document.getElementById('railPlasmaFluid');
            const gripHandle = document.getElementById('throttleGripHandle');

            if (mwValEl) mwValEl.textContent = currentMw;
            if (dockedNum) dockedNum.textContent = currentMw;
            
            // Vertical Rail & Handle height calculation (0% to 100%)
            const fraction = (currentMw - minMw) / (maxMw - minMw);
            const pctHeight = (fraction * 100).toFixed(1);
            if (railFluid) railFluid.style.height = `${pctHeight}%`;
            if (gripHandle) gripHandle.style.bottom = `calc(${pctHeight}% - 13px)`;

            // DYNAMIC CENTER REACTOR MOVEMENT:
            // 1. Fluid Column Level
            const fluidCol = document.getElementById('reactorFluidColumn');
            if (fluidCol) fluidCol.style.height = `${pctHeight}%`;

            // 2. Floating Singularity Core Levitation & Scale
            const singularityCore = document.getElementById('singularityCore');
            if (singularityCore) {
                // Core floats vertically between +20px (low power) and -20px (high power)
                const coreY = (0.5 - fraction) * 40;
                const coreScale = 0.9 + fraction * 0.25;
                singularityCore.style.transform = `translateY(${(-coreY).toFixed(1)}px) scale(${coreScale.toFixed(2)})`;

                // Accelerate orbital rings rotation at higher wattage
                const r1 = singularityCore.querySelector('.singularity-orbital-ring.ring-1');
                const r2 = singularityCore.querySelector('.singularity-orbital-ring.ring-2');
                const speed1 = Math.max(0.7, 4 - fraction * 3.0);
                const speed2 = Math.max(0.5, 3 - fraction * 2.3);
                if (r1) r1.style.animationDuration = `${speed1.toFixed(2)}s`;
                if (r2) r2.style.animationDuration = `${speed2.toFixed(2)}s`;
            }

            // 3. Central Plasma Flux Column Dynamics
            const plasmaFlux = document.getElementById('chamberPlasmaFlux');
            if (plasmaFlux) {
                plasmaFlux.style.width = `${(2.5 + fraction * 5).toFixed(1)}px`;
                plasmaFlux.style.opacity = (0.35 + fraction * 0.6).toFixed(2);
            }

            // 4. Top & Bottom Exhaust Discharge Beams Scaling
            const exhaustUp = document.querySelector('#exhaustTop .exhaust-beam-up');
            const exhaustDown = document.querySelector('#dischargeBottom .exhaust-beam-down');
            if (exhaustUp) {
                exhaustUp.style.height = `${(6 + fraction * 14).toFixed(1)}px`;
                exhaustUp.style.opacity = (0.4 + fraction * 0.6).toFixed(2);
            }
            if (exhaustDown) {
                exhaustDown.style.height = `${(6 + fraction * 14).toFixed(1)}px`;
                exhaustDown.style.opacity = (0.4 + fraction * 0.6).toFixed(2);
            }

            // 5. Progressive Conduit Activation based on Wattage Level
            const c4 = document.getElementById('conduit4');
            const c3 = document.getElementById('conduit3');
            const c2 = document.getElementById('conduit2');
            const c1 = document.getElementById('conduit1');
            if (c4) c4.classList.toggle('active-pipe', currentMw >= 40);
            if (c3) c3.classList.toggle('active-pipe', currentMw >= 80);
            if (c2) c2.classList.toggle('active-pipe', currentMw >= 140);
            if (c1) c1.classList.toggle('active-pipe', currentMw >= 180);

            // Highlight ladder marks
            controlsPanel.querySelectorAll('.ladder-mark').forEach(lm => {
                const v = parseInt(lm.getAttribute('data-val'), 10);
                lm.classList.toggle('active-ladder', v === currentMw);
            });

            // Pulse conduits briefly to show active flow
            const conduitBundle = document.getElementById('conduitBundle');
            if (conduitBundle) {
                conduitBundle.classList.add('conduit-coupling');
                setTimeout(() => conduitBundle.classList.remove('conduit-coupling'), 300);
            }

            // Keep status neutral while tuning (do not reveal correctness)
            const resState = document.getElementById('reactorResonanceState');
            const resTxt = document.getElementById('reactorResonanceTxt');
            if (resTxt && resState && !deviceContainer.classList.contains('energized')) {
                resState.className = 'gyro-resonance-state';
                resTxt.textContent = `INJECTING ${currentMw} MW`;
            }

            playSfx('select');
        }

        // Action CTA Button — 4-Stage Sequential Activation Flow
        const actionBtn = createActionButton(m.actionLabel || 'ACTIVATE POWER GRID →', () => {
            if (currentMw === targetMw) {
                // ==================================================================
                // CORRECT ANSWER: 4-STAGE SEQUENTIAL IGNITION CASCADE
                // throttle lever -> conduit -> reactor -> entire chamber lights up
                // ==================================================================
                const conduitBundle = document.getElementById('conduitBundle');
                const glassCylinder = document.getElementById('glassCylinder');
                const singularityCore = document.getElementById('singularityCore');
                const badge = document.getElementById('reactorStatusBadge');
                const resState = document.getElementById('reactorResonanceState');
                const resTxt = document.getElementById('reactorResonanceTxt');

                // Step 1: Throttle Grip Lever Ignites
                const gripHandle = document.getElementById('throttleGripHandle');
                if (gripHandle) gripHandle.classList.add('ignited');
                playSfx('select');

                if (badge) {
                    badge.textContent = `✦ INJECTING 35% (${currentMw} MW)...`;
                    badge.classList.remove('status-reject');
                }

                // Step 2: Conduits Pulse Energy Flow (after 250ms)
                setTimeout(() => {
                    if (conduitBundle) conduitBundle.classList.add('conduit-energized');
                    playSfx('chirp');

                    if (badge) badge.textContent = `✦ ENERGIZING CONDUITS...`;

                    // Step 3: Central Reactor Core Ignites (after 500ms)
                    setTimeout(() => {
                        if (singularityCore) singularityCore.classList.add('core-supercharged');
                        if (glassCylinder) glassCylinder.classList.add('supercharged');

                        if (resState && resTxt) {
                            resState.className = 'gyro-resonance-state harmonized';
                            resTxt.textContent = '✦ CORE ONLINE';
                        }

                        // Step 4: Entire Chamber Lights Up & Stabilizes (after 800ms)
                        setTimeout(() => {
                            deviceContainer.classList.remove('reject-shake');
                            deviceContainer.classList.add('energized', 'reactor-online-pulse');
                            scene.classList.add('lens-activated', 'reactor-activated');

                            if (badge) {
                                badge.textContent = `✦ AUXILIARY REACTOR ONLINE (${currentMw} MW)`;
                                badge.classList.add('locked');
                            }
                            if (resTxt) resTxt.textContent = '✦ GRID SYNCHRONIZED';

                            playSceneSuccessSequence(scene, 3, `${currentMw} MW`, null, `<span class="dialogue-speaker">BLAZE:</span> ✦ Power throttle locked! Auxiliary reactor at full 35% (${currentMw} MW) output.`);
                        }, 300);
                    }, 250);
                }, 250);

            } else {
                // ==================================================================
                // WRONG ANSWER: Reactor Red Glitch Shake (Zero blocking popup banner)
                // ==================================================================
                deviceContainer.classList.remove('reject-shake');
                void deviceContainer.offsetWidth; // trigger reflow
                deviceContainer.classList.add('reject-shake');
                setTimeout(() => deviceContainer.classList.remove('reject-shake'), 750);

                const currentCalculatedPct = Math.round((currentMw / 400) * 100);
                const badge = document.getElementById('reactorStatusBadge');
                if (badge) {
                    badge.textContent = `⚠ CAPACITY REJECTED (${currentMw} MW / ${currentCalculatedPct}%)`;
                    badge.classList.add('status-reject');
                    setTimeout(() => {
                        if (!deviceContainer.classList.contains('energized')) {
                            badge.textContent = 'REACTOR • AWAITING CELL COUPLING';
                            badge.classList.remove('status-reject');
                        }
                    }, 1800);
                }

                const resState = document.getElementById('reactorResonanceState');
                const resTxt = document.getElementById('reactorResonanceTxt');
                if (resState && resTxt) {
                    resState.className = 'gyro-resonance-state reject-state';
                    resTxt.textContent = 'MISMATCH';
                    setTimeout(() => {
                        if (!deviceContainer.classList.contains('energized')) {
                            resState.className = 'gyro-resonance-state';
                            resTxt.textContent = `INJECTING ${currentMw} MW`;
                        }
                    }, 1800);
                }

                const dlg = scene.querySelector('.scene-dialogue-overlay .dialogue-text');
                if (dlg) {
                    dlg.innerHTML = `<span class="dialogue-speaker">BYTE:</span> ${currentMw} MW power injection rejected! Required ratio is 35% of 400 MW.`;
                }

                handleError(m);
            }
        });

        controlsPanel.appendChild(actionBtn);

        mainGrid.appendChild(cluePanel);
        mainGrid.appendChild(deviceContainer);
        mainGrid.appendChild(controlsPanel);
        content.appendChild(mainGrid);

        scene.appendChild(content);
        dom.gameplayStage.appendChild(scene);
        updateThrottle(currentMw);
    }

    // ==========================================================================
    // MISSION 4: ENERGY TRADE MANIFESTS SCENE — "Calculate Energy Yield Margin"
    // Center Object: 2.5D VALUE MATRIX FUSION CORE
    // Input Mechanic: PROFIT MARGIN SYNTHESIZER & INCREMENT BOOSTERS
    // ==========================================================================
    // MISSION 4: ENERGY EXCHANGE CORE — "Calculate Energy Yield Margin"
    // Layout: 2 HORIZONTAL CARDS STACKED
    //   - TOP CARD: Full-Width 3-Pod Quantum Machine (INPUT → EXCHANGE CORE → OUTPUT)
    //   - BOTTOM CARD: Commercial Ledger, Selectable Yield Cards & Authorization
    // ==========================================================================
    function renderReactorKeypadScene(m) {
        const costPrice = 400;     // Base Cost = 400 Units (Input)
        const targetPrice = 500;   // Target SP = 500 Units (+25% Profit Margin)
        let selectedPrice = null;  // No card pre-selected; player selects

        const scene = createSceneShell(4, 'SYSTEM: ENERGY EXCHANGE // QUANTUM CORE', 'ENERGY YIELD MARGIN VERIFIED', 'INVALID MARGIN — TRANSACTION REJECTED');
        const content = document.createElement('div');
        content.className = 'scene-content';

        const statusBar = createSceneStatusBar('SYSTEM: ENERGY EXCHANGE');
        content.appendChild(statusBar);

        // 2-Row Stack Container
        const mainGrid = document.createElement('div');
        mainGrid.className = 'm4-two-card-container';

        // ==========================================================================
        // CARD 1 (TOP HORIZONTAL CARD): Hero 3-Pod Quantum Transaction Apparatus
        // ==========================================================================
        const topCard = document.createElement('div');
        topCard.className = 'scene-object m4-top-apparatus-card quantum-transaction-container';
        topCard.id = 'quantumTradeMachineObj';
        topCard.innerHTML = `
            <div class="terminal-header-bar">
                <span class="scene-object-label">◆ QUANTUM ENERGY EXCHANGE CORE</span>
                <span class="terminal-status-chip">3-POD PIPELINE</span>
            </div>
            
            <div class="quantum-trade-apparatus" id="quantumTradeApparatus">
                <!-- Soft Cosmic Radial Aura -->
                <div class="quantum-ambient-glow" id="quantumAmbientGlow"></div>

                <!-- Clean 3-Pod Horizontal Pipeline Flow -->
                <div class="quantum-pipeline-row wide-pipeline-row">
                    
                    <!-- 1. LEFT POD: INPUT CORE (400 U Base Cost) -->
                    <div class="quantum-core-dock input-dock" id="inputCoreDock">
                        <div class="dock-header-lbl">INPUT CORE</div>
                        <div class="dock-capsule-chassis">
                            <div class="dock-core-glyph">⚡</div>
                            <div class="dock-val-display">400 U</div>
                            <div class="dock-sub-caption">BASE (CP)</div>
                        </div>
                        <div class="dock-glow-aura aura-input"></div>
                    </div>

                    <!-- Conduit Bridge 1: Input -> Exchange Core -->
                    <div class="quantum-energy-bridge bridge-in" id="inputEnergyBridge">
                        <div class="bridge-cyber-rail"></div>
                        <div class="bridge-photon-particle particle-1"></div>
                        <div class="bridge-flow-chevrons">❯ ❯ ❯</div>
                    </div>

                    <!-- 2. CENTER: FLOATING QUANTUM EXCHANGE CORE (Rotating Faceted Crystal 💎) -->
                    <div class="quantum-exchange-core-chamber" id="quantumExchangeChamber">
                        <div class="quantum-octagonal-vessel" id="quantumOctagonalVessel">
                            <div class="octa-glass-sheen"></div>
                            
                            <!-- 3D Floating Rotating Energy Crystal -->
                            <div class="floating-quantum-crystal" id="quantumEnergyCrystal">
                                <div class="crystal-radiance-halo"></div>
                                <div class="crystal-orbit-ring ring-x"></div>
                                <div class="crystal-orbit-ring ring-y"></div>
                                <div class="crystal-core-gem" id="crystalGemGlyph">
                                    <svg class="crystal-svg" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="cGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stop-color="#ffffff"/>
                                                <stop offset="50%" stop-color="#67e8f9"/>
                                                <stop offset="100%" stop-color="#0284c7"/>
                                            </linearGradient>
                                            <linearGradient id="cGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stop-color="#38bdf8"/>
                                                <stop offset="100%" stop-color="#0369a1"/>
                                            </linearGradient>
                                            <linearGradient id="cGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stop-color="#a855f7"/>
                                                <stop offset="100%" stop-color="#3b82f6"/>
                                            </linearGradient>
                                            <linearGradient id="cGradCenter" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stop-color="#ffffff"/>
                                                <stop offset="60%" stop-color="#38bdf8"/>
                                                <stop offset="100%" stop-color="#1d4ed8"/>
                                            </linearGradient>
                                        </defs>
                                        <polygon points="12,12 36,12 24,4" fill="url(#cGradTop)" opacity="0.95"/>
                                        <polygon points="4,18 12,12 24,4 4,18" fill="url(#cGradLeft)" opacity="0.85"/>
                                        <polygon points="44,18 36,12 24,4 44,18" fill="url(#cGradRight)" opacity="0.85"/>
                                        <polygon points="4,18 12,12 24,24" fill="url(#cGradLeft)" opacity="0.9"/>
                                        <polygon points="36,12 44,18 24,24" fill="url(#cGradRight)" opacity="0.9"/>
                                        <polygon points="12,12 36,12 24,24" fill="url(#cGradCenter)"/>
                                        <polygon points="4,18 24,24 24,44" fill="url(#cGradLeft)" opacity="0.95"/>
                                        <polygon points="44,18 24,24 24,44" fill="url(#cGradRight)" opacity="0.95"/>
                                        <polygon points="14,19 24,24 24,44 14,19" fill="#ffffff" opacity="0.4"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Conduit Bridge 2: Exchange Core -> Output -->
                    <div class="quantum-energy-bridge bridge-out" id="outputEnergyBridge">
                        <div class="bridge-cyber-rail"></div>
                        <div class="bridge-photon-particle particle-2"></div>
                        <div class="bridge-flow-chevrons">❯ ❯ ❯</div>
                    </div>

                    <!-- 3. RIGHT POD: OUTPUT RECEPTOR (Slotted Selling Price Yield) -->
                    <div class="quantum-core-dock output-dock" id="outputCoreDock">
                        <div class="dock-header-lbl">OUTPUT CORE</div>
                        <div class="dock-capsule-chassis" id="outputDockChassis">
                            <div class="dock-core-glyph" id="outputDockGlyph">💠</div>
                            <div class="dock-val-display" id="outputDockVal">-- U</div>
                            <div class="dock-sub-caption">YIELD (SP)</div>
                        </div>
                        <div class="dock-glow-aura aura-output" id="outputDockAura"></div>
                    </div>
                </div>
            </div>

            <!-- Clean Minimalist Telemetry Strip -->
            <div class="trade-telemetry-hud m4-top-telemetry-strip">
                <div class="telemetry-pill-box">
                    <span class="telemetry-lbl">SLOTTED OUTPUT:</span>
                    <span class="telemetry-num" id="telemetryYieldNum">--</span>
                    <span class="telemetry-unit">UNITS</span>
                </div>
                <div class="trade-machine-status-badge" id="tradeStatusBadge">EXCHANGE CORE • SELECT YIELD CARD BELOW</div>
                <div class="telemetry-state-pill" id="tradeResonanceState">
                    <span class="state-pulse-led"></span>
                    <span class="state-txt" id="tradeResonanceTxt">AWAITING CARD</span>
                </div>
            </div>
        `;

        // Interactive 3D Cursor Tracking Parallax on Machine Chassis
        topCard.addEventListener('pointermove', (e) => {
            const rect = topCard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            topCard.style.setProperty('--reactor-tilt-x', `${(-y * 10).toFixed(2)}deg`);
            topCard.style.setProperty('--reactor-tilt-y', `${(x * 10).toFixed(2)}deg`);
        });

        topCard.addEventListener('pointerleave', () => {
            topCard.style.setProperty('--reactor-tilt-x', '0deg');
            topCard.style.setProperty('--reactor-tilt-y', '0deg');
        });

        // ==========================================================================
        // CARD 2 (BOTTOM HORIZONTAL CARD): Transaction Ledgers & Yield Core Selector
        // ==========================================================================
        const bottomCard = document.createElement('div');
        bottomCard.className = 'scene-object m4-bottom-controls-card premium-terminal';
        bottomCard.innerHTML = `
            <div class="terminal-header-bar">
                <span class="scene-object-label">◆ TRANSACTION CONTROL DECK</span>
                <span class="terminal-status-chip">COMMERCIAL SPECIFICATION & SELECTOR</span>
            </div>
            
            <div class="m4-bottom-deck-layout">
                <!-- Left: Commercial Ledgers & Formula Clue -->
                <div class="m4-deck-left-ledger">
                    <div class="ledger-dual-data-card horizontal-dual-card">
                        <div class="ledger-metric-col">
                            <div class="metric-top-tag">BASE COST (CP)</div>
                            <div class="metric-big-num"><span class="val-highlight">400</span> <span class="val-unit">U</span></div>
                            <div class="metric-sub-note">INPUT CONTAINMENT</div>
                        </div>
                        <div class="ledger-metric-divider"></div>
                        <div class="ledger-metric-col">
                            <div class="metric-top-tag">REQUIRED PROFIT</div>
                            <div class="metric-big-num"><span class="val-highlight-profit">+25%</span></div>
                            <div class="metric-sub-note">YIELD GAIN RATE</div>
                        </div>
                    </div>

                    <div class="bodmas-formula-card standalone-formula trade-formula-card horizontal-formula-card">
                        <div class="formula-header-tag">CALIBRATION EQUATION</div>
                        <div class="formula-math-display">CP 400 U + 25% = <span class="formula-target-qmark">? SP</span></div>
                    </div>
                </div>

                <!-- Right: Selectable Yield Cards Matrix & Action CTA -->
                <div class="m4-deck-right-controls">
                    <div class="m4-yield-selector-header">SELECT OUTPUT YIELD MANIFEST:</div>
                    
                    <div class="yield-cards-rack-container horizontal-cards-row" id="yieldCardsRack">
                        <!-- Horizontal Yield Cards Grid -->
                    </div>

                    <div class="m4-action-btn-wrapper" id="m4ActionBtnWrapper">
                        <!-- Action CTA Button inserted here -->
                    </div>
                </div>
            </div>
        `;

        const rackContainer = bottomCard.querySelector('#yieldCardsRack');
        const yieldOptions = [
            { id: "core_a", val: 450, glyph: "💠" },
            { id: "core_b", val: 480, glyph: "💠" },
            { id: "core_c", val: 500, glyph: "💎" },
            { id: "core_d", val: 525, glyph: "💠" },
            { id: "core_e", val: 550, glyph: "💠" }
        ];

        // Populate Yield Core Cards (Horizontal Grid)
        yieldOptions.forEach(opt => {
            const card = document.createElement('div');
            card.className = 'yield-core-card horizontal-yield-card';
            card.setAttribute('data-val', opt.val);
            card.setAttribute('id', `yieldCard_${opt.val}`);
            card.innerHTML = `
                <div class="card-crystal-preview">${opt.glyph}</div>
                <div class="card-numeric-val">${opt.val}</div>
                <div class="card-unit-caption">UNITS (SP)</div>
                <div class="card-hover-aura"></div>
            `;

            card.addEventListener('click', () => {
                if (topCard.classList.contains('energized')) return;
                selectYieldCore(opt.val, card);
            });

            rackContainer.appendChild(card);
        });

        // Card Selection Handler
        function selectYieldCore(val, activeCardEl) {
            selectedPrice = val;

            // 1. Highlight Active Card
            rackContainer.querySelectorAll('.yield-core-card').forEach(c => c.classList.remove('selected-core'));
            if (activeCardEl) activeCardEl.classList.add('selected-core');

            // 2. Update Output Dock in Top Apparatus
            const outputValEl = document.getElementById('outputDockVal');
            const outputChassis = document.getElementById('outputDockChassis');
            const outputAura = document.getElementById('outputDockAura');
            const telemNum = document.getElementById('telemetryYieldNum');
            const resTxt = document.getElementById('tradeResonanceTxt');
            const resState = document.getElementById('tradeResonanceState');
            const bridgeOut = document.getElementById('outputEnergyBridge');

            if (outputValEl) outputValEl.textContent = `${val} U`;
            if (telemNum) telemNum.textContent = val;
            if (outputChassis) outputChassis.classList.add('dock-engaged');
            if (outputAura) outputAura.classList.add('aura-engaged');

            if (bridgeOut) {
                bridgeOut.classList.add('pulse-stream');
                setTimeout(() => bridgeOut.classList.remove('pulse-stream'), 400);
            }

            // 3. Accelerate Center Crystal Rotation on Selection
            const crystal = document.getElementById('quantumEnergyCrystal');
            if (crystal) {
                const rx = crystal.querySelector('.crystal-orbit-ring.ring-x');
                const ry = crystal.querySelector('.crystal-orbit-ring.ring-y');
                if (rx) rx.style.animationDuration = '1.2s';
                if (ry) ry.style.animationDuration = '0.9s';
                crystal.style.transform = 'scale(1.15)';
                setTimeout(() => { crystal.style.transform = 'scale(1)'; }, 250);
            }

            if (resTxt && resState && !topCard.classList.contains('energized')) {
                resState.className = 'telemetry-state-pill state-ready';
                resTxt.textContent = `SLOTTED: ${val} UNITS`;
            }

            const badge = document.getElementById('tradeStatusBadge');
            if (badge && !topCard.classList.contains('energized')) {
                badge.textContent = `CORE DOCKED (${val} U) • READY TO AUTHORIZE`;
                badge.classList.remove('status-reject');
            }

            playSfx('select');
        }

        // Action CTA Button
        const actionBtn = createActionButton(m.actionLabel || 'AUTHORIZE TRADE CONTRACT →', () => {
            if (!selectedPrice) {
                playSfx('error');
                const badge = document.getElementById('tradeStatusBadge');
                if (badge) {
                    badge.textContent = `⚠ PLEASE SELECT AN ENERGY YIELD CORE FIRST`;
                    badge.classList.add('status-reject');
                    setTimeout(() => badge.classList.remove('status-reject'), 1500);
                }
                return;
            }

            if (selectedPrice === targetPrice) {
                // ==================================================================
                // CORRECT ANSWER: 4-STAGE SEQUENTIAL ENERGY CONVERSION CASCADE
                // INPUT (400 U) -> EXCHANGE CORE (+25%) -> CONVERSION -> OUTPUT (500 U)
                // ==================================================================
                const inputDock = document.getElementById('inputCoreDock');
                const bridgeIn = document.getElementById('inputEnergyBridge');
                const exchangeChamber = document.getElementById('quantumExchangeChamber');
                const crystal = document.getElementById('quantumEnergyCrystal');
                const bridgeOut = document.getElementById('outputEnergyBridge');
                const outputDock = document.getElementById('outputCoreDock');
                const badge = document.getElementById('tradeStatusBadge');
                const resState = document.getElementById('tradeResonanceState');
                const resTxt = document.getElementById('tradeResonanceTxt');

                playSfx('select');

                // Step 1: Input Core Fires Energy Pulse -> Bridge In
                if (inputDock) inputDock.classList.add('dock-energized');
                if (bridgeIn) bridgeIn.classList.add('bridge-active');
                if (badge) {
                    badge.textContent = `✦ 1. INPUT ENERGY FLOWING (400 U)...`;
                    badge.classList.remove('status-reject');
                }

                // Step 2: Exchange Core Transforms & Supercharges (after 250ms)
                setTimeout(() => {
                    if (crystal) crystal.classList.add('crystal-supercharged');
                    if (exchangeChamber) exchangeChamber.classList.add('chamber-supercharged');
                    playSfx('chirp');

                    if (badge) badge.textContent = `✦ 2. EXCHANGE CORE: CONVERTING (+25% MARGIN)...`;

                    // Step 3: Energy Conversion Streams -> Bridge Out -> Output Pod (after 500ms)
                    setTimeout(() => {
                        if (bridgeOut) bridgeOut.classList.add('bridge-active');
                        if (outputDock) outputDock.classList.add('dock-energized', 'dock-stable-green');

                        if (resState && resTxt) {
                            resState.className = 'telemetry-state-pill harmonized';
                            resTxt.textContent = '✦ CONVERSION STABLE';
                        }

                        // Step 4: Entire Machine Stabilizes into Green/White Stable State (after 800ms)
                        setTimeout(() => {
                            topCard.classList.remove('reject-shake');
                            topCard.classList.add('energized', 'green-white-stable', 'quantum-online-pulse');
                            scene.classList.add('lens-activated', 'reactor-activated');

                            if (badge) {
                                badge.textContent = `✦ TRANSACTION COMPLETE • 500 UNITS STABILIZED`;
                                badge.classList.add('locked');
                            }
                            if (resTxt) resTxt.textContent = '✦ TRADE SYNCHRONIZED';

                            playSceneSuccessSequence(scene, 4, `${selectedPrice} UNITS`, null, `<span class="dialogue-speaker">NOVA:</span> ✦ Energy exchange complete! 500 Units output stabilized at +25% profit margin.`);
                        }, 300);
                    }, 250);
                }, 250);

            } else {
                // ==================================================================
                // WRONG ANSWER: Local Red Glitch Vibration Shake (Zero blocking popup modal)
                // ==================================================================
                topCard.classList.remove('reject-shake');
                void topCard.offsetWidth; // trigger reflow
                topCard.classList.add('reject-shake');
                setTimeout(() => topCard.classList.remove('reject-shake'), 750);

                const activeCard = rackContainer.querySelector('.yield-core-card.selected-core');
                if (activeCard) {
                    activeCard.classList.add('card-rejected');
                    setTimeout(() => activeCard.classList.remove('card-rejected'), 750);
                }

                const badge = document.getElementById('tradeStatusBadge');
                if (badge) {
                    badge.textContent = `⚠ YIELD MISMATCH (${selectedPrice} UNITS REJECTED)`;
                    badge.classList.add('status-reject');
                    setTimeout(() => {
                        if (!topCard.classList.contains('energized')) {
                            badge.textContent = 'EXCHANGE CORE • SELECT YIELD CARD BELOW';
                            badge.classList.remove('status-reject');
                        }
                    }, 1800);
                }

                const resState = document.getElementById('tradeResonanceState');
                const resTxt = document.getElementById('tradeResonanceTxt');
                if (resState && resTxt) {
                    resState.className = 'telemetry-state-pill reject-state';
                    resTxt.textContent = 'TRANSACTION REJECTED';
                    setTimeout(() => {
                        if (!topCard.classList.contains('energized')) {
                            resState.className = 'telemetry-state-pill';
                            resTxt.textContent = `SLOTTED: ${selectedPrice} UNITS`;
                        }
                    }, 1800);
                }

                const dlg = scene.querySelector('.scene-dialogue-overlay .dialogue-text');
                if (dlg) {
                    dlg.innerHTML = `<span class="dialogue-speaker">BYTE:</span> ${selectedPrice} Units rejected! Value does not match Base 400 Units + 25% profit margin.`;
                }

                handleError(m);
            }
        });

        bottomCard.querySelector('#m4ActionBtnWrapper').appendChild(actionBtn);

        mainGrid.appendChild(topCard);
        mainGrid.appendChild(bottomCard);
        content.appendChild(mainGrid);

        scene.appendChild(content);
        dom.gameplayStage.appendChild(scene);
    }

    // ==========================================================================
    // MISSION 5: EQUALIZE QUANTUM FUEL MIXTURE — "Ratio & Proportion"
    // Layout: 2 HORIZONTAL CARDS STACKED
    //   - TOP CARD: Dual-Chamber Synthesis Machine (PLASMA A ──► SYNTHESIS CORE ◄── CATALYST B)
    //   - BOTTOM CARD: Ratio Ledgers, Selectable Catalyst Cylinders & Action CTA
    // ==========================================================================
    function renderCellBayScene(m) {
        const totalBatch = 360;       // Total 360 Litres (5:7 ratio -> 150 L : 210 L)
        const targetVolume = 210;     // Target Catalyst B = 210 Litres (7/12 * 360)
        let selectedVolume = null;    // Player selects from cards

        const scene = createSceneShell(5, 'SYSTEM: CATALYST CORE // RATIO EQUALIZER', 'QUANTUM FUEL MIXTURE EQUALIZED', 'RATIO MISMATCH — CYLINDER REJECTED');
        const content = document.createElement('div');
        content.className = 'scene-content';

        const statusBar = createSceneStatusBar('SYSTEM: CATALYST CORE');
        content.appendChild(statusBar);

        // 2-Row Stack Container
        const mainGrid = document.createElement('div');
        mainGrid.className = 'm5-two-card-container';

        // ==========================================================================
        // CARD 1 (TOP HORIZONTAL CARD): Hero Dual-Chamber Synthesis Apparatus
        // ==========================================================================
        const topCard = document.createElement('div');
        topCard.className = 'scene-object m5-top-apparatus-card m5-synthesis-container';
        topCard.id = 'm5SynthesisApparatusObj';
        topCard.innerHTML = `
            <div class="terminal-header-bar">
                <span class="scene-object-label">◆ DUAL-CHAMBER FUEL SYNTHESIZER</span>
                <span class="terminal-status-chip">RATIO EQUILIBRIUM CHAMBER</span>
            </div>
            
            <div class="m5-synthesis-apparatus" id="m5SynthesisApparatus">
                <div class="m5-ambient-glow" id="m5AmbientGlow"></div>

                <!-- Clean 3-Part Synthesis Pipeline: Plasma A -> Core <- Catalyst B -->
                <div class="m5-pipeline-row">
                    
                    <!-- 1. LEFT CYLINDER: PLASMA A (5 Parts = 150 L) -->
                    <div class="m5-chamber-dock dock-plasma" id="dockPlasmaA">
                        <div class="dock-header-lbl">PLASMA A (5x)</div>
                        <div class="m5-vial-capsule">
                            <div class="vial-glass-body">
                                <div class="vial-liquid-fill fill-plasma" id="plasmaVialFill" style="height: 41.6%;"></div>
                                <div class="vial-level-ticks">
                                    <span>-</span><span>-</span><span>-</span>
                                </div>
                            </div>
                            <div class="vial-core-glyph">⚡</div>
                            <div class="vial-val-display" id="plasmaVialVal">150 L</div>
                            <div class="vial-sub-caption">FIXED (5 PARTS)</div>
                        </div>
                        <div class="vial-glow-aura aura-plasma"></div>
                    </div>

                    <!-- Conduit Bridge 1: Plasma A -> Synthesis Core -->
                    <div class="m5-injector-bridge bridge-plasma" id="bridgePlasma">
                        <div class="bridge-cyber-rail"></div>
                        <div class="bridge-photon-particle particle-plasma"></div>
                        <div class="bridge-flow-chevrons">❯ ❯ ❯</div>
                    </div>

                    <!-- 2. CENTER: EQUALIZER SYNTHESIS CORE (Batch Capacity 360 L) -->
                    <div class="m5-center-synthesizer" id="m5CenterSynthesizer">
                        <div class="m5-synthesizer-vessel" id="m5SynthesizerVessel">
                            <div class="synth-glass-sheen"></div>
                            
                            <!-- Floating Reaction Vortex Core -->
                            <div class="m5-vortex-core" id="m5VortexCore">
                                <div class="vortex-radiance-halo"></div>
                                <div class="vortex-orbit-ring ring-1"></div>
                                <div class="vortex-orbit-ring ring-2"></div>
                                <div class="vortex-center-gem" id="vortexCenterGem">🧪</div>
                            </div>

                            <div class="synth-total-badge">
                                <span class="synth-total-num">360</span> <span class="synth-total-unit">L TOTAL</span>
                            </div>
                        </div>
                    </div>

                    <!-- Conduit Bridge 2: Catalyst B -> Synthesis Core -->
                    <div class="m5-injector-bridge bridge-catalyst" id="bridgeCatalyst">
                        <div class="bridge-cyber-rail"></div>
                        <div class="bridge-photon-particle particle-catalyst"></div>
                        <div class="bridge-flow-chevrons">❮ ❮ ❮</div>
                    </div>

                    <!-- 3. RIGHT CYLINDER: CATALYST B (7 Parts = Variable / Target 210 L) -->
                    <div class="m5-chamber-dock dock-catalyst" id="dockCatalystB">
                        <div class="dock-header-lbl">CATALYST B (7x)</div>
                        <div class="m5-vial-capsule" id="catalystVialCapsule">
                            <div class="vial-glass-body">
                                <div class="vial-liquid-fill fill-catalyst" id="catalystVialFill" style="height: 0%;"></div>
                                <div class="vial-level-ticks">
                                    <span>-</span><span>-</span><span>-</span>
                                </div>
                            </div>
                            <div class="vial-core-glyph" id="catalystDockGlyph">💠</div>
                            <div class="vial-val-display" id="catalystVialVal">-- L</div>
                            <div class="vial-sub-caption">INPUT (7 PARTS)</div>
                        </div>
                        <div class="vial-glow-aura aura-catalyst" id="catalystDockAura"></div>
                    </div>
                </div>
            </div>

            <!-- Clean Minimalist Telemetry Strip -->
            <div class="trade-telemetry-hud m5-top-telemetry-strip">
                <div class="telemetry-pill-box">
                    <span class="telemetry-lbl">SLOTTED CATALYST:</span>
                    <span class="telemetry-num" id="telemetryCatalystNum">--</span>
                    <span class="telemetry-unit">LITRES</span>
                </div>
                <div class="trade-machine-status-badge" id="m5StatusBadge">CATALYST CORE • SELECT 7-PART CYLINDER BELOW</div>
                <div class="telemetry-state-pill" id="m5ResonanceState">
                    <span class="state-pulse-led"></span>
                    <span class="state-txt" id="m5ResonanceTxt">AWAITING CYLINDER</span>
                </div>
            </div>
        `;

        // Interactive 3D Cursor Tracking Parallax
        topCard.addEventListener('pointermove', (e) => {
            const rect = topCard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            topCard.style.setProperty('--reactor-tilt-x', `${(-y * 10).toFixed(2)}deg`);
            topCard.style.setProperty('--reactor-tilt-y', `${(x * 10).toFixed(2)}deg`);
        });

        topCard.addEventListener('pointerleave', () => {
            topCard.style.setProperty('--reactor-tilt-x', '0deg');
            topCard.style.setProperty('--reactor-tilt-y', '0deg');
        });

        // ==========================================================================
        // CARD 2 (BOTTOM HORIZONTAL CARD): Ratio Ledgers & Selectable Cylinders
        // ==========================================================================
        const bottomCard = document.createElement('div');
        bottomCard.className = 'scene-object m5-bottom-controls-card premium-terminal';
        bottomCard.innerHTML = `
            <div class="terminal-header-bar">
                <span class="scene-object-label">◆ RATIO CONTROL DECK</span>
                <span class="terminal-status-chip">SPECIFICATION & CYLINDER DISPENSER</span>
            </div>
            
            <div class="m5-bottom-deck-layout">
                <!-- Left: Specification Ledgers -->
                <div class="m5-deck-left-ledger">
                    <div class="ledger-dual-data-card horizontal-dual-card">
                        <div class="ledger-metric-col">
                            <div class="metric-top-tag">MIXTURE RATIO</div>
                            <div class="metric-big-num"><span class="val-highlight">5</span> : <span class="val-highlight-profit">7</span></div>
                            <div class="metric-sub-note">PLASMA : CATALYST</div>
                        </div>
                        <div class="ledger-metric-divider"></div>
                        <div class="ledger-metric-col">
                            <div class="metric-top-tag">TOTAL BATCH</div>
                            <div class="metric-big-num"><span class="val-highlight">360</span> <span class="val-unit">L</span></div>
                            <div class="metric-sub-note">SYNTHESIS TARGET</div>
                        </div>
                    </div>

                    <div class="bodmas-formula-card standalone-formula trade-formula-card horizontal-formula-card">
                        <div class="formula-header-tag">CALIBRATION REQUIREMENT</div>
                        <div class="formula-math-display">CATALYST B = <span class="formula-target-qmark">? LITRES (7 PARTS)</span></div>
                    </div>
                </div>

                <!-- Right: 5 Selectable Cylinder Cards & Action Button -->
                <div class="m5-deck-right-controls">
                    <div class="m5-yield-selector-header">SELECT CATALYST B CYLINDER:</div>
                    
                    <div class="yield-cards-rack-container horizontal-cards-row" id="m5CylinderRack">
                        <!-- 5 Clean Cylinder Cards -->
                    </div>

                    <div class="m5-action-btn-wrapper" id="m5ActionBtnWrapper">
                        <!-- Action CTA Button inserted here -->
                    </div>
                </div>
            </div>
        `;

        const cylinderRack = bottomCard.querySelector('#m5CylinderRack');
        const cylinderOptions = [
            { id: "cyl_180", val: 180, glyph: "💠" },
            { id: "cyl_195", val: 195, glyph: "💠" },
            { id: "cyl_210", val: 210, glyph: "🧪" },
            { id: "cyl_225", val: 225, glyph: "💠" },
            { id: "cyl_240", val: 240, glyph: "💠" }
        ];

        // Populate Cylinder Cards (Horizontal Row)
        cylinderOptions.forEach(opt => {
            const card = document.createElement('div');
            card.className = 'yield-core-card horizontal-yield-card';
            card.setAttribute('data-val', opt.val);
            card.setAttribute('id', `cylCard_${opt.val}`);
            card.innerHTML = `
                <div class="card-crystal-preview">${opt.glyph}</div>
                <div class="card-numeric-val">${opt.val}</div>
                <div class="card-unit-caption">LITRES (B)</div>
                <div class="card-hover-aura"></div>
            `;

            card.addEventListener('click', () => {
                if (topCard.classList.contains('energized')) return;
                selectCylinder(opt.val, card);
            });

            cylinderRack.appendChild(card);
        });

        // Cylinder Selection Handler
        function selectCylinder(val, activeCardEl) {
            selectedVolume = val;

            // 1. Highlight Active Card
            cylinderRack.querySelectorAll('.yield-core-card').forEach(c => c.classList.remove('selected-core'));
            if (activeCardEl) activeCardEl.classList.add('selected-core');

            // 2. Update Catalyst B Cylinder in Top Apparatus
            const cFill = document.getElementById('catalystVialFill');
            const cVal = document.getElementById('catalystVialVal');
            const cCapsule = document.getElementById('catalystVialCapsule');
            const cAura = document.getElementById('catalystDockAura');
            const telemNum = document.getElementById('telemetryCatalystNum');
            const resTxt = document.getElementById('m5ResonanceTxt');
            const resState = document.getElementById('m5ResonanceState');
            const bridgeCat = document.getElementById('bridgeCatalyst');

            if (cFill) cFill.style.height = `${Math.min(100, (val / 360) * 100).toFixed(1)}%`;
            if (cVal) cVal.textContent = `${val} L`;
            if (telemNum) telemNum.textContent = val;
            if (cCapsule) cCapsule.classList.add('dock-engaged');
            if (cAura) cAura.classList.add('aura-engaged');

            if (bridgeCat) {
                bridgeCat.classList.add('pulse-stream');
                setTimeout(() => bridgeCat.classList.remove('pulse-stream'), 400);
            }

            // 3. Accelerate Vortex Rotation on Selection
            const vortex = document.getElementById('m5VortexCore');
            if (vortex) {
                vortex.style.transform = 'scale(1.12)';
                setTimeout(() => { vortex.style.transform = 'scale(1)'; }, 250);
            }

            if (resTxt && resState && !topCard.classList.contains('energized')) {
                resState.className = 'telemetry-state-pill state-ready';
                resTxt.textContent = `SLOTTED: ${val} LITRES`;
            }

            const badge = document.getElementById('m5StatusBadge');
            if (badge && !topCard.classList.contains('energized')) {
                badge.textContent = `CYLINDER DOCKED (${val} L) • READY TO EQUALIZE`;
                badge.classList.remove('status-reject');
            }

            playSfx('select');
        }

        // Action CTA Button
        const actionBtn = createActionButton(m.actionLabel || 'EQUALIZE FUEL RATIO →', () => {
            if (!selectedVolume) {
                playSfx('error');
                const badge = document.getElementById('m5StatusBadge');
                if (badge) {
                    badge.textContent = `⚠ PLEASE SELECT A CATALYST B CYLINDER FIRST`;
                    badge.classList.add('status-reject');
                    setTimeout(() => badge.classList.remove('status-reject'), 1500);
                }
                return;
            }

            if (selectedVolume === targetVolume) {
                // ==================================================================
                // CORRECT ANSWER (210 L): 4-STAGE SEQUENTIAL REACTION CASCADE
                // 150 L Plasma (5x) + 210 L Catalyst (7x) = 360 L Equalized Batch
                // ==================================================================
                const dockPlasma = document.getElementById('dockPlasmaA');
                const bridgePlasma = document.getElementById('bridgePlasma');
                const dockCatalyst = document.getElementById('dockCatalystB');
                const bridgeCatalyst = document.getElementById('bridgeCatalyst');
                const synthCore = document.getElementById('m5CenterSynthesizer');
                const vortex = document.getElementById('m5VortexCore');
                const badge = document.getElementById('m5StatusBadge');
                const resState = document.getElementById('m5ResonanceState');
                const resTxt = document.getElementById('m5ResonanceTxt');

                playSfx('select');

                // Step 1: Plasma A Streams into Central Synthesizer (150 L)
                if (dockPlasma) dockPlasma.classList.add('dock-energized');
                if (bridgePlasma) bridgePlasma.classList.add('bridge-active');
                if (badge) {
                    badge.textContent = `✦ 1. PLASMA A INJECTING (150 L / 5 PARTS)...`;
                    badge.classList.remove('status-reject');
                }

                // Step 2: Catalyst B Streams into Central Synthesizer (210 L) (after 250ms)
                setTimeout(() => {
                    if (dockCatalyst) dockCatalyst.classList.add('dock-energized', 'dock-stable-green');
                    if (bridgeCatalyst) bridgeCatalyst.classList.add('bridge-active');
                    playSfx('chirp');

                    if (badge) badge.textContent = `✦ 2. CATALYST B INJECTING (210 L / 7 PARTS)...`;

                    // Step 3: Synthesis Core Blends & Harmonizes (after 500ms)
                    setTimeout(() => {
                        if (synthCore) synthCore.classList.add('synth-supercharged');
                        if (vortex) vortex.classList.add('vortex-supercharged');

                        if (resState && resTxt) {
                            resState.className = 'telemetry-state-pill harmonized';
                            resTxt.textContent = '✦ RATIO 5:7 EQUALIZED';
                        }

                        // Step 4: Entire Machine Enters Green/White Stable State (after 800ms)
                        setTimeout(() => {
                            topCard.classList.remove('reject-shake');
                            topCard.classList.add('energized', 'green-white-stable', 'quantum-online-pulse');
                            scene.classList.add('lens-activated', 'reactor-activated');

                            if (badge) {
                                badge.textContent = `✦ QUANTUM FUEL EQUALIZED • 360 LITRES STABILIZED`;
                                badge.classList.add('locked');
                            }
                            if (resTxt) resTxt.textContent = '✦ MIXTURE STABILIZED';

                            playSceneSuccessSequence(scene, 5, `${selectedVolume} L`, null, `<span class="dialogue-speaker">NOVA:</span> ✦ Quantum fuel mixture perfectly equalized! 150 L Plasma + 210 L Catalyst locked at 5:7 ratio.`);
                        }, 300);
                    }, 250);
                }, 250);

            } else {
                // ==================================================================
                // WRONG ANSWER: Local Red Glitch Shake (Zero blocking modals)
                // ==================================================================
                topCard.classList.remove('reject-shake');
                void topCard.offsetWidth; // trigger reflow
                topCard.classList.add('reject-shake');
                setTimeout(() => topCard.classList.remove('reject-shake'), 750);

                const activeCard = cylinderRack.querySelector('.yield-core-card.selected-core');
                if (activeCard) {
                    activeCard.classList.add('card-rejected');
                    setTimeout(() => activeCard.classList.remove('card-rejected'), 750);
                }

                const badge = document.getElementById('m5StatusBadge');
                if (badge) {
                    badge.textContent = `⚠ RATIO MISMATCH (${selectedVolume} L REJECTED)`;
                    badge.classList.add('status-reject');
                    setTimeout(() => {
                        if (!topCard.classList.contains('energized')) {
                            badge.textContent = 'CATALYST CORE • SELECT 7-PART CYLINDER BELOW';
                            badge.classList.remove('status-reject');
                        }
                    }, 1800);
                }

                const resState = document.getElementById('m5ResonanceState');
                const resTxt = document.getElementById('m5ResonanceTxt');
                if (resState && resTxt) {
                    resState.className = 'telemetry-state-pill reject-state';
                    resTxt.textContent = 'RATIO REJECTED';
                    setTimeout(() => {
                        if (!topCard.classList.contains('energized')) {
                            resState.className = 'telemetry-state-pill';
                            resTxt.textContent = `SLOTTED: ${selectedVolume} L`;
                        }
                    }, 1800);
                }

                const dlg = scene.querySelector('.scene-dialogue-overlay .dialogue-text');
                if (dlg) {
                    dlg.innerHTML = `<span class="dialogue-speaker">BYTE:</span> ${selectedVolume} Litres rejected! Ratio does not equal 5:7 for 360 Litres batch.`;
                }

                handleError(m);
            }
        });

        bottomCard.querySelector('#m5ActionBtnWrapper').appendChild(actionBtn);

        mainGrid.appendChild(topCard);
        mainGrid.appendChild(bottomCard);
        content.appendChild(mainGrid);

        scene.appendChild(content);
        dom.gameplayStage.appendChild(scene);
    }

    // ==========================================================================
    // MISSION 6: MULTI-POD FLUX HUB — "Average & Arithmetic Mean"
    // Layout: 2 HORIZONTAL CARDS STACKED
    //   - TOP CARD: Multi-Pod Flux Hub with 4 Generator Pods beaming into Center Core
    //   - BOTTOM CARD: 4-Pod Statistics Ledgers, Selectable Sync Nodes & Action CTA
    // ==========================================================================
    function renderTileGridScene(m) {
        const pods = [
            { id: "podA", name: "POD A", val: 140, color: "#38bdf8", class: "pod-a" },
            { id: "podB", name: "POD B", val: 180, color: "#fbbf24", class: "pod-b" },
            { id: "podC", name: "POD C", val: 210, color: "#c084fc", class: "pod-c" },
            { id: "podD", name: "POD D", val: 270, color: "#f87171", class: "pod-d" }
        ];
        const targetMean = 200; // (140 + 180 + 210 + 270) / 4 = 200 MW
        let selectedNode = null;

        const scene = createSceneShell(6, 'SYSTEM: FLUX HUB // MULTI-POD EQUILIBRIUM', 'MULTI-POD FLUX SYNCHRONIZED', 'HARMONIC DESYNC — NODE REJECTED');
        const content = document.createElement('div');
        content.className = 'scene-content';

        const statusBar = createSceneStatusBar('SYSTEM: FLUX HUB');
        content.appendChild(statusBar);

        // 2-Row Stack Container
        const mainGrid = document.createElement('div');
        mainGrid.className = 'm6-two-card-container';

        // ==========================================================================
        // CARD 1 (TOP HORIZONTAL CARD): Hero Multi-Pod Flux Hub Apparatus
        // ==========================================================================
        const topCard = document.createElement('div');
        topCard.className = 'scene-object m6-top-apparatus-card m6-flux-hub-container';
        topCard.id = 'm6FluxHubApparatusObj';
        topCard.innerHTML = `
            <div class="terminal-header-bar">
                <span class="scene-object-label">◆ MULTI-POD FLUX SYNCHRONIZATION HUB</span>
                <span class="terminal-status-chip">ARITHMETIC MEAN EQUILIBRIUM</span>
            </div>
            
            <div class="m6-flux-hub-apparatus" id="m6FluxHubApparatus">
                <div class="m6-ambient-glow" id="m6AmbientGlow"></div>

                <!-- 4 Pods Array around Center Core: Left (A & B) | Center Hub | Right (C & D) -->
                <div class="m6-hub-matrix-stage">
                    
                    <!-- LEFT PODS COLUMN (POD A & POD B) -->
                    <div class="m6-pods-column left-pods">
                        <!-- POD A: 140 MW -->
                        <div class="m6-generator-pod pod-a" id="genPodA">
                            <div class="pod-header-lbl">POD A</div>
                            <div class="pod-core-capsule">
                                <div class="pod-power-glyph">⚡</div>
                                <div class="pod-val-display">140 <span class="pod-unit">MW</span></div>
                            </div>
                            <div class="pod-beam-emitter emitter-left-top" id="emitterA"></div>
                        </div>

                        <!-- POD B: 180 MW -->
                        <div class="m6-generator-pod pod-b" id="genPodB">
                            <div class="pod-header-lbl">POD B</div>
                            <div class="pod-core-capsule">
                                <div class="pod-power-glyph">⚡</div>
                                <div class="pod-val-display">180 <span class="pod-unit">MW</span></div>
                            </div>
                            <div class="pod-beam-emitter emitter-left-bottom" id="emitterB"></div>
                        </div>
                    </div>

                    <!-- LEFT INCOMING BEAMS BRIDGE -->
                    <div class="m6-beam-conduit-zone left-conduits">
                        <div class="m6-flux-beam beam-a" id="fluxBeamA">
                            <div class="beam-laser-line"></div>
                            <div class="beam-photon particle-a"></div>
                            <span class="beam-arrow">❯ ❯</span>
                        </div>
                        <div class="m6-flux-beam beam-b" id="fluxBeamB">
                            <div class="beam-laser-line"></div>
                            <div class="beam-photon particle-b"></div>
                            <span class="beam-arrow">❯ ❯</span>
                        </div>
                    </div>

                    <!-- CENTER: LARGE CIRCULAR SYNCHRONIZATION HUB CORE -->
                    <div class="m6-center-sync-hub" id="m6CenterSyncHub">
                        <div class="m6-hub-reactor-vessel" id="m6HubVessel">
                            <div class="hub-glass-sheen"></div>
                            <div class="hub-shockwave-ring" id="hubShockwaveRing"></div>
                            
                            <!-- Unstable / Synchronized Rotating Energy Core -->
                            <div class="m6-hub-core-orb core-unstable" id="m6HubCoreOrb">
                                <div class="hub-radiance-halo"></div>
                                <div class="hub-orbit-ring ring-1"></div>
                                <div class="hub-orbit-ring ring-2"></div>
                                <div class="hub-orbit-ring ring-3"></div>
                                <div class="hub-center-glyph" id="hubCenterGlyph">⚖</div>
                            </div>

                            <div class="hub-digital-readout">
                                <span class="readout-target-lbl">SYNC NODE</span>
                                <span class="readout-power-val" id="hubPowerDisplay">-- MW</span>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT INCOMING BEAMS BRIDGE -->
                    <div class="m6-beam-conduit-zone right-conduits">
                        <div class="m6-flux-beam beam-c" id="fluxBeamC">
                            <span class="beam-arrow">❮ ❮</span>
                            <div class="beam-laser-line"></div>
                            <div class="beam-photon particle-c"></div>
                        </div>
                        <div class="m6-flux-beam beam-d" id="fluxBeamD">
                            <span class="beam-arrow">❮ ❮</span>
                            <div class="beam-laser-line"></div>
                            <div class="beam-photon particle-d"></div>
                        </div>
                    </div>

                    <!-- RIGHT PODS COLUMN (POD C & POD D) -->
                    <div class="m6-pods-column right-pods">
                        <!-- POD C: 210 MW -->
                        <div class="m6-generator-pod pod-c" id="genPodC">
                            <div class="pod-header-lbl">POD C</div>
                            <div class="pod-core-capsule">
                                <div class="pod-power-glyph">⚡</div>
                                <div class="pod-val-display">210 <span class="pod-unit">MW</span></div>
                            </div>
                            <div class="pod-beam-emitter emitter-right-top" id="emitterC"></div>
                        </div>

                        <!-- POD D: 270 MW -->
                        <div class="m6-generator-pod pod-d" id="genPodD">
                            <div class="pod-header-lbl">POD D</div>
                            <div class="pod-core-capsule">
                                <div class="pod-power-glyph">⚡</div>
                                <div class="pod-val-display">270 <span class="pod-unit">MW</span></div>
                            </div>
                            <div class="pod-beam-emitter emitter-right-bottom" id="emitterD"></div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Clean Minimalist Telemetry Strip -->
            <div class="trade-telemetry-hud m6-top-telemetry-strip">
                <div class="telemetry-pill-box">
                    <span class="telemetry-lbl">SLOTTED SYNC NODE:</span>
                    <span class="telemetry-num" id="telemetrySyncNum">--</span>
                    <span class="telemetry-unit">MW</span>
                </div>
                <div class="trade-machine-status-badge" id="m6StatusBadge">FLUX HUB • TARGET THE MEAN SYNCHRONIZATION NODE</div>
                <div class="telemetry-state-pill" id="m6ResonanceState">
                    <span class="state-pulse-led"></span>
                    <span class="state-txt" id="m6ResonanceTxt">AWAITING SYNC NODE</span>
                </div>
            </div>
        `;

        // Interactive 3D Parallax Tilt
        topCard.addEventListener('pointermove', (e) => {
            const rect = topCard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            topCard.style.setProperty('--reactor-tilt-x', `${(-y * 10).toFixed(2)}deg`);
            topCard.style.setProperty('--reactor-tilt-y', `${(x * 10).toFixed(2)}deg`);
        });

        topCard.addEventListener('pointerleave', () => {
            topCard.style.setProperty('--reactor-tilt-x', '0deg');
            topCard.style.setProperty('--reactor-tilt-y', '0deg');
        });

        // ==========================================================================
        // CARD 2 (BOTTOM HORIZONTAL CARD): 4-Pod Statistics Ledgers & Selectable Nodes
        // ==========================================================================
        const bottomCard = document.createElement('div');
        bottomCard.className = 'scene-object m6-bottom-controls-card premium-terminal';
        bottomCard.innerHTML = `
            <div class="terminal-header-bar">
                <span class="scene-object-label">◆ EQUILIBRIUM CONTROL DECK</span>
                <span class="terminal-status-chip">STATISTICAL HARMONIC FREQUENCY SELECTOR</span>
            </div>
            
            <div class="m6-bottom-deck-layout">
                <!-- Left: Specification Ledgers -->
                <div class="m6-deck-left-ledger">
                    <div class="ledger-dual-data-card horizontal-dual-card single-spec-card">
                        <div class="ledger-metric-col" style="width: 100%;">
                            <div class="metric-top-tag">GENERATOR PODS MATRIX</div>
                            <div class="m6-pod-mini-tags">
                                <span class="tag-p tag-pa">140 MW</span>
                                <span class="tag-p tag-pb">180 MW</span>
                                <span class="tag-p tag-pc">210 MW</span>
                                <span class="tag-p tag-pd">270 MW</span>
                            </div>
                            <div class="metric-sub-note">4 ACTIVE GENERATOR PODS</div>
                        </div>
                    </div>

                    <div class="bodmas-formula-card standalone-formula trade-formula-card horizontal-formula-card">
                        <div class="formula-header-tag">EQUILIBRIUM TARGET</div>
                        <div class="formula-math-display">MEAN FLUX = <span class="formula-target-qmark">? MW</span></div>
                    </div>
                </div>

                <!-- Right: 5 Selectable Node Cards & Action Button -->
                <div class="m6-deck-right-controls">
                    <div class="m6-yield-selector-header">SELECT HARMONIC SYNC NODE:</div>
                    
                    <div class="yield-cards-rack-container horizontal-cards-row" id="m6NodeRack">
                        <!-- 5 Clean Node Cards -->
                    </div>

                    <div class="m6-action-btn-wrapper" id="m6ActionBtnWrapper">
                        <!-- Action CTA Button inserted here -->
                    </div>
                </div>
            </div>
        `;

        const nodeRack = bottomCard.querySelector('#m6NodeRack');
        const nodeOptions = [
            { id: "node_185", val: 185, glyph: "💠" },
            { id: "node_195", val: 195, glyph: "💠" },
            { id: "node_200", val: 200, glyph: "⚖" },
            { id: "node_205", val: 205, glyph: "💠" },
            { id: "node_215", val: 215, glyph: "💠" }
        ];

        // Populate Sync Node Cards (Horizontal Row)
        nodeOptions.forEach(opt => {
            const card = document.createElement('div');
            card.className = 'yield-core-card horizontal-yield-card';
            card.setAttribute('data-val', opt.val);
            card.setAttribute('id', `nodeCard_${opt.val}`);
            card.innerHTML = `
                <div class="card-crystal-preview">${opt.glyph}</div>
                <div class="card-numeric-val">${opt.val}</div>
                <div class="card-unit-caption">MW (NODE)</div>
                <div class="card-hover-aura"></div>
            `;

            card.addEventListener('click', () => {
                if (topCard.classList.contains('energized')) return;
                selectNode(opt.val, card);
            });

            nodeRack.appendChild(card);
        });

        // Node Selection Handler
        function selectNode(val, activeCardEl) {
            selectedNode = val;

            // 1. Highlight Active Card
            nodeRack.querySelectorAll('.yield-core-card').forEach(c => c.classList.remove('selected-core'));
            if (activeCardEl) activeCardEl.classList.add('selected-core');

            // 2. Update Center Hub Digital Readout & Telemetry
            const hubDisplay = document.getElementById('hubPowerDisplay');
            const telemNum = document.getElementById('telemetrySyncNum');
            const resTxt = document.getElementById('m6ResonanceTxt');
            const resState = document.getElementById('m6ResonanceState');
            const hubOrb = document.getElementById('m6HubCoreOrb');

            if (hubDisplay) hubDisplay.textContent = `${val} MW`;
            if (telemNum) telemNum.textContent = val;

            // 3. Pulse Center Hub Core
            if (hubOrb) {
                hubOrb.style.transform = 'scale(1.15)';
                setTimeout(() => { hubOrb.style.transform = 'scale(1)'; }, 250);
            }

            if (resTxt && resState && !topCard.classList.contains('energized')) {
                resState.className = 'telemetry-state-pill state-ready';
                resTxt.textContent = `SLOTTED: ${val} MW`;
            }

            const badge = document.getElementById('m6StatusBadge');
            if (badge && !topCard.classList.contains('energized')) {
                badge.textContent = `NODE DOCKED (${val} MW) • READY TO SYNCHRONIZE`;
                badge.classList.remove('status-reject');
            }

            playSfx('select');
        }

        // Action CTA Button
        const actionBtn = createActionButton(m.actionLabel || 'SYNCHRONIZE MULTI-POD FLUX →', () => {
            if (!selectedNode) {
                playSfx('error');
                const badge = document.getElementById('m6StatusBadge');
                if (badge) {
                    badge.textContent = `⚠ PLEASE SELECT A HARMONIC SYNC NODE FIRST`;
                    badge.classList.add('status-reject');
                    setTimeout(() => badge.classList.remove('status-reject'), 1500);
                }
                return;
            }

            if (selectedNode === targetMean) {
                // ==================================================================
                // CORRECT ANSWER (200 MW): 4 BEAMS CONVERGE INTO HARMONIC PULSE
                // 140 + 180 + 210 + 270 = 800 MW -> Mean = 200 MW Equilibrium
                // ==================================================================
                const podA = document.getElementById('genPodA');
                const podB = document.getElementById('genPodB');
                const podC = document.getElementById('genPodC');
                const podD = document.getElementById('genPodD');
                const beamA = document.getElementById('fluxBeamA');
                const beamB = document.getElementById('fluxBeamB');
                const beamC = document.getElementById('fluxBeamC');
                const beamD = document.getElementById('fluxBeamD');
                const hubVessel = document.getElementById('m6HubVessel');
                const hubOrb = document.getElementById('m6HubCoreOrb');
                const shockwave = document.getElementById('hubShockwaveRing');
                const badge = document.getElementById('m6StatusBadge');
                const resState = document.getElementById('m6ResonanceState');
                const resTxt = document.getElementById('m6ResonanceTxt');

                playSfx('select');

                // Step 1: All 4 Beams ignite with high-intensity coherent laser stream
                [beamA, beamB, beamC, beamD].forEach(b => { if (b) b.classList.add('beam-synchronized'); });
                [podA, podB, podC, podD].forEach(p => { if (p) p.classList.add('pod-energized'); });

                if (badge) {
                    badge.textContent = `✦ 1. FOUR BEAMS STREAMING TO CENTER HUB (800 MW TOTAL)...`;
                    badge.classList.remove('status-reject');
                }

                // Step 2: Center Core stabilizes & aligns frequencies (after 300ms)
                setTimeout(() => {
                    if (hubOrb) {
                        hubOrb.classList.remove('core-unstable');
                        hubOrb.classList.add('core-synchronized');
                    }
                    if (hubVessel) hubVessel.classList.add('vessel-supercharged');
                    playSfx('chirp');

                    if (badge) badge.textContent = `✦ 2. EQUALIZING ARITHMETIC MEAN (800 ÷ 4 = 200 MW)...`;

                    // Step 3: Trigger High-Energy Synchronized Pulse Shockwave (after 600ms)
                    setTimeout(() => {
                        if (shockwave) shockwave.classList.add('pulse-blast');
                        playSfx('powerup');

                        if (resState && resTxt) {
                            resState.className = 'telemetry-state-pill harmonized';
                            resTxt.textContent = '✦ 200 MW EQUILIBRIUM LOCKED';
                        }

                        // Step 4: Full Machine Enters Green/White Stable State (after 900ms)
                        setTimeout(() => {
                            topCard.classList.remove('reject-shake');
                            topCard.classList.add('energized', 'green-white-stable', 'quantum-online-pulse');
                            scene.classList.add('lens-activated', 'reactor-activated');

                            if (badge) {
                                badge.textContent = `✦ MULTI-POD FLUX EQUALIZED • 200 MW HARMONIZED`;
                                badge.classList.add('locked');
                            }
                            if (resTxt) resTxt.textContent = '✦ FLUX BALANCED';

                            playSceneSuccessSequence(scene, 6, `${selectedNode} MW`, null, `<span class="dialogue-speaker">BLAZE:</span> ✦ Multi-Pod Flux Hub perfectly synchronized! (140+180+210+270) ÷ 4 = 200 MW balanced pulse achieved!`);
                        }, 300);
                    }, 300);
                }, 300);

            } else {
                // ==================================================================
                // WRONG ANSWER: Local Red Glitch Shake (Zero blocking modals)
                // ==================================================================
                topCard.classList.remove('reject-shake');
                void topCard.offsetWidth; // trigger reflow
                topCard.classList.add('reject-shake');
                setTimeout(() => topCard.classList.remove('reject-shake'), 750);

                const activeCard = nodeRack.querySelector('.yield-core-card.selected-core');
                if (activeCard) {
                    activeCard.classList.add('card-rejected');
                    setTimeout(() => activeCard.classList.remove('card-rejected'), 750);
                }

                const badge = document.getElementById('m6StatusBadge');
                if (badge) {
                    badge.textContent = `⚠ HARMONIC MISMATCH (${selectedNode} MW REJECTED)`;
                    badge.classList.add('status-reject');
                    setTimeout(() => {
                        if (!topCard.classList.contains('energized')) {
                            badge.textContent = 'FLUX HUB • TARGET THE MEAN SYNCHRONIZATION NODE';
                            badge.classList.remove('status-reject');
                        }
                    }, 1800);
                }

                const resState = document.getElementById('m6ResonanceState');
                const resTxt = document.getElementById('m6ResonanceTxt');
                if (resState && resTxt) {
                    resState.className = 'telemetry-state-pill reject-state';
                    resTxt.textContent = 'HARMONIC REJECTED';
                    setTimeout(() => {
                        if (!topCard.classList.contains('energized')) {
                            resState.className = 'telemetry-state-pill';
                            resTxt.textContent = `SLOTTED: ${selectedNode} MW`;
                        }
                    }, 1800);
                }

                const dlg = scene.querySelector('.scene-dialogue-overlay .dialogue-text');
                if (dlg) {
                    dlg.innerHTML = `<span class="dialogue-speaker">BLAZE:</span> ${selectedNode} MW rejected! Total 800 MW divided across 4 generator pods requires a 200 MW mean node.`;
                }

                handleError(m);
            }
        });

        bottomCard.querySelector('#m6ActionBtnWrapper').appendChild(actionBtn);

        mainGrid.appendChild(topCard);
        mainGrid.appendChild(bottomCard);
        content.appendChild(mainGrid);

        scene.appendChild(content);
        dom.gameplayStage.appendChild(scene);
    }

    // ==========================================================================
    // MISSION 7: DUAL PUMP REACTOR — "Time & Work / Hydrodynamic Rate"
    // Layout: 2 HORIZONTAL CARDS STACKED
    //   - TOP CARD: Dual-Pump Hydro Reactor (PUMP A ──► RESERVOIR ◄── PUMP B)
    //   - BOTTOM CARD: Pump Specification Ledgers, Selectable Sync Rates & Action CTA
    // ==========================================================================
    function renderRatioTerminalScene(m) {
        const targetRate = 4; // 1/12 + 1/6 = 3/12 = 1/4 -> 4 Hours
        let selectedRate = null;

        const scene = createSceneShell(7, 'SYSTEM: HYDRO REACTOR // FLOW EQUILIBRIUM', 'DUAL HYDRO PUMPS SYNCHRONIZED', 'FLOW RATE DESYNC — REJECTED');
        const content = document.createElement('div');
        content.className = 'scene-content';

        const statusBar = createSceneStatusBar('SYSTEM: HYDRO-PUMP MATRIX');
        content.appendChild(statusBar);

        // 2-Row Stack Container
        const mainGrid = document.createElement('div');
        mainGrid.className = 'm7-two-card-container';

        // ==========================================================================
        // CARD 1 (TOP HORIZONTAL CARD): Hero Dual-Pump Hydro Reactor Apparatus
        // ==========================================================================
        const topCard = document.createElement('div');
        topCard.className = 'scene-object m7-top-apparatus-card m7-reactor-container';
        topCard.id = 'm7ReactorApparatusObj';
        topCard.innerHTML = `
            <div class="terminal-header-bar">
                <span class="scene-object-label">◆ DUAL-PUMP HYDRO REACTOR</span>
                <span class="terminal-status-chip">HYDRODYNAMIC WORK SYNCHRONIZATION</span>
            </div>
            
            <div class="m7-reactor-apparatus" id="m7ReactorApparatus">
                <div class="m7-ambient-glow" id="m7AmbientGlow"></div>

                <!-- 3-Part Hydro Pipeline: Pump A (Left) ──► Reservoir (Center) ◄── Pump B (Right) -->
                <div class="m7-hydro-pipeline-row">
                    
                    <!-- 1. LEFT PUMP: PUMP A (12 Hours Standalone) -->
                    <div class="m7-pump-unit pump-a" id="pumpUnitA">
                        <div class="pump-header-lbl">PUMP A</div>
                        <div class="pump-housing-capsule">
                            <div class="pump-piston-chamber">
                                <div class="piston-rod rod-left"></div>
                                <div class="piston-fluid-chamber chamber-a">
                                    <div class="fluid-swirl swirl-a"></div>
                                </div>
                            </div>
                            <div class="pump-rate-badge">12 <span class="pump-unit">HRS</span></div>
                            <div class="pump-sub-tag">PRIMARY FLOW</div>
                        </div>
                    </div>

                    <!-- Inflow Conduit 1: Pump A -> Reservoir Top Inflow -->
                    <div class="m7-hydro-conduit conduit-a" id="conduitA">
                        <div class="conduit-pipe-rail"></div>
                        <div class="conduit-fluid-flow flow-a"></div>
                        <div class="conduit-chevrons">❯ ❯ ❯</div>
                    </div>

                    <!-- 2. CENTER: LARGE VERTICAL HYDRO RESERVOIR TANK -->
                    <div class="m7-center-reservoir-deck" id="m7CenterReservoirDeck">
                        <div class="m7-vertical-reservoir-tank" id="m7ReservoirTank">
                            <div class="reservoir-glass-sheen"></div>
                            
                            <!-- Pressure Relief Exit Gate (Opens at 100% fill) -->
                            <div class="reservoir-top-gate" id="reservoirTopGate">
                                <span class="gate-status-lbl" id="gateStatusLbl">PRESSURE GATE: LOCKED</span>
                                <div class="gate-lock-leds"><span></span><span></span></div>
                            </div>

                            <!-- Inside Water Level (Animates & Rises on Rate Selection / Full Fill) -->
                            <div class="reservoir-liquid-chamber">
                                <div class="reservoir-water-fill" id="reservoirWaterFill" style="height: 35%;">
                                    <div class="water-surface-waves"></div>
                                    <div class="water-core-bubbles">
                                        <span class="bubble b1"></span>
                                        <span class="bubble b2"></span>
                                        <span class="bubble b3"></span>
                                    </div>
                                    <div class="reservoir-center-gem" id="reservoirCenterGem">🌊</div>
                                </div>
                                <div class="reservoir-level-ticks">
                                    <span>100%</span>
                                    <span>75%</span>
                                    <span>50%</span>
                                    <span>25%</span>
                                </div>
                            </div>

                            <div class="reservoir-digital-badge">
                                <span class="reservoir-power-num" id="reservoirRateDisplay">--</span>
                                <span class="reservoir-power-unit">HRS COMBINED</span>
                            </div>
                        </div>
                    </div>

                    <!-- Inflow Conduit 2: Pump B -> Reservoir Bottom Inflow -->
                    <div class="m7-hydro-conduit conduit-b" id="conduitB">
                        <div class="conduit-pipe-rail"></div>
                        <div class="conduit-fluid-flow flow-b"></div>
                        <div class="conduit-chevrons">❮ ❮ ❮</div>
                    </div>

                    <!-- 3. RIGHT PUMP: PUMP B (6 Hours Standalone) -->
                    <div class="m7-pump-unit pump-b" id="pumpUnitB">
                        <div class="pump-header-lbl">PUMP B</div>
                        <div class="pump-housing-capsule">
                            <div class="pump-piston-chamber">
                                <div class="piston-rod rod-right"></div>
                                <div class="piston-fluid-chamber chamber-b">
                                    <div class="fluid-swirl swirl-b"></div>
                                </div>
                            </div>
                            <div class="pump-rate-badge">6 <span class="pump-unit">HRS</span></div>
                            <div class="pump-sub-tag">BOOST FLOW</div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Clean Minimalist Telemetry Strip -->
            <div class="trade-telemetry-hud m7-top-telemetry-strip">
                <div class="telemetry-pill-box">
                    <span class="telemetry-lbl">SLOTTED COMBINED RATE:</span>
                    <span class="telemetry-num" id="telemetryRateNum">--</span>
                    <span class="telemetry-unit">HOURS</span>
                </div>
                <div class="trade-machine-status-badge" id="m7StatusBadge">HYDRO REACTOR • DETERMINE COMBINED WORK RATE</div>
                <div class="telemetry-state-pill" id="m7ResonanceState">
                    <span class="state-pulse-led"></span>
                    <span class="state-txt" id="m7ResonanceTxt">AWAITING RATE SYNC</span>
                </div>
            </div>
        `;

        // Interactive 3D Parallax Tilt
        topCard.addEventListener('pointermove', (e) => {
            const rect = topCard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            topCard.style.setProperty('--reactor-tilt-x', `${(-y * 10).toFixed(2)}deg`);
            topCard.style.setProperty('--reactor-tilt-y', `${(x * 10).toFixed(2)}deg`);
        });

        topCard.addEventListener('pointerleave', () => {
            topCard.style.setProperty('--reactor-tilt-x', '0deg');
            topCard.style.setProperty('--reactor-tilt-y', '0deg');
        });

        // ==========================================================================
        // CARD 2 (BOTTOM HORIZONTAL CARD): Pump Specification Ledgers & Duration Cards
        // ==========================================================================
        const bottomCard = document.createElement('div');
        bottomCard.className = 'scene-object m7-bottom-controls-card premium-terminal';
        bottomCard.innerHTML = `
            <div class="terminal-header-bar">
                <span class="scene-object-label">◆ FLOW RATE CONTROL DECK</span>
                <span class="terminal-status-chip">COMBINED HYDRODYNAMIC WORK RATE SELECTOR</span>
            </div>
            
            <div class="m7-bottom-deck-layout">
                <!-- Left: Specification Ledgers -->
                <div class="m7-deck-left-ledger">
                    <div class="ledger-dual-data-card horizontal-dual-card">
                        <div class="ledger-metric-col">
                            <div class="metric-top-tag">PUMP A RATING</div>
                            <div class="metric-big-num"><span class="val-highlight">12</span> <span class="val-unit">HRS</span></div>
                            <div class="metric-sub-note">PRIMARY CONDUIT</div>
                        </div>
                        <div class="ledger-metric-divider"></div>
                        <div class="ledger-metric-col">
                            <div class="metric-top-tag">PUMP B RATING</div>
                            <div class="metric-big-num"><span class="val-highlight-profit">6</span> <span class="val-unit">HRS</span></div>
                            <div class="metric-sub-note">BOOSTER CONDUIT</div>
                        </div>
                    </div>

                    <div class="bodmas-formula-card standalone-formula trade-formula-card horizontal-formula-card">
                        <div class="formula-header-tag">SYNCHRONIZATION TARGET</div>
                        <div class="formula-math-display">COMBINED FILL TIME = <span class="formula-target-qmark">? HOURS (DUAL PUMPS)</span></div>
                    </div>
                </div>

                <!-- Right: 5 Selectable Duration Cards & Action Button -->
                <div class="m7-deck-right-controls">
                    <div class="m7-yield-selector-header">SELECT COMBINED SYNC DURATION:</div>
                    
                    <div class="yield-cards-rack-container horizontal-cards-row" id="m7DurationRack">
                        <!-- 5 Clean Duration Cards -->
                    </div>

                    <div class="m7-action-btn-wrapper" id="m7ActionBtnWrapper">
                        <!-- Action CTA Button inserted here -->
                    </div>
                </div>
            </div>
        `;

        const durationRack = bottomCard.querySelector('#m7DurationRack');
        const durationOptions = [
            { id: "dur_2", val: 2, glyph: "💧" },
            { id: "dur_3", val: 3, glyph: "💧" },
            { id: "dur_4", val: 4, glyph: "💧" },
            { id: "dur_5", val: 5, glyph: "💧" },
            { id: "dur_6", val: 6, glyph: "💧" }
        ];

        // Populate Duration Cards (Horizontal Row)
        durationOptions.forEach(opt => {
            const card = document.createElement('div');
            card.className = 'yield-core-card horizontal-yield-card';
            card.setAttribute('data-val', opt.val);
            card.setAttribute('id', `durCard_${opt.val}`);
            card.innerHTML = `
                <div class="card-crystal-preview">${opt.glyph}</div>
                <div class="card-numeric-val">${opt.val}</div>
                <div class="card-unit-caption">HOURS (SYNC)</div>
                <div class="card-hover-aura"></div>
            `;

            card.addEventListener('click', () => {
                if (topCard.classList.contains('energized')) return;
                selectDuration(opt.val, card);
            });

            durationRack.appendChild(card);
        });

        // Duration Selection Handler
        function selectDuration(val, activeCardEl) {
            selectedRate = val;

            // 1. Highlight Active Card
            durationRack.querySelectorAll('.yield-core-card').forEach(c => c.classList.remove('selected-core'));
            if (activeCardEl) activeCardEl.classList.add('selected-core');

            // 2. Dynamically Adjust Reservoir Water Level Preview
            const waterFill = document.getElementById('reservoirWaterFill');
            const rateDisplay = document.getElementById('reservoirRateDisplay');
            const telemNum = document.getElementById('telemetryRateNum');
            const resTxt = document.getElementById('m7ResonanceTxt');
            const resState = document.getElementById('m7ResonanceState');
            const conduitA = document.getElementById('conduitA');
            const conduitB = document.getElementById('conduitB');

            if (rateDisplay) rateDisplay.textContent = val;
            if (telemNum) telemNum.textContent = val;

            // Dynamic preview water level
            if (waterFill) {
                const previewHeight = val === 4 ? 65 : (val < 4 ? 45 : 55);
                waterFill.style.height = `${previewHeight}%`;
            }

            // Pulse both conduits on selection
            [conduitA, conduitB].forEach(c => {
                if (c) {
                    c.classList.add('pulse-stream');
                    setTimeout(() => c.classList.remove('pulse-stream'), 400);
                }
            });

            if (resTxt && resState && !topCard.classList.contains('energized')) {
                resState.className = 'telemetry-state-pill state-ready';
                resTxt.textContent = `SLOTTED: ${val} HOURS`;
            }

            const badge = document.getElementById('m7StatusBadge');
            if (badge && !topCard.classList.contains('energized')) {
                badge.textContent = `RATE DOCKED (${val} HRS) • READY TO SYNCHRONIZE`;
                badge.classList.remove('status-reject');
            }

            playSfx('select');
        }

        // Action CTA Button
        const actionBtn = createActionButton(m.actionLabel || 'SYNCHRONIZE DUAL PUMPS & OPEN GATE →', () => {
            if (!selectedRate) {
                playSfx('error');
                const badge = document.getElementById('m7StatusBadge');
                if (badge) {
                    badge.textContent = `⚠ PLEASE SELECT A COMBINED WORK DURATION FIRST`;
                    badge.classList.add('status-reject');
                    setTimeout(() => badge.classList.remove('status-reject'), 1500);
                }
                return;
            }

            if (selectedRate === targetRate) {
                // ==================================================================
                // CORRECT ANSWER (4 HOURS): FULL HYDRODYNAMIC CASCADE & GATE OPEN
                // 1/12 + 1/6 = 3/12 = 1/4 -> 4 Hours combined fill
                // ==================================================================
                const pumpA = document.getElementById('pumpUnitA');
                const pumpB = document.getElementById('pumpUnitB');
                const conduitA = document.getElementById('conduitA');
                const conduitB = document.getElementById('conduitB');
                const waterFill = document.getElementById('reservoirWaterFill');
                const topGate = document.getElementById('reservoirTopGate');
                const gateLbl = document.getElementById('gateStatusLbl');
                const reservoirTank = document.getElementById('m7ReservoirTank');
                const badge = document.getElementById('m7StatusBadge');
                const resState = document.getElementById('m7ResonanceState');
                const resTxt = document.getElementById('m7ResonanceTxt');

                playSfx('select');

                // Step 1: Both Pumps ignite with high pressure pumping
                if (pumpA) pumpA.classList.add('pump-energized');
                if (pumpB) pumpB.classList.add('pump-energized');
                if (conduitA) conduitA.classList.add('conduit-active');
                if (conduitB) conduitB.classList.add('conduit-active');

                if (badge) {
                    badge.textContent = `✦ 1. PUMP A (12h) & PUMP B (6h) INJECTING COMBINED FLOW...`;
                    badge.classList.remove('status-reject');
                }

                // Step 2: Water level in reservoir rapidly rises to 100% (after 300ms)
                setTimeout(() => {
                    if (waterFill) waterFill.style.height = '100%';
                    if (reservoirTank) reservoirTank.classList.add('tank-supercharged');
                    playSfx('chirp');

                    if (badge) badge.textContent = `✦ 2. RESERVOIR FILLING AT RATE: 1/12 + 1/6 = 1/4 (4 HOURS)...`;

                    // Step 3: Reservoir reaches 100% capacity and Quantum Gate unlocks (after 600ms)
                    setTimeout(() => {
                        if (topGate) topGate.classList.add('gate-unlocked');
                        if (gateLbl) gateLbl.textContent = '✦ GATE OPEN // FLOW STABILIZED';
                        playSfx('powerup');

                        if (resState && resTxt) {
                            resState.className = 'telemetry-state-pill harmonized';
                            resTxt.textContent = '✦ DUAL PUMPS HARMONIZED (4h)';
                        }

                        // Step 4: Entire Machine Enters Green/White Stable State (after 900ms)
                        setTimeout(() => {
                            topCard.classList.remove('reject-shake');
                            topCard.classList.add('energized', 'green-white-stable', 'quantum-online-pulse');
                            scene.classList.add('lens-activated', 'reactor-activated');

                            if (badge) {
                                badge.textContent = `✦ RESERVOIR FULL • 4 HOURS COMBINED RATE LOCKED`;
                                badge.classList.add('locked');
                            }
                            if (resTxt) resTxt.textContent = '✦ GATE PURGE COMPLETE';

                            playSceneSuccessSequence(scene, 7, `${selectedRate} HOURS`, null, `<span class="dialogue-speaker">BYTE:</span> ✦ 4 Hours combined flow rate confirmed! Reservoir filled and Quantum Relief Gate successfully unlocked.`);
                        }, 300);
                    }, 300);
                }, 300);

            } else {
                // ==================================================================
                // WRONG ANSWER: Local Red Cavitation Shake (Zero blocking modals)
                // ==================================================================
                topCard.classList.remove('reject-shake');
                void topCard.offsetWidth; // trigger reflow
                topCard.classList.add('reject-shake');
                setTimeout(() => topCard.classList.remove('reject-shake'), 750);

                const activeCard = durationRack.querySelector('.yield-core-card.selected-core');
                if (activeCard) {
                    activeCard.classList.add('card-rejected');
                    setTimeout(() => activeCard.classList.remove('card-rejected'), 750);
                }

                const badge = document.getElementById('m7StatusBadge');
                if (badge) {
                    badge.textContent = `⚠ FLOW RATE MISMATCH (${selectedRate} HOURS REJECTED)`;
                    badge.classList.add('status-reject');
                    setTimeout(() => {
                        if (!topCard.classList.contains('energized')) {
                            badge.textContent = 'HYDRO REACTOR • DETERMINE COMBINED WORK RATE';
                            badge.classList.remove('status-reject');
                        }
                    }, 1800);
                }

                const resState = document.getElementById('m7ResonanceState');
                const resTxt = document.getElementById('m7ResonanceTxt');
                if (resState && resTxt) {
                    resState.className = 'telemetry-state-pill reject-state';
                    resTxt.textContent = 'FLOW RATE REJECTED';
                    setTimeout(() => {
                        if (!topCard.classList.contains('energized')) {
                            resState.className = 'telemetry-state-pill';
                            resTxt.textContent = `SLOTTED: ${selectedRate} HOURS`;
                        }
                    }, 1800);
                }

                const dlg = scene.querySelector('.scene-dialogue-overlay .dialogue-text');
                if (dlg) {
                    dlg.innerHTML = `<span class="dialogue-speaker">BYTE:</span> ${selectedRate} Hours rejected! Combined rate formula 1/12 + 1/6 = 3/12 = 1/4 yields exactly 4 Hours.`;
                }

                handleError(m);
            }
        });

        bottomCard.querySelector('#m7ActionBtnWrapper').appendChild(actionBtn);

        mainGrid.appendChild(topCard);
        mainGrid.appendChild(bottomCard);
        content.appendChild(mainGrid);

        scene.appendChild(content);
        dom.gameplayStage.appendChild(scene);
    }

    // ==========================================================================
    // ==========================================================================
    // MISSION 8: ORBITAL NAVIGATION CORE — "Time-Speed-Distance / Trajectory Intercept"
    // Layout: 2 HORIZONTAL CARDS STACKED
    //   - TOP CARD: Integrated Holographic Astrolabe Star-Chart & Arching Trajectory
    //   - BOTTOM CARD: Flight Telemetry Ledgers, Selectable Intercept Distances & Action CTA
    // ==========================================================================
    // MISSION 8: RECON PROBE ALPHA-01 (MAGNETIC GANTRY DOCK) — "Speed, Time & Distance"
    // Layout: Standard 3-Card Architecture (Matching Chapter 1 Precision Standard)
    //   - CARD 1 (LEFT): Flight Avionics Telemetry (90 km/h Velocity Ladder + 40 min Chronometer)
    //   - CARD 2 (CENTER): High-Tech Recon Probe Alpha-01 in Magnetic Gantry Suspension Dock
    //   - CARD 3 (RIGHT): Tactical Targeting Computer, Intercept Range Slider & Engage CTA
    // ==========================================================================
    function renderCipherWheelsScene(m) {
        const speed = (m.data && parseInt(m.data.speed, 10)) || 90; // km/h
        const minutes = (m.data && (parseInt(m.data.minutes, 10) || parseInt(m.data.time, 10))) || 40; // min
        const targetDistance = (m.data && parseInt(m.data.targetDistance, 10)) || Math.round(speed * (minutes / 60)); // 60 km
        let currentSliderVal = 0;

        const scene = createSceneShell(8, 'SYSTEM: WARP TRAJECTORY // RECON PROBE', 'ORBITAL BEACON INTERCEPT LOCKED', 'TRAJECTORY UNSTABLE — RE-CALCULATE');
        const content = document.createElement('div');
        content.className = 'scene-content';

        const statusBar = createSceneStatusBar('SYSTEM: WARP TRAJECTORY');
        content.appendChild(statusBar);

        // Main 3-column grid matching Mission 1 & 9 standard (No outer enclosing card box)
        const mainScreen = document.createElement('div');
        mainScreen.className = 'scene-main-grid m8-probe-grid';
        mainScreen.id = 'm8MainScreen';

        mainScreen.innerHTML = `
            <!-- ==================================================================
                 CARD 1 (LEFT): AVIONICS & SENSORS TELEMETRY
                 ================================================================== -->
            <div class="scene-object crystal-rack-panel m8-card-telemetry" id="m8CardTelemetry">
                <div class="rack-header-bar">
                    <span class="scene-object-label">◆ AVIONICS SENSORS</span>
                    <span class="rack-status-chip">TELEMETRY: LIVE</span>
                </div>

                <div class="m8-telemetry-stack">
                    <!-- AIRSPEED / ORBITAL VELOCITY GAUGE (90 KM/H) -->
                    <div class="m8-telemetry-pod pod-velocity" id="m8PodVelocity" tabindex="0" role="region" aria-label="Cruise Velocity 90 km/h">
                        <div class="pod-gauge-wrapper">
                            <div class="avionics-speed-ladder">
                                <div class="speed-tape-ticks">
                                    <span class="tape-tick">120</span>
                                    <span class="tape-tick active-90">90</span>
                                    <span class="tape-tick">60</span>
                                    <span class="tape-tick">30</span>
                                </div>
                                <div class="speed-ladder-indicator"></div>
                            </div>
                        </div>
                        <div class="pod-meta-box">
                            <div class="pod-label-tag cyan-txt">CRUISE VELOCITY (v)</div>
                            <div class="pod-value-row">
                                <span class="pod-big-num cyan-txt">${speed}.0</span>
                                <span class="pod-unit-lbl">KM/H</span>
                            </div>
                            <div class="pod-sub-note">MACH 0.073 // CONSTANT CRUISE</div>
                        </div>
                    </div>

                    <!-- MISSION CHRONOMETER (40 MIN / 2/3 HR) -->
                    <div class="m8-telemetry-pod pod-chronometer" id="m8PodChronometer" tabindex="0" role="region" aria-label="Flight Time 40 Minutes">
                        <div class="pod-gauge-wrapper">
                            <div class="avionics-chrono-dial">
                                <div class="chrono-sweep-ring"></div>
                                <div class="chrono-digital-stamp">40m</div>
                            </div>
                        </div>
                        <div class="pod-meta-box">
                            <div class="pod-label-tag amber-txt">ELAPSED TIME (t)</div>
                            <div class="pod-value-row">
                                <span class="pod-big-num amber-txt">${minutes}:00</span>
                                <span class="pod-unit-lbl">MIN</span>
                            </div>
                            <div class="pod-sub-note">t = 40/60 HR = 2/3 HR (0.67 HR)</div>
                        </div>
                    </div>
                </div>

                <!-- TIME CONVERSION BAR -->
                <div class="m8-conversion-bar">
                    <span class="conv-key">UNIT CONVERSION</span>
                    <span class="conv-val">${minutes} MIN ÷ 60 = 2/3 HR</span>
                </div>
            </div>

            <!-- ==================================================================
                 CARD 2 (CENTER): RECON PROBE ALPHA-01 (MAGNETIC GANTRY DOCK)
                 ================================================================== -->
            <div class="scene-object pattern-lens-container m8-card-probe" id="m8CardProbe">
                <div class="rack-header-bar">
                    <span class="scene-object-label">◆ RECON PROBE ALPHA-01</span>
                </div>

                <div class="m8-probe-viewport" id="m8ProbeViewport">
                    <!-- Deep Space Tactical Backdrop -->
                    <div class="probe-gantry-backdrop">
                        <div class="gantry-hex-grid"></div>
                        <div class="gantry-radial-glow"></div>
                        <div class="gantry-telemetry-crosshairs"></div>
                        
                        <!-- Distant Target Orbital Beacon -->
                        <div class="probe-target-locator" id="m8TargetLocator">
                            <div class="locator-beacon-core"></div>
                            <div class="locator-pulse-ring"></div>
                            <span class="locator-tag">BEACON-08 // 60 KM</span>
                        </div>

                        <!-- Dynamic Sonar Acoustic Pulse Wave Field -->
                        <div class="probe-sonar-pulse-field" id="m8SonarPulseField">
                            <div class="sonar-pulse-wave" id="m8SonarWave1"></div>
                            <div class="sonar-pulse-wave" id="m8SonarWave2"></div>
                        </div>
                    </div>

                    <!-- Magnetic Gantry Armature Ring (Suspension Field) -->
                    <div class="mag-gantry-ring" id="m8MagGantry">
                        <div class="mag-field-ring field-outer"></div>
                        <div class="mag-field-ring field-inner"></div>
                        <div class="mag-emitter-pylon pylon-top"><span class="coil-glow"></span></div>
                        <div class="mag-emitter-pylon pylon-bottom"><span class="coil-glow"></span></div>
                        <div class="mag-emitter-pylon pylon-left"><span class="coil-glow"></span></div>
                        <div class="mag-emitter-pylon pylon-right"><span class="coil-glow"></span></div>
                    </div>

                    <!-- RECON PROBE ALPHA-01 SPACECRAFT APPARATUS (Vector 3D Construction) -->
                    <div class="recon-probe-apparatus" id="m8ProbeShip">
                        <!-- Forward Collimator Targeting Laser Pointer -->
                        <div class="probe-target-laser" id="m8ProbeLaser">
                            <div class="laser-collimator-ray" id="m8CollimatorRay"></div>
                            <div class="laser-focal-spark"></div>
                        </div>

                        <!-- Stealth Delta Wings with Aviation Nav Lights -->
                        <div class="probe-wing-assembly">
                            <div class="probe-wing wing-left">
                                <div class="wing-panel-line"></div>
                                <div class="nav-light nav-port" title="Port (Red) Nav Light"></div>
                            </div>
                            <div class="probe-wing wing-right">
                                <div class="wing-panel-line"></div>
                                <div class="nav-light nav-starboard" title="Starboard (Green) Nav Light"></div>
                            </div>
                        </div>

                        <!-- Heavy Titanium Stealth Fuselage / Main Hull -->
                        <div class="probe-fuselage">
                            <div class="hull-heat-tiles"></div>
                            <div class="hull-chassis-bevel"></div>
                            <div class="hull-callsign">ALPHA-01</div>
                            <div class="nav-light nav-strobe" title="Dorsal Anti-Collision Strobe"></div>

                            <!-- Quantum Radar Avionics Cockpit Eye -->
                            <div class="probe-cockpit-eye">
                                <div class="eye-optical-core"></div>
                                <div class="eye-scanner-sweep"></div>
                            </div>

                            <!-- Rotating Dorsal Sensor / Comm Dish -->
                            <div class="probe-sensor-dish">
                                <div class="dish-parabolic-arm"></div>
                                <div class="dish-sub-reflector"></div>
                            </div>
                        </div>

                        <!-- Dual Ion-Plasma Propulsion Thrusters Assembly -->
                        <div class="probe-thrusters-assembly">
                            <!-- Left Thruster -->
                            <div class="thruster-pod pod-l">
                                <div class="thruster-nozzle-bell"></div>
                                <div class="plasma-jet-flame flame-l" id="m8FlameL">
                                    <div class="plasma-core"></div>
                                    <div class="plasma-shock-diamond"></div>
                                </div>
                            </div>
                            <!-- Right Thruster -->
                            <div class="thruster-pod pod-r">
                                <div class="thruster-nozzle-bell"></div>
                                <div class="plasma-jet-flame flame-r" id="m8FlameR">
                                    <div class="plasma-core"></div>
                                    <div class="plasma-shock-diamond"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- ==================================================================
                 CARD 3 (RIGHT): TACTICAL SONAR RADAR TRANSCEIVER & BEACON LOCATOR
                 ================================================================== -->
            <div class="scene-object control-panel-display premium-terminal m8-card-console" id="m8CardConsole">
                <div class="terminal-header-bar">
                    <span class="scene-object-label">◆ SONAR TRANSCEIVER</span>
                    <span class="terminal-status-chip" id="m8SonarStatusChip">STANDBY</span>
                </div>

                <div class="m8-console-body">
                    <!-- Acoustic Wave Oscilloscope -->
                    <div class="m8-oscilloscope-container" id="m8ScopeContainer">
                        <div class="scope-header">
                            <span class="scope-label">ACOUSTIC RESONANCE SCOPE</span>
                            <span class="scope-freq-tag" id="m8ScopeFreqTag">BAND: READY</span>
                        </div>
                        <div class="scope-screen" id="m8ScopeScreen">
                            <div class="scope-grid-overlay"></div>
                            <div class="scope-wave-line" id="m8ScopeWave"></div>
                            <div class="scope-sweep-laser"></div>
                            <div class="scope-target-lock-label" id="m8ScopeLockText">SELECT RADAR RANGE BAND</div>
                        </div>
                    </div>

                    <!-- Tactical Radar Range Bands Selector Grid -->
                    <div class="sonar-sectors-section">
                        <div class="sectors-title-row">
                            <span class="sectors-title-tag">SCAN RANGE BANDS:</span>
                            <span class="sectors-formula-note">d = 90 × ⅔ = 60 KM</span>
                        </div>
                        <div class="sonar-sector-buttons-grid" id="m8SectorGrid">
                            <button type="button" class="sonar-sector-btn" data-range="30">
                                <div class="sector-btn-indicator"></div>
                                <div class="sector-meta">
                                    <span class="sector-band-name">SECTOR α</span>
                                    <span class="sector-range-val">30 KM</span>
                                </div>
                                <span class="sector-status-dot"></span>
                            </button>
                            <button type="button" class="sonar-sector-btn" data-range="45">
                                <div class="sector-btn-indicator"></div>
                                <div class="sector-meta">
                                    <span class="sector-band-name">SECTOR β</span>
                                    <span class="sector-range-val">45 KM</span>
                                </div>
                                <span class="sector-status-dot"></span>
                            </button>
                            <button type="button" class="sonar-sector-btn" data-range="60">
                                <div class="sector-btn-indicator"></div>
                                <div class="sector-meta">
                                    <span class="sector-band-name">SECTOR γ</span>
                                    <span class="sector-range-val">60 KM</span>
                                </div>
                                <span class="sector-status-dot"></span>
                            </button>
                            <button type="button" class="sonar-sector-btn" data-range="75">
                                <div class="sector-btn-indicator"></div>
                                <div class="sector-meta">
                                    <span class="sector-band-name">SECTOR δ</span>
                                    <span class="sector-range-val">75 KM</span>
                                </div>
                                <span class="sector-status-dot"></span>
                            </button>
                            <button type="button" class="sonar-sector-btn" data-range="90">
                                <div class="sector-btn-indicator"></div>
                                <div class="sector-meta">
                                    <span class="sector-band-name">SECTOR ε</span>
                                    <span class="sector-range-val">90 KM</span>
                                </div>
                                <span class="sector-status-dot"></span>
                            </button>
                        </div>
                    </div>

                    <!-- Action CTA Slot -->
                    <div class="m8-action-btn-wrapper" id="m8ActionSlot">
                        <!-- Action CTA Button inserted here -->
                    </div>
                </div>
            </div>
        `;

        // ==========================================================================
        // SONAR RADAR INTERACTIVE LOGIC & ACOUSTIC SCOPE
        // ==========================================================================
        let selectedRange = 0;
        const collimatorRay = mainScreen.querySelector('#m8CollimatorRay');
        const targetLocator = mainScreen.querySelector('#m8TargetLocator');
        const cardProbe = mainScreen.querySelector('#m8CardProbe');
        const probeShip = mainScreen.querySelector('#m8ProbeShip');
        const magGantry = mainScreen.querySelector('#m8MagGantry');
        const flameL = mainScreen.querySelector('#m8FlameL');
        const flameR = mainScreen.querySelector('#m8FlameR');
        const sonarStatusChip = mainScreen.querySelector('#m8SonarStatusChip');
        const scopeScreen = mainScreen.querySelector('#m8ScopeScreen');
        const scopeFreqTag = mainScreen.querySelector('#m8ScopeFreqTag');
        const scopeLockText = mainScreen.querySelector('#m8ScopeLockText');
        const sonarWave1 = mainScreen.querySelector('#m8SonarWave1');
        const sonarWave2 = mainScreen.querySelector('#m8SonarWave2');
        const sectorBtns = mainScreen.querySelectorAll('.sonar-sector-btn');

        function triggerSonarPulse() {
            if (sonarWave1 && sonarWave2) {
                sonarWave1.classList.remove('pulse-active');
                sonarWave2.classList.remove('pulse-active');
                void sonarWave1.offsetWidth; // trigger reflow
                sonarWave1.classList.add('pulse-active');
                setTimeout(() => {
                    if (sonarWave2) sonarWave2.classList.add('pulse-active');
                }, 180);
            }
        }

        function selectRangeSector(rangeVal, btnElement) {
            selectedRange = parseInt(rangeVal, 10);

            // Update Button Active States (Neutral active blue/cyan highlight, NO premature green spoiler)
            sectorBtns.forEach(btn => btn.classList.remove('active', 'target-locked'));
            if (btnElement) btnElement.classList.add('active');

            // Trigger Sonar Pulse Wave Animation in Center Viewport
            triggerSonarPulse();
            playSfx('select');

            // Dynamic Collimator Laser Ray Fill based on range (0-90 km)
            const pct = Math.min(100, Math.max(0, (selectedRange / 90) * 100));
            if (collimatorRay) collimatorRay.style.height = `${pct}%`;

            // Neutral Scanning Display (Result is revealed ONLY upon clicking ENGAGE WARP INTERCEPT)
            if (sonarStatusChip) {
                sonarStatusChip.classList.remove('chip-locked');
                sonarStatusChip.textContent = `TARGET: ${selectedRange} KM`;
            }
            if (scopeScreen) {
                scopeScreen.className = 'scope-screen scope-scanning';
            }
            if (scopeFreqTag) {
                scopeFreqTag.textContent = `BAND: ${selectedRange} KM ACTIVE`;
            }
            if (scopeLockText) {
                scopeLockText.textContent = `TARGET RANGE ${selectedRange} KM SET // AWAITING ENGAGE`;
            }
            if (targetLocator) targetLocator.classList.remove('locator-target-matched');
        }

        sectorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (cardProbe && cardProbe.classList.contains('aligned')) return;
                const range = btn.getAttribute('data-range');
                selectRangeSector(range, btn);
            });
        });

        // Interactive 3D Parallax Tilt for Recon Probe
        if (cardProbe) {
            cardProbe.addEventListener('pointermove', (e) => {
                const rect = cardProbe.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                cardProbe.style.setProperty('--core-tilt-x', `${(-y * 6).toFixed(2)}deg`);
                cardProbe.style.setProperty('--core-tilt-y', `${(x * 6).toFixed(2)}deg`);
            });

            cardProbe.addEventListener('pointerleave', () => {
                cardProbe.style.setProperty('--core-tilt-x', '0deg');
                cardProbe.style.setProperty('--core-tilt-y', '0deg');
            });
        }

        // ==========================================================================
        // ACTION BUTTON: ENGAGE WARP INTERCEPT & VERIFY 60 KM
        // ==========================================================================
        // Action CTA Button — Validation happens ONLY here upon clicking (Matching Mission 2 standard)
        const actionBtn = createActionButton(m.actionLabel || 'ENGAGE WARP INTERCEPT →', () => {
            if (cardProbe && cardProbe.classList.contains('aligned')) return;

            // Validate dynamically: targetDistance = speed * (minutes / 60) = 60 km
            if (selectedRange === targetDistance) {
                // ==================================================================
                // CORRECT ANSWER (60 KM): MATCHING MISSION 2 SUCCESS STANDARD
                // ==================================================================
                playSfx('select');

                const activeBtn = mainScreen.querySelector('.sonar-sector-btn.active');
                if (activeBtn) activeBtn.classList.add('target-locked');
                if (sonarStatusChip) {
                    sonarStatusChip.textContent = 'INTERCEPT LOCKED // 60 KM';
                    sonarStatusChip.classList.add('chip-locked');
                }
                if (scopeScreen) {
                    scopeScreen.className = 'scope-screen scope-locked-harmonic';
                }
                if (scopeFreqTag) {
                    scopeFreqTag.textContent = 'RESONANCE: HARMONIZED';
                }
                if (scopeLockText) {
                    scopeLockText.textContent = '✦ BEACON-08 INTERCEPTED // 60 KM LOCKED';
                }
                if (targetLocator) targetLocator.classList.add('locator-target-matched');

                // Stage 1: Mag Gantry Disengages & Targeting Laser Locks (0ms)
                if (magGantry) magGantry.classList.add('gantry-disengaged');

                // Stage 2: Plasma Thruster Supercharge Ignition (300ms)
                setTimeout(() => {
                    playSfx('powerup');
                    if (flameL) flameL.classList.add('plasma-supercharge');
                    if (flameR) flameR.classList.add('plasma-supercharge');
                    if (probeShip) probeShip.classList.add('probe-warp-launch');

                    // Stage 3: Beacon Intercept & Supernova Waypoint Capture (750ms)
                    setTimeout(() => {
                        playSfx('chirp');
                        if (targetLocator) targetLocator.classList.add('locator-captured-flare');

                        // Stage 4: Activated State on Card 2 & Scene (Matching Mission 2 Standard)
                        setTimeout(() => {
                            if (cardProbe) {
                                cardProbe.classList.remove('reject-shake');
                                cardProbe.classList.add('aligned', 'probe-online-pulse');
                            }
                            scene.classList.add('lens-activated', 'probe-activated');

                            playSceneSuccessSequence(
                                scene,
                                8,
                                `${selectedRange} KM`,
                                null,
                                `<span class="dialogue-speaker">ECHO:</span> ✦ Trajectory locked at ${targetDistance} km! Recon Drone intercepted Orbital Beacon in 40 min at 90 km/h.`
                            );
                        }, 400);
                    }, 450);
                }, 300);

            } else {
                // ==================================================================
                // WRONG ANSWER: MATCHING MISSION 2 REJECT RED SHAKE STANDARD
                // ==================================================================
                if (cardProbe) {
                    cardProbe.classList.remove('reject-shake');
                    void cardProbe.offsetWidth; // trigger reflow
                    cardProbe.classList.add('reject-shake');
                    setTimeout(() => cardProbe.classList.remove('reject-shake'), 750);
                }

                const probeViewport = document.getElementById('m8ProbeViewport');
                if (probeViewport) {
                    probeViewport.classList.add('probe-warning-shudder');
                    setTimeout(() => probeViewport.classList.remove('probe-warning-shudder'), 750);
                }

                if (scopeScreen) {
                    scopeScreen.className = 'scope-screen scope-error-alert';
                    if (scopeLockText) scopeLockText.textContent = `⚠ TRAJECTORY REJECTED // ${selectedRange || '0'} KM MISALIGNED`;
                }

                const dlg = scene.querySelector('.scene-dialogue-overlay .dialogue-text');
                if (dlg) {
                    dlg.innerHTML = `<span class="dialogue-speaker">ECHO:</span> Trajectory ${selectedRange || '0'} km rejected — Speed = ${speed} km/h, Time = ${minutes} min (${minutes}/60 = 2/3 hr). Distance = ${speed} × (2/3) = ${targetDistance} km.`;
                }

                handleError(m);
            }
        });

        mainScreen.querySelector('#m8ActionSlot').appendChild(actionBtn);
        content.appendChild(mainScreen);

        scene.appendChild(content);
        dom.gameplayStage.appendChild(scene);
    }

    // ==========================================================================
    // MISSION 9: HEAVY TITANIUM CYBER-VAULT DOOR — "Probability & Sample Space"
    // Layout: Interactive 2D Cinematic Mission Screen
    //   - LEFT: 3 Crystal Chambers (Blue, Red, Gold) with Vector Gems & Total Bar
    //   - CENTER: Massive Heavy Titanium Cyber-Vault Gate with Hydraulic Locks
    //   - RIGHT: Probability Formula Box, Slider & CALIBRATE RESONANCE Button
    // ==========================================================================
    function renderCubePedestalScene(m) {
        // Dynamic Sample Space & Crystal Counts
        const blueCount = (m.data && m.data.blueCount) || 8;
        const redCount = (m.data && m.data.redCount) || 5;
        const goldCount = (m.data && m.data.goldCount) || 7;
        const totalCount = (m.data && m.data.totalCount) || (blueCount + redCount + goldCount);
        
        // Dynamic Target Probability: (goldCount / totalCount) * 100
        const expectedProbability = Math.round((goldCount / totalCount) * 100); // 35%
        let currentSliderVal = 0;

        const scene = createSceneShell(9, 'SYSTEM: QUANTUM VAULT // PROBABILITY CORE', 'QUANTUM PROBABILITY HARMONIZED', 'PROBABILITY COLLAPSED — RE-CALCULATE');
        const content = document.createElement('div');
        content.className = 'scene-content';

        const statusBar = createSceneStatusBar('SYSTEM: QUANTUM VAULT');
        content.appendChild(statusBar);

        // Main 3-column grid matching Mission 1 standard (No outer enclosing card box)
        const mainScreen = document.createElement('div');
        mainScreen.className = 'scene-main-grid m9-vault-grid';
        mainScreen.id = 'm9MainScreen';

        mainScreen.innerHTML = `
            <!-- ==================================================================
                 CARD 1 (LEFT): CRYSTAL RESERVOIR PODS (ZERO EMOJIS - PURE VECTOR GEMS)
                 ================================================================== -->
            <div class="scene-object crystal-rack-panel m9-card-reservoirs" id="m9CardReservoirs">
                <div class="rack-header-bar">
                    <span class="scene-object-label">◆ CRYSTAL RESERVOIRS</span>
                    <span class="rack-status-chip">SAMPLE PODS</span>
                </div>

                <div class="m9-chambers-stack">
                    <!-- BLUE CHAMBER -->
                    <div class="m9-crystal-chamber chamber-blue" id="chamberBlue" data-color="blue" tabindex="0" role="button" aria-label="Inspect Blue Crystal Chamber">
                        <div class="chamber-glass-cylinder">
                            <div class="chamber-energy-level level-blue" style="height: ${Math.round((blueCount / totalCount) * 100)}%;"></div>
                            <div class="chamber-gems-cluster">
                                <span class="vector-gem gem-blue g1"></span>
                                <span class="vector-gem gem-blue g2"></span>
                                <span class="vector-gem gem-blue g3"></span>
                            </div>
                            <div class="chamber-fluid-glow glow-blue"></div>
                        </div>
                        <div class="chamber-meta-box">
                            <div class="chamber-name blue-txt">BLUE RESONANCE</div>
                            <div class="chamber-count-row">
                                <span class="count-big-num blue-txt">${blueCount}</span>
                                <span class="count-denom-lbl">/ ${totalCount} (${Math.round((blueCount / totalCount) * 100)}%)</span>
                            </div>
                        </div>
                    </div>

                    <!-- RED CHAMBER -->
                    <div class="m9-crystal-chamber chamber-red" id="chamberRed" data-color="red" tabindex="0" role="button" aria-label="Inspect Red Crystal Chamber">
                        <div class="chamber-glass-cylinder">
                            <div class="chamber-energy-level level-red" style="height: ${Math.round((redCount / totalCount) * 100)}%;"></div>
                            <div class="chamber-gems-cluster">
                                <span class="vector-gem gem-red g1"></span>
                                <span class="vector-gem gem-red g2"></span>
                                <span class="vector-gem gem-red g3"></span>
                            </div>
                            <div class="chamber-fluid-glow glow-red"></div>
                        </div>
                        <div class="chamber-meta-box">
                            <div class="chamber-name red-txt">RED RESONANCE</div>
                            <div class="chamber-count-row">
                                <span class="count-big-num red-txt">${redCount}</span>
                                <span class="count-denom-lbl">/ ${totalCount} (${Math.round((redCount / totalCount) * 100)}%)</span>
                            </div>
                        </div>
                    </div>

                    <!-- GOLD CHAMBER (TARGET) -->
                    <div class="m9-crystal-chamber chamber-gold highlight-gold-chamber" id="chamberGold" data-color="gold" tabindex="0" role="button" aria-label="Inspect Gold Target Chamber">
                        <div class="chamber-target-marker">TARGET</div>
                        <div class="chamber-glass-cylinder">
                            <div class="chamber-energy-level level-gold" style="height: ${Math.round((goldCount / totalCount) * 100)}%;"></div>
                            <div class="chamber-gems-cluster">
                                <span class="vector-gem gem-gold g1 gold-sparkle"></span>
                                <span class="vector-gem gem-gold g2 gold-sparkle"></span>
                                <span class="vector-gem gem-gold g3 gold-sparkle"></span>
                            </div>
                            <div class="chamber-fluid-glow glow-gold"></div>
                        </div>
                        <div class="chamber-meta-box">
                            <div class="chamber-name gold-txt">GOLD (TARGET)</div>
                            <div class="chamber-count-row">
                                <span class="count-big-num gold-txt">${goldCount}</span>
                                <span class="count-denom-lbl">/ ${totalCount} (?%)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TOTAL SAMPLE SPACE BAR -->
                <div class="m9-reservoir-total-bar">
                    <span class="total-bar-key">TOTAL SAMPLE SPACE</span>
                    <span class="total-bar-val">${totalCount} CRYSTALS</span>
                </div>
            </div>

            <!-- ==================================================================
                 CARD 2 (CENTER): HEAVY TITANIUM CYBER-VAULT DOOR
                 ================================================================== -->
            <div class="scene-object pattern-lens-container m9-card-vault" id="m9CardCore">
                <div class="rack-header-bar">
                    <span class="scene-object-label">◆ QUANTUM VAULT</span>
                    <span class="rack-status-chip" id="m9CoreLockChip">VAULT: LOCKED</span>
                </div>

                <div class="m9-vault-hero-stage" id="m9VaultHeroStage">
                    <!-- High-Voltage Plasma Conduits from Left Reservoirs -->
                    <div class="vault-conduit-lines">
                        <div class="conduit-line line-blue" id="conduitBlue">
                            <span class="conduit-coupler"></span>
                            <span class="conduit-pulse-node"></span>
                        </div>
                        <div class="conduit-line line-red" id="conduitRed">
                            <span class="conduit-coupler"></span>
                            <span class="conduit-pulse-node"></span>
                        </div>
                        <div class="conduit-line line-gold" id="conduitGold">
                            <span class="conduit-coupler"></span>
                            <span class="conduit-pulse-node"></span>
                        </div>
                    </div>

                    <!-- Heavy Outer Circular Titanium Vault Chassis -->
                    <div class="titanium-vault-chassis" id="m9VaultChassis">
                        <!-- Bolted Metallic Bezel with Precision Chamfers & Rivets -->
                        <div class="vault-outer-bezel">
                            <span class="bezel-rivet r-1"></span>
                            <span class="bezel-rivet r-2"></span>
                            <span class="bezel-rivet r-3"></span>
                            <span class="bezel-rivet r-4"></span>
                            <span class="bezel-rivet r-5"></span>
                            <span class="bezel-rivet r-6"></span>
                            <span class="bezel-rivet r-7"></span>
                            <span class="bezel-rivet r-8"></span>
                            <div class="bezel-warning-stripes top-stripe"></div>
                            <div class="bezel-warning-stripes bot-stripe"></div>
                            <div class="bezel-pressure-gauge gauge-left"></div>
                            <div class="bezel-pressure-gauge gauge-right"></div>
                        </div>

                        <!-- 3 Heavy Pneumatic Hydraulic Piston Clamps -->
                        <div class="hydraulic-pistons-assembly">
                            <div class="hydraulic-piston piston-top" id="pistonTop">
                                <div class="piston-base-block"></div>
                                <div class="piston-sleeve">
                                    <span class="piston-led-indicator blue-led"></span>
                                </div>
                                <div class="piston-shaft"></div>
                                <div class="piston-jaw blue-jaw">
                                    <span class="jaw-tooth"></span>
                                </div>
                            </div>
                            <div class="hydraulic-piston piston-right" id="pistonRight">
                                <div class="piston-base-block"></div>
                                <div class="piston-sleeve">
                                    <span class="piston-led-indicator red-led"></span>
                                </div>
                                <div class="piston-shaft"></div>
                                <div class="piston-jaw red-jaw">
                                    <span class="jaw-tooth"></span>
                                </div>
                            </div>
                            <div class="hydraulic-piston piston-bot" id="pistonBot">
                                <div class="piston-base-block"></div>
                                <div class="piston-sleeve">
                                    <span class="piston-led-indicator gold-led"></span>
                                </div>
                                <div class="piston-shaft"></div>
                                <div class="piston-jaw gold-jaw">
                                    <span class="jaw-tooth"></span>
                                </div>
                            </div>
                        </div>

                        <!-- Inner Chamber: Ultra-Realistic Arc Reactor & Singularity Core Globe -->
                        <div class="vault-interior-chamber" id="vaultInterior">
                            <!-- Brushed Gunmetal Machined Well & Directional Illumination -->
                            <div class="reactor-chamber-well">
                                <div class="well-machined-grooves"></div>
                                <div class="reactor-magnetic-ring"></div>
                                <div class="reactor-inner-rotor">
                                    <span class="rotor-notch n1"></span>
                                    <span class="rotor-notch n2"></span>
                                    <span class="rotor-notch n3"></span>
                                    <span class="rotor-notch n4"></span>
                                    <span class="rotor-notch n5"></span>
                                    <span class="rotor-notch n6"></span>
                                </div>
                                <div class="chamber-spotlight spot-top-left"></div>
                                <div class="chamber-spotlight spot-bot-right"></div>
                                <span class="chassis-bolt b-tl"></span>
                                <span class="chassis-bolt b-tr"></span>
                                <span class="chassis-bolt b-bl"></span>
                                <span class="chassis-bolt b-br"></span>
                            </div>

                            <!-- Segmented Heavy Copper Electromagnetic Stator Coils (8 Precision Windings) -->
                            <div class="reactor-stator-assembly" id="reactorStatorAssembly">
                                <div class="copper-coil coil-1"><span class="coil-windings"></span><span class="coil-lug"></span></div>
                                <div class="copper-coil coil-2"><span class="coil-windings"></span><span class="coil-lug"></span></div>
                                <div class="copper-coil coil-3"><span class="coil-windings"></span><span class="coil-lug"></span></div>
                                <div class="copper-coil coil-4"><span class="coil-windings"></span><span class="coil-lug"></span></div>
                                <div class="copper-coil coil-5"><span class="coil-windings"></span><span class="coil-lug"></span></div>
                                <div class="copper-coil coil-6"><span class="coil-windings"></span><span class="coil-lug"></span></div>
                                <div class="copper-coil coil-7"><span class="coil-windings"></span><span class="coil-lug"></span></div>
                                <div class="copper-coil coil-8"><span class="coil-windings"></span><span class="coil-lug"></span></div>
                            </div>

                            <!-- 3 Glass Isotope Fuel Rod Cartridges with Glowing Liquid & Bubbles -->
                            <div class="reactor-fuel-cartridges">
                                <div class="fuel-cartridge rod-1"><div class="fuel-glass-capsule"><div class="fuel-isotope-fluid"><span class="fluid-bubble b1"></span><span class="fluid-bubble b2"></span></div><div class="fuel-level-ticks"></div></div></div>
                                <div class="fuel-cartridge rod-2"><div class="fuel-glass-capsule"><div class="fuel-isotope-fluid"><span class="fluid-bubble b1"></span><span class="fluid-bubble b2"></span></div><div class="fuel-level-ticks"></div></div></div>
                                <div class="fuel-cartridge rod-3"><div class="fuel-glass-capsule"><div class="fuel-isotope-fluid"><span class="fluid-bubble b1"></span><span class="fluid-bubble b2"></span></div><div class="fuel-level-ticks"></div></div></div>
                            </div>

                            <!-- Realistic 3D Spherical Glass Containment Globe & Inner Plasma Singularity -->
                            <div class="reactor-containment-globe" id="interiorSingularity">
                                <!-- Outer Curved Glass Specular Highlight Shell & Thickness Bevel -->
                                <div class="globe-glass-shell">
                                    <div class="glass-specular-arc"></div>
                                    <div class="glass-inner-refraction"></div>
                                    <div class="glass-bottom-lens"></div>
                                </div>

                                <!-- Inner Core: Swirling Nuclear Plasma Singularity & Corona Flare -->
                                <div class="reactor-plasma-core">
                                    <div class="plasma-corona-outer"></div>
                                    <div class="plasma-ionization-ring ring-1">
                                        <span class="ion-particle p1"></span>
                                        <span class="ion-particle p2"></span>
                                    </div>
                                    <div class="plasma-ionization-ring ring-2">
                                        <span class="ion-particle p1"></span>
                                        <span class="ion-particle p2"></span>
                                    </div>
                                    <div class="plasma-hotspot-spark"></div>
                                    <!-- High-Energy Micro Plasma Lightning Arcs -->
                                    <div class="plasma-lightning-arcs">
                                        <span class="lightning-arc arc-1"></span>
                                        <span class="lightning-arc arc-2"></span>
                                        <span class="lightning-arc arc-3"></span>
                                        <span class="lightning-arc arc-4"></span>
                                    </div>
                                </div>
                            </div>

                            <!-- Real-time Pressure / Flux Dial Gauge in Corner -->
                            <div class="reactor-flux-gauge" id="reactorFluxGauge">
                                <div class="gauge-dial-face">
                                    <div class="gauge-scale-arc"></div>
                                    <div class="gauge-needle" id="reactorGaugeNeedle"></div>
                                    <div class="gauge-center-rivet"></div>
                                </div>
                                <span class="gauge-label">FLUX // CORE</span>
                            </div>

                            <!-- Real-Time Reactor Telemetry Status Tag -->
                            <div class="singularity-status-tag">✦ SINGULARITY: STABILIZED ✦</div>
                        </div>

                        <!-- Heavy Titanium Blast Doors (Split Sliding Left & Right Wings) -->
                        <div class="vault-blast-doors" id="m9BlastDoors">
                            <!-- Left Door Wing -->
                            <div class="door-wing door-wing-left" id="doorWingLeft">
                                <div class="wing-metal-face">
                                    <div class="wing-carbon-pattern"></div>
                                    <div class="wing-reinforce-rib rib-1"></div>
                                    <div class="wing-reinforce-rib rib-2"></div>
                                    <div class="door-seam-highlight"></div>
                                    <div class="wing-hazard-tag">SEC-V09 // L</div>
                                </div>
                            </div>

                            <!-- Right Door Wing -->
                            <div class="door-wing door-wing-right" id="doorWingRight">
                                <div class="wing-metal-face">
                                    <div class="wing-carbon-pattern"></div>
                                    <div class="wing-reinforce-rib rib-1"></div>
                                    <div class="wing-reinforce-rib rib-2"></div>
                                    <div class="door-seam-highlight"></div>
                                    <div class="wing-hazard-tag">SEC-V09 // R</div>
                                </div>
                            </div>

                            <!-- Central Seam Laser Lock Strip -->
                            <div class="door-central-laser-seam"></div>
                        </div>

                        <!-- Central Gold Master Lock Seal Assembly (Rotates with Dial) -->
                        <div class="vault-master-seal-assembly" id="m9MasterSealAssembly">
                            <!-- Outer Mechanical Gear Ring -->
                            <div class="master-seal-gear-ring" id="m9MasterGearRing">
                                <span class="gear-tooth t-0"></span>
                                <span class="gear-tooth t-45"></span>
                                <span class="gear-tooth t-90"></span>
                                <span class="gear-tooth t-135"></span>
                                <span class="gear-tooth t-180"></span>
                                <span class="gear-tooth t-225"></span>
                                <span class="gear-tooth t-270"></span>
                                <span class="gear-tooth t-315"></span>
                            </div>

                            <!-- Secondary Beveled Inner Ring -->
                            <div class="master-seal-inner-dial">
                                <span class="dial-marker m-0"></span>
                                <span class="dial-marker m-90"></span>
                                <span class="dial-marker m-180"></span>
                                <span class="dial-marker m-270"></span>
                            </div>

                            <!-- Octagonal 24K Quantum Gold Core Hub -->
                            <div class="master-seal-octa-hub" id="m9MasterHub">
                                <div class="hub-specular-flare"></div>
                                <div class="hub-gold-crystal-facet">
                                    <div class="facet-vector-diamond"></div>
                                </div>
                                <div class="hub-laser-reticle"></div>
                            </div>

                            <!-- Locking Bolt Hydraulic Pins -->
                            <div class="hub-bolt-pins" id="m9HubPins">
                                <div class="bolt-pin p-t"></div>
                                <div class="bolt-pin p-r"></div>
                                <div class="bolt-pin p-b"></div>
                                <div class="bolt-pin p-l"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Integrated Calibrated Frequency Readout -->
                <div class="m9-core-calib-banner" id="m9CoreDialBanner">
                    <span class="banner-lbl">VAULT FREQUENCY:</span>
                    <span class="banner-val" id="m9CoreDialVal">0%</span>
                </div>
            </div>

            <!-- ==================================================================
                 CARD 3 (RIGHT): PROBABILITY FORMULA & CALIBRATION CONTROLS
                 ================================================================== -->
            <div class="scene-object control-panel-display premium-terminal m9-card-console" id="m9CardConsole">
                <div class="terminal-header-bar">
                    <span class="scene-object-label">◆ QUANTUM MATRIX</span>
                    <span class="terminal-status-chip">PROBABILITY</span>
                </div>

                <!-- 1. Dynamic Equation Card -->
                <div class="console-formula-card">
                    <div class="formula-tag">PROBABILITY FORMULA:</div>
                    <div class="formula-eq-text">P(GOLD) = ${goldCount} ÷ ${totalCount} = <span class="target-qmark">? %</span></div>
                </div>

                <!-- 2. Frequency Dial Slider & Calibrate CTA -->
                <div class="console-slider-section">
                    <div class="slider-header-row">
                        <span class="slider-title-tag">SET RESONANCE:</span>
                        <div class="slider-display-badge">
                            <span class="badge-num" id="m9SliderDisplayNum">0</span><span class="badge-pct">%</span>
                        </div>
                    </div>

                    <input type="range" min="0" max="100" value="0" step="1" class="cyber-dial-slider" id="m9ResonanceSlider" aria-label="Quantum Resonance Percentage Slider" />

                    <div class="slider-quick-ticks">
                        <button type="button" class="quick-tick-btn" data-val="0">0%</button>
                        <button type="button" class="quick-tick-btn" data-val="25">25%</button>
                        <button type="button" class="quick-tick-btn" data-val="35">35%</button>
                        <button type="button" class="quick-tick-btn" data-val="50">50%</button>
                        <button type="button" class="quick-tick-btn" data-val="75">75%</button>
                        <button type="button" class="quick-tick-btn" data-val="100">100%</button>
                    </div>

                    <div class="console-action-slot" id="m9ActionSlot">
                        <!-- Action CTA inserted below -->
                    </div>
                </div>
            </div>
        `;

        // Interactive Chamber Inspection Listeners
        const chamberBlue = mainScreen.querySelector('#chamberBlue');
        const chamberRed = mainScreen.querySelector('#chamberRed');
        const chamberGold = mainScreen.querySelector('#chamberGold');
        const conduitBlue = mainScreen.querySelector('#conduitBlue');
        const conduitRed = mainScreen.querySelector('#conduitRed');
        const conduitGold = mainScreen.querySelector('#conduitGold');

        function inspectChamber(color) {
            playSfx('select');
            [chamberBlue, chamberRed, chamberGold].forEach(c => c.classList.remove('chamber-active-focus'));
            [conduitBlue, conduitRed, conduitGold].forEach(c => c && c.classList.remove('conduit-active'));

            if (color === 'blue') {
                chamberBlue.classList.add('chamber-active-focus');
                if (conduitBlue) conduitBlue.classList.add('conduit-active');
            } else if (color === 'red') {
                chamberRed.classList.add('chamber-active-focus');
                if (conduitRed) conduitRed.classList.add('conduit-active');
            } else if (color === 'gold') {
                chamberGold.classList.add('chamber-active-focus');
                if (conduitGold) conduitGold.classList.add('conduit-active');
            }
        }

        chamberBlue.addEventListener('click', () => inspectChamber('blue'));
        chamberRed.addEventListener('click', () => inspectChamber('red'));
        chamberGold.addEventListener('click', () => inspectChamber('gold'));

        // Slider Input Real-time Scrubbing & Master Gear Mechanical Feedback
        const sliderInput = mainScreen.querySelector('#m9ResonanceSlider');
        const sliderDisplayNum = mainScreen.querySelector('#m9SliderDisplayNum');
        const coreDialVal = mainScreen.querySelector('#m9CoreDialVal');
        const masterGearRing = mainScreen.querySelector('#m9MasterGearRing');
        const masterHub = mainScreen.querySelector('#m9MasterHub');

        let lastSliderAudioTime = 0;

        sliderInput.addEventListener('input', (e) => {
            currentSliderVal = parseInt(e.target.value, 10);
            
            // 1. Update Numeric Displays
            if (sliderDisplayNum) sliderDisplayNum.textContent = currentSliderVal;
            if (coreDialVal) coreDialVal.textContent = `${currentSliderVal}%`;

            // 2. Physical Gear & Hub Mechanical Rotation
            if (masterGearRing) masterGearRing.style.transform = `rotate(${currentSliderVal * 3.6}deg)`;
            if (masterHub) masterHub.style.transform = `translate(-50%, -50%) rotate(-${currentSliderVal * 1.8}deg)`;

            // 3. Audio Tick
            const now = Date.now();
            if (now - lastSliderAudioTime > 75) {
                playSfx('slider');
                lastSliderAudioTime = now;
            }
        });

        // Clickable quick-jump buttons
        mainScreen.querySelectorAll('.quick-tick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = parseInt(btn.getAttribute('data-val'), 10);
                sliderInput.value = val;
                sliderInput.dispatchEvent(new Event('input'));
            });
        });

        // 3D Parallax Tilt on Vault Card
        const cardCore = mainScreen.querySelector('#m9CardCore');
        if (cardCore) {
            cardCore.addEventListener('pointermove', (e) => {
                const rect = cardCore.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                cardCore.style.setProperty('--core-tilt-x', `${(-y * 6).toFixed(2)}deg`);
                cardCore.style.setProperty('--core-tilt-y', `${(x * 6).toFixed(2)}deg`);
            });

            cardCore.addEventListener('pointerleave', () => {
                cardCore.style.setProperty('--core-tilt-x', '0deg');
                cardCore.style.setProperty('--core-tilt-y', '0deg');
            });
        }

        // ==========================================================================
        // ACTION BUTTON: CALIBRATE RESONANCE & VALIDATE PROBABILITY DYNAMICALLY
        // ==========================================================================
        const actionBtn = createActionButton('CALIBRATE RESONANCE', () => {
            if (mainScreen.classList.contains('energized')) return;

            // Validate dynamically: expectedProbability = (goldCount / totalCount) * 100
            if (currentSliderVal === expectedProbability) {
                // ==================================================================
                // CORRECT ANSWER (35%): HEAVY VAULT OPENING SEQUENCE
                // ==================================================================
                playSfx('select');

                const vaultChassis = document.getElementById('m9VaultChassis');
                const doorWingLeft = document.getElementById('doorWingLeft');
                const doorWingRight = document.getElementById('doorWingRight');
                const masterSealAssembly = document.getElementById('m9MasterSealAssembly');
                const coreLockText = document.getElementById('m9CoreLockChip') || document.getElementById('m9CoreLockText');
                const interiorSingularity = document.getElementById('interiorSingularity');

                // Step 1: Gold Chamber ignites & Gold energy conduit surges (0ms)
                chamberGold.classList.add('chamber-ignited');
                if (conduitGold) conduitGold.classList.add('conduit-surging');

                // Step 2: Hydraulic pistons disengage with steam flash (300ms)
                setTimeout(() => {
                    if (vaultChassis) vaultChassis.classList.add('pistons-released');
                    playSfx('powerup');

                    // Step 3: Master Seal rotates & unlocks, Blast Doors slide open (700ms)
                    setTimeout(() => {
                        if (masterSealAssembly) masterSealAssembly.classList.add('seal-released');
                        if (doorWingLeft) doorWingLeft.classList.add('door-open-left');
                        if (doorWingRight) doorWingRight.classList.add('door-open-right');
                        if (interiorSingularity) interiorSingularity.classList.add('engine-activated');
                        
                        if (coreLockText) {
                            coreLockText.textContent = '✦ VAULT: UNLOCKED';
                            coreLockText.classList.add('lbl-unlocked');
                        }
                        playSfx('chirp');

                        // Step 4: Machine reaches Green-White Stable State & M10 Unlocks (1100ms)
                        setTimeout(() => {
                            mainScreen.classList.remove('reject-shake');
                            mainScreen.classList.add('energized', 'green-white-stable', 'quantum-online-pulse');
                            scene.classList.add('lens-activated', 'reactor-activated');

                            playSceneSuccessSequence(
                                scene, 
                                9, 
                                `${currentSliderVal}%`, 
                                null, 
                                `<span class="dialogue-speaker">NOVA:</span> ✦ ${expectedProbability}% probability verified! Quantum vault unlocked, awakening the Prediction Engine. An unknown guardian signature is detected ahead in the core matrix!`
                            );
                        }, 400);
                    }, 400);
                }, 300);

            } else {
                // ==================================================================
                // WRONG ANSWER: Heavy Hydraulic Shudder & Warning Alert
                // ==================================================================
                mainScreen.classList.remove('reject-shake');
                void mainScreen.offsetWidth; // trigger reflow
                mainScreen.classList.add('reject-shake');
                setTimeout(() => mainScreen.classList.remove('reject-shake'), 750);

                const vaultChassis = document.getElementById('m9VaultChassis');
                if (vaultChassis) {
                    vaultChassis.classList.add('vault-reject-shudder');
                    setTimeout(() => vaultChassis.classList.remove('vault-reject-shudder'), 750);
                }

                // Show only the existing approved wrong dialogue
                const dlg = scene.querySelector('.scene-dialogue-overlay .dialogue-text');
                if (dlg) {
                    dlg.innerHTML = `<span class="dialogue-speaker">NOVA:</span> ${currentSliderVal}% rejected! With ${goldCount} Gold crystals out of ${totalCount} total sample space, P(Gold) = ${goldCount}/${totalCount} = ${expectedProbability}%.`;
                }

                handleError(m);
            }
        });

        mainScreen.querySelector('#m9ActionSlot').appendChild(actionBtn);
        content.appendChild(mainScreen);

        scene.appendChild(content);
        dom.gameplayStage.appendChild(scene);
    }

    // ==========================================================================
    // MISSION 10: BOSS RUSH SCENE — "Guardian Atlas // 3-Hit Elemental Combo Strike"
    // Center Object: 2.5D CORRUPTED GUARDIAN ATLAS TITAN & 3 ORBITING HERO NODES
    // ==========================================================================
    // MISSION 10: 3-PHASE PROGRESSIVE HERO CHAIN BOSS BATTLE (GUARDIAN ATLAS)
    // Phase 1: Blaze Solo Strike (15 GW) -> Shield cracks (100% -> 80%) -> Echo reacts
    // Phase 2: Blaze + Byte Dual Multiply (45 GW) -> Outer armor shatters (80% -> 30%) -> Echo calls Nova
    // Phase 3: Triple Hero Overdrive (60 GW) -> 100% Critical Break (0%) -> Atlas Purified!
    // ==========================================================================
    function renderBossRushScene(m, backendContent = null) {
        const isBackend = !!(backendContent || (gameState.isBackendSession && gameState.activePlayableChallenge && gameState.activePlayableChallenge.format === 'boss_3phase'));
        const bossData = backendContent || (gameState.isBackendSession ? gameState.activePlayableChallenge : null);
        let currentPhase = (bossData && bossData.current_phase) ? bossData.current_phase : 1;
        let currentPower = 0;
        let timeLeft = (m.data && m.data.durationSeconds) || 120;
        let timerId = null;

        function getPhaseData(p) {
            if (bossData && Array.isArray(bossData.phases_playable)) {
                return bossData.phases_playable.find(ph => ph.phase === p) || null;
            }
            return null;
        }

        const scene = createSceneShell(10, 'SYSTEM: PREDICTION ENGINE // CLIMAX', 'GUARDIAN ATLAS PURIFIED & RESTORED', 'OVERLOAD IMMINENT — PURGE NULL ENERGY');
        const content = document.createElement('div');
        content.className = 'scene-content';

        // Standardized Top Status Bar with Integrated Boss Timer Badge
        const statusBar = document.createElement('div');
        statusBar.className = 'scene-status-bar m10-status-bar';
        statusBar.id = 'm10SceneStatusBar';
        statusBar.innerHTML = `
            <div class="m10-status-left">
                <span class="status-dot status-dot-alert"></span>
                <span class="status-label-text" id="m10StatusPhaseText">PHASE 1/3: BLAZE FLAME CALCULATION // CALIBRATE POWER</span>
            </div>
            <div class="m10-status-right">
                <span class="m10-timer-badge" id="bossTimerSec">⏱ ${timeLeft}s</span>
            </div>
        `;
        content.appendChild(statusBar);

        // Main 3-Column Symmetrical Grid
        const mainScreen = document.createElement('div');
        mainScreen.className = 'scene-main-grid m10-boss-grid';
        mainScreen.id = 'm10MainScreen';

        mainScreen.innerHTML = `
            <!-- ==================================================================
                 CARD 1 (LEFT): HERO COMBO & LONG BODMAS EQUATION ENGINE
                 ================================================================== -->
            <div class="scene-object m10-card-combo-stack" id="m10CardComboStack">
                <div class="rack-header-bar m10-card-header">
                    <span class="scene-object-label">◆ HERO COMBO</span>
                </div>

                <div class="m10-hero-nodes-stack">
                    <!-- HERO 1: BLAZE (FLAME IGNITION) -->
                    <div class="m10-hero-node-card hero-blaze active-hero" id="cardHeroBlaze">
                        <div class="node-element-badge blaze-badge">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                                <path d="M12 2C13.5 5 16 7.5 16 10.5C16 13 14.2 15 12 15C9.8 15 8 13 8 10.5C8 7.5 10.5 5 12 2Z" fill="url(#blazeGrad)" filter="drop-shadow(0 0 4px #ef4444)"/>
                                <path d="M12 8C12.8 9.8 14.5 11.3 14.5 13C14.5 14.4 13.4 15.5 12 15.5C10.6 15.5 9.5 14.4 9.5 13C9.5 11.3 11.2 9.8 12 8Z" fill="#fef08a"/>
                                <defs>
                                    <linearGradient id="blazeGrad" x1="8" y1="2" x2="16" y2="15" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#fb923c"/>
                                        <stop offset="1" stop-color="#ef4444"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div class="node-meta-body">
                            <div class="node-hero-tag flame-txt">1. BLAZE // FLAME CORE</div>
                            <div class="node-power-val flame-txt">[(18 × 4) - 22] ÷ 2 <span class="power-type">FLAME EQUATION</span></div>
                        </div>
                        <div class="node-element-spark flame-spark"></div>
                    </div>

                    <!-- HERO 2: BYTE (VOLT MULTIPLIER - STANDBY) -->
                    <div class="m10-hero-node-card hero-byte standby-hero" id="cardHeroByte">
                        <div class="node-element-badge byte-badge">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                                <path d="M13 2L4 13.5H11.5V22L20.5 10.5H13V2Z" fill="url(#byteGrad)" stroke="#38bdf8" stroke-width="1.2" filter="drop-shadow(0 0 5px #0284c7)"/>
                                <defs>
                                    <linearGradient id="byteGrad" x1="4" y1="2" x2="20.5" y2="22" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#38bdf8"/>
                                        <stop offset="1" stop-color="#0284c7"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div class="node-meta-body">
                            <div class="node-hero-tag volt-txt">2. BYTE // STANDBY</div>
                            <div class="node-power-val volt-txt" style="opacity: 0.6;">[ STANDBY — AWAITING ECHO SIGNAL ]</div>
                        </div>
                        <div class="node-element-spark volt-spark"></div>
                    </div>

                    <!-- HERO 3: NOVA (COSMIC OVERDRIVE - STANDBY) -->
                    <div class="m10-hero-node-card hero-nova standby-hero" id="cardHeroNova">
                        <div class="node-element-badge nova-badge">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                                <path d="M12 2L14.2 9.2H21.5L15.6 13.5L17.8 20.8L12 16.5L6.2 20.8L8.4 13.5L2.5 9.2H9.8L12 2Z" fill="url(#novaGrad)" stroke="#fef08a" stroke-width="1" filter="drop-shadow(0 0 5px #eab308)"/>
                                <circle cx="12" cy="12" r="2.5" fill="#ffffff"/>
                                <defs>
                                    <linearGradient id="novaGrad" x1="2.5" y1="2" x2="21.5" y2="20.8" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#fef08a"/>
                                        <stop offset="0.5" stop-color="#eab308"/>
                                        <stop offset="1" stop-color="#a855f7"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div class="node-meta-body">
                            <div class="node-hero-tag cosmic-txt">3. NOVA // STANDBY</div>
                            <div class="node-power-val cosmic-txt" style="opacity: 0.6;">[ STANDBY — AWAITING ECHO SIGNAL ]</div>
                        </div>
                        <div class="node-element-spark cosmic-spark"></div>
                    </div>
                </div>
            </div>

            <!-- ==================================================================
                 CARD 2 (CENTER): BOSS ARENA — 3D SEGMENTED OBSIDIAN TITAN MECH
                 ================================================================== -->
            <div class="scene-object m10-card-boss" id="m10CardBoss">
                <div class="rack-header-bar m10-card-header">
                    <span class="scene-object-label">◆ GUARDIAN ATLAS</span>
                </div>

                <div class="m10-boss-viewport" id="m10BossViewport">
                    <!-- Tactical Arena Backdrop -->
                    <div class="boss-arena-backdrop">
                        <div class="arena-hex-grid"></div>
                        <div class="arena-null-fog"></div>
                        <div class="arena-targeting-crosshair"></div>
                    </div>

                    <!-- NULL SHIELD HEALTH BAR OVERLAY (Top) -->
                    <div class="m10-boss-shield-hud">
                        <div class="shield-hud-label-row">
                            <span class="shield-title">NULL BARRIER INTEGRITY</span>
                            <span class="shield-pct-text" id="m10ShieldPctText">100%</span>
                        </div>
                        <div class="shield-bar-track">
                            <div class="shield-bar-fill" id="m10ShieldBarFill" style="width: 100%;"></div>
                        </div>
                    </div>

                    <!-- 3D SEGMENTED OBSIDIAN TITAN CHASSIS (Center Boss) -->
                    <div class="m10-atlas-titan" id="m10AtlasTitan">
                        <!-- Background Volumetric Dark Energy Field -->
                        <div class="titan-ambient-energy" id="m10TitanAura"></div>

                        <!-- Heavy Gyroscopic Tech Rings (Outer Shield Containment) -->
                        <div class="titan-gantry-ring gantry-outer" id="m10ShieldRing1">
                            <span class="gantry-tick t1"></span>
                            <span class="gantry-tick t2"></span>
                            <span class="gantry-tick t3"></span>
                            <span class="gantry-tick t4"></span>
                        </div>
                        <div class="titan-gantry-ring gantry-mid" id="m10ShieldRing2"></div>
                        <div class="titan-gantry-ring gantry-inner" id="m10ShieldRing3"></div>

                        <!-- Heavy Multi-Segmented Obsidian Armor Shell -->
                        <div class="titan-segmented-armor" id="m10TitanArmor">
                            <!-- Upper Armored Crown & Pauldrons -->
                            <div class="armor-plate plate-crown"></div>
                            <div class="armor-plate plate-pauldron-left"><div class="conduit-line"></div></div>
                            <div class="armor-plate plate-pauldron-right"><div class="conduit-line"></div></div>

                            <!-- Lateral Heavy Shield Wings -->
                            <div class="armor-plate plate-wing-left">
                                <div class="hex-armor-facet"></div>
                                <div class="conduit-glow"></div>
                            </div>
                            <div class="armor-plate plate-wing-right">
                                <div class="hex-armor-facet"></div>
                                <div class="conduit-glow"></div>
                            </div>

                            <!-- Lower Stabilizers & Keel Clamps -->
                            <div class="armor-plate plate-keel-left"></div>
                            <div class="armor-plate plate-keel-right"></div>
                            <div class="armor-plate plate-bottom-exhaust"></div>

                            <!-- Realtime Magma / Fractured Fissures (Hit 1 & Hit 2) -->
                            <div class="titan-magma-cracks" id="m10MagmaCracks">
                                <div class="crack-vein vein-1"></div>
                                <div class="crack-vein vein-2"></div>
                                <div class="crack-vein vein-3"></div>
                                <div class="crack-vein vein-4"></div>
                            </div>
                        </div>

                        <!-- 3 Orbiting Tactical Strike Satellites (Clean Vector Insignias) -->
                        <div class="orbiting-nodes-track" id="m10OrbitTrack">
                            <div class="orbit-node node-flame active-node" id="m10OrbitFlame" title="Blaze Flame Strike Node">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                                    <path d="M12 2C13.5 5 16 7.5 16 10.5C16 13 14.2 15 12 15C9.8 15 8 13 8 10.5C8 7.5 10.5 5 12 2Z" fill="#f87171"/>
                                    <path d="M12 7C12.8 8.8 14 10 14 11.5C14 12.6 13.1 13.5 12 13.5C10.9 13.5 10 12.6 10 11.5C10 10 11.2 8.8 12 7Z" fill="#fef08a"/>
                                </svg>
                            </div>
                            <div class="orbit-node node-volt standby-node" id="m10OrbitVolt" title="Byte Volt Resonance Node">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                                    <path d="M13 2L4 13.5H11.5V22L20.5 10.5H13V2Z" fill="#38bdf8"/>
                                </svg>
                            </div>
                            <div class="orbit-node node-nova standby-node" id="m10OrbitNova" title="Nova Cosmic Overdrive Node">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                                    <path d="M12 2L14.2 9.2H21.5L15.6 13.5L17.8 20.8L12 16.5L6.2 20.8L8.4 13.5L2.5 9.2H9.8L12 2Z" fill="#fbbf24"/>
                                    <circle cx="12" cy="12" r="2.5" fill="#ffffff"/>
                                </svg>
                            </div>
                        </div>

                        <!-- Central Pulsating Dark Matter Singularity Core -->
                        <div class="atlas-center-orb" id="m10AtlasOrb">
                            <div class="titan-singularity-void" id="m10SingularityVoid"></div>
                            <div class="atlas-inner-plasma" id="m10AtlasPlasma"></div>
                            <div class="titan-eye-lens" id="m10TitanEye">
                                <div class="titan-iris-ring"></div>
                                <div class="titan-eye-core"></div>
                            </div>
                            <div class="null-pulse-flare" id="m10AtlasFlare"></div>
                        </div>

                        <!-- 3-Hit Sequential Impact Visual Elements -->
                        <div class="combo-hit-fx hit-1-fire" id="m10Hit1Impact"></div>
                        <div class="combo-hit-fx hit-2-volt" id="m10Hit2Impact"></div>
                        <div class="combo-hit-fx hit-3-nova" id="m10Hit3Impact"></div>
                    </div>

                    <!-- Clean Bottom Shield Status Tag -->
                    <div class="atlas-bottom-status-hud" id="m10ShieldTag">
                        <span class="tag-title" id="m10TargetTitle">TARGET: GUARDIAN ATLAS // NULL ARMOR</span>
                        <span class="tag-meta" id="m10ShieldSubTag">PHASE 1: BLAZE FLAME CALCULATION (25 GW)</span>
                    </div>
                </div>
            </div>

            <!-- ==================================================================
                 CARD 3 (RIGHT): ARCADE COMBO EXECUTOR & STRIKE TERMINAL
                 ================================================================== -->
            <div class="scene-object m10-card-console" id="m10CardConsole">
                <div class="terminal-header-bar m10-card-header">
                    <span class="scene-object-label">◆ STRIKE TERMINAL</span>
                </div>

                <div class="m10-console-body">
                    <!-- Oscilloscope & Live Combo Power Gauge -->
                    <div class="m10-oscilloscope-container">
                        <div class="scope-header">
                            <span class="scope-label" id="m10ScopePhaseHeader">PHASE 1 DISCHARGE</span>
                            <span class="scope-freq-tag" id="m10ScopeFreqTag">TARGET: 25 GW</span>
                        </div>
                        <div class="m10-scope-screen" id="m10ScopeScreen">
                            <div class="scope-grid-overlay"></div>
                            <div class="scope-sweep-laser"></div>
                            <div class="m10-scope-readout-row">
                                <span class="readout-num" id="m10ComboPowerReadout">0</span>
                                <span class="readout-unit">GW</span>
                            </div>
                            <div class="m10-scope-lock-text" id="m10ScopeLockText">ADJUST POWER TO 25 GW</div>
                        </div>
                    </div>

                    <!-- 3-Phase Combo Strike Sequencer (Tactical Badges Without Emojis) -->
                    <div class="m10-combo-phase-tracker">
                        <div class="phase-chip phase-active" id="m10Phase1">1. BLAZE SURGE (ACTIVE)</div>
                        <div class="phase-chip" id="m10Phase2">2. BYTE RESONANCE (LOCKED)</div>
                        <div class="phase-chip" id="m10Phase3">3. NOVA OVERDRIVE (LOCKED)</div>
                    </div>

                    <!-- Tactile Combo Power Tuner & Quick Presets -->
                    <div class="m10-power-tuner-box">
                        <div class="tuner-header">
                            <span class="tuner-title">POWER TUNER (0-150 GW):</span>
                            <span class="tuner-val-badge" id="m10PowerDisplay">0 GW</span>
                        </div>

                        <!-- Tactile Power Slider (0 to 150 GW) -->
                        <div class="slider-input-wrapper">
                            <input type="range" min="0" max="150" value="0" step="1" class="m10-range-slider" id="m10PowerSlider" />
                        </div>

                        <!-- Fast Preset Buttons (Dynamic per phase) -->
                        <div class="m10-quick-presets-grid" id="m10PresetsGrid">
                            <button type="button" class="preset-btn" data-val="15">15 GW</button>
                            <button type="button" class="preset-btn" data-val="20">20 GW</button>
                            <button type="button" class="preset-btn" data-val="25">25 GW</button>
                            <button type="button" class="preset-btn" data-val="30">30 GW</button>
                        </div>
                    </div>

                    <!-- Action CTA Slot -->
                    <div class="m8-action-btn-wrapper" id="m10ActionSlot">
                        <!-- Action CTA Button inserted here -->
                    </div>
                </div>
            </div>
        `;

        // ==========================================================================
        // MULTI-PHASE LONG BODMAS COMBO STRIKE ENGINE
        // ==========================================================================
        const powerSlider = mainScreen.querySelector('#m10PowerSlider');
        const powerDisplay = mainScreen.querySelector('#m10PowerDisplay');
        const comboReadout = mainScreen.querySelector('#m10ComboPowerReadout');
        const scopeLockText = mainScreen.querySelector('#m10ScopeLockText');
        const scopeFreqTag = mainScreen.querySelector('#m10ScopeFreqTag');
        const scopePhaseHeader = mainScreen.querySelector('#m10ScopePhaseHeader');
        const scopeScreen = mainScreen.querySelector('#m10ScopeScreen');
        const calibStatusChip = mainScreen.querySelector('#m10CalibStatusChip');
        const arenaStatusChip = mainScreen.querySelector('#m10ArenaStatusChip');
        const atlasTitan = mainScreen.querySelector('#m10AtlasTitan');
        const shieldBarFill = mainScreen.querySelector('#m10ShieldBarFill');
        const shieldPctText = mainScreen.querySelector('#m10ShieldPctText');
        const phase1Chip = mainScreen.querySelector('#m10Phase1');
        const phase2Chip = mainScreen.querySelector('#m10Phase2');
        const phase3Chip = mainScreen.querySelector('#m10Phase3');
        const statusPhaseText = statusBar.querySelector('#m10StatusPhaseText');
        const heroChainBadge = mainScreen.querySelector('#m10HeroChainBadge');
        const formulaPhaseTitle = mainScreen.querySelector('#m10FormulaPhaseTitle');
        const formulaEquation = mainScreen.querySelector('#m10FormulaEquation');
        const formulaTarget = mainScreen.querySelector('#m10FormulaTarget');
        const bodmasSteps = mainScreen.querySelector('#m10BodmasSteps');
        const shieldSubTag = mainScreen.querySelector('#m10ShieldSubTag');
        const cardHeroBlaze = mainScreen.querySelector('#cardHeroBlaze');
        const cardHeroByte = mainScreen.querySelector('#cardHeroByte');
        const cardHeroNova = mainScreen.querySelector('#cardHeroNova');
        const orbitFlame = mainScreen.querySelector('#m10OrbitFlame');
        const orbitVolt = mainScreen.querySelector('#m10OrbitVolt');
        const orbitNova = mainScreen.querySelector('#m10OrbitNova');
        const presetsGrid = mainScreen.querySelector('#m10PresetsGrid');

        let targetPhasePower = 25; // P1: 25, P2: 70, P3: 104
        let isExecuting = false;

        // Dynamic Action Button Creator
        let currentActionBtn = null;

        function setPhase(p, suppressVoice = false) {
            currentPhase = p;
            currentPower = 0;
            if (powerSlider) powerSlider.value = 0;
            if (powerDisplay) powerDisplay.textContent = '0 GW';
            if (comboReadout) comboReadout.textContent = '0';
            if (calibStatusChip) calibStatusChip.textContent = 'POWER: 0 GW';

            const pData = getPhaseData(p);

            if (p === 1) {
                targetPhasePower = 25;
                if (statusPhaseText) statusPhaseText.textContent = 'PHASE 1/3: BLAZE FLAME CALCULATION // CALIBRATE POWER';
                if (heroChainBadge) heroChainBadge.textContent = 'PHASE 1: BLAZE SOLO';
                if (formulaPhaseTitle) formulaPhaseTitle.textContent = 'PHASE 1 BODMAS CHAIN:';
                const p1Eq = (pData && pData.equation) || '[(18 × 4) - 22] ÷ 2';
                if (formulaEquation) formulaEquation.textContent = p1Eq;
                if (formulaTarget) formulaTarget.textContent = 'CALCULATE';
                if (shieldSubTag) shieldSubTag.textContent = 'PHASE 1: BLAZE FLAME CORE ACTIVE';
                if (scopePhaseHeader) scopePhaseHeader.textContent = 'PHASE 1 DISCHARGE';
                if (scopeFreqTag) scopeFreqTag.textContent = 'TARGET: SOLVE EQUATION';
                if (scopeLockText) scopeLockText.textContent = 'CALIBRATE HARMONIC POWER';
                if (shieldBarFill) shieldBarFill.style.width = '100%';
                if (shieldPctText) shieldPctText.textContent = '100%';

                renderBodmasSteps([
                    { label: 'Step 1 (Multiply)', expr: '18 × 4 = 72' },
                    { label: 'Step 2 (Subtract)', expr: '72 - 22 = 50' },
                    { label: 'Step 3 (Divide)', expr: '50 ÷ 2 = ?' }
                ]);

                // Progressive Revelation: Only Blaze is active
                cardHeroBlaze.className = 'm10-hero-node-card hero-blaze active-hero';
                cardHeroBlaze.querySelector('.node-meta-body').innerHTML = `
                    <div class="node-hero-tag flame-txt">1. BLAZE // FLAME CORE</div>
                    <div class="node-power-val flame-txt">${p1Eq} <span class="power-type">FLAME EQUATION</span></div>
                `;

                cardHeroByte.className = 'm10-hero-node-card hero-byte standby-hero';
                cardHeroByte.querySelector('.node-meta-body').innerHTML = `
                    <div class="node-hero-tag volt-txt">2. BYTE // STANDBY</div>
                    <div class="node-power-val volt-txt" style="opacity: 0.6;">[ STANDBY — AWAITING ECHO SIGNAL ]</div>
                `;

                cardHeroNova.className = 'm10-hero-node-card hero-nova standby-hero';
                cardHeroNova.querySelector('.node-meta-body').innerHTML = `
                    <div class="node-hero-tag cosmic-txt">3. NOVA // STANDBY</div>
                    <div class="node-power-val cosmic-txt" style="opacity: 0.6;">[ STANDBY — AWAITING ECHO SIGNAL ]</div>
                `;

                orbitFlame.className = 'orbit-node node-flame active-node';
                orbitVolt.className = 'orbit-node node-volt active-node';
                orbitNova.className = 'orbit-node node-nova standby-node';

                phase1Chip.className = 'phase-chip phase-active';
                phase1Chip.textContent = '1. BLAZE SURGE (ACTIVE)';
                phase2Chip.className = 'phase-chip';
                phase2Chip.textContent = '2. BYTE RESONANCE (LOCKED)';
                phase3Chip.className = 'phase-chip';
                phase3Chip.textContent = '3. NOVA OVERDRIVE (LOCKED)';

                const p1Presets = (pData && pData.presets && pData.presets.length) ? pData.presets : [15, 20, 25, 30];
                renderPresets(p1Presets);
                updateActionBtn('1. EXECUTE FLAME STRIKE →');
                if (!suppressVoice) {
                    updateDialogue('BLAZE // DIRECTIVE', 'Atlas की Null Shield पर पहला fire strike launch करने के लिए तैयार हूँ! Tactical equation solve करके power calibrate करो!', 'blaze', 'combat_ready', 'TACTICAL COMBO', 7000);
                } else {
                    updateDialogue('BLAZE // DIRECTIVE', 'Atlas की Null Shield पर पहला fire strike launch करने के लिए तैयार हूँ! Tactical equation solve करके power calibrate करो!');
                }

            } else if (p === 2) {
                targetPhasePower = 70;
                if (statusPhaseText) statusPhaseText.textContent = 'PHASE 2/3: DUAL RESONANCE SURGE // CALIBRATE POWER';
                if (heroChainBadge) heroChainBadge.textContent = 'PHASE 2: BLAZE + BYTE';
                if (formulaPhaseTitle) formulaPhaseTitle.textContent = 'PHASE 2 BODMAS CHAIN:';
                const p2Eq = (pData && pData.equation) || '{[(25 × 3) + 45] ÷ 3} + 30';
                if (formulaEquation) formulaEquation.textContent = p2Eq;
                if (formulaTarget) formulaTarget.textContent = 'CALCULATE';
                if (shieldSubTag) shieldSubTag.textContent = 'PHASE 2: DUAL VOLTAGE MULTIPLIER ACTIVE';
                if (scopePhaseHeader) scopePhaseHeader.textContent = 'PHASE 2 DISCHARGE';
                if (scopeFreqTag) scopeFreqTag.textContent = 'TARGET: SOLVE EQUATION';
                if (scopeLockText) scopeLockText.textContent = 'CALIBRATE HARMONIC POWER';
                if (shieldBarFill) shieldBarFill.style.width = '80%';
                if (shieldPctText) shieldPctText.textContent = '80%';
                if (arenaStatusChip) arenaStatusChip.textContent = 'SHIELD: 80%';
                if (atlasTitan) atlasTitan.classList.add('hit-1-active', 'shield-cracked-p1');

                renderBodmasSteps([
                    { label: 'Step 1 (Multiply)', expr: '25 × 3 = 75' },
                    { label: 'Step 2 (Add Volt)', expr: '75 + 45 = 120' },
                    { label: 'Step 3 (Divide)', expr: '120 ÷ 3 = 40' },
                    { label: 'Step 4 (Boost)', expr: '40 + 30 = ?' }
                ]);

                // Progressive Revelation: Blaze + Byte active
                cardHeroBlaze.className = 'm10-hero-node-card hero-blaze active-hero';
                cardHeroBlaze.querySelector('.node-meta-body').innerHTML = `
                    <div class="node-hero-tag flame-txt">1. BLAZE // FLAME CHARGED</div>
                    <div class="node-power-val flame-txt">25 GW <span class="power-type">LOCKED</span></div>
                `;

                cardHeroByte.className = 'm10-hero-node-card hero-byte active-hero';
                cardHeroByte.querySelector('.node-meta-body').innerHTML = `
                    <div class="node-hero-tag volt-txt">2. BYTE // VOLT RESONANCE</div>
                    <div class="node-power-val volt-txt">${p2Eq} <span class="power-type">VOLT HARMONIC</span></div>
                `;

                cardHeroNova.className = 'm10-hero-node-card hero-nova standby-hero';
                cardHeroNova.querySelector('.node-meta-body').innerHTML = `
                    <div class="node-hero-tag cosmic-txt">3. NOVA // STANDBY</div>
                    <div class="node-power-val cosmic-txt" style="opacity: 0.6;">[ STANDBY — AWAITING ECHO SIGNAL ]</div>
                `;

                orbitFlame.className = 'orbit-node node-flame active-node';
                orbitVolt.className = 'orbit-node node-volt active-node';
                orbitNova.className = 'orbit-node node-nova standby-node';

                phase1Chip.className = 'phase-chip phase-locked';
                phase1Chip.textContent = '1. BLAZE SURGE (LOCKED)';
                phase2Chip.className = 'phase-chip phase-active';
                phase2Chip.textContent = '2. BYTE RESONANCE (ACTIVE)';
                phase3Chip.className = 'phase-chip';
                phase3Chip.textContent = '3. NOVA OVERDRIVE (LOCKED)';

                const p2Presets = (pData && pData.presets && pData.presets.length) ? pData.presets : [50, 60, 70, 85];
                renderPresets(p2Presets);
                updateActionBtn('2. FIRE DUAL RESONANCE →');
                if (!suppressVoice) {
                    updateDialogue('BYTE // DIRECTIVE', 'Circuit resonance सक्रिय हो गया है! Voltage multiplier calculate करके power lock करो!', 'byte', 'analyzing', 'VOLT RESONANCE', 7000);
                } else {
                    updateDialogue('BYTE // DIRECTIVE', 'Circuit resonance सक्रिय हो गया है! Voltage multiplier calculate करके power lock करो!');
                }

            } else if (p === 3) {
                targetPhasePower = 104;
                if (statusPhaseText) statusPhaseText.textContent = 'PHASE 3/3: GRAND BODMAS OVERDRIVE // FINAL STRIKE';
                if (heroChainBadge) heroChainBadge.textContent = 'PHASE 3: TRIPLE CHAIN';
                if (formulaPhaseTitle) formulaPhaseTitle.textContent = 'GRAND CLIMAX BODMAS CHAIN:';
                const p3Eq = (pData && pData.equation) || '{[(70 × 2) - 40] ÷ 5} × 4 + 24';
                if (formulaEquation) formulaEquation.textContent = p3Eq;
                if (formulaTarget) formulaTarget.textContent = 'CALCULATE';
                if (shieldSubTag) shieldSubTag.textContent = 'PHASE 3: TRIPLE HERO SUPERNOVA OVERDRIVE';
                if (scopePhaseHeader) scopePhaseHeader.textContent = 'OVERDRIVE DISCHARGE';
                if (scopeFreqTag) scopeFreqTag.textContent = 'TARGET: SOLVE FINAL EQUATION';
                if (scopeLockText) scopeLockText.textContent = 'CALIBRATE OVERDRIVE POWER';
                if (shieldBarFill) shieldBarFill.style.width = '30%';
                if (shieldPctText) shieldPctText.textContent = '30%';
                if (arenaStatusChip) arenaStatusChip.textContent = 'SHIELD: 30%';
                if (atlasTitan) {
                    atlasTitan.classList.remove('hit-1-active');
                    atlasTitan.classList.add('hit-2-active', 'shield-shattered-p2');
                }

                renderBodmasSteps([
                    { label: 'Step 1 (Double)', expr: '70 × 2 = 140' },
                    { label: 'Step 2 (Null Damp)', expr: '140 - 40 = 100' },
                    { label: 'Step 3 (Harmonic ÷)', expr: '100 ÷ 5 = 20' },
                    { label: 'Step 4 (Cosmic ×)', expr: '20 × 4 = 80' },
                    { label: 'Step 5 (Surge +)', expr: '80 + 24 = ?' }
                ]);

                // Progressive Revelation: All 3 active together
                cardHeroBlaze.className = 'm10-hero-node-card hero-blaze active-hero';
                cardHeroBlaze.querySelector('.node-meta-body').innerHTML = `
                    <div class="node-hero-tag flame-txt">1. BLAZE // FLAME OVERDRIVE</div>
                    <div class="node-power-val flame-txt">25 GW <span class="power-type">LINKED</span></div>
                `;

                cardHeroByte.className = 'm10-hero-node-card hero-byte active-hero';
                cardHeroByte.querySelector('.node-meta-body').innerHTML = `
                    <div class="node-hero-tag volt-txt">2. BYTE // VOLT OVERDRIVE</div>
                    <div class="node-power-val volt-txt">70 GW <span class="power-type">LINKED</span></div>
                `;

                cardHeroNova.className = 'm10-hero-node-card hero-nova active-hero';
                cardHeroNova.querySelector('.node-meta-body').innerHTML = `
                    <div class="node-hero-tag cosmic-txt">3. NOVA // GRAND SUPERNOVA</div>
                    <div class="node-power-val cosmic-txt">${p3Eq} <span class="power-type">SUPERNOVA</span></div>
                `;

                orbitFlame.className = 'orbit-node node-flame active-node';
                orbitVolt.className = 'orbit-node node-volt active-node';
                orbitNova.className = 'orbit-node node-nova active-node';

                phase1Chip.className = 'phase-chip phase-locked';
                phase1Chip.textContent = '1. BLAZE SURGE (LOCKED)';
                phase2Chip.className = 'phase-chip phase-locked';
                phase2Chip.textContent = '2. BYTE RESONANCE (LOCKED)';
                phase3Chip.className = 'phase-chip phase-active';
                phase3Chip.textContent = '3. NOVA OVERDRIVE (ACTIVE)';

                const p3Presets = (pData && pData.presets && pData.presets.length) ? pData.presets : [84, 96, 104, 120];
                renderPresets(p3Presets);
                updateActionBtn('3. EXECUTE GRAND OVERDRIVE →');
                if (!suppressVoice) {
                    updateDialogue('NOVA // DIRECTIVE', 'सभी Guardians, Grand Supernova Overdrive तैयार करो! Final calculation solve करके एक साथ वार करो!', 'nova', 'inspiring', 'GRAND OVERDRIVE', 7000);
                } else {
                    updateDialogue('NOVA // DIRECTIVE', 'सभी Guardians, Grand Supernova Overdrive तैयार करो! Final calculation solve करके एक साथ वार करो!');
                }
            }
        }

        function renderBodmasSteps(steps) {
            if (!bodmasSteps) return;
            bodmasSteps.innerHTML = '';
            steps.forEach(st => {
                const row = document.createElement('div');
                row.className = 'bodmas-step-row';
                row.innerHTML = `
                    <span class="bodmas-step-lbl">${st.label}:</span>
                    <span class="bodmas-step-expr">${st.expr}</span>
                `;
                bodmasSteps.appendChild(row);
            });
        }

        function renderPresets(vals) {
            if (!presetsGrid) return;
            presetsGrid.innerHTML = '';
            vals.forEach(v => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'preset-btn';
                btn.setAttribute('data-val', v);
                btn.textContent = `${v} GW`;
                btn.addEventListener('click', () => updateComboPower(v, true));
                presetsGrid.appendChild(btn);
            });
        }

        function updateActionBtn(label) {
            const slot = mainScreen.querySelector('#m10ActionSlot');
            if (!slot) return;
            slot.innerHTML = '';
            currentActionBtn = createActionButton(label, handleExecuteStrike);
            slot.appendChild(currentActionBtn);
        }

        function updateComboPower(val, playSound = true) {
            if (isExecuting) return;
            currentPower = Math.min(150, Math.max(0, parseInt(val, 10) || 0));
            if (powerSlider) powerSlider.value = currentPower;
            if (powerDisplay) powerDisplay.textContent = `${currentPower} GW`;
            if (comboReadout) comboReadout.textContent = currentPower;

            // Highlight Preset Buttons
            mainScreen.querySelectorAll('.preset-btn').forEach(btn => {
                const btnVal = parseInt(btn.getAttribute('data-val'), 10);
                btn.classList.toggle('active', btnVal === currentPower);
            });

            if (playSound) playSfx('click');

            if (isBackend) {
                // In authenticated mode: UI reflects user selection without revealing target ahead of server evaluation
                if (currentPower > 0) {
                    if (scopeLockText) scopeLockText.textContent = `✦ ${currentPower} GW CALIBRATED // READY TO STRIKE!`;
                    if (scopeFreqTag) scopeFreqTag.textContent = `POWER: ${currentPower} GW`;
                    if (calibStatusChip) {
                        calibStatusChip.textContent = `POWER: ${currentPower} GW`;
                        calibStatusChip.classList.add('chip-locked');
                    }
                    if (scopeScreen) scopeScreen.className = 'm10-scope-screen scope-locked-harmonic';
                    if (atlasTitan) atlasTitan.classList.add('targeted-by-combo');
                } else {
                    if (scopeFreqTag) scopeFreqTag.textContent = `TARGET: CALIBRATE POWER`;
                    if (calibStatusChip) {
                        calibStatusChip.textContent = `POWER: 0 GW`;
                        calibStatusChip.classList.remove('chip-locked');
                    }
                    if (scopeScreen) scopeScreen.className = 'm10-scope-screen';
                    if (atlasTitan) atlasTitan.classList.remove('targeted-by-combo');
                    if (scopeLockText) scopeLockText.textContent = `ADJUST POWER SLIDER OR SELECT PRESET`;
                }
            } else {
                if (currentPower === targetPhasePower) {
                    // Exact Power Synchronized for Current Phase (Guest mode only)
                    if (scopeLockText) scopeLockText.textContent = `✦ ${currentPower} GW SYNCHRONIZED // READY TO STRIKE!`;
                    if (scopeFreqTag) scopeFreqTag.textContent = 'HARMONIC LOCKED';
                    if (calibStatusChip) {
                        calibStatusChip.textContent = `POWER: ${currentPower} GW`;
                        calibStatusChip.classList.add('chip-locked');
                    }
                    if (scopeScreen) scopeScreen.className = 'm10-scope-screen scope-locked-harmonic';
                    if (atlasTitan) atlasTitan.classList.add('targeted-by-combo');
                } else {
                    if (scopeFreqTag) scopeFreqTag.textContent = `TARGET: CALIBRATE POWER`;
                    if (calibStatusChip) {
                        calibStatusChip.textContent = `POWER: ${currentPower} GW`;
                        calibStatusChip.classList.remove('chip-locked');
                    }
                    if (scopeScreen) scopeScreen.className = 'm10-scope-screen';
                    if (atlasTitan) atlasTitan.classList.remove('targeted-by-combo');

                    if (currentPower < targetPhasePower) {
                        if (scopeLockText) scopeLockText.textContent = `POWER: ${currentPower} GW // INSUFFICIENT FOR PHASE ${currentPhase}`;
                    } else {
                        if (scopeLockText) scopeLockText.textContent = `POWER: ${currentPower} GW // OVERCHARGED — CALIBRATE CORRECT POWER`;
                    }
                }
            }
        }

        if (powerSlider) {
            powerSlider.addEventListener('input', (e) => {
                updateComboPower(e.target.value, false);
            });
        }

        // ==========================================================================
        // EXECUTE STRIKE HANDLER (PROGRESSIVE 3 PHASES)
        // ==========================================================================
        async function handleExecuteStrike() {
            if (isExecuting) return;
            if (atlasTitan && atlasTitan.classList.contains('purified')) return;

            if (isBackend) {
                if (currentPower <= 0) {
                    showFeedback('Please calibrate strike power first using the slider or presets.', 'normal');
                    return;
                }
                if (gameState.isSubmittingAnswer) return;

                isExecuting = true;
                gameState.isSubmittingAnswer = true;
                showFeedback('TRANSMITTING STRIKE TELEMETRY TO ATLAS CORE... [ENGAGING]', 'normal');

                try {
                    const timeTakenMs = Math.max(0, Date.now() - (gameState.missionStartTime || Date.now()));
                    const payload = JSON.stringify({ phase: currentPhase, power: String(currentPower) });
                    const result = await window.cbApi.submitGameplayAnswer(
                        gameState.activeGameplaySessionId,
                        payload,
                        timeTakenMs
                    );

                    if (result && result.is_correct) {
                        playSfx('select');
                        const hit1 = mainScreen.querySelector('#m10Hit1Impact');
                        const hit2 = mainScreen.querySelector('#m10Hit2Impact');
                        const hit3 = mainScreen.querySelector('#m10Hit3Impact');

                        if (result.next_phase === 2) {
                            playSfx('powerup');
                            if (hit1) hit1.classList.add('active');
                            if (atlasTitan) atlasTitan.classList.add('hit-1-active', 'shield-cracked-p1');
                            const newPct = (result.new_shield_pct !== undefined ? result.new_shield_pct : 80) + '%';
                            if (shieldBarFill) shieldBarFill.style.width = newPct;
                            if (shieldPctText) shieldPctText.textContent = newPct;
                            if (arenaStatusChip) arenaStatusChip.textContent = 'SHIELD: ' + newPct;
                            showFeedback('PHASE 1 COMPLETE: Null shield cracked to 80%!', 'success');

                            updateDialogue(
                                'ECHO // TACTICAL COMM',
                                'Null shield बहुत मजबूत है... अकेले attack से सिर्फ थोड़ा ही टूटा है! Byte, Blaze की मदद करो!',
                                'echo',
                                'alert',
                                'DEFENSE ALERT',
                                5000,
                                () => {
                                    setTimeout(() => {
                                        isExecuting = false;
                                        gameState.isSubmittingAnswer = false;
                                        setPhase(2);
                                    }, 700);
                                }
                            );
                        } else if (result.next_phase === 3) {
                            playSfx('warp');
                            if (hit2) hit2.classList.add('active');
                            if (atlasTitan) {
                                atlasTitan.classList.remove('hit-1-active');
                                atlasTitan.classList.add('hit-2-active', 'shield-shattered-p2');
                            }
                            const newPct = (result.new_shield_pct !== undefined ? result.new_shield_pct : 30) + '%';
                            if (shieldBarFill) shieldBarFill.style.width = newPct;
                            if (shieldPctText) shieldPctText.textContent = newPct;
                            if (arenaStatusChip) arenaStatusChip.textContent = 'SHIELD: ' + newPct;
                            showFeedback('PHASE 2 COMPLETE: Outer armor shattered to 30%!', 'success');

                            updateDialogue(
                                'ECHO // TACTICAL COMM',
                                'शानदार! बाहरी armor टूट गया है! Nova, तुम भी अपनी cosmic power जोड़ो और इसे खत्म करो!',
                                'echo',
                                'joy',
                                'ARMOR BREACH',
                                5000,
                                () => {
                                    setTimeout(() => {
                                        isExecuting = false;
                                        gameState.isSubmittingAnswer = false;
                                        setPhase(3);
                                    }, 700);
                                }
                            );
                        } else if (result.mission_completed) {
                            if (timerId) clearInterval(timerId);
                            playSfx('chirp');

                            if (hit3) hit3.classList.add('active');
                            if (atlasTitan) {
                                atlasTitan.classList.remove('hit-1-active', 'hit-2-active');
                                atlasTitan.classList.add('null-shield-explode');
                            }
                            if (shieldBarFill) shieldBarFill.style.width = '0%';
                            if (shieldPctText) shieldPctText.textContent = '0%';
                            if (arenaStatusChip) {
                                arenaStatusChip.textContent = 'NULL ARMOR DESTROYED';
                                arenaStatusChip.className = 'terminal-status-chip chip-locked';
                            }
                            showFeedback('FINAL OVERDRIVE SUCCESSFUL! Guardian Atlas liberated!', 'success');

                            // Authoritative server reward updates
                            if (typeof result.xp_earned === 'number') {
                                gameState.totalXp += result.xp_earned;
                                if (dom.xpDisplay) dom.xpDisplay.textContent = `+${gameState.totalXp} XP`;
                            }

                            // Sync local storage safely
                            try {
                                const raw = localStorage.getItem('cb_ch1_progress');
                                const stored = raw ? JSON.parse(raw) : { completedMissions: [], highestUnlocked: 1, totalXp: 0 };
                                if (!stored.completedMissions.includes(10)) {
                                    stored.completedMissions.push(10);
                                }
                                stored.highestUnlocked = Math.max(stored.highestUnlocked || 1, 10);
                                stored.totalXp = Math.max(stored.totalXp || 0, gameState.totalXp);
                                localStorage.setItem('cb_ch1_progress', JSON.stringify(stored));
                            } catch (e) {}

                            setTimeout(() => {
                                if (atlasTitan) {
                                    atlasTitan.classList.remove('null-shield-explode');
                                    atlasTitan.classList.add('purified', 'atlas-purified-radiant');
                                }
                                const shieldTag = mainScreen.querySelector('#m10ShieldTag');
                                if (shieldTag) {
                                    shieldTag.innerHTML = `
                                        <span class="tag-title" style="color: #fbbf24;">ATLAS // PURIFIED</span>
                                        <span class="tag-meta" style="color: #38bdf8;">GUARDIAN LIBERATED // CHAPTER 1 COMPLETE</span>
                                    `;
                                }
                                scene.classList.add('lens-activated', 'boss-purified');

                                updateDialogue(
                                    'NOVA, BLAZE & ECHO',
                                    '✦ GRAND OVERDRIVE COMPLETE! Null armor पूरी तरह नष्ट हो गई! Guardian Atlas मुक्त हो गया है!',
                                    'nova',
                                    'inspiring',
                                    'VICTORY COMPLETE',
                                    7000
                                );

                                openMissionCutscene(10, 'complete', () => {
                                    const chapterXpEl = dom.chapterCompleteModal && dom.chapterCompleteModal.querySelector('.stat-val.text-purple');
                                    if (chapterXpEl && gameState.totalXp > 0) {
                                        chapterXpEl.textContent = `+${gameState.totalXp.toLocaleString()} XP`;
                                    }
                                    if (dom.chapterCompleteModal) dom.chapterCompleteModal.classList.add('active');
                                });
                            }, 600);
                        }
                    } else {
                        // Incorrect server evaluation
                        isExecuting = false;
                        gameState.isSubmittingAnswer = false;
                        playSfx('error');
                        const cardBoss = mainScreen.querySelector('#m10CardBoss');
                        if (cardBoss) {
                            cardBoss.classList.remove('reject-shake');
                            void cardBoss.offsetWidth;
                            cardBoss.classList.add('reject-shake');
                            setTimeout(() => cardBoss.classList.remove('reject-shake'), 750);
                        }
                        if (scopeScreen) scopeScreen.className = 'm10-scope-screen scope-error-alert';
                        const serverExplanation = (result && result.explanation)
                            ? result.explanation
                            : `${currentPower} GW deflected by Null Shield. Re-calibrate harmonic power!`;
                        if (scopeLockText) scopeLockText.textContent = `⚠ ${serverExplanation}`;
                        showFeedback(`SIGNAL DEFLECTED: ${serverExplanation}`, 'error');
                        updateDialogue('BYTE // DIAGNOSTIC', serverExplanation, 'byte', 'alert', 'DEFENSE ALERT', 6000);
                    }
                } catch (err) {
                    isExecuting = false;
                    gameState.isSubmittingAnswer = false;
                    console.error('[COREBOUND] Error submitting boss strike:', err);
                    const httpStatus = err && err.status;
                    if (httpStatus === 401) {
                        showFeedback('SESSION EXPIRED: Please log in again to continue.', 'error');
                        showGuardianPopup('byte', 'alert', 'Authentication token expired. Please sign in again.', 'SESSION EXPIRED', 'BYTE // SYSTEM', 7000);
                    } else if (httpStatus === 403) {
                        showFeedback('ACCESS DENIED: Mission session is not accessible.', 'error');
                        showGuardianPopup('byte', 'alert', 'Access denied. Please reload.', 'ACCESS DENIED', 'BYTE // SYSTEM', 7000);
                    } else if (httpStatus === 409) {
                        showFeedback('SESSION CONFLICT: Session may already be completed.', 'error');
                        showGuardianPopup('byte', 'alert', 'Session conflict detected. Reload to see status.', 'SESSION CONFLICT', 'BYTE // SYSTEM', 7000);
                    } else if (!httpStatus) {
                        showFeedback('CONNECTION ERROR: Unable to reach Core server.', 'error');
                        showGuardianPopup('byte', 'alert', 'Unable to contact Corebound server. Check connection.', 'CONNECTION ERROR', 'BYTE // SYSTEM', 7000);
                    } else {
                        showFeedback(`SERVER ERROR [${httpStatus}]: ${err.message || 'Unexpected server error'}`, 'error');
                    }
                }
                return;
            }

            // GUEST DEMO MODE (Offline check against targetPhasePower)
            if (currentPower !== targetPhasePower) {
                // Wrong power for current phase
                playSfx('error');
                const cardBoss = mainScreen.querySelector('#m10CardBoss');
                if (cardBoss) {
                    cardBoss.classList.remove('reject-shake');
                    void cardBoss.offsetWidth;
                    cardBoss.classList.add('reject-shake');
                    setTimeout(() => cardBoss.classList.remove('reject-shake'), 750);
                }
                if (scopeScreen) scopeScreen.className = 'm10-scope-screen scope-error-alert';
                if (scopeLockText) scopeLockText.textContent = `⚠ ${currentPower} GW DEFLECTED — CALIBRATE CORRECT HARMONIC POWER`;
                handleError(m);
                return;
            }

            // Correct Power for Phase in Guest mode!
            isExecuting = true;
            playSfx('select');

            const hit1 = mainScreen.querySelector('#m10Hit1Impact');
            const hit2 = mainScreen.querySelector('#m10Hit2Impact');
            const hit3 = mainScreen.querySelector('#m10Hit3Impact');

            if (currentPhase === 1) {
                playSfx('powerup');
                if (hit1) hit1.classList.add('active');
                if (atlasTitan) atlasTitan.classList.add('hit-1-active', 'shield-cracked-p1');
                if (shieldBarFill) shieldBarFill.style.width = '80%';
                if (shieldPctText) shieldPctText.textContent = '80%';
                if (arenaStatusChip) arenaStatusChip.textContent = 'SHIELD: 80%';

                updateDialogue(
                    'ECHO // TACTICAL COMM',
                    'Null shield बहुत मजबूत है... अकेले attack से सिर्फ थोड़ा ही टूटा है! Byte, Blaze की मदद करो!',
                    'echo',
                    'alert',
                    'DEFENSE ALERT',
                    5000,
                    () => {
                        setTimeout(() => {
                            isExecuting = false;
                            setPhase(2);
                        }, 700);
                    }
                );

            } else if (currentPhase === 2) {
                playSfx('warp');
                if (hit2) hit2.classList.add('active');
                if (atlasTitan) {
                    atlasTitan.classList.remove('hit-1-active');
                    atlasTitan.classList.add('hit-2-active', 'shield-shattered-p2');
                }
                if (shieldBarFill) shieldBarFill.style.width = '30%';
                if (shieldPctText) shieldPctText.textContent = '30%';
                if (arenaStatusChip) arenaStatusChip.textContent = 'SHIELD: 30%';

                updateDialogue(
                    'ECHO // TACTICAL COMM',
                    'शानदार! बाहरी armor टूट गया है! Nova, तुम भी अपनी cosmic power जोड़ो और इसे खत्म करो!',
                    'echo',
                    'joy',
                    'ARMOR BREACH',
                    5000,
                    () => {
                        setTimeout(() => {
                            isExecuting = false;
                            setPhase(3);
                        }, 700);
                    }
                );

            } else if (currentPhase === 3) {
                if (timerId) clearInterval(timerId);
                playSfx('chirp');

                if (hit3) hit3.classList.add('active');
                if (atlasTitan) {
                    atlasTitan.classList.remove('hit-1-active', 'hit-2-active');
                    atlasTitan.classList.add('null-shield-explode');
                }
                if (shieldBarFill) shieldBarFill.style.width = '0%';
                if (shieldPctText) shieldPctText.textContent = '0%';
                if (arenaStatusChip) {
                    arenaStatusChip.textContent = 'NULL ARMOR DESTROYED';
                    arenaStatusChip.className = 'terminal-status-chip chip-locked';
                }

                setTimeout(() => {
                    if (atlasTitan) {
                        atlasTitan.classList.remove('null-shield-explode');
                        atlasTitan.classList.add('purified', 'atlas-purified-radiant');
                    }
                    const shieldTag = mainScreen.querySelector('#m10ShieldTag');
                    if (shieldTag) {
                        shieldTag.innerHTML = `
                            <span class="tag-title" style="color: #fbbf24;">ATLAS // PURIFIED</span>
                            <span class="tag-meta" style="color: #38bdf8;">GUARDIAN LIBERATED // CHAPTER 1 COMPLETE</span>
                        `;
                    }
                    scene.classList.add('lens-activated', 'boss-purified');

                    updateDialogue(
                        'NOVA, BLAZE & ECHO',
                        '✦ GRAND OVERDRIVE COMPLETE! Null armor पूरी तरह नष्ट हो गई! Guardian Atlas मुक्त हो गया है!',
                        'nova',
                        'inspiring',
                        'VICTORY COMPLETE',
                        7000
                    );

                    playSceneSuccessSequence(
                        scene,
                        10,
                        '104 GW',
                        null,
                        `<span class="dialogue-speaker">NOVA, BLAZE & ECHO:</span> ✦ GRAND OVERDRIVE COMPLETE! Null armor पूरी तरह नष्ट हो गई! Guardian Atlas मुक्त हो गया है!`
                    );
                }, 600);
            }
        }

        function updateDialogue(speaker, text, gid = null, expr = 'default', mood = 'TACTICAL TRANSMISSION', duration = 5000, onEndCallback = null) {
            const el = scene.querySelector('.scene-dialogue-overlay .dialogue-text') || document.getElementById('sceneDialogue');
            if (el) {
                el.innerHTML = `<span class="dialogue-speaker">${speaker}:</span> ${text}`;
            }
            if (gid) {
                showGuardianPopup(gid, expr, text, mood, speaker, duration, onEndCallback);
            } else if (onEndCallback && typeof onEndCallback === 'function') {
                onEndCallback();
            }
        }

        // Initialize Phase (mount at authoritative currentPhase, suppress popup during intro)
        setPhase(currentPhase, true);

        content.appendChild(mainScreen);
        scene.appendChild(content);

        // ==================================================================
        // MISSION 10 HEAVY CLIMAX ENTRANCE CINEMATIC OVERLAY
        // ==================================================================
        const introOverlay = document.createElement('div');
        introOverlay.className = 'm10-boss-intro-cinematic';
        introOverlay.id = 'm10BossIntroCinematic';
        introOverlay.innerHTML = `
            <div class="intro-alarm-strobe"></div>
            <div class="intro-laser-grid"></div>
            <div class="intro-scan-sweeper"></div>

            <div class="intro-alert-header">
                <div class="intro-hazard-bar"></div>
                <div class="intro-alert-title">
                    <span class="intro-alert-icon">⚠</span>
                    <span class="intro-alert-text">CRITICAL BREACH // OMEGA ANOMALY DETECTED</span>
                    <span class="intro-alert-icon">⚠</span>
                </div>
                <div class="intro-hazard-bar"></div>
            </div>

            <div class="intro-titan-summon-zone">
                <div class="intro-dark-singularity"></div>
                <div class="intro-shockwave-ring ring-1"></div>
                <div class="intro-shockwave-ring ring-2"></div>
                <div class="intro-shockwave-ring ring-3"></div>
                
                <div class="intro-targeting-hud">
                    <div class="hud-bracket hud-tl"></div>
                    <div class="hud-bracket hud-tr"></div>
                    <div class="hud-bracket hud-bl"></div>
                    <div class="hud-bracket hud-br"></div>
                    <div class="hud-scanning-beam"></div>
                    <div class="hud-lock-badge">
                        <span class="hud-lock-dot"></span>
                        <span class="hud-lock-label">TARGET LOCK // ATLAS [NULL SENTINEL]</span>
                    </div>
                </div>

                <div class="intro-ocular-ignition"></div>
            </div>

            <div class="intro-boss-title-card">
                <div class="title-card-preheader">◆ FINAL HARD CLIMAX BATTLE ◆</div>
                <h1 class="title-boss-name">GUARDIAN ATLAS</h1>
                <div class="title-boss-subtitle">[ CORRUPTED NULL OBSIDIAN TITAN MECH ]</div>
                <div class="title-card-meta-row">
                    <span class="threat-level-badge">THREAT LEVEL: ★★★★★ OMEGA CORRUPTION</span>
                    <span class="mission-directive-badge">DIRECTIVE: 3-HERO COMBO STRIKE</span>
                </div>
            </div>

            <div class="intro-action-hint">
                <span class="intro-countdown-pulse">⚡ INITIALIZING BATTLE ENGAGEMENT MATRIX... [CLICK TO SKIP] ⚡</span>
            </div>
        `;
        scene.appendChild(introOverlay);

        dom.gameplayStage.appendChild(scene);

        // Sequence Cinematic Entrance SFX & Transitions
        let introStarted = false;
        let introFinished = false;

        function startBossClimaxBattle() {
            if (introFinished) return;
            introFinished = true;

            // Smooth dissolve of intro overlay
            if (introOverlay) {
                introOverlay.classList.add('intro-dissolve');
                setTimeout(() => {
                    if (introOverlay.parentNode) introOverlay.parentNode.removeChild(introOverlay);
                }, 550);
            }

            // Heavy seismic ground impact shake on the arena
            if (mainScreen) {
                mainScreen.classList.add('boss-impact-quake');
                setTimeout(() => mainScreen.classList.remove('boss-impact-quake'), 850);
            }

            // Trigger Blaze's tactical dialogue & audio voiceover
            updateDialogue(
                'BLAZE // DIRECTIVE',
                'Atlas की Null Shield पर पहला fire strike launch करने के लिए तैयार हूँ! Tactical equation solve करके power calibrate करो!',
                'blaze',
                'combat_ready',
                'TACTICAL COMBO',
                7000
            );

            // Start 120-Second Active Boss Countdown Timer
            if (timerId) clearInterval(timerId);
            timerId = setInterval(() => {
                timeLeft--;
                const secEl = document.getElementById('bossTimerSec');
                if (secEl) secEl.textContent = `⏱ ${timeLeft}s`;

                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    playSfx('error');
                    showFeedback('TIME EXPIRED! Null shield locked Atlas. Resetting clock...', 'error');
                    setTimeout(() => loadMission(9), 1200);
                }
            }, 1000);
            gameState.timerInterval = timerId;
        }

        function playIntroSequence() {
            if (introStarted) return;
            introStarted = true;

            // Staggered SFX Cues for Entrance
            try {
                playSfx('warp');
                setTimeout(() => playSfx('error'), 350);
                setTimeout(() => playSfx('powerup'), 950);
                setTimeout(() => playSfx('select'), 1800);
            } catch (e) {}

            // Auto-complete intro after 3.2s
            setTimeout(() => {
                startBossClimaxBattle();
            }, 3200);
        }

        // Allow skipping intro by clicking anywhere on overlay
        introOverlay.addEventListener('click', () => {
            playSfx('select');
            startBossClimaxBattle();
        });

        window._triggerM10BossEntrance = playIntroSequence;

        // If resuming active session in Phase 2 or 3, skip entrance cinematic
        if (currentPhase > 1) {
            startBossClimaxBattle();
        } else if (!gameState.isCutsceneActive) {
            playIntroSequence();
        }
    }
    function renderPatternComplete(m) {
        const wrap = document.createElement('div');
        wrap.className = 'pattern-sequence-row';

        m.data.sequence.forEach((val) => {
            const node = document.createElement('div');
            node.className = 'seq-node';
            node.textContent = val;
            wrap.appendChild(node);

            const arrow = document.createElement('span');
            arrow.className = 'seq-arrow';
            arrow.textContent = '→';
            wrap.appendChild(arrow);
        });

        const targetSlot = document.createElement('div');
        targetSlot.className = 'seq-node target-slot';
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 5;
        input.placeholder = '?';
        input.id = 'activeInput';
        input.autocomplete = 'off';

        input.addEventListener('keydown', (e) => { 
            if (e.key === 'Enter') checkAnswer(input.value); 
        });

        targetSlot.appendChild(input);
        wrap.appendChild(targetSlot);

        const btn = createActionButton(m.actionLabel, () => checkAnswer(input.value));
        dom.gameplayStage.appendChild(wrap);
        dom.gameplayStage.appendChild(btn);

        setTimeout(() => input.focus(), 100);
    }

    // Format 2: Slider Calibrator
    function renderSlider(m) {
        const container = document.createElement('div');
        container.className = 'slider-container';

        const formula = document.createElement('div');
        formula.className = 'formula-banner';
        formula.textContent = m.data.formula;

        const readout = document.createElement('div');
        readout.className = 'slider-readout';
        readout.id = 'sliderReadout';
        readout.textContent = `${m.data.initial} Hz`;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'cyber-range';
        slider.min = m.data.min;
        slider.max = m.data.max;
        slider.step = m.data.step;
        slider.value = m.data.initial;

        slider.addEventListener('input', () => {
            readout.textContent = `${slider.value} Hz`;
            playSfx('slider');
        });

        const btn = createActionButton(m.actionLabel, () => checkAnswer(slider.value));

        container.appendChild(formula);
        container.appendChild(readout);
        container.appendChild(slider);
        container.appendChild(btn);
        dom.gameplayStage.appendChild(container);
    }

    // Format 3: Match Pairs
    function renderMatchPairs(m) {
        gameState.selectedMatchPair = null;
        gameState.matchedPairsCount = 0;

        const grid = document.createElement('div');
        grid.className = 'match-pairs-grid';

        const leftCol = document.createElement('div');
        leftCol.className = 'pairs-col';
        const rightCol = document.createElement('div');
        rightCol.className = 'pairs-col';

        m.data.leftNodes.forEach(item => {
            const node = document.createElement('div');
            node.className = 'pair-node left-node';
            node.dataset.target = item.targetMatch;
            node.textContent = item.label;
            node.addEventListener('click', () => {
                playSfx('select');
                leftCol.querySelectorAll('.pair-node').forEach(n => n.classList.remove('selected'));
                node.classList.add('selected');
                gameState.selectedMatchPair = node;
            });
            leftCol.appendChild(node);
        });

        m.data.rightNodes.forEach(item => {
            const node = document.createElement('div');
            node.className = 'pair-node right-node';
            node.dataset.id = item.pairId;
            node.textContent = item.label;
            node.addEventListener('click', () => {
                if (!gameState.selectedMatchPair) {
                    showFeedback('Select a primary node on the left first!', 'normal');
                    return;
                }
                playSfx('select');
                if (gameState.selectedMatchPair.dataset.target === item.pairId) {
                    gameState.selectedMatchPair.classList.add('matched');
                    node.classList.add('matched');
                    gameState.selectedMatchPair = null;
                    gameState.matchedPairsCount++;

                    if (gameState.matchedPairsCount === m.data.leftNodes.length) {
                        checkAnswer('MATCH_ALL');
                    } else {
                        showFeedback('Pair Harmonized! Select the next node.', 'normal');
                    }
                } else {
                    handleError(m);
                    showFeedback('Wavelength mismatch! Try another frequency.', 'error');
                }
            });
            rightCol.appendChild(node);
        });

        grid.appendChild(leftCol);
        grid.appendChild(rightCol);
        dom.gameplayStage.appendChild(grid);
    }

    // Format 4: Calculation Machine
    function renderCalcMachine(m) {
        const display = document.createElement('div');
        display.className = 'calc-machine-display';

        const formula = document.createElement('div');
        formula.className = 'formula-banner';
        formula.textContent = `${m.data.formulaDisplay} = ? ${m.data.unit}`;

        const inputWrap = document.createElement('div');
        inputWrap.className = 'crystal-input-wrap';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'crystal-input';
        input.placeholder = `ENTER ${m.data.unit}`;
        input.id = 'activeInput';
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkAnswer(input.value); });
        inputWrap.appendChild(input);

        const btn = createActionButton(m.actionLabel, () => checkAnswer(input.value));

        display.appendChild(formula);
        display.appendChild(inputWrap);
        display.appendChild(btn);
        dom.gameplayStage.appendChild(display);

        setTimeout(() => input.focus(), 100);
    }

    // Format 5: Unlock Cypher Code
    function renderUnlockCode(m) {
        const container = document.createElement('div');
        container.className = 'cypher-lock-container';

        const digits = [0, 0];

        for (let i = 0; i < 2; i++) {
            const col = document.createElement('div');
            col.className = 'cypher-digit-col';

            const upBtn = document.createElement('button');
            upBtn.className = 'cypher-arrow';
            upBtn.innerHTML = '▲';
            upBtn.addEventListener('click', () => {
                digits[i] = (digits[i] + 1) % 10;
                display.textContent = digits[i];
                playSfx('click');
            });

            const display = document.createElement('div');
            display.className = 'cypher-digit-display';
            display.textContent = digits[i];

            const downBtn = document.createElement('button');
            downBtn.className = 'cypher-arrow';
            downBtn.innerHTML = '▼';
            downBtn.addEventListener('click', () => {
                digits[i] = (digits[i] + 9) % 10;
                display.textContent = digits[i];
                playSfx('click');
            });

            col.appendChild(upBtn);
            col.appendChild(display);
            col.appendChild(downBtn);
            container.appendChild(col);
        }

        const btn = createActionButton(m.actionLabel, () => {
            const code = `${digits[0]}${digits[1]}`;
            checkAnswer(code);
        });

        dom.gameplayStage.appendChild(container);
        dom.gameplayStage.appendChild(btn);
    }

    // Format 6: Drag & Drop
    function renderDragDrop(m) {
        gameState.droppedValue = null;

        const container = document.createElement('div');
        container.className = 'drag-drop-container';

        const dropRow = document.createElement('div');
        dropRow.className = 'drop-zones-row';

        const dropSlot = document.createElement('div');
        dropSlot.className = 'drop-target-slot';
        dropSlot.textContent = 'DROP 60% CELL HERE';

        dropSlot.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropSlot.classList.add('hover-active');
        });
        dropSlot.addEventListener('dragleave', () => dropSlot.classList.remove('hover-active'));
        dropSlot.addEventListener('drop', (e) => {
            e.preventDefault();
            dropSlot.classList.remove('hover-active');
            const data = e.dataTransfer.getData('text');
            if (data) {
                dropSlot.textContent = data;
                gameState.droppedValue = data;
                playSfx('click');
            }
        });
        dropRow.appendChild(dropSlot);

        const dragRow = document.createElement('div');
        dragRow.className = 'draggables-row';

        m.data.options.forEach(opt => {
            const item = document.createElement('div');
            item.className = 'drag-item';
            item.draggable = true;
            item.textContent = opt;
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', opt);
                playSfx('select');
            });
            item.addEventListener('click', () => {
                dropSlot.textContent = opt;
                gameState.droppedValue = opt;
                playSfx('select');
            });
            dragRow.appendChild(item);
        });

        const btn = createActionButton(m.actionLabel, () => checkAnswer(gameState.droppedValue));

        container.appendChild(dropRow);
        container.appendChild(dragRow);
        container.appendChild(btn);
        dom.gameplayStage.appendChild(container);
    }

    // Format 7: Target Select
    function renderTargetSelect(m) {
        gameState.selectedTargetId = null;

        const grid = document.createElement('div');
        grid.className = 'target-grid';

        m.data.targets.forEach(t => {
            const tile = document.createElement('div');
            tile.className = 'target-tile';
            tile.dataset.id = t.id;

            tile.innerHTML = `
                <span class="target-title">${t.label}</span>
                <span class="target-val">${t.val}</span>
            `;

            tile.addEventListener('click', () => {
                playSfx('select');
                grid.querySelectorAll('.target-tile').forEach(el => el.classList.remove('active-selected'));
                tile.classList.add('active-selected');
                gameState.selectedTargetId = t.id;
            });

            grid.appendChild(tile);
        });

        const btn = createActionButton(m.actionLabel, () => checkAnswer(gameState.selectedTargetId));

        dom.gameplayStage.appendChild(grid);
        dom.gameplayStage.appendChild(btn);
    }

    // Format 8: Type Answer / Direct Input
    function renderTypeAnswer(m) {
        renderCalcMachine(m);
    }

    // Format 9: Equilibrium Balance Scale
    function renderEquilibrium(m) {
        const stage = document.createElement('div');
        stage.className = 'equilibrium-stage';

        const row = document.createElement('div');
        row.className = 'memory-cubes-row';

        m.data.cubes.forEach((val) => {
            const cube = document.createElement('div');
            cube.className = 'memory-cube';
            cube.innerHTML = `
                <span class="cube-icon">🧊</span>
                <span class="cube-val">${val} TB</span>
            `;
            row.appendChild(cube);
        });

        const inputWrap = document.createElement('div');
        inputWrap.className = 'crystal-input-wrap';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'crystal-input';
        input.placeholder = 'ENTER MEAN TB FLUX';
        input.id = 'activeInput';
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkAnswer(input.value); });
        inputWrap.appendChild(input);

        const btn = createActionButton(m.actionLabel, () => checkAnswer(input.value));

        stage.appendChild(row);
        stage.appendChild(inputWrap);
        stage.appendChild(btn);
        dom.gameplayStage.appendChild(stage);

        setTimeout(() => input.focus(), 100);
    }

    // Format 10: Timed Boss Challenge (Climax)
    function renderTimedBoss(m) {
        const container = document.createElement('div');
        container.className = 'boss-challenge-container';

        let timeLeft = m.data.durationSeconds;

        const alarm = document.createElement('div');
        alarm.className = 'boss-alarm-header';
        alarm.innerHTML = `
            <span class="alarm-tag">⚠ CRITICAL: NULL OVERRIDE ACTIVE</span>
            <span class="countdown-clock" id="bossTimer">${timeLeft}s</span>
        `;

        const formula = document.createElement('div');
        formula.className = 'formula-banner';
        formula.textContent = `${m.data.formula} = ?`;

        const inputWrap = document.createElement('div');
        inputWrap.className = 'crystal-input-wrap';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'crystal-input';
        input.placeholder = 'ENTER OVERRIDE CODE';
        input.id = 'activeInput';
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkAnswer(input.value); });
        inputWrap.appendChild(input);

        const btn = createActionButton(m.actionLabel, () => checkAnswer(input.value));

        container.appendChild(alarm);
        container.appendChild(formula);
        container.appendChild(inputWrap);
        container.appendChild(btn);
        dom.gameplayStage.appendChild(container);

        setTimeout(() => input.focus(), 100);

        // Start Boss Timer
        gameState.timerInterval = setInterval(() => {
            timeLeft--;
            const timerEl = document.getElementById('bossTimer');
            if (timerEl) timerEl.textContent = `${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(gameState.timerInterval);
                playSfx('error');
                showFeedback('TIME EXPIRED! Reactor overloaded. Resetting emergency clock...', 'error');
                setTimeout(() => loadMission(9), 1200);
            }
        }, 1000);
    }

    function createActionButton(label, onClickHandler) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cyber-action-btn btn-primary action-cta-btn';
        btn.innerHTML = `<span class="btn-shine"></span><span class="btn-text">${label}</span>`;
        btn.addEventListener('click', onClickHandler);
        return btn;
    }

    // ==========================================================================
    // 9. ANSWER VALIDATION & WORLD REACTIONS
    // ==========================================================================
    function checkAnswer(rawInput) {
        if (!rawInput && rawInput !== 0) {
            showFeedback('Please enter or select a calibration value first!', 'normal');
            return;
        }

        // Security check: Route to server-side evaluation for authenticated backend session
        if (gameState.isBackendSession && gameState.activeGameplaySessionId) {
            submitBackendAnswer(rawInput);
            return;
        }

        const isAuthenticated = window.cbApi && typeof window.cbApi.isAuthenticated === 'function' && window.cbApi.isAuthenticated();

        // 1. Authenticated user path: MUST use backend
        if (isAuthenticated) {
            if (gameState.isBackendSession && gameState.activeGameplaySessionId) {
                submitBackendAnswer(rawInput);
            } else {
                showFeedback('Cannot evaluate answer: Backend gameplay session is offline.', 'error');
            }
            return;
        }

        // 2. Offline / Guest Demo ONLY (local static check)
        const mission = CHAPTER_MISSIONS[gameState.currentMissionIndex];
        const demoSol = DEMO_MODE_FALLBACK_SOLUTIONS[mission.id];
        const normalized = rawInput.toString().trim().toLowerCase();
        const isCorrect = demoSol && demoSol.acceptedAnswers && demoSol.acceptedAnswers.some(ans => ans.toString().toLowerCase() === normalized);

        if (isCorrect) {
            handleSuccess(mission);
        } else {
            handleError(mission);
        }
    }

    function handleSuccess(mission) {
        const isAuthenticated = window.cbApi && typeof window.cbApi.isAuthenticated === 'function' && window.cbApi.isAuthenticated();
        if (isAuthenticated) {
            console.warn('[COREBOUND] Blocked unauthorized client-side progress award for authenticated user.');
            return;
        }

        if (gameState.timerInterval) clearInterval(gameState.timerInterval);

        playSfx('success');
        updateGuardianAvatarMood('success');
        if (dom.machineChassis) {
            dom.machineChassis.className = 'hud-card square-reactor-card state-success';
        }

        // Update stability gauge to 100% for this mission
        if (dom.stabilityFill) dom.stabilityFill.style.width = '100%';
        if (dom.stabilityPctText) dom.stabilityPctText.textContent = '100%';

        // Add XP
        gameState.totalXp += (mission.xpReward || 200);
        if (dom.xpDisplay) dom.xpDisplay.textContent = `+${gameState.totalXp} XP`;

        // Unlock next mission in memory and persist to localStorage
        const nextIdx = gameState.currentMissionIndex + 1;
        if (!gameState.unlockedMissions.includes(nextIdx) && nextIdx < CHAPTER_MISSIONS.length) {
            gameState.unlockedMissions.push(nextIdx);
        }
        try {
            const raw = localStorage.getItem('cb_ch1_progress');
            const stored = raw ? JSON.parse(raw) : { completedMissions: [], highestUnlocked: 1, totalXp: 0 };
            if (!stored.completedMissions.includes(mission.id)) {
                stored.completedMissions.push(mission.id);
            }
            stored.highestUnlocked = Math.max(stored.highestUnlocked || 1, mission.id + 1);
            stored.totalXp = Math.max(stored.totalXp || 0, gameState.totalXp);
            localStorage.setItem('cb_ch1_progress', JSON.stringify(stored));
        } catch (e) {}

        if (dom.btnNext) dom.btnNext.disabled = false;
        updateStepperUI();

        showFeedback(`CALCULATION STABILIZED! ${mission.explanation || ''}`, 'success');

        gameState.pendingCompleteCutscene = mission.id;
        if (gameState.completeCutsceneTimer) {
            clearTimeout(gameState.completeCutsceneTimer);
            gameState.completeCutsceneTimer = null;
        }

        const proceedToCompleteCutscene = () => {
            if (gameState.pendingCompleteCutscene === mission.id) {
                gameState.pendingCompleteCutscene = null;
                hideGuardianPopup();
                openMissionCutscene(mission.id, 'complete', () => {
                    if (nextIdx >= CHAPTER_MISSIONS.length) {
                        // Final Boss Complete -> Show Grand Chapter 1 Complete Modal
                        if (dom.chapterCompleteModal) dom.chapterCompleteModal.classList.add('active');
                    } else {
                        loadMission(nextIdx, true);
                    }
                });
            }
        };

        // Reactive "Good Job!" Guardian Dialogue with Celebratory Expression
        const directiveData = CHAPTER1_GAMEPLAY_DIRECTIVES[mission.id] || CHAPTER1_GAMEPLAY_DIRECTIVES[1];
        if (directiveData && directiveData.success) {
            const suc = directiveData.success;
            showGuardianPopup(suc.guardianId, suc.expr, suc.text, suc.mood, suc.speaker, null, proceedToCompleteCutscene);
        } else {
            // Fallback timer if no dialogue exists
            gameState.completeCutsceneTimer = setTimeout(proceedToCompleteCutscene, 1800);
        }
    }

    function handleError(mission) {
        playSfx('error');
        updateGuardianAvatarMood('error');
        if (dom.machineChassis) {
            dom.machineChassis.className = 'hud-card square-reactor-card state-error';
        }
        showFeedback(`CALCULATION FAILED: Entered parameter does not restore resonance. Recalculate!`, 'error');

        // Reactive "Try Again!" Guardian Dialogue with Alert Expression & Helpful Guidance
        const directiveData = CHAPTER1_GAMEPLAY_DIRECTIVES[mission.id] || CHAPTER1_GAMEPLAY_DIRECTIVES[1];
        if (directiveData && directiveData.error) {
            const err = directiveData.error;
            showGuardianPopup(err.guardianId, err.expr, err.text, err.mood, err.speaker, 5500);
        }

        setTimeout(() => {
            if (dom.machineChassis) {
                dom.machineChassis.className = 'hud-card square-reactor-card';
            }
            updateGuardianAvatarMood('default');
        }, 800);
    }

    function showFeedback(msg, type) {
        dom.feedbackMessage.textContent = msg;
        dom.feedbackBanner.className = `feedback-banner ${type}`;
    }

    // ==========================================================================
    // 10. GLOBAL EVENT LISTENERS & KEYBOARD SHORTCUTS
    // ==========================================================================
    function setupGlobalEvents() {
        // Cutscene Controls
        if (dom.btnNextCutscene) {
            dom.btnNextCutscene.addEventListener('click', (e) => {
                e.stopPropagation();
                advanceCutscene();
            });
        }
        if (dom.cutsceneDialogueBox) {
            dom.cutsceneDialogueBox.addEventListener('click', (e) => {
                if (e.target.closest('.dialogue-nav-btn') || e.target.closest('button')) return;
                advanceCutscene();
            });
        }
        if (dom.btnSkipCutscene) {
            dom.btnSkipCutscene.addEventListener('click', (e) => {
                e.stopPropagation();
                playSfx('click');
                closeCutscene(true);
            });
        }
        if (dom.btnToggleAutoCutscene) {
            dom.btnToggleAutoCutscene.addEventListener('click', toggleAutoPlay);
        }
        if (dom.btnOpenStoryIntro) {
            dom.btnOpenStoryIntro.addEventListener('click', () => {
                openPrologueCutscene(() => {
                    openMissionCutscene(gameState.currentMissionIndex + 1, 'start', () => {
                        triggerStartDirective(gameState.currentMissionIndex + 1);
                    });
                });
            });
        }

        // Guardian Pop-in Comms & Hint triggers
        if (dom.btnCloseComms) {
            dom.btnCloseComms.addEventListener('click', (e) => {
                e.stopPropagation();
                playSfx('click');
                hideGuardianPopup();
                if (gameState.pendingCompleteCutscene) {
                    if (gameState.completeCutsceneTimer) clearTimeout(gameState.completeCutsceneTimer);
                    gameState.completeCutsceneTimer = null;
                    const mId = gameState.pendingCompleteCutscene;
                    gameState.pendingCompleteCutscene = null;
                    const nextIdx = gameState.currentMissionIndex + 1;
                    openMissionCutscene(mId, 'complete', () => {
                        if (nextIdx >= CHAPTER_MISSIONS.length) {
                            if (dom.chapterCompleteModal) dom.chapterCompleteModal.classList.add('active');
                        } else {
                            loadMission(nextIdx, true);
                        }
                    });
                }
            });
        }
        if (dom.guardianCard) {
            dom.guardianCard.addEventListener('click', (e) => {
                if (e.target.closest('.popup-close-btn')) return;
                playSfx('click');
                hideGuardianPopup();
                if (gameState.pendingCompleteCutscene) {
                    if (gameState.completeCutsceneTimer) clearTimeout(gameState.completeCutsceneTimer);
                    gameState.completeCutsceneTimer = null;
                    const mId = gameState.pendingCompleteCutscene;
                    gameState.pendingCompleteCutscene = null;
                    const nextIdx = gameState.currentMissionIndex + 1;
                    openMissionCutscene(mId, 'complete', () => {
                        if (nextIdx >= CHAPTER_MISSIONS.length) {
                            if (dom.chapterCompleteModal) dom.chapterCompleteModal.classList.add('active');
                        } else {
                            loadMission(nextIdx, true);
                        }
                    });
                }
            });
        }
        if (dom.btnTriggerComms) {
            dom.btnTriggerComms.addEventListener('click', (e) => {
                e.stopPropagation();
                triggerGuardianHint();
            });
        }

        // Global Spacebar Key to advance Cutscene
        window.addEventListener('keydown', (e) => {
            if (gameState.isCutsceneActive) {
                if (e.code === 'Space' || e.key === 'Enter') {
                    e.preventDefault();
                    advanceCutscene();
                } else if (e.key === 'Escape') {
                    closeCutscene(true);
                }
            }
        });

        // Prev / Next Mission Buttons
        dom.btnPrev.addEventListener('click', () => {
            if (gameState.currentMissionIndex > 0) {
                const prevIdx = gameState.currentMissionIndex - 1;
                loadMission(prevIdx, true);
            }
        });

        dom.btnNext.addEventListener('click', () => {
            if (gameState.pendingCompleteCutscene) {
                if (gameState.completeCutsceneTimer) clearTimeout(gameState.completeCutsceneTimer);
                gameState.completeCutsceneTimer = null;
                const mId = gameState.pendingCompleteCutscene;
                gameState.pendingCompleteCutscene = null;
                hideGuardianPopup();
                const nextIdx = gameState.currentMissionIndex + 1;
                openMissionCutscene(mId, 'complete', () => {
                    if (nextIdx >= CHAPTER_MISSIONS.length) {
                        if (dom.chapterCompleteModal) dom.chapterCompleteModal.classList.add('active');
                    } else {
                        loadMission(nextIdx, true);
                    }
                });
                return;
            }

            if (gameState.currentMissionIndex < CHAPTER_MISSIONS.length - 1 && 
                gameState.unlockedMissions.includes(gameState.currentMissionIndex + 1)) {
                const nextIdx = gameState.currentMissionIndex + 1;
                loadMission(nextIdx, true);
            }
        });

        // Modal Begin Mission
        if (dom.btnBeginMission && dom.briefingModal) {
            dom.btnBeginMission.addEventListener('click', () => {
                dom.briefingModal.classList.remove('active');
                setTimeout(() => {
                    dom.briefingModal.style.display = 'none';
                    const activeInput = document.getElementById('activeInput');
                    if (activeInput) activeInput.focus();
                }, 200);
            });
        }

        // Modal Next (Continue to Next Mission)
        if (dom.btnModalNext) {
            dom.btnModalNext.addEventListener('click', () => {
                if (dom.successModal) dom.successModal.classList.remove('active');
                if (gameState.currentMissionIndex < CHAPTER_MISSIONS.length - 1) {
                    const nextIdx = gameState.currentMissionIndex + 1;
                    loadMission(nextIdx, true);
                }
            });
        }

        // Modal Replay
        if (dom.btnModalReplay) {
            dom.btnModalReplay.addEventListener('click', () => {
                if (dom.successModal) dom.successModal.classList.remove('active');
                loadMission(gameState.currentMissionIndex, true);
            });
        }

        // Sound Toggle
        if (dom.soundToggle) {
            dom.soundToggle.addEventListener('click', toggleMute);
        }

        // Global User-Gesture Audio Unlock
        const unlockAllAudio = () => {
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            if (gameState.isCutsceneActive) {
                const slides = gameState.activeCutsceneScript || [];
                const currentSlide = slides[gameState.cutsceneIndex];
                if (currentSlide && cutsceneVoicePlayer && cutsceneVoicePlayer.paused && currentSlide.audioSrc) {
                    cutsceneVoicePlayer.play().catch(() => {});
                }
            }
        };
        window.addEventListener('click', unlockAllAudio, { once: true });
        window.addEventListener('keydown', unlockAllAudio, { once: true });
        window.addEventListener('touchstart', unlockAllAudio, { once: true });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Global developer helper to reset/relock missions easily from console
    window.resetChapter1Progress = function () {
        localStorage.removeItem('cb_ch1_progress');
        localStorage.removeItem('COREBOUND_CHAPTER_1_COMPLETED');
        sessionStorage.removeItem('corebound_ch1_intro_seen');
        console.log("%c[COREBOUND] Chapter 1 progress reset. All missions locked except Mission 01.", "color: #00e5ff; font-weight: bold; font-size: 14px;");
        location.reload();
    };

    window._cbGameState = gameState;
    window.checkAnswer = checkAnswer;

})();