import mongoose from 'mongoose';
import axios from 'axios';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Supabase Client Helper
const getSupabase = (env) => {
    const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL || 'https://kioxulpdazbgxyoumfqt.supabase.co';
    const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_CwSyilG5fVcfXly-rDm8ig_wY-UEjlH';
    return createClient(url, key);
};

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

// Helper to process LapterPay Mobile Money payment
const processLapterPayPayment = async ({ amount, phone, provider, description }, env) => {
    const apiUrl = env.LAPTER_PAY_API_URL || 'https://pay.laptertech.store/api/v1';
    const apiKey = env.LAPTER_PAY_API_KEY || 'tp_live_3fb7a9d53e4e3946f87004f727c0656c0051bf25d9101e99';

    // Format phone number to 256XXXXXXXXX
    let cleanPhone = String(phone || '').replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
        cleanPhone = '256' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('7')) {
        cleanPhone = '256' + cleanPhone;
    } else if (cleanPhone.length === 9) {
        cleanPhone = '256' + cleanPhone;
    }

    let paymentMethod = 'MTN Mobile Money';
    const provLower = String(provider || '').toLowerCase();
    if (provLower.includes('airtel')) {
        paymentMethod = 'Airtel Money';
    } else {
        paymentMethod = 'MTN Mobile Money';
    }

    const payload = {
        amount: Math.round(Number(amount)),
        currency: 'UGX',
        payment_method: paymentMethod,
        customer_identifier: cleanPhone,
        description: description || 'Payment - SSENA HEALING AFRICA'
    };

    const idempotencyKey = crypto.randomUUID ? crypto.randomUUID() : `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    try {
        const response = await axios.post(`${apiUrl}/payments/initialize`, payload, {
            headers: {
                'x-api-key': apiKey,
                'Idempotency-Key': idempotencyKey,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        return response.data;
    } catch (error) {
        const errMessage = error.response?.data?.error || error.response?.data?.message || error.message;
        console.error('LapterPay API Error:', errMessage);
        throw new Error(errMessage);
    }
};

const checkLapterPayStatus = async (transactionId, env) => {
    const apiUrl = env.LAPTER_PAY_API_URL || 'https://pay.laptertech.store/api/v1';
    const apiKey = env.LAPTER_PAY_API_KEY || 'tp_live_3fb7a9d53e4e3946f87004f727c0656c0051bf25d9101e99';

    try {
        const response = await axios.get(`${apiUrl}/payments/${encodeURIComponent(transactionId)}`, {
            headers: {
                'x-api-key': apiKey
            },
            timeout: 15000
        });
        return response.data;
    } catch (error) {
        const errMessage = error.response?.data?.error || error.response?.data?.message || error.message;
        throw new Error(errMessage);
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
        // Optional MongoDB connection
        if (process.env.MONGODB_URI) {
            try {
                await connectToDatabase(process.env.MONGODB_URI);
            } catch (mErr) {
                console.warn('MongoDB connection note:', mErr.message);
            }
        }

        const supabase = getSupabase(process.env);

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
            const { amount, phone, provider, firstName, lastName, isAnonymous } = req.body;
            const numAmount = parseFloat(amount);

            if (!numAmount || numAmount < 1000) {
                return res.status(400).json({ error: 'Minimum donation amount is UGX 1,000.' });
            }

            let paymentStatus = 'PENDING';
            let transactionRef = null;
            let checkoutUrl = null;

            if (provider === 'mtn' || provider === 'airtel' || !provider || provider === 'mobile_money') {
                try {
                    const donorName = isAnonymous ? 'Anonymous Donor' : `${firstName || ''} ${lastName || ''}`.trim() || 'Supporter';
                    const paymentResult = await processLapterPayPayment({
                        amount: numAmount,
                        phone,
                        provider: provider || 'mtn',
                        description: `Donation: UGX ${numAmount.toLocaleString()} from ${donorName}`
                    }, process.env);

                    transactionRef = paymentResult.data?.transactionId || `DON-${Date.now()}`;
                    checkoutUrl = paymentResult.data?.checkout_url || null;
                    paymentStatus = paymentResult.data?.status || 'pending';
                } catch (paymentErr) {
                    console.error('Payment Error:', paymentErr.message);
                    return res.status(400).json({ error: paymentErr.message });
                }
            }

            try {
                await supabase.from('donations').insert([{
                    amount: numAmount,
                    phone,
                    provider: provider || 'mtn',
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    is_anonymous: isAnonymous,
                    status: paymentStatus,
                    transaction_ref: transactionRef
                }]);
            } catch (dbErr) {
                console.warn('DB note:', dbErr.message);
            }

            return res.status(201).json({
                success: true,
                message: 'Payment collection prompt sent to your mobile phone. Please enter your PIN to approve.',
                transactionId: transactionRef,
                checkoutUrl,
                status: paymentStatus,
                amount: numAmount
            });
        }

        // ROUTE: POST /buy-book
        if (path === '/buy-book' && req.method === 'POST') {
            const { bookId, bookTitle, quantity, amount, phone, provider, fullName, email, deliveryAddress } = req.body;
            const qty = parseInt(quantity) || 1;
            const totalAmount = parseInt(amount) || (qty * 30000);

            if (!phone || String(phone).replace(/[^0-9]/g, '').length < 9) {
                return res.status(400).json({ error: 'Please enter a valid MTN or Airtel Mobile Money phone number.' });
            }

            try {
                const paymentResult = await processLapterPayPayment({
                    amount: totalAmount,
                    phone,
                    provider: provider || 'mtn',
                    description: `Book Order: ${qty}x "${bookTitle || 'Book'}" - ${fullName}`
                }, process.env);

                const transactionRef = paymentResult.data?.transactionId || `BK-${Date.now()}`;
                const checkoutUrl = paymentResult.data?.checkout_url || null;
                const paymentStatus = paymentResult.data?.status || 'pending';

                try {
                    await supabase.from('orders').insert([{
                        full_name: fullName,
                        phone,
                        email,
                        delivery_address: deliveryAddress,
                        book_id: bookId,
                        book_title: bookTitle,
                        quantity: qty,
                        total_amount: totalAmount,
                        provider: provider || 'mtn',
                        status: paymentStatus,
                        transaction_ref: transactionRef
                    }]);
                } catch (dbErr) {
                    console.warn('DB order note:', dbErr.message);
                }

                return res.status(201).json({
                    success: true,
                    message: `USSD PIN prompt sent to ${phone}. Enter your Mobile Money PIN to complete payment of UGX ${totalAmount.toLocaleString()}.`,
                    transactionId: transactionRef,
                    checkoutUrl,
                    status: paymentStatus,
                    order: {
                        bookId,
                        bookTitle,
                        quantity: qty,
                        totalAmount,
                        fullName,
                        phone,
                        deliveryAddress
                    }
                });
            } catch (paymentErr) {
                return res.status(400).json({ error: paymentErr.message });
            }
        }

        // ROUTE: GET /payment-status/:id
        if (path.startsWith('/payment-status') && req.method === 'GET') {
            const txId = path.replace('/payment-status/', '').replace('/payment-status', '');
            try {
                const statusResult = await checkLapterPayStatus(txId, process.env);
                return res.json({
                    success: true,
                    status: statusResult.data?.status || 'pending',
                    data: statusResult.data
                });
            } catch (err) {
                return res.status(400).json({ success: false, error: err.message });
            }
        }

        // ROUTE: POST /payments/webhook
        if (path === '/payments/webhook' && req.method === 'POST') {
            console.log('LapterPay Webhook:', req.body);
            return res.status(200).json({ received: true });
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
