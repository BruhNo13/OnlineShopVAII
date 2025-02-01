import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET({ locals }: { locals: App.Locals }) {
    const user = locals.user;

    if (!user) {
        return json({ success: false, message: 'User not logged in.' }, { status: 401 });
    }

    try {
        const { data: favorites, error } = await supabase
            .from('Favorites')
            .select('product_id')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching favorites:', error.message);
            return json({ success: false, message: 'Failed to fetch favorites.' }, { status: 500 });
        }

        return json({ success: true, favorites: favorites.map((fav) => fav.product_id) });
    } catch (error) {
        console.error('Unexpected error:', error);
        return json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
    }
}

export async function POST({ request, locals }) {
    const user = locals.user;

    if (!user) {
        return json({ success: false, message: 'User not authenticated' }, { status: 401 });
    }

    const { productId } = await request.json();

    const { error } = await supabase
        .from('Favorites')
        .insert({ user_id: user.id, product_id: productId });

    if (error) {
        console.error('Error adding favorite:', error.message);
        return json({ success: false, message: 'Failed to add favorite' }, { status: 500 });
    }

    return json({ success: true, message: 'Favorite added successfully' });
}

export async function DELETE({ request, locals }) {
    const user = locals.user;

    if (!user) {
        return json({ success: false, message: 'User not authenticated' }, { status: 401 });
    }

    const { productId } = await request.json();

    const { error } = await supabase
        .from('Favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

    if (error) {
        console.error('Error removing favorite:', error.message);
        return json({ success: false, message: 'Failed to remove favorite' }, { status: 500 });
    }

    return json({ success: true, message: 'Favorite removed successfully' });
}
