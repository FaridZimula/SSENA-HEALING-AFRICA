const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });

// Configuration
const mongoUri = process.env.MONGODB_URI;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!mongoUri || !supabaseUrl || !supabaseKey) {
    console.error('Missing credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Define MongoDB Schemas (Must match your old index.js)
const Project = mongoose.model('Project', new mongoose.Schema({
    title: String, category: String, description: String, shortDescription: String,
    impact: String, images: [String], icon: String, order: Number, createdAt: Date
}));

const Leader = mongoose.model('Leader', new mongoose.Schema({
    name: String, role: String, bio: String, image: String, type: String, order: Number, createdAt: Date
}));

const Partner = mongoose.model('Partner', new mongoose.Schema({
    name: String, logo: String, order: Number, createdAt: Date
}));

const Donation = mongoose.model('Donation', new mongoose.Schema({
    amount: Number, phone: String, provider: String, email: String, 
    firstName: String, lastName: String, isAnonymous: Boolean, 
    status: String, transactionRef: String, createdAt: Date
}));

const Message = mongoose.model('Message', new mongoose.Schema({
    fullName: String, email: String, subject: String, content: String, createdAt: Date
}));

const Member = mongoose.model('Member', new mongoose.Schema({
    fullName: String, email: String, phoneNumber: String, 
    paymentProofType: String, paymentMessage: String, status: String, createdAt: Date
}));

async function migrate() {
    try {
        console.log('🚀 Starting Migration...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // 1. Projects
        const projects = await Project.find().lean();
        if (projects.length > 0) {
            console.log(`📦 Migrating ${projects.length} Projects...`);
            const mapped = projects.map(p => ({
                title: p.title, category: p.category, description: p.description,
                short_description: p.shortDescription, impact: p.impact,
                images: p.images, icon: p.icon, "order": p.order || 0, created_at: p.createdAt
            }));
            const { error } = await supabase.from('projects').insert(mapped);
            if (error) console.error('❌ Projects error:', error.message);
        }

        // 2. Leaders
        const leaders = await Leader.find().lean();
        if (leaders.length > 0) {
            console.log(`📦 Migrating ${leaders.length} Leaders...`);
            const mapped = leaders.map(l => ({
                name: l.name, role: l.role, bio: l.bio, image: l.image,
                type: l.type, "order": l.order || 0, created_at: l.createdAt
            }));
            const { error } = await supabase.from('leaders').insert(mapped);
            if (error) console.error('❌ Leaders error:', error.message);
        }

        // 3. Partners
        const partners = await Partner.find().lean();
        if (partners.length > 0) {
            console.log(`📦 Migrating ${partners.length} Partners...`);
            const mapped = partners.map(p => ({
                name: p.name, logo: p.logo, "order": p.order || 0, created_at: p.createdAt
            }));
            const { error } = await supabase.from('partners').insert(mapped);
            if (error) console.error('❌ Partners error:', error.message);
        }

        // 4. Donations
        const donations = await Donation.find().lean();
        if (donations.length > 0) {
            console.log(`📦 Migrating ${donations.length} Donations...`);
            const mapped = donations.map(d => ({
                amount: d.amount, phone: d.phone, provider: d.provider, email: d.email,
                first_name: d.firstName, last_name: d.lastName, is_anonymous: d.isAnonymous,
                status: d.status, transaction_ref: d.transactionRef, created_at: d.createdAt
            }));
            const { error } = await supabase.from('donations').insert(mapped);
            if (error) console.error('❌ Donations error:', error.message);
        }

        // 5. Messages
        const messages = await Message.find().lean();
        if (messages.length > 0) {
            console.log(`📦 Migrating ${messages.length} Messages...`);
            const mapped = messages.map(m => ({
                full_name: m.fullName, email: m.email, subject: m.subject,
                content: m.content, created_at: m.createdAt
            }));
            const { error } = await supabase.from('messages').insert(mapped);
            if (error) console.error('❌ Messages error:', error.message);
        }

        // 6. Members
        const members = await Member.find().lean();
        if (members.length > 0) {
            console.log(`📦 Migrating ${members.length} Members...`);
            const mapped = members.map(m => ({
                full_name: m.fullName, email: m.email, phone_number: m.phoneNumber,
                payment_proof_type: m.paymentProofType, payment_message: m.paymentMessage,
                status: m.status, created_at: m.createdAt
            }));
            const { error } = await supabase.from('members').insert(mapped);
            if (error) console.error('❌ Members error:', error.message);
        }

        console.log('🎉 Migration Finished Successfully!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('💥 Migration Failed:', err.message);
        process.exit(1);
    }
}

migrate();
