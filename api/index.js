import mongoose from 'mongoose';
import axios from 'axios';
import crypto from 'crypto';

// MongoDB Connection Cache
let cachedDb = null;

const connectToDatabase = async (uri) => {
    if (cachedDb && mongoose.connection.readyState === 1) return;

    if (!uri) throw new Error('MONGODB_URI is not defined in environment variables');

    console.log('Connecting to MongoDB...');
    try {
        cachedDb = await mongoose.connect(uri);
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
};

// Donation Schema
const donationSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    phone: { type: String, required: false },
    provider: { type: String, required: true },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    isAnonymous: { type: Boolean, default: false },
    status: { type: String, default: 'PENDING' },
    transactionRef: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);

// Member Schema
const memberSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true }, // Contact phone
    paymentPhone: { type: String }, // Phone used for mobile money
    provider: { type: String },
    amount: { type: Number, default: 10000 },
    status: { type: String, default: 'PENDING' },
    transactionRef: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);

// Project Schema
const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String },
    description: { type: String },
    shortDescription: { type: String },
    impact: { type: String },
    images: [String],
    icon: { type: String },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

// Leader Schema
const leaderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String },
    image: { type: String },
    type: { type: String, enum: ['LEADER', 'BOARD'], default: 'LEADER' },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Leader = mongoose.models.Leader || mongoose.model('Leader', leaderSchema);

// Partner Schema
const partnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Partner = mongoose.models.Partner || mongoose.model('Partner', partnerSchema);

