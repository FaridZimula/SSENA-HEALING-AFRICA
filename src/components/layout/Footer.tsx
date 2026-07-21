import { Link } from "react-router-dom";
import { Mail, Phone, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container-narrow mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="flex justify-center mb-2">
              <img
                src="/SSENA LOGO.jpg"
                alt="SSENA HEALING AFRICA"
                className="h-16 object-contain rounded-lg"
              />
            </div>
            <p className="text-base sm:text-lg opacity-90 leading-relaxed italic font-medium">
              "Empowering Minds, Enriching Communities Together, Towards a Visionary Africa and Sustainable Tomorrow."
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-primary">Quick Links</h4>
            <ul className="space-y-3">
              {["Home", "Our Profile", "What We Do", "Projects", "Donate", "Contact Us"].map((link) => (
                <li key={link}>
                  <Link
                    to={link === "Home" ? "/" : `/${link.toLowerCase().replace(" ", "-").replace("our-", "").replace("-us", "")}`}
                    className="text-lg opacity-80 hover:opacity-100 hover:text-primary transition-all hover:underline"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-primary">Contact Us</h4>
            <ul className="space-y-4">

              <li className="flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-lg opacity-80">+256 705 206 985</span>
                </div>
                <span className="text-base opacity-80">+256 763 238 667</span>
              </li>
              <li className="flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-lg opacity-80">ssenahealingafrica@gmail.com</span>
                </div>
                <span className="text-base opacity-70">ssenabulyasimon670@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-primary">Follow Us</h4>
            <div className="flex justify-center gap-4">
              <a
                href="https://www.instagram.com/step_up_uganda?igsh=aHpoM3F0YTJ3d2xh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@suyel70?_r=1&_t=ZM-92opK5t6jwi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
              <a
                href="https://x.com/SuyelAc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className="text-lg opacity-80 mt-6">
              Stay connected and join our community of changemakers.
            </p>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col justify-center items-center gap-4 text-center">
          <p className="text-lg opacity-70">
            © {new Date().getFullYear()} Ssena Healing Africa. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-lg opacity-70 hover:opacity-100 transition-opacity hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="text-lg opacity-70 hover:opacity-100 transition-opacity hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer >
  );
};

export default Footer;
