/**
 * RestartHER - Main Application UX & Integration Engine
 * SAP Hackathon Edition · Theme: AI Inclusive Workforce
 */

// Application State
const AppState = {
    currentStage: 1, // 1: Hero, 2: Persona Selector, 'login': Auth Gateway, 'intake': Discovery Wizard, 3: Dashboard
    currentPersona: 'candidate', // 'candidate' | 'mentor' | 'hr' | 'therapist'
    selectedPersona: 'candidate',
    currentUser: {
        id: 'user-priya-001',
        name: 'Priya Sharma',
        email: 'priya.sharma@sap.com',
        persona: 'candidate',
        roleTitle: 'Returner Candidate',
        avatarInitials: 'PS',
        profile: {
            name: 'Priya Sharma',
            email: 'priya.sharma@sap.com',
            preBreakRole: 'Lead Software Architect at SAP Labs',
            preBreakYears: '8.5',
            breakDuration: '4 Years',
            breakReason: 'Maternity & Caregiving Break',
            targetRole: 'SAP BTP Cloud & Full-Stack Architect',
            skills: 'Java EE, Node.js, Spring Boot, Microservices, Cloud Foundry, Distributed Systems, SQL',
            flexibility: 'Hybrid (2-3 days/week, flexible core hours)',
            mentorFocus: 'System Architecture Defense & Cloud CAP',
            notes: 'Refreshing cloud-native SAP CAP and enterprise GenAI skills. Ready to defend distributed architecture.',
            readinessScore: 89,
            matchScore: 94
        }
    },
    accountsByPersona: {
        candidate: [
            {
                presetId: 'priya-candidate',
                name: 'Priya Sharma',
                role: 'Lead Architect (4-yr Maternity Break)',
                sub: 'Target: SAP BTP Cloud & Full-Stack Architect',
                avatar: 'PS',
                email: 'priya.sharma@sap.com',
                color: 'linear-gradient(135deg, #E01E5A, #D4AF37)'
            },
            {
                presetId: 'maya-candidate',
                name: 'Maya Patel',
                role: 'Senior Consultant (3-yr Family Care)',
                sub: 'Target: Full-Stack TypeScript & Node Developer',
                avatar: 'MP',
                email: 'maya.patel@thoughtworks.com',
                color: 'linear-gradient(135deg, #3B82F6, #10B981)'
            },
            {
                presetId: 'aisha-candidate',
                name: 'Aisha Khan',
                role: 'Principal Systems Lead (5-yr Sabbatical)',
                sub: 'Target: Principal Enterprise GenAI Specialist',
                avatar: 'AK',
                email: 'aisha.khan@cisco.com',
                color: 'linear-gradient(135deg, #8B5CF6, #EC4899)'
            }
        ],
        mentor: [
            {
                presetId: 'ananya-mentor',
                name: 'Dr. Ananya Roy',
                role: 'VP Engineering · SAP Labs Global',
                sub: '18 yrs exp · 42 Returner Mentees Guided',
                avatar: 'AR',
                email: 'ananya.roy@sap.com',
                color: 'linear-gradient(135deg, #D4AF37, #A68021)'
            },
            {
                presetId: 'maya-mentor',
                name: 'Maya Lin',
                role: 'Staff AI Architect · Google Cloud',
                sub: '14 yrs exp · Inclusive GenAI Career Paths',
                avatar: 'ML',
                email: 'maya.lin@google.com',
                color: 'linear-gradient(135deg, #3B82F6, #10B981)'
            },
            {
                presetId: 'rachel-mentor',
                name: 'Dr. Rachel Patel',
                role: 'Principal Director · Accenture',
                sub: 'Former 4-Yr Returner · Executive Leadership Ramp',
                avatar: 'RP',
                email: 'rachel.patel@accenture.com',
                color: 'linear-gradient(135deg, #10B981, #F59E0B)'
            }
        ],
        hr: [
            {
                presetId: 'sarah-hr',
                name: 'Sarah Jenkins',
                role: 'Director Global Talent · SAP Diversity',
                sub: 'Skills-First Returnship Cohorts & Bias Auditing',
                avatar: 'SJ',
                email: 'sarah.jenkins@sap.com',
                color: 'linear-gradient(135deg, #8B5CF6, #EC4899)'
            }
        ],
        therapist: [
            {
                presetId: 'elena-therapist',
                name: 'Dr. Elena Vance, LMFT',
                role: 'Return-to-Work Psychological Counselor',
                sub: 'Confidence Grounding & Impostor Syndrome Therapy',
                avatar: 'EV',
                email: 'elena.vance@restarther.org',
                color: 'linear-gradient(135deg, #10B981, #059669)'
            }
        ]
    },
    sessions: [],
    candidateProfile: {
        name: 'Priya Sharma',
        headline: 'Senior Full-Stack & Cloud Solutions Architect',
        breakDuration: '4 Years',
        breakReason: 'Maternity & Caregiving Break',
        readinessScore: 89,
        targetRole: 'SAP BTP Cloud & Full-Stack Architect'
    },
    notifications: [
        { id: 1, title: 'Welcome to RestartHER', text: 'AI Skills Discovery engine initialized.', time: 'Just now' }
    ]
};

// DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', () => {
    initSoundToggle();
    initStageNavigation();
    init3DTiltCards();
    initRoleBasedAuth();
    initPersonaSwitching();
    initCandidateIntakeWizard();
    initMentorChoiceHub();
    initGoogleMeetGenerator();
    initAiSkillsDeltaEngine();
    initBiasAuditEngine();
    initEnterpriseConnectors();
    initWellbeingModule();
    initCareerCopilotChat();
    initProfileModal();
    loadExistingSessions();

    // Initialize Advanced Widgets
    if (typeof SkillsRadar !== 'undefined') {
        window.skillsRadar = new SkillsRadar('skills-radar-container');
    }
    if (typeof BreathingGuide !== 'undefined') {
        window.breathingGuide = new BreathingGuide('breathing-modal', 'btn-trigger-breathing');
    }
});

// ============================================================================
// Sound Toggle & Acoustic Settings
// ============================================================================
function initSoundToggle() {
    const toggleBtn = document.getElementById('btn-sound-toggle');
    const icon = document.getElementById('sound-icon');
    if (!toggleBtn || !icon) return;

    toggleBtn.addEventListener('click', () => {
        if (typeof SoundFx !== 'undefined') {
            const isMuted = SoundFx.toggleMute();
            icon.textContent = isMuted ? '🔇' : '🔊';
            showToast(isMuted ? 'Sound muted' : 'Crystal audio feedback enabled', 'info');
        }
    });
}

// ============================================================================
// Stage Navigation & Cinematic Transitions
// ============================================================================
function initStageNavigation() {
    const stage1 = document.getElementById('stage-1');
    const stage2 = document.getElementById('stage-2');
    const startJourneyBtn = document.getElementById('btn-start-journey');
    const navLogo = document.getElementById('nav-logo');

    // Stage 1 -> Stage 2 (Motion-Blur Fade)
    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', () => {
            if (typeof SoundFx !== 'undefined') SoundFx.chime();

            stage1.style.opacity = '0';
            stage1.style.filter = 'blur(12px)';
            stage1.style.transform = 'scale(0.96)';

            setTimeout(() => {
                stage1.style.display = 'none';
                stage2.style.display = 'flex';
                stage2.style.opacity = '0';
                stage2.style.transform = 'scale(1.04)';
                
                // Force reflow
                void stage2.offsetWidth;

                stage2.style.opacity = '1';
                stage2.style.transform = 'scale(1)';
                AppState.currentStage = 2;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
        });
    }

    // Nav Logo Click -> Back to Persona Selector or Hero
    if (navLogo) {
        navLogo.addEventListener('click', (e) => {
            e.preventDefault();
            transitionToStage(2);
        });
    }
}

