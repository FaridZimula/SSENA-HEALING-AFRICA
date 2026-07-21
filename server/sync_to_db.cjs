
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    console.error('MONGODB_URI is not defined in server/.env');
    process.exit(1);
}

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

const Project = mongoose.model('Project', projectSchema);

// This is the data from our updated src/data/projects.ts
const projects = [
    {
        title: "Outreach to Ishaka Adventist Hospital",
        category: "Healthcare & Empowerment",
        description: "In partnership with Softcare Company, SUYEL conducted a dedicated outreach to the maternity ward of Ishaka Adventist Hospital. Our team met with young mothers, including adolescents and young adults, to provide essential maternity and hygiene items. Beyond the physical support, we shared a message of hope and empowerment, reminding these resilient women that early motherhood is not the end of their journey. We encouraged them to keep pursuing their ambitions and dreams, ensuring they feel supported in both their new roles as mothers and their future aspirations.",
        shortDescription: "Empowering and supporting young mothers at Ishaka Adventist Hospital with essential supplies and mentorship.",
        impact: "Supporting Young Mothers",
        images: ["/Outreach 1.jpg", "/Outreach 2.jpg", "/Outreach 3.jpg", "/Outreach 4.jpg", "/Outreach 5.jpg", "/Outreach 6.jpg", "/Outreach 7.jpg", "/Outreach 8.jpg"],
        icon: "Heart",
    },
    {
        title: "Basoga Nssete Leadership Training",
        category: "Leadership",
        description: "Leadership training of BASOGA NSSETE leaders from all universities across the country in partnership with Balunywa Leadership Academy and Airtel Uganda.",
        shortDescription: "Leadership training for university leaders across the country.",
        impact: "University Leaders",
        images: ["/BasogaNssete1.jpg", "/BasogaNssete2.jpg", "/BasogaNssete3.jpg"],
        icon: "Users",
    },
    {
        title: "Mentorship and Career Guidance",
        category: "Mentorship",
        description: "Mentorship and career guidance project done at different schools like Kibuli senior secondary school, Iganga Progressive Secondary School and Bukoyo S.S",
        shortDescription: "Providing mentorship and career guidance to students across various secondary schools.",
        impact: "Students Mentored",
        images: ["/Mentorship1.jpg", "/Mentorship2.jpg", "/Mentorship3.jpg", "/Mentorship4.jpg", "/Mentorship5.jpg"],
        icon: "Users",
    },
    {
        title: "Inter-University Mentorship Front",
        category: "Mentorship",
        description: "Inter-university mentorship Front conducted at KIU western campus Ishaka-Bushenyi in conjunction with Mbarara University, Ibanda University, Kabale University, Mountains of the moon University and other Universities in Western Uganda.",
        shortDescription: "Connecting university students across Western Uganda for mentorship and collaboration.",
        impact: "Universities Connected",
        images: ["/InterUniversity1.jpg", "/InterUniversity2.jpg", "/InterUniversity3.jpg", "/InterUniversity4.jpg"],
        icon: "Briefcase",
    },
    {
        title: "Community Outreach: Market Cleanup",
        category: "Community Outreach",
        description: "Market clean up for sustainable clean environment for Ishaka-Bassaja Market in partnership with KIU-western campus Ishaka-Bushenyi.",
        shortDescription: "Market clean up for a sustainable environment for Ishaka-Bassaja Market.",
        impact: "Cleaner Environment",
        images: ["/Cleanup1.jpg", "/Cleanup2.jpg", "/Cleanup3.jpg", "/Cleanup4.jpg", "/Cleanup5.jpg"],
        icon: "Leaf",
    },
    {
        title: "Community Outreach: Elderly & Orphans",
        category: "Community Outreach",
        description: "Community outreach to the elderly and orphan children to the people of Nyasheshera in Bushenyi district in spread of love, peace and unity.",
        shortDescription: "Spreading love, peace, and unity to the elderly and orphans in Bushenyi.",
        impact: "Lives Touched",
        images: ["/CommunityOutreach1.jpg", "/CommunityOutreach2.jpg", "/CommunityOutreach3.jpg", "/CommunityOutreach4.jpg", "/CommunityOutreach5.jpg"],
        icon: "Heart",
    },
    {
        title: "44th Tarehe Sita Anniversary Celebrations",
        category: "Community Engagement",
        description: "Attendance at the 44th Tarehe Sita celebrations in Kyotera District in partnership with Pamoja Foundation and the UPDF MoDVA.",
        shortDescription: "Celebrating the 44th Tarehe Sita anniversary in Kyotera District with partners.",
        impact: "National Unity",
        images: ["/TareheSita1.jpg", "/TareheSita2.jpg", "/TareheSita3.jpg", "/TareheSita4.jpg", "/TareheSita5.jpg"],
        icon: "Users",
    },
    {
        title: "State Dinner: 44th Tarehe Sita Anniversary",
        category: "Official Engagement",
        description: "Attended the State Dinner in Kyotera District as part of the 44th Tarehe Sita anniversary celebrations, engaging with national leaders and celebrating the spirit of patriotism.",
        shortDescription: "Attending the State Dinner for the 44th Tarehe Sita anniversary in Kyotera District.",
        impact: "Diplomacy & Unity",
        images: ["/TareheSitaDinner1.jpg", "/TareheSitaDinner2.jpg", "/TareheSitaDinner3.jpg", "/TareheSitaDinner4.jpg"],
        icon: "Star",
    },
    {
        title: "National University Leadership Training",
        category: "Leadership Development",
        description: "Leadership skills training for representatives from all universities in the country at the Balunywa Leadership Academy in Kasolo, Iganga town, in partnership with Balunywa Leadership Academy.",
        shortDescription: "Empowering university representatives with leadership skills at Balunywa Leadership Academy.",
        impact: "Empowering Youth",
        images: ["/LeadershipTraining1.jpg", "/LeadershipTraining2.jpg", "/LeadershipTraining3.jpg"],
        icon: "BookOpen",
    }
];

async function sync() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('Connected.');

        console.log('Clearing existing projects...');
        await Project.deleteMany({});
        
        console.log('Inserting updated projects...');
        const cleaned = projects.map((p, i) => ({ ...p, order: i }));
        await Project.insertMany(cleaned);
        
        console.log('Sync completed successfully.');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error during sync:', err.message);
    }
}

sync();
