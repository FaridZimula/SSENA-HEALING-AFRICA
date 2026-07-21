import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Target, Eye, Heart, Users, Award, Lightbulb, Globe, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-youth.jpg";
import SEO from "@/components/SEO";

const LaunchSlideshow = () => {
  const [current, setCurrent] = useState(1);
  const total = 10;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev % total) + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {Array.from({ length: total }).map((_, i) => {
        const num = i + 1;
        return (
          <img
            key={num}
            src={`/Speaker ${num}.jpeg`}
            alt={`SUYEL Launch Event - Speaker ${num} discussing youth empowerment strategy`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${current === num ? "opacity-100 scale-105" : "opacity-0 scale-100"
              } duration-[4000ms]`}
          />
        );
      })}
    </>
  );
};

const values = [
  {
    icon: Heart,
    title: "Integrity",
    description: "We uphold the highest standards of honesty and transparency in all our actions.",
  },
  {
    icon: Users,
    title: "Inclusion",
    description: "We embrace diversity and ensure equal opportunities for all young people.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We continuously seek creative solutions to address youth challenges.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for the highest quality in all our programs and initiatives.",
  },
];

const Profile = () => {
  return (
    <Layout>
      <SEO
        title="Our Profile | Vision, Mission & Values of SUYEL"
        description="Learn about SUYEL's history, mission to build tomorrow's leaders, and our core values of integrity and inclusion."
      />
      {/* Hero Section */}
      <section className="hero-gradient section-padding relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.15]">
          <img
            src="/Our profile.jpg"
            alt="SUYEL Organization Profile and Values"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-narrow mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-6">
            Our Profile
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Learn about who we are, what drives us, and our commitment to youth empowerment.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right" className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-accent/50 shadow-lg border border-border/50 flex items-center justify-center">
                <img
                  src="/Milestone 2.jpg"
                  alt="SUYEL Accomplishments and Community Milestones"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div data-aos="fade-left">
              <h2 className="text-3xl font-bold text-foreground mb-6 text-center md:text-left">About SUYEL</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Step Up Uganda Youth Empowerment League (SUYEL) is a non-governmental organization dedicated to transforming the lives of young people through comprehensive empowerment programs. Founded with the belief that every young person deserves the opportunity to reach their full potential, we work tirelessly to break down barriers and create pathways to success.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Our organization operates at the intersection of education, skills development, and community engagement. We understand that true empowerment requires a holistic approach—one that addresses not just immediate needs but also builds long-term capacity for sustainable change.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Since our inception, SUYEL has impacted thousands of young lives across multiple communities. Through partnerships with local organizations, government agencies, and international bodies, we continue to expand our reach and deepen our impact. Learn more about the [dedicated team](file:///leadership) behind these initiatives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* President Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-narrow mx-auto">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div data-aos="fade-up" className="md:col-span-5 lg:col-span-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="/Presidents photo.jpg"
                  alt="KIRUNDA MUHAWUYA - President"
                  className="w-full h-full object-cover [transform:scaleX(-1)]"
                />
              </div>
            </div>
            <div data-aos="fade-up" data-aos-delay="200" className="md:col-span-7 lg:col-span-8">
              <h2 className="text-3xl font-bold text-foreground mb-2 text-center md:text-left">Message from the President</h2>
              <h3 className="text-xl font-semibold text-primary mb-6 text-center md:text-left">KIRUNDA MUHAWUYA</h3>
              <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-primary/80 italic mb-6 border-l-4 border-primary pl-6">
                "Together, we can build a future where every young person has the opportunity to thrive, lead, and make a lasting impact on their community."
              </blockquote>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our commitment to youth empowerment drives every initiative we undertake. We believe in the power of the next generation to transform our society.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right" className="text-center md:text-left">

              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-6">
                Building Tomorrow's Leaders Today
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                SUYEL is dedicated to empowering young people through education, skills development, and community engagement. We provide the tools, mentorship, and opportunities they need to become agents of positive change.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Our holistic approach addresses the unique challenges facing youth today, from access to quality education to employment opportunities and civic participation.
              </p>
              <Button asChild size="lg" className="text-lg">
                <Link to="/projects">
                  Learn More About Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Vision */}
              <div data-aos="zoom-in" data-aos-delay="0" className="bg-primary rounded-2xl p-6 card-elevated h-fit flex items-start gap-4 text-left">
                <Target className="w-10 h-10 text-white shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white text-xl mb-2">Vision</h3>
                  <p className="text-base text-white/95 leading-relaxed">
                    We envision an inclusive future where every individual has the opportunity to thrive in a supportive and empowered community, creating brighter and more equitable Africa for generations to come.
                  </p>
                </div>
              </div>

              {/* Mission */}
              <div data-aos="zoom-in" data-aos-delay="100" className="bg-primary rounded-2xl p-6 card-elevated h-fit flex items-start gap-4 text-left">
                <Heart className="w-10 h-10 text-white shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white text-xl mb-2">Mission</h3>
                  <p className="text-base text-white/95 leading-relaxed">
                    To empower women, children and youth in communities through education, health initiatives, economic development and social work fostering sustainable growth and resilience across Africa.
                  </p>
                </div>
              </div>

              {/* Slogan - Full Width */}
              <div data-aos="zoom-in" data-aos-delay="200" className="sm:col-span-2 bg-gradient-to-r from-primary via-primary/95 to-primary rounded-2xl p-6 md:p-8 card-elevated flex flex-col items-center text-center space-y-3">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                  Our Slogan
                </span>
                <h3 className="text-lg sm:text-2xl font-extrabold text-white leading-relaxed italic max-w-3xl">
                  "Empowering Minds, Enriching Communities Together, Towards a Visionary Africa and Sustainable Tomorrow."
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div data-aos="fade-up" className="text-center max-w-2xl mx-auto mb-12">

            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground text-lg">
              These principles guide everything we do and shape how we serve our communities.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} data-aos="flip-up" data-aos-delay={index * 100} className="group h-64 [perspective:1000px]">
                <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front Face */}
                  <div className="absolute inset-0 h-full w-full bg-primary rounded-2xl flex flex-col items-center justify-center p-6 [backface-visibility:hidden] card-elevated">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 border-2 border-white/20 bg-white/5">
                      <value.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {value.title}
                    </h3>
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 h-full w-full bg-primary rounded-2xl flex flex-col items-center justify-center p-6 [transform:rotateY(180deg)] [backface-visibility:hidden] card-elevated">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-white/90 text-lg text-center">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Launch Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-primary/10">
            {/* Text Content - Left Side */}
            <div data-aos="fade-right" className="w-full md:w-1/2 space-y-6 text-left">
              <span className="inline-block px-4 py-1.5 bg-primary text-white rounded-full text-sm font-semibold mb-2">
                THE SUYEL LAUNCH
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Organization Launch: A New Era Begins
              </h2>
              <div className="w-20 h-1.5 bg-primary rounded-full"></div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The official launch of the Step Up Uganda Youth Empowerment League (SUYEL) took place on January 25th, 2025. It was a momentous occasion where organization members, and particularly the board members, engaged in insightful discussions regarding the year's strategic plans and the roadmap to elevate SUYEL to new heights.
              </p>
            </div>

            {/* Slideshow - Right Side */}
            <div data-aos="fade-left" className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <LaunchSlideshow />
              </div>
            </div>
          </div>
        </div>
      </section>


    </Layout>
  );
};

export default Profile;
