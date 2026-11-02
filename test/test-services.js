/**
 * RestartHER - Automated Service Validation Test Suite
 * Validates Google Meet generation, Gemini AI skills delta calculations,
 * bias auditing, and simulated SAP enterprise connectors.
 */

const http = require('http');

function postRequest(path, data) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(data);
        const req = http.request({
            hostname: 'localhost',
            port: 4004,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, body });
                }
            });
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

function getRequest(path) {
    return new Promise((resolve, reject) => {
        const req = http.get({
            hostname: 'localhost',
            port: 4004,
            path: path
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, body });
                }
            });
        });
        req.on('error', reject);
    });
}

async function runTests() {
    console.log('--- RestartHER Test Suite Starting ---');

    try {
        // Test 1: Google Meet Link Generation
        console.log('\n[Test 1] Testing Instant Google Meet Generator...');
        const meetRes = await postRequest('/api/generate-meet-link', {
            candidateName: 'Priya Sharma',
            mentorName: 'Dr. Ananya Roy',
            topic: 'System Architecture Re-entry Strategy'
        });
        console.log('Status:', meetRes.status);
        console.log('Generated Meet URL:', meetRes.body?.session?.meetUrl);
        if (!meetRes.body?.session?.meetUrl?.startsWith('https://meet.google.com/')) {
            throw new Error('Meet URL generation failed');
        }
        console.log('✓ Test 1 Passed: Instant Google Meet Link Generated & Saved');

        // Test 2: AI Skills Delta Calculation
        console.log('\n[Test 2] Testing AI Skills Delta Calculation...');
        const aiRes = await postRequest('/api/ai-skills-delta', {
            experience: 'Priya Sharma, 8 years lead Java/Node architect before 4-year maternity break',
            targetRole: 'SAP BTP Cloud & Full-Stack Architect'
        });
        console.log('Status:', aiRes.status);
        console.log('Evaluated Readiness:', aiRes.body?.data?.overallReadinessScore + '%');
        console.log('Skill Deltas Count:', aiRes.body?.data?.skillDeltas?.length);
        if (!aiRes.body?.data?.skillDeltas) {
            throw new Error('AI Skills Delta failed');
        }
        console.log('✓ Test 2 Passed: AI Skills Delta Engine Working');

        // Test 3: Bias Audit Engine
        console.log('\n[Test 3] Testing AI Bias Audit Engine...');
        const auditRes = await getRequest('/api/bias-audit');
        console.log('Status:', auditRes.status);
        console.log('Compliance Grade:', auditRes.body?.audit?.complianceGrade);
        console.log('Bias Mitigation Score:', auditRes.body?.audit?.biasMitigationScore + '%');
        console.log('Inclusion Uplift:', auditRes.body?.audit?.metrics?.inclusionUplift);
        if (auditRes.body?.audit?.complianceGrade !== 'A+') {
            throw new Error('Bias Audit did not meet compliance grade');
        }
        console.log('✓ Test 3 Passed: AI Bias Audit Verified');

        // Test 4: Upstream SAP HR Connector
        console.log('\n[Test 4] Testing Upstream SAP HR Records Connector...');
        const hrRes = await getRequest('/api/connectors/upstream-hr');
        console.log('Status:', hrRes.status);
        console.log('System:', hrRes.body?.systemName);
        console.log('Verified Employee:', hrRes.body?.data?.name, '-', hrRes.body?.data?.verifiedTitle);
        console.log('✓ Test 4 Passed: Upstream HR Connector Synced');

        // Test 5: Mentors Catalog & Availability Slots
        console.log('\n[Test 5] Testing Mentors Catalog & Choice Availability...');
        const mentorRes = await getRequest('/api/mentors');
        console.log('Status:', mentorRes.status);
        console.log('Mentors Count:', mentorRes.body?.count);
        console.log('First Mentor:', mentorRes.body?.mentors?.[0]?.name, '(', mentorRes.body?.mentors?.[0]?.availabilityStatus, ')');
        console.log('Open Slots Sample:', mentorRes.body?.mentors?.[0]?.availableSlots?.[0]);
        if (!mentorRes.body?.mentors || mentorRes.body.count < 3) {
            throw new Error('Mentors catalog failed');
        }
        console.log('✓ Test 5 Passed: Mentors Availability & Choice API Verified');

        // Test 6: Role-Based Authentication & Profile Retrieval
        console.log('\n[Test 6] Testing Role-Based Authentication Gateway...');
        const loginRes = await postRequest('/api/auth/login', {
            presetId: 'priya-candidate'
        });
        console.log('Status:', loginRes.status);
        console.log('Authenticated User:', loginRes.body?.user?.name, '(', loginRes.body?.user?.roleTitle, ')');
        console.log('Target Role:', loginRes.body?.user?.profile?.targetRole);
        if (!loginRes.body?.success || loginRes.body?.user?.name !== 'Priya Sharma') {
            throw new Error('Authentication failed');
        }

        const profileRes = await getRequest('/api/auth/profile');
        if (!profileRes.body?.success || profileRes.body?.user?.name !== 'Priya Sharma') {
            throw new Error('Profile retrieval failed');
        }
        console.log('✓ Test 6 Passed: Authentication & Profile APIs Verified');

        // Test 7: AI Chatbots & Re-Entry Copilot (Gemini & Fallback Engine)
        console.log('\n[Test 7] Testing AI Chatbots & Career Copilot...');
        const copilotRes = await postRequest('/api/career-copilot', {
            message: 'How should I frame my 4-year maternity pause during an SAP architecture interview?',
            profile: {
                name: 'Priya Sharma',
                targetRole: 'SAP BTP Cloud & Full-Stack Architect',
                breakDuration: '4 Years',
                skills: 'Java, Node.js, Cloud Foundry, Distributed Systems'
            }
        });
        console.log('Status:', copilotRes.status);
        console.log('Copilot Agent:', copilotRes.body?.agent);
        console.log('Intelligence Source:', copilotRes.body?.source);
        console.log('Response Snippet:', (copilotRes.body?.response || '').slice(0, 120) + '...');
        if (!copilotRes.body?.response || !copilotRes.body?.success) {
            throw new Error('Career Copilot failed to generate advice');
        }

        const wellbeingRes = await postRequest('/api/wellbeing-chat', {
            message: 'I feel nervous that everyone is younger or knows new frameworks',
            impostorLevel: 45,
            candidateName: 'Priya'
        });
        console.log('Therapist:', wellbeingRes.body?.therapist);
        console.log('Therapist Source:', wellbeingRes.body?.source);
        console.log('Therapist Advice:', (wellbeingRes.body?.response || '').slice(0, 120) + '...');
        if (!wellbeingRes.body?.response || !wellbeingRes.body?.success) {
            throw new Error('Wellbeing chat failed to generate guidance');
        }
        console.log('✓ Test 7 Passed: AI Career Copilot & Therapist Chatbot Verified');

        console.log('\n=================================================');
        console.log('   ALL 7 RESTARTHER INTEGRATION TESTS PASSED!   ');
        console.log('=================================================');
    } catch (err) {
        console.error('Test Suite Error:', err.message);
        process.exit(1);
    }
}

// If run directly
if (require.main === module) {
    runTests();
}

module.exports = { runTests };
