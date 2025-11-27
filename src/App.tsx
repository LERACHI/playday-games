import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Store from "./pages/Store";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PoolGamePage from "./pages/PoolGamePage";
import ArcadeCollection from "./pages/ArcadeCollection";
import OfflineGames from "./pages/OfflineGames";
import GamePlaceholder from "./pages/GamePlaceholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />

        <HashRouter>

          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/store" element={<Store />} />
            <Route path="/game/pool" element={<PoolGamePage />} />
            <Route path="/game/:id" element={<GamePlaceholder />} />
            <Route path="/arcade" element={<ArcadeCollection />} />
            <Route path="/offline" element={<OfflineGames />} />

            {/* CATCH-ALL */}
            <Route path="*" element={<NotFound />} />
          </Routes>

        </HashRouter>

      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
