
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

const mongoUri = process.env.MONGODB_URI;

const projectSchema = new mongoose.Schema({
    title: String,
    images: [String]
});

const Project = mongoose.model('Project', projectSchema);

async function checkData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('Connected.');

        const projects = await Project.find();
        console.log(`Found ${projects.length} projects:`);
        
        projects.forEach(p => {
            console.log(`- Title: "${p.title}" | Images: ${p.images ? p.images.length : 'UNDEFINED'}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkData();
