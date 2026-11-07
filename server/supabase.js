const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://kioxulpdazbgxyoumfqt.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_CwSyilG5fVcfXly-rDm8ig_wY-UEjlH';

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: Supabase environment variables are missing in server/.env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
