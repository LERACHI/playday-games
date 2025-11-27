import { Button } from "./ui/button";
import { Sparkles, MonitorPlay, ShieldCheck } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0c12] via-[#0c0f15] to-[#0f1017] text-white">
      <div className="absolute inset-0">
        <div className="absolute -left-32 -top-24 h-80 w-80 rounded-full bg-[#ff5f6d] blur-[160px] opacity-70" />
        <div className="absolute right-0 top-10 h-96 w-96 rounded-full bg-[#7f5af0] blur-[170px] opacity-60" />
        <div className="absolute left-1/4 bottom-[-120px] h-96 w-[32rem] rounded-full bg-[#10b981] blur-[200px] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff0f,transparent_45%)]" />
      </div>

      <div className="container mx-auto px-6 pb-24 pt-28 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-sm uppercase tracking-[0.2em] text-white/80">PlayDay Arcade</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Jogue o melhor do arcade em um lugar so.
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto">
            Experiencias premium, sem anuncios e com play instantaneo. Descubra curadoria exclusiva,
            desafios semanais e titulos para jogar online ou offline.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-white text-black hover:bg-white/90">
              Jogar agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-14 text-lg border-white/50 bg-white/80 text-black hover:bg-white"
            >
              Ver catalogo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
              <MonitorPlay className="h-10 w-10 text-white" />
              <div className="text-left">
                <div className="text-lg font-semibold text-white">Jogue em todos os dispositivos</div>
                <div className="text-sm text-white/70">Console, notebook ou mobile, tudo sincronizado.</div>
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
              <ShieldCheck className="h-10 w-10 text-white" />
              <div className="text-left">
                <div className="text-lg font-semibold text-white">Sem anuncios</div>
                <div className="text-sm text-white/70">Nada de pop-ups, apenas gameplay.</div>
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
              <Sparkles className="h-10 w-10 text-white" />
              <div className="text-left">
                <div className="text-lg font-semibold text-white">Novos jogos toda semana</div>
                <div className="text-sm text-white/70">Colecoes que evoluem com voce.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
