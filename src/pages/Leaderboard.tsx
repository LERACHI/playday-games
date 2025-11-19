import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLeaderboard, LeaderboardEntry } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Leaderboard = () => {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'xp' | 'wins' | 'level'>('xp');
  const { toast } = useToast();

  useEffect(() => {
    loadLeaderboard();
  }, [sortBy]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getLeaderboard({ limit: 50, sortBy });
      setPlayers(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar ranking",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-gaming-orange fill-gaming-orange" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-muted-foreground" />;
    if (rank === 3) return <Award className="h-6 w-6 text-gaming-orange/60" />;
    return <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gaming-cyan" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-4 text-gradient">Ranking Global</h1>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => setSortBy('xp')} className={sortBy === 'xp' ? "bg-gradient-gaming" : ""}>Por XP</Button>
            <Button onClick={() => setSortBy('wins')} variant="outline">Por Vitórias</Button>
            <Button onClick={() => setSortBy('level')} variant="outline">Por Nível</Button>
          </div>
        </div>
        <Card className="glass-card p-6">
          {players.map((player) => (
            <div key={player.id} className="flex items-center gap-4 p-4 rounded-lg bg-background/50 mb-2">
              <div className="w-12">{getRankBadge(player.rank)}</div>
              <img src={player.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}`} className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <h3 className="font-bold">{player.username}</h3>
                <p className="text-sm text-muted-foreground">{player.total_matches} partidas</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gradient">{player.xp.toLocaleString()} XP</p>
                <Badge>{player.wins} vitórias</Badge>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
