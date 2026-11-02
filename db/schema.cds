namespace sap.hackathon.restarther;

using { cuid, managed } from '@sap/cds/common';

/**
 * User Personas in the Platform
 * - CANDIDATE (Returner)
 * - MENTOR (Executive / Engineering Mentor)
 * - HR_PARTNER (Talent Acquisition / Bias Auditor)
 * - THERAPIST (Return-to-Work Wellbeing Coach)
 */
type UserRole : String enum {
    CANDIDATE;
    MENTOR;
    HR_PARTNER;
    THERAPIST;
    ADMIN;
};

type BreakReason : String enum {
    MATERNITY_CAREGIVING;
    FAMILY_CARE;
    HEALTH_WELLNESS;
    EDUCATION_CAREER_PIVOT;
    RELOCATION;
    OTHER;
};

type SessionStatus : String enum {
    REQUESTED;
    CONFIRMED;
    IN_PROGRESS;
    COMPLETED;
    CANCELLED;
};

type BiasRiskLevel : String enum {
    LOW;
    MEDIUM;
    HIGH;
    CRITICAL;
};

/**
 * Users Entity
 */
entity Users : cuid, managed {
    email            : String(100) not null;
    fullName         : String(100) not null;
    role             : UserRole default 'CANDIDATE';
    headline         : String(200);
    bio              : String(1000);
    avatarUrl        : String(500);
    careerBreakYears : Decimal(3,1) default 0.0;
    breakReason      : BreakReason default 'MATERNITY_CAREGIVING';
    breakNarrative   : LargeString;
    readinessScore   : Integer default 0; // 0 to 100%
    location         : String(100);
    targetRoleTitle  : String(100);
    
    // Associations
    workExperiences  : Composition of many WorkExperiences on workExperiences.user = $self;
    skillGaps        : Composition of many SkillGaps on skillGaps.user = $self;
    bookedSessions   : Association to many MentorshipSessions on bookedSessions.candidate = $self;
    wellbeingChecks  : Composition of many WellbeingAssessments on wellbeingChecks.user = $self;
}

/**
 * Work Experience Entity
 * Tracks past roles prior to career pause, achievements, technologies used
 */
entity WorkExperiences : cuid, managed {
    user             : Association to Users;
    companyName      : String(100) not null;
    jobTitle         : String(100) not null;
    startDate        : Date;
    endDate          : Date;
    isPreBreak       : Boolean default true;
    skillsUsed       : String(500); // Comma-separated or JSON
    responsibilities : LargeString;
    verifiedByHR     : Boolean default false; // Verified via Upstream SAP HR Connector
}

/**
 * Target Roles Entity
 * Industry benchmarks & role requirements (e.g. SAP BTP Cloud Architect, Senior Full Stack Engineer)
 */
entity TargetRoles : cuid, managed {
    title            : String(100) not null;
    department       : String(100);
    experienceLevel  : String(50);
    description      : LargeString;
    requiredSkills   : LargeString; // JSON array of skills with proficiency weights
    preferredSkills  : LargeString;
    avgSalaryRange   : String(100);
    demandIndex      : Decimal(3,1) default 9.5;
    isReturnshipFriendly : Boolean default true;
}

/**
 * Skill Gaps & Delta Analysis Entity
 * Calculated via Gemini AI & Career Discovery Agent
 */
entity SkillGaps : cuid, managed {
    user             : Association to Users;
    targetRole       : Association to TargetRoles;
    skillName        : String(100) not null;
    category         : String(50); // Cloud, Architecture, AI, Soft Skills
    pastProficiency  : Integer default 0; // 0-100%
    requiredProficiency : Integer default 100;
    deltaPercentage  : Integer default 0; // e.g. 35% gap
    recommendedAction: LargeString;
    lmsCourseCode    : String(50); // LMS Connected Course link
    lmsCourseTitle   : String(200);
    estimatedWeeks   : Integer default 2;
    isCompleted      : Boolean default false;
}

/**
 * Mentors Entity
 */
entity Mentors : cuid, managed {
    user             : Association to Users;
    currentCompany   : String(100);
    jobTitle         : String(100);
    specialty        : String(200);
    yearsExperience  : Integer;
    menteeCount      : Integer default 0;
    rating           : Decimal(2,1) default 5.0;
    availabilityStatus: String(50) default 'Available Now';
    availableSlots   : LargeString; // JSON array of upcoming slots
    googleMeetEmail  : String(100);
    sessions         : Association to many MentorshipSessions on sessions.mentor = $self;
}

/**
 * Mentorship Sessions & Google Meet Integrations
 */
entity MentorshipSessions : cuid, managed {
    candidate        : Association to Users;
    mentor           : Association to Mentors;
    scheduledAt      : DateTime;
    topic            : String(200);
    notes            : LargeString;
    meetUrl          : String(500); // Instant Google Meet link: https://meet.google.com/xxx-yyyy-zzz
    googleMeetId     : String(100);
    status           : SessionStatus default 'CONFIRMED';
    candidateNotes   : LargeString;
    mentorFeedback   : LargeString;
    readinessScoreImpact : Integer default +5;
}

/**
 * Companies & Returnship Opportunities Entity
 */
entity Companies : cuid, managed {
    name             : String(100) not null;
    industry         : String(100);
    logoUrl          : String(500);
    returnshipProgramName : String(200);
    isInclusiveCertified : Boolean default true;
    biasMitigationScore   : Decimal(4,1) default 98.4;
    successFactorsPartnerId : String(50);
    jobs             : Composition of many ReturnshipJobs on jobs.company = $self;
}

/**
 * Returnship Jobs Entity
 */
entity ReturnshipJobs : cuid, managed {
    company          : Association to Companies;
    title            : String(100) not null;
    location         : String(100);
    employmentType   : String(50) default 'Returnship to Permanent';
    cohortStartDate  : Date;
    durationMonths   : Integer default 6;
    stipend          : String(50);
    minBreakYears    : Decimal(3,1) default 1.0;
    skillsRequired   : LargeString;
    sapMatchScore    : Integer default 92; // AI match percentage
    openSlots        : Integer default 5;
    status           : String(50) default 'Actively Interviewing';
}

/**
 * AI Bias Audits Entity (For HR & Enterprise Partner Dashboard)
 * Detects resume-gap penalties, maternal bias, ageism in applicant filtering
 */
entity BiasAudits : cuid, managed {
    job              : Association to ReturnshipJobs;
    auditTimestamp   : DateTime;
    totalAuditedCandidates : Integer default 124;
    careerBreakCandidates  : Integer default 78;
    preAuditShortlistRate  : Decimal(4,1); // e.g. 14.2% (penalized for gaps)
    postAuditShortlistRate : Decimal(4,1); // e.g. 76.5% (skills-first normalized)
    detectedBiasFlags      : LargeString; // JSON breakdown: Gap penalty, keyword mismatch
    mitigationActionsApplied: LargeString; // JSON: Anonymized career break years, skill delta weighting
    complianceGrade        : String(10) default 'A+';
    sapTalentHubSynced     : Boolean default true;
}

/**
 * Wellbeing Assessments Entity (Therapist & Wellbeing Coach Portal)
 */
entity WellbeingAssessments : cuid, managed {
    user             : Association to Users;
    assessmentDate   : DateTime;
    impostorSyndromeLevel : Integer default 45; // 0-100 scale
    workLifeReadinessScore: Integer default 80;
    confidenceTrajectory  : Integer default 75;
    practicalConstraints : LargeString; // JSON: Childcare, Elder care, Remote commute
    aiAffirmationsSummary : LargeString; // Generated by Gemini AI
    counselorNotes        : LargeString;
}
