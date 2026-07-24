import { ReactNode, useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SEO from "../SEO";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when page is scrolled down 400px
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen flex flex-col w-full max-w-[100vw] overflow-x-hidden">
      <SEO />
      <Navbar />
      <main className="flex-1 pt-20 md:pt-32 w-full max-w-[100vw] overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