// Helper to process MarzPay payment
const processMarzPayPayment = async (amount, phone, provider, env) => {
    // Fallback values for Vercel env issues
    const apiUrl = env.MARZ_PAY_API_URL || "https://wallet.wearemarz.com/api/v1";
    const apiKey = env.MARZ_PAY_API_KEY || "marz_ndmGyml5LbyynXLF";
    const authHeader = env.MARZ_PAY_AUTH_HEADER || "bWFyel9uZG1HeW1sNUxieXluWExGOkVNSkNpT1FLeTNSZ1JXb2Z0dUJTMEpiNkxUR2JvbHZz";

    if (!env.MARZ_PAY_API_URL) console.log('Using hardcoded MarzPay API URL');

    // Format phone number to +256XXXXXXXXX
    let formattedPhone = phone;
    if (phone.startsWith('0')) {
        formattedPhone = '+256' + phone.substring(1);
    } else if (phone.startsWith('7')) {
        formattedPhone = '+256' + phone;
    } else if (phone.startsWith('256')) {
        formattedPhone = '+' + phone;
    }

    try {
        const endpoint = `${apiUrl}/collect-money`.replace(/([^:]\/)\/+/g, "$1");
        const payload = {
            amount: parseInt(amount),
            phone_number: formattedPhone,
            provider: provider.toUpperCase(),
            currency: 'UGX',
            country: 'UG',
            description: 'Donation to SUYEL',
            reference: crypto.randomUUID(),
            callback_url: 'https://suyel.org/api/payments/callback'
        };

        const response = await axios.post(endpoint, payload, {
            headers: {
                'Authorization': `Basic ${authHeader}`,
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json'
            },
            timeout: 60000
        });

        return response.data;
    } catch (error) {
        console.error('MarzPay API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || error.message);
    }
};

// Main Vercel Handler
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Normalize path (handle /api/donate and /donate)
    const url = req.url || '';
    const path = url.split('?')[0].replace('/api', '');

    const VERSION = "1.0.9 - Total Fix";

    try {
        // Fallback for debugging Vercel env issues
        const mongoUri = process.env.MONGODB_URI || "mongodb+srv://suyel_admin:SuyelAdmin2026%21@cluster0.qlvgg2q.mongodb.net/suyel_db?retryWrites=true&w=majority&appName=Cluster0";

        if (!process.env.MONGODB_URI) {
            console.log('Using hardcoded fallback URI');
        }

        await connectToDatabase(mongoUri);

        // ROUTE: GET /status
        if (path === '/status' && req.method === 'GET') {
            return res.status(200).json({
                status: 'Online',
                message: 'SUYEL API is active',
                database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
                timestamp: new Date().toISOString()
            });
        }

        // ROUTE: POST /donate
        if (path === '/donate' && req.method === 'POST') {
            const { amount, phone, provider } = req.body;

            let paymentStatus = 'PENDING';
            let transactionRef = null;

            if (provider === 'mtn' || provider === 'airtel') {
                try {
                    const paymentResult = await processMarzPayPayment(amount, phone, provider, process.env);
                    transactionRef = paymentResult.transaction_id || paymentResult.reference;
                    paymentStatus = 'INITIATED';
                } catch (paymentErr) {
                    console.error('Payment Error:', paymentErr.message);
                    return res.status(400).json({ error: paymentErr.message });
                }
            }

            const donationData = { ...req.body, status: paymentStatus, transactionRef };
            const newDonation = new Donation(donationData);
            await newDonation.save();

            return res.status(201).json({
                message: 'Donation initiated',
                donationId: newDonation._id,
                status: paymentStatus,
                transactionRef: transactionRef
            });
        }

        // ROUTE: POST /register
        if (path === '/register' && req.method === 'POST') {
            const { fullName, email, phoneNumber, paymentPhone, provider } = req.body;
            const amount = 10000;

            let paymentStatus = 'PENDING';
            let transactionRef = null;

            if (provider === 'mtn' || provider === 'airtel') {
                try {
                    const paymentResult = await processMarzPayPayment(amount, paymentPhone, provider, process.env);
                    transactionRef = paymentResult.transaction_id || paymentResult.reference;
                    paymentStatus = 'INITIATED';
                } catch (paymentErr) {
                    console.error('Registration Payment Error:', paymentErr.message);
                    return res.status(400).json({ error: paymentErr.message });
                }
            }

            const memberData = {
                fullName,
                email,
                phoneNumber,
                paymentPhone,
                provider,
                amount,
                status: paymentStatus,
                transactionRef
            };
            const newMember = new Member(memberData);
            await newMember.save();

            return res.status(201).json({
                message: 'Registration initiated',
                memberId: newMember._id,
                status: paymentStatus,
                transactionRef: transactionRef
            });
        }

        // ROUTE: GET /register/status
        if (path === '/register/status' && req.method === 'GET') {
            const { id } = req.query;
            if (!id) return res.status(400).json({ error: 'Member ID required' });

            const member = await Member.findById(id);
            if (!member) return res.status(404).json({ error: 'Member not found' });

            return res.status(200).json({ status: member.status });
        }

        // ROUTE: POST /payments/callback
        if (path === '/payments/callback' && req.method === 'POST') {
            const { transaction_id, status, reference } = req.body;
            console.log('Payment Callback Received:', req.body);

            const searchRef = transaction_id || reference;
            const newStatus = status === 'SUCCESS' ? 'SUCCESSFUL' : 'FAILED';

            // Check Donations
            const donation = await Donation.findOne({ transactionRef: searchRef });
            if (donation) {
                donation.status = newStatus;
                await donation.save();
                console.log(`Donation ${donation._id} updated to ${newStatus}`);
                return res.status(200).send('OK');
            }

            // Check Members
            const member = await Member.findOne({ transactionRef: searchRef });
            if (member) {
                member.status = newStatus;
                await member.save();
                console.log(`Member ${member._id} updated to ${newStatus}`);
                return res.status(200).send('OK');
            }

            return res.status(404).send('Transaction not found');
        }

        // ROUTE: GET /admin/members
        if (path === '/admin/members' && req.method === 'GET') {
            const members = await Member.find().sort({ createdAt: -1 });
            return res.status(200).json(members);
        }

        // CONTENT MANAGEMENT ROUTES

        // Projects
        if (path === '/projects' && req.method === 'GET') {
            const projects = await Project.find().sort({ order: 1, createdAt: -1 });
            return res.status(200).json(projects);
        }

        if (path === '/projects' && req.method === 'POST') {
            const { projects: projectsArray } = req.body;
            await Project.deleteMany({});
            // Strip _id and __v so MongoDB generates fresh IDs (avoids duplicate key errors)
            const cleaned = projectsArray.map(({ _id, __v, ...p }, i) => ({ ...p, order: i }));
            const savedProjects = await Project.insertMany(cleaned);
            return res.status(200).json(savedProjects);
        }

        // Leaders & Board Members
        if (path === '/leaders' && req.method === 'GET') {
            const leaders = await Leader.find({ type: 'LEADER' }).sort({ order: 1, createdAt: -1 });
            return res.status(200).json(leaders);
        }

        if (path === '/board-members' && req.method === 'GET') {
            const boardMembers = await Leader.find({ type: 'BOARD' }).sort({ order: 1, createdAt: -1 });
            return res.status(200).json(boardMembers);
        }

        if (path === '/leaders/sync' && req.method === 'POST') {
            const { leaders: leadersArray, type } = req.body;
            await Leader.deleteMany({ type });
            const cleaned = leadersArray.map(({ _id, __v, ...l }, i) => ({ ...l, type, order: i }));
            const savedLeaders = await Leader.insertMany(cleaned);
            return res.status(200).json(savedLeaders);
        }

        // Partners
        if (path === '/partners' && req.method === 'GET') {
            const partners = await Partner.find().sort({ order: 1, createdAt: -1 });
            return res.status(200).json(partners);
        }

        if (path === '/partners' && req.method === 'POST') {
            const { partners: partnersArray } = req.body;
            await Partner.deleteMany({});
            const cleaned = partnersArray.map(({ _id, __v, ...p }, i) => ({ ...p, order: i }));
            const savedPartners = await Partner.insertMany(cleaned);
            return res.status(200).json(savedPartners);
        }

        // 404
        return res.status(404).json({ error: 'Endpoint not found', path });

    } catch (err) {
        console.error('SERVER ERROR:', err);
        return res.status(500).json({
            error: 'Server Error',
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
}