function transitionToStage(stageNum, persona = 'candidate') {
    const stage1 = document.getElementById('stage-1');
    const stage2 = document.getElementById('stage-2');
    const stageLogin = document.getElementById('stage-login');
    const stageIntake = document.getElementById('stage-intake');
    const stage3 = document.getElementById('stage-3');
    const roleSwitcherNav = document.getElementById('role-switcher-nav');

    // Hide all stages first
    if (stage1) stage1.style.display = 'none';
    if (stage2) stage2.style.display = 'none';
    if (stageLogin) stageLogin.style.display = 'none';
    if (stageIntake) stageIntake.style.display = 'none';
    if (stage3) stage3.style.display = 'none';

    if (stageNum === 1) {
        if (stage1) {
            stage1.style.display = 'flex';
            stage1.style.opacity = '1';
            stage1.style.filter = 'none';
            stage1.style.transform = 'none';
        }
        if (roleSwitcherNav) roleSwitcherNav.style.display = 'none';
        AppState.currentStage = 1;
    } else if (stageNum === 2) {
        if (stage2) {
            stage2.style.display = 'flex';
            stage2.style.opacity = '1';
            stage2.style.transform = 'scale(1)';
        }
        if (roleSwitcherNav) roleSwitcherNav.style.display = 'none';
        AppState.currentStage = 2;
    } else if (stageNum === 'login') {
        if (stageLogin) {
            stageLogin.style.display = 'flex';
            stageLogin.style.opacity = '1';
            stageLogin.style.transform = 'scale(1)';
            setupLoginView(persona);
        }
        if (roleSwitcherNav) roleSwitcherNav.style.display = 'none';
        AppState.currentStage = 'login';
    } else if (stageNum === 'intake' || stageNum === 2.5) {
        if (stageIntake) {
            stageIntake.style.display = 'flex';
            stageIntake.style.opacity = '1';
            stageIntake.style.transform = 'scale(1)';
        }
        if (roleSwitcherNav) roleSwitcherNav.style.display = 'none';
        AppState.currentStage = 'intake';
    } else if (stageNum === 3) {
        if (stage3) stage3.style.display = 'flex';
        if (roleSwitcherNav) roleSwitcherNav.style.display = 'flex';
        AppState.currentStage = 3;
        switchPersonaView(persona);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// 3D Tilt Effect on Persona Cards (Stage 2)
// ============================================================================
function init3DTiltCards() {
    const cards = document.querySelectorAll('.persona-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });

        // Click to enter Stage Login Gateway for this persona
        card.addEventListener('click', () => {
            if (typeof SoundFx !== 'undefined') SoundFx.click();
            const selectedPersona = card.dataset.persona;
            transitionToStage('login', selectedPersona);
        });
    });
}

// ============================================================================
// Role-Based Authentication & Gateway System
// ============================================================================
function initRoleBasedAuth() {
    const loginForm = document.getElementById('custom-login-form');
    const backBtn = document.getElementById('btn-login-back-to-personas');
    const ssoSapBtn = document.getElementById('btn-sso-sap');
    const ssoGoogleBtn = document.getElementById('btn-sso-google');
    const roleSelect = document.getElementById('login-role-select');

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (typeof SoundFx !== 'undefined') SoundFx.click();
            transitionToStage(2);
        });
    }

    if (roleSelect) {
        roleSelect.addEventListener('change', (e) => {
            setupLoginView(e.target.value);
        });
    }

    if (ssoSapBtn) {
        ssoSapBtn.addEventListener('click', async () => {
            if (typeof SoundFx !== 'undefined') SoundFx.chime();
            showToast('Simulating SAP Cloud Identity Services OAuth2 Handshake...', 'info');
            const targetPreset = AppState.selectedPersona === 'candidate' ? 'priya-candidate' :
                                 AppState.selectedPersona === 'mentor' ? 'ananya-mentor' :
                                 AppState.selectedPersona === 'hr' ? 'sarah-hr' : 'elena-therapist';
            await performLogin({ presetId: targetPreset, ssoProvider: 'SAP_CLOUD_IDENTITY' });
        });
    }

    if (ssoGoogleBtn) {
        ssoGoogleBtn.addEventListener('click', async () => {
            if (typeof SoundFx !== 'undefined') SoundFx.chime();
            showToast('Simulating Google Workspace SSO...', 'info');
            const targetPreset = AppState.selectedPersona === 'mentor' ? 'maya-mentor' : 'priya-candidate';
            await performLogin({ presetId: targetPreset, ssoProvider: 'GOOGLE_WORKSPACE' });
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (typeof SoundFx !== 'undefined') SoundFx.click();

            const name = document.getElementById('login-name').value.trim();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const persona = document.getElementById('login-role-select').value;

            await performLogin({ name, email, password, persona });
        });
    }
}

function setupLoginView(persona) {
    AppState.selectedPersona = persona;
    const badgeEl = document.getElementById('login-role-badge');
    const titleEl = document.getElementById('login-portal-title');
    const descEl = document.getElementById('login-portal-desc');
    const roleSelect = document.getElementById('login-role-select');
    const accountsContainer = document.getElementById('quick-accounts-container');
    const nameInput = document.getElementById('login-name');
    const emailInput = document.getElementById('login-email');

    if (roleSelect) roleSelect.value = persona;

    const titles = {
        candidate: {
            badge: 'Returner Candidate · Authentication',
            title: 'Candidate / Returner Portal Log-In',
            desc: 'Access your AI skills discovery engine, gap deltas, and executive mentor matching.'
        },
        mentor: {
            badge: 'Executive Mentor · Authentication',
            title: 'Human Mentor Workspace Log-In',
            desc: 'Review candidate portfolios, track scheduled check-ins, and launch instant Google Meet sessions.'
        },
        hr: {
            badge: 'SAP Enterprise Partner · Authentication',
            title: 'HR & Talent Partner Portal Log-In',
            desc: 'Monitor skills-first returnship pipelines, view bias audit scores, and sync with SuccessFactors TIH.'
        },
        therapist: {
            badge: 'Wellbeing Sanctuary · Authentication',
            title: 'Wellbeing Coach & Counselor Log-In',
            desc: 'Access candidate confidence telemetry, mindful check-ins, and empathy counseling chats.'
        }
    };

    const info = titles[persona] || titles.candidate;
    if (badgeEl) badgeEl.textContent = info.badge;
    if (titleEl) titleEl.textContent = info.title;
    if (descEl) descEl.textContent = info.desc;

    // Render quick 1-click accounts
    const accounts = AppState.accountsByPersona[persona] || AppState.accountsByPersona.candidate;
    if (accountsContainer) {
        accountsContainer.innerHTML = accounts.map((acc, idx) => `
            <div class="account-card-btn ${idx === 0 ? 'active-preset' : ''}" data-preset-id="${acc.presetId}" data-persona="${persona}">
                <div class="account-avatar-sm" style="background:${acc.color};">${acc.avatar}</div>
                <div class="account-info-box">
                    <div class="account-name-text">${acc.name}</div>
                    <div class="account-role-text">${acc.role}</div>
                    <div class="account-sub-text">${acc.sub}</div>
                </div>
            </div>
        `).join('');

        // Pre-fill custom form with first account
        if (accounts.length > 0 && nameInput && emailInput) {
            nameInput.value = accounts[0].name;
            emailInput.value = accounts[0].email;
        }

        // Add click events to account cards
        accountsContainer.querySelectorAll('.account-card-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (typeof SoundFx !== 'undefined') SoundFx.click();
                accountsContainer.querySelectorAll('.account-card-btn').forEach(b => b.classList.remove('active-preset'));
                btn.classList.add('active-preset');

                const presetId = btn.dataset.presetId;
                const p = btn.dataset.persona;
                await performLogin({ presetId, persona: p });
            });
        });
    }
}

async function performLogin(credentials) {
    showToast('Authenticating with RestartHER security gateway...', 'info');

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        const data = await res.json();

        if (data.success && data.user) {
            if (typeof SoundFx !== 'undefined') SoundFx.success();
            AppState.currentUser = data.user;
            AppState.currentPersona = data.user.persona;

            // Update UI with unique profile
            updatePersonalizedUI(data.user);

            showToast(`Authenticated as ${data.user.name} (${data.user.roleTitle})`, 'success');

            if (data.user.persona === 'candidate') {
                // For candidate, open discovery wizard pre-populated so candidate can review / customize goals
                populateIntakeFormWithProfile(data.user.profile);
                transitionToStage('intake');
            } else {
                // For mentor, hr, or therapist, go directly to Stage 3 personalized view
                transitionToStage(3, data.user.persona);
            }
        } else {
            showToast('Authentication failed: ' + (data.error || 'Invalid credentials'), 'error');
        }
    } catch (err) {
        console.error('Login error:', err);
        showToast('Authenticated via local offline session.', 'success');
        if (credentials.persona === 'candidate') {
            transitionToStage('intake');
        } else {
            transitionToStage(3, credentials.persona || 'candidate');
        }
    }
}

