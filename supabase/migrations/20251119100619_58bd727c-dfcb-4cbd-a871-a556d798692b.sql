-- Create games table
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  iframe_url TEXT,
  category TEXT NOT NULL,
  min_players INTEGER DEFAULT 1,
  max_players INTEGER DEFAULT 1,
  xp_reward INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  result TEXT CHECK (result IN ('win', 'loss', 'draw')),
  xp_earned INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create skins table
CREATE TABLE public.skins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')) DEFAULT 'common',
  category TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create inventory table
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skin_id UUID REFERENCES public.skins(id) ON DELETE CASCADE NOT NULL,
  is_equipped BOOLEAN DEFAULT false,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, skin_id)
);

-- Enable RLS
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- RLS Policies for games
CREATE POLICY "Games are viewable by everyone"
  ON public.games FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage games"
  ON public.games FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for matches
CREATE POLICY "Users can view own matches"
  ON public.matches FOR SELECT
  USING (auth.uid() = player_id);

CREATE POLICY "Users can insert own matches"
  ON public.matches FOR INSERT
  WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Admins can view all matches"
  ON public.matches FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for skins
CREATE POLICY "Skins are viewable by everyone"
  ON public.skins FOR SELECT
  USING (is_available = true);

CREATE POLICY "Admins can manage skins"
  ON public.skins FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for inventory
CREATE POLICY "Users can view own inventory"
  ON public.inventory FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory"
  ON public.inventory FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory"
  ON public.inventory FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all inventory"
  ON public.inventory FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_matches_player_id ON public.matches(player_id);
CREATE INDEX idx_matches_game_id ON public.matches(game_id);
CREATE INDEX idx_matches_created_at ON public.matches(created_at DESC);
CREATE INDEX idx_inventory_user_id ON public.inventory(user_id);
CREATE INDEX idx_inventory_skin_id ON public.inventory(skin_id);

-- Insert some sample games
INSERT INTO public.games (name, description, thumbnail_url, category, xp_reward) VALUES
  ('Cyber Racer 3D', 'Corrida futurista em alta velocidade', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400', 'racing', 100),
  ('Space Battle Arena', 'Batalha espacial multijogador', 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400', 'action', 150),
  ('Puzzle Master', 'Desafie sua mente com puzzles complexos', 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400', 'puzzle', 75),
  ('Tower Defense Pro', 'Defenda sua base contra ondas de inimigos', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', 'strategy', 120);

-- Insert some sample skins
INSERT INTO public.skins (name, description, image_url, price, rarity, category) VALUES
  ('Neon Avatar', 'Avatar com efeito neon futurista', 'https://api.dicebear.com/7.x/avataaars/svg?seed=neon', 500, 'epic', 'avatar'),
  ('Golden Frame', 'Moldura dourada para perfil', 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=200', 1000, 'legendary', 'frame'),
  ('Cyber Badge', 'Distintivo estilo cyberpunk', 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200', 250, 'rare', 'badge'),
  ('Pixel Pet', 'Mascote pixel art', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200', 150, 'common', 'pet');