/**
 * COREBOUND — Central API Client (corebound-api.js)
 * Provides unified, authenticated HTTP communication with the Corebound FastAPI backend.
 * Base URL defaults to http://127.0.0.1:8000.
 */
(function (window) {
    'use strict';

    const API_BASE_URL = window.COREBOUND_API_BASE_URL || 'http://127.0.0.1:8000';
    const TOKEN_KEY = 'corebound_token';
    const USER_KEY = 'corebound_sentinel_user';
    const PREFS_KEY = 'corebound_guardian_prefs';
    const USER_PREFS_KEY = 'corebound_user_preferences';

    // Canonical option mapping to adhere strictly to backend validation schemas
    const GOAL_MAP = {
        'placement_prep': 'Placement Preparation',
        'interview_prep': 'Interview Preparation',
        'skill_improvement': 'Skill Improvement',
        'competitive_programming': 'Competitive Programming',
        'academic_prep': 'Academic Preparation',
        'other_custom': 'Other',
        'Placement Prep': 'Placement Preparation',
        'Interview Prep': 'Interview Preparation',
        'Skill Improvement': 'Skill Improvement',
        'Competitive Programming': 'Competitive Programming',
        'Academic Prep': 'Academic Preparation',
        'Other': 'Other',
    };

    const ROLE_MAP = {
        'frontend': 'Frontend Developer',
        'backend': 'Backend Developer',
        'fullstack': 'Full Stack Developer',
        'software_engineer': 'Software Developer',
        'data_analyst': 'Data Analyst',
        'data_scientist_ml': 'Data Scientist',
        'qa_automation': 'QA / Testing',
        'devops_cloud': 'DevOps / Cloud',
        'other_role': 'Other',
        'Frontend Developer': 'Frontend Developer',
        'Backend Developer': 'Backend Developer',
        'Full Stack Developer': 'Full Stack Developer',
        'Software Engineer': 'Software Developer',
        'Software Developer': 'Software Developer',
        'Data Analyst': 'Data Analyst',
        'Data Scientist / ML': 'Data Scientist',
        'Data Scientist': 'Data Scientist',
        'QA / Automation Engineer': 'QA / Testing',
        'QA / Testing': 'QA / Testing',
        'DevOps / Cloud Engineer': 'DevOps / Cloud',
        'DevOps / Cloud': 'DevOps / Cloud',
        'Other Specialization': 'Other',
        'Other': 'Other',
    };

    const SKILL_MAP = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced',
        'Tier I — Beginner': 'Beginner',
        'Tier II — Intermediate': 'Intermediate',
        'Tier III — Advanced': 'Advanced',
        'Beginner': 'Beginner',
        'Intermediate': 'Intermediate',
        'Advanced': 'Advanced',
    };

    const SUBJECT_MAP = {
        'dsa': 'Data Structures & Algorithms',
        'javascript_ts': 'JavaScript',
        'python': 'Python',
        'java': 'Java',
        'cpp': 'C++',
        'sql_db': 'SQL',
        'html_css': 'HTML / CSS',
        'backend_arch': 'Backend Development',
        'problem_solving': 'Problem Solving',
        'Data Structures & Algorithms': 'Data Structures & Algorithms',
        'JavaScript / TypeScript': 'JavaScript',
        'JavaScript': 'JavaScript',
        'Python': 'Python',
        'Java': 'Java',
        'C++': 'C++',
        'SQL & Databases': 'SQL',
        'SQL': 'SQL',
        'HTML / Modern CSS': 'HTML / CSS',
        'HTML / CSS': 'HTML / CSS',
        'Backend Architecture': 'Backend Development',
        'Backend Development': 'Backend Development',
        'Frontend Development': 'Frontend Development',
        'Databases': 'Databases',
        'Aptitude': 'Aptitude',
        'Problem Solving & Clean Code': 'Problem Solving',
        'Problem Solving': 'Problem Solving',
    };

    const TIME_MAP = {
        '15_mins': '15 minutes',
        '30_mins': '30 minutes',
        '1_hour': '1 hour',
        '2_hours': '2 hours',
        '3_plus_hours': '3+ hours',
        '15 Minutes': '15 minutes',
        '30 Minutes': '30 minutes',
        '1 Hour': '1 hour',
        '2 Hours': '2 hours',
        '3+ Hours': '3+ hours',
        '15 minutes': '15 minutes',
        '30 minutes': '30 minutes',
        '1 hour': '1 hour',
        '2 hours': '2 hours',
        '3+ hours': '3+ hours',
    };

    const DIFF_MAP = {
        'adaptive': 'Adaptive',
        'easy': 'Easy',
        'medium': 'Medium',
        'hard': 'Hard',
        'Adaptive Engine': 'Adaptive',
        'Easy Guided Pace': 'Easy',
        'Medium Standard': 'Medium',
        'Hardcore Mode': 'Hard',
        'Adaptive': 'Adaptive',
        'Easy': 'Easy',
        'Medium': 'Medium',
        'Hard': 'Hard',
    };

    const LEARN_MAP = {
        'story': 'Story-driven',
        'practice': 'Practice-heavy',
        'balanced': 'Balanced',
        'challenge': 'Challenge-heavy',
        'Story-driven Lore': 'Story-driven',
        'Practice-heavy Drills': 'Practice-heavy',
        'Balanced Symphony': 'Balanced',
        'Challenge-heavy PvP': 'Challenge-heavy',
        'Story-driven': 'Story-driven',
        'Practice-heavy': 'Practice-heavy',
        'Balanced': 'Balanced',
        'Challenge-heavy': 'Challenge-heavy',
    };

    class CoreboundApi {
        constructor(baseUrl) {
            this.baseUrl = (baseUrl || 'http://127.0.0.1:8000').replace(/\/+$/, '');
        }

        getToken() {
            try {
                return localStorage.getItem(TOKEN_KEY);
            } catch (e) {
                return null;
            }
        }

        setToken(token) {
            try {
                if (token) {
                    localStorage.setItem(TOKEN_KEY, token);
                } else {
                    localStorage.removeItem(TOKEN_KEY);
                }
            } catch (e) {
                console.warn('Storage error while saving token:', e);
            }
        }

        removeToken() {
            try {
                localStorage.removeItem(TOKEN_KEY);
            } catch (e) {}
        }

        getStoredUser() {
            try {
                const raw = localStorage.getItem(USER_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                return null;
            }
        }

        setStoredUser(user) {
            try {
                if (user) {
                    localStorage.setItem(USER_KEY, JSON.stringify(user));
                } else {
                    localStorage.removeItem(USER_KEY);
                }
            } catch (e) {}
        }

        getStoredPreferences() {
            try {
                const raw = localStorage.getItem(USER_PREFS_KEY) || localStorage.getItem(PREFS_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                return null;
            }
        }

        setStoredPreferences(prefs) {
            try {
                if (prefs) {
                    localStorage.setItem(USER_PREFS_KEY, JSON.stringify(prefs));
                    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
                } else {
                    localStorage.removeItem(USER_PREFS_KEY);
                    localStorage.removeItem(PREFS_KEY);
                }
            } catch (e) {}
        }

        isAuthenticated() {
            const token = this.getToken();
            return typeof token === 'string' && token.trim().length > 0;
        }

        getAuthHeaders(customHeaders = {}) {
            const headers = {
                'Content-Type': 'application/json',
                ...customHeaders,
            };
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            return headers;
        }

        formatPreferencesForBackend(prefs) {
            if (!prefs || typeof prefs !== 'object') return {};

            const rawGoal = prefs.primaryGoal || prefs.goal;
            const rawRole = prefs.targetRole || prefs.target_role;
            const rawSkill = prefs.skillLevel || prefs.skill_level;
            const rawSubjects = prefs.practiceTopics || prefs.subjects || [];
            const rawTime = prefs.dailyCommitment || prefs.daily_time || prefs.dailyTime;
            const rawDiff = prefs.difficultyPreference || prefs.difficulty_preference;
            const rawLearn = prefs.learningStyle || prefs.learning_preference || prefs.learningPreference;

            const payload = {};

            if (rawGoal) payload.goal = GOAL_MAP[rawGoal] || rawGoal;
            if (rawRole) payload.target_role = ROLE_MAP[rawRole] || rawRole;
            if (rawSkill) payload.skill_level = SKILL_MAP[rawSkill] || rawSkill;
            if (Array.isArray(rawSubjects) && rawSubjects.length > 0) {
                const mappedSubjects = rawSubjects
                    .map(s => SUBJECT_MAP[s] || s)
                    .filter((s, idx, arr) => arr.indexOf(s) === idx);
                payload.subjects = mappedSubjects.length > 0 ? mappedSubjects : ['Data Structures & Algorithms'];
            }
            if (rawTime) payload.daily_time = TIME_MAP[rawTime] || rawTime;
            if (rawDiff) payload.difficulty_preference = DIFF_MAP[rawDiff] || rawDiff;
            if (rawLearn) payload.learning_preference = LEARN_MAP[rawLearn] || rawLearn;

            return payload;
        }

        async request(endpoint, options = {}) {
            const url = endpoint.startsWith('http') 
                ? endpoint 
                : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
            
            const headers = this.getAuthHeaders(options.headers || {});
            const config = {
                ...options,
                headers,
            };

            let response;
            try {
                response = await fetch(url, config);
            } catch (networkError) {
                throw new Error(`Unable to connect to Corebound Core server at ${this.baseUrl}. Please ensure the backend is running.`);
            }

            let data;
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                data = await response.json().catch(() => null);
            } else {
                data = await response.text().catch(() => null);
            }

            if (!response.ok) {
                let errorMsg = `Request failed with status ${response.status}`;
                if (data && typeof data === 'object') {
                    if (typeof data.detail === 'string') {
                        errorMsg = data.detail;
                    } else if (Array.isArray(data.detail)) {
                        errorMsg = data.detail.map(d => d.msg || (d.loc ? `${d.loc.join('.')}: ${d.msg}` : JSON.stringify(d))).join(', ');
                    } else if (data.message) {
                        errorMsg = data.message;
                    }
                }
                const error = new Error(errorMsg);
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data;
        }

        async register(email, password, displayName = '') {
            // 1. Send registration request to backend
            const registerRes = await this.request('/api/v1/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password: password,
                }),
            });

            // 2. Automatically authenticate to retrieve JWT access token
            const loginRes = await this.login(email, password);
            return {
                ...registerRes,
                ...loginRes,
            };
        }

        async login(email, password) {
            const data = await this.request('/api/v1/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password: password,
                }),
            });

            if (data && data.access_token) {
                this.setToken(data.access_token);
                if (data.user) {
                    this.setStoredUser(data.user);
                }
            }
            return data;
        }

        async getCurrentUser() {
            if (!this.isAuthenticated()) {
                return null;
            }
            try {
                const user = await this.request('/api/v1/auth/me', {
                    method: 'GET',
                });
                if (user) {
                    this.setStoredUser(user);
                }
                return user;
            } catch (err) {
                if (err.status === 401) {
                    this.logout();
                }
                throw err;
            }
        }

        async getProfile() {
            if (!this.isAuthenticated()) {
                return null;
            }
            return await this.request('/api/v1/users/me/profile', {
                method: 'GET',
            });
        }

        async getPreferences() {
            if (!this.isAuthenticated()) {
                return null;
            }
            return await this.request('/api/v1/users/me/preferences', {
                method: 'GET',
            });
        }

        async updatePreferences(preferences) {
            const payload = this.formatPreferencesForBackend(preferences);
            const updated = await this.request('/api/v1/users/me/preferences', {
                method: 'PATCH',
                body: JSON.stringify(payload),
            });

            // Maintain localStorage compatibility matching authoritative server response
            this.setStoredPreferences(updated);
            return updated;
        }

        // ==========================================
        // PHASE 3: STORY, CURRICULUM & MISSIONS APIS
        // ==========================================

        async getStory() {
            return await this.request('/api/v1/story', {
                method: 'GET',
            });
        }

        async getChapters() {
            return await this.request('/api/v1/story/chapters', {
                method: 'GET',
            });
        }

        async getChapter(chapterId) {
            return await this.request(`/api/v1/story/chapters/${chapterId}`, {
                method: 'GET',
            });
        }

        async getSector(sectorId) {
            return await this.request(`/api/v1/story/sectors/${sectorId}`, {
                method: 'GET',
            });
        }

        async getMissions() {
            return await this.request('/api/v1/missions', {
                method: 'GET',
            });
        }

        async getAvailableMissions() {
            return await this.request('/api/v1/missions/available', {
                method: 'GET',
            });
        }

        async getMission(missionId) {
            return await this.request(`/api/v1/missions/${missionId}`, {
                method: 'GET',
            });
        }

        async getMissionStatus(missionId) {
            return await this.request(`/api/v1/missions/${missionId}/status`, {
                method: 'GET',
            });
        }

        async getMissionProgress() {
            if (!this.isAuthenticated()) {
                return null;
            }
            return await this.request('/api/v1/progress/missions', {
                method: 'GET',
            });
        }

        async getProgressSummary() {
            if (!this.isAuthenticated()) {
                return null;
            }
            return await this.request('/api/v1/progress/summary', {
                method: 'GET',
            });
        }

        async getProgressStats() {
            if (!this.isAuthenticated()) {
                return null;
            }
            return await this.request('/api/v1/progress/stats', {
                method: 'GET',
            });
        }

        async getRewards() {
            if (!this.isAuthenticated()) {
                return null;
            }
            return await this.request('/api/v1/rewards/me', {
                method: 'GET',
            });
        }

        async getMyRewards() {
            return await this.getRewards();
        }

        // ==========================================
        // PHASE 4: GAMEPLAY SESSION APIS
        // ==========================================

        async startGameplay(missionId) {
            return await this.request('/api/v1/gameplay/start', {
                method: 'POST',
                body: JSON.stringify({
                    mission_id: parseInt(missionId, 10),
                }),
            });
        }

        // ==========================================
        // PHASE 5: GAMEPLAY ANSWER SUBMISSION
        // ==========================================

        async submitGameplayAnswer(sessionId, answer, timeTakenMs = null) {
            const body = {
                answer: typeof answer === 'object' ? JSON.stringify(answer) : String(answer),
            };
            if (timeTakenMs !== null && timeTakenMs !== undefined && !isNaN(timeTakenMs)) {
                body.time_taken_ms = parseInt(timeTakenMs, 10);
            }
            return await this.request(`/api/v1/gameplay/${sessionId}/answer`, {
                method: 'POST',
                body: JSON.stringify(body),
            });
        }

        logout() {
            this.removeToken();
            this.setStoredUser(null);
            this.setStoredPreferences(null);
        }
    }

    const apiInstance = new CoreboundApi(API_BASE_URL);
    window.cbApi = apiInstance;
    window.COREBOUND_API = apiInstance;

})(typeof window !== 'undefined' ? window : globalThis);
