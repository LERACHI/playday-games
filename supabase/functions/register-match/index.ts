import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MatchData {
  gameId: string;
  score: number;
  result: 'win' | 'loss' | 'draw';
  durationSeconds?: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Register Match - Starting request');

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get user from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error getting user:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated:', user.id);

    // Parse request body
    const matchData: MatchData = await req.json();
    console.log('Match data:', matchData);

    // Validate input
    if (!matchData.gameId || !matchData.result || matchData.score === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: gameId, score, result' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get game info to determine XP reward
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('xp_reward')
      .eq('id', matchData.gameId)
      .single();

    if (gameError || !game) {
      console.error('Error fetching game:', gameError);
      return new Response(
        JSON.stringify({ error: 'Game not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate rewards based on result
    let xpEarned = game.xp_reward;
    let coinsEarned = 10;

    if (matchData.result === 'win') {
      xpEarned = Math.floor(xpEarned * 1.5); // 50% bonus for wins
      coinsEarned = 25;
    } else if (matchData.result === 'draw') {
      xpEarned = Math.floor(xpEarned * 0.75);
      coinsEarned = 15;
    } else {
      xpEarned = Math.floor(xpEarned * 0.5); // Half XP for losses
      coinsEarned = 5;
    }

    console.log('Rewards calculated - XP:', xpEarned, 'Coins:', coinsEarned);

    // Insert match record
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .insert({
        game_id: matchData.gameId,
        player_id: user.id,
        score: matchData.score,
        result: matchData.result,
        xp_earned: xpEarned,
        coins_earned: coinsEarned,
        duration_seconds: matchData.durationSeconds,
      })
      .select()
      .single();

    if (matchError) {
      console.error('Error inserting match:', matchError);
      return new Response(
        JSON.stringify({ error: 'Failed to register match' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Match registered:', match.id);

    // Update profile stats
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('xp, level, coins, total_matches, wins')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate new stats
    const newXp = profile.xp + xpEarned;
    const newCoins = profile.coins + coinsEarned;
    const newTotalMatches = profile.total_matches + 1;
    const newWins = matchData.result === 'win' ? profile.wins + 1 : profile.wins;
    
    // Calculate level (1000 XP per level)
    const newLevel = Math.floor(newXp / 1000) + 1;

    console.log('New stats - Level:', newLevel, 'XP:', newXp, 'Coins:', newCoins);

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        xp: newXp,
        level: newLevel,
        coins: newCoins,
        total_matches: newTotalMatches,
        wins: newWins,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Profile updated successfully');

    // Check for level up
    const leveledUp = newLevel > profile.level;

    return new Response(
      JSON.stringify({
        success: true,
        match: match,
        rewards: {
          xp: xpEarned,
          coins: coinsEarned,
          leveledUp: leveledUp,
          newLevel: newLevel,
        },
        profile: {
          xp: newXp,
          level: newLevel,
          coins: newCoins,
          totalMatches: newTotalMatches,
          wins: newWins,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
