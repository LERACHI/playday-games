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
    console.log('Get Games - Starting request');

    // Parse query parameters
    const url = new URL(req.url);
    const category = url.searchParams.get('category'); // filter by category
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const gameId = url.searchParams.get('id'); // get specific game

    console.log('Query params - category:', category, 'limit:', limit, 'gameId:', gameId);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // If requesting specific game
    if (gameId) {
      const { data: game, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching game:', error);
        return new Response(
          JSON.stringify({ error: 'Game not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get play statistics for this game
      const { data: matches, error: matchError } = await supabase
        .from('matches')
        .select('id, score, result')
        .eq('game_id', gameId);

      const stats = {
        totalPlays: matches?.length || 0,
        averageScore: matches?.length 
          ? Math.round(matches.reduce((sum, m) => sum + m.score, 0) / matches.length)
          : 0,
      };

      console.log('Game fetched:', game.name, 'Stats:', stats);

      return new Response(
        JSON.stringify({
          success: true,
          game: {
            ...game,
            stats: stats,
          },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build query for multiple games
    let query = supabase
      .from('games')
      .select('*')
      .eq('is_active', true);

    // Apply category filter if provided
    if (category) {
      query = query.eq('category', category);
    }

    // Apply limit and ordering
    query = query.order('created_at', { ascending: false }).limit(limit);

    const { data: games, error } = await query;

    if (error) {
      console.error('Error fetching games:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch games' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Games fetched:', games?.length);

    // Get play count for each game
    const gamesWithStats = await Promise.all(
      (games || []).map(async (game) => {
        const { data: matches } = await supabase
          .from('matches')
          .select('id')
          .eq('game_id', game.id);

        return {
          ...game,
          playCount: matches?.length || 0,
        };
      })
    );

    // Get available categories
    const { data: categories } = await supabase
      .from('games')
      .select('category')
      .eq('is_active', true);

    const uniqueCategories = [...new Set(categories?.map(c => c.category) || [])];

    return new Response(
      JSON.stringify({
        success: true,
        games: gamesWithStats,
        meta: {
          total: gamesWithStats.length,
          categories: uniqueCategories,
          filteredBy: category || 'all',
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
