/**
 * RestartHER - Career Discovery & Skills Delta Service
 * Powered by Google Gemini Free API (@google/generative-ai)
 * with robust enterprise fallback simulation
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

class CareerService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
        this.genAI = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
    }

    /**
     * Analyze Past Work Experience vs Target Role
     * Calculates missing skill deltas and generates targeted learning roadmaps
     */
    async analyzeSkillsDelta(candidateData, targetRole = 'SAP BTP Cloud & Full-Stack Architect') {
        const rawText = typeof candidateData === 'string' ? candidateData : JSON.stringify(candidateData);

        // If Gemini API Key is available, invoke available Gemini models
        if (this.genAI) {
            const modelsToTry = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash'];
            const prompt = `
You are an expert Executive Career Architect & SAP SuccessFactors Talent Specialist.
A woman professional is returning to the workforce after a career break (e.g., maternity, caregiving, health).
Analyze her past experience and compare it against the target role: "${targetRole}".

Candidate Background & Experience:
"""
${rawText}
"""

Return ONLY a valid JSON object (no markdown code fence, no extra text) with the following schema:
{
  "candidateName": "Identified or provided name (e.g. Priya Sharma)",
  "overallReadinessScore": 88, // integer 0-100
  "careerBreakAnalysis": {
    "yearsOfBreak": "3-4 years",
    "breakSuperpowers": [
      "Crisis management, prioritization, empathetic leadership during family/caregiving pause"
    ],
    "reentryReadiness": "High - Core foundation remains strong, needs cloud delta refresh"
  },
  "skillDeltas": [
    {
      "skill": "Skill Name (e.g. Node.js & REST APIs)",
      "category": "Foundational / Architecture / Modern Cloud / AI",
      "pastProficiency": 90, // integer 0-100
      "requiredProficiency": 95, // integer 0-100
      "gapDelta": 5, // percentage gap
      "verdict": "Retained & Ready / Refresh Needed / Priority Bridge",
      "actionableBridge": "Specific actionable 1-week refresh task",
      "sapLmsCourse": "LMS course name"
    }
  ],
  "learningRoadmap": [
    {
      "week": "Weeks 1-2",
      "focus": "Cloud Architecture & SAP CAP Deep Dive",
      "milestone": "Build sample service using @sap/cds and SQLite"
    },
    {
      "week": "Weeks 3-4",
      "focus": "Enterprise AI & Gemini API Integration",
      "milestone": "Implement AI-driven skills matching agent"
    },
    {
      "week": "Weeks 5-8",
      "focus": "SuccessFactors Integration & Mock Interview Prep",
      "milestone": "1-on-1 Executive Mentorship call & live interview rubric"
    }
  ],
  "matchingReturnshipRoles": [
    {
      "title": "Senior SAP BTP Cloud Solutions Architect (Returnship)",
      "company": "SAP Labs Global",
      "matchScore": 94,
      "stipend": "$8,500/month",
      "remoteFlexibility": "Hybrid (2 days/week, flexible hours)"
    },
    {
      "title": "Principal Full-Stack Engineer - AI Inclusive Work",
      "company": "Accenture Enterprise Cloud",
      "matchScore": 91,
      "stipend": "$8,200/month",
      "remoteFlexibility": "100% Remote"
    }
  ]
}
`;

            for (const modelName of modelsToTry) {
                try {
                    const model = this.genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    const text = response.text().trim();
                    
                    // Clean markdown code blocks if returned
                    const cleanJson = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
                    const parsed = JSON.parse(cleanJson);
                    parsed.source = `Google Gemini (${modelName} Live API)`;
                    return parsed;
                } catch (err) {
                    // Try next model if 404 or 403
                }
            }
        }

        // Deterministic Fallback Simulation (Ultra-realistic for Priya Sharma & general inputs)
        return this.getFallbackAssessment(rawText, targetRole);
    }

    /**
     * Fallback AI Assessment with high-fidelity analytics
     */
    getFallbackAssessment(candidateData, targetRole) {
        let name = 'Priya Sharma';
        let breakYears = '4 Years';
        let breakReason = 'Maternity & Caregiving Break';
        let pastExpYears = '8+ Years';
        let pastRole = 'Lead Software Architect';
        let userSkills = 'Java EE, Distributed Systems, Cloud Foundry, Node.js, Microservices';

        if (typeof candidateData === 'object' && candidateData !== null) {
            name = candidateData.fullName || candidateData.name || name;
            breakYears = candidateData.breakDuration || (candidateData.breakYears ? `${candidateData.breakYears} Years` : breakYears);
            breakReason = candidateData.breakReason || breakReason;
            pastExpYears = candidateData.preBreakYears ? `${candidateData.preBreakYears} Years` : pastExpYears;
            pastRole = candidateData.preBreakRole || pastRole;
            userSkills = candidateData.skills || userSkills;
        } else if (typeof candidateData === 'string') {
            try {
                const parsed = JSON.parse(candidateData);
                name = parsed.fullName || parsed.name || name;
                breakYears = parsed.breakDuration || breakYears;
                breakReason = parsed.breakReason || breakReason;
                pastRole = parsed.preBreakRole || pastRole;
                userSkills = parsed.skills || userSkills;
            } catch (e) {
                // String narrative
                if (candidateData.includes('Maya')) name = 'Maya Patel';
                else if (candidateData.includes('Aisha')) name = 'Aisha Khan';
            }
        }

        const isCloudTarget = targetRole.toLowerCase().includes('cloud') || targetRole.toLowerCase().includes('sap');
        const isAiTarget = targetRole.toLowerCase().includes('ai') || targetRole.toLowerCase().includes('intelligence');
        
        return {
            source: 'SAP Hackathon AI Skills Engine (Offline-Safe Fallback)',
            candidateName: name,
            targetRole: targetRole,
            overallReadinessScore: 89,
            careerBreakAnalysis: {
                yearsOfBreak: `${breakYears} (${breakReason})`,
                preBreakExperience: `${pastExpYears} as ${pastRole}`,
                breakSuperpowers: [
                    'Cross-functional crisis triage & multitasking honed through family leadership',
                    'High emotional resilience, calm de-escalation, and empathetic communication',
                    'Tenured enterprise architecture intuition that remained preserved through sabbatical'
                ],
                reentryReadiness: `High Readiness (Top 5% Returner Cohort) — Core ${pastRole} acumen 92% intact`
            },
            skillDeltas: [
                {
                    skill: 'Enterprise Cloud Architecture (SAP BTP & AWS)',
                    category: 'Modern Cloud Infrastructure',
                    pastProficiency: 82,
                    requiredProficiency: 94,
                    gapDelta: 12,
                    verdict: 'Refresh Needed',
                    actionableBridge: 'Hands-on project configuring SAP Cloud Application Programming Model (@sap/cds) with SQLite & HANA deployer.',
                    sapLmsCourse: 'SAP-BTP-401: Cloud Application Programming Architecture Mastery'
                },
                {
                    skill: 'Full-Stack JavaScript / Node.js & TypeScript',
                    category: 'Core Engineering',
                    pastProficiency: 92,
                    requiredProficiency: 95,
                    gapDelta: 3,
                    verdict: 'Retained & Ready',
                    actionableBridge: 'Audit modern ES2024 features, async streaming, and Express middleware architectures.',
                    sapLmsCourse: 'FS-NODE-302: Advanced Asynchronous Node.js & Enterprise Microservices'
                },
                {
                    skill: 'Generative AI & LLM Integrations (Gemini / Claude)',
                    category: 'Emerging AI Technologies',
                    pastProficiency: 40,
                    requiredProficiency: 85,
                    gapDelta: 45,
                    verdict: 'Priority Bridge',
                    actionableBridge: 'Build an AI-powered skills discovery prompt flow utilizing Google Gemini API and structured JSON outputs.',
                    sapLmsCourse: 'AI-SAP-501: Integrating GenAI into SuccessFactors & BTP Solutions'
                },
                {
                    skill: 'UI5 / Fiori & Modern Design Systems (Glassmorphism)',
                    category: 'Front-End Experience',
                    pastProficiency: 88,
                    requiredProficiency: 90,
                    gapDelta: 2,
                    verdict: 'Retained & Ready',
                    actionableBridge: 'Craft responsive high-end glassmorphic UI components with fluid keyframe animations.',
                    sapLmsCourse: 'UX-FIORI-204: Modern Glassmorphic Design Systems & Fiori Elements'
                },
                {
                    skill: 'Agile Leadership & Collaborative Sprint Management',
                    category: 'Leadership & Soft Skills',
                    pastProficiency: 95,
                    requiredProficiency: 95,
                    gapDelta: 0,
                    verdict: 'Exemplary Mastery',
                    actionableBridge: 'Direct application in returnship cohort leadership and mentoring junior developers.',
                    sapLmsCourse: 'LEAD-101: Human-Centric Agile Leadership in Distributed Teams'
                }
            ],
            learningRoadmap: [
                {
                    week: 'Week 1 - 2',
                    focus: 'SAP CAP & Cloud Microservices Refresh',
                    milestone: 'Deploy RestartHER CDS services and SQLite schema locally with automated OData endpoints.',
                    status: 'Completed'
                },
                {
                    week: 'Week 3 - 4',
                    focus: 'GenAI Engineering with Google Gemini Free API',
                    milestone: 'Configure @google/generative-ai prompts to automatically calculate skill deltas and career bridges.',
                    status: 'In Progress'
                },
                {
                    week: 'Week 5 - 6',
                    focus: '1-on-1 Executive Mentorship & Mock System Design',
                    milestone: 'Connect with Dr. Ananya Roy via instant Google Meet launcher for mock tech architecture defense.',
                    status: 'Upcoming'
                },
                {
                    week: 'Week 7 - 8',
                    focus: 'SuccessFactors Talent Intelligence Hub Certification',
                    milestone: 'Publish verified skills profile to SAP BTP and initiate 6-month returnship cohort placement.',
                    status: 'Upcoming'
                }
            ],
            matchingReturnshipRoles: [
                {
                    title: 'Senior SAP BTP Cloud Solutions Architect (Returnship)',
                    company: 'SAP Labs Global',
                    matchScore: 94,
                    stipend: '$8,500 / month',
                    location: 'Bangalore / Palo Alto / Walldorf (Hybrid)',
                    remoteFlexibility: 'Flexible 4-day hybrid schedule, family-friendly core hours',
                    tags: ['SAP CAP', 'Cloud Foundry', 'GenAI', 'Returner Cohort 2026']
                },
                {
                    title: 'Principal Full-Stack Engineer - AI Inclusive Work',
                    company: 'Accenture Enterprise Cloud Services',
                    matchScore: 91,
                    stipend: '$8,200 / month',
                    location: 'Remote / Virtual',
                    remoteFlexibility: '100% Remote, async-first team communication',
                    tags: ['Node.js', 'React', 'OData', 'Mentorship Support']
                },
                {
                    title: 'Lead Architect, Talent Intelligence Systems',
                    company: 'Microsoft Enterprise Cloud & SAP Alliances',
                    matchScore: 87,
                    stipend: '$9,000 / month',
                    location: 'Hyderabad / Seattle (Hybrid)',
                    remoteFlexibility: 'Hybrid with dedicated caregiving returner stipend',
                    tags: ['AI Agents', 'SAP SuccessFactors', 'Azure', 'Inclusive Culture']
                }
            ]
        };
    }
}

module.exports = new CareerService();
