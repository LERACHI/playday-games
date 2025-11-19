import { supabase } from '@/integrations/supabase/client';

export interface MatchData {
  gameId: string;
  score: number;
  result: 'win' | 'loss' | 'draw';
  durationSeconds?: number;
}

export interface MatchResult {
  success: boolean;
  match: any;
  rewards: {
    xp: number;
    coins: number;
    leveledUp: boolean;
    newLevel: number;
  };
  profile: {
    xp: number;
    level: number;
    coins: number;
    totalMatches: number;
    wins: number;
  };
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar_url: string | null;
  xp: number;
  level: number;
  coins: number;
  total_matches: number;
  wins: number;
  rank: number;
  winRate: string;
}

export interface Game {
  id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  iframe_url: string | null;
  category: string;
  min_players: number;
  max_players: number;
  xp_reward: number;
  is_active: boolean;
  created_at: string;
  playCount?: number;
  stats?: {
    totalPlays: number;
    averageScore: number;
  };
}

export interface InventoryItem {
  id: string;
  is_equipped: boolean;
  acquired_at: string;
  skins: {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    price: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    category: string;
  };
}

// Register a match and update player stats
export async function registerMatch(matchData: MatchData): Promise<MatchResult> {
  const { data, error } = await supabase.functions.invoke('register-match', {
    body: matchData,
  });

  if (error) {
    console.error('Error registering match:', error);
    throw new Error(error.message || 'Failed to register match');
  }

  return data;
}

// Get leaderboard
export async function getLeaderboard(
  options: {
    limit?: number;
    sortBy?: 'xp' | 'wins' | 'level';
    period?: 'all' | 'weekly' | 'monthly';
  } = {}
): Promise<LeaderboardEntry[]> {
  const params = new URLSearchParams({
    limit: (options.limit || 100).toString(),
    sortBy: options.sortBy || 'xp',
    period: options.period || 'all',
  });

  const { data, error } = await supabase.functions.invoke(
    `get-leaderboard?${params.toString()}`,
    { method: 'GET' }
  );

  if (error) {
    console.error('Error fetching leaderboard:', error);
    throw new Error(error.message || 'Failed to fetch leaderboard');
  }

  return data.leaderboard;
}

// Get all games or filter by category
export async function getGames(options: {
  category?: string;
  limit?: number;
} = {}): Promise<Game[]> {
  const params = new URLSearchParams();
  if (options.category) params.append('category', options.category);
  if (options.limit) params.append('limit', options.limit.toString());

  const queryString = params.toString();
  const path = queryString ? `get-games?${queryString}` : 'get-games';

  const { data, error } = await supabase.functions.invoke(path, {
    method: 'GET',
  });

  if (error) {
    console.error('Error fetching games:', error);
    throw new Error(error.message || 'Failed to fetch games');
  }

  return data.games;
}

// Get a specific game by ID
export async function getGame(gameId: string): Promise<Game> {
  const { data, error } = await supabase.functions.invoke(
    `get-games?id=${gameId}`,
    { method: 'GET' }
  );

  if (error) {
    console.error('Error fetching game:', error);
    throw new Error(error.message || 'Failed to fetch game');
  }

  return data.game;
}

// Get user's inventory
export async function getInventory(): Promise<InventoryItem[]> {
  const { data, error } = await supabase.functions.invoke('manage-inventory', {
    body: { action: 'list' },
  });

  if (error) {
    console.error('Error fetching inventory:', error);
    throw new Error(error.message || 'Failed to fetch inventory');
  }

  return data.inventory;
}

// Buy a skin
export async function buySkin(skinId: string): Promise<{
  success: boolean;
  message: string;
  remainingCoins: number;
}> {
  const { data, error } = await supabase.functions.invoke('manage-inventory', {
    body: {
      action: 'buy',
      skinId: skinId,
    },
  });

  if (error) {
    console.error('Error buying skin:', error);
    throw new Error(error.message || 'Failed to buy skin');
  }

  return data;
}

// Equip a skin
export async function equipSkin(skinId: string): Promise<{ success: boolean; message: string }> {
  const { data, error } = await supabase.functions.invoke('manage-inventory', {
    body: {
      action: 'equip',
      skinId: skinId,
    },
  });

  if (error) {
    console.error('Error equipping skin:', error);
    throw new Error(error.message || 'Failed to equip skin');
  }

  return data;
}

// Unequip a skin
export async function unequipSkin(skinId: string): Promise<{ success: boolean; message: string }> {
  const { data, error } = await supabase.functions.invoke('manage-inventory', {
    body: {
      action: 'unequip',
      skinId: skinId,
    },
  });

  if (error) {
    console.error('Error unequipping skin:', error);
    throw new Error(error.message || 'Failed to unequip skin');
  }

  return data;
}