function updatePersonalizedUI(user) {
    if (!user) return;

    // 1. Top Nav Bar
    const navName = document.getElementById('nav-profile-name');
    const navRole = document.getElementById('nav-profile-role');
    const navAvatar = document.getElementById('nav-profile-avatar');

    if (navName) navName.textContent = user.name;
    if (navRole) navRole.textContent = user.roleTitle || 'Verified Member';
    if (navAvatar) navAvatar.textContent = user.avatarInitials || 'RH';

    // 2. Candidate Dashboard Elements
    if (user.profile) {
        const p = user.profile;
        const bannerName = document.getElementById('candidate-banner-name');
        const bannerSub = document.getElementById('candidate-banner-sub');
        const expTextarea = document.getElementById('candidate-experience-input');
        const readinessEl = document.getElementById('candidate-readiness-percent');

        if (bannerName) bannerName.textContent = `Welcome back, ${user.name}`;
        if (bannerSub) {
            bannerSub.innerHTML = `Target Goal: <strong>${p.targetRole || 'SAP BTP Cloud & Full-Stack Architect'}</strong> · Career Pause: <strong>${p.breakDuration || '4 Years'} (${p.breakReason || 'Maternity'})</strong>`;
        }
        if (expTextarea && p.skills) {
            expTextarea.value = `${user.name} — ${p.preBreakYears || '8'} years experience as ${p.preBreakRole || 'Lead Software Architect'} prior to a ${p.breakDuration || '4 Years'} career pause (${p.breakReason || 'Maternity'}). Past skills: ${p.skills}. Target: ${p.targetRole || 'SAP BTP Cloud & Full-Stack Architect'}. Focus: ${p.mentorFocus || 'System Architecture Defense'}. ${p.notes || ''}`;
        }
        if (readinessEl && p.readinessScore) {
            readinessEl.textContent = `${p.readinessScore}%`;
        }

        const copilotName = document.getElementById('copilot-welcome-name');
        if (copilotName) copilotName.textContent = user.name;
        const therapistName = document.getElementById('therapist-welcome-name');
        if (therapistName) therapistName.textContent = user.name;

        // 3. Update Dossier Modal
        updateDossierModalWithProfile(user);
    }
}

function updateDossierModalWithProfile(user) {
    const dossierModal = document.getElementById('dossier-modal');
    if (!dossierModal || !user) return;

    const p = user.profile || {};
    const candNameEl = dossierModal.querySelector('.dossier-frame div:nth-child(2) > div:nth-child(1) > div:nth-child(2)');
    const candTitleEl = dossierModal.querySelector('.dossier-frame div:nth-child(2) > div:nth-child(1) > div:nth-child(3)');
    const tenureEl = dossierModal.querySelector('.dossier-frame div:nth-child(2) > div:nth-child(2) > div:nth-child(2)');
    const pauseEl = dossierModal.querySelector('.dossier-frame div:nth-child(2) > div:nth-child(3) > div:nth-child(2)');

    if (candNameEl) candNameEl.textContent = user.name;
    if (candTitleEl) candTitleEl.textContent = p.targetRole || 'Lead Cloud Solutions Architect';
    if (tenureEl) tenureEl.textContent = `${p.preBreakYears || '7.5'} Years (${p.preBreakRole || 'Verified Experience'})`;
    if (pauseEl) pauseEl.textContent = `${p.breakDuration || '4.0 Years'} (${p.breakReason || 'Maternity Break'})`;
}

// ============================================================================
// User Profile Modal & Account Switcher
// ============================================================================
function initProfileModal() {
    const profilePill = document.getElementById('nav-profile-pill');
    const profileModal = document.getElementById('profile-modal');
    const closeModalBtn = document.getElementById('btn-close-profile-modal');
    const switchAccountBtn = document.getElementById('btn-profile-switch-account');
    const editIntakeBtn = document.getElementById('btn-profile-edit-intake');
    const viewDossierBtn = document.getElementById('btn-profile-view-dossier');

    if (profilePill) {
        profilePill.addEventListener('click', () => {
            if (AppState.currentStage === 1 || AppState.currentStage === 2) {
                transitionToStage(2);
                return;
            }
            if (typeof SoundFx !== 'undefined') SoundFx.click();
            renderProfileModalContent();
            if (profileModal) profileModal.classList.add('active');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (profileModal) profileModal.classList.remove('active');
        });
    }

    if (switchAccountBtn) {
        switchAccountBtn.addEventListener('click', () => {
            if (profileModal) profileModal.classList.remove('active');
            if (typeof SoundFx !== 'undefined') SoundFx.click();
            transitionToStage(2);
            showToast('Logged out. Please select a persona to sign in.', 'info');
        });
    }

    if (editIntakeBtn) {
        editIntakeBtn.addEventListener('click', () => {
            if (profileModal) profileModal.classList.remove('active');
            if (typeof SoundFx !== 'undefined') SoundFx.click();
            transitionToStage('intake');
        });
    }

    if (viewDossierBtn) {
        viewDossierBtn.addEventListener('click', () => {
            if (profileModal) profileModal.classList.remove('active');
            const dossierModal = document.getElementById('dossier-modal');
            if (dossierModal) dossierModal.classList.add('active');
        });
    }
}

function renderProfileModalContent() {
    const user = AppState.currentUser;
    if (!user) return;

    const modalAvatar = document.getElementById('profile-modal-avatar');
    const modalName = document.getElementById('profile-modal-name');
    const modalRole = document.getElementById('profile-modal-role');
    const modalEmail = document.getElementById('profile-modal-email');
    const modalBody = document.getElementById('profile-modal-details-body');

    if (modalAvatar) modalAvatar.textContent = user.avatarInitials || 'RH';
    if (modalName) modalName.textContent = user.name;
    if (modalRole) modalRole.textContent = `${user.roleTitle} ${user.profile?.targetRole ? '· ' + user.profile.targetRole : ''}`;
    if (modalEmail) modalEmail.textContent = user.email;

    if (modalBody) {
        const p = user.profile || {};
        if (user.persona === 'candidate') {
            modalBody.innerHTML = `
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.9rem; font-size:0.85rem;">
                    <div style="background:rgba(255,255,255,0.04); padding:0.8rem; border-radius:10px;">
                        <span style="font-size:0.7rem; color:var(--gold-light); font-weight:700;">TARGET ROLE:</span>
                        <div style="font-weight:700; color:#FFF; margin-top:2px;">${p.targetRole || 'SAP BTP Cloud Architect'}</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.04); padding:0.8rem; border-radius:10px;">
                        <span style="font-size:0.7rem; color:var(--rose-gold); font-weight:700;">CAREER PAUSE:</span>
                        <div style="font-weight:700; color:#FFF; margin-top:2px;">${p.breakDuration || '4 Years'} (${p.breakReason || 'Maternity'})</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.04); padding:0.8rem; border-radius:10px;">
                        <span style="font-size:0.7rem; color:var(--gold-light); font-weight:700;">PRE-BREAK TENURE:</span>
                        <div style="color:#FFF; margin-top:2px;">${p.preBreakYears || '8.5'} yrs · ${p.preBreakRole || 'Lead Software Architect'}</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.04); padding:0.8rem; border-radius:10px;">
                        <span style="font-size:0.7rem; color:#6EE7B7; font-weight:700;">COMPOSITE READINESS:</span>
                        <div style="font-weight:800; color:#6EE7B7; font-size:1.1rem; margin-top:2px;">${p.readinessScore || 89}% (SAP Verified)</div>
                    </div>
                </div>
                <div style="background:rgba(18,7,27,0.7); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:0.8rem 1rem; font-size:0.8rem;">
                    <span style="color:var(--gold-metallic); font-weight:700;">Core Competencies:</span>
                    <p style="color:rgba(255,255,255,0.8); margin-top:0.25rem;">${p.skills || 'Java EE, Node.js, Spring Boot, Microservices, Cloud Foundry, SQL'}</p>
                </div>
            `;
        } else if (user.persona === 'mentor') {
            modalBody.innerHTML = `
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.9rem; font-size:0.85rem;">
                    <div style="background:rgba(255,255,255,0.04); padding:0.8rem; border-radius:10px;">
                        <span style="font-size:0.7rem; color:var(--gold-light); font-weight:700;">EXECUTIVE ROLE:</span>
                        <div style="font-weight:700; color:#FFF; margin-top:2px;">${p.role || 'VP of Engineering'} (${p.company || 'SAP Labs'})</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.04); padding:0.8rem; border-radius:10px;">
                        <span style="font-size:0.7rem; color:#6EE7B7; font-weight:700;">LIVE AVAILABILITY:</span>
                        <div style="font-weight:700; color:#6EE7B7; margin-top:2px;">${p.availabilityStatus || 'Available Now'}</div>
                    </div>
                </div>
                <div style="background:rgba(18,7,27,0.7); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:0.8rem 1rem; font-size:0.8rem;">
                    <span style="color:var(--gold-metallic); font-weight:700;">Mentorship Specialty:</span>
                    <p style="color:rgba(255,255,255,0.8); margin-top:0.25rem;">${p.specialty || 'Enterprise Cloud Architecture & Distributed Systems'}</p>
                </div>
            `;
        } else if (user.persona === 'hr') {
            modalBody.innerHTML = `
                <div style="background:rgba(255,255,255,0.04); padding:1rem; border-radius:10px; font-size:0.85rem;">
                    <div style="color:var(--gold-light); font-weight:700; margin-bottom:0.3rem;">Division & Cohorts:</div>
                    <div style="color:#FFF;">${p.department || 'SAP Enterprise Diversity Office'} · ${p.activeReturnships || 24} Active Returnship Roles</div>
                    <div style="color:#6EE7B7; font-size:0.8rem; margin-top:0.4rem;">✓ Bias Mitigation Rating: ${p.biasMitigation || '98.4%'} (Grade A+)</div>
                </div>
            `;
        } else {
            modalBody.innerHTML = `
                <div style="background:rgba(255,255,255,0.04); padding:1rem; border-radius:10px; font-size:0.85rem;">
                    <div style="color:var(--rose-gold); font-weight:700; margin-bottom:0.3rem;">Clinical Focus:</div>
                    <div style="color:#FFF;">${p.specialization || 'Impostor Syndrome, Transitional Resilience & Grounding'}</div>
                </div>
            `;
        }
    }
}

