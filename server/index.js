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

// Helper to process LapterPay Mobile Money payment
const processLapterPayPayment = async ({ amount, phone, provider, description }) => {
    const apiUrl = process.env.LAPTER_PAY_API_URL || 'https://pay.laptertech.store/api/v1';
    const apiKey = process.env.LAPTER_PAY_API_KEY || 'tp_live_3fb7a9d53e4e3946f87004f727c0656c0051bf25d9101e99';

    // Format phone number to 256XXXXXXXXX (Uganda standard)
    let cleanPhone = String(phone || '').replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
        cleanPhone = '256' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('7')) {
        cleanPhone = '256' + cleanPhone;
    } else if (cleanPhone.length === 9) {
        cleanPhone = '256' + cleanPhone;
    }

    // Determine payment_method expected by LapterPay
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

    console.log(`[${new Date().toISOString()}] Initiating LapterPay USSD Push to: ${apiUrl}/payments/initialize`, payload);

    try {
        const response = await axios.post(`${apiUrl}/payments/initialize`, payload, {
            headers: {
                'x-api-key': apiKey,
                'Idempotency-Key': idempotencyKey,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        console.log(`[${new Date().toISOString()}] LapterPay Response:`, response.data);
        return response.data;
    } catch (error) {
        const errMessage = error.response?.data?.error || error.response?.data?.message || error.message;
        console.error(`LapterPay API Error:`, errMessage);
        throw new Error(errMessage);
    }
};

// Helper to check payment status
const checkLapterPayStatus = async (transactionId) => {
    const apiUrl = process.env.LAPTER_PAY_API_URL || 'https://pay.laptertech.store/api/v1';
    const apiKey = process.env.LAPTER_PAY_API_KEY || 'tp_live_3fb7a9d53e4e3946f87004f727c0656c0051bf25d9101e99';

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

// Donation Endpoint (Mobile Money & Cards)
app.post('/api/donate', async (req, res) => {
    const { amount, phone, provider, email, firstName, lastName, isAnonymous } = req.body;

    try {
        const numAmount = parseFloat(amount);
        if (!numAmount || numAmount < 1000) {
            return res.status(400).json({ error: 'Minimum donation amount is UGX 1,000.' });
        }

        let paymentStatus = 'PENDING';
        let transactionRef = null;
        let checkoutUrl = null;

        // Process Mobile Money via LapterPay
        if (provider === 'mtn' || provider === 'airtel' || !provider || provider === 'mobile_money') {
            if (!phone || String(phone).replace(/[^0-9]/g, '').length < 9) {
                return res.status(400).json({ error: 'Please enter a valid MTN or Airtel Mobile Money phone number.' });
            }

            const donorName = isAnonymous ? 'Anonymous Donor' : `${firstName || ''} ${lastName || ''}`.trim() || 'Supporter';
            const paymentResult = await processLapterPayPayment({
                amount: numAmount,
                phone,
                provider: provider || 'mtn',
                description: `Donation: UGX ${numAmount.toLocaleString()} from ${donorName}`
            });

            transactionRef = paymentResult.data?.transactionId || `DON-${Date.now()}`;
            checkoutUrl = paymentResult.data?.checkout_url || null;
            paymentStatus = paymentResult.data?.status || 'pending';
        }

        // Gracefully attempt DB recording
        try {
            const donationData = {
                amount: numAmount,
                phone,
                provider: provider || 'mtn',
                email,
                first_name: firstName,
                last_name: lastName,
                is_anonymous: isAnonymous,
                status: paymentStatus,
                transaction_ref: transactionRef
            };

            await supabase.from('donations').insert([donationData]);
        } catch (dbErr) {
            console.warn('Database note (donation recorded via payment gateway):', dbErr.message);
        }

        return res.status(201).json({
            success: true,
            message: 'Payment collection prompt sent to your mobile phone. Please enter your PIN to approve.',
            transactionId: transactionRef,
            checkoutUrl,
            status: paymentStatus,
            amount: numAmount
        });

    } catch (err) {
        console.error('Donation Error:', err.message);
        return res.status(400).json({ error: err.message || 'Payment initiation failed' });
    }
});

// Book Purchase Endpoint (Instant Mobile Money USSD Push)
app.post('/api/buy-book', async (req, res) => {
    const {
        bookId,
        bookTitle,
        quantity,
        amount,
        phone,
        provider,
        fullName,
        email,
        deliveryAddress
    } = req.body;

    try {
        const qty = parseInt(quantity) || 1;
        const totalAmount = parseInt(amount) || (qty * 30000);

        if (!phone || String(phone).replace(/[^0-9]/g, '').length < 9) {
            return res.status(400).json({ error: 'Please enter a valid MTN or Airtel Mobile Money phone number.' });
        }

        if (!fullName || !fullName.trim()) {
            return res.status(400).json({ error: 'Please provide your full name for book delivery.' });
        }

        // Initialize USSD Push prompt via LapterPay
        const paymentResult = await processLapterPayPayment({
            amount: totalAmount,
            phone,
            provider: provider || 'mtn',
            description: `Book Order: ${qty}x "${bookTitle || 'Book'}" - ${fullName}`
        });

        const transactionRef = paymentResult.data?.transactionId || `BK-${Date.now()}`;
        const checkoutUrl = paymentResult.data?.checkout_url || null;
        const paymentStatus = paymentResult.data?.status || 'pending';

        // Gracefully attempt recording order in Supabase
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
            console.warn('Database note (order logged):', dbErr.message);
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

    } catch (err) {
        console.error('Book Purchase Error:', err.message);
        return res.status(400).json({ error: err.message || 'Payment initiation failed' });
    }
});

// Check Payment Status Endpoint (Real-time polling from frontend)
app.get('/api/payment-status/:id', async (req, res) => {
    try {
        const result = await checkLapterPayStatus(req.params.id);
        return res.json({
            success: true,
            status: result.data?.status || 'pending',
            data: result.data
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

// LapterPay Webhook Notification Handler (Event listener)
app.post('/api/payments/webhook', async (req, res) => {
    try {
        const signature = req.headers['x-lapterpay-signature'];
        const eventData = req.body;

        console.log(`[${new Date().toISOString()}] LapterPay Webhook Received:`, {
            event: eventData?.event,
            transactionId: eventData?.data?.transactionId,
            status: eventData?.data?.status,
            amount: eventData?.data?.amount
        });

        // If configured, verify HMAC signature
        const webhookSecret = process.env.LAPTER_PAY_WEBHOOK_SECRET;
        if (webhookSecret && signature) {
            const rawBody = JSON.stringify(req.body);
            const expectedSig = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
            if (expectedSig !== signature) {
                console.warn('Invalid LapterPay webhook signature!');
                return res.status(401).json({ error: 'Invalid signature' });
            }
        }

        const txId = eventData?.data?.transactionId;
        const status = eventData?.data?.status;

        if (status === 'completed' && txId) {
            console.log(`Payment confirmed for transaction ${txId}`);
            // Attempt to update status in supabase
            try {
                await supabase.from('donations').update({ status: 'COMPLETED' }).eq('transaction_ref', txId);
                await supabase.from('orders').update({ status: 'COMPLETED' }).eq('transaction_ref', txId);
            } catch (dbErr) {
                // Log and continue
            }
        }

        return res.status(200).json({ received: true });
    } catch (err) {
        console.error('Webhook error:', err.message);
        return res.status(500).json({ error: 'Webhook processing failed' });
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
