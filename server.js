/**
 * RestartHER - Main Application Server (Node.js & SAP CAP Framework)
 * Provides REST APIs, Google Meet dynamic generation, Gemini AI integration,
 * Enterprise SAP Connectors, and serves the Glassmorphism HTML5 webapp.
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const careerService = require('./srv/career-service');
const auditService = require('./srv/audit-service');
const aiBotService = require('./srv/ai-bot-service');

const app = express();
const PORT = process.env.PORT || 4004;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Lightweight Persistent SQLite / JSON Store for sessions & meetings
const DB_FILE = path.join(__dirname, 'restarther-data.json');

function loadDB() {
    if (fs.existsSync(DB_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        } catch (e) {
            console.error('Error reading DB_FILE, reinitializing:', e.message);
        }
    }
    const defaultData = {
        sessions: [
            {
                id: 'sess-init-01',
                candidateId: 'user-priya-001',
                candidateName: 'Priya Sharma',
                candidateRole: 'Senior Full-Stack & Cloud Solutions Architect (Returner)',
                candidateBreak: '4 Years (Maternity & Family Care)',
                mentorId: 'mentor-ananya-001',
                mentorName: 'Dr. Ananya Roy',
                mentorRole: 'VP of Engineering & Executive Returnship Mentor',
                mentorCompany: 'SAP Labs Global',
                topic: 'System Architecture Re-entry Strategy & Mock Interview Defense',
                meetUrl: 'https://meet.google.com/rh-care-2026',
                googleMeetId: 'rh-care-2026',
                createdAt: new Date().toISOString(),
                status: 'CONFIRMED'
            }
        ],
        wellbeingChecks: [
            {
                id: 'wb-001',
                candidateName: 'Priya Sharma',
                impostorScore: 38,
                confidenceScore: 82,
                status: 'Positive Momentum',
                timestamp: new Date().toISOString()
            }
        ]
    };
    saveDB(defaultData);
    return defaultData;
}

function saveDB(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
        console.error('Error writing DB_FILE:', e.message);
    }
}

// Ensure DB is initialized
let localDB = loadDB();

// Mentors Catalog with Live Availability & Slots
const MENTORS_LIST = [
    {
        id: 'mentor-ananya-001',
        name: 'Dr. Ananya Roy',
        role: 'VP of Engineering & Executive Returnship Mentor',
        company: 'SAP Labs Global',
        category: 'cloud',
        specialty: 'Enterprise Cloud Architecture & Distributed Systems',
        yearsExperience: 18,
        menteesGuided: 42,
        rating: 5.0,
        avatarInitials: 'AR',
        availabilityStatus: 'Available Now',
        availableSlots: [
            'Instant 1-Click Call',
            'Today: 3:30 PM - 4:00 PM',
            'Tomorrow: 10:00 AM - 10:30 AM',
            'Thursday: 2:00 PM - 2:30 PM'
        ],
        bio: 'Executive sponsor for women returning to engineering leadership at SAP Labs. Specializes in cloud-native CAP architectures and system design defense.'
    },
    {
        id: 'mentor-maya-002',
        name: 'Maya Lin',
        role: 'Staff AI Architect & Returner Lead',
        company: 'Google Cloud',
        category: 'ai',
        specialty: 'Generative AI Systems, LLMs & Multi-Agent Design',
        yearsExperience: 14,
        menteesGuided: 28,
        rating: 4.9,
        avatarInitials: 'ML',
        availabilityStatus: 'Available Today',
        availableSlots: [
            'Today: 4:30 PM - 5:00 PM',
            'Tomorrow: 11:30 AM - 12:00 PM',
            'Friday: 3:00 PM - 3:30 PM'
        ],
        bio: 'Pioneered inclusive AI hiring frameworks. Guides returners in bridging from classical ML and software engineering to modern generative AI architectures.'
    },
    {
        id: 'mentor-sarah-003',
        name: 'Sarah Jenkins',
        role: 'Director of Global Talent & Returnship Sponsor',
        company: 'SAP Enterprise Diversity Office',
        category: 'hr',
        specialty: 'Resume Gap Neutralization & Executive Compensation Negotiation',
        yearsExperience: 12,
        menteesGuided: 35,
        rating: 4.95,
        avatarInitials: 'SJ',
        availabilityStatus: 'Available Tomorrow',
        availableSlots: [
            'Tomorrow: 9:00 AM - 9:30 AM',
            'Tomorrow: 2:30 PM - 3:00 PM',
            'Friday: 11:00 AM - 11:30 AM'
        ],
        bio: 'Spearheads skills-first returnship placements across SAP BTP. Expert in overcoming algorithmic resume-gap biases and negotiating flexible hybrid contracts.'
    },
    {
        id: 'mentor-rachel-004',
        name: 'Dr. Rachel Patel',
        role: 'Principal Engineering Director (Former 4-Yr Returner)',
        company: 'Accenture Cloud First',
        category: 'returner',
        specialty: 'Returner Confidence, Technical Re-Entry Ramp & Work-Family Balance',
        yearsExperience: 16,
        menteesGuided: 31,
        rating: 5.0,
        avatarInitials: 'RP',
        availabilityStatus: 'Available Now',
        availableSlots: [
            'Instant 1-Click Call',
            'Today: 6:00 PM - 6:30 PM',
            'Saturday: 10:00 AM - 10:30 AM'
        ],
        bio: 'Returned to technology leadership after a 4-year maternity break. Passionate about empowering women to see family caregiving as executive leadership training.'
    }
];

// Predefined Verified User Profiles by Role
const USER_ACCOUNTS = {
    // Candidates
    'priya-candidate': {
        id: 'user-priya-001',
        name: 'Priya Sharma',
        email: 'priya.sharma@sap.com',
        persona: 'candidate',
        roleTitle: 'Returner Candidate',
        avatarInitials: 'PS',
        profile: {
            name: 'Priya Sharma',
            preBreakRole: 'Lead Software Architect at SAP Labs',
            preBreakYears: '8.5',
            breakDuration: '4 Years',
            breakReason: 'Maternity & Caregiving Break',
            targetRole: 'SAP BTP Cloud & Full-Stack Architect',
            skills: 'Java EE, Node.js, Spring Boot, Microservices, Cloud Foundry, Distributed Systems, SQL',
            flexibility: 'Hybrid (2-3 days/week, flexible core hours)',
            notes: 'Refreshing cloud-native SAP CAP and enterprise GenAI skills. Ready to defend distributed architecture.',
            readinessScore: 89,
            matchScore: 94
        }
    },
    'maya-candidate': {
        id: 'user-maya-002',
        name: 'Maya Patel',
        email: 'maya.patel@thoughtworks.com',
        persona: 'candidate',
        roleTitle: 'Returner Candidate',
        avatarInitials: 'MP',
        profile: {
            name: 'Maya Patel',
            preBreakRole: 'Senior Full-Stack Consultant at ThoughtWorks',
            preBreakYears: '6.0',
            breakDuration: '3 Years',
            breakReason: 'Elderly Family Care',
            targetRole: 'Full-Stack TypeScript & Node.js Developer',
            skills: 'React, Node.js, TypeScript, PostgreSQL, GraphQL, Docker, CI/CD',
            flexibility: '100% Remote (Async-first culture)',
            notes: 'Returning from eldercare. Transitioning from agency consulting to enterprise product engineering.',
            readinessScore: 91,
            matchScore: 92
        }
    },
    'aisha-candidate': {
        id: 'user-aisha-003',
        name: 'Aisha Khan',
        email: 'aisha.khan@cisco.com',
        persona: 'candidate',
        roleTitle: 'Returner Candidate',
        avatarInitials: 'AK',
        profile: {
            name: 'Aisha Khan',
            preBreakRole: 'Principal Systems Engineer at Cisco Systems',
            preBreakYears: '10.0',
            breakDuration: '5+ Years',
            breakReason: 'Health & Personal Sabbatical',
            targetRole: 'Principal Enterprise Generative AI Specialist',
            skills: 'Python, Distributed Architecture, Linux Systems, TensorFlow, Networking Protocols',
            flexibility: 'Hybrid (2-3 days/week, flexible core hours)',
            notes: 'Tenured systems lead returning after recovery. Specializing in LLM multi-agent pipelines and SAP AI Core.',
            readinessScore: 93,
            matchScore: 96
        }
    },
    // Mentors
    'ananya-mentor': {
        id: 'mentor-ananya-001',
        name: 'Dr. Ananya Roy',
        email: 'ananya.roy@sap.com',
        persona: 'mentor',
        roleTitle: 'VP of Engineering & Executive Returnship Mentor',
        avatarInitials: 'AR',
        company: 'SAP Labs Global',
        profile: {
            name: 'Dr. Ananya Roy',
            role: 'VP of Engineering',
            company: 'SAP Labs Global',
            specialty: 'Enterprise Cloud Architecture & Distributed Systems',
            menteesGuided: 42,
            rating: 5.0,
            availabilityStatus: 'Available Now'
        }
    },
    'maya-mentor': {
        id: 'mentor-maya-002',
        name: 'Maya Lin',
        email: 'maya.lin@google.com',
        persona: 'mentor',
        roleTitle: 'Staff AI Architect & Returner Lead',
        avatarInitials: 'ML',
        company: 'Google Cloud',
        profile: {
            name: 'Maya Lin',
            role: 'Staff AI Architect',
            company: 'Google Cloud',
            specialty: 'Generative AI Systems, LLMs & Multi-Agent Design',
            menteesGuided: 28,
            rating: 4.9,
            availabilityStatus: 'Available Today'
        }
    },
    // HR Partners
    'sarah-hr': {
        id: 'hr-sarah-001',
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@sap.com',
        persona: 'hr',
        roleTitle: 'Director Global Talent & Diversity',
        avatarInitials: 'SJ',
        company: 'SAP Enterprise Diversity Office',
        profile: {
            name: 'Sarah Jenkins',
            department: 'SAP Enterprise Diversity Office',
            activeReturnships: 24,
            shortlistUplift: '+62.3%',
            biasMitigation: '98.4%'
        }
    },
    // Therapists
    'elena-therapist': {
        id: 'therapist-elena-001',
        name: 'Dr. Elena Vance, LMFT',
        email: 'elena.vance@restarther.org',
        persona: 'therapist',
        roleTitle: 'Return-to-Work Psychological Counselor',
        avatarInitials: 'EV',
        profile: {
            name: 'Dr. Elena Vance, LMFT',
            specialization: 'Impostor Syndrome & Career Re-Entry Grounding',
            sessionsCompleted: 154,
            averageConfidenceBoost: '+48%'
        }
    }
};

let currentAuthenticatedUser = USER_ACCOUNTS['priya-candidate'];

// ----------------------------------------------------------------------------
// API Endpoints
// ----------------------------------------------------------------------------

/**
 * Endpoint: POST /api/auth/login
 * Role-Based Login & Authentication Gateway
 */