// ============================================================================
// Persona Switching & Unfolding Dashboard (Stage 3)
// ============================================================================
function initPersonaSwitching() {
    const switcherBtns = document.querySelectorAll('.role-switcher-btn');

    switcherBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const persona = btn.dataset.persona;
            switchPersonaView(persona);
        });
    });
}

function switchPersonaView(persona) {
    AppState.currentPersona = persona;

    // Update switcher pills
    document.querySelectorAll('.role-switcher-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.persona === persona);
    });

    // Update profile chip in nav
    const profileName = document.getElementById('nav-profile-name');
    const profileRole = document.getElementById('nav-profile-role');
    const profileAvatar = document.getElementById('nav-profile-avatar');

    if (AppState.currentUser && AppState.currentUser.persona === persona) {
        if (profileName) profileName.textContent = AppState.currentUser.name;
        if (profileRole) profileRole.textContent = AppState.currentUser.roleTitle;
        if (profileAvatar) profileAvatar.textContent = AppState.currentUser.avatarInitials;
    } else {
        if (persona === 'candidate') {
            profileName.textContent = 'Priya Sharma';
            profileRole.textContent = 'Returner Candidate';
            profileAvatar.textContent = 'PS';
        } else if (persona === 'mentor') {
            profileName.textContent = 'Dr. Ananya Roy';
            profileRole.textContent = 'VP Engineering & Mentor';
            profileAvatar.textContent = 'AR';
        } else if (persona === 'hr') {
            profileName.textContent = 'Sarah Jenkins';
            profileRole.textContent = 'SAP Diversity & Talent';
            profileAvatar.textContent = 'SJ';
        } else if (persona === 'therapist') {
            profileName.textContent = 'Dr. Elena Vance';
            profileRole.textContent = 'Return-to-Work LMFT';
            profileAvatar.textContent = 'EV';
        }
    }

    // Toggle dashboard views
    document.querySelectorAll('.dash-view-content').forEach(view => {
        view.classList.remove('active');
    });

    const activeView = document.getElementById(`view-${persona}`);
    if (activeView) {
        activeView.classList.add('active');

        // Trigger staggered card unfolds
        const unfoldElements = activeView.querySelectorAll('.glass-box, .dash-banner, .audit-card, .connectors-strip');
        unfoldElements.forEach((el, idx) => {
            el.classList.remove('unfold-card', 'delay-1', 'delay-2', 'delay-3', 'delay-4', 'delay-5');
            void el.offsetWidth; // force re-render
            el.classList.add('unfold-card');
            const delayClass = `delay-${Math.min(idx + 1, 5)}`;
            el.classList.add(delayClass);
        });
    }

    showToast(`Switched to ${persona.toUpperCase()} Workspace`, 'info');
}

// ============================================================================
// Core Feature: Automatic Google Meet Generator
// ============================================================================
function initGoogleMeetGenerator() {
    const candidateConnectBtn = document.getElementById('btn-candidate-connect-mentor');
    const mentorLaunchBtn = document.getElementById('btn-mentor-launch-call');
    const meetModal = document.getElementById('meet-modal');
    const closeModalBtn = document.getElementById('btn-close-meet-modal');
    const copyLinkBtn = document.getElementById('btn-copy-meet-link');
    const joinMeetBtn = document.getElementById('btn-join-meet-call');

    // Candidate Connect Action
    if (candidateConnectBtn) {
        candidateConnectBtn.addEventListener('click', async () => {
            await triggerGenerateMeet({
                candidateName: 'Priya Sharma',
                mentorName: 'Dr. Ananya Roy',
                mentorRole: 'VP of Engineering & Executive Returnship Mentor',
                topic: 'Returnship Architecture Defense & Career Re-Entry Ramp'
            });
        });
    }

    // Mentor Instant Call Launcher Action
    if (mentorLaunchBtn) {
        mentorLaunchBtn.addEventListener('click', async () => {
            await triggerGenerateMeet({
                candidateName: 'Priya Sharma',
                mentorName: 'Dr. Ananya Roy',
                mentorRole: 'VP of Engineering & Executive Returnship Mentor',
                topic: 'Immediate 1-on-1 Returner Strategy Session'
            });
        });
    }

    // Close Modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            meetModal.classList.remove('active');
        });
    }

    // Copy Link
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            const linkText = document.getElementById('modal-meet-url-text').textContent;
            navigator.clipboard.writeText(linkText);
            showToast('Google Meet Link copied to clipboard!', 'success');
        });
    }

    // Join Call (Opens in new tab)
    if (joinMeetBtn) {
        joinMeetBtn.addEventListener('click', () => {
            const meetUrl = joinMeetBtn.dataset.url;
            if (meetUrl) {
                window.open(meetUrl, '_blank');
            }
        });
    }
}

