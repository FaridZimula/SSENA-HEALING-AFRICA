import Layout from "@/components/layout/Layout";
import { Linkedin, Mail } from "lucide-react";
// Images are now loaded from the public directory
import heroImage from "@/assets/hero-youth.jpg";
import { useData } from "@/context/DataContext";
import SEO from "@/components/SEO";

const Leadership = () => {
  const { leaders, boardMembers } = useData();

  return (
    <Layout>
      <SEO
        title="Our Leadership | SUYEL Board & Executive Team"
        description="Meet the dedicated leaders and board members of SUYEL driving youth empowerment initiatives in Uganda."
      />
      {/* Hero Section */}
      <section className="hero-gradient section-padding relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.15]">
          <img
            src="/Slide 1.jpg"
            alt="SUYEL Leadership Team at Youth Empowerment Event"
            className="w-full h-full object-cover"
          />
        </div>
        <div data-aos="fade-up" className="container-narrow mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-6">
            Our Leadership
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Meet the dedicated team driving our mission to empower youth across communities.
          </p>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div data-aos="fade-up" className="text-center max-w-2xl mx-auto mb-12">

            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mt-2 mb-4">
              Board of Directors
            </h2>
            <p className="text-muted-foreground text-lg">
              Our experienced leaders bring diverse expertise and a shared passion for youth empowerment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {leaders.map((leader, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-card rounded-2xl overflow-hidden card-elevated flex flex-col sm:flex-row"
              >
                <div className="sm:w-48 flex-shrink-0">
                  <img
                    src={leader.image}
                    alt={`${leader.name} - ${leader.role} at Step Up Uganda Youth Empowerment League`}
                    className={`w-full aspect-[3/4] object-cover ${leader.name === "KIRUNDA MUHAWUYA" ? "[transform:scaleX(-1)]" : ""}`}
                  />
                </div>
                <div className="p-6 flex-1 text-center flex flex-col justify-center">
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-3">
                    {leader.role}
                  </p>
                  <p className="text-muted-foreground text-lg mb-4">
                    {leader.bio}
                  </p>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="section-padding bg-secondary">
        <div className="container-narrow mx-auto">
          <div data-aos="fade-up" className="text-center max-w-2xl mx-auto mb-12">

            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mt-2 mb-4">
              Executive Committee
            </h2>
            <p className="text-muted-foreground text-lg">
              Our board provides strategic oversight and ensures we stay true to our mission.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {boardMembers.map((member, index) => (
              <div
                key={index}
                data-aos="zoom-in"
                data-aos-delay={index * 50}
                className="bg-card rounded-xl p-6 text-center card-elevated"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role} of SUYEL Executive Committee`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">
                  {member.name}
                </h4>
                <p className="text-primary font-medium text-xs">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div data-aos="zoom-in" className="relative bg-black rounded-2xl p-8 md:p-12 text-center overflow-hidden border border-white/10">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-[0.2]">
              <img src="/Slide3.jpg" alt="SUYEL team members collaborating for youth development" className="w-full h-full object-cover" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Join Our Growing Team
              </h2>
              <p className="text-white/90 text-lg max-w-xl mx-auto mb-6">
                We're always looking for passionate individuals who share our commitment to youth empowerment. Explore opportunities to make a difference.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Leadership;
