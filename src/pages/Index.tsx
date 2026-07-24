import { useState, useEffect } from "react";
import DonationCard from "@/components/DonationCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Heart, Target, ArrowRight, Globe, BookOpen, Briefcase } from "lucide-react";
import Layout from "@/components/layout/Layout";
import heroImage from "@/assets/hero-youth.jpg";
// Images are now loaded from the public directory using static paths
import leaderImage from "@/assets/leader-1.jpg";

import { useData, initialProjects, initialPartners } from "@/context/DataContext";
import ProjectCard from "@/components/ProjectCard";
import VideoGallery from "@/components/VideoGallery";
import CountUp from "@/components/CountUp";
import SEO from "@/components/SEO";

const stats = [
  { number: "5,000+", label: "Youth Empowered", icon: Users },
  { number: "50+", label: "Active Projects", icon: Target },
  { number: "25+", label: "Communities Reached", icon: Globe },
  { number: "100+", label: "Volunteers", icon: Heart },
];


const slides = [
  {
    image: "/Sanitary 1.webp",
    title: (
      <>
        Empowering Youth,{" "}
        <span className="text-primary">Transforming</span> Communities
      </>
    ),
    description: "We believe in the power of young people to create lasting change. Join us in building a future where every youth has the opportunity to thrive."
  },
  {
    image: "/CANDIDATES 10.webp",
    title: (
      <>
        Building Skills{" "}
        <span className="text-primary">for Tomorrow</span>
      </>
    ),
    description: "Equipping the next generation with the knowledge, technical expertise, and confidence to succeed in a rapidly evolving world."
  },
  {
    image: "/UJUZI 8.webp",
    title: (
      <>
        Vocational & Practical{" "}
        <span className="text-primary">Life Skilling</span>
      </>
    ),
    description: "Providing hands-on vocational skills, financial empowerment, and practical tools to build resilient, independent lives."
  },
  {
    image: "/ENVT 5.webp",
    title: (
      <>
        Nurturing{" "}
        <span className="text-primary">Future Leaders</span>
      </>
    ),
    description: "Creating pathways for environmental stewardship, mentorship, and personal growth to develop compassionate community leaders."
  }
];

const row1Logos = [
  { name: "Solomon Lubega", logo: "/SOLOMON LUBEGA.jpg" },
  { name: "Partner 1", logo: "/LOGO 1.jpg" },
  { name: "Partner 2", logo: "/LOGO 2.jpg" },
  { name: "Partner 3", logo: "/LOGO 3.jpg" },
  { name: "Partner 4", logo: "/LOGO 4.jpg" },
  { name: "Partner 5", logo: "/LOGO 5.jpg" },
  { name: "Partner 6", logo: "/LOGO 6.jpg" },
  { name: "Partner 7", logo: "/LOGO 7.jpg" },
  { name: "Partner 8", logo: "/LOGO 8.jpg" },
  { name: "Partner 19", logo: "/LOGO 19.jpg" },
  { name: "Partner 20", logo: "/LOGO 20.jpg" },
];

const row2Logos = [
  { name: "Partner 9", logo: "/LOGO 9.jpg" },
  { name: "Partner 10", logo: "/LOGO 10.jpg" },
  { name: "Partner 11", logo: "/LOGO 11.jpg" },
  { name: "Partner 12", logo: "/LOGO 12 PART 2.jpg" },
  { name: "Partner 13", logo: "/LOGO 13.jpg" },
  { name: "Partner 14", logo: "/LOGO 14.jpg" },
  { name: "Partner 15", logo: "/LOGO 15.jpg" },
  { name: "Partner 16", logo: "/LOGO 16.jpg" },
  { name: "Partner 17", logo: "/LOGO 17.jpg" },
  { name: "Partner 21", logo: "/LOGO 21.jpg" },
  { name: "Partner 22", logo: "/LOGO 22.jpg" },
  { name: "Partner 23", logo: "/LOGO 23.jpg" },
];