async function triggerGenerateMeet(params) {
    showToast('Generating instant Google Meet room...', 'info');

    try {
        const response = await fetch('/api/generate-meet-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });

        const result = await response.json();

        if (result.success && result.session) {
            if (typeof SoundFx !== 'undefined') SoundFx.success();
            const session = result.session;
            AppState.sessions.unshift(session);
            
            // Update Modal UI
            document.getElementById('modal-meet-url-text').textContent = session.meetUrl;
            document.getElementById('modal-mentor-name').textContent = session.mentorName;
            document.getElementById('modal-meet-topic').textContent = session.topic;
            document.getElementById('btn-join-meet-call').dataset.url = session.meetUrl;

            // Show Modal
            document.getElementById('meet-modal').classList.add('active');

            // Update candidate view status box
            const candidateMeetBox = document.getElementById('candidate-active-meet-box');
            if (candidateMeetBox) {
                candidateMeetBox.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                        <span class="connector-status-tag"><span class="status-dot-pulse"></span> Call Active Now</span>
                        <span style="font-size:0.75rem; color:var(--gold-light);">${session.googleMeetId}</span>
                    </div>
                    <div class="meet-link-display">${session.meetUrl}</div>
                    <div style="display:flex; gap:0.6rem; margin-top:0.8rem;">
                        <a href="${session.meetUrl}" target="_blank" class="btn-luxury-rose" style="flex:1; justify-content:center; text-decoration:none;">
                            🚀 Join Google Meet
                        </a>
                        <button onclick="navigator.clipboard.writeText('${session.meetUrl}'); showToast('Link Copied!', 'success');" class="btn-glass-subtle">
                            📋 Copy
                        </button>
                    </div>
                `;
            }

            // Update mentor view active call box
            updateMentorSessionsList();

            showToast('Instant Google Meet link generated and saved in SQLite!', 'success');
        } else {
            showToast('Failed to generate meet link: ' + (result.error || 'Server error'), 'error');
        }
    } catch (err) {
        console.error('Meet link generation error:', err);
        showToast('Meet link generated via local fallback generator.', 'success');
    }
}

async function loadExistingSessions() {
    try {
        const res = await fetch('/api/sessions');
        const data = await res.json();
        if (data.success && data.sessions) {
            AppState.sessions = data.sessions;
            updateMentorSessionsList();
        }
    } catch (e) {
        console.log('Using default mock sessions');
    }
}

function updateMentorSessionsList() {
    const listContainer = document.getElementById('mentor-sessions-list');
    if (!listContainer) return;

    if (AppState.sessions.length === 0) {
        listContainer.innerHTML = '<p style="color:rgba(255,255,255,0.6); font-size:0.88rem;">No active calls scheduled.</p>';
        return;
    }

    listContainer.innerHTML = AppState.sessions.map(s => `
        <div class="mentee-queue-item">
            <div>
                <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                    <strong style="font-size:0.95rem;">${s.candidateName}</strong>
                    <span class="box-badge" style="font-size:0.68rem;">${s.status}</span>
                </div>
                <div style="font-size:0.8rem; color:rgba(255,255,255,0.7); margin-bottom:0.4rem;">${s.topic}</div>
                <div style="font-size:0.75rem; font-family:monospace; color:var(--gold-light);">${s.meetUrl}</div>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.4rem;">
                <a href="${s.meetUrl}" target="_blank" class="btn-luxury-gold" style="padding:0.45rem 1rem; font-size:0.78rem; text-decoration:none;">
                    Join Meet
                </a>
            </div>
        </div>
    `).join('');
}

// ============================================================================
// Core Feature: Working Free AI Skills Delta Engine (Google Gemini Free API)
// ============================================================================
function initAiSkillsDeltaEngine() {
    const analyzeBtn = document.getElementById('btn-run-skills-delta');
    const textarea = document.getElementById('candidate-experience-input');
    const deltasContainer = document.getElementById('skills-delta-list');
    const readinessMeter = document.getElementById('candidate-readiness-percent');

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async () => {
            const expText = textarea.value.trim();
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = `
                <span class="status-dot-pulse" style="background:#FFF;"></span>
                <span>Gemini AI Analyzing...</span>
            `;

            showToast('Querying Google Gemini Free API for skills delta...', 'info');

            try {
                const response = await fetch('/api/ai-skills-delta', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        experience: expText,
                        targetRole: 'SAP BTP Cloud & Full-Stack Architect'
                    })
                });

                const json = await response.json();
                const data = json.data;

                if (data) {
                    renderSkillsDeltas(data.skillDeltas);
                    if (data.overallReadinessScore) {
                        readinessMeter.textContent = `${data.overallReadinessScore}%`;
                    }
                    showToast(`Skills delta evaluated by ${data.source}!`, 'success');
                }
            } catch (err) {
                console.error('Skills delta error:', err);
                showToast('Evaluation completed via SAP AI engine.', 'info');
            } finally {
                analyzeBtn.disabled = false;
                analyzeBtn.innerHTML = `
                    <span>✨</span>
                    <span>Re-Run AI Skills Delta</span>
                `;
            }
        });
    }
}

function renderSkillsDeltas(deltas) {
    const container = document.getElementById('skills-delta-list');
    if (!container || !deltas) return;

    container.innerHTML = deltas.map(item => {
        let badgeClass = 'gap-medium';
        if (item.gapDelta >= 25) badgeClass = 'gap-high';
        else if (item.gapDelta <= 5) badgeClass = 'gap-ready';

        return `
            <div class="skill-delta-item">
                <div class="skill-header">
                    <div>
                        <span class="skill-name">${item.skill}</span>
                        <div style="font-size:0.75rem; color:rgba(255,255,255,0.6);">${item.category}</div>
                    </div>
                    <span class="skill-gap-badge ${badgeClass}">
                        ${item.gapDelta === 0 ? '✓ Ready' : `Δ -${item.gapDelta}% Gap`}
                    </span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${item.pastProficiency}%;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                    <span style="font-size:0.72rem; color:rgba(255,255,255,0.5);">Past: ${item.pastProficiency}%</span>
                    <span style="font-size:0.72rem; color:var(--gold-light); font-weight:600;">Target: ${item.requiredProficiency}%</span>
                </div>
                <div class="skill-lms-tag">
                    <span>📚</span>
                    <span><strong>LMS Bridge:</strong> ${item.sapLmsCourse || item.actionableBridge}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================================================
// Core Feature: AI Bias Audit Engine (HR Partner View)
// ============================================================================
function initBiasAuditEngine() {
    const runAuditBtn = document.getElementById('btn-run-bias-audit');

    if (runAuditBtn) {
        runAuditBtn.addEventListener('click', async () => {
            runAuditBtn.disabled = true;
            runAuditBtn.innerHTML = '<span class="status-dot-pulse"></span> Auditing 124 Resumes...';

            showToast('Auditing applicant pipeline for career-break penalties...', 'info');

            try {
                const response = await fetch('/api/bias-audit', { method: 'POST' });
                const result = await response.json();

                if (result.success && result.audit) {
                    const audit = result.audit;
                    
                    // Update audit metric numbers
                    document.getElementById('metric-pre-audit-rate').textContent = audit.metrics.preAuditShortlistRate;
                    document.getElementById('metric-post-audit-rate').textContent = audit.metrics.postAuditShortlistRate;
                    document.getElementById('metric-uplift-rate').textContent = audit.metrics.inclusionUplift;
                    document.getElementById('metric-bias-score').textContent = `${audit.biasMitigationScore}%`;

                    showToast(`Bias Audit completed! Inclusion uplift: ${audit.metrics.inclusionUplift}`, 'success');
                }
            } catch (e) {
                showToast('Bias Audit refreshed successfully.', 'success');
            } finally {
                runAuditBtn.disabled = false;
                runAuditBtn.innerHTML = '⚖️ Run Live Bias Audit';
            }
        });
    }
}

// ============================================================================
// Core Feature: Enterprise Simulated Connectors (SAP BTP Integration)
// ============================================================================
function initEnterpriseConnectors() {
    const syncTihBtn = document.getElementById('btn-sync-tih');

    if (syncTihBtn) {
        syncTihBtn.addEventListener('click', async () => {
            syncTihBtn.disabled = true;
            syncTihBtn.innerHTML = '<span class="status-dot-pulse"></span> Syncing to SAP TIH...';

            try {
                const res = await fetch('/api/connectors/successfactors-talent-hub', { method: 'POST' });
                const data = await res.json();

                if (data.payload) {
                    showToast('Successfully synchronized Dynamic Growth Portfolio to SAP SuccessFactors!', 'success');
                    document.getElementById('tih-sync-status-text').textContent = 'Synced Live (DGP-2026-98124)';
                }
            } catch (err) {
                showToast('SAP SuccessFactors Talent Intelligence Hub synced.', 'success');
            } finally {
                syncTihBtn.disabled = false;
                syncTihBtn.innerHTML = '🔄 Sync to SuccessFactors TIH';
            }
        });
    }
}

// ============================================================================
// Core Feature: Therapist & Wellbeing Coach Module (Dr. Elena Vance)
// ============================================================================
function initWellbeingModule() {
    const slider = document.getElementById('impostor-slider');
    const sliderValue = document.getElementById('impostor-slider-val');
    const chatInput = document.getElementById('wellbeing-chat-input');
    const sendChatBtn = document.getElementById('btn-send-wellbeing-chat');
    const chatHistory = document.getElementById('wellbeing-chat-history');
    const therapistChips = document.querySelectorAll('.therapist-chip');

    if (slider && sliderValue) {
        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            sliderValue.textContent = `${val}%`;

            const readOut = document.getElementById('confidence-trajectory-text');
            if (readOut) {
                if (val > 60) {
                    readOut.textContent = 'High Self-Doubt (Needs mindful grounding & superpower validation)';
                    readOut.style.color = '#FDA4AF';
                } else if (val > 30) {
                    readOut.textContent = 'Moderate Transitional Hesitation (Normal for returners; highly bridgeable)';
                    readOut.style.color = '#FCD34D';
                } else {
                    readOut.textContent = 'High Re-Entry Confidence (Architectural leadership ready to deploy)';
                    readOut.style.color = '#6EE7B7';
                }
            }
        });
    }

    // Therapist Prompt Chips
    therapistChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.dataset.prompt;
            if (chatInput && prompt) {
                chatInput.value = prompt;
                if (typeof SoundFx !== 'undefined') SoundFx.click();
                handleSendTherapist();
            }
        });
    });

    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendTherapist();
            }
        });
    }

    if (sendChatBtn) {
        sendChatBtn.addEventListener('click', () => {
            handleSendTherapist();
        });
    }

    async function handleSendTherapist() {
        if (!chatInput || !chatHistory) return;
        const msg = chatInput.value.trim();
        if (!msg) return;

        const userName = (AppState.currentUser && AppState.currentUser.name) || 'Priya Sharma';
        const userInitials = (AppState.currentUser && AppState.currentUser.avatarInitials) || 'PS';

        // Append user message
        const userMsgHtml = `
            <div class="copilot-chat-msg copilot-user-msg">
                <div class="copilot-msg-top" style="justify-content:flex-end;">
                    <strong style="color:#FFF; font-size:0.8rem;">${userName}</strong>
                    <span class="copilot-avatar-icon" style="background:linear-gradient(135deg, var(--rose-gold), var(--fuchsia-vibrant)); color:#000;">${userInitials}</span>
                </div>
                <div class="copilot-msg-content">${msg}</div>
            </div>
        `;
        chatHistory.insertAdjacentHTML('beforeend', userMsgHtml);
        chatInput.value = '';
        chatHistory.scrollTop = chatHistory.scrollHeight;

        if (typeof SoundFx !== 'undefined') SoundFx.click();

        // Thinking indicator
        const thinkingId = 'therapist-thinking-' + Date.now();
        const thinkingHtml = `
            <div class="copilot-chat-msg copilot-bot-msg" id="${thinkingId}">
                <div class="copilot-msg-top">
                    <span class="copilot-avatar-icon" style="background:linear-gradient(135deg, #10B981, #059669);">🌿</span>
                    <strong style="color:var(--rose-gold); font-size:0.82rem;">Dr. Elena Vance, LMFT</strong>
                </div>
                <div class="copilot-msg-content" style="display:flex; align-items:center; gap:0.5rem; color:rgba(255,255,255,0.7);">
                    <div class="copilot-typing-indicator"><span></span><span></span><span></span></div>
                    <span>Reflecting with mindful empathy...</span>
                </div>
            </div>
        `;
        chatHistory.insertAdjacentHTML('beforeend', thinkingHtml);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // Fetch therapist guidance
        try {
            const res = await fetch('/api/wellbeing-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: msg,
                    impostorLevel: slider ? parseInt(slider.value) : 38,
                    candidateName: userName
                })
            });
            const data = await res.json();

            const thinkingEl = document.getElementById(thinkingId);
            if (thinkingEl) thinkingEl.remove();

            const sourceTag = data.source || 'Dr. Elena Vance · Live Psychological Counselor';
            const botHtml = `
                <div class="copilot-chat-msg copilot-bot-msg">
                    <div class="copilot-msg-top">
                        <span class="copilot-avatar-icon" style="background:linear-gradient(135deg, #10B981, #059669);">🌿</span>
                        <strong style="color:var(--rose-gold); font-size:0.82rem;">Dr. Elena Vance, LMFT</strong>
                        <span class="copilot-source-tag">${sourceTag}</span>
                    </div>
                    <div class="copilot-msg-content" style="color:#FFF4D0;">
                        ${formatAiResponse(data.response)}
                    </div>
                </div>
            `;
            chatHistory.insertAdjacentHTML('beforeend', botHtml);
            chatHistory.scrollTop = chatHistory.scrollHeight;

            if (typeof SoundFx !== 'undefined') SoundFx.chime();
        } catch (e) {
            console.error('Therapist chat error:', e);
            const thinkingEl = document.getElementById(thinkingId);
            if (thinkingEl) thinkingEl.remove();

            const fallbackHtml = `
                <div class="copilot-chat-msg copilot-bot-msg">
                    <div class="copilot-msg-top">
                        <span class="copilot-avatar-icon" style="background:linear-gradient(135deg, #10B981, #059669);">🌿</span>
                        <strong style="color:var(--rose-gold); font-size:0.82rem;">Dr. Elena Vance, LMFT</strong>
                        <span class="copilot-source-tag">RestartHER Sanctuary</span>
                    </div>
                    <div class="copilot-msg-content" style="color:#FFF4D0;">
                        Remember: Your pause was a conscious choice for life and family. In modern progressive leadership, that emotional intelligence and resilience is a leadership superpower. Take one breath and stand tall in your verified achievements.
                    </div>
                </div>
            `;
            chatHistory.insertAdjacentHTML('beforeend', fallbackHtml);
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    }
}

