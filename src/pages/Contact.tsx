import { useState } from "react";
import Layout from "@/components/layout/Layout";
import DonationCard from "@/components/DonationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-youth.jpg";
import { useData } from "@/context/DataContext";
import { API_URL } from "@/config";
import { supabase } from "@/lib/supabase";

const Contact = () => {
  const { toast } = useToast();
  const { addMessage } = useData();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Use Supabase directly for faster delivery and real-time triggers
    supabase
      .from('messages')
      .insert([{
        full_name: formData.name,
        email: formData.email,
        subject: formData.subject,
        content: formData.message,
      }])
      .then(({ error }) => {
        if (error) throw error;
        setIsSubmitting(false);
        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. We'll get back to you soon.",
        });
        setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
      })
      .catch((err) => {
        setIsSubmitting(false);
        toast({
          title: "Error",
          description: "Could not send message. Please try again.",
          variant: "destructive",
        });
        console.error("Contact error:", err);
      });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <SEO
        title="Contact Us | SSENA HEALING AFRICA"
        description="Have questions or want to partner with us? Reach out to SSENA HEALING AFRICA via our contact form, email, or visit our office."
      />
      {/* Hero Section */}
      <section className="bg-zinc-900 section-padding relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.15]">
          <img
            src="/KINGS 1.webp"
            alt="Contact SSENA HEALING AFRICA - Support and Inquiries"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-narrow mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6">
            Contact SSENA HEALING AFRICA
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Have questions? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Info */}
            <div data-aos="fade-right" className="lg:col-span-7">


              <div className="grid md:grid-cols-2 gap-6">
                {/* Call Us */}
                <div className="bg-primary rounded-2xl p-8 text-center card-elevated border border-white/10 shadow-lg">
                  <div className="w-14 h-14 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/10">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-lg mb-2">Call us</h4>
                  <div className="space-y-1">
                    <p className="text-white/90 text-base">+256 705206985</p>
                  </div>
                </div>

                {/* Email Us */}
                <div className="bg-primary rounded-2xl p-8 text-center card-elevated border border-white/10 shadow-lg">
                  <div className="w-14 h-14 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/10">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-lg mb-2">Email us</h4>
                  <div className="space-y-1">
                    <p className="text-white/90 text-base font-semibold">ssenahealingafrica@gmail.com</p>
                    <p className="text-white/80 text-sm">ssenabulyasimon670@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div data-aos="fade-left" className="lg:col-span-5">
              <div className="bg-black border border-neutral-800 rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-primary mb-6">
                  Send us a message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-primary text-base font-semibold">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your Name"
                      className="bg-white border-none py-6 text-base placeholder:text-muted-foreground/50"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-primary text-base font-semibold">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="Your Phone"
                      className="bg-white border-none py-6 text-base placeholder:text-muted-foreground/50"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-primary text-base font-semibold">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      className="bg-white border-none py-6 text-base placeholder:text-muted-foreground/50"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-primary text-base font-semibold">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Subject"
                      className="bg-white border-none py-6 text-base placeholder:text-muted-foreground/50"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-primary text-base font-semibold">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your Message"
                      className="bg-white border-none min-h-[120px] text-base placeholder:text-muted-foreground/50"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-bold shadow-lg mt-2 border border-white/10"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* FAQ Section */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div data-aos="fade-up" className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "How can I volunteer with SSENA HEALING AFRICA?",
                  a: "We welcome volunteers for various programs. Fill out the contact form above or email us at ssenahealingafrica@gmail.com to learn about current opportunities.",
                },
                {
                  q: "How can my organization partner with SSENA HEALING AFRICA?",
                  a: "We're always open to partnerships that align with our mission. Contact us to discuss collaboration opportunities.",
                },
                {
                  q: "How are donations used?",
                  a: "Donations directly support our programs, including scholarships, training materials, and community outreach activities. We maintain full transparency in our financial reports.",
                },
                {
                  q: "Can I support a specific project?",
                  a: "Yes! You can choose to direct your support to specific initiatives. Contact us to learn more about targeted giving options.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-primary rounded-xl p-6">
                  <h4 className="font-semibold text-white mb-2">{faq.q}</h4>
                  <p className="text-white/90 text-lg">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
