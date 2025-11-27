import type React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Flame, Sparkles, Star as StarIcon, Play, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface GameData {
  id: number | string;
  title: string;
  image: string;
  category: string;
  players: number;
  rating: number;
  featured?: boolean;
  tagline?: string;
}

const CustomGameCard = ({ game }: { game: GameData }) => {
  const gamePath = game.id === "pool" ? "/game/pool" : `/game/${game.id}`;

  return (
    <Link to={gamePath} className="group block">
      <div className="overflow-hidden rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 transition">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={game.image}
            alt={game.title}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.src =
                "https://via.placeholder.com/800x600?text=" + game.title.replace(/\s/g, "+");
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-white/80">
            <StarIcon className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            <span>{game.rating.toFixed(1)}</span>
            <span className="mx-2 h-1 w-1 rounded-full bg-white/60" />
            <span>{(game.players / 1000).toFixed(1)}K jogando</span>
          </div>
        </div>
        <CardHeader className="p-4">
          <CardTitle className="text-lg">{game.title}</CardTitle>
          <p className="text-sm text-white/60">{game.tagline || game.category}</p>
        </CardHeader>
        <CardFooter className="p-4 pt-0 flex items-center justify-between text-xs text-white/60">
          <span>{game.category}</span>
          <span className="inline-flex items-center gap-1 text-white">
            <Play className="h-3 w-3" /> Jogar agora
          </span>
        </CardFooter>
      </div>
    </Link>
  );
};

