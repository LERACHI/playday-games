import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { Gamepad2, User, Trophy, ShoppingBag, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

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
            {user && (
              <NavLink
                to="/profile"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2"
                activeClassName="text-gaming-cyan font-semibold"
              >
                <User className="h-4 w-4" />
                Perfil
              </NavLink>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-gradient-gaming text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline">{user.email?.split('@')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" className="text-foreground" asChild>
                  <Link to="/auth">Entrar</Link>
                </Button>
                <Button className="bg-gradient-gaming hover:opacity-90" asChild>
                  <Link to="/auth">Criar Conta</Link>
                </Button>
              </>
            )}
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
              onClick={() => setIsMenuOpen(false)}
            >
              Loja
            </NavLink>
            {user && (
              <NavLink
                to="/profile"
                className="block text-muted-foreground hover:text-foreground py-2"
                activeClassName="text-gaming-cyan font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Perfil
              </NavLink>
            )}
            
            <div className="flex gap-3 pt-3 border-t border-gaming-cyan/20 mt-3">
              {user ? (
                <Button 
                  variant="ghost" 
                  className="flex-1 text-destructive" 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              ) : (
                <>
                  <Button variant="ghost" className="flex-1" asChild>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Entrar</Link>
                  </Button>
                  <Button className="flex-1 bg-gradient-gaming" asChild>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Criar Conta</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
