
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://njyewqyheflccvwdeqll.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qeWV3cXloZWZsY2N2d2RlcWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzQxOTAsImV4cCI6MjA5Mjk1MDE5MH0.WeXqGRqMvImh0YTeBZCRp_tJ9GWSNzeyPPMr7BQwVlU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updateVideo() {
    console.log('Attempting to update video in Supabase...');
    const { data, error } = await supabase
        .from('videos')
        .update({ 
            title: "Our Impact & Mission", 
            description: "A highlight of our activities and the impact we are making in the community.", 
            video_url: "https://youtube.com/shorts/sk4vFIBLSR4" 
        })
        .match({ video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });

    if (error) {
        console.error('Update failed:', error.message);
    } else {
        console.log('Successfully updated video data!');
        console.log(data);
    }
}

updateVideo();
