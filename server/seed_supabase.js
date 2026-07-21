const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });

// Since we can't read .ts files directly in Node easily without setup, 
// I'll define the core data based on the project's data files.

console.log('Connecting to:', process.env.SUPABASE_URL);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const projects = [
    {
        title: "Youth Skills Training",
        category: "Education",
        description: "Empowering youth with vocational skills for sustainable livelihoods.",
        short_description: "Vocational training for vulnerable youth.",
        impact: "Over 500 youth trained in 2023.",
        images: ["https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070"],
        icon: "BookOpen",
        order: 0
    },
    {
        title: "Clean Water Initiative",
        category: "Health",
        description: "Providing safe and clean drinking water to rural communities.",
        short_description: "Safe water for rural areas.",
        impact: "10 new boreholes drilled in Iganga.",
        images: ["https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=2069"],
        icon: "Droplets",
        order: 1
    }
    // Add more if needed, but this gets the site started
];

const leaders = [
    {
        name: "Farid Zimula",
        role: "Executive Director",
        bio: "Dedicated to youth empowerment and community development.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070",
        type: "LEADER",
        order: 0
    }
];

const partners = [
    { name: "Global Giving", logo: "https://images.unsplash.com/photo-1599305090748-366564aad675?q=80&w=200", order: 0 },
    { name: "Uganda Red Cross", logo: "https://images.unsplash.com/photo-1599305090748-366564aad675?q=80&w=200", order: 1 }
];

const donations = [
    { amount: 50000, phone: "0770000000", provider: "mtn", email: "donor@example.com", first_name: "John", last_name: "Doe", is_anonymous: false, status: "SUCCESSFUL" }
];

const messages = [
    { full_name: "Jane Smith", email: "jane@example.com", subject: "Partnership Inquiry", content: "We are interested in supporting your water initiative." }
];

const members = [
    { full_name: "Alice Naka", email: "alice@example.com", phone_number: "0780000000", payment_proof_type: "MOBILE_MONEY", payment_message: "Paid via Airtel Money", status: "APPROVED" }
];

const videos = [
    { 
        title: "Our Impact & Mission", 
        description: "A highlight of our activities and the impact we are making in the community.", 
        video_url: "https://youtube.com/shorts/sk4vFIBLSR4", 
        order: 0 
    }
];

async function seed() {
    console.log('🌱 Seeding Supabase with initial data...');
    
    try {
        // Projects
        const { error: pErr } = await supabase.from('projects').insert(projects);
        if (pErr) console.error('Error seeding projects:', pErr.message);
        else console.log('✅ Projects seeded');

        // Leaders
        const { error: lErr } = await supabase.from('leaders').insert(leaders);
        if (lErr) console.error('Error seeding leaders:', lErr.message);
        else console.log('✅ Leaders seeded');

        // Partners
        const { error: partErr } = await supabase.from('partners').insert(partners);
        if (partErr) console.error('Error seeding partners:', partErr.message);
        else console.log('✅ Partners seeded');

        // Donations
        const { error: dErr } = await supabase.from('donations').insert(donations);
        if (dErr) console.error('Error seeding donations:', dErr.message);
        else console.log('✅ Donations seeded');

        // Messages
        const { error: mErr } = await supabase.from('messages').insert(messages);
        if (mErr) console.error('Error seeding messages:', mErr.message);
        else console.log('✅ Messages seeded');

        // Members
        const { error: memErr } = await supabase.from('members').insert(members);
        if (memErr) console.error('Error seeding members:', memErr.message);
        else console.log('✅ Members seeded');

        // Videos
        const { error: vErr } = await supabase.from('videos').insert(videos);
        if (vErr) console.error('Error seeding videos:', vErr.message);
        else console.log('✅ Videos seeded');

        console.log('🚀 Supabase is now ready with full initial content!');
    } catch (err) {
        console.error('Seed failed:', err.message);
    }
}

seed();