const Index = () => {
  const featuredGames: GameData[] = [
    {
      id: "pool",
      title: "PlayPool",
      image: "assets/images/poolday.jpeg",
      category: "Arcade",
      players: 65000,
      rating: 4.9,
      featured: true,
      tagline: "Multiplayer ao vivo, fisica precisa e salas privadas.",
    },
    {
      id: 1,
      title: "Cyber Racer 3D",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&q=80",
      category: "Corrida",
      players: 45230,
      rating: 4.8,
      featured: true,
      tagline: "Corridas com neon, pistas procedurais e modo cooperativo.",
    },
    {
      id: 2,
      title: "Space Battle Arena",
      image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1200&q=80",
      category: "Acao",
      players: 38900,
      rating: 4.7,
      featured: true,
      tagline: "Batalhas espaciais com esquadroes sincronizados.",
    },
    {
      id: 3,
      title: "Puzzle Master",
      image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=1200&q=80",
      category: "Puzzle",
      players: 29450,
      rating: 4.9,
      featured: true,
      tagline: "Desafios diarios e missao zen para relaxar.",
    },
  ];

  const popularGames: GameData[] = [
    { id: 4, title: "Tower Defense Pro", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80", category: "Estrategia", players: 52100, rating: 4.6, tagline: "Defesas modulares e eventos ao vivo." },
    { id: 5, title: "Soccer Stars", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80", category: "Esporte", players: 67800, rating: 4.8, tagline: "Partidas rapidas com placar global." },
    { id: 6, title: "Zombie Survival", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&q=80", category: "Acao", players: 41200, rating: 4.5, tagline: "Coop de 4 jogadores e hordas infinitas." },
    { id: 7, title: "Card Master", image: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=1200&q=80", category: "Cartas", players: 34500, rating: 4.7, tagline: "Decks unicos e campeonatos semanais." },
    { id: 8, title: "Platformer X", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&q=80", category: "Aventura", players: 28300, rating: 4.6, tagline: "Fases criadas pela comunidade." },
    { id: 9, title: "City Builder", image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80", category: "Simulacao", players: 56700, rating: 4.9, tagline: "Construa cidades vivas com IA dinamica." },
  ];

  const newGames: GameData[] = [
    { id: 10, title: "Dragon Quest", image: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=1200&q=80", category: "RPG", players: 12400, rating: 4.4, tagline: "Campanhas curtas, recompensa diaria." },
    { id: 11, title: "Rhythm Beat", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80", category: "Musica", players: 15800, rating: 4.7, tagline: "Mix ao vivo e desafios musicais." },
    { id: 12, title: "Match 3 Saga", image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&q=80", category: "Casual", players: 23100, rating: 4.5, tagline: "Eventos de temporada e skins exclusivas." },
  ];

  const collections = [
    {
      title: "Selecao Arcade",
      description: "Jogos curados para partidas rapidas e controles fluidos.",
      accent: "from-[#ff5f6d] to-[#ffc371]",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80",
    },
    {
      title: "Para jogar em familia",
      description: "Co-op local, desafios criativos e controles simples.",
      accent: "from-[#4f46e5] to-[#7c3aed]",
      image: "https://images.unsplash.com/photo-1526481280695-3c469c2f3a99?w=1200&q=80",
    },
    {
      title: "Competitivo online",
      description: "Ranking em tempo real, ligas sazonais e transmissao.",
      accent: "from-[#0ea5e9] to-[#22d3ee]",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80",
    },
  ];

  const freeArcadeGames: GameData[] = [
    {
      id: 13,
      title: "Retro Blaster",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80&fit=crop&auto=format",
      category: "Arcade Gratis",
      players: 19800,
      rating: 4.6,
      tagline: "Tiros espaciais retro com power-ups infinitos.",
    },
    {
      id: 14,
      title: "Pixel Runner",
      image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1200&q=80&fit=crop&auto=format",
      category: "Arcade Gratis",
      players: 25400,
      rating: 4.5,
      tagline: "Corridas endless com desafios diarios.",
    },
    {
      id: 15,
      title: "Neon Breaker",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80&fit=crop&sat=-20&auto=format",
      category: "Arcade Gratis",
      players: 31200,
      rating: 4.7,
      tagline: "Quebre blocos neon com fisica arcade precisa.",
    },
    {
      id: 16,
      title: "Sky Glide",
      image: "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?w=1200&q=80&fit=crop&auto=format",
      category: "Arcade Gratis",
      players: 16750,
      rating: 4.4,
      tagline: "Voe entre nuvens com controles simples e leves.",
    },
  ];

  const offlineGames: GameData[] = [
    {
      id: 17,
      title: "Galaxy Drift",
      image: "https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?w=1200&q=80&fit=crop&auto=format",
      category: "Offline",
      players: 8200,
      rating: 4.6,
      tagline: "Carregue e jogue sem internet, com campanhas curtas.",
    },
    {
      id: 18,
      title: "Mystic Valley",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80&fit=crop&auto=format",
      category: "Offline",
      players: 9100,
      rating: 4.7,
      tagline: "Aventura single-player com salvamento local.",
    },
    {
      id: 19,
      title: "Zen Tiles",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80&fit=crop&sat=-80&auto=format",
      category: "Offline",
      players: 6500,
      rating: 4.5,
      tagline: "Puzzle relax offline, sem anuncios.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#05060a] text-white">
      <Navbar />

      <div className="pt-16">
        <HeroSection />

        <section className="container mx-auto px-6 py-16 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-white/50">Colecoes</p>
              <h2 className="text-3xl md:text-4xl font-bold">Curadoria PlayDay</h2>
            </div>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Ver todas
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div
                key={collection.title}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${collection.accent} opacity-70`} />
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-70"
                />
                <div className="relative p-8 space-y-3">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/80">Colecao</p>
                  <h3 className="text-2xl font-semibold">{collection.title}</h3>
              <p className="text-white/80">{collection.description}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {freeArcadeGames.slice(0, 3).map((game) => (
                      <span key={game.id} className="text-xs px-3 py-1 rounded-full bg-white/20 text-white/90">
                        {game.title}
                      </span>
                    ))}
                  </div>
                  <Button variant="ghost" className="text-white hover:bg-white/10 px-0" asChild>
                    <Link to="/arcade">
                      Explorar <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6 py-12 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-white/50">Em destaque</p>
              <h2 className="text-3xl font-bold">Jogos que voce precisa jogar</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Flame className="h-4 w-4 text-orange-400" />
              Atualizado agora
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
              <img
                src={featuredGames[0].image}
                alt={featuredGames[0].title}
                className="h-64 w-full object-cover"
              />
              <div className="p-8 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em]">
                  Exclusivo
                </div>
                <h3 className="text-3xl font-semibold">{featuredGames[0].title}</h3>
                <p className="text-white/70 max-w-xl">
                  Salas privadas, competicao global e controles refinados. PlayPool traz fisica realista
                  e partidas sincronizadas em tempo real.
                </p>
                <div className="flex items-center gap-6 text-sm text-white/70">
                  <span className="inline-flex items-center gap-2">
                    <StarIcon className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                    {featuredGames[0].rating.toFixed(1)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Sessao rapida
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-white text-black hover:bg-white/90" asChild>
                    <Link to="/game/pool">Jogar PlayPool</Link>
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                    <Link to="/leaderboard">Ver ranking</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredGames.slice(1).map((game) => (
                <CustomGameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-12 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-white/50">Arcade gratis</p>
              <h2 className="text-3xl font-bold">Jogue agora, sem pagar nada</h2>
            </div>
            <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
              <Link to="/arcade">Ver tudo</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {freeArcadeGames.map((game) => (
              <CustomGameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6 py-12 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-white/50">Offline</p>
              <h2 className="text-3xl font-bold">Para jogar sem internet</h2>
            </div>
            <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
              <Link to="/offline">Ver titulos offline</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offlineGames.map((game) => (
              <CustomGameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6 py-12 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-white/50">Top em alta</p>
              <h2 className="text-3xl font-bold">Mais jogados agora</h2>
            </div>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Ver mais
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularGames.map((game) => (
              <CustomGameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6 py-12 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-white/50">Chegaram agora</p>
              <h2 className="text-3xl font-bold">Novidades da semana</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Atualizado semanalmente
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newGames.map((game) => (
              <CustomGameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6 py-20">
          <div className="rounded-3xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/10 p-10 md:p-16 text-center space-y-6">
            <p className="text-sm uppercase tracking-[0.2em] text-white/60">PlayDay Arcade</p>
            <h3 className="text-4xl md:text-5xl font-bold">Uma assinatura, todos os jogos.</h3>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              Acesse a biblioteca completa sem anuncios, jogue offline e continue exatamente de onde parou em qualquer dispositivo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-black hover:bg-white/90" size="lg">
                Comecar gratis
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" size="lg">
                Ver planos
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