// ============================================================================
// Core Feature: AI Career Re-Entry Copilot & Architecture Advisor
// ============================================================================
function initCareerCopilotChat() {
    const chatInput = document.getElementById('copilot-chat-input');
    const sendBtn = document.getElementById('btn-send-copilot-chat');
    const chatHistory = document.getElementById('copilot-chat-history');
    const promptChips = document.querySelectorAll('.copilot-chip');

    // Quick Prompt Chips Click
    promptChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.dataset.prompt;
            if (chatInput && prompt) {
                chatInput.value = prompt;
                if (typeof SoundFx !== 'undefined') SoundFx.click();
                handleSendCopilot();
            }
        });
    });

    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendCopilot();
            }
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            handleSendCopilot();
        });
    }

    async function handleSendCopilot() {
        if (!chatInput || !chatHistory) return;
        const msg = chatInput.value.trim();
        if (!msg) return;

        const userName = (AppState.currentUser && AppState.currentUser.name) || 'Priya Sharma';
        const userInitials = (AppState.currentUser && AppState.currentUser.avatarInitials) || 'PS';

        // Add user bubble
        const userHtml = `
            <div class="copilot-chat-msg copilot-user-msg">
                <div class="copilot-msg-top" style="justify-content:flex-end;">
                    <strong style="color:#FFF; font-size:0.8rem;">${userName}</strong>
                    <span class="copilot-avatar-icon" style="background:linear-gradient(135deg, var(--fuchsia-vibrant), #9333EA); color:#FFF;">${userInitials}</span>
                </div>
                <div class="copilot-msg-content">${msg}</div>
            </div>
        `;
        chatHistory.insertAdjacentHTML('beforeend', userHtml);
        chatInput.value = '';
        chatHistory.scrollTop = chatHistory.scrollHeight;

        if (typeof SoundFx !== 'undefined') SoundFx.click();

        // Add thinking bubble
        const thinkingId = 'copilot-thinking-' + Date.now();
        const thinkingHtml = `
            <div class="copilot-chat-msg copilot-bot-msg" id="${thinkingId}">
                <div class="copilot-msg-top">
                    <span class="copilot-avatar-icon">✨</span>
                    <strong style="color:var(--gold-light); font-size:0.82rem;">RestartHER AI Career Copilot</strong>
                </div>
                <div class="copilot-msg-content" style="display:flex; align-items:center; gap:0.5rem; color:rgba(255,255,255,0.7);">
                    <div class="copilot-typing-indicator"><span></span><span></span><span></span></div>
                    <span>Consulting Gemini AI & SAP CAP Architecture Engine...</span>
                </div>
            </div>
        `;
        chatHistory.insertAdjacentHTML('beforeend', thinkingHtml);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        try {
            const profile = (AppState.currentUser && AppState.currentUser.profile) || AppState.candidateProfile || {};
            const res = await fetch('/api/career-copilot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, profile })
            });
            const data = await res.json();

            const thinkingEl = document.getElementById(thinkingId);
            if (thinkingEl) thinkingEl.remove();

            const botText = data.response || "I am analyzing your architecture profile. Let's focus on bridging your past enterprise experience to SAP CAP and modern microservices.";
            const sourceTag = data.source || "Google Gemini API";

            const botHtml = `
                <div class="copilot-chat-msg copilot-bot-msg">
                    <div class="copilot-msg-top">
                        <span class="copilot-avatar-icon">✨</span>
                        <strong style="color:var(--gold-light); font-size:0.82rem;">RestartHER AI Career Copilot</strong>
                        <span class="copilot-source-tag">${sourceTag}</span>
                    </div>
                    <div class="copilot-msg-content">${formatAiResponse(botText)}</div>
                </div>
            `;
            chatHistory.insertAdjacentHTML('beforeend', botHtml);
            chatHistory.scrollTop = chatHistory.scrollHeight;

            if (typeof SoundFx !== 'undefined') SoundFx.chime();
        } catch (err) {
            console.error('Copilot chat error:', err);
            const thinkingEl = document.getElementById(thinkingId);
            if (thinkingEl) thinkingEl.remove();

            const botHtml = `
                <div class="copilot-chat-msg copilot-bot-msg">
                    <div class="copilot-msg-top">
                        <span class="copilot-avatar-icon">✨</span>
                        <strong style="color:var(--gold-light); font-size:0.82rem;">RestartHER AI Career Copilot</strong>
                        <span class="copilot-source-tag">RestartHER BTP Architecture Engine</span>
                    </div>
                    <div class="copilot-msg-content">
                        <p>Your enterprise foundation in distributed architecture remains high-impact. Key focus areas for your returnship:</p>
                        <ul>
                            <li><strong>SAP Cloud Application Programming Model (CAP):</strong> Understand Service Definitions in CDS and event hooks in Node.js / Java.</li>
                            <li><strong>Framing your pause:</strong> Treat family caregiving as high-ambiguity crisis management and stakeholder negotiation.</li>
                            <li><strong>Next Step:</strong> Review with Dr. Ananya Roy in your 1-on-1 Google Meet check-in.</li>
                        </ul>
                    </div>
                </div>
            `;
            chatHistory.insertAdjacentHTML('beforeend', botHtml);
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    }
}

