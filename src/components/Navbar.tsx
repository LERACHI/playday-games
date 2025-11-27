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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 text-white">
          <NavLink to="/" className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6" />
            <span className="text-xl font-semibold tracking-tight">PlayDay Arcade</span>
          </NavLink>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <NavLink
              to="/"
              className="text-white/70 hover:text-white transition"
              activeClassName="text-white"
            >
              Jogos
            </NavLink>
            <NavLink
              to="/leaderboard"
              className="text-white/70 hover:text-white transition"
              activeClassName="text-white"
            >
              Ranking
            </NavLink>
            <NavLink
              to="/store"
              className="text-white/70 hover:text-white transition"
              activeClassName="text-white"
            >
              Loja
            </NavLink>
            {user && (
              <NavLink
                to="/profile"
                className="text-white/70 hover:text-white transition"
                activeClassName="text-white"
              >
                Perfil
              </NavLink>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 text-white hover:bg-white/10">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-white/10 text-white">
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
                <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
                  <Link to="/auth">Entrar</Link>
                </Button>
                <Button className="bg-white text-black hover:bg-white/80" asChild>
                  <Link to="/auth">Criar Conta</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-white/10 text-white">
            <NavLink
              to="/"
              className="block text-white/70 hover:text-white py-2"
              activeClassName="text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Jogos
            </NavLink>
            <NavLink
              to="/leaderboard"
              className="block text-white/70 hover:text-white py-2"
              activeClassName="text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Ranking
            </NavLink>
            <NavLink
              to="/store"
              className="block text-white/70 hover:text-white py-2"
              activeClassName="text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Loja
            </NavLink>
            {user && (
              <NavLink
                to="/profile"
                className="block text-white/70 hover:text-white py-2"
                activeClassName="text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Perfil
              </NavLink>
            )}

            <div className="flex gap-3 pt-3 border-t border-white/10 mt-3">
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
                  <Button variant="ghost" className="flex-1 text-white hover:bg-white/10" asChild>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Entrar</Link>
                  </Button>
                  <Button className="flex-1 bg-white text-black" asChild>
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
