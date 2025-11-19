import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { Gamepad2, User, Trophy, ShoppingBag, Menu } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-gaming-cyan/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-gradient-gaming">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">Playday</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2"
              activeClassName="text-gaming-cyan font-semibold"
            >
              <Gamepad2 className="h-4 w-4" />
              Jogos
            </NavLink>
            <NavLink
              to="/leaderboard"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2"
              activeClassName="text-gaming-cyan font-semibold"
            >
              <Trophy className="h-4 w-4" />
              Ranking
            </NavLink>
            <NavLink
              to="/store"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2"
              activeClassName="text-gaming-cyan font-semibold"
            >
              <ShoppingBag className="h-4 w-4" />
              Loja
            </NavLink>
            <NavLink
              to="/profile"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2"
              activeClassName="text-gaming-cyan font-semibold"
            >
              <User className="h-4 w-4" />
              Perfil
            </NavLink>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" className="text-foreground">
              Entrar
            </Button>
            <Button className="bg-gradient-gaming hover:opacity-90">
              Criar Conta
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-gaming-cyan/20">
            <NavLink
              to="/"
              className="block text-muted-foreground hover:text-foreground py-2"
              activeClassName="text-gaming-cyan font-semibold"
            >
              Jogos
            </NavLink>
            <NavLink
              to="/leaderboard"
              className="block text-muted-foreground hover:text-foreground py-2"
              activeClassName="text-gaming-cyan font-semibold"
            >
              Ranking
            </NavLink>
            <NavLink
              to="/store"
              className="block text-muted-foreground hover:text-foreground py-2"
              activeClassName="text-gaming-cyan font-semibold"
            >
              Loja
            </NavLink>
            <NavLink
              to="/profile"
              className="block text-muted-foreground hover:text-foreground py-2"
              activeClassName="text-gaming-cyan font-semibold"
            >
              Perfil
            </NavLink>
            <div className="flex gap-3 pt-3">
              <Button variant="ghost" className="flex-1">
                Entrar
              </Button>
              <Button className="flex-1 bg-gradient-gaming">
                Criar Conta
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
