import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Resorts from "./pages/Resorts";
import ResortDetail from "./pages/ResortDetail";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Destinations from "./pages/Destinations";
import StaticPage from "./pages/StaticPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/resorts" element={<Resorts />} />
          <Route path="/resort/:id" element={<ResortDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/about" element={<StaticPage title="About Vanya Stays" subtitle="Our story, mission, and values." />} />
          <Route path="/careers" element={<StaticPage title="Careers" subtitle="Join the Vanya Stays team." />} />
          <Route path="/press" element={<StaticPage title="Press" subtitle="Latest news and media resources." />} />
          <Route path="/blog" element={<StaticPage title="Blog" subtitle="Travel stories and guides from across India." />} />
          <Route path="/help" element={<StaticPage title="Help Center" subtitle="Get answers to common questions." />} />
          <Route path="/safety" element={<StaticPage title="Safety Information" subtitle="Your safety is our priority." />} />
          <Route path="/cancellation" element={<StaticPage title="Cancellation Policy" subtitle="Understand your options." />} />
          <Route path="/covid" element={<StaticPage title="COVID-19 Guidelines" subtitle="Latest health and travel guidance." />} />
          <Route path="/terms" element={<StaticPage title="Terms of Service" subtitle="Our terms and conditions." />} />
          <Route path="/privacy" element={<StaticPage title="Privacy Policy" subtitle="How we protect your data." />} />
          <Route path="/cookies" element={<StaticPage title="Cookie Policy" subtitle="Learn about our cookies usage." />} />
          <Route path="/sitemap" element={<StaticPage title="Sitemap" subtitle="Quick links across the site." />} />
          <Route path="/partner" element={<StaticPage title="List Your Property" subtitle="Partner with Vanya Stays." />} />
          <Route path="/partner/dashboard" element={<StaticPage title="Partner Dashboard" subtitle="Manage your property listings." />} />
          <Route path="/affiliate" element={<StaticPage title="Affiliate Program" subtitle="Earn with Vanya Stays referrals." />} />
          <Route path="/corporate" element={<StaticPage title="Corporate Travel" subtitle="Business travel solutions." />} />
          <Route path="/forgot-password" element={<StaticPage title="Reset Password" subtitle="Recover access to your account." />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
