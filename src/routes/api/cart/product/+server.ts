import { supabase } from '$lib/supabase';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    const user = locals.user;

    if (!user) {
        return json({ success: false, message: 'User not authenticated' });
    }

    const { productId, size, quantity } = await request.json();

    if (!productId || !size || !quantity) {
        return json({ success: false, message: 'Missing required fields' });
    }

    await supabase
        .from('Cart')
        .insert({
            user_id: user.id,
            product_id: productId,
            size,
            quantity,
        });

    return json({ success: true, message: 'Product added to cart successfully' });

}