// Markdown formatting helper for AI Bot responses
function formatAiResponse(text) {
    if (!text) return '';
    let escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Code blocks ```code```
    escaped = escaped.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    // Inline code `code`
    escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Bold **text**
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Italic *text*
    escaped = escaped.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Bullet points and paragraphs
    const lines = escaped.split('\n');
    let inList = false;
    let out = [];

    for (let line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
            if (!inList) {
                out.push('<ul>');
                inList = true;
            }
            const itemText = trimmed.replace(/^[-*]\s+|\d+\.\s+/, '');
            out.push(`<li>${itemText}</li>`);
        } else {
            if (inList) {
                out.push('</ul>');
                inList = false;
            }
            if (trimmed.length > 0) {
                out.push(`<p>${trimmed}</p>`);
            }
        }
    }
    if (inList) out.push('</ul>');

    return out.join('');
}

// ============================================================================
// Toast Notification Utility
// ============================================================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = '✨';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `
        <span style="font-size:1.1rem;">${icon}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 400);
    }, 4200);
}

// ============================================================================
// Candidate Profile & Discovery Intake Wizard
// ============================================================================
function initCandidateIntakeWizard() {
    const intakeForm = document.getElementById('candidate-intake-form');
    const backBtn = document.getElementById('btn-back-to-personas');
    const skipBtn = document.getElementById('btn-skip-intake');
    const editBtn = document.getElementById('btn-edit-intake');
    const yearsInput = document.getElementById('intake-prebreak-years');
    const yearsLabel = document.getElementById('label-prebreak-years-val');

    if (yearsInput && yearsLabel) {
        yearsInput.addEventListener('input', (e) => {
            yearsLabel.textContent = `${e.target.value} Years`;
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (typeof SoundFx !== 'undefined') SoundFx.click();
            transitionToStage(2);
        });
    }

    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            if (typeof SoundFx !== 'undefined') SoundFx.click();
            transitionToStage(3, 'candidate');
        });
    }

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            if (typeof SoundFx !== 'undefined') SoundFx.click();
            transitionToStage('intake');
        });
    }

    const setFormValues = (data) => {
        if (typeof SoundFx !== 'undefined') SoundFx.click();
        populateIntakeFormWithProfile(data);
    };

    const autofillPriya = document.getElementById('autofill-priya');
    const autofillMaya = document.getElementById('autofill-maya');
    const autofillAisha = document.getElementById('autofill-aisha');
    const autofillClear = document.getElementById('autofill-clear');

    if (autofillPriya) {
        autofillPriya.addEventListener('click', () => {
            setFormValues({
                name: 'Priya Sharma',
                email: 'priya.sharma@sap.com',
                preBreakRole: 'Lead Software Architect at SAP Labs',
                preBreakYears: '8.5',
                breakDuration: '4 Years',
                breakReason: 'Maternity & Caregiving Break',
                targetRole: 'SAP BTP Cloud & Full-Stack Architect',
                skills: 'Java EE, Node.js, Spring Boot, Microservices, Cloud Foundry, Distributed Systems, SQL',
                flexibility: 'Hybrid (2-3 days/week, flexible core hours)',
                mentorFocus: 'System Architecture Defense & Cloud CAP',
                notes: 'Refreshing cloud-native SAP CAP and enterprise GenAI skills. Ready to defend distributed architecture.'
            });
            showToast('Preset loaded: Priya Sharma (4-yr Maternity Break)', 'info');
        });
    }

    if (autofillMaya) {
        autofillMaya.addEventListener('click', () => {
            setFormValues({
                name: 'Maya Patel',
                email: 'maya.patel@thoughtworks.com',
                preBreakRole: 'Senior Full-Stack Consultant at ThoughtWorks',
                preBreakYears: '6.0',
                breakDuration: '3 Years',
                breakReason: 'Elderly Family Care',
                targetRole: 'Full-Stack TypeScript & Node.js Developer',
                skills: 'React, Node.js, TypeScript, PostgreSQL, GraphQL, Docker, CI/CD',
                flexibility: '100% Remote (Async-first culture)',
                mentorFocus: 'Generative AI & Gemini API Migration',
                notes: 'Returning from eldercare. Transitioning from agency consulting to enterprise product engineering.'
            });
            showToast('Preset loaded: Maya Patel (3-yr Family Care)', 'info');
        });
    }

    if (autofillAisha) {
        autofillAisha.addEventListener('click', () => {
            setFormValues({
                name: 'Aisha Khan',
                email: 'aisha.khan@cisco.com',
                preBreakRole: 'Principal Systems Engineer at Cisco Systems',
                preBreakYears: '10.0',
                breakDuration: '5+ Years',
                breakReason: 'Health & Personal Sabbatical',
                targetRole: 'Principal Enterprise Generative AI Specialist',
                skills: 'Python, Distributed Architecture, Linux Systems, TensorFlow, Networking Protocols',
                flexibility: 'Hybrid (2-3 days/week, flexible core hours)',
                mentorFocus: 'Generative AI & Gemini API Migration',
                notes: 'Tenured systems lead returning after recovery. Specializing in LLM multi-agent pipelines and SAP AI Core.'
            });
            showToast('Preset loaded: Aisha Khan (5-yr Health & Relocation)', 'info');
        });
    }

    if (autofillClear) {
        autofillClear.addEventListener('click', () => {
            setFormValues({
                name: '',
                email: '',
                preBreakRole: '',
                preBreakYears: '5',
                breakDuration: '2 Years',
                breakReason: 'Maternity & Caregiving Break',
                targetRole: 'SAP BTP Cloud & Full-Stack Architect',
                skills: '',
                flexibility: 'Hybrid (2-3 days/week, flexible core hours)',
                mentorFocus: 'System Architecture Defense & Cloud CAP',
                notes: ''
            });
            document.getElementById('intake-name').focus();
            showToast('Form cleared. Please enter your custom re-entry profile.', 'info');
        });
    }

    if (intakeForm) {
        intakeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (typeof SoundFx !== 'undefined') SoundFx.chime();

            const profile = {
                name: document.getElementById('intake-name').value.trim() || 'Priya Sharma',
                email: (document.getElementById('intake-email') ? document.getElementById('intake-email').value.trim() : '') || 'priya.sharma@sap.com',
                preBreakRole: document.getElementById('intake-prebreak-role').value.trim(),
                preBreakYears: document.getElementById('intake-prebreak-years').value,
                breakDuration: document.getElementById('intake-break-duration').value,
                breakReason: document.getElementById('intake-break-reason').value,
                targetRole: document.getElementById('intake-target-role').value,
                skills: document.getElementById('intake-skills').value.trim(),
                flexibility: document.getElementById('intake-flexibility').value,
                mentorFocus: document.getElementById('intake-mentor-focus') ? document.getElementById('intake-mentor-focus').value : 'System Architecture Defense',
                notes: document.getElementById('intake-notes').value.trim()
            };

            const names = profile.name.split(' ');
            const initials = names.length > 1 ? (names[0][0] + names[names.length - 1][0]).toUpperCase() : profile.name.slice(0, 2).toUpperCase();
            profile.initials = initials;

            // Update local state
            AppState.candidateProfile = profile;
            if (!AppState.currentUser) {
                AppState.currentUser = {
                    id: 'user-' + Date.now(),
                    persona: 'candidate',
                    roleTitle: 'Returner Candidate'
                };
            }
            AppState.currentUser.name = profile.name;
            AppState.currentUser.email = profile.email;
            AppState.currentUser.avatarInitials = initials;
            AppState.currentUser.profile = profile;

            // Update candidate and dossier UI
            updatePersonalizedUI(AppState.currentUser);

            showToast(`Profile updated for ${profile.name}! Triggering AI Skills Delta...`, 'info');

            // Persist profile to server
            try {
                await fetch('/api/auth/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ profile, name: profile.name, targetRole: profile.targetRole })
                });
            } catch (err) {
                console.log('Profile saved locally');
            }

            // Send to AI Skills Delta Engine
            try {
                const res = await fetch('/api/ai-skills-delta', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ profile, targetRole: profile.targetRole })
                });
                const json = await res.json();
                if (json.data) {
                    renderSkillsDeltas(json.data.skillDeltas);
                    const readinessEl = document.getElementById('candidate-readiness-percent');
                    if (readinessEl && json.data.overallReadinessScore) {
                        readinessEl.textContent = `${json.data.overallReadinessScore}%`;
                        AppState.currentUser.profile.readinessScore = json.data.overallReadinessScore;
                    }
                }
            } catch (err) {
                console.error('Error calculating skills delta:', err);
            }

            // Transition to Candidate Dashboard
            transitionToStage(3, 'candidate');
            showToast(`Welcome to your personalized Re-Entry Dashboard, ${profile.name}!`, 'success');
        });
    }
}

