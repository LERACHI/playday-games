import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Star, Play } from "lucide-react";
import { Link } from "react-router-dom";

const offlineGames = [
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

const OfflineGames = () => {
  return (
    <div className="min-h-screen bg-[#05060a] text-white">
      <Navbar />
      <div className="pt-20 container mx-auto px-6 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/50">Offline</p>
            <h1 className="text-4xl font-bold">Para jogar sem internet</h1>
            <p className="text-white/60 mt-2 max-w-2xl">
              Baixe os jogos e continue de onde parou, mesmo sem conexao.
            </p>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
            <Link to="/">Voltar</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offlineGames.map((game) => (
            <div
              key={game.id}
              className="group rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:border-white/30 transition"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={game.image}
                  alt={game.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/800x600?text=" + game.title.replace(/\s/g, "+");
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white/80">
                  <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                  <span>{game.rating.toFixed(1)}</span>
                  <span className="mx-2 h-1 w-1 rounded-full bg-white/60" />
                  <span>{(game.players / 1000).toFixed(1)}K jogando</span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">{game.title}</h3>
                <p className="text-sm text-white/60">{game.tagline}</p>
                <div className="flex items-center justify-between text-xs text-white/70 pt-2">
                  <span>{game.category}</span>
                  <span className="inline-flex items-center gap-1 text-white">
                    <Play className="h-3 w-3" /> Jogar agora
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfflineGames;
