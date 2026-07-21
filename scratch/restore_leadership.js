
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://njyewqyheflccvwdeqll.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qeWV3cXloZWZsY2N2d2RlcWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzM3NDE5MCwiZXhwIjoyMDkyOTUwMTkwfQ.HWIfzbWdUXJLEJHzK1wSTIDif5fEHI24SApWZ7GPJZ0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const leaders = [
    {
        name: "KIRUNDA MUHAWUYA",
        role: "Executive Director And President",
        bio: "A dedicated leader committed to steering the organization towards sustainable growth and impactful youth empowerment initiatives.",
        image: "/Kirunda Muhawuya.jpg",
        type: 'LEADER',
        order: 0
    },
    {
        name: "BASAJJABALABA YUDAYA",
        role: "Voice President",
        bio: "Bringing strategic insight and operational excellence to ensure our programs effectively reach and uplift communities.",
        image: "/Basajjabalaba Yudaya.jpg",
        type: 'LEADER',
        order: 1
    },
    {
        name: "PROF. JUMA WASSWA BALUNWA",
        role: "Co-Founder ANd B.O.D",
        bio: "An experienced educator and leader providing wisdom and strategic direction to guide our mission and values.",
        image: "/PROF. JUMA WASSWA.jpg",
        type: 'LEADER',
        order: 2
    },
    {
        name: "HON.ENG. LUKE KYOBE INHESIKO",
        role: "Co-Founder And B.O.D",
        bio: "Combining technical expertise with a passion for community service to drive innovation and structural development within the organization.",
        image: "/HON. ENG. LUKE KYOBE.jpg",
        type: 'LEADER',
        order: 3
    },
    {
        name: "DR. JUMMA TEEKO",
        role: "Co-Founder And B.O.D",
        bio: "A steadfast advocate for youth development, offering valuable guidance to ensure our long-term success and community impact.",
        image: "/DR JUMMA TEEKO.jpg",
        type: 'LEADER',
        order: 4
    },
];

const boardMembers = [
    { name: "KASULE JOSHUA", role: "GeneralSecretary", image: "/Kasule Joshua.jpg", type: 'BOARD', order: 0 },
    { name: "NAISOGA BEGAM", role: "Secretary", image: "/Naisonga Begam.jpg", type: 'BOARD', order: 1 },
    { name: "MUTESI BAYAT", role: "Treasurer", image: "/Mutesi Rayat.jpg", type: 'BOARD', order: 2 },
    { name: "MULUMBA KASSIM", role: "Ambassador Central Region", image: "/Mulumba Kassim.jpg", type: 'BOARD', order: 3 },
    { name: "KISUBI DAVID", role: "Ambassador Eastern Region", image: "/Kisubi David.jpg", type: 'BOARD', order: 4 },
    { name: "ALICE NYADOI", role: "Ambassador Northern Region", image: "/Alice Nyadoi.jpg", type: 'BOARD', order: 5 },
    { name: "IMMANHIRIHO MERCY", role: "Ambassador Western Region", image: "/Immanihiro Tracy.jpg", type: 'BOARD', order: 6 },
    { name: "MUBIRU LIM LYYN ARNOLD", role: "Ambassador Greater Masaka Region", image: "/Mubiru Lim Lyyn Arnold.jpg", type: 'BOARD', order: 7 },
    { name: "KYOBE AISHA", role: "Ambassador Asia", image: "/Kyobe Aisha.jpg", type: 'BOARD', order: 8 },
    { name: "ZIMULA FARID", role: "I.T Director", image: "/ZIMULA FARID.jpg", type: 'BOARD', order: 9 },
    { name: "NAMBAGO DERICK AMOS", role: "General Coordinator", image: "/Nambago Derrick Amos.jpg", type: 'BOARD', order: 10 },
    { name: "KATO MUHAMMAD NTALE", role: "Internal Coordinator", image: "/Kato Muhammad Ntale.jpg", type: 'BOARD', order: 11 },
    { name: "GOODWILL LOKWANG", role: "Internal Coordinator", image: "/GoodWill Lokwang.jpg", type: 'BOARD', order: 12 },
    { name: "NAMUKOSE FATUMA", role: "Representative Women Affairs", image: "/Namukose Fatumah.jpg", type: 'BOARD', order: 13 },
    { name: "MUKOTI WAHAB", role: "Advisor On Management", image: "/Mukoti Wahab.jpg", type: 'BOARD', order: 14 },
    { name: "MUHASIZI ELVIS", role: "Legal Advisor And Mgt Team", image: "/Musasizi Elvis.jpg", type: 'BOARD', order: 15 },
    { name: "MR COLLINS", role: "Legal Advisor And Mgt Team", image: "/Mr Collins.jpg", type: 'BOARD', order: 16 },
];

async function restoreLeadership() {
    console.log('🚀 Starting leadership restoration...');

    // 1. Delete all existing leaders
    const { error: deleteError } = await supabase
        .from('leaders')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything

    if (deleteError) {
        console.error('Error deleting old records:', deleteError.message);
        return;
    }
    console.log('✅ Cleared old leadership records');

    // 2. Combine and Insert new records
    const allMembers = [...leaders, ...boardMembers];
    const { data, error: insertError } = await supabase
        .from('leaders')
        .insert(allMembers);

    if (insertError) {
        console.error('Error inserting new records:', insertError.message);
    } else {
        console.log(`✅ Successfully restored ${allMembers.length} leadership members!`);
    }
}

restoreLeadership();
