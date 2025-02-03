import { supabase } from '$lib/supabase';
import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
    const { user } = locals;

    if (!user) {
        return json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { data: favorites } = await supabase
        .from('Favorites')
        .select('product_id, Products(id, name, price, image, type, brand, sale)')
        .eq('user_id', user.id);

    return json(favorites || []);
}
