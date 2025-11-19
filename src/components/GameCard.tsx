import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, Star } from "lucide-react";

interface GameCardProps {
  title: string;
  image: string;
  category: string;
  players: number;
  rating: number;
  featured?: boolean;
}

export const GameCard = ({
  title,
  image,
  category,
  players,
  rating,
  featured = false,
}: GameCardProps) => {
  return (
    <Card className="group relative overflow-hidden bg-card border-border hover:border-gaming-cyan/50 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-gaming-cyan/20">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-gradient-gaming text-white border-0">
              ⭐ Destaque
            </Badge>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-gradient-gaming flex items-center justify-center shadow-lg">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-gaming-cyan transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-gaming-orange shrink-0">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-semibold">{rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Badge variant="secondary" className="bg-secondary/50">
            {category}
          </Badge>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{players.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
