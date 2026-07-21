import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Our Profile", path: "/profile" },
  { name: "Leadership", path: "/leadership" },
  { name: "Projects", path: "/projects" },
  { name: "Donate", path: "/donate" },
  { name: "Contact Us", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4 sm:px-6 lg:px-8 hidden md:block">
        <div className="container-narrow mx-auto flex justify-between items-center text-sm font-medium">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+256 705 206 985 / +256 763 238 667</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>ssenahealingafrica@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/SSENA LOGO.jpg"
                alt="SSENA HEALING AFRICA Logo"
                className="h-16 w-auto object-contain rounded-lg"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-base font-semibold transition-all duration-200 ${location.pathname === link.path
                    ? "bg-black text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-white">
                <Link to="/donate">Donate</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent text-foreground"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden py-4 border-t border-border animate-fade-in bg-background">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${location.pathname === link.path
                      ? "bg-black text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="px-4 py-2 border-t border-border mt-2 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>+256 705 206 985 / +256 763 238 667</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Mail className="w-4 h-4" />
                    <span>ssenahealingafrica@gmail.com</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Button variant="outline" asChild className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                    <Link to="/donate" onClick={() => setIsOpen(false)}>
                      Donate
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
