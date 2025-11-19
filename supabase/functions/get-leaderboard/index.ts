import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Get Leaderboard - Starting request');

    // Parse query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const sortBy = url.searchParams.get('sortBy') || 'xp'; // xp, wins, level
    const period = url.searchParams.get('period') || 'all'; // all, weekly, monthly

    console.log('Query params - limit:', limit, 'sortBy:', sortBy, 'period:', period);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build query based on sort criteria
    let query = supabase
      .from('profiles')
      .select('id, username, avatar_url, xp, level, coins, total_matches, wins');

    // Apply sorting
    switch (sortBy) {
      case 'wins':
        query = query.order('wins', { ascending: false });
        break;
      case 'level':
        query = query.order('level', { ascending: false }).order('xp', { ascending: false });
        break;
      case 'xp':
      default:
        query = query.order('xp', { ascending: false });
        break;
    }

    // Apply limit
    query = query.limit(limit);

    const { data: profiles, error } = await query;

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch leaderboard' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Leaderboard fetched:', profiles?.length, 'players');

    // Add rank to each player
    const leaderboard = profiles?.map((profile, index) => ({
      ...profile,
      rank: index + 1,
      winRate: profile.total_matches > 0 
        ? ((profile.wins / profile.total_matches) * 100).toFixed(1)
        : '0.0',
    })) || [];

    // If period filtering is needed, fetch recent matches
    if (period !== 'all') {
      console.log('Period filtering not yet implemented, returning all-time leaderboard');
    }

    return new Response(
      JSON.stringify({
        success: true,
        leaderboard: leaderboard,
        meta: {
          total: leaderboard.length,
          sortBy: sortBy,
          period: period,
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
