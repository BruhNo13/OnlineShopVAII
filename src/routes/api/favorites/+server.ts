import {json} from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET({ locals }: { locals: App.Locals }) {
    const user = locals.user;

    if (!user) {
        return json({ success: false, message: 'User not logged in.' });
    }

    const { data: favorites, error } = await supabase
        .from('Favorites')
        .select('product_id')
        .eq('user_id', user.id);

    if (error) {
        // console.error('Error fetching favorites:', error.message);
        return json({ success: false, message: 'Failed to fetch favorites.' });
    }

    return json({ success: true, favorites: favorites.map((fav) => fav.product_id) });
}

export async function POST({ request, locals }) {
    const user = locals.user;

    if (!user) {
        return json({ success: false, message: 'User not authenticated' });
    }

    const { productId } = await request.json();

    await supabase
        .from('Favorites')
        .insert({ user_id: user.id, product_id: productId });

    return json({ success: true, message: 'Favorite added successfully' });
}

export async function DELETE({ request, locals }) {
    const user = locals.user;

    if (!user) {
        return json({ success: false, message: 'User not authenticated' });
    }

    const { productId } = await request.json();

    await supabase
        .from('Favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

    return json({ success: true, message: 'Favorite removed successfully' });
}