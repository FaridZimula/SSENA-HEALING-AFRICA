
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://njyewqyheflccvwdeqll.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qeWV3cXloZWZsY2N2d2RlcWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzQxOTAsImV4cCI6MjA5Mjk1MDE5MH0.WeXqGRqMvImh0YTeBZCRp_tJ9GWSNzeyPPMr7BQwVlU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listVideos() {
    const { data, error } = await supabase
        .from('videos')
        .select('*');

    if (error) {
        console.error('Fetch failed:', error.message);
    } else {
        console.log('Current videos in Supabase:');
        console.log(JSON.stringify(data, null, 2));
    }
}

listVideos();
