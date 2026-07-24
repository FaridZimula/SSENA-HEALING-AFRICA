import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Our Profile", path: "/profile" },
  { name: "What We Do", path: "/what-we-do" },
  { name: "Projects", path: "/projects" },
  { name: "Donate", path: "/donate" },
  { name: "Contact Us", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar - Visible on Mobile and Desktop */}
      <div className="bg-primary text-primary-foreground py-1.5 px-3 sm:px-6 lg:px-8">
        <div className="container-narrow mx-auto flex justify-between items-center text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">+256 705 206 985 / +256 763 238 667</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span>ssenahealingafrica@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-background/95 backdrop-blur-md border-b border-border shadow-sm w-full">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 w-full">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img
                src="/SSENA LOGO.png"
                alt="SSENA HEALING AFRICA Logo"
                className="h-11 sm:h-16 w-auto object-contain shrink-0"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center gap-1 mx-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${location.pathname === link.path
                    ? "bg-black text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Container: Action Buttons + Prominent Green Hamburger Menu */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-white">
                  <Link to="/donate">Donate</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>

              {/* Prominent Green Menu Button - PINNED TO TOP RIGHT ALWAYS */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 flex items-center justify-center shadow-lg transition-all active:scale-95 z-50 shrink-0 cursor-pointer border border-white/20"
                aria-label="Toggle Navigation Menu"
              >
                {isOpen ? (
                  <X className="w-6 h-6 stroke-[3]" />
                ) : (
                  <Menu className="w-6 h-6 stroke-[3]" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation Dropdown Menu - Opens cleanly on all screens */}
          {isOpen && (
            <div className="py-4 border-t border-border animate-fade-in bg-background shadow-2xl rounded-b-2xl w-full">
              <div className="flex flex-col gap-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${location.pathname === link.path
                      ? "bg-black text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="px-4 py-3 border-t border-border mt-2 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                    <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
                    <span>+256 705 206 985 / +256 763 238 667</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>ssenahealingafrica@gmail.com</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2 px-2">
                  <Button variant="outline" asChild className="w-full border-primary text-primary hover:bg-primary hover:text-white font-bold">
                    <Link to="/donate" onClick={() => setIsOpen(false)}>
                      Donate
                    </Link>
                  </Button>
                  <Button asChild className="w-full font-bold">
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