const Index = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { projects, partners } = useData();
  
  // Enforce the exact original order for the featured projects
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

  // Filter and fallback for partners
  const originalPartners = ["Pamoja Foundation", "Balunywa Leadership Academy"];
  const filteredPartners = partners.filter(p => originalPartners.includes(p.name));
  const finalPartners = filteredPartners.length > 0 ? filteredPartners : initialPartners;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 bg-background">
        <div className="relative min-h-[85vh] rounded-[2.5rem] overflow-hidden flex items-center shadow-2xl">
          <div className="absolute inset-0 z-0">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
              >
                <img
                  src={slide.image}
                  alt={`SSENA HEALING AFRICA - ${slide.description.substring(0, 50)}...`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />
              </div>
            ))}
          </div>

          <div className="w-full px-8 md:px-12 lg:px-16 relative z-10">
            <div className="max-w-2xl">
              <div key={currentSlide} className="animate-fade-up">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-lg text-white/90 mb-8 leading-relaxed shadow-sm">
                  {slides[currentSlide].description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90" asChild>
                  <Link to="/projects">
                    Explore Our Work
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 bg-background">
        <div className="container-narrow mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Left Side - Image Card */}
            <div data-aos="fade-right" className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-xl group">
              <img
                src="/Sanitary 1.webp"
                alt="SSENA HEALING AFRICA Impact Milestone - Youth Engagement in Uganda"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
            </div>

            {/* Right Side - Content & Stats */}
            <div data-aos="fade-left" className="flex flex-col justify-center">

              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
                Our Milestones
              </h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                We have successfully executed impactful initiatives ranging from youth mentorship programs, community health outreach, skills training workshops, and educational support projects across various districts in Uganda.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-6xl mx-auto">
                <div className="bg-primary rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 text-center card-elevated hover:scale-105 transition-transform duration-300 flex flex-col justify-center items-center aspect-square w-full shadow-lg">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-extrabold text-white mb-2">
                    <CountUp end={6000} suffix="+" duration={4000} />
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm md:text-base font-bold text-center leading-tight">
                    Youth<br />Empowered
                  </div>
                </div>
                <div className="bg-primary rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 text-center card-elevated hover:scale-105 transition-transform duration-300 flex flex-col justify-center items-center aspect-square w-full shadow-lg">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-extrabold text-white mb-2">
                    <CountUp end={10} suffix="+" duration={2000} />
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm md:text-base font-bold text-center leading-tight">
                    Active<br />Projects
                  </div>
                </div>
                <div className="bg-primary rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 text-center card-elevated hover:scale-105 transition-transform duration-300 flex flex-col justify-center items-center aspect-square w-full shadow-lg">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-extrabold text-white mb-2">
                    <CountUp end={15} suffix="+" duration={2000} />
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm md:text-base font-bold text-center leading-tight">
                    Communities<br />Reached
                  </div>
                </div>
                <div className="bg-primary rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 text-center card-elevated hover:scale-105 transition-transform duration-300 flex flex-col justify-center items-center aspect-square w-full shadow-lg">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-extrabold text-white mb-2">
                    <CountUp end={10} suffix="+" duration={2000} />
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm md:text-base font-bold text-center leading-tight">
                    Corporate<br />Partners
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parallax CTA Section */}
      <section
        className="relative bg-fixed bg-cover bg-center py-8 md:py-[55px]"
        style={{ backgroundImage: "url('/TREES.webp')" }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="container-narrow mx-auto relative z-10 px-4">
          <div data-aos="zoom-in" className="max-w-4xl mx-auto border border-white/30 bg-black/30 backdrop-blur-sm rounded-3xl p-6 md:p-8 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Join Ssena Healing Africa today</h2>
            <p className="text-base md:text-lg text-white/90 mb-6 leading-relaxed max-w-2xl mx-auto">
              Be part of a thriving community that celebrates shared memories, fosters lifelong connections, and gives back. Together, we can make a difference through impactful projects, mentorship, and support for future generations.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white border-none rounded-full px-8 text-base h-12 shadow-lg hover:shadow-primary/25 transition-all duration-300" asChild>
              <Link to="/register">Register Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Publications & Books Section */}
      <section className="section-padding bg-background w-full max-w-full overflow-hidden">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
          <div data-aos="fade-up" className="text-center max-w-2xl mx-auto mb-10 px-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 break-words">
              Featured Books & Publications
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Empowering communities with vital knowledge on mental health, trauma recovery, and child protection.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch w-full max-w-full">
            {/* Book 1: Breaking The Circle */}
            <div data-aos="fade-right" className="bg-card border border-border rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-6 lg:p-8 shadow-2xl flex flex-col justify-between h-full relative group w-full max-w-full box-border overflow-hidden">
              <div className="space-y-5 w-full max-w-full overflow-hidden">
                {/* Book Cover Image */}
                <div className="relative w-full max-w-full aspect-[1170/936] rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-muted/30 flex items-center justify-center">
                  <img
                    src="/BREAKING_THE_CIRCLE.webp"
                    alt="Breaking The Circle Mental Health Book"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-primary text-white font-extrabold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm shadow-lg">
                    UGX 30,000
                  </div>
                </div>

                <div className="space-y-2.5 w-full">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground leading-tight break-words">
                    "Breaking The Circle"
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed break-words">
                    <strong>"Breaking The Circle"</strong> is an empowering mental health guide published by <strong>SSENA Healing Africa</strong>. Designed to support youth, families, and communities, this book offers practical coping mechanisms, emotional healing strategies, and tools to overcome life's silent struggles and stigma.
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed break-words">
                    Every copy purchased directly supports our ongoing community mental health outreach programs and educational book donations across Ugandan schools.
                  </p>
                </div>
              </div>

              <div className="pt-5 w-full">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold h-auto py-3.5 px-4 text-sm sm:text-base rounded-full shadow-lg hover:shadow-primary/30 transition-all text-center whitespace-normal break-words" asChild>
                  <Link to="/buy-book?book=breaking-the-circle" className="flex items-center justify-center text-center gap-2 w-full">
                    <span>Order & Pay Online — UGX 30,000</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Book 2: Ending Child Sexual Violence & Trauma Awareness */}
            <div data-aos="fade-left" className="bg-card border border-border rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-6 lg:p-8 shadow-2xl flex flex-col justify-between h-full relative group w-full max-w-full box-border overflow-hidden">
              <div className="space-y-5 w-full max-w-full overflow-hidden">
                {/* Book Cover Image */}
                <div className="relative w-full max-w-full aspect-[1170/936] rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-muted/30 flex items-center justify-center">
                  <img
                    src="/CHILDHOOD.webp"
                    alt="Echoes of a Stolen Childhood Book"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-primary text-white font-extrabold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm shadow-lg">
                    UGX 30,000
                  </div>
                </div>

                <div className="space-y-2.5 w-full">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground leading-tight break-words">
                    "Echoes of a Stolen Childhood"
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed break-words">
                    In our continued efforts to end <strong>Child Sexual Violence</strong>, our Founder authored this crucial book to raise awareness about child sexual abuse, protection, and how unaddressed childhood traumas profoundly shape adulthood.
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed break-words">
                    Get copies for your children, loved ones, and yourself to gain deep insights into healing emotional wounds and protecting future generations.
                  </p>
                </div>
              </div>

              <div className="pt-5 w-full">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold h-auto py-3.5 px-4 text-sm sm:text-base rounded-full shadow-lg hover:shadow-primary/30 transition-all text-center whitespace-normal break-words" asChild>
                  <Link to="/buy-book?book=childhood" className="flex items-center justify-center text-center gap-2 w-full">
                    <span>Order & Pay Online — UGX 30,000</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Partners Section - Slow Horizontal Marquee Slider */}
      <section className="section-padding bg-background overflow-hidden">
        <div className="container-narrow mx-auto">
          <div data-aos="fade-up" className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Corporate Partners
            </h2>
            <p className="text-muted-foreground text-lg">
              Collaborating with industry leaders to create sustainable impact.
            </p>
          </div>

          <div className="relative w-full overflow-hidden py-4 space-y-6">
            {/* Row 1: Sliding Left */}
            <div className="animate-marquee flex items-center gap-8 md:gap-12">
              {[...row1Logos, ...row1Logos, ...row1Logos].map((partner, index) => (
                <div
                  key={`row1-${index}`}
                  className="overflow-hidden rounded-2xl flex items-center justify-center w-56 h-36 md:w-64 md:h-40 flex-shrink-0 group shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={partner.logo}
                    alt={`Corporate Partner - ${partner.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  />
                </div>
              ))}
            </div>

            {/* Row 2: Sliding Right (Opposite Direction) */}
            <div className="animate-marquee-reverse flex items-center gap-8 md:gap-12">
              {[...row2Logos, ...row2Logos, ...row2Logos].map((partner, index) => (
                <div
                  key={`row2-${index}`}
                  className="overflow-hidden rounded-2xl flex items-center justify-center w-56 h-36 md:w-64 md:h-40 flex-shrink-0 group shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={partner.logo}
                    alt={`Corporate Partner - ${partner.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 bg-background w-full max-w-full overflow-hidden">
        <div className="bg-secondary rounded-[2.5rem] py-16 shadow-xl w-full max-w-full overflow-hidden">
          <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
            <div data-aos="fade-up" className="text-center max-w-2xl mx-auto mb-12">

              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
                Featured Projects and Activities
              </h2>
              <p className="text-muted-foreground text-lg">
                Discover how we're fostering mental wellness, emotional healing, and resilience in communities.
              </p>
            </div>

            <div className="flex flex-row overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-6 snap-x snap-mandatory scrollbar-none w-full px-2 sm:px-4 md:px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {sortedProjects.slice(0, 3).map((project, index) => (
                <div key={index} className="w-[288px] max-w-[88vw] shrink-0 snap-start flex justify-center mx-auto">
                  <ProjectCard
                    title={project.title}
                    description={project.shortDescription}
                    images={project.images}
                    icon={project.icon}
                    showIcon={true}
                    variant="home"
                    category={project.category}
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link to="/projects">
                  View All Projects
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Gallery Section (Our Latest Highlights & Updates) */}
      <VideoGallery />

      {/* Official Bank Account Donation Section - Positioned below Highlights */}
      <section className="py-8 bg-background">
        <div className="container-narrow mx-auto px-4">
          <div data-aos="fade-up" className="max-w-5xl mx-auto">
            <DonationCard />
          </div>
        </div>
      </section>

      {/* The Kisobooka Campaign Section */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Campaign Image */}
            <div data-aos="fade-right" className="relative">
              <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 w-full max-w-md mx-auto lg:mr-auto">
                <img
                  src="/KISOBOOKA.jpg"
                  alt="The Kisobooka Campaign - SSENA HEALING AFRICA"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Side - Article */}
            <div data-aos="fade-left" className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                The Kisobooka Campaign
              </h2>
              <div className="prose prose-lg text-muted-foreground mx-auto lg:mx-0 space-y-4">
                <p className="mb-4">
                  The <strong>Kisobooka Campaign</strong> is an impactful community health initiative spearheaded by <strong>SSENA Healing Africa</strong> in active partnership with the <strong>Rotary Club of Kampala Kibuli</strong>, <strong>Rotaract Club of Upper Kibuli</strong>, and <strong>Rotaract Club of Kampala-Kibuli</strong>.
                </p>
                <p className="mb-4">
                  Our core mission through this initiative is to break stigma and transform lives by tackling critical <strong>Mental Health</strong> and <strong>Sickle Cell Awareness</strong> challenges across our societies, schools, hospitals, and local communities.
                </p>

                {isExpanded && (
                  <div className="animate-fade-in space-y-4">
                    <p>
                      Through interactive community workshops, digital media campaigns, educational seminars, and direct hospital outreach programs, we empower young people and families with essential health knowledge, emotional resilience tools, and peer support networks.
                    </p>
                    <p>
                      <em>"Kisobooka"</em>—meaning <strong>"It Is Possible"</strong>—serves as a beacon of hope, inspiring individuals facing mental health challenges or sickle cell conditions to seek early care, embrace solidarity, and live fulfilling lives.
                    </p>
                    <p>
                      We warmly invite community leaders, educational institutions, healthcare professionals, and volunteers to partner with us as we expand our educational campaigns and medical support drives across Uganda.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                {!isExpanded ? (
                  <Button
                    onClick={() => setIsExpanded(true)}
                    className="bg-primary text-white hover:bg-primary/90 rounded-full px-8"
                  >
                    Read More
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsExpanded(false)}
                    className="bg-primary text-white hover:bg-primary/90 rounded-full px-8"
                  >
                    Show Less
                  </Button>
                )}
              </div>

              <div className="mt-8 border-t border-border/50 pt-6 inline-block w-full">
                <h4 className="text-xl font-bold text-foreground">SSENA HEALING AFRICA & ROTARY PARTNERSHIP</h4>
                <p className="text-primary font-medium">Mental Health & Sickle Cell Awareness Initiative</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 bg-background">
        <div data-aos="zoom-in" className="relative bg-black rounded-[2.5rem] py-16 text-center shadow-2xl overflow-hidden border border-white/10">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-[0.2]">
            <img src="/BOY CHILD 5.webp" alt="Join SSENA HEALING AFRICA to support mental health and therapy projects" className="w-full h-full object-cover" />
          </div>

          <div className="container-narrow mx-auto relative z-10 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
              Whether you want to volunteer, donate, or partner with us, there are many ways to support our mission of healing and mental wellness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold" asChild>
                <Link to="/contact">Contact Us Today</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black" asChild>
                <Link to="/what-we-do">What We Do</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
