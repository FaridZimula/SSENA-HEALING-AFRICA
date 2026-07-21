const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const { supabase } = require('./supabase');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Simple test route
app.get('/api/status', async (req, res) => {
    let marzPayStatus = 'Unknown';
    try {
        const response = await axios.get('https://wallet.wearemarz.com/api/v1/status', { timeout: 3000 });
        marzPayStatus = `Online (${response.status})`;
    } catch (err) {
        marzPayStatus = `Offline/Error (${err.message})`;
    }

    res.json({
        status: 'Online',
        message: 'SUYEL Supabase Backend is running',
        version: '2.0.0',
        serverTime: new Date().toISOString(),
        marzPayConnectivity: marzPayStatus
    });
});

// Helper to process MarzPay payment
const processMarzPayPayment = async (amount, phone, provider) => {
    const apiUrl = process.env.MARZ_PAY_API_URL;
    const apiKey = process.env.MARZ_PAY_API_KEY;
    const authHeader = process.env.MARZ_PAY_AUTH_HEADER;

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
            callback_url: 'https://suyel-website.vercel.app/api/payments/callback'
        };

        const startTime = Date.now();
        console.log(`[${new Date().toISOString()}] Initiating MarzPay request to: ${endpoint}`);

        const response = await axios.post(endpoint, payload, {
            headers: {
                'Authorization': `Basic ${authHeader}`,
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json'
            },
            timeout: 60000 
        });

        const duration = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] MarzPay API Response (${duration}ms):`, response.data);
        return response.data;
    } catch (error) {
        console.error(`MarzPay API Error:`, error.message);
        throw error;
    }
};

// Donation Endpoint
app.post('/api/donate', async (req, res) => {
    const { amount, phone, provider, email, firstName, lastName, isAnonymous } = req.body;

    try {
        let paymentStatus = 'PENDING';
        let transactionRef = null;

        if (provider === 'mtn' || provider === 'airtel') {
            try {
                const paymentResult = await processMarzPayPayment(amount, phone, provider);
                transactionRef = paymentResult.transaction_id || paymentResult.reference;
                paymentStatus = 'INITIATED';
            } catch (paymentErr) {
                return res.status(400).json({ error: paymentErr.message });
            }
        }

        const donationData = {
            amount: parseFloat(amount),
            phone,
            provider,
            email,
            first_name: firstName,
            last_name: lastName,
            is_anonymous: isAnonymous,
            status: paymentStatus,
            transaction_ref: transactionRef
        };

        const { data, error } = await supabase
            .from('donations')
            .insert([donationData])
            .select();

        if (error) throw error;

        res.status(201).json({
            message: 'Donation initiated',
            donationId: data[0].id,
            status: paymentStatus,
            transactionRef: transactionRef
        });

    } catch (err) {
        console.error('Donation Error:', err.message);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Contact Message Endpoint
app.post('/api/messages', async (req, res) => {
    const { fullName, email, subject, content } = req.body;

    try {
        const { data, error } = await supabase
            .from('messages')
            .insert([{ full_name: fullName, email, subject, content }])
            .select();

        if (error) throw error;

        res.status(201).json({
            message: 'Message sent successfully',
            messageId: data[0].id
        });

    } catch (err) {
        console.error('Message Error:', err.message);
        res.status(500).json({ error: 'Database error' });
    }
});

// Membership Registration Endpoint
app.post('/api/register', async (req, res) => {
    const { fullName, email, phoneNumber, paymentProofType, paymentMessage } = req.body;

    try {
        const { data, error } = await supabase
            .from('members')
            .insert([{
                full_name: fullName,
                email,
                phone_number: phoneNumber,
                payment_proof_type: paymentProofType,
                payment_message: paymentMessage
            }])
            .select();

        if (error) throw error;

        res.status(201).json({
            message: 'Registration submitted successfully',
            memberId: data[0].id
        });

    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ error: 'Database error' });
    }
});

// Projects Endpoints
app.get('/api/projects', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('order', { ascending: true });
        
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const { projects } = req.body;
        // Delete all then insert (Sync behavior)
        await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 
        
        const cleaned = projects.map(({ id, created_at, ...p }, i) => ({
            ...p,
            order: i
        }));

        const { data, error } = await supabase.from('projects').insert(cleaned).select();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Projects sync error:', err.message);
        res.status(500).json({ error: 'Sync error' });
    }
});

// Leaders Endpoints
app.get('/api/leaders', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('leaders')
            .select('*')
            .eq('type', 'LEADER')
            .order('order', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/board-members', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('leaders')
            .select('*')
            .eq('type', 'BOARD')
            .order('order', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/leaders/sync', async (req, res) => {
    try {
        const { leaders, type } = req.body;
        await supabase.from('leaders').delete().eq('type', type);
        
        const cleaned = leaders.map(({ id, created_at, ...l }, i) => ({
            ...l,
            type,
            order: i
        }));

        const { data, error } = await supabase.from('leaders').insert(cleaned).select();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Partners Endpoints
app.get('/api/partners', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('partners')
            .select('*')
            .order('order', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/partners', async (req, res) => {
    try {
        const { partners } = req.body;
        await supabase.from('partners').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        
        const cleaned = partners.map(({ id, created_at, ...p }, i) => ({
            ...p,
            order: i
        }));

        const { data, error } = await supabase.from('partners').insert(cleaned).select();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// MarzPay Callback/IPN Endpoint
app.post('/api/payments/callback', async (req, res) => {
    const { transaction_id, status, reference } = req.body;
    console.log('Payment Callback Received:', req.body);

    try {
        const { data: donations, error: fetchError } = await supabase
            .from('donations')
            .select('*')
            .or(`transaction_ref.eq.${transaction_id},transaction_ref.eq.${reference}`)
            .limit(1);

        if (fetchError) throw fetchError;

        if (donations && donations.length > 0) {
            const donation = donations[0];
            const newStatus = status === 'SUCCESS' ? 'SUCCESSFUL' : 'FAILED';
            
            const { error: updateError } = await supabase
                .from('donations')
                .update({ status: newStatus })
                .eq('id', donation.id);

            if (updateError) throw updateError;
            console.log(`Donation ${donation.id} status updated to ${newStatus}`);
        }

        res.status(200).send('OK');
    } catch (err) {
        console.error('Callback error:', err.message);
        res.status(500).send('Error');
    }
});

app.listen(port, () => {
    console.log(`Server v2.0.0 (Supabase) running on port ${port} - Started at: ${new Date().toISOString()}`);
});
