const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });

const API_URL = `http://localhost:${process.env.PORT || 5000}/api`;

async function testAPI() {
    console.log('🧪 Starting API Verification Tests...');
    console.log(`Base URL: ${API_URL}`);

    try {
        // 1. Status
        const status = await axios.get(`${API_URL}/status`);
        console.log('✅ GET /status:', status.data.message);

        // 2. Projects
        const projects = await axios.get(`${API_URL}/projects`);
        console.log(`✅ GET /projects: Found ${projects.data.length} projects`);

        // 3. Leaders
        const leaders = await axios.get(`${API_URL}/leaders`);
        console.log(`✅ GET /leaders: Found ${leaders.data.length} leaders`);

        // 4. Partners
        const partners = await axios.get(`${API_URL}/partners`);
        console.log(`✅ GET /partners: Found ${partners.data.length} partners`);

        // 5. Post Message
        const messageRes = await axios.post(`${API_URL}/messages`, {
            fullName: "Test User",
            email: "test@example.com",
            subject: "Test Subject",
            content: "Test Content"
        });
        console.log('✅ POST /messages:', messageRes.data.message);

        // 6. Register Member
        const regRes = await axios.post(`${API_URL}/register`, {
            fullName: "Test Member",
            email: "member@example.com",
            phoneNumber: "0700000000",
            paymentProofType: "TEST",
            paymentMessage: "Test registration"
        });
        console.log('✅ POST /register:', regRes.data.message);

        // 7. Donation (Initiate)
        const donationRes = await axios.post(`${API_URL}/donate`, {
            amount: 1000,
            phone: "0700000000",
            provider: "test",
            email: "donor@example.com",
            firstName: "Test",
            lastName: "Donor",
            isAnonymous: false
        });
        console.log('✅ POST /donate:', donationRes.data.message);

        console.log('\n🎉 ALL API TESTS PASSED!');
    } catch (error) {
        console.error('❌ API TEST FAILED');
        if (error.response) {
            console.error('Response Error:', error.response.data);
            console.error('Status:', error.response.status);
        } else {
            console.error('Error Message:', error.message);
        }
        process.exit(1);
    }
}

testAPI();
