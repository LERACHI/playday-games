import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Sparkles, Shirt, Crown } from "lucide-react";

const Store = () => {
  const cosmetics = [
    {
      id: 1,
      name: "Avatar Cibernético",
      category: "Avatar",
      price: 500,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=cyber",
      featured: true,
    },
    {
      id: 2,
      name: "Coroa de Ouro",
      category: "Acessório",
      price: 1200,
      image: "https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=400&q=80",
      featured: true,
    },
    {
      id: 3,
      name: "Skin Neon",
      category: "Tema",
      price: 800,
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80",
      featured: false,
    },
    {
      id: 4,
      name: "Badge Lendário",
      category: "Badge",
      price: 300,
      image: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&q=80",
      featured: false,
    },
    {
      id: 5,
      name: "Efeito de Vitória",
      category: "Efeito",
      price: 600,
      image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&q=80",
      featured: false,
    },
    {
      id: 6,
      name: "Frame Épico",
      category: "Frame",
      price: 450,
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80",
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-gaming-cyan/30 mb-4">
              <ShoppingBag className="h-4 w-4 text-gaming-cyan" />
              <span className="text-sm font-medium text-foreground">Loja Cosmética</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-gradient">Personalize seu Perfil</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Apenas cosméticos! Nada de pay-to-win. Destaque-se com estilo único.
            </p>
          </div>

          {/* Balance Card */}
          <Card className="glass-card border-gaming-cyan/20 p-6 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Seu Saldo</p>
                <p className="text-3xl font-bold text-gradient">2,450 Moedas</p>
              </div>
              <Button className="bg-gradient-gaming hover:opacity-90">
                Ganhar Mais
              </Button>
            </div>
          </Card>

          {/* Featured Items */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-gaming-orange" />
              Em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cosmetics
                .filter((item) => item.featured)
                .map((item) => (
                  <Card
                    key={item.id}
                    className="glass-card border-gaming-cyan/30 overflow-hidden group hover:scale-[1.02] transition-transform"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-gaming text-white border-0">
                          ✨ Destaque
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-1">{item.name}</h3>
                          <Badge variant="secondary">{item.category}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gaming-cyan">{item.price}</p>
                          <p className="text-sm text-muted-foreground">moedas</p>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-gaming hover:opacity-90">
                        Comprar Agora
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>

          {/* All Items */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Crown className="h-6 w-6 text-gaming-cyan" />
              Todos os Itens
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cosmetics.map((item) => (
                <Card
                  key={item.id}
                  className="glass-card border-border hover:border-gaming-cyan/30 overflow-hidden group transition-all"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gaming-cyan">{item.price}</p>
                        <p className="text-xs text-muted-foreground">moedas</p>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      Comprar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Info Banner */}
          <Card className="glass-card border-gaming-cyan/30 p-8 mt-12">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-3">Como Ganhar Moedas?</h3>
              <p className="text-muted-foreground mb-6">
                Jogue seus jogos favoritos, complete missões diárias e suba no ranking para
                ganhar moedas gratuitamente. Sem necessidade de gastar dinheiro real!
              </p>
              <Button className="bg-gradient-gaming hover:opacity-90">
                Ver Missões Diárias
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Store;
