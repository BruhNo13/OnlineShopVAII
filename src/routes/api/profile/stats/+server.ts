import { supabase } from '$lib/supabase';
import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
    const { user } = locals;

    if (!user) {
        return json({ message: 'Unauthorized' });
    }

    const { count: favoritesCount } = await supabase
        .from('Favorites')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

    const { count: cartCount } = await supabase
        .from('Cart')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

    const { count: ordersCount } = await supabase
        .from('Orders')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

    const { count: reviewsCount } = await supabase
        .from('Reviews')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

    return json({
        favoritesCount: favoritesCount || 0,
        cartCount: cartCount || 0,
        ordersCount: ordersCount || 0,
        reviewsCount: reviewsCount || 0,
    });

}
