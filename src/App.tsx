
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import PageTransition from "@/components/layout/PageTransition";
import Index from "./pages/Index";
import BestXI from "./pages/BestXI";
import PlayerComparison from "./pages/PlayerComparison";
import LeagueStats from "./pages/LeagueStats";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Create a wrapper component to handle the routes inside PageTransition
const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <PageTransition>
      <Routes location={location}>
        <Route path="/" element={<Index />} />
        <Route path="/best-xi" element={<BestXI />} />
        <Route path="/player-comparison" element={<PlayerComparison />} />
        <Route path="/league-stats" element={<LeagueStats />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Header />
          <AppRoutes />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
