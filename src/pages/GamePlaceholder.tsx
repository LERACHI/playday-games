import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";

const GamePlaceholder = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-[#05060a] text-white">
      <Navbar />
      <div className="pt-24 container mx-auto px-6 max-w-3xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 space-y-4">
          <div className="flex items-center gap-3 text-yellow-300">
            <AlertTriangle className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Jogo indisponivel</h1>
          </div>
          <p className="text-white/70">
            A rota <code className="text-white">{`/game/${id}`}</code> ainda nao esta configurada. Escolha um jogo
            abaixo para continuar jogando.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button className="bg-white text-black hover:bg-white/90" asChild>
              <Link to="/arcade">Ver selecao arcade</Link>
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link to="/offline">Jogar sem internet</Link>
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
              <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar para inicio</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlaceholder;
