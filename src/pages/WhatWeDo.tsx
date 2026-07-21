import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MessagesSquare, 
  ShieldAlert, 
  Activity, 
  Users, 
  TrendingUp, 
  Mic, 
  Compass, 
  HeartHandshake, 
  Brain, 
  Home, 
  AlertCircle, 
  Frown, 
  Sparkles, 
  Smile, 
  GraduationCap,
  ArrowRight,
  Phone,
  Mail
} from "lucide-react";

const services = [
  {
    number: "01",
    title: "Talk Therapy Sessions",
    description: "One-on-one professional counseling sessions offering a safe, non-judgmental space to talk, express feelings, and navigate life's challenges.",
    icon: MessagesSquare,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100"
  },
  {
    number: "02",
    title: "Substance Abuse & Addiction Counseling",
    description: "Compassionate, professional counseling and rehabilitation guidance for individuals struggling with chemical dependency or behavioral addictions.",
    icon: ShieldAlert,
    color: "bg-red-50 text-red-600 border-red-100"
  },
  {
    number: "03",
    title: "Behavioral Disorder Counseling",
    description: "Helping youth and adults manage anti-social tendencies, behavioral disorders, and self-regulation challenges for healthier social integration.",
    icon: Activity,
    color: "bg-blue-50 text-blue-600 border-blue-100"
  },
  {
    number: "04",
    title: "Team Building Sessions",
    description: "Interactive workshops and group dynamics designed to foster trust, communication, and mutual understanding in schools and corporate spaces.",
    icon: Users,
    color: "bg-purple-50 text-purple-600 border-purple-100"
  },
  {
    number: "05",
    title: "Self-Esteem & Capacity Development",
    description: "Dedicated mentorship and empowerment sessions aimed at building confidence, self-worth, and core personal competencies.",
    icon: TrendingUp,
    color: "bg-amber-50 text-amber-600 border-amber-100"
  },
  {
    number: "06",
    title: "Public Speaking Classes",
    description: "Comprehensive training to develop vocal projection, positive body language, and structured presentation skills for confident expression.",
    icon: Mic,
    color: "bg-orange-50 text-orange-600 border-orange-100"
  },
  {
    number: "07",
    title: "Career Guidance",
    description: "Empowering students and job-seekers to discover their potential, chart career paths, and build interview readiness.",
    icon: Compass,
    color: "bg-cyan-50 text-cyan-600 border-cyan-100"
  },
  {
    number: "08",
    title: "Peer Counseling",
    description: "Peer-led emotional support networks and guidance, helping individuals connect, share experiences, and heal collaboratively.",
    icon: HeartHandshake,
    color: "bg-pink-50 text-pink-600 border-pink-100"
  },
  {
    number: "09",
    title: "Mental Health Assessment & Support",
    description: "Detailed evaluations and support plans to identify mental health needs and formulate personalized paths to recovery.",
    icon: Brain,
    color: "bg-indigo-50 text-indigo-600 border-indigo-100"
  },
  {
    number: "10",
    title: "Family Therapy",
    description: "Structured sessions helping families resolve conflicts, improve communication, and strengthen relational bonds.",
    icon: Home,
    color: "bg-teal-50 text-teal-600 border-teal-100"
  },
  {
    number: "11",
    title: "Crisis Counseling",
    description: "Immediate short-term emotional and behavioral support for individuals experiencing acute distress or traumatic life situations.",
    icon: AlertCircle,
    color: "bg-rose-50 text-rose-600 border-rose-100"
  },
  {
    number: "12",
    title: "Stress, Anxiety, Depression & Trauma Counseling",
    description: "Clinical, therapeutic counseling to manage anxiety disorders, clinical depression, chronic stress, and deep emotional trauma.",
    icon: Frown,
    color: "bg-violet-50 text-violet-600 border-violet-100"
  },
  {
    number: "13",
    title: "Trauma Healing Workshops",
    description: "Structured community workshops teaching practical therapeutic techniques and coping mechanisms for trauma recovery.",
    icon: Sparkles,
    color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100"
  },
  {
    number: "14",
    title: "Child Self-Discovery Sessions",
    description: "Creative, child-friendly development sessions assisting children in identifying strengths, emotional expressions, and self-identity.",
    icon: Smile,
    color: "bg-lime-50 text-lime-600 border-lime-100"
  },
  {
    number: "15",
    title: "School Counseling Sessions",
    description: "Partnering with educational institutions to provide student-centered emotional care, counseling, and behavioral support.",
    icon: GraduationCap,
    color: "bg-sky-50 text-sky-600 border-sky-100"
  }
];

