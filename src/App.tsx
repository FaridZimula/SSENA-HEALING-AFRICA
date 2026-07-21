import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Leadership from "./pages/Leadership";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import SplashScreen from "@/components/SplashScreen";
import Register from "./pages/Register";
import Donate from "./pages/Donate";
import DonatePay from "./pages/DonatePay";

// Admin Imports
import Login from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import Messages from "./pages/admin/Messages";
import ProjectsEditor from "./pages/admin/ProjectsEditor";
import LeadershipEditor from "./pages/admin/LeadershipEditor";
import PartnersEditor from "./pages/admin/PartnersEditor";
import Members from "./pages/admin/Members";
import Donations from "./pages/admin/Donations";
import VideosEditor from "./pages/admin/VideosEditor";
import ScrollToTop from "./components/ScrollToTop";

import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Initialize AOS
    try {
      AOS.init({
        duration: 1000,
        once: true,
        easing: "ease-out-cubic",
        offset: 100,
      });
    } catch (e) {
      console.warn("AOS initialization failed", e);
    }

    // Force hide splash screen after 4 seconds
    const timer = setTimeout(() => {
      console.log("Hiding splash screen");
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <DataProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/leadership" element={<Leadership />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/donate" element={<Donate />} />
                  <Route path="/donate/pay" element={<DonatePay />} />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<Login />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Messages />} />
                    <Route path="members" element={<Members />} />
                    <Route path="projects" element={<ProjectsEditor />} />
                    <Route path="leadership" element={<LeadershipEditor />} />
                    <Route path="partners" element={<PartnersEditor />} />
                    <Route path="donations" element={<Donations />} />
                    <Route path="videos" element={<VideosEditor />} />
                  </Route>

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </DataProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
