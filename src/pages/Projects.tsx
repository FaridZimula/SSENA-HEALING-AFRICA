import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useData, initialProjects } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import ProjectCard from "@/components/ProjectCard";
import VideoGallery from "@/components/VideoGallery";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";

const Projects = () => {
  const { projects } = useData();
  const { isAuthenticated } = useAuth();

  // Enforce the exact original order based on titles
  const originalOrder = [
    "Youth Leadership in Community Action",
    "Outreach to Ishaka Adventist Hospital",
    "Basoga Nssete Leadership Training",
    "Mentorship and Career Guidance",
    "Inter-University Mentorship Front",
    "Community Outreach: Market Cleanup",
    "Community Outreach: Elderly & Orphans",
    "44th Tarehe Sita Anniversary Celebrations",
    "State Dinner: 44th Tarehe Sita Anniversary",
    "National University Leadership Training",
    "Mentorship at Bassajabalaba Secondary School",
    "Counseling and Guidance at Bassajabalaba Secondary School",
    "Tech & Innovation: Mastering the New Economy"
  ];

  const filtered = projects.filter(p => originalOrder.includes(p.title));
  
  const sortedProjects = (filtered.length > 0 ? filtered : initialProjects)
    .sort((a, b) => {
      const indexA = originalOrder.indexOf(a.title);
      const indexB = originalOrder.indexOf(b.title);
      return indexA - indexB;
    });

  return (
    <Layout>
      <SEO
        title="Our Projects | SSENA HEALING AFRICA"
        description="Explore SSENA HEALING AFRICA's ongoing projects in community wellness, mental health support, and therapy across Uganda."
      />
      {/* Hero Section */}
      <section className="bg-zinc-900 section-padding relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.15]">
          <img
            src="/CANDIDATES 10.webp"
            alt="Participants in a SSENA HEALING AFRICA mental health and wellness workshop in Uganda"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-narrow mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6">
            Our Projects & Activities
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Discover our community initiatives and strategic partnerships driving positive, sustainable change across Africa.
          </p>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">

            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              Community Initiatives & Collaborations
            </h2>
            <p className="text-muted-foreground text-lg">
              Impactful projects executed in partnership with local and international stakeholders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProjects.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                images={project.images}
                icon={project.icon}
                category={project.category}
                impact={project.impact}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 bg-background">
        <div className="relative bg-gradient-to-br from-black via-neutral-900 to-black text-white rounded-[2.5rem] py-16 text-center shadow-2xl overflow-hidden border border-neutral-800">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-40">
            <img src="/DONATIONS FOOTER.webp" alt="SSENA HEALING AFRICA community members" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" />
          </div>

          <div className="container-narrow mx-auto relative z-10 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Support Our Mission
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
              Your support can help us expand these programs and reach more young people. Partner with us to create lasting change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90 font-bold px-8 py-6 rounded-full shadow-lg" asChild>
                <Link to="/contact">
                  Become a Partner
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90 font-bold px-8 py-6 rounded-full shadow-lg" asChild>
                <Link to="/donate">Donate Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