const WhatWeDo = () => {
  return (
    <Layout>
      <SEO
        title="What We Do | SSENA HEALING AFRICA"
        description="Explore our mental health, counseling, and therapy services including trauma healing, substance abuse counseling, and family therapy in Uganda."
      />

      {/* Hero Section */}
      <section className="bg-zinc-900 section-padding relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.15]">
          <img
            src="/Sanitary 1.webp"
            alt="SSENA HEALING AFRICA community service"
            className="w-full h-full object-cover"
          />
        </div>
        <div data-aos="fade-up" className="container-narrow mx-auto text-center relative z-10 text-white">

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            Healing Hearts, Rebuilding Lives
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto leading-relaxed">
            At SSENA HEALING AFRICA, we are dedicated to offering professional, confidential, and comprehensive counseling and therapy services. Discover how we support individuals, families, and communities.
          </p>
        </div>
      </section>

      {/* Core Slogan Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 bg-background">
        <div data-aos="zoom-in" className="container-narrow mx-auto text-center">
          <div className="bg-primary text-white py-10 px-8 rounded-[2.5rem] shadow-xl border border-white/10 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight uppercase mb-2">
              "Your Mental health is our Priority"
            </h2>
            <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto mt-2 leading-relaxed">
              We provide professional counseling, trauma healing workshops, and specialized mental health support programs tailored to guide you on the path of emotional wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background pt-6">
        <div className="container-narrow mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index % 3 * 100}
                  className="bg-card border border-border/80 rounded-[2rem] p-8 card-elevated hover:border-primary transition-all duration-300 flex flex-col justify-between group shadow-sm"
                >
                  <div>
                    {/* Header: Number and Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-4xl font-black text-primary tracking-tighter transition-colors">
                        {service.number}
                      </span>
                      <div className="w-14 h-14 rounded-full bg-black text-primary flex items-center justify-center border border-neutral-800 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-7 h-7" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-snug">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* bottom CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 bg-background">
        <div className="container-narrow mx-auto">
          <div data-aos="zoom-in" className="relative bg-black rounded-[2.5rem] py-12 text-center shadow-2xl overflow-hidden border border-white/10">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-[0.15]">
              <img src="/BOY CHILD 5.webp" alt="Support mental health in Africa" className="w-full h-full object-cover" />
            </div>

            <div className="relative z-10 px-6 max-w-3xl mx-auto text-white">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
                Ready to Start Your Journey to Healing?
              </h2>
              <p className="text-white/90 text-lg mb-6 leading-relaxed">
                Reach out to us today to book a talk therapy session, join a community trauma healing workshop, or request school counseling. Our team is here to support you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-full px-8 shadow-lg shadow-primary/20 w-full sm:w-auto" asChild>
                  <Link to="/contact">
                    Contact Us Today
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black h-14 rounded-full px-8 w-full sm:w-auto" asChild>
                  <Link to="/donate">Support Our Mission</Link>
                </Button>
              </div>

              {/* Quick contact info */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-white/80 font-medium">
                <a href="tel:+256705206985" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>+256 705 206 985</span>
                </a>
                <a href="mailto:ssenahealingafrica@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>ssenahealingafrica@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WhatWeDo;
