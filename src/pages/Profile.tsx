import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Zap, Settings } from "lucide-react";

const Profile = () => {
  // Mock user data
  const user = {
    username: "ProGamer2024",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ProGamer2024",
    level: 42,
    xp: 84500,
    xpToNextLevel: 100000,
    rank: 156,
    totalPlayers: 2000000,
    wins: 1243,
    losses: 342,
    winRate: 78.5,
    gamesPlayed: 1585,
    achievements: [
      { id: 1, name: "Primeira Vitória", icon: "🏆", unlocked: true },
      { id: 2, name: "Vencedor 100x", icon: "🎯", unlocked: true },
      { id: 3, name: "Jogador Dedicado", icon: "⭐", unlocked: true },
      { id: 4, name: "Mestre do Puzzle", icon: "🧩", unlocked: true },
      { id: 5, name: "Velocista", icon: "⚡", unlocked: false },
      { id: 6, name: "Campeão Global", icon: "👑", unlocked: false },
    ],
    recentGames: [
      {
        id: 1,
        name: "Cyber Racer 3D",
        result: "Vitória",
        xp: 250,
        date: "Hoje",
      },
      {
        id: 2,
        name: "Space Battle Arena",
        result: "Vitória",
        xp: 320,
        date: "Hoje",
      },
      {
        id: 3,
        name: "Tower Defense Pro",
        result: "Derrota",
        xp: 50,
        date: "Ontem",
      },
    ],
  };

  const xpPercentage = (user.xp / user.xpToNextLevel) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <Card className="glass-card border-gaming-cyan/20 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-32 h-32 rounded-full border-4 border-gaming-cyan"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-gaming text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg border-4 border-background">
                  {user.level}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{user.username}</h1>
                  <Badge className="bg-gradient-gaming border-0">
                    Nível {user.level}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  Ranking Global: #{user.rank.toLocaleString()} de {user.totalPlayers.toLocaleString()}
                </p>

                {/* XP Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso para Nível {user.level + 1}</span>
                    <span className="text-gaming-cyan font-semibold">
                      {user.xp.toLocaleString()} / {user.xpToNextLevel.toLocaleString()} XP
                    </span>
                  </div>
                  <Progress value={xpPercentage} className="h-3" />
                </div>
              </div>

              {/* Settings Button */}
              <Button variant="outline" className="border-gaming-cyan/30">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Stats */}
            <div className="space-y-6">
              {/* Stats Card */}
              <Card className="glass-card border-gaming-cyan/20 p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-gaming-cyan" />
                  Estatísticas
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Jogos</span>
                    <span className="font-semibold text-foreground">{user.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Vitórias</span>
                    <span className="font-semibold text-gaming-green">{user.wins}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Derrotas</span>
                    <span className="font-semibold text-destructive">{user.losses}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-muted-foreground">Taxa de Vitória</span>
                    <Badge className="bg-gaming-green/20 text-gaming-green border-0">
                      {user.winRate}%
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-card border-gaming-cyan/20 p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-gaming-orange" />
                  Ações Rápidas
                </h2>
                <div className="space-y-2">
                  <Button className="w-full bg-gradient-gaming hover:opacity-90" size="lg">
                    Jogar Aleatório
                  </Button>
                  <Button variant="outline" className="w-full border-gaming-cyan/30" size="lg">
                    Ver Loja
                  </Button>
                </div>
              </Card>
            </div>

            {/* Middle Column - Achievements */}
            <Card className="glass-card border-gaming-cyan/20 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-gaming-orange" />
                Conquistas
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {user.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border text-center transition-all ${
                      achievement.unlocked
                        ? "border-gaming-cyan/30 bg-gaming-cyan/5 hover:scale-105"
                        : "border-border/50 opacity-40 grayscale"
                    }`}
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <p className="text-sm font-medium text-foreground">{achievement.name}</p>
                    {achievement.unlocked && (
                      <Badge className="mt-2 bg-gaming-green/20 text-gaming-green border-0 text-xs">
                        Desbloqueado
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Right Column - Recent Games */}
            <Card className="glass-card border-gaming-cyan/20 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-gaming-cyan" />
                Partidas Recentes
              </h2>
              <div className="space-y-3">
                {user.recentGames.map((game) => (
                  <div
                    key={game.id}
                    className="p-4 rounded-lg border border-border/50 hover:border-gaming-cyan/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-foreground">{game.name}</h3>
                      <Badge
                        variant={game.result === "Vitória" ? "default" : "secondary"}
                        className={
                          game.result === "Vitória"
                            ? "bg-gaming-green/20 text-gaming-green border-0"
                            : "bg-destructive/20 text-destructive border-0"
                        }
                      >
                        {game.result}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>+{game.xp} XP</span>
                      <span>{game.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