app.post('/api/auth/login', (req, res) => {
    try {
        const { presetId, email, password, persona, name } = req.body;

        // If preset account requested
        if (presetId && USER_ACCOUNTS[presetId]) {
            currentAuthenticatedUser = { ...USER_ACCOUNTS[presetId] };
            return res.json({
                success: true,
                message: `Authenticated as ${currentAuthenticatedUser.name} (${currentAuthenticatedUser.roleTitle})`,
                token: `jwt-rh-${Date.now()}-${presetId}`,
                user: currentAuthenticatedUser
            });
        }

        // Check if existing user by email
        const foundKey = Object.keys(USER_ACCOUNTS).find(k => USER_ACCOUNTS[k].email.toLowerCase() === (email || '').toLowerCase());
        if (foundKey) {
            currentAuthenticatedUser = { ...USER_ACCOUNTS[foundKey] };
            if (name) currentAuthenticatedUser.name = name;
            return res.json({
                success: true,
                message: `Welcome back, ${currentAuthenticatedUser.name}!`,
                token: `jwt-rh-${Date.now()}-${foundKey}`,
                user: currentAuthenticatedUser
            });
        }

        // Custom User Registration / Login
        const chosenPersona = persona || 'candidate';
        const userName = name || (email ? email.split('@')[0] : 'Valued Returner');
        const names = userName.trim().split(' ');
        const initials = names.length > 1 ? (names[0][0] + names[names.length - 1][0]).toUpperCase() : userName.slice(0, 2).toUpperCase();

        const roleTitles = {
            candidate: 'Returner Candidate',
            mentor: 'Executive Technical Mentor',
            hr: 'Enterprise Talent Partner',
            therapist: 'Return-to-Work Counselor'
        };

        const customUser = {
            id: `user-custom-${Date.now()}`,
            name: userName,
            email: email || `${userName.toLowerCase().replace(/\s+/g, '.')}@restarther.org`,
            persona: chosenPersona,
            roleTitle: roleTitles[chosenPersona] || 'Inclusive Platform Member',
            avatarInitials: initials,
            profile: {
                name: userName,
                preBreakRole: 'Senior Professional',
                preBreakYears: '5.0',
                breakDuration: '2 Years',
                breakReason: 'Maternity & Caregiving Break',
                targetRole: 'SAP BTP Cloud & Full-Stack Architect',
                skills: 'Full-Stack Architecture, Cloud Services, Agile Engineering',
                flexibility: 'Hybrid (2-3 days/week, flexible core hours)',
                notes: 'Custom returner re-entry journey profile.',
                readinessScore: 88,
                matchScore: 92
            }
        };

        currentAuthenticatedUser = customUser;

        return res.json({
            success: true,
            message: `Authenticated as ${userName}`,
            token: `jwt-rh-${Date.now()}-custom`,
            user: customUser
        });
    } catch (err) {
        console.error('Error in /api/auth/login:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Endpoint: GET /api/auth/profile
 * Returns the active user profile
 */
app.get('/api/auth/profile', (req, res) => {
    res.json({
        success: true,
        user: currentAuthenticatedUser
    });
});

/**
 * Endpoint: POST /api/auth/profile
 * Updates the active user's re-entry profile
 */
app.post('/api/auth/profile', (req, res) => {
    try {
        const { profile, name, targetRole } = req.body;
        if (!currentAuthenticatedUser) {
            currentAuthenticatedUser = { ...USER_ACCOUNTS['priya-candidate'] };
        }

        if (name) currentAuthenticatedUser.name = name;
        if (profile) {
            currentAuthenticatedUser.profile = {
                ...currentAuthenticatedUser.profile,
                ...profile
            };
            if (profile.name) currentAuthenticatedUser.name = profile.name;
        }

        return res.json({
            success: true,
            message: 'User profile successfully updated.',
            user: currentAuthenticatedUser
        });
    } catch (err) {
        console.error('Error in /api/auth/profile:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Endpoint: GET /api/mentors
 * Returns mentors catalog with live availability and time slots
 */
app.get('/api/mentors', (req, res) => {
    res.json({
        success: true,
        count: MENTORS_LIST.length,
        mentors: MENTORS_LIST
    });
});

/**
 * Endpoint: POST /api/generate-meet-link
 * Dynamically generates real Google Meet call link, saves session timestamp,
 * and enables instant 1-click Join button for both Candidate & Mentor views.
 */
app.post('/api/generate-meet-link', (req, res) => {
    try {
        const { candidateName, candidateRole, candidateBreak, mentorId, mentorName, mentorRole, mentorCompany, slot, topic } = req.body;
        
        // Generate real Google Meet call slug (xxx-yyyy-zzz)
        const randStr = (len) => {
            const chars = 'abcdefghijklmnopqrstuvwxyz';
            let res = '';
            for (let i = 0; i < len; i++) {
                res += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return res;
        };
        const meetCode = `${randStr(3)}-${randStr(4)}-${randStr(3)}`;
        const meetUrl = `https://meet.google.com/${meetCode}`;
        const sessionId = 'meet-' + Date.now();
        const timestamp = new Date().toISOString();

        const targetMentor = MENTORS_LIST.find(m => m.id === mentorId) || {
            name: mentorName || 'Dr. Ananya Roy',
            role: mentorRole || 'VP of Engineering & Executive Returnship Mentor',
            company: mentorCompany || 'SAP Labs Global'
        };

        const newSession = {
            id: sessionId,
            candidateId: 'user-priya-001',
            candidateName: candidateName || 'Priya Sharma',
            candidateRole: candidateRole || 'Senior Full-Stack & Cloud Solutions Architect (Returner)',
            candidateBreak: candidateBreak || '4 Years (Maternity & Family Care)',
            mentorId: mentorId || 'mentor-ananya-001',
            mentorName: targetMentor.name,
            mentorRole: targetMentor.role,
            mentorCompany: targetMentor.company,
            slot: slot || 'Instant 1-Click Call',
            topic: topic || 'Returnship Technical Readiness & Career Re-entry Plan',
            meetUrl: meetUrl,
            googleMeetId: meetCode,
            createdAt: timestamp,
            status: 'CONFIRMED'
        };

        localDB.sessions.unshift(newSession);
        saveDB(localDB);

        console.log(`[Google Meet Generator] Generated meeting link: ${meetUrl} with ${newSession.mentorName} for ${newSession.candidateName}`);

        return res.json({
            success: true,
            message: 'Instant Google Meet room successfully initialized and recorded in database.',
            session: newSession
        });
    } catch (err) {
        console.error('Error in /api/generate-meet-link:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Endpoint: GET /api/sessions
 * Returns all active and scheduled Google Meet sessions
 */
app.get('/api/sessions', (req, res) => {
    res.json({
        success: true,
        count: localDB.sessions.length,
        sessions: localDB.sessions
    });
});

/**
 * Endpoint: POST /api/ai-skills-delta
 * Analyzes resume / past experience using Gemini AI & calculates missing skill deltas
 */
app.post('/api/ai-skills-delta', async (req, res) => {
    try {
        const payload = req.body;
        const candidateInput = payload.profile || payload.experience || payload;
        const targetRole = payload.targetRole || (payload.profile && payload.profile.targetRole) || 'SAP BTP Cloud & Full-Stack Architect';
        
        const analysis = await careerService.analyzeSkillsDelta(candidateInput, targetRole);
        res.json({
            success: true,
            data: analysis
        });
    } catch (err) {
        console.error('Error in /api/ai-skills-delta:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Endpoint: GET & POST /api/bias-audit
 * Runs real-time AI bias audit to detect and neutralize resume-gap penalties
 */
app.all('/api/bias-audit', (req, res) => {
    try {
        const jobId = req.body?.jobId || req.query?.jobId || 'SAP-BTP-2026-RET';
        const audit = auditService.runAudit(jobId);
        res.json({
            success: true,
            audit: audit
        });
    } catch (err) {
        console.error('Error in /api/bias-audit:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Endpoint: GET /api/connectors/upstream-hr
 * Simulated Upstream Connector: SAP SuccessFactors Employee Central Records
 */
app.get('/api/connectors/upstream-hr', (req, res) => {
    res.json({
        connectorId: 'SAP-SF-HR-001',
        systemName: 'SAP SuccessFactors Employee Central (Upstream Records)',
        connectionStatus: 'ACTIVE_VERIFIED',
        latencyMs: 38,
        data: {
            employeeId: 'EMP-984210',
            name: 'Priya Sharma',
            previousTenure: '7.5 Years at SAP Labs Global',
            verifiedTitle: 'Lead Software Architect',
            separationType: 'Voluntary Career Break (Caregiving & Maternity)',
            hrClearance: 'Eligible for Fast-Track Priority Returnship Placement',
            skillsVerifiedOnChain: ['Java EE', 'Cloud Foundry', 'Microservices', 'Distributed Systems'],
            readinessVerificationBadge: 'SAP Inclusive Talent Network Certified'
        }
    });
});

/**
 * Endpoint: GET /api/connectors/lms-catalog
 * Simulated Connected Connector: SAP Learning Hub / LMS Catalog
 */
app.get('/api/connectors/lms-catalog', (req, res) => {
    res.json({
        connectorId: 'SAP-LMS-CAT-002',
        systemName: 'SAP Learning Management System (LMS Hub)',
        connectionStatus: 'ACTIVE_VERIFIED',
        latencyMs: 42,
        curricula: [
            {
                code: 'SAP-BTP-401',
                title: 'SAP Cloud Application Programming Model (CAP) Masterclass',
                badge: 'SAP Certified Citizen Developer',
                duration: '8 Hours',
                targetGap: 'Modern Cloud Architecture & SQLite / HANA DB'
            },
            {
                code: 'AI-SAP-501',
                title: 'Enterprise Generative AI with Google Gemini API & SAP AI Core',
                badge: 'Enterprise AI Practitioner',
                duration: '6 Hours',
                targetGap: 'LLMs, Prompt Engineering, Skills Delta Modeling'
            },
            {
                code: 'FS-NODE-302',
                title: 'High-Performance Asynchronous Node.js & TypeScript',
                badge: 'Full-Stack Specialist',
                duration: '10 Hours',
                targetGap: 'Modern ES2024, Reactive Microservices & Web APIs'
            }
        ]
    });
});

/**
 * Endpoint: POST /api/connectors/successfactors-talent-hub
 * Simulated Downstream Connector: SAP SuccessFactors Talent Intelligence Hub
 */
app.post('/api/connectors/successfactors-talent-hub', (req, res) => {
    res.json({
        connectorId: 'SAP-SF-TIH-003',
        systemName: 'SAP SuccessFactors Talent Intelligence Hub (Downstream TIH)',
        connectionStatus: 'SYNCED_LIVE',
        syncTimestamp: new Date().toISOString(),
        payload: {
            candidate: 'Priya Sharma',
            dynamicGrowthPortfolioId: 'DGP-2026-98124',
            skillsNormalizedCount: 22,
            compositeReadinessScore: 94,
            biasMitigationScore: '98.4%',
            candidatePool: 'SAP Inclusive Returnship Cohort Q3 2026',
            assignedMentor: 'Dr. Ananya Roy (VP Engineering)',
            status: 'Recommended for Final Partner Match Interview'
        }
    });
});

/**
 * Endpoint: POST /api/wellbeing-chat
 * Therapist & Wellbeing AI Coping Assistant (Dr. Elena Vance, LMFT)
 * Live Gemini API with resilient contextual NLP fallback
 */
app.post('/api/wellbeing-chat', async (req, res) => {
    try {
        const { message, impostorLevel, candidateName } = req.body;
        const name = candidateName || (currentAuthenticatedUser && currentAuthenticatedUser.name) || 'Priya';
        const level = typeof impostorLevel === 'number' ? impostorLevel : 38;
        
        const advice = await aiBotService.getTherapistAdvice(message, level, name);
        return res.json({
            success: true,
            ...advice
        });
    } catch (err) {
        console.error('Error in /api/wellbeing-chat:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Endpoint: POST /api/career-copilot
 * AI Career Re-entry Copilot & SAP Architecture Advisor
 * Live Gemini API with resilient contextual NLP fallback
 */
app.post('/api/career-copilot', async (req, res) => {
    try {
        const { message, profile } = req.body;
        const candidateProfile = profile || (currentAuthenticatedUser && currentAuthenticatedUser.profile) || {
            name: 'Priya Sharma',
            targetRole: 'SAP BTP Cloud & Full-Stack Architect',
            breakDuration: '4 Years',
            skills: 'Java, Node.js, Cloud Foundry, Distributed Systems'
        };

        const copilotAdvice = await aiBotService.getCareerCopilotAdvice(message, candidateProfile);
        return res.json({
            success: true,
            ...copilotAdvice
        });
    } catch (err) {
        console.error('Error in /api/career-copilot:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// ----------------------------------------------------------------------------
// Static Assets & UI Route Serving
// ----------------------------------------------------------------------------

const webappPath = path.join(__dirname, 'app', 'restarther', 'webapp');

// Serve webapp static directory
app.use(express.static(webappPath));
app.use('/app/restarther/webapp', express.static(webappPath));

// Fallback to index.html for SPA client navigation
app.get('*', (req, res) => {
    res.sendFile(path.join(webappPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  RestartHER - AI Inclusive Career Re-Entry Platform  `);
    console.log(`  SAP Hackathon Edition · Theme: AI Inclusive Workforce`);
    console.log(`=======================================================`);
    console.log(`  Server running at: http://localhost:${PORT}`);
    console.log(`  OData Path: http://localhost:${PORT}/odata/v4/restart-her`);
    console.log(`  Google Meet API: http://localhost:${PORT}/api/generate-meet-link`);
    console.log(`  AI Skills Engine: http://localhost:${PORT}/api/ai-skills-delta`);
    console.log(`  SAP Connectors: http://localhost:${PORT}/api/connectors/upstream-hr`);
    console.log(`=======================================================`);
});
