using { sap.hackathon.restarther as my } from '../db/schema';

service RestartHERService @(path: '/odata/v4/restart-her') {

    // Read & Write Access for Platform Entities
    @odata.draft.enabled: false
    entity Users as projection on my.Users;

    entity WorkExperiences as projection on my.WorkExperiences;
    entity TargetRoles as projection on my.TargetRoles;
    entity SkillGaps as projection on my.SkillGaps;
    entity Mentors as projection on my.Mentors;
    entity MentorshipSessions as projection on my.MentorshipSessions;
    entity Companies as projection on my.Companies;
    entity ReturnshipJobs as projection on my.ReturnshipJobs;
    entity BiasAudits as projection on my.BiasAudits;
    entity WellbeingAssessments as projection on my.WellbeingAssessments;

    // ------------------------------------------------------------------------
    // Custom Actions & Automated Endpoints
    // ------------------------------------------------------------------------

    /**
     * Dynamically generates an instant Google Meet room, schedules a session,
     * stores timestamp and URL in SQLite, and returns session details.
     */
    action generateMeetLink(
        candidateId : UUID,
        mentorId    : UUID,
        topic       : String
    ) returns MentorshipSessions;

    /**
     * Calls Gemini AI / Skills Discovery Engine to evaluate past work experience,
     * calculate missing skill deltas for target roles, and recommend LMS paths.
     */
    action analyzeSkillsDelta(
        candidateId     : UUID,
        targetRoleTitle : String,
        rawExperience   : LargeString
    ) returns LargeString;

    /**
     * Executes AI Bias Audit against job applicant pool,
     * neutralizing career break penalties and evaluating fairness.
     */
    action runBiasAudit(
        jobId : UUID
    ) returns BiasAudits;

    /**
     * Simulated Upstream Connector: SAP ERP / Employee Central Records
     */
    function getUpstreamEmployeeRecords(
        employeeEmail : String
    ) returns LargeString;

    /**
     * Simulated Connected Connector: SAP Learning Management System (LMS)
     */
    function getLmsCatalog(
        skillCategory : String
    ) returns LargeString;

    /**
     * Simulated Downstream Connector: SAP SuccessFactors Talent Intelligence Hub
     */
    action syncToSuccessFactors(
        candidateId : UUID
    ) returns LargeString;

    /**
     * AI Mindful Coping Assistant (Therapist Persona)
     */
    action getWellbeingGuidance(
        impostorLevel  : Integer,
        primaryConcern : String,
        breakDuration  : String
    ) returns LargeString;
}
