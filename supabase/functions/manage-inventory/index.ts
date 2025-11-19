import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InventoryAction {
  action: 'buy' | 'equip' | 'unequip' | 'list';
  skinId?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Manage Inventory - Starting request');

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
    const body: InventoryAction = await req.json();
    console.log('Action:', body.action, 'SkinId:', body.skinId);

    // Handle different actions
    switch (body.action) {
      case 'list': {
        // List user's inventory
        const { data: inventory, error } = await supabase
          .from('inventory')
          .select(`
            id,
            is_equipped,
            acquired_at,
            skins:skin_id (
              id,
              name,
              description,
              image_url,
              price,
              rarity,
              category
            )
          `)
          .eq('user_id', user.id)
          .order('acquired_at', { ascending: false });

        if (error) {
          console.error('Error fetching inventory:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch inventory' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Inventory fetched:', inventory?.length, 'items');

        return new Response(
          JSON.stringify({
            success: true,
            inventory: inventory,
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'buy': {
        if (!body.skinId) {
          return new Response(
            JSON.stringify({ error: 'skinId is required for buy action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get skin info
        const { data: skin, error: skinError } = await supabase
          .from('skins')
          .select('*')
          .eq('id', body.skinId)
          .single();

        if (skinError || !skin) {
          console.error('Error fetching skin:', skinError);
          return new Response(
            JSON.stringify({ error: 'Skin not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check if user already owns it
        const { data: existing } = await supabase
          .from('inventory')
          .select('id')
          .eq('user_id', user.id)
          .eq('skin_id', body.skinId)
          .maybeSingle();

        if (existing) {
          return new Response(
            JSON.stringify({ error: 'You already own this skin' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('coins')
          .eq('id', user.id)
          .single();

        if (profileError || !profile) {
          console.error('Error fetching profile:', profileError);
          return new Response(
            JSON.stringify({ error: 'Profile not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check if user has enough coins
        if (profile.coins < skin.price) {
          return new Response(
            JSON.stringify({ 
              error: 'Insufficient coins',
              required: skin.price,
              available: profile.coins,
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Deduct coins
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ coins: profile.coins - skin.price })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating coins:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to process purchase' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Add to inventory
        const { data: newItem, error: insertError } = await supabase
          .from('inventory')
          .insert({
            user_id: user.id,
            skin_id: body.skinId,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error adding to inventory:', insertError);
          return new Response(
            JSON.stringify({ error: 'Failed to add to inventory' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Skin purchased:', skin.name);

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Skin purchased successfully',
            item: newItem,
            remainingCoins: profile.coins - skin.price,
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'equip': {
        if (!body.skinId) {
          return new Response(
            JSON.stringify({ error: 'skinId is required for equip action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check if user owns the skin
        const { data: item, error: itemError } = await supabase
          .from('inventory')
          .select('*, skins:skin_id(category)')
          .eq('user_id', user.id)
          .eq('skin_id', body.skinId)
          .single();

        if (itemError || !item) {
          console.error('Error fetching inventory item:', itemError);
          return new Response(
            JSON.stringify({ error: 'You do not own this skin' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const skinCategory = (item.skins as any).category;

        // Unequip other items in same category
        await supabase
          .from('inventory')
          .update({ is_equipped: false })
          .eq('user_id', user.id)
          .neq('skin_id', body.skinId);

        // Equip this item
        const { error: equipError } = await supabase
          .from('inventory')
          .update({ is_equipped: true })
          .eq('user_id', user.id)
          .eq('skin_id', body.skinId);

        if (equipError) {
          console.error('Error equipping skin:', equipError);
          return new Response(
            JSON.stringify({ error: 'Failed to equip skin' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Skin equipped:', body.skinId);

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Skin equipped successfully',
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'unequip': {
        if (!body.skinId) {
          return new Response(
            JSON.stringify({ error: 'skinId is required for unequip action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Unequip the item
        const { error: unequipError } = await supabase
          .from('inventory')
          .update({ is_equipped: false })
          .eq('user_id', user.id)
          .eq('skin_id', body.skinId);

        if (unequipError) {
          console.error('Error unequipping skin:', unequipError);
          return new Response(
            JSON.stringify({ error: 'Failed to unequip skin' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Skin unequipped:', body.skinId);

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Skin unequipped successfully',
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
