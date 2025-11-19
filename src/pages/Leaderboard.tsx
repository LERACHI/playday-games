import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Leaderboard = () => {
  const players = [
    {
      rank: 1,
      username: "ProGamer2024",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ProGamer2024",
      xp: 125450,
      wins: 1243,
      winRate: 78.5,
      trending: "up",
    },
    {
      rank: 2,
      username: "QueenOfGames",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=QueenOfGames",
      xp: 119800,
      wins: 1156,
      winRate: 76.2,
      trending: "up",
    },
    {
      rank: 3,
      username: "SpeedRunner",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SpeedRunner",
      xp: 115230,
      wins: 1089,
      winRate: 74.8,
      trending: "down",
    },
    {
      rank: 4,
      username: "MasterChief",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MasterChief",
      xp: 108900,
      wins: 1021,
      winRate: 73.1,
      trending: "up",
    },
    {
      rank: 5,
      username: "NinjaPlayer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NinjaPlayer",
      xp: 102340,
      wins: 967,
      winRate: 71.5,
      trending: "up",
    },
    {
      rank: 6,
      username: "GamerGirl",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GamerGirl",
      xp: 98700,
      wins: 934,
      winRate: 70.2,
      trending: "up",
    },
    {
      rank: 7,
      username: "LegendKiller",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LegendKiller",
      xp: 94560,
      wins: 901,
      winRate: 69.4,
      trending: "down",
    },
    {
      rank: 8,
      username: "ShadowHunter",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ShadowHunter",
      xp: 89230,
      wins: 856,
      winRate: 68.1,
      trending: "up",
    },
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return <Trophy className="h-6 w-6 text-gaming-orange fill-gaming-orange" />;
    } else if (rank === 2) {
      return <Medal className="h-6 w-6 text-muted-foreground" />;
    } else if (rank === 3) {
      return <Award className="h-6 w-6 text-gaming-orange/60" />;
    }
    return <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-gaming-cyan/30 mb-4">
              <Trophy className="h-4 w-4 text-gaming-cyan" />
              <span className="text-sm font-medium text-foreground">Ranking Global</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-gradient">Melhores Jogadores</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Competidores de elite de todo o mundo. Você tem o que é preciso?
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            <Button className="bg-gradient-gaming">Semanal</Button>
            <Button variant="outline" className="border-gaming-cyan/30">Mensal</Button>
            <Button variant="outline" className="border-gaming-cyan/30">Todo Tempo</Button>
          </div>

          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {players.slice(0, 3).map((player, index) => (
              <Card
                key={player.username}
                className={`p-6 text-center glass-card border-gaming-cyan/30 ${
                  index === 0 ? "md:col-start-2 md:row-start-1 md:scale-110 bg-gradient-gaming/10" : ""
                }`}
              >
                <div className="mb-4 flex justify-center">
                  {getRankBadge(player.rank)}
                </div>
                <img
                  src={player.avatar}
                  alt={player.username}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gaming-cyan"
                />
                <h3 className="text-xl font-bold text-foreground mb-2">{player.username}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-gaming-cyan font-semibold">{player.xp.toLocaleString()}</span>
                    <span>XP</span>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <span>{player.wins} vitórias</span>
                    <Badge variant="secondary" className="bg-gaming-green/20 text-gaming-green">
                      {player.winRate}%
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Rest of the rankings */}
          <Card className="glass-card border-gaming-cyan/20">
            <div className="divide-y divide-border">
              {players.slice(3).map((player) => (
                <div
                  key={player.username}
                  className="p-4 hover:bg-gaming-cyan/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-12 flex justify-center">
                      {getRankBadge(player.rank)}
                    </div>

                    {/* Avatar & Name */}
                    <img
                      src={player.avatar}
                      alt={player.username}
                      className="w-12 h-12 rounded-full border-2 border-gaming-cyan/50"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{player.username}</h4>
                      <p className="text-sm text-muted-foreground">
                        {player.xp.toLocaleString()} XP
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{player.wins}</div>
                        <div className="text-muted-foreground">Vitórias</div>
                      </div>
                      <Badge variant="secondary" className="bg-gaming-green/20 text-gaming-green">
                        {player.winRate}% WR
                      </Badge>
                    </div>

                    {/* Trending */}
                    <div className="w-8">
                      <TrendingUp
                        className={`h-5 w-5 ${
                          player.trending === "up" ? "text-gaming-green" : "text-destructive rotate-180"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* User's position CTA */}
          <div className="mt-12 text-center">
            <Card className="inline-block glass-card border-gaming-cyan/30 p-8">
              <p className="text-muted-foreground mb-4">
                Faça login para ver sua posição no ranking!
              </p>
              <Button className="bg-gradient-gaming hover:opacity-90">
                Entrar Agora
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
