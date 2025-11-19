import { Button } from "./ui/button";
import { Sparkles, TrendingUp } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-gaming-cyan/10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gaming-cyan rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gaming-blue rounded-full blur-[120px] animate-pulse delay-700" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-gaming-cyan/30">
              <Sparkles className="h-4 w-4 text-gaming-cyan" />
              <span className="text-sm font-medium text-foreground">
                A Nova Era dos Jogos Online
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-gradient">Jogos Limpos. Jogadores Felizes.</span>
            <br />
            <span className="text-foreground">Plataforma Confiável.</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Milhares de jogos gratuitos, multiplayer épico e uma comunidade global.
            Sua próxima aventura começa aqui.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-gradient-gaming hover:opacity-90 text-white text-lg px-8 h-14">
              Começar a Jogar
            </Button>
            <Button size="lg" variant="outline" className="border-gaming-cyan text-gaming-cyan hover:bg-gaming-cyan/10 text-lg px-8 h-14">
              Ver Jogos Populares
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
            <div className="glass-card p-6 rounded-xl border border-gaming-cyan/20">
              <div className="text-3xl font-bold text-gradient mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Jogos Disponíveis</div>
            </div>
            <div className="glass-card p-6 rounded-xl border border-gaming-cyan/20">
              <div className="text-3xl font-bold text-gradient mb-1">2M+</div>
              <div className="text-sm text-muted-foreground">Jogadores Ativos</div>
            </div>
            <div className="glass-card p-6 rounded-xl border border-gaming-cyan/20 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-6 w-6 text-gaming-green" />
                <div className="text-3xl font-bold text-gaming-green">24/7</div>
              </div>
              <div className="text-sm text-muted-foreground">Sempre Online</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
