const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function test() {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI.split('@')[1]); // Log host only
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Successfully connected!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Connection failed:', err.message);
    }
}
test();
