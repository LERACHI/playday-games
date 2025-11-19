import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { GameCard } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { Flame, Clock, Star } from "lucide-react";

const Index = () => {
  // Mock data - será substituído por dados reais da API
  const featuredGames = [
    {
      id: 1,
      title: "Cyber Racer 3D",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80",
      category: "Corrida",
      players: 45230,
      rating: 4.8,
      featured: true,
    },
    {
      id: 2,
      title: "Space Battle Arena",
      image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80",
      category: "Ação",
      players: 38900,
      rating: 4.7,
      featured: true,
    },
    {
      id: 3,
      title: "Puzzle Master",
      image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800&q=80",
      category: "Puzzle",
      players: 29450,
      rating: 4.9,
      featured: true,
    },
  ];

  const popularGames = [
    {
      id: 4,
      title: "Tower Defense Pro",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
      category: "Estratégia",
      players: 52100,
      rating: 4.6,
    },
    {
      id: 5,
      title: "Soccer Stars",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
      category: "Esporte",
      players: 67800,
      rating: 4.8,
    },
    {
      id: 6,
      title: "Zombie Survival",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80",
      category: "Ação",
      players: 41200,
      rating: 4.5,
    },
    {
      id: 7,
      title: "Card Master",
      image: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&q=80",
      category: "Cartas",
      players: 34500,
      rating: 4.7,
    },
    {
      id: 8,
      title: "Platformer X",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
      category: "Aventura",
      players: 28300,
      rating: 4.6,
    },
    {
      id: 9,
      title: "City Builder",
      image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80",
      category: "Simulação",
      players: 56700,
      rating: 4.9,
    },
  ];

  const newGames = [
    {
      id: 10,
      title: "Dragon Quest",
      image: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&q=80",
      category: "RPG",
      players: 12400,
      rating: 4.4,
    },
    {
      id: 11,
      title: "Rhythm Beat",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
      category: "Música",
      players: 15800,
      rating: 4.7,
    },
    {
      id: 12,
      title: "Match 3 Saga",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80",
      category: "Casual",
      players: 23100,
      rating: 4.5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Main content with padding for fixed navbar */}
      <div className="pt-16">
        <HeroSection />

        {/* Featured Games */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-gaming">
                <Star className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Jogos em Destaque</h2>
            </div>
            <Button variant="ghost" className="text-gaming-cyan hover:text-gaming-cyan/80">
              Ver Todos →
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGames.map((game) => (
              <GameCard key={game.id} {...game} />
            ))}
          </div>
        </section>

        {/* Popular Games */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gaming-orange/20">
                <Flame className="h-5 w-5 text-gaming-orange" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Mais Jogados</h2>
            </div>
            <Button variant="ghost" className="text-gaming-cyan hover:text-gaming-cyan/80">
              Ver Todos →
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularGames.map((game) => (
              <GameCard key={game.id} {...game} />
            ))}
          </div>
        </section>

        {/* New Games */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gaming-green/20">
                <Clock className="h-5 w-5 text-gaming-green" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Novos Jogos</h2>
            </div>
            <Button variant="ghost" className="text-gaming-cyan hover:text-gaming-cyan/80">
              Ver Todos →
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newGames.map((game) => (
              <GameCard key={game.id} {...game} />
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="container mx-auto px-4 py-24">
          <div className="glass-card rounded-2xl p-12 text-center border border-gaming-cyan/30">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-gradient">Pronto para Jogar?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Crie sua conta gratuitamente e comece a competir com jogadores do mundo todo.
            </p>
            <Button size="lg" className="bg-gradient-gaming hover:opacity-90 text-white text-lg px-12 h-14">
              Criar Conta Grátis
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
