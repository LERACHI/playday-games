import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Zap, Settings, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  username: string;
  avatar_url: string | null;
  xp: number;
  level: number;
  coins: number;
  total_matches: number;
  wins: number;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gaming-cyan" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4">
          <Card className="glass-card border-gaming-cyan/20 p-8 text-center">
            <p className="text-muted-foreground">Erro ao carregar perfil</p>
          </Card>
        </div>
      </div>
    );
  }

  const xpToNextLevel = profile.level * 1000;
  const xpPercentage = (profile.xp / xpToNextLevel) * 100;
  const winRate = profile.total_matches > 0 
    ? ((profile.wins / profile.total_matches) * 100).toFixed(1) 
    : 0;

  const achievements = [
    { id: 1, name: "Primeira Vitória", icon: "🏆", unlocked: profile.wins > 0 },
    { id: 2, name: "Vencedor 10x", icon: "🎯", unlocked: profile.wins >= 10 },
    { id: 3, name: "Jogador Dedicado", icon: "⭐", unlocked: profile.total_matches >= 50 },
    { id: 4, name: "Mestre Level 10", icon: "🧩", unlocked: profile.level >= 10 },
    { id: 5, name: "Campeão 100x", icon: "⚡", unlocked: profile.wins >= 100 },
    { id: 6, name: "Lendário", icon: "👑", unlocked: profile.level >= 50 },
  ];

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
                  src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                  alt={profile.username}
                  className="w-32 h-32 rounded-full border-4 border-gaming-cyan"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-gaming text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg border-4 border-background">
                  {profile.level}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{profile.username}</h1>
                  <Badge className="bg-gradient-gaming border-0">
                    Nível {profile.level}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  Moedas: {profile.coins.toLocaleString()} 💰
                </p>

                {/* XP Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso para Nível {profile.level + 1}</span>
                    <span className="text-gaming-cyan font-semibold">
                      {profile.xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
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

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card border-gaming-cyan/20 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="h-5 w-5 text-gaming-cyan" />
                <h3 className="font-semibold text-foreground">Vitórias</h3>
              </div>
              <p className="text-3xl font-bold text-gradient">{profile.wins}</p>
            </Card>

            <Card className="glass-card border-gaming-cyan/20 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-5 w-5 text-gaming-cyan" />
                <h3 className="font-semibold text-foreground">Partidas</h3>
              </div>
              <p className="text-3xl font-bold text-gradient">{profile.total_matches}</p>
            </Card>

            <Card className="glass-card border-gaming-cyan/20 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-5 w-5 text-gaming-cyan" />
                <h3 className="font-semibold text-foreground">Taxa de Vitória</h3>
              </div>
              <p className="text-3xl font-bold text-gradient">{winRate}%</p>
            </Card>

            <Card className="glass-card border-gaming-cyan/20 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-5 w-5 text-gaming-cyan" />
                <h3 className="font-semibold text-foreground">XP Total</h3>
              </div>
              <p className="text-3xl font-bold text-gradient">{profile.xp.toLocaleString()}</p>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="glass-card border-gaming-cyan/20 p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-gaming-cyan" />
              Conquistas
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    achievement.unlocked
                      ? "border-gaming-cyan bg-gaming-cyan/10"
                      : "border-border/30 opacity-50"
                  }`}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <p className="text-sm font-medium text-foreground">
                    {achievement.name}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
