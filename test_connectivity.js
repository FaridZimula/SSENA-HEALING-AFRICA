async function testConnection() {
    const backendUrl = 'http://localhost:5000/api/status';
    console.log(`Testing connectivity to local backend at ${backendUrl}...`);
    try {
        const response = await fetch(backendUrl);
        console.log('Backend responded with status:', response.status);
        const data = await response.json();
        console.log('Backend status message:', data.message);
        console.log('✅ BACKEND IS REACHABLE');
    } catch (error) {
        console.error('❌ BACKEND CONNECTION FAILED');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.log('\nPossible causes:');
        console.log('1. The backend server is NOT running.');
        console.log('2. The backend is running on a DIFFERENT port.');
        console.log('3. Firewall or proxy is blocking http://localhost:5000');
    }
}

testConnection();