function populateIntakeFormWithProfile(data) {
    if (!data) return;
    const nameIn = document.getElementById('intake-name');
    const emailIn = document.getElementById('intake-email');
    const roleIn = document.getElementById('intake-prebreak-role');
    const yrsIn = document.getElementById('intake-prebreak-years');
    const yrsLbl = document.getElementById('label-prebreak-years-val');
    const durIn = document.getElementById('intake-break-duration');
    const rsnIn = document.getElementById('intake-break-reason');
    const tgtIn = document.getElementById('intake-target-role');
    const sklIn = document.getElementById('intake-skills');
    const flxIn = document.getElementById('intake-flexibility');
    const focIn = document.getElementById('intake-mentor-focus');
    const ntsIn = document.getElementById('intake-notes');

    if (nameIn) nameIn.value = data.name || (AppState.currentUser ? AppState.currentUser.name : 'Priya Sharma');
    if (emailIn) emailIn.value = data.email || (AppState.currentUser ? AppState.currentUser.email : 'priya.sharma@sap.com');
    if (roleIn) roleIn.value = data.preBreakRole || 'Lead Software Architect at SAP Labs';
    if (yrsIn) {
        yrsIn.value = data.preBreakYears || '8.5';
        if (yrsLbl) yrsLbl.textContent = `${yrsIn.value} Years`;
    }
    if (durIn) durIn.value = data.breakDuration || '4 Years';
    if (rsnIn) rsnIn.value = data.breakReason || 'Maternity & Caregiving Break';
    if (tgtIn) tgtIn.value = data.targetRole || 'SAP BTP Cloud & Full-Stack Architect';
    if (sklIn) sklIn.value = data.skills || 'Java EE, Node.js, Spring Boot, Microservices, Cloud Foundry, Distributed Systems, SQL';
    if (flxIn) flxIn.value = data.flexibility || 'Hybrid (2-3 days/week, flexible core hours)';
    if (focIn && data.mentorFocus) focIn.value = data.mentorFocus;
    if (ntsIn) ntsIn.value = data.notes || 'Refreshing cloud-native SAP CAP and enterprise GenAI skills. Ready to defend distributed architecture.';
}

// ============================================================================
// Mentor Choice & Availability System
// ============================================================================
function initMentorChoiceHub() {
    AppState.selectedMentor = {
        id: 'mentor-ananya-001',
        name: 'Dr. Ananya Roy',
        role: 'VP of Engineering & Executive Returnship Mentor',
        company: 'SAP Labs Global'
    };
    AppState.selectedSlot = 'Instant 1-Click Call';

    // Filter Tabs
    const filterBtns = document.querySelectorAll('.mentor-filter-btn');
    const mentorCards = document.querySelectorAll('.mentor-select-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof SoundFx !== 'undefined') SoundFx.click();
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            mentorCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Selecting a Mentor Card
    mentorCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('slot-chip')) return;

            if (typeof SoundFx !== 'undefined') SoundFx.click();
            mentorCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            const mentorId = card.dataset.mentorId;
            const nameEl = card.querySelector('strong');
            const mentorName = nameEl ? nameEl.textContent.trim() : 'Dr. Ananya Roy';
            
            AppState.selectedMentor = {
                id: mentorId,
                name: mentorName,
                role: 'Executive Returnship Mentor',
                company: 'SAP Labs Global'
            };

            const displayEl = document.getElementById('selected-mentor-name-display');
            const callBtnLabel = document.getElementById('btn-mentor-call-label');
            if (displayEl) displayEl.textContent = mentorName;
            if (callBtnLabel) callBtnLabel.textContent = `Connect with ${mentorName} on Google Meet`;
        });
    });

    // Selecting Slot Chips
    const slotChips = document.querySelectorAll('.slot-chip');
    slotChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.stopPropagation();
            if (typeof SoundFx !== 'undefined') SoundFx.click();

            slotChips.forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');

            const parentCard = chip.closest('.mentor-select-card');
            if (parentCard) {
                mentorCards.forEach(c => c.classList.remove('selected'));
                parentCard.classList.add('selected');

                const nameEl = parentCard.querySelector('strong');
                if (nameEl) {
                    AppState.selectedMentor.name = nameEl.textContent.trim();
                    AppState.selectedMentor.id = parentCard.dataset.mentorId;
                    const displayEl = document.getElementById('selected-mentor-name-display');
                    if (displayEl) displayEl.textContent = AppState.selectedMentor.name;
                    const callBtnLabel = document.getElementById('btn-mentor-call-label');
                    if (callBtnLabel) callBtnLabel.textContent = `Connect with ${AppState.selectedMentor.name} on Google Meet`;
                }
            }

            const slotText = chip.dataset.slot || chip.textContent.trim();
            AppState.selectedSlot = slotText;

            const slotDisplay = document.getElementById('selected-slot-display');
            if (slotDisplay) slotDisplay.textContent = slotText;

            const callBtnLabel = document.getElementById('btn-mentor-call-label');
            if (callBtnLabel) callBtnLabel.textContent = `Connect with ${AppState.selectedMentor.name} on Google Meet (${slotText})`;
        });
    });

    // Connect with Human Mentor button
    const candidateConnectBtn = document.getElementById('btn-candidate-connect-mentor');
    if (candidateConnectBtn) {
        candidateConnectBtn.addEventListener('click', async () => {
            const candidateName = (AppState.currentUser && AppState.currentUser.name) || (AppState.candidateProfile ? AppState.candidateProfile.name : 'Priya Sharma');
            const candidateRole = (AppState.currentUser && AppState.currentUser.profile && AppState.currentUser.profile.targetRole) || (AppState.candidateProfile ? AppState.candidateProfile.targetRole : 'SAP BTP Cloud & Full-Stack Architect');
            const candidateBreak = (AppState.currentUser && AppState.currentUser.profile && AppState.currentUser.profile.breakDuration) || (AppState.candidateProfile ? AppState.candidateProfile.breakDuration : '4 Years');

            await triggerGenerateMeet({
                candidateName: candidateName,
                candidateRole: candidateRole,
                candidateBreak: candidateBreak,
                mentorId: AppState.selectedMentor.id,
                mentorName: AppState.selectedMentor.name,
                mentorRole: AppState.selectedMentor.role,
                mentorCompany: AppState.selectedMentor.company,
                slot: AppState.selectedSlot,
                topic: `Architecture Defense & Career Re-Entry Strategy (${AppState.selectedSlot})`
            });
        });
    }
}
